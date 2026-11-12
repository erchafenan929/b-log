# 一步一步改网站（VS Code 版）

> 本手册按 **VS Code + Windows** 写。项目里已配好 `.vscode/settings.json`：打开 `D:\b-log` 文件夹后，新建终端会自动是 Git Bash、自动停在项目目录，**不用敲 `cd`，不用加 `.cmd` 后缀**。  
> 如果你坚持用 PowerShell 终端：先 `cd D:\b-log`，并把所有 `npm` / `npx` 写成 `npm.cmd` / `npx.cmd`（本机执行策略禁止运行 `.ps1`）。



---

## 先记住两条规则（2026-11-12 实测）

| 改了什么                                   | 保存后要做什么                         |
| -------------------------------------- | ------------------------------- |
| 文章 `source/_posts/*.md`                | `Ctrl+S` → **刷新浏览器就生效**，什么都不用重启 |
| 配置 `_config.yml` / `_config.fluid.yml` | `Ctrl+S` → **必须重启预览服务** → 刷新才生效 |

实测过程：把 `_config.yml` 的 `title` 改成 `TITLE-TEST-999` 并保存，等 2 秒后抓预览页，`<title>` 仍是 `B-log`；重新执行一次 Hexo 命令，产物里才变成 `TITLE-TEST-999`。配置只在启动时读取一次。

还有一件事：你现在看的 `http://localhost:4000` 是后台帮你起的预览，**在 VS Code 里按 `Ctrl+C` 停不掉它**，而且它可能自己退出（之前断过几次）。所以涉及改配置时，请按第 1 步自己起一个能完全掌控的预览。

---

## 第 0 步：打开项目

1. 双击桌面 **`Visual Studio Code.lnk`**（注意不是 `Visual Studio 2026 Insiders.lnk`，那个是重型 IDE）。
2. 菜单 **文件 → 打开文件夹…**，选 `D:\b-log`，点「选择文件夹」。
3. 左侧资源管理器能看到 `_config.yml`、`_config.fluid.yml`、`source`、`README.md`、`CUSTOMIZE.md`。

> 必须是「打开**文件夹**」。只打开单个 `.md` 文件的话，终端配置不生效，后面命令会找不到目录。

## 第 1 步：起一个自己能控制的预览

### 推荐：VS Code 任务，一条命令都不用敲

1. 按 **`Ctrl+Shift+B`**，或菜单 **终端 → 运行任务…** → 选 **「启动博客预览 (4001)」**。
2. 终端面板出现 `INFO  Hexo is running at http://localhost:4001/` 就是成功。
3. 浏览器打开 **http://localhost:4001**，确认能看到首页。

项目里的 `.vscode/tasks.json` 已把这个任务设成默认生成任务。它直接调用项目内的 `node_modules/hexo-cli/bin/hexo`，**不经过 `npx`、不经过终端 shell、强制在项目目录运行**，所以不受执行策略、终端类型和当前目录影响。

**终端面板别关。** 以后每次改完 `.yml`：点面板右侧的垃圾桶图标（或 `Ctrl+C`）停止任务，再按一次 `Ctrl+Shift+B` 重启。

### 备选：在终端里敲

先确认当前目录对（敲 `pwd`，应显示 `/d/b-log`），再用这条：

```bash
node node_modules/hexo-cli/bin/hexo server -p 4001
```

同样看到 `Hexo is running at http://localhost:4001/` 后，按 `Ctrl+C` → `↑` → 回车即可重启。

> **不要用 `npx hexo server`**：终端不在项目目录时，`npx` 会联网重新下载整个 hexo，屏幕长时间不动，看起来就是「没反应」；PowerShell 下 `npx` 还会被执行策略拦截。  
> 若提示端口被占用（`Port 4001 has been used`），说明已有一个实例在跑，改任务里的 `-p 4001` 为 `-p 4002`，浏览器也换 4002。  
> 4000 那个后台预览保留着，互不影响；改文章 `.md` 时两边都会同步更新。

## 第 2 步：先只改一行，把整条链路跑通（别跳过）

1. 左侧点开 **`_config.yml`**。
2. 找到第 4 行 `title: B-log`，改成：
   ```yaml
   title: "我的博客"
   ```
   （中文建议包在英文双引号里，避免 YAML 把特殊字符当语法。）
3. `Ctrl+S` 保存。
4. 停止预览任务（终端面板的垃圾桶图标，或 `Ctrl+C`），再按 `Ctrl+Shift+B` 重启它。
5. 浏览器按 `Ctrl+F5` 强制刷新。

