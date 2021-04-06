var SpaceInvaders;
(function (SpaceInvaders) {
    var ƒ = FudgeCore;
    class MotherShip extends ƒ.Node {
        constructor() {
            super("Mutterschiff");
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translateY(140 / 13);
            this.addComponent(new ƒ.ComponentMesh(SpaceInvaders.invaderMesh));
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scaleX(10 / 4);
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(1);
            this.addComponent(new ƒ.ComponentMaterial(SpaceInvaders.material));
        }
    }
    SpaceInvaders.MotherShip = MotherShip;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=MotherShip.js.map