/**
 * Created by Michal on 02.11.13.
 */

Controller = function(canvasId)
{
    this._canvas = new Canvas2D(canvasId);
    this._lines = [];
    this._index = [];
    this._SweepPoints = {};
};

Controller.prototype.addLine = function(x1, y1, x2, y2)
{
    var i = this._lines.length;
    var lx, rx;
    this._lines.push([x1,y1,x2,y2]);
    if (x1 < x2) {
        lx = x1;
        rx = x2;
    }
    else {
        lx = x2;
        rx = x1;
    }
    if (!this._SweepPoints[lx]) {
        this._SweepPoints[lx] = {l:[],r:[]};
    }
    this._SweepPoints[lx].l.push(i);
    if (!this._SweepPoints[rx]) {
        this._SweepPoints[rx] = {l:[],r:[]};
    }
    this._SweepPoints[rx].r.push(i);
    return this;
};

Controller.prototype.repaint = function()
{
    var C = this._canvas;
    var P = this._lines;

    var l = P.length;

    C.clear();
    for (var i=0; i<l; i++) {

        C.drawLine(P[i][0], P[i][1], P[i][2], P[i][3]);

    }
    return this;
};

Controller.prototype.findCrossingLines = function()
{
    var C = this._canvas;
    var L = this._lines;
    var S = this._SweepPoints;
    var nearLines = [];
    var keys = [];

    console.log('Sweep map: ', S);

    var id;

    for(var position in S) {
        if (!S.hasOwnProperty(position))
            continue;

        keys.push(position);

    }
    keys.sort(function(a,b) { return a - b;});

    var len = keys.length;
    var pos;

    for (var k = 0; k < len; k++) {

        pos = keys[k];

        console.log('checking sweep point at ', pos);

        for (var i=0; i< S[pos].l.length; i++) {
            nearLines.push(S[pos].l[i]);
            console.log('pushing line ', (S[pos].l[i]));
        }

        console.log('nearlines', nearLines);
        // tu sprawdzamy przeciecia

        for (var j=0; j< S[pos].r.length; j++) {
            id = nearLines.indexOf(S[pos].r[j]);
            if (id > -1) {
                nearLines.splice(id, 1);
                console.log('dropping line ', (S[pos].r[j]));
            }
            else {
                console.log('jakis blad');
            }
        }

    }


    return this;
};

Controller.prototype.addRandomLine = function()
{
    var C = this._canvas.getCanvas();
    var x1 = (Math.random() * C.canvas.width);
    var x2 = (Math.random() * C.canvas.width);
    var y1 = (Math.random() * C.canvas.height);
    var y2 = (Math.random() * C.canvas.height);
    this.addLine(x1,y1,x2,y2);
    return this;
};

Controller.prototype.addRandomLines = function( count )
{
    var repeat = count || 1;
    if (repeat > 0) {
        for (var i = 0; i < repeat; i++) {
            this.addRandomLine();
        }
        this.repaint();
    }
    return this;
};

function activateCanvas(canvasId)
{
    var C = document.getElementById(canvasId);
    var D = new Controller(canvasId);

    C.onmousedown = function(e){
        var x = e.offsetX;
        var y = e.offsetY;
        D.addPoint(x ,y);
        D.repaint();
        //D.drawCircle(x ,y, 50);
    }
}