<template>
    <div>
        <!--canvas截取流-->
        <canvas ref="canvas" width="640" height="480"></canvas>
        <!--图片展示-->
        <video ref="video" width="640" height="480" autoplay></video>
    </div>
</template>   
<script>
import  logo from '../assets/logo.png'
import axios from 'axios'
export default {
    data() {
        return {
            // headImgSrc: logo
        };
    },
    mounted(){
        window.addEventListener('keypress', e => {
            console.log(e)
            if(e.keyCode === 32){
                this.callCamera();
            }else if(e.keyCode === 13){
                this.photograph();
            }else if(e.keyCode === 113){
                this.closeCamera()
            }
        });
    },
    methods: {
        // 调用摄像头
        callCamera() {
            // H5调用电脑摄像头API
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then(success => {
                    console.log(success)
                    // 摄像头开启成功
                    this.$refs["video"].srcObject = success;
                    // 实时拍照效果
                    this.$refs["video"].play();
                })
                .catch(error => {
                    console.error("摄像头开启失败，请检查摄像头是否可用！");
                });
        }, // 拍照
        photograph() {
            let ctx = this.$refs["canvas"].getContext("2d"); // 把当前视频帧内容渲染到canvas上
            ctx.drawImage(this.$refs["video"], 0, 0, 640, 480); // 转base64格式、图片格式转换、图片质量压缩
            let imgBase64 = this.$refs["canvas"].toDataURL("image/png", 0.3); // 由字节转换为KB 判断大小
            console.log("b64:", imgBase64);
            axios({
                method: 'post',
                url: '/api',
                data: {image: imgBase64.trim()}
            }).then(res => {
                console.log(res.data.data);
            })
        }, // 关闭摄像头,
        closeCamera() {
            if (!this.$refs["video"].srcObject) {
                this.dialogCamera = false;
                return;
            }
            let stream = this.$refs["video"].srcObject;
            let tracks = stream.getTracks();
            tracks.forEach(track => {
                track.stop();
            });
            this.$refs["video"].srcObject = null;
            console.log("已关闭摄像头")
        }
    }
};
</script>