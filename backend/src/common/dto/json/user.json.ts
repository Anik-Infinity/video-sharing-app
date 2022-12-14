import { Gender } from '../../../common/enum/gender.enum';
import { RoleType } from '../../../common/enum/role-type.enum';

export const usersObject = [
  {
    fullName: 'Shahidullah Anik',
    email: 'admin@gmail.com',
    phone: '01712000001',
    password: '1234',
    dateOfBirth: '1995-04-04',
    gender: Gender.Male,
    roleType: RoleType.ADMIN,
    currentAddress: 'XYZ Limited, Uttara-12, Dhaka, Bangladesh',
    permanentAddress: 'MirerTek, Rajshahi, Bangladesh',
  },
  {
    fullName: 'Razib Ghosh',
    email: 'admin1@gmail.com',
    phone: '01712000002',
    password: '1234',
    dateOfBirth: '1990-01-01',
    gender: Gender.Male,
    roleType: RoleType.ADMIN,
    currentAddress: 'XYZ Limited, Uttara-12, Dhaka, Bangladesh',
    permanentAddress: 'Kuril, Dhaka, Bangladesh',
  },
  {
    fullName: 'Saiful Islam',
    email: 'student@gmail.com',
    phone: '01712000005',
    password: '1234',
    dateOfBirth: '1995-01-01',
    gender: Gender.Male,
    roleType: RoleType.STUDENT,
    currentAddress: 'XYZ Limited, Uttara-12, Dhaka, Bangladesh',
    permanentAddress: 'Gazipur, Dhaka, Bangladesh',
    studentId: '16151001',
    department: 'Computer Science and Engineering',
  },
];
