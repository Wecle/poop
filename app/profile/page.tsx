import { BottomNav } from "@/components/bottom-nav"
import { ProfilePage } from "@/components/profile-page"

export default function Page() {
  return (
    <div className="min-h-screen pb-16">
      <ProfilePage />
      <BottomNav />
    </div>
  )
}
