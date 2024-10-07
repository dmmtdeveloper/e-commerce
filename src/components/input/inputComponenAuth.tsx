import { InputProps } from "@/types/types";
import ErrorMessage from "../error-message-component/error-message";
import { FieldValue, FieldValues } from 'react-hook-form';

const InputComponentAuth = <TFieldValues extends FieldValues>({
  label,
  name,
  type,
  placeholder,
  register,
  error,
  FieldValue,  // Usar este campo de forma adecuada
}: InputProps<TFieldValues>) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={name} className="font-medium">
          {label}
        </label>
      )}
      <input
        id={name}
        value = {FieldValue}
        type={type}
        placeholder={placeholder}
        {...register}
        className={`${
          error
            ? "border border-slate-300 font-light py-2 px-4 w-full rounded-xl focus:outline-red-500"
            : "border border-slate-300 font-light py-2 px-4 w-full rounded-xl focus:outline-blue-400"
        }`}
      />
      {error && <ErrorMessage message={error.message} />}
    </div>
  );
};

export default InputComponentAuth;
