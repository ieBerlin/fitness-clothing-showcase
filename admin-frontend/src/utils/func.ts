import Availability from "../enums/Availability";
import Gender from "../enums/Gender";
import Season from "../enums/Season";
import Product from "../models/Product";
import Notification from "../models/Notification";
import Section from "../models/Section";
import ActivityType from "../enums/ActivityType";
export const availabilityOptions = Object.entries(Availability).map(
  ([key, value]) => ({
    label: key.replace(/_/g, " "),
    value: value.toLowerCase(),
  })
);
export const activityTypeOptions = Object.entries(ActivityType).map(
  ([key, value]) => ({
    label: key.replace(/_/g, " ").toUpperCase(),
    value: value.toLowerCase(),
  })
);
export const genderOptions = Object.entries(Gender).map(([key, value]) => ({
  label: key.toUpperCase(),
  value: value.toLowerCase(),
}));
export const seasonOptions = Object.entries(Season).map(([key, value]) => ({
  value: value.toLowerCase(),
  label: key.toUpperCase(),
}));
export function productsQuantity(product: Product): number {
  let quantity: number = 0;
  product.colors.forEach((color) =>
    color.availableSizes.map((size) => {
      quantity += size.quantity;
    })
  );
  return quantity;
}
export function formatMessage(message: string) {
  return message
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
export function sortNotifications(
  notifications: Notification[]
): Notification[] {
  return notifications.sort((notificationA, notificationB) => {
    const dateA = new Date(notificationA.createdAt);
    const dateB = new Date(notificationB.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
}
export const currentMonthSections: Section[] = [];
export const previousMonthSections: Section[] = [];
export const snakeCaseToReadable = (str: string) => {
  return str
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
};
