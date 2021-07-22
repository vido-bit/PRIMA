namespace Labyrinth {
    import ƒ = FudgeCore;
    export class NeigePlattorm extends ƒ.Node {

        private readonly xAchse: ƒ.Node;
        private readonly yAchse: ƒ.Node;
        private readonly zAchse: ƒ.Node;

        constructor() {
            super("NeigePlattform");

            this.yAchse = this;
            this.addComponent(new ƒ.ComponentTransform());

            this.xAchse = new ƒ.Node("XAchse");
            this.xAchse.addComponent(new ƒ.ComponentTransform());
            super.addChild(this.xAchse);

            this.zAchse = new ƒ.Node("zAchse");
            this.zAchse.addComponent(new ƒ.ComponentTransform());
            this.xAchse.addChild(this.zAchse);
            let node: ƒ.Node = this;
        }

    }
}