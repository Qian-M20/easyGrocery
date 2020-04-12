var myCart = {};
var myProducts = [];


// caculate the size of shoping cart 
Object.size = function (obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

sliderInit();

/********************** for product description **********************/

String.prototype.trunc = function (n, useWordBoundary) {
    if (this.length <= n) {
        return this;
    }
    var subString = this.substr(0, n - 1);
    return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(' ')) : subString) + "&hellip;";
};

function sliderInit() {
    $('.bigSlider').slick({
        dots: true,
        infinite: true,
        fade: true,
        cssEase: 'linear',
        autoplay: true,
        autoplaySpeed: 3500,
        arrows: true
    });
}


function get_splash() {
    $('.hide_all').hide();
    $('#splash').fadeIn();

}


function getProductView(item) {


    var description = item.product_description.trunc (60, true);

    var content = ` <div class="cell large-3 medium-6">
                        <div class="grid-x">
                            <div class="thumnail large-12 medium-12 small-6">
                                <img src="${item.image_path}" alt="${item.product_name}">
                                <div class="card_wrapper" style="height: 6rem">
                                    <div class="itemName">${item.product_name}</div>
                                    <p class="itemDescription"> ${description} </p>
                                </div>
                            </div>
                            
                            <div class="productsInfo large-12 medium-12 small-6">
                                <div class="priceTag">$${item.avg_price} <div class="unitName" style="font-weight:lighter; font-size:0.6em; margin-left:0.5em;"> /${item.unit_name}</div> </div>
                                
                                <div class="numTag">
                                    <button class="plus" data-id="${item.id}">+</button>
                                    <p class="quantity quantity_${item.id}" data-id="${item.id}">1</p>
                                    <button class="minus" data-id="${item.id}">–</button>
                                </div>
                                <div class="addToCart" data-id=${item.id}>Add to Cart</div>
                            </div>
                        </div>
                    </div>
    `;
    return content;
}


function getProductsByDepartments(department_id) {

    $('.hide_all').hide();
    $('#products').fadeIn();
    $('.main-nav.nav#example-menu').addClass('faded');
    // alert(department_id);
    var getProducts = $.ajax({
        url: "services/get_products_by_department.php",
        type: "POST",
        data: {
            department_id: department_id
        },
        dataType: "json"
    });

    getProducts.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getProducts)" +
            textStatus);
    });

    getProducts.done(function (data) {
        // alert(data);
        var content = "";
        // in php, it's throwing back a string, the error number
        if (data.error.id == "0") {
            $.each(data.products, function (i, item) {
                // getProductView makes the output the same between get product by search and by department
                content += getProductView(item);
            });
        } else {
            alert("wrong");
        }
        $(".product_list").html(content);
    });

}


function getProductsBySearch(search) {
    $('.hide_all').hide();
    $('#products').fadeIn();
    // alert(department_id);
    var getProducts = $.ajax({
        url: "services/get_products_by_search.php",
        type: "POST",
        data: {
            search: search
        },
        dataType: "json"
    });

    getProducts.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getProducts-Search)" +
            textStatus);
    });

    getProducts.done(function (data) {
        // alert(data);
        var content = "";
        // in php, it's throwing back a string, the error number
        if (data.error.id == "0") {
            $.each(data.products, function (i, item) {
                // getProductView makes the output the same between get product by search and by department
                content += getProductView(item);
            });
        }
        $(".product_list").html(content);
    });

}


function get_departments() {
    $(".hide_all").hide();
    // alert("get_departments");

    var getDepartments = $.ajax({
        url: "services/get_departments.php",
        type: "POST",
        dataType: "json"
    });


    getDepartments.fail(function (jqXHR, textStatus) {
        alert("Something went Wrong! (getDepartments)" +
            textStatus);
    });

    getDepartments.done(function (data) {
        // alert(data);
        var content = "";
        // in php, it's throwing back a string, the error number
        if (data.error.id == "0") {
            $.each(data.departments, function (i, item) {
                content += `<li id="${item.name}" class="getProductsByDepartments cell" data-id="${item.id}"><a href="#">${item.name}</a></li>
                `;
            });
        } else {
            alert("wrong");
        }
        $(".department_list").html(content);
    });

    $("#splash").fadeIn();
}


