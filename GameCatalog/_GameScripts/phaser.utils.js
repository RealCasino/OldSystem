function createTextLbl(context, config) {
    var text = config.text,
    x = config.x,
    y = config.y,
    font = config.font,
    size = config.size,
    color = config.color,
    backgroundColor = config.backgroundColor,
    style = config.style?config.style:"",
    centered = config.centered,
    maxWidth = config.maxWidth,
    align = config.align,
    wordWrapWidth = text.split(" ").length > 1 ? maxWidth : "",
    lineSpacing = config.lineSpacing ? lineSpacing : -5-size/10,
    maxHeight = config.maxHeight;
    var lbl = context.add.text(x, y, text, {
        font: style + " " + size + "px " + font,
        fill: color,
        backgroundColor: backgroundColor,
        wordWrap: wordWrapWidth?true:false,
        wordWrapWidth: wordWrapWidth,
        align: centered ? "center" : "",
    });
    lbl.text = text;
    lbl.lineSpacing = lineSpacing;
    lbl._y = parseInt(lbl.y);
    lbl._size = parseInt(size);
    lbl.resizeText = function (lbl) {
        size = lbl._size;
        lbl.fontSize = size;
        lbl.y = lbl._y;
        if (wordWrapWidth && maxHeight && lbl.height > maxHeight) {
            var paddingTop = 0;
            while (lbl.height > maxHeight) {
                lbl.fontSize = size--;
                paddingTop++;
            }
            lbl.y = lbl._y + paddingTop / 2;
        } else {
            if (maxWidth && lbl.width > maxWidth) {
                var paddingTop = 0;
                while (lbl.width > maxWidth) {
                    lbl.fontSize = size--;
                    paddingTop++;
                }
                lbl.y = lbl._y + paddingTop / 2;
            }
        }
        if (parseInt(lbl.height / size) > 1) {
            lbl.y = y - (lbl.height - size + lineSpacing) / 2;
        }
        if (centered)
            lbl.anchor.x = Math.round(lbl.width * 0.5) / lbl.width;
        else {
            if(align=="right")
                lbl.anchor.x = 1;
        }
    }
    lbl.hitArea = new Phaser.Rectangle(align == "right" ? -maxWidth : 0, 0, maxWidth, maxHeight);
    lbl.resizeText(lbl);
    lbl.onChange = config.onChange;
    lbl.setTitle = function (t) {
        text = t;
        lbl.text = text;
        lbl.setText(text);
        lbl.resizeText(lbl);
        if (lbl.onChange) {
            lbl.onChange(text);
        }
    }
    return lbl;
}
function createTextButton(context, config) {
    var btnGroup = context.add.group();
    var btn = context.add.sprite(config.x, config.y, config.sprite, config.defaultIndex);
    btnGroup.btn = btn;
    btnGroup.add(btn);
    if (config.useHandCursor) {
        btn.inputEnabled = true;
        btn.clicked = true;
        btn.input.useHandCursor = true;
    }
    if (config.width)
        btnGroup.btn.width = config.width;
    if (config.height)
        btnGroup.btn.height = config.height;
            
    if (config.paddingLeft)
        config.x += config.paddingLeft;
    if (config.paddingTop)
        config.y += config.paddingTop;
    if (config.centered) {
        config.x = config.x + btn.width / 2;
        config.y = config.y + btn.height / 2 - config.size/2;
    }
    var text = createTextLbl(context, config);
    btnGroup.text = text;
    btnGroup.add(text);
    btn.events.onInputOver.add(function(e) {
        if (config.onOver) {
            config.onOver(e);
        }
        if (config.overIndex) {
            btn.loadTexture(config.sprite, config.overIndex);
        }
    }, context);
    btn.events.onInputOut.add(function (e) {
        if (config.onOut) {
            config.onOut(e);
        }
        if (config.overIndex) {
            btn.loadTexture(config.sprite, config.defaultIndex);
        }
    }, context);
    btn.events.onInputDown.add(function (e) {
        if (config.clickIndex) {
            btn.loadTexture(config.sprite, config.clickIndex);
        }
        if (config.textClickXOffset) {
            context.add.tween(btnGroup.text).to({ x: btnGroup.text.x + config.textClickXOffset }, 10, Phaser.Easing.Linear.None, true);
        }
        if (config.textClickYOffset) {
            context.add.tween(btnGroup.text).to({ y: btnGroup.text.y + config.textClickYOffset }, 10, Phaser.Easing.Linear.None, true);
        }
    }, context);
    btn.events.onInputUp.add(function (e) {
        btn.loadTexture(config.sprite, config.defaultIndex);
        if (config.textClickXOffset) {
            context.add.tween(btnGroup.text).to({ x: config.x }, 10, Phaser.Easing.Linear.None, true);
        }
        if (config.textClickYOffset) {
            context.add.tween(btnGroup.text).to({ y: config.y }, 10, Phaser.Easing.Linear.None, true);
        }
        btnGroup.text.destroy();
        config.text = btnGroup.text.text;
        btnGroup.text = createTextLbl(context, config);
        btnGroup.add(btnGroup.text);
        if (config.onClick) {
            config.onClick(e);
        }
    }, context);
    btnGroup.disable = function () {
        if (config.disabledColor)
            btnGroup.text.addColor(config.disabledColor, 0);
        if (config.disabledIndex)
            btn.loadTexture(config.sprite, config.disabledIndex);
        btnGroup.btn.inputEnabled = false;
        btnGroup.btn.clicked = false;
        btnGroup.btn.input.useHandCursor = false;

    }
    btnGroup.enable = function () {
        btnGroup.text.addColor(config.color, 0);
        btn.loadTexture(config.sprite, config.defaultIndex);
        btnGroup.btn.inputEnabled = true;
        btnGroup.btn.clicked = true;
        btnGroup.btn.input.useHandCursor = true;
    }
    return btnGroup;
}