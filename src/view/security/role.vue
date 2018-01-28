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
    <el-button @click="addRole">添加角色</el-button>
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
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="editRole(scope.row)" type="text">编辑</el-button>
          <el-button @click="removeRole(scope.row)" type="text">删除</el-button>
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
    :visible.sync="dialogVisible"
    width="70%">
    <el-row>
      <el-col :span="12"> 
        <el-form :model="form" ref="role">
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          ref="tree"
          show-checkbox
          node-key="id"
          default-expand-all
          highlight-current
          :expand-on-click-node="false">
          <!-- keys 为什么不能动态修改 -->
        </el-tree>
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
  import {getTreeData} from '@/utils/common'

  export default {
    // 组件加载时获取所有菜单信息
    mounted () {
      this.search()
      this.listMenu()
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
        },
        menus: [],
        defaultProps: {
          id: 'id',
          label: 'name',
          children: 'children'
        }
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
      },
      addRole () {
        this.dialogTitle = '新增角色'
        this.dialogVisible = true
      },
      editRole (item) {
        this.dialogTitle = '编辑角色'
        this.dialogVisible = true
        // 首先获取角色基本信息
        ajax({
          url: '/roles/' + item.id,
          method: 'get'
        }).then(value => {
          this.form = value.data
        }, error => {
          let response = error.response
          this.$message({
            message: response.data,
            type: 'error'
          })
        })
        // 然后获取角色对应菜单信息
        ajax({
          url: '/roles/' + item.id + '/menus',
          method: 'get'
        }).then(value => {
          let checkedKeys = []
          let menus = value.data
          for (let i in menus) {
            let hasChild = false
            for (let j in menus) {
              if (menus[i].id === menus[j].parentId) {
                hasChild = true
                break
              }
            }
            if (!hasChild) {
              checkedKeys.push(menus[i].id)
            }
          }
          this.$refs.tree.setCheckedKeys(checkedKeys)
        }, error => {
          let response = error.response
          this.$message({
            message: response.data,
            type: 'error'
          })
        })
      },
      // 获取所有菜单信息
      listMenu () {
        let promise = ajax({
          url: '/menus',
          method: 'get'
        })
        promise.then(value => {
          this.menus = value.data
        }, error => {
          let response = error.response
          this.$message({
            message: response.data,
            type: 'error'
          })
        })
      },
      submitForm () {
        this.$refs['role'].validate((valid) => {
          if (valid) {
            if (this.form.id) {
              this.updateRole()
            } else {
              this.saveRole()
            }
          } else {
            console.log('登录表单校验不通过！')
            return false
          }
        })
      },
      saveRole () {
        this.form.menuIds = this.$refs.tree.getCheckedKeys().join()
        let promise = ajax({
          url: '/roles',
          method: 'post',
          data: this.form
        })
        promise.then(value => {
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
      updateRole () {
        this.form.menuIds = this.$refs.tree.getCheckedKeys().join()
        this.form._method = 'put'
        let promise = ajax({
          url: '/roles',
          method: 'post',
          data: this.form
        })
        promise.then(value => {
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
      removeRole (item) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax({
            url: '/roles/' + item.id,
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
      // 计算菜单树数据，坑爹，el-tree必须有元素
      treeData: function () {
        let nodes = getTreeData(this.menus)
        if (nodes.length === 0) {
          nodes.push({})
        }
        return nodes
      }
    },
    watch: {
      // 监听弹出框状态
      dialogVisible (newVal, oldVal) {
        // 弹出框关闭初始化form数据
        if (!newVal) {
          this.dialogTitle = ''
          this.form = {}
          this.$refs.tree.setCheckedKeys([])
        }
      }
    }
  }
</script>

