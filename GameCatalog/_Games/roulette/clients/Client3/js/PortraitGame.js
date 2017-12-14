
var 
    USER_BALANCE = 0 ;
    TOTAL_LOST = 0;

    var arrayNambers = [[1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34], [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35], [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]],
        blackNumberArr = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
        redNumberArr =  [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
        oddNumberArr =  [1,3,5,7,9,11,13,15,17,19,21,23,25,27,29,31,33,35],
        evenNumberArr = [2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36],
        zeroNumberArr = [26, 32, 15, 12, 35, 3],
        voisinsNumberArr = [3,0,19,12,15, 4, 21, 2, 25,26, 22, 18, 29, 7, 28, 35],
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

var dib_cost = [ 1, 5, 25, 50,100],
    NUM_DIB = dib_cost.length - 1,
    selectedChipId=1,
    table, summaDeb = 0,
    tableStatus, infoText, timerText;

var Bets = {};
var timerSprite = {}, timerObj;
var betHistory = [];

var winNumInfo ={}, msgBoxPopup, msgBoxTween, limitPopup,limitSelectionPopup, limitPopupTween,videoGroup,menuGroup, statPopup,historyPopup, statPopupTween, selectedLimits =[];
var cellName, betName, borderPosArr;

var tableChips = [];
var localBets = [];
var limits = [];
var  currentLimits= {};
var previousBetChips = [];
var roundBetChips = [];
var lastRevive = 0;
var limitBtnText, confirmLimitBtn,cashierBtn;

var userNameText, USER_NAME, headerBetInputVal, headerBalansInputVal, showVideoBtn, showVideoBtGroup, hideVideoBtn, headerWinInputVal;
var gameFrame, winNum, placeHold, timer, wheelBg, wheel, ball, wheelGroup, dolly;
var _winNumUpdate, progressText, _videoFlagShow, isModalShow,isSubmiting;
var cancelLastBtn, cancelAllBetBtn, repeatBetBtn;

var worldGroup = {}, videoGroup= {},tableGroup = {}, frenchGroup = {}, chipsGroup = {}, buttonGroup = {}, selectedChipsGroup = {},
    frameGroup = {}, footerGroup = {}, winTextGroup = {}, limitGroup = {}, scrollGroup, gameBtnGroup, topBarGroup, bottomBarGroup, msgGroup,statusGroup, msgTimeout;
;
var tableCell = {},  Dozen ={}, Column = {}, Orphelins = {}, Neighbors = {}, RoulettePortraitGame = {};
var previousMsgType, winAmount = 0, lastChangeStatus, startGameBtn,provablyBtn;

RoulettePortraitGame.Boot = function (game) {       
};

RoulettePortraitGame.Boot.prototype = {
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

RoulettePortraitGame.Preloader = function (game) {
this.ready = false;
};

RoulettePortraitGame.Preloader.prototype = {
    
    preload: function () {
        this.load.image('gameFrameH', '../Client3/images/phone_bg_h.png');
        this.load.image('gameFrameV', '../Client3/images/phone_bg_v.png');
        this.load.image('wheelBg', '../Client3/images/phone_spin_bg_v.png');
        this.load.image('wheel', '../Client3/images/wheel.png');
        this.load.image('videoBtnH', '../Client3/images/phone_video_btn_h.png');
        this.load.image('videoBtnV', '../Client3/images/phone_video_btn_v.png');
        this.load.image('videoBtnDisV', '../Client3/images/phone_video_btn_dis_v.png');
        this.load.image('tableV', '../Client3/images/phone_table_v.png');
        this.load.image('tableH', '../Client3/images/phone_table_h.png');
        this.load.image('mainBtnBg', '../Client3/images/phone_game_btn_bg.png');
        this.load.image('winnerBg', '../Client3/images/phone_winner_bg.png');
        this.load.image('cell_select', '../Client3/images/cell_select.png');
        this.load.image('numberBg', '../Client3/images/number_bg.png');
        this.load.image('closeBtn', '../Client3/images/modal_close_btn.png');
        this.load.image('historyBg', '../Client3/images/history_bg.png');
        this.load.image('statBg', '../Client3/images/stat_bg.png');
        this.load.image('limitsBg', '../Client3/images/limit_bg.png');
        this.load.image('tableBg', '../Client3/images/phone_bg_v.png');
        this.load.image('modalBg', '../Client3/images/msg_bg.png');
        this.load.image('cashin', '../Client3/images/cashin.png');
        this.load.image('bottomBtnBg', '../Client3/images/phone_bottom_btn_bg.png');
        this.load.image('menuBg', '../Client3/images/menu_bg.png');
        this.load.image('placeholder', '../Client3/images/placeholder.png');
        this.load.image('limitSelectorBg', '../Client3/images/selectorBg.png');
        this.load.image('limitsModalBg', '../Client3/images/phone_limits_selectio_bg.png');
        this.load.image('listSelector', '../Client3/images/listSelector.png');
        this.load.image('limitsListBtn', '../Client3/images/limitBtn.png');
        this.load.image('spinBtn', '../Client3/images/phone_spin_btn.png');
        this.load.image('ball', '../Client3/images/ball.png');
        this.load.spritesheet('timer', '../Client3/images/phone_timer.png', 60, 60);
        this.load.spritesheet('muteIco', '../Client3/images/mute_ico.png', 75, 69);
        this.load.spritesheet('statusBg', '../Client3/images/phone_status_bg.png', 1600, 61);
        this.load.spritesheet('icons', '../Client3/images/btn_icons.png', 42, 27);
        this.load.spritesheet('chips', '../Client3/images/phone_chips.png', 110, 110);
        this.load.spritesheet('statChartBg', '../Client3/images/stat_chart_bg.png', 169, 50);
        this.load.spritesheet('menuBtn', '../Client3/images/phone_menu_btn.png', 72, 53);
        this.load.spritesheet('buttonsBg', '../Client3/images/phone_buttons_bg.png', 435, 65);
     
        this.game.load.onFileComplete.add(this.updateProgressBar, this);
    },

    create: function () {
        dib_cost = [1, 5, 25, 50, 100];
        NUM_DIB = dib_cost.length - 1;
        var self = this;
        worldGroup = this.add.group();
        tableGroup = this.add.group();
        chipsGroup = this.add.group();
        buttonGroup = this.add.group();
        winTextGroup = this.add.group();
        statusGroup = this.add.group();
        selectedChipsGroup = this.add.group();
        
        frameGroup = this.add.group();
        footerGroup = this.add.group();

        worldGroup.add(tableGroup);
        tableGroup.add(chipsGroup);        
     
        worldGroup.add(buttonGroup);        
        footerGroup.add(winTextGroup);
        buttonGroup.add(frameGroup);
        buttonGroup.add(footerGroup);
        worldGroup.add(statusGroup);
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

RoulettePortraitGame.MainMenu = function(game){ 

};

RoulettePortraitGame.MainMenu.prototype = {    
    create: function () {
        var self = this;
        $.client.enableSound(false);
        for (var a = 0; a <= NUM_DIB; a++) {
            dib_cost[a] = dib_cost[a] * $.client.UserData.CurrencyMultiplier;
        }
        if (window.matchMedia("(orientation: portrait)").matches) {
            GAME_WIDTH = 750;
            GAME_HEIGHT = 1334;
            self.initVerticalLayout();
        } else {
            GAME_WIDTH = 1334;
            GAME_HEIGHT = 750;
            self.initHorizontalLayout();
        };
        game.scale.setGameSize(GAME_WIDTH, GAME_HEIGHT);
        self.changeGameSize();
        window.addEventListener("resize", function () {
            worldGroup.removeChildren();
            worldGroup.removeAll();
            scrollGroup.removeAll();
            gameBtnGroup.removeAll();
            videoGroup.removeAll();
            tableGroup.removeAll();
            chipsGroup.removeAll();
            selectedChipsGroup.removeAll();
            frameGroup.removeAll();
            footerGroup.removeAll();
            frenchGroup.removeAll();
            limitGroup.removeAll();
            topBarGroup.removeAll();
            statusGroup.removeAll();
            bottomBarGroup.removeAll();
            tableChips = [];
            if (window.innerWidth < window.innerHeight) {
                GAME_WIDTH = 750;
                GAME_HEIGHT = 1334;
                self.initVerticalLayout();
            } else {
                GAME_WIDTH = 1334;
                GAME_HEIGHT =750;
                self.initHorizontalLayout();
            };
            if (self.mode == "Manual" && MessageDispatcher.gameStatus == GAMESTATE_CODE_TABLE_OPENED) {
                self.restartGame();
            }
            self.drawBetsChip(MessageDispatcher.userBets);
            if (self.previousState)
                self.changeStatus(self.previousState.text, self.previousState.statusIndex, self.previousState.showModal);

            game.scale.setGameSize(GAME_WIDTH, GAME_HEIGHT);
            self.changeGameSize();
        }, false);
    },
    initVerticalLayout: function () {
            TABLE_WIDTH = 600,
            TABLE_HEIGHT = 285,
            DIB_WIDTH = 50,
            DIB_HEIGHT = 95,
            DIB_SPASE = 2.5,
            TABLE_ROWS = Math.floor(TABLE_WIDTH / DIB_WIDTH),
            TABLE_COLS = Math.floor(TABLE_HEIGHT / DIB_HEIGHT);
            var self = this;
            var bottomBetLabel, balansLabel, dateTimeLabel,gameIdLabel,
                 chipsEl, table;

            var spriteXY, spriteX, spriteY;
   
            worldGroup = this.add.group();
            scrollGroup = this.add.group();
            gameBtnGroup = this.add.group();
            videoGroup = this.add.group();
            worldGroup.add(tableGroup);
            worldGroup.add(scrollGroup);
            this.scale.setUserScale(SCALE, SCALE);
            this.scale.refresh();
            tableGroup = this.add.group();
            chipsGroup = this.add.group();
            selectedChipsGroup = this.add.group();
    
            frameGroup = this.add.group();
            footerGroup = this.add.group();
            frenchGroup = this.add.group();
            limitGroup = this.add.group();
            topBarGroup = this.add.group();
            statusGroup = this.add.group();
            bottomBarGroup = this.add.group();
            worldGroup.add(frameGroup);
            worldGroup.add(tableGroup);
            scrollGroup.add(tableGroup);
            worldGroup.add(frenchGroup);
            worldGroup.add(footerGroup);
            scrollGroup.add(buttonGroup);
     
            worldGroup.add(buttonGroup);
            worldGroup.add(limitGroup);
            if (!wheelGroup) {
                wheelGroup = this.add.group();
                wheelBg = this.add.sprite(0, 146, 'wheelBg');
                wheelGroup.add(wheelBg);
            }
            worldGroup.add(wheelGroup);
            worldGroup.add(statusGroup);

            buttonGroup.priorityID = 3;
            gameFrame = this.add.sprite(0, 0, 'gameFrameV');
        /*wheel = this.add.sprite(45, 120, 'wheel');
            wheel.rX = wheel.x;
            wheel.rY = wheel.y;*/
            table = this.add.sprite(2, 830, 'tableV');
            table.width = 745;
            table.height = 395;
            frameGroup.add(gameFrame);
           // wheelGroup.add(wheel);
            frameGroup.add(table);
            tableGroup.add(selectedChipsGroup);
            frameGroup.add(tableGroup);
            frameGroup.add(bottomBarGroup);

            var name = USER_NAME ? USER_NAME.toUpperCase().length < 20 ? USER_NAME.toUpperCase() : USER_NAME.toUpperCase().substr(0, 20) + '...' : "";
            userNameText = this.add.text(30, 2255, name, {
                font: "27px ProximaNova",
                fill: "#fff"
            });
            bottomBarGroup.add(userNameText);
            balansLabel = createTextLbl(self, {
                text: $.client.getLocalizedString("TEXT_BALANCE", true).toUpperCase(),
                x: 15,
                y: 30,
                font: "ProximaNova",
                size: 22,
                color: "#fff",
                centered: false,
                maxHeight: 30,
                maxWidth: 130
            });
            bottomBarGroup.add(balansLabel);

            headerBalansInputVal = createTextLbl(self, {
                text: $.client.UserData.CurrencySign + USER_BALANCE,
                x: balansLabel.x + balansLabel.width + 5,
                y: 30,
                font: "ProximaNova",
                size: 22,
                color: "#fff",
                centered: false,
                maxHeight: 30,
                maxWidth: 100
            });
            bottomBarGroup.add(headerBalansInputVal);
            headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
            gameIdLabel= createTextLbl(self, {
                text: $.client.getLocalizedString("Game Id:", true) + " " + MessageDispatcher.gameId,
                x: 600,
                y: 770,
                font: "ProximaNova",
                size: 34,
                color: "#808080",
                centered: true,
                maxHeight: 40,
                maxWidth: 240
            });
            dateTimeLabel = createTextLbl(self, {
                text: $.DateFormat(MessageDispatcher.serverTime.toString(), "yyyy-MM-dd | HH:mm:ss"),
                x: 600,
                y: 735,
                font: "ProximaNova",
                size: 34,
                color: "#808080",
                centered: true,
                maxHeight: 40,
                maxWidth: 240
            });
            if (self.timeInterval)
                clearInterval(self.timeInterval);

            self.timeInterval=setInterval(function() {
                gameIdLabel.setTitle($.client.getLocalizedString("Game Id:", true)+" "+MessageDispatcher.gameId);
                MessageDispatcher.serverTime.setSeconds(MessageDispatcher.serverTime.getSeconds() + 1);
                dateTimeLabel.setTitle($.DateFormat(MessageDispatcher.serverTime.toString(), "yyyy-MM-dd | HH:mm:ss"));
            }, 1000);
            cashierBtn = this.add.button(gameFrame.width - 70, 2250, 'cashin', function () {
                $.client.cashier();
            }, this);
            cashierBtn.scale.set(0.7);
            cashierBtn.input.useHandCursor = true;
            cashierBtn.clicked = true;
            bottomBarGroup.add(cashierBtn);

            bottomBetLabel  = createTextLbl(self, {
                text: $.client.getLocalizedString("TEXT_BET", true).toUpperCase(),
                x: 250,
                y: 30,
                font: "ProximaNova",
                size: 22,
                color: "#fff",
                centered: false,
                maxHeight: 30,
                maxWidth: 100
            });
            bottomBarGroup.add(bottomBetLabel);
            headerBetInputVal = createTextLbl(self, {
                text: $.client.UserData.CurrencySign + '0',
                x: bottomBetLabel.x + bottomBetLabel.width + 10,
                y: 30,
                font: "ProximaNova",
                size: 22,
                color: "#fff",
                centered: false,
                maxHeight: 30,
                maxWidth: 100
            });
            bottomBarGroup.add(headerBetInputVal);

            tableStatus = this.add.sprite(430, 20, 'statusBg', 0);
            tableStatus.height = 40;
            tableStatus.width = 300;
            frameGroup.add(tableStatus);

            infoText = createTextLbl(self, {
                text: $.client.getLocalizedString("PLEASE WAIT FOR THE NEXT OPEN TABLE", true).toUpperCase(),
                x: 585,
                y: 20,
                font: "ProximaNova",
                size: 37,
                color: "#fff",
                centered: true,
                maxHeight: 37,
                maxWidth: 320
            });
            frameGroup.add(infoText);

            repeatBetBtn = self.add.button(400, 1250, "mainBtnBg", function () {
                self.repeatBets();
            }, this);
            repeatBetBtn.height = 65;
            repeatBetBtn.width = 110;
            repeatBetBtn.alpha = 0;
            repeatBetBtn.priorityID = 0;
            repeatBetBtn.text = createTextLbl(self, {
                text: $.client.getLocalizedString('Repeat', true).toUpperCase(),
                x: 410,
                y: 1270,
                font: "ProximaNova",
                size: 25,
                color: "#fff",
                maxHeight: 90,
                maxWidth: 110
            });
            gameBtnGroup.add(repeatBetBtn);
            gameBtnGroup.add(repeatBetBtn.text);
   
            buttonGroup.add(gameBtnGroup);
            cancelAllBetBtn = self.add.button(520, 1250, "mainBtnBg", function () {
                self.cancelAllBet();
            }, this);
            cancelAllBetBtn.height = 65;
            cancelAllBetBtn.width = 100;
            cancelAllBetBtn.alpha = 0;
            cancelAllBetBtn.priorityID = 0;
            cancelAllBetBtn.text = createTextLbl(self, {
                text: $.client.getLocalizedString('Clear', true).toUpperCase(),
                x: 530,
                y: 1270,
                font: "ProximaNova",
                size: 25,
                color: "#fff",
                maxHeight: 90,
                maxWidth: 110
            });
            gameBtnGroup.add(cancelAllBetBtn);
            gameBtnGroup.add(cancelAllBetBtn.text);

            cancelLastBtn = self.add.button(630, 1250, "mainBtnBg", function () {
                self.cancelLastBet();
            }, this);
            cancelLastBtn.height = 65;
            cancelLastBtn.width = 100;
            cancelLastBtn.alpha = 0;
            cancelLastBtn.priorityID = 0;
            cancelLastBtn.text = createTextLbl(self, {
                text: $.client.getLocalizedString('Back', true).toUpperCase(),
                x: 640,
                y: 1270,
                font: "ProximaNova",
                size: 25,
                color: "#fff",
                maxHeight: 90,
                maxWidth: 110

            });
            gameBtnGroup.add(cancelLastBtn);
            gameBtnGroup.add(cancelLastBtn.text);
            menuBtn = this.add.button(40, 80, 'menuBtn', function () {
                self.showMenu();
            }, this, 0);
            menuBtn.input.useHandCursor = true;
            menuBtn.scale.set(0.9);
            menuBtn.clicked = true;
            gameBtnGroup.add(menuBtn);
            _videoFlagShow = true;
            videoBtn = this.add.button(650, 80, 'videoBtnV', function () {
                if (_videoFlagShow) {
                    videoBtn.loadTexture('videoBtnDisV', 0);
                    self.hideVideo();
                } else {
                    videoBtn.loadTexture('videoBtnV', 0);
                    self.showVideo();
                }
            }, this, 0);
            videoBtn.input.useHandCursor = true;
            videoBtn.scale.set(0.8);
            videoBtn.clicked = true;
            gameBtnGroup.add(videoBtn);
 
            startGameBtn = this.add.group();
            var startGameBtnBg = this.add.button(20, 745, 'spinBtn', this.startGame);
            startGameBtnBg.scale.set(0.7);
            startGameBtnBg.clicked = true;
            startGameBtnBg.input.enabled = false;
            startGameBtnBg.input.useHandCursor = true;
            startGameBtn.btn = startGameBtnBg;
            startGameBtn.add(startGameBtnBg);
            startGameBtn.alpha = 0;
            gameBtnGroup.add(startGameBtn);
            var muteBtn = this.add.button(660, 655, 'muteIco', function () {
                if (!$.client.getMuteState()) {
                    muteBtn.loadTexture('muteIco', 1);
                    game.sound.mute = true;
                    $.client.enableSound(false);
                } else {
                    muteBtn.loadTexture('muteIco',0);
                    game.sound.mute = false;
                    $.client.enableSound(true);
                }
          }, null,this, $.client.getMuteState() ? 1 : 0);
           muteBtn.scale.set(0.8);
            gameBtnGroup.add(muteBtn);

            var chipSpriteId = 0;
            for (var a = 0; a <= NUM_DIB; a++) {
                if (a === selectedChipId) {
                    chipsEl = chipsGroup.create(5 + ((NUM_DIB-a) * 77), 1240, 'chips', chipSpriteId + 1);
                } else {
                    chipsEl = chipsGroup.create(5 + ((NUM_DIB - a) * 77), 1240, 'chips', chipSpriteId);
                }
                chipsEl.id = a;
                chipSpriteId += 2;
                chipsEl.debValue = dib_cost[a];
                chipsEl.inputEnabled = true;
                chipsEl.scale.set(0.7);
                chipsEl.input.useHandCursor = true;
                chipsEl.events.onInputDown.add(this.changeChips, this);
                chipsEl.rY = chipsEl.y;
                chipsEl.rX = chipsEl.x;
                chipsEl.chipText = this.add.text(chipsEl.x + 38, chipsEl.y + 24, dib_cost[a] > 999 ? kFormater(dib_cost[a]) : dib_cost[a], {
                    font: "bold 27px  ProximaNova",
                    fill: "#fff"
                });
                chipsEl.chipText.anchor.x = Math.round(chipsEl.chipText.width * 0.5) / chipsEl.chipText.width;
                chipsGroup.add(chipsEl.chipText);
            }
            self.changeChips({ id: selectedChipId });
            frameGroup.add(chipsGroup);


            for (var i = 0; i < TABLE_COLS; i++) {
                for (var j = 0; j < TABLE_ROWS; j++) {

                    cellName = 'cell_' + i.toString() + '_' + j.toString();
                    tableCell[cellName] = tableGroup.create(table.x + 54 + j * (DIB_WIDTH + DIB_SPASE), table.y + 195 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
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

                    spriteX = tableGroup.create(table.x + 54 + j * (DIB_WIDTH + DIB_SPASE), table.y + 275 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
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

                    spriteY = tableGroup.create(table.x + 40 + j * (DIB_WIDTH + DIB_SPASE), table.y + 195 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
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

                    spriteXY = tableGroup.create(table.x + 35 + j * (DIB_WIDTH + DIB_SPASE), table.y + 280 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
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
            tableCell['zero'] = tableGroup.create(table.x + 2, table.y + 3, 'cell_select');
            tableCell['zero'].name = '0';

            tableCell['zero'].bet_name = '0';
            tableCell['zero'].bet_type = 'straight';

            tableCell['zero'].type =betType.straight;
            tableCell['zero'].alpha = 0;
            tableCell['zero'].width = 50;
            tableCell['zero'].height = 285;

            tableCell['zero'].inputEnabled = true;
            tableCell['zero'].events.onInputUp.add(this.cellClick, this);
            tableCell['zero'].events.onInputOver.add(this.cellOver, this);
            tableCell['zero'].events.onInputOut.add(this.cellOut, this);

            Dozen['one'] = tableGroup.create(table.x + 52, table.y + 290, 'cell_select');
            Dozen['one'].name = 'dozenOne';
            Dozen['one'].bet_name = 'first12';
            Dozen['one'].bet_type = 'dozen';
            Dozen['one'].items = [0];
            Dozen['one'].first = 0;
            Dozen['one'].last = 4;
            Dozen['one'].alpha = 0;
            Dozen['one'].width = 210;
            Dozen['one'].height = 50;
            Dozen['one'].type = betType.multiSelect;
            Dozen['one'].inputEnabled = true;
            Dozen['one'].events.onInputUp.add(this.cellClick, this);
            Dozen['one'].events.onInputOver.add(this.cellOver, this);
            Dozen['one'].events.onInputOut.add(this.cellOut, this);

            Dozen['two'] = tableGroup.create(table.x + 262, table.y + 290, 'cell_select');
            Dozen['two'].name = 'dozenTwo';
            Dozen['two'].bet_name = 'second12';
            Dozen['two'].bet_type = 'dozen';
            Dozen['two'].items = [1];
            Dozen['two'].type = betType.multiSelect;
            Dozen['two'].alpha = 0;
            Dozen['two'].width = 210;
            Dozen['two'].height = 50;
            Dozen['two'].first = 4;
            Dozen['two'].last = 8;
            Dozen['two'].inputEnabled = true;
            Dozen['two'].events.onInputUp.add(this.cellClick, this);
            Dozen['two'].events.onInputOver.add(this.cellOver, this);
            Dozen['two'].events.onInputOut.add(this.cellOut, this);

            Dozen['three'] = tableGroup.create(table.x + 472, table.y + 290, 'cell_select');
            Dozen['three'].name = 'dozenThree';
            Dozen['three'].bet_name = 'third12';
            Dozen['three'].bet_type = 'dozen';
            Dozen['three'].items = [2];
            Dozen['three'].type = betType.multiSelect;
            Dozen['three'].alpha = 0;
            Dozen['three'].width = 210;
            Dozen['three'].height = 50;
            Dozen['three'].first = 8;
            Dozen['three'].last = 12;
            Dozen['three'].inputEnabled = true;
            Dozen['three'].events.onInputUp.add(this.cellClick, this);
            Dozen['three'].events.onInputOver.add(this.cellOver, this);
            Dozen['three'].events.onInputOut.add(this.cellOut, this);

            Column['one'] = tableGroup.create(table.x + 685, table.y + 195, 'cell_select');
            Column['one'].name = 'columnOne';
            Column['one'].bet_name = 'col1';
            Column['one'].bet_type = 'column';
            Column['one'].items = [0];
            Column['one'].type = betType.multiSelect;
            Column['one'].alpha = 0;
            Column['one'].width = 55;
            Column['one'].height = 95;
            Column['one'].first = 0;
            Column['one'].last = 12;
            Column['one'].colFirst = 0;
            Column['one'].colLast = 1;
            Column['one'].inputEnabled = true;
            Column['one'].events.onInputUp.add(this.cellClick, this);
            Column['one'].events.onInputOver.add(this.cellOver, this);
            Column['one'].events.onInputOut.add(this.cellOut, this);

            Column['two'] = tableGroup.create(table.x + 685, table.y + 100, 'cell_select');
            Column['two'].name = 'columnTwo';
            Column['two'].bet_name = 'col2';
            Column['two'].bet_type = 'column';
            Column['two'].items = [1];
            Column['two'].type = betType.multiSelect;
            Column['two'].alpha = 0;
            Column['two'].width = 55;
            Column['two'].height = 95;
            Column['two'].first = 0;
            Column['two'].last = 12;
            Column['two'].colFirst = 1;
            Column['two'].colLast = 2;
            Column['two'].inputEnabled = true;
            Column['two'].events.onInputUp.add(this.cellClick, this);
            Column['two'].events.onInputOver.add(this.cellOver, this);
            Column['two'].events.onInputOut.add(this.cellOut, this);

            Column['three'] = tableGroup.create(table.x + 685, table.y + 5, 'cell_select');
            Column['three'].name = 'columnThree';
            Column['three'].bet_name = 'col3';
            Column['three'].bet_type = 'column';
            Column['three'].type = betType.multiSelect;
            Column['three'].items = [2];
            Column['three'].alpha = 0;
            Column['three'].width = 55;
            Column['three'].height = 95;
            Column['three'].first = 0;
            Column['three'].last = 12;
            Column['three'].colFirst = 2;
            Column['three'].colLast = 3;
            Column['three'].inputEnabled = true;
            Column['three'].events.onInputUp.add(this.cellClick, this);
            Column['three'].events.onInputOver.add(this.cellOver, this);
            Column['three'].events.onInputOut.add(this.cellOut, this);


            Orphelins['low'] = tableGroup.create(table.x + 52, table.y + 345, 'cell_select');
            Orphelins['low'].name = 'low';
            Orphelins['low'].bet_name = 'first18';
            Orphelins['low'].bet_type = 'high_low';
            Orphelins['low'].items = ['low'];
            Orphelins['low'].type = betType.multiSelect;
            Orphelins['low'].width = 105;
            Orphelins['low'].height = 50;
            Orphelins['low'].first = 0;
            Orphelins['low'].last = 6;
            Orphelins['low'].alpha = 0;
            Orphelins['low'].inputEnabled = true;
            Orphelins['low'].events.onInputUp.add(this.cellClick, this);
            Orphelins['low'].events.onInputOver.add(this.cellOver, this);
            Orphelins['low'].events.onInputOut.add(this.cellOut, this);

            Orphelins['high'] = tableGroup.create(table.x + 577, table.y + 345, 'cell_select');
            Orphelins['high'].name = 'high';
            Orphelins['high'].bet_name = 'second18';
            Orphelins['high'].bet_type = 'high_low';
            Orphelins['high'].items = ['high'];
            Orphelins['high'].type = betType.multiSelect;
            Orphelins['high'].width = 105;
            Orphelins['high'].height = 50;
            Orphelins['high'].first = 6;
            Orphelins['high'].last = 12;
            Orphelins['high'].alpha = 0;
            Orphelins['high'].inputEnabled = true;
            Orphelins['high'].events.onInputUp.add(this.cellClick, this);
            Orphelins['high'].events.onInputOver.add(this.cellOver, this);
            Orphelins['high'].events.onInputOut.add(this.cellOut, this);

            Orphelins['even'] = tableGroup.create(table.x + 157, table.y + 345, 'cell_select');
            Orphelins['even'].name = 'even';
            Orphelins['even'].bet_name = 'even';
            Orphelins['even'].bet_type = 'evens_odds';
            Orphelins['even'].items = ['evens'];
            Orphelins['even'].type = betType.arrSelect;
            Orphelins['even'].alpha = 0;
            Orphelins['even'].width = 105;
            Orphelins['even'].height = 50;
            Orphelins['even'].numbers = evenNumberArr;
            Orphelins['even'].inputEnabled = true;
            Orphelins['even'].events.onInputUp.add(this.cellClick, this);
            Orphelins['even'].events.onInputOver.add(this.cellOver, this);
            Orphelins['even'].events.onInputOut.add(this.cellOut, this);

            Orphelins['odd'] = tableGroup.create(table.x + 472, table.y + 345, 'cell_select');
            Orphelins['odd'].name = 'odd';
            Orphelins['odd'].bet_name = 'odd';
            Orphelins['odd'].bet_type = 'evens_odds';
            Orphelins['odd'].items = ['odds'];
            Orphelins['odd'].type = betType.arrSelect;
            Orphelins['odd'].width = 105;
            Orphelins['odd'].height = 50;
            Orphelins['odd'].alpha = 0;
            Orphelins['odd'].numbers = oddNumberArr;
            Orphelins['odd'].inputEnabled = true;
            Orphelins['odd'].events.onInputUp.add(this.cellClick, this);
            Orphelins['odd'].events.onInputOver.add(this.cellOver, this);
            Orphelins['odd'].events.onInputOut.add(this.cellOut, this);

            Orphelins['black'] = tableGroup.create(table.x + 367, table.y + 345, 'cell_select');
            Orphelins['black'].name = 'black';
            Orphelins['black'].bet_name = 'black';
            Orphelins['black'].bet_type = 'color';
            Orphelins['black'].items = ['black'];
            Orphelins['black'].type = betType.arrSelect;
            Orphelins['black'].alpha = 0;
            Orphelins['black'].width = 105;
            Orphelins['black'].height = 50;
            Orphelins['black'].numbers = blackNumberArr;
            Orphelins['black'].inputEnabled = true;
            Orphelins['black'].events.onInputUp.add(this.cellClick, this);
            Orphelins['black'].events.onInputOut.add(this.cellOut, this);

            Orphelins['red'] = tableGroup.create(table.x + 262, table.y + 345, 'cell_select');
            Orphelins['red'].name = 'red';
            Orphelins['red'].bet_name = 'red';
            Orphelins['red'].bet_type = 'color';
            Orphelins['red'].items = ['red'];
            Orphelins['red'].type = betType.arrSelect;
            Orphelins['red'].alpha = 0;
            Orphelins['red'].width = 105;
            Orphelins['red'].height = 50;
            Orphelins['red'].numbers=redNumberArr;
            Orphelins['red'].inputEnabled = true;
            Orphelins['red'].events.onInputUp.add(this.cellClick, this);
            Orphelins['red'].events.onInputOut.add(this.cellOut, this);
        
            this.hideVideoBtn();
            setInterval(function () {
                self.changeGameSize();
            }, 1000);
            self.changeGameSize();
            self.ready = true;
            setTimeout(function () {
                self.getLimits();
                self.updateStatistics();
            }, 300);
             self.showMenu = function(element) {
                var self = this;
                isModalShow = true;
                if (menuGroup) {
                    this.hideMenu();
                } else {
                    modalBg = this.add.button(0, 0, "mainBtnBg", function () {
                        self.hideMenu();
                    }, this);
                    modalBg.height = 1334;
                    modalBg.width = 750;
                    modalBg.alpha = 0.5;
                    modalBg.priorityID = 0;
                    menuGroup = this.add.group();
                    menuGroup.add(modalBg);
                    bgGroup = this.add.group();
                    menuGroup.bgGroup = bgGroup;
                    menuGroup.add(bgGroup);
                    bgGroup.alpha = 0;
                    menuBg = this.add.sprite(20, 150, 'menuBg');
                    menuBg.width = 300;
                    menuBg.height = 550;
                    menuBg.alpha = 0.85;
                    bgGroup.add(menuBg);

                    function createMenuItem(config,callback) {
                        var btn = self.add.button(config.x, config.y, "modalBg", function () {
                            self.hideMenu(null, function () {
                                if (callback && !config.disabled)
                                  callback();
                            });
                        }, this);
                        btn.height = 90;
                        btn.width = menuBg.width;
                        btn.alpha = 0;
                        btn.priorityID = 0;
                        var text= createTextLbl(self, {
                            text:config.text,
                            x: config.x + menuBg.width / 2,
                            y: config.y + 30,
                            font: "ProximaNova",
                            size: 33,
                            centered: true,
                            color: "#fff",
                            maxHeight: 90,
                            maxWidth: 270
                        });
                        if (config.disabled) {
                            text.alpha = 0.4;
                            btn.clicked = false;
                            btn.inputEnabled = false;
                        }
                        bgGroup.add(btn);
                        bgGroup.add(text);
                    }
                    createMenuItem({ x: menuBg.x, y: menuBg.y, text: $.client.getLocalizedString('Home', true) }, function() {
                         $.client.toHome();
                    });
                    createMenuItem({ x: menuBg.x, y: menuBg.y + 90, text: $.client.getLocalizedString('History', true) }, function () {
                        self.showHistory();
                    });
                    createMenuItem({ x: menuBg.x, y: menuBg.y + 180, text: $.client.getLocalizedString('Limits', true) }, function () {
                        self.showLimits();
                    });
                    createMenuItem({ x: menuBg.x, y: menuBg.y + 270, text: $.client.getLocalizedString('Statistics', true) }, function () {
                        self.showStatisticData();
                    });
                    createMenuItem({
                        x: menuBg.x,
                        y: menuBg.y + 355,
                        text: $.client.getLocalizedString('Provably fair', true),
                        disabled: !($.client.UserData.Features && $.client.UserData.Features.provably_fair)
                    }, function () {
                        $.client.showProvablyFair();
                    });
                    createMenuItem({
                        x: menuBg.x,
                        y: menuBg.y + 450,
                        text: $.client.getLocalizedString('Rules', true),
                        disabled: !($.client.UserData.Features && $.client.UserData.Features.rules)
                    }, function () {
                        $.client.showRules();
                    });
                    game.add.tween(bgGroup).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true);
                }
            },
            self.hideMenu = function(element, callback) {
                if (menuGroup) {
                    isModalShow = false;
                    var tween = game.add.tween(menuGroup.bgGroup).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true);
                    tween.onComplete.add(function() {
                        menuGroup.destroy();
                        menuGroup = null;
                        if (callback)
                            callback();
                    }, this);
                }
            };
             self.showVideo = function (show) {
            if (!_videoFlagShow && !isModalShow) {
                $('.portrait_video').fadeIn(500);
                game.add.tween(wheelGroup).to({ alpha: 0 }, 250, Phaser.Easing.Linear.None, true);
                _videoFlagShow = true;
                $.client.enableVideo(true);
            }
        };
         self.hideVideo = function (element) {
             if (!game.state.states.MainMenu.videoDisabled) {
                 _videoFlagShow = false;
                 $.client.enableVideo(false);
             }
            $('.portrait_video').fadeOut(500, function () {
                videoGroup.destroy();
            });
            game.add.tween(wheelGroup).to({ alpha: 1 }, 250, Phaser.Easing.Linear.None, true);
        };
        self.showWinner=function (winAmount) {
            var self = this;
            headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
            MessageDispatcher.betHistory[MessageDispatcher.betHistory.length - 1].winAmount = parseFloat(winAmount).toFixed(2);
            function showScreen() {
                self.winnerGroup = self.add.group();
                self.winnerGroup.alpha = 0;
                var modalBg = self.add.button(0, 0, "modalBg", function() {
                    hideScreen();
                }, this);
                modalBg.alpha = 0.5;
                modalBg.height = GAME_HEIGHT;
                modalBg.width = GAME_WIDTH;
                self.winnerGroup.add(modalBg);
                var winnerBg = self.winnerGroup.create(GAME_WIDTH / 2 - GAME_WIDTH / 4, GAME_HEIGHT / 2 - GAME_HEIGHT / 8, 'winnerBg');
                winnerBg.width = GAME_WIDTH / 2;
                winnerBg.height = GAME_HEIGHT / 4;
                self.winnerGroup.add(winnerBg);
                var titleText = createTextLbl(self, {
                    text: $.client.getLocalizedString("You've won", true),
                    x: winnerBg.x + winnerBg.width / 2,
                    y: winnerBg.y + 35,
                    font: "ProximaNova",
                    size: 55,
                    style: "bold",
                    centered: true,
                    color: "#000",
                    maxHeight: 60,
                    maxWidth: GAME_WIDTH / 4
                });
                titleText.setShadow(2, 2, 'rgba(255,255,255,0.5)', 5);
                self.winnerGroup.add(titleText);
                self.winnerGroup.amountText = createTextLbl(self, {
                    text: $.client.UserData.CurrencySign + (winAmount > 99999 ? kFormater(winAmount) :parseFloat(winAmount).toFixed(2)),
                    x: winnerBg.x + winnerBg.width / 2,
                    y: winnerBg.y + winnerBg.height / 2,
                    font: "ProximaNova",
                    size: 60,
                    style: "bold",
                    centered: true,
                    color: "#e4a345",
                    maxHeight: 60,
                    maxWidth: GAME_WIDTH / 4
                });
                self.winnerGroup.amountText.setShadow(2, 2, 'rgba(255,255,255,0.5)', 5);
                self.winnerGroup.add(self.winnerGroup.amountText);
                game.add.tween(self.winnerGroup).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
                setTimeout(function () {
                    hideScreen();
                }, 3000);
            }

            function hideScreen() {
                var tween = game.add.tween(self.winnerGroup).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(function () {
                    self.winnerGroup.destroy();
                    self.winnerGroup=null;
                }, this);
            }

            if (self.winnerGroup) {
                self.winnerGroup.amountText.setTitle($.client.UserData.CurrencySign + parseFloat(winAmount).toFixed(2));
            } else {
                showScreen();
            }
        };
        self.changeStatus = function (text, statusIndex, showModal, timeout) {
            var tDiff = new Date(new Date().getTime() - lastChangeStatus).getTime() / 1000;
            var self = this;
            if (timeout > 0) {
                if (self.previousState)
                setTimeout(function () {
                    self.changeStatus(self.previousState.text, self.previousState.statusIndex, self.previousState.showModal);
                }, timeout);
            } else {
                self.previousState = { text: text, statusIndex: statusIndex, showModal: false };
            }
            lastChangeStatus = new Date().getTime();
            if (infoText != undefined) {
                if (tDiff < 1.5 && self.previousStatusIndex != statusIndex) {
                    setTimeout(function () {
                        self.changeStatus(text, statusIndex);
                    }, 1600);
                } else {
                    self.previousStatusIndex = statusIndex;
                    infoText.setTitle(text.toUpperCase());
                    tableStatus.loadTexture('statusBg', statusIndex);
                }
            }

            function showText(txt) {
                statusGroup.removeAll();
                bg = self.add.group();
                statusGroup.add(bg);
                modalBg = self.add.button(0, 0, "modalBg", null, this);
                modalBg.height = 1334;
                modalBg.width = 750;
                modalBg.alpha = 0;
                textBg = self.add.button(0, 375, "modalBg", null, this);
                textBg.height = 0;
                bg.add(modalBg);
                bg.add(textBg);
                var text = self.add.text(GAME_WIDTH/2, 375, txt.toUpperCase(), {
                    font: "2px ProximaNova",
                    fill: "#fff"
                });
                text.anchor.x = Math.round(text.width * 0.5) / text.width;
                bg.add(text);
                game.add.tween(modalBg).to({ alpha: 0.8 }, 400, Phaser.Easing.Linear.None, true);
                game.add.tween(textBg).to({ y: 325 }, 600, Phaser.Easing.Linear.None, true);
                game.add.tween(textBg).to({ height: 100 }, 600, Phaser.Easing.Linear.None, true);
                self.add.tween(text).to({ fontSize: 40 }, 600, Phaser.Easing.Linear.None, true);
                self.add.tween(text).to({ y: 350 }, 600, Phaser.Easing.Linear.None, true);
                setTimeout(function () {
                    game.add.tween(modalBg).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true);
                    game.add.tween(textBg).to({ y: 375 }, 600, Phaser.Easing.Linear.None, true);
                    game.add.tween(text).to({ fontSize: 2 }, 600, Phaser.Easing.Linear.None, true);
                    self.add.tween(text).to({ y: 375 }, 600, Phaser.Easing.Linear.None, true);
                    var tween = game.add.tween(textBg).to({ height: 0 }, 600, Phaser.Easing.Linear.None, true);
                    tween.onComplete.add(function () {
                        statusGroup.removeAll();
                        bg.destroy();
                    }, this);
                }, 3000);
            }

            if (showModal && !_videoFlagShow)
                showText(text);
        };
        self.showHistory = function (element) {
            var self = this;
            var statTitleText, modalBg,cancelBtn, winLbl,betLbl;
            if (!isModalShow) {
                if (_videoFlagShow) {
                    self.hideVideo();
                }
                isModalShow = true;
                modalBg = this.add.button(0, 0, "modalBg", this.closeHistoryPopup, this);
                modalBg.height = GAME_HEIGHT;
                modalBg.priorityID = 0;
                modalBg.useHandCursor = false;
                historyPopup = this.add.group();
                historyPopup.clicked = false;;
                historyPopup.add(modalBg);
                var historyBox = this.add.sprite(125, 200, 'historyBg');
                historyBox.height=780;
                historyBox.width=500;
                historyBox.inputEnabled = true;
                historyBox.priorityID = 1;
                historyPopup.add(historyBox);
                var lostBox = this.add.sprite(175, 900, 'buttonsBg',0);
                lostBox.height = 60;
                lostBox.width = 400;
                historyPopup.add(lostBox);
                var totalLost = createTextLbl(self, {
                    text: $.client.getLocalizedString("Total lost", true).toUpperCase(),
                    x: 250,
                    y: 915,
                    font: "ProximaNova",
                    size: 30,
                    color: "#fff",
                    centered: false,
                    maxHeight: 75,
                    maxWidth: 200
                });
                var totalLostVal = createTextLbl(self, {
                    text: $.client.UserData.CurrencySign + (TOTAL_LOST > 99999 ? kFormater(TOTAL_LOST) : parseFloat(TOTAL_LOST).toFixed(2)),
                    x: totalLost.x + totalLost.width + 25,
                    y: 915,
                    font: "ProximaNova",
                    size: 30,
                    color: "#fff",
                    centered: false,
                    maxHeight: 30,
                    maxWidth: 100
                });
                historyPopup.addChild(totalLost);
                historyPopup.addChild(totalLostVal);
                statTitleText = createTextLbl(self, {
                    text: $.client.getLocalizedString('History', true),
                    x: 375,
                    y: 214,
                    font: "ProximaNova",
                    size: 34,
                    color: "#fff",
                    centered: true,
                    maxHeight: 40,
                    maxWidth: 140
                });
                betLbl = createTextLbl(self, {
                    text: $.client.getLocalizedString('Bet', true).toUpperCase(),
                    x: 355,
                    y: 280,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: true,
                    maxHeight: 65,
                    maxWidth: 140
                });
                winLbl = createTextLbl(self, {
                    text: $.client.getLocalizedString('TEXT_WIN', true).toUpperCase(),
                    x: 500,
                    y: 280,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: true,
                    maxHeight: 65,
                    maxWidth: 100
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
                    numText = self.add.text(numBg.x + 24, numBg.y + 11, numTextVal, { font: "25px ProximaNova", fill: color, align: "center" });
                    numText.anchor.x = Math.round(numText.width * 0.5) / numText.width;

                    historyPopup.addChild(numBg);
                    historyPopup.addChild(numText);
                    var betAmount = item.betAmount % 1 == 0 ? parseFloat(item.betAmount).toFixed(0) : parseFloat(item.betAmount).toFixed(2);
                    betAmount = betAmount > 9999 ? kFormater(betAmount) : betAmount;
                    betText = self.add.text(posX + 170, posY + 11, $.client.UserData.CurrencySign + betAmount, { font: "25px ProximaNova", fill: "#fff", align: "center" });
                    betText.anchor.x = Math.round(betText.width * 0.5) / betText.width;
                    historyPopup.addChild(betText);
                    var winAmount = item.winAmount % 1 == 0 ? parseFloat(item.winAmount).toFixed(0) : parseFloat(item.winAmount).toFixed(2);
                    winAmount = winAmount > 9999 ? kFormater(winAmount) : winAmount;
                    winText = self.add.text(posX + 310, posY + 11, $.client.UserData.CurrencySign + winAmount, { font: "25px ProximaNova", fill: "#fff", align: "center" });
                    winText.anchor.x = Math.round(winText.width * 0.5) / winText.width;
                    historyPopup.addChild(winText);
                }
                var k = 0;
                for (var i = MessageDispatcher.betHistory.length - 1; i >= 0; i--) {
                    showRow(MessageDispatcher.betHistory[i],190, 325 + k * 56);
                    k++;
                }
                tableGroup.setAll('inputEnabled', false);
                buttonGroup.setAll('clicked', false);
            }
        };
        self.showStatisticData= function(element){
            var ststs, canselBtn;
            var self = this;   
            var statTitleText, coldNumText, hotNumText, colorText, evensOddsText,
            highLowText, dozenText, columnText,modalBg, cancelBtn, cancelBtnText;    
            if(!isModalShow){
                if (this._statData != undefined) {
                    ststs = this._statData;
                    isModalShow = true;
                    self.statShow = true;
                    statPopup = this.add.group();
                    modalBg = this.add.button(0, 0, "modalBg", this.closeStatPopup, this);
                    modalBg.height = 1334;
                    modalBg.priorityID = 0;
                    modalBg.useHandCursor = false;
                    statPopup.add(modalBg);
                    var statBox = this.add.sprite(15, 200, 'statBg');
                    statBox.width = 720;
                    statBox.height = 720;
                    statBox.inputEnabled = true;
                    statBox.priorityID = 1;
                    statPopup.add(statBox);
                    var statData = this.add.group();

                    statPopup.addChild(statData);
              
                    statTitleText = createTextLbl(self, {
                        text: $.client.getLocalizedString('Statistics', true),
                        x: 375,
                        y: 210,
                        font: "ProximaNova",
                        size: 34,
                        color: "#fff",
                        centered: true,
                        maxHeight: 90,
                        maxWidth: 350
                    });
                    statData.addChild(statTitleText);

                    coldNumText = createTextLbl(self, {
                        text: $.client.getLocalizedString('COLD NUMBERS', true).toUpperCase(),
                        x: 35,
                        y: 305,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: false,
                        maxHeight: 70,
                        maxWidth: 250
                    });
                    hotNumText = createTextLbl(self, {
                        text: $.client.getLocalizedString('HOT NUMBERS', true).toUpperCase(),
                        x: 35,
                        y: 390,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: false,
                        maxHeight: 70,
                        maxWidth: 250
                    });
                    colorText = createTextLbl(self, {
                        text: $.client.getLocalizedString('COLORS', true).toUpperCase(),
                        x: 35,
                        y: 485,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: false,
                        maxHeight: 70,
                        maxWidth: 250
                    });         
                    evensOddsText = createTextLbl(self, {
                        text: $.client.getLocalizedString('EVEN/ODDS', true).toUpperCase(),
                        x: 35,
                        y: 575,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: false,
                        maxHeight: 70,
                        maxWidth: 250
                    });
                    highLowText = createTextLbl(self, {
                        text: $.client.getLocalizedString('HIGH/LOW', true).toUpperCase(),
                        x: 35,
                        y: 665,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: false,
                        maxHeight: 70,
                        maxWidth: 250
                    });
                    dozenText = createTextLbl(self, {
                        text: $.client.getLocalizedString('DOZENS', true).toUpperCase(),
                        x: 35,
                        y: 755,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: false,
                        maxHeight: 70,
                        maxWidth: 250
                    });
                    columnText = createTextLbl(self, {
                        text: $.client.getLocalizedString('COLUMNS', true).toUpperCase(),
                        x: 35,
                        y: 845,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: false,
                        maxHeight: 70,
                        maxWidth: 250
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
                        numBg = self.add.sprite(posX, posY, 'numberBg');
                        numBg.scale.set(1.3);
                        numText = self.add.text(numBg.x + 30, numBg.y + 15, numTextVal, { font: "27px ProximaNova", fill: color, align: "center" });
                        numText.anchor.x = Math.round(numText.width * 0.5) / numText.width;

                        numTextDesc = self.add.text(numBg.x + numBg.width - 22, numBg.y + 40, desc, { font: "18px ProximaNova", fill: "#b0b0b0", align: "right" });
                        statData.addChild(numBg);
                        statData.addChild(numText);
                        statData.addChild(numTextDesc);

                    }         

                    function showSectionNumber(posX, posY, label, value, spriteFrame){
                        var statChartFirst, statChartSecond, statChartThird,
                            statChartFirstText, statChartSecondText, statChartThirdText
                        ;

                        statChartFirst = self.add.sprite(posX, posY, 'statChartBg', spriteFrame[0]);
                        statChartFirst.width = value[0] * 4.1;
                        statChartFirstText = createTextLbl(self, {
                            text: '',
                            x: statChartFirst.x + statChartFirst.width / 2,
                            y: statChartFirst.y + 10,
                            font: "ProximaNova",
                            size: 24,
                            color: "#ffffff",
                            centered: true,
                            maxHeight: 20,
                            maxWidth: statChartFirst.width - (value[0] > 20 ? 5 : 0)
                        });
                        if(value[0] > 20){                    
                            statChartFirstText.setTitle(label[0] + " - " + Math.round(value[0]) + "%");
                        }

                        statData.addChild(statChartFirst);
                        statData.addChild(statChartFirstText);

                        statChartSecond = self.add.sprite(statChartFirst.x+statChartFirst.width, posY, 'statChartBg', spriteFrame[1]);
                        statChartSecond.width = value[1] * 4.4;
                        statChartSecondText = createTextLbl(self, {
                            text: '',
                            x: statChartSecond.x + statChartSecond.width / 2,
                            y: statChartSecond.y + 10,
                            font: "ProximaNova",
                            size: 24,
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

                        statChartThird = self.add.sprite(statChartSecond.x+statChartSecond.width, posY, 'statChartBg', spriteFrame[2]);                
                        statChartThird.width = value[2] * 4.1;
                        statChartThirdText = createTextLbl(self, {
                            text: '',
                            x: statChartThird.x + statChartThird.width / 2,
                            y: statChartThird.y + 10,
                            font: "ProximaNova",
                            size: 24,
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

                    for (var i = 4; i < ststs.coldNumbers.length; i++) {
                        showNumber(ststs.coldNumbers[i].number,ststs.coldNumbers[i].lastHit, coldNumText.x + 257 + (i - 4) * 71, coldNumText.y - 15);
                    }

                    for (var i = 4; i < ststs.hotNumbers.length; i++) {
                        showNumber(ststs.hotNumbers[i].number, ststs.hotNumbers[i].count, hotNumText.x + 257 + (i - 4) * 71, hotNumText.y - 15);
                    }

                    showSectionNumber(colorText.x+260, colorText.y-15,                 
                        [$.client.getLocalizedString("RED", true).toUpperCase(), $.client.getLocalizedString("GREEN", true).toUpperCase(), $.client.getLocalizedString("BLACK", true).toUpperCase()],
                        [ststs.colors.red, ststs.colors.zero, ststs.colors.black],
                        [0,1,3]
                    );

                    showSectionNumber(evensOddsText.x+260, evensOddsText.y-15,                 
                        [$.client.getLocalizedString("EVEN", true).toUpperCase(), $.client.getLocalizedString("ZERO", true).toUpperCase(), $.client.getLocalizedString("ODDS", true).toUpperCase()],
                        [ststs.evenOdds.even, ststs.evenOdds.zero, ststs.evenOdds.odds],
                        [2,1,2]
                    );

                    showSectionNumber(highLowText.x+260, highLowText.y-15,                 
                        [$.client.getLocalizedString("HIGH", true).toUpperCase(), $.client.getLocalizedString("ZERO", true).toUpperCase(), $.client.getLocalizedString("LOW", true).toUpperCase()],
                        [ststs.highLow.high, ststs.highLow.zero, ststs.highLow.low],
                        [2,2,2]
                    );

                    showSectionNumber(dozenText.x+260, dozenText.y-15, 
                        ["1-12","13-24","25-36"],
                        [ststs.dozens.first, ststs.dozens.second, ststs.dozens.third],                
                        [2,2,2]
                    );
                    showSectionNumber(columnText.x+260, columnText.y-15, 
                        ["1-34","2-35","3-36"],
                        [ststs.columns.first, ststs.columns.second, ststs.columns.third],
                        [2,2,2]
                    );   
        
                    tableGroup.setAll('inputEnabled', false);
                    buttonGroup.setAll('clicked', false);   

                }
            }
        };
        self.showLimitsSelector = function () {
            var limitTitleText;
            var modalBg, cancelBtn;
            var self = this;
            if (!isModalShow) {
                if (limits.length != 0) {
                    isModalShow = true;
                    self.hideVideo();
                    gameBtnGroup.setAll('clicked', false);
                    modalBg = this.add.sprite(0, 0, 'modalBg');
                    modalBg.priorityID = 10;
                    limitSelectionPopup = this.add.group();
                    modalBg.height = 1334;
                    modalBg.width = 750;
                    limitSelectionPopup.add(modalBg);
                    var limitBox = this.add.sprite(25, 300, 'limitsModalBg');
                    limitSelectionPopup.add(limitBox);
                    limitBox.width = 700;
                    limitBox.height = 700;
                    limitTitleText = createTextLbl(self, {
                        text: $.client.getLocalizedString('Please select limits', true),
                        x: 375,
                        y: 307,
                        font: "ProximaNova",
                        size: 38,
                        color: "#fff",
                        centered: true,
                        maxHeight: 90,
                        maxWidth: 500
                    });
                    limitSelectionPopup.addChild(limitTitleText);
                    okBtn = this.add.button(40, 920, 'buttonsBg', function () {
                        selectedLimits = selected
                        self.confirmLimit();
                    }, this,0);
                    okBtn.input.useHandCursor = true;
                    okBtn.inputEnabled = true;
                    okBtn.input.priorityID = 1;
                    okBtn.clicked = true;
                    okBtn.width = 320;
                    okBtn.height = 60;
                    okBtn.text = createTextLbl(self, {
                        text: $.client.getLocalizedString('Ok', true).toUpperCase(),
                        x: okBtn.x + 160,
                        y: okBtn.y + 12,
                        font: "ProximaNova",
                        size: 34,
                        color: "#fff",
                        centered: true,
                        maxHeight: 50,
                        maxWidth: 300
                    });
                    limitSelectionPopup.add(okBtn);
                    limitSelectionPopup.add(okBtn.text);

                    cancelBtn = this.add.button(380, 920, 'buttonsBg', this.closeLimitSelectionPopup, this);
                    cancelBtn.input.useHandCursor = true;
                    cancelBtn.clicked = true;
                    cancelBtn.inputEnabled = true;
                    cancelBtn.input.priorityID = 1;
                    cancelBtn.width = 320;
                    cancelBtn.height = 60;
                    cancelBtn.text = createTextLbl(self, {
                        text: $.client.getLocalizedString('Cancel', true).toUpperCase(),
                        x: cancelBtn.x + 160,
                        y: cancelBtn.y + 12,
                        font: "ProximaNova",
                        size: 34,
                        color: "#fff",
                        centered: true,
                        maxHeight: 50,
                        maxWidth: 300
                    });
                    limitSelectionPopup.add(cancelBtn);
                    limitSelectionPopup.add(cancelBtn.text);
                        limitSelectionPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Limit', true).toUpperCase(),
                        x: 85,
                        y: 365,
                        font: "ProximaNova",
                        size: 24,
                        color: "#878787",
                        style: "bold",
                        centered: true,
                        maxHeight: 90,
                        maxWidth: 150
                    }));
                    limitSelectionPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Table', true).toUpperCase(),
                        x: 180,
                        y: 365,
                        font: "ProximaNova",
                        size: 24,
                        color: "#878787",
                        style: "bold",
                        centered: true,
                        maxHeight: 90,
                        maxWidth: 150
                    }));
                    limitSelectionPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Straight', true).toUpperCase(),
                        x: 300,
                        y: 365,
                        font: "ProximaNova",
                        size: 24,
                        color: "#878787",
                        style: "bold",
                        centered: true,
                        maxHeight: 90,
                        maxWidth: 150
                    }));
                    limitSelectionPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Column/Dozen', true).toUpperCase(),
                        x: 460,
                        y: 365,
                        font: "ProximaNova",
                        size: 24,
                        color: "#878787",
                        style: "bold",
                        centered: true,
                        maxHeight: 90,
                        maxWidth: 170
                    }));
                    limitSelectionPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Fifty/Fifty', true).toUpperCase(),
                        x: 630,
                        y: 365,
                        font: "ProximaNova",
                        size: 24,
                        color: "#878787",
                        style: "bold",
                        centered: true,
                        maxHeight: 90,
                        maxWidth: 150
                    }));
                    var selected = selectedLimits;
                    var cells = [];

                    function showLimitRow(x, y, limit, id) {
                        var cell = self.add.button(x + 25, y - 12, "buttonsBg", function () {
                            for (var cl in cells) {
                                cells[cl].alpha = 0;
                            }
                            cell.alpha = 1;
                            selected = limits[id];
                        }, this);
                        cells.push(cell);
                        cell.alpha = 0;
                        if (selectedLimits && selectedLimits.Title == limit.Title) {
                            cell.alpha = 1;
                        }
                        cell.width = 650;
                        cell.height = 50;
                        limitSelectionPopup.add(cell);
                        var nameLbl = createTextLbl(self, {
                            text: limit.Title.toUpperCase(),
                            x: x + 60,
                            y: y,
                            font: "ProximaNova",
                            size: 24,
                            color: "#fff",
                            centered: true,
                            maxHeight: 15,
                            maxWidth: 100
                        });
                        limitSelectionPopup.addChild(nameLbl);
                        var tMin = parseFloat(limit.Table.Min) % 1 == 0 ? parseFloat(limit.Table.Min).toFixed(0) : limit.Table.Min.replace(',', '.');
                        var tMax = parseFloat(limit.Table.Max) % 1 == 0 ? parseFloat(limit.Table.Max).toFixed(0) : limit.Table.Max.replace(',', '.');
                        tMin = tMin > 9999 ? kFormater(tMin) : tMin;
                        tMax = tMax > 9999 ? kFormater(tMax) : tMax;
                        var tText = tMin + '/' + tMax;
                        var tableLbl = createTextLbl(self, {
                            text: tText,
                            x: x + 160,
                            y: y,
                            font: "ProximaNova",
                            size: 24,
                            color: "#fff",
                            centered: true,
                            maxHeight: 15,
                            maxWidth: 110
                        });

                        limitSelectionPopup.addChild(tableLbl);

                        var sMin = parseFloat(limit.Straight.Min) % 1 == 0 ? parseFloat(limit.Straight.Min).toFixed(0) : limit.Straight.Min.replace(',', '.');
                        var sMax = parseFloat(limit.Straight.Max) % 1 == 0 ? parseFloat(limit.Straight.Max).toFixed(0) : limit.Straight.Max.replace(',', '.');
                        sMin = sMin > 9999 ? kFormater(sMin) : sMin;
                        sMax = sMax > 9999 ? kFormater(sMax) : sMax;
                        var sText = sMin + '/' + sMax;
                        var straightLbl = createTextLbl(self, {
                            text: sText,
                            x: x + 280,
                            y: y,
                            font: "ProximaNova",
                            size: 24,
                            color: "#fff",
                            centered: true,
                            maxHeight: 15,
                            maxWidth: 120
                        });

                        limitSelectionPopup.addChild(straightLbl);

                        var cdMin = parseFloat(limit.Column_Dozen.Min) % 1 == 0 ? parseFloat(limit.Column_Dozen.Min).toFixed(0) : limit.Column_Dozen.Min.replace(',', '.');
                        var cdMax = parseFloat(limit.Column_Dozen.Max) % 1 == 0 ? parseFloat(limit.Column_Dozen.Max).toFixed(0) : limit.Column_Dozen.Max.replace(',', '.');
                        cdMin = cdMin > 9999 ? kFormater(cdMin) : cdMin;
                        cdMax = cdMax > 9999 ? kFormater(cdMax) : cdMax;
                        ffMin = ffMin > 9999 ? kFormater(ffMin) : ffMin;
                        ffMax = ffMax > 9999 ? kFormater(ffMax) : ffMax;
                        var cdText = cdMin + '/' + cdMax;
                        var cdLbl = createTextLbl(self, {
                            text: cdText,
                            x: x + 430,
                            y: y,
                            font: "ProximaNova",
                            size: 24,
                            color: "#fff",
                            centered: true,
                            maxHeight: 15,
                            maxWidth: 120
                        });

                        limitSelectionPopup.addChild(cdLbl);

                        var ffMin = parseFloat(limit.Fifty_Fifty.Min) % 1 == 0 ? parseFloat(limit.Fifty_Fifty.Min).toFixed(0) : limit.Fifty_Fifty.Min.replace(',', '.');
                        var ffMax = parseFloat(limit.Fifty_Fifty.Max) % 1 == 0 ? parseFloat(limit.Fifty_Fifty.Max).toFixed(0) : limit.Fifty_Fifty.Max.replace(',', '.');
                        var ffText = ffMin + '/' + ffMax;
                        var ffLbl = createTextLbl(self, {
                            text: ffText,
                            x: x + 600,
                            y: y,
                            font: "ProximaNova",
                            size: 24,
                            color: "#fff",
                            centered: true,
                            maxHeight: 15,
                            maxWidth: 120
                        });
                        limitSelectionPopup.addChild(ffLbl);

                    }

                    for (var i in limits) {
                        showLimitRow(25, i * 50 + 430, limits[i], i);
                    }

                }
            }
        };
        self.showLimits = function () {
            var limitTitleText;
            var modalBg, cancelBtn;
            var self = this;
            if (!isModalShow) {
                if (limits.length != 0) {
                    if (_videoFlagShow) {
                        self.hideVideo();
                    }
                    isModalShow = true;
                    limitPopup = this.add.group();
                    modalBg = this.add.button(0, 0, "modalBg", this.closelimitPopup, this);
                    modalBg.priorityID = 0;
                    modalBg.useHandCursor = false;
                    limitPopup.add(modalBg);
                    modalBg.height = GAME_HEIGHT;
                    var limitBox = this.add.sprite(15, 185, 'limitsBg');
                    limitBox.inputEnabled = true;
                    limitBox.priorityID = 1;
                    limitPopup.add(limitBox);
                    limitBox.width = 720;
                    limitBox.height = 870;
                    var changeBtn = this.add.button(30, 960, 'buttonsBg', function () {
                        self.closelimitPopup();
                        self.showLimitsSelector();
                    }, this,0);
                    limitPopup.add(changeBtn);
                    changeBtn.height = 60;
                    changeBtn.width = 320;
                    var changeText = createTextLbl(self, {
                        text: $.client.getLocalizedString('Change', true).toUpperCase(),
                        x: 200,
                        y: 975,
                        font: "ProximaNova",
                        size: 28,
                        color: "#fff",
                        centered: true,
                        maxHeight: 65,
                        maxWidth: 130
                    });

                    limitPopup.add(changeText);
                    changeBtn.clicked = true;
                    changeBtn.input.useHandCursor = true;

                    if ($.client.UserData.Features && $.client.UserData.Features.rules) {
                    var rulesBtn = this.add.button(390, 960, 'buttonsBg', function () {
                            $.client.showRules();
                        }, this,0);
                        limitPopup.add(rulesBtn);
                        rulesBtn.height = 60;
                        rulesBtn.width = 320;
                        var rulesText = createTextLbl(self, {
                            text: $.client.getLocalizedString('Rules', true).toUpperCase(),
                            x: 560,
                            y: 975,
                            font: "ProximaNova",
                            size: 28,
                            color: "#fff",
                            centered: true,
                            maxHeight: 65,
                            maxWidth: 130
                        });
                        limitPopup.add(rulesText);
                        rulesBtn.clicked = true;
                        rulesBtn.input.useHandCursor = true;
                   }
                    limitTitleText = createTextLbl(self, {
                        text: $.client.getLocalizedString('Limits', true),
                        x: 375,
                        y: 205,
                        font: "ProximaNova",
                        size: 34,
                        color: "#fff",
                        centered: true,
                        maxHeight: 80,
                        maxWidth: 200
                    });
                    limitPopup.addChild(limitTitleText);
                    limitPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Bet name', true).toUpperCase(),
                        x: 265,
                        y: 275,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: true,
                        maxHeight: 80,
                        maxWidth: 200
                    }));
                    limitPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Min bet', true).toUpperCase(),
                        x: 430,
                        y: 275,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: true,
                        maxHeight: 80,
                        maxWidth: 150
                    }));
                    limitPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Max bet', true).toUpperCase(),
                        x: 565,
                        y: 275,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: true,
                        maxHeight: 80,
                        maxWidth: 150
                    }));
                    limitPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Pays', true).toUpperCase(),
                        x: 685,
                        y: 275,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: true,
                        maxHeight: 80,
                        maxWidth: 100
                    }));
                    limitPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Inside bets', true).toUpperCase(),
                        x: 30,
                        y: 420,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: false,
                        maxHeight: 80,
                        maxWidth: 150
                    }));
                    limitPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Outside bets', true).toUpperCase(),
                        x: 30,
                        y: 725,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: false,
                        maxHeight: 80,
                        maxWidth: 150
                    }));

                    function showLimitRow(x, y, limit) {

                        limitPopup.addChild(createTextLbl(self, {
                            text: limit.name.toUpperCase(),
                            x: x - 10,
                            y: y,
                            font: "ProximaNova",
                            size: 30,
                            color: "#fff",
                            centered: false,
                            maxHeight: 40,
                            maxWidth: 170
                        }));
                        var min = limit.min.replace(',', '.')
                        min = parseFloat(min) % 1 == 0 ? parseFloat(min).toFixed(0) : min;
                        min = min > 9999 ? kFormater(min) : min;
                        var minLbl = limitPopup.addChild(self.add.text(x + 220, y, min, {
                            font: "30px ProximaNova",
                            fill: "#fff",
                            align: "center"
                        }));
                        minLbl.anchor.x = Math.round(minLbl.width * 0.5) / minLbl.width;
                        var max = limit.max.replace(',', '.')
                        max = parseFloat(max) % 1 == 0 ? parseFloat(max).toFixed(0) : max;
                        max = max > 9999 ? kFormater(max) : max;
                        var maxLbl = limitPopup.addChild(self.add.text(x + 345, y, max, {
                            font: "30px ProximaNova",
                            fill: "#fff",
                            align: "center"
                        }));
                        maxLbl.anchor.x = Math.round(maxLbl.width * 0.5) / maxLbl.width;
                        var rateLbl = limitPopup.addChild(self.add.text(x + 470, y, limit.winRateText, {
                            font: "30px ProximaNova",
                            fill: "#fff",
                            align: "center"
                        }));

                        rateLbl.anchor.x = Math.round(rateLbl.width * 0.5) / rateLbl.width;
                    }

                    showLimitRow(215, 320, {
                        name: $.client.getLocalizedString("Straight", true),
                        min: selectedLimits.Straight.Min,
                        max: selectedLimits.Straight.Max,
                        winRateText: "35:1"
                    });
                    showLimitRow(215, 365, {
                        name: $.client.getLocalizedString("Split", true),
                        min: selectedLimits.Split.Min,
                        max: selectedLimits.Split.Max,
                        winRateText: "17:1"
                    });
                   
                    showLimitRow(215, 410, {
                        name: $.client.getLocalizedString("Street", true),
                        min: selectedLimits.Street.Min,
                        max: selectedLimits.Street.Max,
                        winRateText: "11:1"
                    });
                    showLimitRow(215, 455, {
                        name: $.client.getLocalizedString("Corner", true),
                        min: selectedLimits.Corner.Min,
                        max: selectedLimits.Corner.Max,
                        winRateText: "8:1"
                    });
                    showLimitRow(215, 500, {
                        name: $.client.getLocalizedString("Sixline", true),
                        min: selectedLimits.Line.Min,
                        max: selectedLimits.Line.Max,
                        winRateText: "5:1"
                    });
                    showLimitRow(215, 545, {
                        name: $.client.getLocalizedString("First column", true),
                        min: selectedLimits.Column_Dozen.Min,
                        max: selectedLimits.Column_Dozen.Max,
                        winRateText: "2:1"
                    });
                    showLimitRow(215, 590, {
                        name: $.client.getLocalizedString("Second column", true),
                        min: selectedLimits.Column_Dozen.Min,
                        max: selectedLimits.Column_Dozen.Max,
                        winRateText: "2:1"
                    });
                    showLimitRow(215, 635, {
                        name: $.client.getLocalizedString("Third column", true),
                        min: selectedLimits.Column_Dozen.Min,
                        max: selectedLimits.Column_Dozen.Max,
                        winRateText: "2:1"
                    });
                    showLimitRow(215, 680, {
                        name: $.client.getLocalizedString("Dozens", true),
                        min: selectedLimits.Column_Dozen.Min,
                        max: selectedLimits.Column_Dozen.Max,
                        winRateText: "2:1"
                    });
                    showLimitRow(215, 725, {
                        name: $.client.getLocalizedString("Odd/Even", true),
                        min: selectedLimits.Fifty_Fifty.Min,
                        max: selectedLimits.Fifty_Fifty.Max,
                        winRateText: "1:1"
                    });
                    showLimitRow(215, 770, {
                        name: $.client.getLocalizedString("High/Low", true),
                        min: selectedLimits.Fifty_Fifty.Min,
                        max: selectedLimits.Fifty_Fifty.Max,
                        winRateText: "1:1"
                    });
                    showLimitRow(215, 815, {
                        name: $.client.getLocalizedString("Red/Black", true),
                        min: selectedLimits.Fifty_Fifty.Min,
                        max: selectedLimits.Fifty_Fifty.Max,
                        winRateText: "1:1"
                    });
                    showLimitRow(215, 860, {
                        name: $.client.getLocalizedString("Table", true),
                        min: selectedLimits.Table.Min,
                        max: selectedLimits.Table.Max,
                        winRateText: ""
                    });

                }
            }
        };
        self.createTimer = function (totalTime, endCallback, updateCallback) {
            var timer;
            timerSprite.totalTime = totalTime;
            timerSprite.time = totalTime;
            timerSprite.endCallback = endCallback;
            timerSprite.updateCallback = updateCallback;
            timerSprite.bg = frameGroup.create(20, 737, 'timer', 0);
            timerSprite.bg.scale.set(1.25);
            timerSprite.text = this.add.text(timerSprite.bg.x + 37, timerSprite.bg.y + 20, totalTime, {
                font: "bold 30px ProximaNova",
                fill: "#fff"
            });
            timerSprite.text.anchor.x = Math.round(timerSprite.text.width * 0.5) / timerSprite.text.width;
            frameGroup.add(timerSprite.text);

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
                    timerSprite.endCallback = null;
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
        };
        if (!self.wheel)
            self.wheel = self.showWheel();
        else if (game.state.states.MainMenu.videoDisabled) {
                videoBtn.clicked = false;
                videoBtn.alpha = 0;
                self.hideVideo();
            }

        if (MessageDispatcher.timer) {
            MessageDispatcher.timer = self.createTimer(MessageDispatcher.timer.time, MessageDispatcher.timer.endCallback, MessageDispatcher.timer.updateCallback)
        }
        if (_videoFlagShow) {
            if (!$.client.getVideoState()) {
                $.client.enableVideo(true);
            }
            $('.portrait_video').fadeIn(500);
            game.add.tween(wheelGroup).to({ alpha: 0 }, 250, Phaser.Easing.Linear.None, true);
            videoBtn.loadTexture('videoBtnV', 0);
        } else {
            $.client.enableVideo(false);
        }
    },
    initHorizontalLayout: function () {
        TABLE_WIDTH = 936,
        TABLE_HEIGHT = 405,
        DIB_WIDTH = 78,
        DIB_HEIGHT = 135,
        DIB_SPASE = 2.5,
        TABLE_ROWS = Math.floor(TABLE_WIDTH / DIB_WIDTH),
        TABLE_COLS = Math.floor(TABLE_HEIGHT / DIB_HEIGHT);
        var self = this;
        var bottomBetLabel, balansLabel, gameIdLabel, dateTimeLabel,
             limitBtn, statsBtn, historyBtn,
             chipsEl, table;

        var spriteXY, spriteX, spriteY;

        worldGroup = this.add.group();
        scrollGroup = this.add.group();
        gameBtnGroup = this.add.group();
        videoGroup = this.add.group();
        videoGroup = this.add.group();
        worldGroup.add(tableGroup);
        worldGroup.add(scrollGroup);
        this.scale.setUserScale(SCALE, SCALE);
        this.scale.refresh();
        tableGroup = this.add.group();
        chipsGroup = this.add.group();
        selectedChipsGroup = this.add.group();

        frameGroup = this.add.group();
        footerGroup = this.add.group();
        frenchGroup = this.add.group();
        limitGroup = this.add.group();
        topBarGroup = this.add.group();
        statusGroup = this.add.group();
        bottomBarGroup = this.add.group();

        worldGroup.add(frameGroup);
        worldGroup.add(tableGroup);
        scrollGroup.add(tableGroup);
        worldGroup.add(frenchGroup);
        worldGroup.add(footerGroup);
        scrollGroup.add(buttonGroup);

        worldGroup.add(buttonGroup);
        worldGroup.add(limitGroup);
        worldGroup.add(statusGroup);
        buttonGroup.priorityID = 3;
        if (!wheelGroup) {
            wheelGroup = this.add.group();
            wheelBg = this.add.sprite(0, 146, 'wheelBg');
            wheelGroup.add(wheelBg);
        }
        gameFrame = this.add.sprite(0, 0, 'gameFrameH');
        table = this.add.sprite(30, 90, 'tableH');
        table.width = 1150;
        table.height = 540;
        frameGroup.add(wheelGroup);
        frameGroup.add(gameFrame);
        frameGroup.add(table);
        tableGroup.add(selectedChipsGroup);
        frameGroup.add(tableGroup);
        frameGroup.add(bottomBarGroup);

        var name = USER_NAME ? USER_NAME.toUpperCase().length < 20 ? USER_NAME.toUpperCase() : USER_NAME.toUpperCase().substr(0, 20) + '...' : "";
        userNameText = this.add.text(30, 2255, name, {
            font: "27px ProximaNova",
            fill: "#fff"
        });
        bottomBarGroup.add(userNameText);
        balansLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_BALANCE", true).toUpperCase(),
            x: 30,
            y: 30,
            font: "ProximaNova",
            size: 27,
            color: "#fff",
            centered: false,
            maxHeight: 30,
            maxWidth: 150
        });
        bottomBarGroup.add(balansLabel);

        headerBalansInputVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + USER_BALANCE,
            x: balansLabel.x + balansLabel.width + 5,
            y:30,
            font: "ProximaNova",
            size: 27,
            color: "#fff",
            centered: false,
            maxHeight: 30,
            maxWidth: 150
        });
        bottomBarGroup.add(headerBalansInputVal);
        cashierBtn = this.add.button(gameFrame.width - 70, 2250, 'cashin', function () {
            $.client.cashier();
        }, this);
        cashierBtn.scale.set(0.7);
        cashierBtn.input.useHandCursor = true;
        cashierBtn.clicked = true;
        bottomBarGroup.add(cashierBtn);

        bottomBetLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_BET", true).toUpperCase(),
            x: 390,
            y: 30,
            font: "ProximaNova",
            size: 27,
            color: "#fff",
            centered: false,
            maxHeight: 30,
            maxWidth: 130
        });
        bottomBarGroup.add(bottomBetLabel);
        headerBetInputVal = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + '0',
            x: bottomBetLabel.x + bottomBetLabel.width + 10,
            y: 30,
            font: "ProximaNova",
            size: 27,
            color: "#fff",
            centered: false,
            maxHeight: 30,
            maxWidth: 150
        });
        bottomBarGroup.add(headerBetInputVal);

        tableStatus = this.add.sprite(920, 20, 'statusBg', 0);
        tableStatus.height = 50;
        tableStatus.width = 380;
        frameGroup.add(tableStatus);

        infoText = createTextLbl(self, {
            text: $.client.getLocalizedString("PLEASE WAIT FOR THE NEXT OPEN TABLE", true).toUpperCase(),
            x: 1110,
            y: 25,
            font: "ProximaNova",
            size: 37,
            color: "#fff",
            centered: true,
            maxHeight: 37,
            maxWidth: 380
        });
        frameGroup.add(infoText);

        repeatBetBtn = self.add.button(1226, 410, "mainBtnBg", function () {
            self.repeatBets();
        }, this);
        repeatBetBtn.height = 140;
        repeatBetBtn.width = 70;
        repeatBetBtn.alpha = 0;
        repeatBetBtn.priorityID = 0;
        repeatBetBtn.text = createTextLbl(self, {
            text: $.client.getLocalizedString('Repeat', true).toUpperCase(),
            x: 1246,
            y: 530,
            font: "ProximaNova",
            size: 31,
            color: "#fff",
            maxHeight: 90,
            maxWidth: 140
        });
        repeatBetBtn.text.angle = 270;
        gameBtnGroup.add(repeatBetBtn);
        gameBtnGroup.add(repeatBetBtn.text);

        buttonGroup.add(gameBtnGroup);

        cancelAllBetBtn = self.add.button(1226, 280, "mainBtnBg", function () {
            self.cancelAllBet();
        }, this);
        cancelAllBetBtn.height = 120;
        cancelAllBetBtn.width = 70;
        cancelAllBetBtn.alpha = 0;
        cancelAllBetBtn.priorityID = 0;
        cancelAllBetBtn.text = createTextLbl(self, {
            text: $.client.getLocalizedString('Clear', true).toUpperCase(),
            x: 1246,
            y: 390,
            font: "ProximaNova",
            size: 31,
            color: "#fff",
            maxHeight: 90,
            maxWidth: 120
        });
        cancelAllBetBtn.text.angle = 270;
        gameBtnGroup.add(cancelAllBetBtn);
        gameBtnGroup.add(cancelAllBetBtn.text);

        cancelLastBtn = self.add.button(1226, 170, "mainBtnBg", function () {
            self.cancelLastBet();
        }, this);
        cancelLastBtn.height = 100;
        cancelLastBtn.width = 70;
        cancelLastBtn.alpha = 0;
        cancelLastBtn.priorityID = 0;
        cancelLastBtn.text = createTextLbl(self, {
            text: $.client.getLocalizedString('Back', true).toUpperCase(),
            x: 1246,
            y: 260,
            font: "ProximaNova",
            size: 31,
            color: "#fff",
            maxHeight: 90,
            maxWidth: 120
        });
        cancelLastBtn.text.angle = 270;
        gameBtnGroup.add(cancelLastBtn);
        gameBtnGroup.add(cancelLastBtn.text);
 

        menuBtn = this.add.button(1230, 90, 'menuBtn', function () {
            self.showMenu();
        }, this, 0);
        menuBtn.input.useHandCursor = true;
        menuBtn.scale.set(0.9);
        menuBtn.clicked = true;
        gameBtnGroup.add(menuBtn);
        videoBtn = this.add.button(1140, 560, 'videoBtnH', function () {
            self.showVideo();
        });
        videoBtn.input.useHandCursor = true;
        videoBtn.scale.set(0.75);
        videoBtn.clicked = true;
        gameBtnGroup.add(videoBtn);
        dateTimeLabel = createTextLbl(self, {
            text: $.DateFormat(MessageDispatcher.serverTime.toString(), "yyyy-MM-dd | HH:mm:ss"),
            x: 740,
            y: 10,
            font: "ProximaNova",
            size: 34,
            color: "#808080",
            centered: true,
            maxHeight: 40,
            maxWidth: 250
        });
        gameIdLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("Game Id:", true) + " " + MessageDispatcher.gameId,
            x: 740,
            y: 40,
            font: "ProximaNova",
            size: 34,
            color: "#808080",
            centered: true,
            maxHeight: 40,
            maxWidth: 250
        });

        if (self.timeInterval)
            clearInterval(self.timeInterval);
        self.timeInterval = setInterval(function () {
                gameIdLabel.setTitle($.client.getLocalizedString("Game Id:", true) + " " + MessageDispatcher.gameId);
                MessageDispatcher.serverTime.setSeconds(MessageDispatcher.serverTime.getSeconds() + 1);
                dateTimeLabel.setTitle($.DateFormat(MessageDispatcher.serverTime.toString(), "yyyy-MM-dd | HH:mm:ss"));
            }, 1000);

        provablyBtn = this.add.group();
        var provablyBtnBg = this.add.button(35, 1950, 'mainBtnBg', function () {
            $.client.showProvablyFair();
        }, this);
        provablyBtnBg.clicked = false;
        provablyBtnBg.input.useHandCursor = true;
        provablyBtnBg.width = 250;
        var provablyBtnTxt = this.add.text(provablyBtnBg.x + 10, provablyBtnBg.y + 23, $.client.getLocalizedString("Provably fair", true), {
            font: "41px  ProximaNova",
            fill: "#fff",
            align: "center"
        });
        provablyBtn.btn = provablyBtnBg;
        provablyBtn.add(provablyBtnBg);
        provablyBtn.add(provablyBtnTxt);
        provablyBtn.alpha = 0;
        gameBtnGroup.add(provablyBtn);

        startGameBtn = this.add.group();
        var startGameBtnBg = this.add.button(925, 660, 'spinBtn', this.startGame);
        startGameBtnBg.scale.set(0.7);
        startGameBtnBg.clicked = true;
        startGameBtnBg.input.enabled = false;
        startGameBtnBg.input.useHandCursor = true;
        startGameBtn.btn = startGameBtnBg;
        startGameBtn.add(startGameBtnBg);
        startGameBtn.alpha = 0;
        gameBtnGroup.add(startGameBtn);
        var muteBtn = this.add.button(30, 550, 'muteIco', function () {
                if (!$.client.getMuteState()) {
                    muteBtn.loadTexture('muteIco', 1);
                    game.sound.mute = true;
                    $.client.enableSound(false);
                } else {
                    muteBtn.loadTexture('muteIco', 0);
                    game.sound.mute = false;
                    $.client.enableSound(true);
                }
        }, null,this, $.client.getMuteState() ? 1 : 0);
        muteBtn.scale.set(0.8);
        gameBtnGroup.add(muteBtn);

        var chipSpriteId = 0;
        for (var a = 0; a <= NUM_DIB; a++) {
            if (a === selectedChipId) {
                chipsEl = chipsGroup.create(105 + ((NUM_DIB - a) * 110), 640, 'chips', chipSpriteId + 1);
            } else {
                chipsEl = chipsGroup.create(105 + ((NUM_DIB - a) * 110), 640, 'chips', chipSpriteId);
            }
            chipsEl.id = a;
            chipSpriteId += 2;
            chipsEl.debValue = dib_cost[a];
            chipsEl.inputEnabled = true;
            chipsEl.scale.set(0.9);
            chipsEl.input.useHandCursor = true;
            chipsEl.events.onInputDown.add(this.changeChips, this);
            chipsEl.rY = chipsEl.y;
            chipsEl.rX = chipsEl.x;
            chipsEl.chipText = this.add.text(chipsEl.x + 50, chipsEl.y + 30, dib_cost[a] > 999 ? kFormater(dib_cost[a]) : dib_cost[a], {
                font: "bold 32px  ProximaNova",
                fill: "#fff"
            });
            chipsEl.chipText.anchor.x = Math.round(chipsEl.chipText.width * 0.5) / chipsEl.chipText.width;
            chipsGroup.add(chipsEl.chipText);
        }
        self.changeChips({ id: selectedChipId });
        frameGroup.add(chipsGroup);
        for (var i = 0; i < TABLE_COLS; i++) {
            for (var j = 0; j < TABLE_ROWS; j++) {

                cellName = 'cell_' + i.toString() + '_' + j.toString();
                tableCell[cellName] = tableGroup.create(table.x + 84 + j * (DIB_WIDTH + DIB_SPASE), table.y + 275 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
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

                spriteX = tableGroup.create(table.x + 84 + j * (DIB_WIDTH + DIB_SPASE), table.y + 395 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
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

                spriteY = tableGroup.create(table.x + 67 + j * (DIB_WIDTH + DIB_SPASE), table.y + 275 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
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

                spriteXY = tableGroup.create(table.x + 67 + j * (DIB_WIDTH + DIB_SPASE), table.y + 395 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
                spriteXY.name = 'crossXY_' + i.toString() + '_' + j.toString();
                spriteXY.bet_name = 'crossXY_' + i.toString() + '_' + j.toString();;
                spriteXY.inputEnabled = true;
                spriteXY.width = 30;
                spriteXY.height = 30;
                spriteXY.type = betType.corner;
                spriteXY.alpha = 0;
                if (j == 0) {
                    spriteXY.type = betType.street;
                }
                if (i == 0 && j == 0) {
                    spriteXY.type = betType.corner;
                }

                spriteXY.events.onInputUp.add(this.cellClick, this);
                spriteXY.events.onInputOver.add(this.cellOver, this);
                spriteXY.events.onInputOut.add(this.cellOut, this);
            }
        }
        tableCell['zero'] = tableGroup.create(table.x + 2, table.y + 0, 'cell_select');
        tableCell['zero'].name = '0';

        tableCell['zero'].bet_name = '0';
        tableCell['zero'].bet_type = 'straight';

        tableCell['zero'].type = betType.straight;
        tableCell['zero'].alpha = 0;
        tableCell['zero'].width = 78;
        tableCell['zero'].height = 405;

        tableCell['zero'].inputEnabled = true;
        tableCell['zero'].events.onInputUp.add(this.cellClick, this);
        tableCell['zero'].events.onInputOver.add(this.cellOver, this);
        tableCell['zero'].events.onInputOut.add(this.cellOut, this);

        Dozen['one'] = tableGroup.create(table.x + 80, table.y + 413, 'cell_select');
        Dozen['one'].name = 'dozenOne';
        Dozen['one'].bet_name = 'first12';
        Dozen['one'].bet_type = 'dozen';
        Dozen['one'].items = [0];
        Dozen['one'].first = 0;
        Dozen['one'].last = 4;
        Dozen['one'].alpha = 0;
        Dozen['one'].width = 325;
        Dozen['one'].height = 60;
        Dozen['one'].type = betType.multiSelect;
        Dozen['one'].inputEnabled = true;
        Dozen['one'].events.onInputUp.add(this.cellClick, this);
        Dozen['one'].events.onInputOver.add(this.cellOver, this);
        Dozen['one'].events.onInputOut.add(this.cellOut, this);

        Dozen['two'] = tableGroup.create(table.x + 405, table.y + 413, 'cell_select');
        Dozen['two'].name = 'dozenTwo';
        Dozen['two'].bet_name = 'second12';
        Dozen['two'].bet_type = 'dozen';
        Dozen['two'].items = [1];
        Dozen['two'].type = betType.multiSelect;
        Dozen['two'].alpha = 0;
        Dozen['two'].width = 325;
        Dozen['two'].height = 60;
        Dozen['two'].first = 4;
        Dozen['two'].last = 8;
        Dozen['two'].inputEnabled = true;
        Dozen['two'].events.onInputUp.add(this.cellClick, this);
        Dozen['two'].events.onInputOver.add(this.cellOver, this);
        Dozen['two'].events.onInputOut.add(this.cellOut, this);

        Dozen['three'] = tableGroup.create(table.x + 730, table.y + 413, 'cell_select');
        Dozen['three'].name = 'dozenThree';
        Dozen['three'].bet_name = 'third12';
        Dozen['three'].bet_type = 'dozen';
        Dozen['three'].items = [2];
        Dozen['three'].type = betType.multiSelect;
        Dozen['three'].alpha = 0;
        Dozen['three'].width = 325;
        Dozen['three'].height = 60;
        Dozen['three'].first = 8;
        Dozen['three'].last = 12;
        Dozen['three'].inputEnabled = true;
        Dozen['three'].events.onInputUp.add(this.cellClick, this);
        Dozen['three'].events.onInputOver.add(this.cellOver, this);
        Dozen['three'].events.onInputOut.add(this.cellOut, this);

        Column['one'] = tableGroup.create(table.x + 1055, table.y + 270, 'cell_select');
        Column['one'].name = 'columnOne';
        Column['one'].bet_name = 'col1';
        Column['one'].bet_type = 'column';
        Column['one'].items = [0];
        Column['one'].type = betType.multiSelect;
        Column['one'].alpha = 0;
        Column['one'].width = 90;
        Column['one'].height = 135;
        Column['one'].first = 0;
        Column['one'].last = 12;
        Column['one'].colFirst = 0;
        Column['one'].colLast = 1;
        Column['one'].inputEnabled = true;
        Column['one'].events.onInputUp.add(this.cellClick, this);
        Column['one'].events.onInputOver.add(this.cellOver, this);
        Column['one'].events.onInputOut.add(this.cellOut, this);

        Column['two'] = tableGroup.create(table.x + 1055, table.y + 135, 'cell_select');
        Column['two'].name = 'columnTwo';
        Column['two'].bet_name = 'col2';
        Column['two'].bet_type = 'column';
        Column['two'].items = [1];
        Column['two'].type = betType.multiSelect;
        Column['two'].alpha = 0;
        Column['two'].width = 90;
        Column['two'].height = 135;
        Column['two'].first = 0;
        Column['two'].last = 12;
        Column['two'].colFirst = 1;
        Column['two'].colLast = 2;
        Column['two'].inputEnabled = true;
        Column['two'].events.onInputUp.add(this.cellClick, this);
        Column['two'].events.onInputOver.add(this.cellOver, this);
        Column['two'].events.onInputOut.add(this.cellOut, this);

        Column['three'] = tableGroup.create(table.x + 1055, table.y + 5, 'cell_select');
        Column['three'].name = 'columnThree';
        Column['three'].bet_name = 'col3';
        Column['three'].bet_type = 'column';
        Column['three'].type = betType.multiSelect;
        Column['three'].items = [2];
        Column['three'].alpha = 0;
        Column['three'].width = 90;
        Column['three'].height = 135;
        Column['three'].first = 0;
        Column['three'].last = 12;
        Column['three'].colFirst = 2;
        Column['three'].colLast = 3;
        Column['three'].inputEnabled = true;
        Column['three'].events.onInputUp.add(this.cellClick, this);
        Column['three'].events.onInputOver.add(this.cellOver, this);
        Column['three'].events.onInputOut.add(this.cellOut, this);


        Orphelins['low'] = tableGroup.create(table.x + 80, table.y + 475, 'cell_select');
        Orphelins['low'].name = 'low';
        Orphelins['low'].bet_name = 'first18';
        Orphelins['low'].bet_type = 'high_low';
        Orphelins['low'].items = ['low'];
        Orphelins['low'].type = betType.multiSelect;
        Orphelins['low'].width = 160;
        Orphelins['low'].height = 60;
        Orphelins['low'].first = 0;
        Orphelins['low'].last = 6;
        Orphelins['low'].alpha = 0;
        Orphelins['low'].inputEnabled = true;
        Orphelins['low'].events.onInputUp.add(this.cellClick, this);
        Orphelins['low'].events.onInputOver.add(this.cellOver, this);
        Orphelins['low'].events.onInputOut.add(this.cellOut, this);

        Orphelins['high'] = tableGroup.create(table.x + 890, table.y + 475, 'cell_select');
        Orphelins['high'].name = 'high';
        Orphelins['high'].bet_name = 'second18';
        Orphelins['high'].bet_type = 'high_low';
        Orphelins['high'].items = ['high'];
        Orphelins['high'].type = betType.multiSelect;
        Orphelins['high'].width = 160;
        Orphelins['high'].height = 60;
        Orphelins['high'].first = 6;
        Orphelins['high'].last = 12;
        Orphelins['high'].alpha = 0;
        Orphelins['high'].inputEnabled = true;
        Orphelins['high'].events.onInputUp.add(this.cellClick, this);
        Orphelins['high'].events.onInputOver.add(this.cellOver, this);
        Orphelins['high'].events.onInputOut.add(this.cellOut, this);

        Orphelins['even'] = tableGroup.create(table.x + 245, table.y + 475, 'cell_select');
        Orphelins['even'].name = 'even';
        Orphelins['even'].bet_name = 'even';
        Orphelins['even'].bet_type = 'evens_odds';
        Orphelins['even'].items = ['evens'];
        Orphelins['even'].type = betType.arrSelect;
        Orphelins['even'].alpha = 0;
        Orphelins['even'].width = 160;
        Orphelins['even'].height = 60;
        Orphelins['even'].numbers = evenNumberArr;
        Orphelins['even'].inputEnabled = true;
        Orphelins['even'].events.onInputUp.add(this.cellClick, this);
        Orphelins['even'].events.onInputOver.add(this.cellOver, this);
        Orphelins['even'].events.onInputOut.add(this.cellOut, this);

        Orphelins['odd'] = tableGroup.create(table.x + 730, table.y + 475, 'cell_select');
        Orphelins['odd'].name = 'odd';
        Orphelins['odd'].bet_name = 'odd';
        Orphelins['odd'].bet_type = 'evens_odds';
        Orphelins['odd'].items = ['odds'];
        Orphelins['odd'].type = betType.arrSelect;
        Orphelins['odd'].width = 160;
        Orphelins['odd'].height = 60;
        Orphelins['odd'].alpha = 0;
        Orphelins['odd'].numbers = oddNumberArr;
        Orphelins['odd'].inputEnabled = true;
        Orphelins['odd'].events.onInputUp.add(this.cellClick, this);
        Orphelins['odd'].events.onInputOver.add(this.cellOver, this);
        Orphelins['odd'].events.onInputOut.add(this.cellOut, this);

        Orphelins['black'] = tableGroup.create(table.x + 565, table.y + 475, 'cell_select');
        Orphelins['black'].name = 'black';
        Orphelins['black'].bet_name = 'black';
        Orphelins['black'].bet_type = 'color';
        Orphelins['black'].items = ['black'];
        Orphelins['black'].type = betType.arrSelect;
        Orphelins['black'].alpha =0;
        Orphelins['black'].width = 160;
        Orphelins['black'].height = 60;
        Orphelins['black'].numbers = blackNumberArr;
        Orphelins['black'].inputEnabled = true;
        Orphelins['black'].events.onInputUp.add(this.cellClick, this);
        Orphelins['black'].events.onInputOut.add(this.cellOut, this);

        Orphelins['red'] = tableGroup.create(table.x + 405, table.y + 475, 'cell_select');
        Orphelins['red'].name = 'red';
        Orphelins['red'].bet_name = 'red';
        Orphelins['red'].bet_type = 'color';
        Orphelins['red'].items = ['red'];
        Orphelins['red'].type = betType.arrSelect;
        Orphelins['red'].alpha = 0;
        Orphelins['red'].width = 160;
        Orphelins['red'].height = 60;
        Orphelins['red'].numbers = redNumberArr;
        Orphelins['red'].inputEnabled = true;
        Orphelins['red'].events.onInputUp.add(this.cellClick, this);
        Orphelins['red'].events.onInputOut.add(this.cellOut, this);

        this.hideVideoBtn();
        $('.portrait_video').on("click", function () {
            self.hideVideo();
        });
        if (!$.client.getVideoState()) {
            $.client.enableVideo(true);
        }
        setInterval(function () {
            self.changeGameSize();
        }, 1000);
        self.changeGameSize();
        self.ready = true;
        setTimeout(function () {
            self.getLimits();
            self.updateStatistics();
        }, 300);
        self.showMenu= function (element) {
            var self = this;
            isModalShow = true;
            if (menuGroup) {
                this.hideMenu();
            } else {
                modalBg = this.add.button(0, 0, "mainBtnBg", function () {
                    self.hideMenu();
                }, this);
                modalBg.height = 750;
                modalBg.width = 1334;
                modalBg.alpha = 0.5;
                modalBg.priorityID = 0;
                menuGroup = this.add.group();
                menuGroup.add(modalBg);
                bgGroup = this.add.group();
                menuGroup.bgGroup = bgGroup;
                menuGroup.add(bgGroup);
                //  bgGroup.x = -200;
                //  bgGroup.y = 0;
                bgGroup.alpha = 0;
                menuBg = this.add.sprite(1000, 150, 'menuBg');
                menuBg.width = 300;
                menuBg.height = 550;
                menuBg.alpha = 0.85;
                bgGroup.add(menuBg);
                function createMenuItem(config, callback) {
                    var btn = self.add.button(config.x, config.y, "modalBg", function () {
                        self.hideMenu(null, function () {
                            if (callback && !config.disabled)
                                callback();
                        });
                    }, this);
                    btn.height = 90;
                    btn.width = menuBg.width;
                    btn.alpha = 0;
                    btn.priorityID = 0;
                    var text = createTextLbl(self, {
                        text: config.text,
                        x: config.x + menuBg.width / 2,
                        y: config.y + 30,
                        font: "ProximaNova",
                        size: 33,
                        centered: true,
                        color: "#fff",
                        maxHeight: 90,
                        maxWidth: 270
                    });
                    if (config.disabled) {
                        text.alpha = 0.4;
                        btn.clicked = false;
                        btn.inputEnabled = false;
                    }
                    bgGroup.add(btn);
                    bgGroup.add(text);
                }
                createMenuItem({ x: menuBg.x, y: menuBg.y, text: $.client.getLocalizedString('Home', true) }, function () {
                    $.client.toHome();
                });
                createMenuItem({ x: menuBg.x, y: menuBg.y + 90, text: $.client.getLocalizedString('History', true) }, function () {
                    self.showHistory();
                });
                createMenuItem({ x: menuBg.x, y: menuBg.y + 180, text: $.client.getLocalizedString('Limits', true) }, function () {
                    self.showLimits();
                });
                createMenuItem({ x: menuBg.x, y: menuBg.y + 270, text: $.client.getLocalizedString('Statistics', true) }, function () {
                    self.showStatisticData();
                });
                createMenuItem({
                    x: menuBg.x,
                    y: menuBg.y + 355,
                    text: $.client.getLocalizedString('Provably fair', true),
                    disabled: !($.client.UserData.Features && $.client.UserData.Features.provably_fair)
                }, function () {
                    $.client.showProvablyFair();
                });
                createMenuItem({
                    x: menuBg.x,
                    y: menuBg.y + 450,
                    text: $.client.getLocalizedString('Rules', true),
                    disabled: !($.client.UserData.Features && $.client.UserData.Features.rules)
                }, function () {
                    $.client.showRules();
                });
                game.add.tween(bgGroup).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true);
            }
        },
        self.hideMenu= function (element,callback) {
            if (menuGroup) {
                isModalShow = false;
                var tween = game.add.tween(menuGroup.bgGroup).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(function () {
                    menuGroup.destroy();
                    menuGroup = null;
                    if (callback)
                        callback();
                }, this);
            }
        }
        self.showVideo = function (show) {
            if (!_videoFlagShow) {
                $('.portrait_video').fadeIn(500);
                _videoFlagShow = true;
            }
        };
        self.hideVideo= function (element) {
            if (!game.state.states.MainMenu.videoDisabled) {
                _videoFlagShow = false;
                $.client.enableVideo(false);
            }
            $('.portrait_video').fadeOut(500, function () {
            });
        };
        self.showWinner = function (winAmount) {
            var self = this;
            headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
            MessageDispatcher.betHistory[MessageDispatcher.betHistory.length - 1].winAmount = parseFloat(winAmount).toFixed(2);
            function showScreen() {
                self.winnerGroup = self.add.group();
                self.winnerGroup.alpha = 0;
                var modalBg = self.add.button(0, 0, "modalBg", function () {
                    hideScreen();
                }, this);
                modalBg.alpha = 0.5;
                modalBg.height = GAME_HEIGHT;
                modalBg.width = GAME_WIDTH;
                self.winnerGroup.add(modalBg);
                var winnerBg = self.winnerGroup.create(GAME_WIDTH / 2 - GAME_WIDTH / 6, GAME_HEIGHT / 2 - GAME_HEIGHT / 6, 'winnerBg');
                winnerBg.width = GAME_WIDTH / 3;
                winnerBg.height = GAME_HEIGHT / 3;
                self.winnerGroup.add(winnerBg);
                var titleText = createTextLbl(self, {
                    text: $.client.getLocalizedString("You've won", true),
                    x: winnerBg.x + winnerBg.width / 2,
                    y: winnerBg.y + 20,
                    font: "ProximaNova",
                    size: 40,
                    style: "bold",
                    centered: true,
                    color: "#000",
                    maxHeight: 60,
                    maxWidth: GAME_WIDTH / 4
                });
                titleText.setShadow(2, 2, 'rgba(255,255,255,0.5)', 5);
                self.winnerGroup.add(titleText);
                self.winnerGroup.amountText = createTextLbl(self, {
                    text: $.client.UserData.CurrencySign +  parseFloat(winAmount).toFixed(2),
                    x: winnerBg.x + winnerBg.width / 2,
                    y: winnerBg.y + winnerBg.height / 2,
                    font: "ProximaNova",
                    size: 60,
                    style: "bold",
                    centered: true,
                    color: "#e4a345",
                    maxHeight: 60,
                    maxWidth: GAME_WIDTH / 4
                });
                self.winnerGroup.amountText.setShadow(2, 2, 'rgba(255,255,255,0.5)', 5);
                self.winnerGroup.add(self.winnerGroup.amountText);
                game.add.tween(self.winnerGroup).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true);
                setTimeout(function () {
                    hideScreen();
                }, 3000);
            }

            function hideScreen() {
                var tween = game.add.tween(self.winnerGroup).to({ alpha: 0 }, 300, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(function () {
                    self.winnerGroup.destroy();
                    self.winnerGroup = null;
                }, this);
            }

            if (self.winnerGroup) {
                self.winnerGroup.amountText.setTitle($.client.UserData.CurrencySign + parseFloat(winAmount).toFixed(2));
            } else {
                showScreen();
            }
        };
        self.changeStatus = function(text, statusIndex, showModal, timeout) {
            var tDiff = new Date(new Date().getTime() - lastChangeStatus).getTime() / 1000;
            var self = this;
            if (timeout > 0) {
                setTimeout(function() {
                    self.changeStatus(self.previousState.text, self.previousState.statusIndex, self.previousState.showModal);
                }, timeout);
            } else {
                self.previousState = { text: text, statusIndex: statusIndex, showModal: false };
            }
            lastChangeStatus = new Date().getTime();
            if (infoText != undefined) {
                if (tDiff < 1.5 && self.previousStatusIndex != statusIndex) {
                    if (self.newStateTimeout)
                        clearTimeout(self.newStateTimeout);
                    self.newStateTimeout = setTimeout(function () {
                        self.changeStatus(text, statusIndex);
                    }, 1600);
                } else {
                    self.previousStatusIndex = statusIndex;
                    infoText.setTitle(text.toUpperCase());
                    tableStatus.loadTexture('statusBg', statusIndex);
                }
            }

            function showText(txt) {
                statusGroup.removeAll();
                bg = self.add.group();
                statusGroup.add(bg);
                modalBg = self.add.button(0, 0, "modalBg", null, this);
                modalBg.height = 750;
                modalBg.width = 1334;
                modalBg.alpha = 0;
                textBg = self.add.button(0, 375, "modalBg", null, this);
                textBg.height = 0;
                bg.add(modalBg);
                bg.add(textBg);
                var text = self.add.text(660, 375, txt.toUpperCase(), {
                    font: "2px ProximaNova",
                    fill: "#fff"
                });
                text.anchor.x = Math.round(text.width * 0.5) / text.width;
                bg.add(text);
                game.add.tween(modalBg).to({ alpha: 0.8 }, 400, Phaser.Easing.Linear.None, true);
                game.add.tween(textBg).to({ y: 275 }, 600, Phaser.Easing.Linear.None, true);
                game.add.tween(textBg).to({ height: 200 }, 600, Phaser.Easing.Linear.None, true);
                self.add.tween(text).to({ fontSize: 70 }, 600, Phaser.Easing.Linear.None, true);
                self.add.tween(text).to({ y: 340 }, 600, Phaser.Easing.Linear.None, true);
                setTimeout(function() {
                    game.add.tween(modalBg).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true);
                    game.add.tween(textBg).to({ y: 375 }, 600, Phaser.Easing.Linear.None, true);
                    game.add.tween(text).to({ fontSize: 2 }, 600, Phaser.Easing.Linear.None, true);
                    self.add.tween(text).to({ y: 375 }, 600, Phaser.Easing.Linear.None, true);
                    var tween = game.add.tween(textBg).to({ height: 0 }, 600, Phaser.Easing.Linear.None, true);
                    tween.onComplete.add(function() {
                        statusGroup.removeAll();
                        bg.destroy();
                    }, this);
                }, 3000);
            }

            if (showModal && !_videoFlagShow)
                showText(text);
        };
        self.showHistory = function (element) {
            var self = this;
            var statTitleText, modalBg, cancelBtn, winLbl, betLbl;
            if (!isModalShow) {
                if (_videoFlagShow) {
                    self.hideVideo();
                }
                isModalShow = true;
                modalBg = this.add.button(0, 0, "modalBg", this.closeHistoryPopup, this);
                modalBg.height = GAME_HEIGHT;
                modalBg.priorityID = 0;
                modalBg.useHandCursor = false;
                historyPopup = this.add.group();
                historyPopup.clicked = false;;
                historyPopup.add(modalBg);
                var historyBox = this.add.sprite(465, 25, 'historyBg');
                historyBox.height = 700;
                historyBox.width = 400;
                historyBox.inputEnabled = true;
                historyBox.priorityID = 1;
                historyPopup.add(historyBox);
                var lostBg = this.add.sprite(495, 650, 'buttonsBg',0);
                lostBg.height = 60;
                lostBg.width = 340;
                historyPopup.add(lostBg);
                var totalLost = createTextLbl(self, {
                    text: $.client.getLocalizedString("Total lost", true).toUpperCase(),
                    x: 545,
                    y: 667,
                    font: "ProximaNova",
                    size: 27,
                    color: "#fff",
                    centered: false,
                    maxHeight: 75,
                    maxWidth: 200
                });
                var totalLostVal = createTextLbl(self, {
                    text: $.client.UserData.CurrencySign + TOTAL_LOST > 99999 ? kFormater(TOTAL_LOST) : parseFloat(TOTAL_LOST).toFixed(2),
                    x: totalLost.x + totalLost.width + 15,
                    y: 667,
                    font: "ProximaNova",
                    size: 27,
                    color: "#fff",
                    centered: false,
                    maxHeight: 30,
                    maxWidth: 100
                });
                historyPopup.addChild(totalLost);
                historyPopup.addChild(totalLostVal);
                statTitleText = createTextLbl(self, {
                    text: $.client.getLocalizedString('History', true),
                    x: 670,
                    y: 35,
                    font: "ProximaNova",
                    size: 34,
                    color: "#fff",
                    centered: true,
                    maxHeight: 40,
                    maxWidth: 140
                });
                betLbl = createTextLbl(self, {
                    text: $.client.getLocalizedString('Bet', true).toUpperCase(),
                    x: 660,
                    y: 98,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: true,
                    maxHeight: 65,
                    maxWidth: 140
                });
                winLbl = createTextLbl(self, {
                    text: $.client.getLocalizedString('TEXT_WIN', true).toUpperCase(),
                    x: 760,
                    y: 98,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: true,
                    maxHeight: 65,
                    maxWidth: 100
                });
                historyPopup.addChild(statTitleText);
                historyPopup.addChild(winLbl);
                historyPopup.addChild(betLbl);
                function showRow(item, posX, posY) {
                    var numBg, numText, betText, winText, numTextVal, color;
                    numTextVal = kFormater(item.number) + '';
                    if (jQuery.inArray(parseInt(item.number, 10), blackNumberArr) != -1) {
                        color = "#ffffff";
                    } else if (jQuery.inArray(parseInt(item.number, 10), redNumberArr) != -1) {
                        color = "#ae3e3e";
                    } else {
                        color = "#459a59";
                    }
                    numBg = self.add.sprite(posX, posY, 'numberBg');
                    numBg.scale.set(1.0);
                    numText = self.add.text(numBg.x + 26, numBg.y + 10, numTextVal, { font: "28px ProximaNova", fill: color, align: "center" });
                    numText.anchor.x = Math.round(numText.width * 0.5) / numText.width;

                    historyPopup.addChild(numBg);
                    historyPopup.addChild(numText);
                    var betAmount = item.betAmount % 1 == 0 ? parseFloat(item.betAmount).toFixed(0) : parseFloat(item.betAmount).toFixed(2);
                    betAmount = betAmount > 9999 ? kFormater(betAmount) : betAmount;
                    betText = self.add.text(posX + 135, posY + 11, $.client.UserData.CurrencySign + betAmount, { font: "30px ProximaNova", fill: "#fff", align: "center" });
                    betText.anchor.x = Math.round(betText.width * 0.5) / betText.width;
                    historyPopup.addChild(betText);
                    var winAmount = item.winAmount % 1 == 0 ? parseFloat(item.winAmount).toFixed(0) : parseFloat(item.winAmount).toFixed(2);
                    winAmount = winAmount > 9999 ? kFormater(winAmount) : winAmount;
                    winText = self.add.text(posX + 245, posY + 11, $.client.UserData.CurrencySign + winAmount, { font: "30px ProximaNova", fill: "#fff", align: "center" });
                    winText.anchor.x = Math.round(winText.width * 0.5) / winText.width;
                    historyPopup.addChild(winText);
                }
                var k = 0;
                for (var i = MessageDispatcher.betHistory.length - 1; i >= 0; i--) {
                    showRow(MessageDispatcher.betHistory[i], 525, 136 + k * 50);
                    k++;
                }
                tableGroup.setAll('inputEnabled', false);
                buttonGroup.setAll('clicked', false);
            }
        };
        self.showStatisticData = function (element) {
            var ststs, canselBtn;
            var self = this;
            var statTitleText, coldNumText, hotNumText, colorText, evensOddsText,
            highLowText, dozenText, columnText, modalBg, cancelBtn, cancelBtnText;
            if (!isModalShow) {
                if (this._statData != undefined) {
                    ststs = this._statData;
                    isModalShow = true;
                    self.statShow = true;
                    statPopup = this.add.group();
                    modalBg = this.add.button(0, 0, "modalBg", this.closeStatPopup, this);
                    modalBg.height = 750;
                    modalBg.priorityID = 0;
                    modalBg.useHandCursor = false;
                    statPopup.add(modalBg);
                    var statBox = this.add.sprite(315, 25, 'statBg');
                    statBox.width = 750;
                    statBox.height = 700;
                    statBox.inputEnabled = true;
                    statBox.priorityID = 1;
                    statPopup.add(statBox);
                    var statData = this.add.group();

                    statPopup.addChild(statData);

                    statTitleText = createTextLbl(self, {
                        text: $.client.getLocalizedString('Statistics', true),
                        x: 670,
                        y: 33,
                        font: "ProximaNova",
                        size: 34,
                        color: "#fff",
                        centered: true,
                        maxHeight: 90,
                        maxWidth: 350
                    });
                    statData.addChild(statTitleText);

                    coldNumText = createTextLbl(self, {
                        text: $.client.getLocalizedString('COLD NUMBERS', true).toUpperCase(),
                        x: 350,
                        y: 115,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: false,
                        maxHeight: 70,
                        maxWidth: 250
                    });
                    hotNumText = createTextLbl(self, {
                        text: $.client.getLocalizedString('HOT NUMBERS', true).toUpperCase(),
                        x: 350,
                        y: 200,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: false,
                        maxHeight: 70,
                        maxWidth: 250
                    });
                    colorText = createTextLbl(self, {
                        text: $.client.getLocalizedString('COLORS', true).toUpperCase(),
                        x: 350,
                        y: 285,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: false,
                        maxHeight: 70,
                        maxWidth: 250
                    });
                    evensOddsText = createTextLbl(self, {
                        text: $.client.getLocalizedString('EVEN/ODDS', true).toUpperCase(),
                        x: 350,
                        y: 375,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: false,
                        maxHeight: 70,
                        maxWidth: 250
                    });
                    highLowText = createTextLbl(self, {
                        text: $.client.getLocalizedString('HIGH/LOW', true).toUpperCase(),
                        x: 350,
                        y: 465,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: false,
                        maxHeight: 70,
                        maxWidth: 250
                    });
                    dozenText = createTextLbl(self, {
                        text: $.client.getLocalizedString('DOZENS', true).toUpperCase(),
                        x: 350,
                        y: 555,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: false,
                        maxHeight: 70,
                        maxWidth: 250
                    });
                    columnText = createTextLbl(self, {
                        text: $.client.getLocalizedString('COLUMNS', true).toUpperCase(),
                        x: 350,
                        y: 645,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: false,
                        maxHeight: 70,
                        maxWidth: 250
                    });

                    statData.addChild(coldNumText);
                    statData.addChild(hotNumText);
                    statData.addChild(colorText);
                    statData.addChild(evensOddsText);
                    statData.addChild(highLowText);
                    statData.addChild(dozenText);
                    statData.addChild(columnText);


                    function showNumber(element, desc, posX, posY) {
                        var numBg, numText, numTextDesc, numTextVal, color;
                        numTextVal = element + '';
                        if (jQuery.inArray(parseInt(element, 10), blackNumberArr) != -1) {
                            color = "#ffffff";
                        } else if (jQuery.inArray(parseInt(element, 10), redNumberArr) != -1) {
                            color = "#ae3e3e";
                        } else {
                            color = "#459a59";
                        }
                        numBg = self.add.sprite(posX, posY, 'numberBg');
                        numBg.scale.set(1.3);
                        numText = self.add.text(numBg.x + 30, numBg.y + 15, numTextVal, { font: "27px ProximaNova", fill: color, align: "center" });
                        numText.anchor.x = Math.round(numText.width * 0.5) / numText.width;

                        numTextDesc = self.add.text(numBg.x + numBg.width - 22, numBg.y + 40, desc, { font: "18px ProximaNova", fill: "#b0b0b0", align: "right" });
                        statData.addChild(numBg);
                        statData.addChild(numText);
                        statData.addChild(numTextDesc);

                    }

                    function showSectionNumber(posX, posY, label, value, spriteFrame) {
                        var statChartFirst, statChartSecond, statChartThird,
                            statChartFirstText, statChartSecondText, statChartThirdText
                        ;

                        statChartFirst = self.add.sprite(posX, posY, 'statChartBg', spriteFrame[0]);
                        statChartFirst.width = value[0] * 4.1;
                        statChartFirstText = createTextLbl(self, {
                            text: '',
                            x: statChartFirst.x + statChartFirst.width / 2,
                            y: statChartFirst.y + 10,
                            font: "ProximaNova",
                            size: 24,
                            color: "#ffffff",
                            centered: true,
                            maxHeight: 20,
                            maxWidth: statChartFirst.width - 5
                        });
                        if (value[0] > 20) {
                            statChartFirstText.setTitle(label[0] + " - " + Math.round(value[0]) + "%");
                        }

                        statData.addChild(statChartFirst);
                        statData.addChild(statChartFirstText);

                        statChartSecond = self.add.sprite(statChartFirst.x + statChartFirst.width, posY, 'statChartBg', spriteFrame[1]);
                        statChartSecond.width = value[1] * 4.4;
                        statChartSecondText = createTextLbl(self, {
                            text: '',
                            x: statChartSecond.x + statChartSecond.width / 2,
                            y: statChartSecond.y + 10,
                            font: "ProximaNova",
                            size: 24,
                            color: "#ffffff",
                            centered: true,
                            maxHeight: 20,
                            maxWidth: statChartSecond.width - 5
                        });
                        if (value[1] > 20) {
                            statChartSecondText.setTitle(label[1] + " - " + Math.round(value[1]) + "%");
                        }
                        statData.addChild(statChartSecond);
                        statData.addChild(statChartSecondText);

                        statChartThird = self.add.sprite(statChartSecond.x + statChartSecond.width, posY, 'statChartBg', spriteFrame[2]);
                        statChartThird.width = value[2] * 4.1;
                        statChartThirdText = createTextLbl(self, {
                            text: '',
                            x: statChartThird.x + statChartThird.width / 2,
                            y: statChartThird.y + 10,
                            font: "ProximaNova",
                            size: 24,
                            color: "#ffffff",
                            centered: true,
                            maxHeight: 20,
                            maxWidth: statChartThird.width - 5
                        });
                        if (value[2] > 20) {
                            statChartThirdText.setTitle(label[2] + " - " + Math.round(value[2]) + "%");
                        }

                        statData.addChild(statChartThird);
                        statData.addChild(statChartThirdText);

                    }

                    for (var i = 4; i < ststs.coldNumbers.length; i++) {
                        showNumber(ststs.coldNumbers[i].number, ststs.coldNumbers[i].lastHit, coldNumText.x + 257 + (i - 4) * 71, coldNumText.y - 15);
                    }

                    for (var i = 4; i < ststs.hotNumbers.length; i++) {
                        showNumber(ststs.hotNumbers[i].number, ststs.hotNumbers[i].count, hotNumText.x + 257 + (i - 4) * 71, hotNumText.y - 15);
                    }
                    showSectionNumber(colorText.x + 260, colorText.y - 12,
                        [$.client.getLocalizedString("RED", true).toUpperCase(), $.client.getLocalizedString("GREEN", true).toUpperCase(), $.client.getLocalizedString("BLACK", true).toUpperCase()],
                        [ststs.colors.red, ststs.colors.zero, ststs.colors.black],
                        [0, 1, 3]
                    );

                    showSectionNumber(evensOddsText.x + 260, evensOddsText.y - 12,
                        [$.client.getLocalizedString("EVEN", true).toUpperCase(), $.client.getLocalizedString("ZERO", true).toUpperCase(), $.client.getLocalizedString("ODDS", true).toUpperCase()],
                        [ststs.evenOdds.even, ststs.evenOdds.zero, ststs.evenOdds.odds],
                        [2, 1, 2]
                    );

                    showSectionNumber(highLowText.x + 260, highLowText.y - 12,
                        [$.client.getLocalizedString("HIGH", true).toUpperCase(), $.client.getLocalizedString("ZERO", true).toUpperCase(), $.client.getLocalizedString("LOW", true).toUpperCase()],
                        [ststs.highLow.high, ststs.highLow.zero, ststs.highLow.low],
                        [2, 2, 2]
                    );

                    showSectionNumber(dozenText.x + 260, dozenText.y - 12,
                        ["1-12", "13-24", "25-36"],
                        [ststs.dozens.first, ststs.dozens.second, ststs.dozens.third],
                        [2, 2, 2]
                    );
                    showSectionNumber(columnText.x + 260, columnText.y - 12,
                        ["1-34", "2-35", "3-36"],
                        [ststs.columns.first, ststs.columns.second, ststs.columns.third],
                        [2, 2, 2]
                    );

                    tableGroup.setAll('inputEnabled', false);
                    buttonGroup.setAll('clicked', false);

                }
            }
        };
        self.showLimitsSelector = function() {
            var limitTitleText;
            var modalBg, cancelBtn;
            var self = this;
            if (!isModalShow) {
                if (limits.length != 0) {
                    isModalShow = true;
                    self.hideVideo();
                    gameBtnGroup.setAll('clicked', false);
                    modalBg = this.add.sprite(0, 0, 'modalBg');
                    modalBg.width = GAME_WIDTH;
                    modalBg.height = GAME_HEIGHT;
                    modalBg.priorityID = 10;
                    limitSelectionPopup = this.add.group();
                    limitSelectionPopup.add(modalBg);
                    var limitBox = this.add.sprite(320, 25, 'limitsModalBg');
                    limitSelectionPopup.add(limitBox);
                    limitBox.width = 700;
                    limitBox.height = 700;
                    limitTitleText = createTextLbl(self, {
                        text: $.client.getLocalizedString('Please select limits', true),
                        x: 670,
                        y: 34,
                        font: "ProximaNova",
                        size: 35,
                        color: "#fff",
                        centered: true,
                        maxHeight: 90,
                        maxWidth: 500
                    });
                    limitSelectionPopup.addChild(limitTitleText);
                    okBtn = this.add.button(340, 640, 'buttonsBg', function() {
                        selectedLimits = selected
                        self.confirmLimit();
                    }, this,0);
                    okBtn.input.useHandCursor = true;
                    okBtn.inputEnabled = true;
                    okBtn.input.priorityID = 1;
                    okBtn.clicked = true;
                    okBtn.width = 320;
                    okBtn.height = 60;
                    okBtn.text = createTextLbl(self, {
                        text: $.client.getLocalizedString('Ok', true),
                        x: okBtn.x + 160,
                        y: okBtn.y + 15,
                        font: "ProximaNova",
                        size: 32,
                        color: "#fff",
                        centered: true,
                        maxHeight: 50,
                        maxWidth: 300
                    });
                    limitSelectionPopup.add(okBtn);
                    limitSelectionPopup.add(okBtn.text);
               
                    cancelBtn = this.add.button(680, 640, 'buttonsBg', this.closeLimitSelectionPopup, this,0);
                    cancelBtn.input.useHandCursor = true;
                    cancelBtn.clicked = true;
                    cancelBtn.inputEnabled = true;
                    cancelBtn.input.priorityID = 1;
                    cancelBtn.width = 320;
                    cancelBtn.height = 60;
                    cancelBtn.text = createTextLbl(self, {
                        text: $.client.getLocalizedString('Cancel', true),
                        x: cancelBtn.x + 160,
                        y: cancelBtn.y + 15,
                        font: "ProximaNova",
                        size: 32,
                        color: "#fff",
                        centered: true,
                        maxHeight: 50,
                        maxWidth: 300
                    });
                    limitSelectionPopup.add(cancelBtn);
                    limitSelectionPopup.add(cancelBtn.text);
                     limitSelectionPopup.addChild(createTextLbl(self, {
                         text: $.client.getLocalizedString('Limit', true).toUpperCase(),
                        x: 390,
                        y: 94,
                        font: "ProximaNova",
                        size: 22,
                        color: "#878787",
                        centered: true,
                        maxHeight: 90,
                        maxWidth: 130
                    }));
                    limitSelectionPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Table', true).toUpperCase(),
                        x: 490,
                        y: 94,
                        font: "ProximaNova",
                        size: 22,
                        color: "#878787",
                        centered: true,
                        maxHeight: 90,
                        maxWidth: 130
                    }));
                    limitSelectionPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Straight', true).toUpperCase(),
                        x: 600,
                        y: 94,
                        font: "ProximaNova",
                        size: 22,
                        color: "#878787",
                        centered: true,
                        maxHeight: 90,
                        maxWidth: 130
                    }));
                    limitSelectionPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Column/Dozen', true).toUpperCase(),
                        x: 750,
                        y: 94,
                        font: "ProximaNova",
                        size: 22,
                        color: "#878787",
                        style: "bold",
                        centered: true,
                        maxHeight: 90,
                        maxWidth: 150
                    }));
                    limitSelectionPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Fifty/Fifty', true).toUpperCase(),
                        x: 920,
                        y: 94,
                        font: "ProximaNova",
                        size: 22,
                        color: "#878787",
                        centered: true,
                        maxHeight: 90,
                        maxWidth: 130
                    }));
                    var selected = selectedLimits;
                    var cells = [];

                    function showLimitRow(x, y, limit, id) {
                        var cell = self.add.button(x + 10, y - 10, "buttonsBg", function() {
                            for (var cl in cells) {
                                cells[cl].alpha = 0;
                            }
                            cell.alpha = 1;
                            selected = limits[id];
                        }, this,0);
                        cells.push(cell);
                        cell.alpha = 0;
                        if (selectedLimits && selectedLimits.Title == limit.Title) {
                            cell.alpha = 1;
                        }
                        cell.width = 660;
                        cell.height = 45;
                        limitSelectionPopup.add(cell);
                        var nameLbl = createTextLbl(self, {
                            text: limit.Title.toUpperCase(),
                            x: x + 60,
                            y: y,
                            font: "ProximaNova",
                            size: 24,
                            color: "#fff",
                            centered: true,
                            maxHeight: 15,
                            maxWidth: 100
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
                            maxWidth: 110
                        });

                        limitSelectionPopup.addChild(tableLbl);

                        var sMin = parseFloat(limit.Straight.Min) % 1 == 0 ? parseFloat(limit.Straight.Min).toFixed(0) : limit.Straight.Min.replace(',', '.');
                        var sMax = parseFloat(limit.Straight.Max) % 1 == 0 ? parseFloat(limit.Straight.Max).toFixed(0) : limit.Straight.Max.replace(',', '.');
                        sMin = sMin > 9999 ? kFormater(sMin) : sMin;
                        sMax = sMax > 9999 ? kFormater(sMax) : sMax;
                        var sText = sMin + '/' + sMax;
                        var straightLbl = createTextLbl(self, {
                            text: sText,
                            x: x + 275,
                            y: y,
                            font: "ProximaNova",
                            size: 24,
                            color: "#fff",
                            centered: true,
                            maxHeight: 15,
                            maxWidth: 120
                        });

                        limitSelectionPopup.addChild(straightLbl);

                        var cdMin = parseFloat(limit.Column_Dozen.Min) % 1 == 0 ? parseFloat(limit.Column_Dozen.Min).toFixed(0) : limit.Column_Dozen.Min.replace(',', '.');
                        var cdMax = parseFloat(limit.Column_Dozen.Max) % 1 == 0 ? parseFloat(limit.Column_Dozen.Max).toFixed(0) : limit.Column_Dozen.Max.replace(',', '.');
                        cdMin = cdMin > 9999 ? kFormater(cdMin) : cdMin;
                        cdMax = cdMax > 9999 ? kFormater(cdMax) : cdMax;
                        var cdText = cdMin + '/' + cdMax;
                        var cdLbl = createTextLbl(self, {
                            text: cdText,
                            x: x + 420,
                            y: y,
                            font: "ProximaNova",
                            size: 24,
                            color: "#fff",
                            centered: true,
                            maxHeight: 15,
                            maxWidth: 120
                        });

                        limitSelectionPopup.addChild(cdLbl);
                        var ffMin = parseFloat(limit.Fifty_Fifty.Min) % 1 == 0 ? parseFloat(limit.Fifty_Fifty.Min).toFixed(0) : limit.Fifty_Fifty.Min.replace(',', '.');
                        var ffMax = parseFloat(limit.Fifty_Fifty.Max) % 1 == 0 ? parseFloat(limit.Fifty_Fifty.Max).toFixed(0) : limit.Fifty_Fifty.Max.replace(',', '.');
                        ffMin = ffMin > 9999 ? kFormater(ffMin) : ffMin;
                        ffMax = ffMax > 9999 ? kFormater(ffMax) : ffMax;
                        var ffText = ffMin + '/' + ffMax;
                        var ffLbl = createTextLbl(self, {
                            text: ffText,
                            x: x + 590,
                            y: y,
                            font: "ProximaNova",
                            size: 24,
                            color: "#fff",
                            centered: true,
                            maxHeight: 15,
                            maxWidth: 120
                        });
                        limitSelectionPopup.addChild(ffLbl);

                    }

                    for (var i in limits) {
                        showLimitRow(330, i * 50 + 150, limits[i], i);
                    }

                }
            }
        };
        self.showLimits = function() {
            var limitTitleText;
            var modalBg, cancelBtn;
            var self = this;
            if (!isModalShow) {
                if (limits.length != 0) {
                    if (_videoFlagShow) {
                        self.hideVideo();
                    }
                    isModalShow = true;
                    limitPopup = this.add.group();
                    modalBg = this.add.button(0, 0, "modalBg", this.closelimitPopup, this);
                    modalBg.priorityID = 0;
                    modalBg.useHandCursor = false;
                    limitPopup.add(modalBg);
                    modalBg.height = 750;
                    var limitBox = this.add.sprite(260, 25, 'limitsBg');
                    limitBox.inputEnabled = true;
                    limitBox.priorityID = 1;
                    limitPopup.add(limitBox);
                    limitBox.width = 800;
                    limitBox.height = 700;
                    var changeBtn = this.add.button(300, 640, 'buttonsBg', function () {
                        self.closelimitPopup();
                        self.showLimitsSelector();
                    }, this,0);
                    limitPopup.add(changeBtn);
                    changeBtn.height = 55;
                    changeBtn.width = 330;
                    var changeText = createTextLbl(self, {
                        text: $.client.getLocalizedString('Change', true).toUpperCase(),
                        x: 465,
                        y: 653,
                        font: "ProximaNova",
                        size: 27,
                        color: "#fff",
                        centered: true,
                        maxHeight: 65,
                        maxWidth: 130
                    });

                    limitPopup.add(changeText);
                    changeBtn.clicked = true;
                    changeBtn.input.useHandCursor = true;

                    if ($.client.UserData.Features && $.client.UserData.Features.rules) {
                        var rulesBtn = this.add.button(690, 640, 'buttonsBg', function() {
                            $.client.showRules();
                        }, this,0);
                        limitPopup.add(rulesBtn);
                        rulesBtn.height = 55;
                        rulesBtn.width = 330;
                        var rulesText = createTextLbl(self, {
                            text: $.client.getLocalizedString('Rules', true).toUpperCase(),
                            x: 855,
                            y: 653,
                            font: "ProximaNova",
                            size: 27,
                            color: "#fff",
                            centered: true,
                            maxHeight: 65,
                            maxWidth: 130
                        });
                        limitPopup.add(rulesText);
                        rulesBtn.clicked = true;
                        rulesBtn.input.useHandCursor = true;
                   }
                    limitTitleText = createTextLbl(self, {
                        text: $.client.getLocalizedString('Limits', true),
                        x: 670,
                        y: 33,
                        font: "ProximaNova",
                        size: 34,
                        color: "#fff",
                        centered: true,
                        maxHeight: 80,
                        maxWidth: 200
                    });
                    limitPopup.addChild(limitTitleText);
                    limitPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Bet name', true).toUpperCase(),
                        x: 530,
                        y: 90,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: true,
                        maxHeight: 80,
                        maxWidth: 200
                    }));
                    limitPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Min bet', true).toUpperCase(),
                        x: 710,
                        y: 90,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: true,
                        maxHeight: 80,
                        maxWidth: 150
                    }));
                    limitPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Max bet', true).toUpperCase(),
                        x: 860,
                        y: 90,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: true,
                        maxHeight: 80,
                        maxWidth: 150
                    }));
                    limitPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Pays', true).toUpperCase(),
                        x: 990,
                        y: 90,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: true,
                        maxHeight: 80,
                        maxWidth: 100
                    }));
                    limitPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Inside bets', true).toUpperCase(),
                        x: 290,
                        y: 220,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: false,
                        maxHeight: 80,
                        maxWidth: 170
                    }));
                    limitPopup.addChild(createTextLbl(self, {
                        text: $.client.getLocalizedString('Outside bets', true).toUpperCase(),
                        x: 290,
                        y: 435,
                        font: "ProximaNova",
                        size: 28,
                        color: "#878787",
                        centered: false,
                        maxHeight: 80,
                        maxWidth: 170
                    }));

                    function showLimitRow(x, y, limit) {

                        limitPopup.addChild(createTextLbl(self, {
                            text: limit.name.toUpperCase(),
                            x: x - 35,
                            y: y,
                            font: "ProximaNova",
                            size: 25,
                            color: "#fff",
                            centered: false,
                            maxHeight: 40,
                            maxWidth: 170
                        }));
                        var min = limit.min.replace(',', '.')
                        min = parseFloat(min) % 1 == 0 ? parseFloat(min).toFixed(0) : min;
                        min = min > 9999 ? kFormater(min) : min;
                        var minLbl = limitPopup.addChild(self.add.text(x + 210, y, min, {
                            font: "25px ProximaNova",
                            fill: "#fff",
                            align: "center"
                        }));
                        minLbl.anchor.x = Math.round(minLbl.width * 0.5) / minLbl.width;
                        var max = limit.max.replace(',', '.')
                         max = parseFloat(max) % 1 == 0 ? parseFloat(max).toFixed(0) : max;
                         max = max > 9999 ? kFormater(max) : max;
                        var maxLbl = limitPopup.addChild(self.add.text(x + 360, y, max, {
                            font: "25px ProximaNova",
                            fill: "#fff",
                            align: "center"
                        }));
                        maxLbl.anchor.x = Math.round(maxLbl.width * 0.5) / maxLbl.width;
                        var rateLbl = limitPopup.addChild(self.add.text(x + 490, y, limit.winRateText, {
                            font: "25px ProximaNova",
                            fill: "#fff",
                            align: "center"
                        }));

                        rateLbl.anchor.x = Math.round(rateLbl.width * 0.5) / rateLbl.width;
                    }

                    showLimitRow(500, 130, {
                        name: $.client.getLocalizedString("Straight", true),
                        min: selectedLimits.Straight.Min,
                        max: selectedLimits.Straight.Max,
                        winRateText: "35:1"
                    });
                    showLimitRow(500, 160, {
                        name: $.client.getLocalizedString("Split", true),
                        min: selectedLimits.Split.Min,
                        max: selectedLimits.Split.Max,
                        winRateText: "17:1"
                    });
                    
                    showLimitRow(500, 190, {
                        name: $.client.getLocalizedString("Street", true),
                        min: selectedLimits.Street.Min,
                        max: selectedLimits.Street.Max,
                        winRateText: "11:1"
                    });
                    showLimitRow(500, 225, {
                        name: $.client.getLocalizedString("Corner", true),
                        min: selectedLimits.Corner.Min,
                        max: selectedLimits.Corner.Max,
                        winRateText: "8:1"
                    });
                    showLimitRow(500, 260, {
                        name: $.client.getLocalizedString("Sixline", true),
                        min: selectedLimits.Line.Min,
                        max: selectedLimits.Line.Max,
                        winRateText: "5:1"
                    });
                    showLimitRow(500, 295, {
                        name: $.client.getLocalizedString("First column", true),
                        min: selectedLimits.Column_Dozen.Min,
                        max: selectedLimits.Column_Dozen.Max,
                        winRateText: "2:1"
                    });
                    showLimitRow(500, 330, {
                        name: $.client.getLocalizedString("Second column", true),
                        min: selectedLimits.Column_Dozen.Min,
                        max: selectedLimits.Column_Dozen.Max,
                        winRateText: "2:1"
                    });
                    showLimitRow(500, 365, {
                        name: $.client.getLocalizedString("Third column", true),
                        min: selectedLimits.Column_Dozen.Min,
                        max: selectedLimits.Column_Dozen.Max,
                        winRateText: "2:1"
                    });
                    showLimitRow(500, 400, {
                        name: $.client.getLocalizedString("Dozens", true),
                        min: selectedLimits.Column_Dozen.Min,
                        max: selectedLimits.Column_Dozen.Max,
                        winRateText: "2:1"
                    });
                    showLimitRow(500, 435, {
                        name: $.client.getLocalizedString("Odd/Even", true),
                        min: selectedLimits.Fifty_Fifty.Min,
                        max: selectedLimits.Fifty_Fifty.Max,
                        winRateText: "1:1"
                    });
                    showLimitRow(500, 475, {
                        name: $.client.getLocalizedString("High/Low", true),
                        min: selectedLimits.Fifty_Fifty.Min,
                        max: selectedLimits.Fifty_Fifty.Max,
                        winRateText: "1:1"
                    });
                    showLimitRow(500, 510, {
                        name: $.client.getLocalizedString("Red/Black", true),
                        min: selectedLimits.Fifty_Fifty.Min,
                        max: selectedLimits.Fifty_Fifty.Max,
                        winRateText: "1:1"
                    });
                    showLimitRow(500, 545, {
                        name: $.client.getLocalizedString("Table", true),
                        min: selectedLimits.Table.Min,
                        max: selectedLimits.Table.Max,
                        winRateText: ""
                    });

                }
            }
        };
        self.createTimer=function (totalTime, endCallback, updateCallback) {
            var timer;
            timerSprite.totalTime = totalTime;
            timerSprite.time = totalTime;
            timerSprite.endCallback = endCallback;
            timerSprite.updateCallback = updateCallback;
            timerSprite.bg = frameGroup.create(20, 650, 'timer', 0);
            timerSprite.bg.scale.set(1.25);
            timerSprite.text = this.add.text(timerSprite.bg.x + 37, timerSprite.bg.y + 20, totalTime, {
                font: "30px ProximaNova",
                fill: "#fff"
            });
            timerSprite.text.anchor.x = Math.round(timerSprite.text.width * 0.5) / timerSprite.text.width;
            frameGroup.add(timerSprite.text);

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
                    timerSprite.endCallback = null;
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
        };
        if (!self.wheel)
            self.wheel = self.showWheel();
        else if (game.state.states.MainMenu.videoDisabled) {
            videoBtn.clicked = false;
            videoBtn.alpha = 0;
            self.hideVideo();
        }

        if (MessageDispatcher.timer) {
            MessageDispatcher.timer = self.createTimer(MessageDispatcher.timer.time, MessageDispatcher.timer.endCallback, MessageDispatcher.timer.updateCallback)
        }
    },
    update: function () {
        if (wheel) {
            wheel.wheelAngle = wheel.angle >= 0 ? wheel.angle : 360 + wheel.angle;
            wheel.ballAngle = ball.angle >= 0 ? ball.angle : 360 + ball.angle;
            wheel.diff = parseInt(wheel.wheelAngle - wheel.ballAngle) + 5;
            wheel.diff = wheel.diff > 0 ? wheel.diff : 360 + wheel.diff;
            if (wheel.number > -1 || wheel.waitNumber) {
                if ((wheel.numberDeg + 6 > wheel.diff && wheel.numberDeg <= wheel.diff)) {
                        var date = new Date();
                        var time = (date - wheel.startTime)/1000;
                        if (time >= 4) {
                        wheel.number = -1;
                        wheel.pivotX=120;
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
    showWheel: function() {
        var obj = {};
        var self = this;
        var wheelNumberMap = [10, 23, 8, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32, 0, 26, 3, 35, 12, 28, 7, 29, 18, 22, 9, 31, 14, 20, 1, 33, 16, 24, 5];
        wheel = this.add.sprite(373, 400, 'wheel');
        wheelGroup.add(wheel);
        wheel.anchor.setTo(0.5, 0.5);
        wheel.waitNumber = false;
        ball = this.add.sprite(373, 400, 'ball', 0);
        wheel.pivotX = 120;
        ball.pivot.x = 120;
        obj.spin = function (value) {
            if (value==undefined || value < 0)
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
        if (game.state.states.MainMenu.videoDisabled) {
            videoBtn.clicked = false;
            videoBtn.alpha = 0;
            self.hideVideo();
        }
        return obj;
    },
    changeGameSize: function () {
            setTimeout(function () {
                changeVideoSize();
            }, 400);
            var wScale = $(window).innerWidth() / GAME_WIDTH;
            var hScale = $(window).innerHeight() / GAME_HEIGHT;
            if (wScale < hScale) {
                wScale = hScale = Math.min($(window).innerWidth() / GAME_WIDTH, $(window).innerHeight() / GAME_HEIGHT);
                game.scale.setUserScale(wScale, wScale);
            } else {
                game.scale.setUserScale(hScale, hScale);
            }
            var sDif = Math.abs(wScale - hScale) * window.devicePixelRatio;
            game.scale.refresh();

    },  
    exitGame: function(){
    	window.top.closeGame();
    }, 
    resetTable: function () {
        if (selectedChipsGroup.children && selectedChipsGroup.children.length > 0) {
            selectedChipsGroup.removeChildren();
        }
        if (headerBetInputVal !== undefined) {
            headerBetInputVal.setText($.client.UserData.CurrencySign + '0');
        }
        tableChips = [];
        previousBetChips = [];
        summaDeb = 0;
        if (placeHold !== undefined) {
            placeHold.kill();
        }
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
    cellOver: function (element) {
        if (false) {
            var self = this;
        borderPosArr = element['name'].split('_');
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
                        }
                    }
                }
                    break;
                case betType.multiSelect: {
                    self.multySelect({ first: element.first, last: element.last, colFirst: element.colFirst, colLast: element.colLast, toggle: false, toggleType: "over" });
                    element.alpha = 0.5;
                }
                    break;
                case betType.arrSelect: {
                    this.slectArrayEl({ arr: element.numbers, toggle: false, toggleType: "over" });
                    element.alpha = 0.5;
                }
                    break;
            }
        }
        }
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
                        }
                    }
                }
                    break;
                case betType.multiSelect: {
                    self.multySelect({ first: element.first, last: element.last, colFirst: element.colFirst, colLast: element.colLast, toggle: false, toggleType: "out" });
                    element.alpha = 0;
                }
                    break;
                case betType.arrSelect: {
                    this.slectArrayEl({ arr: element.numbers, toggle: false, toggleType: "out" });
                    element.alpha = 0;
                }
                    break;
 
            }
        }
    },
    cellClick: function (element) {
        var self = this;
        if (self.makeBet(self.makeBetobject(element)))
            this.confirmBet();
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
    slectArrayEl: function (pars) {
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
                }
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
                                headerBetInputVal.setText('0');
                            }
                            tableChips = [];
                            previousBetChips = [];
                            MessageDispatcher.userBets = [];
                            summaDeb = 0;
                            USER_BALANCE = responce.ResponseData.balance;
                            headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                            self.changeStatus($.client.getLocalizedString('TEXT_BETS_CANCELED', true), 0, true, 3000);
                        }
                    }
                }, function(err) {
                    console.log(err);
                });
        }
    },
    cancelLastBet: function (element) {
        var self = this;
        if (tableChips.length > 0 && previousBetChips.length > 0) {
            function cancel(cancelBet) {
                $.client.sendPost(JSON.stringify({
                    type: "cancel_last",
                    bet: cancelBet.bet
                }), function (responce) {
                    if (responce.IsSuccess) {
                        if (responce.ResponseData.success) {
                            var bet = cancelBet.bet;
                            var chip = cancelBet.chip;
                            tableChips.splice(tableChips.indexOf(bet), 1);
                            MessageDispatcher.userBets.splice(tableChips.indexOf(bet), 1);
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
                }, function (err) {
                    console.log(err);
                });
            }
            var cancelBet;
            for (var i = 0; i < previousBetChips[previousBetChips.length - 1].length; i++) {
                cancelBet = previousBetChips[previousBetChips.length - 1][i];
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
            roundBetChips = previousBetChips.slice(0);
        }
        previousBetChips = [];
    },
    clearLastBet: function (element) {
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
                var bets=[];
                for (var i = 0; i < roundBetChips.length; i++) {
                    for (var j = 0; j < roundBetChips[i].length; j++) {
                        var pBet = roundBetChips[i][j];
                        var bet = { name: pBet.name, type: pBet.type, amount: pBet.amount, bet: pBet.bet };
                        var isValidBet = this.checkLimit(bet);
                        if (isValidBet.state) {
                            $.each(isValidBet.chips, function (i, chipId) {
                                var debValue = dib_cost[chipId];
                                bet.amount = debValue;
                                bets.push({ betInfo: bet });
                            });
                        }
                    }
                }
                self.drawBetsChip(bets, true);
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
            var notSentChipsArray = $.grep(tableChips, function (n, i) {
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
                }), function (responce) {
                    if (responce.IsSuccess) {
                        USER_BALANCE = responce.ResponseData.balance;
                        headerBalansInputVal.setTitle($.client.UserData.CurrencySign + (USER_BALANCE > 99999 ? kFormater(USER_BALANCE) : parseFloat(USER_BALANCE).toFixed(2)));
                        if (responce.ResponseData.success) {
                            errText = $.client.getLocalizedString('TEXT_INFO_BET_CONFIRMED', true);
                            showInfoText = false;
                            previousBetChips.push($.grep(tableChips, function (n, i) {
                                return (!n.sent || !n.submit);
                            }));
                            for (var i = 0; i < responce.ResponseData.bets.length; i++) {
                                if (notSentChipsArray[i]) {
                                    notSentChipsArray[i].sent = responce.ResponseData.bets[i].wasMade;
                                }
                                MessageDispatcher.userBets.push({ betInfo: responce.ResponseData.bets[i] });
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
                        errText = $.client.getLocalizedString('TEXT_INFO_BET_NOT_CONFIRMED', true);
                        self.clearAllBet(false);
                    }
                    isSubmiting = false;
                    if (errText) {
                        if (showInfoText) {
                            infoText.setTitle(errText);
                        }
                    }
                }, function (err) {
                    isSubmiting = false;
                    self.clearAllBet(false);
                    console.log(err);
                });
            }
        } else {
            setTimeout(function () {
                self.confirmBet();
            }, 100);
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
                return false;
            }
        }
    },
    drawBetsChip: function (bets, notSent) {
        var self = this, betObj, chipId = 0, betAmount = 0;
        for (var i in bets) {
            betObj = {};
            for (var j in tableGroup.children) {
                if (tableGroup.children[j].bet_name == bets[i].betInfo.name || tableGroup.children[j].name == bets[i].betInfo.name)
                    betObj = self.makeBetobject(tableGroup.children[j]);
            }
            betAmount += bets[i].betInfo.amount;
            for (var a in dib_cost) {
                if (dib_cost[a] === bets[i].betInfo.amount)
                    chipId = parseInt(a);
            }
            betObj.bets.amount = bets[i].betInfo.amount;
            previousBetChips.push([self.drawChip(betObj, chipId, notSent ? false : true, notSent ? false : true)]);
            summaDeb = betAmount;
            if (headerBetInputVal !== undefined) {
                headerBetInputVal.setTitle($.client.UserData.CurrencySign + (summaDeb > 99999 ? kFormater(summaDeb) : summaDeb).toString());
            }
        }
    },
    drawChip: function (element, chipId, sent, submit) {
        var self = this;
        var debValue, elementX, elementY;
        var event = $.extend(true, {}, element);
        var betChip = { name: event.name, type: event.bet_type, amount: dib_cost[chipId], bet: event.bets, sent: sent, submit: submit, chips: event.chips };
        debValue = dib_cost[chipId];
        var chipAmount = debValue;
        betChip.bet.amount = dib_cost[chipId];
        betChip.bet.name = event.bet_name;
        elementX = element.x + element.width / 2 - 27;
        elementY = element.y + element.height / 2 - 27;
        betChip.chip = self.add.graphics(elementX, elementY, selectedChipsGroup);
        betChip.active_sprite = self.add.sprite(0, 0, "chips", chipId*2);
        betChip.active_sprite.scale.set(0.5);
        betChip.active_sprite.fId = chipId * 2;
        betChip.chip.addChild(betChip.active_sprite);
        for (var i = 0; i < tableChips.length; i++) {
            if (tableChips[i].name == betChip.name) {
                chipAmount += tableChips[i].amount;
            }
        }
        chipAmount = chipAmount % 1 == 0 ? chipAmount : parseFloat(chipAmount).toFixed(1);
        betChip.chipText = self.add.text(27, 13, (chipAmount > 999 ? kFormater(chipAmount) : chipAmount), {
            font: "bold 27px ProximaNova",
            fill: "#fff"
        });
        betChip.chipText.anchor.x = Math.round(betChip.chipText.width * 0.5) / betChip.chipText.width;
        betChip.chip.addChild(betChip.chipText);
        tableChips.push(betChip);
        tableGroup.add(betChip.chip);
        selectedChipsGroup.add(betChip.chip);
        return betChip;
    },
    changeChips: function (element) {
            selectedChipId = element.id;
            chipsGroup.forEach(function (item) {
                if (item.key == "chips")
                    if (item.id == selectedChipId) {
                     //   item.y = item.rY - 30;
                     //   item.x = item.rX - 15;
            //            item.chipText.y = item.rY + 20;
                        item.loadTexture(item.key, item.id*2 + 1);
                    } else {
                     //   item.y = item.rY;
                     //   item.x = item.rX;
          //              item.chipText.y = item.rY + 35;
                        item.loadTexture(item.key, item.id*2);
                    }
            });
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
                self.closeLimitSelectionPopup();
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
        tableGroup.setAll('inputEnabled', true);
        buttonGroup.setAll('clicked', true);
    },
    closeLimitSelectionPopup: function() {
        isModalShow = false;
        if ((limitPopupTween && limitPopupTween.isRunning)) {
            return;
        }
        if (limitSelectionPopup) {
            limitPopupTween = this.add.tween(limitSelectionPopup).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
            limitSelectionPopup.destroy();
        }
         tableGroup.setAll('inputEnabled', true);
        gameBtnGroup.setAll('clicked', true);
    },
    closeHistoryPopup: function () {
        historyPopup.destroy(); 
        isModalShow = false;
        tableGroup.setAll('inputEnabled', true);
        buttonGroup.setAll('clicked', true); 
    },
    closeStatPopup: function () {
        statPopup.destroy();
        this.statShow = false;
        isModalShow = false; 
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
                    self.showStatisticData();
                }
            }
        }, function (err) {
            setTimeout(function(){
                self.updateStatistics();
            },1000)
            console.log(err);
        });
    },
    restartGame: function () {
        startGameBtn.btn.inputEnabled = true;
        startGameBtn.alpha = 1;
        
    },
    hideVideoBtn: function () {
    },
    showVideoBtn: function () {
    },
    playWinNumberSound: function (number) {
        $.client.playSound('../../sounds/numbers/' + number + '.mp3');
    },
    clearWinAmout: function() {
   // headerWinInputVal.setText($.client.UserData.CurrencySign + 0);
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
    },
    enableActionBtn: function (enabled) {
        if (enabled) {
            cancelAllBetBtn.tint = 0xFFFFFF;
            cancelLastBtn.tint = 0xFFFFFF;
            repeatBetBtn.tint = 0xFFFFFF;
        } else {
            cancelAllBetBtn.tint = 0x878787;
            cancelLastBtn.tint = 0x878787;
            repeatBetBtn.tint = 0x878787;
        }
    },
    showDolly: function(number) {
        for (var i = 0; i < tableGroup.children.length; i++) {
            if (tableGroup.children[i].bet_name == number) {
                dolly = this.add.sprite(tableGroup.children[i].x + 15, tableGroup.children[i].y+5, 'placeholder');
                dolly.alpha = 0.65;
                worldGroup.add(dolly);
            }
        }
    },
    hideDolly: function() {
        worldGroup.remove(dolly);
    }
};
