import { forwardRef, useLayoutEffect, useRef } from "react";
import { fieldLabelStyle, fieldStyle } from "@/components/admin/adminStyles";

type AdminFieldTextareaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minRows?: number;
};

export const AdminFieldTextarea = forwardRef<HTMLTextAreaElement, AdminFieldTextareaProps>(function AdminFieldTextarea(
  { label, value, onChange, minRows = 2 },
  forwardedRef,
) {
  const innerRef = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    const element = innerRef.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.max(element.scrollHeight, minRows * 24 + 20)}px`;
  }, [minRows, value]);

  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={fieldLabelStyle}>{label}</span>
      <textarea
        ref={(node) => {
          innerRef.current = node;
          if (!forwardedRef) return;
          if (typeof forwardedRef === "function") {
            forwardedRef(node);
            return;
          }
          forwardedRef.current = node;
        }}
        value={value}
        rows={minRows}
        onChange={(event) => onChange(event.target.value)}
        style={{ ...fieldStyle, resize: "vertical", minHeight: minRows * 24 + 20 }}
      />
    </label>
  );
});
