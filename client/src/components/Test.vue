<template>
    <el-row v-show="centerDialogVisible = true">
        <el-dialog title="提示" v-model="centerDialogVisible" width="30%" center>
            <span>需要注意的是内容是默认不居中的</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="centerDialogVisible = false">
                        <router-link to='/game'>确定</router-link>
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </el-row>
</template>

<script>
import { onMounted, ref } from "vue";
export default {
    setup(props) {
        let centerDialogVisible = ref(false);

        onMounted(function() {
            centerDialogVisible.value = true;
        });
        return {
            centerDialogVisible
        };
    }
};
</script>