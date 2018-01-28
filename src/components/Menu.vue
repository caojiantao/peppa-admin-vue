<template>
  <el-submenu v-if="menu.children && menu.children.length > 0" :index="menu.name">
    <template slot="title"><i :class="menu.iconClass"></i>{{menu.name}}</template>
    <Menu v-for="subMenu in menu.children" :key="subMenu.id" :menu="subMenu"></Menu>
  </el-submenu>

  <el-menu-item v-else :index="menu.href" @click="selectItem(menu)">
    <i :class="menu.iconClass"></i>{{menu.name}}
  </el-menu-item>
</template>

<script>
  export default {
    name: 'Menu',
    props: ['menu'],
    methods: {
      // 选择最底层菜单节点
      selectItem (menu) {
        let tabs = this.$store.state.tabData.tabs
        let exist = false
        for (let i = 0; i < tabs.length; i++) {
          // 遍历当前tabs，找到改变激活tabName即可
          let tab = tabs[i]
          // 将menuId作为tab唯一标识符，特别注意数字字符串转换
          let tabStr = String(menu.id)
          if (tabStr === tab.name) {
            this.$store.commit('updateActiveTabName', tabStr)
            exist = true
            break
          }
        }
        // 不存在点击的tab即手动添加tab并打开
        if (!exist) {
          this.$store.commit('addTab', {
            tabs: {
              title: menu.name,
              name: String(menu.id),
              content: menu.href,
              closable: true
            },
            activeTabName: String(menu.id)
          })
        }
      }
    }
  }
</script>

