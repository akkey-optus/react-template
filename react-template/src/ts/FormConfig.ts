// formConfig.ts - 表单数据配置文件
// 这个文件定义具体的表单字段，并使用 zodSchemas.ts 中的校验规则

import {type FormConfig } from './Formtypes';
import {
  // 从 zodSchemas 导入需要的校验规则
  genderSchema,
  emailSchema,
  mobileSchema,
  postalCodeSchema,
  prefectureSchema,
  strongPasswordSchema,
  createKatakanaSchema,
  termsAgreementSchema,
  interestsSchema,
} from './Zodschemas';
import { z } from 'zod';

/**
 * ========================================
 * 示例1: 简单的联系表单
 * ========================================
 */
export const contactFormConfig: FormConfig = {
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'お名前はなんですか？',
      placeholder: '山田太郎',
      required: true,
      validation: z.string().min(1, 'お名前を入力してください'),
    },
    {
      name: 'email',
      type: 'email',
      label: 'メールアドレス',
      placeholder: 'example@example.com',
      required: true,
      validation: emailSchema, // ← zodSchemas.ts から使用
    },
    {
      name: 'subject',
      type: 'text',
      label: '件名',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'お問い合わせ内容',
      required: true,
      rows: 5,
      maxLength: 500,
    },
  ],
  submitText: '送信する',
  onSubmit: async (data) => {
    console.log('送信データ:', data);
    // API呼び出しなど
    alert('お問い合わせを送信しました！');
  },
};

/**
 * ========================================
 * 示例2: 日本式会员注册表单
 * ========================================
 */
