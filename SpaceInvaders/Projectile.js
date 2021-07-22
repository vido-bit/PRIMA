var SpaceInvaders;
(function (SpaceInvaders) {
    var ƒ = FudgeCore;
    class Projectile extends SpaceInvaders.QuadNode {
        static count = 0;
        constructor(_pos) {
            let scale = new ƒ.Vector2(1 / 12, 1 / 5);
            super("Projektile" + (Projectile.count++), _pos, scale);
        }
        /*
                    this.addComponent(new ƒ.ComponentTransform());
                    this.mtxLocal.translateX(_x - 1);
                    this.mtxLocal.translateY(_y * (3 / 2) + 2.5);
        
                    let projectileMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(flakMesh);
                    projectileMesh.mtxPivot.scaleX(1 / 12);
                    projectileMesh.mtxPivot.scaleY(1 / 5);
                    this.addComponent(projectileMesh);
        
                    this.addComponent(new ƒ.ComponentMaterial(material));
        
                }
                */
        move() {
            this.mtxLocal.translateY(5 * ƒ.Loop.timeFrameReal / 1000);
            this.setRectPosition();
        }
    }
    SpaceInvaders.Projectile = Projectile;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Projectile.js.map