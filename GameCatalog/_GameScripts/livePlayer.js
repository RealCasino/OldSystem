var LivePlayer = window.LivePlayer = function(url, opts) {

	opts = opts || {};
	this.url = url;
	this.canvas = opts.canvas;
	this.streamLoadHandle = null;
	this.playVideoHandle = null;
	this.videoPlayer = null;
	var AudioContextClass = window.AudioContext || window.webkitAudioContext;
	this.audioContext = new AudioContextClass();
	this.previousBuffer = null;
	this.previousAudioBuffer = null;
	this.audioTime = 0;
	this.audioLength = 0;
	this.framePeriod = 0;
	this.lastFrameTime = 0;
	this.audioOffset = 0;
	this.currentChunkIndex = 0;
	this.videoFrames = [];
	this.lastFrameDate = 0;
	this.lastFrameTime = 0;
	this.mute = false;
    this.chunkLength = 0;
    this.init();
}

function sliceUint8Array(array, start, end) {
    if (!Uint8Array.prototype.slice) {
        return new Uint8Array(array.subarray(start, end));
    } else {
        return array.slice(start, end);
    }
}

LivePlayer.prototype.init = function () {
    var player = this;
    var hidden = "hidden";
    if (hidden in document)
        document.addEventListener("visibilitychange", onchange);
    else if ((hidden = "mozHidden") in document)
        document.addEventListener("mozvisibilitychange", onchange);
    else if ((hidden = "webkitHidden") in document)
        document.addEventListener("webkitvisibilitychange", onchange);
    else if ((hidden = "msHidden") in document)
        document.addEventListener("msvisibilitychange", onchange);
    else if ("onfocusin" in document)
        document.onfocusin = document.onfocusout = onchange;
    else
        window.onpageshow = window.onpagehide
        = window.onfocus = window.onblur = onchange;

    function onchange(evt) {
        var v = "visible", h = "hidden",
            evtMap = {
                focus: v, focusin: v, pageshow: v, blur: h, focusout: h, pagehide: h
            };

        evt = evt || window.event;
        if (evt.type in evtMap)
            player.document = evtMap[evt.type];
        else
            player.document = this[hidden] ? "hidden" : "visible";
        if (player.document === "hidden") {
            if (player.playing) {
                player.stop();
                player.playing = true;
            }
        } else {
		    if (player.playing) {
				player.playing = false;
                player.play();
            }
        }
    }
    if (document[hidden] !== undefined)
        onchange({ type: document[hidden] ? "blur" : "focus" });
}

LivePlayer.prototype.play = function () {
	var player = this;
	if (!this.playing) {
        var initRequest = new XMLHttpRequest();
        initRequest.timeout = 3000;

        initRequest.onload = function() {
            player.restarting = false;
            try {
                if (initRequest.status == 404) {
                    throw "Connection error!";
                }

                var streamData = JSON.parse(initRequest.responseText);
                player.initVideoStream(streamData);
            } catch (e) {
                player.restartStream();
            }
        };

        initRequest.onerror = function () {
            player.restarting = false;
	        player.restartStream();
        };
        initRequest.open("GET", this.url + "?_rand=" + Math.random() + "_" + new Date().getTime(), true);
        initRequest.send();
        this.playing = true;
    }
}

LivePlayer.prototype.stop = function() {
	if (this.streamLoadHandle) {
		clearInterval(this.streamLoadHandle);
	}

	if (this.playVideoHandle) {
		clearTimeout(this.playVideoHandle);
	}

	if (this.videoPlayer) {
		this.videoPlayer.stop();
	}
  this.playing = false;
}

LivePlayer.prototype.restartStream = function () {
    console.log('restart stream');
	var player = this;
	if (!player.restarting) {
	    player.restarting = true;
        this.stop();
        setTimeout(function () {
            player.startAudioPlayback();
            player.play();
        }, 500);
    }
}

LivePlayer.prototype.startAudioPlayback = function () {
	var buffer = this.audioContext.createBuffer(1, 1, 44100);
	var source = this.audioContext.createBufferSource();
	source.buffer = buffer;
	source.connect(this.audioContext.destination);
	if (source.start) {
	    source.start(0);
	} else {
	    source.noteOn(0);
	}
}

LivePlayer.prototype.initVideoStream = function (config) {
    var player = this;
    if (!player.playing) {
        this.stop();
    }

    this.videoPlayer = new jsmpeg({ width: config.width, height: config.height }, { canvas: this.canvas });
	this.currentChunkIndex = config.index;
	this.audioOffset = config.audioOffset;
	this.audioTime = 0;
	this.audioLength = 0;
	this.framePeriod = 1000 / config.fps;
	this.lastFrameDate = null;
	this.lastFrameTime = 0;
	this.chunkLength = config.period;
    this.previousBuffer = null;
    this.previousAudioBuffer = null;
    this.videoFrames = [];
    this.streamLoadHandle = setInterval(function () { player.loadVideoChunk() }, config.period);
	this.playVideoHandle = setTimeout(function () { player.playVideoFrames() }, 20);
    player.loadVideoChunk();
}

