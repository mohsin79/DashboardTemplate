import {FaPhoneAlt, FaMapMarkerAlt,FaEnvelope} from "react-icons/fa"

export const Navigation = [
  { id: 1, text: 'HOME', reference: "#" },
  { id: 2, text: 'ABOUT US', reference: "#" },
  { id: 3, text: 'SERVICES', reference: "#" },
  { id: 4, text: 'PLATFORMS', reference: "#" },
  { id: 5, text: 'PRICING', reference: "#" },
  { id: 6, text: 'CONTACT US', reference: "#" },
];

export const AdminNavigation = [
  { id: 1, text: 'Dashboard', reference: "/admin/dashboard", dropdownType: "link" },
  { id: 2, text: 'Application', reference: "/admin/application"},
  { id: 3, text: 'User Management', reference: "/admin/userlist", dropdownType: "link"},
  { id: 3, text: 'Audit / Logs ', reference: "#", dropdownType: "link"},
  { id: 3, text: 'Setting', reference: "#", dropdownType: "dropdownLink"},
];

export const QuickLink = [
  { id: 1, text: 'About Us', reference: "#" },
  { id: 2, text: 'Pricing', reference: "#" },
  { id: 3, text: 'Contact Us', reference: "#" },
  { id: 4, text: 'Platforms', reference: "#" },
]

export const Legal = [
  { id: 1, text: 'About Us', reference: "#" },
  { id: 2, text: 'Pricing', reference: "#" },
]

export const Service = [
  { id: 1, text: 'Trading', reference: "#" },
  { id: 1, text: 'Clearing', reference: "#" },
  { id: 1, text: 'Locates', reference: "#" },
  { id: 1, text: 'Lending', reference: "#" },
]

export const ContactDetail = [
  { id: 1, text: '844-963-1512', reference: "#", Icon: FaPhoneAlt },
  { id: 1, text: 'guardian.newaccounts@velocityclearingllc.com', reference: "#", Icon: FaMapMarkerAlt },
  { id: 1, text: 'Guardian', reference: "#",Icon: FaEnvelope },
]

