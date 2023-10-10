import DescriptionPanel from './controls/DescriptionPanel';
import ObjectPicker from './controls/ObjectPicker';
import GalaxyViewMediator from './mediator/GalaxyViewMediator';
import ViewMediatorFactory from './ViewMediatorFactory';
import RenderingContext from './RenderingContext';
import Observable from '../Observable';
import * as d3 from "d3"
import { param } from 'jquery';


export const observable = new Observable();
/*************************************************** */
export default class MainView {

    constructor(controller, galaxy, elementId) {
        this.controller = controller;
        this.galaxy = galaxy;
        this.renderingContext = this.createRenderingContext(elementId);
        this.galaxyViewMediator = new GalaxyViewMediator(galaxy, new ViewMediatorFactory());
        this.objectPicker = new ObjectPicker(this.galaxyViewMediator, this.renderingContext);
        this.descriptionPanel = new DescriptionPanel();
        //
        this.animationFrameId = null;
        //this.observable = new Observable();   
        
        this.data = [];        
    }

    createRenderingContext(elementId) {
        //const domContainer = document.createElement('div');
        //document.body.appendChild(domContainer);
        const domContainer = document.getElementById(elementId);

        return RenderingContext.getDefault(domContainer);
    }

    initialize() {
        const scene = this.renderingContext.scene;
        const object3D = this.galaxyViewMediator.object3D;
        scene.add(object3D);
        

        this.objectPicker.initialize();
        this.objectPicker.addObserver('doubleclick', (e) => this.controller.onDoubleClick(e.astronomicalBody));
        this.objectPicker.addObserver('click', (e) => this.controller.onClick(e.astronomicalBody));
        this.objectPicker.addObserver('mousemove', (e) => this.controller.onMouseMove(e.astronomicalBody));

        window.addEventListener( 'resize', (e) => this.onWindowResize(), false );
        /**************************************************************/
     
       
       // window.guiOptions = options;
        let gui = new dat.GUI({ autoPlace: false });
        gui.domElement.id = 'gui-container';
        document.body.appendChild(gui.domElement);


        /******************************************************************************************/
        //load data
        let loadedData = null;
        function handleFileSelect(event) {
            let file = event.target.files[0];
            let reader = new FileReader(); 
                                  
            reader.onload = res => {
                loadedData = d3.csvParse(res.target.result);
                console.log(loadedData)
            };
            reader.onerror = (err) => console.log(err);
            reader.readAsText(file, 'UTF-8');
        };

        let fileInput = document.createElement('input');
        fileInput.type = 'file';
        //fileInput.style.display = "none";
        //fileInput.style.visibility = "hidden";
        fileInput.style.opacity = 0;
        gui.add({
            loadData: function() {
                fileInput.addEventListener("change", handleFileSelect, false);
                fileInput.click();
            }
        }, 'loadData').name("Load Data")
        /******************************************************************************************/

        /******************************************************************************************/
        //create a digital universe folder
        let digUniFolder = gui.addFolder("Digital Universe");
        //stop
        const stopoption = { stop: false };
        digUniFolder.add(stopoption, 'stop')
            .onChange((value) => {
                if (value) {
                    this.pauseAnimation();
            } else {
                    this.resumeAnimation();
                }
            });

        digUniFolder.add(this.renderingContext.camera.position, 'x', -100, 100).listen();
        digUniFolder.add(this.renderingContext.camera.position, 'y', -100, 100).listen();
        digUniFolder.add(this.renderingContext.camera.position, 'z', -100, 100).listen();

        let loadPointCloudOption = { loadPointCloud: true};
        digUniFolder.add(loadPointCloudOption, 'loadPointCloud')
            .onChange(function(value2){
                window.parent.postMessage({ type: 'loadPointCloud', load:value2 }, '*'); 
            });       


        let coloroptions = { Mass: false};
        digUniFolder.add(coloroptions, 'Mass')
            .onChange(function(value3){
                window.parent.postMessage({ type: 'color', colorOption:value3 }, '*'); 
            });

        digUniFolder.close();
        /******************************************************************************************/

        /******************************************************************************************/
        //analyze the loaded data or not
        let isAnalysis = { Analysis: true };
        gui.add(isAnalysis , 'Analysis')
            .onChange((value) => {
                if (value) {  
                    document.getElementById("hrDiagram").style.width = "35%";
                    document.getElementById("hrDiagram").style.height = "50%";   
                    document.getElementById("dimRed").style.width = "35%";
                    document.getElementById("dimRed").style.height = "50%";
                    document.getElementById("multiVar").style.width = "65%";
                    document.getElementById("multiVar").style.height = "40%";
                    document.getElementById("digUniv").style.width = "65%";
                    document.getElementById("digUniv").style.height = "60%";          
                } else {
                    document.getElementById("digUniv").style.width = "100%";
                    document.getElementById("digUniv").style.height = "100%";                   

                    document.getElementById("dimRed").style.width = "0px";
                    document.getElementById("dimRed").style.height = "0px";
                    document.getElementById("multiVar").style.width = "0px";
                    document.getElementById("multiVar").style.height = "0px";
                    document.getElementById("hrDiagram").style.width = "0px";
                    document.getElementById("hrDiagram").style.height = "0px";

                    //refresh the page
                    this.renderingContext.renderer.setSize(window.innerWidth, window.innerHeight);
                }
            });
        /******************************************************************************************/

        /******************************************************************************************/
        let dimRedFolder = gui.addFolder("Dimension Reduction");
        dimRedFolder.close();
        /******************************************************************************************/

        /******************************************************************************************/
        let hrDiagram = gui.addFolder("HR Diagram");
        hrDiagram.close();
        /******************************************************************************************/

        /******************************************************************************************/
        let multView = gui.addFolder("Multivariate Visualization");
        multView.close();
        /******************************************************************************************/

        this.gui = gui;
        this.render();        
    }
   
    render() {
        this.renderingContext.controls.update();
        this.animationFrameId = requestAnimationFrame(() => this.render());

        this.galaxyViewMediator.onFrameRenderered();
        this.renderingContext.renderer.render(this.renderingContext.scene, this.renderingContext.camera);      
    }

    pauseAnimation() {
        cancelAnimationFrame( this.animationFrameId );
    }

    resumeAnimation() {
        this.render(performance.now());
    }

    loadPointCloud() {
        this.loadPointCloud= true;
        return new PointCloudViewMediator(astronomicalBody, this);
    }


    onWindowResize(){
        this.renderingContext.camera.aspect = window.innerWidth / window.innerHeight;
        this.renderingContext.camera.updateProjectionMatrix();

        this.renderingContext.renderer.setSize(window.innerWidth, window.innerHeight);
        this.objectPicker.notifyWindowResize();
    }


}

