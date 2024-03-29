// ==UserScript==
// @name         Critters+
// @namespace    https://boxcrittersmods.ga/authors/slaggo/
// @supportURL   http://discord.gg/D2ZpRUW
// @version      2.5.2.161
// @description  Adds new features to BoxCritters to improve your experience!
// @author       slaggo, Tumble
// @require      https://github.com/tumble1999/mod-utils/raw/master/mod-utils.js
// @require      https://github.com/tumble1999/modial/raw/master/modial.js
// @require      https://github.com/SArpnt/ctrl-panel/raw/master/script.user.js
// @require      https://github.com/tumble1999/critterguration/raw/master/critterguration.user.js
// @require      https://github.com/boxcrittersmods/bcmacros/raw/master/bcmacro-api.user.js
// @require      https://github.com/SArpnt/joinFunction/raw/master/script.js
// @require      https://github.com/SArpnt/EventHandler/raw/master/script.js
// @require      https://github.com/SArpnt/cardboard/raw/master/script.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @match        https://boxcritters.com/play/
// @match        https://boxcritters.com/play/?*
// @match        https://boxcritters.com/play/#*
// @match        https://boxcritters.com/play/index.html
// @match        https://boxcritters.com/play/index.html?*
// @match        https://boxcritters.com/play/index.html#*
// @icon         https://raw.githubusercontent.com/boxcritters/CrittersPlus/master/icon.png
// @run-at       document-start
// ==/UserScript==

(function () {
	'use strict';

	const uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

	const CrittersPlus = new TumbleMod({
		id: "crittersPus",
		name: "Critters+",
		abriv: "CP",
		cardboard: true
	});

	uWindow.CrittersPlus = CrittersPlus;

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
		name: "Hello",
		action: _ => {
			BCMacros.sendMessage("Hello");
		},
		key: "KeyH"
	});
	cpMacros.createMacro({
		name: "Good Bye",
		action: _ => {
			BCMacros.sendMessage("Good Bye");
		},
		key: "KeyB"
	});
	cpMacros.createMacro({
		name: "Ok",
		action: _ => {
			BCMacros.sendMessage("OK");
		},
		key: "KeyO"
	});
	cpMacros.createMacro({
		name: "Yes",
		action: _ => {
			BCMacros.sendMessage("Yes");
		},
		key: "KeyY"
	});
	cpMacros.createMacro({
		name: "No",
		action: _ => {
			BCMacros.sendMessage("No");
		},
		key: "KeyN"
	});

	let emotes = {
		laugh: { name: "Laughing face", key: "Digit1" },
		smile: { name: "Smiley", key: "Digit2" },
		happy: { name: "Straight face", key: "Digit3" },
		sad: { name: "Frown", key: "Digit4" },
		awe: { name: "Surprise", key: "Digit5" },
		cheeky: { name: "Sticking out tongue", key: "Digit6" },
		thumbs_up: { name: "Wink", key: "Digit7" },
		sick: { name: "Green sickly face", key: "Digit8" },
		angry: { name: "Red angry face", key: "Digit9" },
		upset: { name: "Sad face", key: "Digit0" },
		daze: { name: "Crooked face", key: "KeyU" },
		coffee: { name: "Coffee Cup", key: "KeyC" },
		gg: { name: "Game", key: "KeyG" },
		// laugh: {name: "Popcorn", key: "KeyO"},
		// laugh: {name: "Pizza", key: "KeyZ"},
		// laugh: {name: "Ice Cream", key: "KeyQ"},
		// laugh: {name: "Cake", key: "KeyK"},
		// laugh: {name: "Good Luck", key: "KeyL"},
		idea: { name: "Light Bulb", key: "KeyB" },
		// laugh: {name: "Heart", key: "KeyH"},
		// laugh: {name: "Flower", key: "KeyF"}
	};

	cpMacros.createMacro({
		name: "Emote Chord",
		action: null,
		key: "KeyE"
	});

	for (const emote in emotes) {
		let { name, key } = emotes[emote];

		cpMacros.createMacro({
			name,
			action: _ => {
				if (BCMacros.isChording(["emoteChord"])) {
					world.emote(emote);
				}
			},
			key
		});
	}

	cpMacros.createMacro({
		name: "Punctuation Chord",
		action: null,
		key: "ShiftLeft"
	});

	cpMacros.createMacro({
		name: "Punctuation Chord2",
		action: null,
		key: "ShiftRight"
	});

	cpMacros.createMacro({
		name: "Exclamation Point",
		action: _ => {
			if (BCMacros.isChording(["punctuationChord"]) || BCMacros.isChording(["punctuationChord2"])) {
				BCMacros.sendMessage("!");
			}
		},
		key: "Digit1"
	});
	cpMacros.createMacro({
		name: "Question Mark",
		action: _ => {
			if (BCMacros.isChording(["punctuationChord"]) || BCMacros.isChording(["punctuationChord2"])) {
				world.emote("confused");
			}
		},
		key: "Slash"
	});
	//}

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
	let cpSettings = Critterguration.registerSettingsMenu({ id: "crittersPlus", name: "Layer Visibility" }),
		sBalloon, sNames, sNavMesh, sTreasure;

	cardboard.on("worldStageCreated", world => {

		sBalloon = cpSettings.createInput({
			name: "Chat Balloons", type: "checkbox", value: true, onInput: value => {
				world.stage.room.balloons.visible = value;
			}
		});
		sNames = cpSettings.createInput({
			name: "Name Tags", type: "checkbox", value: true, onInput: value => {
				world.stage.room.nicknames.visible = value;
			}
		});

		sNavMesh = cpSettings.createInput({
			name: "Nav Mesh", type: "checkbox", onInput: value => {
				world.stage.room.navMesh.visible = value;
			}
		});

		sTreasure = cpSettings.createInput({
			name: "Treasure", type: "checkbox", onInput: value => {
				world.stage.room.treasure.visible = value;
			}
		});

		cpSettings.createInput({
			name: "Mute Game", type: "checkbox", value: createjs.Sound.muted, onInput: value => {
				createjs.Sound.muted = value;
			}
		});
	});

	cardboard.on("joinRoom", world => {
		world.stage.room.balloons.visible = sBalloon.checked;
		world.stage.room.nicknames.visible = sNames.checked;
		world.stage.room.navMesh.visible = sNavMesh.checked;
		world.stage.room.treasure.visible = sTreasure.checked;
	});



})();