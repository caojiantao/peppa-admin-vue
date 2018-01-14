<template>
  <div>
    <el-header>
      <img src="../assets/dog.png" alt="logo" class="header-logo">
      <ul class="header-operations">
        <li>曹建涛</li>
        <li @click="logout()">注销</li>
      </ul>
    </el-header>
  </div>
</template>

<style scoped>
  .el-header{
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .header-logo{
    height: 80%;
    vertical-align: middle;
  }

  .header-operations{
    height: 100%;
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
  export default{
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
