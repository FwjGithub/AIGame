<template>
    <el-row class="max">
        <el-col>
            <input
                class="mid"
                placeholder="请输入昵称以进入游戏"
                v-model="userName"
                @keydown.enter="toChooseCount"
            />
        </el-col>
    </el-row>
    <el-row v-show="countVisible">
        <el-dialog title="提示" v-model="countVisible" width="30%" center>
            <span>选择猜拳次数：</span>
            <el-select placeholder="请选择猜拳次数" v-model="count">
                <el-option label="一局决胜" value="1"></el-option>
                <el-option label="三局两胜" value="3"></el-option>
                <el-option label="五局三胜" value="5"></el-option>
            </el-select>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="toGamePage">
                        确定
                        <!-- <router-link :to="{ path: '/game', query: { userName ,count }}" >确定</router-link> -->
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </el-row>
    <router-view></router-view>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
export default {
    setup(props) {
        const userName = ref("");
        const countVisible = ref(false);
        const count = ref(3);
        const router = useRouter();
        // console.log(router)
        const toChooseCount = function() {
            // console.log("调用了count");
            countVisible.value = true;
        };
        const toGamePage = function() {
            countVisible.value = false;
            router.push({
                path: "/game",
                query: { userName: userName.value, count: count.value }
            });
        };
        return {
            userName,
            countVisible,
            toChooseCount,
            count,
            toGamePage
        };
    }
};
</script>

<style >
* {
    padding: 0;
    margin: 0;
}

html,
body {
    height: 100%;
}

.max {
    height: 100vh;
    width: 100vw;
    background: #fff;
    text-align: center;
}
.mid {
    margin: 0 auto;
    text-align: center;
    min-width: 30%;
    border: none;
    border-bottom: 3px solid black;
    outline: none;
    font-weight: 600;
    font-size: 25px;
    margin-top: 35vh;
}
</style>