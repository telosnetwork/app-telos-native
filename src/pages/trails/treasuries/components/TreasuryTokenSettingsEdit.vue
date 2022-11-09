<script>
import { validation } from '~/mixins/validation';

export default {
    name: 'TreasuryTokenSettingsEdit',
    mixins: [validation],
    props: {
        modelValue: {
            type: Array,
            required: true
        },
    },
    data() {
        return {
            list: [],
            preValue: {},
            selected: {
                key: '',
                body: ''
            }
        };
    },
    async mounted() {
        this.list = this.modelValue.map(x => x); // clean copy
        this.remember();
    },
    methods: {
        remember(newValue) {
            this.preValue = (newValue || this.list).map(x => ({...x}));
        }
    },
    watch: {
        list: {
            handler:function(newval) {
                let changes = this.preValue.filter((x,i) => {
                    let result = newval[i].value !== x.value;
                    return result;
                });

                if (changes.length === 1) {
                    this.selected = {
                        key: changes[0].key,
                        body: 'pages.trails.treasuries.settings.' + changes[0].key
                    };
                }
                this.remember();
            },
            deep:true
        }
    }
};
</script>

<template>
  <div class="row tt-editor">
    <div class="col-sm-5 q-mb-md tt-editor__checkboxes">
      <q-list class="tt-editor__checkbox-list">
        <q-item class="tt-editor__checkbox-item" v-for="(coso,index) in list" dense="dense" :key="index">
          <q-checkbox class="tt-editor__checkbox"
            v-model="list[index].value"
            :label="list[index].key"
            @update:model-value="$emit('update:modelValue', list)"
          ></q-checkbox>
        </q-item>
      </q-list>
    </div>
    <div class="col-sm-7 tt-editor__doc">
      <div class="q-mt-sm text-h6 tt-editor__doc-title">{{ selected.key }}</div>
      <div class="q-mt-md tt-editor__doc-body">{{ $t(selected.body) }}</div>
    </div>
  </div>
</template>

<style lang="scss">
.tt-editor__doc {
  padding-left: 24px;
}
.tt-editor__doc-title {
  font-weight: bold
}
</style>