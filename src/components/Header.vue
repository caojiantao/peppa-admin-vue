<template>
  <div>
    <el-header>
      <b>PEPPA</b>
      <ul class="header-operations">
        <li>{{user.nickname}}</li>
        <li @click="logout()">注销</li>
      </ul>
    </el-header>
  </div>
</template>

<style scoped>
  .el-header{
    background-color: rgb(64, 158, 255);
    color: #fff;
    line-height: 60px;
  }

  .header-operations{
    float: right;
    margin: 0;
    padding-right: 1em;
  }
  .header-operations li{
    float: left;
    margin: 0 5px;
    padding: 0 5px;
    list-style: none;
  }

  .header-operations li:hover{
    cursor: pointer;
  }
</style>

<script>
  import ajax from '@/utils/ajax'
  import {getUserId} from '@/utils/auth'

  export default{
    mounted () {
      let promise = ajax({
        url: '/users/' + getUserId(),
        method: 'get'
      })
      promise.then(value => {
        this.user = value.data
      }, error => {
        let response = error.response
        this.$message({
          message: response.data,
          type: 'error'
        })
      })
    },
    data () {
      return {
        user: {}
      }
    },
    methods: {
      // 注销用户
      logout () {
        window.localStorage.clear()
        window.sessionStorage.clear()
        this.$router.push('/login')
      }
    }
  }
</script>
