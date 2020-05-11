// ==UserScript==
// @name         Critters+
// @namespace    http://discord.gg/G3PTYPy
// @version      1.1.8.9
// @updateURL    https://github.com/slaggo/CrittersPlus/raw/master/crittersplus.user.js
// @downloadURL  https://github.com/slaggo/CrittersPlus/raw/master/crittersplus.user.js
// @description  Adds new features to BoxCritters to improve your experience!
// @author       slaggo,TumbleGamer
// @match        https://boxcritters.com/play/*
// @match        http://boxcritters.com/play/*
// @icon         https://raw.githubusercontent.com/slaggo/CrittersPlus/master/icon.png
// @run-at       document-end
// @grant        none
// ==/UserScript==

var jokes = [
    {"j":"What do you call a hamster in a tophat?","p":"Abrahamster Lincoln!"},
    {"j":"Where does a hamster go for vacation?","p":"Hamsterdam!"},
    {"j":"What do you call a hamster with no legs?","p":"A furball!"},
    {"j":"What do you call a hamster that can't run in a wheel?","p":"Hamateur."},
    {"j":"Why was the hamster upset with his job?","p":"It didn't pay enough celery."},
    {"j":"What do you call a hamster with three legs?","p":"Hamputee."},
    {"j":"What happens when two snails get into a fight?","p":"They slug it out!"},
    {"j":"Why is the snail the strongest animal?","p":"Because he carries a house on his back!"},
    {"j":"How do snails make important calls?","p":"On shell phones."},
    {"j":"What kind of car does a raccoon drive?","p":"A furrari."}
]

// Code for delay function

var delay = ( function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

function camelize(str) {
	return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
	  if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
	  return index === 0 ? match.toLowerCase() : match.toUpperCase();
	});
  }

// Runs on page load

window.addEventListener('load', function() {
    var chatBar = document.getElementsByClassName("input-group")[0];
	var chatBox = document.getElementsByClassName("row justify-content-center")[1];

	var actions = [];

	var createAction = (name,cb) => {
		var a = {
			name,
			cb,
			button:undefined,
			keyBind:undefined
		};
		actions.push(a);
		return a;
	};

	

	function createButton(name,cb,color="info",place='afterend') {
		var btnHTML = `<span class="input-group-btn"><button id="cp${camelize(name)}" class="btn btn-${color}">${name}</button></span>`;
		chatBar.insertAdjacentHTML(place, btnHTML);
		$(`#cp${camelize(name)}`).click(cb);
	}

	function sendJoke() {
        document.getElementById("inputMessage").value="";
        var joke = jokes[(Math.floor(Math.random() * jokes.length))]; // Retrieve random joke from variable
        world.sendMessage(joke.j); // Send the first part of the joke
        delay(function(){
            world.sendMessage(joke.p); // Send the punchline
        }, 5000 ); // end delay
    }

    function sendClap() {
        var message = document.getElementById("inputMessage").value;
        document.getElementById("inputMessage").value="";
        message = message.split(" ").join(" 👏 ");
        message = "👏" + message + "👏"
        console.log(message);
        world.sendMessage(message);
    }

    function balloonToggle() {
        document.getElementById("inputMessage").value="";
        //world.sendMessage("/balloons"); // Turn chat balloons off
        world.stage.room.balloons.visible = !world.stage.room.ballons.visible;
    }

    function nametagsToggle() {
        document.getElementById("inputMessage").value="";
        //world.sendMessage("/nicknames"); // Turn name tags on/off
        world.stage.room.nicknames.visible = !world.stage.room.nicknames.visible;
    }

	createButton("Joke",sendJoke,'success','beforeend');
	createButton("Clap",sendClap,'warning','beforeend');
	createButton("Chat Balloons",balloonToggle,'info');
	createButton("NameTags",nametagsToggle,'info');

    var darkmodeHTML = `<div id="dmDiv" class="row justify-content-center"><span><input class="form-check-input" type="checkbox" value="" id="darkmode"><label class="form-check-label" for="darkmode" style="color:#696f75;">Dark Mode</label></span></div>`;
    chatBox.insertAdjacentHTML('afterend', darkmodeHTML);

    if (localStorage.getItem("theme") == "dark") {
        document.body.style = "background-color:rgb(16, 21, 31);transition:0.5s;";
        document.getElementById("darkmode").checked = true;
    }

    

    function darkmodeToggle() {
        if(darkmodeBox.checked == true) {
            localStorage.setItem("theme", "dark");
            document.body.style = "background-color:rgb(16, 21, 31);transition:0.5s;";
        } else {
            localStorage.setItem("theme", "light");
            document.body.style = "background-color:#f7f7f7;transition:0.5s;";
        }
    }

    var redeemallitemsBtn = document.querySelector ("#redeemallitemsbtn");
    if (redeemallitemsBtn) {
        redeemallitemsBtn.addEventListener ("click", redeemallitems, false);
    }

}, false);
