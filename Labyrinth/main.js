var Labyrinth;
(function (Labyrinth) {
    var ƒ = FudgeCore;
    let config;
    let root;
    let environment; // NeigePlattorm;
    let basicFloor;
    let level1;
    let level2;
    let level3;
    let moveables;
    let ball;
    let camNode = new ƒ.Node("camera");
    let cmpCamera;
    let viewport = new ƒ.Viewport();
    let barrier01;
    let barrier02;
    let barrier03;
    let barrier04;
    let activeLevel1;
    let activeLevel2;
    let activeLevel3;
    let cmpLvlAudio;
    let cmpCollisionAudio;
    let cmpListener = new ƒ.ComponentAudioListener();
    let barrierMtr = new ƒ.Material("LevelMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(0.3137254901960784, 0.9607843137254902, 0.9411764705882353, 1)));
    window.addEventListener("load", init);
    function init(_event) {
        let dialog = document.querySelector("dialog");
        dialog.addEventListener("click", function () {
            dialog.close();
            startInteractiveViewport();
        });
        dialog.showModal();
        //  ƒ.Physics.settings.debugDraw = true;
        ƒ.Physics.initializePhysics();
        ƒ.Physics.world.setSolverIterations(1000);
        ƒ.Physics.settings.defaultRestitution = 0.1;
        ƒ.Physics.settings.defaultFriction = 0.1;
    }
    async function startInteractiveViewport() {
        let response = await fetch("data/Config.json");
        let responseString = await response.text();
        config = JSON.parse(responseString);
        // load resources referenced in the link-tag
        await ƒ.Project.loadResourcesFromHTML();
        // pick the graph to show
        root = ƒ.Project.resources["Graph|2021-05-30T21:24:22.133Z|16415"];
        // setup the viewport
        let canvas = document.querySelector("canvas");
        cmpCamera = new ƒ.ComponentCamera();
        viewport.initialize("InteractiveViewport", root, cmpCamera, canvas);
        createGeneralRigidBodies();
        setUpAudio();
        ƒ.Physics.adjustTransforms(root, true);
        // make the camera interactive (complex method in FudgeAid)
        FudgeAid.Viewport.expandCameraToInteractiveOrbit(viewport);
        // setup audio
        setUpCam();
        // draw viewport once for immediate feedback
        viewport.draw();
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        Labyrinth.Gui.start();
        ƒ.Loop.start();
    }
    function createBall() {
        let configMass = document.getElementById("mass-configuration");
        let configRestitution = document.getElementById("restitution-configuration");
        let configFriction = document.getElementById("friction-configuration");
        ball = new Labyrinth.Ball(config.mass, config.restitution, config.friction);
        ball.mtxLocal.translateY(10);
        moveables.appendChild(ball);
        configMass.innerText = "Mass: " + config.mass.toString();
        configRestitution.innerText = "Restitution: " + config.restitution.toString();
        configFriction.innerText = "Friction: " + config.friction.toString();
    }
    function update(_event) {
        ƒ.Physics.world.simulate(ƒ.Loop.timeFrameReal / 1000);
        //  ƒ.Physics.settings.debugDraw = true;
        checkActiveLevelNodes();
        handleLevelSetup();
        if (environment.mtxLocal.rotation.z > -15) {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
                environment.mtxLocal.rotateZ((-45 / ƒ.Loop.timeFrameGame) / 10);
            }
        }
        if (environment.mtxLocal.rotation.z < 15) {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
                environment.mtxLocal.rotateZ((45 / ƒ.Loop.timeFrameGame) / 10);
            }
        }
        if (environment.mtxLocal.rotation.x > -15) {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
                environment.mtxLocal.rotateX((-45 / ƒ.Loop.timeFrameGame) / 10);
            }
        }
        if (environment.mtxLocal.rotation.x < 15) {
            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
                environment.mtxLocal.rotateX((45 / ƒ.Loop.timeFrameGame) / 10);
            }
        }
        checkBallPosition();
        ƒ.AudioManager.default.update();
        viewport.draw();
        ƒ.Physics.adjustTransforms(root, true);
    }
    function setUpCam() {
        camNode.addComponent(cmpCamera);
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
        createBall();
        moveables.appendChild(ball);
        let cmpRigidbodyBasicFloor = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
        basicFloor.addComponent(cmpRigidbodyBasicFloor);
        for (let node of barriers.getChildren()) {
            let cmpRigidbodyBarrier = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
            cmpRigidbodyBarrier.restitution = 1;
            node.addComponent(cmpRigidbodyBarrier);
        }
    }
    function handleCollisionEventEnter(_event) {
        let hit1Mtr = new ƒ.Material("Hit1", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(255, 200, 0)));
        let hit2Mtr = new ƒ.Material("Hit2", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(255, 0, 0)));
        if (_event.cmpRigidbody.getContainer().name == "ball") {
            cmpCollisionAudio.play(true);
            if (this.restitution == 2) {
                this.getContainer().getComponent(ƒ.ComponentMaterial).material = hit2Mtr;
                this.restitution += 2;
            }
            if (this.restitution == 1) {
                this.getContainer().getComponent(ƒ.ComponentMaterial).material = hit1Mtr;
                this.restitution = 2;
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
            cmpRigidBarrier.restitution = 1;
            cmpRigidBarrier.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, handleCollisionEventEnter);
            cmpRigidBarrier.addEventListener("ColliderLeftCollision" /* COLLISION_EXIT */, handleCollisionEventExit);
            if (!node.getComponent(ƒ.ComponentRigidbody))
                node.addComponent(cmpRigidBarrier);
        }
    }
    function createLevel3() {
        for (let node of level3.getChildren()) {
            node.activate(true);
            let cmpRigidBarrier = new ƒ.ComponentRigidbody(1, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
            cmpRigidBarrier.restitution = 1;
            cmpRigidBarrier.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, handleCollisionEventEnter);
            cmpRigidBarrier.addEventListener("ColliderLeftCollision" /* COLLISION_EXIT */, handleCollisionEventExit);
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
        let success = false;
        if (ball.mtxLocal.translation.y < -10) {
            cmpLvlAudio.play(true);
            success = true;
        }
        if (success)
            showSuccessMessage();
    }
    function showSuccessMessage() {
        let successDiv = document.getElementById("success-message");
        successDiv.style.display = "block";
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
        for (let node of level1.getChildren()) {
            node.activate(true);
            node.getComponent(ƒ.ComponentMaterial).material = barrierMtr;
            let cmpRigidBarrier = new ƒ.ComponentRigidbody(1, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
            if (!node.getComponent(ƒ.ComponentRigidbody)) {
                cmpRigidBarrier.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, handleCollisionEventEnter);
                cmpRigidBarrier.addEventListener("ColliderLeftCollision" /* COLLISION_EXIT */, handleCollisionEventExit);
                cmpRigidBarrier.restitution = 1;
                node.addComponent(cmpRigidBarrier);
            }
            else
                node.getComponent(ƒ.ComponentRigidbody).restitution = 1;
        }
        createBall();
        Labyrinth.gameState.level = 1;
    }
    function handleLevel2Click(_click) {
        let successDiv = document.getElementById("success-message");
        successDiv.style.display = "none";
        for (let node of level2.getChildren()) {
            node.activate(true);
            node.getComponent(ƒ.ComponentMaterial).material = barrierMtr;
            let cmpRigidBarrier = new ƒ.ComponentRigidbody(1, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
            if (!node.getComponent(ƒ.ComponentRigidbody)) {
                cmpRigidBarrier.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, handleCollisionEventEnter);
                cmpRigidBarrier.addEventListener("ColliderLeftCollision" /* COLLISION_EXIT */, handleCollisionEventExit);
                cmpRigidBarrier.restitution = 1;
                node.addComponent(cmpRigidBarrier);
            }
            else
                node.getComponent(ƒ.ComponentRigidbody).restitution = 1;
        }
        createBall();
        Labyrinth.gameState.level = 2;
    }
    function handleLevel3Click(_click) {
        let successDiv = document.getElementById("success-message");
        successDiv.style.display = "none";
        for (let node of level3.getChildren()) {
            node.getComponent(ƒ.ComponentMaterial).material = barrierMtr;
            node.activate(true);
            let cmpRigidBarrier = new ƒ.ComponentRigidbody(1, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
            if (!node.getComponent(ƒ.ComponentRigidbody)) {
                cmpRigidBarrier.addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, handleCollisionEventEnter);
                cmpRigidBarrier.addEventListener("ColliderLeftCollision" /* COLLISION_EXIT */, handleCollisionEventExit);
                cmpRigidBarrier.restitution = 1;
                node.addComponent(cmpRigidBarrier);
            }
            else
                node.getComponent(ƒ.ComponentRigidbody).restitution = 1;
        }
        createBall();
        Labyrinth.gameState.level = 3;
    }
    function setUpAudio() {
        let collisionSound = new ƒ.Audio("audio/jump.mp3");
        let lvlCompleteSound = new ƒ.Audio("audio/crowd_cheering.mp3");
        cmpCollisionAudio = new ƒ.ComponentAudio(collisionSound, false, false);
        cmpLvlAudio = new ƒ.ComponentAudio(lvlCompleteSound, false, false);
        let lvlAudioNode = new ƒ.Node("LevelSuccessSound");
        let collisionAudioNode = new ƒ.Node("CollisionSound");
        camNode.addComponent(cmpListener);
        lvlAudioNode.addComponent(cmpLvlAudio);
        collisionAudioNode.addComponent(cmpCollisionAudio);
        basicFloor.appendChild(lvlAudioNode);
        basicFloor.appendChild(collisionAudioNode);
        ƒ.AudioManager.default.listenWith(cmpListener);
        ƒ.AudioManager.default.listenTo(root);
        ƒ.AudioManager.default.volume = 0.2;
    }
})(Labyrinth || (Labyrinth = {}));
//# sourceMappingURL=Main.js.map