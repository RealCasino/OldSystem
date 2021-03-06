﻿var GAMESTATE_CODE_TABLE_CLOSED = 0,
    GAMESTATE_CODE_TABLE_OPENED = 1,
    GAMESTATE_CODE_WINNING_NUMBER = 2,
    GAMESTATE_CODE_CURRENT_NUMBER = 3,
    GAMESTATE_CODE_WINNING_SUM = 4,

    MessageDispatcher = {
        winNumArr:[],
        numbers: [],
        bets: [],
        previousMsgType: "",
        isSetWinNum: false,
        isTableOpen: false,
        gameStatus: "",
        winAmount: 0,
        timer: null,
        betHistory: [],
        videoCallBack: null,
        gameId: "",
        serverTime: new Date(),
		messages:[],
		handle: function (msg,old) {
          var self = this;
        var text, status, winner, username;
        var gameInstance = game.state.states.Game;
        if (!gameInstance.ready) {
            if (!old)
                self.messages.push(msg);
            if (!self.queueTimer)
                self.queueTimer = setInterval(function () {
                    if (gameInstance.ready && self.messages.length > 0) {
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
                if (status == GAMESTATE_CODE_TABLE_OPENED) {
                    gameInstance.betNumbers = [];
                    this.numbers = [];
                    this.bets = [];
                    this.isSetWinNum = false;
                    this.isTableOpen = true;
                    gameInstance.resetTable();
                    if (gameInstance.mode == "Manual")
                        gameInstance.restartGame();
                    else {
                        gameInstance.redrawButtons(false);
                    }
                    this.winAmount = 0;
                    this.gameId = msg.message.round_id;          
                    gameInstance.changeStatus($.client.getLocalizedString("Place your bet", true));
                    gameInstance.showVideo(false);
                    gameInstance.showTimer(msg.message.length);

                } else if (status == GAMESTATE_CODE_CURRENT_NUMBER) {
                    gameInstance.showVideo(true);
                    this.numbers = msg.message.win_numbers;
                    gameInstance.showNumbers(msg.message.win_numbers);
                } else if (status == GAMESTATE_CODE_WINNING_NUMBER) {
                    this.isSetWinNum = true;
                    if (betHistory.length > 3) {
                        betHistory.shift();
                    }
                    betHistory.push({ winner: msg.message.win_numbers, betAmount: summaDeb, winAmount: 0 });
                    if (this.winNumArr.length >= 3) {
                        this.winNumArr.shift();
                    }
                    this.winNumArr.push({ numbers: msg.message.win_numbers, gameId: this.gameId });
                    gameInstance.changeStatus($.client.getLocalizedString("Draw end", true));
                    this.numbers = msg.message.win_numbers;
                    if (gameInstance.mode == "Manual")
                        gameInstance.restartGame();
                    else {
                        gameInstance.showNumbers(msg.message.win_numbers);
                    }
                    gameInstance.updateTickersText();
                    setTimeout(function () {
                        gameInstance.showVideo(false);
                    }, 3000);

                } else if (status == GAMESTATE_CODE_TABLE_CLOSED) {
                    this.isTableOpen = false;
                    if (gameInstance.mode == "Manual")
                        gameInstance.restartGame();
                    else {
                        if (!gameInstance.betNumbers || gameInstance.betNumbers.length == 0) {
                            gameInstance.clearAll();
                        }
                        gameInstance.redrawButtons(true);
                    }
                    gameInstance.changeStatus($.client.getLocalizedString("No more bet", true));
                    setTimeout(function() {
                        gameInstance.showVideo(true);
                    },2000);
                    gameInstance.showWinner(0);
                } 
            } else if (msg.type == "user") {
                    USER_NAME = msg.message.user.nick;
                    USER_BALANCE = msg.message.balance;
                    headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                    var name = USER_NAME ? USER_NAME.toUpperCase().length < 15 ? USER_NAME.toUpperCase() : USER_NAME.toUpperCase().substr(0, 15) + "..." : "";
                    if (userNameText) userNameText.setText(name);
                    if (gameInstance.drawBetsChip && msg.message.bets)
                        gameInstance.drawBetsChip({ stake: { factors: msg.message.bets } });
                    if (msg.message.user.isPlayingForFun) {
                        gameInstance.showCashier(false);
                    } else if ($.client.UserData.Features && $.client.UserData.Features.cashier) {
                        gameInstance.showCashier(true);
                    } else {
                        gameInstance.showCashier(false);
                    }
                    gameInstance.isPlayingForFun = msg.message.user.isPlayingForFun;
                    this.gameId = msg.message.gameId;
                } else if (msg.type == "config") {
                    game.config = msg.message.configuration;
                    game.config.BetStep = parseFloat(game.config.BetStep);
                    betAmount = parseFloat(game.config.MinBet);
                    gameInstance.updateTickersText();

                    headerBetInputVal.setTitle($.client.UserData.CurrencySign + betAmount);
                    for (var i = 0; i < game.config.WinRates.length; i++) {
                        if (!game.config.MinNumbersCount || game.config.WinRates[i].Num < game.config.MinNumbersCount) {
                            game.config.MinNumbersCount = game.config.WinRates[i].Num;
                        }
                        if (!game.config.MaxNumbersCount || game.config.WinRates[i].Num > game.config.MaxNumbersCount) {
                            game.config.MaxNumbersCount = game.config.WinRates[i].Num;
                        }
                    }
                    if (game.config.Mode == "Manual") {
                        MessageDispatcher.isTableOpen = true;
                        gameInstance.enableManualMode(true);
                    } else {
                        gameInstance.redrawButtons(true);
                        var videoOnDemand;
                        if (msg.message.mode == "Auto") {
                            videoOnDemand = true;
                        }
                      //  $.client.getVideoPlayer("landscape_video", videoOnDemand);
                        $("#landscape_video").show();
                        $("#landscape_video").on("click", function () {
                            if ($("#landscape_video").hasClass("video-fullscreen")) {
                                $("#landscape_video").removeClass("video-fullscreen");

                            } else {
                                $("#landscape_video").addClass("video-fullscreen");
                            }
                        });
                        $(document).keyup(function (e) {
                            if (e.keyCode == 27) { // escape key maps to keycode `27`
                                $("#landscape_video").removeClass("video-fullscreen");
                            }
                        });
                    }
                    gameInstance.mode = game.config.Mode;
                    gameInstance.showVideo();
                    
                } else if (msg.type == "win") {
                this.winAmount += msg.message.win_sum;
                gameInstance.showWinner(this.winAmount);
                gameInstance.changeStatus($.client.getLocalizedString("Your win", true, { sign: $.client.UserData.CurrencySign, amount: (this.winAmount > 99999 ? kFormater(this.winAmount) : parseFloat(this.winAmount).toFixed(2)) }));
                }else if (msg.type == "bets") {
                    if (msg.message.bets.length > 0) {
                        console.log(msg.message)
                    var bet = msg.message.bets[0];
                    gameInstance.redrawBet(bet);                    
                }

            } else if (msg.type == "refresh_user_data") {
                    USER_BALANCE = msg.message.user.balance;
                    USER_NAME = msg.message.user.nick;
                    if (MessageDispatcher.isTableOpen)
                        headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                    var name = USER_NAME ? USER_NAME.length < 13 ? USER_NAME : USER_NAME.substr(0, 13) + "..." : "";
                    if (userNameText) userNameText.setText(name);
                } else if (msg.type == "balance") {
                    USER_BALANCE = msg.message.balance;
                    TOTAL_LOST = msg.message.totalLost;
                    if (MessageDispatcher.isTableOpen)
                    headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                } else if (msg.type == "error") {
                    if (msg.message) {
                        $.client.showMessage($.client.getLocalizedString(msg.message, true), 15000);
                        gameInstance.resetTable();
                    }
                } else if (msg.type == "clearTable") {
                    gameInstance.resetTable();
                    self.winAmount = 0;
                }
                previousMsgType = msg.type;
            }
        }
    };