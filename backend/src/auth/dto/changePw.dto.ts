// export class ChangePasswordDto {
//   currentPassword!: string;
//   newPassword!: string;
// }
// import { IsNotEmpty, IsString, MinLength, IsNumber } from 'class-validator';

export class ChangePasswordDto {

  userId!: number; // ✅ Додадено поле


  currentPassword!: string;


  newPassword!: string;
}
