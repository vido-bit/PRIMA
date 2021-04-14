
namespace SpaceInvaders {
    import ƒ = FudgeCore;


    export class Projectile extends QuadNode {
        private static count: number = 0;

        constructor(_pos: ƒ.Vector2) {
            let scale: ƒ.Vector2 = new ƒ.Vector2(1 / 12, 1 / 5);
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
        public move(): void {
            this.mtxLocal.translateY(5 * ƒ.Loop.timeFrameReal / 1000);
            this.setRectPosition();
        }

    }

}