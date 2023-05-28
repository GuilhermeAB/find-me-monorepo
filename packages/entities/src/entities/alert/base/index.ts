import { BaseEntityProps } from '@find-me/entities/src/base';
import { AlertProps } from './alert-base.entity';

export * from './alert-base.entity';

export interface AlertEntityType<T = unknown> extends AlertProps<T>, BaseEntityProps {}
