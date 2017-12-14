var Module = {};
Client = function (stream) {
    var self = this;
    var streamOnly = stream;
    var MAX_VIDEO_CUT = 5,
        MAX_VIDEO_TIMEOUT = 5,
        MIN_VIDEO_TIMEOUT = 0.8,
        QUALITY_REDUCTION_TIMEOUT = 3;

    var messageType = {
        Logic: 0,
        Shutdown: 1,
        Restart: 2,
        Disable: 5,
        Enable: 6,
        SetCookie: 20,
        PopUp: 50,
        VOD: 100,
        Virtual:200,
        nextGameHash: 510,
        thisGameSeeds: 520,
        TimeLimit: 2000
    }
    var disableReason= {
        timeout: 0,
        temporarilyStop: 1,
        permanentlyStop:2
    }
    var hlsStream = "",
        wsStream = "",
        rtmpStream = "",
        mpegStream = "",
        vodUrl = "",
        virtualUrl = "",
        gameId = "",
        instanceId = "",
        clientType = "",
        gameUrl = "",
        referenceId = "",
        offset = 0,
        messageCallback,
        errorCallback,
        currentLocale = "en",
        langId = "",
        localizationDic = {},
        localizedStrings = [],
        videoLoadTimeouts = [1],
        vodPlayers = {},
        videoStreams = [],
        canvasPlayerId = "",
        startedPlayerId = "",
        prevPlayer = null,
        messageId = 0,
        gameToken = "",
        errorCount = 0,
        instanceGuid = "",
        rulesUrl="",
        webSocket;
        instanceDisabled=true;
        jsmpegData= {};
    function loadScript(url, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onreadystatechange = callback;
        script.onload = callback;
        head.appendChild(script);
    }
    function updateLocalizedStrings() {
        var localizedList = document.querySelectorAll(".localized");
        for (var i = 0, length = localizedList.length; i < length; i++) {
            localizedList[i].innerHTML = self.getLocalizedString(localizedList[i].getAttribute('key'));
        }
        for (i = 0, length = localizedStrings.length; i < length; i++) {
            var item = localizedStrings[i];
            if ($("#" + item.id).length)
                $("#" + item.id).innerHTML = self.getLocalizedString(item.key, item.data);
            else {
                delete item;
            }
        }
    }
    function getUrlParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };
    function systemMessageDispatcher(data) {
        var msg = JSON.parse(data.Message);
        switch (data.Type) {
            case messageType.VOD:
                if (msg.vodType == 1) {
                    if (msg.target === "background") {
                        if (self.winnersMsg && document.getElementById("winners")) {
                            Anim.fadeOut(document.getElementById("winners"), {
                                duration: 300,
                                complete: function () {
                                    if (document.getElementById("winners"))
                                    self.player.parentElement.removeChild(document.getElementById("winners"));
                                }
                            });
                        }
                        self.vodObj = { items: msg.items, time: new Date() };
                        function playVideo(videos, index) {
                            if (self.player && !self.waitEnd) {
                                if (videos && videos.length > 0) {
                                    if (videos[index]['wait_previous'] > 0) {
                                        self.waitEnd = true;
                                        setTimeout(function () {
                                            self.waitEnd = false;
                                        }, videos[index]['wait_previous'] * 1000);
                                    } else {
                                        self.waitEnd = false;
                                    }
                                    if (!videos[index]['loop']){
                                        videos[index]['loop'] = false;
                                    }
                                    self.playVideo({ path: videos[index]['name'], length: videos[index]['length'], offset: videos[index]['offset'], loop: videos[index]['loop'] }, null, function () {
                                        index++;
                                        if (index < videos.length) {
                                            if (self.videoEnabled)
                                             playVideo(videos, index);
                                        }
                                        self.waitEnd = false;
                                    });
                                }
                            } else {
                                setTimeout(function () {
                                    if (self.videoEnabled)
                                     playVideo(videos, index);
                                }, 300);
                            }
                        }
                        if (self.videoEnabled)
                          playVideo(msg.items, 0);
                    } else if (msg.target === "overlay") {
                        for (var i in msg.items) {
                            msg.items[i].path = msg.items[i].path + "." + msg.items[i].type;
                            self.playSprite(msg.items[i], msg.items[i].stopOnComplete ? false : true);
                        }
                    }
                } else if (msg.vodType == 20) {
                    function startWinnerShow() {
                        if (Boolean(self.player)) {
                            if (msg.target === "overlay") {
                                msg.intro.path = msg.intro.path + "." + msg.type;
                                msg.intro.name = msg.name + "intro";
                                msg.intro.opacity = msg.opacity;
                                msg.outro.path = msg.outro.path + "." + msg.type;
                                msg.outro.name = msg.name + "outro";
                                msg.outro.opacity = msg.opacity;
                                if (!isMobile.phone())
                                setTimeout(function () {
                                    if (isMobile.any() && msg.still) {
                                        msg.still.frameCount = 1;
                                       self.playSprite(msg.still, false, function () {
                                            self.showWinners(msg);
                                        });
                                    } else {
                                        self.playSprite(msg.intro, false, function() {
                                            self.showWinners(msg);
                                        });
                                    }
                                }, 300);
                                if (msg.video) {
                                    self.vodObj = { items: [{ path: msg.video, length: msg['length'], offset: msg['offset'], loop: true, fastAnimation: true }], time: new Date()};
                                    if (self.videoEnabled) {
                                        self.playVideo({ path: msg.video, length: msg['length'], offset: msg['offset'], loop: true, fastAnimation: true }, null, function() {
                                        });
                                        if (self.introCallback) {
                                            self.introCallback();
                                        }
                                    }
                                }
                            } else {
                                if (isMobile.any() && !isMobile.pad()) {
                                    setTimeout(function () {
                                        if (!isMobile.phone())
                                            self.showWinners(msg);
                                    }, 300);
                                } else {
                                    if (msg.intro) {
                                        self.vodObj = { items: [{ path: msg.intro, length: msg['length'], offset: msg['offset'] }], time: new Date() };
                                        if (self.videoEnabled) {
                                            self.playVideo({ path: msg.intro, length: msg['length'], offset: msg['offset'] }, null, function () {
                                            self.playVideo({ path: msg.loop, length: msg['length'], offset: msg['offset'], loop: true, fastAnimation: true }, null, function() {
                                            });
                                            if (self.introCallback) {
                                                self.introCallback();
                                            }
                                            if (!isMobile.phone())
                                                self.showWinners(msg);
                                        });
                                    }
                                } else {
                                        self.vodObj = { items: [{ path: msg.loop, length: msg['length'], offset: msg['offset'], loop: true, fastAnimation: true }], time: new Date() };
                                        if (self.videoEnabled) {
                                            self.playVideo({ path: msg.loop, length: msg['length'], offset: msg['offset'], loop: true, fastAnimation: true }, null, function() {
                                            });
                                            if (self.introCallback) {
                                                self.introCallback();
                                            }
                                            if (!isMobile.phone())
                                                self.showWinners(msg);
                                        }
                                    }
                                }
                            }
                            self.winnersMsg = msg;
                        } else {
                            setTimeout(function () {
                                startWinnerShow();
                            }, 300);
                        }
                    }
                    startWinnerShow();
                } else if (msg.vodType == 5) {
                    function hideOverlay() {
                        if (Boolean(self.player)) {
                            if (msg.items) {
                                for (var i in msg.items)
                                    self.hideSprite(msg.items[i].name);
                            }
                            if (document.getElementById("winners")) {
                                if (self.winnersMsg) {
                                    if (isMobile.any()) {
                                        var sprites = document.getElementsByClassName("sprites");
                                        for (var i = 0; i < sprites.length; i++) {
                                            self.hideSprite(sprites[i].getAttribute('id'));
                                        }
                                        if (document.getElementById("winners"))
                                            self.player.parentElement.removeChild(document.getElementById("winners"));
                                        self.winnersMsg = null;
                                    } else {
                                        self.playSprite(self.winnersMsg.outro, false, function() {
                                                setTimeout(function() {
                                                    Anim.fadeOut(document.getElementById("winners"), {
                                                        duration: 300,
                                                        complete: function() {
                                                            if (document.getElementById("winners"))
                                                                self.player.parentElement.removeChild(document.getElementById("winners"));
                                                        }
                                                    });
                                                    if (self.winnersMsg)
                                                       self.hideSprite(self.winnersMsg.intro.name);
                                                }, 200);
                                            },
                                            function() {
                                                var sprites = document.getElementsByClassName("sprites");
                                                for (var i = 0; i < sprites.length; i++) {
                                                    self.hideSprite(sprites[i].getAttribute('id'));
                                                }
                                                if (self.winnersMsg)
                                                    self.hideSprite(self.winnersMsg.intro.name);
                                                self.winnersMsg = null;
                                            }, function() {
                                                if (document.getElementById("winners"))
                                                    self.player.parentElement.removeChild(document.getElementById("winners"));
                                                if (self.winnersMsg)
                                                    self.hideSprite(self.winnersMsg.intro.name);
                                            });
                                        setTimeout(function () {
                                            if (document.getElementById("winners"))
                                                self.player.parentElement.removeChild(document.getElementById("winners"));
                                            if (self.winnersMsg)
                                                self.hideSprite(self.winnersMsg.intro.name);
                                        }, 4000);
                                    }
                                } else {
                                    var sprites = document.getElementsByClassName("sprites");
                                    for (var i = 0; i < sprites.length; i++) {
                                        self.hideSprite(sprites[i].getAttribute('id'));
                                    }
                                }
                            } else {
                                var sprites = document.getElementsByClassName("sprites");
                                for (var i = 0; i < sprites.length; i++) {
                                    self.hideSprite(sprites[i].getAttribute('id'));
                                }
                            }

                        } else {
                            setTimeout(function () {
                                hideOverlay();
                            }, 300);
                        }
                    }
                    hideOverlay();
                } else if (msg.vodType == 50) {
                    if ((isMobile.iOS() && !isMobile.iPad() && getIOSVersion() < 10) || (isMobile.Android() && getChromeVersion() < 53)) {
                        self.videoQualities = msg.stream_data.quality.ogv;
                    } else {
                        self.videoQualities = msg.stream_data.quality.mp4;
                    }
                    self.videoQualities.unshift("auto");
                    if (!self.setVideoQuality(getCookie('video_quality')))
                        if (!self.setVideoQuality('auto')) {
                            self.setVideoQuality(self.videoQualities[0]);
                        }
                }
                break;
            case messageType.Virtual:
                SendMessage("ExternalAPI", "changeState", JSON.stringify(msg));
                break;
            case messageType.TimeLimit:
                self.showGameTimer(parseInt(msg.timeLimit));
                break;
            case messageType.SetCookie:
                createCookie(msg.key, msg.value, parseInt(msg.expiration_date));
                break;
            case messageType.PopUp:
                self.showPopupFrame(msg.popup);
                break;
            case messageType.Shutdown:
                self.lastSystemMessage = messageType.Shutdown;
                var time = 3;
                var text = "<div id='message-text'>{0}</div>".format(self.getLocalizedString("Sorry, we have to shutdown this game in {0} seconds. Your unfinished bets will be returned. We are trying to get the game back to you ASAP.", true));
                if (msg.date) {
                    var endDate = new Date(msg.date);
                    time = ((endDate - new Date()) / 1000);
                    time = time > 0 ? parseInt(time) : 0;
                    var timer = setInterval(function () {
                        time--;
                        if (time >= 0)
                            document.getElementById('message-text').innerHTML = text.format(time);
                        else
                            clearInterval(timer);
                    }, 1000);
                }
                self.showMessage(text.format(time), time * 1000);
                break;
            case messageType.Restart:
                self.lastSystemMessage = messageType.Restart;
                var time = 3;
                var text = "<div id='message-text'>{0}</div>".format(self.getLocalizedString("Sorry, we have to restart the game in {0} seconds.  Your unfinished bets will be returned. Game will be back shortly.",true));
                if (msg.date) {
                    var endDate = new Date(msg.date);
                    time = ((endDate - new Date()) / 1000);
                    time = time > 0 ? parseInt(time) : 0;
                    var timer = setInterval(function () {
                        time--;
                        if (time >= 0)
                            document.getElementById('message-text').innerHTML = text.format(time);
                        else
                            clearInterval(timer);
                    }, 1000);
                }
                self.showMessage(text.format(time), time * 1000);
                break;
            case messageType.Disable:
                    if (msg.reason == disableReason.temporarilyStop || msg.reason == disableReason.timeout) {
                        self.showMessage(self.getLocalizedString("We have detected some troubles and paused  the gaming. Please stay with us, we'll fix this issue shortly.", true), 5000);
                    } else {
                        self.showMessage(self.getLocalizedString("This game session is over. Thank you for playing.", true), 5000);
                        self.enableVideo(false);
                        if (msg.offline_image) {
                            var stub = document.createElement('div');
                            stub.style['background-color'] = "#000";
                            stub.style['z-index'] = "99999";
                            stub.innerHTML = "<div  display: table;position: absolute;height: 100%'><div style='vertical-align: middle;display: table-cell'><img src='" + msg.offline_image + "' style='width:100%;'></img></div></div>";
                            document.body.appendChild(stub);
                        }
                    }
                self.lastSystemMessage = messageType.Disable;
                self.instanceDisabled = true;
                break;
            case messageType.Enable:
                if (self.lastSystemMessage === messageType.Disable) {
                    document.body.removeChild(document.getElementById('system_message'));
                }
                self.showMessage(self.getLocalizedString("Gaming is resumed, please enjoy.",true), 5000);
                self.lastSystemMessage = messageType.Enable;
                self.instanceDisabled = false;
                break;
            case messageType.RoundCancel:
                self.showMessage(self.getLocalizedString("The round results for the round {$roundId} were cancelled by administration. Please contact us for more information.", true, { roundId: msg.roundId }), 5000);
                break;
            case messageType.nextGameHash:
                if(!self.provablyFair)
                    self.provablyFair = {};
                self.provablyFair.nextGame = { hash: msg.hash, seed: self.generateClientSeed() };
                if (document.getElementById('provably-fair-box'))
                    self.showProvablyFair();
                break;
            case messageType.thisGameSeeds:
                if (!self.provablyFair)
                    self.provablyFair = {};
                self.provablyFair.thisGame = msg;
                if (document.getElementById('provably-fair-box'))
                    self.showProvablyFair();
                break;
        }
    }
    function openSocketConnection() {
        var sUrl;
        if ((new RegExp("^https\:?")).test(document.location.protocol))
            sUrl = "wss://" + document.location.hostname + ":8091";
        else
            sUrl = "ws://" + document.location.hostname + ":8090";
        webSocket = new WebSocket(sUrl);
        webSocket.onopen = function () {
            console.log("Connection is open...");
        };
        webSocket.onmessage = function (evt) {
            var data = JSON.parse(evt.data);
            if (data.type === "ready") {
                webSocket.send(JSON.stringify({
                    type: "init",
                    instanceId: instanceId,
                    sessionToken: gameToken,
                    instanceToken: instanceGuid
                }));
            } else if (data.type === "message") {
                try {
                    var msg = data.data;
                    if ((offset + 1) !== parseInt(data.data.MessageId))
                        console.error("Error: Invalid messageId");

                        offset = parseInt(data.data.MessageId);
                        if (msg.Type === messageType.Logic) {
                            var jsonMsg = JSON.parse(msg.Message);
                            if (jsonMsg.type == "balance") {
                                window.parent.postMessage({ type: 'user_info', balance: jsonMsg.message.balance }, "*");
                            }
                            if (messageCallback)
                            messageCallback(jsonMsg);
                    } else
                        systemMessageDispatcher(msg);
                } catch (err) {
                    console.error('Message dispatch error!');
                    console.error(err);
                }
            } else if (data.type === "shutdown") {
                if (!streamOnly) {
                    self.SESSION_EXPIRED = true;
                    self.enableVideo(false);
                    setTimeout(function () {
                        self.showPromt(self.getLocalizedString("For your safety we automatically logged you out.", true), self.getLocalizedString("Reload", true), self.getLocalizedString("Go to main page", true), function () {
                            window.parent.postMessage({ type: 'refresh' }, "*");
                        }, function () {
                            window.parent.postMessage({ type: 'home' }, "*");
                        });
                    }, 2000);
                } else {
                    setTimeout(function () {
                        window.location.reload();
                    }, 3000);
                }
                if (errorCallback)
                    errorCallback(data);
            } else if (data.type === "failure") {
                if (!streamOnly) {
                    self.SESSION_EXPIRED = true;
                    self.enableVideo(false);
                    setTimeout(function () {
                        self.showPromt(self.getLocalizedString("For your safety we automatically logged you out.", true), self.getLocalizedString("Reload", true), self.getLocalizedString("Go to main page", true), function () {
                            window.parent.postMessage({ type: 'refresh' }, "*");
                    }, function () {
                        window.parent.postMessage({ type: 'home' }, "*");
                    });
                    }, 2000);
                } else {
                    setTimeout(function () {
                        window.location.reload();
                    }, 3000);
                }
                if (errorCallback)
                    errorCallback(data);
            }
        };

        webSocket.onclose = function () {
            console.log("Connection is closed...");
            if (!streamOnly) {
                openSocketConnection();
            } else {
                self.joinGame();
            }
        };
    }
    function xmlHttpErrorCounter(clear) {
        if (document.getElementById("signal-ico")) {
            if (clear) {
                errorCount = 0;
                document.getElementById("signal-ico").style.opacity = 0;
            } else {
                errorCount++;
                if (errorCount > 2) {
                    document.getElementById("signal-ico").style.opacity = 1;
                }
            }
        }
    }
    function AJAXPost(config, success, error) {
        var url = config.url;
        var jsonData = config.jsonData;
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("POST", url, true);
        if (config.setContentType)
          xmlhttp.setRequestHeader("Content-type", "application/json");
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("X-CASINOTV-INSTANCE-ID", instanceGuid);
        xmlhttp.setRequestHeader("X-CASINOTV-TOKEN", gameToken);
        xmlhttp.timeout = 10000;
        xmlhttp.onload = function (e) {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    success(xmlhttp.responseText);
                    xmlHttpErrorCounter(true);
                } else {
                    xmlHttpErrorCounter(false);
                    error(xmlhttp.responseText);
                }
            }
        };
        xmlhttp.ontimeout = function () {
            xmlHttpErrorCounter(false);
            error('XmlHttp post timeout.');
        };
        xmlhttp.onerror = function (e) {
            xmlHttpErrorCounter(false);
            error(xmlhttp.responseText);
        };
        xmlhttp.send(jsonData);
    }
    function AJAXGet(config, success, error) {
        var url = config.url;
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open("GET", url, true);
        xmlhttp.setRequestHeader("Accept", "application/json");
        xmlhttp.setRequestHeader("X-CASINOTV-INSTANCE-ID", instanceGuid);
        xmlhttp.setRequestHeader("X-CASINOTV-TOKEN", gameToken);
        xmlhttp.timeout = 10000;
        xmlhttp.onload = function (e) {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    success(xmlhttp.responseText);
                } else {
                    xmlHttpErrorCounter(false);
                    error(xmlhttp.responseText);
                }
            }
        };
        xmlhttp.ontimeout = function () {
            xmlHttpErrorCounter(false);
            error('XmlHttp get timeout.');
        };
        xmlhttp.onerror = function (e) {
            xmlHttpErrorCounter(false);
            error(xmlhttp.responseText);
        };
        xmlhttp.send(null);
        return xmlhttp.responseText;
    };
    function getData(path, success, error) {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        } else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        var url = BASE_SERVER_URL + path;
        xmlhttp.open("GET", url, true);
        xmlhttp.onload = function (e) {
            if (xmlhttp.readyState === 4) {
                if (xmlhttp.status === 200) {
                    success(xmlhttp.responseText);
                } else {
                    error(xmlhttp.responseText);
                }
            }
        };
        xmlhttp.onerror = function (e) {
            error(xmlhttp.responseText);
        };
        xmlhttp.send(null);
    }
    var Anim = {
        easing: {
            linear: function (progress) {
                return progress;
            },
            quadratic: function (progress) {
                return Math.pow(progress, 2);
            },
            swing: function (progress) {
                return 0.5 - Math.cos(progress * Math.PI) / 2;
            },
            circ: function (progress) {
                return 1 - Math.sin(Math.acos(progress));
            },
            back: function (progress, x) {
                return Math.pow(progress, 2) * ((x + 1) * progress - x);
            },
            bounce: function (progress) {
                for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
                    if (progress >= (7 - 4 * a) / 11) {
                        return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
                    }
                }
            },
            elastic: function (progress, x) {
                return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress);
            }
        },
        animate: function (options) {
            var start = new Date;
            var id = setInterval(function () {
                var timePassed = new Date - start;
                var progress = timePassed / options.duration;
                if (progress > 1) {
                    progress = 1;
                }
                options.progress = progress;
                var delta = options.delta(progress);
                options.step(delta);
                if (progress == 1) {
                    clearInterval(id);
                    options.complete();
                }
            }, options.delay || 10);
        },
        fadeOut: function (element, options) {
            var to = 1;
            if (element)
            this.animate({
                duration: options.duration,
                delta: function (progress) {
                    progress = this.progress;
                    return Anim.easing.swing(progress);
                },
                complete: options.complete,
                step: function (delta) {
                    element.style.opacity = to - delta;
                }
            });
        },
        fadeIn: function (element, options) {
            var to = 0;
            if (element)
                this.animate({
                duration: options.duration,
                delta: function (progress) {
                    progress = this.progress;
                    return Anim.easing.swing(progress);
                },
                complete: options.complete,
                step: function (delta) {
                    element.style.opacity = to + delta;
                }
            });
        }
    };
    self.initialize = function (msgCallback, errCallback, initCalback) {
        var previousError = "";
        self.videoEnabled = true;
        var queryParams = getQueryParams(unescape(document.location.search));
        if (queryParams['gameId']) {
            instanceId = queryParams['gameId'];
        }
        if (queryParams['referenceId']) {
            referenceId = queryParams['referenceId'];
        }
        if (queryParams['gameToken'])
            gameToken = queryParams['gameToken'];
        if (queryParams['langId'])
            langId = queryParams['langId'];
        messageCallback = msgCallback;
        errorCallback = errCallback;
        if (isMobile.phone()) {
            clientType = "mobile";
        } else if (isMobile.pad()) {
            clientType = "tablet";
        } else if (isMobile.TV()) {
            clientType = "tv";
        } else if (isMobile.Desktop()) {
            clientType = "desktop";
        } else {
            clientType = "other";
        }
        if (!streamOnly) {
            gameId = document.location.pathname.replace(/(.*_Games\/)(.*)(\/.*)/, "$2");
            getData("_GameContent/Localization.json", function (systemLocalization) {
                getData("_Games/" + gameId + "/Localization.json", function (localization) {
                    localizationDic = $.extend(true, JSON.parse(localization), JSON.parse(systemLocalization));
                    getData("_Games/" + gameId + "/Localization." + instanceId + ".json", function (cstomLocalization) {
                        localizationDic = $.extend(true, JSON.parse(localizationDic), JSON.parse(cstomLocalization));
                        updateLocalizedStrings();
                        if (initCalback)
                            initCalback();
                }, function (err) {
                    localizationDic = JSON.parse(localization);
                    updateLocalizedStrings();
                    if (initCalback)
                        initCalback();
                });
                }, function (msg) {
                    console.log(msg);
                    errorCallback();
               });
            }, function (msg) {
                console.log(msg);
                errorCallback();
            });
        }
        if (isMobile.any()) {
            loadScript('/_GameScripts/ogvjs/ogv.js');
        }
        if (DEBUG_SCRIPTS) {
            window.console.log = function(data) {
                console.info(data);
                self.postLog(data, "message");
            };
            window.console.error = function(data) {
                console.warn(data);
                if (previousError != data)
                    self.postLog(data, "error");
                previousError = data;
            };
            window.onerror = function(errorMsg, url, lineNumber, colNumber, error) {
                var errorStr = "{0}:\n{1};line:{2};col:{3};\n stack:{4}".format(url, errorMsg, lineNumber, colNumber, (error? error.stack:""));
                if (previousError != errorStr)
                    self.postLog(errorStr, "error");
                previousError = errorStr;
            };
        } else {
            window.console.error = function (data) {
                console.warn(data);
                if (previousError != data)
                    self.postLog(data, "error");
                previousError = data;
            };
            window.onerror = function (errorMsg, url, lineNumber, colNumber, error) {
                var errorStr = "{0}:\n{1};line:{2};col:{3};\n stack:{4}".format(url, errorMsg, lineNumber, colNumber, (error ? error.stack : ""));
                if (previousError != errorStr)
                    self.postLog(errorStr, "error");
                previousError = errorStr;
            };
        }
        instanceGuid = randomId();
        function listener(event) {
            if (event.data.type == "mute") {
                if (event.data.muted) {
                    if (!self.getMuteState()) {
                        self.enableSound(false);
                        self.autoMuted = true;
                    }
                } else {
                    if (self.autoMuted) {
                        self.enableSound(true);
                        self.autoMuted = false;
                    }
                }
            } else if (event.data.type == "redirect") {
                window.parent.postMessage(event.data, "*");
            } else if (event.data.type == "close_popup") {
                if (document.getElementById("frame_popup")) {
                    document.body.removeChild(document.getElementById("frame_popup"));
                }
            } else {
                window.parent.postMessage(event.data, "*");
            }
        };
        if (window.addEventListener) {
            addEventListener("message", listener, false);
        } else {
            attachEvent("onmessage", listener);
        }
        loadFont("Gotham", "/_GameContent/fonts/GothamRounded-Light");
        return self;
    };
    self.loadLocalization = function (path) {
        getData(path, function (cstomLocalization) {
            localizationDic = $.extend(true, localizationDic, JSON.parse(cstomLocalization));
            updateLocalizedStrings();
        }, function (err) {
            updateLocalizedStrings();
        });
    }
    self.joinGame = function (success, error) {
        var url = GATEWAY_SERIVCE_URL + "join/" + (instanceId ? instanceId : gameId) + "/?" + (referenceId ? "referenceId=" + referenceId : "") + (streamOnly ? "&spectate=true" : "") + (langId ? "&langId=" + langId : "") + (instanceGuid ? "&instanceToken=" + instanceGuid : "") + (clientType ? "&clientType=" + clientType : "");
        AJAXGet({url:url}, function (msg) {
            var response = JSON.parse(msg);
            if (response.IsSuccess) {
                gameUrl = response.ResponseData.GameData.gameUrl;
                gameToken = response.ResponseData.GameData.userToken;
                if (streamOnly) {
                    if (offset > 0) {
                        if (self.winnersMsg && document.getElementById("winners")) {
                            Anim.fadeOut(document.getElementById("winners"), {
                                duration: 300,
                                complete: function () {
                                    self.player.parentElement.removeChild(document.getElementById("winners"));
                                    self.winnersMsg = null;
                                }
                            });
                        }
                        var players = document.getElementsByClassName("player");
                        for (var i = 0; i < players.length; i++) {
                            players[i].setAttribute("src", "")
                        }
                    }
                } else {
                    self.UserData = response.ResponseData.UserData;
                    currentLocale = self.UserData.LocaleId.toLowerCase();
                }

                offset = 0;
                openSocketConnection();
                if (success)
                    success(response.ResponseData);
            } else {
                if (messageCallback) {
                    if (error)
                        error();
                    if (!streamOnly) {
                        setTimeout(function () {
                            self.showPromt(self.getLocalizedString("For your safety we automatically logged you out.", true), self.getLocalizedString("Reload", true), self.getLocalizedString("Go to main page", true), function () {
                                window.parent.postMessage({ type: 'refresh' }, "*");
                            }, function () {
                                window.parent.postMessage({ type: 'home' }, "*");
                            });
                        }, 2000);
                    } else {
                        setTimeout(function () { self.joinGame(); }, 5000);
                    }
                } else {
                    setTimeout(function () { self.joinGame(); }, 5000);
                }

            }
        }, function (msg) {
            if (messageCallback) {
                if (error)
                    error(msg);
                if (!streamOnly) {
                    setTimeout(function () {
                        self.showPromt(self.getLocalizedString("For your safety we automatically logged you out.", true), self.getLocalizedString("Reload", true), self.getLocalizedString("Go to main page", true), function () {
                            window.parent.postMessage({ type: 'refresh' }, "*");
                        }, function () {
                            window.parent.postMessage({ type: 'home' }, "*");
                        });
                    }, 2000);
                } else {
                    setTimeout(function () { self.joinGame(); }, 5000);
                }
            } else {
                setTimeout(function () { self.joinGame(); }, 5000);
            }
        });
    };
    self.getConfiguration = function (success, error) {
        var url = GATEWAY_SERIVCE_URL + "get/" + (instanceId ? instanceId : gameId) + "?" + (referenceId ? "referenceId=" + referenceId : "") + (streamOnly ? "spectate=true" : "");
        AJAXGet({ url: url }, function (msg) {
            var response = JSON.parse(msg);
            if (response.IsSuccess) {
                hlsStream = response.ResponseData.HlsUrl;
                wsStream = response.ResponseData.WSUrl;
                wsStream = "ws://edge-preview.cdn.wowza.com/live/_definst_/0P0p1bHBaN1NaRm5zU0hoekxSc1B5d4c/stream.ws";//TODO REMOVE
                rtmpStream = response.ResponseData.RtmpUrl;
                mpegStream = response.ResponseData.MpegUrl;
                vodUrl = response.ResponseData.VodUrl;
                self.vodUrl = vodUrl;
                virtualUrl = response.ResponseData.VirtualUrl;
                rulesUrl = response.ResponseData.RulesUrl;
                self.virtualConfig = response.ResponseData.VirtualConfig;
                self.streamConfig = response.ResponseData.StreamConfig;
                if (hlsStream)
                    videoStreams.push("hls");
                if (wsStream)
                    videoStreams.push("ws");
                if (rtmpStream)
                    videoStreams.push("rtmp");
            } else {
                self.showPromt(self.getLocalizedString("Load game failed. Reload game?", true), self.getLocalizedString("Reload", true), self.getLocalizedString("Go to main page", true), function () {
                    window.parent.postMessage({ type: 'refresh' }, "*");
                }, function () {
                    window.parent.postMessage({ type: 'home' }, "*");
                });
                if (error)
                    error();
            }
            success(response);
        }, function (msg) {
            self.showPromt(self.getLocalizedString("Load game failed. Reload game?", true), self.getLocalizedString("Reload", true), self.getLocalizedString("Go to main page", true), function () {
                window.parent.postMessage({ type: 'refresh' }, "*");
            }, function () {
                window.parent.postMessage({ type: 'home' }, "*");
            });
            if (error)
                error(msg);
        });
    };
    self.leaveGame = function () {
        AJAXPost({ url: gameUrl + "leave/" + (instanceId ? instanceId : gameId) + "/" + +(streamOnly ? "spectate=true" : "") });
    };
    self.toHome = function () {
        window.parent.postMessage({ type: 'home' }, "*");
    },
    self.sendPost = function (data, success, error) {
        var url = gameUrl + "post/" + (instanceId ? instanceId : gameId) + "/";
            AJAXPost({ url: url, jsonData: data }, function(msg) {
                try {
                    var response = JSON.parse(msg);
                    if (response.IsSuccess) {
                        if (response.ResponseData)
                            response.ResponseData = JSON.parse(response.ResponseData);
                        success(response);
                    } else {
                        error(response);
                        console.log(response);
                    }
                } catch (err) {
                    console.error('Message parse  error!');
                    console.error(err.stack);
                }
            }, function(err) {
                error(err);
                console.log(err);
            });
    };
    self.sendSeed = function (success, error) {
        var url = gameUrl + "post_system/" + (instanceId ? instanceId : gameId) + "/";
        AJAXPost({ url: url, jsonData: JSON.stringify({ type: 500, seed: self.provablyFair.nextGame.seed }) }, function (msg) {
            var response = JSON.parse(msg);
            if (response.IsSuccess) {
                try {
                    if (response.ResponseData)
                        response.ResponseData = JSON.parse(response.ResponseData);
                    success(response);
                } catch (err) {
                    console.error('Message parse  error!');
                    console.error(err.stack);
                }
            } else {
                error(response);
                console.log(response);
            }
        }, function (err) {
            error(err);
            console.log(err);
        });
    };
    self.generateClientSeed = function() {
        var seed = randomId().split("-").join("");
        return seed;
    }
    self.getVideoPlayer = function (target, videoOnDemand, customSoundSwitch, stream) {
        self.playerConfig = {
            target: target,
            videoOnDemand: videoOnDemand,
            customSoundSwitch: customSoundSwitch
        };
        var html5Player, streamId;
        streamId = stream;
        if (!streamId) {
            streamId = videoStreams.indexOf(getCookie('streamId')) >= 0 ? getCookie('streamId') : videoStreams[0];
        }
        self.playerConfig.streamId = streamId;
        if (videoOnDemand) {
            html5Player = videoOnDemand;
        } else {
            html5Player = vodUrl ? true : false;
        }
        self.videoOnDemand = html5Player;
        if (hlsStream || rtmpStream || mpegStream || vodUrl || virtualUrl || wsStream) {
            var targetElem = document.getElementById(target);
            var player = document.createElement('div');
            var playerHtml = "";
            player.setAttribute('style', "height:100%; width:100%; background-color:#000000;  text-align: start;");
            if (self.virtualConfig) {
                videoOnDemand = false;
                if (self.virtualConfig.type == "unity") {
                    var unityPlayer = document.createElement('canvas');
                    unityPlayer.setAttribute('style', "height:100%; width:100%; background-color:#000000;  text-align: start;");
                    unityPlayer.setAttribute('id', 'unityPlayer');
                    player.appendChild(unityPlayer);
                    targetElem.appendChild(player);
                    Module = {
                        TOTAL_MEMORY: 268435456,
                        errorhandler: function (err) {
                            postLog(err,"error")
                        },
                        compatibilitycheck: null,
                        dataUrl: virtualUrl + self.virtualConfig.loader.dataUrl,
                        codeUrl: virtualUrl + self.virtualConfig.loader.codeUrl,
                        memUrl: virtualUrl + self.virtualConfig.loader.memUrl,
                    };
                    loadScript(virtualUrl + "Release/UnityLoader.js");
                    window.addEventListener('resize', function () {
                        setTimeout(function() {
                            unityPlayer.setAttribute("width", player.offsetWidth);
                            unityPlayer.setAttribute("height", player.offsetHeight);
                        }, 200);
                    });
                }
            }
            else if (html5Player) {
				if ((isMobile.iOS() && !isMobile.iPad() && getIOSVersion() < 10) || (isMobile.Android() && getChromeVersion() < 53)) {
				    playerHtml = '<img id="video-stub" src="/_GameContent/Images/loading.gif" style="opacity:0;position: absolute;width:100%;height:100%;bottom:0;text-align:center;z-index:10;"></img>';
                    playerHtml += '<div id="player1" style="  position: absolute;top: 0;left: 0;right: 0;bottom:0;text-align: center"></div>';
                    playerHtml += '<div id="player2" style="opacity:0;  position: absolute;top: 0;left: 0;right: 0;bottom:0;text-align: center"></div>';
                    player.innerHTML = playerHtml;
                    targetElem.appendChild(player);
                } else {
				    playerHtml = '<video id="player1" type="video/mp4" class="player" last="true" width="100%" height="100%"  webkit-playsinline="webkit-playsinline" autoplay muted playsinline autoplay="autoplay" poster=""/_GameContent/Images/loading.gif" style="image-fit: fill;object-fit: fill;position:absolute;opacity:1;"></video>';
				    playerHtml += '<video id="player2" type="video/mp4" class="player" last="false" width="100%" height="100%"  webkit-playsinline="webkit-playsinline" autoplay muted playsinline autoplay="autoplay" style="image-fit: fill;object-fit: fill;position:absolute;opacity:0;"></video>';
                    player.innerHTML = playerHtml;
                    if (isMobile.any()) {
                        var  button = document.createElement('div');
                        button.style = "background: url(/_GameContent/Images/play_button.png) no-repeat center;top:0;left:0;width: 100%;  height: 100%; background-size:'inherit';position: absolute;";
                        if (self.streamConfig && self.streamConfig.clientConfig){
                            for (var clientId in self.streamConfig.clientConfig) {
                                if (document.location.href.indexOf(clientId) != -1) {
                                    button.style = "position: absolute;background: url(" + self.streamConfig.clientConfig[clientId].introImage + ") no-repeat center; top:0;left:0; width: 100%;  height: 100%; background-size:cover; ";
                                }
                            }
                        }
                        button.innerHTML = "<button id='playStreamButton' playerIds='player1,player2'  style=' background: transparent;z-index: 99999; width: 100%; border: none;  position: absolute; top: 0; bottom: 0; left: 0; right: 0;'></button>";
                        player.appendChild(button);
						var playInterval=setInterval(function () {
							if (document.getElementById("player1") && (!document.getElementById("player1").paused || !document.getElementById("player2").paused)) {
							    document.getElementById('playStreamButton').parentNode.style.visibility = 'hidden';
								clearInterval(playInterval);
							}
						}, 2000);
                    }
                    targetElem.appendChild(player);
                }
            } else {
                if (isMobile.any()) {
                    var queryParams = getQueryParams(unescape(document.location.search));
                    if (hlsStream && (isMobile.androidPad() || isMobile.iPad() || queryParams['inlineVideo'] || (getIOSVersion() >= 10))) {
                        playerHtml = '<video id="player" width="100%" height="100%" src=' + hlsStream + ' playsinline  webkit-playsinline autoplay style="image-fit: fill;object-fit: fill;"></video>';
                        player.innerHTML = playerHtml;
                        var button = document.createElement('div');
                        button.style = "background: url(/_GameContent/Images/play_button.png) no-repeat center;top:0;left:0;width: 100%;  height: 100%; background-size:'inherit';position: absolute;";
                        if (self.streamConfig && self.streamConfig.clientConfig) {
                            for (var clientId in self.streamConfig.clientConfig) {
                                if (document.location.href.indexOf(clientId) != -1) {
                                    button.style = "position: absolute;background: url(" + self.streamConfig.clientConfig[clientId].introImage + ") no-repeat center;top:0;left:0;  width: 100%;  height: 100%; background-size:cover; ";
                                }
                            }
                        }
                        button.innerHTML = "<button id='playStreamButton' playerIds='player'  style=' background: transparent;z-index: 99999; width: 100%; border: none;  position: absolute; top: 0; bottom: 0; left: 0; right: 0;'></button>";
                        targetElem.appendChild(player);
                            player.appendChild(button);
                            setInterval(function () {
                                if (document.getElementById("player").paused && document.getElementById("player").networkState != document.getElementById("player").NETWORK_LOADING) {
                                    document.getElementById('player').setAttribute('poster', '');
                                    document.getElementById('playStreamButton').parentNode.style.visibility = 'visible';
                                    document.getElementById("player").pause();
                                    document.getElementById("player").src = document.getElementById("player").src;
                                } else {
                                    if (!document.getElementById('player').getAttribute('poster'))
                                        document.getElementById('player').setAttribute('poster', "/_GameContent/Images/loading.gif");
                                }
                                if (!document.getElementById("player").paused)
                                    document.getElementById('playStreamButton').parentNode.style.visibility = 'hidden';
                            }, 2000);
                        var errFunc = function (e) {
                            document.getElementById("player").src = document.getElementById("player").src;
                            document.getElementById("player").play();
                        };
                        document.getElementById("player").addEventListener('error', errFunc, true);
                    } else if (wsStream && !isMobile.iOS()) {
                        playerHtml = "<div id='player' style='width:100%; height:100%'/>";
                        player.innerHTML = playerHtml;
                        targetElem.appendChild(player);
                        var url = new URL(wsStream);
                        if ((new RegExp("^https\:?")).test(document.location.protocol)) {
                            url.protocol = "wss";
                        }
                        function initmWsPlayer() {
                            self.wsPlayer = WowzaPlayer.create("player",
                                                {
                                                    "license": "PLAY1-nudv7-jjbUp-HGeyv-w3t3x-DkQEz",
                                                    "sources": [{
                                                        "sourceURL": url.toString()
                                                    },
                                                    {
                                                        "sourceURL": ""
                                                    }],
                                                    "title": "",
                                                    "description": "",
                                                    "autoPlay": false,
                                                    "mute": false,
                                                    "uiShowFullscreen": false,
                                                    "uiShowBitrateSelector": false,
                                                    "uiShowDurationVsTimeRemaining": false,
                                                    "uiShowQuickRewind": false,
                                                    "volume": 100
                                                }
                                            );
                            if (self.videoEnabled)
                                self.wsPlayer.play();
                            else
                                self.wsPlayer.stop();
                        }
                        loadScript('//player.wowza.com/player/preview/latest/wowzaplayer.min.js', function () {
                            initmWsPlayer();
                        });
                    }else if (mpegStream) {
                        playerHtml = "<canvas id='mpegCanvas' style='width: 100%;height: 100%;'></canvas>";
                        player.innerHTML = playerHtml;
                        targetElem.appendChild(player);
                        var url = new URL(mpegStream);
                        if ((new RegExp("^https\:?")).test(document.location.protocol)) {
                            url.protocol = "https";
                        }
                        function initLivePlayer() {
                            self.mpegPlayer = new LivePlayer(url.toString(), { canvas: document.getElementById('mpegCanvas') });
                            if (self.videoEnabled)
                                self.mpegPlayer.play();
                            else
                                self.mpegPlayer.stop();
                        }
                        loadScript('/_GameScripts/jsmpg.js', function() {
                            loadScript('/_GameScripts/livePlayer.js', function () {
                                initLivePlayer();
                            });
                        });
                    }
                } else {
                    if ((rtmpStream && hasFlash()) && (streamId == "rtmp" || !streamId)) {
                        self.videoQualities = [];
                        self.videoQualities.push("auto");
                        playerHtml = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="rtmp" align="middle">' +
                            "<embed src='/_GameContent/Players/rtmp.swf' id='rtmpEmbed'  wmode='transparent' SCALE='exactfit' width=100% height=100% pluginspage='http://www.macromedia.com/go/getflashplayer' flashvars='stream=" + rtmpStream + "' allowScriptAccess='always' />" +
                            '</object>';
                        player.innerHTML = playerHtml;
                        targetElem.appendChild(player);
                        self.videoStream = "rtmp";
                    } else if (hlsStream && (streamId == "hls" || !streamId)) {
                        playerHtml = '<video id="player" width="100%" height="100%"  webkit-playsinline autoplay style="image-fit: fill;object-fit: fill;"></video>';
                        player.innerHTML = playerHtml;
                        targetElem.appendChild(player);

                        function initHls() {
                            if (Hls.isSupported()) {
                                var video = document.getElementById('player');
                                self.hlsPlayer = new Hls({ capLevelToPlayerSize: true, maxSeekHole: 3, fragLoadingTimeOut: 3000, maxLoadingDelay: 2, maxStarvationDelay: 2, liveMaxLatencyDurationCount: 4 });
                                self.hlsPlayer.enabled = true;
                                self.hlsPlayer.loadSource(hlsStream);
                                self.hlsPlayer.attachMedia(video);
                                self.hlsPlayer.on(Hls.Events.MANIFEST_PARSED, function () {
                                    self.videoQualities = [];
                                    self.videoQualities.push("auto");
                                    for (var i = 0; i < self.hlsPlayer.levels.length; i++) {
                                        self.videoQualities.push(self.hlsPlayer.levels[i]['height'].toString());
                                    }
                                    self.setVideoQuality(self.videoQualities[0]);
                                    setTimeout(function () {
                                        video.play();
                                    }, 3000);
                                    window.onfocus = function () {
                                        if (self.hlsPlayer) {
                                            if (!self.hlsPlayer.focused) {
                                                console.log("Focus restored");
                                                if (self.hlsPlayer.enabled) {
                                                    if (self.hlsPlayer.streamController.stalled) {
                                                             self.hlsPlayer.startLoad();
                                                        }
                                                }
                                                self.hlsPlayer.focused = true;
                                            }
                                        }
                                    };
                                    window.onblur = function () {
                                        if (self.hlsPlayer) {
                                            console.log("Focus lost");
                                            self.hlsPlayer.focused = false;
                                        }
                                    };
                                    console.log("Manifest parsed");
                                    self.hlsPlayer.restarting = false;
                                });
                                self.hlsPlayer.stats = {};
                                var stalledTime = 0;
                                self.hlsPlayer.scInterval = setInterval(function () {
                                    if (self.hlsPlayer)
                                        if (self.hlsPlayer.enabled) {
                                            if (self.hlsPlayer.streamController.stalled && !self.hlsPlayer.restarting) {
                                                if (stalledTime > 6) {
                                                    self.hlsPlayer.loadSource(hlsStream);
                                                    self.hlsPlayer.attachMedia(video);
                                                    console.log('Restart hls player');
                                                    stalledTime = 0;
                                                    self.hlsPlayer.restarting = true;
                                                }
                                                stalledTime++;
                                            } else {
                                                self.hlsPlayer.restarting = false;
                                                stalledTime = 0;
                                            }
                                        }
                                }, 1000);
                                self.hlsPlayer.on(Hls.Events.ERROR, function (event, data) {
                                    if (data.fatal) {
                                        switch (data.type) {
                                            case Hls.ErrorTypes.NETWORK_ERROR:
                                                console.log("hls network error");
                                                setTimeout(function () {
                                                    self.hlsPlayer.loadSource(hlsStream);
                                                    self.hlsPlayer.attachMedia(video);
                                                    self.hlsPlayer.stopLoad();
                                                    self.hlsPlayer.startLoad();
                                                    self.hlsPlayer.restarting = true;
                                                }, 1000);
                                                    break;
                                                case Hls.ErrorTypes.MEDIA_ERROR:
                                                        console.log("hls media error");
                                                       // self.hlsPlayer.loadSource(hlsStream);
                                                   break;
                                                default:
                                                        console.log("hls error");
                                                        //self.hlsPlayer.loadSource(hlsStream);
                                                   break;
                                        }
                                    }
                                });
                            }
                        }
                        if (typeof Hls != 'undefined') {
                            initHls();
                        } else {
                            loadScript('/_GameScripts/hls.min.js', function() {
                                initHls();
                            });
                        }
                        self.videoStream = "hls";
                    } else if (wsStream) {
                        playerHtml = "<div id='player' style='width:100%; height:100%'/>";
                        player.innerHTML = playerHtml;
                        targetElem.appendChild(player);
                        var url = new URL(wsStream);
                        if ((new RegExp("^https\:?")).test(document.location.protocol)) {
                            url.protocol = "wss";
                        }
                        function initWsplayer() {
                            self.wsPlayer = WowzaPlayer.create("player",
                                                {
                                                    "license": "PLAY1-nudv7-jjbUp-HGeyv-w3t3x-DkQEz",
                                                    "sources": [{
                                                        "sourceURL": url.toString()
                                                    },
                                                    {
                                                        "sourceURL": ""
                                                    }],
                                                    "title": "",
                                                    "description": "",
                                                    "autoPlay": true,
                                                    "mute": false,
                                                    "uiShowFullscreen": false,
                                                    "uiShowBitrateSelector": false,
                                                    "uiShowDurationVsTimeRemaining": false,
                                                    "uiShowQuickRewind": false,
                                                    "volume": 100
                                                }
                                            );
                            if (self.videoEnabled)
                                self.wsPlayer.play();
                            else
                                self.wsPlayer.stop();
                        }
                        loadScript('//player.wowza.com/player/preview/latest/wowzaplayer.min.js', function () {
                            initWsplayer();
                        });
                    }
                }
            }

            if (vodUrl) {
                var sounds = document.createElement('audio');
                sounds.setAttribute("id", "sound");
                sounds.style.opacity = 0;
                targetElem.appendChild(sounds); var background = document.createElement('audio');
                background.setAttribute("id", "background-sound");
                background.style.opacity = 0;
                targetElem.appendChild(background);
                background.src = vodUrl + '/Music/background.mp3';
                self.enableSound(!self.getMuteState());
                if (isMobile.any()) {
                    if (!customSoundSwitch) {
                        self.showPromt(self.getLocalizedString("Turn on music?", true), self.getLocalizedString("Ok", true), self.getLocalizedString("Cancel", true), function() {
                            background.play();
                            sounds.play();
                        }, function() {
                            self.enableSound(false);
                            self.autoMuted = true;
                        });
                    } else {
                        sounds.play();
                    }
                } else {
                    self.enableSound(!self.getMuteState());
                    setTimeout(function () {
                        background.play();
                    }, 1000);
                }
                background.addEventListener('ended', function () {
                    this.currentTime = 0;
                    this.play();
                }, false);
            } else if (mpegStream) {
                if (isMobile.any() && !customSoundSwitch) {
                    self.showPromt(self.getLocalizedString("Turn on music?", true), self.getLocalizedString("Ok", true), self.getLocalizedString("Cancel", true), function() {
                        if (self.mpegPlayer) {
                            self.mpegPlayer.startAudioPlayback();
                        }
                    }, function() {
                        if (self.mpegPlayer) {
                            self.mpegPlayer.mute = true;
                        }
                    });
                } else {
                    self.enableSound(!self.getMuteState());
                }
            }
            self.enableSound(!self.getMuteState());
            if (document.getElementById('playStreamButton')) {
                document.getElementById('playStreamButton').onclick = function () {
                    document.getElementById('playStreamButton').parentNode.style.visibility = 'hidden';
                    var playerIds = document.getElementById('playStreamButton').getAttribute('playerIds').split(',');
                    for (var i in playerIds) {
                        if (document.getElementById(playerIds[i]).getAttribute("last") !== "true") {
                            document.getElementById(playerIds[i]).style.opacity = 1;
                            document.getElementById(playerIds[i]).play();
                            document.getElementById(playerIds[i]).src = document.getElementById(playerIds[i]).src;
                        } else {
                            document.getElementById(playerIds[i]).style.opacity = 0;
                            document.getElementById(playerIds[i]).play();
                            document.getElementById(playerIds[i]).src = "";
                        }
                    }
                    if (document.getElementById('sound'))
                        document.getElementById('sound').play();
                };
            }
            var singalIco = document.createElement('div');
            singalIco.setAttribute("id", "signal-ico");
            singalIco.style.background = "url(/_GameContent/Images/noSignal.png) no-repeat";
            singalIco.style["background-size"] = "30%";
            singalIco.style.width = "12%";
            singalIco.style.height = "10%";
            singalIco.style.height = "10%";
            singalIco.style.position = "absolute";
            singalIco.style.left = "15px";
            singalIco.style.top = "10px";
            singalIco.style.opacity = 0;
            player.appendChild(singalIco);
            targetElem.style['padding'] = "0px";
            self.player = player;
        } else {
            console.log("Stream not found wait 1000ms");
            setTimeout(function () {
                self.getVideoPlayer(target, html5Player);
            }, 1000);
        }
    };
    self.setVideoQuality = function (qualityId,temporary) {
        var qId;
        if (isMobile.any()) {
            if (qualityId == "hq")
                qId = "sq";
            else if (qualityId == "sq")
                qId = "lq";
            else
                qId = qualityId;
        } else {
            qId = qualityId;
        }
        if (self.videoQualities && self.videoQualities.indexOf(qId) >= 0) {
            self.videoQuality = qId;
            if (!temporary) {
                createCookie('video_quality', qId, 30);
            }
            if (self.player && self.player.qualityChanged) {
                self.player.qualityChanged(qId);
            }
            if (self.hlsPlayer) {
                self.hlsPlayer.currentLevel = self.videoQualities.indexOf(qId) - 1;
            }
            return true;
        } else
            return false;
    };
    self.getVideoQuality = function () {
        return getCookie('video_quality');
    };
    self.getVideoQualities = function () {
        return self.videoQualities;
    };
    self.getVideoStream = function () {
        return self.videoStream;
    };
    self.getVideoStreams = function () {
        return videoStreams;
    };
    self.changeStream = function(streamId) {
        if (self.playerConfig.streamId != streamId) {
            createCookie('streamId', streamId, 30);
            try {
                if 
                (self.hlsPlayer) {
                    self.hlsPlayer.stopLoad();
                    self.hlsPlayer = null;
                } else {
                    var rtmpPlayer = document.getElementById("rtmpEmbed");
                    if (rtmpPlayer && rtmpPlayer.Stop)
                        rtmpPlayer.Stop();
                }
            } catch (e) {
                console.log(e);
            }
            document.getElementById(self.playerConfig.target).innerHTML = '';
            self.getVideoPlayer(self.playerConfig.target, self.playerConfig.videoOnDemand, self.playerConfig.customSoundSwitch, streamId);
        }
    }
    self.playVideo = function (options, startCallback, endCallback) {
        var path = options.path;
        var duration = options.length;
        var offset = options.offset;
        var loop = options.loop;
        var fastAnimation = options.fastAnimation;
        var canPlay = false;
        var ended = false;
        var starTime = new Date();
        var isResized = false;
        var quality = "";
        var errFunc;
        if (videoLoadTimeouts.length > 5) {
            videoLoadTimeouts = videoLoadTimeouts.splice(videoLoadTimeouts.length - 5);
        }
        var timeout = videoLoadTimeouts.reduce(function (a, b) {
            return a + b;
        }) / videoLoadTimeouts.length;
           if(self.getVideoQuality() == "auto")
            if (timeout >= QUALITY_REDUCTION_TIMEOUT) {
                if (self.videoQualities && self.videoQualities.indexOf(self.videoQuality) > 1){
                    self.setVideoQuality(self.videoQualities[self.videoQualities.indexOf(self.videoQuality) - 1], true);
                }
            } else if (timeout < QUALITY_REDUCTION_TIMEOUT/2) {
                if (self.videoQualities && self.videoQualities.indexOf(self.videoQuality) + 1 <= self.videoQualities.length - 1){
                    self.setVideoQuality(self.videoQualities[self.videoQualities.indexOf(self.videoQuality) + 1], true);
                }
            }
            timeout = timeout > MAX_VIDEO_CUT ? MAX_VIDEO_CUT : timeout;
            if (isMobile.any()) {
                self.setVideoQuality(self.videoQualities[1]);
              timeout += 1.5;
            }
        if (!document.getElementById("video-info-wrapper")) {
            var videoInfo = document.createElement('div');
            videoInfo.setAttribute("id", "video-info-wrapper");
            videoInfo.style.position = "absolute";
            videoInfo.style.visibility = "hidden";
            videoInfo.style['font-size'] = "14px";
            videoInfo.style.left = "70px";
            videoInfo.style.top = "15px";
            videoInfo.style.width = "70%";
            videoInfo.style['z-index'] = "20";
            videoInfo.innerHTML = "<div id='video-info'></div><div id='video-state'></div>";
            self.player.parentElement.appendChild(videoInfo);
            function keyDownHandler(e) {
                if (typeof window.event != "undefined") {
                    e = window.event;
                }
                if (e.keyCode === 119)//f8
                {
                    if (document.getElementById("video-info-wrapper").style.visibility === "hidden") {
                        document.getElementById("video-info-wrapper").style.visibility = "visible";
                        self.player.debug = true;
                    }
                    else {
                        document.getElementById("video-info-wrapper").style.visibility = "hidden";
                        self.player.debug = false;
                    }
                }
            }
            if (document.addEventListener) {
                document.addEventListener("keydown", keyDownHandler, false);
            } else {
                document.attachEvent("onkeydown", keyDownHandler);
            }
            if (isMobile.any()) {
                var touchCount = 0,lastTouch;
                window.addEventListener('touchstart', function (evt) {
                    if (new Date(evt.timeStamp)-new Date(lastTouch) < 1000) {
                        touchCount++;
                    } else {
                        touchCount = 0;
                    }
                    lastTouch = evt.timeStamp;
                    if (touchCount > 3) {
                        if (document.getElementById("video-info-wrapper").style.visibility === "hidden")
                            document.getElementById("video-info-wrapper").style.visibility = "visible";
                        else
                            document.getElementById("video-info-wrapper").style.visibility = "hidden";
                    }
                });
            }
        }
        if (self.videoQuality == "hq")
            quality = ".HQ";
        else if (self.videoQuality == "lq")
            quality = ".LQ";
        function setVideoState(event) {
            if (!isMobile.any()) {
                if (event.target && self.player.debug) {
                    document.getElementById("video-state").innerHTML = '</br>InstanceId: ' + instanceId;
                    document.getElementById("video-state").innerHTML += '</br>Emptied: ' + (vodPlayers[event.target.getAttribute("id")]['emptied'] ? vodPlayers[event.target.getAttribute("id")]['emptied'] : 0);
                    document.getElementById("video-state").innerHTML += '</br>Loadstart: ' + (vodPlayers[event.target.getAttribute("id")]['loadstart'] ? vodPlayers[event.target.getAttribute("id")]['loadstart'] : 0);
                    document.getElementById("video-state").innerHTML += '</br>Stalled: ' + (vodPlayers[event.target.getAttribute("id")]['stalled'] ? vodPlayers[event.target.getAttribute("id")]['stalled'] : 0);
                    document.getElementById("video-state").innerHTML += '</br>Suspend: ' + (vodPlayers[event.target.getAttribute("id")]['suspend'] ? vodPlayers[event.target.getAttribute("id")]['suspend'] : 0);
                    document.getElementById("video-state").innerHTML += '</br>Abort: ' + (vodPlayers[event.target.getAttribute("id")]['abort'] ? vodPlayers[event.target.getAttribute("id")]['abort'] : 0);
                    document.getElementById("video-state").innerHTML += '</br>CurrentTime: ' + (event.target['currentTime'] ? event.target['currentTime'] : 0);
                    var startTimeout = videoLoadTimeouts.reduce(function (a, b) {
                        return a + b;
                    }) / videoLoadTimeouts.length;
                    document.getElementById("video-state").innerHTML += '</br>Start timeout: ' + parseFloat(startTimeout).toFixed(2);
                    if (vodPlayers[event.target.getAttribute("id")]['startTime'])
                        var playDiff = (new Date().getTime() - vodPlayers[event.target.getAttribute("id")]['startTime'].getTime()) / 1000;
                    var playTimeout = 0;
                    if (event.target['buffered'] && playDiff && event.target['buffered'].length > 0)
                        playTimeout = event.target['buffered'].end(0) > playDiff ? 0 : playDiff - event.target['buffered'].end(0);
                    document.getElementById("video-state").innerHTML += '</br>Play timeout: ' + parseFloat(playTimeout).toFixed(2);
                    var networkState = "";
                    switch (event.target['networkState']) {
                        case event.target.NETWORK_EMPTY:
                            networkState = 'NETWORK_EMPTY';
                            break;
                        case event.target.NETWORK_IDLE:
                            networkState = 'NETWORK_IDLE';
                            break;
                        case event.target.NETWORK_LOADING:
                            networkState = 'NETWORK_LOADING';
                            break;
                        case event.target.NETWORK_NO_SOURCE:
                            networkState = 'NETWORK_NO_SOURCE';
                            break;
                        default:
                            networkState = 'An unknown state occurred.';
                            break;
                    }
                    var readyState = "";
                    switch (event.target['networkState']) {
                        case event.target.HAVE_NOTHING:
                            readyState = 'HAVE_NOTHING';
                            break;
                        case event.target.HAVE_METADATA:
                            readyState = 'HAVE_METADATA';
                            break;
                        case event.target.HAVE_CURRENT_DATA:
                            readyState = 'HAVE_CURRENT_DATA';
                            break;
                        case event.target.HAVE_FUTURE_DATA:
                            readyState = 'HAVE_FUTURE_DATA';
                            break;
                        case event.target.HAVE_ENOUGH_DATA:
                            readyState = 'enough data available to start playing';
                            break;
                        default:
                            readyState = 'An unknown state occurred.';
                            break;
                    }
                    document.getElementById("video-state").innerHTML += '</br>networkState: ' + networkState;
                    document.getElementById("video-state").innerHTML += '</br>readyState: ' + readyState;
                    document.getElementById("video-state").innerHTML += '</br>duration: ' + (event.target['duration'] ? event.target['duration'] : 0);
                    document.getElementById("video-state").innerHTML += '</br>Paused: ' + (event.target['paused'] ? event.target['paused'] : false);
                    document.getElementById("video-state").innerHTML += '</br>Ended: ' + (event.target['ended'] ? event.target['ended'] : false);
                    document.getElementById("video-state").innerHTML += '</br>Quality: ' + self.getVideoQuality();
                    document.getElementById("video-state").innerHTML += '</br>Player name: ' + event.target.getAttribute("id");
                }
            }
        }

        if ((isMobile.iOS() && !isMobile.iPad() && getIOSVersion() < 10) || (isMobile.Android() && getChromeVersion() < 53)) {
            function resizeVideo(id) {
                var container = document.getElementById(id),
                    computedStyle = window.getComputedStyle(container),
                    containerWidth = parseInt(computedStyle.getPropertyValue('width')),
                    containerHeight = parseInt(computedStyle.getPropertyValue('height'));
                vodPlayers[id].width = containerWidth;
                vodPlayers[id].height = containerHeight;
            }
            setVideoState();
            function getPlayer(id) {
                if (vodPlayers[id]) {
                    return vodPlayers[id];
				} else {
                    vodPlayers[id] = new OGVPlayer({
                        webGL: true,
                        useImmediate: true,
                        memoryLimit: 1024 * 1024 * 64,
                        forceWebGL: true,
                        base: '_Scripts/ogvjs/lib/'
                    });

                    vodPlayers[id].id = id;
                    vodPlayers[id].muted = true;
                    var container = document.getElementById(id);
                    container.insertBefore(vodPlayers[id], container.firstChild);
                    window.addEventListener('resize', function () {
                        if (vodPlayers[id]) {
                            setTimeout(function () {
                                resizeVideo(id);
                            }, 350);
                        }
                    });

                    setInterval(function () {
                        resizeVideo(id);
/*                        if (vodPlayers[id]['error']) {
                            vodPlayers[id] = new OGVPlayer({
                                webGL: true,
                                useImmediate: true,
                                base: '_Scripts/ogvjs/lib/'
                            });
                        }*/
                    }, 1000);

                    resizeVideo(id);
                    return vodPlayers[id];
                }
            }

            if (canvasPlayerId) {
                prevPlayer = document.getElementById(canvasPlayerId);
            }

            if (canvasPlayerId == "player1") {
                canvasPlayerId = "player2";
            } else {
                canvasPlayerId = "player1";
            }

            var player = getPlayer(canvasPlayerId);

            player.onloadedmetadata = function () {
                var loadTime = new Date(),
                time = (loadTime - starTime) / 1000;
                if (time > MAX_VIDEO_TIMEOUT) {
                    time = MAX_VIDEO_TIMEOUT;
                } else if (time < MIN_VIDEO_TIMEOUT) {
                    time = MIN_VIDEO_TIMEOUT;
                }
                videoLoadTimeouts.push(time > MAX_VIDEO_TIMEOUT ? MAX_VIDEO_TIMEOUT : time);
                var seekToTime = offset / 1000;
                if (seekToTime > 0 && seekToTime < duration) {
                    player["currentTime"] = seekToTime;
                    document.getElementById('video-stub').style.opacity = 1;
                }
                setVideoState();
            };

            player.onstartrender = function (p) {
                if (p.id == startedPlayerId || p.id != canvasPlayerId) {
                    return;
                }

                startedPlayerId = p.id;

                document.getElementById('video-stub').style.opacity = 0;
                if (startCallback) {
                    startCallback();
                }

                if (prevPlayer) {
                    prevPlayer.children[0].stop();
                    Anim.fadeOut(prevPlayer, {
                        duration: 600,
                        complete: function () {

                        }
                    });
                    prevPlayer = null;
                }

                console.log(canvasPlayerId + " started!");
                resizeVideo(canvasPlayerId);
                Anim.fadeIn(document.getElementById(canvasPlayerId), {
                    duration: 250,
                    complete: function () {
                    }
                });

                var interval = setInterval(function () {
                    if (duration - parseInt(player["currentTime"]) <= timeout && !ended) {
                        if (endCallback) {
                            if (!loop) {
                                endCallback();
                                ended = true;
                                clearInterval(interval);
                            }
                        }
                    }
                }, 500);
                setVideoState();
            };

            player.onended = function () {
                if (endCallback && !ended) {
					clearInterval(endInterval);
                    if (loop) {
                        player["currentTime"] = 0;
                        player.play();
                        starTime = new Date();
                    } else {
                        ended = true;
                        endCallback();
                    }
                }
                setVideoState();
            };
           var endInterval= setInterval(function () {
                var time = (new Date() - starTime) / 1000;
                if (time > duration + timeout) {
                    clearInterval(endInterval);
                    if (endCallback && !ended) {
                        if (loop) {
                            player["currentTime"] = 0;
                            player.play();
                            starTime = new Date();
                        } else {
                            ended = true;
                            endCallback();
                        }
                    }
                }
           }, 500);
           player.stop();
           player.src = vodUrl + path + quality + '.ogv';
           player.load();
           player.play();
        } else {
            var prevPlayer = {}, lastPlayer = {};
            var players = document.getElementsByClassName("player");
            for (var i = 0; i < players.length; i++) {
                if (players[i].getAttribute("last") === "true") {
                    lastPlayer = players[i];
                } else {
                    prevPlayer = players[i];
                    if (vodPlayers[prevPlayer.getAttribute("id")]) {
                        for (var id in vodPlayers[prevPlayer.getAttribute("id")].events) {
                            prevPlayer.removeEventListener(id, vodPlayers[prevPlayer.getAttribute("id")].events[id]);
                        }
                        vodPlayers[prevPlayer.getAttribute("id")] = { events: {} };
                    } else {
                        vodPlayers[prevPlayer.getAttribute("id")] = { events: {} };
                    }
                }
            }
            prevPlayer.muted = true;
            if (lastPlayer.networtState === lastPlayer.HAVE_NOTHING || lastPlayer.networtState === lastPlayer.HAVE_METADATA)
                videoLoadTimeouts.push(MIN_VIDEO_TIMEOUT);

            var ended = false;
            if (vodPlayers[lastPlayer.getAttribute("id")]) {
                for (var id in vodPlayers[lastPlayer.getAttribute("id")].events) {
                    lastPlayer.removeEventListener(id, vodPlayers[lastPlayer.getAttribute("id")].events[id]);
                }
                vodPlayers[lastPlayer.getAttribute("id")] = { events: {} };
            } else {
                vodPlayers[lastPlayer.getAttribute("id")] = { events: {} };
            }
            errFunc = function (e) {
                var loadTime = new Date();
                if (prevPlayer.getAttribute("src")) {
                    function getError(e) {
                        var errString="";
                        switch (e.target.error.code) {
                            case e.target.error.MEDIA_ERR_ABORTED:
                                errString='You aborted the video playback.';
                                break;
                            case e.target.error.MEDIA_ERR_NETWORK:
                                errString='A network error caused the video download to fail part-way.';
                                break;
                            case e.target.error.MEDIA_ERR_DECODE:
                                errString='The video playback was aborted due to a corruption problem or because the video used features your browser did not support.';
                                break;
                            case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                                errString='The video could not be loaded, either because the server or network failed or because the format is not supported.';
                                break;
                            default:
                                errString='An unknown error occurred.';
                                break;
                        }
                        return errString;
                    }
                    if ((loadTime - starTime) < 1000) {
                        console.log('Error loading: ' + e.target.src);
                        if (e.target.error) {
                            console.error('Video error code:' + e.target.error.code);
                            setVideoState(e);
                        }
                        prevPlayer.setAttribute("src", vodUrl + path + quality + '.mp4');
                    } else {
                        if (!ended) {
                            console.log('Error loading: ' + e.target.src);
                            if (e.target.error) {
                                console.error('Video error code:' + e.target.error.code);
                                setVideoState(vodPlayers[e.target.getAttribute("id")]);
                            }
                            if (duration > (loadTime - starTime) / 1000) {
                                offset = loadTime - starTime;
                                prevPlayer.setAttribute("src", vodUrl + path + quality + '.mp4');
                            } else {
                                if (endCallback) {
                                    endCallback();
                                }
                                ended = true;
                                videoLoadTimeouts.push(MAX_VIDEO_TIMEOUT);
                            }
                        }
                    }
                    prevPlayer.removeEventListener("error", errFunc);
                }
            };
            function eventFunc(event) {
                if (event.target[event.type] >= 0)
                    vodPlayers[event.target.getAttribute("id")][event.type] ++;
                else
                    vodPlayers[event.target.getAttribute("id")][event.type] = 1;
                setVideoState(event);
            }
            prevPlayer.addEventListener('error', errFunc, true);
            vodPlayers[prevPlayer.getAttribute("id")].events['error'] = errFunc;
            prevPlayer.addEventListener('emptied', eventFunc, true);
            vodPlayers[prevPlayer.getAttribute("id")].events['emptied'] = eventFunc;
            prevPlayer.addEventListener('stalled', eventFunc, true);
            vodPlayers[prevPlayer.getAttribute("id")].events['stalled'] = eventFunc;
            prevPlayer.addEventListener('suspend', eventFunc, true);
            vodPlayers[prevPlayer.getAttribute("id")].events['suspend'] = eventFunc;
            prevPlayer.addEventListener('abort', eventFunc, true);
            vodPlayers[prevPlayer.getAttribute("id")].events['abort'] = eventFunc;
            prevPlayer.addEventListener('loadstart', eventFunc, true);
            vodPlayers[prevPlayer.getAttribute("id")].events['loadstart'] = eventFunc;
            var canPlayFunc = function (e) {
                if (!canPlay) {
                    canPlay = true;
                        clearTimeout(self.switchPlayerTimeout);
                        self.switchPlayerTimeout = setTimeout(function () {
                            lastPlayer.setAttribute("last", "false");
                            prevPlayer.setAttribute("last", "true");
                            vodPlayers[prevPlayer.getAttribute("id")]['startTime'] = new Date();
                             if (startCallback) {
                                 startCallback();
                             }
                             Anim.fadeIn(prevPlayer, {
                                 duration: fastAnimation ? 10 : 300,
                                 complete: function () {
                                 }
                             });
                             lastPlayer.pause();
                             Anim.fadeOut(lastPlayer, {
                                 duration: fastAnimation ? 10 : 300,
                                 complete: function () {
                                       if (lastPlayer.getAttribute("last") === "false")
                                            lastPlayer.src = "";
                                 }
                             });
                             var loadTime = new Date(),
                                 time = (loadTime - starTime) / 1000;
                             if (time > MAX_VIDEO_TIMEOUT) {
                                 time = MAX_VIDEO_TIMEOUT;
                             } else if (time < MIN_VIDEO_TIMEOUT) {
                                 time = MIN_VIDEO_TIMEOUT;
                             }
                            videoLoadTimeouts.push(time);
                             var seekToTime = offset / 1000;
                             if (seekToTime > 0 && seekToTime < duration)
                                 prevPlayer.currentTime = seekToTime;
                        }, 700);
               }
            };
            prevPlayer.addEventListener('canplay', canPlayFunc, false);
            vodPlayers[prevPlayer.getAttribute("id")].events['canplay'] = canPlayFunc;
            prevPlayer.addEventListener('canplaythrough', canPlayFunc, false);
            vodPlayers[prevPlayer.getAttribute("id")].events['canplaythrough'] = canPlayFunc;
            prevPlayer.addEventListener('playing', canPlayFunc, false);
            vodPlayers[prevPlayer.getAttribute("id")].events['playing'] = canPlayFunc;
            var endFunc = function () {
                if (endCallback && !ended) {
                    if (loop) {
                        prevPlayer.currentTime = 0;
                        prevPlayer.play();
                    } else {
                        endCallback();
                        ended = true;
                    }
                }
            };
            prevPlayer.addEventListener('ended', endFunc, false);
            vodPlayers[prevPlayer.getAttribute("id")].events['ended'] = endFunc;
            var updateFunc = function (event) {
                if (prevPlayer.duration - prevPlayer.currentTime <= timeout && !ended) {
                    if (!loop)
                     endFunc();
                }
                setVideoState(event);
            };
            prevPlayer.addEventListener('timeupdate', updateFunc, false);
            vodPlayers[prevPlayer.getAttribute("id")].events['timeupdate'] = updateFunc;
            lastPlayer.removeEventListener("timeupdate", updateFunc);
            prevPlayer.setAttribute("src", vodUrl + path + quality + '.mp4');

        }
    },
    self.playSound = function (path) {
        if (self.soundsEnabled && document.getElementById('sound'))
            if (document.getElementById('sound')) {
                document.getElementById("sound").volume = 1;
                document.getElementById('sound').src = path;
                document.getElementById('sound').play();
            }
    },
    self.hideSprite = function (id) {
        if (document.getElementById(id))
            Anim.fadeOut(document.getElementById(id), {
                duration: 300,
                complete: function () {
                    if (document.getElementById(id))
                        self.player.removeChild(document.getElementById(id));
                }
            });
    };
    self.playSprite = function (config, loop, start, end,error) {
        if (!self.player) {
            setTimeout(function () {
                self.playSprite(config);
            }, 200);
            return;
        }
        var path = vodUrl + config.path;
        var scaleX = config.scaleX / 100;
        var scaleY = config.scaleY / 100;
        var opacity = config.opacity ? config.opacity/100 : 1;
        var x = config.x;
        var y = config.y;
        var frameCount = config.frameCount;
        var fps = config.fps;
        var canvas, timer;
        var frame = 0;
        var oc = document.createElement('canvas');
        function drawSprite() {
            if (document.getElementById(config.name)) {
                self.player.removeChild(document.getElementById(config.name));
            }
            canvas = document.createElement('canvas');
            canvas.style.position = "absolute";
            canvas.setAttribute("id", config.name);
            canvas.style.left = x + '%';
            canvas.style.top = y + '%';
            canvas.style.overflow = "hidden";
            canvas.setAttribute("class", "sprites");
            canvas.style.opacity = opacity;
            self.player.appendChild(canvas);
            var ctx = canvas.getContext("2d");

            var img = new Image();
			img.crossOrigin = "anonymous";
			img.src = path;
			var starTime = new Date();
			img.error= function() {
			    if (error)
			        error();
			}
            img.onload = function () {
		        var loadTime = new Date();
		        time= (loadTime - starTime) / 1000;
		        playtimeout = (videoLoadTimeouts[videoLoadTimeouts.length - 1] - time) * 1000;
		        setTimeout(function() {
		            if (document.getElementById(config.name)) {
		                var height = self.player.offsetHeight * scaleY;
		                var width = self.player.offsetWidth * scaleX;
		                canvas.style.width = width + "px";
		                canvas.style.height = height + "px";
		                var resizeFunc = function() {
		                    var timeout = setTimeout(function() {
		                        if (document.getElementById(config.name)) {
		                            frame = frameCount - 1;
		                            height = self.player.offsetHeight * scaleY;
		                            width = self.player.offsetWidth * scaleX;
		                            canvas.style.width = width + "px";
		                            canvas.style.height = height + "px";
		                            redraw();
		                            resizeFunc();
		                        } else {
		                            clearTimeout(timeout);
		                            window.removeEventListener('resize', resizeFunc);
		                        }
		                    }, 500);
		                };
		                window.removeEventListener('resize', resizeFunc);
		                window.addEventListener('resize', resizeFunc, false);

		                function redraw() {
		                    var octx = oc.getContext('2d');
		                    oc.width = img.width * 0.5;
		                    oc.height = img.height * 0.5;
		                    octx.drawImage(img, (img.width / frameCount) * frame, 0, img.width / frameCount, img.height, 0, 0, oc.width, oc.height);
		                    canvas.width = width;
		                    canvas.height = height;
		                    ctx.clearRect(0, 0, img.width, img.height);
		                    ctx.drawImage(img, (img.width / frameCount) * frame, 0, img.width / frameCount, img.height, 0, 0, canvas.width, canvas.height);
		                }

		                var timeout;

		                function update() {
		                    clearTimeout(timeout);
		                    if (frame >= frameCount) {
		                        if (loop) {
		                            redraw();
		                            frame = 0;
		                            timeout = setTimeout(update, 1000 / fps);
		                        } else {
		                            if (end) {
		                                frame--;
		                                end();
		                                end = null;
		                            }
		                        }
		                    } else {
		                        redraw();
		                        frame++;
		                        timeout = setTimeout(update, 1000 / fps);
		                    }
		                }

		                update();
		                if (start) {
		                    start();
		                    start = null;
		                }
		            }
		        }, playtimeout);
		    };
        }

        drawSprite();
    },
    self.getMuteState = function () {
        return getCookie('sound_mute') == 'false' ? false : true;
    };
    self.getVideoState= function() {
            return self.videoEnabled;
    },
    self.enableVideo = function (enabled) {
        self.videoEnabled = enabled;
        if (self.player) {
                if (self.videoOnDemand) {
                        function playVideo(videos, index) {
                            if (self.player && !self.waitEnd) {
                                if (videos && videos.length > 0) {
                                    if (videos[index]['wait_previous'] > 0) {
                                        self.waitEnd = true;
                                        setTimeout(function() {
                                            self.waitEnd = false;
                                        }, videos[index]['wait_previous'] * 1000);
                                    } else {
                                        self.waitEnd = false;
                                    }
                                    if (!videos[index]['loop']) {
                                        videos[index]['loop'] = false;
                                    }
                                    var msgOffset = new Date().getTime()-self.vodObj.time.getTime();
                                    if (msgOffset > videos[index]['offset'] && index < videos.length) {
                                        index++;
                                        playVideo(videos, index);
                                    } else {
                                        self.playVideo({ path: videos[index]['name'], length: videos[index]['length'], offset: videos[index]['offset'] + msgOffset, loop: videos[index]['loop'] }, null, function () {
                                            index++;
                                            if (index < videos.length) {
                                                playVideo(videos, index);
                                            }
                                            self.waitEnd = false;
                                        });
                                    }
                                }
                            } else {
                                setTimeout(function() {
                                    playVideo(videos, index);
                                }, 300);
                            }
                        }
                        if (self.vodObj && enabled)
                            playVideo(self.vodObj.items, 0);
                } else {
                    if (isMobile.any() && mpegStream && getIOSVersion() < 10) {
                        if (self.mpegPlayer) {
                            if (enabled) {
                                self.mpegPlayer.play();
                            } else {
                                self.mpegPlayer.stop();
                            }
                        }
                    } else if (hlsStream && self.hlsPlayer) {
                        self.hlsPlayer.enabled = enabled;
                        if (enabled) {
                            self.hlsPlayer.startLoad();
                        } else {
                            self.hlsPlayer.stopLoad();
                        }
                    }else if (wsStream && self.wsPlayer) {
                        self.wsPlayer.enabled = enabled;
                        if (enabled) {
                            self.wsPlayer.play();
                        } else {
                            self.wsPlayer.stop();
                        }
                    } else {
                        var rtmpPlayer = document.getElementById('rtmp');
                        if (rtmpPlayer)
                        if (enabled) {
                            rtmpPlayer.Play();
                        } else {
                            rtmpPlayer.Stop();
                        }
                    }
                }
                }
     },
    self.enableSound = function (enabled, checkCount) {
        var vid;
        self.soundsEnabled = enabled;
        createCookie('sound_mute', !enabled, 30);
        if (self.player) {
            if (document.getElementById("background-sound")) {
                if (document.getElementById("sound")) {
                    document.getElementById("sound").volume = enabled ? 1 : 0;
                }
                document.getElementById("background-sound").volume = enabled ? 1 : 0;
            }
            if (document.getElementById("player")) {
                document.getElementById("player").muted = !enabled;
            }
        } else {
            if (checkCount < 30 || !checkCount) {
                setTimeout(function () {
                    self.enableSound(enabled, checkCount?checkCount+1:0);
                }, 300);
            }
        }
        if (self.mpegPlayer) {
            if (enabled)
                self.mpegPlayer.startAudioPlayback();
            self.mpegPlayer.mute = !enabled;
        }
        if (self.wsPlayer) {
            self.wsPlayer.mute(!enabled);
        }     
        if (!self.videoOnDemand)
            if (self.hlsPlayer) {
                vid = document.getElementById("player");
                if (vid)
                    vid.muted = !enabled;
                return self.soundsEnabled;
            } else {
                vid = document.getElementById("rtmpEmbed");
                if (vid && typeof (vid.SetVolume) === 'function') {
                    if (enabled) {
                        vid.SetVolume(1);
                    } else {
                        vid.SetVolume(0);
                    }
                } else {
                    setTimeout(function () {
                        self.enableSound(enabled);
                    },300);
                }
                return self.soundsEnabled;
            }
    },
    self.showWinners = function (data) {
        var winners;
        if (Boolean(self.player)) {
            if (document.getElementById("winners")) {
                self.player.parentElement.removeChild(document.getElementById("winners"));
            }
            var vHeight = self.player.offsetHeight;
            var vWidth = self.player.offsetWidth;
            var scale = vHeight / 720;
            winners = document.createElement('div');
            winners.style.position = "absolute";
            winners.setAttribute("id", "winners");
            winners.style.opacity = data.opacity ? data.opacity / 100 : 1;
            winners.style.overflow = "hidden";
            winners.style['font-size'] = data.font_size * scale + 'px';
            winners.style['left'] = 0 + 'px';
            winners.style['top'] = 0 + 'px';
            winners.style['height'] = vHeight - vHeight * data.y/100 + 'px';
            winners.style['width'] = vWidth - vWidth * data.x/100 + 'px';
            winners.style['padding-left'] = vWidth * data.x/100 + 'px';
            winners.style['padding-top'] = vHeight * data.y/100 + 'px';

            var resizeFunc = function resizeWinners() {
                var timeout;
                if (document.getElementById('winners')) {
                   timeout= setTimeout(function () {
                    var vWidth, vHeight, scale;
                    vWidth = self.player.offsetWidth;
                    vHeight = self.player.offsetHeight;
                    scale = vHeight / 720;
                    winners.style['left'] = 0 + 'px';
                    winners.style['top'] = 0 + 'px';
                    winners.style['font-size'] = data.font_size * scale + 'px';
                    winners.style['height'] = vHeight - vHeight * data.y / 100 + 'px';
                    winners.style['width'] = vWidth - vWidth * data.x / 100 + 'px';
                    winners.style['padding-left'] = vWidth * data.x / 100 + 'px';
                    winners.style['padding-top'] = vHeight * data.y / 100 + 'px';
                    if (data.title) {
                        winners.firstChild.style['font-size'] = data.title.font_size * scale + 'px';
                        winners.firstChild.style['left'] = vWidth * data.title.x / 100 + 'px';
                        winners.firstChild.style['top'] = vHeight * data.title.y / 100 + 'px';
                    }
                    for (var i = 0 ; i < winners.children[1].children.length; i++) {
                        var child = winners.children[1].children[i];
                        child.style['height'] = vHeight * data.row_height / 100 + 'px';
                        child.style['margin-left'] = vWidth * data.row_margin / 100 + 'px';
                        for (var j = 0 ; j < child.children.length; j++) {
                            var col = child.children[j];
                            col.style['width'] = vWidth * data.columns[j].width / 100 + 'px';
                        }
                    }
                    resizeFunc();
                  }, 500);
                } else {
                    clearTimeout(timeout);
                    window.removeEventListener('resize', resizeFunc);
                }
            }
            window.removeEventListener('resize', resizeFunc);
            window.addEventListener('resize', resizeFunc, false);
            if (isMobile.any() && !isMobile.pad() && data.still) {
                winners.style['background-image'] = 'url(' + vodUrl + data.still + ')';
                winners.style['background-size'] = 'cover';
            }
            var innerHtml = "<div style='color:#fff;margin: auto auto;  position: relative;'>";
            var title = document.createElement('div');
            title.style.position = "absolute";
            title.style['font-size'] = 28 * scale + 'px';
            title.style['color'] = "#fff";
            if (data.title) {
                title.style['left'] = vWidth * data.title.x/100 + 'px';
                title.style['top'] = vHeight * data.title.y/100 + 'px';
                title.innerHTML = data.title.text;
            }
            winners.appendChild(title);
            var timeout;
            function showRow(id) {
                var row = document.createElement('div');
                row.style.opacity = 1;
                row.style.display = 'flex';
                row.style.display = '-webkit-box';
                row.style.display = '-webkit-flex';
                row.style['height'] = vHeight * data.row_height/100 + 'px';
                row.style['margin-left'] = vWidth * data.row_margin/100 + 'px';
                row.innerHTML = "";
                for (var c in data.columns) {
                    var cellData = data.columns[c]['name'] === 'amount' ? (parseFloat(data.items[id][data.columns[c]['name']]) > 9999 ? kFormater(parseFloat(data.items[id][data.columns[c]['name']])) : data.items[id][data.columns[c]['name']]) + data.items[id].currency : data.items[id][data.columns[c]['name']];
                    row.innerHTML += "<div style='text-align: {0};width:{1}px;float: left;'>{2}</div>".format(c==0?"start":"end",vWidth * data.columns[c].width / 100, cellData);
                }
                winners.children[1].appendChild(row);
                clearTimeout(timeout);
                timeout=setTimeout(function () {
                    id++;
                    if (id < data.row_count && id < data.items.length) {
                        showRow(id);
                    }
                }, 300);
            }
            winners.innerHTML += innerHtml;
            self.player.parentElement.appendChild(winners);
            if(data.items.length>0)
            showRow(0);
            Anim.fadeIn(winners, {
                duration: 300,
                complete: function () {
                }
            });
        } else {
            console.log('loading...');
            setTimeout(function () {
                self.showWinners(data);
            }, 300);
        }
    };
    self.showMessage = function (msg, time, error) {
        var showTime = time ? time : 4000;
        var messageBox;
        messageBox = document.createElement('div');
        messageBox.style.position = "absolute";
        messageBox.style.left = 0;
        messageBox.style.right = 0;
        messageBox.style["margin-left"] = "auto";
        messageBox.style["margin-right"] = "auto";
        messageBox.style["padding"] = "5px";
        messageBox.style["font-size"] = "19px";
        messageBox.style.top = "10px";
        messageBox.style["fontFamily"] = "Gotham";
        messageBox.style.opacity = "0";
        messageBox.id = "system_message";
        messageBox.style["margin"] = "2% auto";
        messageBox.style["z-index"] = "100000";
        messageBox.style["border-radius"] = "5px";
        if (error) {
            messageBox.style["color"] = "#a94442";
            messageBox.style["background-color"] = "#f2dede";
            messageBox.style["border-color"] = "#ebccd1";
        } else {
            messageBox.style["color"] = "#3c763d";
            messageBox.style["background-color"] = "#dff0d8";
            messageBox.style["border-color"] = "#d6e9c6";
        }
        messageBox.style.width = "50%";
        var innerHtml = "<div style='line-height: 22px; opacity: 1;  display: inline-flex;'>";
        innerHtml += msg;
        innerHtml += "</div>";
        messageBox.innerHTML += innerHtml;
        document.body.appendChild(messageBox);
        Anim.fadeIn(messageBox, {
            duration: 300,
            complete: function () {
            }
        });
        setTimeout(function () {
            if (document.getElementById('system_message'))
                Anim.fadeOut(messageBox, {
                    duration: 300,
                    complete: function () {
                        document.body.removeChild(messageBox);
                    }
                });
        }, showTime);
    };
    self.showPromt = function (msg,confirmText,cancelText, confirm, cancel) {
        if (!document.getElementById('system-message-box') && !document.getElementById("frame_popup")) {
            var messageBox;
            messageBox = document.createElement('div');
            messageBox.style.position = "absolute";
            messageBox.style.left = 0;
            messageBox.style.right = 0;
            messageBox.style["margin-left"] = "auto";
            messageBox.style["margin-right"] = "auto";
            messageBox.style.top = "20%";
            messageBox.setAttribute("id", "system-message-box");
            messageBox.style.opacity = "0";
            messageBox.style["min-width"] = "250px";
            messageBox.style["fontFamily"] = "Gotham";
            messageBox.style["margin"] = "2% auto";
            messageBox.style["z-index"] = "100000";
            messageBox.style["border-radius"] = "6px";
            messageBox.style["border"] = "1px solid rgba(0,0,0,.2)";
            messageBox.style["color"] = "#959595";
            messageBox.style["-webkit-box-shadow"] = "0 5px 15px rgba(0,0,0,.5)";
            messageBox.style["box-shadow"] = "0 5px 15px rgba(0,0,0,.5)";
            messageBox.style["background-color"] = "#fff";
            messageBox.style.width = "25%";
            var titleHtml = "<div style='padding: 10px;line-height: 22px;  text-align: center;padding-left: 15px;font-size: 18px;'>";
            titleHtml += msg;
            titleHtml += "</div>";
            messageBox.innerHTML += titleHtml;

            var btnHtml = "<div style='padding: 5px;text-align: right;'>";
            if (isMobile.any()) {
                btnHtml += "<button id='ok-btn' style='font-family:Gotham;width: 100%;display: inline-block;margin: 2px 0px;padding: 6px 5px;font-size: 14px;vertical-align: middle;cursor: pointer;border: 1px solid transparent; border-radius: 4px;color: #fff;background-color: #58803a;border-color: #58803a;' class='btn-ok'>{0}</button>".format(confirmText ? confirmText : "Ok");
                if (cancelText)
                    btnHtml += "<button id='cancel-btn' style='font-family:Gotham;width:100%;display: inline-block;margin: 2px 0px;padding: 6px 5px;font-size: 14px;vertical-align: middle;cursor: pointer;border: 1px solid #959595; border-radius: 4px;color: #959595;background-color: #fff;border-color: #959595;' class='btn-cancel'>{0}</button>".format(cancelText ? cancelText : "Cancel");
            } else {
                btnHtml += "<button id='ok-btn' style='font-family:Gotham;width: 36%;display: inline-block; margin: 5px;padding: 6px 5px;font-size: 14px;vertical-align: middle;cursor: pointer;border: 1px solid transparent; border-radius: 4px;color: #fff;background-color: #58803a;border-color: #58803a;' class='btn-ok'>{0}</button>".format(confirmText ? confirmText : "Ok");
                if (cancelText)
                    btnHtml += "<button id='cancel-btn' style='font-family:Gotham;width: 54%;display: inline-block;  margin: 5px;padding: 6px 5px;font-size: 14px;vertical-align: middle;cursor: pointer;border: 1px solid #959595; border-radius: 4px;color: #959595;background-color: #fff;border-color: #959595;' class='btn-cancel'>{0}</button>".format(cancelText ? cancelText : "Cancel");
            }
            btnHtml += "</div>";
            messageBox.innerHTML += btnHtml;

            document.body.appendChild(messageBox);
            Anim.fadeIn(messageBox, {
                duration: 300,
                complete: function () {
                }
            });
            document.getElementById("ok-btn").onclick = function () {
                if (confirm)
                    confirm();
                Anim.fadeOut(messageBox, {
                    duration: 300,
                    complete: function () {
                        document.body.removeChild(messageBox);
                    }
                });
            };
            if (cancelText)
                document.getElementById("cancel-btn").onclick = function () {
                if (cancel)
                    cancel();
                Anim.fadeOut(messageBox, {
                    duration: 300,
                    complete: function () {
                        document.body.removeChild(messageBox);
                    }
                });
            };
        }
    };
    self.showGameTimer = function (time) {
        var messageBox;
        messageBox = document.createElement('div');
        messageBox.style.position = "absolute";
        messageBox.style.left = 0;
        messageBox.style.right = 0;
        messageBox.style["margin-left"] = "auto";
        messageBox.style["margin-right"] = "auto";
        messageBox.style["padding"] = "5px";
        if (isMobile.any()) {
            messageBox.style["font-size"] = "14px";
        } else {
            messageBox.style["font-size"] = "19px";
        }
        messageBox.style["fontFamily"] = "Gotham";
        messageBox.style.opacity = "0";
        messageBox.id = "timer_message";
        messageBox.style["margin"] = "1% auto";
        messageBox.style["z-index"] = "100000";
        messageBox.style["border-radius"] = "5px";
        messageBox.style["text-align"] = "center";
        messageBox.style["background-color"] = "rgba(130, 130, 128, 0.76)";
        messageBox.style.width = "33%";
        var innerHtml = "<div style='line-height: 20px; opacity: 1;display: inline-flex;'>";
        innerHtml += self.getLocalizedString("Time left: {0}", true).format(time > 60 ? ("0" + parseInt((time / 60 - (time / 60) % 1))).slice(-2) + ":" + ("0" + parseInt(time % 60)).slice(-2) : time + " " + self.getLocalizedString("sec.", true));
        innerHtml += "</div>";
        messageBox.innerHTML = innerHtml;
        document.body.appendChild(messageBox);
        Anim.fadeIn(messageBox, {
            duration: 300,
            complete: function () {
            }
        });
        var timer=setInterval(function () {
            if (document.getElementById('timer_message'))
                if (time <= 0) {
                    Anim.fadeOut(messageBox, {
                        duration: 300,
                        complete: function() {
                            document.body.removeChild(messageBox);
                        }
                    });
                    clearInterval(timer);
                } else {
                    var innerHtml = "<div style='line-height: 22px; opacity: 1;display: inline-flex;'>";
                    innerHtml += self.getLocalizedString("Time left: {0}", true).format(time > 60 ? ("0" + parseInt((time / 60 - (time / 60) % 1))).slice(-2) + ":" + ("0" + parseInt(time % 60)).slice(-2) : time + " " + self.getLocalizedString("sec.", true));
                    innerHtml += "</div>";
                    messageBox.innerHTML = innerHtml;
                }
            time--;
        }, 1000);
    };
    self.showPopupFrame = function (url) {
        var frameBox = document.createElement('div');
        frameBox.style.position = "absolute";
        frameBox.style.left = 0;
        frameBox.style.right = 0;
        frameBox.style["margin-left"] = "auto";
        frameBox.style["margin-right"] = "auto";
        frameBox.style["padding"] = "2% 5px";
        frameBox.style["font-size"] = "19px";
        frameBox.style.top = "0";
        frameBox.style["fontFamily"] = "Gotham";
        frameBox.style.opacity = "0";
        frameBox.id = "frame_popup";
        frameBox.style["margin"] = "auto";
        frameBox.style["z-index"] = "100001";
        frameBox.style["border-radius"] = "5px";
        frameBox.style["background-color"] = "rgba(39, 39, 39, 0.72)";
        frameBox.style.width = "100%";
        frameBox.style.height = "100%";
        var innerHtml = "<iframe src='" + url + "' style='opacity: 1; width:80%;height:90%; display: block;margin:auto; border: none;' frameborder=0;/>";
        frameBox.innerHTML = innerHtml;
        document.body.appendChild(frameBox);
        Anim.fadeIn(frameBox, {
            duration: 300,
            complete: function () {
            }
        });
    };
    self.showProvablyFair = function (confirm, cancel) {
        var messageBox;
        if (self.provablyFair) {
            if (document.getElementById('provably-fair-box'))
                document.body.removeChild(document.getElementById('provably-fair-box'));
            messageBox = document.createElement('div');
            messageBox.style.position = "relative";
            messageBox.setAttribute("id", "provably-fair-box");
            messageBox.style.opacity = "0";
            messageBox.style["min-width"] = "370px";
            messageBox.style["margin"] = "2% auto";
            messageBox.style["z-index"] = "100000";
            messageBox.style["border-radius"] = "6px";
            messageBox.style["border"] = "1px solid rgba(0,0,0,.2)";
            messageBox.style["color"] = "#444";
            messageBox.style["fontFamily"] = "Gotham";
            messageBox.style["-webkit-box-shadow"] = "0 5px 15px rgba(0,0,0,.5)";
            messageBox.style["box-shadow"] = "0 5px 15px rgba(0,0,0,.5)";
            messageBox.style["background-color"] = "#fff";
            messageBox.style["zoom"] =  isMobile.any()? 2 : 1;
            messageBox.style.width = "35%";
            var inputStyle = "width:90%;margin: 0 5%; border: 1px solid #ddd;font-size: 10pt;height: 25px;border-radius: 2px;box-shadow: inset 0 1px 1px 0 rgba(0,0,0,.05);";
            var lblStyle = "width: 90%;text-align: left;margin: 0 auto;";

            var pHash = self.provablyFair.thisGame ? self.provablyFair.thisGame.hash : "";
            var initialShuffle = self.provablyFair.thisGame ? self.provablyFair.thisGame.initialShuffle : "";
            var serverSeed = self.provablyFair.thisGame ? self.provablyFair.thisGame.serverSeed : "";
            var playerSeed = self.provablyFair.thisGame ? self.provablyFair.thisGame.playerSeed : "";
            var finalShuffle = self.provablyFair.thisGame ? self.provablyFair.thisGame.finalShuffle : "";

            var link = "?hash={0}&initialShuffle={1}&serverSeed={2}&clientSeed={3}".format(pHash, initialShuffle, serverSeed, playerSeed)

            var innerHtml = "";
            innerHtml += "<div><div style='padding: 4px;line-height: 20px;  text-align: left;padding-left: 15px;font-size: 18px;'>{0}".format(self.getLocalizedString("This round", true));
            innerHtml += "<a href='/_GameContent/ProvablyFair/index.html{0}'target='_blank' style='padding: 2px;line-height: 20px;  text-align: left;float: right; padding-right: 20px;font-size: 18px;'>{1}</a></div>".format(link, self.getLocalizedString("Verify", true));
            innerHtml += "<div style='padding: 3px 0;'><div style='{0}'>{3}</div><input id='pref_hash' class='textfield' style='{1}' readonly='readonly' type='text' value='{2}'></input></div>".format(lblStyle, inputStyle, pHash, self.getLocalizedString("Server seed hash:", true));
            innerHtml += "<div style='padding: 3px 0;'><div style='{0}'>{3}</div><input id='init_shuffle' class='textfield' style='{1}' readonly='readonly' type='text' value='{2}'></input></div>".format(lblStyle, inputStyle, initialShuffle, self.getLocalizedString("Initial shuffle:", true));
            innerHtml += "<div style='padding: 3px 0;'><div style='{0}'>{3}</div><input id='prev_server_seed' class='textfield' style='{1}' readonly='readonly' type='text' value='{2}'></input></div>".format(lblStyle, inputStyle, serverSeed, self.getLocalizedString("Server seed:", true));
            innerHtml += "<div style='padding: 3px 0;'><div style='{0}'>{3}</div><input id='prev_client_seed' class='textfield' style='{1}' readonly='readonly' type='text' value='{2}'></input></div>".format(lblStyle, inputStyle, playerSeed, self.getLocalizedString("Client seed:", true));
            innerHtml += "<div style='padding: 3px 0;'><div style='{0}'>{3}</div><input id='final_shuffle' class='textfield' style='{1}' readonly='readonly' type='text' value='{2}'></input></div>".format(lblStyle, inputStyle, finalShuffle, self.getLocalizedString("Final shuffle:", true));
            innerHtml += "<div style='padding: 4px 0 4px 0;border-bottom: 1px solid #e5e5e5;'>";

            innerHtml += "<div style='padding: 4px;line-height: 20px;  text-align: left;padding-left: 15px;font-size: 18px;'>{0}</div>".format(self.getLocalizedString("Next round", true));
            innerHtml += "<div style='padding: 3px 0;'><div style='{0}'>{3}</div><input id='hash' class='textfield' style='{1}' readonly='readonly' type='text' value='{2}'></input></div>".format(lblStyle, inputStyle, self.provablyFair.nextGame.hash, self.getLocalizedString("Server seed hash:", true));
            innerHtml += "<div style='padding: 3px 0;'><div style='{0}'>{3}</div><input id='client_seed' maxlength='32' class='textfield' style='{1}'  type='text' value='{2}'></input></div>".format(lblStyle, inputStyle, self.provablyFair.nextGame.seed, self.getLocalizedString("Client seed:", true));
            innerHtml += "<div style='padding: 1px 0;font-size: 11px;text-align: center;'>{0}</div>".format(self.getLocalizedString("Feeling lucky? Enter any text up to 32 symbols here to test the fortune.", true));

            var btnHtml = "<div style='margin: 7px;text-align: right;border-top: 1px solid #e5e5e5;'>";
            btnHtml += "<button id='pf-cancel-btn' style='display: inline-block;  margin: 5px;padding: 6px 5px;font-size: 14px;vertical-align: middle;cursor: pointer;border: 1px solid #ccc; border-radius: 4px;color: #333;background-color: #fff;border-color: #ccc;' class='btn-cancel'>{0}</button>".format(self.getLocalizedString("Cancel", true));
            btnHtml += "<button id='pf-ok-btn' style='display: inline-block;  margin: 5px;padding: 6px 5px;font-size: 14px;vertical-align: middle;cursor: pointer;border: 1px solid transparent; border-radius: 4px;color: #fff;background-color: #009900;border-color: #2e6da4;' class='btn-ok'>{0}</button>".format(self.getLocalizedString("Ok", true));
            btnHtml += "</div>";
            innerHtml += btnHtml;

            messageBox.innerHTML = innerHtml;
            window.addEventListener('resize', function () {
                if (document.getElementById("provably-fair-box")) {
                    setTimeout(function () {
                        messageBox.style["zoom"] = document.body.offsetHeight / 550 < 1 ? document.body.offsetHeight / 550 : 1;
                    }, 300);
                }
            });

            document.body.appendChild(messageBox);
            if (isMobile.iPhone()) {
                messageBox.style.zoom = 2;
            }
            Anim.fadeIn(messageBox, {
                duration: 300,
                complete: function () {
                }
            });
            document.getElementById("pf-ok-btn").onclick = function () {
                if (confirm)
                    confirm();
                self.provablyFair.nextGame.seed = document.getElementById('client_seed').value;
                Anim.fadeOut(messageBox, {
                    duration: 300,
                    complete: function () {
                        document.body.removeChild(messageBox);
                    }
                });
            };
            document.getElementById("pf-cancel-btn").onclick = function () {
                if (cancel)
                    cancel();
                Anim.fadeOut(messageBox, {
                    duration: 300,
                    complete: function () {
                        document.body.removeChild(messageBox);
                    }
                });
            };
        }
    };
    self.getLocalizedString = function (key, onlyText) {
        if (localizationDic[currentLocale] && localizationDic[currentLocale][key]) {
            var locString = localizationDic[currentLocale][key];
            for (var key in arguments[2]) {
                if (arguments[2].hasOwnProperty(key)) {
                    locString = locString.split("{${0}}".format(key)).join(arguments[2][key]);
                }
            }
        }
        else
            locString = key;
        var locObj = {
            id: randomId(),
            key: key,
            data: arguments[2]
        };
        var locItem = onlyText ? locString : "<span id='{0}'>{1}</span>".format(locObj.id, locString);
        localizedStrings.push(locObj);
        return locItem;
    };
    self.setProgressBarPercent = function (percent) {
        window.parent.postMessage({ type: 'progress', progress: percent }, "*");
        if (percent == 100) {
            if (isMobile.Android())
                if (window.JSInterface)
                    window.JSInterface.loaded();
                else if (isMobile.iOS()) {
                    window.location.hash = '#cmd_loaded';
                }
        }
    };
    self.changeLocale = function (locale) {
        currentLocale = locale;
        updateLocalizedStrings();
    };
    self.postLog = function (msg, type) {
        var data = {
            "type": type,
            "source": instanceId,
            "sourceUrl": window.location.href,
            "message": msg
        };
        try{
            var jsonData = JSON.stringify(data);
            AJAXPost({ url: BASE_SERVER_URL + "post_debug/", setContentType: true, jsonData: jsonData }, function () {
            }, function () {
            });
        } catch (e) {
            console.warn(e);
        }
    };
    self.cashier = function () {
        window.parent.postMessage({ type: 'cashier' }, "*");
    }
    self.showRules= function() {
        var win = window.open(rulesUrl + "&langId=" + currentLocale, '_blank');
        win.focus();
    }
    return self;
};

