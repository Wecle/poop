import { useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { format } from "date-fns"

import { formatLocalDate, getLatestRecord, saveRecord, type PoopRecord } from "../storage"
import { formatTimer } from "../utils/format"

export function HomeScreen() {
  const [latestRecord, setLatestRecord] = useState<PoopRecord | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    getLatestRecord().then(setLatestRecord).catch(() => setLatestRecord(null))
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (isTracking && startTime) {
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000))
      }, 1000)
    }
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [isTracking, startTime])

  const handleStart = () => {
    if (isTracking) return
    const now = new Date()
    setIsTracking(true)
    setStartTime(now)
    setElapsedTime(0)
  }

  const handleEnd = async () => {
    if (!startTime) {
      return
    }
    const endTime = new Date()
    const duration = Math.max(1, Math.floor((endTime.getTime() - startTime.getTime()) / 1000))
    const record: PoopRecord = {
      id: `${endTime.getTime()}`,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration,
      date: formatLocalDate(endTime),
    }
    try {
      await saveRecord(record)
      setLatestRecord(record)
      setIsTracking(false)
      setStartTime(null)
      setElapsedTime(0)
    } catch (error) {
      console.error(error)
      Alert.alert("保存失败", "记录保存时出现问题，请稍后再试")
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>噗噗</Text>
      <View style={styles.tracker}>
        {!isTracking ? (
          <>
            {latestRecord ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>最近一次记录</Text>
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>完成时间</Text>
                  <Text style={styles.cardValue}>{format(new Date(latestRecord.endTime), "MM月dd日 HH:mm")}</Text>
                </View>
                <View style={styles.cardRow}>
                  <Text style={styles.cardLabel}>持续时间</Text>
                  <Text style={styles.cardValue}>{formatTimer(latestRecord.duration)}</Text>
                </View>
                {latestRecord.location ? (
                  <View style={styles.cardRow}>
                    <Text style={styles.cardLabel}>地点</Text>
                    <Text style={styles.cardValue}>{latestRecord.location}</Text>
                  </View>
                ) : null}
              </View>
            ) : (
              <View style={styles.placeholder}>
                <Text style={styles.placeholderTitle}>暂无记录</Text>
                <Text style={styles.placeholderDescription}>点击下方按钮开始记录你的噗噗历程</Text>
              </View>
            )}
            <TouchableOpacity style={[styles.primaryButton, styles.roundButton]} onPress={handleStart} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>开始噗噗</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.timerLabel}>正在记录...</Text>
            <Text style={styles.timerValue}>{formatTimer(elapsedTime)}</Text>
            <TouchableOpacity style={[styles.secondaryButton, styles.roundButton]} onPress={handleEnd} activeOpacity={0.8}>
              <Text style={styles.secondaryButtonText}>结束噗噗</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    backgroundColor: "#fdf2f8",
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#be185d",
    marginBottom: 24,
  },
  tracker: {
    width: "100%",
    alignItems: "center",
    gap: 24,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1f2937",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  cardLabel: {
    color: "#6b7280",
    fontSize: 14,
  },
  cardValue: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  placeholder: {
    alignItems: "center",
    gap: 8,
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#9d174d",
  },
  placeholderDescription: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  roundButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  primaryButton: {
    backgroundColor: "#f472b6",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#fce7f3",
  },
  secondaryButtonText: {
    color: "#be185d",
    fontSize: 24,
    fontWeight: "700",
  },
  timerLabel: {
    fontSize: 18,
    color: "#6b7280",
  },
  timerValue: {
    fontSize: 64,
    fontWeight: "700",
    color: "#be185d",
  },
})
