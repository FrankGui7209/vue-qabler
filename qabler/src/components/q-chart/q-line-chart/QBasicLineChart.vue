<template>
  <div class="q-basic-line-chart">
    <div class="title" v-if="equuid=='0'">
      <label v-if="equuid=='0'">设备算力图</label>
      <el-date-picker style="float:right" size="mini"
                      v-model="dateScope"
                      type="datetimerange"
                      range-separator="至"
                      @change="dateScopeChanged"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
      </el-date-picker>
    </div>
    <div class="title" v-else>
      <el-date-picker size="mini"
                      v-model="dateScope"
                      type="datetimerange"
                      range-separator="至"
                      @change="dateScopeChanged"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
      </el-date-picker>
    </div>
    <v-chart :forceFit="true" :height="height" :data="data" :scale="scale" v-if="data.length>0">
      <v-tooltip/>
      <v-axis/>
      <v-line position="time*hashrate"/>
      <v-point position="time*hashrate" shape="circle"/>
    </v-chart>
    <div v-else style="height:300px;margin: auto;text-align:center;padding-top:150px;">
      暂无相关数据
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex';

  let me
  export default {
    name: 'QBasicLineChart',
    props: {
      equuid: {type: String, default: "0"}
    },
    data() {
      return {
        data: [],
        dateScope: [new Date(new Date().getTime() - 1 * 24 * 60 * 1000), new Date()],
        scale: [{dataKey: 'hashrate', min: 0,},
          {dataKey: 'time', min: 0, max: 1,}],
        height: 300
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    created() {
      me = this
    },
    mounted() {
      this.getData()
    },
    watch: {
      "equuid"() {
        this.getData()
      }
    },
    methods: {
      getData() {
        let timestart = this.dateScope[0].getTime() / 1000
        let timeend = this.dateScope[1].getTime() / 1000

        this.$api.invoke('gethashhistory', {userid: this.userInfo.userid, equuid: me.equuid, timestart: timestart, timeend: timeend})
          .then(res => {
            if (res.retcode === 0) {
              this.data = res.result.hashhistory || [];
            } else {
              this.$message.error(res.msg || '获取数据出错')
            }
          })
      },
      dateScopeChanged(value) {
        this.getData()
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .title {
    font-weight: 600;
  }
</style>
