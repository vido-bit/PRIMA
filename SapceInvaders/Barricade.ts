
namespace SpaceInvaders {
    import ƒ = FudgeCore;

    export class Barricade extends ƒ.Node {
        constructor() {
            super("Barcode-Barrikade");
            let nStripes: number = 21;


            for (let iBarricade: number = 0; iBarricade < 4; iBarricade++) {
                let barricade: ƒ.Node = new ƒ.Node("Barricade" + iBarricade);

                barricade.addComponent(new ƒ.ComponentTransform());
                barricade.getComponent(ƒ.ComponentTransform).mtxLocal.translateX((iBarricade - 1.5) * 53 / 13);
                barricade.getComponent(ƒ.ComponentTransform).mtxLocal.translateY(nStripes / 13);

                for (let iStripe: number = 0; iStripe < nStripes; iStripe++) {
                    let barricadeStripe: ƒ.Node = new ƒ.Node("BarricadeStripe" + (iStripe + iBarricade * nStripes));

                    let posX: number = iStripe - (nStripes - 1) / 2;
                    let scaleX: number = 1 / 12;

                    barricadeStripe.addComponent(new ƒ.ComponentTransform());
                    barricadeStripe.getComponent(ƒ.ComponentTransform).mtxLocal.translateX(posX * scaleX);
                    barricadeStripe.getComponent(ƒ.ComponentTransform).mtxLocal.translateY(2.5);

                    barricadeStripe.addComponent(new ƒ.ComponentMesh(barricadeMesh));
                    barricadeStripe.getComponent(ƒ.ComponentMesh).mtxPivot.scaleX(scaleX);
                    barricadeStripe.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(posX - (1 / 1000000000));

                    barricadeStripe.addComponent(new ƒ.ComponentMaterial(material));

                    barricade.addChild(barricadeStripe);
                }

                this.addChild(barricade);
            }
        }
    }
}