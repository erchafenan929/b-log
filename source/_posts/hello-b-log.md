---
title: 开站第一篇：这个博客是怎么搭起来的
date: 2026-11-11 20:30:00
categories:
  - 建站笔记
tags:
  - Hexo
  - Fluid
  - Markdown
---

起因有点绕：我本来想找一个叫「b-log」的博客程序直接用，结果在 GitHub 上翻了一圈，叫这个名字的仓库要么 star 是 0、要么是三年没动过的 Next.js 练习项目、要么干脆是 bash 日志库，多数连 LICENSE 都没有。个人作品当参考很好，当底座就不太合适了。

<!-- more -->

## 换了个思路：从真实站点反推

后来看到一个正在跑的个人博客，内容、导航、阅读体验都挺对味，就不猜了，直接去看它的页面本身：

- 响应头 `Server: Netlify`
- `<meta name="generator" content="Hexo 8.0.0">`
- 页脚写着 `Hexo × Fluid`
- 源码里有主题注入的注释 `hexo injector head_end`

四件事互相印证，技术栈就定死了：**Hexo 生成静态页 + Fluid 主题 + Netlify 托管**。这比读十篇「2026 年最值得用的博客框架」有用得多——看一个真的在跑的站，能连带着把部署方式一起看清楚。

## 最后选定的方案

| 层 | 选择 | 理由 |
| --- | --- | --- |
| 生成器 | Hexo 8.x | 社区成熟，中文资料多，Markdown 直接写 |
| 主题 | Fluid 1.9.9 | 参考站同款，自带分类/标签/搜索/暗色模式 |
| 内容 | `source/_posts/*.md` | 纯文本，能被 git 管理，不依赖任何后台 |
| 托管 | Netlify / GitHub Pages | 都是推代码就自动构建，零服务器 |

没有数据库、没有后台、没有 CMS。文章就是一个个 `.md` 文件，站点是 `hexo generate` 吐出来的一堆 HTML。好处是十年后这些文件大概率还能打开；坏处是评论、统计这类动态功能得另外接。

## 一篇文章怎么变成网页

frontmatter 写元数据，正文写 Markdown，文件名决定 URL：

```yaml
---
title: 文章标题
date: 2026-11-11 20:30:00
categories: [建站笔记]
tags: [Hexo]
---

摘要部分。

<!-- more -->

这行之后只在文章页显示。
```

几个实际用起来才知道的点：

- 站里配的是 `permalink: :title/`，所以 `hello-b-log.md` 对应 `/hello-b-log/`。想让链接是英文、标题是中文，靠的就是文件名和 `title` 分开写。
- `<!-- more -->` 控制首页摘要截断；不写，主题会自动截。
- 草稿丢进 `source/_drafts/`，默认不发布，改完用 `hexo publish` 再放出来。
- 改主题**不要**动 `node_modules/hexo-theme-fluid/`，一律写进根目录的 `_config.fluid.yml` 覆盖，升级主题才不会丢。

## 部署：两条路，同一个坑

两条路都是「连仓库 → 自动构建 → 出静态文件」：`netlify.toml` 指定了构建命令和 `public/` 发布目录；`.github/workflows/pages.yml` 则在每次 push 到 main 后用 Actions 部署到 GitHub Pages。

真正容易翻车的是**域名和子路径**。Hexo 里 `url` 是完整站点地址，`root` 是资源根路径。如果部署到 `用户名.github.io/仓库名/` 这种子路径却把 `root` 留成 `/`，CSS、JS、图片全会 404，页面能打开但样式全丢。

所以这里加了一个 `tools/set-url.js`：构建前读 `SITE_URL`（Netlify 也能直接用内置的主站点地址），自动把 `_config.yml` 的 `url` 和 `root` 都改对，含子路径情况。本地开发不设这个变量，脚本直接跳过，不会动你的配置。具体步骤写在 `DEPLOY.md` 里。

## 现在还没做的

数学公式、流程图、评论系统、访问统计都还没开。Fluid 本身支持，需要时按官方配置往 `_config.fluid.yml` 里加几行就行——先让写东西这件事本身没有阻力，比一开始就堆功能重要。

另外提醒一句：Fluid 是 GPL-3.0 许可，二次分发主题代码时记得遵守。

## 接下来

骨架已经能跑了，剩下的是往里填内容。第一篇就写它自己，算是把地基记下来，免得半年后想改配置时又得重新翻一遍。
