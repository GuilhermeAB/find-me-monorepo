import { AlertImageGetService } from '../get-by-alert';
import { AlertImageService } from '../../base';
import { UUID } from '@find-me/uuid';
import { AlertImageEntity, ImageType } from '@find-me/entities';
import { ValidationError } from '@find-me/errors';

jest.mock('../../base');

const alertImage = AlertImageEntity.create({
  alert: UUID.generate(),
  height: 100,
  width: 100,
  type: ImageType.Webp,
  size: 1000,
});

let repositoryGetByAlertIdMock: jest.Mock;

let cacheGetMock: jest.Mock;
let cacheAddMock: jest.Mock;

let storageGetUrlMock: jest.Mock;

describe('AlertImageGetService', () => {
  beforeEach(() => {
    process.env.AWS_BUCKET_IMAGE = 'AWS_BUCKET_IMAGE';

    repositoryGetByAlertIdMock = jest.fn().mockResolvedValue(alertImage);

    cacheGetMock = jest.fn().mockResolvedValue('url');
    cacheAddMock = jest.fn();

    storageGetUrlMock = jest.fn().mockResolvedValue('url');

    // @ts-ignore
    AlertImageService.prototype.repository = {
      getByAlertId: repositoryGetByAlertIdMock,
    };
    // @ts-ignore
    AlertImageService.prototype.cache = {
      get: cacheGetMock,
      add: cacheAddMock,
    };
    // @ts-ignore
    AlertImageService.prototype.storage = {
      getUrl: storageGetUrlMock,
    };
  });

  afterEach(() => {
    // Reset all mocks after each test
    jest.resetAllMocks();
  });

  describe('getByAlert', () => {
    it('should get the alert image URL', async () => {
      const {
        id,
        alert,
        type,
      } = alertImage.getProps();
      const imagePath = `${typeof alert === 'string' ? alert : alert.value}/${id.value}.${type}`;

      await expect(AlertImageGetService.prototype.getByAlert.call(
        new AlertImageGetService(),
        id.value,
      )).resolves.toBeTruthy();
      expect(repositoryGetByAlertIdMock).toHaveBeenCalledWith(id.value);
      expect(cacheGetMock).toHaveBeenCalledWith(`images:${imagePath}`);
      expect(storageGetUrlMock).toHaveBeenCalledTimes(0);
      expect(cacheAddMock).toHaveBeenCalledTimes(0);
    });

    it('should get the alert image URL when alert is string', async () => {
      const newAlertImage = AlertImageEntity.create({
        alert: UUID.generate().value,
        height: 100,
        width: 100,
        type: ImageType.Webp,
        size: 1000,
      });
      repositoryGetByAlertIdMock.mockResolvedValue(newAlertImage);

      const {
        id,
        alert,
        type,
      } = newAlertImage.getProps();
      const imagePath = `${typeof alert === 'string' ? alert : alert.value}/${id.value}.${type}`;

      await expect(AlertImageGetService.prototype.getByAlert.call(
        new AlertImageGetService(),
        id.value,
      )).resolves.toBeTruthy();
      expect(repositoryGetByAlertIdMock).toHaveBeenCalledWith(id.value);
      expect(cacheGetMock).toHaveBeenCalledWith(`images:${imagePath}`);
      expect(storageGetUrlMock).toHaveBeenCalledTimes(0);
      expect(cacheAddMock).toHaveBeenCalledTimes(0);
    });

    it('should save cache url if cache is undefined', async () => {
      cacheGetMock.mockResolvedValue(undefined);

      const {
        id,
        alert,
        type,
      } = alertImage.getProps();
      const imagePath = `${typeof alert === 'string' ? alert : alert.value}/${id.value}.${type}`;

      await expect(AlertImageGetService.prototype.getByAlert.call(
        new AlertImageGetService(),
        id.value,
      )).resolves.toBeTruthy();
      expect(repositoryGetByAlertIdMock).toHaveBeenCalledWith(id.value);
      expect(cacheGetMock).toHaveBeenCalledWith(`images:${imagePath}`);
      expect(storageGetUrlMock).toHaveBeenCalledTimes(1);
      expect(cacheAddMock).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if environment is invalid', async () => {
      delete process.env.AWS_BUCKET_IMAGE;

      const {
        id,
      } = alertImage.getProps();

      await expect(AlertImageGetService.prototype.getByAlert.call(
        new AlertImageGetService(),
        id.value,
      )).rejects.toThrowError(ValidationError);
      expect(repositoryGetByAlertIdMock).toHaveBeenCalledTimes(0)
      expect(cacheGetMock).toHaveBeenCalledTimes(0)
      expect(storageGetUrlMock).toHaveBeenCalledTimes(0);
      expect(cacheAddMock).toHaveBeenCalledTimes(0);
    });

    it('should throw an error if alert not found', async () => {
      repositoryGetByAlertIdMock.mockResolvedValue(undefined);

      const {
        id,
      } = alertImage.getProps();

      await expect(AlertImageGetService.prototype.getByAlert.call(
        new AlertImageGetService(),
        id.value,
      )).rejects.toThrowError(ValidationError);
      expect(repositoryGetByAlertIdMock).toHaveBeenCalledTimes(1)
      expect(cacheGetMock).toHaveBeenCalledTimes(0)
      expect(storageGetUrlMock).toHaveBeenCalledTimes(0);
      expect(cacheAddMock).toHaveBeenCalledTimes(0);
    });
  });
});
