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
    let projectileNode = new ƒ.Node("Projektilnode");
    let flak = new SpaceInvaders.Flak();
    SpaceInvaders.space.addChild(projectileNode);
    SpaceInvaders.space.addChild(flak);
    let invaders = new ƒ.Node("Invaders");
    //export let motherShip: ƒ.Node = new ƒ.Node("MotherShip");
    //let node: ƒ.Node = new ƒ.Node("Test");
    function init(_event) {
        const canvas = document.querySelector("canvas");
        let mothership = new SpaceInvaders.MotherShip();
        SpaceInvaders.space.addChild(mothership);
        for (let column = 0; column < 10; column++) {
            for (let row = 0; row < 3; row++) {
                let pos = new ƒ.Vector2();
                pos.x = column * 1.5 - 7;
                pos.y = row + 7;
                let invader = new SpaceInvaders.Invader(pos);
                invader.setRectPosition();
                invaders.addChild(invader);
                console.log(invader.rect.position.y.toString(), invader.mtxLocal.translation.y.toString());
            }
        }
        SpaceInvaders.space.addChild(invaders);
        new ƒ.Timer(ƒ.Time.game, 500, 0, moveInvaders);
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
        console.log(SpaceInvaders.space);
    }
    function update(_event) {
        let projectile;
        let tempo = (ƒ.Loop.timeFrameReal / 1000) * 6;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]) && flak.mtxLocal.translation.x > -7)
            flak.mtxLocal.translateX(-tempo);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) && flak.mtxLocal.translation.x < 7)
            flak.mtxLocal.translateX(tempo);
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            let pos = new ƒ.Vector2();
            pos.x = flak.mtxLocal.translation.x;
            pos.y = flak.mtxLocal.translation.y + 2;
            projectile = new SpaceInvaders.Projectile(pos);
            projectileNode.addChild(projectile);
        }
        for (projectile of projectileNode.getChildren()) {
            projectile.move();
        }
        for (projectile of projectileNode.getChildren()) {
            if (projectile.mtxLocal.translation.y > 12)
                projectileNode.removeChild(projectile);
        }
        checkProjectileCollision();
        viewport.draw();
        moveInvaders();
    }
    function checkProjectileCollision() {
        for (let projectile of projectileNode.getChildren()) {
            console.log(projectileNode.getChildren());
            for (let invader of invaders.getChildren()) {
                if (projectile.checkCollision(invader)) {
                    projectileNode.removeChild(projectile);
                    invaders.removeChild(invader);
                    console.log("Collision");
                }
            }
        }
    }
    function moveInvaders() {
        /*
          invaders.mtxLocal.translate(velocityInvaders.toVector3());
  
          let mtcInverse: ƒ.Matrix4x4 =  ƒ.Matrix4x4.INVERSION(invaders.mtxLocal);
          let position: ƒ.Vector3 = flak.mtxLocal.translation;
          position.transform(mtxInverse, true);
          console.log(position.toString());
          */
    }
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=SpaceInvaders.js.map