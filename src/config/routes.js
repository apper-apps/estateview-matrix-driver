import Home from '../pages/Home';
import PropertyDetail from '../pages/PropertyDetail';
import SavedProperties from '../pages/SavedProperties';
import MapView from '../pages/MapView';

export const routes = {
  browse: {
    id: 'browse',
    label: 'Browse',
    path: '/browse',
    icon: 'Home',
    component: Home
  },
  property: {
    id: 'property',
    label: 'Property',
    path: '/property/:id',
    icon: 'Building',
    component: PropertyDetail
  },
  saved: {
    id: 'saved',
    label: 'Saved',
    path: '/saved',
    icon: 'Heart',
    component: SavedProperties
  },
  map: {
    id: 'map',
    label: 'Map View',
    path: '/map',
    icon: 'Map',
    component: MapView
  }
};

export const routeArray = Object.values(routes);