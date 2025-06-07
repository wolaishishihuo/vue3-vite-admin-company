import { useIntervalFn } from '@vueuse/core';

export const useVerifycode = (count = 60) => {
  const countdown = ref(count);

  const {
    pause: pauseCountdown,
    resume: resumeCountdown,
    isActive: isCountingDown
  } = useIntervalFn(
    () => {
      if (countdown.value <= 1) {
        stopCountdown();
      } else {
        countdown.value--;
      }
    },
    1000,
    { immediate: false }
  );

  const codeButtonText = computed(() => {
    if (isCountingDown.value) {
      return `${countdown.value}秒后重试`;
    }
    return '获取验证码';
  });

  const startCountdown = () => {
    countdown.value = count;
    resumeCountdown();
  };

  const stopCountdown = () => {
    pauseCountdown();
    countdown.value = count;
  };

  return {
    isCountingDown,
    countdown,
    pauseCountdown,
    startCountdown,
    stopCountdown,
    codeButtonText
  };
};
