<template>
  <div class="login-wrapper">
    <div class="wrapper">
      <div class="login-content">
        <div class="login-img">
          <img src="/static/login-img.png"/>
        </div>
        <div class="login-box">
          <div class="login-logo">
            <img src="/static/login-logo.png"/>
          </div>
          <div class="system-title">
            后台管理系统
          </div>
          <el-form class="login-form" :model="user" ref="user" :rules="rules">
            <el-form-item prop="username">
              <el-input type="text" 
                v-model="user.username"
                placeholder="用户名">
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" 
                v-model="user.password"
                placeholder="密码">
              </el-input>
            </el-form-item>
            <!-- <el-form-item>
              <el-checkbox class="rememberMe" v-model="user.rememberMe">记住账号</el-checkbox>
            </el-form-item> -->
            <el-form-item>
              <el-button class="submit" type="primary" @click="submitForm('user')">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="copyright">Copyright © 2017 - 2018 <a href="http://caojiantao.com">Tao</a>. All Rights Reserved.</div>
    </div>
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
          callback(new Error('请输入用户名'))
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
          username: [{required: true, validator: valAcc}],
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
              saveToken(token, userId, this.user.rememberMe)
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
  .login-wrapper {
    height: 100vh;
    background-color: #93defe;
  }

  .wrapper {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
  }

  .login-content {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .login-box {
    background-color: #fff;
    border-radius: 6px;
    padding: 0 50px;
    padding-bottom: 20px;
    margin-left: 120px;
  }

  .login-logo {
    margin: 0 auto;
    margin-top: -60px;
    width: 120px;
    height: 120px;
    border: 5px solid #93defe;
    border-radius: 50%;
    box-sizing: border-box;
    background: #fff;
    text-align: center;
    line-height: 120px;
  }

  .login-logo img {
    vertical-align: middle;
  }

  .system-title {
    width: 100%;
    text-align: center;
    font-size: 18px;
    color: #444;
    padding: 10px 0 20px;
  }

  .login-form {
    width: 300px;
  }

  .submit {
    width: 100%;
  }

  .system-title,
  button {
    font-size: 1.2em;
  }

  .copyright {
    font-size: 14px;
    color: #fff;
    width: 100%;
    text-align: center;
    margin-top: 60px;
  }

  .copyright a {
    color: currentColor;
  }

  @media (max-width: 800px){
    .el-form{
      width: 80%;
    }
  }
</style>
