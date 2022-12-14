<template>
    <q-card class="nominate-self-form">
        <q-card-section>
            <div class="text-h6">Nominate Self ({{ account_name }})</div>
        </q-card-section>

        <q-card-section class="q-pt-none input-row">
            <file-upload-input @update:hash="setCredentialsLink" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
            <q-btn
                flat
                label="Submit"
                @click="nominateSelf"
                :disable="!isCredentialsLinkValid"
            />
            <q-btn flat label="Cancel" @click="close" />
        </q-card-actions>
    </q-card>
</template>

<script>
import { validateIpfsHash } from '../util';
import FileUploadInput from './FileUploadInput.vue';

export default {
    props: ['close', 'onSubmit'],
    components: {
        FileUploadInput
    },
    data() {
        return {
            credentialsLink: ''
        };
    },
    computed: {
        isCredentialsLinkValid() {
            return validateIpfsHash(this.credentialsLink);
        },
        account_name() {
            return this.$store.state.accounts.account;
        }
    },
    methods: {
        setCredentialsLink(link) {
            this.credentialsLink = link;
        },
        async nominateSelf() {
            const nominateSelfActions = [
                {
                    account: 'testtelosarb',
                    name: 'regarb',
                    data: {
                        credentials_link: this.credentialsLink,
                        nominee: this.account_name
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(nominateSelfActions);
                this.close();
                setTimeout(this.onSubmit, 5000);
            } catch (err) {
                console.log('nominateSelf error: ', err);
            }
        }
    }
};
</script>

<style lang="scss">
.nominate-self-form {
    min-width: 450px;
}
</style>
