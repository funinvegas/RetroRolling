#pragma strict

function Start () {
	runnerNode = transform.FindChild("RunnerNode");
}

public var cameraObject:Camera;
public var cameraNode:Transform;
public var cameraLook:Transform;
public var cameraRaycast:Transform;
public var mouseLook:boolean = false;

private var minDistance:double = 5;
private var maxDistance:double = minDistance * 1.25;

private var runnerNode:Transform;
function averageVectorValue(v:Vector3) {
	return (v.x + v.y + v.z) / 3;
}

function orientRunnerAndLook() {
	// Rotate the runner so he is always looking away from the camera
	runnerNode.transform.eulerAngles = new Vector3(0,Camera.main.transform.eulerAngles.y,0);

	// Get the player size, accounting for scale of the player node
	var playerSize:double = GetComponent(SphereCollider).radius * averageVectorValue(transform.localScale);

	// Move the node the camera looks at to be above the player ball node
	cameraLook.position = transform.position;
	cameraLook.position.y += playerSize * 1;
}

function rotateViewByKey() {
	var panLeft = Input.GetKeyDown ('q');
	var panRight = Input.GetKeyDown ('e');

	if (panLeft) {
		Debug.Log("Pan LEFT!");
	}
	if (panRight) {
		Debug.Log("Pan RIGHT!");
	}

	// Calcuate postion of camera compared to node above player
	var cameraDelta:Vector3 = cameraNode.transform.position - transform.position;
	var cameraLeft:Vector3 = Quaternion.AngleAxis(-25, Vector3.up) * cameraDelta;
	var cameraRight:Vector3 = Quaternion.AngleAxis(25, Vector3.up) * cameraDelta;
	// If user input moves camera
	if (panLeft || panRight) {
		// Move camera left or right
		if (panLeft) {
			cameraNode.transform.position = transform.position + cameraLeft;
		}
		if (panRight) {
			cameraNode.transform.position = transform.position + cameraRight;
		}
		// Get new delta to camera
		cameraDelta = cameraNode.transform.position - transform.position;
	}
	Debug.DrawRay(cameraLook.position, cameraLeft, Color.blue);
	Debug.DrawRay(cameraLook.position, cameraRight, Color.red);
}
private var lockedMouse:boolean = false;
function rotateViewByAxis() {
	if (lockedMouse) {
		var mouseSpeed = 3.0;

		var mouseX = Input.GetAxis("Mouse X");
		var cameraDelta = (cameraNode.transform.position - transform.position);
		var cameraRotated:Vector3 = Quaternion.AngleAxis(mouseX * mouseSpeed, Vector3.up) * cameraDelta;
		cameraNode.transform.position = transform.position + cameraRotated;

		var mouseY = -1 * Input.GetAxis("Mouse Y");
		cameraDelta = (cameraNode.transform.position - transform.position);
		cameraRotated = Quaternion.AngleAxis(mouseY * mouseSpeed, cameraObject.transform.right) * cameraDelta;
		cameraNode.transform.position = transform.position + cameraRotated;
	
	}
}
function rotateView() {
	if (mouseLook) {
		if (Input.GetMouseButtonDown(0)) {
			Cursor.lockState = CursorLockMode.Locked;
			lockedMouse = true;
		}
		if (Input.GetMouseButtonUp(0)) {
			Cursor.lockState = CursorLockMode.None;
			lockedMouse = false;
		}
		rotateViewByAxis();
	} else {
		rotateViewByKey();
	}
}

