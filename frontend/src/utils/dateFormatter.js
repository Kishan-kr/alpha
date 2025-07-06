/**
 * Formats to relative date.
 * 
 * @param {Date | string} dateString - The date to format.
 * @returns {string} - Returns the formatted date string.
 */
export function formatToRelativeDate(dateString) {
  const inputDate = new Date(dateString);
  const today = new Date();

  // Strip time for comparison
  const stripTime = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const inputDay = stripTime(inputDate);
  const currentDay = stripTime(today);

  const diffInTime = currentDay - inputDay;
  const diffInDays = diffInTime / (1000 * 60 * 60 * 24);

  if (diffInDays === 0) {
    return 'Today';
  } else if (diffInDays === 1) {
    return 'Yesterday';
  }

  const day = inputDate.getDate().toString().padStart(2, '0');
  const monthShort = inputDate.toLocaleString('default', { month: 'short' });
  const year = inputDate.getFullYear();

  return `${day} ${monthShort}, ${year}`;
}

/**
 * Checks if the given date is within a certain number of calendar days from today.
 * 
 * @param {Date | string} inputDate - The reference date (e.g., deliveredAt).
 * @param {number} days - The number of calendar days to check against.
 * @returns {boolean} - True if today is within the given number of days from the inputDate.
 */
export function isWithinCalendarDays(inputDate, days) {
  const refDate = new Date(inputDate);
  const today = new Date();

  // Normalize both to midnight to count full calendar days only
  refDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffInMs = today - refDate;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  return diffInDays >= 0 && diffInDays <= days;
}
