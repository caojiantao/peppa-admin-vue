<template>
  <div class="login-wrapper">
    <div class="logo">
      <img src="../assets/logo.png">
    </div>
    <el-form :model="loginForm" ref="loginForm">
      <el-form-item 
        prop="account"
        :rules="[
          {required: true, message: '账号不能为空'}
        ]"
      >
        <el-input type="text" 
          v-model="loginForm.account"
          placeholder="请输入账号"
          prefix-icon="iconfont el-icon-account">
        </el-input>
      </el-form-item>
      <el-form-item 
        prop="password"
        :rules="[
          {required: true, message: '密码不能为空'}
        ]"
      >
        <el-input type="password" 
          v-model="loginForm.password"
          placeholder="请输入密码"
          prefix-icon="iconfont el-icon-password">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="submit" type="primary" @click="submitForm('loginForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {login} from '../api/login'

  export default {
    data () {
      return {
        loginForm: {
          account: '',
          password: ''
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            login()
          } else {
            console.log('登录表单校验不通过！')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style scoped>
.login-wrapper{
  width: 400px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}

.logo{
  padding: 20px;
  text-align: center;
}

.submit{
  width: 100%;
}
</style>
