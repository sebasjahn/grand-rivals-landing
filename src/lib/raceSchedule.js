// Upcoming "lights out" datetimes (UTC ISO). PLACEHOLDER calendar — replace with
// the official schedule. The countdown picks the next entry still in the future,
// so old dates can stay in the list harmlessly.
export const RACE_SCHEDULE = [
  '2026-06-28T13:00:00Z',
  '2026-07-05T13:00:00Z',
  '2026-07-26T13:00:00Z',
  '2026-08-30T13:00:00Z',
  '2026-09-06T13:00:00Z',
]

/**
 * Returns the next race start strictly in the future, or null if the schedule is
 * exhausted. `now` is injectable for testing.
 */
export function getNextRaceDate(now = Date.now()) {
  for (const iso of RACE_SCHEDULE) {
    const t = new Date(iso).getTime()
    if (t > now) return new Date(t)
  }
  return null
}
