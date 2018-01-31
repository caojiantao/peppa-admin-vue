<template>
<el-container direction="vertical">
  <el-main class="content">
    <el-form inline>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>

    <ul class="videos" v-loading="loading">
      <li v-for="post in tableData.data" :key="post.id" @click="toPlay(post.vid)">
        <div>
          <img :src="post.img" alt="">
          <h4>{{post.title}}</h4>
        </div>
      </li>
    </ul>

    <el-pagination
      @size-change="changeSize"
      @current-change="changePage"
      :current-page="tableData.page"
      :page-size="tableData.pagesize"
      :total="tableData.total"
      layout="total, prev, pager, next, jumper">
    </el-pagination>
  </el-main>
</el-container>
</template>

<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .content {
    background-color: #E9EEF3;
    color: #333;
  }

  .videos {
    margin: 0;
    padding: 0;
  }

  .videos:after {
    content:""; 
    display: block; 
    clear: both; 
  }

  .videos li {
    width: 300px;
    margin: 0 20px;
    list-style: none;
    float: left;
    cursor: pointer;
  }

  .videos img {
    width: 100%;
  } 

  .videos h4 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
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
          // 写死的
          pagesize: 25,
          total: 0
        }
      }
    },
    mounted () {
      this.search()
    },
    methods: {
      search () {
        this.loading = true
        http({
          url: '/welfare/videos',
          method: 'get',
          params: {
            page: this.tableData.page,
            pagesize: this.tableData.pagesize
          }
        }).then(response => {
          let result = response.data
          this.tableData.data = result.data
          this.tableData.total = result.total
          this.loading = false
        }).catch(function (error) {
          console.log(error)
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
      toPlay (vid) {
        http({
          url: '/welfare/videos/' + vid,
          method: 'get'
        }).then(response => {
          let result = response.data
          console.log(result)
        }).catch(function (error) {
          console.log(error)
          this.loading = false
        })
      }
    }
  }
</script>

