"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { storage, type UserSettings } from "@/lib/storage"
import { User, Palette, Bell, Info, LogOut, Cloud } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function ProfilePage() {
  const [settings, setSettings] = useState<UserSettings>(storage.getSettings())
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [tempName, setTempName] = useState(settings.name || "")
  const [tempAvatar, setTempAvatar] = useState(settings.avatar || "")

  useEffect(() => {
    storage.saveSettings(settings)
  }, [settings])

  const handleLogin = () => {
    setSettings({
      ...settings,
      name: tempName,
      avatar: tempAvatar,
    })
    setIsLoginDialogOpen(false)
  }

  const handleLogout = () => {
    setSettings({
      ...settings,
      name: undefined,
      avatar: undefined,
    })
    setTempName("")
    setTempAvatar("")
  }

  const getInitials = (name?: string) => {
    if (!name) return "?"
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="p-6 pb-4">
        <h1 className="text-2xl font-bold text-primary">我的</h1>
      </div>

      <div className="px-6 space-y-6 pb-6">
        {/* User Profile Card */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={settings.avatar || "/placeholder.svg"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {getInitials(settings.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {settings.name ? (
                <>
                  <h2 className="text-xl font-semibold">{settings.name}</h2>
                  <p className="text-sm text-muted-foreground">已登录</p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">未登录</h2>
                  <p className="text-sm text-muted-foreground">点击下方按钮登录</p>
                </>
              )}
            </div>
          </div>

          {settings.name ? (
            <Button variant="outline" className="w-full bg-transparent" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              注销
            </Button>
          ) : (
            <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  登录
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>设置个人信息</DialogTitle>
                  <DialogDescription>设置你的头像和昵称</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">昵称</Label>
                    <Input
                      id="name"
                      placeholder="输入你的昵称"
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatar">头像 URL</Label>
                    <Input
                      id="avatar"
                      placeholder="输入头像图片链接"
                      value={tempAvatar}
                      onChange={(e) => setTempAvatar(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" onClick={handleLogin}>
                    确认
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </Card>

        {/* Cloud Sync Card */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Cloud className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-medium">云端同步</h3>
                <p className="text-sm text-muted-foreground">即将推出</p>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled>
              设置
            </Button>
          </div>
        </Card>

        {/* Theme Settings */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <Palette className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-medium">主题颜色</h3>
              <p className="text-sm text-muted-foreground">选择你喜欢的主题</p>
            </div>
          </div>
          <RadioGroup
            value={settings.themeColor}
            onValueChange={(value) => setSettings({ ...settings, themeColor: value })}
            className="grid grid-cols-3 gap-3"
          >
            <div>
              <RadioGroupItem value="pink" id="pink" className="peer sr-only" />
              <Label
                htmlFor="pink"
                className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[oklch(0.75_0.15_340)] mb-2" />
                <span className="text-sm">粉色</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="blue" id="blue" className="peer sr-only" />
              <Label
                htmlFor="blue"
                className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[oklch(0.65_0.2_250)] mb-2" />
                <span className="text-sm">蓝色</span>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="green" id="green" className="peer sr-only" />
              <Label
                htmlFor="green"
                className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-[oklch(0.7_0.15_150)] mb-2" />
                <span className="text-sm">绿色</span>
              </Label>
            </div>
          </RadioGroup>
        </Card>

        {/* Reminder Settings */}
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <Bell className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-medium">每日提醒</h3>
              <p className="text-sm text-muted-foreground">设置健康提醒</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="reminder-enabled" className="cursor-pointer">
                启用提醒
              </Label>
              <Switch
                id="reminder-enabled"
                checked={settings.reminderEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, reminderEnabled: checked })}
              />
            </div>

            {settings.reminderEnabled && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="reminder-time">提醒时间</Label>
                  <Input
                    id="reminder-time"
                    type="time"
                    value={settings.reminderTime || "09:00"}
                    onChange={(e) => setSettings({ ...settings, reminderTime: e.target.value })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="vibration" className="cursor-pointer">
                    震动提醒
                  </Label>
                  <Switch
                    id="vibration"
                    checked={settings.vibrationEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, vibrationEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sound" className="cursor-pointer">
                    声音提醒
                  </Label>
                  <Switch
                    id="sound"
                    checked={settings.soundEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, soundEnabled: checked })}
                  />
                </div>
              </>
            )}
          </div>
        </Card>

        {/* About */}
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Info className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="font-medium">关于</h3>
                <p className="text-sm text-muted-foreground">版本 1.0.0</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
