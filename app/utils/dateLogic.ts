import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import utc from 'dayjs/plugin/utc'

dayjs.extend(isoWeek)
dayjs.extend(utc)


export const formatYmdLocal = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

const parseLocalDate = (value: string) => {
  if (!value) return null

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return null
  if (!dayjs(match[0]).isValid()) return null
  const [, year, month, day] = match
  const parsed = new Date(Number(year), Number(month) - 1, Number(day))

  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export const formatDayMDY = (date: Date) => {
  return dayjs(date).format('dddd, MMM D, YYYY')
}

export const parseDateToYmd = (value: string) => {
  const parsed = parseLocalDate(value)

  if (parsed) {
    return formatYmdLocal(parsed)
  }

  const fallback = new Date(value)
  if (Number.isNaN(fallback.getTime())) {
    return ''
  }

  return formatYmdLocal(fallback)
}

export const formatYmdUtcDateString = (dateStr: string): string => {
  if (!dateStr) return ''

  return dayjs.utc(dateStr).format('YYYY-MM-DD')
}

export const startOfCurrentWeekString = (): string => {
  return dayjs.utc().startOf('isoWeek').format('YYYY-MM-DD')
}

export const startOfWeekString = (dateStr: string): string => {
  return dayjs.utc(dateStr).startOf('isoWeek').format('YYYY-MM-DD')
}

export const endOfWeekString = (dateStr: string): string => {
  return dayjs.utc(dateStr).endOf('isoWeek').format('YYYY-MM-DD')
}

export const add = (utcDateStr: string, amount: number, unit: dayjs.ManipulateType): Date => {
  return dayjs.utc(utcDateStr).add(amount, unit).toDate()
}