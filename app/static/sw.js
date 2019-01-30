importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/012eee83654cb9637149.js",
    "revision": "aaf9489871cf686a318384aca6b94710"
  },
  {
    "url": "/_nuxt/092a3f8ca304dd7b578a.js",
    "revision": "aa05e99c5f69d4518bda2ae5367ff552"
  },
  {
    "url": "/_nuxt/348c76ddc33f93e1e336.js",
    "revision": "15c6131c82a595d61505e5979e25f8ce"
  },
  {
    "url": "/_nuxt/5ab022bb43ecbd236de9.js",
    "revision": "67ba712480214ef83cc4193074c8915c"
  },
  {
    "url": "/_nuxt/7b39bb03859d14785b0f.js",
    "revision": "53c4018c4255f46bd9e5073aebe2fc4b"
  },
  {
    "url": "/_nuxt/863b80cad00fe5fe5253.js",
    "revision": "6aa82c8baf3c4d9c6c46ac7aa2c6cf7b"
  },
  {
    "url": "/_nuxt/9b8ef41b0af35627d373.js",
    "revision": "c4ac4f2cf0cac400c25d839e923030b1"
  },
  {
    "url": "/_nuxt/ad8e06d80c2bcd69a530.js",
    "revision": "fe6aa8ec2e78474f8a9a62d3a41d9f68"
  },
  {
    "url": "/_nuxt/e8ae8dbaacb2112ca38f.js",
    "revision": "0f97de5f6cf753401d6cdd67eacafea8"
  },
  {
    "url": "/_nuxt/ea2d42aa1f09b583b409.js",
    "revision": "f597ddc5f70bcc2512290b872a1822bf"
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
