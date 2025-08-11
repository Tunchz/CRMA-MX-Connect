"use client";

import GridLayout from "./grid-layout";
import StreamCard from "./stream-card";
import { useSettings } from "@/lib/settings-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function DisplayStreams() {
    const { mediaMtxConfig, config, paths, colNum } = useSettings();


    return (
        !config?<div>Invalid Config</div>
        :!config.remoteMediaMtxUrl ? (
            <Alert>
            <AlertTriangle className="h-10 w-10" />
            <AlertTitle>Set up your Remote MediaMTX Url!</AlertTitle>
            <AlertDescription>
                {`Head over to the config page. You need to set up your remote MediaMTX Url to view your streams`}
            </AlertDescription>
            </Alert>
        )
        : mediaMtxConfig?.data.hlsAddress ? (
            <GridLayout columnLayout={colNum}>
                {!paths?.data.items !== undefined && paths?.data.items?.length === 0 && (
                    <Alert>
                    <AlertTriangle className="h-10 w-10" />
                    <AlertTitle>Set up some streams!</AlertTitle>
                    <AlertDescription>
                        {`No live streams detected. Add some streams to MediaMTX to view`}
                    </AlertDescription>
                    </Alert>
                )}
                {paths?.data.items?.map(({ name, readyTime }:any, index:any) => (
                    <StreamCard
                    key={index}
                    props={{
                        streamName: name,
                        readyTime,
                        hlsAddress: mediaMtxConfig?.data.hlsAddress,
                        remoteMediaMtxUrl: config.remoteMediaMtxUrl,
                    }}
                    ></StreamCard>
                ))}
            </GridLayout>
        ) : (
            <Alert>
            <AlertTriangle className="h-10 w-10" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
                {`We couldn't reach the MediaMTX server. Please check the url in your
                configuration`}
            </AlertDescription>
            </Alert>
        )
    )
}