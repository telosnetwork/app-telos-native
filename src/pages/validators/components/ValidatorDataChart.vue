<template>
  <div>
    <highcharts
      ref="highcharts"
      :options="chartOptions"
      :update-args="[true, false]"
    />
    <q-btn
      class="q-pa-sm"
      @click="toggleVisible(true)"
    >
      Select all
    </q-btn>
    <q-btn
      class="q-pa-sm"
      @click="toggleVisible(false)"
    >
      Deselect all
    </q-btn>
  </div>
</template>

<script>
import { Chart } from 'highcharts-vue';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'ValidatorDataChart',
  components: {
    highcharts: Chart,
  },
  data() {
    return {
      chartOptions: {
        title: {
          text: 'Validator CPU Performance',
        },
        credits: {
          enabled: false,
        },
        xAxis: {
          type: 'datetime',
        },
        yAxis: {
          title: {
            text: 'microseconds',
          },
        },
        legend: {
          layout: 'horizontal',
          align: 'center',
          verticalAlign: 'bottom',
        },
        chart: {
          height: '85%',
        },
      },
      benchmarkDays: 1,
    };
  },
  computed: {
    ...mapState('validators', ['benchmarks']),
  },
  watch: {
    benchmarks() {
      this.$refs.highcharts.chart.series = [];
      for (let i = 0; i < this.benchmarks.length; i++) {
        let benchmark = this.benchmarks[i];
        this.$refs.highcharts.chart.addSeries(
          benchmark,
          i === this.benchmarks.length - 1
        );
      }
    },
  },
  async mounted() {
    this.loadBenchmarks({ days: this.benchmarkDays });
  },
  methods: {
    ...mapActions('validators', ['loadBenchmarks']),
    toggleVisible(show) {
      this.$refs.highcharts.chart.series.forEach((series) => {
        if (show) {
          series.show();
        } else {
          series.hide();
        }
      });
    },
  },
};
</script>