✅ **成功标志**：浏览器标签页标题、页面左上角都变成「我的博客」。

做到这一步，后面所有改动都是同一个套路：**改文件 → 保存 → 重启预览 → 刷新**。

## 第 3 步：改站点基本信息（`_config.yml`）

打开 `_config.yml`，按行改：

| 行号 | 现在是什么                                   | 改成什么          |
| -- | --------------------------------------- | ------------- |
| 4  | `title: B-log`                          | 站名，浏览器标签和导航栏用 |
| 5  | `subtitle: 用 Markdown 记录点什么`            | 副标题 / 简介      |
| 6  | `description: 一个用 Hexo + Fluid 搭建的个人博客` | 站点描述，搜索引擎用    |
| 7  | `author: B-log`                         | 署名            |

改完 `Ctrl+S` → 重启预览 → 刷新。第 12 行 `url`、`第 13 行 root` **本地阶段不要动**（见第 7 步）。

## 第 4 步：改导航、标语、关于页（`_config.fluid.yml`）

打开 **`_config.fluid.yml`**：

| 行号   | 字段                        | 作用                                                  |
| ---- | ------------------------- | --------------------------------------------------- |
| 6    | `navbar.blog_title`       | 导航栏左上角文字（留空则跟随第 3 步的 `title`）                       |
| 8–12 | `navbar.menu`             | 菜单条目，**删掉一整行就删掉对应菜单**；调整行顺序即调整显示顺序                  |
| 22   | `index.banner_img_height` | 首页头图高度，0–100（屏幕百分比）                                 |
| 23   | `index.banner_mask_alpha` | 头图暗色遮罩，0–1.0，越大越暗                                   |
| 26   | `index.slogan.text`       | 首页中央打字机效果的大标语                                       |
| 40   | `about.name`              | 关于页姓名                                               |
| 41   | `about.intro`             | 关于页一句话简介                                            |
| 43   | `about.icons`             | 关于页社交图标（当前为空数组 `[]`；给了 GitHub 地址再按 `{ class, link, tip }` 格式加一行） |

示例：把标语和署名换成自己的

```yaml
  slogan:
    enable: true
    text: "随手记点什么"
```

```yaml
  name: "我的名字"
  intro: "想成为一个优秀的人类"
```

