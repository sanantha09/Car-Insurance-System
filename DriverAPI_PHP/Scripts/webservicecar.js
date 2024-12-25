// jQuery functions to manipulate the main page and handle communication with
// the cars web service via Ajax.
//
// Note that there is very little error handling in this file.  In particular, there
// is no validation in the handling of form data.  This is to avoid obscuring the 
// core concepts that the demo is supposed to show.

function getAllCars()
{   clearTables();
    console.log("Fetching all cars");
    $.ajax({
        url: 'api/car_api/cars',
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function (data) {
            createCarTable(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function addCar()
{
    var car = {
		id: $('#id').val(),
        car_type: $('#car_type').val(),
        red_car: $('#red_car').val(),
        car_age: $('#car_age').val(),
        driver_id: $('#car_driver_id').val(),
    };

    $.ajax({
        url: '/api/car_api/cars',
        type: 'POST',
        data: JSON.stringify(car),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            getAllCars(); // Refreshes the cars list.
            clearFormFields();
            $("#createCarModal").css("display", "none"); // This line hides the modal.
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
    $("#newcarform").html("");
}

function clearFormFields() {
    // Clears all form fields
    $('#id').val('');
    $('#car_type').val('');
    $('#red_car').val('');
    $('#car_age').val('');
    $('#car_driver_id').val('');
}

function editCar(id)
{
    $.ajax({
        url: '/api/car_api/cars/' + id,
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function (data) {
            createEditCarForm(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function editCarsValues(id)
{
    var car = {
		id: id,
        car_type: $('#carcar_type').val(),
        red_car: $('#carred_car').val(),
        car_age: $('#carcar_age').val(),
        driver_id: $('#cr_driver_id').val()
    };

    $.ajax({
        url: '/api/car_api/cars',
        type: 'PUT',
        data: JSON.stringify(car),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            getAllCars();
            $("editCarModal").css("display", "none");
            clearFormFields();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
    $("#CreateNewCarForm").html("");

}

function deleteCar(id)
{
    console.log(id);
    $.ajax({
        url: '/api/car_api/cars/' + id,
        type: 'DELETE',
        dataType: 'json',
        success: function (data) {
            getAllCars();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function createCarTable(cars)
{
    var strResult = '<div class="col-md-12">' + 
                    '<table class="table table-bordered table-hover">' +
                    '<thead>' +
                    '<tr>' +
                    '<th>ID</th>' +
                    '<th>Car Type</th>' +
                    '<th>Red Car</th>' +
                    '<th>Car Age</th>' +
                    '<th>Driver ID</th>' +
                    '<th>&nbsp;</th>' +
                    '<th>&nbsp;</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>';
    $.each(cars, function (index, car) 
    {                        
        strResult += "<tr><td>" + car.id + "</td><td> " + car.car_type + "</td><td>" + car.red_car + "</td><td>" + car.car_age + "</td><td>" + car.driver_id + "</td><td>";
        strResult += '<input type="button" value="Edit Car" class="btn btn-sm btn-primary" onclick="editCar(' + car.id + ');" />';
        strResult += '</td><td>';
        strResult += '<input type="button" value="Delete Car" class="btn btn-sm btn-primary" onclick="deleteCar(' + car.id + ');" />';
        strResult += "</td></tr>";
    });
    strResult += "</tbody></table>";
    $("#allcars").html(strResult);
}

function createNewCarForm()
{   
    clearFormFields();
    $("#createCarModal").css("display", "block");
    
    $("#createCarModal .close").click(function() 
    {
        clearFormFields();
        $("#createCarModal").css("display", "none");
    });
}

function createEditCarForm(car)
{
    $('#carcar_type').val(car.car_type);
    $('#carred_car').val(car.red_car);
    $('#carcar_age').val(car.car_age);
    $('#cr_driver_id').val(car.driver_id);

    $("#editCarModal").css("display", "block");

    $("#editCarModal .close").off().click(function() 
    {
        $("#editCarModal").css("display", "none");
        clearFormFields();
    });
    $("#editCarModal .edit input[type='button']").off().click(function() 
    {
        editCarsValues(car.id);
    });
}

