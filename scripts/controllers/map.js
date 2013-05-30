var jp = jp || {};

$(document).ready(function () {
    var _private = {
        outOfBounds: function (x, y, z) {
            return x < 0 || x >= jp.map.data[0][0].length ||
                y < 0 || y >= jp.map.data[0].length ||
                z < 0 || z >= jp.map.data.length;
        }
    };

    jp.map = {
        // Current map
        data: null,

        setData: function (map) {
            this.data = map;
            return this;
        },

        getWidthInTiles: function () {
            return this.data[0].length;
        },

        getHeightInTiles: function () {
            return this.data.length;
        },

        isBlocked: function (x, y, z) {
            if (_private.outOfBounds(x, y, z)) {
                return true;
            }

            if (this.data[z][y][x] === 0) {
                return true;
            }

            return false;
        },

        getNeighbors: function (x, y, z) {
            var neighbors = [];

            // Check left, right, top, bottom
            if (!this.blocked(x + 1, y, z)) neighbors.push(new jp.Tile(x + 1, y, z));
            if (!this.blocked(x - 1, y, z)) neighbors.push(new jp.Tile(x - 1, y, z));
            if (!this.blocked(x, y + 1, z)) neighbors.push(new jp.Tile(x, y + 1, z));
            if (!this.blocked(x, y - 1, z)) neighbors.push(new jp.Tile(x, y - 1, z));

            // Get top levels
            if (!this.blocked(x + 1, y, z + 1)) neighbors.push(new jp.Tile(x + 1, y, z + 1));
            if (!this.blocked(x - 1, y, z + 1)) neighbors.push(new jp.Tile(x - 1, y, z + 1));
            if (!this.blocked(x, y + 1, z + 1)) neighbors.push(new jp.Tile(x, y + 1, z + 1));
            if (!this.blocked(x, y - 1, z + 1)) neighbors.push(new jp.Tile(x, y - 1, z + 1));

            // Get bottom levels
            if (!this.blocked(x + 1, y, z - 1)) neighbors.push(new jp.Tile(x + 1, y, z - 1));
            if (!this.blocked(x - 1, y, z - 1)) neighbors.push(new jp.Tile(x - 1, y, z - 1));
            if (!this.blocked(x, y + 1, z - 1)) neighbors.push(new jp.Tile(x, y + 1, z - 1));
            if (!this.blocked(x, y - 1, z - 1)) neighbors.push(new jp.Tile(x, y - 1, z - 1));

            return neighbors;
        }
    };
});