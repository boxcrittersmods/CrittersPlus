// ==UserScript==
// @name         Critters+
// @namespace    http://discord.gg/G3PTYPy
// @version      1.1.8.1
// @updateURL    https://github.com/slaggo/CrittersPlus/raw/master/crittersplus.user.js
// @downloadURL  https://github.com/slaggo/CrittersPlus/raw/master/crittersplus.user.js
// @description  Adds new features to BoxCritters to improve your experience!
// @author       slaggo, codejk
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

// Runs on page load

window.addEventListener('load', function() {

    // Sets the theme to dark if browser supports webstorage

    var chatBar = document.getElementsByClassName("input-group")[0];
    var chatBox = document.getElementsByClassName("row justify-content-center")[1];
    var jokeBtnHTML = `<span class="input-group-btn"><button id="jokebtn" class="btn btn-success">Joke</button></span>`;
    var clapBtnHTML = `<span class="input-group-btn"><button id="clapbtn" class="btn btn-warning">Clap</button></span>`;
    var balloonoffBtnHTML = `<span class="input-group-btn"><button id="balloonoffbtn" class="btn btn-info">Chat Balloons On/Off</button></span>`;
    var nametagsonoffBtnHTML = `<span class="input-group-btn"><button id="nametagsonoffbtn" class="btn btn-info">Name Tags On/Off</button></span>`;
    var darkmodeHTML = `<div id="dmDiv" class="row justify-content-center"><span><input class="form-check-input" type="checkbox" value="" id="darkmode"><label class="form-check-label" for="darkmode" style="color:#696f75;">Dark Mode</label></span></div>`;
    var redeemallitemsBtnHTML = `<span class="input-group-btn"><button id="redeemallitemsbtn" class="btn btn-danger">Collect unredeemed items</button></span>`;
    chatBar.insertAdjacentHTML('beforeend', jokeBtnHTML);
    chatBar.insertAdjacentHTML('beforeend', clapBtnHTML);
    chatBar.insertAdjacentHTML('afterend', balloonoffBtnHTML);
    chatBar.insertAdjacentHTML('afterend', nametagsonoffBtnHTML);
    chatBar.insertAdjacentHTML('afterend', redeemallitemsBtnHTML);
    chatBox.insertAdjacentHTML('afterend', darkmodeHTML);

    if (localStorage.getItem("theme") == "dark") {
        document.body.style = "background-color:rgb(16, 21, 31);transition:0.5s;";
        document.getElementById("darkmode").checked = true;
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

    function balloonoff() {
        document.getElementById("inputMessage").value="";
        world.sendMessage("/balloons"); // Turn chat balloons off
    }

    function nametagsonoff() {
        document.getElementById("inputMessage").value="";
        world.sendMessage("/nicknames"); // Turn name tags on/off
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

    function redeemallitems() {
        document.getElementById("inputMessage").value="";
        world.sendMessage("/rocketsnail"); // Redeems Viking Hat
        world.sendMessage("/FreeItem"); // Redeems Free Item Of The Week
        world.sendMessage("/boxcritters3d"); // Redeems 3D Glasses
        world.sendMessage("/goodnight"); // Redeems Sleepy Hat
        world.sendMessage("/discordcritters2k19"); // Redeems Discord Headphones
        world.sendMessage("/cute"); // Redeems Pink Toque
        world.sendMessage("/madeincanada"); // Redeems White Toque
        world.sendMessage("/oommgames"); // Redeems Red Space Suit
        world.sendMessage("/boxcritterswiki"); // Redeems Newspaper hat
        world.sendMessage("/andybulletin"); // Redeems Propeller Hat
        world.sendMessage("/thekeeper"); // Redeems Party Hat
    }

    var jokeBtn = document.querySelector ("#jokebtn");
    if (jokeBtn) {
        jokeBtn.addEventListener ("click", sendJoke, false);
    }
    var clapBtn = document.querySelector ("#clapbtn");
    if (clapBtn) {
        clapBtn.addEventListener ("click", sendClap, false);
    }

    var balloonoffBtn = document.querySelector ("#balloonoffbtn");
    if (balloonoffBtn) {
        balloonoffBtn.addEventListener ("click", balloonoff, false);
    }

    var nametagsonoffBtn = document.querySelector ("#nametagsonoffbtn");
    if (nametagsonoffBtn) {
        nametagsonoffBtn.addEventListener ("click", nametagsonoff, false);
    }

    var darkmodeBox = document.querySelector ("#darkmode");
    if (darkmodeBox) {
        darkmodeBox.addEventListener ("click", darkmodeToggle, false);
    }

    var redeemallitemsBtn = document.querySelector ("#redeemallitemsbtn");
    if (redeemallitemsBtn) {
        redeemallitemsBtn.addEventListener ("click", redeemallitems, false);
    }

}, false);
