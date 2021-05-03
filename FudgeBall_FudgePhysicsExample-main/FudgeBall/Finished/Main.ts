///<reference types="./libs/FudgeCore.js"/>

import f = FudgeCore;

namespace Turorials_FUDGEPhysics_Lesson1 {


    window.addEventListener("load", init);
    const app: HTMLCanvasElement = document.querySelector("canvas");
    let viewPort: f.Viewport;
    let hierarchy: f.Node;

    let environment: f.Node[] = new Array();
    let player: f.Node;
    let playerBody: f.ComponentRigidbody;
    let ball: f.Node;
    let ballBody: f.ComponentRigidbody;

    //Setting Variables
    let materialPlayer: f.Material = new f.Material("Player", f.ShaderFlat, new f.CoatColored(new f.Color(0.7, 0.8, 0.6, 1)));
    let materialBall: f.Material = new f.Material("Ball", f.ShaderFlat, new f.CoatColored(new f.Color(0.8, 0.8, 0.2, 1)));
    let materialEnvironment: f.Material = new f.Material("Environment", f.ShaderFlat, new f.CoatColored(new f.Color(0.2, 0.2, 0.2, 1)));
    let materialGoal: f.Material = new f.Material("Goal", f.ShaderFlat, new f.CoatColored(new f.Color(0.5, 0.5, 0.5, 1)));

    //Physical Player Variables
    let isGrounded: boolean;
    let movementspeed: number = 12;
    let turningspeed: number = 200;
    let playerWeight: number = 75;
    let playerJumpForce: number = 500;
    let kickStrength: number = 100;
    let cmpCamera: f.ComponentCamera;
    let yTurn: number = 0;
    let forwardMovement: number = 0;


    function init(_event: Event): void {
        hierarchy = new f.Node("Scene");

        f.Physics.world.setSolverIterations(1000);
        f.Physics.settings.defaultRestitution = 0.3;
        f.Physics.settings.defaultFriction = 0.8;

        settingUpEnvironment();

        settingUpAPlayer();

        ball = createNodeWithComponents("Ball", materialBall, new f.MeshSphere(), 1, f.PHYSICS_TYPE.DYNAMIC,
                                        f.PHYSICS_GROUP.GROUP_2, f.COLLIDER_TYPE.SPHERE);

        ball.mtxLocal.translateY(2);
        ballBody = ball.getComponent(f.ComponentRigidbody);
        ballBody.restitution = 2.5;
        hierarchy.appendChild(ball);

        settingUpTrigger();

        settingUpAJoint();

        //Standard Fudge Scene Initialization - Creating a directional light, a camera and initialize the viewport
        let cmpLight: f.ComponentLight = new f.ComponentLight(new f.LightDirectional(f.Color.CSS("WHITE")));
        cmpLight.mtxPivot.lookAt(new f.Vector3(0.5, -1, -0.8)); //Set light direction
        hierarchy.addComponent(cmpLight);

        cmpCamera = new f.ComponentCamera();
        cmpCamera.clrBackground = f.Color.CSS("GREY");
        cmpCamera.mtxPivot.translate(new f.Vector3(20, 10, 20));
        cmpCamera.mtxPivot.lookAt(f.Vector3.ZERO());

        viewPort = new f.Viewport();
        viewPort.initialize("Viewport", hierarchy, cmpCamera, app);

        document.addEventListener("keypress", handler_Key_Pressed);
        document.addEventListener("keyup", handler_Key_Released);

        //Ball Resetting on enter trigger
        environment[8].getComponent(f.ComponentRigidbody).addEventListener(f.EVENT_PHYSICS.TRIGGER_ENTER, resetBall);
        environment[9].getComponent(f.ComponentRigidbody).addEventListener(f.EVENT_PHYSICS.TRIGGER_ENTER, resetBall);

        // Implementing kicking mechanic
        document.addEventListener("keypress", (_event: f.EventKeyboard) => {
            if (_event.code == f.KEYBOARD_CODE.E) {
                let playerForward: f.Vector3;
                playerForward = f.Vector3.Z();
                playerForward.transform(player.mtxWorld, false);
                let distance: f.Vector3 = f.Vector3.DIFFERENCE(ball.mtxWorld.translation, player.mtxWorld.translation);
                if (distance.magnitude > 2.5)
                    return;
                ballBody.applyImpulseAtPoint(
                    new f.Vector3(playerForward.x * kickStrength / distance.magnitude, playerForward.y * kickStrength / distance.magnitude, playerForward.z * kickStrength / distance.magnitude),
                    player.mtxWorld.translation);
            }
        });

        f.Physics.start(hierarchy);

        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
        f.Loop.start(); //Stard the game loop
    }

