import {
  PersonEntity,
} from '@find-me/entities';
import { ValidationError } from '@find-me/errors';
import { randomBytes, scryptSync } from 'crypto';
import { CreateDateVO, DateVO } from '@find-me/date';
import { AccountService } from '../base';

const PASSWORD_SALT = 32;

export class AccountUpdate extends AccountService {
  private static encryptPassword(password: string): string {
    const salt = randomBytes(PASSWORD_SALT).toString('hex');
    const encryptedPassword = scryptSync(password, salt, 128).toString('hex');

    return `${encryptedPassword}.${salt}`;
  }

  public async updatePerson(personId: string, name: string, birthDate: CreateDateVO): Promise<void> {
    const entity = new PersonEntity({
      id: personId,
      props: {
        name,
        birthDate: DateVO.generate(birthDate),
      },
    });

    await this.personRepository.updateOne(entity);
  }

  // eslint-disable-next-line class-methods-use-this
  private async validatePassword(currentPassword: string, inputPassword: string): Promise<void> {
    const [password, salt] = currentPassword.split('.');
    const inputPasswordEncrypted = scryptSync(inputPassword, salt, 128).toString('hex');

    if (inputPasswordEncrypted !== password) {
      // TODO: Timeout invalid attempts
      throw new ValidationError({ key: 'InvalidPassword' });
    }
  }

  public async updatePassword(accountId: string, currentPassword: string, password: string): Promise<void> {
    const entity = await this.repository.findOneById(accountId);
    if (!entity) {
      throw new ValidationError({ key: 'AccountNotFound' });
    }

    await this.validatePassword(entity.getProps().password, currentPassword);

    entity.password = password;
    entity.validate();

    entity.password = AccountUpdate.encryptPassword(entity.getProps().password);

    await this.repository.updatePassword(entity);
  }
}
