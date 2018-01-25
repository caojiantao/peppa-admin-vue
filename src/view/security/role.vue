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
        <el-form :model="form">
          <el-form-item label="名称" :label-width="formLabelWidth">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-tree
          :data="menus"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          default-expand-all
          highlight-current
          :expand-on-click-node="false">
        </el-tree>
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible=false">取 消</el-button>
      <el-button type="primary">确 定</el-button>
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
        menus: [{}],
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
        console.log(item)
        this.dialogTitle = '编辑角色'
        this.dialogVisible = true
      },
      removeRole (item) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax({
            url: '/roles/id',
            method: 'post',
            data: {
              _method: 'delete'
            }
          })
        }).catch(() => {
        })
      },
      // 获取所有菜单信息
      listMenu () {
        let promise = ajax({
          url: '/menus'
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
      }
    },
    watch: {
      // 监听弹出框状态
      dialogVisible (newVal, oldVal) {
        // 弹出框关闭初始化form数据
        if (!newVal) {
          this.dialogTitle = ''
          this.form = {
          }
        }
      }
    }
  }
</script>

