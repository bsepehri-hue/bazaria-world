// 🔕 Notifications temporarily disabled to stabilize the dashboard

export function useNotifications(userId?: string) {
  return {
    hasUnread: false,
    notifications: [],
  };
}