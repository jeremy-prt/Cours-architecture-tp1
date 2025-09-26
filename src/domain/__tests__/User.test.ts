import { User } from '../entities/User';
import { Email } from '../valueobjects/Email';
import { UserId } from '../valueobjects/UserId';
import { UserProfile } from '../valueobjects/UserProfile';
import { UserProfileService } from '../services/UserProfileService';

describe('User Entity', () => {
  let profileService: UserProfileService;

  beforeEach(() => {
    profileService = new UserProfileService();
  });

  describe('create', () => {
    it('should create user with administrator profile for company email', () => {
      // Arrange
      const email = new Email('admin@company.com');

      // Act
      const user = User.create('Doe', 'John', email, '0123456789', profileService);

      // Assert
      expect(user.getNom()).toBe('Doe');
      expect(user.getPrenom()).toBe('John');
      expect(user.getEmail().toString()).toBe('admin@company.com');
      expect(user.getTelephone()).toBe('0123456789');
      expect(user.getProfil()).toBe(UserProfile.ADMINISTRATOR);
      expect(user.isAdmin()).toBe(true);
    });

    it('should create user with standard profile for non-company email', () => {
      // Arrange
      const email = new Email('user@gmail.com');

      // Act
      const user = User.create('Smith', 'Jane', email, '0987654321', profileService);

      // Assert
      expect(user.getProfil()).toBe(UserProfile.STANDARD_USER);
      expect(user.isAdmin()).toBe(false);
    });

    it('should throw error for empty name', () => {
      // Arrange
      const email = new Email('test@company.com');

      // Act & Assert
      expect(() => {
        User.create('', 'John', email, '0123456789', profileService);
      }).toThrow('Le nom ne peut pas être vide');
    });

    it('should throw error for empty telephone', () => {
      // Arrange
      const email = new Email('test@company.com');

      // Act & Assert
      expect(() => {
        User.create('Doe', 'John', email, '', profileService);
      }).toThrow('Le téléphone ne peut pas être vide');
    });
  });

  describe('updateEmail', () => {
    it('should update email and reassign profile', () => {
      // Arrange
      const initialEmail = new Email('user@gmail.com');
      const user = User.create('Doe', 'John', initialEmail, '0123456789', profileService);
      const newEmail = new Email('admin@company.com');

      // Act
      user.updateEmail(newEmail, profileService);

      // Assert
      expect(user.getEmail().toString()).toBe('admin@company.com');
      expect(user.getProfil()).toBe(UserProfile.ADMINISTRATOR);
      expect(user.isAdmin()).toBe(true);
    });
  });

  describe('updatePersonalInfo', () => {
    it('should update personal information', () => {
      // Arrange
      const email = new Email('test@company.com');
      const user = User.create('Doe', 'John', email, '0123456789', profileService);

      // Act
      user.updatePersonalInfo('Smith', 'Jane', '0987654321');

      // Assert
      expect(user.getNom()).toBe('Smith');
      expect(user.getPrenom()).toBe('Jane');
      expect(user.getTelephone()).toBe('0987654321');
    });

    it('should throw error for invalid name update', () => {
      // Arrange
      const email = new Email('test@company.com');
      const user = User.create('Doe', 'John', email, '0123456789', profileService);

      // Act & Assert
      expect(() => {
        user.updatePersonalInfo('', undefined, undefined);
      }).toThrow('Le nom ne peut pas être vide');
    });
  });
});