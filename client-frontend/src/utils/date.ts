export const currentDate = new Date().toLocaleDateString("en-US", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  weekday: "long",
});
