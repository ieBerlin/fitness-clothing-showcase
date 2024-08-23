export class Notification {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public date: Date,
    public isRead: boolean = false
  ) {}

  markAsRead(): void {
    this.isRead = true;
  }

  isNotificationRead(): boolean {
    return this.isRead;
  }

  getFormattedDate(): string {
    return this.date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      weekday: "long",
    });
  }
}
