<template>
  <div class="user-table">
    <select-user :value="userid" @userChanged="userChanged" v-show="+userInfo.usertype===1"></select-user>
    <a-row>
      <a-col :span="2"></a-col>
      <a-col :span="20">
        <table class="ui selectable table">
          <thead>
          <tr>
            <th>矿池ID</th>
            <th>算法ID</th>
            <th>算法名称</th>
            <th>矿池地址</th>
            <th>错误次数</th>
            <th>平均算力</th>
            <th>操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(pool,poolIndex) in poolList" :key="pool.poolid">
            <td>
              <div class="miniScreen"><label>矿池ID</label>{{pool.poolid}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>算法ID</label>{{pool.algoid}}
              </div>
            </td>
            <td>
              <div class="miniScreen"><label>算法名称</label>{{pool.algoname}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>矿池地址</label>{{pool.pooladdr}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>错误次数</label>{{pool.error}}</div>
            </td>
            <td>
              <div class="miniScreen"><label>平均算力</label>{{pool.hashrate}}</div>
            </td>
            <td class="btns">
              <button class="btn btn-sm btn-primary" @click="modifyPool(pool)">编辑</button>
              <button class="btn btn-sm btn-danger" @click="deletePool(pool,poolIndex)">删除</button>
            </td>
          </tr>
          </tbody>
        </table>
      </a-col>
      <a-col :span="2"></a-col>
    </a-row>
    <a-row style="margin-top:10px;">
      <a-col :span="2"></a-col>
      <a-col :span="20">
        <button class="btn btn-primary btn-sm" @click="addPool()"><i class="el-icon-plus"></i>&nbsp;新增矿池</button>
      </a-col>
      <a-col :span="2"></a-col>
    </a-row>
    <el-dialog ref="dialog" :title="editTitle" :visible.sync="dialogFormVisible">
      <el-form ref="editForm" :model="editPool" status-icon label-position="right" size="mini" label-width="100px" :rules="rules">
        <el-form-item label="用户ID">
          <el-input v-model="userid" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="矿池ID" prop="poolid" v-show="editPool.poolid>0">
          <el-input v-model="editPool.poolid" autoComplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="矿池地址" prop="pooladdr">
          <el-input v-model="editPool.pooladdr" autoComplete="off"></el-input>
        </el-form-item>
        <el-form-item label="算法" prop="algoid">
          <el-select v-model="editPool.algoid" placeholder="请选择算法">
            <el-option v-for="(algo,algoIndex) in allAlgoList" :value="algo.algoid" :key="algo.algoid"
                       :label="algo.algoid+'-'+algo.algoname+'('+algo.algotype+','+algo.version+')'"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="editPool.pooluser" autoComplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="passwd">
          <el-input v-model="editPool.poolpasswd" autoComplete="off"></el-input>
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
  import SelectUser from './SelectUser'
  import {mapState, mapMutations} from 'vuex';

  let me
  export default {
    name: 'PoolTable',
    components: {SelectUser},
    data() {
      return {
        pageIndex: 1,
        totalCount: 0,
        userid: "0",
        poolList: [],
        allAlgoList: [],
        dialogFormVisible: false,
        editPool: {},//正在编辑的用户
        rules: {
          pooluser: [
            {required: true, message: '请输入用户名称', trigger: 'blur'},
          ],
          pooladdr: [
            {required: true, message: '请输入矿池地址', trigger: 'blur'}
          ],
          poolpasswd: [
            {required: true, message: '请输入用户密码', trigger: 'blur'},
          ],
          algoid: [
            {required: true, message: '请选择算法', trigger: 'blur'},
          ],
          // checkPass: [
          //   {required: true, message: '请输入确认密码', trigger: 'blur'},
          //   {validator: validatePass2, trigger: 'blur'}
          // ],
        }
      }
    },
    computed: {
      ...mapState(["userInfo", "algoList"]),
      editTitle() {
        return this.editPool.poolid > 0 ? '编辑矿池' : '新增矿池'
      }
    },
    created() {
      me = this
    },
    mounted() {
      this.getAlgoList()
      if (this.$route.query && this.$route.query.userid) {
        this.userid = this.$route.query.userid+"";
      } else {
        this.userid = this.userInfo.userid+""
      }
      this.getPoolList()
    },
    watch: {
      '$route': function (to, from) {
        if (to.query) {
          this.userid = to.query.userid;
          this.getPoolList()
        }
      }
    },
    methods: {
      ...mapMutations(['setAlgoList']),
      getAlgoList() {
        // if (this.algoList) {
        //   this.allAlgoList = this.algoList
        //   return
        // }
        this.$api.invoke("getalgolist", {userid: me.userid}).then(res => {
          if (res.retcode === 0) {
            this.allAlgoList = res.result.algo||[]
            this.setAlgoList(this.allAlgoList)
          } else {
            this.$message.error(res.mag || '获取算法列表出错')
          }
        })
      },
      getPoolList() {
        this.poolList = []
        this.$api.invoke("getpoollist", {userid: me.userid}).then(res => {
          if (res.retcode === 0) {
            this.poolList = res.result||[]
          } else {
            this.$message.error(res.mag || '获取矿池列表出错')
          }
        })
      },
      userChanged(newUser) {
        console.log("newUser", newUser)
        me.userid = newUser;
        me.getPoolList()
      },
      addPool() {
        this.editPool = {userid: me.userid, poolusername: '', pollpasswrd: '', pooladdr: '', algoid: null};
        me.showDialog();
      },
      showDialog() {
        me.dialogFormVisible = true
        if (me.$refs["editForm"]) {
          me.$refs["editForm"].clearValidate();
          me.$refs["editForm"].resetFields();
        }
      },
      modifyPool(user) {
        this.editPool = user;
        me.showDialog();
      },
      submitForm() {
        this.$refs["editForm"].validate((valid) => {
          if (!valid) {
            return false;
          }
          let params = {
            userid: me.userid,
            poolid: me.editPool.poolid,
            poolinfo: {
              algoid: me.editPool.algoid,//算法id
              pooladdr: me.editPool.pooladdr,//矿池地址
              username: me.editPool.username,//用户名
              passwd: me.editPool.passwd//密码
            }
          }

          me.$api.invoke(me.editPool.poolid > 0 ? 'editpool' : 'addpool', params).then(res => {
            if (res.retcode === 0) {
              me.$message.success('保存成功!');
              me.dialogFormVisible = false
              if (!me.editPool.poolid > 0) {
                me.poolList.push(res.result)
              }
            } else {
              me.$message.error(res.msg || '保存失败')
            }
          })
        });
      },
      deletePool(pool, poolIndex) {
        this.$confirm('此操作将永久删除该矿池, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          me.$api.invoke("delpool", {userid: me.userid, poolid: pool.poolid}).then(res => {
            if (res.retcode === 0) {
              me.poolList.splice(poolIndex, 1)
              me.$message.success('删除成功!');
            } else {
              me.$message.error(res.msg || '删除失败')
            }
          })

        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'});
        });
      },
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
