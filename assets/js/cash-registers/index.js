// Cargar lista paginable
function loadData() {
    $(document).ready(function () {
        // Consultar cuotas del préstamo
        if(document.getElementById( "userSelector" ))
            user_id = document.getElementById('userSelector').value != 'all'?'/'+document.getElementById('userSelector').value:'';
        else
            user_id = null;
        $("#cash-registers").dataTable().fnDestroy();
        $('#cash-registers').dataTable({
            "lengthMenu": [[10, 25, 50, 75, 100], [10, 25, 50, 75, 100]],
            'paging': true,
            'info': true,
            'filter': true,
            'stateSave': true,
            'processing': true,
            'serverSide': true,
            'ajax': {
                "url": base_url + "admin/cashregister/ajax_cash_registers/" + user_id,
                "type": "POST"
            },
            'columns': [
                { data: 'name', 'sClass': 'dt-body-center' },
                { data: 'user_name' },
                {'total_amount': true, 
                    render: function(data, type, row){
                        return `${row.total_amount} ${row.short_name}`;
                    }
                },
                { data: 'opening_date' },
                { data: 'closing_date' },
                {
                    'cell': true,
                    render: function (data, type, row) {
                        if(row.status==1)
                            return `<a class="btn btn-success btn-sm" href="${base_url}admin/cashregister/view?id=${row.id}">Abierto</a>`;
                        else
                            return `<a class="btn btn-warning btn-sm" href="${base_url}admin/cashregister/view?id=${row.id}">Cerrado</a>`;
                    }
                }
            ],
            "order": [[3, "asc"]]
        });
    });

}

if(document.getElementById( "userSelector" )){
    const userSelector = document.getElementById('userSelector');
    userSelector.addEventListener('change', (event) => {
        loadData();
    });
}

loadData();


