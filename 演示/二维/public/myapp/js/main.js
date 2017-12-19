Globe={};
$(document).ready(function() {
    var layerOsm = new L.tileLayer.chinaProvider('TianDiTu.Normal.Map', {maxZoom: 18, minZoom: 1});
    var mymap = new L.Map('mapid', {
        measureControl: true,
        doubleClickZoom: false
    }).addLayer(layerOsm).setView([30.5, 120.5], 8);
    Globe.map=mymap;
    var osm2 = new  L.tileLayer.chinaProvider('TianDiTu.Normal.Map',{minZoom: 1, maxZoom: 18});
    var miniMap = new L.Control.MiniMap(osm2, { toggleDisplay: true }).addTo(mymap);
    var marker = L.marker([29.8, 120.5]).addTo(mymap);
    var circle = L.circle([31, 120.5], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 5000
    }).addTo(mymap);
    var polygon = L.polygon([
        [31.0, 120.4],
        [31.2, 120.1],
        [31.3, 120.3]
    ]).addTo(mymap);
    var SHIFT_LEFT_12 = Math.pow(2.0, 12.0);
    Globe.polygon=polygon;
   // marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    marker.bindPopup("<b>大家好!</b><br>我是一个点。");
    circle.bindPopup(SHIFT_LEFT_12);
 polygon.bindPopup("多边形");
    var popup = L.popup();
   // function onMapClick(e) {
   //     popup
   //         .setLatLng(e.latlng)
   //         .setContent('hello')
   //         .openOn(mymap);
   // }
   // mymap.on('click', onMapClick);
    $("#zoomIn").click(function () {
        mymap.zoomIn(2);
    });
    $("#zoomOut").click(function () {
        mymap.zoomOut(1);
    });
    var control = L.control.zoomBox({modal: true});
    mymap.addControl(control);
    proj4.defs("EPSG:4490", "+proj=longlat +ellps=GRS80 +no_defs");
    proj4.defs("EPSG:4528", "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=40500000 +y_0=0 +ellps=GRS80 +units=m +no_defs");
    var sourceProj = new proj4("EPSG:4490");
    var destProj = new proj4("EPSG:4528");
    var p = [];
    var l = [];
    $('#dist').click(function(){
        $('#mapid').css({cursor:'crosshair'});
        mymap.on('click', onMap);
    }) ;
    //  $("#dist").toggle( mymap.on('click'), onMap, onMapClk);
    $('#home').click(function () {
        mymap.setView([30.5, 120.5], 8);
    });
    var  rectangle={};
    var iCount=0;
    var southWest,northEast;
    function latL(e){
        if(iCount==1){
            northEast=e.latlng;
            var bounds=L.latLngBounds(southWest,northEast);
           rectangle=L.rectangle(bounds, {color: "#0D82D7", weight: 1}).addTo(mymap);
           // mymap.fitBounds(bounds);
          //  setTimeout( mymap.removeLayer(rectangle),10000);
         iCount = 2;

        }
        else if (iCount==0)
            {
            if(rectangle)
            { mymap.removeLayer(rectangle);}
            southWest = e.latlng;
            iCount++;

        }
    }
    $('#zoom3').click(function(){
        $('#mapid').css({cursor:'crosshair'});
     mymap.on('click',latL);
    });

 // $('#zoom3').click(function(){
 //         $('#mapid').css({cursor:'crosshair'});
 //     mymap.on('mousedown', rectangleM.mousedown);
 //
 //     });
    function onMap(e) {
        p.push([e.latlng.lat, e.latlng.lng]);
        polyline.getLatLngs(p);
        polyline.setLatLngs(p);
        var  s=proj4(sourceProj, destProj, p[0]);
        var t=proj4(sourceProj, destProj, p[1]);
        l=Math.sqrt(Math.pow((s[0]-t[0]),2)+Math.pow((s[1]-t[1]),2));
        if(l>0)
        {
            popup
                .setLatLng(e.latlng)
                .setContent("地图上两点之间的距离为:" + l + "米.")
                .openOn(mymap);
            l=[];
            p=[];
            return onMap();
        }
    }
    var line = [];
    var pt=[];
    var polyline = L.polyline(line, {
        color: 'blue',
        opacity: 0.5,
        weight: 3,
        clickable: false
    }).addTo(mymap);
    function  mapClick(e) {
        var clickLocation=[e.latlng.lat, e.latlng.lng];
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(mymap);
    }
    $("#point").click(function(){
        mymap.on( 'click',mapClick);
    });
    function onMapClk(e) {
        //当点击地图的时候将当前点放入数组，然后设置线的经纬度，达到画线的目的
        line.push([e.latlng.lat, e.latlng.lng]);
        polyline.setLatLngs(line);
    }
    //为地图添加click事件
    $("#line").one("click",function(e){
        $('#mapid').css({cursor:'crosshair'});
        mymap.on( 'click',onMapClk);
       $('#mapid').dblclick(function () {
            line = [];
      })
    });
    $("#polygon").click(function () {
        $('#mapid').unbind("click", onMapClk());
    });

    var MySource =L.WMS.Source.extend({
        'getFeatureInfo': function(point, latlng, layers, callback) {
            var params = this.getFeatureInfoParams(point, layers),
                url = this._url + L.Util.getParamString(params, this._url);
            this.showWaiting();
            this.ajax(url, done);
            function done(result) {
                this.hideWaiting();
                var text = this.parseFeatureInfo(result, url);
                callback.call(this, latlng, text);
            }
        },
        'showFeatureInfo': function(latlng, info) {
            if (!this._map) {
                return;
            }
            var infoJson = JSON.parse(info);
            if(infoJson.features.length>0)
            {
                var props=infoJson.features[0].properties;
                var propList=Object.getOwnPropertyNames(props);
                var html='<table id="aaa" height="150"  width="200" border="2" bgcolor="#E6E6FA"><caption >属性表</caption>';
                for (var i=0;i<propList.length;i++)
                {
                    var propName=propList[i];
                    var propVal=props[propName];
                    html+='<tr>';
                    html += "<td>" + propName + "</td>";
                    html += "<td>" + propVal + "</td>";
                }
                html+='</tr></table>';
               mymap.openPopup(html,latlng);
            }
        }
    });

    $('#att').click(function() {
        mymap.on('mousedown', rectangleMeasure.mousedown);
   });
    var source = new MySource(('http://10.1.1.190:8080/geoserver/lp/wms?'),{
        'transparent':true,
        format:'image/png'

    });
    $("#text").bind("blur",function(){
     //   var url=$("#text").val()+"REQUEST=GetCapabilities";
        $("#message").html('');
        $.ajax({
            type: "GET",
            url: 'http://10.1.1.190:8080/geoserver/lp/wms?&REQUEST=GetCapabilities',
            dataType: "xml",
            success: function (ResponseText) {
                var select = "<select border='1px' class=\"ui-dialog-input ui-dialog-input-username\" type=\"input\" id=\"text1\" name=text1 >";
                $(ResponseText).find('Layer').each(function () {
                    var namelayer = $(this).children('Name').text();
                    select +="<option>"+ namelayer+"</option>" ;
                });
                select+= "</select>";
                $("#message").append(select);
            }
        });
    });
var tuceng=[];
Globe.tuceng=tuceng;
    $("#btn").click(function(){
        var lay=$("#text1").val();
      //  var  s=$("#text").val();
      //  var  url= source.initialize(s);
       tuceng.push(source.getLayer(lay).addTo(mymap));
        hideD();
        myFunction(lay);
        $(".listCss").click(function(){
            var inputs = $(".listCss");
            for(var j=0;j<tuceng.length;j++)
            {
                for(var i=0;i<inputs.length;i++)
                {
                    if(inputs[i].checked && inputs[i].value==tuceng[j]._name && !mymap.hasLayer(tuceng[j]))
                    {
                        tuceng[j].addTo(mymap);
                    }
                    else if (!inputs[i].checked && inputs[i].value==tuceng[j]._name && mymap.hasLayer(tuceng[j]))
                    {
                        tuceng[j].removeFrom(mymap);
                    }
                }
            }
        });
    });
    L.control.scale().addTo(mymap);
    var myIcon = L.icon({
        iconUrl: 'images/caribbean.jpg',
        iconSize: [38, 95],
      //  iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowUrl: 'images/rulers.png',
        shadowSize: [68, 95],
      //  shadowAnchor: [22, 94]
         position:'topright'
    });
    L.marker([50.505, 30.57], {icon: myIcon}).addTo(mymap);


});