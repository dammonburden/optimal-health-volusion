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

// Add nav to header
var topNav = '<a rel="open-selected-products" class="cart-button"><i class="fal fa-prescription-bottle"></i><span class="cart-count">0</span></a>';//
	topNav += '<a href="#" rel="tool-menu-toggle" data-action="select-tests" class="tests-button"><i class="fal fa-clipboard-list-check"></i></a>';
	topNav += '<a href="#" rel="tool-menu-toggle" data-action="send-emails" class="send-emails-button"><i class="fal fa-envelope"></i></a>';
$('.ohs-header-tools').html(topNav);
$('[rel="open-selected-products"]').click(function(event) {
    event.preventDefault();
	$('[rel="tool-menu-toggle"]').removeClass('selected');
	$('.catalog--tool').hide();
	$('body').removeClass('modal-open');
	swiper.slideTo(3);
});
$('[rel="tool-menu-toggle"]').click(function(event) {
    event.preventDefault();
	var isOpen = $(this).hasClass('selected');
		action = $(this).attr('data-action');

	// Close all screens
	$('[rel="tool-menu-toggle"]').removeClass('selected');
	$('.catalog--tool').hide();
	$('body').removeClass('modal-open');

	if (!isOpen) {
		// open it
		$(this).addClass('selected');
		$('body').addClass('modal-open');
    	switch(action) {
		case 'send-emails':
			$('.catalog--send-emails').show();
		    break;
		case 'select-tests':
			$('.catalog--select-tests').show();
			break;
		}
	}
});

var selectedProductsArray = [];

// Get HP from url - #hpid=1234&hpemail=xyz%40abc.com
var HPClientID = getHashVars()['code'],
	HPEmailAddress = getHashVars()['email'],
	HPEmailAddress = decodeURIComponent(HPEmailAddress);
	if (HPEmailAddress == 'undefined') { HPEmailAddress = ''; }

if (HPClientID) {
	//$('.ohs-header-logo').after('<div class="hp-info-header"><strong>ID: '+HPClientID+'</strong><em>'+HPEmailAddress+'</em></div>');	
	$('.page-catalog').addClass('tools-active');
	$('.provider-code').text(HPClientID);
	if (HPEmailAddress) { $('#providerEmail').val(HPEmailAddress); }
	// Show Page
	$('.search_results_section').show();
	$('.catalog--tools').show();
	$('.ohs-header-tools').show();

} else {
	$('.search_results_section').hide();
	$('#content_area').append('<div class="no-hp-error"><h2>No Healthcare Professional Provided</div>');
	$('.catalog--tools').hide();
	$('.ohs-header-tools').hide();
	$('.ohs-footer-copyright').hide();
}

// Initialize Product List
$('.v-product').each(function(index) {
	var productCode = $(this).find('.v-product__add-to-cart').parent('a').attr('href');
	
	$(this).find('a').attr('target','_blank');

	if (typeof productCode == 'undefined') {
		$(this).remove();
	} else {
		productCode = productCode.replace('/ShoppingCart.asp?ProductCode=','');

		var productName = $(this).find('.v-product__title').text();
		productName = $.trim(productName);
		productAttrHTML = 'data-productcode="'+productCode+'" data-productname="'+productName+'"';

		// Add code to v-product
		$(this).attr('data-productid',productCode);

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
		// remove html from desc
		var productDesc = $(this).find('.v-product__desc').text();
		if (productDesc) {
			$(this).find('.v-product__desc').html(productDesc);
			//$(this).find('.v-product__qty').append('<button class="product-desc-toggle-button" rel="product-desc-toggle"><i class="caret fal fa-angle-down"></i><i class="fal fa-info-circle"></i></button>');
			$(this).find('.v-product__qty').append('<button class="product-desc-toggle-button" rel="product-desc-toggle"><span></span></button>');
			//<div class="bmenu x7"><span class="btop"></span><span class="bmid"></span><span class="bbot"></span></div>
		}

	}
});

// Add Product Filters & Swipe ---------------------------------------------------------------------
	//Harris - product name starts with “Essential”
	//Dr. Brimhall - product name starts with “Opti-”
var productsHTMLHarris = '',
	productsHTMLBrimhall = '';
$('.v-product').each(function(index) {
	var productFilter = $(this).attr('data-filter'),
		productCode = $(this).attr('data-productid');
	if (productFilter) {
		if (productFilter == 'harris') {
			productsHTMLHarris += '<div class="v-product" data-productid="'+productCode+'">'+$(this).html()+'</div>';
		}
		if (productFilter == 'brimhall') {
			productsHTMLBrimhall += '<div class="v-product" data-productid="'+productCode+'">'+$(this).html()+'</div>';
		}
	}
});
productsHTMLHarris = '<div class="v-product-grid">'+productsHTMLHarris+'</div>';
productsHTMLBrimhall = '<div class="v-product-grid">'+productsHTMLBrimhall+'</div>';
productsHTMLAll = '<div class="v-product-grid">'+$('.v-product-grid').html()+'</div>';
productsHTMLSelected = '<div class="v-product-grid" id="selectedProductList"><div class="no-results-text">No items selected.</div></div>';
$('.v-product-grid').remove();

