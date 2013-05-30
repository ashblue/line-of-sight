var jp = jp || {};

$(document).ready(function () {
    var _private = {
        // Euclidean distance, C = current, T = target
        distanceE: function (xC, yC, xT, yT) {
            var dx = xT - xC, dy = yT - yC;
            return Math.sqrt((dx * dx) + (dy * dy));
        },

        // Manhattan distance (use this one)
        distanceM: function (xC, yC, xT, yT) {
            var dx = Math.abs(xT - xC), dy = Math.abs(yT - yC);
            return dx + dy;
        },

        distanceM3d: function (xC, yC, zC, xT, yT, zT) {
            var dx = Math.abs(xT - xC), dy = Math.abs(yT - yC), dz = Math.abs(zT - zC);
            return dx + dy + dz;
        }
    };

    // @TODO Might need to add an extra +1 for every level change
    jp.Step = function(x, y, z, totalSteps) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.stepCount = totalSteps;
    };
});