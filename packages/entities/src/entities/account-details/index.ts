import { BaseEntityProps } from '../../base';
import { AccountDetailsProps } from './account-details.entity';

export * from './account-details.entity';

export interface AccountDetailsEntityType extends AccountDetailsProps, BaseEntityProps {}
