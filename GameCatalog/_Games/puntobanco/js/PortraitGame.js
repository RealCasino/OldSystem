
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

    var betType = {
        punto: 0,
        tie: 1,
        banco: 2
    };

    var dib_cost = [0.1, 1, 5, 10, 25, 50],
        NUM_DIB = dib_cost.length - 1,
        selectedChipId = 0,
        table, summaDeb = 0,
        tableStatus, infoText, timerText;

    var Bets = {};
    var timerSprite = {}, timerObj;
    var betHistory = [];

    var winNumInfo = {}, msgBoxPopup, msgBoxTween, limitPopup, limitPopupTween, statPopup, historyPopup, statPopupTween, selectedLimits = [];
    var cellName, betName, borderPosArr;

    var tableChips = [];
    var limits = [];
    var previousBetChips = [];
    var roundBetChips = [];
    var lastRevive = 0;
    var limitBtnText, confirmLimitBtn,cashierBtn,provablyBtn,homeBtn;

    var userNameText, USER_NAME, headerBetInputVal, headerBalansInputVal;
    var gameFrame, winNum, placeHold, timer;
    var _winNumUpdate, progressText, _videoFlagShow, isModalShow, isSubmiting, bigRoadText;

    var worldGroup = {}, tableGroup = {}, chipsGroup = {}, buttonGroup = {}, selectedChipsGroup = {},
        frameGroup = {}, footerGroup = {}, winTextGroup = {}, limitGroup = {}, cursorGroup = {}, statDataGroup=null;
    var tableCell = {}, PuntoPortraitGame = {};
    var previousMsgType, winAmount = 0, gameStatus;
    var chipCursor, cursorVisible = false, lastChangeStatus, timeToEnd, startGameBtn;
PuntoPortraitGame.Boot = function (game) {       
};

