export interface PoopRecord {
  id: string
  startTime: Date
  endTime: Date
  duration: number // in seconds
  location?: string
  date: string // YYYY-MM-DD format
}

export interface UserSettings {
  name?: string
  avatar?: string
  themeColor: string
  reminderEnabled: boolean
  reminderTime?: string
  vibrationEnabled: boolean
  soundEnabled: boolean
}

const RECORDS_KEY = "poop_records"
const SETTINGS_KEY = "user_settings"

function formatLocalDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export const storage = {
  // Records
  getRecords: (): PoopRecord[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(RECORDS_KEY)
    if (!data) return []
    const records = JSON.parse(data)
    return records.map((r: any) => ({
      ...r,
      startTime: new Date(r.startTime),
      endTime: new Date(r.endTime),
    }))
  },

  saveRecord: (record: PoopRecord) => {
    const records = storage.getRecords()
    records.push(record)
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
  },

  getRecordsByDate: (date: string): PoopRecord[] => {
    return storage.getRecords().filter((r) => r.date === date)
  },

  getLatestRecord: (): PoopRecord | null => {
    const records = storage.getRecords()
    if (records.length === 0) return null
    return records.sort((a, b) => b.endTime.getTime() - a.endTime.getTime())[0]
  },

  getRecordsByMonth: (year: number, month: number): PoopRecord[] => {
    return storage.getRecords().filter((r) => {
      const [y, m] = r.date.split("-").map(Number)
      return y === year && m === month + 1
    })
  },

  getRecordsByDay: (year: number, month: number, day: number): PoopRecord[] => {
    const dateStr = formatLocalDate(new Date(year, month, day))
    return storage.getRecordsByDate(dateStr)
  },

  getRecordsByWeek: (year: number, week: number): PoopRecord[] => {
    return storage.getRecords().filter((r) => {
      const [y, m, d] = r.date.split("-").map(Number)
      const date = new Date(y, m - 1, d)
      const weekNum = getWeekNumber(date)
      return y === year && weekNum === week
    })
  },

  getRecordsByYear: (year: number): PoopRecord[] => {
    return storage.getRecords().filter((r) => {
      const [y] = r.date.split("-").map(Number)
      return y === year
    })
  },

  getMonthlyStats: (year: number, month: number) => {
    const records = storage.getRecordsByMonth(year, month)
    const totalCount = records.length
    const totalDuration = records.reduce((sum, r) => sum + r.duration, 0)
    const avgDuration = totalCount > 0 ? totalDuration / totalCount : 0

    // Get dates with records
    const datesWithRecords = new Set(records.map((r) => r.date))

    return {
      totalCount,
      totalDuration,
      avgDuration,
      datesWithRecords: Array.from(datesWithRecords),
    }
  },

  // Settings
  getSettings: (): UserSettings => {
    if (typeof window === "undefined") {
      return {
        themeColor: "pink",
        reminderEnabled: false,
        vibrationEnabled: true,
        soundEnabled: true,
      }
    }
    const data = localStorage.getItem(SETTINGS_KEY)
    if (!data) {
      return {
        themeColor: "pink",
        reminderEnabled: false,
        vibrationEnabled: true,
        soundEnabled: true,
      }
    }
    return JSON.parse(data)
  },

  saveSettings: (settings: UserSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  },

  formatLocalDate,
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}
