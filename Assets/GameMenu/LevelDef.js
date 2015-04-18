#pragma strict

public class LevelDef {
	function Start () {

	}
	private var levelName:String;
	private var sceneName:String;
	private var unlocked:boolean;
	private var freeUnlockName = "Tutorial";

	function init (ln:String, sn:String) {
		levelName = ln;
		sceneName = sn;
		unlocked = ln == freeUnlockName;
		unlocked = "Unlocked" == RunnerSaveGame.GetValue("Level." + ln + ".Unlocked", unlocked ? "Unlocked" : "Locked");
		
	}

	function renderMenuOption( menu:Transform ) {
		var levelText:Transform = menu.FindChild("LevelName");
		levelText.GetComponent(UI.Text).text = levelName;

		var levelLocked:Transform = menu.FindChild("Locked");
		levelLocked.GetComponent(UI.Text).text = (unlocked ? "" : "Locked");
	}


	function Update () {
		
	}
}