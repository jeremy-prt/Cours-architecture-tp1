// DTOs for Application layer - no Domain knowledge

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
  profil: string;
  createdAt: Date;
  updatedAt: Date;
}