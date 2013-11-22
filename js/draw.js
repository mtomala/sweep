/**
 * Created by Michal on 02.11.13.
 */

Canvas2D = function(canvasId)
{
    this._canvas = document.getElementById(canvasId).getContext('2d');
    this.fillStyle = "#EEEEEE";
    this.bgStyle = "#6666CC";
    this.strokeStyle = "#EEEEEE";
    this.clear();
};

Canvas2D.prototype.getCanvas = function()
{
    this._canvas.fillStyle = this.fillStyle;
    this._canvas.strokeStyle = this.strokeStyle;
    return this._canvas;
};

Canvas2D.prototype.clear = function()
{
    var C = this.getCanvas();
    C.fillStyle = this.bgStyle;
    C.fillRect(0, 0, C.canvas.width, C.canvas.height);
    return this;
};

Canvas2D.prototype.drawDot = function(x, y)
{
    var C = this.getCanvas();
    C.fillRect(x, y, 1, 1);
    return this;
};

Canvas2D.prototype.drawCircle = function(x, y, r, color)
{
    var C = this.getCanvas();
    C.fillStyle = color || "rgba(255,255,255,0.4)";
    C.beginPath();
    C.arc(x, y, r,0 ,2*Math.PI);
    C.fill();
    this.drawDot(x,y);
    return this;
};

Canvas2D.prototype.drawPoint = function(x, y, size, color)
{
    if (size > 0) {

    } else {
        size = 3;
    }
    var C = this.getCanvas();
    if (color) {
        C.fillStyle = color;
    }
    var corr = Math.floor(size / 2.0);

    C.fillRect(x - corr ,y - corr, size, size);
    return this;
};

Canvas2D.prototype.drawNamedPoint = function(text, x, y, size, color)
{
    this.drawPoint(x, y, size, color);
    var C = this.getCanvas();
    C.font="12px Verdana";
    if (color) {
        C.fillStyle = color;
    }

    C.fillText(text, x, y+12);
    return this;
};

Canvas2D.prototype.drawLine = function(x1, y1, x2, y2, color)
{
    var C = this.getCanvas();
    if (color) {
        C.strokeStyle = color;
    }
    C.beginPath();
    C.moveTo(x1, y1);
    C.lineTo(x2, y2);
    C.stroke();
    return this;
};
