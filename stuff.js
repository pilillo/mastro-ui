$(document).ready(function(){

    var $loading = $('.loader').hide();
    $(document)
      .ajaxStart(function () {
        $loading.show();
      })
      .ajaxStop(function () {
        $loading.hide();
    });

    var datatable = $( "#dataTable" ).DataTable(
        { 
            data : [],
            columns: [
                { data: 'name' },
                { data: 'type' },
                { data: 'last-discovered-at' },
                { data: 'published-on' },
                { data: 'description' },
                { data: 'depends-on' }
            ]
        }
    );

    var search = function (event) {
        event.preventDefault();
        $("#welcome").hide();
        $('#query').html($(".form-control").val());
        datatable.clear();
        $.ajax({ 
            type: 'GET', 
            url: config.catalogue.endpoint+"name/"+$(".form-control").val(), 
            data: null, 
            dataType: 'json',
            success: function (data) {
                if (data.constructor == Object) {
                    $("#searchcount").html(1);
                    datatable.rows.add([data]);
                }else{
                    $("#searchcount").html(data.length);
                    datatable.rows.add(data);
                }
                datatable.draw();
            },
            error : function(data) {
                $('#searchcount').html(0);
                datatable.draw();
            }
        });
        $("#searchresults").show();
    };
    
    $( "#searchBtn" ).click(search);
    $( "#searchform" ).submit(search);    
});