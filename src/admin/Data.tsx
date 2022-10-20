import { FaTachometerAlt, FaCopy, FaChartPie, FaTree, FaEdit, FaPen } from 'react-icons/fa';
import { MdOutlineCircle } from 'react-icons/md';

export const AsideMenuItem = [
   {
      type: "item",
      text: "Dashboard",
      key: "Dashboard",
      icon: FaTachometerAlt
   }, {
      type: "subtype",
      text: "Application",
      key: "Application",
      icon: FaCopy,
      subMenuItem: [
         {
            type: "subitem",
            text: "Pending Approval",
            key: "Pending_Approval",
            icon: MdOutlineCircle
         }, {
            type: "subitem",
            text: "Accepted",
            key: "Accepted",
            icon: MdOutlineCircle
         }, {
            type: "subitem",
            text: "Rejected",
            key: "Rejected",
            icon: MdOutlineCircle
         }, {
            type: "subitem",
            text: "Draft",
            key: "Draft",
            icon: MdOutlineCircle
         }, {
            type: "subitem",
            text: "Trash",
            key: "Trash",
            icon: MdOutlineCircle
         }
      ]
   }, {
      type: "item",
      text: "User Management",
      key: "User_Management",
      icon: FaChartPie
   }, {
      type: "item",
      text: " Audit / Logs",
      key: " Audit_Logs",
      icon: FaTree
   }, {
      type: "subtype",
      text: "Setting",
      key: "Setting",
      icon: FaEdit,
      subMenuItem: [
         {
            type: "subitem",
            text: "Email Credentials",
            key: "Email_Credentials",
            icon: MdOutlineCircle
         }, {
            type: "subitem",
            text: "Rejected Email Template",
            key: "Rejected_Email_Template",
            icon: MdOutlineCircle
         }, {
            type: "subitem",
            text: "Accepted Email Template",
            key: "Accepted_Email_Template",
            icon: MdOutlineCircle
         }, {
            type: "subitem",
            text: "Signature",
            key: "Signature",
            icon: FaPen
         }
      ]
   }
]
