export interface CreateAccountDTO {
  userId: number;
  balance?: number;
}

export interface AccountResponseDTO {
  id: number;
  userId: number;
  accountNumber: string;
  balance: number | string;
  createdAt: Date;
  updatedAt: Date;
}
