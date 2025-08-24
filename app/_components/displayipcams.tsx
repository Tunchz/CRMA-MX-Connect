"use client";

import { useEffect, useState, useRef } from 'react';
import GridLayout from "./grid-layout";
import IpcamCard from "./ipcam-card";
import { useSettings } from "@/lib/settings-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Instance, { getStr } from "./wsSocket";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function DisplayStreams() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { colNum, autoPlay } = useSettings();
    const [userID, setUserID] = useState<any>();
    const [userPwd, setUserPwd] = useState<any>();
    const [init, setInit] = useState(false)
    const [settings, setSettings] = useState<any>({mReady:false, login:true})
    const session = 'A615-47A9ABF3145C';
    const instance = useRef<any>(new Instance())


      const curQueryRef = useRef("");
      const handleAutoPlay = (paths:any) => {
        const current = new URLSearchParams(
          searchParams ? Array.from(searchParams.entries()) : [],
        );
    
        // console.log("----- : ", searchParams, current)
    
        const currentSelectedCams = paths?.map((r:any)=>r.name);
    
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
        if (autoPlay && settings.devList?.length>0) {
          handleAutoPlay(settings.devList);
        } else {
          curQueryRef.current = "";
        }
        localStorage.setItem('autoplay',autoPlay?'1':'0')
        autoPlayRef.current = autoPlay;
      },[autoPlay, settings.devList])
    

    const set = (obj:any) => setSettings((prev:any)=>({...prev, ...obj}))

    const handleInit = () => {
        instance.current?.onCommand((message:any) => {
            const sHead=message.substring(0,3);
            console.log('Recieving message : ', message);
            if(sHead=='LGN'){
                if(message.substring(3,6)=='IDO'){//Success
                    localStorage.setItem('login','success')
                    const sData=message.substring(6);
                    const obj = JSON.parse(sData);
                    console.log('devList',obj,obj.Devs.length);
                    set({devList: obj.Devs, statusbar: getStr(sData), login: false})
                    // $('.devList').text('');
                    // for(var i=0;i<obj.Devs.length;i++){
                    //     $('.devList').append("<span style='cursor:pointer;color:blue' onclick='AddDevByAcc(\"" + obj.Devs[i].uid + "\",\""+obj.Devs[i].name+"\")'>" + obj.Devs[i].name + "</span></br>");			   
                    // }
                    // $('#statusbar').text('Login Success');
                    // $('#login').hide();

                }
                else{
                    localStorage.setItem('login','failed')
                    const sData=message.substring(3);
                    set({statusbar: getStr(sData)});
                    // $('#statusbar').text(getStr(sData));
                    console.log('Login message : ', sData);
                }
            // }
            // else if(sHead=='ADD'){//Add device
            //     const sData=message.substring(3);
            //     set({statusbar: getStr(sData)});
            //     // $('#statusbar').text(getStr(sData));
            // }
            // else if(sHead=='STA'){//onnection status
            //     const sData=message.substring(3);
            //     const sShowText=getStr(sData);
            //     console.log("------ ",sShowText,sData)
            //     set({statusbar: `${dev.name||''} ${dev.batteryRate||'-'}% ${sShowText != ""?sShowText:sData}`})
            //     // $('#statusbar').text(`${dev.name||''} ${dev.batteryRate||'-'}% ${sShowText != ""?sShowText:sData}`);

            //     if (message=='STAIDS_AUTH_SUCC') {
            //         console.log("------- show video : ", dev)
            //         console.log("------- message : ", message)
            //         setTimeout(()=>{
            //             // $("button[name='showVideo1']").click();
            //             var randomNumber = Math.random();  
            //             set({videoSrc: `https://academics.crma.dev/ipcam-webviewer/${dev.session}/${dev.devID}/video.cgi?lens=0&${randomNumber}`});
            //             // $("#videoimg0").attr("src", 'https://academics.crma.dev/ipcam-webviewer/' + dev.session + '/' + dev.devID + '/video.cgi?lens=0&' + randomNumber);
            //         },1000);
            //     }
            // }
            // else if(sHead=='NDV')
            //     set({statusbar: 'Connect the device first'});
            //     // $('#statusbar').text('Connect the device first');
            // else if (sHead=='CGR') {
            //     let obj:any = {};
            //     message.split(`;\r\nvar `)?.map((r:any)=>{
            //         let temp = r?.split('=');
            //         obj[temp[0]]=temp[1]?.replaceAll('\"','')?.replaceAll(';\r\n','');
            //     });
            //     console.log("----- Obj : ", obj);
            //     if (obj.batteryRate) {
            //         dev.batteryRate = obj.batteryRate;
            //     }
            }
        })
        
        // //connect the device
        // function AddDevByAcc(sDevID:string, sDevName:string) {
        //     dev.devID=sDevID;
        //     dev.devPwd='';//Account login method，devPwd is empty。
        //     dev.name=sDevName;
        //     dev.batteryRate = null;
        //     instance.current?.connectDev(dev);
        //     // ShowVideo(dev.session,dev.devID);
        //     set({statusbar: `${dev.name||''} : Connecting...`});
        //     // $('#statusbar').text(`${dev.name||''} : Connecting...`);
        // };
        //websocket connection callback
        instance.current?.onSocketStatus((status:any, message:any) => {
            if (status) {//Connection successfully
                set({mReady: true});
                // $("#mReady").hide();
                console.log("-------- check local save account !!!!")
                const login = localStorage.getItem('login'),
                    userID = localStorage.getItem('userId'),
                    userPwd = localStorage.getItem('userPwd');
                setUserID(userID);
                setUserPwd(userPwd);
                if (login=='success'&&userID&&userPwd) {
                    console.log("---- auto login ")
                    // setTimeout(()=>{
                        instance.current?.Login({userID, userPwd});
                        set({statusbar: 'Log in ...'});
                        // $('#statusbar').text('Log in ...');
                    // },1000)
                }

            } else {//Connection failed
                set({mReady: false});
                // $("#mReady").show();
                console.log('WebSocket exception : ', message);
            }
        })

        instance.current?.InitSocket()

        setInit(true);
    }

    useEffect(()=>{
        !init&&handleInit();
    }, [init])

    const handleLogin = (userID:any, userPwd:any)=>{
        userID&&localStorage.setItem('userId',userID);
        userPwd&&localStorage.setItem('userPwd',userPwd);
        instance.current?.Login({userID, userPwd})
    };

    const handleLogout = ()=>{
        settings.devList?.map((r:any)=>{
            instance.current?.disconnectDev(session,r.uid);
        })
        localStorage.setItem('userId','');
        localStorage.setItem('userPwd','');
        localStorage.setItem('login','');
        setUserID('');
        setUserPwd('');
        set({login:true, devList:[]})
    };

    // console.log("----- isInit | config | paths?.data.items ", isInit, config, paths?.data.items)
    return (
        !init?null
        :!settings.mReady?(
            <Alert>
            <AlertTriangle className="h-10 w-10" />
            <AlertTitle>Service not found!</AlertTitle>
            <AlertDescription>
                {`The IPcam Webviewer service can not be reached , Please check internet connection or contact administrator!!!!`}
            </AlertDescription>
            </Alert>
        )
        :settings.login ? (
            // <GridLayout columnLayout={'medium'}>

                <div
                    className={cn(
                    "grid grid-cols-2 gap-2 items-center",
                    )}
                    style={{maxWidth: 500, margin: '0 auto'}}
                >
                    <Label>{"Account"}</Label>
                    <>
                        <Input placeholder="กรอกชื่อบัญชี" value={userID} onChange={(e:any)=>setUserID(e.target?.value||'')} />
                    </>
                    <Label>{"Password"}</Label>
                    <>
                        <Input placeholder="กรอกรหัส" value={userPwd} onChange={(e:any)=>setUserPwd(e.target?.value||'')} type='password' />
                    </>
                    <Label>{""}</Label>
                    <div className="flex justify-end py-2">
                        <Button
                            disabled={!userID || !userPwd}
                            onClick={()=>handleLogin(userID,userPwd)}
                        >
                            Login
                        </Button>
                    </div>
                </div>
            // </GridLayout>
        )
        :(
            <div>
                <div style={{float:'right', marginTop:'-80px', display:'flex', flexDirection:'column', alignItems:'flex-end'}}>
                <AlertTitle style={{marginRight: 16}}>{userID}</AlertTitle>
                <Button
                    disabled={!userID || !userPwd}
                    onClick={()=>handleLogout()}
                    className='main-color'
                    style={{marginLeft:'auto', backgroundColor:'#FFF0', padding: '3px 16px', height: 30}}
                >
                    Log Out
                </Button>
                </div>
            <GridLayout columnLayout={colNum}>
                {(!(settings?.devList?.length > 0)) && (
                    <Alert>
                    <AlertTriangle className="h-10 w-10" />
                    <AlertTitle>{`No camera found for ${userID} !!!`}</AlertTitle>
                    <AlertDescription>
                        {`No ip camera registerd to account : ${userID}. Add some ip camera to view`}
                    </AlertDescription>
                    </Alert>
                )}
                {settings?.devList?.map(({ name, uid }:any, index:any) => (
                    <IpcamCard
                    key={index}
                    // dev={dev}
                    session={session}
                    props={{
                        streamName: name,
                        uid,
                        readyTime: '',
                        hlsAddress: '', //config.mediaMtxApiPort?mediaMtxConfig?.data.hlsAddress:"",
                        remoteMediaMtxUrl: ''//,config.remoteMediaMtxUrl,
                    }}
                    ></IpcamCard>
                ))}
            </GridLayout>
            </div>
        )
    )
}