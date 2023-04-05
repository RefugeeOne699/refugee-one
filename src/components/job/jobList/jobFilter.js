import { WAGE_TYPE } from "@/constants";

export const WAGE_FILTER = [0, 16, 17, 18, 19, 20];
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
  switch (jobPosted) {
    case "Anytime":
      return true;
    case "Past 3 days":
      return (
        new Date().getTime() - new Date(job.datePost.seconds * 1000).getTime() <=
        3 * 24 * 60 * 60 * 1000
      );
    case "Past week":
      return (
        new Date().getTime() - new Date(job.datePost.seconds * 1000).getTime() <=
        7 * 24 * 60 * 60 * 1000
      );
    case "Past month":
      return (
        new Date().getTime() - new Date(job.datePost.seconds * 1000).getTime() <=
        30 * 24 * 60 * 60 * 1000
      );
    default:
      return false;
  }
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
    if (!job.benefit[benefit_field]) return false;
  }
  return true;
}

function distanceCheck(job, anyDistance, distance) {
  if (!job) return false;
  if (anyDistance) return true;
  return job.distance && parseFloat(job.distance) < parseFloat(distance);
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
    .filter((job) => benefitCheck(job, filter.benefit))
    .filter((job) => distanceCheck(job, filter.anyDistance, filter.distance));

  return result;
}
