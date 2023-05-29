import { Policy } from '../../base';
import { AccountProps, AccountRole, AccountStatus } from '.';

const EMAIL_REGEX = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/g;
const EMAIL_MIN_LENGTH = 5;
const EMAIL_MAX_LENGTH = 90; // 254

const PASSWORD_MIN_LENGTH = 10;
const PASSWORD_MAX_LENGTH = 30;

const LOWERCASE_REGEX = /[a-z]/g;
const UPPERCASE_REGEX = /[A-Z]/g;
const NUMBER_REGEX = /\d+/g;
const SPECIAL_CHARACTER = /[^A-z\s\d][\\^ _]?/g;

export class AccountPolicy extends Policy {
  public static validateEmail(email: string): void {
    if (!email) {
      Policy.error({ key: 'EmailRequired' });
    }

    if (!Policy.lengthIsBetween(email, EMAIL_MIN_LENGTH, EMAIL_MAX_LENGTH)) {
      Policy.error({ key: 'EmailLength', params: { min: EMAIL_MIN_LENGTH, max: EMAIL_MAX_LENGTH } });
    }

    if (!Policy.matchRegex(email, EMAIL_REGEX)) {
      Policy.error({ key: 'EmailInvalid' });
    }
  }

  public static validatePassword(password: string): void {
    if (!password) {
      Policy.error({ key: 'PasswordRequired' });
    }

    if (!Policy.lengthIsBetween(password, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)) {
      Policy.error({ key: 'PasswordLength', params: { min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH } });
    }

    if (!Policy.matchRegex(password, NUMBER_REGEX)) {
      Policy.error({ key: 'PasswordNumberRequired' });
    }
    if (!Policy.matchRegex(password, LOWERCASE_REGEX) || !Policy.matchRegex(password, UPPERCASE_REGEX)) {
      Policy.error({ key: 'PasswordLowerUpperRequired' });
    }
    if (!Policy.matchRegex(password, SPECIAL_CHARACTER)) {
      Policy.error({ key: 'PasswordSpecialRequired' });
    }
  }

  public static validateRole(role: unknown): void {
    if (!role) {
      Policy.error({ key: 'RoleRequired' });
    }

    if (!Policy.isEnumValue(role, AccountRole)) {
      Policy.error({ key: 'RoleInvalid' });
    }
  }

  public static validateStatus(status: unknown): void {
    if (!status) {
      Policy.error({ key: 'StatusRequired' });
    }

    if (!Policy.isEnumValue(status, AccountStatus)) {
      Policy.error({ key: 'StatusInvalid' });
    }
  }

  public static validate(props: AccountProps): void {
    AccountPolicy.validateEmail(props.email);
    AccountPolicy.validatePassword(props.password);
    AccountPolicy.validateRole(props.role);
    AccountPolicy.validateStatus(props.status);
  }
}
