var SpaceInvaders;
(function (SpaceInvaders) {
    var ƒ = FudgeCore;
    class Flak extends ƒ.Node {
        constructor() {
            super("flak");
            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(new ƒ.ComponentMesh(SpaceInvaders.flakMesh));
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(7 / 4);
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scaleX(2);
            this.addComponent(new ƒ.ComponentMaterial(SpaceInvaders.material));
            SpaceInvaders.space.addChild(this);
            SpaceInvaders.kanone.addComponent(new ƒ.ComponentMesh(SpaceInvaders.flakMesh));
            SpaceInvaders.kanone.addComponent(new ƒ.ComponentTransform());
            SpaceInvaders.kanone.getComponent(ƒ.ComponentMesh).mtxPivot.scale(new ƒ.Vector3(0.5, 1.5, 0.5));
            SpaceInvaders.kanone.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(0.5);
            //let pipeMaterial: ƒ.Material = new ƒ.Material("flakMaterial", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0, 0, 1, 1)));
            // let cmpPipeMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(pipeMaterial);
            SpaceInvaders.kanone.addComponent(new ƒ.ComponentMaterial(SpaceInvaders.material));
            this.appendChild(SpaceInvaders.kanone);
        }
    }
    SpaceInvaders.Flak = Flak;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Flak.js.map