import fs from 'node:fs';
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';

import presetRemToPx from '@unocss/preset-rem-to-px';
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss';

// 本地 SVG 图标存放目录
const iconsDir = './src/assets/svgs';

// 读取本地 SVG 目录，自动生成 `safelist`
const generateSafeList = () => {
  try {
    return fs
      .readdirSync(iconsDir)
      .filter(file => file.endsWith('.svg'))
      .map(file => `i-svg:${file.replace('.svg', '')}`);
  } catch (error) {
    console.error('无法读取图标目录:', error);
    return [];
  }
};
export default defineConfig({
  theme: {
    colors: {
      // 主色
      primary: '#3875c6',
      // 次要颜色
      secondary: '#F6F7F8'
    }
  },
  // 自定义类样式
  shortcuts: [
    ['fixed-bottom-btns', 'absolute bottom-0 left-0 right-0 flex flex-col justify-center py-15px '],
    // flex布局
    ['flex-center', 'flex justify-center items-center'],
    ['flex-between', 'flex justify-between items-center'],
    ['flex-around', 'flex justify-around items-center'],
    ['flex-evenly', 'flex justify-evenly items-center'],
    ['flex-start', 'flex justify-start items-center'],
    ['flex-end', 'flex justify-end items-center'],
    ['flex-col', 'flex flex-col'],
    ['flex-col-between', 'flex flex-col items-center justify-between'],
    ['flex-col-center', 'flex flex-col justify-center items-center'],
    // 文本溢出省略
    ['text-truncate', 'whitespace-nowrap overflow-hidden text-ellipsis'],
    // 背景重复
    ['bg-no-repeat-contain', 'bg-no-repeat bg-contain'],
    ['bg-no-repeat-cover', 'bg-no-repeat bg-cover'],
    // 绝对定位
    ['abs-full', 'absolute left-0 right-0 top-0 bottom-0'],
    ['abs-x-center', 'absolute left-50% top-0 translate-x--1/2'],
    ['abs-y-center', 'absolute left-0 top-50% translate-y--1/2'],
    ['abs-center', 'absolute left-50% top-50% translate-x--1/2 translate-y--1/2'],
    // 图片
    ['wh-full-contain', 'wh-full object-contain'],
    ['wh-full-cover', 'wh-full object-cover'],
    ['wh-full', 'w-full h-full'],
    ['border-b-1', 'border-b border-b-#d9d9d9 border-b-solid']
  ],
  rules: [
    [
      /^([pm])-(\d+)_(\d+)(?:_(\d+))?(?:_(\d+))?(?:_(\d+))?$/,
      ([, type, top, right, bottom, left]) => {
        const pm = type === 'p' ? 'padding' : 'margin';
        const sides = [top, right, bottom, left]
          .filter(Boolean)
          .map(item => `${item}px`)
          .join(' ');
        return {
          [pm]: sides
        };
      }
    ],
    [
      /^wh-(\d+)$/,
      ([, wh]) => ({
        width: `${wh}px`,
        height: `${wh}px`
      })
    ]
  ],
  presets: [
    presetUno(),
    // 配置rem转px，设置基准大小为4
    presetRemToPx({
      baseFontSize: 4
    }),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      // 设置全局图标默认属性
      extraProperties: {
        width: '1em',
        height: '1em',
        display: 'inline-block'
      },
      // 注册本地 SVG 图标集合
      collections: {
        // svg 是图标集合名称，使用 `i-svg:图标名` 调用
        svg: FileSystemIconLoader(iconsDir, (svg) => {
          // 如果 SVG 文件未定义 `fill` 属性，则默认填充 `currentColor`
          // 这样图标颜色会继承文本颜色，方便在不同场景下适配
          return svg.includes('fill="')
            ? svg
            : svg.replace(/^<svg /, '<svg fill="currentColor" ');
        })
      }
    })
  ],
  safelist: generateSafeList(),
  transformers: [
    transformerDirectives(),
    transformerVariantGroup()
  ]
});
