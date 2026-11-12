# 上线操作清单（照着点就行）

项目在 `D:\b-log`。代码侧的部署配置已经全部写完并实测通过，**你不需要改任何脚本**。
先看「三条路线」选一条，然后按对应章节一步步做。

## 零、网址速查（找不到网址就看这里）

| 用途 | 网址 | 现在能不能打开 |
| --- | --- | --- |
| **本地预览**（写文章时看效果） | **http://localhost:4000/** | ✅ 能，预览服务正在跑 |
| 自己启动的预览端口 | `http://localhost:4001/` | ⚠️ 只有在 VS Code 里跑过「启动博客预览 (4001)」任务才会通；没跑就是打不开 |
| GitHub 仓库（放代码的地方） | https://github.com/erchafenan929/b-log | ✅ 能 |
| **上线设置页**（只剩这一步要点） | **https://github.com/erchafenan929/b-log/settings/pages** | ✅ 能，进去把 Source 选成 GitHub Actions |
| 查看自动构建是否成功 | https://github.com/erchafenan929/b-log/actions | ✅ 能 |
| **正式博客网址**（上线后给别人看） | **https://erchafenan929.github.io/b-log/** | ❌ 现在打开是 **404**，属于正常现象 |

> ⚠️ **正式网址打不开不是「网址丢了」**：GitHub Pages 还没启用（接口查过，Pages 站点尚不存在），所以这个地址现在必然 404。按第七节启用 Pages 并 Re-run 之后，**地址不会变**，还是 `https://erchafenan929.github.io/b-log/`，刷新就能看到博客。
>
> 桌面已经放了三个快捷方式：`博客-本地预览`、`博客-上线设置`、`博客-正式网址`，双击即可打开，不用记网址。

> **当前进度（2026-11-12 核实）**：代码已推送到 **https://github.com/erchafenan929/b-log**（公开仓库，默认分支 `main`，最新提交 `a2bc6ee`），`origin` 已关联、分支已跟踪。**建仓库和 push 这两步已经做完，不要重复做。**
>
> **现在只剩一次网页点击**：想省事 → 到仓库 **Settings → Pages**，把 Source 选成 **GitHub Actions**（路线 2，不用再注册账号），再到 Actions 里 Re-run all jobs；想用 Netlify → 直接跳到路线 1 的**第 3 步**导入仓库。站点本身尚未上线。

## 一、三条路线，先选一条

| | 路线 0：Netlify Drop | 路线 1：GitHub + Netlify | 路线 2：GitHub Pages |
| --- | --- | --- | --- |
| 需要 GitHub 账号 | **不需要** | 需要（免费） | 需要（免费） |
| 需要敲 git 命令 | **不需要** | 需要 2 条 | 需要 2 条 |
| 大概几步 | 拖一次文件夹 | 建仓库 → push → 导入 | 建仓库 → push → 改设置 |
| 得到的地址 | `https://随机名.netlify.app` | `https://xxx.netlify.app` | `https://用户名.github.io/仓库名/` |
| 站点长期保留 | 要注册并认领，否则会过期 | 是 | 是 |
| 以后发新文章 | 重新构建 + 再拖一次 | **`git push` 自动上线** | **`git push` 自动上线** |
| 仓库是否必须公开 | 不涉及 | 公开/私有都行 | **必须 Public**（免费账户限制） |
| 适合 | 先看看线上效果 | 长期写下去（推荐） | 不想多注册一个账号 |

**只想尽快看到一个能打开的网址 → 路线 0。** 打算一直写、以后不想手动上传 → 路线 1。

> ⚠️ 三种方式得到的**站点本身都是公开的**。首页那篇是你的私人随笔，公开前请自己确认。
> 另外 GitHub Free 账户的 Pages 只支持 **Public 仓库**（2026-11 核实），选路线 2 意味着源码也一并公开；路线 1 可以用私有仓库。

## 二、终端里到底输什么（速查 + 自检）

VS Code 里 **文件 → 打开文件夹** 选 `D:\b-log`，按 `Ctrl+Shift+反引号键` 新建终端。提示符是 `$`、已自动停在项目目录，**不用敲 `cd`**。

| 想做什么 | 在终端里敲什么 |
| --- | --- |
| 路线 0：拖文件夹上线 | **什么都不用敲**，去浏览器拖 `public/` 就行 |
| 上线前自检（可选） | `node tools/predeploy-check.js` |
| 关联 GitHub 仓库 | **不要手敲**：到 GitHub 建仓成功页，复制它给出的那行 `git remote add origin ...` 粘贴执行（地址已填好） |
| 推送到 GitHub | `git push -u origin main` |
| 以后发新文章 | `git add . && git commit -m "新文章" && git push` |
| 重新生成 `public/` | `npm run build` |
| 起本地预览 | `Ctrl+Shift+B`，或 `node node_modules/hexo-cli/bin/hexo server -p 4001` |
| 新建文章 | `node node_modules/hexo-cli/bin/hexo new "英文文件名"` |

