 /*
 window.onload = function () {
     var canvas = document.getElementById("lookwhatIdrew");
     if (canvas.getContext) {
         //canvas的api可用
         var context = canvas.getContext("2d"); //上下文的类型是有区别的,2d只能画二维的图像
         context.fillRect(10, 10, 100, 100); //fillRect(x,y,width,height);
         //canvas的填充颜色默认黑色
     }
     else {
         alert("canvas不可用,请升级或更换浏览器");
     }
 };
 */
 window.onload = function () {
     var button = document.getElementById("previewButton");
     button.onclick = previewHandler;
 }; //!!分号不能丢
 function previewHandler() {
     var canvas = document.getElementById("tshirtCanvas");
     var context = canvas.getContext("2d");
     fillBackgroundColor(canvas, context); //每次预览前都用背景色填充canvas画布
     
     var selectObj = document.getElementById("shape");
     var index = selectObj.selectedIndex;
     var shape = selectObj[index].value;
     
     context.shadowBlur = 1;
     context.shadowColor = "gray";
     context.shadowOffsetX = 0;
     context.shadowOffsetY = 1;
     
     if (shape == "squares") {
         for (var squares = 0; squares < 20; squares++) {
             drawSquare(canvas, context);
         }
     }
     else if (shape == "circles") {
         for (var circles = 0; circles < 20; circles++){
             drawCircle(canvas,context);
         }
         
         /*画形状
         context.beginPath();//开始画
         context.moveTo(100,150);//开始点
         context.lineTo(250,75);//角1
         context.lineTo(125,30);//角2
         context.closePath();//结束画线.闭合
         context.lineWidth = 5;//选择路径线粗
         context.stroke();//画出路径
         context.fillStyle = "red";//选填充颜色
         context.fill();//填充,
         */
     }
     drawText(canvas,context);
     drawBird(canvas,context);
 }
 //角度转PI
 function degreesToRadians(degress) {
     return (degress * Math.PI) / 180; //360°==2PI => 180/PI = 1°
 }
 //画圆
 function drawCircle(canvas, context) {
     
     var w = Math.floor(Math.random() * 30 + 10); //有些方块太小,会给覆盖.从而设置了最小尺寸
     var x = Math.floor(Math.random() * canvas.width);
     var y = Math.floor(Math.random() * canvas.height);     
     
     context.beginPath();
     context.arc(x, y, w, 0, degreesToRadians(360), true);
     context.fillStyle = "lightblue";
     context.fill();
 }
 //画方形
 function drawSquare(canvas, context) {
     var w = Math.floor(Math.random() * 30 + 10); //有些方块太小,会给覆盖.从而设置了最小尺寸
     var x = Math.floor(Math.random() * canvas.width);
     var y = Math.floor(Math.random() * canvas.height);
     
     context.fillStyle = "lightblue"; //颜色
     context.fillRect(x, y, w, w);
//     context.strokeRect(x, y, w, w);//填充边缘
 }
 //填充背景色
 function fillBackgroundColor(canvas, context) {
     var selectObj = document.getElementById("backgroundColor");
     var index = selectObj.selectedIndex;
     var bgColor = selectObj.options[index].value;
     context.fillStyle = bgColor;
     context.fillRect(0, 0, canvas.width, canvas.height);
 }

//由于API过期,所以这个更新Twitter的函数,无效
function updateTweets(tweets){
    var tweetsSelection = document.getElementById("tweets");
    for (var i = 0; i < tweets.length; i++){
        tweet = tweets[i];
        var option = document.createElement("option");
        option.textContent = tweet.text;
        option.value = tweet.text.replace("\"","'");
        
        tweetsSelection.option.add(option);
    }
    tweetsSelection.selectedIndex = 0;
}

//画字
function drawText(canvas,context){
    var selectObj = document.getElementById("foregroundColor");
    var index = selectObj.selectedIndex;
    var fgColor = selectObj[index].value;
    //上行字
    context.fillStyle = fgColor;
    context.font = "bold 1em sans-serif";
    context.textAlign = "left";
    context.fillText("I saw this tweet",20,40);
    
    //中间为tweet选项中的文字
    selectObj = document.getElementById("tweets");
    var index = selectObj.selectedIndex;
    var tweet = selectObj[index].value;//option都作为它的子元素
    context.textAlign = "center";
    context.font = "italic 1.2em serif";
    context.fillText(tweet,canvas.width / 2,canvas.height / 2);
    
    //下行字
    context.font = "bold 1em sans-serif";
    context.textAlign = "right";
    context.fillText("and all I got was this lousy t-shirt",canvas.width-20,canvas.height-40);
    
}
function drawBird(canvas,context){
    var twitterbird = new Image();//新建图片对象
    twitterbird.src = "twitterBird.png";//设置图片来源路径
    twitterbird.onload = function(){//确保小鸟加载完毕
        context.drawImage(twitterbird,20,canvas.height - 80,70,70);//(图片,x,y,width,height);
    }
}