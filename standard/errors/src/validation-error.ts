const ERROR_NAME = 'ValidationError';

export type ParamsType = Record<string, string | number | boolean>;

export enum Status {
  Success = 200,
  BadRequest = 400,
  Unauthorized = 403,
  NotFound = 404,
  InternalServerError = 500,
}

export interface ValidationErrorProps {
  key: string,
  params?: ParamsType,
  status?: Status,
}

export class ValidationError extends Error {
  private readonly props: ValidationErrorProps;

  public get key(): string {
    return this.props.key;
  }

  public get params(): ParamsType | undefined {
    return this.props.params;
  }

  public get status(): number | undefined {
    return this.props.status;
  }

  constructor(props: ValidationErrorProps) {
    super(props.key);

    this.name = ERROR_NAME;
    this.props = props;

    Error.captureStackTrace(this, ValidationError);
  }
}