    function update(): void {

        f.Physics.world.simulate(f.Loop.timeFrameReal / 1000);

        cmpCamera.mtxPivot.lookAt(player.mtxWorld.translation);
        playerIsGroundedRaycast();
        player_Movement(f.Loop.timeFrameReal / 1000);

        viewPort.draw();
    }

    function createNodeWithComponents(_name: string, _material: f.Material, _mesh: f.Mesh, _mass: number, _physicsType: f.PHYSICS_TYPE, _group: f.PHYSICS_GROUP = f.PHYSICS_GROUP.DEFAULT, _colType: f.COLLIDER_TYPE = f.COLLIDER_TYPE.CUBE, _convexMesh: Float32Array = null): f.Node {
        let node: f.Node = new f.Node(_name);
        let cmpMesh: f.ComponentMesh = new f.ComponentMesh(_mesh);
        let cmpMaterial: f.ComponentMaterial = new f.ComponentMaterial(_material);

        let cmpTransform: f.ComponentTransform = new f.ComponentTransform();
        let cmpRigidbody: f.ComponentRigidbody = new f.ComponentRigidbody(_mass, _physicsType, _colType, _group, null, _convexMesh); //add a Float32 Array of points to the rb constructor to create a convex collider
        node.addComponent(cmpMesh);
        node.addComponent(cmpMaterial);
        node.addComponent(cmpTransform);
        node.addComponent(cmpRigidbody);
        return node;
    }

    function settingUpAPlayer(): void {
        player = createNodeWithComponents("Player", materialPlayer, new f.MeshCube(), playerWeight, f.PHYSICS_TYPE.DYNAMIC, f.PHYSICS_GROUP.DEFAULT, f.COLLIDER_TYPE.CAPSULE);
        hierarchy.appendChild(player);
        playerBody = player.getComponent(f.ComponentRigidbody);
        player.mtxLocal.scale(new f.Vector3(0.5, 1.8, 0.3));
        player.mtxLocal.translate(new f.Vector3(2.5, 4, 3.5));
        playerBody.rotationInfluenceFactor = new f.Vector3(0, 0, 0);
        playerBody.mtxPivot.scale(new f.Vector3(1, 0.85, 1));
        playerBody.friction = 0.01;

        // Nose as direction indicator
        let playerNose: f.Node = createNodeWithComponents("PlayerNose", materialPlayer, new f.MeshCube(), playerWeight, f.PHYSICS_TYPE.DYNAMIC);
        playerNose.mtxLocal.translate(new f.Vector3(0, 0.2, 0.4));
        playerNose.mtxLocal.scale(new f.Vector3(0.1, 0.2, 1.5));
        playerNose.removeComponent(playerNose.getComponent(f.ComponentRigidbody));
        player.addChild(playerNose);
    }

    function playerIsGroundedRaycast(): void {
        let hitInfo: f.RayHitInfo;
        hitInfo = f.Physics.raycast(playerBody.getPosition(), new f.Vector3(0, -1, 0), 1.1);
        if (hitInfo.hit) {
            isGrounded = true;
        } else {
            isGrounded = false;
        }
    }


    function handler_Key_Pressed(_event: KeyboardEvent): void {

        if (_event.code == f.KEYBOARD_CODE.A) {
            yTurn = 1;
        }
        if (_event.code == f.KEYBOARD_CODE.W) {
            forwardMovement = 1;
        }
        if (_event.code == f.KEYBOARD_CODE.S) {
            forwardMovement = -1;
        }
        if (_event.code == f.KEYBOARD_CODE.D) {
            yTurn = -1;
        }
        if (_event.code == f.KEYBOARD_CODE.SPACE) {
            if (isGrounded)
                playerBody.applyLinearImpulse(new f.Vector3(0, playerJumpForce, 0));
        }

        if (_event.code == f.KEYBOARD_CODE.T) {
            f.Physics.settings.debugMode = f.Physics.settings.debugMode == f.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER ? f.PHYSICS_DEBUGMODE.PHYSIC_OBJECTS_ONLY : f.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
        }
        if (_event.code == f.KEYBOARD_CODE.Y) {
            f.Physics.settings.debugDraw = !f.Physics.settings.debugDraw;
        }
    }

