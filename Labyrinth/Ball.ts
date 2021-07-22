namespace Labyrinth {
    import ƒ = FudgeCore;
    export class Ball extends ƒ.Node {
        public ballMtr: ƒ.Material = new ƒ.Material("ballMtr", ƒ.ShaderFlat, new ƒ.CoatColored(new ƒ.Color(255, 0, 0)));
        public sphereMesh: ƒ.MeshSphere = new ƒ.MeshSphere("kugel");
        public cmpRigidbodyBall: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(
            10,
            ƒ.PHYSICS_TYPE.DYNAMIC,
            ƒ.COLLIDER_TYPE.SPHERE,
            ƒ.PHYSICS_GROUP.GROUP_2

        );

        constructor(_mass: number, _restitution: number, _friction: number) {
            super("ball");
            this.addComponent(new ƒ.ComponentMaterial(this.ballMtr));
            this.addComponent(new ƒ.ComponentMesh(this.sphereMesh));
            this.addComponent(new ƒ.ComponentTransform());
            let ballTransform: ƒ.ComponentTransform = this.getComponent(ƒ.ComponentTransform);
            ballTransform.mtxLocal.translate(new ƒ.Vector3(2, 5, 2));
            ballTransform.mtxLocal.scale(new ƒ.Vector3(1, 1, 1));
            this.addComponent(this.cmpRigidbodyBall);
            this.cmpRigidbodyBall.mass = _mass;
            this.cmpRigidbodyBall.restitution = _restitution;
            this.cmpRigidbodyBall.friction = _friction;
        }
    }
}