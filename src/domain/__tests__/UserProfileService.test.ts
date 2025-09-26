import { UserProfileService } from '../services/UserProfileService';
import { Email } from '../valueobjects/Email';
import { UserProfile } from '../valueobjects/UserProfile';

describe('UserProfileService', () => {
  let profileService: UserProfileService;

  beforeEach(() => {
    profileService = new UserProfileService();
  });

  describe('assignProfile', () => {
    it('should assign Administrator profile for company.com domain', () => {
      // Arrange
      const email = new Email('john.doe@company.com');

      // Act
      const profile = profileService.assignProfile(email);

      // Assert
      expect(profile).toBe(UserProfile.ADMINISTRATOR);
    });

    it('should assign Standard User profile for non-company domains', () => {
      // Arrange
      const email = new Email('jane.smith@gmail.com');

      // Act
      const profile = profileService.assignProfile(email);

      // Assert
      expect(profile).toBe(UserProfile.STANDARD_USER);
    });

    it('should assign Standard User profile for other domains', () => {
      // Arrange
      const email = new Email('user@external.org');

      // Act
      const profile = profileService.assignProfile(email);

      // Assert
      expect(profile).toBe(UserProfile.STANDARD_USER);
    });
  });
});