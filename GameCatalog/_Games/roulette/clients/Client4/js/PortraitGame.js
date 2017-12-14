
var
    TABLE_MIN_BET, TABLE_MAX_BET,
    STRAIGHT_MIN_BET, STRAIGHT_MAX_BET,
    COLUMN_DOZEN_MIN_BET, COLUMN_DOZEN_MAX_BET,
    FIFTY_FIFTY_MIN_BET, FIFTY_FIFTY_MAX_BET,

    TABLE_WIDTH = 225,
    TABLE_HEIGHT = 660,
    DIB_WIDTH = 75,
    DIB_HEIGHT = 52.6,
    DIB_SPASE = 0.4,
    TABLE_COLS = Math.floor(TABLE_WIDTH / DIB_WIDTH),
    TABLE_ROWS = Math.floor(TABLE_HEIGHT / DIB_HEIGHT);

USER_BALANCE = 0;
TOTAL_LOST = 0;

var arrayNambers = [[1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34], [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35], [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]],
    blackNumberArr = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
    redNumberArr = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
    oddNumberArr = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
    evenNumberArr = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
    zeroNumberArr = [26, 32, 15, 12, 35, 3],
    voisinsNumberArr = [3, 0, 19, 12, 15, 4, 21, 2, 25, 26, 22, 18, 29, 7, 28, 35],
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

var dib_cost = [0.1, 1, 5, 10, 25, 50],
    NUM_DIB = dib_cost.length - 1,
    selectedChipId = 1,
    table, summaDeb = 0,
    tableStatus, infoText, timerText;

var Bets = {};
var timerSprite = {}, timerObj;
var betHistory = [];

var winNumInfo = {}, msgBoxPopup, msgBoxTween, limitPopup, limitSelectionPopup, limitPopupTween, videoGroup, menuGroup, statPopup, historyPopup, statPopupTween, selectedLimits = [];
var cellName, betName, borderPosArr;

var tableChips = [];
var limits = [];
var previousBetChips = [];
var roundBetChips = [];
var lastRevive = 0;
var limitBtnText, confirmLimitBtn, cashierBtn;

var userNameText, USER_NAME, headerBetInputVal, headerBalansInputVal, showVideoBtn, showVideoBtGroup, hideVideoBtn, headerWinInputVal;
var gameFrame, winNum, placeHold, timer;
var _winNumUpdate, progressText, _videoFlagShow, isModalShow, isSubmiting;
var cancelLastBtn, cancelAllBetBtn, repeatBetBtn;

var worldGroup = {}, videoGroup = {}, tableGroup = {}, frenchGroup = {}, chipsGroup = {}, buttonGroup = {}, selectedChipsGroup = {},
    frameGroup = {}, footerGroup = {}, winTextGroup = {}, limitGroup = {}, scrollGroup, gameBtnGroup, topBarGroup, bottomBarGroup, msgGroup, msgTimeout;
;
var tableCell = {}, Dozen = {}, Column = {}, Orphelins = {}, Neighbors = {}, RoulettePortraitGame = {};
var previousMsgType, winAmount = 0, lastChangeStatus, startGameBtn, provablyBtn;

RoulettePortraitGame.Boot = function (game) {
};

