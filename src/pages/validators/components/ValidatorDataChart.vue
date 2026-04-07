<template>
  <div>
    <div v-if="isLoading" class="q-px-sm q-py-md text-grey-8">
      Loading validator benchmark data...
    </div>
    <div v-else-if="errorMessage" class="q-px-sm q-py-md text-negative">
      {{ errorMessage }}
    </div>
    <div v-else-if="!hasBenchmarks" class="q-px-sm q-py-md text-grey-8">
      No validator benchmark data is currently available.
    </div>
    <template v-else>
      <div
        v-if="latestBenchmarkLabel"
        class="q-px-sm q-pb-sm text-caption text-grey-8"
      >
        Showing the most recent available {{ benchmarkWindowLabel }} benchmark
        window ending {{ latestBenchmarkLabel }}.
      </div>
      <highcharts
        ref="highcharts"
        :options="chartOptions"
        :update-args="[true, false]"
      />
      <q-btn class="q-pa-sm" @click="toggleVisible(true)"> Select all </q-btn>
      <q-btn class="q-pa-sm" @click="toggleVisible(false)">
        Deselect all
      </q-btn>
    </template>
  </div>
</template>

<script>
import { Chart } from "highcharts-vue";
import { mapActions, mapState } from "vuex";

export default {
  name: "ValidatorDataChart",
  components: {
    highcharts: Chart,
  },
  data() {
    return {
      chartOptions: {
        title: {
          text: "Mainnet Validator CPU Performance",
        },
        credits: {
          enabled: false,
        },
        xAxis: {
          type: "datetime",
        },
        yAxis: {
          title: {
            text: "microseconds",
          },
        },
        legend: {
          layout: "horizontal",
          align: "center",
          verticalAlign: "bottom",
        },
        chart: {
          height: "85%",
        },
      },
      benchmarkDays: 1,
      errorMessage: "",
      isLoading: true,
      latestBenchmarkAt: null,
    };
  },
  computed: {
    ...mapState("validators", ["benchmarks"]),
    hasBenchmarks() {
      return this.benchmarks.length > 0;
    },
    benchmarkWindowLabel() {
      return this.benchmarkDays === 1 ? "24-hour" : `${this.benchmarkDays}-day`;
    },
    latestBenchmarkLabel() {
      if (!this.latestBenchmarkAt) {
        return "";
      }

      return new Date(this.latestBenchmarkAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    },
  },
  watch: {
    benchmarks() {
      this.$nextTick(() => {
        this.syncChartSeries();
      });
    },
  },
  async mounted() {
    await this.refreshBenchmarks();
  },
  methods: {
    ...mapActions("validators", ["loadBenchmarks"]),
    async refreshBenchmarks() {
      this.isLoading = true;
      this.errorMessage = "";

      try {
        const benchmarkResponse = await this.loadBenchmarks({
          days: this.benchmarkDays,
        });

        this.latestBenchmarkAt =
          benchmarkResponse && benchmarkResponse.latestTimestamp;
      } catch (error) {
        this.latestBenchmarkAt = null;
        this.errorMessage =
          "Unable to load validator benchmark data right now.";
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.syncChartSeries();
        });
      }
    },
    syncChartSeries() {
      const chart = this.$refs.highcharts && this.$refs.highcharts.chart;

      if (!chart) {
        return;
      }

      while (chart.series.length) {
        chart.series[0].remove(false);
      }

      this.benchmarks.forEach((benchmark, index) => {
        chart.addSeries(benchmark, index === this.benchmarks.length - 1);
      });
    },
    toggleVisible(show) {
      const chart = this.$refs.highcharts && this.$refs.highcharts.chart;

      if (!chart) {
        return;
      }

      chart.series.forEach((series) => {
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
