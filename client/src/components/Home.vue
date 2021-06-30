<template>
    <el-row class="max">
        <el-col>
            <input
                class="mid"
                placeholder="请输入昵称以进入游戏"
                v-model="name"
                @keydown.enter="toChooseCount"
            />
        </el-col>
    </el-row>
    <el-row v-show="countVisible">
        <el-dialog title="提示" v-model="countVisible" width="30%" center>
            <span>请选择猜拳次数</span>
            <el-select v-model="count" placeholder="请选择猜拳次数">
                <el-option label="3局2胜" value=3></el-option>
                <el-option label="5局3胜" value=5></el-option>
                <el-option label="7局4胜" value=7></el-option>
            </el-select>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="countVisible = false">
                        <router-link to="/game" >确定</router-link>
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </el-row>
    <router-view></router-view>
</template>

<script>
import { ref } from "vue";
export default {
    setup(props) {
        const name = ref("");
        const countVisible = ref(false);
        const count = ref(3);
        const toChooseCount = function() {
            console.log("调用了count");
            countVisible.value = true;
        };
        return {
            name,
            countVisible,
            toChooseCount,
            count
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