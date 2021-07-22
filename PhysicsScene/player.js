var PhysicsScene;
(function (PhysicsScene) {
    var ƒ = FudgeCore;
    class Player extends ƒ.Node {
        jumpForce = 50;
        cmpCamera;
        cmpRigid;
        camNode = new ƒ.Node("Cam");
        direction = ƒ.Vector3.ZERO();
        defaultSpeed = 5;
        movementSpeed = 5;
        isGrounded = false;
        weight = 75;
        activeProp = null;
        hasProp = false;
        propRigid = null;
        constructor(_cmpCamera) {
            super("Player");
            //Transform
            let cmpTransform = new ƒ.ComponentTransform();
            cmpTransform.mtxLocal.scale(new ƒ.Vector3(1, 1, 1));
            cmpTransform.mtxLocal.translate(new ƒ.Vector3(0, 4, 0));
            //   cmpTransform.mtxLocal.rotate(new ƒ.Vector3(0,90,0));
            this.addComponent(cmpTransform);
            //Rigid
            this.cmpRigid = new ƒ.ComponentRigidbody(this.weight, ƒ.PHYSICS_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.CAPSULE, ƒ.PHYSICS_GROUP.DEFAULT);
            this.addComponent(this.cmpRigid);
            this.cmpRigid.rotationInfluenceFactor = new ƒ.Vector3(0, 0, 0);
            this.cmpRigid.friction = 0.01;
            this.cmpRigid.restitution = 0;
            //Camera
            this.addChild(this.camNode);
            this.cmpCamera = _cmpCamera;
            this.cmpCamera.projectCentral(1, 90, ƒ.FIELD_OF_VIEW.DIAGONAL, 0.2, 2000);
            this.cmpCamera.clrBackground = ƒ.Color.CSS("Aquamarine");
            this.cmpCamera.mtxPivot.rotate(new ƒ.Vector3(0, 90, 0));
            let cmpCamTransform = new ƒ.ComponentTransform();
            this.camNode.addComponent(cmpCamTransform);
            this.camNode.addComponent(this.cmpCamera);
            this.camNode.mtxLocal.translateY(1);
            /*
             constructor()
             
             function createPlayer(): void {
             playerBody = new ƒ.ComponentRigidbody(0.1, ƒ.PHYSICS_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.CAPSULE, ƒ.PHYSICS_GROUP.DEFAULT);
             playerBody.restitution = 0.5;
             playerBody.rotationInfluenceFactor = ƒ.Vector3.ZERO();
             playerBody.friction = 1;
             player = new ƒ.Node("player");
             player.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(3))));
             player.addComponent(playerBody);
             root.appendChild(player);
         }
         */
        }
        move(_forward, _sideward) {
            let playerForward = this.camNode.mtxLocal.getX();
            let playerSideward = this.camNode.mtxLocal.getZ();
            playerSideward.normalize();
            playerForward.normalize();
            let movementVel = new ƒ.Vector3();
            movementVel.z = (playerForward.z * _forward + playerSideward.z * _sideward) * this.movementSpeed;
            movementVel.y = this.cmpRigid.getVelocity().y;
            movementVel.x = (playerForward.x * _forward + playerSideward.x * _sideward) * this.movementSpeed;
            this.cmpRigid.setVelocity(movementVel);
            this.direction = movementVel;
        }
    }
    PhysicsScene.Player = Player;
})(PhysicsScene || (PhysicsScene = {}));
//# sourceMappingURL=Player.js.map