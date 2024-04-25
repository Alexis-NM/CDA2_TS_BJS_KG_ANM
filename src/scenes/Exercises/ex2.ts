/*
 * STAIRCASE SWITCHES
 */

import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateSceneClass } from "../../createScene";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import {
    AdvancedDynamicTexture,
    Button,
    Control,
    StackPanel,
    TextBlock,
} from "@babylonjs/gui";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { AbstractMesh } from "@babylonjs/core/Meshes/abstractMesh";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";

// Assets
import lightbulbModel from "../../assets/glb/incandescent_light_bulb.glb";
import point from "../../assets/img/point.png";
import line from "../../assets/img/line.png";

export class Ex2 implements CreateSceneClass {
    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine);

        // This creates and positions a free camera (non-mesh)
        const cameraRadius = 7;
        const camera = new ArcRotateCamera(
            "arcRotateCamera",
            Math.PI / 2,
            Math.PI / 2,
            cameraRadius,
            new Vector3(0, 1, 0),
            scene
        );

        camera.minZ = 0.1;
        camera.wheelDeltaPercentage = 0.01;
        camera.upperRadiusLimit = cameraRadius;
        camera.lowerRadiusLimit = cameraRadius;
        camera.panningSensibility = 0;

        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        // Import 3D model
        const importResult = await SceneLoader.ImportMeshAsync(
            "",
            "",
            lightbulbModel,
            scene,
            undefined,
            ".glb"
        );

        // Scale the meshes and isolate the glass bulb (for emission)
        let bulb: AbstractMesh = new AbstractMesh("bulbPlaceholder");
        importResult.meshes.forEach((mesh) => {
            console.log(mesh.name);
            mesh.scaling.scaleInPlace(4);

            if (mesh.name === "Object_5") bulb = mesh;
        });

        //Create PBR material
        const pbr = new PBRMaterial("pbr", scene);
        pbr.metallic = 0;
        pbr.roughness = 0;
        pbr.subSurface.isRefractionEnabled = true;
        pbr.subSurface.indexOfRefraction = 1.5;
        pbr.subSurface.tintColor = Color3.White();

        bulb.material = pbr;

        /**************************** */
        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // INSTRUCTIONS
        const userInstructions = new TextBlock();
        userInstructions.text = `STAIRCASE SWTICHES
            Use the switch buttons to control the light
            The light is ON when both switches have the same shape`;
        userInstructions.color = "white";
        userInstructions.fontSize = 20;
        userInstructions.top = "30%";
        advancedTexture.addControl(userInstructions);

        // BUTTON

        const leftSwitch = Button.CreateImageOnlyButton("leftSwitch", point);
        const rightSwitch = Button.CreateImageOnlyButton("rightSwitch", line);

        leftSwitch.horizontalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        leftSwitch.cornerRadius = 10;
        leftSwitch.width = "50px";
        leftSwitch.height = "50px";
        leftSwitch.color = "white";
        leftSwitch.background = "#AAAAAA";
        if (leftSwitch.textBlock != undefined)
            leftSwitch.textBlock.color = "white";

        rightSwitch.horizontalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        rightSwitch.cornerRadius = 10;
        rightSwitch.width = "50px";
        rightSwitch.height = "50px";
        rightSwitch.color = "white";
        rightSwitch.background = "#AAAAAA";
        if (rightSwitch.textBlock != undefined)
            rightSwitch.textBlock.color = "white";

        const stackPanel = new StackPanel();
        stackPanel.isVertical = false;
        stackPanel.spacing = 50;
        stackPanel.top = "10%";
        stackPanel.addControl(leftSwitch);
        stackPanel.addControl(rightSwitch);
        stackPanel.zIndex = 1000;
        advancedTexture.addControl(stackPanel);

        //TODO: Do something when buttons are pressed

      
        function toggleButtonShape(button: Button): void {
            if (button.image) {
                button.image.source =
                    button.image.source === point ? line : point;
            }
        }

        function toggleLight(
            leftButton: Button,
            rightButton: Button,
        ): void {
            if (
                leftButton.image &&
                rightButton.image
            ) {
                if (leftButton.image.source === rightButton.image.source) {
                    pbr.emissiveColor = Color3.White();
                } else {
                    pbr.emissiveColor = Color3.Black();
                }
            }
        }

        leftSwitch.onPointerUpObservable.add(() => {
            toggleButtonShape(leftSwitch);
            toggleLight(leftSwitch, rightSwitch);
        });

        rightSwitch.onPointerUpObservable.add(() => {
            toggleButtonShape(rightSwitch);
            toggleLight(leftSwitch, rightSwitch);
        });

        /**************************** */

        /////////
        // ENV
        /////////
        //Directional light
        const dlightPosition = new Vector3(0.02, -0.05, -0.05);
        const dLightOrientation = new Vector3(0, 20, 0);
        const dLight = new DirectionalLight("dLight", dlightPosition, scene);
        dLight.intensity = 0.2;
        dLight.position.y = 10;

        //Directional light orientation
        dLight.position = dLightOrientation;

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const hLight = new HemisphericLight(
            "light",
            new Vector3(0, 1, 0),
            scene
        );

        // Default intensity is 1. Let's dim the light a small amount
        hLight.intensity = 0.7;

        const env = scene.createDefaultEnvironment({
            createSkybox: true,
            skyboxSize: 150,
            skyboxColor: new Color3(0.01, 0.01, 0.01),
            createGround: false,
        });

        const glow = new GlowLayer("glow", scene, {
            mainTextureFixedSize: 2048,
            blurKernelSize: 128,
        });
        glow.intensity = 0.5;

        return scene;
    };
}

export default new Ex2();
