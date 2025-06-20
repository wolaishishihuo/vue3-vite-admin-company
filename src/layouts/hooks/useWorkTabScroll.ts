export function useWorkTabScroll(
  list: Ref<any[]>,
  scrollRef: Ref<HTMLElement | null>,
  tabsRef: Ref<HTMLElement | null>
) {
  const router = useRouter();
  const translateX = ref(0); // 标签列表水平偏移量
  const transition = ref(''); // 过渡动画样式
  const activeTab = computed(() => router.currentRoute.value.path);
  const activeTabIndex = computed(() => list.value.findIndex(tab => tab.path === activeTab.value));

  let startX = 0; // 触摸开始位置
  let currentX = 0; // 当前触摸位置

  // 获取当前标签页索引和元素
  const getCurTabEl = () => document.getElementById(`scroll-li-${activeTabIndex.value}`) as HTMLElement;

  // 设置过渡动画
  const setTransition = () => {
    transition.value = 'transform 0.5s cubic-bezier(0.15, 0, 0.15, 1)';
    setTimeout(() => {
      transition.value = '';
    }, 250);
  };

  // 关闭标签页后的位置调整
  const worktabClosePosition = () => {
    if (!scrollRef.value || !tabsRef.value) return;

    const curTabEl = getCurTabEl();
    if (!curTabEl) return;

    const { offsetLeft, clientWidth } = curTabEl;
    const scrollWidth = scrollRef.value.offsetWidth;
    const ulWidth = tabsRef.value.offsetWidth;
    const curTabLeft = offsetLeft + clientWidth;

    requestAnimationFrame(() => {
      translateX.value = curTabLeft > scrollWidth ? scrollWidth - ulWidth : 0;
    });
  };

  // 自动定位当前标签页到可视区域
  const worktabAutoPosition = () => {
    if (!scrollRef.value || !tabsRef.value) return;

    const scrollWidth = scrollRef.value.offsetWidth;
    const ulWidth = tabsRef.value.offsetWidth;
    const curTabEl = getCurTabEl();

    if (!curTabEl) return;

    const { offsetLeft, clientWidth } = curTabEl;
    const curTabRight = offsetLeft + clientWidth;
    const targetLeft = scrollWidth - curTabRight;

    if (
      (offsetLeft > Math.abs(translateX.value) && curTabRight <= scrollWidth)
      || (translateX.value < targetLeft && targetLeft < 0)
    ) {
      return;
    }

    requestAnimationFrame(() => {
      if (curTabRight > scrollWidth) {
        translateX.value = Math.max(targetLeft - 6, scrollWidth - ulWidth);
      } else if (offsetLeft < Math.abs(translateX.value)) {
        translateX.value = -offsetLeft;
      }
    });
  };

  // 监听路由变化，自动定位标签页
  watch(
    () => router.currentRoute.value,
    () => {
      setTransition();
      worktabAutoPosition();
    }
  );

  // 滚动事件处理
  const listenerScroll = () => {
    const xMax = 0;

    if (tabsRef.value) {
      tabsRef.value.addEventListener(
        'wheel',
        (event: WheelEvent) => {
          if (scrollRef.value && tabsRef.value) {
            event.preventDefault();

            if (tabsRef.value.offsetWidth <= scrollRef.value.offsetWidth) return;

            const xMin = scrollRef.value.offsetWidth - tabsRef.value.offsetWidth;
            // 使用 deltaX 来处理水平滚动，使用 deltaY 来处理垂直滚动
            const delta
                = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
            translateX.value = Math.min(Math.max(translateX.value - delta, xMin), xMax);
          }
        },
        { passive: false }
      );
    }
  };

  // 触摸事件处理
  const addTouchListeners = () => {
    if (tabsRef.value) {
      tabsRef.value.addEventListener('touchstart', handleTouchStart);
      tabsRef.value.addEventListener('touchmove', handleTouchMove);
      tabsRef.value.addEventListener('touchend', handleTouchEnd);
    }
  };

  const handleTouchStart = (event: TouchEvent) => {
    startX = event.touches[0].clientX;
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (!scrollRef.value || !tabsRef.value) return;

    currentX = event.touches[0].clientX;
    const deltaX = currentX - startX;
    const xMin = scrollRef.value.offsetWidth - tabsRef.value.offsetWidth;

    translateX.value = Math.min(Math.max(translateX.value + deltaX, xMin), 0);
    startX = currentX;
  };

  const handleTouchEnd = () => {
    setTransition();
  };

  // 生命周期钩子
  onMounted(() => {
    listenerScroll(); // 监听滚动事件
    addTouchListeners(); // 添加触摸事件监听
    worktabAutoPosition(); // 初始定位
  });

  return {
    translateX,
    transition,
    activeTab,
    activeTabIndex,
    worktabClosePosition,
    worktabAutoPosition,
    setTransition
  };
}
