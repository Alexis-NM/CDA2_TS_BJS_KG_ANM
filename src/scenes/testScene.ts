/*
 * STACK GEN AND SORT
 */

import { Engine } from "@babylonjs/core/Engines/engine";
import { Scene } from "@babylonjs/core/scene";
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { CreateSceneClass } from "../createScene";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { Color3 } from "@babylonjs/core/Maths/math.color";
import {
    AdvancedDynamicTexture,
    Button,
    Control,
    StackPanel,
    TextBlock,
} from "@babylonjs/gui";
import { CreateBox } from "@babylonjs/core";

export class TestScene implements CreateSceneClass {
    createScene = async (
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Promise<Scene> => {
        // This creates a basic Babylon Scene object (non-mesh)
        const scene = new Scene(engine);

        // This creates and positions a free camera (non-mesh)
        const cameraRadius = 15;
        const camera = new ArcRotateCamera(
            "arcRotateCamera",
            Math.PI / 2.5,
            Math.PI / 2.1,
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

        /**************************** */
        const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // INSTRUCTIONS
        const userInstructions = new TextBlock();
        userInstructions.text = `STACK GEN AND SORT
            Use the buttons to generate a stack of random cubes
            and to sort them from the biggest (bottom) to the smallest (top)`;
        userInstructions.color = "white";
        userInstructions.fontSize = 20;
        userInstructions.top = "30%";
        advancedTexture.addControl(userInstructions);

        // BUTTONS
        const generateButton = Button.CreateSimpleButton(
            "generateButton",
            "GENERATE"
        );
        const sortButton = Button.CreateSimpleButton("sortButton", "SORT");

        generateButton.horizontalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        generateButton.cornerRadius = 10;
        generateButton.width = "200px";
        generateButton.height = "50px";
        generateButton.color = "white";
        generateButton.background = "#AA7777";
        if (generateButton.textBlock != undefined)
            generateButton.textBlock.color = "white";

        sortButton.horizontalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        sortButton.cornerRadius = 10;
        sortButton.width = "200px";
        sortButton.height = "50px";
        sortButton.color = "white";
        sortButton.background = "#7777AA";
        if (sortButton.textBlock != undefined)
            sortButton.textBlock.color = "white";

        const stackPanel = new StackPanel();
        stackPanel.isVertical = false;
        stackPanel.spacing = 50;
        stackPanel.top = "15%";
        stackPanel.addControl(generateButton);
        stackPanel.addControl(sortButton);
        stackPanel.zIndex = 1000;
        advancedTexture.addControl(stackPanel);

        //TODO: Do something when buttons are pressed

        // Variables globales
        let totalHeight = 0;
        const blockSpacing = 0.3;

        // Objet pour stocker les boîtes créées avec leurs dimensions
        const boxMap: {
            [name: string]: {
                length: number;
                width: number;
                height: number;
                mesh: Mesh;
            };
        } = {};

        // Fonction pour générer un nouveau bloc avec des dimensions aléatoires
        const generateBlock = () => {
            // Taille aléatoire pour le nouveau bloc
            const length = Math.random() + 1; // Longueur comprise entre 1 et 2
            const width = Math.random() + 1; // Largeur comprise entre 1 et 1.5
            const height = 0.5; // Hauteur fixe

            // Créé une nouvelle boîte avec les dimensions aléatoires
            const boxName = `box_${Object.keys(boxMap).length}`; // Nom unique pour chaque boîte basé sur le nombre actuel de boîtes
            const box = CreateBox(
                boxName,
                {
                    size: length,
                    width: width,
                    height: height,
                },
                scene
            );

            // Stocke les dimensions de la boîte et la boîte elle-même dans l'objet boxMap
            boxMap[boxName] = { length, width, height, mesh: box };

            // Position en fonction de la hauteur totale des blocs créés
            const yPos = totalHeight;

            // Ajoute la hauteur du bloc et l'espacement à la hauteur totale
            totalHeight += height + blockSpacing;

            // Positionne la nouvelle boîte
            box.position = new Vector3(0, yPos, 0);

            return box;
        };

        const sortBoxes = () => {
            // Trie les boîtes en fonction de leur surface (length * width)
            const sortedBoxNames = Object.keys(boxMap).sort((a, b) => {
                const areaA = boxMap[a].length * boxMap[a].width;
                const areaB = boxMap[b].length * boxMap[b].width;
                return areaB - areaA; // Trie du plus grand au plus petit
            });

            // Change la position de chaque boîte en fonction du nouvel ordre
            sortedBoxNames.forEach((boxName, index) => {
                const yPos = index * (0.5 + blockSpacing); // Calcule la position y en fonction de l'index
                const box = boxMap[boxName].mesh; // Trouve la boîte correspondante dans l'objet des boîtes
                if (box) {
                    box.position.y = yPos;
                }
            });
        };

        // Écouteur d'événement sur le bouton pour appeler la fonction generateBlock
        generateButton.onPointerUpObservable.add(() => {
            generateBlock();
        });

        // Écouter d'évenement sur le bouton pour appeler la fonction sortBoxes
        sortButton.onPointerUpObservable.add(() => {
            sortBoxes();
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

        return scene;
    };
}

export default new TestScene();
