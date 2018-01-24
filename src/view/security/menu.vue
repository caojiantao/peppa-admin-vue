<template>
<el-container direction="vertical">
  <el-main class="content">
    <el-button @click="boxVisible=true">添加顶级菜单</el-button>
    <el-tree
      :data="menus"
      :props="defaultProps"
      node-key="id"
      default-expand-all
      highlight-current
      :expand-on-click-node="false"
      :render-content="renderContent">
    </el-tree>
  </el-main>

  <el-dialog 
    title="新增菜单"
    :visible="boxVisible">
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
      <el-button @click="boxVisible=false">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</el-container>
</template>

<style>
  .content {
    background-color: #E9EEF3;
    color: #333;
  }

  .el-tree-node__content {
    height: 40px;
  }

  .icon-operate{
    margin: 0 0 0 10px;
  }
</style>


<script>
  import ajax from '@/utils/ajax'

  export default {
    // 组件加载时获取所有菜单信息
    mounted () {
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
    data () {
      return {
        // 坑爹，el-tree必须有元素
        menus: [{}],
        defaultProps: {
          id: 'id',
          label: 'name',
          children: 'children'
        },
        boxVisible: false,
        form: {
          parentId: '',
          name: '',
          href: '',
          iconClass: ''
        },
        nodePath: '/',
        node: null,
        formLabelWidth: '80px'
      }
    },
    watch: {
      // 监听弹出框状态
      boxVisible (newVal, oldVal) {
        // 弹出框关闭初始化form数据
        if (!newVal) {
          this.form = {
            parentId: '',
            name: '',
            href: '',
            iconClass: ''
          }
          this.nodePath = '/'
          this.node = null
        }
      }
    },
    methods: {
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
                  let temp = node
                  this.nodePath = this.getCurrentPath(temp)
                  this.node = node
                  this.form.parentId = data.id
                  this.boxVisible = true
                }
              }
            }),
            h('i', {
              attrs: {
                'class': 'el-icon-edit icon-operate'
              },
              on: {
                click: () => {
                  let temp = node
                  this.nodePath = this.getParentPath(temp)
                  this.node = node
                  this.form = data
                  this.boxVisible = true
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
      submitForm () {
        this.$refs['menu'].validate((valid) => {
          if (valid) {
            if (this.form.id) {
              // 新增菜单
              this.updateMenu()
            } else {
              // 更新菜单
              this.saveMenu()
            }
          } else {
            console.log('登录表单校验不通过！')
            return false
          }
        })
      },
      saveMenu () {
        let promise = ajax({
          url: '/menus',
          method: 'post',
          data: this.form
        })
        promise.then(value => {
          let menu = value.data
          if (!this.node) {
            // 添加顶级节点
            this.menus.push(menu)
          } else {
            let nodeData = this.node.data
            if (!nodeData.children || nodeData.children.length === 0) {
              // 当前父节点无子节点，初始化children
              this.$set(nodeData, 'children', [])
            }
            // 添加到当前子节点中
            nodeData.children.push(menu)
          }
          this.boxVisible = false
        }, error => {
          let response = error.response
          this.$message({
            message: response.data,
            type: 'error'
          })
        })
      },
      updateMenu () {
        delete this.form.children
        this.form._method = 'put'
        let promise = ajax({
          url: '/menus',
          method: 'post',
          data: this.form
        })
        promise.then(value => {
          this.node.data = value.data
          this.boxVisible = false
        }, error => {
          let response = error.response
          this.$message({
            message: response.data,
            type: 'error'
          })
        })
      },
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
    }
  }
</script>
