import * as BABYLON from "babylonjs";
import "pepjs";
import "babylonjs-inspector";
import "babylonjs-loaders";


const ShapeNames = {
  box: "Box",
  icoSphere: "IcoSphere",
  cylinder: "Cylinder"
}

export default class StudioSceneManager {
  constructor(game) {
    this.game = game;
    //Main Props
    this.scene = null;
    this.studioGui = null;
    this.mainCamera = null;
    this.pipline = null;
    this.myShapes = [];


    //Input Manager
    this.currentSelectedMesh = null;
    this.skyboxPath = "https://assets.babylonjs.com/environments/environmentSpecular.env";
  }

  //#region  MainSceneProperties
  createScene() {
    //Create Bts Scene
    //Create Scene
    this.scene = new BABYLON.Scene(this.game.engine);
    this.scene.clearColor = new BABYLON.Color4(1, 1, 1, 1.0);
    this.scene.imageProcessingConfiguration.colorCurvesEnabled = true;
    this.scene.imageProcessingConfiguration.colorCurves = new BABYLON.ColorCurves();
    this.scene.imageProcessingConfiguration.colorCurves.globalSaturation = 0;
    this.scene.imageProcessingConfiguration.contrast = 2.5;
    this.scene.imageProcessingConfiguration.vignetteEnabled = true;

    this.scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case BABYLON.PointerEventTypes.POINTERDOWN:
          this.onPointerDown(pointerInfo.event);
          break;
        case BABYLON.PointerEventTypes.POINTERUP:
          this.onPointerUp(pointerInfo.event);
          break;
        case BABYLON.PointerEventTypes.POINTERMOVE:
          this.onPointerMove(pointerInfo.event);
          break;
        case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
          break;
        case BABYLON.PointerEventTypes.POINTERWHEEL:
          this.mouseWheelHandler();
          break;
        default:
          break;
      }
    });

    //Installation
    this.createCamera();
    this.setUpEnvironMent();
    this.createShapes();

    // this.scene.debugLayer.show();
    return this.scene;
  }
  createCamera() {
    this.mainCamera = new BABYLON.ArcRotateCamera(
      "ArcCamera",
      4.8,
      1.35,
      25,
      new BABYLON.Vector3(0, 0, 0),
      this.scene
    );
    this.mainCamera.attachControl(this.game.canvas, true);

    this.mainCamera.lowerRadiusLimit = 8;
    this.mainCamera.upperRadiusLimit = 50;

    this.mainCamera.upperBetaLimit = 1.5;

    this.mainCamera.minZ = 0.2;
    this.mainCamera.target = new BABYLON.Vector3(0, 0.5, 0);

    this.mainCamera.wheelPrecision = 10;
    this.mainCamera.useBouncingBehavior = true;
  }
  setUpEnvironMent() {
    let dirLight = new BABYLON.DirectionalLight(
      "directionalLight",
      new BABYLON.Vector3(0.2, -1, -0.3),
      this.scene
    );
    dirLight.position = new BABYLON.Vector3(3, 9, 3);

    this.alphaMaterial = new BABYLON.StandardMaterial("alphaMat", this.scene);
    this.alphaMaterial.alpha = 0;


    let skybox = BABYLON.CubeTexture.CreateFromPrefilteredData(
      this.skyboxPath,
      this.scene
    );
    skybox.gammaSpace = false;
    let skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(this.skyboxPath, this.scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.reflectionTexture.level = 0.3;
    skybox.infiniteDistance = true;
    skybox.material = skyboxMaterial;
    this.scene.createDefaultSkybox(skybox, true, 2000, .3);

    //
    let ground = BABYLON.Mesh.CreateGround("ground1", 10, 10, 150, this.scene);
    ground.position.y = -10;
    ground.receiveShadows = true;


  }
  createShapes() {

    // Objects
    const box = BABYLON.MeshBuilder.CreateBox(ShapeNames.box, {}, this.scene);
    box.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(0, Math.PI, 0);

    const cylinder = BABYLON.MeshBuilder.CreateCylinder(ShapeNames.cylinder, {}, this.scene);
    cylinder.position.set(2, 0, 0);

    const icosphere = BABYLON.MeshBuilder.CreateIcoSphere(ShapeNames.icoSphere, { subdivisions: 1 }, this.scene);
    icosphere.position.set(-2, 0, 0);

    box.tag = "item";
    cylinder.tag = "item";
    icosphere.tag = "item";

    this.myShapes.push(box, cylinder, icosphere)
  }
  getMetaDataForShape(selectedShape) {
    switch (selectedShape.name) {
      case ShapeNames.box:
        return {
          name: ShapeNames.box,
          options: [
            {
              id: "width",
              value: selectedShape.scaling.x,
            },
            {
              id: "height",
              value: selectedShape.scaling.y,
            },
            {
              id: "depth",
              value: selectedShape.scaling.z,
            }
          ]
        };
      case ShapeNames.cylinder:
        return {
          name: ShapeNames.cylinder,
          options: [
            {
              id: "diameter",
              value: selectedShape.scaling.x,
            },
            {
              id: "height",
              value: selectedShape.scaling.y,
            }
          ]
        };
      case ShapeNames.icoSphere:
        return {
          name: ShapeNames.icoSphere,
          options: [
            {
              id: "subdivisions",
              value: selectedShape.subdivisions,
            },
            {
              id: "height",
              value: selectedShape.scaling.y,
            }
          ]
        };
      default:
        return null
    }
  }
  onUpdateShapeParamter(shapeName, paramterName, value) {

    let selectedShape = this.myShapes.find((shape) => shape.name === shapeName)
    if (!selectedShape) {
      return;
    }

    switch (paramterName) {
      default:
        break;
      case "width":
        selectedShape.scaling.x = value;
        break;
      case "height":
        selectedShape.scaling.y = value;
        selectedShape.radiusY = value;
        break;
      case "depth":
        selectedShape.scaling.z = value;
        break;
      case "diameter":
        selectedShape.scaling.x = value;
        selectedShape.scaling.z = value;
        break;
      case "subdivisions":
        console.log("this.myShapes[2].radiusY", this.myShapes[2].radiusY)
        const icosphere = BABYLON.MeshBuilder.CreateIcoSphere(ShapeNames.icoSphere, { subdivisions: value, radiusY: this.myShapes[2].radiusY || 1 }, this.scene);
        icosphere.position.set(-2, 0, 0);
        icosphere.subdivisions = value;
        icosphere.radiusY = this.myShapes[2].radiusY;
        icosphere.tag = "item";
        icosphere.showBoundingBox = true;
        this.currentSelectedMesh = icosphere;
        this.myShapes[2].dispose();
        this.myShapes.pop();
        this.myShapes.push(icosphere)
        break;


    }

  }
  applyBouncing(node, amplitude, duration) {
    node.position.y = amplitude;
    //
    var animationBox = new BABYLON.Animation("bounsAnim", "position.y", 60, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    // Animation keys
    var keys = [];
    keys.push({
      frame: 0,
      value: amplitude
    });
    keys.push({
      frame: 50,
      value: 0
    });
    keys.push({
      frame: 100,
      value: amplitude
    });
    animationBox.setKeys(keys);
    node.animations.push(animationBox);
    this.scene.beginAnimation(node, 0, 100, true);
  }
  //#endregion

  //#region UserInput (Mouse)
  onPointerDown(ev) {
    // console.log("Mouse Down");
    if (ev.button !== 0) {
      return;
    }
    if (this.currentSelectedMesh) {//Item Selected Before
      this.currentSelectedMesh.showBoundingBox = false;
      this.handlers.onDrop(null) //hide all components ui

    }
    //Pick Item To Move
    // check if we are under a mesh
    var pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);//, function (mesh) { return mesh !=ground });
    if (pickInfo.hit && pickInfo.pickedMesh.tag === "item") {
      console.log("clicked ")
      this.currentSelectedMesh = pickInfo.pickedMesh;
      this.currentSelectedMesh.showBoundingBox = true;
      this.handlers.onDrop(this.getMetaDataForShape(pickInfo.pickedMesh)) //hide all components ui
    }
  }
  onPointerUp(ev) {
  }
  onPointerMove(ev) { }
  mouseWheelHandler(ev) { }
  //#endregion
}




