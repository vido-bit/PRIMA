var Labyrinth;
(function (Labyrinth) {
    var ƒ = FudgeCore;
    let root;
    let environment;
    let cmpRigidbodyEnv = new ƒ.ComponentRigidbody(0, ƒ.PHYSICS_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_2);
    let viewport = new ƒ.Viewport();
    window.addEventListener("load", init);
    function init(_event) {
        let dialog = document.querySelector("dialog");
        dialog.addEventListener("click", function () {
            dialog.close();
            startInteractiveViewport();
        });
        dialog.showModal();
        //   ƒ.Physics.settings.debugDraw = true;
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
        let cmpCamera = new ƒ.ComponentCamera();
        let canvas = document.querySelector("canvas");
        viewport.initialize("InteractiveViewport", root, cmpCamera, canvas);
        ƒ.Debug.log("Viewport:", viewport);
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
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        environment.addComponent(new ƒ.ComponentTransform);
        Labyrinth.Gui.start();
        ƒ.Loop.start();
    }
    function update(_event) {
        ƒ.Physics.world.simulate(ƒ.Loop.timeFrameReal / 1000);
        viewport.draw();
        ƒ.Physics.settings.debugDraw = true;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
            environment.mtxLocal.rotateZ((45 / ƒ.Loop.timeFrameGame) / 10);
            cmpRigidbodyEnv.mtxPivot.rotateZ((45 / ƒ.Loop.timeFrameGame) / 10);
            console.log(environment);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
            environment.mtxLocal.rotateZ((-45 / ƒ.Loop.timeFrameGame) / 10);
            Labyrinth.gameState.level++;
        }
    }
    function createRigidBodies() {
        let cmpRigidbodyFloor11 = new ƒ.ComponentRigidbody(0, ƒ.PHYSICS_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.DEFAULT);
        let cmpRigidbodyFloor12 = new ƒ.ComponentRigidbody(0, ƒ.PHYSICS_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.DEFAULT);
        environment = root.getChildrenByName("environment")[0];
        //genvironment.addComponent(cmpRigidbodyEnv);
        let level1 = environment.getChildrenByName("level1")[0];
        let floor1 = level1.getChildrenByName("floor1")[0];
        let floor11 = floor1.getChildrenByName("floor11")[0];
        floor11.addComponent(cmpRigidbodyFloor11);
        let floor12 = floor1.getChildrenByName("floor12")[0];
        floor12.addComponent(cmpRigidbodyFloor12);
        let barriers = environment.getChildrenByName("barriers")[0];
        for (let node of barriers.getChildren()) {
            let cmpRigidbodyBarrier = new ƒ.ComponentRigidbody(0, ƒ.PHYSICS_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_2);
            node.addComponent(cmpRigidbodyBarrier);
            //   console.log(node.name, node.cmpTransform?.mtxLocal.toString());
        }
        let moveables = root.getChildrenByName("moveables")[0];
        //let ball: ƒ.Node = moveables.getChildrenByName("ball")[0];
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