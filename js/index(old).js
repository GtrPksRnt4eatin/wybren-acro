$(document).ready(function(){

  /* 
	
	$('#myTable tfoot th').each( function () {
        var title = $('#myTable thead th').eq( $(this).index() ).text();
        $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
    });

    table.columns().every( function () {
        var that = this;
        $( 'input', this.footer() ).on( 'keyup change', function () { 
        	that.search( this.value ).draw(); 
        });
    });
*/

    $('#myTable').on('click', 'tr', function() { GetInfo(this); });
	player = new vidplayer(document.body);
});

function GetInfo(row)
{   var data = table.row(row).data();
    var headers = table.columns().header().map(function(head) { return head.innerHTML });
    var i = headers.indexOf("Clip Name")
    player.load(data[i]);
}

function ChooseClips() {
    killTable();
    table = $('#myTable').DataTable({
        ajax:        "/clips",
        scrollY:     600,
        deferRender: true,
        scroller:    true,
        dom:         'it',
        columns: [
            { "title": "clip_id", "visible": false},
            { "title": "Num of People" },
            { "title": "Start Position" },
            { "title": "Clip Name" }
        ]
    }); 

    buildFooters();
}

function ChooseFlips() {
    killTable();
    table = $('#myTable').DataTable({
        ajax:        "/flips",
        scrollY:     600,
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
    buildFooters();
}

function ChoosePoses() {
    killTable();
    table = $('#myTable').DataTable({
        ajax:        "/poses",
        scrollY:     600,
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
    buildFooters();
}


function killTable() {
    if(typeof table != 'undefined' ) { table.destroy() };
    $('#myTable').empty();
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
        $(box).html('<input type="text" placeholder="Search '+ head +'" />' );
        row.appendChild(box);
    });
    $('#myTable')[0].appendChild(foot);
}