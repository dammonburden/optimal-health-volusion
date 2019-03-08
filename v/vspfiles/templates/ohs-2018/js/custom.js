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
else if (thisPageURL.indexOf('register') > -1) {
thisPageSlug = 'register'; }
else if ((thisPageURL.indexOf('help.asp') > -1) || (thisPageURL.indexOf('help.html') > -1)) {
thisPageSlug = 'help'; }
else if ((thisPageURL.indexOf('help_answer') > -1) || (thisPageURL.indexOf('help-article') > -1)) {
thisPageSlug = 'help-article'; }
else if (thisPageURL.indexOf('myaccount') > -1) {
thisPageSlug = 'myaccount'; }
else if (thisPageURL.indexOf('wishlist') > -1) {
thisPageSlug = 'wishlist'; }
else if ((thisPageURL.indexOf('productdetails.asp') > -1) || (thisPageURL.indexOf('-p/') > -1) || (thisPageURL.indexOf('_p/') > -1) || (thisPageURL.indexOf('product-detail') > -1)) {
thisPageSlug = 'product-detail'; }
else {
thisPageSlug = 'other';
}
// Main Navigation ----------------------------------------------
// Cart icon when it has items
if ($('.cart-summary__count').length ) {
    setTimeout(function () {
        var cartCount = parseInt($('.cart-summary__count').text());
        if (cartCount > 0) {
            $('.cartLink').addClass('cartLink--full');
        }
    }, 1000);
}
// Menu Toggle
$('[rel="menu-toggle"]').click(function(event) {
    event.preventDefault;
    $('.ohs-main-nav').toggleClass('ohs-header--menu-open');
});
// Search Toggle
$('[rel="search-toggle"]').click(function(event) {
    event.preventDefault;
    var isOpen = $('.ohs-header').hasClass('ohs-header--search-open');
    //console.log('isOpen:'+isOpen);
    $('.ohs-header').toggleClass('ohs-header--search-open');
    if (!isOpen) {
        $('#searchInput').focus();
    }
});
// Search Filter Toggle
$('.refinement_category_section .find_by_category_text').click(function(event) {
    event.preventDefault;
    $(this).parent('.refinement_category_section').toggleClass('refinement_category_section--open');
});

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
	$('img[src*="heading_login.gif"]').after('<div class="article-head"><div class="breadcrumb"><a href="/">Home</a> &gt; <a href="/myaccount.asp">My Account</a></div><h1>Login</h1></div>').remove();
    $('a[href*="AccountSettings"]').addClass('cta-button');
    $('img[src*="btn_Continue"]').replaceWith('Continue');
}
// Regstration page ----------------------------------------------
if (thisPageSlug == 'register') {
    $('td').removeAttr('nowrap');

}
// Product Detail page -------------------------------------------
if (thisPageSlug == 'product-detail') {
    $('.vCSS_breadcrumb_td b').append( $('[itemprop="name"]').text() );
    $('.vCSS_breadcrumb_td b').html(function (i, html) {
        return html.replace(/&nbsp;/g, '');
    });
    $('[itemprop="manufacturer"]').parent().addClass('product_photo_ctr');
    // Top BR causing too much space above breadcrumb
    $('img[src*="clear1x1.gif"]').next('br').remove();
}
// Category List & Search Results --------------------------------
if ((thisPageSlug == 'category-list') | (thisPageSlug == 'search-results')) {
    // Remove extra containers on autoship and other unnecessary tags
    $('.v-product-grid').find('font').contents().unwrap();
    $('.v-product-grid').find('b').contents().unwrap();
    $('.v-product-grid p').each(function() {
        var $this = $(this);
        if($this.html().replace(/\s|&nbsp;/g, '').length == 0)
            $this.remove();
    });
}
// Category List  ------------------------------------------------
if (thisPageSlug == 'category-list') {
    // Breadcrumb class
    $('#content_area').children().eq(-2).children().children().eq(0).addClass('breadcrumb');
}
// Search Results  -----------------------------------------------
if (thisPageSlug == 'search-results') {
    // Breadcrumb class
    $('.matching_results_text').closest('td').find('b').addClass('breadcrumb');
}
// Help pages ----------------------------------------------------
if (thisPageSlug == 'help') {
    $('img[src*="heading_help.gif"]').replaceWith('<div class="article-head"><div class="breadcrumb"><a href="/">Home</a> &gt; <a href="/help.asp">Site Help & FAQ</a></div><h1>Site Help & FAQ</h1></div>');
}
if (thisPageSlug == 'help-article') {
    $('img[src*="heading_help.gif"]').remove();
}
// Wishlist Admin ------------------------------------------------
if (thisPageSlug == 'wishlist') {
    $('img[src*="heading_wishlist.gif"]').replaceWith('<div class="article-head"><div class="breadcrumb"><a href="/">Home</a> &gt; <a href="/myaccount.asp">My Account</a> &gt; <a href="/wishlist.asp">Wishlist</a></div><h1>My Wishlist</h1></div>');
    //$('.page-wishlist .v65-productDisplay .v65-productDisplay tbody tr:nth-child(6n+1)').addClass('wtf');
    //$('.page-wishlist .v65-productDisplay .v65-productDisplay tbody tr:nth-child(6n+7)').addClass('wtf');
}

// Remove excessive image headers
var imgHead = 0;
imgHead = $('img[src*="heading_aboutus.gif"]').length;
if (imgHead) {
    $('img[src*="heading_aboutus.gif"]').remove();
    $('#content_area br').first().remove();
}
imgHead = $('img[src*="heading_MyAccount.gif"]').length;
if (imgHead) {
    $('img[src*="heading_MyAccount.gif"]').remove();
    $('#content_area br').first().remove();
}


}); // end of document.ready
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