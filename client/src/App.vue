<template>
    <el-row>
    </el-row>
    <router-view></router-view>
</template>
        
<script>
import Home from "./components/Home.vue";
// import
export default {
    name: "App",
    components: {
        Home,
    }
};
</script>
