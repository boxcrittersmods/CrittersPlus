// ==UserScript==
// @name         Critters+
// @namespace    http://discord.gg/G3PTYPy
// @version      2.3.1.28
// @description  Adds new features to BoxCritters to improve your experience!
// @author       slaggo,TumbleGamer
// @match        https://boxcritters.com/play/*
// @match        http://boxcritters.com/play/*
// @icon         https://raw.githubusercontent.com/boxcritters/CrittersPlus/master/icon.png
// @run-at       document-end
// @grant        unsafeWindow
// ==/UserScript==

console.info("-----------------------------------");
console.info("[CRITTERS+]");
console.info("A mod created by Slaggo, current development under TumbleGamer");
console.info("-----------------------------------");

window = unsafeWindow || window;
var CrittersPlus = {};
if(window.BCMacro) var BCMacro = window.BCMacro;
window.CrittersPlus = CrittersPlus;
var chatBox = document.getElementsByClassName(
	"row justify-content-center"
)[1];

var jokes = [
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
]

//Add FontAwsesome
{
	let head = document.head;
	let link = document.createElement("link");

	link.type = "text/css";
	link.rel = "stylesheet";
	link.href =
		"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css";

	head.appendChild(link);
}
//Add Dialogue
{
	let dialogueHTML = `<div id="CP_modal" class="modal fade" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header"><button type="button" class="close" data-dismiss="CP_model" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			  </button></div>
                <div class="modal-body"></div>
                <div class="modal-footer"></div>
            </div>
        </div>
	</div>`;
	document.body.insertAdjacentHTML("afterbegin", dialogueHTML);
}

// Code for delay function
var delay = (function () {
	var timer = 0;
	return function (callback, ms) {
		clearTimeout(timer);
		timer = setTimeout(callback, ms);
	};
})();

function camelize(str) {
	return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
		if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
		return index === 0 ? match.toLowerCase() : match.toUpperCase();
	});
}



function createDialogue(header, body, footer) {
	$("#CP_modal").modal();
	$("#CP_modal").modal("show");
	if (header) $("#CP_modal .modal-header").html(header);
	if (body) $("#CP_modal .modal-body").html(body);
	if (footer) $("#CP_modal .modal-footer").html(footer);
	return $("#CP_model");
}

var binding = undefined;
function createSetting(id, macro) {
	var settingHTML = $(`<div class="list-group-item"><div class="input-group" id="cpSetting${camelize(
		id
	)}">
	<input type="text" class="form-control" value='${macro.name}' disabled>
	<div class="input-group-append">
	  <button class="btn ${
		macro.button && macro.button.html && macro.button.html.is(":visible")
			? "btn-success"
			: "btn-outline-secondary"
		}" type="button" id="cpSetting${id}-button">Toggle Button</button>
	  <button class="btn ${
		macro.key ? "btn-success" : "btn-outline-secondary"
		}" type="button" id="cpSetting${id}-key">${
		binding == macro ? "binding..." : macro.key || "Bind Key"
		}</button>
	</div>
  </div></div>`);
	$("#cp_settingList").append(settingHTML);
	var btnButton = $(`#cpSetting${id}-button`);
	var btnKey = $(`#cpSetting${id}-key`);
	btnButton.click(() => {
		btnButton.toggleClass("btn-success");
		btnButton.toggleClass("btn-outline-secondary");
		macro.toggleButton();
	});
	btnKey.click(() => {
		if (binding == macro) {
			macro.key = undefined;
			binding = undefined;
			btnKey.removeClass("btn-danger");
			btnKey.addClass("btn-outline-secondary");
			btnKey.text("Bind key");
			return;
		}
		binding = macro;
		console.log("[CP] Binding " + macro.name + "...");
		btnKey.text("Binding...");
		btnKey.removeClass("btn-outline-secondary");
		btnKey.addClass("btn-danger");
	});
}

function RefreshSettings() {
	$("#cp_settingList").empty();
	(BCMacro.macros||[]).forEach((a) => {
		createSetting(camelize(a.name), a);
	});
}

