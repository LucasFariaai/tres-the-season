import type { HTMLInputTypeAttribute } from "react";
import { fieldLabelStyle, fieldStyle } from "@/components/admin/adminStyles";

type AdminFieldInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  list?: string;
  placeholder?: string;
};

export function AdminFieldInput({ label, value, onChange, type = "text", list, placeholder }: AdminFieldInputProps) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={fieldLabelStyle}>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={fieldStyle}
        list={list}
        placeholder={placeholder}
      />
    </label>
  );
}
