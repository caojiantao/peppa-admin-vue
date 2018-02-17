<template>
  <div>
    <el-form inline>
      <el-form-item>
        <el-button @click="randomPic">随缘</el-button>
      </el-form-item>
    </el-form>

    <ul class="girls">
      <li v-for="girl in girls" :key="girl._id">
        <div>
          <img :src="girl.url" alt="">
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>

  .girls {
    margin: 0;
    padding: 0;
    column-width: 220px;
  }

  .girls:after {
    content:""; 
    display: block; 
    clear: both; 
  }

  .girls li {
    margin: 0;
    list-style: none;
    float: left;
    cursor: pointer;
  }

  .girls img {
    width: 100%;
    transition: all 0.2s;
  }

  .girls img:hover {
    transform: scale(1.1);
  }
</style>


<script>
  import ajax from '@/utils/ajax'

  export default {
    mounted () {
      this.randomPic()
    },
    data () {
      return {
        girls: []
      }
    },
    methods: {
      randomPic () {
        ajax({
          url: 'http://gank.io/api/random/data/%E7%A6%8F%E5%88%A9/100',
          method: 'get'
        }).then(response => {
          let result = response.data
          this.girls = result.results
        }).catch(function (error) {
          console.log(error)
        })
      }
    }
  }
</script>

