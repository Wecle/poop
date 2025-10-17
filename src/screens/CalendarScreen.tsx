import { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native"
import { format, parseISO } from "date-fns"

import { getRecordsGroupedByDate, type PoopRecord } from "../storage"
import { formatMinutes } from "../utils/format"

interface GroupedRecords {
  date: string
  records: PoopRecord[]
}

export function CalendarScreen() {
  const [groups, setGroups] = useState<GroupedRecords[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getRecordsGroupedByDate()
      .then((result) => {
        const mapped = Object.entries(result)
          .map(([date, records]) => ({
            date,
            records: records.sort(
              (a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime(),
            ),
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setGroups(mapped)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>日历视图</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#f472b6" />
      ) : groups.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>还没有任何记录</Text>
          <Text style={styles.emptyDescription}>回到首页开始记录你的第一条噗噗吧</Text>
        </View>
      ) : (
        groups.map((group) => (
          <View key={group.date} style={styles.group}>
            <Text style={styles.groupTitle}>{format(parseISO(group.date), "yyyy年MM月dd日")}</Text>
            {group.records.map((record) => (
              <View key={record.id} style={styles.recordRow}>
                <Text style={styles.recordTime}>{format(new Date(record.endTime), "HH:mm")}</Text>
                <Text style={styles.recordDuration}>{formatMinutes(record.duration)}</Text>
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#fff7fb",
    gap: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#be185d",
    marginBottom: 12,
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
  group: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  recordRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f3f4f6",
  },
  recordTime: {
    fontSize: 16,
    color: "#4b5563",
  },
  recordDuration: {
    fontSize: 16,
    color: "#be185d",
  },
})
