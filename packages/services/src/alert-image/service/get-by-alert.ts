import { ValidationError } from '@find-me/errors';
import { AlertImageService } from '../base';

export class AlertImageGetService extends AlertImageService {
  public async getByAlert(alertId: string): Promise<string> {
    const {
      AWS_BUCKET_IMAGE,
    } = process.env;

    if (!AWS_BUCKET_IMAGE) {
      throw new ValidationError({ key: 'InvalidEnv' });
    }

    const entity = await this.repository.getByAlertId(alertId);
    if (!entity) {
      throw new ValidationError({ key: 'AlertNotFound' });
    }

    const {
      id,
      alert,
      type,
    } = entity.getProps();

    return this.storage.getUrl(
      AWS_BUCKET_IMAGE,
      `${typeof alert === 'string' ? alert : alert.value}/${id.value}.${type}`,
    );
  }
}
