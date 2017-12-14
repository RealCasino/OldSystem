var Module = {};
App = function() {
    var self = this;
    var lobbyTemplate;
    var catalogId;
    var sessionToken;
    var lobbyUrl;
    self.initialize = function (callback) {
        var templatePath;
        var params = getQueryParams(document.location.search);
        catalogId = params.catalogId;
        sessionToken = params.sessionToken;
        lobbyUrl = params.lobbyUrl;
        self.showSpinner();
        if (isMobile.any()) {
            templatePath = "templates/Lobby.mob.hbs.html";
        } else {
            templatePath = "templates/Lobby.hbs.html";
        }
        $.ajax({
            url: templatePath,
            async: true,
            success: function(data) {
                self.hideSpinner();
                lobbyTemplate = Handlebars.compile(data);
                if (callback)
                    callback();
            },
            error: function() {
                self.hideSpinner();
                console.log("load error");
            }
        });
        return self;
    };
    self.start = function() {
        self.showSpinner();
            $.ajax({
                url: CATALOG_BASE_URL + catalogId + ".json",
                async: true,
                success: function (data) {
                    self.hideSpinner();
                    $(".main").hide();
                    $(".main").append(lobbyTemplate(data));
                    $(".game-block").click(function() {
                        $("#link").trigger("mouseover");
                    });
                    $(".game-item-playbtn").click(function() {
                        self.startGame({
                            gameId: $(this).data("game-id"),
                            instanceId: $(this).data("instance"),
                            loaderUrl: $(this).data("loader-url")
                        });
                    });
                    $(".category-item").click(function() {
                        var target = $(this);
                        $(".category-item").removeClass("selected");
                        target.addClass("selected");
                        $(".category-wrapper").hide();
                        if (target.data("id") === "all") {
                            $(".category-wrapper").fadeIn(800);;
                        } else {
                            $("#" + target.data("id")).fadeIn(800);;
                        }
                    });
                    if (getCookie("gameId")) {
                        var gameId = getCookie("gameId");
                        createCookie("gameId", "");
                        var previousGame;
                        for (var i = 0; i < data.categories.length; i++) {
                            for (var j = 0; j < data.categories[i].games.length; j++) {
                                if (gameId === data.categories[i].games[j].instanceId) {
                                    previousGame = data.categories[i].games[j];
                                }
                            }
                        }
                        if (previousGame) {
                            self.startGame({
                                gameId: previousGame.gameId,
                                instanceId: previousGame.instanceId,
                                loaderUrl: previousGame.loaderUrl
                            });
                        } else {
                            $(".main").fadeIn(300);
                        }
                    } else {
                        $(".main").fadeIn(300);
                    }
                },
                error: function() {
                    self.hideSpinner();
                    console.log("load error");
                }
            });
    };
    self.startGame = function (cfg) {
        var params = {};
        if (lobbyUrl) {
            params.lobbyUrl = lobbyUrl;
        } else {
            params.lobbyUrl = window.location.href;
        }
        if (sessionToken){
			params.sessionToken = sessionToken;
		}		
        var gameUrl = "{0}&{1}".format(cfg.loaderUrl, $.param(params));
        window.location.href = gameUrl;
    };
    self.showSpinner = function() {
        $("#spinner").show();
    };
    self.hideSpinner = function () {
        $("#spinner").hide();
    }
    return self;
};