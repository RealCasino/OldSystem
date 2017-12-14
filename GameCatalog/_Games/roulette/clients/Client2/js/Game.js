
var 
    TABLE_MIN_BET, TABLE_MAX_BET,
    STRAIGHT_MIN_BET, STRAIGHT_MAX_BET,
    COLUMN_DOZEN_MIN_BET, COLUMN_DOZEN_MAX_BET,
    FIFTY_FIFTY_MIN_BET, FIFTY_FIFTY_MAX_BET,



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
var tableCell = {},  Dozen ={}, Column = {}, Orphelins = {}, Neighbors = {}, Roulette = {};
var previousMsgType, winAmount = 0, lastChangeStatus, startGameBtn,provablyBtn;

Roulette.Preloader = function (game) {
this.ready = false;
};

Roulette.Preloader.prototype = {
    init: function () {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;
        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.scale.setUserScale(SCALE, SCALE);
        this.scale.refresh();
    },
    preload: function () {
        this.load.image('gameFrame', 'images/phone_bg_h.png');
        this.load.image('videoBtn', 'images/phone_video_btn_h.png');
        this.load.image('table', 'images/phone_table_h.png');
        this.load.image('mainBtnBg', '../Client3/images/phone_game_btn_bg.png');
        this.load.image('winnerBg', '../Client3/images/phone_winner_bg.png');
        this.load.image('cell_select', '../Client3/images/cell_select.png');
        this.load.image('numberBg', '../Client3/images/number_bg.png');
        this.load.image('closeBtn', '../Client3/images/modal_close_btn.png');
        this.load.image('historyBg', '../Client3/images/history_bg.png');
        this.load.image('statBg', '../Client3/images/stat_bg.png');
        this.load.image('limitsBg', '../Client3/images/limit_bg.png');
        this.load.image('tableBg', '../Client3/images/phone_bg_v.png');
        this.load.image('modalBg', '../Client3/images/modal_bg.png');
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
        this.load.spritesheet('chips', '../Client3/images/phone_chips.png', 110, 110);
        this.load.spritesheet('statChartBg', '../Client3/images/stat_chart_bg.png', 169, 50);
        this.load.spritesheet('menuBtn', '../Client3/images/phone_menu_btn.png', 72, 53);
        this.load.spritesheet('buttonsBg', '../Client3/images/phone_buttons_bg.png', 435, 65);
     
        this.game.load.onFileComplete.add(this.updateProgressBar, this);
    },

    create: function () { 
        var self = this;
        this.scale.setUserScale(SCALE, SCALE);
        this.scale.refresh();
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
Roulette.Game = function(game){ 
};
Roulette.Game.prototype = {    
    create: function () {
        var self = this;
        $.client.enableSound(false);
        for (var a = 0; a <= NUM_DIB; a++) {
            dib_cost[a] = dib_cost[a] * $.client.UserData.CurrencyMultiplier;
        }
        self.initLayout();
        game.scale.setGameSize(GAME_WIDTH, GAME_HEIGHT);
        self.changeGameSize();
        tableChips = [];
        if (self.mode == "Manual" && MessageDispatcher.gameStatus == GAMESTATE_CODE_TABLE_OPENED) {
            self.restartGame();
        }
        self.drawBetsChip(MessageDispatcher.userBets);
        if (self.previousState)
            self.changeStatus(self.previousState.text, self.previousState.statusIndex, self.previousState.showModal);

        game.scale.setGameSize(GAME_WIDTH, GAME_HEIGHT);

        window.addEventListener("resize", function () {
            self.changeGameSize();
        }, false);
    },
    initLayout: function () {

        var self = this;
        var bottomBetLabel, balansLabel, gameIdLabel, dateTimeLabel,
             limitBtn, statsBtn, historyBtn,
             chipsEl, table;

        var spriteXY, spriteX, spriteY;
          TABLE_WIDTH = 1400,
          TABLE_HEIGHT = 600,
          DIB_WIDTH = 116,
          DIB_HEIGHT = 200,
          DIB_SPASE = 3.5,
          TABLE_ROWS = Math.floor(TABLE_WIDTH / DIB_WIDTH),
          TABLE_COLS = Math.floor(TABLE_HEIGHT / DIB_HEIGHT);

        worldGroup = this.add.group();
        scrollGroup = this.add.group();
        gameBtnGroup = this.add.group();
        videoGroup = this.add.group();
        videoGroup = this.add.group();
        tableGroup = this.add.group();
        chipsGroup = this.add.group();
        worldGroup.add(tableGroup);
        worldGroup.add(scrollGroup);
        frameGroup = this.add.group();
        footerGroup = this.add.group();
        frenchGroup = this.add.group();
        limitGroup = this.add.group();
        topBarGroup = this.add.group();
        statusGroup = this.add.group();
        bottomBarGroup = this.add.group();
        buttonGroup = this.add.group();
        selectedChipsGroup = this.add.group();

        worldGroup.add(frameGroup);
        worldGroup.add(tableGroup);
        scrollGroup.add(tableGroup);
        worldGroup.add(frenchGroup);
        worldGroup.add(footerGroup);
        worldGroup.add(gameBtnGroup);
        scrollGroup.add(buttonGroup);

        worldGroup.add(buttonGroup);
        worldGroup.add(limitGroup);
        worldGroup.add(statusGroup);
        buttonGroup.priorityID = 3;
        gameFrame = this.add.sprite(0, 0, 'gameFrame');
        table = this.add.sprite(30, 100, 'table');
        table.width = 1700;
        table.height = 800;
        frameGroup.add(gameFrame);
        frameGroup.add(table);
        tableGroup.add(selectedChipsGroup);
        frameGroup.add(tableGroup);
        frameGroup.add(bottomBarGroup);
//      buttonGroup.add(gameBtnGroup);

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
            x: 490,
            y: 30,
            font: "ProximaNova",
            size: 27,
            color: "#fff",
            centered: false,
            maxHeight: 30,
            maxWidth: 150
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
            maxWidth: 160
        });
        bottomBarGroup.add(headerBetInputVal);

        tableStatus = this.add.sprite(1400, 20, 'statusBg', 0);
        tableStatus.height = 50;
        tableStatus.width = 500;
        frameGroup.add(tableStatus);

        infoText = createTextLbl(self, {
            text: $.client.getLocalizedString("PLEASE WAIT FOR THE NEXT OPEN TABLE", true).toUpperCase(),
            x: 1650,
            y: 25,
            font: "ProximaNova",
            size: 37,
            color: "#fff",
            centered: true,
            maxHeight: 37,
            maxWidth: 500
        });
        frameGroup.add(infoText);

        repeatBetBtn = self.add.button(1020, 940, "mainBtnBg", function () {
            self.repeatBets();
        }, this);
        repeatBetBtn.height = 100;
        repeatBetBtn.width = 250;
        repeatBetBtn.alpha = 0;
        repeatBetBtn.clicked = true;

        repeatBetBtn.priorityID = 10;
        repeatBetBtn.text = createTextLbl(self, {
            text: $.client.getLocalizedString('Repeat', true).toUpperCase(),
            x: 1080,
            y: 970,
            font: "ProximaNova",
            size: 42,
            color: "#fff",
            maxHeight: 85,
            maxWidth: 160
        });
        gameBtnGroup.add(repeatBetBtn);
        gameBtnGroup.add(repeatBetBtn.text);

      
        cancelAllBetBtn = self.add.button(1300, 940, "mainBtnBg", function () {
            self.cancelAllBet();
        }, this);
        cancelAllBetBtn.clicked = true;
        cancelAllBetBtn.height = 100;
        cancelAllBetBtn.width = 250;
        cancelAllBetBtn.alpha = 0;
        cancelAllBetBtn.priorityID = 10;
        cancelAllBetBtn.text = createTextLbl(self, {
            text: $.client.getLocalizedString('Clear', true).toUpperCase(),
            x: 1360,
            y: 970,
            font: "ProximaNova",
            size: 42,
            color: "#fff",
            maxHeight: 85,
            maxWidth: 160
        });
        gameBtnGroup.add(cancelAllBetBtn);
        gameBtnGroup.add(cancelAllBetBtn.text);

        cancelLastBtn = self.add.button(1580, 940, "mainBtnBg", function () {
            self.cancelLastBet();
        }, this);
        cancelLastBtn.clicked = true;
        cancelLastBtn.height = 100;
        cancelLastBtn.width = 250;
        cancelLastBtn.alpha = 0;
        cancelLastBtn.priorityID =10;
        cancelLastBtn.text = createTextLbl(self, {
            text: $.client.getLocalizedString('Back', true).toUpperCase(),
            x: 1640,
            y: 970,
            font: "ProximaNova",
            size: 42,
            color: "#fff",
            maxHeight: 85,
            maxWidth: 160
        });
        gameBtnGroup.add(cancelLastBtn);
        gameBtnGroup.add(cancelLastBtn.text);
 

        menuBtn = this.add.button(1800, 400, 'menuBtn', function () {
            self.showMenu();
        }, this, 0);
        menuBtn.input.useHandCursor = true;
        menuBtn.scale.set(0.9);
        menuBtn.clicked = true;
        gameBtnGroup.add(menuBtn);
        dateTimeLabel = createTextLbl(self, {
            text: $.DateFormat(MessageDispatcher.serverTime.toString(), "yyyy-MM-dd | HH:mm:ss"),
            x: 960,
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
            x: 960,
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
        var startGameBtnBg = this.add.button(1620, 750, 'spinBtn', this.startGame);
        startGameBtnBg.scale.set(1.2);
        startGameBtnBg.clicked = true;
        startGameBtnBg.input.enabled = false;
        startGameBtnBg.input.useHandCursor = true;
        startGameBtn.btn = startGameBtnBg;
        startGameBtn.add(startGameBtnBg);
        startGameBtn.alpha = 0;
        gameBtnGroup.add(startGameBtn);
        var muteBtn = this.add.button(40, 750, 'muteIco', function () {
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
        muteBtn.scale.set(1.2);
        gameBtnGroup.add(muteBtn);

        var chipSpriteId = 0;
        for (var a = 0; a <= NUM_DIB; a++) {
            if (a === selectedChipId) {
                chipsEl = chipsGroup.create(105 + ((NUM_DIB - a) * 160), 920, 'chips', chipSpriteId + 1);
            } else {
                chipsEl = chipsGroup.create(105 + ((NUM_DIB - a) * 160), 920, 'chips', chipSpriteId);
            }
            chipsEl.id = a;
            chipSpriteId += 2;
            chipsEl.debValue = dib_cost[a];
            chipsEl.inputEnabled = true;
            chipsEl.scale.set(1.3);
            chipsEl.input.useHandCursor = true;
            chipsEl.events.onInputDown.add(this.changeChips, this);
            chipsEl.rY = chipsEl.y;
            chipsEl.rX = chipsEl.x;
            chipsEl.chipText = this.add.text(chipsEl.x + 70, chipsEl.y + 45, dib_cost[a], {
                font: "bold 50px  ProximaNova",
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
                tableCell[cellName] = tableGroup.create(table.x + 122 + j * (DIB_WIDTH + DIB_SPASE), table.y + 410 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
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

                spriteX = tableGroup.create(table.x + 122 + j * (DIB_WIDTH + DIB_SPASE), table.y + 595 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
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

                spriteY = tableGroup.create(table.x + 105 + j * (DIB_WIDTH + DIB_SPASE), table.y + 410 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
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

                spriteXY = tableGroup.create(table.x + 105 + j * (DIB_WIDTH + DIB_SPASE), table.y + 595 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
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
        tableCell['zero'] = tableGroup.create(table.x + 2, table.y + 2, 'cell_select');
        tableCell['zero'].name = '0';

        tableCell['zero'].bet_name = '0';
        tableCell['zero'].bet_type = 'straight';

        tableCell['zero'].type = betType.straight;
        tableCell['zero'].alpha = 0;
        tableCell['zero'].width = 110;
        tableCell['zero'].height = 600;

        tableCell['zero'].inputEnabled = true;
        tableCell['zero'].events.onInputUp.add(this.cellClick, this);
        tableCell['zero'].events.onInputOver.add(this.cellOver, this);
        tableCell['zero'].events.onInputOut.add(this.cellOut, this);

        Dozen['one'] = tableGroup.create(table.x + 125, table.y + 610, 'cell_select');
        Dozen['one'].name = 'dozenOne';
        Dozen['one'].bet_name = 'first12';
        Dozen['one'].bet_type = 'dozen';
        Dozen['one'].items = [0];
        Dozen['one'].first = 0;
        Dozen['one'].last = 4;
        Dozen['one'].alpha = 0;
        Dozen['one'].width = 470;
        Dozen['one'].height = 100;
        Dozen['one'].type = betType.multiSelect;
        Dozen['one'].inputEnabled = true;
        Dozen['one'].events.onInputUp.add(this.cellClick, this);
        Dozen['one'].events.onInputOver.add(this.cellOver, this);
        Dozen['one'].events.onInputOut.add(this.cellOut, this);

        Dozen['two'] = tableGroup.create(table.x + 605, table.y + 610, 'cell_select');
        Dozen['two'].name = 'dozenTwo';
        Dozen['two'].bet_name = 'second12';
        Dozen['two'].bet_type = 'dozen';
        Dozen['two'].items = [1];
        Dozen['two'].type = betType.multiSelect;
        Dozen['two'].alpha = 0;
        Dozen['two'].width = 470;
        Dozen['two'].height = 100;
        Dozen['two'].first = 4;
        Dozen['two'].last = 8;
        Dozen['two'].inputEnabled = true;
        Dozen['two'].events.onInputUp.add(this.cellClick, this);
        Dozen['two'].events.onInputOver.add(this.cellOver, this);
        Dozen['two'].events.onInputOut.add(this.cellOut, this);

        Dozen['three'] = tableGroup.create(table.x + 1080, table.y + 610, 'cell_select');
        Dozen['three'].name = 'dozenThree';
        Dozen['three'].bet_name = 'third12';
        Dozen['three'].bet_type = 'dozen';
        Dozen['three'].items = [2];
        Dozen['three'].type = betType.multiSelect;
        Dozen['three'].alpha = 0;
        Dozen['three'].width = 470;
        Dozen['three'].height = 100;
        Dozen['three'].first = 8;
        Dozen['three'].last = 12;
        Dozen['three'].inputEnabled = true;
        Dozen['three'].events.onInputUp.add(this.cellClick, this);
        Dozen['three'].events.onInputOver.add(this.cellOver, this);
        Dozen['three'].events.onInputOut.add(this.cellOut, this);

        Column['one'] = tableGroup.create(table.x + 1565, table.y + 405, 'cell_select');
        Column['one'].name = 'columnOne';
        Column['one'].bet_name = 'col1';
        Column['one'].bet_type = 'column';
        Column['one'].items = [0];
        Column['one'].type = betType.multiSelect;
        Column['one'].alpha = 0;
        Column['one'].width = 130;
        Column['one'].height = 200;
        Column['one'].first = 0;
        Column['one'].last = 12;
        Column['one'].colFirst = 0;
        Column['one'].colLast = 1;
        Column['one'].inputEnabled = true;
        Column['one'].events.onInputUp.add(this.cellClick, this);
        Column['one'].events.onInputOver.add(this.cellOver, this);
        Column['one'].events.onInputOut.add(this.cellOut, this);

        Column['two'] = tableGroup.create(table.x + 1565, table.y + 200, 'cell_select');
        Column['two'].name = 'columnTwo';
        Column['two'].bet_name = 'col2';
        Column['two'].bet_type = 'column';
        Column['two'].items = [1];
        Column['two'].type = betType.multiSelect;
        Column['two'].alpha = 0;
        Column['two'].width = 130;
        Column['two'].height = 200;
        Column['two'].first = 0;
        Column['two'].last = 12;
        Column['two'].colFirst = 1;
        Column['two'].colLast = 2;
        Column['two'].inputEnabled = true;
        Column['two'].events.onInputUp.add(this.cellClick, this);
        Column['two'].events.onInputOver.add(this.cellOver, this);
        Column['two'].events.onInputOut.add(this.cellOut, this);

        Column['three'] = tableGroup.create(table.x + 1565, table.y + 0, 'cell_select');
        Column['three'].name = 'columnThree';
        Column['three'].bet_name = 'col3';
        Column['three'].bet_type = 'column';
        Column['three'].type = betType.multiSelect;
        Column['three'].items = [2];
        Column['three'].alpha = 0;
        Column['three'].width = 130;
        Column['three'].height = 200;
        Column['three'].first = 0;
        Column['three'].last = 12;
        Column['three'].colFirst = 2;
        Column['three'].colLast = 3;
        Column['three'].inputEnabled = true;
        Column['three'].events.onInputUp.add(this.cellClick, this);
        Column['three'].events.onInputOver.add(this.cellOver, this);
        Column['three'].events.onInputOut.add(this.cellOut, this);


        Orphelins['low'] = tableGroup.create(table.x + 125, table.y + 710, 'cell_select');
        Orphelins['low'].name = 'low';
        Orphelins['low'].bet_name = 'first18';
        Orphelins['low'].bet_type = 'high_low';
        Orphelins['low'].items = ['low'];
        Orphelins['low'].type = betType.multiSelect;
        Orphelins['low'].width = 235;
        Orphelins['low'].height = 90;
        Orphelins['low'].first = 0;
        Orphelins['low'].last = 6;
        Orphelins['low'].alpha = 0;
        Orphelins['low'].inputEnabled = true;
        Orphelins['low'].events.onInputUp.add(this.cellClick, this);
        Orphelins['low'].events.onInputOver.add(this.cellOver, this);
        Orphelins['low'].events.onInputOut.add(this.cellOut, this);

        Orphelins['high'] = tableGroup.create(table.x + 1320, table.y + 710, 'cell_select');
        Orphelins['high'].name = 'high';
        Orphelins['high'].bet_name = 'second18';
        Orphelins['high'].bet_type = 'high_low';
        Orphelins['high'].items = ['high'];
        Orphelins['high'].type = betType.multiSelect;
        Orphelins['high'].width = 235;
        Orphelins['high'].height = 90;
        Orphelins['high'].first = 6;
        Orphelins['high'].last = 12;
        Orphelins['high'].alpha = 0;
        Orphelins['high'].inputEnabled = true;
        Orphelins['high'].events.onInputUp.add(this.cellClick, this);
        Orphelins['high'].events.onInputOver.add(this.cellOver, this);
        Orphelins['high'].events.onInputOut.add(this.cellOut, this);

        Orphelins['even'] = tableGroup.create(table.x + 365, table.y + 710, 'cell_select');
        Orphelins['even'].name = 'even';
        Orphelins['even'].bet_name = 'even';
        Orphelins['even'].bet_type = 'evens_odds';
        Orphelins['even'].items = ['evens'];
        Orphelins['even'].type = betType.arrSelect;
        Orphelins['even'].alpha = 0;
        Orphelins['even'].width = 235;
        Orphelins['even'].height = 90;
        Orphelins['even'].numbers = evenNumberArr;
        Orphelins['even'].inputEnabled = true;
        Orphelins['even'].events.onInputUp.add(this.cellClick, this);
        Orphelins['even'].events.onInputOver.add(this.cellOver, this);
        Orphelins['even'].events.onInputOut.add(this.cellOut, this);

        Orphelins['odd'] = tableGroup.create(table.x + 1080, table.y + 710, 'cell_select');
        Orphelins['odd'].name = 'odd';
        Orphelins['odd'].bet_name = 'odd';
        Orphelins['odd'].bet_type = 'evens_odds';
        Orphelins['odd'].items = ['odds'];
        Orphelins['odd'].type = betType.arrSelect;
        Orphelins['odd'].width = 235;
        Orphelins['odd'].height = 90;
        Orphelins['odd'].alpha = 0;
        Orphelins['odd'].numbers = oddNumberArr;
        Orphelins['odd'].inputEnabled = true;
        Orphelins['odd'].events.onInputUp.add(this.cellClick, this);
        Orphelins['odd'].events.onInputOver.add(this.cellOver, this);
        Orphelins['odd'].events.onInputOut.add(this.cellOut, this);

        Orphelins['black'] = tableGroup.create(table.x + 840, table.y + 710, 'cell_select');
        Orphelins['black'].name = 'black';
        Orphelins['black'].bet_name = 'black';
        Orphelins['black'].bet_type = 'color';
        Orphelins['black'].items = ['black'];
        Orphelins['black'].type = betType.arrSelect;
        Orphelins['black'].alpha =0;
        Orphelins['black'].width = 235;
        Orphelins['black'].height = 90;
        Orphelins['black'].numbers = blackNumberArr;
        Orphelins['black'].inputEnabled = true;
        Orphelins['black'].events.onInputUp.add(this.cellClick, this);
        Orphelins['black'].events.onInputOut.add(this.cellOut, this);

        Orphelins['red'] = tableGroup.create(table.x + 595, table.y + 710, 'cell_select');
        Orphelins['red'].name = 'red';
        Orphelins['red'].bet_name = 'red';
        Orphelins['red'].bet_type = 'color';
        Orphelins['red'].items = ['red'];
        Orphelins['red'].type = betType.arrSelect;
        Orphelins['red'].alpha = 0;
        Orphelins['red'].width = 235;
        Orphelins['red'].height = 90;
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
                modalBg.height = 1080;
                modalBg.width = 1920;
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
                menuBg = this.add.sprite(1500, 150, 'menuBg');
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
        };
        self.hideVideo= function (element) {
        };
        self.showWinner = function (winAmount) {
            var self = this;
            headerBalansInputVal.setText($.client.UserData.CurrencySign + parseFloat(USER_BALANCE).toFixed(2));
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
                    text: $.client.UserData.CurrencySign + parseFloat(winAmount).toFixed(2),
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
                    setTimeout(function() {
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
                modalBg.height = 1080;
                modalBg.width = 1920;
                modalBg.alpha = 0;
                textBg = self.add.button(0, 540, "modalBg", null, this);
                textBg.height = 0;
                bg.add(modalBg);
                bg.add(textBg);
                var text = self.add.text(960, 540, txt.toUpperCase(), {
                    font: "2px ProximaNova",
                    fill: "#fff"
                });
                text.anchor.x = Math.round(text.width * 0.5) / text.width;
                bg.add(text);
                game.add.tween(modalBg).to({ alpha: 0.8 }, 400, Phaser.Easing.Linear.None, true);
                game.add.tween(textBg).to({ y: 440 }, 600, Phaser.Easing.Linear.None, true);
                game.add.tween(textBg).to({ height: 200 }, 600, Phaser.Easing.Linear.None, true);
                self.add.tween(text).to({ fontSize: 70 }, 600, Phaser.Easing.Linear.None, true);
                self.add.tween(text).to({ y: 500 }, 600, Phaser.Easing.Linear.None, true);
                setTimeout(function() {
                    game.add.tween(modalBg).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true);
                    game.add.tween(textBg).to({ y: 540 }, 600, Phaser.Easing.Linear.None, true);
                    game.add.tween(text).to({ fontSize: 2 }, 600, Phaser.Easing.Linear.None, true);
                    self.add.tween(text).to({ y: 540 }, 600, Phaser.Easing.Linear.None, true);
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
                    text: $.client.UserData.CurrencySign + TOTAL_LOST,
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
                    numTextVal = item.number + '';
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
                    betText = self.add.text(posX + 135, posY + 11, $.client.UserData.CurrencySign + betAmount, { font: "30px ProximaNova", fill: "#fff", align: "center" });
                    betText.anchor.x = Math.round(betText.width * 0.5) / betText.width;
                    historyPopup.addChild(betText);
                    var winAmount = item.winAmount % 1 == 0 ? parseFloat(item.winAmount).toFixed(0) : parseFloat(item.winAmount).toFixed(2);
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


                    function showNumber(element, posX, posY) {
                        var numBg, numText, numTextVal, color;
                        numTextVal = element + '';
                        if (jQuery.inArray(parseInt(element, 10), blackNumberArr) != -1) {
                            color = "#ffffff";
                        } else if (jQuery.inArray(parseInt(element, 10), redNumberArr) != -1) {
                            color = "#ae3e3e";
                        } else {
                            color = "#459a59";
                        }
                        numBg = self.add.sprite(posX, posY, 'numberBg');
                        numBg.scale.set(1.2);
                        numText = self.add.text(numBg.x + 30, numBg.y + 15, numTextVal, { font: "28px ProximaNova", fill: color, align: "center" });
                        numText.anchor.x = Math.round(numText.width * 0.5) / numText.width;

                        statData.addChild(numBg);
                        statData.addChild(numText);

                    }

                    function showSectionNumber(posX, posY, label, value, spriteFrame) {
                        var statChartFirst, statChartSecond, statChartThird,
                            statChartFirstText, statChartSecondText, statChartThirdText
                        ;

                        statChartFirst = self.add.sprite(posX, posY, 'statChartBg', spriteFrame[0]);
                        statChartFirst.width = value[0] * 4.1;
                        statChartFirstText = self.add.text(statChartFirst.x + 10, statChartFirst.y + 10, '', { font: "28px ProximaNova", fill: "#ffffff", align: "center" });
                        if (value[0] > 20) {
                            statChartFirstText.text = label[0];
                        }

                        statData.addChild(statChartFirst);
                        statData.addChild(statChartFirstText);

                        statChartSecond = self.add.sprite(statChartFirst.x + statChartFirst.width, posY, 'statChartBg', spriteFrame[1]);
                        statChartSecond.width = value[1] * 4.4;
                        statChartSecondText = self.add.text(statChartSecond.x + 10, statChartSecond.y + 10, '', { font: "28px ProximaNova", fill: "#ffffff", align: "center" });
                        if (value[1] > 20) {
                            statChartSecondText.text = label[1];
                        }
                        statData.addChild(statChartSecond);
                        statData.addChild(statChartSecondText);

                        statChartThird = self.add.sprite(statChartSecond.x + statChartSecond.width, posY, 'statChartBg', spriteFrame[2]);
                        statChartThird.width = value[2] * 4.1;
                        statChartThirdText = self.add.text(statChartThird.x + 10, statChartThird.y + 10, '', { font: "28px ProximaNova", fill: "#ffffff", align: "center" });
                        if (value[2] > 20) {
                            statChartThirdText.text = label[2];
                        }
                        statData.addChild(statChartThird);
                        statData.addChild(statChartThirdText);

                    }

                    for (var i = 4; i < ststs.coldNumbers.length; i++) {
                        showNumber(ststs.coldNumbers[i].number, coldNumText.x + 257 + (i - 4) * 71, coldNumText.y - 15);
                    }

                    for (var i = 4; i < ststs.hotNumbers.length; i++) {
                        showNumber(ststs.hotNumbers[i].number, hotNumText.x + 257 + (i - 4) * 71, hotNumText.y - 15);
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
                        limitSelectionPopup.addChild(self.add.text(x + 30, y, limit.Title.toUpperCase(), {
                            font: "24px ProximaNova",
                            fill: "#fff",
                            align: "center"
                        }));
                        var tMin = parseFloat(limit.Table.Min) % 1 == 0 ? parseFloat(limit.Table.Min).toFixed(0) : limit.Table.Min.replace(',', '.');
                        var tMax = parseFloat(limit.Table.Max) % 1 == 0 ? parseFloat(limit.Table.Max).toFixed(0) : limit.Table.Max.replace(',', '.');
                        var tText = tMin + '/' + tMax;
                        var tableLbl = limitSelectionPopup.addChild(self.add.text(x + 160, y, tText, {
                            font: "24px ProximaNova",
                            fill: "#fff",
                            align: "center"
                        }));
                        tableLbl.anchor.x = Math.round(tableLbl.width * 0.5) / tableLbl.width;

                        var sMin = parseFloat(limit.Straight.Min) % 1 == 0 ? parseFloat(limit.Straight.Min).toFixed(0) : limit.Straight.Min.replace(',', '.');
                        var sMax = parseFloat(limit.Straight.Max) % 1 == 0 ? parseFloat(limit.Straight.Max).toFixed(0) : limit.Straight.Max.replace(',', '.');
                        var sText = sMin + '/' + sMax;
                        var straightLbl = limitSelectionPopup.addChild(self.add.text(x + 270, y, sText, {
                            font: "24px ProximaNova",
                            fill: "#fff",
                            align: "center"
                        }));
                        straightLbl.anchor.x = Math.round(straightLbl.width * 0.5) / straightLbl.width;

                        var cdMin = parseFloat(limit.Column_Dozen.Min) % 1 == 0 ? parseFloat(limit.Column_Dozen.Min).toFixed(0) : limit.Column_Dozen.Min.replace(',', '.');
                        var cdMax = parseFloat(limit.Column_Dozen.Max) % 1 == 0 ? parseFloat(limit.Column_Dozen.Max).toFixed(0) : limit.Column_Dozen.Max.replace(',', '.');
                        var cdText = cdMin + '/' + cdMax;
                        var cdLbl = limitSelectionPopup.addChild(self.add.text(x + 420, y, cdText, {
                            font: "24px ProximaNova",
                            fill: "#fff",
                            align: "center"
                        }));
                        cdLbl.anchor.x = Math.round(cdLbl.width * 0.5) / cdLbl.width;

                        var ffMin = parseFloat(limit.Fifty_Fifty.Min) % 1 == 0 ? parseFloat(limit.Fifty_Fifty.Min).toFixed(0) : limit.Fifty_Fifty.Min.replace(',', '.');
                        var ffMax = parseFloat(limit.Fifty_Fifty.Max) % 1 == 0 ? parseFloat(limit.Fifty_Fifty.Max).toFixed(0) : limit.Fifty_Fifty.Max.replace(',', '.');
                        var ffText = ffMin + '/' + ffMax;
                        var ffLbl = limitSelectionPopup.addChild(self.add.text(x + 590, y, ffText, {
                            font: "24px ProximaNova",
                            fill: "#fff",
                            align: "center"
                        }));
                        ffLbl.anchor.x = Math.round(ffLbl.width * 0.5) / ffLbl.width;

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
                        y: 570,
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
                        var min = parseFloat(min) % 1 == 0 ? parseFloat(min).toFixed(0) : min;
                        var minLbl = limitPopup.addChild(self.add.text(x + 210, y, min, {
                            font: "25px ProximaNova",
                            fill: "#fff",
                            align: "center"
                        }));
                        minLbl.anchor.x = Math.round(minLbl.width * 0.5) / minLbl.width;
                        var max = limit.max.replace(',', '.')
                        var max = parseFloat(max) % 1 == 0 ? parseFloat(max).toFixed(0) : max;
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
                        min: selectedLimits.Straight.Min,
                        max: selectedLimits.Straight.Max,
                        winRateText: "17:1"
                    });
                    showLimitRow(500, 190, {
                        name: $.client.getLocalizedString("Trio", true),
                        min: selectedLimits.Straight.Min,
                        max: selectedLimits.Straight.Max,
                        winRateText: "11:1"
                    });
                    showLimitRow(500, 225, {
                        name: $.client.getLocalizedString("Street", true),
                        min: selectedLimits.Straight.Min,
                        max: selectedLimits.Straight.Max,
                        winRateText: "11:1"
                    });
                    showLimitRow(500, 260, {
                        name: $.client.getLocalizedString("Corner", true),
                        min: selectedLimits.Straight.Min,
                        max: selectedLimits.Straight.Max,
                        winRateText: "8:1"
                    });
                    showLimitRow(500, 295, {
                        name: $.client.getLocalizedString("Sixline", true),
                        min: selectedLimits.Straight.Min,
                        max: selectedLimits.Straight.Max,
                        winRateText: "5:1"
                    });
                    showLimitRow(500, 330, {
                        name: $.client.getLocalizedString("First column", true),
                        min: selectedLimits.Column_Dozen.Min,
                        max: selectedLimits.Column_Dozen.Max,
                        winRateText: "2:1"
                    });
                    showLimitRow(500, 365, {
                        name: $.client.getLocalizedString("Second column", true),
                        min: selectedLimits.Column_Dozen.Min,
                        max: selectedLimits.Column_Dozen.Max,
                        winRateText: "2:1"
                    });
                    showLimitRow(500, 400, {
                        name: $.client.getLocalizedString("Third column", true),
                        min: selectedLimits.Column_Dozen.Min,
                        max: selectedLimits.Column_Dozen.Max,
                        winRateText: "2:1"
                    });
                    showLimitRow(500, 435, {
                        name: $.client.getLocalizedString("Dozens", true),
                        min: selectedLimits.Column_Dozen.Min,
                        max: selectedLimits.Column_Dozen.Max,
                        winRateText: "2:1"
                    });
                    showLimitRow(500, 475, {
                        name: $.client.getLocalizedString("Odd/Even", true),
                        min: selectedLimits.Fifty_Fifty.Min,
                        max: selectedLimits.Fifty_Fifty.Max,
                        winRateText: "1:1"
                    });
                    showLimitRow(500, 510, {
                        name: $.client.getLocalizedString("High/Low", true),
                        min: selectedLimits.Fifty_Fifty.Min,
                        max: selectedLimits.Fifty_Fifty.Max,
                        winRateText: "1:1"
                    });
                    showLimitRow(500, 545, {
                        name: $.client.getLocalizedString("Red/Black", true),
                        min: selectedLimits.Fifty_Fifty.Min,
                        max: selectedLimits.Fifty_Fifty.Max,
                        winRateText: "1:1"
                    });
                    showLimitRow(500, 580, {
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
        if (MessageDispatcher.timer) {
            MessageDispatcher.timer = self.createTimer(MessageDispatcher.timer.time, MessageDispatcher.timer.endCallback, MessageDispatcher.timer.updateCallback)
        }
    },
    changeGameSize: function () {
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
                    headerBetInputVal.setText($.client.UserData.CurrencySign + summaDeb.toString());
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
                            headerBalansInputVal.setText($.client.UserData.CurrencySign + parseFloat(USER_BALANCE).toFixed(2));
                            self.changeStatus($.client.getLocalizedString('TEXT_BETS_CANCELED', true), 0, true, 3000);
                        }
                    }
                }, function(err) {
                    console.log(err);
                });
        }
    },
    cancelLastBet: function (element) {
        if (tableChips.length > 0) {
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
                                headerBetInputVal.setText($.client.UserData.CurrencySign + summaDeb.toString());

                            } else {
                                summaDeb = 0;
                            }
                            USER_BALANCE = responce.ResponseData.balance;
                            headerBalansInputVal.setText($.client.UserData.CurrencySign + parseFloat(USER_BALANCE).toFixed(2));
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
        roundBetChips = previousBetChips.slice(0);;
        previousBetChips = [];
    },
    clearLastBet: function (element) {
                if(tableChips.length>0 && !tableChips[tableChips.length-1]['sent']){ 
                        var bet = tableChips.pop();
                        var chip = bet.chip;
                        chip.destroy();               
                      
                        if (summaDeb>0){                                                                        
                            summaDeb = parseFloat(summaDeb - bet.amount).toFixed(2);
                            headerBetInputVal.setText($.client.UserData.CurrencySign + summaDeb.toString());
                                        
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
                            bets.push({ betInfo: bet });
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
                        headerBalansInputVal.setText($.client.UserData.CurrencySign + parseFloat(USER_BALANCE).toFixed(2));
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
                            errText = $.client.getLocalizedString('TEXT_INFO_BET_NOT_CONFIRMED', true);
                            self.clearAllBet(false);
                        }
                    } else {
                        errText = $.client.getLocalizedString('TEXT_INFO_BET_NOT_CONFIRMED', true);
                        self.clearAllBet(false);
                    }
                    isSubmiting = false;
                    if (errText) {
                        self.showMessage(errText);
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
        if (par.name != undefined && par.type != undefined && par.amount != undefined) {
            name = par.name;
            type = par.type;
            amount = par.amount;
            totalAmount = amount;
            cellTotalAmount = amount;

            for (var i = 0; i < tableChips.length; i++) {
                totalAmount += tableChips[i].amount;
                if (tableChips[i].name == name) {
                    cellTotalAmount += tableChips[i].amount;
                }
            }
            if (amount > parseFloat(USER_BALANCE)) {
                errText = $.client.getLocalizedString('TEXT_ERROR_NO_MONEY_MSG', true);
                validAmount = USER_BALANCE - (totalAmount - amount);
                valid = false;
            } else if (totalAmount > TABLE_MAX_BET) {
                errText = $.client.getLocalizedString('Table_limits', true, { min: TABLE_MIN_BET, max: TABLE_MAX_BET, sign: $.client.UserData.CurrencySign });
                validAmount = TABLE_MAX_BET - (totalAmount - amount);
                valid = false;
            } else if (totalAmount < TABLE_MIN_BET) {
                errText = $.client.getLocalizedString('Table_limits', true, { min: TABLE_MIN_BET, max: TABLE_MAX_BET, sign: $.client.UserData.CurrencySign });
                valid = false;
            } else {
                if (type == 'column' || type == 'dozen') {
                    if (cellTotalAmount > COLUMN_DOZEN_MAX_BET) {
                        errText = $.client.getLocalizedString('Column_Dozen_limits', true, { min: COLUMN_DOZEN_MIN_BET, max: COLUMN_DOZEN_MAX_BET, sign: $.client.UserData.CurrencySign });
                        validAmount = COLUMN_DOZEN_MAX_BET - (cellTotalAmount - amount);
                        valid = false;
                    } else if (cellTotalAmount < COLUMN_DOZEN_MIN_BET) {
                        errText = $.client.getLocalizedString('Column_Dozen_limits', true, { min: COLUMN_DOZEN_MIN_BET, max: COLUMN_DOZEN_MAX_BET, sign: $.client.UserData.CurrencySign });
                        valid = false;
                    }
                } else if (type == 'high_low' || type == 'evens_odds' || type == 'color') {
                    if (cellTotalAmount < FIFTY_FIFTY_MIN_BET) {
                        errText = $.client.getLocalizedString('Fifty_fifty_limits', true, { min: FIFTY_FIFTY_MIN_BET, max: FIFTY_FIFTY_MAX_BET, sign: $.client.UserData.CurrencySign });
                        valid = false;
                    } else if (cellTotalAmount > FIFTY_FIFTY_MAX_BET) {
                        validAmount = FIFTY_FIFTY_MAX_BET - (cellTotalAmount - amount);
                        errText = $.client.getLocalizedString('Fifty_fifty_limits', true, { min: FIFTY_FIFTY_MIN_BET, max: FIFTY_FIFTY_MAX_BET, sign: $.client.UserData.CurrencySign });
                        valid = false;
                    }
                } else if (type == 'straight' || type == 'corner' || type == 'split' || type == 'line' || type == "street") {
                    if (cellTotalAmount < STRAIGHT_MIN_BET) {
                        errText = $.client.getLocalizedString('Staight_limits', true, { min: STRAIGHT_MIN_BET, max: STRAIGHT_MAX_BET, sign: $.client.UserData.CurrencySign });
                        valid = false;
                    } else if (cellTotalAmount > STRAIGHT_MAX_BET) {
                        validAmount = STRAIGHT_MAX_BET - (cellTotalAmount - amount);
                        errText = $.client.getLocalizedString('Staight_limits', true, { min: STRAIGHT_MIN_BET, max: STRAIGHT_MAX_BET, sign: $.client.UserData.CurrencySign });
                        valid = false;
                    }
                }
            }
        }
        if (errText) {
            infoText.setTitle(errText);
            self.showMessage(errText);
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
        return { state: valid, chips: chips };
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
                if (single && (validateObj.chips.length > 1 || validateObj.chips[0] != selectedChipId))
                    return false;
                $.each(validateObj.chips, function (i, chipId) {
                    var debValue = dib_cost[chipId];
                    summaDeb = parseFloat(summaDeb) + parseFloat(debValue);
                    summaDeb = parseFloat(summaDeb).toFixed(2);
                    headerBetInputVal.setText($.client.UserData.CurrencySign + summaDeb.toString());
                    self.drawChip(element, chipId);
                });
                return true;
            } else
                return false;
        }
    },
    drawBetsChip: function (bets,notSent) {
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
            self.drawChip(betObj, chipId, notSent ? false : true, notSent ? false : true);
            summaDeb = betAmount;
            if (headerBetInputVal !== undefined) {
                headerBetInputVal.setText($.client.UserData.CurrencySign + summaDeb);
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
        elementX = element.x + element.width / 2 - 50;
        elementY = element.y + element.height / 2 - 50;
        betChip.chip = self.add.graphics(elementX, elementY, selectedChipsGroup);
        betChip.active_sprite = self.add.sprite(0, 0, "chips", chipId*2);
        betChip.active_sprite.scale.set(0.9);
        betChip.active_sprite.fId = chipId * 2;
        betChip.chip.addChild(betChip.active_sprite);
        for (var i = 0; i < tableChips.length; i++) {
            if (tableChips[i].name == betChip.name) {
                chipAmount += tableChips[i].amount;
            }
        }
        betChip.chipText = self.add.text(50, 25, chipAmount % 1 === 0 ? chipAmount : parseFloat(chipAmount).toFixed(1), {
            font: "bold 40px ProximaNova",
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
                        STRAIGHT_MIN_BET = parseFloat(selectedLimits["Straight"].Min);
                        STRAIGHT_MAX_BET = parseFloat(selectedLimits["Straight"].Max);
                        COLUMN_DOZEN_MIN_BET = parseFloat(selectedLimits["Column_Dozen"].Min);
                        COLUMN_DOZEN_MAX_BET = parseFloat(selectedLimits["Column_Dozen"].Max);
                        FIFTY_FIFTY_MIN_BET = parseFloat(selectedLimits["Fifty_Fifty"].Min);
                        FIFTY_FIFTY_MAX_BET = parseFloat(selectedLimits["Fifty_Fifty"].Max);
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
                TABLE_MIN_BET = parseFloat(selectedLimits["Table"].Min);
                TABLE_MAX_BET = parseFloat(selectedLimits["Table"].Max);
                STRAIGHT_MIN_BET = parseFloat(selectedLimits["Straight"].Min);
                STRAIGHT_MAX_BET = parseFloat(selectedLimits["Straight"].Max);
                COLUMN_DOZEN_MIN_BET = parseFloat(selectedLimits["Column_Dozen"].Min);
                COLUMN_DOZEN_MAX_BET = parseFloat(selectedLimits["Column_Dozen"].Max);
                FIFTY_FIFTY_MIN_BET = parseFloat(selectedLimits["Fifty_Fifty"].Min);
                FIFTY_FIFTY_MAX_BET = parseFloat(selectedLimits["Fifty_Fifty"].Max);
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
                if (dib_cost[item.id] < TABLE_MIN_BET || (dib_cost[item.id] < STRAIGHT_MIN_BET && dib_cost[item.id] < COLUMN_DOZEN_MIN_BET && dib_cost[item.id] < FIFTY_FIFTY_MIN_BET)) {
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
    showMessage: function (text) {
        var self = this;
        if (msgGroup) {
            worldGroup.remove(msgGroup);
            clearTimeout(msgTimeout);
        }
        msgGroup = this.add.group();
        msgGroup.clicked = false;;
        worldGroup.add(msgGroup);
        var msgBox = this.add.sprite(0, 0, 'modalBg');
        msgBox.x = self.input.x;
        msgBox.y = self.input.y + 30;
        msgGroup.add(msgBox);
        var msgText = this.add.text(msgBox.x + 20, msgBox.y + 7, text, {
            font: '28px ProximaNova',
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
        }, 4000);
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
        } else {
            cashierBtn.alpha = 0;
            cashierBtn.input.useHandCursor = false;
            cashierBtn.clicked = false;
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
