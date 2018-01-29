<template>
<el-container direction="vertical">
  <el-main class="content">
    <el-form inline>
      <el-form-item label="用户名">
        <el-input v-model="username" placeholder="请输入角色名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-button @click="addUser">添加用户</el-button>
    <el-table
      v-loading="loading"
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
          <el-button @click="removeUser(scope.row)" type="text">删除</el-button>
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
  </el-main>

  <el-dialog 
    :title="dialogTitle"
    :visible.sync="dialogVisible">
    <el-row>
      <el-col :span="10"> 
        <el-form :model="user" ref="user">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="user.username"></el-input>
          </el-form-item>
          <el-form-item label="昵称" :label-width="formLabelWidth">
            <el-input v-model="user.nickname"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="user.password" placeholder="仅当需要修改时填写"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="14">
        <el-transfer 
          v-model="userRoleIds" 
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
      <el-button @click="dialogVisible=false">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
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
      this.listRoles()
    },
    data () {
      return {
        username: '',
        tableData: {
          page: 1,
          pagesize: 10,
          pagesizes: [10, 20, 50],
          data: [],
          total: 0
        },
        loading: false,

        dialogVisible: false,
        dialogTitle: '',
        formLabelWidth: '80px',
        user: {},
        userRoleIds: [],
        roles: null
      }
    },
    methods: {
      listRoles () {
        ajax({
          url: '/roles',
          method: 'get'
        }).then(value => {
          let result = value.data
          this.roles = result.data
        }, error => {
          let response = error.response
          this.$message({
            message: response.data,
            type: 'error'
          })
        })
      },
      search () {
        this.loading = true
        let promise = ajax({
          url: '/users',
          method: 'get',
          params: {
            username: this.username,
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
      },
      addUser () {
        this.dialogTitle = '新增用户'
        this.dialogVisible = true
      },
      editUser (item) {
        this.dialogTitle = '编辑用户'
        this.dialogVisible = true
        // 首先获取用户基本信息
        ajax({
          url: '/users/' + item.id,
          method: 'get'
        }).then(value => {
          this.user = value.data
          this.user.password = ''
        }, error => {
          let response = error.response
          this.$message({
            message: response.data,
            type: 'error'
          })
        })
        // 然后获取用户对应角色信息
        ajax({
          url: '/users/' + item.id + '/roles',
          method: 'get'
        }).then(value => {
          let roles = value.data
          for (let index in roles) {
            this.userRoleIds.push(roles[index].id)
          }
        }, error => {
          let response = error.response
          this.$message({
            message: response.data,
            type: 'error'
          })
        })
      },
      submitForm () {
        this.$refs['user'].validate((valid) => {
          if (valid) {
            if (this.user.id) {
              this.updateUser()
            } else {
              this.saveUser()
            }
          } else {
            console.log('登录表单校验不通过！')
            return false
          }
        })
      },
      saveUser () {
        // 角色ID集合
        this.user.roleIds = this.userRoleIds.join()
        ajax({
          url: '/users',
          method: 'post',
          data: this.user
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
      updateUser () {
        // 角色ID集合
        this.user.roleIds = this.userRoleIds
        this.user._method = 'put'
        ajax({
          url: '/users',
          method: 'post',
          data: this.user
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
      removeUser (user) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax({
            url: '/users/' + user.id,
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
      }
    },
    computed: {
    },
    watch: {
      // 监听弹出框状态
      dialogVisible (newVal, oldVal) {
        // 弹出框关闭初始化form数据
        if (!newVal) {
          this.dialogTitle = ''
          this.user = {}
          this.userRoleIds = []
        }
      }
    }
  }
</script>