**最重要的一条：带 `< >` 尖括号的是占位符，绝不能原样复制。** 本机就曾被把 `https://github.com/<用户名>/<仓库名>.git` 当成真实地址加进 `origin`，这种地址 `git push` 必然失败，现已清除。GitHub 建好空仓库后的成功页会显示一段「…or push an existing repository from the command line」，里面的用户名和仓库名都是填好的，**复制那几行最保险**。

另外两条：不用 `cd`（终端已配好启动目录）；不要用 `npx`（会联网重新下载 hexo，看起来像卡死，在默认终端还会被执行策略拦掉）。

**本机 push 若报证书错误**（`schannel: CRYPT_E_NO_REVOCATION_CHECK` 或 `unable to get local issuer certificate`）：这是 Windows 证书吊销状态检查失败，不是账号问题。只在报错时加一次性参数，**不要写进全局配置**：

```bash
git -c http.sslVerify=false push
```

本机首次推送就是用这条成功的；单独设 `http.schannelCheckRevoke=false` 实测无效。全局与仓库级的 SSL 配置均保持原样，未被改动。

**自检**（只读，不改任何文件）：`node tools/predeploy-check.js`。当前结果：8 个部署文件齐全、35 个产物、依赖完整、分支 `main`、已关联真实远程仓库、工作区干净；只剩一条提示（产物含占位域名 2 处，会在部署时自动替换），结论「可以上线」。脚本也会帮你抓出写着占位符的 `origin`。

---

## 三、路线 0：Netlify Drop —— 不用账号，2 分钟

### 准备

- 一个能上网的浏览器（推荐 Chrome / Edge）
- `D:\b-log\public\` 文件夹已构建好（当前 35 个文件，含 `index.html`）

### 步骤

1. 浏览器打开 **https://app.netlify.com/drop**
2. 打开 Windows 资源管理器，进入 `D:\b-log`
3. 把 **`public` 这个文件夹整个**拖到网页上的虚线框里（不是拖 `b-log`，也不要只拖里面的文件）
4. 等进度条走完（通常几十秒），页面出现一个 `https://xxxxx.netlify.app` 的链接 → **成功**
5. 点开链接，按第六节验收清单看一眼

### 必须知道的 4 件事

- **不登录也能拖**，Netlify 官方明确支持匿名部署；但这属于临时站点，会自动过期、URL 可能带临时密码。想长期保留就按页面提示注册（免费，邮箱 / GitHub / Google 登录都行）并 **claim** 认领。
- **未登录时 Netlify 原样发布你拖进去的文件，不会帮你构建**，所以一定要先有 `public/`。如果之后改了文章，先在终端跑 `npm run build` 再拖。
- 站内链接全是相对路径，我实测过：**页面显示完全正常**。唯一的小瑕疵是分享卡片 `og:url` 仍写着 `example.com`（微信/QQ 里转发时卡片链接不对）。拿到正式地址后告诉我，我帮你重新构建一次，再拖一次就修正了。
- **以后更新文章**：改完 `.md` → `npm run build` → 到该站点的 **Deploys** 页，把新的 `public/` 拖进底部的拖放区。嫌麻烦就换路线 1。

---

## 四、路线 1：GitHub + Netlify（长期推荐）

### 第 1 步：在 GitHub 网页上建一个空仓库

1. 登录 https://github.com → 右上角 **+** → **New repository**
2. **Repository name** 填 `b-log`（或你喜欢的名字）
3. 选 Public 或 Private 都可以（Netlify 两种都支持）
4. **不要勾选** "Add a README file" / ".gitignore" / "license"——勾了会和本地仓库冲突
5. 点 **Create repository**
6. 成功后页面会给出仓库地址，形如 `https://github.com/你的用户名/b-log.git`，**复制它**

### 第 2 步：把本地代码推上去

VS Code 里打开文件夹 `D:\b-log` → 菜单「终端 → 新建终端」（自动是 Git Bash、不用 `cd`）。

**第一条命令不要手敲**：回到 GitHub 刚建好仓库的那个页面，找到「…or push an existing repository from the command line」，里面有一行已经填好你用户名和仓库名的 `git remote add origin https://github.com/...`，**复制那一整行**，粘贴到终端回车。

然后敲第二条（这条可以直接复制）：

```bash
git push -u origin main
```

