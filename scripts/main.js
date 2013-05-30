var jp = jp || {};

$(document).ready(function () {
    var $BTN_PATH = $('#calculate'),
        $BTN_ERASE = $('#erase');

    var _event = {
        testVision: function () {
            jp.visual.clearPath();
            jp.map.setData(jp.visual.getMap());
            jp.lineOfSight.findTarget()
                .setVisual();
        }
    };

    var main = {
        init: function () {
            jp.visual.init();
            this.bind();
        },

        bind: function () {
            $BTN_PATH.click(_event.testVision);
            $BTN_ERASE.click(jp.visual.erase);
        }
    };

    main.init();
});