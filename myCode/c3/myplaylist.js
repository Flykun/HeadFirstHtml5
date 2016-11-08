function init() {
    //按钮设置
    var addButton = document.getElementById("addButton");
    addButton.onclick = handleAddButtonClick;
    var clearButton = document.getElementById("clearButton");
    clearButton.onclick = handleClearButtonClick;
    //播放列表ul
    loadPlaylist();
}
//按钮的调用函数
function handleAddButtonClick() {
    var textInput = document.getElementById("songTextInput");
    var songName = textInput.value;
    if (songName.length > 0) {
        var li = document.createElement("li");
        li.innerHTML = songName;
        var ul = document.getElementById("playlist");
        ul.appendChild(li);
        //保存起来为了下次可以读取到
        save(songName);
        textInput.value = "";
    }
    else {
        alert("Please enter a song");
    }
}
function handleClearButtonClick() {
    removeStoreSongs();
    var ul = document.getElementById("playlist");
    ul.innerHTML = "";
}

window.onload = init;