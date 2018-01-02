<template>
  <div>
    <el-container>
      <el-header>Header</el-header>
      <el-container>
        <NavMenu></NavMenu>
        <el-main>
          <el-container>
            <el-header>
              <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>活动管理</el-breadcrumb-item>
                <el-breadcrumb-item>活动列表</el-breadcrumb-item>
                <el-breadcrumb-item>活动详情</el-breadcrumb-item>
              </el-breadcrumb>
            </el-header>
            <el-main class="content">
              main
            </el-main>
          </el-container>
        </el-main>
      </el-container>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
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
  
  .content {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  .el-breadcrumb {
    line-height: 60px;
  }
</style>


<script>
  import NavMenu from '@/components/NavMenu'

  export default {
    name: 'index',
    components: {NavMenu}
  }
</script>
