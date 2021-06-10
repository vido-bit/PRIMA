var Labyrinth;
(function (Labyrinth) {
    var ƒ = FudgeCore;
    let root;
    let environment;
    let level1;
    let moveables;
    let ball;
    let camPosition = new ƒ.Vector3(1, 10, 2);
    let cmpRigidbodyEnv = new ƒ.ComponentRigidbody(0, ƒ.PHYSICS_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_2);
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
        moveables = root.getChildrenByName("moveables")[0];
        ball = moveables.getChildrenByName("ball")[0];
        createRigidBodies();
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
        cmpCamera.getContainer().addComponent(cmpListener);
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
        viewport.draw();
        ƒ.Physics.settings.debugDraw = true;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
            //environment.mtxLocal.rotateZ((45 / ƒ.Loop.timeFrameGame) / 100);
            // cmpRigidbodyEnv.mtxPivot.rotateZ((45 / ƒ.Loop.timeFrameGame) / 10);
            level1.mtxLocal.rotateZ(45);
            console.log(environment.mtxLocal.getZ());
            Labyrinth.gameState.level--;
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
            environment.mtxLocal.rotateZ((-45 / ƒ.Loop.timeFrameGame) / 100);
            ball.mtxLocal.translateY(5);
            Labyrinth.gameState.level++;
            //console.log(cmpCamera.mtxPivot);
        }
    }
    function setUpCam() {
        cmpCamera.mtxPivot.translate(new ƒ.Vector3(45, 25, -8));
        cmpCamera.mtxPivot.lookAt(ƒ.Vector3.ZERO());
    }
    function createRigidBodies() {
        let cmpRigidbodyFloor11 = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.DEFAULT);
        let cmpRigidbodyFloor12 = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.DEFAULT);
        environment = root.getChildrenByName("environment")[0];
        //environment.addComponent(cmpRigidbodyEnv);
        level1 = environment.getChildrenByName("level1")[0];
        let floor1 = level1.getChildrenByName("floor1")[0];
        let floor11 = floor1.getChildrenByName("floor11")[0];
        floor11.addComponent(cmpRigidbodyFloor11);
        let floor12 = floor1.getChildrenByName("floor12")[0];
        floor12.addComponent(cmpRigidbodyFloor12);
        let barriers = environment.getChildrenByName("barriers")[0];
        for (let node of barriers.getChildren()) {
            let cmpRigidbodyBarrier = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_2);
            node.addComponent(cmpRigidbodyBarrier);
            //   console.log(node.name, node.cmpTransform?.mtxLocal.toString());
        }
        for (let node of moveables.getChildren()) {
            let cmpRigidbodyBall = new ƒ.ComponentRigidbody(1, ƒ.PHYSICS_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.SPHERE, ƒ.PHYSICS_GROUP.GROUP_2);
            cmpRigidbodyBall.restitution = 0.8;
            cmpRigidbodyBall.friction = 2.5;
            node.addComponent(cmpRigidbodyBall);
        }
        //  ƒ.Physics.adjustTransforms(root, true);
    }
})(Labyrinth || (Labyrinth = {}));
//# sourceMappingURL=main.js.map