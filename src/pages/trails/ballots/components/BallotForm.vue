<script>
import { mapActions, mapGetters } from 'vuex';
import { validation } from '~/mixins/validation';
import * as IPFS from 'ipfs-core';
import BallotListItem from '~/pages/trails/ballots/components/BallotListItem';
import moment from 'moment';
import { ref } from 'vue';
import { supplyToDecimals, supplyToSymbol } from '~/utils/assets';


const TYPE_OF_BALLOT_0 = 'yes.no';
const TYPE_OF_BALLOT_1 = 'yes.no.abst';
const TYPE_OF_BALLOT_2 = 'multi.op';

export default {
    name: 'BallotForm',
    components: {
        BallotListItem,
    },
    mixins: [validation],
    props: {
        show: { type: Boolean, required: true },
    },
    emits: ['close'],
    data() {
        return {
            moment: moment,
            step: ref(1),
            isOfficial: true,
            ballotTypes: [TYPE_OF_BALLOT_0, TYPE_OF_BALLOT_1, TYPE_OF_BALLOT_2],
            isBallotListRowDirection: true,
            openForVoting: true,
            typeOfBallot: TYPE_OF_BALLOT_0,
            onlyOneOption: true,
            form: {
                newOptionLabel: '',
                newOptionValue: '',
                defaultLabels:['Yes', 'No', 'Abstain'],
                optionsLabels:['Yes', 'No'],
                optionsValues:['yes', 'no'],
                optionsError: '',
                title: '',
                category: 'poll',
                description: '',
                imageUrl: '',
                IPFSString: null,
                treasurySymbol: null,
                votingMethod: '1token1vote',
                maxOptions: 1,
                minOptions: 1,
                initialOptions: [],
                endTime: moment(new Date()).add(20, 'days').format('YYYY-MM-DD HH:mm'),
                config: 'votestake',
                file: null
            },
            prompt: false,
            userBalance: null,
            votingMethodOptions: [
                { value: '1acct1vote', label: 'One vote per account' },
                { value: '1tokennvote', label: 'All tokens to each vote' },
                { value: '1token1vote', label: 'All tokens split to each vote' },
                { value: '1tsquare1v', label: 'One token equals one square vote' },
                { value: 'quadratic', label: 'Quadratic' },
            ],
            categoryOptions: [
                { value: 'election', label: 'Election' },
                { value: 'poll', label: 'Poll' },
                { value: 'referendum', label: 'Referendum' },
            ],
            submitting: false,
            cid: null,
        };
    },
    computed: {
        ...mapGetters('trails', ['treasuries', 'userTreasury', 'ballotFees', 'ballot']),
        ...mapGetters('accounts', ['account','accountData']),
        tinyDevice() {
            return this.$q.screen.width < 600;
        },
        smallDevice() {
            return this.$q.screen.width < 800;
        },
        mediumDevice() {
            return this.$q.screen.width < 1024;
        },
        sectionClass() {
            // we need to get rid of the padding if we are in a tiny device
            return this.tinyDevice ? 'q-pa-none' : 'q-pa-md';
        },
        textClass() {
            if (this.tinyDevice) return 'text-x-small';
            if (this.smallDevice) return 'text-small';
            return '';
        },
        radioBtnVertical() {
            return this.smallDevice || this.tinyDevice;
        },
        previewVertical() {
            return this.smallDevice || this.tinyDevice;
        },
        stepperVertical() {
            // stepper turn from horizontal to vertical on small devices
            return this.mediumDevice;
        },
        maximized() {
            return this.tinyDevice;
        },
        imageHintText() {
            // if we don't have much space. Do not show this text.
            return this.maximized ?
                '' :
                'Upload an image and paste the url here to include it in your poll.';
        },
        filename() {
            if (!this.form.file) return '';
            return this.form.file.name;
        },
        optionsAsText() {
            return this.form.optionsLabels.join() + this.form.minOptions + this.form.maxOptions;
        },
        treasury() {
            if (!this.form.treasurySymbol) return null;
            return this.treasuries.find(
                (t) => t.symbol === this.form.treasurySymbol.symbol
            );
        },
        getTreasurySymbols() {
            let result = [];
            if (this.userTreasury) {
                const symbols = this.userTreasury.map((treasury) => ({
                    symbol: treasury.delegated.replace(/[^a-zA-Z]/gi, ''),
                }));
                result = this.treasuries
                    .filter((v) => {
                        return symbols.some((v2) => {
                            return v.symbol === v2.symbol && v.symbol !== 'VOTE';
                        });
                    })
                    .map(this.treasuryToOption);
            }

            if (result.length === 0) {
                result = [{
                    label: 'You are not registered to any private DAO',
                    value: null,
                    disable: true
                }];
            }

            return result;
        },
        isStakeable() {
            let selectedTreasurySettings = this.treasuries.find(
                (t) =>
                    (t.access === 'public' || t.manager === this.account) &&
          t.symbol === this.form.treasurySymbol?.symbol
            )?.settings;
            return selectedTreasurySettings
                ? selectedTreasurySettings.find((i) => i.key === 'stakeable').value
                : null;
        },
        configEnable() {
            return this.form.treasurySymbol?.symbol !== 'VOTE' && this.isStakeable;
        },
        available() {
            if (this.userBalance) {
                const ballotFee = this.onlyNumbers(this.ballotFees.value);
                return this.userBalance >= ballotFee;
            } else {
                return null;
            }
        },
        fee() {
            return this.ballotFees ? this.ballotFees.value : 0;
        },
    },
    methods: {
        ...mapActions('trails', [
            'setBallot',
            'addBallot',
            'fetchTreasuriesForUser',
            'fetchFees',
        ]),
        debug(){
        },
        // auxiliar not-implemented-yet functions
        async nextStep() {
            if (this.step >= 5) return;
            let list = {};
            switch(this.step) {
            case 1: {
                list = {title:1, description:1, img:1};
                break;
            }
            case 2: {
                list = {treasurySymbol:1};
                break;
            }
            case 3: {
                if (this.typeOfBallot === this.ballotTypes[0]) {
                    list = {op_a_1:1,op_a_2:1};
                } else if (this.typeOfBallot === this.ballotTypes[1]) {
                    list = {op_b_1:1,op_b_2:1,op_b_3:1};
                } else if (this.typeOfBallot === this.ballotTypes[2]) {
                    list = {optionsLabels:1, minimun:1, maximun:1};
                }
                break;
            }
            case 4:
                if (this.openForVoting) {
                    list = {endTime:1};
                } else {
                    list = {};
                }
                break;
            }
            this.rules.setActive(true);
            let ok = await this.validate(list);
            if (ok) {
                this.rules.setActive(false);
                this.updateBallot();
                this.$refs.stepper.next();
            } else {
                console.error('errors:');
                Object.keys(list).forEach(t => {
                    console.error('-', t, this.$refs[t].hasError);
                });
            }
        },
        validateImage(active) {
            this.rules.setActive(active);
            this.$refs.img.validate();
        },
        slugify(text) {
            return text
                .toLowerCase()
                .replace(/[^a-z12345]/gi, '')
                .substring(0,12);
        },
        createContentField() {

            // final object
            let final = {
                version: 'DCMSv2',
                optionData: {}
            };

            // Option display texts
            this.updateOptionValues().forEach((v,i) => {
                final.optionData[v] = {displayText:this.form.optionsLabels[i]};
            });

            // image
            if (this.form.imageUrl) {
                final.imageUrls = [this.form.imageUrl];
            }

            // PDF hash
            if (this.form.IPFSString) {
                final.contentUrls = [this.form.IPFSString];
            }

            let final_str = JSON.stringify(final);

            return final_str;
        },
        treasuryToOption(treasury) {
            if (!treasury) return null;
            return {
                label: treasury.title
                    ? `${treasury.title} (${treasury.supply})`
                    : treasury.supply,
                value: treasury.supply,
                symbol: treasury.supply.replace(/[^a-zA-Z]/gi, ''),
            };
        },
        setOfficialDAO() {
            let off_tr = this.treasuries.find((v) => v.symbol === 'VOTE');
            this.form.treasurySymbol = this.treasuryToOption(off_tr);
            this.form.config = 'votestake';
        },
        isNewOptionRequired(val) {
            return !this.form.newOptionRequired || !!val || this.$t('forms.errors.required');
        },
        addOption() {
            // if not newOptionLabel then alert the error and require the field to be tot empty
            this.form.newOptionRequired = this.form.newOptionLabel === '';
            if (this.form.newOptionLabel) {
                this.form.optionsLabels.push(this.form.newOptionLabel);
                this.form.newOptionLabel = '';
            } else {
                this.$refs.newOptionInput.validate();
            }
        },
        deleteOption(index) {
            this.form.optionsLabels.splice(index,1);
        },
        cleanOptions() {
            this.form.optionsLabels = [];
        },
        updateOptionValues() {
            this.form.optionsValues = this.form.optionsLabels.map( t => this.slugify(t) );
            return this.form.optionsValues;
        },
        setDefaultOptions(num) {
            this.form.optionsLabels = this.form.defaultLabels.map(t => t).filter((_,i) => i<num);
        },
        // empty functions BallotListItem, to use it as preview
        getLoser() {
            return false;
        },
        isBallotOpened(ballot) {
            if (!ballot) return false;
            return false;
        },
        getStartTime() {
            return moment(new Date()).add(1,'minutes').toDate().getTime();
        },
        async onAddBallot() {
            this.submitting = true;
            const success = await this.addBallot(this.createBallotObject());
            this.submitting = false;
            if (success) {
                let url = `/trails/ballot/${this.ballot.ballot_name}/${Date.now()}`;
                this.$emit('close');
                this.resetBallot();
                setTimeout(() => {
                    this.$router.push(url);
                }, 1000);
        
            }
        },
        async openConfirmation() {
            this.resetValidation(this.form);
            if (!(await this.validate(this.form))) return;
            this.prompt = true;
        },
        resetBallot() {
            this.form = {
                newOptionLabel: '',
                newOptionRequired: false,
                defaultLabels:['Yes', 'No', 'Abstain'],
                optionsLabels:['Yes', 'No'],
                optionsValues:['yes', 'no'],
                optionsError: '',
                title: '',
                category: 'poll',
                description: '',
                imageUrl: '',
                IPFSString: null,
                treasurySymbol: null,
                votingMethod: '1token1vote',
                maxOptions: 1,
                minOptions: 1,
                initialOptions: [],
                endTime: moment(new Date()).add(20, 'days').format('YYYY-MM-DD HH:mm'),
                config: 'votestake',
                file: null
            };
            this.rules.setActive(false);
            this.step = 1;
            this.typeOfBallot = this.ballotTypes[0];
            this.isOfficial = true;
            this.onlyOneOption = true;
            this.openForVoting = true;
            this.badImage = false;
            this.cid = null;
            this.setOfficialDAO();
     
        },
        onCancel() {
            this.$emit('close');
        },
        addBallotOption(val, done) {
            done(val.toLowerCase(), 'add-unique');
        },
        createBallotObject() {
            return {
                title: this.form.title,
                category: this.form.category,
                description:
          this.form.IPFSString && this.form.IPFSString.trim() !== ''
              ? `${this.form.description} ${this.form.IPFSString}`
              : this.form.description,
                content: this.createContentField(),
                treasurySymbol: this.form.treasurySymbol,
                votingMethod: this.form.votingMethod,
                maxOptions: this.form.maxOptions,
                minOptions: this.form.minOptions,
                initialOptions: this.updateOptionValues(),
                endTime: this.openForVoting ? this.form.endTime : new Date(),
                config: this.form.config,
                settings: this.isStakeable,
            };
        },
        updateBallot() {
            let zero_supply = this.treasury?.max_supply || '0.0000 VOTE';
            zero_supply = `${parseFloat(0).toFixed(
                supplyToDecimals(zero_supply)
            )} ${supplyToSymbol(zero_supply)}`;
            let ballot = {
                treasury: this.treasury,
                description: this.form.IPFSString && this.form.IPFSString.trim() !== ''
                    ? `${this.form.description} ${this.form.IPFSString}`
                    : this.form.description,
                content: this.createContentField(),
                publisher: this.account,
                title: this.form.title,
                category: this.form.category,
                status: this.openForVoting ? 'voting' : 'setup',
                ballot_name: this.slugify(this.form.title),
                total_voters: 0,
                options: //[{key: "yes", value:"0.0000 VOTE"},{key: "no", value:"0.0000 VOTE"}]
                    this.form.optionsLabels.map((key) => ({key, value:zero_supply})),
                total_raw_weight: zero_supply
            };
            this.setBallot(ballot);
        },
        async convertToIPFS(file) {
            try {
                const ipfs = await IPFS.create();
                this.cid = await ipfs.add(file);
            } catch (e) {
                if (e.code === 'ERR_LOCK_EXISTS') return;
                console.error(e);
            }
        },
        async updateUserBalance() {
            if (!this.accountData) return;
            this.userBalance = this.onlyNumbers(this.accountData.core_liquid_balance);
        },
    },
    watch: {
        'form.file': function () {
            this.convertToIPFS(this.form.file);
        },
        'form.endTime'() {
            try {
                this.$refs.qDateProxy1.hide();
                this.$refs.qDateProxy2.hide();
            } catch(e) {
                console.error(e);
            }
        },
        'form.imageUrl'() {
            if (this.form.imageUrl === '') {
                this.badImage = false;
            }
        },
        account: async function (account) {
            this.fetchTreasuriesForUser(account);
            this.updateUserBalance();
        },
        cid: function () {
            if (this.cid) {
                this.form.IPFSString = this.cid.path;
            } else {
                this.form.IPFSString = null;
            }
        },
        typeOfBallot() {
            switch(this.typeOfBallot) {
            case (TYPE_OF_BALLOT_0):
                this.setDefaultOptions(2);
                break;
            case (TYPE_OF_BALLOT_1):
                this.setDefaultOptions(3);
                break;
            case (TYPE_OF_BALLOT_2):
                break;
            default: // ??
                console.error('ERORR: check consistency! ', [this.typeOfBallot, this.ballotTypes]);
                break;
            }
        },
        isOfficial() {
            if (this.isOfficial) {
                this.setOfficialDAO();
            } else {
                this.form.treasurySymbol = null;
            }
        },
        optionsAsText() {
            this.rules.setActive(true);
            this.validate({optionsLabels:1, minimun:1, maximun:1});
        },
        onlyOneOption() {
            if (!this.onlyOneOption) {
                this.form.minOptions = 1;
                this.form.maxOptions = this.form.optionsLabels.length;
            } else {
                this.form.minOptions = 1;
                this.form.maxOptions = 1;
            }
        },
        openForVoting() {
            this.rules.setActive(this.openForVoting);
            this.$refs.endTime.validate();
        },
        show() {
            if (this.show) {
                this.setOfficialDAO();
                this.rules.setActive(false);
                this.fetchFees();
                this.updateUserBalance();
                this.fetchTreasuriesForUser(this.account);
            } else {
                this.resetBallot();
            }
        },
        badImage() {
            this.validateImage(this.badImage);
        }
    },
    async mounted() {
    },
};
</script>

