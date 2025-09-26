import { Email } from '../valueobjects/Email';
import { UserProfile } from '../valueobjects/UserProfile';

export class UserProfileService {
  assignProfile(email: Email): UserProfile {
    if (email.getDomain() === 'company.com') {
      return UserProfile.ADMINISTRATOR;
    }
    return UserProfile.STANDARD_USER;
  }
}