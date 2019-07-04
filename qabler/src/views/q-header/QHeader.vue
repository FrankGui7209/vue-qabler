<template>
  <div class="header">
    <div class="header-info">
      <a-row>
        <a-col :span="2"></a-col>
        <a-col :span="20">
          <div class="header-content">
            <div class="logo-wrapper">
              <img src="../../assets/images/logo.png" class="logo" alt="">
              &nbsp;矿机后台管理
            </div>
            <div class="info-wrapper">
              <!--<div class="source-button">source code</div>-->
              <!--<div class="header-badge">-->
              <!--<a-badge dot>-->
              <!--<a-icon type="notification"/>-->
              <!--</a-badge>-->
              <!--</div>-->
              <a-popover trigger="hover">
                <template slot="content">
                  <a-menu
                    style="width: 180px"
                    @click="handleMenu"
                    :defaultSelectedKeys="['myProfile']"
                    :defaultOpenKeys="['sub1']">
                    <a-menu-item key="myProfile">
                      <a-icon type="user"/>
                      个人信息
                    </a-menu-item>
                    <!--<a-menu-item key="2">-->
                      <!--<a-icon type="setting"/>-->
                      <!--修改密码-->
                    <!--</a-menu-item>-->
                    <a-menu-item key="logout">
                      <a-icon type="logout"/>
                      退出登录
                    </a-menu-item>
                  </a-menu>
                </template>
                <div class="header-avatar">
                  <q-avatar :title="userInfo.username" :sub-title="+userInfo.usertype===1?'管理员':'普通用户'">
                    <div slot="avatar" class="avatar-wrapper">
                      <img src="../../assets/images/faces/female/19.jpg" alt="" class="avatar">
                    </div>
                  </q-avatar>
                </div>
              </a-popover>
            </div>
          </div>
        </a-col>
        <a-col :span="2"></a-col>
      </a-row>
    </div>
    <div class="header-tab">
      <a-row>
        <a-col :span="2"></a-col>
        <a-col :span="20">

        </a-col>
        <a-col :span="2"></a-col>
      </a-row>
    </div>
    <edit-profile v-model="profileVisible"></edit-profile>
  </div>
</template>

<script>
  import QAvatar from '../../components/q-avatar/QAvatar.vue'
  import EditProfile from './EditProfile'
  import {mapMutations, mapState} from 'vuex';

  export default {
    name: 'QHeader',
    components: {
      QAvatar, EditProfile
    },
    data() {
      return {
        profileVisible: false
      }
    },
    computed: {
      ...mapState(["userInfo"])
    },
    methods: {
      ...mapMutations(["signOut"]),
      handleMenu({item, key, keyPath}) {
        if (key == 'logout') {
          this.signOut()
          this.$router.push("/login")
        } else if (key === 'myProfile') {
          this.profileVisible = true
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .header >>> .ant-menu-inline, .ant-menu-vertical, .ant-menu-vertical-left
    border-right none
  .header
    background-color #fff
    .header-info
      padding 1rem 0
      border-bottom 1px solid rgba(0, 40, 100, 0.12)
      .header-content
        display flex
        justify-content space-between
        .logo-wrapper
          display flex
          line-height: 31px;
          font-size: 18px;
          font-weight: 700;
          .logo
            height 2rem
            transition all .3s
            cursor pointer
            &:hover
              opacity 0.8
        .info-wrapper
          display flex
          align-items center
          .source-button
            display inline-block
            font-size 0.75rem
            font-weight 600
            letter-spacing .03rem
            padding 0.25rem 0.5rem
            border-radius 3px
            line-height 1.333333
            color #467fcf
            border 1px solid #467fcf
            cursor pointer
            transition all .3s
            &:hover
              color #fff
              background-color #467fcf
          .header-badge
            color #333
            width 40px
            height 35px
            text-align center
            line-height 35px
            margin 0 .5rem
            cursor pointer
            transition all .3s
            :hover
              color #495057
          .header-avatar
            cursor pointer
            transition all .3s
            &:hover
              text-shadow 0 0 2px #ccc
            .avatar-wrapper
              .avatar
                width 2rem
                height 2rem
                line-height 2rem
                border-radius 50%
</style>
