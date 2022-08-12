import { RequestMethod } from '@nestjs/common';

export const publicUrls = [
    { path: '/library-api/api/v1/auth/login', method: RequestMethod.POST },
    { path: '/library-api/api/v1/auth/forget-password', method: RequestMethod.POST },
    { path: '/library-api/api/v1/auth/change-password', method: RequestMethod.POST },
    { path: '/library-api/api/v1/user/student-registration', method: RequestMethod.POST },
    { path: '/library-api/api/v1/user/librarian-registration', method: RequestMethod.POST },
    { path: '/library-api/api/v1/users/verify-otp/:id', method: RequestMethod.POST },
    { path: '/library-api/api/v1/users/resend-otp/:id', method: RequestMethod.POST },
];
