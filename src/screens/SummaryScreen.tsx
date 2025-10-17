import { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native"

import { getDashboardStats, getMonthlyOverview, type DashboardStats, type MonthlyOverview } from "../storage"
import { formatMinutes } from "../utils/format"

export function SummaryScreen() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [overview, setOverview] = useState<MonthlyOverview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const activeDays = overview.filter((day) => day.count > 0)

  useEffect(() => {
    async function load() {
      try {
        const [dashboardStats, monthly] = await Promise.all([
          getDashboardStats(),
          getMonthlyOverview(),
        ])
        setStats(dashboardStats)
        setOverview(monthly)
      } finally {
        setIsLoading(false)
      }
    }
    load().catch(() => setIsLoading(false))
  }, [])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>统计面板</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#f472b6" />
      ) : stats ? (
        <>
          <View style={styles.grid}>
            <SummaryCard label="今日次数" value={`${stats.today.totalCount} 次`} />
            <SummaryCard label="今日总时长" value={formatMinutes(stats.today.totalDuration)} />
            <SummaryCard label="本周次数" value={`${stats.week.totalCount} 次`} />
            <SummaryCard label="本周平均" value={formatMinutes(stats.week.averageDuration)} />
            <SummaryCard label="本月次数" value={`${stats.month.totalCount} 次`} />
            <SummaryCard label="本月总时长" value={formatMinutes(stats.month.totalDuration)} />
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>本月概览</Text>
            {activeDays.length === 0 ? (
              <Text style={styles.emptyOverview}>本月还没有记录，快去保持好习惯吧！</Text>
            ) : (
              activeDays.map((day) => (
                  <View key={day.date} style={styles.overviewRow}>
                    <Text style={styles.overviewDate}>{day.date}</Text>
                    <Text style={styles.overviewStats}>
                      {day.count} 次 · {formatMinutes(day.totalDuration)}
                    </Text>
                  </View>
                ))
            )}
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>暂无数据</Text>
          <Text style={styles.emptyDescription}>先在首页记录几次噗噗，统计数据就会在这里显示</Text>
        </View>
      )}
    </ScrollView>
  )
}

interface SummaryCardProps {
  label: string
  value: string
}

function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    gap: 16,
    backgroundColor: "#fff7fb",
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#be185d",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  cardValue: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
  },
  section: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  overviewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f3f4f6",
  },
  overviewDate: {
    fontSize: 16,
    color: "#4b5563",
  },
  overviewStats: {
    fontSize: 16,
    color: "#be185d",
  },
  emptyOverview: {
    textAlign: "center",
    color: "#6b7280",
    paddingVertical: 8,
    fontSize: 14,
  },
  emptyState: {
    marginTop: 80,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#9d174d",
  },
  emptyDescription: {
    color: "#6b7280",
    textAlign: "center",
  },
})
