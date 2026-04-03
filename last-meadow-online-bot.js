// click dragon achievement
// dont paste these few lines if you really really dont want it
// it happens instantly anyways
{ // scope to contain the variable to prevent potential overwrites
	const dragon = document.querySelector("[class^=dragonClickable]");
	// do 1000 even though you only need 500 in case some arent registered idk
	if (dragon) { for (let i = 0; i < 1000; i++) { dragon.click() } }
}




{
	document.getElementById("oo-bot-ui")?.remove();

	const uiString = `
	<span>select what the bot should spam:</span>
	<br>
	<input type="checkbox" id="oo-all-loop">
	<label for="oo-all-loop">everything</label>
	<br>
	<input type="checkbox" id="oo-adventure-loop">
	<label for="oo-adventure-loop">adventuring</label>
	<br>
	<input type="checkbox" id="oo-arrows-loop">
	<label for="oo-arrows-loop">arrow key thing</label>
	<br>
	<input type="checkbox" id="oo-targets-loop">
	<label for="oo-targets-loop">targets (for archers)</label>
	<br>
	<input type="checkbox" id="oo-close-dialogs-loop">
	<label for="oo-close-dialogs-loop">close popups</label>

	<oo-close-ui style="background: #303030; color: white; position: absolute; top: 100%; right: 1em; border: 2px solid white; box-shadow: 0 0 10px black; width: 2em; height: 1em; border-radius: 0 0 1em 1em; text-align: center;">
	<span>^</span>
	</oo-close-ui>
	`;

	ui = document.createElement("div")
	ui.innerHTML = uiString;
	ui.style = "background: #303030; color: white; font-family: sans-serif; border: 2px solid white; border-top: none; box-shadow: 0 0 10px black; padding: 0.75em; position: absolute; top: 0; left: 1em; z-index: 67676767;";
	ui.id = "oo-bot-ui";
	document.body.appendChild(ui);
}

// the arrow button to show/hide the ui
document.getElementsByTagName("oo-close-ui")[0].onclick = () => {
	ui = document.getElementById("oo-bot-ui");
	if (ui.style.bottom == "100%") {
		ui.style.top = "0";
		ui.style.bottom = "initial";
	} else {
		ui.style.top = "initial";
		ui.style.bottom = "100%";
	}
}

// make the checkboxes work
document.getElementById("oo-adventure-loop").oninput = (e) => { if (e.target.checked) { startAdventureLoop(); } else { stopAdventureLoop(); } }
document.getElementById("oo-arrows-loop").oninput = (e) => { if (e.target.checked) { startArrowsLoop(); } else { stopArrowsLoop(); } }
document.getElementById("oo-targets-loop").oninput = (e) => { if (e.target.checked) { startTargetsLoop(); } else { stopTargetsLoop(); } }
document.getElementById("oo-close-dialogs-loop").oninput = (e) => { if (e.target.checked) { startCloseDialogsLoop(); } else { stopCloseDialogsLoop(); } }
document.getElementById("oo-all-loop").oninput = (e) => { if (e.target.checked) { startAllLoops(); } else { stopAllLoops(); } }

// update the "everything" checkbox
function refreshAllCheckbox() {
	let numChecked = 0;
	for (element of ["adventure", "arrows", "targets", "close-dialogs"]) {
		numChecked += document.getElementById(`oo-${element}-loop`).checked;
	}

	const all = document.getElementById("oo-all-loop");
	all.indeterminate = numChecked > 0 && numChecked < 4;
	all.checked = numChecked == 4;
}




function startLoop(name, func, interval) {
	oo_intervals[name] = setInterval(func, interval);
	console.log(`started ${name} loop with id ${oo_intervals[name]}`);
}

function stopLoops(...propertyNames) {
	for (let propertyName of propertyNames) {
		if (oo_intervals[propertyName]) {
			clearInterval(oo_intervals[propertyName]);
			console.log(`stopped ${propertyName} loop with id ${oo_intervals[propertyName]}`);
			delete oo_intervals[propertyName];
		}
	}
}



// spam adventure
function startAdventureLoop() {
	stopAdventureLoop();
	document.getElementById("oo-adventure-loop").checked = true;
	refreshAllCheckbox();

	startLoop("adventureButton", () => {
		document.querySelector("[class^=gameActions]")?.firstElementChild.firstElementChild.firstElementChild.click();
	}, 10);
}

function stopAdventureLoop() {
	document.getElementById("oo-adventure-loop").checked = false;
	stopLoops("adventureButton");
	refreshAllCheckbox();
}




