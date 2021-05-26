var PhysicsScene;
(function (PhysicsScene) {
    var ƒ = FudgeCore;
    class Character extends ƒ.Node {
        constructor(_cmpCamera) {
            super("Character");
            this.jumpForce = 50;
            this.camNode = new ƒ.Node("Cam");
            this.direction = ƒ.Vector3.ZERO();
            this.defaultSpeed = 5;
            this.movementSpeed = 5;
            this.isGrounded = false;
            this.weight = 75;
            this.activeProp = null;
            this.hasProp = false;
            this.propRigid = null;
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
             
             function createCharacter(): void {
             CharacterBody = new ƒ.ComponentRigidbody(0.1, ƒ.PHYSICS_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.CAPSULE, ƒ.PHYSICS_GROUP.DEFAULT);
             CharacterBody.restitution = 0.5;
             CharacterBody.rotationInfluenceFactor = ƒ.Vector3.ZERO();
             CharacterBody.friction = 1;
             Character = new ƒ.Node("Character");
             Character.addComponent(new ƒ.ComponentTransform(ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Y(3))));
             Character.addComponent(CharacterBody);
             root.appendChild(Character);
         }
         */
        }
        move(_forward, _sideward) {
            let CharacterForward = this.camNode.mtxLocal.getX();
            let CharacterSideward = this.camNode.mtxLocal.getZ();
            CharacterSideward.normalize();
            CharacterForward.normalize();
            let movementVel = new ƒ.Vector3();
            movementVel.z = (CharacterForward.z * _forward + CharacterSideward.z * _sideward) * this.movementSpeed;
            movementVel.y = this.cmpRigid.getVelocity().y;
            movementVel.x = (CharacterForward.x * _forward + CharacterSideward.x * _sideward) * this.movementSpeed;
            this.cmpRigid.setVelocity(movementVel);
            this.direction = movementVel;
        }
    }
    PhysicsScene.Character = Character;
})(PhysicsScene || (PhysicsScene = {}));
//# sourceMappingURL=Player.js.map