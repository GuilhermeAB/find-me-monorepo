import { AlertService } from '../base';

export class AlertListService extends AlertService {
  public async list(): Promise<unknown[] | undefined> {
    return this.repository.findFlat();
  }

  public async nearbyList(latitude: number, longitude: number, type?: string): Promise<unknown[] | undefined> {
    return this.repository.getNearby(latitude, longitude, type);
  }

  public async getById(id: string): Promise<unknown | undefined> {
    const result = await this.repository.findOneById(id);

    return result ? result.getFlatProps() : undefined;
  }
}
