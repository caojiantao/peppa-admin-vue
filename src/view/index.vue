<template>
  <el-container direction="vertical">
    <MyHeader></MyHeader>
    <el-container direction="horizontal">
      <SideBar></SideBar>
      <el-main>
        <el-container direction="vertical">
          <router-view/>
        </el-container>
      </el-main>
    </el-container>
    <MyFooter></MyFooter>
  </el-container>
</template>

<style scoped>
  .el-main {
    padding-right: 0
  }

  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    line-height: 200px;
  }
</style>


<script>
  import SideBar from '@/components/SideBar'
  import MyHeader from '@/components/Header'
  import MyFooter from '@/components/Footer'

  export default {
    name: 'index',
    components: {SideBar, MyHeader, MyFooter}
  }
</script>
