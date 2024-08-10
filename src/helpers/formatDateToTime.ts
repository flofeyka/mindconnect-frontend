export default function formatDateToTime(dateToFormat: string | number) {
  const date = new Date(dateToFormat);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedHours = hours < 10 ? `0${hours}` : hours.toString();
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();

  return `${formattedHours}:${formattedMinutes}`;
}
