namespace PhysicsScene {
    import ƒ = FudgeCore;
    export class Player extends ƒ.Node {
        public jumpForce: number = 120;
        public cmpCamera: ƒ.ComponentCamera;
        public cmpRigid: ƒ.ComponentRigidbody;
        public camNode: ƒ.Node = new ƒ.Node("Cam");
        public direction: ƒ.Vector3 = ƒ.Vector3.ZERO();
        private defaultSpeed: number = 5;
        private movementSpeed: number = 5;
        private isGrounded: boolean = false;
        private weight: number = 75;
        private activeProp: ƒ.Node = null;
        private hasProp: boolean = false;
        private propRigid: ƒ.ComponentRigidbody = null;
        constructor(_cmpCamera: ƒ.ComponentCamera) {
            super("Player");
            //Transform
            let cmpTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform();
            cmpTransform.mtxLocal.scale(new ƒ.Vector3(1, 1, 1));
            cmpTransform.mtxLocal.translate(new ƒ.Vector3(0, 4, 0));
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
            let cmpCamTransform: ƒ.ComponentTransform = new ƒ.ComponentTransform();
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
        public move(_forward: number, _sideward: number): void {
            let playerForward: ƒ.Vector3 = this.camNode.mtxLocal.getX();
            let playerSideward: ƒ.Vector3 = this.camNode.mtxLocal.getZ();
            playerSideward.normalize();
            playerForward.normalize();
            let movementVel: ƒ.Vector3 = new ƒ.Vector3();
            movementVel.z = (playerForward.z * _forward + playerSideward.z * _sideward) * this.movementSpeed;
            movementVel.y = this.cmpRigid.getVelocity().y;
            movementVel.x = (playerForward.x * _forward + playerSideward.x * _sideward) * this.movementSpeed;
            this.cmpRigid.setVelocity(movementVel);
            this.direction = movementVel;
        }

    }
}