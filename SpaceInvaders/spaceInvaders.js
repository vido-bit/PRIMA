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
    let barricades = new ƒ.Node("Barrikaden");
    let invaders = new ƒ.Node("Invaders");
    let velocityInvaders = new ƒ.Vector2(0.5, 0);
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
        for (let iBarricade = 0; iBarricade < 4; iBarricade++) {
            let barricade;
            let nStripes = 21;
            //    barricade.addComponent(new ƒ.ComponentTransform());
            //    barricade.getComponent(ƒ.ComponentTransform).mtxLocal.translateX((iBarricade - 1.5) * 53 / 13);
            //    barricade.getComponent(ƒ.ComponentTransform).mtxLocal.translateY(nStripes / 13);
            for (let iStripe = 0; iStripe < nStripes; iStripe++) {
                let barricadeStripe = new ƒ.Node("BarricadeStripe" + (iStripe + iBarricade * nStripes));
                let pos = new ƒ.Vector2;
                pos.x = iStripe - (nStripes - 1) / 2;
                pos.y = 2;
                // let scaleX: number = 1 / 12;
                barricade = new SpaceInvaders.Barricade(pos);
                //  barricadeStripe.addComponent(new ƒ.ComponentTransform());
                //  barricadeStripe.getComponent(ƒ.ComponentTransform).mtxLocal.translateX(posX * scaleX);
                //  barricadeStripe.getComponent(ƒ.ComponentTransform).mtxLocal.translateY(2.5);
                //   barricadeStripe.getComponent(ƒ.ComponentMesh).mtxPivot.scaleX(scaleX);
                //  barricadeStripe.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(posX - (1 / 1000000000));
                //                barricadeStripe.addComponent(new ƒ.ComponentMaterial(material));
                barricade.addChild(barricadeStripe);
            }
        }
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
    function checkBarricadeCollision() {
        for (let projectile of projectileNode.getChildren()) {
            for (let barricade of barricades.getChildren()) {
                if (projectile.checkCollision(barricade)) {
                    projectileNode.removeChild(projectile);
                    barricades.removeChild(barricade);
                    console.log("Tear down this Wall");
                }
            }
        }
    }
    function checkProjectileCollision() {
        for (let projectile of projectileNode.getChildren()) {
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
        invaders.mtxLocal.translate(velocityInvaders.toVector3());
        /*
                let mtcInverse: ƒ.Matrix4x4 =  ƒ.Matrix4x4.INVERSION(invaders.mtxLocal);
                let position: ƒ.Vector3 = flak.mtxLocal.translation;
                position.transform(mtxInverse, true);
                console.log(position.toString());
                */
    }
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=SpaceInvaders.js.map