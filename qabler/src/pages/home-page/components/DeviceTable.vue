<template>
  <div class="user-table">
    <a-row>
      <a-col :span="2"></a-col>
      <a-col :span="20" style="display: flex">
        <select-user :value="userid" @userChanged="userChanged" v-show="+userInfo.usertype===1"></select-user>
        <div style="padding-top: 12px;">
          <button class="btn btn-primary" @click="sendCommand('')"><i class="el-icon-s-finance"></i>&nbsp;批量发送命令</button>
        </div>
      </a-col>
      <a-col :span="2"></a-col>
    </a-row>
    <a-row>
      <a-col :span="2"></a-col>
      <a-col :span="20">
        <table class="ui selectable table">
          <thead>
          <tr>
            <th>
              <el-checkbox v-model="checkAll" @change="selectAll"></el-checkbox>
            </th>
            <th>设备ID</th>
            <th>设备UUID</th>
            <th>购买状态
              <el-tooltip class="item" effect="dark" content="绿色已购买，红色已释放可购买" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </th>
            <th>在线状态</th>
            <th>设备算力</th>
            <th>累计计算值</th>
            <th>累计工作时长</th>
            <th>接受的数量</th>
            <th>拒绝的数量</th>
            <th>接受效率</th>
            <th>当前算法</th>
            <th>算法策略</th>
            <th>当前矿池</th>
            <th>版本</th>
            <th>版本时间</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(device,deviceIndex) in deviceList" :key="deviceIndex">
            <td>
              <el-checkbox v-model="device.checked" @change="selectItem(device)"></el-checkbox>
            </td>
            <td>
              <div class="miniScreen"><label>设备ID</label>{{device.eqid}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>设备UUID</label> {{device.equuid}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>购买状态</label>
                <el-switch
                  v-model="device.buystate"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value="1" disabled
                  inactive-value="0">
                </el-switch>
              </div>
            </td>
            <td>
              <div class="miniScreen"><label>在线状态</label>
                <el-switch
                  v-model="device.online"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  active-value="1" disabled
                  inactive-value="0">
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
              <div class="miniScreen"><label>当前算法</label>{{device.algoname}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>算法策略</label>{{+device.algostrategy===0?'矿池配置':'具体算法'}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>当前矿池</label>{{device.pool}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>版本</label>{{device.version}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>版本时间</label>{{device.versiontime}}</div>
            </td>
            <td class="btns">
              <el-dropdown size="small" @command="actionHandle">
                <el-button type="primary">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-edit" :command="'chart-'+deviceIndex">设备算力折线图</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-s-promotion" divided :command="'buy-'+deviceIndex" :disabled="device.buystate==1">选购设备
                  </el-dropdown-item>
                  <el-dropdown-item icon="el-icon-delete" :command="'release-'+deviceIndex" :disabled="device.buystate==0">转让/释放设备</el-dropdown-item>
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
      <!--<a-col :span="8"></a-col>-->
      <a-col :span="20" class="text-right">
        <el-pagination layout="prev, pager, next,total" :current-page.sync="pageIndex" :total="totalCount"
                       @current-change="pageChanged"></el-pagination>
      </a-col>
      <a-col :span="2"></a-col>
    </a-row>
    <el-dialog title="发送命令" :visible.sync="dialogFormVisible">
      <el-form ref="editForm" :model="commandDevice" status-icon label-position="right" size="mini" label-width="100px" :rules="rules">
        <el-form-item label="设备类型" prop="deviceType" v-if="!commandDevice.equuid">
          <el-radio-group v-model="commandDevice.deviceType">
            <el-radio :label="1">当前已选设备</el-radio>
            <el-radio :label="2" :disabled="userid==='0'">当前用户设备</el-radio>
            <el-radio :label="3">所有用户设备</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="设备编号" prop="equuid" v-else>
          <el-input v-model="commandDevice.equuid" placeholder="请输入设备编号"></el-input>
        </el-form-item>
        <el-form-item label="选择命令" prop="command">
          <el-select v-model="commandDevice.command" placeholder="请选择" @change="commandChanged">
            <el-option
              v-for="(cmd,cmdIndex) in commandList"
              :key="cmd.label"
              :label="cmd.label"
              :value="cmd.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="命令类型" prop="cmdtype">
          <el-radio-group v-model="commandDevice.cmdtype" :disabled="true">
            <el-radio label="ctrl">控制指令</el-radio>
            <el-radio label="diy">自定义指令</el-radio>
            <el-radio label="shell">shell指令</el-radio>
            <el-radio label="sys">系统指令</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="命令方法" prop="method">
          <el-input v-model="commandDevice.method" placeholder="请输入命令方法"></el-input>
        </el-form-item>
        <el-form-item label="命令参数" prop="data">
          <el-input v-model="commandDevice.data" placeholder="请输入命令参数"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="配置算法策略" :visible.sync="dialogFormVisible2">
      <el-form ref="editForm2" :model="algoDevice" status-icon label-position="right" size="mini" label-width="100px" :rules="rules">
        <el-form-item label="设备编号" prop="equuid">
          <el-input v-model="algoDevice.equuid" placeholder="请输入设备编号"></el-input>
        </el-form-item>
        <el-form-item label="算法策略" prop="algostrategy">
          <el-radio-group v-model="algoDevice.algostrategy">
            <el-radio :label="0">根据矿池自动配置</el-radio>
            <el-radio :label="1">指定算法名</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="算法名称" prop="algoname">
          <el-select v-model="algoDevice.algoname" placeholder="请选择" :disabled="algoDevice.algostrategy==0">
            <el-option v-for="(algo,algoIndex) in allAlgoList" :value="algo.algoname" :key="algo.algoname"
                       :label="algo.algoname"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="changeAlgo()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="设备算力图" :visible.sync="dialogFormVisible3">
      <q-basic-line-chart ref="chart" :equuid="chartEquuid"></q-basic-line-chart>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible3 = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  // import md5 from 'md5'
  import SelectUser from './SelectUser'
  import QBasicLineChart from '@/components/q-chart/q-line-chart/QBasicLineChart.vue'

  const PAGE_SIZE = 20;
  let me
  export default {
    name: 'DeviceTable',
    components: {SelectUser, QBasicLineChart},
    data() {
      return {
        checkAll: false,
        batchType: 1,
        userid: "0",
        pageIndex: 1,
        totalCount: 0,
        deviceList: [],
        dialogFormVisible: false,
        dialogFormVisible2: false,
        commandDevice: {deviceType: 1},//正在编辑的用户
        algoDevice: {equuid: ''},
        dialogFormVisible3: false,
        chartEquuid: '',
        commandList: [],
        allAlgoList: [],
        rules: {
          command: [
            {required: true, message: '请选择命令类型', trigger: 'blur'},
          ],
          method: [
            {required: true, message: '请输入命令内容', trigger: 'blur'},
          ]
        }
      }
    },
    computed: {
      ...mapState(["userInfo"]),
      editTitle() {
        return this.commandDevice.userid > 0 ? '编辑用户' : '新增用户'
      }
    },
    created() {
      me = this
      this.getCommandList()
      this.getAlgoList()
    },
    mounted() {
      if (this.$route.query && this.$route.query.userid) {
        this.userid = this.$route.query.userid + "";
      } else {
        this.userid = this.userInfo.usertype == 1 ? "0" : this.userInfo.userid + ""
      }
      this.getDeviceList()
    },
    watch: {
      '$route': function (to, from) {
        if (to.query) {
          this.userid = to.query.userid + "";
          this.getDeviceList()
        }
      },
      "chartEquuid"() {
        this.$refs['chart'].getData()
      }
    },
    methods: {
      getAlgoList() {
        this.$api.invoke("getalgolist", {userid: me.userid}).then(res => {
          if (res.retcode === 0) {
            this.allAlgoList = res.result.algo || []
          } else {
            this.$message.error(res.mag || '获取算法列表出错')
          }
        })
      },
      getCommandList() {
        this.$api.invoke("getcmdlist").then(res => {
          if (res.retcode === 0) {
            let list = res.result || []
            list.forEach((v, index) => {
              v.label = (index + 1) + '-' + v.cmdtype + '-' + v.cmddata.method//+'<'+(v.cmddata.data?v.cmddata.data:'无')+'>'
            })
            this.commandList = list
          } else {
            this.$message.error(res.mag || '获取命令列表出错')
          }
        })
      },
      getDeviceList() {
        this.deviceList = []
        this.$api.invoke("getequiplist", {"index": this.pageIndex, "count": PAGE_SIZE, userid: me.userid}).then(res => {
          if (res.retcode === 0) {
            this.totalCount = res.result.totalcount
            let list = res.result.eqlist || []
            list.forEach(v => {
              v.checked = false
            })
            this.deviceList = list
          } else {
            this.$message.error(res.mag || '获取设备列表出错')
          }
        })
      },
      selectAll(value) {
        // this.checkAll = value
        this.deviceList.forEach(v => {
          v.checked = value
        })
      },
      selectItem(device) {
        this.checkAll = this.deviceList.every(v => {
          return v.checked
        })
      },
      commandChanged(value) {
        let index = this.commandDevice.command.split('-')[0] * 1 - 1
        let command = this.commandList[index]
        this.$set(this.commandDevice, 'cmdtype', command.cmdtype)
        this.$set(this.commandDevice, 'method', command.cmddata.method || '')
        this.$set(this.commandDevice, 'data', command.cmddata.data || '')
      },
      sendCommand(equuid) {
        me.$set(me.commandDevice, 'equuid', equuid || '')
        me.showDialog();
      },
      showDialog() {
        me.dialogFormVisible = true
        if (me.$refs["editForm"]) {
          me.$refs["editForm"].clearValidate();
          // me.$refs["editForm"].resetFields();
        }
      },
      userChanged(newUser) {
        me.userid = newUser;
        me.getDeviceList()
        if (me.userid === '0' && me.commandDevice.deviceType === 2) {
          me.$set(me.commandDevice, 'deviceType', 1)
        }
      },
      submitForm() {
        this.$refs["editForm"].validate((valid) => {
          if (!valid) {
            return false;
          }
          if (!this.commandDevice.method) {
            this.$message.warning('请输入具体方法和参数')
            return
          }
          let params = {
            allequip: +me.commandDevice.deviceType === 3 ? 1 : 0,
            cmd: {
              cmdtype: me.commandDevice.cmdtype,
              cmddata: {method: me.commandDevice.method, data: me.commandDevice.data}
            }
          }
          if (me.commandDevice.equuid) {
            params.eqlist = []
            params.eqlist.push(me.commandDevice.equuid)
            params.allequip = 0
          }
          else if (+me.commandDevice.deviceType === 1) {//当前已选设备
            params.eqlist = []
            me.deviceList.forEach(v => {
              if (v.checked) {
                params.eqlist.push(v.equuid)
              }
            })
            if (params.eqlist.length === 0) {
              this.$message.warning('请选择至少一个设备')
              return
            }
          } else if (+me.commandDevice.deviceType === 2) {//当前用户所有已选设备{
            params.userlist = [me.userid]
          }

          me.$api.invoke('sendequipcmd', params).then(res => {
            if (res.retcode === 0) {
              me.$message.success('命令发送成功!');
              me.dialogFormVisible = false
            } else {
              me.$message.error(res.msg || '命令发送失败')
            }
          })
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
          me.chartEquuid = device.equuid;
          me.dialogFormVisible3 = true
        } else if (action === 'buy') {//选购设备
          me.buyDevice(device)
        } else if (action === 'release') {//转让释放设备
          me.releaseDevice(device)
        } else if (action === 'algo') {//配置设备算法
          me.algoDevice = {equuid: device.equuid, algostrategy: +device.algostrategy, algoname: device.algoname}
          me.dialogFormVisible2 = true
        } else if (action === 'command') {//发送指令
          me.sendCommand(device.equuid)
        }
      },
      buyDevice(device) {
        let equuid = device.equuid
        this.$prompt('请输入购买密码（设备ID：' + equuid + '）', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\w+$/,
          inputErrorMessage: '密码不能为空'
        }).then(({value}) => {
          if (!value) {
            me.$message.warning('密码不能为空')
            return
          }
          me.$api.invoke("buyequip", {equuid: equuid, buypasswd: value}).then(res => {
            if (res.retcode === 0) {
              me.$set(device, 'buystate', 1)
              me.$message.success('购买成功!');
            } else {
              me.$message.error(res.msg || '购买失败')
            }
          })
        }).catch(() => {
        });
      },
      releaseDevice(device) {
        this.$confirm('此操作将释放此设备, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          me.$api.invoke("freeequip", {epid: device.epid, epuuid: device.epuuid, destuserid: 0}).then(res => {
            if (res.retcode === 0) {
              me.$set(device, 'buystate', 0)
              me.$message.success('释放成功!');
            } else {
              me.$message.error(res.msg || '释放失败')
            }
          })
        })
      },
      changeAlgo() {
        if (!this.algoDevice.equuid) {
          this.$message.warning('请输入具体设备ID')
          return
        }
        if (+this.algoDevice.algostrategy === 0 && !this.algoDevice.algoname) {
          this.$message.warning('请选择具体算法')
          return
        }

        me.$api.invoke('setequipalgo', this.algoDevice).then(res => {
          if (res.retcode === 0) {
            me.$message.success('算法修改成功!');
            me.dialogFormVisible2 = false
            me.deviceList.forEach(v => {
              if (v.equuid === me.algoDevice.equuid) {
                me.$set(v, "algostrategy", me.algoDevice.algostrategy)
                me.$set(v, "algoname", me.algoDevice.algoname)
              }
            })
          } else {
            me.$message.error(res.msg || '算法修改失败')
          }
        })
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
