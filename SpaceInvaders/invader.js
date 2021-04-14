var SpaceInvaders;
(function (SpaceInvaders) {
    var ƒ = FudgeCore;
    let Invader = /** @class */ (() => {
        class Invader extends SpaceInvaders.QuadNode {
            constructor(_pos) {
                let scale = new ƒ.Vector2(1, 2 / 3);
                super("Invader" + (Invader.count++), _pos, scale);
                /*
                      this.addComponent(new ƒ.ComponentTransform());
                      this.mtxLocal.translateX(_x * 2 - 6);
                      this.mtxLocal.translateY(_y + 7);
                
                      
                      let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(invaderMesh);
                      cmpMesh.mtxPivot.scaleX(4 / 5);
                      cmpMesh.mtxPivot.scaleY(8 / 21);
                      this.addComponent(cmpMesh);
                      */
                // this.getComponent(ƒ.ComponentMaterial).clrPrimary = new ƒ.Color(0.5, 1, 0.1, 1);
            }
        }
        Invader.count = 0;
        return Invader;
    })();
    SpaceInvaders.Invader = Invader;
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=Invader.js.map