
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

//
// ✅ 1️⃣ Zod Schema
//
const schema = z.object({
  name: z.string().min(1, "姓名必填"),
  email: z.string().email("邮箱格式错误"),
  address: z.string().optional(),
  age: z
    .number({ invalid_type_error: "年龄必须是数字" })
    .min(0, "年龄不能小于0")
    .max(120, "你是吸血鬼吗"),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({ message: "请选择性别" })
  })
})

type FormData = z.infer<typeof schema>

//
// ✅ 2️⃣ 表单字段配置
//
const formConfig = [
  { name: "name", label: "姓名", type: "text", placeholder: "输入姓名" },
  { name: "email", label: "邮箱", type: "email", placeholder: "输入邮箱" },
  { name: "address", label: "地址", type: "text", placeholder: "输入地址" },
  { name: "age", label: "年龄", type: "number", placeholder: "输入年龄" },
  { name: "gender", label: "性别", type: "radio" }
] as const

//
// ✅ 3️⃣ 页面
//
export default function BigDynamicFormPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      address: "",
      age: 0,
      gender: undefined as unknown as "male" | "female"
    }
  })

  const onSubmit = (data: FormData) => {
    console.log("提交成功", data)
  }

  const handleReset = () => {
    reset({
      name: "",
      email: "",
      address: "",
      age: undefined as unknown as 1,
      gender: undefined as unknown as "male" | "female"
    })
  }

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>配置驱动大表单</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {formConfig.map(field => (
          <div key={field.name} style={{ marginBottom: 18 }}>
            <label style={{ display: "block", marginBottom: 4 }}>{field.label}</label>

            {/* 普通输入框 */}
            {field.type !== "radio" && (
              <input
                type={field.type}
                placeholder={field.placeholder}
                {...register(field.name as keyof FormData, {
                  valueAsNumber: field.type === "number"
                })}
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #ccc",
                  borderRadius: 4
                }}
              />
            )}

            {/* 性别单选 */}
            {field.type === "radio" && (
              <div>
                <label>
                  <input type="radio" value="male" {...register("gender")} /> 男
                </label>
                <label style={{ marginLeft: 12 }}>
                  <input type="radio" value="female" {...register("gender")} /> 女
                </label>
              </div>
            )}

            {errors[field.name as keyof FormData] && (
              <p style={{ color: "red", marginTop: 4 }}>
                {errors[field.name as keyof FormData]?.message as string}
              </p>
            )}
          </div>
        ))}

        <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
          isDirty: {isDirty ? "true" : "false"}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" onClick={handleReset} disabled={!isDirty}>
            清空
          </button>

          <button type="submit" disabled={!isValid || isSubmitting}>
            提交
          </button>
        </div>
      </form>
    </div>
  )
}