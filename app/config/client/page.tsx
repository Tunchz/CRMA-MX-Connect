export const dynamic = "force-dynamic";

// import prisma from "@/lib/prisma";
import ClientConfigForm from "../client-config-form";
import { clientConfig } from "../../config";

export default async function Client() {
  // const clientConfig = await prisma.config.findFirst();

  // const clientConfig:any =  {
  //   mediaMtxApiPort: 9997,
  //   mediaMtxUrl: 'http://localhost',
  //   recordingsDirectory: '../mediamtx/recordings',
  //   screenshotsDirectory: '../mediamtx/screenshots',
  //   remoteMediaMtxUrl: 'http://localhost'
  // }

  return <ClientConfigForm clientConfig={clientConfig as any} />;
}
