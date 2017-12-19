Namespace.register('Qjjs.Widget');
Qjjs.Widget.MeasureController= (function () {
    var _viewer;
    var _entity;
    var _handler;
    var long = false;
    var Points_lc = []; //记录所点击的路径
    var polyline_lc = new Cesium.Entity();
    var length_lc;
    var _callback;
    var MeasureButton = function (viewer) {
        _viewer = viewer;
        _entity = _viewer.entities.add({
            label: {
                font: '14pt monospace',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 3,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM, //垂直方向以底部来计算标签的位置
                pixelOffset: new Cesium.Cartesian2(0, -9),  //偏移量
                followSurface:true,
                height: 10,
                show: false
            }
        });
        _handler = new Cesium.ScreenSpaceEventHandler(_viewer.scene.canvas);
    };
    function distance(e) {
        _viewer.entities.remove(polyline_lc);
        var cartesian = _viewer.camera.pickEllipsoid(e.position, _viewer.scene.globe.ellipsoid);
        var cartographic=Cesium.Cartographic.fromCartesian(cartesian);
        var lng=Cesium.Math.toDegrees(cartographic.longitude);//经度值
        var lat=Cesium.Math.toDegrees(cartographic.latitude);//纬度值
        if (cartesian) {
            Points_lc.push({x: cartesian.x, y: cartesian.y,lng:lng,lat:lat});
        }
        //大于两个点就要进行画图
        if (Points_lc.length > 1) {
            polyline_lc.show = true;
            var polyPoints = [];
            for (var i = 0; i < Points_lc.length; i++) {
                polyPoints.push(Points_lc[i].lng);
                polyPoints.push(Points_lc[i].lat);
                          }
            polyline_lc.name = i;
            polyline_lc.polyline = {
                positions: Cesium.Cartesian3.fromDegreesArray(polyPoints),
                width: 5,
                // followSurface:true,
                offHeight : 100000000000,
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
        length_lc = computeLength(Points_lc);
        _entity.position = cartesian;
        _entity.label.show = true;
        _entity.label.text ="长度:" + length_lc + "米";
    }
var getDistance=function() {
    if (!long) {
        _handler.setInputAction(distance, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        _handler.setInputAction(function () {
            Points_lc = [];
            Points_lc.length = 0;
            _viewer.entities.remove(polyline_lc);
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
    else {
        Points_lc = [];
        Points_lc.length = 0;
        _viewer.entities.remove(polyline_lc);
        _handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        _handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
        _handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
    long = !long;
};
function computeLength(point){
    var length=point.length;
    if(length>1){
    var dis = Cesium.Cartesian3.distance(
        new Cesium.Cartesian3(point[length-2].x, point[length-2].y),
            new Cesium.Cartesian3(point[length-1].x, point[length-1].y)
    );
    return dis;
    }
    else
        return 0;
}
 var  disableDistance=function () {
     _handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
     _handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
     _handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
 };

    MeasureButton.prototype.GetDistance=getDistance;
    MeasureButton.prototype.DisableDistance=disableDistance;

    return MeasureButton;
})();