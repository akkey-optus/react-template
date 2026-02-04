// components/DynamicForm.tsx - 动态表单主组件

import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type FormConfig, type FormFieldConfig } from '../../ts/Formtypes'
import { DynamicFormField } from './Dynamicformfield';

interface DynamicFormProps {
        config: FormConfig;
}

/**
 * 从字段配置生成Zod Schema
 */
const generateSchema = (fields: FormFieldConfig[]) => {
        const schemaFields: Record<string, z.ZodType<any>> = {};

        fields.forEach((field) => {
                // 如果字段有自定义validation，使用自定义的
                if (field.validation) {
                        schemaFields[field.name] = field.validation;
                        return;
                }

                // 否则根据类型生成默认的validation
                let fieldSchema: z.ZodType<any>;

                switch (field.type) {
                        case 'email':
                                fieldSchema = z.string().email();
                                break;

                        case 'url':
                                fieldSchema = z.string().url('有効なURLを入力してください');
                                break;

                        case 'number':
                                fieldSchema = z.number();
                                if (field.min !== undefined) {
                                        fieldSchema = (fieldSchema as z.ZodNumber).min(field.min, `${field.min}以上の値を入力してください`);
                                }
                                if (field.max !== undefined) {
                                        fieldSchema = (fieldSchema as z.ZodNumber).max(field.max, `${field.max}以下の値を入力してください`);
                                }
                                break;

                        case 'checkbox':
                                if (field.validation) {
                                        fieldSchema = field.validation; // 用你 zodSchemas.ts 里的
                                } else if (field.multiple) {
                                        fieldSchema = z.array(z.string());
                                } else {
                                        fieldSchema = z.boolean();
                                }
                                break

                        case 'switch':
                                fieldSchema = z.boolean();
                                break;

                        case 'file':
                                fieldSchema = z.any(); // ファイルは特殊な処理が必要
                                break;

                        default:
                                fieldSchema = z.string();
                                if (field.maxLength) {
                                        fieldSchema = (fieldSchema as z.ZodString).max(
                                                field.maxLength,
                                                `${field.maxLength}文字以内で入力してください`
                                        );
                                }
                }

                // 必須チェック
                if (field.required) {
                        if (field.type === 'checkbox' && field.multiple) {
                                fieldSchema = (fieldSchema as z.ZodArray<any>).min(1, `${field.label}を選択してください`);
                        } else if (field.type === 'text' ||
                                field.type === 'textarea' ||
                                field.type === 'email' ||
                                field.type === 'password' ||
                                field.type === 'url' ||
                                field.type === 'tel' ||
                                field.type === 'date') {
                                fieldSchema = (fieldSchema as z.ZodString).min(1, `${field.label}を入力してください`);
                        }
                } else {
                        // 必須でない場合はoptional
                        if (field.type !== 'switch' && field.type !== 'checkbox') {
                                fieldSchema = fieldSchema.optional();
                        }
                }

                schemaFields[field.name] = fieldSchema;
        });

        return z.object(schemaFields);
};

/**
 * 動的フォームコンポーネント
 * 
 * 使用例：
 * <DynamicForm config={{
 *   fields: [...],
 *   onSubmit: (data) => console.log(data)
 * }} />
 */
export const DynamicForm: React.FC<DynamicFormProps> = ({ config }) => {
        // Zodスキーマを生成
        const schema = useMemo(() => generateSchema(config.fields), [config.fields]);

        // デフォルト値を設定
        const defaultValues = useMemo(() => {
                const values: Record<string, any> = {};
                config.fields.forEach((field) => {
                        if (field.defaultValue !== undefined) {
                                values[field.name] = field.defaultValue;
                        }
                });
                return values;
        }, [config.fields]);

        // React Hook Form の設定
        const {
                register,
                handleSubmit,
                formState: { errors, isSubmitting },
                reset,
                watch,
        } = useForm({
                resolver: zodResolver(schema),
                defaultValues
        });

        // 値が変更された時の処理
        const formValues = watch();
        React.useEffect(() => {
                if (config.onChange) {
                        config.onChange(formValues);
                }
        }, [formValues, config]);

        // 送信処理
        const onSubmit = async (data: any) => {
                try {
                        await config.onSubmit(data);
                } catch (error) {
                        console.error('Form submission error:', error);
                }
        };

        // リセット処理
        const handleReset = () => {
                console.log('フォームをリセットしました',config.fields);
                reset(defaultValues);
                console.log('フォームをリセットしました',config.fields);
        };

        // 条件付き表示のフィルタリング
        const visibleFields = config.fields.filter((field) => {
                if (field.showWhen) {
                        return field.showWhen(formValues);
                }
                return true;
        });

        // グリッドのカラム数
        const gridCols = config.columns || 1;
        const gridClassName = `grid grid-cols-1 ${gridCols === 2 ? 'md:grid-cols-2' :
                gridCols === 3 ? 'md:grid-cols-3' :
                        gridCols === 4 ? 'md:grid-cols-4' :
                                ''
                } gap-4`;

        return (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className={gridClassName}>
                                {visibleFields.map((field) => {
                                        // 個別のカラム数設定
                                        const colSpan = field.columns
                                                ? `md:col-span-${field.columns}`
                                                : '';

                                        return (
                                                <div key={field.name} className={colSpan}>
                                                        <DynamicFormField
                                                                config={field}
                                                                register={register}
                                                                errors={errors}
                                                                watch={watch}
                                                        />
                                                </div>
                                        );
                                })}
                        </div>

                        {/* ボタン群 */}
                        <div className="flex gap-4 justify-end pt-4 border-t">
                                {config.showReset && (
                                        <button
                                                type="button"
                                                onClick={handleReset}
                                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                        >
                                                {config.resetText || 'リセット'}
                                        </button>
                                )}

                                <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                        {isSubmitting ? '送信中...' : (config.submitText || '送信')}
                                </button>
                        </div>
                </form>
        );
};