Video =
{
	controlWidth : null,
	
	
	Init : $(document).ready(function()
	{
		FPS = 25;
		_vidWrapper  = $("video");
		_video 	 	 = $("video")[0];
				
		Video.CreateElement();
		Video.UpdateBuffer();
		
		_video.addEventListener('play',Video.CheckTimeCode,false)
	}),
	
	CreateElement : function()
	{
		_controls	 = '<div class="vid-controls">';
		_controls 	+= '<div class="play-btn play">&nbsp;</div>';
		_controls 	+= '<div class="bar-wrapper"><div class="buffer-bar"></div>';
		_controls 	+= '<div class="progress-bar"></div></div>';
		_controls 	+= '<div class="volume-wrapper"><div class="volume-btn unmute">&nbsp;</div>';
		_controls 	+= '<div class="volume-bar"></div></div>';
		_controls 	+= '</div>';
		
		_vidWrapper.after(_controls);
		
		_controlsWrapper 	= $(".vid-controls");
		_playButton 		= $(".play-btn");
		_volumeWrapper 		= $(".volume-wrapper");
		_barWrapper			= $(".bar-wrapper");
		_bufferBar			= $(".buffer-bar");
		_progressBar		= $(".progress-bar");
		
		//set styles
		_vidWidth = _vidWrapper.width()
		_barWidth = _vidWidth - (_playButton.width() + _volumeWrapper.width());
		
		_controlsWrapper.css({'width' : _vidWidth});
		_barWrapper.css({'width' : _barWidth});		
	},
	
	UpdateBuffer : function()
	{
		_video.addEventListener('progress',Video.GetBuffer,false);
	},
	
	GetBuffer : function()
	{
			_buffer = _video.buffered;
			_buffered = ( _buffer.end(0) / _video.duration) * _barWidth;
			_bufferBar.css({'width':_buffered});
	},
	
	CheckTimeCode : function()
	{
		setInterval("Video.TC()", FPS)
	},
	
	TC : function()
	{
		var tctc = Video.SecondsToTimecode(_video.currentTime, FPS);
		$("#current").html(tctc);
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