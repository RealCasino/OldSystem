GAME_WIDTH = 1024;
GAME_HEIGHT = 800;

/*	global variables for game state	*/
var chips_cost = [1, 5, 10, 25, 50, 100];
var g_SessionId = "";
var worldGroup, tableGroup, headerGroup, buttonGroup, chipsGroup, footerGroup, selectedChipsGroup, buttonStakeGroup, buttonActionGroup, 
	buttonNewGameGroup, removableGroup, limitPopupGroup;

var selectedChipId = 0;
var selectedChip;
var tableItem = [
	{x:255, y:430, key:'frame', type:'1'},
	{x:482, y:498, key:'frame', type:'2'},
	{x:718, y:430, key:'frame', type:'3'}
];

var cards = [
    'AC','2C','3C','4C','5C','6C','7C','8C','9C', '10C', 'JC', 'QC', 'KC',
    'AD','2D','3D','4D','5D','6D','7D','8D','9D', '10D', 'JD', 'QD', 'KD',
    'AH','2H','3H','4H','5H','6H','7H','8H','9H', '10H', 'JH', 'QH', 'KH',
    'AS','2S','3S','4S','5S','6S','7S','8S','9S', '10S', 'JS', 'QS', 'KS'
];
var cardsValues = [
	11,2,3,4,5,6,7,8,9,10,10,10,10,
	11,2,3,4,5,6,7,8,9,10,10,10,10,
	11,2,3,4,5,6,7,8,9,10,10,10,10,
	11,2,3,4,5,6,7,8,9,10,10,10,10
];

BlackjackGame = {
};

BlackjackGame.Preloader = function(game) {
    this.background = null;
    this.ready = false;
};

BlackjackGame.Preloader.prototype = {
    preload: function() {
        this.game.stage.backgroundColor = '#02501b';
		this.load.image('headerBg', 'images/header.png');
		//this.load.spritesheet('historyBtn', 'images/history_btn.png', 72, 53);
		this.load.spritesheet('limitBtn', 'images/limit_btn.png', 72, 53); 
		this.load.image('inputField', 'images/input_field.png'); 
		
		this.load.image('footerBg', 'images/footer_bg.png'); 
		this.load.spritesheet('clearAllBtn', 'images/clear_btn.png', 72, 53);
		this.load.spritesheet('dealBtn', 'images/deal_btn.png', 72, 53); 
		this.load.spritesheet('undoBtn', 'images/undo_btn.png', 72, 53); 

		this.load.spritesheet('doubleBtn', 'images/double_btn.png', 72, 53); 
		this.load.spritesheet('hitBtn', 'images/hit_btn.png', 72, 53); 
		this.load.spritesheet('splitBtn', 'images/split_btn.png', 72, 53); 
		this.load.spritesheet('standBtn', 'images/stand_btn.png', 72, 53); 
		this.load.spritesheet('insuranceBtn', 'images/insurance_btn.png', 72, 53); 

		this.load.spritesheet('nGameBtn', 'images/new_game_btn.png', 72, 53); 
		this.load.spritesheet('repeatBtn', 'images/repeat_btn.png', 72, 53);

		this.load.image('chipsBg', 'images/chips_bg.png');
		this.load.spritesheet('chips_sprite', 'images/chips_sprite.png', 112, 108);	

		this.load.image('table', 'images/table.png');
		this.load.image('frame', 'images/frame.png');
		this.load.spritesheet('cards', 'images/cards.png', 79, 123); 	
		this.load.image('pointer', 'images/pointer.png');
		this.load.image('limit_table', 'images/limit_table.png');
		
		this.load.image('confirmLimitBtn', 'images/pad_bgConfirm.png');

		this.load.image('dialogBg', 'images/pad_dialog.png');

		this.game.load.onFileComplete.add(this.updateProgressBar, this);
    },

    create: function() {
        var self = this;
        function startGame() {
            if ($.client.UserData) {
                self.state.start('Game');
            } else {
                setTimeout(function () {
                    startGame();
                },200);
            }
        }
        startGame();
    },
    updateProgressBar:function(progress){   
    	progress -= 1;
    	$.client.setProgressBarPercent(progress);	
    }
};

