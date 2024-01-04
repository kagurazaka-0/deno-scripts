import { z } from "https://esm.sh/zod@3.21.4"
import { assertEquals } from "https://deno.land/std@0.190.0/testing/asserts.ts"

function divmod(dividend: number, divisor: number): readonly [number, number] {
  const quotient = Math.floor(dividend / divisor)
  const remainder = dividend % divisor
  return [quotient, remainder]
}

const Z曜日 = ["日", "月", "火", "水", "木", "金", "土"] as const
type Z曜日 = (typeof Z曜日)[number]

function W(...it: Z曜日[]) {
  return it
}

function getWeekNumber(day: number, weekday: Z曜日) {
  if (day === 31) {
    return 5
  }
  const [_1, _2] = divmod(day, 7)
  /** N週目 */
  const weekNumber = _2 === 0 ? _1 : _1 + 1

  switch (_2) {
    case 1:
    case 2:
      return weekNumber

    case 3:
      return W("月").includes(weekday) ? weekNumber + 1 : weekNumber

    case 4:
      return W("月", "火").includes(weekday) ? weekNumber + 1 : weekNumber

    case 5:
      return W("月", "火", "水").includes(weekday) ? weekNumber + 1 : weekNumber

    case 6:
      return W("月", "火", "水", "木").includes(weekday) ? weekNumber + 1 : weekNumber

    case 7:
    case 0:
      return W("月", "火", "水", "木", "金").includes(weekday) ? weekNumber + 1 : weekNumber
  }
  throw `day=${day}, weekday=${weekday}`
}

function myWeek(d: Date) {
  const day = d.getDate()
  const week = Z曜日[d.getDay()]
  return getWeekNumber(day, week)
}

const TEST_DATE = [
  ["2023.06.13 (火)", 3],
  ["2023.11.05 (日)", 1],
  ["2023.06.20 (火)", 4],
  ["2023.03.19 (日)", 3],
  ["2023.02.09 (木)", 2],
  ["2023.01.19 (木)", 3],
  ["2023.02.22 (水)", 4],
  ["2023.10.31 (火)", 5],
  ["2023.05.24 (水)", 4],
  ["2023.10.17 (火)", 3],
  ["2023.03.07 (火)", 2],
  ["2023.07.09 (日)", 2],
  ["2023.12.05 (火)", 2],
  ["2023.09.26 (火)", 5],
  ["2023.06.09 (金)", 2],
  ["2023.08.27 (日)", 4],
  ["2023.07.14 (金)", 3],
  ["2023.01.14 (土)", 2],
  ["2023.05.31 (水)", 5],
  ["2023.05.10 (水)", 2],
  ["2023.02.25 (土)", 4],
  ["2023.11.15 (水)", 3],
  ["2023.10.04 (水)", 1],
  ["2023.12.16 (土)", 3],
] satisfies Array<[string, number]>

TEST_DATE.map(it => {
  const [dateText] = it
  const [, dayS, maybeWeekday] = dateText.match(/^\d{4}\.\d{2}\.(\d{2}) \((.)\)$/)!
  const day = Number(dayS)
  if ((Z曜日 as ReadonlyArray<string>).includes(maybeWeekday) === false) {
    throw `maybeWeekday is ${maybeWeekday}`
  }

  return [it, [day, maybeWeekday as Z曜日]] as const
}).forEach(([[dateText, result], [day, weekday]]) => {
  Deno.test(`${dateText}は  ${result}週目  であるか`, () => {
    assertEquals(result, getWeekNumber(day, weekday))
  })
})
