import { RequestMethod } from '@nestjs/common';

export const publicUrls = [
    { path: '/video-sharing-app/api/v1/auth/login', method: RequestMethod.POST },
    { path: '/video-sharing-app/api/v1/auth/forget-password', method: RequestMethod.POST },
    { path: '/video-sharing-app/api/v1/auth/change-password', method: RequestMethod.POST },
    { path: '/video-sharing-app/api/v1/user/user-registration', method: RequestMethod.POST },
    { path: '/video-sharing-app/api/v1/users/verify-otp/:id', method: RequestMethod.POST },
    { path: '/video-sharing-app/api/v1/users/resend-otp/:id', method: RequestMethod.POST },
    { path: '/video-sharing-app/api/v1/video/video-list', method: RequestMethod.GET },
];