<template>
  <el-container direction="vertical">
    <MyHeader></MyHeader>
    <el-container direction="horizontal">
      <SideBar></SideBar>
      <el-main>
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right" v-if="breadcrumbs.length > 0">
          <el-breadcrumb-item
            v-for="item in breadcrumbs"
            key="item.id"
            >
            {{item.name}}
          </el-breadcrumb-item>
        </el-breadcrumb> -->
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
  export default {
    name: 'index',
    components: {
      SideBar: () => import('@/components/SideBar'),
      MyHeader: () => import('@/components/Header'),
      Breadcrumb: () => import('@/components/Breadcrumb')
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
