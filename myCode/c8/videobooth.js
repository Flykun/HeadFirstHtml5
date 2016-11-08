var videos = {video1:"video/demovideo1.mp4",video2:"video/demovideo2.mp4"};//视频路径
var effectFunction = null;//滤镜的函数变量

window.onload = function(){
    
    var video = document.getElementById("video");
    video.src = videos.video1;
    video.load();
    video.addEventListener("ended",endedHandler,false);//监听视频结束(PS-如果视频开了Loop则不会进入ended)
    video.addEventListener("play",processFrame,false);//监听播放事件处理滤镜遮盖
    
    var controlLinks = document.querySelectorAll("a.control");
    for (var i = 0; i < controlLinks.length; i++){
        controlLinks[i].onclick = handleControl;//所有controlLinks里面的a标签,在点击的时候都调用这个函数
    }
    
    var effectLinks = document.querySelectorAll("a.effect");
    for (var i = 0; i < effectLinks.length;i++){
        effectLinks[i].onclick = setEffect;
    }
    
    var videoLinks = document.querySelectorAll("a.videoSelection");
    for (var i = 0; i < videoLinks.length;i++){
        videoLinks[i].onclick = setVideo;
    }
    
    pushUnpushButtons("video1",[]);
    pushUnpushButtons("normal",[]);
}
function processFrame(){
    var video = document.getElementById("video");
    if (video.paused || video.ended){//如果暂停或者播放完毕了,则不做处理直接返回
        return;
    }
    var bufferCanvas = document.getElementById("buffer");
    var displayCanvas = document.getElementById("display");
    var buffer = bufferCanvas.getContext("2d");
    var display = displayCanvas.getContext("2d");
    
    buffer.drawImage(video,0,0,bufferCanvas.width,bufferCanvas.height);//将视频制定为源,drawImage会得到一个视频帧作为图像数据
    var frame = buffer.getImageData(0,0,bufferCanvas.width, bufferCanvas.height);//从画布上下文中取得图片数据,将它存储在一个变量frame中,以便处理.(x,y,width,height)
    
    var length = frame.data.length / 4;//先得出帧数据的长度,这个长度实际上是画布大小的4倍,因为有RGBA四个通道
    for (var i = 0; i < length; i++){
        var r = frame.data[i * 4 + 0];//r 红色通道位置
        var g = frame.data[i * 4 + 1];//g 绿色通道位置
        var b = frame.data[i * 4 + 2];//b 蓝色通道位置
        
        if (effectFunction){
            effectFunction(i,r,g,b,frame.data);//将每个像素都经过这个函数处理
        }
    }
    display.putImageData(frame,0,0);//让负责显示的canvas的上下文显示这一帧(修改好的图片数据,x,y)
    setTimeout(processFrame,0);//告诉js尽快再次运行processFrame,又会马上再次执行这个函数
}
///滤镜
//棕色
function western(pos, r, g, b, data) {
	var brightness = (3*r + 4*g + b) >>> 3;
	data[pos * 4 + 0] = brightness+40;
	data[pos * 4 + 1] = brightness+20;
	data[pos * 4 + 2] = brightness-20;
	data[pos * 4 + 3] = 255; //220;
}
//黑白
function noir(pos, r, g, b, data) {//pos像素位置,r,g,b,data画布中帧数据数组的一个引用
	var brightness = (3*r + 4*g + b) >>> 3;//>>>位操作符,这里用来修改亮度
	if (brightness < 0) brightness = 0;
	data[pos * 4 + 0] = brightness;
	data[pos * 4 + 1] = brightness;
	data[pos * 4 + 2] = brightness;
}
//反色
function scifi(pos, r, g, b, data) {
	var offset = pos * 4;
	data[offset] = Math.round(255 - r) ;
	data[offset+1] = Math.round(255 - g) ;
	data[offset+2] = Math.round(255 - b) ;
}

//结束时,播放按钮弹起
function endedHandler(){
    pushUnpushButtons("",["play"]);
}
///以下三个函数,负责处理各个a的按钮事件(切换按钮状态和调用各种交互)
function handleControl(e){
    var id = e.target.getAttribute("id");//取得调用者的属性
    var video = document.getElementById("video");
    
    if(id == "play"){
        pushUnpushButtons("play",["pause"]);
        if (video.ended){
            video.load();//假如已经结束,则重新读取.
        }
        video.play();//播放
    }else if(id == "pause"){
        pushUnpushButtons("pause",["play"]);
        video.pause();//暂停
    }else if(id == "loop"){
        if(isButtonPushed("loop")){
            pushUnpushButtons("",["loop"]);
        }else{
            pushUnpushButtons("loop",[]);
        }
        video.loop = !video.loop;//视频循环
    }else if(id == "mute"){
        if(isButtonPushed("mute")){
            pushUnpushButtons("",["mute"]);
        }else{
            pushUnpushButtons("mute",[]);
        }
        video.muted = !video.muted;//视频静音
    }
}
function setEffect(e){
    var id = e.target.getAttribute("id");
    
    if(id == "normal"){
        pushUnpushButtons("normal",["western","noir","scifi"]);
        effectFunction = null;
    }else if(id == "western"){
        pushUnpushButtons("western",["normal","noir","scifi"]);
        effectFunction = western;
    }else if(id == "noir"){
        pushUnpushButtons("noir",["normal","western","scifi"]);
        effectFunction = noir;
    }else if(id == "scifi"){
        pushUnpushButtons("scifi",["normal","western","noir"]);
        effectFunction = scifi;
    }
}
function setVideo(e){
    var id = e.target.getAttribute("id");
    var video = document.getElementById("video");
    if (id == "video1"){
        pushUnpushButtons("video1",["video2"]);
    }else if (id == "video2"){
        pushUnpushButtons("video2",["video1"]);
    }
    video.src = videos[id];
    video.load();
    video.play();
    
    pushUnpushButtons("play",["pause"]);//确保切换视频后,播放键是按下的,因为切换后视频马上播放
}
//处理按钮状态
function pushUnpushButtons(idToPush,idArrayTopush){
    if(idToPush != ""){
        var anchor = document.getElementById(idToPush);
        var theClass = anchor.getAttribute("class");
        if (!theClass.indexOf("selected") >= 0){
            theClass = theClass + " selected";//动态生成一个类名
            anchor.setAttribute("class",theClass);//添加一个类
            var newImage = "url(images/" + idToPush + "pressed.png)";//按下后的按钮的新类(背景图的命名规则为id+pressed.png)
            anchor.style.backgroundImage = newImage;
        }
    }
    
    for(var i =0; i < idArrayTopush.length; i++){
        anchor = document.getElementById(idArrayTopush[i]);
        theClass = anchor.getAttribute("class");
        if(theClass.indexOf("selected") >= 0){//确保是不是已经按下去了
            theClass = theClass.replace("selected","");//将按下去的类名删除
            anchor.setAttribute("class",theClass);//替代
            anchor.style.backgroundImage = "";//将已按下的图片删除
        }
    }
}
function isButtonPushed(id){
    var anchor = document.getElementById(id);
    var theClass = anchor.getAttribute("class");
    return (theClass.indexOf("selected") > 0);//如果已经按下,则返回true
}