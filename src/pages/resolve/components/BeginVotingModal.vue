<template>
    <q-card class="begin-voting-form">
        <q-card-section>
            <div class="text-h6">Start Voting Period</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
            <q-input
                filled
                v-model="ballot_name"
                label="Ballot ID"
                bottom-slots
                hint="12 characters a-z and 1-5"
                error-message="Must be 12 characters, a-z and / or 1-5"
                dense
                autofocus
                :error="!isBallotNameValid"
            >
                <template v-slot:prepend>
                    <q-icon
                        name="refresh"
                        @click="generateNewId"
                        class="cursor-pointer"
                    />
                </template>
            </q-input>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
            <q-btn
                flat
                label="Submit"
                @click="beginVoting"
                :disable="!isBallotNameValid"
            />
            <q-btn flat label="Cancel" @click="close" />
        </q-card-actions>
    </q-card>
</template>

<script>
import { validateId, generateRandomId } from '../util';

export default {
    props: ['form', 'close', 'onSubmit'],
    data() {
        return {
            ballot_name: generateRandomId()
        };
    },
    computed: {
        isBallotNameValid() {
            return validateId(this.ballot_name);
        }
    },
    methods: {
        generateNewId() {
            this.ballot_name = generateRandomId();
        },
        async beginVoting() {
            const beginVotingActions = [
                {
                    account: 'testtelosarb',
                    name: 'beginvoting',
                    data: {
                        ballot_name: this.ballot_name,
                        runoff: false
                    }
                }
            ];
            try {
                await this.$store.$api.signTransaction(beginVotingActions);
                this.close();
                setTimeout(this.onSubmit, 5000);
            } catch (err) {
                console.log('beginVoting error: ', err);
            }
        }
    }
};
</script>

<style lang="scss">
.begin-voting-form {
    min-width: 450px;
}
</style>