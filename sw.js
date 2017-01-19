'use strict';

const cacheName = 'v3'
const cacheFiles = [
	'./',
	'./index.html',
	'https://fonts.googleapis.com/icon?family=Material+Icons',
	'https://fonts.googleapis.com/css?family=Roboto+Slab',
	'./dist/style.css',
	'./dist/build.js',
	'./dist/logo.png'
]

// Cache files when SW is installed
self.addEventListener('install', e => {
	console.log('[ServiceWorker] installed')
	e.waitUntil(
		caches.open(cacheName).then( cache => {
			console.log('[ServiceWorker] caching cacheFiles')
			return cache.addAll(cacheFiles)
		})
	)
})

// Remove old unused files from cache
self.addEventListener('activate', e => {
	console.log('[ServiceWorker] activated')
	e.waitUntil (
		caches.keys().then( cacheNames => {
			return Promise.all(cacheNames.map(thisCacheName => {
				if (thisCacheName !== cacheName) {
					console.log('[ServiceWorker] remove cached files from ' + thisCacheName)
					return caches.delete(thisCacheName)
				}
			}))
		})
	)
})

// Check if file is in cache e return it before fetching from network
self.addEventListener('fetch', e => {
	e.respondWith(
		caches.match(e.request)
			.then( response => {
				if (response) {
					console.log('[ServiceWorker] Found in cache', e.request.url)
					return response
				}

				let resquestClone = e.request.clone()

				fetch(resquestClone)
					.then( response => {
						if (!response) {
							console.log('[ServiceWorker] No response from the fetch')
							return response
						}

						let responseClone = response.clone()

						caches.open(cacheName).then( cache => {
							cache.put(e.request, responseClone)
							return response
						})
					})
					.catch( err => {
						console.log('[ServiceWorker] Error fetching & caching new data', err)
					})
			})
	)
})