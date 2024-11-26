import MainLayout from "@/components/layout/main-layout";
import CategoryManagement from "@/features/category";
import Dashboard from "@/features/dashboard";
import Login from "@/features/login";
import StaffManagement from "@/features/staff";
import CreateStaff from "@/features/staff/pages/create-staff";
import EditStaff from "@/features/staff/pages/edit-staff";
import { Route, Routes } from "react-router-dom";
import ProductManagement from "./features/product";
import AddProduct from "./features/product/pages/add-product";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<MainLayout />}>
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="/users/create" element={<CreateStaff />} />
        <Route path="/users/:id" element={<EditStaff />} />
        <Route path="/users" element={<StaffManagement />} />
        <Route path="/products/add" element={<AddProduct />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