export const japaneseRegistrationConfig: FormConfig = {
  columns: 2, // 2カラムレイアウト
  fields: [
    // ========== 氏名 ==========
    {
      name: 'lastName',
      type: 'text',
      label: '姓',
      placeholder: '山田',
      required: true,
      validation: z.string()
        .min(1, '姓を入力してください')
        .max(20, '姓は20文字以内で入力してください'),
      columns: 1,
    },
    {
      name: 'firstName',
      type: 'text',
      label: '名',
      placeholder: '太郎',
      required: true,
      validation: z.string()
        .min(1, '名を入力してください')
        .max(20, '名は20文字以内で入力してください'),
      columns: 1,
    },

    // ========== フリガナ（使用zodSchemas的校验） ==========
    {
      name: 'lastNameKana',
      type: 'text',
      label: 'セイ',
      placeholder: 'ヤマダ',
      required: true,
      validation: createKatakanaSchema('セイ'), // ← zodSchemas.ts から使用
      columns: 1,
    },
    {
      name: 'firstNameKana',
      type: 'text',
      label: 'メイ',
      placeholder: 'タロウ',
      required: true,
      validation: createKatakanaSchema('メイ'), // ← zodSchemas.ts から使用
      columns: 1,
    },

    // ========== 性別 ==========
    {
      name: 'gender',
      type: 'radio',
      label: '性別',
      required: true,
      options: [
        { label: '男性', value: 'male' },
        { label: '女性', value: 'female' },
        { label: 'その他', value: 'other' },
      ],
      validation: genderSchema, // ← zodSchemas.ts から使用
      columns: 2,
    },

    // ========== 生年月日 ==========
    {
      name: 'birthdate',
      type: 'date',
      label: '生年月日',
      required: true,
      columns: 2,
    },

    // ========== 住所 ==========
    {
      name: 'postalCode',
      type: 'text',
      label: '郵便番号',
      placeholder: '123-4567',
      required: true,
      validation: postalCodeSchema, // ← zodSchemas.ts から使用
      helpText: 'ハイフン付きで入力してください',
      columns: 1,
    },
    {
      name: 'prefecture',
      type: 'select',
      label: '都道府県',
      required: true,
      validation: prefectureSchema, // ← zodSchemas.ts から使用
      options: [
        { label: '北海道', value: '北海道' },
        { label: '青森県', value: '青森県' },
        { label: '岩手県', value: '岩手県' },
        { label: '宮城県', value: '宮城県' },
        { label: '秋田県', value: '秋田県' },
        { label: '山形県', value: '山形県' },
        { label: '福島県', value: '福島県' },
        { label: '茨城県', value: '茨城県' },
        { label: '栃木県', value: '栃木県' },
        { label: '群馬県', value: '群馬県' },
        { label: '埼玉県', value: '埼玉県' },
        { label: '千葉県', value: '千葉県' },
        { label: '東京都', value: '東京都' },
        { label: '神奈川県', value: '神奈川県' },
        { label: '新潟県', value: '新潟県' },
        { label: '富山県', value: '富山県' },
        { label: '石川県', value: '石川県' },
        { label: '福井県', value: '福井県' },
        { label: '山梨県', value: '山梨県' },
        { label: '長野県', value: '長野県' },
        { label: '岐阜県', value: '岐阜県' },
        { label: '静岡県', value: '静岡県' },
        { label: '愛知県', value: '愛知県' },
        { label: '三重県', value: '三重県' },
        { label: '滋賀県', value: '滋賀県' },
        { label: '京都府', value: '京都府' },
        { label: '大阪府', value: '大阪府' },
        { label: '兵庫県', value: '兵庫県' },
        { label: '奈良県', value: '奈良県' },
        { label: '和歌山県', value: '和歌山県' },
        { label: '鳥取県', value: '鳥取県' },
        { label: '島根県', value: '島根県' },
        { label: '岡山県', value: '岡山県' },
        { label: '広島県', value: '広島県' },
        { label: '山口県', value: '山口県' },
        { label: '徳島県', value: '徳島県' },
        { label: '香川県', value: '香川県' },
        { label: '愛媛県', value: '愛媛県' },
        { label: '高知県', value: '高知県' },
        { label: '福岡県', value: '福岡県' },
        { label: '佐賀県', value: '佐賀県' },
        { label: '長崎県', value: '長崎県' },
        { label: '熊本県', value: '熊本県' },
        { label: '大分県', value: '大分県' },
        { label: '宮崎県', value: '宮崎県' },
        { label: '鹿児島県', value: '鹿児島県' },
        { label: '沖縄県', value: '沖縄県' },
      ],
      columns: 1,
    },
    {
      name: 'city',
      type: 'text',
      label: '市区町村',
      placeholder: '千代田区',
      required: true,
      validation: z.string()
        .min(1, '市区町村を入力してください')
        .max(50, '市区町村は50文字以内で入力してください'),
      columns: 2,
    },
    {
      name: 'address1',
      type: 'text',
      label: '町名・番地',
      placeholder: '丸の内1-1-1',
      required: true,
      validation: z.string()
        .min(1, '町名・番地を入力してください')
        .max(100, '町名・番地は100文字以内で入力してください'),
      columns: 2,
    },
    {
      name: 'address2',
      type: 'text',
      label: '建物名・部屋番号',
      placeholder: '○○ビル101号室',
      columns: 2,
    },

    // ========== 連絡先 ==========
    {
      name: 'mobile',
      type: 'tel',
      label: '携帯電話番号',
      placeholder: '09012345678',
      required: true,
      validation: mobileSchema, // ← zodSchemas.ts から使用
      helpText: 'ハイフンなしで入力してください',
      columns: 2,
    },

    // ========== メールアドレス ==========
    {
      name: 'email',
      type: 'email',
      label: 'メールアドレス',
      placeholder: 'example@example.com',
      required: true,
      validation: emailSchema, // ← zodSchemas.ts から使用
      columns: 2,
    },

    // ========== パスワード ==========
    {
      name: 'password',
      type: 'password',
      label: 'パスワード',
      required: true,
      validation: strongPasswordSchema, // ← zodSchemas.ts から使用
      helpText: '大文字・小文字・数字・特殊文字を含む8文字以上',
      columns: 2,
    },

    // ========== 興味のある分野 ==========
    {
      name: 'interests',
      type: 'checkbox',
      label: '興味のある分野',
      options: [
        { label: 'IT・テクノロジー', value: 'tech' },
        { label: 'ビジネス', value: 'business' },
        { label: '金融', value: 'finance' },
        { label: '医療・健康', value: 'medical' },
        { label: '教育', value: 'education' },
        { label: 'エンターテインメント', value: 'entertainment' },
      ],
      validation: interestsSchema, // ← zodSchemas.ts から使用
      multiple: true,
      columns: 2,
    },

    // ========== 利用規約同意 ==========
    {
      name: 'agreeToTerms',
      type: 'switch',
      label: '利用規約に同意します',
      validation: termsAgreementSchema, // ← zodSchemas.ts から使用
      columns: 2,
    },
  ],
  submitText: '登録',
  showReset: true,
  resetText: 'クリア',
  onSubmit: async (data) => {
    console.log('登録データ:', data);
    
    // API呼び出し例
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        alert('登録が完了しました！');
      } else {
        alert('登録に失敗しました。');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('エラーが発生しました。');
    }
  },
};

/**
 * ========================================
 * 示例3: 调查问卷（从后端API获取）
 * ========================================
 */
export const createSurveyConfig = (apiData: any): FormConfig => {
  return {
    fields: apiData.questions.map((question: any, index: number) => {
      const baseConfig = {
        name: `q${index + 1}`,
        label: question.text,
        required: question.required,
      };

      // 根据问题类型配置
      switch (question.type) {
        case 'text':
          return {
            ...baseConfig,
            type: 'text' as const,
            maxLength: 200,
          };
        
        case 'textarea':
          return {
            ...baseConfig,
            type: 'textarea' as const,
            rows: 4,
            maxLength: 500,
          };
        
        case 'radio':
          return {
            ...baseConfig,
            type: 'radio' as const,
            options: question.options.map((opt: string) => ({
              label: opt,
              value: opt,
            })),
          };
        
        case 'checkbox':
          return {
            ...baseConfig,
            type: 'checkbox' as const,
            options: question.options.map((opt: string) => ({
              label: opt,
              value: opt,
            })),
            multiple: true,
          };
        
        default:
          return {
            ...baseConfig,
            type: 'text' as const,
          };
      }
    }),
    submitText: '送信',
    onSubmit: async (data) => {
      console.log('アンケート回答:', data);
      await fetch('/api/survey/submit', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      alert('ご回答ありがとうございました！');
    },
  };
};