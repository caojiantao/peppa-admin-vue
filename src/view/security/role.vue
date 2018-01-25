<template>
<el-container direction="vertical">
  <el-main class="content">
    <el-form inline>
      <el-form-item label="角色名">
        <el-input v-model="name" placeholder="请输入角色名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="tableData.data">
      <el-table-column
        prop="id"
        label="ID">
      </el-table-column>
      <el-table-column
        prop="name"
        label="角色名">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="changeSize"
      @current-change="changePage"
      :current-page="tableData.page"
      :page-size="tableData.pagesize"
      :page-sizes="tableData.pagesizes"
      :total="tableData.total"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </el-main>
</el-container>
</template>

<style scoped>
  
  .content {
    background-color: #E9EEF3;
    color: #333;
  }
</style>


<script>
  import ajax from '@/utils/ajax'

  export default {
    // 组件加载时获取所有菜单信息
    mounted () {
      this.search()
    },
    data () {
      return {
        name: '',
        tableData: {
          data: [],
          page: 1,
          pagesize: 10,
          pagesizes: [10, 20, 50],
          total: 0
        },
        loading: false
      }
    },
    methods: {
      search () {
        this.loading = true
        let promise = ajax({
          url: '/roles',
          method: 'get',
          params: {
            name: this.name,
            start: (this.tableData.page - 1) * this.tableData.pagesize,
            offset: this.tableData.pagesize
          }
        })
        promise.then(value => {
          let result = value.data
          this.tableData.data = result.data
          this.tableData.total = result.total
          this.loading = false
        }, error => {
          let response = error.response
          this.$message({
            message: response.data,
            type: 'error'
          })
          this.loading = false
        })
      },
      // 分页大小改变
      changeSize (size) {
        this.tableData.pagesize = size
        this.search()
      },
      // 分页跳转
      changePage (page) {
        this.tableData.page = page
        this.search()
      }
    }
  }
</script>

