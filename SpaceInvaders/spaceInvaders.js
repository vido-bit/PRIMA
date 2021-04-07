var SpaceInvaders;
(function (SpaceInvaders) {
    var ƒ = FudgeCore;
    window.addEventListener("load", init);
    let viewport = new ƒ.Viewport();
    SpaceInvaders.invaderMesh = new ƒ.MeshSphere("Invader");
    SpaceInvaders.flakMesh = new ƒ.MeshQuad("Flak");
    SpaceInvaders.barricadeMesh = new ƒ.MeshQuad("Barricade");
    SpaceInvaders.material = new ƒ.Material("Florian", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 1, 1, 1)));
    SpaceInvaders.space = new ƒ.Node("Space");
    SpaceInvaders.kanone = new ƒ.Node("Kanonenrohr");
    SpaceInvaders.projectileNode = new ƒ.Node("Projektilnode");
    SpaceInvaders.space.addChild(SpaceInvaders.projectileNode);
    let flak = new SpaceInvaders.Flak();
    SpaceInvaders.space.addChild(flak);
    //export let motherShip: ƒ.Node = new ƒ.Node("MotherShip");
    //let node: ƒ.Node = new ƒ.Node("Test");
    function init(_event) {
        const canvas = document.querySelector("canvas");
        let motherships = new SpaceInvaders.MotherShip();
        SpaceInvaders.space.addChild(motherships);
        let invaders = new ƒ.Node("Invaders");
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 3; j++) {
                let invader = new SpaceInvaders.Invader(i, j);
                invaders.addChild(invader);
            }
        }
        SpaceInvaders.space.addChild(invaders);
        let barricades = new SpaceInvaders.Barricade();
        SpaceInvaders.space.addChild(barricades);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 60);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(18);
        cmpCamera.mtxPivot.translateY(77 / 13);
        cmpCamera.mtxPivot.rotateY(180);
        viewport.initialize("Viewport", SpaceInvaders.space, cmpCamera, canvas);
        viewport.draw();
    }
    function update(_event) {
        let tempo = (ƒ.Loop.timeFrameReal / 1000) * 6;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]) && flak.mtxLocal.translation.x > -7)
            flak.mtxLocal.translateX(-tempo);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) && flak.mtxLocal.translation.x < 7)
            flak.mtxLocal.translateX(tempo);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            // let projectiles: ƒ.Node = new ƒ.Node("Projektile");
            //for (let i: number = 0; i < 3; i++) {
            let projectile = new SpaceInvaders.Projectile(flak.mtxLocal.translation.x + 1, flak.mtxLocal.translation.y);
            //  projectiles.addChild(projectile);
            SpaceInvaders.projectileNode.addChild(projectile);
        }
        //projectileNode.mtxLocal.translateY(-2);
        SpaceInvaders.projectileNode.getChildrenByName("Projektile").forEach((projectile) => {
            projectile.mtxLocal.translateY(tempo);
        });
        viewport.draw();
    }
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=SpaceInvaders.js.map