// ==UserScript==
// @name         Critters+
// @namespace    http://discord.gg/G3PTYPy
// @version      2.3.20.51
// @description  Adds new features to BoxCritters to improve your experience!
// @author       slaggo, TumbleGamer
// @match        https://boxcritters.com/play/
// @match        https://boxcritters.com/play/?*
// @match        https://boxcritters.com/play/#*
// @match        https://boxcritters.com/play/index.html
// @match        https://boxcritters.com/play/index.html?*
// @match        https://boxcritters.com/play/index.html#*
// @require      https://code.jquery.com/jquery-3.5.1.slim.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/popper.js/2.4.0/umd/popper.min.js
// @require      https://maxcdn.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js
// @icon         https://raw.githubusercontent.com/boxcritters/CrittersPlus/master/icon.png
// @updateURL    https://github.com/boxcritters/CrittersPlus/raw/master/crittersplus.user.js
// @run-at       document-end
// @grant        unsafeWindow
// ==/UserScript==

console.info(`-----------------------------------
[CRITTERS+]
A mod created by Slaggo, current development under TumbleGamer
-----------------------------------`);

window = unsafeWindow || window;
var CrittersPlus = {};
var BCMacro = window.BCMacro;
window.CrittersPlus = CrittersPlus;
var chatBox = document.getElementsByClassName(
	"row justify-content-center"
)[1];

var jokes = [
	{ j: "What do you call a hamster in a tophat?", p: "Abrahamster Lincoln!", },
	{ j: "Where does a hamster go for vacation?", p: "Hamsterdam!" },
	{ j: "What do you call a hamster with no legs?", p: "A furball!" },
	{ j: "What do you call a hamster that can't run in a wheel?", p: "Hamateur.", },
	{ j: "Why was the hamster upset with his job?", p: "It didn't pay enough celery.", },
	{ j: "What do you call a hamster with three legs?", p: "Hamputee." },
	{ j: "What happens when two snails get into a fight?", p: "They slug it out!", },
	{ j: "Why is the snail the strongest animal?", p: "Because he carries a house on his back!", },
	{ j: "How do snails make important calls?", p: "On shell phones." },
	{ j: "What kind of car does a raccoon drive?", p: "A furrari." },
];


// Code for delay function
var delay;
{
	let timer = 0;
	delay = function (callback, ms) {
		clearTimeout(timer);
		timer = setTimeout(callback, ms);
	};
}

function camelize(str) {
	return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
		if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
		return index === 0 ? match.toLowerCase() : match.toUpperCase();
	});
}


if (!BCMacro) {
	document.body.insertAdjacentHTML("afterbegin", `<div id="CP_modal" class="modal fade" tabindex="-1" role="dialog">
		<div class="modal-dialog" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="CP_model" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>
				<div class="modal-body"></div>
				<div class="modal-footer"></div>
			</div>
		</div>
	</div>`);

	function createDialogue(header, body, footer) {
		$("#CP_modal").modal();
		$("#CP_modal").modal("show");
		if (header) $("#CP_modal .modal-header").html(header);
		if (body) $("#CP_modal .modal-body").html(body);
		if (footer) $("#CP_modal .modal-footer").html(footer);
	}
	createDialogue("Macro Info",
		`The Macros API has grown apart from Critters+ to become its own API only mod.
Please click the link below to install. <strong>Make sure to uninstall Critters+ and reinstall after you have installed the macro API as this will cause problems when installed out of order.</strong>`,
		'<a class="btn btn-primary" href="https://boxcrittersmods.ga/mods/bcmacro-api/">Install Macro API</a>');
}

// Runs on page load

window.addEventListener("load", async function () {
	function sendJoke() {
		document.getElementById("inputMessage").value = "";
		var joke = jokes[Math.floor(Math.random() * jokes.length)]; // Retrieve random joke from variable
		BCMacro.sendMessage(joke.j); // Send the first part of the joke
		delay(function () {
			BCMacro.sendMessage(joke.p); // Send the punchline
		}, 5000); // end delay
	}

	function sendClap() {
		var message = document.getElementById("inputMessage").value;
		document.getElementById("inputMessage").value = "";
		message = `👏 ${message.replace(" ", " 👏 ")} 👏`;
		console.log("[CP]", message);
		world.sendMessage(message);
	}

	CrittersPlus.sendJoke = sendJoke;
	CrittersPlus.sendClap = sendClap;
	{
		console.log("[CP] Setting up macros...");
		var jokeMacro = new BCMacro("Joke", CrittersPlus.sendJoke, true);
		jokeMacro.toggleButton("success", "beforeend");
		jokeMacro.setupMod();

		var clapMacro = new BCMacro("Clap", CrittersPlus.sendClap, true);
		clapMacro.toggleButton("warning", "beforeend");
		clapMacro.setupMod();

		new BCMacro("Chat Balloons", _ => {
			world.stage.room.balloons.visible ^= true;
		}, true).setupMod();

		new BCMacro("NameTags", _ => {
			world.stage.room.nicknames.visible ^= true;
		}, true).setupMod();

		new BCMacro("freeitem", _ => {
			BCMacro.sendMessage("/freeitem");
		}, true).setupMod();

		new BCMacro("pop", _ => {
			BCMacro.sendMessage("/pop");
		}, true).setupMod();

		new BCMacro("beep", _ => {
			BCMacro.sendMessage("/beep");
		}, true).setupMod();

		new BCMacro("darkmode", _ => {
			BCMacro.sendMessage("/darkmode");
		}, true).setupMod();

		new BCMacro("game", _ => {
			BCMacro.sendMessage("/game");
		}, true).setupMod();
	}

	//-------------------------------------------------------------------------------------------------------------------------

	chatBox.insertAdjacentHTML("afterend",
		`<div id="dmDiv" class="row justify-content-center"><span>
			<input class="form-check-input" type="checkbox" value="" id="darkmode">
			<label class="form-check-label" for="darkmode" style="color:#696f75;">Dark Mode</label>
		</span></div>`); // darkmode html

	if (localStorage.getItem("theme") == "dark") {
		document.body.style = "background-color:rgb(16, 21, 31);transition:0.5s;";
		document.getElementById("darkmode").checked = true;
	}

	function darkmodeToggle() {
		if (darkmodeBox.checked == true) {
			localStorage.setItem("theme", "dark");
			document.body.style = "background-color:rgb(16, 21, 31);transition:0.5s;";
		} else {
			localStorage.setItem("theme", "light");
			document.body.style = "background-color:#f7f7f7;transition:0.5s;";
		}
	}

	let raib = document.getElementById("redeemallitemsbtn");
	if (raib)
		raib.addEventListener("click", raib, false);
},
	false
);
