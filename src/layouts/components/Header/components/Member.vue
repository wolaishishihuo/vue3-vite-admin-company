<template>
    <div class="header-member">
        <el-dropdown>
            <el-avatar :size="25" :src="avatarUrl" class="avatar" />
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="handleUserCenter">
                        <el-icon>
                            <User />
                        </el-icon>
                        个人中心
                    </el-dropdown-item>
                    <el-dropdown-item @click="handleLogout">
                        <el-icon>
                            <Switch />
                        </el-icon>
                        退出
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const userStore = useUserStore();
const avatarUrl = computed(() => userStore.userInfo?.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png');
const handleLogout = () => {
    userStore.logout();
};
const handleUserCenter = () => {
    router.push('/profile');
};
</script>
<style scoped lang="scss">
.header-member {
    cursor: pointer;
}
</style>