RoulettePortraitGame.Boot.prototype = {
    init: function () {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;
        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.scale.setUserScale(SCALE, SCALE);
        /*this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignVertically = true;
        this.scale.pageAlignHorizontally = true;*/

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
        this.load.image('gameFrame', '../Client3/images/phone_game_frame.png');
        this.load.image('table', '../Client3/images/phone_table.png');
        this.load.image('bottomBar', '../Client3/images/phone_bottom_bar.png');
        this.load.image('mainBtnBg', '../Client3/images/phone_game_btn_bg.png');
        this.load.image('cell_select', '../Client3/images/cell_select.png');
        this.load.image('numberBg', '../Client3/images/number_bg.png');
        this.load.image('closeBtn', '../Client3/images/modal_close_btn.png');
        this.load.image('historyBg', '../Client3/images/history_bg.png');
        this.load.image('statBg', '../Client3/images/stat_bg.png');
        this.load.image('limitsBg', '../Client3/images/limit_bg.png');
        this.load.image('tableBg', '../Client3/images/tableBgPhone.png');
        this.load.image('modalBg', '../Client3/images/modal_bg.png');
        this.load.image('cashin', '../Client3/images/cashin.png');
        this.load.image('bottomBtnBg', '../Client3/images/phone_bottom_btn_bg.png');
        this.load.image('menuBg', '../Client3/images/menu_bg.png');
        this.load.image('ball', 'images/ball.png');
        this.load.image('bullrim', 'images/bullrim.png');
        this.load.image('pool_table', 'images/pool_table.png');
        this.load.image('wheel', 'images/wheel.png');
        this.load.image('limitSelectorBg', '../Client3/images/selectorBg.png');
        this.load.image('limitsModalBg', '../Client3/images/limitsSelectorBg.png');
        this.load.image('listSelector', '../Client3/images/listSelector.png');
        this.load.image('limitsListBtn', '../Client3/images/limitBtn.png');
        this.load.spritesheet('timer', '../Client3/images/timer.png', 60, 60);
        this.load.spritesheet('statusBg', '../Client3/images/status_bg.png', 1600, 61);
        this.load.spritesheet('icons', '../Client3/images/btn_icons.png', 42, 27);
        this.load.spritesheet('chips', '../Client3/images/phone_chips.png', 112, 108);
        this.load.spritesheet('statChartBg', '../Client3/images/stat_chart_bg.png', 169, 50);
        this.load.spritesheet('clearBtn', '../Client3/images/phone_clear_btn.png', 72, 53);
        this.load.spritesheet('undoBtn', '../Client3/images/phone_undo_btn.png', 72, 53);
        this.load.spritesheet('repeatBtn', '../Client3/images/phone_repeat_btn.png', 72, 53);
        this.load.spritesheet('menuBtn', '../Client3/images/phone_menu_btn.png', 72, 53);
        this.load.spritesheet('homeBtn', '../Client3/images/phone_home_btn.png', 72, 53);
        this.load.spritesheet('videoBtn', '../Client3/images/phone_video_btn.png', 72, 53);
        this.load.spritesheet('spinBtn', '../Client3/images/phone_spin_btn.png', 57, 42);
        this.load.spritesheet('historyBtn', '../Client3/images/phone_history_btn.png', 72, 53);
        this.load.spritesheet('statsBtn', '../Client3/images/phone_stats_btn.png', 72, 53);
        this.load.spritesheet('limitBtn', '../Client3/images/phone_limit_btn.png', 72, 53);

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

RoulettePortraitGame.MainMenu = function (game) {
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

RoulettePortraitGame.MainMenu.prototype = {
    create: function () {
        TABLE_WIDTH = 1020,
        TABLE_HEIGHT = 384,
        DIB_WIDTH = 85,
        DIB_HEIGHT = 128,
        DIB_SPASE = 3,
        TABLE_ROWS = Math.floor(TABLE_WIDTH / DIB_WIDTH),
        TABLE_COLS = Math.floor(TABLE_HEIGHT / DIB_HEIGHT);
        var self = this;
        var bottomBetLabel, balansLabel, winLabel,
             limitBtn, statsBtn, historyBtn,
             chipsEl, table;

        var spriteXY, spriteX, spriteY;
   
        worldGroup = this.add.group();
        scrollGroup = this.add.group();
        gameBtnGroup = this.add.group();
        videoGroup = this.add.group();
        this.scale.setUserScale(SCALE, SCALE);
        this.scale.refresh();
        tableGroup = this.add.group();
        chipsGroup = this.add.group();
        worldGroup.add(tableGroup);
        selectedChipsGroup = this.add.group();
        worldGroup.add(scrollGroup);
    
        frameGroup = this.add.group();
        footerGroup = this.add.group();
        frenchGroup = this.add.group();
        limitGroup = this.add.group();
        topBarGroup = this.add.group();
        bottomBarGroup = this.add.group();

        worldGroup.add(frameGroup);
        worldGroup.add(tableGroup);
        scrollGroup.add(tableGroup);
        tableGroup.add(selectedChipsGroup);
        worldGroup.add(frenchGroup);
        worldGroup.add(footerGroup);
        scrollGroup.add(buttonGroup);

        worldGroup.add(buttonGroup);
        worldGroup.add(limitGroup);
        worldGroup.add(videoGroup);
        for (var a = 0; a <= NUM_DIB; a++) {
            dib_cost[a] = dib_cost[a] * $.client.UserData.CurrencyMultiplier;
        }
        gameFrame = this.add.sprite(0, 0, 'gameFrame');
        var bottomBarSprite = this.add.sprite(305, 680, 'bottomBar');
        bottomBarSprite.height = 80;
        bottomBarSprite.width = 730;
        bottomBarGroup.add(bottomBarSprite);
        table = this.add.sprite(5, 25, 'table');

        frameGroup.add(table);
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
            y: 20,
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
            x: balansLabel.x + balansLabel.width + 10,
            y: 20,
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
            x: 330,
            y: 20,
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
            y: 20,
            font: "ProximaNova",
            size: 27,
            color: "#fff",
            centered: false,
            maxHeight: 30,
            maxWidth: 120
        });
        bottomBarGroup.add(headerBetInputVal);

        tableStatus = this.add.sprite(0, 0, 'statusBg', 0);
        tableStatus.height = 750;
        tableStatus.width = 1334;
        scrollGroup.add(tableStatus);

        infoText = createTextLbl(self, {
            text: $.client.getLocalizedString("PLEASE WAIT FOR THE NEXT OPEN TABLE", true).toUpperCase(),
            x: 900,
            y: 20,
            font: "ProximaNova",
            size: 27,
            color: "#fff",
            centered: true,
            maxHeight: 30,
            maxWidth: 500
        });
        infoText.anchor.x = Math.round(infoText.width * 0.5) / infoText.width;
        frameGroup.add(infoText);
        repeatBetBtn = this.add.button(150, 660, 'repeatBtn', this.repeatBets, this);
        repeatBetBtn.scale.set(1.5);
        repeatBetBtn.input.useHandCursor = true;
        repeatBetBtn.clicked = true;
        gameBtnGroup.add(repeatBetBtn);

        buttonGroup.add(gameBtnGroup);

        cancelAllBetBtn = this.add.button(1200, 660, 'clearBtn', this.cancelAllBet, this, 0);
        cancelAllBetBtn.input.useHandCursor = true;
        cancelAllBetBtn.scale.set(1.5);
        cancelAllBetBtn.clicked = true;
        gameBtnGroup.add(cancelAllBetBtn);

        cancelLastBtn = this.add.button(1080, 660, 'undoBtn', this.cancelLastBet, this);
        cancelLastBtn.input.useHandCursor = true;
        cancelLastBtn.clicked = true;
        cancelLastBtn.scale.set(1.5);
        gameBtnGroup.add(cancelLastBtn);
        menuBtn = this.add.button(40, 500, 'menuBtn', this.showMenu, this, 0);
        menuBtn.input.useHandCursor = true;
        menuBtn.scale.set(0.9);
        menuBtn.clicked = true;
        gameBtnGroup.add(menuBtn);
        homeBtn = this.add.button(1240, 560, 'homeBtn', $.client.toHome, this, 0);
        homeBtn.input.useHandCursor = true;
        homeBtn.scale.set(0.9);
        homeBtn.clicked = true;
        gameBtnGroup.add(homeBtn);

        videoBtn = this.add.button(40, 560, 'videoBtn', this.showVideo, this, 0);
        videoBtn.input.useHandCursor = true;
        videoBtn.scale.set(0.9);
        videoBtn.clicked = true;
        gameBtnGroup.add(videoBtn);


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
        provablyBtn.alpha = 1;
        gameBtnGroup.add(provablyBtn);

        startGameBtn = this.add.group();
        var startGameBtnBg = this.add.button(10, 645, 'spinBtn', this.startGame, this, 0);
        startGameBtnBg.scale.set(2.2);
        startGameBtnBg.clicked = true;
        startGameBtnBg.input.useHandCursor = true;
        startGameBtn.btn = startGameBtnBg;
        startGameBtn.add(startGameBtnBg);
        startGameBtn.alpha = 0;
        gameBtnGroup.add(startGameBtn);

        var chipSpriteId = 0
        for (var a = 0; a <= NUM_DIB; a++) {
            if (a == selectedChipId) {
                chipsEl = chipsGroup.create(335 + (a * 110), 665, 'chips', chipSpriteId + 1);
            } else {
                chipsEl = chipsGroup.create(335 + (a * 110), 665, 'chips', chipSpriteId);
            }
            chipsEl.id = a;
            chipSpriteId += 2;
            chipsEl.debValue = dib_cost[a];
            chipsEl.inputEnabled = true;
            chipsEl.input.useHandCursor = true;
            chipsEl.events.onInputDown.add(this.changeChips, this);
            chipsEl.rY = chipsEl.y;
            chipsEl.rX = chipsEl.x;
            chipsEl.chipText = this.add.text(chipsEl.x + 55, chipsEl.y + 35, dib_cost[a], {
                font: "bold 32px  ProximaNova",
                fill: "#000"
            });
            chipsEl.chipText.anchor.x = Math.round(chipsEl.chipText.width * 0.5) / chipsEl.chipText.width;
            chipsGroup.add(chipsEl.chipText);
        }
        self.changeChips({ id: selectedChipId });
        frameGroup.add(chipsGroup);
        for (var i = 0; i < TABLE_COLS; i++) {
            for (var j = 0; j < TABLE_ROWS; j++) {

                cellName = 'cell_' + i.toString() + '_' + j.toString();
                tableCell[cellName] = tableGroup.create(table.x + 147 + j * (DIB_WIDTH + DIB_SPASE), table.y + 310 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
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

                spriteX = tableGroup.create(table.x + 143 + j * (DIB_WIDTH + DIB_SPASE), table.y + 420 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
                spriteX.name = 'lineY_' + i.toString() + '_' + j.toString();
                spriteX.bet_name = 'lineY_' + i.toString() + '_' + j.toString();;
                spriteX.alpha = 0;
                spriteX.inputEnabled = true;
                spriteX.height = 40;
                spriteX.width = DIB_WIDTH;
                spriteX.type = betType.splitY;
                spriteX.events.onInputUp.add(this.cellClick, this);
                spriteX.events.onInputOver.add(this.cellOver, this);
                spriteX.events.onInputOut.add(this.cellOut, this);

                spriteY = tableGroup.create(table.x + 127 + j * (DIB_WIDTH + DIB_SPASE), table.y + 310 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
                spriteY.name = 'lineX_' + i.toString() + '_' + j.toString();
                spriteY.bet_name = 'lineX_' + i.toString() + '_' + j.toString();;
                spriteY.alpha = 0;
                spriteY.height = DIB_HEIGHT;
                spriteY.width = 40;
                spriteY.type = betType.splitX;
                spriteY.inputEnabled = true;
                spriteY.events.onInputUp.add(this.cellClick, this);
                spriteY.events.onInputOver.add(this.cellOver, this);
                spriteY.events.onInputOut.add(this.cellOut, this);

                spriteXY = tableGroup.create(table.x + 127 + j * (DIB_WIDTH + DIB_SPASE), table.y + 420 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
                spriteXY.name = 'crossXY_' + i.toString() + '_' + j.toString();
                spriteXY.bet_name = 'crossXY_' + i.toString() + '_' + j.toString();;
                spriteXY.inputEnabled = true;
                spriteXY.width = 40;
                spriteXY.height = 40;
                spriteXY.type = betType.corner;
                spriteXY.alpha = 0;
                spriteXY.events.onInputUp.add(this.cellClick, this);
                spriteXY.events.onInputOver.add(this.cellOver, this);
                spriteXY.events.onInputOut.add(this.cellOut, this);
            }
        }
        tableCell['zero'] = tableGroup.create(table.x + 37, table.y + 45, 'cell_select');
        tableCell['zero'].name = '0';

        tableCell['zero'].bet_name = '0';
        tableCell['zero'].bet_type = 'straight';

        tableCell['zero'].type = betType.straight;
        tableCell['zero'].alpha = 0;
        tableCell['zero'].width = 100;
        tableCell['zero'].height = 390;

        tableCell['zero'].inputEnabled = true;
        tableCell['zero'].events.onInputUp.add(this.cellClick, this);
        tableCell['zero'].events.onInputOver.add(this.cellOver, this);
        tableCell['zero'].events.onInputOut.add(this.cellOut, this);

        Dozen['one'] = tableGroup.create(table.x + 145, table.y + 440, 'cell_select');
        Dozen['one'].name = 'dozenOne';
        Dozen['one'].bet_name = 'first12';
        Dozen['one'].bet_type = 'dozen';
        Dozen['one'].items = [0];
        Dozen['one'].first = 0;
        Dozen['one'].last = 4;
        Dozen['one'].alpha = 0;
        Dozen['one'].width = 350;
        Dozen['one'].height = 90;
        Dozen['one'].type = betType.multiSelect;
        Dozen['one'].inputEnabled = true;
        Dozen['one'].events.onInputUp.add(this.cellClick, this);
        Dozen['one'].events.onInputOver.add(this.cellOver, this);
        Dozen['one'].events.onInputOut.add(this.cellOut, this);

        Dozen['two'] = tableGroup.create(table.x + 495, table.y + 440, 'cell_select');
        Dozen['two'].name = 'dozenTwo';
        Dozen['two'].bet_name = 'second12';
        Dozen['two'].bet_type = 'dozen';
        Dozen['two'].items = [1];
        Dozen['two'].type = betType.multiSelect;
        Dozen['two'].alpha = 0;
        Dozen['two'].width = 350;
        Dozen['two'].height = 90;
        Dozen['two'].first = 4;
        Dozen['two'].last = 8;
        Dozen['two'].inputEnabled = true;
        Dozen['two'].events.onInputUp.add(this.cellClick, this);
        Dozen['two'].events.onInputOver.add(this.cellOver, this);
        Dozen['two'].events.onInputOut.add(this.cellOut, this);

        Dozen['three'] = tableGroup.create(table.x + 845, table.y + 440, 'cell_select');
        Dozen['three'].name = 'dozenThree';
        Dozen['three'].bet_name = 'third12';
        Dozen['three'].bet_type = 'dozen';
        Dozen['three'].items = [2];
        Dozen['three'].type = betType.multiSelect;
        Dozen['three'].alpha = 0;
        Dozen['three'].width = 350;
        Dozen['three'].height = 90;
        Dozen['three'].first = 8;
        Dozen['three'].last = 12;
        Dozen['three'].inputEnabled = true;
        Dozen['three'].events.onInputUp.add(this.cellClick, this);
        Dozen['three'].events.onInputOver.add(this.cellOver, this);
        Dozen['three'].events.onInputOut.add(this.cellOut, this);

        Column['one'] = tableGroup.create(table.x + 1200, table.y + 310, 'cell_select');
        Column['one'].name = 'columnOne';
        Column['one'].bet_name = 'col1';
        Column['one'].bet_type = 'column';
        Column['one'].items = [0];
        Column['one'].type = betType.multiSelect;
        Column['one'].alpha = 0;
        Column['one'].width = 90;
        Column['one'].height = 128;
        Column['one'].first = 0;
        Column['one'].last = 12;
        Column['one'].colFirst = 0;
        Column['one'].colLast = 1;
        Column['one'].inputEnabled = true;
        Column['one'].events.onInputUp.add(this.cellClick, this);
        Column['one'].events.onInputOver.add(this.cellOver, this);
        Column['one'].events.onInputOut.add(this.cellOut, this);

        Column['two'] = tableGroup.create(table.x + 1200, table.y + 178, 'cell_select');
        Column['two'].name = 'columnTwo';
        Column['two'].bet_name = 'col2';
        Column['two'].bet_type = 'column';
        Column['two'].items = [1];
        Column['two'].type = betType.multiSelect;
        Column['two'].alpha = 0;
        Column['two'].width = 90;
        Column['two'].height = 128;
        Column['two'].first = 0;
        Column['two'].last = 12;
        Column['two'].colFirst = 1;
        Column['two'].colLast = 2;
        Column['two'].inputEnabled = true;
        Column['two'].events.onInputUp.add(this.cellClick, this);
        Column['two'].events.onInputOver.add(this.cellOver, this);
        Column['two'].events.onInputOut.add(this.cellOut, this);

        Column['three'] = tableGroup.create(table.x + 1200, table.y + 48, 'cell_select');
        Column['three'].name = 'columnThree';
        Column['three'].bet_name = 'col3';
        Column['three'].bet_type = 'column';
        Column['three'].type = betType.multiSelect;
        Column['three'].items = [2];
        Column['three'].alpha = 0;
        Column['three'].width = 90;
        Column['three'].height = 128;
        Column['three'].first = 0;
        Column['three'].last = 12;
        Column['three'].colFirst = 2;
        Column['three'].colLast = 3;
        Column['three'].inputEnabled = true;
        Column['three'].events.onInputUp.add(this.cellClick, this);
        Column['three'].events.onInputOver.add(this.cellOver, this);
        Column['three'].events.onInputOut.add(this.cellOut, this);


        Orphelins['low'] = tableGroup.create(table.x + 140, table.y + 530, 'cell_select');
        Orphelins['low'].name = 'low';
        Orphelins['low'].bet_name = 'first18';
        Orphelins['low'].bet_type = 'high_low';
        Orphelins['low'].items = ['low'];
        Orphelins['low'].type = betType.multiSelect;
        Orphelins['low'].width = 175;
        Orphelins['low'].height = 80;
        Orphelins['low'].first = 0;
        Orphelins['low'].last = 6;
        Orphelins['low'].alpha = 0;
        Orphelins['low'].inputEnabled = true;
        Orphelins['low'].events.onInputUp.add(this.cellClick, this);
        Orphelins['low'].events.onInputOver.add(this.cellOver, this);
        Orphelins['low'].events.onInputOut.add(this.cellOut, this);

        Orphelins['high'] = tableGroup.create(table.x + 1020, table.y + 530, 'cell_select');
        Orphelins['high'].name = 'high';
        Orphelins['high'].bet_name = 'second18';
        Orphelins['high'].bet_type = 'high_low';
        Orphelins['high'].items = ['high'];
        Orphelins['high'].type = betType.multiSelect;
        Orphelins['high'].width = 175;
        Orphelins['high'].height = 80;
        Orphelins['high'].first = 6;
        Orphelins['high'].last = 12;
        Orphelins['high'].alpha = 0;
        Orphelins['high'].inputEnabled = true;
        Orphelins['high'].events.onInputUp.add(this.cellClick, this);
        Orphelins['high'].events.onInputOver.add(this.cellOver, this);
        Orphelins['high'].events.onInputOut.add(this.cellOut, this);

        Orphelins['even'] = tableGroup.create(table.x + 315, table.y + 530, 'cell_select');
        Orphelins['even'].name = 'even';
        Orphelins['even'].bet_name = 'even';
        Orphelins['even'].bet_type = 'evens_odds';
        Orphelins['even'].items = ['evens'];
        Orphelins['even'].type = betType.arrSelect;
        Orphelins['even'].alpha = 0;
        Orphelins['even'].width = 175;
        Orphelins['even'].height = 80;
        Orphelins['even'].numbers = evenNumberArr;
        Orphelins['even'].inputEnabled = true;
        Orphelins['even'].events.onInputUp.add(this.cellClick, this);
        Orphelins['even'].events.onInputOver.add(this.cellOver, this);
        Orphelins['even'].events.onInputOut.add(this.cellOut, this);

        Orphelins['odd'] = tableGroup.create(table.x + 845, table.y + 530, 'cell_select');
        Orphelins['odd'].name = 'odd';
        Orphelins['odd'].bet_name = 'odd';
        Orphelins['odd'].bet_type = 'evens_odds';
        Orphelins['odd'].items = ['odds'];
        Orphelins['odd'].type = betType.arrSelect;
        Orphelins['odd'].width = 175;
        Orphelins['odd'].height = 80;
        Orphelins['odd'].alpha = 0;
        Orphelins['odd'].numbers = oddNumberArr;
        Orphelins['odd'].inputEnabled = true;
        Orphelins['odd'].events.onInputUp.add(this.cellClick, this);
        Orphelins['odd'].events.onInputOver.add(this.cellOver, this);
        Orphelins['odd'].events.onInputOut.add(this.cellOut, this);

        Orphelins['black'] = tableGroup.create(table.x + 670, table.y + 530, 'cell_select');
        Orphelins['black'].name = 'black';
        Orphelins['black'].bet_name = 'black';
        Orphelins['black'].bet_type = 'color';
        Orphelins['black'].items = ['black'];
        Orphelins['black'].type = betType.arrSelect;
        Orphelins['black'].alpha = 0;
        Orphelins['black'].width = 175;
        Orphelins['black'].height = 80;
        Orphelins['black'].numbers = blackNumberArr;
        Orphelins['black'].inputEnabled = true;
        Orphelins['black'].events.onInputUp.add(this.cellClick, this);
        Orphelins['black'].events.onInputOut.add(this.cellOut, this);

        Orphelins['red'] = tableGroup.create(table.x + 495, table.y + 530, 'cell_select');
        Orphelins['red'].name = 'red';
        Orphelins['red'].bet_name = 'red';
        Orphelins['red'].bet_type = 'color';
        Orphelins['red'].items = ['red'];
        Orphelins['red'].type = betType.arrSelect;
        Orphelins['red'].alpha = 0;
        Orphelins['red'].width = 175;
        Orphelins['red'].height = 80;
        Orphelins['red'].numbers = redNumberArr;
        Orphelins['red'].inputEnabled = true;
        Orphelins['red'].events.onInputUp.add(this.cellClick, this);
        Orphelins['red'].events.onInputOut.add(this.cellOut, this);

        this.hideVideoBtn();
        $('.portrait_video').on("click", function () {
            self.hideVideo();
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
    changeGameSize: function () {
        var wScale = $(window).innerWidth() / GAME_WIDTH;
        var hScale = $(window).innerHeight() / GAME_HEIGHT;
        if ((Math.max(wScale, hScale) - Math.min(wScale, hScale)) * 100 / (Math.max(wScale, hScale)) < 20) {
            game.scale.setUserScale(wScale, hScale);
        } else {
            if (wScale < hScale) {
                wScale = hScale = Math.min($(window).innerWidth() / GAME_WIDTH, $(window).innerHeight() / GAME_HEIGHT);
                game.scale.setUserScale(wScale, wScale);
            } else {
                game.scale.setUserScale(wScale, wScale);
            }
        }

        game.scale.refresh();
        setTimeout(function () {
            changeVideoSize();
        }, 400);
    },

    exitGame: function () {
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
                        }
                        else {
                            if (parseInt(borderPosArr[1], 10) > 0) {
                                for (i = 0; i < 2; i++) {
                                    cellX = parseInt(borderPosArr[1], 10) - i;
                                    cellName = 'cell_' + cellX + '_' + borderPosArr[2].toString();
                                    tableCell[cellName].alpha = 0.5;
                                }
                                tableCell['zero'].alpha = 0.5;
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
    multySelect: function (pars) {
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
            }), function (responce) {
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
                        summaDeb = 0;
                        USER_BALANCE = responce.ResponseData.balance;
                        headerBalansInputVal.setText($.client.UserData.CurrencySign + parseFloat(USER_BALANCE).toFixed(2));
                        self.changeStatus($.client.getLocalizedString('TEXT_BETS_CANCELED', true), 0, true, 3000);
                    }
                }
            }, function (err) {
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
        if (previousBetChips.length > 0) {
            roundBetChips = previousBetChips.slice(0);;
        }
        previousBetChips = [];
    },
    clearLastBet: function (element) {
        if (tableChips.length > 0 && !tableChips[tableChips.length - 1]['sent']) {
            var bet = tableChips.pop();
            var chip = bet.chip;
            chip.destroy();

            if (summaDeb > 0) {
                summaDeb = parseFloat(summaDeb - bet.amount).toFixed(2);
                headerBetInputVal.setText($.client.UserData.CurrencySign + summaDeb.toString());

            }
            else {
                summaDeb = 0;
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
                        var bet = { name: ppBet.name, type: pBet.type, amount: pBet.amount, bet: pBet.bet };
                        var isValidBet = this.checkLimit(bet);
                        if (isValidBet.state) {
                            bet.chip = self.add.graphics(pBet.chip.x, pBet.chip.y, selectedChipsGroup);
                            bet.active_sprite = this.add.sprite(0, 0, "chips", pBet.active_sprite.fId);
                            bet.active_sprite.fId = pBet.active_sprite.fId;
                            bet.chip.addChild(bet.active_sprite);

                            var chipAmount = pBet.amount;
                            for (var k = 0; k< tableChips.length; k++) {
                                if (tableChips[k].name == bet.name) {
                                    chipAmount += tableChips[k].amount;
                                }
                            }
                            bet.chipText = this.add.text(55, 35, chipAmount % 1 == 0 ? chipAmount : parseFloat(chipAmount).toFixed(1), {
                                font: "32px ProximaNova",
                                fill: "#000"
                            });
                            bet.chipText.anchor.x = Math.round(bet.chipText.width * 0.5) / bet.chipText.width;
                            bet.chip.addChild(bet.chipText);
                            bet.chip.scale.set(0.9);
                            summaDeb = parseFloat(summaDeb) + parseFloat(pBet.amount);
                            summaDeb = parseFloat(summaDeb).toFixed(2);
                            headerBetInputVal.setText($.client.UserData.CurrencySign + summaDeb.toString());
                            tableChips.push(bet);
                        }
                    }
                    if (summaDeb > 0) {
                        summaDeb = parseFloat(summaDeb).toFixed(2);
                    } else {
                        summaDeb = 0;
                    }
                    headerBetInputVal.setText($.client.UserData.CurrencySign + summaDeb.toString());
                }
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
                            infoText.setText(errText);
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
            if (totalAmount > parseFloat(USER_BALANCE)) {
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
            infoText.setText(errText);
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
            self.drawChip(betObj, chipId, true, true);
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
        betChip.active_sprite = self.add.sprite(0, 0, "chips", chipId * 2);
        betChip.active_sprite.scale.set(0.9)
        betChip.active_sprite.fId = chipId * 2;
        betChip.chip.addChild(betChip.active_sprite);
        for (var i = 0; i < tableChips.length; i++) {
            if (tableChips[i].name == betChip.name) {
                chipAmount += tableChips[i].amount;
            }
        }
        betChip.chipText = self.add.text(50, 30, chipAmount % 1 == 0 ? chipAmount : parseFloat(chipAmount).toFixed(1), {
            font: "32px ProximaNova",
            fill: "#000"
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
                    item.y = item.rY - 30;
                    item.x = item.rX - 15;
                    item.scale.set(1.3);
                    item.chipText.y = item.rY + 20;
                    item.loadTexture(item.key, item.id * 2 + 1);
                } else {
                    item.y = item.rY;
                    item.x = item.rX;
                    item.scale.set(1);
                    item.chipText.y = item.rY + 35;
                    item.loadTexture(item.key, item.id * 2);
                }
        });
        this.changeGameSize();
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
    closeLimitSelectionPopup: function() {
        isModalShow = false;
        if ((limitPopupTween && limitPopupTween.isRunning)) {
            return;
        }
        if (limitSelectionPopup){
            limitPopupTween = this.add.tween(limitSelectionPopup).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true);
           limitSelectionPopup.destroy();
        }
        tableGroup.setAll('inputEnabled', true);
        gameBtnGroup.setAll('clicked', true);
    },
    showLimitsSelector: function () {
        var limitTitleText;
        var modalBg, cancelBtn;
        var self = this;
        if (!isModalShow) {
            if (limits.length != 0) {
                isModalShow = true;
                self.hideVideo();
                gameBtnGroup.setAll('clicked', false);
                modalBg = this.add.sprite(0, 0, 'limitsModalBg');
                modalBg.priorityID = 10;
                limitSelectionPopup = this.add.group();
                modalBg.height = 750;
                modalBg.width = 1334;
                limitSelectionPopup.add(modalBg);
                var limitBox = this.add.sprite(40, 150, 'limitSelectorBg');
                limitSelectionPopup.add(limitBox);
                limitBox.width = 1260;
                limitBox.height = 450;
                limitTitleText = createTextLbl(self, {
                    text: $.client.getLocalizedString('Please select limits', true),
                    x: 650,
                    y: 30,
                    font: "ProximaNova",
                    size: 45,
                    color: "#878787",
                    centered: true,
                    maxHeight: 90,
                    maxWidth: 500
                });
                limitSelectionPopup.addChild(limitTitleText);
                okBtn = this.add.button(40, 630, 'limitsListBtn', function () {
                    selectedLimits = selected
                    self.confirmLimit();
                }, this);
                okBtn.input.useHandCursor = true;
                okBtn.inputEnabled = true;
                okBtn.input.priorityID = 1;
                okBtn.clicked = true;
                okBtn.width = 180;
                okBtn.height = 80;
                okBtn.text = createTextLbl(self, {
                    text: $.client.getLocalizedString('Ok', true),
                    x: okBtn.x + 90,
                    y: okBtn.y + 25,
                    font: "ProximaNova",
                    size: 32,
                    color: "#878787",
                    centered: true,
                    maxHeight: 50,
                    maxWidth: 150
                });
                limitSelectionPopup.add(okBtn.text);
                limitSelectionPopup.add(okBtn);

                cancelBtn = this.add.button(1115, 630, 'limitsListBtn', this.closeLimitSelectionPopup, this);
                cancelBtn.input.useHandCursor = true;
                cancelBtn.clicked = true;
                cancelBtn.inputEnabled = true;
                cancelBtn.input.priorityID = 1;
                cancelBtn.width = 180;
                cancelBtn.height = 80;
                cancelBtn.text = createTextLbl(self, {
                    text: $.client.getLocalizedString('Cancel', true),
                    x: cancelBtn.x + 90,
                    y: cancelBtn.y + 25,
                    font: "ProximaNova",
                    size: 32,
                    color: "#878787",
                    centered: true,
                    maxHeight: 50,
                    maxWidth: 150
                });
                limitSelectionPopup.add(cancelBtn.text);
                limitSelectionPopup.add(cancelBtn);
                limitBottomText = createTextLbl(self, {
                    text: $.client.getLocalizedString('Amount are min/max', true),
                    x: 650,
                    y: 650,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: true,
                    maxHeight: 50,
                    maxWidth: 350
                });
                limitSelectionPopup.addChild(limitBottomText);
                limitSelectionPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString('Limit', true),
                    x: 100,
                    y: 110,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    style: "bold",
                    centered: true,
                    maxHeight: 90,
                    maxWidth: 150
                }));
                limitSelectionPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString('Table', true),
                    x: 330,
                    y: 110,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    style: "bold",
                    centered: true,
                    maxHeight: 90,
                    maxWidth: 150
                }));
                limitSelectionPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString('Straight', true),
                    x: 600,
                    y: 110,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    style: "bold",
                    centered: true,
                    maxHeight: 90,
                    maxWidth: 150
                }));
                limitSelectionPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString('Column/Dozen', true),
                    x: 890,
                    y: 110,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    style: "bold",
                    centered: true,
                    maxHeight: 90,
                    maxWidth: 150
                }));
                limitSelectionPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString('Fifty/Fifty', true),
                    x: 1170,
                    y: 110,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    style: "bold",
                    centered: true,
                    maxHeight: 90,
                    maxWidth: 150
                }));
                var selected = selectedLimits;
                var cells = [];
                function showLimitRow(x, y, limit, id) {
                    var cell = self.add.button(x + 10, y - 10, "listSelector", function () {
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
                    cell.width = 1220;
                    cell.height = 55;
                    limitSelectionPopup.add(cell);
                    limitSelectionPopup.addChild(self.add.text(x + 40, y, limit.Title.toUpperCase(), {
                        font: "30px ProximaNova",
                        fill: "#000",
                        align: "center"
                    }));
                    var tMin = parseFloat(limit.Table.Min) % 1 == 0 ? parseFloat(limit.Table.Min).toFixed(0) : limit.Table.Min.replace(',', '.');
                    var tMax = parseFloat(limit.Table.Max) % 1 == 0 ? parseFloat(limit.Table.Max).toFixed(0) : limit.Table.Max.replace(',', '.');
                    var tText = tMin + '/' + tMax;
                    var tableLbl = limitSelectionPopup.addChild(self.add.text(x + 280, y, tText, {
                        font: "30px ProximaNova",
                        fill: "#000",
                        align: "center"
                    }));
                    tableLbl.anchor.x = Math.round(tableLbl.width * 0.5) / tableLbl.width;

                    var sMin = parseFloat(limit.Straight.Min) % 1 == 0 ? parseFloat(limit.Straight.Min).toFixed(0) : limit.Straight.Min.replace(',', '.');
                    var sMax = parseFloat(limit.Straight.Max) % 1 == 0 ? parseFloat(limit.Straight.Max).toFixed(0) : limit.Straight.Max.replace(',', '.');
                    var sText = sMin + '/' + sMax;
                    var straightLbl = limitSelectionPopup.addChild(self.add.text(x + 550, y, sText, {
                        font: "30px ProximaNova",
                        fill: "#000",
                        align: "center"
                    }));
                    straightLbl.anchor.x = Math.round(straightLbl.width * 0.5) / straightLbl.width;

                    var cdMin = parseFloat(limit.Column_Dozen.Min) % 1 == 0 ? parseFloat(limit.Column_Dozen.Min).toFixed(0) : limit.Column_Dozen.Min.replace(',', '.');
                    var cdMax = parseFloat(limit.Column_Dozen.Max) % 1 == 0 ? parseFloat(limit.Column_Dozen.Max).toFixed(0) : limit.Column_Dozen.Max.replace(',', '.');
                    var cdText = cdMin + '/' + cdMax;
                    var cdLbl = limitSelectionPopup.addChild(self.add.text(x + 850, y, cdText, {
                        font: "30px ProximaNova",
                        fill: "#000",
                        align: "center"
                    }));
                    cdLbl.anchor.x = Math.round(cdLbl.width * 0.5) / cdLbl.width;

                    var ffMin = parseFloat(limit.Fifty_Fifty.Min) % 1 == 0 ? parseFloat(limit.Fifty_Fifty.Min).toFixed(0) : limit.Fifty_Fifty.Min.replace(',', '.');
                    var ffMax = parseFloat(limit.Fifty_Fifty.Max) % 1 == 0 ? parseFloat(limit.Fifty_Fifty.Max).toFixed(0) : limit.Fifty_Fifty.Max.replace(',', '.');
                    var ffText = ffMin + '/' + ffMax;
                    var ffLbl = limitSelectionPopup.addChild(self.add.text(x + 1120, y, ffText, {
                        font: "30px ProximaNova",
                        fill: "#000",
                        align: "center"
                    }));
                    ffLbl.anchor.x = Math.round(ffLbl.width * 0.5) / ffLbl.width;

                }
                for (var i in limits) {
                    showLimitRow(50, i * 60 + 180, limits[i], i);
                }

            }
        }
    },
    showLimits: function () {
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
                var limitBox = this.add.sprite(260, 0, 'limitsBg');
                limitBox.inputEnabled = true;
                limitBox.priorityID = 1;
                limitPopup.add(limitBox);
                limitBox.width = 800;
                limitBox.height = 750;
                var changeBtn = this.add.button(300, 690, 'mainBtnBg', function () {
                    self.closelimitPopup();
                    self.showLimitsSelector();
                }, this);
                limitPopup.add(changeBtn);
                changeBtn.height = 40;
                changeBtn.width = 145;
                var changeText = createTextLbl(self, {
                    text: $.client.getLocalizedString('Change', true).toUpperCase(),
                    x: 370,
                    y: 700,
                    font: "ProximaNova",
                    size: 22,
                    color: "#fff",
                    centered: true,
                    maxHeight: 65,
                    maxWidth: 130
                });

                limitPopup.add(changeText);
                changeBtn.clicked = true;
                changeBtn.input.useHandCursor = true;

                if ($.client.UserData.Features && $.client.UserData.Features.rules) {
                    var rulesBtn = this.add.button(300, 640, 'mainBtnBg', function () {
                        $.client.showRules();
                    }, this);
                    limitPopup.add(rulesBtn);
                    rulesBtn.height = 40;
                    rulesBtn.width = 145;
                    var rulesText = createTextLbl(self, {
                        text: $.client.getLocalizedString('Rules', true).toUpperCase(),
                        x: 370,
                        y: 650,
                        font: "ProximaNova",
                        size: 22,
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
                    text: $.client.getLocalizedString('Limits', true).toUpperCase(),
                    x: 290,
                    y: 20,
                    font: "ProximaNova",
                    size: 34,
                    color: "#fff",
                    centered: false,
                    maxHeight: 80,
                    maxWidth: 200
                });
                limitPopup.addChild(limitTitleText);
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString('Bet name', true).toUpperCase(),
                    x: 550,
                    y: 80,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: true,
                    maxHeight: 80,
                    maxWidth: 200
                }));
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString('Min bet', true).toUpperCase(),
                    x: 730,
                    y: 80,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: true,
                    maxHeight: 80,
                    maxWidth: 150
                }));
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString('Max bet', true).toUpperCase(),
                    x: 850,
                    y: 80,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: true,
                    maxHeight: 80,
                    maxWidth: 150
                }));
                limitPopup.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString('Pays', true).toUpperCase(),
                    x: 970,
                    y: 80,
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
                    maxWidth: 200
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
                    maxWidth: 200
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
                    var min = parseFloat(min) % 1 == 0 ? parseFloat(min).toFixed(0) : min;
                    var minLbl = limitPopup.addChild(self.add.text(x + 230, y, min, {
                        font: "30px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    minLbl.anchor.x = Math.round(minLbl.width * 0.5) / minLbl.width;
                    var max = limit.max.replace(',', '.')
                    var max = parseFloat(max) % 1 == 0 ? parseFloat(max).toFixed(0) : max;
                    var maxLbl = limitPopup.addChild(self.add.text(x + 350, y, max, {
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
                showLimitRow(500, 120, {
                    name: $.client.getLocalizedString("Straight", true),
                    min: selectedLimits.Straight.Min,
                    max: selectedLimits.Straight.Max,
                    winRateText: "35:1"
                });
                showLimitRow(500, 165, {
                    name: $.client.getLocalizedString("Split", true),
                    min: selectedLimits.Straight.Min,
                    max: selectedLimits.Straight.Max,
                    winRateText: "17:1"
                });
                showLimitRow(500, 210, {
                    name: $.client.getLocalizedString("Trio", true),
                    min: selectedLimits.Straight.Min,
                    max: selectedLimits.Straight.Max,
                    winRateText: "11:1"
                });
                showLimitRow(500, 255, {
                    name: $.client.getLocalizedString("Street", true),
                    min: selectedLimits.Straight.Min,
                    max: selectedLimits.Straight.Max,
                    winRateText: "11:1"
                });
                showLimitRow(500, 300, {
                    name: $.client.getLocalizedString("Corner", true),
                    min: selectedLimits.Straight.Min,
                    max: selectedLimits.Straight.Max,
                    winRateText: "8:1"
                });
                showLimitRow(500, 345, {
                    name: $.client.getLocalizedString("Sixline", true),
                    min: selectedLimits.Straight.Min,
                    max: selectedLimits.Straight.Max,
                    winRateText: "5:1"
                });
                showLimitRow(500, 390, {
                    name: $.client.getLocalizedString("First column", true),
                    min: selectedLimits.Column_Dozen.Min,
                    max: selectedLimits.Column_Dozen.Max,
                    winRateText: "2:1"
                });
                showLimitRow(500, 435, {
                    name: $.client.getLocalizedString("Second column", true),
                    min: selectedLimits.Column_Dozen.Min,
                    max: selectedLimits.Column_Dozen.Max,
                    winRateText: "2:1"
                });
                showLimitRow(500, 480, {
                    name: $.client.getLocalizedString("Third column", true),
                    min: selectedLimits.Column_Dozen.Min,
                    max: selectedLimits.Column_Dozen.Max,
                    winRateText: "2:1"
                });
                showLimitRow(500, 525, {
                    name: $.client.getLocalizedString("Dozens", true),
                    min: selectedLimits.Column_Dozen.Min,
                    max: selectedLimits.Column_Dozen.Max,
                    winRateText: "2:1"
                });
                showLimitRow(500, 570, {
                    name: $.client.getLocalizedString("Odd/Even", true),
                    min: selectedLimits.Fifty_Fifty.Min,
                    max: selectedLimits.Fifty_Fifty.Max,
                    winRateText: "1:1"
                });
                showLimitRow(500, 615, {
                    name: $.client.getLocalizedString("High/Low", true),
                    min: selectedLimits.Fifty_Fifty.Min,
                    max: selectedLimits.Fifty_Fifty.Max,
                    winRateText: "1:1"
                });
                showLimitRow(500, 660, {
                    name: $.client.getLocalizedString("Red/Black", true),
                    min: selectedLimits.Fifty_Fifty.Min,
                    max: selectedLimits.Fifty_Fifty.Max,
                    winRateText: "1:1"
                });
                showLimitRow(500, 705, {
                    name: $.client.getLocalizedString("Table", true),
                    min: selectedLimits.Table.Min,
                    max: selectedLimits.Table.Max,
                    winRateText: ""
                });

            }
        }
    },
    actionOnLimitBtn: function (btn) {
        selectedLimits = [];
        this.selectLimitBtn(btn);
        selectedLimits = btn.limits;
        //   confirmLimitBtn.inputEnabled = true;
        //   confirmLimitBtn.input.useHandCursor = true;  
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
        var statTitleText, modalBg, cancelBtn, winLbl, betLbl;
        if (!isModalShow) {
            if (_videoFlagShow) {
                self.hideVideo();
            }
            isModalShow = true;
            modalBg = this.add.button(0, 0, "modalBg", this.closeHistoryPopup, this);
            modalBg.height = 1334;
            modalBg.priorityID = 0;
            modalBg.useHandCursor = false;
            historyPopup = this.add.group();
            historyPopup.clicked = false;;
            historyPopup.add(modalBg);
            var historyBox = this.add.sprite(365, 0, 'historyBg');
            historyBox.height = 750;
            historyBox.width = 600;
            historyBox.inputEnabled = true;
            historyBox.priorityID = 1;
            historyPopup.add(historyBox);
            var totalLost = createTextLbl(self, {
                text: $.client.getLocalizedString("Total lost", true),
                x: 460,
                y: 645,
                font: "ProximaNova",
                size: 30,
                color: "#878787",
                centered: false,
                maxHeight: 75,
                maxWidth: 200
            });
            var totalLostVal = createTextLbl(self, {
                text: $.client.UserData.CurrencySign + TOTAL_LOST,
                x: totalLost.x + totalLost.width + 15,
                y: 645,
                font: "ProximaNova",
                size: 30,
                color: "#878787",
                centered: false,
                maxHeight: 30,
                maxWidth: 100
            });
            historyPopup.addChild(totalLost);
            historyPopup.addChild(totalLostVal);
            statTitleText = createTextLbl(self, {
                text: $.client.getLocalizedString('History', true).toUpperCase(),
                x: 420,
                y: 40,
                font: "ProximaNova",
                size: 34,
                color: "#878787",
                centered: false,
                maxHeight: 40,
                maxWidth: 140
            });
            betLbl = createTextLbl(self, {
                text: $.client.getLocalizedString('Bet', true).toUpperCase(),
                x: 660,
                y: 90,
                font: "ProximaNova",
                size: 28,
                color: "#878787",
                centered: true,
                maxHeight: 65,
                maxWidth: 140
            });
            winLbl = createTextLbl(self, {
                text: $.client.getLocalizedString('TEXT_WIN', true).toUpperCase(),
                x: 840,
                y: 90,
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
                numBg.scale.set(1.2);
                numText = self.add.text(numBg.x + 30, numBg.y + 16, numTextVal, { font: "28px ProximaNova", fill: color, align: "center" });
                numText.anchor.x = Math.round(numText.width * 0.5) / numText.width;

                historyPopup.addChild(numBg);
                historyPopup.addChild(numText);
                var betAmount = item.betAmount % 1 == 0 ? parseFloat(item.betAmount).toFixed(0) : parseFloat(item.betAmount).toFixed(2);
                betText = self.add.text(posX + 200, posY + 13, $.client.UserData.CurrencySign + betAmount, { font: "30px ProximaNova", fill: "#fff", align: "center" });
                betText.anchor.x = Math.round(betText.width * 0.5) / betText.width;
                historyPopup.addChild(betText);
                var winAmount = item.winAmount % 1 == 0 ? parseFloat(item.winAmount).toFixed(0) : parseFloat(item.winAmount).toFixed(2);
                winText = self.add.text(posX + 385, posY + 13, $.client.UserData.CurrencySign + winAmount, { font: "30px ProximaNova", fill: "#fff", align: "center" });
                winText.anchor.x = Math.round(winText.width * 0.5) / winText.width;
                historyPopup.addChild(winText);
            }
            var k = 0;
            for (var i = MessageDispatcher.betHistory.length - 1; i >= 0; i--) {
                showRow(MessageDispatcher.betHistory[i], 460, 129 + k * 72);
                k++;
            }
            tableGroup.setAll('inputEnabled', false);
            buttonGroup.setAll('clicked', false);
        }
    },
    getStatisticData: function (element) {
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
                var statBox = this.add.sprite(290, 0, 'statBg');
                statBox.width = 800;
                statBox.height = 750;
                statBox.inputEnabled = true;
                statBox.priorityID = 1;
                statPopup.add(statBox);
                var statData = this.add.group();

                statPopup.addChild(statData);

                statTitleText = createTextLbl(self, {
                    text: $.client.getLocalizedString('Statistics', true).toUpperCase(),
                    x: 340,
                    y: 20,
                    font: "ProximaNova",
                    size: 34,
                    color: "#fff",
                    centered: false,
                    maxHeight: 90,
                    maxWidth: 350
                });
                statData.addChild(statTitleText);

                coldNumText = createTextLbl(self, {
                    text: $.client.getLocalizedString('COLD NUMBERS', true).toUpperCase(),
                    x: 370,
                    y: 105,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: false,
                    maxHeight: 70,
                    maxWidth: 200
                });
                hotNumText = createTextLbl(self, {
                    text: $.client.getLocalizedString('HOT NUMBERS', true).toUpperCase(),
                    x: 370,
                    y: 190,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: false,
                    maxHeight: 70,
                    maxWidth: 200
                });
                colorText = createTextLbl(self, {
                    text: $.client.getLocalizedString('COLORS', true).toUpperCase(),
                    x: 370,
                    y: 285,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: false,
                    maxHeight: 70,
                    maxWidth: 200
                });
                evensOddsText = createTextLbl(self, {
                    text: $.client.getLocalizedString('EVEN/ODDS', true).toUpperCase(),
                    x: 370,
                    y: 375,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: false,
                    maxHeight: 70,
                    maxWidth: 200
                });
                highLowText = createTextLbl(self, {
                    text: $.client.getLocalizedString('HIGH/LOW', true).toUpperCase(),
                    x: 370,
                    y: 465,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: false,
                    maxHeight: 70,
                    maxWidth: 200
                });
                dozenText = createTextLbl(self, {
                    text: $.client.getLocalizedString('DOZENS', true).toUpperCase(),
                    x: 370,
                    y: 555,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: false,
                    maxHeight: 70,
                    maxWidth: 200
                });
                columnText = createTextLbl(self, {
                    text: $.client.getLocalizedString('COLUMNS', true).toUpperCase(),
                    x: 370,
                    y: 645,
                    font: "ProximaNova",
                    size: 28,
                    color: "#878787",
                    centered: false,
                    maxHeight: 70,
                    maxWidth: 200
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
                    showNumber(ststs.coldNumbers[i].number, coldNumText.x + 230 + (i - 4) * 71, coldNumText.y - 5);
                }

                for (var i = 4; i < ststs.hotNumbers.length; i++) {
                    showNumber(ststs.hotNumbers[i].number, hotNumText.x + 230 + (i - 4) * 71, hotNumText.y - 5);
                }
                showSectionNumber(colorText.x + 230, colorText.y - 15,
                    [$.client.getLocalizedString("RED", true).toUpperCase(), $.client.getLocalizedString("GREEN", true).toUpperCase(), $.client.getLocalizedString("BLACK", true).toUpperCase()],
                    [ststs.colors.red, ststs.colors.zero, ststs.colors.black],
                    [0, 1, 3]
                );

                showSectionNumber(evensOddsText.x + 230, evensOddsText.y - 15,
                    [$.client.getLocalizedString("EVEN", true).toUpperCase(), $.client.getLocalizedString("ZERO", true).toUpperCase(), $.client.getLocalizedString("ODDS", true).toUpperCase()],
                    [ststs.evenOdds.even, ststs.evenOdds.zero, ststs.evenOdds.odds],
                    [2, 1, 2]
                );

                showSectionNumber(highLowText.x + 230, highLowText.y - 15,
                    [$.client.getLocalizedString("HIGH", true).toUpperCase(), $.client.getLocalizedString("ZERO", true).toUpperCase(), $.client.getLocalizedString("LOW", true).toUpperCase()],
                    [ststs.highLow.high, ststs.highLow.zero, ststs.highLow.low],
                    [2, 2, 2]
                );

                showSectionNumber(dozenText.x + 230, dozenText.y - 15,
                    ["1-12", "13-24", "25-36"],
                    [ststs.dozens.first, ststs.dozens.second, ststs.dozens.third],
                    [2, 3, 2]
                );
                showSectionNumber(columnText.x + 230, columnText.y - 15,
                    ["1-34", "2-35", "3-36"],
                    [ststs.columns.first, ststs.columns.second, ststs.columns.third],
                    [2, 3, 2]
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
        tableGroup.setAll('inputEnabled', true);
        buttonGroup.setAll('clicked', true);
    },
    updateStatistics: function () {
        var self = this;

        $.client.sendPost(JSON.stringify({
            type: "stats"
        }), function (responce) {
            if (responce.IsSuccess) {
                self._statData = responce.ResponseData.data;
            }
        }, function (err) {
            setTimeout(function () {
                self.updateStatistics();
            }, 1000)
            console.log(err);
        });
    },
    showVideo: function (element) {
        if (!_videoFlagShow) {
            _videoFlagShow = true;
            game.add.tween(videoGroup).to({ y: 0 }, 600, Phaser.Easing.Linear.None, true);
        }
    },
    hideVideo: function (element) {
        _videoFlagShow = false;
        game.add.tween(videoGroup).to({ y: -750 }, 600, Phaser.Easing.Linear.None, true);
    },
    showMenu: function (element) {
        var self = this;
        isModalShow = true;
        if (menuGroup) {
            this.hideMenu();
        } else {
            modalBg = this.add.button(0, 0, "modalBg", function () {
                self.hideMenu();
            }, this);
            modalBg.height = 750;
            modalBg.width = 1334;
            modalBg.priorityID = 0;
            menuGroup = this.add.group();
            menuGroup.add(modalBg);
            bgGroup = this.add.group();
            menuGroup.bgGroup = bgGroup;
            menuGroup.add(bgGroup);
            bgGroup.x = -200;
            bgGroup.y = 0;
            menuBg = this.add.sprite(0, 100, 'menuBg');
            menuBg.width = 150;
            menuBg.height = 370;
            bgGroup.add(menuBg);

            historyBtn = this.add.button(15, 130, 'historyBtn', function () {
                self.hideMenu(null, function () {
                    self.showHistory();
                });
            }, this, 0);
            historyBtn.input.useHandCursor = true;
            historyBtn.clicked = true;
            historyBtn.scale.set(1.7);
            bgGroup.add(historyBtn);

            limitBtn = this.add.button(15, 240, 'limitBtn', function () {
                self.hideMenu(null, function () {
                    self.showLimits();
                });
            }, this, 0);
            limitBtn.clicked = true;
            limitBtn.scale.set(1.7);
            limitBtn.input.useHandCursor = true;
            bgGroup.add(limitBtn);

            statsBtn = this.add.button(15, 350, 'statsBtn', function () {
                self.hideMenu(null, function () {
                    self.getStatisticData();
                });
            }, this, 0);
            statsBtn.scale.set(1.7);
            statsBtn.clicked = true;
            statsBtn.input.useHandCursor = true;
            bgGroup.add(statsBtn);
            game.add.tween(bgGroup).to({ x: 0 }, 400, Phaser.Easing.Linear.None, true)
        }
    },
    hideMenu: function (element, callback) {
        if (menuGroup) {
            isModalShow = false;
            var tween = game.add.tween(menuGroup.bgGroup).to({ x: -200 }, 400, Phaser.Easing.Linear.None, true)
            tween.onComplete.add(function () {
                menuGroup.destroy();
                menuGroup = null;
                if (callback)
                    callback();
            }, this);
        }
    },
    createTimer: function (totalTime, endCallback, updateCallback) {
        var timer;
        timerSprite.totalTime = totalTime;
        timerSprite.time = totalTime;
        timerSprite.endCallback = endCallback;
        timerSprite.updateCallback = updateCallback;
        timerSprite.bg = frameGroup.create(1245, 490, 'timer', 0);
        timerSprite.bg.scale.set(0.9);
        timerSprite.text = this.add.text(timerSprite.bg.x + 27, timerSprite.bg.y + 14, totalTime, {
            font: "22px ProximaNova",
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
    },
    changeStatus: function (text, statusIndex, showModal, timeout) {
        var tDiff = new Date(new Date().getTime() - lastChangeStatus).getTime() / 1000;
        var self = this;
        if (timeout > 0) {
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
            if (tDiff < 1.5 && self.previousStatusIndex != statusIndex) {
                setTimeout(function () {
                    self.changeStatus(text, statusIndex);
                }, 1600);
            } else {
                self.previousStatusIndex = statusIndex;
                infoText.setText(text);
                tableStatus.loadTexture('statusBg', statusIndex);
            }
        }
        function showText(txt) {
            if (isModalShow)
                bg.destroy();
            isModalShow = true;
            bg = self.add.group();
            bg.clicked = false;;
            worldGroup.add(bg);
            modalBg = self.add.button(0, 0, "modalBg", null, this);
            modalBg.height = 750;
            modalBg.width = 1334;
            modalBg.alpha = 0;
            textBg = self.add.button(0, 375, "modalBg", null, this);
            textBg.height = 0;
            bg.add(modalBg);
            bg.add(textBg);
            var text = self.add.text(660, 375, txt, {
                font: "2px ProximaNova",
                fill: "#fff"
            })
            text.anchor.x = Math.round(text.width * 0.5) / text.width;
            bg.add(text);
            game.add.tween(modalBg).to({ alpha: 0.8 }, 400, Phaser.Easing.Linear.None, true);
            game.add.tween(textBg).to({ y: 275 }, 600, Phaser.Easing.Linear.None, true);
            game.add.tween(textBg).to({ height: 200 }, 600, Phaser.Easing.Linear.None, true);
            self.add.tween(text).to({ fontSize: 70 }, 600, Phaser.Easing.Linear.None, true);
            self.add.tween(text).to({ y: 340 }, 600, Phaser.Easing.Linear.None, true);
            setTimeout(function () {
                game.add.tween(modalBg).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true);
                game.add.tween(textBg).to({ y: 375 }, 600, Phaser.Easing.Linear.None, true);
                game.add.tween(text).to({ fontSize: 2 }, 600, Phaser.Easing.Linear.None, true);
                self.add.tween(text).to({ y: 375 }, 600, Phaser.Easing.Linear.None, true);
                var tween = game.add.tween(textBg).to({ height: 0 }, 600, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(function () {
                    bg.destroy();
                    isModalShow = false;
                }, this);
            }, 3000)
        }
        if (showModal && !_videoFlagShow)
            showText(text);

    },
    showWinner: function (winAmount) {
        headerBalansInputVal.setText($.client.UserData.CurrencySign + parseFloat(USER_BALANCE).toFixed(2));
        var text = $.client.getLocalizedString("TEXT_DISPLAY_MSG_PLAYER_WIN", true) + $.client.UserData.CurrencySign + parseFloat(winAmount).toFixed(2);
        MessageDispatcher.betHistory[MessageDispatcher.betHistory.length - 1].winAmount = parseFloat(winAmount).toFixed(2);
        this.changeStatus(text, 1, false, 2000);
        //    headerWinInputVal.setText($.client.UserData.CurrencySign + parseFloat(winAmount).toFixed(2));
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
        msgBox.height = msgText.height * 2;
        msgBox.width = msgText.width + 40;
        msgTimeout = setTimeout(function () {
            worldGroup.remove(msgGroup);
        }, 4000);
    },
    playWinNumberSound: function (number) {
        $.client.playSound('../../sounds/numbers/' + number + '.mp3');
    },
    clearWinAmout: function () {
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
    showWheel: function () {
        var self = this, numberDeg, number, speed, circle, obj = {};
        var wheelNumberMap = [12, 28, 7, 29, 18, 22, 9, 31, 14, 20, 1, 33, 16, 24, 5, 10, 23, 8, 30, 11, 36, 13, 27, 6, 34, 17, 25, 2, 21, 4, 19, 15, 32, 0, 26, 3, 35];
        var poolTable = this.add.sprite(275, 70, 'pool_table', 0);
        poolTable.width = 750;
        poolTable.height = 500;
        modalBg = this.add.button(0, 0, "modalBg", this.hideVideo, this);
        modalBg.height = 750;
        modalBg.width = 1334;
        modalBg.priorityID = 0;
        videoGroup.y = -750;
        videoGroup.add(modalBg);
        videoGroup.add(poolTable);
        var bullrim = this.add.sprite(395, 70, 'bullrim', 0);
        bullrim.scale.set(1.3);
        videoGroup.add(bullrim);
        var wheel = this.add.sprite(648, 320, 'wheel', 0);
        wheel.scale.set(1.3);
        videoGroup.add(wheel);
        wheel.anchor.setTo(0.5, 0.5);
        var ball = this.add.sprite(648, 320, 'ball', 0);
        ball.angle += 2;
        obj.spin = function (value) {
            number = value;
            numberDeg = wheelNumberMap.indexOf(number) * 9.8;
            speed = 2;
            circle = 4;
        }
        function rotateWheel() {
            var wheelAngle = wheel.angle >= 0 ? wheel.angle : 360 + wheel.angle
            var ballAngle = ball.angle >= 0 ? ball.angle : 360 + ball.angle
            var diff;
            diff = parseInt(wheelAngle - ballAngle) + 6;
            diff = diff > 0 ? diff : 360 + diff
            if (number > -1) {
                if ((numberDeg + 5 > diff && numberDeg <= diff)) {
                    if (circle <= 0) {
                        number = -1;
                    } else {
                        speed -= 0.3;
                        circle--;
                        ball.angle -= 5;
                    }
                }
                wheel.angle += speed;
                ball.angle -= speed;
            } else {
                wheel.angle += 0.4;
                ball.angle += 0.4;
            }
            setTimeout(function () {
                rotateWheel();
            }, 10);
        }
        ball.scale.set(1.3);
        ball.anchor.setTo(5.54, 5.54);
        videoGroup.add(ball);
        rotateWheel();
        return obj;
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
    }
};
