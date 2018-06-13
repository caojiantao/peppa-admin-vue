<template>
<div>
  <el-form inline>
    <el-form-item>
      <el-select v-model="curBucket" placeholder="请选择存储空间">
        <el-option
          v-for="item in bucketOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-input v-model="prefix" placeholder="输入文件前缀搜索"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="localDialogVisible=true">本地上传</el-button>
      <el-button @click="onlineDialogVisible=true">在线上传</el-button>
    </el-form-item>
  </el-form>
  
  <el-table
    v-loading="loading"
    :data="tableData.data">
    <el-table-column
      prop="key"
      label="文件名">
    </el-table-column>
    <el-table-column
      prop="mimeType"
      label="文件类型">
    </el-table-column>
    <el-table-column
      prop="fsize"
      label="文件大小"
      :formatter="formatterSize">
    </el-table-column>
    <el-table-column
      prop="putTime"
      label="最后更新"
      :formatter="formatterDuration">
    </el-table-column>
    <el-table-column
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="removeFile(scope.row)" type="text">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog 
    title="本地上传"
    :visible.sync="localDialogVisible">
    <el-form :model="form" ref="file">
      <el-form-item>
        <b>设置路径前缀</b>
        <br>
        路径前缀可以用来分类文件，例如： <span style="background: lightgray;">image/jpg/</span>your-file-name.jpg
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.prefix" placeholder="不设置默认为空"></el-input>
      </el-form-item>
      
      <el-upload
        action=""
        :file-list="fileList"
        :http-request="uploadFile">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <div slot="tip" class="el-upload__tip">过大文件上传有问题</div>
      </el-upload>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="localDialogVisible=false">取 消</el-button>
    </div>
  </el-dialog>

  <el-dialog 
    title="在线上传"
    :visible.sync="onlineDialogVisible">
    <el-form :model="onlineForm" ref="onlineFile" label-width="80px">
      <el-form-item label="资源地址">
        <el-input v-model="onlineForm.src"></el-input>
      </el-form-item>
      <el-form-item label="文件名称">
        <el-input v-model="onlineForm.key"></el-input>
      </el-form-item>
      <el-progress :text-inside="true" :stroke-width="18" :percentage="70"></el-progress>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="uploadOnlineFile">上 传</el-button>
      <el-button @click="onlineDialogVisible=false">取 消</el-button>
    </div>
  </el-dialog>
</div>
</template>

<style scoped>
</style>


<script>
  import http from '@/utils/http'
  import {formatterDate} from '@/utils/common'

  export default {
    // 组件加载时获取所有菜单信息
    mounted () {
      this.listBucket()
    },
    data () {
      return {
        bucketOptions: [],
        curBucket: '',
        prefix: '',
        tableData: {
          data: [],
          page: 1,
          pagesize: 10,
          pagesizes: [10, 20, 50],
          total: 0
        },
        loading: false,

        localDialogVisible: false,
        fileList: [],
        form: {
          prefix: ''
        },
        onlineDialogVisible: false,
        onlineForm: {
          src: '',
          key: ''
        }
      }
    },
    methods: {
      listBucket () {
        http({
          url: '/qiniu/buckets',
          method: 'get'
        }).then(value => {
          let buckets = value.data
          for (const index in buckets) {
            let bucket = {
              value: buckets[index],
              label: buckets[index]
            }
            this.bucketOptions.push(bucket)
          }
          // 初始化存储空间
          this.curBucket = this.bucketOptions[0].value

          // 当存储空间初始化完成自动进行搜索
          this.search()
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
        http({
          url: '/qiniu/buckets/' + this.curBucket + '/files',
          method: 'get',
          params: {
            prefix: this.prefix,
            page: (this.tableData.page - 1) * this.tableData.pagesize,
            pagesize: this.tableData.pagesize
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
      // 大小计算
      formatterSize (row, column, cellValue) {
        if (cellValue < 1024) {
          return cellValue + 'B'
        } else if (cellValue / 1024 < 1024) {
          return (cellValue / 1024).toFixed(2) + ' KB'
        } else if (cellValue / 1024 / 1024 < 1024) {
          return (cellValue / 1024 / 1024).toFixed(2) + ' MB'
        } else if (cellValue / 1024 / 1024 / 1024 < 1024) {
          return (cellValue / 1024 / 1024 / 1024).toFixed(2) + ' G'
        }
        return 'so big'
      },
      formatterDuration (row, column, cellValue) {
        let date = new Date(cellValue / 10000)
        return formatterDate(date, 'yyyy-MM-dd HH:mm:ss')
      },
      removeFile (file) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          http({
            url: '/qiniu/buckets/' + this.curBucket + '/files',
            method: 'post',
            data: {
              _method: 'delete',
              key: file.key
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
      openLocalUpload () {
        this.dialogTitle = '上传文件'
        this.dialogVisible = true
      },
      uploadOnlineFile () {
        http({
          url: '/qiniu/buckets/' + this.curBucket + '/files',
          method: 'post',
          data: {
            src: this.onlineForm.src,
            key: this.onlineForm.key
          }
        }).then(value => {
        }, error => {
          let response = error.response
          this.$message({
            message: response.data,
            type: 'error'
          })
        })
      },
      uploadFile (item) {
        let data = new FormData()
        data.append('file', item.file)
        data.append('key', this.form.prefix + item.file.name)
        http({
          url: '/qiniu/buckets/' + this.curBucket + '/files',
          method: 'post',
          transformRequest: [data => {
            return data
          }],
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          data: data
        }).then(value => {
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
      localDialogVisible (newVal, oldVal) {
        // 弹出框关闭初始化form数据
        if (!newVal) {
          this.form = {
            prefix: ''
          }
          this.fileList = []
        }
      },
      onlineDialogVisible (newVal, oldVal) {
        // 弹出框关闭初始化form数据
        if (!newVal) {
          this.onlineForm = {
            src: '',
            key: ''
          }
        }
      }
    }
  }
</script>

