const uri = "api/todo";
let todos = null;
function getCount(data) {
    const el = $("#counter");
    let name = "to-do";
    if (data) {
        if (data > 1) {
            name = "to-dos";
        }
        el.text(data + " " + name);
    } else {
        el.text("No " + name);
    }
}

$(document).ready(function () {
    getData();
});



document.querySelector('#deleteAll').onclick = function () {
    for (var i = 0; i < $("li").length; i++) {
        var li = $("li")[i];
        if (li.classList.value == "list-group-item checked") {
            var namekid = li.childNodes[0].textContent;
            var kid = li.childNodes[3];
            const item = {
                name: namekid,
                isComplete: true,
                id: kid.childNodes[0].value
            };

            $.ajax({
                url: uri + "/" + item.id,
                type: "PUT",
                accepts: "application/json",
                contentType: "application/json",
                data: JSON.stringify(item),
                success: function (result) {
                    getData();
                }
            });
        }
        else {
            var namekid = li.childNodes[0].textContent;
            var kid = li.childNodes[3];
            const item = {
                name: namekid,
                isComplete: false,
                id: kid.childNodes[0].value
            };
            $.ajax({
                url: uri + "/" + item.id,
                type: "PUT",
                accepts: "application/json",
                contentType: "application/json",
                data: JSON.stringify(item),
                success: function (result) {
                    getData();
                }
            });
        }
        
    }

}

function getData() {
    $.ajax({
        type: "GET",
        url: uri,
        cache: false,
        success: function (data) {
            const tBody = $("#myList");

            $(tBody).empty();
            document.querySelector('#myList').addEventListener("click", function (item) {
                if (item.target.tagName == 'LI') {
                    item.path[0].classList.toggle('checked');
                    var checkspan = document.querySelector('#edit-isComplete');
                    checkspan.checked = checkspan.checked == true ? false : true;
                }
                else if (item.target.id == 'textName') {
                    item.path[1].classList.toggle('checked');
                    var checkspan = document.querySelector('#edit-isComplete');
                    checkspan.checked = checkspan.checked == true ? false : true;
                }
            });
            getCount(data.length);

            $.each(data, function (key, item) {
                const tr = $("<li class='list-group-item'></li>")
                        .append($("<span id='textName'></span>").text(item.name))
                        .append(
                            $("<span class='close edit'>\uD83D\uDD89</span>").on("click", function () {
                                    editItem(item.id);
                                })
                        )
                        .append(                            
                                $("<span class='close close1'>\u00D7</span>").on("click", function () {
                                    deleteItem(item.id);
                                })
                            
                ).append(
                    $("<div style='display:none'/>", {
                })
                .append(
                            $("<input/>", {
                                type: "hidden",
                                id: "input-id",
                                val: item.id
                            }))
                        .append(
                            $("<input/>", {
                                type: "checkbox",
                                id: "edit-isComplete",
                                disabled: true,
                                checked: item.isComplete
                            }) )
                    
                );
               
                tr.appendTo(tBody);
                if (item.isComplete) {
                    $("li").eq(key).addClass("checked");
                }
                else {
                    $("li").eq(key).removeClass("checked");
                }
            });            
            todos = data;
        }
    });
}

function addItem() {
    const item = {
        name: $("#add-name").val(),
        isComplete: false
    };

    $.ajax({
        type: "POST",
        accepts: "application/json",
        url: uri,
        contentType: "application/json",
        data: JSON.stringify(item),
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Something went wrong!");
        },
        success: function (result) {
            getData();
            $("#add-name").val("");
        }
    });
}

function deleteItem(id) {
    $.ajax({
        url: uri + "/" + id,
        type: "DELETE",
        success: function (result) {
            getData();
        }
    });
}

function editItem(id) {
    $.each(todos, function (key, item) {
        if (item.id === id) {
            $("#edit-name").val(item.name);
            $("#edit-id").val(item.id);
            $("#edit-isComplete")[0].checked = item.isComplete;
        }
    });
    $("#spoiler").css({ display: "block" });
}

$(".my-form").on("submit", function () {
    const item = {
        name: $("#edit-name").val(),
        isComplete: $("#edit-isComplete").is(":checked"),
        id: $("#edit-id").val()
    };

    $.ajax({
        url: uri + "/" + $("#edit-id").val(),
        type: "PUT",
        accepts: "application/json",
        contentType: "application/json",
        data: JSON.stringify(item),
        success: function (result) {
            getData();
        }
    });

    closeInput();
    return false;
});

function closeInput() {
    $("#spoiler").css({ display: "none" });
}