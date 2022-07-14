console.log('global.ts');

// // All properties are optional
// configurePersistable(
//     {
//         storage: window.localStorage,
//         expireIn: 86400000,
//         removeOnExpiration: true,
//         stringify: false,
//         debugMode: true,
//     },
//     { delay: 200, fireImmediately: false }
// );
window.addEventListener('load', function () {
  console.log('===load');
});

window.addEventListener('resize', function () {
  console.log('===resixe');
});
