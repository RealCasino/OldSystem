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
    isSetWinNum: false,
    isTableOpen: false,
    gameStatus: "",
    winAmount: 0,
    gameMode: false,
    timer:null,
    betHistory:[],
    videoCallBack: null,
    handle: function (msg) {
        var text, status, winNumber, videoTimeout;
        var gameInstance = game.state.states.MainMenu;
        var self = this;
        if (!gameInstance.ready) {
            setTimeout(function() {
                self.handle(msg);
            }, 300);
        } else {
        if (msg.type == "status") {
            status = msg.message.status;
            this.gameStatus = status;
            if (status == GAMESTATE_CODE_TABLE_OPENED) {
                this.isSetWinNum = false;
                this.isTableOpen = true;
                this.winAmount = 0;
                gameInstance.resetTable();
                text = '';
                text += $.client.getLocalizedString("Place your bets", true).toUpperCase();
                gameInstance.changeStatus(text, 0);
            }
            else if (status == GAMESTATE_CODE_WINNING_NUMBER) {
                winNumber = parseInt(msg.message.win_number);
                text = $.client.getLocalizedString("Result", true, { number: winNumber }).toUpperCase();
                self.isSetWinNum = true;
                self.winNumArr.push(winNumber);
                if (self.winNumArr.length > 9) {
                    self.winNumArr.shift();
                }
                gameInstance.changeStatus(text, 0);
                if (self.betHistory.length > 6) {
                    self.betHistory.shift();
                }
                self.videoCallBack = null;
                if (gameInstance.showWinNumber)
                    gameInstance.showWinNumber(winNumber);
                if (gameInstance.removeLossesBet)
                    gameInstance.removeLossesBet(winNumber);
        
            }
            else if (status == GAMESTATE_CODE_TABLE_CLOSED) {
                this.isTableOpen = false;
                this.isSetWinNum = false;
                text = $.client.getLocalizedString("Table closed", true).toUpperCase();
                winNumber = parseInt(msg.message.win_number);
                gameInstance.changeStatus(text, 2);
           } else if (status == GAMESTATE_CODE_ROUND_CANCELED) {
                text = $.client.getLocalizedString("Round canceled", true).toUpperCase();
                self.isSetWinNum = true;
                gameInstance.changeStatus(text, 0);
                self.videoCallBack = null;
                gameInstance.resetTable();
            }
        } else if (msg.type == "new_bets") {
            if (gameInstance.drawBetsChip)
                gameInstance.drawBetsChip(msg.message.bets);
        }
        else if (msg.type == "remove_bets") {
            if (gameInstance.clearBetsChip)
                gameInstance.clearBetsChip(msg.message.bets);
        }
            self.previousMsgType = msg.type;
    }
    }
};