
var GAMESTATE_CODE_TABLE_CLOSED = 0,
    GAMESTATE_CODE_TABLE_OPENED = 1,
    GAMESTATE_CODE_WINNING_NUMBER = 2,
    GAMESTATE_CODE_WINNING_SUM = 4,

    USER_BALANCE = 0;
TOTAL_LOST = 0;

var stakeStatus = {
    PENDING: 0,
    ACCEPTED: 1,
    REJECTED: 2,
    COMPLETED: 3,
    CANCELED: 4
};

var betAmount = 1,
    table,
    summaDeb = 0,
    playCount = 1,
    tableStatus,
    infoText,
    timerText;

var timerSprite = {}, timerObj;
var betHistory = [];
var betNumbers = [];
var matchNumbers = [];

var winNumInfo = {}, msgBoxPopup, msgBoxTween, limitPopup, limitPopupTween, statPopup, settingsGroup, statPopupTween, selectedLimits = [];
var cellName, betName, borderPosArr;

var userNumbers = [];
var limits = [];
var historyArr = [];
var previousBetChips = [];
var roundBetChips = [];
var confirmedAmount = 0;
var factorGroups = [];
var limitBtnText, confirmLimitBtn, cashierBtn, provablyBtn;
var tableCell = {};

var userNameText, USER_NAME, headerBetInputVal,headerTotalBetVal, headerBalansInputVal, headerWinInputVal, statusLbl, videoWinInputVal, videoBetInputVal, maxPayValLabel;
var gameFrame, numberLbl, numberFrame, winNum, placeHold, timer;
var _winNumUpdate, progressText, _videoFlagShow, isModalShow, isSubmiting, gameIdValLabel, tickerLbl, ticker2Lbl;

var worldGroup = {},
    gameGroup = {},
    videoGroup = {},
    tableGroup = {},
    payoutGroup = {},
    ticketGroup = {},
    buttonGroup = {},
    selectedChipsGroup = {},
    frameGroup = {},
    footerGroup = {},
    winTextGroup = {},
    timerGroup = {},
    numberGroup = {},
    numbersListGroup = {},
    cursorGroup = {},
    numbersGroup = {},
    vTicketsGroup = {},
    factorsGroup = {},
    statDataGroup,
    startGameBtn,
    settingsBtn;
var tableCell = {}, numberLbls = {}, KinoLandscapeGame = {};
var previousMsgType, winAmount = 0;
var chipCursor, cursorVisible = false, timeToEnd, lastChangeStatus, vFrame;
var playBtn, clearBtn,cancelBtn, undoBtn, stepDownBtn, stepUpBtn, quickBtn, gameEnd;
KinoLandscapeGame.Boot = function(game) {
};

KinoLandscapeGame.Boot.prototype = {
    init: function() {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;
        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.scale.setUserScale(SCALE, SCALE);
        this.scale.refresh();

    },
    preload: function() {
    },

    create: function() {
        this.state.start("Preloader");
    },
};

KinoLandscapeGame.Preloader = function(game) {

    this.background = null;
    this.ready = false;
};

KinoLandscapeGame.Preloader.prototype = {
    preload: function() {
        this.game.stage.backgroundColor = "#fff";

        this.load.image("cardBg", "images/card_bg.png");
        this.load.image("cardBg", "images/card_bg.png");
        this.load.image("homeIco", "images/home_ico.png");
        this.load.image("gameFrame", "images/game_frame.png");
        this.load.image("logo", "images/logo.png");
        this.load.image("secondFrame", "images/secondFrame.png");
        this.load.image("settingsPanel", "images/settingsPanel.png");
        this.load.image("videoFrame", "images/videoFrame.png");
        this.load.image("settingsBox", "images/settingsPopup.png");
        this.load.image("scrollBg", "images/scrollBg.png");
        this.load.image("ticket", "images/ticket.png");
        this.load.spritesheet("defaultBtn", "images/defaultBtn.png", 88, 75);
        this.load.spritesheet("settingsBtn", "images/settingsBtn.png", 88, 75);
        this.load.spritesheet("homeBtn", "images/homeBtn.png", 88, 75);
        this.load.spritesheet("cashierBtn", "images/cashierBtn.png", 88, 75);
        this.load.spritesheet("clearBtn", "images/clear_btn.png", 157, 75);
        this.load.spritesheet("gameBtn", "images/game_btn.png", 307, 61);
        this.load.spritesheet("gameFiveBtn", "images/game_five_btn.png", 270, 75);
        this.load.spritesheet("minusBtn", "images/minus_btn.png", 55, 55);
        this.load.spritesheet("plusBtn", "images/plus_btn.png", 55, 55);
        this.load.spritesheet("numbers", "images/numbers.png", 83, 83);
        this.load.spritesheet("playBtn", "images/play_btn.png", 276, 142);
        this.load.spritesheet("undoBtn", "images/undo_btn.png", 157, 75);
        this.load.spritesheet('muteIco', 'images/mute_ico.png', 75, 69);
        this.load.spritesheet('tickets', 'images/tickets.png', 485, 55);
        this.game.load.onFileComplete.add(this.updateProgressBar, this);
    },

    create: function() {
        var self = this;
        worldGroup = this.add.group();
        tableGroup = this.add.group();
        chipsGroup = this.add.group();
        buttonGroup = this.add.group();
        winTextGroup = this.add.group();
        selectedChipsGroup = this.add.group();

        frameGroup = this.add.group();
        footerGroup = this.add.group();

        worldGroup.add(tableGroup);
        tableGroup.add(chipsGroup);

        worldGroup.add(buttonGroup);
        footerGroup.add(winTextGroup);
        buttonGroup.add(frameGroup);
        buttonGroup.add(footerGroup);

        function startGame() {
            if ($.client.UserData) {
                self.state.start("Game");
            } else {
                setTimeout(function() {
                    startGame();
                }, 200);
            }
        }

        startGame();
    },

    updateProgressBar: function(progress) {
        var pr;

        if (progressText != undefined) {
            progressText.destroy();
        }
        $.client.setProgressBarPercent(progress);
        pr = progress + "%";
        progressText = this.add.text(this.game.world.centerX, this.game.world.centerY, pr, {
            font: "60px Arial",
            fill: "#ffffff"
        });
    }
};

KinoLandscapeGame.Game = function(game) {
    this.bitItems;
    this._statData;
    this.game; //  a reference to the currently running game
    this.add; //  used to add sprites, text, groups, etc
    this.camera; //  a reference to the game camera
    this.cache; //  the game cache
    this.input; //  the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load; //  for preloading assets
    this.math; //  lots of useful common math operations
    this.sound; //  the sound manager - add a sound, play one, set-up markers, etc
    this.stage; //  the game stage
    this.time; //  the clock
    this.tweens; //  the tween manager
    this.world; //  the game world
    this.particles; //  the particle manager
    this.physics; //  the physics manager
    this.rnd; //  the repeatable random number generator
};

