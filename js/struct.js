

var Vec2 = function(x, y) {
    this.x = x;
    this.y = y;
}

Vec2.prototype.addSelf = function(v) {
    this.x += v.x; this.y += v.y;
    return this;
}

Vec2.prototype.addPointSelf = function(P) {
    var P2 = [];
    P2[0] = P[0] + this.x;
    P2[1] = P[1] + this.y;
    return P2;
}

Vec2.prototype.subtractSelf = function(v) {
    this.x -= v.x; this.y -= v.y;
    return this;
}

Vec2.prototype.scaleSelf = function(v) {
    this.x *= v; this.y *= v;
    return this;
}

Vec2.prototype.length = function() {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
}

Vec2.prototype.normalizeSelf = function() {
    var iLen = 1 / this.length();
    this.x *= iLen; this.y *= iLen;
    return this;
}

Vec2.prototype.setSelf = function(x, y) {
    this.x = x; this.y = y;
    return this;
}

Vec2.prototype.doPerpendicualSelf = function() {
    var x2 = this.y, y2 = -this.x;
    this.y = y2; this.x = x2;
    return this;
}

Vec2.prototype.dotPointSelf = function(v2) {
    return this.x * v2.x + this.y * v2.y;
}