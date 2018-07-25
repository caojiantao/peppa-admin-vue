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
  import {getTreeData, getBreadcrumb} from '@/utils/common'

  export default {
    data () {
      return {
        menus: [],
        menuMap: {}
      }
    },
    beforeCreate: function () {
      ajax({
        url: '/users/' + getUserId() + '/menus',
        method: 'get'
      }).then(value => {
        let result = value.data
        if (result.success) {
          let menus = result.data
          let menuMap = {}
          for (let i in menus) {
            menuMap[menus[i].id] = menus[i]
          }
          this.menuMap = menuMap
          this.$store.commit('setBreadcrumbs', getBreadcrumb(this.$route.path, menuMap))
          this.menus = menus
        } else {
          this.$message({
            message: result.msg,
            type: 'error'
          })
        }
      })
    },
    components: {MyMenu},
    computed: {
      // 计算菜单树数据
      treeData: function () {
        return getTreeData(this.menus)
      }
    },
    watch: {
      '$route': function (to, cur) {
        this.$store.commit('setBreadcrumbs', getBreadcrumb(to.path, this.menuMap))
      }
    }
  }
</script>
