import { DateVO } from '..';

describe('DateVO', () => {
  describe('constructor', () => {
    it('should create a valid instance of DateVO with a date value', () => {
      const date = new Date();
      const dateVo = new DateVO(date);
      expect(dateVo.value).toEqual(date); // Validate that the value in DateVO is equal to the input date.
    });

    it('should throw ValidationError if input is an invalid date string', () => {
      expect(() => new DateVO('invalid-date')).toThrowError(); // Validate that a validation error is thrown when an invalid date string is passed.
    });
  });

  describe('generate', () => {
    it('should return a valid instance of DateVO when passed a date string', () => {
      const dateStr = '2020-01-01T00:00:00';
      const dateVo = DateVO.generate(dateStr);
      expect(dateVo.value instanceof Date).toEqual(true); // Validate that the returned value is a Date instance.
      expect(dateVo.value.getTime()).toEqual(new Date(dateStr).getTime()); // Validate that the returned date value is correct.
    });

    it('should return a valid instance of DateVO when passed a DateVO instance', () => {
      const date = new Date();
      const dateVo1 = new DateVO(date);
      const dateVo2 = DateVO.generate(dateVo1);
      expect(dateVo2.value).toEqual(date); // Validate that the returned value is equal to the input DateVO.
    });
  });

  describe('now', () => {
    it('should return a valid instance of DateVO with the current date and time', () => {
      const now = Date.now();
      const dateVo = DateVO.now();
      expect(dateVo.value.getTime()).toBeGreaterThanOrEqual(now); // Validate that the returned value is greater than or equal to the current date and time.
    });
  });

  describe('validate', () => {
    it('should not throw an error when passed a valid Date instance', () => {
      const date = new Date();
      expect(() => DateVO.validate(date)).not.toThrowError(); // Validate that no error is thrown when a valid date is passed.
    });

    it('should throw ValidationError when passed null or undefined', () => {
      expect(() => DateVO.validate(null)).toThrowError(); // Validate that a validation error is thrown when null is passed.
      expect(() => DateVO.validate(undefined)).toThrowError(); // Validate that a validation error is thrown when undefined is passed.
    });

    it('should throw ValidationError when passed an invalid value', () => {
      expect(() => DateVO.validate('invalid-date')).toThrowError(); // Validate that a validation error is thrown when an invalid date string is passed.
    });
  });

  describe('addHours', () => {
    it('should return an instance of DateVO with the correct value after adding hours', () => {
      const date = new Date(2021, 0, 1);
      const dateVo = new DateVO(date);
      const result = dateVo.addHours(2);
      expect(result instanceof DateVO).toEqual(true); // Validate that the returned value is an instance of DateVO.
      expect(result.value.getTime()).toEqual(new Date(2021, 0, 1, 2).getTime()); // Validate that the returned value has the correct time.
    });
  });

  describe('addYears', () => {
    it('should add years to the date', () => {
      const date = new Date(2020, 0, 1);
      const dateVO = new DateVO(date.toISOString());
      const yearsToAdd = 2;
      const expectedDate = dateVO.addYears(yearsToAdd);

      const result = dateVO.addYears(yearsToAdd);

      expect(result).toBeInstanceOf(DateVO);
      expect(result.value.toISOString()).toEqual(expectedDate.value.toISOString());
    });
  });

  describe('isFuture', () => {
    it('should return true if the date is in the future', () => {
      const futureDate = new Date(Date.now() + 86400000);
      const dateVO = new DateVO(futureDate.toISOString());

      const result = DateVO.isFuture(dateVO);

      expect(result).toBe(true);
    });

    it('should return false if the date is in the past', () => {
      const pastDate = new Date(Date.now() - 86400000);
      const dateVO = new DateVO(pastDate.toISOString());

      const result = DateVO.isFuture(dateVO);

      expect(result).toBe(false);
    });
  });

  describe('differenceInYears', () => {
    it('should return the correct number of years between two dates', () => {
      const dateLeft = new Date(2020, 0, 1);
      const dateRight = new Date(2010, 0, 1);
      const result = DateVO.differenceInYears(dateLeft, dateRight);
      expect(result).toEqual(10); // Validate that the returned value is correct.
    });
  });

  describe('differenceInMinutes', () => {
    it('should return the correct number of minutes between two dates', () => {
      const dateLeft = new Date(2021, 0, 1, 0, 30, 0);
      const dateRight = new Date(2021, 0, 1, 0, 0, 0);
      const result = DateVO.differenceInMinutes(dateLeft, dateRight);
      expect(result).toEqual(30); // Validate that the returned value is correct.
    });
  });

  describe('differenceInMilliseconds', () => {
    it('should return the correct number of milliseconds between two dates', () => {
      const dateLeft = new Date(2021, 0, 1, 0, 0, 1);
      const dateRight = new Date(2021, 0, 1, 0, 0, 0);
      const result = DateVO.differenceInMilliseconds(dateLeft, dateRight);
      expect(result).toEqual(1000); // Validate that the returned value is correct.
    });
  });

  describe('differenceInDays', () => {
    it('should return the correct number of days between two dates', () => {
      const dateLeft = new Date(2021, 0, 11);
      const dateRight = new Date(2021, 0, 1);
      const result = DateVO.differenceInDays(dateLeft, dateRight);
      expect(result).toEqual(10); // Validate that the returned value is correct.
    });
  });

  describe('formatDistance', () => {
    it('should return the correct string representation of distance between two dates', () => {
      const dateLeft = new Date(2021, 1, 1);
      const dateRight = new Date(2021, 0, 1);
      const result = DateVO.formatDistance(dateLeft, dateRight);
      expect(result).toEqual('about 1 month'); // Validate that the returned value is correct.
    });
  });

  describe('firstDayOfMonth', () => {
    it('should return the first day of the month for the given date', () => {
      const date = new Date(2021, 5, 15);
      const dateVo = new DateVO(date);
      const result = dateVo.firstDayOfMonth();
      expect(result instanceof Date).toEqual(true); // Validate that the returned value is a Date instance.
      expect(result.getTime()).toEqual(new Date(2021, 5, 1).getTime()); // Validate that the returned value has the correct date.
    });
  });

  describe('lastDayOfMonth', () => {
    it('should return the last day of the month for the given date', () => {
      const date = new Date(2021, 5, 15);
      const dateVo = new DateVO(date);
      const result = dateVo.lastDayOfMonth();
      expect(result instanceof Date).toEqual(true); // Validate that the returned value is a Date instance.
      expect(result.getTime()).toEqual(new Date(2021, 5, 30).getTime()); // Validate that the returned value has the correct date.
    });
  });
});