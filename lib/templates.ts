
function des(middle: string, after?: string) {
  const before = 'vite6'
  after ??= 'scss + axios'
  return `${before} + ${middle} + ${after}`
}

export default [
  {
    name: 'vue-ts-template',
    value: 'github:huangmingfu/vue-ts-template',
    description: des('vue3.5 + pinia + vueuse'),
    type: 'vue'
  },
  {
    name: 'vue3-mini-template 轻量级模板',
    value: 'github:huangmingfu/vue-mini-template',
    description: des('vue3.5 + pinia + vueuse + @antfu/eslint-config'),
    type: 'vue-mini'
  },
  {
    name: 'vue-js-template',
    value: 'github:huangmingfu/vue-js-template',
    description: des('vue3.5', 'js'),
    type: 'vue-js'
  },
  {
    name: 'react-ts-template',
    value: 'github:huangmingfu/react-ts-template',
    description: des('react19 + ahooks + zustand + immer'),
    type: 'react'
  },
  {
    name: 'react-mobile-template 移动端模板',
    value: 'github:huangmingfu/react-mobile-template',
    description: des('react18 + ahooks + zustand + immer + rem + antd-mobile'),
    type: 'react-mobile'
  },
  {
    name: 'vue3组件库模板',
    value: 'github:huangmingfu/vue3-turbo-component-lib-template',
    description: des('vue3.5 + monorepo + turbo + rollup'),
    type: 'vue-lib'
  },
]
