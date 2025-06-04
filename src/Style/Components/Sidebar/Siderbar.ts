import styled from 'styled-components';

export const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color:rgb(25, 13, 194);
  position: fixed;
  left: 0;
  top: 0;
  padding: 20px;
  color: #fff;
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