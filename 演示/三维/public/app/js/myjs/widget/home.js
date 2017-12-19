Namespace.register('Qjjs.Widget');
Qjjs.Widget.ViewerController= (function () {
    var _viewer;
    var _entity;
    var _handler;
    var _callback;
    var _scene;
    var _canvas;
    var _ellipsoid;
    var flags;
    var ViewerButton = function (viewer) {
        _viewer=viewer;
        _scene= viewer.scene;
        _canvas=viewer.canvas;
        _ellipsoid=_scene.globe.ellipsoid;
        flags = {
            looking : false,
            moveForward : false,
            moveBackward : false,
            moveUp : false,
            moveDown : false,
            moveLeft : false,
            moveRight : false
        };
        _entity = _viewer.entities.add({
            point : {
                pixelSize : 5,
                color : Cesium.Color.RED,
                outlineColor : Cesium.Color.WHITE,
                followSurface:true,
                height : 100000,
                outlineWidth : 2
            },
            label : {
                font : '14pt monospace',
                style : Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth : 3,
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
                pixelOffset : new Cesium.Cartesian2(0, -9) ,  //偏移量
                followSurface:true,
                height : 100000,
                show : false
            }
        });
        _handler = new Cesium.ScreenSpaceEventHandler(_viewer.scene.canvas);

    };
    var toHome=function (west, south, east, north) {
        _viewer.camera.flyTo({
            destination: Cesium.Rectangle.fromDegrees(west, south, east, north)
        });
    };
    function getPosition(e){
        var cartesian=_viewer.camera.pickEllipsoid(e.position,_viewer.scene.globe.ellipsoid);
         _callback(cartesian);
    }
    var setOnClickListener=function (callback) {
        _callback=callback;
    };
    var enablePosition=function (callback) {
        setOnClickListener(callback);
        _handler.setInputAction(getPosition, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        _handler.setInputAction(function(){_viewer.entities.removeAll()}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
       };
    var disablePosition=function () {
        setOnClickListener(null);
        _handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };
    var tagPoint=function (cartesian) {
        var cartographic=Cesium.Cartographic.fromCartesian(cartesian);
        var lng=Cesium.Math.toDegrees(cartographic.longitude);//经度值
        var lat=Cesium.Math.toDegrees(cartographic.latitude);//纬度值
        var height=cartographic.height;
        _entity.position = cartesian;
        _entity.label.show = true;
        _entity.label.text = '(经度：' + lng + ', 纬度：' +lat + ',高度：' + height + ')' ;
    };



  var keyControlCamera= function(){
       _canvas.setAttribute('tabindex', '0'); // needed to put focus on the canvas
       _canvas.onclick = function() {
           _canvas.focus();
       };
// disable the default event handlers
       _scene.screenSpaceCameraController.enableRotate = false;
       _scene.screenSpaceCameraController.enableTranslate = false;
       _scene.screenSpaceCameraController.enableZoom = false;
       _scene.screenSpaceCameraController.enableTilt = false;
       _scene.screenSpaceCameraController.enableLook = false;
       document.addEventListener('keydown', function(e) {
          var flagName = getFlagForKeyCode(e.keyCode);
          if (typeof flagName !== 'undefined') {
              flags[flagName] = true;
          }
      }, false);
      document.addEventListener('keyup', function(e) {
          var flagName = getFlagForKeyCode(e.keyCode);
          if (typeof flagName !== 'undefined') {
              flags[flagName] = false;
          }
      }, false);
      _viewer.clock.onTick.addEventListener(function(clock) {
          var camera = _viewer.camera;
          if (flags.looking) {
              var width = _canvas.clientWidth;
              var height = _canvas.clientHeight;

              // Coordinate (0.0, 0.0) will be where the mouse was clicked.
              var x = (mousePosition.x - startMousePosition.x) / width;
              var y = -(mousePosition.y - startMousePosition.y) / height;

              var lookFactor = 0.05;
              camera.lookRight(x * lookFactor);
              camera.lookUp(y * lookFactor);
          }

          // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
          var cameraHeight = _ellipsoid.cartesianToCartographic(camera.position).height;
          var moveRate = cameraHeight / 100.0;

          if (flags.moveForward) {
              camera.moveForward(moveRate);
          }
          if (flags.moveBackward) {
              camera.moveBackward(moveRate);
          }
          if (flags.moveUp) {
              camera.moveUp(moveRate);
          }
          if (flags.moveDown) {
              camera.moveDown(moveRate);
          }
          if (flags.moveLeft) {
              camera.moveLeft(moveRate);
          }
          if (flags.moveRight) {
              camera.moveRight(moveRate);
          }
      });
   };
    var startMousePosition;
    var mousePosition;

    var mouseControlCamera=function ()
    {
        _handler.setInputAction(function(movement) {
            flags.looking = true;
            mousePosition = startMousePosition = Cesium.Cartesian3.clone(movement.position);
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

        _handler.setInputAction(function(movement) {
            mousePosition = movement.endPosition;
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        _handler.setInputAction(function(position) {
            flags.looking = false;
        }, Cesium.ScreenSpaceEventType.LEFT_UP);
    };
       function getFlagForKeyCode(keyCode) {
        switch (keyCode) {
            case 'W'.charCodeAt(0):
                return 'moveForward';
            case 'S'.charCodeAt(0):
                return 'moveBackward';
            case 'Q'.charCodeAt(0):
                return 'moveUp';
            case 'E'.charCodeAt(0):
                return 'moveDown';
            case 'D'.charCodeAt(0):
                return 'moveRight';
            case 'A'.charCodeAt(0):
                return 'moveLeft';
            default:
                return undefined;
        }
    }

    ViewerButton.prototype.KeyControlCamera=keyControlCamera;
    ViewerButton.prototype.ToHome=toHome;
    ViewerButton.prototype.EnablePosition=enablePosition;
    ViewerButton.prototype.MouseControlCamera=mouseControlCamera;
    ViewerButton.prototype.DisablePosition=disablePosition;
    // ViewerButton.prototype.OnClickListener=setOnClickListener;
    ViewerButton.prototype.TagPoint=tagPoint;
    return ViewerButton;
})();