    function handler_Key_Released(_event: KeyboardEvent): void {
        if (_event.code == f.KEYBOARD_CODE.A) {
            yTurn = 0;
        }
        if (_event.code == f.KEYBOARD_CODE.W) {
            forwardMovement = 0;
        }
        if (_event.code == f.KEYBOARD_CODE.S) {
            forwardMovement = 0;
        }
        if (_event.code == f.KEYBOARD_CODE.D) {
            yTurn = 0;
        }
    }

    //Actually moving the player
    function player_Movement(_deltaTime: number): void {
        let playerForward: f.Vector3;
        playerForward = f.Vector3.Z();
        playerForward.transform(player.mtxWorld, false);

        //You can rotate a body like you would rotate a transform, incremental but keep in mind, normally we use forces in physics,
        //this is just a feature to make it easier to create player characters
        playerBody.rotateBody(new f.Vector3(0, yTurn * turningspeed * _deltaTime, 0));

        let movementVelocity: f.Vector3 = new f.Vector3();
        movementVelocity.x = playerForward.x * forwardMovement * movementspeed;
        movementVelocity.y = playerBody.getVelocity().y;
        movementVelocity.z = playerForward.z * forwardMovement * movementspeed;
        playerBody.setVelocity(movementVelocity);
    }



    function settingUpEnvironment(): void {
        environment[0] = createNodeWithComponents("Ground", materialEnvironment, new f.MeshCube(), 0, f.PHYSICS_TYPE.STATIC, f.PHYSICS_GROUP.GROUP_2);
        environment[0].mtxLocal.scale(new f.Vector3(20, 0.3, 20));
        hierarchy.appendChild(environment[0]);

        //Protective Walls
        environment[1] = createNodeWithComponents("FrontWall", materialEnvironment, new f.MeshCube(), 0, f.PHYSICS_TYPE.STATIC, f.PHYSICS_GROUP.GROUP_2);
        environment[1].mtxLocal.scale(new f.Vector3(20, 1, 1));
        environment[1].mtxLocal.translate(new f.Vector3(0, 0.5, 10.5));
        hierarchy.appendChild(environment[1]);

        environment[2] = createNodeWithComponents("BackWall", materialEnvironment, new f.MeshCube(), 0, f.PHYSICS_TYPE.STATIC, f.PHYSICS_GROUP.GROUP_2);
        environment[2].mtxLocal.scale(new f.Vector3(20, 1, 1));
        environment[2].mtxLocal.translate(new f.Vector3(0, 0.5, -10.5));
        hierarchy.appendChild(environment[2]);

        environment[3] = createNodeWithComponents("LeftWall", materialEnvironment, new f.MeshCube(), 0, f.PHYSICS_TYPE.STATIC, f.PHYSICS_GROUP.GROUP_2);
        environment[3].mtxLocal.scale(new f.Vector3(1, 1, 20));
        environment[3].mtxLocal.translate(new f.Vector3(10.5, 0.5, 0));
        hierarchy.appendChild(environment[3]);

        environment[4] = createNodeWithComponents("RightWall", materialEnvironment, new f.MeshCube(), 0, f.PHYSICS_TYPE.STATIC, f.PHYSICS_GROUP.GROUP_2);
        environment[4].mtxLocal.scale(new f.Vector3(1, 1, 20));
        environment[4].mtxLocal.translate(new f.Vector3(-10.5, 0.5, 0));
        hierarchy.appendChild(environment[4]);

        //Goal
        environment[5] = createNodeWithComponents("Goal_Upper", materialGoal, new f.MeshCube(), 0, f.PHYSICS_TYPE.STATIC, f.PHYSICS_GROUP.GROUP_2);
        environment[5].mtxLocal.scale(new f.Vector3(8, 1, 1));
        environment[5].mtxLocal.translate(new f.Vector3(0, 4.5, -9.5));
        hierarchy.appendChild(environment[5]);

        environment[6] = createNodeWithComponents("Goal_Left", materialGoal, new f.MeshCube(), 0, f.PHYSICS_TYPE.STATIC, f.PHYSICS_GROUP.GROUP_2);
        environment[6].mtxLocal.scale(new f.Vector3(1, 4.5, 1));
        environment[6].mtxLocal.translate(new f.Vector3(-4.5, 0.5, -9.5));
        hierarchy.appendChild(environment[6]);

        environment[7] = createNodeWithComponents("Goal_Right", materialGoal, new f.MeshCube(), 0, f.PHYSICS_TYPE.STATIC, f.PHYSICS_GROUP.GROUP_2);
        environment[7].mtxLocal.scale(new f.Vector3(1, 4.5, 1));
        environment[7].mtxLocal.translate(new f.Vector3(4.5, 0.5, -9.5));
        hierarchy.appendChild(environment[7]);
    }

