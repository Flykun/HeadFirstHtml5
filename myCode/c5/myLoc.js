var ourCoords = {
    latitude: 47.624851
    , longitude: -122.52099
        //    latitude : 22.5394139,
        //    longitude : 114.0520749
};
var watchId = null; //需用用这个参数来控制定位
var map; //展示在google地图中的map对象
var options = {//取定位的选项
    enableHighAccuracy: false, //高精度吗?
    timeout: 100, //取位置的用时时限(infinity:无穷大)
    maximumAge: 0 //选用缓存下来的坐标,他的最大存在时间(超过则不用这个坐标)
};
var prevCoords;//记录上一次刷新的坐标

window.onload = getMyLocation;

function getMyLocation() {
    if (navigator.geolocation) {
        //传入取得位置后的回调函数
        //        navigator.geolocation.getCurrentPosition(displayLocation,displayError);//更换成下面的手动定位
        var watchButton = document.getElementById("watch");
        watchButton.onclick = watchLocation; //持续定位
        watchButton.click();//第一次进入时,就开启
        
        var clearWatchButton = document.getElementById("clearWatch");
        clearWatchButton.onclick = clearWatch; //取消持续定位
    }
    else {
        alert("Oops, no geolocation support");
    }
}
//开启持续定位
function watchLocation() {
    watchId = navigator.geolocation.watchPosition(displayLocation, displayError, options);
}
//取消持续定位
function clearWatch() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}
//成功取得位置后的回调函数
function displayLocation(position) {
    console.log(position);
    //显示距离
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var div = document.getElementById("location");
    div.innerHTML = "You are at Latitude: " + latitude + ",Longitude: " + longitude;
    div.innerHTML += " (with " + position.coords.accuracy + " meters accuracy)";
    div.innerHTML += " found in " + options.timeout + " milliseconds";
    //计算距离
    var km = computeDistance(position.coords, ourCoords);
    var distance = document.getElementById("distance");
    distance.innerHTML = "Your are " + km + "km from the WickedlySmart HQ";
    //展示地图在页面中
    if (map == null) { //如果还没有调用showMap,则调用这个函数,否则不需要每次都调用displayLocation时都调用showMap.!开始传递的coords是引用类型的对象,所以当定位改变的时候,map上也能做到持续更新.
        showMap(position.coords);
        prevCoords = position.coords;//记录上一次的位置
    }else{
        var meters = computeDistance(position.coords,prevCoords)*1000;//取两次取坐标后的距离
        if(meters > 20){//超过20米,才刷新新的大头针在地图上
            scrollMapToPosition(position.coords);
            prevCoords = position.coords;
        }
        
    }
}
//取位置失败后的回调函数
function displayError(error) {
    var errorTypes = {
        0: "Unknown error"
        , 1: "Permission denied by user"
        , 2: "Position is not available"
        , 3: "Request timed out"
    };
    var errorMessage = errorTypes[error.code];
    if (error.code == 0 || error.code == 2) {
        errorMessage = errorMessage + " " + error.message;
    }
    var div = document.getElementById("location");
    div.innerHTML = errorMessage;
    
    options.timeout += 100;
    navigator.geolocation.getCurrentPosition(displayLocation, displayError, options)
    div.innerHTML += " ...... checking again with timeout =" + options.timeout +"ms";
}
//取得两个坐标的距离,(Haversine)
function computeDistance(startCoords, destCoords) {
    var startLatRads = degreesToRadians(startCoords.latitude);
    var startLongRads = degreesToRadians(startCoords.longitude);
    var destLatRads = degreesToRadians(destCoords.latitude);
    var destLongRads = degreesToRadians(destCoords.longitude);
    var Radius = 6371; //radius of the Earth in km
    var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) + Math.cos(startLatRads) * Math.cos(destLatRads) * Math.cos(startLongRads - destLongRads)) * Radius;
    return distance;
}

function degreesToRadians(degress) {
    var radians = (degress * Math.PI) / 180;
    return radians;
}
//将地图展示在网页中
function showMap(coords) {
    var googleLatAndLong = new google.maps.LatLng(coords.latitude, coords.longitude);
    var mapOptions = {
        zoom: 15
        , center: googleLatAndLong
        , mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var mapDiv = document.getElementById("map");
    map = new google.maps.Map(mapDiv, mapOptions); //将元素和配置传给谷歌地图
    //显示你的所在位置
    var title = "Your Location";
    var content = "You are here: " + coords.latitude + ", " + coords.longitude;
    addMarker(map, googleLatAndLong, title, content);
}
//增加Marker
function addMarker(map, latlong, title, content) {
    //生成GoogleMaker接口需要的对象
    var markerOptions = {
        position: latlong
        , map: map
        , title: title
        , clickable: true
    };
    var marker = new google.maps.Marker(markerOptions); //构造大头针对象
    var infoWindowOptions = {
        content: content
        , position: latlong
    };
    var infoWindow = new google.maps.InfoWindow(infoWindowOptions); //构造对应坐标的大头针详情
    google.maps.event.addListener(marker, "click", function () { //为marker(大头针)添加点击事件,该匿名函数就是点击后执行的函数
        infoWindow.open(map); //详情窗体在map对象中打开(在map的div中显示)
    })
}
//加入移动路径大头针
function scrollMapToPosition(coords){
    var latitude = coords.latitude;
    var longitude = coords.longitude;
    var latlong = new google.maps.LatLng(latitude,longitude);
    map.panTo(latlong);//取这个LatLng对象的位置,并在地图中居中
    addMarker(map,latlong,"Your new location", "You moved to: " + latitude + ", " + longitude);//给这个大头真增加详情
}