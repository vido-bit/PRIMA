var PhysicsScene;
(function (PhysicsScene) {
    var ƒ = FudgeCore;
    let root;
    window.addEventListener("load", init);
    let viewport; // = new ƒ.Viewport();
    //   let hierarchy: ƒ.Node;
    let environment = new Array();
    let player;
    let ball;
    let ballBody;
    let cmpCamera;
    let isLocked = false;
    // let isGrounded: boolean;
    let canvas;
    let camBufferX = 0;
    let camBufferY = 0;
    const camSpeed = -0.15;
    let forwardMovement = 0;
    let sideMovement = 0;
    let audio = new ƒ.Audio("lo-fi-spahnwave-beats-to-relax_get-healthcare-systems-in-very-good-shape-to.mp3");
    let audioNode = new ƒ.Node("Audio");
    async function init(_event) {
        //   ƒ.Physics.settings.debugDraw = true;
        ƒ.Physics.initializePhysics();
        ƒ.Physics.world.setSolverIterations(1000);
        ƒ.Physics.settings.defaultRestitution = 0.3;
        ƒ.Physics.settings.defaultFriction = 0.8;
        await ƒ.Project.loadResourcesFromHTML();
        ƒ.Debug.log("Project:", ƒ.Project.resources);
        // pick the graph to show
        root = ƒ.Project.resources["Graph|2021-04-27T14:51:00.597Z|11409"];
        //root = <ƒ.Graph>ƒ.Project.resources["Graph|2021-04-27T14:37:53.620Z|93013"];
        ƒ.Debug.log("Graph:", root);
        canvas = document.querySelector("canvas");
        // hierarchy = new ƒ.Node("Scene");
        // player = graph.getChildrenByName("board")[0];
        // console.log(player);
        // ball = graph.getChildrenByName("ball")[0];
        cmpCamera = new ƒ.ComponentCamera();
        player = new PhysicsScene.Player(cmpCamera);
        root.addChild(player);
        createRigidBodies();
        setUpAudio();
        document.addEventListener("pointerlockchange", pointerLockChange);
        document.addEventListener("mousedown", onMouseDown);
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("keydown", startPlayerMovement);
        document.addEventListener("keyup", stopPlayerMovement);
        //cmpCamera.mtxPivot.lookAt(new ƒ.Vector3(0, 0, 0));
        ƒ.Physics.adjustTransforms(root, true);
        viewport = new ƒ.Viewport;
        viewport.initialize("Viewport", root, cmpCamera, canvas);
        viewport.draw();
        ƒ.Physics.adjustTransforms(root, true);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start();
        //  ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 120);
        //   ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    }
    function update(_event) {
        ƒ.Physics.world.simulate(ƒ.Loop.timeFrameReal / 1000);
        //lookAt(player.mtxLocal.translation);
        updateCam(camBufferX, camBufferY);
        player.move(forwardMovement, sideMovement);
        console.log(player.cmpRigid.getPosition().y.toString());
        // if (player.cmpRigid.getPosition().y >= 2) {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.E])) {
            tryGrab();
        }
        //  if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.Q])) {
        //       releaseItem();
        //   }
        viewport.draw();
        ƒ.Physics.settings.debugDraw = true;
    }
    function createRigidBodies() {
        let level = root.getChildrenByName("level")[0];
        for (let node of level.getChildren()) {
            let cmpRigidbody = new ƒ.ComponentRigidbody(0, ƒ.PHYSICS_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.DEFAULT);
            node.addComponent(cmpRigidbody);
            //   console.log(node.name, node.cmpTransform?.mtxLocal.toString());
        }
        let moveables = root.getChildrenByName("moveables")[0];
        for (let node of moveables.getChildren()) {
            let cmpRigidbody = new ƒ.ComponentRigidbody(1, ƒ.PHYSICS_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.SPHERE, ƒ.PHYSICS_GROUP.DEFAULT);
            cmpRigidbody.restitution = 0.8;
            cmpRigidbody.friction = 2.5;
            node.addComponent(cmpRigidbody);
            // console.log(node.name, node.cmpTransform?.mtxLocal.toString());
        }
    }
    function tryGrab() {
        let mtxPlayer = player.cmpRigid.getContainer().mtxLocal;
        // let rayHit: ƒ.RayHitInfo = ƒ.Physics.raycast(mtxAvatar.translation, mtxAvatar.getZ(), 4, ƒ.PHYSICS_GROUP.DEFAULT);
        // console.log(rayHit.hit);
        let moveables = root.getChildrenByName("moveables")[0];
        for (let node of moveables.getChildren()) {
            let distance = ƒ.Vector3.DIFFERENCE(mtxPlayer.translation, node.mtxLocal.translation);
            if (distance.magnitude > 2)
                continue;
            pickup(node);
            break;
        }
    }
    function pickup(_node) {
        let playerContainer = player.cmpRigid.getContainer();
        playerContainer.appendChild(_node);
        _node.mtxLocal.set(ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(1.5)));
        _node.getComponent(ƒ.ComponentRigidbody).physicsType = ƒ.PHYSICS_TYPE.KINEMATIC;
    }
    function releaseItem() {
        let mtxPlayer = player.cmpRigid.getContainer().mtxLocal;
        // let rayHit: ƒ.RayHitInfo = ƒ.Physics.raycast(mtxAvatar.translation, mtxAvatar.getZ(), 4, ƒ.PHYSICS_GROUP.DEFAULT);
        // console.log(rayHit.hit);
        let moveables = root.getChildrenByName("moveables")[0];
        for (let node of moveables.getChildren()) {
            //    let distance: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(mtxPlayer.translation, node.mtxLocal.translation);
            //    if (distance.magnitude > 2)
            //       continue;
            dropOff(node);
            //   break;
        }
    }
    function dropOff(_node) {
        let playerContainer = player.cmpRigid.getContainer();
        playerContainer.removeChild(_node);
        _node.mtxLocal.set(ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(-1.5)));
        // _node.getComponent(ƒ.ComponentRigidbody).physicsType = ƒ.PHYSICS_TYPE.KINEMATIC;
    }
    function startPlayerMovement(_event) {
        console.log(player.direction);
        //   player.addComponent(new ƒ.ComponentTransform());
        if (_event.code == ƒ.KEYBOARD_CODE.W) {
            forwardMovement = 1;
        }
        if (_event.code == ƒ.KEYBOARD_CODE.S) {
            forwardMovement = -1;
        }
        if (_event.code == ƒ.KEYBOARD_CODE.A) {
            sideMovement = -1;
        }
        if (_event.code == ƒ.KEYBOARD_CODE.D) {
            sideMovement = 1;
        }
        if (_event.code == ƒ.KEYBOARD_CODE.SPACE) {
            if (player.cmpRigid.getPosition().y <= 2) {
                player.cmpRigid.applyLinearImpulse(new ƒ.Vector3(0, player.jumpForce, 0));
            }
        }
    }
    function stopPlayerMovement(_event) {
        //   player.addComponent(new ƒ.ComponentTransform());
        if (_event.code == ƒ.KEYBOARD_CODE.W)
            forwardMovement = 0;
        if (_event.code == ƒ.KEYBOARD_CODE.S)
            forwardMovement = 0;
        if (_event.code == ƒ.KEYBOARD_CODE.A)
            sideMovement = 0;
        if (_event.code == ƒ.KEYBOARD_CODE.D)
            sideMovement = 0;
    }
    function pointerLockChange() {
        if (!document.pointerLockElement)
            isLocked = false;
        isLocked = true;
    }
    function onMouseDown() {
        if (isLocked == false)
            canvas.requestPointerLock();
    }
    function handleMouseMove(_event) {
        if (isLocked == true) {
            camBufferX += _event.movementX;
            camBufferY += _event.movementY;
        }
    }
    function updateCam(_x, _y) {
        player.camNode.mtxLocal.rotateZ(_y * camSpeed);
        player.camNode.mtxLocal.rotateY(_x * camSpeed, true);
        camBufferX = 0;
        camBufferY = 0;
    }
    function setUpAudio() {
        let cmpListener = new ƒ.ComponentAudioListener();
        cmpCamera.getContainer().addComponent(cmpListener);
        let cmpAudio = new ƒ.ComponentAudio(audio, false, false);
        audioNode.addComponent(cmpAudio);
        player.camNode.appendChild(audioNode);
        ƒ.AudioManager.default.listenWith(cmpListener);
        ƒ.AudioManager.default.listenTo(audioNode);
        ƒ.AudioManager.default.volume = 0.3;
        // ƒ.AudioManager.default.suspend();
    }
})(PhysicsScene || (PhysicsScene = {}));
//# sourceMappingURL=function.js.map