LivePlayer.prototype.loadVideoChunk = function () {
    var player = this;

	var videoRequest = new XMLHttpRequest();
    videoRequest.timeout =player.chunkLength-10;
	videoRequest.onload = function () {
		try {

			if (videoRequest.status == 404) {
				throw "Connection error!";
			}

			player.processVideoChunk(videoRequest.response);
		} catch (e) {
			console.log("failure: " + e.toString());
			player.restartStream();
		}
	};
	videoRequest.ontimeout = function (e) {
	    player.restartStream();
	};
	videoRequest.onerror = function () {
       player.restartStream();
	};
	videoRequest.open("GET", this.url + "/" + this.currentChunkIndex, true);
	videoRequest.responseType = "arraybuffer";
	videoRequest.send();

	this.currentChunkIndex++;
}

LivePlayer.prototype.playVideoFrames = function () {
	var player = this;
	var now = Date.now();
	while (this.videoFrames.length > 0) {
		if (this.videoFrames.length == 0 || this.videoFrames[0].time > now) {
			this.playVideoHandle = setTimeout(function () { player.playVideoFrames() }, 20);
			return;
		}

		var frame = this.videoFrames.shift();
		if (now - frame.time < 3000) {
			this.videoPlayer.receiveCustomMessage(frame.data);
		}
	}

	this.playVideoHandle = setTimeout(function () { player.playVideoFrames() }, 20);
}

LivePlayer.prototype.processVideoChunk = function (data) {
	data = new Uint8Array(data);
	var offset = 0;
    var player = this;
	while (offset < data.length) {
		var length = (data[offset] << 24) + (data[offset + 1] << 16) + (data[offset + 2] << 8) + data[offset + 3];
		offset += 4;
		if (length > 204800 || length < 1) {
			throw "Incorrect length";
		}

		switch (data[offset]) {
		case 0:
			var frameTime = (data[offset + 1] << 24) + (data[offset + 2] << 16) + (data[offset + 3] << 8) + data[offset + 4];
			if (!this.lastFrameTime) {
				this.lastFrameTime = frameTime;
			}
				
			if (!player.lastFrameDate) {
			    this.lastFrameDate = Date.now() + 500 + this.chunkLength;
			}

			this.lastFrameDate += frameTime - this.lastFrameTime;
			this.lastFrameTime = frameTime;
			this.videoFrames.push({ time: this.lastFrameDate, data: sliceUint8Array(data, offset + 5, offset + length).buffer });
			break;
		    case 1:
		            this.decodeAudio(sliceUint8Array(data, offset + 1, offset + length).buffer);
		    break;
		}

		offset += length;
	}
}

LivePlayer.prototype.decodeAudio = function (arrayBuffer) {
	if (this.previousBuffer != null) {
		var tmp = new Uint8Array(arrayBuffer.byteLength + this.previousBuffer.byteLength);
		var buffer = new Uint8Array(arrayBuffer);
		tmp.set(this.previousBuffer, 0);
		tmp.set(buffer, this.previousBuffer.byteLength);
		this.previousBuffer = buffer;
	    arrayBuffer = tmp.buffer;
	} else {
	    this.previousBuffer = new Uint8Array(arrayBuffer);
	}

	var player = this;
	player.audioContext.decodeAudioData(arrayBuffer, function (buffer) {
	    try {
	        if (player.previousAudioBuffer) {
	            var offset = player.audioLength > 0 ? player.audioLength : 0;
	            player.audioLength = player.previousAudioBuffer.duration - offset;

	            for (var c = 0; c < player.previousAudioBuffer.numberOfChannels; c++) {
	                var data = player.previousAudioBuffer.getChannelData(c);
	                var newData = buffer.getChannelData(c);
	                var off = Math.floor(player.audioLength/buffer.duration * buffer.length);
	                for (var i = 0; i < 2000; i++) {
	                    data[data.length - i] = newData[off - i];
	                }
	            }

	            var source = player.audioContext.createBufferSource();
	            if (player.audioTime == 0) {
	                player.audioTime = player.audioContext.currentTime + player.audioOffset / 1000;
	            }

	            source.buffer = player.previousAudioBuffer;
	            source.connect(player.audioContext.destination);
	            if (!player.mute) {
	                source.start(player.audioTime, offset);
	            }
	            player.audioTime += player.audioLength;
	        }

	        player.previousAudioBuffer = buffer;
	    } catch (e) {
	        player.restartStream();
	    }
	}, function (e) {
	    console.log('audio error');
	    player.restartStream();
	});
}