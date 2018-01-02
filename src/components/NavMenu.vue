<template>
  <div>
    <el-aside width="200px">
      <el-menu router>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-message"></i>导航</template>
          <el-menu-item-group title="分组1">
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <template slot="title"><i class="el-icon-message"></i>导航二</template>
            <el-menu-item index="1-3-1">选项4-1</el-menu-item>
          </el-submenu>
        </el-submenu>
      </el-menu>
    </el-aside>
  </div>
</template>

<style scoped>
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    line-height: 200px;
  }
</style>

<script>
  import ajax from '@/utils/ajax'

  function listMenu () {
    window.localStorage.clear()
    return ajax({
      url: '/menus',
      method: 'get'
    })
  }

  export default {
    created: function () {
      let promise = listMenu()
      let $router = this.$router
      promise.then(value => {
        let menus = value.data
        console.log(menus)
      }, error => {
        let response = error.response
        this.$message({
          message: response.data,
          type: 'error',
          duration: 1000,
          onClose: function (message) {
            $router.push('/login')
          }
        })
      })
    }
  }
</script>
