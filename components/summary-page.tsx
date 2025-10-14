"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { storage, type PoopRecord } from "@/lib/storage"
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ViewMode = "day" | "week" | "month" | "year"

export function SummaryPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [stats, setStats] = useState({
    totalCount: 0,
    avgCount: 0,
    totalDuration: 0,
    avgDuration: 0,
    longestDuration: 0,
    shortestDuration: 0,
  })

  useEffect(() => {
    calculateStats()
  }, [viewMode, currentDate])

  const calculateStats = () => {
    let records: PoopRecord[] = []

    switch (viewMode) {
      case "day":
        records = storage.getRecordsByDay(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
        break
      case "week":
        const weekNum = getWeekNumber(currentDate)
        records = storage.getRecordsByWeek(currentDate.getFullYear(), weekNum)
        break
      case "month":
        records = storage.getRecordsByMonth(currentDate.getFullYear(), currentDate.getMonth())
        break
      case "year":
        records = storage.getRecordsByYear(currentDate.getFullYear())
        break
    }

    const totalCount = records.length
    const totalDuration = records.reduce((sum, r) => sum + r.duration, 0)
    const durations = records.map((r) => r.duration)

    let avgCount = 0
    if (viewMode === "month") {
      const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
      avgCount = totalCount / daysInMonth
    } else if (viewMode === "week") {
      avgCount = totalCount / 7
    } else if (viewMode === "year") {
      avgCount = totalCount / 365
    } else {
      avgCount = totalCount
    }

    setStats({
      totalCount,
      avgCount,
      totalDuration,
      avgDuration: totalCount > 0 ? totalDuration / totalCount : 0,
      longestDuration: durations.length > 0 ? Math.max(...durations) : 0,
      shortestDuration: durations.length > 0 ? Math.min(...durations) : 0,
    })
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}分${secs}秒`
  }

  const handlePrev = () => {
    const newDate = new Date(currentDate)
    switch (viewMode) {
      case "day":
        newDate.setDate(newDate.getDate() - 1)
        break
      case "week":
        newDate.setDate(newDate.getDate() - 7)
        break
      case "month":
        newDate.setMonth(newDate.getMonth() - 1)
        break
      case "year":
        newDate.setFullYear(newDate.getFullYear() - 1)
        break
    }
    setCurrentDate(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentDate)
    switch (viewMode) {
      case "day":
        newDate.setDate(newDate.getDate() + 1)
        break
      case "week":
        newDate.setDate(newDate.getDate() + 7)
        break
      case "month":
        newDate.setMonth(newDate.getMonth() + 1)
        break
      case "year":
        newDate.setFullYear(newDate.getFullYear() + 1)
        break
    }
    setCurrentDate(newDate)
  }

  const getDateLabel = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    const day = currentDate.getDate()

    switch (viewMode) {
      case "day":
        return `${year}年${month}月${day}日`
      case "week":
        const weekNum = getWeekNumber(currentDate)
        return `${year}年 第${weekNum}周`
      case "month":
        return `${year}年${month}月`
      case "year":
        return `${year}年`
    }
  }

  const getViewModeLabel = () => {
    switch (viewMode) {
      case "day":
        return "每日"
      case "week":
        return "每周"
      case "month":
        return "每月"
      case "year":
        return "每年"
    }
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen">
      {/* Header */}
      <div className="p-6 pb-4 flex items-center gap-4">
        <Link href="/calendar">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-primary">月度汇总</h1>
      </div>

      {/* Controls */}
      <div className="px-6 pb-4 space-y-4">
        <div className="flex items-center gap-3">
          <Select value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">每日</SelectItem>
              <SelectItem value="week">每周</SelectItem>
              <SelectItem value="month">每月</SelectItem>
              <SelectItem value="year">每年</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 flex-1">
            <Button variant="outline" size="icon" onClick={handlePrev}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 text-center font-medium">{getDateLabel()}</div>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 space-y-4 pb-6">
        <Card className="p-6">
          <h3 className="text-sm text-muted-foreground mb-2">总次数</h3>
          <p className="text-4xl font-bold text-primary">{stats.totalCount}</p>
          <p className="text-sm text-muted-foreground mt-1">
            平均 {stats.avgCount.toFixed(2)} 次/{getViewModeLabel().replace("每", "")}
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <h3 className="text-sm text-muted-foreground mb-2">总时长</h3>
            <p className="text-xl font-bold">{formatDuration(stats.totalDuration)}</p>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm text-muted-foreground mb-2">平均时长</h3>
            <p className="text-xl font-bold">{formatDuration(Math.floor(stats.avgDuration))}</p>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm text-muted-foreground mb-2">最长时长</h3>
            <p className="text-xl font-bold">{formatDuration(stats.longestDuration)}</p>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm text-muted-foreground mb-2">最短时长</h3>
            <p className="text-xl font-bold">{formatDuration(stats.shortestDuration)}</p>
          </Card>
        </div>

        {stats.totalCount === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">这个时间段没有记录哦~</p>
          </Card>
        )}
      </div>
    </div>
  )
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}
