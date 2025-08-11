"use client";
import {
  Card,
  CardContent,
  CardDescription,
  // CardHeader,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "dayjs";
import {
  Film,
  Image as ImageIcon,
  Info,
  PauseCircle,
  PlayCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Cam from "./cam";
import { cn, fThaiDate, formatDatetime } from "@/lib/utils";

export default function StreamCard({
  props,
}: {
  props: {
    remoteMediaMtxUrl: string;
    streamName?: string;
    hlsAddress?: string;
    readyTime?: string | null;
    thumbnail?: string | null;
  };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [thumbnailError, setThumbnailError] = useState<boolean>(false);

  if (!props.streamName) {
    return <>Error getting stream</>;
  }
  const streamName = props.streamName;
  const onCamSelect = (streamName: string) => {
    const current = new URLSearchParams(
      searchParams ? Array.from(searchParams.entries()) : [],
    );
    let currentSelectedCams = current.get("liveCams")?.split(",");
    if (currentSelectedCams) {
      if (currentSelectedCams.includes(streamName)) {
        currentSelectedCams = currentSelectedCams.filter(
          (c) => c !== streamName,
        );
      } else {
        currentSelectedCams.push(streamName);
      }
    } else {
      currentSelectedCams = [streamName];
    }

    if (currentSelectedCams.length > 0) {
      current.set("liveCams", currentSelectedCams.join(","));
    } else {
      current.delete("liveCams");
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`, { scroll: false });
  };

  const isLive = searchParams
    ?.get("liveCams")
    ?.split(",")
    .filter(Boolean)
    .includes(props.streamName);

  return (
    <Card className="flex flex-col aspect-square" style={{height:'100%'}}>
      {/* <CardHeader className="text-md pt-4 pb-2">
      </CardHeader> */}
      <CardContent className="flex flex-col flex-auto justify-between _gap-2 pt-3 p-4 ">
        <CardDescription className="flex justify-between text-md">
          <span className="text-md main-color font-bold">{`${isLive?'▶':'❚❚'} ${streamName}`}</span>
          {props.readyTime && <span className="text-xs"> {`@${formatDatetime(props.readyTime)}`}</span>}
        </CardDescription>
        <div className="flex items-center flex-auto w-full ">
          {isLive ? (
            <Cam
              props={{
                address: `${props.remoteMediaMtxUrl}${props.hlsAddress}/${streamName}/index.m3u8`,
              }}
            ></Cam>
          ) : thumbnailError ? (
            <div className="flex items-center justify-center  w-full h-full">
              <ImageIcon className="h-12 w-12"></ImageIcon>
            </div>
          ) : (
            <div className="w-full h-full relative">
              <Image
                alt=""
                fill
                objectFit="contain"
                onError={() => setThumbnailError(true)}
                src={`/api/${streamName}/first-screenshot`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant={"outline"}
            onClick={() => onCamSelect(streamName)}
            className={cn("basis-1/2", { "bg-accent animate-pulse": isLive })}
            size={"sm"}
          >
            {isLive ? (
              <PauseCircle className="h-6 w-6"></PauseCircle>
            ) : (
              <PlayCircle className="h-6 w-6"></PlayCircle>
            )}
          </Button>

          <Link href={`/recordings/${streamName}`} className="basis-1/4">
            <Button variant={"outline"} className="w-full" size={"sm"}>
              <Film className="h-6 w-6"></Film>
            </Button>
          </Link>

          <Popover>
            <PopoverTrigger asChild className="basis-1/4">
              <Button variant={"outline"} size={"sm"}>
                <Info className="h-6 w-6"></Info>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-2">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <p className="text-md text-muted-foreground">Stream</p>
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="flex items-center gap-4">
                    <span>Name:</span>
                    <span>{streamName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">Online:</span>
                    {props.readyTime && (
                      <span>
                        {dayjs(props.readyTime).format("MMMM D, YYYY h:mm A")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
}
