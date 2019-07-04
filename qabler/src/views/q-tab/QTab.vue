<template>
  <div class="tab-wrapper">
    <a-row>
      <a-col :span="2"></a-col>
      <a-col :span="20">
        <div class="tab">
          <a-menu mode="horizontal" v-model="current">
            <a-menu-item key="home">
              <router-link to="/" tag="span">
                <a-icon type="home"/>
                首页
              </router-link>
            </a-menu-item>
            <a-menu-item key="user" v-if="+userInfo.usertype===1">
              <router-link to="/userManage" tag="span">
                <a-icon type="codepen"/>
                用户管理
              </router-link>
            </a-menu-item>
            <a-menu-item key="device">
              <router-link tag="span" to="/deviceManage">
                <a-icon type="layout"/>
                矿机管理
              </router-link>
            </a-menu-item>
            <a-menu-item key="pool">
              <router-link to="/poolManage" tag="span">
                <a-icon type="file"/>
                矿池管理
              </router-link>
            </a-menu-item>
            <!--<a-menu-item key="forms">-->
            <!--<router-link to="/forms" tag="span">-->
            <!--<a-icon type="form" />Forms-->
            <!--</router-link>-->
            <!--</a-menu-item>-->
            <!--<a-menu-item key="gallery">-->
            <!--<router-link to="/gallery" tag="span">-->
            <!--<a-icon type="picture" />Gallery-->
            <!--</router-link>-->
            <!--</a-menu-item>-->
            <!--<a-menu-item key="documentations">-->
            <!--<router-link to="/documentations" tag="div">-->
            <!--<a-icon type="file-text" />Documentations-->
            <!--</router-link>-->
            <!--</a-menu-item>-->
          </a-menu>
          <!--<div class="search">-->
          <!--<a-input-search placeholder="Search..." style="width: 12rem"></a-input-search>-->
          <!--</div>-->
        </div>
      </a-col>
      <a-col :span="2"></a-col>
    </a-row>
  </div>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    name: 'QTab',
    props: {
      "tab": {type: String, default: 'home'}
    },
    data() {
      return {
        current: ['home']
      }
    },
    computed: {
      ...mapState(['userInfo'])
    },
    mounted() {
      if (this.tab) {
        this.current = [this.tab]
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .tab-wrapper >>> .ant-menu
    border-bottom none
  .tab-wrapper >>> .ant-menu-item, .ant-menu-submenu-title
    padding 0 0.825rem
  .tab-wrapper
    background-color #fff
    border-bottom 1px solid rgba(0, 40, 100, 0.12)
    .tab
      display flex
      justify-content space-between
      align-items center
</style>
