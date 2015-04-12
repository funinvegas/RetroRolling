#pragma strict

function Start () {
}

function Update () {
}

function OnCollisionEnter(collisionInfo:Collision)
{
	Debug.Log("Child Collide");
	gameObject.SendMessageUpwards("ChildCollide", collisionInfo);
}