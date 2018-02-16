<template>
<div>
  <!-- <el-form inline>
    <el-form-item>
      <el-button type="primary" @click="search">查询</el-button>
    </el-form-item>
  </el-form> -->

  <ul class="videos" v-loading="loading">
    <li v-for="video in tableData.data" :key="video.id" @click="toPlay(video)">
      <div>
        <img :src="video.posterUrl" alt="">
        <h4>{{video.title}}</h4>
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
</div>
</template>

<style scoped>
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
  import ajax from '@/utils/ajax'

  export default {
    data () {
      return {
        loading: false,
        keyword: '',
        tableData: {
          data: [],
          page: 1,
          pagesize: 10,
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
        ajax({
          url: '/videos',
          method: 'get',
          params: {
            start: (this.tableData.page - 1) * this.tableData.pagesize,
            offset: this.tableData.pagesize
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
      toPlay (video) {
        this.$router.push({
          name: 'videoPlay',
          params: video
        })
      }
    }
  }
</script>
