
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

var Bets = {};
var timerSprite = {}, timerObj;
var betHistory = [];
var betNumbers = [];
var matchNumbers = [];

var winNumInfo = {}, msgBoxPopup, msgBoxTween, limitPopup, limitPopupTween, statPopup, historyPopup, statPopupTween, selectedLimits = [];
var cellName, betName, borderPosArr;

var tableChips = [];
var limits = [];
var historyArr = [];
var previousBetChips = [];
var roundBetChips = [];
var lastRevive = 0;
var factorGroups = [];
var limitBtnText, confirmLimitBtn, cashierBtn, provablyBtn;
var tableCell = {};

var userNameText, USER_NAME, headerBetInputVal, headerBalansInputVal, headerWinInputVal;
var gameFrame, numberLbl, numberFrame, winNum, placeHold, timer;
var _winNumUpdate, progressText, _videoFlagShow, isModalShow, isSubmiting, bigRoadText;

var worldGroup = {},
    tableGroup = {},
    payoutGroup = {},
    buttonGroup = {},
    selectedChipsGroup = {},
    frameGroup = {},
    footerGroup = {},
    winTextGroup = {},
    numberGroup = {},
    numbersListGroup = {},
    cursorGroup = {},
    factorsGroup = {},
    statDataGroup,
    startGameBtn,
    settingsBtn;