function loadFont(family, url) {
    var head = document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = "@font-face {\n" +
                                    "\tfont-family: \"{0}\";\n".format(family) +
                                    "\tsrc: url('{0}.otf') format('opentype'),\n".format(url) +
                                    "\turl('{0}.woff') format('woff'),\n".format(url) +
                                    "\turl('{0}.ttf') format('truetype'),\n".format(url) +
                                    "\turl('{0}.eot');\n" +
                                "}\n";
    head.appendChild(style);
}
function hasFlash() {
    return (typeof navigator.plugins == "undefined" || navigator.plugins.length == 0) ? !!(("ActiveXObject" in window) && (new ActiveXObject("ShockwaveFlash.ShockwaveFlash"))) : navigator.plugins["Shockwave Flash"];
}
function getIOSVersion() {
    if (/iP(hone|od|ad)/.test(navigator.platform)) {
        var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        return [parseInt(v[1], 10)];
    } else {
        return 0;
    }
}
function getChromeVersion() {
    var raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);

    return raw ? parseInt(raw[2], 10) : false;
}
function createCookie(name, value, days) {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            date.setHours(0, 0, 0);
            expires = "; expires=" + date.toString();
        }
        else {
            expires = "";
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }
    function getCookie(c_name) {
        if (document.cookie.length > 0 && c_name) {
            c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length;
                }
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    }
    function randomId() {
        var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return id;
    }
    function getQueryParams(qs) {
        qs = qs.split("+").join(" ");
        var params = {}, tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;
        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])]
                = decodeURIComponent(tokens[2]);
        }
        return params;
    }
    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match;
            });
        };
    }
    function kFormater(num, precision) {
        if (num > 999)
            return (num / 1000).toFixed(precision && (num / 1000) % 1 != 0 ? precision : 0) + 'k';
        else if (num > 999999)
            return (num / 100000).toFixed(precision && (num / 100000) % 1 != 0 ? precision : 0) + 'm';
        else
            return num;
    }
    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        iPad: function () {
            return navigator.userAgent.match(/iPad/i);
        },
        iPhone: function () {
            return navigator.userAgent.match(/iPhone|iPod/i);
        },
        androidPhone: function () {
            return navigator.userAgent.match(/Android/i) && navigator.userAgent.match(/Mobile/i);
        },
        androidPad: function () {
            return navigator.userAgent.match(/Android/i) && !navigator.userAgent.match(/Mobile/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        TV: function () {
            return navigator.userAgent.match(/TV/i);
        },
        Desktop: function () {
            return !("ontouchstart" in window) && !navigator.userAgent.match(/TV/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        },
        pad: function () {
            return (isMobile.androidPad() || isMobile.iPad());
        },
        phone: function () {
            return (isMobile.iPhone() || isMobile.androidPhone() || isMobile.Windows());
        }
    };
