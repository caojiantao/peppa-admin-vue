<template>
  <el-submenu v-if="menu.children.length > 0" :index="menu.name">
    <template slot="title"><i :class="menu.iconClass"></i>{{menu.name}}</template>
    <Menu v-for="subMenu in menu.children" :key="subMenu.id" :menu="subMenu"></Menu>
  </el-submenu>

  <el-menu-item v-else :index="menu.href">
    <i :class="menu.iconClass"></i>{{menu.name}}
  </el-menu-item>
</template>

<<script>
export default {
  name: 'Menu',
  props: ['menu']
}
</script>

