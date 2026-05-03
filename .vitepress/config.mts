import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'

function generateSidebarFromFS() {
  const docsDir = path.resolve(__dirname, '..')
  const items = []

  const dirs = fs
    .readdirSync(docsDir)
    .filter(
      f =>
        fs.statSync(path.join(docsDir, f)).isDirectory() &&
        !f.startsWith('.') &&
        f !== '.vitepress'
    )
    .sort()

  for (const dir of dirs) {
    const files = fs
      .readdirSync(path.join(docsDir, dir))
      .filter(f => f.endsWith('.md') && f !== 'index.md')
      .map(f => f.replace(/\.md$/, ''))
      .sort()

    if (files.length > 0) {
      items.push({
        text: dir,
        link: `/${dir}/`,
        items: files.map(f => ({ text: f, link: `/${dir}/${f}` }))
      })
    }
  }

  return items
}

export default defineConfig({
  base: '/./',
  title: '学，行之，上也',
  description: '欢迎来到淅寒的博客',
  lastUpdated: true,
  appearance: 'dark',
  themeConfig: {
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
      { text: 'Home', link: '/' },
      { text: '文档', link: '/docs/' },
      { text: '项目展示', link: '/projects/' },
      { text: '工具', link: '/tools/' }
    ],
    sidebar: generateSidebarFromFS(),
    socialLinks: [{ icon: 'github', link: 'https://github.xi-han.top/JuckyLee668' }]
  }
})
