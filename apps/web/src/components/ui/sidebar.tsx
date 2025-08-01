export const Sidebar = ({ children }) => <aside>{children}</aside>;
export const SidebarContent = ({ children }) => <div>{children}</div>;
export const SidebarGroup = ({ children }) => <div className="sidebar-group">{children}</div>;
export const SidebarGroupContent = ({ children }) => <div>{children}</div>;
export const SidebarMenu = ({ children }) => <nav>{children}</nav>;
export const SidebarMenuButton = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);
export const SidebarMenuItem = ({ icon, label }) => (
  <div className="sidebar-item">
    {icon && <span className="icon">{icon}</span>}
    {label}
  </div>
);
export const SidebarHeader = ({ children }) => <header>{children}</header>;
export const SidebarFooter = ({ children }) => <footer>{children}</footer>;
export const SidebarProvider = ({ children }) => <div className="sidebar-provider">{children}</div>;
export const SidebarTrigger = ({ onClick }) => <button onClick={onClick}>Toggle</button>;
