<?php
    require "dbinfo.php";
    require "RestService.php";
    require "Claim.php";

class ClaimsRestService extends RestService 
{
	private $claims;
    
	public function __construct() 
	{
		// Passing in the string 'claims' to the base constructor ensures that
		// all calls are matched to be sure they are in the form http://server/claims/x/y/z 
		parent::__construct("claims");
	}

	public function performGet($url, $parameters, $requestBody, $accept) 
	{
		switch (count($parameters))
		{
			case 1:
				// Note that we need to specify that we are sending JSON back or
				// the default will be used (which is text/html).
				header('Content-Type: application/json; charset=utf-8');
				// This header is needed to stop IE cacheing the results of the GET	
				header('no-cache,no-store');
				$this->getAllClaims();
				echo json_encode($this->claims);
				break;

			case 2:
				$id = $parameters[1];
				$claim = $this->getClaimById($id);
				if ($claim != null)
				{
					header('Content-Type: application/json; charset=utf-8');
					header('no-cache,no-store');
					echo json_encode($claim);
				}
				else
				{
					$this->notFoundResponse();
				}
				break;
			default:
				$this->methodNotAllowedResponse;
		}
	}

	public function performPost($url, $parameters, $requestBody, $accept) 
	{
		global $dbserver, $dbusername, $dbpassword, $dbdatabase;

		$newClaim = $this->extractClaimFromJSON($requestBody);
		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
			$sql = "insert into claims_details (id, claim_flag, clm_amt, clm_freq, oldclaim, driver_id) values (?, ?, ?, ?, ?, ?)";
			// We pull the fields of the claims into local variables since 
			// the parameters to bind_param are passed by reference.
			$statement = $connection->prepare($sql);
			$id = $newClaim->getid();
			$claim_flag = $newClaim->getclaim_flag();
			$clm_amt = $newClaim->getclm_amt();
			$clm_freq = $newClaim->getclm_freq();
			$oldclaim = $newClaim->getoldclaim();
			$driver_id = $newClaim->getdriver_id();
			$statement->bind_param('iiiiii', $id, $claim_flag, $clm_amt, $clm_freq, $oldclaim, $driver_id);
			$result = $statement->execute();
			if ($result == FALSE)
			{
				$errorMessage = $statement->error;
			}
			$statement->close();
			$connection->close();
			if ($result == TRUE)
			{
				// We need to return the status as 204 (no content) rather than 200 (OK) since
				// we are not returning any data
				$this->noContentResponse();
			}
			else
			{
				$this->errorResponse($errorMessage);
			}
		}
	}

	public function performPut($url, $parameters, $requestBody, $accept) 
	{
		global $dbserver, $dbusername, $dbpassword, $dbdatabase;

		$newClaim = $this->extractClaimFromJSON($requestBody);
		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
			$sql = "update claims_details set claim_flag = ?, clm_amt = ?, clm_freq = ?, oldclaim = ?, driver_id = ? where id = ?";
			// We pull the fields of the claims into local variables since 
			// the parameters to bind_param are passed by reference.
			$statement = $connection->prepare($sql);
			$id = $newClaim->getid();
			$claim_flag = $newClaim->getclaim_flag();
			$clm_amt = $newClaim->getclm_amt();
			$clm_freq = $newClaim->getclm_freq();
			$oldclaim = $newClaim->getoldclaim();
			$driver_id = $newClaim->getdriver_id();
			$statement->bind_param('iiiiii', $claim_flag, $clm_amt, $clm_freq, $oldclaim, $driver_id, $id);
			$result = $statement->execute();
			if ($result == FALSE)
			{
				$errorMessage = $statement->error;
			}
			$statement->close();
			$connection->close();
			if ($result == TRUE)
			{
				// We need to return the status as 204 (no content) rather than 200 (OK) since
				// we are not returning any data
				$this->noContentResponse();
			}
			else
			{
				$this->errorResponse($errorMessage);
			}
		}
	}

    public function performDelete($url, $parameters, $requestBody, $accept) 
    {
		global $dbserver, $dbusername, $dbpassword, $dbdatabase;
		
		if (count($parameters) == 2)
		{
			$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
			if (!$connection->connect_error)
			{
				$id = $parameters[1];
				$sql = "delete from claims_details where id = ?";
				$statement = $connection->prepare($sql);
				$statement->bind_param('i', $id);
				$result = $statement->execute();
				if ($result == FALSE)
				{
					$errorMessage = $statement->error;
				}
				$statement->close();
				$connection->close();
				if ($result == TRUE)
				{
					// We need to return the status as 204 (no content) rather than 200 (OK) since
					// we are not returning any data
					$this->noContentResponse();
				}
				else
				{
					$this->errorResponse($errorMessage);
				}
			}
		}
    }

    private function getAllClaims()
    {
		global $dbserver, $dbusername, $dbpassword, $dbdatabase;
	
		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
			$query = "select id, claim_flag, clm_amt, clm_freq, oldclaim, driver_id from claims_details";
			if ($result = $connection->query($query))
			{
				while ($row = $result->fetch_assoc())
				{
					$this->claims[] = new Claims($row["id"], $row["claim_flag"], $row["clm_amt"], $row["clm_freq"], $row["oldclaim"], $row["driver_id"]);
				}
				$result->close();
			}
			$connection->close();
		}
	}	 

    private function getClaimById($id)
    {
		global $dbserver, $dbusername, $dbpassword, $dbdatabase;
		
		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
			$query = "select claim_flag, clm_amt, clm_freq, oldclaim, driver_id from claims_details where id = ?";
			$statement = $connection->prepare($query);
			$statement->bind_param('i', $id);
			$statement->execute();
			$statement->store_result();
			$statement->bind_result($claim_flag, $clm_amt, $clm_freq, $oldclaim, $driver_id);
			if ($statement->fetch())
			{
				return new Claims($id, $claim_flag, $clm_amt, $clm_freq, $oldclaim, $driver_id);
			}
			else
			{
				return null;
			}

		}
	}	

    private function extractClaimFromJSON($requestBody)
    {
		// This function is needed because of the perculiar way json_decode works. 
		// By default, it will decode an object into a object of type stdClass.  There is no
		// way in PHP of casting a stdClass object to another object type.  So we use the
		// approach of decoding the JSON into an associative array (that's what the second
		// parameter set to true means in the call to json_decode). Then we create a new
		// Claim object using the elements of the associative array.  Note that we are not
		// doing any error checking here to ensure that all of the items needed to create a new
		// claim object are provided in the JSON - we really should be.
		$claimArray = json_decode($requestBody, true);
		$claim = new Claims($claimArray['id'],
						 $claimArray['claim_flag'],
						 $claimArray['clm_amt'],
						 $claimArray['clm_freq'],
						 $claimArray['oldclaim'],
						 $claimArray['driver_id']);
		unset($claimArray);
		return $claim;
	}
}
?>
