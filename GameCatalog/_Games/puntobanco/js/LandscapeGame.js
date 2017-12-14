
var GAMESTATE_CODE_TABLE_CLOSED = 0,
    GAMESTATE_CODE_TABLE_OPENED = 1,
    GAMESTATE_CODE_WINNING_NUMBER = 2,
    GAMESTATE_CODE_WINNING_SUM = 4,
 
    TABLE_MIN_BET, TABLE_MAX_BET,
    PUNTO_MIN_BET, PUNTO_MAX_BET,
    TIE_MIN_BET, TIE_MAX_BET,
    BANCO_MIN_BET, BANCO_MAX_BET,
    
    USER_BALANCE = 0 ;
    TOTAL_LOST = 0;
var betType = {
        punto: 0,
        tie: 1,
        banco: 2
       };

var dib_cost = [0.1, 1, 5, 10, 25, 50],
    NUM_DIB = dib_cost.length - 1,
    selectedChipId=0,
    table, summaDeb = 0,
    tableStatus, infoText, timerText;

var Bets ={};
var timerSprite = {}, timerObj;
var betHistory = [];

var winNumInfo ={}, msgBoxPopup, msgBoxTween, limitPopup,limitSelectionPopup, limitPopupTween, statPopup,historyPopup, statPopupTween, selectedLimits =[];
var cellName, betName, borderPosArr;

var tableChips = [];
var limits = [];
var previousBetChips = [];
var roundBetChips = [];
var lastRevive = 0;
var limitBtnText, confirmLimitBtn,cashierBtn,provablyBtn;

var userNameText, USER_NAME, headerBetInputVal, headerBalansInputVal, headerWinInputVal;
var gameFrame, winNum, placeHold, timer;
var _winNumUpdate, progressText, _videoFlagShow, isModalShow, isSubmiting, bigRoadText;

var worldGroup = {}, tableGroup = {}, chipsGroup = {}, buttonGroup = {}, selectedChipsGroup = {},
    frameGroup = {}, footerGroup = {}, winTextGroup = {}, limitGroup = {}, cursorGroup = {}, statDataGroup=null;
var tableCell = {}, PuntoLandscapeGame = {};
var previousMsgType, winAmount = 0,gameStatus,lastChangeStatus, timeToEnd;
var chipCursor, cursorVisible = false, startGameBtn,settingsBtn;

PuntoLandscapeGame.Boot = function (game) {       
};

