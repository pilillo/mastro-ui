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
        $('#query').html("\""+$(".form-control").val()+"\"");

        var query = $(".form-control").val()
        if (query !== null && query !== '') {
            $("#welcome").hide();
            datatable.clear();
            var elements = query.split(",");
            // get by name is 1 element only without #
            if(elements.length == 1 && !elements[0].includes("#")) {
                var url = config.catalogue.endpoint+"/asset/name/"+elements[0];
                var payload = null;
                var verb = 'GET';
            }else{
                // we either have a list of tags (>1) or whatever having # inside
                for (var i = 0; i < elements.length; i++) {
                    elements[i] = elements[i].trim().replace("#", "");
                }
                var url = config.catalogue.endpoint+"/assets/tags";
                var payload = JSON.stringify({ tags: elements })
                var verb = 'POST';
            }      
            
            console.log(payload);
            $.ajax({ 
                contentType: "application/json; charset=utf-8",
                type: verb, 
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
        }
    };
    
    $( "#searchBtn" ).click(search);
    $( "#searchform" ).submit(search);    
});