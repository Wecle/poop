import { BottomNav } from "@/components/bottom-nav"
import { HomePage } from "@/components/home-page"

export default function Page() {
  return (
    <div className="min-h-screen pb-16">
      <HomePage />
      <BottomNav />
    </div>
  )
}
