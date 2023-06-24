import { AlertCreateService } from '../create';
import { AlertService } from '../../base';
import { UUID } from '@find-me/uuid';
import { DateVO } from '@find-me/date';
import { AccountEntity, AccountRole, AccountStatus, AlertLocationType, AlertTypeEnum, PetType } from '@find-me/entities';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ValidationError } from '@find-me/errors';

jest.mock('../../base');

let repositoryCreateMock: jest.Mock;
let repositoryCountByAccountMock: jest.Mock;

let repositoryImageCreateMock: jest.Mock;

let storageUploadMock: jest.Mock;

const alertPerson = {
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
};
const alertPet = {
  account: UUID.generate(),
  birthDate: new DateVO('2015-01-01'),
  name: 'Nami',
  description: 'Description'.repeat(5),
  disappearDate: new DateVO('2022-01-01'),
  type: AlertTypeEnum.Pet,
  location: {
    type: AlertLocationType.Point,
    coordinates: [-49.242825, -25.383585],
  },
  info: {
    petType: PetType.Cat,
  },
};

describe('AlertCreateService', () => {
  beforeEach(() => {
    process.env.AWS_BUCKET_IMAGE = 'AWS_BUCKET_IMAGE';

    repositoryCreateMock = jest.fn();
    repositoryCountByAccountMock = jest.fn().mockResolvedValue({ total: 0, open: 0 });

    repositoryImageCreateMock = jest.fn();

    storageUploadMock = jest.fn();

    // @ts-ignore
    AlertCreateService.prototype.repository = {
      create: repositoryCreateMock,
      countByAccount: repositoryCountByAccountMock,
    };
    // @ts-ignore
    AlertCreateService.prototype.repositoryImage = {
      create: repositoryImageCreateMock,
    };
    // @ts-ignore
    AlertCreateService.prototype.storage = {
      upload: storageUploadMock,
    };
  });

  afterEach(() => {
    // Reset all mocks after each test
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a person alert', async () => {
      const image = readFileSync(resolve(__dirname, './images/image.jpeg'));

      await expect(AlertCreateService.prototype.create.call(
        new AlertCreateService(),
        alertPerson,
        image,
      )).resolves.toBeUndefined();
    });

    it('should create a pet alert', async () => {
      const image = readFileSync(resolve(__dirname, './images/image.jpeg'));

      await expect(AlertCreateService.prototype.create.call(
        new AlertCreateService(),
        alertPet,
        image,
      )).resolves.toBeUndefined();
    });

    it('should create a alert with account entity', async () => {
      const image = readFileSync(resolve(__dirname, './images/image.jpeg'));

      const newAlert = {
        account: AccountEntity.create({
          email: 'email@example.com',
          password: '@Abc123456',
          person: UUID.generate(),
          role: AccountRole.default,
          status: AccountStatus.unverified,
        }),
        birthDate: new DateVO('2015-01-01'),
        name: 'Nami',
        description: 'Description'.repeat(5),
        disappearDate: new DateVO('2022-01-01'),
        type: AlertTypeEnum.Pet,
        location: {
          type: AlertLocationType.Point,
          coordinates: [-49.242825, -25.383585],
        },
        info: {
          petType: PetType.Cat,
        },
      };

      await expect(AlertCreateService.prototype.create.call(
        new AlertCreateService(),
        newAlert,
        image,
      )).resolves.toBeUndefined();
    });

    it('should throw an error if total count exceeds', async () => {
      const image = readFileSync(resolve(__dirname, './images/image.jpeg'));

      repositoryCountByAccountMock.mockResolvedValue({ total: 6, open: 0 });

      await expect(AlertCreateService.prototype.create.call(
        new AlertCreateService(),
        alertPerson,
        image,
      )).rejects.toThrowError(ValidationError);
    });

    it('should throw an error if open alerts count exceeds', async () => {
      const image = readFileSync(resolve(__dirname, './images/image.jpeg'));

      repositoryCountByAccountMock.mockResolvedValue({ total: 3, open: 3 });

      await expect(AlertCreateService.prototype.create.call(
        new AlertCreateService(),
        alertPerson,
        image,
      )).rejects.toThrowError(ValidationError);
    });

    it('should throw an error if invalid environment', async () => {
      delete process.env.AWS_BUCKET_IMAGE;

      const image = readFileSync(resolve(__dirname, './images/image.jpeg'));

      await expect(AlertCreateService.prototype.create.call(
        new AlertCreateService(),
        alertPerson,
        image,
      )).rejects.toThrowError(ValidationError);
    });
  });
});
