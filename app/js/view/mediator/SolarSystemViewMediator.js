import ViewMediator from './ViewMediator';
import { observable } from '../MainView';
// import Observable from '.../Observable';


export default class SolarSystemViewMediator extends ViewMediator {
    constructor(solarSystem, mediatorFactory) {
        super(solarSystem, mediatorFactory);
        
        this.sunViewMediator = this.mediatorFactory.getMediator(solarSystem.sun);
        this.object3D.add(this.sunViewMediator.object3D);

       

        this.pointcloudViewMediator = this.mediatorFactory.getMediator(solarSystem.pointcloud);
        this.object3D.add(this.pointcloudViewMediator.object3D);
        //this.object3D.remove(this.pointcloudViewMediator.object3D);

        
        
        /************************************/
        // var guiPointCloud = new dat.GUI({ autoPlace: false });
        // guiPointCloud.domElement.id = 'guiPointCloud-container';
        // document.body.appendChild(guiPointCloud.domElement);
        //  var options = { loadPointCloud: true};
        // guiPointCloud.add(options, 'loadPointCloud').onChange((value2)=> {
        //     if(value2){
        //         this.object3D.add(this.pointcloudViewMediator.object3D);
        //     }else{
        //        this.object3D.remove(this.pointcloudViewMediator.object3D);
        //     }
            
        //   });不用这个gui了，用下面这个listener，gui改到mainView了

          var self = this;
          var loadvalue=true;
          window.addEventListener('message', function(event) {
            if (event.data.type === 'loadPointCloud') {
                loadvalue=event.data.load;
                if(loadvalue){
                    self.object3D.add(self.pointcloudViewMediator.object3D);
                }else{
                    self.object3D.remove(self.pointcloudViewMediator.object3D);
                }
                }
            });
      

       
        // const observer = {
        //     update: (value2) => {
        //       if (value2) {
        //         console.log(" on!");
        //         //this.pointcloudViewMediator = this.mediatorFactory.getMediator(solarSystem.pointcloud);
        //         this.object3D.add(this.pointcloudViewMediator.object3D);
        //       } else {
        //        //this.pointcloudViewMediator = this.mediatorFactory.getMediator(solarSystem.pointcloud);
        //       this.object3D.remove(this.pointcloudViewMediator.object3D);
        //        console.log(" off!");
        //       }
        //     }
        //   };

        // observable.addObserver('2023713', observer);
        
       
        
        this.astronomicalBody.addObserver("PlanetAdded", (e) => this.onPlanetAdded(e));
        this.astronomicalBody.addObserver("PlanetRemoved", (e) => this.onPlanetRemoved(e));
    }

    onPlanetAdded(e) {
        this.addChild(e.planet);
    }

    onPlanetRemoved(e) {
        this.removeChild(e.planet);
    }
}