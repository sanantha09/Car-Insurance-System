<?php
    require "dbinfo.php";
    require "RestService.php";
    require "Driver.php";

// Before running this demo, you need to create a database in MySQL called
// wsbooks and populate it using the script wsbooks_mysql.sql.  You also need
// to edit the fields in dbinfo.php to refer to the database you are using.
//
// There is limited error handling in this code in order to keep the code as simple as
// possible.
 
class DriversRestService extends RestService 
{
	private $drivers;
    
	public function __construct() 
	{
		// Passing in the string 'drivers' to the base constructor ensures that
		// all calls are matched to be sure they are in the form http://server/drivers/x/y/z 
		parent::__construct("drivers");
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
				$this->getAllDrivers();
				echo json_encode($this->drivers);
				break;

			case 2:
				$driver_id = $parameters[1];
				$driver = $this->getDriverById($driver_id);
				if ($driver != null)
				{
					header('Content-Type: application/json; charset=utf-8');
					header('no-cache,no-store');
					echo json_encode($driver);
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

		$newDriver = $this->extractDriverFromJSON($requestBody);
		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
			$sql = "insert into driver_profile (driver_id, kidsdriv, age, income, mstatus, gender, education, occupation) values (?, ?, ?, ?, ?, ?, ?, ?)";
			// We pull the fields of the driver into local variables since 
			// the parameters to bind_param are passed by reference.
			$statement = $connection->prepare($sql);
			$driver_id = $newDriver->getdriver_id();
			$kidsdriv = $newDriver->getkidsdriv();
			$age = $newDriver->getage();
			$income = $newDriver->getincome();
			$mstatus = $newDriver->getmstatus();
			$gender = $newDriver->getgender();
			$education = $newDriver->geteducation();
			$occupation = $newDriver->getoccupation();
			$statement->bind_param('iiiissss', $driver_id, $kidsdriv, $age, $income, $mstatus, $gender, $education, $occupation);
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

		$newDriver = $this->extractDriverFromJSON($requestBody);
		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
			$sql = "update driver_profile set kidsdriv = ?, age = ?, income = ?, mstatus = ?, gender = ?, education = ?, occupation = ? where driver_id = ?";
			// We pull the fields of the driver into local variables since 
			// the parameters to bind_param are passed by reference.
			$statement = $connection->prepare($sql);
			$driver_id = $newDriver->getdriver_id();
			$kidsdriv = $newDriver->getkidsdriv();
			$age = $newDriver->getage();
			$income = $newDriver->getincome();
			$mstatus = $newDriver->getmstatus();
			$gender = $newDriver->getgender();
			$education = $newDriver->geteducation();
			$occupation = $newDriver->getoccupation();
			$statement->bind_param('iiissssi', $kidsdriv, $age, $income, $mstatus, $gender, $education, $occupation, $driver_id);
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
				$driver_id = $parameters[1];
				$sql = "delete from driver_profile where driver_id = ?";
				$statement = $connection->prepare($sql);
				$statement->bind_param('i', $driver_id);
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

    private function getAllDrivers()
    {
		global $dbserver, $dbusername, $dbpassword, $dbdatabase;
	
		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
			$query = "select driver_id, kidsdriv, age, income, mstatus, gender, education, occupation from driver_profile";
			if ($result = $connection->query($query))
			{
				while ($row = $result->fetch_assoc())
				{
					$this->drivers[] = new Drivers($row["driver_id"], $row["kidsdriv"], $row["age"], $row["income"], $row["mstatus"], $row["gender"], $row["education"], $row["occupation"]);
				}
				$result->close();
			}
			$connection->close();
		}
	}	 

    private function getDriverById($driver_id)
    {
		global $dbserver, $dbusername, $dbpassword, $dbdatabase;
		
		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
			$query = "select kidsdriv, age, income, mstatus, gender, education, occupation from driver_profile where driver_id = ?";
			$statement = $connection->prepare($query);
			$statement->bind_param('i', $driver_id);
			$statement->execute();
			$statement->store_result();
			$statement->bind_result($kidsdriv, $age, $income, $mstatus, $gender, $education, $occupation);
			if ($statement->fetch())
			{
				return new Drivers($driver_id, $kidsdriv, $age, $income, $mstatus, $gender, $education, $occupation);
			}
			else
			{
				return null;
			}

		}
	}	

	private function getDriversbyGender($gender)
	{
		global $dbserver, $dbusername, $dbpassword, $dbdatabase;
		
		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
			$query = "select driver_id, kidsdriv, age, income, mstatus, education, occupation from driver_profile where gender = ?";
			$statement = $connection->prepare($query);
			$statement->bind_param('i', $gender);
			$statement->execute();
			$statement->store_result();
			$statement->bind_result($driver_id, $kidsdriv, $age, $income, $mstatus, $education, $occupation);
			if ($statement->fetch())
			{
				return new Drivers($driver_id, $kidsdriv, $age, $income, $mstatus, $gender, $education, $occupation);
			}
			else
			{
				return null;
			}

		}
	}	

    private function extractDriverFromJSON($requestBody)
    {
		// This function is needed because of the perculiar way json_decode works. 
		// By default, it will decode an object into a object of type stdClass.  There is no
		// way in PHP of casting a stdClass object to another object type.  So we use the
		// approach of decoding the JSON into an associative array (that's what the second
		// parameter set to true means in the call to json_decode). Then we create a new
		// Driver object using the elements of the associative array.  Note that we are not
		// doing any error checking here to ensure that all of the items needed to create a new
		// driver object are provided in the JSON - we really should be.
		$driverArray = json_decode($requestBody, true);
		$driver = new Drivers($driverArray['driver_id'],
						 $driverArray['kidsdriv'],
						 $driverArray['age'],
						 $driverArray['income'],
						 $driverArray['mstatus'],
						 $driverArray['gender'],
						 $driverArray['education'],
						 $driverArray['occupation']);
		unset($driverArray);
		return $driver;
	}
}
?>
