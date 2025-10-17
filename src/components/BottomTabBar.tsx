import type { FC } from "react"
import { memo } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export type TabKey = "home" | "calendar" | "summary" | "profile"

interface BottomTabBarProps {
  activeTab: TabKey
  onChange: (tab: TabKey) => void
}

const labels: Record<TabKey, string> = {
  home: "首页",
  calendar: "日历",
  summary: "统计",
  profile: "我的",
}

export const BottomTabBar: FC<BottomTabBarProps> = memo(({ activeTab, onChange }) => {
  return (
    <View style={styles.container}>
      {Object.entries(labels).map(([key, label]) => {
        const tabKey = key as TabKey
        const isActive = activeTab === tabKey
        return (
          <TouchableOpacity
            key={tabKey}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            onPress={() => onChange(tabKey)}
            style={[styles.tabItem, isActive && styles.activeTab]}
          >
            <Text style={[styles.tabLabel, isActive && styles.activeLabel]}>{label}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
})

BottomTabBar.displayName = "BottomTabBar"

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#fce7f3",
  },
  tabLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  activeLabel: {
    color: "#c026d3",
    fontWeight: "600",
  },
})
