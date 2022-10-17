<script>
import { mapActions, mapGetters } from "vuex";
import { validation } from "~/mixins/validation";
import * as IPFS from "ipfs-core";
import BallotListItem from "~/pages/trails/ballots/components/BallotListItem";
import moment from "moment";
import { ref } from 'vue'

const TYPE_OF_BALLOT_0 = "yes.no";
const TYPE_OF_BALLOT_1 = "yes.no.abst";
const TYPE_OF_BALLOT_2 = "multi.op";

export default {
  name: "BallotForm",
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
      typeOfBallot: TYPE_OF_BALLOT_0,
      ballotTypes: [TYPE_OF_BALLOT_0, TYPE_OF_BALLOT_1, TYPE_OF_BALLOT_2],
      isBallotListRowDirection: true,
      form: {
        openForVoting: true,
        onlyOneOption: true,
        newOptionLabel: "",
        newOptionValue: "",
        defaultLabels:["Yes", "No", "Abstain"],
        optionsLabels:["Yes", "No", "Abstain"],
        optionsValues:["yes", "no", "abstain"],
        title: null,
        category: 'poll',
        description: null,
        imageUrl: null,
        IPFSString: null,
        treasurySymbol: null,
        votingMethod: "1token1vote",
        maxOptions: 3,
        minOptions: 1,
        initialOptions: [],
        endDate: null,
        config: 'votestake',
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
      file: null,
      cid: null,
    };
  },
  computed: {
    ...mapGetters("trails", ["treasuries", "userTreasury", "ballotFees"]),
    ...mapGetters("accounts", ["account","accountData"]),
    ballot() {
      return {
        treasury: {
          title: "Telos Governance Token",
          icon: "https://raw.githubusercontent.com/telosnetwork/images/master/chain_icons/telos-logo-light.svg",
        },
        content : JSON.stringify({
          "imageUrl":"https://www.foodnewslatam.com/images/stories/2022/AGOSTO/Coca-Cola_planea_seguir_reduciendo_el_azu%CC%81car_en_sus_bebidas.png"
        }),
        publisher: "publisher",
        description:"Esta es la descripción del Ballot QmSAVK6dorHMfxk3sGRjHWVfxDkazUtfXifxvvYBDs3bvL",
        title: "Ballot Title",
        category: 'poll',
        status: 'new',
        ballot_name: 'ballotname',
        total_voters: 0,
        options: [{key: "yes", value:"0.0000 VOTE"},{key: "no", value:"0.0000 VOTE"}],
        total_raw_weight: "0.0000 VOTE"
      }
    },
    getTreasurySymbols() {
      if (this.userTreasury) {
        const symbols = this.userTreasury.map((treasury) => ({
          symbol: treasury.delegated.replace(/[^a-zA-Z]/gi, ''),
        }));
        return this.treasuries
          .filter((v) => {
            return symbols.some((v2) => {
              return v.symbol === v2.symbol;
            });
          })
          .map((treasury) => ({
            label: treasury.title
              ? `${treasury.title} (${treasury.supply})`
              : treasury.supply,
            value: treasury.supply,
            symbol: treasury.supply.replace(/[^a-zA-Z]/gi, ''),
          }));
      } else {
        return null;
      }
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
      'addBallot',
      'fetchTreasuriesForUser',
      'fetchFees',
    ]),
    // auxiliar not-implemented-yet functions
    addOption() {
      // TODO: implement this function
      console.log("addOption() implement me !!");
    },
    deleteOption(index) {
      // TODO: implement this function
      console.log("deleteOption() implement me !!", index);
    },
    cleanOptions(index) {
      // TODO: implement this function
      console.log("cleanOptions() implement me !!", index);
    },
    // empty functions BallotListItem, to use it as preview
    displayWinner(ballot) {
      if (!ballot) return false;
      return false;
    },
    getLoser() {
      return false;
    },
    isBallotOpened(ballot) {
      if (!ballot) return false;
      return false;
    },
    votingHasBegun(ballot) {
      if (!ballot) return false;
      return false;
    },
    getStartTime(ballot) {
      if (!ballot) return new Date();
      return new Date();
    },
    getEndTime(ballot) {
      if (!ballot) return new Date();
      return new Date();
    },
    ballotContentImg(ballot) {
      // TODO: refactor needed. This function is copied from BallotsList.vue
      try {
        return JSON.parse(ballot.content).imageUrl;
      } catch (error) {
        return null;
      }
    },
    async onAddBallot() {
      this.submitting = true;
      const success = await this.addBallot(this.createBallotObject());
      this.submitting = false;
      if (success) {
        this.$emit('update:show', false);
        this.resetBallot();
      }
    },
    async openConfirmation() {
      this.resetValidation(this.form);
      if (!(await this.validate(this.form))) return;
      this.prompt = true;
    },
    resetBallot() {
      this.form = {
        title: null,
        category: null,
        description: null,
        imageUrl: null,
        treasurySymbol: null,
        votingMethod: '1token1vote',
        initialOptions: [],
        endDate: null,
        IPFSString: null,
      };
      this.file = null;
      this.cid = null;
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
        content: this.form.imageUrl
          ? `{\"imageUrl\":\"${this.form.imageUrl}\"}`
          : '',
        treasurySymbol: this.form.treasurySymbol,
        votingMethod: this.form.votingMethod,
        maxOptions: this.form.maxOptions,
        minOptions: this.form.minOptions,
        initialOptions: this.form.initialOptions,
        endDate: this.form.endDate,
        config: this.form.config,
        settings: this.isStakeable,
      };
    },
    async convertToIPFS(file) {
      try {
        const ipfs = await IPFS.create();
        this.cid = await ipfs.add(file);
      } catch (e) {
        if (e.code == 'ERR_LOCK_EXISTS') return;
        console.error(e);
      }
    },
    async updateUserBalance() {
      if (!this.accountData) return;
      this.userBalance = this.onlyNumbers(this.accountData.core_liquid_balance);
    },
  },
  watch: {
    file: function () {
      this.convertToIPFS(this.file);
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
      console.log("typeOfBallot--");
      switch(this.typeOfBallot) {
        case (TYPE_OF_BALLOT_0): 
          break;
        case (TYPE_OF_BALLOT_1): 
          break;
        case (TYPE_OF_BALLOT_2): 
          break;
        default: // ??
          console.error("ERORR: check consistency! ", [this.typeOfBallot, this.ballotTypes]);
          break;
      }      
    }
  },
  mounted() {
    this.fetchFees();
    this.updateUserBalance();
    this.fetchTreasuriesForUser(this.account);
  },
};
</script>

