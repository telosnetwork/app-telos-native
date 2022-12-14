<template>
    <q-card style="min-width: 450px">
        <q-card-section>
            <div class="text-h6">Start Election Preparation</div>
        </q-card-section>

        <q-card-section class="q-pt-none input-row">
            <file-upload-input @update:hash="setCredentialsLink" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
            <q-btn
                flat
                label="Submit"
                @click="initElection"
                :disable="!isCredentialsLinkValid(credentialsLink)"
            />
            <q-btn flat label="Cancel" @click="close" />
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
        // dialogNameValue: {
        //   get () {
        //     return this.dialogName
        //   },
        //   set (newValue) {
        //     this.dialogName = newValue
        //   }
        // }
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
                    account: 'testtelosarb',
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

<style lang="scss" scoped></style>