PuntoLandscapeGame.Boot.prototype = {
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

PuntoLandscapeGame.Preloader = function (game) {

    this.background = null;
    this.ready = false;
};

PuntoLandscapeGame.Preloader.prototype = {
    
    preload: function () {
        this.game.stage.backgroundColor = '#fff';
        this.load.image('gameFrame', 'images/pad_game_frame.png');
        this.load.image('mainBtnBg', 'images/pad_game_btn_bg.png');
        this.load.image('cell_select', 'images/cell_select.png');
        this.load.image('closeBtn', 'images/modal_close_btn.png');
        this.load.image('historyBg', 'images/history_bg.png');
        this.load.image('limitsBg', 'images/limit_bg.png');
        this.load.image('modalBg', 'images/modal_bg.png');
        this.load.image('pbBg', 'images/pad_pb_bg.png');
        this.load.image('btnBg', 'images/pad_btn_bg.png');
        this.load.image('bigRoadBg', 'images/pad_big_road_bg.png');
        this.load.image('settingsBox', 'images/settings_form.png');
        this.load.image('cashin', 'images/cashin.png');
        this.load.image('listSelector', 'images/listSelector.png');
        this.load.image('limitsSelectorBg', 'images/limitsSelectorDesktop.png');
        this.load.image('homeIco', 'images/home.png');
        this.load.spritesheet('timer', 'images/timer.png', 60, 60);
        this.load.spritesheet('bigRoadItem', 'images/big_road_item.png', 15, 16);
        this.load.spritesheet('statusBg', 'images/status_bg.png', 1600, 61);
        this.load.spritesheet('icons', 'images/btn_icons.png', 40, 27);
        this.load.spritesheet('bottomBtnBg', 'images/pad_bottom_btn_bg.png', 173, 71);
        this.load.spritesheet('chips', 'images/chips.png', 85, 85);
        this.load.spritesheet('checkBox', 'images/check_box.png', 72, 32);
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

PuntoLandscapeGame.MainMenu = function(game){ 
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

PuntoLandscapeGame.MainMenu.prototype = {    
    update: function() {
        if (cursorVisible) {
            cursorGroup.x = game.input.x - 45;
            cursorGroup.y = game.input.y - 41;
            cursorGroup.alpha = 1;
        } else {
            cursorGroup.alpha = 0;
        }
    },
    create: function() {
        var self = this;
        var bottomBetLabel, balansLabel, winLabel,
             limitBtn, statsBtn, historyBtn,
             chipsEl, table;

        var  cancelLastBtn, cancelAllBetBtn, repeatBetBtn;

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

        worldGroup.add(tableGroup);
        footerGroup.add(winTextGroup);

        worldGroup.add(frameGroup);
        worldGroup.add(buttonGroup);
        worldGroup.add(limitGroup);
        worldGroup.add(footerGroup);
        gameFrame = this.add.sprite(0, 0, 'gameFrame');
    
        frameGroup.add(gameFrame);
        worldGroup.add(cursorGroup);
        for (var a = 0; a <= NUM_DIB; a++) {
            dib_cost[a] = dib_cost[a] * $.client.UserData.CurrencyMultiplier;
        }
        var name = USER_NAME ? USER_NAME.toUpperCase().length < 12 ? USER_NAME.toUpperCase() : USER_NAME.toUpperCase().substr(0, 12) + '...' : "";
        userNameText = this.add.text(25, gameFrame.height - 56, name, {
            font: "22px ProximaNova",
            fill: "#808080"
        });
        footerGroup.add(userNameText);

        balansLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_BALANCE", true).toUpperCase(),
            x: gameFrame.width - 300,
            y: gameFrame.height - 52,
            font: "ProximaNova",
            size: 20,
            color: "#808080",
            centered: false,
            wordWrapWidth: 100,
            maxHeight: 50,
            maxWidth: 100
        });
        footerGroup.add(balansLabel);

        headerBalansInputVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + USER_BALANCE,
            x: gameFrame.width - 145,
            y: gameFrame.height - 55,
            font: "ProximaNova",
            size: 23,
            color: "#e4a345",
            centered: true,
            maxHeight: 25,
            maxWidth: 220-balansLabel.width
        });
        footerGroup.add(headerBalansInputVal);
        cashierBtn = this.add.button(gameFrame.width - 57, gameFrame.height - 60, 'cashin', function () {
            $.client.cashier();
        }, this);
        cashierBtn.scale.set(0.7);
        cashierBtn.input.useHandCursor = true;
        cashierBtn.clicked = true;

        bottomBetLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_BET", true).toUpperCase(),
            x: gameFrame.width - 500,
            y: gameFrame.height - 55,
            font: "ProximaNova",
            size: 23,
            color: "#808080",
            centered: false,
            wordWrapWidth: 90,
            maxHeight: 50,
            maxWidth: 100
        });
        footerGroup.add(bottomBetLabel);
        headerBetInputVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + '0',
            x: gameFrame.width - 360,
            y: gameFrame.height - 55,
            font: "ProximaNova",
            size: 23,
            color: "#e4a345",
            centered: true,
            maxHeight: 23,
            maxWidth: 130 - bottomBetLabel.width
        });
        footerGroup.add(headerBetInputVal);

        winLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("Win", true).toUpperCase(),
            x: gameFrame.width - 710,
            y: gameFrame.height - 55,
            font: "ProximaNova",
            size: 23,
            color: "#808080",
            centered: false,
            wordWrapWidth: 90,
            maxHeight: 23,
            maxWidth: 90
        });
        footerGroup.add(winLabel);
        headerWinInputVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + '0',
            x: gameFrame.width - 580,
            y: gameFrame.height - 55,
            font: "ProximaNova",
            size: 23,
            color: "#e4a345",
            centered: true,
            maxHeight: 25,
            maxWidth: 140 - winLabel.width
        });
        footerGroup.add(headerWinInputVal);

        tableStatus = this.add.sprite(10, gameFrame.height - 158, 'statusBg', 0);
        tableStatus.width = 540;
        frameGroup.add(tableStatus);

        infoText = createTextLbl(self, {
            text: $.client.getLocalizedString("PLEASE WAIT FOR THE NEXT OPEN TABLE", true).toUpperCase(),
            x: tableStatus.x + 270,
            y: tableStatus.y + 14,
            font: "ProximaNova",
            size: 32,
            color: "#fff",
            centered: true,
            maxHeight: 40,
            maxWidth: 500
        });
        frameGroup.add(infoText);

        repeatBetBtn = this.add.button(560, 845, 'mainBtnBg', this.repeatBets, this);
        repeatBetBtn.input.useHandCursor = true;
        repeatBetBtn.clicked = true;
        createTextLbl(self, {
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

        cancelAllBetBtn = this.add.button(710, 845, 'mainBtnBg', this.cancelAllBet, this);
        cancelAllBetBtn.input.useHandCursor = true;
        cancelAllBetBtn.clicked = true;
        cancelAllBetBtn.width = 180;
        createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_CANCEL_ALL_BET", true).toUpperCase(),
            x: cancelAllBetBtn.x + cancelAllBetBtn.width / 2,
            y: cancelAllBetBtn.y + 11,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight: cancelAllBetBtn.height - 10,
            maxWidth: cancelAllBetBtn.width - 10
        });
        buttonGroup.add(cancelAllBetBtn);
        cancelLastBtn = this.add.button(900, 845, 'mainBtnBg', this.cancelLastBet, this);
        cancelLastBtn.input.useHandCursor = true;
        cancelLastBtn.clicked = true;
        cancelLastBtn.width = 180;
        createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_CANCEL_LAST_BET", true).toUpperCase(),
            x: cancelLastBtn.x + cancelLastBtn.width / 2,
            y: cancelLastBtn.y + 11,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight: cancelLastBtn.height - 10,
            maxWidth: cancelLastBtn.width - 10
        });
        buttonGroup.add(cancelLastBtn);

        historyBtn = this.add.button(530, 917, 'bottomBtnBg', this.showHistory, this, 1, 1);
        historyBtn.input.useHandCursor = true;
        historyBtn.clicked = true;
        createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_HISTORY", true).toUpperCase(),
            x: historyBtn.x + historyBtn.width/2,
            y: historyBtn.y + 25,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight: historyBtn.height - 10,
            maxWidth: historyBtn.width - 20
        });
        buttonGroup.add(historyBtn);

        limitBtn = this.add.button(368, 917, 'bottomBtnBg', this.showLimits, this, 1, 1);
        limitBtn.clicked = true;
        limitBtn.input.useHandCursor = true;
        createTextLbl(self, {
            text: $.client.getLocalizedString("Info", true).toUpperCase(),
            x: limitBtn.x + 92,
            y: limitBtn.y + 25,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight: limitBtn.height - 10,
            maxWidth: limitBtn.width - 20
        });
       
        buttonGroup.add(limitBtn);

        statsBtn = this.add.button(204, 917, 'bottomBtnBg', this.showBigRoad, this, 1, 0);
        statsBtn.clicked = true;
        statsBtn.input.useHandCursor = true;
        bigRoadText=createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_BIG_ROAD", true).toUpperCase(),
            x: statsBtn.x + 92,
            y: statsBtn.y + 25,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight: statsBtn.height - 10,
            maxWidth: statsBtn.width - 20
        });
        buttonGroup.add(statsBtn);

        settingsBtn = this.add.button(694, 917, 'bottomBtnBg', function () {
            if (settingsBtn.isOpen) {
                settingsBtn.isOpen = false;
                self.closeSettingsPopup();
            } else {
                self.showSettings();
                settingsBtn.isOpen = true;
            }
        }, this, 1, 1);
        settingsBtn.clicked = true;
        settingsBtn.input.useHandCursor = true;
        createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_SETTINGS", true).toUpperCase(),
            x: settingsBtn.x + settingsBtn.width / 2,
            y: settingsBtn.y + 25,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight: settingsBtn.height - 10,
            maxWidth: settingsBtn.width - 20
        });
        /*this.add.sprite(settingsBtn.x + 20, settingsBtn.y + 22, 'icons', 0);*/
        buttonGroup.add(settingsBtn);

        provablyBtn = this.add.group();
        var provablyBtnBg = this.add.button(20, 30, 'mainBtnBg', function () {
            $.client.showProvablyFair();
        }, this);
        provablyBtnBg.clicked = false;
        provablyBtnBg.input.useHandCursor = true;
        var provablyBtnTxt = createTextLbl(self, {
            text: $.client.getLocalizedString("Provably fair", true),
            x: provablyBtnBg.x + provablyBtnBg.width / 2,
            y: provablyBtnBg.y + 12,
            font: "ProximaNova",
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

        startGameBtn = this.add.group();
        var startGameBtnBg = this.add.button(game.width - 245, 755, 'mainBtnBg', this.startGame, this);
        startGameBtnBg.clicked = true;
        startGameBtnBg.width = 220;
        startGameBtnBg.input.useHandCursor = true;
        var startGameBtnTxt = createTextLbl(self, {
            text: $.client.getLocalizedString("Start game", true).toUpperCase(),
            x: startGameBtnBg.x + startGameBtnBg.width / 2,
            y: startGameBtnBg.y + 12,
            font: "ProximaNova",
            size: 25,
            color: "#c2c2c2",
            centered: true,
            maxHeight: 60,
            maxWidth: startGameBtnBg.width - 10
        });
        startGameBtn.btn = startGameBtnBg;
        startGameBtn.add(startGameBtnBg);
        startGameBtn.add(startGameBtnTxt);
        footerGroup.add(startGameBtn);
        startGameBtn.alpha = 0;
        if (isMobile.pad())
            this.add.button(1290, 15, 'homeIco', function () {
                $.client.toHome();
            }, this);

        for (var a = 0; a <= NUM_DIB; a++) {
            if (a == selectedChipId) {
                chipsEl = chipsGroup.create(gameFrame.width - 527 + (a * 84), 835, 'chips', a + 6);
            } else {
                chipsEl = chipsGroup.create(gameFrame.width - 527 + (a * 84), 835, 'chips', a);
            }
            chipsEl.debValue = dib_cost[a];
            chipsEl.id = a;
            chipsEl.rY = chipsEl.y;
            chipsEl.rX = chipsEl.x;
            chipsEl.inputEnabled = true;
            chipsEl.input.useHandCursor = true;
            chipsEl.events.onInputDown.add(this.changeChips, this);
            chipsEl.chipText = this.add.text(chipsEl.x + 42, chipsEl.y + 28, dib_cost[a] > 999 ? kFormater(dib_cost[a]) : dib_cost[a], {
                      font: "26px ProximaNova",
                      fill: "#fff"
                  });
            chipsEl.chipText.anchor.x = Math.round(chipsEl.chipText.width * 0.5) / chipsEl.chipText.width;
            chipsGroup.add(chipsEl.chipText);
        }
        chipCursor = cursorGroup.create(20, 20, 'chips', selectedChipId);
        chipCursor.width = 50;
        chipCursor.height = 50;
        chipCursor.text = this.add.text(chipCursor.x + 25, chipCursor.y + 12, dib_cost[selectedChipId] > 999 ? kFormater(dib_cost[selectedChipId]) : dib_cost[selectedChipId], {
            font: "22px ProximaNova",
            fill: "#fff"
        });
        chipCursor.text.anchor.x = Math.round(chipCursor.text.width * 0.5) / chipCursor.text.width;
        cursorGroup.add(chipCursor);
        cursorGroup.add(chipCursor.text);
        cursorGroup.alpha = 0;
        self.changeChips({ id: selectedChipId });

        table = this.add.sprite(1350, 0, 'pbBg');
        table.height=900;
        tableGroup.add(table);

        var puntoBtn= {}, tieBtn= {},bancoBtn= {};
        puntoBtn.bg = this.add.sprite(table.x + 27, table.y + 27, 'btnBg');
        puntoBtn.bg.height = 240;
        puntoBtn.select = this.add.sprite(table.x + 27, table.y + 27, 'cell_select');
        puntoBtn.text = createTextLbl(self, {
            text: $.client.getLocalizedString("Punto", true).toUpperCase(),
            x: puntoBtn.bg.x + puntoBtn.bg.width / 2,
            y: puntoBtn.bg.y + puntoBtn.bg.height / 2-10,
            font: "ProximaNova",
            size: 32,
            color: "#fff",
            centered: true,
            maxHeight: puntoBtn.bg.height-10,
            maxWidth: puntoBtn.bg.width - 10
        });
        puntoBtn.select.alpha = 0;
        puntoBtn.select.width = 220;
        puntoBtn.select.height = 240;
        puntoBtn.select.type = betType.punto;
        puntoBtn.select.inputEnabled = true;
        puntoBtn.select.events.onInputDown.add(this.betClick, this);
        puntoBtn.select.events.onInputOver.add(this.betOver, this);
        puntoBtn.select.events.onInputOut.add(this.betOut, this);
        tableGroup.add(puntoBtn.bg);
        tableGroup.add(puntoBtn.text);
        tableGroup.add(puntoBtn.select);

        tieBtn.bg = this.add.sprite(table.x + 27, table.y + 270, 'btnBg');
        tieBtn.bg.height = 220;
        tieBtn.select = this.add.sprite(table.x + 27, table.y + 270, 'cell_select');
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
        tieBtn.select.width = 220;
        tieBtn.select.height = 220;
        tieBtn.select.type = betType.tie;
        tieBtn.select.inputEnabled = true;
        tieBtn.select.events.onInputDown.add(this.betClick, this);
        tieBtn.select.events.onInputOver.add(this.betOver, this);
        tieBtn.select.events.onInputOut.add(this.betOut, this);
        tableGroup.add(tieBtn.bg);
        tableGroup.add(tieBtn.text);
        tableGroup.add(tieBtn.select);

        bancoBtn.bg = this.add.sprite(table.x + 27, table.y + 494, 'btnBg');
        bancoBtn.bg.height = 240;
        bancoBtn.select = this.add.sprite(table.x + 27, table.y + 494, 'cell_select');
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
        bancoBtn.select.height = 235;
        bancoBtn.select.type = betType.banco;
        bancoBtn.select.inputEnabled = true;
        bancoBtn.select.events.onInputDown.add(this.betClick,this);
        bancoBtn.select.events.onInputOver.add(this.betOver, this);
        bancoBtn.select.events.onInputOut.add(this.betOut, this);
        tableGroup.add(bancoBtn.bg);
        tableGroup.add(bancoBtn.text);
        tableGroup.add(bancoBtn.select);

        tableGroup.alpha = 0.75;
        window.addEventListener('resize', function () {
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
                    chip.scale.set(1 + sDif / 2, 1 - sDif / 2);
                    chip.x = chip.rX - Math.abs(chip.width - chip.width * (1 + sDif / 4));
                    var sCoff = 0;
                    if (chip.id == selectedChipId) {
                        sCoff = 10;
                    }
                    chip.y = chip.rY - sCoff + Math.abs(chip.height - chip.height * (1 + sDif / 4));
                } else {
                    chip.scale.set(1 - sDif / 2, 1 + sDif / 2);
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
    removeLossesBet: function (winNumber) {
        var items = [];
        if (tableChips.length > 0) {
            for (var i = 0; i < tableChips.length; i++) {
                var betChip = tableChips[i];
                if (betChip.bet.type!=winNumber) {
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
    resetTable: function () {
        if (selectedChipsGroup.children && selectedChipsGroup.children.length > 0) {
            selectedChipsGroup.removeChildren();
        } 
        if(headerBetInputVal !== undefined){
            headerBetInputVal.setTitle('0');    
        }        
        tableChips = [];
        summaDeb = 0;  
        if(placeHold !== undefined){
            placeHold.kill();
        } 
        headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
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
    getAmountDeb: function () {
         return dib_cost[selectedChipId];
     },
    clearAllBet: function (element) {
            if (tableChips.length > 0) {
                for (var i = 0; i < tableChips.length; i++) {
                    var bet = tableChips[i];
                    if (bet['sent'] == undefined) {
                        var chip = bet.chip;
                        chip.destroy();
                        if (summaDeb > 0) {
                            summaDeb = parseFloat(summaDeb - bet.amount).toFixed(2);
                        }
                        else {
                            summaDeb = 0;
                        }
                        headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
                    }
                }
                tableChips = $.grep(tableChips, function (n, i) {
                    return (n.sent);
                });
            }            
    },
    cancelAllBet: function (element) {
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
    clearLastBet: function (element){
                if(tableChips.length>0 && !tableChips[tableChips.length-1]['sent']){ 
                        var bet = tableChips.pop();
                        var chip = bet.chip;
                        chip.destroy();               
                      
                        if (summaDeb>0){                                                                        
                            summaDeb = parseFloat(summaDeb - bet.amount).toFixed(2);
                            headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
                        }
                        else{
                            summaDeb = 0;
                        }
                    }
    },
    repeatBets: function (element) {
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

                            for (var k = 0; k < tableChips.length; k++) {
                                if (tableChips[k].bet.type == bet.type) {
                                    chipAmount += tableChips[k].amount;
                                }
                            }
                            chipAmount = chipAmount % 1 == 0 ? chipAmount : parseFloat(chipAmount).toFixed(1);

                            bet.chipText = this.add.text(50, 33, (chipAmount > 999 ? kFormater(chipAmount, 1) : chipAmount), {
                                font: "35px ProximaNova",
                                fill: "#fff"

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
    confirmBet: function (element) {
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
                                self.changeStatus($.client.getLocalizedString('TEXT_INFO_BET_CONFIRMED', true), 0, false, 2000);
                                for (var i = 0; i < responce.ResponseData.bets.length; i++) {
                                    if (notSentChipsArray[i])
                                        notSentChipsArray[i].sent = responce.ResponseData.bets[i].wasMade;
                                }
                                previousBetChips = $.grep(tableChips, function (n, i) {
                                    return (n.sent);
                                });
                            } else if (responce.ResponseData.error) {
                                self.clearAllBet(false);
                                self.changeStatus($.client.getLocalizedString('TEXT_INFO_BET_NOT_CONFIRMED', true), 0, false, 2000);
                            } else {
                                self.clearAllBet(false);
                                self.changeStatus($.client.getLocalizedString('TEXT_INFO_BET_NOT_CONFIRMED', true), 0, false, 2000);
                            }
                        } else {
                            self.clearAllBet(false);
                            self.changeStatus($.client.getLocalizedString('TEXT_INFO_BET_NOT_CONFIRMED', true), 0, false, 2000);
                        }
                        isSubmiting = false;
                    }, function(err) {
                        self.clearAllBet(false);
                        isSubmiting = false;
                        self.changeStatus($.client.getLocalizedString('TEXT_INFO_BET_NOT_CONFIRMED', true), 0, false, 2000);
                        console.log(err);
                    });
            }
        } else {
            setTimeout(function(){
                self.confirmBet();
            },100);
        }
    },    
    checkLimit: function (par){
        var name, type, amount,errText, cellTotalAmount = 0, totalAmount;
        var valid=true;
        var validAmount = 0;
        var self=this;
        function formatLimitAmount(amount) {
            if (amount > 9999) {
                return kFormater(amount);
            } else {
                return amount % 1 == 0 ? parseFloat(amount).toFixed(0) : parseFloat(amount).toFixed(1);
            }
        }
        if(par.name != undefined && par.type != undefined && par.amount != undefined){ 
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
                errText=$.client.getLocalizedString('TEXT_ERROR_NO_MONEY_MSG', true);
                validAmount = USER_BALANCE - (totalAmount - amount);
                valid = false;
            }else if(totalAmount > TABLE_MAX_BET){
                errText=$.client.getLocalizedString('Table_limits', true, { min: formatLimitAmount(TABLE_MIN_BET), max: formatLimitAmount(TABLE_MAX_BET),sign:$.client.UserData.CurrencySign});
                validAmount = TABLE_MAX_BET - (totalAmount-amount);
                valid = false;
            } else if(totalAmount < TABLE_MIN_BET){
                errText=$.client.getLocalizedString('Table_limits', true, { min: formatLimitAmount(TABLE_MIN_BET), max: formatLimitAmount(TABLE_MAX_BET), sign: $.client.UserData.CurrencySign });
                valid = false;
            }
            if (type == betType.punto) {
                    if (cellTotalAmount > PUNTO_MAX_BET) {
                        errText = $.client.getLocalizedString('Punto limits', true, { min: formatLimitAmount(PUNTO_MIN_BET), max: formatLimitAmount(PUNTO_MAX_BET), sign: $.client.UserData.CurrencySign }).toUpperCase();
                        validAmount = validAmount < (PUNTO_MAX_BET - (cellTotalAmount - amount)) && !valid ? validAmount : PUNTO_MAX_BET - (cellTotalAmount - amount);
                        valid = false;
                    } else if (cellTotalAmount < PUNTO_MIN_BET) {
                        errText=$.client.getLocalizedString('Punto limits', true, { min: formatLimitAmount(PUNTO_MIN_BET), max: formatLimitAmount(PUNTO_MAX_BET), sign: $.client.UserData.CurrencySign }).toUpperCase();
                        valid = false;
                    }
                } else if (type == betType.tie) {
                    if (cellTotalAmount < TIE_MIN_BET) {
                        errText=$.client.getLocalizedString('Tie limits', true, { min: formatLimitAmount(TIE_MIN_BET), max: formatLimitAmount(TIE_MAX_BET), sign: $.client.UserData.CurrencySign }).toUpperCase();
                        valid = false;
                    } else if (cellTotalAmount > TIE_MAX_BET) {
                        validAmount = validAmount < (TIE_MAX_BET - (cellTotalAmount - amount)) && !valid ? validAmount : TIE_MAX_BET - (cellTotalAmount - amount);
                        errText=$.client.getLocalizedString('Tie limits', true, { min: formatLimitAmount(TIE_MIN_BET), max: formatLimitAmount(TIE_MAX_BET), sign: $.client.UserData.CurrencySign }).toUpperCase();
                        valid = false;
                    }
                } else if (type == betType.banco) {
                    if (cellTotalAmount < BANCO_MIN_BET) {
                        errText=$.client.getLocalizedString('Banco limits', true, { min: formatLimitAmount(BANCO_MIN_BET), max: formatLimitAmount(BANCO_MAX_BET), sign: $.client.UserData.CurrencySign }).toUpperCase();
                        valid = false;
                    } else if (cellTotalAmount > BANCO_MAX_BET) {
                        validAmount = (validAmount < BANCO_MAX_BET - (cellTotalAmount - amount)) && !valid ? validAmount : BANCO_MAX_BET - (cellTotalAmount - amount);
                        errText=$.client.getLocalizedString('Banco limits', true, { min: formatLimitAmount(BANCO_MIN_BET), max: formatLimitAmount(BANCO_MAX_BET), sign: $.client.UserData.CurrencySign }).toUpperCase();
                        valid = false;
                    }                    
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
        return { state: valid,chips:chips};
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
                if (tableGroup.children[j].inputEnabled ==true && tableGroup.children[j].type === bets[i].betInfo.type)
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
            if (headerBetInputVal !== undefined) {
                summaDeb = parseFloat(summaDeb).toFixed(2);
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

        betChip.chipText = self.add.text(50, 33, (chipAmount > 999 ? kFormater(chipAmount,1) : chipAmount), {
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
    changeChips: function (element) {
            selectedChipId = element.id;
            chipsGroup.forEach(function (item) {
                if (item.key == "chips")
                    if (item.id == selectedChipId) {
                        item.y = item.rY - 10;
                        item.chipText.y = item.rY + 18;
                        item.loadTexture(item.key, item.id + 6);
                    } else {
                        item.y = item.rY;
                        item.chipText.y = item.rY + 28;
                        item.loadTexture(item.key, item.id);
                    }
            });
            chipCursor.loadTexture("chips", selectedChipId);
            chipCursor.text.setText(dib_cost[selectedChipId]);
            this.changeGameSize();
    },
    getLimits: function(element){
        var self = this;
        var clicked = true;

        if(element && element.hasOwnProperty('clicked')){
            clicked = Boolean(element.clicked);
        }
        if(clicked){            
            $.client.sendPost(JSON.stringify({
                type: "get_limits"
            }), function (responce) {
                if (responce.IsSuccess) {
                    limits = responce.ResponseData.limits;
                    selectedLimits = responce.ResponseData.selected;
                    var limitsSelected = false;
                    limits.forEach(function (limit) {
                        if (limit.Id == selectedLimits.Id)
                            limitsSelected = true;
                    });
                    if (limits.length > 1 && !limitsSelected) {
                        selectedLimits = limits[0];
                        if (self.isPlayingForFun) {
                            selectedLimits = limits[0];
                            self.confirmLimit();
                        } else {
                            self.showLimitsSelector();
                        }
                    } else if (limits.length == 1 && !limitsSelected) {
                        selectedLimits = limits[0];
                        self.confirmLimit();
                    } else {
                        TABLE_MIN_BET = parseFloat(selectedLimits["Table"].Min);
                        TABLE_MAX_BET = parseFloat(selectedLimits["Table"].Max);
                        BANCO_MIN_BET = parseFloat(selectedLimits["Banker"].Min);
                        BANCO_MAX_BET = parseFloat(selectedLimits["Banker"].Max);
                        TIE_MIN_BET = parseFloat(selectedLimits["Tie"].Min);
                        TIE_MAX_BET = parseFloat(selectedLimits["Tie"].Max);
                        PUNTO_MIN_BET   = parseFloat(selectedLimits["Player"].Min);
                        PUNTO_MAX_BET = parseFloat(selectedLimits["Player"].Max);
                        self.validateChips();
                    }
                }
            }, function (err) {
                console.log(err);
            });
        }
    },
    showLimitsSelector: function () {
        var limitTitleText;
        var modalBg, cancelBtn;
        var self = this;
        if (!isModalShow) {
            if (limits.length != 0) {
                if (_videoFlagShow) {
                    self.hideVideo();
                }
                isModalShow = true;
                limitSelectionPopup = this.add.group();
                modalBg = this.add.button(0, 0, "modalBg", this.closeLimitSelectionPopup, this);
                modalBg.priorityID = 1;
                modalBg.useHandCursor = false;
                limitSelectionPopup.add(modalBg);

                var limitBox = this.add.sprite(400, 0, 'limitsSelectorBg');
                limitSelectionPopup.add(limitBox);
                limitBox.width = 800;
                limitBox.height = 1000;
                limitSelectionPopup.add(limitBox);
                cancelBtn = this.add.button(1150, 10, 'closeBtn', this.closeLimitSelectionPopup, this);
                cancelBtn.useHandCursor = true;
                limitSelectionPopup.addChild(cancelBtn);
                limitTitleText = createTextLbl(self, {
                    text: $.client.getLocalizedString("Please select limits", true).toUpperCase(),
                    x: 450,
                    y: 30,
                    font: "ProximaNova",
                    size: 37,
                    color: "#fff",
                    centered: false,
                    maxHeight: 30,
                    maxWidth: 300
                });
                limitSelectionPopup.addChild(limitTitleText);

                limitBottomText = limitTitleText = createTextLbl(self, {
                    text: $.client.getLocalizedString("Amount are min/max", true).toUpperCase(),
                    x: 780,
                    y: 950,
                    font: "ProximaNova",
                    size: 26,
                    color: "#fff",
                    centered: true,
                    maxHeight: 30,
                    maxWidth: 200
                });
                limitSelectionPopup.addChild(limitBottomText);
                limitSelectionPopup.addChild(
                    createTextLbl(self, {
                        text: $.client.getLocalizedString("Limit", true).toUpperCase(),
                        x: 520,
                        y: 100,
                        font: "ProximaNova",
                        size: 26,
                        style:"bold",
                        color: "#878787",
                        centered: true,
                        maxHeight: 30,
                        maxWidth: 100
                    }));
                limitSelectionPopup.addChild(
                    createTextLbl(self, {
                        text: $.client.getLocalizedString("Table", true).toUpperCase(),
                        x: 680,
                        y: 100,
                        font: "ProximaNova",
                        size: 26,
                        style: "bold",
                        color: "#878787",
                        centered: true,
                        maxHeight: 30,
                        maxWidth: 100
                    }));
                limitSelectionPopup.addChild(
                          createTextLbl(self, {
                              text: $.client.getLocalizedString("Banco", true).toUpperCase(),
                              x: 840,
                              y: 100,
                              font: "ProximaNova",
                              size: 26,
                              style: "bold",
                              color: "#878787",
                              centered: true,
                              maxHeight: 30,
                              maxWidth: 100
                          }));
                limitSelectionPopup.addChild(
               createTextLbl(self, {
                   text: $.client.getLocalizedString("Tie", true).toUpperCase(),
                   x: 970,
                   y: 100,
                   font: "ProximaNova",
                   size: 26,
                   style: "bold",
                   color: "#878787",
                   centered: true,
                   maxHeight: 30,
                   maxWidth: 100
               }));
                limitSelectionPopup.addChild(
               createTextLbl(self, {
                   text: $.client.getLocalizedString("Punto", true).toUpperCase(),
                   x: 1100,
                   y: 100,
                   font: "ProximaNova",
                   size: 26,
                   style: "bold",
                   color: "#878787",
                   centered: true,
                   maxHeight: 30,
                   maxWidth: 100
               }));
                var selected = selectedLimits;
                var cells = [];
                function showLimitRow(x, y, limit, id) {
                    var cell = self.add.button(x, y - 15, "listSelector", function () {
                        for (var cl in cells) {
                            cells[cl].alpha = 0;
                        }
                        cell.alpha = 1;
                        selected = limits[id];
                        selectedLimits = selected
                        self.closeLimitSelectionPopup();
                    }, this);
                    cells.push(cell);
                    cell.alpha = 0;
                    if (selectedLimits && selectedLimits.Title == limit.Title) {
                        cell.alpha = 1;
                    }
                    cell.width = 720;
                    cell.height = 55;
                    limitSelectionPopup.add(cell);
                    limitSelectionPopup.addChild(self.add.text(x + 10, y, limit.Title.toUpperCase(), {
                        font: "24px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    var tMin = parseFloat(limit.Table.Min) % 1 == 0 ? parseFloat(limit.Table.Min).toFixed(0) : limit.Table.Min.replace(',', '.');
                    var tMax = parseFloat(limit.Table.Max) % 1 == 0 ? parseFloat(limit.Table.Max).toFixed(0) : limit.Table.Max.replace(',', '.');
                    tMin = tMin > 9999 ? kFormater(tMin) : tMin;
                    tMax = tMax > 9999 ? kFormater(tMax) : tMax;
                    var tText = tMin + '/' + tMax;
                    var tableLbl = limitSelectionPopup.addChild(self.add.text(x + 240, y, tText, {
                        font: "24px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    tableLbl.anchor.x = Math.round(tableLbl.width * 0.5) / tableLbl.width;

                    var bMin = parseFloat(limit.Banker.Min) % 1 == 0 ? parseFloat(limit.Banker.Min).toFixed(0) : limit.Banker.Min.replace(',', '.');
                    var bMax = parseFloat(limit.Banker.Max) % 1 == 0 ? parseFloat(limit.Banker.Max).toFixed(0) : limit.Banker.Max.replace(',', '.');
                    bMin = bMin > 9999 ? kFormater(bMin) : bMin;
                    bMax = bMax > 9999 ? kFormater(bMax) : bMax;
                    var bText = bMin + '/' + bMax;
                    var bankerLbl = limitSelectionPopup.addChild(self.add.text(x + 400, y, bText, {
                        font: "24px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    bankerLbl.anchor.x = Math.round(bankerLbl.width * 0.5) / bankerLbl.width;

                    var tMin = parseFloat(limit.Tie.Min) % 1 == 0 ? parseFloat(limit.Tie.Min).toFixed(0) : limit.Tie.Min.replace(',', '.');
                    var tMax = parseFloat(limit.Tie.Max) % 1 == 0 ? parseFloat(limit.Tie.Max).toFixed(0) : limit.Tie.Max.replace(',', '.');
                    tMin = tMin > 9999 ? kFormater(tMin) : tMin;
                    tMax = tMax > 9999 ? kFormater(tMax) : tMax;
                    var tText = tMin + '/' + tMax;
                    var tieLbl = limitSelectionPopup.addChild(self.add.text(x + 525, y, tText, {
                        font: "24px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    tieLbl.anchor.x = Math.round(tieLbl.width * 0.5) / tieLbl.width;

                    var pMin = parseFloat(limit.Player.Min) % 1 == 0 ? parseFloat(limit.Player.Min).toFixed(0) : limit.Player.Min.replace(',', '.');
                    var pMax = parseFloat(limit.Player.Max) % 1 == 0 ? parseFloat(limit.Player.Max).toFixed(0) : limit.Player.Max.replace(',', '.');
                    pMin = pMin > 9999 ? kFormater(pMin) : pMin;
                    pMax = pMax > 9999 ? kFormater(pMax) : pMax;
                    var pText = pMin + '/' + pMax;
                    var pLbl = limitSelectionPopup.addChild(self.add.text(x + 655, y, pText, {
                        font: "24px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    pLbl.anchor.x = Math.round(pLbl.width * 0.5) / pLbl.width;

                }
                for (var i in limits) {
                    showLimitRow(440, i * 60 + 160, limits[i], i);
                }

            }
        }
    },
    closeLimitSelectionPopup: function () {
        isModalShow = false;
        if ((limitPopupTween && limitPopupTween.isRunning)) {
            return;
        }
        this.confirmLimit();
        limitPopupTween = this.add.tween(limitSelectionPopup).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
        limitSelectionPopup.destroy();
        tableGroup.setAll('inputEnabled', true);
    },
    showLimits: function() {
        var limitTitleText;
        var modalBg,cancelBtn;
        var self = this;
        if (!isModalShow) {
            if (limits.length!=0) {
                isModalShow = true;
                limitPopup = this.add.group();
                modalBg = this.add.button(0, 0, "modalBg", null, true);
                modalBg.useHandCursor = false;
                limitPopup.add(modalBg);
                var limitBox = this.add.sprite(500, 220, 'limitsBg');
                limitPopup.add(limitBox);
                var changeBtn = this.add.button(750, 230, 'mainBtnBg', function () {
                    self.closelimitPopup();
                    self.showLimitsSelector();
                }, this);
                limitPopup.add(changeBtn);
                changeBtn.height = 40;
                changeBtn.width = 145;
                var changeText = createTextLbl(self, {
                    text: $.client.getLocalizedString("Change", true).toUpperCase(),
                    x: changeBtn.x+changeBtn.width/2,
                    y: 239,
                    font: "ProximaNova",
                    size: 22,
                    color: "#fff",
                    centered: true,
                    maxHeight: changeBtn.height-5,
                    maxWidth: changeBtn.width-10
                });
                limitPopup.add(changeText);
                changeBtn.clicked = true;
                changeBtn.input.useHandCursor = true;

                cancelBtn = this.add.button(1090, 230, 'closeBtn', this.closelimitPopup, this);
                cancelBtn.useHandCursor = true;
                limitPopup.addChild(cancelBtn);
                if ($.client.UserData.Features && $.client.UserData.Features.rules) {
                var rulesBtn = this.add.button(930, 230, 'mainBtnBg', function () {
                        $.client.showRules();
                    }, this);
                    rulesBtn.height = 40;
                    limitPopup.add(rulesBtn);
                    var rulesText = createTextLbl(self, {
                        text: $.client.getLocalizedString("Rules", true).toUpperCase(),
                        x: rulesBtn.x + rulesBtn.width/2,
                        y: 239,
                        font: "ProximaNova",
                        size: 22,
                        color: "#fff",
                        centered: true,
                        maxHeight: rulesBtn.height - 5,
                        maxWidth: rulesBtn.width - 10
                    });
                    limitPopup.add(rulesText);
                    rulesBtn.clicked = true;
                    rulesBtn.input.useHandCursor = true;
               }

                limitTitleText = createTextLbl(self, {
                    text: $.client.getLocalizedString("BET INFO", true).toUpperCase(),
                    x: 560,
                    y: 260,
                    font: "ProximaNova",
                    size: 24,
                    color: "#fff",
                    centered: false,
                    maxHeight: 30,
                    maxWidth: 150
                });
                limitPopup.addChild(limitTitleText);
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString('Bet name', true).toUpperCase(),
                    x: 610,
                    y: 330,
                    font: "ProximaNova",
                    size: 18,
                    color: "#878787",
                    centered: true,
                    maxHeight: 55,
                    maxWidth: 100
                }));
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString('Min bet', true).toUpperCase(),
                    x: 770,
                    y: 330,
                    font: "ProximaNova",
                    size: 18,
                    color: "#878787",
                    centered: true,
                    maxHeight: 55,
                    maxWidth: 100
                }));
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString('Max bet', true).toUpperCase(),
                    x: 880,
                    y: 330,
                    font: "ProximaNova",
                    size: 18,
                    color: "#878787",
                    centered: true,
                    maxHeight: 55,
                    maxWidth: 100
                }));
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString('Pays', true).toUpperCase(),
                    x: 1010,
                    y: 330,
                    font: "ProximaNova",
                    size: 18,
                    color: "#878787",
                    centered: true,
                    maxHeight: 55,
                    maxWidth: 100
                }));
          
                function showLimitRow(x, y, limit) {
                    limitPopup.addChild(self.add.text(x, y, limit.name.toUpperCase(), {
                        font: "22px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    var min = parseFloat(limit.min) % 1 == 0 ? parseFloat(limit.min).toFixed(0) : limit.min.replace(',', '.');
                    min = min > 9999 ? kFormater(min) : min;
                    var minLbl = limitPopup.addChild(self.add.text(x + 205, y, min, {
                        font: "22px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    minLbl.anchor.x = Math.round(minLbl.width * 0.5) / minLbl.width;
                    var max = parseFloat(limit.max) % 1 == 0 ? parseFloat(limit.max).toFixed(0) : limit.max.replace(',', '.');
                    max = max > 9999 ? kFormater(max) : max;
                    var maxLbl = limitPopup.addChild(self.add.text(x + 315, y, max, {
                        font: "22px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    maxLbl.anchor.x = Math.round(maxLbl.width * 0.5) / maxLbl.width;
                    var rateLbl = limitPopup.addChild(self.add.text(x + 450, y, limit.winRateText, {
                        font: "22px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    rateLbl.anchor.x = Math.round(rateLbl.width * 0.5) / rateLbl.width;
                }
                showLimitRow(560, 380, {
                    name: $.client.getLocalizedString("Punto", true),
                    min: selectedLimits.Player.Min,
                    max: selectedLimits.Player.Max,
                    winRateText: "1:1"
                });
                showLimitRow(560, 440, {
                    name: $.client.getLocalizedString("Tie", true),
                    min: selectedLimits.Tie.Min,
                    max: selectedLimits.Tie.Max,
                    winRateText: "8:1"
                });
                showLimitRow(560, 500, {
                    name: $.client.getLocalizedString("Banco", true),
                    min: selectedLimits.Banker.Min,
                    max: selectedLimits.Banker.Max,
                    winRateText: "19:20"
                });
                showLimitRow(560, 550, {
                    name: $.client.getLocalizedString("Table", true),
                    min: selectedLimits.Table.Min,
                    max: selectedLimits.Table.Max
                });
                limitPopup.scale.set(1.2);
                limitPopup.x = -200;
                limitPopup.y = -100;
            }
        }
    },        
    selectLimitBtn: function(btn){
        if(limitGroup.length>0){            
            limitGroup.forEach(function(item){
                if(item.key ==="limitBtnBg"){
                    item.setFrames(1, 0);
                } 
            });
        }
        
        btn.setFrames(1, 1, 1);        
    },
    confirmLimit: function(element){
        var self = this;
        $.client.sendPost(JSON.stringify({
                type: "put_limits",
                limits:selectedLimits
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
                self.validateChips();
                if (limitPopup && isModalShow)
                    self.closelimitPopup();
            }
        }, function (err) {
            console.log(err);
        });
    },
    showSettings: function (element) {
        var self = this;
        var statTitleText, modalBg, cancelBtn, qualityLbl, soundsLbl, layoutSwitchLbl;
        if (!isModalShow) {
            if (_videoFlagShow) {
                self.showVideo();
            }
            isModalShow = true;
            settingsPopup = this.add.group();
            settingsPopup.clicked = false;
            buttonGroup.setAll('inputEnabled', false);
            var settingsBox = this.add.sprite(750, 400, 'settingsBox');
            settingsBox.height = 180;
            settingsBox.width = 340;
            settingsPopup.add(settingsBox);
            settingsPopup.y = 500;
            settingsPopup.alpha = 0;
            game.add.tween(settingsPopup).to({ y: 340 }, 200, Phaser.Easing.Linear.None, true);
            setTimeout(function () {
                game.add.tween(settingsPopup).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
            }, 100);
            cancelBtn = this.add.button(1047, 400, 'closeBtn', this.closeSettingsPopup);
            var soundBtn = settingsPopup.create(1010, 462, 'checkBox', $.client.getMuteState() ? 1 : 0);
            soundBtn.inputEnabled = true;
            soundBtn.input.useHandCursor = true;
            soundBtn.enabled = !$.client.getMuteState();
            soundBtn.events.onInputDown.add(function () {
                switchSound();
            }, this);

            function switchSound() {
                if (soundBtn.enabled) {
                    soundBtn.loadTexture('checkBox', 1);
                    soundBtn.enabled = false;
                    game.sound.mute = true;
                    $.client.enableSound(false);
                } else {
                    soundBtn.loadTexture('checkBox', 0);
                    soundBtn.enabled = true;
                    game.sound.mute = false;
                    $.client.enableSound(true);
                }
            }

            var currentQuality;
            var qualitiesBox, qualityGroup;


            function showQuailitySelector() {
                if (!qualitiesBox) {
                    qualityGroup = self.add.group();
                    qualitiesBox = self.add.sprite(950, 458, 'settingsBox');
                    qualitiesBox.height = 150;
                    qualitiesBox.width = 120;
                    qualityGroup.add(qualitiesBox);
                    settingsPopup.add(qualityGroup);
                    qualitiesBox.alpha = 0;
                    var tween = game.add.tween(qualitiesBox).to({ x: 1090 }, 200, Phaser.Easing.Linear.None, true);
                    setTimeout(function () {
                        game.add.tween(qualitiesBox).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
                    }, 100);
                    tween.onComplete.add(function () {
                        var qList = $.client.getVideoQualities();
                        var qualityId;
                        for (var i in qList) {
                            var color = "#909090";
                            qualityId = qList[i];
                            if (qualityId === $.client.getVideoQuality())
                                color = '#fff';
                            var quality = createTextLbl(self, {
                                text: $.client.getLocalizedString(qualityId, true).toUpperCase(),
                                x: 1110,
                                y: 470 + i * 35,
                                font: "ProximaNova",
                                size: 22,
                                color: color,
                                centered: false,
                                maxHeight: 30,
                                maxWidth: 100
                            });
                            qualityGroup.add(quality);
                            quality.inputEnabled = true;
                            quality.input.useHandCursor = true;
                            quality.input.priorityID = 2;
                            quality.id = qualityId;
                            quality.events.onInputDown.add(function (event) {
                                currentQuality.setTitle($.client.getLocalizedString(event.id, true).toUpperCase());
                                $.client.setVideoQuality(event.id);
                                qualityGroup.removeAll();
                            }, this);
                        }
                    }, this);
                } else {
                    qualitiesBox.destroy();
                    qualityGroup.removeAll();
                    qualitiesBox = null;
                }
            };
            function showStreamSelector() {
                if (!qualitiesBox) {
                    qualityGroup = self.add.group();
                    qualitiesBox = self.add.sprite(950, 433, 'settingsBox');
                    qualitiesBox.height = 150;
                    qualitiesBox.width = 120;
                    qualityGroup.add(qualitiesBox);
                    settingsPopup.add(qualityGroup);
                    qualitiesBox.alpha = 0;
                    var tween = game.add.tween(qualitiesBox).to({ x: 1090 }, 200, Phaser.Easing.Linear.None, true);
                    setTimeout(function () {
                        game.add.tween(qualitiesBox).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
                    }, 100);
                    tween.onComplete.add(function () {
                        var qList = $.client.getVideoStreams();
                        var qualityId;
                        if (qList.length > 4) {
                            var offset = 35 * (qList.length - 4);
                            qualitiesBox.height += offset;
                            qualitiesBox.y = 433 - offset;
                        }
                        for (var i in qList) {
                            var color = "#909090";
                            qualityId = qList[i];
                            if (qualityId === $.client.getVideoQuality())
                                color = '#fff';
                            var quality = createTextLbl(self, {
                                text: $.client.getLocalizedString(qualityId, true).toUpperCase(),
                                x: 1110,
                                y: qualitiesBox.y+12 + i * 35,
                                font: "ProximaNova",
                                size: 22,
                                color: "#fff",
                                centered: false,
                                maxHeight: 30,
                                maxWidth: 100
                            });
                            qualityGroup.add(quality);
                            quality.inputEnabled = true;
                            quality.input.useHandCursor = true;
                            quality.input.priorityID = 2;
                            quality.id = qualityId;
                            quality.events.onInputDown.add(function (event) {
                                currentStream.setTitle($.client.getLocalizedString(event.id, true).toUpperCase());
                                $.client.changeStream(event.id);
                                qualityGroup.removeAll();
                            }, this);
                        }
                    }, this);
                } else {
                    qualitiesBox.destroy();
                    qualityGroup.removeAll();
                    qualitiesBox = null;
                }
            };

            cancelBtn.useHandCursor = true;
            settingsPopup.addChild(cancelBtn);
            statTitleText = createTextLbl(self, {
                text: $.client.getLocalizedString("Settings", true).toUpperCase(),
                x: 780,
                y: 420,
                font: "ProximaNova",
                size: 26,
                color: "#fff",
                centered: false,
                maxHeight: 30,
                maxWidth: 180
            });
            soundsLbl = createTextLbl(self, {
                text: $.client.getLocalizedString("Enable sound", true).toUpperCase(),
                x: 780,
                y: 470,
                font: "ProximaNova",
                size: 20,
                color: "#808080",
                centered: false,
                maxHeight: 30,
                maxWidth: 180
            });

            soundsLbl.inputEnabled = true;
            soundsLbl.input.useHandCursor = true;
            soundsLbl.enabled = !$.client.getMuteState();
            soundsLbl.events.onInputDown.add(function () {
                switchSound();
            }, this);
            var offset = 0;
            if ($.client.getVideoQualities() && $.client.getVideoQualities().length > 0) {
                offset = 35;
                qualityLbl = createTextLbl(self, {
                    text: $.client.getLocalizedString('Quality', true).toUpperCase(),
                    x: 780,
                    y: 500,
                    font: "ProximaNova",
                    size: 20,
                    color: "#808080",
                    centered: false,
                    maxHeight: 30,
                    maxWidth: 140
                });
                qualityLbl.inputEnabled = true;
                qualityLbl.input.useHandCursor = true;
                qualityLbl.input.priorityID = 2;
                qualityLbl.events.onInputDown.add(function () {
                    showQuailitySelector();
                }, this);
                settingsPopup.addChild(qualityLbl);
                currentQuality = createTextLbl(self, {
                    text: $.client.getLocalizedString($.client.getVideoQuality(), true).toUpperCase(),
                    x: 1075,
                    y: 497,
                    font: "ProximaNova",
                    size: 22,
                    color: "#fff",
                    centered: false,
                    align: "right",
                    maxHeight: 30,
                    maxWidth: 290 - qualityLbl.width
                });
                settingsPopup.addChild(currentQuality);
                currentQuality.inputEnabled = true;
                currentQuality.input.useHandCursor = true;
                currentQuality.input.priorityID = 2;
                currentQuality.events.onInputDown.add(function () {
                    showQuailitySelector();
                }, this);
            }
            if ($.client.getVideoStream() && $.client.getVideoStreams() && $.client.getVideoStreams().length > 0) {
                qualityLbl = createTextLbl(self, {
                    text: $.client.getLocalizedString('Stream', true).toUpperCase(),
                    x: 780,
                    y: 500 + offset,
                    font: "ProximaNova",
                    size: 20,
                    color: "#808080",
                    centered: false,
                    maxHeight: 30,
                    maxWidth: 140
                });
                qualityLbl.inputEnabled = true;
                qualityLbl.input.useHandCursor = true;
                qualityLbl.input.priorityID = 2;
                qualityLbl.events.onInputDown.add(function () {
                    showStreamSelector();
                }, this);
                settingsPopup.addChild(qualityLbl);
                currentStream = createTextLbl(self, {
                    text: $.client.getLocalizedString($.client.getVideoStream(), true).toUpperCase(),
                    x: 1075,
                    y: 498 + offset,
                    font: "ProximaNova",
                    size: 22,
                    color: "#fff",
                    centered: false,
                    align: "right",
                    maxHeight: 30,
                    maxWidth: 290 - qualityLbl.width
                });
                settingsPopup.addChild(currentStream);
                currentStream.inputEnabled = true;
                currentStream.input.useHandCursor = true;
                currentStream.input.priorityID = 2;
                currentStream.events.onInputDown.add(function () {
                    showStreamSelector();
                }, this);
            }

            settingsPopup.addChild(statTitleText);
            settingsPopup.addChild(soundsLbl);

            tableGroup.setAll('inputEnabled', false);
            buttonGroup.setAll('clicked', false);
        }
    },
    closeSettingsPopup: function () {
        settingsPopup.destroy();
        isModalShow = false;
        tableGroup.setAll('inputEnabled', true);
        buttonGroup.setAll('clicked', true);
        buttonGroup.setAll('inputEnabled', true);
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
    closelimitPopup: function(){ 
        isModalShow = false;

        if ((limitPopupTween && limitPopupTween.isRunning)){
            return;
        }        
        
        limitPopupTween =  this.add.tween(limitPopup).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);        
        limitPopup.destroy(); 
        tableGroup.setAll('inputEnabled', true);
        buttonGroup.setAll('clicked', true);
    },
    showHistory: function(element) {
        var self = this;
        var statTitleText, modalBg,cancelBtn, winLbl,betLbl,resultLbl;
        if (!isModalShow) {
            if (_videoFlagShow) {
                self.showVideo();
            }
            isModalShow = true;
            historyPopup = this.add.group();
            historyPopup.clicked = false;;
            modalBg = this.add.button(0, 0, "modalBg", null, true);
            modalBg.useHandCursor = false;
            historyPopup.add(modalBg);
            var historyBox = this.add.sprite(660, 200, 'historyBg');
            historyPopup.add(historyBox);
            cancelBtn = this.add.button(950, 210, 'closeBtn', this.closeHistoryPopup, this);
            cancelBtn.useHandCursor = true;
            historyPopup.addChild(cancelBtn);
            var totalLost = createTextLbl(self, {
                text: $.client.getLocalizedString("Total lost", true).toUpperCase(),
                x: 710,
                y: 537,
                font: "ProximaNova",
                size: 18,
                color: "#878787",
                centered: false,
                maxHeight: 50,
                maxWidth: 160
            });
            var totalLostVal = createTextLbl(self, {
                text: $.client.UserData.CurrencySign + (TOTAL_LOST > 99999 ? kFormater(TOTAL_LOST) : parseFloat(TOTAL_LOST).toFixed(2)),
                x: totalLost.x + totalLost.width + 15,
                y: 537,
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
                text: $.client.getLocalizedString('History', true).toUpperCase(),
                x: 690,
                y: 220,
                font: "ProximaNova",
                size: 24,
                color: "#fff",
                centered: false,
                maxHeight: 30,
                maxWidth: 150
            });
            resultLbl = createTextLbl(self, {
                text: $.client.getLocalizedString('TEXT_RESULT', true).toUpperCase(),
                x: 745,
                y: 290,
                font: "ProximaNova",
                size: 18,
                color: "#878787",
                centered: true,
                maxHeight: 45,
                maxWidth: 75
            });
            betLbl = createTextLbl(self, {
                text: $.client.getLocalizedString('TEXT_BET', true).toUpperCase(),
                x: 835,
                y: 290,
                font: "ProximaNova",
                size: 18,
                color: "#878787",
                centered: true,
                maxHeight: 45,
                maxWidth: 90
            });
            winLbl = createTextLbl(self, {
                text: $.client.getLocalizedString('TEXT_WIN', true).toUpperCase(),
                x: 915,
                y: 290,
                font: "ProximaNova",
                size: 18,
                color: "#878787",
                centered: true,
                maxHeight: 45,
                maxWidth: 80
            });
                historyPopup.addChild(statTitleText);
                historyPopup.addChild(winLbl);
                historyPopup.addChild(betLbl);
                historyPopup.addChild(resultLbl);

                function showRow(item, posX, posY) {
                    var winnerText, betText,winText;
                    winnerText = self.add.text(posX, posY+14, item.winner, { font: "18px ProximaNova", fill: "#fff", align: "center" });
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
                for (var i = betHistory.length-1; i >= 0; i--) {
                    showRow(betHistory[i], 710, 330 + k * 72);
                    k++;
                }
                tableGroup.setAll('inputEnabled', false);
                buttonGroup.setAll('clicked', false);
                historyPopup.scale.set(1.3);
                historyPopup.x = -250;
                historyPopup.y = -100;
        }
    },
    showBigRoad: function(element){
       var ststs, canselBtn;
       var self = this;
       bigRoadText.addColor('#878787',0);
       var statTitleText, cancelBtn, cancelBtnText;
           if(!!element.clicked && !isModalShow){
               if (this._statData != undefined) {
                   if (_videoFlagShow) {
                       self.showVideo();
                   }
                ststs = self._statData.slice();
                statPopup = this.add.group();
                var statBox = this.add.sprite(20, 20, 'bigRoadBg');
                statPopup.add(statBox);
                statDataGroup = this.add.group();

                cancelBtn = this.add.button(670, 30, 'closeBtn', this.closeStatPopup, this, 3, 2, 3);
                cancelBtn.useHandCursor = true;

                statPopup.addChild(cancelBtn);
                statPopup.addChild(statDataGroup);
                self.showBigData(ststs);
            }
        }
    },
    showBigData: function (stats) {
        var self = this;
        statDataGroup.removeAll();
        var j = 0, i = -1, key, lastId, previous,firstRowCount=0;
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
                statDataGroup.create(58 + i * 30, 58 + j * 30, 'bigRoadItem', key);
                lastId = i;
            } else {
                if (lastId != stats.length-1) {
                    self.showBigData(stats.splice(firstRowCount, stats.length-1));
                    break;
                }
            }
        }
},
    closeHistoryPopup: function () {
        historyPopup.destroy(); 
        isModalShow = false;
        tableGroup.setAll('inputEnabled', true);
        buttonGroup.setAll('clicked', true); 
    },
    closeStatPopup: function () {
        statPopup.destroy();
        statDataGroup = null;
        isModalShow = false;
        bigRoadText.addColor('#fff', 0);
        tableGroup.setAll('inputEnabled', true);
        buttonGroup.setAll('clicked', true); 
    },
    updateStatistics: function(){
        var self = this;

        $.client.sendPost(JSON.stringify({
            type: "stats"
        }), function (responce) {
            if (responce.IsSuccess) {
                self._statData = responce.ResponseData.data;
                if (statDataGroup) {
                    self.showBigData(self._statData.slice());
                }
            }
        }, function (err) {
            setTimeout(function() {
                self.updateStatistics();
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
                }, tDiff+1000);
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
        timerSprite.bg = footerGroup.create(15, 844, 'timer', 0);
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
            timerSprite.totalTime = 0;
            clearInterval(timerSprite.timer);
        };
        timerSprite.start = function (time, end, update) {
            timerSprite.stop();
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
    showWinner: function (winAmount) {
        headerWinInputVal.setTitle($.client.UserData.CurrencySign + (winAmount > 99999 ? kFormater(winAmount) : parseFloat(winAmount).toFixed(2)));
    },
    clearWinAmout: function() {
        headerWinInputVal.setTitle($.client.UserData.CurrencySign + 0);
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
