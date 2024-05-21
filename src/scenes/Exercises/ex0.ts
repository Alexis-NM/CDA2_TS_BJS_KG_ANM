/*
 * NUMBER GUESSER
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
    Control,
    InputText,
    TextBlock,
} from "@babylonjs/gui";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";

import * as earcut from "earcut";

export class Ex0 implements CreateSceneClass {
    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine);

        // This creates and positions a free camera (non-mesh)
        const cameraRadius = 5;
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

        //Create PBR material
        const pbr = new PBRMaterial("pbr", scene);
        pbr.metallic = 0;
        pbr.roughness = 1;
        pbr.subSurface.isRefractionEnabled = true;
        pbr.subSurface.indexOfRefraction = 1.5;
        pbr.subSurface.tintColor = Color3.Black();
        const pbrEmissive: Color3 = new Color3(0, 0, 0);

        // 3DText
        const fontData = await (
            await fetch(
                "https://assets.babylonjs.com/fonts/Droid Sans_Bold.json"
            )
        ).json();
        const myText = MeshBuilder.CreateText(
            "myText",
            "WINNER!",
            fontData,
            {
                size: 0.5,
                resolution: 32,
                depth: 0.2,
            },
            scene,
            earcut
        );

        if (myText) {
            myText.position = new Vector3(0, 0.5, 0);
            myText.scaling = new Vector3(-1, 1, 1);
            myText.material = pbr;
        }

        //* ***************************************
        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI(
            "UI",
            true,
            scene
        );

        // INSTRUCTIONS
        const userInstructions = new TextBlock();
        userInstructions.text = `NUMBER GUESSER
            Guess a number between 0 and 10
            If right, the geometry will change color`;
        userInstructions.color = "white";
        userInstructions.fontSize = 20;
        userInstructions.top = "30%";
        advancedTexture.addControl(userInstructions);

        // INPUT
        const input = new InputText();
        input.width = 0.2;
        input.maxWidth = 0.4;
        input.height = "40px";
        input.text = "Type your guess here";
        input.autoStretchWidth = true;
        input.thickness = 0;
        input.color = "#AAAAAAAA";
        input.background = "#332533FF";
        input.focusedBackground = "#221522FF";
        input.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        input.top = "10%";
        input.onFocusSelectAll = true;

        // Allow numbers only
        input.onBeforeKeyAddObservable.add((input) => {
            const key = input.currentKey;
            if (key < "0" || key > "9") {
                input.addKey = false;
            }
        });

        // Generate a random number between 0 and 10
        const randomNumber = Math.floor(Math.random() * 10);
        console.log(randomNumber);

        function checkNumber(key : number): boolean {
            if (key === randomNumber) {
                return true;
            }
            return false;
        }

        //TODO: Do something when "Enter" is pressed
        let animate = false;
        input.onKeyboardEventProcessedObservable.add(({ key }) => {
            if (key === "Enter" && checkNumber(Number(input.currentKey))) {
                pbr.roughness = 0;
                pbr.subSurface.tintColor = new Color3(0.1, 0.8, 0.3);
                animate = true;
            }
        });

        advancedTexture.addControl(input);
        //* ***************************************

        /////////
        // LIGHTS
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

        let angle = 0;
        scene.registerBeforeRender(() => {
            if (animate) {
                camera.alpha += 0.00005 * scene.getEngine().getDeltaTime();
                if (myText) myText.lookAt(camera.position);
                pbrEmissive.r,
                    pbrEmissive.g,
                    (pbrEmissive.b = Math.sin(angle) * Math.sin(angle));
                angle += 0.01;
                pbr.emissiveColor = pbrEmissive;
            }
        });

        return scene;
    };
}

export default new Ex0();
