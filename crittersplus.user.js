// ==UserScript==
// @name         Critters+
// @namespace    https://boxcrittersmods.ga/authors/slaggo/
// @supportURL   http://discord.gg/D2ZpRUW
// @version      2.3.33.155
// @description  Adds new features to BoxCritters to improve your experience!
// @author       slaggo,TumbleGamer
// @match        https://boxcritters.com/play/
// @match        https://boxcritters.com/play/?*
// @match        https://boxcritters.com/play/#*
// @match        https://boxcritters.com/play/index.html
// @match        https://boxcritters.com/play/index.html?*
// @match        https://boxcritters.com/play/index.html#*
// @require      https://github.com/tumble1999/mod-utils/raw/master/mod-utils.js
// @require      https://github.com/tumble1999/modial/raw/master/modial.js
// @icon         https://raw.githubusercontent.com/boxcritters/CrittersPlus/master/icon.png
// @updateURL    https://github.com/boxcritters/CrittersPlus/raw/master/crittersplus.user.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
	'use strict';
	const CrittersPlus = new TumbleMod({
		id: "CrittersPlus",
		name: "Critters+",
		abriv: "CP",
		author: "Slaggo and TumbleGamer"
	});
	let BCMacros = window.BCMacros;
	window.CrittersPlus = CrittersPlus;

	let jokes = [
		{
			j: "What do you call a hamster in a tophat?",
			p: "Abrahamster Lincoln!",
		},
		{ j: "Where does a hamster go for vacation?", p: "Hamsterdam!" },
		{ j: "What do you call a hamster with no legs?", p: "A furball!" },
		{
			j: "What do you call a hamster that can't run in a wheel?",
			p: "Hamateur.",
		},
		{
			j: "Why was the hamster upset with his job?",
			p: "It didn't pay enough celery.",
		},
		{ j: "What do you call a hamster with three legs?", p: "Hamputee." },
		{
			j: "What happens when two snails get into a fight?",
			p: "They slug it out!",
		},
		{
			j: "Why is the snail the strongest animal?",
			p: "Because he carries a house on his back!",
		},
		{ j: "How do snails make important calls?", p: "On shell phones." },
		{ j: "What kind of car does a raccoon drive?", p: "A furrari." },
	];


	// Code for delay function
	let delay = (function () {
		let timer = 0;
		return function (callback, ms) {
			clearTimeout(timer);
			timer = setTimeout(callback, ms);
		};
	})();

	function sendJoke() {
		document.getElementById("message").value = "";
		let joke = jokes[Math.floor(Math.random() * jokes.length)]; // Retrieve random joke from variable
		BCMacros.sendMessage(joke.j); // Send the first part of the joke
		delay(function () {
			BCMacros.sendMessage(joke.p); // Send the punchline
		}, 5000); // end delay
	}

	function sendClap() {
		let message = document.getElementById("message").value;
		document.getElementById("message").value = "";
		message = message.split(" ").join(" 👏 ");
		message = "👏" + message + "👏";
		CrittersPlus.log(message);
		BCMacro.sendMessage(message);
	}

	CrittersPlus.sendJoke = sendJoke;
	CrittersPlus.sendClap = sendClap;


	if (typeof BCMacros == "undefined") {
		let modal = new Modial();
		modal.setContent({
			header: `Macro Info` + Modial.closeButton,
			body: `The Macros API has grown apart from Criters plus to become its own API only CrittersPlus.
		Please click the link below to install. <strong>Make sure to uninstall Critters+ and reinstall after you have installed the macro API as this will cause problems when installed out of order.</strong>`,
			footer: `<a class="btn btn-primary" href="https://boxcrittersmods.ga/mods/bcmacro-api/">Install Macro API</a>`
		});
		modal.show();
	} else {
		CrittersPlus.log("Setting up macros...");
		let cpMacros = BCMacros.CreateMacroPack({
			name: "Critters Plus"
		});
		cpMacros.createMacro({
			name: "Joke",
			action: CrittersPlus.sendJoke,
			button: {
				color: "warning"
			}
		});
		cpMacros.createMacro({
			name: "Chat Balloons",
			action: _ => {
				world.stage.room.balloons.visible ^= true;
			},
			button: {}
		});
		cpMacros.createMacro({
			name: "NameTags",
			action: _ => {
				world.stage.room.nicknames.visible ^= true;
			},
			button: {}
		});

		cpMacros.createMacro({
			name: "freeitem",
			action: _ => {
				BCMacros.sendMessage("/freeitem");
			},
			button: {}
		});

		cpMacros.createMacro({
			name: "pop",
			action: _ => {
				BCMacros.sendMessage("/pop");
			},
			button: {}
		});


		cpMacros.createMacro({
			name: "darkmode",
			action: _ => {
				BCMacros.sendMessage("/darkmode");
			},
			button: {}
		});

		cpMacros.createMacro({
			name: "NavMesh",
			action: _ => {
				BCMacros.sendMessage("/navmesh");
			},
			button: {}
		});

		cpMacros.createMacro({
			name: "Treasure",
			action: _ => {
				BCMacros.sendMessage("/treasure");
			},
			button: {}
		});

		cpMacros.createMacro({
			name: "Mute Game",
			action: _ => {
				createjs.Sound.muted ^= true;
			},
			button: {}
		});
	}

	//-------------------------------------------------------------------------------------------------------------------------

	/*let darkmodeHTML = `<div id="dmDiv" class="row justify-content-center"><span><input class="form-check-input" type="checkbox" value="" id="darkmode"><label class="form-check-label" for="darkmode" style="color:#696f75;">Dark Mode</label></span></div>`;
	chatBox.insertAdjacentHTML("afterend", darkmodeHTML);
	
	if (localStorage.getItem("theme") == "dark") {
		document.body.style = "background-color:rgb(16, 21, 31);transition:0.5s;";
		document.getElementById("darkmode").checked = true;
	}
	
	function darkmodeToggle() {
		if (darkmodeBox.checked == true) {
			localStorage.setItem("theme", "dark");
			document.body.style =
				"background-color:rgb(16, 21, 31);transition:0.5s;";
		} else {
			localStorage.setItem("theme", "light");
			document.body.style = "background-color:#f7f7f7;transition:0.5s;";
		}
	}
	
	let redeemallitemsBtn = document.querySelector("#redeemallitemsbtn");
	if (redeemallitemsBtn) {
		redeemallitemsBtn.addEventListener("click", redeemallitems, false);
	}*/

})();