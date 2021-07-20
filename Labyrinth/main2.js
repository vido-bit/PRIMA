var Labyrinth;
(function (Labyrinth) {
    var ƒ = FudgeCore;
    let root;
    let environment; // = new NeigePlattorm;
    let level1;
    let level2;
    let level3;
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
    let cmpRigidbodyLevel1;
    let cmpRigidbodyLevel2;
    let cmpRigidbodyLevel3;
    let activeLevel1;
    let activeRgdbodyLevel1;
    let activeLevel2;
    let activeRgdbodyLevel2;
    let activeLevel3;
    let activeRgdbodyLevel3;
    let cmpRgdBodies;
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
        ƒ.Physics.settings.defaultRestitution = 0.1;
        ƒ.Physics.settings.defaultFriction = 0.1;
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
        createGeneralRigidBodies();
        // settingUpJoint();
        ƒ.Physics.adjustTransforms(root, true);
        // hide the cursor when interacting, also suppressing right-click menu
        // canvas.addEventListener("mousedown", canvas.requestPointerLock);
        // canvas.addEventListener("mouseup", function (): void {
        //     document.exitPointerLock();
        // });
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
        // canvas.dispatchEvent(
        //     new CustomEvent("interactiveViewportStarted", {
        //         bubbles: true,
        //         detail: viewport
        //     })
        // );
        // environment.addComponent(new ƒ.ComponentTransform);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        Labyrinth.Gui.start();
        ƒ.Loop.start();
    }
    function update(_event) {
        ƒ.Physics.world.simulate(ƒ.Loop.timeFrameReal / 1000);
        ƒ.Physics.settings.debugDraw = true;
        //  checkActiveLevelNodes();
        //    handleLevelSetup();
        if (Labyrinth.gameState.level == 1) {
            removeLevel1();
            // createLevel1();
        }
        if (Labyrinth.gameState.level == 2) {
            createLevel1();
        }
        if (environment.mtxLocal.rotation.z > -15) {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
                environment.mtxLocal.rotateZ((-45 / ƒ.Loop.timeFrameGame) / 10);
            }
        }
        if (environment.mtxLocal.rotation.z < 15) {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
                environment.mtxLocal.rotateZ((45 / ƒ.Loop.timeFrameGame) / 10);
            }
        }
        if (environment.mtxLocal.rotation.x > -15) {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
                environment.mtxLocal.rotateX((-45 / ƒ.Loop.timeFrameGame) / 10);
                //cmpRigidbodyEnv.rotateBody(ƒ.Vector3.Z((-45 / ƒ.Loop.timeFrameGame) / 10));
                // cmpRigidbodyBall.applyForce(ƒ.Vector3.Y(50));
            }
        }
        if (environment.mtxLocal.rotation.x < 15) {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
                //   cmpRigidbodyEnv.mtxPivot.rotateZ((45 / ƒ.Loop.timeFrameGame) / 10);
                environment.mtxLocal.rotateX((45 / ƒ.Loop.timeFrameGame) / 10);
                console.log(barrier01.mtxLocal.getY().y.toString());
            }
        }
        viewport.draw();
    }
    function setUpCam() {
        cmpCamera.mtxPivot.translate(new ƒ.Vector3(7, 60, 15));
        cmpCamera.mtxPivot.lookAt(ƒ.Vector3.ZERO());
    }
    function createGeneralRigidBodies() {
        environment = root.getChildrenByName("environment")[0];
        let basicFloor = environment.getChildrenByName("basicFloor")[0];
        let barriers = basicFloor.getChildrenByName("barriers")[0];
        barrier01 = barriers.getChildrenByName("barrier01")[0];
        barrier02 = barriers.getChildrenByName("barrier02")[0];
        barrier03 = barriers.getChildrenByName("barrier03")[0];
        barrier04 = barriers.getChildrenByName("barrier04")[0];
        level1 = basicFloor.getChildrenByName("level1")[0];
        level2 = basicFloor.getChildrenByName("level2")[0];
        level3 = basicFloor.getChildrenByName("level3")[0];
        moveables = root.getChildrenByName("moveables")[0];
        ball = moveables.getChildrenByName("ball")[0];
        let cmpRigidbodyFloor01 = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
        basicFloor.addComponent(cmpRigidbodyFloor01);
        for (let node of barriers.getChildren()) {
            let cmpRigidbodyBarrier = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
            node.addComponent(cmpRigidbodyBarrier);
        }
        let cmpRigidbodyBall = new ƒ.ComponentRigidbody(1, ƒ.PHYSICS_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.SPHERE, ƒ.PHYSICS_GROUP.GROUP_2);
        cmpRigidbodyBall.restitution = 0.1;
        cmpRigidbodyBall.friction = 10;
        cmpRigidbodyBall.mass = 10;
        ball.addComponent(cmpRigidbodyBall);
        for (let node of level1.getChildren()) {
            cmpRigidbodyLevel1 = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
            node.addComponent(cmpRigidbodyLevel1);
        }
        for (let node of level2.getChildren()) {
            cmpRigidbodyLevel2 = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
            node.addComponent(cmpRigidbodyLevel2);
        }
        for (let node of level3.getChildren()) {
            cmpRigidbodyLevel3 = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
            node.addComponent(cmpRigidbodyLevel3);
        }
    }
    function checkActiveLevelNodes() {
        for (let node of level1.getChildren()) {
            if (node.isActive)
                activeLevel1 = true;
            else
                activeLevel1 = false;
        }
        if (cmpRigidbodyLevel1.isActive)
            activeRgdbodyLevel1 = true;
        else
            activeRgdbodyLevel2 = false;
        for (let node of level2.getChildren()) {
            if (node.isActive)
                activeLevel2 = true;
            else
                activeLevel2 = false;
        }
        if (cmpRigidbodyLevel2.isActive)
            activeRgdbodyLevel2 = true;
        else
            activeRgdbodyLevel2 = false;
        for (let node of level3.getChildren()) {
            if (node.isActive)
                activeLevel3 = true;
            else
                activeLevel3 = false;
        }
        if (cmpRigidbodyLevel3.isActive)
            activeRgdbodyLevel3 = true;
        else
            activeRgdbodyLevel3 = false;
    }
    function handleLevelSetup() {
        if (Labyrinth.gameState.level == 1) {
            if (activeLevel2)
                removeLevel2();
            if (activeLevel3)
                removeLevel3();
            if (!activeLevel1)
                createLevel1();
        }
        if (Labyrinth.gameState.level == 2) {
            if (activeLevel1)
                removeLevel1();
            if (activeLevel3)
                removeLevel3();
            if (!activeLevel2)
                createLevel2();
        }
        if (Labyrinth.gameState.level == 3) {
            if (activeLevel1)
                removeLevel1();
            if (activeLevel2)
                removeLevel2();
            if (!activeLevel3)
                createLevel3();
        }
    }
    function createLevel1() {
        // let level1Mtr: ƒ.Material = new ƒ.Material("Level1", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(40, 240, 240, 0.6)));
        // let innerBarrier01: ƒ.Node = createCompleteNode("innerBarrier", level1Mtr, new ƒ.MeshCube());
        // level1.appendChild(innerBarrier01);
        // innerBarrier01.getComponent(ƒ.ComponentTransform).mtxLocal.scale(new ƒ.Vector3(0.07, 3, 0.4));
        // // innerBarrier01.getComponent(ƒ.ComponentTransform).mtxLocal.translate(new ƒ.Vector3(-0.5, 0.5, 0.25));
        // let cmpRigidBarrier: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(1,
        //     ƒ.PHYSICS_TYPE.KINEMATIC,
        //     ƒ.COLLIDER_TYPE.CUBE,
        //     ƒ.PHYSICS_GROUP.GROUP_1
        // );
        // innerBarrier01.addComponent(cmpRigidBarrier);
        // console.log(innerBarrier01);
        // ƒ.Physics.adjustTransforms(root, true);
        for (let node of level1.getChildren()) {
            node.activate(true);
            let cmpRigidBarrier = new ƒ.ComponentRigidbody(1, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
            if (!node.getComponent(ƒ.ComponentRigidbody))
                node.addComponent(cmpRigidBarrier);
            ƒ.Physics.adjustTransforms(root, true);
        }
    }
    function createLevel2() {
        for (let node of level2.getChildren()) {
            node.addComponent(node.getComponent(ƒ.ComponentRigidbody));
            node.activate(true);
        }
    }
    function createLevel3() {
        for (let node of level3.getChildren()) {
            node.addComponent(node.getComponent(ƒ.ComponentRigidbody));
            node.activate(true);
        }
        level1.removeAllChildren();
    }
    function removeLevel1() {
        for (let node of level1.getChildren()) {
            if (node.getComponent(ƒ.ComponentRigidbody) != null)
                node.removeComponent(node.getComponent(ƒ.ComponentRigidbody));
            node.activate(false);
        }
    }
    function removeLevel2() {
        for (let node of level2.getChildren()) {
            node.removeComponent(node.getComponent(ƒ.ComponentRigidbody));
        }
        level2.removeAllChildren();
    }
    function removeLevel3() {
        for (let node of level3.getChildren()) {
            node.removeComponent(node.getComponent(ƒ.ComponentRigidbody));
        }
        level3.removeAllChildren();
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
    function createCompleteNode(_name, _material, _mesh) {
        let node = new ƒ.Node(_name);
        let cmpMesh = new ƒ.ComponentMesh(_mesh);
        let cmpMaterial = new ƒ.ComponentMaterial(_material);
        let cmpTransform = new ƒ.ComponentTransform();
        // let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(_mass, _physicsType, _colType, _group);
        // cmpRigidbody.restitution = 0.2;
        // cmpRigidbody.friction = 0.8;
        node.addComponent(cmpMesh);
        node.addComponent(cmpMaterial);
        node.addComponent(cmpTransform);
        // node.addComponent(cmpRigidbody);
        return node;
    }
})(Labyrinth || (Labyrinth = {}));
//# sourceMappingURL=main2.js.map