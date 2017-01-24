
 String.prototype.h2Wrap = function () {
     return '<h2>' + this + '</h2>';
 };

 String.prototype.brAppend = function () {
     return this + '<br />';
 };

 String.prototype.strongWrap = function () {
     return '<strong>' + this + '</strong>';
 };
 
 String.prototype.pWrap = function () {
     return '<p>' + this + '</p>';
 };
 
 String.prototype.embedLink = function (linkText) {
     return ' <a href="' + this + '">' + linkText + '</a>';
 };