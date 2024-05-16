/*
 * LED LETTERS BILLBOARD
 */

import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateSceneClass } from "../createScene";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import {
    AdvancedDynamicTexture,
    InputText,
    Control,
    TextBlock,
} from "@babylonjs/gui";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import { CreateSphere, Mesh } from "@babylonjs/core";

// Assets
import ABC from "../../assets/data/ABC.json";

export class TestScene implements CreateSceneClass {
    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine);

        // This creates and positions a free camera (non-mesh)
        const cameraRadius: number = 10;
        const camera = new ArcRotateCamera(
            "arcRotateCamera",
            Math.PI / 2,
            Math.PI / 2,
            cameraRadius,
            new Vector3(0, 1, 0),
            scene
        );

        camera.minZ = 0.1;
        camera.wheelDeltaPercentage = 0;
        camera.upperRadiusLimit = cameraRadius;
        camera.lowerRadiusLimit = cameraRadius;
        camera.panningSensibility = 0;

        // This targets the camera to scene origin
        camera.setTarget(Vector3.Zero());

        // This attaches the camera to the canvas
        camera.attachControl(canvas, true);

        /**************************** */
        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // INSTRUCTIONS
        const userInstructions = new TextBlock();
        userInstructions.text = `LED LETTERS BILLBOARD
            Insert a text to be displayed on the billboard`;
        userInstructions.color = "white";
        userInstructions.fontSize = 20;
        userInstructions.top = "30%";
        advancedTexture.addControl(userInstructions);

        // GENERATE THE BILLBOARD
        //Create PBR material
        let pbr: PBRMaterial;
        let matColor = new Color3(0.02, 0.02, 0.01);

        // Billboard unit dimensions
        const x: number = 7;
        const y: number = 9;
        const spacing: number = 0.1;

        let leds: Mesh[] = new Array(x * y);
        let led: Mesh;
        for (let row = 0; row < y; row++) {
            for (let col = 0; col < x; col++) {
                led = CreateSphere(
                    `${col}`,
                    {
                        diameter: 0.1,
                    },
                    scene
                );
                pbr = new PBRMaterial(`mat${row * x + col}`, scene);
                pbr.metallic = 0;
                pbr.roughness = 0.5;
                pbr.albedoColor = matColor;
                led.material = pbr;
                led.position.x = col * spacing;
                led.position.y = row * spacing;

                leds[row * x + col] = led;
            }
        }

        // DRAW SOMETHING ON BILLBOARD
        // Clear spaces
        let letter = ABC["A"].replace(/\s/g, "");
        for (let index = 0; index < letter.length; index++) {
            if (letter[index] === "1") {
                (leds[index].material as StandardMaterial).emissiveColor =
                    Color3.White();
            }
        }

        // INPUT
        const input = new InputText();
        input.width = 0.2;
        input.maxWidth = 0.4;
        input.height = "40px";
        input.text = "Enter your text here";
        input.autoStretchWidth = true;
        input.thickness = 0;
        input.color = "#AAAAAAAA";
        input.background = "#332533FF";
        input.focusedBackground = "#221522FF";
        input.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        input.top = "10%";
        input.onFocusSelectAll = true;
        advancedTexture.addControl(input);

        //TODO: Do something when "Enter" is pressed
        // input.onKeyboardEventProcessedObservable.add(({key})=>{
        //     if(key === "Enter")
        //         pbr.roughness = 0;
        //         pbr.subSurface.tintColor = new Color3(0.1,0.8,0.3);
        //         animate = true;
        // });

        //TODO: [OPTIONAL] Do something every second (alternate ON/OFF(padawan level) or pan letters(jedi level))

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
            mainTextureFixedSize: 1024,
            blurKernelSize: 64,
        });
        glow.intensity = 0.5;

        return scene;
    };
}

export default new TestScene();
