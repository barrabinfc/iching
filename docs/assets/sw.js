/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("/iching/assets/wb-assets/workbox-v3.4.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "/iching/assets/wb-assets/workbox-v3.4.1"});

importScripts(
  "/iching/assets/wb-assets/precache-manifest.5af2f85a4b1cf2aab504e3da92e8925e.js"
);

workbox.core.setCacheNameDetails({prefix: "iching"});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute("/iching//");
