import { UserId } from '../valueobjects/UserId';
import { Email } from '../valueobjects/Email';
import { UserProfile } from '../valueobjects/UserProfile';
import { UserProfileService } from '../services/UserProfileService';

export class User {
  private id?: UserId;
  private nom: string;
  private prenom: string;
  private email: Email;
  private telephone: string;
  private profil: UserProfile;
  private createdAt?: Date;
  private updatedAt?: Date;

  private constructor(
    nom: string,
    prenom: string,
    email: Email,
    telephone: string,
    profil: UserProfile,
    id?: UserId,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.validateUserData(nom, prenom, telephone);
    this.nom = nom;
    this.prenom = prenom;
    this.email = email;
    this.telephone = telephone;
    this.profil = profil;
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(
    nom: string,
    prenom: string,
    email: Email,
    telephone: string,
    profileService: UserProfileService
  ): User {
    const profil = profileService.assignProfile(email);
    return new User(nom, prenom, email, telephone, profil);
  }

  static fromPersistence(
    id: number,
    nom: string,
    prenom: string,
    email: string,
    telephone: string,
    profil: string,
    createdAt: Date,
    updatedAt: Date
  ): User {
    const userId = new UserId(id);
    const emailVO = new Email(email);
    const profilEnum = profil === 'Administrateur' ? UserProfile.ADMINISTRATOR : UserProfile.STANDARD_USER;
    
    return new User(nom, prenom, emailVO, telephone, profilEnum, userId, createdAt, updatedAt);
  }

  updateEmail(newEmail: Email, profileService: UserProfileService): void {
    this.email = newEmail;
    this.profil = profileService.assignProfile(newEmail);
    this.updatedAt = new Date();
  }

  updatePersonalInfo(nom?: string, prenom?: string, telephone?: string): void {
    if (nom !== undefined) {
      this.validateName(nom);
      this.nom = nom;
    }
    if (prenom !== undefined) {
      this.validateName(prenom);
      this.prenom = prenom;
    }
    if (telephone !== undefined) {
      this.validateTelephone(telephone);
      this.telephone = telephone;
    }
    this.updatedAt = new Date();
  }

  private validateUserData(nom: string, prenom: string, telephone: string): void {
    this.validateName(nom);
    this.validateName(prenom);
    this.validateTelephone(telephone);
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Le nom ne peut pas être vide');
    }
    if (name.trim().length > 100) {
      throw new Error('Le nom ne peut pas dépasser 100 caractères');
    }
  }

  private validateTelephone(telephone: string): void {
    if (!telephone || telephone.trim().length === 0) {
      throw new Error('Le téléphone ne peut pas être vide');
    }
  }

  // Getters
  getId(): UserId | undefined {
    return this.id;
  }

  getNom(): string {
    return this.nom;
  }

  getPrenom(): string {
    return this.prenom;
  }

  getEmail(): Email {
    return this.email;
  }

  getTelephone(): string {
    return this.telephone;
  }

  getProfil(): UserProfile {
    return this.profil;
  }

  getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  isAdmin(): boolean {
    return this.profil === UserProfile.ADMINISTRATOR;
  }
}