    function settingUpTrigger(): void {
        // Ball Resetting Triggers
        environment[8] = createNodeWithComponents("Ground_BelowZero", materialGoal, new f.MeshCube(), 0, f.PHYSICS_TYPE.STATIC, f.PHYSICS_GROUP.TRIGGER);
        environment[8].removeComponent(environment[8].getComponent(f.ComponentMesh));
        environment[8].mtxLocal.scale(new f.Vector3(100, 10, 100));
        environment[8].mtxLocal.translateY(-1);
        hierarchy.appendChild(environment[8]);

        environment[9] = createNodeWithComponents("Goal_Trigger", materialGoal, new f.MeshCube(), 0, f.PHYSICS_TYPE.STATIC, f.PHYSICS_GROUP.TRIGGER);
        environment[9].removeComponent(environment[9].getComponent(f.ComponentMesh));
        environment[9].mtxLocal.scale(new f.Vector3(9, 4.5, 1.5));
        environment[9].mtxLocal.translate(new f.Vector3(0, 0.5, -6.25));
        hierarchy.appendChild(environment[9]);
    }

    function resetBall(_event: f.EventPhysics): void {
        if (_event.cmpRigidbody.getContainer().name == "Ball") {
            ballBody.setVelocity(f.Vector3.ZERO());
            ballBody.setAngularVelocity(f.Vector3.ZERO());
            ballBody.setPosition(new f.Vector3(0, 5, 0));
        }
    }

    function settingUpAJoint(): void {
        environment[10] = createNodeWithComponents("Holder", new f.Material("Cube", f.ShaderFlat, new f.CoatColored(new f.Color(0.4, 0.4, 0.4, 1))), new f.MeshCube(), 1, f.PHYSICS_TYPE.STATIC, f.PHYSICS_GROUP.GROUP_1);
        hierarchy.appendChild(environment[10]);
        environment[10].mtxLocal.translate(new f.Vector3(5, 6, -2));
        environment[10].mtxLocal.scale(new f.Vector3(0.5, 1, 0.5));

        environment[11] = createNodeWithComponents("MovingDrill", new f.Material("Cube", f.ShaderFlat, new f.CoatColored(new f.Color(1, 1, 0, 1))), new f.MeshCube(), 1, f.PHYSICS_TYPE.DYNAMIC, f.PHYSICS_GROUP.GROUP_1);
        hierarchy.appendChild(environment[11]);
        environment[11].mtxLocal.translate(new f.Vector3(5, 2.5, -2));
        environment[11].mtxLocal.scale(new f.Vector3(3, 2, 0.2));
        let cylindricalJoint: f.ComponentJointCylindrical = new f.ComponentJointCylindrical(environment[10].getComponent(f.ComponentRigidbody), environment[11].getComponent(f.ComponentRigidbody), new f.Vector3(0, 1, 0));
        environment[11].addComponent(cylindricalJoint);
        cylindricalJoint.translationMotorLimitLower = -1;
        cylindricalJoint.translationMotorLimitUpper = 0;
    }
}

