import { Mailer } from '@find-me/cloud';
import { verificationEmail } from './templates/verification';
import { recoverPassword } from './templates/recover-password';

const VERIFICATION_EMAIL_SUBJECT = 'Verificar email';
const RECOVER_PASSWORD_EMAIL_SUBJECT = 'Recuperar senha';

export class AccountMailer {
  public static async sendVerificationEmail(email: string, name: string, code: string): Promise<void> {
    const mailer = new Mailer();

    const body = verificationEmail(name, code);

    await mailer.send(email, VERIFICATION_EMAIL_SUBJECT, body);
  }

  public static async sendRecoverPasswordEmail(email: string, name: string, code: string): Promise<void> {
    const mailer = new Mailer();

    const body = recoverPassword(name, code);

    await mailer.send(email, RECOVER_PASSWORD_EMAIL_SUBJECT, body);
  }
}
