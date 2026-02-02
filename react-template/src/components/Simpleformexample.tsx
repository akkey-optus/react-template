// SimpleFormExample.tsx - 再利用可能コンポーネントを使った簡単な例

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  TextInput,
  PostalCodeInput,
  PrefectureSelect,
  PhoneInput,
  RadioGroup,
  CheckboxGroup,
  TextArea,
  Checkbox,
  PasswordInput,
  SubmitButton,
  FormSection,
} from './Formcomponents';
import { usePostalCodeLookup } from '../ts/Validationutils';

// スキーマ定義
const simpleFormSchema = z.object({
  lastName: z.string().min(1, '姓を入力してください'),
  firstName: z.string().min(1, '名を入力してください'),
  email: z.string().email('メールアドレスの形式が正しくありません'),
  password: z.string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(/[A-Z]/, '大文字を含めてください')
    .regex(/[a-z]/, '小文字を含めてください')
    .regex(/[0-9]/, '数字を含めてください'),
  postalCode: z.string().regex(/^\d{3}-\d{4}$/, '郵便番号は000-0000形式で入力してください'),
  prefecture: z.string().min(1, '都道府県を選択してください'),
  city: z.string().min(1, '市区町村を入力してください'),
  address1: z.string().min(1, '町名・番地を入力してください'),
  mobile: z.string().regex(/^0[789]0\d{8}$/, '携帯電話番号の形式が正しくありません'),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: '性別を選択してください' })
  }),
  interests: z.array(z.string()).min(1, '少なくとも1つ選択してください'),
  message: z.string().max(500, 'メッセージは500文字以内で入力してください').optional().or(z.literal('')),
  agreeToTerms: z.boolean().refine(val => val === true, '利用規約に同意してください'),
});

type FormData = z.infer<typeof simpleFormSchema>;

const SimpleFormExample: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(simpleFormSchema),
  });

  // 郵便番号検索
  const { lookup, loading: isSearching } = usePostalCodeLookup();
  const postalCode = watch('postalCode');

  const handlePostalCodeSearch = async () => {
    const result = await lookup(postalCode);
    if (result) {
      setValue('prefecture', result.prefecture);
      setValue('city', result.city);
      setValue('address1', result.town || '');
    }
  };

  const onSubmit = async (data: FormData) => {
    console.log('送信データ:', data);
    // ここでAPIにデータを送信
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('送信完了しました！');
  };

  // ラジオボタンのオプション
  const genderOptions = [
    { value: 'male', label: '男性' },
    { value: 'female', label: '女性' },
    { value: 'other', label: 'その他' },
  ];

  // チェックボックスのオプション
  const interestOptions = [
    { value: 'tech', label: 'IT・テクノロジー' },
    { value: 'business', label: 'ビジネス' },
    { value: 'finance', label: '金融' },
    { value: 'health', label: '医療・健康' },
    { value: 'education', label: '教育' },
    { value: 'entertainment', label: 'エンターテインメント' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            会員登録フォーム
          </h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* 基本情報セクション */}
            <FormSection title="基本情報">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  label="姓"
                  name="lastName"
                  register={register}
                  error={errors.lastName}
                  required
                  placeholder="山田"
                />
                
                <TextInput
                  label="名"
                  name="firstName"
                  register={register}
                  error={errors.firstName}
                  required
                  placeholder="太郎"
                />
              </div>

              <TextInput
                label="メールアドレス"
                name="email"
                register={register}
                error={errors.email}
                required
                type="email"
                placeholder="example@example.com"
              />

              <PasswordInput
                label="パスワード"
                name="password"
                register={register}
                error={errors.password}
                required
                showStrength
                helpText="大文字・小文字・数字を含む8文字以上"
              />

              <RadioGroup
                label="性別"
                name="gender"
                register={register}
                error={errors.gender}
                required
                options={genderOptions}
              />
            </FormSection>

            {/* 住所情報セクション */}
            <FormSection title="住所情報">
              <PostalCodeInput
                label="郵便番号1"
                name="postalCode"
                register={register}
                error={errors.postalCode}
                required
                onSearch={handlePostalCodeSearch}
                isSearching={isSearching}
              />

              <PrefectureSelect
                label="郵便番号2"
                name="prefecture"
                register={register}
                error={errors.prefecture}
                required
              />

              <TextInput
                label="市区町村"
                name="city"
                register={register}
                error={errors.city}
                required
                placeholder="千代田区"
              />

              <TextInput
                label="町名・番地"
                name="address1"
                register={register}
                error={errors.address1}
                required
                placeholder="丸の内1-1-1"
              />
            </FormSection>

            {/* 連絡先情報セクション */}
            <FormSection title="連絡先情報">
              <PhoneInput
                label="携帯電話番号"
                name="mobile"
                register={register}
                error={errors.mobile}
                required
                type="mobile"
              />
            </FormSection>

            {/* その他の情報セクション */}
            <FormSection title="その他の情報">
              <CheckboxGroup
                label="興味のある分野"
                name="interests"
                register={register}
                error={errors.interests}
                required
                options={interestOptions}
                columns={2}
                helpText="最大5つまで選択可能"
              />

              <TextArea
                label="メッセージ"
                name="message"
                register={register}
                error={errors.message}
                rows={4}
                placeholder="ご自由にご記入ください"
                helpText="500文字以内"
                maxLength={500}
              />
            </FormSection>

            {/* 同意事項 */}
            <FormSection title="同意事項">
              <Checkbox
                label="利用規約に同意します"
                name="agreeToTerms"
                register={register}
                error={errors.agreeToTerms}
                required
              />
            </FormSection>

            {/* 送信ボタン */}
            <div className="flex justify-center mt-8">
              <SubmitButton
                text="登録する"
                loadingText="送信中..."
                isSubmitting={isSubmitting}
              />
            </div>
          </form>
        </div>

        {/* 使い方説明 */}
        <div className="mt-8 bg-white shadow-lg rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            💡 このフォームの特徴
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✅ 再利用可能なコンポーネントで構築</li>
            <li>✅ Zodによる型安全な校験</li>
            <li>✅ 郵便番号から住所を自動入力</li>
            <li>✅ パスワード強度のリアルタイム表示</li>
            <li>✅ エラーメッセージの日本語化</li>
            <li>✅ レスポンシブデザイン対応</li>
            <li>✅ アクセシビリティ対応</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SimpleFormExample;