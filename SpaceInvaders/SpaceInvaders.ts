namespace SpaceInvaders {
    import ƒ = FudgeCore;
    window.addEventListener("load", init);
    let viewport: ƒ.Viewport = new ƒ.Viewport();
    export let invaderMesh: ƒ.Mesh = new ƒ.MeshSphere("Invader");
    export let flakMesh: ƒ.Mesh = new ƒ.MeshQuad("Flak")
    export let barricadeMesh: ƒ.Mesh = new ƒ.MeshQuad("Barricade");
    export let material: ƒ.Material = new ƒ.Material("Florian", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 1, 1, 1)));
    export let space: ƒ.Node = new ƒ.Node("Space");
    export let kanone: ƒ.Node = new ƒ.Node("Kanonenrohr");
    export let projectileNode: ƒ.Node = new ƒ.Node("Projektilnode");
    space.addChild(projectileNode);
    let flak: ƒ.Node = new Flak();
    space.addChild(flak);
    
    //export let motherShip: ƒ.Node = new ƒ.Node("MotherShip");
    //let node: ƒ.Node = new ƒ.Node("Test");
    function init(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");

        let motherships: ƒ.Node = new MotherShip();
        space.addChild(motherships);

        let invaders: ƒ.Node = new ƒ.Node("Invaders");
        for (let i: number = 0; i < 7; i++) {
            for (let j: number = 0; j < 3; j++) {
                let invader: ƒ.Node = new Invader(i, j);
                invaders.addChild(invader);
            }
        }

        space.addChild(invaders);

        let barricades: ƒ.Node = new Barricade();
        space.addChild(barricades);


        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);

        let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(18);
        cmpCamera.mtxPivot.translateY(77 / 13);
        cmpCamera.mtxPivot.rotateY(180);

        viewport.initialize("Viewport", space, cmpCamera, canvas);
        viewport.draw();
    }

    function update(_event: Event): void {

        let tempo: number = (ƒ.Loop.timeFrameReal / 1000) * 6;


        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]) && flak.mtxLocal.translation.x > -7)
            flak.mtxLocal.translateX(-tempo);

        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) && flak.mtxLocal.translation.x < 7)
            flak.mtxLocal.translateX(tempo);

        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            // let projectiles: ƒ.Node = new ƒ.Node("Projektile");
            //for (let i: number = 0; i < 3; i++) {
            let projectile: ƒ.Node = new Projectile(flak.mtxLocal.translation.x + 1, flak.mtxLocal.translation.y);
            //  projectiles.addChild(projectile);
            projectileNode.addChild(projectile);
            
        }
        
        //projectileNode.mtxLocal.translateY(-2);
        projectileNode.getChildrenByName("Projektile").forEach((projectile) => {
            projectile.mtxLocal.translateY(tempo); 

        }
        );

  

        viewport.draw();
        //   console.log(flak.mtxLocal.translation.x);
    }
    // console.log(projectileNode);
}
