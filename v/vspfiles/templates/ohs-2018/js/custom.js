$(document).ready(function(){

// Global Page Variables
// match in template.html when updated
var thisPageURL = window.location.href.toLowerCase(),
	thisPageSlug = '';

if (thisPageURL.indexOf('login.asp') > -1) {
thisPageSlug = 'login'; }
else if (thisPageURL.indexOf('reviewnew.asp') > -1) {
thisPageSlug = 'new-review'; }
else if (thisPageURL.indexOf('searchresults.asp') > -1) {
thisPageSlug = 'search-results'; }
else if (thisPageURL.indexOf('shoppingcart') > -1) {
thisPageSlug = 'cart'; }
else if ((thisPageURL.indexOf('-s/') > -1) || (thisPageURL.indexOf('_s/') > -1)) {
thisPageSlug = 'category-list'; }
else if ((thisPageURL.indexOf('articles.asp') > -1) || (thisPageURL.indexOf('-a/') > -1) || (thisPageURL.indexOf('_a/') > -1)) {
thisPageSlug = 'article'; }
else if ((thisPageURL.indexOf('productdetails.asp') > -1) || (thisPageURL.indexOf('-p/') > -1) || (thisPageURL.indexOf('_p/') > -1)) {
thisPageSlug = 'product-detail'; }
else {
thisPageSlug = 'other';
}

});