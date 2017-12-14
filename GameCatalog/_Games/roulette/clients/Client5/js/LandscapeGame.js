
var    
    TABLE_WIDTH = 225,
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
        voisinsNumberArr = [3,0,19,12,15, 4, 21, 2, 25,26, 22, 18, 29, 7, 28,35],
        orphelinsNumberArr = [17, 34, 6, 1, 20, 14, 31, 9],
        tiersNumberArr = [27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33];
wheelNumberMap = { 12: 2, 35: 12, 3: 22, 26: 32 };
var betType = {
        straight: 0,
        splitX: 1,
        splitY: 2,
        corner: 3,
        multiSelect: 4,
        arrSelect: 5
       };

var dib_cost = [1, 5, 10, 25, 50, 100],
    NUM_DIB = dib_cost.length - 1,
    selectedChipId=2,
    mChips = [],
    table, summaDeb = 0,
    tableStatus, infoText, timerText;

var Bets ={};
var timerSprite = {}, timerObj;
var betHistory = [];

var winNumInfo = {}, msgBoxPopup, msgBoxTween, limitPopup, limitSelectionPopup, limitPopupTween, statPopup, historyPopup, statPopupTween, selectedLimits = [], settingsPopup;
var cellName, betName, borderPosArr;

var tableChips = [];
var limits = [];
var currentLimits = {};
var previousBetChips = [];
var roundBetChips = [];
var lastRevive = 0;
var limitBtnText, confirmLimitBtn,cashierBtn;

var userNameText, USER_NAME, headerBetInputVal, headerBalansInputVal, headerWinInputVal;
var wheelStageBetInputVal, wheelStageBalansInputVal, wheelStageWinInputVal,winNumberBg,winNumberLbl,winNumberResultLbl;
var gameFrame, winNum, placeHold, timer, dolly, wheelBg, wheel, ball, wheelGroup,highlight
var _winNumUpdate, progressText, _videoFlagShow, isModalShow,isSubmiting;

var worldGroup = {}, tableGroup = {}, frenchGroup = {}, resultGroup = {}, chipsGroup = {}, buttonGroup = {}, selectedChipsGroup = {},
    frameGroup = {}, footerGroup = {}, winTextGroup = {}, winNumbersGroup = {}, limitGroup = {}, msgGroup, wheelChipsGroup, msgTimeout;
