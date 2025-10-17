import { useMemo, useState } from "react"
import { StyleSheet, View } from "react-native"
import { StatusBar } from "expo-status-bar"
import { SafeAreaView } from "react-native-safe-area-context"

import { BottomTabBar, type TabKey } from "./src/components/BottomTabBar"
import { CalendarScreen } from "./src/screens/CalendarScreen"
import { HomeScreen } from "./src/screens/HomeScreen"
import { ProfileScreen } from "./src/screens/ProfileScreen"
import { SummaryScreen } from "./src/screens/SummaryScreen"

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("home")

  const content = useMemo(() => {
    switch (activeTab) {
      case "calendar":
        return <CalendarScreen />
      case "summary":
        return <SummaryScreen />
      case "profile":
        return <ProfileScreen />
      default:
        return <HomeScreen />
    }
  }, [activeTab])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>{content}</View>
      <BottomTabBar activeTab={activeTab} onChange={setActiveTab} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
})
