
namespace SpaceInvaders {
    import ƒ = FudgeCore;


    export class Projectile extends ƒ.Node {
        constructor(_x: number, _y: number) {
            super("Projektile");

            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translateX(_x - 1);
            this.mtxLocal.translateY(_y * (3 / 2) + 2.5);

            let projectileMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(flakMesh);
            projectileMesh.mtxPivot.scaleX(1 / 12);
            projectileMesh.mtxPivot.scaleY(5 / 13);
            this.addComponent(projectileMesh);

            this.addComponent(new ƒ.ComponentMaterial(material));

        }
    }

}

