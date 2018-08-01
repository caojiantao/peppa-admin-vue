<template>
<div>
  <el-form inline>
    <el-form-item>
      <el-input v-model="query.name" placeholder="请输入角色名"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="addRole">添加角色</el-button>
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

  <el-dialog 
    :title="dialogModel.title"
    :visible.sync="dialogModel.visible"
    :close-on-click-modal=false
    width="30%">
    <el-row>
      <el-col :span="12"> 
        <el-form :model="dialogModel.form" ref="role" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="dialogModel.form.name"></el-input>
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
  import {getTreeData} from '@/utils/common'

  export default {
    // 组件加载时获取所有菜单信息
    mounted () {
      this.search()
      this.getMenus()
    },
    data () {
      return {
        query: {
          name: ''
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
        defaultProps: {
          id: 'id',
          label: 'name',
          children: 'children'
        },
        treeData: {},
        leafMenuIds: []
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
          url: '/system/security/role/getRolePageData',
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
      addRole () {
        this.dialogModel = {
          title: '新增角色',
          visible: true,
          form: {}
        }
      },
      editRole (item) {
        // 首先获取角色基本信息
        ajax({
          url: '/system/security/role/getRoleWithMenusById',
          method: 'get',
          params: {
            id: item.id
          }
        }).then(value => {
          let result = value.data
          if (result.success) {
            let data = result.data
            // 展示对话框
            this.dialogModel = {
              title: '编辑角色',
              visible: true,
              form: data
            }
            // 注意放在对话框展示的后面，并且采用下属写法避免undefined
            this.$nextTick(() => {
              let checkedKeys = []
              if (data.menus) {
                for (let i in data.menus) {
                  // 计算需要选中的叶子节点
                  if (this.leafMenuIds.indexOf(data.menus[i].id) !== -1) {
                    checkedKeys.push(data.menus[i].id)
                  }
                }
              }
              this.$refs.tree.setCheckedKeys(checkedKeys)
            })
          } else {
            this.$message({
              message: result.msg,
              type: 'error'
            })
          }
        })
      },
      // 获取所有菜单信息
      getMenus () {
        ajax({
          url: '/system/security/menu/getMenus',
          method: 'get'
        }).then(value => {
          let result = value.data
          if (result.success) {
            let menus = result.data
            this.treeData = getTreeData(menus)
            // 递归设置叶子节点，方便树节点选中叶子节点
            for (let i in this.treeData) {
              this.setLeafMenuId(this.treeData[i], this.leafMenuIds)
            }
          } else {
            this.$message({
              message: result.msg,
              type: 'error'
            })
          }
        })
      },
      submitForm () {
        this.$refs['role'].validate((valid) => {
          if (valid) {
            this.saveRole()
          } else {
            return false
          }
        })
      },
      saveRole () {
        this.dialogModel.form.menuIds = this.$refs.tree.getCheckedKeys().join() + ',' + this.$refs.tree.getHalfCheckedKeys().join()
        ajax({
          url: '/system/security/role/saveRole',
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
      removeRole (item) {
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          ajax({
            url: '/system/security/role/deleteRoleById',
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
      },
      // 设置叶子节点
      setLeafMenuId (node, menuIds) {
        if (node.children && node.children.length > 0) {
          for (let i in node.children) {
            this.setLeafMenuId(node.children[i], menuIds)
          }
        } else {
          menuIds.push(node.id)
        }
      }
    },
    watch: {
      // 监听弹出框状态
      'dialogModel.visible' (v) {
        if (!v) {
          this.dialogModel = this.getInitDialogModel()
          this.$refs.tree.setCheckedKeys([])
        }
      }
    }
  }
</script>

