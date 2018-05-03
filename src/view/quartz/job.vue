<template>
<div>
  <el-form inline>
    <el-form-item>
      <el-input v-model="name" placeholder="请输入任务名"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="addQuartz">添加任务</el-button>
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
      prop="group"
      label="分组">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态"
      :formatter="formatterStatus">
    </el-table-column>
    <el-table-column
      prop="cronExpre"
      label="表达式">
    </el-table-column>
    <el-table-column
      prop="desc"
      label="描述">
    </el-table-column>
    <el-table-column
      prop="jobClass"
      label="任务类名">
    </el-table-column>
    <el-table-column
      label="操作">
      <template slot-scope="scope">
        <el-button v-if="scope.row.status" @click="pause(scope.row)" type="text">停用</el-button>
        <el-button v-else @click="resume(scope.row)" type="text">启用</el-button>
        <el-button @click="executeQuartz(scope.row)" type="text">执行</el-button>
        <el-button @click="editQuartz(scope.row)" type="text">编辑</el-button>
        <el-button @click="removeQuartz(scope.row)" type="text">删除</el-button>
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
    <el-form :model="quartz" ref="quartz">
      <el-form-item label="名称" :label-width="formLabelWidth">
        <el-input v-model="quartz.name"></el-input>
      </el-form-item>
      <el-form-item label="分组" :label-width="formLabelWidth">
        <el-input v-model="quartz.group"></el-input>
      </el-form-item>
      <el-form-item label="状态" :label-width="formLabelWidth">
        <el-checkbox v-model="quartz.status">启用</el-checkbox>
      </el-form-item>
      <el-form-item label="表达式" :label-width="formLabelWidth">
        <el-input v-model="quartz.cronExpre"></el-input>
      </el-form-item>
      <el-form-item label="描述" :label-width="formLabelWidth">
        <el-input v-model="quartz.desc"></el-input>
      </el-form-item>
      <el-form-item label="任务类名" :label-width="formLabelWidth">
        <el-input v-model="quartz.jobClass"></el-input>
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
        quartz: {}
      }
    },
    methods: {
      search () {
        this.loading = true
        ajax({
          url: '/quartz',
          method: 'get',
          params: {
            start: (this.tableData.page - 1) * this.tableData.pagesize,
            offset: this.tableData.pagesize
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
      addQuartz () {
        this.dialogTitle = '新增任务'
        this.dialogVisible = true
      },
      editQuartz (item) {
        this.dialogTitle = '编辑任务'
        this.dialogVisible = true
        // 首先获取角色基本信息
        ajax({
          url: '/quartz/' + item.id,
          method: 'get'
        }).then(value => {
          this.quartz = value.data
        }, error => {
          let response = error.response
          this.$message({
            message: response.data,
            type: 'error'
          })
        })
      },
      submitForm () {
        this.$refs['quartz'].validate((valid) => {
          if (valid) {
            if (this.quartz.id) {
              this.updateQuartz()
            } else {
              this.saveQuartz()
            }
          } else {
            console.log('登录表单校验不通过！')
            return false
          }
        })
      },
      saveQuartz () {
        ajax({
          url: '/quartz',
          method: 'post',
          data: this.quartz
        }).then(value => {
          this.dialogVisible = false
          this.search()
        }, error => {
          let response = error.response
          this.$message({
            message: response.data,
            type: 'error'
          })
        })
      },
      updateQuartz () {
        this.quartz._method = 'put'
        ajax({
          url: '/quartz',
          method: 'post',
          data: this.quartz
        }).then(value => {
          this.dialogVisible = false
          this.search()
        }, error => {
          let response = error.response
          this.$message({
            message: response.data,
            type: 'error'
          })
        })
      },
      removeQuartz (item) {
        this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax({
            url: '/quartz/' + item.id,
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
      executeQuartz (item) {
        this.$confirm('是否立即执行该定时任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax({
            url: '/quartz/executeQuartzById',
            method: 'post',
            data: {
              id: item.id
            }
          }).then(value => {
            let data = value.data
            this.$message({
              message: data.msg,
              type: data.success ? 'success' : 'error'
            })
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
      pause (quartz) {
        this.$confirm('是否停用该定时任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax({
            url: '/quartz',
            method: 'post',
            data: {
              _method: 'put',
              id: quartz.id,
              status: false
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
      resume (quartz) {
        this.$confirm('是否启用该定时任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax({
            url: '/quartz',
            method: 'post',
            data: {
              _method: 'put',
              id: quartz.id,
              status: true
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
      formatterStatus (quartz) {
        return quartz.status ? '启用' : '停用'
      }
    },
    watch: {
      // 监听弹出框状态
      dialogVisible (newVal, oldVal) {
        // 弹出框关闭初始化form数据
        if (!newVal) {
          this.dialogTitle = ''
          this.quartz = {}
        }
      }
    }
  }
</script>

