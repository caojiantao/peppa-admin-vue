<template>
<div>
  <el-form inline>
    <el-form-item>
      <el-input v-model="code" placeholder="请输入字典集code"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="addItem">添加字典集</el-button>
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
      prop="code"
      label="CODE">
    </el-table-column>
    <el-table-column
      prop="name"
      label="名称">
    </el-table-column>
    <el-table-column
      prop="desc"
      label="描述">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button @click="editItem(scope.row)" type="text">编辑</el-button>
        <el-button @click="removeItem(scope.row)" type="text">删除</el-button>
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
    <el-form :model="item" ref="item">
      <el-form-item label="CODE" :label-width="formLabelWidth">
        <el-input v-model="item.code"></el-input>
      </el-form-item>
      <el-form-item label="名称" :label-width="formLabelWidth">
        <el-input v-model="item.name"></el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input v-model="item.desc"></el-input>
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
  import ajax from '@/utils/ajax'

  export default {
    // 组件加载时获取所有菜单信息
    mounted () {
      this.search()
    },
    data () {
      return {
        code: '',
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
        item: {}
      }
    },
    methods: {
      search () {
        this.loading = true
        ajax({
          url: '/dictionary/listDictSetByPage',
          method: 'get',
          params: {
            start: (this.tableData.page - 1) * this.tableData.pagesize,
            offset: this.tableData.pagesize,
            code: this.code
          }
        }).then(value => {
          let result = value.data
          this.tableData.data = result.data
          this.tableData.total = result.total
          this.loading = false
        }, error => {
          let response = error.response
          this.$message({
            message: response ? response.data : error.message,
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
      addItem () {
        this.dialogTitle = '新增字典集'
        this.dialogVisible = true
      },
      editItem (item) {
        this.dialogTitle = '编辑字典集'
        this.dialogVisible = true
        // 首先获取角色基本信息
        ajax({
          url: '/dictionary/getDictSetById',
          method: 'get',
          params: {
            id: item.id
          }
        }).then(value => {
          this.item = value.data
        }, error => {
          let response = error.response
          this.$message({
            message: response ? response.data : error.message,
            type: 'error'
          })
        })
      },
      submitForm () {
        this.$refs['item'].validate((valid) => {
          if (valid) {
            if (this.item.id) {
              this.updateItem()
            } else {
              this.saveItem()
            }
          } else {
            console.log('登录表单校验不通过！')
            return false
          }
        })
      },
      saveItem () {
        ajax({
          url: '/dictionary/saveDictSet',
          method: 'post',
          data: this.item
        }).then(value => {
          this.dialogVisible = false
          this.search()
        }, error => {
          let response = error.response
          this.$message({
            message: response ? response.data : error.message,
            type: 'error'
          })
        })
      },
      updateItem () {
        ajax({
          url: '/dictionary/updateDictSet',
          method: 'post',
          data: this.item
        }).then(value => {
          this.dialogVisible = false
          this.search()
        }, error => {
          let response = error.response
          this.$message({
            message: response ? response.data : error.message,
            type: 'error'
          })
        })
      },
      removeItem (item) {
        this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax({
            url: '/dictionary/removeDictSetById',
            method: 'post',
            data: {
              id: item.id
            }
          }).then(value => {
            this.search()
          }, error => {
            let response = error.response
            this.$message({
              message: response ? response.data : error.message,
              type: 'error'
            })
          })
        }).catch(() => {
        })
      }
    },
    watch: {
      // 监听弹出框状态
      dialogVisible (newVal, oldVal) {
        // 弹出框关闭初始化form数据
        if (!newVal) {
          this.dialogTitle = ''
          this.item = {}
          this.code = ''
        }
      }
    }
  }
</script>

