window.onload = function () {
    
    var worker = new Worker("worker.js");
    //使用工作线程的postMessage方法向它发送一个消息,我们的消息是一个简单的字符串"ping"
    worker.postMessage("ping");//postMessage方法在web工作线程中api定义.....让worker调用处理方法onMessage,实际上postMessage里面应该是给onMessage方法传了值,所以OnMessage的方法中可以使用event对象
    
    worker.postMessage([1,2,3,5,11]);//还能发数组
    worker.postMessage({"message":"ping","count":5});//还可以发JSON对象
    //但是不能发送函数
    
    worker.onmessage = function(event){
//        var target = event.target;//从哪个工作线程来的
        var message = "Worker says " + event.data;//传入处理程序的时间对一个data属性,其中包含工作线程提交的消息(工作线程完成后的回调数据)
        document.getElementById("output").innerHTML = message;
    }//从工作线程得到一个消息时,把它更新在html的p元素中
}