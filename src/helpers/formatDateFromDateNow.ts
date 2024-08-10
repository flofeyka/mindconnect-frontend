export function formatDateFromDateNow() {
  // Получаем текущее время в миллисекундах
  const now = Date.now();

  // Создаем объект Date из текущего времени
  const date = new Date(now);

  // Форматируем дату в строку вида YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
  const day = String(date.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}
