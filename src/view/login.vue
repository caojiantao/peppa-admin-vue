<template>
  <div id="login-wrapper">
    <img src="../assets/logo.png">
    <el-form label-width="80px">
      <el-form-item label="账号">
        <el-input></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">提交</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    }
  }
</script>

<style>
#login-wrapper{
  width: 700px;
  margin: 0 auto;
}
</style>

