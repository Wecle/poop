// 主题色配置
export const themeColors = {
  pink: {
    primary: "oklch(0.75 0.15 340)", // 粉色
    secondary: "oklch(0.78 0.12 180)", // 薄荷绿
    accent: "oklch(0.92 0.05 340)", // 浅粉色
    ring: "oklch(0.75 0.15 340)",
    chart1: "oklch(0.75 0.15 340)",
  },
  blue: {
    primary: "oklch(0.65 0.2 250)", // 蓝色
    secondary: "oklch(0.75 0.15 200)", // 青色
    accent: "oklch(0.92 0.05 250)", // 浅蓝色
    ring: "oklch(0.65 0.2 250)",
    chart1: "oklch(0.65 0.2 250)",
  },
  green: {
    primary: "oklch(0.7 0.15 150)", // 绿色
    secondary: "oklch(0.75 0.12 180)", // 薄荷色
    accent: "oklch(0.92 0.05 150)", // 浅绿色
    ring: "oklch(0.7 0.15 150)",
    chart1: "oklch(0.7 0.15 150)",
  },
}

// 应用主题色
export function applyTheme(theme: keyof typeof themeColors) {
  const colors = themeColors[theme]
  if (!colors) return

  const root = document.documentElement
  root.style.setProperty("--primary", colors.primary)
  root.style.setProperty("--secondary", colors.secondary)
  root.style.setProperty("--accent", colors.accent)
  root.style.setProperty("--ring", colors.ring)
  root.style.setProperty("--chart-1", colors.chart1)
  root.style.setProperty("--sidebar-primary", colors.primary)
  root.style.setProperty("--sidebar-ring", colors.ring)
}
