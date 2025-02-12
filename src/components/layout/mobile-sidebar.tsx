"use client";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { Sheet, SheetContent, SheetTitle, SheetTrigger, Button } from "../ui";
import { Sidebar } from "./sidebar";

export const MobileSidebar = () => {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet modal={false} onOpenChange={setOpen} open={isOpen}>
      <SheetTrigger asChild>
        <Button variant="secondary" className="lg:hidden size-5">
          <MenuIcon className="size-4 text-neutral-500" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <VisuallyHidden.Root>
          <SheetTitle>Menu</SheetTitle>
        </VisuallyHidden.Root>
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};
