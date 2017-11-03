/*global require*/
// require in the complete Cesium object and reassign it globally.
// This is meant for use with the Almond loader.
var developMode=true;
if(developMode){
    require.config({
       baseUrl:'../Source'
    });
}else{
require.config({
    paths:{
    'Cesium':'../../Build/Cesium/Cesium'
    },
    shim:{
        Cesium:{
            exports:'Cesium'
        }
    }
});
}
if(typeof Cesium !=='undefined'){
    onload(Cesium);
}else if(typeof require==='function'){
    require(['Cesium'],onload);
}
