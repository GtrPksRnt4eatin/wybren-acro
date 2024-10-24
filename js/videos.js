videos = [];
allvideos = [];
globalvid = {};

$(document).ready( function() {
  rivets.bind( $('body'), { videos: videos, getLink: getLink } );
  rivets.formatters.fmtrot = function(x) { return (x>0 ? (x + "/4") : ''); }
  rivets.formatters.fmttwist = function(x) { return (x>0 ? (x + "°") : ''); }
  $.get('/clips', onVideos);
});

var count;
var timer;

function onVideos(v) {
	videos.length = 0;
	count = 0;
	videos.push(v[0]);
	timer = setInterval( function(v) {
		count++;
		if(count>=v.length) { 
			$('#t').DataTable({
        	  "scrollY":        "200px",
        	  "scrollCollapse": true,
        	  "paging":         false 
            }); 
            clearInterval(timer); 
            return; 
       	}
		videos.push(v[count]);
	}.bind(null,v), 50);	
}

function getLink(e,m) {
	$.post('/vidlink', { key: m.vid.vid_key }, onLink);
}

function onLink(link) {
	$.post()
	window.location.href = link;
	$.get(link, onVid);
}

function onVid(vid) {
	var x = 5;
	globalvid = vid;
}