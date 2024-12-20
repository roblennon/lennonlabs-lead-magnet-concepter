import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/" className="text-lg font-semibold">
                Revenue Analyzer
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[200px] p-2">
                  <Link
                    to="/"
                    className="block px-4 py-2 hover:bg-accent rounded-md"
                  >
                    Home
                  </Link>
                  <Link
                    to="/admin-r"
                    className="block px-4 py-2 hover:bg-accent rounded-md"
                  >
                    Admin
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Header;