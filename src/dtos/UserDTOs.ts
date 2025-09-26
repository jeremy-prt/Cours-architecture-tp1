// DTOs for User operations - separate from domain entities

export interface CreateUserDTO {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
}

export interface UpdateUserDTO {
  nom?: string;
  prenom?: string;
  email?: string;
  telephone?: string;
}

export interface UserResponseDTO {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  profil: 'Administrateur' | 'Utilisateur standard';
  createdAt: Date;
  updatedAt: Date;
}