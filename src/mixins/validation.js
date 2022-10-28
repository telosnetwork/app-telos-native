import { mapActions } from 'vuex';
const regex = new RegExp(/Qm[1-9A-HJ-NP-Za-km-z]{44}(\/.*)?/, 'm'); // ipfs hash detection, detects CIDv0 46 character strings starting with 'Qm'

export const validation = {
    data () {
        let off = false;
        return {
            rules: {
                setActive: active => off = !active,
                isActive: () => !off,
                accountExists: async account =>
                    off ||
          !(await this.isAccountFree(account.toLowerCase())) ||
          this.$t('forms.errors.accountNotExists', { account }),
                accountFormat: val =>
                    off ||
          /^([a-z]|[1-5]|.){1,12}$/.test(val.toLowerCase()) ||
          this.$t('forms.errors.accountFormat'),
                accountFormatBasic: val =>
                    off ||
          /^([a-z]|[1-5]){12}$/.test(val.toLowerCase()) ||
          this.$t('forms.errors.accountFormatBasic'),
                accountLength: val =>
                    off ||
          val.length <= 12 ||
          this.$t('forms.errors.accountLength'),
                dateFuture: date =>
                    val =>
                        off ||
          new Date(val).getTime() >= new Date(date).getTime() ||
          this.$t('forms.errors.dateFuture'),
                greaterOrEqualThan: value =>
                    val =>
                        off ||
          val >= value ||
          this.$t('forms.errors.greaterOrEqualThan', { value }),
                lowerOrEqualThan: value =>
                    val =>
                        off ||
          val <= value ||
          this.$t('forms.errors.lowerOrEqualThan', { value }),
                minimumOptions: value =>
                    val =>
                        off ||
          val.length >= value ||
          this.$t('forms.errors.greaterOrEqualThan', { value }),
                isAccountAvailable: async account =>
                    off ||
          (await this.isAccountFree(account.toLowerCase())) ||
          this.$t('forms.errors.accountNotAvailable', { account }),
                isInteger: val =>
                    off ||
          Number.isInteger(parseInt(val)) ||
          this.$t('forms.errors.integer'),
                isNatural: val =>
                    off ||
          Number.isInteger(parseInt(val)) && parseInt(val)>=0 ||
          this.$t('forms.errors.natural'),
                isToken: val =>
                    off ||
          (val.length >= 2 && val.length <= 6) ||
          this.$t('forms.errors.token'),
                isTokenDecimals: val =>
                    off ||
          (parseInt(val) >= 0 && parseInt(val) <= 9) ||
          this.$t('forms.errors.tokenDecimals'),
                positiveInteger: val =>
                    off ||
          parseInt(val) > 0 ||
          this.$t('forms.errors.positiveInteger'),
                isValidIPFShash: val =>
                    off ||
          val.match(regex) ||
          'Invalid IPFS HASH format',
                arrayWithUniqueItems: arr =>
                    off ||
          arr.length === new Set(arr).size ||
          this.$t('forms.errors.unique'),
                required: val =>
                    off ||
          !!val ||
          this.$t('forms.errors.required'),
            }
        };
    },
    methods: {
        ...mapActions('accounts', ['isAccountFree']),
        async validate(form) {
            if (!form) return true;
            for await (const key of Object.keys(form)) {
                if (this.$refs[key]) {
                    await this.$refs[key].validate();
                }
            }
            return Object.keys(form).reduce(
                (valid, key) =>
                    valid && (!this.$refs[key] || !this.$refs[key].hasError),
                true
            );
        },
        resetValidation(form) {
            if (!form) return;
            Object.keys(form).forEach(
                (key) => this.$refs[key] && this.$refs[key].resetValidation()
            );
        },
    },
};
