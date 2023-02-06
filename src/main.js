import AppPresenter from './presenters/app-presenter';
import PointsModel from './models/points-model';
import PointsApiService from './api/points-api-service';
import { AUTHORIZATION, END_POINT } from './consts/api';
import OffersModel from './models/offers-model';
import DestinationsApiService from './api/destinations-api-service';
import OffersApiService from './api/offers-api-service';
import DestinationsModel from './models/destinations-model';

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);
const destinationsApiService = new DestinationsApiService(END_POINT, AUTHORIZATION);
const offerApiService = new OffersApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel(pointsApiService);
const offersModel = new OffersModel(offerApiService);
const destinationsModel = new DestinationsModel(destinationsApiService);

const appPresenter = new AppPresenter({
  element: {
    newEventButton: document.querySelector('.trip-main__event-add-btn')
  },
  container: {
    filters: document.querySelector('.trip-controls__filters'),
    tripEvents: document.querySelector('.trip-events'),
    tripInfo: document.querySelector('.trip-main')
  }
});

appPresenter.init(true);

Promise.all([pointsModel.init(), offersModel.init(), destinationsModel.init()])
  .then(() => {
    appPresenter.init(false);
  })
  .catch(() => {
    appPresenter.init(false);
  });
