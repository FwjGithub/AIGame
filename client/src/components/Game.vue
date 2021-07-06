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
        <el-col :span="4" class="vs">VS</el-col>
        <el-col :span="10" class="computer">
            <img ref="img" :src="randomImg" width="510" height="494" />
        </el-col>
    </el-row>
    <el-row class="result">
        <el-col :span="6"></el-col>
        <el-col :span="5" class="player">
            <div :class="winner === 'player' ? 'model' : ''">
                <canvas id="canvas" ref="canvas" width="255" height="247"></canvas>
            </div>
            <span>{{player}}</span>
        </el-col>
        <el-col :span="2" class="vs">VS</el-col>
        <el-col :span="5" class="computer">
            <div :class="winner === 'computer' ? 'model' : ''">
                <img ref="showImg" width="255" height="247" />
            </div>
            <span>{{computer}}</span>
        </el-col>
        <el-col :span="6"></el-col>

        <!-- <el-col :span="5" class="winner">
            <span>{{winner}}</span>
        </el-col>-->
        <el-drawer title="比赛结束" v-model="showFinished" direction="ltr">
            <!-- <div>
                {{winScore > finishCount / 2 ? '恭喜你，赢得比赛！': '很遗憾，你输了！'}}
            </div>
            <div>
                请选择
            </div>-->
            <div class="drawer-content">
                <el-form :model="form">
                    <el-form-item label="玩家昵称" :label-width="formLabelWidth">
                        <el-input v-model="userName" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="游戏场数" :label-width="formLabelWidth">
                        <el-select v-model="finishCount" placeholder="请选择猜拳次数">
                            <el-option label="三局两胜" value="3"></el-option>
                            <el-option label="五局三胜" value="5"></el-option>
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item>{{winScore > finishCount / 2? "恭喜你，赢了！": "很遗憾，你输了"}}</el-form-item> -->
                    <!-- <el-form-item></el-form-item> -->
                </el-form>
                <div>{{winScore > finishCount / 2? "恭喜你，赢了！": "很遗憾，你输了"}}</div>
            </div>
            <div class="drawer-footer">
                <el-button @click="handleExit">退出游戏</el-button>
                <el-button
                    type="primary"
                    @click="handleCommit"
                    :loading="loading"
                >{{ loading ? '提交中 ...' : '再来一轮' }}</el-button>
            </div>
        </el-drawer>
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
import resToGesture from "../util/resToGesture";
//510 494
export default {
    data(props) {
        // console.log(this.$route.query);

        // console.log(props.count)
        let winScore = ref(0);
        let loseScore = ref(0);
        let deuceScore = ref(0);
        let randomImg = ref(Five);
        let timer = ref(null);
        let winner = ref("（进行中）");
        let player = ref("玩家");
        let computer = ref("电脑");
        let count = ref(this.$route.query.count);
        let userName = ref(this.$route.query.userName);
        let showFinished = ref(false);
        let finishCount = this.$route.query.count;
        // 调用摄像头
        let form = { userName, finishCount };

        return {
            winScore,
            loseScore,
            deuceScore,
            randomImg,
            timer,
            winner,
            player,
            computer,
            count,
            userName,
            showFinished,
            finishCount,
            form
        };
    },
    watch() {
        // console.log(this.$route.query);
        // this.$route
    },
    mounted() {
        window.addEventListener("keypress", e => {
            // console.log(e);
            if (this.$route.path !== "/game") return;
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
                    player.classname = resToGesture(player.classname);
                }
                if (player) {
                    this.$data.player = player.classname;
                }
                this.$data.computer = resToGesture(computer);
                // this.$data.computer = computer;

                if (win === 0) {
                    this.$data.winner = "";
                    this.$data.deuceScore++;
                    // console.log("平手")
                } else if (win === 1) {
                    this.$data.winner = "player";
                    this.$data.winScore++;

                    // console.log("胜利了！")
                } else if (win === -1) {
                    this.$data.winner = "computer";
                    this.$data.loseScore++;

                    // console.log("失败了。。")
                }
                if (win === 1 || win === -1) this.$data.count--;
                if (this.$data.count === 0) this.$data.showFinished = true;
                // if (
                //     this.$data.count === 0 &&
                //     this.$data.winScore > this.$route.query.count / 2
                // ) {
                //     this.$data.showFinished.value = true;
                //     console.log("恭喜你，赢了！");
                // } else if (
                //     this.$data.count === 0 &&
                //     this.$data.winScore < this.$route.query.count / 2
                // ) {
                //     this.$data.showFinished.value = true;

                //     console.log("很遗憾，你输了。");
                // }
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
        },
        handleCommit(e) {
            // console.log(this.$data.form.count,this.$data.form.userName);
            this.$router.push({
                path: "/game",
                query: {
                    userName: this.$data.form.userName,
                    count: this.$data.form.finishCount
                }
            });
            this.initData();
        },
        initData() {
            this.$data.showFinished = false;
            this.$data.count = this.$route.query.count;
            this.$data.userName = this.$route.query.userName;
            this.$data.winScore = 0;
            this.$data.loseScore = 0;
            this.$data.deuceScore = 0;
            this.$data.randomImg = Five;
            this.$data.timer = null;
            this.$data.winner = "（进行中）";
            this.$data.player = "玩家";
            this.$data.computer = "电脑";
            this.$data.finishCount = this.$route.query.count;
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
.result .drawer-content {
    padding: 10px 20px;
}
.result .drawer-footer {
    display: flex;
    justify-content: flex-end;
    padding: 10px 20px;
}
.result .vs {
    font-size: 50px;
    font-weight: 600;
    text-align: center;
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
.result .model::after {
    position: absolute;
    transform: translateX(-100%);
    display: inline-block;
    width: 257px;
    height: 249px;
    line-height: 249px;
    content: "胜";
    color: #fee;
    background-color: rgba(0, 0, 0, 0.2);
}
.result .player canvas {
    border: 1px solid rgba(0, 0, 255, 0.2);
}
/* .result .player, .result .computer{
    display: flex;
    flex-direction: column
} */
.winner {
    font-weight: 600;
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>