function buildEmptyCart() {
    var content;
    content = `<h1>Your cart is empty</h1>`;
    $('.cart_data').html(content);
    $('.cart_data').addClass('emptyCart');

}


function buildCart() {

    var sub_total = 0.00;
    var content;
    var mainContent = ``;
    var subTotalContent = ``;

    // print the title of cart
    content = `<ul class="menu expanded" >
                    <li>Item</li>
                    <li>Quantity</li>
                    <li>Price</li>
                    <li>Ext.Price</li>
                </ul>
                <div class="main-cart"></div>
                <div class="subtotal"></div>
                `;

    // loop through cart to get the purchased item data
    $.each(myProducts, function (i, item) {
        var item_number = i + 1;
        var quantity = myCart[item.id];
        var extended_price = parseInt(quantity) * parseFloat(item.avg_price);
        var extendPrice = extended_price.toFixed(2);
        var avg_price = parseFloat(item.avg_price);
        var avgPrice = avg_price.toFixed(2);
        sub_total = sub_total + extended_price;

        mainContent += `<div class="grid-x cartDetail">
                        <div class="large-3 medium-3 cel cartImg">
                            <img src="${item.image_path}" alt="${item.product_name}">
                            <button class="remove1 cart_delete" data-id="${item.id}">✕ Remove Item</button>
                            <p class="itemName itemName1">${item.product_name}</p>
                        </div>
                        <p class="itemName itemName2">${item.product_name}</p>
                        <div class="large-3 medium-3  cel numTagWrapper">
                        <div class="numTag">
                            <button class="cart_plus" data-id="${item.id}">+</button>
                            <p class="cart_quantity_${item.id}" data-id="${item.id}">${quantity}</p>
                            <button class="cart_minus" data-id="${item.id}">–</button>
                        </div>
                        <button class="remove cart_delete" data-id="${item.id}">✕ Remove Item</button>
                        </div>
                        <div class="large-3 medium-3 cel">$${avgPrice}</div>
                        <div class="large-3 medium-3 cell total">$${extendPrice}</div>
                    </div>`;
        // $('.cart_wrapper').show();
    })

    // calculate the subtotal price
    var subTotal = sub_total.toFixed(2);
    var hst = subTotal * 0.13;
    var HST = hst.toFixed(2);
    var total = hst + sub_total;
    var TOTAL = total.toFixed(2);

    subTotalContent += `<div class="grid-x">
                            <div class="large-7  medium-7 small-5 cell"></div>
                            <div class="large-2 medium-2 small-3 cel">
                                Subtotal
                            </div>
                            <div class="large-2 medium-2 small-3 cel">$${subTotal}</div>
                            <div class="large-1 medium-1 small-1 cel"></div>
                        </div> 
                        <div class="grid-x">
                            <div class="large-7  medium-7 small-5 cell"></div>
                            <div class="large-2 medium-2 small-3 cel">
                                Hst.
                            </div>
                            <div class="large-2 medium-2 small-3 cel">$${HST}</div>
                            <div class="large-1 medium-1 small-1 cel"></div>
                        </div> 

                        <div class="grid-x totalPrice">
                            <div class="large-7  medium-7 small-5 cell"></div>
                            <div class="large-2 medium-2 small-3 cel">
                                Total
                            </div>
                            <div class="large-2 medium-2 small-3 cel">$${TOTAL}</div>
                            <div class="large-1 medium-1 small-1 cel"></div>
                        </div> 
                        
                        <div class="grid-x checkOutBtn">

                        <div class="large-8  medium-8 small5 cell"></div>
                        <div class="large-3 medium-3 small-6 cel checkOutBtnCell">
                            <input type="button" value="Checkout">
                        </div>
                        <div class="large-1 medium-1 small-1 cel"></div>
                        
                      </div>`;

    // output content in cart-data section 
    $('.cart_data').removeClass('emptyCart');
    $('.cart_data').html(content);
    $('.main-cart').html(mainContent);
    $('.subtotal').html(subTotalContent);

}


