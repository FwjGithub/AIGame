<template>
  <el-row>
    <el-button type="primary" @click="test">坑逝请求</el-button>
  </el-row>
</template>
		
<script>
import Home from "./components/Home.vue";
import axios from "axios";
import jiandao from "./assets/jiandao.png";
import getBase64 from "./util/getBase64";
export default {
  name: "App",
  components: {
    Home
  },
  methods: {
    test(e) {
      (function() {
        const img = new Image();
        img.src = jiandao;
        img.onload = function() {
          const img64 = getBase64(img);
          console.log("64:", img64);
          axios({
            method: "post",
            // url: "/api",
            url: 'https://aip.baidubce.com/rest/2.0/image-classify/v1/gesture?access_token=24.4c970024b9ba655b8f2869f94a24c4db.2592000.1627528349.282335-24456953',
            params: { image: img64 }
          }).then(result => {
            console.log(result);
          });
        };
      })();

      // axios.post('/api', {data: "bu"}).then(res => {
      //     console.log(res);
      // })
    }
  }
};
</script>
