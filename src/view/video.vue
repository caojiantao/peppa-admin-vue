<template>
<div class="container">
  <div>
    <el-select v-model="fileUrl" placeholder="请选择分辨率">
      <el-option
        v-for="item in videoData"
        :key="item.hash"
        :label="item.label"
        :value="item.url">
      </el-option>
    </el-select>
  </div>
  <video :src="fileUrl" controls></video>
</div>
</template>

<style scoped>
  .container {
    width: 1200px;
    margin: 0 auto;
  }

  video {
    max-width: 100%;
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
          console.log(response.data)
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
