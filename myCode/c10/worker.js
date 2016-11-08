onmessage = pingpong;//工作线程,用于执行消息的函数

//编写主线程
function pingpong(event){
    if(event.data == "ping"){//根据传递过来的消息来处理结果
        postMessage("pong");//将消息返回....调用主线程设置好的postMessage函数
    }
}