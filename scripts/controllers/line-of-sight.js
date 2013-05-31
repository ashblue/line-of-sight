var jp = jp || {};

// @TODO A lot of these methods and variables should be private
$(document).ready(function () {
    // Pathfinder API - Returns a path to the target
    // Good place to add details such as flying, swimming, ect.
    jp.lineOfSight = {
        // Tiles that can be seen
        visible: [],

        // Tiles that block vision
        blocked: [],

        // Number of times loop had to be fired
        step: 0,

        // Maximum number of steps that can be taken before shutting down
        maxSteps: 20,

        // Recorded time taken to run in milliseconds
        timer: 0,

        // Attempts to view the target
        findTarget: function () {
            this.reset();

            var start = jp.visual.getBegin(),
                end = jp.visual.getEnd();

            // Step directions
            var stepX = this.getDirection(start.x, end.x),
                stepY = this.getDirection(start.y, end.y);

            // Boundaries for largest movement points??? WTF does that mean?
            var deltaX = Math.abs(end.x - start.x),
                deltaY = Math.abs(end.y - start.y),
                deltaZ = Math.abs(end.z - start.z);

            // How many squares to advance in an increment (prevents reading corners)
            var err = deltaX - deltaY;

            var x = start.x, y = start.y, valid = true, errCalc;
            while (valid) {
                // Check for invalid tile
                if (jp.map.isBlocked(x, y, 0)) {
                    this.addBlocked(new jp.Step(x, y, 0, this.step + 1));
                    break;
                } else {
                    this.addVisible(new jp.Step(x, y, 0, this.step + 1));
                }

                // Check for destination
                if (x === end.x && y === end.y) {
                    break;
                }

                // Check error and increment x
                errCalc = 2 * err;
                if (errCalc > deltaY * -1) {
                    err -= deltaY;
                    x += stepX;
                }

                // Check for destination
                if (x === end.x && y === end.y) {
                    this.addVisible(new jp.Step(x, y, 0, this.step + 1));
                    break;
                }

                // Increment y
                if (errCalc < deltaX) {
                    err += deltaX;
                    y += stepY;
                }

                this.step++;
            }

            return this;
        },

        addVisible: function (step) {
            this.visible.push(step);
            return this;
        },

        addBlocked: function (step) {
            this.blocked.push(step);
            return this;
        },

        // Is the line of sight still visible and not too far away
        isOutOfBounds: function () {

        },

        // Direction of a line between two points
        getDirection: function (a, b) {
            if (a < b) {
                return 1;
            } else {
                return -1;
            }
        },

        setVisual: function () {
            jp.visual
                .setTileGroup(this.visible, 'visible')
                .setTileGroup(this.blocked, 'blocked');
        },

        reset: function () {
            this.visible = [];
            this.blocked = [];
            this.step = 0;
            return this;
        }
    };
});