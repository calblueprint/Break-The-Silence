const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const FULL_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// "9:41 AM"
export function formatTime(date: Date) {
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = date.getHours() < 12 ? 'AM' : 'PM';
  return `${hours}:${minutes} ${period}`;
}

// "Fri, Oct 9"
export function formatShortDate(date: Date) {
  return `${WEEKDAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

// "Fri, Oct 9 • 9:41 AM"
export function formatEntryDate(date: Date) {
  return `${formatShortDate(date)} • ${formatTime(date)}`;
}

// "October 2026"
export function formatMonthYear(date: Date) {
  return `${FULL_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}
