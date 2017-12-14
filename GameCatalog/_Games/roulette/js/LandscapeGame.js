
var TABLE_MIN_BET, TABLE_MAX_BET,
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

    USER_BALANCE = 0 ;
    TOTAL_LOST = 0;

    var arrayNambers = [[1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34], [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35], [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]],
        blackNumberArr = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35],
        redNumberArr = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36],
        ceroNumberArr = [26, 32, 15, 12, 35, 3],
        vecinosNumberArr = [3,0,19,12,15, 4, 21, 2, 25,26, 22, 18, 29, 7, 28],
        huerfanosNumberArr = [17, 34, 6, 1, 20, 14, 31, 9],
        serie5_8NumberArr = [27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33];
var dib_cost = [0.1, 1, 5, 10, 25, 50],
    NUM_DIB = dib_cost.length - 1,
    selectedChipId=0,
    table, summaDeb = 0,
    statusBg, infoText, timerText;
   

var Bets ={};
var betHistory =[];

var winNumInfo ={}, msgBoxPopup, msgBoxTween, limitPopup, limitPopupTween, statPopup,historyPopup, statPopupTween, selectedLimits =[];
var cellName, betName, borderPosArr;

var tableChips = [];
var previousBetChips = [];
var lastRevive = 0;
var limitBtnText, confirmLimitBtn;
var lastAmount = {'straight':0, 'column_dozen':0, 'fifty_fifty':0 };

var userNameText, USER_NAME, headerBetInputVal, headerBalansInputVal;
var footerMenu, winNum, placeHold, timer;
var _winNumUpdate, progressText, _videoFlagShow, isModalShow,isSubmiting;

var worldGroup = {}, tableGroup = {}, chipsGroup={}, buttonGroup={}, selectedChipsGroup ={},
    headerGroup ={}, footerGroup ={}, winTextGroup ={}, limitGroup ={}
