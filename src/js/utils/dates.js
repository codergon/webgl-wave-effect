function formatDate(date, format) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();

  return format
    .replace("YYYY", year)
    .replace("MM", month.toString().padStart(2, "0"))
    .replace("DD", day.toString().padStart(2, "0"))
    .replace("hh", hours.toString().padStart(2, "0"))
    .replace("mm", minutes.toString().padStart(2, "0"))
    .replace("ss", seconds.toString().padStart(2, "0"))
    .replace("SSS", milliseconds.toString().padStart(3, "0"));
}

function addTimeToDate(date, time, unit) {
  const newDate = new Date(date);
  switch (unit) {
    case "seconds":
      newDate.setSeconds(newDate.getSeconds() + time);
      break;
    case "minutes":
      newDate.setMinutes(newDate.getMinutes() + time);
      break;
    case "hours":
      newDate.setHours(newDate.getHours() + time);
      break;
    case "days":
      newDate.setDate(newDate.getDate() + time);
      break;
    case "weeks":
      newDate.setDate(newDate.getDate() + time * 7);
      break;
    case "months":
      newDate.setMonth(newDate.getMonth() + time);
      break;
    case "years":
      newDate.setFullYear(newDate.getFullYear() + time);
      break;
    default:
      throw new Error("Invalid time unit specified.");
  }

  return newDate;
}

function isDateInRange(dateToCheck, startDate, endDate) {
  const checkDate = new Date(dateToCheck);
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  return checkDate >= startDateObj && checkDate <= endDateObj;
}
