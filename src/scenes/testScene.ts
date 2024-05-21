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
import * as ABCJson from "../../assets/data/ABC.json";

export class TestScene implements CreateSceneClass {
    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine);

        // This creates and positions a free camera (non-mesh)
        const cameraRadius = 10;
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

        // Billboard unit dimensions
        const x = 7;
        const y = 9;
        const spacing = 0.1;
        const letterSpacing = x * spacing;

        const ABC: Alphabet = ABCJson as Alphabet;

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

        interface Alphabet {
            [key: string]: string;
        }

        function createBillboardLetter(scene: Scene, offsetX: number) {
            const leds: Mesh[] = new Array(x * y);
            let led: Mesh;
            const matColor = new Color3(0.02, 0.02, 0.01);
            let pbr: PBRMaterial;

            for (let row = 0; row < y; row++) {
                for (let col = 0; col < x; col++) {
                    led = CreateSphere(
                        `led_${offsetX}_${col}_${row}`,
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
                    led.position.x = -col * spacing + offsetX;
                    led.position.y = -row * spacing + 1;
                    leds[row * x + col] = led;
                }
            }
            return leds;
        }

        const allLeds: Mesh[] = [];

        function clearPreviousLetters() {
            allLeds.forEach((led) => {
                led.dispose(); // Supprime les leds précédentes
            });
            allLeds.length = 0; // Vide le tableau
        }

        function displayTextOnBillboard(text: string) {
            clearPreviousLetters(); // Efface les lettres précédentes

            const letters = text.toUpperCase().split("");
            letters.reverse();

            letters.forEach((letter, index) => {
                if (ABC[letter]) {
                    const leds = createBillboardLetter(
                        scene,
                        index * letterSpacing
                    );
                    allLeds.push(...leds);

                    const letterPattern = ABC[letter].replace(/\s/g, "");
                    for (let j = 0; j < letterPattern.length; j++) {
                        if (letterPattern[j] === "1") {
                            const col = j % x;
                            const row = Math.floor(j / x);
                            const ledIndex = row * x + col;
                            if (ledIndex < leds.length) {
                                (
                                    leds[ledIndex].material as PBRMaterial
                                ).emissiveColor = Color3.White();
                            }
                        }
                    }
                }
            });
        }

        // Handle input event
        input.onKeyboardEventProcessedObservable.add(({ key }) => {
            if (key === "Enter") {
                const inputText = input.text;
                input.text = ""; // Clear the input field for the next entry
                displayTextOnBillboard(inputText); // Display the input text on the billboard
            }
        });

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
