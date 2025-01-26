"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAuth, useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function SidebarDemo({
  children,
}: {
  children: React.ReactNode;
}) {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className=" group-hover:text-primary h-5 w-5 flex-shrink-0 transition-colors" />
      ),
    },
    {
      label: "Integrations",
      href: "/integrations",
      icon: (
        <IconUserBolt className="group-hover:text-primary h-5 w-5 flex-shrink-0 transition-colors" />
      ),
    },
    {
      label: "Billings",
      href: "/billings",
      icon: (
        <IconSettings className=" group-hover:text-primary h-5 w-5 flex-shrink-0 transition-colors" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className=" group-hover:text-primary h-5 w-5 flex-shrink-0 transition-colors" />
      ),
    },
  ];
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-primary-foreground w-full flex-1 mx-auto border   overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <>
              <Logo />
            </>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  className={cn(
                    "p-2 text-neutral-700 hover:text-primary group ",
                    {
                      "bg-primary/10 rounded text-primary ": selected === idx,
                    }
                  )}
                  textClassName={cn("group-hover:text-primary ", {
                    "text-primary": selected === idx,
                  })}
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <Avatar>
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>AU</AvatarFallback>
                  </Avatar>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {children}
    </div>
  );
}
export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-2xl text-black dark:text-white whitespace-pre"
      >
        Pyezza
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-primary py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-primary rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
