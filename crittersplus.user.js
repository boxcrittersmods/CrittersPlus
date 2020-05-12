// ==UserScript==
// @name         Critters+
// @namespace    http://discord.gg/G3PTYPy
// @version      2.0.10
// @description  Adds new features to BoxCritters to improve your experience!
// @author       slaggo,TumbleGamer
// @match        https://boxcritters.com/play/*
// @match        http://boxcritters.com/play/*
// @icon         https://raw.githubusercontent.com/boxcritters/CrittersPlus/master/icon.png
// @run-at       document-end
// @grant        none
// ==/UserScript==
var CrittersPlus = {};
(async ()=>{
CrittersPlus.data = await GM.getValue("CrittersPlus_data",{});

})()
window.CrittersPlus = CrittersPlus;

console.info("-----------------------------------")
console.info("[CRITTERS+]")
console.info("A mod created by Slaggo, current development under TumbleGamer")
console.info("-----------------------------------")

{
	var head = document.head;
	  var link = document.createElement("link");

	  link.type = "text/css";
	  link.rel = "stylesheet";
	  link.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css";

	  head.appendChild(link);
}


var jokes = CrittersPlus.data.jokes || [
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
CrittersPlus.data.jokes = jokes;

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

window.addEventListener('load', async function() {
    var chatBar = document.getElementsByClassName("input-group")[0];
	var chatBox = document.getElementsByClassName("row justify-content-center")[1];

	var macros = CrittersPlus.data.macros||[];
	var binding = undefined;

	//SetupModel
	 {
		var dialogueHTML = `<div id="CP_modal" class="modal fade" tabindex="-1" role="dialog">
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
		document.body.insertAdjacentHTML('afterbegin',dialogueHTML);
	}

	function createDialogue(header,body,footer) {
		$('#CP_modal').modal();
		$('#CP_modal').modal('show');
		if(header) $('#CP_modal .modal-header').html(header);
		if(body) $('#CP_modal .modal-body').html(body);
		if(footer) $('#CP_modal .modal-footer').html(footer);
		return $('#CP_model')
	}


	function createButton(name,cb,color="info",place='afterend',text) {
		var btnHTML = `<span class="input-group-btn"><button id="cp${camelize(name)}" class="btn btn-${color}">${text||name}</button></span>`;
		chatBar.insertAdjacentHTML(place, btnHTML);
		$(`#cp${camelize(name)}`).click(cb);
		return $(`#cp${camelize(name)}`);
	}

	function createSetting(id,macro) {
		var settingHTML = $(`<div class="list-group-item"><div class="input-group" id="cpSetting${camelize(id)}">
		<input type="text" class="form-control" value='${macro.name}' disabled>
		<div class="input-group-append">
		  <button class="btn ${macro.button&&macro.button.is(':visible')?"btn-success":"btn-outline-secondary"}" type="button" id="cpSetting${id}-button">Toggle Button</button>
		  <button class="btn ${macro.key?"btn-success":"btn-outline-secondary"}" type="button" id="cpSetting${id}-key">${binding==macro?"binding...":macro.key||"Bind Key"}</button>
		</div>
	  </div></div>`);
	  $('#cp_settingList').append(settingHTML);
        var btnButton = $(`#cpSetting${id}-button`);
        var btnKey = $(`#cpSetting${id}-key`);
	  btnButton.click(()=>{
            btnButton.toggleClass('btn-success');
             btnButton.toggleClass('btn-outline-secondary');
          macro.ToggleButton();
	  });
        btnKey.click(()=>{
            if(binding==macro) {
                macro.key = undefined;
                binding=undefined;
                btnKey.removeClass('btn-danger')
                btnKey.addClass('btn-outline-secondary')
                btnKey.text("Bind key");
                return;
            }
            binding = macro;
            console.log("Binding " + macro.name + "...");
            btnKey.text("Binding...");
            btnKey.removeClass('btn-outline-secondary')
            btnKey.addClass('btn-danger');
        });

	}

	function Macro(name,cb) {
        this.name = name;
        this.cb = cb;
        this.button = undefined;
        this.key = undefined;
		macros.push(this);
	}
	Macro.prototype.ToggleButton = function(color,place,text) {
		if(this.button) {
			this.button.toggle();
		} else {
			this.button = createButton(this.name,this.cb,color,place,text);
		}
	}
	Macro.prototype.BindKey = function(e) {
		this.key = e.which;
	}
	CrittersPlus.Macro = Macro;

	$(document).keydown(function(e) {
		if(binding) {
			binding.BindKey(e);
			binding = undefined;
			save();
            RefreshSettings();
			return;
		}
		macros.forEach(a=>{
			if(a.key==e.which) {
                console.log("Triggering",a.name,"by key...")
				a.cb();
			}
		})
	});

	function save() {
		GM.setValue("CrittersPlus_data",CrittersPlus.data);
	}

    function RefreshSettings(){
        $('#cp_settingList').empty();
		macros.forEach(a=>{
			createSetting(camelize(a.name),a);
		})
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
`
		createDialogue("Critters+ Settings",settingHTML,"");
        RefreshSettings();
	}
	CrittersPlus.DisplaySettings = DisplaySettings;

	function sendJoke() {
        document.getElementById("inputMessage").value="";
        var joke = jokes[(Math.floor(Math.random() * jokes.length))]; // Retrieve random joke from variable
        world.sendMessage(joke.j); // Send the first part of the joke
        delay(function(){
            world.sendMessage(joke.p); // Send the punchline
        }, 5000 ); // end delay
    }
	CrittersPlus.sendJoke = sendJoke;

    function sendClap() {
        var message = document.getElementById("inputMessage").value;
        document.getElementById("inputMessage").value="";
        message = message.split(" ").join(" 👏 ");
        message = "👏" + message + "👏"
        console.log(message);
        world.sendMessage(message);
    }
	CrittersPlus.sendClap = sendClap;

    function balloonToggle() {
        document.getElementById("inputMessage").value="";
        //world.sendMessage("/balloons"); // Turn chat balloons off
        world.stage.room.balloons.visible = !world.stage.room.balloons.visible;
    }

    function nametagsToggle() {
        document.getElementById("inputMessage").value="";
        world.stage.room.nicknames.visible = !world.stage.room.nicknames.visible;
    }
if(!CrittersPlus.data.macros) {
	CrittersPlus.data.macros = macros;

	var settingsMacro = new Macro('settings',DisplaySettings)
    settingsMacro.ToggleButton('primary','beforeend','<i class="fas fa-cog"></i>');
	var jokeMacro = new Macro("Joke",sendJoke);
	jokeMacro.ToggleButton('success','beforeend');
	var clapMacro = new Macro("Clap",sendClap);
    clapMacro.ToggleButton('warning','beforeend');
	new Macro("Chat Balloons",balloonToggle);
	new Macro("NameTags",nametagsToggle);
	new Macro("freeitem",()=>{
        world.sendMessage("/freeitem");
    });
	new Macro("pop",()=>{
        world.sendMessage("/pop");
    });
	new Macro("beep",()=>{
        world.sendMessage("/beep");
    });
	new Macro("darkmode",()=>{
        world.sendMessage("/darkmode");
    });
	new Macro("game",()=>{
        world.sendMessage("/game");
	});
	save();
}

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