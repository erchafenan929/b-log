#!/usr/bin/env node
/**
 * 上线前自检：只读，不修改任何文件。
 * 用法（在项目根目录）：node tools/predeploy-check.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const ok = [];
const warn = [];
const fail = [];

function has(rel) {
  return fs.existsSync(path.join(root, rel));
}
function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function git(cmd) {
  try {
    return execSync(`git ${cmd}`, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

// 1. 部署必需文件
const required = [
  'package.json', 'package-lock.json', '_config.yml', '_config.fluid.yml',
  'netlify.toml', '.github/workflows/pages.yml', 'tools/set-url.js', '.gitignore',
];
const missing = required.filter((f) => !has(f));
if (missing.length) fail.push(`缺少文件：${missing.join('、')}`);
else ok.push(`部署配置齐全（${required.length} 个文件）`);

// 2. 依赖是否已安装
if (has('node_modules/hexo-cli/bin/hexo')) ok.push('本地依赖已安装（hexo-cli 可用）');
else fail.push('未安装依赖，先跑 npm install');

// 3. .gitignore 是否排除产物
const ignore = has('.gitignore') ? read('.gitignore') : '';
const ignored = ['node_modules/', 'public/', 'db.json'].filter((k) => ignore.includes(k));
if (ignored.length === 3) ok.push('.gitignore 已排除依赖与构建产物');
else fail.push('.gitignore 缺少：' + ['node_modules/', 'public/', 'db.json'].filter((k) => !ignore.includes(k)).join('、'));

// 4. 构建产物
const pubDir = path.join(root, 'public');
let fileCount = 0;
if (fs.existsSync(pubDir)) {
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p); else fileCount++;
  });
  walk(pubDir);
}
if (has('public/index.html') && fileCount > 10) ok.push(`public/ 已构建（${fileCount} 个文件，含 index.html）`);
else warn.push('public/ 尚未构建或不完整，先跑 npm run build（路线 0 必须）');

// 5. 占位域名的影响说明
if (has('public/index.html')) {
  const html = read('public/index.html');
  const n = (html.match(/example\.com/g) || []).length;
  if (n) warn.push(`产物含占位域名 ${n} 处（只影响 og:url 分享卡片，页面显示正常）；路线 0 可先不管，路线 1/2 会自动替换`);
}

// 6. git 状态
const status = git('status --porcelain');
if (status) warn.push(`git 工作区有未提交改动（${status.split('\n').length} 项），推送前记得 git add . && git commit`);
else ok.push('git 工作区干净，所有改动已提交');

const remote = git('remote -v');
if (!remote) warn.push('尚未关联远程仓库（路线 1/2 需要；路线 0 不需要）');
else ok.push('已关联远程仓库：' + remote.split('\n')[0].replace(/\s+/g, ' ').trim());

const branch = git('branch --show-current');
if (branch) ok.push(`当前分支：${branch}`);

// 输出
console.log('\n=== 上线前自检 ===\n');
ok.forEach((s) => console.log('  [OK]   ' + s));
warn.forEach((s) => console.log('  [注意] ' + s));
fail.forEach((s) => console.log('  [失败] ' + s));
console.log('');
if (fail.length) {
  console.log('结论：有必须修复的项，暂时不要上线。\n');
  process.exit(1);
}
console.log('结论：可以上线。三条路线见 DEPLOY.md。\n');
console.log('  路线 0（不用 GitHub）：浏览器打开 https://app.netlify.com/drop ，拖 public/ 文件夹');
console.log('  路线 1（自动部署）：GitHub 建空仓库 → git push → Netlify Import');
console.log('  路线 2（自动部署）：GitHub 建空仓库 → git push → Pages 选 GitHub Actions\n');
