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