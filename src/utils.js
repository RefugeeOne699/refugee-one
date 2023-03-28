import { DAYS_OF_WEEK } from "./constants";

export function debounce(fn, t) {
  let timer = null;
  return function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, t);
  };
}

/**
 * Convert a number 0-127 to a set of days of week
 * @param {Number} num
 * @returns a list of days of week
 */
export function numberToDaysOfWeek(num) {
  let daysOfWeek = [];
  for (let i = 6; i >= 0; i--) {
    if (parseInt(num / 2 ** i) > 0) {
      daysOfWeek.push(DAYS_OF_WEEK[i]);
    }
    num = num % 2 ** i;
  }
  return daysOfWeek.reverse();
}

/**
 * Convert a set of days of week to a number 0-127
 * @param {String[]} days
 */
export function daysOfWeekToNumber(days) {
  return days.reduce((acc, day) => acc + 2 ** DAYS_OF_WEEK.indexOf(day), 0);
}
