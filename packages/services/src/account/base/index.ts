import { Session } from '@find-me/database';
import { AccountDetailsRepository, AccountRepository, PersonRepository } from '@find-me/repositories';

export class AccountService {
  protected repository: AccountRepository;

  protected detailsRepository: AccountDetailsRepository;

  protected personRepository: PersonRepository;

  constructor(session?: Session) {
    this.repository = new AccountRepository(session);
    this.detailsRepository = new AccountDetailsRepository(session);
    this.personRepository = new PersonRepository(session);
  }
}
