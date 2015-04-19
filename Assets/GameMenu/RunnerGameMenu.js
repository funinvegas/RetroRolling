#pragma strict

public var driverSelectMenu:Transform;
public var nameFileMenu:Transform;
public var gameSelectMenu:Transform;
public var confirmDeleteMenu:Transform;
public var levelSelect:Transform;

private function hideAllMenus() {
	driverSelectMenu.gameObject.SetActive(false);
	nameFileMenu.gameObject.SetActive(false);
	gameSelectMenu.gameObject.SetActive(false);
	confirmDeleteMenu.gameObject.SetActive(false);
	levelSelect.gameObject.SetActive(false);
}

private var unusedSave:String = "Empty Save";
private var activeSave:int = 0;

function LoadSaveNames() {
	gameSelectMenu.transform.FindChild("Button 1/Save1Text").GetComponent(UI.Text).text = RunnerSaveGame.GetGlobal("NameOfSave1", unusedSave);
	gameSelectMenu.transform.FindChild("Button 2/Save2Text").GetComponent(UI.Text).text = RunnerSaveGame.GetGlobal("NameOfSave2", unusedSave);
	gameSelectMenu.transform.FindChild("Button 3/Save3Text").GetComponent(UI.Text).text = RunnerSaveGame.GetGlobal("NameOfSave3", unusedSave);
	gameSelectMenu.transform.FindChild("Button 4/Save4Text").GetComponent(UI.Text).text = RunnerSaveGame.GetGlobal("NameOfSave4", unusedSave);
}

function Start () {
	hideAllMenus();
	gameSelectMenu.gameObject.SetActive(true);
	LoadSaveNames();
	
	cages.Push(cage1);
	cages.Push(cage2);
	runners.Push(runner1);
	runners.Push(runner2);
	runners.Push(runner3);
	runners.Push(runner4);
	runners.Push(runner5);
	runners.Push(runner6);
}

function Update () {

}

function NewGameN(n:int) {
	hideAllMenus();
	activeSave = n;
	if (gameSelectMenu.transform.FindChild("Button " + n + "/Save" + n + "Text").GetComponent(UI.Text).text == unusedSave) {
		nameFileMenu.gameObject.SetActive(true);
	} else {
		EnterRunnerMenu();
	}
}

function NewGameButton1 () {
	NewGameN(1);
}

function NewGameButton2 () {
	NewGameN(2);
}

function NewGameButton3 () {
	NewGameN(3);
}

function NewGameButton4 () {
	NewGameN(4);
}

function NameOKButton () {
	RunnerSaveGame.SetGlobal("NameOfSave" + activeSave, nameFileMenu.transform.FindChild("InputField/Text").GetComponent(UI.Text).text);
	hideAllMenus();
	RunnerSaveGame.SaveGame();
	LoadSaveNames();
	EnterRunnerMenu();
}
function DeleteN (n:int) {
	activeSave = n;
	hideAllMenus();
	confirmDeleteMenu.gameObject.SetActive(true);
}
function DeleteGame1 () {
	DeleteN(1);
}

function DeleteGame2 () {
	DeleteN(2);
}

function DeleteGame3 () {
	DeleteN(3);
}

function DeleteGame4 () {
	DeleteN(4);
}

public var cage1:Transform;
public var cage2:Transform;
public var runner1:Transform;
public var runner2:Transform;
public var runner3:Transform;
public var runner4:Transform;
public var runner5:Transform;
public var runner6:Transform;
private var cages:Array = new Array();
private var runners:Array = new Array();
private var currentCage:int = 0;
private var currentRunner:int = 0;

function UpdateVisibleRunner () {
	var i = 0;
	for( i = 0; i < runners.length; ++i) {
		(runners[i] as Transform).gameObject.SetActive(false);
	}
	(runners[currentRunner] as Transform).gameObject.SetActive(true);
}

function UpdateVisibleCages () {
	var i = 0;
	for( i = 0; i < cages.length; ++i) {
		(cages[i] as Transform).gameObject.SetActive(false);
	}
	(cages[currentCage] as Transform).gameObject.SetActive(true);
}

function UpdateVisibleRunnerAndCage () {
	UpdateVisibleRunner();
	UpdateVisibleCages();
}
function EnterRunnerMenu () {
	RunnerSaveGame.SetPrefix("SaveGame_" + activeSave + ".");
	currentRunner = parseInt(RunnerSaveGame.GetValue("ActiveRunner", "0"));
	currentCage = parseInt(RunnerSaveGame.GetValue("ActiveCage", "0"));
	UpdateVisibleRunnerAndCage();
	driverSelectMenu.gameObject.SetActive(true);
}

