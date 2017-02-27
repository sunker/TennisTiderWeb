 const _url = Symbol('url'),
     q = require('q'),
     request = require('request');

 module.exports = class BaseClient {
     constructor(url) {

         this[_url] = url;
     }

     get url() {
         return this[_url];
     }

     requestUrl() {
         const defer = q.defer();
         request(this[_url], function (error, response, html) {
             if (!error) {
                 return defer.resolve(html);
             } else {
                 return defer.reject(error);
             }
         });

         return defer.promise;
     };
 };