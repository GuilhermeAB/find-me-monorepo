import { SearchFilter } from '@find-me/repositories';
import { AlertService } from '../base';

export class AlertSearchService extends AlertService {
  public async search(filter: SearchFilter, text?: string): Promise<unknown[] | undefined> {
    return this.repository.search(filter, text);
  }
}
