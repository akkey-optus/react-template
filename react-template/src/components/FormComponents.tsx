// FormComponents.tsx - 再利用可能なフォームコンポーネント集

import React from 'react';
import {type UseFormRegister,type FieldError } from 'react-hook-form';

/**
 * ========================================
 * 共通Props型定義
 * ========================================
 */

interface BaseInputProps {
  label: string;
  name: string;
  error?: FieldError;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
}

/**
 * ========================================
 * テキスト入力コンポーネント
 * ========================================
 */

interface TextInputProps extends BaseInputProps {
  register: UseFormRegister<any>;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'date';
  maxLength?: number;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  register,
  error,
  required = false,
  type = 'text',
  placeholder,
  helpText,
  maxLength,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...register(name)}
        type={type}
        maxLength={maxLength}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={placeholder}
      />
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};

/**
 * ========================================
 * 郵便番号入力コンポーネント（検索ボタン付き）
 * ========================================
 */

interface PostalCodeInputProps extends BaseInputProps {
  register: UseFormRegister<any>;
  onSearch: () => void;
  isSearching?: boolean;
}

export const PostalCodeInput: React.FC<PostalCodeInputProps> = ({
  label,
  name,
  register,
  error,
  required = false,
  onSearch,
  isSearching = false,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex gap-2">
        <input
          {...register(name)}
          type="text"
          maxLength={8}
          className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="123-4567"
        />
        <button
          type="button"
          onClick={onSearch}
          disabled={isSearching}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
        >
          {isSearching ? '検索中...' : '住所検索'}
        </button>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        ハイフン付きで入力してください（例：123-4567）
      </p>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};

/**
 * ========================================
 * 電話番号入力コンポーネント
 * ========================================
 */

interface PhoneInputProps extends BaseInputProps {
  register: UseFormRegister<any>;
  type: 'tel' | 'mobile';
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  name,
  register,
  error,
  required = false,
  type,
}) => {
  const placeholder = type === 'mobile' ? '09012345678' : '0312345678';
  const maxLength = type === 'mobile' ? 11 : 11;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...register(name)}
        type="tel"
        maxLength={maxLength}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={placeholder}
      />
      <p className="mt-1 text-xs text-gray-500">
        ハイフンなしで入力してください
      </p>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};

/**
 * ========================================
 * セレクトボックスコンポーネント
 * ========================================
 */

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps extends BaseInputProps {
  register: UseFormRegister<any>;
  options: SelectOption[];
  defaultOption?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  name,
  register,
  error,
  required = false,
  options,
  defaultOption = '選択してください',
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        {...register(name)}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">{defaultOption}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};

/**
 * ========================================
 * 都道府県セレクトコンポーネント
 * ========================================
 */

interface PrefectureSelectProps extends Omit<BaseInputProps, 'placeholder'> {
  register: UseFormRegister<any>;
}

const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];

export const PrefectureSelect: React.FC<PrefectureSelectProps> = ({
  label = '都道府県',
  name,
  register,
  error,
  required = false,
}) => {
  const options = PREFECTURES.map(pref => ({ value: pref, label: pref }));
  
  return (
    <SelectInput
      label={label}
      name={name}
      register={register}
      error={error}
      required={required}
      options={options}
    />
  );
};

/**
 * ========================================
 * ラジオボタングループコンポーネント
 * ========================================
 */

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps extends Omit<BaseInputProps, 'placeholder'> {
  register: UseFormRegister<any>;
  options: RadioOption[];
  inline?: boolean;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  register,
  error,
  required = false,
  options,
  inline = true,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={inline ? 'flex gap-6' : 'space-y-2'}>
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center">
            <input
              {...register(name)}
              type="radio"
              value={option.value}
              className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-2">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};

/**
 * ========================================
 * チェックボックスグループコンポーネント
 * ========================================
 */

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupProps extends Omit<BaseInputProps, 'placeholder'> {
  register: UseFormRegister<any>;
  options: CheckboxOption[];
  columns?: number;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  name,
  register,
  error,
  required = false,
  options,
  helpText,
  columns = 2,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={`grid grid-cols-${columns} gap-2`}>
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center">
            <input
              {...register(name)}
              type="checkbox"
              value={option.value}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm">{option.label}</span>
          </label>
        ))}
      </div>
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};

/**
 * ========================================
 * テキストエリアコンポーネント
 * ========================================
 */

interface TextAreaProps extends BaseInputProps {
  register: UseFormRegister<any>;
  rows?: number;
  maxLength?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  name,
  register,
  error,
  required = false,
  placeholder,
  helpText,
  rows = 4,
  maxLength,
}) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        {...register(name)}
        rows={rows}
        maxLength={maxLength}
        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        placeholder={placeholder}
      />
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};

/**
 * ========================================
 * チェックボックス（単一）コンポーネント
 * ========================================
 */

interface CheckboxProps extends Omit<BaseInputProps, 'placeholder'> {
  register: UseFormRegister<any>;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  name,
  register,
  error,
  required = false,
}) => {
  return (
    <div className="mb-4">
      <label className="inline-flex items-start">
        <input
          {...register(name)}
          type="checkbox"
          className="w-4 h-4 mt-1 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <span className="ml-2 text-sm">
          {label} {required && <span className="text-red-500">*</span>}
        </span>
      </label>
      {error && (
        <p className="mt-1 ml-6 text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};

/**
 * ========================================
 * パスワード入力コンポーネント（強度表示付き）
 * ========================================
 */

import { useState } from 'react';
import { getPasswordStrength, getPasswordStrengthLabel } from '../ts/Validationutils';

interface PasswordInputProps extends BaseInputProps {
  register: UseFormRegister<any>;
  showStrength?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  name,
  register,
  error,
  required = false,
  showStrength = true,
  placeholder,
  helpText,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const strength = showStrength ? getPasswordStrength(password) : 0;
  const strengthLabel = getPasswordStrengthLabel(strength);
  
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-green-500'
  ];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          {...register(name)}
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setPassword(e.target.value)}
          className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>
      
      {showStrength && password && (
        <div className="mt-2">
          <div className="flex gap-1 mb-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded ${
                  level <= strength ? strengthColors[strength] : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-600">
            強度: <span className="font-medium">{strengthLabel}</span>
          </p>
        </div>
      )}
      
      {helpText && !error && (
        <p className="mt-1 text-xs text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error.message}</p>
      )}
    </div>
  );
};

/**
 * ========================================
 * 送信ボタンコンポーネント
 * ========================================
 */

interface SubmitButtonProps {
  text?: string;
  loadingText?: string;
  isSubmitting?: boolean;
  fullWidth?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  text = '送信',
  loadingText = '送信中...',
  isSubmitting = false,
  fullWidth = false,
}) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`${fullWidth ? 'w-full' : 'px-8'} py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isSubmitting ? loadingText : text}
    </button>
  );
};

/**
 * ========================================
 * フォームセクションコンポーネント
 * ========================================
 */

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children }) => {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-blue-500">
        {title}
      </h2>
      {children}
    </section>
  );
};