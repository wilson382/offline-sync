import HomeIcon from "@material-ui/icons/Home";
import PeopleIcon from "@material-ui/icons/People";
// import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
// import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import { FaHandHoldingUsd } from "react-icons/fa";
import { MdScreenSearchDesktop } from "react-icons/md";
import { GiTakeMyMoney, GiPayMoney } from "react-icons/gi";
import SettingsApplicationsIcon from "@material-ui/icons/SettingsApplications";

export const DrawerList = [
  {
    title: "Inicio",
    path: "/dashboard",
    icon: <HomeIcon />,
  },
  {
    title: "Data Credito",
    path: "/data/credito",
    icon: <MdScreenSearchDesktop size="1.5em" />,
  },
  // {
  //   title: "Lista Negra",
  //   path: "/black/list",
  //   icon: <MdScreenSearchDesktop size="1.5em" />,
  // },
  {
    title: "Prestamos",
    path: "/loans",
    icon: <FaHandHoldingUsd size="1.5em" />,
  },
  {
    title: "Clientes",
    path: "/debtors",
    icon: <PeopleIcon />,
  },
  {
    title: "Cobrado",
    path: "/collected",
    icon: <GiTakeMyMoney size="1.7em" />,
  },
  {
    title: "Entregas",
    path: "/entregas",
    icon: <GiPayMoney size="1.5em" />,
  },
  {
    title: "Gastos",
    path: "/spenses",
    icon: <LocalOfferIcon />,
  },
  {
    title: "Cuadre",
    path: "/cuadre",
    icon: <MonetizationOnIcon />,
  },
  {
    title: "Ajustes",
    path: "/user/config",
    icon: <SettingsApplicationsIcon />,
  },
];
