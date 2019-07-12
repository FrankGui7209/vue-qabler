<template>
  <div class="select-user">
    <a-row style="margin:10px 0;">
      <a-col :span="2"></a-col>
      <a-col :span="20" style="display: flex">
        <label style="white-space: nowrap;line-height:38px;">用户：</label>
        <el-select placeholder="请选择用户" @change="changeHandle" v-model="selectUser">
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.userlabel"
            :value="item.userid">
            <span style="float: left">{{ item.userid }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
          </el-option>
        </el-select>
      </a-col>
      <a-col :span="2"></a-col>
    </a-row>
  </div>
</template>

<script>
  import {mapMutations, mapState} from 'vuex';

  const PAGE_SIZE = 2000;
  let me
  export default {
    name: 'SelectUser',
    props: {
      value: {type: String, default: "0"}
    },
    data() {
      return {
        selectUser: null,
        allUserList: [],
      }
    },
    computed: {
      ...mapState(["userInfo", "userList"]),
    },
    created() {
      me = this
    },
    mounted() {
      this.selectUser = this.value+""
      this.getUserList()
    },
    watch: {
      value(to, from) {
        this.selectUser = to+""
      }
    },
    methods: {
      ...mapMutations(["setUserList"]),
      getUserList() {
        // if (this.userList) {
        //   this.allUserList = this.userList
        //   return
        // }
        this.$api.invoke("getuserlist", {"index": 1, "count": PAGE_SIZE}).then(res => {
          if (res.retcode === 0) {
            if (+this.userInfo.usertype === 1) {
              res.result.userinfo = [{userid: "0", username: '<所有>'}].concat(res.result.userinfo)
            }
            res.result.userinfo.forEach(v => {
              v.userlabel = v.userid + ' - ' + v.username
            })
            this.allUserList = res.result.userinfo
            this.setUserList(this.allUserList)
          } else {
            this.$message.error(res.mag || '获取用户列表出错')
          }
        })
      },
      changeHandle(value) {
        this.$emit("input", value)
        this.$emit("userChanged", value)
      }
    }

  }
</script>

<style lang="stylus" scoped>

</style>
