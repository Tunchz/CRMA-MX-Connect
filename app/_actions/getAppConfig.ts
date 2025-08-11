"use server";

// import prisma from "@/lib/prisma";
import { Config } from "@prisma/client";
import { clientConfig } from "../config";

export default async function getAppConfig(): Promise<Config | null> {
  // return await prisma.config.findFirst();

  // return {
  //   mediaMtxApiPort: 9997,
  //   mediaMtxUrl: 'http://localhost',
  //   recordingsDirectory: '../mediamtx/recordings',
  //   screenshotsDirectory: '../mediamtx/screenshots',
  //   remoteMediaMtxUrl: 'http://localhost'
  // } as any;

  return clientConfig as any;
}
