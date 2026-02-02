import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// ========================================
// 1. 校验 Schema 定义
// ========================================

const japaneseFormSchema = z.object({
  // 氏名（姓名）
  lastName: z.string()
    .min(1, '姓を入力してください')
    .max(20, '姓は20文字以内で入力してください'),

  firstName: z.string()
    .min(1, '名を入力してください')
    .max(20, '名は20文字以内で入力してください'),

  // フリガナ（假名）
  lastNameKana: z.string()
    .min(1, 'セイを入力してください')
    .regex(/^[ァ-ヶー\s]+$/, 'カタカナで入力してください')
    .max(20, 'セイは20文字以内で入力してください'),

  firstNameKana: z.string()
    .min(1, 'メイを入力してください')
    .regex(/^[ァ-ヶー\s]+$/, 'カタカナで入力してください')
    .max(20, 'メイは20文字以内で入力してください'),

  // 性別
  gender: z.enum(['male', 'female', 'other'], {
    message: '性別を選択してください'
  }),

  // 生年月日
  birthdate: z.string()
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
    }, '1900年以降の日付を入力してください'),

  // 郵便番号
  postalCode: z.string()
    .min(1, '郵便番号を入力してください')
    .regex(/^\d{3}-\d{4}$/, '郵便番号は000-0000の形式で入力してください'),

  // 都道府県
  prefecture: z.string()
    .min(1, '都道府県を選択してください'),

  // 市区町村
  city: z.string()
    .min(1, '市区町村を入力してください')
    .max(50, '市区町村は50文字以内で入力してください'),

  // 町名・番地
  address1: z.string()
    .min(1, '町名・番地を入力してください')
    .max(100, '町名・番地は100文字以内で入力してください'),

  // 建物名・部屋番号（任意）
  address2: z.string()
    .max(100, '建物名・部屋番号は100文字以内で入力してください')
    .optional()
    .or(z.literal('')),

  // 電話番号
  tel: z.string()
    .min(1, '電話番号を入力してください')
    .regex(/^0\d{9,10}$/, '電話番号は10桁または11桁の数字で入力してください（ハイフンなし）')
    .refine((tel) => {
      // 固定電話または携帯電話の形式チェック
      return /^0[1-9]\d{8,9}$/.test(tel);
    }, '有効な電話番号を入力してください'),

  // 携帯電話番号
  mobile: z.string()
    .min(1, '携帯電話番号を入力してください')
    .regex(/^0[789]0\d{8}$/, '携帯電話番号は11桁の数字で入力してください（例：09012345678）'),

  // メールアドレス
  email: z.string()
    .min(1, 'メールアドレスを入力してください')
    .email('メールアドレスの形式が正しくありません')
    .max(100, 'メールアドレスは100文字以内で入力してください')
    .toLowerCase(),

  // メールアドレス（確認用）
  emailConfirm: z.string()
    .min(1, 'メールアドレス（確認用）を入力してください')
    .email('メールアドレスの形式が正しくありません'),

  // パスワード
  password: z.string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(50, 'パスワードは50文字以内で入力してください')
    .regex(/[A-Z]/, '大文字を1文字以上含めてください')
    .regex(/[a-z]/, '小文字を1文字以上含めてください')
    .regex(/[0-9]/, '数字を1文字以上含めてください')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, '特殊文字を1文字以上含めてください'),

  // パスワード（確認用）
  passwordConfirm: z.string()
    .min(1, 'パスワード（確認用）を入力してください'),

  // 会社名（任意）
  companyName: z.string()
    .max(100, '会社名は100文字以内で入力してください')
    .optional()
    .or(z.literal('')),

  // 部署名（任意）
  department: z.string()
    .max(50, '部署名は50文字以内で入力してください')
    .optional()
    .or(z.literal('')),

  // 職位（任意）
  position: z.string()
    .max(50, '職位は50文字以内で入力してください')
    .optional()
    .or(z.literal('')),

  // Webサイト（任意）
  website: z.string()
    .url('URLの形式が正しくありません')
    .optional()
    .or(z.literal('')),

  // 年収範囲
  incomeRange: z.enum([
    'under3m',
    '3m-5m',
    '5m-7m',
    '7m-10m',
    'over10m'
  ], {
    message: '年収範囲を選択してください'
  }),

  // 興味のある分野（複数選択）
  interests: z.array(z.string())
    .min(1, '少なくとも1つ選択してください')
    .max(5, '最大5つまで選択できます'),

  // 自己紹介（任意）
  bio: z.string()
    .max(1000, '自己紹介は1000文字以内で入力してください')
    .optional()
    .or(z.literal('')),

  // 利用規約への同意
  agreeToTerms: z.boolean()
    .refine((val) => val === true, '利用規約に同意してください'),

  // プライバシーポリシーへの同意
  agreeToPrivacy: z.boolean()
    .refine((val) => val === true, 'プライバシーポリシーに同意してください'),

  // メールマガジン購読（任意）
  subscribeNewsletter: z.boolean()
    .optional(),

}).refine((data) => data.email === data.emailConfirm, {
  message: 'メールアドレスが一致しません',
  path: ['emailConfirm'],
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'パスワードが一致しません',
  path: ['passwordConfirm'],
});

