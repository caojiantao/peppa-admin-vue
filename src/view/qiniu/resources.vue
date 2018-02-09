<template>
<div>
  <el-form inline>
    <el-form-item>
      <el-input v-model="name" placeholder="输入文件前缀搜索"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="openUpload">文件上传</el-button>
    </el-form-item>
  </el-form>
  
  <el-table
    v-loading="loading"
    :data="tableData.data">
    <el-table-column
      prop="key"
      label="文件名">
    </el-table-column>
    <el-table-column
      prop="mimeType"
      label="文件类型">
    </el-table-column>
    <el-table-column
      prop="fsize"
      label="文件大小"
      :formatter="formatterSize">
    </el-table-column>
    <el-table-column
      prop="putTime"
      label="最后更新"
      :formatter="formatterDuration">
    </el-table-column>
    <el-table-column
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="removeFile(scope.row)" type="text">删除</el-button>
      </template>
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

  <el-dialog 
    :title="dialogTitle"
    :visible.sync="dialogVisible">
    <el-form :model="form" ref="file">
      <el-form-item label="文件名" :label-width="formLabelWidth">
        <el-input v-model="form.key" placeholder="不填写默认为原始文件名"></el-input>
      </el-form-item>
      
      <el-form-item label="选择" :label-width="formLabelWidth">
        <el-input type="file">选择文件</el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible=false">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<style scoped>
</style>


<script>
  import http from '@/utils/http'
  import {formatterDate} from '@/utils/common'

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
        loading: false,

        dialogVisible: false,
        dialogTitle: '',
        formLabelWidth: '80px',
        form: {
          key: ''
        }
      }
    },
    methods: {
      search () {
        this.loading = true
        http({
          url: '/qiniu/static',
          method: 'get',
          params: {
            page: (this.tableData.page - 1) * this.tableData.pagesize,
            pagesize: this.tableData.pagesize
          }
        }).then(value => {
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
      },
      // 大小计算
      formatterSize (row, column, cellValue) {
        return (cellValue / 1024).toFixed(2) + ' KB'
      },
      formatterDuration (row, column, cellValue) {
        let date = new Date(cellValue / 10000)
        return formatterDate(date, 'yyyy-MM-dd HH:mm:ss')
      },
      removeFile (file) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          http({
            url: '/qiniu/static/' + file.key,
            method: 'post',
            data: {
              _method: 'delete'
            }
          }).then(value => {
            this.search()
          }, error => {
            let response = error.response
            this.$message({
              message: response.data,
              type: 'error'
            })
          })
        }).catch(() => {
        })
      },
      openUpload () {
        this.dialogTitle = '上传文件'
        this.dialogVisible = true
      },
      submitForm () {
      }
    },
    computed: {
    },
    watch: {
    }
  }
</script>

