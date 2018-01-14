<template>
  <el-aside width="250px">
    <el-menu router>
      <!-- 递归菜单 -->
      <MyMenu v-for="menu in menus" :key="menu.id" :menu="menu"></MyMenu>
    </el-menu>
  </el-aside>
</template>

<style scoped>
  .el-aside {
    height: inherit;
    color: #333;
    border-right: 1px solid #e6e6e6;
    background-color: #D3DCE6;
  }

  .el-menu{
    border-right: none;
  }
</style>

<script>
  import ajax from '@/utils/ajax'
  import MyMenu from '@/components/Menu'

  /**
   * 获取菜单信息
   */
  function listMenu () {
    return ajax({
      url: '/menus',
      method: 'get'
    })
  }

  export default {
    data () {
      return {
        menus: null
      }
    },
    created: function () {
      let promise = listMenu()
      // let $router = this.$router
      promise.then(value => {
        this.menus = value.data
      }, error => {
        let response = error.response
        this.$message({
          message: response.data,
          type: 'error',
          duration: 2000,
          onClose: function (message) {
            // $router.push('/login')
            console.log(message)
          }
        })
      })
    },
    components: {MyMenu}
  }
</script>
