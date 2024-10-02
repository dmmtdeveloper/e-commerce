"use client";
import React from "react";
import clsx from "clsx";
import { footerLinks, socialMedia } from "@/types/footer-Links";
import Link from "next/link";
import { Reveal } from "@/animation/Reveal";
import Image from "next/image";
import logo from "@/public/assets/icons/LOGO.svg";

export const Footer = () => {
  return (
    <section
      className={clsx(
        "pt-10 pb-5",
        "flex justify-center items-center",
        "flex-col px-5",
        "xl:px-44",
        "border-t-1",
        "border-gray-950/[.1] bg-slate-50"
      )}
    >
      <div
        className={clsx(
          "flex items-start lg:items-start xl:items-start",
          "md:flex-row flex-col",
          "mb-8 w-full"
        )}
      >
        <div className="flex-1 flex flex-col gap-2">
          
            <Image
              className="w-32 h-auto"
              height={100}
              width={100}
              src={logo}
              alt="logo"
              priority
            />
          

          
            <small
              className={clsx("text-black", "text-black-100", "text-[11px]")}
            >
              Síguenos en nuestras redes sociales
            </small>
          
         
            <div className="flex gap-4 flex-row md:mt-0">
              {socialMedia.map((social, index) => (
                <Link
                  href={social.link}
                  key={index}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    "w-10 h-auto",
                    "text-black",
                    "hover:text-blue-500",

                    /*hover efect*/
                    "hover:scale-[1.15]",
                    "active:scale-105",
                    "transition",
                    "duration-300"
                  )}
                >
                  <social.icon size={28} />
                </Link>
              ))}
            </div>
          
        </div>

        <div
          className={clsx(
            "flex-[2]",
            "w-full flex xl:flex-row",
            "justify-between",
            "flex-wrap"
          )}
        >
          {footerLinks.map((footerLink, index) => (
            <div key={index} className="flex flex-col my-4 min-w-[150px]">
              
                <h4 className="text-black text-small font-semibold leading-[27px]">
                  {footerLink.title}
                </h4>
           
                <ul>
                  {footerLink.links.map((link, linkIndex) => (
                    <li
                      key={linkIndex}
                      className={clsx(
                        "my-2 text-sm",
                        "dark:text-white-100",
                        "text-black-200",
                        "leading-[24px]",
                        "cursor-pointer",
                        "hover:text-green",
                        "dark:hover:text-green"
                      )}
                    >
                      {link.link ? (
                        <Link className="hover:text-blue-500" href={link.link}>
                          {link.name}
                        </Link>
                      ) : (
                        <span className="hover:text-blue-500">{link.name}</span>
                      )}
                    </li>
                  ))}
                </ul>
             
            </div>
          ))}
        </div>
      </div>

     
        <div className="w-full md:flex-col flex justify-between items-center  flex-col  border-t-[1px] border-t-black-200">
          <small className="text-black text-black-200 text-xs text-center mt-4">
            Copyright © 2024 pcstore.cl. Todos los derechos reservados.
          </small>
          {/* <p className="text-xs text-center dark:text-white-200 text-black-200 ">
            <span>About this website:</span> built with React & Next.js, TypeScript, Tailwind CSS,
            Framer Motion, Web3Forms.
          </p> */}
        </div>
 
    </section>
  );
};
