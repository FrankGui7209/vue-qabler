<template>
  <div class="q-basic-line-chart">
    <div class="title">当日设备算力图</div>
    <v-chart :forceFit="true" :height="height" :data="data" :scale="scale">
      <v-tooltip/>
      <v-axis/>
      <v-line position="time*hashrate"/>
      <v-point position="time*hashrate" shape="circle"/>
    </v-chart>
  </div>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    name: 'QBasicLineChart',
    data() {
      return {
        data: [],
        scale: [{dataKey: 'hashrate', min: 0,},
          {dataKey: 'time', min: 0, max: 1,}],
        height: 300,
        timeStart: new Date().getTime() / 1000 - 1 * 24 * 60,
        timeEnd: new Date().getTime() / 1000
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    mounted() {
      this.$api.invoke('gethashhistory', {userid: this.userInfo.userid, eqid: 0, timestart: this.timeStart, timeend: this.timeEnd})
        .then(res => {
          if (res.retcode === 0) {
            this.data = res.result.hashhistory;
          } else {
            this.$message.error(res.msg || '获取数据出错')
          }
        })
    },

    methods: {}
  }
</script>

<style lang="stylus" scoped>
  .title{
    font-weight: 600;
  }
</style>
