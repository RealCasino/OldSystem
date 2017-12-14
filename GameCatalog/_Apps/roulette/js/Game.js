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
    var colorMap = {
        A: "#FFBF00",
        B: "#0000FF",
        C: "#464646",
        D: "#FED85D",
        E: "#50C878",
        F: "#EEDC82",
        G: "#D4AF37",
        H: "#F400A1",
        I: "#00416A",
        J: "#00A86B",
        K: "#C3B091",
        L: "#FDE910",
        M: "#F8F4FF",
        N: "#000080",
        O: "#9AB973",
        P: "#FFC0CB",
        Q: "#6C6961",
        R: "#E0115F",
        S: "#87CEEB",
        T: "#008080",
        U: "#120A8F",
        V: "#8B00FF",
        W: "#F5DEB3",
        X: "#EEED09",
        Y: "#FFFF00",
        Z: "#506022"
    },
    chipSprites = {};
    var betType = {
        straight: 0,
        splitX: 1,
        splitY: 2,
        corner: 3,
        multiSelect: 4,
        arrSelect: 5
       };

    var table, progressText,
    tableStatus, timerText;

var Bets ={};

var cellName, betName, borderPosArr;

var tableChips = [];

var gameFrame, winNum, placeHold, timer;
var isModalShow;
var startGameBtn, cashierBtn, provablyBtn;
var worldGroup = {}, tableGroup = {}, chipsGroup = {},  selectedChipsGroup = {},overlayGroup,overlayVisible=true,
    frameGroup = {}, winTextGroup = {};
var tableCell = {},  Dozen ={}, Column = {}, Orphelins = {}, Game = {};
var previousMsgType, winAmount = 0;
var lastChangeStatus;

Game.Boot = function (game) {       
};

