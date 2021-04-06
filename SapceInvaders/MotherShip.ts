
namespace SpaceInvaders {
    import ƒ = FudgeCore;

    export class MotherShip extends ƒ.Node {
        constructor() {
            super("Mutterschiff");

            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translateY(140 / 13);

            this.addComponent(new ƒ.ComponentMesh(invaderMesh));
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scaleX(10 / 4);
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(1);

            this.addComponent(new ƒ.ComponentMaterial(material));

            
        }
    }
}
