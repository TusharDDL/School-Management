self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.message,
      icon: '/icons/notification-icon.png',
      badge: '/icons/notification-badge.png',
      data: data.data,
      actions: data.actions,
      tag: data.tag,
      renotify: true,
      requireInteraction: true,
    }

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()

  const data = event.notification.data
  if (data && data.url) {
    event.waitUntil(
      clients.openWindow(data.url)
    )
  }
})

self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim())
})
