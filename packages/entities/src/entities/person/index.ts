import { BaseEntityProps } from '../../base';
import { PersonProps } from './person.entity';

export * from './person.entity';

export interface PersonEntityType extends PersonProps, BaseEntityProps {}
