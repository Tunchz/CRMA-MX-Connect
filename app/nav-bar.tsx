"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Menu, RefreshCcw, RefreshCcwDot, Columns2, Columns3, Columns4, RefreshCwOff, Play, Pause } from "lucide-react";
import { ModeToggle } from "./_components/mode-toggle";
import { useSettings } from "@/lib/settings-context";

type Props = {
  items?: { name: string; location: string }[];
};

export default function NavBar({ items }: Props) {
  const pathname = usePathname();
  const {loadPaths, curQueryRef, autoPlay, setAutoPlay, autoRefresh, setAutoRefresh, colNum, setColNum} = useSettings();

  return (
    <div className="flex h-10 items-center max-w-8xl sm:justify-between sm:space-x-0 mx-auto">
      <div className="flex gap-6 sm:gap-10 w-full">
        <Link href={`/${curQueryRef.current || ''}`} className={cn("items-center space-x-2 hidden sm:flex text-muted-foreground transition-colors hover:text-primary",{ "main-color": pathname == "/" })}>
          <span className="font-bold inline-block">{"CRMA-MX"}</span>
        </Link>
        <>
          <nav className="hidden gap-6 sm:flex">
            {items?.map(({ location, name }) => (
              <Link
                key={location}
                href={location}
                className={cn(
                  "text-muted-foreground transition-colors hover:text-primary",
                  { "text-primary": pathname?.includes(location) },
                  { "main-color": pathname?.includes(location) },
                )}
              >
                {name}
              </Link>
            ))}
          </nav>
          <div className="flex w-full sm:hidden items-center justify-start ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="flex items-center  ">
                <Button variant="ghost" size={"icon"}>
                  <Menu></Menu>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/${curQueryRef.current || ''}`}
                    className={cn(
                      "text-primary font-extrabold transition-colors hover:text-primary",
                    )}
                  >
                    CRMA-MX
                  </Link>
                </DropdownMenuItem>
                {items?.map(({ location, name }, index) => (
                  <DropdownMenuItem asChild key={index}>
                    <Link
                      key={location}
                      href={location}
                      className={cn(
                        "text-muted-foreground transition-colors hover:text-primary",
                        { "text-primary": pathname?.includes(location) },
                      )}
                    >
                      {name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      </div>

      <div className="flex flex-1 items-center justify-end">
        <nav className="flex space-x-4 px-2 items-center">
          
          {pathname == "/" && <Button className="main-color px-2" style={{marginRight:-12}} variant={"ghost"} onClick={() => {setColNum(colNum=='sx'?'small':colNum=='small'?'medium':colNum=='medium'?'large':colNum=='large'?'xlarge':colNum=='xlarge'?'small':'small')}}>
            {colNum=='small'?<Columns2/>:colNum=='medium'?<Columns3/>:colNum=='large'?<Columns4/>:colNum=='xlarge'?<Columns4/>:<Columns2/>}
          </Button>}
          {pathname == "/" && <div className="toggle" style={{display:'flex'}}>
              <input type="checkbox" checked={autoPlay} onChange={()=>setAutoPlay(!autoPlay)} />
              <label>{autoPlay?<Play style={{marginLeft:1}} />:<Pause />}</label>
              {/* <label> AutoPlay</label> */}
          </div>}
          {pathname == "/" && <div className="toggle" style={{display:'flex'}}>
              <input type="checkbox" checked={autoRefresh} onChange={()=>setAutoRefresh(!autoRefresh)} />
              <label>{autoRefresh?<RefreshCcwDot />:<RefreshCwOff />}</label>
              {/* <label> AutoRefresh</label> */}
          </div>}
          {!autoRefresh&&<Button className="main-color px-2" style={{marginRight:-12, marginLeft: 12}} variant={"ghost"} onClick={() => {
            loadPaths();
            // setIsLoad(true);
            // window.location.reload();
            }}>
            <RefreshCcw/>
          </Button>}
          <ModeToggle />
        </nav>
      </div>
    </div>
  );
}
