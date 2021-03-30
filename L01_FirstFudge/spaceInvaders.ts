namespace L01_FirstFudge {
    import ƒ = FudgeCore;
    window.addEventListener("load", init);
    let viewport: ƒ.Viewport = new ƒ.Viewport();
    let node: ƒ.Node = new ƒ.Node("Test");

    function init(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");

        let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(15);
        cmpCamera.mtxPivot.rotateY(180);
        console.log(cmpCamera);

        spaceShipsTop();
        spaceShipsMiddle();
        spaceShipsBottom();
        createFlak();



        viewport.initialize("Viewport", node, cmpCamera, canvas);
        viewport.draw();
    }

    function createFlak(): void {
        let flakNode: ƒ.Node = new ƒ.Node("Flugabwehrkanone");
        node.appendChild(flakNode);

        let flakMesh: ƒ.MeshCube = new ƒ.MeshCube("Cube");
        flakNode.addComponent(new ƒ.ComponentMesh(flakMesh));
        flakNode.addComponent(new ƒ.ComponentTransform());
        flakNode.getComponent(ƒ.ComponentMesh).mtxPivot.scale(new ƒ.Vector3(1.5,1.5,1.5));
        flakNode.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(-2.75);

        let flakMaterial: ƒ.Material = new ƒ.Material("flakMaterial", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0, 0, 1, 1)));
        let cmpFlakMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(flakMaterial);

        flakNode.addComponent(cmpFlakMaterial);

        let pipeNode: ƒ.Node = new ƒ.Node("Kanonenrohr");
        flakNode.appendChild(pipeNode);

        let pipeMesh: ƒ.MeshCube = new ƒ.MeshCube("Rohr");
        pipeNode.addComponent(new ƒ.ComponentMesh(pipeMesh));
        pipeNode.addComponent(new ƒ.ComponentTransform());
        pipeNode.getComponent(ƒ.ComponentMesh).mtxPivot.scale(new ƒ.Vector3(0.5,1.5,0.5));
        pipeNode.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(-2.25);

        let pipeMaterial: ƒ.Material = new ƒ.Material("flakMaterial", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(0, 0, 1, 1)));
        let cmpPipeMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(pipeMaterial);

        pipeNode.addComponent(cmpPipeMaterial);
    }

    function spaceShipsTop(): void {

        let shipNode1: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode1);
        let shipNode2: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode2);
        let shipNode3: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode3);
        let shipNode4: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode4);
        let shipNode5: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode5);
        let shipNode6: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode6);
        let shipNode7: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode7);

        let spaceMesh1: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");
        let spaceMesh2: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");
        let spaceMesh3: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");
        let spaceMesh4: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");
        let spaceMesh5: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");
        let spaceMesh6: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");
        let spaceMesh7: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");

        shipNode1.addComponent(new ƒ.ComponentMesh(spaceMesh1));
        shipNode1.addComponent(new ƒ.ComponentTransform());
        shipNode1.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(-6);
        shipNode1.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(3);
        shipNode2.addComponent(new ƒ.ComponentMesh(spaceMesh2));
        shipNode2.addComponent(new ƒ.ComponentTransform());
        shipNode2.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(-4);
        shipNode2.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(3);
        shipNode3.addComponent(new ƒ.ComponentMesh(spaceMesh3));
        shipNode3.addComponent(new ƒ.ComponentTransform());
        shipNode3.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(-2);
        shipNode3.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(3);
        shipNode4.addComponent(new ƒ.ComponentMesh(spaceMesh4));
        shipNode4.addComponent(new ƒ.ComponentTransform());
        shipNode4.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(3);
        shipNode5.addComponent(new ƒ.ComponentMesh(spaceMesh5));
        shipNode5.addComponent(new ƒ.ComponentTransform());
        shipNode5.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(2);
        shipNode5.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(3);
        shipNode6.addComponent(new ƒ.ComponentMesh(spaceMesh6));
        shipNode6.addComponent(new ƒ.ComponentTransform());
        shipNode6.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(4);
        shipNode6.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(3);
        shipNode7.addComponent(new ƒ.ComponentMesh(spaceMesh7));
        shipNode7.addComponent(new ƒ.ComponentTransform());
        shipNode7.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(6);
        shipNode7.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(3);

        let shipMaterial: ƒ.Material = new ƒ.Material("shipMaterial", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 0, 0, 1)));
        let shipMaterial2: ƒ.Material = new ƒ.Material("shipMaterial2", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 1, 1, 1)));
        let cmpShipMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial2);
        let cmpShipMaterial2: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial);
        let cmpShipMaterial3: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial2);
        let cmpShipMaterial4: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial);
        let cmpShipMaterial5: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial2);
        let cmpShipMaterial6: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial);
        let cmpShipMaterial7: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial2);

        shipNode1.addComponent(cmpShipMaterial);
        shipNode2.addComponent(cmpShipMaterial2);
        shipNode3.addComponent(cmpShipMaterial3);
        shipNode4.addComponent(cmpShipMaterial4);
        shipNode5.addComponent(cmpShipMaterial5);
        shipNode6.addComponent(cmpShipMaterial6);
        shipNode7.addComponent(cmpShipMaterial7);

    }

    function spaceShipsMiddle(): void {

        let shipNode1: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode1);
        let shipNode2: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode2);
        let shipNode3: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode3);
        let shipNode4: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode4);
        let shipNode5: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode5);
        let shipNode6: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode6);
        let shipNode7: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode7);

        let spaceMesh1: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");
        let spaceMesh2: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");
        let spaceMesh3: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");
        let spaceMesh4: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");
        let spaceMesh5: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");
        let spaceMesh6: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");
        let spaceMesh7: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");

        shipNode1.addComponent(new ƒ.ComponentMesh(spaceMesh1));
        shipNode1.addComponent(new ƒ.ComponentTransform());
        shipNode1.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(-6);
        shipNode1.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(1);
        shipNode2.addComponent(new ƒ.ComponentMesh(spaceMesh2));
        shipNode2.addComponent(new ƒ.ComponentTransform());
        shipNode2.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(-4);
        shipNode2.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(1);
        shipNode3.addComponent(new ƒ.ComponentMesh(spaceMesh3));
        shipNode3.addComponent(new ƒ.ComponentTransform());
        shipNode3.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(-2);
        shipNode3.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(1);
        shipNode4.addComponent(new ƒ.ComponentMesh(spaceMesh4));
        shipNode4.addComponent(new ƒ.ComponentTransform());
        shipNode4.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(1);
        shipNode5.addComponent(new ƒ.ComponentMesh(spaceMesh5));
        shipNode5.addComponent(new ƒ.ComponentTransform());
        shipNode5.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(2);
        shipNode5.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(1);
        shipNode6.addComponent(new ƒ.ComponentMesh(spaceMesh6));
        shipNode6.addComponent(new ƒ.ComponentTransform());
        shipNode6.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(4);
        shipNode6.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(1);
        shipNode7.addComponent(new ƒ.ComponentMesh(spaceMesh7));
        shipNode7.addComponent(new ƒ.ComponentTransform());
        shipNode7.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(6);
        shipNode7.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(1);

        let shipMaterial: ƒ.Material = new ƒ.Material("shipMaterial", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 0, 0, 1)));
        let cmpShipMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial);
        let shipMaterial2: ƒ.Material = new ƒ.Material("shipMaterial2", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 1, 1, 1)));
        let cmpShipMaterial2: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial2);
        let cmpShipMaterial3: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial);
        let cmpShipMaterial4: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial2);
        let cmpShipMaterial5: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial);
        let cmpShipMaterial6: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial2);
        let cmpShipMaterial7: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial);

        shipNode1.addComponent(cmpShipMaterial);
        shipNode2.addComponent(cmpShipMaterial2);
        shipNode3.addComponent(cmpShipMaterial3);
        shipNode4.addComponent(cmpShipMaterial4);
        shipNode5.addComponent(cmpShipMaterial5);
        shipNode6.addComponent(cmpShipMaterial6);
        shipNode7.addComponent(cmpShipMaterial7);

    }

    function spaceShipsBottom(): void {

        let shipNode1: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode1);
        let shipNode2: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode2);
        let shipNode3: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode3);
        let shipNode4: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode4);
        let shipNode5: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode5);
        let shipNode6: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode6);
        let shipNode7: ƒ.Node = new ƒ.Node("spaceShip");
        node.addChild(shipNode7);

        let spaceMesh1: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");
        let spaceMesh2: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");
        let spaceMesh3: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");
        let spaceMesh4: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");
        let spaceMesh5: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");
        let spaceMesh6: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");
        let spaceMesh7: ƒ.MeshSphere = new ƒ.MeshSphere("Circle");

        shipNode1.addComponent(new ƒ.ComponentMesh(spaceMesh1));
        shipNode1.addComponent(new ƒ.ComponentTransform());
        shipNode1.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(-6);
        shipNode1.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(-1);
        shipNode2.addComponent(new ƒ.ComponentMesh(spaceMesh2));
        shipNode2.addComponent(new ƒ.ComponentTransform());
        shipNode2.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(-4);
        shipNode2.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(-1);
        shipNode3.addComponent(new ƒ.ComponentMesh(spaceMesh3));
        shipNode3.addComponent(new ƒ.ComponentTransform());
        shipNode3.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(-2);
        shipNode3.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(-1);
        shipNode4.addComponent(new ƒ.ComponentMesh(spaceMesh4));
        shipNode4.addComponent(new ƒ.ComponentTransform());
        shipNode4.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(-1);
        shipNode5.addComponent(new ƒ.ComponentMesh(spaceMesh5));
        shipNode5.addComponent(new ƒ.ComponentTransform());
        shipNode5.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(2);
        shipNode5.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(-1);
        shipNode6.addComponent(new ƒ.ComponentMesh(spaceMesh6));
        shipNode6.addComponent(new ƒ.ComponentTransform());
        shipNode6.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(4);
        shipNode6.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(-1);
        shipNode7.addComponent(new ƒ.ComponentMesh(spaceMesh7));
        shipNode7.addComponent(new ƒ.ComponentTransform());
        shipNode7.getComponent(ƒ.ComponentMesh).mtxPivot.translateX(6);
        shipNode7.getComponent(ƒ.ComponentMesh).mtxPivot.translateY(-1);

        let shipMaterial: ƒ.Material = new ƒ.Material("shipMaterial", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 0, 0, 1)));
        let shipMaterial2: ƒ.Material = new ƒ.Material("shipMaterial2", ƒ.ShaderUniColor, new ƒ.CoatColored(new ƒ.Color(1, 1, 1, 1)));
        let cmpShipMaterial: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial2);
        let cmpShipMaterial2: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial);
        let cmpShipMaterial3: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial2);
        let cmpShipMaterial4: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial);
        let cmpShipMaterial5: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial2);
        let cmpShipMaterial6: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial);
        let cmpShipMaterial7: ƒ.ComponentMaterial = new ƒ.ComponentMaterial(shipMaterial2);

        shipNode1.addComponent(cmpShipMaterial);
        shipNode2.addComponent(cmpShipMaterial2);
        shipNode3.addComponent(cmpShipMaterial3);
        shipNode4.addComponent(cmpShipMaterial4);
        shipNode5.addComponent(cmpShipMaterial5);
        shipNode6.addComponent(cmpShipMaterial6);
        shipNode7.addComponent(cmpShipMaterial7);

    }

}