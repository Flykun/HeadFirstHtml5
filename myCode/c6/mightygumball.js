/*
var url = "http://search.twitter.com/search.json?q=hfhtml5";//由于Ajax的跨域访问限制,看不了
var request = new XMLHttpRequest();//新建请求对象
request.open("GET",url);//打开请求设置,并设置方法,url等等
request.onload = function(){//浏览器从远程Web服务得到一个相应时,它会调用这个函数
    console.log(request.status);
    if(request.status == 200){
        alert("Data received!");
        console.log(request.responseText);//相应内容
    }
}
request.send(null);//发送请求给服务器
*/
/*
window.onload = function () {
//    var url = "http://localhost/HeadFirstHtml5/myCode/c6/sales.json"; //有跨域问题,得设置项目的根目录地址(文件->项目设置)
//    var url = "http://gumbal.wickedlysmart.com/gumball/gumball.html";//这个网关已经无效
    var request = new XMLHttpRequest();
    request.open("GET", url);
    request.onload = function () {
        console.log(request.status + " + " + request.statusText);
        if (request.status == 200) {
            updateSales(request.responseText);
        }
    }
    request.send(null);
}
*/
window.onload = function () {
    setInterval(handleRefresh, 3000);
}
var lastReportTime = 0; //最后更新时间
function handleRefresh() {
    var url = "http://gumball.wickedlysmart.com?callback=updateSales" + "&lastreporttime=" + lastReportTime + "&random=" + (new Date()).getTime(); //lastreporttime:最后的更新时间;尾部加上random参数是为了让浏览器以为这个是一个新的url,从而避开了浏览器的缓存行为
    var newJsonpTag = document.createElement("script");
    newJsonpTag.setAttribute("src", url);
    newJsonpTag.setAttribute("id", "jsonp");
    var oldJsonpTag = document.getElementById("jsonp");
    var head = document.getElementsByTagName("head")[0];
    if (oldJsonpTag == null) {
        head.appendChild(newJsonpTag);
    }
    else {
        head.replaceChild(newJsonpTag, oldJsonpTag);
    }
}

function updateSales(sales) {
    console.log(sales);
    var salesDiv = document.getElementById("sales");
    for (var i = 0; i < sales.length; i++) {
        var sale = sales[i];
        var div = document.createElement("div");
        div.setAttribute("class", "saleItem");
        div.innerHTML = sale.name + " sold " + sale.sales + " gumballs" + " at " + new Date(sale.time);
        //        salesDiv.appendChild(div);
        salesDiv.insertBefore(div, salesDiv.children[0]);
    }
    if (sales.length > 0) { //将最后取得的最新的销售时间保存,以便jsonp不会请求相同的数据
        lastReportTime = sales[sales.length - 1].time;
    }
}