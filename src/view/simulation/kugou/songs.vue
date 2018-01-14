<template>
<el-container direction="vertical">
  <el-header>
    <Breadcrumb></Breadcrumb>
  </el-header>
  <el-main class="content">
    <el-form inline>
      <el-form-item label="关键词">
        <el-input v-model="keyword" placeholder="关键词"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="tableData">
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
        width="60"
        :formatter="formatterDuration">
      </el-table-column>
    </el-table>
  </el-main>
</el-container>
</template>

<<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-breadcrumb {
    line-height: 60px;
  }
  
  .content {
    background-color: #E9EEF3;
    color: #333;
  }
</style>


<<script>
  import Breadcrumb from '@/components/Breadcrumb'
  import axios from 'axios'

  export default {
    data () {
      return {
        keyword: '',
        tableData: null
      }
    },
    methods: {
      search () {
        let params = '?keyword=' + encodeURIComponent(this.keyword) + '&page=1&pagesize=10'
        let promise = axios.get('http://localhost:8090/kugou/songs' + params, {
          withCredentials: false
        })
        promise.then(response => {
          let result = response.data
          this.tableData = result.data
        })
        .catch(function (error) {
          console.log(error)
        })
      },
      // 时长计算
      formatterDuration (row, column, cellValue) {
        let min = Math.floor(cellValue / 60)
        let minStr = (min < 10) ? ('0' + min) : (min + '')
        let sec = Math.floor(cellValue / 60)
        let secStr = (sec < 10) ? ('0' + sec) : (sec + '')
        return minStr + ':' + secStr
      },
      // 获取歌曲地址
      playSong (row) {
        let params = '?fileHash=' + row.FileHash + '&albumId=' + row.AlbumID
        let promise = axios.get('http://211.159.153.160:8090/kugou/songs/play' + params, {
          withCredentials: false
        })
        promise.then(response => {
          let result = response.data
          let data = result.data
          window.open(data.play_url)
        })
        .catch(function (error) {
          console.log(error)
        })
      }
    },
    components: {Breadcrumb}
  }
</script>