Game.Boot.prototype = {
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

Game.Preloader = function (game) {

    this.background = null;
    this.ready = false;
};
Game.Preloader.prototype = {
    preload: function () {
        this.game.stage.backgroundColor = '#fff';
        this.load.image('table', 'images/table.png');
        this.load.image('cell_select', 'images/cell_select.png');
        this.load.image('chips', 'images/chip.png');
        this.load.image('modal_bg', 'images/modal_bg.png');
        
        this.load.spritesheet('statusBg', 'images/status_bg.png', 1600, 61);
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
            self.state.start('MainMenu');
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

Game.MainMenu = function(game){ 
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

Game.MainMenu.prototype = {   
    create: function() {
        TABLE_WIDTH = 1380,
        TABLE_HEIGHT = 534,
        DIB_WIDTH = 115,
        DIB_HEIGHT = 178,
        DIB_SPASE = 11.5,
        TABLE_ROWS = Math.floor(TABLE_WIDTH / DIB_WIDTH),
        TABLE_COLS = Math.floor(TABLE_HEIGHT / DIB_HEIGHT);
        var self = this;
   
        var spriteXY, spriteX, spriteY;
  
        worldGroup = this.add.group();
        this.scale.setUserScale(SCALE, SCALE);
        this.scale.refresh();
        tableGroup = this.add.group();
        selectedChipsGroup = this.add.group();
        chipsGroup = this.add.group(); 
      
        tableStatus = this.add.sprite(0, 0, 'statusBg', 0);
        tableStatus.width = 1920;
        tableStatus.height = 1080;
        worldGroup.add(tableStatus);
        worldGroup.add(tableGroup);
        table = tableGroup.create(10, 60, 'table');
        worldGroup.add(tableGroup);
        worldGroup.add(selectedChipsGroup);
        worldGroup.add(chipsGroup);
    
   
        for (var i = 0; i < TABLE_COLS; i++) {
            for (var j = 0; j < TABLE_ROWS; j++) {
                cellName = 'cell_' + i.toString() + '_' + j.toString();
                tableCell[cellName] = tableGroup.create(table.x + 213 + j * (DIB_WIDTH + DIB_SPASE), table.y + 449 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
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

                spriteX = tableGroup.create(table.x + 210 + j * (DIB_WIDTH + DIB_SPASE), table.y + 620 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
                spriteX.name = 'lineY_' + i.toString() + '_' + j.toString();
                spriteX.bet_name = 'lineY_' + i.toString() + '_' + j.toString();;
                spriteX.alpha = 0;
                spriteX.inputEnabled = true;
                spriteX.height = 20;
                spriteX.width = DIB_WIDTH;
                spriteX.type = betType.splitY;
                spriteX.events.onInputDown.add(this.cellClick, this);
                spriteX.events.onInputOver.add(this.cellOver, this);
                spriteX.events.onInputOut.add(this.cellOut, this);

                spriteY = tableGroup.create(table.x + 200 + j * (DIB_WIDTH + DIB_SPASE), table.y + 450 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
                spriteY.name = 'lineX_' + i.toString() + '_' + j.toString();
                spriteY.bet_name = 'lineX_' + i.toString() + '_' + j.toString();;
                spriteY.alpha = 0;
                spriteY.width = 20;
                spriteY.height =DIB_HEIGHT;
                spriteY.type = betType.splitX;
                spriteY.inputEnabled = true;
                spriteY.events.onInputDown.add(this.cellClick, this);
                spriteY.events.onInputOver.add(this.cellOver, this);
                spriteY.events.onInputOut.add(this.cellOut, this);

                spriteXY = tableGroup.create(table.x + 197 + j * (DIB_WIDTH + DIB_SPASE), table.y + 624 - i * (DIB_HEIGHT + DIB_SPASE), 'cell_select');
                spriteXY.name = 'crossXY_' + i.toString() + '_' + j.toString();
                spriteXY.bet_name = 'crossXY_' + i.toString() + '_' + j.toString();;
                spriteXY.inputEnabled = true;
                spriteXY.width = 20;
                spriteXY.height = 20;
                spriteXY.type = betType.corner;
                spriteXY.alpha = 0;
                spriteXY.events.onInputDown.add(this.cellClick, this);
                spriteXY.events.onInputOver.add(this.cellOver, this);
                spriteXY.events.onInputOut.add(this.cellOut, this);
            }
        }
        tableCell['zero'] = tableGroup.create(table.x + 50, table.y + 70, 'cell_select');
        tableCell['zero'].name = '0';

        tableCell['zero'].bet_name = '0';
        tableCell['zero'].bet_type = 'straight';

        tableCell['zero'].type =betType.straight;
        tableCell['zero'].alpha = 0;
        tableCell['zero'].width = 150;
        tableCell['zero'].height = 555;

        tableCell['zero'].inputEnabled = true;
        tableCell['zero'].events.onInputDown.add(this.cellClick, this);
        tableCell['zero'].events.onInputOver.add(this.cellOver, this);
        tableCell['zero'].events.onInputOut.add(this.cellOut, this);

        Dozen['one'] = tableGroup.create(table.x + 214, table.y + 635, 'cell_select');
        Dozen['one'].name = 'dozenOne';
        Dozen['one'].bet_name = 'first12';
        Dozen['one'].bet_type = 'dozen';
        Dozen['one'].items = [0];
        Dozen['one'].first = 0;
        Dozen['one'].last = 4;
        Dozen['one'].alpha = 0;
        Dozen['one'].width = 490;
        Dozen['one'].height = 130;
        Dozen['one'].type = betType.multiSelect;
        Dozen['one'].inputEnabled = true;
        Dozen['one'].events.onInputDown.add(this.cellClick, this);
        Dozen['one'].events.onInputOver.add(this.cellOver, this);
        Dozen['one'].events.onInputOut.add(this.cellOut, this);

        Dozen['two'] = tableGroup.create(table.x + 720, table.y + 635, 'cell_select');
        Dozen['two'].name = 'dozenTwo';
        Dozen['two'].bet_name = 'second12';
        Dozen['two'].bet_type = 'dozen';
        Dozen['two'].items = [1];
        Dozen['two'].type = betType.multiSelect;
        Dozen['two'].alpha = 0;
        Dozen['two'].width = 490;
        Dozen['two'].height = 130;
        Dozen['two'].first = 4;
        Dozen['two'].last = 8;
        Dozen['two'].inputEnabled = true;
        Dozen['two'].events.onInputDown.add(this.cellClick, this);
        Dozen['two'].events.onInputOver.add(this.cellOver, this);
        Dozen['two'].events.onInputOut.add(this.cellOut, this);

        Dozen['three'] = tableGroup.create(table.x + 1227, table.y + 635, 'cell_select');
        Dozen['three'].name = 'dozenThree';
        Dozen['three'].bet_name = 'third12';
        Dozen['three'].bet_type = 'dozen';
        Dozen['three'].items = [2];
        Dozen['three'].type = betType.multiSelect;
        Dozen['three'].alpha = 0;
        Dozen['three'].width = 490;
        Dozen['three'].height = 130;
        Dozen['three'].first = 8;
        Dozen['three'].last = 12;
        Dozen['three'].inputEnabled = true;
        Dozen['three'].events.onInputDown.add(this.cellClick, this);
        Dozen['three'].events.onInputOver.add(this.cellOver, this);
        Dozen['three'].events.onInputOut.add(this.cellOut, this);

        Column['one'] = tableGroup.create(table.x + 1735, table.y + 450, 'cell_select');
        Column['one'].name = 'columnOne';
        Column['one'].bet_name = 'col1';
        Column['one'].bet_type = 'column';
        Column['one'].items = [0];
        Column['one'].type = betType.multiSelect;
        Column['one'].alpha = 0;
        Column['one'].width = 115;
        Column['one'].height = 178;
        Column['one'].first = 0;
        Column['one'].last = 12;
        Column['one'].colFirst = 0;
        Column['one'].colLast = 1;
        Column['one'].inputEnabled = true;
        Column['one'].events.onInputDown.add(this.cellClick, this);
        Column['one'].events.onInputOver.add(this.cellOver, this);
        Column['one'].events.onInputOut.add(this.cellOut, this);

        Column['two'] = tableGroup.create(table.x + 1735, table.y + 260, 'cell_select');
        Column['two'].name = 'columnTwo';
        Column['two'].bet_name = 'col2';
        Column['two'].bet_type = 'column';
        Column['two'].items = [1];
        Column['two'].type = betType.multiSelect;
        Column['two'].alpha = 0;
        Column['two'].width = 115;
        Column['two'].height = 178;
        Column['two'].first = 0;
        Column['two'].last = 12;
        Column['two'].colFirst = 1;
        Column['two'].colLast = 2;
        Column['two'].inputEnabled = true;
        Column['two'].events.onInputDown.add(this.cellClick, this);
        Column['two'].events.onInputOver.add(this.cellOver, this);
        Column['two'].events.onInputOut.add(this.cellOut, this);

        Column['three'] = tableGroup.create(table.x + 1735, table.y + 70, 'cell_select');
        Column['three'].name = 'columnThree';
        Column['three'].bet_name = 'col3';
        Column['three'].bet_type = 'column';
        Column['three'].type = betType.multiSelect;
        Column['three'].items = [2];
        Column['three'].alpha = 0;
        Column['three'].width = 115;
        Column['three'].height = 178;
        Column['three'].first = 0;
        Column['three'].last = 12;
        Column['three'].colFirst = 2;
        Column['three'].colLast = 3;
        Column['three'].inputEnabled = true;
        Column['three'].events.onInputDown.add(this.cellClick, this);
        Column['three'].events.onInputOver.add(this.cellOver, this);
        Column['three'].events.onInputOut.add(this.cellOut, this);


        Orphelins['low'] = tableGroup.create(table.x + 210, table.y + 770, 'cell_select');
        Orphelins['low'].name = 'low';
        Orphelins['low'].bet_name = 'first18';
        Orphelins['low'].bet_type = 'high_low';
        Orphelins['low'].items = ['low'];
        Orphelins['low'].type = betType.multiSelect;
        Orphelins['low'].width = 250;
        Orphelins['low'].height = 100;
        Orphelins['low'].first = 0;
        Orphelins['low'].last = 6;
        Orphelins['low'].alpha = 0;
        Orphelins['low'].inputEnabled = true;
        Orphelins['low'].events.onInputDown.add(this.cellClick, this);
        Orphelins['low'].events.onInputOver.add(this.cellOver, this);
        Orphelins['low'].events.onInputOut.add(this.cellOut, this);

        Orphelins['high'] = tableGroup.create(table.x + 1475, table.y + 770, 'cell_select');
        Orphelins['high'].name = 'high';
        Orphelins['high'].bet_name = 'second18';
        Orphelins['high'].bet_type = 'high_low';
        Orphelins['high'].items = ['high'];
        Orphelins['high'].type = betType.multiSelect;
        Orphelins['high'].width = 250;
        Orphelins['high'].height = 100;
        Orphelins['high'].first = 6;
        Orphelins['high'].last = 12;
        Orphelins['high'].alpha = 0;
        Orphelins['high'].inputEnabled = true;
        Orphelins['high'].events.onInputDown.add(this.cellClick, this);
        Orphelins['high'].events.onInputOver.add(this.cellOver, this);
        Orphelins['high'].events.onInputOut.add(this.cellOut, this);

        Orphelins['even'] = tableGroup.create(table.x + 460, table.y + 770, 'cell_select');
        Orphelins['even'].name = 'even';
        Orphelins['even'].bet_name = 'even';
        Orphelins['even'].bet_type = 'evens_odds';
        Orphelins['even'].items = ['evens'];
        Orphelins['even'].type = betType.arrSelect;
        Orphelins['even'].alpha = 0;
        Orphelins['even'].width = 250;
        Orphelins['even'].height = 100;
        Orphelins['even'].numbers = evenNumberArr;
        Orphelins['even'].inputEnabled = true;
        Orphelins['even'].events.onInputDown.add(this.cellClick, this);
        Orphelins['even'].events.onInputOver.add(this.cellOver, this);
        Orphelins['even'].events.onInputOut.add(this.cellOut, this);

        Orphelins['odd'] = tableGroup.create(table.x + 1220, table.y + 770, 'cell_select');
        Orphelins['odd'].name = 'odd';
        Orphelins['odd'].bet_name = 'odd';
        Orphelins['odd'].bet_type = 'evens_odds';
        Orphelins['odd'].items = ['odds'];
        Orphelins['odd'].type = betType.arrSelect;
        Orphelins['odd'].width = 250;
        Orphelins['odd'].height = 100;
        Orphelins['odd'].alpha = 0;
        Orphelins['odd'].numbers = oddNumberArr;
        Orphelins['odd'].inputEnabled = true;
        Orphelins['odd'].events.onInputDown.add(this.cellClick, this);
        Orphelins['odd'].events.onInputOver.add(this.cellOver, this);
        Orphelins['odd'].events.onInputOut.add(this.cellOut, this);

        Orphelins['black'] = tableGroup.create(table.x + 970, table.y + 770, 'cell_select');
        Orphelins['black'].name = 'black';
        Orphelins['black'].bet_name = 'black';
        Orphelins['black'].bet_type = 'color';
        Orphelins['black'].items = ['black'];
        Orphelins['black'].type = betType.arrSelect;
        Orphelins['black'].alpha = 0;
        Orphelins['black'].width = 250;
        Orphelins['black'].height = 100;
        Orphelins['black'].numbers = blackNumberArr;
        Orphelins['black'].inputEnabled = true;
        Orphelins['black'].events.onInputDown.add(this.cellClick, this);
        Orphelins['black'].events.onInputOver.add(this.cellOver, this);
        Orphelins['black'].events.onInputOut.add(this.cellOut, this);

        Orphelins['red'] = tableGroup.create(table.x + 715, table.y + 770, 'cell_select');
        Orphelins['red'].name = 'red';
        Orphelins['red'].bet_name = 'red';
        Orphelins['red'].bet_type = 'color';
        Orphelins['red'].items = ['red'];
        Orphelins['red'].type = betType.arrSelect;
        Orphelins['red'].alpha = 0;
        Orphelins['red'].width = 250;
        Orphelins['red'].height = 100;
        Orphelins['red'].numbers=redNumberArr;
        Orphelins['red'].inputEnabled = true;
        Orphelins['red'].events.onInputDown.add(this.cellClick, this);
        Orphelins['red'].events.onInputOver.add(this.cellOver, this);
        Orphelins['red'].events.onInputOut.add(this.cellOut, this);

        window.addEventListener('resize', function () {
            self.changeGameSize();
        });
        self.changeGameSize();
        setInterval(function () {
            self.changeGameSize();
        }, 1000);
        self.makeChipSprites();
        self.ready = true;
    },
    changeGameSize: function changeGameSize() {
        var self = this;
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
        if (game.glowTween)
            game.glowTween.stop();
        for (var i in tableGroup.children) {
            if (tableGroup.children[i].bet_type=="straight")
            tableGroup.children[i].alpha = 0;
        }
        if (selectedChipsGroup.children && selectedChipsGroup.children.length > 0) {
            selectedChipsGroup.removeChildren();
        } 
        tableChips = [];
        summaDeb = 0;
        if(placeHold !== undefined){
            placeHold.kill();
        } 
    },
    makeBetobject: function (element) {
        var amountDeb = 0;
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
    cellOver: function (element) {
    },
    cellOut: function (element) {
    },
    cellClick: function (element) {
    var self = this;
    if (self.makeBet(self.makeBetobject(element)))
        this.confirmBet();
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
                        headerBetInputVal.setText($.client.UserData.CurrencySign + summaDeb.toString());
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
        for (var i = 0; i < items.length; i++) {
            tableChips.splice(tableChips.indexOf(items[i]), 1);
        }
    },
    makeChipSprites: function () {      
        var self = this;
        for (var key in colorMap) {
            var color = self.hexToRgb(colorMap[key]);
            var sprite;
            var spriteBmd = game.make.bitmapData();
            spriteBmd.load('chips');
            function forEachBlackPixel(pixel) {
                if ((pixel.r >= 0 && pixel.r < 128) && (pixel.g >= 0 && pixel.g < 128) && (pixel.b >= 0 && pixel.b < 128)) {
                    pixel.r = color.r;
                    pixel.g = color.g;
                    pixel.b = color.b;
                }
                return pixel;
            }
            sprite = game.add.sprite(120, 120, spriteBmd);
            sprite.alpha = 0;
            sprite.x = 0;
            sprite.y = 0;
            spriteBmd.processPixelRGB(forEachBlackPixel, this);
            chipSprites[colorMap[key]] = spriteBmd;
        }
    },
    clearBetsChip: function (bets) {
        var self = this, betObj, chipId = 0, betAmount = 0, lastChip;
        for (var i in bets) {
            betObj = {};
            var deleted = false; lastChip = -1;
            for (var j = 0; j < tableChips.length; j++) {
                if (tableChips[j].bet.name === bets[i].betInfo.name) {
                    betAmount += tableChips[j].bet.amount;
                    if (tableChips[j].chipText)
                        tableChips[j].chipText.setText(betAmount);
                    if (tableChips[j].userId == bets[i].sessionId && tableChips[j].amount === bets[i].betInfo.amount) {
                            if (!deleted) {
                                tableChips[j].chip.alpha = 0;
                                lastChip = parseInt(j);
                                deleted = true;
                                betAmount -= tableChips[j].bet.amount;
                                if (tableChips[j].chipText)
                                    tableChips[j].chipText.setText(betAmount);
                                continue;
                            }
                        }
                }
            }
            if (lastChip > -1)
                tableChips.splice(lastChip, 1);
        }
    },
    drawBetsChip: function (bets) {
        var self = this,betObj,chipId=0,betAmount=0;
        for (var i in bets) {
            betObj = {};
            for (var j in tableGroup.children) {
                if (tableGroup.children[j].bet_name===bets[i].betInfo.name)
                    betObj = self.makeBetobject(tableGroup.children[j]);
            }
            betObj.userId = bets[i].sessionId;
            betObj.bets.amount = bets[i].betInfo.amount;
            betObj.color = colorMap[bets[i].userName.slice(0, 1).toUpperCase()] ? colorMap[bets[i].userName.slice(0, 1).toUpperCase()] : "#000";
            self.drawChip(betObj, chipId, true,true);
        }
    },
    drawChip: function (element, chipId, sent, submit) {
        var self = this;
        var elementX, elementY;
        var event = $.extend(true, {}, element);
        var betChip = { name: event.name, type: event.bet_type, bet: event.bets, sent: sent, submit: submit, chips: event.chips };
        var chipAmount = event.bets.amount;
        betChip.amount = event.bets.amount;
        elementX = element.x + element.width / 2 - 60;
        elementY = element.y + element.height / 2 - 60;
        betChip.chip = self.add.graphics(960, 1080, selectedChipsGroup);
        for (var i = 0; i < tableChips.length; i++) {
            if (tableChips[i].name == betChip.name) {
                chipAmount += tableChips[i].amount;
            }
        }
       betChip.userId = element.userId;
        if (chipSprites[element.color])
            betChip.active_sprite = game.add.sprite(0, 0, chipSprites[element.color]);
        else
            betChip.active_sprite = game.add.sprite(0, 0, "chips");
        betChip.active_sprite.width = 120;
        betChip.active_sprite.height = 120;
        betChip.chip.addChild(betChip.active_sprite);
        
        tableChips.push(betChip);
        tableGroup.add(betChip.chip);
        selectedChipsGroup.add(betChip.chip);
        betChip.chipText = self.add.text(58, 42, chipAmount % 1 == 0 ? chipAmount : parseFloat(chipAmount).toFixed(1), {
            font: "bold 32px ProximaNova",
            fill: "#000"
        });
        betChip.chipText.anchor.x = Math.round(betChip.chipText.width * 0.5) / betChip.chipText.width;
        var tween = game.add.tween(betChip.chip).to({ x: elementX, y: elementY }, 600, Phaser.Easing.Linear.None, true);
        tween.onComplete.add(function () {
            betChip.chip.addChild(betChip.chipText);
        }, this);
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
                   if (single && (validateObj.chips.length > 1 ||validateObj.chips[0]!=selectedChipId))
                       return false;
                $.each(validateObj.chips, function(i, chipId) {
                    self.drawChip(element, chipId);
                });
                return true;
            } else
                return false;
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
                    chipCursorText.setText(item.debValue);
                } else {
                    item.y = item.rY;
                    item.chipText.y = item.rY + 28;
                    item.loadTexture(item.key, item.id);
                }
        });
        this.changeGameSize();
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
    changeStatus: function (text, statusIndex) {
        var bg;
        var tDiff = new Date(new Date().getTime() - lastChangeStatus).getTime() / 1000;
        var self = this;
        lastChangeStatus = new Date().getTime();
        if (tableStatus != undefined) {
            if (tDiff < 1 && self.previousStatusIndex != statusIndex) {
                setTimeout(function () {
                    self.changeStatus(text, statusIndex);
                }, 3000);
            } else {
                self.previousStatusIndex = statusIndex;
                tableStatus.loadTexture('statusBg', statusIndex);
            }
        }
        function showText(txt) {
            isModalShow = true;
            bg = self.add.group();
            bg.clicked = false;;
            worldGroup.add(bg);
            modalBg = self.add.button(0, 0, "modal_bg", null, this);
            modalBg.height = 1080;
            modalBg.width = 1920;
            modalBg.alpha = 0;
            textBg = self.add.button(0, 550, "modal_bg", null, this);
            textBg.height = 0;
            bg.add(modalBg);
            bg.add(textBg);
            var text = self.add.text(950, 550, txt, {
                font: "2px ProximaNova",
                fill: "#fff"
            })
            text.anchor.x = Math.round(text.width * 0.5) / text.width;
            bg.add(text);
            game.add.tween(modalBg).to({ alpha: 0.8 }, 400, Phaser.Easing.Linear.None, true);
            game.add.tween(textBg).to({ y: 390 }, 600, Phaser.Easing.Linear.None, true);
            game.add.tween(textBg).to({ height: 300 }, 600, Phaser.Easing.Linear.None, true);
            self.add.tween(text).to({ fontSize: 70 }, 600, Phaser.Easing.Linear.None, true);
            self.add.tween(text).to({ y: 500 }, 600, Phaser.Easing.Linear.None, true);
            setTimeout(function () {
                game.add.tween(modalBg).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true);
                game.add.tween(textBg).to({ y: 550 }, 600, Phaser.Easing.Linear.None, true);
                game.add.tween(text).to({ fontSize: 2 }, 600, Phaser.Easing.Linear.None, true);
                self.add.tween(text).to({ y: 550 }, 600, Phaser.Easing.Linear.None, true);
                var tween = game.add.tween(textBg).to({ height: 0 }, 600, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(function () {
                    bg.destroy();
                    isModalShow = false;
                }, this);
            }, 3000)
        }
        showText(text);
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
    showWinNumber: function (number) {
        if (game.glowTween)
            game.glowTween.stop();
        for (var j in tableGroup.children) {
            if (tableGroup.children[j].bet_name === number + "") {
                game.glowTween = game.add.tween(tableGroup.children[j]).to({ alpha: 1 }, 500, Phaser.Easing.Linear.None, true, 0, -1, true).loop(true);
            }
        }

    },
    hexToRgb: function (hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
};
