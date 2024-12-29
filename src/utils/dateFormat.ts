export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  } catch (e) {
    return isoString;
  }
}

// 只显示日期
export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  } catch (e) {
    return isoString;
  }
}

// 只显示时间
export function formatTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  } catch (e) {
    return isoString;
  }
}


// TODO: t 的类型我不太确定 应该怎么声明
export function formatRelativeTime(isoString: string, t: any): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return t('timing.just_now');

    var num : number|undefined, unit: string = ""

    if (diffInSeconds < 3600){
      num = Math.floor(diffInSeconds / 60)
      unit = t("timing.unit_minute")
    }  else if (diffInSeconds < 86400) {
      num = Math.floor(diffInSeconds / 3600)
      unit = t("timing.unit_hour")
    } else if (diffInSeconds < 604800) {
      num = Math.floor(diffInSeconds / 86400)
      unit = t("timing.unit_day")
    }

    if(unit != "") {
      return t('timing.num_unit_ago', {num: num, unit: unit})
    }
    
    return formatDateTime(isoString);
  } catch (e) {
    return isoString;
  }
} 