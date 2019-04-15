// ==UserScript==
// @name         Critters+
// @namespace    http://tampermonkey.net/
// @version      1.1.4.5
// @updateURL    https://github.com/slaggo/CrittersPlus/raw/master/crittersplus.user.js
// @downloadURL  https://github.com/slaggo/CrittersPlus/raw/master/crittersplus.user.js
// @description  Adds new features to BoxCritters to improve your experience!
// @author       slaggo, codejk
// @match        https://boxcritters.com/play/*
// @match        http://boxcritters.com/play/*
// @icon         https://raw.githubusercontent.com/slaggo/CrittersPlus/master/icon.png
// @grant        none
// ==/UserScript==

var jokes = [
    {"j":"What do you call a hamster in a tophat?","p":"Abrahamster Lincoln!"},
    {"j":"Where does a hamster go for vacation?","p":"Hamsterdam!"},
    {"j":"What do you call a hamster with no legs?","p":"A furball!"},
    {"j":"What do you call a hamster that can't run in a wheel?","p":"Hamateur"},
    {"j":"Why was the hamster upset with his job?","p":"It didn't pay enough celery"},
    {"j":"What do you call a hamster with three legs?","p":"Hamputee"}
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

    var chatBar = document.getElementsByClassName("input-group")[0];
    var jokeBtnHTML = `<span class="input-group-btn"><button id="jokebtn" class="btn btn-success">Joke</button></span>`;
    var clapBtnHTML = `<span class="input-group-btn"><button id="clapbtn" class="btn btn-warning">Clap</button></span>`;
    var balloonoffBtnHTML = `<span class="input-group-btn"><button id="balloonoffbtn" class="btn btn-info">Chat Balloons On/Off</button></span>`;
    var nametagsonoffBtnHTML = `<span class="input-group-btn"><button id="nametagsonoffbtn" class="btn btn-info">Name Tags On/Off</button></span>`;
    var darkmodeHTML = `<span><input class="form-check-input" type="checkbox" value="" id="darkmode"><label class="form-check-label" for="darkmode">Dark Mode</label></span>`;
    chatBar.insertAdjacentHTML('beforeend', jokeBtnHTML);
    chatBar.insertAdjacentHTML('beforeend', clapBtnHTML);
    chatBar.insertAdjacentHTML('afterend', balloonoffBtnHTML);
    chatBar.insertAdjacentHTML('afterend', nametagsonoffBtnHTML);
    chatBar.insertAdjacentHTML('afterend', darkmodeHTML);

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
        message = message.split(" ").join("👏 ");
        message = "👏 " + message + "👏"
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
            document.body.style = "background-color:rgb(16, 21, 31);transition:0.5s;";
        } else {
            document.body.style = "background-color:#f7f7f7;transition:0.5s;";
        }
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
}, false);
