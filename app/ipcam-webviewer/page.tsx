// "use client";
export const dynamic = "force-dynamic";
// import { useEffect, useState } from "react";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PageLayout from "../_components/page-layout";
// import GridLayout from "./_components/grid-layout";
// import StreamCard from "./_components/stream-card";
import Displayipcams from "../_components/displayipcams";
// import {
//   Api,
//   // Error,
//   // GlobalConf,
//   // HttpResponse,
//   // PathList,
// } from "@/lib/MediaMTX/generated";
// import { AlertTriangle } from "lucide-react";
// import { useSettings } from "@/lib/settings-context";

// import getAppConfig from "./_actions/getAppConfig";
// import { clientConfig  } from "./config";

export default async function Home() {
  // const {config, mediaMtxConfig,
  //   //  paths, autoPlay, setAutoPlay, colNum, setColNum, rowNum, setRowNum
  // } = useSettings();

  // const [trigger, setTrigger] = useState(0)

  // const config = await getAppConfig();
  // if (!config) {
  //   return <div>Invalid Config</div>;
  // }

  // let paths: HttpResponse<PathList, Error> | undefined;
  // let mediaMtxConfig: HttpResponse<GlobalConf, Error> | undefined;
  // const api = new Api({
  //   baseUrl: `${config.mediaMtxUrl}:${config.mediaMtxApiPort}`,
  // });

  // const remoteMediaMtxUrl = config.remoteMediaMtxUrl;

  // const getConfig = async () => {
  //   const temp_config:any = clientConfig; //await getAppConfig();
  //   setConfig(temp_config);
  //   setApi(new Api({
  //     baseUrl: `${temp_config.mediaMtxUrl}:${temp_config.mediaMtxApiPort}`,
  //   }));
  //   setIsConfigLoad(true);
  //   setIsLoad(true);
  // }

  // useEffect(()=>{
  //   !isConfigLoad&&getConfig();
  // },[isConfigLoad])

  // const loadPaths = async () => {
  //   try {
  //     const temp_paths = await api.v3.pathsList();
  //     setPaths(temp_paths);
  //     const temp_mediaMtxConfig = await api.v3.configGlobalGet({ cache: "no-cache" });
  //     setMediaMtxConfig(temp_mediaMtxConfig);
  //   } catch {
  //     console.error("Error reaching MediaMTX at: ", config.mediaMtxUrl);
  //   }
  //   setIsLoad(false);
  // }

  // useEffect(()=>{
  //   if (isLoad&&config) {
  //     loadPaths();
  //   }
  // },[isLoad])

  // useEffect(()=>{
  //   if (autoPlay) {
  //     console.log("//////// trigger : ", trigger)
  //     setTimeout(()=>setTrigger((prev:any)=>prev>=60?1:prev+1),1000);
  //   }
  // },[trigger])


  return (
    <PageLayout header="IPCams" subHeader="Live views of your IP Cameras">
      <Displayipcams/>
    </PageLayout>
  );
}
