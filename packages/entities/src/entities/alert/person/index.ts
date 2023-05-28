import { BaseEntityProps } from '@find-me/entities/src/base';
import { AlertPersonProps } from './alert-person.entity';

export * from './alert-person.entity';

export interface AlertPersonEntityType extends AlertPersonProps, BaseEntityProps {}
