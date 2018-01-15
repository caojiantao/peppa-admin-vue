<template>
  <el-container direction="vertical">
    <MyHeader></MyHeader>
    <el-container direction="horizontal">
      <SideBar></SideBar>
      <el-main>
        <el-container direction="vertical">
          <!-- tab结合component实现动态选项卡切换组件 -->
          <el-tabs
            v-model="tabData.activeTabName"
            type="card"
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
        </el-container>
      </el-main>
    </el-container>
    <MyFooter></MyFooter>
  </el-container>
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
</style>

<script>
  import SideBar from '@/components/SideBar'
  import MyHeader from '@/components/Header'
  import MyFooter from '@/components/Footer'
  import Dictionary from '@/view/dictionary/index'
  import Songs from '@/view/simulation/kugou/songs'
  import Welcome from '@/view/welcome'

  export default {
    name: 'index',
    components: {SideBar, MyHeader, MyFooter, Dictionary, Songs, Welcome},
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
