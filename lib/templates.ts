
function des(middle: string, after?: string) {
  const before = 'vite'
  after ??= 'scss + axios'
  return `${before} + ${middle} + ${after}`
}

export default [
  // 我的项目
  {
    name: 'vue3-ts-template',
    value: 'huangmingfu/vue3-ts-template',
    description: des('vue3.5 + pinia + vueuse'),
    type: 'vue'
  },
  {
    name: 'vue3-mini-template 轻量级模板',
    value: 'huangmingfu/vue3-mini-template#main',
    description: des('vue3.5 + pinia + vueuse + @antfu/eslint-config'),
    type: 'vue-mini'
  },
  {
    name: 'vue3-js-template',
    value: 'huangmingfu/vue3-js-template',
    description: des('vue3.5', 'js'),
    type: 'vue-js'
  },
  {
    name: 'react-ts-template',
    value: 'huangmingfu/react-ts-template',
    description: des('react19 + ahooks + zustand + immer'),
    type: 'react'
  },
  {
    name: 'react-mobile-template 移动端模板',
    value: 'huangmingfu/react-mobile-template',
    description: des('react18 + ahooks + zustand + immer + rem + antd-mobile'),
    type: 'react-mobile'
  },
  {
    name: 'vue3 组件库模板',
    value: 'huangmingfu/vue3-turbo-component-lib-template',
    description: des('vue3.5 + monorepo + turbo + rollup'),
    type: 'vue-lib'
  },
  // 其他开源项目
  {
    name: 'nuxt3-template',
    value: 'LUDA0831/nuxt3-template-demo#main',
    description: 'nuxt3 + pinia + vueuse + unocss',
    type: 'nuxt'
  },
  {
    name: 'electron-vite-vue',
    value: 'electron-vite/electron-vite-vue#main',
    description: 'vite + electron + vue3',
    type: 'electron'
  },
  {
    name: 'unibest',
    value: 'codercup/unibest#main',
    description: 'uniapp + Vue3 + Ts + Vite + UnoCss + wot-ui + z-paging',
    type: 'uniapp'
  },
  {
    name: 'vue3-vant-mobile',
    value: 'easy-temps/vue3-vant-mobile#main',
    description: 'vue3 + vant + axios + less + pinia + vconsole + vue-i18n + vueuse',
    type: 'vue-vant'
  },
]

// 其他工具库
// listr：可以在命令行中画出进度列表。
// easy-table：可以在命令行中输出表格。
// figlet：可以在命令行中输出 ASCII 的艺术字体。