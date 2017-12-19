var Namespace = {};
Namespace.register = function(path){
    'use strict';
    var arr = path.split('.');
    var ns = '';
    for(var i=0;i<arr.length;i++){
        if(i>0)
        { ns += '.';
        ns += arr[i];
        eval('if(typeof(" + ns + ") == "undefined")' + ns + ' = new Object();');}
    }
};


