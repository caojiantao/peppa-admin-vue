<template>
<div>
  <el-form :model="query" inline>
    <el-form-item>
      <el-input v-model="query.username" placeholder="请输入用户名"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="addUser">添加用户</el-button>
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
      prop="username"
      label="用户名">
    </el-table-column>
    <el-table-column
      prop="nickname"
      label="昵称">
    </el-table-column>
    <el-table-column
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="editUser(scope.row)" type="text">编辑</el-button>
        <el-button @click="deleteUser(scope.row)" type="text">删除</el-button>
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
    <el-row>
      <el-col :span="10"> 
        <el-form :model="dialogModel.form" ref="user" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="dialogModel.form.username"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="dialogModel.form.nickname"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="dialogModel.form.password" placeholder="仅当需要修改时填写" type="password"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="14">
        <el-transfer 
          v-model="dialogModel.form.roleIds" 
          :data="roles"
          :props="{
            key: 'id',
            label: 'name'
          }"
          :titles="['角色列表','当前角色']">
        </el-transfer>
      </el-col>
    </el-row>
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
      this.getRoles()
    },
    data () {
      return {
        query: {
          username: ''
        },
        tableData: {
          loading: false,
          data: [],
          page: 1,
          pagesize: 10,
          pagesizes: [10, 20, 50],
          total: 0
        },
        dialogModel: this.getInitDialogModel(),
        roles: []
      }
    },
    methods: {
      getInitDialogModel () {
        return {
          title: '',
          visible: false,
          form: {
            roleIds: []
          }
        }
      },
      getRoles () {
        ajax({
          url: '/system/security/role/getRoles',
          method: 'get'
        }).then(value => {
          let result = value.data
          if (result.success) {
            this.roles = result.data
          } else {
            this.$message({
              message: result.msg,
              type: 'error'
            })
          }
        })
      },
      search () {
        this.tableData.loading = true
        Object.assign(this.query, {
          start: (this.tableData.page - 1) * this.tableData.pagesize,
          offset: this.tableData.pagesize
        })
        ajax({
          url: '/system/security/user/getUserPageData',
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
      addUser () {
        this.dialogModel = {
          title: '新增角色',
          visible: true,
          form: {}
        }
      },
      editUser (item) {
        // 首先获取用户基本信息
        ajax({
          url: '/system/security/user/getUserWithRoleIdsByUserId',
          method: 'get',
          params: {
            id: item.id
          }
        }).then(value => {
          let result = value.data
          if (result.success) {
            Object.assign(this.dialogModel, {
              title: '编辑用户',
              visible: true,
              form: result.data
            })
          } else {
            this.$message({
              message: result.msg,
              type: 'error'
            })
          }
        })
      },
      submitForm () {
        this.$refs['user'].validate((valid) => {
          if (valid) {
            this.saveUser()
          } else {
            return false
          }
        })
      },
      saveUser () {
        // 手动数组join赋值
        this.dialogModel.form.roleIds = this.dialogModel.form.roleIds.join()
        ajax({
          url: '/system/security/user/saveUser',
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
        })
      },
      deleteUser (item) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax({
            url: '/system/security/users/deleteUserById',
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
          })
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

