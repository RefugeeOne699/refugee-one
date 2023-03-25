import {
  BENEFIT,
  DAYS_OF_WEEK,
  ENGLISH_LEVEL,
  JOB_POSTED_FILTER,
  JOB_TYPE,
} from "./constants";

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

/**
 * Check if job title include search query
 * @param {Object} job
 * @param {String} search
 */
function searchCheck(job, search) {
  if (!job) return false;
  return (
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.name.toLowerCase().includes(search.toLowerCase())
  );
}

/**
 * Check for jobPosted field of job
 * @param {Object} job
 * @param {String} jobPosted (index of ["Anytime", "Past 3 days", "Past week", "Past month"])
 */
function jobPostedCheck(job, jobPosted) {
  if (!job) return false;
  //todo: write the function
  return true;
}

/**
 * Check for jobType field of job
 * @param {Object} job
 * @param {String[]} jobType (indices of ["Part-time", "Full-time", "Shift based"])
 */
function jobTypeCheck(job, jobType) {
  if (!job) return false;
  return (
    !jobType.length || jobType.map((id) => JOB_TYPE[parseInt(id)]).includes(job.jobType)
  );
}

/**
 * Check for wage field of job
 * @param {Object} job
 * @param {String} wage ([0, 5, 10, 18, 25, 32])
 */
function wageCheck(job, wage) {
  if (!job) return false;
  if (job.wage.type === "Yearly") {
    return parseInt(wage) <= job.wage.max / 2000;
  } else {
    return parseInt(wage) <= job.wage.max;
  }
}

/**
 * Check for english field of job
 * @param {Object} job
 * @param {String[]} english (indices of ["Not required","Basic","Intermediate","Native","Fluent/Advance"]
 */
function englishCheck(job, english) {
  if (!job) return false;
  return (
    !english.length ||
    english.map((id) => ENGLISH_LEVEL[parseInt(id)]).includes(job.langEnglishLevel)
  );
}

/**
 * Check for benefit field of job
 * @param {Object} job
 * @param {String[]} benefit (indices of ["Medical","Others"])
 */
function benefitCheck(job, benefit) {
  if (!job) return false;
  for (const id of benefit) {
    const benefit_field = "has" + BENEFIT[parseInt(id)];
    if (!job.benefit[benefit_field]) return false;
  }
  return true;
}

/**
 * Get a subset of jobs according to search and filter requirements
 * @param {Object[]} jobs
 * @param {String} search
 * @param {Object} filter
 */
export function getSearchAndFilterResult(jobs, search, filter) {
  if (!jobs) return null;
  const result = jobs
    .filter((job) => searchCheck(job, search))
    .filter((job) => jobPostedCheck(job, filter.jobPosted))
    .filter((job) => jobTypeCheck(job, filter.jobType))
    .filter((job) => wageCheck(job, filter.wage))
    .filter((job) => englishCheck(job, filter.english))
    .filter((job) => benefitCheck(job, filter.benefit));

  return result;
}