> ⚠️ 千万别把带 `<用户名>` / `<仓库名>` 尖括号的示例原样粘进终端——那是占位符，不是真实网址。自检脚本会检查这一项。

- 第一次 push 会弹出 GitHub 登录授权，按提示完成即可。
- **成功标志**：终端出现 `main -> main`；刷新 GitHub 仓库页能看到 `_config.yml`、`source/`、`package.json` 等文件。
- 若提示认证失败：最省事的是装 GitHub Desktop 登录后重试，或把报错发我。
- 如果已经误加了占位地址，用 `git remote set-url origin 真实地址` 改掉，或 `git remote remove origin` 清掉重来。

> 没用 VS Code 终端时，进目录写法：Git Bash 无需 cd（项目级配置已设好）；PowerShell 先 `cd D:\b-log`；CMD 先 `cd /d D:\b-log`。其余命令三个终端通用。

### 第 3 步：Netlify 导入

1. 打开 https://app.netlify.com 登录（可以用 GitHub 账号直接登）
2. **Add new site → Import an existing project → GitHub** → 按提示授权 → 选中刚建的仓库
3. 构建设置页面**什么都不用填**——`netlify.toml` 已指定命令、发布目录、Node 版本 → 点 **Deploy site**
4. 打开构建日志，应能看到：
   ```
   [set-url] 来源：URL (Netlify)
   [set-url] url:  https://<站点名>.netlify.app
   [set-url] root: /
   ```
   Netlify 构建环境内置 `URL`，所以域名会自动填对（我已用模拟环境变量完整跑通一次：25 处占位域名全部替换、0 报错）。
5. 部署完成，打开 `https://xxx.netlify.app` 按第六节验收。

### 以后发文章

```bash
git add . && git commit -m "新文章：xxx" && git push
```

Netlify 自动构建部署，**不用手动上传 `public/`**。

### 想绑定自己的域名

Site configuration → Domain management → Add a domain，按提示到域名注册商配 CNAME / A 记录，HTTPS 证书自动签发。若绑定后构建日志里的 `url` 仍是 `.netlify.app`，到 Site configuration → Environment variables 加 `SITE_URL=https://你的域名`，再触发一次重新部署。

---

## 五、路线 2：GitHub Pages（备选）

1. **建仓库和 push 已完成**，跳过：`erchafenan929/b-log` 本来就是 Public 仓库，代码已在 `main` 分支。
2. 打开 https://github.com/erchafenan929/b-log/settings/pages → **Build and deployment → Source** 选 **GitHub Actions**（不要选 "Deploy from a branch"）。
3. 到 **Actions** 标签页看 `Deploy to GitHub Pages` 是否跑绿；也可以手动 **Run workflow**。工作流已包含 `npm ci` → 域名注入 → 构建 → 上传产物 → 部署。

> 首次推送时这个 workflow 已经自动跑过一次，失败在 `actions/configure-pages@v5`，原因就是 Pages 还没启用；checkout / setup-node / `npm ci` 三步都是绿的，说明配置和依赖没问题。**改完 Source 后到 Actions 页点 Re-run all jobs 即可**，不用改任何代码。
4. 默认地址形如 `https://<用户名>.github.io/<仓库名>/`；**本仓库对应 https://erchafenan929.github.io/b-log/**。工作流会自动把 `root` 设成 `/b-log/`，所以子路径不会丢样式。

**这两种情况要手动加变量**：仓库名就是 `<用户名>.github.io`（用户主页站），或绑定了自定义域名。到 **Settings → Secrets and variables → Actions → Variables → New repository variable** 加：

```
Name:  SITE_URL
Value: https://你的真实地址/
```

**绑定自定义域名**：Pages 页面 Custom domain 填入域名等待 DNS check；域名注册商处加一条 CNAME 指向 `<用户名>.github.io`；然后勾选 Enforce HTTPS。

---

## 六、代码侧已就绪（不用你管）

- `netlify.toml`：构建命令 `node tools/set-url.js && npm run build`，发布目录 `public`，Node 22，另加三个安全响应头。
- `.github/workflows/pages.yml`：push 到 `main` 自动构建并部署到 GitHub Pages。
- `tools/set-url.js`：构建前按平台域名改写 `_config.yml` 的 `url` 和 `root`，已实测四种场景：

| 场景 | 得到的 `url` | 得到的 `root` |
| --- | --- | --- |
| 自定义根域名 | `https://chose-b-log.top` | `/` |
| Pages 子路径 `https://someone.github.io/blog/` | `https://someone.github.io/blog` | `/blog/` |
| 用户主页仓库自动推导 | `https://someone.github.io` | `/` |
| 本地无变量 | 跳过，不动配置 | 保持 `/` |

