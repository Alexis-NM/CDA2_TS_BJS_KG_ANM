import { Engine } from "@babylonjs/core/Engines/engine";
import { WebGPUEngine } from "@babylonjs/core/Engines/webgpuEngine";
import { getSceneByNameModule } from "./createScene";
import { Scene } from "@babylonjs/core";

import * as GUI from "@babylonjs/gui";

export const babylonInit = async (): Promise<void> => {

    // Reference the scene creators
    const creatorHome = getSceneByNameModule();
    const creatorTestScene = getSceneByNameModule("test");
    const creatorUI = getSceneByNameModule("UI");

    const engineType =
        location.search.split("engine=")[1]?.split("&")[0] || "webgl";
    // Execute the pretasks, if defined
    // await Promise.all(createScenesModule.preTasks || []);

    // Get the canvas element
    const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    // Generate the BABYLON 3D engine
    let engine: Engine;
    if (engineType === "webgpu") {
        const webGPUSupported = await WebGPUEngine.IsSupportedAsync;
        if (webGPUSupported) {
            // You can decide which WebGPU extensions to load when creating the engine. I am loading all of them
            await import("@babylonjs/core/Engines/WebGPU/Extensions/");
            const webgpu = engine = new WebGPUEngine(canvas, {
                adaptToDeviceRatio: true,
                antialias: true,
            });
            await webgpu.initAsync();
            engine = webgpu;
        } else {
            engine = new Engine(canvas, true);
        }
    } else {
        engine = new Engine(canvas, true);
    }

    // Create the scenes
    const UI = await creatorUI.createScene(engine, canvas);
    const home = await creatorHome.createScene(engine, canvas);
    const testScene = await creatorTestScene.createScene(engine, canvas);

    const scenes: Scene[] = [home, testScene];
    
    let currentScene = home;

    if(UI.isReady())
    {
        const buttons: GUI.Control[] = (UI.getTextureByName('UI') as GUI.AdvancedDynamicTexture).getControlsByType('Button');
        if(buttons.length > 0)
        {
            for (let index = 0; index < buttons.length; index++) {
                if(buttons[index].name != 'menuToggle')
                {                
                    buttons[index].onPointerUpObservable.add(()=>
                    {
                        currentScene = scenes[index];
                    }); 
                }               
            }
        }
    }

    // JUST FOR TESTING. Not needed for anything else
    // (window as any).scene = scene;

    // Register a render loop to repeatedly render the scene
    engine.runRenderLoop(function () {
        //currentScene.render();
        testScene.render();
        // home.render();
        UI.render();
    });

    // Watch for browser/canvas resize events
    window.addEventListener("resize", function () {
        engine.resize();
    });
};

babylonInit().then(() => {
    // scene started rendering, everything is initialized
});