function DisplaySettings() {
	//Open Window with dropdown and stuff
	var settingHTML = `
	<h2>Macros</h2>
	<div id="cp_settingList" class="list-group">
</div>
<h2>Create Macro</h2>
<div class="input-group" id="cpSettingCreate">
	<input type="text" id="cpSettingName" class="form-control" placeholder="Name">
	<div class="input-group-append">
		<input type="text" id="cpSettingContent" class="form-control" placeholder="Action/Text">
	  <button class="btn btn-outline-secondary" type="button" id="cpSettingJS">JS</button>
	  <button class="btn btn-outline-secondary" type="button" id="cpSettingChat">Chat</button>
	</div>
  </div>
`;
	createDialogue("Critters+ Settings", settingHTML, '<button class="btn btn-danger" type="button" id="cpSettingReset">Reset</button><button class="btn btn-primary" type="button" id="cpSettingSave">Save</button>');
	var newName = $('#cpSettingName');
	var newContent = $('#cpSettingContent');
	$('#cpSettingJS').click(() => {
		BCMacro.macros = BCMacro.macros||[];
		var cb = new Function(newContent.val());
		new BCMacro(newName.val(),cb);
		RefreshSettings();
	})
	$('#cpSettingChat').click(() => {
		BCMacro.macros = BCMacro.macros||[];
		var cb = new Function("world.sendMessage("+JSON.stringify(newContent.val())+")");
		new BCMacro(newName.val(),cb);
		RefreshSettings();
	})
	$('#cpSettingSave').click(() => {
		BCMacro.save();
	})
	$('#cpSettingReset').click(() => {
		BCMacro.reset();
	})
	RefreshSettings();
}

CrittersPlus.DisplaySettings = DisplaySettings;

if(!BCMacro) {
	createDialogue("Macro Info",`
	The Macros API has grown apart from Criters plus to become its own API only mod.
	Please click the link below to install.`,
	'<a class="btn btn-primary" href="https://boxcrittersmods.ga/mods/bcmacro-api/">Install Macro API</a>')
}

// Runs on page load

window.addEventListener("load", async function () {

	$(document).keydown(function (e) {
		if (binding) {
			binding.bindKey(e);
			binding = undefined;
			RefreshSettings();
			return;
		}
	});

	function sendJoke() {
		document.getElementById("inputMessage").value = "";
		var joke = jokes[Math.floor(Math.random() * jokes.length)]; // Retrieve random joke from variable
		world.sendMessage(joke.j); // Send the first part of the joke
		delay(function () {
			world.sendMessage(joke.p); // Send the punchline
		}, 5000); // end delay
	}

	function sendClap() {
		var message = document.getElementById("inputMessage").value;
		document.getElementById("inputMessage").value = "";
		message = message.split(" ").join(" 👏 ");
		message = "👏" + message + "👏";
		console.log("[CP]", message);
		world.sendMessage(message);
	}

	CrittersPlus.sendJoke = sendJoke;
	CrittersPlus.sendClap = sendClap;

	if (BCMacro.INITIAL_SETUP) {
		console.log("[CP] Setting up basic macros...");
		var settingsMacro = new BCMacro("settings", ()=>{
			CrittersPlus.DisplaySettings()
		});
		settingsMacro.toggleButton(
			"primary",
			"beforeend",
			'<i class="fas fa-cog"></i>'
		);
		var jokeMacro = new BCMacro("Joke", CrittersPlus.sendJoke);
		jokeMacro.toggleButton("success", "beforeend");
		var clapMacro = new BCMacro("Clap", CrittersPlus.sendClap);
		clapMacro.toggleButton("warning", "beforeend");
		new BCMacro("Chat Balloons", ()=>{
			world.stage.room.balloons.visible ^=true;
		});
		new BCMacro("NameTags", ()=>{
			world.stage.room.nicknames.visible ^= true;
		});
		new BCMacro("freeitem", () => {
			world.sendMessage("/freeitem");
		});
		new BCMacro("pop", () => {
			world.sendMessage("/pop");
		});
		new BCMacro("beep", () => {
			world.sendMessage("/beep");
		});
		new BCMacro("darkmode", () => {
			world.sendMessage("/darkmode");
		});
		new BCMacro("game", () => {
			world.sendMessage("/game");
		});
		BCMacro.save();
	}

	//-------------------------------------------------------------------------------------------------------------------------

	var darkmodeHTML = `<div id="dmDiv" class="row justify-content-center"><span><input class="form-check-input" type="checkbox" value="" id="darkmode"><label class="form-check-label" for="darkmode" style="color:#696f75;">Dark Mode</label></span></div>`;
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

	var redeemallitemsBtn = document.querySelector("#redeemallitemsbtn");
	if (redeemallitemsBtn) {
		redeemallitemsBtn.addEventListener("click", redeemallitems, false);
	}
},
	false
);
