var bounds = [];
var  rectangleM = {
    startPoint: null,
    endPoint: null,
    rectangle:null,
    layer: L.layerGroup(),
    color: "#0D82D7",
    addRectangle:function(){
        rectangleM.destory();
        bounds = [];
        bounds.push( rectangleM.startPoint);
        bounds.push( rectangleM.endPoint);
        rectangleM.rectangle = L.rectangle(bounds, {color:  rectangleM.color, weight: 1});
        rectangleM.rectangle.addTo( rectangleM.layer);
        rectangleM.layer.addTo(Globe.map);
        var a=rectangleM.startPoint;
        var b=rectangleM.endPoint;
        return a;b;
    },
    close:function(){
        var span = document.createElement("span");
        L.DomEvent.addListener(span,"click",function(){
            rectangleM.destory();
        });
    },
    mousedown: function(e){
        rectangleM.rectangle = null;
        rectangleM.tips = null;
        Globe.map.dragging.disable();
        rectangleM.startPoint = e.latlng;
        Globe.map.on('mousemove', rectangleM.mousemove)
    },
    mousemove:function(e){
        rectangleM.endPoint = e.latlng;
        rectangleM.addRectangle();
        Globe.map.off('mousedown ',  rectangleM.mousedown).on('mouseup',  rectangleM.mouseup);
    },
    mouseup: function(e){
        rectangleM.close();
        Globe.map.dragging.enable();
        Globe.map.fitBounds(bounds);
        rectangleM.layer.removeFrom(Globe.map);
        rectangleM. startPoint= null;
        rectangleM.endPoint= null;
        rectangleM.rectangle=null;
        rectangleM.layer= L.layerGroup();
        Globe.map.off('mousemove', rectangleM.mousemove).off('mouseup',  rectangleM.mouseup).off('mousedown',  rectangleM.mousedown);
    },
    destory:function(){
        if( rectangleM.rectangle)
            rectangleM.layer.removeLayer( rectangleM.rectangle);
    }
};