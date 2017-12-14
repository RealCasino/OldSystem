
var GAMESTATE_CODE_TABLE_CLOSED = 0,
    GAMESTATE_CODE_TABLE_OPENED = 1,
    GAMESTATE_CODE_WINNING_NUMBER = 2,
    GAMESTATE_CODE_WINNING_SUM = 4,

    TABLE_MIN_BET, TABLE_MAX_BET,
    PUNTO_MIN_BET, PUNTO_MAX_BET,
    TIE_MIN_BET, TIE_MAX_BET,
    BANCO_MIN_BET, BANCO_MAX_BET,

    USER_BALANCE = 0;
    TOTAL_LOST = 0;
var stakeStatus = {
    PENDING: 0,
    ACCEPTED: 1,
    REJECTED: 2,
    COMPLETED: 3,
    CANCELED: 4
};

var dib_cost = [0.1, 1, 5, 10, 25, 50],
    NUM_DIB = dib_cost.length - 1,
    selectedChipId = 0,
    table, summaDeb = 0,
    tableStatus, infoText, timerText;

var Bets = {};
var timerSprite = {}, timerObj;
var historyArr = [];
var betHistory = [];

var winNumInfo = {}, msgBoxPopup, msgBoxTween, limitPopup, limitPopupTween, statPopup, historyPopup, statPopupTween, selectedLimits = [];
var cellName, betName, borderPosArr;

var tableChips = [];
var limits = [];
var previousBetChips = [];
var roundBetChips = [];
var factorGroups = [];
var lastRevive = 0;
var limitBtnText, confirmLimitBtn,cashierBtn,provablyBtn,homeBtn;

var userNameText, USER_NAME, headerBetInputVal, headerBalansInputVal;
var gameFrame, winNum, placeHold, timer;
var _winNumUpdate, progressText, _videoFlagShow, isModalShow, isSubmiting, bigRoadText;

var worldGroup = {}, tableGroup = {}, chipsGroup = {}, buttonGroup = {}, selectedChipsGroup = {},
    frameGroup = {}, footerGroup = {}, winTextGroup = {}, limitGroup = {}, cursorGroup = {}, factorsGroup = {}, statDataGroup, startGameBtn;
var tableCell = {}, DicePortraitGame = {};
var previousMsgType, winAmount = 0, timeToEnd;
var chipCursor, cursorVisible = false, lastChangeStatus;

DicePortraitGame.Boot = function (game) {
};

DicePortraitGame.Boot.prototype = {
    init: function () {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;
        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.scale.setUserScale(SCALE, SCALE);
        this.scale.refresh();

    },
    preload: function () {
    },

    create: function () {
        this.state.start('Preloader');
    },
};

DicePortraitGame.Preloader = function (game) {

    this.background = null;
    this.ready = false;
};

DicePortraitGame.Preloader.prototype = {

    preload: function () {
        this.game.stage.backgroundColor = '#fff';
        this.load.image('gameFrame', 'images/phone_game_frame.png');
        this.load.image('mainBtnBg', 'images/phone_game_btn_bg.png');
        this.load.image('cell_select', 'images/cell_select.png');
        this.load.image('closeBtn', 'images/modal_close_btn.png');
        this.load.image('historyBg', 'images/history_bg.png');
        this.load.image('limitsBg', 'images/phone_limit_bg.png');
        this.load.image('limitsSep', 'images/limit_separator.png');
        this.load.image('modalBg', 'images/modal_bg.png');
        this.load.image('pbBg', 'images/phone_factors_bg.png');
        this.load.image('btnBg', 'images/phone_game_btn_bg.png');
        this.load.image('scrollBg', 'images/scrollBg.png');
        this.load.image('bottomBtnBg', 'images/phone_bottom_btn_bg.png');
        this.load.image('limitScrollBg', 'images/limit_scroll_bg.png');
        this.load.image('cashin', 'images/cashin.png');
        this.load.spritesheet('factorsBg', 'images/factors_btn_bg.png', 188, 75);
        this.load.spritesheet('timer', 'images/timer.png', 60, 60);
        this.load.spritesheet('statusBg', 'images/status_bg.png', 1600, 61);
        this.load.spritesheet('icons', 'images/btn_icons.png', 42, 27);
        this.load.spritesheet('chips', 'images/chips.png', 85, 85);
        this.game.load.onFileComplete.add(this.updateProgressBar, this);
    },

    create: function () {
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
                self.state.start('Game');
            } else {
                setTimeout(function () {
                    startGame();
                }, 200);
            }
        }
        startGame();
    },


    updateProgressBar: function (progress) {
        var pr;

        if (progressText != undefined) {
            progressText.destroy();
        }
        $.client.setProgressBarPercent(progress);
        pr = progress + '%';
        progressText = this.add.text(this.game.world.centerX, this.game.world.centerY, pr, {
            font: "60px Arial",
            fill: "#ffffff"
        });
    }
};

DicePortraitGame.Game = function (game) {
    this.bitItems;
    this._statData;

    this.game;      //  a reference to the currently running game
    this.add;       //  used to add sprites, text, groups, etc
    this.camera;    //  a reference to the game camera
    this.cache;     //  the game cache
    this.input;     //  the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;      //  for preloading assets
    this.math;      //  lots of useful common math operations
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc
    this.stage;     //  the game stage
    this.time;      //  the clock
    this.tweens;    //  the tween manager
    this.world;     //  the game world
    this.particles; //  the particle manager
    this.physics;   //  the physics manager
    this.rnd;       //  the repeatable random number generator
};

