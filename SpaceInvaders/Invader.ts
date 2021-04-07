
namespace SpaceInvaders {
  import ƒ = FudgeCore;

  export class Invader extends ƒ.Node {
    constructor(_x: number, _y: number) {
      super("Invader" + (_x + _y * 7));

      this.addComponent(new ƒ.ComponentTransform());
      this.mtxLocal.translateX(_x * 2 - 6);
      this.mtxLocal.translateY(_y + 7);

      let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(invaderMesh);
      cmpMesh.mtxPivot.scaleX(4 / 5);
      cmpMesh.mtxPivot.scaleY(8 / 21);
      this.addComponent(cmpMesh);

      this.addComponent(new ƒ.ComponentMaterial(material));
    }
  }

}