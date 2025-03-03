const CACHE_NAME = 'my-cache-v1'; 
const urlsToCache = [
'/', 
'/src/assets/fon.mp4',
'/src/assets/fon.webm',
'/src/assets/fon-poster.webp',
'/src/assets/a.png',
'/src/assets/background.jpg',
'/src/assets/Bad-svg-yellow.svg',
'/src/assets/Bad-svg.svg',
'/src/assets/Bad.png',
'/src/assets/base.css',
'/src/assets/cash.png',
'/src/assets/CloseBtnBlack.png',
'/src/assets/CloseImage.png',
'/src/assets/CloseImageWhite.png',
'/src/assets/contacts.png',
'/src/assets/contacts.svg',
'/src/assets/feedback_1.png',
'/src/assets/feedback2.png',
'/src/assets/fon.mp4',
'/src/assets/fon.webm',
'/src/assets/g.png',
'/src/assets/good-ok.png',
'/src/assets/good-ok12.png',
'/src/assets/Good-svg-yellow.svg',
'/src/assets/Good-svg.svg',
'/src/assets/Good.png',
'/src/assets/green-ok.png',
'/src/assets/help.png',
'/src/assets/help.svg',
'/src/assets/House_01.png',
'/src/assets/House_02.png',
'/src/assets/House_03.svg',
'/src/assets/House_04.png',
'/src/assets/house_light.png',
'/src/assets/hu.png',
'/src/assets/humen.png',
'/src/assets/i.png',
'/src/assets/img_1.png',
'/src/assets/img_2.png',
'/src/assets/img_3.png',
'/src/assets/img.png',
'/src/assets/info.svg',
'/src/assets/lines.png',
'/src/assets/logo.svg',
'/src/assets/lottery.png',
'/src/assets/loto.png',
'/src/assets/loto.svg',
'/src/assets/lottery-icon.png',
'/src/assets/lottery-icons.png',
'/src/assets/man.png',
'/src/assets/meal.png',
'/src/assets/modified_man.png',
'/src/assets/narow_menu_left.png',
'/src/assets/narow_menu_right.png',
'/src/assets/Neutral.png',
'/src/assets/pay.svg',
'/src/assets/per-Photoroom-Photoroom.png',
'/src/assets/per.png',
'/src/assets/person_80dp_CC9F33_FILL0_wght.png',
'/src/assets/person.png',
'/src/assets/person12.png',
'/src/assets/photo_2025-01-19_13-10-51.jpg',
'/src/assets/prize.png',
'/src/assets/qr.png',
'/src/assets/r.png',
'/src/assets/rating.png',
'/src/assets/rating.svg',
'/src/assets/red-ok.png',
'/src/assets/reset.css',
'/src/assets/mless.svg',
'/src/assets/sbp.png',
'/src/assets/site.png',
'/src/assets/stars.svg',
'/src/assets/start.png',
'/src/assets/starts-group.png',
'/src/assets/styled_man.png',
'/src/assets/telegram.png',
'/src/assets/VK.png',
'/src/assets/yellow-ok.png',
'/src/assets/MrpA.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache); 
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName); 
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request) 
      .then((response) => {
        if (response) {
          return response; 
        }
        return fetch(event.request); 
      })
  );
});