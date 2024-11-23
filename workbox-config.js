module.exports = {
    globDirectory: 'build/',
    globPatterns: [
      '**/*.{html,js,css,png,jpg,jpeg,gif,svg,woff2,woff,eot,ttf,otf,json}'
    ],
    swDest: 'build/service-worker.js',
    clientsClaim: true,
    skipWaiting: true,
  };