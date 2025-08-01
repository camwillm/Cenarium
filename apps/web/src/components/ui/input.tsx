interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ ...props }) => {
  return <input {...props} className="border px-3 py-2 rounded-md" />;
};
