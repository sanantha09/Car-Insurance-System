// jQuery functions to manipulate the main page and handle communication with
// the claims web service via Ajax.
//
// Note that there is very little error handling in this file.  In particular, there
// is no validation in the handling of form data.  This is to avoid obscuring the 
// core concepts that the demo is supposed to show.

function getAllClaims()
{   clearTables();
    console.log("Fetching all claims");
    $.ajax({
        url: '/api/claim_api/claims',
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function (data) {
            createClaimTable(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function addClaim()
{
    var claim = {
		id: $('#id').val(),
        claim_flag: $('#claim_flag').val(),
        clm_amt: $('#clm_amt').val(),
        clm_freq: $('#clm_freq').val(),
        oldclaim: $('#oldclaim').val(),
		driver_id: $('#claim_driver_id').val()
    };

    $.ajax({
        url: '/api/claim_api/claims',
        type: 'POST',
        data: JSON.stringify(claim),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            getAllClaims(); // Refreshes the claims list.
            clearFormFields();
            $("#createClaimModal").css("display", "none"); // This line hides the modal.
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
    $("#newclaimform").html("");
}

function clearFormFields() {
    // Clears all form fields
    $('#id').val('');
    $('#claim_flag').val('');
    $('#clm_amt').val('');
    $('#clm_freq').val('');
    $('#oldclaim').val('');
    $('#claim_driver_id').val('');
    //$('#clm_driver_id').val('');
}

function editClaim(id)
{
    $.ajax({
        url: '/api/claim_api/claims/' + id,
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function (data) {
            createEditClaimForm(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function editClaimsValues(id)
{
    var claim = {
		id: id,
        claim_flag: $('#claimclaim_flag').val(),
        clm_amt: $('#claimclm_amt').val(),
        clm_freq: $('#claimclm_freq').val(),
        oldclaim: $('#claimoldclaim').val(),
        driver_id: $('#clm_driver_id').val()
    };

    console.log(claim);

    $.ajax({
        url: '/api/claim_api/claims',
        type: 'PUT',
        data: JSON.stringify(claim),
        contentType: "application/json;charset=utf-8",
        success: function (data) {
            getAllClaims();
            $("editClaimModal").css("display", "none");
            clearFormFields();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
    $("#CreateNewClaimForm").html("");

}

function deleteClaim(id)
{
    console.log(id);
    $.ajax({
        url: '/api/claim_api/claims/' + id,
        type: 'DELETE',
        dataType: 'json',
        success: function (data) {
            getAllClaims();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(jqXHR + '\n' + textStatus + '\n' + errorThrown);
        }
    });
}

function createClaimTable(claims)
{
    var strResult = '<div class="col-md-12">' + 
                    '<table class="table table-bordered table-hover">' +
                    '<thead>' +
                    '<tr>' +
                    '<th>ID</th>' +
                    '<th>Claim Flag</th>' +
                    '<th>Claim Amt</th>' +
                    '<th>Claim Freq</th>' +
                    '<th>OldClaim</th>' +
                    '<th>Driver ID</th>' +
                    '<th>&nbsp;</th>' +
                    '<th>&nbsp;</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>';
    $.each(claims, function (index, claim) 
    {                        
        strResult += "<tr><td>" + claim.id + "</td><td> " + claim.claim_flag + "</td><td>" + claim.clm_amt + "</td><td>" + claim.clm_freq + "</td><td>" + claim.oldclaim + "</td><td>" + claim.driver_id + "</td><td>";
        strResult += '<input type="button" value="Edit Claim" class="btn btn-sm btn-primary" onclick="editClaim(' + claim.id + ');" />';
        strResult += '</td><td>';
        strResult += '<input type="button" value="Delete Claim" class="btn btn-sm btn-primary" onclick="deleteClaim(' + claim.id + ');" />';
        strResult += "</td></tr>";
    });
    strResult += "</tbody></table>";
    $("#allclaims").html(strResult);
}

function createNewClaimForm()
{   
    clearFormFields();
    $("#createClaimModal").css("display", "block");
    
    $("#createClaimModal .close").click(function() 
    {
        clearFormFields();
        $("#createClaimModal").css("display", "none");
    });
}

function createEditClaimForm(claim)
{
    $('#claimclaim_flag').val(claim.claim_flag);
    $('#claimclm_amt').val(claim.clm_amt);
    $('#claimclm_freq').val(claim.clm_freq);
    $('#claimoldclaim').val(claim.oldclaim);
    $('#clm_driver_id').val(claim.driver_id)


    $("#editClaimModal").css("display", "block");

    $("#editClaimModal .close").off().click(function() 
    {
        $("#editClaimModal").css("display", "none");
        clearFormFields();
    });
    $("#editClaimModal .edit input[type='button']").off().click(function() 
    {
        editClaimsValues(claim.id);

    });
}

