import { AlertUpdateService } from '../update';
import { AlertService } from '../../base';
import { UUID } from '@find-me/uuid';
import { DateVO } from '@find-me/date';
import { AlertImageEntity, AlertLocationType, AlertPersonEntity, AlertTypeEnum, ImageType } from '@find-me/entities';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ValidationError } from '@find-me/errors';

jest.mock('../../base');

const alertPerson = AlertPersonEntity.create({
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

const alertImage = new AlertImageEntity({
  id: UUID.generate(),
  props: {
    alert: UUID.generate(),
    height: 100,
    width: 100,
    type: ImageType.Webp,
    size: 1000,
  },
});

const {
  account,
} = alertPerson.getProps();

const updateAlertProps = {
  account: account instanceof UUID || typeof account === 'string' ? UUID.generate(account).value : account.getProps().id.value,
  birthDate: new DateVO('2001-01-01'),
  name: 'Alice',
  description: 'Description'.repeat(5),
  disappearDate: new DateVO('2022-01-01'),
  location: {
    type: AlertLocationType.Point,
    coordinates: [-47.242825, -25.283585],
  },
  info: {
    isPCD: false,
  },
};

let repositoryUpdateOneMock: jest.Mock;
let repositoryUpdateStatusMock: jest.Mock;
let repositoryFindOneByIdMock: jest.Mock;

let repositoryImageGetByAlertIdMock: jest.Mock;
let repositoryImageUpdateOneMock: jest.Mock;

let storageUploadMock: jest.Mock;
let storageDeleteMock: jest.Mock;

describe('AlertUpdateService', () => {
  beforeEach(() => {
    process.env.AWS_BUCKET_IMAGE = 'AWS_BUCKET_IMAGE';

    repositoryUpdateOneMock = jest.fn();
    repositoryUpdateStatusMock = jest.fn();
    repositoryFindOneByIdMock = jest.fn().mockResolvedValue(alertPerson);

    repositoryImageGetByAlertIdMock = jest.fn().mockResolvedValue(alertImage);
    repositoryImageUpdateOneMock = jest.fn();

    storageUploadMock = jest.fn();
    storageDeleteMock = jest.fn();

    // @ts-ignore
    AlertUpdateService.prototype.repository = {
      updateOne: repositoryUpdateOneMock,
      updateStatus: repositoryUpdateStatusMock,
      findOneById: repositoryFindOneByIdMock,
    };
    // @ts-ignore
    AlertUpdateService.prototype.repositoryImage = {
      getByAlertId: repositoryImageGetByAlertIdMock,
      updateOne: repositoryImageUpdateOneMock,
    };
    // @ts-ignore
    AlertUpdateService.prototype.storage = {
      upload: storageUploadMock,
      delete: storageDeleteMock,
    };
  });

  afterEach(() => {
    // Reset all mocks after each test
    jest.resetAllMocks();
  });

  describe('update', () => {
    it('should update an alert', async () => {
      const {
        id,
      } = alertPerson.getProps();

      const image = readFileSync(resolve(__dirname, './images/image.jpeg'));

      await expect(AlertUpdateService.prototype.update.call(
        new AlertUpdateService(),
        id.value,
        updateAlertProps,
        image,
      )).resolves.toBeUndefined();
      expect(repositoryFindOneByIdMock).toHaveBeenCalledTimes(1);
      expect(repositoryUpdateOneMock).toHaveBeenCalledTimes(1);
      expect(repositoryImageGetByAlertIdMock).toHaveBeenCalledTimes(1);
      expect(repositoryImageUpdateOneMock).toHaveBeenCalledTimes(1);
      expect(storageUploadMock).toHaveBeenCalledTimes(1);
      expect(storageDeleteMock).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if alert is not found', async () => {
      const {
        id,
      } = alertPerson.getProps();

      repositoryFindOneByIdMock.mockResolvedValue(undefined);

      const image = readFileSync(resolve(__dirname, './images/image.jpeg'));

      await expect(AlertUpdateService.prototype.update.call(
        new AlertUpdateService(),
        id.value,
        updateAlertProps,
        image,
      )).rejects.toThrowError(ValidationError);
      expect(repositoryFindOneByIdMock).toHaveBeenCalledTimes(1);
      expect(repositoryUpdateOneMock).toHaveBeenCalledTimes(0);
      expect(repositoryImageGetByAlertIdMock).toHaveBeenCalledTimes(0);
      expect(repositoryImageUpdateOneMock).toHaveBeenCalledTimes(0);
      expect(storageUploadMock).toHaveBeenCalledTimes(0);
      expect(storageDeleteMock).toHaveBeenCalledTimes(0);
    });

    it('should throw an error if the alert is created by another user', async () => {
      const {
        id,
      } = alertPerson.getProps();

      const image = readFileSync(resolve(__dirname, './images/image.jpeg'));

      await expect(AlertUpdateService.prototype.update.call(
        new AlertUpdateService(),
        id.value,
        {
          ...updateAlertProps,
          account: UUID.generate(),
        },
        image,
      )).rejects.toThrowError(ValidationError);
      expect(repositoryFindOneByIdMock).toHaveBeenCalledTimes(1);
      expect(repositoryUpdateOneMock).toHaveBeenCalledTimes(0);
      expect(repositoryImageGetByAlertIdMock).toHaveBeenCalledTimes(0);
      expect(repositoryImageUpdateOneMock).toHaveBeenCalledTimes(0);
      expect(storageUploadMock).toHaveBeenCalledTimes(0);
      expect(storageDeleteMock).toHaveBeenCalledTimes(0);
    });

    it('should throw and error if the environment is invalid', async () => {
      delete process.env.AWS_BUCKET_IMAGE;

      const {
        id,
      } = alertPerson.getProps();

      const image = readFileSync(resolve(__dirname, './images/image.jpeg'));

      await expect(AlertUpdateService.prototype.update.call(
        new AlertUpdateService(),
        id.value,
        updateAlertProps,
        image,
      )).rejects.toThrowError(ValidationError);
      expect(repositoryFindOneByIdMock).toHaveBeenCalledTimes(1);
      expect(repositoryUpdateOneMock).toHaveBeenCalledTimes(1);
      expect(repositoryImageGetByAlertIdMock).toHaveBeenCalledTimes(0);
      expect(repositoryImageUpdateOneMock).toHaveBeenCalledTimes(0);
      expect(storageUploadMock).toHaveBeenCalledTimes(0);
      expect(storageDeleteMock).toHaveBeenCalledTimes(0);
    });

    it('should throw and error if the current image is not found', async () => {
      repositoryImageGetByAlertIdMock.mockResolvedValue(undefined);

      const {
        id,
      } = alertPerson.getProps();

      const image = readFileSync(resolve(__dirname, './images/image.jpeg'));

      await expect(AlertUpdateService.prototype.update.call(
        new AlertUpdateService(),
        id.value,
        updateAlertProps,
        image,
      )).rejects.toThrowError(ValidationError);
      expect(repositoryFindOneByIdMock).toHaveBeenCalledTimes(1);
      expect(repositoryUpdateOneMock).toHaveBeenCalledTimes(1);
      expect(repositoryImageGetByAlertIdMock).toHaveBeenCalledTimes(1);
      expect(repositoryImageUpdateOneMock).toHaveBeenCalledTimes(0);
      expect(storageUploadMock).toHaveBeenCalledTimes(0);
      expect(storageDeleteMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('updateStatus', () => {
    it('should update status', async () => {
      const {
        id,
        account,
      } = alertPerson.getProps();

      await expect(AlertUpdateService.prototype.updateStatus.call(
        new AlertUpdateService(),
        id.value,
        account instanceof UUID || typeof account === 'string' ? UUID.generate(account).value : account.getProps().id.value,
        'Resolved',
      )).resolves.toBeUndefined();
      expect(repositoryFindOneByIdMock).toHaveBeenCalledTimes(1);
      expect(repositoryUpdateStatusMock).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the alert is not found', async () => {
      const {
        id,
        account,
      } = alertPerson.getProps();

      repositoryFindOneByIdMock.mockResolvedValue(undefined);

      await expect(AlertUpdateService.prototype.updateStatus.call(
        new AlertUpdateService(),
        id.value,
        account instanceof UUID || typeof account === 'string' ? UUID.generate(account).value : account.getProps().id.value,
        'Resolved',
      )).rejects.toThrowError(ValidationError);
      expect(repositoryFindOneByIdMock).toHaveBeenCalledTimes(1);
      expect(repositoryUpdateStatusMock).toHaveBeenCalledTimes(0);
    });

    it('should throw an error if the alert is created by another user', async () => {
      const {
        id,
      } = alertPerson.getProps();

      await expect(AlertUpdateService.prototype.updateStatus.call(
        new AlertUpdateService(),
        id.value,
        UUID.generate().value,
        'Resolved',
      )).rejects.toThrowError(ValidationError);
      expect(repositoryFindOneByIdMock).toHaveBeenCalledTimes(1);
      expect(repositoryUpdateStatusMock).toHaveBeenCalledTimes(0);
    });
  });
});
