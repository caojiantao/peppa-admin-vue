<template>
<el-container direction="vertical">
  <el-header>
    <Breadcrumb></Breadcrumb>
  </el-header>
  <el-main class="content">
    main
  </el-main>
</el-container>
</template>

<<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-breadcrumb {
    line-height: 60px;
  }
  
  .content {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
</style>


<<script>
  import Breadcrumb from '@/components/Breadcrumb'

  export default {
    components: {Breadcrumb}
  }
</script>

