// examples/DynamicFormExample.tsx - 动态表单使用示例

import React from 'react';
import { DynamicForm } from './form/Dynamicform';
import { type FormConfig, type FormFieldConfig } from '../ts/Formtypes';
import { z } from 'zod';

/**
 * 示例1: 简单的联系表单
 */
export const ContactFormExample: React.FC = () => {
        const config: FormConfig = {
                fields: [
                        {
                                name: 'name',
                                type: 'text',
                                label: 'お名前',
                                placeholder: '山田太郎',
                                required: true,
                                columns: 6,
                        },
                        {
                                name: 'email',
                                type: 'email',
                                label: 'メールアドレス',
                                placeholder: 'example@example.com',
                                required: true,
                                columns: 6,
                        },
                        {
                                name: 'phone',
                                type: 'tel',
                                label: '電話番号',
                                placeholder: '090-1234-5678',
                                helpText: 'ハイフン付きで入力してください',
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
                        console.log('Contact form data:', data);
                        alert('お問い合わせを送信しました！');
                },
        };

        return (
                <div className="max-w-2xl mx-auto p-8">
                        <h1 className="text-2xl font-bold mb-6">お問い合わせフォーム</h1>
                        <DynamicForm config={config} />
                </div>
        );
};

/**
 * 示例2: 用户注册表单（带条件显示）
 */
export const RegistrationFormExample: React.FC = () => {
        const config: FormConfig = {
                columns: 2,
                fields: [
                        {
                                name: 'username',
                                type: 'text',
                                label: 'ユーザー名',
                                required: true,
                                validation: z.string().min(3, '3文字以上で入力してください'),
                                columns: 2,
                        },
                        {
                                name: 'email',
                                type: 'email',
                                label: 'メールアドレス',
                                required: true,
                                columns: 1,
                        },
                        {
                                name: 'password',
                                type: 'password',
                                label: 'パスワード',
                                required: true,
                                validation: z.string().min(8, '8文字以上で入力してください'),
                                columns: 1,
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
                                columns: 2,
                        },
                        {
                                name: 'age',
                                type: 'number',
                                label: '年齢',
                                required: true,
                                min: 18,
                                max: 120,
                                columns: 1,
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
                                        { label: 'その他', value: 'other' },
                                ],
                                columns: 1,
                        },
                        // 条件付き表示：国が「その他」の場合のみ表示
                        {
                                name: 'otherCountry',
                                type: 'text',
                                label: '国名を入力',
                                showWhen: (values) => values.country === 'other',
                                columns: 2,
                        },
                        {
                                name: 'interests',
                                type: 'checkbox',
                                label: '興味のある分野',
                                options: [
                                        { label: 'IT・テクノロジー', value: 'tech' },
                                        { label: 'ビジネス', value: 'business' },
                                        { label: '金融', value: 'finance' },
                                        { label: '医療', value: 'medical' },
                                ],
                                multiple: true,
                                columns: 2,
                        },
                        {
                                name: 'bio',
                                type: 'textarea',
                                label: '自己紹介',
                                rows: 4,
                                maxLength: 500,
                                helpText: '500文字以内',
                                columns: 2,
                        },
                        {
                                name: 'newsletter',
                                type: 'switch',
                                label: 'メールマガジンを受け取る',
                                defaultValue: true,
                                columns: 2,
                        },
                ],
                submitText: '登録',
                showReset: true,
                resetText: 'クリア',
                onSubmit: async (data) => {
                        console.log('Registration data:', data);
                        // API呼び出し
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        alert('登録が完了しました！');
                },
        };

        return (
                <div className="max-w-4xl mx-auto p-8">
                        <h1 className="text-2xl font-bold mb-6">会員登録</h1>
                        <div className="bg-white shadow-lg rounded-lg p-6">
                                <DynamicForm config={config} />
                        </div>
                </div>
        );
};

/**
 * 示例3: 调查问卷（从数据生成）
 */
