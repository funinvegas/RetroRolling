#pragma strict

function Start () {
	runnerNode = transform.FindChild("RunnerNode");
}

public var cameraNode:Transform;
public var cameraLook:Transform;
public var cameraRaycast:Transform;
private var runnerNode:Transform;
function averageVectorValue(v:Vector3) {
	return (v.x + v.y + v.z) / 3;
}

var lastPosition:Vector3 = new Vector3(0,0,0);
function FixedUpdate () {
	//runnerNode.transform.rotation.SetLookRotation(runnerNode.transform.forward * -1);
	runnerNode.transform.eulerAngles = new Vector3(0,Camera.main.transform.eulerAngles.y,0);
	var playerSize:double = GetComponent(SphereCollider).radius * averageVectorValue(transform.localScale);
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
	cameraLook.position.y += playerSize * 1;
	var cameraMoveTarget:Vector3 = transform.position;
	cameraMoveTarget.y += playerSize;
	//cameraNode.transform.position = Vector3.Lerp(cameraNode.transform.position, new Vector3(cameraNode.transform.position.x, cameraLook.position.y, cameraNode.transform.position.z), 0.5);
	var cameraDelta:Vector3 = cameraNode.transform.position - cameraMoveTarget;
	var cameraDirection:Vector3 = cameraDelta.normalized;
	var maxDistance:double = playerSize * 18;
	var minDistance:double = playerSize * 12;
	//cameraDirection.y += playerSize * 2;
	//Debug.DrawRay(cameraMoveTarget, cameraDirection * maxDistance, Color.blue);
	//Debug.DrawRay(cameraMoveTarget, cameraDirection * minDistance, Color.red);
	if (Mathf.Abs(cameraDelta.magnitude) < minDistance) {
		cameraDirection.y += playerSize;
		cameraDirection = cameraDirection.normalized;
		//cameraNode.transform.position = cameraMoveTarget + (cameraDirection * minDistance);
		cameraNode.transform.position = Vector3.Lerp(cameraNode.transform.position, cameraMoveTarget + (cameraDirection * minDistance), 0.05);
		//cameraDirection.x *= -1;
		//cameraDirection.z *= -1;
		//cameraNode.transform.position = Vector3.Lerp(cameraNode.transform.position, cameraMoveTarget + (cameraDirection * maxDistance), 0.7);
	} else {
		if (cameraNode.transform.position.y > cameraMoveTarget.y) {
			if (Mathf.Abs(cameraDelta.x) * Mathf.Abs(cameraDelta.x) + Mathf.Abs(cameraDelta.y) * Mathf.Abs(cameraDelta.y) > minDistance * minDistance) {		
				cameraDirection.y -= playerSize;
				cameraDirection = cameraDirection.normalized;
				cameraNode.transform.position = Vector3.Lerp(cameraNode.transform.position, cameraMoveTarget + (cameraDirection * minDistance), 0.01);
			}
		}
		if (Mathf.Abs(cameraDelta.magnitude) > maxDistance) {
			cameraNode.transform.position = Vector3.Lerp(cameraNode.transform.position, cameraMoveTarget + (cameraDirection * maxDistance), 0.05);
			//cameraNode.transform.position = cameraMoveTarget + (cameraDirection * maxDistance);
		}
	}
	
	var hit : RaycastHit;
	cameraDelta = cameraNode.transform.position - cameraLook.position;
	cameraDirection = cameraDelta.normalized;
	Debug.DrawRay(cameraLook.position, cameraDelta, Color.white);
	if (Physics.Raycast(cameraLook.position, cameraDirection, hit, 1 << 8)) {
		if(hit.distance < cameraDelta.magnitude && !hit.rigidbody || (hit.rigidbody && (hit.rigidbody.gameObject != gameObject))) {
			cameraRaycast.transform.position = hit.point;
		}
		//var distanceToGround = hit.distance;
	} else {
		cameraRaycast.transform.position = cameraNode.transform.position;
	}
		

}


