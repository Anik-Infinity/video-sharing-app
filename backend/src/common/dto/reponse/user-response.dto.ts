
export class UserResponseDto {
  userId: string;
  userName: string;
  phone: string;
  email: string;
  roleName: string;
  roleType: number;

  isSuperAdmin: boolean;
  isAdmin: boolean;
  isGeneralUser: boolean;
  isStudent: boolean;
  // hasLicenseAndNID: boolean;

  superAdminId: string;
  adminId: string;
  generalUserId: string;
  studentId: string;

  accessToken: string;
}
