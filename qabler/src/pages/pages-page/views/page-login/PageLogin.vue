<template>
  <div class="page-login">
    <div class="login">
      <el-row>
        <el-col :xs="16" :sm="12" :md="10" :lg="8" class="main">
          <q-raw-card style="width: 100%">
            <div style="width: 100%" slot="card-content">
              <div class="title">用户登录</div>
              <form>
                <div class="form-group">
                  <label class="form-label" for="">用户名称</label>
                  <a-input placeholder="请输入用户名称" v-model="username"/>
                </div>
                <div class="form-group">
                  <label class="form-label" for="">用户密码</label>
                  <a-input type="password" placeholder="密码" v-model="passwd"/>
                </div>
                <!--<div class="form-group" style="float:left;margin-left:20px;width: 100%;position: relative;">-->
                  <!--<a-checkbox>记住当前用户</a-checkbox>-->
                  <!--<div class="form-end">-->
                    <!--<a href="">忘记密码</a>-->
                  <!--</div>-->
                <!--</div>-->
                <div class="form-button">
                  <q-button block="btn-block" text="登录" :clickHandler="login"></q-button>
                </div>
              </form>
            </div>
          </q-raw-card>
          <!--<div class="extra">Don't have account yet? <a href="">注册</a></div>-->
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import QRawCard from '@/components/q-card/QRawCard.vue'
  import QButton from '@/components/q-button/QButton.vue'
  import {mapMutations} from 'vuex';
  import md5 from 'md5'

  export default {
    name: 'PageLogin',
    components: {
      QRawCard,
      QButton
    },
    data() {
      return {username: 'admin', passwd: '123456'}
    },
    methods: {
      ...mapMutations(["setUserInfo", "setToken"]),
      login() {
        if (!this.username) {
          this.$message.error('用户名称不能为空');
          return
        }
        if (!this.passwd) {
          this.$message.error('密码不能为空');
          return
        }
        this.$api.invoke("userlogin", {username: this.username, passwd: md5(this.passwd)}).then(res => {
          // result: {token: "1561965300", userid: "1", username: "admin", usertype: "1"}
          console.log(res)
          if (res.retcode === 0) {
            this.setUserInfo(res.result)
            this.setToken(res.result.token)
            this.$router.push("/")
          } else {
            this.$message.error(res.msg || '登录错误');
          }
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .extra
    text-align center
    margin-top 1.5rem
  .form-group
    display: flex
    label
      width: 100px
      white-space nowrap
      line-height: 30px
  .form-label
    margin-bottom .375rem
    font-weight 600
    font-size 0.875rem
  .form-end
    position: absolute;
    right: 20px;
  .login
    display block
    margin 10px auto
    position relative
    .q-raw-card
      margin 0 auto
  .form-button
    margin-top 2rem
    clear both
  .page-login
    background url(../../../../assets/images/background.jpg) no-repeat
    background-size:100% 100%;
    overflow: hidden;
    width 100vw
    height 100vh
    .title
      font-size 1.125rem
      line-height 1.2
      font-weight 400
      margin-bottom 1rem
  .main
    text-align center
    float none
    margin auto
    padding-top: calc((100vh - 500px) / 2)
</style>
