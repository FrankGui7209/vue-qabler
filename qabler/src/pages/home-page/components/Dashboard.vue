<template>
  <div class="home-page">
    <a-row>
      <a-col :span="2"></a-col>
      <a-col :span="20">
        <div class="title">
        </div>
        <!-- <reverse-card percent="2%" content="27.3K" text="up 2%"></reverse-card> -->
        <ul class="stock-card-list">
          <li>
            <stock-card percent="" :content="userData.eqcount" text="矿机总数(台)" @click="gotoDeviceManager()"></stock-card>
          </li>
          <li>
            <stock-card :flag="false" percent="" :content="userData.rejecttotal" text="已拒绝算力(kH/s)"></stock-card>
          </li>
          <li>
            <stock-card percent="" :content="userData.acceptdtotal" text="已接收算力(kH/s)"></stock-card>
          </li>
          <li>
            <stock-card percent="" :content="userData.acceptrate" text="挖矿效率(%)"></stock-card>
          </li>
          <li>
            <stock-card :flag="false" percent="" :content="userData.hashratetotal" text="总算力(kH/s)"></stock-card>
          </li>
          <li>
            <stock-card :flag="false" percent="" :content="userData.goldrate" text="收益能力(BTC/天)"></stock-card>
          </li>
        </ul>
        <!--<ul class="sale-card-list">-->
        <!--<li class="sale-card-item">-->
        <!--<sale-card count="132" text="Sales" content="12 waiting payments" color="primary">-->
        <!--<a-icon type="pay-circle-o" slot="sale-icon"/>-->
        <!--</sale-card>-->
        <!--</li>-->
        <!--<li class="sale-card-item">-->
        <!--<sale-card count="78" text="Orders" content="32 shppied" color="success">-->
        <!--<a-icon type="shopping-cart" slot="sale-icon"/>-->
        <!--</sale-card>-->
        <!--</li>-->
        <!--<li class="sale-card-item">-->
        <!--<sale-card count="1352" text="Members" content="163 registered today" color="danger">-->
        <!--<a-icon type="usergroup-add" slot="sale-icon"/>-->
        <!--</sale-card>-->
        <!--</li>-->
        <!--<li class="sale-card-item">-->
        <!--<sale-card count="132" text="Comments" content="12 waiting" color="warning">-->
        <!--<a-icon type="message" slot="sale-icon"/>-->
        <!--</sale-card>-->
        <!--</li>-->
        <!--</ul>-->

        <div class="chart-list">
          <div class="chart-item">
            <q-pie-chart></q-pie-chart>
          </div>
          <div class="chart-item allEquCalc">
            <q-basic-line-chart></q-basic-line-chart>
          </div>
        </div>
      </a-col>
      <a-col :span="2"></a-col>
    </a-row>
  </div>
</template>

<script>
  import StockCard from './StockCard.vue'
  import SaleCard from './SaleCard.vue'
  import QPieChart from '@/components/q-chart/q-pie-chart/QPieChart.vue'
  import QBasicLineChart from '@/components/q-chart/q-line-chart/QBasicLineChart.vue'
  import QHeader from '@/views/q-header/QHeader.vue'
  import QTab from '@/views/q-tab/QTab.vue'
  import QFooter from '@/views/q-footer/QFooter.vue'
  import {mapState} from 'vuex';

  let me
  export default {
    name: 'HomePage',
    components: {
      QHeader,
      QTab,
      QFooter,
      StockCard,
      SaleCard,
      QPieChart,
      QBasicLineChart
    },
    data() {
      return {
        userData: {}
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    created() {
      me = this
    },
    mounted() {
      me.getUserData()
    },
    methods: {
      getUserData() {
        this.$api.invoke('getuserinfo', {userid: me.userInfo.userid}).then(res => {
          if (res.retcode === 0) {
            me.userData = res.result
          } else {
            me.$message.error(res.msg || '获取用户基本信息出错')
          }
        })
      },
      gotoDeviceManager() {
        this.$router.push({name: 'DeviceManage'})
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .home-page
    .title
      font-size 1.5rem
      line-height 2.5rem
      font-weight 600
      color rgb(73, 80, 87)
      margin 2rem 0
    .stock-card-list
      display flex
      justify-content space-between
      margin-bottom 2rem
      flex-wrap wrap
      justify-content space-between
      li
        margin 1rem 0
    .sale-card-list
      display flex
      justify-content space-between
      margin-bottom 2rem
      .sale-card-item
        width 24%
    .chart-list
      display flex
      flex-wrap: wrap;
      justify-content space-between
      margin-bottom 2rem
      .chart-item
        width 45%
        border 1px solid rgba(0, 40, 100, 0.12)
        box-shadow 0 1px 2px 0 rgba(0, 0, 0, 0.05)
        background-color #fff
        padding 1rem
        margin 1rem 0
        border-radius 4px
    .user-table-list
      margin-bottom 2rem
  @media only screen and (max-width: 767px) {
    .chart-item {
      width: 100% !important;}
  }
</style>
<style rel="stylesheet/css" lang="css">
  .allEquCalc .el-date-editor .el-range-input {
    /*text-align: left !important;*/
    width: auto !important;
  }
  .allEquCalc .el-date-editor--datetimerange.el-input__inner {
    width: 320px !important;
  }
  .allEquCalc .el-range-separator {
    width: 10% !important;
  }
</style>