PuntoPortraitGame.Boot.prototype = {
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

PuntoPortraitGame.Preloader = function (game) {

    this.background = null;
    this.ready = false;
};

PuntoPortraitGame.Preloader.prototype = {
    
    preload: function () {
        this.game.stage.backgroundColor = '#fff';
        this.load.image('gameFrame', 'images/phone_game_frame.png');
        this.load.image('mainBtnBg', 'images/phone_game_btn_bg.png');
        this.load.image('cell_select', 'images/cell_select.png');
        this.load.image('closeBtn', 'images/modal_close_btn.png');
        this.load.image('historyBg', 'images/history_bg.png');
        this.load.image('limitsBg', 'images/limit_bg.png');
        this.load.image('modalBg', 'images/modal_bg.png');
        this.load.image('pbBg', 'images/phone_pb_bg.png');
        this.load.image('btnBg', 'images/phone_btn_bg.png');
        this.load.image('bigRoadBg', 'images/phone_big_road_bg.png');
        this.load.image('cashin', 'images/cashin.png');
        this.load.spritesheet('timer', 'images/timer.png', 60, 60);
        this.load.spritesheet('bigRoadItem', 'images/big_road_item.png', 15, 16);
        this.load.spritesheet('statusBg', 'images/status_bg.png', 1600, 61);
        this.load.spritesheet('icons', 'images/btn_icons.png', 42, 27);
        this.load.spritesheet('bottomBtnBg', 'images/phone_bottom_btn_bg.png', 173, 71);
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
                self.state.start('MainMenu');
            } else {
                setTimeout(function () {
                    startGame();
                },200);
            }
        }
        startGame();
    },

    updateProgressBar: function (progress){
        var pr;
        if (progressText != undefined){
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

PuntoPortraitGame.MainMenu = function(game){ 
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

PuntoPortraitGame.MainMenu.prototype = {
    update: function() {
    },
    create: function() {
        var self = this;
        var bottomBetLabel, balansLabel,
            limitBtn, statsBtn, historyBtn,
            chipsEl, table;

        var spriteXY, spriteX, spriteY;
        var cancelLastBtn, cancelAllBetBtn, repeatBetBtn;

        worldGroup = this.add.group();
        videoGroup = this.add.group();
        videoGroup = this.add.group();
        worldGroup.add(tableGroup);
        this.scale.setUserScale(SCALE, SCALE);
        this.scale.refresh();
        tableGroup = this.add.group();
        chipsGroup = this.add.group();
        selectedChipsGroup = this.add.group();

        frameGroup = this.add.group();
        footerGroup = this.add.group();
        frenchGroup = this.add.group();
        limitGroup = this.add.group();

        worldGroup.add(frameGroup);
        worldGroup.add(tableGroup);
        worldGroup.add(frenchGroup);
        worldGroup.add(footerGroup);
        footerGroup.add(winTextGroup);

        worldGroup.add(buttonGroup);
        worldGroup.add(limitGroup);

        gameFrame = this.add.sprite(0, 0, 'gameFrame');

        frameGroup.add(gameFrame);
        frameGroup.add(tableGroup);
        frameGroup.add(chipsGroup);
        for (var a = 0; a <= NUM_DIB; a++) {
            dib_cost[a] = dib_cost[a] * $.client.UserData.CurrencyMultiplier;
        }
        var name = USER_NAME ? USER_NAME.toUpperCase().length < 15 ? USER_NAME.toUpperCase() : USER_NAME.toUpperCase().substr(0, 15) + '...' : "";
        userNameText = this.add.text(10, gameFrame.height - 120, name, {
            font: "24px ProximaNova",
            fill: "#808080"
        });
        footerGroup.add(userNameText);
        balansLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_BALANCE", true).toUpperCase(),
            x: gameFrame.width - 285,
            y: gameFrame.height - 120,
            font: "ProximaNova",
            size: 22,
            color: "#808080",
            centered: false,
            maxHeight: 40,
            maxWidth: 140
        });
        footerGroup.add(balansLabel);
        console.log(balansLabel.x + balansLabel.width + 5);
        headerBalansInputVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + USER_BALANCE,
            x: balansLabel.x + balansLabel.width+5,
            y: gameFrame.height - 120,
            font: "ProximaNova",
            size: 22,
            color: "#e4a345",
            centered: false,
            maxHeight: 40,
            maxWidth: 120
        });
        footerGroup.add(headerBalansInputVal);
        headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
        cashierBtn = this.add.button(gameFrame.width - 37, gameFrame.height - 125, 'cashin', function () {
            $.client.cashier();
        }, this);
        cashierBtn.scale.set(0.7);
        cashierBtn.input.useHandCursor = true;
        cashierBtn.clicked = true;

        bottomBetLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_BET", true).toUpperCase(),
            x: gameFrame.width - 475,
            y: gameFrame.height - 120,
            font: "ProximaNova",
            size: 22,
            color: "#808080",
            centered: false,
            maxHeight: 40,
            maxWidth: 110
        });
        footerGroup.add(bottomBetLabel);
        headerBetInputVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + USER_BALANCE,
            x: gameFrame.width - 335,
            y: gameFrame.height - 120,
            font: "ProximaNova",
            size: 22,
            color: "#e4a345",
            centered: true,
            maxHeight: 40,
            maxWidth: 100
        });
        footerGroup.add(headerBetInputVal);

        tableStatus = this.add.sprite(0, gameFrame.height - 205, 'statusBg', 0);
        tableStatus.width = 750;
        frameGroup.add(tableStatus);

        infoText = createTextLbl(self, {
            text: $.client.getLocalizedString("PLEASE WAIT FOR THE NEXT OPEN TABLE", true).toUpperCase(),
            x: tableStatus.x + 375,
            y: tableStatus.y + 12,
            font: "ProximaNova",
            size: 32,
            color: "#fff",
            centered: true,
            maxHeight: 40,
            maxWidth: 500
        });
        infoText.anchor.x = Math.round(infoText.width * 0.5) / infoText.width;
        frameGroup.add(infoText);

        repeatBetBtn = this.add.button(30, 1060, 'mainBtnBg', this.repeatBets, this);
        repeatBetBtn.input.useHandCursor = true;
        repeatBetBtn.clicked = true;
        var repeatText = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_REPEAT", true).toUpperCase(),
            x: repeatBetBtn.x + repeatBetBtn.width / 2,
            y: repeatBetBtn.y + 11,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight:repeatBetBtn.height-10,
            maxWidth: repeatBetBtn.width-10
        });
        buttonGroup.add(repeatBetBtn);
        buttonGroup.add(repeatText);

        cancelAllBetBtn = this.add.button(220, 1060, 'mainBtnBg', this.cancelAllBet, this);
        cancelAllBetBtn.input.useHandCursor = true;
        cancelAllBetBtn.clicked = true;
        cancelAllBetBtn.width = 250;
        var cancelAllText = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_CANCEL_ALL_BET", true).toUpperCase(),
            x: cancelAllBetBtn.x + cancelAllBetBtn.width / 2,
            y: cancelAllBetBtn.y + 11,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight:cancelAllBetBtn.height-10,
            maxWidth: cancelAllBetBtn.width-10
        });
        buttonGroup.add(cancelAllBetBtn);
        buttonGroup.add(cancelAllText);
        cancelLastBtn = this.add.button(480, 1060, 'mainBtnBg', this.cancelLastBet, this);
        cancelLastBtn.input.useHandCursor = true;
        cancelLastBtn.clicked = true;
        cancelLastBtn.width = 250;
        var cancelLastText =createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_CANCEL_LAST_BET", true).toUpperCase(),
            x: cancelLastBtn.x + cancelLastBtn.width / 2,
            y: cancelLastBtn.y + 11,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight:cancelLastBtn.height-10,
            maxWidth: cancelLastBtn.width-10
        });
        buttonGroup.add(cancelLastBtn);
        buttonGroup.add(cancelLastText);

        historyBtn = this.add.button(480, 1260, 'bottomBtnBg', this.showHistory, this, 1, 2);
        historyBtn.alpha = 0;
        historyBtn.input.useHandCursor = true;
        historyBtn.width = 280;
        historyBtn.clicked = true;
        createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_HISTORY", true).toUpperCase(),
            x: historyBtn.x + historyBtn.width / 2,
            y: historyBtn.y + 25,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight:historyBtn.height-10,
            maxWidth: historyBtn.width-10
        });
         buttonGroup.add(historyBtn);

        limitBtn = this.add.button(260, 1260, 'bottomBtnBg', this.showLimits, this, 1, 1);
        limitBtn.alpha = 0;
        limitBtn.clicked = true;
        limitBtn.width = 230;
        limitBtn.input.useHandCursor = true;
        limitBtnText=createTextLbl(self, {
            text: $.client.getLocalizedString("Info", true).toUpperCase(),
            x: limitBtn.x + limitBtn.width / 2,
            y: limitBtn.y + 25,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight:limitBtn.height-10,
            maxWidth: limitBtn.width-10
        });
    
        buttonGroup.add(limitBtn);
      /*  statsBtn = this.add.button(0, 1260, 'bottomBtnBg', this.showBigRoad, this, 1, 1);
        statsBtn.clicked = true;
        statsBtn.alpha = 0;
        statsBtn.width = 230;
        statsBtn.input.useHandCursor = true;
        bigRoadText = this.add.text(statsBtn.x + 95, statsBtn.y + 25, $.client.getLocalizedString("TEXT_BIG_ROAD", true), {
            font: "18px ProximaNova",
            fill: "#fff",
            align: "center"
        });
        this.add.sprite(statsBtn.x + 30, statsBtn.y + 20, 'icons', 0);
        buttonGroup.add(statsBtn);*/
        provablyBtn = this.add.group();
        var provablyBtnBg = this.add.button(10, 10, 'mainBtnBg', function () {
            $.client.showProvablyFair();
        }, this);
        provablyBtnBg.clicked = false;
        provablyBtnBg.input.useHandCursor = true;
        var provablyBtnTxt =createTextLbl(self, {
            text: $.client.getLocalizedString("Provably fair", true).toUpperCase(),
            x: provablyBtnBg.x + provablyBtnBg.width / 2,
            y: provablyBtnBg.y + 20,
            font: "ProximaNova",
            size: 25,
            color: "#fff",
            centered: true,
            maxHeight:provablyBtnBg.height-10,
            maxWidth: provablyBtnBg.width-10
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
            x: homeBtnBg.x+homeBtnBg.width/2,
            y: homeBtnBg.y +11,
            font: "ProximaNova",
            size: 25,
            style:'bold',
            color: "#c2c2c2",
            centered: true,
            maxHeight: 55,
            maxWidth: homeBtnBg.width
        });
        homeBtn.btn = homeBtnBg;
        homeBtn.add(homeBtnBg);
        homeBtn.add(homeBtnTxt);

        startGameBtn = this.add.group();
        var startGameBtnBg = this.add.button(270, 350, 'mainBtnBg', this.startGame, this);
        startGameBtnBg.clicked = true;
        startGameBtnBg.width = 220;
        startGameBtnBg.input.useHandCursor = true;
        var startGameBtnTxt = createTextLbl(self, {
            text: $.client.getLocalizedString("Start game", true).toUpperCase(),
            x: startGameBtnBg.x + startGameBtnBg.width / 2,
            y: startGameBtnBg.y + 11,
            font: "ProximaNova",
            size: 26,
            style: 'bold',
            color: "#c2c2c2",
            centered: true,
            maxHeight: 55,
            maxWidth: startGameBtnBg.width
        })
        startGameBtn.btn = startGameBtnBg;
        startGameBtn.add(startGameBtnBg);
        startGameBtn.add(startGameBtnTxt);
        footerGroup.add(startGameBtn);
        startGameBtn.alpha = 0;


        for (var a = 0; a <= NUM_DIB; a++) {
            if (a == selectedChipId) {
                chipsEl = chipsGroup.create(53 + (a * 105), 940, 'chips', a + 6);
            } else {
                chipsEl = chipsGroup.create(53 + (a * 105), 940, 'chips', a);
            }
            chipsEl.debValue = dib_cost[a];
            chipsEl.id = a;
            chipsEl.rY = chipsEl.y;
            chipsEl.rX = chipsEl.x;
            chipsEl.scale.set(1.3);
            chipsEl.inputEnabled = true;
            chipsEl.input.useHandCursor = true;
            chipsEl.events.onInputDown.add(this.changeChips, this);
            chipsEl.chipText = this.add.text(chipsEl.x + 55, chipsEl.y + 40, dib_cost[a] > 999 ? kFormater(dib_cost[a]) : dib_cost[a], {
                font: "26px ProximaNova",
                fill: "#fff"
            });
            chipsEl.chipText.anchor.x = Math.round(chipsEl.chipText.width * 0.5) / chipsEl.chipText.width;
            chipsGroup.add(chipsEl.chipText);
        }
        table = this.add.sprite(38, 730, 'pbBg');
        tableGroup.add(table);
        self.changeChips({ id: selectedChipId });

        var puntoBtn = {}, tieBtn = {}, bancoBtn = {};
        puntoBtn.bg = this.add.sprite(table.x + 22, table.y + 22, 'btnBg');
        puntoBtn.select = this.add.sprite(table.x + 22, table.y + 22, 'cell_select');
        puntoBtn.text = createTextLbl(self, {
            text: $.client.getLocalizedString("Punto", true).toUpperCase(),
            x: puntoBtn.bg.x + puntoBtn.bg.width / 2,
            y: puntoBtn.bg.y + puntoBtn.bg.height / 2 - 10,
            font: "ProximaNova",
            size: 32,
            color: "#fff",
            centered: true,
            maxHeight: puntoBtn.bg.height - 10,
            maxWidth: puntoBtn.bg.width - 10
        });
        puntoBtn.select.alpha = 0;
        puntoBtn.select.width = 220;
        puntoBtn.select.height = 160;
        puntoBtn.select.type = betType.punto;
        puntoBtn.select.inputEnabled = true;
        puntoBtn.select.events.onInputDown.add(this.betClick, this);
        puntoBtn.select.events.onInputOver.add(this.betOver, this);
        puntoBtn.select.events.onInputOut.add(this.betOut, this);
        tableGroup.add(puntoBtn.bg);
        tableGroup.add(puntoBtn.select);
        tieBtn.bg = this.add.sprite(table.x + 250, table.y + 22, 'btnBg');
        tieBtn.bg.width = 170;
        tieBtn.select = this.add.sprite(table.x + 250, table.y + 22, 'cell_select');
        tieBtn.text = createTextLbl(self, {
            text: $.client.getLocalizedString("Tie", true).toUpperCase(),
            x: tieBtn.bg.x + tieBtn.bg.width / 2,
            y: tieBtn.bg.y + tieBtn.bg.height / 2 - 10,
            font: "ProximaNova",
            size: 32,
            color: "#fff",
            centered: true,
            maxHeight: tieBtn.bg.height - 10,
            maxWidth: tieBtn.bg.width - 10
        });
        tieBtn.select.alpha = 0;
        tieBtn.select.width = 170;
        tieBtn.select.height = 160;
        tieBtn.select.type = betType.tie;
        tieBtn.select.inputEnabled = true;
        tieBtn.select.events.onInputDown.add(this.betClick, this);
        tieBtn.select.events.onInputOver.add(this.betOver, this);
        tieBtn.select.events.onInputOut.add(this.betOut, this);
        tableGroup.add(tieBtn.bg);
        tableGroup.add(tieBtn.select);

        bancoBtn.bg = this.add.sprite(table.x + 428, table.y + 22, 'btnBg');
        bancoBtn.select = this.add.sprite(table.x + 427, table.y + 22, 'cell_select');
        bancoBtn.text = createTextLbl(self, {
            text: $.client.getLocalizedString("Banco", true).toUpperCase(),
            x: bancoBtn.bg.x + bancoBtn.bg.width / 2,
            y: bancoBtn.bg.y + bancoBtn.bg.height / 2 - 10,
            font: "ProximaNova",
            size: 32,
            color: "#fff",
            centered: true,
            maxHeight: bancoBtn.bg.height - 10,
            maxWidth: bancoBtn.bg.width - 10
        });

        bancoBtn.select.alpha = 0;
        bancoBtn.select.width = 220;
        bancoBtn.select.height = 160;
        bancoBtn.select.type = betType.banco;
        bancoBtn.select.inputEnabled = true;
        bancoBtn.select.events.onInputDown.add(this.betClick, this);
        bancoBtn.select.events.onInputOver.add(this.betOver, this);
        bancoBtn.select.events.onInputOut.add(this.betOut, this);
        tableGroup.add(bancoBtn.bg);
        tableGroup.add(bancoBtn.select);


        
        window.addEventListener('resize', function() {
            self.changeGameSize();
        });
        setInterval(function () {
            self.changeGameSize();
        }, 1000);

        self.changeGameSize();
        self.ready = true;
        setTimeout(function () {
            self.getLimits();
            self.updateStatistics();
        }, 300);
 
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
            setTimeout(function() {
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
        startGameBtn.alpha = 1;
        startGameBtn.btn.inputEnabled = true;
        if ($.client.UserData.Features && $.client.UserData.Features.provably_fair) {
            provablyBtn.btn.inputEnabled = true;
            provablyBtn.alpha = 1;
        } else {
            provablyBtn.btn.inputEnabled = false;
            provablyBtn.alpha = 0;
        }
    },
    removeLossesBet: function (winNumber) {
        var items = [];
        if (tableChips.length > 0) {
            for (var i = 0; i < tableChips.length; i++) {
                var betChip = tableChips[i];
                if (betChip.bet.type != winNumber) {
                    var chip = betChip.chip;
                    chip.destroy();
                    items.push(betChip);
                }
            }
        }
        for (var i = 0; i < items.length; i++) {
            tableChips.splice(tableChips.indexOf(items[i]), 1);
        }
    },
    resetTable: function() {
        if (selectedChipsGroup.children && selectedChipsGroup.children.length > 0) {
            selectedChipsGroup.removeChildren();
        }
        if (headerBetInputVal !== undefined) {
            headerBetInputVal.setTitle('0');
        }
        tableChips = [];
        summaDeb = 0;
        if (placeHold !== undefined) {
            placeHold.kill();
        }
    },
    betOver: function(element) {
        if (!MessageDispatcher.isTableOpen) {
            element.alpha = 0.1;
        }
    },
    betOut: function(element) {
        element.alpha = 0;
    },
    betClick: function(element) {
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
    getAmountDeb: function() {
        return dib_cost[selectedChipId];
    },
    clearAllBet: function(element) {
        if (tableChips.length > 0) {
            for (var i = 0; i < tableChips.length; i++) {
                var bet = tableChips[i];
                if (bet['sent'] == undefined) {
                    var chip = bet.chip;
                    chip.destroy();
                    if (summaDeb > 0) {
                        summaDeb = parseFloat(summaDeb - bet.amount).toFixed(2);
                    } else {
                        summaDeb = 0;
                    }
                    headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
                }
            }
            tableChips = $.grep(tableChips, function(n, i) {
                return (n.sent);
            });
        }
    },
    cancelAllBet: function(element) {
        var self = this;
        if (tableChips.length > 0) {
            $.client.sendPost(JSON.stringify({
                    type: "cancel_all"
                }), function(responce) {
                    if (responce.IsSuccess) {
                        if (responce.ResponseData.success) {
                            if (selectedChipsGroup.children && selectedChipsGroup.children.length > 0) {
                                selectedChipsGroup.removeChildren();
                            }
                            if (headerBetInputVal !== undefined) {
                                headerBetInputVal.setTitle('0');
                            }
                            tableChips = [];
                            summaDeb = 0;
                            USER_BALANCE = responce.ResponseData.balance;
                            headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                            infoText.setTitle($.client.getLocalizedString('TEXT_BETS_CANCELED', true));
                        }
                    }
                }, function(err) {
                    console.log(err);
                });
        }
    },
    cancelLastBet: function (element) {
        function cancel(cancelBet) {
            $.client.sendPost(JSON.stringify({
                type: "cancel_last",
                bet: cancelBet.bet
            }), function (responce) {
                if (responce.IsSuccess) {
                    if (responce.ResponseData.success) {
                        var chip = cancelBet.chip;
                        chip.destroy();
                        tableChips.splice(tableChips.indexOf(cancelBet.bet), 1);
                        if (summaDeb > 0) {
                            summaDeb = parseFloat(summaDeb - cancelBet.bet.amount).toFixed(2);
                            headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
                        } else {
                            summaDeb = 0;
                        }
                        USER_BALANCE = responce.ResponseData.balance;
                        headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                        infoText.setTitle($.client.getLocalizedString('TEXT_BET_CANCELED', true));
                    }
                }
            }, function (err) {
                console.log(err);
            });
        }
        if (previousBetChips.length > 0) {
            cancel(previousBetChips[previousBetChips.length - 1]);
            previousBetChips.splice(previousBetChips.length - 1, 1);
        }
    },
    saveRoundBet: function () {
        if (previousBetChips.length > 0) {
            roundBetChips = previousBetChips.slice(0);
        }
        previousBetChips = [];
    },
    clearLastBet: function(element) {
            if (tableChips.length > 0 && !tableChips[tableChips.length - 1]['sent']) {
                var bet = tableChips.pop();
                var chip = bet.chip;
                chip.destroy();

                if (summaDeb > 0) {
                    summaDeb = parseFloat(summaDeb - bet.amount).toFixed(2);
                    headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
                } else {
                    summaDeb = 0;
                }
            }
    },
    repeatBets: function(element) {
        var self = this;
        if (MessageDispatcher.isTableOpen) {
            if (roundBetChips.length > 0) {
                for (var i = 0; i < roundBetChips.length; i++) {
                        var pBet = roundBetChips[i];
                        var bet = { name: pBet.name, type: pBet.type, amount: pBet.amount, bet: pBet.bet };
                        var isValidBet = this.checkLimit(bet);
                        if (isValidBet.state) {
                            bet.chip = self.add.graphics(pBet.chip.x, pBet.chip.y, selectedChipsGroup);
                            var chipAmount = pBet.amount;
                            for (var a in dib_cost) {
                                if (dib_cost[a] === chipAmount)
                                    chipId = parseInt(a);
                            }
                            bet.active_sprite = this.add.sprite(0, 0, "chips", chipId);
                            bet.active_sprite.width = 100;
                            bet.active_sprite.height = 100;
                            bet.chip.addChild(bet.active_sprite);
                            for (var j = 0; j < tableChips.length; j++) {
                                if (tableChips[j].bet.type == bet.type) {
                                    chipAmount += tableChips[j].amount;
                                }
                            }
                            chipAmount = chipAmount % 1 == 0 ? chipAmount : parseFloat(chipAmount).toFixed(1);
                            bet.chipText = this.add.text(54, 30, (chipAmount > 999 ? kFormater(chipAmount, 1) : chipAmount), {
                                font: "bold 35px Arial",
                                fill: "#fff",
                                wordWrap: true,
                                align: "center"
                            });
                            bet.chipText.anchor.x = Math.round(bet.chipText.width * 0.5) / bet.chipText.width;
                            bet.chip.addChild(bet.chipText);
                            bet.chip.scale.set(0.8);
                            summaDeb = parseFloat(summaDeb) + parseFloat(pBet.amount);
                            summaDeb = parseFloat(summaDeb).toFixed(2);
                            headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
                            tableChips.push(bet);
                        }
                    }
                    if (summaDeb > 0) {
                        summaDeb = parseFloat(summaDeb).toFixed(2);
                    } else {
                        summaDeb = 0;
                    }
                    headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
                }
            self.confirmBet();
        }
    },
    confirmBet: function(element) {
        var self = this;
        var bets = [];
        var unConfirmBets;
        if (!isSubmiting) {
            var notSentChipsArray = $.grep(tableChips, function(n, i) {
                return (!n.sent);
            });
            if (MessageDispatcher.isTableOpen && notSentChipsArray.length > 0) {
                for (var i = 0; i < notSentChipsArray.length; i++) {
                    unConfirmBets = notSentChipsArray[i].bet;
                    if (Object.prototype.toString.call(unConfirmBets) === '[object Array]') {
                        for (k = 0; k < unConfirmBets.length; k++) {
                            bets.push(unConfirmBets[k]);
                        }
                    } else {
                        bets.push({
                            type: unConfirmBets.type,
                            amount: unConfirmBets.amount,
                            name: unConfirmBets.name
                        });
                    }
                }
                isSubmiting = true;
                $.client.sendPost(JSON.stringify({
                        type: "bet",
                        bets: bets
                    }), function(responce) {
                        if (responce.IsSuccess) {
                            USER_BALANCE = responce.ResponseData.balance;
                            headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                            if (responce.ResponseData.success) {
                                setTimeout(function () {
                                    infoText.setTitle($.client.getLocalizedString('TEXT_INFO_BET_CONFIRMED', true));
                                }, 1500);
                                for (var i = 0; i < responce.ResponseData.bets.length; i++) {
                                    if (notSentChipsArray[i])
                                        notSentChipsArray[i].sent = responce.ResponseData.bets[i].wasMade;
                                }
                                previousBetChips = $.grep(tableChips, function (n, i) {
                                    return (n.sent);
                                });
                            } else if (responce.ResponseData.error) {
                                setTimeout(function () {
                                    self.clearAllBet(false);
                                    infoText.setTitle($.client.getLocalizedString('TEXT_INFO_BET_NOT_CONFIRMED', true));
                                }, 1500);
                            } else {
                                setTimeout(function () {
                                    self.clearAllBet(false);
                                    infoText.setTitle($.client.getLocalizedString('TEXT_INFO_BET_NOT_CONFIRMED', true));
                                }, 1500);
                            }
                        } else {
                            setTimeout(function () {
                                self.clearAllBet(false);
                                infoText.setTitle($.client.getLocalizedString('TEXT_INFO_BET_NOT_CONFIRMED', true));
                            }, 1500);
                        }
                        isSubmiting = false;
                    }, function(err) {
                        self.clearAllBet(false);
                        isSubmiting = false;
                        console.log(err);
                    });
            }
        } else {
            setTimeout(function() {
                self.confirmBet();
            }, 100);
        }
    },
    checkLimit: function (par) {
        var name, type, amount, errText, cellTotalAmount = 0, totalAmount;
        var valid = true;
        var self = this;
        var validAmount = 0;
        function formatLimitAmount(amount) {
            if (amount > 9999) {
                return kFormater(amount);
            } else {
                return amount % 1 == 0 ? parseFloat(amount).toFixed(0) : parseFloat(amount).toFixed(1);
            }
        }
        if (par.name != undefined && par.type != undefined && par.amount != undefined) {
            name = par.name;
            type = par.type;
            amount = par.amount;
            totalAmount = amount;
            cellTotalAmount = amount;
            for (var i = 0; i < tableChips.length; i++) {
                totalAmount += tableChips[i].amount;
                if (tableChips[i].type == type) {
                    cellTotalAmount += tableChips[i].amount;
                }
            }
            if (totalAmount > parseFloat(USER_BALANCE)) {
                errText = $.client.getLocalizedString('TEXT_ERROR_NO_MONEY_MSG', true);
                validAmount = USER_BALANCE - (totalAmount - amount);
                valid = false;
            } else if (totalAmount > TABLE_MAX_BET) {
                errText = $.client.getLocalizedString('Table_limits', true, { min: formatLimitAmount(TABLE_MIN_BET), max: formatLimitAmount(TABLE_MAX_BET), sign: $.client.UserData.CurrencySign });
                validAmount = TABLE_MAX_BET - (totalAmount - amount);
                valid = false;
            } else if (totalAmount < TABLE_MIN_BET) {
                errText = $.client.getLocalizedString('Table_limits', true, { min: formatLimitAmount(TABLE_MIN_BET), max: formatLimitAmount(TABLE_MAX_BET), sign: $.client.UserData.CurrencySign });
                valid = false;
            }
            if (type == betType.punto) {
                if (cellTotalAmount > PUNTO_MAX_BET) {
                    errText = $.client.getLocalizedString('Punto limits', true, { min: formatLimitAmount(PUNTO_MIN_BET), max: formatLimitAmount(PUNTO_MAX_BET), sign: $.client.UserData.CurrencySign }).toUpperCase();
                    validAmount = validAmount < (PUNTO_MAX_BET - (cellTotalAmount - amount)) && !valid ? validAmount : PUNTO_MAX_BET - (cellTotalAmount - amount);
                    valid = false;
                } else if (cellTotalAmount < PUNTO_MIN_BET) {
                    errText = $.client.getLocalizedString('Punto limits', true, { min: formatLimitAmount(PUNTO_MIN_BET), max: formatLimitAmount(PUNTO_MAX_BET), sign: $.client.UserData.CurrencySign }).toUpperCase();
                    valid = false;
                }
            } else if (type == betType.tie) {
                if (cellTotalAmount < TIE_MIN_BET) {
                    errText = $.client.getLocalizedString('Tie limits', true, { min: formatLimitAmount(TIE_MIN_BET), max: formatLimitAmount(TIE_MAX_BET), sign: $.client.UserData.CurrencySign }).toUpperCase();
                    valid = false;
                } else if (cellTotalAmount > TIE_MAX_BET) {
                    validAmount = validAmount < (TIE_MAX_BET - (cellTotalAmount - amount)) && !valid ? validAmount : TIE_MAX_BET - (cellTotalAmount - amount);
                    errText = $.client.getLocalizedString('Tie limits', true, { min: formatLimitAmount(TIE_MIN_BET), max: formatLimitAmount(TIE_MAX_BET), sign: $.client.UserData.CurrencySign }).toUpperCase();
                    valid = false;
                }
            } else if (type == betType.banco) {
                if (cellTotalAmount < BANCO_MIN_BET) {
                    errText = $.client.getLocalizedString('Banco limits', true, { min: formatLimitAmount(BANCO_MIN_BET), max: formatLimitAmount(BANCO_MAX_BET), sign: $.client.UserData.CurrencySign }).toUpperCase();
                    valid = false;
                } else if (cellTotalAmount > BANCO_MAX_BET) {
                    validAmount = (validAmount < BANCO_MAX_BET - (cellTotalAmount - amount)) && !valid ? validAmount : BANCO_MAX_BET - (cellTotalAmount - amount);
                    errText = $.client.getLocalizedString('Banco limits', true, { min: formatLimitAmount(BANCO_MIN_BET), max: formatLimitAmount(BANCO_MAX_BET), sign: $.client.UserData.CurrencySign }).toUpperCase();
                    valid = false;
                }
            }
        }
        var chips = [];
        function getChip(needAmount) {
            var chipId = -1;
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
        validAmount = parseFloat(validAmount.toFixed(2));
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
        return { state: valid, chips: chips };
    },
    makeBet: function (element) {
        var self = this;
        var event = $.extend(true, {}, element);
        var debValue, isValidBet, validateObj;
        var elementX, elementY;
        if (MessageDispatcher.isTableOpen) {
            var betChip = { name: event.name, type: event.type, amount: event.bet_amount, bet: event.bets };
            validateObj = this.checkLimit(betChip);
            isValidBet = validateObj.state;
            if (isValidBet) {
                $.each(validateObj.chips, function (i, chipId) {
                    debValue = dib_cost[chipId];
                    summaDeb = parseFloat(summaDeb) + parseFloat(debValue);
                    summaDeb = parseFloat(summaDeb).toFixed(2);
                    headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
                    self.drawChip(element, chipId);
                    self.confirmBet();
                });
            }
        }
    },
    drawBetsChip: function (bets) {
        var self = this, betObj, chipId = 0, betAmount = 0;
        for (var i in bets) {
            betObj = {};
            for (var j in tableGroup.children) {
                if (tableGroup.children[j].inputEnabled == true && tableGroup.children[j].type === bets[i].betInfo.type)
                    betObj = tableGroup.children[j];
            }
            betAmount += bets[i].betInfo.amount;
            for (var a in dib_cost) {
                if (dib_cost[a] === bets[i].betInfo.amount)
                    chipId = parseInt(a);
            }
            betObj.bets = bets[i].betInfo;
            self.drawChip(betObj, chipId, true, true);
            summaDeb = betAmount;
            summaDeb = parseFloat(summaDeb).toFixed(2);
            if (headerBetInputVal !== undefined) {
                headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
            }
        }
        previousBetChips = $.grep(tableChips, function (n, i) {
            return (n.sent);
        });
    },
    drawChip: function (element, chipId, sent, submit) {
        var self = this;
        var debValue, elementX, elementY;
        var event = $.extend(true, {}, element);
        var betChip = { name: event.name, type: event.type, amount: dib_cost[chipId], bet: { type: event.type, amount: dib_cost[chipId] }, sent: sent, submit: submit };
        debValue = dib_cost[chipId];
        var chipAmount = debValue;
        elementX = element.x;
        elementY = element.y + 3;
        betChip.chip = self.add.graphics(elementX, elementY, selectedChipsGroup);
        betChip.active_sprite = self.add.sprite(0, 0, "chips", chipId + 6);
        betChip.active_sprite.width = 100;
        betChip.active_sprite.height = 100;
        betChip.chip.addChild(betChip.active_sprite);
        for (var i = 0; i < tableChips.length; i++) {
            if (tableChips[i].type == betChip.type) {
                chipAmount += tableChips[i].amount;
            }
        }
        chipAmount = chipAmount % 1 == 0 ? chipAmount : parseFloat(chipAmount).toFixed(1);
        betChip.chipText = self.add.text(50, 33, (chipAmount > 999 ? kFormater(chipAmount, 1) : chipAmount), {
            font: "35px ProximaNova",
            fill: "#fff"
        });
        betChip.chipText.anchor.x = Math.round(betChip.chipText.width * 0.5) / betChip.chipText.width;
        betChip.chip.addChild(betChip.chipText);
        betChip.chip.scale.set(0.8);
        tableChips.push(betChip);
        tableGroup.add(betChip.chip);
        selectedChipsGroup.add(betChip.chip);
    },

    changeChips: function(element) {
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
                    item.y = item.rY - 10;
                    item.chipText.y = item.rY + 28;
                    item.loadTexture(item.key, item.id + 6);
                } else {
                    item.y = item.rY;
                    item.chipText.y = item.rY + 38;
                    item.loadTexture(item.key, item.id);
                }
            }
        });
        this.changeGameSize();
     },
    validateChips: function () {
        var self = this, prevDissabled;
        chipsGroup.forEach(function (item) {
            if (dib_cost[item.id]) {
                if (dib_cost[item.id] < TABLE_MIN_BET || (dib_cost[item.id] < PUNTO_MIN_BET && dib_cost[item.id] < TIE_MIN_BET && dib_cost[item.id] < BANCO_MIN_BET)) {
                    item.tint = 0x808080;
                    prevDissabled = true;
                    item.inputEnabled = false;
                    item.chipText.visible = false;
                    item.visible = false;
                    item.input.useHandCursor = false;
                } else {
                    item.tint = 0xffffff;
                    item.inputEnabled = true;
                    item.chipText.visible = true;
                    item.visible = true;
                    item.input.useHandCursor = true;
                    if (item.id && prevDissabled) {
                        prevDissabled = false;
                        self.changeChips(item);
                    }
                }
            }
        });
    },
    getLimits: function (element) {
        var self = this;
        var clicked = true;

        if (element && element.hasOwnProperty('clicked')) {
            clicked = Boolean(element.clicked);
        }
        if (clicked) {
            $.client.sendPost(JSON.stringify({
                    type: "get_limits"
                }), function(responce) {
                    if (responce.IsSuccess) {
                        limits = responce.ResponseData.limits;
                        selectedLimits = limits[0];
                        self.confirmLimit();
                    }
                }, function(err) {
                    console.log(err);
                });
        }
    },
    showLimits: function() {
        var limitTitleText;
        var modalBg, cancelBtn;
        var self = this;
        if (!isModalShow) {
            if (limits.length != 0) {
                isModalShow = true;
                limitPopup = this.add.group();
                modalBg = this.add.button(0, 0, "modalBg", null, true);
                modalBg.useHandCursor = false;
                modalBg.height = 1400;
                limitPopup.add(modalBg);
                var limitBox = this.add.sprite(0, 320, 'limitsBg');
                limitBox.height = 600;
                limitBox.width = 750;
                limitPopup.add(limitBox);
                cancelBtn = this.add.button(700, 335, 'closeBtn', this.closelimitPopup, this);
                cancelBtn.useHandCursor = true;
                limitPopup.addChild(cancelBtn);
                if ($.client.UserData.Features && $.client.UserData.Features.rules) {
                    var rulesBtn = this.add.button(500, 337, 'mainBtnBg', function () {
                        $.client.showRules();
                    }, this);
                    limitPopup.add(rulesBtn);
                    rulesBtn.height = 40;
                    rulesBtn.width = 155;
                    var rulesText = createTextLbl(self, {
                        text: $.client.getLocalizedString("Rules", true).toUpperCase(),
                        x: rulesBtn.x + rulesBtn.width/2,
                        y: rulesBtn.y+11,
                        font: "ProximaNova",
                        size: 22,
                        color: "#fff",
                        centered: true,
                        maxHeight: 55,
                        maxWidth: rulesBtn.width
                    });
                    rulesText.anchor.x = Math.round(rulesText.width * 0.5) / rulesText.width;
                    limitPopup.add(rulesText);
                    rulesBtn.clicked = true;
                    rulesBtn.input.useHandCursor = true;
               }

                limitTitleText = createTextLbl(self, {
                    text: $.client.getLocalizedString("BET INFO", true).toUpperCase(),
                    x: 30,
                    y: 355,
                    font: "ProximaNova",
                    size: 36,
                    color: "#fff",
                    centered: false,
                    maxHeight: 40,
                    maxWidth: 120
                });
                limitPopup.addChild(limitTitleText);
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Bet name", true).toUpperCase(),
                    x: 110,
                    y: 430,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: false,
                    maxHeight: 40,
                    maxWidth: 120
                }));
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Min bet", true).toUpperCase(),
                    x: 290,
                    y: 430,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: false,
                    maxHeight: 40,
                    maxWidth: 120
                }));
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Max bet", true).toUpperCase(),
                    x: 415,
                    y: 430,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: false,
                    maxHeight: 40,
                    maxWidth: 120
                }));
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Pays", true).toUpperCase(),
                    x: 565,
                    y: 430,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: false,
                    maxHeight: 40,
                    maxWidth: 120
                }));
             
                function showLimitRow(x, y, limit) {
                    var nameLbl=limitPopup.addChild(self.add.text(x, y, limit.name.toUpperCase(), {
                        font: "32px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    var min = parseFloat(limit.min) % 1 == 0 ? parseFloat(limit.min).toFixed(0) : limit.min.replace(',', '.');
                    min = min > 9999 ? kFormater(min) : min;
                    var minLbl = limitPopup.addChild(self.add.text(x + 230, y, min, {
                        font: "32px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    minLbl.anchor.x = Math.round(minLbl.width * 0.5) / minLbl.width;
                    var max = parseFloat(limit.max) % 1 == 0 ? parseFloat(limit.max).toFixed(0) : limit.max.replace(',', '.');
                    max = max > 9999 ? kFormater(max) : max;
                    var maxLbl = limitPopup.addChild(self.add.text(x + 360, y, max, {
                        font: "32px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    maxLbl.anchor.x = Math.round(maxLbl.width * 0.5) / maxLbl.width;
                    var paysLbl = limitPopup.addChild(self.add.text(x + 490, y, limit.winRateText, {
                        font: "32px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    paysLbl.anchor.x = Math.round(paysLbl.width * 0.5) / paysLbl.width;
                }

                showLimitRow(110, 500, {
                    name: $.client.getLocalizedString("Punto", true),
                    min: limits[0].Player.Min,
                    max: limits[0].Player.Max,
                    winRateText: "1:1"
            });
                showLimitRow(110, 580, {
                    name: $.client.getLocalizedString("Tie", true),
                    min: limits[0].Tie.Min,
                    max: limits[0].Tie.Max,
                    winRateText: "8:1"
            });
                showLimitRow(110, 680, {
                    name: $.client.getLocalizedString("Banco", true),
                    min: limits[0].Banker.Min,
                    max: limits[0].Banker.Max,
                    winRateText: "19:20"
    });
                showLimitRow(110, 770, {
                    name: $.client.getLocalizedString("Table", true),
                    min: limits[0].Table.Min,
                    max: limits[0].Table.Max
                });

            }
        }
    },
    selectLimitBtn: function(btn) {
        if (limitGroup.length > 0) {
            limitGroup.forEach(function(item) {
                if (item.key === "limitBtnBg") {
                    item.setFrames(1, 0);
                }
            });
        }

        btn.setFrames(1, 1, 1);
    },
    confirmLimit: function(element) {
        var self = this;
        $.client.sendPost(JSON.stringify({
                type: "put_limits",
                limits: selectedLimits
            }), function(responce) {
                if (responce.IsSuccess) {
                    TABLE_MIN_BET = parseFloat(selectedLimits["Table"].Min);
                    TABLE_MAX_BET = parseFloat(selectedLimits["Table"].Max);
                    PUNTO_MIN_BET = parseFloat(selectedLimits["Player"].Min);
                    PUNTO_MAX_BET = parseFloat(selectedLimits["Player"].Max);
                    TIE_MIN_BET = parseFloat(selectedLimits["Tie"].Min);
                    TIE_MAX_BET = parseFloat(selectedLimits["Tie"].Max);
                    BANCO_MIN_BET = parseFloat(selectedLimits["Banker"].Min);
                    BANCO_MAX_BET = parseFloat(selectedLimits["Banker"].Max);
                    self.validateChips();
                    if (limitPopup && isModalShow)
                    self.closelimitPopup();
                }
            }, function(err) {
                console.log(err);
            });
    },
    closelimitPopup: function() {
        isModalShow = false;
        if ((limitPopupTween && limitPopupTween.isRunning)) {
            return;
        }
        limitPopupTween = this.add.tween(limitPopup).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
        limitPopup.destroy();
        tableGroup.setAll('inputEnabled', true);
        buttonGroup.setAll('clicked', true);
    },
    showHistory: function(element) {
        var self = this;
        var statTitleText, modalBg, cancelBtn, winLbl, betLbl, resultLbl;
        if (!isModalShow) {
            if (_videoFlagShow) {
                self.showVideo();
            }
            isModalShow = true;
            historyPopup = this.add.group();
            historyPopup.clicked = false;
            modalBg = this.add.button(0, 0, "modalBg", null, true);
            modalBg.height = 1400;
            modalBg.useHandCursor = false;
            historyPopup.add(modalBg);
            var historyBox = this.add.sprite(220, 400, 'historyBg');
            historyPopup.add(historyBox);
            cancelBtn = this.add.button(510, 410, 'closeBtn', this.closeHistoryPopup, this);
            cancelBtn.useHandCursor = true;
            historyPopup.addChild(cancelBtn);
            var totalLost = createTextLbl(self, {
                text: $.client.getLocalizedString("Total lost", true).toUpperCase(),
                x: 250,
                y: 740,
                font: "ProximaNova",
                size: 18,
                color: "#878787",
                centered: false,
                maxHeight: 55,
                maxWidth:160
            });
           
            var totalLostVal = createTextLbl(self, {
                text: $.client.UserData.CurrencySign + (TOTAL_LOST > 99999 ? kFormater(TOTAL_LOST) : parseFloat(TOTAL_LOST).toFixed(2)),
                x: totalLost.x + totalLost.width + 15,
                y: 740,
                font: "ProximaNova",
                size: 18,
                color: "#878787",
                centered: false,
                maxHeight: 30,
                maxWidth: 100
            });
            historyPopup.addChild(totalLost);
            historyPopup.addChild(totalLostVal);

            statTitleText = createTextLbl(self, {
                text: $.client.getLocalizedString("History", true).toUpperCase(),
                x: 250,
                y: 430,
                font: "ProximaNova",
                size: 24,
                color: "#fff",
                centered: false,
                maxHeight: 30,
                maxWidth: 100
            });
            resultLbl = createTextLbl(self, {
                text: $.client.getLocalizedString("TEXT_RESULT", true).toUpperCase(),
                x: 300,
                y: 490,
                font: "ProximaNova",
                size: 18,
                color: "#878787",
                centered: true,
                maxHeight: 55,
                maxWidth: 80
            });
            betLbl = createTextLbl(self, {
                text: $.client.getLocalizedString("TEXT_BET", true).toUpperCase(),
                x: 395,
                y: 490,
                font: "ProximaNova",
                size: 18,
                color: "#878787",
                centered: true,
                maxHeight: 55,
                maxWidth: 90
            });
            winLbl = createTextLbl(self, {
                text: $.client.getLocalizedString("TEXT_WIN", true).toUpperCase(),
                x: 490,
                y: 490,
                font: "ProximaNova",
                size: 18,
                color: "#878787",
                centered: true,
                maxHeight: 55,
                maxWidth: 80
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
                betText = self.add.text(posX + 115, posY + 13, $.client.UserData.CurrencySign + betAmount, { font: "18px ProximaNova", fill: "#fff", align: "center" });
                betText.anchor.x = Math.round(betText.width * 0.5) / betText.width;
                historyPopup.addChild(betText);
                var winAmount = item.winAmount % 1 == 0 ? parseFloat(item.winAmount).toFixed(0) : parseFloat(item.winAmount).toFixed(2);
                winAmount = winAmount > 9999 ? kFormater(winAmount) : winAmount;
                winText = self.add.text(posX + 205, posY + 13, $.client.UserData.CurrencySign + winAmount, { font: "18px ProximaNova", fill: "#fff", align: "center" });
                winText.anchor.x = Math.round(winText.width * 0.5) / winText.width;
                historyPopup.addChild(winText);
            }

            var k = 0;
            for (var i = betHistory.length - 1; i >= 0; i--) {
                showRow(betHistory[i], 280, 530 + k * 72);
                k++;
            }
            tableGroup.setAll('inputEnabled', false);
            buttonGroup.setAll('clicked', false);
            historyPopup.scale.set(1.4);
            historyPopup.x = -170;
            historyPopup.y = -200;
        }
    },
    showBigRoad: function(element) {
        var ststs, canselBtn;
        var self = this;
            if (this._statData != undefined) {
                ststs = self._statData.slice();
                if (statDataGroup) {
                    self.showBigData(ststs);
                } else {
                    statPopup = this.add.group();
                    var statBox = this.add.sprite(40, 480, 'bigRoadBg');
                    statPopup.add(statBox);
                    statDataGroup = this.add.group();
                    statPopup.addChild(statDataGroup);
                    self.showBigData(ststs);
                }
            }
    },
    showBigData: function (stats) {
        var self = this;
        statDataGroup.removeAll();
        var j = 0, i = -1, key, lastId, previous, firstRowCount = 0;

        for (var k = 0; k < stats.length; k++) {
            if (i < 19) {
                if (stats[k] == betType.punto)
                    key = 0;
                else if (stats[k] == betType.banco)
                    key = 1;
                else if (stats[k] == betType.tie) {
                    key = 2;
                }
                if (previous == stats[k]) {
                    j++;
                } else {
                    if (i == 0)
                        firstRowCount = k;
                    j = 0;
                    i++;
                }
                previous = stats[k];
                statDataGroup.create(83 + i * 30, 518 + j * 30, 'bigRoadItem', key);
                lastId = i;
            } else {
                if (lastId != stats.length - 1) {
                    self.showBigData(stats.splice(firstRowCount, stats.length - 1));
                    break;
                }
            }
        }
    },
    closeHistoryPopup: function() {
        historyPopup.destroy();
        isModalShow = false;
        tableGroup.setAll('inputEnabled', true);
        buttonGroup.setAll('clicked', true);
    },
    closeStatPopup: function() {
        statPopup.destroy();
        statDataGroup.destroy();
        statDataGroup = null;
    },
    updateStatistics: function() {
        var self = this;

        $.client.sendPost(JSON.stringify({
                type: "stats"
            }), function(responce) {
                if (responce.IsSuccess) {
                    self._statData = responce.ResponseData.data;
                    self.showBigRoad(self._statData.slice());
                }
            }, function(err) {
                setTimeout(function() {
                    this.updateStatistics();
                }, 1000);
                console.log(err);
            });
    },
    changeStatus: function (text, statusIndex, showModal, timeout) {
        var tDiff = new Date(new Date().getTime() - lastChangeStatus).getTime() / 1000;
        var self = this;
        if (timeout > 0) {
            self.stateTimeout = setTimeout(function () {
                if (self.previousState)
                    self.changeStatus(self.previousState.text, self.previousState.statusIndex, self.previousState.showModal);
            }, timeout);
        } else {
            if (self.stateTimeout)
                clearTimeout(self.stateTimeout);
            self.previousState = { text: text, statusIndex: statusIndex, showModal: showModal };
        }
        if (infoText != undefined) {
            if (tDiff < 1 && self.previousState.text != text) {
                self.newStateTimeout = setTimeout(function () {
                    self.changeStatus(text, statusIndex);
                }, tDiff + 1000);
            } else {
                lastChangeStatus = new Date().getTime();
                self.previousStatusIndex = statusIndex;
                infoText.setTitle(text.toUpperCase());
                tableStatus.loadTexture('statusBg', statusIndex);
            }
        }
    },
    createTimer: function (totalTime, endCallback, updateCallback) {
        var timer;
        timerSprite.totalTime = totalTime;
        timerSprite.time = totalTime;
        timerSprite.endCallback = endCallback;
        timerSprite.updateCallback = updateCallback;
        timerSprite.bg = worldGroup.create(15, 1133, 'timer', 0);
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
                clearInterval(timerSprite.timer);
                timerSprite.bg.alpha = 0;
                timerSprite.text.setText('');
                if (timerSprite.endCallback)
                    timerSprite.endCallback();
            }
        };
        timerSprite.stop = function () {
            timerSprite.bg.alpha = 0;
            timerSprite.text.setText('');
            timerSprite.time = 0;
            timerSprite.totalTime = 0;
            clearInterval(timerSprite.timer);
        };
        timerSprite.start = function (time, end, update) {
            timerSprite.time = 0;
            clearInterval(timerSprite.timer);
            timerSprite.endCallback = end;
            timerSprite.updateCallback = update;
            timerSprite.totalTime = time;
            timerSprite.time = time;
            timerSprite.timer = setInterval(function () {
                timerSprite.time--;
                timerSprite.update(timerSprite.time);
            }, 1000);
        };
        timerSprite.start(timerSprite.time, timerSprite.endCallback, timerSprite.updateCallback);
        return timerSprite;
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
