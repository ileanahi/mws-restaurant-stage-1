console.log('Service Worker: Registered');

// Cache Files
const cacheFiles = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js',
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg'
];

// Open cache on installation and returns a promise to add the cacheFiles
self.addEventListener('install', function(evt) {
    evt.waitUntil(
        caches.open('v1').then(function(cache) {
            return cache.addAll(cacheFiles);
        })
    );
})

// Listen for fetch and see if the url already exists in the cache
self.addEventListener('fetch', function(evt) {
    evt.respondWith(
        caches.match(evt.request)
        .then(function(response) {
            if (response) {
                console.log('Found ', evt.request, ' in cache');
                return response;
            }

            let fetchRequest = evt.request.clone();

            return fetch(fetchRequest).then(
                function(response) {
                    if(!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    let responseToCache = response.clone();
                    caches.open(cacheFiles)
                    .then(function(cache) {
                        cache.put(evt.request, responseToCache);
                    });

                    return response;
                });
            })
        );
    })