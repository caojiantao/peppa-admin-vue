<template>
  <el-aside width="250px">
    <el-menu>
      <!-- 递归菜单 -->
      <MyMenu 
        v-for="menu in treeData" 
        :key="menu.id" 
        :menu="menu">
      </MyMenu>
    </el-menu>
  </el-aside>
</template>

<style scoped>
  .el-aside {
    height: calc(100vh - 60px);
    background-color: #D3DCE6;
  }
</style>

<script>
  import ajax from '@/utils/ajax'
  import MyMenu from '@/components/Menu'
  import {getUserId} from '@/utils/auth'
  import {getTreeData} from '@/utils/common'

  export default {
    data () {
      return {
        menus: []
      }
    },
    created: function () {
      ajax({
        url: '/users/' + getUserId() + '/menus',
        method: 'get'
      }).then(value => {
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
    components: {MyMenu},
    computed: {
      // 计算菜单树数据
      treeData: function () {
        return getTreeData(this.menus)
      }
    }
  }
</script>
