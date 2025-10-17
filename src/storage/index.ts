import AsyncStorage from "@react-native-async-storage/async-storage"
import { addDays, endOfDay, endOfMonth, endOfWeek, format, isWithinInterval, startOfDay, startOfMonth, startOfWeek } from "date-fns"

export interface PoopRecord {
  id: string
  startTime: string
  endTime: string
  duration: number
  location?: string
  date: string
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

const defaultSettings: UserSettings = {
  themeColor: "pink",
  reminderEnabled: false,
  vibrationEnabled: true,
  soundEnabled: true,
}

function reviveRecord(raw: PoopRecord): PoopRecord {
  return {
    ...raw,
    startTime: raw.startTime,
    endTime: raw.endTime,
  }
}

function normaliseRecord(record: PoopRecord): PoopRecord {
  return {
    ...record,
    startTime: new Date(record.startTime).toISOString(),
    endTime: new Date(record.endTime).toISOString(),
    date: record.date,
  }
}

function parseRecords(payload: string | null): PoopRecord[] {
  if (!payload) return []
  try {
    const data: PoopRecord[] = JSON.parse(payload)
    return data.map(reviveRecord)
  } catch {
    return []
  }
}

export async function getRecords(): Promise<PoopRecord[]> {
  const payload = await AsyncStorage.getItem(RECORDS_KEY)
  return parseRecords(payload)
}

export async function saveRecord(record: PoopRecord): Promise<void> {
  const records = await getRecords()
  const serialised = [...records, normaliseRecord(record)]
  await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify(serialised))
}

export async function clearRecords(): Promise<void> {
  await AsyncStorage.removeItem(RECORDS_KEY)
}

export async function getLatestRecord(): Promise<PoopRecord | null> {
  const records = await getRecords()
  if (records.length === 0) {
    return null
  }
  const sorted = [...records].sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())
  return sorted[0]
}

export async function getRecordsByDate(date: string): Promise<PoopRecord[]> {
  const records = await getRecords()
  return records.filter((record) => record.date === date)
}

export async function getRecordsGroupedByDate(): Promise<Record<string, PoopRecord[]>> {
  const records = await getRecords()
  return records.reduce<Record<string, PoopRecord[]>>((acc, record) => {
    if (!acc[record.date]) {
      acc[record.date] = []
    }
    acc[record.date].push(record)
    return acc
  }, {})
}

export function formatLocalDate(date: Date): string {
  return format(date, "yyyy-MM-dd")
}

export interface SummaryStats {
  totalCount: number
  totalDuration: number
  averageDuration: number
}

export interface DashboardStats {
  today: SummaryStats
  week: SummaryStats
  month: SummaryStats
}

function calculateSummary(records: PoopRecord[]): SummaryStats {
  if (records.length === 0) {
    return {
      totalCount: 0,
      totalDuration: 0,
      averageDuration: 0,
    }
  }
  const totalDuration = records.reduce((sum, record) => sum + record.duration, 0)
  return {
    totalCount: records.length,
    totalDuration,
    averageDuration: Math.round(totalDuration / records.length),
  }
}

export async function getDashboardStats(referenceDate = new Date()): Promise<DashboardStats> {
  const records = await getRecords()
  const todayRange = {
    start: startOfDay(referenceDate),
    end: endOfDay(referenceDate),
  }
  const weekRange = {
    start: startOfWeek(referenceDate, { weekStartsOn: 1 }),
    end: endOfWeek(referenceDate, { weekStartsOn: 1 }),
  }
  const monthRange = {
    start: startOfMonth(referenceDate),
    end: endOfMonth(referenceDate),
  }

  const recordsForRange = (range: { start: Date; end: Date }) =>
    records.filter((record) => {
      const endTime = new Date(record.endTime)
      return isWithinInterval(endTime, range)
    })

  return {
    today: calculateSummary(recordsForRange(todayRange)),
    week: calculateSummary(recordsForRange(weekRange)),
    month: calculateSummary(recordsForRange(monthRange)),
  }
}

export interface MonthlyOverview {
  date: string
  count: number
  totalDuration: number
}

export async function getMonthlyOverview(referenceDate = new Date()): Promise<MonthlyOverview[]> {
  const start = startOfMonth(referenceDate)
  const end = endOfMonth(referenceDate)
  const records = await getRecords()
  const days: MonthlyOverview[] = []
  let cursor = start
  while (cursor <= end) {
    const date = formatLocalDate(cursor)
    const dayRecords = records.filter((record) => record.date === date)
    const totalDuration = dayRecords.reduce((sum, record) => sum + record.duration, 0)
    days.push({
      date,
      count: dayRecords.length,
      totalDuration,
    })
    cursor = addDays(cursor, 1)
  }
  return days
}

export async function getSettings(): Promise<UserSettings> {
  const payload = await AsyncStorage.getItem(SETTINGS_KEY)
  if (!payload) {
    return defaultSettings
  }
  try {
    const parsed = JSON.parse(payload) as UserSettings
    return { ...defaultSettings, ...parsed }
  } catch {
    return defaultSettings
  }
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export type { PoopRecord as StoredPoopRecord }
