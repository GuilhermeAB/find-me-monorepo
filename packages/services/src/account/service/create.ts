import {
  AccountDetailsEntity,
  AccountEntity,
  CreateAccountProps,
  CreatePersonProps,
  PersonEntity,
} from '@find-me/entities';
import { ValidationError } from '@find-me/errors';
import { AccountService } from '../base';

export class AccountCreateService extends AccountService {
  private async validateEmail(email: string): Promise<void> {
    const exists = await this.repository.emailExists(email);

    if (exists) {
      throw new ValidationError({ key: 'EmailAlreadyExists' });
    }
  }

  public async create(accountProps: Omit<CreateAccountProps, 'person'>, personProps: CreatePersonProps): Promise<void> {
    const person = PersonEntity.create(personProps);
    const account = AccountEntity.create({
      ...accountProps,
      person: person.getProps().id,
    });
    const details = AccountDetailsEntity.create({
      account: account.getProps().id,
      isNew: true,
    });

    account.validate();

    await this.validateEmail(account.getProps().email);

    await this.personRepository.create(person);
    await this.detailsRepository.create(details);
    await this.repository.create(account);

    // TODO: send verification email
  }
}
