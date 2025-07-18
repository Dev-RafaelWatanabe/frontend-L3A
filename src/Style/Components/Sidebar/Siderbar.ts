import styled from 'styled-components';

export const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color:rgba(8, 1, 104, 0.94);
  position: fixed;
  left: 0;
  top: 0;
  padding: 20px;
  color: #fff;
  transition: width 0.2s;

  @media (max-width: 1366px), (max-height: 768px) {
    width: 200px;
  }
`;

export const SidebarLogo = styled.div`
  margin-bottom: 30px;
  font-size: 24px;
  font-weight: bold;
`;

export const SidebarMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const SidebarMenuItem = styled.li`
  padding: 12px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;

  &:hover {
    color: #007bff;
  }

  
`;

export const UserContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const UserIcon = styled.div`
  font-size: 24px;
  display: flex;
  align-items: center;
`;

export const UserName = styled.span`
  font-size: 14px;
`;

export const SubMenu = styled.div`
  padding-left: 20px;
  background-color: rgba(255, 255, 255, 0.05);
`;