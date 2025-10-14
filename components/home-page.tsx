"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { storage, type PoopRecord } from "@/lib/storage"
import { Clock, MapPin } from "lucide-react"

export function HomePage() {
  const [latestRecord, setLatestRecord] = useState<PoopRecord | null>(null)
  const [isTracking, setIsTracking] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    setLatestRecord(storage.getLatestRecord())
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTracking && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTracking, startTime])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat("zh-CN", {
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const handleStart = () => {
    setIsTracking(true)
    setStartTime(new Date())
    setElapsedTime(0)
  }

  const handleEnd = () => {
    if (!startTime) return

    const endTime = new Date()
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)

    const record: PoopRecord = {
      id: Date.now().toString(),
      startTime,
      endTime,
      duration,
      date: storage.formatLocalDate(endTime),
    }

    storage.saveRecord(record)
    setLatestRecord(record)
    setIsTracking(false)
    setStartTime(null)
    setElapsedTime(0)
  }

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center pt-8 pb-2">
        <h1 className="text-4xl font-bold text-primary mb-2">噗噗</h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        {!isTracking ? (
          <>
            {/* Latest Record */}
            {latestRecord ? (
              <Card className="w-full p-6 space-y-4">
                <h2 className="text-lg font-semibold text-center">最近一次记录</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{formatDateTime(latestRecord.endTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">时长: {formatDuration(latestRecord.duration)}</span>
                  </div>
                  {latestRecord.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{latestRecord.location}</span>
                    </div>
                  )}
                </div>
              </Card>
            ) : (
              <div className="text-center space-y-2">
                <p className="text-2xl">你最近没有噗噗哦~</p>
                <p className="text-sm text-muted-foreground">点击下方按钮开始记录</p>
              </div>
            )}

            {/* Start Button */}
            <Button
              size="lg"
              onClick={handleStart}
              className="w-48 h-48 rounded-full text-2xl font-bold shadow-lg hover:scale-105 transition-transform"
            >
              开始噗噗
            </Button>
          </>
        ) : (
          <>
            {/* Timer */}
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">正在进行中...</p>
              <div className="text-7xl font-bold text-primary tabular-nums">{formatDuration(elapsedTime)}</div>
            </div>

            {/* End Button */}
            <Button
              size="lg"
              variant="secondary"
              onClick={handleEnd}
              className="w-48 h-48 rounded-full text-2xl font-bold shadow-lg hover:scale-105 transition-transform"
            >
              结束噗噗
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
