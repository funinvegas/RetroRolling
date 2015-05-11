#pragma strict

function Start () {
	cages.Push(cage1);
	cages.Push(cage2);
	runners.Push(runner1);
	runners.Push(runner2);
	runners.Push(runner3);
	runners.Push(runner4);
	runners.Push(runner5);
	runners.Push(runner6);
	InitActiveRunner();
	RenderSettings.ambientLight = Color.white;
	RenderSettings.ambientIntensity = 1;
	startingLocation = transform.position;
}

private var startingLocation:Vector3 = new Vector3(0,0,0);
function Update () {
	if (transform.position.y < -1000) {
		transform.position = startingLocation;
		transform.position.y += GetComponent(SphereCollider).radius * averageVectorValue(transform.localScale);
		gameObject.GetComponent(Rigidbody).velocity = new Vector3(0,0,0);
	}
}

var childCount = 0;

function ChildCollide(collisionInfo:Collision) {
	Debug.Log("Child Collide Called");
	OnCollisionEnter(collisionInfo);
}
function averageVectorValue(v:Vector3) {
	return (v.x + v.y + v.z) / 3;
}
function OnCollisionEnter(collisionInfo:Collision)
{
	if (collisionInfo.collider.name != "Plane") {
		//Debug.Log("Detected collision between " + gameObject.name + " and " + collisionInfo.collider.name);
	    //Debug.Log("There are " + collisionInfo.contacts.Length + " point(s) of contacts");
	    //Debug.Log("Their relative velocity is " + collisionInfo.relativeVelocity);
	}
	var worldObject:GameObject = collisionInfo.gameObject;
	if (worldObject) {
		var pickupAble:Transform = worldObject.transform.FindChild("Pickupable");
		if (pickupAble) {
		    var pickupAbleCollider = pickupAble.GetComponent(SphereCollider);
		    if (pickupAbleCollider) {
			   	var playerSize:SphereCollider = GetComponent(SphereCollider) as SphereCollider;
			   	var radius = playerSize.radius * averageVectorValue(transform.localScale);
			   	var pickupRadius = pickupAble.GetComponent(SphereCollider).radius * averageVectorValue(worldObject.transform.localScale);
			   	if (pickupRadius * 3 < radius  && pickupRadius * 20) {
				    var deltaVec:Vector3 = pickupAble.position - transform.position;
				    pickupAble.name += "." + childCount;
				    worldObject.name += "." + childCount;
				    childCount++;
				    var worldObjectColliders:Array = worldObject.GetComponents(Collider);
				    for( var i = 0; i < worldObjectColliders.length; ++i ){
				    	(worldObjectColliders[i] as Collider).enabled = false;
				    }
				    pickupAbleCollider.material = GetComponent(SphereCollider).material;
				    pickupAbleCollider.enabled = true;
				    pickupAble.gameObject.layer = gameObject.layer;
				    Destroy (worldObject.GetComponent.<Rigidbody>());
				    worldObject.transform.SetParent(transform);
				   	worldObject.transform.localPosition = worldObject.transform.localPosition.normalized * playerSize.radius;
				   	worldObject.transform.localPosition -= pickupAble.transform.localPosition;
				   	// r3 = r1 (1 + 1/3r2^3/ r1^3)
				   	// Nate math suggests 0.333, but picking a number that looks good
				   	var factor = 0.2 * ((pickupRadius * pickupRadius * pickupRadius) / (radius * radius * radius));
				   	playerSize.radius = playerSize.radius * (1 + factor);
				}
			}
		}
	}
	/*if (collisionInfo.collider.name == "Pickupable") {
	    var worldObject:GameObject = collisionInfo.gameObject;
	    //Debug.Log("World object name = " + worldObject.name);
	    var pickupAble:GameObject = worldObject.transform.FindChild("Pickupable").gameObject;
	    var deltaVec:Vector3 = pickupAble.transform.position - transform.position;
	    pickupAble.name += childCount;
	    childCount++;
	    pickupAble.transform.SetParent(transform);
	    pickupAble.GetComponent(SphereCollider).material = GetComponent(SphereCollider).material;
	    pickupAble.layer = gameObject.layer;
	    //pickupAble.AddComponent(PlayerBallAttached);
	    //Debug.Log("Destroying " + worldObject.name);
	    GameObject.Destroy(worldObject);
	    //worldObject.active = false;
	   	var playerSize:SphereCollider = GetComponent(SphereCollider) as SphereCollider;
	   	var radius = playerSize.radius;
	   	pickupAble.transform.localPosition = pickupAble.transform.localPosition.normalized * radius;
	   	// r3 = r1 (1 + 1/3r2^3/ r1^3)
	   	var pickupRadius = pickupAble.GetComponent(SphereCollider).radius;
	   	var factor = 0.15 * ((pickupRadius * pickupRadius * pickupRadius) / (playerSize.radius * playerSize.radius * playerSize.radius));
	   	//playerSize.radius += (pickupRadius * (  factor * factor * factor * factor ));
	   	playerSize.radius = playerSize.radius * (1 + factor);
	}*/
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
	//(runners[currentRunner] as Transform).gameObject.SetActive(true);
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
function InitActiveRunner () {
	var activeSave = parseInt(RunnerSaveGame.GetGlobal("ActiveSave", 1));
	RunnerSaveGame.SetPrefix("SaveGame_" + activeSave + ".");
	currentRunner = parseInt(RunnerSaveGame.GetValue("ActiveRunner", "0"));
	currentCage = parseInt(RunnerSaveGame.GetValue("ActiveCage", "0"));
	UpdateVisibleRunnerAndCage();
}
