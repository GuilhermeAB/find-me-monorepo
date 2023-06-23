import { AlertSearchService } from '../search';
import { AlertService } from '../../base';

jest.mock('../../base');

let repositorySearchMock: jest.Mock;

describe('AlertSearchService', () => {
  beforeEach(() => {
    repositorySearchMock = jest.fn().mockResolvedValue([{}]);

    // @ts-ignore
    AlertSearchService.prototype.repository = {
      search: repositorySearchMock,
    };
  });

  afterEach(() => {
    // Reset all mocks after each test
    jest.resetAllMocks();
  });

  describe('search', () => {
    it('should return a list of alerts', async () => {
      await expect(AlertSearchService.prototype.search.call(
        new AlertSearchService(),
        {
          status: 'Open',
          type: 'Person',
          startAge: 1,
          endAge: 1,
          missingAgeStart: 1,
          missingAgeEnd: 1
        },
        'Alice',
      )).resolves.toBeTruthy();
    });
  });
});
