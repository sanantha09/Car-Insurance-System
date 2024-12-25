<?php
class Cars
{
    public $id;
    public $car_type;
    public $red_car;
    public $car_age;
    public $driver_id;

    public function __construct($id, $car_type, $red_car, $car_age, $driver_id)
    {
        $this->id = $id;
        $this->car_type = $car_type;
        $this->red_car = $red_car;
        $this->car_age = $car_age;
        $this->driver_id = $driver_id;
    }

    public function getid()
    {
        return $this->id;
    }

    public function getcar_type()
    {
        return $this->car_type;
    }

    public function getred_car()
    {
        return $this->red_car;
    }

    public function getcar_age()
    {
        return $this->car_age;
    }

    public function getdriver_id()
    {
        return $this->driver_id;
    }
}
?>