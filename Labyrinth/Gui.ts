namespace Labyrinth {
  import ƒui = FudgeUserInterface;

  class GameState extends ƒ.Mutable {
    public level: number = 0;
    protected reduceMutator(_mutator: ƒ.Mutator): void {
      /* */
    }
  }

  export let gameState: GameState = new GameState();

  export class Gui {
    private static controller: ƒui.Controller;

    public static start(): void {
      let domHud: HTMLDivElement = document.querySelector("div");
      Gui.controller = new ƒui.Controller(gameState, domHud);
      Gui.controller.updateUserInterface();
    }
  }
}
