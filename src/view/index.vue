<template>
  <el-container direction="vertical">
    <MyHeader></MyHeader>
    <el-container direction="horizontal">
      <SideBar></SideBar>
      <el-main>
       <router-view/>
      </el-main>
    </el-container>
    <!-- <MyFooter></MyFooter> -->
  </el-container>
</template>

<style scoped>
  .el-main {
    height: calc(100vh - 60px);
  }

  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
</style>

<script>
  export default {
    name: 'index',
    components: {
      SideBar: () => import('@/components/SideBar'),
      MyHeader: () => import('@/components/Header'),
      Resources: () => import('@/view/qiniu/resources')
    },
    data () {
      return {
      }
    },
    methods: {
    }
  }
</script>
