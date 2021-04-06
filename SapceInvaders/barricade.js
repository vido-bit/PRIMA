var SpaceInvaders;
(function (SpaceInvaders) {
    var ƒ = FudgeCore;
    class Barricade extends ƒ.Node {
        constructor() {
            super("Barcode-Barrikade");
            let nStripes = 21;
            for (let iBarricade = 0; iBarricade < 4; iBarricade++) {
                let barricade = new ƒ.Node("Barricade" + iBarricade);
                barricade.addComponent(new ƒ.ComponentTransform());
                barricade.getComponent(ƒ.ComponentTransform).mtxLocal.translateX((iBarricade - 1.5) * 53 / 13);
                barricade.getComponent(ƒ.ComponentTransform).mtxLocal.translateY(nStripes / 13);
                for (let iStripe = 0; iStripe < nStripes; iStripe++) {
                    let barricadeStripe = new ƒ.Node("BarricadeStripe" + (iStripe + iBarricade * nStripes));
                    let posX = iStripe - (nStripes - 1) / 2;
                    let scaleX = 1 / 12;
                    barricadeStripe.addComponent(new ƒ.ComponentTransform());
                    barricadeStripe.getComponent(ƒ.ComponentTransform).mtxLocal.translateX(posX * scaleX);
                    barricadeStripe.getComponent(ƒ.ComponentTransform).mtxLocal.translateY(2.5);
                    barricadeStripe.addComponent(new ƒ.ComponentMesh(SpaceInvaders.barricadeMesh));
                    barricadeStripe.getComponent(ƒ.ComponentMesh).mtxPivot.scaleX(scaleX);
                    barricadeStripe.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(posX - (1 / 1000000000));
                    barricadeStripe.addComponent(new ƒ.ComponentMaterial(SpaceInvaders.material));
                    barricade.addChild(barricadeStripe);
                }
                this.addChild(barricade);
            }
        }
    }
    SpaceInvaders.Barricade = Barricade;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Barricade.js.map