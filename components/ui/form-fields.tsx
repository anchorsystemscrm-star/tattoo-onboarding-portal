"use client";

import { useId } from "react";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import type { UploadedFileAsset } from "@/types/onboarding";

function FieldShell({
  label,
  error,
  helperText,
  required,
  htmlFor,
  labelId,
  children,
}: {
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  htmlFor?: string;
  labelId?: string;
  children: ReactNode;
}) {
  return (
    <div className="block space-y-2">
      <label
        htmlFor={htmlFor}
        id={labelId}
        className="flex items-center gap-2 text-sm font-medium text-slate-100"
      >
        {label}
        {required ? <span className="text-accent">*</span> : null}
      </label>
      {children}
      {error ? (
        <span className="block text-sm text-rose-300">{error}</span>
      ) : helperText ? (
        <span className="block text-sm text-slate-400">{helperText}</span>
      ) : null}
    </div>
  );
}

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
}

export function TextInput({
  label,
  value,
  onChange,
  error,
  helperText,
  className,
  required,
  ...props
}: TextInputProps) {
  const inputId = useId();

  return (
    <FieldShell
      label={label}
      error={error}
      helperText={helperText}
      required={required}
      htmlFor={inputId}
    >
      <input
        {...props}
        id={inputId}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className={`field-base ${className ?? ""}`}
      />
    </FieldShell>
  );
}

interface TextAreaFieldProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
}

export function TextAreaField({
  label,
  value,
  onChange,
  error,
  helperText,
  className,
  required,
  ...props
}: TextAreaFieldProps) {
  const textareaId = useId();

  return (
    <FieldShell
      label={label}
      error={error}
      helperText={helperText}
      required={required}
      htmlFor={textareaId}
    >
      <textarea
        {...props}
        id={textareaId}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className={`field-base min-h-[130px] resize-y ${className ?? ""}`}
      />
    </FieldShell>
  );
}

interface ChoiceCardGroupProps<T extends string> {
  label: string;
  options: readonly T[] | T[];
  value: T;
  onChange: (value: T) => void;
  error?: string;
  helperText?: string;
  columns?: string;
}

export function ChoiceCardGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  columns = "grid-cols-1 sm:grid-cols-2",
}: ChoiceCardGroupProps<T>) {
  const labelId = useId();

  return (
    <FieldShell label={label} error={error} helperText={helperText} labelId={labelId}>
      <div className={`grid gap-3 ${columns}`} role="radiogroup" aria-labelledby={labelId}>
        {options.map((option) => {
          const selected = option === value;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              role="radio"
              aria-checked={selected}
              className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
                selected
                  ? "border-accent bg-accentSoft text-white shadow-glow"
                  : "border-line bg-white/[0.03] text-slate-300 hover:border-slate-500 hover:text-white"
              }`}
              aria-pressed={selected}
            >
              {option}
            </button>
          );
        })}
      </div>
    </FieldShell>
  );
}

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
}

export function ColorField({ label, value, onChange, helperText }: ColorFieldProps) {
  const textId = useId();

  return (
    <FieldShell label={label} helperText={helperText} htmlFor={textId}>
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-white/[0.03] px-3 py-3">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-16 cursor-pointer rounded-xl border border-white/10 bg-transparent"
          aria-label={label}
        />
        <input
          id={textId}
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="field-base border-0 bg-transparent px-0 py-0"
          placeholder="#10213d"
        />
      </div>
    </FieldShell>
  );
}

interface FileUploadFieldProps {
  label: string;
  files: UploadedFileAsset[] | UploadedFileAsset | null;
  onChange: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  helperText?: string;
}

export function FileUploadField({
  label,
  files,
  onChange,
  accept,
  multiple,
  helperText,
}: FileUploadFieldProps) {
  const inputId = useId();
  const entries = Array.isArray(files) ? files : files ? [files] : [];

  return (
    <FieldShell label={label} helperText={helperText} htmlFor={inputId}>
      <div className="rounded-2xl border border-dashed border-line bg-white/[0.03] p-4">
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(event) => onChange(event.target.files)}
          className="block w-full cursor-pointer text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#08111f] hover:file:opacity-90"
        />
        {entries.length > 0 ? (
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            {entries.map((file) => (
              <li
                key={`${file.name}-${file.lastModified}`}
                className="rounded-2xl border border-white/10 bg-black/10 px-3 py-2"
              >
                <span className="font-medium text-white">{file.name}</span>
                <span className="ml-2 text-slate-400">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </FieldShell>
  );
}
