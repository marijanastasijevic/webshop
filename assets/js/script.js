'use strict';
$(document).ready(function () {

    ajaxCallback("livingroom.json", function (result) {
        let arrayLivingroom = result;
        setDataLS("livingroomLS", arrayLivingroom);
        createList(arrayLivingroom, "Livingroom", "ddlLivingroom", "#ddlLivingRoomBlock")
    });

    ajaxCallback("bedroom.json", function (result) {
        let arrayBedroom = result;
        setDataLS("bedroomLS", arrayBedroom);
        createList(arrayBedroom, "Bedroom", "ddlBedroom", "#ddlBedRoomBlock")
    });

    ajaxCallback("entranceHall.json", function (result) {
        let arrayEntranceHall = result;
        setDataLS("entranceHallLS", arrayEntranceHall);
        createList(arrayEntranceHall, "Entrance hall", "ddlEntranceHall", "#ddlEntranceHallBlock")
    });

    ajaxCallback("kitchen.json", function (result) {
        let arrayKitchen = result;
        setDataLS("kitchenLS", arrayKitchen);
        createList(arrayKitchen, "Kitchen", "ddlKitchen", "#ddlKitchenBlock")
    });

    ajaxCallback("diningRoom.json", function (result) {
        let arrayDiningRoom = result;
        setDataLS("diningRoomLS", arrayDiningRoom);
        createList(arrayDiningRoom, "Dining room", "ddlDiningRoom", "#dinningRoomBlock")
    })

    ajaxCallback("childrensRoom.json", function (result) {
        let arrayChildrensRoom = result;
        setDataLS("childrensRoomLS", arrayChildrensRoom);
        createList(arrayChildrensRoom, "Children's room", "ddlChildrensRoom", "#ChildrensRoomBlock")
    })








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