<template lang="pug">
q-dialog(
  v-model="show"
  :maximized="maximized"
  persistent
)
  q-card.column.no-wrap.container-md(
    flat
    bordered
  )

    q-card-section.bg-primary.text-white(@click="debug")
      .text-h6 Create a poll

    q-card-section.flex-grow.column.no-wrap(
      :class="sectionClass"
    )

      q-stepper.ballot-creation.flex-grow.column.no-wrap(
        v-model="step"
        header-nav
        ref="stepper"
        color="primary"
        animated
        :vertical="stepperVertical"
      )
        q-step(
          :name="1"
          title="Ballot main info"
          icon="info"
          :done="step > 1"
        )
          q-card-section(:class="smallDevice ? 'q-px-none q-py-xs' : ''")
            q-input(
              ref="title"
              v-model="form.title"
              label="Title"
              :rules="[rules.required]"
            )
            q-input(
              ref="description"
              v-model="form.description"
              label="Description"
              type="textarea"
              :rules="[rules.required]"
            )
            q-input(
              class="q-mb-md"
              ref="img"
              v-model="form.imageUrl"
              label="Image URL"
              placeholder="https://..."
              :hint="imageHintText"
              :rules="[rules.required, (val) => !rules.isActive || !badImage || 'The image can not be load']"
            )
              template(v-slot:after v-if="form.imageUrl != ''")
                div(style="height: 50px; width: 100px;")
                  q-img(:src="form.imageUrl" @error="badImage=true" @load="badImage=false")
                    template(v-slot:error)
                      span.absolute-full.flex.flex-center.bg-negative.text-white.text-caption.q-pa-sm
                        | can not load image
            q-file(v-model="form.file" label="Upload PDF")
              template(v-slot:prepend)
                q-icon(name="attach_file")
        q-step(
          :name="2"
          title="DAO selection"
          caption="Optional"
          icon="group"
          :done="step > 2"
        )
          q-card-section(:class="smallDevice ? 'q-px-none q-py-xs' : ''")
            span
              | Select DAO
            .row.gap-sm
              q-radio(
                v-model="isOfficial"
                label="Telos community"
                :val="true"
              )
              q-radio(
                v-model="isOfficial"
                label="Custom DAO"
                :val="false"
              )
            div.q-mt-sm.column(:class="isOfficial ? '' : 'hidden'")
              p(:class="textClass")
                | By selecting the Telos Community as DAO you will allow all
                | users of our beloved community to vote in this ballot.
                | The voting power of each user will come from the TLOS staked
                | balance plus the staked TLOS in the REX system.
            div.q-mt-sm.column(:class="isOfficial ? 'hidden' : ''")
              p(:class="textClass")
                | By selecting Custom DAO, you will allow only registered users of this DAO to vote in this ballot.
                | Select the DAO from the one you are already part of or join a new ballot to create a ballot for.
              .row.items-center.gap
                q-select.col-grow(
                  ref="treasurySymbol"
                  v-model="form.treasurySymbol"
                  label="DAO"
                  :options="getTreasurySymbols"
                  :rules="[rules.required]"
                )
                q-btn.col-auto(
                  no-caps
                  color="primary"
                  label="Join new DAO"
                  to="/trails/treasuries"
                  v-if="!form.treasurySymbol"
                )
              span.q-mt-sm
                | Allow users voting using
              .row.gap-sm
                q-radio(
                  v-model="form.config"
                  label="Only stakeble tokens"
                  val="votestake"
                )
                q-radio(
                  v-model="form.config"
                  label="Only liquid tokens"
                  val="voteliquid"
                )
                q-radio(
                  v-model="form.config"
                  label="Both"
                  val="both"
                )
        q-step(
          :name="3"
          title="Voting options"
          icon="list"
          :done="step > 3"
        )
          q-card-section(:class="smallDevice ? 'q-px-none q-py-xs' : ''")
            span
              | What kind of ballot do you want?
            // :dense="radioBtnVertical"
            dev.flex.no-wrap(:class="radioBtnVertical ? 'row' : 'column'")
              div.q-mt-sm(:class="radioBtnVertical ? 'col-auto flex column no-wrap' : ''")
                q-radio.q-mr-md(
                  v-model="typeOfBallot"
                  label="Simple Yes or No"
                  :val="ballotTypes[0]"
                )
                q-radio.q-mr-md(
                  v-model="typeOfBallot"
                  label="Yes/No/Abstain"
                  :val="ballotTypes[1]"
                )
                q-radio.q-mr-md(
                  v-model="typeOfBallot"
                  label="Multiple option"
                  :val="ballotTypes[2]"
                )
              div.q-mt-sm.col(:class="textClass")
                div(:class="typeOfBallot === ballotTypes[0] ? '' : 'hidden'")
                  | Simple binary ballots only have two options to vote for.
                  | By default we use the words
                  b  Yes
                  |  and
                  b  No
                  | , but you can change them if you want.
                div(:class="typeOfBallot === ballotTypes[1] ? '' : 'hidden'")
                  | This kind of ballot is the same as the binary one but has three options to vote for.
                  | By default we use the words
                  b  Yes
                  |  ,
                  b  No
                  |  and
                  b  Abstain
                  | , but you can change them if you want.
                div(:class="typeOfBallot === ballotTypes[2] ? '' : 'hidden'")
                  | Multiple option ballots are completely configurable.
                  | You can define a list of several options to vote for, with human readability names,
                  | where voters may be allowed to check none or more than one option simultaneously in the same vote.
            div.q-mt-sm(:class="typeOfBallot === ballotTypes[0] ? '' : 'hidden'")
              // Simple yes or No
              .q-mt-sm.flex(:class="previewVertical ? 'column' : 'raw gap'")
                q-input.col-grow(
                  ref="op_a_1"
                  v-model="form.optionsLabels[0]"
                  label="option 1"
                  :rules="[rules.required]"
                )
                q-input.col-grow(
                  ref="op_a_2"
                  v-model="form.optionsLabels[1]"
                  label="option 2"
                  :rules="[rules.required]"
                )
            div.q-mt-sm(:class="typeOfBallot === ballotTypes[1] ? '' : 'hidden'")
              // Yes, No or Abstain
              .q-mt-sm.flex(:class="previewVertical ? 'column' : 'raw gap'")
                q-input.col-grow(
                  dense
                  ref="op_b_1"
                  v-model="form.optionsLabels[0]"
                  label="option 1"
                  :rules="[rules.required]"
                )
                q-input.col-grow(
                  dense
                  ref="op_b_2"
                  v-model="form.optionsLabels[1]"
                  label="option 2"
                  :rules="[rules.required]"
                )
                q-input.col-grow(
                  dense
                  ref="op_b_3"
                  v-model="form.optionsLabels[2]"
                  label="option 3"
                  :rules="[rules.required]"
                )
            div.q-mt-sm(:class="typeOfBallot === ballotTypes[2] ? '' : 'hidden'")
              // Multiple option
              .q-mt-sm.flex(:class="previewVertical ? 'column' : 'raw gap'")
                .col.flex.column.options-left
                  .flex.row.items-center.gap.options-left__header
                    q-input.col-grow(
                      ref="newOptionInput"
                      v-model="form.newOptionLabel"
                      label="new option"
                      dense bottom-slots
                      :rules="[isNewOptionRequired]"
                      @update:model-value="rules.setActive(false)"
                    )
                      template(v-slot:append)
                        q-btn(
                          no-caps
                          color="primary"
                          icon="add"
                          :label="tinyDevice ? '' : 'add'"
                          :size="tinyDevice ? 'sm' : 'md'"
                          @click="addOption()"
                        )
                  .flex.column.options-left__options-list(
                    :class="smallDevice ? 'q-px-md q-py-xs' : 'q-pa-md'"
                  )
                    .flex.row.items-center.options-left__option(v-for="(coso,index) in form.optionsLabels")
                      q-input.col-grow.options-left__option-label(
                        dense
                        bottom-slots
                        hide-bottom-space
                        :class="tinyDevice ? 'q-mt-sm' : 'q-mt-md'"
                        v-model="form.optionsLabels[index]"
                        @update:model-value="rules.setActive(false)"
                      )
                        template(v-slot:append)
                          q-icon.cursor-pointer(name="close" @click="deleteOption(index)")
                    q-select.q-mt-md.options-labels(
                      dense
                      readonly
                      hide-dropdown-icon
                      standout
                      ref="optionsLabels"
                      v-model="form.optionsLabels"
                      multiple
                      :rules="[rules.minimumOptions(2), rules.arrayWithUniqueItems]"
                    )
                      template(v-slot:prepend)
                        .text-body2.text-weight-bolder options:
                  .flex.row.justify-end.gap-sm.no-wrap(v-if="smallDevice")
                    div.flex-grow
                    div.no-wrap.flex.gap-sm.q-px-md
                      q-btn(no-caps color="primary" icon="list" :label="'Default'" @click="setDefaultOptions(3)")
                      q-btn(no-caps color="primary" icon="delete_sweep" :label="'Clean'" @click="cleanOptions()")
                  .flex.row.justify-end.gap-sm.no-wrap(:class="smallDevice ? 'q-mt-md' : ''")
                    q-checkbox(v-model="onlyOneOption" v-if="onlyOneOption") Voters can only choose one option
                    div.flex-grow
                    div.no-wrap.flex.gap-sm(v-if="!smallDevice")
                      q-btn(no-caps color="primary" icon="list" :label="'Default'" @click="setDefaultOptions(3)")
                      q-btn(no-caps color="primary" icon="delete_sweep" :label="'Clean'" @click="cleanOptions()")
                .col.flex.column.options-right(v-if="!onlyOneOption")
                  q-checkbox(v-model="onlyOneOption") Voters can only choose one option
                  div.q-mt-sm(:class="textClass")
                    | You are allowing voters to check several options (or none) in the
                    | same vote. Now you should set the maximum and minimum.
                    br
                    | For example, if you need to select two members from five options,
                    | your max and min should both equal 2.
                    | However, if you want to know what colors people like from a list,
                    | you will put the min at one and the max high enough to select them all.
                  .flex.row.no-wrap.q-mt-sm.options-right__howmany
                    q-input.col.options-right__howmany-min(ref="minimun" v-model="form.minOptions" label="minimun"
                      :rules="[rules.required, rules.integer, rules.isNatural, rules.lowerOrEqualThan(form.maxOptions)]"
                    )
                    q-input.col.options-right__howmany-max(ref="maximun" v-model="form.maxOptions" label="maximun"
                      :rules="[rules.required, rules.integer, rules.positiveInteger,\
                        rules.greaterOrEqualThan(form.minOptions), rules.lowerOrEqualThan(form.optionsLabels.length)]"
                    )
        q-step(
          :name="4"
          title="Open Voting"
          icon="how_to_vote"
          :done="step > 4"
        )
          q-card-section(:class="smallDevice ? 'q-px-none q-py-xs' : ''")
            p(:class="textClass")
              | You can open this ballot for voting right away or you
              | can create the ballot and skip this step for later.
            q-checkbox(v-model="openForVoting" disable) Open for voting right away
            q-input(
              ref="endTime"
              v-model="form.endTime"
              label="End date"
              :disable="!openForVoting"
              :rules="[rules.required, rules.dateFuture(Date.now())]"
            )
              template(v-slot:append)
                q-icon.cursor-pointer(name="event" color="primary")
                  q-popup-proxy(
                    ref="qDateProxy1"
                    anchor="bottom left"
                    self="top right"
                    transition-show="scale"
                    transition-hide="scale"
                  )
                    q-date(
                      v-model="form.endTime"
                      mask="YYYY-MM-DD HH:mm"
                    )
                q-icon.cursor-pointer(name="access_time" color="primary")
                  q-popup-proxy(
                    ref="qDateProxy2"
                    anchor="bottom left"
                    self="top right"
                    transition-show="scale"
                    transition-hide="scale"
                  )
                    q-time(
                      v-model="form.endTime"
                      mask="YYYY-MM-DD HH:mm"
                    )
            small Note: Proposals will be eligible for voting once they are created.
        q-step(
          :name="5"
          title="Create Ballot"
          icon="check"
        )
          q-card-section(:class="smallDevice ? 'q-px-none q-py-xs' : ''")
            .q-mt-sm.flex.gap(:class="previewVertical ? 'column' : 'raw'")
              .col-auto.flex.column.preview-left.row-direction(v-if="!previewVertical")
                ballot-list-item(
                  :ballot="ballot"
                  :displayWinner="false"
                  :isBallotOpened="false"
                  :startTimeHasPassed="false"
                  :getStartTime="getStartTime()"
                  :getEndTime="form.endTime"
                  :getLoser="false"
                )
              .col.flex.column.preview-right
                .q-mt-sm
                  b title:
                  br
                  span {{form.title}}
                .q-mt-sm
                  b description:
                  br
                  span {{form.description}}
                .q-mt-sm
                  b PDF:&nbsp;
                  span(v-if="form.file") {{filename}}
                  span(v-else) No pdf was attached
                .q-mt-sm
                  b DAO:&nbsp;
                  span {{form.treasurySymbol.label}}
                .q-mt-sm
                  .flex.row.gap
                    .col.flex.column
                      b options:
                      ul.q-mt-xs
                        li(v-for="(option,index) in form.optionsLabels") {{option}}
                    .col.flex.column
                      b method:
                      span(v-if="onlyOneOption") Voters only can choose one option
                      span(v-else) Voters can choose from {{form.minOptions}} to {{form.maxOptions}} options
                .q-mt-sm
                  b open:&nbsp;
                  span(v-if="openForVoting")
                    | this ballot will be open from now until {{moment(form.endTime).format("MMMM Do YYYY")}}
                  span(v-else) this ballot will not open immediately and must be oppened manually in the future
        template(v-slot:navigation)
          q-stepper-navigation.flex
            q-btn.q-ml-sm(color="primary" label="Cancel"   flat @click="onCancel()")
            .col-grow
            q-btn.q-ml-sm(color="primary" label="Back"     flat v-if="step > 1" @click="$refs.stepper.previous()")
            q-btn.q-ml-sm(color="primary" label="Continue" v-if="step !== 5" @click="nextStep()")
            q-btn.q-ml-sm(color="primary" label="Finish"   v-if="step === 5" @click="onAddBallot()")

</template>
<style lang="sass">
.q-field--standout.q-field--highlighted .q-field__control
  background: #{$negative} !important
.q-stepper.ballot-creation
  min-height:80vh
.q-stepper--horizontal
  display: flex
  flex-direction: column
.q-stepper__nav
  flex-grow: 1
  align-items: end
.q-stepper--vertical .q-stepper__tab
  padding: 12px 24px 12px 12px
.q-stepper--vertical .q-stepper__step-inner
  padding: 0 24px 32px 48px
</style>