<template>
<div>
  <el-form inline>
    <el-form-item>
      <el-select v-model="setId" placeholder="请选择">
        <el-option
          v-for="item in dictSets"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="addItem">添加字典值</el-button>
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
      label="名称">
    </el-table-column>
    <el-table-column
      prop="value"
      label="值">
    </el-table-column>
    <el-table-column
      prop="order"
      label="排序">
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
      <el-form-item label="所属字典集" :label-width="formLabelWidth">
        <el-select v-model="item.setId" placeholder="请选择">
          <el-option
            v-for="dictSet in dictSets"
            :key="dictSet.id"
            :label="dictSet.name"
            :value="dictSet.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称" :label-width="formLabelWidth">
        <el-input v-model="item.name"></el-input>
      </el-form-item>
      <el-form-item label="值" :label-width="formLabelWidth">
        <el-input v-model="item.value"></el-input>
      </el-form-item>
      <el-form-item label="排序" :label-width="formLabelWidth">
        <el-input v-model="item.order"></el-input>
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
    mounted () {
      ajax({
        url: '/dictionary/listDictSetOpt',
        method: 'get'
      }).then(value => {
        this.dictSets = value.data
      }, error => {
        let response = error.response
        this.$message({
          message: response ? response.data : error.message,
          type: 'error'
        })
      })
      this.search()
    },
    data () {
      return {
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
        formLabelWidth: '100px',
        item: {},
        dictSets: [],
        setId: ''
      }
    },
    methods: {
      search () {
        this.loading = true
        ajax({
          url: '/dictionary/listDictValueByPage',
          method: 'get',
          params: {
            start: (this.tableData.page - 1) * this.tableData.pagesize,
            offset: this.tableData.pagesize,
            setId: this.setId
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
        this.dialogTitle = '新增字典值'
        this.dialogVisible = true
      },
      editItem (item) {
        this.dialogTitle = '编辑字典值'
        this.dialogVisible = true
        ajax({
          url: '/dictionary/getDictValueById?id=' + item.id,
          method: 'get'
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
          url: '/dictionary/saveDictValue',
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
          url: '/dictionary/updateDictValue',
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
            url: '/dictionary/removeDictValueById',
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
        }
      }
    }
  }
</script>

