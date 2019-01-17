$(document).ready(function(){

// Global Page Variables
// match in template.html when updated
var thisPageURL = window.location.href.toLowerCase(),
	thisPageSlug = '';

if (thisPageURL.indexOf('login') > -1) {
thisPageSlug = 'login'; }
else if (thisPageURL.indexOf('reviewnew.asp') > -1) {
thisPageSlug = 'new-review'; }
else if (thisPageURL.indexOf('searchresults.asp') > -1) {
thisPageSlug = 'search-results'; }
else if (thisPageURL.indexOf('shoppingcart') > -1) {
thisPageSlug = 'cart'; }
else if (thisPageURL.indexOf('one-page-checkout') > -1) {
thisPageSlug = 'checkout'; }
else if (thisPageURL.indexOf('orderfinished') > -1) {
thisPageSlug = 'order-confirmation'; }
else if ((thisPageURL.indexOf('-s/') > -1) || (thisPageURL.indexOf('_s/') > -1)) {
thisPageSlug = 'category-list'; }
else if ((thisPageURL.indexOf('articles.asp') > -1) || (thisPageURL.indexOf('-a/') > -1) || (thisPageURL.indexOf('_a/') > -1)) {
thisPageSlug = 'article'; }
else if ((thisPageURL.indexOf('productdetails.asp') > -1) || (thisPageURL.indexOf('-p/') > -1) || (thisPageURL.indexOf('_p/') > -1)) {
thisPageSlug = 'product-detail'; }
else {
thisPageSlug = 'other';
}
// Cart page ----------------------------------------------------
if (thisPageSlug == 'cart') {
    var HPClientID = getCookie('HPClientID');
	if (HPClientID) {
        // Show Doc Info on page. Populate on checkout page
        $('#v65-cart-table').before('<div class="referral-doctor-alert">Code: '+HPClientID+'</div>');
		//$('#v65-cart-coupon-entry-details-input').val(HPClientID);
	}
}
// Checkout page ----------------------------------------------------
if (thisPageSlug == 'checkout') {
	$('#table_checkout_cart0 br').remove();
	$('#v65-onepage-payment-details-parent-table br').remove();
    $('.referral-auto-label').parent('td').parent('tr').addClass('hidden-referral-code');

    var HPClientID = getCookie('HPClientID');
    if (HPClientID) {
        // Populate HDYHAU field
        $('[name="Customers.Custom_Field_Howdidyouabo"]').val(HPClientID);
        // Populate hidden referral code
        $('[name="Orders.Custom_Field_referralcodeaut"]').val(HPClientID);
        $('#v65-onepage-ContentTable').before('<div class="referral-doctor-alert">Code: '+HPClientID+'</div>');
    }
}
// Login page ----------------------------------------------------
if (thisPageSlug == 'login') {
	$('img[src*="heading_login.gif"]').after('<h1>Login</h1>').hide();
}

});
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
var createCookie = function(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}