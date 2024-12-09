import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  //base: '/note/',
  base: '/./', 
  title: "学，行之，上也",
  description: "欢迎来到淅寒的博客",
  lastUpdated: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/favicon.svg',
    search: {
      provider: 'local'
    },
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    nav: [
      { text: '主页', link: '/' },
      { text: '文档', link: '/docs/docs' },
      { text: '工具', link: '/tools/tools' }
    ],

    sidebar: {

      // 当用户位于根目录时，会显示此侧边栏
      

      // 当用户位于 `docs` 目录时，会显示此侧边栏
      '/docs/': [
        {
          text: 'Docs',
          items: [
            { text: 'VitePress 使用教程', link: '/docs/docs' },
            { text: 'latex初级入门', link: '/docs/latex' },
            { text: 'latex cls文件编写教程', link: '/docs/latexcls' },
            { text: 'Linux', link: '/docs/linuxnew' },
            { text: 'HarmonyNext UI', link: '/docs/harmonyNextUI' },
            { text: 'Openharmony 编译', link: '/docs/openharmony' },
	    { text: 'MQTT协议', link: '/docs/MQTT' }
          ]
        }
      ],

      // 当用户位于 `tools` 目录时，会显示此侧边栏
      '/tools/': [
        {
          text: 'Tools',
          items: [
            { text: 'Index', link: '/tools/' },
            { text: 'Three', link: '/tools/three' },
            { text: 'Four', link: '/tools/four' }
          ]
        }
      ]
    },
  
    socialLinks: [
      { icon: 'github', link: 'https://github.xi-han.top/JuckyLee668' }
     ]
    //,
    // footer: {
    //   message: 'Released under the <a href="https://github.com/vuejs/vitepress/blob/main/LICENSE">MIT License</a>.',
    //   copyright: 'Copyright © 2019-present <a href="https://github.com/yyx990803">Evan You</a>'
    // }
  }
})
