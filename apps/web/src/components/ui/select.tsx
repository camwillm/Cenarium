export const Select = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export const SelectTrigger = () => <div>Select Trigger</div>;
export const SelectValue = () => <div>Select Value</div>;
export const SelectContent = () => <div>Select Content</div>;
export const SelectItem = ({ children }) => <div>{children}</div>;
