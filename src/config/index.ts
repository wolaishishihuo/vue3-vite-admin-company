import { MenuThemeEnum, SystemThemeEnum } from '@/enums/appEnum';

export const HOME_URL: string = '/dashboard';

// 登录页地址（默认）
export const LOGIN_URL: string = '/login';

// 路由白名单地址
export const ROUTER_WHITE_LIST: string[] = ['/500', '/403', '/404'];

// 首页地址（默认）
/**
 * 系统配置
 * 包含：系统信息、系统主题、菜单主题、菜单布局、系统主色、系统主色列表、系统主色、系统其他项默认配置
 */
const appConfig = {
  // 系统信息
  systemInfo: {
    name: 'Art Design Pro' // 系统名称
  },
  // Element Plus 主题
  elementPlusTheme: {
    primary: '#5D87FF'
  },
  // 系统主题
  systemThemeStyles: {
    [SystemThemeEnum.LIGHT]: { className: '' },
    [SystemThemeEnum.DARK]: { className: SystemThemeEnum.DARK }
  },

  darkMenuStyles: [
    {
      theme: MenuThemeEnum.DARK,
      background: '#161618',
      systemNameColor: '#DDDDDD',
      iconColor: '#BABBBD',
      textColor: 'rgba(#FFFFFF, 0.7)',
      textActiveColor: '',
      iconActiveColor: '#FFFFFF',
      tabBarBackground: '#FFFFFF',
      systemBackground: '#F8F8F8',
      leftLineColor: '#3F4257',
      rightLineColor: '#EDEEF0'
    }
  ],
  // 系统主色
  systemMainColor: [
    '#5D87FF',
    '#B48DF3',
    '#60C041',
    '#38C0FC',
    '#F9901F',
    '#FF80C8'
  ] as const,
  // 系统其他项默认配置
  systemSetting: {
    defaultMenuWidth: 210, // 菜单宽度
    defaultMenuCollapseWidth: 64, // 菜单折叠宽度
    defaultCustomRadius: '0.75', // 自定义圆角
    defaultTabStyle: 'tab-default' // 标签样式
  }
};

export default Object.freeze(appConfig);
