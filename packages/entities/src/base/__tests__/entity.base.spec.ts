import { Entity } from '../entity.base';
import { UUID } from '@find-me/uuid';

interface MyEntityProps {
  name: string;
  age: number;
}

class MyEntity extends Entity<MyEntityProps> {
  public validate(): void {
    // Validation logic goes here
  }
}

describe('Entity', () => {
  const now = new Date();
  const id = UUID.generate().value;

  describe('constructor', () => {
    test('should create an instance with correct props', () => {
      // Arrange
      const props = { name: 'John', age: 30 };

      // Act
      const entity = new MyEntity({ id, props });

      // Assert
      expect(entity).toBeDefined();
      expect(entity.getProps()).toEqual(expect.objectContaining({
        ...props,
        id: expect.anything(),
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
      }));
    });

    test('should default createdAt and updatedAt to current time when timestamps is true', () => {
      // Arrange
      const props = { name: 'John', age: 30 };

      // Act
      const entity = new MyEntity({ id, props, timestamps: true });

      // Assert
      expect(entity).toBeDefined();
      expect(entity.getProps().createdAt?.value.getTime()).toBeGreaterThanOrEqual(now.getTime());
      expect(entity.getProps().updatedAt?.value.getTime()).toBeGreaterThanOrEqual(now.getTime());
    });

    test('should set createdAt and updatedAt to null when timestamps is false', () => {
      // Arrange
      const props = { name: 'John', age: 30 };

      // Act
      const entity = new MyEntity({ id, props, timestamps: false });

      // Assert
      expect(entity).toBeDefined();
      expect(entity.getProps().createdAt).toBeUndefined();
      expect(entity.getProps().updatedAt).toBeUndefined();
    });
  });

  describe('getFlatProps', () => {
    test('should return a flattened copy of the entity props with timestamps', () => {
      // Arrange
      const props = { name: 'John', age: 30 };
      const entity = new MyEntity({ id, props, timestamps: true });

      // Act
      const flatProps = entity.getFlatProps();

      // Assert
      expect(flatProps).toEqual({
        id,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        name: 'John',
        age: 30,
      });
    });

    test('should return a flattened copy of the entity props without timestamps', () => {
      // Arrange
      const props = { name: 'John', age: 30 };
      const entity = new MyEntity({ id, props, timestamps: false });

      // Act
      const flatProps = entity.getFlatProps();

      // Assert
      expect(flatProps).toEqual({
        id,
        name: 'John',
        age: 30,
      });
    });

    test('should omit specified properties', () => {
      // Arrange
      const props = { name: 'John', age: 30, address: { street: '123 Main St', city: 'New York' } };
      const entity = new MyEntity({ id, props });

      // Act
      const flatProps = entity.getFlatProps(['address']);

      // Assert
      expect(flatProps).toEqual({
        id,
        createdAt: expect.anything(),
        updatedAt: expect.anything(),
        name: 'John',
        age: 30,
      });
    });
  });
});
