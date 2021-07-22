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
      let uiDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("user-interface");
      let uiHeadline: HTMLHeadingElement = <HTMLHeadingElement>document.getElementById("ui-headline");
      let uiInput: HTMLInputElement = <HTMLInputElement>document.getElementById("level-choice");
      uiHeadline.innerText = "Level: ";
      Gui.controller = new ƒui.Controller(gameState, uiDiv);
      Gui.controller.updateUserInterface();
    }
  }
}
