var GAMESTATE_CODE_TABLE_CLOSED = 0,
    GAMESTATE_CODE_TABLE_OPENED = 1,
    GAMESTATE_CODE_WINNING_NUMBER = 3,
    GAMESTATE_CODE_WINNING_SUM = 4,

    MessageDispatcher = {
        winNumArr: [],
        previousMsgType: "",
        isSetWinNum: false,
        isTableOpen: false,
        gameStatus: "",
        winAmount: 0,
        timer: null,
        betHistory: [],
        videoCallBack: null,
        messages: [],
        handle: function (response, old) {
            var self = this;
            var text, status, winner, username;
            var msg = response.message;
            var gameInstance = game.state.states.Game;
            if (!gameInstance.ready) {
                if (!old)
                    self.messages.push(response);
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
                self.messages.push(response);
                if (gameInstance.ready && self.messages.length > 0)
                    for (var i = 0; i < self.messages.length; i++) {
                        self.handle(self.messages[i], true);
                    }
                self.messages = [];
                clearInterval(self.queueTimer);
                self.queueTimer = null;
            } else {
                console.log(msg);
                if (response.type == "user") {
                    if (msg.sessionId != "") {
                        GameData.userName = msg.user.nick;
                        GameData.gameBalance = msg.balance;
                        gameInstance.updateMoneyInfo();
                        gameInstance.updateNick();
                        /*  if (msg.user.isPlayingForFun && self.showCashier) {
                            self.showCashier(false);
                        }
                        if ($.client.UserData.Features && $.client.UserData.Features.provably_fair) {
                            self.buttons.provably.inputEnabled = true;
                            self.buttons.provably.alpha = 1;
                            self.buttons.provably.text.alpha = 1;
                        } else {
                            self.buttons.provably.inputEnabled = false;
                            self.buttons.provably.alpha = 0;
                            self.buttons.provably.text.alpha = 0;
                        }*/
                    }
                } else if (response.type == "balance") {
                    GameData.gameBalance = msg.balance;
                    gameInstance.updateMoneyInfo();
                    gameInstance.updateNick();
                } else if (response.type == "game_data") {
                       gameInstance.updateGameData(msg);
                } else if (response.type == "refresh_user_data") {
                    GameData.userName = msg.user.nick;
                    GameData.gameBalance = msg.user.balance;
                    gameInstance.updateMoneyInfo();
                    gameInstance.updateNick();
                    GameData.userName = GameData.userName ? GameData.userName.toUpperCase().length < 25 ? GameData.userName.toUpperCase() : GameData.userName.toUpperCase().substr(0, 25) + '...' : "";
                    gameInstance.labels.userName.setText(GameData.userName);
                } else if (response.type == "status") {
                    gameInstance.showHandState(msg);
                } else if (response.type == "lose") {
                    GameData.gameBalance = msg.balance;
                    gameInstance.updateMoneyInfo();
                } else if (response.type == "push") {
                    GameData.gameBalance = msg.balance;
                    gameInstance.updateMoneyInfo();
                } else if (response.type == "error") {
                    if (response.message) {
                        text = $.client.getLocalizedString(response.message, true).toUpperCase();
                        gameInstance.updateMoneyInfo(text);
                    }
                }

            }
        }
    };