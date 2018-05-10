<template>
  <el-container direction="vertical">
    <MyHeader></MyHeader>
    <el-container direction="horizontal">
      <SideBar></SideBar>
      <el-main>
        <!-- tab结合component实现动态选项卡切换组件 -->
        <el-tabs
          v-model="tabData.activeTabName"
          @tab-remove="removeTab">
          <el-tab-pane
            v-for="tab in tabData.tabs"
            :key="tab.name"
            :label="tab.title"
            :name="tab.name"
            :closable="tab.closable">
            <component :is="tab.content"></component>
          </el-tab-pane>
        </el-tabs>
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
  // import SideBar from '@/components/SideBar'
  // import MyHeader from '@/components/Header'
  // import MyFooter from '@/components/Footer'
  // import Menus from '@/view/security/menu'
  // import Role from '@/view/security/role'
  // import User from '@/view/security/user'

  // import Welcome from '@/view/welcome'
  // import Dictionary from '@/view/dictionary/index'
  // import Songs from '@/view/simulation/kugou/songs'
  // import Mv from '@/view/simulation/kugou/mv'
  // import Girls from '@/view/simulation/welfare/girls'
  // import Resources from '@/view/qiniu/resources'
  // import Job from '@/view/quartz/job'
  // import DictSet from '@/view/system/dictionary/dictSet'
  // import DictValue from '@/view/system/dictionary/dictValue'

  export default {
    name: 'index',
    components: {
      SideBar: () => import('@/components/SideBar'),
      MyHeader: () => import('@/components/Header'),
      MyFooter: () => import('@/components/Footer'),
      Dictionary: () => import('@/view/dictionary/index'),
      Songs: () => import('@/view/simulation/kugou/songs'),
      Welcome: () => import('@/view/welcome'),
      Menus: () => import('@/view/security/menu'),
      Role: () => import('@/view/security/role'),
      User: () => import('@/view/security/user'),
      Resources: () => import('@/view/qiniu/resources'),
      Job: () => import('@/view/quartz/job'),
      Girls: () => import('@/view/simulation/welfare/girls'),
      Mv: () => import('@/view/simulation/kugou/mv'),
      DictSet: () => import('@/view/system/dictionary/dictSet'),
      DictValue: () => import('@/view/system/dictionary/dictValue')
    },
    data () {
      return {
        tabData: this.$store.state.tabData
      }
    },
    methods: {
      removeTab (name) {
        let tabData = this.tabData
        // 移除的tab是否为当前tab
        if (name === tabData.activeTabName) {
          tabData.tabs.forEach((tab, index) => {
            if (tab.name === name) {
              let nextTab = tabData.tabs[index + 1] || tabData.tabs[index - 1]
              this.$store.commit('updateActiveTabName', nextTab.name)
            }
          })
        }
        // 注意更新store全局tabs
        this.$store.commit('removeTab', name)
      }
    }
  }
</script>
