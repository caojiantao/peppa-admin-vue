<template>
  <el-container direction="vertical">
    <MyHeader></MyHeader>
    <el-container direction="horizontal">
      <SideBar></SideBar>
      <el-main>
        <Breadcrumb></Breadcrumb>
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

  .el-breadcrumb {
    margin-bottom: 20px;
  }
</style>

<script>
  import SideBar from '@/components/SideBar'
  import MyHeader from '@/components/Header'
  import Breadcrumb from '@/components/Breadcrumb'

  export default {
    name: 'index',
    components: {
      SideBar,
      MyHeader,
      Breadcrumb
    },
    data () {
      return {
      }
    },
    computed: {
      breadcrumbs: function () {
        return this.$store.state.breadcrumbs
      }
    }
  }
</script>
