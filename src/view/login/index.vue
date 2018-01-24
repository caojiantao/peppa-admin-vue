<template>
  <div class="login-wrapper">
    <div class="logo">
      <img src="../../assets/peppa.png">
    </div>
    <el-form :model="user" ref="user" :rules="rules">
      <el-form-item prop="username">
        <el-input type="text" 
          v-model="user.username"
          placeholder="请输入账号"
          prefix-icon="iconfont el-icon-account">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" 
          v-model="user.password"
          placeholder="请输入密码"
          prefix-icon="iconfont el-icon-password">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-checkbox class="rememberMe" v-model="user.rememberMe">7天免登陆</el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button class="submit" type="primary" @click="submitForm('user')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import ajax from '@/utils/ajax'
  import {saveToken} from '@/utils/auth'

  function login (user) {
    return ajax({
      method: 'post',
      url: '/session',
      data: user
    })
  }

  export default {
    data () {
      const valAcc = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('请输入账号'))
        } else {
          callback()
        }
      }
      const valPass = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('请输入密码'))
        } else {
          callback()
        }
      }

      return {
        // 登录人
        user: {
          username: '',
          password: '',
          rememberMe: false
        },
        rules: {
          account: [{required: true, validator: valAcc}],
          password: [{required: true, validator: valPass}]
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let promise = login(this.user)
            promise.then(value => {
              // 根据记住状态设置token存储位置
              let token = value.data.token
              let userId = value.data.userId
              saveToken(token, userId, this.rememberMe)
              this.$router.push('/')
            }, error => {
              let response = error.response
              this.$message({
                message: response.data,
                type: 'error'
              })
            })
          } else {
            console.log('登录表单校验不通过！')
            return false
          }
        })
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
    transform: translateX(-50%) translateY(-55%);
  }

  .logo{
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }

  .logo img{
    width: 100%;
  }

  .rememberMe{
    float: right;
  }

  .submit{
    width: 100%;
  }
</style>
