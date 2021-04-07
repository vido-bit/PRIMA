
namespace SpaceInvaders {
    import ƒ = FudgeCore;

    export class Flak extends ƒ.Node {

        constructor() {
            super("flak");
            this.addComponent(new ƒ.ComponentTransform());
            this.addComponent(new ƒ.ComponentMesh(flakMesh));
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(7 / 4);
            this.getComponent(ƒ.ComponentMesh).mtxPivot.scaleX(2);
            this.addComponent(new ƒ.ComponentMaterial(material));

            space.addChild(this);
            
            kanone.addComponent(new ƒ.ComponentMesh(flakMesh));
            kanone.addComponent(new ƒ.ComponentTransform());
            kanone.getComponent(ƒ.ComponentMesh).mtxPivot.scale(new ƒ.Vector3(0.5, 1.5, 0.5));
            kanone.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(0.5);
            
            //let pipeMaterial: ƒ.Material = new ƒ.Material("flakMaterial", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0, 0, 1, 1)));
            // let cmpPipeMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(pipeMaterial);
            
            kanone.addComponent(new ƒ.ComponentMaterial(material));
            this.appendChild(kanone);
        }
    }
}