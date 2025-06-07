// src/types/auth.d.ts
declare namespace Auth {
  // 登录参数
  interface LoginParams {
    username?: string;
    password?: string;
    email?: string;
    code?: string; // 验证码
  }

  // 登录响应
  interface LoginResult {
    access_token: string;
    refresh_token: string;
  }

  // 注册参数
  interface RegisterParams {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
  }

  // 注册响应
  interface RegisterResult {
    access_token: string;
    token_type: string;
    expires_in: number;
  }

  // 获取验证码
  interface GetCaptchaResult {
    captchaKey: string;
    captchaImage: string;
  }

  // 刷新token
  interface RefreshTokenResult {
    access_token: string;
    refresh_token: string;
  }

  // 发送邮箱验证码响应
  interface SendEmailCodeResult {
    success: boolean;
    message: string;
  }
}
