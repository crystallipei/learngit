function myFunction(layer){
    var newI=document.createElement("li");
    var newItem=document.createElement("input");
    newItem.type = "checkbox";
    newItem.classList= "listCss";
    newItem.setAttribute("checked","checked");
    newItem.value=layer;
    var textnode=document.createTextNode(layer);
    var list=document.getElementById("ul");
    list.insertBefore(newI,list.childNodes[0]);
    newI.appendChild(newItem);
    newI.appendChild(textnode);
}


// function create(layer){
//     var board = document.getElementById("ul");
//     var e = createElement("input","cpname");
//     e.type = "checkbox";
//     e.id = "chid";
//     e.value ="123";
//     board.appendChild(e);
//     //设置选中
//     e.setAttribute("checked","checked");
//     //添加文字
//     var textnode=document.createTextNode(layer);
//     board.insertBefore(textnode,board.childNodes[0]);
//     board.insertBefore(e,board.childNodes[0]);
// }
//
// function createElement(type, name) {
//     var element = null;
//     try {
//         // First try the IE way; if this fails then use the standard way
//         element = document.createElement('<'+type+' name="'+name+'">');
//     } catch (e) {
//         // Probably failed because we’re not running on IE
//     }
//     if (!element) {
//         element = document.createElement(type);
//         element.name = name;
//     }
//     return element;
// }
