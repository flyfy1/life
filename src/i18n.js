import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "edit": "Edit",
          "login": "Login",
          "username": "Username",
          "password": "Password",
          "sync": "Sync Notes",
          "logout": "Logout",
          "add_note": "Add Note",
          "my_notes": "My Notes",
          "save": "Save",
          "cancel": "Cancel",
          "sync_success": "Sync successful",
          "sync_failure": "Sync failed, please try again later",
          // 添加更多翻译
        }
      },
      zh: {
        translation: {
          "edit": "编辑",
          "login": "登录",
          "username": "用户名",
          "password": "密码",
          "sync": "同步笔记",
          "logout": "退出登录",
          "add_note": "添加笔记",
          "my_notes": "我的笔记",
          "save": "保存",
          "cancel": "取消",
          "sync_success": "同步成功",
          "sync_failure": "同步失败，请稍后重试",
          // 添加更多翻译
        }
      }
    },
    lng: "zh", // 默认语言
    fallbackLng: "en", // 回退语言
    interpolation: {
      escapeValue: false // React 已经安全处理了
    }
  });

export default i18n; 