BlackjackGame.Game = function(game) {
	this.game;
};
BlackjackGame.Game.prototype = {
    g_ConfirmEndFlag: true,
    g_SessionId: "",
    g_BetAmount: 0,
    g_GameBalance: 0,
    g_dealerCards:[], 
    g_userCards:[],  
    g_counter:0, 
    g_numPlace:0,
    g_localCounter: 2,
    g_pointer: null,
    g_BettingChipArray: [],
    g_nick: "",
	g_isModalShow: false,
	g_isMaxLimit:false,
	g_limitPlateId:0,
	g_selectedLimitArray:[],
    g_splitPosition:[],
    g_splitPositionItem:0,
    g_stack:[],
    g_chipPosition:[],
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
    	doubles:{},
    	split:{},
    	stand:{},
    	hit:{},
        confirm: {},
        undo: {},
        clearAll: {},
        repeat: {},
        deal:{},
        limit:{},
        insurance:{},
        newGame:{},
        confirmLimit:{}
    },
    chips: {        
    },
    tableCell:{
    },
    update: function() {
    },
    create: function() {
        var size = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        var scalex = size.width > size.height ? size.height / GAME_HEIGHT : size.width / GAME_WIDTH;
        var scaley = size.height / GAME_HEIGHT;
		
		var headerBar, headerBetLabel, headerBetInput, headerBalansLabel, headerBalansInput, footerBar;
		var table, chipsBg, chipsEl, chipText, limit_table, limits = {};
		var self = this;

        Game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        worldGroup = this.add.group();
        tableGroup = this.add.group();
		headerGroup = this.add.group();
		buttonGroup = this.add.group();
		footerGroup = this.add.group();
		chipsGroup = this.add.group();
		removableGroup = this.add.group();

		buttonStakeGroup = this.add.group();
		buttonActionGroup = this.add.group();
		buttonNewGameGroup = this.add.group();

		selectedChipsGroup = this.add.group();
        
		worldGroup.add(tableGroup);
		worldGroup.add(chipsGroup);
		worldGroup.add(buttonGroup); 	
        buttonGroup.add(headerGroup);
		buttonGroup.add(footerGroup);
		buttonGroup.add(buttonStakeGroup);
		buttonGroup.add(buttonActionGroup);
		buttonGroup.add(buttonNewGameGroup);
		worldGroup.add(removableGroup);

		buttonActionGroup.visible = false;
		buttonNewGameGroup.visible = false;

        worldGroup.scale.setTo(scalex, scaley);
		if(scalex && scalex >0){
			this.game.world.width = this.game.world.width / scalex;
		}else {
			this.game.world.width = this.game.world.width;
		}
		
		headerBar = this.add.sprite(0, 0, 'headerBg');
        headerBar.width = this.game.world.width;
        headerGroup.add(headerBar);

        this.labels.userName = this.add.text(10, 9, '',{
            font: "18px Arial",
            fill: "#ffffff"          
        });
		headerGroup.add(this.labels.userName);

        headerBetLabel = this.add.text(270, 9, $.client.getLocalizedString('TEXT_BET', true), {
            font: "16px Arial",
            fill: "#ffffff"          
        });
        headerGroup.add(headerBetLabel);

        headerBetInput = this.add.sprite(headerBar.x+310, headerBar.y+3, 'inputField');
        headerBetInput.width = 100;
        headerGroup.add(headerBetInput);

        this.labels.betAmount = this.add.text(50, 4, '$ 0', {
            font: "20px Arial bold",
            fill: "#000000"
        });
		headerBetInput.addChild(this.labels.betAmount);

        headerBalansLabel = this.add.text(headerBar.x+430, headerBar.y+9, $.client.getLocalizedString('TEXT_BALANCE', true), {
            font: "16px Arial",
            fill: "#ffffff"          
        });
        headerGroup.add(headerBalansLabel);

        headerBalansInput = this.add.sprite(headerBar.x + 520, headerBar.y + 3, 'inputField');
        headerBalansInput.width = 100;
        headerGroup.add(headerBalansInput);

        this.labels.userBalance = this.add.text(50, 4,  '$ 0', {
            font: "20px Arial bold",
            fill: "#000000"
        });   
		headerBalansInput.addChild(this.labels.userBalance);
        /*this.buttons.limit = this.add.button(headerBar.x + 400, headerBar.y + 2, 'limitBtn', this.getLimits, this, 1, 0);
        this.buttons.limit.clicked = true;
        this.buttons.limit.input.useHandCursor = true;
        buttonGroup.add(this.buttons.limit);*/
		
		footerBar = this.add.sprite(0, 698, 'footerBg');
        footerBar.width = this.game.world.width;
        footerGroup.add(footerBar);


        this.labels.gameInfoMsg = this.add.text(this.game.world.centerX-150, footerBar.y+10, '',{
    	 	font: "normal 24px Arial",		
        	fill:'#ffffff'
        });
        footerGroup.add(this.labels.gameInfoMsg);
        
        this.buttons.deal = this.add.button(this.game.world.centerX-100, footerBar.y+44, 'dealBtn', this.confirmBets, this, 1, 0);
        this.buttons.deal.input.useHandCursor = true;
        this.buttons.deal.clicked = false;
        buttonStakeGroup.add(this.buttons.deal); 

        this.buttons.undo = this.add.button(this.game.world.centerX, footerBar.y+45, 'undoBtn', this.undoBet, this, 1, 0);
        this.buttons.undo.input.useHandCursor = true;
        this.buttons.undo.clicked = true;
        buttonStakeGroup.add(this.buttons.undo);

        this.buttons.clearAll = this.add.button(this.game.world.centerX+80, footerBar.y+45, 'clearAllBtn', this.clearAllBet, this, 1, 0);
        this.buttons.clearAll.input.useHandCursor = true;
        this.buttons.clearAll.clicked = true;
        buttonStakeGroup.add(this.buttons.clearAll);

        this.buttons.doubles = this.add.button(this.game.world.centerX-160, footerBar.y+44, 'doubleBtn', this.doubleBet, this, 1, 0);
        this.buttons.doubles.input.useHandCursor = true;
        this.buttons.doubles.clicked = true;
        this.buttons.doubles.visible = false;
        buttonActionGroup.add(this.buttons.doubles); 

        this.buttons.hit = this.add.button(this.game.world.centerX -80, footerBar.y + 45, 'hitBtn', this.hitCard, this, 1, 0);
        this.buttons.hit.input.useHandCursor = true;
        this.buttons.hit.clicked = true;
        buttonActionGroup.add(this.buttons.hit);                
		
        this.buttons.stand = this.add.button(this.game.world.centerX, footerBar.y+45, 'standBtn', this.standBet, this, 1, 0);
        this.buttons.stand.input.useHandCursor = true;
        this.buttons.stand.clicked = true;
        buttonActionGroup.add(this.buttons.stand);

        this.buttons.split = this.add.button(this.game.world.centerX+80, footerBar.y+45, 'splitBtn', this.splitCards, this, 1, 0);
        this.buttons.split.input.useHandCursor = true;
        this.buttons.split.clicked = true;
        this.buttons.split.visible = false;
        buttonActionGroup.add(this.buttons.split);

        this.buttons.insurance = this.add.button(this.game.world.centerX+160, footerBar.y+45, 'insuranceBtn', this.insuranceBet, this, 1, 0);
        this.buttons.insurance.input.useHandCursor = true;
        this.buttons.insurance.clicked = true;
        this.buttons.insurance.visible = false;
        buttonActionGroup.add(this.buttons.insurance);
        
        this.buttons.newGame = this.add.button(this.game.world.centerX-80, footerBar.y+44, 'nGameBtn', this.newGame, this, 1, 0);
        this.buttons.newGame.input.useHandCursor = true;
        this.buttons.newGame.clicked = true;
        buttonNewGameGroup.add(this.buttons.newGame); 

        this.buttons.repeat = this.add.button(this.game.world.centerX +10, footerBar.y + 45, 'repeatBtn', this.repeatGame, this, 1, 0);
        this.buttons.repeat.input.useHandCursor = true;
        this.buttons.repeat.clicked = true;
        buttonNewGameGroup.add(this.buttons.repeat); 

        table = this.add.sprite(30, 96, 'table');	
		tableGroup.add(table);

		limit_table = this.add.sprite(750, 96, 'limit_table');
		tableGroup.add(limit_table);	

		for (var i = 0; i < tableItem.length; i++) {
            this.tableCell[i] = tableGroup.create(tableItem[i].x, tableItem[i].y, tableItem[i].key);
            this.tableCell[i].id = i;
            this.tableCell[i].type = tableItem[i].type;
            this.tableCell[i].inputEnabled = true;
			this.tableCell[i].input.useHandCursor = true;  
			this.tableCell[i].click = true;  
            this.tableCell[i].alpha = 1;
            this.tableCell[i].events.onInputDown.add(this.addChip, this);
        }
	
		chipsBg = this.add.sprite(222, 590, 'chipsBg');
        chipsBg.width = 598;
        chipsGroup.add(chipsBg);
        for (var a = 0; a < chips_cost.length; a++) {
            if (a == selectedChipId) {
                chipsEl = chipsGroup.create(chipsBg.x + 20 + (a * 90), chipsBg.y, 'chips_sprite', a * 2 + 1);
				selectedChip = {id: a, value: chips_cost[a]}
            } else {
            }
			chipsEl = chipsGroup.create(chipsBg.x + 20 + (a * 90), chipsBg.y, 'chips_sprite', a * 2);
            chipsEl.chipValue = chips_cost[a];
            chipsEl.id = a;                      
            chipsEl.inputEnabled = true;
            chipsEl.input.useHandCursor = true;         
            chipsEl.events.onInputDown.add(this.changeChips, this);
            chipText = this.add.text(chipsBg.x + 80 + (a * 90), chipsBg.y + 40, chips_cost[a], {
                font: "bold 26px Arial",
                fill: "#000000",
                wordWrap: true,
                align: "center"
            });
            chipText.anchor.x = Math.round(chipText.width * 0.5) / chipText.width;
            chipsGroup.add(chipText);
		}
		
		tableGroup.add(selectedChipsGroup);

		this.labels.userName.setText(this.g_nick);
		this.updateMoneyInfo();

		this.labels.limitPlate = this.add.text(30, 30,  '', {
            font: "22px Arial bold",
            fill: "#ffffff"
        });   
        this.labels.limitPlate.angle = 13; 
        limit_table.addChild(this.labels.limitPlate);

		limits.type = 'get_limits';
		$.client.sendPost(JSON.stringify(limits),
			function (msg) {
				self.updateLimitPlate(self.g_limitPlateId, msg.ResponseData.limits);
				self.g_selectedLimitArray = msg.ResponseData.limits; 
			}, function(e){
				console.log(e);
			}
		);

		$.client.setProgressBarPercent(100);	
    },
    roundFloat: function(value, decimals) {
        return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
    },
	
	changeChips: function (element) {
		selectedChipId = element.id;
		chipsGroup.forEach(function (item) {
			if (item.key == "chips_sprite"){
				if (item.id == selectedChipId) {
					item.loadTexture(item.key, item.id * 2+1);
					selectedChip = {id: selectedChipId, value: chips_cost[selectedChipId]}
				} else {
					item.loadTexture(item.key, item.id * 2);
				}
			}
		});
    },
	getAmountDeb: function(){
         return chips_cost[selectedChipId];
	},	
	addChip:function(element){
		var event = $.extend(true, {}, element);
		var chip = {}, chipsAmount, text = '';
		this.updateGameInfo(text);
        this.g_selectedLimitArray[this.g_limitPlateId]['Bet']['Min'] = parseFloat(this.g_selectedLimitArray[this.g_limitPlateId]['Bet']['Min']);
        this.g_selectedLimitArray[this.g_limitPlateId]['Bet']['Max'] = parseFloat(this.g_selectedLimitArray[this.g_limitPlateId]['Bet']['Max']);
		if(this.g_GameBalance > 0  || this.g_selectedLimitArray[this.g_limitPlateId]['Bet']['Min'] > this.g_GameBalance){
			chipsAmount = selectedChip.value;
			if(this.g_BettingChipArray.length > 0){
				for (var i = 0; i < this.g_BettingChipArray.length; i++) {
					if (this.g_BettingChipArray[i].type == element.type) {
						chipsAmount += this.g_BettingChipArray[i].value;
					}
				}
			}

			if(this.g_BettingChipArray.length > 0 && chipsAmount > this.g_selectedLimitArray[this.g_limitPlateId]['Bet']['Max'] ){
				element.click = false;
			}else{
				element.click = true;
			}

			if (this.g_selectedLimitArray[this.g_limitPlateId]['Bet']['Max'] >= selectedChip.value && element.click){
				chip.chipClone = this.add.graphics(element.x + element._frame.width / 2 - 30, element.y + element._frame.height / 2 - 30, selectedChipsGroup);
				chip.active_sprite = this.add.sprite(0, 0, "chips_sprite", selectedChipId * 2);
				chip.active_sprite.width = 60;
				chip.active_sprite.height = 60;
				chip.chipClone.addChild(chip.active_sprite);

				chip.chipText = this.add.text(31, 20, selectedChip.value%1==0?selectedChip.value:parseFloat(selectedChip.value).toFixed(1), {
					font: "bold 18px Arial",
					fill: "#000000",
					wordWrap: true,
					align: "center"
				});
				chip.chipText.anchor.x = Math.round(chip.chipText.width * 0.5) / chip.chipText.width;
				chip.chipClone.addChild(chip.chipText);	
				
				chip.chipText.setText(chipsAmount);			
				this.g_BettingChipArray.push({
					id: selectedChip.id,
					value: selectedChip.value,
					total: chipsAmount,
					type: event.type,
					chip: chip
				});
				
				this.g_BetAmount += selectedChip.value;
				this.g_GameBalance -= selectedChip.value;
				this.updateBetAmount();
				this.updateMoneyInfo();

                if(this.g_selectedLimitArray[this.g_limitPlateId]['Bet']['Min'] <= chipsAmount){
                    this.buttons.deal.clicked = true;
                }else{
                    text =  $.client.getLocalizedString('TEXT_MIN_BET', true) + $.client.UserData.CurrencySign + this.g_selectedLimitArray[this.g_limitPlateId]['Bet']['Min'];
                    this.buttons.deal.clicked = false;
                }

			}else{
				text =  $.client.getLocalizedString('TEXT_MAX_BET', true) + $.client.UserData.CurrencySign + this.g_selectedLimitArray[this.g_limitPlateId]['Bet']['Max'];
			}			
		}else{
			text = $.client.getLocalizedString('TEXT_ERROR_NO_MONEY_MSG', true);
		}

		this.updateGameInfo(text);
	},
	confirmBets: function(){
		var self = this;
		var stake = {}, stakesData={}, coordinates, firstIdx, secondIdx, total = 0, firstDealerCard, msgUserCards, pos;

		if(this.buttons.deal.clicked){
			for(var i=0; i < self.g_BettingChipArray.length; i++){
				self.g_BettingChipArray[i].total = self.roundFloat(self.g_BettingChipArray[i].total, 2);
				if(self.g_BettingChipArray[i].total >= this.g_selectedLimitArray[this.g_limitPlateId]['Bet']['Min']){
					stakesData[self.g_BettingChipArray[i].type] = self.g_BettingChipArray[i].total; 
                    self.g_stack.push({pos: self.g_BettingChipArray[i].type, stack:self.g_BettingChipArray[i].total});
				}else{
					self.undoBet(self.g_BettingChipArray[i])
				}
			}

            if(self.g_BettingChipArray.length >0 ){
    			stake.type = "deal";
    			stake.sessionId = self.g_SessionId;
    			stake.data = stakesData;
    			this.g_chipPosition = Object.keys(stakesData);
    			$.client.sendPost(JSON.stringify(stake),
    				function (msg) {
    					//console.log('confirmBets_msg', msg);
    					if(msg.ResponseData.success){
    						buttonStakeGroup.visible = false;
    						chipsGroup.visible = false;
    						self.buttons.stand.clicked = true;
    						for (var i = 0; i < tableItem.length; i++) {
    							self.tableCell[i].inputEnabled = false;
    						}
                            self.g_GameBalance = msg.ResponseData.balance;
                            self.g_BetAmount =  msg.ResponseData.amount
                            self.updateBetAmount();
                            self.updateMoneyInfo(); 

    						firstDealerCard = self.getCards(msg.ResponseData.dealerCard)
    						self.g_dealerCards[0] = removableGroup.create(370, 150, 'cards', firstDealerCard);
    						self.g_dealerCards['total_' + 0] = cardsValues[firstDealerCard];
    						self.g_dealerCards[1] = removableGroup.create(450, 150, 'cards', 54);
    						self.labels.dealerTotal = self.add.text(340, 155, '', {
    							font: "bold 18px Arial",
    							fill: "#000000"
    						});

    						self.labels.dealerMsgStatus = self.add.text(430, 280, '', {
    							font: "24px Arial",
    						    fill: "#ffffff"  
    						});

    						removableGroup.addChild(self.labels.dealerTotal);
    						removableGroup.addChild(self.labels.dealerMsgStatus);
    						msgUserCards =  msg.ResponseData.userCards;

    						self.g_numPlace = msgUserCards.length - 1;

    						for (var i = 0; i < msgUserCards.length; i++) {
                                pos = msgUserCards[i].pos;
    							coordinates = self.getCoordinates(pos);
    							self.g_userCards['position_'+i] = pos;	
    							firstIdx =  self.getCards(msgUserCards[i].first);
    							secondIdx =  self.getCards(msgUserCards[i].second);

    							if ((cardsValues[firstIdx] + cardsValues[secondIdx] >21) && cardsValues[secondIdx] == 11){
    								total = (cardsValues[firstIdx] + cardsValues[secondIdx]) - 10;	
    							}else{
    								total = cardsValues[firstIdx] + cardsValues[secondIdx];	
    							}

    							self.g_userCards['total_'+i] = total;				
    							self.g_userCards['point1_'+i] = cardsValues[firstIdx];				
    							self.g_userCards['point2_'+i] = cardsValues[secondIdx];				

    							if(pos == '2'){
    								self.g_userCards['1_'+i] = removableGroup.create(coordinates.x-50, coordinates.y+70, 'cards', firstIdx);
    								self.g_userCards['2_'+i] = removableGroup.create(coordinates.x-20, coordinates.y+70, 'cards', secondIdx);
    								self.labels.userTotal[i] = self.add.text(coordinates.x-80, coordinates.y+80, total, {
    									font: "bold 18px Arial",
    									fill: "#000000"
    								});

    								self.labels.userMsgStatus[pos] = self.add.text(coordinates.x-30, coordinates.y+45, '',{
    								    font: "24px Arial",
    								    fill: "#ffffff"          
    								});	

    							}else{ 
    								self.g_userCards['1_'+i] = removableGroup.create(coordinates.x-150, coordinates.y-130, 'cards', firstIdx);
    								self.g_userCards['2_'+i] = removableGroup.create(coordinates.x-120, coordinates.y-130, 'cards', secondIdx);
    								self.labels.userTotal[i] = self.add.text(coordinates.x-180, coordinates.y-120, total, {
    									font: "bold 18px Arial",
    									fill: "#000000"
    								});
    								self.labels.userMsgStatus[pos] = self.add.text(coordinates.x-130, coordinates.y-155, '',{
    								    font: "24px Arial",
    								    fill: "#ffffff"          
    								});	
    							}

    							removableGroup.addChild(self.labels.userTotal[i]);	
    							removableGroup.addChild(self.labels.userMsgStatus[pos]);
    						}
    						
    						buttonActionGroup.visible = true;	
    						removableGroup.forEach(function(item){
    							if(item.key =='frame'){
    								item.inputEnabled = false;					
    							}
    						});						
    						self.g_pointer = removableGroup.create(self.g_userCards['1_' + self.g_counter].x-20, self.g_userCards['1_' + self.g_counter].y+50, 'pointer');
    						if(self.g_userCards['total_' + self.g_counter] == 21){
    							self.standBet(null, true);
    						}

    						if(self.g_userCards['total_' + self.g_counter] == 10 || self.g_userCards['total_' + self.g_counter] == 11){
    							self.buttons.doubles.visible = true;
    						}else{
    							self.buttons.doubles.visible = false;
    						}

    						if (self.g_dealerCards['total_' + 0] == 11){
                                self.buttons.insurance.visible = true;
    						}

    						if(self.g_userCards['point1_' + self.g_counter] == self.g_userCards['point2_' + self.g_counter]){
    							self.buttons.split.visible = true;
    						}
    					}else{
    						self.updateGameInfo($.client.getLocalizedString('TEXT_NOT_ACCEPTED_BET', true));
    					}

    				}, function(err){
    					console.log(err);
    					buttonStakeGroup.visible = true;
    					chipsGroup.visible = true;
    				}
    			);
            }else{
                self.updateGameInfo($.client.getLocalizedString('TEXT_NO_CHIPS', true));
            }
		}		
	},	

	splitCards: function(element){
		var self = this;
		var splite = {}, userCards=[], cardIdx, cardIdx2, counter = 0, tween, pos;
		splite.type = 'split';
		splite.position = self.g_counter;
		splite.sessionId = self.g_SessionId;
		$.client.sendPost(JSON.stringify(splite),
			function (msg) {
                // console.log('splitCards_msg', msg);
                self.buttons.split.visible = false;				
                self.g_splitPosition.push(self.g_counter);

                userCards.push({
                    total: self.g_userCards['point1_' + self.g_counter],
                    point1: self.g_userCards['point1_' + self.g_counter],
                    position: self.g_userCards['position_' + self.g_counter],
                    '1_0': self.g_userCards['1_' + self.g_counter],
                    place: self.g_userCards['position_' + self.g_counter],
                    insurance: msg.ResponseData.insurance
                });


                userCards.push({
                    total: self.g_userCards['point2_' + self.g_counter],
                    point1: self.g_userCards['point2_' + self.g_counter],
                    position: self.g_userCards['position_' + self.g_counter],
                    '1_0': self.g_userCards['2_' + self.g_counter],
                    place: self.g_userCards['position_' + self.g_counter]+'.2',
                    insurance: msg.ResponseData.insurance
                });

                delete(self.g_userCards['total_' + self.g_counter]);
                delete(self.g_userCards['point1_' + self.g_counter]);
                delete(self.g_userCards['point2_' + self.g_counter]);
                delete(self.g_userCards['position_' + self.g_counter]);
                delete(self.g_userCards['1_' + self.g_counter]);
                delete(self.g_userCards['2_' + self.g_counter]);

                self.g_userCards[self.g_counter] = [];
                self.g_userCards[self.g_counter] = self.g_userCards[self.g_counter].concat(userCards);

                cardIdx = self.getCards(msg.ResponseData.card);
                cardIdx2 = self.getCards(msg.ResponseData.card2);
                if(self.g_counter ==0){
                    counter = self.g_counter + 1;
                }else{
                    counter = self.g_counter;
                }

                self.g_userCards[self.g_counter][0][self.g_localCounter + '_0'] = removableGroup.create(
                    self.g_userCards[self.g_counter][0][counter + '_0'].x+30,  
                    self.g_userCards[self.g_counter][0][counter + '_0'].y,
                    'cards',
                    cardIdx
                );  
                tween = Game.add.tween(self.g_userCards[self.g_counter][1][counter + '_0']).to({ 
                    x: self.g_userCards[self.g_counter][0][counter + '_0'].x, 
                    y: self.g_userCards[self.g_counter][0][counter + '_0'].y + 50
                    }, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, false
                );
                tween.onComplete.add(function(){
                    self.g_userCards[self.g_counter][1][self.g_localCounter + '_0'] = removableGroup.create(
                        self.g_userCards[self.g_counter][1][counter + '_0'].x+30,  
                        self.g_userCards[self.g_counter][1][counter + '_0'].y,
                        'cards',
                        cardIdx2
                    );

                }, this);

                

                if((self.g_userCards[self.g_counter][0]['total'] + cardsValues[cardIdx]) > 21 &&  cardsValues[cardIdx] == 11){
                    self.g_userCards[self.g_counter][0]['total'] += 1;
                }else{
                    self.g_userCards[self.g_counter][0]['total'] += cardsValues[cardIdx];
                }
                self.labels.userTotal[self.g_counter].setText( self.g_userCards[self.g_counter][0]['total']);

                if((self.g_userCards[self.g_counter][1]['total'] + cardsValues[cardIdx]) > 21 &&  cardsValues[cardIdx] == 11){
                    self.g_userCards[self.g_counter][1]['total'] += 1;
                }else{
                    self.g_userCards[self.g_counter][1]['total'] += cardsValues[cardIdx2];
                }

                if(self.g_userCards[self.g_counter][0]['total'] == 10 || self.g_userCards[self.g_counter][0]['total']==11){
                    self.buttons.doubles.visible = true;
                }else{
                    self.buttons.doubles.visible = false;
                }

                self.labels.userTotal[self.g_counter + 0.2] = self.add.text(
                    self.g_userCards[self.g_counter][1][counter + '_0'].x-60,
                    self.g_userCards[self.g_counter][1][counter + '_0'].y+80,
                    self.g_userCards[self.g_counter][1]['total'], {
                        font: "bold 18px Arial",
                        fill: "#000000"
                    }
                );
                pos = parseInt(msg.ResponseData.pos, 10);
                self.labels.userMsgStatus[pos + 0.2] = self.add.text(
                    self.g_userCards[self.g_counter][1][counter + '_0'].x-100,
                    self.g_userCards[self.g_counter][1][counter + '_0'].y+110, '',{
                        font: "24px Arial",
                        fill: "#ffffff"          
                    }
                ); 

                for(var key in self.g_BettingChipArray){
                    if(self.g_BettingChipArray.hasOwnProperty(key)){
                        if(self.g_BettingChipArray[key]['type'] == pos){
                            self.g_BettingChipArray[key]['chip']['chipText'].setText(self.roundFloat(msg.ResponseData.stack + msg.ResponseData.insurance, 2) + "x2");
                        }
                    }
                }
                self.g_BetAmount += parseFloat(msg.ResponseData.stack);
                self.g_GameBalance = msg.ResponseData.balance;
                self.updateBetAmount();
                self.updateMoneyInfo();

                removableGroup.addChild(self.labels.userTotal[self.g_counter + 0.2]);  
                removableGroup.addChild(self.labels.userMsgStatus[pos + 0.2]);  
			}, function(e){
				console.log(e);
			}
		);
	},

	hitCard: function(element){

		var self = this;
		var hitCard = {}, cardIdx, text='', splitPosItem = 0, counter = 0, pos = 0, userTotal, userCardsPos, labelsId;
		if(element.clicked){
			hitCard.type = "hit";
			hitCard.position = self.g_counter;
            hitCard.chipPos = self.g_chipPosition[self.g_counter];
            if(self.g_splitPosition.indexOf(self.g_counter) !== -1){
                hitCard.isSplit = true;
                hitCard.splitPos = self.g_splitPositionItem;
            }else{
                self.buttons.split.visible = false;
            }
			hitCard.sessionId = self.g_SessionId;
			$.client.sendPost(JSON.stringify(hitCard),
				function (msg) {
					// console.log('hit_msg', msg);
                    cardIdx = self.getCards(msg.ResponseData.card);
                    if(self.g_splitPosition.indexOf(self.g_counter) !== -1){
                        if(self.g_splitPositionItem == 1){
                            splitPosItem = 0.2;
                        }

                        userTotal = self.g_userCards[self.g_counter][self.g_splitPositionItem]['total'];
                        userCardsPos = self.g_userCards[self.g_counter][self.g_splitPositionItem];
                        pos = parseFloat(self.g_userCards[self.g_counter][self.g_splitPositionItem]['position']) + splitPosItem;
                        self.g_userCards[self.g_counter][self.g_splitPositionItem][self.g_localCounter + 1 + '_0'] = removableGroup.create(
                            self.g_userCards[self.g_counter][self.g_splitPositionItem][self.g_localCounter + '_0'].x+30,  
                            self.g_userCards[self.g_counter][self.g_splitPositionItem][self.g_localCounter + '_0'].y,
                            'cards',
                            cardIdx
                        );
                    }else{
                        userTotal = self.g_userCards['total_' + self.g_counter];
                        userCardsPos = self.g_userCards;
                        pos = parseFloat(self.g_userCards['position_'+ self.g_counter]);
                        self.g_userCards[self.g_localCounter + 1 + '_' + self.g_counter] = removableGroup.create(
                            self.g_userCards[self.g_localCounter + '_' + self.g_counter].x+30,  
                            self.g_userCards[self.g_localCounter + '_' + self.g_counter].y,
                            'cards',
                            cardIdx
                        );
                    }

                    if((userTotal + cardsValues[cardIdx]) > 21 &&  cardsValues[cardIdx] == 11){
                        userTotal = userTotal + 1;
                    }else{
                        userTotal = userTotal + cardsValues[cardIdx];
                    }

                    if(self.g_splitPosition.indexOf(self.g_counter) !== -1){
                        self.g_userCards[self.g_counter][self.g_splitPositionItem]['total'] = userTotal;
                    }else{
                        self.g_userCards['total_' + self.g_counter] = userTotal; 
                    }
                    self.labels.userTotal[self.g_counter + splitPosItem].setText(userTotal);
                    self.buttons.insurance.visible = false;
                    self.buttons.doubles.visible = false;

                    self.g_localCounter++;
                    if(userTotal == 21){
                        self.standBet(null, true);
                    }else if(userTotal > 21){
                        text = $.client.getLocalizedString('TEXT_BUST', true);
                        self.updateUserInfoText(pos, text);

                        if((self.g_splitPosition.indexOf(self.g_counter) !== -1) && self.g_splitPositionItem == 0){
                            self.g_splitPositionItem++;
                            self.g_localCounter = 2;
                            Game.add.tween(self.g_pointer).to({ 
                                x: self.g_userCards[self.g_counter][self.g_splitPositionItem][self.g_localCounter-1 + '_0'].x-20,
                                y: self.g_userCards[self.g_counter][self.g_splitPositionItem][self.g_localCounter-1 + '_0'].y+50
                                }, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, false
                            );                                                       
                        }else if(self.g_counter == self.g_numPlace){
                            element.clicked = false;
                            self.showDealerCards();
                        }else{
                            element.clicked = true;                         
                            self.g_counter +=1;

                            if(self.g_splitPosition.indexOf(self.g_counter) !== -1){
                                userTotal = self.g_userCards[self.g_counter][self.g_splitPositionItem]['total'];
                            }else{
                                userTotal = self.g_userCards['total_' + self.g_counter];
                            }                            
                            self.g_splitPositionItem = 0;
                            Game.add.tween(self.g_pointer).to({ 
                                x: self.g_userCards['1_' + self.g_counter].x-20,
                                y: self.g_userCards['1_' + self.g_counter].y+50
                                }, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, false
                            );
                            self.g_localCounter = 2;

                            if((self.g_userCards['point1_' + self.g_counter] == self.g_userCards['point2_' + self.g_counter]) && (self.g_splitPosition.indexOf(self.g_counter) == -1)){
                               self.buttons.split.visible = true;
                            }else{
                                self.buttons.split.visible = false;
                            }

                        }
                    }
				}, function(err){
					console.log(err);
				});
		}
	},
	doubleBet: function(element){
		var self = this;
		var doubleCard = {}, cardIdx, sum = 0, pos = 0, splitPosItem = 0, userTotal;
		doubleCard.type = 'double';
		doubleCard.position = self.g_counter;
		doubleCard.sessionId = self.g_SessionId;
		doubleCard.chipPos = self.g_chipPosition[self.g_counter];
        if(self.g_splitPosition.indexOf(self.g_counter) !== -1){
            doubleCard.isSplit = true;
            doubleCard.splitPos = self.g_splitPositionItem;
        }
        self.buttons.split.visible = false;
        self.buttons.doubles.visible = false;

		if(element.clicked){
			$.client.sendPost(JSON.stringify(doubleCard),
			function (msg) {
				// console.log('double_msg', msg);	
                cardIdx = self.getCards(msg.ResponseData.card);

                if(self.g_splitPosition.indexOf(self.g_counter) !== -1){
                    if(self.g_splitPositionItem == 1){
                        splitPosItem = 0.2;
                    }

                    pos = parseInt(msg.ResponseData.pos, 10);
                    self.g_userCards[self.g_counter][self.g_splitPositionItem]['total'] += cardsValues[cardIdx];
                    userTotal = self.g_userCards[self.g_counter][self.g_splitPositionItem]['total'];

                    self.g_userCards[self.g_counter][self.g_splitPositionItem][self.g_localCounter + 1 + '_0'] = removableGroup.create(
                        self.g_userCards[self.g_counter][self.g_splitPositionItem][self.g_localCounter + '_0'].x+30,  
                        self.g_userCards[self.g_counter][self.g_splitPositionItem][self.g_localCounter + '_0'].y,
                        'cards',
                        cardIdx
                    );
                }else{
                    pos = self.g_userCards['position_' + self.g_counter];
                    self.g_userCards['total_' + self.g_counter] += cardsValues[cardIdx];
                    userTotal = self.g_userCards['total_' + self.g_counter];

                    self.g_userCards[self.g_localCounter + 1 + '_' + self.g_counter] = removableGroup.create(
                        self.g_userCards[self.g_localCounter + '_' + self.g_counter].x+30,  
                        self.g_userCards[self.g_localCounter + '_' + self.g_counter].y,
                        'cards',
                        cardIdx
                    );
                }
                   
                self.labels.userTotal[self.g_counter + splitPosItem].setText(userTotal);                 
                self.g_localCounter++;

                for(var key in self.g_BettingChipArray){
                    if(self.g_BettingChipArray.hasOwnProperty(key)){
                        if(self.g_BettingChipArray[key]['type'] == pos){
                            sum = (parseFloat(msg.ResponseData.stack) * 2) + parseFloat(msg.ResponseData.insurance);                            
                            if(self.g_splitPosition.indexOf(self.g_counter) !== -1){
                                if(self.g_splitPositionItem == 0){
                                    sum = sum + '+' + msg.ResponseData.stack;
                                }else if(self.g_splitPositionItem == 1){
                                   sum = msg.ResponseData.prevVal + '+' + sum;
                                }
                            }

                            self.g_BettingChipArray[key]['chip']['chipText'].setText(sum);
                        }
                    }
                }

				self.g_BetAmount += parseFloat(msg.ResponseData.stack);
				self.g_GameBalance = msg.ResponseData.balance;
				self.updateBetAmount();
				self.updateMoneyInfo();
                self.standBet(null, true);

                /*if(userTotal == 21){
                    self.standBet(null, true);
                }*/

			}, function(err){
				console.log(err);
			});

		}
	},

	standBet: function(element, isAuto){
		var self = this;
        var userTotal, insurance = 0;
		if(isAuto == undefined){
			isAuto = false;
		}
		if ((element && element.clicked) || isAuto){
			this.buttons.hit.clicked = true;
            this.g_localCounter = 2;
            
            if(self.g_splitPosition.indexOf(self.g_counter) !== -1 ){
                userTotal = self.g_userCards[self.g_counter][self.g_splitPositionItem]['total'];
                insurance = self.g_userCards[self.g_counter][self.g_splitPositionItem]['insurance'];	               
            }else{
                userTotal = self.g_userCards['total_' + self.g_counter];
            }

            if((self.g_splitPosition.indexOf(self.g_counter) !== -1 ) && self.g_splitPositionItem == 0){
                self.g_splitPositionItem++;
                Game.add.tween(self.g_pointer).to({ 
                    x: self.g_userCards[self.g_counter][self.g_splitPositionItem][self.g_localCounter-1 + '_0'].x-20,
                    y: self.g_userCards[self.g_counter][self.g_splitPositionItem][self.g_localCounter-1 + '_0'].y+50
                    }, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, false
                );
                if(userTotal == 10 || userTotal == 11){
                    self.buttons.doubles.visible = true;
                }else{
                    self.buttons.doubles.visible = false;
                }
                if (self.g_dealerCards['total_' + 0] == 11 && insurance <= 0 ){
                    self.buttons.insurance.visible = true;
                }else{
                    self.buttons.insurance.visible = false;
                }

            }else if(this.g_counter < this.g_numPlace){
                this.g_counter +=1;
                Game.add.tween(self.g_pointer).to({ 
                    x: self.g_userCards['1_' + self.g_counter].x-20, 
                    y: self.g_userCards['1_' + self.g_counter].y+50 
                    }, 500, Phaser.Easing.Quadratic.Out, true, 0, 0, false
                );  
                if( (self.g_splitPosition.indexOf(self.g_counter) == -1) && (self.g_userCards['point1_' + self.g_counter] == self.g_userCards['point2_' + self.g_counter])){
                   self.buttons.split.visible = true;
                }else{
                    self.buttons.split.visible = false;
                }
                if(self.g_userCards['total_' + self.g_counter] == 21){
                    self.standBet(null, true);
                }
                if(self.g_userCards['total_' + self.g_counter] == 10 || self.g_userCards['total_' + self.g_counter]==11){
                    self.buttons.doubles.visible = true;
                }else{
                    self.buttons.doubles.visible = false;
                }
                if (self.g_dealerCards['total_' + 0] == 11 && insurance <= 0 ){
                    self.buttons.insurance.visible = true;
                }else{
                    self.buttons.insurance.visible = false;
                }
                self.g_splitPositionItem = 0;
                
            }else{
                self.showDealerCards();
            }

           
		}
	},

	insuranceBet: function(){
		var self = this;
		var insurance = {}, sum = 0, pos = 0;
		insurance.type = 'insurance';
		insurance.position = self.g_counter;
		insurance.sessionId = self.g_SessionId;
		insurance.chipPos = self.g_chipPosition[self.g_counter];
        if(self.g_splitPosition.indexOf(self.g_counter) !== -1){
            insurance.isSplit = true;
            insurance.splitPos = self.g_splitPositionItem;
        }
		$.client.sendPost(JSON.stringify(insurance),
			function (msg) {
				//console.log('insurance_msg', msg);
				if(msg.ResponseData.success){
                    pos = parseInt(msg.ResponseData.pos, 10);
                    if(self.g_splitPosition.indexOf(self.g_counter) !== -1){
                        for(var key in self.g_BettingChipArray){
                            if(self.g_BettingChipArray.hasOwnProperty(key)){
                                if(self.g_BettingChipArray[key]['type'] == pos){
                                    sum = parseFloat(msg.ResponseData.totalInsurance);                                    
                                    if(self.g_splitPositionItem == 0){
                                        sum = sum+'+'+ msg.ResponseData.stack;
                                    }else if(self.g_splitPositionItem == 1){
                                       sum = msg.ResponseData.stack + '+'+ sum;
                                    }

                                    self.g_BettingChipArray[key]['chip']['chipText'].setText(sum);
                                }
                            }
                        }
                    }else{
    					for(var key in self.g_BettingChipArray){
    						if(self.g_BettingChipArray.hasOwnProperty(key)){
    							if(self.g_BettingChipArray[key]['type'] == self.g_userCards['position_' + self.g_counter]){
    								sum = parseFloat(msg.ResponseData.totalInsurance);
    								self.g_BettingChipArray[key]['chip']['chipText'].setText(sum);
    							}
    						}
    					}
                    }

					self.g_BetAmount = parseFloat(self.g_BetAmount) + parseFloat(msg.ResponseData.insurance);
					self.g_GameBalance = msg.ResponseData.balance;
					self.updateBetAmount();
					self.updateMoneyInfo();

                    if (self.g_dealerCards['total_' + 0] == 11){    
    					self.buttons.insurance.visible = false;
    				}else{
    					self.buttons.insurance.visible = true;
    				}
                }
			}, function(err){
				console.log(err);
			}
		);
	},

	showDealerCards: function(){
		var secondDealerCard, totalDealerCard = 0, cardIdx, stake = {}, getDealerCard = {}, balance = {}, text = '', pos = 0;
		var self = this;
		self.buttons.stand.clicked = false;
		self.g_localCounter = 1;
		getDealerCard.type = "get_dealer_cards";
		getDealerCard.sessionId = self.g_SessionId;

		$.client.sendPost(JSON.stringify(getDealerCard),
			function (msg) {
				//console.log('get_dealer_cards_msg', msg);
				secondDealerCard = self.getCards(msg.ResponseData.cards[0]);
				self.g_dealerCards[1].loadTexture('cards', secondDealerCard);
				self.g_dealerCards['total_' + 1] = cardsValues[secondDealerCard];
				totalDealerCard = self.g_dealerCards['total_' + 0] + self.g_dealerCards['total_' + 1];

				if(msg.ResponseData.cards.length > 1){
					for (var i = 1; i < msg.ResponseData.cards.length; i++) {
						cardIdx = self.getCards(msg.ResponseData.cards[i]);
						self.g_dealerCards[self.g_localCounter + 1] = removableGroup.create(
							self.g_dealerCards[self.g_localCounter].x + 80,  
							self.g_dealerCards[self.g_localCounter].y,
							'cards',
							cardIdx
						);
						totalDealerCard += cardsValues[cardIdx];
						if(totalDealerCard > 21 && cardsValues[cardIdx] == 11){
							totalDealerCard -= 10;
						}
						self.g_localCounter++;
					}
				}

				self.labels.dealerTotal.setText(totalDealerCard);
				if (totalDealerCard > 21){
					text = $.client.getLocalizedString('TEXT_BUST', true);
					self.updateDealerInfoText(text);
				}

				stake.type = "stake";
				stake.sessionId = self.g_SessionId;
				$.client.sendPost(JSON.stringify(stake),
					function (msg) {
						// console.log('stake_msg', msg);

						if(msg.ResponseData['stake'].length > 0){ 
							for (var i = 0; i < msg.ResponseData['stake'].length; i++) {
                                pos = parseFloat(msg.ResponseData.stake[i]['pos']);                                
								if(msg.ResponseData.stake[i]['status'] == 'win'){
									text = $.client.getLocalizedString('TEXT_WON', true)+''+ msg.ResponseData.stake[i]['gainings'];
								}else if(msg.ResponseData.stake[i]['status'] == 'push'){
									text =  $.client.getLocalizedString('TEXT_PUSH', true)
								}else{
									text = $.client.getLocalizedString('TEXT_LOSE', true);
                                }
								self.updateUserInfoText(pos, text);
							}
						}

                        balance.type = "balance";
                        balance.sessionId = self.g_SessionId;

                        $.client.sendPost(JSON.stringify(balance),
                            function (msg) {
                                self.g_GameBalance = msg.ResponseData.balance;
                                self.updateMoneyInfo();
                            }, function(err){
                                console.log(err);
                            }
                        );

						buttonNewGameGroup.visible = true;
						buttonActionGroup.visible = false;				
						
					}, function(err){
						console.log(err);
					}
				);
			}, function(err){
				console.log(err);
			}
		);
	
	},
	newGame: function(){
		var balance = {};
		var self = this;
		
		buttonNewGameGroup.visible = false;
		buttonStakeGroup.visible = true;
		chipsGroup.visible = true;

		if(this.g_BettingChipArray.length > 0){
			for (var i = this.g_BettingChipArray.length - 1; i >= 0; i--) {
				this.g_BettingChipArray[i].chip.chipClone.destroy();
			}	
		}		
		removableGroup.removeAll(true);
		this.g_BettingChipArray =  [];
		this.g_BetAmount = 0;
		this.resetValues();
		this.buttons.deal.clicked = false;
		this.buttons.hit.clicked = true;
		balance.type = "balance";
		balance.sessionId = self.g_SessionId;

		$.client.sendPost(JSON.stringify(balance),
			function (msg) {
				self.g_GameBalance = msg.ResponseData.balance;
				self.updateMoneyInfo();
				for (var i = 0; i < tableItem.length; i++) {
					self.tableCell[i].inputEnabled = true;
				}
			}, function(err){
				console.log(err);
			}
		);

	},

	repeatGame: function(){
        for(var key in this.g_stack){
            if(this.g_stack.hasOwnProperty(key)){
                for(var key2 in this.g_BettingChipArray){
                    if(this.g_BettingChipArray.hasOwnProperty(key2)){
                        if(this.g_BettingChipArray[key2]['type'] == this.g_stack[key]['pos']){
                            this.g_BettingChipArray[key]['chip']['chipText'].setText(this.g_stack[key]['stack']);
                        }
                    }
                }
            }
        }
		removableGroup.removeAll(true);
		this.resetValues();
		buttonNewGameGroup.visible = false;
		buttonStakeGroup.visible = true;
		chipsGroup.visible = true;
		this.buttons.deal.clicked = true;
		this.buttons.hit.clicked = true;
		this.confirmBets();
	},

	resetValues: function(){
		this.g_dealerCards = []; 
		this.g_userCards = []; 
		this.g_counter = 0; 
        this.g_splitPosition = [];
        this.g_splitPositionItem = 0;
		this.g_numPlace = 0;
		this.g_localCounter = 2;
		this.g_pointer = null;
        this.g_stack = [];
		this.updateBetAmount();
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
	undoBet: function(bet){
		var destroyChip, chip, text;
		if(bet.clicked == true){
			destroyChip = this.g_BettingChipArray.pop();
		}else{
			destroyChip = bet;
		}
		if(destroyChip){
    		chip = destroyChip.chip;
    		if (this.g_BetAmount > 0) {
    		    this.g_BetAmount -= destroyChip.value;
    		    this.g_GameBalance += destroyChip.value;
    		    this.updateBetAmount();
    		    this.updateMoneyInfo();
    		}
    		if(chip){
    			chip.chipClone.destroy();
    		}
            if(this.g_BettingChipArray.length > 0){
                for(var i=0; i < this.g_BettingChipArray.length; i++){
                    this.g_BettingChipArray[i].total = this.roundFloat(this.g_BettingChipArray[i].total, 2);
                    if(this.g_BettingChipArray[i].total >= this.g_selectedLimitArray[this.g_limitPlateId]['Bet']['Min']){
                        this.buttons.deal.clicked = true;
                        text = '';
                    }else{
                        text =  $.client.getLocalizedString('TEXT_MIN_BET', true) + $.client.UserData.CurrencySign + this.g_selectedLimitArray[this.g_limitPlateId]['Bet']['Min'];
                        this.buttons.deal.clicked = false;
                    }
                }
                this.updateGameInfo(text);
            }
		}
	},

	clearAllBet: function(all){
		var destroyChips;
		destroyChips = this.g_BettingChipArray;
		if(destroyChips.length > 0){
			for (var i = destroyChips.length - 1; i >= 0; i--) {
				this.undoBet(all);
			}
		}
	},

	showVideo: function (){},

	updateMoneyInfo: function() {
        this.labels.userBalance.setText($.client.UserData.CurrencySign + parseFloat(this.g_GameBalance).toFixed(2));
    },
    updateUserInfoText: function(id, text){
    	if(id == undefined){
    		id = 0;
    	}
    	if(text == undefined){
    		text = $.client.getLocalizedString('TEXT_BUST', true);
    	}

    	this.labels.userMsgStatus[id].setText(text);
    },

    updateDealerInfoText: function(text){
    	if(text == undefined){
    		text = $.client.getLocalizedString('TEXT_BUST', true);
    	}

    	this.labels.dealerMsgStatus.setText(text);
    },
	updateBetAmount: function() {
        var amount = this.g_BetAmount==0 ? 0 : parseFloat(this.g_BetAmount).toFixed(2);
        this.labels.betAmount.setText($.client.UserData.CurrencySign + amount);
    },
    updateGameInfo: function(text){
    	if(text !== undefined){
    		this.labels.gameInfoMsg.setText(text)
    	}
    },
    updateLimitPlate: function(id, array){
    	var text;
    	text =  $.client.getLocalizedString('TEXT_MIN', true) + $.client.UserData.CurrencySign + array[id]['Bet']['Min'] 
			+ '  ' + $.client.getLocalizedString('TEXT_MAX', true) + $.client.UserData.CurrencySign + array[id]['Bet']['Max']; 
    	this.labels.limitPlate.setText(text);
    },
    messageDispatcher: function(response) {
    	//console.log('response',response);
        var msg = response.message;
        var self = this;
        if (response.type == "user") {
            if (msg.sessionId != "") {
            	self.g_nick = msg.user.nick;
				self.g_GameBalance = msg.user.balance;
                self.g_SessionId = msg.user.sessionId;
            }
        }else if (response.type == "win") {
        	self.g_GameBalance = msg.balance;
        	self.updateMoneyInfo();
        }else if(response.type =="lose"){
        	self.g_GameBalance = msg.balance;
        	self.updateMoneyInfo();
        }
    }
};