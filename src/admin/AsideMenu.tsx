import React, { useState } from 'react';
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarContent,
} from 'react-pro-sidebar';
import { FaTachometerAlt, FaCopy, FaChartPie, FaTree, FaEdit, FaPen } from 'react-icons/fa';
import "../Styles/Admin/AsideMenu.scss"
import 'react-pro-sidebar/dist/css/styles.css';
import GuardianLogo from '/assets/img/guardian_logo1.png';
import { AsideMenuItem } from "./Data"
import { useNavigate } from 'react-router-dom';


interface AsideMenuProps {
  collapsed: boolean,
  toggled: boolean,
  handleToggleSidebar: any
}

const AsideMenu = ({ collapsed, toggled, handleToggleSidebar }: AsideMenuProps) => {
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  const [activeSubMenuTab, setActiveSubMenuTab] = useState<string>("");
  const navigate = useNavigate();

  const handleActiveTab = (activeTab: string) => {
    if (activeTab !== "") {
      setActiveTab(activeTab)
      setActiveSubMenuTab("")
      if (activeTab === "Pending_Approval") {
        navigate("/admin/pending-application")
      } else if (activeTab === "Accepted") {
        navigate("/admin/accepted-application")
      } else if (activeTab === "Rejected") {
        navigate("/admin/rejected-application")
      } else if (activeTab === "Draft") {
        navigate("/admin/Draft-application")
      } else if (activeTab === "Trash") {
        navigate("/admin/trash-application")
      } else if(activeTab === "User_Management"){
        navigate("/admin/userlist")
      } else if(activeTab === "Email_Credentials"){
        navigate("/admin/email-credentials")
      } else if(activeTab === "Rejected_Email_Template"){
        navigate("/admin/email-template-rejected")
      } else if(activeTab === "Accepted_Email_Template"){
        navigate("/admin/email-template-accepted")
      } else {
        navigate("/admin/dashboard")
      }
    }
  }

  const handleSubMenuActiveTab = (subMenuActiveTab: string) => {
    if (subMenuActiveTab !== "") {
      setActiveSubMenuTab(subMenuActiveTab)

    }
  }

  return (
    <>
      <ProSidebar
        image={""}
        rtl={false}
        collapsed={collapsed}
        toggled={toggled}
        breakPoint="md"
        onToggle={handleToggleSidebar}
      >
        <SidebarHeader>
          <div className="brand-link text-center my-2 py-2" style={{ height: "auto !important" }}>
            <img src={GuardianLogo} height="" alt="AdminLTE Logo"
              style={{ opacity: 1, width: "28%" }} />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <Menu iconShape="square">
            {AsideMenuItem.map((aside, index) =>
            (
              <div key={aside.key}>
                {
                  aside.type === "item" ? <MenuItem
                    icon={<aside.icon style={{ fontSize: "1.1rem", color: "#c2c7d0" }} />}
                    active={activeTab === aside.key ? true : false}
                    onClick={() => handleActiveTab(aside.key)}
                  // suffix={<span className="badge red">NEW</span>}
                  >
                    {aside.text}
                  </MenuItem> : aside.type === "subtype" && <SubMenu
                    // suffix={<span className="badge yellow">3</span>}
                    title={aside.text}
                    // className={`${activeSubMenuTab === aside.key && "subMenuActive"}`}
                    icon={<span className={`${activeSubMenuTab === aside.key ? "icon-color" : 'icon-color-aside'}`}> <aside.icon style={{ fontSize: "1.1rem", color: "#c2c7d0" }} /> </span>}
                    onClick={() => handleSubMenuActiveTab(aside.key)}
                  >
                    {
                      aside.subMenuItem!.map((subtype, index) => (
                        <MenuItem key={subtype.key}
                          onClick={() => handleActiveTab(subtype.key)}
                          active={activeTab === subtype.key ? true : false}
                          icon={<span className={`${activeTab === subtype.key ? 'icon-color-submenu-active' : 'icon-color-submenu'}`}><subtype.icon style={{ fontSize: "1.1rem", color: "#c2c7d0" }} /></span>} >{subtype.text}</MenuItem>
                      ))
                    }
                  </SubMenu>
                }
              </div>
            )
            )}
          </Menu>
        </SidebarContent>
      </ProSidebar>
    </>
  );
};

export default AsideMenu;