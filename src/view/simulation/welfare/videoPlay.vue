<template>
  <div>
    <h4>{{video.title}}</h4>
    <video id="video" controls :poster="video.posterUrl"></video>
  </div>
</template>

<style scoped>
  #video {
    display: block;
    width: 600px;
    max-width: 100%;
    margin: 0 auto;
  }
</style>


<script>
  import Hls from 'hls'

  export default {
    data () {
      return {
        video: this.$route.params
      }
    },
    mounted () {
      if (Hls.isSupported()) {
        var video = document.getElementById('video')
        var hls = new Hls()
        hls.loadSource(this.video.indexUrl)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          video.play()
        })
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = this.video.indexUrl
        video.addEventListener('canplay', function () {
          video.play()
        })
      }
    }
  }
</script>
