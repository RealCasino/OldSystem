var chips_cost, g_SessionId, worldGroup, headerGroup, chipsGroup, footerGroup, selectedChipsGroup, buttonStakeGroup, buttonActionGroup,
	buttonNewGameGroup, removableGroup, limitPopupGroup, frameGroup, popupWinGroup, limitGroup, selectedChipId, selectedChip, tableItem,
	cards, cardsValues, gameFrame, gameFrameH, gameFrameW;
chips_cost = [0.1, 1, 5, 10, 25, 50];
cards = [
    'AC','2C','3C','4C','5C','6C','7C','8C','9C', '10C', 'JC', 'QC', 'KC',
    'AD','2D','3D','4D','5D','6D','7D','8D','9D', '10D', 'JD', 'QD', 'KD',
    'AH','2H','3H','4H','5H','6H','7H','8H','9H', '10H', 'JH', 'QH', 'KH',
    'AS','2S','3S','4S','5S','6S','7S','8S','9S', '10S', 'JS', 'QS', 'KS'
];
cardsValues = [
    11,2,3,4,5,6,7,8,9,10,10,10,10,
    11,2,3,4,5,6,7,8,9,10,10,10,10,
    11,2,3,4,5,6,7,8,9,10,10,10,10,
    11,2,3,4,5,6,7,8,9,10,10,10,10
];

var BlackjackBoot = {
	init: function () {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;
        this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
        this.scale.setUserScale(SCALE, SCALE);
        this.scale.refresh();
    },

	create: function () {
		game.state.start('Load');
	}
};
var BlackjackLoad = function(game){
    Global = {
        betAmount: 0,
        gameBalance: 0,
        dealerCards:[],
        userCards:[],
        counter:0,
        localCounter: 2,
        pointer: null,
        bettingChipArray: [],
        limitPlateId:0,
        selectedLimitArray:[],
        splitPosition:[],
        splitPositionItem:0,
        isModalShow:false,
        historyArray:[],
        chipPosition:[],
        gameRound:'',
        activedPosChips: [],
        msgTimer:0
    };
};


BlackjackLoad.prototype = {
	preload: function() {
	    this.game.stage.backgroundColor = '#ffffff';
        this.load.image('gameFrame', '../Client2/images/phone_game_frame.png');
        this.load.spritesheet('chips', '../Client2/images/chips.png', 85, 85);
        this.load.spritesheet('bottomBtnBg', '../Client2/images/land_bottom_btn_bg.png', 142, 71);
        this.load.spritesheet('gameBtnBg', '../Client2/images/phone_game_btn_bg.png', 131, 51);
        this.load.spritesheet('icons', '../Client2/images/btn_icons.png', 32, 27);
        this.load.spritesheet('placeChips', '../Client2/images/phone_place_chips.png', 85, 104);
        this.load.spritesheet('btnBg', '../Client2/images/land_btn_bg.png', 160, 50);
        this.load.image('dealerCardsPlace', '../Client2/images/place_dealer_cards.png');
        this.load.spritesheet('statusStake', '../Client2/images/status_stake.png', 90, 35);
        this.load.image('historyBg', '../Client2/images/history_bg.png');
        this.load.image('limitsBg', '../Client2/images/limit_bg.png');
        this.load.image('modalBoxBg', '../Client2/images/modal_bg.png');
        this.load.image('closeBtn', '../Client2/images/modal_close_btn.png');
        this.load.image('cashin', '../Client2/images/cashin.png');
        this.load.spritesheet('limitBtnBg', '../Client2/images/limit_btn_bg.png', 545, 59);
        this.load.spritesheet('statusBg', '../Client2/images/status_bg.png', 1600, 61);
        this.load.spritesheet('landGameBtnBg', '../Client2/images/land_game_btn_bg.png', 188, 60);
        this.load.spritesheet('landPlaceChips', '../Client2/images/place_chips.png', 98, 120);
        this.load.spritesheet('cards', '../Client2/images/cards.png', 79, 123);
        this.load.image('pointer', '../Client2/images/pointer.png');

        this.load.spritesheet('landStatusStake', 'images/land_status_stake.png', 130, 50);
        this.load.image('landPointer', 'images/land_pointer.png');
        this.load.image('landDealerCardsPlace', 'images/land_place_dealer_cards.png');
        this.load.spritesheet('landCards', 'images/land_cards.png', 120, 186.8);
        this.load.image('landGameFrame', 'images/land_game_frame.png');

		this.game.load.onFileComplete.add(this.updateProgressBar, this);
	},
    updateProgressBar:function(progress){
        if(progress < 90){
            $.client.setProgressBarPercent(progress);
        }
    },
	create: function () {
		var self = this;
		function startGame() {
	        if ($.client.UserData) {
	        	if (window.parent.matchMedia("(orientation: portrait)").matches){
	            	self.state.start('PortraitMain');
	        	}else{
	        		self.state.start('LandscapetMain');
	        	}
	        } else {
	            setTimeout(function () {
	                startGame();
	            },200);
	        }
	    }

        window.matchMedia("(orientation: portrait)").addListener(function(m) {
            if(m.matches) {
                // Changed to portrait
                mode = modes.portrait;
                GAME_WIDTH = 750;
                GAME_HEIGHT = 1334;
                changeVideoSize();
                SCALE = Math.min($(document).innerWidth() / GAME_WIDTH, $(document).innerHeight() / GAME_HEIGHT);
                game.scale.setGameSize(GAME_WIDTH, GAME_HEIGHT);
                game.scale.setUserScale(1, 1);
                game.scale.refresh();
                game.scale.setUserScale(SCALE, SCALE);
                game.scale.refresh();
                game.state.start('PortraitMain', true, false, Global);
            }else {
                // Changed to landscape
                mode = modes.landscape;
                GAME_WIDTH = 1600;
                GAME_HEIGHT = 980;
                changeVideoSize();
                SCALE = Math.min($(document).innerWidth() / GAME_WIDTH, $(document).innerHeight() / GAME_HEIGHT);
                game.scale.setGameSize(GAME_WIDTH, GAME_HEIGHT);
                game.scale.setUserScale(1, 1);
                game.scale.refresh();
                game.scale.setUserScale(SCALE, SCALE);
                game.scale.refresh();
                game.state.start('LandscapetMain', true, false, Global);
            }
        });

        startGame();

	}
};