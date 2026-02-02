// components/DynamicFormField.tsx - 动态表单字段渲染器

import React from 'react';
import { type UseFormRegister, type FieldErrors } from 'react-hook-form';
import { type FormFieldConfig } from '../../ts/Formtypes';

interface DynamicFormFieldProps {
        config: FormFieldConfig;
        register: UseFormRegister<any>;
        errors: FieldErrors;
        watch?: any;
}

/**
 * 获取错误消息
 */
const getErrorMessage = (errors: FieldErrors, name: string): string | undefined => {
        const error = errors[name];
        if (!error) return undefined;
        if (typeof error.message === 'string') return error.message;
        return undefined;
};

/**
 * 动态表单字段组件
 * 根据配置自动渲染对应的字段类型
 */
export const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
        config,
        register,
        errors,
}) => {
        const error = getErrorMessage(errors, config.name);
        const hasError = !!error;

        // 基础CSS类
        const inputClassName = `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${hasError ? 'border-red-500' : 'border-gray-300'
                }`;

        // 根据类型渲染不同的字段
        const renderField = () => {
                switch (config.type) {
                        // ========== 文本输入 ==========
                        case 'text':
                        case 'email':
                        case 'tel':
                        case 'url':
                        case 'password':
                                return (
                                        <input
                                                {...register(config.name)}
                                                type={config.type}
                                                placeholder={config.placeholder}
                                                disabled={config.disabled}
                                                maxLength={config.maxLength}
                                                className={inputClassName}
                                        />
                                );

                        // ========== 数字输入 ==========
                        case 'number':
                                return (
                                        <input
                                                {...register(config.name, { valueAsNumber: true })}
                                                type="number"
                                                placeholder={config.placeholder}
                                                disabled={config.disabled}
                                                min={config.min}
                                                max={config.max}
                                                step={config.step}
                                                className={inputClassName}
                                        />
                                );

                        // ========== 日期输入 ==========
                        case 'date':
                                return (
                                        <input
                                                {...register(config.name)}
                                                type="date"
                                                disabled={config.disabled}
                                                className={inputClassName}
                                        />
                                );

                        // ========== 多行文本 ==========
                        case 'textarea':
                                return (
                                        <textarea
                                                {...register(config.name)}
                                                placeholder={config.placeholder}
                                                disabled={config.disabled}
                                                rows={config.rows || 4}
                                                maxLength={config.maxLength}
                                                className={inputClassName}
                                        />
                                );

                        // ========== 下拉选择 ==========
                        case 'select':
                                return (
                                        <select
                                                {...register(config.name)}
                                                disabled={config.disabled}
                                                className={inputClassName}
                                        >
                                                <option value="">選択してください</option>
                                                {config.options?.map((option) => (
                                                        <option
                                                                key={option.value}
                                                                value={option.value}
                                                                disabled={option.disabled}
                                                        >
                                                                {option.label}
                                                        </option>
                                                ))}
                                        </select>
                                );

                        // ========== 单选按钮 ==========
                        case 'radio':
                                return (
                                        <div className="flex flex-wrap gap-4">
                                                {config.options?.map((option) => (
                                                        <label
                                                                key={option.value}
                                                                className="inline-flex items-center cursor-pointer"
                                                        >
                                                                <input
                                                                        {...register(config.name)}
                                                                        type="radio"
                                                                        value={option.value}
                                                                        disabled={config.disabled || option.disabled}
                                                                        className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                                                                />
                                                                <span className="ml-2">{option.label}</span>
                                                        </label>
                                                ))}
                                        </div>
                                );

                        // ========== 多选框 ==========
                        case 'checkbox':
                                return (
                                        <div className="flex flex-wrap gap-4">
                                                {config.options?.map((option) => (
                                                        <label
                                                                key={option.value}
                                                                className="inline-flex items-center cursor-pointer"
                                                        >
                                                                <input
                                                                        {...register(config.name)}
                                                                        type="checkbox"
                                                                        value={option.value}
                                                                        disabled={config.disabled || option.disabled}
                                                                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                                                                />
                                                                <span className="ml-2">{option.label}</span>
                                                        </label>
                                                ))}
                                        </div>
                                );

                        // ========== 开关 ==========
                        case 'switch':
                                return (
                                        <label className="inline-flex items-center cursor-pointer">
                                                <input
                                                        {...register(config.name)}
                                                        type="checkbox"
                                                        disabled={config.disabled}
                                                        className="sr-only peer"
                                                />
                                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                <span className="ms-3 text-sm font-medium text-gray-900">
                                                        {config.label}
                                                </span>
                                        </label>
                                );

                        // ========== 文件上传 ==========
                        case 'file':
                                return (
                                        <input
                                                {...register(config.name)}
                                                type="file"
                                                accept={config.accept}
                                                multiple={config.multiple}
                                                disabled={config.disabled}
                                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                                        />
                                );

                        default:
                                return <div>Unknown field type: {config.type}</div>;
                }
        };

        // 如果是switch类型，不需要额外的label包裹
        if (config.type === 'switch') {
                return (
                        <div className={`mb-4 ${config.className || ''}`}>
                                {renderField()}
                                {config.helpText && !error && (
                                        <p className="mt-1 text-xs text-gray-500">{config.helpText}</p>
                                )}
                                {error && (
                                        <p className="mt-1 text-sm text-red-500">{error}</p>
                                )}
                        </div>
                );
        }

        // 其他类型的标准布局
        return (
                <div className={`mb-4 ${config.className || ''}`}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                {config.label}
                                {config.required && <span className="text-red-500 ml-1">*</span>}
                        </label>

                        {renderField()}

                        {config.helpText && !error && (
                                <p className="mt-1 text-xs text-gray-500">{config.helpText}</p>
                        )}

                        {error && (
                                <p className="mt-1 text-sm text-red-500">{error}</p>
                        )}
                </div>
        );
};