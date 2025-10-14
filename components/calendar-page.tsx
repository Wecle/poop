"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { storage, type PoopRecord } from "@/lib/storage"
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [records, setRecords] = useState<PoopRecord[]>([])
  const [monthlyStats, setMonthlyStats] = useState({
    totalCount: 0,
    totalDuration: 0,
    avgDuration: 0,
    datesWithRecords: [] as string[],
  })

  useEffect(() => {
    updateData()
  }, [currentDate, selectedDate])

  const updateData = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const stats = storage.getMonthlyStats(year, month)
    setMonthlyStats(stats)

    const dateStr = storage.formatLocalDate(selectedDate)
    const dayRecords = storage.getRecordsByDate(dateStr)
    setRecords(dayRecords)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}分${secs}秒`
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(newDate)
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i)

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    )
  }

  const hasRecord = (day: number) => {
    const dateStr = storage.formatLocalDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
    return monthlyStats.datesWithRecords.includes(dateStr)
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold text-primary">日历</h1>
      </div>

      {/* Calendar Section */}
      <div className="px-6 space-y-4">
        {/* Month Stats */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">噗噗次数</p>
                <p className="text-2xl font-bold text-primary">{monthlyStats.totalCount}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">平均时长</p>
                <p className="text-lg font-semibold">
                  {monthlyStats.totalCount > 0 ? formatDuration(Math.floor(monthlyStats.avgDuration)) : "-"}
                </p>
              </div>
            </div>
            <Link href="/summary">
              <Button variant="outline" size="sm">
                月度汇总
              </Button>
            </Link>
          </div>
        </Card>

        {/* Calendar */}
        <Card className="p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-semibold">
              {currentDate.getFullYear()}年 {currentDate.getMonth() + 1}月
            </h2>
            <Button variant="ghost" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {days.map((day) => (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={cn(
                  "aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-colors relative",
                  isSelected(day)
                    ? "bg-primary text-primary-foreground"
                    : isToday(day)
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {day}
                {hasRecord(day) && (
                  <div
                    className={cn(
                      "absolute bottom-1 w-1 h-1 rounded-full",
                      isSelected(day) ? "bg-primary-foreground" : "bg-primary",
                    )}
                  />
                )}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Records Section */}
      <div className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          {selectedDate.getMonth() + 1}月{selectedDate.getDate()}日 记录
        </h2>

        {records.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">这天没有记录哦~</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <Card key={record.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{formatTime(record.startTime)}</span>
                  </div>
                  <span className="text-sm font-medium text-primary">{formatDuration(record.duration)}</span>
                </div>
                {record.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{record.location}</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
