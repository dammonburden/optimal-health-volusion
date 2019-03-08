$(document).ready(function(){

// Initialize Page
$('body').addClass('page-catalog');
// Determine if we are on Dev or Production
var siteDomain = document.domain;
if (siteDomain.indexOf('optimalhealthsystems') >= 0) {
	formSubmitUrl = 'https://apps.optimalhealthsystems.com/catalog-tablet/catalog_send.php';
} else {
	formSubmitUrl = 'https://apps.optimalhealthsystems.com/catalog-tablet/catalog_send_DEV.php';
}
// Remove Breadcrumb
$('#content_area').children().eq(-2).children().children().eq(0).remove();
//navFade();

var selectedProductsArray = [];

// Get HP from url - #hpid=1234&hpemail=xyz%40abc.com
var HPClientID = getHashVars()['code'],
	HPEmailAddress = getHashVars()['email'],
	HPEmailAddress = decodeURIComponent(HPEmailAddress);

if (HPClientID) {
	$('.ohs-header-logo').after('<div class="hp-info-header"><strong>ID: '+HPClientID+'</strong><em>'+HPEmailAddress+'</em></div>');	
	$('#providerEmail').val(HPEmailAddress);
	// Show Page
	$('.search_results_section').show();
	$('.catalog-selection-summary').show();
} else {
	$('.search_results_section').hide();
	$('.catalog-selection-summary').hide();
	$('#content_area').append('<div class="no-hp-error"><h2>No Healthcare Provider Provided</div>');
}

// Initialize Product List
$('.v-product').each(function(index) {
	var productCode = $(this).find('.v-product__add-to-cart').parent('a').attr('href');

	if (typeof productCode == 'undefined') {
		$(this).remove();
	} else {
		productCode = productCode.replace('/ShoppingCart.asp?ProductCode=','');

		var productName = $(this).find('.v-product__title').text();
		productName = $.trim(productName);
		productAttrHTML = 'data-productcode="'+productCode+'" data-productname="'+productName+'"';

		// Add Category filter tag
		if (productName.indexOf('Essential') == 0) {
			$(this).attr('data-filter','harris');
		} else if (productName.indexOf('Opti-') == 0) {
			$(this).attr('data-filter','brimhall');
		}

		// Hide Button
		$(this).find('.v-product__add-to-cart').parent('a').hide();

		// Add + - & Qty
		buttonHTML = '';
		buttonHTML += '<button class="cta-button" rel="cat-update-button" data-action="minus" '+productAttrHTML+'>-</button>';
		buttonHTML += '<div class="product-qty" id="productQty'+productCode+'">0</div>';
		buttonHTML += '<button class="cta-button" rel="cat-update-button" data-action="plus" '+productAttrHTML+'>+</button>';
		$(this).prepend('<div class="v-product__qty">'+buttonHTML+'</div>');

	}
});

// Add Product Filters & Swipe ---------------------------------------------------------------------
	//Harris - product name starts with “Essential”
	//Dr. Brimhall - product name starts with “Opti-”
var productsHTMLHarris = '',
	productsHTMLBrimhall = '';
$('.v-product').each(function(index) {
	var productFilter = $(this).attr('data-filter');
	if (productFilter) {
		if (productFilter == 'harris') {
			productsHTMLHarris += '<div class="v-product">'+$(this).html()+'</div>';
		}
		if (productFilter == 'brimhall') {
			productsHTMLBrimhall += '<div class="v-product">'+$(this).html()+'</div>';
		}
	}
});
productsHTMLHarris = '<div class="v-product-grid">'+productsHTMLHarris+'</div>';
productsHTMLBrimhall = '<div class="v-product-grid">'+productsHTMLBrimhall+'</div>';
productsHTMLAll = '<div class="v-product-grid">'+$('.v-product-grid').html()+'</div>';
$('.v-product-grid').remove();

$('.v65-productDisplay td').prepend('<div class="product-category-slide"><div class="swiper-pagination"></div><div class="swiper-wrapper"><div class="swiper-slide">'+productsHTMLAll+'</div><div class="swiper-slide">'+productsHTMLHarris+'</div><div class="swiper-slide">'+productsHTMLBrimhall+'</div></div></div></div>');

var swiper = new Swiper('.product-category-slide', {
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    threshold: 4,
    renderBullet: function (index, className) {
    	switch(index) {
		case 0:
	      return '<span class="' + className + '">All Products</span>';
	      break;
		case 1:
	      return '<span class="' + className + '">Dr. Marc Harris Essential</span>';
	      break;
		case 2:
	      return '<span class="' + className + '">Opti-Nutrient Dr. Brimhall</span>';
	      break;
	  }
    },
  },
});
swiper.on('slideChange', function () {
	window.scroll({
		top: 0, 
		behavior: 'smooth' 
	});
});


/*
// Float selected items
function navFade(){
	var y = $(document).scrollTop();
	var t = $('#content_area').offset().top;

	if (y > t) {
	    $('.catalog-selection-summary').addClass('sticky');
	} else {
	    $('.catalog-selection-summary').removeClass('sticky');
	}
}
// Scroll Functions
$(document).scroll(function () {
	navFade();
});
*/

// Add or Subtract Item
$('[rel="cat-update-button"]').click(function(event) {
    event.preventDefault();
	var action = $(this).attr('data-action');
    var productQuantity = $(this).siblings('.product-qty').text(),
    	productQuantity = parseInt(productQuantity);
    var productCode = $(this).attr('data-productcode'),
	    productName = $(this).attr('data-productname');
    	//console.log('action:'+action+' initialQuantity:'+initialQuantity+' productQuantity:'+productQuantity);

    // Add Or Subtract Product
    if ( action == 'plus' ) {
    	// Add
    	productQuantity = productQuantity + 1;
    	$(this).siblings('.product-qty').text(productQuantity);
	} else {
		// Check for 0 then subtract
		if (productQuantity > 0) {
	    	productQuantity = productQuantity - 1;
	    	$(this).siblings('.product-qty').text(productQuantity);
		}
	}
	// Update selected items & qty list
	updateProductArray(productCode,productQuantity,productName);
});
// Validate form when exit
$('#customerEmail').focusout(function(event) {
	validateForm();
});
$('#providerEmail').focusout(function(event) {
	validateForm();
});
// Send Email Button Click
$('[rel="cat-send-email"]').click(function(event) {
    event.preventDefault();
	
	validateForm('button');
	var formError = $('.error-text').text();

    // Get customer & content from form
    var PatientEmailAddress = $('#customerEmail').val(),
	    PatientCartUrl = $('#customerCartUrl').val(),
	    ProviderEmail = $('#providerEmail').val();

	// If theres an error display it
	if (!formError) {
	// success
	    // Change Button to Loading
	    $(this).text('Loading');
		// Post to send email
		$.ajax({
		  type: 'POST',
		  url: formSubmitUrl,
		  data: {
		    'PatientCartUrl': PatientCartUrl,
		    'PatientEmailAddress': PatientEmailAddress,
		    'HPClientID': HPClientID,
		    'HPEmailAddress': ProviderEmail
		  },
		  success: function(response) { 
	      	//console.log(response);
	      	// Show Alert
	      	$('<div class="alert alert--success">Email Sent.</div>').insertBefore('#catalogActions').delay(3000).fadeOut();
	      	// cover page
	      	$('<div class="page-overlay">&nbsp;</div>').insertBefore('#content_area').delay(3000).fadeOut();
	      	// Reset Page
	      	resetPage();
	      },
		  error: function (jqXHR, textStatus, errorThrown) {
		   //console.log(jqXHR.responseText);
		   $('#catalogActions').html(jqXHR.responseText);
		  },
	      complete: function (response) {
	      	//console.log(response);
	      }
		});
	}

});

function resetPage(action) {
	// Clear patient email
	$('#customerEmail').val('');
	// Clear indv products in list
	$('.product-qty').html('0');
	// Clear products in form
	$('#customerCartUrl').val('');
	// Clear product list in sidebar
	$('#productList').html('No items selected.');
	// Reset Button
	$('[rel="cat-send-email"]').addClass('cta-button--disabled');
}
function validateForm(action) {
	$('#catalogActions').removeClass('error');
	$('.error-text').remove();

    // Get customer & content from form
    var PatientEmailAddress = $('#customerEmail').val(),
	    PatientCartUrl = $('#customerCartUrl').val(),
	    ProviderEmail = $('#providerEmail').val(),
	    Error = '';

	// check for cart url
	if (!PatientCartUrl && action == 'button') {
		Error = 'No products selected';
	}

	if (ProviderEmail) {
		// check if email is valid
		if (!isValidEmailAddress(ProviderEmail)) {
			// Invalid Email
			Error = 'Invalid Email';
		}
	} else {
		// No Email
		Error = 'Provider Email Required';
	}

	if (PatientEmailAddress) {
		// check if email is valid
		if (!isValidEmailAddress(PatientEmailAddress)) {
			// Invalid Email
			Error = 'Invalid Email';
		}
	}// else {
		// No Email
		//Error = 'Required';
	//}

	// If theres an error display it
	if (Error) {
		$('#catalogActions').addClass('error');
		$('#customerEmail').after('<span class="error-text">'+Error+'</span>');
	} else {
		$('.cta-button').removeClass('cta-button--disabled');
	}
}
function updateProductArray(productCode,productQty,productName) {
	// Is the product already in list
	var productInList = false;
	for (var i = 0; i < selectedProductsArray.length; i++) {
	   if (selectedProductsArray[i].id == productCode) {
	        productInList = true;
	    }
	}
	var currentProduct = {};
		currentProduct.id = productCode;
		currentProduct.qty = productQty;
		currentProduct.productname = productName;

	if (productInList) {
		// Remove it from list
		selectedProductsArray = $.grep(selectedProductsArray, function(e){ 
		     return e.id != productCode; 
		});
		// Is the QTY > 0 if so add new qty in array
		if (productQty > 0) {
			selectedProductsArray.push(currentProduct);
		}
	} else {
		// Else add the product in array
		// Is the QTY > 0 if so add in array
		if (productQty > 0) {
			selectedProductsArray.push(currentProduct);
		}
	}

	// Update the visual list
	var selectedProductsHTML = '',
		selectedProductsURL = '';

	// Sort By Product Name
	selectedProductsArray = selectedProductsArray.sort(function(a, b){
	    var nameA=a.productname.toLowerCase(), nameB=b.productname.toLowerCase()
	    if (nameA < nameB)
	        return -1 
	    if (nameA > nameB)
	        return 1
	    return 0
	});

	$.each(selectedProductsArray, function (index, value) {
		selectedProductsHTML += '<div class="item">';
		selectedProductsHTML += '<span>'+value.qty+'</span>';
		selectedProductsHTML += '<strong>'+value.productname+'</strong>';
		selectedProductsHTML += '</div>';
		selectedProductsURL += 'ProductCode='+value.id+'&qty.'+value.id+'='+value.qty+'&';
	});
	selectedProductsURL += 'HPClientID='+HPClientID;

	if (selectedProductsHTML) {
		$('.catalog-selections .results').html(selectedProductsHTML);
		$('#customerCartUrl').val('/Articles.asp?ID=277&'+selectedProductsURL);
		$('#catalogActions .cta-button').removeClass('cta-button--disabled');
	} else {
		$('.catalog-selections .results').html('No items selected.');
	}
}

});

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
function getHashVars(aURL) {

	aURL = aURL || window.location.href;
	
	var vars = {};
	var hashes = aURL.slice(aURL.indexOf('#') + 1).split('&');

    for(var i = 0; i < hashes.length; i++) {
       var hash = hashes[i].split('=');
      
       if(hash.length > 1) {
    	   vars[hash[0]] = hash[1];
       } else {
     	  vars[hash[0]] = null;
       }      
    }

    return vars;
}
function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
}