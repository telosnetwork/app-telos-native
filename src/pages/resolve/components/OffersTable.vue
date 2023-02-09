<template>
    <q-table
        :title="$t('pages.resolve.offers_table_title')"
        :rows="offers"
        :columns="columns"
        row-key="name"
        hide-bottom
    >
        <template v-slot:body-cell-status="props">
            <q-td :props="props"> {{ getOfferStatus(props.row.status) }} </q-td>
        </template>
        <template v-slot:body-cell-hourly_rate="props">
            <q-td :props="props">
                ${{ props.row.hourly_rate.replace('00 USD', '') }}
            </q-td>
        </template>
        <template v-slot:body-cell-total="props">
            <q-td :props="props">
                ${{
                    (
                        parseFloat(props.row.hourly_rate.replace('USD', '')) *
                        props.row.estimated_hours
                    ).toFixed(2)
                }}
            </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
            <q-td :props="props">
                <q-btn
                    flat
                    color="primary"
                    v-if="canAccountAcceptOffer(props.row.status)"
                    @click="
                        offer = props.row;
                        formType = 'respondoffer';
                        form = true;
                    "
                >
                    {{$t('pages.resolve.offers_table_respond')}}</q-btn
                >
            </q-td>
        </template>
    </q-table>
    <q-dialog v-model="form">
        <respond-offer-form
            v-if="formType === 'respondoffer'"
            :caseId="caseFile.case_id"
            :close="closeModal"
            :offer="offer"
        />
    </q-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import { OFFER_STATUS_LIST } from '../constants';
import RespondOfferForm from './RespondOfferForm.vue';

export default {
    props: ['caseId', 'caseFile'],
    components: {
        RespondOfferForm
    },
    data() {
        return {
            interval: null,
            offer: null,
            form: false,
            formType: null,
            columns: [
                { name: 'status', label: this.$t('pages.resolve.offers_table_status'), field: 'status' },
                {
                    name: 'estimated_hours',
                    label: this.$t('pages.resolve.offers_table_hours'),
                    field: 'estimated_hours'
                },
                {
                    name: 'arbitrator',
                    label: this.$t('pages.resolve.offers_table_arb'),
                    field: 'arbitrator'
                },
                { name: 'hourly_rate', label: this.$t('pages.resolve.offers_table_rate'), field: 'hourly_rate' },
                { name: 'total', label: this.$t('pages.resolve.offers_table_total'), field: 'total' },
                { name: 'actions', label: this.$t('pages.resolve.offers_table_actions'), field: 'actions' }
            ]
        };
    },
    methods: {
        closeModal() {
            this.form = false;
            this.formType = null;
        },
        getOfferStatus(index) {
            return this.$t(OFFER_STATUS_LIST[index]);
        },
        canAccountAcceptOffer(status) {
            if (this.account !== this.caseFile.claimant) return false;
            if (status !== 1) return false;
            return true;
        }
    },
    computed: {
        ...mapGetters({
            account: 'accounts/account',
            offers: 'resolve/offers'
        }),
        offers() {
            return this.$store.state.resolve.offers.filter(offer => {
                const isCase = offer.case_id === this.caseId;
                return isCase;
            });
        }
    }
};
</script>

<style lang="scss"></style>