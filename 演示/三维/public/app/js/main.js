
$(document).ready(function () {
    var viewer = new Cesium.Viewer('cesiumContainer', {
        animation: false,  //是否显示动画控件
        timeline: false,//是否显示时间线控件
        fullscreenButton: true,
        alpha: 1
    });
    viewer._cesiumWidget._creditContainer.style.display = 'none';

    // viewer.extend(Cesium.viewerCesiumInspectorMixin);

    // viewer.scene.globe.depthTestAgainstTerrain = true;
    var citizensBankPark = viewer.entities.add({
        name : 'Citizens Bank Park',
        position : Cesium.Cartesian3.fromDegrees(-75.166493, 39.9060534),
        point : {
            pixelSize : 5,
            color : Cesium.Color.RED,
            outlineColor : Cesium.Color.WHITE,
            outlineWidth : 2
        },
        label : {
            text : 'Citizens Bank Park',
            font : '14pt monospace',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth : 2,
            verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
            pixelOffset : new Cesium.Cartesian2(0, -9)
        }
    });
    viewer.zoomTo(viewer.entities);

    var blackMarble = viewer.imageryLayers.addImageryProvider(Cesium.createTileMapServiceImageryProvider({
        url: 'https://cesiumjs.org/blackmarble',
        flipXY: true
    }));
    blackMarble.splitDirection = Cesium.ImagerySplitDirection.LEFT;

    var slider = document.getElementById('slider');
    viewer.scene.imagerySplitPosition = (slider.offsetLeft) / slider.parentElement.offsetWidth;
    var dragStartX = 0;
    document.getElementById('slider').addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

    function mouseUp() {
        window.removeEventListener('mousemove', sliderMove, true);
    }

    function mouseDown(e) {
        var slider = document.getElementById('slider');
        dragStartX = e.clientX - slider.offsetLeft;
        window.addEventListener('mousemove', sliderMove, true);
    }

    function sliderMove(e) {
        var slider = document.getElementById('slider');
        var splitPosition = (e.clientX - dragStartX) / slider.parentElement.offsetWidth;
        slider.style.left = 100.0 * splitPosition + "%";
        viewer.scene.imagerySplitPosition = splitPosition;
    }
    var west = 120;
    var south = 30.0;
    var east = 120.0;
    var north = 40.0;
    var rectangle = Cesium.Rectangle.fromDegrees(west, south, east, north);
    viewer.camera.setView({
        destination: rectangle,
        orientation: {
            heading: Cesium.Math.toRadians(0.0), //默认值
            pitch: Cesium.Math.toRadians(-90.0), // 默认值
            roll: 0.0 //默认值
        }
    });
    var camera = viewer.scene.camera;
    var layerOsm = new L.tileLayer.chinaProvider('TianDiTu.Normal.Map', {maxZoom: 18, minZoom: 1});
    var map = new L.Map('draggable', {
        measureControl: true,
        doubleClickZoom: false
    }).addLayer(layerOsm).setView([30.5, 120.5], 8);
    var bounds = L.latLngBounds([south, west], [north, east]);
    map.fitBounds(bounds);

    viewer.camera.moveStart.addEventListener(function () {
        LinkOnFrame()
    });
    viewer.camera.moveEnd.addEventListener(function () {
        LinkOnFrame()
    });
    var range = [];

    function LinkOnFrame() {
        range = camera.computeViewRectangle();
        var point1 = [range.north / Math.PI * 180, range.west / Math.PI * 180];
        var point2 = [range.south / Math.PI * 180, range.east / Math.PI * 180];
        var bounds = L.latLngBounds(point1, point2);
        map.fitBounds(bounds);
    }
    $('#draggable').click(function () {

        var bound = map.getBounds();
        viewer.camera.flyTo({
            destination: Cesium.Rectangle.fromDegrees(bound._southWest.lng, bound._southWest.lat, bound._northEast.lng, bound._northEast.lat)
        });
        viewer.camera.moveStart.removeEventListener();
        viewer.camera.moveEnd.removeEventListener();
    });

    var ViewerButton = new Qjjs.Widget.ViewerController(viewer);
    var MarkButton = new Qjjs.Widget.LableController(viewer);
    var MeasureButton = new Qjjs.Widget.MeasureController(viewer);
    var AttributeButton=new Qjjs.Widget.AttributeController(viewer);
    var func = function (e) {
        switch (e.currentTarget.id)
        {
            case "home":
                ViewerButton.ToHome(120, 30.0, 120.0, 40.0);
                break;
            case "position":
                ViewerButton.EnablePosition(function (cartesian) {
                    ViewerButton.TagPoint(cartesian);
                });
                break;
            case  "apoint":
                MarkButton.EnableAPoint(function (cartesian) {
                    MarkButton.TagPoint(cartesian);
                });
                break;
            case  "aline":
                    MarkButton.EnableALine(function (cartesian) {
                    MarkButton.TagLine(cartesian);
                });
                break;
            case  "apolygon":
                MarkButton.EnableAPolygon(function (cartesian) {
                    MarkButton.TagPolygon(cartesian);
                });
                break;
            case "distance":
                    MeasureButton.GetDistance();
                break;
            case "att":
                AttributeButton.GetAttribute();
                break;
            case   "key_camera":
                ViewerButton.KeyControlCamera();
                break;
            case   "mouse_camera":
                ViewerButton.MouseControlCamera();
                break;
            default:
                MarkButton.DisableAPoint();
                MarkButton.DisableALine();
                MarkButton.DisableAPolygon();
                ViewerButton.DisablePosition();
                MeasureButton.DisableDistance();
                }
    };
    $('.btn').on("click",func);

    viewer.camera.moveStart.addEventListener(function (moveStartPosition) {
    });
    viewer.camera.moveEnd.addEventListener(function (moveEndPosition) {
    });




});

