<template>
<el-container direction="vertical">
  <el-main class="content">
    <el-row>
      <el-button>添加顶级菜单</el-button>
    </el-row>
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

  <!-- Form -->
  <el-button type="text" @click="boxVisible = true">打开嵌套表单的 Dialog</el-button>

  <el-dialog title="收货地址" :visible.sync="boxVisible">
    <el-form :model="form">
      <el-form-item label="活动名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="form.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="boxVisible = false">取 消</el-button>
      <el-button type="primary" @click="boxVisible = false">确 定</el-button>
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


<<script>
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
        menus: [],
        defaultProps: {
          id: 'id',
          label: 'name',
          children: 'children'
        },
        // form: {
        //   parent: {},
        //   name: '',
        //   parentId: '',
        //   href: '',
        //   iconClass: ''
        // },
        boxVisible: false,
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        formLabelWidth: '120px'
      }
    },
    methods: {
      // 添加节点
      append (parent, child) {
        if (!parent.children || parent.children.length === 0) {
          this.$set(parent, 'children', [])
        }
        parent.children.push(child)
      },
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
      }
    }
  }
</script>
