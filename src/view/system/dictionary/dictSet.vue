<template>
<div>
  <el-form inline>
    <el-form-item>
      <el-input v-model="query.code" placeholder="请输入字典集code"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="addItem">添加字典集</el-button>
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
    :title="dialogModel.title"
    :visible.sync="dialogModel.visible"
    :close-on-click-modal=false>
    <el-form :model="dialogModel.form" ref="item" label-width="80px">
      <el-form-item label="CODE" :label-width="formLabelWidth">
        <el-input v-model="dialogModel.form.code"></el-input>
      </el-form-item>
      <el-form-item label="名称" :label-width="formLabelWidth">
        <el-input v-model="dialogModel.form.name"></el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input v-model="dialogModel.form.desc"></el-input>
      </el-form-item>
      <el-form-item label="字典联动">
        <el-switch
          v-model="dialogModel.form.link">
        </el-switch>
      </el-form-item>
      <el-form-item label="字典值" v-if="dialogModel.form.link">
        <el-input v-model="dialogModel.form.parentValueId"></el-input>
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
    // 组件加载时获取所有菜单信息
    mounted () {
      this.search()
    },
    data () {
      return {
        query: {
          code: ''
        },
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
          form: {
            // 字典联动
            link: false,
            parentValueId: 0
          }
        }
      },
      search () {
        this.tableData.loading = true
        Object.assign(this.query, {
          start: (this.tableData.page - 1) * this.tableData.pagesize,
          offset: this.tableData.pagesize
        })
        ajax({
          url: '/system/dictionary/dictSet/listDictSetPageData',
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
          title: '新增字典集',
          visible: true,
          form: {}
        }
      },
      editItem (item) {
        // 首先获取角色基本信息
        ajax({
          url: '/system/dictionary/dictSet/getDictSetById',
          method: 'get',
          params: {
            id: item.id
          }
        }).then(value => {
          let result = value.data
          if (result.success) {
            let data = result.data
            // 初始化字典集父字典值
            if (data.parentValueId) {
              data.link = true
            }
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
          url: '/system/dictionary/dictSet/saveDictSet',
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
            url: '/system/dictionary/dictSet/removeDictSetById',
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

