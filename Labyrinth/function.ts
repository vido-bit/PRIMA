namespace Labyrinth {
  import ƒ = FudgeCore;

  let root: ƒ.Graph;
  window.addEventListener("load", init);
  let viewport: ƒ.Viewport; // = new ƒ.Viewport();
  //   let hierarchy: ƒ.Node;
  let environment: ƒ.Node[] = new Array();
  //let character: Character;
  let block: ƒ.Node;
  let block02: ƒ.Node;
  let grabbedBlock: ƒ.Node;
  let cmpCamera: ƒ.ComponentCamera;
  let isLocked: boolean = false;
  let isGrabbed: boolean = false;
  // let isGrounded: boolean;
  let canvas: HTMLCanvasElement;
  let camBufferX: number = 0;
  let camBufferY: number = 0;
  const camSpeed: number = -0.15;
  let forwardMovement: number = 0;
  let sideMovement: number = 0;
  let jumpMovement: number = 0;
  let grabSound: ƒ.Audio = new ƒ.Audio("Slime_attack1.mp3"); //("lo-fi-spahnwave-beats-to-relax_get-healthcare-systems-in-very-good-shape-to.mp3");
  let dropSound: ƒ.Audio = new ƒ.Audio("Dolphin_eat1.ogg");
  let audioGrabNode: ƒ.Node = new ƒ.Node("Grab");
  let audioDropNode: ƒ.Node = new ƒ.Node("Drop");
  let audioReleaseItem: ƒ.Audio = new ƒ.Audio("Dolphin_eat1.ogg");
  let cmpGrabSound: ƒ.ComponentAudio = new ƒ.ComponentAudio(
    grabSound,
    false,
    false
  );
  let cmpDropSound: ƒ.ComponentAudio = new ƒ.ComponentAudio(
    dropSound,
    false,
    false
  );
  let cmpRigidbodyBlock: ƒ.ComponentRigidbody;
  async function init(_event: Event): Promise<void> {
    //   ƒ.Physics.settings.debugDraw = true;
    ƒ.Physics.initializePhysics();
    ƒ.Physics.world.setSolverIterations(1000);
    ƒ.Physics.settings.defaultRestitution = 0.3;
    ƒ.Physics.settings.defaultFriction = 0.8;
    await ƒ.Project.loadResourcesFromHTML();
    ƒ.Debug.log("Project:", ƒ.Project.resources);
    // pick the graph to show
    root = <ƒ.Graph>ƒ.Project.resources["Graph|2021-04-27T14:51:00.597Z|11409"];
    //root = <ƒ.Graph>ƒ.Project.resources["Graph|2021-04-27T14:37:53.620Z|93013"];
    ƒ.Debug.log("Graph:", root);
    canvas = document.querySelector("canvas");
    // hierarchy = new ƒ.Node("Scene");
    // player = graph.getChildrenByName("board")[0];
    // ball = graph.getChildrenByName("ball")[0];

    cmpCamera = new ƒ.ComponentCamera();
    // character = new Character(cmpCamera);
    // root.addChild(character);
    createRigidBodies();
    setUpAudio();
    document.addEventListener("pointerlockchange", pointerLockChange);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    //  document.addEventListener("keydown", startPlayerMovement);
    //   document.addEventListener("keyup", stopPlayerMovement);
    //cmpCamera.mtxPivot.lookAt(new ƒ.Vector3(0, 0, 0));
    ƒ.Physics.adjustTransforms(root, true);
    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", root, cmpCamera, canvas);
    viewport.draw();
    ƒ.Physics.adjustTransforms(root, true);
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
    //  ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 120);
    //   ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
  }

  function update(_event: Event): void {
    ƒ.Physics.world.simulate(ƒ.Loop.timeFrameReal / 1000);
    //lookAt(player.mtxLocal.translation);
    updateCam(camBufferX, camBufferY);
    //character.move(forwardMovement, sideMovement, jumpMovement);
    // if (player.cmpRigid.getPosition().y >= 2) {

    /* if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.E])) {
      tryGrab();
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.Q])) {
      //   releaseItem();
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.T])) {
      console.log("Dropsound");
      cmpDropSound.play(true);
      cmpDropSound.volume = 1;
    }
    if (isGrabbed) {
      cmpRigidbodyBlock.setVelocity(ƒ.Vector3.ZERO());
      cmpRigidbodyBlock.setRotation(ƒ.Vector3.ZERO());
      //    cmpRigidbodyBlock.setPosition(character.mtxWorld.translation);
      // block02.mtxWorld.translate(character.mtxWorld.translation);
    }
    */
    viewport.draw();
    ƒ.Physics.settings.debugDraw = true;
  }
  function createRigidBodies(): void {
    let level: ƒ.Node = root.getChildrenByName("level01")[0];
    for (let node of level.getChildren()) {
      let cmpRigidbodyLevel: ƒ.ComponentRigidbody = new ƒ.ComponentRigidbody(
        0,
        ƒ.PHYSICS_TYPE.DYNAMIC,
        ƒ.COLLIDER_TYPE.CUBE,
        ƒ.PHYSICS_GROUP.DEFAULT
      );
      node.addComponent(cmpRigidbodyLevel);
      //   console.log(node.name, node.cmpTransform?.mtxLocal.toString());
    }
    let moveables: ƒ.Node = root.getChildrenByName("moveables")[0];
    block = moveables.getChildrenByName("cube")[0];
    block02 = moveables.getChildrenByName("cube02")[0];
    for (let node of moveables.getChildren()) {
      cmpRigidbodyBlock = new ƒ.ComponentRigidbody(
        1,
        ƒ.PHYSICS_TYPE.DYNAMIC,
        ƒ.COLLIDER_TYPE.CUBE,
        ƒ.PHYSICS_GROUP.GROUP_2
      );
      cmpRigidbodyBlock.restitution = 0.8;
      cmpRigidbodyBlock.friction = 2.5;
      node.addComponent(cmpRigidbodyBlock);
    }
    //  ƒ.Physics.adjustTransforms(root, true);
  }

  /* function tryGrab(): void {
 //   let mtxPlayer: ƒ.Matrix4x4 = character.cmpRigid.getContainer().mtxLocal;
    // let rayHit: ƒ.RayHitInfo = ƒ.Physics.raycast(mtxAvatar.translation, mtxAvatar.getZ(), 4, ƒ.PHYSICS_GROUP.DEFAULT);
    // console.log(rayHit.hit);
    let moveables: ƒ.Node = root.getChildrenByName("moveables")[0];
    for (let node of moveables.getChildren()) {
      let distance: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(
        mtxPlayer.translation,
        node.mtxLocal.translation
      );
      if (distance.magnitude > 2) continue;
      grabbedBlock = this.node;
      console.log("grabbed Block " + grabbedBlock);
      //     pickup(node);
      isGrabbed = true;
      cmpGrabSound.play(true);
      break;
    }
  }

  function pickup(_node: ƒ.Node): void {
  //  let playerContainer: ƒ.Node = character.cmpRigid.getContainer();
    playerContainer.appendChild(_node);
    _node.mtxLocal.set(ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(1.5)));
    _node.getComponent(ƒ.ComponentRigidbody).physicsType =
      ƒ.PHYSICS_TYPE.KINEMATIC;
  }
*/
  /* function releaseItem(): void {
    let playerContainer: ƒ.Node = character.cmpRigid.getContainer();
    // let rayHit: ƒ.RayHitInfo = ƒ.Physics.raycast(mtxAvatar.translation, mtxAvatar.getZ(), 4, ƒ.PHYSICS_GROUP.DEFAULT);
    // console.log(rayHit.hit);
    let moveables: ƒ.Node = root.getChildrenByName("moveables")[0];
    for (let node of moveables.getChildren()) {
      isGrabbed = false;
      cmpDropSound.play(true);
      //    let distance: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(mtxPlayer.translation, node.mtxLocal.translation);
      //    if (distance.magnitude > 2)
      //       continue;
      //       dropOff(node);
      //   break;
    }
  }
  function dropOff(_node: ƒ.Node): void {
    let playerContainer: ƒ.Node = character.cmpRigid.getContainer();
    playerContainer.removeAllChildren();
    //playerContainer.removeChild(_node);
    _node.mtxLocal.set(ƒ.Matrix4x4.TRANSLATION(ƒ.Vector3.Z(-1.5)));
    // _node.getComponent(ƒ.ComponentRigidbody).physicsType = ƒ.PHYSICS_TYPE.KINEMATIC;
  }
  function startPlayerMovement(_event: KeyboardEvent): void {
    //   player.addComponent(new ƒ.ComponentTransform());

    if (_event.code == ƒ.KEYBOARD_CODE.W) {
      forwardMovement = 1;
    }
    if (_event.code == ƒ.KEYBOARD_CODE.S) {
      forwardMovement = -1;
    }

    if (_event.code == ƒ.KEYBOARD_CODE.A) {
      sideMovement = -1;
    }

    if (_event.code == ƒ.KEYBOARD_CODE.D) {
      sideMovement = 1;
    }

    if (_event.code == ƒ.KEYBOARD_CODE.SPACE) {
      console.log("Y " + character.camNode.mtxLocal.getY());
      //   if (character.cmpRigid.getPosition().y <= 2) {
      //jumpMovement = 1;
      character.cmpRigid.applyLinearImpulse(
        new ƒ.Vector3(0, character.jumpForce, 0)
      );
      // }
    }
  }
  function stopPlayerMovement(_event: KeyboardEvent): void {
    //   player.addComponent(new ƒ.ComponentTransform());

    if (_event.code == ƒ.KEYBOARD_CODE.W) forwardMovement = 0;

    if (_event.code == ƒ.KEYBOARD_CODE.S) forwardMovement = 0;

    if (_event.code == ƒ.KEYBOARD_CODE.A) sideMovement = 0;

    if (_event.code == ƒ.KEYBOARD_CODE.D) sideMovement = 0;
  }
*/
  function pointerLockChange(): void {
    if (!document.pointerLockElement) isLocked = false;
    isLocked = true;
  }
  function onMouseDown(): void {
    if (isLocked == false) canvas.requestPointerLock();
  }
  function handleMouseMove(_event: MouseEvent): void {
    if (isLocked == true) {
      camBufferX += _event.movementX;
      camBufferY += _event.movementY;
    }
  }
  function updateCam(_x: number, _y: number): void {
    //  character.camNode.mtxLocal.rotateZ(_y * camSpeed);
    // character.camNode.mtxLocal.rotateY(_x * camSpeed, true);
    camBufferX = 0;
    camBufferY = 0;
  }
  function setUpAudio(): void {
    let cmpListener: ƒ.ComponentAudioListener = new ƒ.ComponentAudioListener();
    cmpCamera.getContainer().addComponent(cmpListener);
    audioGrabNode.addComponent(cmpGrabSound);
    // character.camNode.appendChild(audioGrabNode);
    audioDropNode.addComponent(cmpDropSound);
    // character.camNode.appendChild(audioGrabNode);
    ƒ.AudioManager.default.listenWith(cmpListener);
    ƒ.AudioManager.default.listenTo(audioGrabNode);
    ƒ.AudioManager.default.volume = 0.3;
    // ƒ.AudioManager.default.suspend();
  }
}
