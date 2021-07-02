<template>
    <el-row class="header">
        <el-col :span="5">按空格开始游戏</el-col>
        <el-col :span="5">按ENTER进行拍照</el-col>
        <el-col :span="5">按Q关闭摄像头</el-col>
        <el-col :span="9" class="score">
            当前得分：
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
    <el-row class="result">
        <el-col :span="5" class="player">
            <canvas id="canvas" ref="canvas" width="255" height="247"></canvas>
            <span>{{player}}</span>
        </el-col>
        <el-col :span="5" class="computer">
            <img ref="showImg" width="255" height="247" />
            <span>{{computer}}</span>
        </el-col>
        <el-col :span="5" class="wall">
            <span>{{wall}}</span>
        </el-col>
    </el-row>
</template>   
<script>
import axios from "axios";
import { ref, onMounted } from "vue";
import Fist from "../assets/Fist.png";
import two from "../assets/two.png";
import Five from "../assets/Five.png";
import getBase64 from "../util/getBase64";
import getGesture from "../util/getGesture";
import judgeWin from "../util/judgeWin";
//510 494
export default {
    data() {
        let score = ref(0);
        let randomImg = ref(Five);
        let timer = ref(null);
        let wall = ref("（进行中）");
        let player = ref("玩家");
        let computer = ref("电脑");
        // 调用摄像头

        return {
            score,
            randomImg,
            timer,
            wall,
            player,
            computer
        };
    },
    mounted() {
        // console.log(this);
        window.addEventListener("keypress", e => {
            // console.log(e);
            if (e.keyCode === 32) {
                this.callCamera();
                this.changeRandomImg();
            } else if (e.keyCode === 13) {
                this.photograph();
            } else if (e.keyCode === 113) {
                this.closeCamera();
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
                    // console.log(success);
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
            ctx.drawImage(this.$refs["video"], 0, 0, 255, 247); // 转base64格式、图片格式转换、图片质量压缩
            let imgBase64 = this.$refs["canvas"].toDataURL("image/png", 0.3); // 由字节转换为KB 判断大小
            // console.log("b64:", imgBase64);
            // .then(res => {
            //     console.log(res.data.data);
            // });
            // console.log();
            //清楚定时器
            clearInterval(this.$data.timer);
            this.$data.timer = null;
            this.$refs["showImg"].src = this.$data.randomImg;
            const computer = this.$data.randomImg
                .toString()
                .match(/\/(Five|two|Fist)/)[0]
                .slice(1);
            // console.log(computer);
            axios({
                method: "post",
                url: "/api",
                data: { image: imgBase64 }
            }).then(res => {
                let player = getGesture(res.data.data.result);
                let win = judgeWin(player.classname, computer);
                console.log(player.classname, computer, win);
                if (!player) {
                    this.$data.player = "识别出错，本轮重来";
                } else if (player.classname === "Five") {
                    player.classname = "布";
                } else if (player.classname === "two") {
                    player.classname === "剪刀";
                } else if (player.classname === "Fist") {
                    player.classname = "石头";
                }
                if (player) {
                    this.$data.player = player.classname;
                }
                // this.$data.computer = computer;

                if (win === 0) {
                    this.$data.wall = "打平了";
                    // console.log("平手")
                } else if (win === 1) {
                    this.$data.wall = "玩家胜！";
                    this.$data.score++;

                    // console.log("胜利了！")
                } else if (win === -1) {
                    this.$data.wall = "电脑胜。。。";
                    this.$data.score--;

                    // console.log("失败了。。")
                }
            });

            // Promise.all(axios({
            //     method: "post",
            //     url: "/api",
            //     data: { image: imgBase64 }
            // }), axios({
            //     method: "post",
            //     url: "/api",
            //     data: { image: computerData }
            // })).then((res1, res2) => {
            //     console.log(res1, res2)
            // })
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
            this.$data.timer = setInterval(e => {
                let random = Math.floor(Math.random() * 3) + 1;

                if (random === 1) {
                    this.$data.randomImg = Fist;
                } else if (random === 2) {
                    this.$data.randomImg = two;
                } else {
                    this.$data.randomImg = Five;
                }
                // console.log("计时器。。。");
            }, 200);
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
.result {
    height: 35vh;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #eee;
}
.result .player,
.result .computer {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: 30px;
    font-weight: 600;
}
.result .player canvas {
    border: 1px solid rgba(0, 0, 255, 0.2);
}
/* .result .player, .result .computer{
    display: flex;
    flex-direction: column
} */
.wall {
    font-weight: 600;
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>