import {
  AccountDetailsEntity,
  AccountEntity,
  CreateAccountProps,
  CreatePersonProps,
  PersonEntity,
} from '@find-me/entities';
import { ValidationError } from '@find-me/errors';
import { randomBytes, scryptSync } from 'crypto';
import { AccountService } from '../base';
import { AccountMailer } from '../mailer';

const PASSWORD_SALT = 32;

export class AccountCreateService extends AccountService {
  private async validateEmail(email: string): Promise<void> {
    const exists = await this.repository.emailExists(email);

    if (exists) {
      throw new ValidationError({ key: 'EmailAlreadyExists' });
    }
  }

  private static encryptPassword(password: string): string {
    const salt = randomBytes(PASSWORD_SALT).toString('hex');
    const encryptedPassword = scryptSync(password, salt, 128).toString('hex');

    return `${encryptedPassword}.${salt}`;
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

    const {
      email,
    } = account.getProps();

    const {
      activationCode,
    } = details.getProps();

    await this.validateEmail(email);

    account.password = AccountCreateService.encryptPassword(account.getProps().password);

    await this.personRepository.create(person);
    await this.detailsRepository.create(details);
    await this.repository.create(account);

    await AccountMailer.sendVerificationEmail(email, person.getProps().name, activationCode!);
  }
}
