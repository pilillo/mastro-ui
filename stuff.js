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
                { data: 'depends-on' },
                { data: "tags[, ]"},
                { 
                    data: 'labels',
                    defaultContent: "-"
                }
            ]
        }
    );

    var search = function (event) {
        event.preventDefault();
        $("#welcome").hide();
        $('#query').html($(".form-control").val());
        datatable.clear();

        // if 1 element in form - query by name
        var tags = $(".form-control").val().split(",");
        if(tags.length > 1){
            for (var i = 0; i < tags.length; i++) {
                tags[i] = tags[i].trim();
            }
            var url = config.catalogue.endpoint+"/assets/tags";
            //var payload = { "tags": tags };
            var payload = JSON.stringify({ tags: tags })
        }else{
            var url = config.catalogue.endpoint+"/asset/name/"+tags[0];
            var payload = null;
        }
        console.log(payload);
        $.ajax({ 
            contentType: "application/json; charset=utf-8",
            type: 'GET', 
            url: url, 
            data: payload, 
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
                console.log(data);
                $('#searchcount').html(0);
                datatable.draw();
            }
        });
        $("#searchresults").show();
    };
    
    $( "#searchBtn" ).click(search);
    $( "#searchform" ).submit(search);    
});