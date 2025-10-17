import { useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from "react-native"

import { getSettings, saveSettings, type UserSettings } from "../storage"

const themeOptions = [
  { label: "樱花粉", value: "pink" },
  { label: "天空蓝", value: "blue" },
  { label: "薄荷绿", value: "green" },
  { label: "阳光橙", value: "orange" },
] as const

type ThemeColor = (typeof themeOptions)[number]["value"]

export function ProfileScreen() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    getSettings().then(setSettings).catch(() => setSettings(null))
  }, [])

  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const handleSave = async () => {
    if (!settings) return
    setIsSaving(true)
    try {
      await saveSettings(settings)
      Alert.alert("保存成功", "设置已更新")
    } catch (error) {
      console.error(error)
      Alert.alert("保存失败", "请稍后再试")
    } finally {
      setIsSaving(false)
    }
  }

  if (!settings) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>正在加载设置...</Text>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>个人中心</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>基本信息</Text>
        <Text style={styles.label}>昵称</Text>
        <TextInput
          style={styles.input}
          placeholder="输入你的昵称"
          value={settings.name ?? ""}
          onChangeText={(text) => updateSetting("name", text)}
        />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>主题色</Text>
        <View style={styles.themeList}>
          {themeOptions.map((option) => {
            const isActive = settings.themeColor === option.value
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.themeItem, isActive && styles.themeItemActive]}
                onPress={() => updateSetting("themeColor", option.value)}
              >
                <View style={[styles.themeIndicator, { backgroundColor: themeColorToHex(option.value) }]} />
                <Text style={[styles.themeLabel, isActive && styles.themeLabelActive]}>{option.label}</Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>提醒设置</Text>
        <SettingSwitch
          label="开启提醒"
          value={settings.reminderEnabled}
          onValueChange={(value) => updateSetting("reminderEnabled", value)}
        />
        <SettingSwitch
          label="震动反馈"
          value={settings.vibrationEnabled}
          onValueChange={(value) => updateSetting("vibrationEnabled", value)}
        />
        <SettingSwitch
          label="提示音"
          value={settings.soundEnabled}
          onValueChange={(value) => updateSetting("soundEnabled", value)}
        />
      </View>
      <TouchableOpacity style={[styles.saveButton, isSaving && styles.saveButtonDisabled]} onPress={handleSave} disabled={isSaving}>
        <Text style={styles.saveButtonText}>{isSaving ? "保存中..." : "保存设置"}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

interface SettingSwitchProps {
  label: string
  value: boolean
  onValueChange: (value: boolean) => void
}

function SettingSwitch({ label, value, onValueChange }: SettingSwitchProps) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} thumbColor={value ? "#f472b6" : undefined} />
    </View>
  )
}

function themeColorToHex(color: ThemeColor): string {
  switch (color) {
    case "pink":
      return "#f472b6"
    case "blue":
      return "#60a5fa"
    case "green":
      return "#34d399"
    case "orange":
      return "#fb923c"
    default:
      return "#f472b6"
  }
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
  section: {
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
  label: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#fbcfe8",
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  themeList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  themeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#fce7f3",
    backgroundColor: "#fff",
    gap: 8,
  },
  themeItemActive: {
    borderColor: "#f472b6",
    backgroundColor: "#fdf2f8",
  },
  themeIndicator: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  themeLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  themeLabelActive: {
    color: "#be185d",
    fontWeight: "600",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: "#4b5563",
  },
  saveButton: {
    backgroundColor: "#f472b6",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff7fb",
  },
  loadingText: {
    color: "#6b7280",
    fontSize: 16,
  },
})
