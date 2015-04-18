#pragma strict

private static var saveTable: Hashtable = new Hashtable();
private static var fileName : String = "";
private static var initialized = false;

//public static var SaveInterface:RunnerSaveGame;

static function CheckOpen () {
	if (!initialized) {
		Debug.Log("Not initialized");
		initialized = true;
		fileName = Application.persistentDataPath + "/RollerSaveData.dat";
		Debug.Log(fileName);
		Debug.Log("Init = " + initialized);
		OpenSave();
	}
}

function Start () {
	//SaveInterface = this;
	CheckOpen();
}

static function OpenSave () {
	Debug.Log("OpenSave");
	var fileRef:System.IO.StreamReader;
	if (System.IO.File.Exists(fileName)) {
		fileRef = System.IO.File.OpenText(fileName);
		var fileContents:String = "";
		do {
			fileContents = fileRef.ReadLine();
			if (fileContents) {
				var equalIndex = fileContents.IndexOf('=');
				if (equalIndex != -1) {
					var key = fileContents.Substring(0, equalIndex);
					var val = fileContents.Substring(equalIndex + 1);
					Debug.Log("Read key: " + key);
					Debug.Log("Read val: " + val);
					saveTable.Add(key, val);
				}
			}
		} while (fileContents);
		fileRef.Close();		
	}
//	SetGlobal("Test2", "First");
//	SetGlobal("Test3", "First");
//	SetGlobal("Test2", "Second");
	SaveGame();
}

function Update () {
	
}

static function SaveGame () {
	CheckOpen();
	Debug.Log("Saving file " + fileName);
	var fileRef:System.IO.StreamWriter = new System.IO.StreamWriter(fileName);
	var keyCount = saveTable.Count;
	for (var item : DictionaryEntry in saveTable) {
		var writeString = item.Key + "=" + item.Value;
		Debug.Log("Writing " + writeString);
		fileRef.WriteLine(writeString);
	}
	fileRef.Flush();
	fileRef.Close();		
}

private static var currentPrefix:String = "PrefixNotSet.";

static function SetGlobal( key:String, val:String ) {
	CheckOpen();
	Debug.Log("SetGlobal " + key + "=" +val);
	if (saveTable.ContainsKey(key)) {
		Debug.Log("removing old " + key + "=" +val);
		saveTable.Remove(key);
	}
	Debug.Log("adding new " + key + "=" +val);
	saveTable.Add(key, val);
}

static function GetGlobal( key, defaultVal ):String {
	CheckOpen();
	Debug.Log("GetGlobal " + key);
	if (saveTable.ContainsKey(key)) {
		for (var item : DictionaryEntry in saveTable) {
			if (item.Key == key) {
				Debug.Log("Returning key value " + item.Value);
				return item.Value;
			}
		}
	} else {
		Debug.Log("Returning default value " + defaultVal);
		return defaultVal;
	}
}

static function GetValue( key:String, val:String ):String {
	return GetGlobal( currentPrefix + key, val);
}

static function SetValue( key:String, val:String ) {
	SetGlobal( currentPrefix + key, val);
}

static function SetPrefix( prefix ) {
	currentPrefix = prefix + ".";
}


