let consoleInput;
let Console;
let logStartPos = 0;
let consolePosition = "Left" // "Left", "Right", "Top", "Bottom", "Center"

// colors natively use the colortheme.js and include functionality for setting themes
// 100% reccomended used alongside colortheme.js

function onScreenConsole()
{
	let yOff = 0;
	textWrap("Char")
	textSize(Console.logTextSize);
	setThemeFill(0);
	consoleInput.style('background', currentColorTheme.fillColors[1])
	consoleInput.style('color', currentColorTheme.textColors[0])
	consoleInput.style('border', currentColorTheme.fillColors[0])
	switch (consolePosition)
	{
		case "Left":
			rect(0, 0, width / 5, height);
			for (let i = logStartPos; i < Console.logs.length - logStartPos; i++)
			{
				let errorCheck = Console.logs[i].split(":");
				if (errorCheck[0] == "ERROR") setThemeText(2);
				else setThemeText(0);
				text(Console.logs[i], (1.5 * Console.logSpacing) + (textWidth(i + ":") + 5) / 2, Console.logSpacing + yOff + (i - logStartPos) * Console.logSpacing, width / 5 - (Console.logSpacing * 2));
				setThemeText(1);
				text(i + ":", (1.5 * Console.logSpacing) - (textWidth(i + ":") + 5) / 2, Console.logSpacing + yOff + (i - logStartPos) * Console.logSpacing, width / 5 - (Console.logSpacing * 2));

				// if the charachter needs to be wrapped, add the extra line it takes into the y off
				if (textWidth(Console.logs[i]) > width / 5 - 50) yOff += ((ceil(textWidth(Console.logs[i]) / ((width / 5) - (Console.logSpacing * 2))) - 1) * Console.logSpacing);
				if (Console.logSpacing + yOff + (i - logStartPos) * Console.logSpacing > height) { logStartPos += 5; }
			}
			break;
		case "Right":
			rect(width / (5 / 4), 0, width / 5, height);
			for (let i = logStartPos; i < Console.logs.length - logStartPos; i++)
			{
				if (Console.logs[i][0] == "E" && Console.logs[i][0] == "R" && Console.logs[i][0] == "R") setThemeText(2);
				else setThemeText(0);
				text(Console.logs[i], (width / (5 / 4) + 1.5 * Console.logSpacing) + (textWidth(i + ":") + 5) / 2, Console.logSpacing + yOff + (i - logStartPos) * Console.logSpacing, width / 5 - (Console.logSpacing * 2));
				setThemeText(1);
				text(i + ":", (width / (5 / 4) + 1.5 * Console.logSpacing) - (textWidth(i + ":") + 5) / 2, Console.logSpacing + yOff + (i - logStartPos) * Console.logSpacing, width / 5 - (Console.logSpacing * 2));

				// if the charachter needs to be wrapped, add the extra line it takes into the y off
				if (textWidth(Console.logs[i]) > width / 5 - 30) yOff += ((ceil(textWidth(Console.logs[i]) / ((width / 5) - (Console.logSpacing * 2))) - 1) * Console.logSpacing);
				if (Console.logSpacing + yOff + (i - logStartPos) * Console.logSpacing > height) { logStartPos += 1; }
			}
			break;
		case "Top":
			rect(0, 0, width, height / 5);
			for (let i = logStartPos; i < Console.logs.length - logStartPos; i++)
			{
				if (Console.logs[i][0] == "E" && Console.logs[i][0] == "R" && Console.logs[i][0] == "R") setThemeText(2);
				else setThemeText(0);
				text(Console.logs[i], (1.5 * Console.logSpacing) + (textWidth(i + ":") + 5) / 2, Console.logSpacing + yOff + (i - logStartPos) * Console.logSpacing, width - (Console.logSpacing * 2));
				setThemeText(1);
				text(i + ":", (1.5 * Console.logSpacing) - (textWidth(i + ":") + 5) / 2, Console.logSpacing + yOff + (i - logStartPos) * Console.logSpacing, width - (Console.logSpacing * 2));

				// if the charachter needs to be wrapped, add the extra line it takes into the y off
				if (textWidth(Console.logs[i]) > width / 5 - 30) yOff += ((ceil(textWidth(Console.logs[i]) / ((width) - (Console.logSpacing * 2))) - 1) * Console.logSpacing);
				if (Console.logSpacing + yOff + (i - logStartPos) * Console.logSpacing > height / 5) { logStartPos += 1; }
			}
			break;
		case "Bottom":
			rect(0, height * (4 / 5), width, height / 5);
			for (let i = logStartPos; i < Console.logs.length - logStartPos; i++)
			{
				if (Console.logs[i][0] == "E" && Console.logs[i][0] == "R" && Console.logs[i][0] == "R") setThemeText(2);
				else setThemeText(0);
				text(Console.logs[i], (1.5 * Console.logSpacing) + (textWidth(i + ":") + 5) / 2, height * (4 / 5) + Console.logSpacing + yOff + (i - logStartPos) * Console.logSpacing, width - (Console.logSpacing * 2));
				setThemeText(1);
				text(i + ":", (1.5 * Console.logSpacing) - (textWidth(i + ":") + 5) / 2, height * (4 / 5) + Console.logSpacing + yOff + (i - logStartPos) * Console.logSpacing, width - (Console.logSpacing * 2));
				// if the charachter needs to be wrapped, add the extra line it takes into the y off
				if (textWidth(Console.logs[i]) > width / 5 - 30) yOff += ((ceil(textWidth(Console.logs[i]) / ((width) - (Console.logSpacing * 2))) - 1) * Console.logSpacing);
				if (Console.logSpacing + yOff + (i - logStartPos) * Console.logSpacing > height / 5) { logStartPos += 1; }
			}
			break;
	}
	//logStartPos += round(mouseScrolled/50);
	//logStartPos = constrain(logStartPos, 0, Console.logs.length - 1);
}
function runInputComand()
{
	let cmd = consoleInput.value(); // simpler refference to input value
	let comandSplit = cmd.split(" "); // split the string by spaces

	// get the arguments to be passed into a run or say command 
	let comandArgs = copyArray(comandSplit);
	comandArgs.shift();
	let args = "";
	for (let i = 0; i < comandArgs.length; i++)
	{
		args += comandArgs[i] + " ";
	}

	//Console.log("Comand Entered: " + cmd); // log that the comand was inputed

	// handle key words for commands, relatively self explanatory
	switch (comandSplit[0])
	{
		case "get":
			Console.log(args + ": " + eval(args));
			break;
		case "run":
			Console.log(eval(args));
			break;
		case "say":
			Console.log("System: " + args);
			break;
		case "clear":
			Console.clear();
			break;
		case "reload":
			location.reload();
			break;
		case "saveLogs":
			Console.log("Logs Saved!");
			Console.saveLogs();
			break;
		case "setTheme":
			currentColorTheme = eval(args);
			Console.log("Set Theme To: " + args);
			break;
		case "screenshot":
			saveCanvas();
			Console.log("Saved Screenshot Of Canvas!");
			break;
		case "set":
			let saveArgs1 = comandArgs[0];
			eval(comandArgs[0] + "=" + comandArgs[1]);
			Console.log("Set: " + saveArgs1 + " To: " + comandArgs[1]);
			break;
		case "close":
			window.close();
			break;
		case "help":
			Console.log("Possible Commands:");
			Console.log("get - logs the value of a given variable");
			Console.log("run - runs the given function and logs the output");
			Console.log("say - logs the literal string of what is inputed");
			Console.log("clear - clears the console");
			Console.log("reload - reloads the window / resets the page to default");
			Console.log("saveLogs - save the current logs as a .txt file");
			Console.log("setTheme - sets the current theme (ex: purple)");
			Console.log("screenshot - saves the current state of the canvas as a .png file");
			Console.log("set - sets a given variable to the given value");
			Console.log("(ex: ruintime 100 would set the variable runtime to 100)");
			Console.log("close - closes the current window");
			Console.log("help - provides this current list of options");
			break;	
		default:
			Console.error("Improper Key word Imputed: ");
			Console.error(cmd);
			break;
	}

	// clear console input
	consoleInput.value("");
}
function keyPressed()
{
	if (keyCode === 13 && consoleInput.value() != "")
	{
		runInputComand();
	}
}
class consoleClass
{
	constructor()
	{
		this.logs = [];
		this.logSpacing = 25;
		this.logTextSize = 15;
	}
	log(args)
	{
		this.logs.push(str(args));
	}
	error(args)
	{
		this.logs.push("ERROR: " + str(args));
	}
	clear()
	{
		this.logs = [];
		logStartPos = 0;
	}
	saveLogs()
	{
		let fileName = "DebugLog_" + timestamp();
		saveStrings(this.logs, fileName, "txt", true);
	}
	thingHappened()
	{
		this.logs.push("Something Happened!")
	}
}