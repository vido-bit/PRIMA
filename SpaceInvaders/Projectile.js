var SpaceInvaders;
(function (SpaceInvaders) {
    var ƒ = FudgeCore;
    class Projectile extends ƒ.Node {
        constructor(_x, _y) {
            super("Projektile");
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translateX(_x - 1);
            this.mtxLocal.translateY(_y * (3 / 2) + 2.5);
            let projectileMesh = new ƒ.ComponentMesh(SpaceInvaders.flakMesh);
            projectileMesh.mtxPivot.scaleX(1 / 12);
            projectileMesh.mtxPivot.scaleY(5 / 13);
            this.addComponent(projectileMesh);
            this.addComponent(new ƒ.ComponentMaterial(SpaceInvaders.material));
        }
    }
    SpaceInvaders.Projectile = Projectile;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Projectile.js.map