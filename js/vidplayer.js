function vidplayer(parent) {
	this.bg = make('div','vidbg',parent)
	this.el = make('div','vidplayer',this.bg);
	this.titlebar  = new tbar(this);
	this.video     = new vidwin(this);
	this.controls  = new ctrlbar(this);

	this.bg.addEventListener('click', function() { this.hide(); this.video.pause(); }.bind(this));
	this.controls.el.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); return false; } );
	this.video.el.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); return false; } );
	
	this.slomo = false;
}

vidplayer.prototype = {
	constructor: vidplayer,
	init: function() {
		this.video.currentTime = 0;
		this.updateProgress();
	},
	show: function()     { $(this.bg).show(); },
	hide: function()     { $(this.bg).hide(); },
	load: function(key)  { $.post('/vidlink', { key: key }, this.on_link.bind(this) ); this.titlebar.set(key); }, 
	on_link: function(l) { this.video.load(l); this.show(); this.update_rate(); this.play(); },
	updateProgress: function() { this.controls.progbtn.update.call(this.controls.progbtn) },
	play: function() {  
		if(this.video.paused() && !this.slomo) { 
			this.video.play();
			this.controls.playbtn.innerHTML = '';
		}
		else { 
			if(this.timer) { clearInterval(this.timer); }
			this.controls.slowbtn.style.backgroundColor = 'initial';
			this.slomo = false;
			this.video.pause(); 
			this.controls.playbtn.innerHTML = '';
		}
	},
	pause: function() {
	  if(this.timer) { clearInterval(this.timer); }
	  this.controls.slowbtn.style.backgroundColor = 'initial';
	  this.slomo = false;
	  this.video.pause(); 
	  this.controls.playbtn.innerHTML = '';
	},
	stop: function() {
	  if(this.timer) { clearInterval(this.timer); }
	  this.controls.slowbtn.style.backgroundColor = 'initial';
	  this.slomo = false;
	  this.video.pause(); 
	  this.controls.playbtn.innerHTML = '';
	  this.video.el.currentTime = 0;
	  this.controls.playbtn.innerHTML = '';
	},
	reset: function() {
	  this.video.el.currentTime = 0;
	  this.controls.playbtn.innerHTML = '';
	},
	scroll: function(e) {
		if(e.deltaY>0) { this.stepBW(); }
		else { this.stepFW(); }
		e.preventDefault();
		return false;
	},
	scrub: function(e) {
		if(Math.abs(this.video.el.currentTime - (e.target.value/1000*this.video.el.duration)) > .02) {
			this.video.el.currentTime = (e.target.value/1000) * this.video.el.duration;
		}
	},
	stepFW: function() {
		//if(currentvid['vid_frames']) { vid.currentTime = getNextValue(currentvid['vid_frames'], vid.currentTime); }
		//else {
		this.video.el.currentTime = (this.video.el.currentTime + 0.04).toFixed(2);
		//}
		this.updateProgress();
		//console.log(vid.currentTime);
	},
	stepBW: function() {
	//if(currentvid['vid_frames']) {
	//	vid.currentTime = getLastValue(currentvid['vid_frames'], vid.currentTime);
	//}
	//else {
		this.video.el.currentTime = (this.video.el.currentTime - 0.04).toFixed(2);
	//}
		this.updateProgress();
	//console.log(vid.currentTime);
	},
	slo_mo: function() {
	  if(this.slomo) {
	  	if(this.timer) { clearInterval(this.timer); }
	    this.controls.slowbtn.style.backgroundColor = 'initial';
	    this.controls.playbtn.innerHTML = '';
	    this.slomo = false;
	  }
	  else {
	    this.video.pause();
	    this.timer = setInterval(this.stepFW.bind(this), 200);
	    this.controls.slowbtn.style.backgroundColor = 'green';
	    this.controls.playbtn.innerHTML = '';
	    this.slomo = true;
	  }
	},
	update_rate: function() {
	  var rate = this.controls.ratebtn.slider.value/100;
      this.video.el.playbackRate = rate;
    }
}


function tbar(parent) {
	this.el = make('div','vidtitle',parent.el);
	this.set = function(title) { this.el.innerHTML = title; }
}

function vidwin(parent) {
	this.parent = parent;
	this.el = make('video','vid',parent.el);
	this.src1 = make('source','',this.el);
	this.src2 = make('source','',this.el);
	this.load = function(l) {
		$(this.src1).attr('src', l['webm']);
		$(this.src2).attr('src', l['mp4']);
		this.el.load();
	}
	this.el.onwheel = this.parent.scroll.bind(this.parent);
	this.el.addEventListener('timeupdate', this.parent.updateProgress.bind(this.parent), false);
	this.el.addEventListener('loadedmetadata', this.parent.onMetadata, false);
	this.el.addEventListener('ended', this.parent.reset.bind(this.parent), false);
	this.paused = function() { return this.el.paused; }
	this.pause = function() { this.el.pause(); }	
	this.play = function() { this.el.play(); }
}

function ctrlbar(parent) {
	this.parent  = parent;
	this.el      = make('div','controls',parent.el);

	this.playbtn = make('div','play',this.el); 
	this.playbtn.innerHTML = '';
	this.playbtn.addEventListener('click', this.parent.play.bind(this.parent) );

	this.stopbtn = make('div','stop',this.el); 
	this.stopbtn.innerHTML = '';
	this.stopbtn.addEventListener('click', this.parent.stop.bind(this.parent) );

	this.ratebtn = new ratectrl(this);
	this.progbtn = new progressctrl(this);
	
	this.backbtn = make('button','framebw',this.el);
	this.backbtn.addEventListener('click', this.parent.stepBW.bind(this.parent) );

	this.forebtn = make('button','framefw',this.el);
	this.forebtn.addEventListener('click', this.parent.stepFW.bind(this.parent) );

	this.slowbtn = make('button','slomo',this.el);
    this.slowbtn.addEventListener('click', this.parent.slo_mo.bind(this.parent) );
}

function ratectrl(parent) {
	this.parent = parent;
	this.el     = make('div','ctrl',parent.el);
	this.slider = make_slider('rateslider',this.el,10,100);
	this.gauge  = make('div','rategauge',this.el);
	this.gauge.innerHTML = 'Rate: 100%';
	this.slider.value = 100;

	this.el.addEventListener('input', function(e) {
	  var x = e.target.value/100;
	  this.parent.parent.update_rate.call(this.parent.parent);
	  this.gauge.innerHTML = 'Rate: ' + (x*100).toFixed() + '%';
    }.bind(this));
}

function progressctrl(parent) {
	this.parent = parent;
	this.el     = make('div','ctrl',parent.el);
	this.slider = make_slider('progslider',this.el,0,1000);
	this.gauge  = make('div','proggauge',this.el);
	this.update = function(val) {
		var percentage = (1000 / this.parent.parent.video.el.duration) * this.parent.parent.video.el.currentTime;
		this.slider.value = percentage;
		this.gauge.innerHTML = this.parent.parent.video.el.currentTime.toFixed(2) + '/' + this.parent.parent.video.el.duration.toFixed(2);
	}
	this.el.addEventListener('input', this.parent.parent.scrub.bind(this.parent.parent) );
}

function make_slider(cls,appendto,min,max) {
  var el = make('input',cls,appendto);
  el.setAttribute('type','range');
  el.setAttribute('min',min);
  el.setAttribute('max',max);
  return el;
}

function make(tag,cls,appendto) {
  var el = document.createElement(tag);
  el.className = cls;
  appendto.appendChild(el);
  return el;
} 