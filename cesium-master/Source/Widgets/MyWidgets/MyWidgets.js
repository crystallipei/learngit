define([
    '../../Core/defined',
    '../../Core/defineProperties',
    '../../Core/destroyObject',
    '../../Core/DeveloperError',
    '../../ThirdParty/knockout',
    '../getElement',
    './MyWidgetsViewModel'
    ], function(
        defined,
        defineProperties,
        destroyObject,
        DeveloperError,
        knockout,
        getElement,
        MyWidgetsViewModel) {
    'use strict';

    /**
     * Inspector widget to aid in debugging
     *
     * @alias MyWidgets
     * @constructor
     *
     * @param {Element|String} container The DOM element or ID that will contain the widget.
     * @param {Scene} scene The Scene instance to use.
     *
     * @demo {@link http://cesiumjs.org/Cesium/Apps/Sandcastle/index.html?src=Cesium%20Inspector.html|Cesium Sandcastle Cesium Inspector Demo}
     */
    function MyWidget(container, scene) {
        //>>includeStart('debug', pragmas.debug);
        if (!defined(container)) {
            throw new DeveloperError('container is required.');
        }

        if (!defined(scene)) {
            throw new DeveloperError('scene is required.');
        }
        //>>includeEnd('debug');

        container = getElement(container);
        var performanceContainer = document.createElement('div');
        var viewModel = new MyWidgetsViewModel(scene, performanceContainer);
        this._viewModel = viewModel;
        this._container = container;
        var element = document.createElement('div');
        this._element = element;
        var text = document.createElement('div');
        text.textContent = 'My Widget';
        text.className = 'cesium-myWidgets-button';
        text.setAttribute('data-bind', 'click: toggleDropDown');
        element.appendChild(text);
        element.className = 'myWidgets';
        element.setAttribute('data-bind', 'css: { "cesium-myWidgets-visible" : dropDownVisible, "cesium-myWidgets-hidden" : !dropDownVisible }');
        container.appendChild(this._element);
        var suspendUpdates = document.createElement('div');
        element.appendChild(suspendUpdates);
        var upCheckbox = document.createElement('input');
        upCheckbox.type = 'checkbox';
        upCheckbox.setAttribute('data-bind', 'checked: suspendUpdates');
        suspendUpdates.appendChild(upCheckbox);
        suspendUpdates.appendChild(document.createTextNode('Suspend LOD update'));
        var tileCoords = document.createElement('div');
        element.appendChild(tileCoords);
        var coordCheck = document.createElement('input');
        coordCheck.type = 'checkbox';
        coordCheck.setAttribute('data-bind', 'checked: tileCoordinates');
        tileCoords.appendChild(coordCheck);
        tileCoords.appendChild(document.createTextNode('Show tile coordinates'));
        knockout.applyBindings(viewModel, this._element);
    }
    defineProperties(MyWidget.prototype, {
        /**
         * Gets the parent container.
         * @memberof MyWidget.prototype
         *
         * @type {Element}
         */
        container : {
            get : function() {
                return this._container;
            }
        },
        /**
         * Gets the view model.
         * @memberof MyWidget.prototype
         *
         * @type {MyWidgetsViewModel}
         */
        viewModel : {
            get : function() {
                return this._viewModel;
            }
        }
    });
    /**
     * @returns {Boolean} true if the object has been destroyed, false otherwise.
     */
    MyWidget.prototype.isDestroyed = function() {
        return false;
    };

    /**
     * Destroys the widget.  Should be called if permanently
     * removing the widget from layout.
     */
    MyWidget.prototype.destroy = function() {
        knockout.cleanNode(this._element);
        this._container.removeChild(this._element);
        this.viewModel.destroy();
        return destroyObject(this);
    };

    return MyWidget;
});