> 菜单的 `key` 是主题内置的翻译键（`home` / `archive` / `category` / `tag` / `about`），随便写新名字会显示成英文原文。要加自定义菜单项，先查 [Fluid 配置指南](https://fluid.ist/docs/guide/)。

改完 `Ctrl+S` → 重启 → 刷新。关于页**正文**不在这个文件里，在 `source/about/index.md`。

## 第 5 步：换头像和头图

1. 左侧资源管理器在 **`source`** 上右键 → **新建文件夹** → 输入 `img`。
2. 把自己的两张图片拖进 `D:\b-log\source\img\`，分别命名：
   - `avatar.png` —— 关于页头像
   - `default.png` —— 首页 / 关于页头图
3. 配置里已经引用了这两个路径，**不用改任何 `.yml`**。
4. 重启预览 → 刷新。

> 图片是 `.jpg` 怎么办：把 `_config.fluid.yml` 第 21、36、39 行里的 `.png` 改成 `.jpg`，与实际文件名完全一致（大小写也要一致）。  
> 暂时不换也没关系，主题自带默认图，不会出现裂图。

## 第 6 步：改配色 / 暗色模式

`_config.fluid.yml` 末尾的 `dark_mode` / `color` / `font` 段**已经启用**，直接改值即可，不用再删注释。当前用的是：

```yaml
dark_mode:
  enable: true
  default: auto          # auto | light | dark
color:
  body_bg_color: "#f7f6f3"
  navbar_bg_color: "#3a4a5a"
  navbar_text_color: "#ffffff"
font:
  font_size: 16px
```

- `default` 可选 `auto`（跟随系统/时间）、`light`、`dark`。
- 颜色是 CSS 十六进制值，随便换；`font_size` 改全局字号。
- 想恢复主题默认：把整段每行开头加回 `# ` 注释掉即可。

改完照例 `Ctrl+S` → 重启 → 刷新。

> 只在这里改。**不要动 `node_modules/hexo-theme-fluid/` 里的任何文件**，升级主题会被覆盖。

## 第 7 步：改网址

三种「网址」不是一回事：

| 想改       | 怎么做                                                                                                                                                                                                                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 本地预览地址   | 由第 1 步命令的 `-p 4001` 决定，换成 `-p 5000` 就变成 `http://localhost:5000`                                                                                                                                                     |
| **正式域名** | `_config.yml` 第 12 行 `url: https://example.com` 是占位符，**本地不用改，上线时也不用手改**：部署前 `tools/set-url.js` 会按平台自动写 `url` 和 `root`（含 GitHub Pages 的 `/仓库名/` 子路径）。绑定自己的域名时，在 Netlify / GitHub Actions 里设 `SITE_URL`，见 `DEPLOY.md` |
| 文章链接形式   | `_config.yml` 第 15 行 `permalink: :title/`，**文件名就是网址**（`my-post.md` → `/my-post/`）。改成 `:year/:month/:day/:title/` 会加日期层级，但**旧链接全部失效**，要改趁现在                                                                          |

## 第 8 步：把改动存起来（本地存档，还没上线）

在 VS Code 终端里：

```bash
git add .
git commit -m "改了站名和标语"
```

想撤销某个还没提交的改动：在编辑器里 `Ctrl+Z`，或用「源代码管理」侧栏对文件点「放弃更改」。

## 第 9 步：上线（需要你本人登录账号）

目前 git 只有本地提交，**没有远程仓库、没 push、没部署**。步骤见 `DEPLOY.md`：GitHub 建空仓库 → `git remote add origin ...` → `git push -u origin main` → 在 Netlify 或 GitHub Pages 授权。

授权做完之后，以后改网站 / 发文只要：

```bash
git add . && git commit -m "说明改了什么" && git push
```

平台自动构建部署，不用手动上传 `public/`。

---

## 附：你写的那篇随笔

`source/_posts/hello-b-log.md` 里已经补好了 frontmatter（只在开头加了 8 行元数据，**正文一个字没动**）：

```yaml
---
title: 你好，这是我的第一篇博客
date: 2026-11-12 16:39:00
categories:
  - 随笔
tags:
  - 随想
---
```

没有这段的话，Hexo 会把文件名 `hello-b-log` 当成标题，分类页、标签页也是空的。`title`、`categories`、`tags` 都可以按第 3 步的方式改成你想要的；文件名 `hello-b-log.md` 决定网址是 `/hello-b-log/`，想换网址就改文件名（英文小写 + 连字符最稳）。

## 排查表

| 现象                            | 原因 / 处理                                                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npx hexo server -p 4001` 没反应 | 终端不在项目目录时 npx 会联网下载整个 hexo；PowerShell 下还会被 `.ps1` 执行策略拦。**别用 npx**，改按 `Ctrl+Shift+B` 跑任务，或用 `node node_modules/hexo-cli/bin/hexo server -p 4001` |
| `Ctrl+Shift+B` 提示找不到 node     | 把 `.vscode/tasks.json` 里 `"command": "node"` 改成绝对路径 `C:\\Program Files\\nodejs\\node.exe`                                                        |
| 改了 `.yml`，刷新没变化               | 没重启预览。停掉任务 → `Ctrl+Shift+B` → `Ctrl+F5`                                                                                                          |
| `Ctrl+C` 没反应                  | 你停的是 4001 自己起的那个吗？4000 是后台实例，停不掉，也不用停                                                                                                            |
| 改 `.md` 也没变化                  | 文件是不是在 `source/_drafts/`？是不是没 `Ctrl+S`？强制刷新一次                                                                                                    |
| 终端是 `PS C:\...>`              | 菜单「终端 → 新建终端」右侧下拉选 `Git Bash`，或 `Ctrl+Shift+P` → `Terminal: Select Default Profile` → Git Bash → **关掉旧终端再新建**                                    |
| 提示端口被占用                       | 换端口：`node node_modules/hexo-cli/bin/hexo server -p 4002`                                                                                                                    |
| 改完页面乱了 / 报错                   | 多半是 YAML 缩进或引号不对：值统一加英文双引号，层级用空格（不要用 Tab）。改不回来就 `Ctrl+Z` 撤回                                                                                      |
| 图片不显示                         | 必须在 `source/img/` 下；文件名和 `_config.fluid.yml` 里写的完全一致，含扩展名大小写                                                                                     |
| 想看配置全部可选字段                    | [Fluid 配置指南](https://fluid.ist/docs/guide/) 或 `node_modules/hexo-theme-fluid/_config.yml`（只读参考）                                                  |
