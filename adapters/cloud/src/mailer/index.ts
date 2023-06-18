import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { ValidationError } from '@find-me/errors';

export class Mailer {
  private client: SESClient;

  constructor() {
    const {
      AWS_REGION,
      AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY,
    } = process.env;

    if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      throw new ValidationError({ key: 'InvalidEnv' });
    }

    this.client = new SESClient({
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
      region: AWS_REGION,
    });
  }

  public async send(toEmail: string, subject: string, htmlBody: string): Promise<void> {
    const {
      AWS_SES_EMAIL,
    } = process.env;

    if (!AWS_SES_EMAIL) {
      throw new ValidationError({ key: 'InvalidEnv' });
    }

    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: [toEmail],
      },
      Source: AWS_SES_EMAIL,
      Message: {
        Body: {
          Html: {
            Data: htmlBody,
          },
        },
        Subject: {
          Data: subject,
        },
      },
    });

    await this.client.send(command);
  }
}
