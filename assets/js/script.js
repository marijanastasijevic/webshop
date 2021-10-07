'use strict';
$(document).ready(function () {

    ajaxCallback("rooms.json", function (result) {
        let arrayRooms = result;
        setDataLS("roomsLS", arrayRooms);
        createList(arrayRooms, "Rooms", "ddlRooms", "#ddlRoomsBlock")
    });

    ajaxCallback("type.json", function (result) {
        let arrayType = result;
        setDataLS("typeLS", arrayType);
        createList(arrayType, "Type furniture", "ddlType", "#ddlTypeBlock")
    });

    ajaxCallback("products.json", function (result) {
        let arrayProducts = result;
        setDataLS("productsLS", arrayProducts);
        //printProducts(arrayProducts)
    })

    $(document).on('change', '#ddlRooms', filtSort);
    $(document).on('change', '#ddlType', filtSort);


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
        printHtml += `<div class = "col-12><p>Trenutno nema proizvoda</p></div>"`
    }
    else {
        for (let objProduct of products) {
            printHtml += `<div class = "col-3" >
                            <h5><strong>${returnName(objProduct.typeID, "typeLS")}</strong></h5>

                            <h4>${objProduct.name}</h4>
                            
                            <img src="${objProduct.image.src}" alt="${objProduct.image.alt}" class="img-fluid" />
                        </div>`

        }
    }
    console.log(printHtml);
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
    console.log("roomsID: " + roomsID);
    console.log("typeID: " + typeID);

    let arrayProducts = returnDataLS("productsLS");

    let filteredProducts = filter(arrayProducts, roomsID, typeID);

    //sort(filteredProducts);
    printProducts(filteredProducts);
}

function filter(products, roomID, typeID) {
    let filteredProducts = [];
    for (let product of products) {
        if (product.roomID == roomID && product.typeID == typeID) {
            filteredProducts.push(product);
        }
    }

    return filteredProducts;
}

function sort(products) {

}







