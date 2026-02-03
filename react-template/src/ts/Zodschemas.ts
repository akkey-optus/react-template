// zodSchemas.ts - 日本向けZodスキーマ定義集

import { z } from 'zod';

/**
 * ========================================
 * 基本的な日本語フィールドスキーマ
 * ========================================
 */

// 氏名（漢字）
export const nameSchema = z.object({
  lastName: z.string()
    .min(10, '姓を入力してください')
    .max(20, '姓は20文字以内で入力してください'),
  firstName: z.string()
    .min(1, '名を入力してください')
    .max(20, '名は20文字以内で入力してください'),
});

// フリガナ（カタカナ）
export const kanaSchema = z.object({
  lastNameKana: z.string()
    .min(1, 'セイを入力してください')
    .regex(/^[ァ-ヶー\s]+$/, 'カタカナで入力してください')
    .max(20, 'セイは20文字以内で入力してください'),
  firstNameKana: z.string()
    .min(1, 'メイを入力してください')
    .regex(/^[ァ-ヶー\s]+$/, 'カタカナで入力してください')
    .max(20, 'メイは20文字以内で入力してください'),
});

// 完全な氏名（漢字＋カタカナ）
export const fullNameSchema = nameSchema.merge(kanaSchema);
// 性別
export const genderSchema =  z.enum(['male', 'female', 'other'], {
    message: '性別を選択してください'
  })

/**
 * ========================================
 * 住所関連スキーマ
 * ========================================
 */

// 郵便番号
export const postalCodeSchema = z.string()
  .min(1, '郵便番号を入力してください')
  .regex(/^\d{3}-\d{4}$/, '郵便番号は000-0000の形式で入力してください')
  .transform(val => val.replace(/-/g, '')); // ハイフンを除去して保存

// 都道府県
export const prefectureSchema = z.enum([
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
], {
  message: '都道府県を選択してください'
});

// 住所
export const addressSchema = z.object({
  postalCode: postalCodeSchema,
  prefecture: prefectureSchema,
  city: z.string()
    .min(1, '市区町村を入力してください')
    .max(50, '市区町村は50文字以内で入力してください'),
  address1: z.string()
    .min(1, '町名・番地を入力してください')
    .max(100, '町名・番地は100文字以内で入力してください'),
  address2: z.string()
    .max(100, '建物名・部屋番号は100文字以内で入力してください')
    .optional()
    .or(z.literal('')),
});

/**
 * ========================================
 * 連絡先関連スキーマ
 * ========================================
 */

// 電話番号（固定電話）
export const telSchema = z.string()
  .min(1, '電話番号を入力してください')
  .regex(/^0\d{9,10}$/, '電話番号は10桁または11桁の数字で入力してください')
  .transform(val => val.replace(/-/g, ''));

// 携帯電話番号
export const mobileSchema = z.string()
  .min(1, '携帯電話番号を入力してください')
  .regex(/^0[789]0\d{8}$/, '携帯電話番号は11桁の数字で入力してください（例：09012345678）')
  .transform(val => val.replace(/-/g, ''));

// メールアドレス
export const emailSchema = z.string()
  .min(1, 'メールアドレスを入力してください')
  .email('メールアドレスの形式が正しくありません')
  .max(100, 'メールアドレスは100文字以内で入力してください')
  .toLowerCase();

/**
 * ========================================
 * 日付関連スキーマ
 * ========================================
 */

// 生年月日
export const birthdateSchema = z.string()
  .min(1, '生年月日を入力してください')
  .regex(/^\d{4}-\d{2}-\d{2}$/, '生年月日はYYYY-MM-DD形式で入力してください')
  .refine((date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  }, '有効な日付を入力してください')
  .refine((date) => {
    const d = new Date(date);
    const today = new Date();
    return d <= today;
  }, '未来の日付は指定できません')
  .refine((date) => {
    const d = new Date(date);
    const minDate = new Date('1900-01-01');
    return d >= minDate;
  }, '1900年以降の日付を入力してください');

// 年齢（計算用）
export const ageSchema = z.number()
  .int('整数を入力してください')
  .min(0, '0以上の数値を入力してください')
  .max(150, '有効な年齢を入力してください');

// 成人確認用（18歳以上）
export const adultBirthdateSchema = birthdateSchema
  .refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 18;
    }
    return age >= 18;
  }, '18歳以上である必要があります');

/**
 * ========================================
 * パスワード関連スキーマ
 * ========================================
 */

