namespace SpaceInvaders {
    import ƒ = FudgeCore;
    window.addEventListener("load", init);
    let viewport: ƒ.Viewport = new ƒ.Viewport();
    export let invaderMesh: ƒ.Mesh = new ƒ.MeshSphere("Invader");
    export let flakMesh: ƒ.Mesh = new ƒ.MeshQuad("Flak")
    export let barricadeMesh: ƒ.Mesh = new ƒ.MeshQuad("Barricade");
    export let material: ƒ.Material = new ƒ.Material("Florian", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 1, 1, 1)));
    //let node: ƒ.Node = new ƒ.Node("Test");

    function init(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");

        let space: ƒ.Node = new ƒ.Node("Space");

        let flak: ƒ.Node = new ƒ.Node("flak");

        flak.addComponent(new ƒ.ComponentTransform());
        flak.addComponent(new ƒ.ComponentMesh(flakMesh));
        flak.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(7 / 4);
        flak.getComponent(ƒ.ComponentMesh).mtxPivot.scaleX(2);
        flak.addComponent(new ƒ.ComponentMaterial(material));

        space.addChild(flak);

        let kanone: ƒ.Node = new ƒ.Node("Kanonenrohr");
        flak.appendChild(kanone);

        kanone.addComponent(new ƒ.ComponentMesh(flakMesh));
        kanone.addComponent(new ƒ.ComponentTransform());
        kanone.getComponent(ƒ.ComponentMesh).mtxPivot.scale(new ƒ.Vector3(0.5, 1.5, 0.5));
        kanone.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(0.5);

        //let pipeMaterial: ƒ.Material = new ƒ.Material("flakMaterial", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0, 0, 1, 1)));
        // let cmpPipeMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(pipeMaterial);

        kanone.addComponent(new ƒ.ComponentMaterial(material));

        let motherShip: ƒ.Node = new ƒ.Node("MotherShip");

        motherShip.addComponent(new ƒ.ComponentTransform());
        motherShip.mtxLocal.translateY(140 / 13);

        motherShip.addComponent(new ƒ.ComponentMesh(invaderMesh));
        motherShip.getComponent(ƒ.ComponentMesh).mtxPivot.scaleX(10 / 4);
        motherShip.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(1);

        motherShip.addComponent(new ƒ.ComponentMaterial(material));

        space.addChild(motherShip);

        let invaders: ƒ.Node = new ƒ.Node("Invaders");
        for (let i: number = 0; i < 7; i++) {
            for (let j: number = 0; j < 3; j++) {
                let invader: ƒ.Node = new Invader(i, j);
                invaders.addChild(invader);
            }
        }

        space.addChild(invaders);

        let barricades: ƒ.Node = new ƒ.Node("Barricades");
        let nStripes: number = 21;


        for (let iBarricade: number = 0; iBarricade < 4; iBarricade++) {
            let barricade: ƒ.Node = new ƒ.Node("Barricade" + iBarricade);

            barricade.addComponent(new ƒ.ComponentTransform());
            barricade.getComponent(ƒ.ComponentTransform).mtxLocal.translateX((iBarricade - 1.5) * 53 / 13);
            barricade.getComponent(ƒ.ComponentTransform).mtxLocal.translateY(nStripes / 13);

            for (let iStripe: number = 0; iStripe < nStripes; iStripe++) {
                let barricadeStripe: ƒ.Node = new ƒ.Node("BarricadeStripe" + (iStripe + iBarricade * nStripes));

                let posX: number = iStripe - (nStripes - 1) / 2;
                let scaleX: number = 1 / 12;

                barricadeStripe.addComponent(new ƒ.ComponentTransform());
                barricadeStripe.getComponent(ƒ.ComponentTransform).mtxLocal.translateX(posX * scaleX);
                barricadeStripe.getComponent(ƒ.ComponentTransform).mtxLocal.translateY(2.5);

                barricadeStripe.addComponent(new ƒ.ComponentMesh(barricadeMesh));
                barricadeStripe.getComponent(ƒ.ComponentMesh).mtxPivot.scaleX(scaleX);
                barricadeStripe.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(posX - (1 / 1000000000));

                barricadeStripe.addComponent(new ƒ.ComponentMaterial(material));

                barricade.addChild(barricadeStripe);

            }

            barricades.addChild(barricade);
        }
        space.addChild(barricades);

        let projectiles: ƒ.Node = new ƒ.Node("Projektile");
        for (let i: number = 0; i < 3; i++) {
            let projectile: ƒ.Node = new Projektile(1, i);
            projectiles.addChild(projectile);
        }
        kanone.addChild(projectiles);

        let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(18);
        cmpCamera.mtxPivot.translateY(77 / 13);
        cmpCamera.mtxPivot.rotateY(180);
        console.log(cmpCamera);

        viewport.initialize("Viewport", space, cmpCamera, canvas);
        viewport.draw();

    }
}
