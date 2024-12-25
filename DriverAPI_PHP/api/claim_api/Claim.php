<?php
class Claims
{
    public $id;
    public $claim_flag;
    public $clm_amt;
    public $clm_freq;
    public $oldclaim;
    public $driver_id;


    public function __construct($id, $claim_flag, $clm_amt, $clm_freq, $oldclaim, $driver_id)
    {
        $this->id = $id;
        $this->claim_flag = $claim_flag;
        $this->clm_amt = $clm_amt;
        $this->clm_freq = $clm_freq;
        $this->oldclaim = $oldclaim;
        $this->driver_id = $driver_id;
    }

    public function getid()
    {
        return $this->id;
    }

    public function getclaim_flag()
    {
        return $this->claim_flag;
    }

    public function getclm_amt()
    {
        return $this->clm_amt;
    }

    public function getclm_freq()
    {
        return $this->clm_freq;
    }

    public function getoldclaim()
    {
        return $this->oldclaim;
    }

    public function getdriver_id()
    {
        return $this->driver_id;
    }
}
?>
