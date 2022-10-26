<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class CashRegister_m extends MY_Model {

  protected $_table_name = 'cash_registers';

  public $rules = array(
    array(
      'field' => 'name',
      'label' => 'nombre',
      'rules' => 'trim|required|is_unique[cash_registers.name]',
    ),
    array(
      'field' => 'coin_id',
      'label' => 'tipo de moneda',
      'rules' => 'trim|required',
    ),
    array(
      'field' => 'amount',
      'label' => 'monto',
      'rules' => 'numeric|is_natural_no_zero|required',
    )
  );

  public function getLastId(){
    $obj = $this->db->select("IFNULL(MAX(id), 0) id")
    ->get('cash_registers')->row();
    return $obj;
  }

  public function getCashRegisters($start, $length, $search, $order, $user_id)
  {
    $this->db->select("COUNT(IFNULL(cr.id, 0)) recordsFiltered");
    $this->db->from('cash_registers cr');
    $this->db->join('users u', 'u.id = cr.user_id');
    if($user_id == 'all') $user_condition = "";
    else $user_condition = "AND u.id = $user_id";
    $this->db->where("(cr.opening_date LIKE '%$search%' OR cr.closing_date LIKE '%$search%' 
    OR  CONCAT_WS(' ', u.first_name, u.last_name) LIKE '%$search%') $user_condition");
    $data['recordsFiltered'] = $this->db->get()->row()->recordsFiltered??0;
    
    $manualInput = "IFNULL((
      SELECT SUM(IFNULL(mi.amount, 0)) 
      FROM manual_inputs mi
      WHERE mi.cash_register_id = cr.id
    ), 0)";
    $paymentsInputs = "IFNULL((
      SELECT SUM( IFNULL(p.amount, 0) + IFNULL(p.surcharge, 0))
      FROM payment_inputs pin
      LEFT JOIN payments p ON pin.payment_id = p.id
      WHERE pin.cash_register_id = cr.id
    ), 0)";
    $manualOutputs = "IFNULL((
      SELECT SUM(IFNULL(mo.amount, 0)) 
      FROM manual_outputs mo
      WHERE mo.cash_register_id = cr.id
    ), 0)";
    $loanOutputs = "IFNULL((
      SELECT SUM(IFNULL(l.credit_amount, 0)) 
      FROM loan_outputs lo
      LEFT JOIN  loans l ON l.id = lo.loan_id
      WHERE lo.cash_register_id = cr.id
    ), 0)";
    $this->db->select("cr.*, c.short_name,( ($manualInput + $paymentsInputs) - ($manualOutputs + $loanOutputs) )  total_amount, 
    CONCAT_WS(' ', u.first_name, u.last_name) user_name");
    $this->db->from('cash_registers cr');
    $this->db->join('users u', 'u.id = cr.user_id');
    $this->db->join('coins c', 'c.id = cr.coin_id', 'left');
    if($user_id == 'all') $user_condition = "";
    else $user_condition = "AND u.id = $user_id";
    $this->db->where("(cr.opening_date LIKE '%$search%' OR cr.closing_date LIKE '%$search%' 
    OR  CONCAT_WS(' ', u.first_name, u.last_name) LIKE '%$search%') $user_condition");
    $this->db->limit($length, $start);
    if($order['column'] != 'name')
      $this->db->order_by($order['column'], $order['dir']);
    else{
      $this->db->order_by("LENGTH(cr.name)", $order['dir']);
      $this->db->order_by("cr.name", $order['dir']);
    }

    $data['data'] = $this->db->get()->result()??[];
    
    return $data;
  }

  /**
   * Obtiene el total de ingresos manuales en una caja
   */
  public function getManualInputsByCashRegisterId($cash_register_id){
    $this->db->select("IFNULL(SUM(IFNULL(mi.amount,0)), 0) amount");
    $this->db->from("manual_inputs mi");
    $this->db->where("mi.cash_register_id", $cash_register_id);
    return $this->db->get()->row()->amount;
  }

  /**
   * Obtiene el total de egresos manuales en una caja
   */
  public function getManualOutputsByCashRegisterId($cash_register_id){
    $this->db->select("IFNULL(SUM(IFNULL(mo.amount,0)), 0) amount");
    $this->db->from("manual_outputs mo");
    $this->db->where("mo.cash_register_id", $cash_register_id);
    return $this->db->get()->row()->amount??0;
  }

  public function getLoanOutputsByCashRegisterId($cash_register_id){
    $this->db->select("IFNULL(SUM(IFNULL(l.creadit_amount, 0)), 0) amount");
    $this->db->from('loan_outputs lo');
    $this->db->join('loans l', 'l.id = lo.loan_id', 'left');
    $this->db->where('lo.cash_register_id', $cash_register_id);
    return $this->db->get()->row()->amount??0;
  }

  /**
   * Obtiene el total de egresos manuales en una caja
   */
  public function getPaymentInputsByCashRegisterId($cash_register_id){
    $this->db->select("IFNULL(SUM(IFNULL(p.amount)), 0)");
    return 0;
  }

  /**
   * Obtiene el total (ingresos - egresos)
   */
  public function getTotal($cash_register_id){
    $inputs = $this->getManualInputsByCashRegisterId($cash_register_id) + $this->getPaymentInputsByCashRegisterId($cash_register_id); // 
    $outputs = $this->getManualOutputsByCashRegisterId($cash_register_id) + $this->getLoanOutputsByCashRegisterId($cash_register_id);
    $total = $inputs - $outputs;
    return $total;
  }

  public function cashRegisterInsert($data){
    if ($this->db->insert('cash_registers', $data))
      return $this->db->insert_id();
    else
      return 0;
  }

  public function manualInputInsert($data){
    return $this->db->insert('manual_inputs', $data);
  }

}

/* End of file Coins_m.php */
/* Location: ./application/models/Coins_m.php */