var tableCell = {}, numberLbls = {}, KinoLandscapeGame = {};
var previousMsgType, winAmount = 0;
var chipCursor, cursorVisible = false, timeToEnd, lastChangeStatus;
var playBtn, clearBtn, undoBtn, stepDownBtn, stepUpBtn, quickBtn, quickFiveBtn, gameEnd;
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
        this.load.image("numberFrame", "images/number_frame.png");
        this.load.spritesheet("clearBtn", "images/clear_btn.png", 157, 75);
        this.load.spritesheet("gameBtn", "images/game_btn.png", 307, 61);
        this.load.spritesheet("gameFiveBtn", "images/game_five_btn.png", 270, 75);
        this.load.spritesheet("minusBtn", "images/minus_btn.png", 55, 55);
        this.load.spritesheet("plusBtn", "images/plus_btn.png", 55, 55);
        this.load.spritesheet("numbers", "images/numbers.png", 83, 83);
        this.load.spritesheet("playBtn", "images/play_btn.png", 276, 142);
        this.load.spritesheet("undoBtn", "images/undo_btn.png", 157, 75);
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
    create: function() {
        var self = this;
        var balansLabel, winLabel;
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
        factorsGroup = this.add.group();
        numberGroup = this.add.group();
        numbersListGroup = this.add.group();

        footerGroup.add(winTextGroup);

        worldGroup.add(frameGroup);
        worldGroup.add(tableGroup);
        worldGroup.add(numberGroup);
        worldGroup.add(buttonGroup);
        worldGroup.add(payoutGroup);
        gameFrame = this.add.sprite(0, 0, "gameFrame");
        numberFrame = this.add.sprite(85, 330, "numberFrame");
        numberFrame.scale.set(0.7);
        numberGroup.add(numbersListGroup);
        numberGroup.add(numberFrame);
        numberGroup.x = -600;

        var mask = game.add.graphics(90, 480);
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, 425, 235);
        mask.lineStyle(0);
        mask.endFill();
        numbersListGroup.mask = mask;
        for (var i = 1; i <= 80; i++) {
            numberLbl = createTextLbl(self, {
                text: i.toString(),
                x: 310,
                y: 510 + 235 * (i - 1),
                font: "GothamProBold",
                size: 160,
                color: "#fff",
                centered: true,
                wordWrapWidth: 160,
                maxHeight: 200,
                maxWidth: 225
            });
            var grd = numberLbl.context.createLinearGradient(0, 0, 0, numberLbl.height);
            grd.addColorStop(0, "#8ED6FF");
            grd.addColorStop(1, "#004CB3");
            numberLbl.fill = grd;
            numbersListGroup.add(numberLbl);
            numberLbls[i] = numberLbl;
        }

        frameGroup.add(gameFrame);
        numberGroup.add(mask);
        numberGroup.alpha = 1;
        frameGroup.add(this.add.sprite(50, 30, "logo"));
        var name = USER_NAME ? USER_NAME.toUpperCase().length < 25 ? USER_NAME.toUpperCase() : USER_NAME.toUpperCase().substr(0, 25) + "..." : "";
        userNameText = this.add.text(630, gameFrame.height - 103, name, {
            font: "bold 30px GothamProBold",
            fill: "#0086cb"
        });
        footerGroup.add(userNameText);
        createTextLbl(self, {
            text: $.client.getLocalizedString("Hits", true),
            x: gameFrame.width - 280,
            y: gameFrame.height - 982,
            font: "GothamProBold",
            size: 34,
            color: "#fff",
            style: "bold",
            centered: true,
            wordWrapWidth: 120,
            maxHeight: 40,
            maxWidth: 120
        });
        createTextLbl(self, {
            text: $.client.getLocalizedString("Pays", true),
            x: gameFrame.width - 150,
            y: gameFrame.height - 982,
            font: "GothamProBold",
            size: 34,
            style: "bold",
            color: "#fff",
            centered: true,
            wordWrapWidth: 120,
            maxHeight: 40,
            maxWidth: 120
        });
        balansLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("Balance", true),
            x: gameFrame.width - 293,
            y: gameFrame.height - 435,
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
            x: gameFrame.width - 160,
            y: gameFrame.height - 440,
            font: "ProximaNova",
            size: 33,
            color: "#fff",
            style: "bold",
            centered: true,
            maxHeight: 30,
            maxWidth: 155
        });

        footerGroup.add(headerBalansInputVal);

        /*  cashierBtn = this.add.button(gameFrame.width - 83, gameFrame.height - 61, 'cashin', function () {
            $.client.cashier();
        }, this);
        cashierBtn.scale.set(0.7);
        cashierBtn.input.useHandCursor = true;
        cashierBtn.clicked = true;*/

        headerBetInputVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + betAmount,
            x: gameFrame.width - 208,
            y: gameFrame.height - 296,
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
            x: gameFrame.width - 313,
            y: gameFrame.height - 363,
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
            x: gameFrame.width - 160,
            y: gameFrame.height - 368,
            font: "ProximaNova",
            size: 33,
            color: "#fff",
            style: "bold",
            centered: true,
            maxHeight: 30,
            maxWidth: 155
        });
        footerGroup.add(headerWinInputVal);

        quickBtn = createTextButton(self, {
            text: $.client.getLocalizedString("Quick play", true).toUpperCase(),
            x: gameFrame.width - 1285,
            y: gameFrame.height - 197,
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
                self.resetTable();
                var numbers = [];
                for (var i = 1; i <= 80; i++) {
                    numbers.push(i);
                }
                for (var j = 0; j < game.config.MaxNumbersCount; j++) {
                    var id = parseInt(Math.random() * (numbers.length-1) + 1);
                    tableCell[numbers[id].toString()].alpha = 1;
                    betNumbers.push(numbers.splice(id,1).pop());
                }
                self.redrawButtons();
                self.showPayTable();
            }
        });
        buttonGroup.add(quickBtn);

        quickFiveBtn = createTextButton(self, {
            text: $.client.getLocalizedString("Play five", true).toUpperCase(),
            x: gameFrame.width - 970,
            y: gameFrame.height - 204,
            font: "GothamProBold",
            size: 38,
            maxHeight: 40,
            maxWidth: 240,
            color: "#fff",
            disabledColor: "#808080",
            style: "bold",
            centered: true,
            paddingTop: -9,
            sprite: "gameFiveBtn",
            defaultIndex: 0,
            overIndex: 0,
            clickIndex: 1,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: 2,
            onClick: function() {
                self.startGame(5);
            }
        });
        buttonGroup.add(quickFiveBtn);
        quickFiveBtn.disable();
        undoBtn = createTextButton(self, {
            text: $.client.getLocalizedString("Undo", true),
            x: gameFrame.width - 690,
            y: gameFrame.height - 204,
            font: "GothamProBold",
            size: 38,
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
            y: gameFrame.height - 204,
            font: "GothamProBold",
            size: 38,
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
        gameEnd = false;
        playBtn = createTextButton(self, {
            text: $.client.getLocalizedString("Play", true).toUpperCase(),
            x: gameFrame.width - 350,
            y: gameFrame.height - 224,
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
                if (gameEnd) {
                    gameEnd = false;
                    self.resetTable();
                    if (self.mode == "Manual") {
                        playBtn.text.setTitle($.client.getLocalizedString("Play", true).toUpperCase());
                    }
                    self.redrawButtons();
                    MessageDispatcher.isTableOpen = true;
                    MessageDispatcher.gameId = gameId;
                } else {
                    self.startGame(1);
                }
            }
        });
        playBtn.disable();
        buttonGroup.add(playBtn);

        stepDownBtn = createTextButton(self, {
            text: "",
            x: gameFrame.width - 352,
            y: gameFrame.height - 304,
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
            onClick: function() {
                if (parseFloat(game.config.MinBet.replace(",", ".")) <= betAmount - game.config.BetStep) {
                    betAmount -= game.config.BetStep;
                    headerBetInputVal.setTitle($.client.UserData.CurrencySign + betAmount);
                    self.showPayTable();
                }
            }
        });
        buttonGroup.add(stepDownBtn);
        stepUpBtn = createTextButton(self, {
            text: "",
            x: gameFrame.width - 130,
            y: gameFrame.height - 304,
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
                if (parseFloat(game.config.MaxBet.replace(",", ".")) >= betAmount + game.config.BetStep) {
                    betAmount += game.config.BetStep;
                    headerBetInputVal.setTitle($.client.UserData.CurrencySign + betAmount);
                    self.showPayTable();
                }
            }
        });
        buttonGroup.add(stepUpBtn);
        homeBtn = createTextButton(self, {
            text: "",
            x: gameFrame.width - 90,
            y: gameFrame.height - 70,
            font: "GothamProBold",
            size: 50,
            maxHeight: 50,
            maxWidth: 50,
            sprite: "homeIco",
            defaultIndex: 0,
            overIndex: 0,
            clickIndex: 1,
            disabledIndex: 2,
            useHandCursor: true,
            onClick: function () {
                $.client.toHome();
            }
        });
        /*  provablyBtn = this.add.group();
        var provablyBtnBg = this.add.button(20, 30, 'mainBtnBg', function () {
            $.client.showProvablyFair();
        }, this);
        provablyBtnBg.clicked = false;
        provablyBtnBg.input.useHandCursor = true;
        var provablyBtnTxt = createTextLbl(self, {
            text: $.client.getLocalizedString("Provably fair", true),
            x: provablyBtnBg.x + provablyBtnBg.width / 2,
            y: provablyBtnBg.y + 12,
            font: "GothamProBold",
            size: 22,
            color: "#fff",
            centered: true,
            maxHeight: 55,
            maxWidth: provablyBtnBg.width - 10
        });
        provablyBtn.btn = provablyBtnBg;
        provablyBtn.add(provablyBtnBg);
        provablyBtn.add(provablyBtnTxt);
        provablyBtn.alpha = 0;
        */

        var card1 = this.add.sprite(640, 85, "cardBg");
        tableGroup.add(card1);
        var card2 = this.add.sprite(640, 500, "cardBg");
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

        createTextLbl(self, {
            text: $.client.getLocalizedString("Draw Id", true),
            x: gameFrame.width - 330,
            y: gameFrame.height - 550,
            font: "GothamProBold",
            size: 28,
            color: "#fff",
            centered: false,
            maxHeight: 40,
            maxWidth: 110
        });
        var gameIdLabel = createTextLbl(self, {
            text: MessageDispatcher.gameId,
            x: gameFrame.width - 150,
            y: gameFrame.height - 552,
            style: "bold",
            font: "GothamProBold",
            size: 28,
            color: "#fff",
            centered: true,
            maxHeight: 40,
            maxWidth: 130
        });
        var dateTimeLabel = createTextLbl(self, {
            text: $.DateFormat(MessageDispatcher.serverTime.toString(), "yyyy-MM-dd   HH:mm:ss "),
            x: gameFrame.width - 328,
            y: gameFrame.height - 512,
            style: "bold",
            font: "GothamProBold",
            size: 36,
            color: "#fff",
            centered: false,
            align: "left",
            maxHeight: 36,
            wordWrapWidth: false,
            maxWidth: 240
        });
        worldGroup.add(dateTimeLabel);
        var dateTimeLabel2 = createTextLbl(self, {
            text: $.DateFormat(MessageDispatcher.serverTime.toString(), "HH:mm  dd/MM/yyyy"),
            x: gameFrame.width - 700,
            y: gameFrame.height - 110,
            style: "bold",
            font: "GothamProBold",
            size: 40,
            color: "#0086cb",
            centered: false,
            align: "left",
            maxHeight: 40,
            wordWrapWidth: false,
            maxWidth: 350
        });
        worldGroup.add(dateTimeLabel);

        if (self.timeInterval)
            clearInterval(self.timeInterval);
        self.timeInterval = setInterval(function() {
            gameIdLabel.setTitle(MessageDispatcher.gameId);
            MessageDispatcher.serverTime.setSeconds(MessageDispatcher.serverTime.getSeconds() + 1);
            dateTimeLabel.setText($.DateFormat(MessageDispatcher.serverTime.toString(), "yyyy-MM-dd  HH:mm:ss"));
            dateTimeLabel2.setText($.DateFormat(MessageDispatcher.serverTime.toString(), "HH:mm  dd/MM/yyyy"));
        }, 1000);
        window.addEventListener("resize", function() {
            self.changeGameSize();
        });
        setInterval(function() {
            self.changeGameSize();
        }, 1000);
        self.changeGameSize();
        self.ready = true;
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
        if (MessageDispatcher.isTableOpen)
            if (betNumbers.indexOf(element.number) === -1)
                element.alpha = 0.5;
    },
    cellOut: function(element) {
        var self = this;
        if (MessageDispatcher.isTableOpen)
            if (betNumbers.indexOf(element.number) === -1)
                element.alpha = 0;
    },
    cellClick: function(element) {
        var self = this;
        if (MessageDispatcher.isTableOpen) {
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
            self.showPayTable();
        }
    },
    startGame: function(rounds) {
        var self = this;

        function start(rounds, numbers, amount, nextRoundId) {
            MessageDispatcher.isTableOpen = false;
            self.redrawButtons(true);
            playBtn.disable();
            numberGroup.alpha = 1;
            numbersListGroup.alpha = 0;
            var showTween = game.add.tween(numberGroup).to({ x: 0 }, 200, Phaser.Easing.Linear.None, true, 1000);

            function showNumber(number) {
                self.showNumber(number);
                setTimeout(function() {
                    if (numbers.length > 0)
                        showNumber(numbers.shift());
                    else {
                        rounds--;
                        headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                        if (rounds <= 0) {
                            playBtn.text.setTitle($.client.getLocalizedString("New game", true).toUpperCase());
                            game.add.tween(numberGroup).to({ x: -600 }, 300, Phaser.Easing.Linear.None, true, 1000);
              
                            playBtn.enable();
                            gameEnd = true;
                        } else {
                            setTimeout(function() {
                                for (var i = 1; i <= 80; i++) {
                                    if (betNumbers.indexOf(i) == -1) {
                                        tableCell[i.toString()].alpha = 0;
                                    }
                                    tableCell[i.toString()].loadTexture("numbers", 0);
                                }
                                headerWinInputVal.setTitle($.client.UserData.CurrencySign + 0);
                                numberGroup.alpha = 0;
                                matchNumbers = [];
                                self.showPayTable();
                                self.startGame(rounds);
                                MessageDispatcher.gameId = gameId;
                            }, 2000);
                        }
                        gameId = nextRoundId;
                    }
                }, 1500);
            }

            showTween.onComplete.add(function() {
                showNumber(numbers.shift());
            }, this);
        }

        function deal() {
            $.client.sendPost(JSON.stringify({
                type: "bet",
                amount: betAmount,
                numbers: betNumbers
            }), function (res) {
                if (res.IsSuccess && res.ResponseData.success) {
                    if (self.mode == "Manual") {
                        start(rounds, res.ResponseData.winNumbers, res.ResponseData.winAmount, res.ResponseData.gameId);
                    } else {
                        self.redrawButtons(true);
                    }
                    self.betNumbers = betNumbers;
                    USER_BALANCE = res.ResponseData.balance;
                    headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                }
                isSubmiting = false;
            }, function (err) {
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
        this.showPayTable(matchNumbers.length);
        headerWinInputVal.setTitle($.client.UserData.CurrencySign + 0);
        matchNumbers = [];
  },
    restartGame: function() {
        /* startGameBtn.btn.inputEnabled = true;
        startGameBtn.alpha = 1;
        if ($.client.UserData.Features && $.client.UserData.Features.provably_fair) {
            provablyBtn.btn.inputEnabled = true;
            provablyBtn.alpha = 1;
        } else {
            provablyBtn.btn.inputEnabled = false;
            provablyBtn.alpha = 0;
        }*/
    },
    redrawButtons: function (disabled) {
        var self = this;
        if (disabled) {
            undoBtn.disable();
            clearBtn.disable();
            playBtn.disable();
            quickBtn.disable();
            quickFiveBtn.disable();
            stepUpBtn.disable();
            stepDownBtn.disable();
        } else {
            undoBtn.disable();
            clearBtn.disable();
            playBtn.disable();
            quickFiveBtn.disable();
            quickBtn.enable();
            stepUpBtn.enable();
            stepDownBtn.enable();
            if (betNumbers.length > 0) {
                undoBtn.enable();
                clearBtn.enable();
            }
            if (betNumbers.length >= game.config.MinNumbersCount) {
                playBtn.enable();
                quickBtn.enable();
                quickFiveBtn.enable();
            } else {
                if (betNumbers.length <= 0) {
                    undoBtn.disable();
                    clearBtn.disable();
                } else {
                    undoBtn.enable();
                    clearBtn.enable();
                }
                quickFiveBtn.disable();
                playBtn.disable();
                quickBtn.enable();
            }
        }
        this.enableManualMode(self.mode == "Manual");
    },
    showPayTable: function(matchCount) {
        var payTable, self = this;
        for (var i = 0; i < game.config.WinRates.length; i++) {
            if (game.config.WinRates[i].Num == betNumbers.length) {
                payTable = game.config.WinRates[i].Rates;
            }
        }
        payoutGroup.removeAll();
        if (payTable) {
            var items = [];
            for (var j = 0; j < payTable.length; j++) {
                if (payTable[j] > 0) {
                    var payOut = parseFloat(payTable[j] * betAmount);
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
                    x: gameFrame.width - 280,
                    y: 145 + j * (42 - items.length * 0.8),
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
                    x: gameFrame.width - 150,
                    y: 145 + j * (42 - items.length * 0.8),
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
    clearAll: function(element) {
        for (var i = 1; i <= 80; i++) {
                tableCell[i.toString()].alpha = 0;
        }
        betNumbers = [];
        this.redrawButtons();
        this.showPayTable();
    },
    clearLast: function(element) {
        if (MessageDispatcher.isTableOpen) {
            tableCell[betNumbers.pop()].alpha = 0;
        }
        this.redrawButtons();
        this.showPayTable();
    },
    showNumber: function(number) {
        var self = this;
        if (betNumbers.indexOf(number) != -1) {
            matchNumbers.push(number);
            self.showPayTable(matchNumbers.length);
        }
        numberGroup.alpha = 1;
        game.add.tween(numbersListGroup).to({ y: -(number - 1) * 235 }, 500, Phaser.Easing.Cubic.In, true, 1000);
        setTimeout(function() {
            setTimeout(function() {
                numbersListGroup.alpha = 1;
            }, 700);
            var tween = self.add.tween(numberLbls[number]).to({ fontSize: 200, y: numberLbls[number].y - 28 }, 100, Phaser.Easing.Linear.None, true, 1000);

            function onComplete() {
                if (betNumbers.indexOf(number) === -1) {
                    tableCell[number.toString()].loadTexture("numbers", 1);
                } else {
                    tableCell[number.toString()].loadTexture("numbers", 2);
                }
                tableCell[number.toString()].alpha = 1;
                self.add.tween(numberLbls[number]).to({ fontSize: 160, y: 510 + 235 * (number - 1) }, 100, Phaser.Easing.Linear.None, true, 1000);
            }

            tween.onComplete.add(onComplete, this);
        }, 500);
    },
    resetTable: function() {
        for (var i = 1; i <= 80; i++) {
            tableCell[i.toString()].loadTexture("numbers", 0);
            tableCell[i.toString()].alpha = 0;
        }
        headerWinInputVal.setTitle($.client.UserData.CurrencySign + 0);
        betNumbers = [];
        matchNumbers = [];
        this.redrawButtons();
        this.showPayTable();
    },
    showWinner: function(winAmount) {
        headerWinInputVal.setTitle($.client.UserData.CurrencySign + (winAmount > 99999 ? kFormater(winAmount) : parseFloat(winAmount).toFixed(2)));
    },
    clearWinAmout: function() {
        headerWinInputVal.setTitle($.client.UserData.CurrencySign + 0);
    },
    enableManualMode: function(manual) {
        if (!manual) {
            numbersListGroup.alpha = 0;
            game.add.tween(numberGroup).to({ x: 0 }, 200, Phaser.Easing.Linear.None, true, 1000);
            playBtn.text.setTitle($.client.getLocalizedString("Confirm", true).toUpperCase());
            quickFiveBtn.disable();
            quickFiveBtn.alpha = 0;
            $("#landscape_video").show();
        } else {
            playBtn.text.setTitle($.client.getLocalizedString("Play", true).toUpperCase());
            quickFiveBtn.alpha = 1;
            $("#landscape_video").hide();
        }
    },
    showCashier: function(visible) {
        /* if (visible) {
             cashierBtn.alpha = 1;
             cashierBtn.input.useHandCursor = true;
             cashierBtn.inputEnabled = true;
             cashierBtn.clicked = true;
         } else {
             cashierBtn.alpha = 0;
             cashierBtn.input.useHandCursor = false;
             cashierBtn.clicked = false;
             cashierBtn.inputEnabled = false;
         }*/
    }
};