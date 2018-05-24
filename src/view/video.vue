<template>
<div class="container">
  <h2>{{video.singer + '-' + video.songname}}</h2>
  <el-form :inline="true" :model="formInline" class="demo-form-inline">
    <el-form-item label="分辨率">
      <el-select v-model="fileUrl" placeholder="请选择">
        <el-option
          v-for="item in videoData"
          :key="item.hash"
          :label="item.label"
          :value="item.url">
        </el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <video :src="fileUrl" controls></video>
</div>
</template>

<style scoped>
  .container {
    margin: 0 auto;
  }

  video {
    max-width: 100%;
  }

  @media screen and ( min-width: 1200px ) {
    .container {
      width: 1200px;
    }
  }
</style>

<script>
  import {getParam} from '@/utils/common'
  import http from '@/utils/http'

  export default {
    mounted () {
      this.loadVideo()
    },
    data () {
      return {
        video: {},
        fileUrl: ''
      }
    },
    methods: {
      loadVideo () {
        let param = getParam('hash')
        http({
          method: 'get',
          url: '/kugou/mvs/play',
          params: {
            hash: param
          }
        }).then(response => {
          this.video = response.data
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    computed: {
      videoData () {
        let data = []
        let mvdata = this.video.mvdata
        for (let name in mvdata) {
          let label = ''
          switch (name) {
            case 'sq':
              label = '超清'
              break
            case 'hd':
              label = '高清'
              break
            case 'rq':
              label = '普清'
              break
            case 'sd':
              label = '流畅'
              break
          }
          data.push({
            hash: mvdata[name].hash,
            label: label,
            url: mvdata[name].downurl
          })
        }
        return data
      }
    }
  }
</script>
