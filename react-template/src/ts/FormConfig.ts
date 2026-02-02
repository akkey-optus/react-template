import { type FormConfig } from "./Formtypes";
import {
        nameSchema,
        ageSchema,
        emailSchema,
} from './Zodschemas';

export const userFormConfig: FormConfig = {
        submitText: "提交",
        showReset: true,
        onSubmit: async (data) => console.log(data),

        fields: [
                {
                        type: "group",
                        name: "name",
                        label: "姓名",
                        validation: nameSchema, // ✅ 直接绑定整组校验
                        fields: [
                                { type: "text", name: "firstName", label: "名", required: true },
                                { type: "text", name: "lastName", label: "姓", required: true },
                        ],
                },

                {
                        type: "number",
                        name: "age",
                        label: "年龄",
                        validation: ageSchema, // ✅ 用已有 schema
                },

                {
                        type: "email",
                        name: "email",
                        label: "邮箱",
                        required: true,
                        validation: emailSchema,
                },
        ],
};