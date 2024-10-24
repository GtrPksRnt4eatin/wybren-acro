timer = '';
canv = '';
canv2 = '';
slomo = false;
videos = [];
currentvid = {};

$(document).ready( function() {
	$.get('/clips', onVideos);
	rivets.bind( $('body'), { videos: videos, currentvid: currentvid, getLink: getLinkRV } );
	$('.controls').on( "input", "#rate", changeRate );
	$('body').on('keypress', keys);
	vid = id('vid');
	vid.onwheel = scroll;
	vid.addEventListener('timeupdate', updateProgress, false);
	vid.addEventListener('loadedmetadata', onMetadata, false);
	$('#progress').on( "input", scrub);
	id('rate').value = 100;
	$('.rate')[0].innerHTML = 'Rate: 100%';
	//getLink('test.webm');
	//$('#search table').DataTable();
});

var count;
var timer;

function onVideos(v) {
	videos.length = 0;
	count = 0;
	videos.push(v[0]);
	timer = setInterval( function(v) {
		count++;
		if(count>=v.length) { clearInterval(timer); return; }
		videos.push(v[count]);
	}.bind(null,v), 100);
}

function getLink(key) {
	$.post('/vidlink', { key: key }, onLink);
}

function getLinkRV(e,m) {
	$.post('/vidlink', { key: m.vid.clip_name }, onLink);
	updateModel(currentvid,m.vid);
}

function onLink(l) {
	$('#src1').attr('src', l['webm']);
	$('#src2').attr('src', l['mp4']);
	$('#vid').load();
	init();
}

function init() {
	$('#vid').currentTime = 0;
	updateProgress();
	play();
}

function play() {   
	if(vid.paused & !slomo) { 
		vid.play();
		id('play').innerHTML = '';
	}
	else { 
		if(timer) { clearInterval(timer); }
		id('slo').style.backgroundColor = 'initial';
		slomo = false;
		vid.pause(); 
		id('play').innerHTML = '';
	}	
}

function stop() {
	if(timer) { clearInterval(timer); }
	id('slo').style.backgroundColor = 'initial';
	slomo = false;
	vid.pause();	
	vid.currentTime = 0;
	id('play').innerHTML = '';
}

function superslowmo() {
	if(slomo) {
	  if(timer) { clearInterval(timer); }
	  id('slo').style.backgroundColor = 'initial';
	  id('play').innerHTML = '';
	  slomo = false;
	}
	else {
	  vid.pause();
	  id('slo').style.backgroundColor = 'green';
	  timer = setInterval(stepFW, 500);
	  id('play').innerHTML = '';
	  slomo = true;
	}	
}

function changeRate(e) {
	var x = e.target.value/100;
	console.log(x);
    vid.playbackRate = x;
    $('.rate')[0].innerHTML = 'Rate: ' + (x*100).toFixed() + '%';
}

function updateProgress() {
	var percentage = (1000 / vid.duration) * vid.currentTime;
	id('progress').value = percentage;
	$('.prog')[0].innerHTML = vid.currentTime.toFixed(2) + '/' + vid.duration.toFixed(2);
}

function scrub() {
	if(Math.abs(vid.currentTime - (id('progress').value/1000*vid.duration)) > .02) {
		vid.currentTime = (id('progress').value/1000) * vid.duration;
	}
}

function scroll(e) {
	if(e.deltaY>0) { stepBW(); }
	else { stepFW(); }
	e.preventDefault();
	return false;
}

function getNextValue(arr, value) {
    var i = arr.length;
    while (arr[--i] > value);
    return arr[++i]; 
}

function getLastValue(arr, value) {
    var i = 0;
    while (arr[++i] < value);
    return arr[--i]; 
}



function stepFW() {
		//console.log('fw');
		if(currentvid['vid_frames']) {
			vid.currentTime = getNextValue(currentvid['vid_frames'], vid.currentTime);
		}
		else {
			vid.currentTime = (vid.currentTime + 0.03).toFixed(2);
		}
		updateProgress();
		//console.log(vid.currentTime);
}

function stepBW() {
	//console.log('bw');
	if(currentvid['vid_frames']) {
		vid.currentTime = getLastValue(currentvid['vid_frames'], vid.currentTime);
	}
	else {
		vid.currentTime = (vid.currentTime - 0.03).toFixed(2);
	}
	updateProgress();
	//console.log(vid.currentTime);
}


function keys(e) {
	if(e.keyCode==37) { stepBW(); }
	if(e.keyCode==39) { stepFW(); }	
}

function compareFrames() {
	var last = canv.getImageData(0, 0, 1280, 720);
	canv.drawImage(vid, 0, 0, 1280, 720);
	var curr = canv.getImageData(0, 0, 1280, 720);
	var x = compareImages(last,curr);
	$('.match')[0].innerHTML = "Same Frame? " + x;
	return x;
}

function compareImages(img1,img2){
   console.log('comparing');
   if(img1.data.length != img2.data.length)
       { console.log('no match'); return false; }
   for(var i = 0; i < img1.data.length; i=i+100000){
       if(img1.data[i] != img2.data[i])
           { console.log('no match'); return false; }
   }
   console.log('match'); return true;   
}

function onMetadata() {
	updateProgress();
}
