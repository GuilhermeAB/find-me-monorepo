import { Status, ValidationError } from '@find-me/errors';
import { AccountService } from '../base';

export class AccountGetLoggedService extends AccountService {
  public async getByAccount(id: string): Promise<unknown> {
    const account = await this.repository.findByAccount(id);
    if (!account) {
      throw new ValidationError({
        key: 'AuthenticationRequired',
        status: Status.Unauthorized,
      });
    }

    return {
      ...account.getFlatProps(),
      password: undefined,
    };
  }
}
