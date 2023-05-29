import { BaseEntityProps } from '../../base';
import { AccountProps } from './account.entity';

export * from './account.entity';

export interface AccountEntityType extends AccountProps, BaseEntityProps {}