// arrow keys task
function startArrowsLoop() {
	stopArrowsLoop();
	document.getElementById("oo-arrows-loop").checked = true;
	refreshAllCheckbox();

	startLoop("arrowsButton", () => {
		document.querySelector("[class^=gameActions]")?.children[1].firstElementChild.click();
	}, 1000);

	startLoop("arrowsTask", () => {
		if (document.querySelector("[class^=sequences]") != null) {
			const arrowsParents = document.querySelector("[class^=sequences]")?.children;
			if (arrowsParents == undefined) { console.warn("bot error: couldnt find arrows"); return; }
			let arrowsParentIndex = 0;
			let arrowsPressInterval = setInterval(() => { // interval cause it doesnt like it otherwise idk
				if (arrowsParentIndex >= arrowsParents.length) {
					clearInterval(arrowsPressInterval);
					arrowsPressInterval = undefined;
					return;
				}

				// the alt texts in the arrow images happen to be the same as the keycodes
				// for the keydown event so we can just use it directly
				arrowsKeyName = arrowsParents[arrowsParentIndex].firstElementChild.alt;
				document.body.dispatchEvent(new KeyboardEvent('keydown', { key: arrowsKeyName }));
				// document.body.onkeydown
				arrowsParentIndex++;
			}, 0);
		}
	}, 1500);
}

function stopArrowsLoop() {
	document.getElementById("oo-arrows-loop").checked = false;
	stopLoops("arrowsButton", "arrowsTask");
	refreshAllCheckbox();
}




// targets task in the archer role
function startTargetsLoop() {
	stopTargetsLoop();
	document.getElementById("oo-targets-loop").checked = true;
	refreshAllCheckbox();

	startLoop("targetsButton", () => {
		document.querySelector("[class^=gameActions]")?.children[2].firstElementChild.click();
	}, 1000);

	startLoop("targetsTask", () => {
		if (document.querySelector("[class^=targetContainer]") != null) {
			let targetPressInterval = setInterval(() => {
				const target = document.querySelector("[class^=targetContainer]")?.firstElementChild;
				if (target == undefined) { console.warn("bot error: couldnt find target"); clearInterval(targetPressInterval); return; }
				target.click();
			}, 10);
		}
	}, 1500);
}

function stopTargetsLoop() {
	document.getElementById("oo-targets-loop").checked = false;
	stopLoops("targetsButton", "targetsTask");
	refreshAllCheckbox();
}




// close the "complete" and "out of resources" dialogs
function startCloseDialogsLoop() {
	stopCloseDialogsLoop();
	document.getElementById("oo-close-dialogs-loop").checked = true;
	refreshAllCheckbox();

	startLoop("closeDialogs", () => {
		document.querySelector("[class^=continueButtonWrapper]")?.firstElementChild.click();
		document.querySelector("[class^=footer]")?.firstElementChild.click();
	}, 500);
}

function stopCloseDialogsLoop() {
	document.getElementById("oo-close-dialogs-loop").checked = false;
	stopLoops("closeDialogs");
	refreshAllCheckbox();
}




function startAllLoops() {
	startAdventureLoop();
	startArrowsLoop();
	startTargetsLoop();
	startCloseDialogsLoop();
}

function stopAllLoops()  {
	stopAdventureLoop();
	stopArrowsLoop();
	stopTargetsLoop();
	stopCloseDialogsLoop();
}




console.log(`
%cbot instructions%c

the bot consists of a bunch of loops that each spam different things. ive made it so you can set which ones run and which ones dont. you can use the console/this area (for cool people) or the ui in the top left (for old grandmas who dont know how tech works)

to start/stop every loop, type %cstartAllLoops()%c/%cstopAllLoops()%c and press enter.

to start/stop a specific loop, type what you want to start/stop from the table and press enter

       loop        │          start          │          stop
───────────────────┼─────────────────────────┼───────────────────────
adventure loop     │ %cstartAdventureLoop()%c    │ %cstopAdventureLoop()%c
arrows loop        │ %cstartArrowsLoop()%c       │ %cstopArrowsLoop()%c
targets loop       │ %cstartTargetsLoop()%c      │ %cstopTargetsLoop()%c
close dialogs loop │ %cstartCloseDialogsLoop()%c │ %cstopCloseDialogsLoop()%c

the first 3 loops refer to pressing the buttons in the bottom right and completing any tasks. the close dialogs loop presses \"OK\" and \"continue\" for you when you beat a task and whatnot",
`,
"color: #4080f0; font-size: 1.5em; font-weight: bold", "",
"color: #4080f0;", "", "color: #4080f0;", "",
"color: #4080f0;", "", "color: #4080f0;", "",
"color: #4080f0;", "", "color: #4080f0;", "",
"color: #4080f0;", "", "color: #4080f0;", "",
"color: #4080f0;", "", "color: #4080f0;", "",
);


// make the var global and init it to a blank object if its unset
globalThis.oo_intervals = globalThis.oo_intervals || {};

// im too lazy to update the checkboxes so we're just gonna clear them all
stopAllLoops();