KinoLandscapeGame.Game.prototype = {
    update: function() {
        if (tickerLbl) {
            if (gameFrame.width - 1300 - tickerLbl.width < tickerLbl.position.x) {
                tickerLbl.position.x = tickerLbl.position.x - 1;
            } else {
                tickerLbl.position.x = gameFrame.width;
            }
        }
        if (ticker2Lbl) {
            if (gameFrame.width - 600 - ticker2Lbl.width < ticker2Lbl.position.x) {
                ticker2Lbl.position.x = ticker2Lbl.position.x - 1;
            } else {
                ticker2Lbl.position.x = gameFrame.width;
            }
        }
    },
    create: function() {
        var self = this;
        var balansLabel, winLabel, winLabelV, betLabelV;
        worldGroup = this.add.group();
        cursorGroup = this.add.group();
        this.scale.setUserScale(SCALE, SCALE);
        this.scale.refresh();
        tableGroup = this.add.group();
        chipsGroup = this.add.group();
        selectedChipsGroup = this.add.group();

        frameGroup = this.add.group();
        footerGroup = this.add.group();
        payoutGroup = this.add.group();
        ticketGroup = this.add.group();
        factorsGroup = this.add.group();
        gameGroup = this.add.group();
        videoGroup = this.add.group();
        numbersGroup = this.add.group();
        vTicketsGroup = this.add.group();

        settingsGroup = this.add.group();
        numberGroup = this.add.group();
        timerGroup = this.add.group();

        footerGroup.add(winTextGroup);

        worldGroup.add(videoGroup);
        worldGroup.add(gameGroup);
        gameGroup.add(frameGroup);
        gameGroup.add(tableGroup);
        gameGroup.add(numberGroup);
        gameGroup.add(buttonGroup);
        gameGroup.add(payoutGroup);
        gameGroup.add(ticketGroup);
        gameGroup.add(footerGroup);
        gameGroup.add(settingsGroup);
        gameFrame = this.add.sprite(0, 0, "gameFrame");
        frameGroup.add(gameFrame);
        vFrame = this.add.sprite(10, 170, "videoFrame");
        gameGroup.add(vFrame);
        vFrame.inputEnabled = true;
        vFrame.useHandCursor = true;
        vFrame.events.onInputDown.add(function () {            
            if ($("#landscape_video").hasClass("video-fullscreen")) {
                $("#landscape_video").removeClass("video-fullscreen");
            } else {
                $("#landscape_video").addClass("video-fullscreen");
            }
        }, this);
        var logo = this.add.sprite(140, 15, "logo");
        logo.scale.set(0.7);
        gameGroup.add(logo);

        var name = USER_NAME ? USER_NAME.length < 13 ? USER_NAME : USER_NAME.substr(0, 13) + "..." : "";
        userNameText = this.add.text(650, gameFrame.height - 50, name, {
            font: "bold 32px GothamProBold",
            fill: "#0086cb"
        });
        gameGroup.add(userNameText);
        gameGroup.add(createTextLbl(self, {
            text: $.client.getLocalizedString("Tickets", true),
            x: 310,
            y: 555,
            font: "GothamProBold",
            size: 28,
            style: "bold",
            color: "#87d6fe",
            centered: true,
            wordWrapWidth: 120,
            maxHeight: 40,
            maxWidth: 120
        }));
        gameGroup.add(createTextLbl(self, {
            text: $.client.getLocalizedString("Hits", true),
            x: gameFrame.width - 255,
            y: gameFrame.height - 948,
            font: "GothamProBold",
            size: 34,
            color: "#fff",
            style: "bold",
            centered: true,
            wordWrapWidth: 120,
            maxHeight: 40,
            maxWidth: 120
        }));
        gameGroup.add(createTextLbl(self, {
            text: $.client.getLocalizedString("Pays", true),
            x: gameFrame.width - 125,
            y: gameFrame.height - 948,
            font: "GothamProBold",
            size: 34,
            style: "bold",
            color: "#fff",
            centered: true,
            wordWrapWidth: 120,
            maxHeight: 40,
            maxWidth: 120
        }));
        balansLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("Balance", true),
            x: gameFrame.width - 268,
            y: gameFrame.height - 427,
            font: "GothamProBold",
            size: 24,
            color: "#fff",
            centered: true,
            wordWrapWidth: 70,
            maxHeight: 30,
            maxWidth: 95
        });
        footerGroup.add(balansLabel);

        headerBalansInputVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + USER_BALANCE,
            x: gameFrame.width - 133,
            y: gameFrame.height - 433,
            font: "ProximaNova",
            size: 33,
            color: "#fff",
            style: "bold",
            centered: true,
            maxHeight: 30,
            maxWidth: 155
        });

        footerGroup.add(headerBalansInputVal);
        headerBetInputVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + betAmount,
            x: gameFrame.width - 183,
            y: gameFrame.height - 221,
            font: "ProximaNova",
            size: 32,
            color: "#fff",
            style: "bold",
            centered: true,
            maxHeight: 50,
            maxWidth: 150
        });
        footerGroup.add(headerBetInputVal);
        winLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("Win", true),
            x: gameFrame.width - 300,
            y: gameFrame.height - 353,
            font: "GothamProBold",
            size: 24,
            color: "#fff",
            centered: false,
            wordWrapWidth: 70,
            maxHeight: 30,
            maxWidth: 95
        });
        footerGroup.add(winLabel);
        headerWinInputVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + "0",
            x: gameFrame.width - 135,
            y: gameFrame.height - 359,
            font: "ProximaNova",
            size: 33,
            color: "#fff",
            style: "bold",
            centered: true,
            maxHeight: 30,
            maxWidth: 155
        });
        footerGroup.add(headerWinInputVal);
        var tBetLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("Bet", true),
            x: gameFrame.width - 300,
            y: gameFrame.height - 283,
            font: "GothamProBold",
            size: 24,
            color: "#fff",
            centered: false,
            wordWrapWidth: 70,
            maxHeight: 30,
            maxWidth: 95
        });
        footerGroup.add(tBetLabel);
        headerTotalBetVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + "0",
            x: gameFrame.width - 135,
            y: gameFrame.height - 287,
            font: "ProximaNova",
            size: 33,
            color: "#fff",
            style: "bold",
            centered: true,
            maxHeight: 30,
            maxWidth: 155
        });
        footerGroup.add(headerTotalBetVal);
        quickBtn = createTextButton(self, {
            text: $.client.getLocalizedString("Quick play", true).toUpperCase(),
            x: gameFrame.width - 1250,
            y: gameFrame.height - 145,
            font: "GothamProBold",
            size: 38,
            maxHeight: 40,
            maxWidth: 280,
            color: "#fff",
            disabledColor: "#808080",
            style: "bold",
            centered: true,
            paddingTop: -9,
            sprite: "gameBtn",
            defaultIndex: 0,
            overIndex: 0,
            clickIndex: 1,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: 2,
            onClick: function() {
                self.clearAll();
                var numbers = [];
                for (var i = 1; i <= 80; i++) {
                    numbers.push(i);
                }
                for (var j = 0; j < game.config.MaxNumbersCount; j++) {
                    var id = parseInt(Math.random() * (numbers.length-1) + 1);
                    betNumbers.push(numbers.splice(id, 1).pop());
                    self.redrawTable(betNumbers);
                }
                self.redrawButtons();
                self.showPayTable(0, betNumbers, betAmount);
            }
        });
        buttonGroup.add(quickBtn);

        undoBtn = createTextButton(self, {
            text: $.client.getLocalizedString("Undo", true),
            x: gameFrame.width - 690,
            y: gameFrame.height - 155,
            font: "GothamProBold",
            size: 32,
            maxHeight: 38,
            maxWidth: 120,
            color: "#fff",
            disabledColor: "#808080",
            style: "bold",
            centered: true,
            paddingTop: -10,
            sprite: "undoBtn",
            defaultIndex: 0,
            overIndex: 0,
            clickIndex: 1,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: 2,
            onClick: function() {
                self.clearLast();
            }
        });
        undoBtn.disable();
        buttonGroup.add(undoBtn);
        clearBtn = createTextButton(self, {
            text: $.client.getLocalizedString("Clear", true),
            x: gameFrame.width - 530,
            y: gameFrame.height - 155,
            font: "GothamProBold",
            size: 32,
            maxHeight: 38,
            maxWidth: 120,
            color: "#fff",
            disabledColor: "#808080",
            style: "bold",
            centered: true,
            paddingTop: -10,
            sprite: "clearBtn",
            defaultIndex: 0,
            overIndex: 0,
            clickIndex: 1,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: 2,
            onClick: function() {
                self.clearAll();
            }
        });
        clearBtn.disable();
        buttonGroup.add(clearBtn);
        cancelBtn = createTextButton(self, {
            text: $.client.getLocalizedString("Cancel", true),
            x: gameFrame.width - 890,
            y: gameFrame.height - 155,
            font: "GothamProBold",
            size: 32,
            maxHeight: 38,
            maxWidth: 120,
            color: "#fff",
            disabledColor: "#808080",
            style: "bold",
            centered: true,
            paddingTop: -10,
            sprite: "clearBtn",
            defaultIndex: 0,
            overIndex: 0,
            clickIndex: 1,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: 2,
            onClick: function () {
                self.cancelBet();
            }
        });
        cancelBtn.disable();
        buttonGroup.add(cancelBtn);
        playBtn = createTextButton(self, {
            text: $.client.getLocalizedString("Confirm", true).toUpperCase(),
            x: gameFrame.width - 320,
            y: gameFrame.height - 160,
            font: "GothamProBold",
            size: 50,
            maxHeight: 50,
            maxWidth: 210,
            color: "#fff",
            disabledColor: "#808080",
            style: "bold",
            centered: true,
            paddingTop: -15,
            paddingLeft: -5,
            sprite: "playBtn",
            defaultIndex: 0,
            overIndex: 0,
            clickIndex: 1,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: 2,
            onClick: function() {
                if (betNumbers.length > 0) {
                    self.startGame(1);
                } else {
                    MessageDispatcher.isTableLocked = false;
                    betNumbers = [];
                    playBtn.text.setTitle($.client.getLocalizedString("Confirm", true).toUpperCase());
                    for (var j = 0; j < MessageDispatcher.bets.length; j++) {
                        MessageDispatcher.bets[j].selected = false;
                    }
                    self.redrawTable(betNumbers);
                    self.showTickets();
                }
                self.redrawButtons(false);
            }
        });
        playBtn.disable();
        buttonGroup.add(playBtn);
        stepDownBtn = createTextButton(self, {
            text: "",
            x: gameFrame.width - 327,
            y: gameFrame.height - 232,
            font: "GothamProBold",
            size: 50,
            maxHeight: 50,
            maxWidth: 50,
            sprite: "minusBtn",
            defaultIndex: 0,
            overIndex: 0,
            clickIndex: 1,
            disabledIndex: 2,
            useHandCursor: true,
            onClick: function () {
                if (parseFloat(game.config.MinBet.replace(",", ".")) <= parseFloat(betAmount - game.config.BetStep).toFixed(2)) {
                    betAmount -= game.config.BetStep;
                    var bVal = betAmount % 1 == 0 ? betAmount : parseFloat(betAmount).toFixed(2);
                    headerBetInputVal.setTitle($.client.UserData.CurrencySign + bVal);
                    self.showPayTable(0, betNumbers, betAmount);
                    self.updateTickersText();
                }
            }
        });
        buttonGroup.add(stepDownBtn);
        stepUpBtn = createTextButton(self, {
            text: "",
            x: gameFrame.width - 105,
            y: gameFrame.height - 232,
            font: "GothamProBold",
            size: 50,
            maxHeight: 50,
            maxWidth: 50,
            sprite: "plusBtn",
            defaultIndex: 0,
            overIndex: 0,
            clickIndex: 1,
            disabledIndex: 2,
            useHandCursor: true,
            onClick: function() {
                if (parseFloat(game.config.MaxBet.replace(",", ".")) >= parseFloat(betAmount + game.config.BetStep).toFixed(2)) {
                    betAmount += game.config.BetStep;
                    var bVal = betAmount % 1 == 0 ? betAmount : parseFloat(betAmount).toFixed(2);
                    headerBetInputVal.setTitle($.client.UserData.CurrencySign + bVal);
                    self.showPayTable(0, betNumbers, betAmount);
                    self.updateTickersText();
                }
            }
        });
        buttonGroup.add(stepUpBtn);
        var homeBtn = createTextButton(self, {
            text: "",
            x: 10,
            y: gameFrame.height - 80,
            font: "GothamProBold",
            size: 50,
            maxHeight: 50,
            maxWidth: 50,
            sprite: "homeBtn",
            defaultIndex: 0,
            overIndex: 0,
            clickIndex: 1,
            disabledIndex: 2,
            useHandCursor: true,
            onClick: function () {
                 $.client.toHome();
            }
        });
        footerGroup.add(homeBtn);
        cashierBtn = createTextButton(self, {
            text: "",
            x: 108,
            y: gameFrame.height - 80,
            font: "GothamProBold",
            size: 50,
            maxHeight: 50,
            maxWidth: 50,
            sprite: "cashierBtn",
            defaultIndex: 0,
            overIndex: 0,
            clickIndex: 1,
            disabledIndex: 2,
            useHandCursor: true,
            onClick: function () {
            }
        });
        footerGroup.add(cashierBtn);
        cashierBtn.disable();
        var settingsBtn = createTextButton(self, {
            text: "",
            x: 206,
            y: gameFrame.height - 80,
            font: "GothamProBold",
            size: 50,
            maxHeight: 50,
            maxWidth: 50,
            sprite: "settingsBtn",
            defaultIndex: 0,
            overIndex: 0,
            clickIndex: 1,
            disabledIndex: 2,
            useHandCursor: true,
            onClick: function () {
                if (settingsBtn.show) {
                    settingsBtn.show = false;
                    self.showSettings(false);
                    settingsBtn.btn.loadTexture("settingsBtn", 0);
                } else {
                    settingsBtn.show = true;
                    self.showSettings(true);
                    settingsBtn.btn.loadTexture("settingsBtn", 1);
                }
            }
        });
        footerGroup.add(settingsBtn);

        var card1 = this.add.sprite(673, 115, "cardBg");
        tableGroup.add(card1);
        var card2 = this.add.sprite(673, 545, "cardBg");
        tableGroup.add(card2);
        var number = 1;
        for (var j = 0; j < 8; j++) {
            for (var i = 0; i < 10; i++) {

                cellName = number.toString();
                tableCell[cellName] = tableGroup.create(card1.x + 8 + i * 88.9, j > 3 ? card2.y + 8 + (j - 4) * 89.5 : card1.y + 7 + j * 90, "numbers", 0);
                tableCell[cellName].name = cellName;

                tableCell[cellName].number = number;
                tableCell[cellName].inputEnabled = true;
                tableCell[cellName].clicked = true;
                tableCell[cellName].input.useHandCursor = true;
                tableCell[cellName].alpha = 0;
                tableCell[cellName].width = 80;
                tableCell[cellName].height = 80;
                tableGroup.add(tableCell[cellName]);
                var numLbl = createTextLbl(self, {
                    text: number.toString(),
                    x: tableCell[cellName].x + tableCell[cellName].width / 2,
                    y: tableCell[cellName].y + 15,
                    font: "GothamProBold",
                    size: 40,
                    color: "#fff",
                    style: "bold",
                    centered: true,
                    maxHeight: 55,
                    maxWidth: tableCell[cellName].width - 10
                });
                tableGroup.add(numLbl);
                tableCell[cellName].events.onInputOver.add(this.cellOver, this);
                tableCell[cellName].events.onInputOut.add(this.cellOut, this);
                tableCell[cellName].events.onInputDown.add(this.cellClick, this);
                number++;
            }
        }        
        timerGroup.DrawLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("Draw start", true),
            x: gameFrame.width - 180,
            y: gameFrame.height - 540,
            font: "GothamProBold",
            size: 22,
            color: "#fff",
            centered: true,
            maxHeight: 40,
            maxWidth: 120
        });
        timerGroup.TimeLabel = createTextLbl(self, {
            text: "--:--",
            x: gameFrame.width - 180,
            y: gameFrame.height - 515,
            style: "bold",
            font: "GothamProBold",
            size: 48,
            color: "#fff",
            centered: true,
            maxHeight: 48,
            maxWidth: 150
        });
        timerGroup.add(timerGroup.DrawLabel);
        timerGroup.add(timerGroup.TimeLabel);
        gameGroup.add(timerGroup);
        timerGroup.alpha = 0;
        tickerLbl = createTextLbl(self, {
            text: "",
            x: gameFrame.width - 1020,
            y: 47,
            font: "GothamProBold",
            size: 32,
            color: "#4fa3cf",
            centered: false,
            wordWrapWidth: false,
            maxHeight: 40,
            maxWidth: 10000
        });
        gameGroup.add(tickerLbl);
        var mask = game.add.graphics(gameFrame.width - 1240, 35);
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, 1180 , 60);
        mask.lineStyle(0);
        mask.endFill();
        tickerLbl.mask = mask;
        gameGroup.add(mask);
        infoText = createTextLbl(self, {
            text: $.client.getLocalizedString("Wait for a new draw", true),
            x: 1130,
            y: 493,
            font: "GothamProBold",
            size: 32,
            color: "#87d6fe",
            centered: true,
            wordWrapWidth: false,
            maxHeight: 40,
            maxWidth: 10000
        });
        gameGroup.add(infoText);
        var gameIdLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("Draw Id", true),
            x: gameFrame.width - 960,
            y: gameFrame.height - 50,
            font: "GothamProBold",
            size: 32,
            color: "#0086cb",
            centered: false,
            wordWrapWidth: false,
            maxHeight: 40,
            maxWidth: 150
        });
        gameIdValLabel = createTextLbl(self, {
            text: MessageDispatcher.gameId,
            x: gameFrame.width - 820,
            y: gameFrame.height - 50,
            style: "bold",
            font: "GothamProBold",
            size: 32,
            color: "#0086cb",
            centered: false,
            wordWrapWidth: false,
            maxHeight: 40,
            maxWidth: 150
        });
        gameGroup.add(gameIdLabel);
        gameGroup.add(gameIdValLabel);
        var dateTimeLabel2 = createTextLbl(self, {
            text: $.DateFormat(MessageDispatcher.serverTime.toString(), "HH:mm  dd/MM/yyyy"),
            x: gameFrame.width - 650,
            y: gameFrame.height - 50,
            style: "bold",
            font: "GothamProBold",
            size: 32,
            color: "#0086cb",
            centered: false,
            align: "left",
            maxHeight: 40,
            wordWrapWidth: false,
            maxWidth: 350
        });
        gameGroup.add(dateTimeLabel2);

        if (self.timeInterval)
            clearInterval(self.timeInterval);
        self.timeInterval = setInterval(function() {
            gameIdValLabel.setTitle(MessageDispatcher.gameId);
            videoIdValLabel.setTitle(MessageDispatcher.gameId);
            MessageDispatcher.serverTime.setSeconds(MessageDispatcher.serverTime.getSeconds() + 1);
            dateTimeLabel2.setText($.DateFormat(MessageDispatcher.serverTime.toString(), "HH:mm  dd/MM/yyyy"));
        }, 1000);
       
        var mask = game.add.graphics(30, 600);
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, 590, 350);
        mask.lineStyle(0);
        mask.endFill();
        ticketGroup.mask = mask;
        gameGroup.add(mask);
        var ticketSscroll = this.add.sprite(30, 600, 'scrollBg');
        ticketSscroll.width = 590;
        ticketSscroll.heigth = 350;
        gameGroup.add(ticketSscroll);
        ticketSscroll.inputEnabled = false;
        this.gestures = new GESTURE(this.game);
        var verTimeout, downTimeout;
        this.gestures.addOnSwipe(function (context, data) {
            var tween;
            if (MessageDispatcher.bets.length > 5) {
                if (data.direction == "up" && data.distance > 0) {
                    game.add.tween(ticketGroup).to({ x: ticketGroup.x, y: ticketGroup.y - data.distance }, 10, Phaser.Easing.Linear.None, true, 0, 0, false);

                } else if (data.direction == "down" && data.distance > 0) {
                    game.add.tween(ticketGroup).to({ x: ticketGroup.x, y: ticketGroup.y + data.distance }, 10, Phaser.Easing.Linear.None, true, 0, 0, false);
                }
                clearTimeout(verTimeout);
                if (ticketGroup.y > 0) {
                    verTimeout = setTimeout(function () {
                        tween = game.add.tween(ticketGroup).to({ x: ticketGroup.x, y: 0 }, 50, Phaser.Easing.Linear.None, true, 0, 0, false);
                    }, 100);
                }
                clearTimeout(downTimeout);
                if (ticketGroup.height + 50 < (350 - ticketGroup.y)) {
                    console.log(ticketGroup.height)
                    console.log(ticketGroup.y)
                    downTimeout = setTimeout(function () {
                        tween = game.add.tween(ticketGroup).to({ x: ticketGroup.x, y: (350 - ticketGroup.height) }, 50, Phaser.Easing.Linear.None, true, 0, 0, false);
                    }, 100);
                }
            }
        }, ticketSscroll);

        /**VIDEO GROUP*/
        var vTicketsLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("Tickets", true),
            x: 120,
            y: 12,
            font: "GothamProBold",
            size: 28,
            color: "#fff",
            centered: true,
            wordWrapWidth: false,
            maxHeight: 40,
            maxWidth: 200
        });

        var mute = $.client.getMuteState() ? 1 : 0;
        videoGroup.muteBtn = this.add.sprite(280, 20, 'muteIco', mute);
        videoGroup.muteBtn.inputEnabled = true;
        videoGroup.muteBtn.input.useHandCursor = true;
        videoGroup.muteBtn.events.onInputDown.add(function () {
            if (!$.client.getMuteState()) {
                videoGroup.muteBtn.loadTexture('muteIco', 1);
                game.sound.mute = true;
                $.client.enableSound(false);
            } else {
                videoGroup.muteBtn.loadTexture('muteIco', 0);
                game.sound.mute = false;
                $.client.enableSound(true);
            }
        }, this);
        // muteBtn.scale.set(0.8);
         videoGroup.add(videoGroup.muteBtn);
        videoGroup.muteBtn.visible = false;

        var secondFrame = this.add.sprite(0, 0, "secondFrame");
        videoGroup.add(secondFrame);
        videoGroup.add(vTicketsLabel);
        var videoIdLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("Draw Id", true),
            x: 120,
            y: gameFrame.height - 100,
            font: "GothamProBold",
            size: 24,
            color: "#fff",
            centered: true,
            wordWrapWidth: false,
            maxHeight: 40,
            maxWidth: 200
        });
        var videoIdValLabel = createTextLbl(self, {
            text: MessageDispatcher.gameId,
            x: 120,
            y: gameFrame.height - 70,
            style: "bold",
            font: "GothamProBold",
            size: 40,
            color: "#0086cb",
            centered: true,
            wordWrapWidth: false,
            maxHeight: 40,
            maxWidth: 200
        });
        videoGroup.add(videoIdLabel);
        videoGroup.add(videoIdValLabel);
        var numbersLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("Draw numbers", true),
            x: 250,
            y: gameFrame.height - 80,
            font: "GothamProBold",
            size: 24,
            color: "#fff",
            centered: false,
            wordWrapWidth: false,
            maxHeight: 40,
            maxWidth: 200
        });
        videoGroup.add(numbersLabel);
        videoGroup.add(numbersGroup);
        videoGroup.add(vTicketsGroup);
        


        var maxPayLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("Max payout", true),
            x: 1154,
            y: gameFrame.height - 100,
            font: "GothamProBold",
            size: 24,
            color: "#fff",
            centered: true,
            wordWrapWidth: false,
            maxHeight: 40,
            maxWidth: 200
        });
        videoGroup.add(maxPayLabel);
        maxPayValLabel = createTextLbl(self, {
            text: "",
            x: 1150,
            y: gameFrame.height - 70,
            style: "bold",
            font: "GothamProBold",
            size: 40,
            color: "#0086cb",
            centered: true,
            wordWrapWidth: false,
            maxHeight: 40,
            maxWidth: 200
        });
        videoGroup.add(maxPayValLabel);
        winLabelV = createTextLbl(self, {
            text: $.client.getLocalizedString("Win", true),
            x: gameFrame.width - 310,
            y: gameFrame.height - 105,
            font: "GothamProBold",
            size: 24,
            color: "#fff",
            centered: false,
            wordWrapWidth: 70,
            maxHeight: 30,
            maxWidth: 95
        });
        videoGroup.add(winLabelV);
        videoWinInputVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + "0",
            x: gameFrame.width - 140,
            y: gameFrame.height - 109,
            font: "ProximaNova",
            size: 33,
            color: "#fff",
            style: "bold",
            centered: true,
            maxHeight: 30,
            maxWidth: 155
        });
        videoGroup.add(videoWinInputVal);
        betLabelV = createTextLbl(self, {
            text: $.client.getLocalizedString("Bet", true),
            x: gameFrame.width - 625,
            y: gameFrame.height - 105,
            font: "GothamProBold",
            size: 24,
            color: "#fff",
            centered: false,
            wordWrapWidth: 70,
            maxHeight: 30,
            maxWidth: 95
        });
        videoGroup.add(betLabelV);
        videoBetInputVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + "0",
            x: gameFrame.width - 455,
            y: gameFrame.height - 109,
            font: "ProximaNova",
            size: 33,
            color: "#fff",
            style: "bold",
            centered: true,
            maxHeight: 30,
            maxWidth: 155
        });
        videoGroup.add(videoBetInputVal);
        ticker2Lbl = createTextLbl(self, {
            text: "",
            x: gameFrame.width - 600,
            y: gameFrame.height - 58,
            font: "GothamProBold",
            size: 32,
            color: "#4fa3cf",
            centered: false,
            wordWrapWidth: false,
            maxHeight: 40,
            maxWidth: 10000
        });
        videoGroup.add(ticker2Lbl);
        var mask2 = game.add.graphics(0, 60);
        mask2.beginFill(0xffffff);
        mask2.drawRect(0, 0, 230, 880);
        mask2.lineStyle(0);
        mask2.endFill();
        vTicketsGroup.mask = mask2;
        videoGroup.add(mask2);
        var ticketSscrolls = this.add.sprite(0, 60, 'scrollBg');
        ticketSscrolls.width = 230;
        ticketSscrolls.heigth = 880;
        videoGroup.add(ticketSscrolls);
        ticketSscrolls.inputEnabled = false;
        var verTimeout2, downTimeout2;
        this.gestures.addOnSwipe(function (context, data) {
            var tween;
            if (MessageDispatcher.bets.length > 7) {
                if (data.direction == "up" && data.distance > 0) {
                    game.add.tween(vTicketsGroup).to({ x: vTicketsGroup.x, y: vTicketsGroup.y - data.distance }, 10, Phaser.Easing.Linear.None, true, 0, 0, false);

                } else if (data.direction == "down" && data.distance > 0) {
                    game.add.tween(vTicketsGroup).to({ x: vTicketsGroup.x, y: vTicketsGroup.y + data.distance }, 10, Phaser.Easing.Linear.None, true, 0, 0, false);
                }
                clearTimeout(verTimeout2);
                if (vTicketsGroup.y > 0) {
                    verTimeout2 = setTimeout(function () {
                        tween = game.add.tween(vTicketsGroup).to({ x: vTicketsGroup.x, y: 0 }, 50, Phaser.Easing.Linear.None, true, 0, 0, false);
                    }, 100);
                }
                clearTimeout(downTimeout2);
                if (vTicketsGroup.height + 50 < (870 - vTicketsGroup.y)) {
                    downTimeout2 = setTimeout(function () {
                        tween = game.add.tween(vTicketsGroup).to({ x: vTicketsGroup.x, y: (870 - vTicketsGroup.height) }, 50, Phaser.Easing.Linear.None, true, 0, 0, false);
                    }, 100);
                }
            }
        }, ticketSscrolls);
        var mask2 = game.add.graphics(gameFrame.width - 640, gameFrame.height - 60);
        mask2.beginFill(0xffffff);
        mask2.drawRect(0, 0, 610, 50);
        mask2.lineStyle(0);
        mask2.endFill();
        ticker2Lbl.mask = mask2;
        videoGroup.add(mask2);
        window.addEventListener("resize", function() {
            self.changeGameSize();
        });
        setInterval(function() {
            self.changeGameSize();
        }, 1000);
        self.changeGameSize();
        self.ready = true;


        /***///////
        self.showTickets();
    },
    updateTickersText: function () {
        var self = this;
        var textStr = "{0}       {1}       {2}";
        function formatLimitAmount(amount) {
            if (amount > 9999) {
                return kFormater(amount);
            } else {
                return amount % 1 == 0 ? parseFloat(amount).toFixed(0) : parseFloat(amount).toFixed(1);
            }
        }
        var minMaxText = $.client.getLocalizedString('Min and Max round bet', true, { min: formatLimitAmount(game.config.MinBet), max: formatLimitAmount(game.config.MaxBet), sign: $.client.UserData.CurrencySign });
        var wRates = $(game.config.WinRates).last()[0];
        var maxPayout = game.config.MaxBet * $(wRates.Rates).last()[0];
        var maxPayoutText = $.client.getLocalizedString('Max payout value', true, { sign: $.client.UserData.CurrencySign, amount: formatLimitAmount(maxPayout) });

        var lastResultText="";
        var rHistory = MessageDispatcher.winNumArr;
        for (var i = 0; i < rHistory.length; i++) {
            if (rHistory[i].numbers) {
                lastResultText += $.client.getLocalizedString('Draw id and numbers', true, { id: rHistory[i].gameId, numbers: rHistory[i].numbers.join("-") });
                if (i != rHistory.length - 1)
                    lastResultText += "         |         ";
            }
        }
        textStr = textStr.format(minMaxText, maxPayoutText, lastResultText);
        tickerLbl.setTitle(textStr);
        ticker2Lbl.setTitle(textStr);
    },
    changeStatus: function (text, timeout) {
        var tDiff = new Date(new Date().getTime() - lastChangeStatus).getTime() / 1000;
        var self = this;
        if (timeout > 0) {
            if (self.previousState)
                self.stateTimeout = setTimeout(function () {
                    self.changeStatus(self.previousState.text);
                }, timeout);
        } else {
            if (self.stateTimeout)
                clearTimeout(self.stateTimeout);
            self.previousState = { text: text};
        }
        lastChangeStatus = new Date().getTime();
        if (infoText != undefined) {
            if (tDiff < 1) {
                if (self.newStateTimeout)
                    clearTimeout(self.newStateTimeout);
                self.newStateTimeout = setTimeout(function () {
                    self.changeStatus(text);
                }, 1000);
            } else {
                infoText.setTitle(text);
            }
        }
    },
    redrawBet: function(bet) {
        var self = this;
        betAmount = bet.amount;
        confirmedAmount += bet.amount;
        var bVal = betAmount % 1 == 0 ? betAmount : parseFloat(betAmount).toFixed(2);
        headerBetInputVal.setTitle($.client.UserData.CurrencySign + bVal);
        videoBetInputVal.setTitle($.client.UserData.CurrencySign + bVal);
        self.showPayTable(0, betNumbers, betAmount);
        self.updateTickersText();
        betNumbers = bet.numbers;
        self.betNumbers = betNumbers;
        headerTotalBetVal.setTitle($.client.UserData.CurrencySign + (confirmedAmount > 99999 ? kFormater(confirmedAmount) : parseFloat(confirmedAmount).toFixed(2)));
        for (var i = 0; i < bet.numbers.length; i++) {
            var number = bet.numbers[i];
            tableCell[number.toString()].loadTexture("numbers", 0);
            tableCell[number.toString()].alpha = 1;
        }
        this.showPayTable(matchNumbers.length, betNumbers, betAmount);
        self.changeStatus($.client.getLocalizedString("Bet confirmed!", true));
        self.redrawButtons(true);

    },
    showVideo: function (show) {
        var self = this;
        if (show) {
            if (!$("#landscape_video").hasClass("back-video")) {
                gameGroup.visible = false;
                videoGroup.visible = true;
                videoGroup.alpha = 0;
                var wRates = $(game.config.WinRates).last()[0];
                confirmedAmount = confirmedAmount % 1 == 0 ? confirmedAmount : parseFloat(confirmedAmount).toFixed(1);
                var maxPyaout = 0;
                var bets = MessageDispatcher.bets;               
                for (var j = 0; j < bets.length; j++) {
                    var payTable = [];
                    for (var i = 0; i < game.config.WinRates.length; i++) {
                        if (game.config.WinRates[i].Num == bets[j].numbers.length) {
                            payTable = game.config.WinRates[i].Rates;
                        }
                    }
                    if (payTable.length > 0) {
                        maxPyaout += bets[j].amount * payTable[payTable.length-1];
                    }
                }
                maxPayValLabel.setTitle($.client.UserData.CurrencySign + maxPyaout);

                videoBetInputVal.setTitle($.client.UserData.CurrencySign + confirmedAmount);
                self.showCurrentNumbers();
                var t = self.add.tween(videoGroup).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true, 0);
                t.onComplete.add(function() {
                    videoGroup.muteBtn.visible = true;
                }, this);
                $("#landscape_video").removeClass("video-fullscreen", 400);
                $("#landscape_video").addClass("video-fullscreen-scene", 400);
                $("#landscape_video").addClass("back-video", 400);
            }
        } else {
            var tween = self.add.tween(videoGroup).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 0);
            videoGroup.muteBtn.visible = false;
            tween.onComplete.add(function () {
                gameGroup.visible = true;
                videoGroup.visible = false;
                $("#landscape_video").removeClass("video-fullscreen", 300);
                $("#landscape_video").removeClass("video-fullscreen-scene", 400);
                $("#landscape_video").removeClass("back-video", 300);
            }, this);
        }
    },
    showCurrentNumbers: function () {
        var self = this;
        var idx = 0,idy=0;
            numbersGroup.removeAll();
            for (var i = 0; i < MessageDispatcher.numbers.length; i++) {
                if (i < 10) {
                    idx = i;
                } else {
                    idx = i - 10;
                    idy = 1;
                }
                var num = createTextLbl(self, {
                    text: MessageDispatcher.numbers[i].toString(),
                    x: 485 + idx * 55,
                    y: gameFrame.height - 103+idy*40,
                    font: "GothamProBold",
                    size: 33,
                    color: "#0086cb",
                    centered: true,
                    wordWrapWidth: false,
                    maxHeight: 40,
                    maxWidth: 40
                });
                numbersGroup.add(num);
            }
    },
    showSettings: function (show) {
        var self = this;
        settingsGroup.removeAll();
        vFrame.inputEnabled = true;
        if (show) {
            vFrame.inputEnabled = false;
            var settingsBg = this.add.sprite(16, 225, "settingsPanel");
            settingsBg.scale.set(0.98)
            settingsGroup.add(settingsBg);
            settingsBg.inputEnabled = true;
            settingsBg.input.priorityID = 0;
            var titleLbl = createTextLbl(self, {
                text: $.client.getLocalizedString("Settings", true),
                x: 50,
                y: 245,
                font: "GothamProBold",
                size: 24,
                color: "#fff",
                centered: false,
                wordWrapWidth: false,
                maxHeight: 30,
                maxWidth: 150
            });
            settingsGroup.add(titleLbl);
            var soundsLbl = createTextLbl(self, {
                text: $.client.getLocalizedString("Enable sound", true).toUpperCase(),
                x: 50,
                y: 300,
                font: "GothamProBold",
                size: 28,
                color: "#fff",
                centered: false,
                maxHeight: 45,
                maxWidth: 220
            });
            settingsGroup.add(soundsLbl);
            soundsLbl.inputEnabled = true;
            soundsLbl.input.useHandCursor = true;
            soundsLbl.events.onInputDown.add(function () {
                switchSound();
            }, this);
            var soundBtn = createTextButton(self, {
                text: $.client.getMuteState() ? $.client.getLocalizedString("off", true) : $.client.getLocalizedString("on", true),
                x: 300,
                y:279,
                font: "GothamProBold",
                color: "#fff",
                size: 28,
                paddingLeft: 26,
                paddingTop: 18,
                maxHeight: 50,
                maxWidth: 50,
                textClickYOffset: 7,
                sprite: "defaultBtn",
                defaultIndex: $.client.getMuteState() ? 2 : 0,
                overIndex: 0,
                clickIndex: 1,
                disabledIndex: 2,
                useHandCursor: true,
                onClick: function () {
                    switchSound();
                }
            });
            settingsGroup.add(soundBtn.btn);
            settingsGroup.add(soundBtn.text);
            settingsGroup.add(soundBtn);
            soundBtn.mute = $.client.getMuteState();
            function switchSound() {
                if (soundBtn.mute) {
                    soundBtn.btn.loadTexture('defaultBtn', 0);
                    soundBtn.mute = false;
                    soundBtn.text.setTitle($.client.getLocalizedString("on", true));
                    game.sound.mute = true;
                    $.client.enableSound(true);
                } else {
                    soundBtn.btn.loadTexture('defaultBtn', 2);
                    soundBtn.mute = true;
                    soundBtn.text.setTitle($.client.getLocalizedString("off", true));
                    game.sound.mute = false;
                    $.client.enableSound(false);
                }
            }
            var currentQuality;
            var currentStream;
            var qualitiesBox, qualityGroup,streamGroup;
            function showQuailitySelector() {
                if (!qualityGroup) {
                    qualityGroup = self.add.group();
                    qualitiesBox = self.add.sprite(300, 250, 'settingsBox');
                    qualitiesBox.height = 150;
                    qualitiesBox.width = 120;
                    qualityGroup.inputEnableChildren = true;
                    currentQuality.showTimeout = setTimeout(function () {
                        if (qualityGroup)
                            qualityGroup.removeAll();
                        qualityGroup = null;
                    }, 3000);
                    qualityGroup.onChildInputOver.add(function () {
                        clearTimeout(currentQuality.showTimeout);
                        currentQuality.showTimeout = setTimeout(function () {
                            if (qualityGroup)
                                qualityGroup.removeAll();
                            qualityGroup = null;
                        }, 2000);
                    }, this);

                    qualityGroup.add(qualitiesBox);
                    settingsGroup.add(qualityGroup);
                    qualitiesBox.alpha = 0;
                    var tween = game.add.tween(qualitiesBox).to({ x: 390 }, 200, Phaser.Easing.Linear.None, true);
                    setTimeout(function () {
                        game.add.tween(qualitiesBox).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
                    }, 100);
                    tween.onComplete.add(function () {
                       var qList = $.client.getVideoQualities();
                        var qualityId;
                        if (qList.length > 4) {
                            var offset = 35 * (qList.length - 4);
                            qualitiesBox.height += offset;
                            qualitiesBox.y = 250 - offset;
                        }
                        for (var i in qList) {
                            var color = "#909090";
                            qualityId = qList[i];
                            if (qualityId === $.client.getVideoQuality())
                                color = '#fff';
                             var quality = createTextLbl(self, {
                                text: $.client.getLocalizedString(qualityId, true).toUpperCase(),
                                x: 420,
                                y: qualitiesBox.y + 15 + i * 35,
                                font: "GothamProBold",
                                size: 22,
                                color: "#fff",
                                centered: false,
                                maxHeight: 30,
                                maxWidth: 100
                            });
                            qualityGroup.add(quality);
                            quality.inputEnabled = true;
                            quality.input.useHandCursor = true;
                            quality.input.priorityID = 3;
                            quality.id = qualityId;
                            quality.events.onInputDown.add(function (event) {
                                currentQuality.setTitle($.client.getLocalizedString(event.id, true).toUpperCase());
                                $.client.setVideoQuality(event.id);
                                qualityGroup.removeAll();
                                qualityGroup = null;
                            }, this);
                        }
                    }, this);
                } 
            };
            function showStreamSelector() {
                if (!streamGroup) {
                    streamGroup = self.add.group();
                    qualitiesBox = self.add.sprite(300, 360, 'settingsBox');
                    qualitiesBox.height = 150;
                    qualitiesBox.width = 120;
                    streamGroup.inputEnableChildren = true;
                    currentStream.showTimeout = setTimeout(function () {
                        if (streamGroup)
                            streamGroup.removeAll();
                        streamGroup = null;
                    }, 3000);
                    streamGroup.onChildInputOver.add(function () {
                        clearTimeout(currentStream.showTimeout);
                        currentStream.showTimeout = setTimeout(function () {
                            if (streamGroup)
                                streamGroup.removeAll();
                            streamGroup = null;
                        }, 2000);
                    }, this);


                    streamGroup.add(qualitiesBox);
                    settingsGroup.add(streamGroup);
                    qualitiesBox.alpha = 0;
                    var tween = game.add.tween(qualitiesBox).to({ x: 390 }, 200, Phaser.Easing.Linear.None, true);
                    setTimeout(function () {
                        game.add.tween(qualitiesBox).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
                    }, 100);
                    tween.onComplete.add(function () {
                        var qList = $.client.getVideoStreams();
                        var qualityId;
                        for (var i in qList) {
                            var color = "#909090";
                            qualityId = qList[i];
                            if (qualityId === $.client.getVideoQuality())
                                color = '#fff';
                            var quality = createTextLbl(self, {
                                text: $.client.getLocalizedString(qualityId, true).toUpperCase(),
                                x: 420,
                                y: qualitiesBox.y + 15 + i * 35,
                                font: "GothamProBold",
                                size: 22,
                                color: "#fff",
                                centered: false,
                                maxHeight: 30,
                                maxWidth: 100
                            });
                            streamGroup.add(quality);
                            quality.inputEnabled = true;
                            quality.input.useHandCursor = true;
                            quality.input.priorityID = 2;
                            quality.id = qualityId;
                            quality.events.onInputDown.add(function (event) {
                                currentStream.setTitle($.client.getLocalizedString(event.id, true).toUpperCase());
                                $.client.changeStream(event.id);
                                streamGroup.removeAll();
                            }, this);
                        }
                    }, this);
                }
            };
           
            var offset = 0;
            if ($.client.getVideoQuality() && $.client.getVideoQualities() && $.client.getVideoQualities().length > 0) {
                offset = 70;
                qualityLbl = createTextLbl(self, {
                    text: $.client.getLocalizedString('Quality', true).toUpperCase(),
                    x: 50,
                    y: 370,
                    font: "GothamProBold",
                    size: 28,
                    color: "#fff",
                    centered: false,
                    maxHeight: 45,
                    maxWidth: 220
                });
                settingsGroup.addChild(qualityLbl);
                currentQuality = createTextLbl(self, {
                    text: $.client.getLocalizedString($.client.getVideoQuality(), true).toUpperCase(),
                    x: 380,
                    y: 370,
                    font: "GothamProBold",
                    size: 28,
                    style: "bold",
                    color: "#4fa3cf",
                    centered: false,
                    align: "right",
                    maxHeight: 30,
                    maxWidth: 290 - qualityLbl.width
                });
                settingsGroup.addChild(currentQuality);
                currentQuality.inputEnabled = true;
                currentQuality.input.useHandCursor = true;
                currentQuality.input.priorityID = 2;
                currentQuality.events.onInputOver.add(function () {
                    if (!qualityGroup) {
                        showQuailitySelector();
                    }
                }, this);
            }
            
            if ($.client.getVideoStream() && $.client.getVideoStreams() && $.client.getVideoStreams().length > 0) {
                qualityLbl = createTextLbl(self, {
                    text: $.client.getLocalizedString('Stream', true).toUpperCase(),
                    x: 50,
                    y: 370 + offset,
                    font: "GothamProBold",
                    size: 28,
                    color: "#fff",
                    centered: false,
                    maxHeight: 45,
                    maxWidth: 200
                });
                qualityLbl.inputEnabled = true;
                qualityLbl.input.useHandCursor = true;
                qualityLbl.input.priorityID = 2;
                qualityLbl.events.onInputDown.add(function () {
                    showStreamSelector();
                }, this);
                settingsGroup.addChild(qualityLbl);
                currentStream = createTextLbl(self, {
                    text: $.client.getLocalizedString($.client.getVideoStream(), true).toUpperCase(),
                    x: 380,
                    y: 370 + offset,
                    font: "ProximaNova",
                    size: 28,
                    color: "#4fa3cf",
                    style: "bold",
                    centered: false,
                    align: "right",
                    maxHeight: 45,
                    maxWidth: 290 - qualityLbl.width
                });
                settingsGroup.addChild(currentStream);
                currentStream.inputEnabled = true;
                currentStream.input.useHandCursor = true;
                currentStream.input.priorityID = 2;
                currentStream.events.onInputOver.add(function () {
                    if (!streamGroup) {
                        showStreamSelector();
                    }
                }, this);
            }      
        }
    },
    showTimer: function(time) {
        timerGroup.TimeLabel.setTitle("--:--");
        timerGroup.TimeLabel.addColor('#fff', 0);
        timerGroup.alpha = 1;
        clearTimeout(timerGroup.timer);
        timerGroup.timer=setInterval(function () {
            time--;
            if (time > 0) {
                if (time < 60 && time>30) {
                    timerGroup.TimeLabel.addColor('#fffe64', 0);
                } else if (time < 30) {
                    timerGroup.TimeLabel.addColor('#FF0000', 0);
                }
                var min = parseInt(time / 60).toString();
                var sec = (time % 60).toString();
                var formatTime = "{0}:{1}".format(min.length > 1 ? min : "0" + min, sec.length > 1 ? sec : "0" + sec);
                timerGroup.TimeLabel.setTitle(formatTime);
            } else {
                timerGroup.TimeLabel.addColor('#fff', 0);
                timerGroup.alpha = 0;
                clearTimeout(timerGroup.timer);
            }
        },1000);
    },
    changeGameSize: function() {
        var wScale = $(window).innerWidth() / GAME_WIDTH;
        var hScale = $(window).innerHeight() / GAME_HEIGHT;
        if ((Math.max(wScale, hScale) - Math.min(wScale, hScale)) * 100 / (Math.max(wScale, hScale)) < 20) {
            game.scale.setUserScale(wScale, hScale);
        } else {
            if (wScale < hScale) {
                wScale = hScale = Math.min($(window).innerWidth() / GAME_WIDTH, $(window).innerHeight() / GAME_HEIGHT);
                game.scale.setUserScale(wScale, wScale);
            } else {
                hScale = Math.min($(window).innerWidth() / GAME_WIDTH, $(window).innerHeight() / GAME_HEIGHT);
                wScale = hScale + hScale / 100 * 20;
                game.scale.setUserScale(wScale, hScale);
            }
        }
        var sDif = Math.abs(wScale - hScale);
        game.scale.refresh();
        setTimeout(function () {
            changeVideoSize();
        }, 500);
    },
    cellOver: function(element) {
        var self = this;
        if (MessageDispatcher.isTableOpen && !MessageDispatcher.isTableLocked)
            if (betNumbers.indexOf(element.number) === -1)
                element.alpha = 0.5;
    },
    cellOut: function(element) {
        var self = this;
        if (MessageDispatcher.isTableOpen && !MessageDispatcher.isTableLocked)
            if (betNumbers.indexOf(element.number) === -1)
                element.alpha = 0;
    },
    cellClick: function(element) {
        var self = this;
        if (MessageDispatcher.isTableOpen && !MessageDispatcher.isTableLocked) {
            if (betNumbers.indexOf(element.number) === -1) {
                if (betNumbers.length < game.config.MaxNumbersCount) {
                    element.alpha = 1;
                    betNumbers.push(element.number);
                }
            } else {
                element.alpha = 0.5;
                betNumbers.splice(betNumbers.indexOf(element.number), 1);
            }
            self.redrawButtons();
            self.showPayTable(0, betNumbers, betAmount);
        }
    },
    startGame: function(rounds) {
        var self = this;
function deal() {
    MessageDispatcher.isTableLocked = true;
    $.client.sendPost(JSON.stringify({
                type: "bet",
                amount: betAmount,
                numbers: betNumbers
            }), function (res) {
                if (res.IsSuccess && res.ResponseData.success) {
                    MessageDispatcher.isTableLocked = true;
                    self.changeStatus($.client.getLocalizedString("Bet confirmed!", true));
                    playBtn.text.setTitle($.client.getLocalizedString("New bet", true).toUpperCase());
                    self.betNumbers = betNumbers;
                    MessageDispatcher.bets.push({ numbers: betNumbers, amount: betAmount,selected:true });
                    USER_BALANCE = res.ResponseData.balance;
                    confirmedAmount += betAmount;
                    headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                    betNumbers = [];
                    self.redrawButtons(true);
                    self.showTickets();
                    playBtn.enable();
                    cancelBtn.enable();
                    headerTotalBetVal.setTitle($.client.UserData.CurrencySign + (confirmedAmount > 99999 ? kFormater(confirmedAmount) : parseFloat(confirmedAmount).toFixed(2)));

                } else {
                    self.changeStatus($.client.getLocalizedString("Bet not confirmed!", true));
                    MessageDispatcher.isTableLocked = false;
                }
                isSubmiting = false;
            }, function (err) {
                MessageDispatcher.isTableLocked = false;
                console.log(err);
                isSubmiting = false;
            });

        }

        if (!isSubmiting) {
            isSubmiting = true;
            if (self.mode == "Manual" && $.client.UserData.Features && $.client.UserData.Features.provably_fair) {
                $.client.sendSeed(function (responce) {
                    if (responce.IsSuccess) {
                        deal();
                    }
                    isSubmiting = false;
                }, function (err) {
                    console.log(err);
                    isSubmiting = false;
                });
            } else {
                deal();
            }
        }
    },
    showNumbers: function (numbers) {
        var self = this;
        if (numbers) {
            for (var j = 0; j < MessageDispatcher.bets.length; j++) {
                if (MessageDispatcher.bets[j].selected)
                    betNumbers = MessageDispatcher.bets[j].numbers;
            }
            for (var i = 0; i < numbers.length; i++) {
                var number = numbers[i];
                if (betNumbers.indexOf(number) === -1) {
                    tableCell[number.toString()].loadTexture("numbers", 1);
                } else {
                    matchNumbers.push(number);
                    tableCell[number.toString()].loadTexture("numbers", 2);
                }
                tableCell[number.toString()].alpha = 1;
            }
            this.showPayTable(matchNumbers.length, betNumbers, betAmount);
            matchNumbers = [];
            self.showCurrentNumbers();
            self.showTickets(numbers);
        }
    },
    redrawButtons: function (disabled) {
        var self = this;
        if (disabled) {
            undoBtn.disable();
            clearBtn.disable();
            playBtn.disable();
            quickBtn.disable();
            stepUpBtn.disable();
            stepDownBtn.disable();
            cancelBtn.disable();
        } else {
            undoBtn.disable();
            clearBtn.disable();
            playBtn.disable();
            quickBtn.enable();
            stepUpBtn.enable();
            stepDownBtn.enable();
            cancelBtn.disable();
            if (betNumbers.length > 0) {
                undoBtn.enable();
                clearBtn.enable();
            }
            if (betNumbers.length >= game.config.MinNumbersCount) {
                playBtn.enable();
                quickBtn.enable();
            } else {
                if (betNumbers.length <= 0) {
                    undoBtn.disable();
                    clearBtn.disable();
                } else {
                    undoBtn.enable();
                    clearBtn.enable();
                }
                playBtn.disable();
                quickBtn.enable();
            }
        }
    },
    showPayTable: function(matchCount,numbers,amount) {
        var payTable, self = this;
        for (var i = 0; i < game.config.WinRates.length; i++) {
            if (game.config.WinRates[i].Num == numbers.length) {
                payTable = game.config.WinRates[i].Rates;
            }
        }
        payoutGroup.removeAll();
        if (payTable) {
            var items = [];
            for (var j = 0; j < payTable.length; j++) {
                if (payTable[j] > 0) {
                    var payOut = parseFloat(payTable[j] * amount);
                    items.push({ count: j + 1, payout:  payOut % 1 == 0 ? payOut : parseFloat(payOut).toFixed(1)});           
                }
            }
            for (var j = 0; j < items.length; j++) {
                var color;
                if (matchCount == items[j].count) {
                    color = "#01fefd";
                } else {
                    color = "#fff";
                }
                payoutGroup.add(createTextLbl(self, {
                    text: items[j].count.toString(),
                    x: gameFrame.width - 255,
                    y: 175 + j * (42 - items.length * 0.8),
                    font: "GothamProBold",
                    size: 34,
                    color: color,
                    style: "bold",
                    centered: true,
                    maxHeight: 34,
                    maxWidth: 95
                }));
                payoutGroup.add(createTextLbl(self, {
                    text: items[j].payout.toString(),
                    x: gameFrame.width - 125,
                    y: 175 + j * (42 - items.length * 0.8),
                    font: "GothamProBold",
                    size: 34,
                    color: color,
                    style: "bold",
                    centered: true,
                    maxHeight: 34,
                    maxWidth: 95
                }));
            }
        }
    },
    showTickets: function (winNumbers) {
        var self = this;
        ticketGroup.removeAll();
        vTicketsGroup.removeAll();
        var bets = MessageDispatcher.bets;
        for (var i = 0; i < bets.length; i++) {
            /*MAIN LIST*/
                var ticketBg = this.add.sprite(36, 600 + i * 68, "tickets", bets[i].selected ? 1 : 0);
                ticketBg.idx = parseInt(i);
                ticketBg.amount = parseFloat(bets[i].amount);
                ticketGroup.add(ticketBg);
               ticketBg.inputEnabled = true;
                ticketBg.input.useHandCursor = true;
                ticketBg.events.onInputDown.add(function (target) {
                    if (MessageDispatcher.isTableOpen) {
                        for (var j = 0; j < bets.length; j++) {
                            bets[j].selected = false;
                        }
                        bets[target.idx].selected = true;
                        self.redrawTable(bets[target.idx].numbers);
                        self.showPayTable(0, bets[target.idx].numbers, target.amount);
                        cancelBtn.enable();
                        self.showTickets();
                    }
                }, this);
                var color;
                color = bets[i].selected ? "#87d6fe":"#fff";
                for (var j = 0; j < bets[i].numbers.length; j++) {
                    if (MessageDispatcher.numbers.indexOf(bets[i].numbers[j]) >= 0) {
                        var bg = ticketGroup.create(40.5 + j * 48.2, 606 +  i * 68, "numbers", 2);
                        bg.scale.set(0.51, 0.51);
                        color = "#fff";
                    }
                    ticketGroup.add(createTextLbl(self, {
                    text: bets[i].numbers[j].toString(),
                    x: 60+j*48.4,
                    y: 608 + i * 68,
                    font: "GothamProBold",
                    size: 32,
                    color: color,
                    style: "bold",
                    centered: true,
                    maxHeight: 34,
                    maxWidth: 95
                }));
                }
                color = bets[i].selected ? "#87d6fe" : "#fff";
                var amount = bets[i].amount;
                ticketGroup.add(createTextLbl(self, {
                    text: $.client.UserData.CurrencySign + (amount > 99999 ? kFormater(amount) : amount % 1 == 0 ? amount : parseFloat(amount).toFixed(1)),
                    x: 577,
                    y: 608 + i * 68,
                    font: "GothamProBold",
                    size: 32,
                    color: color,
                    style: "bold",
                    centered: true,
                    maxHeight: 34,
                    maxWidth: 80
                }));
            /*SECOND FRAME LIST*/
                
                var ticket = this.add.sprite(8, 65 + i * 120, "ticket");
                vTicketsGroup.add(ticket);
                var idx = 0, idy = 0;
                for (var j = 0; j < bets[i].numbers.length; j++) {
                    idx++;
                    if (j < 5) {
                        idx = j;
                    } else {
                        idy = 1;
                        idx = j - 5;
                    }
                if (MessageDispatcher.numbers.indexOf(bets[i].numbers[j])>=0) {
                    var bg = vTicketsGroup.create(10.5 + idx * 43, 68.0 + idy * 42.6 + i * 120.1, "numbers", 2);
                    bg.scale.set(0.47,0.47);
                }
                vTicketsGroup.add(createTextLbl(self, {
                        text: bets[i].numbers[j].toString(),
                        x: 31 + idx * 42.8,
                        y: 71 + idy * 42+i*120,
                        font: "GothamProBold",
                        size: 29,
                        color: "#fff",
                        style: "bold",
                        centered: true,
                        maxHeight: 34,
                        maxWidth: 95
                    }));
                }
        }
    },
    redrawTable: function (numbers) {
        for (var i = 1; i <= 80; i++) {
            tableCell[i.toString()].loadTexture("numbers", 0);
            if (numbers.indexOf(i) != -1)
                tableCell[i.toString()].alpha = 1;
            else 
                tableCell[i.toString()].alpha = 0;
        }
    },
    clearAll: function(element) {
        for (var i = 1; i <= 80; i++) {
                tableCell[i.toString()].alpha = 0;
        }
        betNumbers = [];
        this.redrawButtons();
        this.showPayTable(0, betNumbers, betAmount);
    },
    clearLast: function(element) {
        if (MessageDispatcher.isTableOpen) {
            tableCell[betNumbers.pop()].alpha = 0;
        }
        this.redrawButtons();
        this.showPayTable(0, betNumbers, betAmount);
    },
    cancelBet: function (element) {
        var self = this;
        if (MessageDispatcher.isTableOpen) {
            function cancel(cancelBet) {
                $.client.sendPost(JSON.stringify({
                    type: "cancel_bet",
                    bet: cancelBet
                }), function (responce) {
                    if (responce.IsSuccess) {
                        if (responce.ResponseData.success) {
                            MessageDispatcher.bets.splice(MessageDispatcher.bets.indexOf(cancelBet), 1);
                            USER_BALANCE = responce.ResponseData.balance;
                            headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                            self.changeStatus($.client.getLocalizedString('Bet canceled', true), 3000);
                            self.showTickets();
                            self.redrawTable(betNumbers);
                            cancelBtn.disable();
                        }
                    } else {
                        self.changeStatus($.client.getLocalizedString('Bet not canceled', true), 3000);
                        console.error("Error bet canceling");
                    }
                }, function (err) {
                    console.log(err);
                });
            }
            var cancelBet;
            for (var i = 0; i < MessageDispatcher.bets.length; i++) {
                if (MessageDispatcher.bets[i].selected) {
                    cancelBet = MessageDispatcher.bets[i];
                }
                if (cancelBet)
                   cancel(cancelBet);
            }
        }
    },
    resetTable: function () {
        MessageDispatcher.isTableLocked = false;
        for (var i = 1; i <= 80; i++) {
            tableCell[i.toString()].loadTexture("numbers", 0);
            tableCell[i.toString()].alpha = 0;
        }
        betNumbers = [];
        matchNumbers = [];
        confirmedAmount = 0;
        headerTotalBetVal.setTitle($.client.UserData.CurrencySign + (confirmedAmount > 99999 ? kFormater(confirmedAmount) : parseFloat(confirmedAmount).toFixed(2)));
        playBtn.text.setTitle($.client.getLocalizedString("Confirm", true).toUpperCase());
        this.redrawButtons();
        this.showTickets();
        this.showPayTable(0, betNumbers, betAmount);
    },
    showWinner: function(winAmount) {
        headerWinInputVal.setTitle($.client.UserData.CurrencySign + (winAmount > 99999 ? kFormater(winAmount) : parseFloat(winAmount).toFixed(2)));
        videoWinInputVal.setTitle($.client.UserData.CurrencySign + (winAmount > 99999 ? kFormater(winAmount) : parseFloat(winAmount).toFixed(2)));
    },
    clearWinAmout: function() {
        headerWinInputVal.setTitle($.client.UserData.CurrencySign + 0);
    },
    showCashier: function(visible) {
         if (visible) {
             cashierBtn.enable();
         } else {
             cashierBtn.disable();
         }
    }
};