function getProductsByCart() {

    $('.hide_all').hide();
    $('#cart').fadeIn();

    var json = JSON.stringify(myCart);
    console.log(json);

    var getCart = $.ajax({
        url: "services/get_products_by_cart.php",
        type: "POST",
        data: {
            json: json
        },
        dataType: "json"
    });

    getCart.fail(function (jqXHR, textStatus) {
        buildEmptyCart();
    });

    getCart.done(function (data) {

        myProducts = data.products;

        buildCart();
    });
}


$(document).ready(function () {

    $(document).foundation();
    // init slider on the splash page

    // sliderInit();

    /************************************** on splash page ***************************************/
    // mobile hamburger menu close and open 
    $('.mobileCloseBtn').click(function () {
        $('.main-nav.nav#example-menu').addClass('faded');
    })

     $('.searchClick').click(function () {
        $('.main-nav.nav#example-menu').addClass('faded');
    })

    $('.mobileCloseBtn').click(function () {
        $('.main-nav.nav#example-menu').addClass('faded');
    })

    $('.title-bar .menu-icon').click(function () {
        $('.main-nav.nav#example-menu').removeClass('faded');
        $('.main-nav.nav#example-menu').show();

    })

    get_departments();

    get_splash();

    // fill in splash page when click on the logo
    $('.splashLogo').click(function () {
        get_splash();
    });

    //fill in products page when by departments or by search 
    $(document).on('click', "body .getProductsByDepartments", function (e) {
        var department_id = $(this).attr("data-id");
        var catTitle = $(this).attr('id');
        $('.catTitle').text(catTitle);
        $('.catTitle').removeClass('searchResults');
        getProductsByDepartments(department_id);
        $('.is-dropdown-submenu-parent.opens-right').removeClass('is-active');
        $('.department_list').removeClass('js-dropdown-active');

    });

    document.querySelectorAll('.searchClick').forEach((searchClick) => {
        searchClick.addEventListener('click', function () {
            var search = $(this).prev().children('.search').val();
            console.log(search);
            $('.catTitle').text(`Search Results For "${search}"`);
            $('.catTitle').addClass('searchResults');
            getProductsBySearch(search);
        })

    });



    /****************************************************clicking plus, minus, addtocart on the products page ****************************************************/
    $(document).on('click', "body .plus", function () {
        var product_id = $(this).attr("data-id");
        // alert(product_id);
        var quantity = parseInt($('.quantity_' + product_id).html());
        ++quantity;
        $(".quantity_" + product_id).html(quantity);
    });


    $(document).on('click', "body .minus", function () {
        var product_id = $(this).attr("data-id");
        // alert(product_id);
        var quantity = parseInt($('.quantity_' + product_id).html());
        // minus minus sign should be placed at the beginning 
        --quantity;
        if (quantity < 1) {
            quantity = 1;
        }
        $(".quantity_" + product_id).html(quantity);
    });

    $(document).on('click', "body .addToCart", function () {
        var product_id = $(this).attr("data-id");
        console.log(product_id);
        // alert(product_id);
        var quantity = parseInt($('.quantity_' + product_id).html());

        if (myCart[product_id] != undefined) {
            var currentValue = myCart[product_id];
            myCart[product_id] = parseInt(quantity) + parseInt(currentValue);
        } else {
            myCart[product_id] = quantity;
        }

        console.table(myCart);

        var size = Object.size(myCart);
        $('.cartCircle').html(size);
        $(`#${product_id}`).show();
    });

    /**************************************************** on the First screen of cart page ****************************************************/

    $('.shoppingCart').click(
        function () {

            getProductsByCart();
            $('.hideAll').hide();
            // by default Your cart tab is active
            $('.tabs-title').removeClass('is-active');
            $('.tabs-title.yourCartTab').addClass('is-active');
            // hide all the other section, but show your cart section
            $('.cart-section').show();

        }
    )
    // when click on yourCartTab, hide all, but show your cart section

    $('.yourCartTab').click(
        function () {
            $('.hideAll').hide();
            $('.cart-section').show();
        }
    )

    //clicking plus, minus, addtocart on the cart page
    $(document).on("click", "body .cart_plus", function () {
        //alert("cart plus");
        var product_id = $(this).attr("data-id");
        var quantity = parseInt(myCart[product_id] + 1);
        myCart[product_id] = quantity;
        //$(".cart_quantity_" + product_id).html(quantity);
        buildCart();
    });

    $(document).on("click", "body .cart_minus", function () {

        var product_id = $(this).attr("data-id");
        var quantity = parseInt(myCart[product_id] - 1);
        if (quantity < 1) {
            quantity = 1;
        }
        myCart[product_id] = quantity;
        buildCart();
    });

    $(document).on("click", "body .cart_delete", function () {
        var product_id = $(this).attr("data-id");
        delete myCart[product_id];
        var size = Object.size(myCart);
        console.log(myCart);
        $(".cartCircle").html(size);
        var deleteItem;
        $.each(myProducts, function (i, item) {
            if (item.id == product_id) {
                deleteItem = i;
            }
        });
        if (deleteItem != undefined) {
            myProducts.splice(deleteItem, 1);
        }
        if (size === 0) {
            buildEmptyCart();
        } else {
            buildCart();
        }
    });

    //clicking checkout button on the cart page 

    $(document).on("click", "body .checkOutBtn", function () {
        $(".cart-section").hide();
        $(".login-wrapper").show();
        $('.hideAll').hide();
        $(".login-section").show();
        $(".loginOption").fadeIn();
        $('.tabs-title').removeClass('is-active');
        $('.tabs-title.logInTab').addClass('is-active');
    });


    /**************************************************** on the second screen  ************************************************************/
    // when click on yourCartTab, hide all, but show your cart section

    $('.logInTab').click(
    function () {
            
            // $('.logInTab').css('background-color', '#D94862');
            // $('.logInTab a').css('color', 'white');
            // $('.logInTab a').css('font-weight', 'bolder');
            $('.hideAll').hide();
            $('.login-section').show();
            $('.loginOption').fadeIn();

    }
    )
    //login an existed account

    $(document).on("click", "body #login", function () {
        $(".hideAll").hide();
        $('.login-section').show();
        $(".hideAll.login").fadeIn();
    });


    $(document).on("click", "body #loginOK", function () {
        //alert("Please Please More sir!");
        $("#loginForm").submit();
    });


    $("#loginForm").on('submit', function (e) {

        e.preventDefault();

        let validate = false;

        let message = "";

        if ($("#username").val() == "") {
            validate = true;
            message = `Please enter your username
            `;
            $("#username").focus();
        }

        if ($("#password").val() == "") {
            validate = true;
            message += `Please enter your password
            `;
            $("#password").focus();
        }

        if (validate) {
            alert(message);
        } else {

            $.ajax({
                type: 'POST',
                url: "services/login_account.php",
                data: new FormData(this),
                dataType: "json",
                contentType: false,
                cache: false,
                processData: false,

                beforeSend: function () {
                    //alert("Fading screen");
                    $('#oginOK').attr("disabled", "disabled");
                    $('#loginForm').css("opacity", "0.5");
                },

                success: function (data) {
                    //alert("DONE: "+data);
                    // alert("USER ID: " + data.ea_user_id);

                    if (data.error.id == "0" && data.ea_user_id != "-1") {
                        // success
                        $('.login').hide();
                        $("#billing_name_first").val(data.billing_name_first);
                        $("#billing_name_last").val(data.billing_name_last);
                        $(".sabEmail").val(data.email);
                        $('.shippingAndBilling').show();
                    } else {
                        alert(data.error.message);
                    }

                    $('#loginForm').css("opacity", "");
                    $("#loginOK").removeAttr("disabled");
                }
            });

        }
    });

    // create account

    $(document).on("click", "body #createAccount", function () {
        $(".hideAll").hide();
        $('.login-section').show();
        $(".createAccount").fadeIn();
    });

    $(document).on("click", "body #ca_loginOK", function () {
        //alert("Please Please More sir!");
        $("#createAccountForm").submit();
    });

    $("#createAccountForm").on('submit', function (e) {

        e.preventDefault();

        let validate = false;

        
        let message = "";

        if ($("#ca_username").val() == "") {
            validate = true;
            message = `Please Enter Your Username
            `;
            $("#ca_username").focus();
        }

        if ($("#ca_password").val() == "") {
            validate = true;
            message += `Please Enter Your Password.
            `;
            $("#ca_password").focus();
        }

        if ($("#ca_password2").val() == "") {
            validate = true;
            message += `Please Enter Your Password Again.
            `;
            $("#ca_password2").focus();
        }

        if ($("#ca_name_first").val() == "") {
            validate = true;
            message += `Please Enter Your First Name.
            `;
            $("#ca_name_first").focus();
        }

        if ($("#ca_name_last").val() == "") {
            validate = true;
            message += `Please Enter Your Last Name.
            `;
            $("#ca_name_last").focus();
        }


        if (validate) {
            alert(message);
        } else {
            $.ajax({
                type: 'POST',
                url: "services/create_account.php",
                data: new FormData(this),
                dataType: "json",
                contentType: false,
                cache: false,
                processData: false,

                beforeSend: function () {
                    //alert("Fading screen");
                    $('#ca_loginOK').attr("disabled", "disabled");
                    $('#createAccountForm').css("opacity", "0.5");
                },

                success: function (data) {
                    //alert("DONE: "+data);
                    // alert(data.error.message);
                    // alert("USER ID: " + data.user_id);
                    $('#createAccountForm').css("opacity", "");
                    $("#ca_loginOK").removeAttr("disabled");
                    $('.hideAll').hide();
                    $('.login-section').show();
                    $('.loginOption').fadeIn();

                }
            });

        }
    });

    // signout as guest
    $(document).on("click", "body #guest", function () {
        $(".hideAll").hide();
        $('.login-section').show();
        $(".shippingAndBilling").fadeIn();
        // clear the previous record
        $("#billing_name_first").val('');
        $("#billing_name_last").val('');
        $(".sabEmail").val('');
        $("#billing_address").val('');
        $("#shipping_name_first").val('');
        $("#shipping_name_last").val('');
        $("#shipping_address").val('');
    });

    // click on go_to_three button 
    $(document).on("click", "body #go_to_three", function () {
        // validate the input
        let validate = false;

        let message = "";

        if ($(".sabEmail").val() == "") {
            validate = true;
            message = `Please Enter Your Username
            `;
            $("#ca_username").focus();
        }

        if ($("#billing_name_first").val() == "") {
            validate = true;
            message += `Please Enter Your First Name.
            `;
            $("#billing_name_first").focus();
        }

        if ($("#billing_name_last").val() == "") {
            validate = true;
            message += `Please Enter Your last name.
            `;
            $("#billing_name_last").focus();
        }

        if ($("#billing_address").val() == "") {
            validate = true;
            message += `Please Enter Your Billing Address.
            `;
            $("#billing_address").focus();
        }

        if ($("#shipping_name_first").val() == "") {
            validate = true;
            message += `Please Enter Your First Name.
            `;
            $("#shipping_name_first").focus();
        }

        if ($("#shipping_name_last").val() == "") {
            validate = true;
            message += `Please Enter Your last name.
            `;
            $("#shipping_name_last").focus();
        }

        if ($("#shipping_address").val() == "") {
            validate = true;
            message += `Please Enter Your Billing Address.
            `;
            $("#shipping_address").focus();
        }

        if (validate) {
            alert(message);
        }else {
            $('.hideAll').hide();
            $('.payment-section').fadeIn();

            $('#paymentForm').fadeIn();
            $('#confirmSection').html('');
            // clear the previous record 
            $("#card_holder_name").val('');
    
            $("#card_number").val('');
    
            $("#expiryMonth").val('');
    
            $("#expiryYear").val('');
    
            $("#cvv").val('');

            $('.tabs-title').removeClass('is-active');
            $('.tabs-title.paymentTab').addClass('is-active');
        }
});


    /**************************************************** on the third screen  ************************************************************/

    // click on paymentTab
    $('.paymentTab').click(function () {
        
        // $('.logInTab').css('background-color', '#D94862');
        // $('.logInTab a').css('color', 'white');
        // $('.logInTab a').css('font-weight', 'bolder');
        $('.hideAll').hide();
        $('.payment-section').fadeIn();
        $('#confirmSection').html('');
        $('#paymentForm').fadeIn();
        }
    )

    // SUBMIT THE PAYMENT FORM AFTER CLICKING THE COMPLETE BUTTON, (GET THE PAYMENT INFO)
    
    $(document).on("click", "body #go_to_four", function () {
        //alert("Please Please More sir!");
        $("#paymentForm").submit();
    });


    $("#paymentForm").on('submit', function (e) {

        e.preventDefault();

        let validate = false;

        let message = "";

        if ($("#card_holder_name").val() == "") {
            validate = true;
            message = `Please Enter Card Holder Name
            `;
            $("#card_holder_name").focus();
        }

        if ($("#card_number").val() == "") {
            validate = true;
            message += `Please Enter Card Number.
            `;
            $("#card_number").focus();
        }

        if ($("#expiryMonth").val() == "month") {
            validate = true;
            message += `Please Select Your Expired Date.
            `;
            $("#expiryMonth").focus();
        }

        if ($("#expiryYear").val() == "year") {
            validate = true;
            message += `Please Select Your Expired Date.
            `;
            $("#expiryYear").focus();
        }

        if ($("#cvv").val() == "") {
            validate = true;
            message += `Please Enter A CVV Number.
            `;
            $("#cvv").focus();
        }

        if (validate) {
            alert(message);
        } else {

            $.ajax({
                type: 'POST',
                url: "services/make_payment.php",
                data: new FormData(this),
                dataType: "json",
                contentType: false,
                cache: false,
                processData: false,

                beforeSend: function () {
                    //alert("Fading screen");
                    $('#go_to_three').attr("disabled", "disabled");
                    $('#paymentForm').css("opacity", "0.5");
                },

                success: function (data) {
                    //alert("DONE: "+data);


                    //alert("USER ID: " + data.ea_user_id);

                    if (data.error.id == "0") {
                        // save to hidden field transaction code
                        // alert(data.transaction_code);

                        $("#transaction_code").val(data.transaction_code);

                        // save items to hidden fields
                        var content = "";
                        $.each(myCart, function (i, item) {
                            content += `<input name="myCart[${i}]" type="hidden" value="${item}">`;

                        });

                        $(".products_to_purchase").html(content);

                        // SUBMIT THE SHIPPIN AND BILLING ALREADY FILLED OUT.
                        $("#shippingAndBillingForm").submit();
                        
                    } else {
                        alert(data.error.message);
                    }

                    $('#paymentForm').css("opacity", "");
                    $("#go_to_three").removeAttr("disabled");
                }
            });

        }
    });

    // SECOND FORM SUBMITTED WHEN ON THE THIRD SCREEN AND GOING TO THE LAST FOURTH SCREEN.
    
    $("#shippingAndBillingForm").on('submit', function (e) {
        
        e.preventDefault();

        let validate = false;

        if (validate) {
            alert(message);
        } else {

            $.ajax({
                type: 'POST',
                url: "services/make_invoice.php",
                data: new FormData(this),
                dataType: "json",
                contentType: false,
                cache: false,
                processData: false,

                beforeSend: function () {
                    //alert("Fading screen");
                    $('#go_to_three').attr("disabled", "disabled");
                    $('#paymentForm').css("opacity", "0.5");
                },

                success: function (data) {
                    //alert("DONE: "+data);

                    if (data.error.id == "0" && data.ea_user_id != "-1") {
                        // submitInvoice();
                        // hide the screen;
                        // show last screen and invoice number, 
                        // sent emails or even list of items purchased; 
                        // $('.hideAll').hide();
                        var content = `<h1>Your order has been sent. Thank you!</h1>
                        <h style="text-align:center;display:grid">Invoice Number: ${data.invoice_id}</h>`;

                        $('#confirmSection').html(content);
                        $('#paymentForm').hide();

                        // $('.tabs-title').removeClass('is-active');
                        // $('.tabs-title.confirmTab').addClass('is-active');
                    } else {
                        alert(data.error.message);
                    }
                    // create invoice from myCart
                    // $(".invoice").show();
                    //$("#go_to_three").removeAttr("disabled");
                }
                
            });
        }
    });


});
