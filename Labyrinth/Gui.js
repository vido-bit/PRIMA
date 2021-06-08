var Labyrinth;
(function (Labyrinth) {
    var ƒui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        constructor() {
            super(...arguments);
            this.level = 0;
        }
        reduceMutator(_mutator) {
            /* */
        }
    }
    Labyrinth.gameState = new GameState();
    class Gui {
        static start() {
            let domHud = document.querySelector("div");
            Gui.controller = new ƒui.Controller(Labyrinth.gameState, domHud);
            Gui.controller.updateUserInterface();
        }
    }
    Labyrinth.Gui = Gui;
})(Labyrinth || (Labyrinth = {}));
//# sourceMappingURL=Gui.js.map