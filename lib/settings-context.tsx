"use client";

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"

import {
  Api,
  // Error,
  GlobalConf,
  HttpResponse,
  PathList,
} from "@/lib/MediaMTX/generated";
import { clientConfig } from "@/app/config";


const isStreamArrEqul = (arr1:any[],arr2:any[]) => {
    if (arr1?.length != arr2?.length) {
        return false;
    }

    const arr2Obj:any = {};
    arr2?.map((r:any)=>arr2Obj[r.name]=true);
    if (arr1?.some((r:any)=>!arr2Obj[r.name])) {
      return false;
    }

    return true;
}


import { useRouter, usePathname, useSearchParams } from "next/navigation";

type SettingsContextType = {
  config:any
  setConfig:any
  mediaMtxConfig:any
  setMediaMtxConfig:any
  api:any
  setApi:any
  paths:any
  setPaths:any
  isConfigLoad:any
  setIsConfigLoad:any
  isLoad:any
  setIsLoad:any
  autoPlay:any
  setAutoPlay:any
  autoRefresh:any
  setAutoRefresh:any
  colNum:any
  setColNum:any
  rowNum:any
  setRowNum:any
  // trigger:any
  // setTrigger:any
  loadPaths:any
  curQueryRef:any
  theme:any
  setTheme:any
  isInit:any
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [colNum, setColNum] = useState('small');
  const [rowNum, setRowNum] = useState(0);
  const [config, setConfig] = useState<any>();
  const [mediaMtxConfig, setMediaMtxConfig] = useState<HttpResponse<GlobalConf, Error>>();
  const [api, setApi] = useState<any>();
  const [paths, setPaths] = useState<HttpResponse<PathList, Error> | undefined>()
  const [isConfigLoad, setIsConfigLoad] = useState<boolean>(false);
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const [theme, setTheme] = useState<"dark" | "light" | "system" | any>();
  const [isInit, setIsInit] = useState(false)
  // const [trigger, setTrigger] = useState(0)


  const getConfig = async () => {
    const config:any = clientConfig; //await getAppConfig();
    // console.log("/////////////// api url : ", config.mediaMtxApiPort?`${config.mediaMtxUrl}:${config.mediaMtxApiPort}`:`${config.mediaMtxUrl}`);
    setConfig(config);
    setApi(new Api({
      baseUrl: config.mediaMtxApiPort?`${config.mediaMtxUrl}:${config.mediaMtxApiPort}`:`${config.mediaMtxUrl}`,
    }));
    setIsConfigLoad(true);
    setIsLoad(true);
    setAutoPlay(localStorage.getItem('autoplay')==='0'?false:true);
    setAutoRefresh(localStorage.getItem('autorefresh')==='0'?false:true);
    setColNum(localStorage.getItem('colnum') || 'small');
    setTheme(localStorage.getItem('theme') || 'dark');
  }

  useEffect(()=>{
    !isConfigLoad&&getConfig();
  },[isConfigLoad])

  
  
  useEffect(()=>{
    localStorage.setItem('colnum',colNum || 'small')
  },[colNum])

  useEffect(()=>{
    theme&&localStorage.setItem('theme',theme)
  },[theme])


  const curQueryRef = useRef("");
  const handleAutoPlay = (paths:any) => {
    const current = new URLSearchParams(
      searchParams ? Array.from(searchParams.entries()) : [],
    );

    // console.log("----- : ", searchParams, current)

    const currentSelectedCams = paths?.data?.items?.map((r:any)=>r.name);

    if (currentSelectedCams?.length > 0) {
      current.set("liveCams", currentSelectedCams.join(","));
    } else {
      current.delete("liveCams");
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    curQueryRef.current = query;
    router.push(`${pathname}${query}`, { scroll: false });
  }

  const autoPlayRef = useRef(false)
  useEffect(()=>{
    if (autoPlay) {
      handleAutoPlay(paths);
    } else {
      curQueryRef.current = "";
    }
    localStorage.setItem('autoplay',autoPlay?'1':'0')
    autoPlayRef.current = autoPlay;
  },[autoPlay])

  const autoRefreshRef = useRef(false)
  useEffect(()=>{
    localStorage.setItem('autorefresh',autoRefresh?'1':'0')
    autoRefreshRef.current = autoRefresh;
  },[autoRefresh])

  const pathItemsRef = useRef();
  const loadPaths = async () => {
    // console.log('---------- loadPaths')
    try {
      const temp_paths = await api.v3.pathsList();
      // console.log("//////// paths : ", temp_paths)
      if (!isStreamArrEqul(temp_paths?.data?.items, pathItemsRef.current||[])) {
        pathItemsRef.current = temp_paths?.data?.items;
        setPaths(temp_paths);
        autoPlayRef.current&&handleAutoPlay(temp_paths);
      }
      if (!mediaMtxConfig) {
        const temp_mediaMtxConfig = await api.v3.configGlobalGet({ cache: "no-cache" });
        setMediaMtxConfig(temp_mediaMtxConfig);
        setIsInit(true);
      }
    } catch {
      console.error("Error reaching MediaMTX at: ", config.mediaMtxUrl);
    }
  }

  useEffect(()=>{
    if (isLoad&&config) {
      loadPaths();
      setIsLoad(false);
    }
  },[isLoad])

  // useEffect(()=>{
  //   if (autoPlay) {
  //     console.log("//////// trigger : ", trigger)
  //     setTimeout(()=>setTrigger((prev:any)=>prev>=60?1:prev+1),1000);
  //   }
  // },[trigger])

  // const getTrigger = () => {
  //   // console.log('////// trigger !!!!');
  //   setTrigger((prev:any)=>prev>=60?1:prev+1)
  //   console.log("//////// set new trigger : ", triggerRef.current);
  //   autoPlay&&setTimeout(()=>{
  //     getTrigger();
  //   },1000);
  // }

  const getTrigger = () => {
    // console.log('////// trigger !!!! : ', triggerRef.current);
    triggerRef.current=(triggerRef.current>=60)?1:triggerRef.current+1;
    // setIsLoad(true);
    loadPaths();
    // console.log("//////// set new trigger : ", triggerRef.current);
    autoRefreshRef.current&&setTimeout(()=>{
      getTrigger();
    },10000);
  }

  const triggerRef = useRef(0);
  useEffect(()=>{
    if (autoRefresh&&config&&mediaMtxConfig) {
      getTrigger();
    }
  },[autoRefresh,config,mediaMtxConfig])

  return <SettingsContext.Provider value={{config, setConfig, mediaMtxConfig, setMediaMtxConfig, api, setApi, paths, setPaths, isConfigLoad, setIsConfigLoad, isLoad, setIsLoad, autoPlay, setAutoPlay, autoRefresh, setAutoRefresh, colNum, setColNum, rowNum, setRowNum, loadPaths, curQueryRef, theme, setTheme, isInit}}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within an SettingsProvider")
  }
  return context
}
