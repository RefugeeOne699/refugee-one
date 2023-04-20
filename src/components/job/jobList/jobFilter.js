import { WAGE_TYPE } from "@/constants";

export const WAGE_FILTER = [0, 16, 17, 18, 19, 20];
export const JOB_POSTED_FILTER = ["Anytime", "Past 3 days", "Past week", "Past month"];
export const OTHER_LANGUAGE_FILTER = [
  "Any",
  "Amharic",
  "Arabic",
  "Burmese",
  "Dari",
  "French",
  "Haitian Creole",
  "Hindi",
  "Kinyarwanda",
  "Lingala",
  "Malay",
  "Pashto",
  "Persian/Farsi",
  "Polish",
  "Rohingya",
  "Russian",
  "Somali",
  "Spanish",
  "Swahili",
  "Tigrinya",
  "Ukrainian",
  "Urdu",
];
export const TIME_OF_DAY = [
  "12am",
  "1am",
  "2am",
  "3am",
  "4am",
  "5am",
  "6am",
  "7am",
  "8am",
  "9am",
  "10am",
  "11am",
  "12pm",
  "1pm",
  "2pm",
  "3pm",
  "4pm",
  "5pm",
  "6pm",
  "7pm",
  "8pm",
  "9pm",
  "10pm",
  "11pm",
];

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

function otherLanguageCheck(job, otherLanguage) {
  if (!job) return false;
  if (otherLanguage === OTHER_LANGUAGE_FILTER[0]) return true;

  //split language by both / and whitespace, and remove empty parts from the resulting array
  const languageParts = otherLanguage.split(/[ /]/).filter((part) => part !== "");
  for (const part of languageParts) {
    if (job.langNote.toLowerCase().includes(part.toLowerCase())) {
      return true;
    }
  }
  return false;
}

function extractTimePairs(text) {
  const timeRegex = /((1[0-2]|0?[1-9]))(?::([0-5]\d))?\s*(am|pm|AM|PM|Am|Pm)/g;
  const result = [];

  let timeMatch = timeRegex.exec(text);
  // check if there is an even number of time values, otherwise return empty list
  let missingEndTime = false;

  while (timeMatch !== null) {
    const startTime = timeMatch[0];
    timeMatch = timeRegex.exec(text);
    const endTime = timeMatch ? timeMatch[0] : "";

    if (endTime) {
      result.push({ startTime, endTime });
    } else {
      missingEndTime = true;
      break;
    }
    if (timeMatch) {
      timeMatch = timeRegex.exec(text);
    }
  }
  // If there's a missing endTime, return an empty array
  if (missingEndTime) {
    return [];
  }

  return result;
}

function timeToNumber(timeString) {
  const timeRegex = /((1[0-2]|0?[1-9]))(?::([0-5]\d))?\s*(am|pm|AM|PM|Am|Pm)/;
  const match = timeRegex.exec(timeString);

  if (!match) {
    throw new Error(`Invalid time string: ${timeString}`);
  }

  let hours = parseInt(match[1]);
  const minutes = parseInt(match[3]) || 0;
  const period = match[4].toLowerCase();

  if (period === "pm" && hours !== 12) {
    hours += 12;
  } else if (period === "am" && hours === 12) {
    hours = 0;
  }

  return hours + minutes / 60;
}

function shiftTimeCheck(job, anyShiftTime, shiftTime) {
  // This function is able to pick up any time value like '9am', '9:00am', '9:00AM', '3:00 Pm'
  // BUT is not able to pick up 24-hour-format time like '18:00', '3:00', '5'
  // Check the regular expression for the supported time format detail

  if (!job) return false;
  // the return value from useform is a string for radio input
  if (anyShiftTime === "true") return true;

  const jobShiftTimePairs = extractTimePairs(job["shift"]);
  // convert every {shift_start_time, shift_end_time} pairs to numeric values from 0 to 24
  const jobShiftNumericTimePairs = jobShiftTimePairs.map((pair) => ({
    startTime: timeToNumber(pair.startTime),
    endTime: timeToNumber(pair.endTime),
  }));
  // add one day (24hr) to end time if end_time < start_time
  const jobShiftNumericTimePairsAdjusted = jobShiftNumericTimePairs.map((pair) => {
    if (pair.endTime < pair.startTime) {
      return {
        startTime: pair.startTime,
        endTime: pair.endTime + 24,
      };
    } else return pair;
  });

  // also convert the start_after and end_before specified by filter
  let numericStartAfter = timeToNumber(shiftTime.start_after);
  let numericEndBefore = timeToNumber(shiftTime.end_before);
  // also adjust if end_before < start_after specified by filter
  if (numericEndBefore < numericStartAfter) numericEndBefore += 24;
  // check if there's matching shift time
  for (let pair of jobShiftNumericTimePairsAdjusted) {
    if (
      (numericStartAfter <= pair.startTime && numericEndBefore >= pair.endTime) ||
      (numericStartAfter <= pair.startTime + 24 && numericEndBefore >= pair.endTime + 24)
    ) {
      return true;
    }
  }

  return false;
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
    .filter((job) => distanceCheck(job, filter.anyDistance, filter.distance))
    .filter((job) => shiftTimeCheck(job, filter.anyShiftTime, filter.shiftTime))
    .filter((job) => otherLanguageCheck(job, filter.otherLanguage));

  return result;
}
