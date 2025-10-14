import { BottomNav } from "@/components/bottom-nav"
import { CalendarPage } from "@/components/calendar-page"

export default function Page() {
  return (
    <div className="min-h-screen pb-16">
      <CalendarPage />
      <BottomNav />
    </div>
  )
}
