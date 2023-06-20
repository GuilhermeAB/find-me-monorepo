import { Mailer } from '@find-me/cloud';
import { AccountMailer } from '..';

jest.mock('@find-me/cloud');
jest.mock('../templates/verification', () => ({
  verificationEmail: jest.fn().mockReturnValue('verification email'),
}));
jest.mock('../templates/recover-password', () => ({
  recoverPassword: jest.fn().mockReturnValue('recover password'),
}));

describe('AccountMailer', () => {
  let mailerSendMock: jest.MockedFunction<typeof Mailer.prototype.send>;

  beforeEach(() => {
    mailerSendMock = jest.fn();

    (Mailer as jest.MockedClass<typeof Mailer>).mockImplementation(() => {
      return {
        send: mailerSendMock,
      };
    });
  });

  describe('sendVerificationEmail', () => {
    it('should call Mailer with the correct parameters', async () => {
      const email = 'test@test.com';
      const name = 'John Doe';
      const code = '123456';

      await AccountMailer.sendVerificationEmail(email, name, code);

      expect(Mailer).toHaveBeenCalledWith();
      expect(mailerSendMock).toHaveBeenCalledTimes(1);
      expect(mailerSendMock).toHaveBeenCalledWith(email, 'Verificar email', 'verification email');
    });
  });

  describe('sendRecoverPasswordEmail', () => {
    it('should call Mailer with the correct parameters', async () => {
      const email = 'test@test.com';
      const name = 'John Doe';
      const code = '123456';

      await AccountMailer.sendRecoverPasswordEmail(email, name, code);

      expect(Mailer).toHaveBeenCalledWith();
      expect(mailerSendMock).toHaveBeenCalledTimes(1);
      expect(mailerSendMock).toHaveBeenCalledWith(email, 'Recuperar senha', 'recover password');
    });
  });
});
