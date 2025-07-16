import type { ElForm, FormRules } from 'element-plus';
import { HOME_URL } from '@/config';
import { useSettingStore } from '@/store/modules/setting';
import { useUserStore } from '@/store/modules/user';

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
  const loading = ref(false);
  const userStore = useUserStore();
  const settingStore = useSettingStore();
  const loginForm = reactive<LoginForm>({
    username: 'jiazhigang_888@163.com',
    password: '123456',
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
      userStore.setToken('123');
      userStore.setLoginStatus(true);
      settingStore.initSettingStore();
      router.push(HOME_URL);
    } finally {
      loading.value = false;
    }
  };

  const register = async () => {
    await formValidate();
    loading.value = true;
    try {
      userStore.setToken('123');
      userStore.setLoginStatus(true);
      settingStore.initSettingStore();
      router.push(HOME_URL);
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

  const validateEmail = (_rule: any, value: string, callback: any) => {
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