- `.gitignore` 已排除 `node_modules/`、`public/`、`db.json`；`package-lock.json` 已提交，`npm ci` 能跑。
- 本地 git 已关联 `origin` 并完成首次推送（提交 `a2b1ed0`）；**尚未在 Netlify / Pages 部署，站点未上线**。

## 七、上线前想改成"你的"（可选，不影响能否上线）

| 位置 | 当前值 | 换成 |
| --- | --- | --- |
| `_config.yml` → `title` / `author` | `B-log` | 你的站名、署名 |
| `_config.yml` → `subtitle` / `description` | 我还是想写 / 随笔、折腾记录…… | 你的一句话 |
| `_config.fluid.yml` → `navbar.blog_title`、`index.slogan.text`、`about.name`、`about.intro` | 同上 | 与站点信息一致 |
| `source/about/index.md` | 现成的关于页正文 | 你自己的介绍 |
| `source/img/avatar.png`、`default.png` | 未放文件 | 放同名图片即可覆盖 |
| `_config.yml` → `url` | `https://example.com` | **不用改**，部署时脚本自动注入 |

图片不换**不会 404**：Fluid 主题自带 `avatar.png` 和 `default.png`，构建时已复制到 `public/img/`。GitHub 图标已移除，不会再指向不相关的官网首页。

改完 `.yml` 配置必须**重启预览**（配置不热更新），改 `.md` 则保存后刷新即可。细节见 `CUSTOMIZE.md`。

## 八、上线后的验收清单

- [ ] 首页能打开，**样式正常**（CSS/JS 无 404，这是 `root` 是否正确的直接信号）
- [ ] 文章页 `/hello-b-log/` 能打开，标题是「你好，这是我的第一篇博客」
- [ ] `/archives/`、`/categories/`、`/tags/`、`/about/` 都能访问
- [ ] 站内搜索能搜到文章
- [ ] 浏览器 F12 → Network 里没有红色 404
- [ ] 暗色模式切换正常（Fluid 右上角）
- [ ] 手机宽度下导航不溢出

## 九、常见故障

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 拖完文件夹页面空白 / 样式全丢 | 拖错层级（拖成了 `b-log` 或多套了一层目录） | 确认拖的是 `public/`，且打开后根目录直接就是 `index.html` |
| 页面能开但样式全丢（路线 1/2） | `root` 没带子路径 | 看构建日志 `[set-url] root:` 是否为 `/仓库名/`；不是就补 `SITE_URL` |
| 站点地址仍是 `example.com` | 构建环境没拿到域名 | Netlify 检查内置 `URL`；Pages 检查 Variables 里的 `SITE_URL` |
| `npm ci` 失败 | `package-lock.json` 没提交 | 确认它在仓库里（已包含） |
| Actions 报权限错误 | 工作流权限只读或 Source 没选 Actions | Settings → Actions → General → Workflow permissions 选 Read and write；Pages Source 选 GitHub Actions |
| `git push` 报 repository not found / 无法解析地址 | `origin` 被设成了带 `< >` 的示例占位符 | `git remote set-url origin 真实地址`；或 `git remote remove origin` 后重新复制 GitHub 页面那行 |
| `git push` 报 `CRYPT_E_NO_REVOCATION_CHECK` / `unable to get local issuer certificate` | Windows 证书吊销检查失败，非账号问题 | 用一次性 `git -c http.sslVerify=false push`；别写进全局配置 |
| `git push` 认证失败 | 没登录 / 令牌过期 | 用 GitHub Desktop 登录，或把报错发我 |
| 匿名 Drop 的链接打不开或要密码 | 未认领的临时站点 | 注册并 claim，或改走路线 1 |
| 改了主题配置没生效 | Hexo 缓存 | `npm run clean && npm run build` |
| 中文文件名链接是一串 `%E4%BD%A0...` | 浏览器对中文 URL 的正常编码 | 想让链接干净就用英文文件名，frontmatter 里仍可写中文标题 |

## 十、本地想模拟线上域名验证

VS Code 终端（Git Bash）：

```bash
SITE_URL="https://你的域名" node tools/set-url.js
npm run build
git checkout -- _config.yml
npm run build
```

PowerShell 里第二行改成 `$env:SITE_URL = "https://你的域名"` 再单独执行 `node tools/set-url.js`；CMD 里写 `set SITE_URL=https://你的域名 && node tools/set-url.js`。

最后两条是**还原**：第一步会改动本地 `_config.yml`，验证完必须还原再重建，否则本地产物会带着测试域名。

## 十一、许可

Fluid 主题是 **GPL-3.0**。站点内容归你所有；若要二次分发主题源码，请遵守其许可证。
