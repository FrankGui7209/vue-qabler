<template>
  <div class="select-user">
    <a-row style="margin:10px 0;">
      <a-col :span="2"></a-col>
      <a-col :span="20">
        <label>用户：</label>
        <el-select placeholder="请选择用户" @change="changeHandle" v-model="selectUser">
          <el-option
            v-for="item in userList"
            :key="item.userid"
            :label="item.userid+' - '+item.username"
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
      value: {type: Number, default: 0}
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
      this.getUserList()
    },
    mounted() {
      this.selectUser = this.value
    },
    watch:{
      value(to,from){
        this.selectUser = to
      }
    },
    methods: {
      ...mapMutations(["setUserList"]),
      getUserList() {
        if (this.userList) {
          this.allUserList = this.userList
          return
        }
        this.$api.invoke("getuserlist", {"index": this.pageIndex, "count": PAGE_SIZE}).then(res => {
          if (res.retcode === 0) {
            this.allUserList = res.result.userinfo
            this.setUserList(this.allUserList)
          } else {
            this.$message.error(res.mag || '获取用户列表出错')
          }
        })
      },
      changeHandle(value) {
        // this.selectUser = value
        this.$emit("input", +value)
        this.$emit("userChanged", +value)
      }
    }

  }
</script>

<style lang="stylus" scoped>

</style>
