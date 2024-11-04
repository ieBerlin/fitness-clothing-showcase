import NotificationTitle from "../enums/NotificationTitle";
import { IAdmin } from "../models/Admin";
import { IProduct } from "../models/Product";

function getNotificationMessage(
  title: NotificationTitle,
  details?: IProduct | IAdmin
): string {
  switch (title) {
    case NotificationTitle.ADD_PRODUCT:
      if (isProduct(details)) {
        return `The product "${details.productName}" (ID: ${details._id}) has been added successfully.`;
      }
      return "Failed to add product. Product details are missing.";
    case NotificationTitle.UPDATE_PRODUCT:
      if (isProduct(details)) {
        return `The product "${details.productName}" (ID: ${details._id}) has been updated successfully.`;
      }
      return "Failed to update product. Product details are missing.";
    case NotificationTitle.DELETE_PRODUCT:
      if (details && "_id" in details) {
        return `The product (ID: ${details._id}) has been deleted.`;
      }
      return "Failed to delete product. Product details are missing.";
    case NotificationTitle.SECTION_ITEMS_UPDATED:
      return "The section items have been successfully updated.";

    case NotificationTitle.ADD_ADMIN_BY_MANAGER:
      if (isAdmin(details)) {
        return `Admin "${details.fullName}" (ID: ${details._id}) has been added by the manager.`;
      }
      return "Failed to add admin. Admin details are missing.";
    case NotificationTitle.SUSPEND_ADMIN_BY_MANAGER:
      if (isAdmin(details)) {
        return `Admin "${details.fullName}" (ID: ${details._id}) has been suspended by the manager.`;
      }
      return "Failed to suspend admin. Admin details are missing.";
    case NotificationTitle.ACTIVE_ADMIN_BY_MANAGER:
      if (isAdmin(details)) {
        return `Admin "${details.fullName}" (ID: ${details._id}) has been activated by the manager.`;
      }
      return "Failed to active admin. Admin details are missing.";
    case NotificationTitle.DELETE_ADMIN_BY_MANAGER:
      if (details && "_id" in details) {
        return `Admin (ID: ${details._id}) has been deleted by the manager.`;
      }
      return "Failed to delete admin. Admin details are missing.";
    case NotificationTitle.UPGRADE_ADMIN_BY_MANAGER:
      if (isAdmin(details)) {
        return `Admin "${details.fullName}" (ID: ${details._id}) has been upgraded by the manager.`;
      }
      return "Failed to upgrade admin. Admin details are missing.";
    case NotificationTitle.DOWNGRADE_ADMIN_BY_MANAGER:
      if (isAdmin(details)) {
        return `Admin "${details.fullName}" (ID: ${details._id}) has been downgraded by the manager.`;
      }
      return "Failed to downgrade admin. Admin details are missing.";
    case NotificationTitle.UPDATE_PRODUCT_IMAGE:
      if (isProduct(details)) {
        return `The product image for "${details.productName}" (ID: ${details._id}) has been updated.`;
      }
      return "Failed to update product image. Product details are missing.";
    case NotificationTitle.DELETE_PRODUCT_IMAGE:
      if (details && "_id" in details) {
        return `The product image for ID: ${details._id} has been deleted.`;
      }
      return "Failed to delete product image. Product details are missing.";
    case NotificationTitle.REMOVE_PRODUCT_FROM_SECTION:
      if (isProduct(details)) {
        return `The product "${details.productName}" (ID: ${details._id}) has been removed from the section.`;
      }
      return "Failed to remove product from section. Product details are missing.";

    default:
      return "Unknown notification.";
  }
}

function isProduct(details?: IProduct | IAdmin): details is IProduct {
  return (details as IProduct).productName !== undefined;
}

function isAdmin(details?: IProduct | IAdmin): details is IAdmin {
  return (details as IAdmin).fullName !== undefined;
}

export default getNotificationMessage;
