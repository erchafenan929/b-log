# 上线操作清单

项目在 `D:/b-log`，本地已能构建和预览。**代码侧的部署配置已经全部就绪**，剩下的是需要你本人登录账号才能完成的动作——不需要再改任何构建脚本。

## 一、需要你本人做的三件事

| # | 动作 | 在哪做 | 我能否代做 |
| --- | --- | --- | --- |
| 1 | 建一个 GitHub 仓库并关联远程、push | GitHub 网页 / `git remote add` | 不能，需要你的账号 |
| 2 | 选 Netlify **或** GitHub Pages，登录并授权仓库 | 对应平台网页 | 不能，需要你的账号 |
| 3 | （可选）绑定自定义域名、配 DNS | 域名注册商 + 平台网页 | 不能 |

其余（构建命令、Node 版本、发布目录、域名与子路径修正、Actions 工作流）都已写好并验证过。

## 二、已经就绪的部分

- `netlify.toml`：构建命令 `node tools/set-url.js && npm run build`，发布目录 `public`，Node 22，另加了三个安全响应头。
- `.github/workflows/pages.yml`：push 到 `main` 自动构建并部署到 GitHub Pages。
- `tools/set-url.js`：构建前自动把真实域名写进 `_config.yml` 的 `url` 和 `root`。已实测四种场景：

| 场景 | 得到的 `url` | 得到的 `root` |
| --- | --- | --- |
| 自定义根域名 `https://chose-b-log.top` | `https://chose-b-log.top` | `/` |
| Pages 子路径 `https://someone.github.io/blog/` | `https://someone.github.io/blog` | `/blog/` |
| 用户主页仓库的自动推导 | `https://someone.github.io` | `/` |
| 本地无变量 | 跳过，不动配置 | 保持 `/` |

- 本地 git 仓库已初始化并有首次提交，`node_modules/`、`public/`、`db.json` 已在 `.gitignore` 中排除。**未关联远程仓库、未 push。**

## 三、公共前提：把代码推到 GitHub

在 GitHub 上新建一个空仓库（不要勾选初始化 README / .gitignore），然后：

```bash
cd /d/b-log
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git branch -M main
git push -u origin main
```

推送前确认 `.gitignore` 生效：`git status --short` 不应出现 `node_modules/` 或 `public/`。

## 四、路径 A：Netlify（推荐，与参考站一致）

1. 登录 Netlify → **Add new site** → **Import an existing project** → 选 GitHub → 授权并选中刚建的仓库。
2. 构建设置页面**什么都不用填**，`netlify.toml` 已经指定好命令、发布目录和 Node 版本，直接点 **Deploy**。
3. 打开构建日志，应能看到类似输出：
   ```
   [set-url] 来源：URL (Netlify)
   [set-url] url:  https://<站点名>.netlify.app
   [set-url] root: /
   ```
   Netlify 构建环境内置 `URL` 变量，所以默认就会填对域名。
4. 部署完成后打开站点，按下面第七节的清单验收。

**绑定自定义域名**：Site configuration → Domain management → Add a domain，按提示在域名注册商处配 CNAME 或 A 记录，HTTPS 证书会自动签发。如果绑定后构建日志里的 `url` 仍是 `.netlify.app`，到 Site configuration → Environment variables 加一个 `SITE_URL=https://你的域名`，然后触发一次重新部署。

## 五、路径 B：GitHub Pages（备选）

1. 代码推到 `main` 分支。
2. 仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**（不要选 "Deploy from a branch"）。
3. 到 **Actions** 标签页看 `Deploy to GitHub Pages` 是否跑绿；也可手动 **Run workflow**。工作流已包含 `npm ci` → 域名注入 → 构建 → 上传产物 → 部署。
4. 默认会按 `https://<owner>.github.io/<repo>/` 自动推导地址，并自动把 `root` 设成 `/<repo>/`，所以子路径不会丢样式。

**这两种情况需要手动加变量**：仓库名就是 `<用户名>.github.io`（用户主页站），或者绑定了自定义域名。到 **Settings → Secrets and variables → Actions → Variables → New repository variable**，加：

```
Name:  SITE_URL
Value: https://你的真实地址/        （例如 https://blog.example.com/ 或 https://用户名.github.io/）
```

**绑定自定义域名**：在 Pages 页面的 Custom domain 填入域名并等待 DNS check；在域名注册商处加一条 CNAME 指向 `<用户名>.github.io`，然后勾选 Enforce HTTPS。

## 六、上线前想改成"你的"（可选，不影响能否上线）

| 位置 | 当前值 | 换成 |
| --- | --- | --- |
| `_config.yml` → `title` / `subtitle` / `description` / `author` | B-log / 用 Markdown 记录点什么 | 你的站名、署名、简介 |
| `_config.fluid.yml` → `navbar.blog_title`、`index.slogan.text`、`about.name`、`about.intro` | 同上 | 与站点信息一致 |
| `_config.fluid.yml` → `about.icons[0].link` | `https://github.com` | 你的 GitHub 主页；不需要就删掉这一行 |
| `source/img/avatar.png`、`source/img/default.png` | 未放文件 | 放同名图片即可覆盖 |

图片不换**不会 404**：Fluid 主题自带 `avatar.png` 和 `default.png`，构建时已复制到 `public/img/`。在 `source/img/` 放同名文件会优先使用你的图。头图建议 1920×1080 以上，头像建议正方形。

`_config.yml` 里的 `url: https://example.com` 只是本地占位，**线上不需要手改**，构建时由 `tools/set-url.js` 覆盖。

## 七、上线后的验收清单

- [ ] 首页能打开，**样式正常**（CSS/JS 无 404，这是 `root` 是否正确的直接信号）
- [ ] 文章页 `/hello-b-log/` 能打开，代码高亮正常
- [ ] `/archives/`、`/categories/`、`/tags/`、`/about/` 都能访问
- [ ] 站内搜索能搜到文章
- [ ] 浏览器 F12 → Network 里没有红色 404
- [ ] 暗色模式切换正常（Fluid 右上角）
- [ ] 手机宽度下导航不溢出

## 八、常见故障

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 页面能开但样式全丢 | `root` 没带子路径 | 看构建日志里 `[set-url] root:` 是否为 `/仓库名/`；不是就补 `SITE_URL` |
| 站点地址仍是 `example.com` | 构建环境没拿到域名 | Netlify 检查内置 `URL`；Pages 检查 Variables 里的 `SITE_URL` |
| `npm ci` 失败 | `package-lock.json` 没提交 | 确认它在仓库里（已包含） |
| Actions 报权限错误 | 工作流权限只读或 Source 没选 Actions | Settings → Actions → General → Workflow permissions 选 Read and write；Pages Source 选 GitHub Actions |
| 改了主题配置没生效 | Hexo 缓存 | `npm run clean && npm run build` |
| 中文文件名链接是一串 `%E4%BD%A0...` | 浏览器对中文 URL 的正常编码 | 想让链接干净就用英文文件名，frontmatter 里仍可写中文标题 |

## 九、本地想模拟线上域名验证

```bash
cd /d/b-log
SITE_URL="https://你的域名" node tools/set-url.js
npm run build
```

注意这会**改动本地 `_config.yml`**。验证完用 `git checkout -- _config.yml` 还原，或手动把 `url` 改回 `https://example.com`、`root` 改回 `/`。

## 十、许可

Fluid 主题是 **GPL-3.0**。站点内容归你所有；若要二次分发主题源码，请遵守其许可证。
