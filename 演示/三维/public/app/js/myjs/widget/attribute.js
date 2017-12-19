Namespace.register('Qjjs.Widget');
Qjjs.Widget.AttributeController= (function () {
var _viewer;
 var _handler;
    var AttributeButton=function (viewer) {
        _viewer=viewer;
        var tileset = _viewer.scene.primitives.add(new Cesium.Cesium3DTileset({
            url: 'http://192.168.199.183/jiangn/tileset.json',
            debugShowStatistics: true,
            baseScreenSpaceError: 1024,
            skipScreenSpaceErrorFactor: 16,
            skipLevels: 1,
            immediatelyLoadDesiredLevelOfDetail: false,
            loadSiblings: false,
            cullWithChildrenBounds: true,
            debugColorizeTiles: true
        }));
        // var provider =new Cesium.WebMapServiceImageryProvider({
//     url : 'http://10.1.1.190:8080/geoserver/lp/wms',
//     layers : '河流',
//     parameters : {
//         transparent : 'true',
//         format : 'image/png'
//     }
//     //  proxy: new Cesium.DefaultProxy('/proxy/')
// });
// viewer.imageryLayers.addImageryProvider(provider);
// viewer.trackedEntity = provider;
//         tileset.readyPromise.then(function (tileset) {
//             // Set the camera to view the newly added tileset
//             _viewer.camera.viewBoundingSphere(tileset.boundingSphere, new Cesium.HeadingPitchRange(0, -0.5, 0));
//             _viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
//         });
//         var heightOffset = 20000;
//         tileset.readyPromise.then(function (tileset) {
//             // Position tileset
//             var boundingSphere = tileset.boundingSphere;
//             var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
//             var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
//             var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
//             var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
//             tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
//         });
        _handler = new Cesium.ScreenSpaceEventHandler(_viewer.scene.canvas);
    };
    var getAttribute=function () {
        var nameOverlay = document.createElement('div');
        _viewer.container.appendChild(nameOverlay);
        nameOverlay.className = 'backdrop';
        nameOverlay.style.display = 'none';
        nameOverlay.style.position = 'absolute';
        nameOverlay.style.bottom = '0';
        nameOverlay.style.left = '0';
        nameOverlay.style['pointer-events'] = 'none';
        nameOverlay.style.padding = '4px';
        nameOverlay.style.backgroundColor = 'white';
        var selected = {
            feature: undefined,
            originalColor: new Cesium.Color()
        };
        var highlighted = {
            feature: undefined,
            originalColor: new Cesium.Color()
        };
        var selectedEntity = new Cesium.Entity();
        var onMouseMove =function onMouseMove(movement) {
            if (Cesium.defined(highlighted.feature)) {
                highlighted.feature.color = highlighted.originalColor;
                highlighted.feature = undefined;
            }
            var pickedFeature = _viewer.scene.pick(movement.endPosition);
            if (!Cesium.defined(pickedFeature)) {
                nameOverlay.style.display = 'none';
                return;
            }
            // A feature was picked, so show it's overlay content
            nameOverlay.style.display = 'block';
            nameOverlay.style.bottom = _viewer.canvas.clientHeight - movement.endPosition.y + 'px';
            nameOverlay.style.left = movement.endPosition.x + 'px';
            var name = pickedFeature.getProperty('名称');
            if (!Cesium.defined(name)) {
                name = pickedFeature.getProperty('名称');
            }
            nameOverlay.textContent=name;
            // Highlight the feature if it's not already selected.
            if (pickedFeature !== selected.feature) {
                highlighted.feature = pickedFeature;
                Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
                pickedFeature.color = Cesium.Color.BLUE;
            }
        };
        var clickHandler =_handler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        var onLeftClick=function onLeftClick(movement) {
            if (Cesium.defined(selected.feature)) {
                selected.feature.color = selected.originalColor;
                selected.feature = undefined;
            }
            var pickedFeature = _viewer.scene.pick(movement.position);
            if (!Cesium.defined(pickedFeature)) {
                clickHandler(movement);
                return;
            }
            if (selected.feature === pickedFeature) {
                return;
            }
            selected.feature = pickedFeature;
            if (pickedFeature === highlighted.feature) {
                Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
                highlighted.feature = undefined;
            } else {
                Cesium.Color.clone(pickedFeature.color, selected.originalColor);
            }
            pickedFeature.color = Cesium.Color.LIME;
            var featureName = pickedFeature.getProperty('名称');
            selectedEntity.name = featureName;
            selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
            _viewer.selectedEntity = selectedEntity;
            selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>' +
                '<tr><th>区划编码</th><td>' + pickedFeature.getProperty('区划编码') + '</td></tr>' +
                '<tr><th>Shape_Leng</th><td>' + pickedFeature.getProperty('Shape_Leng') + '</td></tr>' +
                '<tr><th>Shape_Area</th><td>' + pickedFeature.getProperty('Shape_Area') + '</td></tr>' +
                '<tr><th>Height</th><td>' + pickedFeature.getProperty('Height') + '</td></tr>' +
                '</tbody></table>';
        };
        _handler.setInputAction(onMouseMove, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        _handler.setInputAction(onLeftClick, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
     };

    AttributeButton.prototype.GetAttribute=getAttribute;
    return AttributeButton;
})();