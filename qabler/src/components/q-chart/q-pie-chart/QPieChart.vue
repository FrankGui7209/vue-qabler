<template>
  <div>
    <div class="title">算法使用比例图</div>
    <v-chart :forceFit="true" :height="height" :data="showData" :scale="scale">
      <v-tooltip :showTitle="false" dataKey="algoname*percent"/>
      <v-axis/>
      <v-legend dataKey="algoname"/>
      <v-pie position="percent" color="algoname" :v-style="pieStyle" :label="labelConfig"/>
      <v-coord type="theta"/>
    </v-chart>
  </div>
</template>

<script>
  import {mapState} from 'vuex';

  const DataSet = require('@antv/data-set');

  const sourceData = [
    {algoname: '事例一', equipnum: 40},
    {algoname: '事例二', equipnum: 21},
    {algoname: '事例三', equipnum: 17},
    {algoname: '事例四', equipnum: 13},
    {algoname: '事例五', equipnum: 9}
  ];

  const scale = [{
    dataKey: 'percent',
    min: 0,
    formatter: '.0%',
  }];

  const dvExample = new DataSet.View().source(sourceData);
  dvExample.transform({
    type: 'percent',
    field: 'equipnum',
    dimension: 'algoname',
    as: 'percent'
  });
  const dataExample = dvExample.rows;

  export default {
    name: 'QPieChart',
    props: {
      // data: {
      //   type: Array,
      //   default: function () {
      //     return dataExample
      //   }
      // },
      height: {
        type: Number,
        default: 300
      },
      scale: {
        type: Array,
        default: function () {
          return scale
        }
      },
      pieStyle: {
        type: Object,
        default: function () {
          return {
            stroke: "#fff",
            lineWidth: 1
          }
        }
      },
      labelConfig: {
        type: Array,
        default: function () {
          return ['percent', {
            formatter: (val, item) => {
              return item.point.algoname  + ': ' + val;
            }
          }]
        }
      }
    },
    data() {
      return {
        data: dataExample
      }
    },
    computed: {
      ...mapState(['userInfo']),
      showData() {
        return this.data
      }
    },
    mounted() {
      this.$api.invoke('gettotalstatus', {userid: this.userInfo.userid}).then(res => {
        if (res.retcode === 0) {
          const dv = new DataSet.View().source(res.result.algoequip.filter(v => +v.equipnum > 0));
          dv.transform({
            type: 'percent',
            field: 'equipnum',
            dimension: 'algoname',
            as: 'percent'
          });
          this.data = dv.rows;
        } else {
          this.$message.error(res.msg || '获取算法数据出错')
        }
      })
    },

    methods: {}
  }
</script>

<style scoped>
  .title {
    font-weight: 600;
    padding-bottom: 10px;
  }
</style>