// 基本的なパスワード
export const basicPasswordSchema = z.string()
  .min(8, 'パスワードは8文字以上で入力してください')
  .max(50, 'パスワードは50文字以内で入力してください');

// 強力なパスワード
export const strongPasswordSchema = basicPasswordSchema
  .regex(/[A-Z]/, '大文字を1文字以上含めてください')
  .regex(/[a-z]/, '小文字を1文字以上含めてください')
  .regex(/[0-9]/, '数字を1文字以上含めてください')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, '特殊文字を1文字以上含めてください');

// パスワード確認付き
export const passwordWithConfirmSchema = z.object({
  password: strongPasswordSchema,
  passwordConfirm: z.string().min(1, 'パスワード（確認用）を入力してください'),
}).refine(data => data.password === data.passwordConfirm, {
  message: 'パスワードが一致しません',
  path: ['passwordConfirm'],
});

/**
 * ========================================
 * 金融関連スキーマ
 * ========================================
 */

// 銀行コード（金融機関コード）
export const bankCodeSchema = z.string()
  .regex(/^\d{4}$/, '銀行コードは4桁の数字で入力してください');

// 支店コード
export const branchCodeSchema = z.string()
  .regex(/^\d{3}$/, '支店コードは3桁の数字で入力してください');

// 口座番号
export const accountNumberSchema = z.string()
  .regex(/^\d{7}$/, '口座番号は7桁の数字で入力してください');

// 口座種別
export const accountTypeSchema = z.enum(['普通', '当座', '貯蓄'], {
  message: '口座種別を選択してください'
});

// 銀行口座情報
export const bankAccountSchema = z.object({
  bankCode: bankCodeSchema,
  branchCode: branchCodeSchema,
  accountType: accountTypeSchema,
  accountNumber: accountNumberSchema,
  accountHolder: z.string()
    .min(1, '口座名義人を入力してください')
    .regex(/^[ァ-ヶー\s]+$/, '口座名義人はカタカナで入力してください'),
});

/**
 * ========================================
 * クレジットカード関連スキーマ
 * ========================================
 */

// クレジットカード番号（簡易版）
export const creditCardNumberSchema = z.string()
  .min(1, 'カード番号を入力してください')
  .regex(/^\d{13,19}$/, 'カード番号は13〜19桁の数字で入力してください')
  .refine((cardNumber) => {
    // Luhnアルゴリズムでチェック
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

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
  }, 'カード番号が正しくありません');

// カード有効期限
export const cardExpirySchema = z.string()
  .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, '有効期限はMM/YY形式で入力してください')
  .refine((expiry) => {
    const [month, year] = expiry.split('/');
    const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
    const today = new Date();
    return expiryDate > today;
  }, 'カードの有効期限が切れています');

// CVV/CVC
export const cardCvvSchema = z.string()
  .regex(/^\d{3,4}$/, 'セキュリティコードは3桁または4桁の数字で入力してください');

// クレジットカード情報
export const creditCardSchema = z.object({
  cardNumber: creditCardNumberSchema,
  cardHolder: z.string()
    .min(1, 'カード名義人を入力してください')
    .regex(/^[A-Z\s]+$/, 'カード名義人は大文字のアルファベットで入力してください'),
  expiry: cardExpirySchema,
  cvv: cardCvvSchema,
});

/**
 * ========================================
 * マイナンバー・身分証関連スキーマ
 * ========================================
 */

// マイナンバー（個人番号）
export const myNumberSchema = z.string()
  .regex(/^\d{12}$/, 'マイナンバーは12桁の数字で入力してください');

// 運転免許証番号
export const driverLicenseSchema = z.string()
  .regex(/^\d{12}$/, '運転免許証番号は12桁の数字で入力してください');

/**
 * ========================================
 * 業種・職種関連スキーマ
 * ========================================
 */

// 職業
export const occupationSchema = z.enum([
  '会社員（事務系）',
  '会社員（技術系）',
  '会社員（営業系）',
  '会社員（その他）',
  '公務員',
  '自営業',
  '自由業',
  'パート・アルバイト',
  '学生',
  '主婦・主夫',
  '無職',
  'その他'
], {
  message: '職業を選択してください'
});

// 年収範囲
export const incomeRangeSchema = z.enum([
  '200万円未満',
  '200万円〜300万円',
  '300万円〜400万円',
  '400万円〜500万円',
  '500万円〜600万円',
  '600万円〜700万円',
  '700万円〜800万円',
  '800万円〜1000万円',
  '1000万円〜1500万円',
  '1500万円以上'
], {
  message: '年収範囲を選択してください'
});

