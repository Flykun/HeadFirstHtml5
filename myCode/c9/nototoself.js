window.onload = init;

function init() {
    var button = document.getElementById("add_button");
    button.onclick = createSticky;
    
    //localStorage本地存储只能存字符串
    var stickiesArray = getStickiesArray();
    
    for (var i = 0;i < stickiesArray.length ; i++){
        var key = stickiesArray[i];
        console.log(key);
        var value = JSON.parse(localStorage[key]);//此时这value为stickyObj对象
        addStickyToDOM(key,value);
    }
}
//将标签添加进DOM
function addStickyToDOM(key,stickyObj) {//使用即时贴的键来作为id,创建DOM
    var stickies = document.getElementById("stickies");
    var sticky = document.createElement("li");
    sticky.setAttribute("id",key);//当需要删除的时候,就取出这个id,并删除
    
    sticky.style.backgroundColor = stickyObj.color;//根据对象的颜色,改变背景色
    
    var span = document.createElement("span");
    span.setAttribute("class", "sticky");
    span.innerHTML = stickyObj.value;
    sticky.appendChild(span);
    stickies.appendChild(sticky);
    stickies.onclick = deleteSticky;
}
//将标签内容写进本地储存
function createSticky() {
    var stickiesArray = getStickiesArray();
    //颜色
    var colorSelectObj = document.getElementById("note_color");
    var index = colorSelectObj.selectedIndex;
    var color = colorSelectObj[index].value;
    //key
    var currentDate = new Date();//取时间,作为保存的唯一key
    var key = "sticky_" + currentDate.getTime();
    var userNote = document.getElementById("note_text");
    var value = userNote.value;
    if (!(value.length > 0)) {
        return;
    }
    //存储为对象
    var stickyObj = {
        "value" : value,
        "color" : color
    }
    //保存到本地存储
    localStorage.setItem(key,JSON.stringify(stickyObj));
    stickiesArray.push(key);//push(key) 会把这个键存在数组末尾
    localStorage.setItem("stickiesArray",JSON.stringify(stickiesArray));
    
    addStickyToDOM(key,stickyObj);
    userNote.value = "";//清空输入框
}
//取出本地的stickiesArray数组(教程中,这个数组用来保存已有的key)
function getStickiesArray(){
    var stickiesArray = localStorage.getItem("stickiesArray");
    if(!stickiesArray){
        stickiesArray = [];
        localStorage.setItem("stickiesArray",JSON.stringify(stickiesArray));
    }else{
        stickiesArray = JSON.parse(stickiesArray);
    }
    return stickiesArray;
}
//删除sticky的函数
function deleteSticky(e){
    
    var key = e.target.id;//这个事件,取所点击的对象的id属性
    
    localStorage.removeItem(key);
    var stickiesArray = getStickiesArray();
    if(stickiesArray){
        for (var i = 0; i < stickiesArray.length; i++){
            if(key == stickiesArray[i]){
                stickiesArray.splice(i,1);
            }
        }
    }
    localStorage.setItem("stickiesArray",JSON.stringify(stickiesArray));
    
    removeStickyFromDOM(key);
}
//删除完localStorage的内容后,需要删除DOM里面的对应内容
function removeStickyFromDOM(key){
    var li = document.getElementById(key);
    li.parentNode.removeChild(li);
}