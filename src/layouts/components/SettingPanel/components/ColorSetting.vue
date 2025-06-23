<template>
  <div class="color-setting">
    <SectionTitle title="系统主题色" />
    <div class="main-color-wrap">
      <div class="offset">
        <div
          v-for="color in appConfig.systemMainColor"
          :key="color"
          :style="{ background: `${color} !important` }"
          @click="selectColor(color)"
        >
          <el-icon v-show="color === systemThemeColor" class="iconfont-sys">
            <Check />
          </el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import appConfig from '@/config';
import { useSettingStore } from '@/store/modules/setting';
import SectionTitle from './SectionTitle.vue';

const settingStore = useSettingStore();
const { systemThemeColor } = storeToRefs(settingStore);

const selectColor = (color: string) => {
  settingStore.setElementTheme(color);
  settingStore.reload();
};
</script>

<style lang="scss" scoped>
.color-setting {
  .main-color-wrap {
    .offset {
      display: flex;
      flex-wrap: wrap;
      width: calc(100% + 16px);

      $size: 23px;

      > div {
        display: flex;
        align-items: center;
        justify-content: center;
        width: $size;
        height: $size;
        margin: 0 16px 10px 0;
        cursor: pointer;
        border-radius: $size;

        &:last-of-type {
          margin-right: 0;
        }

        i {
          font-size: 14px;
          color: #fff !important;
        }
      }
    }
  }
}
</style>
