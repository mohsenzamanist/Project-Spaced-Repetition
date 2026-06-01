export function calculateSpaces(date) {
  const spaces = [
    { days: 7 },
    { months: 1 },
    { months: 3 },
    { months: 6 },
    { year: 1 },
  ];
  return spaces.map((space) => {
    const base = new Date(date);
    if (space.days) base.setDate(base.getDate() + space.days);
    if (space.months) base.setMonth(base.getMonth() + space.months);
    if (space.year) base.setFullYear(base.getFullYear() + space.year);

    return base.toISOString().split("T")[0];
  });
}

export function formatReadableDate(date) {
  const [year, month, day] = date.split("-");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const ordinalDay = formatOrdinalDay(day);
  const monthName = months[Number(month) - 1];
  return `${ordinalDay} ${monthName} ${year}`;
}

export function formatOrdinalDay(day) {
  const n = Number(day);
  const suffix =
    n % 100 >= 11 && n % 100 <= 13
      ? "th"
      : n % 10 === 1
        ? "st"
        : n % 10 === 2
          ? "nd"
          : n % 10 === 3
            ? "rd"
            : "th";
  return `${n}${suffix}`;
}
