<template>
    <el-row class="header">
        <el-col :span="5">按空格开始游戏</el-col>
        <el-col :span="5">按ENTER进行拍照</el-col>
        <el-col :span="5">按Q关闭摄像头</el-col>
        <el-col :span="9" class="score">
            当前比分：
            <span>{{score}}</span>
        </el-col>
    </el-row>
    <el-row class="content">
        <el-col :span="10" class="player">
            <video ref="video" width="510" height="494" autoplay></video>
        </el-col>
        <el-col :span="4" :v-show="false" class="vs">VS</el-col>
        <el-col :span="10" :v-show="false" class="computer">
            <img ref="img" :src="randomImg" width="510" height="494" />
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="5">
            <canvas id="canvas" ref="canvas" width="510" height="494"></canvas>
        </el-col>
    </el-row>
</template>   
<script>
import axios from "axios";
import { ref, onMounted } from "vue";
import shitou from "../assets/shitou.png";
import jiandao from "../assets/jiandao.png";
import bu from "../assets/bu.png";

export default {
    data() {
        let score = ref(0);
        let randomImg = ref(bu);
        // 调用摄像头

        return {
            score,
            randomImg
        };
    },
    mounted() {
        console.log(this);
        window.addEventListener("keypress", e => {
            console.log(e);
            if (e.keyCode === 32) {
                this.callCamera();
            } else if (e.keyCode === 13) {
                this.photograph();
            } else if (e.keyCode === 113) {
                this.closeCamera();
            }
            this.changeRandomImg();
        });
    },
    methods: {
        // 调用摄像头
        callCamera() {
            // H5调用电脑摄像头API
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then(success => {
                    console.log(success);
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
            ctx.drawImage(this.$refs["video"], 0, 0, 510, 494); // 转base64格式、图片格式转换、图片质量压缩
            let imgBase64 = this.$refs["canvas"].toDataURL("image/png", 0.3); // 由字节转换为KB 判断大小
            console.log("b64:", imgBase64);
            axios({
                method: "post",
                url: "/api",
                data: { image: imgBase64.trim() }
            }).then(res => {
                console.log(res.data.data);
            });
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
            console.log("已关闭摄像头");
        },
        changeRandomImg() {
            setInterval(e => {
                let random = Math.floor(Math.random() * 3) + 1;

                if (random === 1) {
                    this.$data.randomImg = shitou;
                } else if (random === 2) {
                    this.$data.randomImg = jiandao;
                } else {
                    this.$data.randomImg = bu;
                }
            }, 100);
        }
    }
};
</script>

<style scoped>
.header {
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    padding: 10px 30px;
    margin-bottom: 10px;
    background-color: rgba(0, 0, 0, 0.1);
}
.header .score {
    background-color: rgba(0, 0, 255, 0.2);
}
.content {
    padding: 20px 30px;
}
.content .player,
.content .computer {
    border: 5px solid rgba(0, 0, 0, 0.2);
}
.content .computer img {
    border: none !important;
    outline: none;
}
.content .vs {
    font-size: 60px;
    font-weight: 600;
    text-align: center;
    padding-top: 150px;
}
</style>