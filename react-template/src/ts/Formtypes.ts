// types/formTypes.ts - 表单字段类型定义

import { z } from 'zod';

/**
 * 表单字段的基础类型
 */
export type FieldType = 
  | 'text'           // 文本输入
  | 'textarea'       // 多行文本
  | 'number'         // 数字输入
  | 'email'          // 邮箱
  | 'tel'            // 电话
  | 'date'           // 日期
  | 'select'         // 单选下拉
  | 'radio'          // 单选按钮
  | 'checkbox'       // 多选框
  | 'switch'         // 开关
  | 'file'           // 文件上传
  | 'password'       // 密码
  | 'url';           // URL

/**
 * 选项类型（用于select、radio、checkbox）
 */
export interface FieldOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

/**
 * 表单字段配置
 */
export interface FormFieldConfig {
  // 基础属性
  name: string;                    // 字段名称（唯一标识）
  type: FieldType;                 // 字段类型
  label: string;                   // 显示标签
  
  // 可选属性
  placeholder?: string;            // 占位符
  helpText?: string;               // 帮助文本
  required?: boolean;              // 是否必填
  disabled?: boolean;              // 是否禁用
  defaultValue?: any;              // 默认值
  
  // 选项（用于select、radio、checkbox）
  options?: FieldOption[];         // 选项列表
  
  // 布局
  columns?: number;                // 占据的列数（1-12，基于栅格系统）
  className?: string;              // 自定义CSS类
  
  // 校验规则
  validation?: z.ZodType<any>;     // Zod校验规则
  
  // 条件显示
  dependsOn?: string;              // 依赖的字段名
  showWhen?: (formValues: any) => boolean;  // 显示条件函数
  
  // 特殊配置
  rows?: number;                   // textarea的行数
  accept?: string;                 // file的接受类型
  multiple?: boolean;              // checkbox、file的多选
  min?: number;                    // number的最小值
  max?: number;                    // number的最大值
  step?: number;                   // number的步长
  maxLength?: number;              // text的最大长度
}

/**
 * 表单配置
 */
export interface FormConfig {
  fields: FormFieldConfig[];       // 字段列表
  submitText?: string;             // 提交按钮文本
  resetText?: string;              // 重置按钮文本
  showReset?: boolean;             // 是否显示重置按钮
  columns?: number;                // 表单列数（默认1）
  onSubmit: (data: any) => void | Promise<void>;  // 提交回调
  onChange?: (data: any) => void;  // 值变化回调
}

/**无影响
 * 表单数据示例（配置对象数组）
 */
export const exampleFormConfig: FormFieldConfig[] = [
  {
    name: 'username',
    type: 'text',
    label: 'ユーザー名',
    placeholder: 'ユーザー名を入力',
    required: true,
    validation: z.string().min(3, '3文字以上で入力してください'),
    columns: 6,
  },
  {
    name: 'email',
    type: 'email',
    label: 'メールアドレス',
    required: true,
    validation: z.string().email('有効なメールアドレスを入力してください'),
    columns: 6,
  },
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
  },
  {
    name: 'interests',
    type: 'checkbox',
    label: '興味のある分野',
    options: [
      { label: 'IT', value: 'it' },
      { label: 'ビジネス', value: 'business' },
      { label: '金融', value: 'finance' },
    ],
    multiple: true,
  },
  {
    name: 'country',
    type: 'select',
    label: '国',
    required: true,
    options: [
      { label: '日本', value: 'jp' },
      { label: 'アメリカ', value: 'us' },
      { label: '中国', value: 'cn' },
    ],
  },
  {
    name: 'bio',
    type: 'textarea',
    label: '自己紹介',
    rows: 4,
    maxLength: 500,
  },
  {
    name: 'avatar',
    type: 'file',
    label: 'プロフィール画像',
    accept: 'image/*',
  },
  {
    name: 'newsletter',
    type: 'switch',
    label: 'メールマガジンを受け取る',
    defaultValue: false,
  },
];