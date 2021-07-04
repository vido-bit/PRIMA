namespace Joint {
    import ƒ = FudgeCore;

    let glueJoint: ƒ.ComponentJointRevolute;
    let glueJoint2: ƒ.ComponentJointRevolute;
    let root: ƒ.Graph;
    let connectedContainer: ƒ.Node;
    let connectedContainerRigidbody: ƒ.ComponentRigidbody;
    let connectedNode: ƒ.Node;
    let connectedNodeRigidbody: ƒ.ComponentRigidbody;
    let attachedContainer: ƒ.Node;
    let connectedNode2: ƒ.Node;
    let connectedNodeRigidbody2: ƒ.ComponentRigidbody;
    let attachedContainerRigidbody: ƒ.ComponentRigidbody;
    let attachedNode: ƒ.Node;
    let attachedNodeRigidbody: ƒ.ComponentRigidbody;
    let sphericalJoint: ƒ.ComponentJointSpherical;
    let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    let viewport: ƒ.Viewport = new ƒ.Viewport();
    window.addEventListener("load", init);

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
        root = <ƒ.Graph>ƒ.Project.resources["Graph|2021-06-25T09:21:35.035Z|86602"];
        ƒ.Debug.log("Graph:", root);
        // setup the viewport
        let canvas: HTMLCanvasElement = document.querySelector("canvas");
        viewport.initialize("InteractiveViewport", root, cmpCamera, canvas);
        ƒ.Debug.log("Viewport:", viewport);
        connectedContainer = root.getChildrenByName("connectedContainer")[0];
        //   attachedContainer = root.getChildrenByName("attachedContainer")[0];
        connectedNode = connectedContainer.getChildrenByName("connectedNode")[0];
        connectedNode2 = connectedNode.getChildrenByName("connectedNode2")[0];
        attachedNode = connectedContainer.getChildrenByName("attachedNode")[0];
        createRigidBodies();
        settingUpJoint();
        // connectedContainer.appendChild(connectedNode);
        // connectedNode.appendChild(connectedNode2);
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
        ƒ.Loop.start();
    }
    function update(_event: Event): void {

        ƒ.Physics.world.simulate(ƒ.Loop.timeFrameReal / 1000);

        ƒ.Physics.settings.debugDraw = true;

        document.addEventListener("keydown", hndKey);
        viewport.draw();
    }
    function setUpCam(): void {

        cmpCamera.mtxPivot.translate(new ƒ.Vector3(15, 40, -10));
        cmpCamera.mtxPivot.lookAt(ƒ.Vector3.ZERO());

    }

    function createRigidBodies(): void {
        connectedNodeRigidbody = new ƒ.ComponentRigidbody(
            1, ƒ.PHYSICS_TYPE.KINEMATIC,
            ƒ.COLLIDER_TYPE.CUBE,
            ƒ.PHYSICS_GROUP.DEFAULT
        );
        //connectedNodeRigidbody.restitution = 0.8;
        //connectedNodeRigidbody.friction = 2.5;
        connectedNode.addComponent(connectedNodeRigidbody);
        //  connectedNodeRigidbody.gravityScale = 0;

        connectedNodeRigidbody2 = new ƒ.ComponentRigidbody(
            1, ƒ.PHYSICS_TYPE.KINEMATIC,
            ƒ.COLLIDER_TYPE.CUBE,
            ƒ.PHYSICS_GROUP.DEFAULT
        );
        //connectedNodeRigidbody.restitution = 0.8;
        //connectedNodeRigidbody.friction = 2.5;
        connectedNode2.addComponent(connectedNodeRigidbody2);



        // connectedContainerRigidbody = new ƒ.ComponentRigidbody(
        //     1, ƒ.PHYSICS_TYPE.STATIC,
        //     ƒ.COLLIDER_TYPE.CUBE,
        //     ƒ.PHYSICS_GROUP.DEFAULT
        // );
        // connectedContainer.addComponent(connectedContainerRigidbody);
        attachedNodeRigidbody = new ƒ.ComponentRigidbody(
            1, ƒ.PHYSICS_TYPE.STATIC,
            ƒ.COLLIDER_TYPE.CUBE,
            ƒ.PHYSICS_GROUP.DEFAULT
        );
        attachedNode.addComponent(attachedNodeRigidbody);
        // attachedNodeRigidbody.gravityScale = 0;
        // attachedContainerRigidbody = new ƒ.ComponentRigidbody(
        //     1, ƒ.PHYSICS_TYPE.STATIC,
        //     ƒ.COLLIDER_TYPE.CUBE,
        //     ƒ.PHYSICS_GROUP.DEFAULT
        // );
        // attachedContainer.addComponent(attachedContainerRigidbody);
    }
    function settingUpJoint(): void {
        sphericalJoint = new ƒ.ComponentJointSpherical(attachedNodeRigidbody, connectedNodeRigidbody);
        // environmentTransform.getContainer().addComponent(sphericalJoint);
        connectedNode.addComponent(sphericalJoint);
        sphericalJoint.springDamping = 0.5;
        sphericalJoint.springFrequency = 1;

        ƒ.Physics.adjustTransforms(connectedContainer, true);

        // glueJoint = new ƒ.ComponentJointRevolute(connectedContainerRigidbody, connectedNodeRigidbody);
        // connectedContainer.addComponent(glueJoint);
        // // glueJoint.springDamping = 1;
        // glueJoint.motorLimitLower = 2;
        // glueJoint.motorLimitUpper = 1;

        // glueJoint2 = new ƒ.ComponentJointRevolute(connectedNodeRigidbody, connectedNodeRigidbody2);
        // connectedNode.addComponent(glueJoint2);
        // //  glueJoint2.springDamping = 1;
        // glueJoint2.motorLimitLower = 2;
        // glueJoint2.motorLimitUpper = 1;

    }
    function hndKey(_event: KeyboardEvent): void {
        if (_event.code == ƒ.KEYBOARD_CODE.G) {
            console.log(sphericalJoint.connectedRigidbody);

            //sphericalJoint.connectedRigidbody.applyForce(new ƒ.Vector3(0, 0, 1 * 100));
            sphericalJoint.connectedRigidbody.applyAngularImpulse(new ƒ.Vector3(0, 0, 0.75));
            //      applyAngularImpulse(new ƒ.Vector3(0, 0, 1));

            // .applyForce(new ƒ.Vector3(0, 0, 1 * 100));
            console.log("G is pressed");

        }
    }
}