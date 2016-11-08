/* quote.js */

var quotes = ["I hope life isn’t a joke, because I don’t get it.",
              "There is a light at the end of every tunnel...just pray it’s not a train!",
              "Do you believe in love at first sight or should I walk by again?"];

function postAQuote() {
	var index = Math.floor(Math.random() * quotes.length);
	postMessage(quotes[index]);
}
postAQuote();//也可以让web工作线程直接传值给主线程. (主线程无需传值给web工作线程)
setInterval(postAQuote, 3000);

//两边都可以互传,主线程负责启用.工作线程负责完成自己负责的功能