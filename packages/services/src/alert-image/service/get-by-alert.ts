import { ValidationError } from '@find-me/errors';
import { DateVO } from '@find-me/date';
import { AlertImageService } from '../base';

const IMAGE_CACHE_FOLDER = 'images';

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

    const imagePath = `${typeof alert === 'string' ? alert : alert.value}/${id.value}.${type}`;

    const cacheUrl = await this.cache.get(`${IMAGE_CACHE_FOLDER}:${imagePath}`);
    if (cacheUrl) {
      return cacheUrl;
    }

    const url = await this.storage.getUrl(AWS_BUCKET_IMAGE, imagePath);
    await this.cache.add(`${IMAGE_CACHE_FOLDER}:${imagePath}`, url, DateVO.now().addHours(1).value);

    return url;
  }
}
