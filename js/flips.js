$(document).ready(function(){

	
	$('#myTable tfoot th').each( function () {
        var title = $('#myTable thead th').eq( $(this).index() ).text();
        $(this).html( '<input type="text" placeholder="Search" />');// '+title+'" />' );
    });

    table = $('#myTable').DataTable({
        ajax:        "/flips",
        scrollY:     '59vh',
        deferRender: true,
        scroller:    true,
        dom:         'it',
        columns: [
            { "title": "flip_id", "visible": false },
            { "title": "clip_id", "visible": false },
            { "title": "magnitude" },
            { "title": "direction" },
            { "title": "shape" },  
            { "title": "twist" },
            { "title": "Clip Name"}
        ]
    }); 

    table.columns().every( function () {
        var that = this;
        $( 'input', this.footer() ).on( 'keyup change', function () { 
        	that.search( this.value ).draw(); 
        });
    });


    $('#myTable').on('click', 'tr', function() { GetInfo(this); });
	player = new vidplayer(document.body);

    $('input[type="range"]').rangeslider();

});

function GetInfo(row)
{   var data = table.row(row).data();
    var headers = table.columns().header().map(function(head) { return head.innerHTML });
    var i = headers.indexOf("Clip Name")
    player.load(data[i]);
}





function buildFooters() {

//    $('#myTable tfoot th').each( function () {
//        var title = $('#myTable thead th').eq( $(this).index() ).text();
//        $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
//    });

    var headers = table.columns().header().map(function(head) { return head.innerHTML });
    var foot = document.createElement('tfoot');
    var row = document.createElement('tr');
    foot.appendChild(row);
    $(headers).each(function(head) {
        var box = document.createElement('th');
        $(box).html('<input type="text" placeholder="Search" />');// '+ head +'" />' );
        row.appendChild(box);
    });
    $('#myTable')[0].appendChild(foot);
}