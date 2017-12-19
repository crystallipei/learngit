

// function addLi(layer){
//    var li='<li><input type="checkbox" id=\'"+layer.id+"\' class=\'listCss\' checked ><a>'+layer+'</a></li>';
//    //  var li='<li id="li"><a>'+layer+'</a></li>';
//     return li;
// }
//
var bounds = [];
var start=[];
var end=[];
var rectangleMeasure = {
    startPoint: null,
    endPoint: null,
    rectangle:null,
    e:null,
    layer: L.layerGroup(),
    color: "#0D82D7",
    addRectangle:function(){
        rectangleMeasure.destory();
        bounds = [];
        bounds.push(rectangleMeasure.startPoint);
        bounds.push(rectangleMeasure.endPoint);
        rectangleMeasure.rectangle = L.rectangle(bounds, {color: rectangleMeasure.color, weight: 1});
        rectangleMeasure.rectangle.addTo(rectangleMeasure.layer);
        rectangleMeasure.layer.addTo(Globe.map);


        //   Globe.map.on('click',rectangleMeasure.attribute).off('mousemove',rectangleMeasure.mousemove).off('mouseup', rectangleMeasure.mouseup).off('mousedown', rectangleMeasure.mousedown);

    },
    close:function(){
        var span = document.createElement("span");
        L.DomEvent.addListener(span,"click",function(){
            rectangleMeasure.destory();
        });
    },
    mousedown: function(e){
        rectangleMeasure.rectangle = null;
        rectangleMeasure.tips = null;
        Globe.map.dragging.disable();
        rectangleMeasure.startPoint = e.latlng;
        Globe.map.on('mousemove',rectangleMeasure.mousemove)
    },
    mousemove:function(e){
        rectangleMeasure.endPoint = e.latlng;
        rectangleMeasure.addRectangle();
        Globe.map.off('mousedown ', rectangleMeasure.mousedown).on('mouseup', rectangleMeasure.mouseup);
    },
    mouseup: function(e){
        rectangleMeasure.close();
        Globe.map.dragging.enable();
        rectangleMeasure.e= e.latlng;
        Globe.map.fitBounds(bounds);
        rectangleMeasure.layer.removeFrom(Globe.map);
        end=rectangleMeasure.e;
        start= rectangleMeasure.startPoint;

        rectangleMeasure.rectangle=null;
        rectangleMeasure.layer= L.layerGroup();
        if(end)
        {
            var cqlFilter= start.lng+ ','+end.lat + ',' + end.lng+ ',' + start.lat ;
            var url = 'http://10.1.1.190:8080/geoserver/lp/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=' + Globe.tuceng[0]._name + '&outputFormat=application%2Fjson&BBOX=' + cqlFilter;
            $.ajax({
                type: "GET",
                url: url,
                dataType: 'json',
                geometryName: 'the_geom',
                success: function (response) {
                    var props = [];
                    var propList = [];
                    var propName = [];
                    var propVal = [];
                    var html = '<table id="" height="150"  width="200" border="2" bgcolor="#E6E6FA"><caption >属性表2</caption>';
                    if (response.type && response.type == "FeatureCollection") {
                        if (response.features.length > 0) {
                            for (var i = 0; i < response.features.length; i++) {
                                props[i] = response.features[i].properties;
                                propList[i] = Object.getOwnPropertyNames(props[i]);
                                for (var j = 0; j < propList[i].length; j++) {
                                    propName[j] = propList[i];
                                    var v = propName[j];
                                    propVal[j] = props[i][v[j]];
                                    html += '<tr>';
                                    html += "<td>" + v[j] + "</td>";
                                    html += "<td>" + propVal[j] + "</td>";
                                }
                            }
                            html += '</tr></table>';
                            Globe.map.openPopup(html,e.latlng);
                        }
                    }
                }
            })
        }
        Globe.map.off('mousemove',rectangleMeasure.mousemove).off('mouseup', rectangleMeasure.mouseup).off('mousedown', rectangleMeasure.mousedown).on('click',rectangleMeasure.attribute);

    },
    destory:function(){
        if(rectangleMeasure.rectangle)
            rectangleMeasure.layer.removeLayer(rectangleMeasure.rectangle);
    }
};