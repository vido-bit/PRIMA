namespace PhysicsScene {

    import ƒ = FudgeCore;

    let root: ƒ.Graph;
    window.addEventListener("load", init);
    let viewport: ƒ.Viewport; // = new ƒ.Viewport();
    //   let hierarchy: ƒ.Node;
    let environment: ƒ.Node[] = new Array();
    let player: Player;
    let ball: ƒ.Node;
    let ballBody: ƒ.ComponentRigidbody;
    let cmpCamera: ƒ.ComponentCamera;
    let isLocked: boolean = false;
    // let isGrounded: boolean;
    let canvas: HTMLCanvasElement;
    let camBufferX: number = 0;
    let camBufferY: number = 0;
    const camSpeed: number = -0.15;
    let forwardMovement: number = 0;
    let sideMovement: number = 0;
    async function init(_event: Event): Promise<void> {
        //   ƒ.Physics.settings.debugDraw = true;
        ƒ.Physics.initializePhysics();
        ƒ.Physics.world.setSolverIterations(1000);
        ƒ.Physics.settings.defaultRestitution = 0.3;
        ƒ.Physics.settings.defaultFriction = 0.8;
        await ƒ.Project.loadResourcesFromHTML();
        ƒ.Debug.log("Project:", ƒ.Project.resources);
        // pick the graph to show
        root = <ƒ.Graph>ƒ.Project.resources["Graph|2021-04-27T14:51:00.597Z|11409"];
        //root = <ƒ.Graph>ƒ.Project.resources["Graph|2021-04-27T14:37:53.620Z|93013"];
        ƒ.Debug.log("Graph:", root);
        canvas = document.querySelector("canvas");
        //  hierarchy = new ƒ.Node("Scene");
        // player = graph.getChildrenByName("board")[0];
        // console.log(player);
        // ball = graph.getChildrenByName("ball")[0];

        cmpCamera = new ƒ.ComponentCamera();
        player = new Player(cmpCamera);
        root.addChild(player);
        createRigidBodies();
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
        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start();
        //  ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 120);
        //   ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    }

    function update(_event: Event): void {
        ƒ.Physics.world.simulate(ƒ.Loop.timeFrameReal / 1000);
        //lookAt(player.mtxLocal.translation);
        updateCam(camBufferX, camBufferY);
        player.move(forwardMovement, sideMovement);
        viewport.draw();
        ƒ.Physics.settings.debugDraw = true;
    }

    function createRigidBodies(): void {
        let level: ƒ.Node = root.getChildrenByName("level")[0];
        for (let node of level.getChildren()) {
            let cmpRigidbody: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(0, ƒ.PHYSICS_TYPE.STATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.DEFAULT);
            node.addComponent(cmpRigidbody);
            //   console.log(node.name, node.cmpTransform?.mtxLocal.toString());
        }
        for (let node of level.getChildren()) {
            // console.log(node.name, node.cmpTransform?.mtxLocal.toString());
        }

    }

    function startPlayerMovement(_event: KeyboardEvent): void {
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
            player.cmpRigid.applyLinearImpulse(new ƒ.Vector3(0, player.jumpForce, 0));
        }
    }
    function stopPlayerMovement(_event: KeyboardEvent): void {
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

    function pointerLockChange(): void {
        if (!document.pointerLockElement)
            isLocked = false;
        isLocked = true;
    }
    function onMouseDown(): void {
        if (isLocked == false)
            canvas.requestPointerLock();
    }
    function handleMouseMove(_event: MouseEvent): void {
        if (isLocked == true) {
            camBufferX += _event.movementX;
            camBufferY += _event.movementY;
        }
    }
    function updateCam(_x: number, _y: number): void {
        player.camNode.mtxLocal.rotateZ(_y * camSpeed);
        player.camNode.mtxLocal.rotateY(_x * camSpeed, true);
        camBufferX = 0;
        camBufferY = 0;
    }

}