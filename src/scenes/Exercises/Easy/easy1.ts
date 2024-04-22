/*
* PRIME COUNTER
*/

import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { CreateTorusKnot } from "@babylonjs/core/Meshes/Builders/torusKnotBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { CreateSceneClass } from "../../../createScene";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { PBRMaterial } from "@babylonjs/core/Materials/PBR/pbrMaterial";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import { AdvancedDynamicTexture, Button, Container, Control, StackPanel, TextBlock } from "@babylonjs/gui";

import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import "@babylonjs/core/Culling/ray";

export class TestScene implements CreateSceneClass {
    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine);

        // Uncomment to load the inspector (debugging) asynchronously

        // void Promise.all([
        //     import("@babylonjs/core/Debug/debugLayer"),
        //     import("@babylonjs/inspector"),
        // ]).then((_values) => {
        //     console.log(_values);
        //     scene.debugLayer.show({
        //         handleResize: true,
        //         overlay: true,
        //         globalRoot: document.getElementById("#root") || undefined,
        //     });
        // });

        // This creates and positions a free camera (non-mesh)
        const camera = new ArcRotateCamera(
            "arcRotateCamera",
            0,
            Math.PI/2,
            7,
            new Vector3(0, 1, 0),
            scene
        );

        camera.minZ = 0.1;
        camera.wheelDeltaPercentage = 0.01;
        camera.upperRadiusLimit = 10;
        camera.lowerRadiusLimit = 2;
        camera._panningMouseButton = 0;

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

        const torus = CreateTorusKnot("torus",{
            radius: 1,
            tube: 0.5,
            radialSegments: 128,
            tubularSegments: 128
        },
            scene
        );

        torus.position.y = 1.2;
        torus.rotation.y = Math.PI/2;
        torus.material = pbr;

        //* ***************************************
        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI('UI');

        // INSTRUCTIONS
        const userInstructions = new TextBlock();
        userInstructions.text = 
            `PRIMER NUMBER COUNTER
            Press - or + to display the
            previous or the next prime number`;
        userInstructions.color = "white";
        userInstructions.fontSize = 20;
        userInstructions.top = '30%';
        advancedTexture.addControl(userInstructions);
        
        // BUTTONS
        const buttonUp = Button.CreateSimpleButton('buttonUp', '+')
        buttonUp.horizontalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        buttonUp.cornerRadius = 5;
        buttonUp.width = '200px';
        buttonUp.height = '40px';
        buttonUp.color = 'green';
        buttonUp.background = 'teal';
        if(buttonUp.textBlock != undefined)
            buttonUp.textBlock.color = 'white';

        const buttonDown = Button.CreateSimpleButton('buttonDown', '-')
        buttonDown.horizontalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        buttonDown.cornerRadius = 5;
        buttonDown.width = '200px';
        buttonDown.height = '40px';
        buttonDown.color = 'green';
        buttonDown.background = 'teal';
        if(buttonDown.textBlock != undefined)
            buttonDown.textBlock.color = 'white';

        const stackPanel = new StackPanel();
        stackPanel.isVertical = false;
        stackPanel.spacing = 5;
        stackPanel.addControl(buttonDown);
        stackPanel.addControl(buttonUp);
        stackPanel.zIndex = 1000;
        advancedTexture.addControl(stackPanel);
        
        // INTERACTIONS
        let counter: number = 2;
        
        const counterDisplay = new TextBlock();
        counterDisplay.text = counter.toString();
        counterDisplay.color = "white";
        counterDisplay.fontSize = 56;
        counterDisplay.top = '-20%';
        advancedTexture.addControl(counterDisplay);
        
        //TODO: Do something when buttons are pressed
        buttonDown.onPointerUpObservable.add(()=>{
            counter--;
            counterDisplay.text = counter.toString();
        });

        buttonUp.onPointerUpObservable.add(()=>{
            counter++;
            counterDisplay.text = counter.toString();
        });
        //* ***************************************


        /////////
        // LIGHTS
        /////////
        //Directional light               
        const dlightPosition = new Vector3(0.02, -0.05, -0.05);
        const dLightOrientation = new Vector3(0, 20, 0);
        const dLight = new DirectionalLight(
            "dLight",
            dlightPosition,
            scene
        );
        dLight.intensity = 0.2;
        dLight.position.y = 10;

        //Directional light orientation
        dLight.position = dLightOrientation;

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        const hLight = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        hLight.intensity = 0.7;

        const env = scene.createDefaultEnvironment({
            createSkybox: true,
            skyboxSize: 150,
            skyboxColor: new Color3(0.01,0.01,0.01),
            createGround: false,
        });

        const shadowGenerator = new ShadowGenerator(512, dLight)
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurScale = 2;
        shadowGenerator.setDarkness(0.2);

        return scene;
    };
}

export default new TestScene();
