Video =
{
	controlWidth : null,
	
	Init : $(document).ready(function()
	{
		FPS = 25;
		_vidWrapper  = $("video");
		_video 	 	 = $("video")[0];
		Reverse 	 = null;
		Play		 = null;
		
		Video.CreateElement();
		
		_video.addEventListener('loadedmetadata',function(){
			console.log("!! MEDIA_DATA_LOADED !!")
		},false);
		
		_video.addEventListener('progress',Video.GetBuffer,false);
				
		_backImage.click(function(){
			Video.StepBackward();
		});
		
		_backPlay.click(function(){
			Video.PlayBackward();
		});
		
		_pause.click(function(){
			Video.Pause();
			Video.ResetActiveClass();
			Video.SetActive(_pause);
		});
		
		_forwardPlay.click(function(){
			Video.PlayForward();
		});
		
		_forwardImage.click(function(){
			Video.StepForward();
		});	
		
		setInterval(function(){
			Video.CurrentTimeSlide();
			Video.Time();
		},FPS);
	}),
	
	Time : function()
	{
		_tp = Video.SecondsToTimecode(_video.currentTime, FPS);
		_td = Video.SecondsToTimecodeLeft(_video.currentTime, _video.duration, FPS);
		_timePlayed.html(_tp);
		_timeLeft.html(_td);
	},
	
	ResetActiveClass : function()
	{
		_commonButton.removeClass("active");
	},
	
	ResetHoverClass : function()
	{
		_commonButton.removeClass("hover");
	},
	
	SetActive : function(_el)
	{
		_el.addClass("active");
	},
	
	StepBackward : function()
	{
		Video.ResetActiveClass();
		Video.SetActive(_backImage);
		Video.Pause();
		_video.currentTime -= 1/FPS;
	},
	
	PlayBackward : function()
	{
		Video.ResetActiveClass();
		Video.SetActive(_backPlay);
		Video.Pause();
		Reverse = setInterval("Video.Reverse()", FPS);
	},
	
	Reverse : function()
	{
		_video.currentTime -= .025;
	},
	
	Pause : function()
	{
		clearInterval(Reverse);
		_video.pause();
	},
	
	PlayForward : function()
	{	
		Video.ResetActiveClass();
		Video.SetActive(_forwardPlay);
		Video.Pause();
		_video.play();
	},
	
	StepForward : function()
	{	
		Video.ResetActiveClass();
		Video.SetActive(_forwardImage);
		Video.Pause();
		_video.currentTime += 1/FPS;
	},
	
	CurrentTimeSlide : function()
	{
		_slideValue = parseInt((_video.currentTime / _video.duration) * _barWidth);
		_slider.slider("value", _slideValue);
	},
	
	CreateElement : function()
	{
		//create button-controls
		_controls	 = '<div class="vid-controls">';
		_controls 	+= '<div class="control-container clearfix"><div class="play-btn back-image">&nbsp;</div><div class="play-btn back-play">&nbsp;</div><div class="play-btn pause active">&nbsp;</div><div class="play-btn forward-play">&nbsp;</div><div class="play-btn forward-image">&nbsp;</div></div>';
		_controls 	+= '<div class="bar-wrapper"><div class="time" id="t-played">00:00:00:00</div>',
		_controls 	+= '<div class="playing-bar"><div class="buffer-bar"></div>';
		_controls 	+= '<div class="progress-bar"></div></div><div class="time" id="t-left">00:00:00:00</div></div>';
		_controls 	+= '<div class="volume-wrapper"><div class="volume-btn unmute">&nbsp;</div>';
		_controls 	+= '<div class="volume-bar"></div></div>';
		_controls 	+= '</div>';
		
		_vidWrapper.after(_controls);
		
		_timePlayed			= $("#t-played");
		_timeLeft			= $("#t-left");
		_windowWidth		= $(document).width();
		_commentWidth		= $("#comment-wrapper").width();
		_videoWrapper		= $("video");
		_controlsWrapper 	= $(".vid-controls");
		_buttonsWrapper		= $(".control-container");
		_timeContainer		= $(".time");
		_volumeWrapper 		= $(".volume-wrapper");
		_commonButton		= $(".play-btn");
		_barWrapper			= $(".bar-wrapper");
		_bufferBar			= $(".buffer-bar");
		_playingBar			= $(".playing-bar")
		_progressBar		= $(".progress-bar");
		_backImage			= $(".back-image");
		_backPlay			= $(".back-play");
		_pause				= $(".pause");
		_forwardPlay		= $(".forward-play");
		_forwardImage		= $(".forward-image");

		//set styles
		_vidWrapperWidth = (_windowWidth - _commentWidth)-20;
		_vidWrapper.css({'width':_vidWrapperWidth});
		_barWidth = _vidWrapperWidth - (_timeContainer.outerWidth() * 2) - 4;
		
		_controlsWrapper.css({'width' :_vidWrapperWidth});
		_playingBar.css({'width' : _barWidth});
		_slider = _progressBar.slider({
			min : 0,
			max : _barWidth,
			range : "min",
			slide : function(event, ui)
			{
				Video.Pause();
				_slideValue = (ui.value / _barWidth) * _video.duration;
				_video.currentTime = _slideValue;
				Video.ResetActiveClass();
			}
		});	
		
		//hover bouton
		_commonButton.mouseenter(function()
		{
			if($(this).hasClass("active"))
			{			
			}
			else
			{
				Video.ResetHoverClass();
				$(this).addClass("hover");
			}
		});
		_commonButton.mouseleave(function()
		{
				Video.ResetHoverClass();
		});
	},

	GetBuffer : function()
	{
			console.log("VIDEO_BUFFERING");
			_buffer = _video.buffered;
			_buffered = ( _buffer.end(0) / _video.duration) * _barWidth;
			_bufferBar.css({'width':_buffered});
	},
		
	/*----------*/
	/* TIMECODE */
	/*----------*/
	
	TimecodeToSeconds : function(hh_mm_ss_ff, fps)
	{
		var tc_array = hh_mm_ss_ff.split(":");
		var tc_hh = parseInt(tc_array[0]);
		var tc_mm = parseInt(tc_array[1]);
		var tc_ss = parseInt(tc_array[2]);
		var tc_ff = parseInt(tc_array[3]);
		
		var tc_in_seconds = ( tc_hh * 3600 ) + ( tc_mm * 60 ) + tc_ss + ( tc_ff / fps );
		
		return tc_in_seconds;
	},
	
	SecondsToTimecodeLeft : function(time, duration, fps)
	{
		_leftTimecode = duration - time;
		var hours = Math.floor(_leftTimecode / 3600) % 24;
		var minutes = Math.floor(_leftTimecode / 60) % 60;
		var seconds = Math.floor(_leftTimecode % 60);
		var frames = Math.floor(((_leftTimecode % 1)*fps).toFixed(3));
		
		var result = (hours < 10 ? "0" + hours : hours) + ":"
		+ (minutes < 10 ? "0" + minutes : minutes) + ":"
		+ (seconds < 10 ? "0" + seconds : seconds) + ":"
		+ (frames < 10 ? "0" + frames : frames);
	
		return result;
	},
	
	SecondsToTimecode : function(time, fps)
	{
		var hours = Math.floor(time / 3600) % 24;
		var minutes = Math.floor(time / 60) % 60;
		var seconds = Math.floor(time % 60);
		var frames = Math.floor(((time % 1)*fps).toFixed(3));
		
		var result = (hours < 10 ? "0" + hours : hours) + ":"
		+ (minutes < 10 ? "0" + minutes : minutes) + ":"
		+ (seconds < 10 ? "0" + seconds : seconds) + ":"
		+ (frames < 10 ? "0" + frames : frames);
	
		return result;
	}
}