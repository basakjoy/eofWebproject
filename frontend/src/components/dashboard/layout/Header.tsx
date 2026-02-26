import { Bell, Search, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/dashboard/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dashboard/ui/dropdown-menu";
import { Input } from "@/components/dashboard/ui/input";

export function Header() {
  return (
    <header className="h-14 sm:h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-20 md:top-0">
      <div className="flex items-center justify-between h-full px-3 sm:px-6 gap-2 sm:gap-4">
        {/* Search - Hidden on mobile, shown on sm and up */}
        <div className="relative hidden sm:block flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-secondary/50 border-secondary focus:border-primary text-xs sm:text-sm"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          {/* Mobile Search Button */}
          <button className="sm:hidden p-2 rounded-lg hover:bg-secondary transition-colors">
            <Search className="w-4 h-4 text-muted-foreground" />
          </button>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-secondary transition-colors">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
          </button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 sm:gap-3 p-2 rounded-lg hover:bg-secondary transition-colors">
                <Avatar className="w-6 h-6 sm:w-8 sm:h-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-xs">
                    SA
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left">
                  <p className="text-xs sm:text-sm font-medium text-foreground">Super Admin</p>
                  <p className="text-xs text-muted-foreground hidden xl:block">admin@forexpro.com</p>
                </div>
                <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 sm:w-56 text-xs sm:text-sm">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
