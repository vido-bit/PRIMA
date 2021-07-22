var Labyrinth;
(function (Labyrinth) {
    var ƒ = FudgeCore;
    class NeigePlattorm extends ƒ.Node {
        xAchse;
        yAchse;
        zAchse;
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
            let node = this;
        }
    }
    Labyrinth.NeigePlattorm = NeigePlattorm;
})(Labyrinth || (Labyrinth = {}));
//# sourceMappingURL=NeigePlattform.js.map