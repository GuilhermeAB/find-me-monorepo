import { UUID } from '@find-me/uuid';
import { AccountEntity, AccountProps, CreateAccountProps } from '..';
import { AccountPolicy } from '../account.policy';

describe('AccountEntity', () => {
  let createAccountProps: CreateAccountProps;
  
  beforeEach(() => {
    createAccountProps = {
      email: 'email@example.com',
      password: 'Password123#',
      role: 'default',
      status: 'unverified',
      person: '503130bb-a450-40d3-a95d-e1913d33f417'
    };
  });

  it('should set the password when "password" is called', () => {
    const account = AccountEntity.create(createAccountProps);
    account.password = 'new-password';
    expect(account.getProps().password).toBe('new-password');
  });

  it('should create an account with the correct properties', () => {
    const account = AccountEntity.create(createAccountProps);
    expect(account.getProps().email).toBe('email@example.com');
    expect(account.getProps().password).toBe('Password123#');
    expect(account.getProps().role).toBe('default');
    expect(account.getProps().status).toBe('unverified');
    expect(account.getProps().person).toStrictEqual(UUID.generate('503130bb-a450-40d3-a95d-e1913d33f417'));
  });

  it('should call AccountPolicy.validate() when "validate" is called', () => {
    const validateMock = jest.spyOn(AccountPolicy, 'validate');
    const account = new AccountEntity({ props: createAccountProps as AccountProps });
    account.validate();
    expect(validateMock).toHaveBeenCalledWith(account.getProps());
  });
});
