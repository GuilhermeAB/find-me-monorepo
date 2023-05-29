import { UUID } from '@find-me/uuid';
import { Entity } from '../../base';
import { AccountPolicy } from './account.policy';
import { PersonEntity } from '../person';

export enum AccountRole {
  default = 'default',
  admin = 'admin',
}

export enum AccountStatus {
  unverified = 'unverified',
  verified = 'verified',
  disabled = 'disabled',
}

export interface AccountProps {
  email: string,
  password: string,
  role: AccountRole,
  status: AccountStatus,
  person: UUID | PersonEntity,
}

export type CreateAccountProps = Omit<AccountProps, 'role' | 'status' | 'person'> & {
  role: string | AccountRole,
  status: string | AccountStatus,
  person: string | UUID | PersonEntity,
};

export class AccountEntity extends Entity<AccountProps> {
  public set password(password: string) {
    this.props.password = password;
  }

  public static create(create: CreateAccountProps): AccountEntity {
    const account = new AccountEntity({
      props: {
        email: create.email.trim(),
        password: create.password,
        role: create.role as AccountRole,
        status: create.status as AccountStatus,
        person: typeof create.person === 'string' || create.person instanceof UUID ? UUID.generate(create.person) : create.person,
      },
      timestamps: true,
    });

    return account;
  }

  public validate(): void {
    AccountPolicy.validate(this.getProps());
  }
}
