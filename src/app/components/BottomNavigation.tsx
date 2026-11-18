import { motion } from "motion/react";
import { useNavigate, useLocation } from "react-router";
import { Home, Grid3x3, Palette, MessageCircle, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface BottomNavigationProps {
  orderCount?: number;
  unreadCount?: number;
}

export function BottomNavigation({ unreadCount = 0 }: BottomNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    {
      icon: Home,
      label: "Beranda",
      path: "/",
      active: location.pathname === "/",
    },
    {
      icon: Grid3x3,
      label: "Toko",
      path: "/shops",
      active: location.pathname.startsWith("/shops"),
    },
    {
      icon: Palette,
      label: "Referensi",
      path: "/design-reference",
      active: location.pathname === "/design-reference",
    },
    {
      icon: MessageCircle,
      label: "Chat",
      path: "/messages",
      active: location.pathname === "/messages",
      badge: unreadCount,
      requireAuth: true,
    },
    {
      icon: User,
      label: "Profil",
      path: user ? "/profile" : "/login",
      active: location.pathname === "/profile" || location.pathname === "/login",
    },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.requireAuth && !user) {
      navigate("/login", { replace: true });
    } else {
      if (location.pathname !== item.path) navigate(item.path, { replace: true });
    }
  };

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => (
          <motion.button
            key={item.path}
            onClick={() => handleNavClick(item)}
            className={`flex flex-col items-center gap-1 ${
              item.active ? "text-primary" : "text-muted-foreground"
            }`}
            whileTap={{ scale: 0.9 }}
          >
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-white text-xs min-w-[16px] h-4 rounded-full flex items-center justify-center font-semibold px-1">
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </div>
            <span className={`text-xs ${item.active ? "font-medium" : ""}`}>
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
}
