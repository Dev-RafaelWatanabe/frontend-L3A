import React from 'react';
import { 
  SidebarContainer, 
  SidebarLogo, 
  SidebarMenu, 
  SidebarMenuItem 
} from './Siderbar';

interface SidebarProps {
  items?: Array<{
    id: number;
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
  }>;
}

export const Sidebar: React.FC<SidebarProps> = ({ items = [] }) => {
  return (
    <SidebarContainer>
      <SidebarLogo>Logo</SidebarLogo>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.id} onClick={item.onClick}>
            {item.icon}
            {item.label}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarContainer>
  );
};