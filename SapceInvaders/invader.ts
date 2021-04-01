
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
  export class Projektile extends ƒ.Node {
    constructor(_x: number, _y: number) {
      super("Projektile" + (_x + _y));

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