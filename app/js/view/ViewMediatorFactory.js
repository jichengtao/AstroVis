import GalaxyViewMediator from './mediator/GalaxyViewMediator';
import SolarSystemViewMediator from './mediator/SolarSystemViewMediator';
import PlanetViewMediator from './mediator/PlanetViewMediator';
import SunViewMediator from './mediator/SunViewMediator';
import PointCloudViewMediator from './mediator/PointCloudViewMediator';

export default class ViewMediatorFactory {
    getMediator(astronomicalBody) {
        switch (astronomicalBody.className) {
            case 'Galaxy':
                return new GalaxyViewMediator(astronomicalBody, this);
            case 'SolarSystem':
                return new SolarSystemViewMediator(astronomicalBody, this);
            case 'Sun':
                return new SunViewMediator(astronomicalBody, this);
            case 'Planet':
                return new PlanetViewMediator(astronomicalBody, this);
            case 'PointCloud':
                return new PointCloudViewMediator(astronomicalBody, this);
        }
       
    }

    // getMediator(astronomicalBody,loadPointCloud) {
    //     if (astronomicalBody.className === 'PointCloud' && loadPointCloud) {
    //         return new PointCloudViewMediator(astronomicalBody, this);
    //       } else {
    //         return null; 
    //       }
    // }
}
