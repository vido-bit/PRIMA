
namespace PhysicsScene {

    import ƒ = FudgeCore;

    window.addEventListener("load", init);
    let viewport: ƒ.Viewport = new ƒ.Viewport();

    async function init(_event: Event): Promise<void> {
        ƒ.Physics.world.setSolverIterations(1000);
        ƒ.Physics.settings.defaultRestitution = 0.3;
        ƒ.Physics.settings.defaultFriction = 0.8;
        await FudgeCore.Project.loadResourcesFromHTML();
        FudgeCore.Debug.log("Project:", FudgeCore.Project.resources);
        // pick the graph to show
        let graph: ƒ.Graph = <ƒ.Graph>FudgeCore.Project.resources["Graph|2021-04-27T14:51:00.597Z|11409"];
        FudgeCore.Debug.log("Graph:", graph);
        const canvas: HTMLCanvasElement = document.querySelector("canvas");

        let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        cmpCamera.mtxPivot.translate(new ƒ.Vector3(20, 10, 20));
        cmpCamera.mtxPivot.lookAt(new ƒ.Vector3(0, 0, 0));
        console.log(cmpCamera);
        ƒ.Physics.start(graph);
        viewport.initialize("Viewport", graph, cmpCamera, canvas);
        viewport.draw();

        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 120);
        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    }

    function update(_event: Event): void {
        ƒ.Physics.world.simulate(ƒ.Loop.timeFrameReal / 1000);
        viewport.draw();
    }
}

