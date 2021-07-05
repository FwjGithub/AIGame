<template>
    <el-row class="header">
        <el-col :span="3">按空格开始游戏</el-col>
        <el-col :span="3">按ENTER进行拍照</el-col>
        <el-col :span="3">按Q关闭摄像头</el-col>
        <el-col :span="5">玩家：{{userName}}</el-col>
        <el-col :span="9" class="score">
            <span>胜：{{winScore}}</span>
            <span>负：{{loseScore}}</span>
            <span>平：{{deuceScore}}</span>
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
            <span >{{player}}</span>
        </el-col>
        <el-col :span="5" class="computer">
            <img ref="showImg" width="255" height="247" />
            <span>{{computer}}</span>
        </el-col>
        <el-col :span="5" class="wall">
            <span>{{wall}}</span>
        </el-col>
    </el-row>
    <el-row v-show="countVisible">
        <el-dialog title="提示" v-model="countVisible" width="30%" center>
            <span>请选择猜拳次数</span>
            <el-select v-model="count"   placeholder="请选择猜拳次数:">
                <el-option label="3局2胜" value=3></el-option>
                <el-option label="5局3胜" value=5></el-option>
            </el-select>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="countVisible = false">
                        <router-link :to="{ path: '/game', query: { userName,count }}" >确定</router-link>
                    </el-button>
                </span>
            </template>
        </el-dialog>

        
    </el-row>
</template>   
<script>
import axios from "axios";
import { ref, onMounted } from "vue";
import Fist from "../assets/Fist.png";
import Two from "../assets/Two.png";
import Five from "../assets/Five.png";
import getBase64 from "../util/getBase64";
import getGesture from "../util/getGesture";
import judgeWin from "../util/judgeWin";
import resToGesture from '../util/resToGesture'
//510 494
export default {
    data(props) {
        console.log(this.$route.query)

        // console.log(props.count)
        let winScore = ref(0);
        let loseScore = ref(0);
        let deuceScore = ref(0);
        let randomImg = ref(Five);
        let timer = ref(null);
        let wall = ref("（进行中）");
        let player = ref("玩家");
        let computer = ref("电脑");
        let count = ref(this.$route.query.count)
        let userName = ref(this.$route.query.userName)
        let countVisible = ref(false)
        // 调用摄像头

        return {
            winScore,
            loseScore,
            deuceScore,
            randomImg,
            timer,
            wall,
            player,
            computer,
            count,
            userName,
            countVisible
        };
    },
    watch(){
        console.log(this.$route.query)
        // this.$route
    },
    mounted() {
        window.addEventListener("keypress", e => {
            // console.log(e);
            if(this.$route.path !== '/game') return;
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
                .match(/\/(Five|Two|Fist)/)[0]
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
                } else {
                    player.classname = resToGesture(player.classname)
                }
                if (player) {
                    this.$data.player = player.classname;
                }
                this.$data.computer = resToGesture(computer);
                // this.$data.computer = computer;

                if (win === 0) {
                    this.$data.wall = "打平了";
                    this.$data.deuceScore++;
                    // console.log("平手")
                } else if (win === 1) {
                    this.$data.wall = "玩家胜！";
                    this.$data.winScore++;

                    // console.log("胜利了！")
                } else if (win === -1) {
                    this.$data.wall = "电脑胜。。。";
                    this.$data.loseScore++;

                    // console.log("失败了。。")
                }
                if(win !== undefined && --this.$data.count === 0){
                    let score = this.$data.winScore - this.$data.loseScore;
                    console.log('你的最终得分是：',score);
                    if(score > 0) console.log("恭喜你，赢了！")
                    else console.log("很遗憾，你输了。")
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
                    this.$data.randomImg = Two;
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
    display: flex;
    justify-content: space-around;
    background-color: rgba(0, 0, 255, 0.2);
}
.content {
    padding: 20px 30px;
    display: flex;
    justify-content: space-between;
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
    text-align: center;
    align-items: center;
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