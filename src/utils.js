import BingKey from "@/bingConfig.js";

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

export function convertKilometersToMiles(kilometers) {
  const miles = kilometers * 0.621371;
  return miles;
}

export async function getCoordinate(street, city, state, zipcode) {
  const countryRegion = "US";
  const response = await fetch(
    "https://dev.virtualearth.net/REST/v1/Locations/" +
      countryRegion +
      "/" +
      state +
      "/" +
      zipcode +
      "/" +
      city +
      "/" +
      street +
      "?key=" +
      BingKey
  );
  const json = await response.json();
  const latitude = json.resourceSets[0].resources[0].point.coordinates[0];
  const longitude = json.resourceSets[0].resources[0].point.coordinates[1];
  return {
    latitude,
    longitude,
  };
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371; // radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c; // in km
  return convertKilometersToMiles(distance);
}
