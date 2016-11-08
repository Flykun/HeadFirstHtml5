//将新的歌保存到本地
function save(item){
    var playlistArray = getStoreArray("playlist");
    playlistArray.push(item);//添加到最后
    localStorage.setItem("playlist",JSON.stringify(playlistArray));//本地存储添加已转换为JSON格式的歌,已playlist的键保存
}
//将本地保存的playlist添加进ul中
function loadPlaylist(){
    var playlistArray = getSavedSongs();
    var ul = document.getElementById("playlist");
    
    if (playlistArray != null){
        for(var i = 0; i < playlistArray.length;i++){
            var li = document.createElement("li");//创造一个孩子元素
            li.innerHTML = playlistArray[i];
            ul.appendChild(li);//孩子出生在这个元素下
        }
    }
}
//取保存的歌单
function getSavedSongs(){
    return getStoreArray("playlist");
}
//根据键取保存在本地的歌单
function getStoreArray(key){
    var playlistArray = localStorage.getItem(key);
    if(playlistArray == null || playlistArray == ""){
        playlistArray = new Array();//如果没有,则返回空数组
    }else{
        playlistArray = JSON.parse(playlistArray);//使用JSON.parse解析成js的格式
    }
    return playlistArray;
}
//清除歌单
function removeStoreSongs(){
    localStorage.setItem("playlist",JSON.stringify([]));
}