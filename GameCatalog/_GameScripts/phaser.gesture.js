GESTURE = {};
SWIPE_ACC = 2.2;
GESTURE = function (obj) {
    var gesture= {};
    var time = 350;
    var positionStart;
    var swipeDistance=0;
    var currentSwipeElement;
    var currentTapElement;
    var wheeling = false;
    var positionDown;

    function init(game) {
        gesture.game = game;

        gesture.swipeDispatched = false;
        gesture.holdDispatched = false;

        gesture.isTouching = false;
        gesture.isHolding = false;

        gesture.onSwipe = new Phaser.Signal();
        gesture.onTap = new Phaser.Signal();
        gesture.onHold = new Phaser.Signal();

        function isPointerOver(ctx) {
            var ptr = gesture.game.input.mousePointer;
            if (ctx.x < ptr.x && ctx.y < ptr.y && (ctx.x + ctx.width) > ptr.x && (ctx.y + ctx.height) > ptr.y)
                return true;
            else
                return false;
        }

        function wheelHandler(event, delta) {
            var scrollDelta;
            var timeout;
            var context, swipeDir = "vertical", direction;
            if (delta != undefined) {
                timeout = 10;
                if (delta>0) {
                    direction = "up";
                } else {
                    direction = "down";
                }
                scrollDelta = Math.abs(delta * 150);
            } else {
                if (gesture.game.input.mouse.wheelDelta === Phaser.Mouse.WHEEL_UP) {
                    direction = "up";
                } else {
                    direction = "down";
                }
                timeout = 10;
                scrollDelta = Math.abs(event.wheelDeltaY) / 12;
            }
            if (!wheeling) {
                if (currentSwipeElement) {
                    for (var i = 0; i < this.onSwipe._bindings.length; i++) {
                        context = this.onSwipe._bindings[i].context;
                        if (currentSwipeElement == context && isPointerOver(context)) {
                            swipeDir = "vertical";
                            gesture.onSwipe._bindings[i]._listener(context, { direction: direction, distance: scrollDelta });
                        }
                    }
                }
                for (i = 0; i < gesture.onSwipe._bindings.length; i++) {
                    context = gesture.onSwipe._bindings[i].context;
                    if (context.direction.indexOf(swipeDir) > 0 && isPointerOver(context)) {
                        gesture.onSwipe._bindings[i]._listener(context, { direction: direction, distance: scrollDelta });
                    }
                }
                wheeling = true;
                setTimeout(function () {
                    wheeling = false;
                }, timeout);
            }
        };
        game.input.mouse.mouseWheelCallback=wheelHandler;
        if (gesture.game.canvas.addEventListener) {
            // IE9, Chrome, Safari, Opera
            gesture.game.canvas.addEventListener("mousewheel", mouseWheelHandler.bind(this), true);
            // Firefox
            gesture.game.canvas.addEventListener("DOMMouseScroll", mouseWheelHandler.bind(this), true);
        }
            // IE 6/7/8
        else gesture.game.canvas.attachEvent("onmousewheel", mouseWheelHandler.bind(this));

        function mouseWheelHandler(e) {
            game.input.mouse.mouseWheelCallback = null;
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            wheelHandler(e, delta);
            return false;
        };
        
        return gesture;
    }

    gesture.addOnSwipe = function (func, elem, cfg) {
        elem.direction = (cfg && cfg.direction) ? cfg.direction : "horizontal|vertical";
        gesture.onSwipe.add(func, elem);
        elem.events.onInputDown.add(function (el) {
            currentSwipeElement = el;
        }, this);
        elem.events.onInputUp.add(function (el) {
            for (var i = 0; i < this.onSwipe._bindings.length; i++) {
              var  context = this.onSwipe._bindings[i].context;
               this.onSwipe._bindings[i]._listener(context, { direction: '', distance: 0,end:true });
            }

        }, this);
    };
    gesture.addOnTap = function (func, elem, cfg) {
        gesture.onTap.add(func, elem);
        elem.events.onInputDown.add(function (el) {
            currentTapElement = el;
        }, this);
    };
    gesture.update = function () {
        var distance = Phaser.Point.distance(gesture.game.input.activePointer.position, gesture.game.input.activePointer.positionDown);
        var duration = gesture.game.input.activePointer.duration;
        this.updateSwipe(distance, duration);
        this.updateTouch(distance, duration);
    };

    gesture.updateSwipe = function (distance, duration) {
        if (!this.swipeDispatched) {
            positionStart = gesture.game.input.activePointer.positionDown;
            swipeDistance = 0;
        }
        if (duration === -1) {
            this.swipeDispatched = false;
            time = gesture.TIMES.SWIPE;
            currentSwipeElement = null;
        } else if (distance > 3 && duration < time) {
            time += gesture.TIMES.SWIPE;
            if (positionDown)
                positionDown = gesture.game.input.activePointer.positionDown;
            this.swipeDispatched = true;
            var direction="";
            var x = positionDown.x - gesture.game.input.x;
            var y = positionDown.y - gesture.game.input.y;
            if (Math.abs(x) > Math.abs(y) && x > 0) {
                direction='left';
            } else if (Math.abs(x) > Math.abs(y) && x < 0) {
                direction='rigth';
            } else if (Math.abs(y) > Math.abs(x) && y > 0) {
                direction='up';
            } else if (Math.abs(y) > Math.abs(x) && y < 0) {
                direction='down';
            }
            swipeDistance = swipeDistance != 0 ? (distance - swipeDistance)*SWIPE_ACC : 0;
            var context,swipeDir;
            if (currentSwipeElement) {
                for (var i = 0; i < this.onSwipe._bindings.length; i++) {
                    context = this.onSwipe._bindings[i].context;
                    if (currentSwipeElement == context) {
                        if ((direction == "rigth" || direction=="left") && context.direction=="horizontal")
                            swipeDir = "horizontal";
                        else if ((direction == "up" || direction == "down") && context.direction == "vertical")
                            swipeDir = "vertical";

                        this.onSwipe._bindings[i]._listener(context, { direction: direction, distance: swipeDistance, end: false });
                    }
                }
            }
            for (i = 0; i < this.onSwipe._bindings.length; i++) {
                context = this.onSwipe._bindings[i].context;
                if (context.direction.indexOf(swipeDir)<0) {
                    if (context.x < positionDown.x && context.x + context.width > positionDown.x) {
                        if (context.y < positionDown.y && context.y + context.height > positionDown.y) {
                            this.onSwipe._bindings[i]._listener(context, { direction: direction, distance: swipeDistance, end: false });
                        }
                    }
                }
            }
            if (Math.abs(positionDown.x - gesture.game.input.x)>50)
            positionDown.x = gesture.game.input.x;
            if (Math.abs(positionDown.y - gesture.game.input.y) > 50)
                positionDown.y = gesture.game.input.y;
            swipeDistance = distance;
        }
    };
 
    gesture.updateTouch = function (distance, duration) {
        positionDown = this.game.input.activePointer.positionDown;

        if (duration === -1) {
            if (this.isTouching && this.onTap._bindings) {
                for (var i = 0; i < this.onTap._bindings.length; i++) {
                   var context = this.onTap._bindings[i].context;
                   if (currentTapElement == context) {
                        this.onTap._bindings[i]._listener(context, {});
                   }
                }
            }
            currentTapElement = null;
            this.isTouching = false;
            this.isHolding = false;
            this.holdDispatched = false;

        } else if (distance < 10) {
            if (duration < gesture.TIMES.HOLD) {
                this.isTouching = true;
            } else {
                this.isTouching = false;
                this.isHolding = true;

                if (!this.holdDispatched) {
                    this.holdDispatched = true;
                    this.onHold.dispatch(this, positionDown);
                }
            }
        } else {
            this.isTouching = false;
            this.isHolding = false;
        }
    };

    gesture.SWIPE = 0;
    gesture.TAP = 1;
    gesture.HOLD = 2;

    gesture.TIMES = {
        HOLD: 200,
        SWIPE: 350
    };

    return init(obj);
}