// ==UserScript==
// @name         Critters+Dev
// @namespace    http://discord.gg/G3PTYPy
// @version      2.0.0,1 beta
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

	var macros = [];
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
	                <div class="modal-footer"><button type="button" class="btn btn-secondary" data-dismiss="CP_modal">Ok</button></div>
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
		return $(`#cp${camelize(name)}`)
	}

	function createSetting(id,macro) {
		var settingHTML = $(`<div class="list-group-item"><div class="input-group" id="cpSetting${camelize(id)}">
		<input type="text" class="form-control" value='${macro.name}' aria-label="Recipient's username" aria-describedby="basic-addon2" disabled>
		<div class="input-group-append">
		  <button class="btn btn-outline-secondary" type="button" id="cpSetting${camelize(id)}-button"  disabled>Toggle Button</button>
		  <button class="btn btn-outline-secondary" type="button" id="cpSetting${camelize(id)}-key"  disabled>${macro.key||"Bind Key"}</button>
		</div>
	  </div></div>`);
	  $('#cp_settingList').append(settingHTML);
	  $(`#cpSetting${id}-button`).click(()=>{
		  if(macro.button) {
			macro.button.toggle()
		  } else {
			macro.button = createButton(macro.name,macro.cb);
		  }
	  });

	}

	function CPMacro(name,cb) {
		this.name = name;
		this.cb = cb;
		this.button = undefined;
		this.key = undefined;
	}
	
	CPMacro.prototype.BindButton = function(color,place) {
		this.button = createButton(this.name,this.cb,color,place);
	}

	CPMacro.prototype.BindKey = function(e){
		this.key = e.which;
	}

	$(document).keydown(function(e) {
		console.log("[CP] Key",e.which);
		if(binding) {
			binding.key = e.which;
			binding = undefined;
			return;
		}
		macros.forEach(a=>{
			if(a.key==e.which) {
				a.cb();
			}
		})
	});


	function Settings() {
		//Open Window with dropdown and stuff
		var settingHTML = `
		<h2>Macros</h2>
		<div id="cp_settingList" class="list-group">
</div>
<h2>Create Macro</h2>
<div class="input-group" id="cpSettingCreate">
		<input type="text" class="form-control" value="Coming Soon" aria-label="Recipient's username" aria-describedby="basic-addon2" disabled>
		<div class="input-group-append">
		  <button class="btn btn-outline-secondary" type="button" id="cpSettingJS-button" disabled>JS</button>
		  <button class="btn btn-outline-secondary" type="button" id="cpSettingChat-key"  disabled>Chat</button>
		</div>
	  </div>
`
		createDialogue("Critters+ Settings",settingHTML,"");
		macros.forEach(a=>{
			createSetting(a.name,a);
		})
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
        world.stage.room.balloons.visible = !world.stage.room.balloons.visible;
    }

    function nametagsToggle() {
        document.getElementById("inputMessage").value="";
        //world.sendMessage("/nicknames"); // Turn name tags on/off
        world.stage.room.nicknames.visible = !world.stage.room.nicknames.visible;
    }

	createButton('settings',Settings,'primary','beforeend','<i class="fas fa-cog"></i>');
	createButton("Joke",sendJoke,'success','beforeend');
	createButton("Clap",sendClap,'warning','beforeend');
	createButton("Chat Balloons",balloonToggle,'info');
	createButton("NameTags",nametagsToggle,'info');
	macros.push(new CPMacro("Chat Balloons",balloonToggle));
	macros.push(new CPMacro("NameTags",nametagsToggle));

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
