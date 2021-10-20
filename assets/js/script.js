'use strict';
$(document).ready(function () {
    //console.log(document)

    let url = window.location.pathname;
    console.log(url)

    if(url == "/" || url == "/index.html"){
        ajaxCallback("rooms.json", function (result) {
            let arrayRooms = result;
            setDataLS("roomsLS", arrayRooms);
            createList(arrayRooms, "Rooms", "ddlRooms", "#ddlRoomsBlock")
        });
    
        ajaxCallback("type.json", function (result) {
            let arrayType = result;
            setDataLS("typeLS", arrayType);
            createList(arrayType, "Furniture type", "ddlType", "#ddlTypeBlock")
        });
    
        ajaxCallback("products.json", function (result) {
            let arrayProducts = result;
            setDataLS("productsLS", arrayProducts);
            printProducts(arrayProducts)
        })
    
        $(document).on('change', '#ddlRooms', filtSort);
        $(document).on('change', '#ddlType', filtSort);
        $(document).on('change', '#ddlSort', filtSort);     
    
        //add to cart
        $(document).on('click', '.add-to-cart', function(e){
            e.preventDefault();
            let idProduct = $(this).data('idproduct');
            
            //alert(idProduct)
    
            let cart = returnDataLS("cartLS");
    
            // I situacija je kada je korpa prazna
            if(cart == null){
                let productsInCart = [{
                    "id": idProduct,
                    "qty": 1
                }];
                setDataLS("cartLS", productsInCart);
                alert("You added product in cart");
    
                return;
            }
    
            let isProductAdded = false;
    
            for(let product of cart){
                if(product.id == idProduct){
                    isProductAdded = true;
                    product.qty = Number(product.qty) + 1;
                }
                
            };
    
            if(!isProductAdded){
                let newProduct = {
                    "id": idProduct,
                    "qty": 1
                };
    
                cart.push(newProduct);
            };
    
    
            setDataLS("cartLS", cart);
        })

    }
    
    if(url == "/cart.html"){
        ajaxCallback("products.json", function (result) {
            let arrayProducts = result;
            setDataLS("productsLS", arrayProducts);
        })
        $(document).on('click', '.remove-products', function(e){
            e.preventDefault();
            let idProduct = $(this).data('idproduct');
            console.log("idProduct: " + idProduct);
    
            let newCart = [];
    
            let oldCart = returnDataLS("cartLS");
    
            for(let productInCart of oldCart){
                if(productInCart.id != idProduct){
                    newCart.push(productInCart);
                }
    
            }
    
            setDataLS("cartLS", newCart);
            printProductsFromCart();
    
        });
    
        printProductsFromCart();

    }

})

function ajaxCallback(file, successClb) {
    $.ajax({
        metod: "get",
        url: "assets/data/" + file,
        dataType: "json",
        success: successClb,
        error: function (xhr) {
            console.log(xhr)
        }
    })
}

// postavljanje podataka na localstorage
function setDataLS(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function returnDataLS(key) {
    return JSON.parse(localStorage.getItem(key));
}

function createList(data, textLabel, idList, idBlock) {
    let printHtml = `<div class = "form-group">
                        <label class="label-style">${textLabel}</label>
                        <select id="${idList}" class="form-control">
                            <option value ="0">Select</option>`

    for (let obj of data) {
        printHtml += `<option value="${obj.id}">${obj.key}</option>`

    }

    printHtml += `</select></div>`

    $(idBlock).html(printHtml);

}

function printProducts(products) {
    let printHtml = "";

    if (products.length == 0) {
        printHtml += `<div class ="col-12 no-products"><p>Currently there are no products available</p></div>`
    }
    else {
        for (let objProduct of products) {
            printHtml += `<div class = "col-3 my-4" >
                            <h5><strong>${returnName(objProduct.typeID, "typeLS")}</strong></h5>

                            <h4>${objProduct.name}</h4>
                            
                            <img src="${objProduct.image.src}" alt="${objProduct.image.alt}" class="img-fluid" />

                            <h5 class="price"><strong>Price: ${objProduct.price} EUR</h5><strong>

                            <a href="#" class="add-to-cart btn btn-dark" data-idproduct="${objProduct.id}">Add to cart</a>
                        </div>`

        }
    }
    $("#productsBlock").html(printHtml);
}

function returnName(id, nameLS) {
    let name = "";

    let data = returnDataLS(nameLS);

    if (data == null) {
        name = "/"
    }
    else {
        for (let obj of data) {
            if (obj.id == id) {
                name = obj.key
            }
        }
    }
    return name;
}

function filtSort() {
    let roomsID = $('#ddlRooms').val();
    let typeID = $('#ddlType').val();
    let sortType = $('#ddlSort').val();

    let arrayProducts = returnDataLS("productsLS");

    let filteredProducts = filter(arrayProducts, roomsID, typeID);

    let sortedProducts = sort(filteredProducts, sortType);

    printProducts(sortedProducts);
}

function filter(products, roomID, typeID) {
    let filteredProductsByRoom = [];

    for (let product of products) {
        if (product.roomID == roomID) {
            filteredProductsByRoom.push(product);
        }
    }

    if (typeID == 0) {
        return filteredProductsByRoom;
    }

    let filteredProductsByRoomAndType = [];
    for (let product of filteredProductsByRoom) {
        if (product.typeID == typeID) {
            filteredProductsByRoomAndType.push(product);
        }
    }

    return filteredProductsByRoomAndType;
}

function sort(products, type) {
    if (type == 0) {
        return products;
    }

    if (type == 'price-asc') {
        return products.sort(function (a, b) { return a.price - b.price; });
    }

    if (type == 'price-desc') {
        return products.sort(function (a, b) { return b.price - a.price; });
    }
}

// funkcija koja isitava podatke iz korpe

function printProductsFromCart(){
    let productsInCart = returnDataLS("cartLS");

    let allProducts = returnDataLS("productsLS");

    let html = "<div class = 'col-12'><table class='table'>"

        for(let productAll of allProducts){
            for(let productLS of productsInCart){
                if(productAll.id == productLS.id){
                    html += `<tr>
                                <td class="w-25">
                                    <img src = '${productAll.image.src}' 'alt=${productAll.image.alt}' class='w-25' />
                                </td>

                                <td>
                                    <h4>${productAll.name}</h4>
                                </td>
                                <td>
                                    <p>${productAll.price} EUR </p>
                                </td>
                                <td>
                                    <p>${productLS.qty}</p>
                                </td>
                                <td class="right">
                                    <p>${multiply(productAll.price, productLS.qty)}</p>
                                </td>
                                <td>
                                    <a href = "#" class = "remove-products" data-idproduct="${productLS.id}">Remove product</a>
                                </td>
                            </tr>`
                }
            }
        }

        html += `<tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="sum"><p>In total: ${sum(productsInCart, allProducts)} EUR</p></td>
                    <td></td>
        
                </tr>`

        

        html += "</table></div>"
        
        $('#CartView').html(html);
}

function multiply(x, y){
    return x * y;
}

function sum(productsInCart, allProducts){
    let sum = 0;

    for(let productCart of productsInCart){
        for(let  productAll of allProducts){
            if(productCart.id == productAll.id){
             
             sum +=  multiply(productAll.price, productCart.qty);
                
            }
            
            
        }
    }

    return sum;
};








