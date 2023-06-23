import { CommentCreateService } from '../create';
import { CommentService } from '../../base';
import { UUID } from '@find-me/uuid';
import { CommentEntity } from '@find-me/entities';
import { ValidationError } from '@find-me/errors';

jest.mock('../../base');

let repositoryFindCommentByIdMock: jest.Mock;
let repositoryAddReplyMock: jest.Mock;
let repositoryExistsMock: jest.Mock;
let repositoryCreateMock: jest.Mock;

let alertRepositoryExistsMock: jest.Mock;
let alertRepositoryFindOneReplyMock: jest.Mock;

describe('CommentCreateService', () => {
  beforeEach(() => {
    repositoryFindCommentByIdMock = jest.fn().mockResolvedValue(true);
    repositoryAddReplyMock = jest.fn().mockResolvedValue(true);
    repositoryExistsMock = jest.fn().mockResolvedValue(true);
    repositoryCreateMock = jest.fn();

    alertRepositoryExistsMock = jest.fn().mockResolvedValue(true);
    alertRepositoryFindOneReplyMock = jest.fn().mockResolvedValue(true);

    // @ts-ignore
    CommentCreateService.prototype.repository = {
      findCommentById: repositoryFindCommentByIdMock,
      addReply: repositoryAddReplyMock,
      exists: repositoryExistsMock,
      create: repositoryCreateMock,
      findOneReply: alertRepositoryFindOneReplyMock,
    };
    // @ts-ignore
    CommentCreateService.prototype.alertRepository = {
      exists: alertRepositoryExistsMock,
    };
  });

  afterEach(() => {
    // Reset all mocks after each test
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a comment', async () => {
      await expect(CommentCreateService.prototype.create.call(
        new CommentCreateService(),
        {
          account: UUID.generate(),
          alert: UUID.generate(),
          content: 'content'.repeat(3),
          replies: [],
        },
      )).resolves.toBeTruthy();
      expect(alertRepositoryExistsMock).toHaveBeenCalledTimes(1);
      expect(repositoryCreateMock).toHaveBeenCalledTimes(1);
      expect(repositoryFindCommentByIdMock).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if alert is not found', async () => {
      alertRepositoryExistsMock.mockResolvedValue(false);

      await expect(CommentCreateService.prototype.create.call(
        new CommentCreateService(),
        {
          account: UUID.generate(),
          alert: UUID.generate(),
          content: 'content'.repeat(3),
          replies: [],
        },
      )).rejects.toThrowError(ValidationError);
      expect(alertRepositoryExistsMock).toHaveBeenCalledTimes(1);
      expect(repositoryCreateMock).toHaveBeenCalledTimes(0);
      expect(repositoryFindCommentByIdMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('createReply', () => {
    it('should create a comment reply', async () => {
      await expect(CommentCreateService.prototype.createReply.call(
        new CommentCreateService(),
        'id',
        {
          account: UUID.generate(),
          alert: UUID.generate(),
          content: 'content'.repeat(3),
          replies: [],
        },
      )).resolves.toBeTruthy();
      expect(repositoryExistsMock).toHaveBeenCalledTimes(1);
      expect(repositoryAddReplyMock).toHaveBeenCalledTimes(1);
      expect(alertRepositoryFindOneReplyMock).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if comment is not found', async () => {
      repositoryExistsMock.mockResolvedValue(false);

      await expect(CommentCreateService.prototype.createReply.call(
        new CommentCreateService(),
        'id',
        {
          account: UUID.generate(),
          alert: UUID.generate(),
          content: 'content'.repeat(3),
          replies: [],
        },
      )).rejects.toThrowError(ValidationError);
      expect(repositoryExistsMock).toHaveBeenCalledTimes(1);
      expect(repositoryAddReplyMock).toHaveBeenCalledTimes(0);
      expect(alertRepositoryFindOneReplyMock).toHaveBeenCalledTimes(0);
    });
  });
});
