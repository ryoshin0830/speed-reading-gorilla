/**
 * レベルコードと表示名のマッピング定数
 * 
 * 重要：データベースでは歴史的な理由により、以下のlevelCodeを使用しています：
 * - 'beginner': 中級前半（旧：初級修了レベル）
 * - 'intermediate': 中級レベル
 * - 'advanced': 上級レベル
 * 
 * このマッピングにより、バックエンドのデータ構造を変更することなく、
 * ユーザーインターフェースの表示を適切に管理できます。
 */

// レベルコードの定数
export const LEVEL_CODES = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced'
};

// レベル表示名の定数
export const LEVEL_DISPLAY_NAMES = {
  BEGINNER: '中級前半',
  INTERMEDIATE: '中級レベル',
  ADVANCED: '上級レベル'
};

// レベルコードから表示名へのマッピング
export const LEVEL_CODE_TO_DISPLAY = {
  [LEVEL_CODES.BEGINNER]: LEVEL_DISPLAY_NAMES.BEGINNER,
  [LEVEL_CODES.INTERMEDIATE]: LEVEL_DISPLAY_NAMES.INTERMEDIATE,
  [LEVEL_CODES.ADVANCED]: LEVEL_DISPLAY_NAMES.ADVANCED
};

// 表示名からレベルコードへのマッピング
export const DISPLAY_NAME_TO_LEVEL_CODE = {
  [LEVEL_DISPLAY_NAMES.BEGINNER]: LEVEL_CODES.BEGINNER,
  [LEVEL_DISPLAY_NAMES.INTERMEDIATE]: LEVEL_CODES.INTERMEDIATE,
  [LEVEL_DISPLAY_NAMES.ADVANCED]: LEVEL_CODES.ADVANCED
};

// レベルの並び順（表示用）
export const LEVEL_ORDER = {
  [LEVEL_CODES.BEGINNER]: 1,
  [LEVEL_CODES.INTERMEDIATE]: 2,
  [LEVEL_CODES.ADVANCED]: 3
};

// レベルごとのスタイルクラス
export const LEVEL_STYLES = {
  [LEVEL_CODES.BEGINNER]: {
    badge: 'bg-blue-100 text-blue-800',
    badgeHover: 'bg-blue-500/80 text-white',
    text: 'text-blue-600',
    textBold: 'text-blue-700'
  },
  [LEVEL_CODES.INTERMEDIATE]: {
    badge: 'bg-green-100 text-green-800',
    badgeHover: 'bg-emerald-500/80 text-white',
    text: 'text-emerald-600',
    textBold: 'text-emerald-700'
  },
  [LEVEL_CODES.ADVANCED]: {
    badge: 'bg-purple-100 text-purple-800',
    badgeHover: 'bg-purple-500/80 text-white',
    text: 'text-purple-600',
    textBold: 'text-purple-700'
  }
};

/**
 * レベルコードから表示名を取得
 * @param {string} levelCode - レベルコード（beginner, intermediate, advanced）
 * @returns {string} 表示名
 */
export function getLevelDisplayName(levelCode) {
  return LEVEL_CODE_TO_DISPLAY[levelCode] || levelCode;
}

/**
 * 表示名からレベルコードを取得
 * @param {string} displayName - 表示名（中級前半、中級レベル、上級レベル）
 * @returns {string} レベルコード
 */
export function getLevelCode(displayName) {
  return DISPLAY_NAME_TO_LEVEL_CODE[displayName] || 'beginner';
}

/**
 * レベルに応じたスタイルクラスを取得
 * @param {string} levelCode - レベルコード
 * @param {string} styleType - スタイルタイプ（badge, badgeHover, text, textBold）
 * @returns {string} スタイルクラス
 */
export function getLevelStyle(levelCode, styleType = 'badge') {
  const styles = LEVEL_STYLES[levelCode];
  return styles ? styles[styleType] : '';
}