import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { 
  SidebarContainer, 
  SidebarLogo, 
  SidebarMenu, 
  SidebarMenuItem,
  UserContainer,
  UserIcon,
  UserName
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
  const handleUserClick = () => {
    console.log('Navegando para a página de perfil');
  };

  return (
    <SidebarContainer>
      <SidebarLogo>L3A</SidebarLogo>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.id} onClick={item.onClick}>
            {item.icon}
            {item.label}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <UserContainer onClick={handleUserClick}>
        <UserIcon>
          <FaUserCircle />
        </UserIcon>
        <UserName>Meu Perfil</UserName>
      </UserContainer>
    </SidebarContainer>
  );
};