;
var tableCell = {},  Dozen ={}, Column = {}, Orphelins = {}, Neighbors = {}, RouletteLandscapeGame = {};
var WgTableCell = {}, WgDozen = {}, WgColumn = {}, WgOrphelins = {}, WgNeighbors = {};
var previousMsgType, winAmount = 0, lastChangeStatus, startGameBtn, cancelAllBetBtn, repeatBetBtn, provablyBtn, settingsBtn;

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
        this.load.image('gameFrame', 'images/game_frame.png');
        this.load.image('gameFrameSpin', 'images/game_frame_spin.png');
        this.load.image('zero_cell_select', 'images/zero_cell_select.png');
        this.load.image('highlight', 'images/highlight.png');
        this.load.image('ball', 'images/ball.png');
        this.load.image('wheel', 'images/wheel-1.png');
        this.load.image('wheel0', 'images/wheel-0.png');
        this.load.image('wheel2', 'images/wheel-2.png');
        this.load.image('stubChip', 'images/stub_chip.png');
        this.load.spritesheet('resultPanel', 'images/result_panel.png',216,265);
        this.load.spritesheet('mainBtnBg', 'images/game_btn_bg.png', 143, 190);
        this.load.spritesheet('numberBg', 'images/winnumber_bg.png', 69, 31);
        this.load.spritesheet('tableChips', 'images/table_chips.png', 97, 97);
        this.load.spritesheet('chips', 'images/chips.png', 184.5, 210);
        this.load.image('cell_select', '../Client3/images/cell_select.png');
        this.load.image('msg_bg', '../Client3/images/msg_bg.png');
        this.load.image('placeholder', 'images/dolly.png');

       
        this.game.load.onFileComplete.add(this.updateProgressBar, this);
    },

    create: function () { 
        var self = this;
        worldGroup = this.add.group();
        tableGroup = this.add.group();
        chipsGroup = this.add.group();
        buttonGroup = this.add.group();
        winTextGroup = this.add.group();
        winNumbersGroup = this.add.group();
        selectedChipsGroup = this.add.group();
        
        frameGroup = this.add.group();
        footerGroup = this.add.group();

        worldGroup.add(tableGroup);
        tableGroup.add(chipsGroup);        

        worldGroup.add(buttonGroup);        
        footerGroup.add(winTextGroup);
        footerGroup.add(winNumbersGroup);
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
        progressText = this.add.text(this.game.world.centerX, this.game.world.centerY - 30, pr, {
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
        var self = this;
        this.gestures.update();
        if (wheel) {
            wheel.wheelAngle = wheel.angle >= 0 ? wheel.angle : 360 + wheel.angle;
            wheel.ballAngle = ball.angle >= 0 ? ball.angle : 360 + ball.angle;
            wheel.diff = parseInt(wheel.wheelAngle - wheel.ballAngle);
            wheel.diff = wheel.diff > 0 ? wheel.diff : 360 + wheel.diff;
            if (wheel.number > -1 || wheel.waitNumber) {
                if ((wheel.numberDeg + 6 > wheel.diff && wheel.numberDeg <= wheel.diff)) {
                    var date = new Date();
                    var time = (date - wheel.startTime) / 1000;
                    if (time >= 4) {
                        wheel.number = -1;
                        wheel.pivotX = 250;
                        ball.pivot.x = wheel.pivotX;
                        ball.angle = wheel.angle - (wheel.numberDeg > 180 ? wheel.numberDeg - 360 : wheel.numberDeg) + 1;
                        setTimeout(function () {
                           // self.add.tween(ball).to({ angle:angle }, 500, Phaser.Easing.Linear.None, true, 1000);
                            ball.angle = wheel.angle - (wheel.numberDeg > 180 ? wheel.numberDeg - 360 : wheel.numberDeg) + 1;
                            setTimeout(function () {
                                highlight.angle = ball.angle - 3;
                                highlight.alpha = 1;
                            }, 500);
                        }, 50);
                    } else {
                        wheel.speed -= 0.006;
                    }
                }
                if (!wheel.waitNumber)
                    wheel.pivotX -= 0.75;
                wheel.rotation += wheel.speed;
                ball.rotation -= wheel.speed;
            } else {
                wheel.rotation += 0.03;
                ball.rotation += 0.03;
                highlight.rotation += 0.03;
            }
            if (wheel.pivotX >= 250)
                ball.pivot.x = wheel.pivotX;
            highlight.pivot.x = wheel.pivotX + 20;
        }
    },

    create: function() {
        TABLE_WIDTH = 1380,
            TABLE_HEIGHT = 543,
            DIB_WIDTH = 115,
            DIB_HEIGHT = 181,
            DIB_SPASE = 5,
            TABLE_ROWS = Math.floor(TABLE_WIDTH / DIB_WIDTH),
            TABLE_COLS = Math.floor(TABLE_HEIGHT / DIB_HEIGHT);

        var self = this;
        var bottomBetLabel,
            balansLabel,
            winLabel,
            limitBtn,
            statsBtn,
            historyBtn,
            chipsEl,
            table;

        var spriteXY, spriteX, spriteY;
        var gameIdLabel, dateTimeLabel;

        worldGroup = this.add.group();
        worldGroup.add(tableGroup);
        this.scale.setUserScale(SCALE, SCALE);
        this.scale.refresh();
        tableGroup = this.add.group();
        wheelTableGroup = this.add.group();
        chipsGroup = this.add.group();
        selectedChipsGroup = this.add.group();

        frameGroup = this.add.group();
        footerGroup = this.add.group();
        frenchGroup = this.add.group();
        limitGroup = this.add.group();
        resultGroup = this.add.group();

        worldGroup.add(frameGroup);
        worldGroup.add(tableGroup);
        worldGroup.add(frenchGroup);
        worldGroup.add(footerGroup);
        footerGroup.add(winTextGroup);

        worldGroup.add(buttonGroup);
        worldGroup.add(limitGroup);
        for (var a = 0; a <= NUM_DIB; a++) {
            dib_cost[a] = dib_cost[a] * $.client.UserData.CurrencyMultiplier;
        }

        gameFrame = frameGroup.create(0, 0, 'gameFrame');

        table = this.add.group();
        wheelChipsGroup = this.add.group();
        frameGroup.add(gameFrame);
        frameGroup.add(chipsGroup);
        frameGroup.add(tableGroup);
        frameGroup.add(selectedChipsGroup);
        wheelGroup = this.add.group();
        worldGroup.add(wheelTableGroup);
        worldGroup.add(wheelGroup);
        worldGroup.add(resultGroup);


        var name = USER_NAME ? USER_NAME.toUpperCase().length < 35 ? USER_NAME.toUpperCase() : USER_NAME.toUpperCase().substr(0, 35) + '...' : "";
        userNameText = this.add.text(30, 18, name, {
            font: "25px ProximaNova",
            fill: "#ddd"
        });
        footerGroup.add(userNameText);

        balansLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_BALANCE", true),
            x: 50,
            y: gameFrame.height - 60,
            font: "ProximaNova",
            size: 27,
            style: "bold",
            color: "#000",
            centered: false,
            maxHeight: 27,
            maxWidth: 150
        });
        footerGroup.add(balansLabel);

        headerBalansInputVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + USER_BALANCE,
            x: balansLabel.x + 405,
            y: balansLabel.y,
            font: "ProximaNova",
            size: 27,
            style: "bold",
            color: "#9f4141",
            align: "right",
            maxHeight: 20,
            maxWidth: 150
        });
        headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
        footerGroup.add(headerBalansInputVal);

        bottomBetLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_BET", true),
            x: 50,
            y: gameFrame.height - 110,
            font: "ProximaNova",
            size: 27,
            style: "bold",
            color: "#000",
            centered: false,
            maxHeight: 27,
            maxWidth: 150
        });
        footerGroup.add(bottomBetLabel);
        headerBetInputVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + '0',
            x: bottomBetLabel.x + 405,
            y: bottomBetLabel.y,
            font: "ProximaNova",
            size: 27,
            style: "bold",
            color: "#9f4141",
            align: "right",
            maxHeight: 20,
            maxWidth: 150
        });

        footerGroup.add(headerBetInputVal);

        winLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("Win", true),
            x: 50,
            y: gameFrame.height - 160,
            font: "ProximaNova",
            size: 27,
            style: "bold",
            color: "#000",
            centered: false,
            maxHeight: 27,
            maxWidth: 150
        });
        footerGroup.add(winLabel);
        headerWinInputVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + '0',
            x: winLabel.x + 405,
            y: winLabel.y,
            font: "ProximaNova",
            size: 27,
            style: "bold",
            color: "#9f4141",
            align: "right",
            maxHeight: 27,
            maxWidth: 150
        });
        footerGroup.add(headerWinInputVal);

        infoText = createTextLbl(self, {
            text: $.client.getLocalizedString("PLEASE WAIT FOR THE NEXT OPEN TABLE", true).toUpperCase(),
            x: 864,
            y: 18,
            font: "ProximaNova",
            size: 30,
            color: "#fff",
            centered: true,
            maxHeight: 30,
            maxWidth: 300
        });
        infoText.anchor.x = Math.round(infoText.width * 0.5) / infoText.width;
        frameGroup.add(infoText);
        gameIdLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("Game Id:", true) + " " + MessageDispatcher.gameId,
            x: 1540,
            y: 28,
            font: "ProximaNova",
            size: 27,
            color: "#ddd",
            centered: false,
            maxHeight: 27,
            maxWidth: 185
        });
        worldGroup.add(gameIdLabel);
        dateTimeLabel = createTextLbl(self, {
            text: $.DateFormat(MessageDispatcher.serverTime.toString(), "yyyy-MM-dd | HH:mm:ss"),
            x: 1540,
            y: 4,
            font: "ProximaNova",
            size: 25,
            color: "#ddd",
            centered: false,
            maxHeight: 25,
            maxWidth: 185
        });
        worldGroup.add(dateTimeLabel);

        if (self.timeInterval)
            clearInterval(self.timeInterval);

        self.timeInterval = setInterval(function() {
            gameIdLabel.setTitle($.client.getLocalizedString("Game Id:", true) + " " + MessageDispatcher.gameId);
            MessageDispatcher.serverTime.setSeconds(MessageDispatcher.serverTime.getSeconds() + 1);
            dateTimeLabel.setTitle($.DateFormat(MessageDispatcher.serverTime.toString(), "yyyy-MM-dd | HH:mm:ss"));
        }, 1000);

        startGameBtn = createTextButton(self, {
            text: $.client.getLocalizedString("TEXT_SPIN", true).toUpperCase(),
            x: 1250,
            y: 865,
            font: "ProximaNova",
            size: 42,
            maxHeight: 42,
            maxWidth: 120,
            color: "#767676",
            disabledColor: "#cecccc",
            style: "bold",
            centered: true,
            paddingTop: -2,
            sprite: "mainBtnBg",
            defaultIndex: 0,
            overIndex: 0,
            clickIndex: 1,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: -1,
            onClick: function() {
                self.startGame();
            }
        });
        buttonGroup.add(startGameBtn);
        startGameBtn.disable();

        repeatBetBtn = createTextButton(self, {
            text: $.client.getLocalizedString("Rebet", true).toUpperCase(),
            x: 1405,
            y: 865,
            font: "ProximaNova",
            size: 42,
            maxHeight: 42,
            maxWidth: 120,
            color: "#767676",
            disabledColor: "#cecccc",
            style: "bold",
            centered: true,
            paddingTop: -2,
            sprite: "mainBtnBg",
            defaultIndex: 0,
            overIndex: 0,
            clickIndex: 1,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: -1,
            onClick: function() {
                self.repeatBets();
            }
        });
        buttonGroup.add(repeatBetBtn);
        repeatBetBtn.disable();


        cancelAllBetBtn = createTextButton(self, {
            text: $.client.getLocalizedString("Clear", true).toUpperCase(),
            x: 1560,
            y: 865,
            font: "ProximaNova",
            size: 42,
            maxHeight: 42,
            maxWidth: 120,
            color: "#767676",
            disabledColor: "#cecccc",
            style: "bold",
            centered: true,
            paddingTop: -2,
            sprite: "mainBtnBg",
            defaultIndex: 0,
            overIndex: 0,
            clickIndex: 1,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: -1,
            onClick: function() {
                self.cancelAllBet();
            }
        });
        buttonGroup.add(cancelAllBetBtn);

        cancelAllBetBtn.disable();


        /*   limitBtn = this.add.button(410, 977, 'bottomBtnBg', this.showLimits, this, 1, 1);
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
            maxHeight: 40,
            maxWidth: 150
        });
        buttonGroup.add(limitBtn);*/

        provablyBtn = this.add.group();
        /*  var provablyBtnBg = this.add.button(1160, 40, 'mainBtnBg', function () {
            $.client.showProvablyFair();
        }, this);
        provablyBtnBg.scale.set(1.07);
        provablyBtnBg.clicked = false;
        provablyBtnBg.input.useHandCursor = true;
        var provablyBtnTxt = createTextLbl(self, {
            text: $.client.getLocalizedString("Provably fair", true),
            x: provablyBtnBg.x + 80,
            y: provablyBtnBg.y + 14,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight: 55,
            maxWidth: provablyBtnBg.width-10
        });
        provablyBtn.btn = provablyBtnBg;
        provablyBtn.add(provablyBtnBg);
        provablyBtn.add(provablyBtnTxt);
        provablyBtn.alpha = 0;*/
        /*  if (isMobile.pad())
            this.add.button(1560, 15, 'homeIco', function () {
                $.client.toHome();
            }, this);
    */
        for (var a = 0; a <= NUM_DIB - 1; a++) {
            chipsEl = chipsGroup.create(gameFrame.width - 1127 + (a * 94), 880, 'chips', a);
            chipsEl.chipText = this.add.text(chipsEl.x + 95, chipsEl.y + 100,  dib_cost[a] > 999 ? kFormater(dib_cost[a]) : dib_cost[a], {
                font: "bold 80px ProximaNova",
                fill: "#404040"
            });
            chipsEl.debValue = dib_cost[a];
            chipsEl.id = a;
            chipsEl.inputEnabled = true;
            chipsEl.input.useHandCursor = true;
            chipsEl.rY = chipsEl.y;
            chipsEl.rX = chipsEl.x;
            chipsEl.events.onInputDown.add(this.changeChips, this);
            mChips.push(chipsEl);

            chipsEl.chipText.anchor.x = Math.round(chipsEl.chipText.width * 0.5) / chipsEl.chipText.width;
            chipsGroup.add(chipsEl.chipText);
        }
        self.changeChips({ id: selectedChipId });
        this.gestures = new GESTURE(this.game);
       var scroll = this.add.sprite(520, 860, 'cell_select');
        scroll.width = 690;
        scroll.height = 200;
        worldGroup.add(scroll);
        scroll.inputEnabled = false;
        scroll.alpha = 0;
        var  moveTimeout;
        this.gestures.addOnSwipe(function (context, data) {
            var tween;
            if (!moveTimeout)
            if (data.direction == "rigth" && data.distance > 0) {
                moveTimeout = true;
                self.changeChips(mChips[1]);
                setTimeout(function () {
                    moveTimeout = false;
                }, 400);
       
            } else if (data.direction == "left" && data.distance > 0) {
                moveTimeout = true;
                self.changeChips(mChips[mChips.length - 2]);
                setTimeout(function () {
                    moveTimeout = false;
                }, 400);
            }
        }, scroll);

        for (var i = 0; i < TABLE_COLS; i++) {
            for (var j = 0; j < TABLE_ROWS; j++) {

                cellName = 'cell_' + i.toString() + '_' + j.toString();
                tableCell[cellName] = tableGroup.create(table.x + 167 + j * (DIB_WIDTH + DIB_SPASE), table.y + 436 - i * (DIB_HEIGHT + DIB_SPASE - 2), 'cell_select');
                tableCell[cellName].name = cellName.toString();;

                tableCell[cellName].bet_name = arrayNambers[i][j].toString();;
                tableCell[cellName].bet_type = 'straight';

                tableCell[cellName].inputEnabled = true;
                tableCell[cellName].type = betType.straight;
                tableCell[cellName].alpha = 0;
                tableCell[cellName].width = DIB_WIDTH;
                tableCell[cellName].height = DIB_HEIGHT;
                tableCell[cellName].events.onInputOver.add(this.cellOver, this);
                tableCell[cellName].events.onInputOut.add(this.cellOut, this);
                tableCell[cellName].events.onInputUp.add(this.cellClick, this);

                spriteX = tableGroup.create(table.x + 167 + j * (DIB_WIDTH + DIB_SPASE), table.y + 600 - i * (DIB_HEIGHT + DIB_SPASE - 3), 'cell_select');
                spriteX.name = 'lineY_' + i.toString() + '_' + j.toString();
                spriteX.bet_name = 'lineY_' + i.toString() + '_' + j.toString();;
                spriteX.alpha = 0;
                spriteX.inputEnabled = true;
                spriteX.height = 30;
                spriteX.width = DIB_WIDTH;
                spriteX.type = betType.splitY;
                spriteX.events.onInputUp.add(this.cellClick, this);
                spriteX.events.onInputOver.add(this.cellOver, this);
                spriteX.events.onInputOut.add(this.cellOut, this);

                spriteY = tableGroup.create(table.x + 150 + j * (DIB_WIDTH + DIB_SPASE), table.y + 436 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
                spriteY.name = 'lineX_' + i.toString() + '_' + j.toString();
                spriteY.bet_name = 'lineX_' + i.toString() + '_' + j.toString();;
                spriteY.alpha = 0;
                spriteY.height = DIB_HEIGHT;
                spriteY.width = 30;
                spriteY.type = betType.splitX;
                spriteY.inputEnabled = true;
                spriteY.events.onInputUp.add(this.cellClick, this);
                spriteY.events.onInputOver.add(this.cellOver, this);
                spriteY.events.onInputOut.add(this.cellOut, this);

                spriteXY = tableGroup.create(table.x + 150 + j * (DIB_WIDTH + DIB_SPASE), table.y + 600 - i * (DIB_HEIGHT + DIB_SPASE - 3), 'cell_select');
                spriteXY.name = 'crossXY_' + i.toString() + '_' + j.toString();
                spriteXY.bet_name = 'crossXY_' + i.toString() + '_' + j.toString();;
                spriteXY.inputEnabled = true;
                spriteXY.width = 30;
                spriteXY.height = 30;
                spriteXY.type = betType.corner;
                if (j == 0) {
                    spriteXY.type = betType.street;
                }
                if (i == 0 && j == 0) {
                    spriteXY.type = betType.corner;
                }
                spriteXY.alpha = 0;
                spriteXY.events.onInputUp.add(this.cellClick, this);
                spriteXY.events.onInputOver.add(this.cellOver, this);
                spriteXY.events.onInputOut.add(this.cellOut, this);
            }
        }
        tableCell['zero'] = tableGroup.create(table.x + 20, table.y + 60, 'zero_cell_select');
        tableCell['zero'].name = '0';

        tableCell['zero'].bet_name = '0';
        tableCell['zero'].bet_type = 'straight';

        tableCell['zero'].type = betType.straight;
        tableCell['zero'].alpha = 0;
        tableCell['zero'].width = 145;
        tableCell['zero'].height = 555;

        tableCell['zero'].inputEnabled = true;
        tableCell['zero'].events.onInputUp.add(this.cellClick, this);
        tableCell['zero'].events.onInputOver.add(this.cellOver, this);
        tableCell['zero'].events.onInputOut.add(this.cellOut, this);

        Dozen['one'] = tableGroup.create(table.x + 160, table.y + 613, 'cell_select');
        Dozen['one'].name = 'dozenOne';
        Dozen['one'].bet_name = 'first12';
        Dozen['one'].bet_type = 'dozen';
        Dozen['one'].items = [0];
        Dozen['one'].first = 0;
        Dozen['one'].last = 4;
        Dozen['one'].alpha = 0;
        Dozen['one'].width = 485;
        Dozen['one'].height = 80;
        Dozen['one'].type = betType.multiSelect;
        Dozen['one'].inputEnabled = true;
        Dozen['one'].events.onInputUp.add(this.cellClick, this);
        Dozen['one'].events.onInputOver.add(this.cellOver, this);
        Dozen['one'].events.onInputOut.add(this.cellOut, this);

        Dozen['two'] = tableGroup.create(table.x + 645, table.y + 613, 'cell_select');
        Dozen['two'].name = 'dozenTwo';
        Dozen['two'].bet_name = 'second12';
        Dozen['two'].bet_type = 'dozen';
        Dozen['two'].items = [1];
        Dozen['two'].type = betType.multiSelect;
        Dozen['two'].alpha = 0;
        Dozen['two'].width = 485;
        Dozen['two'].height = 80;
        Dozen['two'].first = 4;
        Dozen['two'].last = 8;
        Dozen['two'].inputEnabled = true;
        Dozen['two'].events.onInputUp.add(this.cellClick, this);
        Dozen['two'].events.onInputOver.add(this.cellOver, this);
        Dozen['two'].events.onInputOut.add(this.cellOut, this);

        Dozen['three'] = tableGroup.create(table.x + 1125, table.y + 613, 'cell_select');
        Dozen['three'].name = 'dozenThree';
        Dozen['three'].bet_name = 'third12';
        Dozen['three'].bet_type = 'dozen';
        Dozen['three'].items = [2];
        Dozen['three'].type = betType.multiSelect;
        Dozen['three'].alpha = 0;
        Dozen['three'].width = 485;
        Dozen['three'].height = 80;
        Dozen['three'].first = 8;
        Dozen['three'].last = 12;
        Dozen['three'].inputEnabled = true;
        Dozen['three'].events.onInputUp.add(this.cellClick, this);
        Dozen['three'].events.onInputOver.add(this.cellOver, this);
        Dozen['three'].events.onInputOut.add(this.cellOut, this);

        Column['one'] = tableGroup.create(table.x + 1605, table.y + 430, 'cell_select');
        Column['one'].name = 'columnOne';
        Column['one'].bet_name = 'col1';
        Column['one'].bet_type = 'column';
        Column['one'].items = [0];
        Column['one'].type = betType.multiSelect;
        Column['one'].alpha = 0;
        Column['one'].width = 100;
        Column['one'].height = 190;
        Column['one'].first = 0;
        Column['one'].last = 12;
        Column['one'].colFirst = 0;
        Column['one'].colLast = 1;
        Column['one'].inputEnabled = true;
        Column['one'].events.onInputUp.add(this.cellClick, this);
        Column['one'].events.onInputOver.add(this.cellOver, this);
        Column['one'].events.onInputOut.add(this.cellOut, this);

        Column['two'] = tableGroup.create(table.x + 1605, table.y + 248, 'cell_select');
        Column['two'].name = 'columnTwo';
        Column['two'].bet_name = 'col2';
        Column['two'].bet_type = 'column';
        Column['two'].items = [1];
        Column['two'].type = betType.multiSelect;
        Column['two'].alpha = 0;
        Column['two'].width = 100;
        Column['two'].height = 185;
        Column['two'].first = 0;
        Column['two'].last = 12;
        Column['two'].colFirst = 1;
        Column['two'].colLast = 2;
        Column['two'].inputEnabled = true;
        Column['two'].events.onInputUp.add(this.cellClick, this);
        Column['two'].events.onInputOver.add(this.cellOver, this);
        Column['two'].events.onInputOut.add(this.cellOut, this);

        Column['three'] = tableGroup.create(table.x + 1605, table.y + 63, 'cell_select');
        Column['three'].name = 'columnThree';
        Column['three'].bet_name = 'col3';
        Column['three'].bet_type = 'column';
        Column['three'].type = betType.multiSelect;
        Column['three'].items = [2];
        Column['three'].alpha = 0;
        Column['three'].width = 100;
        Column['three'].height = 185;
        Column['three'].first = 0;
        Column['three'].last = 12;
        Column['three'].colFirst = 2;
        Column['three'].colLast = 3;
        Column['three'].inputEnabled = true;
        Column['three'].events.onInputUp.add(this.cellClick, this);
        Column['three'].events.onInputOver.add(this.cellOver, this);
        Column['three'].events.onInputOut.add(this.cellOut, this);


        Orphelins['low'] = tableGroup.create(table.x + 160, table.y + 698, 'cell_select');
        Orphelins['low'].name = 'low';
        Orphelins['low'].bet_name = 'first18';
        Orphelins['low'].bet_type = 'high_low';
        Orphelins['low'].items = ['low'];
        Orphelins['low'].type = betType.multiSelect;
        Orphelins['low'].width = 285;
        Orphelins['low'].height = 110;
        Orphelins['low'].first = 0;
        Orphelins['low'].last = 6;
        Orphelins['low'].alpha = 0;
        Orphelins['low'].inputEnabled = true;
        Orphelins['low'].events.onInputUp.add(this.cellClick, this);
        Orphelins['low'].events.onInputOver.add(this.cellOver, this);
        Orphelins['low'].events.onInputOut.add(this.cellOut, this);

        Orphelins['high'] = tableGroup.create(table.x + 1363, table.y + 698, 'cell_select');
        Orphelins['high'].name = 'high';
        Orphelins['high'].bet_name = 'second18';
        Orphelins['high'].bet_type = 'high_low';
        Orphelins['high'].items = ['high'];
        Orphelins['high'].type = betType.multiSelect;
        Orphelins['high'].width = 245;
        Orphelins['high'].height = 110;
        Orphelins['high'].first = 6;
        Orphelins['high'].last = 12;
        Orphelins['high'].alpha = 0;
        Orphelins['high'].inputEnabled = true;
        Orphelins['high'].events.onInputUp.add(this.cellClick, this);
        Orphelins['high'].events.onInputOver.add(this.cellOver, this);
        Orphelins['high'].events.onInputOut.add(this.cellOut, this);

        Orphelins['even'] = tableGroup.create(table.x + 440, table.y + 698, 'cell_select');
        Orphelins['even'].name = 'even';
        Orphelins['even'].bet_name = 'even';
        Orphelins['even'].bet_type = 'evens_odds';
        Orphelins['even'].items = ['evens'];
        Orphelins['even'].type = betType.arrSelect;
        Orphelins['even'].alpha = 0;
        Orphelins['even'].width = 210;
        Orphelins['even'].height = 110;
        Orphelins['even'].numbers = evenNumberArr;
        Orphelins['even'].inputEnabled = true;
        Orphelins['even'].events.onInputUp.add(this.cellClick, this);
        Orphelins['even'].events.onInputOver.add(this.cellOver, this);
        Orphelins['even'].events.onInputOut.add(this.cellOut, this);

        Orphelins['odd'] = tableGroup.create(table.x + 1125, table.y + 698, 'cell_select');
        Orphelins['odd'].name = 'odd';
        Orphelins['odd'].bet_name = 'odd';
        Orphelins['odd'].bet_type = 'evens_odds';
        Orphelins['odd'].items = ['odds'];
        Orphelins['odd'].type = betType.arrSelect;
        Orphelins['odd'].width = 235;
        Orphelins['odd'].height = 110;
        Orphelins['odd'].alpha = 0;
        Orphelins['odd'].numbers = oddNumberArr;
        Orphelins['odd'].inputEnabled = true;
        Orphelins['odd'].events.onInputUp.add(this.cellClick, this);
        Orphelins['odd'].events.onInputOver.add(this.cellOver, this);
        Orphelins['odd'].events.onInputOut.add(this.cellOut, this);

        Orphelins['black'] = tableGroup.create(table.x + 887, table.y + 698, 'cell_select');
        Orphelins['black'].name = 'black';
        Orphelins['black'].bet_name = 'black';
        Orphelins['black'].bet_type = 'color';
        Orphelins['black'].items = ['black'];
        Orphelins['black'].type = betType.arrSelect;
        Orphelins['black'].alpha = 0;
        Orphelins['black'].width = 235;
        Orphelins['black'].height = 110;
        Orphelins['black'].numbers = blackNumberArr;
        Orphelins['black'].inputEnabled = true;
        Orphelins['black'].events.onInputUp.add(this.cellClick, this);
        Orphelins['black'].events.onInputOver.add(this.cellOver, this);
        Orphelins['black'].events.onInputOut.add(this.cellOut, this);

        Orphelins['red'] = tableGroup.create(table.x + 648, table.y + 698, 'cell_select');
        Orphelins['red'].name = 'red';
        Orphelins['red'].bet_name = 'red';
        Orphelins['red'].bet_type = 'color';
        Orphelins['red'].items = ['red'];
        Orphelins['red'].type = betType.arrSelect;
        Orphelins['red'].alpha = 0;
        Orphelins['red'].width = 235;
        Orphelins['red'].height = 110;
        Orphelins['red'].numbers = redNumberArr;
        Orphelins['red'].inputEnabled = true;
        Orphelins['red'].events.onInputUp.add(this.cellClick, this);
        Orphelins['red'].events.onInputOver.add(this.cellOver, this);
        Orphelins['red'].events.onInputOut.add(this.cellOut, this);
        gameFrame.events.onInputOver.add(function() {
            for (var i = 0; i < TABLE_COLS; i++) {
                for (var j = 0; j < TABLE_ROWS; j++) {
                    cellName = 'cell_' + i.toString() + '_' + j.toString();
                    tableCell[cellName].alpha = 0;
                }
            }
        }, this);

        window.addEventListener('resize', function() {
            self.changeGameSize();
        });
        setInterval(function() {
            self.changeGameSize();
        }, 1000);
        self.changeGameSize();
        self.ready = true;
        setTimeout(function() {
            self.getLimits();
            self.updateStatistics();
        }, 300);

        self.wheel = self.createWheelStage();
        // gameInstance.wheel = self.wheel;
        wheelGroup.alpha = 0;
    },
    createWheelStage: function() {
        var self = this;
        wheelBg = this.add.sprite(0, 0, 'gameFrameSpin');
        wheelGroup.add(wheelBg);
        wheelGroup.add(wheelChipsGroup);
        wheelGroup.add(winNumbersGroup);
        var obj = {};
        var wheelNumberMap = [9, 31, 14, 20, 1, 33, 16, 24, 5, 10, 23, 8, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32, 0, 26, 3, 35, 12, 28, 7, 29, 18, 22];
        wheel0 = this.add.sprite(315, 90, 'wheel0');
        wheel2 = this.add.sprite(315, 90, 'wheel2');
        wheelGroup.add(wheel0);
        wheel = this.add.sprite(770, 544, 'wheel');
        wheelGroup.add(wheel);
        wheelGroup.add(wheel2);
        wheel.anchor.setTo(0.5, 0.5);

        var historyLbl = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_HISTORY", true),
            x: 140,
            y: 335,
            font: "ProximaNova",
            size: 40,
            style: "bold",
            color: "#CCC",
            centered: true,
            maxHeight: 27,
            maxWidth: 150
        });
        wheelGroup.add(historyLbl);

        var wheelStagebalansLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_BALANCE", true),
            x: 1275,
            y: gameFrame.height - 60,
            font: "ProximaNova",
            size: 27,
            style: "bold",
            color: "#000",
            centered: false,
            maxHeight: 27,
            maxWidth: 150
        });
        wheelGroup.add(wheelStagebalansLabel);

        wheelStageBalansInputVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + USER_BALANCE,
            x: wheelStagebalansLabel.x + 405,
            y: wheelStagebalansLabel.y,
            font: "ProximaNova",
            size: 27,
            style: "bold",
            color: "#9f4141",
            align: "right",
            maxHeight: 20,
            maxWidth: 150
        });
        wheelStageBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
        headerBalansInputVal.onChange = function(text) {
            wheelStageBalansInputVal.setTitle(text);
        }
        wheelGroup.add(wheelStageBalansInputVal);

        var wheelStageBetLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_BET", true),
            x: 1275,
            y: gameFrame.height - 110,
            font: "ProximaNova",
            size: 27,
            style: "bold",
            color: "#000",
            centered: false,
            maxHeight: 27,
            maxWidth: 150
        });
        wheelGroup.add(wheelStageBetLabel);
        wheelStageBetInputVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + '0',
            x: wheelStageBetLabel.x + 405,
            y: wheelStageBetLabel.y,
            font: "ProximaNova",
            size: 27,
            style: "bold",
            color: "#9f4141",
            align: "right",
            maxHeight: 20,
            maxWidth: 150
        });

        wheelGroup.add(wheelStageBetInputVal);
        headerBetInputVal.onChange = function(text) {
            wheelStageBetInputVal.setTitle(text);
        }

        var wheelStageWinLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("Win", true),
            x: 1275,
            y: gameFrame.height - 160,
            font: "ProximaNova",
            size: 27,
            style: "bold",
            color: "#000",
            centered: false,
            maxHeight: 27,
            maxWidth: 150
        });
        wheelGroup.add(wheelStageWinLabel);
        wheelStageWinInputVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + '0',
            x: wheelStageWinLabel.x + 405,
            y: wheelStageWinLabel.y,
            font: "ProximaNova",
            size: 27,
            style: "bold",
            color: "#9f4141",
            align: "right",
            maxHeight: 27,
            maxWidth: 150
        });
        headerWinInputVal.onChange = function(text) {
            wheelStageWinInputVal.setTitle(text);
        }
        wheelGroup.add(wheelStageWinInputVal);

        winNumberBg = this.add.sprite(30, 20, 'resultPanel', 0);
        resultGroup.add(winNumberBg);
        winNumberLbl = createTextLbl(self, {
            text: "36",
            x: 140,
            y: 70,
            font: "ProximaNova",
            size: 100,
            style: "bold",
            color: "#fff",
            centered: true,
            maxHeight: 100,
            maxWidth: 2000
        });
        winNumberResultLbl = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_NO_WIN", true).toUpperCase(),
            x: 140,
            y: 190,
            font: "ProximaNova",
            size: 42,
            style: "bold",
            color: "#fff",
            centered: true,
            maxHeight: 42,
            maxWidth: 150
        });
        winNumberLbl.setShadow(5, 5, 'rgba(0,0,0,0.5)', 0);
        winNumberResultLbl.setShadow(5, 5, 'rgba(0,0,0,0.5)', 0);
        resultGroup.add(winNumberLbl);
        resultGroup.add(winNumberResultLbl);
        resultGroup.alpha = 0;

        var W_DIB_WIDTH = 94,
            W_DIB_HEIGHT = 52,
            W_DIB_SPASE = 2;
        for (var i = 0; i < TABLE_COLS; i++) {
            for (var j = 0; j < TABLE_ROWS; j++) {

                cellName = 'cell_' + i.toString() + '_' + j.toString();
                WgTableCell[cellName] = wheelTableGroup.create(1375 + i * (W_DIB_WIDTH + W_DIB_SPASE), 115 + j * (W_DIB_HEIGHT + W_DIB_SPASE), 'cell_select');
                WgTableCell[cellName].name = cellName.toString();
                WgTableCell[cellName].bet_name = arrayNambers[i][j].toString();
                WgTableCell[cellName].bet_type = 'straight';
                WgTableCell[cellName].type = betType.straight;
                WgTableCell[cellName].alpha = 0;
                WgTableCell[cellName].width = W_DIB_WIDTH;
                WgTableCell[cellName].height = W_DIB_HEIGHT;

                spriteX = wheelTableGroup.create(1365 + i * (W_DIB_WIDTH + W_DIB_SPASE), 122 + j * (W_DIB_HEIGHT + W_DIB_SPASE), 'cell_select');
                spriteX.name = 'lineY_' + i.toString() + '_' + j.toString();
                spriteX.bet_name = 'lineY_' + i.toString() + '_' + j.toString();;
                spriteX.alpha = 0;
                spriteX.width = 20;
                spriteX.height = W_DIB_HEIGHT;
                spriteX.type = betType.splitY;

                spriteY = wheelTableGroup.create(1375 + i * (W_DIB_WIDTH + W_DIB_SPASE), 105 + j * (W_DIB_HEIGHT + W_DIB_SPASE), 'cell_select');
                spriteY.name = 'lineX_' + i.toString() + '_' + j.toString();
                spriteY.bet_name = 'lineX_' + i.toString() + '_' + j.toString();;
                spriteY.alpha = 0;
                spriteY.height = 20;
                spriteY.width = W_DIB_WIDTH;
                spriteY.type = betType.splitX;

                spriteXY = wheelTableGroup.create(1365 + i * (W_DIB_WIDTH + W_DIB_SPASE), 105 + j * (W_DIB_HEIGHT + W_DIB_SPASE), 'cell_select');
                spriteXY.name = 'crossXY_' + i.toString() + '_' + j.toString();
                spriteXY.bet_name = 'crossXY_' + i.toString() + '_' + j.toString();;
                spriteXY.width = 20;
                spriteXY.height = 20;
                spriteXY.type = betType.corner;
                spriteXY.alpha = 0;
                if (j == 0) {
                    spriteXY.type = betType.street;
                }
                if (i == 0 && j == 0) {
                    spriteXY.type = betType.corner;
                }
            }
        }
        WgTableCell['zero'] = wheelTableGroup.create(1665, 50, 'zero_cell_select');
        WgTableCell['zero'].name = '0';

        WgTableCell['zero'].bet_name = '0';
        WgTableCell['zero'].bet_type = 'straight';

        WgTableCell['zero'].type = betType.straight;
        WgTableCell['zero'].alpha = 0;
        WgTableCell['zero'].angle = 90;
        WgTableCell['zero'].width = 65;
        WgTableCell['zero'].height = 290;

        WgDozen['one'] = wheelTableGroup.create(1330, 115, 'cell_select');
        WgDozen['one'].name = 'dozenOne';
        WgDozen['one'].bet_name = 'first12';
        WgDozen['one'].bet_type = 'dozen';
        WgDozen['one'].items = [0];
        WgDozen['one'].first = 0;
        WgDozen['one'].last = 4;
        WgDozen['one'].alpha = 0;
        WgDozen['one'].width = 45;
        WgDozen['one'].height = 220;
        WgDozen['one'].type = betType.multiSelect;

        WgDozen['two'] = wheelTableGroup.create(1330, 330, 'cell_select');
        WgDozen['two'].name = 'dozenTwo';
        WgDozen['two'].bet_name = 'second12';
        WgDozen['two'].bet_type = 'dozen';
        WgDozen['two'].items = [1];
        WgDozen['two'].type = betType.multiSelect;
        WgDozen['two'].alpha = 0;
        WgDozen['two'].width = 45;
        WgDozen['two'].height = 220;
        WgDozen['two'].first = 4;
        WgDozen['two'].last = 8;

        WgDozen['three'] = wheelTableGroup.create(1330, 550, 'cell_select');
        WgDozen['three'].name = 'dozenThree';
        WgDozen['three'].bet_name = 'third12';
        WgDozen['three'].bet_type = 'dozen';
        WgDozen['three'].items = [2];
        WgDozen['three'].type = betType.multiSelect;
        WgDozen['three'].alpha = 0;
        WgDozen['three'].width = 45;
        WgDozen['three'].height = 220;
        WgDozen['three'].first = 8;
        WgDozen['three'].last = 12;

        WgColumn['one'] = wheelTableGroup.create(1375, 765, 'cell_select');
        WgColumn['one'].name = 'columnOne';
        WgColumn['one'].bet_name = 'col1';
        WgColumn['one'].bet_type = 'column';
        WgColumn['one'].items = [0];
        WgColumn['one'].type = betType.multiSelect;
        WgColumn['one'].alpha = 0;
        WgColumn['one'].width = 95;
        WgColumn['one'].height = 50;
        WgColumn['one'].first = 0;
        WgColumn['one'].last = 12;
        WgColumn['one'].colFirst = 0;
        WgColumn['one'].colLast = 1;

        WgColumn['two'] = wheelTableGroup.create(1470, 765, 'cell_select');
        WgColumn['two'].name = 'columnTwo';
        WgColumn['two'].bet_name = 'col2';
        WgColumn['two'].bet_type = 'column';
        WgColumn['two'].items = [1];
        WgColumn['two'].type = betType.multiSelect;
        WgColumn['two'].alpha = 0;
        WgColumn['two'].width = 95;
        WgColumn['two'].height = 50;
        WgColumn['two'].first = 0;
        WgColumn['two'].last = 12;
        WgColumn['two'].colFirst = 1;
        WgColumn['two'].colLast = 2;

        WgColumn['three'] = wheelTableGroup.create(1565, 765, 'cell_select');
        WgColumn['three'].name = 'columnThree';
        WgColumn['three'].bet_name = 'col3';
        WgColumn['three'].bet_type = 'column';
        WgColumn['three'].type = betType.multiSelect;
        WgColumn['three'].items = [2];
        WgColumn['three'].alpha = 0;
        WgColumn['three'].width = 95;
        WgColumn['three'].height = 50;
        WgColumn['three'].first = 0;
        WgColumn['three'].last = 12;
        WgColumn['three'].colFirst = 2;
        WgColumn['three'].colLast = 3;

        WgOrphelins['low'] = wheelTableGroup.create(1280, 120, 'cell_select');
        WgOrphelins['low'].name = 'low';
        WgOrphelins['low'].bet_name = 'first18';
        WgOrphelins['low'].bet_type = 'high_low';
        WgOrphelins['low'].items = ['low'];
        WgOrphelins['low'].type = betType.multiSelect;
        WgOrphelins['low'].width = 50;
        WgOrphelins['low'].height = 120;
        WgOrphelins['low'].first = 0;
        WgOrphelins['low'].last = 6;
        WgOrphelins['low'].alpha = 0;

        WgOrphelins['high'] = wheelTableGroup.create(1280, 660, 'cell_select');
        WgOrphelins['high'].name = 'high';
        WgOrphelins['high'].bet_name = 'second18';
        WgOrphelins['high'].bet_type = 'high_low';
        WgOrphelins['high'].items = ['high'];
        WgOrphelins['high'].type = betType.multiSelect;
        WgOrphelins['high'].width = 50;
        WgOrphelins['high'].height = 105;
        WgOrphelins['high'].first = 6;
        WgOrphelins['high'].last = 12;
        WgOrphelins['high'].alpha = 0;

        WgOrphelins['even'] = wheelTableGroup.create(1280, 240, 'cell_select');
        WgOrphelins['even'].name = 'even';
        WgOrphelins['even'].bet_name = 'even';
        WgOrphelins['even'].bet_type = 'evens_odds';
        WgOrphelins['even'].items = ['evens'];
        WgOrphelins['even'].type = betType.arrSelect;
        WgOrphelins['even'].alpha = 0;
        WgOrphelins['even'].width = 50;
        WgOrphelins['even'].height = 95;
        WgOrphelins['even'].numbers = evenNumberArr;

        WgOrphelins['odd'] = wheelTableGroup.create(1280, 550, 'cell_select');
        WgOrphelins['odd'].name = 'odd';
        WgOrphelins['odd'].bet_name = 'odd';
        WgOrphelins['odd'].bet_type = 'evens_odds';
        WgOrphelins['odd'].items = ['odds'];
        WgOrphelins['odd'].type = betType.arrSelect;
        WgOrphelins['odd'].width = 50;
        WgOrphelins['odd'].height = 105;
        WgOrphelins['odd'].alpha = 0;
        WgOrphelins['odd'].numbers = oddNumberArr;

        WgOrphelins['black'] = wheelTableGroup.create(1280, 435, 'cell_select');
        WgOrphelins['black'].name = 'black';
        WgOrphelins['black'].bet_name = 'black';
        WgOrphelins['black'].bet_type = 'color';
        WgOrphelins['black'].items = ['black'];
        WgOrphelins['black'].type = betType.arrSelect;
        WgOrphelins['black'].alpha = 0;
        WgOrphelins['black'].width = 50;
        WgOrphelins['black'].height = 110;
        WgOrphelins['black'].numbers = blackNumberArr;

        WgOrphelins['red'] = wheelTableGroup.create(1280, 335, 'cell_select');
        WgOrphelins['red'].name = 'red';
        WgOrphelins['red'].bet_name = 'red';
        WgOrphelins['red'].bet_type = 'color';
        WgOrphelins['red'].items = ['red'];
        WgOrphelins['red'].type = betType.arrSelect;
        WgOrphelins['red'].alpha = 0;
        WgOrphelins['red'].width = 50;
        WgOrphelins['red'].height = 110;
        WgOrphelins['red'].numbers = redNumberArr;


        wheel.waitNumber = false;
        ball = this.add.sprite(wheel.x, wheel.y, 'ball', 0);
        highlight = this.add.sprite(wheel.x, wheel.y, 'highlight', 0);
        wheel.angle -= 1;
        wheel.pivotX = 250;
        ball.pivot.x = 250;
        highlight.pivot.x = 250;
        highlight.angle = -2;
        highlight.anchor.setTo(0.5, 0.5);

        obj.spin = function (value) {
            if (value == undefined || value < 0)
                wheel.waitNumber = true;
            else
                wheel.waitNumber = false;
            wheel.number = value;
            wheel.speed = 0.06;
            wheel.startTime = new Date();
            wheel.circle = 5;
            wheel.pivotX = 410;
            wheel.numberDeg = wheelNumberMap.indexOf(wheel.number) * 9.729729;
            highlight.alpha = 0;
            if (wheelGroup.alpha == 0)
                self.add.tween(wheelGroup).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 1000);
        }
        wheelGroup.add(ball);
        wheelGroup.add(highlight);
        if (self.wheelTimeout)
            clearInterval(self.wheelTimeout);
        highlight.alpha = 0;
        setTimeout(function () {
      //        obj.spin(0);
        }, 2000);
      
        return obj;
    },
    changeGameSize: function() {
        var wScale = $(window).innerWidth() / GAME_WIDTH;
        var hScale = $(window).innerHeight() / GAME_HEIGHT;
        if ((Math.max(wScale, hScale) - Math.min(wScale, hScale)) * 100 / (Math.max(wScale, hScale)) < 5) {
            game.scale.setUserScale(wScale, hScale);
        } else {
            if (wScale < hScale) {
                wScale = hScale = Math.min($(window).innerWidth() / GAME_WIDTH, $(window).innerHeight() / GAME_HEIGHT);
                game.scale.setUserScale(wScale, wScale);
            } else {
                hScale = Math.min($(window).innerWidth() / GAME_WIDTH, $(window).innerHeight() / GAME_HEIGHT);
                wScale = hScale + hScale / 100 * 5;
                game.scale.setUserScale(wScale, hScale);
            }
        }
        game.scale.refresh();
    
    },
    resetTable: function() {
        if (selectedChipsGroup.children && selectedChipsGroup.children.length > 0) {
            selectedChipsGroup.removeChildren();
        }
        wheelChipsGroup.removeChildren();
        if (headerBetInputVal !== undefined) {
            headerBetInputVal.setText($.client.UserData.CurrencySign + '0');
        }
        tableChips = [];
        previousBetChips = [];
        summaDeb = 0;
        if (placeHold !== undefined) {
            placeHold.kill();
        }
        if (roundBetChips.length > 0) {
            repeatBetBtn.enable();
        }
        resultGroup.alpha = 0;
        this.add.tween(wheelGroup).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 1000);
    },
    startGame: function() {
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
                                startGameBtn.disable();
                                cancelAllBetBtn.disable();
                                repeatBetBtn.disable();
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
                }), function(res) {
                    if (res.IsSuccess && res.ResponseData.success) {
                        cancelAllBetBtn.disable();
                        repeatBetBtn.disable();
                        startGameBtn.disable();
                    }
                    isSubmiting = false;
                }, function(err) {
                    console.log(err);
                    isSubmiting = false;
                });
            }
        }
    },
    makeBetobject: function(element) {
        var amountDeb = this.getAmountDeb();
        switch (element.type) {
        case betType.straight:
            {
                Bets = {};
                Bets.name = (element.bet_name).toString();
                Bets.type = element.bet_type;
                Bets.items = [parseInt(element.bet_name)];
                Bets.numbers = [parseInt(element.bet_name)];
                Bets.amount = amountDeb;
                element.alpha = 0;
                element.bet_amount = amountDeb;
                element.bets = Bets;
            }
            break;
        case betType.splitY:
            {
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
                    } else {
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
        case betType.splitX:
            {
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
        case betType.street:
            {
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
                    for (var i = 1; i < 3; i++) {
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
        case betType.corner:
            {
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
                                cellX = i;
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
        case betType.multiSelect:
            {
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
        case betType.arrSelect:
            {
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
    cellOver: function(element) {
        var self = this;
        borderPosArr = element['name'].split('_');
        if (MessageDispatcher.isTableOpen && !isMobile.any()) {
            if (borderPosArr[0] != undefined) {
                switch (element.type) {
                case betType.straight:
                    {
                        element.alpha = 0.5;
                    }
                    break;
                case betType.splitY:
                    {
                        if (parseInt(borderPosArr[1], 10) == 0) {
                            for (var i = 0; i <= 2; i++) {
                                cellName = 'cell_' + i + '_' + borderPosArr[2].toString();
                                tableCell[cellName].alpha = 0.5;
                            }
                        } else
                            for (var i = 0; i <= 1; i++) {
                                cellName = 'cell_' + (borderPosArr[1] - i).toString() + '_' + borderPosArr[2].toString();
                                tableCell[cellName].alpha = 0.5;
                            }
                    }
                    break;
                case betType.splitX:
                    {
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
                case betType.corner:
                    {
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
                                    tableCell[cellName].alpha = 0.5;
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
                        } else {
                            if (parseInt(borderPosArr[1], 10) > 0) {
                                for (i = 0; i < 2; i++) {
                                    cellX = parseInt(borderPosArr[1], 10) - i;
                                    cellName = 'cell_' + cellX + '_' + borderPosArr[2].toString();
                                    tableCell[cellName].alpha = 0.5;
                                }
                                tableCell['zero'].alpha = 0.5;
                            } else {
                                for (i = 0; i < 3; i++) {
                                    cellX = parseInt(borderPosArr[1], 10) - i;
                                    cellName = 'cell_' + i + '_' + borderPosArr[2].toString();
                                    tableCell[cellName].alpha = 0.5;
                                }
                                tableCell['zero'].alpha = 0.5;
                            }
                        }
                    }
                    break;
                case betType.street:
                    {
                        if (parseInt(borderPosArr[1], 10) == 1) {
                            this.selectCellsArr({ arr: [0, 1, 2], toggle: false, toggleType: "over" });
                        } else {
                            this.selectCellsArr({ arr: [0, 2, 3], toggle: false, toggleType: "over" });
                        }
                        tableCell['zero'].alpha = 0.5;
                    }
                    break;
                case betType.multiSelect:
                    {
                        self.multySelect({ first: element.first, last: element.last, colFirst: element.colFirst, colLast: element.colLast, toggle: false, toggleType: "over" });
                        element.alpha = 0.5;
                    }
                    break;
                case betType.arrSelect:
                    {
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
    cellOut: function(element) {
        var self = this;
        borderPosArr = element['name'].split('_');
        if (borderPosArr[0] != undefined) {
            switch (element.type) {
            case betType.straight:
                {
                    element.alpha = 0;
                }
                break;
            case betType.splitY:
                {
                    if (parseInt(borderPosArr[1], 10) == 0) {
                        for (var i = 0; i <= 2; i++) {
                            cellName = 'cell_' + i + '_' + borderPosArr[2].toString();
                            tableCell[cellName].alpha = 0;
                        }
                    } else
                        for (var i = 0; i <= 1; i++) {
                            cellName = 'cell_' + (borderPosArr[1] - i).toString() + '_' + borderPosArr[2].toString();
                            tableCell[cellName].alpha = 0;
                        }
                }
                break;
            case betType.splitX:
                {
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
            case betType.corner:
                {
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
                    } else {
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
            case betType.street:
                {
                    if (parseInt(borderPosArr[1], 10) == 1) {
                        this.selectCellsArr({ arr: [0, 1, 2], toggle: false, toggleType: "out" });
                    } else {
                        this.selectCellsArr({ arr: [0, 2, 3], toggle: false, toggleType: "out" });
                    }
                    tableCell['zero'].alpha = 0;
                }

                break;
            case betType.multiSelect:
                {
                    self.multySelect({ first: element.first, last: element.last, colFirst: element.colFirst, colLast: element.colLast, toggle: false, toggleType: "out" });
                    element.alpha = 0;
                }
                break;
            case betType.arrSelect:
                {
                    this.selectCellsArr({ arr: element.numbers, toggle: false, toggleType: "out" });
                    element.alpha = 0;
                }
                break;

            }
        }
        $("#canvas canvas").removeClass('no-cur');
        cursorVisible = false;
    },
    cellClick: function(element) {
        var self = this;
        if (self.makeBet(self.makeBetobject(element)))
            this.confirmBet();
    },
    selectCellsArr: function(pars) {
        var itemsBet = [];
        var arrNum = pars.arr;
        var toggle = pars.toggle || false;
        var toggleType = pars.toggleType || 'out';
        bets = [];
        if (arrNum != undefined) {
            for (var i = 0; i < arrayNambers.length; i++) {
                for (var j = 0; j < arrayNambers[i].length; j++) {
                    if (jQuery.inArray(arrayNambers[i][j], arrNum) != -1) {
                        cellName = 'cell_' + i.toString() + '_' + j.toString();

                        if (toggle) {
                            tableCell[cellName].alpha = 0;
                            itemsBet.push(tableCell[cellName]['bet_name']);

                        } else {
                            if (toggleType == "out") {
                                this.cellOut(tableCell[cellName]);
                            } else if (toggleType == "over") {
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
    multySelect: function(pars) {
        var firstEl = pars.first || 0;
        var lastEl = pars.last || 0;
        var toggle = pars.toggle || false;
        var toggleType = pars.toggleType || 'out';
        var colLastEl = pars.colLast || TABLE_COLS;
        var colFirstEl = pars.colFirst || 0;
        var itemsBet = [];
        if (firstEl != undefined && lastEl != undefined) {
            for (var i = firstEl; i < lastEl; i++) {
                for (var j = colFirstEl; j < colLastEl; j++) {
                    cellName = 'cell_' + j.toString() + '_' + i.toString();
                    if (toggle) {
                        tableCell[cellName].alpha = 0;
                        itemsBet.push(tableCell[cellName]['bet_name']);
                    } else {
                        if (toggleType == "out") {
                            this.cellOut(tableCell[cellName]);
                        } else if (toggleType == "over") {
                            this.cellOver(tableCell[cellName]);
                        }
                    }
                }
            }
            this.bitItems = [];
            this.bitItems = itemsBet;
        }
    },
    getAmountDeb: function() {
        return dib_cost[selectedChipId];
    },
    clearAllBet: function(submited) {
        var items = [];
        if (tableChips.length > 0) {
            for (var i = 0; i < tableChips.length; i++) {
                var bet = tableChips[i];
                if (!bet['sent'] || (!bet['submit'] || submited)) {
                    var chip = bet.chip;
                    chip.destroy();
                    if (summaDeb > 0) {
                        summaDeb = parseFloat(summaDeb - bet.amount).toFixed(2);
                    } else {
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
        if (items.length != tableChips.length) {
            winNumberResultLbl.setTitle($.client.getLocalizedString("TEXT_WIN", true).toUpperCase());
        } else {
            winNumberResultLbl.setTitle($.client.getLocalizedString("TEXT_NO_WIN", true).toUpperCase());
        }
        for (var i = 0; i < items.length; i++) {
            tableChips.splice(tableChips.indexOf(items[i]), 1);
        }
        resultGroup.alpha = 1;
        winNumberLbl.setTitle(winNumber);
        if (jQuery.inArray(parseInt(winNumber, 10), blackNumberArr) != -1) {
            winNumberBg.loadTexture('resultPanel', 1);
        } else if (jQuery.inArray(parseInt(winNumber, 10), redNumberArr) != -1) {
            winNumberBg.loadTexture('resultPanel', 0);
        } else {
            winNumberBg.loadTexture('resultPanel', 2);
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
                            wheelChipsGroup.removeChildren();
                        }
                        if (headerBetInputVal !== undefined) {
                            headerBetInputVal.setText('0');
                        }
                        tableChips = [];
                        previousBetChips = [];
                        summaDeb = 0;
                        USER_BALANCE = responce.ResponseData.balance;
                        headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                        self.changeStatus($.client.getLocalizedString('TEXT_BETS_CANCELED', true), 0, true, 3000);
                        cancelAllBetBtn.disable();
                        startGameBtn.disable();
                    }
                }
            }, function(err) {
                console.log(err);
            });
        }
    },
    saveRoundBet: function() {
        if (previousBetChips.length > 0) {
            roundBetChips = previousBetChips.slice(0);;
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
                    for (var j = 0; j < roundBetChips[i].length; j++) {
                        var pBet = roundBetChips[i][j];
                        var bet = { name: pBet.name, type: pBet.type, amount: pBet.amount, bet: pBet.bet };
                        var isValidBet = this.checkLimit(bet);
                        if (isValidBet.state) {
                            bet.chip = self.add.graphics(pBet.chip.x, pBet.chip.y, selectedChipsGroup);
                            bet.active_sprite = this.add.sprite(0, 0, "tableChips", pBet.active_sprite.fId);
                            bet.active_sprite.fId = pBet.active_sprite.fId;
                            bet.chip.addChild(bet.active_sprite);

                            var chipAmount = pBet.amount;
                            for (var k = 0; k < tableChips.length; k++) {
                                if (tableChips[k].name == bet.name) {
                                    chipAmount += tableChips[k].amount;
                                }
                            }
                            chipAmount = chipAmount % 1 == 0 ? chipAmount : parseFloat(chipAmount).toFixed(1);
                            bet.chipText = self.add.text(50, 32, (chipAmount > 999 ? kFormater(chipAmount) : chipAmount), {
                                font: "bold 28px ProximaNova",
                                fill: "#000"
                            });

                            bet.chipText.anchor.x = Math.round(bet.chipText.width * 0.5) / bet.chipText.width;
                            bet.chip.addChild(bet.chipText);
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
    confirmBet: function(chip) {
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
                            errText = $.client.getLocalizedString('TEXT_INFO_BET_CONFIRMED', true);
                            showInfoText = false;
                            previousBetChips.push($.grep(tableChips, function(n, i) {
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
                            previousBetChips.push($.grep(tableChips, function(n, i) {
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
                        cancelAllBetBtn.enable();
                        startGameBtn.enable();
                    } else {
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
            setTimeout(function() {
                self.confirmBet();
            }, 100);
        }
        return state;
    },
    checkLimit: function(par) {
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
            $.grep(dib_cost, function(item, i) {
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
    drawBetsChip: function(bets) {
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
                headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
            }
        }
        cancelAllBetBtn.enable();
        startGameBtn.enable();
    },
    drawChip: function(element, chipId, sent, submit) {
        var self = this;
        var debValue, elementX, elementY;
        var event = $.extend(true, {}, element);
        var betChip = { name: event.name, type: event.bet_type, amount: dib_cost[chipId], bet: event.bets, sent: sent, submit: submit, chips: event.chips };
        debValue = dib_cost[chipId];
        var chipAmount = debValue;
        betChip.bet.amount = dib_cost[chipId];
        betChip.bet.name = event.bet_name;
        elementX = element.x + element.width / 2 - 48;
        elementY = element.y + element.height / 2 - 48;
        betChip.chip = self.add.graphics(elementX, elementY, selectedChipsGroup);
        betChip.active_sprite = self.add.sprite(0, 0, "tableChips", chipId);
        betChip.active_sprite.fId = chipId;
        betChip.chip.addChild(betChip.active_sprite);
        for (var i = 0; i < tableChips.length; i++) {
            if (tableChips[i].name == betChip.name) {
                chipAmount += tableChips[i].amount;
            }
        }
        chipAmount = chipAmount % 1 == 0 ? chipAmount : parseFloat(chipAmount).toFixed(1)
        betChip.chipText = self.add.text(50, 32, (chipAmount > 999 ? kFormater(chipAmount) : chipAmount), {
            font: "bold 28px ProximaNova",
            fill: "#000"
        });
        betChip.chipText.anchor.x = Math.round(betChip.chipText.width * 0.5) / betChip.chipText.width;
        betChip.chip.addChild(betChip.chipText);
        tableChips.push(betChip);
        tableGroup.add(betChip.chip);
        selectedChipsGroup.add(betChip.chip);
        for (var j in wheelTableGroup.children) {
            if (wheelTableGroup.children[j].name === betChip.name) {
                var sChip;
                if (betChip.name == 0) {
                    sChip = self.add.sprite(wheelTableGroup.children[j].x - wheelTableGroup.children[j].height / 2 - 18, wheelTableGroup.children[j].y + wheelTableGroup.children[j].width / 2 - 18, "stubChip");
                } else
                    sChip = self.add.sprite(wheelTableGroup.children[j].x + wheelTableGroup.children[j].width / 2 - 18, wheelTableGroup.children[j].y + wheelTableGroup.children[j].height / 2 - 18, "stubChip");
                selectedChipsGroup.add(sChip);
                wheelChipsGroup.add(sChip);
         
            }
        }
        return betChip;
    },
    makeBet: function(element, single) {
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
                $.each(validateObj.chips, function(i, chipId) {
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
    changeChips: function(element) {
        var self = this;
        selectedChipId = element.id;
        console.log(mChips.indexOf(element))
        if (mChips.indexOf(element) > 2) {
            if (mChips.indexOf(element) == 4) {
                mChips.push(mChips.shift());
                mChips.push(mChips.shift());
            } else {
                mChips.push(mChips.shift());
            }
        } else if (mChips.indexOf(element) < 2) {
            if (mChips.indexOf(element) == 0) {
                mChips.unshift(mChips.pop());
                mChips.unshift(mChips.pop());
            }else {
                mChips.unshift(mChips.pop());
            }
        }
        var tweenTime = 200;
        mChips.forEach(function (item, i) {
            if (i == 0) {
                item.moveDown();
                item.moveDown();
                item.moveDown();
                item.moveDown();
           //     item.chipText.bringToTop();
                self.add.tween(item.scale).to({ x: 0.7, y: 0.7 }, tweenTime, Phaser.Easing.Linear.None, true, 10);
                self.add.tween(item.chipText).to({ x: 635, y: 938 }, tweenTime, Phaser.Easing.Linear.None, true, 10);
                self.add.tween(item.chipText).to({ fontSize: 50 }, tweenTime, Phaser.Easing.Linear.None, true, 10);
                self.add.tween(item).to({ x: 570, y: 900 }, tweenTime, Phaser.Easing.Linear.None, true, 10);
            } else if (i == 1) {
                item.moveUp();
                item.moveUp();
                item.moveUp();
                item.moveUp();
                item.chipText.bringToTop();
                self.add.tween(item.chipText).to({ x: 745, y: 925 }, tweenTime, Phaser.Easing.Linear.None, true, 10);
                self.add.tween(item.chipText).to({ fontSize: 65 }, tweenTime, Phaser.Easing.Linear.None, true, 10);
                self.add.tween(item.scale).to({ x: 0.85, y: 0.85 }, tweenTime, Phaser.Easing.Linear.None, true, 10);
                self.add.tween(item).to({ x: 670, y: 885 }, tweenTime, Phaser.Easing.Linear.None, true, 10);
            } else if (i == 2) {
                selectedChipId = item.id;
                self.add.tween(item.scale).to({ x: 1, y: 1 }, tweenTime, Phaser.Easing.Linear.None, true, 10);
                self.add.tween(item.chipText).to({ x: 882, y: 920 }, tweenTime, Phaser.Easing.Linear.None, true, 10);
                self.add.tween(item.chipText).to({ fontSize: 80 }, tweenTime, Phaser.Easing.Linear.None, true, 10);
                var tween = self.add.tween(item).to({ x: 790, y: 870 }, tweenTime, Phaser.Easing.Linear.None, true, 10);
                tween.onComplete.add(function() {
                    item.bringToTop();
                    item.chipText.bringToTop();
                });
            } else if (i == 3) {
                item.moveDown();
                item.moveDown();
                item.chipText.bringToTop();
                self.add.tween(item.chipText).to({ x: 1012, y: 925 }, tweenTime, Phaser.Easing.Linear.None, true, 10);
                self.add.tween(item.chipText).to({ fontSize: 65 }, tweenTime, Phaser.Easing.Linear.None, true, 10);
                self.add.tween(item.scale).to({ x: 0.85, y: 0.85 }, tweenTime, Phaser.Easing.Linear.None, true, 10);
                self.add.tween(item).to({ x: 930, y: 885 }, tweenTime, Phaser.Easing.Linear.None, true, 10);
            } else if (i == 4) {
                item.moveDown();
                item.moveDown();
                item.moveDown();
                item.moveDown();
                item.moveDown();
             //   item.chipText.bringToTop();
                self.add.tween(item.scale).to({ x: 0.7, y: 0.7 }, tweenTime, Phaser.Easing.Linear.None, true, 10);
                self.add.tween(item.chipText).to({ x: 1115, y: 935 }, tweenTime, Phaser.Easing.Linear.None, true, 10);
                self.add.tween(item.chipText).to({ fontSize:50 }, tweenTime, Phaser.Easing.Linear.None, true, 10);
                self.add.tween(item).to({ x: 1045, y: 900 }, tweenTime, Phaser.Easing.Linear.None, true, 10);
            }           
        });
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
                    style: "bold",
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
                    var cell = self.add.button(x - 30, y - 15, "listSelector", function () {
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
                        text: limit.Title.toUpperCase(),
                        x: x + 10,
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
    },
    showLimits: function () {
        var limitTitleText;
        var modalBg, cancelBtn;
        var self = this;
        if (!isModalShow) {
            if (limits.length != 0) {
                isModalShow = true;
                limitPopup = this.add.group();
                modalBg = this.add.button(0, 0, "modalBg", this.closelimitPopup, this);
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
                    x: 520,
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
                    var min = limit.min.replace(',', '.');
                    min = parseFloat(min) % 1 == 0 ? parseFloat(min).toFixed(0) : min;
                    min = min > 9999 ? kFormater(min) : min;
                    var minLbl = limitPopup.addChild(self.add.text(x + 170, y, min, {
                        font: "22px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    minLbl.anchor.x = Math.round(minLbl.width * 0.5) / minLbl.width;
                    var max = limit.max.replace(',', '.');
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
    getLimitText: function (obj) {
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
                if (limitPopup && isModalShow)
                    self.closelimitPopup();
            }
        }, function (err) {
            console.log(err);
        });
    },
    validateChips: function () {
        var self = this, prevDissabled;
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
    closelimitPopup: function () {
        isModalShow = false;

        if ((limitPopupTween && limitPopupTween.isRunning)){
            return;
        }        
        
        limitPopupTween =  this.add.tween(limitPopup).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);        
        limitPopup.destroy(); 
    },
    showHistory: function (element) {
        var self = this;
        var statTitleText, modalBg, cancelBtn, winLbl, betLbl;
        if (!isModalShow) {
            if (_videoFlagShow) {
                self.showVideo();
            }
            isModalShow = true;
            historyPopup = this.add.group();
            historyPopup.clicked = false;
            worldGroup.add(historyPopup);
            modalBg = this.add.button(0, 0, "modalBg", this.closeHistoryPopup, this);
            modalBg.height = 1080;
            modalBg.priorityID = 0;
            modalBg.useHandCursor = false;
            historyPopup.add(modalBg);
            var historyBox = this.add.sprite(660, 70, 'historyBg');
            historyBox.height = 680;
            historyBox.width = 340;
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
                text: $.client.UserData.CurrencySign + (TOTAL_LOST > 99999 ? kFormater(TOTAL_LOST) : parseFloat(TOTAL_LOST).toFixed(2)),
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
                x: 690,
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
                var numBg, numText, betText, winText, numTextVal, color;
                numTextVal = item.number + '';
                color = "#ffffff";
                if (jQuery.inArray(parseInt(item.number, 10), blackNumberArr) != -1) {
                    numBg = self.add.sprite(posX, posY, 'numberBg',0);
                } else if (jQuery.inArray(parseInt(item.number, 10), redNumberArr) != -1) {
                    numBg = self.add.sprite(posX, posY, 'numberBg',1);
                } else {
                    numBg = self.add.sprite(posX, posY, 'numberBg',2);
                }
                numText = self.add.text(numBg.x + 26, numBg.y + 14, numTextVal, { font: "22px ProximaNova", fill: color, align: "center" });
                numText.anchor.x = Math.round(numText.width * 0.5) / numText.width;

                historyPopup.addChild(numBg);
                historyPopup.addChild(numText);
                var betAmount = item.betAmount % 1 == 0 ? parseFloat(item.betAmount).toFixed(0) : parseFloat(item.betAmount).toFixed(2);
                betAmount = betAmount > 9999 ? kFormater(betAmount) : betAmount;
                betText = self.add.text(posX + 115, posY + 13, $.client.UserData.CurrencySign + betAmount, { font: "22px ProximaNova", fill: "#fff", align: "center" });
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
        }
    },
    getStatisticData: function (element) {
        var ststs, canselBtn;
        var self = this;
        var statTitleText, coldNumText, hotNumText, colorText, evensOddsText,
        highLowText, dozenText, columnText, modalBg, cancelBtn, cancelBtnText;
        if (!isModalShow) {

            if (this._statData != undefined) {
                if (_videoFlagShow) {
                    self.showVideo();
                }
                ststs = this._statData;
                isModalShow = true;
                self.statShow = true;
                statPopup = this.add.group();

                modalBg = this.add.button(0, 0, "modalBg", this.closeStatPopup, this);
                modalBg.priorityID = 0;
                modalBg.useHandCursor = false;
                modalBg.height = 1080;
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


                function showNumber(element,desc, posX, posY) {
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
                    numBg.inputEnabled = true;
                    numBg.scale.set(1.1);
                    numBg.bet_name = numTextVal;
                    numBg.input.useHandCursor = MessageDispatcher.isTableOpen;

                    numText = self.add.text(numBg.x + 28, numBg.y + 15, numTextVal, { font: "21px ProximaNova", fill: color, align: "center" });
                    numText.anchor.x = Math.round(numText.width * 0.5) / numText.width;

                    numTextDesc = self.add.text(numBg.x + numBg.width - 20, numBg.y + 38, desc, { font: "13px ProximaNova", fill: "#b0b0b0", align: "right" });

                    statData.addChild(numBg);
                    statData.addChild(numText);
                    statData.addChild(numTextDesc);

                }

                function showSectionNumber(posX, posY, label, value, spriteFrame, betNames) {
                    var statChartFirst, statChartSecond, statChartThird,
                        statChartFirstText, statChartSecondText, statChartThirdText
                    ;

                    //    statChartFirst = self.add.sprite(posX, posY, 'statChartBg', spriteFrame[0]);
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
                    statChartFirstText = createTextLbl(self, {
                        text: '',
                        x: statChartFirst.x + statChartFirst.width / 2,
                        y: statChartFirst.y + 14,
                        font: "ProximaNova",
                        size: 20,
                        color: "#ffffff",
                        centered: true,
                        maxHeight: 20,
                        maxWidth: statChartFirst.width - (value[0] > 20 ? 5 : 0)
                    });
                    if (value[0] > 20) {
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
                        x: statChartSecond.x + statChartSecond.width / 2,
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
                        x: statChartThird.x + statChartThird.width / 2,
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

                for (var i = 0; i < ststs.coldNumbers.length - 4; i++) {
                    showNumber(ststs.coldNumbers[i].number, ststs.coldNumbers[i].lastHit, coldNumText.x + 155 + (i) * 58, coldNumText.y - 5);
                }

                for (var i = 0; i < ststs.hotNumbers.length - 4; i++) {
                    showNumber(ststs.hotNumbers[i].number, ststs.hotNumbers[i].count, hotNumText.x + 155 + (i) * 58, hotNumText.y - 5);
                }
                showSectionNumber(colorText.x + 153, colorText.y - 20,
                    [$.client.getLocalizedString("RED", true).toUpperCase(), $.client.getLocalizedString("GREEN", true).toUpperCase(), $.client.getLocalizedString("BLACK", true).toUpperCase()],
                    [ststs.colors.red, ststs.colors.zero, ststs.colors.black],
                    [0, 1, 3],
                    ["red", "0", "black"]
                );

                showSectionNumber(evensOddsText.x + 155, evensOddsText.y - 20,
                    [$.client.getLocalizedString("EVEN", true).toUpperCase(), $.client.getLocalizedString("ZERO", true).toUpperCase(), $.client.getLocalizedString("ODDS", true).toUpperCase()],
                    [ststs.evenOdds.even, ststs.evenOdds.zero, ststs.evenOdds.odds],
                    [2, 1, 2],
                    ["even", "0", "odd"]
                );

                showSectionNumber(highLowText.x + 155, highLowText.y - 20,
                    [$.client.getLocalizedString("HIGH", true).toUpperCase(), $.client.getLocalizedString("ZERO", true).toUpperCase(), $.client.getLocalizedString("LOW", true).toUpperCase()],
                    [ststs.highLow.high, ststs.highLow.zero, ststs.highLow.low],
                    [2, 2, 2],
                    ["second18", "0", "first18"]
                );

                showSectionNumber(dozenText.x + 155, dozenText.y - 20,
                    ["1-12", "13-24", "25-36"],
                    [ststs.dozens.first, ststs.dozens.second, ststs.dozens.third],
                    [2, 3, 2],
                    ["first12", "second12", "third12"]
                );
                showSectionNumber(columnText.x + 155, columnText.y - 20,
                    ["1-34", "2-35", "3-36"],
                    [ststs.columns.first, ststs.columns.second, ststs.columns.third],
                    [2, 3, 2],
                    ["col1", "col2", "col3"]
                );

  
            }
        }
    },
    closeHistoryPopup: function () {
        historyPopup.destroy(); 
        isModalShow = false;
    },
    closeStatPopup: function () {
        statPopup.destroy(); 
        isModalShow = false;
        this.statShow = false;
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
            setTimeout(function(){
                self.updateStatistics();
            },1000)
            console.log(err);
        });
    },
    createTimer: function (totalTime, endCallback, updateCallback) {
        var timer;
        timerSprite.totalTime = totalTime;
        timerSprite.time = totalTime;
        timerSprite.endCallback = endCallback;
        timerSprite.updateCallback = updateCallback;
        timerSprite.bg = frameGroup.create(60, 578, 'timer', 0);
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
                self.stateTimeout = setTimeout(function () {
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
                infoText.setText(text);
            }
        }
    },
    showWinner: function (winAmount) {
        headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
        var text = $.client.getLocalizedString("TEXT_DISPLAY_MSG_PLAYER_WIN", true) + $.client.UserData.CurrencySign + parseFloat(winAmount).toFixed(2);
        MessageDispatcher.betHistory[MessageDispatcher.betHistory.length - 1].winAmount = parseFloat(winAmount).toFixed(2);
        this.changeStatus(text, 1, false, 2000);
        headerWinInputVal.setTitle($.client.UserData.CurrencySign + (winAmount > 99999 ? kFormater(winAmount) : parseFloat(winAmount).toFixed(2)));
    },
    restartGame: function () {
 /*       startGameBtn.alpha = 1;
        startGameBtn.btn.inputEnabled = true;
        startGameBtn.btn.input.useHandCursor = true;
      /*  provablyBtn.btn.inputEnabled = true;
        if ($.client.UserData.Features && $.client.UserData.Features.provably_fair) {
            provablyBtn.btn.inputEnabled = true;
            provablyBtn.alpha = 1;
        } else {
            provablyBtn.btn.inputEnabled = false;
            provablyBtn.alpha = 0;
        }*/
    },
    updateLastNumbers: function (handCursor) {
        var color, self = this, numBgId;
        if (MessageDispatcher.winNumArr.length > 0) {
            winTextGroup.removeAll();
            winNumbersGroup.removeAll();
            var winArr = MessageDispatcher.winNumArr.slice(Math.max(MessageDispatcher.winNumArr.length - 6, 0));
            for (var i = 0; i < 6 && i < winArr.length; i++) {
                color = "#ffffff";
                if (jQuery.inArray(parseInt(winArr[i], 10), blackNumberArr) != -1) {
                    numBgId = 0;
                    if (i == 0 )
                        numBgId = 3;
                    else if(i == 5)
                        numBgId = 6;
                } else if (jQuery.inArray(parseInt(winArr[i], 10), redNumberArr) != -1) {
                    numBgId = 1;
                    if (i == 0)
                        numBgId = 4;
                    else if (i == 5)
                    numBgId = 7;
                } else {
                    numBgId = 2;
                    if (i == 0)
                         numBgId = 5;
                    else if (i == 5)
                        numBgId = 8;
                }                
                winNum = createTextButton(self, {
                    text: winArr[i].toString(),
                    x: 41 + (71.22 * i),
                    y:  gameFrame.height - 213,
                    font: "ProximaNova",
                    size: 21,
                    maxHeight: 21,
                    maxWidth: 500,
                    color: color,
                    style: "bold",
                    centered: true,
                    paddingTop: -2,
                    sprite: "numberBg",
                    defaultIndex: numBgId,
                    overIndex: numBgId,
                    clickIndex: numBgId,
                    disabledIndex: numBgId,
                    useHandCursor: true,
                    textClickYOffset: -1,
                    onClick: function (element) {
                        for (var j in tableGroup.children) {
                            if (tableGroup.children[j].bet_name === element.bet_name) {
                                self.cellClick(tableGroup.children[j]);
                            }
                        }
                    }
                });
                winNum.bet_name = winArr[i].toString();
                winTextGroup.add(winNum);
                var winNumWheelStage = createTextButton(self, {
                    text: winArr[i].toString(),
                    x: 1266 + (71.22 * i),
                    y:  gameFrame.height - 213,
                    font: "ProximaNova",
                    size: 21,
                    maxHeight: 21,
                    maxWidth: 500,
                    color: color,
                    style: "bold",
                    centered: true,
                    paddingTop: -2,
                    sprite: "numberBg",
                    defaultIndex: numBgId,
                    overIndex: numBgId,
                    clickIndex: numBgId,
                    disabledIndex: numBgId,
                    useHandCursor: true,
                    textClickYOffset: -1,
                    onClick: function (element) {
                        for (var j in tableGroup.children) {
                            if (tableGroup.children[j].bet_name === element.bet_name) {
                                self.cellClick(tableGroup.children[j]);
                            }
                        }
                    }
                });
                winNumWheelStage.bet_name = winArr[i].toString();
                winTextGroup.add(winNumWheelStage);
                wheelGroup.add(winNumWheelStage);            
            }
            winArr = MessageDispatcher.winNumArr.slice(Math.max(MessageDispatcher.winNumArr.length - 10, 0));
            for (var i = 0; i < winArr.length; i++) {
                var offset = 0;
                if (jQuery.inArray(parseInt(winArr[i], 10), blackNumberArr) != -1) {
                    color = "#505050";
                    offset = 135;
                } else if (jQuery.inArray(parseInt(winArr[i], 10), redNumberArr) != -1) {
                    color = "#ca292e";
                    offset = 0;
                } else {
                    color = "#43880f";
                    offset = 70;
                }
                var historyLbl = createTextLbl(self, {
                    text: winArr[i].toString(),
                    x: 70 + offset,
                    y: 400 + i * 60,
                    font: "ProximaNova",
                    size: 40,
                    color: color,
                    centered: true,
                    maxHeight: 40,
                    maxWidth: 80
                });
                historyLbl.alpha = 0.8;
                winNumbersGroup.add(historyLbl);
            }
        }
    },
    showMessage: function (text) {
        var self = this;
        if (msgGroup) {
            setTimeout(function () {
                worldGroup.remove(msgGroup);
                msgGroup = null;
                clearTimeout(msgTimeout);
                self.showMessage(text);
            }, 2000);
        } else {
            msgGroup = this.add.group();
            msgGroup.clicked = false;
            worldGroup.add(msgGroup);
        
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
            msgTimeout = setTimeout(function () {
                worldGroup.remove(msgGroup);
                msgGroup = null;
            }, 4000);
        }
    },
    playWinNumberSound: function (number) {
        $.client.playSound('../../sounds/numbers/' + number + '.mp3');
    },
    clearWinAmout: function () {
        headerWinInputVal.setTitle($.client.UserData.CurrencySign + 0);
    },
    showCashier: function (visible) {
       /* if (visible) {
            cashierBtn.alpha = 1;
            cashierBtn.input.useHandCursor = true;
            cashierBtn.clicked = true;
            cashierBtn.inputEnabled = true;
        } else {
            cashierBtn.alpha = 0;
            cashierBtn.input.useHandCursor = false;
            cashierBtn.clicked = false;
            cashierBtn.inputEnabled = false;
        }*/
    },
    showDolly: function (number) {
        if (dolly)
            resultGroup.remove(dolly);
        for (var i = 0; i < wheelTableGroup.children.length; i++) {
            if (wheelTableGroup.children[i].bet_name == number.toString()) {
                if (number === 0) {
                    dolly = this.add.sprite(wheelTableGroup.children[i].x + wheelTableGroup.children[i].width / 2 - 200, wheelTableGroup.children[i].y + 3, 'placeholder');
                } else {
                    dolly = this.add.sprite(wheelTableGroup.children[i].x + 20, wheelTableGroup.children[i].y, 'placeholder');
                }
                resultGroup.add(dolly);
            }
        }
    },
    hideDolly: function() {
        resultGroup.remove(dolly);
    },
    updateGameInfo: function() {
        headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
        headerWinInputVal.setTitle($.client.UserData.CurrencySign + (winAmount > 99999 ? kFormater(winAmount) : parseFloat(winAmount).toFixed(2)));
        headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
        wheelStageBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
        wheelStageWinInputVal.setTitle($.client.UserData.CurrencySign + (winAmount > 99999 ? kFormater(winAmount) : parseFloat(winAmount).toFixed(2)));
        wheelStageBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
    }
};
