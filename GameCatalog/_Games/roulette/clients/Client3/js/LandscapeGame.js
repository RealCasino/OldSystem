var TABLE_WIDTH = 225,
    TABLE_HEIGHT = 660,
    DIB_WIDTH = 75,
    DIB_HEIGHT = 52.6,
    DIB_SPASE = 0.4,
    TABLE_COLS = Math.floor(TABLE_WIDTH / DIB_WIDTH),
    TABLE_ROWS = Math.floor(TABLE_HEIGHT / DIB_HEIGHT);

    USER_BALANCE = 0 ;
    TOTAL_LOST = 0;

    var arrayNambers = [[1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34], [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35], [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]],
        blackNumberArr = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
        redNumberArr =  [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
        oddNumberArr =  [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35],
        evenNumberArr = [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36],
        zeroNumberArr = [26, 32, 15, 12, 35, 3],
        voisinsNumberArr = [3,0,19,12,15, 4, 21, 2, 25,26, 22, 18, 29, 7, 28,32,35],
        orphelinsNumberArr = [17, 34, 6, 1, 20, 14, 31, 9],
        tiersNumberArr = [27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33];
    
    var betType = {
        straight: 0,
        splitX: 1,
        splitY: 2,
        corner: 3,
        multiSelect: 4,
        arrSelect: 5
       };

var dib_cost = [ 1, 5, 10, 25, 50,100],
    NUM_DIB = dib_cost.length - 1,
    selectedChipId=0,
    table, summaDeb = 0,
    tableStatus, infoText, timerText;

var Bets ={};
var timerSprite = {}, timerObj;

var winNumInfo ={}, msgBoxPopup, msgBoxTween, limitPopup,limitSelectionPopup, limitPopupTween, statPopup,historyPopup, statPopupTween, selectedLimits =[];
var cellName, betName, borderPosArr;

var tableChips = [];
var limits = [];
var currentLimits = {};
var previousBetChips = [];
var roundBetChips = [];
var lastRevive = 0;
var limitBtnText, confirmLimitBtn;

var userNameText, USER_NAME, headerBetInputVal, headerBalansInputVal, headerWinInputVal;
var gameFrame, winNum, placeHold, timer, table, frenchBets, startGameBtnBg, dolly,wheelBg, wheel, ball, wheelGroup;
var _winNumUpdate, progressText, _videoFlagShow, isModalShow,isSubmiting;
var startGameBtn, cashierBtn, provablyBtn, settingsBtn;
var worldGroup = {}, tableGroup = {}, frenchGroup = {}, chipsGroup = {}, buttonGroup = {}, selectedChipsGroup = {},overlayGroup,overlayVisible=true,
    frameGroup = {}, footerGroup = {}, winTextGroup = {}, limitGroup = {}, cursorGroup = {}, msgGroup, msgTimeout;
var tableCell = {},  Dozen ={}, Column = {}, Orphelins = {}, Neighbors = {}, RouletteLandscapeGame = {};
var previousMsgType, winAmount = 0;
var chipCursor, cursorVisible = false, lastChangeStatus;

RouletteLandscapeGame.Boot = function (game) {       
};

RouletteLandscapeGame.Boot.prototype = {
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

RouletteLandscapeGame.Preloader = function (game) {

    this.background = null;
    this.ready = false;
};
RouletteLandscapeGame.Preloader.prototype = {
    preload: function () {
        this.game.stage.backgroundColor = '#fff';
        this.load.image('gameFrame', 'images/pad_game_frame.png');
        this.load.image('table', 'images/pad_table.png');
        this.load.image('mainBtnBg', 'images/pad_game_btn_bg.png');
        this.load.image('frenchBets', 'images/french_bets.png');
        this.load.image('frenchBetsBtn', 'images/french_bets_btn.png');
        this.load.image('cell_select', 'images/cell_select.png');
        this.load.image('zero_cell_select', 'images/zero_cell_select.png');
        this.load.image('numberBg', 'images/number_bg.png');
        this.load.image('closeBtn', 'images/modal_close_btn.png');
        this.load.image('historyBg', 'images/history_bg.png');
        this.load.image('statBg', 'images/stat_bg.png');
        this.load.image('limitsBg', 'images/limit_bg.png');
        this.load.image('modalBg', 'images/modal_bg.png');
        this.load.image('msg_bg', 'images/msg_bg.png');
        this.load.image('settingsBox', 'images/settings_form.png');
        this.load.image('cashin', 'images/cashin.png');
        this.load.image('listSelector', '../Client3/images/listSelector.png');
        this.load.image('homeIco', '../Client3/images/home.png');
        this.load.image('limitsSelectorBg', 'images/limitsSelectorDesktop.png');        
        this.load.image('placeholder', 'images/placeholder.png');

        this.load.image('ball', '../Client3/images/ball.png');
        this.load.image('wheelBg', '../Client3/images/phone_spin_bg_v.png');
        this.load.image('wheel', '../Client3/images/wheel.png');

        this.load.spritesheet('timer', 'images/timer.png', 60, 60);
        this.load.spritesheet('checkBox', 'images/check_box.png', 72, 32);
        this.load.spritesheet('statusBg', 'images/status_bg.png', 1600, 61);
        this.load.spritesheet('icons', 'images/btn_icons.png', 40, 27);
        this.load.spritesheet('bottomBtnBg', 'images/pad_bottom_btn_bg.png', 173, 71);
        this.load.spritesheet('chips', 'images/chips.png', 85, 85);
        this.load.spritesheet('statChartBg', 'images/stat_chart_bg.png', 169, 50);

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
        progressText = this.add.text(this.game.world.centerX, this.game.world.centerY-30, pr, {
            font: "60px Arial",
            fill: "#ffffff"          
        });
        progressText.anchor.x = Math.round(progressText.width * 0.5) / progressText.width;

    }
};

RouletteLandscapeGame.MainMenu = function(game){ 
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

RouletteLandscapeGame.MainMenu.prototype = {
    update: function () {
        if (wheel) {
            wheel.wheelAngle = wheel.angle >= 0 ? wheel.angle : 360 + wheel.angle;
            wheel.ballAngle = ball.angle >= 0 ? ball.angle : 360 + ball.angle;
            wheel.diff = parseInt(wheel.wheelAngle - wheel.ballAngle) + 5;
            wheel.diff = wheel.diff > 0 ? wheel.diff : 360 + wheel.diff;
            if (wheel.number > -1 || wheel.waitNumber) {
                if ((wheel.numberDeg + 6 > wheel.diff && wheel.numberDeg <= wheel.diff)) {
                    var date = new Date();
                    var time = (date - wheel.startTime) / 1000;
                    if (time >= 4) {
                        wheel.number = -1;
                        wheel.pivotX = 120;
                        if (Math.abs(wheel.diff - wheel.numberDeg) > 0.3) {
                            ball.angle += (wheel.diff - wheel.numberDeg) / 2;
                        }
                    } else {
                        wheel.speed -= 0.005;
                    }
                }
                if (!wheel.waitNumber)
                    wheel.pivotX -= 0.305;
                wheel.rotation += wheel.speed;
                ball.rotation -= wheel.speed;
            } else {
                wheel.rotation += 0.03;
                ball.rotation += 0.03;
            }
            ball.pivot.x = wheel.pivotX;
        }
    },

    create: function() {
        TABLE_WIDTH = 191,
        TABLE_HEIGHT = 577,
        DIB_WIDTH = 63,
        DIB_HEIGHT = 47.4,
        DIB_SPASE = 0.4,
        TABLE_COLS = Math.floor(TABLE_WIDTH / DIB_WIDTH),
        TABLE_ROWS = Math.floor(TABLE_HEIGHT / DIB_HEIGHT);
        var self = this;
        var bottomBetLabel, balansLabel, winLabel,
             limitBtn, statsBtn, historyBtn,
             chipsEl;

        var spriteXY, spriteX, spriteY;
        var  cancelLastBtn, cancelAllBetBtn, repeatBetBtn;

        worldGroup = this.add.group();
        worldGroup.add(tableGroup);
        this.scale.setUserScale(SCALE, SCALE);
        this.scale.refresh();
        tableGroup = this.add.group();
        overlayGroup = this.add.group();
        chipsGroup = this.add.group();
        selectedChipsGroup = this.add.group();
        cursorGroup = this.add.group();

        frameGroup = this.add.group();
        footerGroup = this.add.group();
        frenchGroup = this.add.group();
        limitGroup = this.add.group();

        worldGroup.add(frameGroup);
        wheelGroup = this.add.group();
        worldGroup.add(wheelGroup);
        worldGroup.add(tableGroup);
        worldGroup.add(frenchGroup);
        worldGroup.add(footerGroup);
        worldGroup.add(overlayGroup);
        
        footerGroup.add(winTextGroup);

        worldGroup.add(buttonGroup);
        worldGroup.add(limitGroup);
        for (var a = 0; a <= NUM_DIB; a++) {
            dib_cost[a] = dib_cost[a] * $.client.UserData.CurrencyMultiplier;
        }
        worldGroup.add(cursorGroup);
        gameFrame = this.add.sprite(0, 0, 'gameFrame');

        createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_LAST_RESULTS", true).toUpperCase(),
            x: 20,
            y: gameFrame.height - 135,
            font: "ProximaNova",
            size: 22,
            color: "#ddd",
            centered: false,
            maxWidth: 160,
            maxHeight: 45
        });
        var name = USER_NAME ? USER_NAME.toUpperCase().length < 15 ? USER_NAME.toUpperCase() : USER_NAME.toUpperCase().substr(0, 15) + '...' : "";
        userNameText = this.add.text(20, gameFrame.height - 54, name, {
            font: "24px ProximaNova",
            fill: "#ddd"
        });
        footerGroup.add(userNameText);
        balansLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_BALANCE", true).toUpperCase(),
            x: gameFrame.width - 310,
            y: gameFrame.height - 53,
            font: "ProximaNova",
            size: 20,
            color: "#ddd",
            centered: false,
            maxHeight: 50,
            maxWidth: 100
        });
        footerGroup.add(balansLabel);
        headerBalansInputVal  = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + USER_BALANCE,
            x: gameFrame.width - 130,
            y: gameFrame.height - 54,
            font: "ProximaNova",
            size: 22,
            color: "#e4a345",
            centered: true,
            maxHeight: 22,
            maxWidth: 240-balansLabel.width
        });
        headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
        footerGroup.add(headerBalansInputVal);
        cashierBtn = this.add.button(gameFrame.width - 65, gameFrame.height - 62, 'cashin', function () {
            $.client.cashier();
        }, this);
        cashierBtn.scale.set(0.7);
        cashierBtn.input.useHandCursor = true;
        cashierBtn.clicked = true;
        bottomBetLabel= createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_BET", true).toUpperCase(),
            x: gameFrame.width - 485,
            y: gameFrame.height - 53,
            font: "ProximaNova",
            size: 20,
            color: "#ddd",
            centered: false,
            wordWrapWidth: 70,
            maxHeight: 28,
            maxWidth: 90
        });
        footerGroup.add(bottomBetLabel);
        headerBetInputVal = createTextLbl(self, {
            text:$.client.UserData.CurrencySign + '0',
            x: gameFrame.width - 370,
            y: gameFrame.height - 54,
            font: "ProximaNova",
            size: 22,
            color: "#e4a345",
            centered: true,
            maxHeight: 22,
            maxWidth: 120 - bottomBetLabel.width
        });
      
        footerGroup.add(headerBetInputVal);

        winLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("Win", true).toUpperCase(),
            x: gameFrame.width - 665,
            y: gameFrame.height - 53,
            font: "ProximaNova",
            size: 20,
            color: "#ddd",
            centered: false,
            wordWrapWidth: 70,
            maxHeight: 22,
            maxWidth: 90
        });
        footerGroup.add(winLabel);
        headerWinInputVal = createTextLbl(self, {
            text:$.client.UserData.CurrencySign + '0',
            x: gameFrame.width - 550,
            y: gameFrame.height - 54,
            font: "ProximaNova",
            size: 22,
            color: "#e4a345",
            centered: true,
            maxHeight: 22,
            maxWidth: 120 - winLabel.width
        }); 
        footerGroup.add(headerWinInputVal);
       

        tableStatus = this.add.sprite(10, gameFrame.height - 232, 'statusBg', 0);
        frameGroup.add(tableStatus);

        infoText = createTextLbl(self, {
            text: $.client.getLocalizedString("PLEASE WAIT FOR THE NEXT OPEN TABLE", true).toUpperCase(),
            x: tableStatus.x + 810,
            y: tableStatus.y + 10,
            font: "ProximaNova",
            size: 36,
            color: "#fff",
            centered: true,
            maxHeight: 50,
            maxWidth: 600
        })
        frameGroup.add(infoText);

        repeatBetBtn = this.add.button(560, 845, 'mainBtnBg', this.repeatBets, this);
        repeatBetBtn.input.useHandCursor = true;
        repeatBetBtn.clicked = true;
        createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_REPEAT", true).toUpperCase(),
            x: repeatBetBtn.x + 72,
            y: repeatBetBtn.y + 11,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxWidth: 150
        });
        /*this.add.sprite(repeatBetBtn.x + 10, repeatBetBtn.y + 12, 'icons', 3);*/
        buttonGroup.add(repeatBetBtn);

        cancelAllBetBtn = this.add.button(710, 845, 'mainBtnBg', this.cancelAllBet, this);
        cancelAllBetBtn.input.useHandCursor = true;
        cancelAllBetBtn.clicked = true;
        cancelAllBetBtn.width = 180;
        createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_CANCEL_ALL_BET", true).toUpperCase(),
            x: cancelAllBetBtn.x + 90,
            y: cancelAllBetBtn.y + 11,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight:50,
            maxWidth: 170
        });
        /*this.add.sprite(cancelAllBetBtn.x + 3, cancelAllBetBtn.y + 12, 'icons', 5);*/
        buttonGroup.add(cancelAllBetBtn);
        cancelLastBtn = this.add.button(900, 845, 'mainBtnBg', this.cancelLastBet, this);
        cancelLastBtn.input.useHandCursor = true;
        cancelLastBtn.clicked = true;
        cancelLastBtn.width = 180;
        cancelLastLbl=createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_CANCEL_LAST_BET", true).toUpperCase(),
            x: cancelLastBtn.x + 90,
            y: cancelLastBtn.y + 11,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight: 50,
            maxWidth: 170
        });
        /*this.add.sprite(cancelLastBtn.x + 5, cancelLastBtn.y + 12, 'icons', 4);*/
        buttonGroup.add(cancelLastBtn);
        buttonGroup.add(cancelLastLbl);

        historyBtn = this.add.button(580, 917, 'bottomBtnBg', this.showHistory, this, 1, 1);
        historyBtn.input.useHandCursor = true;
        historyBtn.clicked = true;
        createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_HISTORY", true).toUpperCase(),
            x: historyBtn.x + 88,
            y: historyBtn.y + 25,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight: 70,
            maxWidth: 150
        });
        /*this.add.sprite(historyBtn.x + 10, historyBtn.y + 22, 'icons', 1);*/
        buttonGroup.add(historyBtn);

        limitBtn = this.add.button(418, 917, 'bottomBtnBg', this.showLimits, this, 1, 1);
        limitBtn.clicked = true;
        limitBtn.input.useHandCursor = true;
        createTextLbl(self, {
            text: $.client.getLocalizedString("Info", true).toUpperCase(),
            x: limitBtn.x + 88,
            y: limitBtn.y + 25,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight: 70,
            maxWidth: 150
        });
     
        /*this.add.sprite(limitBtn.x + 20, limitBtn.y + 22, 'icons', 2);*/
        buttonGroup.add(limitBtn);

        statsBtn = this.add.button(253, 917, 'bottomBtnBg', this.getStatisticData, this, 1, 1);
        statsBtn.clicked = true;
        statsBtn.input.useHandCursor = true;
        createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_STATISTIC", true).toUpperCase(),
            x: statsBtn.x + 88,
            y: statsBtn.y + 25,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight: 70,
            maxWidth: 150
        });
        /*this.add.sprite(statsBtn.x + 20, statsBtn.y + 22, 'icons', 0);*/
        buttonGroup.add(statsBtn);

        settingsBtn = this.add.button(745, 917, 'bottomBtnBg', function () {
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
            x: settingsBtn.x + 88,
            y: settingsBtn.y + 25,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight: 70,
            maxWidth: 150
        });
       
        /*this.add.sprite(settingsBtn.x + 20, settingsBtn.y + 22, 'icons', 0);*/
        buttonGroup.add(settingsBtn);

        provablyBtn = this.add.group();
        var provablyBtnBg = this.add.button(20, 30, 'mainBtnBg', function() {
            $.client.showProvablyFair();
        }, this);
        provablyBtnBg.clicked = false;
        provablyBtnBg.input.useHandCursor = true;
        var provablyBtnTxt = createTextLbl(self, {
            text: $.client.getLocalizedString("Provably fair", true),
            x: provablyBtnBg.x + 72,
            y: provablyBtnBg.y + 13,
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
        if (isMobile.pad())
        this.add.button(1560, 15, 'homeIco', function() {
            $.client.toHome();
        }, this);
       

        for (var a = 0; a <= NUM_DIB; a++) {
            if (a == selectedChipId) {
                chipsEl = chipsGroup.create(gameFrame.width - 527 + (a * 84), 830, 'chips', a + 6);
            } else {
                chipsEl = chipsGroup.create(gameFrame.width - 527 + (a * 84), 830, 'chips', a);
            }
            chipsEl.debValue = dib_cost[a];
            chipsEl.id = a;
            chipsEl.inputEnabled = true;
            chipsEl.input.useHandCursor = true;
            chipsEl.rY = chipsEl.y;
            chipsEl.rX = chipsEl.x;
            chipsEl.events.onInputDown.add(this.changeChips, this);
            chipsEl.chipText = this.add.text(chipsEl.x + 42, chipsEl.y + 28, dib_cost[a]>999?kFormater(dib_cost[a]):dib_cost[a], {
                      font: "26px ProximaNova",
                      fill: "#fff"
                  });
            chipsEl.chipText.anchor.x = Math.round(chipsEl.chipText.width * 0.5) / chipsEl.chipText.width;
            chipsGroup.add(chipsEl.chipText);
        }
        chipCursor = cursorGroup.create(20, 20, 'chips', selectedChipId);
        chipCursor.width = 50;
        chipCursor.height = 50;
        chipCursor.text = this.add.text(chipCursor.x + 25, chipCursor.y + 12, (dib_cost[selectedChipId] > 999 ? kFormater(dib_cost[selectedChipId]) : dib_cost[selectedChipId]), {
            font: "22px ProximaNova",
            fill: "#fff"
        });
        chipCursor.text.anchor.x = Math.round(chipCursor.text.width * 0.5) / chipCursor.text.width;
        cursorGroup.add(chipCursor);
        cursorGroup.add(chipCursor.text);
        self.changeChips({ id: selectedChipId, chipCursor:chipCursor });
        cursorGroup.alpha = 0;
        checkCursorPosition = function (pointer,sprite) {
            var pX=pointer.x;
            var pY=pointer.y;
            if (pX > sprite.x && pX < (sprite.x + sprite.width) && pY > sprite.y && pY < (sprite.y + sprite.height)) {
                return true;
            } else {
                return false;
            }
        }
        game.input.addMoveCallback(function (pointer) {
            var buttonOver = false;
            if (startGameBtnBg.input.pointerOver() || provablyBtn.btn.input.pointerOver()) {
                buttonOver = true;
            }
            if (!buttonOver && (checkCursorPosition(pointer, table) || (checkCursorPosition(pointer, frenchBets) && frenchGroup.visible))) {
                $("#canvas canvas").addClass('no-cur');
                cursorVisible = true;
            } else {
                $("#canvas canvas").removeClass('no-cur');
                cursorVisible = false;
            }
            if (overlayVisible && cursorVisible && !isMobile.any()) {
                cursorGroup.x = pointer.x  - 45;
                cursorGroup.y = pointer.y  - 41;
                cursorGroup.alpha = 1;
            } else {
                $("#canvas canvas").removeClass('no-cur');
                cursorGroup.alpha = 0;
            }
        });
        window.addEventListener('resize', function () {
            self.changeGameSize();
        });
        if ($.client.streamConfig && $.client.streamConfig.table_data && $.client.streamConfig.table_data.align === "right") {
            self.drawTable(true);
        } else {
            self.drawTable(false);
        }
        self.ready = true;
        setTimeout(function () {
            self.getLimits();
            self.updateStatistics();
        }, 300);
        self.changeGameSize();
        setInterval(function () {
            self.changeGameSize();
        }, 1000);
    },
    showWheel: function () {
        wheelBg = this.add.sprite(10, 10, 'wheelBg');
        wheelBg.width = GAME_WIDTH - 20;
        wheelBg.height = GAME_HEIGHT - 242;
        wheelGroup.add(wheelBg);
        var obj = {};
        var wheelNumberMap = [10, 23, 8, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32, 0, 26, 3, 35, 12, 28, 7, 29, 18, 22, 9, 31, 14, 20, 1, 33, 16, 24, 5];
        wheel = this.add.sprite(810, 370, 'wheel');
        wheelGroup.add(wheel);
        wheel.anchor.setTo(0.5, 0.5);
        wheel.waitNumber = false;
        ball = this.add.sprite(wheel.x, wheel.y, 'ball', 0);
        wheel.pivotX = 120;
        ball.pivot.x = 120;
        obj.spin = function (value) {
            if (value == undefined || value < 0)
                wheel.waitNumber = true;
            else
                wheel.waitNumber = false;
            wheel.number = value;
            wheel.speed = 0.06;
            wheel.startTime = new Date();
            wheel.circle = 4;
            wheel.pivotX = 210;
            wheel.numberDeg = wheelNumberMap.indexOf(wheel.number) * 9.81;
        }
        ball.scale.set(1.4);
        wheelGroup.add(ball);
        if (self.wheelTimeout)
            clearInterval(self.wheelTimeout);
        return obj;
    },
    drawTable: function (moveToRigth) {
        var self = this;
        var frenchBetsBtn, gameIdLabel, dateTimeLabel;
        var table_offset;
        var french_bet_offset;
        var french_btn_offset;
        var round_info_offset;
        if (moveToRigth) {
            table_offset = 1200;
            french_bet_offset = 170;
            french_btn_offset = 0;
            round_info_offset =1130;
        } else {
            table_offset = 0;
            french_bet_offset = 400;
            french_btn_offset = 1400;
            round_info_offset = 1300;
        }
        gameIdLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("Game Id:", true) + " " + MessageDispatcher.gameId,
            x: round_info_offset+50,
            y: 38,
            font: "ProximaNova",
            size: 25,
            color: "#808080",
            centered: false,
            maxHeight: 40,
            maxWidth: 190
        });
        dateTimeLabel = createTextLbl(self, {
            text: $.DateFormat(MessageDispatcher.serverTime.toString(), "yyyy-MM-dd | HH:mm:ss"),
            x: round_info_offset+50,
            y: 12,
            font: "ProximaNova",
            size: 25,
            color: "#808080",
            centered: false,
            maxHeight: 40,
            maxWidth: 190
        });
        if (self.timeInterval)
            clearInterval(self.timeInterval);

        self.timeInterval = setInterval(function () {
            gameIdLabel.setTitle($.client.getLocalizedString("Game Id:", true) + " " + MessageDispatcher.gameId);
            MessageDispatcher.serverTime.setSeconds(MessageDispatcher.serverTime.getSeconds() + 1);
            dateTimeLabel.setTitle($.DateFormat(MessageDispatcher.serverTime.toString(), "yyyy-MM-dd | HH:mm:ss"));
        }, 1000);
        table = tableGroup.create(table_offset+40, 40, 'table');
        frenchBets = this.add.sprite(french_bet_offset+10, 570, 'frenchBets');
        frenchGroup.alpha = 0;
        tableGroup.alpha = 0.85;
        frenchGroup.visible = false;
        frenchGroup.add(frenchBets);
        frameGroup.add(gameFrame);
        frameGroup.add(tableGroup);
        frameGroup.add(chipsGroup);
        overlayGroup.inputEnabled = true;
        overlayGroup.add(frenchGroup);
        overlayGroup.add(tableGroup);
        overlayGroup.add(selectedChipsGroup);
        worldGroup.add(selectedChipsGroup);
        startGameBtnBg = this.add.button(table_offset+20, 700, 'mainBtnBg', this.startGame, this);
        startGameBtnBg.clicked = true;
        startGameBtnBg.input.useHandCursor = true;
        var startGameBtnTxt = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_SPIN", true).toUpperCase(),
            x: startGameBtnBg.x + 69,
            y: startGameBtnBg.y + 26,
            font: "ProximaNova",
            size: 32,
            color: "#fff",
            centered: true,
            maxHeight: 40,
            maxWidth: 130
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
        startGameBtn.btn = startGameBtnBg;
        startGameBtn.add(startGameBtnBg);
        startGameBtn.add(startGameBtnTxt);
        startGameBtn.alpha = 0;
        var frenchText;
        frenchBetsBtn = this.add.button(french_btn_offset+60, 630, 'frenchBetsBtn', function () {
            var tween;
            if (frenchGroup.visible) {
                tween = game.add.tween(frenchGroup).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true);
                if (tableChips.length > 0) {
                    for (var i = 0; i < tableChips.length; i++) {
                        if (tableChips[i].name == "tiers" || tableChips[i].name == 'nZero' || tableChips[i].name == 'voisins' || tableChips[i].name == 'orphelins') {
                            tableChips[i].chip.visible = false;
                        }
                    }
                }
                tween.onComplete.add(function () {
                    frenchText.fill = "#fff";
                }, this);
                frenchGroup.visible = false;
            } else {
                tween = game.add.tween(frenchGroup).to({ alpha: 0.85 }, 300, Phaser.Easing.Linear.None, true);
                frenchGroup.visible = true;
                if (tableChips.length > 0) {
                    for (var i = 0; i < tableChips.length; i++) {
                        if (tableChips[i].name == "tiers" || tableChips[i].name == 'nZero' || tableChips[i].name == 'voisins' || tableChips[i].name == 'orphelins') {
                            tableChips[i].chip.visible = true;
                        }
                    }
                }
                tween.onComplete.add(function () {
                    frenchText.fill = "#565555";
                }, this);
            }

        }, this);

        frenchBetsBtn.input.useHandCursor = true;
        frenchBetsBtn.clicked = true;
        frenchText = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_FRENCH_BETS", true).toUpperCase(),
            x: frenchBetsBtn.x + 53,
            y: frenchBetsBtn.y + 62,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            wordWrapWidth: 70,
            maxWidth: 70
        });

        frenchText.lineSpacing = -8;
        frenchText.anchor.x = Math.round(frenchText.width * 0.5) / frenchText.width;
        footerGroup.add(frenchBetsBtn);
        buttonGroup.add(frenchBetsBtn);
        overlayGroup.add(frenchBetsBtn);
        overlayGroup.add(frenchText);

        table.inputEnabled = true;
        frenchBets.inputEnabled = true;
        for (var i = 0; i < TABLE_COLS; i++) {
            for (var j = 0; j < TABLE_ROWS; j++) {

                cellName = 'cell_' + i.toString() + '_' + j.toString();
                tableCell[cellName] = tableGroup.create(table.x + 144 + i * (DIB_WIDTH + DIB_SPASE), table.y + 63 + j * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
                tableCell[cellName].name = cellName.toString();

                tableCell[cellName].bet_name = arrayNambers[i][j].toString();
                tableCell[cellName].bet_type = 'straight';

                tableCell[cellName].inputEnabled = true;
                tableCell[cellName].type = betType.straight;
                tableCell[cellName].alpha = 0;
                tableCell[cellName].width = DIB_WIDTH;
                tableCell[cellName].height = DIB_HEIGHT;
                tableCell[cellName].events.onInputOver.add(this.cellOver, this);
                tableCell[cellName].events.onInputOut.add(this.cellOut, this);
                tableCell[cellName].events.onInputDown.add(this.cellClick, this);

                spriteX = tableGroup.create(table.x + 133 + i * (DIB_WIDTH + DIB_SPASE), table.y + 62 + j * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
                spriteX.name = 'lineY_' + i.toString() + '_' + j.toString();
                spriteX.bet_name = 'lineY_' + i.toString() + '_' + j.toString();;
                spriteX.alpha = 0;
                spriteX.inputEnabled = true;
                spriteX.width = 20;
                spriteX.height = DIB_HEIGHT;
                spriteX.type = betType.splitY;
                spriteX.events.onInputDown.add(this.cellClick, this);
                spriteX.events.onInputOver.add(this.cellOver, this);
                spriteX.events.onInputOut.add(this.cellOut, this);

                spriteY = tableGroup.create(table.x + 145 + i * (DIB_WIDTH + DIB_SPASE), table.y + 54 + j * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
                spriteY.name = 'lineX_' + i.toString() + '_' + j.toString();
                spriteY.bet_name = 'lineX_' + i.toString() + '_' + j.toString();;
                spriteY.alpha = 0;
                spriteY.height = 20;
                spriteY.width = DIB_WIDTH;
                spriteY.type = betType.splitX;
                spriteY.inputEnabled = true;
                spriteY.events.onInputDown.add(this.cellClick, this);
                spriteY.events.onInputOver.add(this.cellOver, this);
                spriteY.events.onInputOut.add(this.cellOut, this);

                spriteXY = tableGroup.create(table.x + 134 + i * (DIB_WIDTH + DIB_SPASE), table.y + 54 + j * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
                spriteXY.name = 'crossXY_' + i.toString() + '_' + j.toString();
                spriteXY.bet_name = 'crossXY_' + i.toString() + '_' + j.toString();;
                spriteXY.inputEnabled = true;
                spriteXY.width = 20;
                spriteXY.height = 20;
			    spriteXY.type = betType.corner;
                spriteXY.alpha = 0;
            	if(j==0){
					spriteXY.type = betType.street;
				}
				if(i==0 && j==0){
					spriteXY.type = betType.corner;
				}
                spriteXY.events.onInputDown.add(this.cellClick, this);
                spriteXY.events.onInputOver.add(this.cellOver, this);
                spriteXY.events.onInputOut.add(this.cellOut, this);
            }
        }
        tableCell['zero'] = tableGroup.create(table.x + 144, table.y + 10, 'zero_cell_select');
        tableCell['zero'].name = '0';

        tableCell['zero'].bet_name = '0';
        tableCell['zero'].bet_type = 'straight';

        tableCell['zero'].type = betType.straight;
        tableCell['zero'].alpha = 0;
        tableCell['zero'].width = 186;
        tableCell['zero'].height = 54;

        tableCell['zero'].inputEnabled = true;
        tableCell['zero'].events.onInputDown.add(this.cellClick, this);
        tableCell['zero'].events.onInputOver.add(this.cellOver, this);
        tableCell['zero'].events.onInputOut.add(this.cellOut, this);

        Dozen['one'] = tableGroup.create(table.x + 70, table.y + 64, 'cell_select');
        Dozen['one'].name = 'dozenOne';
        Dozen['one'].bet_name = 'first12';
        Dozen['one'].bet_type = 'dozen';
        Dozen['one'].items = [0];
        Dozen['one'].first = 0;
        Dozen['one'].last = 4;
        Dozen['one'].alpha = 0;
        Dozen['one'].width = 70;
        Dozen['one'].height = 190;
        Dozen['one'].type = betType.multiSelect;
        Dozen['one'].inputEnabled = true;
        Dozen['one'].events.onInputDown.add(this.cellClick, this);
        Dozen['one'].events.onInputOver.add(this.cellOver, this);
        Dozen['one'].events.onInputOut.add(this.cellOut, this);

        Dozen['two'] = tableGroup.create(table.x + 70, table.y + 255, 'cell_select');
        Dozen['two'].name = 'dozenTwo';
        Dozen['two'].bet_name = 'second12';
        Dozen['two'].bet_type = 'dozen';
        Dozen['two'].items = [1];
        Dozen['two'].type = betType.multiSelect;
        Dozen['two'].alpha = 0;
        Dozen['two'].width = 70;
        Dozen['two'].height = 190;
        Dozen['two'].first = 4;
        Dozen['two'].last = 8;
        Dozen['two'].inputEnabled = true;
        Dozen['two'].events.onInputDown.add(this.cellClick, this);
        Dozen['two'].events.onInputOver.add(this.cellOver, this);
        Dozen['two'].events.onInputOut.add(this.cellOut, this);

        Dozen['three'] = tableGroup.create(table.x + 70, table.y + 446, 'cell_select');
        Dozen['three'].name = 'dozenThree';
        Dozen['three'].bet_name = 'third12';
        Dozen['three'].bet_type = 'dozen';
        Dozen['three'].items = [2];
        Dozen['three'].type = betType.multiSelect;
        Dozen['three'].alpha = 0;
        Dozen['three'].width = 70;
        Dozen['three'].height = 190;
        Dozen['three'].first = 8;
        Dozen['three'].last = 12;
        Dozen['three'].inputEnabled = true;
        Dozen['three'].events.onInputDown.add(this.cellClick, this);
        Dozen['three'].events.onInputOver.add(this.cellOver, this);
        Dozen['three'].events.onInputOut.add(this.cellOut, this);

        Column['one'] = tableGroup.create(table.x + 145, table.y + 640, 'cell_select');
        Column['one'].name = 'columnOne';
        Column['one'].bet_name = 'col1';
        Column['one'].bet_type = 'column';
        Column['one'].items = [0];
        Column['one'].type = betType.multiSelect;
        Column['one'].alpha = 0;
        Column['one'].width = 60;
        Column['one'].height = 48;
        Column['one'].first = 0;
        Column['one'].last = 12;
        Column['one'].colFirst = 0;
        Column['one'].colLast = 1;
        Column['one'].inputEnabled = true;
        Column['one'].events.onInputDown.add(this.cellClick, this);
        Column['one'].events.onInputOver.add(this.cellOver, this);
        Column['one'].events.onInputOut.add(this.cellOut, this);

        Column['two'] = tableGroup.create(table.x + 209, table.y + 640, 'cell_select');
        Column['two'].name = 'columnTwo';
        Column['two'].bet_name = 'col2';
        Column['two'].bet_type = 'column';
        Column['two'].items = [1];
        Column['two'].type = betType.multiSelect;
        Column['two'].alpha = 0;
        Column['two'].width = 60;
        Column['two'].height = 48;
        Column['two'].first = 0;
        Column['two'].last = 12;
        Column['two'].colFirst = 1;
        Column['two'].colLast = 2;
        Column['two'].inputEnabled = true;
        Column['two'].events.onInputDown.add(this.cellClick, this);
        Column['two'].events.onInputOver.add(this.cellOver, this);
        Column['two'].events.onInputOut.add(this.cellOut, this);

        Column['three'] = tableGroup.create(table.x + 274, table.y + 640, 'cell_select');
        Column['three'].name = 'columnThree';
        Column['three'].bet_name = 'col3';
        Column['three'].bet_type = 'column';
        Column['three'].type = betType.multiSelect;
        Column['three'].items = [2];
        Column['three'].alpha = 0;
        Column['three'].width = 60;
        Column['three'].height = 48;
        Column['three'].first = 0;
        Column['three'].last = 12;
        Column['three'].colFirst = 2;
        Column['three'].colLast = 3;
        Column['three'].inputEnabled = true;
        Column['three'].events.onInputDown.add(this.cellClick, this);
        Column['three'].events.onInputOver.add(this.cellOver, this);
        Column['three'].events.onInputOut.add(this.cellOut, this);


        Orphelins['low'] = tableGroup.create(table.x + 12, table.y + 65, 'cell_select');
        Orphelins['low'].name = 'low';
        Orphelins['low'].bet_name = 'first18';
        Orphelins['low'].bet_type = 'high_low';
        Orphelins['low'].items = ['low'];
        Orphelins['low'].type = betType.multiSelect;
        Orphelins['low'].width = 50;
        Orphelins['low'].height = 90;
        Orphelins['low'].first = 0;
        Orphelins['low'].last = 6;
        Orphelins['low'].alpha = 0;
        Orphelins['low'].inputEnabled = true;
        Orphelins['low'].events.onInputDown.add(this.cellClick, this);
        Orphelins['low'].events.onInputOver.add(this.cellOver, this);
        Orphelins['low'].events.onInputOut.add(this.cellOut, this);

        Orphelins['high'] = tableGroup.create(table.x + 12, table.y + 545, 'cell_select');
        Orphelins['high'].name = 'high';
        Orphelins['high'].bet_name = 'second18';
        Orphelins['high'].bet_type = 'high_low';
        Orphelins['high'].items = ['high'];
        Orphelins['high'].type = betType.multiSelect;
        Orphelins['high'].width = 50;
        Orphelins['high'].height = 90;
        Orphelins['high'].first = 6;
        Orphelins['high'].last = 12;
        Orphelins['high'].alpha = 0;
        Orphelins['high'].inputEnabled = true;
        Orphelins['high'].events.onInputDown.add(this.cellClick, this);
        Orphelins['high'].events.onInputOver.add(this.cellOver, this);
        Orphelins['high'].events.onInputOut.add(this.cellOut, this);

        Orphelins['even'] = tableGroup.create(table.x + 12, table.y + 163, 'cell_select');
        Orphelins['even'].name = 'even';
        Orphelins['even'].bet_name = 'even';
        Orphelins['even'].bet_type = 'evens_odds';
        Orphelins['even'].items = ['evens'];
        Orphelins['even'].type = betType.arrSelect;
        Orphelins['even'].alpha = 0;
        Orphelins['even'].width = 50;
        Orphelins['even'].height = 90;
        Orphelins['even'].numbers = evenNumberArr;
        Orphelins['even'].inputEnabled = true;
        Orphelins['even'].events.onInputDown.add(this.cellClick, this);
        Orphelins['even'].events.onInputOver.add(this.cellOver, this);
        Orphelins['even'].events.onInputOut.add(this.cellOut, this);

        Orphelins['odd'] = tableGroup.create(table.x + 12, table.y + 447, 'cell_select');
        Orphelins['odd'].name = 'odd';
        Orphelins['odd'].bet_name = 'odd';
        Orphelins['odd'].bet_type = 'evens_odds';
        Orphelins['odd'].items = ['odds'];
        Orphelins['odd'].type = betType.arrSelect;
        Orphelins['odd'].width = 50;
        Orphelins['odd'].height = 90;
        Orphelins['odd'].alpha = 0;
        Orphelins['odd'].numbers = oddNumberArr;
        Orphelins['odd'].inputEnabled = true;
        Orphelins['odd'].events.onInputDown.add(this.cellClick, this);
        Orphelins['odd'].events.onInputOver.add(this.cellOver, this);
        Orphelins['odd'].events.onInputOut.add(this.cellOut, this);

        Orphelins['black'] = tableGroup.create(table.x + 11, table.y + 257, 'cell_select');
        Orphelins['black'].name = 'black';
        Orphelins['black'].bet_name = 'black';
        Orphelins['black'].bet_type = 'color';
        Orphelins['black'].items = ['black'];
        Orphelins['black'].type = betType.arrSelect;
        Orphelins['black'].alpha = 0;
        Orphelins['black'].width = 52;
        Orphelins['black'].height = 93;
        Orphelins['black'].numbers = blackNumberArr;
        Orphelins['black'].inputEnabled = true;
        Orphelins['black'].events.onInputDown.add(this.cellClick, this);
        Orphelins['black'].events.onInputOver.add(this.cellOver, this);
        Orphelins['black'].events.onInputOut.add(this.cellOut, this);

        Orphelins['red'] = tableGroup.create(table.x + 10, table.y + 352, 'cell_select');
        Orphelins['red'].name = 'red';
        Orphelins['red'].bet_name = 'red';
        Orphelins['red'].bet_type = 'color';
        Orphelins['red'].items = ['red'];
        Orphelins['red'].type = betType.arrSelect;
        Orphelins['red'].alpha = 0;
        Orphelins['red'].width = 52;
        Orphelins['red'].height = 93;
        Orphelins['red'].numbers = redNumberArr;
        Orphelins['red'].inputEnabled = true;
        Orphelins['red'].events.onInputDown.add(this.cellClick, this);
        Orphelins['red'].events.onInputOver.add(this.cellOver, this);
        Orphelins['red'].events.onInputOut.add(this.cellOut, this);

        Neighbors['zero'] = tableGroup.create(french_bet_offset + 93, table.y + 587, 'cell_select');
        Neighbors['zero'].name = 'nZero';
        Neighbors['zero'].bet_name = 'zero';
        Neighbors['zero'].bet_type = 'straight';
        Neighbors['zero'].alpha = 0;
        Neighbors['zero'].width = 120;
        Neighbors['zero'].height = 50;
        Neighbors['zero'].inputEnabled = true;
        Neighbors['zero'].events.onInputDown.add(this.zeroClick, this);
        Neighbors['zero'].events.onInputOver.add(this.zeroOver, this);
        Neighbors['zero'].events.onInputOut.add(this.zeroOut, this);
        frenchGroup.add(Neighbors['zero']);

        Neighbors['voisins'] = tableGroup.create(french_bet_offset + 210, table.y + 587, 'cell_select');
        Neighbors['voisins'].name = 'voisins';
        Neighbors['voisins'].bet_name = 'voisins';
        Neighbors['voisins'].bet_type = 'straight';
        Neighbors['voisins'].alpha = 0;
        Neighbors['voisins'].width = 270;
        Neighbors['voisins'].height = 50;
        Neighbors['voisins'].inputEnabled = true;
        Neighbors['voisins'].events.onInputDown.add(this.voisinsClick, this);
        Neighbors['voisins'].events.onInputOver.add(this.voisinsOver, this);
        Neighbors['voisins'].events.onInputOut.add(this.voisinsOut, this);
        frenchGroup.add(Neighbors['voisins']);

        Neighbors['orphelins'] = tableGroup.create(french_bet_offset + 480, table.y + 587, 'cell_select');
        Neighbors['orphelins'].name = 'orphelins';
        Neighbors['orphelins'].bet_name = 'orphelins';
        Neighbors['orphelins'].bet_type = 'straight';
        Neighbors['orphelins'].alpha = 0;
        Neighbors['orphelins'].width = 160;
        Neighbors['orphelins'].height = 50;
        Neighbors['orphelins'].inputEnabled = true;
        Neighbors['orphelins'].events.onInputDown.add(this.orphelinsClick, this);
        Neighbors['orphelins'].events.onInputOver.add(this.orphelinsOver, this);
        Neighbors['orphelins'].events.onInputOut.add(this.orphelinsOut, this);
        frenchGroup.add(Neighbors['orphelins']);

        Neighbors['tiers'] = tableGroup.create(french_bet_offset + 745, table.y + 587, 'cell_select');
        Neighbors['tiers'].name = 'tiers';
        Neighbors['tiers'].bet_name = 'tiers';
        Neighbors['tiers'].bet_type = 'straight';
        Neighbors['tiers'].alpha = 0;
        Neighbors['tiers'].height = 50;
        Neighbors['tiers'].width = 200;
        Neighbors['tiers'].inputEnabled = true;
        Neighbors['tiers'].events.onInputDown.add(this.tiersClick, this);
        Neighbors['tiers'].events.onInputOver.add(this.tiersOver, this);
        Neighbors['tiers'].events.onInputOut.add(this.tiersOut, this);
        frenchGroup.add(Neighbors['tiers']);
    },
    changeGameSize: function changeGameSize() {
        var self = this;
        setTimeout(function () {
            changeVideoSize();
        }, 500);
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
            var chip=chipsGroup.children[childId];
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

    },
    resetTable: function () {
        if (selectedChipsGroup.children && selectedChipsGroup.children.length > 0) {
            selectedChipsGroup.removeChildren();
        } 
        if(headerBetInputVal !== undefined){
            headerBetInputVal.setTitle($.client.UserData.CurrencySign+'0');    
        }        
        tableChips = [];
        previousBetChips = [];
        summaDeb = 0;
        if(placeHold !== undefined){
            placeHold.kill();
        } 
    },
    startGame: function () {
        var self = this;
        if (!isSubmiting) {
            isSubmiting = true;
            if ($.client.UserData.Features && $.client.UserData.Features.provably_fair) {
                $.client.sendSeed(function(responce) {
                    if (responce.IsSuccess) {
                        $.client.sendPost(JSON.stringify({
                            type: "start_game"
                        }), function(res) {
                            if (res.IsSuccess && res.ResponseData.success) {
                                startGameBtn.alpha = 0;
                                startGameBtn.btn.inputEnabled = false;
                            }
                            isSubmiting = false;
                        }, function(err) {
                            console.log(err);
                            isSubmiting = false;
                        });
                    }
                    isSubmiting = false;
                }, function(err) {
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
    makeBetobject: function (element) {
        var amountDeb = this.getAmountDeb();
        switch (element.type) {
            case betType.straight: {
                Bets = {};
                Bets.name = (element.bet_name).toString();
                Bets.type = element.bet_type;
                Bets.items = [parseInt(element.bet_name)];
                Bets.numbers = [parseInt(element.x)];
                Bets.amount = amountDeb;
                element.alpha = 0;
                element.bet_amount = amountDeb;
                element.bets = Bets;
            }
                break;
            case betType.splitY: {
                Bets = {};
                var streetSplitBet = [];
                borderPosArr = element['name'].split('_');
                if (borderPosArr[1] != undefined) {
                    if (parseInt(borderPosArr[1], 10) == 0) {
                        for (var i = 0; i <= 2; i++) {
                            cellName = 'cell_' + i + '_' + borderPosArr[2].toString();
                            tableCell[cellName].alpha = 0;
                            streetSplitBet.push(parseInt(tableCell[cellName]['bet_name']));
                        }
                        Bets.type = 'street';
                    }
                    else {
                        for (var i = 0; i <= 1; i++) {
                            cellName = 'cell_' + (borderPosArr[1] - i).toString() + '_' + borderPosArr[2].toString();
                            tableCell[cellName].alpha = 0;
                            streetSplitBet.push(parseInt(tableCell[cellName]['bet_name']));
                        }
                        Bets.type = 'split';
                    }
                    Bets.name = element['bet_name'];
                    Bets.items = streetSplitBet;
                    Bets.numbers = streetSplitBet;
                    element.bet_amount = amountDeb;
                    Bets.amount = amountDeb;
                    element.bets = Bets;
                    element.bet_type = Bets.type;
                }
            }
                break;
            case betType.splitX: {
                Bets = {};
                var SplitBet = [];
                borderPosArr = element['name'].split('_');
                if (borderPosArr[1] != undefined) {
                    for (var i = 0; i <= 1; i++) {
                        if (parseInt(borderPosArr[2], 10) != 0) {
                            cellName = 'cell_' + borderPosArr[1].toString() + '_' + (borderPosArr[2] - i).toString();
                            tableCell[cellName].alpha = 0;
                            SplitBet.push(parseInt(tableCell[cellName]['bet_name']));
                        }
                    }
                    if (parseInt(borderPosArr[2], 10) == 0) {
                        cellName = 'cell_' + borderPosArr[1].toString() + '_' + borderPosArr[2].toString();
                        tableCell[cellName].alpha = 0;
                        tableCell['zero'].alpha = 0;
                        SplitBet.push(parseInt(tableCell['zero']['bet_name']));
                        SplitBet.push(parseInt(tableCell[cellName]['bet_name']));
                    }
                    Bets.name = element['bet_name'];
                    Bets.type = 'split';
                    Bets.amount = amountDeb;
                    Bets.items = SplitBet;
                    Bets.numbers = SplitBet;
                    element.bet_amount = amountDeb;
                    element.bet_type = Bets.type;
                    element.bets = Bets;
                }
            }
                break;
            case betType.street: {
                Bets = {};
                var streetSplitBet = [];
                borderPosArr = element['name'].split('_');
                if (parseInt(borderPosArr[1], 10) == 1) {
                    for (var i = 0; i < 2; i++) {
                        cellName = 'cell_' + i + '_' + borderPosArr[2].toString();
                        tableCell[cellName].alpha = 0;
                        streetSplitBet.push(parseInt(tableCell[cellName]['bet_name']));
                    }
                } else if (parseInt(borderPosArr[1], 10) == 2) {
                    for (var i =1; i < 3; i++) {
                        cellName = 'cell_' + i + '_' + borderPosArr[2].toString();
                        tableCell[cellName].alpha = 0;
                        streetSplitBet.push(parseInt(tableCell[cellName]['bet_name']));
                    }
                }
                Bets.type = 'street';
                streetSplitBet.push(parseInt(tableCell['zero']['bet_name']));
                Bets.name = element['bet_name'];
                Bets.items = streetSplitBet;
                Bets.numbers = streetSplitBet;
                element.bet_amount = amountDeb;
                Bets.amount = amountDeb;
                element.bets = Bets;
                element.bet_type = Bets.type;
            }
                break;
            case betType.corner: {
                var crossPosArr, cornerBets = [];
                var i = 0, ii = 0, iii = 0, cellX, cellY;
                Bets = {};
                crossPosArr = element['name'].split('_');
                if (crossPosArr[1] != undefined) {
                    if (parseInt(crossPosArr[2], 10) != 0) {
                        if (parseInt(crossPosArr[1], 10) == 0) {
                            for (i = 0; i < 6; i++) {
                                if (i <= 2) {
                                    cellName = 'cell_' + i + '_' + crossPosArr[2].toString();
                                } else {
                                    ii = i - 3;
                                    cellY = parseInt(crossPosArr[2], 10) - 1;
                                    cellName = 'cell_' + ii + '_' + cellY.toString();
                                }
                                cornerBets.push(parseInt(tableCell[cellName]['bet_name']));
                            }
                            Bets.type = 'line';

                        } else {
                            ii = 1;
                            iii = 0;
                            for (i = 0; i < 4; i++) {
                                if (i < 2) {
                                    cellX = parseInt(crossPosArr[1], 10) - i;
                                    cellY = parseInt(crossPosArr[2], 10) - i;
                                } else {

                                    cellX = parseInt(crossPosArr[1], 10) - iii;
                                    cellY = parseInt(crossPosArr[2], 10) - ii;
                                    ii--;
                                    iii++;
                                }
                                cellName = 'cell_' + cellX.toString() + '_' + cellY.toString();
                                tableCell[cellName].alpha = 0;
                                cornerBets.push(parseInt(tableCell[cellName]['bet_name']));
                            }
                            Bets.type = 'corner';
                        }
                    } else {
                        if (parseInt(crossPosArr[1], 10) > 0) {
                            for (i = 0; i < 2; i++) {
                                cellX = parseInt(crossPosArr[1], 10) - i;
                                cellName = 'cell_' + cellX + '_' + crossPosArr[2].toString();
                                tableCell[cellName].alpha = 0;
                                cornerBets.push(parseInt(tableCell[cellName]['bet_name']));
                            }
                            cornerBets.push(parseInt(tableCell['zero']['bet_name']));
                            tableCell['zero'].alpha = 0;
                        } else {
                            for (i = 0; i < 3; i++) {
                                cellX =  i;
                                cellName = 'cell_' + cellX + '_' + crossPosArr[2].toString();
                                tableCell[cellName].alpha = 0;
                                cornerBets.push(parseInt(tableCell[cellName]['bet_name']));
                            }
                            cornerBets.push(parseInt(tableCell['zero']['bet_name']));
                        }
                        Bets.type = 'corner';
                    }

                    Bets.items = cornerBets;
                    Bets.numbers = cornerBets;
                    Bets.name = element['bet_name'];
                    Bets.amount = amountDeb;
                    element.bet_type = Bets.type;
                    element.bet_amount = amountDeb;
                    element.bets = Bets;
                }
            }
                break;
            case betType.multiSelect: {
                Bets = {};
                this.multySelect({ first: element.first, last: element.last, colFirst: element.colFirst, colLast: element.colLast, toggle: true });
                Bets.name = element.bet_name;
                Bets.type = element.bet_type;
                Bets.amount = amountDeb;
                Bets.items = element.items;
                element.bets = Bets;
                element.bet_amount = amountDeb;
                element.alpha = 0;
                var numbers = [];
                if (element.bet_name == "col1" || element.bet_name == "col2" || element.bet_name == "col3") {
                    var last = element.colLast;
                    for (var i = 1; i <= element.last; i++) {
                        numbers.push(last);
                        last += 3;
                    }
                } else if (element.bet_name == "first12" || element.bet_name == "second12" || element.bet_name == "third12") {
                    for (var i = element.first * 3 + 1; i <= element.last * 3; i++)
                        numbers.push(i);
                } else if (element.bet_name == "first18" || element.bet_name == "second18") {
                    for (var i = element.first * 3 + 1; i <= element.last * 3; i++)
                        numbers.push(i);
                }
                Bets.numbers = numbers;
            }
                break;
            case betType.arrSelect: {
                element.alpha = 0;
                Bets.name = element.bet_name;
                Bets.type = element.bet_type;
                Bets.items = element.items;
                if (element.bet_name == "red") {
                    Bets.numbers = redNumberArr;
                } else if (element.bet_name == "black") {
                    Bets.numbers = blackNumberArr;
                } else if (element.bet_name == "even") {
                    Bets.numbers = evenNumberArr;
                } else if (element.bet_name == "odd") {
                    Bets.numbers = oddNumberArr;
                }
                Bets.amount = amountDeb;
                element.bets = Bets;
                element.bet_amount = amountDeb;

            }
                break;
        }
        return element;
    },
    cellOver: function (element) {
        var self = this;
		borderPosArr = element['name'].split('_');
        if (MessageDispatcher.isTableOpen && !isMobile.pad()) {
            if (borderPosArr[0] != undefined) {
                switch (element.type) {
                    case betType.straight: {
                        element.alpha = 0.5;
                    }
                        break;
                    case betType.splitY: {
                        if (parseInt(borderPosArr[1], 10) == 0) {
                            for (var i = 0; i <= 2; i++) {
                                cellName = 'cell_' + i + '_' + borderPosArr[2].toString();
                                tableCell[cellName].alpha = 0.5;
                            }
                        }
                        else
                            for (var i = 0; i <= 1; i++) {
                                cellName = 'cell_' + (borderPosArr[1] - i).toString() + '_' + borderPosArr[2].toString();
                                tableCell[cellName].alpha = 0.5;
                            }
                    }
                        break;
                    case betType.splitX: {
                        for (var i = 0; i <= 1; i++) {
                            if (parseInt(borderPosArr[2], 10) != 0) {
                                cellName = 'cell_' + borderPosArr[1] + '_' + (borderPosArr[2] - i).toString();
                                tableCell[cellName].alpha = 0.5;
                            }
                        }
                        if (parseInt(borderPosArr[2], 10) == 0) {
                            cellName = 'cell_' + borderPosArr[1].toString() + '_' + borderPosArr[2].toString();
                            tableCell[cellName].alpha = 0.5;;
                            tableCell['zero'].alpha = 0.5;
                        }
                    }
                        break;
                    case betType.corner: {
                            var i = 0, ii = 0, iii = 0, cellX, cellY;
				            if (parseInt(borderPosArr[2], 10) != 0) {
                                if (parseInt(borderPosArr[1], 10) == 0) {
                                    for (i = 0; i < 6; i++) {
                                        if (i <= 2) {
                                            cellName = 'cell_' + i + '_' + borderPosArr[2].toString();
                                        } else {
                                            ii = i - 3;
                                            cellY = parseInt(borderPosArr[2], 10) - 1;
                                            cellName = 'cell_' + ii + '_' + cellY.toString();
                                        }
                                        tableCell[cellName].alpha=0.5;
                                    }
                                } else {
                                    ii = 1;
                                    for (i = 0; i < 4; i++) {
                                        if (i < 2) {
                                            cellX = parseInt(borderPosArr[1], 10) - i;
                                            cellY = parseInt(borderPosArr[2], 10) - i;
                                        } else {

                                            cellX = parseInt(borderPosArr[1], 10) - iii;
                                            cellY = parseInt(borderPosArr[2], 10) - ii;
                                            ii--;
                                            iii++;
                                        }
                                        cellName = 'cell_' + cellX.toString() + '_' + cellY.toString();
                                        tableCell[cellName].alpha = 0.5;
                                    }
                                }
                            }
                            else {
                                if (parseInt(borderPosArr[1], 10) > 0) {
                                    for (i = 0; i < 2; i++) {
                                        cellX = parseInt(borderPosArr[1], 10) - i;
                                        cellName = 'cell_' + cellX + '_' + borderPosArr[2].toString();
                                        tableCell[cellName].alpha = 0.5;
                                    }
                                    tableCell['zero'].alpha=0.5;
                                }else{
								   for (i = 0; i < 3; i++) {
                                        cellX = parseInt(borderPosArr[1], 10) - i;
                                        cellName = 'cell_' + i + '_' + borderPosArr[2].toString();
                                        tableCell[cellName].alpha = 0.5;
                                    }
                                    tableCell['zero'].alpha=0.5;		
								}
                            }
                        }
                        break;
                    case betType.street: {
                        if (parseInt(borderPosArr[1], 10) == 1) {
                            this.selectCellsArr({ arr: [0,1,2], toggle: false, toggleType: "over" });
                        } else {
                            this.selectCellsArr({ arr: [0, 2, 3], toggle: false, toggleType: "over" });
                        }
                        tableCell['zero'].alpha = 0.5;
                    }
                        break;
                    case betType.multiSelect: {
                        self.multySelect({ first: element.first, last: element.last, colFirst: element.colFirst, colLast: element.colLast, toggle: false, toggleType: "over" });
                        element.alpha = 0.5;
                    }
                        break;
                    case betType.arrSelect: {
                        this.selectCellsArr({ arr: element.numbers, toggle: false, toggleType: "over" });
                        element.alpha = 0.5;
                    }
                        break;
                }
            }
        }
        $("#canvas canvas").addClass('no-cur');
        cursorVisible = true;
    },
    cellOut: function (element) {
        var self = this;
        borderPosArr = element['name'].split('_');
        if (borderPosArr[0] != undefined) {
            switch (element.type) {
                case betType.straight: {
                    element.alpha = 0;
                }
                    break;
                case betType.splitY: {
                    if (parseInt(borderPosArr[1], 10) == 0) {
                        for (var i = 0; i <= 2; i++) {
                            cellName = 'cell_' + i + '_' + borderPosArr[2].toString();
                            tableCell[cellName].alpha = 0;
                        }
                    }
                    else
                        for (var i = 0; i <= 1; i++) {
                            cellName = 'cell_' + (borderPosArr[1] - i).toString() + '_' + borderPosArr[2].toString();
                            tableCell[cellName].alpha = 0;
                        }
                }
                    break;
                case betType.splitX: {
                    for (var i = 0; i <= 1; i++) {
                        if (parseInt(borderPosArr[2], 10) != 0) {
                            cellName = 'cell_' + borderPosArr[1] + '_' + (borderPosArr[2] - i).toString();
                            tableCell[cellName].alpha = 0;
                        }
                    }
                    if (parseInt(borderPosArr[2], 10) == 0) {
                        cellName = 'cell_' + borderPosArr[1].toString() + '_' + borderPosArr[2].toString();
                        tableCell[cellName].alpha = 0;;
                        tableCell['zero'].alpha = 0;
                    }
                }
                    break;
                case betType.corner: {
                    var i = 0, ii = 0, iii = 0, cellX, cellY;
                    if (parseInt(borderPosArr[2], 10) != 0) {
                        if (parseInt(borderPosArr[1], 10) == 0) {
                            for (i = 0; i < 6; i++) {
                                if (i <= 2) {
                                    cellName = 'cell_' + i + '_' + borderPosArr[2].toString();
                                } else {
                                    ii = i - 3;
                                    cellY = parseInt(borderPosArr[2], 10) - 1;
                                    cellName = 'cell_' + ii + '_' + cellY.toString();
                                }
                                tableCell[cellName].alpha = 0;
                            }
                        } else {
                            ii = 1;
                            for (i = 0; i < 4; i++) {
                                if (i < 2) {
                                    cellX = parseInt(borderPosArr[1], 10) - i;
                                    cellY = parseInt(borderPosArr[2], 10) - i;
                                } else {

                                    cellX = parseInt(borderPosArr[1], 10) - iii;
                                    cellY = parseInt(borderPosArr[2], 10) - ii;
                                    ii--;
                                    iii++;
                                }
                                cellName = 'cell_' + cellX.toString() + '_' + cellY.toString();
                                tableCell[cellName].alpha = 0;
                            }
                        }
                    }
                    else {
                        if (parseInt(borderPosArr[1], 10) > 0) {
                            for (i = 0; i < 2; i++) {
                                cellX = parseInt(borderPosArr[1], 10) - i;
                                cellName = 'cell_' + cellX + '_' + borderPosArr[2].toString();
                                tableCell[cellName].alpha = 0;
                            }
                            tableCell['zero'].alpha = 0;
                        } else {
                            for (i = 0; i < 3; i++) {
                                cellX = parseInt(borderPosArr[1], 10) - i;
                                cellName = 'cell_' + i + '_' + borderPosArr[2].toString();
                                tableCell[cellName].alpha = 0;
                            }
                            tableCell['zero'].alpha = 0;
                        }
                    }
                }
                    break;
                case betType.street: {
                    if (parseInt(borderPosArr[1], 10) == 1) {
                        this.selectCellsArr({ arr: [0, 1, 2], toggle: false, toggleType: "out" });
                    } else  {
                        this.selectCellsArr({ arr: [0, 2, 3], toggle: false, toggleType: "out" });
                    }
                    tableCell['zero'].alpha = 0;
                }

                    break;
                case betType.multiSelect: {
                    self.multySelect({ first: element.first, last: element.last, colFirst: element.colFirst, colLast: element.colLast, toggle: false, toggleType: "out" });
                    element.alpha = 0;
                }
                    break;
                case betType.arrSelect: {
                    this.selectCellsArr({ arr: element.numbers, toggle: false, toggleType: "out" });
                    element.alpha = 0;
                }
                    break;
 
            }
        }
        $("#canvas canvas").removeClass('no-cur');
        cursorVisible = false;
    },
    cellClick: function (element) {
    var self = this;
    if (self.makeBet(self.makeBetobject(element)))
        this.confirmBet();
    },
    zeroClick: function (element) {
        var self = this;
        if (MessageDispatcher.isTableOpen && !isSubmiting) {
            this.selectCellsArr({ arr: zeroNumberArr, toggle: true });
            element.alpha = 0;
            tableCell['zero'].alpha = 0;
            var zero = [
                { name: "lineX_2_0", type: betType.splitX },
                { name: "lineX_2_4", type: betType.splitX },
                { name: "cell_1_8", type: betType.straight },
                { name: "lineX_1_11", type: betType.splitX }
            ];
            var chips = [], betAmount = 0;
            for (var i = 0; i < zero.length; i++) {
                var item = $.grep(tableGroup.children, function (n, p) {
                    return (n.name == zero[i].name && n.type == zero[i].type);
                })[0];
                if (betAmount + dib_cost[selectedChipId] < USER_BALANCE) {
                    if (self.makeBet(self.makeBetobject(item), true)) {
                        betAmount += dib_cost[selectedChipId];
                        chips.push(item);
                    }
                }
            }
            if (betAmount == 0) {
                self.showMessage($.client.getLocalizedString('INSUFFICIENT_FUNDS', true));
            } else {
                element.bets = {};
                element.chips = chips;
                var chip = {};
                if (Math.floor(betAmount, 2) > 0) {
                    chip = self.drawChip(element, selectedChipId, true);
                }
                self.confirmBet(chip);
            }
        }
    },
    zeroOver: function (element){
        $("#canvas canvas").addClass('no-cur');
        cursorVisible = true;
        if (MessageDispatcher.isTableOpen) {
            this.selectCellsArr({ arr: zeroNumberArr, toggle: false, toggleType: "over" });
            this.cellOver(tableCell['zero']);
        }
    },
    zeroOut: function (element){
        $("#canvas canvas").removeClass('no-cur');
        cursorVisible = false;
        this.selectCellsArr({ arr: zeroNumberArr, toggle: false, toggleType: "out" });
        this.cellOut(tableCell['zero']);
        this.cellOut(element);
    },
    voisinsClick: function (element) {
        var self = this;
        if (MessageDispatcher.isTableOpen && !isSubmiting) {
            this.selectCellsArr({ arr: voisinsNumberArr, toggle: true });
            element.alpha = 0;
            tableCell['zero'].alpha = 0;
            var voisins = [
                { name: "crossXY_2_0", type: betType.street },
                { name: "crossXY_2_0", type: betType.street },
                { name: "lineX_0_2", type: betType.splitX },
                { name: "lineX_2_4", type: betType.splitX },
                { name: "lineX_2_6", type: betType.splitX },
                { name: "lineX_0_7", type: betType.splitX },
                { name: "crossXY_1_9", type: betType.corner },
                { name: "crossXY_1_9", type: betType.corner },
                { name: "lineX_1_11", type: betType.splitX }
            ];
            var chips = [];
            var betAmount = 0;
            for (var i = 0; i < voisins.length; i++) {
                var item = $.grep(tableGroup.children, function (n, p) {
                    return (n.name == voisins[i].name && n.type == voisins[i].type);
                })[0];
                if (betAmount + dib_cost[selectedChipId] < USER_BALANCE) {
                    if (self.makeBet(self.makeBetobject(item), true)) {
                        betAmount += dib_cost[selectedChipId];
                        chips.push(item);
                    }
                }
            }
            if (betAmount == 0) {
                self.showMessage($.client.getLocalizedString('INSUFFICIENT_FUNDS', true));
            } else {
                element.chips = chips;
                element.bets = {};
                var chip = {};
                if (Math.floor(betAmount, 2) > 0) {
                    chip = self.drawChip(element, selectedChipId, true);
                }
                self.confirmBet(chip);
            }
        }
    },
    voisinsOver: function (element){
        $("#canvas canvas").addClass('no-cur');
        cursorVisible = true;
        if (MessageDispatcher.isTableOpen) {
            this.selectCellsArr({ arr: voisinsNumberArr, toggle: false, toggleType: "over" });
            this.cellOver(tableCell['zero']);
        }
    },
    voisinsOut: function (element){
        $("#canvas canvas").removeClass('no-cur');
        cursorVisible = false;
        this.selectCellsArr({ arr: voisinsNumberArr, toggle: false, toggleType: "out" });
        this.cellOut(tableCell['zero']);
        this.cellOut(element);
    },
    orphelinsClick: function (element) {
        var self = this;
        if (MessageDispatcher.isTableOpen && !isSubmiting) {
            this.selectCellsArr({ arr: orphelinsNumberArr, toggle: true });
            element.alpha = 0;
            var orphelins = [
                { name: "cell_0_0", type: betType.straight },
                { name: "lineX_2_2", type: betType.splitX },
                { name: "lineX_1_5", type: betType.splitX },
                { name: "lineX_1_6", type: betType.splitX },
                { name: "lineX_0_11", type: betType.splitX }
            ];
            var chips = [], betAmount = 0;
            for (var i = 0; i < orphelins.length; i++) {
                var item = $.grep(tableGroup.children, function (n, p) {
                    return (n.name == orphelins[i].name && n.type == orphelins[i].type);
                })[0];
                if (betAmount + dib_cost[selectedChipId] < USER_BALANCE) {
                    if (self.makeBet(self.makeBetobject(item), true)) {
                        betAmount += dib_cost[selectedChipId];
                        chips.push(item);
                    }
                }
            }
            if (betAmount == 0) {
                self.showMessage($.client.getLocalizedString('INSUFFICIENT_FUNDS', true));
            } else {
                element.bets = {};
                element.chips = chips;
                var chip = {};
                if (Math.floor(betAmount, 2) > 0) {
                    chip = self.drawChip(element, selectedChipId, true);
                }
                self.confirmBet(chip);
            }

        }

    },
    orphelinsOver: function (element){
        $("#canvas canvas").addClass('no-cur');
        cursorVisible = true;
        if (MessageDispatcher.isTableOpen) {
            this.selectCellsArr({ arr: orphelinsNumberArr, toggle: false, toggleType: "over" });
        }
    }, 
    orphelinsOut: function (element){
        $("#canvas canvas").removeClass('no-cur');
        cursorVisible = false;
        this.selectCellsArr({ arr: orphelinsNumberArr, toggle: false, toggleType: "out" });
        this.cellOut(element);
    },
    tiersClick: function (element) {
        var self = this;
        if (MessageDispatcher.isTableOpen && !isSubmiting) {
            this.selectCellsArr({ arr: tiersNumberArr, toggle: true });
            element.alpha = 0;
            var tierss = [
                { name: "lineX_1_2", type: betType.splitX },
                { name: "lineY_1_3", type: betType.splitY },
                { name: "lineX_0_5", type: betType.splitX },
                { name: "lineY_2_7", type: betType.splitY },
                { name: "lineX_2_9", type: betType.splitX },
                { name: "lineX_2_11", type: betType.splitX }
            ];
            var chips = [], betAmount = 0;
            for (var i = 0; i < tierss.length; i++) {
                var item = $.grep(tableGroup.children, function (n, p) {
                    return (n.name === tierss[i].name && n.type === tierss[i].type);
                })[0];
                if (betAmount + dib_cost[selectedChipId] < USER_BALANCE) {
                    if (self.makeBet(self.makeBetobject(item), true)) {
                        betAmount += dib_cost[selectedChipId];
                        chips.push(item);
                    }
                }
            }
            if (betAmount == 0) {
                self.showMessage($.client.getLocalizedString('INSUFFICIENT_FUNDS', true));
            } else {
                element.bets = {};
                element.chips = chips;
                var chip = {};
                if (Math.floor(betAmount, 2) > 0) {
                    chip = self.drawChip(element, selectedChipId, true);
                }
                self.confirmBet(chip);
            }
        }
    },
    tiersOver: function (element) {
        $("#canvas canvas").addClass('no-cur');
        cursorVisible = true;
        if (MessageDispatcher.isTableOpen) {
            this.selectCellsArr({ arr: tiersNumberArr, toggle: false, toggleType: "over" });
        }
    },
    tiersOut: function (element){
        $("#canvas canvas").removeClass('no-cur');
        cursorVisible = false;
        this.selectCellsArr({ arr: tiersNumberArr, toggle: false, toggleType: "out" });
        this.cellOut(element);
    },
    selectCellsArr: function (pars){
        var itemsBet = [];
        var arrNum = pars.arr;
        var toggle = pars.toggle || false; 
        var toggleType = pars.toggleType || 'out';
        bets = [];
        if(arrNum != undefined){
            for(var i = 0; i < arrayNambers.length; i ++){
                for(var j =0; j < arrayNambers[i].length; j++){
                    if(jQuery.inArray(arrayNambers[i][j], arrNum) != -1 ){
                        cellName = 'cell_'+ i.toString() + '_' + j.toString();                          

                        if(toggle){
                            tableCell[cellName].alpha = 0;
                             itemsBet.push(tableCell[cellName]['bet_name']);     
                            
                        }else{ 
                           if(toggleType == "out"){
                                this.cellOut(tableCell[cellName]);
                            }else if(toggleType == "over"){
                                this.cellOver(tableCell[cellName]);
                            }  
                        }
                    } 
                }
            }
            this.bitItems = [];
            this.bitItems = itemsBet;
        }
    },
    multySelect: function (pars) {
        var firstEl = pars.first || 0;
        var lastEl = pars.last || 0;
        var toggle = pars.toggle || false;
        var toggleType = pars.toggleType || 'out';
        var colLastEl = pars.colLast || TABLE_COLS; 
        var colFirstEl = pars.colFirst || 0;
        var itemsBet = [];
        if(firstEl != undefined && lastEl!=undefined){ 
            for(var i =firstEl; i < lastEl; i++){
                for(var j = colFirstEl; j < colLastEl; j++){
                    cellName = 'cell_'+ j.toString() + '_' + i.toString();
                    if(toggle){
                        tableCell[cellName].alpha = 0;                                              
                        itemsBet.push(tableCell[cellName]['bet_name']);                          
                    }else{ 
                        if(toggleType == "out"){
                            this.cellOut(tableCell[cellName]);
                        }else if(toggleType == "over"){
                            this.cellOver(tableCell[cellName]);
                        } 
                    }
                } 
            }
            this.bitItems = [];
            this.bitItems = itemsBet;
        }
    },
    getAmountDeb: function () {
         return dib_cost[selectedChipId];
     },
    clearAllBet: function (submited) {
        var items = [];
        if (tableChips.length > 0) {
                for (var i = 0; i < tableChips.length; i++) {
                    var bet = tableChips[i];
                    if (!bet['sent'] || (!bet['submit'] || submited)) {
                        var chip = bet.chip;
                        chip.destroy();
                        if (summaDeb > 0) {
                            summaDeb = parseFloat(summaDeb - bet.amount).toFixed(2);
                        }
                        else {
                            summaDeb = 0;
                        }
                        headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
                        items.push(bet);
                    }
                }
            }
            for (var i = 0; i < items.length; i++) {
                tableChips.splice(tableChips.indexOf(items[i]), 1);
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
                            previousBetChips = [];
                            summaDeb = 0;
                            USER_BALANCE = responce.ResponseData.balance;
                            self.changeStatus($.client.getLocalizedString('TEXT_BETS_CANCELED', true), 0, true,3000);
                            headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                        }
                    }
                }, function(err) {
                    console.log(err);
                });
        }
    },
    cancelLastBet: function (element) {
        var self = this;
        if (tableChips.length > 0 && previousBetChips.length>0) {
                function cancel(cancelBet) {
                    $.client.sendPost(JSON.stringify({
                            type: "cancel_last",
                            bet: cancelBet.bet
                        }), function(responce) {
                            if (responce.IsSuccess) {
                                if (responce.ResponseData.success) {
                                    var bet = cancelBet.bet;
                                    var chip = cancelBet.chip;
                                    tableChips.splice(tableChips.indexOf(bet), 1);
                                    chip.destroy();
                                    if (summaDeb > 0) {
                                        summaDeb = parseFloat(summaDeb - bet.amount).toFixed(2);
                                        headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());

                                    } else {
                                        summaDeb = 0;
                                    }
                                    USER_BALANCE = responce.ResponseData.balance;
                                    headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                                    self.changeStatus($.client.getLocalizedString('TEXT_BET_CANCELED', true), 0, true, 3000);
                                }
                            } else {
                                console.log(cancelBet);
                            }
                        }, function(err) {
                            console.log(err);
                        });
                }
                var cancelBet;
                for (var i = 0; i < previousBetChips[previousBetChips.length - 1].length; i++) {
                    cancelBet=previousBetChips[previousBetChips.length - 1][i];
                    if (cancelBet.bet.items) {
                        cancel(cancelBet);
                    } else {
                        tableChips.splice(tableChips.indexOf(cancelBet), 1);
                        cancelBet.chip.destroy();
                    }
                }
                previousBetChips.splice(previousBetChips.length - 1, 1);
            }
    },
    saveRoundBet: function () {
        if (previousBetChips.length > 0) {
            roundBetChips = previousBetChips.slice(0);;
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
    removeLossesBet: function (winNumber) {
        var items = [];
        if (tableChips.length > 0) {
            for (var i = 0; i < tableChips.length; i++) {
                var betChip = tableChips[i];
                if (!betChip.bet.numbers || betChip.bet.numbers.indexOf(winNumber) < 0) {
                    betChip.chip.destroy();
                    items.push(betChip);
                }
            }
        }
        for (var i = 0; i < items.length; i++) {
            tableChips.splice(tableChips.indexOf(items[i]), 1);
        }
    },
    repeatBets: function (element) {
        var self = this;
        if (MessageDispatcher.isTableOpen && overlayGroup.inputEnabled) {
            if (roundBetChips.length > 0) {
                for (var i = 0; i < roundBetChips.length; i++) {
                    for (var j = 0; j < roundBetChips[i].length; j++) {
                        var pBet = roundBetChips[i][j];
                    var bet = { name: pBet.name, type: pBet.type, amount: pBet.amount, bet: pBet.bet };
                    var isValidBet = this.checkLimit(bet);
                    if (isValidBet.state && pBet.bet.items) {
                        bet.chip = self.add.graphics(pBet.chip.x, pBet.chip.y, selectedChipsGroup);
                        bet.active_sprite = this.add.sprite(0, 0, "chips", pBet.active_sprite.fId);
                        bet.active_sprite.width = 65;
                        bet.active_sprite.height = 65;
                        bet.active_sprite.fId = pBet.active_sprite.fId;
                        bet.chip.addChild(bet.active_sprite);

                        var chipAmount = pBet.amount;
                        for (var k = 0; k < tableChips.length; k++) {
                            if (tableChips[k].name == bet.name) {
                                chipAmount += tableChips[k].amount;
                            }
                        }
                        chipAmount = chipAmount % 1 == 0 ? chipAmount : parseFloat(chipAmount).toFixed(1);
                        bet.chipText = this.add.text(34, 20,(chipAmount > 999 ? kFormater(chipAmount) : chipAmount), {
                            font: "bold 20px Arial",
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
    confirmBet: function (chip) {
        var self = this;
        var bets = [],
        state = false;
        var unConfirmBets, errText, showInfoText = true;
        if (!isSubmiting) {
            var notSentChipsArray = $.grep(tableChips, function(n, i) {
                return (!n.sent && n.bet.items);
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
                            items: unConfirmBets.items.sort(),
                            name: unConfirmBets.name,
                        });
                    }
                    notSentChipsArray[i].submit = true;
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
                                errText=$.client.getLocalizedString('TEXT_INFO_BET_CONFIRMED', true);
                                showInfoText = false;
                                previousBetChips.push($.grep(tableChips, function (n, i) {
                                    return (!n.sent || !n.submit);
                                }));
                                for (var i = 0; i < responce.ResponseData.bets.length; i++) {
                                    if (notSentChipsArray[i]) {
                                        notSentChipsArray[i].sent = responce.ResponseData.bets[i].wasMade;
                                    }
                                }
                                state = true;
                                if (chip)
                                    chip['submit'] = true;
                            } else {
                                previousBetChips.push($.grep(tableChips, function (n, i) {
                                    return (!n.sent || !n.submit);
                                }));
                                for (var i = 0; i < responce.ResponseData.bets.length; i++) {
                                    if (notSentChipsArray[i]) {
                                        notSentChipsArray[i].sent = responce.ResponseData.bets[i].wasMade;
                                        if (responce.ResponseData.bets[i].wasMade)
                                            state = true;
                                    }
                                }
                                if (chip)
                                    chip['submit'] = true;
                                if (state)
                                    errText = $.client.getLocalizedString('TEXT_INFO_NOT_ALL_BET_CONFIRMED', true);
                                else
                                    errText = $.client.getLocalizedString('TEXT_INFO_BET_NOT_CONFIRMED', true);
                                self.clearAllBet(false);
                            }
                        } else {
                            previousBetChips.push($.grep(tableChips, function (n, i) {
                                return (!n.sent || !n.submit);
                            }));
                            for (var i = 0; i < responce.ResponseData.bets.length; i++) {
                                if (notSentChipsArray[i]) {
                                    notSentChipsArray[i].sent = responce.ResponseData.bets[i].wasMade;
                                    if (responce.ResponseData.bets[i].wasMade)
                                        state = true;
                                }
                            }
                            if (chip)
                                chip['submit'] = true;
                            if (state)
                                errText = $.client.getLocalizedString('TEXT_INFO_NOT_ALL_BET_CONFIRMED', true);
                            else
                                errText = $.client.getLocalizedString('TEXT_INFO_BET_NOT_CONFIRMED', true);
                            self.clearAllBet(false);
                        }
                        isSubmiting = false;
                        if (errText) {
                            self.showMessage(errText);
                            if (showInfoText) {
                                self.changeStatus(errText, 0, false, 2000);
                            }
                        }
                    }, function(err) {
                        isSubmiting = false;
                        self.clearAllBet(false);
                        console.log(err);
                    });
            }
        } else {
            setTimeout(function(){
                self.confirmBet();
            },100);
        }
        return state;
    },    
    checkLimit: function (par) {
        var name, type, amount, cellTotalAmount = 0, totalAmount, errText;
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
                if (tableChips[i].name != "tiers" && tableChips[i].name != "orphelins" && tableChips[i].name != "voisins" && tableChips[i].name != "nZero")
                    totalAmount += tableChips[i].amount;
                if (tableChips[i].name == name) {
                    cellTotalAmount += tableChips[i].amount;
                }
            }

            if (totalAmount > parseFloat(currentLimits["Table"].Max)) {
                errText = $.client.getLocalizedString('Table_limits', true, { min: formatLimitAmount(currentLimits["Table"].Min), max: formatLimitAmount(currentLimits["Table"].Max), sign: $.client.UserData.CurrencySign });
                validAmount = parseFloat(currentLimits["Table"].Max) - (totalAmount - amount);
                valid = false;
            } else if (totalAmount < parseFloat(currentLimits["Table"].Min)) {
                errText = $.client.getLocalizedString('Table_limits', true, { min: formatLimitAmount(currentLimits["Table"].Min), max: formatLimitAmount(currentLimits["Table"].Max), sign: $.client.UserData.CurrencySign });
                valid = false;
            } else {
                if (type == 'column' || type == 'dozen') {
                    if (cellTotalAmount > parseFloat(currentLimits["Column_Dozen"].Max)) {
                        errText = $.client.getLocalizedString('Column_Dozen_limits', true, { min: formatLimitAmount(currentLimits["Column_Dozen"].Min), max: formatLimitAmount(currentLimits["Column_Dozen"].Max), sign: $.client.UserData.CurrencySign });
                        validAmount = parseFloat(currentLimits["Column_Dozen"].Max) - (cellTotalAmount - amount);
                        valid = false;
                    } else if (cellTotalAmount < parseFloat(currentLimits["Column_Dozen"].Min)) {
                        errText = $.client.getLocalizedString('Column_Dozen_limits', true, { min: formatLimitAmount(currentLimits["Column_Dozen"].Min), max: formatLimitAmount(currentLimits["Column_Dozen"].Max), sign: $.client.UserData.CurrencySign });
                        valid = false;
                    }
                } else if (type == 'high_low' || type == 'evens_odds' || type == 'color') {
                    if (cellTotalAmount < parseFloat(currentLimits["Fifty_Fifty"].Min)) {
                        errText = $.client.getLocalizedString('Fifty_fifty_limits', true, { min: formatLimitAmount(currentLimits["Fifty_Fifty"].Min), max: formatLimitAmount(currentLimits["Fifty_Fifty"].Max), sign: $.client.UserData.CurrencySign });
                        valid = false;
                    } else if (cellTotalAmount > parseFloat(currentLimits["Fifty_Fifty"].Max)) {
                        validAmount = parseFloat(currentLimits["Fifty_Fifty"].Max) - (cellTotalAmount - amount);
                        errText = $.client.getLocalizedString('Fifty_fifty_limits', true, { min: formatLimitAmount(currentLimits["Fifty_Fifty"].Min), max: formatLimitAmount(currentLimits["Fifty_Fifty"].Max), sign: $.client.UserData.CurrencySign });
                        valid = false;
                    }
                } else if (type == 'straight') {
                    if (cellTotalAmount < parseFloat(currentLimits["Straight"].Min)) {
                        errText = $.client.getLocalizedString('Staight_limits', true, { min: formatLimitAmount(currentLimits["Straight"].Min), max: formatLimitAmount(currentLimits["Straight"].Max), sign: $.client.UserData.CurrencySign });
                        valid = false;
                    } else if (cellTotalAmount > parseFloat(currentLimits["Straight"].Max)) {
                        validAmount = parseFloat(currentLimits["Straight"].Max) - (cellTotalAmount - amount);
                        errText = $.client.getLocalizedString('Staight_limits', true, { min: formatLimitAmount(currentLimits["Straight"].Min), max: formatLimitAmount(currentLimits["Straight"].Max), sign: $.client.UserData.CurrencySign });
                        valid = false;
                    }
                } else if (type == 'corner') {
                    if (cellTotalAmount < parseFloat(currentLimits["Corner"].Min)) {
                        errText = $.client.getLocalizedString('Corner_limits', true, { min: formatLimitAmount(currentLimits["Corner"].Min), max: formatLimitAmount(currentLimits["Corner"].Max), sign: $.client.UserData.CurrencySign });
                        valid = false;
                    } else if (cellTotalAmount > parseFloat(currentLimits["Corner"].Max)) {
                        validAmount = parseFloat(currentLimits["Corner"].Max) - (cellTotalAmount - amount);
                        errText = $.client.getLocalizedString('Corner_limits', true, { min: formatLimitAmount(currentLimits["Corner"].Min), max: formatLimitAmount(currentLimits["Corner"].Max), sign: $.client.UserData.CurrencySign });
                        valid = false;
                    }
                } else if (type == 'split') {
                    if (cellTotalAmount < parseFloat(currentLimits["Split"].Min)) {
                        errText = $.client.getLocalizedString('Split_limits', true, { min: formatLimitAmount(currentLimits["Split"].Min), max: formatLimitAmount(currentLimits["Split"].Max), sign: $.client.UserData.CurrencySign });
                        valid = false;
                    } else if (cellTotalAmount > parseFloat(currentLimits["Split"].Max)) {
                        validAmount = parseFloat(currentLimits["Split"].Max) - (cellTotalAmount - amount);
                        errText = $.client.getLocalizedString('Split_limits', true, { min: formatLimitAmount(currentLimits["Split"].Min), max: formatLimitAmount(currentLimits["Split"].Max), sign: $.client.UserData.CurrencySign });
                        valid = false;
                    }
                } else if (type == 'line') {
                    if (cellTotalAmount < parseFloat(currentLimits["Line"].Min)) {
                        errText = $.client.getLocalizedString('Line_limits', true, { min: formatLimitAmount(currentLimits["Line"].Min), max: formatLimitAmount(currentLimits["Line"].Max), sign: $.client.UserData.CurrencySign });
                        valid = false;
                    } else if (cellTotalAmount > parseFloat(currentLimits["Line"].Max)) {
                        validAmount = parseFloat(currentLimits["Line"].Max) - (cellTotalAmount - amount);
                        errText = $.client.getLocalizedString('Line_limits', true, { min: formatLimitAmount(currentLimits["Line"].Min), max: formatLimitAmount(currentLimits["Line"].Max), sign: $.client.UserData.CurrencySign });
                        valid = false;
                    }
                } else if (type == 'street') {
                    if (cellTotalAmount < parseFloat(currentLimits["Street"].Min)) {
                        errText = $.client.getLocalizedString('Street_limits', true, { min: formatLimitAmount(currentLimits["Street"].Min), max: formatLimitAmount(currentLimits["Street"].Max), sign: $.client.UserData.CurrencySign });
                        valid = false;
                    } else if (cellTotalAmount > parseFloat(currentLimits["Street"].Max)) {
                        validAmount = parseFloat(currentLimits["Street"].Max) - (cellTotalAmount - amount);
                        errText = $.client.getLocalizedString('Street_limits', true, { min: formatLimitAmount(currentLimits["Street"].Min), max: formatLimitAmount(currentLimits["Street"].Max), sign: $.client.UserData.CurrencySign });
                        valid = false;
                    }
                }

            }
            if (valid)
                validAmount = amount;
            if (validAmount > parseFloat(USER_BALANCE)) {
                errText = $.client.getLocalizedString('TEXT_ERROR_NO_MONEY_MSG', true);
                validAmount = USER_BALANCE;
                valid = false;
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

        if (validAmount > 0) {
            valid = true;
            getChip(validAmount);
        } else {
            chips.push(selectedChipId);
        }
        if (errText) {
            if (valid && chips.length > 0) {
                var sum = 0;
                for (var i = chips.length; i--;) {
                    sum += dib_cost[chips[i]];
                }
                errText = $.client.getLocalizedString('Bet adjusted to', true, { sum: formatLimitAmount(sum), sign: $.client.UserData.CurrencySign });
            }

        }
        return { state: valid, chips: chips, errorText: errText };
    },
    drawBetsChip: function (bets) {
        var self = this, betObj, chipId = 0, betAmount = 0;
        for (var i in bets) {
            betObj = {};
            for (var j in tableGroup.children) {
                if (tableGroup.children[j].bet_name === bets[i].betInfo.name)
                    betObj = self.makeBetobject(tableGroup.children[j]);
            }
            betAmount += bets[i].betInfo.amount;
            for (var a in dib_cost) {
                if (dib_cost[a] === bets[i].betInfo.amount)
                    chipId = parseInt(a);
            }
            betObj.bets.amount = bets[i].betInfo.amount;
            previousBetChips.push([self.drawChip(betObj, chipId, true, true)]);
            summaDeb = betAmount;
            if (headerBetInputVal !== undefined) {
                headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb));
            }
        }
    },
    drawChip: function (element, chipId, sent, submit) {
        var self = this;
        var debValue, elementX, elementY;
        var event = $.extend(true, {}, element);
        var betChip = { name: event.name, type: event.bet_type, amount: dib_cost[chipId], bet: event.bets, sent: sent, submit:submit,chips: event.chips };
        debValue = dib_cost[chipId];
        var chipAmount = debValue;
        betChip.bet.amount = dib_cost[chipId];
        betChip.bet.name = event.bet_name;
        elementX = element.x + element.width / 2 - 25;
        elementY = element.y + element.height / 2 - 25;
        betChip.chip = self.add.graphics(elementX, elementY, selectedChipsGroup);
        betChip.active_sprite = self.add.sprite(0, 0, "chips", chipId + 6);
        betChip.active_sprite.width = 65;
        betChip.active_sprite.height = 65;
        betChip.active_sprite.fId = chipId + 6;
        betChip.chip.addChild(betChip.active_sprite);
        for (var i = 0; i < tableChips.length; i++) {
            if (tableChips[i].name == betChip.name) {
                chipAmount += tableChips[i].amount;
            }
        }
        chipAmount=chipAmount % 1 == 0 ? chipAmount : parseFloat(chipAmount).toFixed(1)
        betChip.chipText = self.add.text(34, 18, (chipAmount > 999 ? kFormater(chipAmount) : chipAmount), {
            font: "26px ProximaNova",
            fill: "#fff"
        });
        betChip.chipText.anchor.x = Math.round(betChip.chipText.width * 0.5) / betChip.chipText.width;
        betChip.chip.addChild(betChip.chipText);
        betChip.chip.scale.set(0.8);
        tableChips.push(betChip);
        selectedChipsGroup.add(betChip.chip);
        return betChip;
    },
    makeBet: function (element, single) {
        var self = this;
        var event = $.extend(true, {}, element);
        var isValidBet, validateObj;
        if (MessageDispatcher.isTableOpen) {
            var betChip = { name: event.name, type: event.bet_type, amount: event.bet_amount, bet: event.bets };
            validateObj = this.checkLimit(betChip);
            isValidBet = validateObj.state;
            if (isValidBet) {
                if (single && (validateObj.chips.length > 1 || validateObj.chips[0] != selectedChipId)) {
                    return false;
                }
                if (validateObj.errorText) {
                    self.changeStatus(validateObj.errorText.toUpperCase(), 0, false, 2000);
                    self.showMessage(validateObj.errorText.toUpperCase());
                }
                $.each(validateObj.chips, function (i, chipId) {
                    var debValue = dib_cost[chipId];
                    summaDeb = parseFloat(summaDeb) + parseFloat(debValue);
                    summaDeb = parseFloat(summaDeb).toFixed(2);
                    headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
                    self.drawChip(element, chipId);
                });
                return true;
            } else {
                self.changeStatus(validateObj.errorText.toUpperCase(), 0, false, 2000);
                self.showMessage(validateObj.errorText.toUpperCase());
                return false;
            }
        }
    },
    changeChips: function (element) {
        var chipCursorText;
        selectedChipId = element.id;
        chipCursor.loadTexture("chips", selectedChipId);
        chipCursorText = chipCursor.text;
        chipsGroup.forEach(function (item) {
            if (item.key == "chips")
                if (item.id == selectedChipId) {
                    item.y = item.rY - 10;
                    item.chipText.y = item.rY + 18;
                    item.loadTexture(item.key, item.id + 6);
                    chipCursorText.setText((item.debValue > 999 ? kFormater(item.debValue) : item.debValue));
                } else {
                    item.y = item.rY;
                    item.chipText.y = item.rY + 28;
                    item.loadTexture(item.key, item.id);
                }
        });
        this.changeGameSize();
    },
    getLimits: function (element) {
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
                        self.confirmLimit();
                    } else if (limits.length == 1 && !limitsSelected) {
                        selectedLimits = limits[0];
                        self.confirmLimit();
                    } else {
                        currentLimits = selectedLimits;
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
                modalBg = this.add.button(0, 0, "modalBg", self.closeLimitSelectionPopup, this);
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
                    maxHeight: 50,
                    maxWidth: 350
                });
                 limitSelectionPopup.addChild(limitTitleText);
  
                 limitBottomText = createTextLbl(self, {
                     text: $.client.getLocalizedString("Amount are min/max", true),
                     x: 800,
                     y: 950,
                     font: "ProximaNova",
                     size: 22,
                     color: "#fff",
                     centered: true,
                     maxHeight: 50,
                     maxWidth: 250
                 });
                limitSelectionPopup.addChild(limitBottomText);
                limitSelectionPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Limit", true).toUpperCase(),
                    x: 490,
                    y: 100,
                    font: "ProximaNova",
                    size: 22,
                    style:"bold",
                    color: "#878787",
                    centered: true,
                    maxHeight: 50,
                    maxWidth: 150
                }));
                limitSelectionPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Table", true).toUpperCase(),
                    x: 610,
                    y: 100,
                    font: "ProximaNova",
                    size: 22,
                    style: "bold",
                    color: "#878787",
                    centered: true,
                    maxHeight: 50,
                    maxWidth: 150
                }));
                limitSelectionPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Straight", true).toUpperCase(),
                    x: 790,
                    y: 100,
                    font: "ProximaNova",
                    size: 22,
                    style: "bold",
                    color: "#878787",
                    centered: true,
                    maxHeight: 50,
                    maxWidth: 150
                }));
                limitSelectionPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Column\nDozen", true).toUpperCase(),
                    x: 945,
                    y: 100,
                    font: "ProximaNova",
                    size: 22,
                    style: "bold",
                    color: "#878787",
                    centered: true,
                    maxHeight: 50,
                    maxWidth: 150
                }));
                limitSelectionPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Fifty/Fifty", true).toUpperCase(),
                    x: 1090,
                    y: 100,
                    font: "ProximaNova",
                    size: 22,
                    style: "bold",
                    color: "#878787",
                    centered: true,
                    maxHeight: 50,
                    maxWidth: 150
                }));

               var selected = selectedLimits;
                var cells = [];
                function showLimitRow(x, y, limit, id) {
                    var cell = self.add.button(x-30, y - 15, "listSelector", function () {
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
                    cell.width = 740;
                    cell.height = 55;
                    limitSelectionPopup.add(cell);
                    var nameLbl = createTextLbl(self, {
                        text:  limit.Title.toUpperCase(),
                        x: x+10,
                        y: y,
                        font: "ProximaNova",
                        size: 24,
                        color: "#fff",
                        centered: true,
                        maxHeight: 15,
                        maxWidth: 130
                    });
                    limitSelectionPopup.addChild(nameLbl);

                    var tMin = parseFloat(limit.Table.Min) % 1 == 0 ? parseFloat(limit.Table.Min).toFixed(0) : limit.Table.Min.replace(',', '.');
                    var tMax = parseFloat(limit.Table.Max) % 1 == 0 ? parseFloat(limit.Table.Max).toFixed(0) : limit.Table.Max.replace(',', '.');
                    tMin = tMin > 9999 ? kFormater(tMin) : tMin;
                    tMax = tMax > 9999 ? kFormater(tMax) : tMax;
                    var tText = tMin + '/' + tMax;
                    var tableLbl = createTextLbl(self, {
                        text: tText,
                        x: x + 150,
                        y: y,
                        font: "ProximaNova",
                        size: 24,
                        color: "#fff",
                        centered: true,
                        maxHeight: 15,
                        maxWidth: 150
                    });

                    limitSelectionPopup.addChild(tableLbl);

                    var sMin = parseFloat(limit.Straight.Min) % 1 == 0 ? parseFloat(limit.Straight.Min).toFixed(0) : limit.Straight.Min.replace(',', '.');
                    var sMax = parseFloat(limit.Straight.Max) % 1 == 0 ? parseFloat(limit.Straight.Max).toFixed(0) : limit.Straight.Max.replace(',', '.');
                    sMin = sMin > 9999 ? kFormater(sMin) : sMin;
                    sMax = sMax > 9999 ? kFormater(sMax) : sMax;
                    var sText = sMin + '/' + sMax;
                    var straightLbl = createTextLbl(self, {
                        text: sText,
                        x: x + 320,
                        y: y,
                        font: "ProximaNova",
                        size: 24,
                        color: "#fff",
                        centered: true,
                        maxHeight: 15,
                        maxWidth: 150
                    });

                    limitSelectionPopup.addChild(straightLbl);
                    var cdMin = parseFloat(limit.Column_Dozen.Min) % 1 == 0 ? parseFloat(limit.Column_Dozen.Min).toFixed(0) : limit.Column_Dozen.Min.replace(',', '.');
                    var cdMax = parseFloat(limit.Column_Dozen.Max) % 1 == 0 ? parseFloat(limit.Column_Dozen.Max).toFixed(0) : limit.Column_Dozen.Max.replace(',', '.');
                    cdMin = cdMin > 9999 ? kFormater(cdMin) : cdMin;
                    cdMax = cdMax > 9999 ? kFormater(cdMax) : cdMax;
                    var cdText = cdMin + '/' + cdMax;
                    var cdLbl = createTextLbl(self, {
                        text: cdText,
                        x: x + 480,
                        y: y,
                        font: "ProximaNova",
                        size: 24,
                        color: "#fff",
                        centered: true,
                        maxHeight: 15,
                        maxWidth: 150
                    });

                    limitSelectionPopup.addChild(cdLbl);
                    var ffMin = parseFloat(limit.Fifty_Fifty.Min) % 1 == 0 ? parseFloat(limit.Fifty_Fifty.Min).toFixed(0) : limit.Fifty_Fifty.Min.replace(',', '.');
                    var ffMax = parseFloat(limit.Fifty_Fifty.Max) % 1 == 0 ? parseFloat(limit.Fifty_Fifty.Max).toFixed(0) : limit.Fifty_Fifty.Max.replace(',', '.');
                    ffMin = ffMin > 9999 ? kFormater(ffMin) : ffMin;
                    ffMax = ffMax > 9999 ? kFormater(ffMax) : ffMax;
                    var ffText = ffMin + '/' + ffMax;
                    var ffLbl = createTextLbl(self, {
                        text: ffText,
                        x: x + 630,
                        y: y,
                        font: "ProximaNova",
                        size: 24,
                        color: "#fff",
                        centered: true,
                        maxHeight: 15,
                        maxWidth: 150
                    });
                    limitSelectionPopup.addChild(ffLbl);
                }
                for (var i in limits) {
                    showLimitRow(460, i * 60 + 160, limits[i], i);
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
                modalBg = this.add.button(0, 0, "modalBg",  this.closelimitPopup, this);
                modalBg.priorityID = 0;
                modalBg.useHandCursor = false;
                limitPopup.add(modalBg);
                var limitBox = this.add.sprite(500, 60, 'limitsBg');
                limitBox.inputEnabled = true;
                limitBox.priorityID = 1;
                limitPopup.add(limitBox);
                limitBox.width = 700;
                limitBox.height = 800;
                cancelBtn = this.add.button(1147, 77, 'closeBtn', this.closelimitPopup, this);
                cancelBtn.useHandCursor = true;
                limitPopup.addChild(cancelBtn);
                var changeBtn = this.add.button(850, 77, 'mainBtnBg', function () {
                    self.closelimitPopup();
                    self.showLimitsSelector();
                }, this);
                limitPopup.add(changeBtn);
                changeBtn.height = 40;
                changeBtn.width = 145;
                var changeText = createTextLbl(self, {
                    text: $.client.getLocalizedString("Change", true).toUpperCase(),
                    x: 928,
                    y: 86,
                    font: "ProximaNova",
                    size: 22,
                    color: "#fff",
                    centered: true,
                    maxHeight: 55,
                    maxWidth: 125
                });
                limitPopup.add(changeText);
                changeBtn.clicked = true;
                changeBtn.input.useHandCursor = true;

                if ($.client.UserData.Features && $.client.UserData.Features.rules) {
                var rulesBtn = this.add.button(1000, 77, 'mainBtnBg', function () {
                    $.client.showRules();
                }, this);
                rulesBtn.height = 40;
                limitPopup.add(rulesBtn);
                var rulesText = createTextLbl(self, {
                    text: $.client.getLocalizedString("Rules", true).toUpperCase(),
                    x: 1071,
                    y: 86,
                    font: "ProximaNova",
                    size: 22,
                    color: "#fff",
                    centered: true,
                    maxHeight: 46,
                    maxWidth: 110
                });
                limitPopup.add(rulesText);
                rulesBtn.clicked = true;
                rulesBtn.input.useHandCursor = true;
                }

                limitTitleText = createTextLbl(self, {
                    text: $.client.getLocalizedString("Info", true).toUpperCase(),
                    x: 530,
                    y: 80,
                    font: "ProximaNova",
                    size: 26,
                    color: "#fff",
                    centered: false,
                    maxHeight: 55,
                    maxWidth: 140
                });
                limitPopup.addChild(limitTitleText);
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Bet name", true).toUpperCase(),
                    x: 760,
                    y: 150,
                    font: "ProximaNova",
                    size: 20,
                    color: "#878787",
                    centered: true,
                    maxHeight: 25,
                    maxWidth: 140
                }));
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Min bet", true).toUpperCase(),
                    x: 890,
                    y: 150,
                    font: "ProximaNova",
                    size: 20,
                    color: "#878787",
                    centered: true,
                    maxHeight: 55,
                    maxWidth: 100
                }));
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Max bet", true).toUpperCase(),
                    x: 1000,
                    y: 150,
                    font: "ProximaNova",
                    size: 20,
                    color: "#878787",
                    centered: true,
                    maxHeight: 55,
                    maxWidth: 100
                }));
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Pays", true).toUpperCase(),
                    x: 1090,
                    y: 150,
                    font: "ProximaNova",
                    size: 20,
                    color: "#878787",
                    centered: true,
                    maxHeight: 55,
                    maxWidth: 80
                }));
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Inside bets", true).toUpperCase(),
                    x: 550,
                    y: 300,
                    font: "ProximaNova",
                    size: 20,
                    color: "#878787",
                    centered: false,
                    maxHeight: 55,
                    maxWidth: 140
                }));
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Outside bets", true).toUpperCase(),
                    x: 550,
                    y: 650,
                    font: "ProximaNova",
                    size: 20,
                    color: "#878787",
                    centered: false,
                    maxHeight: 55,
                    maxWidth: 140
                }));
                function showLimitRow(x, y, limit) {
                    limitPopup.addChild(createTextLbl(self, {
                        text: limit.name.toUpperCase(),
                        x: x,
                        y: y,
                        font: "ProximaNova",
                        size: 22,
                        color: "#fff",
                        centered: false,
                        maxHeight: 45,
                        maxWidth: 120
                    }));
                    var min = limit.min.replace(',', '.')
                    min = parseFloat(min) % 1 == 0 ? parseFloat(min).toFixed(0) : min;
                    min = min > 9999 ? kFormater(min) : min;
                  
                    var minLbl = limitPopup.addChild(self.add.text(x + 170, y, min, {
                        font: "22px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    minLbl.anchor.x = Math.round(minLbl.width * 0.5) / minLbl.width;
                    var max = limit.max.replace(',', '.')
                    max = parseFloat(max) % 1 == 0 ? parseFloat(max).toFixed(0) : max;
                    max = max > 9999 ? kFormater(max) : max;
                    var maxLbl = limitPopup.addChild(self.add.text(x + 280, y, max, {
                        font: "22px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    maxLbl.anchor.x = Math.round(maxLbl.width * 0.5) / maxLbl.width;
                    var rateLbl = limitPopup.addChild(self.add.text(x + 380, y, limit.winRateText, {
                        font: "22px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    rateLbl.anchor.x = Math.round(rateLbl.width * 0.5) / rateLbl.width;
                }

                showLimitRow(715, 195, {
                    name: $.client.getLocalizedString("Straight", true),
                    min: selectedLimits.Straight.Min,
                    max: selectedLimits.Straight.Max,
                    winRateText: "35:1"
                });
                showLimitRow(715, 243, {
                    name: $.client.getLocalizedString("Split", true),
                    min: selectedLimits.Split.Min,
                    max: selectedLimits.Split.Max,
                    winRateText: "17:1"
                });
                showLimitRow(715, 290, {
                    name: $.client.getLocalizedString("Street", true),
                    min: selectedLimits.Street.Min,
                    max: selectedLimits.Street.Max,
                    winRateText: "11:1"
                });
                showLimitRow(715, 340, {
                    name: $.client.getLocalizedString("Corner", true),
                    min: selectedLimits.Corner.Min,
                    max: selectedLimits.Corner.Max,
                    winRateText: "8:1"
                });
                showLimitRow(715, 390, {
                    name: $.client.getLocalizedString("Sixline", true),
                    min: selectedLimits.Line.Min,
                    max: selectedLimits.Line.Max,
                    winRateText: "5:1"
                });
                showLimitRow(715, 435, {
                    name: $.client.getLocalizedString("First column", true),
                    min: selectedLimits.Column_Dozen.Min,
                    max: selectedLimits.Column_Dozen.Max,
                    winRateText: "2:1"
                });
                showLimitRow(715, 482, {
                    name: $.client.getLocalizedString("Second column", true),
                    min: selectedLimits.Column_Dozen.Min,
                    max: selectedLimits.Column_Dozen.Max,
                    winRateText: "2:1"
                });
                showLimitRow(715, 530, {
                    name: $.client.getLocalizedString("Third column", true),
                    min: selectedLimits.Column_Dozen.Min,
                    max: selectedLimits.Column_Dozen.Max,
                    winRateText: "2:1"
                });
                showLimitRow(715, 577, {
                    name: $.client.getLocalizedString("Dozens", true),
                    min: selectedLimits.Column_Dozen.Min,
                    max: selectedLimits.Column_Dozen.Max,
                    winRateText: "2:1"
                });
                showLimitRow(715, 625, {
                    name: $.client.getLocalizedString("Odd/Even", true),
                    min: selectedLimits.Fifty_Fifty.Min,
                    max: selectedLimits.Fifty_Fifty.Max,
                    winRateText: "1:1"
                });
                showLimitRow(715, 680, {
                    name: $.client.getLocalizedString("High/Low", true),
                    min: selectedLimits.Fifty_Fifty.Min,
                    max: selectedLimits.Fifty_Fifty.Max,
                    winRateText: "1:1"
                });
                showLimitRow(715, 725, {
                    name: $.client.getLocalizedString("Red/Black", true),
                    min: selectedLimits.Fifty_Fifty.Min,
                    max: selectedLimits.Fifty_Fifty.Max,
                    winRateText: "1:1"
                });
                showLimitRow(715, 772, {
                    name: $.client.getLocalizedString("Table", true),
                    min: selectedLimits.Table.Min,
                    max: selectedLimits.Table.Max
                });
                
            }
        }
    },        
    getLimitText: function(obj){

        var text = "", sign = '';
        var tableObj = obj.Table,
          straightObj = obj.Straight,
          dozenObj = obj.Column_Dozen,
          fiftyObj = obj.Fifty_Fifty;

        function addSpace(str, length) {
            for (var i = 0; i < length; i++)
                str += " ";
            return str;
        }
        sign = $.client.UserData.CurrencySign;
        var tableStr = sign + tableObj.Min + '/' + tableObj.Max + sign;
        text += addSpace(tableStr, 24 - tableStr.length);
        var straightStr = sign + straightObj.Min + '/' + straightObj.Max + sign;
        text += addSpace(straightStr, 28 - straightStr.length);
        var dozenStr = sign + dozenObj.Min + '/' + dozenObj.Max + sign;
        text += addSpace(dozenStr, 26 - dozenStr.length);
        var fiftyStr = sign + fiftyObj.Min + '/' + fiftyObj.Max + sign;
        text += fiftyStr;
        limitBtnText.text = text;
    },
    actionOnLimitBtn: function(btn){               
       selectedLimits = [];            
       this.selectLimitBtn(btn);
       selectedLimits = btn.limits; 
    //   confirmLimitBtn.inputEnabled = true;
    //   confirmLimitBtn.input.useHandCursor = true;  
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
                currentLimits = selectedLimits;
                self.validateChips();
            }
        }, function (err) {
            console.log(err);
        });
    },
    validateChips: function () {
        var self = this,prevDissabled;
        chipsGroup.forEach(function (item) {
            if (dib_cost[item.id]) {
                if (dib_cost[item.id] < parseFloat(selectedLimits["Table"].Min) ||
                    (dib_cost[item.id] < parseFloat(selectedLimits["Straight"].Min)
                    && dib_cost[item.id] < parseFloat(selectedLimits["Column_Dozen"].Min)
                    && dib_cost[item.id] < parseFloat(selectedLimits["Fifty_Fifty"].Min)
                    && dib_cost[item.id] < parseFloat(selectedLimits["Split"].Min)
                    && dib_cost[item.id] < parseFloat(selectedLimits["Corner"].Min)
                    && dib_cost[item.id] < parseFloat(selectedLimits["Line"].Min)
                    && dib_cost[item.id] < parseFloat(selectedLimits["Street"].Min)
                    )) {
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
        var statTitleText, modalBg,cancelBtn, winLbl,betLbl;
        if (!isModalShow) {
            if (_videoFlagShow) {
                self.showVideo();
            }
            isModalShow = true;
            historyPopup = this.add.group();
            historyPopup.clicked = false;;
            worldGroup.add(historyPopup);
            modalBg = this.add.button(0, 0, "modalBg", this.closeHistoryPopup, this);
            modalBg.priorityID = 0;
            modalBg.useHandCursor = false;
            historyPopup.add(modalBg);
            var historyBox = this.add.sprite(660, 70, 'historyBg');
            historyBox.height=680;
            historyBox.width=340;
            historyBox.inputEnabled = true;
            historyBox.priorityID = 1;
            historyPopup.add(historyBox);
            cancelBtn = this.add.button(950, 80, 'closeBtn', this.closeHistoryPopup, this);
            cancelBtn.useHandCursor = true;
            historyPopup.addChild(cancelBtn);
           
            var totalLost = createTextLbl(self, {
                text: $.client.getLocalizedString("Total lost", true),
                x: 710,
                y: 660,
                font: "ProximaNova",
                size: 24,
                color: "#878787",
                centered: false,
                maxHeight: 30,
                maxWidth: 150
            });
            var totalLostVal = createTextLbl(self, {
                text: $.client.UserData.CurrencySign + (TOTAL_LOST>99999?kFormater(TOTAL_LOST): parseFloat(TOTAL_LOST).toFixed(2)),
                x: totalLost.x + totalLost.width + 20,
                y: 660,
                font: "ProximaNova",
                size: 24,
                color: "#878787",
                centered: false,
                maxHeight: 30,
                maxWidth: 50
            });
            historyPopup.addChild(totalLost);
            historyPopup.addChild(totalLostVal);

            statTitleText = createTextLbl(self, {
                text: $.client.getLocalizedString('History', true).toUpperCase(),
                x: 680,
                y: 85,
                font: "ProximaNova",
                size: 26,
                color: "#fff",
                centered: false,
                maxHeight: 30,
                maxWidth: 150
            });
            betLbl = createTextLbl(self, {
                text: $.client.getLocalizedString('TEXT_BET', true).toUpperCase(),
                x: 830,
                y: 150,
                font: "ProximaNova",
                size: 20,
                color: "#878787",
                centered: true,
                maxHeight: 30,
                maxWidth: 100
            });
           
            winLbl = createTextLbl(self, {
                text: $.client.getLocalizedString('TEXT_WIN', true).toUpperCase(),
                x: 925,
                y: 150,
                font: "ProximaNova",
                size: 20,
                color: "#878787",
                centered: true,
                maxHeight: 30,
                maxWidth: 80
            });
            
                historyPopup.addChild(statTitleText);
                historyPopup.addChild(winLbl);
                historyPopup.addChild(betLbl);

                function showRow(item, posX, posY) {
                    var numBg, numText, betText,winText, numTextVal,color;
                    numTextVal = item.number + '';
                    if (jQuery.inArray(parseInt(item.number, 10), blackNumberArr) != -1) {
                        color = "#ffffff";
                    } else if (jQuery.inArray(parseInt(item.number, 10), redNumberArr) != -1) {
                        color = "#ae3e3e";
                    } else {
                        color = "#459a59";
                    }
                    numBg = self.add.sprite(posX, posY, 'numberBg');
                    numText = self.add.text(numBg.x + 26, numBg.y + 14, numTextVal, { font: "22px ProximaNova", fill: color, align: "center" });
                    numText.anchor.x = Math.round(numText.width * 0.5) / numText.width;

                    historyPopup.addChild(numBg);
                    historyPopup.addChild(numText);
                    var betAmount = item.betAmount % 1 == 0 ? parseFloat(item.betAmount).toFixed(0) : parseFloat(item.betAmount).toFixed(2);
                    betAmount = betAmount > 9999 ? kFormater(betAmount) : betAmount;
                    betText = self.add.text(posX + 115, posY+13, $.client.UserData.CurrencySign + betAmount, { font: "22px ProximaNova", fill: "#fff", align: "center" });
                    betText.anchor.x = Math.round(betText.width * 0.5) / betText.width;
                    historyPopup.addChild(betText);
                    var winAmount = item.winAmount % 1 == 0 ? parseFloat(item.winAmount).toFixed(0) : parseFloat(item.winAmount).toFixed(2);
                    winAmount = winAmount > 9999 ? kFormater(winAmount) : winAmount;
                    winText = self.add.text(posX + 205, posY + 13, $.client.UserData.CurrencySign + winAmount, { font: "22px ProximaNova", fill: "#fff", align: "center" });
                    winText.anchor.x = Math.round(winText.width * 0.5) / winText.width;
                    historyPopup.addChild(winText);
                }
                var k = 0;
                for (var i = MessageDispatcher.betHistory.length - 1; i >= 0; i--) {
                    showRow(MessageDispatcher.betHistory[i], 720, 189 + k * 65);
                    k++;
                }
                tableGroup.setAll('inputEnabled', false);
                buttonGroup.setAll('clicked', false);
        }
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
            var settingsBox = this.add.sprite(750, 375, 'settingsBox');
            settingsBox.height = 203;
            settingsBox.width = 340;
            settingsPopup.add(settingsBox);
            settingsPopup.y = 500;
            settingsPopup.alpha = 0;
            var showTween=game.add.tween(settingsPopup).to({ y: 340 }, 200, Phaser.Easing.Linear.None, true);
            setTimeout(function () {
                game.add.tween(settingsPopup).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
            }, 100);
            cancelBtn = this.add.button(1047, 375, 'closeBtn', self.closeSettingsPopup);
            var soundBtn = settingsPopup.create(1010, 437, 'checkBox', $.client.getMuteState() ? 1 : 0);
            soundBtn.inputEnabled = true;
            soundBtn.input.useHandCursor = true;
            soundBtn.enabled = !$.client.getMuteState();
            soundBtn.events.onInputDown.add(function () {
               switchSound();
            }, this);

            function switchSound(){
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

            var layoutBtn = settingsPopup.create(1010, 474, 'checkBox',  0);
            layoutBtn.inputEnabled = true;
            layoutBtn.input.useHandCursor = true;
            layoutBtn.input.priorityID = 2;
            layoutBtn.enabled =true;
            layoutBtn.events.onInputDown.add(function () {
                switchLayout();
            }, this);
            
            function switchLayout(){
                if (layoutBtn.enabled) {
                    layoutBtn.loadTexture('checkBox', 1);
                    layoutBtn.enabled = false;
                    var params = getQueryParams(document.location.search);
                    createCookie(params.gameId, "Client4", 30);
                    document.location.href = document.location.href.replace(/clients\/Client3/g, "clients/Client4");
                } else {
                    layoutBtn.loadTexture('checkBox', 0);
                    layoutBtn.enabled = true;
                }
            }

            var  currentQuality;
            var currentStream;
            var qualitiesBox, qualityGroup;


            function showQuailitySelector() {
                if (!qualitiesBox) {
                    qualityGroup = self.add.group();
                    qualitiesBox = self.add.sprite(950, 433, 'settingsBox');
                    qualitiesBox.height = 150;
                    qualitiesBox.width = 120;
                    qualityGroup.add(qualitiesBox);
                    settingsPopup.add(qualityGroup);
                    qualitiesBox.alpha = 0;
                    var tween=game.add.tween(qualitiesBox).to({ x: 1090 }, 200, Phaser.Easing.Linear.None, true);
                    setTimeout(function() {
                        game.add.tween(qualitiesBox).to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true);
                    }, 100);
                    tween.onComplete.add(function() {
                        var qList =  $.client.getVideoQualities();
                        var qualityId;
                        if (qList.length > 4) {
                            var offset = 35 * (qList.length - 4);
                            qualitiesBox.height +=offset;
                            qualitiesBox.y = 433-offset;
                        }
                        for (var i in qList) {
                            var color = "#909090";
                            qualityId = qList[i];
                            if (qualityId=== $.client.getVideoQuality())
                                color = '#fff';
                            var quality = createTextLbl(self, {
                                text: $.client.getLocalizedString(qualityId, true).toUpperCase(),
                                x: 1110,
                                y: qualitiesBox.y+15 + i * 35,
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
                        for (var i in qList) {
                            var color = "#909090";
                            qualityId = qList[i];
                            if (qualityId === $.client.getVideoQuality())
                                color = '#fff';
                            var quality = createTextLbl(self, {
                                text: $.client.getLocalizedString(qualityId, true).toUpperCase(),
                                x: 1110,
                                y: 445 + i * 35,
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
                y: 395,
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
                y: 445,
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

            layoutSwitchLbl =  createTextLbl(self, {
                text: $.client.getLocalizedString("Enable wide layout", true).toUpperCase(),
                x: 780,
                y: 480,
                font: "ProximaNova",
                size: 20,
                color: "#808080",
                centered: false,
                maxHeight: 30,
                maxWidth: 180
            });
            layoutSwitchLbl.inputEnabled = true;
            layoutSwitchLbl.input.useHandCursor = true;
            layoutSwitchLbl.input.priorityID = 2;
            layoutSwitchLbl.enabled =true;
            layoutSwitchLbl.events.onInputDown.add(function () {
                switchLayout();
            }, this);
            var offset = 0;
            if ($.client.getVideoQuality() && $.client.getVideoQualities() && $.client.getVideoQualities().length > 0) {
                offset = 35;
                qualityLbl = createTextLbl(self, {
                    text: $.client.getLocalizedString('Quality', true).toUpperCase(),
                    x: 780,
                    y: 515,
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
                qualityLbl.events.onInputDown.add(function() {
                    showQuailitySelector();
                }, this);
                settingsPopup.addChild(qualityLbl);
                currentQuality = createTextLbl(self, {
                    text: $.client.getLocalizedString($.client.getVideoQuality(), true).toUpperCase(),
                    x: 1075,
                    y: 513,
                    font: "ProximaNova",
                    size: 22,
                    color: "#fff",
                    centered:false,
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
                    y: 515 + offset,
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
                    y: 513 + offset,
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
            settingsPopup.addChild(layoutSwitchLbl);
            settingsPopup.addChild(soundsLbl);

            tableGroup.setAll('inputEnabled', false);
            buttonGroup.setAll('clicked', false);
            for (var i = 0; i <= settingsPopup.children.length - 1; i++) {
                if (settingsPopup.children[i].input)
                     settingsPopup.children[i].input.enabled = false;
            }
            showTween.onComplete.add(function () {
                for (var i = 0; i <= settingsPopup.children.length - 1; i++) {
                    if (settingsPopup.children[i].input)
                        settingsPopup.children[i].input.enabled = true;
                }
            });
        }
    },
    closeSettingsPopup: function () {
        tableGroup.setAll('inputEnabled', true);
        buttonGroup.setAll('clicked', true);
        buttonGroup.setAll('inputEnabled', true);
        isModalShow = false;
        settingsBtn.isOpen = false;
        settingsPopup.destroy();
    },
    getStatisticData: function(element){
       var ststs, canselBtn;
       var self = this;   
       var statTitleText, coldNumText, hotNumText, colorText, evensOddsText,
       highLowText, dozenText, columnText,modalBg, cancelBtn, cancelBtnText;    
           if(!isModalShow){

               if (this._statData != undefined) {
                   if (_videoFlagShow) {
                       self.showVideo();
                   }
                self.statShow = true;
                ststs = this._statData;
                isModalShow = true;
                statPopup = this.add.group();

                modalBg = this.add.button(0, 0, "modalBg", this.closeStatPopup, this);
                modalBg.priorityID = 0;
                modalBg.useHandCursor = false;
                statPopup.add(modalBg);
                var statBox = this.add.sprite(575, 100, 'statBg');
                statBox.width = 600;
                statBox.height = 650;
                statBox.inputEnabled = true;
                statBox.priorityID = 1;
                statPopup.add(statBox);
                var statData = this.add.group();

                cancelBtn = this.add.button(1125, 110, 'closeBtn', this.closeStatPopup, this, 3, 2, 3);
                cancelBtn.useHandCursor = true;

                statPopup.addChild(cancelBtn);
                statPopup.addChild(statData);
              
                statTitleText = createTextLbl(self, {
                    text: $.client.getLocalizedString("Statistics", true).toUpperCase(),
                    x: 600,
                    y: 113,
                    font: "ProximaNova",
                    size: 26,
                    color: "#fff",
                    centered: false,
                    maxHeight: 50,
                    maxWidth: 140
                });
                statData.addChild(statTitleText);

                coldNumText = createTextLbl(self, {
                    text: $.client.getLocalizedString("COLD NUMBERS", true).toUpperCase(),
                    x: 630,
                    y: 185,
                    font: "ProximaNova",
                    size: 20,
                    color: "#878787",
                    centered: false,
                    maxHeight: 50,
                    maxWidth: 120
                });
                hotNumText = createTextLbl(self, {
                    text: $.client.getLocalizedString("HOT NUMBERS", true).toUpperCase(),
                    x: 630,
                    y: 265,
                    font: "ProximaNova",
                    size: 20,
                    color: "#878787",
                    centered: false,
                    maxHeight: 50,
                    maxWidth: 120
                });
                colorText = createTextLbl(self, {
                    text: $.client.getLocalizedString("COLORS", true).toUpperCase(),
                    x: 630,
                    y: 345,
                    font: "ProximaNova",
                    size: 20,
                    color: "#878787",
                    centered: false,
                    maxHeight: 50,
                    maxWidth: 120
                });
                evensOddsText = createTextLbl(self, {
                    text: $.client.getLocalizedString("EVEN/ODDS", true).toUpperCase(),
                    x: 630,
                    y: 425,
                    font: "ProximaNova",
                    size: 20,
                    color: "#878787",
                    centered: false,
                    maxHeight: 50,
                    maxWidth: 120
                });
                highLowText = createTextLbl(self, {
                    text: $.client.getLocalizedString("HIGH/LOW", true).toUpperCase(),
                    x: 630,
                    y: 505,
                    font: "ProximaNova",
                    size: 20,
                    color: "#878787",
                    centered: false,
                    maxHeight: 50,
                    maxWidth: 120
                });
                dozenText = createTextLbl(self, {
                    text: $.client.getLocalizedString("DOZENS", true).toUpperCase(),
                    x: 630,
                    y: 585,
                    font: "ProximaNova",
                    size: 20,
                    color: "#878787",
                    centered: false,
                    maxHeight: 50,
                    maxWidth: 120
                });
                columnText = createTextLbl(self, {
                    text: $.client.getLocalizedString("COLUMNS", true).toUpperCase(),
                    x: 630,
                    y: 660,
                    font: "ProximaNova",
                    size: 20,
                    color: "#878787",
                    centered: false,
                    maxHeight: 25,
                    maxWidth: 120
                });
                statData.addChild(coldNumText);
                statData.addChild(hotNumText);
                statData.addChild(colorText);
                statData.addChild(evensOddsText);
                statData.addChild(highLowText);
                statData.addChild(dozenText);
                statData.addChild(columnText);

                function showNumber (element,desc, posX, posY){                
                    var numBg, numText,numTextDesc, numTextVal, color;
                    numTextVal = element + '';
                    if (jQuery.inArray(parseInt(element, 10), blackNumberArr) != -1) {
                        color = "#ffffff";
                    } else if (jQuery.inArray(parseInt(element, 10), redNumberArr) != -1) {
                        color = "#ae3e3e";
                    } else {
                        color = "#459a59";
                    }
                    numBg = self.add.button(posX, posY, 'numberBg', function (element) {
                        for (var j in tableGroup.children) {
                            if (tableGroup.children[j].bet_name === element.bet_name) {
                                self.cellClick(tableGroup.children[j]);
                            }
                        }

                    }, this);
                    numBg.input.useHandCursor = MessageDispatcher.isTableOpen;
                    numBg.inputEnabled = true;
                    numBg.scale.set(1.1);
                    numBg.bet_name = numTextVal;
            
                    numText = self.add.text(numBg.x + 28, numBg.y + 15, numTextVal, { font: "21px ProximaNova", fill: color, align: "center" });
                    numText.anchor.x = Math.round(numText.width * 0.5) / numText.width;

                    numTextDesc = self.add.text(numBg.x + numBg.width - 20, numBg.y + 38,desc, { font: "13px ProximaNova", fill: "#b0b0b0", align: "right" });
               
                    statData.addChild(numBg);
                    statData.addChild(numText);
                    statData.addChild(numTextDesc);

                }         

                function showSectionNumber(posX, posY, label, value, spriteFrame,betNames){
                    var statChartFirst, statChartSecond, statChartThird,
                        statChartFirstText, statChartSecondText, statChartThirdText
                    ;

                    statChartFirst = self.add.button(posX, posY, 'statChartBg', function (element) {
                        for (var j in tableGroup.children) {
                            if (tableGroup.children[j].bet_name === element.bet_name) {
                                self.cellClick(tableGroup.children[j]);
                            }
                        }

                    }, this, spriteFrame[0], spriteFrame[0]);
                    statChartFirst.inputEnabled = true;
                    statChartFirst.bet_name = betNames[0];
                    statChartFirst.width = value[0] * 3.5;
                    statChartFirstText=createTextLbl(self, {
                        text: '',
                        x: statChartFirst.x + statChartFirst.width/2,
                        y: statChartFirst.y + 14,
                        font: "ProximaNova",
                        size: 20,
                        color: "#ffffff",
                        centered: true,
                        maxHeight: 20,
                        maxWidth: statChartFirst.width-(value[0] > 20?5:0)
                    });
                    if(value[0] > 20){                    
                        statChartFirstText.setTitle(label[0] + " - " + Math.round(value[0]) + "%");
                    }

                    statData.addChild(statChartFirst);
                    statData.addChild(statChartFirstText);

                    statChartSecond = self.add.button(statChartFirst.x + statChartFirst.width, posY, 'statChartBg', function (element) {
                        for (var j in tableGroup.children) {
                            if (tableGroup.children[j].bet_name === element.bet_name) {
                                self.cellClick(tableGroup.children[j]);
                            }
                        }

                    }, this, spriteFrame[1], spriteFrame[1]);
                    statChartSecond.inputEnabled = true;
                    statChartSecond.bet_name = betNames[1];
                    statChartSecond.width = value[1] * 3.5;
                    statChartSecondText = createTextLbl(self, {
                        text: '',
                        x: statChartSecond.x + statChartSecond.width / 2 ,
                        y: statChartSecond.y + 14,
                        font: "ProximaNova",
                        size: 20,
                        color: "#ffffff",
                        centered: true,
                        maxHeight: 20,
                        maxWidth: statChartSecond.width - (value[1] > 20 ? 5 : 0)
                    });

                    if (value[1] > 20) {
                        statChartSecondText.setTitle(label[1] + " - " + Math.round(value[1]) + "%");
                    }
                    statData.addChild(statChartSecond);
                    statData.addChild(statChartSecondText);

                    statChartThird = self.add.button(statChartSecond.x + statChartSecond.width, posY, 'statChartBg', function (element) {
                        for (var j in tableGroup.children) {
                            if (tableGroup.children[j].bet_name === element.bet_name) {
                                self.cellClick(tableGroup.children[j]);
                            }
                        }

                    }, this, spriteFrame[2], spriteFrame[2]);
                    statChartThird.inputEnabled = true;
                    statChartThird.bet_name = betNames[2];

                    statChartThird.width = value[2] * 3.5;
                    statChartThirdText = createTextLbl(self, {
                        text: '',
                        x: statChartThird.x + statChartThird.width / 2 ,
                        y: statChartThird.y + 14,
                        font: "ProximaNova",
                        size: 20,
                        color: "#ffffff",
                        centered: true,
                        maxHeight: 20,
                        maxWidth: statChartThird.width - (value[2] > 20 ? 5 : 0)
                    });
                    if (value[2] > 20) {
                        statChartThirdText.setTitle(label[2] + " - " + Math.round(value[2]) + "%");
                    }
                    statData.addChild(statChartThird);
                    statData.addChild(statChartThirdText);

                }

                for(var i = 0; i < ststs.coldNumbers.length-4; i++){
                    showNumber(ststs.coldNumbers[i].number, ststs.coldNumbers[i].lastHit,coldNumText.x + 155 + (i) * 58, coldNumText.y - 5);
                }

                for(var i = 0; i < ststs.hotNumbers.length-4; i++){
                    showNumber(ststs.hotNumbers[i].number, ststs.hotNumbers[i].count, hotNumText.x + 155 + (i) * 58, hotNumText.y - 5);
                }
                showSectionNumber(colorText.x+153, colorText.y-20,                 
                    [$.client.getLocalizedString("RED", true).toUpperCase(), $.client.getLocalizedString("GREEN", true).toUpperCase(), $.client.getLocalizedString("BLACK", true).toUpperCase()],
                    [ststs.colors.red, ststs.colors.zero, ststs.colors.black],
                    [0,1,3],
                    ["red","0","black"]
                );

                showSectionNumber(evensOddsText.x+155, evensOddsText.y-20,                 
                    [$.client.getLocalizedString("EVEN", true).toUpperCase(), $.client.getLocalizedString("ZERO", true).toUpperCase(), $.client.getLocalizedString("ODDS", true).toUpperCase()],
                    [ststs.evenOdds.even, ststs.evenOdds.zero, ststs.evenOdds.odds],
                    [2, 1, 2],
                    ["even", "0", "odd"]
                );

                showSectionNumber(highLowText.x+155, highLowText.y-20,                 
                    [$.client.getLocalizedString("HIGH", true).toUpperCase(), $.client.getLocalizedString("ZERO", true).toUpperCase(), $.client.getLocalizedString("LOW", true).toUpperCase()],
                    [ststs.highLow.high, ststs.highLow.zero, ststs.highLow.low],
                    [2, 2, 2],
                    ["second18", "0", "first18"]
                );

                showSectionNumber(dozenText.x+155, dozenText.y-20, 
                    ["1-12","13-24","25-36"],
                    [ststs.dozens.first, ststs.dozens.second, ststs.dozens.third],                
                    [2, 3, 2],
                    ["first12", "second12", "third12"]
                );
                showSectionNumber(columnText.x+155, columnText.y-20, 
                    ["1-34","2-35","3-36"],
                    [ststs.columns.first, ststs.columns.second, ststs.columns.third],
                    [2, 3, 2],
                    ["col1", "col2", "col3"]
                );   
        
                tableGroup.setAll('inputEnabled', false);
                buttonGroup.setAll('clicked', false);   

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
        isModalShow = false;
        this.statShow = false;
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
                if (self.statShow) {
                    self.closeStatPopup();
                    self.getStatisticData();
                }
            }
        }, function (err) {
            setTimeout(function() {
                self.updateStatistics();
            }, 1000);
            console.log(err);
        });
    },
    createTimer: function (totalTime, endCallback, updateCallback) {
        var timer;
        timerSprite.totalTime = totalTime;
        timerSprite.time = totalTime;
        timerSprite.endCallback = endCallback;
        timerSprite.updateCallback = updateCallback;
        timerSprite.bg = frameGroup.create(45, 770, 'timer', 0);
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
            timerSprite.endCallback = end;
            timerSprite.updateCallback = update;
            timerSprite.totalTime = time;
            timerSprite.time = time;
            clearInterval(timerSprite.timer);
            timerSprite.update(timerSprite.time);
            timerSprite.timer = setInterval(function () {
                timerSprite.time--;
                timerSprite.update(timerSprite.time);
            }, 1000);
        };
        timerSprite.start(timerSprite.time, timerSprite.endCallback, timerSprite.updateCallback);
        return timerSprite;
    },
    changeStatus: function (text, statusIndex, showModal, timeout) {
        var tDiff = new Date(new Date().getTime() - lastChangeStatus).getTime() / 1000;
        var self = this;
        if (timeout > 0) {
            if (self.previousState)
            self.stateTimeout=setTimeout(function () {
                self.changeStatus(self.previousState.text, self.previousState.statusIndex, self.previousState.showModal);
            }, timeout);
        } else {
            if (self.stateTimeout)
                clearTimeout(self.stateTimeout);
            self.previousState = { text: text, statusIndex: statusIndex, showModal: showModal };
        }
        lastChangeStatus = new Date().getTime();
        if (infoText != undefined) {
            if (tDiff < 1 && self.previousStatusIndex != statusIndex) {
                if (self.newStateTimeout)
                    clearTimeout(self.newStateTimeout);
                self.newStateTimeout = setTimeout(function () {
                    self.changeStatus(text, statusIndex);
                }, 1000);
            } else {
                self.previousStatusIndex = statusIndex;
                infoText.setTitle(text.toUpperCase());
                tableStatus.loadTexture('statusBg', statusIndex);
            }
        }
    },
    showWinner: function (winAmount) {
        headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
        var text = $.client.getLocalizedString("TEXT_DISPLAY_MSG_PLAYER_WIN", true) + $.client.UserData.CurrencySign + parseFloat(winAmount).toFixed(2);
        MessageDispatcher.betHistory[MessageDispatcher.betHistory.length - 1].winAmount = parseFloat(winAmount).toFixed(2);
        this.changeStatus(text, 1,false,2000);
        headerWinInputVal.setTitle($.client.UserData.CurrencySign + (winAmount > 99999 ? kFormater(winAmount) : parseFloat(winAmount).toFixed(2)));
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
    updateLastNumbers: function (handCursor) {
        var color, self=this;
            if (MessageDispatcher.winNumArr.length > 0) {
                winTextGroup.removeAll();
                var winArr = MessageDispatcher.winNumArr.slice(0).reverse();
                for (var i = 0; i < winArr.length; i++) {
                    if ($.inArray(parseInt(winArr[i], 10), blackNumberArr) != -1) {
                        color = "#ffffff";
                    } else if ($.inArray(parseInt(winArr[i], 10), redNumberArr) != -1) {
                        color = "#ae3e3e";
                    } else {
                        color = "#459a59";
                    }
                    winNum = this.add.button(177 + (48 * i), gameFrame.height - 145, 'numberBg', function (element) {
                        for (var j in tableGroup.children) {
                            if (tableGroup.children[j].bet_name === element.bet_name) {
                                self.cellClick(tableGroup.children[j]);
                            }
                        }

                    }, this);
                    winNum.input.useHandCursor = handCursor;
                    winNum.clicked = true;
                    winNum.bet_name=winArr[i].toString();
                    _winNumUpdate = winArr[i] + '';
                    winNumInfo[i] = this.add.text(winNum.x + 20, winNum.y + 7, _winNumUpdate, { font: "bold 26px ProximaNova", fill: color, align: "center" });
                    winNumInfo[i].anchor.x = Math.round(winNumInfo[i].width * 0.5) / winNumInfo[i].width;
                    winNum.scale.set(0.8);
                    winTextGroup.add(winNum);
                    winTextGroup.add(winNumInfo[i]);
                }
            }
    },
    showMessage: function (text) {
        var self = this;
        if (msgGroup) {
            setTimeout(function() {
                worldGroup.remove(msgGroup);
                msgGroup = null;
                clearTimeout(msgTimeout);
                self.showMessage(text);
            }, 2000);
        } else {
            msgGroup = this.add.group();
            msgGroup.clicked = false;
            worldGroup.add(msgGroup);
            worldGroup.bringToTop(cursorGroup);

            var msgBox = this.add.sprite(0, 0, 'msg_bg');
            msgBox.x = self.input.x;
            msgBox.y = self.input.y + 30;
            msgGroup.add(msgBox);
            var msgText = this.add.text(msgBox.x + 20, msgBox.y + 7, text, {
                font: '24px ProximaNova',
                fill: 'white',
                align: "center"
            });
            if (self.game.width < self.input.x + msgText.width + 40) {
                msgText.wordWrap = true;
                msgText.wordWrapWidth = self.input.x - self.game.width + msgText.width + 40;
                msgGroup.x = msgGroup.x - 100;
            }
            msgGroup.add(msgText);
            msgBox.height = msgText.height * 1.3;
            msgBox.width = msgText.width + 40;
            msgTimeout = setTimeout(function() {
                worldGroup.remove(msgGroup);
                msgGroup = null;
            }, 4000);
        }
    },
    playWinNumberSound: function (number) {
        $.client.playSound('../../sounds/numbers/' + number + '.mp3');
    },
    clearWinAmout: function() {
        headerWinInputVal.setTitle($.client.UserData.CurrencySign + 0);
    },
    showCashier: function(visible) {
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
    },
    showOverlay: function (visible) {
        if (visible) {
           game.add.tween(overlayGroup).to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true);
            overlayGroup.clicked = true;
            overlayGroup.inputEnabled = true;
            overlayVisible = true;
            for (var i = 0; i < tableChips.length; i++) {
                tableChips[i].chip.visible = true;
            }
            cursorVisible = true;
        } else {
            overlayGroup.clicked = false;
            overlayGroup.inputEnabled = false;
            game.add.tween(overlayGroup).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true);
            overlayVisible = false;
            for (var i = 0; i < tableChips.length; i++) {
                tableChips[i].chip.visible = false;
            }
            cursorGroup.alpha = 0;
        }
    },
    showDolly: function (number) {
        if(dolly)
            tableGroup.remove(dolly);
        for (var i = 0; i < tableGroup.children.length; i++) {
            if (tableGroup.children[i].bet_name == number) {
                if (number === 0) {
                    dolly = this.add.sprite(tableGroup.children[i].x + tableGroup.children[i].width / 2 - 15, tableGroup.children[i].y + 5, 'placeholder');
                } else {
                    dolly = this.add.sprite(tableGroup.children[i].x + 20, tableGroup.children[i].y + 5, 'placeholder');
                }
                dolly.alpha = 0.65;
                tableGroup.add(dolly);
            }
        }
    },
    hideDolly: function() {
        tableGroup.remove(dolly);
    }
};
