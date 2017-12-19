Namespace.register('Qjjs.Widget');
Qjjs.Widget.LableController= (function () {
    var _viewer;
    var _entity;
    var _handler;
    var _callback;
    var Points_lc = []; //记录所点击的路径
    var polyline_lc = new Cesium.Entity();
    var polygon_lc = new Cesium.Entity();

    function getPosition(e){
        var cartesian=_viewer.camera.pickEllipsoid(e.position,_viewer.scene.globe.ellipsoid);
        if(_callback!=null)
            _callback(cartesian);
    }

    var MarkButton = function (viewer) {
        _viewer=viewer;
        _handler = new Cesium.ScreenSpaceEventHandler(_viewer.scene.canvas);
    };

    var enableAPoint=function (callback) {
        setOnClickListener(callback);
        _handler.setInputAction(getPosition, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        _handler.setInputAction(function(){_viewer.entities.removeAll()}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    };

    var enableALine=function (callback) {
        setOnClickListener(callback);
        _handler.setInputAction(getPosition, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        _handler.setInputAction(function () {
            Points_lc = [];
            Points_lc.length = 0;
            _viewer.entities.remove(polyline_lc);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    };

    var enableAPolygon=function (callback) {
        setOnClickListener(callback);
        _handler.setInputAction(getPosition, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        _handler.setInputAction(function () {
            Points_lc = [];
            Points_lc.length = 0;
            _viewer.entities.remove(polygon_lc);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    };
    var disableAPoint=function () {
        setOnClickListener(null);
        _handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };
    var disableALine=function () {
        setOnClickListener(null);
        _handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };
    var disableAPolygon=function () {
        setOnClickListener(null);
        _handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    };
    var setOnClickListener=function (callback) {
        _callback=callback;
    };

    var tagPoint=function (cartesian) {
        _entity = _viewer.entities.add({
            point : {
                pixelSize : 5,
                color : Cesium.Color.YELLOW,
                outlineColor : Cesium.Color.WHITE,
                height:2000,
                outlineWidth : 2

            }
        });
        _entity.position =cartesian;
           };
    var tagLine=function (cartesian) {
        _viewer.entities.remove(polyline_lc);
        var cartographic=Cesium.Cartographic.fromCartesian(cartesian);
        var lng=Cesium.Math.toDegrees(cartographic.longitude);//经度值
        var lat=Cesium.Math.toDegrees(cartographic.latitude);//纬度值
        if (cartesian) {
            Points_lc.push({lng:lng,lat:lat});
        }
        //大于两个点就要进行画图
        if (Points_lc.length > 1) {
            polyline_lc.show = true;
            var polyPoints = [];
            for (var i = 0; i < Points_lc.length; i++) {
                polyPoints.push(Points_lc[i].lng);
                polyPoints.push(Points_lc[i].lat);
            }
            polyline_lc.polyline = {
                positions: Cesium.Cartesian3.fromDegreesArray(polyPoints),
                width: 5,
                // followSurface:true,
                offHeight : 100000000,
                material: new Cesium.PolylineOutlineMaterialProperty({
                    color: Cesium.Color.ORANGE,
                    outlineWidth: 2
                    // outlineColor: Cesium.Color.BLACK
                })
            };
        }
        else {
            polyline_lc.show = false;
        }
        _viewer.entities.add(polyline_lc);
    };
    var tagPolygon=function (cartesian) {
        _viewer.entities.remove(polygon_lc);
        var cartographic=Cesium.Cartographic.fromCartesian(cartesian);
        var lng=Cesium.Math.toDegrees(cartographic.longitude);//经度值
        var lat=Cesium.Math.toDegrees(cartographic.latitude);//纬度值
        if (cartesian) {
            Points_lc.push({lng:lng,lat:lat});
        }
        //大于两个点就要进行画图
        if (Points_lc.length > 2) {
            polygon_lc.show = true;
            var polyPoints = [];
            for (var i = 0; i < Points_lc.length; i++) {
                polyPoints.push(Points_lc[i].lng);
                polyPoints.push(Points_lc[i].lat);
            }
            polygon_lc.polygon = {
                hierarchy : Cesium.Cartesian3.fromDegreesArray(polyPoints),
                height : 0,
                material : Cesium.Color.RED.withAlpha(0.5),
                outline : true,
                outlineColor : Cesium.Color.BLACK
            };
        }
        else {
            polygon_lc.show = false;
        }
        _viewer.entities.add(polygon_lc);
    };

    MarkButton.prototype.DisableAPoint=disableAPoint;
    MarkButton.prototype.EnableAPoint=enableAPoint;
    MarkButton.prototype.EnableALine=enableALine;
    MarkButton.prototype.EnableAPolygon=enableAPolygon;
    //MarkButton.prototype.OnClickListener=setOnClickListener;
    MarkButton.prototype.TagPoint=tagPoint;
    MarkButton.prototype.TagLine=tagLine;
    MarkButton.prototype.TagPolygon=tagPolygon;
    MarkButton.prototype.DisableALine=disableALine;
    MarkButton.prototype.DisableAPolygon=disableAPolygon;
    return MarkButton;
})();

