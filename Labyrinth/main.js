var Labyrinth;
(function (Labyrinth) {
    var ƒ = FudgeCore;
    let root;
    let environment; // = new NeigePlattorm;
    let level1;
    let moveables;
    let ball;
    let cmpRigidbodyBall;
    let floor1;
    let floor01;
    let floor02;
    let camPosition = new ƒ.Vector3(1, 10, 2);
    let cmpRigidbodyEnv;
    let barriers;
    let cmpRigidbodyBarrier;
    let cmpRigidbodyFloor01;
    let fixplate;
    let ballBearing;
    let cmpRigidBearing;
    let sphericalJoint;
    let environmentTransform;
    let cmpCamera = new ƒ.ComponentCamera();
    let viewport = new ƒ.Viewport();
    window.addEventListener("load", init);
    function init(_event) {
        let dialog = document.querySelector("dialog");
        dialog.addEventListener("click", function () {
            dialog.close();
            startInteractiveViewport();
        });
        dialog.showModal();
        ƒ.Physics.settings.debugDraw = true;
        ƒ.Physics.initializePhysics();
        ƒ.Physics.world.setSolverIterations(1000);
        ƒ.Physics.settings.defaultRestitution = 0.3;
        ƒ.Physics.settings.defaultFriction = 0.8;
        ƒ.Debug.log("Project:", ƒ.Project.resources);
    }
    async function startInteractiveViewport() {
        // load resources referenced in the link-tag
        await ƒ.Project.loadResourcesFromHTML();
        ƒ.Debug.log("Project:", ƒ.Project.resources);
        // pick the graph to show
        root = ƒ.Project.resources["Graph|2021-05-30T21:24:22.133Z|16415"];
        ƒ.Debug.log("Graph:", root);
        // setup the viewport
        let canvas = document.querySelector("canvas");
        viewport.initialize("InteractiveViewport", root, cmpCamera, canvas);
        ƒ.Debug.log("Viewport:", viewport);
        createRigidBodies();
        settingUpJoints();
        ƒ.Physics.adjustTransforms(root, true);
        // hide the cursor when interacting, also suppressing right-click menu
        canvas.addEventListener("mousedown", canvas.requestPointerLock);
        canvas.addEventListener("mouseup", function () {
            document.exitPointerLock();
        });
        // make the camera interactive (complex method in FudgeAid)
        FudgeAid.Viewport.expandCameraToInteractiveOrbit(viewport);
        // setup audio
        setUpCam();
        let cmpListener = new ƒ.ComponentAudioListener();
        //  cmpCamera.getContainer().addComponent(cmpListener);
        ƒ.AudioManager.default.listenWith(cmpListener);
        ƒ.AudioManager.default.listenTo(root);
        ƒ.Debug.log("Audio:", ƒ.AudioManager.default);
        // draw viewport once for immediate feedback
        viewport.draw();
        canvas.dispatchEvent(new CustomEvent("interactiveViewportStarted", {
            bubbles: true,
            detail: viewport
        }));
        // environment.addComponent(new ƒ.ComponentTransform);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        Labyrinth.Gui.start();
        ƒ.Loop.start();
    }
    function update(_event) {
        ƒ.Physics.world.simulate(ƒ.Loop.timeFrameReal / 1000);
        ƒ.Physics.settings.debugDraw = true;
        document.addEventListener("keydown", hndKey);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
            cmpRigidbodyFloor01.rotateBody(ƒ.Vector3.Z(-10));
        // console.log(_event);
        // let neigbarX: boolean = false;
        // if (environment.mtxWorld.rotation.x < 15 && environment.mtxWorld.rotation.x > -15)
        //   neigbarX = true;
        // let neigbarZ: boolean = false;
        // if (environment.mtxWorld.rotation.z < 15 && environment.mtxWorld.rotation.z > -15)
        //   neigbarZ = true;
        // if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A]) && (neigbarX == true)) {
        //   cmpRigidbodyEnv.rotateBody(ƒ.Vector3.X((-45 / ƒ.Loop.timeFrameGame) / 10));
        //   console.log(environment.mtxWorld.rotation.toString());
        //   //console.log(environment.mtxWorld.rotation.toString());
        //   gameState.level--;
        // }
        // if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D]) && (neigbarX == true)) {
        //   cmpRigidbodyEnv.rotateBody(ƒ.Vector3.X((45 / ƒ.Loop.timeFrameGame) / 10));
        // }
        // if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W]) && (neigbarZ == true)) {
        //   //environment.mtxLocal.rotateZ((-45 / ƒ.Loop.timeFrameGame) / 10);
        //   cmpRigidbodyEnv.rotateBody(ƒ.Vector3.Z((-45 / ƒ.Loop.timeFrameGame) / 10));
        //   console.log(environment);
        //   // cmpRigidbodyBall.applyForce(ƒ.Vector3.Y(50));
        //   gameState.level++;
        //   //console.log(cmpCamera.mtxPivot);
        // }
        // if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S]) && (neigbarX == true)) {
        //   //environment.mtxLocal.rotateZ((-45 / ƒ.Loop.timeFrameGame) / 10);
        //   cmpRigidbodyEnv.rotateBody(ƒ.Vector3.Z((45 / ƒ.Loop.timeFrameGame) / 10));
        // }
        viewport.draw();
    }
    function setUpCam() {
        cmpCamera.mtxPivot.translate(new ƒ.Vector3(15, 40, -10));
        cmpCamera.mtxPivot.lookAt(ƒ.Vector3.ZERO());
    }
    function createRigidBodies() {
        environment = root.getChildrenByName("environment")[0];
        ballBearing = root.getChildrenByName("ballBearing")[0];
        fixplate = root.getChildrenByName("fixplate")[0];
        floor01 = environment.getChildrenByName("floor01")[0];
        barriers = floor01.getChildrenByName("barriers")[0];
        level1 = floor01.getChildrenByName("level1")[0];
        floor02 = level1.getChildrenByName("floor02")[0];
        moveables = root.getChildrenByName("moveables")[0];
        ball = moveables.getChildrenByName("ball")[0];
        let cmpRigidbodyFixplate = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
        fixplate.addComponent(cmpRigidbodyFixplate);
        cmpRigidBearing = new ƒ.ComponentRigidbody(3, ƒ.PHYSICS_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.DEFAULT);
        ballBearing.addComponent(cmpRigidBearing);
        cmpRigidbodyFloor01 = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
        floor01.addComponent(cmpRigidbodyFloor01);
        let cmpRigidbodyFloor02 = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
        floor02.addComponent(cmpRigidbodyFloor02);
        for (let node of barriers.getChildren()) {
            cmpRigidbodyBarrier = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
            node.addComponent(cmpRigidbodyBarrier);
        }
        let cmpRigidbodyBall = new ƒ.ComponentRigidbody(1, ƒ.PHYSICS_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.SPHERE, ƒ.PHYSICS_GROUP.GROUP_2);
        cmpRigidbodyBall.restitution = 0.8;
        cmpRigidbodyBall.friction = 2.5;
        ball.addComponent(cmpRigidbodyBall);
        // cmpRigidbodyEnv = new ƒ.ComponentRigidbody(
        //   4,
        //   ƒ.PHYSICS_TYPE.DYNAMIC,
        //   ƒ.COLLIDER_TYPE.CUBE,
        //   ƒ.PHYSICS_GROUP.GROUP_1
        // );
        // environment.addComponent(cmpRigidbodyEnv);
    }
    //let barrierJoint: ƒ.ComponentJointRevolute;
    function settingUpJoints() {
        sphericalJoint = new ƒ.ComponentJointSpherical(cmpRigidBearing, cmpRigidbodyFloor01);
        // environmentTransform.getContainer().addComponent(sphericalJoint);
        floor01.addComponent(sphericalJoint);
        sphericalJoint.springDamping = 1;
        sphericalJoint.springFrequency = 1;
        //  ƒ.Physics.adjustTransforms(environment, true);
        // for (let barrierChilds of barriers.getChildren()) {
        //   barrierJoint = new ƒ.ComponentJointRevolute(cmpRigidbodyEnv, barrierChilds.getComponent(ƒ.ComponentRigidbody));
        //   barrierJoint.motorLimitLower = 1;
        //   barrierJoint.motorLimitUpper = 0;
        //   barrierChilds.addComponent(barrierJoint);
        // let barrierFloorJoint: ƒ.ComponentJointRevolute = new ƒ.ComponentJointRevolute(floor1.getChild(0).getComponent(ƒ.ComponentRigidbody), barrierChilds.getComponent(ƒ.ComponentRigidbody));
        // barrierFloorJoint.motorLimitLower = 1;
        // barrierFloorJoint.motorLimitUpper = 0;
        // barrierChilds.addComponent(barrierFloorJoint);
        // }
        // let floorJoint: ƒ.ComponentJointRevolute = new ƒ.ComponentJointRevolute(floor1.getChild(1).getComponent(ƒ.ComponentRigidbody), floor1.getChild(0).getComponent(ƒ.ComponentRigidbody));
        // floorJoint.motorLimitLower = 2;
        // floorJoint.motorLimitUpper = 1;
        // floor1.getChild(0).addComponent(floorJoint);
        // // for (let floor1childs of floor1.getChildren()) {
        // let floor1Joint: ƒ.ComponentJointRevolute = new ƒ.ComponentJointRevolute(floor1.getComponent(ƒ.ComponentRigidbody), floor1.getChild(0).getComponent(ƒ.ComponentRigidbody));
        // floor1Joint.motorLimitLower = 2;
        // floor1Joint.motorLimitUpper = 1;
        // floor1.getChild(0).addComponent(floor1Joint);
        // // }
        // let fixFloorJoint: ƒ.ComponentJointRevolute = new ƒ.ComponentJointRevolute(cmpRigidbodyEnv, floor1.getChild(1).getComponent(ƒ.ComponentRigidbody));
        // fixFloorJoint.motorLimitLower = 2;
        // floorJoint.motorLimitUpper = 1;
        // floor1.getChild(1).addComponent(fixFloorJoint);
        // let barrierFloor12Joint: ƒ.ComponentJointRevolute = new ƒ.ComponentJointRevolute(floor12.getComponent(ƒ.ComponentRigidbody), barriers.getChild(0).getComponent(ƒ.ComponentRigidbody));
        // barrierFloor12Joint.motorLimitLower = 2;
        // barrierFloor12Joint.motorLimitUpper = 1;
        // barriers.getChild(0).addComponent(barrierFloor12Joint);
    }
    let stepWidth = 0.1;
    function hndKey(_event) {
        let horizontal = 0;
        let vertical = 0;
        let height = 0;
        if (_event.code == ƒ.KEYBOARD_CODE.A) {
            horizontal -= 1 * stepWidth;
        }
        if (_event.code == ƒ.KEYBOARD_CODE.D) {
            horizontal += 1 * stepWidth;
        }
        if (_event.code == ƒ.KEYBOARD_CODE.W) {
            vertical -= 1 * stepWidth;
        }
        if (_event.code == ƒ.KEYBOARD_CODE.S) {
            vertical += 1 * stepWidth;
        }
        if (_event.code == ƒ.KEYBOARD_CODE.Q) {
            height += 1 * stepWidth;
        }
        if (_event.code == ƒ.KEYBOARD_CODE.E) {
            height -= 1 * stepWidth;
        }
        //let pos: ƒ.Vector3 = environmentTransform.mtxLocal.translation;
        //pos.add(new ƒ.Vector3(horizontal, height, vertical));
        //  environmentTransform.mtxLocal.translation = pos;
        if (_event.code == ƒ.KEYBOARD_CODE.G) {
            console.log(sphericalJoint.connectedRigidbody);
            sphericalJoint.connectedRigidbody.applyAngularImpulse(new ƒ.Vector3(0, 0, 1 * 100));
            // .applyForce(new ƒ.Vector3(0, 0, 1 * 100));
            console.log("G is pressed");
        }
        if (_event.code == ƒ.KEYBOARD_CODE.A) {
            cmpRigidbodyEnv.rotateBody(ƒ.Vector3.X((-45 / ƒ.Loop.timeFrameGame) / 10));
        }
    }
})(Labyrinth || (Labyrinth = {}));
//# sourceMappingURL=main.js.map