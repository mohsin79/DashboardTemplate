import { FaBan, FaCheck, FaClock, FaPen} from 'react-icons/fa';

export const cardData = [
    {
       status:"Accepted",
       count: 108,
       icon: FaCheck,
       color: "#17a2b8"
    },
    {
        status:"Rejected",
        count: 41,
        icon: FaBan,
        color: "#dc3545"
    },
    {
        status:"Pending",
        count: 346,
        icon: FaClock,
        color: "#28a745" 
    },
    {
        status:"Draft",
        count: 1419,
        icon: FaPen,
        color: "#ffc107"  
    },
    {
        status:"Trash",
        count: 2,
        icon: FaPen,
        color: "#ffc107"  
    }
]