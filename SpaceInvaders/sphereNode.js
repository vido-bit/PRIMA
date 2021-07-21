var SpaceInvaders;
(function (SpaceInvaders) {
    var ƒ = FudgeCore;
    class SphereNode extends ƒ.Node {
        static mesh = new ƒ.MeshSphere("Sphere");
        static material = new ƒ.Material("White", ƒ.ShaderUniColor, new ƒ.CoatColored());
        rect;
        constructor(_name, _pos, _scale) {
            super(_name);
            this.rect = new ƒ.Rectangle(_pos.x, _pos.y, _scale.x, _scale.y, ƒ.ORIGIN2D.CENTER);
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translateX(_pos.x);
            this.mtxLocal.translateY(_pos.y);
            let sphereMesh = new ƒ.ComponentMesh(SphereNode.mesh);
            sphereMesh.mtxPivot.scaleX(_scale.x);
            sphereMesh.mtxPivot.scaleY(_scale.y);
            this.addComponent(sphereMesh);
            this.addComponent(new ƒ.ComponentMaterial(SphereNode.material));
        }
        checkCollision(_target) {
            return this.rect.collides(_target.rect);
        }
        setRectPosition() {
            this.rect.position.x = this.mtxLocal.translation.x; // - this.rect.size.x / 2;
            this.rect.position.y = this.mtxLocal.translation.y; // - this.rect.size.y / 2;
        }
    }
    SpaceInvaders.SphereNode = SphereNode;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=sphereNode.js.map