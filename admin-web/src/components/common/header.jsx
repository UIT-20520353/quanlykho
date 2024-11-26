import logo from "@/assets/images/logo.png";
import { CircleUserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between w-full h-20 px-5 border-b border-gray-200 bg-gray-1">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <h3 className="text-lg font-bold text-brown-1">Quản lý Cửa hàng</h3>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold">Admin</span>
        <CircleUserRound width={40} height={40} className="cursor-pointer" />
      </div>
    </header>
  );
};

export default Header;