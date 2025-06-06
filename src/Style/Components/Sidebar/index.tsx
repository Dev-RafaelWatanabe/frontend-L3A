import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { 
  SidebarContainer, 
  SidebarLogo, 
  SidebarMenu, 
  SidebarMenuItem,
  UserContainer,
  UserIcon,
  UserName,
  SubMenu
} from './Siderbar';

interface SubItem {
  id: string;
  label: string;
  path: string;
}

interface MenuItem {
  id: number;
  label: string;
  path?: string;
  subItems?: SubItem[];
}

interface SidebarProps {
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleItemClick = (item: MenuItem) => {
    if (item.subItems) {
      setOpenSubmenu(openSubmenu === item.id ? null : item.id);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <SidebarContainer>
      <SidebarLogo>L3A</SidebarLogo>
      <SidebarMenu>
        {items.map((item) => (
          <React.Fragment key={item.id}>
            <SidebarMenuItem onClick={() => handleItemClick(item)}>
              {item.label}
            </SidebarMenuItem>
            {item.subItems && openSubmenu === item.id && (
              <SubMenu>
                {item.subItems.map((subItem) => (
                  <SidebarMenuItem 
                    key={subItem.id}
                    onClick={() => navigate(subItem.path)}
                  >
                    {subItem.label}
                  </SidebarMenuItem>
                ))}
              </SubMenu>
            )}
          </React.Fragment>
        ))}
      </SidebarMenu>

      <UserContainer onClick={() => navigate('/profile')}>
        <UserIcon>
          <FaUserCircle />
        </UserIcon>
        <UserName>Meu Perfil</UserName>
      </UserContainer>
    </SidebarContainer>
  );
};