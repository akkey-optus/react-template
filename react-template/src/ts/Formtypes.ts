import { z } from "zod";

/* =========================
   选项类型
========================= */
export interface FieldOption {
        label: string;
        value: string | number;
        disabled?: boolean;
}

/* =========================
   基础字段公共属性
========================= */
interface BaseField {
        name: string;                 // 字段key（唯一）
        label: string;                // 标签
        placeholder?: string;
        helpText?: string;
        required?: boolean;
        disabled?: boolean;
        defaultValue?: any;

        /** Zod校验规则 */
        validation?: z.ZodTypeAny;

        /** 条件显示 */
        dependsOn?: string;
        showWhen?: (values: any) => boolean;
}

/* =========================
   原子输入类字段
========================= */
export interface TextField extends BaseField {
        type: "text" | "email" | "tel" | "password" | "url";
        maxLength?: number;
}

export interface NumberField extends BaseField {
        type: "number";
        min?: number;
        max?: number;
        step?: number;
}

export interface DateField extends BaseField {
        type: "date";
}

export interface TextareaField extends BaseField {
        type: "textarea";
        rows?: number;
        maxLength?: number;
}

export interface SwitchField extends BaseField {
        type: "switch";
}

/* =========================
   选择类字段（必须有 options）
========================= */
export interface SelectField extends BaseField {
        type: "select";
        options: FieldOption[];
}

export interface RadioField extends BaseField {
        type: "radio";
        options: FieldOption[];
}

export interface CheckboxField extends BaseField {
        type: "checkbox";
        options: FieldOption[];
}

/* =========================
   文件上传
========================= */
export interface FileField extends BaseField {
        type: "file";
        accept?: string;
        multiple?: boolean;
}

/* =========================
   结构型字段（高级核心）
========================= */

/** 对象结构：姓名、地址这种 */
export interface GroupField extends BaseField {
        type: "group";
        fields: FormFieldConfig[]; // 子字段
}

/** 数组结构：多个经历、多个电话 */
export interface ArrayField extends BaseField {
        type: "array";
        item: FormFieldConfig;     // 每一项的字段结构
        minItems?: number;
        maxItems?: number;
}

/* =========================
   字段总类型（联合类型分发核心）
========================= */
export type FormFieldConfig =
        | TextField
        | NumberField
        | DateField
        | TextareaField
        | SwitchField
        | SelectField
        | RadioField
        | CheckboxField
        | FileField
        | GroupField
        | ArrayField;

/* =========================
   表单整体配置
========================= */
export interface FormConfig {
        fields: FormFieldConfig[];
        submitText?: string;
        resetText?: string;
        showReset?: boolean;
        onSubmit: (data: any) => void | Promise<void>;
        onChange?: (data: any) => void;
}