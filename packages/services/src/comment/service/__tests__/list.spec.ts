import { CommentListService } from '../list';
import { CommentService } from '../../base';
import { UUID } from '@find-me/uuid';
import { CommentEntity } from '@find-me/entities';

jest.mock('../../base');

const comment = CommentEntity.create({
  account: UUID.generate(),
  alert: UUID.generate(),
  content: 'content'.repeat(3),
  replies: [],
});

let repositoryListMock: jest.Mock;

describe('CommentListService', () => {
  beforeEach(() => {
    repositoryListMock = jest.fn().mockResolvedValue({
      list: [comment],
      count: {
        comments: 1,
        replies: 0,
      },
    });

    // @ts-ignore
    CommentListService.prototype.repository = {
      list: repositoryListMock,
    };
  });

  afterEach(() => {
    // Reset all mocks after each test
    jest.resetAllMocks();
  });

  describe('list', () => {
    it('should list comments', async () => {
      const {
        alert,
      } = comment.getProps();

      await expect(CommentListService.prototype.list.call(
        new CommentListService(),
        alert.value,
      )).resolves.toEqual({
        list: expect.anything(),
        count: {
          comments: 1,
          replies: 0,
        },
      });
    });

    it('should return undefined if comments not found', async () => {
      repositoryListMock.mockResolvedValue(undefined);

      const {
        alert,
      } = comment.getProps();

      await expect(CommentListService.prototype.list.call(
        new CommentListService(),
        alert.value,
      )).resolves.toBeUndefined();
    });
  });
});
