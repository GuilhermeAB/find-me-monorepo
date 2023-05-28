import {
  IndexDefinition,
  model, Model, Schema, SchemaDefinition, SchemaOptions,
} from 'mongoose';

export type DTOModel<T> = Model<T>;

interface DTOProps<T> {
  name: string,
  schema: Schema,
  model: DTOModel<T>,
}

interface CreateDTO {
  name: string,
  schema: SchemaDefinition,
  options?: SchemaOptions,
}

export abstract class DTO<EntityType> {
  private props: DTOProps<EntityType>;

  public get name(): string {
    return this.props.name;
  }

  public get model(): DTOModel<EntityType> {
    return this.props.model;
  }

  constructor(create: CreateDTO, indexes?: IndexDefinition[]) {
    const schema = new Schema({
      ...create.schema,
      __v: { type: Number, select: false },
    }, {
      ...(create.options || {}),
    });

    const entityModel = model<EntityType>(create.name, schema);

    if (indexes) {
      indexes.forEach((index) => {
        schema.index(index);
      });
    }

    this.props = {
      name: create.name,
      schema,
      model: entityModel,
    };
  }
}
