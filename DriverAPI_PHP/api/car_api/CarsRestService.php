<?php
    require "dbinfo.php";
    require "RestService.php";
    require "Car.php";
 
class CarsRestService extends RestService 
{
	private $cars;
    
	public function __construct() 
	{
		// Passing in the string 'cars' to the base constructor ensures that
		// all calls are matched to be sure they are in the form http://server/cars/x/y/z 
		parent::__construct("cars");
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
				$this->getAllCars();
				echo json_encode($this->cars);
				break;

			case 2:
				$id = $parameters[1];
				$car = $this->getCarById($id);
				if ($car != null)
				{
					header('Content-Type: application/json; charset=utf-8');
					header('no-cache,no-store');
					echo json_encode($car);
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

		$newCar = $this->extractCarFromJSON($requestBody);
		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
			$sql = "insert into car_details (id, car_type, red_car, car_age, driver_id) values (?, ?, ?, ?, ?)";
			// We pull the fields of the cars into local variables since 
			// the parameters to bind_param are passed by reference.
			$statement = $connection->prepare($sql);
			$id = $newCar->getid();
			$car_type = $newCar->getcar_type();
			$red_car = $newCar->getred_car();
			$car_age = $newCar->getcar_age();
			$driver_id = $newCar->getdriver_id();
			$statement->bind_param('issii', $id, $car_type, $red_car, $car_age, $driver_id);
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

		$newCar = $this->extractCarFromJSON($requestBody);
		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
			$sql = "update car_details set car_type = ?, red_car = ?, car_age = ?, driver_id = ? where id = ?";
			// We pull the fields of the cars into local variables since 
			// the parameters to bind_param are passed by reference.
			$statement = $connection->prepare($sql);
			$id = $newCar->getid();
			$car_type = $newCar->getcar_type();
			$red_car = $newCar->getred_car();
			$car_age = $newCar->getcar_age();
			$driver_id = $newCar->getdriver_id();
			$statement->bind_param('ssiii', $car_type, $red_car, $car_age, $driver_id, $id);
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
				$sql = "delete from car_details where id = ?";
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

    private function getAllCars()
    {
		global $dbserver, $dbusername, $dbpassword, $dbdatabase;
	
		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
			$query = "select id, car_type, red_car, car_age, driver_id from car_details";
			if ($result = $connection->query($query))
			{
				while ($row = $result->fetch_assoc())
				{
					$this->cars[] = new Cars($row["id"], $row["car_type"], $row["red_car"], $row["car_age"], $row["driver_id"]);
				}
				$result->close();
			}
			$connection->close();
		}
	}	 

    private function getCarById($id)
    {
		global $dbserver, $dbusername, $dbpassword, $dbdatabase;
		
		$connection = new mysqli($dbserver, $dbusername, $dbpassword, $dbdatabase);
		if (!$connection->connect_error)
		{
			$query = "select car_type, red_car, car_age, driver_id from car_details where id = ?";
			$statement = $connection->prepare($query);
			$statement->bind_param('i', $id);
			$statement->execute();
			$statement->store_result();
			$statement->bind_result($car_type, $red_car, $car_age, $driver_id);
			if ($statement->fetch())
			{
				return new Cars($id, $car_type, $red_car, $car_age, $driver_id);
			}
			else
			{
				return null;
			}

		}
	}	

    private function extractCarFromJSON($requestBody)
    {
		// This function is needed because of the perculiar way json_decode works. 
		// By default, it will decode an object into a object of type stdClass.  There is no
		// way in PHP of casting a stdClass object to another object type.  So we use the
		// approach of decoding the JSON into an associative array (that's what the second
		// parameter set to true means in the call to json_decode). Then we create a new
		// Car object using the elements of the associative array.  Note that we are not
		// doing any error checking here to ensure that all of the items needed to create a new
		// car object are provided in the JSON - we really should be.
		$carArray = json_decode($requestBody, true);
		$car = new Cars($carArray['id'],
						 $carArray['car_type'],
						 $carArray['red_car'],
						 $carArray['car_age'],
						 $carArray['driver_id']);
		unset($carArray);
		return $car;
	}
}
?>
