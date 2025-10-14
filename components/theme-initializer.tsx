"use client"

import { useEffect } from "react"
import { applyTheme } from "@/lib/theme"

export function ThemeInitializer() {
  useEffect(() => {
    const settingsData = localStorage.getItem("user_settings")
    if (settingsData) {
      const settings = JSON.parse(settingsData)
      applyTheme(settings.themeColor as any)
    } else {
      // 如果没有保存的设置，应用默认主题
      applyTheme("pink")
    }
  }, [])

  return null
}
