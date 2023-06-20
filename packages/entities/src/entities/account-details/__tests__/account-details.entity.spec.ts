import { DateVO } from '@find-me/date';
import { AccountDetailsEntity, CreateAccountDetailsProps } from '..';
import { UUID } from '@find-me/uuid';

describe('AccountDetailsEntity', () => {
  let createAccountDetailsProps: CreateAccountDetailsProps;

  beforeEach(() => {
    createAccountDetailsProps = {
      account: UUID.generate(),
      isNew: true,
      failedRecoverAttempts: 0,
      // activationCode: '12345678',
      // activationCodeCreatedAt: DateVO.now(),
      // failedActivationAttempts: 0,
      recoverCode: '12345678',
      recoverCodeCreatedAt: DateVO.now(),
      lastSignInAt: DateVO.now(),
      failedSignInAttempts: 0,
      lastFailedSignInAttempt: undefined,
      lastFailedPasswordChangeAttempt: undefined,
      failedPasswordChangeAttempts: 0,
    };
  });

  it('should update activation code when "updateActivationCode" is called', () => {
    const details = AccountDetailsEntity.create(createAccountDetailsProps);
    details.updateActivationCode();
    expect(details.getProps().activationCode).toBeDefined();
    expect(details.getProps().activationCodeCreatedAt).toBeDefined();
    expect(details.getProps().failedActivationAttempts).toBeDefined();
  });

  it('should update recover code when "updateRecoverCode" is called', () => {
    const details = AccountDetailsEntity.create(createAccountDetailsProps);
    details.updateRecoverCode();
    expect(details.getProps().recoverCode).toBeDefined();
    expect(details.getProps().recoverCodeCreatedAt).toBeDefined();
    expect(details.getProps().failedRecoverAttempts).toBe(0);
  });

  it('should set last sign-in when "setLastSignIn" is called', () => {
    const details = AccountDetailsEntity.create(createAccountDetailsProps);
    details.setLastSignIn();
    expect(details.getProps().lastSignInAt).toBeDefined();
    expect(details.getProps().failedSignInAttempts).toBe(0);
    expect(details.getProps().lastFailedSignInAttempt).toBeUndefined();
  });

  it('should create account details with correct properties', () => {
    const account = UUID.generate();
    createAccountDetailsProps.account = account;
    const details = AccountDetailsEntity.create(createAccountDetailsProps);
    expect(details.getProps().account).toBe(account);
    expect(details.getProps().failedActivationAttempts).toBe(0);
    expect(details.getProps().isNew).toBe(true);
    expect(details.getProps().failedRecoverAttempts).toBe(0);
    expect(details.getProps().activationCode).toBeDefined();
    expect(details.getProps().activationCodeCreatedAt).toBeDefined();
    expect(details.getProps().failedActivationAttempts).toBeDefined();
  });

  it('should create account details with generated account ID if passed as string', () => {
    const accountId = 'b578040f-34d4-43cf-9105-efb0be3d813e';
    createAccountDetailsProps.account = accountId;
    const details = AccountDetailsEntity.create(createAccountDetailsProps);
    expect(details.getProps().account).toBeInstanceOf(UUID);
  });

  it('should create account details with existing UUID account ID', () => {
    const accountId = UUID.generate();
    createAccountDetailsProps.account = accountId;
    const details = AccountDetailsEntity.create(createAccountDetailsProps);
    expect(details.getProps().account).toBe(accountId);
  });
});
