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

    var S = this._SweepPoints;
    var nearLines = [];
    var newNearLines = [];
    var keys = [];
    var profiler = 0;

    console.log('Start: ', Date.now());

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

        //console.log('checking sweep point at ', pos);
        newNearLines = [];
        for (var i=0; i< S[pos].l.length; i++) {
            newNearLines.push(S[pos].l[i]);
            nearLines.push(S[pos].l[i]);
            //console.log('pushing line ', (S[pos].l[i]));
        }

        //console.log('nearlines: ', nearLines.length);
        // tu sprawdzamy przeciecia
        if (newNearLines.length > 0) {
            profiler += this.checkNearLines(newNearLines, nearLines);
        }

        for (var j=0; j< S[pos].r.length; j++) {
            id = nearLines.indexOf(S[pos].r[j]);
            if (id > -1) {
                nearLines.splice(id, 1);
                //console.log('dropping line ', (S[pos].r[j]));
            }
            else {
                //console.log('jakis blad');
            }
        }

    }

    console.log('DONE', Date.now());
    console.log('sprawdzono', profiler, 'punktow');
    return this;
};

Controller.prototype.addRandomLine = function()
{
    var C = this._canvas.getCanvas();
    var x1 = (Math.random() * C.canvas.width);
    var y1 = (Math.random() * C.canvas.height);

    var x2 = (Math.random() * 200 - 100 + x1);
    var y2 = (Math.random() * 200 - 100 + y1);

    //var x2 = (Math.random() * C.canvas.width);
    //var y2 = (Math.random() * C.canvas.height);
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

Controller.prototype.checkNearLines = function(newNearLines,  nearLines)
{
    var C = this._canvas;
    var L = this._lines;
    var l1;
    var ret;
    var s = 0;

    var profiler = 0;

    if ( nearLines.length>1 ) {
        while (newNearLines.length>s) {
            l1 = newNearLines[s];
            s++;
            for (var i=0; i<nearLines.length; i++) {
                if (l1 == nearLines[i]) {
                    continue;
                }
                ret = this.getCrossingPoint(L[l1], L[nearLines[i]]);
                profiler ++;
                if (ret) {
                    C.drawPoint(ret[0], ret[1],5,'#ff0000');
                    //console.log('drawDot: ', ret[0], ret[1]);
                }
            }
        }

    }
    return profiler;
};

Controller.prototype.getCrossingPoint = function(A, B)
{
    var x1 = A[0];
    var y1 = A[1];
    var x2 = A[2];
    var y2 = A[3];
    var x3 = B[0];
    var y3 = B[1];
    var x4 = B[2];
    var y4 = B[3];

    var d = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
    if (d == 0) {
        return false;
    }
    else {
        var x = ((x3-x4)*(x1*y2-y1*x2)-(x1-x2)*(x3*y4-y3*x4))/d;
        var y = ((y3-y4)*(x1*y2-y1*x2)-(y1-y2)*(x3*y4-y3*x4))/d;
        if ( y < Math.min(y1,y2) || y > Math.max(y1,y2)) return false;
        if ( y < Math.min(y3,y4) || y > Math.max(y3,y4)) return false;
        if ( x < Math.min(x1,x2) || x > Math.max(x1,x2)) return false;
        if ( x < Math.min(x3,x4) || x > Math.max(x3,x4)) return false;
        return [x,y];
    }
    return false;

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