$(document).ready(function() {

  // var callback = function() {

  //   var dni = $('#dni').val()

  //   if (dni == "") {
  //     alert('Ingresar Carnet de Identidad')
  //     return false
  //   } else {

  //     $.post(base_url + "admin/loans/ajax_searchCst/", {dni : dni}, function(data){

  //       console.log('sin parse', data)

  //       if (data == 'null'){
  //         alert('No existe el cliente');
  //         $("#dni").val('');
  //         $("#dni_cst").val('');
  //         $("#name_cst").val('');
  //         $("#customer").val('');
  //       }
  //       else
  //       {
  //         $("#dni").val('');
  //         // debes validar/procesar esa cadena como JSON (con JSON.parse) y entonces podrás acceder a los datos de manera sencilla.
  //         data = JSON.parse(data);    
         
  //         console.log('con parse', data)
          
  //         if (data.loan_status == '0') {
  //           $("#customer").val(data.id);
  //           $("#dni_cst").val(data.dni);
  //           $("#name_cst").val(data.first_name + ' ' + data.last_name);
  //         } else {
  //           alert('persona con prestamo pendiente')
  //           $("#dni_cst").val('');
  //           $("#name_cst").val('');
  //           $("#customer").val('');
  //         }
  //       }
  //     })
  //   }

  // };

  // $("#dni").keypress(function(event) {
  //   if (event.which == 13) callback();
  // });

  // $('#btn_buscar').click(callback);

  // Realiza la suma de las cuotas seleccionadas al registrar un nuevo prestamo
  $('#calcular').on('click', function(){ 
    // var define una variable global o local en una función sin importar el ámbito del bloque
    var contador = 0

    if ($("#search").val()=="0" || $("#search").val()=="") {
      contador=1  
      alert("Selecciona un cliente")
      $("#search").focus()
      return false;
    }

    if ($("#cr_amount").val()=="") {
      contador=1  
      alert("Ingresar monto")
      $("#cr_amount").focus()
      return false;
    }
    if ($("#time").val()=="") {
      contador=1  
      alert("Ingresar tiempo")
      $("#time").focus()
      return false;
    }
    
    if ($("#in_amount").val()=="") {
      contador=1 
      alert("Ingresar interes")
      $("#in_amount").focus()
      return false;
    }
    if ($("#date").val()=="") {
      contador=1 
      alert("Ingresar fecha emision")
      return false;
    }

    if (contador==0) {
      $('#register_loan').attr('disabled', false);
    }
    // let permite almacenar los datos de una forma más eficiente
    let time = parseFloat($('#time').val()); // n meses
    let payment = $('#payment').val(); // mensual, quincenal, semanal, diario
    if(payment.toLowerCase()=='mensual'){
      $('#fee').val(time*1);
    }else if(payment.toLowerCase()=='quincenal'){
      $('#fee').val(time*2);
    }else if(payment.toLowerCase()=='semanal'){
      $('#fee').val(time*4);
    }else if(payment.toLowerCase()=='diario'){
      $('#fee').val(time*30);
    }else{
      $('#fee').val(0);
    }
    let monto = parseFloat($('#cr_amount').val());
    let num_cuotas = $('#fee').val();
    let i = ($('#in_amount').val() / 100);
    // let I = monto * i * num_cuotas;
    let I = monto * i * time;
    let monto_total = I + monto;
    let cuota = monto_total / num_cuotas;

    $('#valor_cuota').val(cuota.toFixed(1));
    $('#valor_interes').val(I.toFixed(1));
    $('#monto_total').val(monto_total.toFixed(1));

  }); // Fin realiza la suma de las cuotas seleccionadas al registrar un nuevo prestamo

  $("#loan_form").submit(function () {  
    if($("#customer").val() == "") {  
      alert("Buscar un cliente");  
      return false;  
    }  
  });

  $(document).on("click", '[data-toggle="ajax-modal"]', function (t) {
    t.preventDefault();
   
    var url = $(this).attr("href");

    $.get(url).done(function (data) {
      $("#myModal").html(data).modal({ backdrop: "static" });
    })
   
  })

  // buscar cliente cobranza al cancelar prestamo
  var callback_cobranza = function() {

    var dni_c = $('#dni_c').val()

    if (dni_c == "") {

      alert('Ingresar Carnet de Identidad')
      return false

    } else {

      $.post(base_url + "admin/payments/ajax_searchCst/", {dni : dni_c}, function(data){
        
        // console.log('sin parse', data)

        data = JSON.parse(data);

        console.log('con parse', data)
        

        if (data.cst == null){

          $("#dni_c").val('');
          $("#dni_cst").val('');
          $("#name_cst").val('');
          $("#credit_amount").val('');
          $("#payment_m").val('');
          $("#coin").val('');

          alert('No existe el cliente o no tiene prestamo');
          $("#quotas").html('');
          $("#quotas").dataTable().fnDestroy();
        }
        else {
          $("#dni_c").val('');
          $("#dni_cst").val(data.cst.dni);
          $("#name_cst").val(data.cst.cst_name);
          $("#customer_id").val(data.cst.customer_id);
          $("#loan_id").val(data.cst.loan_id);
          $("#credit_amount").val(data.cst.credit_amount);
          $("#payment_m").val(data.cst.payment_m);
          $("#coin").val(data.cst.coin_name);
          
          // cargar tabla de cuotas
        var  x = new Array(data.quote.length);
        if(data.quote != null && data.quote.length > 0){
            for(i=0; i < data.quote.length; i++){
              x[i] = [
                '<input type="checkbox" name="quota_id[]" '+ (data.quote[i].status==1? '' : 'disabled checked') + ' data-fee='+data.quote[i].fee_amount+' value='+data.quote[i].id+'>',
                data.quote[i].num_quota,
                data.quote[i].date,
                data.quote[i].fee_amount,
                '<button type="button" class="btn btn-sm ' + (data.quote[i].status==1? 'btn-outline-danger' : 'btn-outline-success') + '">'+ (data.quote[i].status==1? 'Pendiente': 'Pagado') +'</button>'
              ]
            }
           // Fin función de calcular monto total a pagar al seleccionar
        }
           // clear the table before populating it with more data
          $("#quotas").dataTable().fnDestroy();

          $('#quotas').dataTable({
            "bPaginate": false, //Ocultar paginación
            "scrollY": '50vh',
            "scrollCollapse": true,
            "aaData": x
          })

          $('input:checkbox').on('change',function (){
            // console.log('chand', $(this).val())
            var total = 0;
            // var totalChecks = 0;
            $('input:checkbox:enabled:checked').each(function(){
              total += isNaN(parseFloat($(this).attr('data-fee'))) ? 0 : parseFloat($(this).attr('data-fee'));
              // totalChecks++;
            });   
            
            $("#total_amount").val(total);

            if (total != 0) {
              $('#register_loan').attr('disabled', false);
            } else {
              $('#register_loan').attr('disabled', true);
            }
            // if(totalChecks == 1){
            //   $('#total_amount').attr('disabled', false);
            // }else{
            //   $('#total_amount').attr('disabled', true);
            // }
          });
        }

      })
    }
  }; // fin buscar cliente cobranza al cancelar prestamo


  $("#dni_c").keypress(function() {
      if (event.which == 13) callback_cobranza();
  });

  $('#btn_buscar_c').click(callback_cobranza);


  $("#coin_type").change(function(){
    
    var coin_id = $("#coin_type").val()
    var symbol = $('#coin_type option:selected').data("symbol");
  
    $.get(base_url + "admin/reports/ajax_getCredits/" + coin_id, function(data){
   
      data = JSON.parse(data);
      console.log('con parse', data)

      if (data.credits[0].sum_credit == null) {
        var sum_credit = '0 ' + symbol.toUpperCase()
      } else {
        var sum_credit = data.credits[0].sum_credit + ' ' + (data.credits[0].short_name).toUpperCase()
      }
      $("#cr").html(sum_credit) // id= cr -> total crédito

      if (data.credits[1].cr_interest == null) {
        var cr_interest = '0 ' + symbol.toUpperCase()
      } else {
        var cr_interest = data.credits[1].cr_interest + ' ' + (data.credits[1].short_name).toUpperCase()
      }
      $("#cr_interest").html(cr_interest) // id="cr_interest" -> Crédito con interes

      if (data.credits[2].cr_interestPaid == null) {
        var cr_interestPaid = '0 ' + symbol.toUpperCase()
      }else{
        var cr_interestPaid = data.credits[2].cr_interestPaid + ' ' + data.credits[2].short_name.toUpperCase()
      }
      $("#cr_interestPaid").html(cr_interestPaid) // id="cr_interestPaid" -> Total Credito cancelado con intere

      if (data.credits[3].cr_interestPay == null) {
        var cr_interestPay = '0 ' + symbol.toUpperCase()
      } else {
        var cr_interestPay = data.credits[3].cr_interestPay + ' ' + (data.credits[3].short_name).toUpperCase()
      }
      $("#cr_interestPay").html(cr_interestPay) // id="cr_interestPay" -> Total Credito por cobrar con interes

    });
  });

})





function imp_credits(imp1){
  var printContents = document.getElementById('imp1').innerHTML;
  w = window.open();
  w.document.write(printContents);
  w.print();
  w.close();
}

function reportPDF(){
  var start_d = $("#start_d").val();
  var end_d = $("#end_d").val();
  var coin_t = $("#coin_type2").val();

  if (start_d == '' || end_d == '') {
    alert('Ingrese las fechas')
  }else{
    window.open(base_url+'admin/reports/dates_pdf/'+coin_t+'/'+start_d+'/'+end_d)
  }

}



function load_loans(){

}
  