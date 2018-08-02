<template>
<div>
  <el-form inline>
    <el-form-item>
      <el-select v-model="query.setId" placeholder="请选择">
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
    v-loading="tableData.loading"
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
    :title="dialogModel.title"
    :visible.sync="dialogModel.visible"
    :close-on-click-modal=false>
    <el-form :model="dialogModel.form" ref="item" label-width="100px">
      <el-form-item label="所属字典集">
        <el-select v-model="dialogModel.form.setId" placeholder="请选择">
          <el-option
            v-for="dictSet in dictSets"
            :key="dictSet.id"
            :label="dictSet.name"
            :value="dictSet.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="dialogModel.form.name"></el-input>
      </el-form-item>
      <el-form-item label="值">
        <el-input v-model="dialogModel.form.value"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="dialogModel.form.order"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="dialogModel.form.desc"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogModel.visible=false">取 消</el-button>
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
        url: '/system/dictionary/dictSet/listDictSetOpt',
        method: 'get'
      }).then(value => {
        let result = value.data
        if (result.success) {
          this.dictSets = result.data
          this.search()
        } else {
          this.$message({
            message: result.msg,
            type: 'error'
          })
        }
      }).catch(() => {})
      this.search()
    },
    data () {
      return {
        query: {
          setId: null
        },
        dictSets: [],
        dialogModel: this.getInitDialogModel(),
        tableData: {
          loading: false,
          data: [],
          page: 1,
          pagesize: 10,
          pagesizes: [10, 20, 50],
          total: 0
        }
      }
    },
    methods: {
      getInitDialogModel () {
        return {
          title: '',
          visible: false,
          form: {}
        }
      },
      search () {
        this.tableData.loading = true
        Object.assign(this.query, {
          start: (this.tableData.page - 1) * this.tableData.pagesize,
          offset: this.tableData.pagesize
        })
        ajax({
          url: '/system/dictionary/dictValue/listDictValuePageData',
          method: 'get',
          params: this.query
        }).then(value => {
          let result = value.data
          if (result.success) {
            result = result.data
            this.tableData.data = result.data
            this.tableData.total = result.total
            this.tableData.loading = false
          } else {
            this.$message({
              message: result.msg,
              type: 'error'
            })
          }
        }).catch(() => {})
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
        this.dialogModel = {
          title: '新增字典值',
          visible: true,
          form: {}
        }
      },
      editItem (item) {
        ajax({
          url: '/system/dictionary/dictValue/getDictValueById',
          method: 'get',
          params: {
            id: item.id
          }
        }).then(value => {
          let result = value.data
          if (result.success) {
            let data = result.data
            this.dialogModel = {
              title: '编辑字典集',
              visible: true,
              form: data
            }
          } else {
            this.$message({
              message: result.msg,
              type: 'error'
            })
          }
        }).catch(() => {})
      },
      submitForm () {
        this.$refs['item'].validate((valid) => {
          if (valid) {
            this.saveItem()
          } else {
            return false
          }
        })
      },
      saveItem () {
        ajax({
          url: '/system/dictionary/dictValue/saveDictValue',
          method: 'post',
          data: this.dialogModel.form
        }).then(value => {
          let result = value.data
          if (result.success) {
            this.dialogModel.visible = false
            this.search()
          } else {
            this.$message({
              message: result.msg,
              type: 'error'
            })
          }
        }).catch(() => {})
      },
      removeItem (item) {
        this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax({
            url: '/system/dictionary/dictValue/removeDictValueById',
            method: 'post',
            data: {
              id: item.id
            }
          }).then(value => {
            let result = value.data
            if (result.success) {
              this.search()
            } else {
              this.$message({
                message: result.msg,
                type: 'error'
              })
            }
          }).catch(() => {})
        })
      }
    },
    watch: {
      // 监听弹出框状态
      'dialogModel.visible' (v) {
        if (!v) {
          this.dialogModel = this.getInitDialogModel()
        }
      }
    }
  }
</script>

