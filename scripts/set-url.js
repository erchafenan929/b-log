#!/usr/bin/env node
/**
 * 构建前根据部署平台给出的真实域名，自动改写 _config.yml 的 url / root。
 * 本地开发不设环境变量时直接跳过，不会改动你的配置文件。
 *
 * 变量优先级：
 *   SITE_URL —— 手动指定（Netlify Site variables 或 GitHub Actions Variables）
 *   URL      —— Netlify 构建环境内置的主站点地址，通常无需手动设置
 *
 * 同时处理 GitHub Pages 子路径：https://用户名.github.io/仓库名/
 * 会得到 url: https://用户名.github.io/仓库名  /  root: /仓库名/
 */
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', '_config.yml');
const source = process.env.SITE_URL ? 'SITE_URL' : 'URL (Netlify)';
const raw = (process.env.SITE_URL || process.env.URL || '').trim();

if (!raw) {
  console.log('[set-url] 未检测到站点地址，跳过；本地构建沿用 _config.yml 中的 url。');
  process.exit(0);
}

let parsed;
try {
  parsed = new URL(raw.includes('://') ? raw : `https://${raw}`);
} catch (err) {
  console.error(`[set-url] 站点地址不合法：${raw}`);
  process.exit(1);
}
if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
  console.error(`[set-url] 站点地址必须是 http(s)：${raw}`);
  process.exit(1);
}

const segments = parsed.pathname.split('/').filter(Boolean);
// Actions 里按 owner/repo 自动推导时，用户主页仓库会拼成 /用户名.github.io/，
// 这其实是根站点，把这段多余路径去掉。
if (segments.length && segments[0] === parsed.hostname) segments.shift();

const root = segments.length ? `/${segments.join('/')}/` : '/';
const basePath = segments.length ? `/${segments.join('/')}` : '';
const url = `${parsed.origin}${basePath}`;

const newline = fs.readFileSync(configPath, 'utf8').includes('\r\n') ? '\r\n' : '\n';
let hasUrl = false;
let hasRoot = false;
const lines = fs.readFileSync(configPath, 'utf8').split(/\r?\n/).map((line) => {
  if (/^url:\s*/.test(line)) {
    hasUrl = true;
    return `url: ${url}`;
  }
  if (/^root:\s*/.test(line)) {
    hasRoot = true;
    return `root: ${root}`;
  }
  return line;
});

if (!hasUrl || !hasRoot) {
  console.error('[set-url] _config.yml 中缺少 url 或 root 行，请检查文件。');
  process.exit(1);
}

fs.writeFileSync(configPath, lines.join(newline), 'utf8');
console.log(`[set-url] 来源：${source}`);
console.log(`[set-url] url:  ${url}`);
console.log(`[set-url] root: ${root}`);
