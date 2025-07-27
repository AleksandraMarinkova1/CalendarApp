export class RegisterDto {
  email!: string;
  password!: string;
  firstName?: string; // ако не е задолжително
  lastName?: string;
}