<template lang="pug">
q-dialog(
  v-model="show"
  persistent
)
  q-card.container-md(
    flat
    bordered
  )

    q-card-section.bg-primary.text-white
      .text-h6 Create a ballot

    q-card-section

      q-stepper(
        v-model="step"
        header-nav
        ref="stepper"
        color="primary"
        animated
        style="min-height:80vh"
      )
        q-step(
          :name="1"
          title="Ballot main info"
          icon="info"
          :done="step > 1"
        )
          q-card-section
            q-input(
              ref="title"
              v-model="form.title"
              label="Title"
            )
            // :rules="[rules.required]"
            q-input(
              ref="description"
              v-model="form.description"
              label="Description"
              type="textarea"
            )
            // :rules="[rules.required]"
            q-input(
              class="q-mb-md"
              ref="img"
              v-model="form.imageUrl"
              label="Image URL"
              placeholder="https://..."
              hint="Upload an image and paste the url here to include it in your ballot."
            )
            // :rules="[rules.required]"
            q-file(v-model="file" label="Upload PDF")
              template(v-slot:prepend)
                q-icon(name="attach_file")
        q-step(
          :name="2"
          title="DAO selection"
          caption="Optional"
          icon="group"
          :done="step > 2"
        )
          q-card-section
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
              p
                | By selecting the Telos Community as DAO you will allow all users of our beloved community to vote in this ballot.
                | The voting power of each user will come from the TLOS staked balance plus the staked TLOS in the REX system.
            div.q-mt-sm.column(:class="isOfficial ? 'hidden' : ''")
              p
                | By selecting Custom DAO, you will allow only registered users of this DAO to vote in this ballot.
                | Select the DAO from the one you are already part of or join a new ballot to create a ballot for.
              .row.items-center.gap
                q-select.col-grow(
                  ref="treasurySymbol"
                  v-model="form.treasurySymbol"
                  label="Treasury"
                  :options="getTreasurySymbols"
                  :rules="[rules.required]"
                )
                q-btn.col-auto(
                  no-caps
                  color="primary"
                  label="Join new DAO"
                  to="/trails/treasuries"
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
          q-card-section
            span
              | What kind of ballot do you want?
            .row.gap-sm
              q-radio(
                v-model="typeOfBallot"
                label="Simple Yes or No"
                :val="ballotTypes[0]"
              )
              q-radio(
                v-model="typeOfBallot"
                label="Yes/No/Abstain"
                :val="ballotTypes[1]"
              )
              q-radio(
                v-model="typeOfBallot"
                label="Multiple option"
                :val="ballotTypes[2]"
              )
            div(:class="typeOfBallot == ballotTypes[0] ? '' : 'hidden'")
              | Simple binary ballots only have two options to vote for.
              | By default we use the words
              b  Yes
              |  and
              b  No
              | , but you can change them if you want.
              .q-mt-sm.raw.flex.gap
                q-input.col-grow(
                  v-model="form.defaultLabels[0]"
                  label="option 1"
                )
                q-input.col-grow(
                  v-model="form.defaultLabels[1]"
                  label="option 2"
                )
            div(:class="typeOfBallot == ballotTypes[1] ? '' : 'hidden'")
              | This kind of ballot is the same as the binary one but has three options to vote for.
              | By default we use the words
              b  Yes
              |  ,
              b  No
              |  and
              b  Abstain
              | , but you can change them if you want.
              .q-mt-sm.raw.flex.gap
                q-input.col-grow(
                  v-model="form.defaultLabels[0]"
                  label="option 1"
                )
                q-input.col-grow(
                  v-model="form.defaultLabels[1]"
                  label="option 2"
                )
                q-input.col-grow(
                  v-model="form.defaultLabels[2]"
                  label="option 3"
                )
            div(:class="typeOfBallot == ballotTypes[2] ? '' : 'hidden'")
              | Multiple option ballots are completely configurable.
              | You can define a list of several options to vote for, with human readability names,
              | where voters may be allowed to check none or more than one option simultaneously in the same vote.
              .q-mt-sm.flex.row.gap
                .col.flex.column.options-left
                  .flex.row.items-center.gap.options-left__header
                    q-input.col-grow( v-model="form.newOptionLabel" label="new option" bottom-slots )
                      template(v-slot:append)
                        q-btn(no-caps color="primary" icon="add" label="add" @click="addOption()")
                  .flex.column.q-pa-md.options-left__options-list
                    .flex.row.items-center.options-left__option(v-for="(coso,index) in form.optionsLabels")
                      q-input.col-grow.options-left__option-label(:dense="true" bottom-slots v-model="form.optionsLabels[index]" )
                        template(v-slot:append)
                          q-icon.cursor-pointer(name="close" @click="deleteOption(index)")
                  .flex.row.justify-between
                    q-checkbox(v-model="form.onlyOneOption" v-if="form.onlyOneOption") Voters can only choose one option
                    div
                    q-btn(no-caps color="primary" icon="delete_sweep" label="Clean" @click="cleanOptions()")
                .col.flex.column.options-right(v-if="!form.onlyOneOption")
                  q-checkbox(v-model="form.onlyOneOption") Voters can only choose one option
                  div.q-mt-sm
                    | You are allowing voters to check several options (or none) in the same vote. Now you should set the maximum and minimum.
                    br
                    | For example, if you need to select two members from five options, your max and min should both equal 2.
                    | However, if you want to know what colors people like from a list, you will put the min at zero and the max high enough to select them all.
                  .flex.row.q-mt-sm.options-right__howmany
                    q-input.col-auto.options-right__howmany-min( v-model="form.minOptions" label="minimun" )
                    q-input.col-auto.options-right__howmany-max( v-model="form.maxOptions" label="maximun" )
        q-step(
          :name="4"
          title="Open Voting"
          icon="how_to_vote"
          :done="step > 4"
        )      
          p You can open this ballot for voting right away or you can create the ballot and skip this step for later.
          q-checkbox(v-model="form.openForVoting") Open for voting right away
          q-input(
            ref="endDate"
            v-model="form.endDate"
            label="End date"
            :disable="!form.openForVoting"
          )
            // :rules="[rules.required, rules.dateFuture(Date.now())]"
            template(v-slot:append)
              q-icon.cursor-pointer(name="event" color="primary")
                q-popup-proxy(ref="qDateProxy" anchor="bottom left" self="top right" transition-show="scale" transition-hide="scale")
                  q-date(
                    v-model="form.endDate"
                    @input="() => $refs.qDateProxy.hide()"
                    mask="YYYY-MM-DD HH:mm"
                  )
              q-icon.cursor-pointer(name="access_time" color="primary")
                q-popup-proxy(ref="qDateProxy" anchor="bottom left" self="top right" transition-show="scale" transition-hide="scale")
                  q-time(
                    v-model="form.endDate"
                    @input="() => $refs.qDateProxy.hide()"
                    mask="YYYY-MM-DD HH:mm"
                  )
        q-step(
          :name="5"
          title="Create Ballot"
          icon="check"
        )      
          .q-mt-sm.flex.row.gap
            .col.flex.column.preview-left(:class="isBallotListRowDirection ? 'row-direction' : 'column-direction'")
              ballot-list-item(
                :ballot="ballot"
                :displayWinner="displayWinner"
                :isBallotOpened="false"
                :votingHasBegun="false"
                :getStartTime="getStartTime()"
                :getEndTime="getEndTime()"
                :getLoser="getLoser"
                :ballotContentImg="ballotContentImg"
              )
            .col.flex.column.preview-right
              .q-mt-sm
                b title:
                br
                span Título del propsal
              .q-mt-sm
                b description:
                br
                span Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              .q-mt-sm
                b DAO:&nbsp;
                span Telos Governance Token
              .q-mt-sm
                b options:
                br
                ul.q-mt-xs
                  li Yes
                  li No
                  li Abstain
                span Voters only can choose one option
              .q-mt-sm
                b open:&nbsp;
                span this ballot will be open from now until {{moment(getEndTime()).format("MMMM Do YYYY")}}
        template(v-slot:navigation)
          q-stepper-navigation.flex
            q-btn.q-ml-sm(color="primary" label="Back"     flat v-if="step > 1" @click="$refs.stepper.previous()")
            .col-grow
            q-btn.q-ml-sm(color="primary" label="Cancel"   flat @click="onCancel()")
            q-btn.q-ml-sm(color="primary" label="Continue" v-if="step !== 5" @click="$refs.stepper.next()")
            q-btn.q-ml-sm(color="primary" label="Finish"   v-if="step === 5" @click="onAddBallot()")






//
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
        hint="Upload an image and paste the url here to include it in your ballot."
        :rules="[rules.required]"
      )
      q-file(v-model="file" label="Upload PDF")
        template(v-slot:prepend)
          q-icon(name="attach_file")
      .row
        q-radio(
          v-model="form.config"
          label="Simple Yes or No"
          val="votestake"
          hint="A simple ballot with only two options to vote for. By default, the words 'Yes' and 'No' are used but you can change them."
        )
        q-radio(
          v-model="form.config"
          label="Yes/No/Abstain"
          val="asddd"
        )
        q-radio(
          v-model="form.config"
          label="Multiple option"
          val="voteliquid"
        )
      .row A simple ballot with only two options to vote for. By default, the words 'Yes' and 'No' are used but you can change them.
        
      q-input(
        ref="endDate"
        v-model="form.endDate"
        label="End date"
        :rules="[rules.required, rules.dateFuture(Date.now())]"
      )
        template(v-slot:append)
          q-icon.cursor-pointer(name="event")
            q-popup-proxy(ref="qDateProxy" transition-show="scale" transition-hide="scale")
              q-date(
                v-model="form.endDate"
                @input="() => $refs.qDateProxy.hide()"
                mask="YYYY-MM-DD HH:mm"
              )
          q-icon.cursor-pointer(name="access_time")
            q-popup-proxy(ref="qDateProxy" transition-show="scale" transition-hide="scale")
              q-time(
                v-model="form.endDate"
                @input="() => $refs.qDateProxy.hide()"
                mask="YYYY-MM-DD HH:mm"
              )
    q-card-actions(align="right")
      q-btn(
        flat
        :label="$t('common.buttons.cancel')"
        @click="onCancel()"
      )
      q-btn(
        color="primary"
        :label="$t('common.buttons.create')"
        :loading="submitting"
        @click="openConfirmation()"
      )
    q-dialog(
      v-model="prompt"
      persistent
    )
      q-card(
        style="min-width: 350px"
      )
        q-card-section.row.items-center
          span.q-ml-sm(
            v-if="available"
          ) There will be a {{fee}} fee for creating a ballot.
          span.q-ml-sm(
            v-else
          ) {{ "Insufficient balance to create a ballot." }}
        q-card-actions.text-primary(
          align="right"
        )
          q-btn(
            flat
            label="Cancel"
            v-close-popup
          )
          q-btn(
            v-if="available"
            flat
            label="Accept"
            v-close-popup
            @click="onAddBallot()"
          )


    q-card-section.bg-primary.text-white
      .text-h6 Create a ballot

    q-card-section
      q-input(
        ref="title"
        v-model="form.title"
        label="Title"
        :rules="[rules.required]"
      )
      q-select(
        ref="category"
        v-model="form.category"
        label="Category"
        :options="categoryOptions"
        emit-value
        map-options
        :rules="[rules.required]"
      )
      q-select(
        ref="votingMethod"
        v-model="form.votingMethod"
        label="Voting method"
        :options="votingMethodOptions"
        emit-value
        map-options
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
        hint="Upload an image and paste the url here to include it in your ballot."
        :rules="[rules.required]"
      )
      q-file(v-model="file" label="Upload PDF")
        template(v-slot:prepend)
          q-icon(name="attach_file")
      q-select(
        ref="treasurySymbol"
        v-model="form.treasurySymbol"
        label="Treasury"
        :options="getTreasurySymbols"
        :rules="[rules.required]"
      )
      q-select(
        ref="initialOptions"
        v-model="form.initialOptions"
        label="Options"
        use-input
        use-chips
        multiple
        hide-dropdown-icon
        input-debounce="0"
        @new-value="addBallotOption"
        :rules="[rules.required, rules.minimumOptions(2)]"
      )
      .row
        q-input.col-6(
          type="number"
          ref="minOptions"
          v-model="form.minOptions"
          label="Min options"
          :rules="[rules.required, rules.integer, rules.positiveInteger]"
        )
        q-input.col-6(
          type="number"
          ref="maxOptions"
          v-model="form.maxOptions"
          label="Max options"
          :rules="[rules.required, rules.integer, rules.positiveInteger, rules.greaterOrEqualThan(form.minOptions), rules.greaterOrEqualThan(2)]"
        )
      .row(
        v-if="configEnable"
      )
        q-radio(
          v-model="form.config"
          label="Stakeble"
          val="votestake"
        )
        q-radio(
          v-model="form.config"
          label="Liquid"
          val="voteliquid"
        )
        q-radio(
        v-model="form.config"
        label="Both"
        val="both"
        )
      q-input(
        ref="endDate"
        v-model="form.endDate"
        label="End date"
        :rules="[rules.required, rules.dateFuture(Date.now())]"
      )
        template(v-slot:append)
          q-icon.cursor-pointer(name="event")
            q-popup-proxy(ref="qDateProxy" transition-show="scale" transition-hide="scale")
              q-date(
                v-model="form.endDate"
                @input="() => $refs.qDateProxy.hide()"
                mask="YYYY-MM-DD HH:mm"
              )
          q-icon.cursor-pointer(name="access_time")
            q-popup-proxy(ref="qDateProxy" transition-show="scale" transition-hide="scale")
              q-time(
                v-model="form.endDate"
                @input="() => $refs.qDateProxy.hide()"
                mask="YYYY-MM-DD HH:mm"
              )
    q-card-actions(align="right")
      q-btn(
        flat
        :label="$t('common.buttons.cancel')"
        @click="onCancel()"
      )
      q-btn(
        color="primary"
        :label="$t('common.buttons.create')"
        :loading="submitting"
        @click="openConfirmation()"
      )
    q-dialog(
      v-model="prompt"
      persistent
    )
      q-card(
        style="min-width: 350px"
      )
        q-card-section.row.items-center
          span.q-ml-sm(
            v-if="available"
          ) There will be a {{fee}} fee for creating a ballot.
          span.q-ml-sm(
            v-else
          ) {{ "Insufficient balance to create a ballot." }}
        q-card-actions.text-primary(
          align="right"
        )
          q-btn(
            flat
            label="Cancel"
            v-close-popup
          )
          q-btn(
            v-if="available"
            flat
            label="Accept"
            v-close-popup
            @click="onAddBallot()"
          )
</template>
<style scoped lang="sass">
.q-stepper--horizontal
  display: flex
  flex-direction: column
.q-stepper__nav
  flex-grow: 1
  align-items: end

</style>

