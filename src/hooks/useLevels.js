'use client';

import { useState, useEffect } from 'react';

/**
 * レベル情報を取得・管理するカスタムフック
 */
export function useLevels() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // レベル情報を取得
  const fetchLevels = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/levels');
      const data = await response.json();
      
      // エラーレスポンスの場合でも、データが配列なら正常として扱う
      if (Array.isArray(data)) {
        setLevels(data);
        setError(null);
      } else if (data.error) {
        console.error('API Error:', data.error);
        // デフォルトレベルを設定
        setLevels([
          { id: 'beginner', displayName: '中級前半', orderIndex: 1, isDefault: true, _count: { contents: 0 } },
          { id: 'intermediate', displayName: '中級レベル', orderIndex: 2, isDefault: false, _count: { contents: 0 } },
          { id: 'advanced', displayName: '上級レベル', orderIndex: 3, isDefault: false, _count: { contents: 0 } }
        ]);
        setError(null); // エラー表示を抑制
      } else {
        throw new Error('予期しないレスポンス形式');
      }
    } catch (err) {
      console.error('Error fetching levels:', err);
      // フェッチエラーの場合もデフォルトレベルを設定
      setLevels([
        { id: 'beginner', displayName: '中級前半', orderIndex: 1, isDefault: true, _count: { contents: 0 } },
        { id: 'intermediate', displayName: '中級レベル', orderIndex: 2, isDefault: false, _count: { contents: 0 } },
        { id: 'advanced', displayName: '上級レベル', orderIndex: 3, isDefault: false, _count: { contents: 0 } }
      ]);
      setError(null); // エラー表示を抑制
    } finally {
      setLoading(false);
    }
  };

  // 初回マウント時に取得
  useEffect(() => {
    fetchLevels();
  }, []);

  // レベルコードから表示名を取得
  const getLevelDisplayName = (levelCode) => {
    const level = levels.find(l => l.id === levelCode);
    return level ? level.displayName : levelCode;
  };

  // レベルコードからレベル情報を取得
  const getLevel = (levelCode) => {
    return levels.find(l => l.id === levelCode);
  };

  // デフォルトレベルを取得
  const getDefaultLevel = () => {
    return levels.find(l => l.isDefault);
  };

  // レベルのスタイルを取得（互換性のため）
  const getLevelStyle = (levelCode, styleType = 'badge') => {
    const styleMap = {
      'beginner': {
        badge: 'bg-blue-100 text-blue-800',
        badgeHover: 'bg-blue-500/80 text-white',
        text: 'text-blue-600',
        textBold: 'text-blue-700'
      },
      'intermediate': {
        badge: 'bg-green-100 text-green-800',
        badgeHover: 'bg-emerald-500/80 text-white',
        text: 'text-emerald-600',
        textBold: 'text-emerald-700'
      },
      'advanced': {
        badge: 'bg-purple-100 text-purple-800',
        badgeHover: 'bg-purple-500/80 text-white',
        text: 'text-purple-600',
        textBold: 'text-purple-700'
      },
      // 新規レベル用のデフォルトスタイル
      'default': {
        badge: 'bg-gray-100 text-gray-800',
        badgeHover: 'bg-gray-500/80 text-white',
        text: 'text-gray-600',
        textBold: 'text-gray-700'
      }
    };

    const styles = styleMap[levelCode] || styleMap['default'];
    return styles[styleType] || '';
  };

  return {
    levels,
    loading,
    error,
    refetch: fetchLevels,
    getLevelDisplayName,
    getLevel,
    getDefaultLevel,
    getLevelStyle
  };
}