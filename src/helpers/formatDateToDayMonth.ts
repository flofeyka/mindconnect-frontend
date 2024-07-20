export default function formatDateToDayMonth(formatDate: string) {
  const date = new Date(formatDate);

  const day = date.getDate();
  const monthIndex = date.getMonth();

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

  const monthName = months[monthIndex];

  return `${day} ${monthName}`;
}
