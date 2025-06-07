import type { ElForm, FormRules } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
// import { loginApi, registerApi } from '@/api/auth';
import { HOME_URL } from '@/config';
import useEnv from '@/hooks/useEnv';
// import { initDynamicRouter } from '@/router/modules/dynamicRouter';
// import { useUserStore } from '@/stores/modules/user';

type FormInstance = InstanceType<typeof ElForm>;

interface LoginForm {
  username: string;
  password: string;
  emailCode: string;
  email: string;
  loginType: 'password' | 'email';
}

// 切换登录和注册
const isRegister = ref(false);
const back = () => {
  isRegister.value = false;
};
const goRegister = () => {
  isRegister.value = true;
};

export default () => {
  const router = useRouter();
  // const userStore = useUserStore();
  const loading = ref(false);
  const env = useEnv();

  const loginForm = reactive<LoginForm>({
    username: env.VITE_LOGIN_USERNAME!,
    password: env.VITE_LOGIN_PASSWORD!,
    emailCode: '',
    email: 'jiazhigang_888@163.com',
    loginType: 'password'
  });

  const registerForm = reactive({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    nickname: ''
  });

  const formRef = ref<FormInstance | null>(null);

  const formValidate = async () => {
    return await formRef.value?.validate();
  };

  const login = async () => {
    await formValidate();
    loading.value = true;
    try {
      router.push(HOME_URL);
      // const loginData = {
      //   ...loginForm,
      //   email: loginForm.loginType === 'email' ? loginForm.email : undefined,
      //   emailCode: loginForm.loginType === 'email' ? loginForm.emailCode : undefined
      // };
      // const { data, success, message } = await loginApi(loginData);
      // if (success) {
      //   userStore.setAccessToken(data.access_token);
      //   userStore.setRefreshToken(data.refresh_token);
      //   await userStore.getUserInfo();
      //   // 跳转到首页
      //   const redirect = router.currentRoute.value.query.redirect;
      //   if (redirect) {
      //     router.push(redirect as string);
      //   } else {
      //     router.push(HOME_URL);
      //   }
      //   ElMessage.success('登录成功');
      // } else {
      //   ElMessage.error(message);
      // }
    } finally {
      loading.value = false;
    }
  };

  const register = async () => {
    await formValidate();
    loading.value = true;
    try {
      // const { success, message } = await registerApi(registerForm);
      // if (success) {
      //   ElMessage.success('注册成功, 请前往登录!');
      //   back();
      // } else {
      //   ElMessage.error(message);
      // }
    } finally {
      loading.value = false;
    }
  };

  const monitorEnter = (cb: () => void) => {
    document.onkeydown = (e: KeyboardEvent) => {
      e = (window.event as KeyboardEvent) || e;
      if (e.code === 'Enter' || e.code === 'enter' || e.code === 'NumpadEnter') {
        if (loading.value) return;
        cb && cb();
      }
    };
  };
  const validateEmail = (rule: any, value: string, callback: any) => {
    const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;
    if (!value) {
      callback(new Error('请输入邮箱地址'));
    } else if (!emailRegex.test(value)) {
      callback(new Error('请输入正确的邮箱格式'));
    } else {
      callback();
    }
  };

  const loginRules: FormRules = {
    username: [{ required: true, message: '请输入用户名或邮箱', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    emailCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
    email: [{ required: true, validator: validateEmail, trigger: 'blur' }]
  };
  return {
    register,
    login,
    loading,
    registerForm,
    loginForm,
    monitorEnter,
    formRef,
    isRegister,
    back,
    goRegister,
    loginRules
  };
};
