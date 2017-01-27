 const _ = require('underscore'),
     HtmlMailBuilder = require('./HtmlMailBuilder');
 const _slots = Symbol('slots');
 const _mailAddress = Symbol('mailAddress');
 module.exports = class Mail {
     constructor(slots, mailAddress, isWeeklyReport) {
         this[_slots] = slots;
         this[_mailAddress] = mailAddress;
         this.htmlMailBuilder = new HtmlMailBuilder(slots);
         this.buildHtmlText();
         this.subject = isWeeklyReport ? 'Veckans tennistider' : (this[_slots].length > 1 ? 'Nya tennistider' : 'Ny tennistid');
     }

     get from() {
         return 'tennistider@gmail.com';
     }

     get to() {
         return this[_mailAddress]; // + ';johan.gunnarsson.e@gmail.com ';
     }

     get html() {
         return this.htmlMailBuilder.buildHtmlString();
     }

     toString() {
         return this[_startTime].toFixed(2).toString() + '-' + this[_endTime].toFixed(2).toString();
     }
 };