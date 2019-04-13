// ==UserScript==
// @name         BetterCritters
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author       slaggo
// @match        https://boxcritters.com/play/*
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

var delay = ( function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

window.addEventListener('load', function() {
    
    var chatBar = document.getElementsByClassName("input-group")[0];
    var jokeBtnHTML = `<span class="input-group-btn"><button id="jokebtn" class="btn btn-success chat-btn">Joke</button></span>`;
    chatBar.insertAdjacentHTML('beforeend', jokeBtnHTML);

    function sendJoke() {
        var joke = jokes[(Math.floor(Math.random() * jokes.length))]; // Retrieve random joke from variable
        world.sendMessage(joke.j); // Send the first part of the joke
        delay(function(){
            world.sendMessage(joke.p); // Send the punchline
        }, 5000 ); // end delay
    }

    var jokeBtn = document.querySelector ("#jokebtn");
    if (jokeBtn) {
        jokeBtn.addEventListener ("click", sendJoke, false);
    }
    
}, false);


