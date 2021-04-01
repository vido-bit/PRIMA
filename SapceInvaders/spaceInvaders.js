var SpaceInvaders;
(function (SpaceInvaders) {
    var ƒ = FudgeCore;
    window.addEventListener("load", init);
    let viewport = new ƒ.Viewport();
    SpaceInvaders.invaderMesh = new ƒ.MeshSphere("Invader");
    SpaceInvaders.flakMesh = new ƒ.MeshQuad("Flak");
    SpaceInvaders.barricadeMesh = new ƒ.MeshQuad("Barricade");
    SpaceInvaders.material = new ƒ.Material("Florian", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 1, 1, 1)));
    //let node: ƒ.Node = new ƒ.Node("Test");
    function init(_event) {
        const canvas = document.querySelector("canvas");
        let space = new ƒ.Node("Space");
        let flak = new ƒ.Node("flak");
        flak.addComponent(new ƒ.ComponentTransform());
        flak.addComponent(new ƒ.ComponentMesh(SpaceInvaders.flakMesh));
        flak.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(7 / 4);
        flak.getComponent(ƒ.ComponentMesh).mtxPivot.scaleX(2);
        flak.addComponent(new ƒ.ComponentMaterial(SpaceInvaders.material));
        space.addChild(flak);
        let kanone = new ƒ.Node("Kanonenrohr");
        flak.appendChild(kanone);
        kanone.addComponent(new ƒ.ComponentMesh(SpaceInvaders.flakMesh));
        kanone.addComponent(new ƒ.ComponentTransform());
        kanone.getComponent(ƒ.ComponentMesh).mtxPivot.scale(new ƒ.Vector3(0.5, 1.5, 0.5));
        kanone.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(0.5);
        //let pipeMaterial: ƒ.Material = new ƒ.Material("flakMaterial", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0, 0, 1, 1)));
        // let cmpPipeMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(pipeMaterial);
        kanone.addComponent(new ƒ.ComponentMaterial(SpaceInvaders.material));
        let motherShip = new ƒ.Node("MotherShip");
        motherShip.addComponent(new ƒ.ComponentTransform());
        motherShip.mtxLocal.translateY(140 / 13);
        motherShip.addComponent(new ƒ.ComponentMesh(SpaceInvaders.invaderMesh));
        motherShip.getComponent(ƒ.ComponentMesh).mtxPivot.scaleX(10 / 4);
        motherShip.getComponent(ƒ.ComponentMesh).mtxPivot.scaleY(1);
        motherShip.addComponent(new ƒ.ComponentMaterial(SpaceInvaders.material));
        space.addChild(motherShip);
        let invaders = new ƒ.Node("Invaders");
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 3; j++) {
                let invader = new SpaceInvaders.Invader(i, j);
                invaders.addChild(invader);
            }
        }
        space.addChild(invaders);
        let barricades = new ƒ.Node("Barricades");
        let nStripes = 21;
        for (let iBarricade = 0; iBarricade < 4; iBarricade++) {
            let barricade = new ƒ.Node("Barricade" + iBarricade);
            barricade.addComponent(new ƒ.ComponentTransform());
            barricade.getComponent(ƒ.ComponentTransform).mtxLocal.translateX((iBarricade - 1.5) * 53 / 13);
            barricade.getComponent(ƒ.ComponentTransform).mtxLocal.translateY(nStripes / 13);
            for (let iStripe = 0; iStripe < nStripes; iStripe++) {
                let barricadeStripe = new ƒ.Node("BarricadeStripe" + (iStripe + iBarricade * nStripes));
                let posX = iStripe - (nStripes - 1) / 2;
                let scaleX = 1 / 12;
                barricadeStripe.addComponent(new ƒ.ComponentTransform());
                barricadeStripe.getComponent(ƒ.ComponentTransform).mtxLocal.translateX(posX * scaleX);
                barricadeStripe.getComponent(ƒ.ComponentTransform).mtxLocal.translateY(2.5);
                barricadeStripe.addComponent(new ƒ.ComponentMesh(SpaceInvaders.barricadeMesh));
                barricadeStripe.getComponent(ƒ.ComponentMesh).mtxPivot.scaleX(scaleX);
                barricadeStripe.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(posX - (1 / 1000000000));
                barricadeStripe.addComponent(new ƒ.ComponentMaterial(SpaceInvaders.material));
                barricade.addChild(barricadeStripe);
            }
            barricades.addChild(barricade);
        }
        space.addChild(barricades);
        let projectiles = new ƒ.Node("Projektile");
        for (let i = 0; i < 3; i++) {
            let projectile = new SpaceInvaders.Projektile(1, i);
            projectiles.addChild(projectile);
        }
        kanone.addChild(projectiles);
        let cmpCamera = new ƒ.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(18);
        cmpCamera.mtxPivot.translateY(77 / 13);
        cmpCamera.mtxPivot.rotateY(180);
        console.log(cmpCamera);
        viewport.initialize("Viewport", space, cmpCamera, canvas);
        viewport.draw();
    }
})(SpaceInvaders || (SpaceInvaders = {}));
//# sourceMappingURL=spaceInvaders.js.map