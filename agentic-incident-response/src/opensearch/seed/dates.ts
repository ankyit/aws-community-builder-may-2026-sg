export const DAY_MS = 24 * 60 * 60 * 1000

export function startOfUtcWeekMonday(d: Date): Date {
  const x = new Date(d)
  const daysSinceMonday = (x.getUTCDay() + 6) % 7
  x.setUTCDate(x.getUTCDate() - daysSinceMonday)
  return x
}

export function mondayWeeksAgo(weeksAgo: number): string {
  const monday = startOfUtcWeekMonday(new Date())
  monday.setUTCDate(monday.getUTCDate() - weeksAgo * 7)
  monday.setUTCHours(1, 0, 0, 0)
  return monday.toISOString()
}

export function midnightDaysAgo(daysAgo: number, minute: number): string {
  const d = new Date(Date.now() - daysAgo * DAY_MS)
  d.setUTCHours(0, minute, 0, 0)
  return d.toISOString()
}

export function wednesdayAfternoon(daysAgo: number): string {
  const d = new Date(Date.now() - daysAgo * DAY_MS)
  const dow = d.getUTCDay()
  const delta = (3 - dow + 7) % 7
  d.setUTCDate(d.getUTCDate() + delta)
  d.setUTCHours(6, 30, 0, 0)
  return d.toISOString()
}
