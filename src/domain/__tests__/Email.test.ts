import { Email } from '../valueobjects/Email';

describe('Email Value Object', () => {
  describe('constructor', () => {
    it('should create valid email', () => {
      // Act
      const email = new Email('test@example.com');

      // Assert
      expect(email.toString()).toBe('test@example.com');
      expect(email.getDomain()).toBe('example.com');
    });

    it('should throw error for invalid email format', () => {
      // Act & Assert
      expect(() => new Email('invalid-email')).toThrow('Email invalide');
      expect(() => new Email('test@')).toThrow('Email invalide');
      expect(() => new Email('@domain.com')).toThrow('Email invalide');
      expect(() => new Email('')).toThrow('Email invalide');
    });
  });

  describe('getDomain', () => {
    it('should extract domain correctly', () => {
      // Arrange
      const email = new Email('user@company.com');

      // Act
      const domain = email.getDomain();

      // Assert
      expect(domain).toBe('company.com');
    });
  });

  describe('equals', () => {
    it('should return true for same email values', () => {
      // Arrange
      const email1 = new Email('test@example.com');
      const email2 = new Email('test@example.com');

      // Act
      const result = email1.equals(email2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for different email values', () => {
      // Arrange
      const email1 = new Email('test1@example.com');
      const email2 = new Email('test2@example.com');

      // Act
      const result = email1.equals(email2);

      // Assert
      expect(result).toBe(false);
    });
  });
});