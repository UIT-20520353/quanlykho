import MainLayout from "@/components/layout/main-layout";
import CategoryManagement from "@/features/category";
import Dashboard from "@/features/dashboard";
import ImportManagement from "@/features/import";
import CreateImportRecord from "@/features/import/pages/create-import-record";
import UpdateImportRecord from "@/features/import/pages/update-import-record";
import Login from "@/features/login";
import OrderManagement from "@/features/order";
import CreateOrder from "@/features/order/pages/create-order";
import UpdateOrder from "@/features/order/pages/update-order";
import ProductManagement from "@/features/product";
import AddProduct from "@/features/product/pages/add-product";
import UpdateProduct from "@/features/product/pages/update-product";
import StaffManagement from "@/features/staff";
import CreateStaff from "@/features/staff/pages/create-staff";
import EditStaff from "@/features/staff/pages/edit-staff";
import { Route, Routes } from "react-router-dom";

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
        <Route path="/products/:id" element={<UpdateProduct />} />
        <Route path="/products" element={<ProductManagement />} />
        <Route path="/orders/create" element={<CreateOrder />} />
        <Route path="/orders/:id" element={<UpdateOrder />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/import/create" element={<CreateImportRecord />} />
        <Route path="/import/:id" element={<UpdateImportRecord />} />
        <Route path="/import" element={<ImportManagement />} />
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default App;
