import { AlertListService } from '../list';
import { AlertService } from '../../base';
import { AlertLocationType, AlertPersonEntity, AlertTypeEnum } from '@find-me/entities';
import { UUID } from '@find-me/uuid';
import { DateVO } from '@find-me/date';

jest.mock('../../base');

const alert = AlertPersonEntity.create({
  account: UUID.generate(),
  birthDate: new DateVO('2000-01-01'),
  name: 'Alice',
  description: 'Description'.repeat(5),
  disappearDate: new DateVO('2022-01-01'),
  type: AlertTypeEnum.Person,
  location: {
    type: AlertLocationType.Point,
    coordinates: [-49.242825, -25.383585],
  },
  info: {
    isPCD: false,
  },
});

let repositoryListMock: jest.Mock;
let repositoryGetNearbyMock: jest.Mock;
let repositoryFindByIdMock: jest.Mock;
let repositoryListByUser: jest.Mock;

describe('AlertListService', () => {
  beforeEach(() => {
    repositoryListMock = jest.fn().mockResolvedValue([{}]);
    repositoryGetNearbyMock = jest.fn().mockResolvedValue([{}]);
    repositoryFindByIdMock = jest.fn().mockResolvedValue(alert);
    repositoryListByUser = jest.fn().mockResolvedValue([{}]);

    // @ts-ignore
    AlertListService.prototype.repository = {
      list: repositoryListMock,
      getNearby: repositoryGetNearbyMock,
      findById: repositoryFindByIdMock,
      listByUser: repositoryListByUser,
    };
  });

  afterEach(() => {
    // Reset all mocks after each test
    jest.resetAllMocks();
  });

  describe('list', () => {
    it('should return a list of alerts', async () => {
      await expect(AlertListService.prototype.list.call(
        new AlertListService(),
      )).resolves.toBeTruthy();
    });
  });

  describe('nearbyList', () => {
    it('should return a list of nearby alerts', async () => {
      await expect(AlertListService.prototype.nearbyList.call(
        new AlertListService(),
        -25.383585,
        -49.242825,
      )).resolves.toBeTruthy();
    });
  });

  describe('getById', () => {
    it('should return a alert', async () => {
      await expect(AlertListService.prototype.getById.call(
        new AlertListService(),
        'id',
      )).resolves.toBeTruthy();
      expect(repositoryFindByIdMock).toHaveBeenCalledTimes(1);
    });

    it('should return undefined if alert not found', async () => {
      repositoryFindByIdMock.mockResolvedValue(undefined);

      await expect(AlertListService.prototype.getById.call(
        new AlertListService(),
        'id',
      )).resolves.toBeUndefined();
    });
  });

  describe('listByUser', () => {
    it('should list the alerts of the current user', async () => {
      await expect(AlertListService.prototype.listByUser.call(
        new AlertListService(),
        'id',
      )).resolves.toBeTruthy();
    });
  });
});
