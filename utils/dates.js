const DAY_OFFSETS = { yesterday: -1, today: 0, tomorrow: 1 }

// The service works to UK time, so dates and times are the UK ones, whatever timezone the tests run in
function ukParts(instant) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23'
  }).formatToParts(instant)
  const part = (type) => Number(parts.find((p) => p.type === type).value)

  return {
    day: part('day'),
    month: part('month'),
    year: part('year'),
    hour: part('hour'),
    minute: part('minute')
  }
}

// UK date and time a number of minutes from now, so the date rolls over correctly near midnight
export function arrivalDateTimeFromNow(minutes) {
  const parts = ukParts(new Date(Date.now() + minutes * 60 * 1000))

  return Object.fromEntries(
    Object.entries(parts).map(([name, value]) => [name, String(value)])
  )
}

export function arrivalDate(when) {
  const offset = DAY_OFFSETS[when]
  if (offset === undefined) {
    throw new Error(`Unknown arrival date "${when}"`)
  }

  const today = ukParts(new Date())

  // UTC arithmetic keeps clock changes from moving the date
  const date = new Date(
    Date.UTC(today.year, today.month - 1, today.day + offset)
  )

  return {
    day: String(date.getUTCDate()),
    month: String(date.getUTCMonth() + 1),
    year: String(date.getUTCFullYear())
  }
}
