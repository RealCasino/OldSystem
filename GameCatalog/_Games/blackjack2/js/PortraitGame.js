var chips_cost,
    g_SessionId,
    worldGroup,
    headerGroup,
    chipsGroup,
    footerGroup,
    selectedChipsGroup,
    buttonStakeGroup,
    buttonActionGroup,
    buttonNewGameGroup,
    removableGroup,
    limitPopupGroup,
    frameGroup,
    popupWinGroup,
    limitGroup,
    selectedChipId,
    selectedChip,
    tableItem,
    cards,
    cardsValues,
    gameFrame,
    gameFrameH,
    gameFrameW;
chips_cost = [0.1, 1, 5, 10, 25, 50];
cards = [
    "AC", "2C", "3C", "4C", "5C", "6C", "7C", "8C", "9C", "10C", "JC", "QC", "KC",
    "AD", "2D", "3D", "4D", "5D", "6D", "7D", "8D", "9D", "10D", "JD", "QD", "KD",
    "AH", "2H", "3H", "4H", "5H", "6H", "7H", "8H", "9H", "10H", "JH", "QH", "KH",
    "AS", "2S", "3S", "4S", "5S", "6S", "7S", "8S", "9S", "10S", "JS", "QS", "KS"
];
cardsValues = [
    11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10,
    11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10,
    11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10,
    11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10
];
GameData = {
    betAmount: 0,
    winAmount: 0,
    gameBalance: 0,
    dealerCards: [],
    userCards: [],
    counter: 0,
    handNumber: 0,
    handCount: 0,
    localCounter: 0,
    pointer: null,
    bettingChipArray: [],
    limitPlateId: 0,
    selectedLimitArray: [],
    splitPosition: [],
    splitPositionItem: 0,
    stack: [],
    isModalShow: false,
    historyArray: [],
    chipPosition: [],
    gameState: "newGame",
    activedPosChips: [],
    winStateText: {},
    handsWin: {}
};


var winNumInfo = {}, msgBoxPopup, msgBoxTween, limitPopup, limitPopupTween, statPopup, historyPopup, statPopupTween, selectedLimits = [];
var cellName, betName, borderPosArr;

var tableChips = [];
var limits = [];
var historyArr = [];
var previousBetChips = [];
var roundBetChips = [];
var lastRevive = 0;
var factorGroups = [];
var limitBtnText, confirmLimitBtn, cashierBtn, provablyBtn;
var tableCell = {};

var userNameText, headerBetInputVal, headerBalansInputVal, headerWinInputVal;
var gameFrame, numberLbl, numberFrame, winNum, placeHold, timer;
var _winNumUpdate, progressText, _videoFlagShow, isModalShow, isSubmiting, bigRoadText;

var worldGroup = {},
    tableGroup = {},
    payoutGroup = {},
    buttonGroup = {},
    selectedChipsGroup = {},
    frameGroup = {},
    footerGroup = {},
    winTextGroup = {},
    numberGroup = {},
    numbersListGroup = {},
    cursorGroup = {},
    factorsGroup = {},
    statDataGroup,
    startGameBtn,
    settingsBtn;

var tableCell = {}, numberLbls = {}, BJPortrateGame = {};
var previousMsgType, winAmount = 0;
var chipCursor, cursorVisible = false, timeToEnd, lastChangeStatus;
var playBtn, clearBtn, undoBtn, stepDownBtn, stepUpBtn, quickBtn, quickFiveBtn, gameEnd;

