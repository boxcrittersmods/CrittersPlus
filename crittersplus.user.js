// ==UserScript==
// @name         Critters+
// @namespace    http://discord.gg/G3PTYPy
// @version      2.1.1
// @description  Adds new features to BoxCritters to improve your experience!
// @author       slaggo,TumbleGamer
// @match        https://boxcritters.com/play/*
// @match        http://boxcritters.com/play/*
// @icon         https://raw.githubusercontent.com/boxcritters/CrittersPlus/master/icon.png
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// ==/UserScript==

console.info("-----------------------------------");
console.info("[CRITTERS+]");
console.info("A mod created by Slaggo, current development under TumbleGamer");
console.info("-----------------------------------");

window = unsafeWindow || window;
var CrittersPlus = {};
window.CrittersPlus = CrittersPlus;

CrittersPlus.data = GM_getValue("CrittersPlus_data", undefined);
console.log("[CP] Data Loaded.");
if (!CrittersPlus.data) {
	console.log("[CP] Initiating First time setup...");
	console.log("[CP] Setting up jokes");
	CrittersPlus.data = {
		jokes: [
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
		],
		macros: undefined,
	};
}
var macros = CrittersPlus.data.macros;
var jokes = CrittersPlus.data.jokes;

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

function save() {
	GM_setValue("CrittersPlus_data", {
		jokes:CrittersPlus.data.jokes,
		macros:CrittersPlus.data.macros.map(m=>m.dataify())
	});
	console.log("[CP] Data Saved.");
}

// Runs on page load

window.addEventListener(
	"load",
	async function () {
		var chatBar = document.getElementsByClassName("input-group")[0];
		var chatBox = document.getElementsByClassName(
			"row justify-content-center"
		)[1];
		var binding = undefined;

		function createDialogue(header, body, footer) {
			$("#CP_modal").modal();
			$("#CP_modal").modal("show");
			if (header) $("#CP_modal .modal-header").html(header);
			if (body) $("#CP_modal .modal-body").html(body);
			if (footer) $("#CP_modal .modal-footer").html(footer);
			return $("#CP_model");
		}

		function createButton(name, cb, color = "info", place = "afterend", text) {
			var button = {
				cb,
				color,
				place,
				text,
				html: undefined,
			};
			var btnHTML = `<span class="input-group-btn"><button id="cp${camelize(
				name
			)}" class="btn btn-${color}">${text || name}</button></span>`;
			chatBar.insertAdjacentHTML(place, btnHTML);
			$(`#cp${camelize(name)}`).click(cb);
			button.html = $(`#cp${camelize(name)}`);
			return button;
		}

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

		function Macro(name, cb) {
			if (typeof cb != "function") return;
			this.name = name;
			this.cb = cb;
			this.button = undefined;
			this.key = undefined;
			macros.push(this);
		}
		Macro.prototype.toggleButton = function (color, place, text) {
			if (this.button) {
				this.button.html.toggle();
			} else {
				this.button = createButton(
					this.name,
					this.cb,
					color,
					place,
					text
				);
			}
		};
		Macro.prototype.bindKey = function (e) {
			this.key = e.which;
		};
		Macro.prototype.dataify = function () {
			var macro = Object.assign({},this);
			macro.cb = macro.cb.toString();
			if(macro.button && macro.button.html && !macro.button.html.is(":visible")) {
				macro.button = undefined;
			}
			return macro;
		}

		function RefreshSettings() {
			$("#cp_settingList").empty();
			macros.forEach((a) => {
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
			<input type="text" class="form-control" value="Coming Soon" disabled>
			<div class="input-group-append">
				<input type="text" class="form-control" value="Coming Soon" disabled>
			  <button class="btn btn-outline-secondary" type="button" id="cpSettingJS-button" disabled>JS</button>
			  <button class="btn btn-outline-secondary" type="button" id="cpSettingChat-key"  disabled>Chat</button>
			</div>
		  </div>
		`;
			createDialogue("Critters+ Settings", settingHTML, `<button class="btn btn-primary" type="button" id="cpSettingSave">Save</button>`);
			$('#cpSettingSave').click(()=>{
				save();
			})
			RefreshSettings();
		}
		CrittersPlus.DisplaySettings = DisplaySettings;

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

		function balloonToggle() {
			document.getElementById("inputMessage").value = "";
			//world.sendMessage("/balloons"); // Turn chat balloons off
			world.stage.room.balloons.visible = !world.stage.room.balloons.visible;
		}

		function nametagsToggle() {
			document.getElementById("inputMessage").value = "";
			world.stage.room.nicknames.visible = !world.stage.room.nicknames.visible;
		}

		$(document).keydown(function (e) {
			if (binding) {
				binding.bindKey(e);
				binding = undefined;
				save();
				RefreshSettings();
				return;
			}
			macros.forEach((a) => {
				if (a.key == e.which) {
					console.log("[CP] Triggering", a.name, "by key...");
					a.cb();
				}
			});
		});

		CrittersPlus.sendJoke = sendJoke;
		CrittersPlus.sendClap = sendClap;
		CrittersPlus.Macro = Macro;

		if (CrittersPlus.data.macros) {
			CrittersPlus.data.macros = CrittersPlus.data.macros.map(m=>{
				var macro = new Macro(m.name,eval("("+m.cb+")"));
				macro.key = m.key;
				if(m.button) macro.toggleButton(m.button.color,m.button.place,m.button.text);
				return macro;
			})
			macros = CrittersPlus.data.macros;
		} else {
			console.log("[CP] Setting up basic macros...");
			CrittersPlus.data.macros = [];
			macros = CrittersPlus.data.macros;
			var settingsMacro = new Macro("settings", DisplaySettings);
			settingsMacro.toggleButton(
				"primary",
				"beforeend",
				'<i class="fas fa-cog"></i>'
			);
			var jokeMacro = new Macro("Joke", sendJoke);
			jokeMacro.toggleButton("success", "beforeend");
			var clapMacro = new Macro("Clap", sendClap);
			clapMacro.toggleButton("warning", "beforeend");
			new Macro("Chat Balloons", balloonToggle);
			new Macro("NameTags", nametagsToggle);
			new Macro("freeitem", () => {
				world.sendMessage("/freeitem");
			});
			new Macro("pop", () => {
				world.sendMessage("/pop");
			});
			new Macro("beep", () => {
				world.sendMessage("/beep");
			});
			new Macro("darkmode", () => {
				world.sendMessage("/darkmode");
			});
			new Macro("game", () => {
				world.sendMessage("/game");
			});
			save();
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
