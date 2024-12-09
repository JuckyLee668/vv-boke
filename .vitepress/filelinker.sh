function ftitle(){
    echo "
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  //base: '/note/',
  base: '/./', 
  title: \"学，行之，上也\",
  description: \"欢迎来到淅寒的博客\",
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
    " >>"$temp_file"
}

temp_file="temp.js"


> "$temp_file"

function mklist(){
    directory="../$1"

    files=("$directory"/*.md)
    file_count=${#files[@]} # 文件总数


    # 生成内容到临时文件
    echo "'/$1/': [" >> "$temp_file"
    echo "  {" >> "$temp_file"
    echo "    text: 'Docs'," >> "$temp_file"
    echo "    items: [" >> "$temp_file"

    for ((i = 0; i < file_count; i++)); do
    file="${files[i]}"
    if [ -f "$file" ]; then
        filename=$(basename "$file") # 提取文件名
        name_without_ext="${filename%.*}" # 去掉扩展名
        link="/$1/${name_without_ext}" # 拼接 link

        # 提取第一个 # 后的标题
        first_heading=$(grep -m 1 '^# ' "$file" | sed 's/^# //' | tr -d '\r')

        # 如果没有找到标题，则使用文件名作为 text
        text="${first_heading:-$name_without_ext}"

        if ((i == file_count - 1)); then
        # 最后一个文件
        echo "      { text: '$text', link: '$link' }" >> "$temp_file"
        else
        # 普通文件
        echo "      { text: '$text', link: '$link' }," >> "$temp_file"
        fi
    fi
    done

    echo "    ]" >> "$temp_file"
    echo "  }" >> "$temp_file"
    echo "]," >> "$temp_file"
}


function etitle(){
    echo "    
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
" >> "$temp_file"
}
# 打印前半固定部分
ftitle
# 打印中间目录
directory="../"

# 使用 find 命令查找目录并排除文件
folders=$(find "$directory" -maxdepth 1 -type d | grep -v '/\.')
# 遍历并输出文件夹名字
for folder in $folders; do
    mklist "$folder"
done

# 打印后半固定部分
etitle

target_file="config.mts"

mv "$temp_file" "$target_file"

# rm "$temp_file"