DicePortraitGame.Game.prototype = {
    update: function () {
        this.gestures.update();
        if (cursorVisible) {
            cursorGroup.x = game.input.x - 45;
            cursorGroup.y = game.input.y - 41;
            cursorGroup.alpha = 1;
        } else {
            cursorGroup.alpha = 0;
        }
    },
    create: function () {
        var self = this;
        var bottomBetLabel, balansLabel,
             limitBtn, statsBtn, historyBtn,
             chipsEl, table;

        var cancelLastBtn, cancelAllBetBtn, repeatBetBtn;

        worldGroup = this.add.group();
        cursorGroup = this.add.group();
        worldGroup.add(tableGroup);
        this.scale.setUserScale(SCALE, SCALE);
        this.scale.refresh();
        tableGroup = this.add.group();
        chipsGroup = this.add.group();
        selectedChipsGroup = this.add.group();

        frameGroup = this.add.group();
        footerGroup = this.add.group();
        limitGroup = this.add.group();
        factorsGroup = this.add.group();

        footerGroup.add(winTextGroup);

        worldGroup.add(frameGroup);
        worldGroup.add(tableGroup);
        worldGroup.add(factorsGroup);
        worldGroup.add(chipsGroup);
        worldGroup.add(buttonGroup);
        worldGroup.add(limitGroup);
        gameFrame = this.add.sprite(0, 0, 'gameFrame');

        frameGroup.add(gameFrame);
        worldGroup.add(cursorGroup);
        for (var a = 0; a <= NUM_DIB; a++) {
            dib_cost[a] = dib_cost[a] * $.client.UserData.CurrencyMultiplier;
        }
        var name = USER_NAME ? USER_NAME.toUpperCase().length < 15 ? USER_NAME.toUpperCase() : USER_NAME.toUpperCase().substr(0, 15) + '...' : "";
        userNameText = this.add.text(40, gameFrame.height - 120, name, {
            font: "22px ProximaNova",
            fill: "#808080"
        });
        footerGroup.add(userNameText);
        balansLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("Balance", true).toUpperCase(),
            x: gameFrame.width - 282,
            y: gameFrame.height - 121,
            font: "ProximaNova",
            size: 22,
            color: "#808080",
            centered: false,
            maxHeight: 50,
            maxWidth: 120
        });
        footerGroup.add(balansLabel);

        headerBalansInputVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + USER_BALANCE,
            x: balansLabel.x + balansLabel.width + 5,
            y: gameFrame.height - 121,
            font: "ProximaNova",
            size: 22,
            color: "#e4a345",
            centered: false,
            maxHeight: 50,
            maxWidth: 100
        });
        footerGroup.add(headerBalansInputVal);
        cashierBtn = this.add.button(gameFrame.width - 34, gameFrame.height - 126, 'cashin', function () {
            $.client.cashier();
        }, this);
        cashierBtn.scale.set(0.7);
        cashierBtn.input.useHandCursor = true;
        cashierBtn.clicked = true;

        bottomBetLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("Bet", true).toUpperCase(),
            x: gameFrame.width - 467,
            y: gameFrame.height - 121,
            font: "ProximaNova",
            size: 22,
            color: "#808080",
            centered: false,
            maxHeight: 50,
            maxWidth: 100
        });
         footerGroup.add(bottomBetLabel);
         headerBetInputVal = createTextLbl(self, {
             text: $.client.UserData.CurrencySign + '0',
             x: bottomBetLabel.x + bottomBetLabel.width + 5,
             y: gameFrame.height - 121,
             font: "ProximaNova",
             size: 22,
             color: "#e4a345",
             centered: false,
             maxHeight: 50,
             maxWidth: 80
         });
         footerGroup.add(headerBetInputVal);

        tableStatus = this.add.sprite(0, gameFrame.height - 207, 'statusBg', 0);
        tableStatus.width = 750;
        frameGroup.add(tableStatus);

        infoText = createTextLbl(self, {
            text: $.client.getLocalizedString("Wait for the next open table", true).toUpperCase(),
            x: tableStatus.x + 375,
            y: tableStatus.y + 14,
            font: "ProximaNova",
            size: 32,
            color: "#fff",
            centered: true,
            maxHeight: 50,
            maxWidth: 500
        });
        frameGroup.add(infoText);

        repeatBetBtn = this.add.button(60, 935, 'mainBtnBg', this.repeatBets, this);
        repeatBetBtn.input.useHandCursor = true;
        repeatBetBtn.clicked = true;
        var repeatText =createTextLbl(self, {
            text: $.client.getLocalizedString("Repeat", true).toUpperCase(),
            x: repeatBetBtn.x + repeatBetBtn.width/2,
            y: repeatBetBtn.y + 12,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight: repeatBetBtn.height-5,
            maxWidth: repeatBetBtn.width-10
        });

      
        cancelAllBetBtn = this.add.button(250, 935, 'mainBtnBg', this.cancelAllBet, this);
        cancelAllBetBtn.input.useHandCursor = true;
        cancelAllBetBtn.clicked = true;
        cancelAllBetBtn.width = 210;
        var cancelAllText = createTextLbl(self, {
            text: $.client.getLocalizedString("Cancel all", true).toUpperCase(),
            x: cancelAllBetBtn.x + cancelAllBetBtn.width / 2,
            y: cancelAllBetBtn.y + 12,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight: cancelAllBetBtn.height - 5,
            maxWidth: cancelAllBetBtn.width - 10
        });
        cancelLastBtn = this.add.button(470, 935, 'mainBtnBg', this.cancelLastBet, this);
        cancelLastBtn.clicked = true;
        cancelLastBtn.input.useHandCursor = true;
        cancelLastBtn.width = 210;
        var cancelLastText = createTextLbl(self, {
            text: $.client.getLocalizedString("Cancel last", true).toUpperCase(),
            x: cancelLastBtn.x + cancelLastBtn.width / 2,
            y: cancelLastBtn.y + 12,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight: cancelLastBtn.height - 5,
            maxWidth: cancelLastBtn.width - 10
        });
     
        historyBtn = this.add.button(375, 1260, 'bottomBtnBg', this.showHistory, this, 1, 2);
        historyBtn.alpha = 1;
        historyBtn.input.useHandCursor = true;
        historyBtn.clicked = true;
       createTextLbl(self, {
           text: $.client.getLocalizedString("History", true).toUpperCase(),
           x: historyBtn.x + historyBtn.width / 2,
           y: historyBtn.y + 25,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight: historyBtn.height - 5,
            maxWidth: historyBtn.width - 10
        });
     
        limitBtn = this.add.button(0, 1260, 'bottomBtnBg', this.showLimits, this, 1, 1);
        limitBtn.clicked = true;
        limitBtn.alpha = 0;
        limitBtn.input.useHandCursor = true;
        limitBtnText = createTextLbl(self, {
            text: $.client.getLocalizedString("Info", true).toUpperCase(),
            x: limitBtn.x + limitBtn.width / 2,
            y: limitBtn.y + 25,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight: limitBtn.height - 5,
            maxWidth: limitBtn.width - 10
        });
        buttonGroup.add(limitBtn);
        
        provablyBtn = this.add.group();
        var provablyBtnBg = this.add.button(20, 10, 'mainBtnBg', function () {
            $.client.showProvablyFair();
        }, this);
        provablyBtnBg.clicked = false;
        provablyBtnBg.width = 180;
        provablyBtnBg.input.useHandCursor = true;
        var provablyBtnTxt = createTextLbl(self, {
            text: $.client.getLocalizedString("Provably fair", true).toUpperCase(),
            x: provablyBtnBg.x + provablyBtnBg.width / 2,
            y: provablyBtnBg.y + 12,
            font: "ProximaNova",
            size: 22,
            color: "#fff",
            centered: true,
            maxHeight: provablyBtnBg.height - 5,
            maxWidth: provablyBtnBg.width - 10
        });
        provablyBtn.btn = provablyBtnBg;
        provablyBtn.add(provablyBtnBg);
        provablyBtn.add(provablyBtnTxt);
        provablyBtn.alpha = 0;

        homeBtn = this.add.group();
        var homeBtnBg = this.add.button(630, 10, 'mainBtnBg', $.client.toHome, this);
        homeBtnBg.width = 105;
        homeBtnBg.clicked = false;
        homeBtnBg.input.useHandCursor = true;
        var homeBtnTxt = createTextLbl(self, {
            text: $.client.getLocalizedString("Home", true).toUpperCase(),
            x: homeBtnBg.x + homeBtnBg.width / 2,
            y: homeBtnBg.y + 12,
            font: "ProximaNova",
            size: 25,
            color: "#fff",
            centered: true,
            maxHeight: homeBtnBg.height - 5,
            maxWidth: homeBtnBg.width - 10
        });
        homeBtn.btn = homeBtnBg;
        homeBtn.add(homeBtnBg);
        homeBtn.add(homeBtnTxt);

        startGameBtn = this.add.group();
        var startGameBtnBg = this.add.button(285, 350, 'mainBtnBg', this.startGame, this);
        startGameBtnBg.clicked = true;
        startGameBtnBg.input.useHandCursor = true;
        var startGameBtnTxt = createTextLbl(self, {
            text: $.client.getLocalizedString("Spin", true).toUpperCase(),
            x: startGameBtnBg.x + startGameBtnBg.width / 2,
            y: startGameBtnBg.y + 27,
            font: "ProximaNova",
            size: 32,
            color: "#fff",
            centered: true,
            maxHeight: homeBtnBg.height - 5,
            maxWidth: homeBtnBg.width - 10
        });
        startGameBtnTxt.stroke = '#000000';
        startGameBtnTxt.strokeThickness = 6;
        startGameBtnTxt.anchor.set(0.5);
        var tween = self.add.tween(startGameBtnTxt).to({ fontSize: 40 }, 600, Phaser.Easing.Linear.None, true, 0, -1, true).loop(true);
        function onComplete() {
            self.add.tween(startGameBtnTxt).to({ fontSize: 32 }, 600, Phaser.Easing.Linear.None, true);
        }
        tween.onLoop.add(function () {
            startGameBtnTxt.font = 'ProximaNova';
        }, this);

        tween.onComplete.add(onComplete, this);
        startGameBtn.alpha = 0;
        startGameBtn.btn = startGameBtnBg;
        startGameBtn.add(startGameBtnBg);
        startGameBtn.add(startGameBtnTxt);
        buttonGroup.add(startGameBtn);


        for (var a = 0; a <= NUM_DIB; a++) {
            if (a == selectedChipId) {
                chipsEl = chipsGroup.create(53 + (a * 105), 1005, 'chips', a + 6);
            } else {
                chipsEl = chipsGroup.create(53 + (a * 105), 1005, 'chips', a);
            }
            chipsEl.debValue = dib_cost[a];
            chipsEl.id = a;
            chipsEl.rY = chipsEl.y;
            chipsEl.rX = chipsEl.x;
            chipsEl.scale.set(1.3);
            chipsEl.inputEnabled = true;
            chipsEl.input.useHandCursor = true;
            chipsEl.events.onInputDown.add(this.changeChips, this);
            chipsEl.chipText = this.add.text(chipsEl.x + 55, chipsEl.y + 45, dib_cost[a] > 999 ? kFormater(dib_cost[a]) : dib_cost[a], {
                font: "28px ProximaNova",
                fill: "#fff"
            });
            chipsEl.chipText.anchor.x = Math.round(chipsEl.chipText.width * 0.5) / chipsEl.chipText.width;
            chipsGroup.add(chipsEl.chipText);
        }
        chipCursor = cursorGroup.create(20, 20, 'chips', selectedChipId);
        chipCursor.width = 50;
        chipCursor.height = 50;
        chipCursor.text = this.add.text(chipCursor.x + 25, chipCursor.y + 12, dib_cost[selectedChipId], {
            font: "22px ProximaNova",
            fill: "#fff"
        });
        chipCursor.text.anchor.x = Math.round(chipCursor.text.width * 0.5) / chipCursor.text.width;
        cursorGroup.add(chipCursor);
        cursorGroup.add(chipCursor.text);
        cursorGroup.alpha = 0;
        self.changeChips({ id: selectedChipId });

        table = this.add.sprite(30, 445, 'pbBg');
        table.height=450;
        tableGroup.add(table);
        this.gestures = new GESTURE(this.game);
        var mask = game.add.graphics(30, 490);
        mask.beginFill(0xffffff);
        mask.drawRect(0, 0, 690, 360);
        mask.lineStyle(0);
        mask.endFill();
        factorsGroup.mask = mask;
        worldGroup.add(mask);
        var scroll = this.add.sprite(table.x, table.y, 'scrollBg');
        scroll.width = 690;
        scroll.height = 450;
        worldGroup.add(scroll);
        scroll.inputEnabled = false;

        tableGroup.add(table);
        var verTimeout, downTimeout;
        this.gestures.addOnSwipe(function (context, data) {
            var tween;
            if (game.criteria.length > 5) {
                if (data.direction == "up" && data.distance > 0) {
                    game.add.tween(factorsGroup).to({ x: factorsGroup.x, y: factorsGroup.y - data.distance }, 10, Phaser.Easing.Linear.None, true, 0, 0, false);

                } else if (data.direction == "down" && data.distance > 0) {
                    game.add.tween(factorsGroup).to({ x: factorsGroup.x, y: factorsGroup.y + data.distance }, 10, Phaser.Easing.Linear.None, true, 0, 0, false);
                }
                clearTimeout(verTimeout);
                if (factorsGroup.y > 0) {
                    verTimeout = setTimeout(function () {
                        tween = game.add.tween(factorsGroup).to({ x: factorsGroup.x, y: 0 }, 50, Phaser.Easing.Linear.None, true, 0, 0, false);
                    }, 100);
                }
                clearTimeout(downTimeout);
                if (factorsGroup.height < (table.height - factorsGroup.y)) {
                    downTimeout = setTimeout(function () {
                        tween = game.add.tween(factorsGroup).to({ x: factorsGroup.x, y: (table.height - factorsGroup.height) * 2 }, 50, Phaser.Easing.Linear.None, true, 0, 0, false);
                    }, 100);
                }
            }
        }, scroll);
        window.addEventListener('resize', function () {
            setTimeout(function () {
                self.changeGameSize();
            }, 500);
        });
        setInterval(function () {
            self.changeGameSize();
        }, 1000);
        self.changeGameSize();
        this.showFactors();
        this.validateChips();
        self.ready = true;

    },
    changeGameSize:function() {
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
                for (var childId in chipsGroup.children) {
                    var chip = chipsGroup.children[childId];
                    if (chip.key === "chips") {
                        if (wScale < hScale) {
                            chip.scale.set(1.3 + sDif / 2, 1.3 - sDif / 2);
                            chip.x = chip.rX - Math.abs(chip.width - chip.width * (1 + sDif / 4));
                            var sCoff = 0;
                            if (chip.id == selectedChipId) {
                                sCoff = 10;
                            }
                            chip.y = chip.rY - sCoff + Math.abs(chip.height - chip.height * (1 + sDif / 4));
                        } else {
                            chip.scale.set(1.3 - sDif / 2, 1.3 + sDif / 2);
                            var sCoff = 0;
                            if (chip.id == selectedChipId) {
                                sCoff = 10;
                            }
                            chip.x = chip.rX + Math.abs(chip.width - chip.width * (1 + sDif / 4));
                            chip.y = chip.rY - sCoff - Math.abs(chip.height - chip.height * (1 + sDif / 4));
                        }
                    }
                }
                game.scale.refresh();
                setTimeout(function () {
                    changeVideoSize();
                }, 500);
},
    startGame: function () {
        var self = this;
        if (!isSubmiting) {
            isSubmiting = true;
            if ($.client.UserData.Features && $.client.UserData.Features.provably_fair) {
                $.client.sendSeed(function (responce) {
                    if (responce.IsSuccess) {
                        $.client.sendPost(JSON.stringify({
                            type: "start_game"
                        }), function (res) {
                            if (res.IsSuccess && res.ResponseData.success) {
                                startGameBtn.alpha = 0;
                                startGameBtn.btn.inputEnabled = false;
                            }
                            isSubmiting = false;
                        }, function (err) {
                            console.log(err);
                            isSubmiting = false;
                        });
                    }
                    isSubmiting = false;
                }, function (err) {
                    console.log(err);
                    isSubmiting = false;
                });
            } else {
                $.client.sendPost(JSON.stringify({
                    type: "start_game"
                }), function (res) {
                    if (res.IsSuccess && res.ResponseData.success) {
                        startGameBtn.alpha = 0;
                        startGameBtn.btn.inputEnabled = false;
                    }
                    isSubmiting = false;
                }, function (err) {
                    console.log(err);
                    isSubmiting = false;
                });
            }
        }
    },

    restartGame: function () {
        startGameBtn.btn.inputEnabled = true;
        startGameBtn.alpha = 1;
        if ($.client.UserData.Features && $.client.UserData.Features.provably_fair) {
            provablyBtn.btn.inputEnabled = true;
            provablyBtn.alpha = 1;
        } else {
            provablyBtn.btn.inputEnabled = false;
            provablyBtn.alpha = 0;
        }
    },
    betOver: function (element) {
        if (!MessageDispatcher.isTableOpen) {
            element.alpha = 0.1;
        }
    },
    betOut: function (element) {
        element.alpha = 0;
    },
    betClick: function (element) {
        var self = this;
        var amountDeb = dib_cost[selectedChipId];
        Bets = {};
        Bets.type = element.type;
        Bets.amount = amountDeb;
        element.alpha = 0;
        element.bet_amount = amountDeb;
        element.bets = Bets;
        this.makeBet(element);
    },
    showFactors: function () {
        var self = this;
        if (!game.criteria) {
            setTimeout(function () {
                self.showFactors();
            }, 200);
            return;
        }
        factorsGroup.removeAll(true, true);
        for (var a = 0; a < game.criteria.length; a++) {
            var crit = game.criteria[a];
            var factorGroup = this.add.group();
            var factor = factorsGroup.create(60, 495 + (a * 85), 'factorsBg', 0);
            if (game.criteria.length > 5) {
                tableGroup.create(390, 490, 'icons', 0).angle = 180;
                tableGroup.create(335, 852, 'icons', 0);
            }
            factor.swipedDistance = 0;
            factor.width = 630;
     
            this.gestures.addOnTap(function (context, data) {
                if (game.input.y > 490 && game.input.y < 850)
                self.makeBet(context);
            }, factor);

            factor.id = a;
            factor.value = crit;
            factor.id = a;
            factorGroup.Id = crit.Id;
            factor.inputEnabled = true;
            factor.amount = 0;
            factor.amountText = this.add.text(factor.x + 315, factor.y + 15, '{1}{0}'.format(factor.amount, $.client.UserData.CurrencySign), {
                font: "36px ProximaNova",
                fill: "#878787"
            });
            factorGroup.add(factor);
            factorGroup.add(factor.amountText);

            factor.winRate = this.add.text(factor.x +590, factor.y + 15, 'x{0}'.format(crit.WinRate), {
                font: "36px ProximaNova",
                fill: "#878787"
            });
            factor.winRate.x = factor.winRate.x - factor.winRate.width;
            factorGroup.add(factor.winRate);

            factor.description = this.add.text(factor.x + 285, factor.y + 15, crit.Title, {
                font: "36px ProximaNova",
                fill: "#fff"
            });
            factor.description.x = factor.description.x - factor.description.width;
            factorGroup.add(factor.description);
            factorGroups.push(factor);
            factorsGroup.add(factorGroup);
        }
    },
    getAmountDeb: function () {
        return dib_cost[selectedChipId];
    },
    cancelAllBet: function (element) {
        var self = this;
            if (tableChips.length > 0) {
                $.client.sendPost(JSON.stringify({
                    type: "cancel_all"
                }), function (responce) {
                    if (responce.IsSuccess) {
                        if (responce.ResponseData.success) {
                            summaDeb = 0;
                            headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
                            USER_BALANCE = responce.ResponseData.balance;
                            headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                            self.changeStatus($.client.getLocalizedString('Bets canceled', true).toUpperCase(), 0, false, 2000);
                            self.resetTable();
                            tableChips = [];
                            previousBetChips = [];
                        }
                    }
                }, function (err) {
                    console.log(err);
                });
            }
    },
    cancelLastBet: function (element) {
        var self = this;
        function cancel(cancelBet) {
            $.client.sendPost(JSON.stringify({
                type: "cancel_last",
                bet: cancelBet.bet
            }), function (responce) {
                if (responce.IsSuccess) {
                    if (responce.ResponseData.success) {
                        var chip = tableChips.pop();
                        var context = chip.context;
                        var amount = chip.bet.amount;
                        context.amount = context.amount - amount;
                        amount = !!(context.amount % 1) ? parseFloat(context.amount).toFixed(2) : context.amount;
                        context.amountText.setText('{0}{1}'.format(kFormater(amount, 1) + "", $.client.UserData.CurrencySign));
                        if (amount > 0) {
                            self.changeFactorState(context, stakeStatus.ACCEPTED);
                        } else {
                            self.changeFactorState(context, stakeStatus.CANCELED);
                        }
                        if (summaDeb > 0) {
                            summaDeb = parseFloat(summaDeb - chip.bet.amount).toFixed(2);
                            headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
                        } else {
                            summaDeb = 0;
                        }
                        USER_BALANCE = responce.ResponseData.balance;
                        headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                        self.changeStatus($.client.getLocalizedString('Bet canceled', true).toUpperCase(), 0, false, 2000);
                    }
                }
            }, function (err) {
                console.log(err);
            });
        }
        if (tableChips.length > 0) {
            var cancelBet;
            for (var i = 0; i < previousBetChips[previousBetChips.length - 1].length; i++) {
                cancelBet = previousBetChips[previousBetChips.length - 1][i];
                if (cancelBet.bet) {
                    cancel(cancelBet);
                }
            }
            previousBetChips.splice(previousBetChips.length - 1, 1);
        }
    },
    saveRoundBet: function () {
        if (previousBetChips.length > 0) {
            roundBetChips = previousBetChips.slice(0);
        }
        previousBetChips = [];
    }, clearLastBet: function (element) {
        if (MessageDispatcher.isTableOpen) {
            if (tableChips.length > 0 && !tableChips[tableChips.length - 1]['sent']) {
                var bet = tableChips.pop();
                var chip = bet.chip;
                chip.destroy();

                if (summaDeb > 0) {
                    summaDeb = parseFloat(summaDeb - bet.amount).toFixed(2);
                    headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());

                }
                else {
                    summaDeb = 0;
                }
            }
        }
    },
    repeatBets: function (element) {
        var self = this;
        if (MessageDispatcher.isTableOpen) {
            if (roundBetChips.length > 0) {
                for (var i = 0; i < roundBetChips.length; i++) {
                    for (var j = 0; j < roundBetChips[i].length; j++) {
                        var pBet = roundBetChips[i][j];
                        var stake = pBet.bet;
                        var amount = parseFloat(stake.amount);
                        var validateObj = self.checkLimit(pBet.context, amount);
                        if (validateObj.state) {
                            pBet.context.loadTexture(pBet.context.key, 1);
                            $.each(validateObj.chips, function (j, chipId) {
                                var context = pBet.context;
                                var bet = { Id: context.value.Id, criteria: context.value, amount: amount };
                                tableChips.push({ bet: bet, context: context });
                                $.client.sendPost(JSON.stringify({
                                    type: "stake",
                                    factor: bet
                                }), function (responce) {
                                    if (responce.IsSuccess && responce.ResponseData.success) {
                                        context.amount = context.amount + bet.amount;
                                        var fAmount = !!(context.amount % 1) ? parseFloat(context.amount).toFixed(2) : context.amount;
                                        fAmount = (fAmount > 999 ? kFormater(fAmount, 1) : fAmount);
                                        context.amountText.setText('{0}{1}'.format(fAmount + "", $.client.UserData.CurrencySign));
                                        self.changeFactorState(context, stakeStatus.ACCEPTED);
                                        summaDeb = parseFloat(summaDeb) + parseFloat(bet.amount);
                                        summaDeb = parseFloat(summaDeb).toFixed(2);
                                        headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
                                        USER_BALANCE = responce.ResponseData.balance;
                                        headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                                        previousBetChips.push([{ bet: bet, context: context }]);
                                    } else {
                                        setTimeout(function () {
                                            if (context.amount > 0) {
                                                self.changeFactorState(context, stakeStatus.ACCEPTED);
                                            } else {
                                                self.changeFactorState(context, stakeStatus.COMPLETED);
                                            }
                                        }, 2000);
                                        self.changeFactorState(context, stakeStatus.ACCEPTED);
                                    }
                                }, function (err) {
                                    self.changeFactorState(context, stakeStatus.REJECTED);
                                    setTimeout(function () {
                                        if (context.amount > 0) {
                                            self.changeFactorState(context, stakeStatus.ACCEPTED);
                                        } else {
                                            self.changeFactorState(context, stakeStatus.COMPLETED);
                                        }
                                    }, 2000);
                                    console.log(err);
                                });
                            });
                        }
                    }

                }
            }
        }
    },
    checkLimit: function (context,amount){
        var validAmount = 0, totalAmount,errText, cellTotalAmount;
        var valid = true;
        var self = this;
        cellTotalAmount = amount;
        totalAmount = amount;

        for (var i = 0; i < tableChips.length; i++) {
            totalAmount += tableChips[i].bet.amount;
            if (tableChips[i].context.id == context.id) {
                cellTotalAmount += tableChips[i].bet.amount;
            }
        }
        function formatLimitAmount(amount) {
            if (amount > 9999) {
                return kFormater(amount);
            } else {
                return amount % 1 == 0 ? parseFloat(amount).toFixed(0) : parseFloat(amount).toFixed(1);
            }
        }
        if (totalAmount > parseFloat(USER_BALANCE)) {
            errText=$.client.getLocalizedString('TEXT_ERROR_NO_MONEY_MSG', true);
            validAmount = USER_BALANCE - totalAmount;
            valid = false;
        } else if (totalAmount > game.config.MaxBet) {
            errText=$.client.getLocalizedString('Table_limits', true, { min: formatLimitAmount(game.config.MinBet), max: formatLimitAmount(game.config.MaxBet), sign: $.client.UserData.CurrencySign }).toUpperCase();
            validAmount = game.config.MaxBet - (totalAmount - amount);
            valid = false;
        } else if (totalAmount < game.config.MinBet) {
            errText=$.client.getLocalizedString('Table_limits', true, { min: formatLimitAmount(game.config.MinBet), max: formatLimitAmount(game.config.MaxBet), sign: $.client.UserData.CurrencySign }).toUpperCase();
            valid = false;
        }else{
            if (cellTotalAmount > context.value.MaxBet) {
                errText=$.client.getLocalizedString('Bet limits', true, { min: formatLimitAmount(context.value.MinBet), max: formatLimitAmount(context.value.MaxBet), sign: $.client.UserData.CurrencySign }).toUpperCase();
                validAmount = context.value.MaxBet - (cellTotalAmount - amount);
                valid = false;
            } else if (cellTotalAmount < context.value.MinBet) {
                errText=$.client.getLocalizedString('Bet limits', true, { min:formatLimitAmount( context.value.MinBet), max: formatLimitAmount(context.value.MaxBet), sign: $.client.UserData.CurrencySign }).toUpperCase();
                valid = false;
            }
        }
        var chips=[];
        function getChip(needAmount) {
            var chipId=-1;
            $.grep(dib_cost, function (item, i) {
                if (item <= needAmount) {
                    chipId = parseInt(i);
                    return true;
                }
                return false;
            });
            if (chipId != -1) {
                chips.push(chipId);
                if ((needAmount - dib_cost[chipId]) != 0) {
                    getChip((needAmount - dib_cost[chipId]).toFixed(1));
                }
            }
            return chips;
        }

        if (validAmount > 0) {
            valid = true;
            getChip(validAmount);
        } else {
            chips.push(selectedChipId);
        }
        if (errText) {
            if (valid) {
                var sum = 0;
                for (var i = chips.length; i--;) {
                    sum += dib_cost[chips[i]];
                }
                errText = $.client.getLocalizedString('Bet adjusted to', true, { sum: formatLimitAmount(sum), sign: $.client.UserData.CurrencySign });
            }
            self.changeStatus(errText.toUpperCase(), 0, false, 2000);
        }
        return { state: valid && chips.length>0, chips: chips };
    },
    makeBet: function (context) {
        var self = this, amount;
        if (MessageDispatcher.isTableOpen) {
            var validateObj = self.checkLimit(context, self.getAmountDeb());
            if (validateObj.state) {
                self.changeFactorState(context, stakeStatus.PENDING);
                $.each(validateObj.chips, function (i, chipId) {
                    amount = dib_cost[chipId];
                    var bet = { Id: context.value.Id, criteria: context.value, amount: amount };
                    tableChips.push({ bet: bet, context: context });
                    $.client.sendPost(JSON.stringify({
                        type: "stake",
                        factor: bet
                    }), function (responce) {
                        if (responce.IsSuccess && responce.ResponseData.success) {
                            amount = dib_cost[chipId];
                            context.amount = parseFloat(context.amount) + parseFloat(amount);
                            var betAmount = !!(context.amount % 1) ? parseFloat(context.amount).toFixed(2) : context.amount;
                            betAmount = (betAmount > 999 ? kFormater(betAmount,1) : betAmount);
                            context.amountText.setText('{0}{1}'.format(betAmount + "", $.client.UserData.CurrencySign));
                            self.changeFactorState(context, stakeStatus.ACCEPTED);
                            summaDeb = parseFloat(summaDeb) + parseFloat(dib_cost[chipId]);
                            summaDeb = parseFloat(summaDeb).toFixed(2);
                            headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
                            USER_BALANCE = responce.ResponseData.balance;
                            headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                            previousBetChips.push([{ bet: bet, context: context }]);

                        } else {
                            self.changeFactorState(context, stakeStatus.REJECTED);
                            setTimeout(function () {
                                if (context.amount > 0) {
                                    self.changeFactorState(context, stakeStatus.ACCEPTED);
                                } else {
                                    self.changeFactorState(context, stakeStatus.COMPLETED);
                                }
                            }, 2000);
                        }
                    }, function (err) {
                        self.changeFactorState(context, stakeStatus.REJECTED);
                        setTimeout(function () {
                            if (context.amount > 0) {
                                self.changeFactorState(context, stakeStatus.ACCEPTED);
                            } else {
                                self.changeFactorState(context, stakeStatus.COMPLETED);
                            }
                        }, 2000);
                        console.log(err);
                    });
                });
            }
        }
    },
    drawBetsChip: function (bets) {
        var self = this, context = {}, chipId = 0, betAmount = 0;
        if (factorsGroup.children.length < 1) {
            setTimeout(function () {
                self.drawBetsChip(bets);
            }, 200);
            return;
        }
        if (bets.stake) {
            previousBetChips = [];
            summaDeb = 0;
            for (var i in bets.stake.factors) {
                var factor = bets.stake.factors[i];
                for (var j in factorsGroup.children) {
                    if (factorsGroup.children[j].Id === factor.Id)
                        context = factorsGroup.children[j].children[0];
                }
                context.amount = parseFloat(context.amount) + parseFloat(factor.amount);
                betAmount = !!(context.amount % 1) ? parseFloat(context.amount).toFixed(2) : parseInt(context.amount);
                summaDeb += parseFloat(betAmount);
                betAmount = (betAmount > 999 ? kFormater(betAmount,1) : betAmount);
                context.amountText.setText('{0}{1}'.format(betAmount + "", $.client.UserData.CurrencySign));
                self.changeFactorState(context, stakeStatus.ACCEPTED);
                tableChips.push({ bet: factor, context: context });
                previousBetChips.push([{ bet: factor, context: context }]);
            }
            if (headerBetInputVal !== undefined) {
                headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
            }
        }
    },

    validateChips: function () {
        var self = this, prevDissabled;
        if (!game.criteria) {
            setTimeout(function () {
                self.validateChips();
            }, 200);
            return;
        }

        function isValidChip(value, criteria) {
            var valid = false;
            criteria.forEach(function (crit) {
                if (value >= crit.MinBet) {
                    valid = true;
                }
            });
        }

        chipsGroup.forEach(function (item) {
            if (item.key == "chips") {
                if (dib_cost[item.id] < game.config.MinBet || isValidChip(dib_cost[item.id], game.criteria)) {
                    item.tint = 0x808080;
                    prevDissabled = true;
                    item.inputEnabled = false;
                    item.input.useHandCursor = false;
                    item.visible = false;
                    item.chipText.visible = false;
                } else {
                    if (item.id && prevDissabled) {
                        prevDissabled = false;
                        self.changeChips(item);
                    }
                }
            }
        });
    },
    changeChips: function (element) {
        selectedChipId = element.id;
        var wScale = $(window).innerWidth() / GAME_WIDTH;
        var hScale = $(window).innerHeight() / GAME_HEIGHT;
        var sDif = Math.abs(wScale - hScale);
        chipsGroup.forEach(function (item) {
            if (item.key == "chips") {
                if (wScale < hScale) {
                    var sCoff = 0;
                    if (item.id == selectedChipId) {
                        sCoff = 10;
                    }
                    item.y = item.rY - sCoff + Math.abs(item.height - item.height * (1 + sDif / 4));
                } else {
                    var sCoff = 0;
                    if (item.id == selectedChipId) {
                        sCoff = 10;
                    }
                    item.y = item.rY - sCoff - Math.abs(item.height - item.height * (1 + sDif / 4));
                }
                if (item.id == selectedChipId) {
                    item.chipText.y = item.rY + 28;
                    item.loadTexture(item.key, item.id + 6);
                } else {
                    item.chipText.y = item.rY + 38;
                    item.loadTexture(item.key, item.id);
                }
            }
        });
        chipCursor.loadTexture("chips", selectedChipId);
        chipCursor.text.setText(dib_cost[selectedChipId]);
        this.changeGameSize();
    },
    showLimits: function () {
        var limitTitleText, limitList;
        var modalBg, cancelBtn;
        var self = this;
        if (!isModalShow) {
            if (game.config) {
                isModalShow = true;
                limitPopup = this.add.group();
                limitList = this.add.group();
                modalBg = this.add.button(0, 0, "modalBg", null, true);
                modalBg.useHandCursor = false;
                modalBg.height = 1375;
                limitPopup.add(modalBg);
                var limitBox = this.add.sprite(0, 220, 'limitsBg');
                limitBox.height = 800;
                limitBox.width = 750;
                limitPopup.add(limitBox);
                limitPopup.add(limitList);
                cancelBtn = this.add.button(695, 235, 'closeBtn', this.closelimitPopup, this);
                cancelBtn.useHandCursor = true;
                limitPopup.addChild(cancelBtn);
                if ($.client.UserData.Features && $.client.UserData.Features.rules) {
                var rulesBtn = this.add.button(500, 235, 'mainBtnBg', function () {
                        $.client.showRules();
                    }, this);
                    limitPopup.add(rulesBtn);
                    rulesBtn.height = 40;
                    rulesBtn.width = 160;
                    var rulesText = createTextLbl(self, {
                        text: $.client.getLocalizedString("Rules", true).toUpperCase(),
                        x: rulesBtn.width / 2 + rulesBtn.x,
                        y: rulesBtn.y+11,
                        font: "ProximaNova",
                        size: 22,
                        color: "#fff",
                        centered: true,
                        maxHeight: rulesBtn.height-5,
                        maxWidth: rulesBtn.width-10
                    });
                    rulesText.anchor.x = Math.round(rulesText.width * 0.5) / rulesText.width;
                    limitPopup.add(rulesText);
                    rulesBtn.clicked = true;
                    rulesBtn.input.useHandCursor = true;
                }

 
                limitTitleText = createTextLbl(self, {
                    text: $.client.getLocalizedString("BET INFO", true).toUpperCase(),
                    x: 30,
                    y: 260,
                    font: "ProximaNova",
                    size: 32,
                    color: "#fff",
                    centered: false,
                    maxHeight: 50,
                    maxWidth: 120
                });
                limitPopup.addChild(limitTitleText);
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Bet name", true).toUpperCase(),
                    x: 160,
                    y: 330,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: true,
                    wordWrapWidth: 100,
                    maxHeight: 50,
                    maxWidth: 120
                }));
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Min bet", true).toUpperCase(),
                    x: 330,
                    y: 330,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: true,
                    wordWrapWidth: 100,
                    maxHeight: 50,
                    maxWidth: 110
                }));
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Max bet", true).toUpperCase(),
                    x: 465,
                    y: 330,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: true,
                    wordWrapWidth: 100,
                    maxHeight: 50,
                    maxWidth: 110
                }));
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Pays", true).toUpperCase(),
                    x: 585,
                    y: 330,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: true,
                    wordWrapWidth: 100,
                    maxHeight: 50,
                    maxWidth: 110
                }));
                function showLimitRow(x, y, limit) {
                   var name= limitList.addChild(self.add.text(x+50, y, limit.name.toUpperCase(), {
                        font: "28px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                   name.anchor.x = Math.round(name.width * 0.5) / name.width;
                    var min = parseFloat(limit.min) % 1 == 0 ? parseFloat(limit.min).toFixed(0) : limit.min.replace(',', '.');
                    min = min > 9999 ? kFormater(min) : min;
                    var minLbl = limitList.addChild(self.add.text(x + 217, y, min, {
                        font: "28px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    minLbl.anchor.x = Math.round(minLbl.width * 0.5) / minLbl.width;
                    var max = parseFloat(limit.max) % 1 == 0 ? parseFloat(limit.max).toFixed(0) : limit.max.replace(',', '.');
                    max = max > 9999 ? kFormater(max) : max;
                    var maxLbl = limitList.addChild(self.add.text(x + 350, y, max, {
                        font: "28px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    maxLbl.anchor.x = Math.round(maxLbl.width * 0.5) / maxLbl.width;
                    if (limit.winRate) {
                        var winRateLbl = limitList.addChild(self.add.text(x + 430, y, limit.winRate + ': 1', {
                            font: "28px ProximaNova",
                            fill: "#fff",
                            align: "center"
                        }));
                        winRateLbl.anchor.x = Math.round(winRateLbl.width * 0.5) / winRateLbl.width;
                    }
                }
                if (game.criteria.length > 6) {
                    limitPopup.create(410, 380, 'icons', 0).angle = 180;
                    limitPopup.create(355, 970, 'icons', 0);
                }
                var i = 0;
                for (i in game.config.Criteria) {
                    var crit = game.config.Criteria[i];
                    limitList.create(100, 360 + i * 77, 'limitsSep');
                    showLimitRow(110, 390 + i * 77, {
                        name: crit.Title,
                        min: crit.MinBet + '',
                        max: crit.MaxBet + '',
                        winRate: crit.WinRate+''
                    });
                }
                i++;
                limitList.create(100, 360 + i * 77, 'limitsSep');
                showLimitRow(110, 390 + i * 77, {
                    name: $.client.getLocalizedString('Table limits', true),
                    min: game.config.MinBet + '',
                    max: game.config.MaxBet + ''
                });

                var mask = game.add.graphics(60, 380);
                mask.beginFill(0xffffff);
                mask.drawRect(0, 0, 600, 587);
                mask.lineStyle(0);
                mask.endFill();
                limitList.mask = mask;
                limitPopup.add(mask);

                var scroll = this.add.sprite(limitBox.x, limitBox.y, 'limitScrollBg');
                worldGroup.add(scroll);
                scroll.inputEnabled = false;

                var verTimeout, downTimeout;
                this.gestures.addOnSwipe(function (context, data) {
                    var tween;
                    if (game.criteria.length > 6) {
                        if (data.direction == "up" && data.distance > 0) {
                            game.add.tween(limitList).to({ x: limitList.x, y: limitList.y - data.distance }, 10, Phaser.Easing.Linear.None, true, 0, 0, false);

                        } else if (data.direction == "down" && data.distance > 0) {
                            game.add.tween(limitList).to({ x: limitList.x, y: limitList.y + data.distance }, 10, Phaser.Easing.Linear.None, true, 0, 0, false);
                        }
                        clearTimeout(verTimeout);
                        if (limitList.y >= 0) {
                            verTimeout = setTimeout(function () {
                                tween = game.add.tween(limitList).to({ x: limitList.x, y: 0 }, 50, Phaser.Easing.Linear.None, true, 0, 0, false);
                            }, 100);
                        } else {
                            clearTimeout(downTimeout);
                            if (limitList.height < (limitBox.height - limitList.y)) {
                                downTimeout = setTimeout(function () {
                                    tween = game.add.tween(limitList).to({ x: limitList.x, y: ((limitBox.height - limitList.height)*-1) }, 50, Phaser.Easing.Linear.None, true, 0, 0, false);
                                }, 100);
                            }
                        }
                    }
                }, scroll);

            }
        }
    },
    selectLimitBtn: function (btn) {
        if (limitGroup.length > 0) {
            limitGroup.forEach(function (item) {
                if (item.key === "limitBtnBg") {
                    item.setFrames(1, 0);
                }
            });
        }

        btn.setFrames(1, 1, 1);
    },
    confirmLimit: function (element) {
        var self = this;
        $.client.sendPost(JSON.stringify({
            type: "put_limits",
            limits: selectedLimits
        }), function (responce) {
            if (responce.IsSuccess) {
                TABLE_MIN_BET = parseFloat(selectedLimits["Table"].Min);
                TABLE_MAX_BET = parseFloat(selectedLimits["Table"].Max);
                PUNTO_MIN_BET = parseFloat(selectedLimits["Player"].Min);
                PUNTO_MAX_BET = parseFloat(selectedLimits["Player"].Max);
                TIE_MIN_BET = parseFloat(selectedLimits["Tie"].Min);
                TIE_MAX_BET = parseFloat(selectedLimits["Tie"].Max);
                BANCO_MIN_BET = parseFloat(selectedLimits["Banker"].Min);
                BANCO_MAX_BET = parseFloat(selectedLimits["Banker"].Max);
                self.closelimitPopup();
            }
        }, function (err) {
            console.log(err);
        });
    },
    closelimitPopup: function () {
        isModalShow = false;

        if ((limitPopupTween && limitPopupTween.isRunning)) {
            return;
        }

        limitPopupTween = this.add.tween(limitPopup).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
        limitPopup.destroy();
        tableGroup.setAll('inputEnabled', true);
        buttonGroup.setAll('clicked', true);
    },
    showHistory: function (element) {
        var self = this;
        var statTitleText, modalBg, cancelBtn, winLbl, betLbl, resultLbl;
        if (!isModalShow) {
            if (_videoFlagShow) {
                self.showVideo();
            }
            isModalShow = true;
            historyPopup = this.add.group();
            historyPopup.clicked = false;;
            modalBg = this.add.button(0, 0, "modalBg", null, true);
            modalBg.useHandCursor = false;
            modalBg.height = 1350;
            historyPopup.add(modalBg);
            var historyBox = this.add.sprite(210, 350, 'historyBg');
            historyPopup.add(historyBox);
            cancelBtn = this.add.button(500, 360, 'closeBtn', this.closeHistoryPopup, this);
            cancelBtn.useHandCursor = true;
            historyPopup.addChild(cancelBtn);
            var totalLost = createTextLbl(self, {
                text: $.client.getLocalizedString("Total lost", true),
                x: 260,
                y: 770,
                font: "ProximaNova",
                size: 20,
                color: "#878787",
                centered: false,
                maxHeight: 60,
                maxWidth: 250
            });
            var totalLostVal = createTextLbl(self, {
                text: $.client.UserData.CurrencySign + (TOTAL_LOST > 99999 ? kFormater(TOTAL_LOST) : parseFloat(TOTAL_LOST).toFixed(2)),
                x: totalLost.x + totalLost.width + 15,
                y: 770,
                font: "ProximaNova",
                size: 20,
                color: "#878787",
                centered: false,
                maxHeight: 60,
                maxWidth: 100
            });
            historyPopup.addChild(totalLost);
            historyPopup.addChild(totalLostVal);

            statTitleText = createTextLbl(self, {
                text: $.client.getLocalizedString('History', true).toUpperCase(),
                x: 240,
                y: 390,
                font: "ProximaNova",
                size: 24,
                color: "#fff",
                centered: false,
                maxHeight: 60,
                maxWidth: 100
            });
            resultLbl = createTextLbl(self, {
                text: $.client.getLocalizedString('Result', true).toUpperCase(),
                x: 290,
                y: 440,
                font: "ProximaNova",
                size: 18,
                color: "#878787",
                centered: true,
                maxHeight: 60,
                maxWidth: 100
            });
            betLbl = createTextLbl(self, {
                text: $.client.getLocalizedString('Bet', true).toUpperCase(),
                x: 385,
                y: 440,
                font: "ProximaNova",
                size: 18,
                color: "#878787",
                centered: true,
                maxHeight: 60,
                maxWidth: 100
            });
            winLbl = createTextLbl(self, {
                text: $.client.getLocalizedString('Win', true).toUpperCase(),
                x: 475,
                y: 440,
                font: "ProximaNova",
                size: 18,
                color: "#878787",
                centered: true,
                maxHeight: 60,
                maxWidth: 100
            });
            historyPopup.addChild(statTitleText);
            historyPopup.addChild(winLbl);
            historyPopup.addChild(betLbl);
            historyPopup.addChild(resultLbl);

            function showRow(item, posX, posY) {
                var winnerText, betText, winText;
                winnerText = self.add.text(posX, posY + 14, item.winner, { font: "18px ProximaNova", fill: "#fff", align: "center" });
                historyPopup.addChild(winnerText);
                var betAmount = item.betAmount % 1 == 0 ? parseFloat(item.betAmount).toFixed(0) : parseFloat(item.betAmount).toFixed(2);
                betAmount = betAmount > 9999 ? kFormater(betAmount) : betAmount;
                betText = self.add.text(posX + 105, posY + 13, $.client.UserData.CurrencySign + betAmount, { font: "18px ProximaNova", fill: "#fff", align: "center" });
                betText.anchor.x = Math.round(betText.width * 0.5) / betText.width;
                historyPopup.addChild(betText);
                var winAmount = item.winAmount % 1 == 0 ? parseFloat(item.winAmount).toFixed(0) : parseFloat(item.winAmount).toFixed(2);
                winAmount = winAmount > 9999 ? kFormater(winAmount) : winAmount;
                winText = self.add.text(posX + 195, posY + 13, $.client.UserData.CurrencySign + winAmount, { font: "18px ProximaNova", fill: "#fff", align: "center" });
                winText.anchor.x = Math.round(winText.width * 0.5) / winText.width;
                historyPopup.addChild(winText);
            }
            var k = 0;
            for (var i = betHistory.length - 1; i >= 0; i--) {
                showRow(betHistory[i], 270, 480 + k * 72);
                k++;
            }
            tableGroup.setAll('inputEnabled', false);
            buttonGroup.setAll('clicked', false);
            historyPopup.scale.set(1.5);
            historyPopup.x = -200;
            historyPopup.y = -300;
        }
    },
    closeHistoryPopup: function () {
        historyPopup.destroy();
        isModalShow = false;
        tableGroup.setAll('inputEnabled', true);
        buttonGroup.setAll('clicked', true);
    },
    createTimer: function (totalTime, endCallback, updateCallback) {
        var timer;
        timerSprite.totalTime = totalTime;
        timerSprite.time = totalTime;
        timerSprite.endCallback = endCallback;
        timerSprite.updateCallback = updateCallback;
        timerSprite.bg = frameGroup.create(10, 1131, 'timer', 0);
        timerSprite.bg.scale.set(0.9);
        timerSprite.text = this.add.text(timerSprite.bg.x + 27, timerSprite.bg.y + 14, totalTime, {
            font: "22px ProximaNova",
            fill: "#fff"
        });
        timerSprite.text.anchor.x = Math.round(timerSprite.text.width * 0.5) / timerSprite.text.width;
        timerSprite.update = function (time) {
            if (time > 0) {
                timerSprite.bg.alpha = 1;
                var spriteId = 35 - parseInt(35 / 100 * (time / (timerSprite.totalTime / 100)));
                if (spriteId < 35) {
                    timerSprite.bg.loadTexture('timer', spriteId);
                }
                if (timerSprite.updateCallback)
                    timerSprite.updateCallback(time);
                timerSprite.text.setText(time);
            } else {
                timerSprite.bg.alpha = 0;
                timerSprite.text.setText('');
                if (timerSprite.endCallback)
                    timerSprite.endCallback();
                clearInterval(timer);
            }
        };
        timerSprite.stop = function () {
            timerSprite.bg.alpha = 0;
            timerSprite.text.setText('');
            timerSprite.totalTime = 0;
            clearInterval(timer);
        };
        timerSprite.start = function (time, end, update) {
            timerSprite.endCallback = end;
            timerSprite.updateCallback = update;
            timerSprite.totalTime = time;
            timerSprite.time = time;
            timerSprite.update(timerSprite.time);
            timer = setInterval(function () {
                timerSprite.time--;
                timerSprite.update(timerSprite.time);
            }, 1000);
        };
        timerSprite.start(timerSprite.time, timerSprite.endCallback, timerSprite.updateCallback);
        return timerSprite;
    },
    animateWinFactors: function (factors) {
        for (var i = 0; i < factors.length; i++) {
            var factor;
            for (var j = 0; j < factorGroups.length; j++) {
                if (factorGroups[j].value.Id == factors[i].Id) {
                    factor = factorGroups[j];
                    var tween = game.add.tween(factor).to({ width: factor.width + 50, x: factor.x - 25 }, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
                    tween.onComplete.add(function () {
                        setTimeout(function() {
                            game.add.tween(factor).to({ width: factor.width - 50, x: factor.x + 25 }, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
                        },2500);
                    }, this);
                }
            }
        }
    },
    changeFactorState: function (context, state) {
        context.state = state;
        switch (state) {
            case stakeStatus.COMPLETED:
                context.loadTexture(context.key, 0);
                context.amountText.fill = "#878787";
                break;
            case stakeStatus.CANCELED:
                context.loadTexture(context.key, 0);
                context.amountText.fill = "#878787";
                break;
            case stakeStatus.PENDING:
                context.loadTexture(context.key, 1);
                context.amountText.fill = "#878787";
                break;
            case stakeStatus.ACCEPTED:
                context.loadTexture(context.key, 2);
                context.amountText.fill = "#ffffff";
                break;
            case stakeStatus.REJECTED:
                context.loadTexture(context.key, 3);
                context.amountText.fill = "#ffffff";
                break;
        }
    },
    resetTable: function () {
        for (var i = 0; i < tableChips.length; i++) {
            var context = tableChips[i].context;
            context.amount = 0;
            context.amountText.setText('{0}{1}'.format(0 + "", $.client.UserData.CurrencySign));
            game.state.states.Game.changeFactorState(context, stakeStatus.COMPLETED);
        }
        summaDeb = 0;
        headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
    },
    changeStatus: function (text, statusIndex, showModal, timeout) {
        var tDiff = new Date(new Date().getTime() - lastChangeStatus).getTime() / 1000;
        var self = this;
        if (timeout > 0) {
            self.stateTimeout = setTimeout(function () {
                self.changeStatus(self.previousState.text, self.previousState.statusIndex, self.previousState.showModal);
            }, timeout);
        } else {
            self.previousState = { text: text, statusIndex: statusIndex, showModal: showModal };
            if (self.stateTimeout)
                clearTimeout(self.stateTimeout);
        }
        if (infoText != undefined) {
            if (tDiff < 1 && self.previousState.text != text) {
                setTimeout(function () {
                    self.changeStatus(text, statusIndex);
                }, 1500);
            } else {
                lastChangeStatus = new Date().getTime();
                self.previousStatusIndex = statusIndex;
                infoText.setTitle(text.toUpperCase());
                tableStatus.loadTexture('statusBg', statusIndex);
            }
        }
    },
    showCashier: function (visible) {
        if (visible) {
            cashierBtn.alpha = 1;
            cashierBtn.input.useHandCursor = true;
            cashierBtn.clicked = true;
            cashierBtn.inputEnabled = true;
        } else {
            cashierBtn.alpha = 0;
            cashierBtn.input.useHandCursor = false;
            cashierBtn.clicked = false;
            cashierBtn.inputEnabled = false;
        }
    }
};
