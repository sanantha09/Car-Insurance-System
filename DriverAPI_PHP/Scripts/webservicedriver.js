// jQuery functions to manipulate the main page and handle communication with
// the drivers web service via Ajax.
//
// Note that there is very little error handling in this file.  In particular, there
// is no validation in the handling of form data.  This is to avoid obscuring the 
// core concepts that the demo is supposed to show.

function getAllDrivers()
{   clearTables();
    console.log("Fethcing all drivers");
    $.ajax({
        url: 'api/driver_api/drivers',
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function (data) {
            createDriverTable(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function addDriver()
{
    var driver = {
		driver_id: $('#driver_id').val(),
        kidsdriv: $('#kidsdriv').val(),
        age: $('#age').val(),
        income: $('#income').val(),
        mstatus: $('#mstatus').val(),
        gender: $('#gender').val(),
        education: $('#education').val(),
        occupation: $('#occupation').val()
    };

    $.ajax({
        url: '/api/driver_api/drivers',
        type: 'POST',
        data: JSON.stringify(driver),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            getAllDrivers(); // Refreshes the drivers list.
            clearFormFields();
            $("#createDriverModal").css("display", "none"); // This line hides the modal.
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
    $("#newdriverform").html("");
}

function clearFormFields() {
    // Clears all form fields
    $('#driver_id').val('');
    $('#kidsdriv').val('');
    $('#age').val('');
    $('#income').val('');
    $('#mstatus').val('');
    $('#gender').val('');
    $('#education').val('');
    $('#occupation').val('');
}

function editDriver(driver_id)
{
    $.ajax({
        url: '/api/driver_api/drivers/' + driver_id,
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function (data) {
            createEditDriverForm(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function editDriverValues(driver_id)
{
    var driver = {
		driver_id: driver_id,
        kidsdriv: $('#driverkidsdriv').val(),
        age: $('#driverage').val(),
        income: $('#driverincome').val(),
        mstatus: $('#drivermstatus').val(),
        gender: $('#drivergender').val(),
        education: $('#drivereducation').val(),
        occupation: $('#driveroccupation').val()
    };

    $.ajax({
        url: '/api/driver_api/drivers',
        type: 'PUT',
        data: JSON.stringify(driver),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            getAllDrivers();
            $("editDriverModal").css("display", "none");
            clearFormFields();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
    $("#CreateNewDriverForm").html("");

}

function deleteDriver(driver_id)
{
    console.log(driver_id);
    $.ajax({
        url: '/api/driver_api/drivers/' + driver_id,
        type: 'DELETE',
        dataType: 'json',
        success: function (data) {
            getAllDrivers();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function createDriverTable(drivers)
{
    var strResult = '<div class="col-md-12">' + 
                    '<table class="table table-bordered table-hover">' +
                    '<thead>' +
                    '<tr>' +
                    '<th>Driver ID</th>' +
                    '<th>Kids Driv</th>' +
                    '<th>Age</th>' +
                    '<th>Income</th>' +
                    '<th>Marital Status</th>' +
                    '<th>Gender</th>' +
                    '<th>Education</th>' +
                    '<th>Occupation</th>' +
                    '<th>&nbsp;</th>' +
                    '<th>&nbsp;</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>';
    $.each(drivers, function (index, driver) 
    {                        
        strResult += "<tr><td>" + driver.driver_id + "</td><td> " + driver.kidsdriv + "</td><td>" + driver.age + "</td><td>" + driver.income + "</td><td>" + driver.mstatus + "</td><td>" + driver.gender + "</td><td>" + driver.education.replace("<", "&lt;") + "</td><td>" + driver.occupation + "</td><td>";
        strResult += '<input type="button" value="Edit Driver" class="btn btn-sm btn-primary" onclick="editDriver(' + driver.driver_id + ');" />';
        strResult += '</td><td>';
        strResult += '<input type="button" value="Delete Driver" class="btn btn-sm btn-primary" onclick="deleteDriver(' + driver.driver_id + ');" />';
        strResult += "</td></tr>";
    });
    strResult += "</tbody></table>";
    $("#alldrivers").html(strResult);
}

function createNewDriverForm()
{   
    $("#createDriverModal").css("display", "block");
    
    $("#createDriverModal .close").click(function() 
    {
        clearFormFields();
        $("#createDriverModal").css("display", "none");
    });
}

function createEditDriverForm(driver)
{
    $('#driverkidsdriv').val(driver.kidsdriv);
    $('#driverage').val(driver.age);
    $('#driverincome').val(driver.income);
    $('#drivermstatus').val(driver.mstatus);
    $('#drivergender').val(driver.gender);
    $('#drivereducation').val(driver.education);
    $('#driveroccupation').val(driver.occupation);

    $("#editDriverModal").css("display", "block");

    $("#editDriverModal .close").off().click(function() 
    {
        $("#editDriverModal").css("display", "none");
        clearFormFields();
    });
    $("#editDriverModal .edit input[type='button']").off().click(function() 
    {
        editDriverValues(driver.driver_id);
    });
}
