<template>
<div>
  <el-form inline>
    <el-form-item>
      <el-button @click="dialogVisible=true">添加顶级菜单</el-button>
    </el-form-item>
  </el-form>
  <el-tree
    :data="treeData"
    :props="defaultProps"
    node-key="id"
    default-expand-all
    highlight-current
    :expand-on-click-node="false"
    :render-content="renderContent">
  </el-tree>

  <el-dialog 
    :title="dialogTitle"
    :visible.sync="dialogVisible">
    <el-form :model="form" ref="menu">
      <el-form-item label="路径" :label-width="formLabelWidth">
        <el-input v-model="form.parentId" style="display:none;"></el-input>
        <el-input v-model="nodePath" disabled></el-input>
      </el-form-item>
      <el-form-item label="名称" :label-width="formLabelWidth">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="地址" :label-width="formLabelWidth">
        <el-input v-model="form.href"></el-input>
      </el-form-item>
      <el-form-item label="iconClass" :label-width="formLabelWidth">
        <el-input v-model="form.iconClass"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible=false">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>

<style>
  .el-tree-node__content {
    height: 40px;
  }

  .icon-operate{
    margin-left: 10px;
  }
</style>


<script>
  import ajax from '@/utils/ajax'
  import {getTreeData} from '@/utils/common'

  export default {
    // 组件加载时获取所有菜单信息
    mounted () {
      this.listMenu()
    },
    data () {
      return {
        menus: [],
        defaultProps: {
          id: 'id',
          label: 'name',
          children: 'children'
        },

        dialogVisible: false,
        dialogTitle: '',
        formLabelWidth: '80px',
        form: {
          id: 0,
          parentId: 0,
          name: '',
          href: '',
          iconClass: ''
        },
        nodePath: '/'
      }
    },
    watch: {
      // 监听弹出框状态
      dialogVisible (newVal, oldVal) {
        // 弹出框关闭初始化form数据
        if (!newVal) {
          this.dialogTitle = ''
          this.form = {
            id: 0,
            parentId: 0,
            name: '',
            href: '',
            iconClass: ''
          }
          this.nodePath = '/'
        }
      }
    },
    methods: {
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
      },
      getCurrentPath (node) {
        let nodePath = ''
        while (node && node.level) {
          nodePath = '/' + node.label + nodePath
          node = node.parent
        }
        return nodePath + '/'
      },
      getParentPath (node) {
        return this.getCurrentPath(node.parent)
      },
      // 渲染节点，加上操作
      renderContent (h, { node, data, store }) {
        return h('span', [
          h('span', node.label),
          h('span', [
            h('i', {
              attrs: {
                'class': 'el-icon-circle-plus-outline icon-operate'
              },
              on: {
                click: () => {
                  this.dialogTitle = '新增菜单'
                  this.nodePath = this.getCurrentPath(node)
                  this.form.parentId = data.id
                  this.dialogVisible = true
                }
              }
            }),
            h('i', {
              attrs: {
                'class': 'el-icon-edit icon-operate'
              },
              on: {
                click: () => {
                  this.dialogTitle = '编辑菜单'
                  this.nodePath = this.getParentPath(node)
                  // 复制对象，防止双向更改菜单树data
                  this.form = JSON.parse(JSON.stringify(data))
                  this.dialogVisible = true
                }
              }
            }),
            h('i', {
              attrs: {
                'class': 'el-icon-delete icon-operate'
              },
              on: {
                click: () => {
                  this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    this.node = node
                    this.removeMenu(data.id)
                  }).catch(() => {
                  })
                }
              }
            })
          ])
        ])
      },
      // 提交表单请求
      submitForm () {
        this.$refs['menu'].validate((valid) => {
          if (valid) {
            if (this.form.id) {
              this.updateMenu()
            } else {
              this.saveMenu()
            }
          } else {
            console.log('登录表单校验不通过！')
            return false
          }
        })
      },
      // 新增菜单
      saveMenu () {
        let promise = ajax({
          url: '/menus',
          method: 'post',
          data: this.form
        })
        promise.then(value => {
          this.listMenu()
          this.dialogVisible = false
        }, error => {
          let response = error.response
          this.$message({
            message: response.data,
            type: 'error'
          })
        })
      },
      // 更新菜单
      updateMenu () {
        delete this.form.children
        this.form._method = 'put'
        let promise = ajax({
          url: '/menus',
          method: 'post',
          data: this.form
        })
        promise.then(value => {
          this.listMenu()
          this.dialogVisible = false
        }, error => {
          let response = error.response
          this.$message({
            message: response.data,
            type: 'error'
          })
        })
      },
      // 删除菜单
      removeMenu (id) {
        let promise = ajax({
          url: '/menus/' + id,
          method: 'post',
          data: {
            _method: 'delete'
          }
        })
        promise.then(value => {
          let childNodes = this.node.parent.childNodes
          let index
          // 记得移除当前项
          for (let i = 0; i < childNodes.length; i++) {
            if (id === childNodes[i].data.id) {
              index = i
              break
            }
          }
          childNodes.splice(index, 1)
        }, error => {
          let response = error.response
          this.$message({
            message: response.data,
            type: 'error'
          })
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
    }
  }
</script>
