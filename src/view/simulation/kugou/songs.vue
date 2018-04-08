<template>
<div>
  <el-form inline>
    <el-form-item>
      <el-input v-model="keyword" placeholder="请输入关键词"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
    </el-form-item>
  </el-form>

  <el-table
    v-loading="loading"
    :data="tableData.data">
    <el-table-column
      prop="FileName"
      label="歌曲名">
      <template slot-scope="props">
        <el-button @click="playSong(props.row)" type="text">{{props.row.FileName}}</el-button>
      </template>
    </el-table-column>
    <el-table-column
      prop="AlbumName"
      label="专辑">
    </el-table-column>
    <el-table-column
      prop="Duration"
      label="时长"
      width="100"
      :formatter="formatterDuration">
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
</div>
</template>

<<style scoped>
</style>


<script>
  import http from '@/utils/http'

  export default {
    data () {
      return {
        loading: false,
        keyword: '',
        tableData: {
          data: [],
          page: 1,
          pagesize: 10,
          pagesizes: [10, 20, 50],
          total: 0
        }
      }
    },
    methods: {
      search () {
        this.loading = true
        http({
          url: '/kugou/songs',
          method: 'get',
          params: {
            keyword: this.keyword,
            page: this.tableData.page,
            pagesize: this.tableData.pagesize
          }
        }).then(response => {
          let result = response.data
          this.tableData.data = result.data
          this.tableData.total = result.total
          this.loading = false
        }).catch(error => {
          this.$message({
            message: error.message,
            type: 'error'
          })
          this.loading = false
        })
      },
      // 时长计算
      formatterDuration (row, column, cellValue) {
        let min = Math.floor(cellValue / 60)
        let minStr = (min < 10) ? ('0' + min) : String(min)
        let sec = cellValue % 60
        let secStr = (sec < 10) ? ('0' + sec) : String(sec)
        return minStr + ':' + secStr
      },
      // 获取歌曲地址
      playSong (row) {
        http({
          method: 'get',
          url: '/kugou/songs/play',
          params: {
            fileHash: row.FileHash,
            albumId: row.AlbumID
          }
        }).then(response => {
          let result = response.data
          let data = result.data
          window.open(data.play_url)
        }).catch(error => {
          this.$message({
            message: error.message,
            type: 'error'
          })
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
      }
    }
  }
</script>