function clipCameraToObjects() {

	var hit : RaycastHit;
	var cameraDelta:Vector3 = cameraNode.transform.position - transform.position;
	var cameraDirection:Vector3 = cameraDelta.normalized;
	Debug.DrawRay(cameraLook.position, cameraDelta, Color.red);
	var allLayersExceptPlayer:int = (1 << 9);
	if (Physics.Raycast(cameraLook.position, cameraDelta, hit,allLayersExceptPlayer)) {
		if(hit.distance < cameraDelta.magnitude && !hit.rigidbody || (hit.rigidbody && (hit.rigidbody.gameObject != gameObject))) {
			Debug.Log("cliping Camera Distance");
			cameraRaycast.transform.position = hit.point;
		}
	} else {
		cameraRaycast.transform.position = cameraNode.transform.position;
	}
}
function keepCameraAbovePlayer() {
	// Get the player size, accounting for scale of the player node
	var playerSize:double = GetComponent(SphereCollider).radius * averageVectorValue(transform.localScale);

	// Camera should always be above player
	// Future note: maybe allow camera to be below player for 2 seconds?
	if (cameraNode.transform.position.y < cameraLook.position.y - playerSize * 0.5) {
			Debug.Log("keeping camera up");
		cameraNode.transform.position.y = cameraLook.position.y - playerSize * 0.5;
	}

	if (cameraNode.transform.position.y > cameraLook.position.y + (playerSize*3)) {
			Debug.Log("maxing camera up");
		cameraNode.transform.position.y = cameraLook.position.y + (playerSize*3);
	}
}
function pushCameraBack() {
	// Get the player size, accounting for scale of the player node
	var playerSize:double = GetComponent(SphereCollider).radius * averageVectorValue(transform.localScale);

	// Get a node above the player
	var cameraMoveTarget:Vector3 = cameraLook.position;
		
	// Calcuate postion of camera compared to node above player
	var cameraDelta:Vector3 = cameraNode.transform.position - cameraMoveTarget;
	var cameraDirection:Vector3 = cameraDelta.normalized;
	//cameraDirection.y += playerSize * 2;
	//Debug.DrawRay(cameraMoveTarget, cameraDirection * maxDistance, Color.blue);
	//Debug.DrawRay(cameraMoveTarget, cameraDirection * minDistance, Color.red);
	if (Mathf.Abs(cameraDelta.magnitude) < minDistance) {
			Debug.Log("pushing camera back");
		//cameraDirection.y += playerSize;
		cameraDirection = cameraDirection.normalized;
		//cameraNode.transform.position = cameraMoveTarget + (cameraDirection * minDistance);
		cameraNode.transform.position = Vector3.Lerp(cameraNode.transform.position, cameraMoveTarget + (cameraDirection * minDistance), 0.05);
		//cameraDirection.x *= -1;
		//cameraDirection.z *= -1;
		//cameraNode.transform.position = Vector3.Lerp(cameraNode.transform.position, cameraMoveTarget + (cameraDirection * maxDistance), 0.7);
	}
}

function limitCameraDistance() {
	// Get the player size, accounting for scale of the player node
	var playerSize:double = GetComponent(SphereCollider).radius * averageVectorValue(transform.localScale);

	// Get a node above the player
	var cameraMoveTarget:Vector3 = cameraLook.position;
		
	// Calcuate postion of camera compared to node above player
	var cameraDelta:Vector3 = cameraNode.transform.position - cameraMoveTarget;
	var cameraDirection:Vector3 = cameraDelta.normalized;
	//cameraDirection.y += playerSize * 2;
	//Debug.DrawRay(cameraMoveTarget, cameraDirection * maxDistance, Color.blue);
	//Debug.DrawRay(cameraMoveTarget, cameraDirection * minDistance, Color.red);
	
/*	if (cameraNode.transform.position.y > cameraMoveTarget.y) {
		if (Mathf.Abs(cameraDelta.x) * Mathf.Abs(cameraDelta.x) + Mathf.Abs(cameraDelta.y) * Mathf.Abs(cameraDelta.y) > minDistance * minDistance) {		
			cameraDirection.y -= playerSize;
			if (cameraNode.transform.position.y < cameraMoveTarget.y) {
				cameraNode.transform.position.y = cameraMoveTarget.y + 0.1;
			}
			cameraDirection = cameraDirection.normalized;
			cameraNode.transform.position = Vector3.Lerp(cameraNode.transform.position, cameraMoveTarget + (cameraDirection * minDistance), 0.01);
		}
	}*/
	if (Mathf.Abs(cameraDelta.magnitude) > maxDistance) {
		Debug.Log("Pulling camera in");
		//cameraNode.transform.position = Vector3.Lerp(cameraNode.transform.position, cameraMoveTarget + (cameraDirection * maxDistance), 0.05);
		cameraNode.transform.position = cameraMoveTarget + (cameraDirection * maxDistance);
	}
}
function moveCamera() {
	cameraObject.transform.position = Vector3.Lerp(cameraObject.transform.position, cameraRaycast.transform.position, 0.05);
	cameraObject.transform.LookAt(cameraLook);
}

function scaleView() {
	var wheel = Input.GetAxis("Mouse ScrollWheel");
	if (wheel) {
		wheel *= -10;
		// Get the player size, accounting for scale of the player node
		var playerSize:double = GetComponent(SphereCollider).radius * averageVectorValue(transform.localScale);
		maxDistance = maxDistance + playerSize * wheel;
		if (maxDistance > 25 * playerSize) {
			maxDistance = 25 * playerSize;
		}
		if (maxDistance < 4 * playerSize) {
			maxDistance = 4 * playerSize;
		} 	
		minDistance = maxDistance - playerSize * 3;
	}
}

var lastPosition:Vector3 = new Vector3(0,0,0);
function Update () {
	scaleView();
	rotateView();
	pushCameraBack();
	limitCameraDistance();
	//keepCameraAbovePlayer();
	orientRunnerAndLook();
	clipCameraToObjects();
	moveCamera();

}


