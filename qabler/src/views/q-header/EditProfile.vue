<template>
  <div class="home">
    <el-dialog ref="dialog" title="个人信息" :visible.sync="value">
      <el-form ref="editForm" :model="editUser" status-icon label-position="right" size="mini" label-width="100px" :rules="rules">
        <el-form-item label="用户名称" prop="username">
          <el-input required v-model="editUser.username" autoComplete="off" :disabled="editUser.userid>0"></el-input>
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
                      :rules="[{validator: validatePass, trigger: 'blur'}]">
          <el-input type="password" v-model="editUser.passwd" autoComplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" :rules="[{validator: validatePass2, trigger: 'blur'}]">
          <el-input type="password" v-model="editUser.checkPass" autoComplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideProfile">取 消</el-button>
        <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapMutations, mapState} from 'vuex';

  let me
  export default {
    name: 'EditProfile',
    components: {},
    props: {
      value: {type: Boolean, default: false}
    },
    data() {
      return {
        editUser: {},
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
        }
      }
    },
    computed: {
      ...mapState(["userInfo"])
    },
    created() {
      me = this
    },
    mounted() {
      this.editUser = this.userInfo
      if (!this.editUser.registtime) {
        this.$api.invoke('getuserinfo', {userid: this.userInfo.userid}).then(res => {
          if (res.retcode === 0) {
            this.setUserInfo(res.result)
            this.editUser = res.result
          }
        })
      }
    },
    methods: {
      ...mapMutations(['setUserInfo']),
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
      hideProfile() {
        // this.value = false
        this.$emit('input', false)
      },
      submitForm() {
        this.$refs["editForm"].validate((valid) => {
          if (!valid) {
            return false;
          }
          let params = {username: me.editUser.username, email: me.editUser.email, phone: me.editUser.phone, usertype: me.editUser.usertype}
          params.userid = me.editUser.userid
          if (me.editUser.passwd) {
            params.passwd = md5(me.editUser.passwd)
          }
          me.$api.invoke('edituserinfo', params).then(res => {
            if (res.retcode === 0) {
              me.$message.success('保存成功!');
              me.hideProfile()
              me.setUserInfo(me.editUser)
            } else {
              me.$message.error(res.msg || '保存失败')
            }
          })
        });
      },
    }
  }
</script>

<style lang="stylus" scoped>
</style>