BJPortrateGame.Boot = function (game) {
};
BJPortrateGame.Boot.prototype = {
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
        this.state.start("Preloader");
    }
};
BJPortrateGame.Preloader = function (game) {
    this.background = null;
    this.ready = false;
};
BJPortrateGame.Preloader.prototype = {
    preload: function () {
        this.game.stage.backgroundColor = "#fff";
        this.load.image("gameFrame", "images/phone_game_frame.png");
        this.load.image("dealerCardsPlace", "images/place_dealer_cards.png");
        this.load.image("historyBg", "images/history_bg.png");
        this.load.image("limitsBg", "images/limit_bg.png");
        this.load.image("modalBoxBg", "images/modal_bg.png");
        this.load.image("closeBtn", "images/modal_close_btn.png");
        this.load.image("cashin", "images/cashin.png");
        this.load.image("pointer", "images/pointer.png");
        this.load.image("landPointer", "images/land_pointer.png");
        this.load.image("landDealerCardsPlace", "images/land_place_dealer_cards.png");
        this.load.spritesheet("chips", "images/chips.png", 85, 85);
        this.load.spritesheet("bottomBtnBg", "images/land_bottom_btn_bg.png", 150, 70);
        this.load.spritesheet("gameBtnBg", "images/phone_game_btn_bg.png", 131, 51);
        this.load.spritesheet("icons", "images/btn_icons.png", 32, 27);
        this.load.spritesheet("placeChips", "images/phone_place_chips.png", 85, 104);
        this.load.spritesheet("btnBg", "images/land_btn_bg.png", 150, 50);
        this.load.spritesheet("statusStake", "images/status_stake.png", 90, 35);
        this.load.spritesheet("limitBtnBg", "images/limit_btn_bg.png", 545, 59);
        this.load.spritesheet("statusBg", "images/status_bg.png", 1600, 61);
        this.load.spritesheet("landGameBtnBg", "images/land_game_btn_bg.png", 188, 60);
        this.load.spritesheet("landPlaceChips", "images/place_chips.png", 98, 120);
        this.load.spritesheet("cards", "images/cards.png", 79, 123);
        this.load.spritesheet("landStatusStake", "images/land_status_stake.png", 130, 50);
        this.load.spritesheet("landCards", "images/land_cards.png", 120, 186.8);
        this.game.load.onFileComplete.add(this.updateProgressBar, this);
    },
    create: function () {
        var self = this;

        function startGame() {
            if ($.client.UserData) {
                self.state.start("Game");
            } else {
                setTimeout(function () {
                    startGame();
                }, 200);
            }
        }

        startGame();
    },
    updateProgressBar: function (progress) {
        if (progressText != undefined) {
            progressText.destroy();
        }
        $.client.setProgressBarPercent(progress);
        var pr = progress + "%";
        progressText = this.add.text(this.game.world.centerX, this.game.world.centerY, pr, {
            font: "60px Arial",
            fill: "#ffffff"
        });
    }
};
BJPortrateGame.Game = function (game) {
};
BJPortrateGame.Game.prototype = {
    stateBg: null,
    labels: {
        betAmount: {},
        userBalance: {},
        state: {},
        userName: {},
        dealerMsgStatus: {},
        dealerTotal: [],
        userHandStatus: [],
        userTotal: [],
        winAmount: [],
        limitPlate: []
    },
    buttons: {
        doubles: {},
        split: {},
        stand: {},
        cashierBtn: {},
        hit: {},
        confirm: {},
        undo: {},
        clearAll: {},
        repeat: {},
        deal: {},
        limit: {},
        history: {},
        insurance: {},
        newGame: {},
        confirmLimit: {},
        provably: {}
    },
    dealerCardPlace: {},
    chips: {},
    chipCost: [],
    tableCell: {},
    create: function () {
        var self = this;
        var bottomBetLabel, winLabel, bottomBalansLabel;
        selectedChipId = 0;

        worldGroup = this.add.group();
        footerGroup = this.add.group();
        chipsGroup = this.add.group();
        removableGroup = this.add.group();
        frameGroup = this.add.group();
        buttonStakeGroup = this.add.group();
        buttonActionGroup = this.add.group();
        buttonNewGameGroup = this.add.group();
        selectedChipsGroup = this.add.group();

        worldGroup.add(frameGroup);
        worldGroup.add(chipsGroup);
        worldGroup.add(footerGroup);
        footerGroup.add(buttonStakeGroup);
        footerGroup.add(buttonActionGroup);
        footerGroup.add(buttonNewGameGroup);
        worldGroup.add(removableGroup);

        buttonActionGroup.visible = false;
        buttonNewGameGroup.visible = false;

        gameFrame = self.add.sprite(0, 0, "gameFrame");
        frameGroup.add(gameFrame);
        gameFrameH = gameFrame.height;
        gameFrameW = gameFrame.width;

        self.labels.userName = createTextLbl(self, {
            text: "-",
            x: 30,
            y: gameFrameH - 50,
            font: "ProximaNova",
            size: 22,
            color: "#909090",
            wordWrapWidth: 150,
            maxWidth: 150
        });
        footerGroup.add(this.labels.userName);

        winLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_WIN", true).toUpperCase(),
            x: gameFrame.width - 685,
            y: gameFrame.height - 119,
            font: "ProximaNova",
            size: 20,
            color: "#ddd",
            centered: false,
            wordWrapWidth: 70,
            maxHeight: 22,
            maxWidth: 90
        });
        footerGroup.add(winLabel);
        self.labels.winAmount = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + "0",
            x: gameFrame.width - 560,
            y: gameFrame.height - 120,
            font: "ProximaNova",
            size: 22,
            color: "#e4a345",
            centered: true,
            maxHeight: 22,
            maxWidth: 120 - winLabel.width
        });
        footerGroup.add(self.labels.winAmount);

        bottomBetLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_BET", true).toUpperCase(),
            x: gameFrame.width - 495,
            y: gameFrame.height - 119,
            font: "ProximaNova",
            size: 20,
            color: "#ddd",
            centered: false,
            wordWrapWidth: 70,
            maxWidth: 70

        });
        footerGroup.add(bottomBetLabel);
        self.labels.betAmount = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + "0",
            x: gameFrame.width - 390,
            y: gameFrame.height - 120,
            font: "ProximaNova",
            size: 22,
            color: "#e4a345",
            centered: true,
            maxHeight: 22,
            maxWidth: 140 - bottomBetLabel.width
        });
        footerGroup.add(self.labels.betAmount);

        bottomBalansLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_BALANCE", true).toUpperCase(),
            x: gameFrame.width - 305,
            y: gameFrame.height - 119,
            font: "ProximaNova",
            size: 20,
            color: "#ddd",
            centered: false,
            maxHeight: 50,
            maxWidth: 100
        });
        footerGroup.add(bottomBalansLabel);
        self.labels.userBalance = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + "0",
            x: gameFrame.width - 130,
            y: gameFrame.height - 120,
            font: "ProximaNova",
            size: 22,
            color: "#e4a345",
            centered: true,
            maxHeight: 50,
            maxWidth: 240 - bottomBalansLabel.width - 15
        });
        footerGroup.add(this.labels.userBalance);

        self.buttons.provably = this.add.button(gameFrame.x + 20, gameFrame.y + 20, "btnBg", function () {
            $.client.showProvablyFair();
        }, this);
        self.buttons.provably.input.useHandCursor = true;
        self.buttons.provably.text = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_PROVABLY_FAIR", true).toUpperCase(),
            x: self.buttons.provably.x + self.buttons.provably.width / 2,
            y: self.buttons.provably.y + 15,
            font: "ProximaNova",
            size: 18,
            color: "#fff",
            centered: true,
            maxHeight: 40,
            maxWidth: self.buttons.provably.width - 10
        });
        frameGroup.add(this.buttons.provably);

        self.buttons.cashierBtn = self.add.button(gameFrameW - 50, gameFrameH - 125, "cashin", function () {
            $.client.cashier();
        }, self);
        self.buttons.cashierBtn.scale.set(0.7);
        self.buttons.cashierBtn.input.useHandCursor = true;
        self.buttons.cashierBtn.clicked = true;

        self.buttons.limit = createTextButton(self, {
            text: $.client.getLocalizedString("TEXT_LIMITS", true).toUpperCase(),
            x: gameFrame.width - 300,
            y: gameFrame.height - 72,
            font: "ProximaNova",
            size: 26,
            maxHeight: 50,
            maxWidth: 120,
            color: "#fff",
            disabledColor: "#fff",
            style: "bold",
            centered: true,
            paddingTop: 0,
            sprite: "bottomBtnBg",
            defaultIndex: 0,
            overIndex: 1,
            clickIndex: 2,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: 2,
            onClick: function () {
                self.showLimits();
            }
        });
        footerGroup.add(self.buttons.limit);

        self.buttons.history = createTextButton(self, {
            text: $.client.getLocalizedString("TEXT_HISTORY", true).toUpperCase(),
            x: gameFrame.width - 150,
            y: gameFrame.height - 72,
            font: "ProximaNova",
            size: 26,
            maxHeight: 50,
            maxWidth: 120,
            color: "#fff",
            disabledColor: "#fff",
            style: "bold",
            centered: true,
            paddingTop: 0,
            sprite: "bottomBtnBg",
            defaultIndex: 0,
            overIndex: 1,
            clickIndex: 2,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: 2,
            onClick: function () {
                self.showHistory();
            }
        });
        footerGroup.add(self.buttons.history);

        self.buttons.undo = createTextButton(self, {
            text: $.client.getLocalizedString("TEXT_CANCEL_LAST_BET", true).toUpperCase(),
            x: 475,
            y: 950,
            font: "ProximaNova",
            size: 22,
            maxHeight: 30,
            maxWidth: 140,
            color: "#fff",
            disabledColor: "#808080",
            centered: true,
            paddingTop: 0,
            sprite: "btnBg",
            defaultIndex: 0,
            overIndex: 1,
            clickIndex: 2,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: 1,
            onClick: function () {
                self.cancelLast();
            }
        });

        buttonStakeGroup.add(this.buttons.undo);

        self.buttons.clearAll = createTextButton(self, {
            text: $.client.getLocalizedString("TEXT_CANCEL_ALL_BET", true).toUpperCase(),
            x: 300,
            y: 950,
            font: "ProximaNova",
            size: 22,
            maxHeight: 30,
            maxWidth: 140,
            color: "#fff",
            disabledColor: "#808080",
            centered: true,
            paddingTop: 0,
            sprite: "btnBg",
            defaultIndex: 0,
            overIndex: 1,
            clickIndex: 2,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: 1,
            onClick: function () {
                self.cancelAll();
            }
        });
        buttonStakeGroup.add(this.buttons.clearAll);
        self.buttons.deal = createTextButton(self, {
            text: $.client.getLocalizedString("TEXT_DEAL", true).toUpperCase(),
            x: 125,
            y: 950,
            font: "ProximaNova",
            size: 22,
            maxHeight: 30,
            maxWidth: 140,
            color: "#fff",
            disabledColor: "#808080",
            centered: true,
            paddingTop: 0,
            sprite: "btnBg",
            defaultIndex: 0,
            overIndex: 1,
            clickIndex: 2,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: 1,
            onClick: function (element) {
                self.deal(element);
            }
        });
        buttonStakeGroup.add(this.buttons.deal);
        this.dealerCardPlace = this.add.sprite(20, 490, "landDealerCardsPlace");
        this.dealerCardPlace.scale.set(0.71);
        this.dealerCardPlace.width=177;
        frameGroup.add(this.dealerCardPlace);

        self.buttons.stand = createTextButton(self, {
            text: $.client.getLocalizedString("TEXT_STAND", true).toUpperCase(),
            x: 475,
            y: 1050,
            font: "ProximaNova",
            size: 22,
            maxHeight: 30,
            maxWidth: 140,
            color: "#fff",
            disabledColor: "#fff",
            centered: true,
            paddingTop: 0,
            sprite: "btnBg",
            defaultIndex: 0,
            overIndex: 1,
            clickIndex: 2,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: 1,
            onClick: function (element) {
                self.standBet(element, false);
            }
        });
        buttonActionGroup.add(this.buttons.stand);
        self.buttons.hit = createTextButton(self, {
            text: $.client.getLocalizedString("TEXT_HIT", true).toUpperCase(),
            x: 300,
            y: 1050,
            font: "ProximaNova",
            size: 22,
            maxHeight: 30,
            maxWidth: 140,
            color: "#fff",
            disabledColor: "#fff",
            centered: true,
            paddingTop: 0,
            sprite: "btnBg",
            defaultIndex: 0,
            overIndex: 1,
            clickIndex: 2,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: 1,
            onClick: function (element) {
                self.hitCard(element);
            }
        });
        buttonActionGroup.add(this.buttons.hit);

        self.buttons.doubles = createTextButton(self, {
            text: $.client.getLocalizedString("TEXT_DOUBLE", true).toUpperCase(),
            x: 125,
            y: 1050,
            font: "ProximaNova",
            size: 22,
            maxHeight: 30,
            maxWidth: 140,
            color: "#fff",
            disabledColor: "#fff",
            centered: true,
            paddingTop: 0,
            sprite: "btnBg",
            defaultIndex: 0,
            overIndex: 1,
            clickIndex: 2,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: 1,
            onClick: function (element) {
                self.doubleBet(element);
            }
        });
        buttonActionGroup.add(this.buttons.doubles);

        self.buttons.split = createTextButton(self, {
            text: $.client.getLocalizedString("TEXT_SPLIT", true).toUpperCase(),
            x: 200,
            y: 980,
            font: "ProximaNova",
            size: 22,
            maxHeight: 30,
            maxWidth: 140,
            color: "#fff",
            disabledColor: "#fff",
            centered: true,
            paddingTop: 0,
            sprite: "btnBg",
            defaultIndex: 0,
            overIndex: 1,
            clickIndex: 2,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: 1,
            onClick: function (element) {
                self.splitCards(element);
            }
        });
        buttonActionGroup.add(this.buttons.split);

        self.buttons.insurance = createTextButton(self, {
            text: $.client.getLocalizedString("TEXT_INSURANCE", true).toUpperCase(),
            x: 400,
            y: 980,
            font: "ProximaNova",
            size: 22,
            maxHeight: 30,
            maxWidth: 140,
            color: "#fff",
            disabledColor: "#fff",
            centered: true,
            paddingTop: 0,
            sprite: "btnBg",
            defaultIndex: 0,
            overIndex: 1,
            clickIndex: 2,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: 1,
            onClick: function (element) {
                self.insuranceBet(element);
            }
        });
        buttonActionGroup.add(this.buttons.insurance);

        self.buttons.newGame = createTextButton(self, {
            text: $.client.getLocalizedString("TEXT_NEW_GAME", true).toUpperCase(),
            x: 200,
            y: 1050,
            font: "ProximaNova",
            size: 22,
            maxHeight: 30,
            maxWidth: 140,
            color: "#fff",
            disabledColor: "#fff",
            centered: true,
            paddingTop: 0,
            sprite: "btnBg",
            defaultIndex: 0,
            overIndex: 1,
            clickIndex: 2,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: 1,
            onClick: function (element) {
                self.newGame(element);
            }
        });
        buttonNewGameGroup.add(this.buttons.newGame);

        self.buttons.repeat = createTextButton(self, {
            text: $.client.getLocalizedString("TEXT_REPEAT", true).toUpperCase(),
            x: 400,
            y: 1050,
            font: "ProximaNova",
            size: 22,
            maxHeight: 30,
            maxWidth: 140,
            color: "#fff",
            disabledColor: "#fff",
            centered: true,
            paddingTop: 0,
            sprite: "btnBg",
            defaultIndex: 0,
            overIndex: 1,
            clickIndex: 2,
            disabledIndex: 2,
            useHandCursor: true,
            textClickYOffset: 1,
            onClick: function (element) {
                self.repeatGame(element);
            }
        });
        buttonNewGameGroup.add(this.buttons.repeat);

        GameData.userName = GameData.userName ? GameData.userName.toUpperCase().length < 15 ? GameData.userName.toUpperCase() : GameData.userName.toUpperCase().substr(0, 15) + "..." : "";
        this.labels.userName.setText(GameData.userName);
        this.updateMoneyInfo();
        this.tableCell = frameGroup.create(325, 730, "landPlaceChips");
        this.tableCell.id = 0;
        this.tableCell.type = "1";
        this.tableCell.angle = 0;
        this.tableCell.inputEnabled = true;
        this.tableCell.input.useHandCursor = true;
        this.tableCell.click = true;
        this.tableCell.alpha = 1;
        this.tableCell.events.onInputDown.add(this.addChip, this);
        this.tableCell.debug = true;
        frameGroup.add(selectedChipsGroup);
        this.stateBg = this.add.sprite(0, gameFrameH - 210, "statusBg", 2);
        this.stateBg.width = 750;
        this.stateBg.visible = false;
        footerGroup.add(this.stateBg);
        this.labels.state = this.add.text(this.stateBg.x, this.stateBg.y, "", {
            font: "30px ProximaNova",
            fill: "#ffffff",
            textAlign: "center",

            boundsAlignH: "center",
            boundsAlignV: "middle"
        });
        this.labels.state.setTextBounds(0, 0, this.stateBg.width, this.stateBg.height);
     
        footerGroup.add(this.labels.state);
        window.addEventListener("resize", function () {
            self.changeGameSize();
        });
        self.changeGameSize();
        $.client.setProgressBarPercent(100);
        buttonStakeGroup.rWidth = buttonStakeGroup.width;
        self.checkBetButtons();
        self.ready = true;
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
                hScale = Math.min($(window).innerWidth() / GAME_WIDTH, $(window).innerHeight() / GAME_HEIGHT);
                wScale = hScale + hScale / 100 * 20;
                game.scale.setUserScale(wScale, hScale);
            }
        }
        game.scale.refresh();
        setTimeout(function () {
            changeVideoSize();
        }, 500);
    },
    roundFloat: function (value, decimals) {
        return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
    },
    updateGameData: function (msg) {
        var self = this;
        var gData = [];
        var i, b, p, key, selectedLimit, selectedLimitLen = 0, selectedLimitArrayLen = 0;
        GameData.selectedLimitArray = Boolean(msg) ? msg.limits : {};
        selectedLimit = msg.selectedLimit;
        selectedLimitArrayLen = GameData.selectedLimitArray.length;
        if (selectedLimitArrayLen > 0) {
            selectedLimitLen = Object.keys(selectedLimit).length;
            for (i = 0; i < selectedLimitArrayLen; i++) {
                GameData.selectedLimitArray[i]['Bet']['Min'] = parseFloat(GameData.selectedLimitArray[i]['Bet']['Min'].replace(",", "."));
                GameData.selectedLimitArray[i]['Bet']['Max'] = parseFloat(GameData.selectedLimitArray[i]['Bet']['Max'].replace(",", "."));
                if (selectedLimitLen > 0 && GameData.selectedLimitArray[i]['Id'] == selectedLimit['Id']) {
                    GameData.limitPlateId = i;
                }
            }
        }
        self.validateChips();
        self.createChips();
        selectedChipsGroup.removeAll(true);
        removableGroup.removeAll(true);
        GameData.bettingChipArray = [];
        GameData.betAmount = 0;
        self.resetValues();
        gData = msg.game;
        if (gData.bets && gData.bets.length) {
            for (var i = 0; i < gData.bets.length; i++) {
                self.drawChip({ id: chips_cost.indexOf(gData.bets[i].amount), value: gData.bets[i].amount }, true);
            }
            self.checkBetButtons();
        }
        if (msg.game.dealer) {
            GameData.gameState = "deal";
            buttonStakeGroup.visible = false;
            chipsGroup.visible = false;

            var dealerCards = gData.dealer.cards;
            var userData = gData.user;
            GameData.handCount = gData.user.length;
            if (dealerCards.length > 1) {
                for (var i = 1; i < dealerCards.length; i++) {
                    GameData.dealerCards[i] = self.createCard(self.getCards(dealerCards[i]), GameData.dealerCards[i - 1].x + GameData.dealerCards[i - 1].width + 5, GameData.dealerCards[i - 1].y + 5);
                }
            } else {
                GameData.dealerCards[0] = self.createCard(self.getCards(dealerCards[0]), self.dealerCardPlace.x + 5, self.dealerCardPlace.y + 5);
                GameData.dealerCards[0].show(false);
                GameData.dealerCards[1] = self.createCard(54, GameData.dealerCards[0].x + GameData.dealerCards[0].width + 1, GameData.dealerCards[0].y);
                GameData.dealerCards[1].show(false);
                GameData.dealerCards["total"] = gData.dealer.points;
            }
            self.dealerCardPlace.width = (GameData.dealerCards[0].width + 5) * GameData.dealerCards.length;
            self.labels.dealerTotal = self.add.text(self.dealerCardPlace.x + self.dealerCardPlace.width + 20, self.dealerCardPlace.y + self.dealerCardPlace.height - 20, "", {
                font: "bold 26px ProximaNova",
                fill: "#ffffff"
            });
            self.labels.dealerMsgStatus = self.add.text(self.dealerCardPlace.x + 30, self.dealerCardPlace.y + 70, "", {
                font: "26px ProximaNova",
                fill: "#ffffff"
            });
            removableGroup.addChild(self.labels.dealerTotal);
            removableGroup.addChild(self.labels.dealerMsgStatus);

            function createHandInfo(handId, total) {
                self.labels.userTotal[handId] = self.add.text(
                    GameData.userCards[0]["c1"].x + GameData.userCards[0]["c1"].width / 2 + GameData.userCards[0]["c1"].width * handId - 5,
                    GameData.userCards[0]["c1"].y - 32,
                    total, {
                        font: "bold 28px ProximaNova",
                        fill: "#ffffff"
                    }
                );
                self.labels.userHandStatus[handId] = {};
                self.labels.userHandStatus[handId]["bg"] = self.add.sprite(
                    GameData.userCards[0]["c1"].x - 5,
                    GameData.userCards[0]["c1"].y + GameData.userCards[0]["c1"].height / 2,
                    "landStatusStake",
                    0
                );
                self.labels.userHandStatus[handId]["text"] = self.add.text(65, 11, "LOSE", {
                    font: "bold 26px ProximaNova",
                    fill: "#ffffff",
                    align: "center"
                });
                self.labels.userHandStatus[handId]["text"].anchor.x = Math.round(self.labels.userHandStatus[handId]["text"].width * 0.5) / self.labels.userHandStatus[handId]["text"].width;

                self.labels.userHandStatus[handId]["bg"].addChild(self.labels.userHandStatus[handId]["text"]);
                self.labels.userHandStatus[handId]["bg"].visible = false;
                self.labels.userHandStatus[handId]["text"].setText("");
                removableGroup.addChild(self.labels.userTotal[handId]);
                removableGroup.addChild(self.labels.userHandStatus[handId]["bg"]);

            }

            var cardOffset = 40;
            if (GameData.handCount > 1) {
                cardOffset = 0;
            }
            for (var i = 0; i < userData.length; i++) {
                GameData.userCards[i] = {};
                if (i == 1) {
                    cardOffset += GameData.userCards[0]["c1"].width + 20;
                }
                var xPos = gameFrameW - 300;
                var yPos = 670;
                for (var j = 1; j <= userData[i].cards.length; j++) {
                    if (j > 1) {
                        xPos = GameData.userCards[0]["c" + (j - 1)].x;
                        yPos += GameData.userCards[0]["c1"].height / 4;
                    }
                    GameData.userCards[i]["c" + j] = self.createCard(self.getCards(userData[i].cards[j - 1]), xPos + cardOffset, yPos);
                    GameData.userCards[i]["c" + j].show(false);
                }
                GameData.userCards[i]["total_cards"] = userData[i].cards.length;
                GameData.userCards[i]["points"] = userData[i]["points"];
                createHandInfo(i, GameData.userCards[i]["points"]);
            }
            GameData.pointer = removableGroup.create(
                            GameData.userCards[0]["c1"].x + 30,
                            GameData.userCards[0]["c" + userData[0]["cards"].length].y + GameData.userCards[0]["c2"].height + 10,
                            "landPointer");
            GameData.pointer.visible = false;
            if (userData.length > 1) {
                GameData.pointer.visible = true;
                var hId = 0;
                if (userData[0]["points"] >= 21) {
                    GameData.handNumber++;
                    hId = 1;
                }
                GameData.pointer.x = GameData.userCards[hId]["c1"].x + 30;
                GameData.pointer.y = GameData.userCards[hId]["c" + userData[hId]["cards"].length].y + GameData.userCards[hId]["c2"].height + 10;
            }

            buttonActionGroup.visible = true;
            if (gData.dealer.split) {
                self.buttons.split.visible = true;
            } else {
                self.buttons.split.visible = false;
            }
            if (gData.dealer.insurance && GameData.betAmount / 2 <= GameData.gameBalance) {
                self.buttons.insurance.visible = true;
            } else {
                self.buttons.insurance.visible = false;
            }
            if (userData.length > 1) {
                self.buttons.insurance.visible = false;
                self.buttons.doubles.visible = false;
            }
            if (GameData.betAmount > GameData.gameBalance) {
                self.buttons.split.visible = false;
                self.buttons.doubles.visible = false;
            }
            if (GameData.betAmount / 2 > GameData.gameBalance) {
                self.buttons.insurance.visible = false;
            }
        }
    },
    createChips: function () {
        var self = this;
        var limitMin,limitMax, chipsEl, chipText;
        this.chipCost = [];
        chipsGroup.removeAll(true);
        if (GameData.selectedLimitArray.length > 0) {
            limitMin = parseFloat(GameData.selectedLimitArray[GameData.limitPlateId]["Bet"]["Min"]);
            limitMax = parseFloat(GameData.selectedLimitArray[GameData.limitPlateId]["Bet"]["Max"]);
            if (chips_cost.length > 0) {
                for (var i = 0; i < chips_cost.length; i++) {
                    if (chips_cost[i] >= limitMin && chips_cost[i] <= limitMax) {
                        this.chipCost.push(chips_cost[i]);
                    }
                }
            }
            if (this.chipCost.length > 0) {
                for (var a = 0; a < this.chipCost.length; a++) {
                    if (a === selectedChipId || a === 0) {
                        chipsEl = chipsGroup.create(60 + (a * 105), gameFrameH-320, "chips", a + 6);
                        selectedChip = { id: a, value: this.chipCost[a] };
                    } else {
                        chipsEl = chipsGroup.create(60 + (a * 105), gameFrameH - 320, "chips", a);
                    }
                    chipsEl.posY = chipsEl.y;
                    chipsEl.chipValue = this.chipCost[a];
                    chipsEl.id = a;
                    chipsEl.scale.set(1.3);
                    chipsEl.inputEnabled = true;
                    chipsEl.input.useHandCursor = true;
                    chipsEl.events.onInputDown.add(this.changeChips, this);
                    chipText = this.add.text(42, 28, this.chipCost[a] > 999 ? kFormater(this.chipCost[a]) : this.chipCost[a], {
                        font: "26px ProximaNova",
                        fill: "#fff"
                    });
                    chipText.anchor.x = Math.round(chipText.width * 0.5) / chipText.width;
                    chipsEl.addChild(chipText);
                }
                self.changeChips(selectedChip);
            }
        }
    },
    changeChips: function (element) {
        var self = this;
        selectedChipId = element.id;
        chipsGroup.forEach(function (item) {
            if (item.key == "chips") {
                if (item.id == selectedChipId) {
                    item.y = item.posY - 6;
                    item.loadTexture(item.key, item.id + 6);
                    selectedChip = { id: selectedChipId, value: self.chipCost[selectedChipId] };
                } else {
                    item.loadTexture(item.key, item.id);
                    item.y = item.posY;
                }
            }
        });
    },
    validateChips: function () {
        var limitMin, limitMax, chipValue = 0;
        var self = this, prevDissabled;
        if (GameData.selectedLimitArray.length > 0) {
            limitMin = parseFloat(GameData.selectedLimitArray[GameData.limitPlateId]["Bet"]["Min"]);
            limitMax = parseFloat(GameData.selectedLimitArray[GameData.limitPlateId]["Bet"]["Max"]);
            chipsGroup.forEach(function (item) {
                if (item.key == "chips") {
                    chipValue = parseFloat(item.chipValue);
                    if (limitMin > chipValue || limitMax < chipValue) {
                        item.tint = 0x808080;
                        item.inputEnabled = false;
                        item.input.useHandCursor = false;
                        prevDissabled = true;
                    } else {
                        item.tint = 0xffffff;
                        item.inputEnabled = true;
                        item.input.useHandCursor = true;
                        if (item.id && prevDissabled) {
                            prevDissabled = false;
                            self.changeChips(item);
                        }
                    }
                }
            });
        }
    },
    drawChip: function (par, sent) {
        var self = this;
        var chip = {}, chipsAmount, text = "";
        var chipId, chipValue;
        chipId = par["id"] || 0;
        chipValue = par["value"] || 0;
        sent = (sent !== undefined) ? true : false;
        chipsAmount = chipValue;
        chipsAmount = chipsAmount % 1 == 0 ? chipsAmount : parseFloat(chipsAmount);
        if (GameData.bettingChipArray.length > 0) {
            for (var i = 0; i < GameData.bettingChipArray.length; i++) {
                chipsAmount += GameData.bettingChipArray[i].value;
            }
        }
        chip.chipClone = this.add.graphics(this.tableCell.x + this.tableCell._frame.width / 2 - 42, this.tableCell.y + this.tableCell._frame.height / 2 - 42, selectedChipsGroup);
        chip.active_sprite = this.add.sprite(0, 0, "chips", chipId + 6);
        chip.chipClone.addChild(chip.active_sprite);
        chip.chipText = this.add.text(42, 29, "0", {
            font: "bold 24px ProximaNova",
            fill: "#ffffff",
            wordWrap: true
        });
        chip.chipClone.addChild(chip.chipText);
        var chipAmount = chipsAmount % 1 == 0 ? chipsAmount : self.roundFloat(chipsAmount, 2);
        chipAmount = chipAmount > 9999 ? kFormater(chipAmount) : chipAmount;
        chip.chipText.setText(chipAmount);
        chip.chipText.anchor.x = Math.round(chip.chipText.width * 0.5) / chip.chipText.width;

        GameData.bettingChipArray.push({
            id: chipId,
            value: chipValue,
            total: chipsAmount,
            chip: chip,
            sum: "0",
            sent: sent
        });
        GameData.betAmount += chipValue;
        GameData.gameBalance -= chipValue;
        this.updateBetAmount();
        this.updateMoneyInfo();
        if (parseFloat(GameData.selectedLimitArray[GameData.limitPlateId]["Bet"]["Min"]) <= chipsAmount) {
            this.buttons.deal.clicked = true;
        } else {
            text = $.client.getLocalizedString("TEXT_MIN_BET", true) + $.client.UserData.CurrencySign + GameData.selectedLimitArray[GameData.limitPlateId]["Bet"]["Min"];
            this.buttons.deal.clicked = false;
        }
    },
    addChip: function (element) {
        var self = this;
        var event = $.extend(true, {}, element);
        var chip = {}, chipsAmount, text = "";
        if (!isSubmiting) {
            chipsAmount = selectedChip.value;
            if (0 > GameData.gameBalance - chipsAmount) {
                text = $.client.getLocalizedString("TEXT_ERROR_NO_MONEY_MSG", true);
                this.showMessage(text, 2, 3000);
                return false;
            }
            if (GameData.gameState != "newGame") {
                return false;
            }
            if (GameData.selectedLimitArray.length > 0) {
                GameData.selectedLimitArray[GameData.limitPlateId]["Bet"]["Min"] = parseFloat(GameData.selectedLimitArray[GameData.limitPlateId]["Bet"]["Min"]);
                GameData.selectedLimitArray[GameData.limitPlateId]["Bet"]["Max"] = parseFloat(GameData.selectedLimitArray[GameData.limitPlateId]["Bet"]["Max"]);

                if (GameData.gameBalance - chipsAmount >= 0) {
                    chipsAmount = chipsAmount % 1 == 0 ? chipsAmount : parseFloat(chipsAmount);
                    if (GameData.bettingChipArray.length > 0) {
                        for (var i = 0; i < GameData.bettingChipArray.length; i++) {
                            if (GameData.bettingChipArray[i].type == element.type) {
                                chipsAmount += GameData.bettingChipArray[i].value;
                            }
                        }
                    }

                    if (GameData.bettingChipArray.length > 0 && chipsAmount > GameData.selectedLimitArray[GameData.limitPlateId]["Bet"]["Max"]) {
                        element.click = false;
                    } else {
                        element.click = true;
                    }
                    if (GameData.selectedLimitArray[GameData.limitPlateId]["Bet"]["Max"] >= selectedChip.value && element.click) {
                        chip.chipClone = this.add.graphics(element.x + element._frame.width / 2 - 42, element.y + element._frame.height / 2 - 42, selectedChipsGroup);
                        chip.active_sprite = this.add.sprite(0, 0, "chips", selectedChipId + 6);
                        chip.chipClone.addChild(chip.active_sprite);

                        chip.chipText = this.add.text(42, 29, selectedChip.value % 1 == 0 ? selectedChip.value : self.roundFloat(selectedChip.value, 2), {
                            font: "bold 24px ProximaNova",
                            fill: "#ffffff",
                            wordWrap: true,
                            align: "center"
                        });
                        chip.chipClone.addChild(chip.chipText);
                        var chipAmount = chipsAmount % 1 == 0 ? chipsAmount : self.roundFloat(chipsAmount, 2);
                        chipAmount = chipAmount > 9999 ? kFormater(chipAmount) : chipAmount;
                        chip.chipText.setText(chipAmount);
                        chip.chipText.anchor.x = Math.round(chip.chipText.width * 0.5) / chip.chipText.width;

                        GameData.bettingChipArray.push({
                            id: selectedChip.id,
                            value: selectedChip.value,
                            total: chipsAmount,
                            type: event.type,
                            chip: chip,
                            sum: "0"
                        });

                        GameData.gameBalance -= selectedChip.value;
                        this.updateBetAmount();
                        this.updateMoneyInfo();
                        chipsAmount = this.roundFloat(chipsAmount, 2);
                        this.confirmBet();

                        if (GameData.selectedLimitArray[GameData.limitPlateId]["Bet"]["Min"] <= chipsAmount) {
                            this.buttons.deal.clicked = true;
                        } else {
                            text = $.client.getLocalizedString("TEXT_MIN_BET", true) + $.client.UserData.CurrencySign + GameData.selectedLimitArray[GameData.limitPlateId]["Bet"]["Min"];
                            this.buttons.deal.clicked = false;
                            this.showMessage(text, 2, 3000);
                        }
                    } else {
                        text = $.client.getLocalizedString("TEXT_MAX_BET", true) + $.client.UserData.CurrencySign + GameData.selectedLimitArray[GameData.limitPlateId]["Bet"]["Max"];
                        this.showMessage(text, 2, 3000);
                    }
                } else {
                    text = $.client.getLocalizedString("TEXT_ERROR_NO_MONEY_MSG", true);
                    this.showMessage(text, 2, 3000);
                }
            } else {
                text = $.client.getLocalizedString("Limits_ERROR", true);
                this.showMessage(text, 2, 3000);
            }
        }
    },
    createCard: function (id, x, y) {
        var self = this;
        var card = removableGroup.create(x, y, "landCards", id);
        card.alpha = 0;
        card.scale.set(0.7);
        card.show = function (aninmation, calback) {
            if (aninmation) {
                card.x = gameFrameW / 2;
                card.y = 200;
                game.add.tween(card).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true);
                var tween = game.add.tween(card).to({ x: x, y: y }, 300, Phaser.Easing.Linear.None, true);
                tween.onComplete.add(function () {
                    if (calback)
                        calback();
                }, this);
            } else {
                card.alpha = 1;
                if (calback)
                    calback();
            }
        };
        return card;
    },
    confirmBet: function (calback) {
        var self = this;
        var obj = {};
        if (!isSubmiting) {
            var notSentChipsArray = $.grep(GameData.bettingChipArray, function (n, i) {
                return (!n.sent);
            });
            var amount = 0;
            if (notSentChipsArray.length > 0) {
                for (var i = 0; i < notSentChipsArray.length; i++) {
                    amount += notSentChipsArray[i].value;
                }
            }
            isSubmiting = true;
            obj.bet = {
                amount: parseFloat(amount).toFixed(2),
                handIndex: GameData.handNumber
            };
            obj.type = "bet";
            $.client.sendPost(JSON.stringify(obj), function (msg) {
                isSubmiting = false;
                if (msg.ResponseData.success) {
                    GameData.betAmount += selectedChip.value;
                    for (var j = 0; j < GameData.bettingChipArray.length; j++) {
                        GameData.bettingChipArray[j].sent = true;
                    }
                    self.updateBetAmount();
                    if (calback)
                        calback();
                } else {
                    for (var i = 0; i < notSentChipsArray.length; i++) {
                        self.clearBets(notSentChipsArray[i]);
                    }
                }
                self.checkBetButtons();
            }, function (err) {
                isSubmiting = false;
                console.log(err);
            });
        } else {
            setTimeout(function () {
                self.confirmBet();
            }, 100);
        }
    },
    cancelLast: function (bet) {
        var self = this;
        var destroyChip, lastChip, text, cancelBet = {};
        if (GameData.bettingChipArray.length > 0) {
            lastChip = GameData.bettingChipArray.pop();
            destroyChip = jQuery.extend(true, {}, lastChip);
            delete (destroyChip["chip"]);
            cancelBet.type = "cancel_last";
            cancelBet.bet = destroyChip;
            $.client.sendPost(JSON.stringify(cancelBet), function (msg) {
                if (msg.ResponseData.success) {
                    self.clearBets(lastChip);
                    self.checkBetButtons();
                } else {
                    this.showMessage($.client.getLocalizedString("TEXT_SOMETHING_WRONG", true), 2, 3000);

                }
            }, function (err) {
                isSubmiting = false;
                console.log(err);
            });
        }
        self.checkBetButtons();
    },
    cancelAll: function (all) {
        var destroyChips, lastChip, cancelBets = {};
        var self = this;
        cancelBets.type = "cancel_all";
        $.client.sendPost(JSON.stringify(cancelBets), function (msg) {
            if (msg.ResponseData.success) {
                destroyChips = GameData.bettingChipArray;
                if (destroyChips.length > 0) {
                    for (var i = destroyChips.length - 1; i >= 0; i--) {
                        lastChip = destroyChips.pop();
                        GameData.betAmount = 0;
                        self.clearBets(lastChip);
                        self.updateBetAmount();
                        self.updateMoneyInfo();
                    }
                }
                self.checkBetButtons();
            } else {
                self.showMessage($.client.getLocalizedString("TEXT_SOMETHING_WRONG", true), 2, 3000);
            }


        }, function (err) {
            isSubmiting = false;
            console.log(err);
        });
        self.checkBetButtons();
    },
    clearBets: function (bet) {
        var self = this;
        var destroyChip, chip, text;
        destroyChip = bet;
        if (destroyChip) {
            chip = destroyChip.chip;
            if (GameData.betAmount > 0) {
                GameData.betAmount -= destroyChip.value;
                GameData.betAmount = parseFloat(parseFloat(GameData.betAmount).toFixed(2));
                GameData.gameBalance += destroyChip.value;
                this.updateBetAmount();
                this.updateMoneyInfo();
            }
            if (chip) {
                chip.chipClone.destroy();
            }
        
        }
        self.checkBetButtons();
    },
    deal: function (element) {
        var self = this;

        function deal() {
                self.buttons.deal.clicked = false;
                GameData.userCards[0] = {};
                $.client.sendPost(JSON.stringify({ type: "deal" }),
                    function (msg) {
                        if (msg.ResponseData.success) {
                            var timerVideoOfCards;
                            GameData.gameState = "deal";
                            GameData.handCount = 1;
                            self.checkBetButtons();
                            var userCards = msg.ResponseData.user.cards;
                            var buttonsTween = game.add.tween(buttonStakeGroup).to({ alpha: 0, width: 0, x: gameFrameW / 2 }, 600, Phaser.Easing.Linear.None, true);
                            buttonsTween.onComplete.add(function () {
                                buttonStakeGroup.visible = false;
                            }, this);
                            var chipsTween = game.add.tween(chipsGroup).to({ x: chipsGroup.x + 1000 }, 600, Phaser.Easing.Linear.None, true);
                            chipsTween.onComplete.add(function () {
                                chipsGroup.visible = false;
                            }, this);
                            self.buttons.stand.clicked = true;
                            for (var i = 0; i < userCards.length; i++) {
                                var total = msg.ResponseData.user.points;
                                GameData.userCards[0]["total_cards"] = 2;
                                GameData.userCards[0]["total"] = total;
                                GameData.userCards[0]["c1"] = self.createCard(self.getCards(userCards[0]), gameFrameW - 300, 670);
                                GameData.userCards[0]["c2"] = self.createCard(self.getCards(userCards[1]), GameData.userCards[GameData.handNumber]["c1"].x + 40, GameData.userCards[GameData.handNumber]["c1"].y + GameData.userCards[GameData.handNumber]["c1"].height / 5);

                                self.labels.userTotal[GameData.handNumber] = self.add.text(
                                    GameData.userCards[0]["c1"].x + 30,
                                    GameData.userCards[0]["c1"].y - 30,
                                    total, {
                                        font: "bold 28px ProximaNova",
                                        fill: "#ffffff"
                                    }
                                );
                                self.labels.userTotal[GameData.handNumber].visible = false;
                                self.labels.userHandStatus[GameData.handNumber] = {};
                                self.labels.userHandStatus[GameData.handNumber]["bg"] = self.add.sprite(
                                    GameData.userCards[0]["c1"].x - 5,
                                    GameData.userCards[0]["c1"].y + GameData.userCards[0]["c1"].height / 2,
                                    "landStatusStake",
                                    0
                                );
                                self.labels.userHandStatus[GameData.handNumber]["text"] = self.add.text(65, 11, "LOSE", {
                                    font: "bold 26px ProximaNova",
                                    fill: "#ffffff",
                                    align: "center"
                                });
                                self.labels.userHandStatus[GameData.handNumber]["text"].anchor.x = Math.round(self.labels.userHandStatus[GameData.handNumber]["text"].width * 0.5) / self.labels.userHandStatus[GameData.handNumber]["text"].width;

                                self.labels.userHandStatus[GameData.handNumber]["bg"].addChild(self.labels.userHandStatus[GameData.handNumber]["text"]);
                                self.labels.userHandStatus[GameData.handNumber]["bg"].visible = false;
                                removableGroup.addChild(self.labels.userTotal[GameData.handNumber]);
                                removableGroup.addChild(self.labels.userHandStatus[GameData.handNumber]["bg"]);
                            }
                            var dealerCards = msg.ResponseData.dealer.cards;
                            GameData.dealerCards[0] = self.createCard(self.getCards(dealerCards[0]), self.dealerCardPlace.x + 5, self.dealerCardPlace.y + 5);
                            GameData.dealerCards["total"] = msg.ResponseData.dealer.points;
                            if (dealerCards.length > 1) {
                                for (var i = 1; i < dealerCards.length; i++) {
                                    GameData.dealerCards[i] = self.createCard(self.getCards(dealerCards[i]), GameData.dealerCards[i - 1].x + GameData.dealerCards[i - 1].width + 5, GameData.dealerCards[i - 1].y + 5);
                                }
                            } else {
                                GameData.dealerCards[1] = self.createCard(54, GameData.dealerCards[0].x + GameData.dealerCards[0].width + 1, GameData.dealerCards[0].y);
                            }
                            timerVideoOfCards = msg.ResponseData.videoTimer;
                            self.labels.dealerTotal = self.add.text(self.dealerCardPlace.x + self.dealerCardPlace.width + 20, self.dealerCardPlace.y + 130, "", {
                                font: "bold 26px ProximaNova",
                                fill: "#ffffff"
                            });
                            self.labels.dealerMsgStatus = self.add.text(self.dealerCardPlace.x + 30, self.dealerCardPlace.y + 70, "", {
                                font: "26px ProximaNova",
                                fill: "#ffffff"
                            });
                            removableGroup.addChild(self.labels.dealerTotal);
                            removableGroup.addChild(self.labels.dealerMsgStatus);

                            var dealerCardIndex = 0;

                            function displayDealerCard(id) {
                                dealerCardIndex++;
                                if (GameData.dealerCards[id]) {
                                    GameData.dealerCards[id].show(true, function () {
                                        if (dealerCards.length == 1) {
                                            GameData.dealerCards[id + 1].show();
                                        }
                                    });
                                }
                                dealerCardIndex++;
                            }

                            var userCardIndex = 0;

                            function displayUserCard() {
                                if (userCardIndex < 1) {
                                    GameData.userCards[GameData.handNumber]["c1"].show(true);
                                } else {
                                    GameData.userCards[GameData.handNumber]["c2"].show(true, function () {
                                        self.labels.userTotal[GameData.handNumber].x = GameData.userCards[GameData.handNumber]["c1"].x + 40;
                                        self.labels.userTotal[GameData.handNumber].y = GameData.userCards[GameData.handNumber]["c1"].y - 35;
                                        self.labels.userTotal[GameData.handNumber].visible = true;
                                    });
                                }
                                userCardIndex++;
                            }

                            function displayElements() {
                                if (dealerCards.length > 1) {
                                    buttonNewGameGroup.visible = true;
                                    var anim = self.add.tween(self.labels.dealerTotal).to({
                                        x: self.dealerCardPlace.x + self.dealerCardPlace.width + 20,
                                        y: self.dealerCardPlace.y + self.dealerCardPlace.height - 20
                                    }, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, false);
                                    self.labels.dealerTotal.setText(msg.ResponseData.dealer.points);
                                } else {
                                    buttonActionGroup.visible = true;
                                    removableGroup.forEach(function (item) {
                                        if (item.key == "landPlaceChips") {
                                            item.inputEnabled = false;
                                        }
                                    });
                                    if (GameData.userCards[GameData.handNumber]["c2"]) {
                                        GameData.pointer = removableGroup.create(
                                            GameData.userCards[GameData.handNumber]["c2"].x + 10,
                                            GameData.userCards[GameData.handNumber]["c2"].y + GameData.userCards[GameData.handNumber]["c2"].height, "landPointer");
                                        GameData.pointer.visible = false;
                                    }
                                    self.buttons.doubles.visible = true;
                                    if (GameData.dealerCards["total"] == 11 && GameData.betAmount / 2 <= GameData.gameBalance) {
                                        self.buttons.insurance.visible = true;
                                    } else {
                                        self.buttons.insurance.visible = false;
                                    }
                                    if (msg.ResponseData.split) {
                                        self.buttons.split.visible = true;
                                    } else {
                                        self.buttons.split.visible = false;
                                    }
                                    if (GameData.betAmount > GameData.gameBalance) {
                                        self.buttons.split.visible = false;
                                        self.buttons.doubles.visible = false;
                                    }
                                    if (GameData.betAmount / 2 > GameData.gameBalance) {
                                        self.buttons.insurance.visible = false;
                                    }
                                }
                            }

                            var c = 0;

                            function videoTimer() {
                                var wait = 0.6;
                                if (c === 1) {
                                    displayDealerCard(0);
                                } else if (c > 1 && c <= userCards.length + 1) {
                                    displayUserCard();
                                } else if (c > userCards.length + 1) {
                                    displayDealerCard(c - userCards.length - 1);
                                }
                                c += 1;
                                if (c < timerVideoOfCards.length + 1) {
                                    setTimeout(function () {
                                        videoTimer();
                                    }, (timerVideoOfCards[c - 1] + wait) * 1000);
                                } else {
                                    displayElements();
                                }
                            }

                            videoTimer();
                        }
                    }, function (err) {
                        console.log(err);
                        buttonStakeGroup.visible = true;
                        chipsGroup.visible = true;
                    }
                );
            }
  
        if ($.client.UserData.Features && $.client.UserData.Features.provably_fair) {
            $.client.sendSeed(function (responce) {
                if (responce.IsSuccess) {
                    deal();
                }
                isSubmiting = false;
            }, function (err) {
                console.log(err);
                isSubmiting = false;
            });
        } else {
            deal();
        }
    },
    standBet: function (element, isAuto) {
        var self = this;
            $.client.sendPost(JSON.stringify({
                type: "stand",
                handIndex: GameData.handNumber
            }),
                function (resp) {
                    if (resp.IsSuccess) {
                        var msg = resp.ResponseData;
                        if (msg.success) {
                            if (GameData.handNumber < GameData.handCount - 1) {
                                if (GameData.userCards.length > 1)
                                    GameData.pointer.visible = true;
                                GameData.handNumber++;
                                self.add.tween(GameData.pointer).to({
                                    x: GameData.userCards[GameData.handNumber]["c2"].x + 10,
                                    y: GameData.userCards[GameData.handNumber]["c2"].y + GameData.userCards[GameData.handNumber]["c2"].height
                                }, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, false);
                                self.buttons.split.visible = false;
                            } else {
                                GameData.localCounter = 1;
                                if (msg.dealerCards.length > 0) {
                                    var c, timerVideoOfCards, cardsVideoCount = 0;
                                    buttonActionGroup.visible = false;
                                    var secondDealerCard = self.getCards(msg.dealerCards[0]);
                                    GameData.dealerCards[1].loadTexture("landCards", secondDealerCard);
                                    GameData.dealerCards[1].visible = false;
                                    var totalDealerCard = msg.dealerTotal;
                                    GameData.dealerCards["total"] = totalDealerCard;
                                    for (var i = 0; i < msg.dealerCards.length; i++) {
                                        GameData.dealerCards[i + 1] = self.createCard(self.getCards(msg.dealerCards[i]), GameData.dealerCards[i].x + GameData.dealerCards[i].width + 5, GameData.dealerCards[i].y);
                                        GameData.localCounter++;
                                    }
                                    self.dealerCardPlace.width = (GameData.dealerCards[0].width + 5) * GameData.dealerCards.length;

                                    function displayDealerCard() {
                                        cardsVideoCount++;
                                        if (GameData.dealerCards[cardsVideoCount]) {
                                            GameData.dealerCards[cardsVideoCount].show(true);
                                        }
                                    }

                                    function displayElements() {
                                        var anim = self.add.tween(self.labels.dealerTotal).to({
                                            x: self.dealerCardPlace.x + self.dealerCardPlace.width + 20,
                                            y: self.dealerCardPlace.y + self.dealerCardPlace.height - 20
                                        }, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, false);
                                        self.labels.dealerTotal.setText(totalDealerCard);
                                        anim.onComplete.add(function () {
                                            self.updateMoneyInfo();
                                            buttonNewGameGroup.visible = true;
                                            buttonNewGameGroup.alpha = 0;
                                            self.add.tween(buttonNewGameGroup).to({
                                                alpha: 1
                                            }, 300, Phaser.Easing.Quadratic.Out, true, 0, 0, false);
                                        }, this);
                                    }

                                    c = 0;
                                    timerVideoOfCards = msg.videoTimer;

                                    function timerVideo() {
                                        var wait = 0.5, sT;
                                        if (c > 0) {
                                            displayDealerCard();
                                        }
                                        c += 1;
                                        if (c <= timerVideoOfCards.length + 1) {
                                            setTimeout(function () {
                                                timerVideo();
                                            }, (timerVideoOfCards[c - 1] + wait) * 1000);
                                        } else {
                                            displayElements();
                                        }
                                    }

                                    timerVideo();
                                }
                            }
                        }
                    } else {
                        console.log(resp);
                    }
                }, function (err) {
                    console.log(err);
                }
            );
    },
    splitCards: function (element) {
        var self = this;
        var splite = {}, userCards = [], cardIdx, cardIdx2, pos;
        var count = 0, cardsVideoCount = 0, dealerCardId = 0, totalDealerCard = 0;
            buttonActionGroup.setAll("clicked", false);
            GameData.gameState = "split";
            splite.type = "split";
            splite.handIndex = GameData.handNumber;
            $.client.sendPost(JSON.stringify(splite),
                function (msg) {
                    var objPropCards = [], tween;
                    objPropCards[0] = {};
                    objPropCards[1] = {};
                    var c, timerVideoOfCards;
                    if (msg.ResponseData.success) {
                        self.buttons.split.visible = false;
                        self.buttons.doubles.visible = false;
                        self.buttons.insurance.visible = false;
                        self.buttons.hit.visible = false;
                        self.buttons.stand.visible = false;
                        var hands = msg.ResponseData["hands"];
                        GameData.splitPosition.push(GameData.counter);
                        GameData.handCount = hands.length;
                        cardIdx = self.getCards(hands[0]["cards"][1]);
                        cardIdx2 = self.getCards(hands[1]["cards"][1]);
                        totalDealerCard = msg.ResponseData.dealerTotal;

                        objPropCards[0]["total_cards"] = 2;
                        objPropCards[0]["cards"] = hands[0]["cards"];
                        objPropCards[0]["total"] = hands[0]["points"];
                        objPropCards[0]["c1"] = GameData.userCards[GameData.handNumber]["c1"];
                        objPropCards[1]["cards"] = hands[1]["cards"];
                        objPropCards[1]["total"] = hands[1]["points"];
                        objPropCards[1]["total_cards"] = 2;
                        objPropCards[1]["c1"] = GameData.userCards[GameData.handNumber]["c2"];
                        GameData.userCards = objPropCards;

                        GameData.userCards[0]["c2"] = self.createCard(cardIdx, GameData.userCards[0]["c1"].x, GameData.userCards[0]["c1"].y + GameData.userCards[0]["c1"].height / 4);

                        tween = self.add.tween(GameData.userCards[1]["c1"]).to({
                            x: GameData.userCards[1]["c1"].x + GameData.userCards[1]["c1"].width+15,
                            y: GameData.userCards[1]["c1"].y - GameData.userCards[1]["c1"].height / 5
                        }, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, false
                        );
                        tween.onComplete.add(function () {
                            GameData.userCards[1]["c2"] = self.createCard(cardIdx2, GameData.userCards[1]["c1"].x, GameData.userCards[1]["c1"].y + GameData.userCards[1]["c1"].height / 4);
                        }, this);
                        if (msg.ResponseData.dealerCards.length > 0) {
                            GameData.localCounter = 0;
                            GameData.dealerCards[1].visible = false;
                            for (var i = 0; i < msg.ResponseData.dealerCards.length; i++) {
                                GameData.dealerCards[GameData.localCounter + 1] = self.createCard(self.getCards(msg.ResponseData.dealerCards[i]), GameData.dealerCards[i].x + GameData.dealerCards[i].width + 5, GameData.dealerCards[i].y);
                                self.dealerCardPlace.width = (GameData.dealerCards[0].width + 5) * GameData.dealerCards.length;
                                GameData.localCounter++;
                            }
                        }

                        c = 0;
                        timerVideoOfCards = msg.ResponseData.videoTimer;

                        function timerVideo() {
                            var wait = 0.5;
                            if (c === 1 || c === 2) {
                                displaySplitCards();
                            } else if (c > 1) {
                                if (msg.ResponseData.dealerCards.length > 0) {
                                    self.dealerCardPlace.width = self.dealerCardPlace.width + 5;
                                    displayDealerCard();
                                }
                            }
                            c += 1;
                            if (c <= timerVideoOfCards.length) {
                                setTimeout(function () {
                                    timerVideo();
                                }, (timerVideoOfCards[c - 1] + wait) * 1000);
                            } else {
                                displayElements();
                            }
                        }

                        timerVideo();

                        function displaySplitCards() {
                            if (cardsVideoCount == 0) {
                                GameData.userCards[0]["c2"].show(true, function () {
                                    self.labels.userTotal[GameData.handNumber].setText(GameData.userCards[GameData.handNumber]["total"]);
                                });
                            } else if (cardsVideoCount == 1) {
                                GameData.userCards[1]["c2"].show(true, function () {
                                    self.labels.userTotal[GameData.handNumber].setText(GameData.userCards[GameData.handNumber]["total"]);
                                    GameData.pointer.visible = true;
                                    if (GameData.userCards[0]['total'] >= 21 && GameData.userCards[1]['total'] >= 21)
                                        GameData.pointer.visible = false;
                                    else {
                                        GameData.pointer.visible = true;
                                    }
                                    var hId = 0;
                                    if (msg.ResponseData.dealerCards.length <= 0) {
                                        if (GameData.userCards[0]["total"] >= 21) {
                                            GameData.handNumber++;
                                            hId = 1;
                                        }
                                        GameData.pointer.x = GameData.userCards[hId]["c1"].x + 30;
                                        GameData.pointer.y = GameData.userCards[hId]["c2"].y + GameData.userCards[hId]["c2"].height + 10;
                                    }

                                });
                            }
                            cardsVideoCount++;
                        }

                        function displayDealerCard() {
                            dealerCardId++;
                            if (GameData.dealerCards[dealerCardId]) {
                                GameData.dealerCards[dealerCardId].show(true);
                            }
                        }

                        function displayElements() {
                            var tween;

                            self.labels.userTotal[GameData.handNumber + 1] = self.add.text(
                                GameData.userCards[GameData.handNumber + 1]["c1"].x + 40,
                                GameData.userCards[GameData.handNumber + 1]["c1"].y - 35,
                                GameData.userCards[GameData.handNumber + 1]["total"], {
                                    font: "bold 28px ProximaNova",
                                    fill: "#ffffff"
                                }
                            );

                            self.labels.userHandStatus[GameData.handNumber + 1] = {};
                            self.labels.userHandStatus[GameData.handNumber + 1]["bg"] = self.add.sprite(
                                GameData.userCards[GameData.handNumber + 1]["c2"].x - 5,
                                GameData.userCards[GameData.handNumber + 1]["c2"].y + GameData.userCards[GameData.handNumber + 1]["c2"].height / 2 - 20,
                                "landStatusStake", 0);
                            self.labels.userHandStatus[GameData.handNumber + 1]["text"] = self.add.text(65, 11, "LOSE", {
                                font: "26px ProximaNova",
                                fill: "#ffffff"
                            });
                            self.labels.userHandStatus[GameData.handNumber + 1]["text"].anchor.x = Math.round(self.labels.userHandStatus[GameData.handNumber + 1]["text"].width * 0.5) / self.labels.userHandStatus[GameData.handNumber + 1]["text"].width;

                            removableGroup.addChild(self.labels.userHandStatus[GameData.handNumber + 1]["bg"]);
                            self.labels.userHandStatus[GameData.handNumber + 1]["bg"].addChild(self.labels.userHandStatus[GameData.handNumber + 1]["text"]);
                            self.labels.userHandStatus[GameData.handNumber + 1]["bg"].visible = false;

                            GameData.betAmount += parseFloat(msg.ResponseData.amount);
                            for (var key in GameData.bettingChipArray) {
                                if (GameData.bettingChipArray.hasOwnProperty(key)) {
                                    GameData.bettingChipArray[key]['chip']['chipText'].setText(GameData.betAmount % 1 == 0 ? GameData.betAmount : parseFloat(GameData.betAmount).toFixed(1));
                                }
                            }
                            self.updateBetAmount();
                            self.updateMoneyInfo();
                            removableGroup.addChild(self.labels.userTotal[GameData.handNumber]);
                            removableGroup.addChild(self.labels.userHandStatus[GameData.handNumber + 1]["bg"]);

                            buttonActionGroup.setAll("clicked", true);
                            if (GameData.userCards[0]['total'] >= 21 && GameData.userCards[1]['total'] >= 21) {
                                buttonActionGroup.visible = false;
                                buttonNewGameGroup.visible = true;
                                buttonNewGameGroup.alpha = 0;
                                self.add.tween(buttonNewGameGroup).to({
                                    alpha: 1
                                }, 300, Phaser.Easing.Quadratic.Out, true, 0, 0, false);
                                var anim = self.add.tween(self.labels.dealerTotal).to({
                                    x: self.dealerCardPlace.x + self.dealerCardPlace.width + 20,
                                    y: self.dealerCardPlace.y + self.dealerCardPlace.height - 20
                                }, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, false);
                                self.labels.dealerTotal.setText(totalDealerCard);

                            } else {
                                self.buttons.hit.visible = true;
                                self.buttons.stand.visible = true;
                            }
                        }
                    } else {
                        self.showMessage($.client.getLocalizedString("TEXT_SOMETHING_WRONG", true), 2, 3000);
                    }

                }, function (e) {
                    console.log(e);
                }
            );
    },
    hitCard: function (element) {
        var self = this;
        var hitCard = {}, userTotal;
            buttonActionGroup.setAll("clicked", false);
            GameData.gameState = "hit";
            hitCard = {
                type: "hit",
                handIndex: GameData.handNumber
            };
            $.client.sendPost(JSON.stringify(hitCard),
                function (msg) {
                    var timerVideoOfCards, wait = 0, sT, cardsVideoCount = 0, totalDealerCard;
                    console.log(msg.ResponseData);
                    if (msg.ResponseData.success) {
                        buttonActionGroup.visible = false;
                        timerVideoOfCards = msg.ResponseData.videoTimer;
                        totalDealerCard = msg.ResponseData.dealerTotal;
                        userTotal = msg.ResponseData.userTotal;
                        GameData.userCards[GameData.handNumber]["total"] = userTotal;
                        if (msg.ResponseData.dealerCards.length > 0) {
                            GameData.dealerCards[1].visible = false;
                            GameData.localCounter = 0;
                            for (var i = 0; i < msg.ResponseData.dealerCards.length; i++) {
                                GameData.dealerCards[GameData.localCounter + 1] = self.createCard(self.getCards(msg.ResponseData.dealerCards[i]), GameData.dealerCards[i].x + GameData.dealerCards[i].width + 5, GameData.dealerCards[i].y);
                                self.dealerCardPlace.width = (GameData.dealerCards[0].width + 5) * GameData.dealerCards.length;
                                GameData.localCounter++;
                            }
                        }

                        function displayUserCard() {
                            var nextCards, cardCount;
                            clearTimeout(sT);
                            GameData.userCards[GameData.handNumber]["total_cards"] += 1;
                            cardCount = GameData.userCards[GameData.handNumber]["total_cards"];
                            nextCards = cardCount;
                            var cardOffset = 40;
                            if (GameData.handCount > 1) {
                                cardOffset = 0;
                            }
                            GameData.userCards[GameData.handNumber]["c" + nextCards] = self.createCard(self.getCards(msg.ResponseData.userCard), GameData.userCards[GameData.handNumber]["c" + (cardCount - 1)].x + cardOffset, GameData.userCards[GameData.handNumber]["c" + (cardCount - 1)].y + GameData.userCards[GameData.handNumber]["c" + (cardCount - 1)].height / 4);
                            GameData.userCards[GameData.handNumber]["c" + nextCards].show(true, function () {
                                self.labels.userTotal[GameData.handNumber].setText(userTotal);
                                if (GameData.handNumber != GameData.handCount - 1 && GameData.userCards[GameData.handNumber]["total"] >= 21) {
                                    GameData.handNumber++;
                                }
                                cardCount = GameData.userCards[GameData.handNumber]["total_cards"];
                                self.add.tween(GameData.pointer).to({
                                    x: GameData.userCards[GameData.handNumber]["c" + cardCount].x + 30,
                                    y: GameData.userCards[GameData.handNumber]["c" + cardCount].y + GameData.userCards[GameData.handNumber]["c" + cardCount].height + 10
                                }, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, false);
                            });

                        }

                        function displayDealerCard() {
                            cardsVideoCount++;
                            if (GameData.dealerCards[cardsVideoCount]) {
                                GameData.dealerCards[cardsVideoCount].show(true);
                            }
                        }

                        function displayElements() {
                            if (msg.ResponseData.dealerCards.length > 0) {
                                var anim = self.add.tween(self.labels.dealerTotal).to({
                                    x: self.dealerCardPlace.x + self.dealerCardPlace.width + 20,
                                    y: self.dealerCardPlace.y + self.dealerCardPlace.height - 20
                                }, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, false);
                                self.labels.dealerTotal.setText(totalDealerCard);
                                anim.onComplete.add(function () {
                                    self.updateMoneyInfo();
                                    buttonActionGroup.visible = false;
                                    buttonNewGameGroup.visible = true;
                                    buttonNewGameGroup.alpha = 0;
                                    self.add.tween(buttonNewGameGroup).to({
                                        alpha: 1
                                    }, 300, Phaser.Easing.Quadratic.Out, true, 0, 0, false);
                                    if (GameData.userCards.length > 1)
                                        GameData.pointer.visible = false;
                                }, this);
                            } else {

                                buttonActionGroup.visible = true;
                                self.buttons.stand.visible = true;
                                self.buttons.hit.visible = true;
                                self.buttons.doubles.visible = false;
                                self.buttons.insurance.visible = false;
                                self.buttons.split.visible = false;
                            }
                        }

                        var c = 0;

                        function timerVideo() {
                            var wait = 0.4;
                            if (c === 1) {
                                if (msg.ResponseData.userCard)
                                    displayUserCard();
                            } else if (c > 1) {
                                if (msg.ResponseData.dealerCards.length > 0) {
                                    self.dealerCardPlace.width = self.dealerCardPlace.width + 5;
                                    displayDealerCard();
                                }
                            }
                            c += 1;
                            if (c <= timerVideoOfCards.length + 1) {
                                setTimeout(function () {
                                    timerVideo();
                                }, (timerVideoOfCards[c - 1] + wait) * 1000);
                            } else {
                                displayElements();
                            }
                        }

                        timerVideo();

                    } else {
                        this.showMessage($.client.getLocalizedString("TEXT_SOMETHING_WRONG", true), 2, 3000);
                    }
                }, function (err) {
                    console.log(err);
                });
    },
    doubleBet: function (element) {
        var self = this;
        var doubleCard = {}, cardIdx, sum = 0, splitPosItem = 0, userTotal;
        GameData.gameState = "double";
        doubleCard.type = "double";
        doubleCard.bet = {
            handIndex: GameData.handNumber
        };
        buttonStakeGroup.visible = false;
            $.client.sendPost(JSON.stringify(doubleCard),
                function (msg) {
                    console.log(msg);
                    var timerVideoOfCards, wait = 0, sT, cardsVideoCount = 0, totalDealerCard;
                    if (msg.ResponseData.success) {
                        buttonActionGroup.visible = false;
                        timerVideoOfCards = msg.ResponseData.videoTimer;
                        totalDealerCard = msg.ResponseData.dealerTotal;
                        userTotal = msg.ResponseData.userTotal;
                        GameData.userCards[GameData.handNumber]["total"] = userTotal;
                        if (msg.ResponseData.dealerCards.length > 0) {
                            GameData.localCounter = 0;
                            GameData.dealerCards[1].visible = false;
                            for (var i = 0; i < msg.ResponseData.dealerCards.length; i++) {
                                GameData.dealerCards[GameData.localCounter + 1] = self.createCard(self.getCards(msg.ResponseData.dealerCards[i]), GameData.dealerCards[i].x + GameData.dealerCards[i].width + 5, GameData.dealerCards[i].y);
                                self.dealerCardPlace.width = (GameData.dealerCards[0].width + 5) * GameData.dealerCards.length;
                                GameData.localCounter++;
                            }
                        }
                        GameData.betAmount += GameData.betAmount;
                        for (var key in GameData.bettingChipArray) {
                            if (GameData.bettingChipArray.hasOwnProperty(key)) {
                                GameData.bettingChipArray[key]['chip']['chipText'].setText(GameData.betAmount % 1 == 0 ? GameData.betAmount : parseFloat(GameData.betAmount).toFixed(1));
                            }
                        }
                        self.updateBetAmount();
                        self.updateMoneyInfo();

                        function displayUserCard() {
                            var nextCards, cardCount;
                            clearTimeout(sT);
                            GameData.userCards[GameData.handNumber]["total_cards"] += 1;
                            cardCount = GameData.userCards[GameData.handNumber]["total_cards"];
                            nextCards = cardCount;
                            var cardOffset = 40;
                            if (GameData.handCount > 1) {
                                cardOffset = 0;
                            }
                            GameData.userCards[GameData.handNumber]["c" + nextCards] = self.createCard(self.getCards(msg.ResponseData.userCard), GameData.userCards[GameData.handNumber]["c" + (cardCount - 1)].x + cardOffset, GameData.userCards[GameData.handNumber]["c" + (cardCount - 1)].y + GameData.userCards[GameData.handNumber]["c" + (cardCount - 1)].height / 4);
                            GameData.userCards[GameData.handNumber]["c" + nextCards].show(true, function () {
                                self.labels.userTotal[GameData.handNumber].setText(userTotal);
                                if (GameData.handNumber != GameData.handCount - 1 && GameData.userCards[GameData.handNumber]["total"] >= 21) {
                                    GameData.handNumber++;
                                    cardCount = 2;
                                    self.add.tween(GameData.pointer).to({
                                        x: GameData.userCards[GameData.handNumber]["c" + cardCount].x + 30,
                                        y: GameData.userCards[GameData.handNumber]["c" + cardCount].y + GameData.userCards[GameData.handNumber]["c" + cardCount].height + 10
                                    }, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, false);
                                }
                            });

                        }

                        function displayDealerCard() {
                            cardsVideoCount++;
                            if (GameData.dealerCards[cardsVideoCount]) {
                                GameData.dealerCards[cardsVideoCount].show(true);
                            }
                        }

                        function displayElements() {
                            if (msg.ResponseData.dealerCards.length > 0) {
                                var anim = self.add.tween(self.labels.dealerTotal).to({
                                    x: self.dealerCardPlace.x + self.dealerCardPlace.width + 20,
                                    y: self.dealerCardPlace.y + self.dealerCardPlace.height - 20
                                }, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, false);
                                self.labels.dealerTotal.setText(totalDealerCard);
                                anim.onComplete.add(function () {
                                    self.updateMoneyInfo();
                                    buttonActionGroup.visible = false;
                                    buttonNewGameGroup.visible = true;
                                    buttonNewGameGroup.alpha = 0;
                                    self.add.tween(buttonNewGameGroup).to({
                                        alpha: 1
                                    }, 300, Phaser.Easing.Quadratic.Out, true, 0, 0, false);
                                    if (GameData.userCards.length > 1)
                                        GameData.pointer.visible = false;
                                }, this);
                            } else {

                                buttonActionGroup.visible = true;
                                self.buttons.stand.visible = true;
                                self.buttons.hit.visible = true;
                                self.buttons.doubles.visible = false;
                                self.buttons.insurance.visible = false;
                                self.buttons.split.visible = false;
                            }
                        }

                        var c = 0;

                        function timerVideo() {
                            var wait = 0.4;
                            if (c === 1) {
                                if (msg.ResponseData.userCard)
                                    displayUserCard();
                            } else if (c > 1) {
                                if (msg.ResponseData.dealerCards.length > 0) {
                                    self.dealerCardPlace.width = self.dealerCardPlace.width + 5;
                                    displayDealerCard();
                                }
                            }
                            c += 1;
                            if (c <= timerVideoOfCards.length + 1) {
                                setTimeout(function () {
                                    timerVideo();
                                }, (timerVideoOfCards[c - 1] + wait) * 1000);
                            } else {
                                displayElements();
                            }
                        }

                        timerVideo();

                    } else {
                        self.showMessage($.client.getLocalizedString("TEXT_SOMETHING_WRONG", true), 2, 3000);
                    }
                }, function (err) {
                    console.log(err);
                });
    },
    insuranceBet: function (element) {
        var self = this;
        var insurance = {}, sum = 0, pos = 0;
            GameData.gameState = "insurance";
            insurance.type = "insurance";
            buttonActionGroup.visible = false;
            $.client.sendPost(JSON.stringify(insurance),
                function (msg) {
                    if (msg.ResponseData.success) {
                        GameData.betAmount += GameData.betAmount / 2;
                        for (var key in GameData.bettingChipArray) {
                            if (GameData.bettingChipArray.hasOwnProperty(key)) {
                                GameData.bettingChipArray[key]['chip']['chipText'].setText(GameData.betAmount % 1 == 0 ? GameData.betAmount : parseFloat(GameData.betAmount).toFixed(2));
                            }
                        }

                        self.updateBetAmount();
                        if (msg.ResponseData.dealerCards.length > 0) {
                            GameData.localCounter = 0;
                            for (var i = 0; i < msg.ResponseData.dealerCards.length; i++) {
                                var cardIdx = self.getCards(msg.ResponseData.dealerCards[i]);
                                GameData.dealerCards[GameData.localCounter + 1] = removableGroup.create(
                                    gameFrameW / 2,
                                    gameFrameH / 2,
                                    "landCards",
                                    cardIdx
                                );
                                GameData.dealerCards[GameData.localCounter + 1].visible = false;
                                if (i > 0)
                                    self.dealerCardPlace.width = self.dealerCardPlace.width + GameData.dealerCards[GameData.localCounter + 1].width + 1;
                                GameData.localCounter++;
                            }
                            cardsVideoCount = 0;
                            displayDealerCard();
                            buttonActionGroup.visible = false;
                            buttonNewGameGroup.visible = true;
                        } else {
                            self.showMessage($.client.getLocalizedString("TEXT_INSURANCE_LOST", true).toUpperCase(), 2, 3000);
                            buttonActionGroup.visible = true;
                            self.buttons.stand.visible = true;
                            self.buttons.hit.visible = true;
                            self.buttons.doubles.visible = false;
                            self.buttons.insurance.visible = false;
                            self.buttons.split.visible = false;
                        }

                        function displayDealerCard() {
                            cardsVideoCount++;
                            if (GameData.dealerCards[cardsVideoCount]) {
                                console.log(cardsVideoCount);
                                GameData.dealerCards[cardsVideoCount].visible = true;
                                GameData.dealerCards[cardsVideoCount].alpha = 0;
                                game.add.tween(GameData.dealerCards[cardsVideoCount]).to({ alpha: 1 }, 400, Phaser.Easing.Linear.None, true);
                                game.add.tween(GameData.dealerCards[cardsVideoCount]).to({ x: GameData.dealerCards[cardsVideoCount - 1].x + GameData.dealerCards[cardsVideoCount - 1].width + 5, y: GameData.dealerCards[cardsVideoCount - 1].y }, (cardsVideoCount == 1 ? 20 : 300), Phaser.Easing.Linear.None, true);

                            }
                        }
                    } else {
                        self.showMessage($.client.getLocalizedString("TEXT_SOMETHING_WRONG", true), 2, 3000);
                    }
                }, function (err) {
                    console.log(err);
                }
            );
    },
    newGame: function () {
        var balance = {};
        var self = this;
        GameData.gameState = "newGame";
        buttonNewGameGroup.visible = false;
        buttonStakeGroup.visible = true;
        game.add.tween(buttonStakeGroup).to({ alpha: 1, width: buttonStakeGroup.rWidth, x: 0 }, 400, Phaser.Easing.Linear.None, true);
        chipsGroup.visible = true;
        game.add.tween(chipsGroup).to({ x: 0 }, 400, Phaser.Easing.Linear.None, true);
        if (GameData.bettingChipArray.length > 0) {
            for (var i = GameData.bettingChipArray.length - 1; i >= 0; i--) {
                GameData.bettingChipArray[i].chip.chipClone.destroy();
            }
        }
        selectedChipsGroup.removeAll(true);
        removableGroup.removeAll(true);
        GameData.bettingChipArray = [];
        GameData.betAmount = 0;
        self.checkBetButtons();
        this.resetValues();
        this.buttons.deal.clicked = false;
        this.buttons.hit.clicked = true;
    },
    repeatGame: function () {
        var self = this;
        GameData.betAmount = 0;
        var sum = 0;
        for (var key2 in GameData.bettingChipArray) {
            if (GameData.bettingChipArray.hasOwnProperty(key2)) {
                GameData.bettingChipArray[key2]["sent"] = false;
                sum += GameData.bettingChipArray[key2]["value"];
                GameData.bettingChipArray[key2]['chip']['chipText'].setText(sum % 1 == 0 ? sum : sum.toFixed(1));
            }
        }
        if (sum <= GameData.gameBalance) {
            this.confirmBet(function () {
                GameData.betAmount = sum;
                self.updateBetAmount();
                removableGroup.removeAll(true);
                self.resetValues();
                buttonNewGameGroup.visible = false;
                buttonStakeGroup.visible = false;
                var buttonsTween = game.add.tween(buttonStakeGroup).to({ width: 0, x: gameFrameW / 2 }, 600, Phaser.Easing.Linear.None, true);

                buttonsTween.onComplete.add(function () {
                    buttonStakeGroup.visible = false;
                }, this);
                chipsGroup.visible = false;

                self.buttons.deal.clicked = true;
                self.buttons.hit.clicked = true;
                buttonActionGroup.visible = false;
                self.deal();
            });
        } else {
            self.showMessage($.client.getLocalizedString("TEXT_ERROR_NO_MONEY_MSG", true), 2, 3000);
        }
    },
    resetValues: function () {
        GameData.activedPosChips = [];
        GameData.dealerCards = [];
        GameData.userCards = [];
        GameData.counter = 0;
        GameData.handNumber = 0;
        GameData.handCount = 0;
        GameData.splitPosition = [];
        GameData.splitPositionItem = 0;
        GameData.numPlace = 0;
        GameData.winAmount = 0;
        GameData.localCounter = 2;
        GameData.winStateText = "";
        GameData.pointer = null;
        GameData.stack = [];
        GameData.handsWin= { }

        this.updateBetAmount();
        this.dealerCardPlace.width = 177;
        this.g_cardsVideoCount = 0;
        this.g_cardsVideo = [];

        this.stateBg.loadTexture("statusBg", 2);
        this.labels.state.visible = false;
        if (this.labels.userTotal[1])
            this.labels.userTotal[1].visible = false;
        this.stateBg.visible = false;
    },
    getCards: function (code) {
        var cardId;
        if (cards.indexOf(code) != -1) {
            cardId = cards.indexOf(code.toString());
            return cardId;
        }
        return 1;
    },

    getCoordinatesCard: function (type) {
        return { x: gameFrameW - 500, y: 250 };
    },
    updateMoneyInfo: function () {
        if (typeof this.labels.userBalance.setText === "function") {
            this.labels.userBalance.setText($.client.UserData.CurrencySign + (GameData.gameBalance > 99999 ? kFormater(GameData.gameBalance) : parseFloat(GameData.gameBalance).toFixed(2)));
        }
    },
    updateDealerInfoText: function (text) {
        if (text == undefined) {
            text = $.client.getLocalizedString("TEXT_BUST", true);
        }
        this.labels.dealerMsgStatus.setText(text);
    },
    updateBetAmount: function () {
        var amount = GameData.betAmount == 0 ? 0 : parseFloat(GameData.betAmount).toFixed(2);
        if (typeof this.labels.betAmount.setText === "function") {
            this.labels.betAmount.setText($.client.UserData.CurrencySign + (amount > 99999 ? kFormater(amount) : parseFloat(amount).toFixed(2)));
        }
    },
    showMessage: function (text, index, timeout) {
        var self = this;
        self.stateBg.loadTexture("statusBg", index);
        self.stateBg.visible = true;
        self.labels.state.visible = true;
        self.labels.state.setText(text);
        if (self.stateTimeout)
            clearTimeout(self.stateTimeout);
        self.stateTimeout = setTimeout(function () {
            self.stateBg.visible = false;
            self.labels.state.visible = false;
        }, timeout);
    },
    updateLimitPlate: function (id, array) {
        var text;
        text = $.client.getLocalizedString("TEXT_MIN", true) + $.client.UserData.CurrencySign + array[id]["min"]
            + "  " + $.client.getLocalizedString("TEXT_MAX", true) + $.client.UserData.CurrencySign + array[id]["max"];
        this.labels.limitPlate.setText(text);
    },
    showLimits: function () {
        var self = this;
        var modalBoxBg, limitBox, closeBtn, limitTitleText, modalBg, cancelBtn, rulesText;
        var perPage = 3, limitPage = 0, ii = 0, start, end, min, max;
        if (!GameData.isModalShow) {
            if (GameData.selectedLimitArray.length != 0) {
                GameData.isModalShow = true;
                popupWinGroup = this.add.group();
                limitGroup = this.add.group();
                worldGroup.add(popupWinGroup);
                popupWinGroup.add(limitGroup);
                modalBoxBg = this.add.button(0, 0, "modalBoxBg", null, true);
                modalBoxBg.useHandCursor = false;
                modalBoxBg.width = 750;
                modalBoxBg.height= 1334;
                popupWinGroup.addChild(modalBoxBg);
                limitBox = this.add.sprite(55, 500, "limitsBg");
                popupWinGroup.addChild(limitBox);
                closeBtn = this.add.button(limitBox.width - 50, 10, "closeBtn", this.closePopup, this);
                closeBtn.useHandCursor = true;
                limitBox.addChild(closeBtn);
                limitTitleText = createTextLbl(self, {
                    text: $.client.getLocalizedString("Please select limits", true).toUpperCase(),
                    x: 20,
                    y: 20,
                    font: "ProximaNova",
                    size: 24,
                    color: "#fff",
                    centered: false,
                    maxHeight: 50,
                    maxWidth: 300
                });
                limitBox.addChild(limitTitleText);
                limitBox.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Min bet", true).toUpperCase(),
                    x: 120,
                    y: 80,
                    font: "ProximaNova",
                    size: 22,
                    color: "#878787",
                    centered: false,
                    maxHeight: 50,
                    maxWidth: 120
                }));
                limitBox.addChild(createTextLbl(self, {
                    text: $.client.getLocalizedString("Max bet", true).toUpperCase(),
                    x: 400,
                    y: 80,
                    font: "ProximaNova",
                    size: 22,
                    color: "#878787",
                    centered: false,
                    maxHeight: 50,
                    maxWidth: 120
                }));
                start = (limitPage > 0) ? limitPage * perPage : 0;
                end = (GameData.selectedLimitArray.length < perPage * (limitPage + 1) ? GameData.selectedLimitArray.length : perPage * (limitPage + 1));
                limitGroup.removeAll(true);

                for (var i = start; i < end; i++) {
                    if (GameData.limitPlateId == i) {
                        limitBtn = self.add.button(limitBox.x + 50, limitBox.y + 130 + (70 * ii), "limitBtnBg", self.setLimit, self, 1, 1);
                    } else {
                        limitBtn = self.add.button(limitBox.x + 50, limitBox.y + 130 + (70 * ii), "limitBtnBg", self.setLimit, self, 1, 0);
                    }
                    ii++;
                    limitBtn.input.useHandCursor = true;
                    limitBtn.id = i;
                    min = parseFloat(GameData.selectedLimitArray[i].Bet.Min) % 1 == 0 ? parseFloat(GameData.selectedLimitArray[i].Bet.Min).toFixed(0) : GameData.selectedLimitArray[i].Bet.Min;
                    max = parseFloat(GameData.selectedLimitArray[i].Bet.Max) % 1 == 0 ? parseFloat(GameData.selectedLimitArray[i].Bet.Max).toFixed(0) : GameData.selectedLimitArray[i].Bet.Max;
                    var minLbl = limitBtn.addChild(self.add.text(110, 15, min, {
                        font: "24px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    minLbl.anchor.x = Math.round(minLbl.width * 0.5) / minLbl.width;
                    limitBtn.addChild(minLbl);
                    var maxLbl = limitBox.addChild(self.add.text(390, 15, max, {
                        font: "24px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    maxLbl.anchor.x = Math.round(maxLbl.width * 0.5) / maxLbl.width;
                    limitBtn.addChild(maxLbl);
                    limitGroup.addChild(limitBtn);
                    popupWinGroup.moveUp(limitGroup);
                }

                if ($.client.UserData.Features && $.client.UserData.Features.rules) {
                    var rulesBtn = this.add.button(475, 510, "btnBg", function () {
                        $.client.showRules();
                    }, this);
                    rulesBtn.height = 40;
                    limitGroup.add(rulesBtn);

                    rulesText = createTextLbl(self, {
                        text: $.client.getLocalizedString("Rules", true).toUpperCase(),
                        x: 550,
                        y: 519,
                        font: "ProximaNova",
                        size: 22,
                        color: "#fff",
                        centered: true,
                        maxHeight: 50,
                        maxWidth: 150
                    });
                    rulesText.anchor.x = Math.round(rulesText.width * 0.5) / rulesText.width;
                    limitGroup.add(rulesText);
                    rulesBtn.clicked = true;
                    rulesBtn.input.useHandCursor = true;
                }


            }
        }
    },
    setLimit: function (element) {
        if (limitGroup.children.length > 0) {
            limitGroup.forEach(function (item) {
                if (item.key === "limitBtnBg") {
                    item.loadTexture(item.key, 0);
                }
            });
            element.setFrames(1, 1, 1);
        }

        GameData.limitPlateId = element.id;
        this.validateChips();
        this.createChips();
        $.client.sendPost(JSON.stringify({
            type: "put_limits",
            limit: GameData.selectedLimitArray[GameData.limitPlateId]
        }), function (responce) {
        });
    },
    showHistory: function (element) {
        var self = this;
        var historyBox, modalBoxBg, closeBtn, historyTitleText, historyLabelResult, historyLabelWin;
        if (!GameData.isModalShow) {
            GameData.isModalShow = true;
            popupWinGroup = this.add.group();
            worldGroup.add(popupWinGroup);
            modalBoxBg = this.add.button(0, 0, "modalBoxBg", null, true);
            modalBoxBg.useHandCursor = false;
            modalBoxBg.width = 750;
            modalBoxBg.height = 1334;
            popupWinGroup.add(modalBoxBg);
            historyBox = this.add.sprite(205, 470, "historyBg");
            popupWinGroup.add(historyBox);
            closeBtn = this.add.button(287, 10, "closeBtn", this.closePopup, this);
            closeBtn.useHandCursor = true;
            historyBox.addChild(closeBtn);
            historyTitleText = createTextLbl(self, {
                text: $.client.getLocalizedString("History", true).toUpperCase(),
                x: 20,
                y: 20,
                font: "ProximaNova",
                size: 25,
                color: "#fff",
                centered: false,
                maxHeight: 30,
                maxWidth: 150
            });
            historyBox.addChild(historyTitleText);
            historyLabelResult = createTextLbl(self, {
                text: $.client.getLocalizedString("TEXT_RESULT", true).toUpperCase(),
                x: 60,
                y: 80,
                font: "ProximaNova",
                size: 22,
                color: "#878787",
                centered: false,
                maxHeight: 50,
                maxWidth: 120
            });
            historyBox.addChild(historyLabelResult);
            historyLabelWin = createTextLbl(self, {
                text: $.client.getLocalizedString("TEXT_WIN", true).toUpperCase(),
                x: 200,
                y: 80,
                font: "ProximaNova",
                size: 22,
                color: "#878787",
                centered: false,
                maxHeight: 50,
                maxWidth: 120
            });
            historyBox.addChild(historyLabelWin);

            function showRow(item, posX, posY) {
                var winnerText, betText, amount = 0;
                if (item) {
                    winnerText = self.add.text(posX, posY, item.winText, { font: "26px ProximaNova", fill: "#fff", align: "center" });
                    historyBox.addChild(winnerText);
                    amount = item.win % 1 == 0 ? parseFloat(item.win).toFixed(0) : parseFloat(item.win).toFixed(2);
                    amount = amount > 9999 ? kFormater(amount) : amount;
                    betText = self.add.text(posX + 140, posY, $.client.UserData.CurrencySign + amount, { font: "26px ProximaNova", fill: "#fff", align: "center" });
                    betText.anchor.x = Math.round(betText.width * 0.5) / betText.width;
                    historyBox.addChild(betText);
                }
            }

            var k = 0;
            if (GameData.historyArray.length > 0)
                for (var i = GameData.historyArray.length - 1; i >= GameData.historyArray.length - 3; i--) {
                    showRow(GameData.historyArray[i], 80, 142 + k * 70);
                    k++;
                }
        }
    },
    closePopup: function () {
        popupWinGroup.destroy();
        GameData.isModalShow = false;
    },
    showCashier: function (visible) {
        var self = this;
        if (visible) {
            self.buttons.cashierBtn.alpha = 1;
            self.buttons.cashierBtn.input.useHandCursor = true;
            self.buttons.cashierBtn.clicked = true;
        } else {
            self.buttons.cashierBtn.alpha = 0;
            self.buttons.cashierBtn.input.useHandCursor = false;
            self.buttons.cashierBtn.clicked = false;
        }
    },
    checkBetButtons: function () {
        var self = this;
        if (GameData.betAmount > 0) {
            self.buttons.deal.enable();
            self.buttons.clearAll.enable();
            self.buttons.undo.enable();
        } else {
            self.buttons.deal.disable();
            self.buttons.clearAll.disable();
            self.buttons.undo.disable();
        }
    },
    updateNick: function () {
        var self = this;
        GameData.userName = GameData.userName ? GameData.userName.toUpperCase().length < 25 ? GameData.userName.toUpperCase() : GameData.userName.toUpperCase().substr(0, 15) + "..." : "";
        if (typeof self.labels.userName.setText === "function") {
            self.labels.userName.setText(GameData.userName);
        }
    },
    setWinAmount: function (amount) {
        amount = amount > 9999 ? kFormater(amount) : amount;
        this.labels.winAmount.setText($.client.UserData.CurrencySign + amount);
    },
    updateUserInfoText: function (id, text, status) {
        if (id == undefined) {
            id = 0;
        }
        if (status == undefined || status.length == 0) {
            status = "lose";
        }
        if (text == undefined) {
            text = $.client.getLocalizedString("TEXT_BUST", true);
        }
        status = status.toLowerCase();
        if (status == "win") {
            this.labels.userHandStatus[id]["bg"].loadTexture("landStatusStake", 1);
        } else if (status == "blackjack") {
            this.labels.userHandStatus[id]["bg"].loadTexture("landStatusStake", 1);
        } else if (status == "push") {
            this.labels.userHandStatus[id]["bg"].loadTexture("landStatusStake", 2);
        } else {
            this.labels.userHandStatus[id]["bg"].loadTexture("landStatusStake", 0);
        }
        this.labels.userHandStatus[id]["bg"].x = GameData.userCards[id]["c1"].x;
        this.labels.userHandStatus[id]["bg"].y = GameData.userCards[id]["c1"].y + GameData.userCards[id]["c1"].height / 2;
        this.labels.userHandStatus[id]["text"].setText(text.toUpperCase());
        this.labels.userHandStatus[id]["text"].visible = true;
        this.labels.userHandStatus[id]["bg"].visible = true;
        removableGroup.bringToTop(this.labels.userHandStatus[id]["bg"]);
        removableGroup.bringToTop(this.labels.userHandStatus[id]["text"]);
        game.world.bringToTop(removableGroup);
        removableGroup.priorityID = 5;
        this.labels.userHandStatus[id]["bg"].priorityID = 5;
        this.labels.userHandStatus[id]["text"].priorityID = 5;
    },
    showHandState: function (data) {
        var self = this;
        var text;
        var status = data.state;
        if (!GameData.handsWin[data.betData.hand])
            GameData.handsWin[data.betData.hand] = 0;
        if (status == "win") {
            GameData.historyArray.push({ winText: $.client.getLocalizedString("TEXT_WIN", true), win: data.winAmount });
            GameData.winAmount += data.winAmount;
            GameData.winStateText = $.client.getLocalizedString("TEXT_WIN", true);
            GameData.handsWin[data.betData.hand] += data.winAmount;
            text = $.client.getLocalizedString("TEXT_WIN", true) + " " + $.client.UserData.CurrencySign + GameData.handsWin[data.betData.hand];
        } else if (status == "blackjack") {
            GameData.historyArray.push({ winText: $.client.getLocalizedString("TEXT_WIN", true), win: data.winAmount });
            GameData.winAmount += data.winAmount;
            GameData.winStateText = $.client.getLocalizedString("TEXT_WIN", true);
            GameData.handsWin[data.betData.hand] += data.winAmount;
            text = $.client.getLocalizedString("TEXT_WIN", true) + " " + $.client.UserData.CurrencySign + GameData.handsWin[data.betData.hand];

        } else if (status == "push") {
            text = $.client.getLocalizedString("TEXT_PUSH", true);
            GameData.historyArray.push({ winText: text, win: data.winAmount });
            GameData.winAmount += data.winAmount;
            if (!GameData.winStateText)
                GameData.winStateText = $.client.getLocalizedString("TEXT_PUSH", true);
        } else {
            text = $.client.getLocalizedString("TEXT_LOSE", true);
            GameData.historyArray.push({ winText: text, win: 0 });
            GameData.winAmount = 0;
        }
        setTimeout(function () {
            if (GameData.winAmount > 0) {
                var win = parseFloat(GameData.winAmount);
                win = win % 1 == 0 ? win : parseFloat(win).toFixed(2);
                win = win > 9999 ? kFormater(win) : win;
                text = GameData.winStateText + " " + $.client.UserData.CurrencySign + win;
                self.showMessage(text, 1, 3000);
            }
        }, 2000);
        self.setWinAmount(parseFloat(GameData.winAmount).toFixed(2));
        self.updateUserInfoText(data.betData.hand, text, status);
    }
};