export default function formatDateToSubmit(date: string) {
  const originalDate = new Date(date);

  originalDate.setDate(originalDate.getDate());

  const resultDate = originalDate.toISOString().split("T")[0];
  return resultDate;
}
