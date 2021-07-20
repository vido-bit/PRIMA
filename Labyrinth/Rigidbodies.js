var Labyrinth;
(function (Labyrinth) {
    class Rigidbodies {
    }
    Labyrinth.Rigidbodies = Rigidbodies;
    let environment;
    createGeneralRigidBodies();
    void {
        environment = root.getChildrenByName("environment")[0],
        // ballBearing = root.getChildrenByName("ballBearing")[0];
        let, fixplate: ƒ.Node = root.getChildrenByName("fixplate")[0],
        let, floor01: ƒ.Node = environment.getChildrenByName("floor01")[0],
        let, barriers: ƒ.Node = floor01.getChildrenByName("barriers")[0],
        barrier01 = barriers.getChildrenByName("barrier01")[0],
        barrier02 = barriers.getChildrenByName("barrier02")[0],
        barrier03 = barriers.getChildrenByName("barrier03")[0],
        barrier04 = barriers.getChildrenByName("barrier04")[0],
        level1 = floor01.getChildrenByName("level1")[0],
        level2 = floor01.getChildrenByName("level2")[0],
        let, floor02: ƒ.Node = level1.getChildrenByName("floor02")[0],
        moveables = root.getChildrenByName("moveables")[0],
        ball = moveables.getChildrenByName("ball")[0],
        let, cmpRigidbodyFloor01: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1),
        floor01, : .addComponent(cmpRigidbodyFloor01),
        for(let, node, of, level1) { }, : .getChildren()
    };
    {
        let cmpRigidbodylevel1 = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
        node.addComponent(cmpRigidbodylevel1);
    }
    for (let node of level2.getChildren()) {
        cmpRigidbodylevel2 = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
        node.addComponent(cmpRigidbodylevel2);
    }
    for (let node of barriers.getChildren()) {
        let cmpRigidbodyBarrier = new ƒ.ComponentRigidbody(2, ƒ.PHYSICS_TYPE.KINEMATIC, ƒ.COLLIDER_TYPE.CUBE, ƒ.PHYSICS_GROUP.GROUP_1);
        node.addComponent(cmpRigidbodyBarrier);
    }
    let cmpRigidbodyBall = new ƒ.ComponentRigidbody(1, ƒ.PHYSICS_TYPE.DYNAMIC, ƒ.COLLIDER_TYPE.SPHERE, ƒ.PHYSICS_GROUP.GROUP_2);
    cmpRigidbodyBall.restitution = 0.1;
    cmpRigidbodyBall.friction = 10;
    cmpRigidbodyBall.mass = 10;
    ball.addComponent(cmpRigidbodyBall);
})(Labyrinth || (Labyrinth = {}));
//# sourceMappingURL=Rigidbodies.js.map