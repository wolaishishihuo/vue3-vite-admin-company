declare namespace User {
  // 用户基本信息
  interface UserInfo {
    id: string;
    username: string;
    nickname?: string;
    avatar?: string;
    email?: string;
    phone?: string;
    roles: UserRole[]; // 角色列表
    status: number; // 状态：0-禁用，1-启用
    createTime: string; // 创建时间
    lastLoginTime?: string; // 最后登录时间
  }
  // 用户角色
  interface UserRole {
    id: string;
    name: string;
    description: string;
  }

  // 修改密码参数
  interface ChangePasswordParams {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }

  // 用户查询参数
  interface UserQueryParams {
    keyword?: string; // 关键字
    status?: number; // 状态
    startTime?: string; // 开始时间
    endTime?: string; // 结束时间
    pageNum: number; // 当前页码
    pageSize: number; // 每页数量
  }

  // 用户列表响应
  interface UserListResult {
    list: UserInfo[];
    total: number;
    pageNum: number;
    pageSize: number;
  }
}
