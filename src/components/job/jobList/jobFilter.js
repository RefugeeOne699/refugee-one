import { WAGE_TYPE } from "@/constants";

export const WAGE_FILTER = [0, 5, 10, 18, 25, 32];
export const JOB_POSTED_FILTER = ["Anytime", "Past 3 days", "Past week", "Past month"];

function searchCheck(job, search) {
  if (!job) return false;
  return (
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase())
  );
}

function jobPostedCheck(job, jobPosted) {
  if (!job) return false;
  if (jobPosted === "Anytime") return true;
  //todo: write the function
  return true;
}

function jobTypeCheck(job, jobType) {
  if (!job) return false;
  return !jobType.length || jobType.includes(job.jobType);
}

function wageCheck(job, wage) {
  if (!job) return false;
  if (job.wage.type === WAGE_TYPE.YEARLY) {
    return parseInt(wage) <= job.wage.max / 2000;
  } else {
    return parseInt(wage) <= job.wage.max;
  }
}

function englishCheck(job, english) {
  if (!job) return false;
  return !english.length || english.includes(job.langEnglishLevel);
}

function benefitCheck(job, benefit) {
  if (!job) return false;
  for (const b of benefit) {
    const benefit_field = "has" + b;
    console.log(benefit_field);
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
