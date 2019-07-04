<template>
  <div class="user-table">
    <select-user :value="userid" @userChanged="userChanged" v-show="+userInfo.usertype===1"></select-user>
    <a-row>
      <a-col :span="2"></a-col>
      <a-col :span="20">
        <table class="ui selectable table">
          <thead>
          <tr>
            <th>设备ID</th>
            <th>设备UUID</th>
            <th>设备状态</th>
            <th>设备算力</th>
            <th>累计计算值</th>
            <th>累计工作时长</th>
            <th>接受的数量</th>
            <th>拒绝的数量</th>
            <th>接受效率</th>
            <th>当前算法</th>
            <th>算法策略</th>
            <th>当前矿池</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(device,deviceIndex) in deviceList" :key="deviceIndex">
            <td>
              <div class="miniScreen"><label>设备ID</label>{{device.eqid}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>设备UUID</label> {{device.equuid}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>设备状态</label>
                <el-switch
                  v-model="device.buystate"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :active-value="1" active-text="已购"
                  :inactive-value="0" inactive-text="出让">
                </el-switch>
              </div>
            </td>
            <td>
              <div class="miniScreen"><label>设备算力</label>{{device.hashrate}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>累计计算值</label>{{device.hashtotal}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>累计工作时长</label>{{device.worktime}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>接受的数量</label>{{device.accept}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>拒绝的数量</label>{{device.reject}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>接受效率</label>{{device.acceptrate}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>当前算法</label>{{device.algo}}</div>
            </td> <td>
            <div class="miniScreen"><label>算法策略</label>{{device.algostrategy}}</div>
          </td>
            <td>
              <div class="miniScreen"><label>当前矿池</label>{{device.pool}}</div>
            </td>
            <td class="btns">
              <el-dropdown size="small" @command="actionHandle">
                <el-button type="primary">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-edit" :command="'chart-'+deviceIndex">设备算力折线图</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-edit" divided :command="'buy-'+deviceIndex" :disabled="true">选购设备</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-delete" :command="'release-'+deviceIndex">转让/释放设备</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-office-building" :command="'algo-'+deviceIndex">配置算法策略</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-help" :command="'command-'+deviceIndex">发送设备指令</el-dropdown-item>
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
        <!--<button class="btn btn-primary btn-sm" @click="addDevice()"><i class="el-icon-plus"></i>&nbsp;新增用户</button>-->
      </a-col>
      <a-col :span="16" class="text-right">
        <el-pagination layout="prev, pager, next,total" :current-page.sync="pageIndex" :total="totalCount"
                       @current-change="pageChanged"></el-pagination>
      </a-col>
      <a-col :span="2"></a-col>
    </a-row>
    <el-dialog ref="dialog" :title="editTitle" :visible.sync="dialogFormVisible">
      <el-form ref="editForm" :model="editDevice" status-icon label-position="right" size="mini" label-width="100px" :rules="rules">
        <el-form-item label="用户名称" prop="username">
          <el-input required v-model="editDevice.username" autoComplete="off" :disabled="editDevice.userid>0"></el-input>
        </el-form-item>
        <el-form-item label="电子邮件" prop="email">
          <el-input type="email" v-model="editDevice.email" autoComplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="usertype">
          <el-radio-group v-model="editDevice.usertype" :disabled="userInfo.usertype===2">
            <el-radio :label="1">管理员</el-radio>
            <el-radio :label="2">普通用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="editDevice.phone" autoComplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="passwd"
                      :rules="editDevice.userid>0?[{validator: validatePass, trigger: 'blur'}]:[
                      {required: true, message: '请输入用户密码', trigger: 'blur'},
                      {validator: validatePass, trigger: 'blur'}]">
          <el-input type="password" v-model="editDevice.passwd" autoComplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" :rules="editDevice.userid>0?[{validator: validatePass2, trigger: 'blur'}]:[
            {required: true, message: '请输入确认密码', trigger: 'blur'},
            {validator: validatePass2, trigger: 'blur'}
          ]">
          <el-input type="password" v-model="editDevice.checkPass" autoComplete="off"></el-input>
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
  import {mapState} from 'vuex';
  import md5 from 'md5'
  import SelectUser from './SelectUser'

  const PAGE_SIZE = 20;
  let me
  export default {
    name: 'DeviceTable',
    components: {SelectUser},
    data() {
      return {
        userid: 0,
        pageIndex: 1,
        totalCount: 0,
        deviceList: [],
        dialogFormVisible: false,
        editDevice: {},//正在编辑的用户
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
        return this.editDevice.userid > 0 ? '编辑用户' : '新增用户'
      }
    },
    created() {
      me = this
    },
    mounted() {
      if (this.$route.query && this.$route.query.userid) {
        this.userid = +this.$route.query.userid;
      } else {
        this.userid = +this.userInfo.userid
      }
      this.getDeviceList()
    },
    watch: {
      '$route': function (to, from) {
        if (to.query) {
          this.userid = +to.query.userid;
          this.getDeviceList()
        }
      }
    },
    methods: {
      validatePass(rule, value, callback) {
        if (value === '') {
          callback();
        } else {
          if (this.editDevice.checkPass !== '') {
            this.$refs.editForm.validateField('checkPass');
          }
          callback();
        }
      },
      validatePass2(rule, value, callback) {
        if (value !== this.editDevice.passwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      },
      getDeviceList() {
        this.deviceList = []
        this.$api.invoke("getequiplist", {"index": this.pageIndex, "count": PAGE_SIZE, userid: me.userid}).then(res => {
          if (res.retcode === 0) {
            this.totalCount = res.result.totalcount
            this.deviceList = res.result.eqlist
          } else {
            this.$message.error(res.mag || '获取设备列表出错')
          }
        })
      },
      addDevice() {
        this.editDevice = {email: '', phone: '', passwrd: '', usertype: 2, checkPass: ''};
        me.showDialog();
      },
      showDialog() {
        me.dialogFormVisible = true
        if (me.$refs["editForm"]) {
          me.$refs["editForm"].clearValidate();
          me.$refs["editForm"].resetFields();
        }
      },
      modifyDevice(user) {
        this.editDevice = user;
        me.showDialog();
      },
      userChanged(newUser) {
        me.userid = newUser;
        me.getDeviceList()
      },
      submitForm() {
        this.$refs["editForm"].validate((valid) => {
          if (!valid) {
            return false;
          }
          let params = {username: me.editDevice.username, email: me.editDevice.email, phone: me.editDevice.phone, usertype: me.editDevice.usertype}
          if (me.editDevice.userid) {
            params.userid = me.editDevice.userid
          }
          if (me.editDevice.passwd) {
            params.passwd = md5(me.editDevice.passwd)
          }
          me.$api.invoke('edituserinfo', params).then(res => {
            if (res.retcode === 0) {
              me.$message.success('保存成功!');
              me.dialogFormVisible = false
              if (!me.editDevice.userid) {
                me.getDeviceCount()
                me.getDeviceList()
              }
            } else {
              me.$message.error(res.msg || '保存用户失败')
            }
          })
        });
      },
      deleteDevice(user, userIndex) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          me.$api.invoke("deluser", {userid: user.userid}).then(res => {
            if (res.retcode === 0) {
              me.deviceList.splice(userIndex, 1)
              me.$message.success('删除成功!');
            } else {
              me.$message.error(res.msg || '删除用户失败')
            }
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      pageChanged(page) {
        me.pageIndex = page;
        me.getDeviceList();
      },
      actionHandle(command) {
        let action = command.split('-')[0]
        let index = command.split('-')[1]
        let device = this.deviceList[index]
        if (action === 'chart') {//设备算力图

        } else if (action === 'buy') {//选购设备

        } else if (action === 'release') {//转让释放设备

        } else if (action === 'algo') {//配置设备算法

        } else if (action === 'command') {//发送指令

        }
      }
    }

  }
</script>

<style lang="stylus" scoped>
  .el-collapse-item
    border-bottom: 1px solid #EEE;
  .user-table
    margin: 30px auto
  .selectable
    border-radius: 0
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
    word-break: break-all;
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