function PrevRunner () {
	currentRunner--;
	if (currentRunner < 0) {
		currentRunner = runners.length - 1;
	}
	UpdateVisibleRunner();
}

function PrevCage () {
	currentCage--;
	if (currentCage < 0) {
		currentCage = cages.length - 1;
	}
	UpdateVisibleCages();
}

function NextRunner () {
	currentRunner++;
	if (currentRunner >= runners.length) {
		currentRunner = 0;
	}
	UpdateVisibleRunner();
}

function NextCage () {
	currentCage++;
	if (currentCage >= cages.length) {
		currentCage = 0;
	}
	UpdateVisibleCages();
}

function ConfirmDelete () {
	RunnerSaveGame.SetGlobal("NameOfSave" + activeSave, unusedSave);
	hideAllMenus();
	gameSelectMenu.gameObject.SetActive(true);
	RunnerSaveGame.SaveGame();
	LoadSaveNames();
}

function CancelDelete() {
	hideAllMenus();
	gameSelectMenu.gameObject.SetActive(true);
	RunnerSaveGame.SaveGame();
	LoadSaveNames();
}

function ConfirmRunnerButton () {
	RunnerSaveGame.SetGlobal("ActiveSave", "" + activeSave);
	RunnerSaveGame.SetValue("ActiveRunner", "" + currentRunner);
	RunnerSaveGame.SetValue("ActiveCage", "" + currentCage);
	RunnerSaveGame.SaveGame();
	EnterLevelSelect();
}

var levelDefs:Array;
private var levelScrollPosition:int = 0;
var menuItemPrefab:Transform;
function AddLevelDef (ln:String, sn:String) {
	var level = new LevelDef();
	level.init(ln, sn);
	var levelItem:Transform = Instantiate(menuItemPrefab, Vector3 (0, 100 * levelDefs.length, 0), Quaternion.identity);
	levelItem.SetParent(levelSelect.FindChild("ScrollRect/ScrollableContent"));
	level.renderMenuOption(levelItem);
	var itemRect:Rect = levelItem.GetComponent(RectTransform).rect;
	var scrollableRect:Rect = levelSelect.FindChild("ScrollRect/ScrollableContent").GetComponent(RectTransform).rect;
	levelItem.transform.localPosition = new Vector3(itemRect.width/2, (itemRect.height * -0.5) + (scrollableRect.height) - itemRect.height * levelDefs.length, 0);
	levelItem.GetComponent(UI.Button).onClick.AddListener(level.clickHandler);
	levelDefs.Push(level);

}

function LevelClick () {
	Debug.Log("Level Click ");
}

function EnterLevelSelect () {
	levelDefs = [];
	AddLevelDef("Tutorial", "CheezeWizTest");
	AddLevelDef("Level 1", "sceneName");
	AddLevelDef("Level 2", "sceneName");
	AddLevelDef("Level 3", "sceneName");
	AddLevelDef("Level 4", "sceneName");
	AddLevelDef("Level 5", "sceneName");
	AddLevelDef("Level 6", "sceneName");
	AddLevelDef("Level 7", "sceneName");
	AddLevelDef("Level 8", "sceneName");
	AddLevelDef("Level 9", "sceneName");
	AddLevelDef("Level 10", "sceneName");
	hideAllMenus();
	levelSelect.gameObject.SetActive(true);
}

function RenderVisibleLevels() {
	var level:Transform = levelSelect.FindChild("LevelMenuItem 1");
	if (levelScrollPosition < levelDefs.length) {
		level.gameObject.SetActive(true);
		(levelDefs[levelScrollPosition] as LevelDef).renderMenuOption(level);
	} else {
		level.gameObject.SetActive(false);
	}

	level = levelSelect.FindChild("LevelMenuItem 2");
	if (levelScrollPosition + 1 < levelDefs.length) {
		level.gameObject.SetActive(true);
		(levelDefs[levelScrollPosition + 1] as LevelDef).renderMenuOption(level);
	} else {
		level.gameObject.SetActive(false);
	}

	level = levelSelect.FindChild("LevelMenuItem 3");
	if (levelScrollPosition  + 2 < levelDefs.length) {
		level.gameObject.SetActive(true);
		(levelDefs[levelScrollPosition + 2] as LevelDef).renderMenuOption(level);
	} else {
		level.gameObject.SetActive(false);
	}

	level = levelSelect.FindChild("LevelMenuItem 4");
	if (levelScrollPosition + 3 < levelDefs.length) {
		level.gameObject.SetActive(true);
		(levelDefs[levelScrollPosition + 3] as LevelDef).renderMenuOption(level);
	} else {
		level.gameObject.SetActive(false);
	}

}