<?php
class Drivers
{
    public $driver_id;
    public $kidsdriv;
    public $age;
    public $income;
    public $mstatus;
    public $gender;
    public $education;
    public $occupation;

    public function __construct($driver_id, $kidsdriv, $age, $income, $mstatus, $gender, $education, $occupation)
    {
        $this->driver_id = $driver_id;
        $this->kidsdriv = $kidsdriv;
        $this->age = $age;
        $this->income = $income;
        $this->mstatus = $mstatus;
        $this->gender = $gender;
        $this->education = $education;
        $this->occupation = $occupation;
        
    }

    public function getdriver_id()
    {
        return $this->driver_id;
    }

    public function getkidsdriv()
    {
        return $this->kidsdriv;
    }

    public function getage()
    {
        return $this->age;
    }

    public function getincome()
    {
        return $this->income;
    }

    public function getmstatus()
    {
        return $this->mstatus;
    }
    
    public function getgender()
    {
        return $this->gender;
    }

    public function geteducation()
    {
        return $this->education;
    }

    public function getoccupation()
    {
        return $this->occupation;
    }
}
?>