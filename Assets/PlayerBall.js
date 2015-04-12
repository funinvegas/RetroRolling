#pragma strict

function Start () {
}

function Update () {
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
	    var pickupAble:GameObject = worldObject.transform.Find("Pickupable").gameObject;
	    var deltaVec:Vector3 = pickupAble.transform.position - transform.position;
	    pickupAble.name += childCount;
	    childCount++;
	    pickupAble.transform.parent = transform;
	    pickupAble.layer = gameObject.layer;
	    //pickupAble.AddComponent(PlayerBallAttached);
	    //Debug.Log("Destroying " + worldObject.name);
	    GameObject.Destroy(worldObject);
	    //worldObject.active = false;
	   	var playerSize:SphereCollider = GetComponent(SphereCollider) as SphereCollider;
	   	var radius = playerSize.radius;
	   	pickupAble.transform.localPosition = pickupAble.transform.localPosition.normalized * radius;
	}
}