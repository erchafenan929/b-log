---
title: Markdown 常用语法速查
date: 2026-11-11 19:00:00
categories:
  - 笔记
tags:
  - Markdown
  - 速查
---

写博客真正用得上的语法其实就这些，留一份备用。

<!-- more -->

## 标题与强调

```markdown
## 二级标题
**加粗**、*斜体*、~~删除线~~、`行内代码`
```

**加粗**、*斜体*、~~删除线~~、`行内代码`。

## 列表

```markdown
- 无序项
- 另一项
  - 缩进就是子项

1. 有序项
2. 第二项

- [x] 已完成
- [ ] 待办
```

## 引用与链接

```markdown
> 引用一段话，可以多行。

[链接文字](https://example.com)
![图片说明](/img/example.png)
```

> 引用一段话，可以多行。

## 代码块

用三个反引号包起来，紧跟语言名可以高亮：

````markdown
```js
const hello = "world";
console.log(hello);
```
````

```js
const hello = "world";
console.log(hello);
```

## 表格

| 项目 | 说明 | 是否常用 |
| --- | --- | --- |
| 标题 | `#` 到 `######` | 是 |
| 代码块 | 三个反引号 | 是 |
| 脚注 | `[^1]` | 看情况 |

## 分隔线与摘要

```markdown
---            ← 分隔线
<!-- more -->  ← 首页摘要截断
```

## 数学公式与流程图

Fluid 内置支持 LaTeX 和 Mermaid，但需要先在主题配置里打开对应开关并调整渲染器，步骤见 `README.md` 的「可选功能」一节。开启后即可写：

```markdown
$$ E = mc^2 $$
```
