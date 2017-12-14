var LandscapetMain = function(game){
};

LandscapetMain.prototype = {
    g_isMaxLimit:false,
    g_nick: "",
    g_statusBg:null,
    labels: {
        betAmount: {},
        userBalance: {},
        gameInfoMsg: {},
        userName: {},
        dealerMsgStatus:{},
        dealerTotal:[],
        userMsgStatus:[],
        userTotal:[],
        limitPlate:[]
    },
    buttons: {
        doubles: {},
        cashierBtn: {},
        split:{},
        stand:{},
        hit:{},
        confirm: {},
        undo: {},
        clearAll: {},
        repeat: {},
        deal:{},
        limit:{},
        history:{},
        insurance:{},
        newGame:{},
        confirmLimit:{},
        provably:{}
    },
    dealerCardPlace:{},
    chipCost:[],
    chips: {},
    tableCell:{},
    create: function() {
        var self = this;
        var bottomBetLabel, bottomBalansLabel;
        var gameData = {};
        var dealBtnText, standBtnText, hitBtnText, doublesBtnText, splitBtnText, insuranceBtnText, clearAllBtnText, clearAllBtnIcon,
            undoBtnText, undoBtnIcon, newGameBtnText, newGameBtnIcon, repeatBtnText, repeatBtnIcon;

        var filterTableItem, chip = {}, chipsAmount, totalDealerCard = 0,
            coordinates, pos, hitCounter = 1, hitCounter2 = 0, chipArr = [];

        selectedChipId = 0;
        tableItem = [
            {x:305, y:570, key:'landPlaceChips', type:'1', angle: 9},
            {x:455, y:600, key:'landPlaceChips', type:'2', angle: 6},
            {x:605, y:620, key:'landPlaceChips', type:'3', angle: 3},
            {x:755, y:630, key:'landPlaceChips', type:'4', angle: 0},
            {x:905, y:620, key:'landPlaceChips', type:'5', angle: -3},
            {x:1055, y:600, key:'landPlaceChips', type:'6', angle: -6},
            {x:1205, y:570, key:'landPlaceChips', type:'7', angle: -9},
        ];

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

        gameFrame = this.add.sprite(0, 0, 'landGameFrame');
        frameGroup.add(gameFrame);
        gameFrameH = gameFrame.height;
        gameFrameW = gameFrame.width;
        this.labels.userName = this.add.text(40, gameFrameH-45, '', {
            font: "26px ProximaNova",
            fill: "#909090"
        });
        footerGroup.add(this.labels.userName);

        bottomBetLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_BET", true).toUpperCase(),
            x: gameFrameW - 530,
            y: gameFrameH - 50,
            font: "ProximaNova",
            size: 26,
            color: "#909090",
            centered:true,
            wordWrapWidth:70,
            maxWidth:70

        });
        footerGroup.add(bottomBetLabel);

        self.labels.betAmount = createTextLbl(self, {
            text: '0',
            x: bottomBetLabel.x + bottomBetLabel.width + 15,
            y: gameFrameH - 51,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: true,
            maxHeight: 22,
            maxWidth: 140 - bottomBetLabel.width
        });
        footerGroup.add(this.labels.betAmount);
        bottomBalansLabel = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_BALANCE", true).toUpperCase(),
            x: gameFrameW - 320,
            y: gameFrameH - 50,
            font: "ProximaNova",
            size: 26,
            color: "#909090",
            centered: false,
            maxHeight: 50,
            maxWidth: 100
        });
        footerGroup.add(bottomBalansLabel);

        this.labels.userBalance = createTextLbl(self, {
            text: $.client.UserData.CurrencySign + '0',
            x: bottomBalansLabel.x + bottomBalansLabel.width + 15,
            y: gameFrameH - 50,
            font: "ProximaNova",
            size: 26,
            color: "#e4a345",
            centered: false,
            maxHeight: 50,
            maxWidth: 240 - bottomBalansLabel.width - 15
        });

        footerGroup.add(this.labels.userBalance);

        this.buttons.provably = this.add.button(gameFrame.x + 20, gameFrame.y + 30, 'btnBg', function () {
            $.client.showProvablyFair();
        }, this);

        this.buttons.provably.input.useHandCursor = true;

        this.buttons.provably.text = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_PROVABLY_FAIR", true),
            x: self.buttons.provably.x + 10,
            y: self.buttons.provably.y + 10,
            font: "ProximaNova",
            size: 24,
            color: "#fff",
            centered: false,
            maxHeight: 50,
            maxWidth: self.buttons.provably.width - 10
        });
        frameGroup.add(this.buttons.provably);
        this.buttons.cashierBtn = this.add.button(gameFrameW - 35, gameFrameH - 53, 'cashin', function () {
            $.client.cashier();
        }, this);
        this.buttons.cashierBtn.scale.set(0.7);
        this.buttons.cashierBtn.input.useHandCursor = true;
        this.buttons.cashierBtn.clicked = true;
        this.buttons.limit = this.add.button(418, gameFrameH - 71, 'bottomBtnBg', this.showLimits, this, 1, 0);
        this.buttons.limit.clicked = true;
        this.buttons.limit.input.useHandCursor = true;

        createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_LIMITS", true),
            x: self.buttons.limit.x + 30,
            y: self.buttons.limit.y + 25,
            font: "ProximaNova",
            size: 24,
            color: "#fff",
            centered: false,
            maxHeight: 50,
            maxWidth: self.buttons.limit.width - 10
        });

        footerGroup.add(this.buttons.limit);
        this.buttons.history = this.add.button(562, gameFrameH - 71, 'bottomBtnBg', this.showHistory, this, 1, 0);
        this.buttons.history.input.useHandCursor = true;
        this.buttons.history.clicked = true;
        createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_HISTORY", true),
            x: self.buttons.history.x + 30,
            y: self.buttons.history.y + 25,
            font: "ProximaNova",
            size: 24,
            color: "#fff",
            centered: false,
            maxHeight: 50,
            maxWidth: self.buttons.history.width - 10
        });
        footerGroup.add(this.buttons.history);
        this.buttons.undo = this.add.button(870, 845, 'btnBg', this.cancelLast, this, 1, 0);
        this.buttons.undo.input.useHandCursor = true;
        this.buttons.undo.clicked = true;
        this.buttons.undo.width = 180;
        undoBtnText = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_CANCEL_LAST_BET", true),
            x: 3,
            y: 15,
            font: "ProximaNova",
            size: 24,
            color: "#fff",
            centered: false,
            maxHeight: 50,
            maxWidth: 170
        });
        this.buttons.undo.addChild(undoBtnText);
        buttonStakeGroup.add(this.buttons.undo);

        this.buttons.clearAll = this.add.button(670, 845, 'btnBg', this.cancelAll, this, 1, 0);
        this.buttons.clearAll.input.useHandCursor = true;
        this.buttons.clearAll.clicked = true;
        this.buttons.clearAll.width = 180;
        clearAllBtnText = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_CANCEL_ALL_BET", true),
            x: 5,
            y: 15,
            font: "ProximaNova",
            size: 24,
            color: "#fff",
            centered: false,
            maxHeight: 50,
            maxWidth: 170
        });
        this.buttons.clearAll.addChild(clearAllBtnText);
        buttonStakeGroup.add(this.buttons.clearAll);

        this.buttons.deal = this.add.button(gameFrameW - 280, 50, 'landGameBtnBg', this.actionDeal, this, 6, 0);
        this.buttons.deal.input.useHandCursor = true;
        this.buttons.deal.clicked = false;
        dealBtnText = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_DEAL", true),
            x: 55,
            y: 15,
            font: "ProximaNova",
            size: 30,
            color: "#fff",
            centered: false,
            maxHeight: 50,
            maxWidth: self.buttons.deal.width -10
        });
        this.buttons.deal.addChild(dealBtnText);
        buttonStakeGroup.add(this.buttons.deal);
        this.dealerCardPlace = this.add.sprite(50, 240, 'dealerCardsPlace');
        this.dealerCardPlace.width = 173;

        this.buttons.stand = this.add.button(gameFrameW - 280, 50, 'landGameBtnBg', this.standBet, this, 7, 1);
        this.buttons.stand.input.useHandCursor = true;
        this.buttons.stand.clicked = true;

        standBtnText = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_STAND", true),
            x: 55,
            y: 15,
            font: "ProximaNova",
            size: 30,
            color: "#fff",
            centered: false,
            maxHeight: 50,
            maxWidth: self.buttons.stand.width -10
        });

        this.buttons.stand.addChild(standBtnText);
        buttonActionGroup.add(this.buttons.stand);

        this.buttons.hit = this.add.button(gameFrameW - 280, 130, 'landGameBtnBg', this.hitCard, this, 9, 3);
        this.buttons.hit.input.useHandCursor = true;
        this.buttons.hit.clicked = true;
        hitBtnText = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_HIT", true),
            x: 70,
            y: 15,
            font: "ProximaNova",
            size: 30,
            color: "#fff",
            centered: false,
            maxHeight: 50,
            maxWidth: self.buttons.hit.width -10
        });
        this.buttons.hit.addChild(hitBtnText);
        buttonActionGroup.add(this.buttons.hit);

        this.buttons.doubles = this.add.button(gameFrameW - 280, 210, 'landGameBtnBg', this.doubleBet, this, 8, 2);
        this.buttons.doubles.input.useHandCursor = true;
        this.buttons.doubles.clicked = true;
        this.buttons.doubles.visible = false;
        doublesBtnText = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_DOUBLE", true),
            x: 30,
            y: 15,
            font: "ProximaNova",
            size: 30,
            color: "#fff",
            centered: false,
            maxHeight: 50,
            maxWidth: self.buttons.doubles.width -10
        });
        this.buttons.doubles.addChild(doublesBtnText);
        buttonActionGroup.add(this.buttons.doubles);

        this.buttons.split = this.add.button(gameFrameW - 280, 290, 'landGameBtnBg', this.splitCards, this, 10, 4);
        this.buttons.split.input.useHandCursor = true;
        this.buttons.split.clicked = true;
        this.buttons.split.visible = false;

        splitBtnText = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_SPLIT", true),
            x: 60,
            y: 15,
            font: "ProximaNova",
            size: 30,
            color: "#fff",
            centered: false,
            maxHeight: 50,
            maxWidth: self.buttons.split.width -10
        });
        this.buttons.split.addChild(splitBtnText);
        buttonActionGroup.add(this.buttons.split);

        this.buttons.insurance = this.add.button(gameFrameW - 280, 370, 'landGameBtnBg', this.insuranceBet, this, 11, 5);
        this.buttons.insurance.input.useHandCursor = true;
        this.buttons.insurance.clicked = true;
        this.buttons.insurance.visible = false;
        insuranceBtnText = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_INSURANCE", true),
            x: 15,
            y: 15,
            font: "ProximaNova",
            size: 30,
            color: "#fff",
            centered: false,
            maxHeight: 50,
            maxWidth: self.buttons.insurance.width -10
        });
        this.buttons.insurance.addChild(insuranceBtnText);
        buttonActionGroup.add(this.buttons.insurance);

        this.buttons.newGame = this.add.button(1170, 845, 'btnBg', this.newGame, this, 1, 0);
        this.buttons.newGame.input.useHandCursor = true;
        this.buttons.newGame.clicked = true;
        newGameBtnText = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_NEW_GAME", true),
            x: 15,
            y: 13,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: false,
            maxHeight: 50,
            maxWidth: self.buttons.newGame.width -10
        });

        this.buttons.newGame.addChild(newGameBtnText);
        buttonNewGameGroup.add(this.buttons.newGame);

        this.buttons.repeat = this.add.button(1350, 845, 'btnBg', this.repeatGame, this, 1, 0);
        this.buttons.repeat.input.useHandCursor = true;
        this.buttons.repeat.clicked = true;
        repeatBtnText = createTextLbl(self, {
            text: $.client.getLocalizedString("TEXT_REPEAT", true),
            x: 25,
            y: 13,
            font: "ProximaNova",
            size: 26,
            color: "#fff",
            centered: false,
            maxHeight: 50,
            maxWidth: self.buttons.repeat.width -10
        });
        this.buttons.repeat.addChild(repeatBtnText);
        buttonNewGameGroup.add(this.buttons.repeat);
        this.g_nick =  this.g_nick ? this.g_nick.toUpperCase().length < 15 ? this.g_nick.toUpperCase() : this.g_nick.toUpperCase().substr(0, 15) + '...' : "";
        this.labels.userName.setText(self.g_nick);
        this.updateMoneyInfo();

        for (var i = 0; i < tableItem.length; i++) {
            this.tableCell[i] = frameGroup.create(tableItem[i].x, tableItem[i].y, tableItem[i].key);
            this.tableCell[i].id = i;
            this.tableCell[i].type = tableItem[i].type;
            this.tableCell[i].angle = tableItem[i].angle;
            this.tableCell[i].inputEnabled = true;
            this.tableCell[i].input.useHandCursor = true;
            this.tableCell[i].click = true;
            this.tableCell[i].alpha = 1;
            this.tableCell[i].events.onInputDown.add(this.addChip, this);
            this.tableCell[i].debug = true;
        }
        frameGroup.add(selectedChipsGroup);

        this.g_statusBg = this.add.sprite(10, gameFrameH - 145, 'statusBg', 2);
        this.g_statusBg.width = 540;
        this.g_statusBg.visible = false;
        footerGroup.add(this.g_statusBg);

        this.labels.gameInfoMsg = this.add.text(this.g_statusBg.x+50, this.g_statusBg.y+10, '',{
            font: "30px ProximaNova",
            fill:'#ffffff',
            textAlign: "justify"
        });
        footerGroup.add(this.labels.gameInfoMsg);

        window.addEventListener('resize', function () {
            self.changeGameSize();
        });
        self.changeGameSize();
        self.fullProgress();
        gameData.type = 'get_data';
        $.client.sendPost(JSON.stringify(gameData),
            function (msg) {
                console.debug('msg', msg);
                var firstDealerCard, coordinates, userCards, userTotal = 0, position, pos, ii = 0, betText = '', betTextArr = [];
                var gData = [], count = 1;
                var i, b, p, key, selectedLimit, selectedLimitLen =0, selectedLimitArrayLen = 0;
                Global.selectedLimitArray = Boolean(msg.ResponseData) ? msg.ResponseData.limits : {};
                selectedLimit = msg.ResponseData.selectedLimit;
                selectedLimitArrayLen = Global.selectedLimitArray.length;
                if( selectedLimitArrayLen > 0){
                    selectedLimitLen = Object.keys(selectedLimit).length;
                    for(i = 0; i< selectedLimitArrayLen; i++) {
                        Global.selectedLimitArray[i]['Bet']['Min'] = parseFloat(Global.selectedLimitArray[i]['Bet']['Min'].replace(",", "."));
                        Global.selectedLimitArray[i]['Bet']['Max'] = parseFloat(Global.selectedLimitArray[i]['Bet']['Max'].replace(",", "."));
                        if(selectedLimitLen > 0 && Global.selectedLimitArray[i]['Id'] == selectedLimit['Id']){
                            Global.limitPlateId = i;
                        }
                    }
                }

                self.validateChips();
                self.createChips();
                gData = msg.ResponseData.game.slice(0);
                if(gData.length > 0){
                    selectedChipsGroup.removeAll(true);
                    removableGroup.removeAll(true);
                    Global.bettingChipArray =  [];
                    Global.betAmount = 0;
                    self.resetValues();
                    for(i = 0; i < gData.length; i++){
                        if(gData[i]['type'] == 'dealer'){
                            firstDealerCard =  self.getCards(gData[i].cards);
                            Global.dealerCards[0] = removableGroup.create(self.dealerCardPlace.x+5, self.dealerCardPlace.y+5, 'cards', firstDealerCard);
                            Global.dealerCards['total_' + 0] = cardsValues[firstDealerCard];
                            Global.dealerCards[1] = removableGroup.create(self.dealerCardPlace.x+86, self.dealerCardPlace.y+5, 'cards', 54);
                            self.labels.dealerTotal = self.add.text(self.dealerCardPlace.x+190, self.dealerCardPlace.y+110, '', {
                                font: "bold 24px ProximaNova",
                                fill: "#ffffff"
                            });
                            removableGroup.addChild(self.labels.dealerTotal);
                        } else if(gData[i]['type'] == 'bet'){
                            self.drawChip({id: gData[i]['id'], value: gData[i]['value'], pos: gData[i]['pos']}, true);
                        } else if(gData[i]['type'] == 'user'){
                            userCards = gData[i]['cards'].split(',');
                            position = parseInt(gData[i]['pos'], 10);
                            pos = parseFloat(gData[i]['pos']);
                            if( Global.activedPosChips.indexOf(position) === -1){
                                Global.activedPosChips.push(position);
                            }
                            coordinates = self.getCoordinates(position);
                            if(userCards.length >0){
                                count = 1;
                                userTotal = 0;
                                if(gData[i]['isSplit'] && Global.activedPosChips.indexOf(pos) !==-1){
                                    Global.splitPosition.push(ii);
                                }

                                ii++;
                                for (b = 0; b < userCards.length; b++) {
                                    if(pos%1 === 0){
                                        Global.userCards[pos + '_c'+count] = removableGroup.create(coordinates.x - (b * 15), coordinates.y-130 - (b * 10) , 'cards', self.getCards(userCards[b]));
                                    }else {
                                        Global.userCards[pos + '_c'+count] = removableGroup.create(coordinates.x - (b * 15), coordinates.y-80 - ( b * 10), 'cards', self.getCards(userCards[b]));
                                    }
                                    if((userTotal + cardsValues[self.getCards(userCards[b])]) > 21 &&  cardsValues[self.getCards(userCards[b])] == 11){
                                        userTotal = userTotal + 1;
                                    }else{
                                        userTotal = userTotal + cardsValues[self.getCards(userCards[b])];
                                    }
                                    if( b == (userCards.length - 1)){
                                        Global.userCards['total_cards_'+ pos] = count;
                                        Global.userCards['total_'+ pos] = userTotal;
                                        Global.userCards['point1_'+ pos] = cardsValues[self.getCards(userCards[0])];
                                        Global.userCards['point2_'+ pos] = cardsValues[self.getCards(userCards[1])];
                                        Global.userCards['insurance_'+ pos] = gData[i]['insurance'];

                                        self.labels.userTotal[pos] = self.add.text(Global.userCards[pos + '_c1'].x+90, Global.userCards[pos + '_c1'].y+10, userTotal, {
                                            font: "bold 18px ProximaNova",
                                            fill: "#ffffff"
                                        });
                                        self.labels.userMsgStatus[pos+'_bg'] = self.add.sprite(
                                            Global.userCards[pos + '_c1'].x-10,
                                            Global.userCards[pos + '_c1'].y,
                                            'statusStake',0);

                                            self.labels.userMsgStatus[pos+'_text'] = self.add.text(10, 6, '',{
                                            font: "22px ProximaNova",
                                            fill: "#ffffff"
                                        });
                                        self.labels.userMsgStatus[pos+'_bg'].addChild(self.labels.userMsgStatus[pos+'_text']);
                                        self.labels.userMsgStatus[pos+'_bg'].visible = false;
                                        removableGroup.addChild(self.labels.userTotal[pos]);
                                        removableGroup.addChild(self.labels.userMsgStatus[pos+'_bg']);
                                    }
                                    count++;
                                }
                            }
                        }
                    }
                    for(i = 0; i < gData.length; i++){
                        if(gData[i]['type'] == 'user'){
                            position = parseInt(gData[i]['pos'], 10);
                            pos = parseFloat(gData[i]['pos']);
                            if(gData[i]['isSplit']){
                                for(key in Global.bettingChipArray){
                                    if(Global.bettingChipArray.hasOwnProperty(key)){
                                        betText = Global.bettingChipArray[key]['chip']['chipText'];
                                        if(Global.bettingChipArray[key]['type'] == position){
                                            if(gData[i].hasOwnProperty('stack')){
                                                betTextArr = betText.text.split('+');
                                                if(pos%1 === 0){
                                                    if(betTextArr[0] == ""){
                                                       betText.setText(gData[i].stack + '+');
                                                    } else{
                                                        betText.setText(gData[i].stack + '+' + betTextArr[1]);
                                                    }
                                                } else{
                                                    if(betTextArr[0] == ""){
                                                       betText.setText('+' + gData[i].stack);
                                                    } else{
                                                        betText.setText(betTextArr[0] + '+' + gData[i].stack);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        } else if(gData[i]['type'] == 'status'){
                            buttonStakeGroup.visible = false;
                            buttonActionGroup.visible = false;
                            chipsGroup.visible = false;
                            pos = Global.activedPosChips[parseInt(gData[i]['idx'], 10)];
                            if(gData[i]['status'] == 'bet'){
                                chipsGroup.visible = true;
                                buttonStakeGroup.visible = true;
                            } else if(gData[i]['status'] == 'deal' || gData[i]['status'] == 'split' || gData[i]['status'] == 'hit' || gData[i]['status'] == 'double' || gData[i]['status'] == 'insurance'){
                                if(gData[i]['status'] == 'deal'){
                                    self.buttons.stand.clicked = true;
                                    buttonActionGroup.visible = true;
                                }

                                if( gData[i]['idx']%1 !== 0){
                                    pos +=0.2;
                                }

                                for (p = 0, tI = tableItem.length; p < tI ; p++) {
                                    self.tableCell[p].inputEnabled = false;
                                }

                                Global.counter = parseInt(gData[i]['idx'], 10);
                                buttonActionGroup.visible = true;
                                if(Global.userCards[pos + '_c1']){
                                    Global.pointer = removableGroup.create(
                                        Global.userCards[pos + '_c1'].x+90,
                                        Global.userCards[pos + '_c1'].y+40,
                                        'pointer'
                                    );
                                }
                                if( gData[i]['idx']%1 === 0){
                                    Global.splitPositionItem = 0;
                                }else{
                                    Global.splitPositionItem = 1;
                                }
                                self.lightActivePosionChip(pos);

                                if( (Global.splitPosition.indexOf(Global.counter) == -1) && (Global.userCards['point1_' + pos] == Global.userCards['point2_' + pos])){
                                   self.buttons.split.visible = true;
                                }else{
                                    self.buttons.split.visible = false;
                                }

                                if(Global.userCards['total_' + pos] == 21){
                                    self.standBet(null, true);
                                }

                                if(Global.userCards['total_' + pos] == 10 || Global.userCards['total_' + pos]==11){
                                    self.buttons.doubles.visible = true;
                                }else{
                                    self.buttons.doubles.visible = false;
                                }

                                if (Global.dealerCards['total_' + 0] == 11 && Global.userCards['insurance_'+ pos] <= 0 ){
                                    self.buttons.insurance.visible = true;
                                }else{
                                    self.buttons.insurance.visible = false;
                                }
                            }
                        }
                    }
                }
                //console.log('Global', Global);
            }, function(e){
                console.log(e);
            }
        );
    },
    changeGameSize: function() {
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
    isEmptyObj: function  (obj) {
        for (var k in obj)
            if (obj.hasOwnProperty(k))
                return false;
        return true;
    },
    fullProgress: function(){
        $.client.setProgressBarPercent(100);
    },
    getRandomInt: function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    roundFloat: function(value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    },
    createChips: function(){
        var self = this;
        var limitMin, chipsEl, chipText;
        chipsGroup.removeAll(true);
        this.chipCost = [];
        if(!this.isEmptyObj(Global.selectedLimitArray)){
            limitMin = parseFloat(Global.selectedLimitArray[Global.limitPlateId]['Bet']['Min']);
            if(chips_cost.length > 0){
                for(var a = 0; a < chips_cost.length; a++){
                    if(chips_cost[a] >= limitMin){
                        this.chipCost.push(chips_cost[a]);
                    }
                }
            }

            if(this.chipCost.length > 0){
                for (var a = 0; a < this.chipCost.length; a++) {
                    if (a == selectedChipId || a == 0) {
                        chipsEl = chipsGroup.create(gameFrameW - 527 + (a * 84),  820, 'chips', a + 6);
                        selectedChip = {id: a, value: this.chipCost[a]};
                    } else {
                        chipsEl = chipsGroup.create(gameFrameW - 527 + (a * 84), 820, 'chips', a);
                    }
                    chipsEl.posY = chipsEl.y;
                    chipsEl.chipValue = this.chipCost[a];
                    chipsEl.id = a;
                    chipsEl.inputEnabled = true;
                    chipsEl.input.useHandCursor = true;
                    chipsEl.events.onInputDown.add(this.changeChips, this);
                    chipText = this.add.text(42, 28, this.chipCost[a], {
                        font: "26px ProximaNova",
                        fill: "#fff"
                    });
                    chipText.anchor.x = Math.round(chipText.width * 0.5) / chipText.width;
                    chipsEl.addChild(chipText);
                }
            }
        }
    },
    changeChips: function (element) {
        var self = this;
        selectedChipId = element.id;
        chipsGroup.forEach(function (item) {
            if (item.key == "chips"){
                if (item.id == selectedChipId) {
                    item.y = item.posY - 10;
                    item.loadTexture(item.key, item.id + 6);
                    if(item.hasOwnProperty('chipValue') && chips_cost.indexOf(item.chipValue) !== -1){
                        selectedChip = {id: chips_cost.indexOf(item.chipValue), value: item.chipValue};
                    }else{
                    selectedChip = {id: selectedChipId, value: chips_cost[selectedChipId]};
                    }
                } else {
                    item.loadTexture(item.key, item.id);
                    item.y = item.posY;
                }
            }
        });
    },
    validateChips: function(){
        var limitMin, chipValue = 0;
        var self = this, prevDissabled;
        if(!this.isEmptyObj(Global.selectedLimitArray)){
            limitMin = parseFloat(Global.selectedLimitArray[Global.limitPlateId]['Bet']['Min']);
            chipsGroup.forEach(function (item) {
                if (item.key == "chips"){
                    chipValue = parseFloat(item.chipValue);
                    if(limitMin > chipValue){
                        item.tint = 0x808080;
                        item.inputEnabled = false;
                        item.input.useHandCursor = false;
                        prevDissabled = true;
                    }else{
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
    getAmountDeb: function(){
         return chips_cost[selectedChipId];
    },
    drawChip: function(par, sent){
        var self = this;
        var chip = {}, chipsAmount, text = '';
        var chipId, chipValue, chipType, chipCoordinates;
        chipId = par['id'] || 0;
        chipValue = par['value'] || 0;
        chipType = parseInt(par['pos'], 10);
        chipCoordinates = this.getCoordinates(chipType);
        sent = (sent !== undefined) ? true : false;
        chipsAmount = chipValue;
        chipsAmount = chipsAmount % 1 == 0 ? chipsAmount : parseFloat(chipsAmount);
        if(Global.bettingChipArray.length > 0){
            for (var i = 0; i < Global.bettingChipArray.length; i++) {
                if (Global.bettingChipArray[i].type == chipType) {
                    chipsAmount += Global.bettingChipArray[i].value;
                }
            }
        }
        chip.chipClone = this.add.graphics(chipCoordinates.x + 20, chipCoordinates.y + 30, selectedChipsGroup);
        chip.active_sprite = this.add.sprite(0, 0, "chips", selectedChipId + 6);
        chip.active_sprite.width = 65;
        chip.active_sprite.height = 65;
        chip.chipClone.addChild(chip.active_sprite);

        chip.chipText = this.add.text(31, 20, '0', {
            font: "bold 22px ProximaNova",
            fill: "#ffffff",
            wordWrap: true,
            align: "center"
        });
        chip.chipText.anchor.x = (Math.round(chip.chipText.width * 0.5) / chip.chipText.width) - 0.1;
        chip.chipClone.addChild(chip.chipText);
        chip.chipText.setText(chipsAmount%1==0?chipsAmount:self.roundFloat(chipsAmount, 2));

        Global.bettingChipArray.push({
            id: chipId,
            value: chipValue,
            total: chipsAmount,
            type: chipType,
            chip: chip,
            sum: '0',
            sent: sent
        });
        Global.betAmount += chipValue;
        Global.gameBalance -= chipValue;
        this.updateBetAmount();
        this.updateMoneyInfo();
        if(parseFloat(Global.selectedLimitArray[Global.limitPlateId]['Bet']['Min']) <= chipsAmount){
            this.buttons.deal.clicked = true;
        }else{
            text =  $.client.getLocalizedString('TEXT_MIN_BET', true) + $.client.UserData.CurrencySign + Global.selectedLimitArray[Global.limitPlateId]['Bet']['Min'];
            this.buttons.deal.clicked = false;
        }
    },
    addChip:function(element){
        var self = this;
        var event = $.extend(true, {}, element);
        var chip = {}, chipsAmount, text = '';
        this.updateGameInfo(text);
        if(!this.isEmptyObj(Global.selectedLimitArray)){
            Global.selectedLimitArray[Global.limitPlateId]['Bet']['Min'] = parseFloat(Global.selectedLimitArray[Global.limitPlateId]['Bet']['Min']);
            Global.selectedLimitArray[Global.limitPlateId]['Bet']['Max'] = parseFloat(Global.selectedLimitArray[Global.limitPlateId]['Bet']['Max']);
            if(Global.gameBalance > 0  || Global.selectedLimitArray[Global.limitPlateId]['Bet']['Min'] >= Global.gameBalance){
                chipsAmount = selectedChip.value;
                chipsAmount = chipsAmount % 1 == 0 ? chipsAmount : parseFloat(chipsAmount);
                if(Global.bettingChipArray.length > 0){
                    for (var i = 0; i < Global.bettingChipArray.length; i++) {
                        if (Global.bettingChipArray[i].type == element.type) {
                            chipsAmount += Global.bettingChipArray[i].value;
                        }
                    }
                }

                if(Global.bettingChipArray.length > 0 && chipsAmount > Global.selectedLimitArray[Global.limitPlateId]['Bet']['Max'] ){
                    element.click = false;
                }else{
                    element.click = true;
                }
                if (Global.selectedLimitArray[Global.limitPlateId]['Bet']['Max'] >= selectedChip.value && element.click){
                    chip.chipClone = this.add.graphics(element.x + element._frame.width / 2 - 30, element.y + element._frame.height / 2 - 30, selectedChipsGroup);
                    chip.active_sprite = this.add.sprite(0, 0, "chips", selectedChipId + 6);
                    chip.active_sprite.width = 65;
                    chip.active_sprite.height = 65;
                    chip.chipClone.addChild(chip.active_sprite);

                    chip.chipText = this.add.text(31, 20, selectedChip.value%1==0?selectedChip.value:self.roundFloat(selectedChip.value,2), {
                        font: "bold 22px ProximaNova",
                        fill: "#ffffff",
                        wordWrap: true,
                        align: "center"
                    });
                    chip.chipText.anchor.x = (Math.round(chip.chipText.width * 0.5) / chip.chipText.width) - 0.1;
                    chip.chipClone.addChild(chip.chipText);
                    chip.chipText.setText('');
                    chip.chipText.setText(chipsAmount%1==0?chipsAmount:self.roundFloat(chipsAmount, 2));

                    Global.bettingChipArray.push({
                        id: selectedChip.id,
                        value: selectedChip.value,
                        total: chipsAmount,
                        type: event.type,
                        chip: chip,
                        sum: '0'
                    });

                    Global.betAmount += selectedChip.value;
                    Global.gameBalance -= selectedChip.value;
                    this.updateBetAmount();
                    this.updateMoneyInfo();
                    chipsAmount = this.roundFloat(chipsAmount, 2);
                    this.confirmBet();

                    if(Global.selectedLimitArray[Global.limitPlateId]['Bet']['Min'] <= chipsAmount){
                        this.buttons.deal.clicked = true;
                    }else{
                        text =  $.client.getLocalizedString('TEXT_MIN_BET', true) + $.client.UserData.CurrencySign + Global.selectedLimitArray[Global.limitPlateId]['Bet']['Min'];
                        this.buttons.deal.clicked = false;
                    }
                }else{
                    text =  $.client.getLocalizedString('TEXT_MAX_BET', true) + $.client.UserData.CurrencySign + Global.selectedLimitArray[Global.limitPlateId]['Bet']['Max'];
                }
            }else{
                text = $.client.getLocalizedString('TEXT_ERROR_NO_MONEY_MSG', true);
            }
        }else{
            text = $.client.getLocalizedString('TEXT_LIMITS_ERROR', true);
        }
        this.updateGameInfo(text);
    },
    confirmBet:function(element){
        var self = this;
        var bets = [], stake = {}, isSubmiting = false;
        if (!isSubmiting) {
            var notSentChipsArray = $.grep(Global.bettingChipArray, function(n, i) {
                return (!n.sent);
            });
            if(notSentChipsArray.length > 0){
                for(var i=0; i < notSentChipsArray.length; i++){
                    bets.push({
                        pos: notSentChipsArray[i].type,
                        amount: notSentChipsArray[i].value,
                        id: notSentChipsArray[i].id
                    });
                }
            }
            isSubmiting = true;
            stake.bets = bets;
            stake.type = "bet";
            $.client.sendPost(JSON.stringify(stake), function(msg) {
                console.log('bet_msg', msg);
                var check = false, idx;
                if(msg.ResponseData.betData.length > 0){
                    for (var i = 0; i < msg.ResponseData.betData.length; i++) {
                        check = false;
                        for(var j = 0; j < Global.bettingChipArray.length; j++){
                            if(msg.ResponseData.betData[i].pos == Global.bettingChipArray[j].type && msg.ResponseData.betData[i].amount ==  Global.bettingChipArray[j].value){
                                check = true;
                                idx = j;
                            }
                        }
                        if (check){
                            Global.bettingChipArray[idx].sent = true;
                            Global.stack.push({
                                pos: msg.ResponseData.betData[i].pos,
                                amount: msg.ResponseData.betData[i].amount,
                                id: msg.ResponseData.betData[i]['id']
                            });
                        }
                    };
                }
            }, function(err) {
                isSubmiting = false;
                console.log(err);
            });
        } else {
            setTimeout(function(){
                self.confirmBet();
            },100);
        }
    },
    cancelLast: function(bet){
        var self = this;
        var destroyChip, lastChip, text, cancelBet = {};
        if (Global.bettingChipArray.length > 0) {
            lastChip = Global.bettingChipArray.pop();
            destroyChip = jQuery.extend(true, {}, lastChip);
            delete(destroyChip['chip']);
            cancelBet.type = "cancel_last";
            cancelBet.bet = destroyChip;
            $.client.sendPost(JSON.stringify(cancelBet), function(msg) {
                if(msg.ResponseData.success){
                    self.clearBets(lastChip);
                }else{
                    self.updateGameInfo($.client.getLocalizedString('TEXT_SOMETHING_WRONG', true));
                }
            }, function(err) {
                isSubmiting = false;
                console.log(err);
            });
        }
    },
    cancelAll: function(all){
        var destroyChips, lastChip, cancelBets = {};
        var self = this;
        cancelBets.type = "cancel_all";
        $.client.sendPost(JSON.stringify(cancelBets), function(msg) {
            if(msg.ResponseData.success){
                destroyChips = Global.bettingChipArray;
                if(destroyChips.length > 0){
                    for (var i = destroyChips.length - 1; i >= 0; i--) {
                        lastChip = destroyChips.pop();
                        self.clearBets(lastChip);
                    }
                }
            }else{
                self.updateGameInfo($.client.getLocalizedString('TEXT_SOMETHING_WRONG', true));
            }

        }, function(err) {
            isSubmiting = false;
            console.log(err);
        });
    },

    clearBets:function(bet){
        var destroyChip, chip, text;
        destroyChip = bet;
        if(destroyChip){
            chip = destroyChip.chip;
            if (Global.betAmount > 0) {
                Global.betAmount -= destroyChip.value;
                Global.gameBalance += destroyChip.value;
                this.updateBetAmount();
                this.updateMoneyInfo();
            }
            if(chip){
                chip.chipClone.destroy();
            }
            if(Global.bettingChipArray.length > 0){
                for(var i=0; i < Global.bettingChipArray.length; i++){
                    Global.bettingChipArray[i].total = this.roundFloat(Global.bettingChipArray[i].total, 2);
                    if(Global.bettingChipArray[i].total >= Global.selectedLimitArray[Global.limitPlateId]['Bet']['Min']){
                        this.buttons.deal.clicked = true;
                        text = '';
                    }else{
                        text =  $.client.getLocalizedString('TEXT_MIN_BET', true) + $.client.UserData.CurrencySign + Global.selectedLimitArray[Global.limitPlateId]['Bet']['Min'];
                        this.buttons.deal.clicked = false;
                    }
                }
                this.updateGameInfo(text);
            }
        }
    },

    actionDeal: function(element) {
            var self = this;
            var stake = {}, coordinates, firstIdx, secondIdx, total = 0, firstDealerCard, msgUserCards, pos;
            var cardsVideoCount = 0, count = 0, count2 = 0;

            function deal() {
                if (self.buttons.deal.clicked) {
                    self.buttons.deal.clicked = false;
                    if (Global.bettingChipArray.length > 0) {
                        Global.gameRound = 'deal';
                        stake.type = "deal";
                        $.client.sendPost(JSON.stringify(stake),
                            function(msg) {
                                var c, p, i, tI, mUC, timerVideoOfCards;
                                console.debug('deal_msg', msg);
                                if (msg.ResponseData.success) {
                                    msgUserCards = msg.ResponseData.userCards;
                                    buttonStakeGroup.visible = false;
                                    chipsGroup.visible = false;
                                    self.buttons.stand.clicked = true;
                                    for (p = 0, tI = tableItem.length; p < tI; p++) {
                                        self.tableCell[p].inputEnabled = false;
                                    }

                                    for (i = 0, mUC = msgUserCards.length; i <mUC; i++) {
                                        pos = msgUserCards[i].pos;
                                        Global.activedPosChips.push(pos);
                                        coordinates = self.getCoordinates(pos);
                                        Global.userCards['position_' + pos] = pos;
                                        firstIdx = self.getCards(msgUserCards[i].first);
                                        secondIdx = self.getCards(msgUserCards[i].second);
                                        if ((cardsValues[firstIdx] + cardsValues[secondIdx] > 21) && cardsValues[secondIdx] == 11) {
                                            total = (cardsValues[firstIdx] + cardsValues[secondIdx]) - 10;
                                        } else {
                                            total = cardsValues[firstIdx] + cardsValues[secondIdx];
                                        }

                                        Global.userCards['total_cards_' + pos] = 2;
                                        Global.userCards['total_' + pos] = total;
                                        Global.userCards['point1_' + pos] = cardsValues[firstIdx];
                                        Global.userCards['point2_' + pos] = cardsValues[secondIdx];
                                        Global.userCards['insurance_' + pos] = 0;

                                        Global.userCards[pos + '_c1'] = removableGroup.create(coordinates.x, coordinates.y - 130, 'cards', firstIdx);
                                        Global.userCards[pos + '_c1'].visible = false;
                                        Global.userCards[pos + '_c2'] = removableGroup.create(coordinates.x - 15, coordinates.y - 140, 'cards', secondIdx);
                                        Global.userCards[pos + '_c2'].visible = false;

                                        self.labels.userTotal[pos] = self.add.text(coordinates.x + 90, coordinates.y - 120, total, {
                                            font: "bold 18px ProximaNova",
                                            fill: "#ffffff"
                                        });
                                        self.labels.userTotal[pos].visible = false;
                                        self.labels.userMsgStatus[pos + '_bg'] = self.add.sprite(coordinates.x - 10, coordinates.y - 105, 'statusStake', 0);

                                        self.labels.userMsgStatus[pos + '_text'] = self.add.text(10, 6, '', {
                                            font: "22px ProximaNova",
                                            fill: "#ffffff"
                                        });
                                        self.labels.userMsgStatus[pos + '_bg'].addChild(self.labels.userMsgStatus[pos + '_text']);
                                        self.labels.userMsgStatus[pos + '_bg'].visible = false;
                                        removableGroup.addChild(self.labels.userTotal[pos]);
                                        removableGroup.addChild(self.labels.userMsgStatus[pos + '_bg']);
                                    }

                                    c = 0;
                                    timerVideoOfCards = msg.ResponseData.videoTimer;

                                    function timerVideo() {
                                        var sT, wait = 0.2;
                                        if (c == 0) {
                                        } else if (c == 1) {
                                            displayDealerCard();
                                        } else {
                                            displayUserCard();
                                        }
                                        c += 1;
                                        if (c < timerVideoOfCards.length + 1) {
                                            sT = setTimeout(function(){
                                                timerVideo();
                                            }, (timerVideoOfCards[c - 1] + wait) * 1000);
                                        } else {
                                            clearTimeout(sT);
                                            displayUserCard();
                                            displayElements();
                                        }
                                    }

                                    timerVideo();

                                    function displayDealerCard() {
                                        firstDealerCard = self.getCards(msg.ResponseData.dealerCard);
                                        Global.dealerCards[0] = removableGroup.create(self.dealerCardPlace.x + 5, self.dealerCardPlace.y + 5, 'cards', firstDealerCard);
                                        Global.dealerCards['total_' + 0] = cardsValues[firstDealerCard];
                                        Global.dealerCards[1] = removableGroup.create(self.dealerCardPlace.x + 86, self.dealerCardPlace.y + 5, 'cards', 54);
                                        self.labels.dealerTotal = self.add.text(self.dealerCardPlace.x + 190, self.dealerCardPlace.y + 110, '', {
                                            font: "bold 24px ProximaNova",
                                            fill: "#ffffff"
                                        });

                                        self.labels.dealerMsgStatus = self.add.text(430, 280, '', {
                                            font: "24px ProximaNova",
                                            fill: "#ffffff"
                                        });
                                        removableGroup.addChild(self.labels.dealerTotal);
                                        removableGroup.addChild(self.labels.dealerMsgStatus);
                                    }

                                    function displayUserCard() {
                                        var halfCardsVideo;
                                        halfCardsVideo = (timerVideoOfCards.length - 1) / 2;
                                        if ((cardsVideoCount >= halfCardsVideo) && cardsVideoCount != 0) {
                                            if (Global.userCards[Global.activedPosChips[count2] + '_c2']) {
                                                Global.userCards[Global.activedPosChips[count2] + '_c2'].visible = true;
                                                self.labels.userTotal[Global.activedPosChips[count2]].visible = true;
                                            }
                                            count2++;
                                        } else {
                                            if (Global.userCards[Global.activedPosChips[count] + '_c1']) {
                                                Global.userCards[Global.activedPosChips[count] + '_c1'].visible = true;
                                            }
                                            count++;
                                        }
                                        cardsVideoCount ++;
                                    }

                                    function displayElements() {
                                        pos = Global.activedPosChips[Global.counter];
                                        buttonActionGroup.visible = true;
                                        removableGroup.forEach(function(item) {
                                            if (item.key == 'landPlaceChips') {
                                                item.inputEnabled = false;
                                            }
                                        });

                                        if (Global.userCards[pos + '_c1']) {
                                            Global.pointer = removableGroup.create(
                                                Global.userCards[pos + '_c1'].x + 90,
                                                Global.userCards[pos + '_c1'].y + 50,
                                                'pointer'
                                            );
                                            self.lightActivePosionChip(pos);
                                        }

                                        if (Global.userCards['total_' + pos] == 21) {
                                            self.standBet(null, true);
                                        }
                                        if (Global.userCards['total_' + pos] == 10 || Global.userCards['total_' + pos] == 11) {
                                            self.buttons.doubles.visible = true;
                                        } else {
                                            self.buttons.doubles.visible = false;
                                        }

                                        if (Global.dealerCards['total_' + 0] == 11) {
                                            self.buttons.insurance.visible = true;
                                        }

                                        if (Global.userCards['point1_' + pos] == Global.userCards['point2_' + pos]) {
                                            self.buttons.split.visible = true;
                                        }
                                    }
                                } else {
                                    self.updateGameInfo($.client.getLocalizedString('TEXT_NOT_ACCEPTED_BET', true));
                                }

                            }, function(err) {
                                console.log(err);
                                buttonStakeGroup.visible = true;
                                chipsGroup.visible = true;
                            }
                        );
                    } else {
                        self.updateGameInfo($.client.getLocalizedString('TEXT_NO_CHIPS', true));
                    }
                }
            }
            isSubmiting = true;
        if ($.client.UserData.Features && $.client.UserData.Features.provably_fair) {
            $.client.sendSeed(function(responce) {
                if (responce.IsSuccess) {
                    deal();
                }
                isSubmiting = false;
            }, function(err) {
                console.log(err);
                isSubmiting = false;
            });
        } else {
            deal();
        }
    },

    splitCards: function(element){
        var self = this;
        var splite = {}, userCards=[], cardIdx, cardIdx2, tween, pos;
        var count = 0, cardsVideoCount = 0;
        if(element.clicked){
            element.clicked = false;
            buttonActionGroup.setAll('clicked', false);
            Global.gameRound = 'split';
            splite.type = 'split';
            splite.chipPos = Global.activedPosChips[Global.counter];
            $.client.sendPost(JSON.stringify(splite),
                function (msg) {
                    var objPropCards = [];
                    var c, timerVideoOfCards;
                    if(msg.ResponseData.success){
                        console.log('splitCards_msg', msg);
                        self.buttons.split.visible = false;
                        Global.splitPosition.push(Global.counter);
                        cardIdx = self.getCards(msg.ResponseData.card);
                        cardIdx2 = self.getCards(msg.ResponseData.card2);
                        pos = parseInt(Global.activedPosChips[Global.counter]);
                        objPropCards['total_cards_' +  pos] = 2;
                        objPropCards['total_' +  pos] = Global.userCards['point1_' + pos];
                        objPropCards['point1_' +  pos] = Global.userCards['point1_' + pos];
                        objPropCards['point2_' +  pos] = cardsValues[cardIdx];
                        objPropCards['position_' + pos] = Global.userCards['position_' + pos];
                        objPropCards['insurance_' + pos] = msg.ResponseData.insurance;

                        objPropCards['total_cards_' +  pos + '.2'] = 2;
                        objPropCards['total_' +  pos + '.2'] = Global.userCards['point2_' + pos];
                        objPropCards['point1_' +  pos + '.2'] = Global.userCards['point2_' + pos];
                        objPropCards['point2_' +  pos + '.2'] = cardsValues[cardIdx2];
                        objPropCards['position_' + pos + '.2'] = Global.userCards['position_' + pos];
                        objPropCards['insurance_' + pos + '.2'] = msg.ResponseData.insurance;

                        delete(Global.userCards['total_cards_' + pos]);
                        delete(Global.userCards['insurance_' + pos]);
                        delete(Global.userCards['point1_' + pos]);
                        delete(Global.userCards['point2_' + pos]);
                        delete(Global.userCards['total_' + pos]);
                        delete(Global.userCards['position_' + pos]);
                        $.extend( true, Global.userCards, objPropCards);

                        Global.userCards[pos + '.2' + '_c1'] = Global.userCards[pos + '_c2'];

                        Global.userCards[pos + '_c2'] = removableGroup.create(
                            Global.userCards[pos + '_c1'].x-15,
                            Global.userCards[pos + '_c1'].y-10,
                            'cards',
                            cardIdx
                        );
                        Global.userCards[pos + '_c2'].visible = false;
                        tween = self.add.tween(Global.userCards[pos + '.2' + '_c1']).to({
                            x: Global.userCards[pos + '_c1'].x,
                            y: Global.userCards[pos + '_c1'].y + 50
                            }, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, false
                        );
                        tween.onComplete.add(function(){
                            Global.userCards[pos + '.2' + '_c2'] = removableGroup.create(
                                Global.userCards[pos + '.2' + '_c1'].x-15,
                                Global.userCards[pos + '.2' + '_c1'].y-10,
                                'cards',
                                cardIdx2
                            );
                            Global.userCards[pos + '.2' + '_c2'].visible = false;
                        }, this);

                         c = 0;
                        timerVideoOfCards = msg.ResponseData.videoTimer;
                        function timerVideo(){
                            var wait = 0;
                            displaySplitCards();
                            c += 1;
                            if(c < timerVideoOfCards.length){
                                setTimeout(function(){
                                    timerVideo();
                                }, (timerVideoOfCards[c-1] + wait )*1000);
                            } else{
                                displayElements();
                            }
                        }

                        timerVideo();
                        function displaySplitCards(){
                            if(cardsVideoCount == 0){
                                Global.userCards[pos + '_c2'].visible = true;
                            } else{
                                Global.userCards[pos + '.2' + '_c2'].visible = true;
                            }
                            cardsVideoCount++;
                        }
                        function displayElements(){
                            if(( parseFloat(Global.userCards['total_' +  pos]) + cardsValues[cardIdx]) > 21 &&  cardsValues[cardIdx] == 11){
                                Global.userCards['total_' +  pos] += 1;
                            }else{
                                Global.userCards['total_' +  pos] += cardsValues[cardIdx];
                            }

                            self.labels.userTotal[pos].setText(Global.userCards['total_' + pos]);
                            if(( parseFloat(Global.userCards['total_' +  pos + '.2']) + cardsValues[cardIdx2]) > 21 &&  cardsValues[cardIdx2] == 11){
                                Global.userCards['total_' +  pos + '.2'] += 1;
                            }else{
                                Global.userCards['total_' +  pos + '.2'] += cardsValues[cardIdx2];
                            }

                            if(Global.userCards['total_' +  pos] == 10 || Global.userCards['total_' +  pos] == 11){
                                self.buttons.doubles.visible = true;
                            }else{
                                self.buttons.doubles.visible = false;
                            }
                            self.labels.userTotal[pos + '.2'] = self.add.text(
                                Global.userCards[pos + '.2_c2'].x+100,
                                Global.userCards[pos + '.2_c2'].y+80,
                                Global.userCards['total_' +  pos + '.2'], {
                                    font: "bold 18px ProximaNova",
                                    fill: "#ffffff"
                                }
                            );

                            self.labels.userMsgStatus[pos + 0.2 +'_bg'] = self.add.sprite(
                                Global.userCards[pos + '.2' + '_c2'].x+10,
                                Global.userCards[pos + '.2' + '_c2'].y+70,
                                'statusStake', 0);
                            self.labels.userMsgStatus[pos + 0.2 +'_bg'].visible = false;
                            self.labels.userMsgStatus[pos + 0.2 +'_text'] = self.add.text(10, 5, '',{
                                    font: "22px ProximaNova",
                                    fill: "#ffffff"
                                }
                            );
                            for(var key in Global.bettingChipArray){
                                if(Global.bettingChipArray.hasOwnProperty(key)){
                                    if(Global.bettingChipArray[key]['type'] == pos){
                                        Global.bettingChipArray[key]['chip']['chipText'].setText(self.roundFloat(msg.ResponseData.stack + msg.ResponseData.insurance, 2) + "x2");
                                    }
                                }
                            }
                            Global.betAmount += parseFloat(msg.ResponseData.stack);
                            Global.gameBalance = msg.ResponseData.balance;
                            self.updateBetAmount();
                            self.updateMoneyInfo();
                            removableGroup.addChild(self.labels.userTotal[pos + 0.2]);

                            self.labels.userMsgStatus[pos+0.2+'_bg'].addChild(self.labels.userMsgStatus[pos + 0.2 + '_text']);
                            removableGroup.addChild(self.labels.userMsgStatus[pos + 0.2+'_bg']);
                            buttonActionGroup.setAll('clicked', true);
                        }
                    }else{
                        self.updateGameInfo($.client.getLocalizedString('TEXT_SOMETHING_WRONG', true));
                    }

                }, function(e){
                    console.log(e);
                }
            );
        }
    },

    hitCard: function(element){
        var self = this;
        var hitCard = {}, cardIdx, text='', splitPosItem = 0, counter = 0, pos = 0, userTotal, labelsId;
        if(element.clicked){
            buttonActionGroup.setAll('clicked', false);
            Global.gameRound = 'hit';
            hitCard.type = "hit";
            hitCard.chipPos = Global.activedPosChips[Global.counter];
            if(Global.splitPosition.indexOf(Global.counter) !== -1){
                hitCard.isSplit = true;
                hitCard.splitPos = Global.splitPositionItem;
            }else{
                self.buttons.split.visible = false;
            }
            $.client.sendPost(JSON.stringify(hitCard),
                function (msg) {
                    var timerVideoOfCards, wait = 0, sT;
                    if(msg.ResponseData.success){
                        /*console.log('hit_msg', msg);*/
                        timerVideoOfCards = msg.ResponseData.videoTimer[0];
                        wait = 0.5;
                        sT = setTimeout(function(){
                            displayHitCard();
                        }, (timerVideoOfCards + wait) * 1000);
                        function displayHitCard(){
                            var nextCards = 3;
                            clearTimeout(sT);
                            wait = 0;
                            cardIdx = self.getCards(msg.ResponseData.card);
                            if(Global.splitPosition.indexOf(Global.counter) !== -1){
                                if(Global.splitPositionItem == 1){
                                    splitPosItem = 0.2;
                                }
                            }

                            pos = parseInt(Global.activedPosChips[Global.counter]) + splitPosItem;
                            userTotal = Global.userCards['total_'+ pos];
                            nextCards = Global.userCards['total_cards_' + pos] + 1;
                            Global.userCards[pos + '_c' + nextCards]  = removableGroup.create(
                                Global.userCards[pos + '_c' + Global.userCards['total_cards_' + pos]].x-15,
                                Global.userCards[pos + '_c' + Global.userCards['total_cards_' + pos]].y-10,
                                'cards',
                                cardIdx
                            );
                            Global.userCards['total_cards_' + pos] = nextCards;
                            if((userTotal + cardsValues[cardIdx]) > 21 &&  cardsValues[cardIdx] == 11){
                                userTotal = userTotal + 1;
                            }else{
                                userTotal = userTotal + cardsValues[cardIdx];
                            }

                            Global.userCards['total_' + pos] = userTotal;
                            self.labels.userTotal[pos].setText(userTotal);
                            self.buttons.insurance.visible = false;
                            self.buttons.doubles.visible = false;
                            if(userTotal == 21){
                                self.standBet(null, true);
                            }else if(userTotal > 21){
                                text = $.client.getLocalizedString('TEXT_BUST', true);
                                self.updateUserInfoText(pos, text);
                                self.standBet(null, true);
                            }
                            buttonActionGroup.setAll('clicked', true);
                        }
                } else{
                    self.updateGameInfo($.client.getLocalizedString('TEXT_SOMETHING_WRONG', true));
                }
            }, function(err){
                console.log(err);
            });
        }
    },

    doubleBet: function(element){
        var self = this;
        var doubleCard = {}, cardIdx, sum = 0, pos = 0, splitPosItem = 0, userTotal;
        Global.gameRound = 'double';
        doubleCard.type = 'double';
        doubleCard.chipPos = Global.activedPosChips[Global.counter];
        if(Global.splitPosition.indexOf(Global.counter) !== -1){
            doubleCard.isSplit = true;
            doubleCard.splitPos = Global.splitPositionItem;
        }
        self.buttons.split.visible = false;
        self.buttons.doubles.visible = false;
        if(element.clicked){
            $.client.sendPost(JSON.stringify(doubleCard),
            function (msg) {
                var timerVideoOfCards, wait=0, sT;
                if(msg.ResponseData.success){
                    console.debug('double_msg', msg);
                    wait = 0.5;
                    timerVideoOfCards = msg.ResponseData.videoTimer[0];
                    sT = setTimeout(function(){
                        displayDouble();
                    }, (timerVideoOfCards + wait) * 1000);

                    function displayDouble(){
                        var nextCards;
                        clearTimeout(sT);
                        cardIdx = self.getCards(msg.ResponseData.card);
                        if(Global.splitPosition.indexOf(Global.counter) !== -1){
                            if(Global.splitPositionItem == 1){
                                splitPosItem = 0.2;
                            }
                        }
                        pos = parseInt(Global.activedPosChips[Global.counter]) + splitPosItem;

                        nextCards = Global.userCards['total_cards_' + pos] + 1;
                        Global.userCards[pos + '_c' + nextCards]  = removableGroup.create(
                            Global.userCards[pos + '_c' + Global.userCards['total_cards_' + pos]].x-15,
                            Global.userCards[pos + '_c' + Global.userCards['total_cards_' + pos]].y-10,
                            'cards',
                            cardIdx
                        );
                        Global.userCards['total_'+ pos] += cardsValues[cardIdx];
                        userTotal = Global.userCards['total_'+ pos];
                        self.labels.userTotal[pos].setText(userTotal);

                        for(var key in Global.bettingChipArray){
                            if(Global.bettingChipArray.hasOwnProperty(key)){
                                if(Global.bettingChipArray[key]['type'] == pos){
                                    sum = (parseFloat(msg.ResponseData.stack) * 2) + parseFloat(msg.ResponseData.insurance);
                                    if(Global.splitPosition.indexOf(Global.counter) !== -1){
                                        if(Global.splitPositionItem == 0){
                                            sum = sum + '+' + msg.ResponseData.stack;
                                        }else if(Global.splitPositionItem == 1){
                                           sum = msg.ResponseData.prevVal + '+' + sum;
                                        }
                                    }
                                    Global.bettingChipArray[key]['sum'] = sum;
                                    Global.bettingChipArray[key]['chip']['chipText'].setText(sum);
                                }
                            }
                        }

                        Global.betAmount += parseFloat(msg.ResponseData.stack);
                        Global.gameBalance = msg.ResponseData.balance;
                        self.updateBetAmount();
                        self.updateMoneyInfo();
                        self.standBet(null, true);
                    }
                }else{
                    self.updateGameInfo($.client.getLocalizedString('TEXT_SOMETHING_WRONG', true));
                }

            }, function(err){
                console.log(err);
            });

        }
    },

    standBet: function(element, isAuto){
        var self = this;
        var userTotal, insurance = 0, pos, splitPosItem = 0, stand = {};
        if(isAuto === undefined){
            isAuto = false;
        }else if (typeof(isAuto) !== 'boolean'){
            isAuto = false;
        }
        if ((element && element.clicked) || Boolean(isAuto)){
            this.buttons.hit.clicked = true;
            if(Global.splitPosition.indexOf(Global.counter) !== -1){
                if(Global.splitPositionItem == 1){
                    splitPosItem = 0.2;
                }
            }
            pos = parseInt(Global.activedPosChips[Global.counter]) + splitPosItem;
            userTotal = Global.userCards['total_'+ pos];
            insurance = Global.userCards['insurance_'+ pos];
            if((Global.splitPosition.indexOf(Global.counter) !== -1 ) && Global.splitPositionItem == 0){
                Global.splitPositionItem++;
                stand.type = 'stand';
                stand.index = parseInt(Global.counter, 10) + 0.2;
                $.client.sendPost(JSON.stringify(stand),
                    function (msg) {
                    }, function(err){
                        console.log(err);
                    }
                );
                self.add.tween(Global.pointer).to({
                    x: Global.userCards[pos + '.2_c2'].x+90,
                    y: Global.userCards[pos + '.2_c2'].y+50
                    }, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, false
                );
                self.lightActivePosionChip(pos);
                if(userTotal == 10 || userTotal == 11){
                    self.buttons.doubles.visible = true;
                }else{
                    self.buttons.doubles.visible = false;
                }
                if (Global.dealerCards['total_' + 0] == 11 && insurance <= 0 ){
                    self.buttons.insurance.visible = true;
                }else{
                    self.buttons.insurance.visible = false;
                }
            }else if(Global.counter < (Global.activedPosChips.length - 1)){
                Global.counter +=1;
                Global.splitPositionItem = 0;
                pos = parseInt(Global.activedPosChips[Global.counter]);
                stand.type = 'stand';
                stand.index = parseInt(Global.counter, 10);
                $.client.sendPost(JSON.stringify(stand),
                    function (msg) {
                    }, function(err){
                        console.log(err);
                    }
                );
                self.add.tween(Global.pointer).to({
                    x:  Global.userCards[pos + '_c2'].x+90,
                    y:  Global.userCards[pos + '_c2'].y+50
                    }, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, false
                );
                self.lightActivePosionChip(pos);
                if( (Global.splitPosition.indexOf(Global.counter) == -1) && (Global.userCards['point1_' + pos] == Global.userCards['point2_' + pos])){
                   self.buttons.split.visible = true;
                }else{
                    self.buttons.split.visible = false;
                }
                if(Global.userCards['total_' + pos] == 21){
                    self.standBet(null, true);
                }
                if(Global.userCards['total_' + pos] == 10 || Global.userCards['total_' + pos]==11){
                    self.buttons.doubles.visible = true;
                }else{
                    self.buttons.doubles.visible = false;
                }
                if (Global.dealerCards['total_' + 0] == 11 && insurance <= 0 ){
                    self.buttons.insurance.visible = true;
                }else{
                    self.buttons.insurance.visible = false;
                }

            }else{
                self.showDealerCards();
            }
        }
    },

    insuranceBet: function(element){
        var self = this;
        var insurance = {}, sum = 0, pos = 0;
        if(element.clicked){
            Global.gameRound = 'insurance';
            insurance.type = 'insurance';
            insurance.chipPos = Global.activedPosChips[Global.counter];
            if(Global.splitPosition.indexOf(Global.counter) !== -1){
                insurance.isSplit = true;
                insurance.splitPos = Global.splitPositionItem;
            }
            $.client.sendPost(JSON.stringify(insurance),
                function (msg) {
                    if(msg.ResponseData.success){
                        console.log('insurance_msg', msg);
                        pos = parseInt(Global.activedPosChips[Global.counter]);
                        if(Global.splitPosition.indexOf(Global.counter) !== -1){
                            for(var key in Global.bettingChipArray){
                                if(Global.bettingChipArray.hasOwnProperty(key)){
                                    if(Global.bettingChipArray[key]['type'] == pos){
                                        sum = parseFloat(msg.ResponseData.totalInsurance);
                                        if(Global.splitPositionItem == 0){
                                            sum = sum+'+'+ msg.ResponseData.stack;
                                        }else if(Global.splitPositionItem == 1){
                                           sum = msg.ResponseData.stack + '+'+ sum;
                                        }
                                        Global.bettingChipArray[key]['sum'] = sum;
                                        Global.bettingChipArray[key]['chip']['chipText'].setText(sum);
                                    }
                                }
                            }
                        }else{
                            for(var key in Global.bettingChipArray){
                                if(Global.bettingChipArray.hasOwnProperty(key)){
                                    if(Global.bettingChipArray[key]['type'] == pos){
                                        sum = parseFloat(msg.ResponseData.totalInsurance);
                                    Global.bettingChipArray[key]['sum'] = sum;
                                        Global.bettingChipArray[key]['chip']['chipText'].setText(sum);
                                    }
                                }
                            }
                        }

                        Global.betAmount = parseFloat(Global.betAmount) + parseFloat(msg.ResponseData.insurance);
                        Global.gameBalance = msg.ResponseData.balance;
                        self.updateBetAmount();
                        self.updateMoneyInfo();

                        if (Global.dealerCards['total_' + 0] == 11){
                            self.buttons.insurance.visible = false;
                        }else{
                            self.buttons.insurance.visible = true;
                        }
                    }else{
                        self.updateGameInfo($.client.getLocalizedString('TEXT_SOMETHING_WRONG', true));
                    }
                }, function(err){
                    console.log(err);
                }
            );
        }
    },

    showDealerCards: function(){
        var secondDealerCard, totalDealerCard = 0, cardIdx, stake = {}, getDealerCard = {}, balance = {}, text = '', text2 = '', pos = 0, status = '';
        var count = 0, cardsVideoCount = 0;
        var self = this;
        Global.gameRound = 'dealer';
        self.buttons.stand.clicked = false;
        Global.localCounter = 1;
        getDealerCard.type = "get_dealer_cards";

        $.client.sendPost(JSON.stringify(getDealerCard),
            function (msg) {
                var c, timerVideoOfCards;
                /*console.debug('get_dealer_cards_msg', msg);*/
                buttonActionGroup.visible = false;
                secondDealerCard = self.getCards(msg.ResponseData.cards[0]);
                Global.dealerCards[1].loadTexture('cards', secondDealerCard);
                Global.dealerCards[1].visible = false;
                Global.dealerCards['total_' + 1] = cardsValues[secondDealerCard];
                totalDealerCard = Global.dealerCards['total_' + 0] + Global.dealerCards['total_' + 1];

                if(msg.ResponseData.cards.length > 1){
                    for (var i = 1; i < msg.ResponseData.cards.length; i++) {
                        cardIdx = self.getCards(msg.ResponseData.cards[i]);
                        Global.dealerCards[Global.localCounter + 1] = removableGroup.create(
                            Global.dealerCards[Global.localCounter].x + 80,
                            Global.dealerCards[Global.localCounter].y,
                            'cards',
                            cardIdx
                        );
                        Global.dealerCards[Global.localCounter + 1].visible = false;
                        totalDealerCard += cardsValues[cardIdx];
                        if(totalDealerCard > 21 && cardsValues[cardIdx] == 11){
                            totalDealerCard -= 10;
                        }
                        self.dealerCardPlace.width = self.dealerCardPlace.width + Global.dealerCards[Global.localCounter + 1].width + 1;
                        Global.localCounter++;
                    }
                }

                c = 0;
                timerVideoOfCards = msg.ResponseData.videoTimer;
                function timerVideo(){
                    var wait = 0.2, sT;
                    if(c>0){
                        displayDealerCard();
                    }
                    c += 1;
                    if(c < timerVideoOfCards.length){
                        sT = setTimeout(function(){
                            timerVideo();
                        }, (timerVideoOfCards[c-1] + wait)*1000);
                    } else{
                        clearTimeout(sT);
                        displayDealerCard();
                        displayElements();
                    }
                }

                timerVideo();
                function displayDealerCard(){
                    cardsVideoCount++;
                    if(Global.dealerCards[cardsVideoCount]){
                       Global.dealerCards[cardsVideoCount].visible = true;
                    }
                }

                function displayElements(){
                    self.add.tween(self.labels.dealerTotal).to({
                        x: self.dealerCardPlace.x + self.dealerCardPlace.width + 20,
                        y: self.dealerCardPlace.y + self.dealerCardPlace.height -20
                        }, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, false
                    );

                    self.labels.dealerTotal.setText(totalDealerCard);
                    stake.type = "stake";
                    $.client.sendPost(JSON.stringify(stake),
                        function (msg) {
                            console.log('stake_msg', msg);
                            if(msg.ResponseData['stake'].length > 0){
                                for (var i = 0; i < msg.ResponseData['stake'].length; i++) {
                                    pos = parseFloat(msg.ResponseData.stake[i]['pos']);
                                    if(msg.ResponseData.stake[i]['status'] == 'win'){
                                        text2 = $.client.getLocalizedString('TEXT_WON', true);
                                        text = text2 +''+ msg.ResponseData.stake[i]['gainings'];
                                        status = 'win';
                                        Global.historyArray.push({winText: text2, win: msg.ResponseData.stake[i]['gainings']});

                                    }else if(msg.ResponseData.stake[i]['status'] == 'push'){
                                        text =  $.client.getLocalizedString('TEXT_PUSH', true);
                                        Global.historyArray.push({winText: text, win: msg.ResponseData.stake[i]['gainings']});
                                        status = 'push';
                                    }else{
                                        text = $.client.getLocalizedString('TEXT_LOSE', true);
                                        Global.historyArray.push({winText: text, win: msg.ResponseData.stake[i]['lose']});
                                        status = 'lose';
                                    }
                                    self.updateUserInfoText(pos, text, status);
                                }
                            }

                                Global.gameBalance = msg.ResponseData.balance;
                                self.updateMoneyInfo();
                                buttonNewGameGroup.visible = true;
                            }, function(err){
                                console.log(err);
                            }
                        );
                    }
            }, function(err){
                console.log(err);
            }
        );
    },
    newGame: function(){
        var balance = {};
        var self = this;
        Global.gameRound = 'newGame';
        buttonNewGameGroup.visible = false;
        buttonStakeGroup.visible = true;
        chipsGroup.visible = true;
        if(Global.bettingChipArray.length > 0){
            for (var i = Global.bettingChipArray.length - 1; i >= 0; i--) {
                Global.bettingChipArray[i].chip.chipClone.destroy();
            }
        }

        selectedChipsGroup.removeAll(true);
        removableGroup.removeAll(true);
        Global.bettingChipArray =  [];
        Global.betAmount = 0;
        this.resetValues();
        this.buttons.deal.clicked = false;
        this.buttons.hit.clicked = true;
        this.lightActivePosionChip(-1);
        balance.type = "balance";
        $.client.sendPost(JSON.stringify(balance),
            function (msg) {
                Global.gameBalance = msg.ResponseData.balance;
                self.updateMoneyInfo();
                for (var i = 0; i < tableItem.length; i++) {
                    self.tableCell[i].inputEnabled = true;
                    buttonNewGameGroup.visible = false;
                }
            }, function(err){
                console.log(err);
            }
        );

    },

    repeatGame: function(){
        var self = this;
        for(var key in Global.stack){
            if(Global.stack.hasOwnProperty(key)){
                for(var key2 in Global.bettingChipArray){
                    if(Global.bettingChipArray.hasOwnProperty(key2)){
                        if(Global.bettingChipArray[key2]['type'] == Global.stack[key]['pos']){
                            Global.bettingChipArray[key2]['chip']['chipText'].setText(Global.bettingChipArray[key2]['total']);
                            Global.bettingChipArray[key2]['sent'] = false;
                        }
                    }
                }
            }
        }

        removableGroup.removeAll(true);
        this.resetValues();
        buttonNewGameGroup.visible = false;
        buttonStakeGroup.visible = false;
        chipsGroup.visible = false;
        this.lightActivePosionChip(-1);
        this.buttons.deal.clicked = true;
        this.buttons.hit.clicked = true;
        buttonActionGroup.visible = false;
        this.confirmBet();
        setTimeout(function(){
            self.actionDeal();
        }, 500);
    },

    resetValues: function(){
        Global.activedPosChips = [];
        Global.dealerCards = [];
        Global.userCards = [];
        Global.counter = 0;
        Global.splitPosition = [];
        Global.splitPositionItem = 0;
        Global.localCounter = 2;
        Global.pointer = null;
        Global.stack = [];
        this.updateBetAmount();
        this.dealerCardPlace.width = 173;
        this.g_cardsVideoCount = 0;
        this.g_cardsVideo = [];
    },

    getCards: function(code){
        var cardId;
        if (cards.indexOf(code) != -1){
            cardId = cards.indexOf(code.toString());
            return cardId;
        }
        return 1;
    },
    getCoordinates:function(type){
        for (var i = 0; i < tableItem.length; i++) {
            if(tableItem[i].type == type){
                return {x:tableItem[i].x, y:tableItem[i].y};
            }
        }

    },
    updateMoneyInfo: function() {
        var self = this;
        self.labels.userBalance.setText($.client.UserData.CurrencySign + parseFloat(Global.gameBalance).toFixed(2));
    },
    updateUserInfoText: function(id, text, status){
        var self = this;
        if(id == undefined){
            id = 0;
        }
        if(status == undefined || status.length == 0){
            status = 'lose';
        }
        if(text == undefined){
            text = $.client.getLocalizedString('TEXT_BUST', true);
        }
        status = status.toLowerCase();
        if(status == 'win'){
            self.labels.userMsgStatus[id+'_bg'].loadTexture('statusStake', 1);
        }else if(status == 'push'){
            self.labels.userMsgStatus[id+'_bg'].loadTexture('statusStake', 2);
        }else{

        }
        self.labels.userMsgStatus[id+'_text'].setText(text);
        self.labels.userMsgStatus[id+'_bg'].visible = true;
        removableGroup.bringToTop(self.labels.userMsgStatus[id+'_bg']);
    },
    updateDealerInfoText: function(text){
        var self = this;
        if(text == undefined){
            text = $.client.getLocalizedString('TEXT_BUST', true);
        }
        self.labels.dealerMsgStatus.setText(text);
    },
    updateBetAmount: function() {
        var self = this;
        var amount = Global.betAmount==0 ? 0 : parseFloat(Global.betAmount).toFixed(2);
        self.labels.betAmount.setText($.client.UserData.CurrencySign + amount);
    },
    updateGameInfo: function(text){
        var self = this;
        if(text !== undefined){
            self.labels.gameInfoMsg.setText(text);
        }
        if(text.length > 0){
            self.g_statusBg.visible = true;
        }else{
            self.g_statusBg.visible = false;
        }
    },
    updateLimitPlate: function(id, array){
        var text;
        text =  $.client.getLocalizedString('TEXT_MIN', true) + $.client.UserData.CurrencySign + array[id]['min']
            + '  ' + $.client.getLocalizedString('TEXT_MAX', true) + $.client.UserData.CurrencySign + array[id]['max'];
        this.labels.limitPlate.setText(text);
    },
    showLimits: function() {
        var self = this;
        var modalBoxBg, limitBox, closeBtn, limitTitleText, modalBg,cancelBtn, rulesText;
        var perPage = 3, limitPage = 0, ii = 0, start, end, min, max;
        if (!Global.isModalShow) {
            if (Global.selectedLimitArray.length != 0) {
                Global.isModalShow = true;
                popupWinGroup = this.add.group();
                limitGroup = this.add.group();
                worldGroup.add(popupWinGroup);
                popupWinGroup.add(limitGroup);
                modalBoxBg = this.add.button(0, 0, "modalBoxBg", null, true);
                modalBoxBg.useHandCursor = false;
                popupWinGroup.addChild(modalBoxBg);
                limitBox = this.add.sprite(480, 400, 'limitsBg');
                popupWinGroup.addChild(limitBox);
                closeBtn = this.add.button(limitBox.width-50, 10, 'closeBtn', this.closePopup, this);
                closeBtn.useHandCursor = true;
                limitBox.addChild(closeBtn);
                limitTitleText = createTextLbl(self, {
                    text: $.client.getLocalizedString('Please select limits', true).toUpperCase(),
                    x: 50,
                    y: 20,
                    font: "ProximaNova",
                    size: 24,
                    color: "#fff",
                    centered: false,
                    maxHeight: 50,
                    maxWidth: 300
                });
                limitBox.addChild(limitTitleText);
                limitBox.addChild( createTextLbl(self, {
                    text: $.client.getLocalizedString('Min bet', true).toUpperCase(),
                    x: 100,
                    y: 80,
                    font: "ProximaNova",
                    size: 22,
                    color: "#878787",
                    centered: false,
                    maxHeight: 50,
                    maxWidth: 120
                }));
                limitBox.addChild( createTextLbl(self, {
                    text: $.client.getLocalizedString('Max bet', true).toUpperCase(),
                    x: 450,
                    y: 80,
                    font: "ProximaNova",
                    size: 22,
                    color: "#878787",
                    centered: false,
                    maxHeight: 50,
                    maxWidth: 120
                }));
                start = (limitPage > 0) ? limitPage * perPage : 0;
                end = (Global.selectedLimitArray.length < perPage * (limitPage + 1) ? Global.selectedLimitArray.length : perPage * (limitPage + 1));
                limitGroup.removeAll(true);

                for (var i = start; i < end; i++) {
                    if (Global.limitPlateId == i){
                        limitBtn = self.add.button(limitBox.x+55, limitBox.y+130 + (70 * ii), 'limitBtnBg', self.setLimit, self, 1, 1);
                    }else{
                        limitBtn = self.add.button(limitBox.x+55, limitBox.y+130 + (70 * ii), 'limitBtnBg', self.setLimit, self, 1, 0);
                    }
                    ii++;
                    limitBtn.input.useHandCursor = true;
                    limitBtn.id = i;
                    min = parseFloat(Global.selectedLimitArray[i].Bet.Min) % 1 == 0 ? parseFloat(Global.selectedLimitArray[i].Bet.Min).toFixed(0) : Global.selectedLimitArray[i].Bet.Min;
                    max = parseFloat(Global.selectedLimitArray[i].Bet.Max) % 1 == 0 ? parseFloat(Global.selectedLimitArray[i].Bet.Max).toFixed(0) : Global.selectedLimitArray[i].Bet.Max;
                    var minLbl = limitBtn.addChild(self.add.text(70, 15, min, {
                        font: "24px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
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
                    var rulesBtn = this.add.button(900, 410, 'btnBg', function () {
                        $.client.showRules();
                    }, this);
                    rulesBtn.height = 40;
                    limitGroup.add(rulesBtn);

                    rulesText = createTextLbl(self, {
                        text: $.client.getLocalizedString('Rules', true).toUpperCase(),
                        x: 982,
                        y: 419,
                        font: "ProximaNova",
                        size: 22,
                        color: "#fff",
                        centered: false,
                        maxHeight: 50,
                        maxWidth: 150
                    });
                    rulesText.anchor.x = Math.round(rulesText.width * 0.5) / rulesText.width;
                    limitGroup.add(rulesText);
                    rulesBtn.clicked = true;
                    rulesBtn.input.useHandCursor = true;
                }

                /*function showLimitRow(x, y, limit) {
                    var min = parseFloat(limit.min) % 1 == 0 ? parseFloat(limit.min).toFixed(0) : limit.min.replace(',', '.');

                    var minLbl = limitBox.addChild(self.add.text(x+30, y, min, {
                        font: "18px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    minLbl.anchor.x = Math.round(minLbl.width * 0.5) / minLbl.width;
                    var max = parseFloat(limit.max) % 1 == 0 ? parseFloat(limit.max).toFixed(0) : limit.max.replace(',', '.');
                    var maxLbl = limitBox.addChild(self.add.text(x + 390, y, max, {
                        font: "18px ProximaNova",
                        fill: "#fff",
                        align: "center"
                    }));
                    maxLbl.anchor.x = Math.round(maxLbl.width * 0.5) / maxLbl.width;
                }

                for (var i = 0; i < Global.selectedLimitArray.length; i++) {
                    showLimitRow(100, 160 + i * 55, {
                        min: Global.selectedLimitArray[i].Bet.Min,
                        max: Global.selectedLimitArray[i].Bet.Max
                    });
                };*/


            }
        }
    },
    lightActivePosionChip:function(pos){
        pos = parseInt(pos, 10);
        frameGroup.forEach(function(item){
            if (item.key == "landPlaceChips"){
                if(0 > pos){
                    item.loadTexture(item.key, 0);
                }else{
                    if(item.type == pos){
                        item.loadTexture(item.key, 1);
                    }else{
                        item.loadTexture(item.key, 0);
                    }
                }
            }
        });
    },
    setLimit: function(element){
        if(limitGroup.children.length > 0){
            limitGroup.forEach(function(item){
                if(item.key ==="limitBtnBg"){
                    item.loadTexture(item.key, 0);
                }
            });
            element.setFrames(1, 1, 1);
        }

        Global.limitPlateId = element.id;
        this.validateChips();
        this.createChips();
        $.client.sendPost(JSON.stringify({
                type: "put_limits",
                limit: Global.selectedLimitArray[Global.limitPlateId]
        }), function (responce) {
        });
    },
    showHistory: function(element) {
        var self = this;
        var historyBox, modalBoxBg, closeBtn, historyTitleText, historyLabelResult, historyLabelWin;
        if (!Global.isModalShow) {
            Global.isModalShow = true;
            popupWinGroup = this.add.group();
            worldGroup.add(popupWinGroup);
            modalBoxBg = this.add.button(0, 0, "modalBoxBg", null, true);
            modalBoxBg.useHandCursor = false;
            popupWinGroup.add(modalBoxBg);
            historyBox = this.add.sprite(660, 400, 'historyBg');
            popupWinGroup.add(historyBox);
            closeBtn = this.add.button(287, 10, 'closeBtn', this.closePopup, this);
            closeBtn.useHandCursor = true;
            historyBox.addChild(closeBtn);
            historyTitleText = createTextLbl(self, {
                text: $.client.getLocalizedString('History', true).toUpperCase(),
                x: 130,
                y: 20,
                font: "ProximaNova",
                size: 30,
                color: "#fff",
                centered: false,
                maxHeight: 50,
                maxWidth: 150
            });
            historyBox.addChild(historyTitleText);
            historyLabelResult = createTextLbl(self, {
                text: $.client.getLocalizedString('TEXT_RESULT', true).toUpperCase(),
                x: 60,
                y: 90,
                font: "ProximaNova",
                size: 26,
                color: "#878787",
                centered: false,
                maxHeight: 50,
                maxWidth: 120
            });
            historyBox.addChild(historyLabelResult);
            historyLabelWin = createTextLbl(self, {
                text: $.client.getLocalizedString('TEXT_WON', true).toUpperCase(),
                x: 200,
                y: 90,
                font: "ProximaNova",
                size: 26,
                color: "#878787",
                centered: false,
                maxHeight: 50,
                maxWidth: 120
            });
            historyBox.addChild(historyLabelWin);
            function showRow(item, posX, posY) {
                var winnerText, betText, amount = 0;
                if(item){
                    winnerText = self.add.text(posX, posY, item.winText, { font: "26px ProximaNova", fill: "#fff", align: "center" });
                    historyBox.addChild(winnerText);
                    amount = item.win % 1 == 0 ? parseFloat(item.win).toFixed(0) : parseFloat(item.win).toFixed(2);
                    betText = self.add.text(posX+160, posY, $.client.UserData.CurrencySign + amount, { font: "26px ProximaNova", fill: "#fff", align: "center" });
                    betText.anchor.x = Math.round(betText.width * 0.5) / betText.width;
                    historyBox.addChild(betText);
                }
            }
            var k = 0;
            if (Global.historyArray.length>0)
            for (var i = Global.historyArray.length - 1; i >= Global.historyArray.length - 3; i--) {
                showRow(Global.historyArray[i], 60, 152 + k * 72);
                k++;
            }
        }
    },
    closePopup: function () {
        popupWinGroup.destroy();
        Global.isModalShow = false;
    },
    showCashier: function (visible) {
        var self = this;
        if (visible) {
            self.buttons.cashierBtn.alpha = 1;
            self.buttons.cashierBtn.input.useHandCursor = true;
            self.buttons.cashierBtn.clicked = true;
        } else {
            self.buttons.cashierBtn.alpha = 0;
            //self.buttons.cashierBtn.input.useHandCursor = false;
            self.buttons.cashierBtn.clicked = false;
        }
    },
    messageDispatcher: function(response) {
        console.debug('response222', response);
        var msg = response.message;
        var self = this;
        if (response.type == "user") {
            if (msg.sessionId != "") {
                self.g_nick = msg.user.nick;
                self.g_nick =  self.g_nick ? self.g_nick.toUpperCase().length < 15 ? self.g_nick.toUpperCase() : self.g_nick.toUpperCase().substr(0, 15) + '...' : "";
                //self.labels.userName.setText(self.g_nick);
                Global.gameBalance = msg.user.balance;
                //self.updateMoneyInfo();
                if (msg.user.isPlayingForFun && self.showCashier) {
                    self.showCashier(false);
                }
                if ($.client.UserData.Features && $.client.UserData.Features.provably_fair) {
                    self.buttons.provably.inputEnabled = true;
                    //self.buttons.provably.alpha = 1;
                    //self.buttons.provably.text.alpha = 1;
                } else {
                    self.buttons.provably.inputEnabled = false;
                    self.buttons.provably.alpha = 0;
                    self.buttons.provably.text.alpha = 0;
                }
            }
        } else if (msg.type == "refresh_user_data") {
            self.g_nick = msg.user.nick;
            Global.gameBalance = msg.user.balance;
            self.updateMoneyInfo();
            self.g_nick = self.g_nick ? self.g_nick.toUpperCase().length < 15 ? self.g_nick.toUpperCase() : self.g_nick.toUpperCase().substr(0, 15) + '...' : "";
            self.labels.userName.setText(self.g_nick);
        } else if (response.type == "win") {
            Global.gameBalance = msg.balance;
            self.updateMoneyInfo();
        }else if(response.type =="lose"){
            Global.gameBalance = msg.balance;
            self.updateMoneyInfo();
        } else if(response.type =="push"){
            Global.gameBalance = msg.balance;
            self.updateMoneyInfo();
        } else if (response.type == "error") {
            if (msg) {
                text = $.client.getLocalizedString(msg, true).toUpperCase();
                self.updateMoneyInfo(text);
            }
        }
    }
};