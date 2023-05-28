import { BaseEntityProps } from '@find-me/entities/src/base';
import { AlertPetProps } from './alert-pet.entity';

export * from './alert-pet.entity';

export interface AlertPetEntityType extends AlertPetProps, BaseEntityProps {}
