
export class UserResponseDto {
  userId: string;
  userName: string;
  phone: string;
  email: string;
  roleName: string;
  roleType: number;

  isSuperAdmin: boolean;
  isAdmin: boolean;
  isAcademic: boolean;
  isLibrarian: boolean;
  isStudent: boolean;
  // hasLicenseAndNID: boolean;

  superAdminId: string;
  adminId: string;
  academicId: string;
  librarianId: string;
  studentId: string;

  accessToken: string;
}
