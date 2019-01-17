$(document).ready(function(){

$('body').addClass('page-catalog');

var selectedProductsArray = []; 

// Initialize Product List
$('.v-product').each(function(index) {
	var productCode = $(this).find('.v-product__add-to-cart').parent('a').attr('href');

	if (typeof productCode == 'undefined') {
		$(this).remove();
	} else {
		productCode = productCode.replace('/ShoppingCart.asp?ProductCode=','');

		// Change Button Text
		$(this).find('.v-product__add-to-cart').parent('a').replaceWith('<button class="cta-button cta-button--disabled" rel="cat-update-button" data-productcode="'+productCode+'">Add</button>');

		// Add Qty Box to each product with 0 in it
		$(this).find('.cta-button').before('<div class="qty"><input class="product-qty" type="text" value="0" data-lastvalue="0" id="productQty'+productCode+'" /></div>');

	}
});

// On change
$('.product-qty').keyup(function() {
	var initialQuantity = $(this).attr('data-lastvalue');
    var productQuantity = $(this).val(),
    	productQuantity = parseInt(productQuantity);

	// Update button
	if ( productQuantity > 0 ) {
		$(this).parent().next('.cta-button').removeClass('cta-button--disabled');
		if (initialQuantity > 0) {
			$(this).parent().next('.cta-button').text('Update');
		}
	} else {
		if (initialQuantity > 0) {
			$(this).parent().next('.cta-button').text('Update');
			$(this).parent().next('.cta-button').removeClass('cta-button--disabled');
		} else {
			$(this).parent().next('.cta-button').addClass('cta-button--disabled');
			$(this).parent().next('.cta-button').text('Add');
		}
	}
	$(this).attr('data-lastvalue',productQuantity);
});

// On Click
$('[rel="cat-update-button"]').click(function(event) {
    event.preventDefault();
    var productCode = $(this).attr('data-productcode'),
	    productQuantity = $('#productQty'+productCode).val();

	// Update selected items & qty list
	updateProductArray(productCode,productQuantity);
	$(this).addClass('cta-button--disabled').text('Add');
});

function updateProductArray(productCode,productQty) {
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
		// Else Add the product in array
		selectedProductsArray.push(currentProduct);
	}

	// Update the visual list
	var selectedProductsHTML = '',
		selectedProductsURL = '';
	$.each(selectedProductsArray, function (index, value) {
		selectedProductsHTML += value.id+'--'+value.qty+'<br>';
		selectedProductsURL += 'ProductCode='+value.id+'&qty.'+value.id+'='+value.qty+'&';
	});
	if (selectedProductsHTML) {
		$('.catalog-selections .results').html(selectedProductsHTML);
		$('#catalogCartButton').html('<a class="cta-button" href="/ShoppingCart.asp?'+selectedProductsURL+'">Add All To Cart</a>');
	}
	
}

/*
var first_array = [{ id: 619587047874, qty: 5, name: '5 items' },{ id: 645871744020, qty: 10, name: '10 items' },{ id: 645871744075, qty: 3, name: '3 items'}]; 
var second_array = new Array();  // Empty array for our use.

$.each(first_array, function (index, value) {
      second_array.push({name: value.name,  id:  value.id});
}); // Here I just Interchanged the location of the objects.
$.each(second_array, function (index, value) {
    console.log('name: '+value.name +' and id: '+ value.id);
}); // Here I just Interchanged the location of the objects.

// Add an item to array
var newstuff = {};
newstuff.id = 619587047874;
newstuff.qty = 5;
newstuff.name = 'newstuff';
second_array.push(newstuff);

$.each(second_array, function (index, value) {
    console.log('2: name: '+value.name +' and id: '+ value.id);
}); // Here I just Interchanged the location of the objects.
*/















/*

/ShoppingCart.asp?ProductCode=619587047874&qty.619587047874=5&ProductCode=619587047768&qty.619587047768=10&

/ShoppingCart.asp?ProductCode=Item1&qty.Item1=5&ProductCode=Item2&qty.item2=10

/ShoppingCart.asp?ProductCode=619587047874&qty.619587047874=5&ProductCode=619587047874&qty.619587047874=5&ProductCode=619587047768&qty.619587047768=10&

*/


});