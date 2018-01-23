<template>
<el-container direction="vertical">
  <el-main class="content">
    <el-button>添加顶级菜单</el-button>
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
        <el-input v-model="form.path" disabled></el-input>
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
</style>


<script>
  import ajax from '@/utils/ajax'

  export default {
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
        form: {
          parent: null,
          path: '',

          parentId: '',
          name: '',
          href: '',
          iconClass: ''
        },
        boxVisible: false,
        formLabelWidth: '80px'
      }
    },
    watch: {
      // 监听弹出框状态
      boxVisible (newVal, oldVal) {
        // 弹出框关闭初始化form数据
        if (!newVal) {
          this.form = {
            parent: null,
            path: '',

            parentId: '',
            name: '',
            href: '',
            iconClass: ''
          }
        }
      }
    },
    methods: {
      // 渲染节点，加上操作
      renderContent (h, { node, data, store }) {
        return h('span', [
          h('span', node.label),
          h('span', [
            h('el-button', {
              attrs: {
                'size': 'mini'
              },
              on: {
                click: () => {
                  // 递归获取当前node的全路径名称，注意引用传递
                  let temp = node
                  while (temp && temp.level) {
                    this.form.path = '/' + temp.label + this.form.path
                    temp = temp.parent
                  }
                  this.form.parent = data
                  this.form.parentId = data.id
                  this.boxVisible = true
                }
              }
            }, '添加'),
            h('el-button', {
              attrs: {
                'size': 'mini'
              }
            }, '删除')
          ])
        ])
      },
      submitForm () {
        this.$refs['menu'].validate((valid) => {
          if (valid) {
            let promise = ajax({
              url: '/menus',
              method: 'post',
              data: this.form
            })
            promise.then(value => {
              let parent = this.form.parent
              let menu = value.data
              if (!parent) {
                // 添加顶级节点
                this.menus.push(menu)
              } else {
                if (!parent.children || parent.children.length === 0) {
                  // 当前父节点无子节点，初始化children
                  this.$set(parent, 'children', [])
                }
                // 添加到当前子节点中
                parent.children.push(menu)
              }
              this.boxVisible = false
            }, error => {
              let response = error.response
              this.$message({
                message: response.data,
                type: 'error'
              })
            })
          } else {
            console.log('登录表单校验不通过！')
            return false
          }
        })
      }
    }
  }
</script>
