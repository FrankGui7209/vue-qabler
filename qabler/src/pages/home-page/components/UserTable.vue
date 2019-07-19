<template>
  <div class="user-table">
    <a-row>
      <a-col :span="2"></a-col>
      <a-col :span="20">
        <table class="ui selectable table">
          <thead>
          <tr>
            <th>ID</th>
            <th>用户名称</th>
            <th>类型</th>
            <th>状态</th>
            <th>电话</th>
            <th>设备数量</th>
            <th>挖矿效率</th>
            <th>总算力(kH/s)</th>
            <th>已接受算力(kH/s)</th>
            <th>已拒绝算力(kH/s)</th>
            <th>收益能力(BTC/天)</th>
            <th>累计收益(美元$)</th>
            <th>累计收益(人民币￥)</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(user,userIndex) in userList" :key="user.userid">
            <td>
              <div class="miniScreen"><label>ID</label>{{user.userid}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>用户名称</label>
                <div class="name-date">
                  <div class="name">{{user.username}}</div>
                  <div class="date">注册: {{user.registtime}}</div>
                </div>
              </div>
            </td>
            <td>
              <div class="miniScreen"><label>类型</label>{{+user.usertype===1?'管理员':'普通'}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>状态</label>
                {{+user.userstate===1?'已激活':'已停用'}}
              </div>
            </td>
            <td>
              <div class="miniScreen"><label>电话</label>{{user.phone}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>设备数量</label>{{user.eqcount}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>挖矿效率</label>{{user.acceptrate}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>总算力(kH/s)</label>{{user.hashratetotal}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>已接受算力(kH/s)</label>{{user.acceptdtotal}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>已拒绝算力(kH/s)</label>{{user.rejecttotal}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>收益能力(BTC/天)</label>{{user.goldrate}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>累计收益(美元$)</label>{{user.usdtotal}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>累计收益(人民币￥)</label>{{user.cnytotal}}</div>
            </td>
            <td class="btns">
              <el-dropdown size="small" @command="actionHandle" :trigger="dropdownMenuTrigger">
                <el-button type="primary">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-edit" :command="'modify-'+userIndex">编辑用户</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-delete" :command="'switchstate-'+userIndex">切换状态</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-delete" :command="'delete-'+userIndex">删除用户</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-office-building" divided :command="'device-'+userIndex">矿机管理</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-help" :command="'pool-'+userIndex">矿池管理</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </td>
          </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :span="2"></a-col>
    </a-row>
    <a-row style="margin-top:10px;">
      <a-col :span="2"></a-col>
      <a-col :span="4">
        <button class="btn btn-primary btn-sm" @click="addUser()"><i class="el-icon-plus"></i>&nbsp;新增用户</button>
      </a-col>
      <a-col :span="16" class="text-right">
        <el-pagination layout="prev, pager, next,total" :current-page.sync="pageIndex" :total="totalCount"
                       @current-change="pageChanged"></el-pagination>
      </a-col>
      <a-col :span="2"></a-col>
    </a-row>
    <el-dialog ref="dialog" :title="editTitle" :visible.sync="dialogFormVisible">
      <el-form ref="editForm" :model="editUser" status-icon label-position="right" size="mini" label-width="100px" :rules="rules">
        <el-form-item label="用户名称" prop="username">
          <el-input required v-model="editUser.username" autoComplete="off" :disabled="editUser.userid"></el-input>
        </el-form-item>
        <el-form-item label="电子邮件" prop="email">
          <el-input type="email" v-model="editUser.email" autoComplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="usertype">
          <el-radio-group v-model="editUser.usertype" :disabled="userInfo.usertype===2">
            <el-radio :label="1">管理员</el-radio>
            <el-radio :label="2">普通用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="editUser.phone" autoComplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="passwd"
                      :rules="editUser.userid?[{validator: validatePass, trigger: 'blur'}]:[
                      {required: true, message: '请输入用户密码', trigger: 'blur'},
                      {validator: validatePass, trigger: 'blur'}]">
          <el-input type="password" v-model="editUser.passwd" autoComplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" :rules="editUser.userid?[{validator: validatePass2, trigger: 'blur'}]:[
            {required: true, message: '请输入确认密码', trigger: 'blur'},
            {validator: validatePass2, trigger: 'blur'}
          ]">
          <el-input type="password" v-model="editUser.checkPass" autoComplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import QAvatars from '../../../components/q-avatars/QAvatars.vue'
  import {mapState} from 'vuex';
  import QButton from "../../../components/q-button/QButton";
  import md5 from 'md5'

  const PAGE_SIZE = 20;
  let me
  export default {
    name: 'UserTable',
    components: {
      QButton,
      QAvatars
    },
    data() {
      return {
        dropdownMenuTrigger: screen.availWidth > 700 ? 'hover' : 'click',
        pageIndex: 1,
        totalCount: 0,
        userList: [],
        dialogFormVisible: false,
        editUser: {},//正在编辑的用户
        rules: {
          username: [
            {required: true, message: '请输入用户名称', trigger: 'blur'},
          ],
          email: [
            {type: 'email', required: true, message: '请输入电子邮件', trigger: 'blur'},
          ],
          usertype: [
            {required: true, message: '请选择用户类型', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'}
          ],
          // passwd: [
          //   {required: true, message: '请输入用户密码', trigger: 'blur'},
          //   {validator: validatePass, trigger: 'blur'}
          // ],
          // checkPass: [
          //   {required: true, message: '请输入确认密码', trigger: 'blur'},
          //   {validator: validatePass2, trigger: 'blur'}
          // ],
        }
      }
    },
    computed: {
      ...mapState(["userInfo"]),
      editTitle() {
        return this.editUser.userid > 0 ? '编辑用户' : '新增用户'
      }
    },
    created() {
      me = this
    },
    mounted() {
      this.getUserCount()
      this.getUserList()
    },
    methods: {
      validatePass(rule, value, callback) {
        if (value === '') {
          callback();
        } else {
          if (this.editUser.checkPass !== '') {
            this.$refs.editForm.validateField('checkPass');
          }
          callback();
        }
      },
      validatePass2(rule, value, callback) {
        if (value !== this.editUser.passwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      },
      getUserCount() {
        this.$api.invoke("getusercount", {userid: this.userInfo.userid}).then(res => {
          if (res.retcode === 0) {
            this.totalCount = res.result.usercount
          } else {
            this.$message.error(res.mag || '获取用户总数出错')
          }
        })
      },
      getUserList() {
        this.$api.invoke("getuserlist", {"index": this.pageIndex, "count": PAGE_SIZE}).then(res => {
          if (res.retcode === 0) {
            this.userList = res.result.userinfo
          } else {
            this.$message.error(res.mag || '获取用户列表出错')
          }
        })
      },
      addUser() {
        this.editUser = {email: '', phone: '', passwrd: '', usertype: 2, checkPass: ''};
        me.showDialog();
      },
      showDialog() {
        me.dialogFormVisible = true
        if (me.$refs["editForm"]) {
          me.$refs["editForm"].clearValidate();
          me.$refs["editForm"].resetFields();
        }
      },
      modifyUser(user) {
        this.editUser = user;
        me.showDialog();
      },
      submitForm() {
        this.$refs["editForm"].validate((valid) => {
          if (!valid) {
            return false;
          }
          let params = {username: me.editUser.username, email: me.editUser.email, phone: me.editUser.phone, usertype: me.editUser.usertype}
          if (me.editUser.userid) {
            params.destuserid = me.editUser.userid
          }
          if (me.editUser.passwd) {
            params.passwd = md5(me.editUser.passwd)
          }
          me.$api.invoke('edituserinfo', params).then(res => {
            if (res.retcode === 0) {
              me.$message.success('保存成功!');
              me.dialogFormVisible = false
              if (!me.editUser.userid) {
                me.getUserCount()
                me.getUserList()
              }
            } else {
              me.$message.error(res.msg || '保存用户失败')
            }
          })
        });
      },
      deleteUser(user, userIndex) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          me.$api.invoke("deluser", {userid: user.userid}).then(res => {
            if (res.retcode === 0) {
              me.userList.splice(userIndex, 1)
              me.$message.success('删除成功!');
            } else {
              me.$message.error(res.msg || '删除用户失败')
            }
          })

        }).catch(() => {
        });
      },
      changeState(user, userIndex) {
        this.$confirm('此操作将切换用户状态为【' + (+user.userstate === 1 ? '已停用' : '已激活') + '】, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let newState = user.userstate === 1 ? 0 : 1;
          me.$api.invoke('setuserstate', {userid: user.userid, userstate: newState}).then(res => {
            if (res.retcode === 0) {
              me.$set(user, "userstate", newState);
              me.$message.success('修改用户状态成功!');
            } else {
              me.$message.error(res.msg || '修改用户状态失败')
            }
          })
        }).catch(() => {
        });
      },
      pageChanged(page) {
        me.pageIndex = page;
        me.getUserList();
      },
      actionHandle(command) {
        let action = command.split('-')[0]
        let userIndex = command.split('-')[1]
        let user = this.userList[userIndex]
        if (action === 'modify') {
          this.modifyUser(user)
        } else if (action === 'delete') {
          this.deleteUser(user, userIndex)
        } else if (action === 'switchstate') {
          this.changeState(user, userIndex)
        } else if (action === 'device') {
          this.$router.push({path: '/deviceManage', query: {userid: user.userid}})
        } else if (action === 'pool') {
          this.$router.push({path: '/poolManage', query: {userid: user.userid}})
        }
      }
    }

  }
</script>

<style lang="stylus" scoped>
  .user-table
    margin: 30px auto
  .last-login
    font-size 13px
    color #9aa0ac
  .circle
    font-size 15px
    width 3rem
    height 3rem
  .name-date
    .name
      font-size 15px
    .date
      font-size 11px
      color #9aa0ac
  .btns
    display: flex
    button:first-child
      margin-right: 10px
  .miniScreen
    display flex
    label
      display none
      font-weight 600
  @media only screen and (max-width: 767px) {
    .selectable thead {
      display: none !important
    }
    .miniScreen {
      label {
        display block
        width: 50%;
      }
    }
  }
</style>