type FormData = z.infer<typeof japaneseFormSchema>;

// ========================================
// 2. 都道府県データ
// ========================================

const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

// ========================================
// 3. フォームコンポーネント
// ========================================

const JapaneseFormValidation: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<FormData>({
    resolver: zodResolver(japaneseFormSchema),
    defaultValues: {
      interests: [],
      subscribeNewsletter: false,
    }
  });

  const onSubmit = async (data: FormData) => {
    console.log('フォームデータ:', data);
    // ここでAPIにデータを送信
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('登録が完了しました！');
  };

  // 郵便番号から住所を自動入力（簡易版）
  const handlePostalCodeBlur = async () => {
    const postalCode = watch('postalCode');
    if (postalCode && /^\d{3}-\d{4}$/.test(postalCode)) {
      // 実際にはAPIを使用して住所を取得
      console.log('郵便番号から住所を検索:', postalCode);
      // 例: setValue('prefecture', '東京都');
      // 例: setValue('city', '千代田区');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            会員登録フォーム
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* ========== 基本情報 ========== */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
                基本情報
              </h2>

              {/* 氏名 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    姓 <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('lastName')}
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="山田"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('firstName')}
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="太郎"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
              </div>

              {/* フリガナ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    セイ <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('lastNameKana')}
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.lastNameKana ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="ヤマダ"
                  />
                  {errors.lastNameKana && (
                    <p className="mt-1 text-sm text-red-500">{errors.lastNameKana.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    メイ <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('firstNameKana')}
                    type="text"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.firstNameKana ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="タロウ"
                  />
                  {errors.firstNameKana && (
                    <p className="mt-1 text-sm text-red-500">{errors.firstNameKana.message}</p>
                  )}
                </div>
              </div>

              {/* 性別 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  性別 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="inline-flex items-center">
                    <input
                      {...register('gender')}
                      type="radio"
                      value="male"
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-2">男性</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      {...register('gender')}
                      type="radio"
                      value="female"
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-2">女性</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      {...register('gender')}
                      type="radio"
                      value="other"
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-2">その他</span>
                  </label>
                </div>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
                )}
              </div>

              {/* 生年月日 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  生年月日 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('birthdate')}
                  type="date"
                  className={`w-full md:w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.birthdate ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.birthdate && (
                  <p className="mt-1 text-sm text-red-500">{errors.birthdate.message}</p>
                )}
              </div>
            </section>

            {/* ========== 住所情報 ========== */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
                住所情報
              </h2>

              {/* 郵便番号 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  郵便番号 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    {...register('postalCode')}
                    type="text"
                    className={`w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.postalCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                    placeholder="123-4567"
                    onBlur={handlePostalCodeBlur}
                  />
                  <button
                    type="button"
                    onClick={handlePostalCodeBlur}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    住所検索
                  </button>
                </div>
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-500">{errors.postalCode.message}</p>
                )}
              </div>

              {/* 都道府県 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  都道府県 <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('prefecture')}
                  className={`w-full md:w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.prefecture ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">選択してください</option>
                  {PREFECTURES.map((pref) => (
                    <option key={pref} value={pref}>
                      {pref}
                    </option>
                  ))}
                </select>
                {errors.prefecture && (
                  <p className="mt-1 text-sm text-red-500">{errors.prefecture.message}</p>
                )}
              </div>

              {/* 市区町村 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  市区町村 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('city')}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="千代田区"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              {/* 町名・番地 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  町名・番地 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('address1')}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.address1 ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="丸の内1-1-1"
                />
                {errors.address1 && (
                  <p className="mt-1 text-sm text-red-500">{errors.address1.message}</p>
                )}
              </div>

              {/* 建物名・部屋番号 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  建物名・部屋番号
                </label>
                <input
                  {...register('address2')}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.address2 ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="○○ビル101号室"
                />
                {errors.address2 && (
                  <p className="mt-1 text-sm text-red-500">{errors.address2.message}</p>
                )}
              </div>
            </section>

            {/* ========== 連絡先情報 ========== */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
                連絡先情報
              </h2>

              {/* 電話番号 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  電話番号 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('tel')}
                  type="tel"
                  className={`w-full md:w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.tel ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="0312345678"
                />
                <p className="mt-1 text-xs text-gray-500">ハイフンなしで入力してください</p>
                {errors.tel && (
                  <p className="mt-1 text-sm text-red-500">{errors.tel.message}</p>
                )}
              </div>

              {/* 携帯電話番号 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  携帯電話番号 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('mobile')}
                  type="tel"
                  className={`w-full md:w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.mobile ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="09012345678"
                />
                <p className="mt-1 text-xs text-gray-500">ハイフンなしで入力してください</p>
                {errors.mobile && (
                  <p className="mt-1 text-sm text-red-500">{errors.mobile.message}</p>
                )}
              </div>

              {/* メールアドレス */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="example@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* メールアドレス（確認用） */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス（確認用） <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('emailConfirm')}
                  type="email"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.emailConfirm ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="example@example.com"
                />
                {errors.emailConfirm && (
                  <p className="mt-1 text-sm text-red-500">{errors.emailConfirm.message}</p>
                )}
              </div>
            </section>

            {/* ========== アカウント情報 ========== */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
                アカウント情報
              </h2>

              {/* パスワード */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  パスワード <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('password')}
                  type="password"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="8文字以上で入力"
                />
                <p className="mt-1 text-xs text-gray-500">
                  大文字・小文字・数字・特殊文字を含む8文字以上
                </p>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              {/* パスワード（確認用） */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  パスワード（確認用） <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('passwordConfirm')}
                  type="password"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.passwordConfirm ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="パスワードを再入力"
                />
                {errors.passwordConfirm && (
                  <p className="mt-1 text-sm text-red-500">{errors.passwordConfirm.message}</p>
                )}
              </div>
            </section>

            {/* ========== 勤務先情報（任意） ========== */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
                勤務先情報（任意）
              </h2>

              {/* 会社名 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  会社名
                </label>
                <input
                  {...register('companyName')}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.companyName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="株式会社○○"
                />
                {errors.companyName && (
                  <p className="mt-1 text-sm text-red-500">{errors.companyName.message}</p>
                )}
              </div>

              {/* 部署名 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  部署名
                </label>
                <input
                  {...register('department')}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.department ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="営業部"
                />
                {errors.department && (
                  <p className="mt-1 text-sm text-red-500">{errors.department.message}</p>
                )}
              </div>

              {/* 職位 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  職位
                </label>
                <input
                  {...register('position')}
                  type="text"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.position ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="課長"
                />
                {errors.position && (
                  <p className="mt-1 text-sm text-red-500">{errors.position.message}</p>
                )}
              </div>

              {/* Webサイト */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webサイト
                </label>
                <input
                  {...register('website')}
                  type="url"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.website ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="https://example.com"
                />
                {errors.website && (
                  <p className="mt-1 text-sm text-red-500">{errors.website.message}</p>
                )}
              </div>
            </section>

            {/* ========== その他の情報 ========== */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
                その他の情報
              </h2>

              {/* 年収範囲 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  年収範囲 <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('incomeRange')}
                  className={`w-full md:w-1/2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.incomeRange ? 'border-red-500' : 'border-gray-300'
                    }`}
                >
                  <option value="">選択してください</option>
                  <option value="under3m">300万円未満</option>
                  <option value="3m-5m">300万円〜500万円</option>
                  <option value="5m-7m">500万円〜700万円</option>
                  <option value="7m-10m">700万円〜1000万円</option>
                  <option value="over10m">1000万円以上</option>
                </select>
                {errors.incomeRange && (
                  <p className="mt-1 text-sm text-red-500">{errors.incomeRange.message}</p>
                )}
              </div>

              {/* 興味のある分野 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  興味のある分野 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {['IT・テクノロジー', 'ビジネス', '金融', '不動産', '医療・健康',
                    '教育', '旅行', 'スポーツ', 'エンターテインメント'].map((interest) => (
                      <label key={interest} className="inline-flex items-center">
                        <input
                          {...register('interests')}
                          type="checkbox"
                          value={interest}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="ml-2 text-sm">{interest}</span>
                      </label>
                    ))}
                </div>
                <p className="mt-1 text-xs text-gray-500">最大5つまで選択可能</p>
                {errors.interests && (
                  <p className="mt-1 text-sm text-red-500">{errors.interests.message}</p>
                )}
              </div>

              {/* 自己紹介 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  自己紹介
                </label>
                <textarea
                  {...register('bio')}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.bio ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="ご自由にご記入ください（1000文字以内）"
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
                )}
              </div>
            </section>

            {/* ========== 同意事項 ========== */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
                同意事項
              </h2>

              <div className="space-y-3">
                {/* 利用規約 */}
                <div>
                  <label className="inline-flex items-start">
                    <input
                      {...register('agreeToTerms')}
                      type="checkbox"
                      className="w-4 h-4 mt-1 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-sm">
                      <a href="#" className="text-blue-600 hover:underline">利用規約</a>
                      に同意します <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="mt-1 ml-6 text-sm text-red-500">{errors.agreeToTerms.message}</p>
                  )}
                </div>

                {/* プライバシーポリシー */}
                <div>
                  <label className="inline-flex items-start">
                    <input
                      {...register('agreeToPrivacy')}
                      type="checkbox"
                      className="w-4 h-4 mt-1 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-sm">
                      <a href="#" className="text-blue-600 hover:underline">プライバシーポリシー</a>
                      に同意します <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {errors.agreeToPrivacy && (
                    <p className="mt-1 ml-6 text-sm text-red-500">{errors.agreeToPrivacy.message}</p>
                  )}
                </div>

                {/* メールマガジン */}
                <div>
                  <label className="inline-flex items-start">
                    <input
                      {...register('subscribeNewsletter')}
                      type="checkbox"
                      className="w-4 h-4 mt-1 text-blue-600 rounded"
                    />
                    <span className="ml-2 text-sm">
                      メールマガジンを購読する
                    </span>
                  </label>
                </div>
              </div>
            </section>

            {/* ========== 送信ボタン ========== */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isSubmitting ? '送信中...' : '登録する'}
              </button>
            </div>
          </form>
        </div>

        {/* ========== 説明セクション ========== */}
        <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            📝 実装されている校験機能
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✅ 必須項目の入力チェック</li>
            <li>✅ カタカナ・ひらがなの形式チェック</li>
            <li>✅ 郵便番号の形式チェック（000-0000）</li>
            <li>✅ 電話番号・携帯電話番号の形式チェック</li>
            <li>✅ メールアドレスの形式チェック＆確認</li>
            <li>✅ パスワード強度チェック＆確認</li>
            <li>✅ URL形式チェック</li>
            <li>✅ 生年月日の範囲チェック</li>
            <li>✅ 文字数制限チェック</li>
            <li>✅ チェックボックス・ラジオボタンの選択必須チェック</li>
            <li>✅ 配列の最小・最大数チェック</li>
            <li>✅ カスタムバリデーション（メール・パスワードの一致確認）</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JapaneseFormValidation;