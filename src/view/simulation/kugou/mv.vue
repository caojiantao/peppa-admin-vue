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

  <ul
    class="mv_wrapper"
    v-loading="loading"
    :data="mvs">
    <li v-for="item in mvs">
      <div class="mv_container">
        <a :href="item.link" class="mv_cover">
          <img :src="item.cover" alt="">
        </a>
        <a :href="item.link" class="mv_name">{{item.title}}</a>
        <span class="mv_singer" @click="playMv(item)">{{item.singer}}</span>
      </div>
    </li>
  </ul>
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
  .mv_wrapper {
    padding: 0;
  }

  .mv_wrapper:after {
    content: '';
    display: block;
    clear: both;
  }
  
  .mv_wrapper li {
    width: 240px;
    margin: 0 20px 30px 0;
    float: left;
    list-style: none;
  }

  .mv_name, .mv_singer {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 5px;
    white-space: nowrap;
  }

  .mv_name {
    text-decoration: none;
    color: #14a9ff;
  }

  .mv_singer {
    color: #999;
    font-size: .8em;
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
          pagesize: 10,
          pagesizes: [10, 20, 50],
          total: 0
        },
        mvs: []
      }
    },
    methods: {
      search () {
        this.mvs = []
        this.loading = true
        let promise = http({
          url: '/kugou/mvs',
          method: 'get',
          params: {
            keyword: this.keyword,
            page: this.tableData.page,
            pagesize: this.tableData.pagesize
          }
        })
        promise.then(response => {
          let result = response.data
          this.tableData.data = result.data
          this.tableData.total = result.total
          for (let i in result.data) {
            let item = result.data[i]
            this.mvs.push({
              cover: 'http://imge.kugou.com/mvhdpic/240/' + item.Pic.substring(0, 8) + '/' + item.Pic,
              hash: item.MvHash,
              title: item.MvName,
              singer: item.SingerName
            })
          }
          this.loading = false
        }).catch(error => {
          console.log(error)
          this.loading = false
        })
      },
      // 获取歌曲地址
      playMv (row) {
        let promise = http({
          method: 'get',
          url: '/kugou/mvs/play',
          params: {
            hash: row.hash
          }
        })
        promise.then(response => {
          let result = response.data
          console.log(result)
        })
        .catch(function (error) {
          console.log(error)
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

