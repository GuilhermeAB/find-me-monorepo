import { Status, ValidationError, ParamsType } from '../validation-error';

describe('ValidationError class', () => {
  const errorKey = 'InvalidInput';
  const errorParams: ParamsType = { field: 'email' };
  const errorStatus = Status.BadRequest;

  it('should create a new instance with the provided properties', () => {
    const error = new ValidationError({
      key: errorKey,
      params: errorParams,
      status: errorStatus,
    });

    expect(error).toBeDefined();
    expect(error instanceof ValidationError).toBe(true);
    expect(error.message).toBe(errorKey);
    expect(error.key).toBe(errorKey);
    expect(error.params).toEqual(errorParams);
    expect(error.status).toBe(errorStatus);
  });
});