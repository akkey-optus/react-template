// validationUtils.ts - 日本の入力校験用ユーティリティ関数集

/**
 * ========================================
 * 日本特有の校験ユーティリティ関数
 * ========================================
 */

/**
 * 全角カタカナかどうかをチェック
 */
export const isFullWidthKatakana = (str: string): boolean => {
  return /^[ァ-ヶー\s]+$/.test(str);
};

/**
 * ひらがなかどうかをチェック
 */
export const isHiragana = (str: string): boolean => {
  return /^[ぁ-ん]+$/.test(str);
};

/**
 * 郵便番号の形式チェック（ハイフンあり・なし両対応）
 */
export const isValidPostalCode = (postalCode: string): boolean => {
  return /^\d{3}-?\d{4}$/.test(postalCode);
};

/**
 * 郵便番号を正規化（ハイフンを追加）
 */
export const normalizePostalCode = (postalCode: string): string => {
  const cleaned = postalCode.replace(/-/g, '');
  if (cleaned.length === 7) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  }
  return postalCode;
};

/**
 * 日本の固定電話番号かどうかをチェック
 */
export const isValidJapaneseTel = (tel: string): boolean => {
  // ハイフンを除去
  const cleaned = tel.replace(/-/g, '');
  // 0から始まる10桁または11桁の数字
  return /^0\d{9,10}$/.test(cleaned);
};

/**
 * 日本の携帯電話番号かどうかをチェック
 */
export const isValidJapaneseMobile = (mobile: string): boolean => {
  // ハイフンを除去
  const cleaned = mobile.replace(/-/g, '');
  // 070, 080, 090から始まる11桁
  return /^0[789]0\d{8}$/.test(cleaned);
};

/**
 * 電話番号を正規化（ハイフンを除去）
 */
export const normalizeTelNumber = (tel: string): string => {
  return tel.replace(/-/g, '');
};

/**
 * 電話番号にハイフンを追加
 */
export const formatTelNumber = (tel: string): string => {
  const cleaned = tel.replace(/-/g, '');
  
  // 携帯電話（11桁）
  if (cleaned.length === 11 && /^0[789]0/.test(cleaned)) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }
  
  // 固定電話（10桁）
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  return tel;
};

/**
 * マイナンバー（個人番号）の形式チェック
 */
export const isValidMyNumber = (myNumber: string): boolean => {
  const cleaned = myNumber.replace(/-/g, '');
  return /^\d{12}$/.test(cleaned);
};

/**
 * 身分証明書番号（運転免許証）の形式チェック
 */
export const isValidDriverLicense = (license: string): boolean => {
  // 12桁の数字
  return /^\d{12}$/.test(license);
};

/**
 * 銀行口座番号の形式チェック
 */
export const isValidBankAccount = (account: string): boolean => {
  // 7桁の数字（一般的な形式）
  return /^\d{7}$/.test(account);
};

/**
 * 銀行コード（金融機関コード）の形式チェック
 */
export const isValidBankCode = (code: string): boolean => {
  // 4桁の数字
  return /^\d{4}$/.test(code);
};

/**
 * 支店コードの形式チェック
 */
export const isValidBranchCode = (code: string): boolean => {
  // 3桁の数字
  return /^\d{3}$/.test(code);
};

/**
 * 全角を半角に変換
 */
export const toHalfWidth = (str: string): string => {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
};

/**
 * 半角を全角に変換
 */
export const toFullWidth = (str: string): string => {
  return str.replace(/[A-Za-z0-9]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
  });
};

/**
 * ひらがなをカタカナに変換
 */
export const hiraganaToKatakana = (str: string): string => {
  return str.replace(/[\u3041-\u3096]/g, (match) => {
    const chr = match.charCodeAt(0) + 0x60;
    return String.fromCharCode(chr);
  });
};

/**
 * カタカナをひらがなに変換
 */
export const katakanaToHiragana = (str: string): string => {
  return str.replace(/[\u30a1-\u30f6]/g, (match) => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
};

/**
 * 年齢を計算
 */
export const calculateAge = (birthdate: Date | string): number => {
  const birth = typeof birthdate === 'string' ? new Date(birthdate) : birthdate;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * 和暦から西暦に変換
 */
export const warekiToSeireki = (era: string, year: number): number => {
  const eraMap: { [key: string]: number } = {
    '明治': 1868,
    '大正': 1912,
    '昭和': 1926,
    '平成': 1989,
    '令和': 2019,
  };
  
  const baseYear = eraMap[era];
  if (!baseYear) {
    throw new Error('無効な元号です');
  }
  
  return baseYear + year - 1;
};

/**
 * 西暦から和暦に変換
 */
export const seirekiToWareki = (year: number): { era: string; year: number } => {
  if (year >= 2019) {
    return { era: '令和', year: year - 2019 + 1 };
  } else if (year >= 1989) {
    return { era: '平成', year: year - 1989 + 1 };
  } else if (year >= 1926) {
    return { era: '昭和', year: year - 1926 + 1 };
  } else if (year >= 1912) {
    return { era: '大正', year: year - 1912 + 1 };
  } else if (year >= 1868) {
    return { era: '明治', year: year - 1868 + 1 };
  }
  
  throw new Error('対応していない年号です');
};

/**
 * クレジットカード番号の形式チェック（Luhnアルゴリズム）
 */
export const isValidCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s|-/g, '');
  
  if (!/^\d{13,19}$/.test(cleaned)) {
    return false;
  }
  
  // Luhnアルゴリズム
  let sum = 0;
  let isEven = false;
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * クレジットカードブランドを判定
 */
export const getCreditCardBrand = (cardNumber: string): string | null => {
  const cleaned = cardNumber.replace(/\s|-/g, '');
  
  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned)) return 'MasterCard';
  if (/^3[47]/.test(cleaned)) return 'American Express';
  if (/^35(2[89]|[3-8][0-9])/.test(cleaned)) return 'JCB';
  if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
  if (/^3(?:0[0-5]|[68])/.test(cleaned)) return 'Diners Club';
  
  return null;
};

