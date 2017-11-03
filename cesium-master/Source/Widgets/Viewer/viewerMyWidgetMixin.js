define([
    '../../Core/defined',
    '../../Core/defineProperties',
    '../../Core/DeveloperError',
    '../MyWidgets/MyWidgets'
], function(
    defined,
    defineProperties,
    DeveloperError,
    MyWidget) {
    'use strict';

    /**
     * A mixin which adds the CesiumInspector widget to the Viewer widget.
     * Rather than being called directly, this function is normally passed as
     * a parameter to {@link Viewer#extend}, as shown in the example below.
     * @exports viewerCesiumInspectorMixin
     *
     * @param {Viewer} viewer The viewer instance.
     *
     * @exception {DeveloperError} viewer is required.
     *
     * @demo {@link http://cesiumjs.org/Cesium/Apps/Sandcastle/index.html?src=Cesium%20Inspector.html|Cesium Sandcastle Cesium Inspector Demo}
     *
     * @example
     * var viewer = new Cesium.Viewer('cesiumContainer');
     * viewer.extend(Cesium.viewerCesiumInspectorMixin);
     */
    function viewerMyWidgetMixin(viewer) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(viewer)) {
            throw new DeveloperError('viewer is required.');
        }
        //>>includeEnd('debug');

        var myWidgetsContainer = document.createElement('div');
        myWidgetsContainer.className = 'cesium-viewer-cesiumInspectorContainer';
        viewer.container.appendChild( myWidgetsContainer);
        var  myWidget = new MyWidget(myWidgetsContainer, viewer.scene);

        defineProperties(viewer, {
            myWidget : {
                get : function() {
                    return myWidget ;
                }
            }
        });
    }

    return  viewerMyWidgetMixin;
});
