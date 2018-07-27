<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" v-if="breadcrumbs.length > 0">
    <el-breadcrumb-item
      v-for="item in breadcrumbs"
      :key="item.id">
      {{item.name}}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped>
</style>

<script>
  export default {
    name: 'Breadcrumb',
    computed: {
      breadcrumbs: function () {
        return this.$store.state.breadcrumbs
      }
    }
  }
</script>
