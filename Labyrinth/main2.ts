namespace Labyrinth {
    import ƒ = FudgeCore;
    let root: ƒ.Graph;
    let environment: ƒ.Node; // = new NeigePlattorm;
    let level1: ƒ.Node;
    let moveables: ƒ.Node;
    let ball: ƒ.Node;
    let cmpRigidbodyBall: ƒ.ComponentRigidbody;
    let floor1: ƒ.Node;
    let camPosition: ƒ.Vector3 = new ƒ.Vector3(1, 10, 2);
    let cmpRigidbodyEnv: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(
        0,
        ƒ.PHYSICS_TYPE.DYNAMIC,
        ƒ.COLLIDER_TYPE.CUBE,
        ƒ.PHYSICS_GROUP.GROUP_2
    );
    let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    let viewport: ƒ.Viewport = new ƒ.Viewport();
    let ballBearing: ƒ.Node;
    let cmpRigidBearing: ƒ.ComponentRigidbody;
    let sphericalJoint: ƒ.ComponentJointSpherical;
    let environmentTransform: ƒ.ComponentTransform;

    function init(_event: Event): void {

        let dialog: HTMLDialogElement = document.querySelector("dialog");
        dialog.addEventListener("click", function (): void {
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

    async function startInteractiveViewport(): Promise<void> {

        // load resources referenced in the link-tag
        await ƒ.Project.loadResourcesFromHTML();
        ƒ.Debug.log("Project:", ƒ.Project.resources);
        // pick the graph to show
        root = <ƒ.Graph>ƒ.Project.resources["Graph|2021-05-30T21:24:22.133Z|16415"];
        ƒ.Debug.log("Graph:", root);
        // setup the viewport
        let canvas: HTMLCanvasElement = document.querySelector("canvas");
        viewport.initialize("InteractiveViewport", root, cmpCamera, canvas);
        ƒ.Debug.log("Viewport:", viewport);
        moveables = root.getChildrenByName("moveables")[0];
        ball = moveables.getChildrenByName("ball")[0];
        ballBearing = root.getChildrenByName("ballbearing")[0];
        createRigidBodies();
        settingUpJoint();
        ƒ.Physics.adjustTransforms(root, true);
        // hide the cursor when interacting, also suppressing right-click menu
        canvas.addEventListener("mousedown", canvas.requestPointerLock);
        canvas.addEventListener("mouseup", function (): void {
            document.exitPointerLock();
        });
        // make the camera interactive (complex method in FudgeAid)
        FudgeAid.Viewport.expandCameraToInteractiveOrbit(viewport);
        // setup audio
        setUpCam();
        let cmpListener: ƒ.ComponentAudioListener = new ƒ.ComponentAudioListener();
        //  cmpCamera.getContainer().addComponent(cmpListener);
        ƒ.AudioManager.default.listenWith(cmpListener);
        ƒ.AudioManager.default.listenTo(root);
        ƒ.Debug.log("Audio:", ƒ.AudioManager.default);
        // draw viewport once for immediate feedback
        viewport.draw();
        canvas.dispatchEvent(
            new CustomEvent("interactiveViewportStarted", {
                bubbles: true,
                detail: viewport
            })
        );
        // environment.addComponent(new ƒ.ComponentTransform);
        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        Gui.start();
        ƒ.Loop.start();
    }

    function update(_event: Event): void {

        ƒ.Physics.world.simulate(ƒ.Loop.timeFrameReal / 1000);

        ƒ.Physics.settings.debugDraw = true;
        console.log(environment);
        hndKey(this);
        // let neigbarX: boolean = false;
        // if (environment.mtxWorld.rotation.x < 15 && environment.mtxWorld.rotation.x > -15)
        //   neigbarX = true;
        // let neigbarZ: boolean = false;
        // if (environment.mtxWorld.rotation.z < 15 && environment.mtxWorld.rotation.z > -15)
        //   neigbarZ = true;

        // if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
        //   sphericalJoint.connectedRigidbody.applyForce(new ƒ.Vector3(0, 0, 1 * 100));
        //   // cmpRigidbodyEnv.rotateBody(ƒ.Vector3.X((-45 / ƒ.Loop.timeFrameGame) / 10));
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

    function setUpCam(): void {

        cmpCamera.mtxPivot.translate(new ƒ.Vector3(15, 40, -10));
        cmpCamera.mtxPivot.lookAt(ƒ.Vector3.ZERO());

    }

    function createRigidBodies(): void {
        cmpRigidBearing = new ƒ.ComponentRigidbody(
            1, ƒ.PHYSICS_TYPE.STATIC,
            ƒ.COLLIDER_TYPE.SPHERE,
            ƒ.PHYSICS_GROUP.GROUP_1
        );
        ballBearing.addComponent(cmpRigidBearing);

        let cmpRigidbodyFloor11: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(
            2,
            ƒ.PHYSICS_TYPE.KINEMATIC,
            ƒ.COLLIDER_TYPE.CUBE,
            ƒ.PHYSICS_GROUP.DEFAULT
        );
        let cmpRigidbodyFloor12: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(
            2,
            ƒ.PHYSICS_TYPE.KINEMATIC,
            ƒ.COLLIDER_TYPE.CUBE,
            ƒ.PHYSICS_GROUP.DEFAULT
        );
        environment = root.getChild(0);
        environment.addComponent(cmpRigidbodyEnv);
        //environmentTransform = environment.getComponent(ƒ.ComponentTransform);
        window.addEventListener("load", init);
        level1 = environment.getChildrenByName("level1")[0];
        floor1 = level1.getChildrenByName("floor1")[0];
        let floor11: ƒ.Node = floor1.getChildrenByName("floor11")[0];
        floor11.addComponent(cmpRigidbodyFloor11);
        let floor12: ƒ.Node = floor1.getChildrenByName("floor12")[0];
        floor12.addComponent(cmpRigidbodyFloor12);
        let barriers: ƒ.Node = environment.getChildrenByName("barriers")[0];
        for (let node of barriers.getChildren()) {
            let cmpRigidbodyBarrier: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(
                2,
                ƒ.PHYSICS_TYPE.KINEMATIC,
                ƒ.COLLIDER_TYPE.CUBE,
                ƒ.PHYSICS_GROUP.GROUP_2
            );
            node.addComponent(cmpRigidbodyBarrier);
            //  console.log(node.name, node.cmpTransform?.mtxLocal.toString());
        }


        for (let node of moveables.getChildren()) {
            cmpRigidbodyBall = new ƒ.ComponentRigidbody(
                1,
                ƒ.PHYSICS_TYPE.DYNAMIC,
                ƒ.COLLIDER_TYPE.SPHERE,
                ƒ.PHYSICS_GROUP.GROUP_2
            );
            cmpRigidbodyBall.restitution = 0.8;
            cmpRigidbodyBall.friction = 2.5;
            node.addComponent(cmpRigidbodyBall);
        }
    }
    function settingUpJoint(): void {
        sphericalJoint = new ƒ.ComponentJointSpherical(cmpRigidBearing, cmpRigidbodyEnv);
        environmentTransform.getContainer().addComponent(sphericalJoint);
        sphericalJoint.springDamping = 0.1;
        sphericalJoint.springFrequency = 1;
    }
    let stepWidth: number = 0.1;
    function hndKey(_event: KeyboardEvent): void {
        let horizontal: number = 0;
        let vertical: number = 0;
        let height: number = 0;

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
        let pos: ƒ.Vector3 = environmentTransform.mtxLocal.translation;
        pos.add(new ƒ.Vector3(horizontal, height, vertical));
        environmentTransform.mtxLocal.translation = pos;
        if (_event.code == ƒ.KEYBOARD_CODE.G) {
            sphericalJoint.connectedRigidbody.applyTorque(new ƒ.Vector3(0, 1 * 100, 0));
        }
    }
}
