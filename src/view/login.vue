<template>
  <div id="login-wrapper">
    <div id="logo">
      <img src="../assets/logo.png">
    </div>
    <el-form :model="loginForm" ref="loginForm" label-width="60px">
      <el-form-item 
        label="账号"
        prop="account"
        :rules="[
          {required: true, message: '账号不能为空'}
        ]"
      >
        <el-input type="text" v-model="loginForm.account"></el-input>
      </el-form-item>
      <el-form-item 
        label="密码"
        prop="password"
        :rules="[
          {required: true, message: '密码不能为空'}
        ]"
      >
        <el-input type="password" v-model="loginForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('loginForm')">提交</el-button>
        <el-button @click="resetForm('loginForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
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
            alert('submit!')
          } else {
            console.log('error submit!!')
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
#login-wrapper{
  width: 400px;
  margin: 0 auto;
}

#logo{
  text-align: center;
}
</style>

