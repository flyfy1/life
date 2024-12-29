import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// key, en, zh
type SingleKeyT = [string, string, string]
type SingleLangT = {translation: {[key: string]: string}};
type KeyTranslations = {
  zh: SingleLangT
  en: SingleLangT
};

function translate(translations: SingleKeyT[]): KeyTranslations {
  var result: KeyTranslations = {zh: {translation: {}}, en: {translation: {}}}
  for(const t of translations) {
    const [k, en, zh] = t
    result.en.translation[k] = en
    result.zh.translation[k] = zh
  }
  return result
}

const translations: KeyTranslations = translate([
  // Actions
    ["edit", "Edit", "编辑"],
    ["login", "Login", "登录"],
    ["sync", "Sync Notes", "同步笔记"],
    ["sync.success", "Sync success", "同步成功"],
    ["login.failed", "Login failed, please check username & password", '登录失败，请检查您的用户名和密码。'],
    ["sync.failure", "Sync failed. please try again later", "同步失败，请稍后重试"],

    ["logout", "Logout", "退出登录"],
    ["add_note", "Add Note", "添加笔记"],

  // Login Prompt
    ["username", "Username", "用户名"],
    ["password", "Password", "密码"],
    ["my_notes", "My Notes", "我的笔记"],
    ["save", "Save", "保存"],
    ["cancel", "Cancel", "取消"],
    ["sync_success", "Sync successful", "同步成功"],
    ["sync_failure", 
      "Sync failed, please try again later", "同步失败，请稍后重试"],
    ["to", "to", "至"],
    ["creation_time", "Creation Time", "创建时间" ],
    ["modification_time", "Modification Time", "修改时间" ],
    ["syncing", "Syncing...", "同步中..."],
    ["sync_notes", "Sync Notes", "同步笔记"],
    ["logout", "Logout", "退出登录"],
    ["last_x_days", "最近{{days}}天", "最近{{days}}天"],
]);

i18n
  .use(initReactI18next)
  .init({
    resources: translations,
    lng: "zh", // 默认语言
    fallbackLng: "en", // 回退语言
    interpolation: {
      escapeValue: false // React 已经安全处理了
    }
  });

export default i18n; 