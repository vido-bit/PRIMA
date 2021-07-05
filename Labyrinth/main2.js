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
    let camPosition = new ƒ.Vector3(1, 10, 2);
    let cmpRigidbodyEnv = new ƒ.ComponentRigidbody(0, ƒ.PHYSICS_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_2);
    let cmpCamera = new ƒ.ComponentCamera();
    let viewport = new ƒ.Viewport();
    let ballBearing;
    let cmpRigidBearing;
    let sphericalJoint;
    let environmentTransform;
    let barrier01;
    let barrier02;
    let barrier03;
    let barrier04;
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
        moveables = root.getChildrenByName("moveables")[0];
        ball = moveables.getChildrenByName("ball")[0];
        ballBearing = root.getChildrenByName("ballbearing")[0];
        createRigidBodies();
        // settingUpJoint();
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
        // hndKey(this);
        // let neigbarX: boolean = false;
        // if (environment.mtxWorld.rotation.x < 15 && environment.mtxWorld.rotation.x > -15)
        //   neigbarX = true;
        // let neigbarZ: boolean = false;
        // if (environment.mtxWorld.rotation.z < 15 && environment.mtxWorld.rotation.z > -15)
        //   neigbarZ = true;
        if (environment.mtxLocal.rotation.x > -12) {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
                environment.mtxLocal.rotateX((-45 / ƒ.Loop.timeFrameGame) / 10);
                Labyrinth.gameState.level--;
                console.log(environment.mtxLocal.getX());
            }
        }
        if (environment.mtxLocal.rotation.x < 12) {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
                environment.mtxLocal.rotateX((45 / ƒ.Loop.timeFrameGame) / 10);
            }
        }
        if (environment.mtxLocal.rotation.z > -12) {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
                environment.mtxLocal.rotateZ((-45 / ƒ.Loop.timeFrameGame) / 10);
                //cmpRigidbodyEnv.rotateBody(ƒ.Vector3.Z((-45 / ƒ.Loop.timeFrameGame) / 10));
                // cmpRigidbodyBall.applyForce(ƒ.Vector3.Y(50));
                Labyrinth.gameState.level++;
            }
        }
        if (environment.mtxLocal.rotation.z < 12) {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
                //   cmpRigidbodyEnv.mtxPivot.rotateZ((45 / ƒ.Loop.timeFrameGame) / 10);
                environment.mtxLocal.rotateZ((45 / ƒ.Loop.timeFrameGame) / 10);
                console.log(barrier01.mtxLocal.getY().y.toString());
            }
        }
        viewport.draw();
    }
    function setUpCam() {
        cmpCamera.mtxPivot.translate(new ƒ.Vector3(15, 40, -10));
        cmpCamera.mtxPivot.lookAt(ƒ.Vector3.ZERO());
    }
    function createRigidBodies() {
        environment = root.getChildrenByName("environment")[0];
        ballBearing = root.getChildrenByName("ballBearing")[0];
        let fixplate = root.getChildrenByName("fixplate")[0];
        let floor01 = environment.getChildrenByName("floor01")[0];
        let barriers = floor01.getChildrenByName("barriers")[0];
        barrier01 = barriers.getChildrenByName("barrier01")[0];
        barrier02 = barriers.getChildrenByName("barrier02")[0];
        barrier03 = barriers.getChildrenByName("barrier03")[0];
        barrier04 = barriers.getChildrenByName("barrier04")[0];
        level1 = floor01.getChildrenByName("level1")[0];
        let floor02 = level1.getChildrenByName("floor02")[0];
        moveables = root.getChildrenByName("moveables")[0];
        ball = moveables.getChildrenByName("ball")[0];
        // let cmpRigidbodyFixplate: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(
        //     2,
        //     ƒ.PHYSICS_TYPE.STATIC,
        //     ƒ.COLLIDER_TYPE.CUBE,
        //     ƒ.PHYSICS_GROUP.GROUP_2
        // );
        // fixplate.addComponent(cmpRigidbodyFixplate);
        cmpRigidBearing = new ƒ.ComponentRigidbody(1, ƒ.PHYSICS_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.DEFAULT);
        ballBearing.addComponent(cmpRigidBearing);
        let cmpRigidbodyFloor01 = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
        floor01.addComponent(cmpRigidbodyFloor01);
        let cmpRigidbodyFloor02 = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
        floor02.addComponent(cmpRigidbodyFloor02);
        for (let node of barriers.getChildren()) {
            let cmpRigidbodyBarrier = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
            node.addComponent(cmpRigidbodyBarrier);
            // barrier01.addComponent(cmpRigidbodyBarrier);
            // barrier02.addComponent(cmpRigidbodyBarrier);
            // barrier03.addComponent(cmpRigidbodyBarrier);
            // barrier04.addComponent(cmpRigidbodyBarrier);
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
    // cmpRigidBearing = new ƒ.ComponentRigidbody(
    //     1, ƒ.PHYSICS_TYPE.STATIC,
    //     ƒ.COLLIDER_TYPE.SPHERE,
    //     ƒ.PHYSICS_GROUP.DEFAULT
    // );
    // ballBearing.addComponent(cmpRigidBearing);
    // let cmpRigidbodyFloor11: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(
    //     2,
    //     ƒ.PHYSICS_TYPE.STATIC,
    //     ƒ.COLLIDER_TYPE.CUBE,
    //     ƒ.PHYSICS_GROUP.DEFAULT
    // );
    // let cmpRigidbodyFloor12: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(
    //     2,
    //     ƒ.PHYSICS_TYPE.STATIC,
    //     ƒ.COLLIDER_TYPE.CUBE,
    //     ƒ.PHYSICS_GROUP.DEFAULT
    // );
    // environment = root.getChild(0);
    // environment.addComponent(cmpRigidbodyEnv);
    // //environmentTransform = environment.getComponent(ƒ.ComponentTransform);
    // window.addEventListener("load", init);
    // level1 = environment.getChildrenByName("level1")[0];
    // floor1 = level1.getChildrenByName("floor1")[0];
    // let floor11: ƒ.Node = floor1.getChildrenByName("floor11")[0];
    // floor11.addComponent(cmpRigidbodyFloor11);
    // let floor12: ƒ.Node = floor1.getChildrenByName("floor12")[0];
    // floor12.addComponent(cmpRigidbodyFloor12);
    // let barriers: ƒ.Node = environment.getChildrenByName("barriers")[0];
    // for (let node of barriers.getChildren()) {
    //     let cmpRigidbodyBarrier: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(
    //         2,
    //         ƒ.PHYSICS_TYPE.STATIC,
    //         ƒ.COLLIDER_TYPE.CUBE,
    //         ƒ.PHYSICS_GROUP.GROUP_2
    //     );
    //     node.addComponent(cmpRigidbodyBarrier);
    //     //  console.log(node.name, node.cmpTransform?.mtxLocal.toString());
    // }
    // for (let node of moveables.getChildren()) {
    //     cmpRigidbodyBall = new ƒ.ComponentRigidbody(
    //         1,
    //         ƒ.PHYSICS_TYPE.STATIC,
    //         ƒ.COLLIDER_TYPE.SPHERE,
    //         ƒ.PHYSICS_GROUP.GROUP_2
    //     );
    //     cmpRigidbodyBall.restitution = 0.8;
    //     cmpRigidbodyBall.friction = 2.5;
    //     node.addComponent(cmpRigidbodyBall);
    // }
    function settingUpJoint() {
        sphericalJoint = new ƒ.ComponentJointSpherical(cmpRigidBearing, cmpRigidbodyEnv);
        // environmentTransform.getContainer().addComponent(sphericalJoint);
        environment.addComponent(sphericalJoint);
        sphericalJoint.springDamping = 0.1;
        sphericalJoint.springFrequency = 1;
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
        let pos = environmentTransform.mtxLocal.translation;
        pos.add(new ƒ.Vector3(horizontal, height, vertical));
        environmentTransform.mtxLocal.translation = pos;
        if (_event.code == ƒ.KEYBOARD_CODE.G) {
            sphericalJoint.connectedRigidbody.applyTorque(new ƒ.Vector3(0, 1 * 100, 0));
        }
    }
})(Labyrinth || (Labyrinth = {}));
//# sourceMappingURL=main2.js.map