/**
 * パスワード強度を判定（0-4）
 */
export const getPasswordStrength = (password: string): number => {
  let strength = 0;
  
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  return Math.min(strength, 4);
};

/**
 * パスワード強度のラベルを取得
 */
export const getPasswordStrengthLabel = (strength: number): string => {
  const labels = ['非常に弱い', '弱い', '普通', '強い', '非常に強い'];
  return labels[strength] || '非常に弱い';
};

/**
 * メールアドレスのドメイン部分を取得
 */
export const getEmailDomain = (email: string): string | null => {
  const match = email.match(/@(.+)$/);
  return match ? match[1] : null;
};

/**
 * 日本の一般的なメールドメインかどうかをチェック
 */
export const isCommonJapaneseDomain = (email: string): boolean => {
  const domain = getEmailDomain(email);
  if (!domain) return false;
  
  const commonDomains = [
    'gmail.com',
    'yahoo.co.jp',
    'docomo.ne.jp',
    'ezweb.ne.jp',
    'softbank.ne.jp',
    'i.softbank.jp',
    'outlook.jp',
    'outlook.com',
    'hotmail.com',
    'icloud.com',
  ];
  
  return commonDomains.includes(domain.toLowerCase());
};

/**
 * ========================================
 * React カスタムフック
 * ========================================
 */

import { useState, useCallback } from 'react';

/**
 * 郵便番号から住所を検索するカスタムフック
 */
export const usePostalCodeLookup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async (postalCode: string) => {
    if (!isValidPostalCode(postalCode)) {
      setError('郵便番号の形式が正しくありません');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // 実際にはAPIを使用（例：zipcloud API）
      const cleaned = postalCode.replace(/-/g, '');
      const response = await fetch(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleaned}`
      );
      
      if (!response.ok) {
        throw new Error('住所の取得に失敗しました');
      }

      const data = await response.json();
      
      if (data.status !== 200 || !data.results || data.results.length === 0) {
        setError('該当する住所が見つかりませんでした');
        return null;
      }

      const result = data.results[0];
      
      return {
        prefecture: result.address1,
        city: result.address2,
        town: result.address3,
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { lookup, loading, error };
};

/**
 * 入力値を自動フォーマットするカスタムフック
 */
export const useAutoFormat = (
  type: 'postalCode' | 'tel' | 'mobile' | 'creditCard'
) => {
  const [value, setValue] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    switch (type) {
      case 'postalCode':
        // 数字のみ抽出
        inputValue = inputValue.replace(/[^\d]/g, '');
        if (inputValue.length > 7) {
          inputValue = inputValue.slice(0, 7);
        }
        // 自動的にハイフンを追加
        if (inputValue.length > 3) {
          inputValue = `${inputValue.slice(0, 3)}-${inputValue.slice(3)}`;
        }
        break;

      case 'tel':
      case 'mobile':
        // 数字のみ抽出
        inputValue = inputValue.replace(/[^\d]/g, '');
        if (inputValue.length > 11) {
          inputValue = inputValue.slice(0, 11);
        }
        break;

      case 'creditCard':
        // 数字のみ抽出
        inputValue = inputValue.replace(/[^\d]/g, '');
        if (inputValue.length > 16) {
          inputValue = inputValue.slice(0, 16);
        }
        // 4桁ごとにスペースを追加
        inputValue = inputValue.replace(/(\d{4})(?=\d)/g, '$1 ');
        break;
    }

    setValue(inputValue);
  }, [type]);

  return { value, handleChange, setValue };
};

/**
 * リアルタイムバリデーションのカスタムフック
 */
export const useRealtimeValidation = (
  validator: (value: string) => boolean,
  errorMessage: string
) => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (touched && newValue) {
      setError(validator(newValue) ? '' : errorMessage);
    }
  }, [validator, errorMessage, touched]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (value) {
      setError(validator(value) ? '' : errorMessage);
    }
  }, [value, validator, errorMessage]);

  return {
    value,
    error,
    touched,
    handleChange,
    handleBlur,
    setValue,
  };
};

/**
 * デバウンス処理のカスタムフック
 */
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// React import for useDebounce hook
import * as React from 'react';