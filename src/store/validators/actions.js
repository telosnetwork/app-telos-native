const moment = require("moment");

const BENCHMARK_FILTER = "eosmechanics:cpu";
const HYPERION_ACTIONS_PATH = "v2/history/get_actions";

function getActionTimestamp(action) {
  return action.timestamp || action["@timestamp"];
}

function getActionPoint(action) {
  const producer = action.producer;
  const cpuUs = Number(action.cpu_usage_us);
  const timestamp = getActionTimestamp(action);

  if (!producer || Number.isNaN(cpuUs) || !timestamp) {
    return null;
  }

  return {
    producer,
    point: [moment(timestamp).valueOf(), cpuUs],
  };
}

// Use our own benchmark API as primary (Hyperion eosmechanics data is stale)
// Falls back to Hyperion if the benchmark API is unavailable
export async function loadBenchmarks({ commit }, { days }) {
  try {
    // Try our live benchmark API first
    try {
      const benchmarkResp = await fetch(process.env.BENCHMARK_API);
      const latestBenchmark = await benchmarkResp.json();
      if (latestBenchmark && latestBenchmark.gas_used) {
        const ts = latestBenchmark.timestamp
          ? moment(latestBenchmark.timestamp).valueOf()
          : Date.now();
        // Build a single-series Highcharts-compatible array from the live benchmark
        const seriesData = [[ts, latestBenchmark.gas_used]];
        const seriesArray = [{
          name: "EVM CPU (gas)",
          data: seriesData,
        }];
        commit("validators/setBenchmarks", seriesArray, { root: true });
        return {
          benchmarks: seriesArray,
          latestTimestamp: latestBenchmark.timestamp,
        };
      }
    } catch (benchErr) {
      console.warn("Benchmark API failed, falling back to Hyperion:", benchErr);
    }

    // Fall back to Hyperion (original behavior)
    const latestBenchmarks = await this.$hyperion.get(HYPERION_ACTIONS_PATH, {
      params: {
        filter: BENCHMARK_FILTER,
        limit: 1,
        sort: "desc",
      },
    });

    const latestAction = latestBenchmarks.data.actions[0];

    const latestTs = latestAction ? moment(getActionTimestamp(latestAction)) : null;
    const isStale = latestTs && moment().diff(latestTs, "days") > 7;

    if (!latestAction || isStale) {
      // Hyperion data is stale (last eosmechanics action >7 days old).
      // Return empty chart rather than misleading stale data.
      commit("validators/setBenchmarks", [], { root: true });
      return {
        benchmarks: [],
        latestTimestamp: latestTs ? latestTs.toISOString() : null,
      };
    }

    // The live benchmark stream can pause for long stretches. Anchor the
    // display window to the latest available benchmark so the graph keeps
    // rendering useful data instead of an empty recent range.
    let haveMore = true;
    let params = {
      filter: BENCHMARK_FILTER,
      after: moment
        .utc(getActionTimestamp(latestAction))
        .subtract(days, "days")
        .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
      limit: 1000,
      sort: "asc",
    };
    let bpMap = {};

    while (haveMore) {
      const benchmarks = await this.$hyperion.get(HYPERION_ACTIONS_PATH, {
        params,
      });
      let acts = benchmarks.data.actions || [];
      let biggest = 0;

      acts.forEach((action) => {
        if (action.global_sequence > biggest) {
          biggest = action.global_sequence;
        }

        const benchmarkPoint = getActionPoint(action);

        if (!benchmarkPoint) {
          return;
        }

        const { producer, point } = benchmarkPoint;

        if (!Object.prototype.hasOwnProperty.call(bpMap, producer)) {
          bpMap[producer] = [point];
        } else {
          bpMap[producer].push(point);
        }
      });

      haveMore = acts.length === params.limit && biggest > 0;

      if (haveMore) {
        params.global_sequence = `${biggest}-${Number.MAX_SAFE_INTEGER}`;
        if (params.after) {
          delete params.after;
        }
      }
    }

    let seriesArray = Object.keys(bpMap)
      .sort((left, right) => left.localeCompare(right))
      .map((bp) => ({
        name: bp,
        data: bpMap[bp].sort((left, right) => left[0] - right[0]),
      }));

    commit("validators/setBenchmarks", seriesArray, { root: true });

    return {
      benchmarks: seriesArray,
      latestTimestamp: getActionTimestamp(latestAction),
    };
  } catch (error) {
    commit("validators/setBenchmarks", [], { root: true });
    throw error;
  }
}