/**
 * ========================================
 * URL・SNS関連スキーマ
 * ========================================
 */

// Webサイト
export const websiteSchema = z.string()
  .url('URLの形式が正しくありません')
  .optional()
  .or(z.literal(''));

// Twitter（X）ハンドル
export const twitterHandleSchema = z.string()
  .regex(/^@?[A-Za-z0-9_]{1,15}$/, 'Twitterハンドルの形式が正しくありません')
  .transform(val => val.startsWith('@') ? val : `@${val}`)
  .optional()
  .or(z.literal(''));

// Instagram ユーザー名
export const instagramUsernameSchema = z.string()
  .regex(/^[A-Za-z0-9_.]{1,30}$/, 'Instagramユーザー名の形式が正しくありません')
  .optional()
  .or(z.literal(''));

/**
 * ========================================
 * 同意・利用規約関連スキーマ
 * ========================================
 */

// 利用規約への同意
export const termsAgreementSchema = z.boolean()
  .refine(val => val === true, '利用規約に同意してください');

// プライバシーポリシーへの同意
export const privacyAgreementSchema = z.boolean()
  .refine(val => val === true, 'プライバシーポリシーに同意してください');

// 年齢確認
export const ageConfirmationSchema = z.boolean()
  .refine(val => val === true, '18歳以上であることを確認してください');

/**
 * ========================================
 * 複合スキーマ（よく使う組み合わせ）
 * ========================================
 */

// ユーザー登録フォーム（基本）
export const basicUserRegistrationSchema = z.object({
  ...fullNameSchema.shape,
  email: emailSchema,
  ...passwordWithConfirmSchema.shape,
  agreeToTerms: termsAgreementSchema,
  agreeToPrivacy: privacyAgreementSchema,
});

// ユーザー登録フォーム（完全版）
export const fullUserRegistrationSchema = basicUserRegistrationSchema.extend({
  gender: z.enum(['male', 'female', 'other'], {
    message: '性別を選択してください'
  }),
  birthdate: adultBirthdateSchema,
  ...addressSchema.shape,
  tel: telSchema.optional().or(z.literal('')),
  mobile: mobileSchema,
});

// お問い合わせフォーム
export const contactFormSchema = z.object({
  name: z.string().min(1, 'お名前を入力してください'),
  email: emailSchema,
  subject: z.string().min(1, '件名を入力してください').max(100),
  message: z.string()
    .min(1, 'お問い合わせ内容を入力してください')
    .max(2000, 'お問い合わせ内容は2000文字以内で入力してください'),
  agreeToPrivacy: privacyAgreementSchema,
});

// 配送先情報
export const shippingAddressSchema = fullNameSchema
  .merge(kanaSchema)
  .merge(addressSchema)
  .extend({
    tel: telSchema,
    mobile: mobileSchema.optional().or(z.literal('')),
  });

// ECサイト注文情報
export const orderSchema = z.object({
  shipping: shippingAddressSchema,
  billing: shippingAddressSchema.optional(),
  useSameAddress: z.boolean(),
  deliveryDate: z.string().optional(),
  deliveryTime: z.string().optional(),
  paymentMethod: z.enum(['credit', 'bank', 'cod', 'convenience'], {
    message: '支払い方法を選択してください'
  }),
}).refine(
  data => data.useSameAddress || data.billing !== undefined,
  {
    message: '請求先住所を入力してください',
    path: ['billing']
  }
);

/**
 * ========================================
 * カスタムバリデーション関数
 * ========================================
 */

// カスタムメッセージ付きカタカナチェック
export const createKatakanaSchema = (fieldName: string) => {
  return z.string()
    .min(1, `${fieldName}を入力してください`)
    .regex(/^[ァ-ヶー\s]+$/, `${fieldName}はカタカナで入力してください`);
};

// カスタムメッセージ付きひらがなチェック
export const createHiraganaSchema = (fieldName: string) => {
  return z.string()
    .min(1, `${fieldName}を入力してください`)
    .regex(/^[ぁ-ん\s]+$/, `${fieldName}はひらがなで入力してください`);
};

// 最小年齢チェック付き生年月日
export const createMinAgeBirthdateSchema = (minAge: number) => {
  return birthdateSchema.refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= minAge;
    }
    return age >= minAge;
  }, `${minAge}歳以上である必要があります`);
};
// その他　興味
export const interestsSchema = z.array(z.string())
    .min(1, '少なくとも1つ選択してください')
    .max(5, '最大5つまで選択できます')