Namespace.register("Pano.Widget");
Pano.Widget.Compass = (function () {
    var centrX, centrY;
    var isUserInteracting = false;
    function Compass(taskSetup, imgID) {
        taskSetup.regdistRotateListener(function (angle) {
            $(imgID).css('transform', 'rotate(' + angle + 'deg)');
        });
        var imgObj = $(imgID);
        centrX = imgObj.width() / 2;
        centrY = imgObj.height() / 2;
        imgObj.bind('click touchend',function (event) {
            taskSetup.rotateCamera(0);
            event.stopPropagation();
            event.preventDefault();
        });
    }
    return Compass;
})();

