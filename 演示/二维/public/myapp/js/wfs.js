function loadWFS(layerName){
    var param = {
        service:'WFS',
        version:'1.0.0',
        request:'GetFeature',
        typeName:layerName,
        outputFormat:'application/json',
        srsName:'EPSG:4326'
    };

    this.getFeatureBaseUrl = this.options.url + "?request=GetFeature&outputformat=json&typename=" + this.options.featureType + "&version=" + this.options.version || "1.1.0";
    $.ajax({
        url: this.getFeatureBaseUrl,
        dataType:'json',
        success:loadWfsHandler
    });
    var layer;
    function loadWfsHandler(data){
        console.log(data);
        layer = L.geoJson(data,{
//                  style:function(feature){
//                      return {
//                          stroke:true,
//                          color:'#F80909',
//                          opacity: 1,
//                          fillOpacity: 0.9,
//                          fillColor: '#F80909',
//                          weight:5
//                      }
//                  },
            pointToLayer:function(featyre,latlng){
            }
        }).addTo(map);
    }
}