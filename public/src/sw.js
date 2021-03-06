const currentCacheName = 'DP-app-v1.0'; // the app version number
const casheContent = [ // the files that will be saved
    '/',
    '/admin/',
    '/admin/content',
    '/admin/slideshows',
    '/css/style.css',
    '/img/background.jpg',
    '/js/app.js'
];

//install service worker
this.addEventListener('install', event => { //lissen to the install event
    event.waitUntil(
        caches.open(currentCacheName)
        .then(cache => {
            return cache.addAll(casheContent);
        })
    );
});

this.addEventListener('fetch', event => { // if the browser asks for a page firrst chech te chace
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request)
                .then(response => {
                    return caches.open(currentCacheName)
                        .then(cache => {
                            //cash all svg's
                            if (isGetSvgRequest(event.request)) {
                                cache.put(event.request, response.clone());
                            }
                            return response;
                        });
                })
        })
    )
});

this.addEventListener('activate', event => { // lissen to the acitvate 
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                .filter(cacheName => (cacheName.startsWith('ll-app-')))
                .filter(cacheName => (cacheName !== currentCacheName))
                .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});


function isGetSvgRequest(request) {
    return (
        request.method === 'GET' &&
        request.url.includes('.svg')
    );
};


function isGetPngRequest(request) {
    return (
        request.method === 'GET' &&
        request.headers.get('Accept').contains('image/svg+xml')
    );
};
