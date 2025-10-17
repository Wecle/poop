export function formatTimer(totalSeconds: number): string {
  const seconds = Math.max(Math.floor(totalSeconds), 0)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
}

export function formatMinutes(totalSeconds: number): string {
  const minutes = totalSeconds / 60
  if (minutes < 1) {
    return `${totalSeconds} 秒`
  }
  return `${minutes.toFixed(1).replace(/\.0$/, "")} 分钟`
}