export const SurveyFormExample: React.FC = () => {
        // 从后端API获取的问卷数据
        const surveyData = {
                title: '顧客満足度調査',
                questions: [
                        {
                                id: 'q1',
                                question: '当社のサービスに満足していますか？',
                                type: 'radio',
                                options: ['非常に満足', '満足', '普通', '不満', '非常に不満'],
                                required: true,
                        },
                        {
                                id: 'q2',
                                question: 'どの機能を最もよく使いますか？',
                                type: 'checkbox',
                                options: ['機能A', '機能B', '機能C', '機能D'],
                                required: true,
                        },
                        {
                                id: 'q3',
                                question: '改善してほしい点があれば教えてください',
                                type: 'textarea',
                                required: false,
                        },
                ],
        };

        // 动态生成字段配置
        const fields: FormFieldConfig[] = surveyData.questions.map((q) => {
                const baseField: FormFieldConfig = {
                        name: q.id,
                        label: q.question,
                        required: q.required,
                        type: q.type as any,
                };

                if (q.type === 'radio' || q.type === 'checkbox') {
                        baseField.options = q.options!.map((opt, idx) => ({
                                label: opt,
                                value: `option_${idx}`,
                        }));
                        if (q.type === 'checkbox') {
                                baseField.multiple = true;
                        }
                }

                if (q.type === 'textarea') {
                        baseField.rows = 4;
                }

                return baseField;
        });

        const config: FormConfig = {
                fields,
                submitText: '送信',
                onSubmit: async (data) => {
                        console.log('Survey data:', data);
                        alert('ご回答ありがとうございました！');
                },
        };

        return (
                <div className="max-w-2xl mx-auto p-8">
                        <h1 className="text-2xl font-bold mb-6">{surveyData.title}</h1>
                        <div className="bg-white shadow-lg rounded-lg p-6">
                                <DynamicForm config={config} />
                        </div>
                </div>
        );
};

/**
 * 示例4: 日本特有的表单
 */
export const JapaneseFormExample: React.FC = () => {
        const config: FormConfig = {
                columns: 2,
                fields: [
                        {
                                name: 'lastName',
                                type: 'text',
                                label: '姓',
                                required: true,
                        },
                        {
                                name: 'firstName',
                                type: 'text',
                                label: '名',
                                required: true,
                        },
                        {
                                name: 'lastNameKana',
                                type: 'text',
                                label: 'セイ',
                                required: true,
                                validation: z.string().regex(/^[ァ-ヶー\s]+$/, 'カタカナで入力してください'),
                        },
                        {
                                name: 'firstNameKana',
                                type: 'text',
                                label: 'メイ',
                                required: true,
                                validation: z.string().regex(/^[ァ-ヶー\s]+$/, 'カタカナで入力してください'),
                        },
                        {
                                name: 'postalCode',
                                type: 'text',
                                label: '郵便番号',
                                placeholder: '123-4567',
                                required: true,
                                validation: z.string().regex(/^\d{3}-\d{4}$/, '000-0000の形式で入力してください'),
                        },
                        {
                                name: 'prefecture',
                                type: 'select',
                                label: '都道府県',
                                required: true,
                                options: [
                                        { label: '東京都', value: 'tokyo' },
                                        { label: '大阪府', value: 'osaka' },
                                        { label: '神奈川県', value: 'kanagawa' },
                                        // ... 他の都道府県
                                ],
                        },
                        {
                                name: 'city',
                                type: 'text',
                                label: '市区町村',
                                required: true,
                        },
                        {
                                name: 'address',
                                type: 'text',
                                label: '町名・番地',
                                required: true,
                        },
                        {
                                name: 'mobile',
                                type: 'tel',
                                label: '携帯電話番号',
                                placeholder: '090-1234-5678',
                                required: true,
                                validation: z.string().regex(/^0[789]0-\d{4}-\d{4}$/, '携帯電話番号の形式が正しくありません'),
                        },
                ],
                submitText: '登録',
                showReset: true,
                onSubmit: async (data) => {
                        console.log('Japanese form data:', data);
                        alert('登録完了！');
                },
        };

        return (
                <div className="max-w-4xl mx-auto p-8">
                        <h1 className="text-2xl font-bold mb-6">会員登録フォーム</h1>
                        <div className="bg-white shadow-lg rounded-lg p-6">
                                <DynamicForm config={config} />
                        </div>
                </div>
        );
};
export default JapaneseFormExample;