;
var tableCell = {},  Dozen ={}, Column = {}, Orphelins = {}, Neighbors = {}, RouletteLandscapeGame = {};
var previousMsgType, winAmount = 0, lastChangeStatus, startGameBtn;

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
        this.game.stage.backgroundColor = '#141414';
        this.load.image('headerBarBg', 'images/pad_topbar_bg.png');
        this.load.image('bottomBarBg', 'images/pad_bottombar_bg.png');
        this.load.image('table', 'images/pad_gameplay_bg.png');
        this.load.image('valueText', 'images/pad_value_text.png');
        this.load.spritesheet('btn', 'images/pad_btns.png', 150, 48);
        this.load.image('dialogBg', 'images/pad_dialog.png');
        this.load.image('historyBox', 'images/pad_history_box.png');
        this.load.image('bgConfirm', 'images/pad_bgConfirm.png');
        this.load.image('statsBox', 'images/pad_statsBox.png');
        this.load.image('bgModal', 'images/pad_statsBox.png');
        this.load.spritesheet('limitBtnBg', 'images/limit_btn_bg_new.png', 500, 50);
        this.load.spritesheet('statChartBg', 'images/stat_chart_bg.gif', 1, 50);
        this.load.spritesheet('winNumBg', 'images/winnum_bg.png', 58, 35);
        this.load.image('placeholder', 'images/placeholder.png');
        this.load.spritesheet('chips_sprite', 'images/chips_sprite.png', 112, 108);
        this.load.spritesheet('statusBg', 'images/table_status.png', 490, 54);
        this.load.image('cell', 'images/cell.gif', 50, 35);
        this.load.image('spriteY', 'images/sprite_y.gif', 2, 35);
        this.load.image('spriteX', 'images/sprite_x.gif', 50, 2);
        this.load.image('spriteXY', 'images/sprite_xy.gif', 4, 4);
        this.load.image('cellZero', 'images/cell_zero.gif', 4, 4);
        this.load.image('dozen', 'images/dozen.gif');
        this.load.image('low', 'images/low.gif');
        this.load.image('high', 'images/high.gif');
        this.load.image('even_red', 'images/even_red.gif');
        this.load.image('odd_black', 'images/odd_black.gif');
        this.load.image('cero', 'images/cero.gif');
        this.load.image('vecinos', 'images/vecinos.gif');
        this.load.image('huerfanos', 'images/huerfanos.gif');
        this.load.image('serie5_8', 'images/serie5_8.gif');
        this.load.image('close-icon', 'images/close-icon.png');

        for(var a = NUM_DIB; a >= 0; a--){
            this.load.spritesheet('dib_'+a, 'images/dib_'+a+'.png', 60, 60);          
        }
        this.game.load.onFileComplete.add(this.updateProgressBar, this);
    },

    create: function () { 
        var self = this;
        worldGroup = this.add.group();
        tableGroup = this.add.group();
        chipsGroup = this.add.group();
        buttonGroup = this.add.group();
        selectedChipsGroup = this.add.group();
        
        headerGroup = this.add.group();
        footerGroup = this.add.group();

        worldGroup.add(tableGroup);
        tableGroup.add(chipsGroup);        

        worldGroup.add(buttonGroup);        
        buttonGroup.add(headerGroup);
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
    
    update: function(){
        seconds = Math.floor(this.time.totalElapsedSeconds());
        if(lastRevive != seconds && seconds % 5 == 0){
            if (MessageDispatcher.isSetWinNum && MessageDispatcher.winNumArr.length > 0) {
                winTextGroup.removeAll();
                var winArr = MessageDispatcher.winNumArr.reverse();
                for (var i = 0; i < winArr.length; i++) {
                    _winNumUpdate = winArr[i] + '';
                    if (jQuery.inArray(winArr[i], blackNumberArr) != -1) {
                        winNum = this.add.sprite(footerMenu.x+125+(48*i), footerMenu.y-30, 'winNumBg', 1);                        
                    } else if (jQuery.inArray(winArr[i], redNumberArr) != -1) {
                        winNum = this.add.sprite(footerMenu.x+125+(48*i), footerMenu.y-30, 'winNumBg', 0);                       

                    }else{
                        winNum = this.add.sprite(footerMenu.x+125+(48*i), footerMenu.y-30, 'winNumBg', 2);
                    }
                    winNumInfo[i] = this.add.text(winNum.x+22, winNum.y+4, _winNumUpdate, { font: "bold 18px Arial", fill: "#ffffff", align: "center"}); 
                    winNumInfo[i].anchor.x = Math.round(winNumInfo[i].width * 0.5) / winNumInfo[i].width;
                    winNum.scale.set(0.8);
                    winTextGroup.add(winNum);
                    winTextGroup.add(winNumInfo[i]);
                }
            }
            lastRevive = seconds;
        }
    },
    create: function () {
        TABLE_WIDTH = 183,
        TABLE_HEIGHT = 520,
        DIB_WIDTH = 61,
        DIB_HEIGHT = 43.2,
        DIB_SPASE = 0.4,
        TABLE_COLS = Math.floor(TABLE_WIDTH / DIB_WIDTH),
        TABLE_ROWS = Math.floor(TABLE_HEIGHT / DIB_HEIGHT);
        var self = this;
        var headerMenu, bottomBetLabel, betInput, balansLabel,
            balansInput, headerLimitBtn, headerStatsBtn, historyBtn,
            chipsBg, chipsEl;

        var spriteXY, spriteX, spriteY;
        var confirmBtn;
        var deleteLastBtn;
        var clearAllBetBtn, cancelLastBtn, cancelAllBetBtn, repeatBetBtn;
        game.stage.backgroundColor = '#000000';
        //    worldGroup.width = GAME_WIDTH;
        //    worldGroup.height = GAME_HEIGHT;

        worldGroup = this.add.group();
        worldGroup.add(tableGroup);
        this.scale.setUserScale(SCALE, SCALE);
        this.scale.refresh();
        tableGroup = this.add.group();
        chipsGroup = this.add.group();
        selectedChipsGroup = this.add.group();

        headerGroup = this.add.group();
        footerGroup = this.add.group();
        limitGroup = this.add.group();

        worldGroup.add(tableGroup);
        worldGroup.add(headerGroup);
        worldGroup.add(footerGroup);

        worldGroup.add(buttonGroup);
        worldGroup.add(limitGroup);

        winTextGroup = this.add.group();
        table = this.add.sprite(0, 0, 'table');
        tableGroup.add(table);

        headerMenu = this.add.sprite(0, -8, 'bottomBarBg');
        headerMenu.width = this.game.world.width;
        headerGroup.add(headerMenu);

        footerMenu = this.add.sprite(0, worldGroup.height - 57, 'bottomBarBg');
        footerMenu.width = this.game.world.width;
        footerGroup.add(footerMenu);
        footerGroup.add(chipsGroup);

        userNameText = this.add.text(headerMenu.x + 10, headerMenu.y + 20, USER_NAME, {
            font: "16px Arial",
            fill: "#c2c2c2"
        });
        headerGroup.add(userNameText);
        this.add.text(footerMenu.x + 15, footerMenu.y - 25, $.client.getLocalizedString("TEXT_LAST_RESULTS", true), {
            font: "18px Arial",
            fill: "#c2c2c2",
            align: "center"
        });
        bottomBetLabel = this.add.text(footerMenu.width - 360, footerMenu.y - 25, $.client.getLocalizedString("TEXT_BET", true), {
            font: "16px Arial",
            fill: "#c2c2c2"
        });
        footerGroup.add(bottomBetLabel);

        betInput = this.add.sprite(footerMenu.width - 320, footerMenu.y - 28, 'valueText');
        betInput.width = 100;
        footerGroup.add(betInput);

        headerBetInputVal = this.add.text(betInput.x + 50, betInput.y + 2, $.client.UserData.CurrencySign + '0', {
            font: "18px Arial bold",
            fill: "#ffffff",
            wordWrap: true,
            wordWrapWidth: betInput.width
        });
        headerBetInputVal.anchor.x = Math.round(headerBetInputVal.width * 0.5) / headerBetInputVal.width;
        footerGroup.add(headerBetInputVal);

        balansLabel = this.add.text(footerMenu.width - 190, footerMenu.y - 25, $.client.getLocalizedString("TEXT_BALANCE", true), {
            font: "16px Arial",
            fill: "#c2c2c2"
        });
        footerGroup.add(balansLabel);

        balansInput = this.add.sprite(footerMenu.width - 120, footerMenu.y - 28, 'valueText');
        balansInput.width = 100;
        footerGroup.add(balansInput);

        headerBalansInputVal = this.add.text(balansInput.x + 50, balansInput.y + 2, $.client.UserData.CurrencySign + USER_BALANCE, {
            font: "18px Arial bold",
            fill: "#d0b92a",
            wordWrap: true,
            wordWrapWidth: betInput.width
        });
        headerBalansInputVal.anchor.x = Math.round(headerBalansInputVal.width * 0.5) / headerBalansInputVal.width;
        footerGroup.add(headerBalansInputVal);

        /*      videoBtn = this.add.button(headerMenu.x + 320, headerMenu.y+2, 'videoBtn', this.showVideo, this, 1 , 0);
                videoBtn.input.useHandCursor = true;
                videoBtn.clicked = true;
                buttonGroup.add(videoBtn);
        */
        historyBtn = this.add.button(headerGroup.width - 160, headerGroup.y - 8, 'btn', this.showHistory, this, 1, 0);
        historyBtn.input.useHandCursor = true;
        historyBtn.clicked = true;
        this.add.text(historyBtn.x + 35, historyBtn.y + 18, $.client.getLocalizedString("TEXT_HISTORY", true), {
            font: "18px Arial",
            fill: "#ffffff",
            align: "center"
        });
        headerGroup.add(historyBtn);

        headerLimitBtn = this.add.button(headerGroup.width - 310, headerGroup.y - 8, 'btn', this.getLimits, this, 1, 0);
        headerLimitBtn.clicked = true;
        headerLimitBtn.input.useHandCursor = true;
        this.add.text(headerLimitBtn.x + 35, headerLimitBtn.y + 18, $.client.getLocalizedString("TEXT_LIMITS", true), {
            font: "18px Arial",
            fill: "#ffffff",
            align: "center"
        });
        headerGroup.add(headerLimitBtn);

        headerStatsBtn = this.add.button(headerGroup.width - 460, headerGroup.y - 8, 'btn', this.getStatisticData, this, 1, 0);
        headerStatsBtn.clicked = true;
        headerStatsBtn.input.useHandCursor = true;
        this.add.text(headerStatsBtn.x + 25, headerStatsBtn.y + 18, $.client.getLocalizedString("TEXT_STATISTIC", true), {
            font: "18px Arial",
            fill: "#ffffff",
            align: "center"
        });
        headerGroup.add(headerStatsBtn);
        placeHold = this.add.sprite(0, this.game.world.centerY, 'placeholder');
        tableGroup.add(placeHold);
        placeHold.kill();
        statusBg = this.add.sprite(42, 488, 'statusBg');
        statusBg.width = 642;
        tableGroup.add(statusBg);

        infoText = this.add.text(statusBg.x + 330, statusBg.y + 15, $.client.getLocalizedString("PLEASE WAIT FOR THE NEXT OPEN TABLE", true), {
            font: "bold 21px Arial",
            fill: "#ffffff",
            wordWrap: true,
            wordWrapWidth: statusBg.width,
            align: "center"
        });
        infoText.anchor.x = Math.round(infoText.width * 0.5) / infoText.width;
        tableGroup.add(infoText);

      /*  confirmBtn = this.add.button(footerMenu.width - 175, footerMenu.y, 'btn', this.confirBet, this, 1, 0);
        confirmBtn.input.useHandCursor = true;
        confirmBtn.clicked = true;
        this.add.text(confirmBtn.x + 35, confirmBtn.y + 15, $.client.getLocalizedString("TEXT_CONFIRM", true), {
            font: "18px Arial",
            fill: "#c2c2c2",
            align: "center"
        });
        footerGroup.add(confirmBtn);*/

        /* deleteLastBtn = this.add.button(footerMenu.x + 350, footerMenu.y, 'btn', this.clearLastBet, this, 1, 0);
        deleteLastBtn.input.useHandCursor = true;
        deleteLastBtn.clicked = true;
        this.add.text(deleteLastBtn.x + 45, deleteLastBtn.y + 15, $.client.getLocalizedString("TEXT_UNDO", true), {
            font: "18px Arial",
            fill: "#c2c2c2",
            align: "center"
        });
        footerGroup.add(deleteLastBtn);


        clearAllBetBtn = this.add.button(footerMenu.x + 200, footerMenu.y, 'btn', this.clearAllBet, this, 1, 0);
        clearAllBetBtn.input.useHandCursor = true;
        clearAllBetBtn.clicked = true;
        this.add.text(clearAllBetBtn.x + 35, clearAllBetBtn.y + 15, $.client.getLocalizedString("TEXT_CLEAR_ALL", true), {
            font: "18px Arial",
            fill: "#c2c2c2",
            align: "center"
        });
        footerGroup.add(clearAllBetBtn);*/
        cancelAllBetBtn = this.add.button(footerMenu.x + 200, footerMenu.y, 'btn', this.cancelAllBet, this, 1, 0);
        cancelAllBetBtn.input.useHandCursor = true;
        cancelAllBetBtn.clicked = true;
        this.add.text(cancelAllBetBtn.x + 15, cancelAllBetBtn.y + 15, $.client.getLocalizedString("TEXT_CANCEL_ALL_BET", true), {
            font: "18px Arial",
            fill: "#c2c2c2",
            align: "center"
        });
        footerGroup.add(cancelAllBetBtn);
        cancelLastBtn = this.add.button(footerMenu.x + 350, footerMenu.y, 'btn', this.cancelLastBet, this, 1, 0);
        cancelLastBtn.input.useHandCursor = true;
        cancelLastBtn.clicked = true;
        this.add.text(cancelLastBtn.x + 10, cancelLastBtn.y + 15, $.client.getLocalizedString("TEXT_CANCEL_LAST_BET", true), {
            font: "18px Arial",
            fill: "#c2c2c2",
            align: "center"
        });
        footerGroup.add(cancelLastBtn);
        repeatBetBtn = this.add.button(footerMenu.x + 50, footerMenu.y, 'btn', this.repeatBets, this, 1, 0);
        repeatBetBtn.input.useHandCursor = true;
        repeatBetBtn.clicked = true;
        this.add.text(repeatBetBtn.x + 45, repeatBetBtn.y + 15, $.client.getLocalizedString("TEXT_REPEAT", true), {
            font: "18px Arial",
            fill: "#c2c2c2",
            align: "center"
        });
        footerGroup.add(repeatBetBtn);

        startGameBtn = this.add.group();
        var startGameBtnBg = this.add.button(footerMenu.x + 850, footerMenu.y, 'btn', this.startGame, this);
        startGameBtnBg.clicked = true;
        startGameBtnBg.input.useHandCursor = true;
        var startGameBtnTxt = this.add.text(startGameBtnBg.x + 47, startGameBtnBg.y + 12, $.client.getLocalizedString("TEXT_SPIN", true), {
            font: "22px Arial",
            fill: "#c2c2c2",
            align: "center"
        });
        startGameBtn.btn = startGameBtnBg;
        startGameBtn.add(startGameBtnBg);
        startGameBtn.add(startGameBtnTxt);
        footerGroup.add(startGameBtn);
        startGameBtn.alpha = 0;

        this.getLimits();

        for (var a = 0; a <= NUM_DIB; a++) {
            if (a == selectedChipId) {
                chipsEl = chipsGroup.create(footerMenu.width - 500 + (a * 50), footerMenu.y - 3, 'chips_sprite', a * 2 + 1);
            } else {
                chipsEl = chipsGroup.create(footerMenu.width - 500 + (a * 50), footerMenu.y - 3, 'chips_sprite', a * 2);
            }
            chipsEl.scale.set(0.52, 0.52);
            chipsEl.debValue = dib_cost[a];
            chipsEl.id = a;
            chipsEl.inputEnabled = true;
            chipsEl.input.useHandCursor = true;
            chipsEl.events.onInputDown.add(this.changeChips, this);
            var chipText = this.add.text(footerMenu.width - 470 + (a * 50), footerMenu.y + 15, dib_cost[a], {
                font: "bold 16px Arial",
                fill: "#000000",
                wordWrap: true,
                align: "center"
            });
            chipText.anchor.x = Math.round(chipText.width * 0.5) / chipText.width;
            chipsGroup.add(chipText);
        }


        for (var i = 0; i < TABLE_COLS; i++) {
            for (var j = 0; j < TABLE_ROWS; j++) {

                cellName = 'cell_' + i.toString() + '_' + j.toString();
                tableCell[cellName] = tableGroup.create(table.x + 817 + i * (DIB_WIDTH + DIB_SPASE), table.y + 96 + j * (DIB_HEIGHT + DIB_SPASE), 'cell');
                tableCell[cellName].name = cellName;

                tableCell[cellName].bet_name = arrayNambers[i][j];
                tableCell[cellName].bet_type = 'straight';

                tableCell[cellName].inputEnabled = true;
                tableCell[cellName].alpha = 0;
                tableCell[cellName].scale.set(0.8);
                tableCell[cellName].events.onInputOver.add(this.cellOver, this);
                tableCell[cellName].events.onInputOut.add(this.cellOut, this);
                tableCell[cellName].events.onInputDown.add(this.cellClick, this);

                spriteX = tableGroup.create(table.x + 812 + i * (DIB_WIDTH + DIB_SPASE), table.y + 96 + j * (DIB_HEIGHT + DIB_SPASE), 'spriteY');
                spriteX.name = 'lineX_' + i.toString() + '_' + j.toString();
                spriteX.alpha = 0;
                spriteX.scale.set(0.8);
                spriteX.inputEnabled = true;
                spriteX.events.onInputDown.add(this.clickOnSpriteX, this);
                spriteX.events.onInputOver.add(this.spriteXOver, this);
                spriteX.events.onInputOut.add(this.spriteXOut, this);

                spriteY = tableGroup.create(table.x + 817 + i * (DIB_WIDTH + DIB_SPASE), table.y + 91 + j * (DIB_HEIGHT + DIB_SPASE), 'spriteX');
                spriteY.name = 'lineX_' + i.toString() + '_' + j.toString();
                spriteY.alpha = 0;
                spriteY.scale.set(0.8);
                spriteY.inputEnabled = true;
                spriteY.events.onInputDown.add(this.clickOnSpriteY, this);
                spriteY.events.onInputOver.add(this.spriteYOver, this);
                spriteY.events.onInputOut.add(this.spriteYOut, this);

                spriteXY = tableGroup.create(table.x + 812 + i * (DIB_WIDTH + DIB_SPASE), table.y + 91 + j * (DIB_HEIGHT + DIB_SPASE), 'spriteXY');
                spriteXY.name = 'crossXY_' + i.toString() + '_' + j.toString();
                spriteXY.inputEnabled = true;
                spriteXY.scale.set(0.8);
                spriteXY.alpha = 0;
                spriteXY.events.onInputDown.add(this.clickOnSpriteXY, this);
                spriteXY.events.onInputOver.add(this.spriteXYOver, this);
                spriteXY.events.onInputOut.add(this.spriteXYOut, this);
            }
        }

        tableCell['zero'] = tableGroup.create(table.x + 816, table.y + 46, 'cellZero');
        tableCell['zero'].name = 'zero';

        tableCell['zero'].bet_name = 0;
        tableCell['zero'].bet_type = 'straight';

        tableCell['zero'].alpha = 0;
        tableCell['zero'].scale.set(0.8);

        tableCell['zero'].inputEnabled = true;
        tableCell['zero'].events.onInputDown.add(this.cellClick, this);
        tableCell['zero'].events.onInputOver.add(this.cellOver, this);
        tableCell['zero'].events.onInputOut.add(this.cellOut, this);

        Dozen['one'] = tableGroup.create(table.x + 759, table.y + 96, 'dozen');
        Dozen['one'].name = 'dozenOne';

        Dozen['one'].bet_name = 'first12';
        Dozen['one'].bet_type = 'dozen';

        Dozen['one'].alpha = 0;
        Dozen['one'].scale.set(0.8);
        Dozen['one'].inputEnabled = true;
        Dozen['one'].events.onInputDown.add(this.dozenOneClick, this);
        Dozen['one'].events.onInputOver.add(this.dozenOneOver, this);
        Dozen['one'].events.onInputOut.add(this.dozenOneOut, this);

        Dozen['two'] = tableGroup.create(table.x + 759, table.y + 271, 'dozen');
        Dozen['two'].name = 'dozenTwo';

        Dozen['two'].bet_name = 'second12';
        Dozen['two'].bet_type = 'dozen';

        Dozen['two'].alpha = 0;
        Dozen['two'].scale.set(0.8);
        Dozen['two'].inputEnabled = true;
        Dozen['two'].events.onInputDown.add(this.dozenTwoClick, this);
        Dozen['two'].events.onInputOver.add(this.dozenTwoOver, this);
        Dozen['two'].events.onInputOut.add(this.dozenTwoOut, this);

        Dozen['three'] = tableGroup.create(table.x + 759, table.y + 446, 'dozen');
        Dozen['three'].name = 'dozenThree';

        Dozen['three'].bet_name = 'third12';
        Dozen['three'].bet_type = 'dozen';

        Dozen['three'].alpha = 0;
        Dozen['three'].scale.set(0.8);
        Dozen['three'].inputEnabled = true;
        Dozen['three'].events.onInputDown.add(this.dozenThreeClick, this);
        Dozen['three'].events.onInputOver.add(this.dozenThreeOver, this);
        Dozen['three'].events.onInputOut.add(this.dozenThreeOut, this);


        Column['one'] = tableGroup.create(table.x + 817, table.y + 619, 'cell');
        Column['one'].name = 'columnOne';

        Column['one'].bet_name = 'col1';
        Column['one'].bet_type = 'column';

        Column['one'].alpha = 0;
        Column['one'].scale.set(0.8);
        Column['one'].inputEnabled = true;
        Column['one'].events.onInputDown.add(this.columnOneClick, this);
        Column['one'].events.onInputOver.add(this.columnOneOver, this);
        Column['one'].events.onInputOut.add(this.columnOneOut, this);

        Column['two'] = tableGroup.create(table.x + 878, table.y + 619, 'cell');
        Column['two'].name = 'columnTwo';

        Column['two'].bet_name = 'col2';
        Column['two'].bet_type = 'column';

        Column['two'].alpha = 0;
        Column['two'].scale.set(0.8);
        Column['two'].inputEnabled = true;
        Column['two'].events.onInputDown.add(this.columnTwoClick, this);
        Column['two'].events.onInputOver.add(this.columnTwoOver, this);
        Column['two'].events.onInputOut.add(this.columnTwoOut, this);

        Column['three'] = tableGroup.create(table.x + 939, table.y + 619, 'cell');
        Column['three'].name = 'columnThree';

        Column['three'].bet_name = 'col3';
        Column['three'].bet_type = 'column';

        Column['three'].alpha = 0;
        Column['three'].scale.set(0.8);
        Column['three'].inputEnabled = true;
        Column['three'].events.onInputDown.add(this.columnThreeClick, this);
        Column['three'].events.onInputOver.add(this.columnThreeOver, this);
        Column['three'].events.onInputOut.add(this.columnThreeOut, this);



        Orphelins['low'] = tableGroup.create(table.x + 719, table.y + 94, 'low');
        Orphelins['low'].name = 'low';
        Orphelins['low'].bet_name = 'first18';
        Orphelins['low'].bet_type = 'high_low';
        Orphelins['low'].alpha = 0;
        Orphelins['low'].scale.set(0.8);
        Orphelins['low'].inputEnabled = true;
        Orphelins['low'].events.onInputDown.add(this.lowClick, this);
        Orphelins['low'].events.onInputOver.add(this.lowOver, this);
        Orphelins['low'].events.onInputOut.add(this.lowOut, this);

        Orphelins['high'] = tableGroup.create(table.x + 719, table.y + 531, 'high');
        Orphelins['high'].name = 'high';
        Orphelins['high'].bet_name = 'second18';
        Orphelins['high'].bet_type = 'high_low';
        Orphelins['high'].alpha = 0;
        Orphelins['high'].scale.set(0.8);
        Orphelins['high'].inputEnabled = true;
        Orphelins['high'].events.onInputDown.add(this.highClick, this);
        Orphelins['high'].events.onInputOver.add(this.highOver, this);
        Orphelins['high'].events.onInputOut.add(this.highOut, this);

        Orphelins['even'] = tableGroup.create(table.x + 719, table.y + 182, 'even_red');
        Orphelins['even'].name = 'even';
        Orphelins['even'].bet_name = 'even';
        Orphelins['even'].bet_type = 'evens_odds';
        Orphelins['even'].alpha = 0;
        Orphelins['even'].scale.set(0.8);
        Orphelins['even'].inputEnabled = true;
        Orphelins['even'].events.onInputDown.add(this.evenClick, this);
        Orphelins['even'].events.onInputOver.add(this.evenOver, this);
        Orphelins['even'].events.onInputOut.add(this.evenOut, this);

        Orphelins['odd'] = tableGroup.create(table.x + 719, table.y + 445, 'odd_black');
        Orphelins['odd'].name = 'odd';
        Orphelins['odd'].bet_name = 'odd';
        Orphelins['odd'].bet_type = 'evens_odds';
        Orphelins['odd'].alpha = 0;
        Orphelins['odd'].scale.set(0.8);
        Orphelins['odd'].inputEnabled = true;
        Orphelins['odd'].events.onInputDown.add(this.oddClick, this);
        Orphelins['odd'].events.onInputOver.add(this.oddOver, this);
        Orphelins['odd'].events.onInputOut.add(this.oddOut, this);

        Orphelins['black'] = tableGroup.create(table.x + 719, table.y + 269, 'odd_black');
        Orphelins['black'].name = 'black';
        Orphelins['black'].bet_name = 'black';
        Orphelins['black'].bet_type = 'color';
        Orphelins['black'].alpha = 0;
        Orphelins['black'].scale.set(0.8);
        Orphelins['black'].inputEnabled = true;
        Orphelins['black'].events.onInputDown.add(this.blackClick, this);
        //  Orphelins['black'].events.onDragStop.add(this.blackToggle, this);
        Orphelins['black'].events.onInputOver.add(this.blackOver, this);
        Orphelins['black'].events.onInputOut.add(this.blackOut, this);

        Orphelins['red'] = tableGroup.create(table.x + 719, table.y + 358, 'even_red');
        Orphelins['red'].name = 'red';
        Orphelins['red'].bet_name = 'red';
        Orphelins['red'].bet_type = 'color';
        Orphelins['red'].alpha = 0;
        Orphelins['red'].scale.set(0.8);
        Orphelins['red'].inputEnabled = true;
        Orphelins['red'].events.onInputDown.add(this.redClick, this);
        Orphelins['red'].events.onInputOver.add(this.redOver, this);
        Orphelins['red'].events.onInputOut.add(this.redOut, this);

        Neighbors['cero'] = tableGroup.create(table.x + 25, table.y + 663, 'cero');
        Neighbors['cero'].name = 'cero';
        Neighbors['cero'].bet_name = 'cero';
        Neighbors['cero'].bet_type = 'straight';
        Neighbors['cero'].alpha = 0;
        Neighbors['cero'].scale.set(0.9);
        Neighbors['cero'].angle = 270;
        Neighbors['cero'].inputEnabled = true;
        Neighbors['cero'].events.onInputDown.add(this.ceroClick, this);
        Neighbors['cero'].events.onInputOver.add(this.ceroOver, this);
        Neighbors['cero'].events.onInputOut.add(this.ceroOut, this);

        Neighbors['vecinos'] = tableGroup.create(table.x + 146, table.y + 663, 'vecinos');
        Neighbors['vecinos'].name = 'vecinos';
        Neighbors['vecinos'].bet_name = 'vecinos';
        Neighbors['vecinos'].bet_type = 'straight';
        Neighbors['vecinos'].alpha = 0;
        Neighbors['vecinos'].scale.set(0.9);
        Neighbors['vecinos'].angle = 270;
        Neighbors['vecinos'].inputEnabled = true;
        Neighbors['vecinos'].events.onInputDown.add(this.vecinosClick, this);
        Neighbors['vecinos'].events.onInputOver.add(this.vecinosOver, this);
        Neighbors['vecinos'].events.onInputOut.add(this.vecinosOut, this);

        Neighbors['huerfanos'] = tableGroup.create(table.x + 335, table.y + 663, 'huerfanos');
        Neighbors['huerfanos'].name = 'huerfanos';
        Neighbors['huerfanos'].bet_name = 'huerfanos';
        Neighbors['huerfanos'].bet_type = 'straight';
        Neighbors['huerfanos'].alpha = 0;
        Neighbors['huerfanos'].scale.set(0.9);
        Neighbors['huerfanos'].angle = 270;

        Neighbors['huerfanos'].inputEnabled = true;
        Neighbors['huerfanos'].events.onInputDown.add(this.huerfanosClick, this);
        Neighbors['huerfanos'].events.onInputOver.add(this.huerfanosOver, this);
        Neighbors['huerfanos'].events.onInputOut.add(this.huerfanosOut, this);

        Neighbors['serie'] = tableGroup.create(table.x + 445, table.y + 663, 'serie5_8');
        Neighbors['serie'].name = 'serie';
        Neighbors['serie'].bet_name = 'serie';
        Neighbors['serie'].bet_type = 'straight';
        Neighbors['serie'].alpha = 0;
        Neighbors['serie'].scale.set(0.9);
        Neighbors['serie'].angle = 270;
        Neighbors['serie'].inputEnabled = true;
        Neighbors['serie'].events.onInputDown.add(this.serieClick, this);
        Neighbors['serie'].events.onInputOver.add(this.serieOver, this);
        Neighbors['serie'].events.onInputOut.add(this.serieOut, this);

        tableGroup.add(selectedChipsGroup);
        tableGroup.bringToTop(placeHold);
        var video = $("#landscape_video");
        function changeGameSize() {
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
            game.scale.refresh();
            video.css('opacity', 0);
            setTimeout(function () {
                changeVideoSize();
                video.css('opacity', 1);
            }, 300);
        }
        window.addEventListener('resize', function () {
            changeGameSize();
        });
        video.css('opacity', 0);
        setTimeout(function () {
            changeVideoSize();
            video.css('opacity', 1);
        }, 500);
        this.updateStatistics();
        self.ready = true;
    },
    resetTable: function () {
        if (selectedChipsGroup.children && selectedChipsGroup.children.length > 0) {
            selectedChipsGroup.removeChildren();
        }
        if (headerBetInputVal !== undefined) {
            headerBetInputVal.setText('0');
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
            $.client.sendPost(JSON.stringify({
                    type: "start_game"
                }), function(responce) {
                    if (responce.IsSuccess && responce.ResponseData.success) {
                        startGameBtn.alpha = 0;
                        startGameBtn.btn.inputEnabled = false;
                    }
                    isSubmiting = false;
                }, function (err) {
                    console.log(err);
                    isSubmiting = false;
                });
        }
    },
    dozenOneClick: function (element){    
        var amountDeb = this.getAmountDeb();    
        Bets = {};
        this.multySelect({first:0, last:4, toggle:true});        

        Bets.name =element.bet_name;
        Bets.type = element.bet_type;  
        Bets.amount = amountDeb;
        Bets.items = [0];

        element.bet_amount = amountDeb;

        element.bets = Bets;             
        element.alpha = 0;
        this.makeBet(element);
    },    
    dozenOneOver: function (element){
        this.multySelect({first:0, last:4, toggle:false, toggleType:"over"});
        this.cellOver(element);
    },
    dozenOneOut: function (element){
        this.multySelect({first:0, last:4, toggle:false, toggleType:"out"});
        this.cellOut(element);
    },
    dozenTwoClick: function (element){  
        var amountDeb = this.getAmountDeb(); 
        Bets = {};
        this.multySelect({first:4, last:8, toggle:true});
        
        Bets.name =element.bet_name;
        Bets.type = element.bet_type; 
        Bets.amount = amountDeb;
        Bets.items = [1];

        element.bets = Bets; 
        element.bet_amount = amountDeb;    
        element.alpha = 0;      
        this.makeBet(element);
    },
    dozenTwoOver: function (element){
        this.multySelect({first:4, last:8, toggle:false, toggleType:"over"});
        this.cellOver(element);
    },
    dozenTwoOut: function (element){
        this.multySelect({first:4, last:8, toggle:false, toggleType:"out"});
        this.cellOut(element);
    },
    dozenThreeClick: function (element){
        var amountDeb = this.getAmountDeb();
        Bets = {};
        this.multySelect({first:8, last:12, toggle:true});
        Bets.name =element.bet_name;
        Bets.type = element.bet_type;  
        Bets.amount = amountDeb;
        Bets.items = [2];
        element.bets = Bets;
        element.bet_amount = amountDeb;

        element.alpha = 0;      
        this.makeBet(element);
    },
    dozenThreeOver: function (element){
        this.multySelect({first:8, last:12, toggle:false, toggleType:"over"});
        this.cellOver(element);
    },
    dozenThreeOut: function (element){
        this.multySelect({first:8, last:12, toggle:false, toggleType:"out"});
        this.cellOut(element);
    },
    columnOneClick: function (element){
        var amountDeb = this.getAmountDeb();
        Bets = {};
        this.multySelect({first:0, last:12, colFirst:0, colLast:1, toggle:true});    
        Bets.name =element.bet_name;
        Bets.type = element.bet_type; 
        Bets.amount = amountDeb;
        Bets.items = [0];

        element.bets = Bets;
        element.bet_amount = amountDeb;

        element.alpha = 0;              
        this.makeBet(element);
    },
    columnOneOver: function (element){
        this.multySelect({first:0, last:12, colFirst:0, colLast:1, toggle:false, toggleType:"over"});
        this.cellOver(element);    
    },
    columnOneOut: function (element){
        this.multySelect({first:0, last:12, colFirst:0, colLast:1, toggle:false, toggleType:"out"});
        this.cellOut(element);    
    },
    columnTwoClick: function (element){
        var amountDeb = this.getAmountDeb();
        this.multySelect({first:0, last:12, colFirst:1, colLast:2, toggle:true});    
        Bets.name =element.bet_name;
        Bets.type = element.bet_type;  
        Bets.amount = amountDeb;
        Bets.items = [1];

        element.bets = Bets;
        element.bet_amount = amountDeb;
        element.alpha = 0;                  
        this.makeBet(element);
    },
    columnTwoOver: function (element){
        this.multySelect({first:0, last:12, colFirst:1, colLast:2, toggle:false, toggleType:"over"});
        this.cellOver(element);    
    },
    columnTwoOut: function (element){
        this.multySelect({first:0, last:12, colFirst:1, colLast:2, toggle:false, toggleType:"out"});
        this.cellOut(element);    
    },
    columnThreeClick: function (element){
        var amountDeb = this.getAmountDeb();
        this.multySelect({first:0, last:12, colFirst:1, colLast:3, toggle:true});    
        
        Bets.name =element.bet_name;       
        Bets.type = element.bet_type;  
        Bets.amount = amountDeb;
        Bets.items = [2];
        element.bet_amount = amountDeb;

        element.bets = Bets;

        element.alpha = 0;               
        this.makeBet(element);
    },
    columnThreeOver: function (element){
        this.multySelect({first:0, last:12, colFirst:2, colLast:3, toggle:false, toggleType:"over"});
        this.cellOver(element);    
    },
    columnThreeOut: function (element){
        this.multySelect({first:0, last:12, colFirst:2, colLast:3, toggle:false, toggleType:"out"});
        this.cellOut(element);    
    },
    lowClick: function (element){
        var amountDeb = this.getAmountDeb();
        this.multySelect({first:0, last:6, toggle:true});
        Bets.name =element.bet_name;       
        Bets.type = element.bet_type;  
        Bets.items = ['low'];
        Bets.amount = amountDeb;
        element.bets = Bets;     
        element.alpha = 0;      
        this.makeBet(element);
        element.bet_amount = amountDeb;
    },
    lowOver: function (element){
        this.multySelect({first:0, last:6, toggle:false, toggleType:"over"});        
        this.cellOver(element);
    },
    lowOut: function (element){
        this.multySelect({first:0, last:6, toggle:false, toggleType:"out"});        
        this.cellOut(element);
    },
    highClick: function (element){ 
        var amountDeb = this.getAmountDeb();       
        this.multySelect({first:6, last:12, toggle:true});
        Bets.name =element.bet_name;       
        Bets.type = element.bet_type;  
        Bets.amount = amountDeb;
        Bets.items = ['high'];
        element.bets = Bets;
        element.alpha = 0;
        element.bet_amount = amountDeb;  
        this.makeBet(element);
    },
    highOver: function (element){
        this.multySelect({first:6, last:12, toggle:false, toggleType:"over"});
        this.cellOver(element);
    },
    highOut: function (element){
        this.multySelect({first:6, last:12, toggle:false, toggleType:"out"});
        this.cellOut(element);
    },
    evenClick: function (element){
        var amountDeb = this.getAmountDeb();      
        element.alpha = 0;      
        Bets.name =element.bet_name;       
        Bets.type = element.bet_type;  
        Bets.items = ['evens'];
        Bets.amount = amountDeb;
        element.bets = Bets; 
        element.bet_amount = amountDeb;

        this.makeBet(element);
    },
    evenOver: function (element){
        var cellName;
        for(var i = 0; i < arrayNambers.length; i ++){
            for(var j =0; j < arrayNambers[i].length; j++){
                if(arrayNambers[i][j] % 2 ==0 ){
                    cellName = 'cell_'+ i.toString() + '_' + j.toString();      
                    this.cellOver(tableCell[cellName]);    
                } 
            }   
        }
        this.cellOver(element);
    },
    evenOut: function (element){
        var cellName;
        for(var i = 0; i < arrayNambers.length; i ++){
            for(var j =0; j < arrayNambers[i].length; j++){
                if(arrayNambers[i][j] % 2 ==0 ){
                    cellName = 'cell_'+ i.toString() + '_' + j.toString();      
                    this.cellOut(tableCell[cellName]);    
                } 
            }   
        }
        this.cellOut(element);
    },
    oddClick: function (element){
        var amountDeb = this.getAmountDeb();
        element.alpha = 0;      
        Bets.name =element.bet_name;       
        Bets.type = element.bet_type;  
        Bets.items = ['odds'];
        Bets.amount = amountDeb;
        element.bets = Bets; 
        element.bet_amount = amountDeb;

        this.makeBet(element);
    },
    oddOver: function (element){
        for(var i = 0; i < arrayNambers.length; i ++){
            for(var j =0; j < arrayNambers[i].length; j++){
                if(arrayNambers[i][j] % 2 !=0 ){
                    cellName = 'cell_'+ i.toString() + '_' + j.toString();      
                    this.cellOver(tableCell[cellName]);    
                } 
            }   
        }
        this.cellOver(element);
    },
    oddOut: function (element){
        for(var i = 0; i < arrayNambers.length; i ++){
            for(var j =0; j < arrayNambers[i].length; j++){
                if(arrayNambers[i][j] % 2 !=0 ){
                    cellName = 'cell_'+ i.toString() + '_' + j.toString();      
                    this.cellOut(tableCell[cellName]);    
                } 
            }   
        }
        this.cellOut(element);
    },
    blackClick: function (element){
        var amountDeb = this.getAmountDeb();
        this.slectArrayEl({arr : blackNumberArr, toggle:true});
        element.alpha = 0;      
        Bets.name =element.bet_name;       
        Bets.type = element.bet_type;                  
        Bets.items = ['black'];
        Bets.amount = amountDeb;        
        element.bets = Bets; 
        element.bet_amount = amountDeb;

        this.makeBet(element);
    },
    blackOver: function (element){
        this.slectArrayEl({arr:blackNumberArr, toggle:false, toggleType:"over"});
        this.cellOver(element);
    },
    blackOut: function (element){
        this.slectArrayEl({arr:blackNumberArr, toggle:false, toggleType:"out"});
        this.cellOut(element);
    },
    redClick: function (element){
        var amountDeb = this.getAmountDeb();
        this.slectArrayEl({arr:redNumberArr, toggle:true});
        element.alpha = 0;      
        Bets.name =element.bet_name;       
        Bets.type = element.bet_type;                  
        Bets.items = ['red'];
        Bets.amount = amountDeb;
        element.bets = Bets;
        element.bet_amount = amountDeb;     
        this.makeBet(element);
    },
    redOver: function (element){        
        this.slectArrayEl({arr:redNumberArr, toggle:false, toggleType:"over"});
        this.cellOver(element);
    },
    redOut: function (element){        
        this.slectArrayEl({arr:redNumberArr, toggle:false, toggleType:"out"});
        this.cellOut(element);
    },
    ceroClick: function (element){
        this.slectArrayEl({arr:ceroNumberArr, toggle:true}); 
        element.alpha = 0;  
        tableCell['zero'].alpha = 0;           
         var series = [
            { name: "lineX_2_0", key: "spriteX" },
            { name: "lineX_2_4", key: "spriteX" },
            { name: "cell_1_8",  key: "cell" },
            { name: "lineX_1_11",key: "spriteX" }
         ];
         for (var i = 0; i < series.length; i++) {
             var item = $.grep(tableGroup.children, function (n, p) {
                 return (n.name == series[i].name && n.key == series[i].key);
             })[0];
             item.events.onInputDown.dispatch(item);
         }
    },
    ceroOver: function (element){
        this.slectArrayEl({arr:ceroNumberArr, toggle:false, toggleType:"over"});
        this.cellOver(tableCell['zero']);
        this.cellOver(element);
    },
    ceroOut: function (element){
        this.slectArrayEl({arr:ceroNumberArr, toggle:false, toggleType:"out"});
        this.cellOut(tableCell['zero']);
        this.cellOut(element);
    },
    vecinosClick: function (element){        
        this.slectArrayEl({arr:vecinosNumberArr, toggle:true});
        element.alpha = 0;
        tableCell['zero'].alpha = 0;
        var series = [
            { name: "crossXY_2_0", key: "spriteXY" },
            { name: "crossXY_2_0", key: "spriteXY" },
            { name: "lineX_0_2", key: "spriteX" },
            { name: "lineX_2_4", key: "spriteX" },
            { name: "lineX_2_6", key: "spriteX" },
            { name: "lineX_0_7", key: "spriteX" },
            { name: "crossXY_1_9", key: "spriteXY" },
            { name: "crossXY_1_9", key: "spriteXY" },
            { name: "lineX_1_11", key: "spriteX" }
        ];
        for (var i = 0; i < series.length; i++) {
            var item = $.grep(tableGroup.children, function (n, p) {
                return (n.name == series[i].name && n.key == series[i].key);
            })[0];
            item.events.onInputDown.dispatch(item);
        }
    },
    vecinosOver: function (element){
        this.slectArrayEl({ arr: vecinosNumberArr, toggle: false, toggleType: "over" });
        this.cellOver(tableCell['zero']);
        this.cellOver(element);
    },
    vecinosOut: function (element){
        this.slectArrayEl({ arr: vecinosNumberArr, toggle: false, toggleType: "out" });
        this.cellOut(tableCell['zero']);
        this.cellOut(element);
    },
    huerfanosClick: function (element){
        this.slectArrayEl({arr:huerfanosNumberArr, toggle:true});
        element.alpha = 0;
         var series = [
             { name:"cell_0_0", key: "cell" },
             { name:"lineX_2_2", key: "spriteX"},
             { name:"lineX_1_5", key: "spriteX"},
             { name:"lineX_1_6", key: "spriteX"},
             { name:"lineX_0_11", key: "spriteX"}
        ];
         for (var i = 0; i < series.length; i++) {
                 var item = $.grep(tableGroup.children, function (n, p) {
                     return (n.name == series[i].name && n.key == series[i].key);
                 })[0];
                 item.events.onInputDown.dispatch(item);
          }
 
    },
    huerfanosOver: function (element){
        this.slectArrayEl({arr:huerfanosNumberArr, toggle:false, toggleType:"over"});
        this.cellOver(element);
    }, 
    huerfanosOut: function (element){
        this.slectArrayEl({arr:huerfanosNumberArr, toggle:false, toggleType:"out"});
        this.cellOut(element);
    },
    serieClick: function (element){
        this.slectArrayEl({arr:serie5_8NumberArr, toggle:true});
        element.alpha = 0;             
        var series = [
            { name:"lineX_1_2", key: "spriteX"},
            { name:"lineX_1_3", key: "spriteY"},
            { name:"lineX_0_5", key: "spriteX"},
            { name:"lineX_2_7", key: "spriteY"},
            { name:"lineX_2_9", key: "spriteX"},
            { name:"lineX_2_11", key: "spriteX"}
        ];
        for (var i = 0; i < series.length; i++) {
            var item = $.grep(tableGroup.children, function (n, p) {
                return (n.name == series[i].name && n.key == series[i].key);
            })[0];
            item.events.onInputDown.dispatch(item);
        }          
    },
    serieOver: function (element){
        this.slectArrayEl({arr:serie5_8NumberArr, toggle:false,  toggleType:"over"});
        this.cellOver(element);
    },
    serieOut: function (element){
        this.slectArrayEl({arr:serie5_8NumberArr, toggle:false, toggleType:"out"});
        this.cellOut(element);
    },
    slectArrayEl: function (pars){
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
    multySelect: function (pars){
        var firstEl = pars.first || 0;
        var lastEl = pars.last || 0;
        var toggle = pars.toggle || false;
        var toggleType = pars.toggle || 'out';
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
    clickOnSpriteXY: function (element) {
        var crossPosArr, cornerBets =[];
        var i = 0, ii = 0, iii = 0, cellX, cellY;
        var amountDeb = this.getAmountDeb();
        Bets = {};
        crossPosArr = element['name'].split('_');               
        if(crossPosArr[1] != undefined){ 
            if (parseInt(crossPosArr[2], 10) != 0){
                if (parseInt(crossPosArr[1], 10) == 0){
                    for (i = 0; i < 6; i++){
                        if (i <= 2){
                            cellName = 'cell_'+ i +'_' + crossPosArr[2].toString() ;                    
                        }else{
                            ii = i - 3;                         
                            cellY = parseInt(crossPosArr[2], 10) - 1;
                            cellName = 'cell_'+ ii +'_' + cellY.toString();                                         
                        }
                        cornerBets.push(tableCell[cellName]['bet_name']);
                    }                     
                    Bets.type ='line';

                }else {                  
                    ii = 1;
                    iii = 0;            
                    for( i = 0; i <4; i++){
                        if(i <2){
                            cellX = parseInt(crossPosArr[1], 10) - i;                           
                            cellY = parseInt(crossPosArr[2], 10) - i;                           
                        }else{
                            
                            cellX = parseInt(crossPosArr[1], 10) - iii;                         
                            cellY = parseInt(crossPosArr[2], 10) - ii;
                            ii--;
                            iii++;                          
                        }
                        cellName = 'cell_'+ cellX.toString() +'_' + cellY.toString() ;
                        tableCell[cellName].alpha = 0;
                        cornerBets.push(tableCell[cellName]['bet_name']);
                    }                     
                    Bets.type ='corner';
                }
            }
            else{
                if(parseInt(crossPosArr[1], 10) > 0){                   
                    for(i = 0; i < 2; i++){
                        cellX = parseInt(crossPosArr[1], 10) - i; 
                        cellName = 'cell_'+ cellX +'_' + crossPosArr[2].toString() ;
                        tableCell[cellName].alpha = 0;                  
                        cornerBets.push(tableCell[cellName]['bet_name']);                
                    } 
                    cornerBets.push(tableCell['zero']['bet_name']);                
                    tableCell['zero'].alpha = 0;                    
                }
                Bets.type ='corner';             
            } 

            Bets.items = cornerBets;
            Bets.name = 'bet_'+ cornerBets.join('_');
            Bets.amount = amountDeb;
            element.bet_type = Bets.type;
            element.bet_amount = amountDeb;
            element.bets = Bets;
            this.makeBet(element);
        } 
    },
    spriteXYOut: function(element){
        var crossPosArr; 
        var i = 0, ii = 0, iii = 0, cellX, cellY;
        crossPosArr = element['name'].split('_');               
        if(crossPosArr[1] != undefined){ 
            if (parseInt(crossPosArr[2], 10) != 0){
                if (parseInt(crossPosArr[1], 10) == 0){
                    for (i = 0; i < 6; i++){
                        if (i <= 2){
                            cellName = 'cell_'+ i +'_' + crossPosArr[2].toString() ;                    
                        }else{
                            ii = i - 3;                         
                            cellY = parseInt(crossPosArr[2], 10) - 1;
                            cellName = 'cell_'+ ii +'_' + cellY.toString();             
                        }

                        this.cellOut(tableCell[cellName]);                    
                    }   
                }else{                  
                    ii = 1;         
                    for( i = 0; i <4; i++){
                        if(i <2){
                            cellX = parseInt(crossPosArr[1], 10) - i;                           
                            cellY = parseInt(crossPosArr[2], 10) - i;                           
                        }else{
                            
                            cellX = parseInt(crossPosArr[1], 10) - iii;                         
                            cellY = parseInt(crossPosArr[2], 10) - ii;
                            ii--;
                            iii++;                          
                        }
                        cellName = 'cell_'+ cellX.toString() +'_' + cellY.toString() ;
                        this.cellOut(tableCell[cellName]);
                    } 
                }
            }
            else{
                if(parseInt(crossPosArr[1], 10) > 0){                   
                    for(i = 0; i < 2; i++){
                        cellX = parseInt(crossPosArr[1], 10) - i; 
                        cellName = 'cell_'+ cellX +'_' + crossPosArr[2].toString() ;                        
                        this.cellOut(tableCell[cellName]);
                    } 
                    this.cellOut(tableCell['zero']);
                }
            } 
        } 
    },   
    spriteXYOver: function(element){
        var crossPosArr;
        var i = 0, ii = 0, iii = 0, cellX, cellY;
        crossPosArr = element['name'].split('_');
        if (crossPosArr[1] != undefined) {
            if (parseInt(crossPosArr[2], 10) != 0){
                if (parseInt(crossPosArr[1], 10) == 0) {
                    for (i = 0; i < 6; i++){
                        if (i <= 2){
                            cellName = 'cell_'+ i +'_' + crossPosArr[2].toString() ;                    
                        }else{
                            ii = i - 3;                         
                            cellY = parseInt(crossPosArr[2], 10) - 1;
                            cellName = 'cell_'+ ii +'_' + cellY.toString();             
                        }

                        this.cellOver(tableCell[cellName]);                    
                    }   
                }else{                  
                    ii = 1;         
                    for( i = 0; i <4; i++){
                        if(i <2){
                            cellX = parseInt(crossPosArr[1], 10) - i;                           
                            cellY = parseInt(crossPosArr[2], 10) - i;                           
                        }else{
                            
                            cellX = parseInt(crossPosArr[1], 10) - iii;                         
                            cellY = parseInt(crossPosArr[2], 10) - ii;
                            ii--;
                            iii++;                          
                        }
                        cellName = 'cell_'+ cellX.toString() +'_' + cellY.toString() ;
                        this.cellOver(tableCell[cellName]);
                    } 
                }
            }
            else {
                if(parseInt(crossPosArr[1], 10) > 0){                   
                    for(i = 0; i < 2; i++){
                        cellX = parseInt(crossPosArr[1], 10) - i; 
                        cellName = 'cell_'+ cellX +'_' + crossPosArr[2].toString() ;                        
                        this.cellOver(tableCell[cellName]);
                    } 
                    this.cellOver(tableCell['zero']);
                }
            } 
        } 
    },
    clickOnSpriteY: function (element) {
        Bets = {};
        var amountDeb = this.getAmountDeb();
        var SplitBet =[];
        borderPosArr = element['name'].split('_');
        if(borderPosArr[1] != undefined){ 
            for (var i = 0; i<= 1; i++){
                if (parseInt(borderPosArr[2], 10) != 0){
                    cellName = 'cell_'+ borderPosArr[1].toString() +'_' + (borderPosArr[2] - i).toString() ;
                    tableCell[cellName].alpha = 0;
                    SplitBet.push(tableCell[cellName]['bet_name']);                
                }                   
            }
            if (parseInt(borderPosArr[2], 10) == 0){
                cellName = 'cell_'+ borderPosArr[1].toString() +'_' + borderPosArr[2].toString();
                tableCell[cellName].alpha = 0;  
                tableCell['zero'].alpha = 0;    
                SplitBet.push(tableCell['zero']['bet_name']);
                SplitBet.push(tableCell[cellName]['bet_name']);
            }
            Bets.name = 'bet_'+ SplitBet.join('_');
            Bets.type = 'split';
            Bets.amount = amountDeb;
            Bets.items = SplitBet;
            element.bet_amount = amountDeb;
            element.bet_type = Bets.type;
            element.bets = Bets;
            this.makeBet(element);
        }
    },
    spriteYOut: function (element){
        borderPosArr = element['name'].split('_');
        if(borderPosArr[1] != undefined){ 
            for (var i = 0; i<= 1; i++){
                if (parseInt(borderPosArr[2], 10) != 0){
                    cellName = 'cell_'+ borderPosArr[1]+'_' + (borderPosArr[2] - i).toString() ;
                    this.cellOut(tableCell[cellName]);
                }                   
            }
            if (parseInt(borderPosArr[2], 10) == 0){
                cellName = 'cell_'+ borderPosArr[1].toString() +'_' + borderPosArr[2].toString();
                this.cellOut(tableCell[cellName]);
                this.cellOut(tableCell['zero']);
            }           
        }
    },
    spriteYOver: function (element){
        borderPosArr = element['name'].split('_');
        if(borderPosArr[1] != undefined){ 
            for (var i = 0; i<= 1; i++){
                if (parseInt(borderPosArr[2], 10) != 0){
                    cellName = 'cell_'+ borderPosArr[1]+'_' + (borderPosArr[2] - i).toString() ;
                    this.cellOver(tableCell[cellName]);
                }                   
            }
            if (parseInt(borderPosArr[2], 10) == 0){
                cellName = 'cell_'+ borderPosArr[1].toString() +'_' + borderPosArr[2].toString();
                this.cellOver(tableCell[cellName]);
                this.cellOver(tableCell['zero']);
            }           
        }
    },  
    clickOnSpriteX: function (element) {
        Bets = {};
        var streetSplitBet =[];
        var amountDeb = this.getAmountDeb();
        borderPosArr = element['name'].split('_');
        if(borderPosArr[1] != undefined){ 
            if (parseInt(borderPosArr[1], 10) == 0){
                for (var i = 0; i<= 2; i++){
                    cellName = 'cell_'+ i +'_' + borderPosArr[2].toString() ;
                    tableCell[cellName].alpha = 0;
                    streetSplitBet.push(tableCell[cellName]['bet_name']);                    
                }                   
                Bets.type = 'street';                
            }
            else{
                for (var i = 0; i<= 1; i++){
                    cellName = 'cell_'+ (borderPosArr[1] - i).toString() +'_' + borderPosArr[2].toString() ;                                    
                    tableCell[cellName].alpha = 0;
                    streetSplitBet.push(tableCell[cellName]['bet_name']);                    
                }
                Bets.type = 'split';
            } 
            Bets.name = 'bet_'+ streetSplitBet.join('_'); 
            Bets.items = streetSplitBet;
            element.bet_amount = amountDeb;
            Bets.amount = amountDeb;
            element.bets = Bets;
            element.bet_type = Bets.type;
            this.makeBet(element);                            
        } 
    },   
    spriteXOut: function (element){
        borderPosArr = element['name'].split('_');     

        if(borderPosArr[1] != undefined){ 
            if (parseInt(borderPosArr[1], 10) == 0){
                for (var i = 0; i<= 2; i++){
                    cellName = 'cell_'+ i +'_' + borderPosArr[2].toString() ;               
                    this.cellOut(tableCell[cellName]);                    
                }           
            }
            else{
                for (var i = 0; i<= 1; i++){
                    cellName = 'cell_'+ (borderPosArr[1] - i).toString() +'_' + borderPosArr[2].toString() ;                
                    this.cellOut(tableCell[cellName]);
                }
            } 
        } 
    },  
    spriteXOver: function (element){
        borderPosArr = element['name'].split('_');     

        if(borderPosArr[1] != undefined){ 
            if (parseInt(borderPosArr[1], 10) == 0){
                for (var i = 0; i<= 2; i++){
                    cellName = 'cell_'+ i +'_' + borderPosArr[2].toString() ;               
                    this.cellOver(tableCell[cellName]);                    
                }           
            }
            else{
                for (var i = 0; i<= 1; i++){
                    cellName = 'cell_'+ (borderPosArr[1] - i).toString() +'_' + borderPosArr[2].toString() ;                
                    this.cellOver(tableCell[cellName]);
                }
            } 
        } 
    },   
    cellOver:function(sprite){
        sprite.alpha = 0.5;
    },    
    cellOut:function(sprite){
        sprite.alpha = 0;
    },
    cellClick: function (element){
        var amountDeb = this.getAmountDeb();
        Bets = {};
        Bets.name = 'bet_' + (element.bet_name).toString();       
        Bets.type = element.bet_type;        
        Bets.items = [element.bet_name];
        Bets.amount = amountDeb;
        element.alpha = 0;
        element.bet_amount = amountDeb;
        element.bets = Bets;
        this.makeBet(element);
    },
    getAmountDeb: function(){
         return dib_cost[selectedChipId];
     },
    clearAllBet: function (element) {
        if (tableChips.length > 0) {
            for (var i = 0; i < tableChips.length; i++) {
                var bet = tableChips[i];
                if (!bet['sent'] && bet['submit']) {
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
                            lastAmount = { 'straight': 0, 'column_dozen': 0, 'fifty_fifty': 0 };
                            tableChips = [];
                            summaDeb = 0;
                            USER_BALANCE = responce.ResponseData.balance;
                            headerBalansInputVal.setText($.client.UserData.CurrencySign + parseFloat(USER_BALANCE).toFixed(2));
                            infoText.setText($.client.getLocalizedString('TEXT_BETS_CANCELED', true));
                        }
                    }
                }, function(err) {
                    console.log(err);
                });
        }
    },
    cancelLastBet: function (element) {
        if (MessageDispatcher.isTableOpen) {
            if (tableChips.length > 0) {
                var cancelBet = tableChips[tableChips.length - 1];
                $.client.sendPost(JSON.stringify({
                    type: "cancel_last",
                    bet:cancelBet.bet
                    }), function (responce) {
                        if (responce.IsSuccess) {
                        if (responce.ResponseData.success) {
                            var bet = tableChips.pop();
                            var chip = bet.chip;
                            chip.destroy();
                            if (summaDeb > 0) {
                                summaDeb = parseFloat(summaDeb - bet.amount).toFixed(2);
                                headerBetInputVal.setText($.client.UserData.CurrencySign + summaDeb.toString());

                            }else {
                                summaDeb = 0;
                            }
                            USER_BALANCE = responce.ResponseData.balance;
                            headerBalansInputVal.setText($.client.UserData.CurrencySign + parseFloat(USER_BALANCE).toFixed(2));
                            infoText.setText($.client.getLocalizedString('TEXT_BET_CANCELED', true));
                        }
                    }
                }, function (err) {
                    console.log(err);
                });
            }
        }
    },
    clearLastBet: function (element){
            if (MessageDispatcher.isTableOpen) {
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
                }
    },
    repeatBets: function (element) {
        var self = this;
        if (MessageDispatcher.isTableOpen) {
            if (previousBetChips.length > 0) {
            for (var i = 0; i < previousBetChips.length; i++) {               
                        var bet = { name: previousBetChips[i].name, type: previousBetChips[i].type, amount: previousBetChips[i].amount, bet: previousBetChips[i].bet };
                        var isValidBet = this.checkLimit(bet);
                        if (isValidBet) {
                            bet.chip = self.add.graphics(previousBetChips[i].chip.x, previousBetChips[i].chip.y, selectedChipsGroup);
                            bet.active_sprite = this.add.sprite(0, 0, "chips_sprite", previousBetChips[i].active_sprite.frame);
                            bet.active_sprite.width = 65;
                            bet.active_sprite.height = 65;
                            bet.chip.addChild(bet.active_sprite);

                            var chipAmount = previousBetChips[i].amount;
                            for (var j = 0; j < tableChips.length; j++) {
                                if (tableChips[j].name == bet.name) {
                                    chipAmount += tableChips[j].amount;
                                }
                            }
                            bet.chipText = this.add.text(34, 20, chipAmount % 1 == 0 ? chipAmount : parseFloat(chipAmount).toFixed(1), {
                                font: "bold 20px Arial",
                                fill: "#000000",
                                wordWrap: true,
                                align: "center"
                            });
                            bet.chipText.anchor.x = Math.round(bet.chipText.width * 0.5) / bet.chipText.width;
                            bet.chip.addChild(bet.chipText);
                            bet.chip.scale.set(0.8);
                            summaDeb = parseFloat(summaDeb) + parseFloat(previousBetChips[i].amount);
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
            self.confirBet();
        }
    },
    confirBet:function(element){ 
        var bets = [];
        var unConfirmBets;   
        if (!isSubmiting) {
            var notSentChipsArray = $.grep(tableChips, function (n, i) {
                return (!n.sent);
            });
            if (MessageDispatcher.isTableOpen && notSentChipsArray.length > 0) {
                for (var i = 0; i < notSentChipsArray.length; i++) {
                    unConfirmBets = notSentChipsArray[i].bet;
                    if (Object.prototype.toString.call(unConfirmBets) ==='[object Array]'){
                        for(k =0; k < unConfirmBets.length; k++){
                            bets.push(unConfirmBets[k]);
                        }
                    } else{
                        bets.push({
                            type: unConfirmBets.type,
                            amount: unConfirmBets.amount,
                            items: unConfirmBets.items.sort(),
                            name: unConfirmBets.name
                        });
                    }
                    notSentChipsArray[i].submit = true;
                }
                isSubmiting = true;
                $.client.sendPost(JSON.stringify({
                    type: "bet",
                    bets: bets
                }), function (responce) {
                    console.log(responce);
                    if (responce.IsSuccess) {
                        USER_BALANCE = responce.ResponseData.balance;
                        headerBalansInputVal.setText($.client.UserData.CurrencySign + parseFloat(USER_BALANCE).toFixed(2));
                        if (responce.ResponseData.success) {
                            infoText.setText($.client.getLocalizedString('TEXT_INFO_BET_CONFIRMED', true));
                            console.log(notSentChipsArray);
                            for (var i = 0; i < responce.ResponseData.bets.length; i++) {
                                if (notSentChipsArray[i])
                                    notSentChipsArray[i].sent = responce.ResponseData.bets[i].wasMade;
                            }
                            previousBetChips = $.grep(tableChips, function (n, i) {
                                return (n.sent);
                            });
                        } else {
                            self.clearAllBet();
                            infoText.setText($.client.getLocalizedString('TEXT_INFO_BET_NOT_CONFIRMED', true));
                        }
                    }else{                    
                        self.clearAllBet();
                        infoText.setText($.client.getLocalizedString('TEXT_INFO_BET_NOT_CONFIRMED', true));
                    }
                    isSubmiting = false;
                }, function (err) {
                    isSubmiting = false;
                    self.clearAllBet();
                    console.log(err);
                });             
            }        
        }    
    },    
    checkLimit: function (par) {
        var name, type, amount, cellTotalAmount = 0, totalAmount;
        var valid = true;
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
                infoText.setText($.client.getLocalizedString('TEXT_ERROR_NO_MONEY_MSG', true));
                validAmount = USER_BALANCE - (totalAmount - amount);
                valid = false;
            } else if (totalAmount > TABLE_MAX_BET) {
                infoText.setText($.client.getLocalizedString('Table_limits', true, { min: TABLE_MIN_BET, max: TABLE_MAX_BET, sign: $.client.UserData.CurrencySign }));
                validAmount = TABLE_MAX_BET - (totalAmount - amount);
                valid = false;
            } else if (totalAmount < TABLE_MIN_BET) {
                infoText.setText($.client.getLocalizedString('Table_limits', true, { min: TABLE_MIN_BET, max: TABLE_MAX_BET, sign: $.client.UserData.CurrencySign }));
                valid = false;
            } else {
                if (type == 'column' || type == 'dozen') {
                    if (cellTotalAmount > COLUMN_DOZEN_MAX_BET) {
                        infoText.setText($.client.getLocalizedString('Column_Dozen_limits', true, { min: COLUMN_DOZEN_MIN_BET, max: COLUMN_DOZEN_MAX_BET, sign: $.client.UserData.CurrencySign }));
                        validAmount = COLUMN_DOZEN_MAX_BET - (cellTotalAmount - amount);
                        valid = false;
                    } else if (cellTotalAmount < COLUMN_DOZEN_MIN_BET) {
                        infoText.setText($.client.getLocalizedString('Column_Dozen_limits', true, { min: COLUMN_DOZEN_MIN_BET, max: COLUMN_DOZEN_MAX_BET, sign: $.client.UserData.CurrencySign }));
                        valid = false;
                    }
                } else if (type == 'high_low' || type == 'evens_odds' || type == 'color') {
                    if (cellTotalAmount < FIFTY_FIFTY_MIN_BET) {
                        infoText.setText($.client.getLocalizedString('Fifty_fifty_limits', true, { min: FIFTY_FIFTY_MIN_BET, max: FIFTY_FIFTY_MAX_BET, sign: $.client.UserData.CurrencySign }));
                        valid = false;
                    } else if (cellTotalAmount > FIFTY_FIFTY_MAX_BET) {
                        validAmount = FIFTY_FIFTY_MAX_BET - (cellTotalAmount - amount);
                        infoText.setText($.client.getLocalizedString('Fifty_fifty_limits', true, { min: FIFTY_FIFTY_MIN_BET, max: FIFTY_FIFTY_MAX_BET, sign: $.client.UserData.CurrencySign }));
                        valid = false;
                    }
                } else if (type == 'straight' || type == 'corner' || type == 'split' || type == 'line') {
                    if (cellTotalAmount < STRAIGHT_MIN_BET) {
                        infoText.setText($.client.getLocalizedString('Staight_limits', true, { min: STRAIGHT_MIN_BET, max: STRAIGHT_MAX_BET, sign: $.client.UserData.CurrencySign }));
                        valid = false;
                    } else if (cellTotalAmount > STRAIGHT_MAX_BET) {
                        validAmount = STRAIGHT_MAX_BET - (cellTotalAmount - amount);
                        infoText.setText($.client.getLocalizedString('Staight_limits', true, { min: STRAIGHT_MIN_BET, max: STRAIGHT_MAX_BET, sign: $.client.UserData.CurrencySign }));
                        valid = false;
                    }
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

        if (validAmount > 0) {
            valid = true;
            getChip(validAmount);
        } else {
            chips.push(selectedChipId);
        }
        return { state: valid, chips: chips };
    },
    makeBet: function (element) {
        var self = this;
        var event = $.extend(true, {}, element);
        var debValue, isValidBet, validateObj;
        var elementX, elementY;
        if (MessageDispatcher.isTableOpen) {
            var betChip = { name: event.name, type: event.bet_type, amount: event.bet_amount, bet: event.bets };
            validateObj = this.checkLimit(betChip);
            isValidBet = validateObj.state;
            if (isValidBet) {
                $.each(validateObj.chips, function (i, chipId) {
                    betChip = { name: event.name, type: event.bet_type, amount: dib_cost[chipId], bet: event.bets };
                    debValue = dib_cost[chipId];
                    var chipAmount = debValue;
                    betChip.bet.amount = dib_cost[chipId];
                    elementX = element.x + element._frame.width / 2 - 32;
                    elementY = element.y + element._frame.height / 2 - 32;
                    betChip.chip = self.add.graphics(elementX, elementY, selectedChipsGroup);
                    betChip.active_sprite = self.add.sprite(0, 0, "chips_sprite", chipId * 2);
                    betChip.active_sprite.width = 65;
                    betChip.active_sprite.height = 65;
                    betChip.chip.addChild(betChip.active_sprite);

                    for (var i = 0; i < tableChips.length; i++) {
                        if (tableChips[i].name == betChip.name) {
                            chipAmount += tableChips[i].amount;
                        }
                    }
                    betChip.chipText = self.add.text(34, 20, chipAmount % 1 == 0 ? chipAmount : parseFloat(chipAmount).toFixed(1), {
                        font: "bold 20px Arial",
                        fill: "#000000",
                        wordWrap: true,
                        align: "center"
                    });
                    betChip.chipText.anchor.x = Math.round(betChip.chipText.width * 0.5) / betChip.chipText.width;
                    betChip.chip.addChild(betChip.chipText);
                    betChip.chip.scale.set(0.8);
                    summaDeb = parseFloat(summaDeb) + parseFloat(debValue);
                    summaDeb = parseFloat(summaDeb).toFixed(2);
                    headerBetInputVal.setText($.client.UserData.CurrencySign + summaDeb.toString());
                    tableChips.push(betChip);
                    self.confirBet();

                });
            }
        }
    },
    changeChips: function (element) {
            selectedChipId = element.id;
            chipsGroup.forEach(function (item) {
                if (item.key == "chips_sprite")
                if (item.id == selectedChipId) {
                    item.loadTexture(item.key, item.id * 2+1);
                } else {
                    item.loadTexture(item.key, item.id * 2);
                }
            });
    },
    showMsgBox:function(par){
        var msgBoxText, msgBoxCloseBtn, msgBoxCloseBtnText;
        var text =(par.text != undefined) ? par.text : '';

        var msgBoxPopupX = par.posX || game.world.centerX;
        var msgBoxPopupY = par.posX || game.world.centerY;
        var msgBoxPopupSprite = par.sprite || 'msgBoxBg'
        var msgBoxSetTo = par.setTo || 0.5;
        var msgBoxFont = par.font || "14px Arial";
        var msgBoxColor = par.color || 'white';
        var msgBoxPause = par.pause || 10;

        msgBoxPopup = this.add.sprite(msgBoxPopupX, msgBoxPopupY, msgBoxPopupSprite);
        msgBoxPopup.anchor.set(msgBoxSetTo);         

        msgBoxText = this.add.text(0, 0, text, {
            font: msgBoxFont,
            fill: msgBoxColor,
            wordWrap: true,
            wordWrapWidth: msgBoxPopup.width,
            align: "center"
        });   

        msgBoxText.anchor.set(0.5, 0.5);
        msgBoxPopup.addChild(msgBoxText);

        msgBoxCloseBtn = this.add.button(-150, 40, 'orangeGreenBtn', this.closeMsgBox, this, 3, 2, 3);


        msgBoxCloseBtnText = this.add.text(msgBoxCloseBtn.x+130, msgBoxCloseBtn.y+10, $.client.getLocalizedString('Cancel', true), {
            font: '20px Arial',
            fill: 'white',
            wordWrap: true,
            wordWrapWidth: msgBoxCloseBtn.width,
            align: "left"
        }); 
        

        msgBoxPopup.addChild(msgBoxCloseBtn);
        msgBoxPopup.addChild(msgBoxCloseBtnText);
        
        /*automatic close widows*/
        this.game.time.events.add(Phaser.Timer.SECOND * msgBoxPause, this.closeMsgBox, this);

    },
    closeMsgBox: function(){

        if ((msgBoxTween && msgBoxTween.isRunning))
        {
            return;
        }            
        msgBoxTween =  this.add.tween(msgBoxPopup).to( { alpha: 0 }, 500, Phaser.Easing.Linear.None, true);        
        msgBoxPopup.destroy(); 
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
                console.log(responce);
                if (responce.IsSuccess) {               
                   self.showLimits(responce.ResponseData.limits);
                }
            }, function (err) {
                console.log(err);
            });
        }
    },
    showLimits: function(limits){
        var limitTitleText, limitTableText, limitStraightText, limitDozenText, limitFiftyText;
        var limitPage=0;
        var perPage, start, end, limitBtn, limitBtnTextVal, confirmLimitBtnText;
        var self = this;
        if (!isModalShow) {
            if (limits.length > 1 || selectedLimits.length!=0) {
                if (_videoFlagShow) {
                    self.showVideo();
                }
                isModalShow = true;
                /*limits = limits.concat(limits).concat(limits).concat(limits).concat(limits).concat(limits).concat(limits).concat(limits).concat(limits).concat(limits).concat(limits).concat(limits).concat(limits);*/
                limitPopup = this.add.group();
                var limitBox = this.add.sprite(43, this.game.world.centerY - 324, 'dialogBg');
                limitBox.scale.set(0.825,0.858);
                limitPopup.add(limitBox);
                limitTitleText = this.add.text(260, 70, $.client.getLocalizedString('Please select limits', true), {
                    font: '38px Arial',
                    fill: 'white',
                    wordWrap: true,
                    wordWrapWidth: limitPopup.width,
                    align: "center"
                });

                limitStraightText = this.add.text(80, 120, $.client.getLocalizedString("Straight", true), {
                    font: 'bold 22px Arial',
                    fill: '#000000',
                    wordWrap: true,
                    wordWrapWidth: limitPopup.width,
                });

                limitFiftyText = this.add.text(220, 120, $.client.getLocalizedString("Fifty/Fifty", true), {
                    font: 'bold 22px Arial',
                    fill: '#000000',
                    wordWrap: true,
                    wordWrapWidth: limitPopup.width,
                });
                limitDozenText = this.add.text(370, 120, $.client.getLocalizedString("Column/Dozen", true), {
                    font: 'bold 22px Arial',
                    fill: '#000000',
                    wordWrap: true,
                    wordWrapWidth: limitPopup.width,
                });

                limitTableText = this.add.text(570, 120, $.client.getLocalizedString("Table", true), {
                    font: 'bold 22px Arial',
                    fill: '#000000',
                    wordWrap: true,
                    wordWrapWidth: limitPopup.width,
                });

                limitPopup.addChild(limitTitleText);
                limitPopup.addChild(limitTableText);
                limitPopup.addChild(limitStraightText);
                limitPopup.addChild(limitDozenText);
                limitPopup.addChild(limitFiftyText);

                perPage = 7;        
                var closeBtn = self.add.button(650, 60, 'close-icon', function() { self.confirmLimit();});
                closeBtn.scale.set(0.12, 0.12);

                closeBtn.input.useHandCursor = true;
                closeBtn.clicked = true;

                var showListLimit = (function() {
                    var ii = 0, isEqual;

                    start = (limitPage > 0) ? limitPage * perPage : 0;
                    end = (limits.length < perPage * (limitPage + 1) ? limits.length : perPage * (limitPage + 1));

                    limitGroup.removeAll(true);

                    for (var i = start; i < end; i++) {
                        limitBtn = self.add.button(60, 148 + (60 * ii), 'limitBtnBg', self.actionOnLimitBtn, self, 1, 0);
                        ii++;
                        limitBtn.input.useHandCursor = true;
                        limitBtn.limits = limits[i];
                        limitBtn.name = 'btn_' + i;
                        limitGroup.add(limitBtn);
                        limitBtn.width = 600;
                        limitBtnText = self.add.text(limitBtn.x + 40, limitBtn.y + 13, '', {
                            font: '20px Arial',
                            fill: 'white',
                            wordWrap: true,
                            wordWrapWidth: limitPopup.width,
                        });
                        limitBtnText.width = 260;
                        var sign = $.client.UserData.CurrencySign;
                        var tableObj = limits[i].Table,
                          straightObj = limits[i].Straight,
                          dozenObj = limits[i].Column_Dozen,
                          fiftyObj = limits[i].Fifty_Fifty;

                        var objLbl = self.add.text(limitBtn.x + 60, limitBtn.y+15, sign + straightObj.Min + '/' + straightObj.Max + sign, {
                            font: '18px Arial',
                            fill: '#fff'
                        });
                        objLbl.anchor.x = Math.round(objLbl.width * 0.5) / objLbl.width;
                        objLbl = self.add.text(limitBtn.x + 210, limitBtn.y + 15, sign + fiftyObj.Min + '/' + fiftyObj.Max + sign, {
                            font: '18px Arial',
                            fill: '#fff'
                        });
                        objLbl.anchor.x = Math.round(objLbl.width * 0.5) / objLbl.width;
                        objLbl = self.add.text(limitBtn.x + 380, limitBtn.y + 15, sign + dozenObj.Min + '/' + dozenObj.Max + sign, {
                            font: '18px Arial',
                            fill: '#fff'
                        });
                        objLbl.anchor.x = Math.round(objLbl.width * 0.5) / objLbl.width;
                        objLbl = self.add.text(limitBtn.x + 540, limitBtn.y + 15, sign + tableObj.Min + '/' + tableObj.Max + sign, {
                            font: '18px Arial',
                            fill: '#fff'
                        });
                        objLbl.anchor.x = Math.round(objLbl.width * 0.5) / objLbl.width;

                     //   limitPopup.addChild(confirmLimitBtn);
                        limitGroup.add(limitBtn);

                        limitPopup.addChild(limitGroup);
                        if (i == 0 && !selectedLimits.length > 0) {
                            selectedLimits = limitBtn.limits;
                        }
                        if (selectedLimits) {
                            isEqual = equalsObj(selectedLimits, limits[i]);
                            if (isEqual) {
                                self.selectLimitBtn(limitBtn);
                            }
                        }


                    }

                    /*equalsObj source from http://javascript.ru/forum/misc/10792-sravnenie-obektov-2.html*/

                    function equalsObj(firstObj, secondObject) {
                        if ((null == firstObj) || (null == secondObject)) return false;
                        if (('object' != typeof firstObj) && ('object' != typeof secondObject)) return firstObj == secondObject;
                        else if (('object' != typeof firstObj) || ('object' != typeof secondObject)) return false;


                        if ((firstObj instanceof Date) && (secondObject instanceof Date)) return firstObj.getTime() == secondObject.getTime();
                        else if ((firstObj instanceof Date) && (secondObject instanceof Date)) return false;
                        var keysFirstObj = Object.keys(firstObj);
                        var keysSecondObject = Object.keys(secondObject);
                        if (keysFirstObj.length != keysSecondObject.length) {
                            return false;
                        }
                        return !keysFirstObj.filter(function(key) {
                            if (typeof firstObj[key] == "object" || Array.isArray(firstObj[key])) {
                                return !equalsObj(firstObj[key], secondObject[key]);
                            } else {
                                return firstObj[key] !== secondObject[key];
                            }
                        }).length;
                    }

                });

                showListLimit();
       
                if (limits.length > perPage) {
                    function actionNextPage() {
                        limitPage++;
                        showListLimit();

                        if ((limits.length - (limitPage + 1) * perPage) <= 0) {
                            nextLimitBtn.inputEnabled = false;
                            nextLimitBtn.setFrames(0, 0);

                            prevLimitBtn.inputEnabled = true;
                            prevLimitBtn.setFrames(1, 1);
                        } else {
                            nextLimitBtn.inputEnabled = true;
                        }
                    }

                    function actionPrevPage() {

                        if (limitPage == 0) {
                            prevLimitBtn.inputEnabled = false;
                            prevLimitBtn.setFrames(0, 0);

                            nextLimitBtn.setFrames(1, 1);
                            nextLimitBtn.inputEnabled = true;
                        } else {
                            limitPage--;
                            showListLimit();
                            prevLimitBtn.inputEnabled = true;
                        }
                    }

                    var nextLimitBtn = this.add.button(180, 140, 'nextLimPage', actionNextPage, this, 1, 1, 1);
                    var prevLimitBtn = this.add.button(-250, 140, 'prevLimPage', actionPrevPage, this, 1, 1, 1);
                    limitPopup.addChild(nextLimitBtn);
                    limitPopup.addChild(prevLimitBtn);

                }
            } else if (limits.length == 1) {
                if (selectedLimits != limits[0]) {
                    selectedLimits = limits[0];
                    this.confirmLimit();
                }
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
                TABLE_MIN_BET = parseFloat(selectedLimits["Table"].Min);
                TABLE_MAX_BET = parseFloat(selectedLimits["Table"].Max);
                STRAIGHT_MIN_BET = parseFloat(selectedLimits["Straight"].Min);
                STRAIGHT_MAX_BET = parseFloat(selectedLimits["Straight"].Max);
                COLUMN_DOZEN_MIN_BET = parseFloat(selectedLimits["Column_Dozen"].Min);
                COLUMN_DOZEN_MAX_BET = parseFloat(selectedLimits["Column_Dozen"].Max);
                FIFTY_FIFTY_MIN_BET = parseFloat(selectedLimits["Fifty_Fifty"].Min);
                FIFTY_FIFTY_MAX_BET = parseFloat(selectedLimits["Fifty_Fifty"].Max);
                self.closelimitPopup();
            }
        }, function (err) {
            console.log(err);
        });
    },
    closelimitPopup: function(){ 
        isModalShow = false;
        this.showVideo();

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
        var statTitleText, cancelBtn, cancelBtnText;
        if (!isModalShow) {
            if (_videoFlagShow) {
                self.showVideo();
            }
            isModalShow = true;
            historyPopup = this.add.group();
            historyPopup.add(this.add.sprite(53, 70, 'dialogBg'));
            historyPopup.scale.set(0.826, 0.86);
            var historyBox = this.add.sprite(140, 120, 'historyBox');
            historyBox.scale.set(0.6, 0.70);
            historyPopup.add(historyBox);
            cancelBtn = this.add.button(260, 490, 'bgConfirm', this.closeHistoryPopup, this);
            cancelBtn.height = 50;
            cancelBtn.useHandCursor = true;
                cancelBtnText = this.add.text(cancelBtn.x +30, cancelBtn.y + 10, $.client.getLocalizedString('Return to video', true).toUpperCase(), {
                    font: 'bold 28px Arial',
                    fill: 'black',
                    wordWrap: true,
                    wordWrapWidth: cancelBtn.width,
                    align: "left"
                });
                historyPopup.addChild(cancelBtn);
                historyPopup.addChild(cancelBtnText);
                statTitleText = this.add.text(430, 365, $.client.getLocalizedString('History', true).toUpperCase(), {
                    font: '32px Arial',
                    fill: 'white',
                    wordWrap: true,
                    wordWrapWidth: historyPopup.width,
                    align: "center"
                });
                statTitleText.anchor.set(0.5, 8);
                historyPopup.addChild(statTitleText);

                function showRow(item, posX, posY) {
                    var numBg, numText, betText,winText, numTextVal;
                    numTextVal = item.number+'';
                    if (jQuery.inArray(item.number, blackNumberArr) != -1) {
                        numBg = self.add.sprite(posX, posY, 'winNumBg', 1);
                    } else if (jQuery.inArray(item.number, redNumberArr) != -1) {
                        numBg = self.add.sprite(posX, posY, 'winNumBg', 0);
                    } else {
                        numBg = self.add.sprite(posX, posY, 'winNumBg', 2);
                    }
                    numText = self.add.text(numBg.x + 28, numBg.y + 6, numTextVal, { font: "bold 18px Arial", fill: "#ffffff", align: "center" });
                    numText.anchor.x = Math.round(numText.width * 0.5) / numText.width;

                    historyPopup.addChild(numBg);
                    historyPopup.addChild(numText);
                    var betAmount = item.betAmount % 1 == 0 ? parseFloat(item.betAmount).toFixed(0) : parseFloat(item.betAmount).toFixed(2);
                    betText = self.add.text(posX + 220, posY, $.client.UserData.CurrencySign + betAmount, { font: "bold 28px Arial", fill: "#000000", align: "center" });
                    betText.anchor.x = Math.round(betText.width * 0.5) / betText.width;
                    historyPopup.addChild(betText);
                    var winAmount = item.winAmount % 1 == 0 ? parseFloat(item.winAmount).toFixed(0) : parseFloat(item.winAmount).toFixed(2);
                    winText = self.add.text(posX + 415, posY, $.client.UserData.CurrencySign + winAmount, { font: "bold 28px Arial", fill: "#000000", align: "center" });
                    winText.anchor.x = Math.round(winText.width * 0.5) / winText.width;
                    historyPopup.addChild(winText);
                }
                var k = 0;
                for (var i = betHistory.length-1; i >= 0; i--) {
                    showRow(betHistory[i], 205, 135 + k * 34);
                    k++;
                }
                tableGroup.setAll('inputEnabled', false);
                buttonGroup.setAll('clicked', false);
        }
    },
    getStatisticData: function(element){
       var ststs, canselBtn;
       var self = this;   
       var statTitleText, coldNumText, hotNumText, colorText, evensOddsText,
       highLowText, dozenText, columnText, cancelBtn, cancelBtnText;    
           if(!!element.clicked && !isModalShow){

               if (this._statData != undefined) {
                   if (_videoFlagShow) {
                       self.showVideo();
                   }
                ststs = this._statData;
                isModalShow = true;
                statPopup = this.add.group();

                var statBg = this.add.sprite(52, 72, 'dialogBg');
                statBg.scale.set(0.97,1.01);
                statPopup.add(statBg);
                var statBox = this.add.sprite(200, 110, 'statsBox');
                statBox.scale.set(0.65,0.62);
                statPopup.add(statBox);
                statPopup.scale.set(0.85);
                var statData = this.add.group();

                cancelBtn = this.add.button(270, 500, 'bgConfirm', this.closeStatPopup, this, 3, 2, 3);
                cancelBtn.height = 50;
                cancelBtn.useHandCursor = true;

                cancelBtnText = this.add.text(cancelBtn.x+50, cancelBtn.y+10, $.client.getLocalizedString('Return to video', true), {
                    font: 'bold 28px Arial',
                    fill: 'black',
                    wordWrap: true,
                    wordWrapWidth: cancelBtn.width,
                    align: "left"
                });  
                statPopup.addChild(cancelBtn);
                statPopup.addChild(cancelBtnText);            
                statPopup.addChild(statData);
                statData.scale.set(0.8);

                statTitleText = this.add.text(540, 420, $.client.getLocalizedString('Statistics', true).toUpperCase(), {
                    font: '35px Arial',
                    fill: 'white',
                    wordWrap: true,
                    wordWrapWidth: statPopup.width,
                    align: "center"
                });           
                statTitleText.anchor.set(0.5, 8);
                statData.addChild(statTitleText);

                coldNumText = this.add.text(270, 190, $.client.getLocalizedString('COLD NUMBERS', true), {
                    font: 'bold 20px Arial',
                    fill: 'black',
                    wordWrap: true,
                    wordWrapWidth: statPopup.width,
                    align: "left"
                });  

                hotNumText = this.add.text(270, 250, $.client.getLocalizedString('HOT NUMBERS', true), {
                    font: 'bold 20px Arial',
                    fill: 'black',
                    wordWrap: true,
                    wordWrapWidth: statPopup.width,
                    align: "left"
                });  
                
                colorText = this.add.text(270, 310, $.client.getLocalizedString('COLORS', true), {
                    font: 'bold 20px Arial',
                    fill: 'black',
                    wordWrap: true,
                    wordWrapWidth: statPopup.width,
                    align: "left"
                });  
                
                evensOddsText = this.add.text(270, 370, $.client.getLocalizedString('EVEN/ODDS', true), {
                    font: 'bold 20px Arial',
                    fill: 'black',
                    wordWrap: true,
                    wordWrapWidth: statPopup.width,
                    align: "left"
                });  
                
                highLowText = this.add.text(270, 430, $.client.getLocalizedString('HIGH/LOW', true), {
                    font: 'bold 20px Arial',
                    fill: 'black',
                    wordWrap: true,
                    wordWrapWidth: statPopup.width,
                    align: "left"
                });  
                
                dozenText = this.add.text(270, 490, $.client.getLocalizedString('DOZENS', true), {
                    font: 'bold 20px Arial',
                    fill: 'black',
                    wordWrap: true,
                    wordWrapWidth: statPopup.width,
                    align: "left"
                });  

                columnText = this.add.text(270, 550, $.client.getLocalizedString('COLUMNS', true), {
                    font: 'bold 20px Arial',
                    fill: 'black',
                    wordWrap: true,
                    wordWrapWidth: statPopup.width,
                    align: "left"
                });  

                statData.addChild(coldNumText);
                statData.addChild(hotNumText);
                statData.addChild(colorText);
                statData.addChild(evensOddsText);
                statData.addChild(highLowText);
                statData.addChild(dozenText);
                statData.addChild(columnText);


                function showNumber (element, posX, posY){                
                    var numBg, numText, numTextVal;                
                    numTextVal = element + '';
                    if(jQuery.inArray(element, blackNumberArr) != -1 ){
                        numBg = self.add.sprite(posX, posY, 'winNumBg', 1);                        
                    }else if (jQuery.inArray(element, redNumberArr) != -1 ){
                        numBg = self.add.sprite(posX, posY, 'winNumBg', 0);                       
                    }else{
                        numBg = self.add.sprite(posX, posY, 'winNumBg', 2);
                    } 
                    numText = self.add.text(numBg.x+28, numBg.y+6, numTextVal, { font: "bold 18px Arial", fill: "#ffffff", align: "center"}); 
                    numText.anchor.x = Math.round(numText.width * 0.5) / numText.width;

                    statData.addChild(numBg);
                    statData.addChild(numText);

                }         

                function showSectionNumber(posX, posY, label, value, spriteFrame){
                    var statChartFirst, statChartSecond, statChartThird,
                        statChartFirstText, statChartSecondText, statChartThirdText
                    ;

                    statChartFirst = self.add.sprite(posX, posY, 'statChartBg', spriteFrame[0]);
                    statChartFirst.width = value[0] * 3.5;
                    statChartFirstText = self.add.text(statChartFirst.x+10, statChartFirst.y+10, '', { font: "20px Arial", fill: "#ffffff", align: "center"}); 
                    if(value[0] > 20){                    
                        statChartFirstText.text = label[0];
                    }

                    statData.addChild(statChartFirst);
                    statData.addChild(statChartFirstText);

                    statChartSecond = self.add.sprite(statChartFirst.x+statChartFirst.width, posY, 'statChartBg', spriteFrame[1]);
                    statChartSecond.width = value[1] * 3.5;
                    statChartSecondText = self.add.text(statChartSecond.x+10, statChartSecond.y+10, '', { font: "20px Arial", fill: "#ffffff", align: "center"}); 
                    if(value[1] > 20){
                        statChartSecondText.text = label[1];
                    }
                    statData.addChild(statChartSecond);
                    statData.addChild(statChartSecondText);

                    statChartThird = self.add.sprite(statChartSecond.x+statChartSecond.width, posY, 'statChartBg', spriteFrame[2]);                
                    statChartThird.width = value[2] * 3.5;
                    statChartThirdText = self.add.text(statChartThird.x+10, statChartThird.y+10, '', { font: "20px Arial", fill: "#ffffff", align: "center"}); 
                    if(value[2] > 20){
                        statChartThirdText.text = label[2];
                    }
                    statData.addChild(statChartThird);
                    statData.addChild(statChartThirdText);

                }

                for(var i = 4; i < ststs.coldNumbers.length; i++){
                    showNumber(ststs.coldNumbers[i].number, coldNumText.x+180+(i-4)*58, coldNumText.y-5);
                }

                for(var i = 4; i < ststs.hotNumbers.length; i++){
                    showNumber(ststs.hotNumbers[i].number, hotNumText.x + 180 + (i - 4) * 58, hotNumText.y - 5);
                }
                showSectionNumber(colorText.x+180, colorText.y-10,                 
                    [$.client.getLocalizedString("RED",true), $.client.getLocalizedString("GREEN",true), $.client.getLocalizedString("BLACK",true)],
                    [ststs.colors.red, ststs.colors.zero, ststs.colors.black],
                    [0,1,2]
                );

                showSectionNumber(evensOddsText.x+180, evensOddsText.y-10,                 
                    [$.client.getLocalizedString("EVEN",true), $.client.getLocalizedString("ZERO",true), $.client.getLocalizedString("ODDS",true)],
                    [ststs.evenOdds.even, ststs.evenOdds.zero, ststs.evenOdds.odds],
                    [4,1,4]
                );

                showSectionNumber(highLowText.x+180, highLowText.y-10,                 
                    [$.client.getLocalizedString("HIGH",true), $.client.getLocalizedString("ZERO",true), $.client.getLocalizedString("LOW",true)],
                    [ststs.highLow.high, ststs.highLow.zero, ststs.highLow.low],
                    [4,1,4]
                );

                showSectionNumber(dozenText.x+180, dozenText.y-10, 
                    ["1-12","13-24","25-36"],
                    [ststs.dozens.first, ststs.dozens.second, ststs.dozens.third],                
                    [4,3,4]
                );
                showSectionNumber(columnText.x+180, columnText.y-10, 
                    ["1-34","2-35","3-36"],
                    [ststs.columns.first, ststs.columns.second, ststs.columns.third],
                    [4,3,4]
                );   
        
                tableGroup.setAll('inputEnabled', false);
                buttonGroup.setAll('clicked', false);   

            }
        }
    },
    closeHistoryPopup: function () {
        historyPopup.destroy(); 
        isModalShow = false;
        this.showVideo();
        tableGroup.setAll('inputEnabled', true);
        buttonGroup.setAll('clicked', true); 
    },
    closeStatPopup: function () {
        statPopup.destroy(); 
        isModalShow = false;
        this.showVideo();
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
                this.updateStatistics();
            },1000)
            console.log(err);
        });
    },
    showVideo: function(){
        var video;
        if (!isModalShow) {
            video = jQuery('#landscape_video');
            if (_videoFlagShow) {
                video.hide();
                _videoFlagShow = false;
            } else {
                video.show();
                _videoFlagShow = true;
            }
        }
    },
    changeStatus: function (text, statusIndex) {
        var tDiff = new Date(new Date().getTime() - lastChangeStatus).getTime() / 1000;
        var self = this;
        if (infoText != undefined) {
            if (tDiff < 2) {
                setTimeout(function () {
                    self.changeStatus(text, statusIndex);
                    lastChangeStatus = new Date().getTime();
                }, 1000);
            } else {
                infoText.setText(text);
                statusBg.loadTexture('statusBg', statusIndex);
            }
        }
    },
    showWinner: function (winAmount) {
        headerBalansInputVal.setText($.client.UserData.CurrencySign + parseFloat(USER_BALANCE).toFixed(2));
        var text = $.client.getLocalizedString("TEXT_DISPLAY_MSG_PLAYER_WIN", true) + $.client.UserData.CurrencySign + parseFloat(winAmount).toFixed(2);
        MessageDispatcher.betHistory[MessageDispatcher.betHistory.length - 1].winAmount = parseFloat(winAmount).toFixed(2);
        this.changeStatus(text, 1);
    },
    restartGame: function () {
        startGameBtn.alpha = 1;
        startGameBtn.btn.inputEnabled = true;
    },
    createTimer: function (totalTime, endCallback, updateCallback) {
        var timer;
        timerSprite.totalTime = totalTime;
        timerSprite.time = totalTime;
        timerSprite.endCallback = endCallback;
        timerSprite.updateCallback = updateCallback;
        timerSprite.update = function (time) {
            if (time > 0) {
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


};
