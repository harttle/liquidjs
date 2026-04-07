const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const src = path.join(root, 'CHANGELOG.md')

let content = fs.readFileSync(src, 'utf8').replace(/\r\n/g, '\n')

const lines = content.split('\n')
lines[0] = lines[0]
  .replace(/"/g, '&quot;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
content = lines.join('\n')

content = content
  .replace(/{%/g, '{% raw %}{%{% endraw %}')
  .replace(/\{\{/g, '{% raw %}{{{% endraw %}')

const enFrontmatter = '---\ntitle: Changelog\nauto: true\n---\n\n'
const zhFrontmatter = '---\ntitle: 更新日志\nauto: true\n---\n\n'

fs.writeFileSync(path.join(root, 'docs/source/tutorials/changelog.md'), enFrontmatter + content)
fs.writeFileSync(path.join(root, 'docs/source/zh-cn/tutorials/changelog.md'), zhFrontmatter + content)
