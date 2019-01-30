importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/35d7bb69d1f86a62452f.js",
    "revision": "f6cff2afca505b905ae185e02d8843b8"
  },
  {
    "url": "/_nuxt/8cac4f21ee183a0d9375.js",
    "revision": "4648c8798c6842ef104abfa2d4e7101f"
  },
  {
    "url": "/_nuxt/a69895bff131a6938a81.js",
    "revision": "33c4c56207b4bc24b68efd3b8bce76a5"
  },
  {
    "url": "/_nuxt/b7a16faf4c5bdb047a15.js",
    "revision": "b3ab95bb833bfa0a3ee56ee070d76c58"
  },
  {
    "url": "/_nuxt/c4a4cde3822109a1d7ec.js",
    "revision": "19f3f37fbfff5ae8dd9a45e04e711cc2"
  },
  {
    "url": "/_nuxt/d1adf67ade83f8ce9cfa.js",
    "revision": "bfc7e1fe20891728337478b4c98139f7"
  },
  {
    "url": "/_nuxt/d2f9a3647123354c0d33.js",
    "revision": "97228e1618fd0ea0a7e3b34974e92f40"
  },
  {
    "url": "/_nuxt/e0e5933bc3462c60fad5.js",
    "revision": "0304b6868ab8cb2ef592f2381d6d00e8"
  },
  {
    "url": "/_nuxt/e0e7ebd34160a75fffcb.js",
    "revision": "bf64e1ab53e5490fbdfe89dbdb328e63"
  },
  {
    "url": "/_nuxt/f873f585c4e303145b0f.js",
    "revision": "dcce3326eace67093f8800ce22863714"
  }
], {
  "cacheId": "src",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
