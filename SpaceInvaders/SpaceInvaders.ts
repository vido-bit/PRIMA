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
    let projectileNode: ƒ.Node = new ƒ.Node("Projektilnode");
    let flak: ƒ.Node = new Flak();
    space.addChild(projectileNode);
    space.addChild(flak);
    let invaders: ƒ.Node = new ƒ.Node("Invaders");

    //export let motherShip: ƒ.Node = new ƒ.Node("MotherShip");
    //let node: ƒ.Node = new ƒ.Node("Test");
    function init(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");

        let mothership: ƒ.Node = new MotherShip();
        space.addChild(mothership);

        for (let column: number = 0; column < 10; column++) {
            for (let row: number = 0; row < 3; row++) {
                let pos: ƒ.Vector2 = new ƒ.Vector2();
                pos.x = column * 1.5 - 7;
                pos.y = row + 7;
                let invader: Invader = new Invader(pos);
                invader.setRectPosition();
                invaders.addChild(invader);
                console.log(invader.rect.position.y.toString(), invader.mtxLocal.translation.y.toString());
            }
        }
        space.addChild(invaders);

         new ƒ.Timer(ƒ.Time.game, 500, 0, moveInvaders);

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
        console.log(space);
    }

    function update(_event: Event): void {
        let projectile: Projectile;
        let tempo: number = (ƒ.Loop.timeFrameReal / 1000) * 6;

        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]) && flak.mtxLocal.translation.x > -7)
            flak.mtxLocal.translateX(-tempo);

        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]) && flak.mtxLocal.translation.x < 7)
            flak.mtxLocal.translateX(tempo);

        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {  
            let pos: ƒ.Vector2 = new ƒ.Vector2();
            pos.x = flak.mtxLocal.translation.x;
            pos.y = flak.mtxLocal.translation.y + 2;
            projectile = new Projectile(pos);
            projectileNode.addChild(projectile);
        }
        for (projectile of projectileNode.getChildren() as Projectile[]){
            projectile.move();
        }
        for (projectile of projectileNode.getChildren() as Projectile[]) {
            if (projectile.mtxLocal.translation.y > 12)
                projectileNode.removeChild(projectile);
        }

        checkProjectileCollision();
        viewport.draw();
        moveInvaders();
    }

    function checkProjectileCollision(): void {
        for (let projectile of projectileNode.getChildren() as Projectile[]) {
            console.log(projectileNode.getChildren());
            for (let invader of invaders.getChildren() as Invader[]) {
                if (projectile.checkCollision(invader)) {
                    projectileNode.removeChild(projectile);
                    invaders.removeChild(invader);
                    console.log("Collision");
                }

            }
        }
    }

    function moveInvaders(): void {
      /*
        invaders.mtxLocal.translate(velocityInvaders.toVector3());

        let mtcInverse: ƒ.Matrix4x4 =  ƒ.Matrix4x4.INVERSION(invaders.mtxLocal);
        let position: ƒ.Vector3 = flak.mtxLocal.translation;
        position.transform(mtxInverse, true);
        console.log(position.toString());
        */ 
    }

}
