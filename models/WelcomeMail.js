 const _ = require('underscore'),
     HtmlMailBuilder = require('./HtmlMailBuilder');
 const _slots = Symbol('slots');
 const _mailAddress = Symbol('mailAddress');
 module.exports = class Mail {
     constructor(mailAddress) {
         this[_mailAddress] = mailAddress;
     }

     get from() {
         return 'tennistider@gmail.com';
     }

     get to() {
         return this[_mailAddress]; 
     }

     buildHtmlText() {
         return "<h1>Välkommen till Tennistider</h1><p>Din användarnamn är...</p>";
     }

     toString() {
         return this[_startTime].toFixed(2).toString() + '-' + this[_endTime].toFixed(2).toString();
     }
 };