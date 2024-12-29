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
    ["action.edit", "Edit", "编辑"],
    ["action.login", "Login", "登录"],
    ["action.logout", "Logout", "退出登录"],
    ["action.save", "Save", "保存"],
    ["action.cancel", "Cancel", "取消"],
    ["action.add_note", "Add Note", "添加笔记"],

    ["sync.success", "Sync success", "同步成功"],
    ["sync.failure", "Sync failed. please try again later", "同步失败，请稍后重试"],

    ["login.failed", "Login failed, please check username & password", '登录失败，请检查您的用户名和密码。'],
    ["login.succeeded", "Login successful", '登陆成功'],

    ["note.updated_at", "Updated at: {{time}}", "更新于：{{time}}"],

  // Login Prompt
    ["username", "Username", "用户名"],
    ["password", "Password", "密码"],
    ["my_notes", "My Notes", "我的笔记"],

    ["sync_success", "Sync successful", "同步成功"],
    ["sync_failure", "Sync failed, please try again later", "同步失败，请稍后重试"],
    ["to", "to", "至"],
    ["creation_time", "Creation Time", "创建时间" ],
    ["modification_time", "Modification Time", "修改时间" ],
    ["syncing", "Syncing...", "同步中..."],
    ["sync_notes", "Sync Notes", "同步笔记"],
    ["last_x_days", "recent {{days}} days", "最近{{days}}天"],

    ["timing.num_unit_ago", "{{num}} {{unit}} ago", "{{num}}{{unit}}前"],
    ["timing.just_now", "just now", "刚刚"],
    ["timing.unit_hour", "hour", "小时"],
    ["timing.unit_minute", "minute", "分钟" ],
    ["timing.unit_day", "day", "天"],
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