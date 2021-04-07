var SpaceInvaders;
(function (SpaceInvaders) {
    var ƒ = FudgeCore;
    class Invader extends ƒ.Node {
        constructor(_x, _y) {
            super("Invader" + (_x + _y * 7));
            this.addComponent(new ƒ.ComponentTransform());
            this.mtxLocal.translateX(_x * 2 - 6);
            this.mtxLocal.translateY(_y + 7);
            let cmpMesh = new ƒ.ComponentMesh(SpaceInvaders.invaderMesh);
            cmpMesh.mtxPivot.scaleX(4 / 5);
            cmpMesh.mtxPivot.scaleY(8 / 21);
            this.addComponent(cmpMesh);
            this.addComponent(new ƒ.ComponentMaterial(SpaceInvaders.material));
        }
    }
    SpaceInvaders.Invader = Invader;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Invader.js.map