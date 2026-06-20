# Quant Research 知识库（静态网站）

把仓库根目录 `README.md` 里的量化研究面试内容，整理成一个**可阅读、可搜索、可深挖**的静态网站。面向两类人：

- **大一新生 / 业余入门**：每道题先给直觉，再给推导，并配学习路径自查，不必从头硬啃。
- **求职复习**：55 道八股按板块编排，难点都有「深度拓展」（完整推导 + 多角度直觉 + 面试追问演练 + 代码）。

## 怎么打开

纯静态，**无需构建、无需安装依赖**。任选一种：

- 直接双击 `index.html`（`file://` 下搜索、公式、主题切换都能正常工作）。
- 或起一个本地服务器（公式 CDN 加载更稳）：

  ```bash
  cd site
  python3 -m http.server 8000
  # 浏览器打开 http://localhost:8000
  ```

## 页面结构

| 文件 | 内容 |
|------|------|
| `index.html` | 首页：八大板块导航 + 数理基础速查 |
| `math.html` | 数学与统计基础 **Q1–Q14** |
| `programming.html` | 编程 Python / C++ **Q15–Q28** |
| `factor.html` | 因子与 Alpha 策略 **Q29–Q40** |
| `ml.html` | 机器学习 / 深度学习 **Q41–Q55** |
| `strategies.html` | 9 个策略方向与奠基论文 |
| `frontier.html` | 研究前沿方向 |
| `resources.html` | 工具 · 书单 · 数据源 · 研报 · 竞赛 |
| `project-review.html` | 学习路径自查 + 项目复盘 8 问 |

## 功能

- 侧边栏导航、本页目录 + 滚动高亮
- 全站搜索（`file://` 下也可用，索引为纯 JS，无需 fetch）
- 明 / 暗主题切换（记忆偏好）
- 上一篇 / 下一篇、移动端适配
- KaTeX 渲染 LaTeX 公式

## 目录

```
site/
├── index.html                    # 首页
├── *.html                        # 各板块页面
├── assets/
│   ├── style.css                 # 设计系统（含明暗主题）
│   ├── nav.js                    # 导航结构
│   ├── app.js                    # 页面骨架：导航/目录/搜索/主题
│   └── search-index.js           # 自动生成的搜索索引
└── scripts/
    └── build-search-index.js     # 重建搜索索引（Node，无依赖）
```

## 修改内容后

页面是手写 HTML，编辑对应 `*.html` 即可。改动标题或题目后，重建搜索索引：

```bash
cd site
node scripts/build-search-index.js
```

## 部署

把 `site/` 整个目录扔到任意静态托管即可（GitHub Pages / Vercel / Netlify / Nginx）。GitHub Pages 示例：仓库 Settings → Pages → 选择分支并把目录指向 `/site`。

## 内容来源

所有知识点来自仓库根目录的 [`README.md`](../README.md)。本站是它的网页化、结构化与难点拓展版本。
