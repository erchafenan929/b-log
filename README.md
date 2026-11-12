# B-log

一个可以直接写起来的个人博客，照着 [chose-b-log.top](https://chose-b-log.top/) 的技术方案与外观搭的。

> **说明**：只复刻了技术方案和页面结构，**没有复制参考站的文章、图片或个人信息**。
> 当前只有一篇已发布文章（自己的随笔）；三篇写法教程放在 `source/_drafts/`，默认不发布，需要时移回 `source/_posts/` 即可。
> Fluid 主题采用 GPL-3.0 许可，二次分发主题代码时请遵守其许可证。
>
> **想按步骤改站名、外观、头像、网址？看 [CUSTOMIZE.md](./CUSTOMIZE.md)（VS Code 一步一步版）。**

## 技术栈

| 项目 | 版本 / 说明 |
| --- | --- |
| Hexo | 8.x（参考站为 8.0.0） |
| 主题 | [Fluid](https://github.com/fluid-dev/hexo-theme-fluid) 1.9.9，Material Design 风格 |
| 部署 | Netlify（参考站同款，见 `netlify.toml`）；也备了 GitHub Actions → GitHub Pages |
| 内容 | 纯 Markdown，无数据库、无后台、无 CMS |
| 特性 | 中文界面、首页摘要、分类 / 标签 / 归档 / 关于页、站内搜索、代码高亮、暗色模式 |

参考站的判定依据：响应头 `Server: Netlify`、`<meta name="generator" content="Hexo 8.0.0">`、页脚 Hexo + Fluid 链接、主题注入注释 `hexo injector head_end`。

## 目录结构

```
b-log/
├── _config.yml              # 站点配置：标题、作者、域名、永久链接
├── _config.fluid.yml        # 主题覆盖配置：导航、首页 Banner、关于页
├── DEPLOY.md                # 完整上线操作清单（Netlify / GitHub Pages）
├── netlify.toml             # Netlify 构建配置
├── .github/workflows/pages.yml   # 备选：GitHub Pages 自动部署
├── scripts/
│   └── set-url.js           # 构建前按真实域名自动修正 url / root
├── source/
│   ├── _posts/              # 已发布的文章
│   ├── _drafts/             # 草稿与写法教程，默认不发布
│   ├── about/index.md       # 关于页
│   ├── categories/index.md  # 分类页
│   └── tags/index.md        # 标签页
└── public/                  # 构建产物（已 gitignore，不用手动传）
```

## 快速开始

```bash
npm install       # 首次或换机器时执行
npm run dev       # 清缓存 + 启动本地预览
```

浏览器打开 <http://localhost:4000>。`hexo server` 会监听文件变化，保存 Markdown 即可看到效果。

生成静态文件：

```bash
npm run build     # 等价于 hexo generate，产物在 public/
```

## 写一篇文章

先在终端进入项目目录：VS Code / PowerShell 敲 `cd D:\b-log`，CMD 敲 `cd /d D:\b-log`，Git Bash 敲 `cd /d/b-log`。推荐用命令创建文章——`scaffolds/post.md` 已配好模板，生成的文件自带标题、日期、分类、标签和摘要分隔，直接改内容即可：

```bash
npx hexo new "文章标题"
```

也可以直接在 `source/_posts/` 下手动新建 `.md` 文件，效果一样。文件内容长这样：

```yaml
---
title: 文章标题
date: 2026-11-11 20:00:00
categories:
  - 笔记
tags:
  - Hexo
---

正文从这里开始。

<!-- more -->

这行之后的内容只在文章页显示。
```

要点：

- **文件名即 URL**：`permalink: :title/`，所以 `hello-b-log.md` → `/hello-b-log/`。想要英文路径就用英文文件名（标题仍可中文）。
- `<!-- more -->` 控制首页摘要的截断点，不写则由主题自动截取。
- 草稿放 `source/_drafts/`，默认不发布；`npx hexo publish "标题"` 可发布。
- 图片放 `source/img/`，正文里用 `/img/xxx.png` 引用。
- 更详细的写法教程见 `source/_drafts/` 里的《怎么写一篇新文章》和《Markdown 常用语法速查》。

## 改网址

- **本地预览**固定是 `http://localhost:4000`；想换端口用 `npx hexo server -p 5000`。
- **正式域名**：`_config.yml` 里的 `url: https://example.com` 只是本地占位，**上线时不用手改**。构建前 `tools/set-url.js` 会读取部署平台的域名，自动写好 `url` 和 `root`（含 GitHub Pages 的 `/仓库名/` 子路径）。绑定自定义域名时，到 Netlify / GitHub Actions 里设 `SITE_URL` 即可，细节见 `DEPLOY.md`。
- **文章链接**：由 `permalink: :title/` 决定，文件名就是网址（`my-post.md` → `/my-post/`）。想加日期层级可改成 `:year/:month/:day/:title/`，但**会让已有链接失效**，建议建站初期就定好。

## 个性化

改动只涉及两个文件。改完要按 `Ctrl+C` 停预览再 `npm run dev` 重启（配置不在文件监听范围内）。

| 想改什么 | 文件 | 字段 |
| --- | --- | --- |
| 站名 / 副标题 / 简介 / 署名 | `_config.yml` | `title` `subtitle` `description` `author` |
| 导航左上角文字 | `_config.fluid.yml` | `navbar.blog_title` |
| 导航菜单条目（增删） | `_config.fluid.yml` | `navbar.menu`，一行一项 |
| 首页大标语 | `_config.fluid.yml` | `index.slogan.text` |
| 首页头图高度、遮罩深浅 | `_config.fluid.yml` | `index.banner_img_height` `index.banner_mask_alpha` |
| 关于页姓名、简介、社交图标 | `_config.fluid.yml` | `about.name` `about.intro` `about.icons[].link` |
| 头像、头图 | `source/img/avatar.png`、`source/img/default.png` | 放同名图片覆盖；不换也能正常显示（主题自带默认图） |
| 暗色模式、配色、字号 | `_config.fluid.yml` | 文件末尾有注释模板，去掉 `#` 即生效 |

**不要直接改 `node_modules/hexo-theme-fluid/` 里的文件**，升级主题会丢；一律写进 `_config.fluid.yml` 覆盖。

## 上线

**完整步骤见 [`DEPLOY.md`](DEPLOY.md)**，包含 Netlify / GitHub Pages 两条路径、需要本人登录的操作、变量配置、验收清单和故障排查。

这里只说最容易误解的一点：`_config.yml` 里的 `url: https://example.com` 是本地占位，**线上不用手改**。构建前 `tools/set-url.js` 会读取部署平台的域名，自动把 `url` 和 `root` 写对，包括 GitHub Pages 的 `/仓库名/` 子路径。

真正需要你按自己情况改的只有：站名与署名、关于页 GitHub 图标链接、头像和头图（不换也能正常显示，主题自带默认图）。

## 可选功能

Fluid 内置但默认未开启的能力，都在 `_config.fluid.yml` 里加配置即可，完整字段见 [官方配置指南](https://fluid.ist/docs/guide/)：

- **LaTeX 数学公式**：参考站用了 `hexo-math`。若需要，按 Fluid 文档换渲染器为 `hexo-renderer-markdown-it` + `@traptitech/markdown-it-katex`，并打开 `post.math`。
- **Mermaid 流程图**、**脚注**、**评论系统**（Waline / Giscus 等）、**访问统计**、**自定义配色与字体**。
- 主题配置不要直接改 `node_modules/` 里的文件，一律写进 `_config.fluid.yml` 覆盖，升级主题才不会丢。

## 在 VS Code 里使用

项目自带 `.vscode/settings.json`。用 VS Code **打开文件夹 `D:\b-log`**（文件 → 打开文件夹，不要只打开单个文件），再「终端 → 新建终端」：会自动使用 Git Bash 并停在 `D:\b-log`，**不用敲 `cd`**，本文所有命令原样可用。

如果提示符是 `PS ...>`（PowerShell），说明配置没生效：`Ctrl+Shift+P` → `Terminal: Select Default Profile` → 选 `Git Bash`，关掉旧终端再新建一个。也可以留在 PowerShell，用 `cd D:\b-log` 配合 `npm.cmd run dev` / `npx.cmd hexo new "标题"`。

> 该配置只作用于这个文件夹，不影响其他项目。换电脑后若 Git Bash 不在 `C:\Program Files\Git\bin\bash.exe`，改一下 `.vscode/settings.json` 里的 `path` 即可。

## 常用命令

> **终端怎么选**：推荐 **Git Bash**，本文命令可原样照抄。若用 VS Code 默认的 PowerShell，本机执行策略是 `Restricted`，`npm` / `npx` 会因 `.ps1` 被禁止而报错，要写成 `npm.cmd run dev`、`npx.cmd hexo new "标题"`；CMD 终端里 `npm` 可直接使用。进入目录的写法分别是：PowerShell `cd D:\b-log`、CMD `cd /d D:\b-log`、Git Bash `cd /d/b-log`。

| 命令 | 作用 |
| --- | --- |
| `npm install` | 安装依赖 |
| `npm run dev` | 本地预览（localhost:4000） |
| `npm run build` | 生成 `public/` |
| `npm run clean` | 清缓存 |
| `npx hexo new "标题"` | 新建文章 |
| `npx hexo new page "页面名"` | 新建自定义页面 |
