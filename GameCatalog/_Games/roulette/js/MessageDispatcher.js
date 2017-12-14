var GAMESTATE_CODE_TABLE_CLOSED = 0,
    GAMESTATE_CODE_TABLE_OPENED = 1,
    GAMESTATE_CODE_PLACE_YOUR_BET = 2,
    GAMESTATE_CODE_WINNING_NUMBER = 3,
    GAMESTATE_CODE_NO_MORE_BETS = 4,
    GAMESTATE_CODE_BALL_IN_RIM = 5,
    GAMESTATE_CODE_ROUND_CANCELED = 6,

    MessageDispatcher = {
        winNumArr: [],
        previousMsgType: "",
        videoDisabled: false,
        isSetWinNum: false,
        isTableOpen: false,
        gameStatus: "",
        winAmount: 0,
        gameMode: false,
        timer: null,
        betHistory: [],
        videoCallBack: null,
        wheel: null,
        gameId: "",
        serverTime: new Date(),
        userBets: [],
        messages: [],
        handle: function(msg, old) {
            var text, status, winNumber, videoTimeout;
            var gameInstance = game.state.states.MainMenu;
            var self = this;
            if (!gameInstance.ready) {
                if (!old)
                self.messages.push(msg);
                if (!self.queueTimer)
                self.queueTimer=setInterval(function () {
                    if (gameInstance.ready && self.messages.length > 0){
                        for (var i = 0; i < self.messages.length; i++) {
                            self.handle(self.messages[i], true);
                        }
                    self.messages = [];
                    clearInterval(self.queueTimer);
                    self.queueTimer = null;
                }
                }, 200);
            } else if (self.messages.length > 0 && !old) {
                self.messages.push(msg);
                if (gameInstance.ready && self.messages.length > 0)
                    for (var i = 0; i < self.messages.length; i++) {
                        self.handle(self.messages[i], true);
                    }
                self.messages = [];
                clearInterval(self.queueTimer);
                self.queueTimer = null;
            } else {
                if (msg.type == "status") {
                    status = msg.message.status;
                    this.gameStatus = status;
                    if (status == GAMESTATE_CODE_TABLE_OPENED) {
                        if (gameInstance.mode == "Manual") {
                            gameInstance.restartGame();
                            self.waitSpinTimer= setInterval(function () {
                                text = $.client.getLocalizedString("Awaiting spin", true).toUpperCase();
                                gameInstance.changeStatus(text, 0, false);
                            }, 60*1000);
                        }
                        if (gameInstance.hideVideo && !window.matchMedia("(orientation: portrait)").matches)
                            gameInstance.hideVideo();
                        if (gameInstance.enableActionBtn)
                            gameInstance.enableActionBtn(true);
                        if (gameInstance.hideDolly)
                            gameInstance.hideDolly();

                        this.isSetWinNum = false;
                        this.isTableOpen = true;
                        this.winAmount = 0;
                        gameInstance.resetTable();
                        if (self.userBets.length > 0 && gameInstance.drawBetsChip) {
                            gameInstance.drawBetsChip(self.userBets);
                        }
                        if (typeof (toggleCube) === "function") {
                            toggleCube(this.gameMode, GAMESTATE_CODE_TABLE_OPENED);
                        }
                        text = "";
                        text += $.client.getLocalizedString("TEXT_DISPLAY_MSG_WAITING_BET", true);
                        gameInstance.changeStatus(text, 0, true);
                        var endTimer = function() {
                            self.isTableOpen = false;
                            self.isSetWinNum = false;
                            if (gameInstance.mode == "Manual")
                                text = $.client.getLocalizedString("Table closed", true).toUpperCase();
                            else
                                text = $.client.getLocalizedString("TEXT_TABLE_CLOSED_NO_MORE_BETS", true);
                            gameInstance.changeStatus(text, 2, false);
                            if (gameInstance.showMessage)
                                gameInstance.showMessage(text);
                        };
                        var updateTimer = function(time) {
                            if (time == 10) {
                                gameInstance.changeStatus($.client.getLocalizedString("TEXT_FINAL_BETS", true), 0, false);
                            }
                        };
                        self.gameId = msg.message.round_id;
                        var arr = msg.message.startDate.split(/[- :]/);
                        self.serverTime = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
                        if (msg.message.length) {
                            var timeToEnd = msg.message.length - 1;
                            if (self.timer) {
                                self.timer.start(timeToEnd, endTimer, updateTimer);
                            } else {
                                self.timer = gameInstance.createTimer(timeToEnd, endTimer, updateTimer);
                            }
                        }
                        self.userBets = [];
                        if (gameInstance.updateLastNumbers)
                            gameInstance.updateLastNumbers(true);

                    } else if (status == GAMESTATE_CODE_WINNING_NUMBER) {
                        winNumber = parseInt(msg.message.win_number);
                        text = $.client.getLocalizedString("TEXT_WIN_NUMBER", true) + " " + winNumber;
                        self.isSetWinNum = true;
                        self.winNumArr.push(winNumber);
                        if (self.winNumArr.length > 9) {
                            self.winNumArr.shift();
                        }
                        gameInstance.changeStatus(text, 0, true);
                        if (self.betHistory.length > 6) {
                            self.betHistory.shift();
                        }
                        self.betHistory.push({ number: winNumber, betAmount: summaDeb, winAmount: 0 });
                        gameInstance.updateStatistics();
                        self.videoCallBack = null;
                        if (gameInstance.showDolly)
                            gameInstance.showDolly(winNumber);
                        if (gameInstance.playWinNumberSound)
                            gameInstance.playWinNumberSound(winNumber);
                        if (gameInstance.removeLossesBet)
                            gameInstance.removeLossesBet(winNumber);
                        if (gameInstance.clearWinAmout)
                            gameInstance.clearWinAmout();
                        if (gameInstance.updateLastNumbers)
                            gameInstance.updateLastNumbers(false);
                        self.userBets = [];
                    } else if (status == GAMESTATE_CODE_TABLE_CLOSED) {
                        this.isTableOpen = false;
                        this.isSetWinNum = false;
                        if (self.timer)
                            self.timer.update(0);
                        if (gameInstance.mode == "Manual")
                            text = $.client.getLocalizedString("Table closed", true).toUpperCase();
                        else
                            text = $.client.getLocalizedString("TEXT_TABLE_CLOSED_NO_MORE_BETS", true);
                        if (gameInstance.showMessage)
                            gameInstance.showMessage(text);
                        winNumber = parseInt(msg.message.win_number);
                        if (gameInstance.wheel)
                            gameInstance.wheel.spin(-1);
                        if (gameInstance.showVideo && !window.matchMedia("(orientation: portrait)").matches)
                            gameInstance.showVideo();
                        if (gameInstance.enableActionBtn)
                            gameInstance.enableActionBtn(false);
                        if (gameInstance.saveRoundBet)
                            gameInstance.saveRoundBet();
                        gameInstance.changeStatus(text, 2, true);
                        gameInstance.updateStatistics();
                        gameInstance.clearAllBet();
                        if (self.waitSpinTimer)
                            clearTimeout(self.waitSpinTimer);
                        if (gameInstance.updateLastNumbers)
                            gameInstance.updateLastNumbers(false);

                    } else if (status == GAMESTATE_CODE_ROUND_CANCELED) {
                        text = $.client.getLocalizedString("TEXT_ROUND_CANCELED", true).toUpperCase();
                        self.isSetWinNum = true;
                        gameInstance.changeStatus(text, 0, true, 2000);
                        self.videoCallBack = null;
                        if (self.timer)
                            self.timer.update(0);
                        gameInstance.resetTable();
                    }
                } else if (msg.type == "win") {
                    self.winAmount += msg.message.amount;
                    USER_BALANCE = msg.message.balance;
                    if (self.winAmount > 0) {
                        gameInstance.showWinner(self.winAmount);
                    }
                    if (gameInstance.hideVideo && !window.matchMedia("(orientation: portrait)").matches)
                        gameInstance.hideVideo();

                } else if (msg.type == "spin") {
                    if (gameInstance.wheel)
                        gameInstance.wheel.spin(msg.message.win_number);
                } else if (msg.type == "balance") {
                    USER_BALANCE = msg.message.balance;
                    TOTAL_LOST = msg.message.totalLost;
                    headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                } else if (msg.type == "user") {
                    if (msg.message.waitTime) {
                        timeToEnd = parseInt(msg.message.waitTime) + 1;
                        if (!self.timer) {
                            self.timer = gameInstance.createTimer(timeToEnd);
                        }
                    }
                    self.gameId = msg.message.roundId;
                    var arr = msg.message.serverDate.split(/[- :]/);
                    self.serverTime = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
                    USER_NAME = msg.message.user.nick;
                    USER_BALANCE = msg.message.balance;
                    if (msg.message.user.isPlayingForFun) {
                        gameInstance.showCashier(false);
                    } else if ($.client.UserData.Features && $.client.UserData.Features.cashier) {
                        gameInstance.showCashier(true);
                    } else {
                        gameInstance.showCashier(false);
                    }
                    headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                    var name = USER_NAME ? USER_NAME.toUpperCase().length < 15 ? USER_NAME.toUpperCase() : USER_NAME.toUpperCase().substr(0, 15) + "..." : "";
                    var videoOnDemand = false, player;
                    gameInstance.videoDisabled = msg.message.videoDisabled;
                    if (msg.message.mode == "Auto" || msg.message.mode == "Manual") {
                        videoOnDemand = true;
                        this.gameMode = true;
                    }
                    gameInstance.mode = msg.message.mode;
                    gameInstance.isPlayingForFun = msg.message.user.isPlayingForFun;
                    if (gameInstance.isPlayingForFun) {
                        setInterval(function() {
                            text = $.client.getLocalizedString("PLAYING FOR FUN", true).toUpperCase();
                            gameInstance.changeStatus(text, 0, false, 1000);
                        }, 5000);
                    }
                    if (gameInstance.showVideoBtn)
                        gameInstance.showVideoBtn();
                    self.userBets = msg.message.bets;
                    if (self.userBets.length > 0 && gameInstance.drawBetsChip) {
                        gameInstance.drawBetsChip(self.userBets);
                    }
                    if (userNameText) userNameText.setText(name);
                    if (!gameInstance.videoDisabled) {
                        if (mode == modes.landscape) {
                            player = $.client.getVideoPlayer("landscape_video", videoOnDemand, true);
                            $("#landscape_video").show();
                        } else {
                            player = $.client.getVideoPlayer("portrait_video", videoOnDemand, true);
                            $("#close-video").click(function() {
                                $("#portrait_video").animate({ top: "-100%" }, "slow");
                                _videoFlagShow = false;
                            });
                        }
                    } else {
                        if (gameInstance.showWheel) {
                            self.wheel = gameInstance.showWheel();
                            gameInstance.wheel = self.wheel;
                        }
                    }
               
                } else if (msg.type == "refresh_user_data") {
                    USER_BALANCE = msg.message.user.balance;
                    USER_NAME = msg.message.user.nick;
                    headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                    var name = USER_NAME ? USER_NAME.toUpperCase().length < 15 ? USER_NAME.toUpperCase() : USER_NAME.toUpperCase().substr(0, 15) + "..." : "";
                    if (userNameText) userNameText.setText(name);
                } else if (msg.type == "overlay") {
                    if (gameInstance.showOverlay)
                        gameInstance.showOverlay(msg.message.visible);

                } else if (msg.type == "error") {
                    if (msg.message) {
                        if (msg.target == "promt") {
                            $.client.showPromt($.client.getLocalizedString(msg.message, true), $.client.getLocalizedString("Ok", true), null, function() {});
                        } else {
                            text = $.client.getLocalizedString(msg.message, true).toUpperCase();
                            gameInstance.changeStatus(text, 2, true);
                        }
                    }
                } else if (msg.type == "clearTable") {
                    gameInstance.resetTable();
                    self.winAmount = 0;
                } else if (msg.type == "remove_bets") {
                }
                self.previousMsgType = msg.type;
            }
        }
    };