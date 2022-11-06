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
      preValue: {},
      selected: {
        key: '',
        body: ''
      }
    };
  },
  async mounted() {
    this.remember();
  },
  methods: {
    remember(newValue) {
      this.preValue = (newValue || this.modelValue).map(x => ({...x}))
    }
  },
  watch: {
    modelValue: {
      handler:function(newval) {
        let changes = this.preValue.filter((x,i) => {          
          let result = newval[i].value != x.value;
          return result;
        });

        console.log('changes: ', changes);
        if (changes.length == 1) {
          this.selected = {
            key: changes[0].key,
            body: 'pages.trails.treasuries.settings.' + changes[0].key
          }
        }
        this.remember();
      },
      deep:true
    }
  }
};
</script>

<template lang="pug">
.row.tt-editor
  .col-sm-5.q-mb-md.tt-editor__checkboxes
    q-list.tt-editor__checkbox-list
      q-item.tt-editor__checkbox-item(
        v-for="(coso,index) in modelValue"
        dense
      )
        q-checkbox.tt-editor__checkbox(
          v-model="modelValue[index].value"
          :label="modelValue[index].key"
        )
  .col-sm-7.tt-editor__doc
    .q-mt-sm.text-h6.tt-editor__doc-title {{ selected.key }}
    .q-mt-md.tt-editor__doc-body {{ $t(selected.body) }}
    
</template>

<style lang="sass">

.tt-editor__doc
  padding-left: 24px
.tt-editor__doc-title
  font-weight: bold

</style>
