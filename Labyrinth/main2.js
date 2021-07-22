var Labyrinth;
(function (Labyrinth) {
    var ƒ = FudgeCore;
    let root;
    let environment; // NeigePlattorm;
    let basicFloor;
    let level1;
    let level2;
    let level3;
    let moveables;
    let ball;
    let cmpCamera = new ƒ.ComponentCamera();
    let viewport = new ƒ.Viewport();
    let barrier01;
    let barrier02;
    let barrier03;
    let barrier04;
    let activeLevel1;
    let activeLevel2;
    let activeLevel3;
    let cmpLvl1Audio;
    let cmpLvl12udio;
    let cmpLvl13udio;
    let cmpCollisionAudio;
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
        createGeneralRigidBodies();
        setUpAudio();
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
    function createBall() {
        ball = new Labyrinth.Ball();
        ball.mtxLocal.translateY(10);
        moveables.appendChild(ball);
    }
    function update(_event) {
        ƒ.Physics.world.simulate(ƒ.Loop.timeFrameReal / 1000);
        ƒ.Physics.settings.debugDraw = true;
        checkActiveLevelNodes();
        handleLevelSetup();
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
            }
        }
        if (environment.mtxLocal.rotation.x < 15) {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
                //   cmpRigidbodyEnv.mtxPivot.rotateZ((45 / ƒ.Loop.timeFrameGame) / 10);
                environment.mtxLocal.rotateX((45 / ƒ.Loop.timeFrameGame) / 10);
                console.log(barrier01.mtxLocal.getY().y.toString());
            }
        }
        checkBallPosition();
        viewport.draw();
        ƒ.Physics.adjustTransforms(root, true);
    }
    function setUpCam() {
        cmpCamera.mtxPivot.translate(new ƒ.Vector3(-5, 60, 15));
        cmpCamera.mtxPivot.lookAt(ƒ.Vector3.ZERO());
    }
    function createGeneralRigidBodies() {
        environment = root.getChildrenByName("environment")[0];
        basicFloor = environment.getChildrenByName("basicFloor")[0];
        let barriers = basicFloor.getChildrenByName("barriers")[0];
        barrier01 = barriers.getChildrenByName("barrier01")[0];
        barrier02 = barriers.getChildrenByName("barrier02")[0];
        barrier03 = barriers.getChildrenByName("barrier03")[0];
        barrier04 = barriers.getChildrenByName("barrier04")[0];
        level1 = basicFloor.getChildrenByName("level1")[0];
        level2 = basicFloor.getChildrenByName("level2")[0];
        level3 = basicFloor.getChildrenByName("level3")[0];
        moveables = root.getChildrenByName("moveables")[0];
        ball = new Labyrinth.Ball();
        moveables.appendChild(ball);
        let cmpRigidbodyBasicFloor = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
        basicFloor.addComponent(cmpRigidbodyBasicFloor);
        console.log(basicFloor);
        for (let node of barriers.getChildren()) {
            let cmpRigidbodyBarrier = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
            cmpRigidbodyBarrier.restitution = 1;
            node.addComponent(cmpRigidbodyBarrier);
        }
        // let cmpRigidbodyBall: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(
        //     1,
        //     ƒ.PHYSICS_TYPE.DYNAMIC,
        //     ƒ.COLLIDER_TYPE.SPHERE,
        //     ƒ.PHYSICS_GROUP.GROUP_2
        // );
        // cmpRigidbodyBall.restitution = 0.1;
        // cmpRigidbodyBall.friction = 10;
        // cmpRigidbodyBall.mass = 10;
        // ball.addComponent(cmpRigidbodyBall);
    }
    function handleCollisionEventEnter(_event) {
        let level1Mtr = new ƒ.Material("Level1", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(240, 20, 20)));
        let hit1Mtr = new ƒ.Material("Hit1", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(245, 245, 60)));
        let hit2Mtr = new ƒ.Material("Hit2", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(245, 145, 60)));
        let hit3Mtr = new ƒ.Material("Hit3", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(245, 60, 60)));
        if (_event.cmpRigidbody.getContainer().name == "ball") {
            cmpCollisionAudio.play(true);
            if (this.restitution == 2) {
                this.getContainer().getComponent(ƒ.ComponentMaterial).material = hit3Mtr;
                this.restitution += 2;
            }
            // if (this.restitution == 5) {
            //     this.getContainer().getComponent(ƒ.ComponentMaterial).material = hit3Mtr;
            //     ƒ.Debug.log("3. Hit");
            //     this.restitution += 2;
            // }
            if (this.restitution == 1) {
                this.getContainer().getComponent(ƒ.ComponentMaterial).material = hit1Mtr;
                ƒ.Debug.log("1. Hit");
                this.restitution++;
            }
        }
    }
    function handleCollisionEventExit(_event) {
        if (_event.cmpRigidbody.getContainer().name == "Ball") {
            ƒ.Debug.log("Ball left me - Collider");
        }
    }
    function checkActiveLevelNodes() {
        for (let node of level1.getChildren()) {
            if (node.isActive)
                activeLevel1 = true;
            else
                activeLevel1 = false;
        }
        for (let node of level2.getChildren()) {
            if (node.isActive)
                activeLevel2 = true;
            else
                activeLevel2 = false;
        }
        for (let node of level3.getChildren()) {
            if (node.isActive)
                activeLevel3 = true;
            else
                activeLevel3 = false;
        }
    }
    function handleLevelSetup() {
        if (Labyrinth.gameState.level == 0)
            Labyrinth.gameState.level = 1;
        if (Labyrinth.gameState.level == 1) {
            createLevel1();
            if (activeLevel2)
                removeLevel2();
            if (activeLevel3)
                removeLevel3();
        }
        if (Labyrinth.gameState.level == 2) {
            createLevel2();
            if (activeLevel1)
                removeLevel1();
            if (activeLevel3)
                removeLevel3();
        }
        if (Labyrinth.gameState.level == 3) {
            createLevel3();
            if (activeLevel1)
                removeLevel1();
            if (activeLevel2)
                removeLevel2();
        }
    }
    function createLevel1() {
        for (let node of level1.getChildren()) {
            node.activate(true);
            let cmpRigidBarrier = new ƒ.ComponentRigidbody(1, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
            cmpRigidBarrier.restitution = 1;
            cmpRigidBarrier.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, handleCollisionEventEnter);
            cmpRigidBarrier.addEventListener("ColliderLeftCollision" /* COLLISION_EXIT */, handleCollisionEventExit);
            if (!node.getComponent(ƒ.ComponentRigidbody))
                node.addComponent(cmpRigidBarrier);
        }
    }
    function createLevel2() {
        for (let node of level2.getChildren()) {
            node.activate(true);
            let cmpRigidBarrier = new ƒ.ComponentRigidbody(1, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
            if (!node.getComponent(ƒ.ComponentRigidbody))
                node.addComponent(cmpRigidBarrier);
        }
    }
    function createLevel3() {
        for (let node of level3.getChildren()) {
            node.activate(true);
            let cmpRigidBarrier = new ƒ.ComponentRigidbody(1, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
            if (!node.getComponent(ƒ.ComponentRigidbody))
                node.addComponent(cmpRigidBarrier);
        }
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
            if (node.getComponent(ƒ.ComponentRigidbody) != null)
                node.removeComponent(node.getComponent(ƒ.ComponentRigidbody));
            node.activate(false);
        }
    }
    function removeLevel3() {
        for (let node of level3.getChildren()) {
            if (node.getComponent(ƒ.ComponentRigidbody) != null)
                node.removeComponent(node.getComponent(ƒ.ComponentRigidbody));
            node.activate(false);
        }
    }
    function checkBallPosition() {
        if (ball.mtxLocal.translation.y < -10)
            showSuccessMessage();
    }
    function showSuccessMessage() {
        let successDiv = document.getElementById("success-message");
        successDiv.style.display = "block";
        // successDiv.setAttribute("display", "block");
        let successHeading = document.getElementById("sm-heading");
        let subHeading = document.getElementById("sm-subheading");
        let lvl1Button = document.getElementById("lvl1-button");
        let lvl2Button = document.getElementById("lvl2-button");
        let lvl3Button = document.getElementById("lvl3-button");
        successHeading.innerText = "Congratulations!";
        subHeading.innerText = "Play again?";
        lvl1Button.innerText = "Level 1";
        lvl2Button.innerText = "Level 2";
        lvl3Button.innerText = "Level 3";
        lvl1Button.addEventListener("click", handleLevel1Click);
        lvl2Button.addEventListener("click", handleLevel2Click);
        lvl3Button.addEventListener("click", handleLevel3Click);
        moveables.removeAllChildren();
        viewport.draw();
    }
    function handleLevel1Click(_click) {
        let successDiv = document.getElementById("success-message");
        successDiv.style.display = "none";
        Labyrinth.gameState.level = 1;
        createBall();
    }
    function handleLevel2Click(_click) {
        let successDiv = document.getElementById("success-message");
        successDiv.style.display = "none";
        Labyrinth.gameState.level = 2;
        createBall();
    }
    function handleLevel3Click(_click) {
        let successDiv = document.getElementById("success-message");
        successDiv.style.display = "none";
        Labyrinth.gameState.level = 3;
        createBall();
    }
    function setUpAudio() {
        let collisionSound = new ƒ.Audio("audio/jump.mp3");
        let lvl1CompleteSound = new ƒ.Audio("audio/person_cheering.mp3");
        let lvl2CompleteSound = new ƒ.Audio("audio/crowd_cheering.mp3");
        let lvl3CompleteSound = new ƒ.Audio("audio/sports-crowd_cheering.mp3");
        let cmpCollisionAudio = new ƒ.ComponentAudio(collisionSound, false, false);
        let cmpLvl1Audio = new ƒ.ComponentAudio(lvl1CompleteSound, false, false);
        let cmpLvl2Audio = new ƒ.ComponentAudio(lvl2CompleteSound, false, false);
        let cmpLvl3Audio = new ƒ.ComponentAudio(lvl3CompleteSound, false, false);
        let lvl1AudioNode = new ƒ.Node("Level1SuccessSound");
        let lvl2AudioNode = new ƒ.Node("Level2SuccessSound");
        let lvl3AudioNode = new ƒ.Node("Level3SuccessSound");
        let collisionAudioNode = new ƒ.Node("CollisionSound");
        let cmpListener = new ƒ.ComponentAudioListener();
        //  cmpCamera.getContainer().addComponent(cmpListener);
        lvl1AudioNode.addComponent(cmpLvl1Audio);
        lvl2AudioNode.addComponent(cmpLvl2Audio);
        lvl3AudioNode.addComponent(cmpLvl3Audio);
        collisionAudioNode.addComponent(cmpCollisionAudio);
        cmpCamera.getContainer().appendChild(lvl1AudioNode);
        basicFloor.appendChild(lvl2AudioNode);
        basicFloor.appendChild(lvl3AudioNode);
        basicFloor.appendChild(collisionAudioNode);
        ƒ.AudioManager.default.listenWith(cmpListener);
        ƒ.AudioManager.default.listenTo(lvl1AudioNode);
        ƒ.AudioManager.default.volume = 0.3;
    }
})(Labyrinth || (Labyrinth = {}));
//# sourceMappingURL=main2.js.map