$('.v65-productDisplay td').prepend('<div class="product-category-slide"><div class="swiper-pagination"></div><div class="swiper-wrapper"><div class="swiper-slide">'+productsHTMLAll+'</div><div class="swiper-slide">'+productsHTMLHarris+'</div><div class="swiper-slide">'+productsHTMLBrimhall+'</div><div class="swiper-slide">'+productsHTMLSelected+'</div></div></div></div>');

var swiper = new Swiper('.product-category-slide', {
    touchEventsTarget: 'wrapper',
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    renderBullet: function (index, className) {
    	switch(index) {
		case 0:
	      return '<span class="' + className + '">All Products</span>';
	      break;
		case 1:
	      return '<span class="' + className + '">Dr. Harris Essential</span>';
	      break;
		case 2:
	      return '<span class="' + className + '">Dr. Brimhall Opti-Nutrient</span>';
	      break;
		case 3:
	      return '<span class="' + className + '">Selected (<em class="cart-count">0</em>)</span>';
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
// Move swiper-pagination
$('body').prepend( $('.swiper-pagination') );

// Product Description Toggle
$('[rel="product-desc-toggle"]').click(function(event) {
    event.preventDefault();
	// Update desc visibility
    $(this).closest('.v-product').toggleClass('show-description');
    // Update Icon
    $(this).closest('.v-product').find('.product-desc-toggle-button').toggleClass('active');
    //$(this).closest('.v-product').find('.caret').toggleClass('fa-angle-down').toggleClass('fa-angle-up');

});
// Selected Test Toggle
$('[rel="select-test-toggle"]').click(function(event) {
    event.preventDefault();
	var isSelected = $(this).hasClass('selected'),
		selectedTest = $(this).attr('data-test-id'),
		productList =  $(this).attr('data-test-products');

	if (isSelected) {
		// unselect it
		$(this).removeClass('selected');
		// Remove products
		updateProductArray('test-selection','remove',productList,0,'','');

	} else {
		// select it
		$(this).addClass('selected');
		// Update products
		updateProductArray('test-selection','add',productList,1,'','');

	}
});
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
    	if (productQuantity == 1) {
    		$(this).siblings('.product-qty').text(productQuantity);
    		// Add the product to selected list
			productObj = $(this).closest('.v-product');
			$(productObj).clone(true).appendTo( $('#selectedProductList') );
    		// Success Message
    	} else {
    		//update QTY on both
    		$('[data-productcode="'+productCode+'"').siblings('.product-qty').text(productQuantity);
    	}
		$('<div class="alert--success"><span>Added</span></div>').insertBefore('#pageWrapper').delay(1000).fadeOut();
	} else {
		// Check for 0 then subtract
		if (productQuantity > 0) {
	    	productQuantity = productQuantity - 1;
	    	$('[data-productcode="'+productCode+'"').siblings('.product-qty').text(productQuantity);
		}
	}

	// Update selected items & qty list
	updateProductArray('single','',productCode,productQuantity,productName);
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
	    ProviderEmail = $('#providerEmail').val(),
	    emailMessage = $('#message').val(),
	    emailProductList = $('.selected-item-list').html();
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
		    'HPEmailAddress': ProviderEmail,
		    'Message': emailMessage,
		    'Products': emailProductList
		  },
		  success: function(response) { 
	      	//console.log(response);
	      	// Show Alert
	      	$('<div class="alert alert--success alert--fullscreen"><span>Email Sent.</span></div>').insertBefore('#pageWrapper').delay(3000).fadeOut();
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
	$('[rel="cat-send-email"]').text('Send');
	// Clear patient email
	$('#customerEmail').val('');
	// Clear message
	$('#message').val('');
	// Clear indv products in list
	$('.product-qty').html('0');
	// Clear products in selected
	$('#selectedProductList').html('<div class="no-results-text">No items selected.</div>');
	// Clear counter
	$('.cart-count').html('0');
	// Clear products in form
	$('#customerCartUrl').val('');
	// Clear product list in sidebar
	$('#productList').html('No items selected.');
	// Reset Button
	$('[rel="cat-send-email"]').addClass('cta-button--disabled');
	// Reset sidebar list
	$('.selected-item-list').html('');
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
	//} else {
		// No Email
		//Error = 'Professional Email Required';
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
		$('.catalog-actions .cta-button').before('<span class="error-text">'+Error+'</span>');
	} else {
		$('.cta-button').removeClass('cta-button--disabled');
	}
}
function updateProductArray(type,action,productCode,productQty,productName) {
	var productInList = false,
		thisTestProducts = '',
		fullTestProductsArray = {},
		currentProduct = {},
		productObj = {};
// Update List -----------------------------------------------------------------------------
	// Is the update for a meth test?
	if (type == 'test-selection') {
		// break up products into array
		var selectedTestProducts = productCode.split('|');
		// are we adding or subtracting a test
		if (action == 'add') {
			// Add Products - check existing list first, then add if there are no existing.
			$.each( selectedTestProducts, function( key, thisProductCode ) {
				// Is the product already in list
				productInList = false;
				for (var i = 0; i < selectedProductsArray.length; i++) {
					if (selectedProductsArray[i].id == thisProductCode) {
						productInList = true;
					}
				}
				if (!productInList) {
					// Set up product data
					currentProduct.id = thisProductCode;
					currentProduct.qty = 1;
					productName = $('[data-productcode="'+thisProductCode+'"]').first().attr('data-productname');
					if (productName == undefined) {
						productName = 'Code: '+thisProductCode;
					}
					currentProduct.productname = productName;
					// Add to List
					selectedProductsArray.push(currentProduct);
					// Choose 1st .v-product, Mark as selected
		    		$('[data-productid="'+thisProductCode+'"]').first().addClass('selected-product');
		    		// Change QTY
		    		$('[data-productid="'+thisProductCode+'"] .product-qty').text('1');
		    		// Hide other instances of the product
		    		$('[data-productid="'+thisProductCode+'"]').hide();
		    		$('.selected-product').show();
					// Add to Tab
					productObj = $('[data-productid="'+thisProductCode+'"]');
					$(productObj).appendTo($('#selectedProductList'));
				}
				currentProduct = {};
			});
			thisTestProducts = $('.selected-test-products').text();
			thisTestProducts += '|'+productCode;
			$('.selected-test-products').text(thisTestProducts);
			$('<div class="alert--success"><span>Added</span></div>').insertBefore('#pageWrapper').delay(1000).fadeOut();
		} else {
		// Remove products
			// Remove from test list
			thisTestProducts = $('.selected-test-products').text();
			thisTestProducts = thisTestProducts.replace('|'+productCode,'');
			$('.selected-test-products').text(thisTestProducts);
			// Check if the products are included in other selected tests
			$.each( selectedTestProducts, function( key, thisProductCode ) {
				// Is the product in the TEST list
				productInList = false;
				for (var i = 0; i < fullTestProductsArray.length; i++) {
					if (fullTestProductsArray[i].id == thisProductCode) {
						productInList = true;
					}
				}
				// If not in testlist, remove from Selected Products List
				if (!productInList) {
					selectedProductsArray = $.grep(selectedProductsArray, function(e){ 
					     return e.id != thisProductCode; 
					});
				}

			});
		}
	} else {
		// Is the product already in list
		productInList = false;
		for (var i = 0; i < selectedProductsArray.length; i++) {
		   if (selectedProductsArray[i].id == productCode) {
		        productInList = true;
		    }
		}
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
	} //type
// Visualise List --------------------------------------------------------------------------
	// Update the visual list
	var selectedProductsHTML = '',
		selectedProductsURL = '',
		totalProducts = 0;

	// Sort By Product Name
	selectedProductsArray = selectedProductsArray.sort(function(a, b){
	    var nameA=a.productname.toLowerCase(), nameB=b.productname.toLowerCase()
	    if (nameA < nameB)
	        return -1 
	    if (nameA > nameB)
	        return 1
	    return 0
	});
	// Create List
	$.each(selectedProductsArray, function (index, value) {
		totalProducts += value.qty;
		selectedProductsHTML += '<div class="item">';
		selectedProductsHTML += '<span class="qty">'+value.qty+'</span>';
		selectedProductsHTML += '<span class="title">'+value.productname+'</span>';
		selectedProductsHTML += '<span class="code">'+value.id+'</span>';
		selectedProductsHTML += '</div>';
		selectedProductsURL += 'ProductCode='+value.id+'&qty.'+value.id+'='+value.qty+'&';
	});
	selectedProductsURL += 'HPClientID='+HPClientID;

	if (selectedProductsHTML) {
		//$('#selectedProductList').html(selectedProductsHTMLFull);
		$('.no-results-text').remove();
		$('.selected-item-list').html(selectedProductsHTML);
		$('#customerCartUrl').val('/Articles.asp?ID=277&'+selectedProductsURL);
		$('#catalogActions .cta-button').removeClass('cta-button--disabled');
		$('.cart-count').text(totalProducts);
	} else {
		$('#selectedProductList').html('<div class="no-results-text">No items selected.</div>');
		$('.cart-count').text('0');
		$('.selected-item-list').html('');
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