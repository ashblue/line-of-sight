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
        timeStart: 0,
        timeEnd: 0,

        // Attempts to view the target
        findTarget: function () {
            this.startTimer();

            this.reset();

            var start = jp.visual.getBegin(),
                end = jp.visual.getEnd();

            // Step directions
            var stepX = this.getDirection(start.x, end.x),
                stepY = this.getDirection(start.y, end.y),
                stepZ = this.getDirection(start.z, end.z);

            // Boundaries for largest movement points??? WTF does that mean?
            var deltaX = Math.abs(end.x - start.x),
                deltaY = Math.abs(end.y - start.y),
                deltaZ = Math.abs(end.z - start.z);

            // How many squares to advance in an increment (prevents reading corners)
            var err = deltaX - deltaY;

            // How often to go up a tile on the z-axis
            var angleChangeRatio = this.getAngleChangeRatio(this.getMax(deltaX, deltaY) + 1, deltaZ);
            console.log('ratio change', angleChangeRatio);

            var x = start.x, y = start.y, xPrev = x, yPrev = y, valid = true, errCalc, angleChangeCount = angleChangeRatio;
            while (valid) {
                console.log('step', this.step);

                // Check for invalid tile
//                if (jp.map.isBlocked(x, y, 0)) {
//                    console.log('blocked');
//                    this.addBlocked(new jp.Step(x, y, 0, this.step));
//                    break;
//                }

                // Increment z if angleChange exceeds steps
                if (angleChangeRatio && this.step + 1 > angleChangeCount) {
                    console.log('change at', x, y);
                    angleChangeCount += angleChangeRatio;
                }

                // If moving on a corner, verify one adjacent corner is valid
                if (x !== xPrev && y !== yPrev &&
                    jp.map.isBlocked(x - stepX, y, 0) && jp.map.isBlocked(x, y - stepY, 0)) {
                    this.addBlocked(new jp.Step(x, y, 0, this.step));
                    break;
                }

                // Check for destination
                if (x === end.x && y === end.y) { break; }

                // Plot step
                this.addVisible(new jp.Step(x, y, 0, this.step));

                // Check error and increment x
                xPrev = x;
                errCalc = 2 * err;
                if (errCalc > deltaY * -1) {
                    err -= deltaY;
                    x += stepX;
                }

                // Increment y
                yPrev = y;
                if (errCalc < deltaX) {
                    err += deltaX;
                    y += stepY;
                }

                this.step++;
            }

            this.stopTimer();

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

        startTimer: function () {
            this.timeStart = Date.now();
        },

        stopTimer: function () {
            this.timeEnd = Date.now();
        },

        // Return time in milliseconds
        getTimer: function () {
            return this.timeEnd - this.timeStart;
        },

        // How often to increment a change in angle
        // @NOTE If more than one change on a single tile should return less than 1
        getAngleChangeRatio: function (distance, totalZChange) {
            console.log('angle change', distance, totalZChange);
            if (totalZChange === 0) {
                return false;
            } else {
                return distance / (totalZChange + 1);
            }
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

        // Return the greatest number
        getMax: function (a, b) {
            if (a >= b) {
                return a;
            } else {
                return b;
            }
        },

        setVisual: function () {
            jp.visual
                .setTileGroup(this.visible, 'visible')
                .setTileGroup(this.blocked, 'blocked')
                .setStats({
                    time: this.getTimer(),
                    steps: this.step
                });
        },

        reset: function () {
            this.visible = [];
            this.blocked = [];
            this.step = 0;
            return this;
        }
    };
});