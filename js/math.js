/**
 * Created by Michal on 02.11.13.
 */


Transform = function() {
    /**
     *
     * @type {Vec2[]}
     */
    this.vectors = [];
};

/**
 *
 * @param {int} index
 * @param {float} x
 * @param {float} y
 * @returns {Vec2}
 */
Transform.getVector = function(index, x, y) {
    if (!this.vectors) {
        this.vectors = [];
    }
    if (!this.vectors[index]) {
        this.vectors[index] = new Vec2(x, y);
    } else {
        this.vectors[index].setSelf(x, y);
    }
    return this.vectors[index];
};

/**
 *
 * @param {Array} P1
 * @param {Array} P2
 * @param {float} radius
 * @returns {Array[]}
 */
Transform.moveLine = function(P1, P2, radius) {
    var R = [];
    var v1 = this.getVector(0, P2[0] - P1[0], P2[1] - P1[1]);
    v1.doPerpendicualSelf().normalizeSelf().scaleSelf(radius);
    R[0] = v1.addPointSelf(P1);
    R[1] = v1.addPointSelf(P2);
    return R;
};

Transform.isCrossing = function(A1, A2, B1, B2) {
    return (
        this.det(A1, A2, B1) * this.det(A1, A2, B2) < 0 &&
            this.det(B1, B2, A1) * this.det(B1, B2, A2) < 0
        );
};

Transform.getCrossPoint = function(A1, A2, B1, B2) {
    var P = [];
    P[0] = (
        ( A2[0]-A1[0] ) * ( B2[0]*B1[1] - B2[1]*B1[0] ) -
            ( B2[0]-B1[0] ) * ( A2[0]*A1[1] - A2[1]*A1[0] )
        ) / (
        ( A2[1]-A1[1] ) * ( B2[0]-B1[0] ) - ( B2[1]-B1[1] ) * ( A2[0]-A1[0] ) );
    P[1] = (
        ( B2[1]-B1[1] ) * ( A2[0]*A1[1] - A2[1]*A1[0] ) -
            ( A2[1]-A1[1] ) * ( B2[0]*B1[1] - B2[1]*B1[0] )
        ) / (
        ( B2[1]-B1[1] ) * ( A2[0]-A1[0] ) - ( A2[1]-A1[1] ) * ( B2[0]-B1[0] ) );
    return P;
};

Transform.getPointImage = function(P, A1, A2, check) {
    var R = [];
    if ( A1[0] == A2[0] ) {
        R[0] = A1[0];
        R[1] = P[1];
    }
    else if ( A1[1] == A2[1] ) {
        R[0] = P[0];
        R[1] = A1[1];
    }
    else {
        var m = (A2[1] - A1[1]) / (A2[0] - A1[0]);
        var m2 = m*m;
        var b = A1[1] - (m * A1[0]);

        R[0] = ( m * P[1] + P[0] - m * b) / (m2 + 1);
        R[1] = ( m2 * P[1] + m * P[0] + b) / (m2 + 1);
    }
    if ( check && !( R[0] >= Math.min(A1[0], A2[0]) &&
        R[0] <= Math.max(A1[0], A2[0]) &&
        R[1] >= Math.min(A1[1], A2[1]) &&
        R[1] <= Math.max(A1[1], A2[1]) ) ) {
        return null
    }
    return R;
};

Transform.getAngle = function(A1, A2, B1, B2)
{
    var ax = A2[0] - A1[0];
    var ay = A2[1] - A1[1];
    var bx = B2[0] - B1[0];
    var by = B2[1] - B1[1];

    if (ax == bx && ay == by) {
        return 0;
    }

    var aob = ax * bx + ay * by;

    var al = Math.abs( Math.sqrt( ax * ax + ay * ay ) );
    var bl = Math.abs( Math.sqrt( bx * bx + by * by ) );

    var angle = aob/(al * bl);

    return angle;
};

Transform.getPointPointCircleIntersection = function(P1, P2, R)
{
    //var ret = [];

    var S = this.getSegmentCenter(P1, P2);
    var dx = P2[0] - P1[0];
    var dy = P2[1] - P1[1];
    var S2 = [];
    S2[0] = S[0] - dy;
    S2[1] = S[1] + dx;

    return this.getSegmentCircleIntersection(S, S2, P1, R, false );
};

Transform.getSegmentCenter = function(P1, P2)
{
    var ret = [];

    ret[0] = ( P1[0] + P2[0] ) / 2;
    ret[1] = ( P1[1] + P2[1] ) / 2;

    return ret;
};

Transform.getSegmentCircleIntersection = function(A1, A2, P, R, check)
{
    var ret = [];
    var dx = A2[0] - A1[0];
    var dy = A2[1] - A1[1];


    var a = dx * dx + dy * dy;
    var b = 2 * (dx * (A1[0] - P[0]) + dy * (A1[1] - P[1]));
    var c = P[0] * P[0] + P[1] * P[1];
    c += A1[0] * A1[0] + A1[1] * A1[1];
    c -= 2 * (P[0] * A1[0] + P[1] * A1[1]);
    c -= R * R;
    var bb4ac = b * b - 4 * a * c;

    if(bb4ac<0){
        return ret;    // No collision
    }else{
        var dels = Math.sqrt(bb4ac);
        var x1 = ( -b - dels ) / ( a + a );
        var x2 = ( -b + dels ) / ( a + a );

        var v0 = this.getVector(1, A2[0] - A1[0], A2[1] - A1[1]);
        var o1 = v0.scaleSelf(x1).addPointSelf(A1);

        if ( ! check || ( o1[0] >= Math.min(A1[0], A2[0]) &&
            o1[0] <= Math.max(A1[0], A2[0]) &&
            o1[1] >= Math.min(A1[1], A2[1]) &&
            o1[1] <= Math.max(A1[1], A2[1]) ) ) {
            ret.push(o1) ;
        }

        var v0 = this.getVector(1, A2[0] - A1[0], A2[1] - A1[1]);
        var o2 = v0.scaleSelf(x2).addPointSelf(A1);

        if ( ! check || ( o2[0] >= Math.min(A1[0], A2[0]) &&
            o2[0] <= Math.max(A1[0], A2[0]) &&
            o2[1] >= Math.min(A1[1], A2[1]) &&
            o2[1] <= Math.max(A1[1], A2[1]) ) ) {
            ret.push(o2);
        }

        return ret;
    }
}

Transform.getLength = function(P1, P2) {

    var lx, ly;
    lx = P2[0] - P1[0];
    ly = P2[1] - P1[1];
    if ( !lx && !ly ) {
        return 0;
    }

    return Math.sqrt(
        lx * lx + ly * ly
    );
};

/**
 *
 * @param P1
 * @param P2
 * @param P3
 * @returns {number}
 */
Transform.det = function(P1, P2, P3) {
    return P1[0] * P2[1] + P2[0] * P3[1] +
        P3[0] * P1[1] - P3[0] * P2[1] -
        P1[0] * P3[1] - P2[0] * P1[1];
};