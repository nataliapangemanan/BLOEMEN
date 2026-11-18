import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShopRegister from "./pages/ShopRegister";
import Shops from "./pages/Shops";
import ShopDetail from "./pages/ShopDetail";
import ShopMap from "./pages/ShopMap";
import PreOrder from "./pages/PreOrder";
import MyOrders from "./pages/MyOrders";
import Payment from "./pages/Payment";
import DesignReference from "./pages/DesignReference";
import Categories from "./pages/Categories";
import ProductDetail from "./pages/ProductDetail";
import ProductList from "./pages/ProductList";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import ChatRoom from "./pages/ChatRoom";
import NotFound from "./pages/NotFound";
import SellerLayout from "./components/SellerLayout";
import SellerDashboard from "./pages/seller/SellerDashboard";
import ProductsManagement from "./pages/seller/ProductsManagement";
import OrdersManagement from "./pages/seller/OrdersManagement";
import ShopSettings from "./pages/seller/ShopSettings";
import SellerReviews from "./pages/seller/SellerReviews";
import SalesReport from "./pages/seller/SalesReport";
import WireframeBoard from "./pages/WireframeBoard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "shop-register", Component: ShopRegister },
      { path: "shops", Component: Shops },
      { path: "shops/:id", Component: ShopDetail },
      { path: "shops/map/:id", Component: ShopMap },
      { path: "preorder/:shopId", Component: PreOrder },
      { path: "my-orders", Component: MyOrders },
      { path: "payment/:orderId", Component: Payment },
      { path: "design-reference", Component: DesignReference },
      { path: "categories", Component: Categories },
      { path: "products", Component: ProductList },
      { path: "products/:productId", Component: ProductDetail },
      { path: "messages", Component: Messages },
      { path: "chat/:shopId", Component: ChatRoom },
      { path: "chat/:shopId/:conversationId", Component: ChatRoom },
      { path: "profile", Component: Profile },
      {
        path: "seller",
        Component: SellerLayout,
        children: [
          { index: true, Component: SellerDashboard },
          { path: "products", Component: ProductsManagement },
          { path: "orders", Component: OrdersManagement },
          { path: "shop-settings", Component: ShopSettings },
          { path: "reviews", Component: SellerReviews },
          { path: "sales-report", Component: SalesReport },
        ],
      },
      // Seller Messages - outside seller layout to allow full screen chat
      { path: "seller/messages", Component: Messages },
      { path: "seller/chat/:shopId", Component: ChatRoom },
      { path: "wireframe", Component: WireframeBoard },
      { path: "*", Component: NotFound },
    ],
  },
]);
