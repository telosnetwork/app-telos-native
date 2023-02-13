<template>
    <q-card id="init-election-form">
        <q-card-section>
            <div class="text-h6">{{$t('pages.resolve.init_election_heading')}}</div>
        </q-card-section>

        <q-card-section class="q-pt-none input-row">
            <file-upload-input @update:hash="setCredentialsLink" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
            <q-btn
                flat
                :label="$t('pages.resolve.init_election_submit')"
                @click="initElection"
                :disable="!isCredentialsLinkValid(credentialsLink)"
            />
            <q-btn flat :label="$t('pages.resolve.init_election_cancel')" @click="close" />
        </q-card-actions>
    </q-card>
</template>

<script>
import { mapGetters } from 'vuex';
import { validateIpfsHash } from '../util';
import FileUploadInput from './FileUploadInput.vue';

export default {
    props: ['close', 'onSubmit'],
    data() {
        return {
            credentialsLink: ''
        };
    },
    components: {
        FileUploadInput
    },
    computed: {
        ...mapGetters({
            account: 'accounts/account'
        }),
        account_name() {
            return this.$store.state.accounts.account;
        }
    },
    methods: {
        setCredentialsLink(link) {
            this.credentialsLink = link;
        },
        isCredentialsLinkValid(value) {
            const isValid = validateIpfsHash(value);
            return isValid;
        },
        async initElection() {
            const initElectionActions = [
                {
                    account: process.env.ARB_CONTRACT,
                    name: 'initelection',
                    data: {
                        content: this.credentialsLink
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(initElectionActions);
                this.close();
                setTimeout(this.onSubmit, 5000);
            } catch (err) {
                console.log('initElection error: ', err);
            }
        }
    }
};
</script>

<style lang="scss">
#init-election-form {
    min-width: 450px;
}
</style>