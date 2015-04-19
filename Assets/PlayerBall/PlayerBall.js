#pragma strict

function Start () {
	runnerNode = transform.FindChild("RunnerNode");
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
}

public var cameraNode:Transform;
public var cameraLook:Transform;
private var runnerNode:Transform;
function Update () {
}
var lastPosition:Vector3 = new Vector3(0,0,0);
function FixedUpdate () {
	//runnerNode.transform.rotation.SetLookRotation(runnerNode.transform.forward * -1);
	runnerNode.transform.eulerAngles = new Vector3(0,Camera.main.transform.eulerAngles.y,0);
	var playerSize:double = GetComponent(SphereCollider).radius;
	/*
	var currentPosition:Vector3 = transform.position;
	var movement:Vector3 = lastPosition - currentPosition;
	//if (movement.magnitude > 0.01) {
		var direction:Vector3 = movement.anormalized;
		Debug.DrawRay(transform.position, direction * 100, Color.white);
		direction.x *= (5 * playerSize);
		direction.z *= (5 * playerSize);
		if (direction.y < -0.3) {
			direction.y = -0.5 * playerSize;
		} else {
			direction.y = 0.5 * playerSize;
		}
		Debug.DrawRay(transform.position, direction, Color.green);
		var newPosition:Vector3 = transform.position + direction;
//		var newYPosition:Vector3 = new Vector3(0,newPosition.y, 0);
//		newPosition.y = transform.position.y;
		cameraNode.transform.position = Vector3.Lerp(cameraNode.transform.position, newPosition, 0.1);
//		cameraNode.transform.position = Vector3.Lerp(cameraNode.transform.position, newYPosition, 0.08);
		//Debug.Log(" NY: " + transform.position.y + " TY:" + newPosition.y + " CY:" + cameraNode.transform.position.y);
		//Debug.Log(" Adding : " + transform.position.y + " TY:" + newPosition.y + " CY:" + cameraNode.transform.position.y);
		//var delta:Vector3 = new Vector3((newPosition.x - cameraNode.transform.position.x) * 0.1,  (newPosition.y - cameraNode.transform.position.y) * 0.1, (newPosition.z - cameraNode.transform.position.z) * 0.1);
		//Debug.Log(" Delta: " + delta);
		//Debug.Log("Camera Position Before:" + cameraNode.transform.position);
		//cameraNode.transform.position += delta;
		//Debug.Log("Camera Position After:" + cameraNode.transform.position);
		lastPosition = currentPosition;
	//}
	*/
	cameraLook.position = transform.position;
	cameraLook.position.y += playerSize * 3;
	var cameraDelta:Vector3 = cameraNode.transform.position - cameraLook.position;
	var cameraDirection:Vector3 = cameraDelta.normalized;
	var maxDistance:double = playerSize * 6;
	var minDistance:double = playerSize * 3;
	//cameraDirection.y += playerSize * 2;
	Debug.DrawRay(cameraLook.position, cameraDirection * maxDistance, Color.blue);
	Debug.DrawRay(cameraLook.position, cameraDirection * minDistance, Color.red);
	if (Mathf.Abs(cameraDelta.magnitude) > maxDistance) {
		//cameraNode.transform.position = Vector3.Lerp(cameraNode.transform.position, cameraLook.position + (cameraDirection * maxDistance), 0.1);
		cameraNode.transform.position = cameraLook.position + (cameraDirection * maxDistance);
	}
	if (Mathf.Abs(cameraDelta.magnitude) < minDistance) {
		cameraDirection.y += playerSize * 2;
		cameraNode.transform.position = cameraLook.position + (cameraDirection * minDistance);
		//cameraNode.transform.position = Vector3.Lerp(cameraNode.transform.position, cameraLook.position + (cameraDirection * maxDistance), 0.1);
		//cameraDirection.x *= -1;
		//cameraDirection.z *= -1;
		//cameraNode.transform.position = Vector3.Lerp(cameraNode.transform.position, transform.position + (cameraDirection * maxDistance), 0.7);
	}
}

var childCount = 0;

function ChildCollide(collisionInfo:Collision) {
	Debug.Log("Child Collide Called");
	OnCollisionEnter(collisionInfo);
}
function OnCollisionEnter(collisionInfo:Collision)
{
	if (collisionInfo.collider.name != "Plane") {
		//Debug.Log("Detected collision between " + gameObject.name + " and " + collisionInfo.collider.name);
	    //Debug.Log("There are " + collisionInfo.contacts.Length + " point(s) of contacts");
	    //Debug.Log("Their relative velocity is " + collisionInfo.relativeVelocity);
	}
	
	if (collisionInfo.collider.name == "Pickupable") {
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
	}
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
function InitActiveRunner () {
	var activeSave = parseInt(RunnerSaveGame.GetGlobal("ActiveSave", 1));
	RunnerSaveGame.SetPrefix("SaveGame_" + activeSave + ".");
	currentRunner = parseInt(RunnerSaveGame.GetValue("ActiveRunner", "0"));
	currentCage = parseInt(RunnerSaveGame.GetValue("ActiveCage", "0"));
	UpdateVisibleRunnerAndCage();
}
