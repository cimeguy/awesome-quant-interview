/* Shared navigation config — single source of truth for sidebar + prev/next */
window.NAV = [
  {
    title: "开始",
    items: [
      { id: "index", emoji: "🏠", title: "首页 / 总览", href: "index.html" },
      { id: "paths", emoji: "🧭", title: "学习路径 & 项目复盘", href: "project-review.html" },
    ],
  },
  {
    title: "面试八股文",
    items: [
      { id: "math", emoji: "🎲", title: "数学与统计基础", href: "math.html" },
      { id: "programming", emoji: "💻", title: "编程 (Python / C++)", href: "programming.html" },
      { id: "factor", emoji: "📈", title: "因子与 Alpha 策略", href: "factor.html" },
      { id: "ml", emoji: "🤖", title: "机器学习 / 深度学习", href: "ml.html" },
    ],
  },
  {
    title: "方向与资源",
    items: [
      { id: "strategies", emoji: "📄", title: "策略方向与经典论文", href: "strategies.html" },
      { id: "frontier", emoji: "🔬", title: "研究前沿", href: "frontier.html" },
      { id: "resources", emoji: "📚", title: "工具 · 书单 · 资源", href: "resources.html" },
    ],
  },
];

/* Flattened order for prev/next */
window.NAV_ORDER = window.NAV.flatMap((g) => g.items);
