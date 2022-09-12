export function daysAgo(days = 0, date?: Date) {
  date = date || new Date();
  date.setDate(date.getDate() - days);
  return date;
}

export function monthsAgo(months = 0, day = 1) {
  return new Date(new Date().getFullYear(), new Date().getMonth() - months, day);
}

export function daysInMonthAgo(months = 0) {
  return new Date(new Date().getFullYear(), new Date().getMonth() - months, 0).getDate();
}

export function dayRange(from = 0, to = 0) {
  const range = [];

  for (let i = from; i <= to; i++) {
    var date = new Date();
    date.setDate(date.getDate() - i);
    range.push(date);
  }

  return range;
}

export function monthRange(from = 0, to = 0) {
  const range = [];
  let year = new Date().getFullYear();
  let month = to;

  for (let i = from; i <= month; i++) {
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let j = 0; j < daysInMonth; j++) {
      range.push(new Date(year, month, j));
    }
  }

  return range;
}
