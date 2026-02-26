(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();const Tt="4.64.0 - Homebase",kn="lifeGamificationData_v3",Wr="lifeGamificationWeights_v1",Ui="lifeGamificationGithubToken",Gi="lifeGamificationTheme",mc="lifeGamificationColorMode",Ur="lifeGamificationAnthropicKey",bh="data.json",yh={simplebits:{name:"SimpleBits",description:"Warm cream tones with coral accents"},things3:{name:"Things 3",description:"Clean white with blue accents"},geist:{name:"Geist",description:"Vercel-inspired monochrome with sharp edges"}},Qo="mhabib306-sys",Zo="lifeg",ei="data.json",Eo="nucleusWeatherCache",gc="nucleusWeatherLocation",ti={0:"☀️",1:"🌤️",2:"⛅",3:"☁️",45:"🌫️",48:"🌫️",51:"🌧️",53:"🌧️",55:"🌧️",61:"🌧️",63:"🌧️",65:"🌧️",71:"🌨️",73:"🌨️",75:"❄️",77:"🌨️",80:"🌦️",81:"🌦️",82:"⛈️",85:"🌨️",86:"🌨️",95:"⛈️",96:"⛈️",99:"⛈️"},id={0:"Clear",1:"Mostly Clear",2:"Partly Cloudy",3:"Cloudy",45:"Foggy",48:"Foggy",51:"Light Drizzle",53:"Drizzle",55:"Heavy Drizzle",61:"Light Rain",63:"Rain",65:"Heavy Rain",71:"Light Snow",73:"Snow",75:"Heavy Snow",77:"Snow Grains",80:"Light Showers",81:"Showers",82:"Heavy Showers",85:"Light Snow Showers",86:"Snow Showers",95:"Thunderstorm",96:"Thunderstorm",99:"Severe Storm"},$n="lifeGamificationTasks",Dn="lifeGamificationPerspectives",Qt="lifeGamificationTaskCategories",Zt="lifeGamificationTaskLabels",en="lifeGamificationTaskPeople",_n="lifeGamificationCategories",Ot="lifeGamificationHomeWidgets",vc="lifeGamificationViewState",ar="lifeGamificationDeletedTaskTombstones",sr="lifeGamificationDeletedEntityTombstones",or="nucleusGCalAccessToken",aa="nucleusGCalTokenTimestamp",Vi="nucleusGCalSelectedCalendars",qi="nucleusGCalTargetCalendar",Gr="nucleusGCalEventsCache",Ki="nucleusGCalLastSync",Bs="nucleusGCalConnected",bc="nucleusGCalOfflineQueue",as="nucleusGoogleContactsSyncToken",js="nucleusGoogleContactsLastSync",ir="nucleusMeetingNotes",tn="lifeGamificationTriggers",yc="lifeGamificationCollapsedTriggers",wc="lifeGamificationFamilyMembers",$o=[{id:"mom",name:"Mom"},{id:"dad",name:"Dad"},{id:"jana",name:"Jana"},{id:"tia",name:"Tia"},{id:"ahmed",name:"Ahmed"},{id:"eman",name:"Eman"}],Yi=[{localStorage:"lifeGamificationAnthropicKey",id:"anthropicKey"},{localStorage:"nucleusWhoopWorkerUrl",id:"whoopWorkerUrl"},{localStorage:"nucleusWhoopApiKey",id:"whoopApiKey"},{localStorage:"nucleusLibreWorkerUrl",id:"libreWorkerUrl"},{localStorage:"nucleusLibreApiKey",id:"libreApiKey"}],ld="14TjFIFtzMPcHgxr1NAtdfrYNmgFRz53XpmYwPQpeA_U",wh=1119187551,ss="nucleusGSheetYesterdayCache",dd="nucleusGSheetLastSync",Fs="nucleusGSheetSavedPrompt",Hs="nucleusGSheetResponseCache",lr="nucleusConflictNotifications",ni="nucleusAppVersionSeen",xc="nucleusNoteIntegritySnapshot",xh="nucleusNoteLocalBackup",za="lastUpdated",os="collapsedNotes",zs="nucleusGithubSyncDirty",kc="nucleusSyncHealth",Ji="nucleusSyncSequence",is=1,ls=[{id:"quick-stats",type:"stats",title:"Quick Stats",size:"full",order:0,visible:!0},{id:"quick-add",type:"quick-add",title:"Quick Add Task",size:"full",order:1,visible:!0},{id:"weather",type:"weather",title:"Weather",size:"half",order:2,visible:!0},{id:"todays-score",type:"score",title:"Today's Score",size:"half",order:3,visible:!0},{id:"today-tasks",type:"today-tasks",title:"Today",size:"half",order:4,visible:!0},{id:"today-events",type:"today-events",title:"Today's Events",size:"half",order:5,visible:!0},{id:"next-tasks",type:"next-tasks",title:"Next",size:"half",order:6,visible:!0},{id:"prayers",type:"prayers",title:"Prayers",size:"half",order:7,visible:!0},{id:"glucose",type:"glucose",title:"Glucose",size:"half",order:8,visible:!0},{id:"whoop",type:"whoop",title:"Whoop",size:"half",order:9,visible:!0},{id:"habits",type:"habits",title:"Habits",size:"half",order:10,visible:!0},{id:"gsheet-yesterday",type:"gsheet-yesterday",title:"Yesterday",size:"half",order:11,visible:!0}],kh=[{id:"personal",name:"Personal",color:"#4A90A4"},{id:"work",name:"Work",color:"#6B8E5A"},{id:"health",name:"Health",color:"#E5533D"},{id:"family",name:"Family",color:"#C4943D"},{id:"learning",name:"Learning",color:"#7C6B8E"}],Sh=[{id:"next",name:"Next",color:"#8B5CF6"},{id:"urgent",name:"Urgent",color:"#DC2626"},{id:"quick",name:"Quick Win",color:"#16A34A"},{id:"waiting",name:"Waiting",color:"#CA8A04"},{id:"blocked",name:"Blocked",color:"#6B7280"}],Th=[{id:"self",name:"Self",color:"#4A90A4",email:""}],Sc={home:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 11.5L12 4l8.5 7.5"/><path d="M6.5 10.5V20h11V10.5"/><path d="M10 20v-5h4v5"/></svg>',inbox:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 10v4h16v-4h-4a4 4 0 01-8 0H4z"/></svg>',today:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.94 5.95 6.57.96-4.76 4.63 1.12 6.56L12 17.27l-5.87 3.09 1.12-6.56-4.76-4.63 6.57-.96z"/></svg>',flagged:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h2v2h8l-1 3 3 3H8v10H6V2z"/></svg>',upcoming:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-1V2h-2v2H8V2H6zm13 18H5V9h14v11z"/><rect x="7" y="11" width="3" height="3" rx="0.5"/></svg>',anytime:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="4" rx="2"/><rect x="3" y="10" width="18" height="4" rx="2"/><rect x="3" y="16" width="18" height="4" rx="2"/></svg>',someday:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v4H3V3zm1 5h16v13a1 1 0 01-1 1H5a1 1 0 01-1-1V8zm5 3v2h6v-2H9z"/></svg>',logbook:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4a2 2 0 012-2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm6.7 11.3l-3-3 1.4-1.4 1.6 1.6 4.6-4.6 1.4 1.4-6 6z"/></svg>',trash:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>',area:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17l10 5 10-5-10-5-10 5z" opacity="0.35"/><path d="M2 12l10 5 10-5-10-5-10 5z" opacity="0.6"/><path d="M12 2L2 7l10 5 10-5L12 2z"/></svg>',next:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z" fill="white"/></svg>',notes:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M14 2v5h5" fill="white" opacity="0.95"/><rect x="8.5" y="11" width="7.5" height="1.7" rx="0.85" fill="white"/><rect x="8.5" y="14.7" width="7.5" height="1.7" rx="0.85" fill="white"/><rect x="8.5" y="18.4" width="5" height="1.6" rx="0.8" fill="white"/></svg>',calendar:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-1V2h-2v2H8V2H6zm13 18H5V9h14v11z"/><circle cx="8" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="16" cy="12" r="1.2"/><circle cx="8" cy="16" r="1.2"/><circle cx="12" cy="16" r="1.2"/><circle cx="16" cy="16" r="1.2"/></svg>',lifeScore:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v8H3v-8zm4-4h2v12H7V9zm4-4h2v16h-2V5zm4 8h2v8h-2v-8zm4-4h2v12h-2V9z"/></svg>',workspace:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4a2 2 0 012-2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v16h12V4H6zm2 3h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"/></svg>',settings:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.61 3.61 0 0112 15.6z"/></svg>',trigger:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',review:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>'},Tc={home:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',inbox:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>',today:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',flagged:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',upcoming:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',anytime:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',someday:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>',logbook:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',trash:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',area:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',next:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>',notes:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V7z"/><path d="M14 2v5h5"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>',calendar:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="8" cy="14" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="14" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="14" r="1" fill="currentColor" stroke="none"/></svg>',lifeScore:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',workspace:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',settings:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.6.77 1.05 1.38 1.14l.13.01H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',trigger:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',review:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>'};function ve(){return(localStorage.getItem(Gi)||"things3")==="geist"?Tc:Sc}function Ih(){const e=ve();return[{id:"inbox",name:"Inbox",icon:e.inbox,color:De("--inbox-color")||"#147EFB",filter:{status:"inbox"},builtin:!0},{id:"today",name:"Today",icon:e.today,color:De("--today-color")||"#FFCC00",filter:{today:!0},builtin:!0},{id:"flagged",name:"Flagged",icon:e.flagged,color:De("--flagged-color")||"#FF9500",filter:{flagged:!0},builtin:!0},{id:"upcoming",name:"Upcoming",icon:e.upcoming,color:De("--upcoming-color")||"#FF3B30",filter:{upcoming:!0},builtin:!0},{id:"anytime",name:"Anytime",icon:e.anytime,color:De("--anytime-color")||"#5AC8FA",filter:{status:"anytime"},builtin:!0},{id:"someday",name:"Someday",icon:e.someday,color:De("--someday-color")||"#C69C6D",filter:{status:"someday"},builtin:!0},{id:"waiting",name:"Waiting For",icon:"⏳",color:De("--waiting-color")||"#AF52DE",filter:{waiting:!0},builtin:!0},{id:"projects",name:"Projects",icon:"📋",color:De("--projects-color")||"#5856D6",filter:{projects:!0},builtin:!0},{id:"logbook",name:"Logbook",icon:e.logbook,color:De("--logbook-color")||"#34C759",filter:{completed:!0},builtin:!0}]}const Ue=new Proxy([],{get(e,t){const n=Ih(),a=n[t];return typeof a=="function"?a.bind(n):a}});function Ch(){return{id:"notes",name:"Notes",icon:ve().notes,color:De("--notes-color")||"#8E8E93",filter:{notes:!0},builtin:!0}}const ut=new Proxy({},{get(e,t){return Ch()[t]}}),Eh=["#147EFB","#5AC8FA","#34AADC","#007AFF","#4A90D9","#5856D6","#2E6B9E","#1B3A5C","#34C759","#30B94E","#4CD964","#8CC63F","#FFCC00","#FF9500","#FF9F0A","#FFD60A","#FF3B30","#FF6482","#FF2D55","#E85D75","#AF52DE","#BF5AF2","#9B59B6","#7B68EE","#C69C6D","#A2845E","#8E8E93","#636366","#48484A","#3A3A3C","#6E6E73","#86868B"],ot={prayers:{fajr:"",dhuhr:"",asr:"",maghrib:"",isha:"",quran:0},glucose:{avg:"",tir:"",insulin:""},whoop:{sleepPerf:"",recovery:"",strain:"",whoopAge:""},libre:{currentGlucose:"",trend:"",readingsCount:0,lastReading:""},family:{mom:!1,dad:!1,jana:!1,tia:!1,ahmed:!1,eman:!1},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0,nop:""}},Dr={prayer:{onTime:5,late:2,quran:5},glucose:{avgMax:10,tirPerPoint:.1,insulinBase:5,insulinPenalty:-5,insulinThreshold:40},family:{mom:1,dad:1,jana:1,tia:1,ahmed:1,eman:1},habits:{exercise:3,reading:2,meditation:2,water:1,vitamins:2,brushTeeth:1,nopYes:2,nopNo:-2},whoop:{sleepPerfHigh:7,sleepPerfMid:4,sleepPerfLow:2,recoveryHigh:2,recoveryMid:1,recoveryLow:0,strainMatch:3,strainHigh:2}},_r={prayer:35,diabetes:25,whoop:14,family:6,habits:16,total:96},sa="lifeGamificationMaxScores",Ws="lifeGamificationXP",Us="lifeGamificationStreak",Gs="lifeGamificationAchievements",Vs="lifeGamificationCategoryWeights",Xi={prayer:20,diabetes:20,whoop:20,family:20,habits:20},ds=[0,100,250,450,700,1e3,1400,1900,2500,3200,4e3,4900,5900,7e3,8200,9500,10900,12400,14e3,15700,17500,19400,21400,23500,25700,28e3,30400,32900,35500,38200,41e3,44e3,47200,50600,54200,58e3,62e3,66200,70600,75200,8e4,85e3,90200,95600,101200,107e3,113e3,119200,125600,132200],cd=[{min:1,max:4,name:"Spark",icon:"✨"},{min:5,max:9,name:"Ember",icon:"🔥"},{min:10,max:14,name:"Flame",icon:"🔥"},{min:15,max:19,name:"Blaze",icon:"🔥"},{min:20,max:24,name:"Inferno",icon:"🔥"},{min:25,max:999,name:"Phoenix",icon:"🔥"}],Do=[{min:1,max:1,multiplier:1},{min:2,max:3,multiplier:1.1},{min:4,max:6,multiplier:1.2},{min:7,max:13,multiplier:1.3},{min:14,max:29,multiplier:1.4},{min:30,max:1/0,multiplier:1.5}],Qi=.2;function De(e){return getComputedStyle(document.documentElement).getPropertyValue(e).trim()}function $h(){const e=De("--danger")||"#EF4444",t=De("--warning")||"#F59E0B",n=De("--success")||"#22C55E";return[{min:0,max:.39,color:e,label:"Needs Work",bg:"bg-[var(--danger)]"},{min:.4,max:.59,color:t,label:"Getting There",bg:"bg-[var(--warning)]"},{min:.6,max:.79,color:t,label:"Solid",bg:"bg-[var(--warning)]"},{min:.8,max:.89,color:n,label:"Great",bg:"bg-[var(--success)]"},{min:.9,max:1,color:n,label:"Outstanding",bg:"bg-[var(--success)]"}]}const Ma=new Proxy([],{get(e,t){const n=$h(),a=n[t];return typeof a=="function"?a.bind(n):a}}),Dh=[{id:"first-steps",name:"First Steps",desc:"3-day streak",icon:"🌱",category:"streak",check:e=>e.streak>=3},{id:"weekly-warrior",name:"Weekly Warrior",desc:"7-day streak",icon:"⚔️",category:"streak",check:e=>e.streak>=7},{id:"fortnight-focus",name:"Fortnight Focus",desc:"14-day streak",icon:"🎯",category:"streak",check:e=>e.streak>=14},{id:"monthly-master",name:"Monthly Master",desc:"30-day streak",icon:"👑",category:"streak",check:e=>e.streak>=30},{id:"quarterly-quest",name:"Quarterly Quest",desc:"90-day streak",icon:"🏔️",category:"streak",check:e=>e.streak>=90},{id:"year-of-discipline",name:"Year of Discipline",desc:"365-day streak",icon:"🏆",category:"streak",check:e=>e.streak>=365},{id:"perfect-prayer",name:"Perfect Prayer",desc:"All 5 prayers on time",icon:"🕌",category:"mastery",check:e=>e.prayerOnTime>=5},{id:"prayer-streak-7",name:"Prayer Streak",desc:"7 consecutive perfect prayer days",icon:"📿",category:"mastery",check:e=>e.perfectPrayerStreak>=7},{id:"green-day",name:"Green Day",desc:"Overall score >= 90%",icon:"💚",category:"mastery",check:e=>e.overallPercent>=.9},{id:"balanced-day",name:"Balanced Day",desc:"All 5 categories >= 60%",icon:"⚖️",category:"mastery",check:e=>e.allCategoriesAbove60},{id:"family-first",name:"Family First",desc:"30 cumulative family check-in days",icon:"👨‍👩‍👧‍👦",category:"mastery",check:e=>e.totalFamilyDays>=30},{id:"day-one",name:"Day One",desc:"First day logged",icon:"🚀",category:"milestone",check:e=>e.totalDaysLogged>=1},{id:"century",name:"Century",desc:"100 days logged",icon:"💯",category:"milestone",check:e=>e.totalDaysLogged>=100},{id:"quran-scholar",name:"Quran Scholar",desc:"50 cumulative Quran pages",icon:"📖",category:"milestone",check:e=>e.totalQuranPages>=50},{id:"level-10",name:"Level 10",desc:"Reach Level 10",icon:"🔟",category:"milestone",check:e=>e.level>=10},{id:"level-20",name:"Level 20",desc:"Reach Level 20",icon:"2️⃣0️⃣",category:"milestone",check:e=>e.level>=20},{id:"level-30",name:"Level 30",desc:"Reach Level 30",icon:"3️⃣0️⃣",category:"milestone",check:e=>e.level>=30}],_h={prayer:"Try to pray all 5 on time today.",diabetes:"Watch your glucose — stay in range.",whoop:"Prioritize sleep and recovery.",family:"Try calling a family member today.",habits:"Focus on exercise and reading."},ud=["buy","call","send","finish","review","schedule","clean","fix","write","email","text","message","contact","ask","tell","remind","check","update","submit","complete","start","begin","plan","prepare","organize","arrange","book","order","pick","drop","return","cancel","renew","pay","transfer","deposit","withdraw","sign","register","apply","file","print","scan","copy","move","pack","unpack","install","setup","configure","test","debug","deploy","ship","deliver","mail","post","share","publish","upload","download","backup","restore","delete","remove","add","create","build","design","draft","edit","proofread","approve","reject","merge","close","open","lock","unlock","wash","iron","cook","bake","grill","make","assemble","repair","replace","charge","refill","restock","measure","track","log","record","document","research","investigate","analyze","compare","evaluate","prioritize","delegate"],Ah={"2026-01-01":{prayers:{fajr:"1",dhuhr:"1",asr:"1",maghrib:"0.1",isha:"0.1",quran:0},family:{mom:!1,dad:!1,jana:!1,tia:!1,ahmed:!1,eman:!1},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-02":{prayers:{fajr:"1",dhuhr:"1",asr:"1",maghrib:"1",isha:"1",quran:0},family:{mom:!0,dad:!0,jana:!1,tia:!1,ahmed:!1,eman:!1},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-03":{prayers:{fajr:"1.1",dhuhr:"1",asr:"1",maghrib:"0.1",isha:"1",quran:0},family:{mom:!0,dad:!1,jana:!1,tia:!1,ahmed:!1,eman:!1},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-04":{prayers:{fajr:"1.2",dhuhr:"0.1",asr:"1",maghrib:"1",isha:"1",quran:0},family:{mom:!0,dad:!0,jana:!1,tia:!1,ahmed:!1,eman:!1},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-05":{prayers:{fajr:"1",dhuhr:"0.1",asr:"0.1",maghrib:"0.1",isha:"1",quran:0},family:{mom:!1,dad:!1,jana:!1,tia:!1,ahmed:!0,eman:!1},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-06":{prayers:{fajr:"1",dhuhr:"0.1",asr:"0.1",maghrib:"0.1",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!0,tia:!0,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-07":{prayers:{fajr:"1",dhuhr:"0.1",asr:"1",maghrib:"1",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!0,tia:!0,ahmed:!0,eman:!1},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-08":{prayers:{fajr:"0.1",dhuhr:"1",asr:"1",maghrib:"0.1",isha:"0.1",quran:0},family:{mom:!0,dad:!1,jana:!1,tia:!1,ahmed:!0,eman:!1},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-09":{prayers:{fajr:"1",dhuhr:"1",asr:"1",maghrib:"1",isha:"1",quran:0},family:{mom:!0,dad:!1,jana:!1,tia:!1,ahmed:!0,eman:!1},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-10":{prayers:{fajr:"0.1",dhuhr:"1",asr:"1",maghrib:"1",isha:"1",quran:0},family:{mom:!0,dad:!1,jana:!1,tia:!1,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-11":{prayers:{fajr:"1",dhuhr:"0.1",asr:"0.1",maghrib:"1",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!1,tia:!1,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-12":{prayers:{fajr:"0.1",dhuhr:"",asr:"0.1",maghrib:"0.1",isha:"1",quran:0},family:{mom:!1,dad:!0,jana:!1,tia:!1,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-13":{prayers:{fajr:"0.1",dhuhr:"",asr:"",maghrib:"0.1",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!0,tia:!1,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-14":{prayers:{fajr:"1",dhuhr:"0.1",asr:"0.1",maghrib:"0.1",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!1,tia:!0,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-15":{prayers:{fajr:"1",dhuhr:"",asr:"",maghrib:"0.1",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!1,tia:!1,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-16":{prayers:{fajr:"1",dhuhr:"",asr:"",maghrib:"",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!1,tia:!0,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-17":{prayers:{fajr:"1",dhuhr:"1",asr:"1",maghrib:"0.1",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!1,tia:!0,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-18":{prayers:{fajr:"1",dhuhr:"1",asr:"0.1",maghrib:"1",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!1,tia:!1,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-19":{prayers:{fajr:"1",dhuhr:"",asr:"",maghrib:"1",isha:"0.1",quran:0},family:{mom:!0,dad:!1,jana:!1,tia:!1,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-20":{prayers:{fajr:"1",dhuhr:"",asr:"",maghrib:"",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!1,tia:!0,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-21":{prayers:{fajr:"0.1",dhuhr:"",asr:"",maghrib:"",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!1,tia:!0,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-22":{prayers:{fajr:"1",dhuhr:"",asr:"",maghrib:"",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!0,tia:!0,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}}};function he(e=new Date){const t=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),a=String(e.getDate()).padStart(2,"0");return`${t}-${n}-${a}`}function A(e){if(!e)return"";const t=document.createElement("div");return t.textContent=e,t.innerHTML}function oe(e,t=""){if(!e||typeof e!="string")return t;const n=e.trim();return/^#[0-9a-fA-F]{3,8}$/.test(n)||/^(rgb|hsl)a?\([^)]{0,150}\)$/i.test(n)||/^var\(--[\w-]+\)$/.test(n)?n:t}function Mh(e){if(e){try{const t=new URL(e);if(t.protocol!=="http:"&&t.protocol!=="https:")return}catch{return}window.open(e,"_blank","noopener,noreferrer")}}function Me(e){if(e==null||e==="")return"—";const t=typeof e=="string"?parseFloat(e):e;return isNaN(t)?"—":t.toLocaleString("en-US")}function oa(){const e=Date.now(),t=new Uint8Array(8);crypto.getRandomValues(t);const n=Array.from(t,a=>a.toString(36).padStart(2,"0")).join("").slice(0,12);return`task_${e}_${n}`}function ia(e){const t=Date.now(),n=Math.random().toString(36).slice(2,8);return`${e}_${t}_${n}`}function _e(e,t){try{const n=localStorage.getItem(e);return n?JSON.parse(n):t}catch(n){return console.error(`Failed to parse localStorage key "${e}":`,n),t}}function Jn(e){return String(e||"").trim().toLowerCase()}function Vr(e,t=32,n=""){if(!e)return"";if(e.photoData)return`<img src="${e.photoData}" alt="" style="width:${t}px;height:${t}px" class="rounded-full object-cover flex-shrink-0 ${n}" referrerpolicy="no-referrer">`;const a=String(e.name||"").trim().split(/\s+/).filter(Boolean),s=a.length>=2?(a[0][0]+a[a.length-1][0]).toUpperCase():(a[0]?.[0]||"?").toUpperCase(),o=oe(e.color,"var(--accent)"),i=Math.max(Math.round(t*.4),10);return`<span style="width:${t}px;height:${t}px;background:${o};font-size:${i}px" class="rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold leading-none ${n}">${s}</span>`}function Zi(e){if(!e)return"";if(e.allDay)return"All day";if(!e.start?.dateTime)return"";const n=new Date(e.start.dateTime).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});if(!e.end?.dateTime)return n;const s=new Date(e.end.dateTime).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});return`${n} - ${s}`}function Ic(e){return e?e.allDay&&e.start?.date?new Date(e.start.date+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}):e.start?.dateTime?new Date(e.start.dateTime).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}):"":""}function Pe(){return window.innerWidth<=768}function nn(){return window.matchMedia("(hover: none) and (pointer: coarse)").matches}function el(){return Pe()||nn()}function Cc(e="light"){if(!navigator.vibrate)return;const t={light:5,medium:10,heavy:20,error:[10,50,10],success:[10,30]};navigator.vibrate(t[e]||5)}function Ne(e){if(!e)return"";const t=he(),n=new Date(t+"T00:00:00"),a=new Date(e+"T00:00:00"),s=Math.round((a-n)/(1e3*60*60*24));return s===0?"Today":s===1?"Tomorrow":s===-1?"Yesterday":s>1&&s<=6?a.toLocaleDateString("en-US",{weekday:"long"}):s>=-6&&s<-1?a.toLocaleDateString("en-US",{weekday:"long"}):a.getFullYear()===n.getFullYear()?a.toLocaleDateString("en-US",{month:"short",day:"numeric"}):a.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}function Ph(){try{const e=localStorage.getItem(Wr);if(!e)return JSON.parse(JSON.stringify(Dr));const t=JSON.parse(e);if(!t||typeof t!="object")return JSON.parse(JSON.stringify(Dr));const n=JSON.parse(JSON.stringify(Dr));return Object.keys(n).forEach(a=>{t[a]&&Object.keys(n[a]).forEach(s=>{t[a][s]!==void 0&&(n[a][s]=t[a][s])})}),n}catch(e){return console.error("Error loading weights:",e),JSON.parse(JSON.stringify(Dr))}}function Nh(){try{const e=localStorage.getItem(sa);if(!e)return JSON.parse(JSON.stringify(_r));const t=JSON.parse(e);return!t||typeof t!="object"?JSON.parse(JSON.stringify(_r)):{..._r,...t}}catch(e){return console.error("Error loading max scores:",e),JSON.parse(JSON.stringify(_r))}}function Lh(){try{const e=localStorage.getItem(wc);if(!e)return JSON.parse(JSON.stringify($o));const t=JSON.parse(e);return Array.isArray(t)?t.filter(n=>n&&n.id&&n.name):JSON.parse(JSON.stringify($o))}catch(e){return console.error("Error loading family members:",e),JSON.parse(JSON.stringify($o))}}const Ec=JSON.parse(localStorage.getItem(kn)||"{}"),qr={...Ah,...Ec};let $c=!1;Object.keys(qr).forEach(e=>{const t=qr[e];t.glucose&&t.glucose.nop!==void 0&&t.glucose.nop!==""&&(t.habits||(t.habits={}),(t.habits.nop===void 0||t.habits.nop==="")&&(t.habits.nop=t.glucose.nop,$c=!0),delete t.glucose.nop)});$c&&console.log("Migrated NoP data from glucose to habits");localStorage.setItem(kn,JSON.stringify(qr));const Xe=JSON.parse(localStorage.getItem(vc)||"{}");let xt=Xe.activeTab||"home";const Oh=Object.keys(qr).some(e=>/^\d{4}-\d{2}-\d{2}$/.test(e));let Dc=Xe.activeSubTab||(Oh?"daily":"dashboard");(xt==="track"||xt==="bulk"||xt==="dashboard")&&(Dc=xt==="track"?"daily":xt,xt="life");["home","life","tasks","calendar","settings"].includes(xt)||(xt="home");let Kr=Xe.activePerspective||"inbox";Kr==="home"&&(Kr="inbox");Kr==="calendar"&&(Kr="inbox");const Rh=["tasks","notes","both"].includes(Xe.workspaceContentMode)?Xe.workspaceContentMode:"both";let ri;try{const e=localStorage.getItem(os);ri=new Set(e?JSON.parse(e):[])}catch(e){console.error("Error loading collapsed notes:",e),localStorage.removeItem(os),ri=new Set}function _c(e){if(!e||typeof e!="object")return{};const t={};return Object.entries(e).forEach(([n,a])=>{const s=a?new Date(a).getTime():0;!n||!Number.isFinite(s)||s<=0||(t[String(n)]=new Date(s).toISOString())}),t}function Bh(e){if(!e||typeof e!="object")return{};const t={};return Object.entries(e).forEach(([n,a])=>{t[n]=_c(a)}),t}const Ac=_c(_e(ar,{})),Mc=Bh(_e(sr,{})),dr=(e,t)=>!!(e&&t&&Mc[e]?.[String(t)]),jh=(_e($n,[])||[]).filter(e=>!Ac[String(e?.id)]),Fh=(_e(Qt,null)||kh).filter(e=>!dr("taskCategories",e?.id)),Hh=(_e(Zt,null)||Sh).filter(e=>!dr("taskLabels",e?.id)),zh=(_e(en,null)||Th).filter(e=>!dr("taskPeople",e?.id)).map(e=>({...e,email:typeof e?.email=="string"?e.email:"",jobTitle:typeof e?.jobTitle=="string"?e.jobTitle:"",photoUrl:typeof e?.photoUrl=="string"?e.photoUrl:"",photoData:typeof e?.photoData=="string"?e.photoData:""})),Wh=(_e(Dn,[])||[]).filter(e=>!dr("customPerspectives",e?.id)),Uh=(_e(_n,[])||[]).filter(e=>!dr("categories",e?.id)),Gh=(_e(Ot,null)||ls).filter(e=>!dr("homeWidgets",e?.id)),r={currentUser:null,authLoading:!0,authError:null,syncStatus:"idle",lastSyncTime:null,syncDebounceTimer:null,syncInProgress:!1,syncPendingRetry:!1,syncRetryCount:0,syncRetryTimer:null,cloudPullPending:!1,githubSyncDirty:localStorage.getItem(zs)==="true",syncRateLimited:!1,syncSequence:parseInt(localStorage.getItem(Ji)||"0",10),syncHealth:(()=>{try{const e=localStorage.getItem(kc);if(e){const t=JSON.parse(e);return t.recentEvents=Array.isArray(t.recentEvents)?t.recentEvents.slice(0,20):[],t}}catch{}return{totalSaves:0,successfulSaves:0,failedSaves:0,totalLoads:0,successfulLoads:0,failedLoads:0,lastSaveLatencyMs:0,avgSaveLatencyMs:0,lastError:null,recentEvents:[]}})(),weatherData:null,weatherLocation:{lat:30.0291,lon:31.4975,city:"New Cairo"},WEIGHTS:Ph(),MAX_SCORES:Nh(),storedData:Ec,allData:qr,currentDate:he(),weekChart:null,breakdownChart:null,activeTab:xt,activeSubTab:Dc,bulkMonth:new Date().getMonth(),bulkYear:new Date().getFullYear(),bulkCategory:"prayers",familyMembers:Lh(),dashboardDateRange:30,tasksData:jh,deletedTaskTombstones:Ac,deletedEntityTombstones:Mc,taskAreas:Fh,taskLabels:Hh,taskPeople:zh,taskCategories:Uh,customPerspectives:Wh,homeWidgets:Gh,editingHomeWidgets:!1,showAddWidgetPicker:!1,draggingWidgetId:null,activePerspective:Kr,workspaceContentMode:Rh,workspaceSidebarCollapsed:!1,activeFilterType:(Xe.activeFilterType==="category"?"area":Xe.activeFilterType)||"perspective",activeAreaFilter:Xe.activeAreaFilter||null,activeLabelFilter:Xe.activeLabelFilter||null,activePersonFilter:Xe.activePersonFilter||null,calendarMonth:new Date().getMonth(),calendarYear:new Date().getFullYear(),calendarSelectedDate:he(),calendarViewMode:"month",calendarSidebarCollapsed:!1,calendarEventModalOpen:!1,calendarEventModalCalendarId:null,calendarEventModalEventId:null,draggedCalendarEvent:null,calendarMeetingNotesEventKey:null,calendarMeetingNotesScope:"instance",meetingNotesByEvent:_e(ir,{}),editingTaskId:null,inlineEditingTaskId:null,quickAddIsNote:!1,showAllSidebarPeople:!1,showAllSidebarLabels:!1,newTaskContext:{areaId:null,labelId:null,personId:null,status:"inbox"},inlineAutocompleteMeta:new Map,mobileDrawerOpen:!1,showTaskModal:!1,showPerspectiveModal:!1,showAreaModal:!1,showLabelModal:!1,showPersonModal:!1,showCategoryModal:!1,editingCategoryId:null,activeCategoryFilter:Xe.activeCategoryFilter||null,editingAreaId:null,editingLabelId:null,editingPersonId:null,editingPerspectiveId:null,perspectiveEmojiPickerOpen:!1,areaEmojiPickerOpen:!1,categoryEmojiPickerOpen:!1,emojiSearchQuery:"",pendingPerspectiveEmoji:"",pendingAreaEmoji:"",pendingCategoryEmoji:"",collapsedSidebarAreas:new Set,draggedSidebarItem:null,draggedSidebarType:null,sidebarDragPosition:null,showInlineTagInput:!1,showInlinePersonInput:!1,editingNoteId:null,collapsedNotes:ri,zoomedNoteId:null,notesBreadcrumb:[],draggedNoteId:null,dragOverNoteId:null,noteDragPosition:null,draggedTaskId:null,dragOverTaskId:null,dragPosition:null,scoresCache:new Map,scoresCacheVersion:0,undoAction:null,undoTimerRemaining:0,undoTimerId:null,showBraindump:!1,braindumpRawText:"",braindumpParsedItems:[],braindumpStep:"input",braindumpEditingIndex:null,braindumpSuccessMessage:"",braindumpProcessing:!1,braindumpAIError:null,braindumpFullPage:!1,braindumpVoiceRecording:!1,braindumpVoiceTranscribing:!1,braindumpVoiceError:null,gcalEvents:[],gcalCalendarList:[],gcalCalendarsLoading:!1,gcalError:null,gcalSyncing:!1,gcalTokenExpired:!1,gcalOfflineQueue:_e(bc,[]),gcontactsSyncing:!1,gcontactsLastSync:null,gcontactsError:null,calendarMobileShowToday:!0,calendarMobileShowEvents:!0,calendarMobileShowScheduled:!0,conflictNotifications:_e(lr,[]),renderPerf:{lastMs:0,avgMs:0,maxMs:0,count:0},showCacheRefreshPrompt:!1,cacheRefreshPromptMessage:"",modalSelectedArea:null,modalSelectedCategory:null,modalSelectedStatus:"inbox",modalSelectedToday:!1,modalSelectedFlagged:!1,modalSelectedTags:[],modalSelectedPeople:[],modalIsNote:!1,modalRepeatEnabled:!1,modalStateInitialized:!1,modalWaitingFor:null,modalIsProject:!1,modalProjectId:null,modalProjectType:"parallel",modalTimeEstimate:null,CATEGORY_WEIGHTS:_e(Vs,null)||JSON.parse(JSON.stringify(Xi)),xp:_e(Ws,{total:0,history:[]}),streak:_e(Us,{current:0,longest:0,lastLoggedDate:null,shield:{available:!0,lastUsed:null},multiplier:1}),achievements:_e(Gs,{unlocked:{}}),dailyFocusDismissed:null,triggers:_e(tn,[]),editingTriggerId:null,collapsedTriggers:(()=>{try{const e=localStorage.getItem(yc);return new Set(e?JSON.parse(e):[])}catch{return new Set}})(),zoomedTriggerId:null,triggersBreadcrumb:[],reviewMode:!1,reviewAreaIndex:0,reviewCompletedAreas:[],reviewTriggersCollapsed:!1,reviewProjectsCollapsed:!1,reviewNotesCollapsed:!1,lastWeeklyReview:localStorage.getItem("nucleusLastWeeklyReview")||null,lastSomedayReview:localStorage.getItem("nucleusLastSomedayReview")||null,gsheetData:_e(ss,null),gsheetSyncing:!1,gsheetError:null,gsheetPrompt:"",gsheetResponse:null,gsheetAsking:!1,gsheetEditingPrompt:!1,showGlobalSearch:!1,globalSearchQuery:"",globalSearchResults:[],globalSearchActiveIndex:-1,globalSearchTypeFilter:null,settingsIntegrationsOpen:!1,settingsScoringOpen:!1,settingsDevToolsOpen:!1,settingsDataDiagOpen:!1,_lastRenderWasMobile:!1,cleanupCallbacks:[],quotaExceededError:!1};function je(e,t){try{return localStorage.setItem(e,JSON.stringify(t)),!0}catch(n){return n.name==="QuotaExceededError"&&(console.error("Storage quota exceeded for key:",e),typeof r<"u"&&(r.quotaExceededError=!0)),!1}}function Vh(e,t){try{return localStorage.setItem(e,t),!0}catch(n){return n.name==="QuotaExceededError"&&(console.error("Storage quota exceeded for key:",e),typeof r<"u"&&(r.quotaExceededError=!0)),!1}}function cr(){je(kn,r.allData),Vh(za,Date.now().toString())}function la(){const e=JSON.parse(JSON.stringify(ot)),t=r.familyMembers||[];return e.family={},t.forEach(n=>{e.family[n.id]=!1}),e}function tl(){return r.allData[r.currentDate]||la()}function qh(e,t,n){const a=tl();if(a[e]||(a[e]={}),a[e][t]=n,a._lastModified=new Date().toISOString(),r.allData[r.currentDate]=a,al(),cr(),typeof window.processGamification=="function"){const s=window.processGamification(r.currentDate);rl(s)}window.debouncedSaveToGithub(),window.render(),Kh()}function Kh(){let e=document.getElementById("save-indicator");e||(e=document.createElement("div"),e.id="save-indicator",e.style.cssText="position:fixed;bottom:24px;right:24px;padding:6px 14px;border-radius:var(--border-radius,6px);background:var(--bg-card,#fff);border:1px solid var(--border,#e6e6e6);color:var(--text-secondary,#666);font-size:12px;font-weight:500;z-index:9999;opacity:0;transition:opacity 0.2s;pointer-events:none;font-family:var(--font-family,system-ui);box-shadow:var(--shadow-sm,0 1px 2px rgba(0,0,0,0.04))",document.body.appendChild(e)),e.textContent="✓ Saved",e.style.opacity="1",clearTimeout(e._timer),e._timer=setTimeout(()=>{e.style.opacity="0"},1200)}function le(){je($n,r.tasksData),je(Qt,r.taskAreas),je(Zt,r.taskLabels),je(en,r.taskPeople),je(_n,r.taskCategories),je(Dn,r.customPerspectives),je(tn,r.triggers),window.debouncedSaveToGithub()}function nl(){je(wc,r.familyMembers)}function Yh(e,t){const n=he();if(r.allData[n]||(r.allData[n]={}),r.allData[n][e]||(r.allData[n][e]={}),r.allData[n][e][t]=!r.allData[n][e][t],r.allData[n]._lastModified=new Date().toISOString(),al(),cr(),typeof window.processGamification=="function"){const a=window.processGamification(n);rl(a)}window.debouncedSaveToGithub(),window.render()}function Jh(e,t,n){const a=he();r.allData[a]||(r.allData[a]={}),r.allData[a][e]||(r.allData[a][e]={});const s=parseFloat(n);if(r.allData[a][e][t]=n===""?null:Number.isNaN(s)?n:s,r.allData[a]._lastModified=new Date().toISOString(),al(),cr(),typeof window.processGamification=="function"){const o=window.processGamification(a);rl(o)}window.debouncedSaveToGithub(),window.render()}function Ge(){const e=r.activePerspective==="calendar"?"inbox":r.activePerspective;je(vc,{activeTab:r.activeTab,activeSubTab:r.activeSubTab,activePerspective:e,workspaceContentMode:r.workspaceContentMode||"both",activeFilterType:r.activeFilterType,activeAreaFilter:r.activeAreaFilter,activeLabelFilter:r.activeLabelFilter,activePersonFilter:r.activePersonFilter,activeCategoryFilter:r.activeCategoryFilter})}function Pc(){je(Wr,r.WEIGHTS)}function Xh(){je(sa,r.MAX_SCORES)}function Qh(){je(Ot,r.homeWidgets)}function Zh(){je(os,[...r.collapsedNotes])}function rl(e){if(e){if(e.xpResult?.levelUp){const t=typeof window.getLevelInfo=="function"?window.getLevelInfo(r.xp?.total||0):null;t&&(r.undoAction={label:`Level Up! Level ${t.level} — ${t.tierIcon} ${t.tierName}`,snapshot:null,restoreFn:null},r.undoTimerRemaining=5,r.undoTimerId&&clearInterval(r.undoTimerId),r.undoTimerId=setInterval(()=>{r.undoTimerRemaining--,r.undoTimerRemaining<=0&&(clearInterval(r.undoTimerId),r.undoAction=null,r.undoTimerId=null,typeof window.render=="function"&&window.render())},1e3))}e.newAchievements?.length>0&&e.newAchievements.forEach(t=>{typeof window.markAchievementNotified=="function"&&window.markAchievementNotified(t)})}}function al(){r.scoresCache.clear(),r.scoresCacheVersion++}const em="homebase-880f0",tm=1e5;function Nc(){try{return window.getCurrentUser?.()?.uid||null}catch{return null}}function Lc(){return typeof crypto<"u"&&crypto.subtle}function Sr(e){return btoa(String.fromCharCode(...new Uint8Array(e)))}function Tr(e){const t=atob(e),n=new Uint8Array(t.length);for(let a=0;a<t.length;a++)n[a]=t.charCodeAt(a);return n.buffer}async function Oc(e,t){const n=new TextEncoder,a=await crypto.subtle.importKey("raw",n.encode(e+em),"PBKDF2",!1,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt:t,iterations:tm,hash:"SHA-256"},a,{name:"AES-GCM",length:256},!1,["wrapKey","unwrapKey"])}async function nm(e,t){const n=crypto.getRandomValues(new Uint8Array(16)),a=await crypto.subtle.generateKey({name:"AES-GCM",length:256},!0,["encrypt","decrypt"]),s=await Oc(t,n),o=crypto.getRandomValues(new Uint8Array(12)),i=await crypto.subtle.wrapKey("raw",a,s,{name:"AES-GCM",iv:o}),l=crypto.getRandomValues(new Uint8Array(12)),d=new TextEncoder().encode(JSON.stringify(e)),c=await crypto.subtle.encrypt({name:"AES-GCM",iv:l},a,d);return{version:1,salt:Sr(n),wrapIv:Sr(o),wrappedKey:Sr(i),dataIv:Sr(l),data:Sr(c),updatedAt:new Date().toISOString()}}async function rm(e,t){const n=new Uint8Array(Tr(e.salt)),a=new Uint8Array(Tr(e.wrapIv)),s=Tr(e.wrappedKey),o=new Uint8Array(Tr(e.dataIv)),i=Tr(e.data),l=await Oc(t,n),d=await crypto.subtle.unwrapKey("raw",s,l,{name:"AES-GCM",iv:a},{name:"AES-GCM",length:256},!1,["decrypt"]),c=await crypto.subtle.decrypt({name:"AES-GCM",iv:o},d,i);return JSON.parse(new TextDecoder().decode(c))}async function am(){if(!Lc())return null;const e=Nc();if(!e)return null;const t={};let n=0;for(const{localStorage:a,id:s}of Yi){const o=localStorage.getItem(a);o&&(t[s]=o,n++)}if(n===0)return null;try{return await nm(t,e)}catch(a){return console.warn("Credential encryption failed:",a.message),null}}async function sm(e){if(!e||e.version!==1||!Lc())return!1;const t=Nc();if(!t)return!1;const n=await rm(e,t);let a=0;for(const{localStorage:s,id:o}of Yi)!localStorage.getItem(s)&&n[o]&&(localStorage.setItem(s,n[o]),a++);return a>0&&console.log(`Restored ${a} credential(s) from cloud`),a>0}function Rc(){let e=0;for(const{localStorage:t}of Yi)localStorage.getItem(t)&&e++;return{hasCreds:e>0,count:e}}function Ve(e){const t=e?new Date(e).getTime():0;return Number.isFinite(t)?t:0}function fd(e){return e===""||e===null||e===void 0}function cs(e){return!!e&&typeof e=="object"&&!Array.isArray(e)}function om(e){const t=[];return e.data&&typeof e.data!="object"&&t.push("data must be an object"),e.tasks&&!Array.isArray(e.tasks)&&t.push("tasks must be an array"),e.taskCategories&&!Array.isArray(e.taskCategories)&&t.push("taskCategories must be an array"),e.taskLabels&&!Array.isArray(e.taskLabels)&&t.push("taskLabels must be an array"),e.taskPeople&&!Array.isArray(e.taskPeople)&&t.push("taskPeople must be an array"),e.customPerspectives&&!Array.isArray(e.customPerspectives)&&t.push("customPerspectives must be an array"),e.homeWidgets&&!Array.isArray(e.homeWidgets)&&t.push("homeWidgets must be an array"),e.triggers&&!Array.isArray(e.triggers)&&t.push("triggers must be an array"),e.lastUpdated&&isNaN(new Date(e.lastUpdated).getTime())&&t.push("lastUpdated is not a valid date"),e.meetingNotesByEvent&&typeof e.meetingNotesByEvent!="object"&&t.push("meetingNotesByEvent must be an object"),Array.isArray(e.tasks)&&e.tasks.slice(0,5).forEach((a,s)=>{!a||typeof a!="object"?t.push(`tasks[${s}] is not an object`):a.id||t.push(`tasks[${s}] missing id`)}),t}function Bc(e){if(!e||typeof e!="object")return{};const t=Date.now(),n=4320*60*60*1e3,a={};return Object.entries(e).forEach(([s,o])=>{if(!s)return;const i=Ve(o);i&&(t-i>n||(a[String(s)]=new Date(i).toISOString()))}),a}function im(e){if(!e||typeof e!="object")return{};const t={};return Object.entries(e).forEach(([n,a])=>{!a||typeof a!="object"||(t[n]=Bc(a))}),t}function lm(e,t){const n=["prayers","glucose","whoop","libre","family","habits"];return Object.keys(t).forEach(a=>{if(!e[a]){e[a]=t[a];return}const s=e[a],o=t[a];n.forEach(i=>{if(o[i]){if(!s[i]){s[i]=o[i];return}Object.keys(o[i]).forEach(l=>{fd(s[i][l])&&!fd(o[i][l])&&(s[i][l]=o[i][l])})}})}),e}function dm(e=[],t=[],n=[],a=null){const s=Array.isArray(e)?e:[],o=Array.isArray(t)?t:[],i=new Map;return s.forEach(l=>{if(cs(l)&&l.id){if(a&&a(l.id))return;i.set(l.id,l)}}),o.forEach(l=>{if(!cs(l)||!l.id||a&&a(l.id))return;const d=i.get(l.id);if(!d){i.set(l.id,l);return}if(!n.length)return;const c=Ve(n.map(v=>d[v]).find(Boolean));Ve(n.map(v=>l[v]).find(Boolean))>c&&i.set(l.id,l)}),Array.from(i.values())}function Gt(){return localStorage.getItem(Ui)||""}function cm(e){localStorage.setItem(Ui,e),window.render()}function us(){return localStorage.getItem(Gi)||"things3"}function um(e){localStorage.setItem(Gi,e),document.documentElement.setAttribute("data-theme",e),sl(),window.render()}function jc(){const e=us(),t=Yr();document.documentElement.setAttribute("data-theme",e),document.documentElement.setAttribute("data-mode",t),sl()}function Yr(){return localStorage.getItem(mc)||"light"}function Fc(e){localStorage.setItem(mc,e),document.documentElement.setAttribute("data-mode",e),sl(),window.render()}function fm(){Fc(Yr()==="light"?"dark":"light")}function sl(){requestAnimationFrame(()=>{const e=getComputedStyle(document.documentElement).getPropertyValue("--bg-primary").trim(),t=document.querySelector('meta[name="theme-color"]');t&&e&&t.setAttribute("content",e)})}function pm(){return getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()}function hm(){const e=getComputedStyle(document.documentElement);return{accent:e.getPropertyValue("--accent").trim(),accentDark:e.getPropertyValue("--accent-dark").trim(),accentLight:e.getPropertyValue("--accent-light").trim(),bgPrimary:e.getPropertyValue("--bg-primary").trim(),bgSecondary:e.getPropertyValue("--bg-secondary").trim(),textPrimary:e.getPropertyValue("--text-primary").trim()}}function fs(e,t={},n=3e4){const a=new AbortController,s=setTimeout(()=>a.abort(),n);return fetch(e,{...t,signal:a.signal}).finally(()=>clearTimeout(s))}function mm(e){return typeof structuredClone=="function"?structuredClone(e):JSON.parse(JSON.stringify(e))}function yt(e,t,n=0,a=""){const s={type:e,status:t,timestamp:new Date().toISOString(),latencyMs:n,details:a};if(r.syncHealth.recentEvents.unshift(s),r.syncHealth.recentEvents=r.syncHealth.recentEvents.slice(0,20),e==="save")if(r.syncHealth.totalSaves++,t==="success"){r.syncHealth.successfulSaves++,r.syncHealth.lastSaveLatencyMs=n;const o=r.syncHealth.successfulSaves;r.syncHealth.avgSaveLatencyMs=Math.round((r.syncHealth.avgSaveLatencyMs*(o-1)+n)/o)}else r.syncHealth.failedSaves++,r.syncHealth.lastError={message:a,timestamp:s.timestamp,type:e};else e==="load"&&(r.syncHealth.totalLoads++,t==="success"?r.syncHealth.successfulLoads++:(r.syncHealth.failedLoads++,r.syncHealth.lastError={message:a,timestamp:s.timestamp,type:e}));try{localStorage.setItem(kc,JSON.stringify(r.syncHealth))}catch{}}function Hc(){return r.syncHealth}async function zc(e){const t=new TextEncoder().encode(e),n=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(n)).map(a=>a.toString(16).padStart(2,"0")).join("")}function Wc(e){return om(e)}async function Uc(e){if(!e._checksum)return!0;const{_checksum:t,...n}=e,a=JSON.stringify(n);return await zc(a)===t}function Gc(e){return e._schemaVersion&&e._schemaVersion>is?(console.warn(`Cloud data is schema v${e._schemaVersion}, this app supports v${is}`),We("error","Cloud data is from a newer app version. Please update."),!1):!0}const gm=900*1e3;let Fn=null;function _o(){Fn&&clearInterval(Fn),Fn=setInterval(async()=>{if(!(!Gt()||!navigator.onLine)&&!r.syncInProgress)try{await da(),typeof window.render=="function"&&window.render()}catch(e){console.warn("Periodic sync failed:",e.message)}},gm)}function vm(){Fn&&(clearInterval(Fn),Fn=null)}function We(e,t=""){r.syncStatus=e;const n=document.getElementById("sync-indicator");if(n){const a={idle:"bg-[var(--text-muted)]",syncing:"bg-[var(--warning)] animate-pulse",success:"bg-[var(--success)]",error:"bg-[var(--danger)]"};n.className=`w-2 h-2 rounded-full ${a[e]}`,n.title=t||e}e==="success"&&(r.lastSyncTime=new Date,setTimeout(()=>{r.syncStatus==="success"&&We("idle")},3e3))}function Vc(e){lm(r.allData,e)}function cn(e,t,n){if(!t)return;const a=r[e],s=Ve(t?._updatedAt),o=Ve(a?._updatedAt);(!o||s>o)&&(r[e]=t,localStorage.setItem(n,JSON.stringify(t)))}function pd(e){const t=Array.isArray(r.conflictNotifications)?r.conflictNotifications:[];t.unshift({id:`conf_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,createdAt:new Date().toISOString(),...e}),r.conflictNotifications=t.slice(0,100),localStorage.setItem(lr,JSON.stringify(r.conflictNotifications))}function bm(e){r.conflictNotifications=(r.conflictNotifications||[]).filter(t=>t.id!==e),localStorage.setItem(lr,JSON.stringify(r.conflictNotifications)),window.render()}function ym(){r.conflictNotifications=[],localStorage.setItem(lr,"[]"),window.render()}function ai(e={}){if(!e||typeof e!="object")return;const n={...r.meetingNotesByEvent&&typeof r.meetingNotesByEvent=="object"?r.meetingNotesByEvent:{}};Object.entries(e).forEach(([a,s])=>{if(!s||typeof s!="object")return;const o=n[a];if(!o){n[a]=s;return}const i=Ve(o.updatedAt||o.createdAt);Ve(s.updatedAt||s.createdAt)>i&&(n[a]=s)}),r.meetingNotesByEvent=n,localStorage.setItem(ir,JSON.stringify(n))}function si(e){return Bc(e)}function oi(e){return im(e)}function wm(e){const t=oi(r.deletedEntityTombstones),n=oi(e),a={...t};Object.entries(n).forEach(([s,o])=>{const i=a[s]||{},l={...i};Object.entries(o).forEach(([d,c])=>{const h=Ve(i[d]);Ve(c)>h&&(l[d]=c)}),a[s]=l}),r.deletedEntityTombstones=a,localStorage.setItem(sr,JSON.stringify(a))}function Ft(e,t){if(!e||!t)return!1;const n=r.deletedEntityTombstones&&typeof r.deletedEntityTombstones=="object"?r.deletedEntityTombstones:{};return!!(n[e]&&n[e][String(t)])}function xm(){r.taskAreas=(r.taskAreas||[]).filter(e=>!Ft("taskCategories",e?.id)),localStorage.setItem(Qt,JSON.stringify(r.taskAreas)),r.taskCategories=(r.taskCategories||[]).filter(e=>!Ft("categories",e?.id)),localStorage.setItem(_n,JSON.stringify(r.taskCategories)),r.taskLabels=(r.taskLabels||[]).filter(e=>!Ft("taskLabels",e?.id)),localStorage.setItem(Zt,JSON.stringify(r.taskLabels)),r.taskPeople=(r.taskPeople||[]).filter(e=>!Ft("taskPeople",e?.id)),localStorage.setItem(en,JSON.stringify(r.taskPeople)),r.customPerspectives=(r.customPerspectives||[]).filter(e=>!Ft("customPerspectives",e?.id)),localStorage.setItem(Dn,JSON.stringify(r.customPerspectives)),r.homeWidgets=(r.homeWidgets||[]).filter(e=>!Ft("homeWidgets",e?.id)),localStorage.setItem(Ot,JSON.stringify(r.homeWidgets)),r.triggers=(r.triggers||[]).filter(e=>!Ft("triggers",e?.id)),localStorage.setItem(tn,JSON.stringify(r.triggers))}function km(e){const t=si(r.deletedTaskTombstones),n=si(e),a={...t};Object.entries(n).forEach(([s,o])=>{const i=Ve(a[s]);Ve(o)>i&&(a[s]=o)}),r.deletedTaskTombstones=a,localStorage.setItem(ar,JSON.stringify(a))}function ii(e){return e?!!(r.deletedTaskTombstones&&typeof r.deletedTaskTombstones=="object"?r.deletedTaskTombstones:{})[String(e)]:!1}function Sm(){const e=Array.isArray(r.tasksData)?r.tasksData.length:0;r.tasksData=(r.tasksData||[]).filter(t=>!ii(t?.id)),r.tasksData.length!==e&&localStorage.setItem($n,JSON.stringify(r.tasksData))}function Bt(e=[],t=[],n=[],a=""){const o=dm(e,t,n,a?l=>Ft(a,l):null),i=new Map;return(Array.isArray(e)?e:[]).forEach(l=>{cs(l)&&l.id&&i.set(l.id,l)}),(Array.isArray(t)?t:[]).forEach(l=>{if(!cs(l)||!l.id)return;const d=i.get(l.id);if(d)if(!n.length)JSON.stringify(d)!==JSON.stringify(l)&&pd({entity:"collection",mode:"local_wins",itemId:String(l.id),reason:"No timestamp field for deterministic newest-wins merge"});else{const c=Ve(n.map(v=>d[v]).find(Boolean));Ve(n.map(v=>l[v]).find(Boolean))===c&&JSON.stringify(d)!==JSON.stringify(l)&&pd({entity:"timestamped_collection",mode:"local_wins_tie",itemId:String(l.id),reason:"Tied timestamps with different payloads"})}}),o}function li(e={}){km(e.deletedTaskTombstones),wm(e.deletedEntityTombstones),xm(),Sm();const t=Array.isArray(e.tasks)?e.tasks.filter(h=>!ii(h?.id)):[],n=Bt(r.tasksData,t,["updatedAt","createdAt"]).filter(h=>!ii(h?.id));r.tasksData=n,localStorage.setItem($n,JSON.stringify(r.tasksData));const a=["updatedAt","createdAt"],s=Bt(r.taskAreas,e.taskCategories,a,"taskCategories");r.taskAreas=s,localStorage.setItem(Qt,JSON.stringify(r.taskAreas));const o=Bt(r.taskCategories,e.categories,a,"categories");r.taskCategories=o,localStorage.setItem(_n,JSON.stringify(r.taskCategories));const i=Bt(r.taskLabels,e.taskLabels,a,"taskLabels");r.taskLabels=i,localStorage.setItem(Zt,JSON.stringify(r.taskLabels));const l=Bt(r.taskPeople,e.taskPeople,a,"taskPeople");r.taskPeople=l.map(h=>({...h,email:typeof h?.email=="string"?h.email:"",jobTitle:typeof h?.jobTitle=="string"?h.jobTitle:"",photoUrl:typeof h?.photoUrl=="string"?h.photoUrl:"",photoData:typeof h?.photoData=="string"?h.photoData:""})),localStorage.setItem(en,JSON.stringify(r.taskPeople));const d=Bt(r.customPerspectives,e.customPerspectives,a,"customPerspectives");r.customPerspectives=d,localStorage.setItem(Dn,JSON.stringify(r.customPerspectives));const c=Bt(r.homeWidgets,e.homeWidgets,["updatedAt","createdAt"],"homeWidgets");if(r.homeWidgets=c,localStorage.setItem(Ot,JSON.stringify(r.homeWidgets)),Array.isArray(e.triggers)){const h=Bt(r.triggers,e.triggers,["updatedAt","createdAt"],"triggers");r.triggers=h,localStorage.setItem(tn,JSON.stringify(r.triggers))}}function hd(e){r.allData=e.allData,r.tasksData=e.tasksData,r.deletedTaskTombstones=e.deletedTaskTombstones,r.deletedEntityTombstones=e.deletedEntityTombstones,r.taskAreas=e.taskAreas,r.taskCategories=e.taskCategories,r.taskLabels=e.taskLabels,r.taskPeople=e.taskPeople,r.customPerspectives=e.customPerspectives,r.homeWidgets=e.homeWidgets,r.triggers=e.triggers,r.meetingNotesByEvent=e.meetingNotesByEvent,r.conflictNotifications=e.conflictNotifications,localStorage.setItem(kn,JSON.stringify(e.allData)),localStorage.setItem($n,JSON.stringify(e.tasksData)),localStorage.setItem(ar,JSON.stringify(e.deletedTaskTombstones)),localStorage.setItem(sr,JSON.stringify(e.deletedEntityTombstones)),localStorage.setItem(Qt,JSON.stringify(e.taskAreas)),localStorage.setItem(_n,JSON.stringify(e.taskCategories)),localStorage.setItem(Zt,JSON.stringify(e.taskLabels)),localStorage.setItem(en,JSON.stringify(e.taskPeople)),localStorage.setItem(Dn,JSON.stringify(e.customPerspectives)),localStorage.setItem(Ot,JSON.stringify(e.homeWidgets)),localStorage.setItem(tn,JSON.stringify(e.triggers)),localStorage.setItem(ir,JSON.stringify(e.meetingNotesByEvent)),localStorage.setItem(lr,JSON.stringify(e.conflictNotifications)),console.log("Rolled back pull-merge after PUT failure")}async function mn(e={}){const t=Gt();if(!t)return console.log("No GitHub token configured"),!1;if(r.syncInProgress)return r.syncPendingRetry=!0,!1;r.syncInProgress=!0,We("syncing","Saving to GitHub...");const n=performance.now();let a=null;try{const s=await fs(`https://api.github.com/repos/${Qo}/${Zo}/contents/${ei}`,{headers:{Authorization:`token ${t}`}});let o=null;if(s.ok){const m=await s.json();o=m.sha;try{const g=atob(m.content),y=Uint8Array.from(g,E=>E.codePointAt(0)),u=new TextDecoder().decode(y),x=JSON.parse(u),k=Wc(x);k.length>0?console.warn("Cloud payload validation failed during pull-merge:",k):Gc(x)?await Uc(x)?(a=mm({allData:r.allData,tasksData:r.tasksData,deletedTaskTombstones:r.deletedTaskTombstones,deletedEntityTombstones:r.deletedEntityTombstones,taskAreas:r.taskAreas,taskCategories:r.taskCategories,taskLabels:r.taskLabels,taskPeople:r.taskPeople,customPerspectives:r.customPerspectives,homeWidgets:r.homeWidgets,triggers:r.triggers||[],meetingNotesByEvent:r.meetingNotesByEvent||{},conflictNotifications:r.conflictNotifications||[]}),x?.data&&Vc(x.data),x&&li(x),x?.meetingNotesByEvent&&ai(x.meetingNotesByEvent)):console.warn("Cloud data checksum mismatch during pull-merge — skipping merge"):console.warn("Skipping pull-merge: cloud schema version is newer")}catch(g){console.warn("Cloud merge error:",g.message)}}r.syncSequence++,localStorage.setItem(Ji,r.syncSequence.toString());const i={_schemaVersion:is,_sequence:r.syncSequence,lastUpdated:new Date().toISOString(),data:r.allData,weights:r.WEIGHTS,maxScores:r.MAX_SCORES,categoryWeights:r.CATEGORY_WEIGHTS,tasks:r.tasksData,deletedTaskTombstones:si(r.deletedTaskTombstones),deletedEntityTombstones:oi(r.deletedEntityTombstones),taskCategories:r.taskAreas,categories:r.taskCategories,taskLabels:r.taskLabels,taskPeople:r.taskPeople,customPerspectives:r.customPerspectives,homeWidgets:r.homeWidgets,meetingNotesByEvent:r.meetingNotesByEvent||{},triggers:r.triggers||[],encryptedCredentials:await am(),xp:r.xp,streak:r.streak,achievements:r.achievements},l=JSON.stringify(i);i._checksum=await zc(l);const d=JSON.stringify(i),c=Math.round(new TextEncoder().encode(d).byteLength/1024);c>800&&console.warn(`Sync payload ${c}KB — approaching GitHub API limit (1MB)`);const h=new TextEncoder().encode(d),v=Array.from(h,m=>String.fromCodePoint(m)).join(""),f=btoa(v),p=await fs(`https://api.github.com/repos/${Qo}/${Zo}/contents/${ei}`,{method:"PUT",headers:{Authorization:`token ${t}`,"Content-Type":"application/json"},body:JSON.stringify({message:`Auto-save: ${new Date().toLocaleString()}`,content:f,...o?{sha:o}:{}}),keepalive:!!e.keepalive});if(p.ok){const m=Math.round(performance.now()-n);if(a)try{localStorage.setItem(kn,JSON.stringify(r.allData)),localStorage.setItem($n,JSON.stringify(r.tasksData)),localStorage.setItem(ar,JSON.stringify(r.deletedTaskTombstones)),localStorage.setItem(sr,JSON.stringify(r.deletedEntityTombstones)),localStorage.setItem(Qt,JSON.stringify(r.taskAreas)),localStorage.setItem(_n,JSON.stringify(r.taskCategories)),localStorage.setItem(Zt,JSON.stringify(r.taskLabels)),localStorage.setItem(en,JSON.stringify(r.taskPeople)),localStorage.setItem(Dn,JSON.stringify(r.customPerspectives)),localStorage.setItem(Ot,JSON.stringify(r.homeWidgets)),localStorage.setItem(tn,JSON.stringify(r.triggers)),localStorage.setItem(ir,JSON.stringify(r.meetingNotesByEvent||{})),localStorage.setItem(lr,JSON.stringify(r.conflictNotifications||[]))}catch(g){console.warn("localStorage quota exceeded during sync persist — cloud has full state, dirty flag preserved:",g.message),g.name==="QuotaExceededError"&&(r.quotaExceededError=!0)}return r.syncRetryCount=0,r.syncRateLimited=!1,r.githubSyncDirty=!1,localStorage.setItem(zs,"false"),r.syncRetryTimer&&(clearTimeout(r.syncRetryTimer),r.syncRetryTimer=null),yt("save","success",m,`${c}KB`),We("success","Saved to GitHub"),console.log(`Saved to GitHub (${c}KB, ${m}ms)`),!0}else{a&&hd(a);let m=`HTTP ${p.status}`;try{m=(await p.json()).message||m}catch{}throw p.status===409?new Error("Conflict: file changed by another device"):p.status===401?new Error("GitHub token is invalid or expired"):p.status===403?(r.syncRateLimited=!0,setTimeout(()=>{r.syncRateLimited=!1},6e4),new Error("GitHub rate limit exceeded — try again later")):new Error(m)}}catch(s){const o=Math.round(performance.now()-n);a&&hd(a),We("error",`Sync failed: ${s.message}`),console.error("GitHub save failed:",s),yt("save","error",o,s.message);const c=s.message.includes("Conflict")?6:4;if(r.syncRetryCount<c){r.syncRetryCount++;const h=Math.min(2e3*Math.pow(2,r.syncRetryCount),3e4),v=Math.random()*h*.5,f=Math.round(h+v);console.log(`Retrying save in ${f/1e3}s (attempt ${r.syncRetryCount}/${c})`),r.syncRetryTimer&&clearTimeout(r.syncRetryTimer),r.syncRetryTimer=setTimeout(()=>{r.syncRetryTimer=null,mn().catch(p=>console.error("Retry save failed:",p))},f)}return!1}finally{r.syncInProgress=!1,r.syncPendingRetry&&(r.syncPendingRetry=!1,ol()),r.cloudPullPending&&(r.cloudPullPending=!1,da().then(()=>{typeof window.render=="function"&&window.render()}).catch(()=>{}))}}function ol(){r.githubSyncDirty=!0,localStorage.setItem(zs,"true"),r.syncDebounceTimer&&clearTimeout(r.syncDebounceTimer),r.syncRetryTimer&&(clearTimeout(r.syncRetryTimer),r.syncRetryTimer=null),r.syncRateLimited||(r.syncRetryCount=0),r.syncDebounceTimer=setTimeout(()=>{r.syncDebounceTimer=null,mn().catch(e=>console.error("Debounced save failed:",e))},2e3)}function md(e={}){if(r.syncDebounceTimer){clearTimeout(r.syncDebounceTimer),r.syncDebounceTimer=null,r.githubSyncDirty=!0;try{localStorage.setItem(zs,"true")}catch{}mn(e).catch(t=>console.error("Flush save failed:",t))}}async function da(){if(r.syncInProgress){r.cloudPullPending=!0;return}r.syncInProgress=!0;const e=Gt();function t(a,s){const o=localStorage.getItem(za);if(!a)return!1;const i=r.syncSequence;if(typeof s=="number"&&s>0){if(s>i)return!0;if(s<i)return!1}const l=o?new Date(parseInt(o,10)):null,d=new Date(a);return!l||isNaN(l.getTime())?!0:d>l}function n(a){if(a?.data){if(t(a.lastUpdated,a._sequence)){localStorage.setItem(kn,JSON.stringify(a.data)),r.allData=a.data,localStorage.setItem(za,new Date(a.lastUpdated).getTime().toString());return}Vc(a.data),localStorage.setItem(kn,JSON.stringify(r.allData)),localStorage.setItem(za,Date.now().toString())}}try{if(e){const s=await fs(`https://api.github.com/repos/${Qo}/${Zo}/contents/${ei}`,{headers:{Authorization:`token ${e}`}});if(s.ok){const o=await s.json(),i=atob(o.content),l=Uint8Array.from(i,f=>f.codePointAt(0)),d=new TextDecoder().decode(l);let c;try{c=JSON.parse(d)}catch(f){console.error("Failed to parse cloud data:",f),We("error","Corrupted cloud data"),yt("load","error",0,"JSON parse failed");return}if(!await Uc(c)){console.error("Cloud data checksum mismatch — possible corruption"),We("error","Cloud data integrity check failed"),yt("load","error",0,"Checksum mismatch");return}if(!Gc(c)){yt("load","error",0,`Schema v${c._schemaVersion} > v${is}`);return}const v=Wc(c);if(v.length>0){console.error("Cloud payload validation failed:",v),We("error","Cloud data failed validation"),yt("load","error",0,`Validation: ${v.join("; ")}`);return}if(typeof c._sequence=="number"&&c._sequence>r.syncSequence&&(r.syncSequence=c._sequence,localStorage.setItem(Ji,r.syncSequence.toString())),n(c),cn("WEIGHTS",c.weights,Wr),cn("MAX_SCORES",c.maxScores,sa),li(c),c.meetingNotesByEvent&&ai(c.meetingNotesByEvent),cn("CATEGORY_WEIGHTS",c.categoryWeights,Vs),cn("xp",c.xp,Ws),cn("streak",c.streak,Us),cn("achievements",c.achievements,Gs),c.encryptedCredentials)try{await sm(c.encryptedCredentials)}catch(f){console.warn("Credential restore skipped:",f.message)}console.log("Loaded from GitHub"),yt("load","success"),We("success","Loaded from GitHub");return}else{if(s.status===401)throw We("error","GitHub token invalid or expired"),console.error("GitHub auth failed (401) — token may be expired"),yt("load","error",0,"Auth failed (401)"),Object.assign(new Error("Auth failed"),{status:401});if(s.status===403)throw We("error","GitHub rate limit exceeded"),console.error("GitHub rate limited (403)"),yt("load","error",0,"Rate limited (403)"),Object.assign(new Error("Rate limited"),{status:403});if(s.status===404)console.log("Cloud data file not found — first sync will create it");else throw new Error(`GitHub API returned ${s.status}`)}}const a=await fs(bh+"?t="+Date.now());if(a.ok){const s=await a.json();n(s),cn("WEIGHTS",s.weights,Wr),li(s),s.meetingNotesByEvent&&ai(s.meetingNotesByEvent),console.log("Cloud data synced (static file)"),Tm()}}catch(a){if(a.name==="AbortError"||!navigator.onLine)console.log("Offline mode — using local data");else if(console.error("Cloud load failed:",a.message),We("error",`Load failed: ${a.message}`),a.status!==401&&a.status!==403)throw a}finally{r.syncInProgress=!1}}async function qc(e=3){for(let t=0;t<=e;t++)try{await da();return}catch(n){if(n?.status===401||n?.status===403||!navigator.onLine||n?.name==="AbortError")return;if(t<e){const a=2e3*Math.pow(2,t);console.log(`Cloud load retry ${t+1}/${e} in ${a/1e3}s`),await new Promise(s=>setTimeout(s,a))}else console.error("Cloud load failed after",e,"retries")}}function Tm(){r.scoresCache.clear(),r.scoresCacheVersion++}function Im(){const e={data:r.allData,weights:r.WEIGHTS,maxScores:r.MAX_SCORES,categoryWeights:r.CATEGORY_WEIGHTS,tasks:r.tasksData,taskCategories:r.taskAreas,categories:r.taskCategories,taskLabels:r.taskLabels,taskPeople:r.taskPeople,customPerspectives:r.customPerspectives,homeWidgets:r.homeWidgets,triggers:r.triggers,meetingNotesByEvent:r.meetingNotesByEvent||{},xp:r.xp,streak:r.streak,achievements:r.achievements,deletedTaskTombstones:r.deletedTaskTombstones||{},deletedEntityTombstones:r.deletedEntityTombstones||{},lastUpdated:new Date().toISOString()},t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),n=URL.createObjectURL(t),a=document.createElement("a");a.href=n,a.download="life-gamification-backup-"+he()+".json",a.click(),URL.revokeObjectURL(n)}function Cm(e){const t=[];return!e||typeof e!="object"?(t.push("File is not a valid JSON object"),t):["data","weights","tasks","taskCategories","categories","taskLabels","taskPeople","customPerspectives","homeWidgets","triggers","meetingNotesByEvent","xp","streak","achievements","maxScores","categoryWeights","deletedTaskTombstones","deletedEntityTombstones"].some(s=>e[s]!==void 0)?(e.data!==void 0&&(typeof e.data!="object"||Array.isArray(e.data))&&t.push("data must be an object (daily tracking entries)"),e.tasks!==void 0&&!Array.isArray(e.tasks)&&t.push("tasks must be an array"),e.tasks&&Array.isArray(e.tasks)&&e.tasks.slice(0,5).forEach((o,i)=>{!o||typeof o!="object"?t.push(`tasks[${i}] is not an object`):o.id||t.push(`tasks[${i}] missing id`)}),e.taskCategories!==void 0&&!Array.isArray(e.taskCategories)&&t.push("taskCategories must be an array"),e.categories!==void 0&&!Array.isArray(e.categories)&&t.push("categories must be an array"),e.taskLabels!==void 0&&!Array.isArray(e.taskLabels)&&t.push("taskLabels must be an array"),e.taskPeople!==void 0&&!Array.isArray(e.taskPeople)&&t.push("taskPeople must be an array"),t):(t.push("File does not contain any recognized Homebase data"),t)}function Em(){const e={data:r.allData,weights:r.WEIGHTS,maxScores:r.MAX_SCORES,categoryWeights:r.CATEGORY_WEIGHTS,tasks:r.tasksData,taskCategories:r.taskAreas,categories:r.taskCategories,taskLabels:r.taskLabels,taskPeople:r.taskPeople,customPerspectives:r.customPerspectives,homeWidgets:r.homeWidgets,triggers:r.triggers,meetingNotesByEvent:r.meetingNotesByEvent||{},xp:r.xp,streak:r.streak,achievements:r.achievements,deletedTaskTombstones:r.deletedTaskTombstones||{},deletedEntityTombstones:r.deletedEntityTombstones||{},lastUpdated:new Date().toISOString()};try{return localStorage.setItem("lifeGamification_preImportBackup",JSON.stringify(e)),!0}catch(t){return console.warn("Could not create pre-import backup:",t.message),!1}}function $m(e){const t=e.target.files[0];if(!t)return;const n=new FileReader;n.onload=a=>{try{const s=JSON.parse(a.target.result),o=Cm(s);if(o.length>0){alert(`Import failed — invalid data:

`+o.join(`
`));return}const i=Array.isArray(s.tasks)?s.tasks.length:0,l=s.data?Object.keys(s.data).length:0,d=s.lastUpdated?new Date(s.lastUpdated).toLocaleDateString():"unknown";if(!confirm(`Import backup from ${d}?

This will REPLACE your current data:
• ${i} tasks
• ${l} days of tracking data

A backup of your current data will be saved automatically.
Continue?`)||!Em()&&!confirm(`Warning: Could not create a safety backup (storage may be full).
Continue import anyway? Data cannot be recovered if something goes wrong.`))return;if(s.data&&(r.allData=s.data,cr()),s.weights&&(r.WEIGHTS={...s.weights,_updatedAt:new Date().toISOString()},Pc()),s.maxScores&&(r.MAX_SCORES={...s.maxScores,_updatedAt:new Date().toISOString()},localStorage.setItem(sa,JSON.stringify(r.MAX_SCORES))),s.categoryWeights&&(r.CATEGORY_WEIGHTS={...s.categoryWeights,_updatedAt:new Date().toISOString()},localStorage.setItem(Vs,JSON.stringify(r.CATEGORY_WEIGHTS))),s.xp&&(r.xp={...s.xp,_updatedAt:new Date().toISOString()},localStorage.setItem(Ws,JSON.stringify(r.xp))),s.streak&&(r.streak={...s.streak,_updatedAt:new Date().toISOString()},localStorage.setItem(Us,JSON.stringify(r.streak))),s.achievements&&(r.achievements={...s.achievements,_updatedAt:new Date().toISOString()},localStorage.setItem(Gs,JSON.stringify(r.achievements))),s.tasks&&(r.tasksData=s.tasks,localStorage.setItem($n,JSON.stringify(r.tasksData))),s.taskCategories&&(r.taskAreas=s.taskCategories,localStorage.setItem(Qt,JSON.stringify(r.taskAreas))),s.categories&&(r.taskCategories=s.categories,localStorage.setItem(_n,JSON.stringify(r.taskCategories))),s.taskLabels&&(r.taskLabels=s.taskLabels,localStorage.setItem(Zt,JSON.stringify(r.taskLabels))),s.taskPeople&&(r.taskPeople=s.taskPeople.map(v=>({...v,email:typeof v?.email=="string"?v.email:""})),localStorage.setItem(en,JSON.stringify(r.taskPeople))),s.customPerspectives&&(r.customPerspectives=s.customPerspectives,localStorage.setItem(Dn,JSON.stringify(r.customPerspectives))),s.homeWidgets&&(r.homeWidgets=s.homeWidgets,localStorage.setItem(Ot,JSON.stringify(r.homeWidgets))),s.triggers&&(r.triggers=s.triggers,localStorage.setItem(tn,JSON.stringify(r.triggers))),s.meetingNotesByEvent&&(r.meetingNotesByEvent=s.meetingNotesByEvent,localStorage.setItem(ir,JSON.stringify(r.meetingNotesByEvent))),s.deletedTaskTombstones&&(r.deletedTaskTombstones={...r.deletedTaskTombstones,...s.deletedTaskTombstones},localStorage.setItem(ar,JSON.stringify(r.deletedTaskTombstones))),s.deletedEntityTombstones){const v={...r.deletedEntityTombstones};for(const[f,p]of Object.entries(s.deletedEntityTombstones))v[f]={...v[f]||{},...p};r.deletedEntityTombstones=v,localStorage.setItem(sr,JSON.stringify(r.deletedEntityTombstones))}typeof window.invalidateScoresCache=="function"&&window.invalidateScoresCache(),alert("Data imported successfully!"),window.debouncedSaveToGithub(),window.render()}catch(s){alert("Error importing data: "+s.message)}},n.readAsText(t)}var Pa=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function Dm(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function Na(e){throw new Error('Could not dynamically require "'+e+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ao={exports:{}};var gd;function _m(){return gd||(gd=1,(function(e,t){(function(n){e.exports=n()})(function(){return(function n(a,s,o){function i(c,h){if(!s[c]){if(!a[c]){var v=typeof Na=="function"&&Na;if(!h&&v)return v(c,!0);if(l)return l(c,!0);var f=new Error("Cannot find module '"+c+"'");throw f.code="MODULE_NOT_FOUND",f}var p=s[c]={exports:{}};a[c][0].call(p.exports,function(m){var g=a[c][1][m];return i(g||m)},p,p.exports,n,a,s,o)}return s[c].exports}for(var l=typeof Na=="function"&&Na,d=0;d<o.length;d++)i(o[d]);return i})({1:[function(n,a,s){var o=n("./utils"),i=n("./support"),l="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";s.encode=function(d){for(var c,h,v,f,p,m,g,y=[],u=0,x=d.length,k=x,E=o.getTypeOf(d)!=="string";u<d.length;)k=x-u,v=E?(c=d[u++],h=u<x?d[u++]:0,u<x?d[u++]:0):(c=d.charCodeAt(u++),h=u<x?d.charCodeAt(u++):0,u<x?d.charCodeAt(u++):0),f=c>>2,p=(3&c)<<4|h>>4,m=1<k?(15&h)<<2|v>>6:64,g=2<k?63&v:64,y.push(l.charAt(f)+l.charAt(p)+l.charAt(m)+l.charAt(g));return y.join("")},s.decode=function(d){var c,h,v,f,p,m,g=0,y=0,u="data:";if(d.substr(0,u.length)===u)throw new Error("Invalid base64 input, it looks like a data url.");var x,k=3*(d=d.replace(/[^A-Za-z0-9+/=]/g,"")).length/4;if(d.charAt(d.length-1)===l.charAt(64)&&k--,d.charAt(d.length-2)===l.charAt(64)&&k--,k%1!=0)throw new Error("Invalid base64 input, bad content length.");for(x=i.uint8array?new Uint8Array(0|k):new Array(0|k);g<d.length;)c=l.indexOf(d.charAt(g++))<<2|(f=l.indexOf(d.charAt(g++)))>>4,h=(15&f)<<4|(p=l.indexOf(d.charAt(g++)))>>2,v=(3&p)<<6|(m=l.indexOf(d.charAt(g++))),x[y++]=c,p!==64&&(x[y++]=h),m!==64&&(x[y++]=v);return x}},{"./support":30,"./utils":32}],2:[function(n,a,s){var o=n("./external"),i=n("./stream/DataWorker"),l=n("./stream/Crc32Probe"),d=n("./stream/DataLengthProbe");function c(h,v,f,p,m){this.compressedSize=h,this.uncompressedSize=v,this.crc32=f,this.compression=p,this.compressedContent=m}c.prototype={getContentWorker:function(){var h=new i(o.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new d("data_length")),v=this;return h.on("end",function(){if(this.streamInfo.data_length!==v.uncompressedSize)throw new Error("Bug : uncompressed data size mismatch")}),h},getCompressedWorker:function(){return new i(o.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize",this.compressedSize).withStreamInfo("uncompressedSize",this.uncompressedSize).withStreamInfo("crc32",this.crc32).withStreamInfo("compression",this.compression)}},c.createWorkerFrom=function(h,v,f){return h.pipe(new l).pipe(new d("uncompressedSize")).pipe(v.compressWorker(f)).pipe(new d("compressedSize")).withStreamInfo("compression",v)},a.exports=c},{"./external":6,"./stream/Crc32Probe":25,"./stream/DataLengthProbe":26,"./stream/DataWorker":27}],3:[function(n,a,s){var o=n("./stream/GenericWorker");s.STORE={magic:"\0\0",compressWorker:function(){return new o("STORE compression")},uncompressWorker:function(){return new o("STORE decompression")}},s.DEFLATE=n("./flate")},{"./flate":7,"./stream/GenericWorker":28}],4:[function(n,a,s){var o=n("./utils"),i=(function(){for(var l,d=[],c=0;c<256;c++){l=c;for(var h=0;h<8;h++)l=1&l?3988292384^l>>>1:l>>>1;d[c]=l}return d})();a.exports=function(l,d){return l!==void 0&&l.length?o.getTypeOf(l)!=="string"?(function(c,h,v,f){var p=i,m=f+v;c^=-1;for(var g=f;g<m;g++)c=c>>>8^p[255&(c^h[g])];return-1^c})(0|d,l,l.length,0):(function(c,h,v,f){var p=i,m=f+v;c^=-1;for(var g=f;g<m;g++)c=c>>>8^p[255&(c^h.charCodeAt(g))];return-1^c})(0|d,l,l.length,0):0}},{"./utils":32}],5:[function(n,a,s){s.base64=!1,s.binary=!1,s.dir=!1,s.createFolders=!0,s.date=null,s.compression=null,s.compressionOptions=null,s.comment=null,s.unixPermissions=null,s.dosPermissions=null},{}],6:[function(n,a,s){var o=null;o=typeof Promise<"u"?Promise:n("lie"),a.exports={Promise:o}},{lie:37}],7:[function(n,a,s){var o=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Uint32Array<"u",i=n("pako"),l=n("./utils"),d=n("./stream/GenericWorker"),c=o?"uint8array":"array";function h(v,f){d.call(this,"FlateWorker/"+v),this._pako=null,this._pakoAction=v,this._pakoOptions=f,this.meta={}}s.magic="\b\0",l.inherits(h,d),h.prototype.processChunk=function(v){this.meta=v.meta,this._pako===null&&this._createPako(),this._pako.push(l.transformTo(c,v.data),!1)},h.prototype.flush=function(){d.prototype.flush.call(this),this._pako===null&&this._createPako(),this._pako.push([],!0)},h.prototype.cleanUp=function(){d.prototype.cleanUp.call(this),this._pako=null},h.prototype._createPako=function(){this._pako=new i[this._pakoAction]({raw:!0,level:this._pakoOptions.level||-1});var v=this;this._pako.onData=function(f){v.push({data:f,meta:v.meta})}},s.compressWorker=function(v){return new h("Deflate",v)},s.uncompressWorker=function(){return new h("Inflate",{})}},{"./stream/GenericWorker":28,"./utils":32,pako:38}],8:[function(n,a,s){function o(p,m){var g,y="";for(g=0;g<m;g++)y+=String.fromCharCode(255&p),p>>>=8;return y}function i(p,m,g,y,u,x){var k,E,D=p.file,R=p.compression,_=x!==c.utf8encode,N=l.transformTo("string",x(D.name)),L=l.transformTo("string",c.utf8encode(D.name)),W=D.comment,z=l.transformTo("string",x(W)),S=l.transformTo("string",c.utf8encode(W)),O=L.length!==D.name.length,w=S.length!==W.length,j="",ee="",C="",Z=D.dir,G=D.date,J={crc32:0,compressedSize:0,uncompressedSize:0};m&&!g||(J.crc32=p.crc32,J.compressedSize=p.compressedSize,J.uncompressedSize=p.uncompressedSize);var P=0;m&&(P|=8),_||!O&&!w||(P|=2048);var I=0,q=0;Z&&(I|=16),u==="UNIX"?(q=798,I|=(function(V,te){var ue=V;return V||(ue=te?16893:33204),(65535&ue)<<16})(D.unixPermissions,Z)):(q=20,I|=(function(V){return 63&(V||0)})(D.dosPermissions)),k=G.getUTCHours(),k<<=6,k|=G.getUTCMinutes(),k<<=5,k|=G.getUTCSeconds()/2,E=G.getUTCFullYear()-1980,E<<=4,E|=G.getUTCMonth()+1,E<<=5,E|=G.getUTCDate(),O&&(ee=o(1,1)+o(h(N),4)+L,j+="up"+o(ee.length,2)+ee),w&&(C=o(1,1)+o(h(z),4)+S,j+="uc"+o(C.length,2)+C);var F="";return F+=`
\0`,F+=o(P,2),F+=R.magic,F+=o(k,2),F+=o(E,2),F+=o(J.crc32,4),F+=o(J.compressedSize,4),F+=o(J.uncompressedSize,4),F+=o(N.length,2),F+=o(j.length,2),{fileRecord:v.LOCAL_FILE_HEADER+F+N+j,dirRecord:v.CENTRAL_FILE_HEADER+o(q,2)+F+o(z.length,2)+"\0\0\0\0"+o(I,4)+o(y,4)+N+j+z}}var l=n("../utils"),d=n("../stream/GenericWorker"),c=n("../utf8"),h=n("../crc32"),v=n("../signature");function f(p,m,g,y){d.call(this,"ZipFileWorker"),this.bytesWritten=0,this.zipComment=m,this.zipPlatform=g,this.encodeFileName=y,this.streamFiles=p,this.accumulate=!1,this.contentBuffer=[],this.dirRecords=[],this.currentSourceOffset=0,this.entriesCount=0,this.currentFile=null,this._sources=[]}l.inherits(f,d),f.prototype.push=function(p){var m=p.meta.percent||0,g=this.entriesCount,y=this._sources.length;this.accumulate?this.contentBuffer.push(p):(this.bytesWritten+=p.data.length,d.prototype.push.call(this,{data:p.data,meta:{currentFile:this.currentFile,percent:g?(m+100*(g-y-1))/g:100}}))},f.prototype.openedSource=function(p){this.currentSourceOffset=this.bytesWritten,this.currentFile=p.file.name;var m=this.streamFiles&&!p.file.dir;if(m){var g=i(p,m,!1,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);this.push({data:g.fileRecord,meta:{percent:0}})}else this.accumulate=!0},f.prototype.closedSource=function(p){this.accumulate=!1;var m=this.streamFiles&&!p.file.dir,g=i(p,m,!0,this.currentSourceOffset,this.zipPlatform,this.encodeFileName);if(this.dirRecords.push(g.dirRecord),m)this.push({data:(function(y){return v.DATA_DESCRIPTOR+o(y.crc32,4)+o(y.compressedSize,4)+o(y.uncompressedSize,4)})(p),meta:{percent:100}});else for(this.push({data:g.fileRecord,meta:{percent:0}});this.contentBuffer.length;)this.push(this.contentBuffer.shift());this.currentFile=null},f.prototype.flush=function(){for(var p=this.bytesWritten,m=0;m<this.dirRecords.length;m++)this.push({data:this.dirRecords[m],meta:{percent:100}});var g=this.bytesWritten-p,y=(function(u,x,k,E,D){var R=l.transformTo("string",D(E));return v.CENTRAL_DIRECTORY_END+"\0\0\0\0"+o(u,2)+o(u,2)+o(x,4)+o(k,4)+o(R.length,2)+R})(this.dirRecords.length,g,p,this.zipComment,this.encodeFileName);this.push({data:y,meta:{percent:100}})},f.prototype.prepareNextSource=function(){this.previous=this._sources.shift(),this.openedSource(this.previous.streamInfo),this.isPaused?this.previous.pause():this.previous.resume()},f.prototype.registerPrevious=function(p){this._sources.push(p);var m=this;return p.on("data",function(g){m.processChunk(g)}),p.on("end",function(){m.closedSource(m.previous.streamInfo),m._sources.length?m.prepareNextSource():m.end()}),p.on("error",function(g){m.error(g)}),this},f.prototype.resume=function(){return!!d.prototype.resume.call(this)&&(!this.previous&&this._sources.length?(this.prepareNextSource(),!0):this.previous||this._sources.length||this.generatedError?void 0:(this.end(),!0))},f.prototype.error=function(p){var m=this._sources;if(!d.prototype.error.call(this,p))return!1;for(var g=0;g<m.length;g++)try{m[g].error(p)}catch{}return!0},f.prototype.lock=function(){d.prototype.lock.call(this);for(var p=this._sources,m=0;m<p.length;m++)p[m].lock()},a.exports=f},{"../crc32":4,"../signature":23,"../stream/GenericWorker":28,"../utf8":31,"../utils":32}],9:[function(n,a,s){var o=n("../compressions"),i=n("./ZipFileWorker");s.generateWorker=function(l,d,c){var h=new i(d.streamFiles,c,d.platform,d.encodeFileName),v=0;try{l.forEach(function(f,p){v++;var m=(function(x,k){var E=x||k,D=o[E];if(!D)throw new Error(E+" is not a valid compression method !");return D})(p.options.compression,d.compression),g=p.options.compressionOptions||d.compressionOptions||{},y=p.dir,u=p.date;p._compressWorker(m,g).withStreamInfo("file",{name:f,dir:y,date:u,comment:p.comment||"",unixPermissions:p.unixPermissions,dosPermissions:p.dosPermissions}).pipe(h)}),h.entriesCount=v}catch(f){h.error(f)}return h}},{"../compressions":3,"./ZipFileWorker":8}],10:[function(n,a,s){function o(){if(!(this instanceof o))return new o;if(arguments.length)throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");this.files=Object.create(null),this.comment=null,this.root="",this.clone=function(){var i=new o;for(var l in this)typeof this[l]!="function"&&(i[l]=this[l]);return i}}(o.prototype=n("./object")).loadAsync=n("./load"),o.support=n("./support"),o.defaults=n("./defaults"),o.version="3.10.1",o.loadAsync=function(i,l){return new o().loadAsync(i,l)},o.external=n("./external"),a.exports=o},{"./defaults":5,"./external":6,"./load":11,"./object":15,"./support":30}],11:[function(n,a,s){var o=n("./utils"),i=n("./external"),l=n("./utf8"),d=n("./zipEntries"),c=n("./stream/Crc32Probe"),h=n("./nodejsUtils");function v(f){return new i.Promise(function(p,m){var g=f.decompressed.getContentWorker().pipe(new c);g.on("error",function(y){m(y)}).on("end",function(){g.streamInfo.crc32!==f.decompressed.crc32?m(new Error("Corrupted zip : CRC32 mismatch")):p()}).resume()})}a.exports=function(f,p){var m=this;return p=o.extend(p||{},{base64:!1,checkCRC32:!1,optimizedBinaryString:!1,createFolders:!1,decodeFileName:l.utf8decode}),h.isNode&&h.isStream(f)?i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")):o.prepareContent("the loaded zip file",f,!0,p.optimizedBinaryString,p.base64).then(function(g){var y=new d(p);return y.load(g),y}).then(function(g){var y=[i.Promise.resolve(g)],u=g.files;if(p.checkCRC32)for(var x=0;x<u.length;x++)y.push(v(u[x]));return i.Promise.all(y)}).then(function(g){for(var y=g.shift(),u=y.files,x=0;x<u.length;x++){var k=u[x],E=k.fileNameStr,D=o.resolve(k.fileNameStr);m.file(D,k.decompressed,{binary:!0,optimizedBinaryString:!0,date:k.date,dir:k.dir,comment:k.fileCommentStr.length?k.fileCommentStr:null,unixPermissions:k.unixPermissions,dosPermissions:k.dosPermissions,createFolders:p.createFolders}),k.dir||(m.file(D).unsafeOriginalName=E)}return y.zipComment.length&&(m.comment=y.zipComment),m})}},{"./external":6,"./nodejsUtils":14,"./stream/Crc32Probe":25,"./utf8":31,"./utils":32,"./zipEntries":33}],12:[function(n,a,s){var o=n("../utils"),i=n("../stream/GenericWorker");function l(d,c){i.call(this,"Nodejs stream input adapter for "+d),this._upstreamEnded=!1,this._bindStream(c)}o.inherits(l,i),l.prototype._bindStream=function(d){var c=this;(this._stream=d).pause(),d.on("data",function(h){c.push({data:h,meta:{percent:0}})}).on("error",function(h){c.isPaused?this.generatedError=h:c.error(h)}).on("end",function(){c.isPaused?c._upstreamEnded=!0:c.end()})},l.prototype.pause=function(){return!!i.prototype.pause.call(this)&&(this._stream.pause(),!0)},l.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(this._upstreamEnded?this.end():this._stream.resume(),!0)},a.exports=l},{"../stream/GenericWorker":28,"../utils":32}],13:[function(n,a,s){var o=n("readable-stream").Readable;function i(l,d,c){o.call(this,d),this._helper=l;var h=this;l.on("data",function(v,f){h.push(v)||h._helper.pause(),c&&c(f)}).on("error",function(v){h.emit("error",v)}).on("end",function(){h.push(null)})}n("../utils").inherits(i,o),i.prototype._read=function(){this._helper.resume()},a.exports=i},{"../utils":32,"readable-stream":16}],14:[function(n,a,s){a.exports={isNode:typeof Buffer<"u",newBufferFrom:function(o,i){if(Buffer.from&&Buffer.from!==Uint8Array.from)return Buffer.from(o,i);if(typeof o=="number")throw new Error('The "data" argument must not be a number');return new Buffer(o,i)},allocBuffer:function(o){if(Buffer.alloc)return Buffer.alloc(o);var i=new Buffer(o);return i.fill(0),i},isBuffer:function(o){return Buffer.isBuffer(o)},isStream:function(o){return o&&typeof o.on=="function"&&typeof o.pause=="function"&&typeof o.resume=="function"}}},{}],15:[function(n,a,s){function o(D,R,_){var N,L=l.getTypeOf(R),W=l.extend(_||{},h);W.date=W.date||new Date,W.compression!==null&&(W.compression=W.compression.toUpperCase()),typeof W.unixPermissions=="string"&&(W.unixPermissions=parseInt(W.unixPermissions,8)),W.unixPermissions&&16384&W.unixPermissions&&(W.dir=!0),W.dosPermissions&&16&W.dosPermissions&&(W.dir=!0),W.dir&&(D=u(D)),W.createFolders&&(N=y(D))&&x.call(this,N,!0);var z=L==="string"&&W.binary===!1&&W.base64===!1;_&&_.binary!==void 0||(W.binary=!z),(R instanceof v&&R.uncompressedSize===0||W.dir||!R||R.length===0)&&(W.base64=!1,W.binary=!0,R="",W.compression="STORE",L="string");var S=null;S=R instanceof v||R instanceof d?R:m.isNode&&m.isStream(R)?new g(D,R):l.prepareContent(D,R,W.binary,W.optimizedBinaryString,W.base64);var O=new f(D,S,W);this.files[D]=O}var i=n("./utf8"),l=n("./utils"),d=n("./stream/GenericWorker"),c=n("./stream/StreamHelper"),h=n("./defaults"),v=n("./compressedObject"),f=n("./zipObject"),p=n("./generate"),m=n("./nodejsUtils"),g=n("./nodejs/NodejsStreamInputAdapter"),y=function(D){D.slice(-1)==="/"&&(D=D.substring(0,D.length-1));var R=D.lastIndexOf("/");return 0<R?D.substring(0,R):""},u=function(D){return D.slice(-1)!=="/"&&(D+="/"),D},x=function(D,R){return R=R!==void 0?R:h.createFolders,D=u(D),this.files[D]||o.call(this,D,null,{dir:!0,createFolders:R}),this.files[D]};function k(D){return Object.prototype.toString.call(D)==="[object RegExp]"}var E={load:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},forEach:function(D){var R,_,N;for(R in this.files)N=this.files[R],(_=R.slice(this.root.length,R.length))&&R.slice(0,this.root.length)===this.root&&D(_,N)},filter:function(D){var R=[];return this.forEach(function(_,N){D(_,N)&&R.push(N)}),R},file:function(D,R,_){if(arguments.length!==1)return D=this.root+D,o.call(this,D,R,_),this;if(k(D)){var N=D;return this.filter(function(W,z){return!z.dir&&N.test(W)})}var L=this.files[this.root+D];return L&&!L.dir?L:null},folder:function(D){if(!D)return this;if(k(D))return this.filter(function(L,W){return W.dir&&D.test(L)});var R=this.root+D,_=x.call(this,R),N=this.clone();return N.root=_.name,N},remove:function(D){D=this.root+D;var R=this.files[D];if(R||(D.slice(-1)!=="/"&&(D+="/"),R=this.files[D]),R&&!R.dir)delete this.files[D];else for(var _=this.filter(function(L,W){return W.name.slice(0,D.length)===D}),N=0;N<_.length;N++)delete this.files[_[N].name];return this},generate:function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},generateInternalStream:function(D){var R,_={};try{if((_=l.extend(D||{},{streamFiles:!1,compression:"STORE",compressionOptions:null,type:"",platform:"DOS",comment:null,mimeType:"application/zip",encodeFileName:i.utf8encode})).type=_.type.toLowerCase(),_.compression=_.compression.toUpperCase(),_.type==="binarystring"&&(_.type="string"),!_.type)throw new Error("No output type specified.");l.checkSupport(_.type),_.platform!=="darwin"&&_.platform!=="freebsd"&&_.platform!=="linux"&&_.platform!=="sunos"||(_.platform="UNIX"),_.platform==="win32"&&(_.platform="DOS");var N=_.comment||this.comment||"";R=p.generateWorker(this,_,N)}catch(L){(R=new d("error")).error(L)}return new c(R,_.type||"string",_.mimeType)},generateAsync:function(D,R){return this.generateInternalStream(D).accumulate(R)},generateNodeStream:function(D,R){return(D=D||{}).type||(D.type="nodebuffer"),this.generateInternalStream(D).toNodejsStream(R)}};a.exports=E},{"./compressedObject":2,"./defaults":5,"./generate":9,"./nodejs/NodejsStreamInputAdapter":12,"./nodejsUtils":14,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31,"./utils":32,"./zipObject":35}],16:[function(n,a,s){a.exports=n("stream")},{stream:void 0}],17:[function(n,a,s){var o=n("./DataReader");function i(l){o.call(this,l);for(var d=0;d<this.data.length;d++)l[d]=255&l[d]}n("../utils").inherits(i,o),i.prototype.byteAt=function(l){return this.data[this.zero+l]},i.prototype.lastIndexOfSignature=function(l){for(var d=l.charCodeAt(0),c=l.charCodeAt(1),h=l.charCodeAt(2),v=l.charCodeAt(3),f=this.length-4;0<=f;--f)if(this.data[f]===d&&this.data[f+1]===c&&this.data[f+2]===h&&this.data[f+3]===v)return f-this.zero;return-1},i.prototype.readAndCheckSignature=function(l){var d=l.charCodeAt(0),c=l.charCodeAt(1),h=l.charCodeAt(2),v=l.charCodeAt(3),f=this.readData(4);return d===f[0]&&c===f[1]&&h===f[2]&&v===f[3]},i.prototype.readData=function(l){if(this.checkOffset(l),l===0)return[];var d=this.data.slice(this.zero+this.index,this.zero+this.index+l);return this.index+=l,d},a.exports=i},{"../utils":32,"./DataReader":18}],18:[function(n,a,s){var o=n("../utils");function i(l){this.data=l,this.length=l.length,this.index=0,this.zero=0}i.prototype={checkOffset:function(l){this.checkIndex(this.index+l)},checkIndex:function(l){if(this.length<this.zero+l||l<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+l+"). Corrupted zip ?")},setIndex:function(l){this.checkIndex(l),this.index=l},skip:function(l){this.setIndex(this.index+l)},byteAt:function(){},readInt:function(l){var d,c=0;for(this.checkOffset(l),d=this.index+l-1;d>=this.index;d--)c=(c<<8)+this.byteAt(d);return this.index+=l,c},readString:function(l){return o.transformTo("string",this.readData(l))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var l=this.readInt(4);return new Date(Date.UTC(1980+(l>>25&127),(l>>21&15)-1,l>>16&31,l>>11&31,l>>5&63,(31&l)<<1))}},a.exports=i},{"../utils":32}],19:[function(n,a,s){var o=n("./Uint8ArrayReader");function i(l){o.call(this,l)}n("../utils").inherits(i,o),i.prototype.readData=function(l){this.checkOffset(l);var d=this.data.slice(this.zero+this.index,this.zero+this.index+l);return this.index+=l,d},a.exports=i},{"../utils":32,"./Uint8ArrayReader":21}],20:[function(n,a,s){var o=n("./DataReader");function i(l){o.call(this,l)}n("../utils").inherits(i,o),i.prototype.byteAt=function(l){return this.data.charCodeAt(this.zero+l)},i.prototype.lastIndexOfSignature=function(l){return this.data.lastIndexOf(l)-this.zero},i.prototype.readAndCheckSignature=function(l){return l===this.readData(4)},i.prototype.readData=function(l){this.checkOffset(l);var d=this.data.slice(this.zero+this.index,this.zero+this.index+l);return this.index+=l,d},a.exports=i},{"../utils":32,"./DataReader":18}],21:[function(n,a,s){var o=n("./ArrayReader");function i(l){o.call(this,l)}n("../utils").inherits(i,o),i.prototype.readData=function(l){if(this.checkOffset(l),l===0)return new Uint8Array(0);var d=this.data.subarray(this.zero+this.index,this.zero+this.index+l);return this.index+=l,d},a.exports=i},{"../utils":32,"./ArrayReader":17}],22:[function(n,a,s){var o=n("../utils"),i=n("../support"),l=n("./ArrayReader"),d=n("./StringReader"),c=n("./NodeBufferReader"),h=n("./Uint8ArrayReader");a.exports=function(v){var f=o.getTypeOf(v);return o.checkSupport(f),f!=="string"||i.uint8array?f==="nodebuffer"?new c(v):i.uint8array?new h(o.transformTo("uint8array",v)):new l(o.transformTo("array",v)):new d(v)}},{"../support":30,"../utils":32,"./ArrayReader":17,"./NodeBufferReader":19,"./StringReader":20,"./Uint8ArrayReader":21}],23:[function(n,a,s){s.LOCAL_FILE_HEADER="PK",s.CENTRAL_FILE_HEADER="PK",s.CENTRAL_DIRECTORY_END="PK",s.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK\x07",s.ZIP64_CENTRAL_DIRECTORY_END="PK",s.DATA_DESCRIPTOR="PK\x07\b"},{}],24:[function(n,a,s){var o=n("./GenericWorker"),i=n("../utils");function l(d){o.call(this,"ConvertWorker to "+d),this.destType=d}i.inherits(l,o),l.prototype.processChunk=function(d){this.push({data:i.transformTo(this.destType,d.data),meta:d.meta})},a.exports=l},{"../utils":32,"./GenericWorker":28}],25:[function(n,a,s){var o=n("./GenericWorker"),i=n("../crc32");function l(){o.call(this,"Crc32Probe"),this.withStreamInfo("crc32",0)}n("../utils").inherits(l,o),l.prototype.processChunk=function(d){this.streamInfo.crc32=i(d.data,this.streamInfo.crc32||0),this.push(d)},a.exports=l},{"../crc32":4,"../utils":32,"./GenericWorker":28}],26:[function(n,a,s){var o=n("../utils"),i=n("./GenericWorker");function l(d){i.call(this,"DataLengthProbe for "+d),this.propName=d,this.withStreamInfo(d,0)}o.inherits(l,i),l.prototype.processChunk=function(d){if(d){var c=this.streamInfo[this.propName]||0;this.streamInfo[this.propName]=c+d.data.length}i.prototype.processChunk.call(this,d)},a.exports=l},{"../utils":32,"./GenericWorker":28}],27:[function(n,a,s){var o=n("../utils"),i=n("./GenericWorker");function l(d){i.call(this,"DataWorker");var c=this;this.dataIsReady=!1,this.index=0,this.max=0,this.data=null,this.type="",this._tickScheduled=!1,d.then(function(h){c.dataIsReady=!0,c.data=h,c.max=h&&h.length||0,c.type=o.getTypeOf(h),c.isPaused||c._tickAndRepeat()},function(h){c.error(h)})}o.inherits(l,i),l.prototype.cleanUp=function(){i.prototype.cleanUp.call(this),this.data=null},l.prototype.resume=function(){return!!i.prototype.resume.call(this)&&(!this._tickScheduled&&this.dataIsReady&&(this._tickScheduled=!0,o.delay(this._tickAndRepeat,[],this)),!0)},l.prototype._tickAndRepeat=function(){this._tickScheduled=!1,this.isPaused||this.isFinished||(this._tick(),this.isFinished||(o.delay(this._tickAndRepeat,[],this),this._tickScheduled=!0))},l.prototype._tick=function(){if(this.isPaused||this.isFinished)return!1;var d=null,c=Math.min(this.max,this.index+16384);if(this.index>=this.max)return this.end();switch(this.type){case"string":d=this.data.substring(this.index,c);break;case"uint8array":d=this.data.subarray(this.index,c);break;case"array":case"nodebuffer":d=this.data.slice(this.index,c)}return this.index=c,this.push({data:d,meta:{percent:this.max?this.index/this.max*100:0}})},a.exports=l},{"../utils":32,"./GenericWorker":28}],28:[function(n,a,s){function o(i){this.name=i||"default",this.streamInfo={},this.generatedError=null,this.extraStreamInfo={},this.isPaused=!0,this.isFinished=!1,this.isLocked=!1,this._listeners={data:[],end:[],error:[]},this.previous=null}o.prototype={push:function(i){this.emit("data",i)},end:function(){if(this.isFinished)return!1;this.flush();try{this.emit("end"),this.cleanUp(),this.isFinished=!0}catch(i){this.emit("error",i)}return!0},error:function(i){return!this.isFinished&&(this.isPaused?this.generatedError=i:(this.isFinished=!0,this.emit("error",i),this.previous&&this.previous.error(i),this.cleanUp()),!0)},on:function(i,l){return this._listeners[i].push(l),this},cleanUp:function(){this.streamInfo=this.generatedError=this.extraStreamInfo=null,this._listeners=[]},emit:function(i,l){if(this._listeners[i])for(var d=0;d<this._listeners[i].length;d++)this._listeners[i][d].call(this,l)},pipe:function(i){return i.registerPrevious(this)},registerPrevious:function(i){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.streamInfo=i.streamInfo,this.mergeStreamInfo(),this.previous=i;var l=this;return i.on("data",function(d){l.processChunk(d)}),i.on("end",function(){l.end()}),i.on("error",function(d){l.error(d)}),this},pause:function(){return!this.isPaused&&!this.isFinished&&(this.isPaused=!0,this.previous&&this.previous.pause(),!0)},resume:function(){if(!this.isPaused||this.isFinished)return!1;var i=this.isPaused=!1;return this.generatedError&&(this.error(this.generatedError),i=!0),this.previous&&this.previous.resume(),!i},flush:function(){},processChunk:function(i){this.push(i)},withStreamInfo:function(i,l){return this.extraStreamInfo[i]=l,this.mergeStreamInfo(),this},mergeStreamInfo:function(){for(var i in this.extraStreamInfo)Object.prototype.hasOwnProperty.call(this.extraStreamInfo,i)&&(this.streamInfo[i]=this.extraStreamInfo[i])},lock:function(){if(this.isLocked)throw new Error("The stream '"+this+"' has already been used.");this.isLocked=!0,this.previous&&this.previous.lock()},toString:function(){var i="Worker "+this.name;return this.previous?this.previous+" -> "+i:i}},a.exports=o},{}],29:[function(n,a,s){var o=n("../utils"),i=n("./ConvertWorker"),l=n("./GenericWorker"),d=n("../base64"),c=n("../support"),h=n("../external"),v=null;if(c.nodestream)try{v=n("../nodejs/NodejsStreamOutputAdapter")}catch{}function f(m,g){return new h.Promise(function(y,u){var x=[],k=m._internalType,E=m._outputType,D=m._mimeType;m.on("data",function(R,_){x.push(R),g&&g(_)}).on("error",function(R){x=[],u(R)}).on("end",function(){try{var R=(function(_,N,L){switch(_){case"blob":return o.newBlob(o.transformTo("arraybuffer",N),L);case"base64":return d.encode(N);default:return o.transformTo(_,N)}})(E,(function(_,N){var L,W=0,z=null,S=0;for(L=0;L<N.length;L++)S+=N[L].length;switch(_){case"string":return N.join("");case"array":return Array.prototype.concat.apply([],N);case"uint8array":for(z=new Uint8Array(S),L=0;L<N.length;L++)z.set(N[L],W),W+=N[L].length;return z;case"nodebuffer":return Buffer.concat(N);default:throw new Error("concat : unsupported type '"+_+"'")}})(k,x),D);y(R)}catch(_){u(_)}x=[]}).resume()})}function p(m,g,y){var u=g;switch(g){case"blob":case"arraybuffer":u="uint8array";break;case"base64":u="string"}try{this._internalType=u,this._outputType=g,this._mimeType=y,o.checkSupport(u),this._worker=m.pipe(new i(u)),m.lock()}catch(x){this._worker=new l("error"),this._worker.error(x)}}p.prototype={accumulate:function(m){return f(this,m)},on:function(m,g){var y=this;return m==="data"?this._worker.on(m,function(u){g.call(y,u.data,u.meta)}):this._worker.on(m,function(){o.delay(g,arguments,y)}),this},resume:function(){return o.delay(this._worker.resume,[],this._worker),this},pause:function(){return this._worker.pause(),this},toNodejsStream:function(m){if(o.checkSupport("nodestream"),this._outputType!=="nodebuffer")throw new Error(this._outputType+" is not supported by this method");return new v(this,{objectMode:this._outputType!=="nodebuffer"},m)}},a.exports=p},{"../base64":1,"../external":6,"../nodejs/NodejsStreamOutputAdapter":13,"../support":30,"../utils":32,"./ConvertWorker":24,"./GenericWorker":28}],30:[function(n,a,s){if(s.base64=!0,s.array=!0,s.string=!0,s.arraybuffer=typeof ArrayBuffer<"u"&&typeof Uint8Array<"u",s.nodebuffer=typeof Buffer<"u",s.uint8array=typeof Uint8Array<"u",typeof ArrayBuffer>"u")s.blob=!1;else{var o=new ArrayBuffer(0);try{s.blob=new Blob([o],{type:"application/zip"}).size===0}catch{try{var i=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);i.append(o),s.blob=i.getBlob("application/zip").size===0}catch{s.blob=!1}}}try{s.nodestream=!!n("readable-stream").Readable}catch{s.nodestream=!1}},{"readable-stream":16}],31:[function(n,a,s){for(var o=n("./utils"),i=n("./support"),l=n("./nodejsUtils"),d=n("./stream/GenericWorker"),c=new Array(256),h=0;h<256;h++)c[h]=252<=h?6:248<=h?5:240<=h?4:224<=h?3:192<=h?2:1;c[254]=c[254]=1;function v(){d.call(this,"utf-8 decode"),this.leftOver=null}function f(){d.call(this,"utf-8 encode")}s.utf8encode=function(p){return i.nodebuffer?l.newBufferFrom(p,"utf-8"):(function(m){var g,y,u,x,k,E=m.length,D=0;for(x=0;x<E;x++)(64512&(y=m.charCodeAt(x)))==55296&&x+1<E&&(64512&(u=m.charCodeAt(x+1)))==56320&&(y=65536+(y-55296<<10)+(u-56320),x++),D+=y<128?1:y<2048?2:y<65536?3:4;for(g=i.uint8array?new Uint8Array(D):new Array(D),x=k=0;k<D;x++)(64512&(y=m.charCodeAt(x)))==55296&&x+1<E&&(64512&(u=m.charCodeAt(x+1)))==56320&&(y=65536+(y-55296<<10)+(u-56320),x++),y<128?g[k++]=y:(y<2048?g[k++]=192|y>>>6:(y<65536?g[k++]=224|y>>>12:(g[k++]=240|y>>>18,g[k++]=128|y>>>12&63),g[k++]=128|y>>>6&63),g[k++]=128|63&y);return g})(p)},s.utf8decode=function(p){return i.nodebuffer?o.transformTo("nodebuffer",p).toString("utf-8"):(function(m){var g,y,u,x,k=m.length,E=new Array(2*k);for(g=y=0;g<k;)if((u=m[g++])<128)E[y++]=u;else if(4<(x=c[u]))E[y++]=65533,g+=x-1;else{for(u&=x===2?31:x===3?15:7;1<x&&g<k;)u=u<<6|63&m[g++],x--;1<x?E[y++]=65533:u<65536?E[y++]=u:(u-=65536,E[y++]=55296|u>>10&1023,E[y++]=56320|1023&u)}return E.length!==y&&(E.subarray?E=E.subarray(0,y):E.length=y),o.applyFromCharCode(E)})(p=o.transformTo(i.uint8array?"uint8array":"array",p))},o.inherits(v,d),v.prototype.processChunk=function(p){var m=o.transformTo(i.uint8array?"uint8array":"array",p.data);if(this.leftOver&&this.leftOver.length){if(i.uint8array){var g=m;(m=new Uint8Array(g.length+this.leftOver.length)).set(this.leftOver,0),m.set(g,this.leftOver.length)}else m=this.leftOver.concat(m);this.leftOver=null}var y=(function(x,k){var E;for((k=k||x.length)>x.length&&(k=x.length),E=k-1;0<=E&&(192&x[E])==128;)E--;return E<0||E===0?k:E+c[x[E]]>k?E:k})(m),u=m;y!==m.length&&(i.uint8array?(u=m.subarray(0,y),this.leftOver=m.subarray(y,m.length)):(u=m.slice(0,y),this.leftOver=m.slice(y,m.length))),this.push({data:s.utf8decode(u),meta:p.meta})},v.prototype.flush=function(){this.leftOver&&this.leftOver.length&&(this.push({data:s.utf8decode(this.leftOver),meta:{}}),this.leftOver=null)},s.Utf8DecodeWorker=v,o.inherits(f,d),f.prototype.processChunk=function(p){this.push({data:s.utf8encode(p.data),meta:p.meta})},s.Utf8EncodeWorker=f},{"./nodejsUtils":14,"./stream/GenericWorker":28,"./support":30,"./utils":32}],32:[function(n,a,s){var o=n("./support"),i=n("./base64"),l=n("./nodejsUtils"),d=n("./external");function c(g){return g}function h(g,y){for(var u=0;u<g.length;++u)y[u]=255&g.charCodeAt(u);return y}n("setimmediate"),s.newBlob=function(g,y){s.checkSupport("blob");try{return new Blob([g],{type:y})}catch{try{var u=new(self.BlobBuilder||self.WebKitBlobBuilder||self.MozBlobBuilder||self.MSBlobBuilder);return u.append(g),u.getBlob(y)}catch{throw new Error("Bug : can't construct the Blob.")}}};var v={stringifyByChunk:function(g,y,u){var x=[],k=0,E=g.length;if(E<=u)return String.fromCharCode.apply(null,g);for(;k<E;)y==="array"||y==="nodebuffer"?x.push(String.fromCharCode.apply(null,g.slice(k,Math.min(k+u,E)))):x.push(String.fromCharCode.apply(null,g.subarray(k,Math.min(k+u,E)))),k+=u;return x.join("")},stringifyByChar:function(g){for(var y="",u=0;u<g.length;u++)y+=String.fromCharCode(g[u]);return y},applyCanBeUsed:{uint8array:(function(){try{return o.uint8array&&String.fromCharCode.apply(null,new Uint8Array(1)).length===1}catch{return!1}})(),nodebuffer:(function(){try{return o.nodebuffer&&String.fromCharCode.apply(null,l.allocBuffer(1)).length===1}catch{return!1}})()}};function f(g){var y=65536,u=s.getTypeOf(g),x=!0;if(u==="uint8array"?x=v.applyCanBeUsed.uint8array:u==="nodebuffer"&&(x=v.applyCanBeUsed.nodebuffer),x)for(;1<y;)try{return v.stringifyByChunk(g,u,y)}catch{y=Math.floor(y/2)}return v.stringifyByChar(g)}function p(g,y){for(var u=0;u<g.length;u++)y[u]=g[u];return y}s.applyFromCharCode=f;var m={};m.string={string:c,array:function(g){return h(g,new Array(g.length))},arraybuffer:function(g){return m.string.uint8array(g).buffer},uint8array:function(g){return h(g,new Uint8Array(g.length))},nodebuffer:function(g){return h(g,l.allocBuffer(g.length))}},m.array={string:f,array:c,arraybuffer:function(g){return new Uint8Array(g).buffer},uint8array:function(g){return new Uint8Array(g)},nodebuffer:function(g){return l.newBufferFrom(g)}},m.arraybuffer={string:function(g){return f(new Uint8Array(g))},array:function(g){return p(new Uint8Array(g),new Array(g.byteLength))},arraybuffer:c,uint8array:function(g){return new Uint8Array(g)},nodebuffer:function(g){return l.newBufferFrom(new Uint8Array(g))}},m.uint8array={string:f,array:function(g){return p(g,new Array(g.length))},arraybuffer:function(g){return g.buffer},uint8array:c,nodebuffer:function(g){return l.newBufferFrom(g)}},m.nodebuffer={string:f,array:function(g){return p(g,new Array(g.length))},arraybuffer:function(g){return m.nodebuffer.uint8array(g).buffer},uint8array:function(g){return p(g,new Uint8Array(g.length))},nodebuffer:c},s.transformTo=function(g,y){if(y=y||"",!g)return y;s.checkSupport(g);var u=s.getTypeOf(y);return m[u][g](y)},s.resolve=function(g){for(var y=g.split("/"),u=[],x=0;x<y.length;x++){var k=y[x];k==="."||k===""&&x!==0&&x!==y.length-1||(k===".."?u.pop():u.push(k))}return u.join("/")},s.getTypeOf=function(g){return typeof g=="string"?"string":Object.prototype.toString.call(g)==="[object Array]"?"array":o.nodebuffer&&l.isBuffer(g)?"nodebuffer":o.uint8array&&g instanceof Uint8Array?"uint8array":o.arraybuffer&&g instanceof ArrayBuffer?"arraybuffer":void 0},s.checkSupport=function(g){if(!o[g.toLowerCase()])throw new Error(g+" is not supported by this platform")},s.MAX_VALUE_16BITS=65535,s.MAX_VALUE_32BITS=-1,s.pretty=function(g){var y,u,x="";for(u=0;u<(g||"").length;u++)x+="\\x"+((y=g.charCodeAt(u))<16?"0":"")+y.toString(16).toUpperCase();return x},s.delay=function(g,y,u){setImmediate(function(){g.apply(u||null,y||[])})},s.inherits=function(g,y){function u(){}u.prototype=y.prototype,g.prototype=new u},s.extend=function(){var g,y,u={};for(g=0;g<arguments.length;g++)for(y in arguments[g])Object.prototype.hasOwnProperty.call(arguments[g],y)&&u[y]===void 0&&(u[y]=arguments[g][y]);return u},s.prepareContent=function(g,y,u,x,k){return d.Promise.resolve(y).then(function(E){return o.blob&&(E instanceof Blob||["[object File]","[object Blob]"].indexOf(Object.prototype.toString.call(E))!==-1)&&typeof FileReader<"u"?new d.Promise(function(D,R){var _=new FileReader;_.onload=function(N){D(N.target.result)},_.onerror=function(N){R(N.target.error)},_.readAsArrayBuffer(E)}):E}).then(function(E){var D=s.getTypeOf(E);return D?(D==="arraybuffer"?E=s.transformTo("uint8array",E):D==="string"&&(k?E=i.decode(E):u&&x!==!0&&(E=(function(R){return h(R,o.uint8array?new Uint8Array(R.length):new Array(R.length))})(E))),E):d.Promise.reject(new Error("Can't read the data of '"+g+"'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"))})}},{"./base64":1,"./external":6,"./nodejsUtils":14,"./support":30,setimmediate:54}],33:[function(n,a,s){var o=n("./reader/readerFor"),i=n("./utils"),l=n("./signature"),d=n("./zipEntry"),c=n("./support");function h(v){this.files=[],this.loadOptions=v}h.prototype={checkSignature:function(v){if(!this.reader.readAndCheckSignature(v)){this.reader.index-=4;var f=this.reader.readString(4);throw new Error("Corrupted zip or bug: unexpected signature ("+i.pretty(f)+", expected "+i.pretty(v)+")")}},isSignature:function(v,f){var p=this.reader.index;this.reader.setIndex(v);var m=this.reader.readString(4)===f;return this.reader.setIndex(p),m},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2);var v=this.reader.readData(this.zipCommentLength),f=c.uint8array?"uint8array":"array",p=i.transformTo(f,v);this.zipComment=this.loadOptions.decodeFileName(p)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.reader.skip(4),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var v,f,p,m=this.zip64EndOfCentralSize-44;0<m;)v=this.reader.readInt(2),f=this.reader.readInt(4),p=this.reader.readData(f),this.zip64ExtensibleData[v]={id:v,length:f,value:p}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),1<this.disksCount)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var v,f;for(v=0;v<this.files.length;v++)f=this.files[v],this.reader.setIndex(f.localHeaderOffset),this.checkSignature(l.LOCAL_FILE_HEADER),f.readLocalPart(this.reader),f.handleUTF8(),f.processAttributes()},readCentralDir:function(){var v;for(this.reader.setIndex(this.centralDirOffset);this.reader.readAndCheckSignature(l.CENTRAL_FILE_HEADER);)(v=new d({zip64:this.zip64},this.loadOptions)).readCentralPart(this.reader),this.files.push(v);if(this.centralDirRecords!==this.files.length&&this.centralDirRecords!==0&&this.files.length===0)throw new Error("Corrupted zip or bug: expected "+this.centralDirRecords+" records in central dir, got "+this.files.length)},readEndOfCentral:function(){var v=this.reader.lastIndexOfSignature(l.CENTRAL_DIRECTORY_END);if(v<0)throw this.isSignature(0,l.LOCAL_FILE_HEADER)?new Error("Corrupted zip: can't find end of central directory"):new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");this.reader.setIndex(v);var f=v;if(this.checkSignature(l.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===i.MAX_VALUE_16BITS||this.diskWithCentralDirStart===i.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===i.MAX_VALUE_16BITS||this.centralDirRecords===i.MAX_VALUE_16BITS||this.centralDirSize===i.MAX_VALUE_32BITS||this.centralDirOffset===i.MAX_VALUE_32BITS){if(this.zip64=!0,(v=this.reader.lastIndexOfSignature(l.ZIP64_CENTRAL_DIRECTORY_LOCATOR))<0)throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");if(this.reader.setIndex(v),this.checkSignature(l.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),!this.isSignature(this.relativeOffsetEndOfZip64CentralDir,l.ZIP64_CENTRAL_DIRECTORY_END)&&(this.relativeOffsetEndOfZip64CentralDir=this.reader.lastIndexOfSignature(l.ZIP64_CENTRAL_DIRECTORY_END),this.relativeOffsetEndOfZip64CentralDir<0))throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(l.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}var p=this.centralDirOffset+this.centralDirSize;this.zip64&&(p+=20,p+=12+this.zip64EndOfCentralSize);var m=f-p;if(0<m)this.isSignature(f,l.CENTRAL_FILE_HEADER)||(this.reader.zero=m);else if(m<0)throw new Error("Corrupted zip: missing "+Math.abs(m)+" bytes.")},prepareReader:function(v){this.reader=o(v)},load:function(v){this.prepareReader(v),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},a.exports=h},{"./reader/readerFor":22,"./signature":23,"./support":30,"./utils":32,"./zipEntry":34}],34:[function(n,a,s){var o=n("./reader/readerFor"),i=n("./utils"),l=n("./compressedObject"),d=n("./crc32"),c=n("./utf8"),h=n("./compressions"),v=n("./support");function f(p,m){this.options=p,this.loadOptions=m}f.prototype={isEncrypted:function(){return(1&this.bitFlag)==1},useUTF8:function(){return(2048&this.bitFlag)==2048},readLocalPart:function(p){var m,g;if(p.skip(22),this.fileNameLength=p.readInt(2),g=p.readInt(2),this.fileName=p.readData(this.fileNameLength),p.skip(g),this.compressedSize===-1||this.uncompressedSize===-1)throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");if((m=(function(y){for(var u in h)if(Object.prototype.hasOwnProperty.call(h,u)&&h[u].magic===y)return h[u];return null})(this.compressionMethod))===null)throw new Error("Corrupted zip : compression "+i.pretty(this.compressionMethod)+" unknown (inner file : "+i.transformTo("string",this.fileName)+")");this.decompressed=new l(this.compressedSize,this.uncompressedSize,this.crc32,m,p.readData(this.compressedSize))},readCentralPart:function(p){this.versionMadeBy=p.readInt(2),p.skip(2),this.bitFlag=p.readInt(2),this.compressionMethod=p.readString(2),this.date=p.readDate(),this.crc32=p.readInt(4),this.compressedSize=p.readInt(4),this.uncompressedSize=p.readInt(4);var m=p.readInt(2);if(this.extraFieldsLength=p.readInt(2),this.fileCommentLength=p.readInt(2),this.diskNumberStart=p.readInt(2),this.internalFileAttributes=p.readInt(2),this.externalFileAttributes=p.readInt(4),this.localHeaderOffset=p.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");p.skip(m),this.readExtraFields(p),this.parseZIP64ExtraField(p),this.fileComment=p.readData(this.fileCommentLength)},processAttributes:function(){this.unixPermissions=null,this.dosPermissions=null;var p=this.versionMadeBy>>8;this.dir=!!(16&this.externalFileAttributes),p==0&&(this.dosPermissions=63&this.externalFileAttributes),p==3&&(this.unixPermissions=this.externalFileAttributes>>16&65535),this.dir||this.fileNameStr.slice(-1)!=="/"||(this.dir=!0)},parseZIP64ExtraField:function(){if(this.extraFields[1]){var p=o(this.extraFields[1].value);this.uncompressedSize===i.MAX_VALUE_32BITS&&(this.uncompressedSize=p.readInt(8)),this.compressedSize===i.MAX_VALUE_32BITS&&(this.compressedSize=p.readInt(8)),this.localHeaderOffset===i.MAX_VALUE_32BITS&&(this.localHeaderOffset=p.readInt(8)),this.diskNumberStart===i.MAX_VALUE_32BITS&&(this.diskNumberStart=p.readInt(4))}},readExtraFields:function(p){var m,g,y,u=p.index+this.extraFieldsLength;for(this.extraFields||(this.extraFields={});p.index+4<u;)m=p.readInt(2),g=p.readInt(2),y=p.readData(g),this.extraFields[m]={id:m,length:g,value:y};p.setIndex(u)},handleUTF8:function(){var p=v.uint8array?"uint8array":"array";if(this.useUTF8())this.fileNameStr=c.utf8decode(this.fileName),this.fileCommentStr=c.utf8decode(this.fileComment);else{var m=this.findExtraFieldUnicodePath();if(m!==null)this.fileNameStr=m;else{var g=i.transformTo(p,this.fileName);this.fileNameStr=this.loadOptions.decodeFileName(g)}var y=this.findExtraFieldUnicodeComment();if(y!==null)this.fileCommentStr=y;else{var u=i.transformTo(p,this.fileComment);this.fileCommentStr=this.loadOptions.decodeFileName(u)}}},findExtraFieldUnicodePath:function(){var p=this.extraFields[28789];if(p){var m=o(p.value);return m.readInt(1)!==1||d(this.fileName)!==m.readInt(4)?null:c.utf8decode(m.readData(p.length-5))}return null},findExtraFieldUnicodeComment:function(){var p=this.extraFields[25461];if(p){var m=o(p.value);return m.readInt(1)!==1||d(this.fileComment)!==m.readInt(4)?null:c.utf8decode(m.readData(p.length-5))}return null}},a.exports=f},{"./compressedObject":2,"./compressions":3,"./crc32":4,"./reader/readerFor":22,"./support":30,"./utf8":31,"./utils":32}],35:[function(n,a,s){function o(m,g,y){this.name=m,this.dir=y.dir,this.date=y.date,this.comment=y.comment,this.unixPermissions=y.unixPermissions,this.dosPermissions=y.dosPermissions,this._data=g,this._dataBinary=y.binary,this.options={compression:y.compression,compressionOptions:y.compressionOptions}}var i=n("./stream/StreamHelper"),l=n("./stream/DataWorker"),d=n("./utf8"),c=n("./compressedObject"),h=n("./stream/GenericWorker");o.prototype={internalStream:function(m){var g=null,y="string";try{if(!m)throw new Error("No output type specified.");var u=(y=m.toLowerCase())==="string"||y==="text";y!=="binarystring"&&y!=="text"||(y="string"),g=this._decompressWorker();var x=!this._dataBinary;x&&!u&&(g=g.pipe(new d.Utf8EncodeWorker)),!x&&u&&(g=g.pipe(new d.Utf8DecodeWorker))}catch(k){(g=new h("error")).error(k)}return new i(g,y,"")},async:function(m,g){return this.internalStream(m).accumulate(g)},nodeStream:function(m,g){return this.internalStream(m||"nodebuffer").toNodejsStream(g)},_compressWorker:function(m,g){if(this._data instanceof c&&this._data.compression.magic===m.magic)return this._data.getCompressedWorker();var y=this._decompressWorker();return this._dataBinary||(y=y.pipe(new d.Utf8EncodeWorker)),c.createWorkerFrom(y,m,g)},_decompressWorker:function(){return this._data instanceof c?this._data.getContentWorker():this._data instanceof h?this._data:new l(this._data)}};for(var v=["asText","asBinary","asNodeBuffer","asUint8Array","asArrayBuffer"],f=function(){throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.")},p=0;p<v.length;p++)o.prototype[v[p]]=f;a.exports=o},{"./compressedObject":2,"./stream/DataWorker":27,"./stream/GenericWorker":28,"./stream/StreamHelper":29,"./utf8":31}],36:[function(n,a,s){(function(o){var i,l,d=o.MutationObserver||o.WebKitMutationObserver;if(d){var c=0,h=new d(m),v=o.document.createTextNode("");h.observe(v,{characterData:!0}),i=function(){v.data=c=++c%2}}else if(o.setImmediate||o.MessageChannel===void 0)i="document"in o&&"onreadystatechange"in o.document.createElement("script")?function(){var g=o.document.createElement("script");g.onreadystatechange=function(){m(),g.onreadystatechange=null,g.parentNode.removeChild(g),g=null},o.document.documentElement.appendChild(g)}:function(){setTimeout(m,0)};else{var f=new o.MessageChannel;f.port1.onmessage=m,i=function(){f.port2.postMessage(0)}}var p=[];function m(){var g,y;l=!0;for(var u=p.length;u;){for(y=p,p=[],g=-1;++g<u;)y[g]();u=p.length}l=!1}a.exports=function(g){p.push(g)!==1||l||i()}}).call(this,typeof Pa<"u"?Pa:typeof self<"u"?self:typeof window<"u"?window:{})},{}],37:[function(n,a,s){var o=n("immediate");function i(){}var l={},d=["REJECTED"],c=["FULFILLED"],h=["PENDING"];function v(u){if(typeof u!="function")throw new TypeError("resolver must be a function");this.state=h,this.queue=[],this.outcome=void 0,u!==i&&g(this,u)}function f(u,x,k){this.promise=u,typeof x=="function"&&(this.onFulfilled=x,this.callFulfilled=this.otherCallFulfilled),typeof k=="function"&&(this.onRejected=k,this.callRejected=this.otherCallRejected)}function p(u,x,k){o(function(){var E;try{E=x(k)}catch(D){return l.reject(u,D)}E===u?l.reject(u,new TypeError("Cannot resolve promise with itself")):l.resolve(u,E)})}function m(u){var x=u&&u.then;if(u&&(typeof u=="object"||typeof u=="function")&&typeof x=="function")return function(){x.apply(u,arguments)}}function g(u,x){var k=!1;function E(_){k||(k=!0,l.reject(u,_))}function D(_){k||(k=!0,l.resolve(u,_))}var R=y(function(){x(D,E)});R.status==="error"&&E(R.value)}function y(u,x){var k={};try{k.value=u(x),k.status="success"}catch(E){k.status="error",k.value=E}return k}(a.exports=v).prototype.finally=function(u){if(typeof u!="function")return this;var x=this.constructor;return this.then(function(k){return x.resolve(u()).then(function(){return k})},function(k){return x.resolve(u()).then(function(){throw k})})},v.prototype.catch=function(u){return this.then(null,u)},v.prototype.then=function(u,x){if(typeof u!="function"&&this.state===c||typeof x!="function"&&this.state===d)return this;var k=new this.constructor(i);return this.state!==h?p(k,this.state===c?u:x,this.outcome):this.queue.push(new f(k,u,x)),k},f.prototype.callFulfilled=function(u){l.resolve(this.promise,u)},f.prototype.otherCallFulfilled=function(u){p(this.promise,this.onFulfilled,u)},f.prototype.callRejected=function(u){l.reject(this.promise,u)},f.prototype.otherCallRejected=function(u){p(this.promise,this.onRejected,u)},l.resolve=function(u,x){var k=y(m,x);if(k.status==="error")return l.reject(u,k.value);var E=k.value;if(E)g(u,E);else{u.state=c,u.outcome=x;for(var D=-1,R=u.queue.length;++D<R;)u.queue[D].callFulfilled(x)}return u},l.reject=function(u,x){u.state=d,u.outcome=x;for(var k=-1,E=u.queue.length;++k<E;)u.queue[k].callRejected(x);return u},v.resolve=function(u){return u instanceof this?u:l.resolve(new this(i),u)},v.reject=function(u){var x=new this(i);return l.reject(x,u)},v.all=function(u){var x=this;if(Object.prototype.toString.call(u)!=="[object Array]")return this.reject(new TypeError("must be an array"));var k=u.length,E=!1;if(!k)return this.resolve([]);for(var D=new Array(k),R=0,_=-1,N=new this(i);++_<k;)L(u[_],_);return N;function L(W,z){x.resolve(W).then(function(S){D[z]=S,++R!==k||E||(E=!0,l.resolve(N,D))},function(S){E||(E=!0,l.reject(N,S))})}},v.race=function(u){var x=this;if(Object.prototype.toString.call(u)!=="[object Array]")return this.reject(new TypeError("must be an array"));var k=u.length,E=!1;if(!k)return this.resolve([]);for(var D=-1,R=new this(i);++D<k;)_=u[D],x.resolve(_).then(function(N){E||(E=!0,l.resolve(R,N))},function(N){E||(E=!0,l.reject(R,N))});var _;return R}},{immediate:36}],38:[function(n,a,s){var o={};(0,n("./lib/utils/common").assign)(o,n("./lib/deflate"),n("./lib/inflate"),n("./lib/zlib/constants")),a.exports=o},{"./lib/deflate":39,"./lib/inflate":40,"./lib/utils/common":41,"./lib/zlib/constants":44}],39:[function(n,a,s){var o=n("./zlib/deflate"),i=n("./utils/common"),l=n("./utils/strings"),d=n("./zlib/messages"),c=n("./zlib/zstream"),h=Object.prototype.toString,v=0,f=-1,p=0,m=8;function g(u){if(!(this instanceof g))return new g(u);this.options=i.assign({level:f,method:m,chunkSize:16384,windowBits:15,memLevel:8,strategy:p,to:""},u||{});var x=this.options;x.raw&&0<x.windowBits?x.windowBits=-x.windowBits:x.gzip&&0<x.windowBits&&x.windowBits<16&&(x.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new c,this.strm.avail_out=0;var k=o.deflateInit2(this.strm,x.level,x.method,x.windowBits,x.memLevel,x.strategy);if(k!==v)throw new Error(d[k]);if(x.header&&o.deflateSetHeader(this.strm,x.header),x.dictionary){var E;if(E=typeof x.dictionary=="string"?l.string2buf(x.dictionary):h.call(x.dictionary)==="[object ArrayBuffer]"?new Uint8Array(x.dictionary):x.dictionary,(k=o.deflateSetDictionary(this.strm,E))!==v)throw new Error(d[k]);this._dict_set=!0}}function y(u,x){var k=new g(x);if(k.push(u,!0),k.err)throw k.msg||d[k.err];return k.result}g.prototype.push=function(u,x){var k,E,D=this.strm,R=this.options.chunkSize;if(this.ended)return!1;E=x===~~x?x:x===!0?4:0,typeof u=="string"?D.input=l.string2buf(u):h.call(u)==="[object ArrayBuffer]"?D.input=new Uint8Array(u):D.input=u,D.next_in=0,D.avail_in=D.input.length;do{if(D.avail_out===0&&(D.output=new i.Buf8(R),D.next_out=0,D.avail_out=R),(k=o.deflate(D,E))!==1&&k!==v)return this.onEnd(k),!(this.ended=!0);D.avail_out!==0&&(D.avail_in!==0||E!==4&&E!==2)||(this.options.to==="string"?this.onData(l.buf2binstring(i.shrinkBuf(D.output,D.next_out))):this.onData(i.shrinkBuf(D.output,D.next_out)))}while((0<D.avail_in||D.avail_out===0)&&k!==1);return E===4?(k=o.deflateEnd(this.strm),this.onEnd(k),this.ended=!0,k===v):E!==2||(this.onEnd(v),!(D.avail_out=0))},g.prototype.onData=function(u){this.chunks.push(u)},g.prototype.onEnd=function(u){u===v&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=i.flattenChunks(this.chunks)),this.chunks=[],this.err=u,this.msg=this.strm.msg},s.Deflate=g,s.deflate=y,s.deflateRaw=function(u,x){return(x=x||{}).raw=!0,y(u,x)},s.gzip=function(u,x){return(x=x||{}).gzip=!0,y(u,x)}},{"./utils/common":41,"./utils/strings":42,"./zlib/deflate":46,"./zlib/messages":51,"./zlib/zstream":53}],40:[function(n,a,s){var o=n("./zlib/inflate"),i=n("./utils/common"),l=n("./utils/strings"),d=n("./zlib/constants"),c=n("./zlib/messages"),h=n("./zlib/zstream"),v=n("./zlib/gzheader"),f=Object.prototype.toString;function p(g){if(!(this instanceof p))return new p(g);this.options=i.assign({chunkSize:16384,windowBits:0,to:""},g||{});var y=this.options;y.raw&&0<=y.windowBits&&y.windowBits<16&&(y.windowBits=-y.windowBits,y.windowBits===0&&(y.windowBits=-15)),!(0<=y.windowBits&&y.windowBits<16)||g&&g.windowBits||(y.windowBits+=32),15<y.windowBits&&y.windowBits<48&&(15&y.windowBits)==0&&(y.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new h,this.strm.avail_out=0;var u=o.inflateInit2(this.strm,y.windowBits);if(u!==d.Z_OK)throw new Error(c[u]);this.header=new v,o.inflateGetHeader(this.strm,this.header)}function m(g,y){var u=new p(y);if(u.push(g,!0),u.err)throw u.msg||c[u.err];return u.result}p.prototype.push=function(g,y){var u,x,k,E,D,R,_=this.strm,N=this.options.chunkSize,L=this.options.dictionary,W=!1;if(this.ended)return!1;x=y===~~y?y:y===!0?d.Z_FINISH:d.Z_NO_FLUSH,typeof g=="string"?_.input=l.binstring2buf(g):f.call(g)==="[object ArrayBuffer]"?_.input=new Uint8Array(g):_.input=g,_.next_in=0,_.avail_in=_.input.length;do{if(_.avail_out===0&&(_.output=new i.Buf8(N),_.next_out=0,_.avail_out=N),(u=o.inflate(_,d.Z_NO_FLUSH))===d.Z_NEED_DICT&&L&&(R=typeof L=="string"?l.string2buf(L):f.call(L)==="[object ArrayBuffer]"?new Uint8Array(L):L,u=o.inflateSetDictionary(this.strm,R)),u===d.Z_BUF_ERROR&&W===!0&&(u=d.Z_OK,W=!1),u!==d.Z_STREAM_END&&u!==d.Z_OK)return this.onEnd(u),!(this.ended=!0);_.next_out&&(_.avail_out!==0&&u!==d.Z_STREAM_END&&(_.avail_in!==0||x!==d.Z_FINISH&&x!==d.Z_SYNC_FLUSH)||(this.options.to==="string"?(k=l.utf8border(_.output,_.next_out),E=_.next_out-k,D=l.buf2string(_.output,k),_.next_out=E,_.avail_out=N-E,E&&i.arraySet(_.output,_.output,k,E,0),this.onData(D)):this.onData(i.shrinkBuf(_.output,_.next_out)))),_.avail_in===0&&_.avail_out===0&&(W=!0)}while((0<_.avail_in||_.avail_out===0)&&u!==d.Z_STREAM_END);return u===d.Z_STREAM_END&&(x=d.Z_FINISH),x===d.Z_FINISH?(u=o.inflateEnd(this.strm),this.onEnd(u),this.ended=!0,u===d.Z_OK):x!==d.Z_SYNC_FLUSH||(this.onEnd(d.Z_OK),!(_.avail_out=0))},p.prototype.onData=function(g){this.chunks.push(g)},p.prototype.onEnd=function(g){g===d.Z_OK&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=i.flattenChunks(this.chunks)),this.chunks=[],this.err=g,this.msg=this.strm.msg},s.Inflate=p,s.inflate=m,s.inflateRaw=function(g,y){return(y=y||{}).raw=!0,m(g,y)},s.ungzip=m},{"./utils/common":41,"./utils/strings":42,"./zlib/constants":44,"./zlib/gzheader":47,"./zlib/inflate":49,"./zlib/messages":51,"./zlib/zstream":53}],41:[function(n,a,s){var o=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Int32Array<"u";s.assign=function(d){for(var c=Array.prototype.slice.call(arguments,1);c.length;){var h=c.shift();if(h){if(typeof h!="object")throw new TypeError(h+"must be non-object");for(var v in h)h.hasOwnProperty(v)&&(d[v]=h[v])}}return d},s.shrinkBuf=function(d,c){return d.length===c?d:d.subarray?d.subarray(0,c):(d.length=c,d)};var i={arraySet:function(d,c,h,v,f){if(c.subarray&&d.subarray)d.set(c.subarray(h,h+v),f);else for(var p=0;p<v;p++)d[f+p]=c[h+p]},flattenChunks:function(d){var c,h,v,f,p,m;for(c=v=0,h=d.length;c<h;c++)v+=d[c].length;for(m=new Uint8Array(v),c=f=0,h=d.length;c<h;c++)p=d[c],m.set(p,f),f+=p.length;return m}},l={arraySet:function(d,c,h,v,f){for(var p=0;p<v;p++)d[f+p]=c[h+p]},flattenChunks:function(d){return[].concat.apply([],d)}};s.setTyped=function(d){d?(s.Buf8=Uint8Array,s.Buf16=Uint16Array,s.Buf32=Int32Array,s.assign(s,i)):(s.Buf8=Array,s.Buf16=Array,s.Buf32=Array,s.assign(s,l))},s.setTyped(o)},{}],42:[function(n,a,s){var o=n("./common"),i=!0,l=!0;try{String.fromCharCode.apply(null,[0])}catch{i=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{l=!1}for(var d=new o.Buf8(256),c=0;c<256;c++)d[c]=252<=c?6:248<=c?5:240<=c?4:224<=c?3:192<=c?2:1;function h(v,f){if(f<65537&&(v.subarray&&l||!v.subarray&&i))return String.fromCharCode.apply(null,o.shrinkBuf(v,f));for(var p="",m=0;m<f;m++)p+=String.fromCharCode(v[m]);return p}d[254]=d[254]=1,s.string2buf=function(v){var f,p,m,g,y,u=v.length,x=0;for(g=0;g<u;g++)(64512&(p=v.charCodeAt(g)))==55296&&g+1<u&&(64512&(m=v.charCodeAt(g+1)))==56320&&(p=65536+(p-55296<<10)+(m-56320),g++),x+=p<128?1:p<2048?2:p<65536?3:4;for(f=new o.Buf8(x),g=y=0;y<x;g++)(64512&(p=v.charCodeAt(g)))==55296&&g+1<u&&(64512&(m=v.charCodeAt(g+1)))==56320&&(p=65536+(p-55296<<10)+(m-56320),g++),p<128?f[y++]=p:(p<2048?f[y++]=192|p>>>6:(p<65536?f[y++]=224|p>>>12:(f[y++]=240|p>>>18,f[y++]=128|p>>>12&63),f[y++]=128|p>>>6&63),f[y++]=128|63&p);return f},s.buf2binstring=function(v){return h(v,v.length)},s.binstring2buf=function(v){for(var f=new o.Buf8(v.length),p=0,m=f.length;p<m;p++)f[p]=v.charCodeAt(p);return f},s.buf2string=function(v,f){var p,m,g,y,u=f||v.length,x=new Array(2*u);for(p=m=0;p<u;)if((g=v[p++])<128)x[m++]=g;else if(4<(y=d[g]))x[m++]=65533,p+=y-1;else{for(g&=y===2?31:y===3?15:7;1<y&&p<u;)g=g<<6|63&v[p++],y--;1<y?x[m++]=65533:g<65536?x[m++]=g:(g-=65536,x[m++]=55296|g>>10&1023,x[m++]=56320|1023&g)}return h(x,m)},s.utf8border=function(v,f){var p;for((f=f||v.length)>v.length&&(f=v.length),p=f-1;0<=p&&(192&v[p])==128;)p--;return p<0||p===0?f:p+d[v[p]]>f?p:f}},{"./common":41}],43:[function(n,a,s){a.exports=function(o,i,l,d){for(var c=65535&o|0,h=o>>>16&65535|0,v=0;l!==0;){for(l-=v=2e3<l?2e3:l;h=h+(c=c+i[d++]|0)|0,--v;);c%=65521,h%=65521}return c|h<<16|0}},{}],44:[function(n,a,s){a.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],45:[function(n,a,s){var o=(function(){for(var i,l=[],d=0;d<256;d++){i=d;for(var c=0;c<8;c++)i=1&i?3988292384^i>>>1:i>>>1;l[d]=i}return l})();a.exports=function(i,l,d,c){var h=o,v=c+d;i^=-1;for(var f=c;f<v;f++)i=i>>>8^h[255&(i^l[f])];return-1^i}},{}],46:[function(n,a,s){var o,i=n("../utils/common"),l=n("./trees"),d=n("./adler32"),c=n("./crc32"),h=n("./messages"),v=0,f=4,p=0,m=-2,g=-1,y=4,u=2,x=8,k=9,E=286,D=30,R=19,_=2*E+1,N=15,L=3,W=258,z=W+L+1,S=42,O=113,w=1,j=2,ee=3,C=4;function Z(b,U){return b.msg=h[U],U}function G(b){return(b<<1)-(4<b?9:0)}function J(b){for(var U=b.length;0<=--U;)b[U]=0}function P(b){var U=b.state,H=U.pending;H>b.avail_out&&(H=b.avail_out),H!==0&&(i.arraySet(b.output,U.pending_buf,U.pending_out,H,b.next_out),b.next_out+=H,U.pending_out+=H,b.total_out+=H,b.avail_out-=H,U.pending-=H,U.pending===0&&(U.pending_out=0))}function I(b,U){l._tr_flush_block(b,0<=b.block_start?b.block_start:-1,b.strstart-b.block_start,U),b.block_start=b.strstart,P(b.strm)}function q(b,U){b.pending_buf[b.pending++]=U}function F(b,U){b.pending_buf[b.pending++]=U>>>8&255,b.pending_buf[b.pending++]=255&U}function V(b,U){var H,$,T=b.max_chain_length,M=b.strstart,K=b.prev_length,Y=b.nice_match,B=b.strstart>b.w_size-z?b.strstart-(b.w_size-z):0,X=b.window,ne=b.w_mask,Q=b.prev,se=b.strstart+W,ye=X[M+K-1],me=X[M+K];b.prev_length>=b.good_match&&(T>>=2),Y>b.lookahead&&(Y=b.lookahead);do if(X[(H=U)+K]===me&&X[H+K-1]===ye&&X[H]===X[M]&&X[++H]===X[M+1]){M+=2,H++;do;while(X[++M]===X[++H]&&X[++M]===X[++H]&&X[++M]===X[++H]&&X[++M]===X[++H]&&X[++M]===X[++H]&&X[++M]===X[++H]&&X[++M]===X[++H]&&X[++M]===X[++H]&&M<se);if($=W-(se-M),M=se-W,K<$){if(b.match_start=U,Y<=(K=$))break;ye=X[M+K-1],me=X[M+K]}}while((U=Q[U&ne])>B&&--T!=0);return K<=b.lookahead?K:b.lookahead}function te(b){var U,H,$,T,M,K,Y,B,X,ne,Q=b.w_size;do{if(T=b.window_size-b.lookahead-b.strstart,b.strstart>=Q+(Q-z)){for(i.arraySet(b.window,b.window,Q,Q,0),b.match_start-=Q,b.strstart-=Q,b.block_start-=Q,U=H=b.hash_size;$=b.head[--U],b.head[U]=Q<=$?$-Q:0,--H;);for(U=H=Q;$=b.prev[--U],b.prev[U]=Q<=$?$-Q:0,--H;);T+=Q}if(b.strm.avail_in===0)break;if(K=b.strm,Y=b.window,B=b.strstart+b.lookahead,X=T,ne=void 0,ne=K.avail_in,X<ne&&(ne=X),H=ne===0?0:(K.avail_in-=ne,i.arraySet(Y,K.input,K.next_in,ne,B),K.state.wrap===1?K.adler=d(K.adler,Y,ne,B):K.state.wrap===2&&(K.adler=c(K.adler,Y,ne,B)),K.next_in+=ne,K.total_in+=ne,ne),b.lookahead+=H,b.lookahead+b.insert>=L)for(M=b.strstart-b.insert,b.ins_h=b.window[M],b.ins_h=(b.ins_h<<b.hash_shift^b.window[M+1])&b.hash_mask;b.insert&&(b.ins_h=(b.ins_h<<b.hash_shift^b.window[M+L-1])&b.hash_mask,b.prev[M&b.w_mask]=b.head[b.ins_h],b.head[b.ins_h]=M,M++,b.insert--,!(b.lookahead+b.insert<L)););}while(b.lookahead<z&&b.strm.avail_in!==0)}function ue(b,U){for(var H,$;;){if(b.lookahead<z){if(te(b),b.lookahead<z&&U===v)return w;if(b.lookahead===0)break}if(H=0,b.lookahead>=L&&(b.ins_h=(b.ins_h<<b.hash_shift^b.window[b.strstart+L-1])&b.hash_mask,H=b.prev[b.strstart&b.w_mask]=b.head[b.ins_h],b.head[b.ins_h]=b.strstart),H!==0&&b.strstart-H<=b.w_size-z&&(b.match_length=V(b,H)),b.match_length>=L)if($=l._tr_tally(b,b.strstart-b.match_start,b.match_length-L),b.lookahead-=b.match_length,b.match_length<=b.max_lazy_match&&b.lookahead>=L){for(b.match_length--;b.strstart++,b.ins_h=(b.ins_h<<b.hash_shift^b.window[b.strstart+L-1])&b.hash_mask,H=b.prev[b.strstart&b.w_mask]=b.head[b.ins_h],b.head[b.ins_h]=b.strstart,--b.match_length!=0;);b.strstart++}else b.strstart+=b.match_length,b.match_length=0,b.ins_h=b.window[b.strstart],b.ins_h=(b.ins_h<<b.hash_shift^b.window[b.strstart+1])&b.hash_mask;else $=l._tr_tally(b,0,b.window[b.strstart]),b.lookahead--,b.strstart++;if($&&(I(b,!1),b.strm.avail_out===0))return w}return b.insert=b.strstart<L-1?b.strstart:L-1,U===f?(I(b,!0),b.strm.avail_out===0?ee:C):b.last_lit&&(I(b,!1),b.strm.avail_out===0)?w:j}function re(b,U){for(var H,$,T;;){if(b.lookahead<z){if(te(b),b.lookahead<z&&U===v)return w;if(b.lookahead===0)break}if(H=0,b.lookahead>=L&&(b.ins_h=(b.ins_h<<b.hash_shift^b.window[b.strstart+L-1])&b.hash_mask,H=b.prev[b.strstart&b.w_mask]=b.head[b.ins_h],b.head[b.ins_h]=b.strstart),b.prev_length=b.match_length,b.prev_match=b.match_start,b.match_length=L-1,H!==0&&b.prev_length<b.max_lazy_match&&b.strstart-H<=b.w_size-z&&(b.match_length=V(b,H),b.match_length<=5&&(b.strategy===1||b.match_length===L&&4096<b.strstart-b.match_start)&&(b.match_length=L-1)),b.prev_length>=L&&b.match_length<=b.prev_length){for(T=b.strstart+b.lookahead-L,$=l._tr_tally(b,b.strstart-1-b.prev_match,b.prev_length-L),b.lookahead-=b.prev_length-1,b.prev_length-=2;++b.strstart<=T&&(b.ins_h=(b.ins_h<<b.hash_shift^b.window[b.strstart+L-1])&b.hash_mask,H=b.prev[b.strstart&b.w_mask]=b.head[b.ins_h],b.head[b.ins_h]=b.strstart),--b.prev_length!=0;);if(b.match_available=0,b.match_length=L-1,b.strstart++,$&&(I(b,!1),b.strm.avail_out===0))return w}else if(b.match_available){if(($=l._tr_tally(b,0,b.window[b.strstart-1]))&&I(b,!1),b.strstart++,b.lookahead--,b.strm.avail_out===0)return w}else b.match_available=1,b.strstart++,b.lookahead--}return b.match_available&&($=l._tr_tally(b,0,b.window[b.strstart-1]),b.match_available=0),b.insert=b.strstart<L-1?b.strstart:L-1,U===f?(I(b,!0),b.strm.avail_out===0?ee:C):b.last_lit&&(I(b,!1),b.strm.avail_out===0)?w:j}function ae(b,U,H,$,T){this.good_length=b,this.max_lazy=U,this.nice_length=H,this.max_chain=$,this.func=T}function ce(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=x,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new i.Buf16(2*_),this.dyn_dtree=new i.Buf16(2*(2*D+1)),this.bl_tree=new i.Buf16(2*(2*R+1)),J(this.dyn_ltree),J(this.dyn_dtree),J(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new i.Buf16(N+1),this.heap=new i.Buf16(2*E+1),J(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new i.Buf16(2*E+1),J(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function fe(b){var U;return b&&b.state?(b.total_in=b.total_out=0,b.data_type=u,(U=b.state).pending=0,U.pending_out=0,U.wrap<0&&(U.wrap=-U.wrap),U.status=U.wrap?S:O,b.adler=U.wrap===2?0:1,U.last_flush=v,l._tr_init(U),p):Z(b,m)}function ge(b){var U=fe(b);return U===p&&(function(H){H.window_size=2*H.w_size,J(H.head),H.max_lazy_match=o[H.level].max_lazy,H.good_match=o[H.level].good_length,H.nice_match=o[H.level].nice_length,H.max_chain_length=o[H.level].max_chain,H.strstart=0,H.block_start=0,H.lookahead=0,H.insert=0,H.match_length=H.prev_length=L-1,H.match_available=0,H.ins_h=0})(b.state),U}function de(b,U,H,$,T,M){if(!b)return m;var K=1;if(U===g&&(U=6),$<0?(K=0,$=-$):15<$&&(K=2,$-=16),T<1||k<T||H!==x||$<8||15<$||U<0||9<U||M<0||y<M)return Z(b,m);$===8&&($=9);var Y=new ce;return(b.state=Y).strm=b,Y.wrap=K,Y.gzhead=null,Y.w_bits=$,Y.w_size=1<<Y.w_bits,Y.w_mask=Y.w_size-1,Y.hash_bits=T+7,Y.hash_size=1<<Y.hash_bits,Y.hash_mask=Y.hash_size-1,Y.hash_shift=~~((Y.hash_bits+L-1)/L),Y.window=new i.Buf8(2*Y.w_size),Y.head=new i.Buf16(Y.hash_size),Y.prev=new i.Buf16(Y.w_size),Y.lit_bufsize=1<<T+6,Y.pending_buf_size=4*Y.lit_bufsize,Y.pending_buf=new i.Buf8(Y.pending_buf_size),Y.d_buf=1*Y.lit_bufsize,Y.l_buf=3*Y.lit_bufsize,Y.level=U,Y.strategy=M,Y.method=H,ge(b)}o=[new ae(0,0,0,0,function(b,U){var H=65535;for(H>b.pending_buf_size-5&&(H=b.pending_buf_size-5);;){if(b.lookahead<=1){if(te(b),b.lookahead===0&&U===v)return w;if(b.lookahead===0)break}b.strstart+=b.lookahead,b.lookahead=0;var $=b.block_start+H;if((b.strstart===0||b.strstart>=$)&&(b.lookahead=b.strstart-$,b.strstart=$,I(b,!1),b.strm.avail_out===0)||b.strstart-b.block_start>=b.w_size-z&&(I(b,!1),b.strm.avail_out===0))return w}return b.insert=0,U===f?(I(b,!0),b.strm.avail_out===0?ee:C):(b.strstart>b.block_start&&(I(b,!1),b.strm.avail_out),w)}),new ae(4,4,8,4,ue),new ae(4,5,16,8,ue),new ae(4,6,32,32,ue),new ae(4,4,16,16,re),new ae(8,16,32,32,re),new ae(8,16,128,128,re),new ae(8,32,128,256,re),new ae(32,128,258,1024,re),new ae(32,258,258,4096,re)],s.deflateInit=function(b,U){return de(b,U,x,15,8,0)},s.deflateInit2=de,s.deflateReset=ge,s.deflateResetKeep=fe,s.deflateSetHeader=function(b,U){return b&&b.state?b.state.wrap!==2?m:(b.state.gzhead=U,p):m},s.deflate=function(b,U){var H,$,T,M;if(!b||!b.state||5<U||U<0)return b?Z(b,m):m;if($=b.state,!b.output||!b.input&&b.avail_in!==0||$.status===666&&U!==f)return Z(b,b.avail_out===0?-5:m);if($.strm=b,H=$.last_flush,$.last_flush=U,$.status===S)if($.wrap===2)b.adler=0,q($,31),q($,139),q($,8),$.gzhead?(q($,($.gzhead.text?1:0)+($.gzhead.hcrc?2:0)+($.gzhead.extra?4:0)+($.gzhead.name?8:0)+($.gzhead.comment?16:0)),q($,255&$.gzhead.time),q($,$.gzhead.time>>8&255),q($,$.gzhead.time>>16&255),q($,$.gzhead.time>>24&255),q($,$.level===9?2:2<=$.strategy||$.level<2?4:0),q($,255&$.gzhead.os),$.gzhead.extra&&$.gzhead.extra.length&&(q($,255&$.gzhead.extra.length),q($,$.gzhead.extra.length>>8&255)),$.gzhead.hcrc&&(b.adler=c(b.adler,$.pending_buf,$.pending,0)),$.gzindex=0,$.status=69):(q($,0),q($,0),q($,0),q($,0),q($,0),q($,$.level===9?2:2<=$.strategy||$.level<2?4:0),q($,3),$.status=O);else{var K=x+($.w_bits-8<<4)<<8;K|=(2<=$.strategy||$.level<2?0:$.level<6?1:$.level===6?2:3)<<6,$.strstart!==0&&(K|=32),K+=31-K%31,$.status=O,F($,K),$.strstart!==0&&(F($,b.adler>>>16),F($,65535&b.adler)),b.adler=1}if($.status===69)if($.gzhead.extra){for(T=$.pending;$.gzindex<(65535&$.gzhead.extra.length)&&($.pending!==$.pending_buf_size||($.gzhead.hcrc&&$.pending>T&&(b.adler=c(b.adler,$.pending_buf,$.pending-T,T)),P(b),T=$.pending,$.pending!==$.pending_buf_size));)q($,255&$.gzhead.extra[$.gzindex]),$.gzindex++;$.gzhead.hcrc&&$.pending>T&&(b.adler=c(b.adler,$.pending_buf,$.pending-T,T)),$.gzindex===$.gzhead.extra.length&&($.gzindex=0,$.status=73)}else $.status=73;if($.status===73)if($.gzhead.name){T=$.pending;do{if($.pending===$.pending_buf_size&&($.gzhead.hcrc&&$.pending>T&&(b.adler=c(b.adler,$.pending_buf,$.pending-T,T)),P(b),T=$.pending,$.pending===$.pending_buf_size)){M=1;break}M=$.gzindex<$.gzhead.name.length?255&$.gzhead.name.charCodeAt($.gzindex++):0,q($,M)}while(M!==0);$.gzhead.hcrc&&$.pending>T&&(b.adler=c(b.adler,$.pending_buf,$.pending-T,T)),M===0&&($.gzindex=0,$.status=91)}else $.status=91;if($.status===91)if($.gzhead.comment){T=$.pending;do{if($.pending===$.pending_buf_size&&($.gzhead.hcrc&&$.pending>T&&(b.adler=c(b.adler,$.pending_buf,$.pending-T,T)),P(b),T=$.pending,$.pending===$.pending_buf_size)){M=1;break}M=$.gzindex<$.gzhead.comment.length?255&$.gzhead.comment.charCodeAt($.gzindex++):0,q($,M)}while(M!==0);$.gzhead.hcrc&&$.pending>T&&(b.adler=c(b.adler,$.pending_buf,$.pending-T,T)),M===0&&($.status=103)}else $.status=103;if($.status===103&&($.gzhead.hcrc?($.pending+2>$.pending_buf_size&&P(b),$.pending+2<=$.pending_buf_size&&(q($,255&b.adler),q($,b.adler>>8&255),b.adler=0,$.status=O)):$.status=O),$.pending!==0){if(P(b),b.avail_out===0)return $.last_flush=-1,p}else if(b.avail_in===0&&G(U)<=G(H)&&U!==f)return Z(b,-5);if($.status===666&&b.avail_in!==0)return Z(b,-5);if(b.avail_in!==0||$.lookahead!==0||U!==v&&$.status!==666){var Y=$.strategy===2?(function(B,X){for(var ne;;){if(B.lookahead===0&&(te(B),B.lookahead===0)){if(X===v)return w;break}if(B.match_length=0,ne=l._tr_tally(B,0,B.window[B.strstart]),B.lookahead--,B.strstart++,ne&&(I(B,!1),B.strm.avail_out===0))return w}return B.insert=0,X===f?(I(B,!0),B.strm.avail_out===0?ee:C):B.last_lit&&(I(B,!1),B.strm.avail_out===0)?w:j})($,U):$.strategy===3?(function(B,X){for(var ne,Q,se,ye,me=B.window;;){if(B.lookahead<=W){if(te(B),B.lookahead<=W&&X===v)return w;if(B.lookahead===0)break}if(B.match_length=0,B.lookahead>=L&&0<B.strstart&&(Q=me[se=B.strstart-1])===me[++se]&&Q===me[++se]&&Q===me[++se]){ye=B.strstart+W;do;while(Q===me[++se]&&Q===me[++se]&&Q===me[++se]&&Q===me[++se]&&Q===me[++se]&&Q===me[++se]&&Q===me[++se]&&Q===me[++se]&&se<ye);B.match_length=W-(ye-se),B.match_length>B.lookahead&&(B.match_length=B.lookahead)}if(B.match_length>=L?(ne=l._tr_tally(B,1,B.match_length-L),B.lookahead-=B.match_length,B.strstart+=B.match_length,B.match_length=0):(ne=l._tr_tally(B,0,B.window[B.strstart]),B.lookahead--,B.strstart++),ne&&(I(B,!1),B.strm.avail_out===0))return w}return B.insert=0,X===f?(I(B,!0),B.strm.avail_out===0?ee:C):B.last_lit&&(I(B,!1),B.strm.avail_out===0)?w:j})($,U):o[$.level].func($,U);if(Y!==ee&&Y!==C||($.status=666),Y===w||Y===ee)return b.avail_out===0&&($.last_flush=-1),p;if(Y===j&&(U===1?l._tr_align($):U!==5&&(l._tr_stored_block($,0,0,!1),U===3&&(J($.head),$.lookahead===0&&($.strstart=0,$.block_start=0,$.insert=0))),P(b),b.avail_out===0))return $.last_flush=-1,p}return U!==f?p:$.wrap<=0?1:($.wrap===2?(q($,255&b.adler),q($,b.adler>>8&255),q($,b.adler>>16&255),q($,b.adler>>24&255),q($,255&b.total_in),q($,b.total_in>>8&255),q($,b.total_in>>16&255),q($,b.total_in>>24&255)):(F($,b.adler>>>16),F($,65535&b.adler)),P(b),0<$.wrap&&($.wrap=-$.wrap),$.pending!==0?p:1)},s.deflateEnd=function(b){var U;return b&&b.state?(U=b.state.status)!==S&&U!==69&&U!==73&&U!==91&&U!==103&&U!==O&&U!==666?Z(b,m):(b.state=null,U===O?Z(b,-3):p):m},s.deflateSetDictionary=function(b,U){var H,$,T,M,K,Y,B,X,ne=U.length;if(!b||!b.state||(M=(H=b.state).wrap)===2||M===1&&H.status!==S||H.lookahead)return m;for(M===1&&(b.adler=d(b.adler,U,ne,0)),H.wrap=0,ne>=H.w_size&&(M===0&&(J(H.head),H.strstart=0,H.block_start=0,H.insert=0),X=new i.Buf8(H.w_size),i.arraySet(X,U,ne-H.w_size,H.w_size,0),U=X,ne=H.w_size),K=b.avail_in,Y=b.next_in,B=b.input,b.avail_in=ne,b.next_in=0,b.input=U,te(H);H.lookahead>=L;){for($=H.strstart,T=H.lookahead-(L-1);H.ins_h=(H.ins_h<<H.hash_shift^H.window[$+L-1])&H.hash_mask,H.prev[$&H.w_mask]=H.head[H.ins_h],H.head[H.ins_h]=$,$++,--T;);H.strstart=$,H.lookahead=L-1,te(H)}return H.strstart+=H.lookahead,H.block_start=H.strstart,H.insert=H.lookahead,H.lookahead=0,H.match_length=H.prev_length=L-1,H.match_available=0,b.next_in=Y,b.input=B,b.avail_in=K,H.wrap=M,p},s.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./messages":51,"./trees":52}],47:[function(n,a,s){a.exports=function(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}},{}],48:[function(n,a,s){a.exports=function(o,i){var l,d,c,h,v,f,p,m,g,y,u,x,k,E,D,R,_,N,L,W,z,S,O,w,j;l=o.state,d=o.next_in,w=o.input,c=d+(o.avail_in-5),h=o.next_out,j=o.output,v=h-(i-o.avail_out),f=h+(o.avail_out-257),p=l.dmax,m=l.wsize,g=l.whave,y=l.wnext,u=l.window,x=l.hold,k=l.bits,E=l.lencode,D=l.distcode,R=(1<<l.lenbits)-1,_=(1<<l.distbits)-1;e:do{k<15&&(x+=w[d++]<<k,k+=8,x+=w[d++]<<k,k+=8),N=E[x&R];t:for(;;){if(x>>>=L=N>>>24,k-=L,(L=N>>>16&255)===0)j[h++]=65535&N;else{if(!(16&L)){if((64&L)==0){N=E[(65535&N)+(x&(1<<L)-1)];continue t}if(32&L){l.mode=12;break e}o.msg="invalid literal/length code",l.mode=30;break e}W=65535&N,(L&=15)&&(k<L&&(x+=w[d++]<<k,k+=8),W+=x&(1<<L)-1,x>>>=L,k-=L),k<15&&(x+=w[d++]<<k,k+=8,x+=w[d++]<<k,k+=8),N=D[x&_];n:for(;;){if(x>>>=L=N>>>24,k-=L,!(16&(L=N>>>16&255))){if((64&L)==0){N=D[(65535&N)+(x&(1<<L)-1)];continue n}o.msg="invalid distance code",l.mode=30;break e}if(z=65535&N,k<(L&=15)&&(x+=w[d++]<<k,(k+=8)<L&&(x+=w[d++]<<k,k+=8)),p<(z+=x&(1<<L)-1)){o.msg="invalid distance too far back",l.mode=30;break e}if(x>>>=L,k-=L,(L=h-v)<z){if(g<(L=z-L)&&l.sane){o.msg="invalid distance too far back",l.mode=30;break e}if(O=u,(S=0)===y){if(S+=m-L,L<W){for(W-=L;j[h++]=u[S++],--L;);S=h-z,O=j}}else if(y<L){if(S+=m+y-L,(L-=y)<W){for(W-=L;j[h++]=u[S++],--L;);if(S=0,y<W){for(W-=L=y;j[h++]=u[S++],--L;);S=h-z,O=j}}}else if(S+=y-L,L<W){for(W-=L;j[h++]=u[S++],--L;);S=h-z,O=j}for(;2<W;)j[h++]=O[S++],j[h++]=O[S++],j[h++]=O[S++],W-=3;W&&(j[h++]=O[S++],1<W&&(j[h++]=O[S++]))}else{for(S=h-z;j[h++]=j[S++],j[h++]=j[S++],j[h++]=j[S++],2<(W-=3););W&&(j[h++]=j[S++],1<W&&(j[h++]=j[S++]))}break}}break}}while(d<c&&h<f);d-=W=k>>3,x&=(1<<(k-=W<<3))-1,o.next_in=d,o.next_out=h,o.avail_in=d<c?c-d+5:5-(d-c),o.avail_out=h<f?f-h+257:257-(h-f),l.hold=x,l.bits=k}},{}],49:[function(n,a,s){var o=n("../utils/common"),i=n("./adler32"),l=n("./crc32"),d=n("./inffast"),c=n("./inftrees"),h=1,v=2,f=0,p=-2,m=1,g=852,y=592;function u(S){return(S>>>24&255)+(S>>>8&65280)+((65280&S)<<8)+((255&S)<<24)}function x(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new o.Buf16(320),this.work=new o.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function k(S){var O;return S&&S.state?(O=S.state,S.total_in=S.total_out=O.total=0,S.msg="",O.wrap&&(S.adler=1&O.wrap),O.mode=m,O.last=0,O.havedict=0,O.dmax=32768,O.head=null,O.hold=0,O.bits=0,O.lencode=O.lendyn=new o.Buf32(g),O.distcode=O.distdyn=new o.Buf32(y),O.sane=1,O.back=-1,f):p}function E(S){var O;return S&&S.state?((O=S.state).wsize=0,O.whave=0,O.wnext=0,k(S)):p}function D(S,O){var w,j;return S&&S.state?(j=S.state,O<0?(w=0,O=-O):(w=1+(O>>4),O<48&&(O&=15)),O&&(O<8||15<O)?p:(j.window!==null&&j.wbits!==O&&(j.window=null),j.wrap=w,j.wbits=O,E(S))):p}function R(S,O){var w,j;return S?(j=new x,(S.state=j).window=null,(w=D(S,O))!==f&&(S.state=null),w):p}var _,N,L=!0;function W(S){if(L){var O;for(_=new o.Buf32(512),N=new o.Buf32(32),O=0;O<144;)S.lens[O++]=8;for(;O<256;)S.lens[O++]=9;for(;O<280;)S.lens[O++]=7;for(;O<288;)S.lens[O++]=8;for(c(h,S.lens,0,288,_,0,S.work,{bits:9}),O=0;O<32;)S.lens[O++]=5;c(v,S.lens,0,32,N,0,S.work,{bits:5}),L=!1}S.lencode=_,S.lenbits=9,S.distcode=N,S.distbits=5}function z(S,O,w,j){var ee,C=S.state;return C.window===null&&(C.wsize=1<<C.wbits,C.wnext=0,C.whave=0,C.window=new o.Buf8(C.wsize)),j>=C.wsize?(o.arraySet(C.window,O,w-C.wsize,C.wsize,0),C.wnext=0,C.whave=C.wsize):(j<(ee=C.wsize-C.wnext)&&(ee=j),o.arraySet(C.window,O,w-j,ee,C.wnext),(j-=ee)?(o.arraySet(C.window,O,w-j,j,0),C.wnext=j,C.whave=C.wsize):(C.wnext+=ee,C.wnext===C.wsize&&(C.wnext=0),C.whave<C.wsize&&(C.whave+=ee))),0}s.inflateReset=E,s.inflateReset2=D,s.inflateResetKeep=k,s.inflateInit=function(S){return R(S,15)},s.inflateInit2=R,s.inflate=function(S,O){var w,j,ee,C,Z,G,J,P,I,q,F,V,te,ue,re,ae,ce,fe,ge,de,b,U,H,$,T=0,M=new o.Buf8(4),K=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!S||!S.state||!S.output||!S.input&&S.avail_in!==0)return p;(w=S.state).mode===12&&(w.mode=13),Z=S.next_out,ee=S.output,J=S.avail_out,C=S.next_in,j=S.input,G=S.avail_in,P=w.hold,I=w.bits,q=G,F=J,U=f;e:for(;;)switch(w.mode){case m:if(w.wrap===0){w.mode=13;break}for(;I<16;){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}if(2&w.wrap&&P===35615){M[w.check=0]=255&P,M[1]=P>>>8&255,w.check=l(w.check,M,2,0),I=P=0,w.mode=2;break}if(w.flags=0,w.head&&(w.head.done=!1),!(1&w.wrap)||(((255&P)<<8)+(P>>8))%31){S.msg="incorrect header check",w.mode=30;break}if((15&P)!=8){S.msg="unknown compression method",w.mode=30;break}if(I-=4,b=8+(15&(P>>>=4)),w.wbits===0)w.wbits=b;else if(b>w.wbits){S.msg="invalid window size",w.mode=30;break}w.dmax=1<<b,S.adler=w.check=1,w.mode=512&P?10:12,I=P=0;break;case 2:for(;I<16;){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}if(w.flags=P,(255&w.flags)!=8){S.msg="unknown compression method",w.mode=30;break}if(57344&w.flags){S.msg="unknown header flags set",w.mode=30;break}w.head&&(w.head.text=P>>8&1),512&w.flags&&(M[0]=255&P,M[1]=P>>>8&255,w.check=l(w.check,M,2,0)),I=P=0,w.mode=3;case 3:for(;I<32;){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}w.head&&(w.head.time=P),512&w.flags&&(M[0]=255&P,M[1]=P>>>8&255,M[2]=P>>>16&255,M[3]=P>>>24&255,w.check=l(w.check,M,4,0)),I=P=0,w.mode=4;case 4:for(;I<16;){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}w.head&&(w.head.xflags=255&P,w.head.os=P>>8),512&w.flags&&(M[0]=255&P,M[1]=P>>>8&255,w.check=l(w.check,M,2,0)),I=P=0,w.mode=5;case 5:if(1024&w.flags){for(;I<16;){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}w.length=P,w.head&&(w.head.extra_len=P),512&w.flags&&(M[0]=255&P,M[1]=P>>>8&255,w.check=l(w.check,M,2,0)),I=P=0}else w.head&&(w.head.extra=null);w.mode=6;case 6:if(1024&w.flags&&(G<(V=w.length)&&(V=G),V&&(w.head&&(b=w.head.extra_len-w.length,w.head.extra||(w.head.extra=new Array(w.head.extra_len)),o.arraySet(w.head.extra,j,C,V,b)),512&w.flags&&(w.check=l(w.check,j,V,C)),G-=V,C+=V,w.length-=V),w.length))break e;w.length=0,w.mode=7;case 7:if(2048&w.flags){if(G===0)break e;for(V=0;b=j[C+V++],w.head&&b&&w.length<65536&&(w.head.name+=String.fromCharCode(b)),b&&V<G;);if(512&w.flags&&(w.check=l(w.check,j,V,C)),G-=V,C+=V,b)break e}else w.head&&(w.head.name=null);w.length=0,w.mode=8;case 8:if(4096&w.flags){if(G===0)break e;for(V=0;b=j[C+V++],w.head&&b&&w.length<65536&&(w.head.comment+=String.fromCharCode(b)),b&&V<G;);if(512&w.flags&&(w.check=l(w.check,j,V,C)),G-=V,C+=V,b)break e}else w.head&&(w.head.comment=null);w.mode=9;case 9:if(512&w.flags){for(;I<16;){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}if(P!==(65535&w.check)){S.msg="header crc mismatch",w.mode=30;break}I=P=0}w.head&&(w.head.hcrc=w.flags>>9&1,w.head.done=!0),S.adler=w.check=0,w.mode=12;break;case 10:for(;I<32;){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}S.adler=w.check=u(P),I=P=0,w.mode=11;case 11:if(w.havedict===0)return S.next_out=Z,S.avail_out=J,S.next_in=C,S.avail_in=G,w.hold=P,w.bits=I,2;S.adler=w.check=1,w.mode=12;case 12:if(O===5||O===6)break e;case 13:if(w.last){P>>>=7&I,I-=7&I,w.mode=27;break}for(;I<3;){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}switch(w.last=1&P,I-=1,3&(P>>>=1)){case 0:w.mode=14;break;case 1:if(W(w),w.mode=20,O!==6)break;P>>>=2,I-=2;break e;case 2:w.mode=17;break;case 3:S.msg="invalid block type",w.mode=30}P>>>=2,I-=2;break;case 14:for(P>>>=7&I,I-=7&I;I<32;){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}if((65535&P)!=(P>>>16^65535)){S.msg="invalid stored block lengths",w.mode=30;break}if(w.length=65535&P,I=P=0,w.mode=15,O===6)break e;case 15:w.mode=16;case 16:if(V=w.length){if(G<V&&(V=G),J<V&&(V=J),V===0)break e;o.arraySet(ee,j,C,V,Z),G-=V,C+=V,J-=V,Z+=V,w.length-=V;break}w.mode=12;break;case 17:for(;I<14;){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}if(w.nlen=257+(31&P),P>>>=5,I-=5,w.ndist=1+(31&P),P>>>=5,I-=5,w.ncode=4+(15&P),P>>>=4,I-=4,286<w.nlen||30<w.ndist){S.msg="too many length or distance symbols",w.mode=30;break}w.have=0,w.mode=18;case 18:for(;w.have<w.ncode;){for(;I<3;){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}w.lens[K[w.have++]]=7&P,P>>>=3,I-=3}for(;w.have<19;)w.lens[K[w.have++]]=0;if(w.lencode=w.lendyn,w.lenbits=7,H={bits:w.lenbits},U=c(0,w.lens,0,19,w.lencode,0,w.work,H),w.lenbits=H.bits,U){S.msg="invalid code lengths set",w.mode=30;break}w.have=0,w.mode=19;case 19:for(;w.have<w.nlen+w.ndist;){for(;ae=(T=w.lencode[P&(1<<w.lenbits)-1])>>>16&255,ce=65535&T,!((re=T>>>24)<=I);){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}if(ce<16)P>>>=re,I-=re,w.lens[w.have++]=ce;else{if(ce===16){for($=re+2;I<$;){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}if(P>>>=re,I-=re,w.have===0){S.msg="invalid bit length repeat",w.mode=30;break}b=w.lens[w.have-1],V=3+(3&P),P>>>=2,I-=2}else if(ce===17){for($=re+3;I<$;){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}I-=re,b=0,V=3+(7&(P>>>=re)),P>>>=3,I-=3}else{for($=re+7;I<$;){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}I-=re,b=0,V=11+(127&(P>>>=re)),P>>>=7,I-=7}if(w.have+V>w.nlen+w.ndist){S.msg="invalid bit length repeat",w.mode=30;break}for(;V--;)w.lens[w.have++]=b}}if(w.mode===30)break;if(w.lens[256]===0){S.msg="invalid code -- missing end-of-block",w.mode=30;break}if(w.lenbits=9,H={bits:w.lenbits},U=c(h,w.lens,0,w.nlen,w.lencode,0,w.work,H),w.lenbits=H.bits,U){S.msg="invalid literal/lengths set",w.mode=30;break}if(w.distbits=6,w.distcode=w.distdyn,H={bits:w.distbits},U=c(v,w.lens,w.nlen,w.ndist,w.distcode,0,w.work,H),w.distbits=H.bits,U){S.msg="invalid distances set",w.mode=30;break}if(w.mode=20,O===6)break e;case 20:w.mode=21;case 21:if(6<=G&&258<=J){S.next_out=Z,S.avail_out=J,S.next_in=C,S.avail_in=G,w.hold=P,w.bits=I,d(S,F),Z=S.next_out,ee=S.output,J=S.avail_out,C=S.next_in,j=S.input,G=S.avail_in,P=w.hold,I=w.bits,w.mode===12&&(w.back=-1);break}for(w.back=0;ae=(T=w.lencode[P&(1<<w.lenbits)-1])>>>16&255,ce=65535&T,!((re=T>>>24)<=I);){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}if(ae&&(240&ae)==0){for(fe=re,ge=ae,de=ce;ae=(T=w.lencode[de+((P&(1<<fe+ge)-1)>>fe)])>>>16&255,ce=65535&T,!(fe+(re=T>>>24)<=I);){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}P>>>=fe,I-=fe,w.back+=fe}if(P>>>=re,I-=re,w.back+=re,w.length=ce,ae===0){w.mode=26;break}if(32&ae){w.back=-1,w.mode=12;break}if(64&ae){S.msg="invalid literal/length code",w.mode=30;break}w.extra=15&ae,w.mode=22;case 22:if(w.extra){for($=w.extra;I<$;){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}w.length+=P&(1<<w.extra)-1,P>>>=w.extra,I-=w.extra,w.back+=w.extra}w.was=w.length,w.mode=23;case 23:for(;ae=(T=w.distcode[P&(1<<w.distbits)-1])>>>16&255,ce=65535&T,!((re=T>>>24)<=I);){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}if((240&ae)==0){for(fe=re,ge=ae,de=ce;ae=(T=w.distcode[de+((P&(1<<fe+ge)-1)>>fe)])>>>16&255,ce=65535&T,!(fe+(re=T>>>24)<=I);){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}P>>>=fe,I-=fe,w.back+=fe}if(P>>>=re,I-=re,w.back+=re,64&ae){S.msg="invalid distance code",w.mode=30;break}w.offset=ce,w.extra=15&ae,w.mode=24;case 24:if(w.extra){for($=w.extra;I<$;){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}w.offset+=P&(1<<w.extra)-1,P>>>=w.extra,I-=w.extra,w.back+=w.extra}if(w.offset>w.dmax){S.msg="invalid distance too far back",w.mode=30;break}w.mode=25;case 25:if(J===0)break e;if(V=F-J,w.offset>V){if((V=w.offset-V)>w.whave&&w.sane){S.msg="invalid distance too far back",w.mode=30;break}te=V>w.wnext?(V-=w.wnext,w.wsize-V):w.wnext-V,V>w.length&&(V=w.length),ue=w.window}else ue=ee,te=Z-w.offset,V=w.length;for(J<V&&(V=J),J-=V,w.length-=V;ee[Z++]=ue[te++],--V;);w.length===0&&(w.mode=21);break;case 26:if(J===0)break e;ee[Z++]=w.length,J--,w.mode=21;break;case 27:if(w.wrap){for(;I<32;){if(G===0)break e;G--,P|=j[C++]<<I,I+=8}if(F-=J,S.total_out+=F,w.total+=F,F&&(S.adler=w.check=w.flags?l(w.check,ee,F,Z-F):i(w.check,ee,F,Z-F)),F=J,(w.flags?P:u(P))!==w.check){S.msg="incorrect data check",w.mode=30;break}I=P=0}w.mode=28;case 28:if(w.wrap&&w.flags){for(;I<32;){if(G===0)break e;G--,P+=j[C++]<<I,I+=8}if(P!==(4294967295&w.total)){S.msg="incorrect length check",w.mode=30;break}I=P=0}w.mode=29;case 29:U=1;break e;case 30:U=-3;break e;case 31:return-4;default:return p}return S.next_out=Z,S.avail_out=J,S.next_in=C,S.avail_in=G,w.hold=P,w.bits=I,(w.wsize||F!==S.avail_out&&w.mode<30&&(w.mode<27||O!==4))&&z(S,S.output,S.next_out,F-S.avail_out)?(w.mode=31,-4):(q-=S.avail_in,F-=S.avail_out,S.total_in+=q,S.total_out+=F,w.total+=F,w.wrap&&F&&(S.adler=w.check=w.flags?l(w.check,ee,F,S.next_out-F):i(w.check,ee,F,S.next_out-F)),S.data_type=w.bits+(w.last?64:0)+(w.mode===12?128:0)+(w.mode===20||w.mode===15?256:0),(q==0&&F===0||O===4)&&U===f&&(U=-5),U)},s.inflateEnd=function(S){if(!S||!S.state)return p;var O=S.state;return O.window&&(O.window=null),S.state=null,f},s.inflateGetHeader=function(S,O){var w;return S&&S.state?(2&(w=S.state).wrap)==0?p:((w.head=O).done=!1,f):p},s.inflateSetDictionary=function(S,O){var w,j=O.length;return S&&S.state?(w=S.state).wrap!==0&&w.mode!==11?p:w.mode===11&&i(1,O,j,0)!==w.check?-3:z(S,O,j,j)?(w.mode=31,-4):(w.havedict=1,f):p},s.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":41,"./adler32":43,"./crc32":45,"./inffast":48,"./inftrees":50}],50:[function(n,a,s){var o=n("../utils/common"),i=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],l=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],d=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],c=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];a.exports=function(h,v,f,p,m,g,y,u){var x,k,E,D,R,_,N,L,W,z=u.bits,S=0,O=0,w=0,j=0,ee=0,C=0,Z=0,G=0,J=0,P=0,I=null,q=0,F=new o.Buf16(16),V=new o.Buf16(16),te=null,ue=0;for(S=0;S<=15;S++)F[S]=0;for(O=0;O<p;O++)F[v[f+O]]++;for(ee=z,j=15;1<=j&&F[j]===0;j--);if(j<ee&&(ee=j),j===0)return m[g++]=20971520,m[g++]=20971520,u.bits=1,0;for(w=1;w<j&&F[w]===0;w++);for(ee<w&&(ee=w),S=G=1;S<=15;S++)if(G<<=1,(G-=F[S])<0)return-1;if(0<G&&(h===0||j!==1))return-1;for(V[1]=0,S=1;S<15;S++)V[S+1]=V[S]+F[S];for(O=0;O<p;O++)v[f+O]!==0&&(y[V[v[f+O]]++]=O);if(_=h===0?(I=te=y,19):h===1?(I=i,q-=257,te=l,ue-=257,256):(I=d,te=c,-1),S=w,R=g,Z=O=P=0,E=-1,D=(J=1<<(C=ee))-1,h===1&&852<J||h===2&&592<J)return 1;for(;;){for(N=S-Z,W=y[O]<_?(L=0,y[O]):y[O]>_?(L=te[ue+y[O]],I[q+y[O]]):(L=96,0),x=1<<S-Z,w=k=1<<C;m[R+(P>>Z)+(k-=x)]=N<<24|L<<16|W|0,k!==0;);for(x=1<<S-1;P&x;)x>>=1;if(x!==0?(P&=x-1,P+=x):P=0,O++,--F[S]==0){if(S===j)break;S=v[f+y[O]]}if(ee<S&&(P&D)!==E){for(Z===0&&(Z=ee),R+=w,G=1<<(C=S-Z);C+Z<j&&!((G-=F[C+Z])<=0);)C++,G<<=1;if(J+=1<<C,h===1&&852<J||h===2&&592<J)return 1;m[E=P&D]=ee<<24|C<<16|R-g|0}}return P!==0&&(m[R+P]=S-Z<<24|64<<16|0),u.bits=ee,0}},{"../utils/common":41}],51:[function(n,a,s){a.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],52:[function(n,a,s){var o=n("../utils/common"),i=0,l=1;function d(T){for(var M=T.length;0<=--M;)T[M]=0}var c=0,h=29,v=256,f=v+1+h,p=30,m=19,g=2*f+1,y=15,u=16,x=7,k=256,E=16,D=17,R=18,_=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],N=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],L=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],W=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],z=new Array(2*(f+2));d(z);var S=new Array(2*p);d(S);var O=new Array(512);d(O);var w=new Array(256);d(w);var j=new Array(h);d(j);var ee,C,Z,G=new Array(p);function J(T,M,K,Y,B){this.static_tree=T,this.extra_bits=M,this.extra_base=K,this.elems=Y,this.max_length=B,this.has_stree=T&&T.length}function P(T,M){this.dyn_tree=T,this.max_code=0,this.stat_desc=M}function I(T){return T<256?O[T]:O[256+(T>>>7)]}function q(T,M){T.pending_buf[T.pending++]=255&M,T.pending_buf[T.pending++]=M>>>8&255}function F(T,M,K){T.bi_valid>u-K?(T.bi_buf|=M<<T.bi_valid&65535,q(T,T.bi_buf),T.bi_buf=M>>u-T.bi_valid,T.bi_valid+=K-u):(T.bi_buf|=M<<T.bi_valid&65535,T.bi_valid+=K)}function V(T,M,K){F(T,K[2*M],K[2*M+1])}function te(T,M){for(var K=0;K|=1&T,T>>>=1,K<<=1,0<--M;);return K>>>1}function ue(T,M,K){var Y,B,X=new Array(y+1),ne=0;for(Y=1;Y<=y;Y++)X[Y]=ne=ne+K[Y-1]<<1;for(B=0;B<=M;B++){var Q=T[2*B+1];Q!==0&&(T[2*B]=te(X[Q]++,Q))}}function re(T){var M;for(M=0;M<f;M++)T.dyn_ltree[2*M]=0;for(M=0;M<p;M++)T.dyn_dtree[2*M]=0;for(M=0;M<m;M++)T.bl_tree[2*M]=0;T.dyn_ltree[2*k]=1,T.opt_len=T.static_len=0,T.last_lit=T.matches=0}function ae(T){8<T.bi_valid?q(T,T.bi_buf):0<T.bi_valid&&(T.pending_buf[T.pending++]=T.bi_buf),T.bi_buf=0,T.bi_valid=0}function ce(T,M,K,Y){var B=2*M,X=2*K;return T[B]<T[X]||T[B]===T[X]&&Y[M]<=Y[K]}function fe(T,M,K){for(var Y=T.heap[K],B=K<<1;B<=T.heap_len&&(B<T.heap_len&&ce(M,T.heap[B+1],T.heap[B],T.depth)&&B++,!ce(M,Y,T.heap[B],T.depth));)T.heap[K]=T.heap[B],K=B,B<<=1;T.heap[K]=Y}function ge(T,M,K){var Y,B,X,ne,Q=0;if(T.last_lit!==0)for(;Y=T.pending_buf[T.d_buf+2*Q]<<8|T.pending_buf[T.d_buf+2*Q+1],B=T.pending_buf[T.l_buf+Q],Q++,Y===0?V(T,B,M):(V(T,(X=w[B])+v+1,M),(ne=_[X])!==0&&F(T,B-=j[X],ne),V(T,X=I(--Y),K),(ne=N[X])!==0&&F(T,Y-=G[X],ne)),Q<T.last_lit;);V(T,k,M)}function de(T,M){var K,Y,B,X=M.dyn_tree,ne=M.stat_desc.static_tree,Q=M.stat_desc.has_stree,se=M.stat_desc.elems,ye=-1;for(T.heap_len=0,T.heap_max=g,K=0;K<se;K++)X[2*K]!==0?(T.heap[++T.heap_len]=ye=K,T.depth[K]=0):X[2*K+1]=0;for(;T.heap_len<2;)X[2*(B=T.heap[++T.heap_len]=ye<2?++ye:0)]=1,T.depth[B]=0,T.opt_len--,Q&&(T.static_len-=ne[2*B+1]);for(M.max_code=ye,K=T.heap_len>>1;1<=K;K--)fe(T,X,K);for(B=se;K=T.heap[1],T.heap[1]=T.heap[T.heap_len--],fe(T,X,1),Y=T.heap[1],T.heap[--T.heap_max]=K,T.heap[--T.heap_max]=Y,X[2*B]=X[2*K]+X[2*Y],T.depth[B]=(T.depth[K]>=T.depth[Y]?T.depth[K]:T.depth[Y])+1,X[2*K+1]=X[2*Y+1]=B,T.heap[1]=B++,fe(T,X,1),2<=T.heap_len;);T.heap[--T.heap_max]=T.heap[1],(function(me,Ke){var wr,lt,xr,Ie,_a,Co,bt=Ke.dyn_tree,sd=Ke.max_code,mh=Ke.stat_desc.static_tree,gh=Ke.stat_desc.has_stree,vh=Ke.stat_desc.extra_bits,od=Ke.stat_desc.extra_base,kr=Ke.stat_desc.max_length,Aa=0;for(Ie=0;Ie<=y;Ie++)me.bl_count[Ie]=0;for(bt[2*me.heap[me.heap_max]+1]=0,wr=me.heap_max+1;wr<g;wr++)kr<(Ie=bt[2*bt[2*(lt=me.heap[wr])+1]+1]+1)&&(Ie=kr,Aa++),bt[2*lt+1]=Ie,sd<lt||(me.bl_count[Ie]++,_a=0,od<=lt&&(_a=vh[lt-od]),Co=bt[2*lt],me.opt_len+=Co*(Ie+_a),gh&&(me.static_len+=Co*(mh[2*lt+1]+_a)));if(Aa!==0){do{for(Ie=kr-1;me.bl_count[Ie]===0;)Ie--;me.bl_count[Ie]--,me.bl_count[Ie+1]+=2,me.bl_count[kr]--,Aa-=2}while(0<Aa);for(Ie=kr;Ie!==0;Ie--)for(lt=me.bl_count[Ie];lt!==0;)sd<(xr=me.heap[--wr])||(bt[2*xr+1]!==Ie&&(me.opt_len+=(Ie-bt[2*xr+1])*bt[2*xr],bt[2*xr+1]=Ie),lt--)}})(T,M),ue(X,ye,T.bl_count)}function b(T,M,K){var Y,B,X=-1,ne=M[1],Q=0,se=7,ye=4;for(ne===0&&(se=138,ye=3),M[2*(K+1)+1]=65535,Y=0;Y<=K;Y++)B=ne,ne=M[2*(Y+1)+1],++Q<se&&B===ne||(Q<ye?T.bl_tree[2*B]+=Q:B!==0?(B!==X&&T.bl_tree[2*B]++,T.bl_tree[2*E]++):Q<=10?T.bl_tree[2*D]++:T.bl_tree[2*R]++,X=B,ye=(Q=0)===ne?(se=138,3):B===ne?(se=6,3):(se=7,4))}function U(T,M,K){var Y,B,X=-1,ne=M[1],Q=0,se=7,ye=4;for(ne===0&&(se=138,ye=3),Y=0;Y<=K;Y++)if(B=ne,ne=M[2*(Y+1)+1],!(++Q<se&&B===ne)){if(Q<ye)for(;V(T,B,T.bl_tree),--Q!=0;);else B!==0?(B!==X&&(V(T,B,T.bl_tree),Q--),V(T,E,T.bl_tree),F(T,Q-3,2)):Q<=10?(V(T,D,T.bl_tree),F(T,Q-3,3)):(V(T,R,T.bl_tree),F(T,Q-11,7));X=B,ye=(Q=0)===ne?(se=138,3):B===ne?(se=6,3):(se=7,4)}}d(G);var H=!1;function $(T,M,K,Y){F(T,(c<<1)+(Y?1:0),3),(function(B,X,ne,Q){ae(B),q(B,ne),q(B,~ne),o.arraySet(B.pending_buf,B.window,X,ne,B.pending),B.pending+=ne})(T,M,K)}s._tr_init=function(T){H||((function(){var M,K,Y,B,X,ne=new Array(y+1);for(B=Y=0;B<h-1;B++)for(j[B]=Y,M=0;M<1<<_[B];M++)w[Y++]=B;for(w[Y-1]=B,B=X=0;B<16;B++)for(G[B]=X,M=0;M<1<<N[B];M++)O[X++]=B;for(X>>=7;B<p;B++)for(G[B]=X<<7,M=0;M<1<<N[B]-7;M++)O[256+X++]=B;for(K=0;K<=y;K++)ne[K]=0;for(M=0;M<=143;)z[2*M+1]=8,M++,ne[8]++;for(;M<=255;)z[2*M+1]=9,M++,ne[9]++;for(;M<=279;)z[2*M+1]=7,M++,ne[7]++;for(;M<=287;)z[2*M+1]=8,M++,ne[8]++;for(ue(z,f+1,ne),M=0;M<p;M++)S[2*M+1]=5,S[2*M]=te(M,5);ee=new J(z,_,v+1,f,y),C=new J(S,N,0,p,y),Z=new J(new Array(0),L,0,m,x)})(),H=!0),T.l_desc=new P(T.dyn_ltree,ee),T.d_desc=new P(T.dyn_dtree,C),T.bl_desc=new P(T.bl_tree,Z),T.bi_buf=0,T.bi_valid=0,re(T)},s._tr_stored_block=$,s._tr_flush_block=function(T,M,K,Y){var B,X,ne=0;0<T.level?(T.strm.data_type===2&&(T.strm.data_type=(function(Q){var se,ye=4093624447;for(se=0;se<=31;se++,ye>>>=1)if(1&ye&&Q.dyn_ltree[2*se]!==0)return i;if(Q.dyn_ltree[18]!==0||Q.dyn_ltree[20]!==0||Q.dyn_ltree[26]!==0)return l;for(se=32;se<v;se++)if(Q.dyn_ltree[2*se]!==0)return l;return i})(T)),de(T,T.l_desc),de(T,T.d_desc),ne=(function(Q){var se;for(b(Q,Q.dyn_ltree,Q.l_desc.max_code),b(Q,Q.dyn_dtree,Q.d_desc.max_code),de(Q,Q.bl_desc),se=m-1;3<=se&&Q.bl_tree[2*W[se]+1]===0;se--);return Q.opt_len+=3*(se+1)+5+5+4,se})(T),B=T.opt_len+3+7>>>3,(X=T.static_len+3+7>>>3)<=B&&(B=X)):B=X=K+5,K+4<=B&&M!==-1?$(T,M,K,Y):T.strategy===4||X===B?(F(T,2+(Y?1:0),3),ge(T,z,S)):(F(T,4+(Y?1:0),3),(function(Q,se,ye,me){var Ke;for(F(Q,se-257,5),F(Q,ye-1,5),F(Q,me-4,4),Ke=0;Ke<me;Ke++)F(Q,Q.bl_tree[2*W[Ke]+1],3);U(Q,Q.dyn_ltree,se-1),U(Q,Q.dyn_dtree,ye-1)})(T,T.l_desc.max_code+1,T.d_desc.max_code+1,ne+1),ge(T,T.dyn_ltree,T.dyn_dtree)),re(T),Y&&ae(T)},s._tr_tally=function(T,M,K){return T.pending_buf[T.d_buf+2*T.last_lit]=M>>>8&255,T.pending_buf[T.d_buf+2*T.last_lit+1]=255&M,T.pending_buf[T.l_buf+T.last_lit]=255&K,T.last_lit++,M===0?T.dyn_ltree[2*K]++:(T.matches++,M--,T.dyn_ltree[2*(w[K]+v+1)]++,T.dyn_dtree[2*I(M)]++),T.last_lit===T.lit_bufsize-1},s._tr_align=function(T){F(T,2,3),V(T,k,z),(function(M){M.bi_valid===16?(q(M,M.bi_buf),M.bi_buf=0,M.bi_valid=0):8<=M.bi_valid&&(M.pending_buf[M.pending++]=255&M.bi_buf,M.bi_buf>>=8,M.bi_valid-=8)})(T)}},{"../utils/common":41}],53:[function(n,a,s){a.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],54:[function(n,a,s){(function(o){(function(i,l){if(!i.setImmediate){var d,c,h,v,f=1,p={},m=!1,g=i.document,y=Object.getPrototypeOf&&Object.getPrototypeOf(i);y=y&&y.setTimeout?y:i,d={}.toString.call(i.process)==="[object process]"?function(E){process.nextTick(function(){x(E)})}:(function(){if(i.postMessage&&!i.importScripts){var E=!0,D=i.onmessage;return i.onmessage=function(){E=!1},i.postMessage("","*"),i.onmessage=D,E}})()?(v="setImmediate$"+Math.random()+"$",i.addEventListener?i.addEventListener("message",k,!1):i.attachEvent("onmessage",k),function(E){i.postMessage(v+E,"*")}):i.MessageChannel?((h=new MessageChannel).port1.onmessage=function(E){x(E.data)},function(E){h.port2.postMessage(E)}):g&&"onreadystatechange"in g.createElement("script")?(c=g.documentElement,function(E){var D=g.createElement("script");D.onreadystatechange=function(){x(E),D.onreadystatechange=null,c.removeChild(D),D=null},c.appendChild(D)}):function(E){setTimeout(x,0,E)},y.setImmediate=function(E){typeof E!="function"&&(E=new Function(""+E));for(var D=new Array(arguments.length-1),R=0;R<D.length;R++)D[R]=arguments[R+1];var _={callback:E,args:D};return p[f]=_,d(f),f++},y.clearImmediate=u}function u(E){delete p[E]}function x(E){if(m)setTimeout(x,0,E);else{var D=p[E];if(D){m=!0;try{(function(R){var _=R.callback,N=R.args;switch(N.length){case 0:_();break;case 1:_(N[0]);break;case 2:_(N[0],N[1]);break;case 3:_(N[0],N[1],N[2]);break;default:_.apply(l,N)}})(D)}finally{u(E),m=!1}}}}function k(E){E.source===i&&typeof E.data=="string"&&E.data.indexOf(v)===0&&x(+E.data.slice(v.length))}})(typeof self>"u"?o===void 0?this:o:self)}).call(this,typeof Pa<"u"?Pa:typeof self<"u"?self:typeof window<"u"?window:{})},{}]},{},[10])(10)})})(Ao)),Ao.exports}var Am=_m();const Mm=Dm(Am);function An(){return(!r.deletedEntityTombstones||typeof r.deletedEntityTombstones!="object")&&(r.deletedEntityTombstones={}),r.deletedEntityTombstones}function Mn(){localStorage.setItem(sr,JSON.stringify(r.deletedEntityTombstones||{}))}function qs(e,t){if(!t)return;const n=An();(!n[e]||typeof n[e]!="object")&&(n[e]={}),n[e][String(t)]=new Date().toISOString(),Mn()}function Ks(e,t){if(!t)return;const n=An();n[e]&&n[e][String(t)]!==void 0&&(delete n[e][String(t)],Mn())}function Ys(e,t=""){const n=["#4A90A4","#6B8E5A","#E5533D","#C4943D","#7C6B8E","#6366F1","#0EA5E9"],a=n[r.taskAreas.length%n.length],s=new Date().toISOString(),o={id:ia("cat"),name:e,color:a,emoji:t||"",icon:"📁",createdAt:s,updatedAt:s};return Ks("taskCategories",o.id),r.taskAreas.push(o),le(),o}function di(e,t){const n=r.taskAreas.findIndex(a=>a.id===e);n!==-1&&(r.taskAreas[n]={...r.taskAreas[n],...t,updatedAt:new Date().toISOString()},le())}function Pm(e){qs("taskCategories",e);const t=r.taskCategories.filter(n=>n.areaId===e).map(n=>n.id);t.forEach(n=>{const a=An();(!a.categories||typeof a.categories!="object")&&(a.categories={}),a.categories[String(n)]=new Date().toISOString()}),Mn(),r.taskCategories=r.taskCategories.filter(n=>n.areaId!==e),r.taskAreas=r.taskAreas.filter(n=>n.id!==e),r.tasksData.forEach(n=>{n.areaId===e&&(n.areaId=null),t.includes(n.categoryId)&&(n.categoryId=null)}),le()}function et(e){return r.taskAreas.find(t=>t.id===e)}function Kc(e,t,n=""){const a=et(t),s={id:ia("subcat"),name:e,areaId:t,color:a?a.color:"#6366F1",emoji:n||"",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};return Ks("categories",s.id),r.taskCategories.push(s),le(),s}function ci(e,t){const n=r.taskCategories.findIndex(a=>a.id===e);n!==-1&&(r.taskCategories[n]={...r.taskCategories[n],...t,updatedAt:new Date().toISOString()},le())}function Nm(e){qs("categories",e),r.taskCategories=r.taskCategories.filter(t=>t.id!==e),r.tasksData.forEach(t=>{t.categoryId===e&&(t.categoryId=null)}),le()}function rt(e){return r.taskCategories.find(t=>t.id===e)}function Jr(e){return r.taskCategories.filter(t=>t.areaId===e)}function ca(e,t){const n=new Date().toISOString(),a={id:ia("label"),name:e,color:t||"#6B7280",createdAt:n,updatedAt:n};return Ks("taskLabels",a.id),r.taskLabels.push(a),le(),a}function Yc(e,t){const n=r.taskLabels.findIndex(a=>a.id===e);n!==-1&&(r.taskLabels[n]={...r.taskLabels[n],...t,updatedAt:new Date().toISOString()},le())}function Lm(e){qs("taskLabels",e),r.taskLabels=r.taskLabels.filter(t=>t.id!==e),r.tasksData.forEach(t=>{t.labels&&(t.labels=t.labels.filter(n=>n!==e))}),le()}function ua(e){return r.taskLabels.find(t=>t.id===e)}function fa(e,t="",n=""){const a=new Date().toISOString(),s={id:ia("person"),name:e,email:String(t||"").trim(),jobTitle:String(n||"").trim(),photoUrl:"",photoData:"",createdAt:a,updatedAt:a};return Ks("taskPeople",s.id),r.taskPeople.push(s),le(),s}function Jc(e,t){const n=r.taskPeople.findIndex(a=>a.id===e);n!==-1&&(r.taskPeople[n]={...r.taskPeople[n],...t,updatedAt:new Date().toISOString()},le())}function Om(e){qs("taskPeople",e),r.taskPeople=r.taskPeople.filter(t=>t.id!==e),r.tasksData.forEach(t=>{t.people&&(t.people=t.people.filter(n=>n!==e))}),le()}function pa(e){return r.taskPeople.find(t=>t.id===e)}function il(e){return r.tasksData.filter(t=>!(!t.people||!t.people.includes(e)||t.completed))}function ui(e){return e&&e.replace(/[<>:"/\\|?*\x00-\x1F]/g,"").replace(/\s+/g," ").trim().slice(0,100)||"Untitled"}function Rm(e){if(!e)return"";if(e<60)return`${e}m`;const t=Math.floor(e/60),n=e%60;return n?`${t}h${n}m`:`${t}h`}function Bm(e){let n=`- ${e.completed?"[x]":"[ ]"} ${e.title||"Untitled"}`;const a=[];if(e.dueDate&&a.push(`@due(${e.dueDate})`),e.deferDate&&a.push(`@defer(${e.deferDate})`),e.labels&&e.labels.length)for(const s of e.labels){const o=ua(s);o&&a.push(`#${o.name}`)}if(e.people&&e.people.length)for(const s of e.people){const o=pa(s);o&&a.push(`@${o.name}`)}if(e.flagged&&a.push("!flagged"),e.timeEstimate&&a.push(`⏱${Rm(e.timeEstimate)}`),e.completed&&e.completedAt){const s=e.completedAt.slice(0,10);a.push(`@completed(${s})`)}return a.length&&(n+=" "+a.join(" ")),n}function jm(){return r.tasksData.filter(e=>!e.isNote&&e.noteLifecycleState!=="deleted")}function Fm(){return r.tasksData.filter(e=>e.isNote&&e.noteLifecycleState!=="deleted")}function Hm(e){const t=new Map;for(const n of e){const a=n.areaId||"__inbox__";t.has(a)||t.set(a,[]),t.get(a).push(n)}return t}function zm(e){const t=new Map;for(const n of e){const a=n.categoryId||"__uncategorized__";t.has(a)||t.set(a,[]),t.get(a).push(n)}return t}function Wm(e,t){return t.filter(n=>n.parentId===e).sort((n,a)=>(n.order||0)-(a.order||0))}function Wa(e,t,n=0){const a="  ".repeat(n),s=[];if(s.push(a+Bm(e)),e.notes){const i=e.notes.split(`
`);for(const l of i)s.push(a+"  > "+l)}const o=Wm(e.id,t);for(const i of o)s.push(...Wa(i,t,n+1));return s}function fi(e,t){const n=[],a=e.filter(i=>!i.completed&&i.status!=="someday"&&!i.parentId),s=e.filter(i=>!i.completed&&i.status==="someday"&&!i.parentId),o=e.filter(i=>i.completed&&!i.parentId);if(a.length)for(const i of a)n.push(...Wa(i,t));if(s.length){n.push(""),n.push("#### Someday"),n.push("");for(const i of s)n.push(...Wa(i,t))}if(o.length){n.push(""),n.push("#### Completed"),n.push("");for(const i of o)n.push(...Wa(i,t))}return n}function Um(e){const t=["# Homebase Export","",`Exported on **${he()}** from Homebase v${Tt}.`,"","## Counts","",`- **Tasks:** ${e.taskCount}`,`- **Notes:** ${e.noteCount}`,`- **Areas:** ${e.areaCount}`,`- **Labels:** ${e.labelCount}`,`- **People:** ${e.personCount}`,"","## Structure","","- `Inbox.md` — Tasks with no area assigned"];for(const n of e.areaNames)t.push(`- \`${ui(n)}.md\` — ${n}`);return e.noteCount>0&&t.push("- `Notes/` — Note pages from the outliner"),t.push(""),t.join(`
`)}function Gm(e,t,n){const a=[],s=e.emoji?e.emoji+" ":"";a.push(`# ${s}${e.name}`),a.push("");const o=zm(t),i=o.get("__uncategorized__");i&&(a.push(...fi(i,n)),a.push(""));for(const[l,d]of o){if(l==="__uncategorized__")continue;const c=rt(l),h=c?.emoji?c.emoji+" ":"",v=c?c.name:"Unknown Category";a.push(`## ${h}${v}`),a.push(""),a.push(...fi(d,n)),a.push("")}return a.join(`
`)}function Vm(e,t){const n=[];return n.push("# Inbox"),n.push(""),n.push(...fi(e,t)),n.push(""),n.join(`
`)}function Xc(e,t){return t.filter(n=>n.parentId===e).sort((n,a)=>(n.noteOrder||n.order||0)-(a.noteOrder||a.order||0))}function Qc(e,t,n=0){const a="  ".repeat(n),s=e.completed?"- [x]":"-",o=e.title||"",i=[];if(i.push(`${a}${s} ${o}`),e.notes)for(const d of e.notes.split(`
`))i.push(`${a}  ${d}`);const l=Xc(e.id,t);for(const d of l)i.push(...Qc(d,t,n+1));return i}function qm(e,t){const n=e.title||"Untitled Note",a=[];a.push(`# ${n}`),a.push(""),e.notes&&(a.push(e.notes),a.push(""));const s=Xc(e.id,t);for(const o of s)a.push(...Qc(o,t,0));return a.push(""),a.join(`
`)}async function Km(){const e=new Mm,t=jm(),n=Fm(),a=Hm(t),s=[];for(const[f,p]of a){if(f==="__inbox__")continue;const m=et(f);if(!m)continue;s.push(m.name);const g=Gm(m,p,t);e.file(ui(m.name)+".md",g)}const o=a.get("__inbox__")||[];o.length&&e.file("Inbox.md",Vm(o,t));const i=n.filter(f=>!f.parentId);i.sort((f,p)=>(f.noteOrder||f.order||0)-(p.noteOrder||p.order||0));const l=e.folder("Notes");for(const f of i){const p=ui(f.title||"Untitled Note");l.file(p+".md",qm(f,n))}const d={taskCount:t.length,noteCount:n.length,areaCount:r.taskAreas.length,labelCount:r.taskLabels.length,personCount:r.taskPeople.length,areaNames:s};e.file("README.md",Um(d));const c=await e.generateAsync({type:"blob"}),h=URL.createObjectURL(c),v=document.createElement("a");v.href=h,v.download=`homebase-export-${he()}.zip`,v.click(),URL.revokeObjectURL(h)}const Ym=()=>{};var vd={};const Zc=function(e){const t=[];let n=0;for(let a=0;a<e.length;a++){let s=e.charCodeAt(a);s<128?t[n++]=s:s<2048?(t[n++]=s>>6|192,t[n++]=s&63|128):(s&64512)===55296&&a+1<e.length&&(e.charCodeAt(a+1)&64512)===56320?(s=65536+((s&1023)<<10)+(e.charCodeAt(++a)&1023),t[n++]=s>>18|240,t[n++]=s>>12&63|128,t[n++]=s>>6&63|128,t[n++]=s&63|128):(t[n++]=s>>12|224,t[n++]=s>>6&63|128,t[n++]=s&63|128)}return t},Jm=function(e){const t=[];let n=0,a=0;for(;n<e.length;){const s=e[n++];if(s<128)t[a++]=String.fromCharCode(s);else if(s>191&&s<224){const o=e[n++];t[a++]=String.fromCharCode((s&31)<<6|o&63)}else if(s>239&&s<365){const o=e[n++],i=e[n++],l=e[n++],d=((s&7)<<18|(o&63)<<12|(i&63)<<6|l&63)-65536;t[a++]=String.fromCharCode(55296+(d>>10)),t[a++]=String.fromCharCode(56320+(d&1023))}else{const o=e[n++],i=e[n++];t[a++]=String.fromCharCode((s&15)<<12|(o&63)<<6|i&63)}}return t.join("")},eu={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,a=[];for(let s=0;s<e.length;s+=3){const o=e[s],i=s+1<e.length,l=i?e[s+1]:0,d=s+2<e.length,c=d?e[s+2]:0,h=o>>2,v=(o&3)<<4|l>>4;let f=(l&15)<<2|c>>6,p=c&63;d||(p=64,i||(f=64)),a.push(n[h],n[v],n[f],n[p])}return a.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(Zc(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):Jm(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,a=[];for(let s=0;s<e.length;){const o=n[e.charAt(s++)],l=s<e.length?n[e.charAt(s)]:0;++s;const c=s<e.length?n[e.charAt(s)]:64;++s;const v=s<e.length?n[e.charAt(s)]:64;if(++s,o==null||l==null||c==null||v==null)throw new Xm;const f=o<<2|l>>4;if(a.push(f),c!==64){const p=l<<4&240|c>>2;if(a.push(p),v!==64){const m=c<<6&192|v;a.push(m)}}}return a},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class Xm extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Qm=function(e){const t=Zc(e);return eu.encodeByteArray(t,!0)},tu=function(e){return Qm(e).replace(/\./g,"")},nu=function(e){try{return eu.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};function Zm(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}const eg=()=>Zm().__FIREBASE_DEFAULTS__,tg=()=>{if(typeof process>"u"||typeof vd>"u")return;const e=vd.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},ng=()=>{if(typeof document>"u")return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=e&&nu(e[1]);return t&&JSON.parse(t)},ll=()=>{try{return Ym()||eg()||tg()||ng()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},rg=e=>ll()?.emulatorHosts?.[e],ru=()=>ll()?.config,au=e=>ll()?.[`_${e}`];class ag{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,n)=>{this.resolve=t,this.reject=n})}wrapCallback(t){return(n,a)=>{n?this.reject(n):this.resolve(a),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(n):t(n,a))}}}function Js(e){try{return(e.startsWith("http://")||e.startsWith("https://")?new URL(e).hostname:e).endsWith(".cloudworkstations.dev")}catch{return!1}}async function sg(e){return(await fetch(e,{credentials:"include"})).ok}const Lr={};function og(){const e={prod:[],emulator:[]};for(const t of Object.keys(Lr))Lr[t]?e.emulator.push(t):e.prod.push(t);return e}function ig(e){let t=document.getElementById(e),n=!1;return t||(t=document.createElement("div"),t.setAttribute("id",e),n=!0),{created:n,element:t}}let bd=!1;function lg(e,t){if(typeof window>"u"||typeof document>"u"||!Js(window.location.host)||Lr[e]===t||Lr[e]||bd)return;Lr[e]=t;function n(f){return`__firebase__banner__${f}`}const a="__firebase__banner",o=og().prod.length>0;function i(){const f=document.getElementById(a);f&&f.remove()}function l(f){f.style.display="flex",f.style.background="#7faaf0",f.style.position="fixed",f.style.bottom="5px",f.style.left="5px",f.style.padding=".5em",f.style.borderRadius="5px",f.style.alignItems="center"}function d(f,p){f.setAttribute("width","24"),f.setAttribute("id",p),f.setAttribute("height","24"),f.setAttribute("viewBox","0 0 24 24"),f.setAttribute("fill","none"),f.style.marginLeft="-6px"}function c(){const f=document.createElement("span");return f.style.cursor="pointer",f.style.marginLeft="16px",f.style.fontSize="24px",f.innerHTML=" &times;",f.onclick=()=>{bd=!0,i()},f}function h(f,p){f.setAttribute("id",p),f.innerText="Learn more",f.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",f.setAttribute("target","__blank"),f.style.paddingLeft="5px",f.style.textDecoration="underline"}function v(){const f=ig(a),p=n("text"),m=document.getElementById(p)||document.createElement("span"),g=n("learnmore"),y=document.getElementById(g)||document.createElement("a"),u=n("preprendIcon"),x=document.getElementById(u)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(f.created){const k=f.element;l(k),h(y,g);const E=c();d(x,u),k.append(x,m,y,E),document.body.appendChild(k)}o?(m.innerText="Preview backend disconnected.",x.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
<path d="M4.8 17.6L12 5.6L19.2 17.6H4.8ZM6.91667 16.4H17.0833L12 7.93333L6.91667 16.4ZM12 15.6C12.1667 15.6 12.3056 15.5444 12.4167 15.4333C12.5389 15.3111 12.6 15.1667 12.6 15C12.6 14.8333 12.5389 14.6944 12.4167 14.5833C12.3056 14.4611 12.1667 14.4 12 14.4C11.8333 14.4 11.6889 14.4611 11.5667 14.5833C11.4556 14.6944 11.4 14.8333 11.4 15C11.4 15.1667 11.4556 15.3111 11.5667 15.4333C11.6889 15.5444 11.8333 15.6 12 15.6ZM11.4 13.6H12.6V10.4H11.4V13.6Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6013_33858">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`):(x.innerHTML=`<g clip-path="url(#clip0_6083_34804)">
<path d="M11.4 15.2H12.6V11.2H11.4V15.2ZM12 10C12.1667 10 12.3056 9.94444 12.4167 9.83333C12.5389 9.71111 12.6 9.56667 12.6 9.4C12.6 9.23333 12.5389 9.09444 12.4167 8.98333C12.3056 8.86111 12.1667 8.8 12 8.8C11.8333 8.8 11.6889 8.86111 11.5667 8.98333C11.4556 9.09444 11.4 9.23333 11.4 9.4C11.4 9.56667 11.4556 9.71111 11.5667 9.83333C11.6889 9.94444 11.8333 10 12 10ZM12 18.4C11.1222 18.4 10.2944 18.2333 9.51667 17.9C8.73889 17.5667 8.05556 17.1111 7.46667 16.5333C6.88889 15.9444 6.43333 15.2611 6.1 14.4833C5.76667 13.7056 5.6 12.8778 5.6 12C5.6 11.1111 5.76667 10.2833 6.1 9.51667C6.43333 8.73889 6.88889 8.06111 7.46667 7.48333C8.05556 6.89444 8.73889 6.43333 9.51667 6.1C10.2944 5.76667 11.1222 5.6 12 5.6C12.8889 5.6 13.7167 5.76667 14.4833 6.1C15.2611 6.43333 15.9389 6.89444 16.5167 7.48333C17.1056 8.06111 17.5667 8.73889 17.9 9.51667C18.2333 10.2833 18.4 11.1111 18.4 12C18.4 12.8778 18.2333 13.7056 17.9 14.4833C17.5667 15.2611 17.1056 15.9444 16.5167 16.5333C15.9389 17.1111 15.2611 17.5667 14.4833 17.9C13.7167 18.2333 12.8889 18.4 12 18.4ZM12 17.2C13.4444 17.2 14.6722 16.6944 15.6833 15.6833C16.6944 14.6722 17.2 13.4444 17.2 12C17.2 10.5556 16.6944 9.32778 15.6833 8.31667C14.6722 7.30555 13.4444 6.8 12 6.8C10.5556 6.8 9.32778 7.30555 8.31667 8.31667C7.30556 9.32778 6.8 10.5556 6.8 12C6.8 13.4444 7.30556 14.6722 8.31667 15.6833C9.32778 16.6944 10.5556 17.2 12 17.2Z" fill="#212121"/>
</g>
<defs>
<clipPath id="clip0_6083_34804">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>`,m.innerText="Preview backend running in this workspace."),m.setAttribute("id",p)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",v):v()}function Re(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function dg(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Re())}function cg(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function ug(){const e=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof e=="object"&&e.id!==void 0}function fg(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function pg(){const e=Re();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0}function hg(){try{return typeof indexedDB=="object"}catch{return!1}}function mg(){return new Promise((e,t)=>{try{let n=!0;const a="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(a);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(a),e(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{t(s.error?.message||"")}}catch(n){t(n)}})}const gg="FirebaseError";class rn extends Error{constructor(t,n,a){super(n),this.code=t,this.customData=a,this.name=gg,Object.setPrototypeOf(this,rn.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ha.prototype.create)}}class ha{constructor(t,n,a){this.service=t,this.serviceName=n,this.errors=a}create(t,...n){const a=n[0]||{},s=`${this.service}/${t}`,o=this.errors[t],i=o?vg(o,a):"Error",l=`${this.serviceName}: ${i} (${s}).`;return new rn(s,l,a)}}function vg(e,t){return e.replace(bg,(n,a)=>{const s=t[a];return s!=null?String(s):`<${a}?>`})}const bg=/\{\$([^}]+)}/g;function yg(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}function Xn(e,t){if(e===t)return!0;const n=Object.keys(e),a=Object.keys(t);for(const s of n){if(!a.includes(s))return!1;const o=e[s],i=t[s];if(yd(o)&&yd(i)){if(!Xn(o,i))return!1}else if(o!==i)return!1}for(const s of a)if(!n.includes(s))return!1;return!0}function yd(e){return e!==null&&typeof e=="object"}function ma(e){const t=[];for(const[n,a]of Object.entries(e))Array.isArray(a)?a.forEach(s=>{t.push(encodeURIComponent(n)+"="+encodeURIComponent(s))}):t.push(encodeURIComponent(n)+"="+encodeURIComponent(a));return t.length?"&"+t.join("&"):""}function wg(e,t){const n=new xg(e,t);return n.subscribe.bind(n)}class xg{constructor(t,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{t(this)}).catch(a=>{this.error(a)})}next(t){this.forEachObserver(n=>{n.next(t)})}error(t){this.forEachObserver(n=>{n.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,n,a){let s;if(t===void 0&&n===void 0&&a===void 0)throw new Error("Missing Observer.");kg(t,["next","error","complete"])?s=t:s={next:t,error:n,complete:a},s.next===void 0&&(s.next=Mo),s.error===void 0&&(s.error=Mo),s.complete===void 0&&(s.complete=Mo);const o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),o}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,t)}sendOne(t,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{n(this.observers[t])}catch(a){typeof console<"u"&&console.error&&console.error(a)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function kg(e,t){if(typeof e!="object"||e===null)return!1;for(const n of t)if(n in e&&typeof e[n]=="function")return!0;return!1}function Mo(){}function an(e){return e&&e._delegate?e._delegate:e}class Qn{constructor(t,n,a){this.name=t,this.instanceFactory=n,this.type=a,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}const fn="[DEFAULT]";class Sg{constructor(t,n){this.name=t,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const n=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(n)){const a=new ag;if(this.instancesDeferred.set(n,a),this.isInitialized(n)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:n});s&&a.resolve(s)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(t){const n=this.normalizeInstanceIdentifier(t?.identifier),a=t?.optional??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(s){if(a)return null;throw s}else{if(a)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(Ig(t))try{this.getOrInitializeService({instanceIdentifier:fn})}catch{}for(const[n,a]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(n);try{const o=this.getOrInitializeService({instanceIdentifier:s});a.resolve(o)}catch{}}}}clearInstance(t=fn){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...t.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=fn){return this.instances.has(t)}getOptions(t=fn){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:n={}}=t,a=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(a))throw Error(`${this.name}(${a}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:a,options:n});for(const[o,i]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(o);a===l&&i.resolve(s)}return s}onInit(t,n){const a=this.normalizeInstanceIdentifier(n),s=this.onInitCallbacks.get(a)??new Set;s.add(t),this.onInitCallbacks.set(a,s);const o=this.instances.get(a);return o&&t(o,a),()=>{s.delete(t)}}invokeOnInitCallbacks(t,n){const a=this.onInitCallbacks.get(n);if(a)for(const s of a)try{s(t,n)}catch{}}getOrInitializeService({instanceIdentifier:t,options:n={}}){let a=this.instances.get(t);if(!a&&this.component&&(a=this.component.instanceFactory(this.container,{instanceIdentifier:Tg(t),options:n}),this.instances.set(t,a),this.instancesOptions.set(t,n),this.invokeOnInitCallbacks(a,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,a)}catch{}return a||null}normalizeInstanceIdentifier(t=fn){return this.component?this.component.multipleInstances?t:fn:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Tg(e){return e===fn?void 0:e}function Ig(e){return e.instantiationMode==="EAGER"}class Cg{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const n=this.getProvider(t.name);if(n.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);n.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const n=new Sg(t,this);return this.providers.set(t,n),n}getProviders(){return Array.from(this.providers.values())}}var be;(function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"})(be||(be={}));const Eg={debug:be.DEBUG,verbose:be.VERBOSE,info:be.INFO,warn:be.WARN,error:be.ERROR,silent:be.SILENT},$g=be.INFO,Dg={[be.DEBUG]:"log",[be.VERBOSE]:"log",[be.INFO]:"info",[be.WARN]:"warn",[be.ERROR]:"error"},_g=(e,t,...n)=>{if(t<e.logLevel)return;const a=new Date().toISOString(),s=Dg[t];if(s)console[s](`[${a}]  ${e.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class su{constructor(t){this.name=t,this._logLevel=$g,this._logHandler=_g,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in be))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?Eg[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,be.DEBUG,...t),this._logHandler(this,be.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,be.VERBOSE,...t),this._logHandler(this,be.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,be.INFO,...t),this._logHandler(this,be.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,be.WARN,...t),this._logHandler(this,be.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,be.ERROR,...t),this._logHandler(this,be.ERROR,...t)}}const Ag=(e,t)=>t.some(n=>e instanceof n);let wd,xd;function Mg(){return wd||(wd=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Pg(){return xd||(xd=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const ou=new WeakMap,pi=new WeakMap,iu=new WeakMap,Po=new WeakMap,dl=new WeakMap;function Ng(e){const t=new Promise((n,a)=>{const s=()=>{e.removeEventListener("success",o),e.removeEventListener("error",i)},o=()=>{n(Kt(e.result)),s()},i=()=>{a(e.error),s()};e.addEventListener("success",o),e.addEventListener("error",i)});return t.then(n=>{n instanceof IDBCursor&&ou.set(n,e)}).catch(()=>{}),dl.set(t,e),t}function Lg(e){if(pi.has(e))return;const t=new Promise((n,a)=>{const s=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",i),e.removeEventListener("abort",i)},o=()=>{n(),s()},i=()=>{a(e.error||new DOMException("AbortError","AbortError")),s()};e.addEventListener("complete",o),e.addEventListener("error",i),e.addEventListener("abort",i)});pi.set(e,t)}let hi={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return pi.get(e);if(t==="objectStoreNames")return e.objectStoreNames||iu.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Kt(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function Og(e){hi=e(hi)}function Rg(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){const a=e.call(No(this),t,...n);return iu.set(a,t.sort?t.sort():[t]),Kt(a)}:Pg().includes(e)?function(...t){return e.apply(No(this),t),Kt(ou.get(this))}:function(...t){return Kt(e.apply(No(this),t))}}function Bg(e){return typeof e=="function"?Rg(e):(e instanceof IDBTransaction&&Lg(e),Ag(e,Mg())?new Proxy(e,hi):e)}function Kt(e){if(e instanceof IDBRequest)return Ng(e);if(Po.has(e))return Po.get(e);const t=Bg(e);return t!==e&&(Po.set(e,t),dl.set(t,e)),t}const No=e=>dl.get(e);function jg(e,t,{blocked:n,upgrade:a,blocking:s,terminated:o}={}){const i=indexedDB.open(e,t),l=Kt(i);return a&&i.addEventListener("upgradeneeded",d=>{a(Kt(i.result),d.oldVersion,d.newVersion,Kt(i.transaction),d)}),n&&i.addEventListener("blocked",d=>n(d.oldVersion,d.newVersion,d)),l.then(d=>{o&&d.addEventListener("close",()=>o()),s&&d.addEventListener("versionchange",c=>s(c.oldVersion,c.newVersion,c))}).catch(()=>{}),l}const Fg=["get","getKey","getAll","getAllKeys","count"],Hg=["put","add","delete","clear"],Lo=new Map;function kd(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(Lo.get(t))return Lo.get(t);const n=t.replace(/FromIndex$/,""),a=t!==n,s=Hg.includes(n);if(!(n in(a?IDBIndex:IDBObjectStore).prototype)||!(s||Fg.includes(n)))return;const o=async function(i,...l){const d=this.transaction(i,s?"readwrite":"readonly");let c=d.store;return a&&(c=c.index(l.shift())),(await Promise.all([c[n](...l),s&&d.done]))[0]};return Lo.set(t,o),o}Og(e=>({...e,get:(t,n,a)=>kd(t,n)||e.get(t,n,a),has:(t,n)=>!!kd(t,n)||e.has(t,n)}));class zg{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Wg(n)){const a=n.getImmediate();return`${a.library}/${a.version}`}else return null}).filter(n=>n).join(" ")}}function Wg(e){return e.getComponent()?.type==="VERSION"}const mi="@firebase/app",Sd="0.14.8";const At=new su("@firebase/app"),Ug="@firebase/app-compat",Gg="@firebase/analytics-compat",Vg="@firebase/analytics",qg="@firebase/app-check-compat",Kg="@firebase/app-check",Yg="@firebase/auth",Jg="@firebase/auth-compat",Xg="@firebase/database",Qg="@firebase/data-connect",Zg="@firebase/database-compat",ev="@firebase/functions",tv="@firebase/functions-compat",nv="@firebase/installations",rv="@firebase/installations-compat",av="@firebase/messaging",sv="@firebase/messaging-compat",ov="@firebase/performance",iv="@firebase/performance-compat",lv="@firebase/remote-config",dv="@firebase/remote-config-compat",cv="@firebase/storage",uv="@firebase/storage-compat",fv="@firebase/firestore",pv="@firebase/ai",hv="@firebase/firestore-compat",mv="firebase",gv="12.9.0";const gi="[DEFAULT]",vv={[mi]:"fire-core",[Ug]:"fire-core-compat",[Vg]:"fire-analytics",[Gg]:"fire-analytics-compat",[Kg]:"fire-app-check",[qg]:"fire-app-check-compat",[Yg]:"fire-auth",[Jg]:"fire-auth-compat",[Xg]:"fire-rtdb",[Qg]:"fire-data-connect",[Zg]:"fire-rtdb-compat",[ev]:"fire-fn",[tv]:"fire-fn-compat",[nv]:"fire-iid",[rv]:"fire-iid-compat",[av]:"fire-fcm",[sv]:"fire-fcm-compat",[ov]:"fire-perf",[iv]:"fire-perf-compat",[lv]:"fire-rc",[dv]:"fire-rc-compat",[cv]:"fire-gcs",[uv]:"fire-gcs-compat",[fv]:"fire-fst",[hv]:"fire-fst-compat",[pv]:"fire-vertex","fire-js":"fire-js",[mv]:"fire-js-all"};const ps=new Map,bv=new Map,vi=new Map;function Td(e,t){try{e.container.addComponent(t)}catch(n){At.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function Xr(e){const t=e.name;if(vi.has(t))return At.debug(`There were multiple attempts to register component ${t}.`),!1;vi.set(t,e);for(const n of ps.values())Td(n,e);for(const n of bv.values())Td(n,e);return!0}function lu(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}function kt(e){return e==null?!1:e.settings!==void 0}const yv={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Yt=new ha("app","Firebase",yv);class wv{constructor(t,n,a){this._isDeleted=!1,this._options={...t},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=a,this.container.addComponent(new Qn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw Yt.create("app-deleted",{appName:this._name})}}const ga=gv;function du(e,t={}){let n=e;typeof t!="object"&&(t={name:t});const a={name:gi,automaticDataCollectionEnabled:!0,...t},s=a.name;if(typeof s!="string"||!s)throw Yt.create("bad-app-name",{appName:String(s)});if(n||(n=ru()),!n)throw Yt.create("no-options");const o=ps.get(s);if(o){if(Xn(n,o.options)&&Xn(a,o.config))return o;throw Yt.create("duplicate-app",{appName:s})}const i=new Cg(s);for(const d of vi.values())i.addComponent(d);const l=new wv(n,a,i);return ps.set(s,l),l}function xv(e=gi){const t=ps.get(e);if(!t&&e===gi&&ru())return du();if(!t)throw Yt.create("no-app",{appName:e});return t}function Hn(e,t,n){let a=vv[e]??e;n&&(a+=`-${n}`);const s=a.match(/\s|\//),o=t.match(/\s|\//);if(s||o){const i=[`Unable to register library "${a}" with version "${t}":`];s&&i.push(`library name "${a}" contains illegal characters (whitespace or "/")`),s&&o&&i.push("and"),o&&i.push(`version name "${t}" contains illegal characters (whitespace or "/")`),At.warn(i.join(" "));return}Xr(new Qn(`${a}-version`,()=>({library:a,version:t}),"VERSION"))}const kv="firebase-heartbeat-database",Sv=1,Qr="firebase-heartbeat-store";let Oo=null;function cu(){return Oo||(Oo=jg(kv,Sv,{upgrade:(e,t)=>{switch(t){case 0:try{e.createObjectStore(Qr)}catch(n){console.warn(n)}}}}).catch(e=>{throw Yt.create("idb-open",{originalErrorMessage:e.message})})),Oo}async function Tv(e){try{const n=(await cu()).transaction(Qr),a=await n.objectStore(Qr).get(uu(e));return await n.done,a}catch(t){if(t instanceof rn)At.warn(t.message);else{const n=Yt.create("idb-get",{originalErrorMessage:t?.message});At.warn(n.message)}}}async function Id(e,t){try{const a=(await cu()).transaction(Qr,"readwrite");await a.objectStore(Qr).put(t,uu(e)),await a.done}catch(n){if(n instanceof rn)At.warn(n.message);else{const a=Yt.create("idb-set",{originalErrorMessage:n?.message});At.warn(a.message)}}}function uu(e){return`${e.name}!${e.options.appId}`}const Iv=1024,Cv=30;class Ev{constructor(t){this.container=t,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Dv(n),this._heartbeatsCachePromise=this._storage.read().then(a=>(this._heartbeatsCache=a,a))}async triggerHeartbeat(){try{const n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),a=Cd();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===a||this._heartbeatsCache.heartbeats.some(s=>s.date===a))return;if(this._heartbeatsCache.heartbeats.push({date:a,agent:n}),this._heartbeatsCache.heartbeats.length>Cv){const s=_v(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(s,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(t){At.warn(t)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Cd(),{heartbeatsToSend:n,unsentEntries:a}=$v(this._heartbeatsCache.heartbeats),s=tu(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,a.length>0?(this._heartbeatsCache.heartbeats=a,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return At.warn(t),""}}}function Cd(){return new Date().toISOString().substring(0,10)}function $v(e,t=Iv){const n=[];let a=e.slice();for(const s of e){const o=n.find(i=>i.agent===s.agent);if(o){if(o.dates.push(s.date),Ed(n)>t){o.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),Ed(n)>t){n.pop();break}a=a.slice(1)}return{heartbeatsToSend:n,unsentEntries:a}}class Dv{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return hg()?mg().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Tv(this.app);return n?.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){if(await this._canUseIndexedDBPromise){const a=await this.read();return Id(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??a.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){if(await this._canUseIndexedDBPromise){const a=await this.read();return Id(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??a.lastSentHeartbeatDate,heartbeats:[...a.heartbeats,...t.heartbeats]})}else return}}function Ed(e){return tu(JSON.stringify({version:2,heartbeats:e})).length}function _v(e){if(e.length===0)return-1;let t=0,n=e[0].date;for(let a=1;a<e.length;a++)e[a].date<n&&(n=e[a].date,t=a);return t}function Av(e){Xr(new Qn("platform-logger",t=>new zg(t),"PRIVATE")),Xr(new Qn("heartbeat",t=>new Ev(t),"PRIVATE")),Hn(mi,Sd,e),Hn(mi,Sd,"esm2020"),Hn("fire-js","")}Av("");var Mv="firebase",Pv="12.9.0";Hn(Mv,Pv,"app");function fu(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Nv=fu,pu=new ha("auth","Firebase",fu());const hs=new su("@firebase/auth");function Lv(e,...t){hs.logLevel<=be.WARN&&hs.warn(`Auth (${ga}): ${e}`,...t)}function Ua(e,...t){hs.logLevel<=be.ERROR&&hs.error(`Auth (${ga}): ${e}`,...t)}function Mt(e,...t){throw cl(e,...t)}function ht(e,...t){return cl(e,...t)}function hu(e,t,n){const a={...Nv(),[t]:n};return new ha("auth","Firebase",a).create(t,{appName:e.name})}function gn(e){return hu(e,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function cl(e,...t){if(typeof e!="string"){const n=t[0],a=[...t.slice(1)];return a[0]&&(a[0].appName=e.name),e._errorFactory.create(n,...a)}return pu.create(e,...t)}function ie(e,t,...n){if(!e)throw cl(t,...n)}function It(e){const t="INTERNAL ASSERTION FAILED: "+e;throw Ua(t),new Error(t)}function Pt(e,t){e||It(t)}function bi(){return typeof self<"u"&&self.location?.href||""}function Ov(){return $d()==="http:"||$d()==="https:"}function $d(){return typeof self<"u"&&self.location?.protocol||null}function Rv(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Ov()||ug()||"connection"in navigator)?navigator.onLine:!0}function Bv(){if(typeof navigator>"u")return null;const e=navigator;return e.languages&&e.languages[0]||e.language||null}class va{constructor(t,n){this.shortDelay=t,this.longDelay=n,Pt(n>t,"Short delay should be less than long delay!"),this.isMobile=dg()||fg()}get(){return Rv()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}function ul(e,t){Pt(e.emulator,"Emulator should always be set here");const{url:n}=e.emulator;return t?`${n}${t.startsWith("/")?t.slice(1):t}`:n}class mu{static initialize(t,n,a){this.fetchImpl=t,n&&(this.headersImpl=n),a&&(this.responseImpl=a)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;It("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;It("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;It("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}const jv={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};const Fv=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Hv=new va(3e4,6e4);function fl(e,t){return e.tenantId&&!t.tenantId?{...t,tenantId:e.tenantId}:t}async function ur(e,t,n,a,s={}){return gu(e,s,async()=>{let o={},i={};a&&(t==="GET"?i=a:o={body:JSON.stringify(a)});const l=ma({key:e.config.apiKey,...i}).slice(1),d=await e._getAdditionalHeaders();d["Content-Type"]="application/json",e.languageCode&&(d["X-Firebase-Locale"]=e.languageCode);const c={method:t,headers:d,...o};return cg()||(c.referrerPolicy="no-referrer"),e.emulatorConfig&&Js(e.emulatorConfig.host)&&(c.credentials="include"),mu.fetch()(await vu(e,e.config.apiHost,n,l),c)})}async function gu(e,t,n){e._canInitEmulator=!1;const a={...jv,...t};try{const s=new Wv(e),o=await Promise.race([n(),s.promise]);s.clearNetworkTimeout();const i=await o.json();if("needConfirmation"in i)throw La(e,"account-exists-with-different-credential",i);if(o.ok&&!("errorMessage"in i))return i;{const l=o.ok?i.errorMessage:i.error.message,[d,c]=l.split(" : ");if(d==="FEDERATED_USER_ID_ALREADY_LINKED")throw La(e,"credential-already-in-use",i);if(d==="EMAIL_EXISTS")throw La(e,"email-already-in-use",i);if(d==="USER_DISABLED")throw La(e,"user-disabled",i);const h=a[d]||d.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw hu(e,h,c);Mt(e,h)}}catch(s){if(s instanceof rn)throw s;Mt(e,"network-request-failed",{message:String(s)})}}async function zv(e,t,n,a,s={}){const o=await ur(e,t,n,a,s);return"mfaPendingCredential"in o&&Mt(e,"multi-factor-auth-required",{_serverResponse:o}),o}async function vu(e,t,n,a){const s=`${t}${n}?${a}`,o=e,i=o.config.emulator?ul(e.config,s):`${e.config.apiScheme}://${s}`;return Fv.includes(n)&&(await o._persistenceManagerAvailable,o._getPersistenceType()==="COOKIE")?o._getPersistence()._getFinalTarget(i).toString():i}class Wv{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(t){this.auth=t,this.timer=null,this.promise=new Promise((n,a)=>{this.timer=setTimeout(()=>a(ht(this.auth,"network-request-failed")),Hv.get())})}}function La(e,t,n){const a={appName:e.name};n.email&&(a.email=n.email),n.phoneNumber&&(a.phoneNumber=n.phoneNumber);const s=ht(e,t,a);return s.customData._tokenResponse=n,s}async function Uv(e,t){return ur(e,"POST","/v1/accounts:delete",t)}async function ms(e,t){return ur(e,"POST","/v1/accounts:lookup",t)}function Or(e){if(e)try{const t=new Date(Number(e));if(!isNaN(t.getTime()))return t.toUTCString()}catch{}}async function Gv(e,t=!1){const n=an(e),a=await n.getIdToken(t),s=pl(a);ie(s&&s.exp&&s.auth_time&&s.iat,n.auth,"internal-error");const o=typeof s.firebase=="object"?s.firebase:void 0,i=o?.sign_in_provider;return{claims:s,token:a,authTime:Or(Ro(s.auth_time)),issuedAtTime:Or(Ro(s.iat)),expirationTime:Or(Ro(s.exp)),signInProvider:i||null,signInSecondFactor:o?.sign_in_second_factor||null}}function Ro(e){return Number(e)*1e3}function pl(e){const[t,n,a]=e.split(".");if(t===void 0||n===void 0||a===void 0)return Ua("JWT malformed, contained fewer than 3 sections"),null;try{const s=nu(n);return s?JSON.parse(s):(Ua("Failed to decode base64 JWT payload"),null)}catch(s){return Ua("Caught error parsing JWT payload as JSON",s?.toString()),null}}function Dd(e){const t=pl(e);return ie(t,"internal-error"),ie(typeof t.exp<"u","internal-error"),ie(typeof t.iat<"u","internal-error"),Number(t.exp)-Number(t.iat)}async function Zr(e,t,n=!1){if(n)return t;try{return await t}catch(a){throw a instanceof rn&&Vv(a)&&e.auth.currentUser===e&&await e.auth.signOut(),a}}function Vv({code:e}){return e==="auth/user-disabled"||e==="auth/user-token-expired"}class qv{constructor(t){this.user=t,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(t){if(t){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const a=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,a)}}schedule(t=!1){if(!this.isRunning)return;const n=this.getInterval(t);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(t){t?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}class yi{constructor(t,n){this.createdAt=t,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Or(this.lastLoginAt),this.creationTime=Or(this.createdAt)}_copy(t){this.createdAt=t.createdAt,this.lastLoginAt=t.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}async function gs(e){const t=e.auth,n=await e.getIdToken(),a=await Zr(e,ms(t,{idToken:n}));ie(a?.users.length,t,"internal-error");const s=a.users[0];e._notifyReloadListener(s);const o=s.providerUserInfo?.length?bu(s.providerUserInfo):[],i=Yv(e.providerData,o),l=e.isAnonymous,d=!(e.email&&s.passwordHash)&&!i?.length,c=l?d:!1,h={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new yi(s.createdAt,s.lastLoginAt),isAnonymous:c};Object.assign(e,h)}async function Kv(e){const t=an(e);await gs(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function Yv(e,t){return[...e.filter(a=>!t.some(s=>s.providerId===a.providerId)),...t]}function bu(e){return e.map(({providerId:t,...n})=>({providerId:t,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}async function Jv(e,t){const n=await gu(e,{},async()=>{const a=ma({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:s,apiKey:o}=e.config,i=await vu(e,s,"/v1/token",`key=${o}`),l=await e._getAdditionalHeaders();l["Content-Type"]="application/x-www-form-urlencoded";const d={method:"POST",headers:l,body:a};return e.emulatorConfig&&Js(e.emulatorConfig.host)&&(d.credentials="include"),mu.fetch()(i,d)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function Xv(e,t){return ur(e,"POST","/v2/accounts:revokeToken",fl(e,t))}class zn{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(t){ie(t.idToken,"internal-error"),ie(typeof t.idToken<"u","internal-error"),ie(typeof t.refreshToken<"u","internal-error");const n="expiresIn"in t&&typeof t.expiresIn<"u"?Number(t.expiresIn):Dd(t.idToken);this.updateTokensAndExpiration(t.idToken,t.refreshToken,n)}updateFromIdToken(t){ie(t.length!==0,"internal-error");const n=Dd(t);this.updateTokensAndExpiration(t,null,n)}async getToken(t,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(ie(this.refreshToken,t,"user-token-expired"),this.refreshToken?(await this.refresh(t,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(t,n){const{accessToken:a,refreshToken:s,expiresIn:o}=await Jv(t,n);this.updateTokensAndExpiration(a,s,Number(o))}updateTokensAndExpiration(t,n,a){this.refreshToken=n||null,this.accessToken=t||null,this.expirationTime=Date.now()+a*1e3}static fromJSON(t,n){const{refreshToken:a,accessToken:s,expirationTime:o}=n,i=new zn;return a&&(ie(typeof a=="string","internal-error",{appName:t}),i.refreshToken=a),s&&(ie(typeof s=="string","internal-error",{appName:t}),i.accessToken=s),o&&(ie(typeof o=="number","internal-error",{appName:t}),i.expirationTime=o),i}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(t){this.accessToken=t.accessToken,this.refreshToken=t.refreshToken,this.expirationTime=t.expirationTime}_clone(){return Object.assign(new zn,this.toJSON())}_performRefresh(){return It("not implemented")}}function jt(e,t){ie(typeof e=="string"||typeof e>"u","internal-error",{appName:t})}class Ze{constructor({uid:t,auth:n,stsTokenManager:a,...s}){this.providerId="firebase",this.proactiveRefresh=new qv(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=n,this.stsTokenManager=a,this.accessToken=a.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new yi(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(t){const n=await Zr(this,this.stsTokenManager.getToken(this.auth,t));return ie(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(t){return Gv(this,t)}reload(){return Kv(this)}_assign(t){this!==t&&(ie(this.uid===t.uid,this.auth,"internal-error"),this.displayName=t.displayName,this.photoURL=t.photoURL,this.email=t.email,this.emailVerified=t.emailVerified,this.phoneNumber=t.phoneNumber,this.isAnonymous=t.isAnonymous,this.tenantId=t.tenantId,this.providerData=t.providerData.map(n=>({...n})),this.metadata._copy(t.metadata),this.stsTokenManager._assign(t.stsTokenManager))}_clone(t){const n=new Ze({...this,auth:t,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(t){ie(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=t,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(t){this.reloadListener?this.reloadListener(t):this.reloadUserInfo=t}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(t,n=!1){let a=!1;t.idToken&&t.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(t),a=!0),n&&await gs(this),await this.auth._persistUserIfCurrent(this),a&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(kt(this.auth.app))return Promise.reject(gn(this.auth));const t=await this.getIdToken();return await Zr(this,Uv(this.auth,{idToken:t})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(t=>({...t})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(t,n){const a=n.displayName??void 0,s=n.email??void 0,o=n.phoneNumber??void 0,i=n.photoURL??void 0,l=n.tenantId??void 0,d=n._redirectEventId??void 0,c=n.createdAt??void 0,h=n.lastLoginAt??void 0,{uid:v,emailVerified:f,isAnonymous:p,providerData:m,stsTokenManager:g}=n;ie(v&&g,t,"internal-error");const y=zn.fromJSON(this.name,g);ie(typeof v=="string",t,"internal-error"),jt(a,t.name),jt(s,t.name),ie(typeof f=="boolean",t,"internal-error"),ie(typeof p=="boolean",t,"internal-error"),jt(o,t.name),jt(i,t.name),jt(l,t.name),jt(d,t.name),jt(c,t.name),jt(h,t.name);const u=new Ze({uid:v,auth:t,email:s,emailVerified:f,displayName:a,isAnonymous:p,photoURL:i,phoneNumber:o,tenantId:l,stsTokenManager:y,createdAt:c,lastLoginAt:h});return m&&Array.isArray(m)&&(u.providerData=m.map(x=>({...x}))),d&&(u._redirectEventId=d),u}static async _fromIdTokenResponse(t,n,a=!1){const s=new zn;s.updateFromServerResponse(n);const o=new Ze({uid:n.localId,auth:t,stsTokenManager:s,isAnonymous:a});return await gs(o),o}static async _fromGetAccountInfoResponse(t,n,a){const s=n.users[0];ie(s.localId!==void 0,"internal-error");const o=s.providerUserInfo!==void 0?bu(s.providerUserInfo):[],i=!(s.email&&s.passwordHash)&&!o?.length,l=new zn;l.updateFromIdToken(a);const d=new Ze({uid:s.localId,auth:t,stsTokenManager:l,isAnonymous:i}),c={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new yi(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!o?.length};return Object.assign(d,c),d}}const _d=new Map;function Ct(e){Pt(e instanceof Function,"Expected a class definition");let t=_d.get(e);return t?(Pt(t instanceof e,"Instance stored in cache mismatched with class"),t):(t=new e,_d.set(e,t),t)}class yu{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(t,n){this.storage[t]=n}async _get(t){const n=this.storage[t];return n===void 0?null:n}async _remove(t){delete this.storage[t]}_addListener(t,n){}_removeListener(t,n){}}yu.type="NONE";const Ad=yu;function Ga(e,t,n){return`firebase:${e}:${t}:${n}`}class Wn{constructor(t,n,a){this.persistence=t,this.auth=n,this.userKey=a;const{config:s,name:o}=this.auth;this.fullUserKey=Ga(this.userKey,s.apiKey,o),this.fullPersistenceKey=Ga("persistence",s.apiKey,o),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(t){return this.persistence._set(this.fullUserKey,t.toJSON())}async getCurrentUser(){const t=await this.persistence._get(this.fullUserKey);if(!t)return null;if(typeof t=="string"){const n=await ms(this.auth,{idToken:t}).catch(()=>{});return n?Ze._fromGetAccountInfoResponse(this.auth,n,t):null}return Ze._fromJSON(this.auth,t)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(t){if(this.persistence===t)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=t,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(t,n,a="authUser"){if(!n.length)return new Wn(Ct(Ad),t,a);const s=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let o=s[0]||Ct(Ad);const i=Ga(a,t.config.apiKey,t.name);let l=null;for(const c of n)try{const h=await c._get(i);if(h){let v;if(typeof h=="string"){const f=await ms(t,{idToken:h}).catch(()=>{});if(!f)break;v=await Ze._fromGetAccountInfoResponse(t,f,h)}else v=Ze._fromJSON(t,h);c!==o&&(l=v),o=c;break}}catch{}const d=s.filter(c=>c._shouldAllowMigration);return!o._shouldAllowMigration||!d.length?new Wn(o,t,a):(o=d[0],l&&await o._set(i,l.toJSON()),await Promise.all(n.map(async c=>{if(c!==o)try{await c._remove(i)}catch{}})),new Wn(o,t,a))}}function Md(e){const t=e.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(Su(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(wu(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(Iu(t))return"Blackberry";if(Cu(t))return"Webos";if(xu(t))return"Safari";if((t.includes("chrome/")||ku(t))&&!t.includes("edge/"))return"Chrome";if(Tu(t))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,a=e.match(n);if(a?.length===2)return a[1]}return"Other"}function wu(e=Re()){return/firefox\//i.test(e)}function xu(e=Re()){const t=e.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function ku(e=Re()){return/crios\//i.test(e)}function Su(e=Re()){return/iemobile/i.test(e)}function Tu(e=Re()){return/android/i.test(e)}function Iu(e=Re()){return/blackberry/i.test(e)}function Cu(e=Re()){return/webos/i.test(e)}function hl(e=Re()){return/iphone|ipad|ipod/i.test(e)||/macintosh/i.test(e)&&/mobile/i.test(e)}function Qv(e=Re()){return hl(e)&&!!window.navigator?.standalone}function Zv(){return pg()&&document.documentMode===10}function Eu(e=Re()){return hl(e)||Tu(e)||Cu(e)||Iu(e)||/windows phone/i.test(e)||Su(e)}function $u(e,t=[]){let n;switch(e){case"Browser":n=Md(Re());break;case"Worker":n=`${Md(Re())}-${e}`;break;default:n=e}const a=t.length?t.join(","):"FirebaseCore-web";return`${n}/JsCore/${ga}/${a}`}class eb{constructor(t){this.auth=t,this.queue=[]}pushCallback(t,n){const a=o=>new Promise((i,l)=>{try{const d=t(o);i(d)}catch(d){l(d)}});a.onAbort=n,this.queue.push(a);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(t){if(this.auth.currentUser===t)return;const n=[];try{for(const a of this.queue)await a(t),a.onAbort&&n.push(a.onAbort)}catch(a){n.reverse();for(const s of n)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:a?.message})}}}async function tb(e,t={}){return ur(e,"GET","/v2/passwordPolicy",fl(e,t))}const nb=6;class rb{constructor(t){const n=t.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??nb,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=t.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=t.allowedNonAlphanumericCharacters?.join("")??"",this.forceUpgradeOnSignin=t.forceUpgradeOnSignin??!1,this.schemaVersion=t.schemaVersion}validatePassword(t){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(t,n),this.validatePasswordCharacterOptions(t,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(t,n){const a=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;a&&(n.meetsMinPasswordLength=t.length>=a),s&&(n.meetsMaxPasswordLength=t.length<=s)}validatePasswordCharacterOptions(t,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let a;for(let s=0;s<t.length;s++)a=t.charAt(s),this.updatePasswordCharacterOptionsStatuses(n,a>="a"&&a<="z",a>="A"&&a<="Z",a>="0"&&a<="9",this.allowedNonAlphanumericCharacters.includes(a))}updatePasswordCharacterOptionsStatuses(t,n,a,s,o){this.customStrengthOptions.containsLowercaseLetter&&(t.containsLowercaseLetter||(t.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(t.containsUppercaseLetter||(t.containsUppercaseLetter=a)),this.customStrengthOptions.containsNumericCharacter&&(t.containsNumericCharacter||(t.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(t.containsNonAlphanumericCharacter||(t.containsNonAlphanumericCharacter=o))}}class ab{constructor(t,n,a,s){this.app=t,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=a,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Pd(this),this.idTokenSubscription=new Pd(this),this.beforeStateQueue=new eb(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=pu,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=t.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(o=>this._resolvePersistenceManagerAvailable=o)}_initializeWithPersistence(t,n){return n&&(this._popupRedirectResolver=Ct(n)),this._initializationPromise=this.queue(async()=>{if(!this._deleted&&(this.persistenceManager=await Wn.create(this,t),this._resolvePersistenceManagerAvailable?.(),!this._deleted)){if(this._popupRedirectResolver?._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=this.currentUser?.uid||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const t=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!t)){if(this.currentUser&&t&&this.currentUser.uid===t.uid){this._currentUser._assign(t),await this.currentUser.getIdToken();return}await this._updateCurrentUser(t,!0)}}async initializeCurrentUserFromIdToken(t){try{const n=await ms(this,{idToken:t}),a=await Ze._fromGetAccountInfoResponse(this,n,t);await this.directlySetCurrentUser(a)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(t){if(kt(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(i=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(i,i))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let a=n,s=!1;if(t&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=this.redirectUser?._redirectEventId,i=a?._redirectEventId,l=await this.tryRedirectSignIn(t);(!o||o===i)&&l?.user&&(a=l.user,s=!0)}if(!a)return this.directlySetCurrentUser(null);if(!a._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(a)}catch(o){a=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return a?this.reloadAndSetCurrentUserOrClear(a):this.directlySetCurrentUser(null)}return ie(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===a._redirectEventId?this.directlySetCurrentUser(a):this.reloadAndSetCurrentUserOrClear(a)}async tryRedirectSignIn(t){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,t,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(t){try{await gs(t)}catch(n){if(n?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(t)}useDeviceLanguage(){this.languageCode=Bv()}async _delete(){this._deleted=!0}async updateCurrentUser(t){if(kt(this.app))return Promise.reject(gn(this));const n=t?an(t):null;return n&&ie(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(t,n=!1){if(!this._deleted)return t&&ie(this.tenantId===t.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(t),this.queue(async()=>{await this.directlySetCurrentUser(t),this.notifyAuthListeners()})}async signOut(){return kt(this.app)?Promise.reject(gn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(t){return kt(this.app)?Promise.reject(gn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Ct(t))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(t){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(t)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const t=await tb(this),n=new rb(t);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(t){this._errorFactory=new ha("auth","Firebase",t())}onAuthStateChanged(t,n,a){return this.registerStateListener(this.authStateSubscription,t,n,a)}beforeAuthStateChanged(t,n){return this.beforeStateQueue.pushCallback(t,n)}onIdTokenChanged(t,n,a){return this.registerStateListener(this.idTokenSubscription,t,n,a)}authStateReady(){return new Promise((t,n)=>{if(this.currentUser)t();else{const a=this.onAuthStateChanged(()=>{a(),t()},n)}})}async revokeAccessToken(t){if(this.currentUser){const n=await this.currentUser.getIdToken(),a={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:t,idToken:n};this.tenantId!=null&&(a.tenantId=this.tenantId),await Xv(this,a)}}toJSON(){return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:this._currentUser?.toJSON()}}async _setRedirectUser(t,n){const a=await this.getOrInitRedirectPersistenceManager(n);return t===null?a.removeCurrentUser():a.setCurrentUser(t)}async getOrInitRedirectPersistenceManager(t){if(!this.redirectPersistenceManager){const n=t&&Ct(t)||this._popupRedirectResolver;ie(n,this,"argument-error"),this.redirectPersistenceManager=await Wn.create(this,[Ct(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(t){return this._isInitialized&&await this.queue(async()=>{}),this._currentUser?._redirectEventId===t?this._currentUser:this.redirectUser?._redirectEventId===t?this.redirectUser:null}async _persistUserIfCurrent(t){if(t===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(t))}_notifyListenersIfCurrent(t){t===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const t=this.currentUser?.uid??null;this.lastNotifiedUid!==t&&(this.lastNotifiedUid=t,this.authStateSubscription.next(this.currentUser))}registerStateListener(t,n,a,s){if(this._deleted)return()=>{};const o=typeof n=="function"?n:n.next.bind(n);let i=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(ie(l,this,"internal-error"),l.then(()=>{i||o(this.currentUser)}),typeof n=="function"){const d=t.addObserver(n,a,s);return()=>{i=!0,d()}}else{const d=t.addObserver(n);return()=>{i=!0,d()}}}async directlySetCurrentUser(t){this.currentUser&&this.currentUser!==t&&this._currentUser._stopProactiveRefresh(),t&&this.isProactiveRefreshEnabled&&t._startProactiveRefresh(),this.currentUser=t,t?await this.assertedPersistence.setCurrentUser(t):await this.assertedPersistence.removeCurrentUser()}queue(t){return this.operations=this.operations.then(t,t),this.operations}get assertedPersistence(){return ie(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(t){!t||this.frameworks.includes(t)||(this.frameworks.push(t),this.frameworks.sort(),this.clientVersion=$u(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const n=await this.heartbeatServiceProvider.getImmediate({optional:!0})?.getHeartbeatsHeader();n&&(t["X-Firebase-Client"]=n);const a=await this._getAppCheckToken();return a&&(t["X-Firebase-AppCheck"]=a),t}async _getAppCheckToken(){if(kt(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await this.appCheckServiceProvider.getImmediate({optional:!0})?.getToken();return t?.error&&Lv(`Error while retrieving App Check token: ${t.error}`),t?.token}}function Xs(e){return an(e)}class Pd{constructor(t){this.auth=t,this.observer=null,this.addObserver=wg(n=>this.observer=n)}get next(){return ie(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}let ml={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function sb(e){ml=e}function ob(e){return ml.loadJS(e)}function ib(){return ml.gapiScript}function lb(e){return`__${e}${Math.floor(Math.random()*1e6)}`}function db(e,t){const n=lu(e,"auth");if(n.isInitialized()){const s=n.getImmediate(),o=n.getOptions();if(Xn(o,t??{}))return s;Mt(s,"already-initialized")}return n.initialize({options:t})}function cb(e,t){const n=t?.persistence||[],a=(Array.isArray(n)?n:[n]).map(Ct);t?.errorMap&&e._updateErrorMap(t.errorMap),e._initializeWithPersistence(a,t?.popupRedirectResolver)}function ub(e,t,n){const a=Xs(e);ie(/^https?:\/\//.test(t),a,"invalid-emulator-scheme");const s=!1,o=Du(t),{host:i,port:l}=fb(t),d=l===null?"":`:${l}`,c={url:`${o}//${i}${d}/`},h=Object.freeze({host:i,port:l,protocol:o.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!a._canInitEmulator){ie(a.config.emulator&&a.emulatorConfig,a,"emulator-config-failed"),ie(Xn(c,a.config.emulator)&&Xn(h,a.emulatorConfig),a,"emulator-config-failed");return}a.config.emulator=c,a.emulatorConfig=h,a.settings.appVerificationDisabledForTesting=!0,Js(i)?(sg(`${o}//${i}${d}`),lg("Auth",!0)):pb()}function Du(e){const t=e.indexOf(":");return t<0?"":e.substr(0,t+1)}function fb(e){const t=Du(e),n=/(\/\/)?([^?#/]+)/.exec(e.substr(t.length));if(!n)return{host:"",port:null};const a=n[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(a);if(s){const o=s[1];return{host:o,port:Nd(a.substr(o.length+1))}}else{const[o,i]=a.split(":");return{host:o,port:Nd(i)}}}function Nd(e){if(!e)return null;const t=Number(e);return isNaN(t)?null:t}function pb(){function e(){const t=document.createElement("p"),n=t.style;t.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",t.classList.add("firebase-emulator-warning"),document.body.appendChild(t)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",e):e())}class _u{constructor(t,n){this.providerId=t,this.signInMethod=n}toJSON(){return It("not implemented")}_getIdTokenResponse(t){return It("not implemented")}_linkToIdToken(t,n){return It("not implemented")}_getReauthenticationResolver(t){return It("not implemented")}}async function Un(e,t){return zv(e,"POST","/v1/accounts:signInWithIdp",fl(e,t))}const hb="http://localhost";class Sn extends _u{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(t){const n=new Sn(t.providerId,t.signInMethod);return t.idToken||t.accessToken?(t.idToken&&(n.idToken=t.idToken),t.accessToken&&(n.accessToken=t.accessToken),t.nonce&&!t.pendingToken&&(n.nonce=t.nonce),t.pendingToken&&(n.pendingToken=t.pendingToken)):t.oauthToken&&t.oauthTokenSecret?(n.accessToken=t.oauthToken,n.secret=t.oauthTokenSecret):Mt("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(t){const n=typeof t=="string"?JSON.parse(t):t,{providerId:a,signInMethod:s,...o}=n;if(!a||!s)return null;const i=new Sn(a,s);return i.idToken=o.idToken||void 0,i.accessToken=o.accessToken||void 0,i.secret=o.secret,i.nonce=o.nonce,i.pendingToken=o.pendingToken||null,i}_getIdTokenResponse(t){const n=this.buildRequest();return Un(t,n)}_linkToIdToken(t,n){const a=this.buildRequest();return a.idToken=n,Un(t,a)}_getReauthenticationResolver(t){const n=this.buildRequest();return n.autoCreate=!1,Un(t,n)}buildRequest(){const t={requestUri:hb,returnSecureToken:!0};if(this.pendingToken)t.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),t.postBody=ma(n)}return t}}class Au{constructor(t){this.providerId=t,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(t){this.defaultLanguageCode=t}setCustomParameters(t){return this.customParameters=t,this}getCustomParameters(){return this.customParameters}}class ba extends Au{constructor(){super(...arguments),this.scopes=[]}addScope(t){return this.scopes.includes(t)||this.scopes.push(t),this}getScopes(){return[...this.scopes]}}class zt extends ba{constructor(){super("facebook.com")}static credential(t){return Sn._fromParams({providerId:zt.PROVIDER_ID,signInMethod:zt.FACEBOOK_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return zt.credentialFromTaggedObject(t)}static credentialFromError(t){return zt.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return zt.credential(t.oauthAccessToken)}catch{return null}}}zt.FACEBOOK_SIGN_IN_METHOD="facebook.com";zt.PROVIDER_ID="facebook.com";class St extends ba{constructor(){super("google.com"),this.addScope("profile")}static credential(t,n){return Sn._fromParams({providerId:St.PROVIDER_ID,signInMethod:St.GOOGLE_SIGN_IN_METHOD,idToken:t,accessToken:n})}static credentialFromResult(t){return St.credentialFromTaggedObject(t)}static credentialFromError(t){return St.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthIdToken:n,oauthAccessToken:a}=t;if(!n&&!a)return null;try{return St.credential(n,a)}catch{return null}}}St.GOOGLE_SIGN_IN_METHOD="google.com";St.PROVIDER_ID="google.com";class Wt extends ba{constructor(){super("github.com")}static credential(t){return Sn._fromParams({providerId:Wt.PROVIDER_ID,signInMethod:Wt.GITHUB_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return Wt.credentialFromTaggedObject(t)}static credentialFromError(t){return Wt.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return Wt.credential(t.oauthAccessToken)}catch{return null}}}Wt.GITHUB_SIGN_IN_METHOD="github.com";Wt.PROVIDER_ID="github.com";class Ut extends ba{constructor(){super("twitter.com")}static credential(t,n){return Sn._fromParams({providerId:Ut.PROVIDER_ID,signInMethod:Ut.TWITTER_SIGN_IN_METHOD,oauthToken:t,oauthTokenSecret:n})}static credentialFromResult(t){return Ut.credentialFromTaggedObject(t)}static credentialFromError(t){return Ut.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthAccessToken:n,oauthTokenSecret:a}=t;if(!n||!a)return null;try{return Ut.credential(n,a)}catch{return null}}}Ut.TWITTER_SIGN_IN_METHOD="twitter.com";Ut.PROVIDER_ID="twitter.com";class Zn{constructor(t){this.user=t.user,this.providerId=t.providerId,this._tokenResponse=t._tokenResponse,this.operationType=t.operationType}static async _fromIdTokenResponse(t,n,a,s=!1){const o=await Ze._fromIdTokenResponse(t,a,s),i=Ld(a);return new Zn({user:o,providerId:i,_tokenResponse:a,operationType:n})}static async _forOperation(t,n,a){await t._updateTokensIfNecessary(a,!0);const s=Ld(a);return new Zn({user:t,providerId:s,_tokenResponse:a,operationType:n})}}function Ld(e){return e.providerId?e.providerId:"phoneNumber"in e?"phone":null}class vs extends rn{constructor(t,n,a,s){super(n.code,n.message),this.operationType=a,this.user=s,Object.setPrototypeOf(this,vs.prototype),this.customData={appName:t.name,tenantId:t.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:a}}static _fromErrorAndOperation(t,n,a,s){return new vs(t,n,a,s)}}function Mu(e,t,n,a){return(t==="reauthenticate"?n._getReauthenticationResolver(e):n._getIdTokenResponse(e)).catch(o=>{throw o.code==="auth/multi-factor-auth-required"?vs._fromErrorAndOperation(e,o,t,a):o})}async function mb(e,t,n=!1){const a=await Zr(e,t._linkToIdToken(e.auth,await e.getIdToken()),n);return Zn._forOperation(e,"link",a)}async function gb(e,t,n=!1){const{auth:a}=e;if(kt(a.app))return Promise.reject(gn(a));const s="reauthenticate";try{const o=await Zr(e,Mu(a,s,t,e),n);ie(o.idToken,a,"internal-error");const i=pl(o.idToken);ie(i,a,"internal-error");const{sub:l}=i;return ie(e.uid===l,a,"user-mismatch"),Zn._forOperation(e,s,o)}catch(o){throw o?.code==="auth/user-not-found"&&Mt(a,"user-mismatch"),o}}async function Pu(e,t,n=!1){if(kt(e.app))return Promise.reject(gn(e));const a="signIn",s=await Mu(e,a,t),o=await Zn._fromIdTokenResponse(e,a,s);return n||await e._updateCurrentUser(o.user),o}async function vb(e,t){return Pu(Xs(e),t)}function bb(e,t,n,a){return an(e).onIdTokenChanged(t,n,a)}function yb(e,t,n){return an(e).beforeAuthStateChanged(t,n)}function wb(e,t,n,a){return an(e).onAuthStateChanged(t,n,a)}function xb(e){return an(e).signOut()}const bs="__sak";class Nu{constructor(t,n){this.storageRetriever=t,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(bs,"1"),this.storage.removeItem(bs),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(t,n){return this.storage.setItem(t,JSON.stringify(n)),Promise.resolve()}_get(t){const n=this.storage.getItem(t);return Promise.resolve(n?JSON.parse(n):null)}_remove(t){return this.storage.removeItem(t),Promise.resolve()}get storage(){return this.storageRetriever()}}const kb=1e3,Sb=10;class Lu extends Nu{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(t,n)=>this.onStorageEvent(t,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Eu(),this._shouldAllowMigration=!0}forAllChangedKeys(t){for(const n of Object.keys(this.listeners)){const a=this.storage.getItem(n),s=this.localCache[n];a!==s&&t(n,s,a)}}onStorageEvent(t,n=!1){if(!t.key){this.forAllChangedKeys((i,l,d)=>{this.notifyListeners(i,d)});return}const a=t.key;n?this.detachListener():this.stopPolling();const s=()=>{const i=this.storage.getItem(a);!n&&this.localCache[a]===i||this.notifyListeners(a,i)},o=this.storage.getItem(a);Zv()&&o!==t.newValue&&t.newValue!==t.oldValue?setTimeout(s,Sb):s()}notifyListeners(t,n){this.localCache[t]=n;const a=this.listeners[t];if(a)for(const s of Array.from(a))s(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((t,n,a)=>{this.onStorageEvent(new StorageEvent("storage",{key:t,oldValue:n,newValue:a}),!0)})},kb)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(t,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[t]||(this.listeners[t]=new Set,this.localCache[t]=this.storage.getItem(t)),this.listeners[t].add(n)}_removeListener(t,n){this.listeners[t]&&(this.listeners[t].delete(n),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(t,n){await super._set(t,n),this.localCache[t]=JSON.stringify(n)}async _get(t){const n=await super._get(t);return this.localCache[t]=JSON.stringify(n),n}async _remove(t){await super._remove(t),delete this.localCache[t]}}Lu.type="LOCAL";const Tb=Lu;class Ou extends Nu{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(t,n){}_removeListener(t,n){}}Ou.type="SESSION";const Ru=Ou;function Ib(e){return Promise.all(e.map(async t=>{try{return{fulfilled:!0,value:await t}}catch(n){return{fulfilled:!1,reason:n}}}))}class Qs{constructor(t){this.eventTarget=t,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(t){const n=this.receivers.find(s=>s.isListeningto(t));if(n)return n;const a=new Qs(t);return this.receivers.push(a),a}isListeningto(t){return this.eventTarget===t}async handleEvent(t){const n=t,{eventId:a,eventType:s,data:o}=n.data,i=this.handlersMap[s];if(!i?.size)return;n.ports[0].postMessage({status:"ack",eventId:a,eventType:s});const l=Array.from(i).map(async c=>c(n.origin,o)),d=await Ib(l);n.ports[0].postMessage({status:"done",eventId:a,eventType:s,response:d})}_subscribe(t,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[t]||(this.handlersMap[t]=new Set),this.handlersMap[t].add(n)}_unsubscribe(t,n){this.handlersMap[t]&&n&&this.handlersMap[t].delete(n),(!n||this.handlersMap[t].size===0)&&delete this.handlersMap[t],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Qs.receivers=[];function gl(e="",t=10){let n="";for(let a=0;a<t;a++)n+=Math.floor(Math.random()*10);return e+n}class Cb{constructor(t){this.target=t,this.handlers=new Set}removeMessageHandler(t){t.messageChannel&&(t.messageChannel.port1.removeEventListener("message",t.onMessage),t.messageChannel.port1.close()),this.handlers.delete(t)}async _send(t,n,a=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let o,i;return new Promise((l,d)=>{const c=gl("",20);s.port1.start();const h=setTimeout(()=>{d(new Error("unsupported_event"))},a);i={messageChannel:s,onMessage(v){const f=v;if(f.data.eventId===c)switch(f.data.status){case"ack":clearTimeout(h),o=setTimeout(()=>{d(new Error("timeout"))},3e3);break;case"done":clearTimeout(o),l(f.data.response);break;default:clearTimeout(h),clearTimeout(o),d(new Error("invalid_response"));break}}},this.handlers.add(i),s.port1.addEventListener("message",i.onMessage),this.target.postMessage({eventType:t,eventId:c,data:n},[s.port2])}).finally(()=>{i&&this.removeMessageHandler(i)})}}function mt(){return window}function Eb(e){mt().location.href=e}function Bu(){return typeof mt().WorkerGlobalScope<"u"&&typeof mt().importScripts=="function"}async function $b(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Db(){return navigator?.serviceWorker?.controller||null}function _b(){return Bu()?self:null}const ju="firebaseLocalStorageDb",Ab=1,ys="firebaseLocalStorage",Fu="fbase_key";class ya{constructor(t){this.request=t}toPromise(){return new Promise((t,n)=>{this.request.addEventListener("success",()=>{t(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Zs(e,t){return e.transaction([ys],t?"readwrite":"readonly").objectStore(ys)}function Mb(){const e=indexedDB.deleteDatabase(ju);return new ya(e).toPromise()}function wi(){const e=indexedDB.open(ju,Ab);return new Promise((t,n)=>{e.addEventListener("error",()=>{n(e.error)}),e.addEventListener("upgradeneeded",()=>{const a=e.result;try{a.createObjectStore(ys,{keyPath:Fu})}catch(s){n(s)}}),e.addEventListener("success",async()=>{const a=e.result;a.objectStoreNames.contains(ys)?t(a):(a.close(),await Mb(),t(await wi()))})})}async function Od(e,t,n){const a=Zs(e,!0).put({[Fu]:t,value:n});return new ya(a).toPromise()}async function Pb(e,t){const n=Zs(e,!1).get(t),a=await new ya(n).toPromise();return a===void 0?null:a.value}function Rd(e,t){const n=Zs(e,!0).delete(t);return new ya(n).toPromise()}const Nb=800,Lb=3;class Hu{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await wi(),this.db)}async _withRetries(t){let n=0;for(;;)try{const a=await this._openDb();return await t(a)}catch(a){if(n++>Lb)throw a;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Bu()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Qs._getInstance(_b()),this.receiver._subscribe("keyChanged",async(t,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(t,n)=>["keyChanged"])}async initializeSender(){if(this.activeServiceWorker=await $b(),!this.activeServiceWorker)return;this.sender=new Cb(this.activeServiceWorker);const t=await this.sender._send("ping",{},800);t&&t[0]?.fulfilled&&t[0]?.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(t){if(!(!this.sender||!this.activeServiceWorker||Db()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:t},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const t=await wi();return await Od(t,bs,"1"),await Rd(t,bs),!0}catch{}return!1}async _withPendingWrite(t){this.pendingWrites++;try{await t()}finally{this.pendingWrites--}}async _set(t,n){return this._withPendingWrite(async()=>(await this._withRetries(a=>Od(a,t,n)),this.localCache[t]=n,this.notifyServiceWorker(t)))}async _get(t){const n=await this._withRetries(a=>Pb(a,t));return this.localCache[t]=n,n}async _remove(t){return this._withPendingWrite(async()=>(await this._withRetries(n=>Rd(n,t)),delete this.localCache[t],this.notifyServiceWorker(t)))}async _poll(){const t=await this._withRetries(s=>{const o=Zs(s,!1).getAll();return new ya(o).toPromise()});if(!t)return[];if(this.pendingWrites!==0)return[];const n=[],a=new Set;if(t.length!==0)for(const{fbase_key:s,value:o}of t)a.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(o)&&(this.notifyListeners(s,o),n.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!a.has(s)&&(this.notifyListeners(s,null),n.push(s));return n}notifyListeners(t,n){this.localCache[t]=n;const a=this.listeners[t];if(a)for(const s of Array.from(a))s(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),Nb)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(t,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[t]||(this.listeners[t]=new Set,this._get(t)),this.listeners[t].add(n)}_removeListener(t,n){this.listeners[t]&&(this.listeners[t].delete(n),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Hu.type="LOCAL";const Ob=Hu;new va(3e4,6e4);function Rb(e,t){return t?Ct(t):(ie(e._popupRedirectResolver,e,"argument-error"),e._popupRedirectResolver)}class vl extends _u{constructor(t){super("custom","custom"),this.params=t}_getIdTokenResponse(t){return Un(t,this._buildIdpRequest())}_linkToIdToken(t,n){return Un(t,this._buildIdpRequest(n))}_getReauthenticationResolver(t){return Un(t,this._buildIdpRequest())}_buildIdpRequest(t){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return t&&(n.idToken=t),n}}function Bb(e){return Pu(e.auth,new vl(e),e.bypassAuthState)}function jb(e){const{auth:t,user:n}=e;return ie(n,t,"internal-error"),gb(n,new vl(e),e.bypassAuthState)}async function Fb(e){const{auth:t,user:n}=e;return ie(n,t,"internal-error"),mb(n,new vl(e),e.bypassAuthState)}class zu{constructor(t,n,a,s,o=!1){this.auth=t,this.resolver=a,this.user=s,this.bypassAuthState=o,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(t,n)=>{this.pendingPromise={resolve:t,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(a){this.reject(a)}})}async onAuthEvent(t){const{urlResponse:n,sessionId:a,postBody:s,tenantId:o,error:i,type:l}=t;if(i){this.reject(i);return}const d={auth:this.auth,requestUri:n,sessionId:a,tenantId:o||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(d))}catch(c){this.reject(c)}}onError(t){this.reject(t)}getIdpTask(t){switch(t){case"signInViaPopup":case"signInViaRedirect":return Bb;case"linkViaPopup":case"linkViaRedirect":return Fb;case"reauthViaPopup":case"reauthViaRedirect":return jb;default:Mt(this.auth,"internal-error")}}resolve(t){Pt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(t),this.unregisterAndCleanUp()}reject(t){Pt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(t),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}const Hb=new va(2e3,1e4);class Rn extends zu{constructor(t,n,a,s,o){super(t,n,s,o),this.provider=a,this.authWindow=null,this.pollId=null,Rn.currentPopupAction&&Rn.currentPopupAction.cancel(),Rn.currentPopupAction=this}async executeNotNull(){const t=await this.execute();return ie(t,this.auth,"internal-error"),t}async onExecution(){Pt(this.filter.length===1,"Popup operations only handle one event");const t=gl();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],t),this.authWindow.associatedEvent=t,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(ht(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){return this.authWindow?.associatedEvent||null}cancel(){this.reject(ht(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Rn.currentPopupAction=null}pollUserCancellation(){const t=()=>{if(this.authWindow?.window?.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(ht(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(t,Hb.get())};t()}}Rn.currentPopupAction=null;const zb="pendingRedirect",Va=new Map;class Wb extends zu{constructor(t,n,a=!1){super(t,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,a),this.eventId=null}async execute(){let t=Va.get(this.auth._key());if(!t){try{const a=await Ub(this.resolver,this.auth)?await super.execute():null;t=()=>Promise.resolve(a)}catch(n){t=()=>Promise.reject(n)}Va.set(this.auth._key(),t)}return this.bypassAuthState||Va.set(this.auth._key(),()=>Promise.resolve(null)),t()}async onAuthEvent(t){if(t.type==="signInViaRedirect")return super.onAuthEvent(t);if(t.type==="unknown"){this.resolve(null);return}if(t.eventId){const n=await this.auth._redirectUserForId(t.eventId);if(n)return this.user=n,super.onAuthEvent(t);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function Ub(e,t){const n=qb(t),a=Vb(e);if(!await a._isAvailable())return!1;const s=await a._get(n)==="true";return await a._remove(n),s}function Gb(e,t){Va.set(e._key(),t)}function Vb(e){return Ct(e._redirectPersistence)}function qb(e){return Ga(zb,e.config.apiKey,e.name)}async function Kb(e,t,n=!1){if(kt(e.app))return Promise.reject(gn(e));const a=Xs(e),s=Rb(a,t),i=await new Wb(a,s,n).execute();return i&&!n&&(delete i.user._redirectEventId,await a._persistUserIfCurrent(i.user),await a._setRedirectUser(null,t)),i}const Yb=600*1e3;class Jb{constructor(t){this.auth=t,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(t){this.consumers.add(t),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,t)&&(this.sendToConsumer(this.queuedRedirectEvent,t),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(t){this.consumers.delete(t)}onEvent(t){if(this.hasEventBeenHandled(t))return!1;let n=!1;return this.consumers.forEach(a=>{this.isEventForConsumer(t,a)&&(n=!0,this.sendToConsumer(t,a),this.saveEventToCache(t))}),this.hasHandledPotentialRedirect||!Xb(t)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=t,n=!0)),n}sendToConsumer(t,n){if(t.error&&!Wu(t)){const a=t.error.code?.split("auth/")[1]||"internal-error";n.onError(ht(this.auth,a))}else n.onAuthEvent(t)}isEventForConsumer(t,n){const a=n.eventId===null||!!t.eventId&&t.eventId===n.eventId;return n.filter.includes(t.type)&&a}hasEventBeenHandled(t){return Date.now()-this.lastProcessedEventTime>=Yb&&this.cachedEventUids.clear(),this.cachedEventUids.has(Bd(t))}saveEventToCache(t){this.cachedEventUids.add(Bd(t)),this.lastProcessedEventTime=Date.now()}}function Bd(e){return[e.type,e.eventId,e.sessionId,e.tenantId].filter(t=>t).join("-")}function Wu({type:e,error:t}){return e==="unknown"&&t?.code==="auth/no-auth-event"}function Xb(e){switch(e.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Wu(e);default:return!1}}async function Qb(e,t={}){return ur(e,"GET","/v1/projects",t)}const Zb=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,ey=/^https?/;async function ty(e){if(e.config.emulator)return;const{authorizedDomains:t}=await Qb(e);for(const n of t)try{if(ny(n))return}catch{}Mt(e,"unauthorized-domain")}function ny(e){const t=bi(),{protocol:n,hostname:a}=new URL(t);if(e.startsWith("chrome-extension://")){const i=new URL(e);return i.hostname===""&&a===""?n==="chrome-extension:"&&e.replace("chrome-extension://","")===t.replace("chrome-extension://",""):n==="chrome-extension:"&&i.hostname===a}if(!ey.test(n))return!1;if(Zb.test(e))return a===e;const s=e.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(a)}const ry=new va(3e4,6e4);function jd(){const e=mt().___jsl;if(e?.H){for(const t of Object.keys(e.H))if(e.H[t].r=e.H[t].r||[],e.H[t].L=e.H[t].L||[],e.H[t].r=[...e.H[t].L],e.CP)for(let n=0;n<e.CP.length;n++)e.CP[n]=null}}function ay(e){return new Promise((t,n)=>{function a(){jd(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{jd(),n(ht(e,"network-request-failed"))},timeout:ry.get()})}if(mt().gapi?.iframes?.Iframe)t(gapi.iframes.getContext());else if(mt().gapi?.load)a();else{const s=lb("iframefcb");return mt()[s]=()=>{gapi.load?a():n(ht(e,"network-request-failed"))},ob(`${ib()}?onload=${s}`).catch(o=>n(o))}}).catch(t=>{throw qa=null,t})}let qa=null;function sy(e){return qa=qa||ay(e),qa}const oy=new va(5e3,15e3),iy="__/auth/iframe",ly="emulator/auth/iframe",dy={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},cy=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function uy(e){const t=e.config;ie(t.authDomain,e,"auth-domain-config-required");const n=t.emulator?ul(t,ly):`https://${e.config.authDomain}/${iy}`,a={apiKey:t.apiKey,appName:e.name,v:ga},s=cy.get(e.config.apiHost);s&&(a.eid=s);const o=e._getFrameworks();return o.length&&(a.fw=o.join(",")),`${n}?${ma(a).slice(1)}`}async function fy(e){const t=await sy(e),n=mt().gapi;return ie(n,e,"internal-error"),t.open({where:document.body,url:uy(e),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:dy,dontclear:!0},a=>new Promise(async(s,o)=>{await a.restyle({setHideOnLeave:!1});const i=ht(e,"network-request-failed"),l=mt().setTimeout(()=>{o(i)},oy.get());function d(){mt().clearTimeout(l),s(a)}a.ping(d).then(d,()=>{o(i)})}))}const py={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},hy=500,my=600,gy="_blank",vy="http://localhost";class Fd{constructor(t){this.window=t,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function by(e,t,n,a=hy,s=my){const o=Math.max((window.screen.availHeight-s)/2,0).toString(),i=Math.max((window.screen.availWidth-a)/2,0).toString();let l="";const d={...py,width:a.toString(),height:s.toString(),top:o,left:i},c=Re().toLowerCase();n&&(l=ku(c)?gy:n),wu(c)&&(t=t||vy,d.scrollbars="yes");const h=Object.entries(d).reduce((f,[p,m])=>`${f}${p}=${m},`,"");if(Qv(c)&&l!=="_self")return yy(t||"",l),new Fd(null);const v=window.open(t||"",l,h);ie(v,e,"popup-blocked");try{v.focus()}catch{}return new Fd(v)}function yy(e,t){const n=document.createElement("a");n.href=e,n.target=t;const a=document.createEvent("MouseEvent");a.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(a)}const wy="__/auth/handler",xy="emulator/auth/handler",ky=encodeURIComponent("fac");async function Hd(e,t,n,a,s,o){ie(e.config.authDomain,e,"auth-domain-config-required"),ie(e.config.apiKey,e,"invalid-api-key");const i={apiKey:e.config.apiKey,appName:e.name,authType:n,redirectUrl:a,v:ga,eventId:s};if(t instanceof Au){t.setDefaultLanguage(e.languageCode),i.providerId=t.providerId||"",yg(t.getCustomParameters())||(i.customParameters=JSON.stringify(t.getCustomParameters()));for(const[h,v]of Object.entries({}))i[h]=v}if(t instanceof ba){const h=t.getScopes().filter(v=>v!=="");h.length>0&&(i.scopes=h.join(","))}e.tenantId&&(i.tid=e.tenantId);const l=i;for(const h of Object.keys(l))l[h]===void 0&&delete l[h];const d=await e._getAppCheckToken(),c=d?`#${ky}=${encodeURIComponent(d)}`:"";return`${Sy(e)}?${ma(l).slice(1)}${c}`}function Sy({config:e}){return e.emulator?ul(e,xy):`https://${e.authDomain}/${wy}`}const Bo="webStorageSupport";class Ty{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Ru,this._completeRedirectFn=Kb,this._overrideRedirectResult=Gb}async _openPopup(t,n,a,s){Pt(this.eventManagers[t._key()]?.manager,"_initialize() not called before _openPopup()");const o=await Hd(t,n,a,bi(),s);return by(t,o,gl())}async _openRedirect(t,n,a,s){await this._originValidation(t);const o=await Hd(t,n,a,bi(),s);return Eb(o),new Promise(()=>{})}_initialize(t){const n=t._key();if(this.eventManagers[n]){const{manager:s,promise:o}=this.eventManagers[n];return s?Promise.resolve(s):(Pt(o,"If manager is not set, promise should be"),o)}const a=this.initAndGetManager(t);return this.eventManagers[n]={promise:a},a.catch(()=>{delete this.eventManagers[n]}),a}async initAndGetManager(t){const n=await fy(t),a=new Jb(t);return n.register("authEvent",s=>(ie(s?.authEvent,t,"invalid-auth-event"),{status:a.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[t._key()]={manager:a},this.iframes[t._key()]=n,a}_isIframeWebStorageSupported(t,n){this.iframes[t._key()].send(Bo,{type:Bo},s=>{const o=s?.[0]?.[Bo];o!==void 0&&n(!!o),Mt(t,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(t){const n=t._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=ty(t)),this.originValidationPromises[n]}get _shouldInitProactively(){return Eu()||xu()||hl()}}const Iy=Ty;var zd="@firebase/auth",Wd="1.12.0";class Cy{constructor(t){this.auth=t,this.internalListeners=new Map}getUid(){return this.assertAuthConfigured(),this.auth.currentUser?.uid||null}async getToken(t){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(t)}:null}addAuthTokenListener(t){if(this.assertAuthConfigured(),this.internalListeners.has(t))return;const n=this.auth.onIdTokenChanged(a=>{t(a?.stsTokenManager.accessToken||null)});this.internalListeners.set(t,n),this.updateProactiveRefresh()}removeAuthTokenListener(t){this.assertAuthConfigured();const n=this.internalListeners.get(t);n&&(this.internalListeners.delete(t),n(),this.updateProactiveRefresh())}assertAuthConfigured(){ie(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}function Ey(e){switch(e){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function $y(e){Xr(new Qn("auth",(t,{options:n})=>{const a=t.getProvider("app").getImmediate(),s=t.getProvider("heartbeat"),o=t.getProvider("app-check-internal"),{apiKey:i,authDomain:l}=a.options;ie(i&&!i.includes(":"),"invalid-api-key",{appName:a.name});const d={apiKey:i,authDomain:l,clientPlatform:e,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:$u(e)},c=new ab(a,s,o,d);return cb(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((t,n,a)=>{t.getProvider("auth-internal").initialize()})),Xr(new Qn("auth-internal",t=>{const n=Xs(t.getProvider("auth").getImmediate());return(a=>new Cy(a))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Hn(zd,Wd,Ey(e)),Hn(zd,Wd,"esm2020")}const Dy=300,_y=au("authIdTokenMaxAge")||Dy;let Ud=null;const Ay=e=>async t=>{const n=t&&await t.getIdTokenResult(),a=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(a&&a>_y)return;const s=n?.token;Ud!==s&&(Ud=s,await fetch(e,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function My(e=xv()){const t=lu(e,"auth");if(t.isInitialized())return t.getImmediate();const n=db(e,{popupRedirectResolver:Iy,persistence:[Ob,Tb,Ru]}),a=au("authTokenSyncURL");if(a&&typeof isSecureContext=="boolean"&&isSecureContext){const o=new URL(a,location.origin);if(location.origin===o.origin){const i=Ay(o.toString());yb(n,i,()=>i(n.currentUser)),bb(n,l=>i(l))}}const s=rg("auth");return s&&ub(n,`http://${s}`),n}function Py(){return document.getElementsByTagName("head")?.[0]??document}sb({loadJS(e){return new Promise((t,n)=>{const a=document.createElement("script");a.setAttribute("src",e),a.onload=t,a.onerror=s=>{const o=ht("internal-error");o.customData=s,n(o)},a.type="text/javascript",a.charset="UTF-8",Py().appendChild(a)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});$y("Browser");const bl="951877343924-01638ei3dfu0p2q7c8c8q3cdsv67mthh.apps.googleusercontent.com",Oa="https://mhabib306-sys.github.io/lifeg/",Ny="https://mhabib306-sys.github.io",Ly={apiKey:"AIzaSyD33w50neGgMOYgu3NbS8Dp6B4sfyEpJes",authDomain:"homebase-880f0.firebaseapp.com",projectId:"homebase-880f0",storageBucket:"homebase-880f0.firebasestorage.app",messagingSenderId:"951877343924",appId:"1:951877343924:web:8b2a96ac24f59a48a415e1"},Oy=du(Ly),er=My(Oy);let Ra=null,Ka="";function Uu(){const e=new Uint8Array(32);return crypto.getRandomValues(e),Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}function Gu(){if(typeof window>"u"||!window.location)return Oa;try{const e=new URL(window.location.href);return e.origin===Ny||!/^https?:$/.test(e.protocol)?Oa:(e.search="",e.hash="",!e.pathname.endsWith("/")&&!e.pathname.split("/").pop()?.includes(".")&&(e.pathname=`${e.pathname}/`),e.toString())}catch{return Oa}}function Ry(){const e=Uu();sessionStorage.setItem("oauth_nonce",e);const t=Gu(),n=new URLSearchParams({client_id:bl,redirect_uri:t,response_type:"id_token token",scope:"openid email profile",nonce:e,include_granted_scopes:"true",prompt:"select_account"});window.location.href=`https://accounts.google.com/o/oauth2/v2/auth?${n.toString()}`}function By(){window.stopWhoopSyncTimers?.(),window.stopGCalSyncTimers?.(),xb(er).catch(e=>{console.error("Sign out failed:",e)})}function jy(){return er.currentUser}function Fy(){return Ka}async function Hy(e={}){const{mode:t="interactive"}=e,n=await zy(t);if(n){localStorage.setItem(or,n),localStorage.setItem(aa,String(Date.now()));const i=er.currentUser?.email||"";return i&&localStorage.setItem("nucleusGCalLoginHint",i),n}if(t==="silent")return null;const a=Uu(),s=Gu();sessionStorage.setItem("oauth_nonce",a),sessionStorage.setItem("oauth_calendar","1");const o=new URLSearchParams({client_id:bl,redirect_uri:s,response_type:"id_token token",scope:"openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/contacts.other.readonly https://www.googleapis.com/auth/spreadsheets.readonly",nonce:a,include_granted_scopes:"true",prompt:"consent"});return window.location.href=`https://accounts.google.com/o/oauth2/v2/auth?${o.toString()}`,null}function Vu(){return window.google?.accounts?.oauth2?Promise.resolve(!0):Ra||(Ra=new Promise(e=>{const t=document.querySelector('script[data-gis-client="1"]');if(t){t.addEventListener("load",()=>e(!!window.google?.accounts?.oauth2),{once:!0}),t.addEventListener("error",()=>e(!1),{once:!0});return}const n=document.createElement("script");n.src="https://accounts.google.com/gsi/client",n.async=!0,n.defer=!0,n.dataset.gisClient="1",n.onload=()=>e(!!window.google?.accounts?.oauth2),n.onerror=()=>e(!1),document.head.appendChild(n)}),Ra)}function qu(){Vu().catch(()=>{})}async function zy(e="interactive"){return!await Vu()||!window.google?.accounts?.oauth2?null:new Promise(n=>{let a=!1;const s=(l=null)=>{a||(a=!0,n(l))},o=e==="silent"?1e4:6e4,i=setTimeout(()=>{console.warn(`[GIS] Token request timed out (${e}, ${o}ms)`),s(null)},o);try{const l=window.google.accounts.oauth2.initTokenClient({client_id:bl,scope:"https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/contacts.other.readonly https://www.googleapis.com/auth/spreadsheets.readonly",use_fedcm_for_prompt:!0,callback:h=>{clearTimeout(i),Ka="",h?.access_token?(h.expires_in&&localStorage.setItem("nucleusGCalExpiresIn",String(h.expires_in)),s(h.access_token)):s(null)},error_callback:h=>{clearTimeout(i),Ka=h?.type||"unknown",console.warn(`[GIS] Token request error (${e}):`,Ka),s(null)}}),d=localStorage.getItem("nucleusGCalLoginHint")||er.currentUser?.email||"",c=e==="silent"?{prompt:"",...d?{login_hint:d}:{}}:{prompt:"consent"};l.requestAccessToken(c)}catch(l){clearTimeout(i),console.warn("GIS calendar token request failed:",l),s(null)}})}function Wy(){const e=window.location.hash;if(!e||!e.includes("id_token="))return null;const t=new URLSearchParams(e.substring(1)),n=t.get("id_token"),a=t.get("access_token");if(history.replaceState(null,"",window.location.pathname+window.location.search),!n)return null;const s=sessionStorage.getItem("oauth_calendar")==="1";if(sessionStorage.removeItem("oauth_calendar"),sessionStorage.removeItem("oauth_nonce"),s&&a){localStorage.setItem(or,a),localStorage.setItem(aa,String(Date.now())),localStorage.setItem(Bs,"true");const o=t.get("expires_in");o&&localStorage.setItem("nucleusGCalExpiresIn",o),r.gcalTokenExpired=!1,r.gcalError=null;try{const i=JSON.parse(atob(n.split(".")[1]));i?.email&&localStorage.setItem("nucleusGCalLoginHint",i.email)}catch{}}return{idToken:n,accessToken:a}}function Ku(e){const t=Wy();if(t){const s=St.credential(t.idToken);vb(er,s).catch(o=>{console.error("Firebase credential sign-in failed:",o),r.authError=o.message,window.render()})}let n=!0;const a=setTimeout(()=>{n&&(console.warn("[Auth] Firebase auth timed out — showing login screen"),n=!1,r.authLoading=!1,r.currentUser=null,e(null))},5e3);wb(er,s=>{clearTimeout(a),r.currentUser=s,r.authLoading=!1,r.authError=null,n?(n=!1,e(s)):window.render()})}const Yu="nucleusWhoopWorkerUrl",Ju="nucleusWhoopApiKey",yl="nucleusWhoopLastSync",eo="nucleusWhoopConnected",Uy=360*60*1e3,Gy=360*60*1e3;let Gn=null,Vn=null,Ya=null,ct=null;const Vy=60*1e3,Gd=11;function fr(){return localStorage.getItem(Yu)||""}function qy(e){const t=e.replace(/\/+$/,"");if(t&&!t.startsWith("https://")){console.warn("[WHOOP] Worker URL must use HTTPS. URL not saved.");return}localStorage.setItem(Yu,t)}function wa(){return localStorage.getItem(Ju)||""}function Ky(e){localStorage.setItem(Ju,e)}function to(){const e=localStorage.getItem(yl);return e?parseInt(e,10):null}function sn(){return localStorage.getItem(eo)==="true"}async function Xu(){const e=fr(),t=wa();if(!e||!t)return null;try{const n=await fetch(`${e}/data`,{headers:{"X-API-Key":t}});return n.ok?await n.json():(console.warn("WHOOP data fetch failed:",n.status),null)}catch(n){return console.error("WHOOP fetch error:",n),null}}async function Yy(){const e=fr(),t=wa();if(!e||!t)return!1;try{const n=await fetch(`${e}/status`,{headers:{"X-API-Key":t}});if(!n.ok)return!1;const s=!!(await n.json()).connected;return localStorage.setItem(eo,String(s)),window.render(),s}catch(n){return console.error("WHOOP status check error:",n),!1}}function Jy(e,t){r.allData[e]||(r.allData[e]=la()),r.allData[e].whoop||(r.allData[e].whoop={}),t.sleepPerf!==null&&t.sleepPerf!==void 0&&(r.allData[e].whoop.sleepPerf=t.sleepPerf),t.recovery!==null&&t.recovery!==void 0&&(r.allData[e].whoop.recovery=t.recovery),t.strain!==null&&t.strain!==void 0&&(r.allData[e].whoop.strain=t.strain),r.allData[e]._lastModified=new Date().toISOString()}async function xa({isRetry:e=!1}={}){const t=await Xu();if(!t){!e&&sn()&&(ct&&clearTimeout(ct),ct=setTimeout(()=>{ct=null,console.log("WHOOP retry sync triggered"),xa({isRetry:!0})},Vy));return}ct&&(clearTimeout(ct),ct=null);const n=he();Jy(n,t),localStorage.setItem(yl,String(Date.now())),window.invalidateScoresCache(),window.saveData(),window.debouncedSaveToGithub(),window.render(),console.log(`WHOOP synced: sleep ${t.sleepPerf}%, recovery ${t.recovery}%, strain ${t.strain}`)}async function wl(){if(!sn()||!fr()||!wa())return;const e=to();e&&Date.now()-e<Uy||await xa()}function Xy(){const e=new Date,t=new Date(e);t.setHours(23,59,0,0);let n=t-e;return n<=0&&(t.setDate(t.getDate()+1),n=t-e),n}async function Qy(){console.log("WHOOP end-of-day sync triggered"),await xa(),Qu()}function Qu(){if(Vn&&clearTimeout(Vn),!sn())return;const e=Xy(),t=Math.floor(e/36e5),n=Math.floor(e%36e5/6e4);console.log(`WHOOP end-of-day sync scheduled in ${t}h ${n}m`),Vn=setTimeout(Qy,e)}function Vd(){Gn&&clearInterval(Gn),Gn=setInterval(wl,Gy)}function Zu(){Gn&&(clearInterval(Gn),Gn=null),Vn&&(clearTimeout(Vn),Vn=null),Ya&&(clearTimeout(Ya),Ya=null),ct&&(clearTimeout(ct),ct=null)}function Zy(){const e=fr();e&&window.open(`${e}/auth`,"_blank")}function ew(){localStorage.removeItem(eo),localStorage.removeItem(yl),Zu(),window.render()}function xi(){if(new URLSearchParams(window.location.search).get("whoop")==="connected"){localStorage.setItem(eo,"true");const n=window.location.pathname+window.location.hash;window.history.replaceState({},"",n)}if(!sn())return;const t=new Date;if(t.getHours()<Gd){const n=new Date(t);n.setHours(Gd,0,0,0);const a=n-t,s=Math.floor(a/6e4);console.log(`WHOOP: first sync deferred to 11:00 AM (${s}m from now)`),Ya=setTimeout(()=>{xa(),Vd()},a)}else wl(),Vd();Qu()}const ef="nucleusLibreWorkerUrl",tf="nucleusLibreApiKey",xl="nucleusLibreLastSync",kl="nucleusLibreConnected",tw=3600*1e3,nw=3600*1e3;let qn=null,Kn=null,Ja=null;const qd=8;function pr(){return localStorage.getItem(ef)||""}function rw(e){const t=e.replace(/\/+$/,"");if(t&&!t.startsWith("https://")){console.warn("[LibreView] Worker URL must use HTTPS. URL not saved.");return}localStorage.setItem(ef,t)}function hr(){return localStorage.getItem(tf)||""}function aw(e){localStorage.setItem(tf,e)}function no(){const e=localStorage.getItem(xl);return e?parseInt(e,10):null}function Pn(){return localStorage.getItem(kl)==="true"}async function nf(){const e=pr(),t=hr();if(!e||!t)return null;try{const n=await fetch(`${e}/data`,{headers:{"X-API-Key":t}});return n.ok?await n.json():(console.warn("Libre data fetch failed:",n.status),null)}catch(n){return console.error("Libre fetch error:",n),null}}async function rf(){const e=pr(),t=hr();if(!e||!t)return!1;try{const n=await fetch(`${e}/status`,{headers:{"X-API-Key":t}});if(!n.ok)return!1;const s=!!(await n.json()).connected;return localStorage.setItem(kl,String(s)),window.render(),s}catch(n){return console.error("Libre status check error:",n),!1}}function sw(e,t){r.allData[e]||(r.allData[e]=la()),r.allData[e].glucose||(r.allData[e].glucose={}),r.allData[e].libre||(r.allData[e].libre={});const n=r.allData[e];t.avg24h!==null&&t.avg24h!==void 0&&(n.glucose.avg=String(t.avg24h)),t.tir!==null&&t.tir!==void 0&&(n.glucose.tir=String(t.tir)),t.currentGlucose!==null&&t.currentGlucose!==void 0&&(n.libre.currentGlucose=t.currentGlucose),n.libre.trend=t.trend||"",n.libre.readingsCount=t.readingsCount||0,n.libre.lastReading=t.lastReading||"",r.allData[e]._lastModified=new Date().toISOString()}async function ka(){const e=await nf();if(!e)return;const t=he();sw(t,e),localStorage.setItem(xl,String(Date.now())),window.invalidateScoresCache(),window.saveData(),window.debouncedSaveToGithub(),window.render(),console.log(`Libre synced: glucose ${e.currentGlucose} ${e.trend}, avg ${e.avg24h}, TIR ${e.tir}%`)}async function Sl(){if(!Pn()||!pr()||!hr())return;const e=no();e&&Date.now()-e<tw||await ka()}function ow(){const e=new Date,t=new Date(e);t.setHours(23,59,0,0);let n=t-e;return n<=0&&(t.setDate(t.getDate()+1),n=t-e),n}async function iw(){console.log("Libre end-of-day sync triggered"),await ka(),Tl()}function Tl(){if(Kn&&clearTimeout(Kn),!Pn())return;const e=ow(),t=Math.floor(e/36e5),n=Math.floor(e%36e5/6e4);console.log(`Libre end-of-day sync scheduled in ${t}h ${n}m`),Kn=setTimeout(iw,e)}function ki(){qn&&clearInterval(qn),qn=setInterval(Sl,nw)}function lw(){qn&&(clearInterval(qn),qn=null),Kn&&(clearTimeout(Kn),Kn=null),Ja&&(clearTimeout(Ja),Ja=null)}async function dw(){const e=pr(),t=hr();if(!e||!t)return;await rf()&&(await ka(),ki(),Tl())}function cw(){localStorage.removeItem(kl),localStorage.removeItem(xl),lw(),window.render()}function Si(){if(!Pn())return;const e=new Date;if(e.getHours()<qd){const t=new Date(e);t.setHours(qd,0,0,0);const n=t-e,a=Math.floor(n/6e4);console.log(`Libre: first sync deferred to 8:00 AM (${a}m from now)`),Ja=setTimeout(()=>{ka(),ki()},n)}else Sl(),ki();Tl()}const uw="https://www.googleapis.com/calendar/v3",fw=3300*1e3,pw=900*1e3;function hw(){const e=parseInt(localStorage.getItem("nucleusGCalExpiresIn")||"0",10);return e>0?e*1e3-300*1e3:fw}function mw(){const e=parseInt(localStorage.getItem("nucleusGCalExpiresIn")||"0",10);return e>0?e*1e3-pw:2700*1e3}const gw=1800*1e3,vw=15e3;let Et=null,$t=null,Ir=null,Qe=0,Fe=0,Rr=null,Ba=null,ft=null,Dt=null,jo=Date.now();function af(){return Fe<=1?60*1e3:Fe<=2?180*1e3:300*1e3}function Tn(){Rr&&(clearTimeout(Rr),Rr=null)}function Kd(){if(Tn(),!$e())return;const e=af();console.log(`[GCal] Scheduling silent refresh retry in ${Math.round(e/1e3)}s (attempt ${Fe})`),Rr=setTimeout(async()=>{if(Rr=null,!$e())return;await Vt()&&(console.log("[GCal] Scheduled retry succeeded"),window.render())},e)}function ro(){localStorage.setItem(bc,JSON.stringify(r.gcalOfflineQueue||[]))}function _t(e,t,n=""){const a=Array.isArray(r.gcalOfflineQueue)?r.gcalOfflineQueue:[];a.push({id:`gq_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,type:e,payload:t,createdAt:new Date().toISOString(),lastError:n||""}),r.gcalOfflineQueue=a,ro(),window.render()}function sf(e){r.gcalOfflineQueue=(r.gcalOfflineQueue||[]).filter(t=>t.id!==e),ro()}function Yd(e=""){const t=String(e).toLowerCase();return t.includes("meet.google.com")||t.includes("google.com/meet")?"Google Meet":t.includes("zoom.us")?"Zoom":t.includes("teams.microsoft.com")?"Microsoft Teams":""}function bw(e){const t=[];e?.hangoutLink&&t.push(e.hangoutLink),(e?.conferenceData?.entryPoints||[]).forEach(d=>{d?.uri&&t.push(d.uri)});const a=/(https?:\/\/[^\s<>"')]+)/gi,s=String(e?.description||"").match(a)||[],o=String(e?.location||"").match(a)||[];t.push(...s,...o);const l=t.find(d=>Yd(d))||t[0]||"";return{meetingLink:l,meetingProvider:Yd(l)}}function yw(e){if(!e)return!1;const t=String(e.status||"").toLowerCase();if(t==="cancelled"||t==="canceled")return!0;const n=String(e.summary||"").trim();return!!/^cance(?:l|ll)ed\b[:\s-]*/i.test(n)}function ww(e){if(!e)return!1;const n=(Array.isArray(e.attendees)?e.attendees:[]).find(a=>a.self===!0||a.self==="true");return!!(n&&n.responseStatus==="declined")}function Il(e){return yw(e)||ww(e)}function xw(e){const t=e?.error?.details;if(!Array.isArray(t))return"";const n=t.find(d=>d?.["@type"]==="type.googleapis.com/google.rpc.ErrorInfo");if(!n||n.reason!=="SERVICE_DISABLED")return"";const a=n.metadata?.serviceTitle||"Google API",s=(n.metadata?.consumer||"").replace("projects/","")||n.metadata?.containerInfo||"",o=n.metadata?.activationUrl||"",i=s?` (project ${s})`:"",l=o?` Enable it: ${o}`:"";return`${a} is disabled${i}.${l}`.trim()}function $e(){return localStorage.getItem(Bs)==="true"}function mr(){try{return JSON.parse(localStorage.getItem(Vi)||"[]")}catch{return[]}}function Cl(e){localStorage.setItem(Vi,JSON.stringify(e))}function tr(){return localStorage.getItem(qi)||""}function Ti(e){localStorage.setItem(qi,e)}function of(){return Array.isArray(r.gcalOfflineQueue)?r.gcalOfflineQueue:[]}function kw(){r.gcalOfflineQueue=[],ro(),window.render()}function Sw(e){sf(e),window.render()}function El(){return localStorage.getItem(or)||""}function Xa(){if(!El())return!1;const t=parseInt(localStorage.getItem(aa)||"0",10);return Date.now()-t<hw()}function lf(){r.gcalTokenExpired=!0,r.gcalError="Google Calendar session expired. Reconnect to continue.",window.render()}async function Vt({bypassCooldown:e=!1}={}){return!e&&Qe&&Date.now()-Qe<af()?!1:Ir||(Ir=(async()=>{try{if(await window.signInWithGoogleCalendar?.({mode:"silent"})||Fe===0&&(await new Promise(s=>setTimeout(s,2e3)),await window.signInWithGoogleCalendar?.({mode:"silent"})))return Qe=0,Fe=0,Tn(),r.gcalTokenExpired=!1,r.gcalError=null,!0;const n=window.getLastGisErrorType?.()||"";return console.warn(`[GCal] Silent refresh failed (attempt ${Fe+1}${n?`, GIS: ${n}`:""})`),Fe++,Qe=Date.now(),Kd(),!1}catch(t){return console.warn("[GCal] Silent token refresh error:",t),Fe++,Qe=Date.now(),Kd(),!1}finally{Ir=null}})(),Ir)}async function In(){return Xa()||await Vt()||El()?!0:(lf(),!1)}async function Cn(e,t={}){if(!await In())return null;const a=El(),s=new AbortController,o=setTimeout(()=>s.abort(),vw);t.signal&&(t.signal.aborted?s.abort():t.signal.addEventListener("abort",()=>s.abort(),{once:!0}));const{signal:i,_retry401:l,...d}=t;try{const c=await fetch(`${uw}${e}`,{...d,signal:s.signal,headers:{Authorization:`Bearer ${a}`,"Content-Type":"application/json",...t.headers||{}}});if(c.status===401){if(!t._retry401){let h=await Vt();if(h||(await new Promise(v=>setTimeout(v,1e3)),h=await Vt({bypassCooldown:!0})),h)return Cn(e,{...t,_retry401:!0})}return lf(),null}if(!c.ok){let h="",v=null;try{v=await c.json(),h=v?.error?.message||""}catch{}if(c.status===403){const f=xw(v);r.gcalError=f||"Calendar access was denied. Reconnect and grant Calendar permissions."}else h?r.gcalError=`Google Calendar error: ${h}`:r.gcalError=`Google Calendar request failed (${c.status}).`;return console.warn(`GCal API error: ${c.status} ${e}${h?` — ${h}`:""}`),null}return r.gcalError=null,c.status===204?{}:c.json()}catch(c){return c?.name==="AbortError"?r.gcalError="Google Calendar request timed out. Check connection and try again.":r.gcalError="Network error while contacting Google Calendar.",console.warn("GCal network error:",c),null}finally{clearTimeout(o)}}async function ao(){r.gcalCalendarsLoading=!0,r.gcalError=null,window.render();try{const e=await Cn("/users/me/calendarList?minAccessRole=reader");if(!e||!Array.isArray(e.items))return!1;if(r.gcalCalendarList=e.items.map(t=>({id:t.id,summary:t.summary||t.id,backgroundColor:t.backgroundColor||"#4285f4",primary:!!t.primary,accessRole:t.accessRole})),mr().length===0&&Cl(r.gcalCalendarList.map(t=>t.id)),!tr()){const t=r.gcalCalendarList.find(n=>n.primary);t&&Ti(t.id)}return!tr()&&r.gcalCalendarList.length>0&&Ti(r.gcalCalendarList[0].id),!0}finally{r.gcalCalendarsLoading=!1,window.render()}}async function Tw(e,t){const n=mr();if(n.length===0)return;r.gcalSyncing=!0;const a=window.scrollY;window.render(),window.scrollTo(0,a);try{const s=[];for(const o of n){let i="";do{const l=new URLSearchParams({timeMin:new Date(e).toISOString(),timeMax:new Date(t).toISOString(),singleEvents:"true",orderBy:"startTime",maxResults:"250"});i&&l.set("pageToken",i);const d=await Cn(`/calendars/${encodeURIComponent(o)}/events?${l}`);if(!d)break;(Array.isArray(d.items)?d.items:[]).forEach(h=>{if(Il(h))return;const{meetingLink:v,meetingProvider:f}=bw(h);s.push({id:h.id,calendarId:o,status:h.status||"",summary:h.summary||"(No title)",description:h.description||"",attendees:Array.isArray(h.attendees)?h.attendees.map(p=>({email:p.email||"",displayName:p.displayName||"",responseStatus:p.responseStatus||"",self:!!p.self})):[],recurringEventId:h.recurringEventId||"",originalStartTime:h.originalStartTime||null,start:h.start,end:h.end,location:h.location||"",htmlLink:h.htmlLink||"",meetingLink:v,meetingProvider:f,allDay:!!h.start.date})}),i=d.nextPageToken||""}while(i)}r.gcalEvents=s,localStorage.setItem(Gr,JSON.stringify(s)),localStorage.setItem(Ki,String(Date.now()))}finally{r.gcalSyncing=!1;const s=window.scrollY;window.render(),window.scrollTo(0,s)}}function Iw(e){const t=mr();return r.gcalEvents.filter(n=>{if(Il(n)||t.length>0&&!t.includes(n.calendarId))return!1;if(n.allDay){const c=n.start.date,h=n.end.date;return e>=c&&e<h}const a=n.start?.dateTime||"",s=n.end?.dateTime||"";if(!a)return!1;const o=new Date(a),i=s?new Date(s):new Date(a);if(!Number.isFinite(o.getTime())||!Number.isFinite(i.getTime()))return!1;const l=new Date(`${e}T00:00:00`),d=new Date(`${e}T23:59:59.999`);return o<=d&&i>l})}async function Cw(e){const t=tr();if(!t)return;const n=e.deferDate||e.dueDate;if(!n)return;const s=(e.dueDate||e.deferDate).split("-").map(Number),o=new Date(s[0],s[1]-1,s[2]+1),i=`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}-${String(o.getDate()).padStart(2,"0")}`,l={summary:e.title,description:e.notes||"",start:{date:n},end:{date:i}};if(e.gcalEventId)return await Cn(`/calendars/${encodeURIComponent(t)}/events/${encodeURIComponent(e.gcalEventId)}`,{method:"PUT",body:JSON.stringify(l)});{const d=await Cn(`/calendars/${encodeURIComponent(t)}/events`,{method:"POST",body:JSON.stringify(l)});return d&&d.id&&window.updateTask(e.id,{gcalEventId:d.id}),d}}async function Ew(e){if(!e.gcalEventId)return;const t=tr();t&&await Cn(`/calendars/${encodeURIComponent(t)}/events/${encodeURIComponent(e.gcalEventId)}`,{method:"DELETE"})}async function $w(e,t,n){if(!e?.calendarId||!e?.id)return null;const a={start:{dateTime:t},end:{dateTime:n}};return Cn(`/calendars/${encodeURIComponent(e.calendarId)}/events/${encodeURIComponent(e.id)}`,{method:"PATCH",body:JSON.stringify(a)})}async function df(e){if($e()){if(!navigator.onLine){_t("push_task",{task:e});return}if(await In()&&!e.isNote&&!(!e.deferDate&&!e.dueDate))try{await Cw(e)||_t("push_task",{task:e},r.gcalError||"Push failed")}catch(t){_t("push_task",{task:e},t?.message||"Push failed"),console.warn("GCal push failed:",t)}}}async function cf(e){if($e()){if(!navigator.onLine){_t("delete_event",{task:e});return}if(await In()&&e.gcalEventId)try{await Ew(e)===null&&_t("delete_event",{task:e},r.gcalError||"Delete failed")}catch(t){_t("delete_event",{task:e},t?.message||"Delete failed"),console.warn("GCal delete failed:",t)}}}async function uf(e,t,n){if(!$e()||!e)return!1;const a=new Date(`${t}T${String(n).padStart(2,"0")}:00:00`),s=e?.start?.dateTime?new Date(e.start.dateTime):null,o=e?.end?.dateTime?new Date(e.end.dateTime):null,i=s&&o?Math.max(1800*1e3,o-s):3600*1e3,l=new Date(a.getTime()+i),d=a.toISOString(),c=l.toISOString();if(!navigator.onLine)return _t("reschedule_event",{event:e,dateStr:t,hour:n,startIso:d,endIso:c},"Offline"),!1;if(!await In())return!1;try{if(!await $w(e,d,c))return _t("reschedule_event",{event:e,dateStr:t,hour:n,startIso:d,endIso:c},r.gcalError||"Reschedule failed"),!1;const v=r.gcalEvents.find(f=>f.calendarId===e.calendarId&&f.id===e.id);return v&&(v.start={dateTime:d},v.end={dateTime:c},v.allDay=!1,localStorage.setItem(Gr,JSON.stringify(r.gcalEvents))),window.render(),!0}catch(h){return _t("reschedule_event",{event:e,dateStr:t,hour:n,startIso:d,endIso:c},h?.message||"Reschedule failed"),console.warn("GCal reschedule failed:",h),!1}}async function Dw(){const e=[...of()];if(e.length){for(const t of e)try{t.type==="push_task"&&t.payload?.task?await df(t.payload.task):t.type==="delete_event"&&t.payload?.task?await cf(t.payload.task):t.type==="reschedule_event"&&t.payload?.event&&await uf(t.payload.event,t.payload.dateStr,t.payload.hour),sf(t.id)}catch(n){const a=r.gcalOfflineQueue.find(s=>s.id===t.id);a&&(a.lastError=n?.message||"Retry failed"),ro()}window.render()}}async function _w(){if(Qe=0,Fe=0,Tn(),!await window.signInWithGoogleCalendar())return;localStorage.setItem(Bs,"true"),r.gcalTokenExpired=!1,r.gcalError=null,await ao()&&await vn(),await window.syncGoogleContactsNow?.(),window.render()}function Aw(){Et&&(clearInterval(Et),Et=null),$t&&(clearInterval($t),$t=null),Dt&&(clearInterval(Dt),Dt=null),ft&&(window.removeEventListener("online",ft),ft=null),Tn()}function Mw(){localStorage.removeItem(Bs),localStorage.removeItem(or),localStorage.removeItem(aa),localStorage.removeItem(Vi),localStorage.removeItem(qi),localStorage.removeItem(Gr),localStorage.removeItem(Ki),localStorage.removeItem(as),localStorage.removeItem(js),r.gcalEvents=[],r.gcalCalendarList=[],r.gcalCalendarsLoading=!1,r.gcalError=null,r.gcalSyncing=!1,r.gcalTokenExpired=!1,r.gcontactsSyncing=!1,r.gcontactsLastSync=null,r.gcontactsError=null,Et&&(clearInterval(Et),Et=null),$t&&(clearInterval($t),$t=null),Dt&&(clearInterval(Dt),Dt=null),ft&&(window.removeEventListener("online",ft),ft=null),Tn(),Fe=0,window.render()}async function Pw(){if(Qe=0,Fe=0,Tn(),!await window.signInWithGoogleCalendar())return;r.gcalTokenExpired=!1,r.gcalError=null,await ao()&&await vn(),await window.syncGoogleContactsNow?.(),window.render()}async function vn(){if(!$e()||!await In()||(r.gcalCalendarList||[]).length===0)return;const e=new Date(r.calendarYear,r.calendarMonth-1,1,0,0,0,0),t=new Date(r.calendarYear,r.calendarMonth+2,0,23,59,59,999),n=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`,a=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;await Tw(n,a)}function Nw(e){const t=mr(),n=t.indexOf(e),a=n<0;a?t.push(e):t.splice(n,1),Cl(t),a&&vn()}function Ii(){try{const t=localStorage.getItem(Gr);if(t){const n=JSON.parse(t);r.gcalEvents=Array.isArray(n)?n.filter(a=>!Il(a)):[],localStorage.setItem(Gr,JSON.stringify(r.gcalEvents))}}catch{}if(!$e())return;(async()=>{if(!await In())return;await ao()&&vn()})(),Et&&clearInterval(Et),Et=setInterval(async()=>{$e()&&await In()&&vn()},gw),$t&&clearInterval($t),$t=setInterval(async()=>{if(!$e())return;const t=parseInt(localStorage.getItem(aa)||"0",10);Date.now()-t>=mw()&&await Vt()&&console.log("[GCal] Token proactively refreshed")},60*1e3),Dt&&clearInterval(Dt),jo=Date.now(),Dt=setInterval(async()=>{const t=Date.now(),n=t-jo;if(jo=t,n>120*1e3){if(console.log(`[GCal] Wake detected (${Math.round(n/1e3)}s elapsed)`),!$e())return;Qe=0,Fe=0,Xa()||await Vt({bypassCooldown:!0})&&(console.log("[GCal] Token refreshed after wake"),window.render())}},30*1e3),ft&&window.removeEventListener("online",ft),ft=async()=>{$e()&&(console.log("[GCal] Network restored, checking token"),await new Promise(t=>setTimeout(t,1500)),Qe=0,Xa()||await Vt({bypassCooldown:!0})&&(console.log("[GCal] Token refreshed after reconnect"),window.render(),vn()))},window.addEventListener("online",ft),Ba&&document.removeEventListener("visibilitychange",Ba),Ba=async()=>{document.visibilityState==="visible"&&$e()&&(Qe=0,Fe=0,Xa()||await Vt({bypassCooldown:!0})&&(console.log("[GCal] Token refreshed on tab focus"),window.render()))},document.addEventListener("visibilitychange",Ba)}const ff="https://people.googleapis.com/v1",Lw=1800*1e3;let Fo=null;function so(){return localStorage.getItem(or)||""}function Ow(){return localStorage.getItem(as)||""}function Ho(e){e?localStorage.setItem(as,e):localStorage.removeItem(as)}function Rw(e){r.gcontactsLastSync=e,localStorage.setItem(js,String(e))}function Jd(e){return String(e||"").trim().toLowerCase()}function Bw(e){const t=Array.isArray(e?.names)?e.names:[],n=t.find(a=>a?.metadata?.primary);return String(n?.displayName||t[0]?.displayName||"").trim()}function jw(e){const t=Array.isArray(e?.emailAddresses)?e.emailAddresses:[],n=t.find(a=>a?.metadata?.primary);return String(n?.value||t[0]?.value||"").trim()}function Fw(e){const t=Array.isArray(e?.organizations)?e.organizations:[],n=t.find(a=>a?.metadata?.primary);return String(n?.title||t[0]?.title||"").trim()}function Hw(e){const n=(Array.isArray(e?.photos)?e.photos:[]).filter(s=>!s?.default);if(n.length===0)return"";const a=n.find(s=>s?.metadata?.primary);return String(a?.url||n[0]?.url||"").trim()}async function zw(e){try{if(!e)return"";let t=await fetch(e);if(!t.ok){const l=so();if(l&&(t=await fetch(e,{headers:{Authorization:`Bearer ${l}`}})),!t.ok)return""}const n=await t.blob(),a=await createImageBitmap(n),s=64,o=document.createElement("canvas");return o.width=s,o.height=s,o.getContext("2d").drawImage(a,0,0,s,s),a.close(),o.toDataURL("image/jpeg",.8)}catch{return""}}function Ww(){const e=["#4A90A4","#6B8E5A","#E5533D","#C4943D","#7C6B8E","#6366F1","#0EA5E9"];return e[Math.floor(Math.random()*e.length)]}function Uw(){return`person_${Date.now()}_${Math.random().toString(36).slice(2,7)}`}function Gw(e){if(!Array.isArray(e)||e.length===0)return{changed:0,peopleNeedingPhotos:[]};let t=0;const n=[];for(const a of e){const s=!!a?.metadata?.deleted,o=String(a?.resourceName||"").trim(),i=Bw(a),l=jw(a),d=Fw(a),c=Hw(a),h=Jn(l),v=Jd(i);if(!o)continue;const f=r.taskPeople.find(u=>String(u.googleContactId||"")===o),p=!f&&h?r.taskPeople.find(u=>Jn(u.email)===h):null,m=!f&&!p&&v?r.taskPeople.find(u=>Jd(u.name)===v):null,g=f||p||m||null;if(s){g&&g.googleContactId===o&&(g.googleContactId="",g.updatedAt=new Date().toISOString(),t++);continue}if(g){const u=i||g.name,x=l||g.email||"",k=d||g.jobTitle||"";if((g.name!==u||String(g.email||"")!==String(x||"")||String(g.jobTitle||"")!==String(k||"")||String(g.googleContactId||"")!==o)&&(g.name=u,g.email=String(x||"").trim(),g.jobTitle=String(k||"").trim(),g.googleContactId=o,g.updatedAt=new Date().toISOString(),t++),c){const D=String(g.photoUrl||"")!==c;D&&(g.photoUrl=c),(D||!g.photoData)&&n.push(g)}continue}if(!i&&!l)continue;const y={id:Uw(),name:i||l,email:String(l||"").trim(),jobTitle:String(d||"").trim(),color:Ww(),googleContactId:o,photoUrl:c,photoData:"",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};r.taskPeople.push(y),c&&n.push(y),t++}return{changed:t,peopleNeedingPhotos:n}}async function Vw({pageToken:e="",syncToken:t="",requestSyncToken:n=!1}={}){const a=so();if(!a)return null;const s=new URLSearchParams({personFields:"names,emailAddresses,organizations,metadata,photos",pageSize:"1000"});e&&s.set("pageToken",e),t&&s.set("syncToken",t),n&&s.set("requestSyncToken","true");const o=await fetch(`${ff}/people/me/connections?${s.toString()}`,{headers:{Authorization:`Bearer ${a}`,"Content-Type":"application/json"}});if(o.status===401)return{authExpired:!0};if(o.status===410)return{syncExpired:!0};if(!o.ok){let i=`Google Contacts request failed (${o.status})`,l=!1;try{const d=await o.json();d?.error?.message&&(i=d.error.message),l=(Array.isArray(d?.error?.errors)?d.error.errors.map(h=>String(h?.reason||"").toLowerCase()):[]).includes("insufficientpermissions")||/insufficient authentication scopes/i.test(String(d?.error?.message||""))}catch{}return o.status===403&&l?{insufficientScope:!0,error:i}:{error:i}}return o.json()}async function qw(e=""){const t=so();if(!t)return null;const n=new URLSearchParams({readMask:"names,emailAddresses,photos,metadata",pageSize:"1000"});e&&n.set("pageToken",e);const a=await fetch(`${ff}/otherContacts?${n.toString()}`,{headers:{Authorization:`Bearer ${t}`}});return a.status===401?{authExpired:!0}:a.status===403?{otherContactsUnavailable:!0}:a.ok?a.json():{error:`Other contacts request failed (${a.status})`}}async function Kw(e){let t=0;for(const n of e){if(!n.photoUrl)continue;const a=await zw(n.photoUrl);a&&(n.photoData=a,n.updatedAt=new Date().toISOString(),t++)}t>0&&(le(),window.render(),window.debouncedSaveToGithub?.())}async function ws({forceFullResync:e=!1}={}){if(!$e()||!so())return!1;r.gcontactsSyncing=!0,r.gcontactsError=null,window.render();try{e&&Ho("");let n=Ow(),a="",s="",o=[],i=e,l=!1,d=!1;for(;;){const f=await Vw({pageToken:a,syncToken:n,requestSyncToken:!n});if(!f)return r.gcontactsError="Google Contacts sync failed.",!1;if(f.authExpired){if(!d&&(d=!0,await window.signInWithGoogleCalendar?.({mode:"silent"}))){a="";continue}return r.gcontactsError="Google Contacts authorization expired. Reconnect Google Calendar to refresh permissions.",!1}if(f.syncExpired){if(i)return r.gcontactsError="Google Contacts sync token expired. Please sync again.",!1;i=!0,Ho(""),n="",a="",s="",o=[];continue}if(f.error){if(f.insufficientScope&&!l){if(l=!0,await window.signInWithGoogleCalendar?.({mode:"silent"})){a="";continue}return r.gcontactsError="Google Contacts permission is missing. Please use Reconnect in Google Calendar settings to grant Contacts access.",!1}return r.gcontactsError=f.error,!1}if(o=o.concat(Array.isArray(f.connections)?f.connections:[]),a=f.nextPageToken||"",f.nextSyncToken&&(s=f.nextSyncToken),!a)break}let c="";for(;;){const f=await qw(c);if(!f||f.authExpired||f.otherContactsUnavailable||f.error||(o=o.concat(Array.isArray(f.otherContacts)?f.otherContacts:[]),c=f.nextPageToken||"",!c))break}const{changed:h,peopleNeedingPhotos:v}=Gw(o);for(const f of r.taskPeople)f.photoUrl&&!f.photoData&&!v.includes(f)&&v.push(f);return h>0&&le(),s&&Ho(s),Rw(Date.now()),r.gcontactsError=null,v.length>0&&Kw(v),!0}catch(n){return r.gcontactsError=n?.message||"Google Contacts sync failed.",!1}finally{r.gcontactsSyncing=!1,window.render()}}function Yw(){return ws({forceFullResync:!0})}function Ci(){const e=parseInt(localStorage.getItem(js)||"0",10);r.gcontactsLastSync=Number.isFinite(e)&&e>0?e:null,$e()&&(ws(),Fo&&clearInterval(Fo),Fo=setInterval(()=>{$e()&&ws()},Lw))}const Xd="https://sheets.googleapis.com/v4/spreadsheets",Jw=3600*1e3;let zo=null;function pf(){return localStorage.getItem(or)||""}async function Qd(){const e=pf();if(!e)return{error:"No access token"};const t=await fetch(`${Xd}/${ld}?fields=sheets.properties`,{headers:{Authorization:`Bearer ${e}`}});if(t.status===401)return{authExpired:!0};if(t.status===403){let f="Sheets permission denied";try{const p=await t.json();p?.error?.message&&(f=p.error.message)}catch{}return{error:f,insufficientScope:!0}}if(!t.ok)return{error:`Sheets API error (${t.status})`};const a=(await t.json())?.sheets||[];if(a.length===0)return{error:"No tabs found in spreadsheet"};const s=a.map(f=>f.properties.title);console.log(`[GSheet] Discovered ${s.length} tabs:`,s);const o=new URL(`${Xd}/${ld}/values:batchGet`);for(const f of s)o.searchParams.append("ranges",`'${f}'`);console.log("[GSheet] Batch URL:",o.href);const i=await fetch(o.href,{headers:{Authorization:`Bearer ${e}`}});if(i.status===401)return{authExpired:!0};if(!i.ok){const f=await i.text().catch(()=>"");return console.error(`[GSheet] Batch fetch failed (${i.status}):`,f),{error:`Sheets batch fetch failed (${i.status})`}}const d=(await i.json())?.valueRanges||[];console.log(`[GSheet] Got ${d.length} value ranges back`);const c=[];for(let f=0;f<d.length;f++){const p=s[f]||`Sheet${f+1}`,m=d[f]?.values||[];c.push({name:p,headers:m[0]||[],rows:m.slice(1)})}console.log(`[GSheet] Structured ${c.length} tabs:`,c.map(f=>`${f.name} (${f.rows.length} rows)`));const h=c.find((f,p)=>a[p]?.properties?.sheetId===wh)||c[0];let v=[];if(h&&h.headers.length>0){const p=h.headers.map(m=>String(m||"").trim().toLowerCase()).findIndex(m=>m==="yesterday");if(p!==-1)for(const m of h.rows){const g=String(m[0]||"").trim(),y=p<m.length?String(m[p]||"").trim():"";!g&&!y||v.push({label:g,value:y})}}return{tabs:c,discoveredTabs:s.length,rows:v,tabName:h?.name||"",lastSync:new Date().toISOString()}}async function xs(){if(!$e()||!pf())return!1;r.gsheetSyncing=!0,r.gsheetError=null,window.render();try{const t=await Qd();if(t.authExpired){if(await window.signInWithGoogleCalendar?.({mode:"silent"})){const o=await Qd();if(o&&!o.authExpired&&!o.error)return r.gsheetData=o,localStorage.setItem(ss,JSON.stringify(o)),localStorage.setItem(dd,String(Date.now())),r.gsheetError=null,!0}return r.gsheetError="Google Sheets authorization expired. Reconnect Google Calendar to refresh.",!1}if(t.insufficientScope)return r.gsheetError="Sheets permission missing. Reconnect Google Calendar in Settings to grant Sheets access.",!1;if(t.error)return r.gsheetError=t.error,!1;r.gsheetData=t,localStorage.setItem(ss,JSON.stringify(t)),localStorage.setItem(dd,String(Date.now())),r.gsheetError=null;const n=localStorage.getItem(Fs),a=localStorage.getItem(Ur);return n&&a&&Qw(n),!0}catch(t){return r.gsheetError=t?.message||"Google Sheets sync failed.",!1}finally{r.gsheetSyncing=!1,window.render()}}function Ei(){try{const e=localStorage.getItem(ss);e&&(r.gsheetData=JSON.parse(e))}catch{}$e()&&(xs(),zo&&clearInterval(zo),zo=setInterval(()=>{$e()&&xs()},Jw))}function Xw(e){if(!e)return"";if(e.tabs&&e.tabs.length>0){const t=[];for(const n of e.tabs){const a=[];a.push(`=== ${n.name} ===`),n.headers&&n.headers.length>0&&a.push(n.headers.join("	"));for(const s of n.rows||[]){const o=s.map(i=>String(i??""));o.every(i=>!i.trim())||a.push(o.join("	"))}t.push(a.join(`
`))}return t.join(`

`)}return e.rows&&e.rows.length>0?e.rows.map(t=>`${t.label}: ${t.value||"(empty)"}`).join(`
`):""}async function hf(e){const t=localStorage.getItem(Ur)||"";if(!t)throw new Error("No API key configured");let n=r.gsheetData;if(!n||!n.tabs&&!n.rows){if(!await xs())throw new Error(r.gsheetError||"Failed to fetch sheet data");n=r.gsheetData}if(!n)throw new Error("No sheet data available");const a=Xw(n);if(!a)throw new Error("No sheet data to analyze");const s=n.tabs?n.tabs.length:1,o=n.tabs?n.tabs.map(v=>v.name).join(", "):n.tabName||"Sheet",i=new AbortController,l=setTimeout(()=>i.abort(),3e4),d=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":t,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-opus-4-6",max_tokens:1024,system:`You are a concise personal assistant. The user has a spreadsheet with ${s} tab(s): ${o}. Here is ALL the data:

${a}

Answer the user's question about this data. Be brief and direct. Return your response as clean HTML for display in a widget. Use simple inline styles for visual clarity. Allowed tags: <div>, <span>, <strong>, <em>, <br>, <ul>, <ol>, <li>, <table>, <tr>, <td>, <th>. Use compact styling. Do NOT wrap in <html>, <body>, or <head> tags. Do NOT use markdown.`,messages:[{role:"user",content:e}]}),signal:i.signal});if(clearTimeout(l),!d.ok){const v=await d.text().catch(()=>"");throw new Error(`API error ${d.status}: ${v}`)}const h=(await d.json())?.content?.[0]?.text||"";if(!h)throw new Error("Empty response from AI");return h}async function Qw(e){r.gsheetAsking=!0,r.gsheetResponse=null,typeof window.render=="function"&&window.render();try{const t=await hf(e);r.gsheetResponse=t,localStorage.setItem(Hs,t)}catch(t){r.gsheetResponse=`Error: ${t.message||"Auto-run failed"}`}finally{r.gsheetAsking=!1,typeof window.render=="function"&&window.render()}}function mf(){try{const e=localStorage.getItem(gc);e&&(r.weatherLocation=JSON.parse(e))}catch(e){console.error("Error loading weather location:",e)}}function gf(){localStorage.setItem(gc,JSON.stringify(r.weatherLocation))}async function Qa(){try{const e=localStorage.getItem(Eo);if(e)try{const{data:x,timestamp:k}=JSON.parse(e);if(x&&k&&Date.now()-k<1800*1e3){r.weatherData=x;return}}catch(x){console.warn("Corrupted weather cache, clearing:",x),localStorage.removeItem(Eo)}const t=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${r.weatherLocation.lat}&longitude=${r.weatherLocation.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m&timezone=auto&forecast_days=2`);if(!t.ok)throw new Error("Weather fetch failed");const n=await t.json(),a=n.hourly.temperature_2m,s=n.hourly.time;let o=0,i=0;for(let x=0;x<a.length;x++)a[x]>a[o]&&(o=x),a[x]<a[i]&&(i=x);const l=new Date(s[o]).getHours(),d=new Date(s[i]).getHours(),c=x=>x===0?"12am":x<12?x+"am":x===12?"12pm":x-12+"pm",h=Math.round(n.daily.temperature_2m_max[1]),v=Math.round(n.daily.temperature_2m_min[1]),f=n.daily.weather_code[1],p=Math.round(n.daily.temperature_2m_max[0]),m=Math.round(n.daily.temperature_2m_min[0]),g=h-p,y=v-m,u=Math.round((g+y)/2);r.weatherData={temp:Math.round(n.current.temperature_2m),humidity:n.current.relative_humidity_2m,weatherCode:n.current.weather_code,windSpeed:Math.round(n.current.wind_speed_10m),tempMax:p,tempMin:m,maxHour:c(l),minHour:c(d),city:r.weatherLocation.city,tomorrow:{tempMax:h,tempMin:v,weatherCode:f,maxDelta:g,minDelta:y,avgDelta:u}},localStorage.setItem(Eo,JSON.stringify({data:r.weatherData,timestamp:Date.now()})),window.render()}catch(e){console.error("Weather fetch error:",e),window.render()}}function vf(){"geolocation"in navigator?navigator.geolocation.getCurrentPosition(async e=>{const{latitude:t,longitude:n}=e.coords;try{const s=await(await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${t}&longitude=${n}&current=temperature_2m&timezone=auto`)).json(),o=s.timezone?s.timezone.split("/").pop().replace(/_/g," "):"Your Location";r.weatherLocation={lat:t,lon:n,city:o},gf(),Qa()}catch(a){console.error("Geocode error:",a)}},e=>{console.log("Geolocation denied, using default location"),Qa()},{timeout:5e3}):Qa()}function bf(){mf(),vf()}function Sa(e){if(!e&&e!==0)return{onTime:0,late:0};const t=parseFloat(e)||0,n=Math.floor(t),a=Math.round((t-n)*10);return{onTime:n,late:a}}function Zw(e){const{onTime:t,late:n}=Sa(e);return t*r.WEIGHTS.prayer.onTime+n*r.WEIGHTS.prayer.late}let Za=null,Zd=-1;function it(){r.scoresCache.clear(),r.scoresCacheVersion++,Za=null}function e1(e){return JSON.stringify(e)}function He(e){const t=r.WEIGHTS,n=e1(e);if(r.scoresCache.has(n))return r.scoresCache.get(n);(!e||typeof e!="object")&&(e=JSON.parse(JSON.stringify(ot)));const a=e.prayers||{},s=e.glucose||{},o=e.whoop||{},i=e.family||{},l=e.habits||{};let d=0,c=0,h=0;["fajr","dhuhr","asr","maghrib","isha"].forEach(ce=>{const{onTime:fe,late:ge}=Sa(a[ce]);c+=fe,h+=ge,d+=fe*t.prayer.onTime+ge*t.prayer.late});const v=parseInt(a.quran)||0;d+=v*t.prayer.quran;let f=0;const p=parseFloat(s.avg)||0,m=parseFloat(s.tir)||0,g=parseFloat(s.insulin)||0;if(s.avg!==""&&s.avg!==void 0){const fe=t.glucose.avgMax||20;if(p>=70&&p<=140){const ge=Math.abs(p-105);f+=fe*(1-ge/35*.5)}else if(p>140&&p<=180){const ge=fe*.5,de=(p-140)*(ge/40);f+=Math.max(0,ge-de)}}if(s.tir!==""&&s.tir!==void 0&&m>0){const ce=t.glucose.tirPerPoint||.3;f+=m*ce}const y=t.glucose&&t.glucose.insulinThreshold||40;s.insulin!==""&&s.insulin!==void 0&&g>0&&(g<=y?f+=t.glucose.insulinBase:f+=t.glucose.insulinPenalty);let u=0;const x=o,k=t.whoop,E=parseFloat(x.sleepPerf)||0;x.sleepPerf!==""&&x.sleepPerf!==void 0&&(E>=90?u+=k.sleepPerfHigh:E>=70?u+=k.sleepPerfMid:E>=50&&(u+=k.sleepPerfLow));const D=parseFloat(x.recovery)||0;x.recovery!==""&&x.recovery!==void 0&&(D>=66?u+=k.recoveryHigh:D>=50?u+=k.recoveryMid:D>=33&&(u+=k.recoveryLow));const R=parseFloat(x.strain)||0;if(x.strain!==""&&x.strain!==void 0&&x.recovery!==""&&x.recovery!==void 0){let ce=!1;(D>=66&&R>=14||D>=33&&D<66&&R>=10&&R<14||D<33&&R<10)&&(ce=!0),ce&&(u+=k.strainMatch||10),D>=66&&R>=18&&(u+=k.strainHigh||5)}let _=0;Object.entries(i).forEach(([ce,fe])=>{fe&&(_+=t.family[ce]||0)});let N=0;N+=(parseInt(l.exercise)||0)*t.habits.exercise,N+=(parseInt(l.reading)||0)*t.habits.reading,N+=(parseInt(l.meditation)||0)*t.habits.meditation,N+=(parseFloat(l.water)||0)*t.habits.water,N+=l.vitamins?t.habits.vitamins:0,N+=(parseInt(l.brushTeeth)||0)*t.habits.brushTeeth;const L=l.nop;L!==""&&L!==null&&L!==void 0&&(parseInt(L)===1?N+=t.habits.nopYes||5:parseInt(L)===0&&(N+=t.habits.nopNo||-3));const W=d,z=Math.round(f*10)/10,S=Math.round(u*10)/10,O=_,w=N,j=Math.round((d+f+u+_+N)*10)/10,ee=Math.max(r.MAX_SCORES?.prayer||35,1),C=Math.max(r.MAX_SCORES?.diabetes||25,1),Z=Math.max(r.MAX_SCORES?.whoop||14,1),G=Math.max(r.MAX_SCORES?.family||6,1),J=Math.max(r.MAX_SCORES?.habits||16,1),P=Math.max(0,Math.min(1,W/ee)),I=Math.max(0,Math.min(1,z/C)),q=Math.max(0,Math.min(1,S/Z)),F=Math.max(0,Math.min(1,O/G)),V=Math.max(0,Math.min(1,w/J)),te=r.CATEGORY_WEIGHTS||Xi,ue=(te.prayer||0)+(te.diabetes||0)+(te.whoop||0)+(te.family||0)+(te.habits||0),re=ue>0?(P*(te.prayer||0)+I*(te.diabetes||0)+q*(te.whoop||0)+F*(te.family||0)+V*(te.habits||0))/ue:0,ae={prayer:W,prayerOnTime:c,prayerLate:h,diabetes:z,whoop:S,family:O,habit:w,total:j,normalized:{prayer:P,diabetes:I,whoop:q,family:F,habits:V,overall:Math.max(0,Math.min(1,re))}};return r.scoresCache.size>500&&r.scoresCache.clear(),r.scoresCache.set(n,ae),ae}function t1(e){e=Math.max(1,parseInt(e)||30);const t=[];for(let n=e-1;n>=0;n--){const a=new Date;a.setDate(a.getDate()-n);const s=he(a),o=r.allData[s]||ot,i=He(o);t.push({date:s,day:a.getDate(),month:a.toLocaleDateString("en-US",{month:"short"}),label:a.toLocaleDateString("en-US",{month:"short",day:"numeric"}),...i})}return t}function n1(){return t1(30)}function r1(e){e=Math.max(1,parseInt(e)||30);let t={totalScore:0,daysLogged:0,totalOnTimePrayers:0,totalLatePrayers:0,totalFamilyCheckins:0,avgRHR:0,avgSleep:0,rhrCount:0,sleepCount:0};for(let n=e-1;n>=0;n--){const a=new Date;a.setDate(a.getDate()-n);const s=he(a);if(r.allData[s]){t.daysLogged++;const o=r.allData[s],i=He(o);t.totalScore+=i.total,t.totalOnTimePrayers+=i.prayerOnTime,t.totalLatePrayers+=i.prayerLate,t.totalFamilyCheckins+=Object.values(o.family).filter(Boolean).length,o.whoop.rhr&&(t.avgRHR+=parseFloat(o.whoop.rhr),t.rhrCount++),o.whoop.sleepHours&&(t.avgSleep+=parseFloat(o.whoop.sleepHours),t.sleepCount++)}}return t.totalScore=Math.round(t.totalScore),t.avgRHR=t.rhrCount?Math.round(t.avgRHR/t.rhrCount):0,t.avgSleep=t.sleepCount?(t.avgSleep/t.sleepCount).toFixed(1):0,t.avgDaily=t.daysLogged?Math.round(t.totalScore/t.daysLogged):0,t}function a1(){return r1(30)}function s1(){const e=Object.keys(r.allData).sort();if(e.length===0)return null;let t={highestDayScore:{value:0,date:null},highestWeekScore:{value:0,weekStart:null},longestStreak:{value:0,endDate:null},currentStreak:0,bestPrayerDay:{value:0,date:null},bestWhoopDay:{value:0,date:null},mostQuranPages:{value:0,date:null},perfectPrayerDays:0,totalDaysLogged:e.length},n=0,a=null;const s={};e.forEach(l=>{const d=r.allData[l]||{},c=d.prayers||{},h=He(d);h.total>t.highestDayScore.value&&(t.highestDayScore={value:h.total,date:l}),h.prayer>t.bestPrayerDay.value&&(t.bestPrayerDay={value:h.prayer,date:l}),h.whoop>t.bestWhoopDay.value&&(t.bestWhoopDay={value:h.whoop,date:l});const v=parseInt(c.quran)||0;v>t.mostQuranPages.value&&(t.mostQuranPages={value:v,date:l});let f=0;if(["fajr","dhuhr","asr","maghrib","isha"].forEach(g=>{const{onTime:y}=Sa(c[g]);y>=1&&f++}),f===5&&t.perfectPrayerDays++,a){const g=new Date(a),y=new Date(l);Math.round((y-g)/(1e3*60*60*24))===1?n++:n=1}else n=1;n>t.longestStreak.value&&(t.longestStreak={value:n,endDate:l}),a=l;const p=new Date(l),m=he(new Date(p.setDate(p.getDate()-p.getDay())));s[m]||(s[m]=0),s[m]+=h.total});const o=he(),i=he(new Date(Date.now()-864e5));return(a===o||a===i)&&(t.currentStreak=n),Object.entries(s).forEach(([l,d])=>{d>t.highestWeekScore.value&&(t.highestWeekScore={value:Math.round(d),weekStart:l})}),t}function oo(){r.WEIGHTS._updatedAt=new Date().toISOString(),localStorage.setItem(Wr,JSON.stringify(r.WEIGHTS))}function yf(){r.MAX_SCORES._updatedAt=new Date().toISOString(),localStorage.setItem(sa,JSON.stringify(r.MAX_SCORES))}function o1(e,t,n){t?r.WEIGHTS[e][t]=parseFloat(n)||0:r.WEIGHTS[e]=parseFloat(n)||0,oo(),it(),window.debouncedSaveToGithub(),window.render()}function i1(){r.WEIGHTS=JSON.parse(JSON.stringify(Dr)),oo(),it(),window.debouncedSaveToGithub(),window.render()}function l1(e,t){r.MAX_SCORES[e]=parseFloat(t)||0,yf(),it(),window.debouncedSaveToGithub(),window.render()}function d1(){r.MAX_SCORES=JSON.parse(JSON.stringify(_r)),yf(),it(),window.debouncedSaveToGithub(),window.render()}function c1(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]/g,"")||"member"}function u1(e){const t=new Set((r.familyMembers||[]).map(a=>a.id));if(!t.has(e))return e;let n=1;for(;t.has(e+n);)n++;return e+n}function f1(e){const t=String(e||"").trim();if(!t)return;const n=c1(t),a=u1(n);r.familyMembers.push({id:a,name:t}),r.WEIGHTS.family||(r.WEIGHTS.family={}),r.WEIGHTS.family[a]===void 0&&(r.WEIGHTS.family[a]=1),nl(),oo(),it(),r.MAX_SCORES.family=Math.max(r.MAX_SCORES.family||6,r.familyMembers.length),window.debouncedSaveToGithub(),window.render()}function p1(e){r.familyMembers=r.familyMembers.filter(t=>t.id!==e),r.WEIGHTS.family&&r.WEIGHTS.family[e]!==void 0&&delete r.WEIGHTS.family[e],nl(),oo(),it(),r.MAX_SCORES.family=Math.max(1,(r.familyMembers||[]).length),window.debouncedSaveToGithub(),window.render()}function h1(e,t){const n=r.familyMembers.find(s=>s.id===e);if(!n)return;const a=String(t||"").trim();a&&(n.name=a,nl(),it(),window.debouncedSaveToGithub(),window.render())}function m1(e){for(let t=Ma.length-1;t>=0;t--)if(e>=Ma[t].min)return Ma[t];return Ma[0]}function ks(e){for(let t=ds.length-1;t>=0;t--)if(e>=ds[t])return t+1;return 1}function wf(e){const t=ks(e),n=ds[t-1]||0,a=ds[t]||n+1e3,s=(e-n)/(a-n),o=cd.find(i=>t>=i.min&&t<=i.max)||cd[0];return{level:t,currentLevelXP:n,nextLevelXP:a,progress:Math.max(0,Math.min(1,s)),tierName:o.name,tierIcon:o.icon}}function es(e){for(let t=Do.length-1;t>=0;t--)if(e>=Do[t].min)return Do[t].multiplier;return 1}function $l(e,t){const n=Math.floor(e*100),a=Math.floor(n*(t-1));return{base:n,streakBonus:a,total:n+a}}function Dl(e,t){const n=r.streak;if(!(t>=Qi))return;if(!n.lastLoggedDate)n.current=1,n.lastLoggedDate=e,n.multiplier=es(1);else if(e===n.lastLoggedDate)n.multiplier=es(n.current);else{const o=new Date(n.lastLoggedDate),l=new Date(e).getTime()-o.getTime(),d=Math.round(l/(1e3*60*60*24));if(d===1?(n.current++,n.lastLoggedDate=e):d===2&&n.shield.available?(n.shield.available=!1,n.shield.lastUsed=n.lastLoggedDate,n.current++,n.lastLoggedDate=e):d>1&&(n.current=1,n.lastLoggedDate=e),d<=0)return}n.current>n.longest&&(n.longest=n.current),n.multiplier=es(n.current),new Date(e).getDay()===1&&n.shield.lastUsed!==e&&(n.shield.available=!0),Ml()}function xf(e,t){if(t<Qi)return{awarded:!1};if(r.xp.history.find(i=>i.date===e))return{awarded:!1};const a=ks(r.xp.total),s=$l(t,r.streak.multiplier);s.date=e,r.xp.total+=s.total,r.xp.history.push(s),r.xp.history.length>365&&(r.xp.history=r.xp.history.slice(-365));const o=ks(r.xp.total);return Al(),{awarded:!0,xpData:s,levelUp:o>a}}function _l(e,t){const n=[],a=wf(r.xp.total),s=Object.keys(r.allData).sort();let o=0,i=0,l=0,d=0;s.forEach(f=>{const p=r.allData[f];if(!p)return;const m=p.family||{};Object.values(m).some(y=>y)&&o++,i+=parseInt(p.prayers?.quran)||0;let g=0;["fajr","dhuhr","asr","maghrib","isha"].forEach(y=>{const{onTime:u}=Sa(p.prayers?.[y]);u>=1&&g++}),g===5?(l++,l>d&&(d=l)):l=0});const c=t?.normalized||{},h=c.prayer>=.6&&c.diabetes>=.6&&c.whoop>=.6&&c.family>=.6&&c.habits>=.6,v={streak:r.streak.current,prayerOnTime:t?.prayerOnTime||0,perfectPrayerStreak:d,overallPercent:c.overall||0,allCategoriesAbove60:h,totalFamilyDays:o,totalDaysLogged:s.length,totalQuranPages:i,level:a.level};return Dh.forEach(f=>{r.achievements.unlocked[f.id]||f.check(v)&&(r.achievements.unlocked[f.id]={date:e,notified:!1},n.push(f.id))}),n.length>0&&io(),n}function g1(e){r.achievements.unlocked[e]&&(r.achievements.unlocked[e].notified=!0,io())}function v1(){if(Za&&Zd===r.scoresCacheVersion)return Za;const e=new Date,t={prayer:0,diabetes:0,whoop:0,family:0,habits:0},n={prayer:0,diabetes:0,whoop:0,family:0,habits:0};for(let d=1;d<=7;d++){const c=new Date(e);c.setDate(c.getDate()-d);const h=he(c);if(r.allData[h]){const v=He(r.allData[h]);v.normalized&&Object.keys(t).forEach(f=>{const p=v.normalized[f]||0;t[f]+=p,n[f]++})}}if(Math.max(...Object.values(n))<3)return null;let s=null,o=1;if(Object.keys(t).forEach(d=>{if(n[d]<1)return;const c=t[d]/n[d];c<o&&(o=c,s=d)}),!s)return null;const l={category:s,displayName:{prayer:"Prayer",diabetes:"Glucose",whoop:"Recovery",family:"Family",habits:"Habits"}[s]||s,avgPercent:Math.round(o*100),tip:_h[s]||"Focus on improving this area."};return Za=l,Zd=r.scoresCacheVersion,l}function kf(e){const t=r.allData[e]||ot,n=He(t),a=n.normalized?.overall||0;Dl(e,a);const s=xf(e,a),o=_l(e,n);return window.debouncedSaveToGithub?.(),{xpResult:s,newAchievements:o}}function Al(){r.xp._updatedAt=new Date().toISOString(),localStorage.setItem(Ws,JSON.stringify(r.xp))}function Ml(){r.streak._updatedAt=new Date().toISOString(),localStorage.setItem(Us,JSON.stringify(r.streak))}function io(){r.achievements._updatedAt=new Date().toISOString(),localStorage.setItem(Gs,JSON.stringify(r.achievements))}function Pl(){r.CATEGORY_WEIGHTS._updatedAt=new Date().toISOString(),localStorage.setItem(Vs,JSON.stringify(r.CATEGORY_WEIGHTS))}function b1(e,t){r.CATEGORY_WEIGHTS[e]=parseFloat(t)||0,Pl(),it(),window.debouncedSaveToGithub(),window.render()}function y1(){r.CATEGORY_WEIGHTS=JSON.parse(JSON.stringify(Xi)),Pl(),it(),window.debouncedSaveToGithub(),window.render()}function Sf(){r.xp={total:0,history:[]},r.streak={current:0,longest:0,lastLoggedDate:null,shield:{available:!0,lastUsed:null},multiplier:1};const e=Object.keys(r.allData).sort();if(e.forEach(t=>{const n=r.allData[t];if(!n)return;const s=He(n).normalized?.overall||0;if(Dl(t,s),s>=Qi&&!r.xp.history.find(i=>i.date===t)){const i=$l(s,r.streak.multiplier);i.date=t,r.xp.total+=i.total,r.xp.history.push(i)}}),r.xp.history.length>365&&(r.xp.history=r.xp.history.slice(-365)),e.length>0){const t=e[e.length-1],n=He(r.allData[t]||ot);_l(t,n)}Al(),Ml(),io(),window.debouncedSaveToGithub?.()}function Ta(e,t,n){r.undoTimerId&&(clearInterval(r.undoTimerId),r.undoTimerId=null),r.undoAction={label:e,snapshot:t,restoreFn:n},r.undoTimerRemaining=5,r.undoTimerId=setInterval(()=>{r.undoTimerRemaining--;const a=document.getElementById("undo-countdown"),s=document.getElementById("undo-ring-circle");if(a&&(a.textContent=r.undoTimerRemaining),s){const o=r.undoTimerRemaining/5;s.style.strokeDashoffset=(1-o)*88}r.undoTimerRemaining<=0&&Tf()},1e3),window.render()}function w1(){if(!r.undoAction)return;const{snapshot:e,restoreFn:t}=r.undoAction;t(e),r.undoTimerId&&clearInterval(r.undoTimerId),r.undoAction=null,r.undoTimerRemaining=0,r.undoTimerId=null,window.render()}function Tf(){r.undoTimerId&&clearInterval(r.undoTimerId),r.undoAction=null,r.undoTimerRemaining=0,r.undoTimerId=null;const e=document.getElementById("undo-toast");e&&(e.classList.add("undo-fade-out"),setTimeout(()=>e.remove(),300))}function x1(){if(!r.undoAction)return"";const{label:e}=r.undoAction,t=r.undoTimerRemaining;return`
    <div id="undo-toast" class="undo-toast" role="alert" aria-live="polite" aria-atomic="true">
      <div class="undo-toast-inner">
        <div class="undo-countdown-ring">
          <svg viewBox="0 0 32 32" class="w-7 h-7">
            <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
            <circle id="undo-ring-circle" cx="16" cy="16" r="14" fill="none" stroke="white" stroke-width="2"
              stroke-dasharray="88" stroke-dashoffset="${(1-t/5)*88}"
              stroke-linecap="round" transform="rotate(-90 16 16)"
              style="transition: stroke-dashoffset 1s linear;"/>
          </svg>
          <span id="undo-countdown" class="undo-countdown-num">${t}</span>
        </div>
        <span class="undo-toast-label">${A(e)}</span>
        <button onclick="executeUndo()" class="undo-toast-btn">Undo</button>
        <button onclick="dismissUndo()" class="undo-toast-dismiss" aria-label="Dismiss">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
    </div>
  `}function gt(e,t){return String(e)===String(t)}function k1(e){return r.tasksData.findIndex(t=>gt(t.id,e))}function If(){localStorage.setItem(ar,JSON.stringify(r.deletedTaskTombstones||{}))}function S1(e){e&&((!r.deletedTaskTombstones||typeof r.deletedTaskTombstones!="object")&&(r.deletedTaskTombstones={}),r.deletedTaskTombstones[String(e)]=new Date().toISOString(),If())}function Cf(e){!e||!r.deletedTaskTombstones||typeof r.deletedTaskTombstones!="object"||r.deletedTaskTombstones[String(e)]!==void 0&&(delete r.deletedTaskTombstones[String(e)],If())}function gr(e,t={}){let n=t.status==="today"?"anytime":t.status||"inbox";const a=!!t.areaId,s=!!t.today;!t.isNote&&n==="inbox"&&(a||s)&&(n="anytime");const o={id:oa(),title:e,notes:t.notes||"",status:n,today:t.today||t.status==="today"||!1,flagged:t.flagged||!1,completed:!1,completedAt:null,areaId:t.areaId||t.categoryId&&rt(t.categoryId)?.areaId||null,categoryId:t.categoryId||null,labels:t.labels||[],people:t.people||[],deferDate:t.deferDate||null,dueDate:t.dueDate||null,repeat:t.repeat||null,isNote:t.isNote||!1,parentId:t.parentId||null,indent:t.indent||0,meetingEventKey:t.meetingEventKey||null,waitingFor:t.waitingFor||null,isProject:t.isProject||!1,projectId:t.projectId||null,projectType:t.projectType||"parallel",timeEstimate:t.timeEstimate||null,lastReviewedAt:null,order:(r.tasksData.filter(i=>!i.completed).length+1)*1e3,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};return Cf(o.id),r.tasksData.push(o),le(),!o.isNote&&(o.deferDate||o.dueDate)&&window.pushTaskToGCalIfConnected?.(o),navigator.vibrate&&navigator.vibrate(10),o}function Ia(e,t){const n=k1(e);if(n!==-1){const a=r.tasksData[n];t.status==="today"&&(t.status="anytime",t.today=!0),a.status==="inbox"&&t.areaId&&!a.areaId&&(t.status="anytime");const s=t.status??a.status,o=t.today??a.today;!a.isNote&&s==="inbox"&&o&&(t.status="anytime"),r.tasksData[n]={...a,...t,updatedAt:new Date().toISOString()},le();const i=r.tasksData[n];i.isNote||(i.deferDate||i.dueDate?window.pushTaskToGCalIfConnected?.(i):i.gcalEventId&&window.deleteGCalEventIfConnected?.(i))}}function T1(){let e=!1;r.tasksData.forEach(t=>{t.status==="today"&&(t.status="anytime",t.today=!0,e=!0),typeof t.today!="boolean"&&(t.today=!1,e=!0),typeof t.flagged!="boolean"&&(t.flagged=!1,e=!0)}),e&&le()}function Nn(e){const t=r.tasksData.find(n=>gt(n.id,e));t&&t.gcalEventId&&window.deleteGCalEventIfConnected?.(t),r.tasksData.forEach(n=>{gt(n.parentId,e)&&(n.parentId=null,n.indent=0)}),r.tasksData=r.tasksData.filter(n=>!gt(n.id,e)),S1(e),r.inlineEditingTaskId===e&&(r.inlineEditingTaskId=null),le()}function I1(e){r.inlineEditingTaskId=null;const t=r.tasksData.find(s=>gt(s.id,e));if(!t)return;const n=JSON.parse(JSON.stringify(t)),a=r.tasksData.filter(s=>gt(s.parentId,e)).map(s=>JSON.parse(JSON.stringify(s)));Nn(e),Ta(`"${n.title}" deleted`,{task:n,children:a},s=>{Cf(s.task.id),r.tasksData.push(s.task),s.children.forEach(o=>{const i=r.tasksData.find(l=>l.id===o.id);i&&(i.parentId=o.parentId,i.indent=o.indent)}),le()})}function C1(e){const t=r.tasksData.find(n=>gt(n.id,e));if(t){const n=t.completed;t.completed=!t.completed,navigator.vibrate&&navigator.vibrate(10),t.completedAt=t.completed?new Date().toISOString():null,t.updatedAt=new Date().toISOString();let a=null;if(t.repeat&&t.repeat.type!=="none"){if(t.completed)a=Ef(t),t._spawnedRepeatId=a?a.id:null;else if(n&&t._spawnedRepeatId){const s=r.tasksData.findIndex(o=>o.id===t._spawnedRepeatId);s!==-1&&r.tasksData.splice(s,1),t._spawnedRepeatId=null}}if(le(),t.completed){const s=document.querySelector(`.task-inline-title[data-task-id="${e}"]`)||document.querySelector(`[data-task-id="${e}"]`)||document.querySelector(`[data-note-id="${e}"]`),o=s?.closest(".task-item, .swipe-row, .note-item")||s;o?(o.classList.add("task-completing"),setTimeout(()=>window.render(),400)):window.render();const i={taskId:t.id,completed:!1,completedAt:null,updatedAt:t.updatedAt,_spawnedRepeatId:t._spawnedRepeatId};Ta(`"${t.title}" completed`,i,l=>{const d=r.tasksData.find(c=>gt(c.id,l.taskId));if(d){if(d.completed=!1,d.completedAt=null,d.updatedAt=new Date().toISOString(),l._spawnedRepeatId){const c=r.tasksData.findIndex(h=>h.id===l._spawnedRepeatId);c!==-1&&r.tasksData.splice(c,1),d._spawnedRepeatId=null}le()}})}else window.render();if(t.completed){if(t.gcalEventId){const s=t.gcalEventId,o=window.deleteGCalEventIfConnected?.(t);o&&o.then(()=>{const i=r.tasksData.find(l=>gt(l.id,e));i&&i.gcalEventId===s&&(i.gcalEventId=null,i.updatedAt=new Date().toISOString(),le(),window.render())}).catch(i=>{console.warn("GCal completion cleanup failed:",i)})}}else!t.gcalEventId&&(t.deferDate||t.dueDate)&&window.pushTaskToGCalIfConnected?.(t)}else console.warn("toggleTaskComplete: task not found",e)}function E1(e){const t=r.tasksData.find(n=>gt(n.id,e));t&&(t.flagged=!t.flagged,t.updatedAt=new Date().toISOString(),navigator.vibrate&&navigator.vibrate(10),le(),window.render())}function $i(e,t){const n=new Date(e),a=t.interval||1;switch(t.type){case"daily":n.setDate(n.getDate()+a);break;case"weekly":n.setDate(n.getDate()+7*a);break;case"monthly":n.setMonth(n.getMonth()+a);break;case"yearly":n.setFullYear(n.getFullYear()+a);break}return he(n)}function Ef(e){const t=he(),n=e.repeat.from==="due"&&e.dueDate?e.dueDate:t;let a=null,s=null;if(e.deferDate){const o=e.repeat.from==="due"&&e.deferDate?e.deferDate:t;a=$i(o,e.repeat)}return e.dueDate&&(s=$i(n,e.repeat)),gr(e.title,{notes:e.notes,status:e.status,today:e.today||!1,flagged:e.flagged||!1,areaId:e.areaId,categoryId:e.categoryId||null,labels:[...e.labels||[]],people:[...e.people||[]],deferDate:a,dueDate:s,repeat:{...e.repeat}})}function $f(e){return{daily:"day(s)",weekly:"week(s)",monthly:"month(s)",yearly:"year(s)"}[e]||"day(s)"}function $1(e){const t=document.getElementById("repeat-details"),n=document.getElementById("repeat-from-container"),a=document.getElementById("repeat-unit-label");!t||!n||(e==="none"?(t.style.display="none",n.style.display="none"):(t.style.display="flex",n.style.display="block",a&&(a.textContent=$f(e))))}function D1(e,t){Ia(e,{status:t}),window.render()}function lo(e){return r.tasksData.filter(t=>t.projectId===e)}function _1(e){const t=lo(e);if(t.length===0)return 0;const n=t.filter(a=>a.completed).length;return Math.round(n/t.length*100)}function A1(e){const t=r.tasksData.find(a=>a.id===e);return!t||t.projectType!=="sequential"?null:lo(e).sort((a,s)=>(a.order||0)-(s.order||0)).find(a=>!a.completed)||null}function M1(e){const t=lo(e);if(t.length===0)return!1;const n=new Date;return n.setDate(n.getDate()-30),!t.some(s=>s.completedAt&&new Date(s.completedAt)>n)}function Df(e,t=r.taskLabels){const n=t.find(a=>a.name.trim().toLowerCase()==="next");return!!(n&&(e.labels||[]).includes(n.id))}function P1(e){return e.status==="inbox"&&!e.areaId}function N1(e,t,n=r.taskLabels){if(e.deferDate&&e.deferDate>t)return!1;const a=e.dueDate===t,s=e.dueDate&&e.dueDate<t,o=e.deferDate===t;return e.today||a||s||o||Df(e,n)}function L1(e){return!!e.flagged}function O1(e,t){return!!(e.dueDate&&e.dueDate>t||e.deferDate&&e.deferDate>t)}function R1(e,t){return!(e.status!=="anytime"||e.dueDate&&e.dueDate>t||e.deferDate&&e.deferDate>t)}function B1(e){return e.status==="someday"}function j1(e,t,n=r.taskLabels){return Df(e,n)?!0:!(e.status!=="anytime"||e.dueDate||e.deferDate&&e.deferDate>t)}function F1(e){return!!e.waitingFor}function H1(e){return e.isProject===!0}function z1(e,t="both"){return Array.isArray(e)?t==="tasks"?e.filter(n=>!n?.isNote):t==="notes"?e.filter(n=>!!n?.isNote&&n?.noteLifecycleState!=="deleted"):e:[]}function Di(){let e=!1;r.tasksData.forEach((t,n)=>{t.order===void 0&&(t.order=(n+1)*1e3,e=!0)}),e&&le()}function _i(e){if(e==="calendar"&&(e="inbox"),e==="notes")return r.tasksData.filter(o=>o.isNote&&!o.completed&&o.noteLifecycleState!=="deleted").sort((o,i)=>new Date(i.createdAt)-new Date(o.createdAt));const n=[...Ue,...r.customPerspectives].find(o=>o.id===e);if(!n)return[];const a=he(),s=!n.builtin;return r.tasksData.filter(o=>{if(o.isNote&&o.noteLifecycleState==="deleted")return!1;const l=(n.filter.availability||"")==="completed";if(o.isNote&&!l&&!n.filter.completed)return!1;if(n.filter.completed)return o.completed;if(l){if(!o.completed)return!1}else if(o.completed)return!1;if(e==="today")return N1(o,a);if(e==="upcoming")return O1(o,a);if(e==="anytime")return R1(o,a);if(e==="someday")return B1(o);if(e==="next")return j1(o,a);if(e==="inbox")return P1(o);if(e==="flagged")return L1(o);if(e==="waiting")return F1(o);if(e==="projects")return H1(o);if(s){const d=n.filter||{},c=[];if(d.status&&(d.status==="today"?c.push(!!o.today):c.push(o.status===d.status)),d.categoryId&&c.push(o.areaId===d.categoryId),d.personId&&c.push((o.people||[]).includes(d.personId)),d.inboxOnly&&c.push(o.status==="inbox"&&!o.areaId),d.hasLabel&&c.push((o.labels||[]).some(p=>p===d.hasLabel)),d.labelIds&&d.labelIds.length>0){const m=(d.tagMatch||"any")==="all"?d.labelIds.every(g=>(o.labels||[]).includes(g)):(o.labels||[]).some(g=>d.labelIds.includes(g));c.push(m)}if(d.isUntagged&&c.push(!(o.labels||[]).length),d.hasDueDate&&c.push(!!o.dueDate),d.hasDeferDate&&c.push(!!o.deferDate),d.isRepeating&&c.push(!!(o.repeat&&o.repeat.type!=="none")),d.statusRule==="dueSoon"||d.dueSoon)if(!o.dueDate)c.push(!1);else{const p=new Date(o.dueDate+"T00:00:00"),m=new Date(a+"T00:00:00"),g=(p-m)/864e5;c.push(g>=0&&g<=7)}if((d.statusRule==="flagged"||d.flagged)&&c.push(!!o.flagged),d.availability){const p=!o.completed&&(!o.deferDate||o.deferDate<=a),m=!o.completed,g=d.availability==="available"||d.availability==="firstAvailable"?p:d.availability==="remaining"?m:d.availability==="completed"?o.completed:!0;c.push(g)}if(d.dateRange&&(d.dateRange.start||d.dateRange.end)){const p=d.dateRange.start||null,m=d.dateRange.end||null,g=d.dateRange.type||"either",y=[];(g==="due"||g==="either")&&y.push(o.dueDate),(g==="defer"||g==="either")&&y.push(o.deferDate);const u=y.some(x=>!(!x||p&&x<p||m&&x>m));c.push(u)}if(d.searchTerms){const p=d.searchTerms.toLowerCase(),m=`${o.title||""} ${o.notes||""}`.toLowerCase();c.push(m.includes(p))}if(c.length===0)return!0;const f=d.logic||"all";return f==="any"?c.some(Boolean):f==="none"?c.every(p=>!p):c.every(Boolean)}return!0}).sort((o,i)=>o.order!==void 0&&i.order!==void 0?o.order-i.order:o.dueDate&&!i.dueDate?-1:!o.dueDate&&i.dueDate?1:o.dueDate&&i.dueDate&&o.dueDate!==i.dueDate?new Date(o.dueDate)-new Date(i.dueDate):e==="inbox"?new Date(i.createdAt)-new Date(o.createdAt):new Date(o.createdAt)-new Date(i.createdAt))}function W1(e){const t={},n=new Date;n.setHours(0,0,0,0);const a=n.toISOString().slice(0,10);return e.forEach(s=>{s.dueDate&&s.dueDate>=a&&(t[s.dueDate]||(t[s.dueDate]={due:[],defer:[]}),t[s.dueDate].due.push(s)),s.deferDate&&s.deferDate>=a&&s.deferDate!==s.dueDate&&(t[s.deferDate]||(t[s.deferDate]={due:[],defer:[]}),t[s.deferDate].defer.push(s))}),Object.keys(t).sort().map(s=>{const o=new Date(s+"T00:00:00"),i=Math.round((o-n)/(1e3*60*60*24));let l;return i===0?l="Today":i===1?l="Tomorrow":i<7?l=o.toLocaleDateString("en-US",{weekday:"long"}):l=o.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}),{date:s,label:l,dueTasks:t[s].due,deferTasks:t[s].defer}})}function U1(e){const t={},n=new Date;return n.setHours(0,0,0,0),e.forEach(a=>{if(!a.completedAt)return;const s=a.completedAt.split("T")[0];t[s]||(t[s]=[]),t[s].push(a)}),Object.keys(t).sort().reverse().map(a=>{const s=new Date(a+"T00:00:00"),o=Math.round((n-s)/(1e3*60*60*24));let i;return o===0?i="Today":o===1?i="Yesterday":o<7?i=s.toLocaleDateString("en-US",{weekday:"long"}):i=s.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}),{date:a,label:i,tasks:t[a]}})}function _f(e){return r.tasksData.filter(t=>!(t.areaId!==e||t.completed)).sort((t,n)=>t.dueDate&&!n.dueDate?-1:!t.dueDate&&n.dueDate?1:t.dueDate&&n.dueDate?new Date(t.dueDate)-new Date(n.dueDate):new Date(t.createdAt)-new Date(n.createdAt))}function Af(e){return r.tasksData.filter(t=>!(!(t.labels||[]).includes(e)||t.completed)).sort((t,n)=>t.dueDate&&!n.dueDate?-1:!t.dueDate&&n.dueDate?1:t.dueDate&&n.dueDate?new Date(t.dueDate)-new Date(n.dueDate):new Date(t.createdAt)-new Date(n.createdAt))}function Mf(e){return r.tasksData.filter(t=>!(t.categoryId!==e||t.completed)).sort((t,n)=>t.dueDate&&!n.dueDate?-1:!t.dueDate&&n.dueDate?1:t.dueDate&&n.dueDate?new Date(t.dueDate)-new Date(n.dueDate):new Date(t.createdAt)-new Date(n.createdAt))}function G1(){if(r.activeFilterType==="perspective"&&r.activePerspective==="notes")return _i("notes");let e;return r.activeFilterType==="area"&&r.activeAreaFilter?e=_f(r.activeAreaFilter):r.activeFilterType==="label"&&r.activeLabelFilter?e=Af(r.activeLabelFilter):r.activeFilterType==="person"&&r.activePersonFilter?e=il(r.activePersonFilter):r.activeFilterType==="subcategory"&&r.activeCategoryFilter?e=Mf(r.activeCategoryFilter):e=_i(r.activePerspective),z1(e,r.workspaceContentMode||"both")}function V1(){if(r.activeFilterType==="area"&&r.activeAreaFilter){const e=et(r.activeAreaFilter);return{icon:"🗂️",name:e?.name||"Area",color:e?.color}}else if(r.activeFilterType==="label"&&r.activeLabelFilter){const e=ua(r.activeLabelFilter);return{icon:"🏷️",name:e?.name||"Tag",color:e?.color}}else if(r.activeFilterType==="person"&&r.activePersonFilter){const e=pa(r.activePersonFilter);return{icon:"👤",name:e?.name||"Person",color:e?.color,email:e?.email||"",jobTitle:e?.jobTitle||""}}else if(r.activeFilterType==="subcategory"&&r.activeCategoryFilter){const e=rt(r.activeCategoryFilter),t=e?et(e.areaId):null;return{icon:"📂",name:e?.name||"Category",color:e?.color,parentArea:t?.name}}else{const t=[...Ue,...r.customPerspectives].find(n=>n.id===r.activePerspective)||Ue[0];return{icon:t.icon,name:t.name}}}let Ce=null,Te=0,Se=null,bn=-1,pt=null;const ec=60;function qe(e){return!!e?.isNote||e?.noteLifecycleState==="active"}function Xt(e){return e?.noteLifecycleState==="deleted"}function ke(e){return qe(e)&&!e.completed&&!Xt(e)}function Pf(e){return r.tasksData.find(t=>t.id===e&&qe(t))}function Le(e){return r.tasksData.find(t=>t.id===e&&ke(t))}function co(e,t,n={}){qe(e)&&(Array.isArray(e.noteHistory)||(e.noteHistory=[]),e.noteHistory.push({id:`nh_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,action:t,at:new Date().toISOString(),details:n}),e.noteHistory.length>ec&&(e.noteHistory=e.noteHistory.slice(-ec)))}function uo(e){if(!qe(e))return!1;let t=!1;return e.noteLifecycleState!=="active"&&e.noteLifecycleState!=="deleted"&&(e.noteLifecycleState="active",t=!0),Array.isArray(e.noteHistory)||(e.noteHistory=[],t=!0),t}function ze(e,t,n={}){uo(e),co(e,t,n),e.updatedAt=new Date().toISOString()}function at(){typeof window.debouncedSaveToGithub=="function"&&window.debouncedSaveToGithub()}function fo(e){const t=window.getSelection();if(!t.rangeCount)return 0;const n=t.getRangeAt(0),a=n.cloneRange();return a.selectNodeContents(e),a.setEnd(n.startContainer,n.startOffset),a.toString().length}function q1(e,t){const n=document.createRange(),a=window.getSelection();let s=0;const o=i=>{if(i.nodeType===Node.TEXT_NODE){const l=s+i.length;if(t<=l)return n.setStart(i,t-s),n.collapse(!0),!0;s=l}else for(const l of i.childNodes)if(o(l))return!0;return!1};o(e)||(n.selectNodeContents(e),n.collapse(!1)),a.removeAllRanges(),a.addRange(n)}function Br(e){const t=pt?r.tasksData.find(n=>n.id===pt&&ke(n)):null;if(Se==="#"){const n=r.taskAreas.map(s=>({...s,_acType:"area"})),a=(r.taskCategories||[]).map(s=>({...s,_acType:"category"}));return[...n,...a]}if(Se==="@"){const n=t?.labels||[];return r.taskLabels.filter(a=>!n.includes(a.id))}if(Se==="&"){const n=t?.people||[];return r.taskPeople.filter(a=>!n.includes(a.id))}return Se==="!"?typeof window.parseDateQuery=="function"?window.parseDateQuery(e||""):[]:[]}function Nl(){return Se==="#"?e=>({...Ys(e,""),_acType:"area"}):Se==="@"?e=>{const t=["#ef4444","#f59e0b","#22c55e","#3b82f6","#8b5cf6","#ec4899"],n=t[Math.floor(Math.random()*t.length)];return ca(e,n)}:Se==="&"?e=>fa(e,""):null}function nr(e){const t=r.tasksData.find(c=>c.id===pt&&ke(c));if(!t){tt();return}const n=document.querySelector(`[data-note-id="${pt}"] .note-input`)||document.querySelector(".note-page-title");if(!n){tt();return}const a=n.textContent||"",s=fo(n),o=a.substring(0,bn),i=a.substring(s),l=o.trimEnd()+(o.trimEnd()?" ":"")+i.trimStart();n.textContent=l;const d=(o.trimEnd()+(o.trimEnd()?" ":"")).length;q1(n,d),Se==="#"?e._acType==="category"?(e.areaId&&(t.areaId=e.areaId),t.categoryId=e.id):t.areaId=e.id:Se==="@"?(t.labels||(t.labels=[]),t.labels.includes(e.id)||t.labels.push(e.id)):Se==="&"?(t.people||(t.people=[]),t.people.includes(e.id)||t.people.push(e.id)):Se==="!"&&(t.deferDate=e.date),ze(t,"updated",{field:"metadata"}),le(),at(),tt(),n.focus(),Y1(pt||t.id,t),J1(pt||t.id,t)}function tt(){Ce&&Ce.parentNode&&Ce.parentNode.removeChild(Ce),Ce=null,Se=null,bn=-1,Te=0}function yn(e,t,n){Ce||(Ce=document.createElement("div"),Ce.className="inline-autocomplete-popup",Ce.addEventListener("mousedown",p=>p.preventDefault()),document.body.appendChild(Ce));const a=n.getBoundingClientRect(),s=window.innerHeight-a.bottom;Ce.style.left=Math.min(a.left,window.innerWidth-310)+"px",Ce.style.width=Math.min(a.width+40,300)+"px",s>240?(Ce.style.top=a.bottom+4+"px",Ce.style.bottom="auto"):(Ce.style.bottom=window.innerHeight-a.top+4+"px",Ce.style.top="auto");const o=Se==="!",i=o?e:e.filter(p=>p.name.toLowerCase().includes(t.toLowerCase())),l=o?!0:e.some(p=>p.name.toLowerCase()===t.toLowerCase()),d=!o&&t.length>0&&!l,c=i.length+(d?1:0);if(c===0){tt();return}Te>=c&&(Te=c-1),Te<0&&(Te=0);const h=Se==="#"?"Area":Se==="@"?"Tag":Se==="!"?"Date":"Person";let v="";if(i.forEach((p,m)=>{const g=m===Te?" active":"";let y;if(o)y='<span class="ac-icon" style="background:#8b5cf620;color:#8b5cf6"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg></span>';else if(Se==="#"){const k=oe(p.color),E=p.emoji?A(p.emoji):'<svg style="width:14px;height:14px" viewBox="0 0 24 24" fill="currentColor"><path d="M2 6a2 2 0 012-2h5.586a1 1 0 01.707.293L12 6h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" opacity="0.35"/><rect x="2" y="9" width="20" height="11" rx="2"/></svg>';y=`<span class="ac-icon" style="background:${k}20;color:${k}">${E}</span>`}else if(Se==="@")y=`<span class="w-3 h-3 rounded-full inline-block flex-shrink-0" style="background:${oe(p.color)}"></span>`;else{const k=oe(p.color);y=`<span class="ac-icon" style="background:${k}20;color:${k}">👤</span>`}const u=o?`<span style="margin-left:auto;font-size:11px;color:var(--text-muted)">${Ne(p.date)}</span>`:"";let x=A(p.name);if(Se==="#"&&p._acType==="category"&&p.areaId){const k=r.taskAreas.find(E=>E.id===p.areaId);k&&(x+=`<span style="margin-left:6px;font-size:11px;color:var(--text-muted)">${A(k.name)}</span>`)}v+=`<div class="inline-ac-option${g}" data-idx="${m}" style="${o?"justify-content:space-between":""}">${y}<span>${x}</span>${u}</div>`}),d){const p=i.length;v+=`<div class="inline-ac-create${Te===p?" active":""}" data-idx="${p}">+ Create ${h} "${A(t)}"</div>`}Ce.innerHTML=v,Ce.querySelectorAll(".inline-ac-option").forEach(p=>{p.addEventListener("click",()=>nr(i[parseInt(p.dataset.idx)]))});const f=Ce.querySelector(".inline-ac-create");f&&f.addEventListener("click",()=>{const p=Nl();if(p){const m=p(t);nr(m)}})}function Nf(e){const t=e.textContent||"",n=fo(e);for(let a=n-1;a>=0;a--){const s=t[a];if(s===`
`){tt();return}if(s===" "){for(let o=a-1;o>=0;o--){const i=t[o];if(i===`
`||i==="#"||i==="@"||i==="&")break;if(i==="!"&&(o===0||t[o-1]===" ")){Se="!",bn=o;const l=t.substring(o+1,n),d=Br(l);Te=0,yn(d,l,e);return}}tt();return}if((s==="#"||s==="@"||s==="&")&&(a===0||t[a-1]===" ")){Se=s,bn=a;const o=t.substring(a+1,n),i=Br(o);Te=0,yn(i,o,e);return}if(s==="!"&&(a===0||t[a-1]===" ")){Se="!",bn=a;const o=t.substring(a+1,n),i=Br(o);Te=0,yn(i,o,e);return}}tt()}function K1(e,t){if(e.target.classList.contains("note-page-description"))return;pt=t;const n=e.target;Nf(n)}function Y1(e,t){const n=document.querySelector(`[data-note-id="${e}"] .note-meta-chips`);n&&(n.innerHTML=Lf(t))}function J1(e,t){const n=document.querySelector(".note-page-meta");!n||r.zoomedNoteId!==e||(n.innerHTML=Hl(t))}function Lf(e){const t=[];if(e.areaId){const n=r.taskAreas.find(a=>a.id===e.areaId);n&&t.push(A(n.name))}if(e.categoryId){const n=r.taskCategories.find(a=>a.id===e.categoryId);n&&t.push(A(n.name))}return(e.labels||[]).forEach(n=>{const a=r.taskLabels.find(s=>s.id===n);a&&t.push(A(a.name))}),(e.people||[]).forEach(n=>{const a=r.taskPeople.find(s=>s.id===n);a&&t.push(A(a.name.split(" ")[0]))}),e.deferDate&&t.push(`Start ${Ne(e.deferDate)}`),t.length?t.join(" • "):""}function X1(e,t,n){const a=r.tasksData.find(s=>s.id===e&&ke(s));a&&(t==="category"?((r.taskCategories||[]).some(o=>o.id===n)||(a.areaId=null),a.categoryId=null):t==="label"?a.labels=(a.labels||[]).filter(s=>s!==n):t==="person"?a.people=(a.people||[]).filter(s=>s!==n):t==="deferDate"&&(a.deferDate=null),ze(a,"updated",{field:"metadata"}),le(),at(),window.render())}function vt(e,t){if(e.noteOrder!=null&&t.noteOrder!=null){if(e.noteOrder!==t.noteOrder)return e.noteOrder-t.noteOrder}else{if(e.noteOrder!=null)return-1;if(t.noteOrder!=null)return 1}const n=new Date(e.createdAt||0).getTime(),a=new Date(t.createdAt||0).getTime();if(n!==a)return n-a;const s=new Date(e.updatedAt||0).getTime(),o=new Date(t.updatedAt||0).getTime();return s!==o?s-o:String(e.id).localeCompare(String(t.id))}function Ai(){Ll();const e=r.tasksData.filter(a=>ke(a));if(!e.some(a=>a.noteOrder==null))return;const n=new Map;e.forEach(a=>{const s=a.parentId||"__root__";n.has(s)||n.set(s,[]),n.get(s).push(a)});for(const a of n.values())a.sort((s,o)=>{const i=new Date(s.createdAt||0).getTime(),l=new Date(o.createdAt||0).getTime();return i-l}),a.forEach((s,o)=>{s.noteOrder==null&&(s.noteOrder=(o+1)*1e3)});le()}function po(e){return e.length===0?1e3:Math.max(...e.map(n=>n.noteOrder||0))+1e3}function Ss(e,t){const n=e??0,a=t??n+2e3,s=a-n;return s<=1?(n+a)/2:n+Math.floor(s/2)}function Of(e){return e?typeof e=="string"?{areaId:e}:{...e}:{}}function Q1(e=null){const{areaId:t,labelId:n,personId:a,categoryId:s}=Of(e),o=r.tasksData.filter(i=>ke(i));return s?o.filter(i=>i.categoryId===s):t?o.filter(i=>i.areaId===t):n?o.filter(i=>(i.labels||[]).includes(n)):a?o.filter(i=>(i.people||[]).includes(a)):o}function Rf(e){const t=new Map;e.forEach(n=>{const a=n.parentId||"__root__";t.has(a)||t.set(a,[]),t.get(a).push(n)});for(const n of t.values())n.sort(vt);return t}function Bf(e=null){const t=Q1(e).slice().sort(vt),n=new Map(t.map(d=>[d.id,d])),a=t.map(d=>({...d,parentId:d.parentId&&n.has(d.parentId)?d.parentId:null})),s=Rf(a),o=[],i=new Set,l=(d,c)=>{(s.get(d)||[]).forEach(v=>{i.has(v.id)||(i.add(v.id),o.push({...v,indent:c}),l(v.id,c+1))})};return l("__root__",0),a.filter(d=>!i.has(d.id)).sort(vt).forEach(d=>{o.push({...d,parentId:null,indent:0})}),o}function jf(e=null){const t=Bf(e),n=Rf(t),a=[],s=r.zoomedNoteId||"__root__",o=r.zoomedNoteId?(t.find(l=>l.id===r.zoomedNoteId)?.indent||0)+1:0,i=(l,d)=>{(n.get(l)||[]).forEach(h=>{d||a.push({...h,indent:h.indent-o}),i(h.id,d||r.collapsedNotes.has(h.id))})};return i(s,!1),a}function Ff(e){return r.activeFilterType==="label"&&r.activeLabelFilter?{labelId:r.activeLabelFilter}:r.activeFilterType==="person"&&r.activePersonFilter?{personId:r.activePersonFilter}:r.activeFilterType==="subcategory"&&r.activeCategoryFilter?{categoryId:r.activeCategoryFilter}:r.activeAreaFilter||null||e?.areaId||null}function Wo(e){return jf(Ff(e))}function on(e=null){le(),at(),window.render(),e&&requestAnimationFrame(()=>setTimeout(()=>pn(e),30))}function Hf(e){const t=e.map(a=>String(a.id)).sort();let n=0;for(const a of t)for(let s=0;s<a.length;s++)n=(n<<5)-n+a.charCodeAt(s)|0;return`${t.length}:${Math.abs(n)}`}function Z1(){try{return JSON.parse(localStorage.getItem(xc)||"null")}catch{return null}}function e0(e){localStorage.setItem(xc,JSON.stringify(e))}function Ll(){let e=!1;return r.tasksData.forEach(t=>{qe(t)&&uo(t)&&(e=!0)}),e&&le(),e}function t0(e=100){return r.tasksData.filter(t=>qe(t)&&Xt(t)).sort((t,n)=>new Date(n.deletedAt||n.updatedAt||0).getTime()-new Date(t.deletedAt||t.updatedAt||0).getTime()).slice(0,e).map(t=>({id:t.id,title:t.title||"Untitled",deletedAt:t.deletedAt||t.updatedAt}))}function n0(e,t=!0){const n=Pf(e);if(!n||!Xt(n))return!1;const a=new Set([e]);if(t){const s=[e];for(;s.length;){const o=s.pop();r.tasksData.filter(i=>qe(i)&&i.parentId===o&&Xt(i)).forEach(i=>{a.add(i.id),s.push(i.id)})}}return r.tasksData.forEach(s=>{!a.has(s.id)||!qe(s)||(uo(s),s.noteLifecycleState="active",s.deletedAt=null,s.completed=!1,s.completedAt=null,ze(s,"restored",{includeChildren:t}))}),on(e),!0}function r0(e="",t=20){const n=String(e||"").trim().toLowerCase();return r.tasksData.filter(s=>qe(s)).filter(s=>!n||(s.title||"").toLowerCase().includes(n)||(s.notes||"").toLowerCase().includes(n)).sort((s,o)=>new Date(o.updatedAt||o.createdAt||0).getTime()-new Date(s.updatedAt||s.createdAt||0).getTime()).slice(0,t).map(s=>({id:s.id,title:s.title||"Untitled",state:Xt(s)?"deleted":s.completed?"completed":"active",updatedAt:s.updatedAt||s.createdAt||""}))}function a0(e=20){return r.tasksData.filter(t=>qe(t)).sort((t,n)=>new Date(n.updatedAt||n.createdAt||0).getTime()-new Date(t.updatedAt||t.createdAt||0).getTime()).slice(0,e).map(t=>({id:t.id,title:t.title||"Untitled",state:Xt(t)?"deleted":t.completed?"completed":"active",updatedAt:t.updatedAt||t.createdAt||"",lastAction:(t.noteHistory||[])[t.noteHistory.length-1]?.action||"updated"}))}function s0(){const e=r.tasksData.filter(n=>qe(n)),t={createdAt:new Date().toISOString(),noteCount:e.length,idsSignature:Hf(e),notes:e};return localStorage.setItem(xh,JSON.stringify(t)),{createdAt:t.createdAt,noteCount:t.noteCount}}function zf(e=""){const t=r.tasksData.filter(l=>qe(l)),n=t.filter(l=>ke(l)),a=t.filter(l=>Xt(l)),s=t.filter(l=>l.completed&&!Xt(l)),o={at:new Date().toISOString(),version:e||"",totalCount:t.length,activeCount:n.length,deletedCount:a.length,completedCount:s.length,idsSignature:Hf(t)},i=Z1();return i&&e&&i.activeCount>0&&i.activeCount-n.length>=Math.max(3,Math.ceil(i.activeCount*.3))&&(r.showCacheRefreshPrompt=!0,r.cacheRefreshPromptMessage=`Warning: active notes dropped from ${i.activeCount} to ${n.length}. Open Settings > Note Safety to search and restore.`),e0(o),o}function En(){localStorage.setItem(os,JSON.stringify([...r.collapsedNotes]))}function o0(e){r.collapsedNotes.has(e)?r.collapsedNotes.delete(e):r.collapsedNotes.add(e),En(),window.render()}function Wf(e=null){return Bf(e)}function ea(e){return r.tasksData.some(t=>ke(t)&&t.parentId===e)}function Uf(e){return r.tasksData.filter(t=>ke(t)&&t.parentId===e).sort(vt)}function Gf(e){let t=0;const n=new Set,a=s=>{if(n.has(s))return;n.add(s);const o=r.tasksData.filter(i=>ke(i)&&i.parentId===s);t+=o.length,o.forEach(i=>a(i.id))};return a(e),t}function Ol(e,t){let n=e;const a=new Set;for(;n;){if(a.has(n))return!1;a.add(n);const s=r.tasksData.find(o=>o.id===n&&ke(o));if(!s||!s.parentId)return!1;if(s.parentId===t)return!0;n=s.parentId}return!1}function ho(e){const t=[];let n=e;const a=new Set;for(;n&&!a.has(n);){a.add(n);const s=r.tasksData.find(i=>i.id===n&&ke(i));if(!s||!s.parentId)break;const o=r.tasksData.find(i=>i.id===s.parentId&&ke(i));if(!o)break;t.unshift({id:o.id,title:o.title||"Untitled"}),n=s.parentId}return t}function i0(e=null){const{areaId:t=null,labelId:n=null,personId:a=null,categoryId:s=null}=Of(e),o=r.tasksData.filter(l=>ke(l)&&!l.parentId&&(t?l.areaId===t:!0)).sort(vt);if(r.zoomedNoteId)return Yf(r.zoomedNoteId);const i={id:oa(),title:"",notes:"",status:"anytime",completed:!1,completedAt:null,areaId:t,categoryId:s,labels:n?[n]:[],people:a?[a]:[],deferDate:null,dueDate:null,repeat:null,isNote:!0,noteLifecycleState:"active",noteHistory:[],parentId:null,indent:0,noteOrder:po(o),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};co(i,"created",{source:"root"}),r.tasksData.push(i),on(i.id)}function Vf(e){const t=Le(e);if(!t)return;const n=Wf(Ff(t)),a=n.findIndex(d=>d.id===e);if(a<=0)return;const s=n[a-1],o=5,i=Math.min((s.indent||0)+1,o);if((t.indent||0)>=o||i===(t.indent||0)&&t.parentId===s.id)return;const l=r.tasksData.filter(d=>ke(d)&&d.parentId===s.id&&d.areaId===t.areaId).sort(vt);t.parentId=s.id,t.indent=i,t.noteOrder=po(l),ze(t,"updated",{field:"hierarchy",type:"indent"}),r.collapsedNotes.has(s.id)&&(r.collapsedNotes.delete(s.id),En()),on(e)}function qf(e){const t=Le(e);if(!t||(t.indent||0)<=0)return;const n=t.parentId?r.tasksData.find(l=>l.id===t.parentId&&ke(l)):null,a=n&&n.parentId||null,s=r.tasksData.filter(l=>ke(l)&&l.parentId===a&&l.areaId===t.areaId).sort(vt),o=n&&n.noteOrder||0,i=s.find(l=>(l.noteOrder||0)>o);t.noteOrder=Ss(o,i?i.noteOrder:null),t.parentId=a,t.indent=Math.max(0,(t.indent||0)-1),ze(t,"updated",{field:"hierarchy",type:"outdent"}),on(e)}function l0(e){const t=Le(e);if(!t)return;const n=r.tasksData.filter(l=>ke(l)&&l.parentId===t.parentId&&l.areaId===t.areaId).sort(vt),a=n.findIndex(l=>l.id===e),s=n[a+1],o=Ss(t.noteOrder,s?s.noteOrder:null),i={id:oa(),title:"",notes:"",status:"anytime",completed:!1,completedAt:null,areaId:t.areaId,categoryId:t.categoryId||null,labels:[],people:[],deferDate:null,dueDate:null,repeat:null,isNote:!0,noteLifecycleState:"active",noteHistory:[],parentId:t.parentId,indent:t.indent||0,noteOrder:o,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};co(i,"created",{source:"after",relatedTo:e}),r.tasksData.push(i),on(i.id)}function Kf(e){const t=Le(e);if(!t)return null;const n=Uf(e),a=n.length>0?po(n):1e3,s={id:oa(),title:"",notes:"",status:"anytime",completed:!1,completedAt:null,areaId:t.areaId,categoryId:t.categoryId||null,labels:[],people:[],deferDate:null,dueDate:null,repeat:null,isNote:!0,noteLifecycleState:"active",noteHistory:[],parentId:e,indent:Math.min((t.indent||0)+1,5),noteOrder:a,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};return co(s,"created",{source:"child",relatedTo:e}),r.collapsedNotes.has(e)&&(r.collapsedNotes.delete(e),En()),r.tasksData.push(s),s}function Yf(e){const t=Kf(e);t&&on(t.id)}function Rl(e,t=!1){const n=Le(e);if(!n)return;if(r.zoomedNoteId===e){const o=ho(e);r.zoomedNoteId=o.length>0?o[o.length-1].id:null,r.notesBreadcrumb=o.length>0?o.slice(0,-1):[]}const a=new Date().toISOString(),s=o=>{!o||!ke(o)||(uo(o),o.noteLifecycleState="deleted",o.deletedAt=a,o.completed=!0,o.completedAt=o.completedAt||a,ze(o,"deleted",{reason:"manual"}))};if(t){const o=[e],i=new Set;for(;o.length;){const l=o.pop();if(i.has(l))continue;i.add(l);const d=Le(l);d&&(s(d),r.tasksData.filter(c=>ke(c)&&c.parentId===l).forEach(c=>o.push(c.id)))}}else{const o=[],i=new Set,l=d=>{if(i.has(d))return;i.add(d),r.tasksData.filter(h=>ke(h)&&h.parentId===d).forEach(h=>{o.push(h),l(h.id)})};l(e),o.forEach(d=>{d.indent=Math.max(0,(d.indent||0)-1)}),o.filter(d=>d.parentId===e).forEach(d=>{d.parentId=n.parentId,ze(d,"reparented",{from:e,to:n.parentId||null})}),s(n)}r.collapsedNotes.delete(e),En(),on()}function Jf(e,t){const n=Le(e);if(!n)return;const a=new Set([e]),s=new Set,o=d=>{s.has(d)||(s.add(d),r.tasksData.filter(c=>ke(c)&&c.parentId===d).forEach(c=>{a.add(c.id),o(c.id)}))};o(e);const i=r.tasksData.filter(d=>a.has(d.id)).map(d=>JSON.parse(JSON.stringify(d))),l=r.collapsedNotes.has(e);Rl(e,!0),t&&setTimeout(()=>pn(t),60),Ta(`"${n.title||"Untitled"}" deleted`,{snapshot:i,wasCollapsed:l},d=>{d.snapshot.forEach(c=>{const h=Pf(c.id);h?Object.assign(h,c):r.tasksData.push(c)}),d.wasCollapsed&&r.collapsedNotes.add(e),le(),at()})}function Xf(e){const t=r.tasksData.find(i=>i.id===e&&(qe(i)||!i.isNote));if(!t)return;const n=JSON.parse(JSON.stringify(t)),a=t.isNote;let s=[];if(t.isNote){const i=r.tasksData.filter(l=>ke(l)&&l.parentId===e);i.length&&(s=i.map(l=>({id:l.id,parentId:l.parentId,indent:l.indent})),i.forEach(l=>{l.parentId=t.parentId||null,l.indent=Math.max(0,(l.indent||0)-1)})),t.isNote=!1,t.status=t.status||"anytime",t.noteLifecycleState="converted",t.order==null&&(t.order=t.noteOrder||Date.now())}else t.isNote=!0,t.noteLifecycleState="active",t.noteHistory||(t.noteHistory=[]),t.noteOrder==null&&(t.noteOrder=t.order||Date.now()),t.parentId==null&&(t.parentId=null),t.indent==null&&(t.indent=0),t.today=!1,t.flagged=!1;ze(t,"toggled",{from:a?"note":"task",to:a?"task":"note"}),le(),at(),Ta(a?"Converted to task":"Converted to note",{itemSnap:n,childSnaps:s},i=>{Object.assign(t,i.itemSnap),i.childSnaps&&i.childSnaps.length&&i.childSnaps.forEach(l=>{const d=r.tasksData.find(c=>c.id===l.id);d&&(d.parentId=l.parentId,d.indent=l.indent)}),le(),at()})}function Mi(e){const t=window.getSelection();if(!t.rangeCount)return!0;const n=t.getRangeAt(0);return n.collapsed&&n.startOffset===0&&(n.startContainer===e.firstChild||n.startContainer===e)}function Bl(e){const t=window.getSelection();if(!t.rangeCount)return!0;const n=t.getRangeAt(0),a=(e.textContent||"").length;return!!(n.collapsed&&n.startOffset===a||n.collapsed&&n.startContainer===e&&n.startOffset===e.childNodes.length)}function pn(e){const t=document.querySelector(`[data-note-id="${e}"] .note-input`);if(t){t.focus();const n=document.createRange(),a=window.getSelection();if(t.childNodes.length>0){const s=t.childNodes[t.childNodes.length-1];s.nodeType===Node.TEXT_NODE?n.setStart(s,s.length):n.setStartAfter(s)}else n.setStart(t,0);n.collapse(!0),a.removeAllRanges(),a.addRange(n)}}function d0(e,t){const n=Le(t);if(n){if(Ce){const a=e.target,s=a.textContent||"",o=fo(a),i=s.substring(bn+1,o),l=Se==="!",d=Br(i),c=l?d:d.filter(p=>p.name.toLowerCase().includes(i.toLowerCase())),h=l?!0:d.some(p=>p.name.toLowerCase()===i.toLowerCase()),v=!l&&i.length>0&&!h,f=c.length+(v?1:0);if(e.key==="ArrowDown"){e.preventDefault(),e.stopImmediatePropagation(),Te=(Te+1)%f,yn(d,i,a);return}else if(e.key==="ArrowUp"){e.preventDefault(),e.stopImmediatePropagation(),Te=(Te-1+f)%f,yn(d,i,a);return}else if(e.key==="Enter"||e.key==="Tab"){if(e.preventDefault(),e.stopImmediatePropagation(),pt=t,Te<c.length)nr(c[Te]);else if(v){const p=Nl();if(p){const m=p(i);nr(m)}}return}else if(e.key==="Escape"){e.preventDefault(),e.stopImmediatePropagation(),tt();return}}if(e.key==="Tab"){e.preventDefault(),e.shiftKey?qf(t):Vf(t);return}if(e.key==="Enter"&&e.shiftKey&&(e.metaKey||e.ctrlKey)){e.preventDefault(),Xf(t);return}if(e.key==="Enter"&&(e.metaKey||e.ctrlKey)){e.preventDefault(),Fl(t);return}if(e.key==="Backspace"&&(e.metaKey||e.ctrlKey)){e.preventDefault(),r.zoomedNoteId&&mo();return}if(e.key==="ArrowUp"&&(e.metaKey||e.ctrlKey)){e.preventDefault(),ea(t)&&!r.collapsedNotes.has(t)&&(r.collapsedNotes.add(t),En(),window.render(),setTimeout(()=>pn(t),30));return}if(e.key==="ArrowDown"&&(e.metaKey||e.ctrlKey)){e.preventDefault(),ea(t)&&r.collapsedNotes.has(t)&&(r.collapsedNotes.delete(t),En(),window.render(),setTimeout(()=>pn(t),30));return}if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();const s=e.target.textContent.trim();s!==(n.title||"")&&(n.title=s,ze(n,"updated",{field:"title"}));const o=Kf(t);if(o){le(),at(),window.render();let i=0;const l=()=>{const d=document.querySelector(`[data-note-id="${o.id}"] .note-input`);if(d){d.focus();const c=document.createRange(),h=window.getSelection();c.setStart(d,0),c.collapse(!0),h.removeAllRanges(),h.addRange(c)}else i<5&&(i++,setTimeout(l,50))};requestAnimationFrame(l)}return}if(e.key==="Backspace"&&e.target.textContent===""&&Mi(e.target)){e.preventDefault();const a=Wo(n),s=a.findIndex(i=>i.id===t),o=s>0?a[s-1].id:null;Jf(t,o);return}if(e.key==="ArrowUp"&&Mi(e.target)){e.preventDefault();const a=Wo(n),s=a.findIndex(o=>o.id===t);s>0?pn(a[s-1].id):s===0&&r.zoomedNoteId&&Ts(r.zoomedNoteId);return}if(e.key==="ArrowDown"&&Bl(e.target)){e.preventDefault();const a=Wo(n),s=a.findIndex(o=>o.id===t);s>=0&&s<a.length-1&&pn(a[s+1].id)}}}let jl;function c0(e,t){const n=Le(t);if(!n)return;jl=setTimeout(()=>tt(),150);const a=e.target.textContent.trim(),s=n.title||"";if(a===""&&!ea(t)&&!n.notes){Rl(t);return}a!==s&&(n.title=a,ze(n,"updated",{field:"title"}),le(),at()),r.editingNoteId===t&&(r.editingNoteId=null)}function u0(e,t){clearTimeout(jl),r.editingNoteId=t}function f0(e){e.preventDefault();const t=(e.clipboardData||window.clipboardData).getData("text/plain"),n=window.getSelection();if(n.rangeCount){const a=n.getRangeAt(0);a.deleteContents(),a.insertNode(document.createTextNode(t)),a.collapse(!1),n.removeAllRanges(),n.addRange(a)}}function Fl(e){const t=Le(e);if(!t)return;r.zoomedNoteId=e;const n=ho(e);r.notesBreadcrumb=[...n,{id:e,title:t.title||"Untitled"}],window.render()}function mo(){if(!r.zoomedNoteId)return;const e=ho(r.zoomedNoteId);if(e.length>0){const t=e[e.length-1];r.zoomedNoteId=t.id,r.notesBreadcrumb=e}else r.zoomedNoteId=null,r.notesBreadcrumb=[];window.render()}function p0(e){e?Fl(e):(r.zoomedNoteId=null,r.notesBreadcrumb=[],window.render())}let hn=null;function Hl(e){if(!e)return"";let t="";if(e.areaId){const n=r.taskAreas.find(a=>a.id===e.areaId);if(n){const a=oe(n.color);t+=`<span class="note-page-chip" style="background:${a}12;border-color:${a}30;color:${a}">
        ${A(n.name)}
        <span class="chip-remove" onclick="event.stopPropagation();removeNoteInlineMeta('${e.id}','category','${n.id}')" title="Remove">&times;</span>
      </span>`}}if(e.categoryId){const n=(r.taskCategories||[]).find(a=>a.id===e.categoryId);n&&(t+=`<span class="note-page-chip">
        ${A(n.name)}
        <span class="chip-remove" onclick="event.stopPropagation();removeNoteInlineMeta('${e.id}','category','${n.id}')" title="Remove">&times;</span>
      </span>`)}return(e.labels||[]).forEach(n=>{const a=r.taskLabels.find(s=>s.id===n);if(a){const s=oe(a.color);t+=`<span class="note-page-chip" style="background:${s}12;border-color:${s}30;color:${s}">
        ${A(a.name)}
        <span class="chip-remove" onclick="event.stopPropagation();removeNoteInlineMeta('${e.id}','label','${n}')" title="Remove">&times;</span>
      </span>`}}),(e.people||[]).forEach(n=>{const a=r.taskPeople.find(s=>s.id===n);if(a){const s=oe(a.color);t+=`<span class="note-page-chip" style="background:${s}12;border-color:${s}30;color:${s}">
        ${A(a.name.split(" ")[0])}
        <span class="chip-remove" onclick="event.stopPropagation();removeNoteInlineMeta('${e.id}','person','${n}')" title="Remove">&times;</span>
      </span>`}}),e.deferDate&&(t+=`<span class="note-page-chip">
      <svg style="width:12px;height:12px;flex-shrink:0" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>
      ${Ne(e.deferDate)}
      <span class="chip-remove" onclick="event.stopPropagation();removeNoteInlineMeta('${e.id}','deferDate',null)" title="Remove">&times;</span>
    </span>`),t+=`<button class="note-page-add-meta" onclick="focusPageTitleForMeta('${e.id}')" title="Add metadata">+ Add</button>`,t}function h0(e){const t=document.querySelector(".note-page-title");if(!t)return;t.focus();const n=document.createRange(),a=window.getSelection();if(t.childNodes.length>0){const l=t.childNodes[t.childNodes.length-1];l.nodeType===Node.TEXT_NODE?n.setStart(l,l.length):n.setStartAfter(l)}else n.setStart(t,0);n.collapse(!0),a.removeAllRanges(),a.addRange(n);const o=(t.textContent||"").endsWith(" ")?"#":" #",i=document.createTextNode(o);n.insertNode(i),n.setStartAfter(i),n.collapse(!0),a.removeAllRanges(),a.addRange(n),pt=e,Nf(t)}function Ts(e){const t=document.querySelector(".note-page-description");if(t){t.focus();const n=document.createRange(),a=window.getSelection();n.selectNodeContents(t),n.collapse(!1),a.removeAllRanges(),a.addRange(n)}}function Qf(e){const t=document.querySelector(".note-page-title");if(t){t.focus();const n=document.createRange(),a=window.getSelection();n.selectNodeContents(t),n.collapse(!1),a.removeAllRanges(),a.addRange(n)}}function m0(e,t){const n=Le(t);if(!n)return;jl=setTimeout(()=>tt(),150);const a=e.target.textContent.trim();if(a!==(n.title||"")){n.title=a,ze(n,"updated",{field:"title"}),le(),at();const s=r.notesBreadcrumb.find(o=>o.id===t);s&&(s.title=a||"Untitled")}}function g0(e,t){if(Ce){const n=e.target,a=n.textContent||"",s=fo(n),o=a.substring(bn+1,s),i=Se==="!",l=Br(o),d=i?l:l.filter(f=>f.name.toLowerCase().includes(o.toLowerCase())),c=i?!0:l.some(f=>f.name.toLowerCase()===o.toLowerCase()),h=!i&&o.length>0&&!c,v=d.length+(h?1:0);if(e.key==="ArrowDown"){e.preventDefault(),e.stopImmediatePropagation(),Te=(Te+1)%v,yn(l,o,n);return}else if(e.key==="ArrowUp"){e.preventDefault(),e.stopImmediatePropagation(),Te=(Te-1+v)%v,yn(l,o,n);return}else if(e.key==="Enter"||e.key==="Tab"){if(e.preventDefault(),e.stopImmediatePropagation(),pt=t,Te<d.length)nr(d[Te]);else if(h){const f=Nl();if(f){const p=f(o);nr(p)}}return}else if(e.key==="Escape"){e.preventDefault(),e.stopImmediatePropagation(),tt();return}}if(e.key==="Backspace"&&(e.metaKey||e.ctrlKey)){e.preventDefault(),r.zoomedNoteId&&mo();return}if(e.key==="Enter"&&!e.shiftKey){e.preventDefault(),Ts();return}if(e.key==="ArrowDown"&&Bl(e.target)){e.preventDefault(),Ts();return}}function v0(e,t){hn&&(clearTimeout(hn),hn=null);const n=Le(t);if(!n)return;const a=e.target.innerText.trim();a!==(n.notes||"")&&(n.notes=a,ze(n,"updated",{field:"notes"}),le(),at())}function b0(e,t){if(e.key==="Backspace"&&(e.metaKey||e.ctrlKey)){e.preventDefault(),r.zoomedNoteId&&mo();return}if(e.key==="ArrowUp"&&Mi(e.target)){e.preventDefault(),Qf();return}if(e.key==="ArrowDown"&&Bl(e.target)){e.preventDefault();const n=document.querySelector(".note-item .note-input");n&&n.focus();return}}function y0(e,t){hn&&clearTimeout(hn);const n=e.target.innerText.trim();hn=setTimeout(()=>{const a=Le(t);a&&(n!==(a.notes||"")&&(a.notes=n,ze(a,"updated",{field:"notes"}),le(),at()),hn=null)},2e3)}function w0(){if(!r.zoomedNoteId||r.notesBreadcrumb.length===0)return"";const e=r.notesBreadcrumb[r.notesBreadcrumb.length-1],t=Le(r.zoomedNoteId),n=r.notesBreadcrumb.slice(0,-1),a=n.length>0?n[n.length-1].title:"All Notes",s=["All Notes",...n.map(o=>A(o.title))];return`
    <div class="note-page-header">
      <div class="note-page-nav">
        <button onclick="zoomOutOfNote()" class="notes-back-btn" title="Go back (Cmd+Backspace)">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
          <span>${A(a)}</span>
        </button>
      </div>
      ${s.length>1?`
        <div class="notes-breadcrumb-trail" style="margin-bottom:10px;">
          ${s.map((o,i)=>{if(i<s.length-1){const l=i===0?null:n[i-1].id;return`<button onclick="navigateToBreadcrumb(${l?`'${l}'`:"null"})" class="notes-trail-link">${o}</button><span class="notes-trail-sep">/</span>`}return`<span class="notes-trail-current">${o}</span>`}).join("")}
        </div>
      `:""}
      <div contenteditable="true" class="note-page-title" data-placeholder="Untitled"
        onkeydown="handlePageTitleKeydown(event, '${r.zoomedNoteId}')"
        oninput="handleNoteInput(event, '${r.zoomedNoteId}')"
        onblur="handlePageTitleBlur(event, '${r.zoomedNoteId}')"
        onfocus="handleNoteFocus(event, '${r.zoomedNoteId}')"
        onpaste="handleNotePaste(event)"
      >${e.title?A(e.title):""}</div>
      <div class="note-page-meta">${t?Hl(t):""}</div>
      <div contenteditable="true" class="note-page-description" data-placeholder="Add a description..."
        onkeydown="handleDescriptionKeydown(event, '${r.zoomedNoteId}')"
        oninput="handleDescriptionInput(event, '${r.zoomedNoteId}')"
        onblur="handleDescriptionBlur(event, '${r.zoomedNoteId}')"
        onpaste="handleNotePaste(event)"
      >${A(t?.notes||"")}</div>
    </div>
    <div class="note-page-separator"></div>
  `}function x0(e,t){nn()||(r.draggedNoteId=t,e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t),requestAnimationFrame(()=>{const a=document.querySelector(`[data-note-id="${t}"]`);a&&a.classList.add("note-dragging")}))}function k0(e){const t=r.draggedNoteId,n=r.dragOverNoteId,a=r.noteDragPosition;document.querySelectorAll(".note-dragging, .note-drag-over, .note-drag-over-bottom, .note-drag-over-child").forEach(s=>{s.classList.remove("note-dragging","note-drag-over","note-drag-over-bottom","note-drag-over-child")}),t&&n&&a&&t!==n&&Zf(t,n,a),r.draggedNoteId=null,r.dragOverNoteId=null,r.noteDragPosition=null}function S0(e,t){if(e.preventDefault(),e.dataTransfer.dropEffect="move",!r.draggedNoteId||r.draggedNoteId===t||Ol(t,r.draggedNoteId))return;const n=e.currentTarget,a=n.getBoundingClientRect(),s=e.clientY-a.top,o=a.height;n.classList.remove("note-drag-over","note-drag-over-bottom","note-drag-over-child");let i;s<o*.25?(i="top",n.classList.add("note-drag-over")):s>o*.75?(i="bottom",n.classList.add("note-drag-over-bottom")):(i="child",n.classList.add("note-drag-over-child")),r.dragOverNoteId=t,r.noteDragPosition=i}function T0(e){const t=e.currentTarget;t.contains(e.relatedTarget)||t.classList.remove("note-drag-over","note-drag-over-bottom","note-drag-over-child")}function I0(e){e.preventDefault()}function Zf(e,t,n){const a=Le(e),s=Le(t);if(!(!a||!s)&&!Ol(t,e)){if(n==="child"){a.parentId=t,a.indent=Math.min((s.indent||0)+1,5),a.areaId=s.areaId;const o=r.tasksData.filter(i=>ke(i)&&i.parentId===t&&i.id!==e).sort(vt);a.noteOrder=po(o),r.collapsedNotes.has(t)&&(r.collapsedNotes.delete(t),En())}else{a.parentId=s.parentId,a.indent=s.indent||0;const o=r.tasksData.filter(l=>ke(l)&&l.parentId===s.parentId&&l.areaId===s.areaId&&l.id!==e).sort(vt),i=o.findIndex(l=>l.id===t);if(n==="top"){const l=i>0?o[i-1]:null;a.noteOrder=Ss(l?l.noteOrder:null,s.noteOrder)}else{const l=i<o.length-1?o[i+1]:null;a.noteOrder=Ss(s.noteOrder,l?l.noteOrder:null)}}ze(a,"updated",{field:"hierarchy",type:"reorder"}),on()}}function ep(e){const t=ea(e.id),n=r.collapsedNotes.has(e.id),a=r.editingNoteId===e.id,s=t&&n?Gf(e.id):0,o=e.areaId||e.labels&&e.labels.length>0||e.people&&e.people.length>0||e.deferDate,i=nn(),l=`
    <div class="note-item ${t?"has-children":""} ${n?"note-collapsed":""} ${a?"editing":""}"
      data-note-id="${e.id}"
      style="--note-depth:${e.indent||0};"
      ${i?"":`draggable="true"
      ondragstart="handleNoteDragStart(event, '${e.id}')"
      ondragend="handleNoteDragEnd(event)"
      ondragover="handleNoteDragOver(event, '${e.id}')"
      ondragleave="handleNoteDragLeave(event)"
      ondrop="handleNoteDrop(event)"`}>
      <div class="note-row group">
        ${e.isNote?`<button onclick="event.stopPropagation(); ${t?`toggleNoteCollapse('${e.id}')`:`zoomIntoNote('${e.id}')`}"
              ondblclick="event.stopPropagation(); zoomIntoNote('${e.id}')"
              class="note-bullet ${t?"has-children":""} ${n?"collapsed":""}"
              title="${t?n?"Expand":"Collapse":"Open as page"} (double-click to zoom)"
              aria-label="${t?n?"Expand children":"Collapse children":"Open note as page"}">
              <span class="note-bullet-dot"></span>
            </button>`:`<button onclick="event.stopPropagation(); toggleTaskComplete('${e.id}')"
              class="note-checkbox-btn ${e.completed?"completed":""}"
              title="${e.completed?"Mark incomplete":"Mark complete"}"
              aria-label="${e.completed?"Mark incomplete":"Mark complete"}">
              <span class="note-checkbox-circle ${e.completed?"bg-[var(--accent)] border-[var(--accent)]":"border-[var(--text-muted)] hover:border-[var(--accent)]"}">
                ${e.completed?'<svg class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>':""}
              </span>
            </button>`}

        <div class="note-content-col">
          <div contenteditable="true" class="note-input" data-placeholder="Type something..."
            onkeydown="handleNoteKeydown(event, '${e.id}')"
            oninput="handleNoteInput(event, '${e.id}')"
            onblur="handleNoteBlur(event, '${e.id}')"
            onfocus="handleNoteFocus(event, '${e.id}')"
            onpaste="handleNotePaste(event)"
          >${e.title?A(e.title):""}</div>
          ${o?`<div class="note-meta-chips">${Lf(e)}</div>`:""}
        </div>

        ${n&&s>0?`
          <span class="note-descendant-badge">${s}</span>
        `:""}

        <div class="note-actions md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          <button onclick="event.stopPropagation(); toggleNoteTask('${e.id}')"
            class="note-action-btn" title="${e.isNote?"Convert to task (⌘⇧↩)":"Convert to note (⌘⇧↩)"}"
            aria-label="${e.isNote?"Convert to task":"Convert to note"}">
            ${e.isNote?'<svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="5.5"/></svg>':'<svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="4"/></svg>'}
          </button>
          <button onclick="event.stopPropagation(); deleteNoteWithUndo('${e.id}')"
            class="note-action-btn note-action-btn-delete" title="Delete note" aria-label="Delete note">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;return i?`
      <div class="swipe-row">
        <div class="swipe-actions-left">
          <button class="swipe-action-btn swipe-action-convert" onclick="event.stopPropagation(); window.outdentNote('${e.id}')">
            <svg class="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            <span>Outdent</span>
          </button>
          <button class="swipe-action-btn swipe-action-convert" onclick="event.stopPropagation(); window.toggleNoteTask('${e.id}')">
            ${e.isNote?'<svg class="w-[22px] h-[22px]" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="5.5"/></svg>':'<svg class="w-[22px] h-[22px]" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="4"/></svg>'}
            <span>${e.isNote?"To Task":"To Note"}</span>
          </button>
        </div>
        <div class="swipe-row-content">${l}</div>
        <div class="swipe-actions-right">
          <button class="swipe-action-btn swipe-action-flag" onclick="event.stopPropagation(); window.indentNote('${e.id}')">
            <svg class="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            <span>Indent</span>
          </button>
          <button class="swipe-action-btn swipe-action-delete" onclick="event.stopPropagation(); window.deleteNoteWithUndo('${e.id}')">
            <svg class="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    `:l}function tp(e=null){const t=jf(e);return t.length===0&&!r.zoomedNoteId?`
      <div class="text-center py-12 text-[var(--text-muted)]">
        <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
          <svg class="w-6 h-6 text-[var(--text-secondary)]" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="4" cy="6" r="2"/><circle cx="4" cy="12" r="2"/><circle cx="4" cy="18" r="2"/>
            <rect x="8" y="5" width="14" height="2" rx="1"/><rect x="8" y="11" width="14" height="2" rx="1"/><rect x="8" y="17" width="14" height="2" rx="1"/>
          </svg>
        </div>
        <p class="text-sm font-medium mb-1">No notes yet</p>
        <p class="text-xs text-[var(--text-muted)] mb-3">Capture the first thought and build from there</p>
      </div>
    `:t.length===0&&r.zoomedNoteId?`
      <div class="text-center py-8 text-[var(--text-muted)]">
        <p class="text-sm font-medium mb-1">No child notes</p>
        <p class="text-xs text-[var(--text-muted)] mb-3">Press the button below to add one</p>
        <button onclick="createRootNote()" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-lg transition">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Add note
        </button>
      </div>
    `:`<div class="notes-list">${t.map(n=>ep(n)).join("")}</div>`}function C0(e,t){r.draggedTaskId=t,e.target.classList.add("dragging"),e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t);const n=e.target.closest(".task-list");n&&n.classList.add("is-dragging")}function E0(e){e.target.classList.remove("dragging"),document.querySelectorAll(".drag-over, .drag-over-bottom").forEach(n=>{n.classList.remove("drag-over","drag-over-bottom")});const t=document.querySelector(".task-list.is-dragging");t&&t.classList.remove("is-dragging"),r.draggedTaskId&&r.dragOverTaskId&&r.draggedTaskId!==r.dragOverTaskId&&np(r.draggedTaskId,r.dragOverTaskId,r.dragPosition),r.draggedTaskId=null,r.dragOverTaskId=null,r.dragPosition=null}function $0(e,t){if(e.preventDefault(),e.dataTransfer.dropEffect="move",t===r.draggedTaskId)return;const n=e.target.closest(".task-item");if(!n)return;const a=n.getBoundingClientRect(),s=a.top+a.height/2,o=e.clientY<s?"top":"bottom";document.querySelectorAll(".drag-over, .drag-over-bottom").forEach(i=>{i.classList.remove("drag-over","drag-over-bottom")}),o==="top"?n.classList.add("drag-over"):n.classList.add("drag-over-bottom"),r.dragOverTaskId=t,r.dragPosition=o}function D0(e){e.target.closest(".task-item")?.contains(e.relatedTarget)||e.target.closest(".task-item")?.classList.remove("drag-over","drag-over-bottom")}function _0(e,t){e.preventDefault()}function np(e,t,n){const a=r.tasksData.find(h=>h.id===e),s=r.tasksData.find(h=>h.id===t);if(!a||!s)return;const o=M0(),i=o.map(h=>h.id),l=i.indexOf(e),d=i.indexOf(t);if(l===-1||d===-1)return;let c;if(n==="top")c=(((d>0?o[d-1]:null)?.order??s.order-1e3)+s.order)/2;else{const v=(d<o.length-1?o[d+1]:null)?.order??s.order+1e3;c=(s.order+v)/2}a.order=c,a.updatedAt=new Date().toISOString(),rp(),le(),window.render()}function rp(){["inbox","anytime","someday"].forEach(t=>{r.tasksData.filter(a=>a.status===t&&!a.completed).sort((a,s)=>(a.order??0)-(s.order??0)).forEach((a,s)=>{a.order=(s+1)*1e3})})}function A0(){document.querySelectorAll(".draggable-item").forEach(e=>{e.dataset.dragInitialized||(e.dataset.dragInitialized="true",e.addEventListener("dragstart",function(t){const n=this.dataset.id,a=this.dataset.type;r.draggedSidebarItem=n,r.draggedSidebarType=a,this.classList.add("dragging"),t.dataTransfer.effectAllowed="move",t.dataTransfer.setData("text/plain",n)}),e.addEventListener("dragend",function(t){this.classList.remove("dragging"),document.querySelectorAll(".drag-over, .drag-over-bottom").forEach(n=>{n.classList.remove("drag-over","drag-over-bottom")}),r.draggedSidebarItem=null,r.draggedSidebarType=null,r.sidebarDragPosition=null}),e.addEventListener("dragover",function(t){if(t.preventDefault(),t.dataTransfer.dropEffect="move",this.classList.contains("dragging"))return;const n=this.getBoundingClientRect(),a=n.top+n.height/2,s=t.clientY<a?"top":"bottom";document.querySelectorAll(".drag-over, .drag-over-bottom").forEach(o=>{o.classList.remove("drag-over","drag-over-bottom")}),s==="top"?this.classList.add("drag-over"):this.classList.add("drag-over-bottom"),r.sidebarDragPosition=s}),e.addEventListener("dragleave",function(t){this.classList.remove("drag-over","drag-over-bottom")}),e.addEventListener("drop",function(t){t.preventDefault();const n=this.dataset.id,a=this.dataset.type;if(document.querySelectorAll(".drag-over, .drag-over-bottom").forEach(d=>{d.classList.remove("drag-over","drag-over-bottom")}),!r.draggedSidebarItem||r.draggedSidebarType!==a||r.draggedSidebarItem===n)return;let s;if(a==="area")s=r.taskAreas;else if(a==="label")s=r.taskLabels;else if(a==="person")s=r.taskPeople;else if(a==="perspective")s=r.customPerspectives;else return;const o=s.findIndex(d=>d.id===r.draggedSidebarItem);let i=s.findIndex(d=>d.id===n);if(o===-1||i===-1)return;r.sidebarDragPosition==="bottom"&&o<i||(r.sidebarDragPosition==="bottom"&&o>i?i+=1:r.sidebarDragPosition==="top"&&o>i||r.sidebarDragPosition==="top"&&o<i&&(i-=1));const[l]=s.splice(o,1);s.splice(i,0,l),le(),window.render()}))})}function M0(){return window.getCurrentFilteredTasks()}const P0=500,tc=8,nc=60,rc=8;let Je=null,pe=null,Ae=null,wn=null,ac=!1,Bn=!1;function N0(){if(!nn())return;document.querySelectorAll(".touch-drag-clone, .touch-drag-indicator").forEach(t=>t.remove()),document.querySelectorAll(".task-list").forEach(t=>{t._touchDragInit||(t._touchDragInit=!0,t.addEventListener("touchstart",R0,{passive:!0}),t.addEventListener("touchmove",B0,{passive:!1}),t.addEventListener("touchend",sc,{passive:!0}),t.addEventListener("touchcancel",sc,{passive:!0}))}),ac||(ac=!0,document.addEventListener("visibilitychange",L0),window.addEventListener("blur",Is),document.addEventListener("contextmenu",Is),document.addEventListener("click",O0,!0))}function Is(){clearTimeout(Je),Je=null,Ae&&(ip(Ae.item),Ae=null),pe&&(cancelAnimationFrame(wn),wn=null,pe.clone?.parentNode&&pe.clone.remove(),pe.item&&(pe.item.style.opacity="",pe.item.style.transition=""),zl(),pe=null)}function ap(){return pe!==null||Ae!==null}function sp(){Je&&(clearTimeout(Je),Je=null)}function L0(){document.visibilityState==="hidden"&&Is()}function O0(e){Bn&&(Bn=!1,e.stopPropagation(),e.preventDefault())}function op(e){return e.closest(".task-item")}function R0(e){if(pe||Ae)return;const t=op(e.target);if(!t||e.target.closest("button, input, textarea, a, .swipe-action-btn"))return;const n=e.touches[0],a=n.clientX,s=n.clientY;t._touchStartX=a,t._touchStartY=s,Je=setTimeout(()=>{Je=null,j0(t,a,s)},P0)}function B0(e){const t=e.touches[0];if(Je){const s=op(e.target);if(s&&s._touchStartX!==void 0){const o=Math.abs(t.clientX-s._touchStartX),i=Math.abs(t.clientY-s._touchStartY);(o>tc||i>tc)&&(clearTimeout(Je),Je=null)}}if(Ae&&!pe){const s=Math.abs(t.clientX-Ae.startX),o=Math.abs(t.clientY-Ae.startY);if(s>5||o>5)F0(t.clientX,t.clientY);else return}if(!pe)return;e.preventDefault();const n=t.clientY,a=t.clientX;pe.clone.style.top=`${n-pe.offsetY}px`,pe.clone.style.left=`${a-pe.offsetX}px`,pe.lastY=n,z0(n),W0(n)}function sc(){if(clearTimeout(Je),Je=null,Ae&&!pe){const o=Ae.item;if(ip(o),Ae=null,Bn=!0,setTimeout(()=>{Bn=!1},400),o){const i=Uo(o);i&&H0(i)}return}if(!pe)return;cancelAnimationFrame(wn),wn=null;const e=pe.lastY,t=lp(e);let n="bottom";if(t){const o=t.getBoundingClientRect(),i=o.top+o.height/2;n=e<i?"top":"bottom"}const a=Uo(pe.item),s=t?Uo(t):null;pe.clone?.parentNode&&pe.clone.remove(),pe.item.style.opacity="",zl(),Bn=!0,setTimeout(()=>{Bn=!1},400),t&&t!==pe.item&&a&&s&&typeof window.reorderTasks=="function"&&window.reorderTasks(a,s,n),pe=null}function j0(e,t,n){navigator.vibrate&&navigator.vibrate(10),Ae={item:e,startX:t,startY:n},e.style.transition="transform 0.15s ease, box-shadow 0.15s ease",e.style.transform="scale(1.02)",e.style.boxShadow="0 4px 16px rgba(0,0,0,0.12)",e.style.zIndex="10",e.style.position="relative"}function ip(e){e&&(e.style.transition="transform 0.15s ease, box-shadow 0.15s ease",e.style.transform="",e.style.boxShadow="",e.style.zIndex="",setTimeout(()=>{e.style.position="",e.style.transition=""},150))}function F0(e,t){if(!Ae)return;const n=Ae.item,a=Ae.startX,s=Ae.startY;n.style.transition="",n.style.transform="",n.style.boxShadow="",n.style.zIndex="",n.style.position="",Ae=null;const o=n.getBoundingClientRect(),i=n.cloneNode(!0);i.className="touch-drag-clone",i.style.cssText=`
    position: fixed; z-index: 1000;
    width: ${o.width}px;
    top: ${o.top}px; left: ${o.left}px;
    background: var(--bg-card);
    border-radius: var(--border-radius);
    box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    transform: scale(1.03);
    opacity: 0.95;
    pointer-events: none;
    transition: transform var(--duration-fast) var(--ease-spring);
  `,document.body.appendChild(i),n.style.opacity="0.3",pe={item:n,clone:i,offsetX:a-o.left,offsetY:s-o.top,container:n.closest(".task-list"),scrollable:n.closest(".main-content")||document.documentElement,lastY:t}}function H0(e){const t=(window.state?.tasksData||[]).find(n=>n.id===e);!t||typeof window.showActionSheet!="function"||window.showActionSheet({title:t.title||"Task",items:[{label:"Edit",icon:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',handler:()=>{window.editingTaskId=e,window.showTaskModal=!0,window.render()}},{label:t.completed?"Uncomplete":"Complete",icon:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',handler:()=>{window.toggleTaskComplete(e)}},{label:t.flagged?"Unflag":"Flag",icon:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',handler:()=>{window.updateTask(e,{flagged:!t.flagged})}},{label:"Move to Today",icon:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',handler:()=>{window.moveTaskTo(e,"today")}},{label:"Delete",icon:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',destructive:!0,handler:()=>{window.confirmDeleteTask(e)}}]})}function Uo(e){return e?.closest("[data-task-id]")?.dataset.taskId||e?.querySelector('[onclick*="editingTaskId"]')?.getAttribute("onclick")?.match(/'([^']+)'/)?.[1]}function z0(e){if(!pe||!pe.container)return;const t=pe.scrollable;cancelAnimationFrame(wn);const n=()=>{if(!pe)return;const a=pe.container.getBoundingClientRect();e<a.top+nc?(t.scrollTop-=rc,wn=requestAnimationFrame(n)):e>a.bottom-nc&&(t.scrollTop+=rc,wn=requestAnimationFrame(n))};n()}function lp(e){if(!pe||!pe.container)return null;const t=[...pe.container.querySelectorAll(".task-item")];for(const n of t){if(n===pe.item)continue;const a=n.getBoundingClientRect();if(e>=a.top&&e<=a.bottom)return n}return null}function W0(e){zl();const t=lp(e);if(!t)return;const n=t.getBoundingClientRect(),a=n.top+n.height/2,s=document.createElement("div");s.className="touch-drag-indicator",s.style.cssText=`
    position: fixed; left: ${n.left+16}px; right: ${window.innerWidth-n.right+16}px;
    height: 2px; background: var(--accent); border-radius: 1px;
    z-index: 999; pointer-events: none;
    top: ${e<a?n.top:n.bottom}px;
  `,document.body.appendChild(s)}function zl(){document.querySelectorAll(".touch-drag-indicator").forEach(e=>e.remove())}let nt=null,dp=0,cp=0,Cs=0,xn=!1,ts=!1;const Ar=72,jr=152;function up(e,t=!0){if(!e)return;t&&(e.style.transition="transform var(--duration-normal) var(--ease-spring)"),e.style.transform="translateX(0)",t&&setTimeout(()=>{e.style.transition=""},300);const n=e.closest(".swipe-row");n&&n.classList.remove("swipe-open-left","swipe-open-right")}function Wl(){if(nt){const e=nt.querySelector(".swipe-row-content");up(e),nt=null}}function U0(){if(!nn())return;document.querySelectorAll(".task-list, .notes-list").forEach(t=>{t._swipeInit||(t._swipeInit=!0,t.addEventListener("touchstart",G0,{passive:!0}),t.addEventListener("touchmove",V0,{passive:!1}),t.addEventListener("touchend",q0,{passive:!0}))})}function fp(e){return e.closest(".swipe-row")}function G0(e){const t=fp(e.target);if(!t)return;nt&&nt!==t&&Wl();const n=e.touches[0];dp=n.clientX,cp=n.clientY,Cs=0,xn=!1,ts=!1;const a=t.querySelector(".swipe-row-content");a&&(a.style.transition="")}function V0(e){const t=fp(e.target);if(!t)return;const n=e.touches[0],a=n.clientX-dp,s=n.clientY-cp;if(ap())return;if(!xn&&!ts){if(Math.abs(s)>10&&Math.abs(s)>Math.abs(a)){ts=!0;return}if(Math.abs(a)>10&&Math.abs(a)>Math.abs(s))xn=!0,nt=t,sp();else return}if(ts||!xn)return;e.preventDefault();let o=a;if(Math.abs(o)>jr){const l=Math.abs(o)-jr;o=(o>0?1:-1)*(jr+l*.2)}Cs=o;const i=t.querySelector(".swipe-row-content");i&&(i.style.transform=`translateX(${o}px)`),Math.abs(a)>=Ar&&Math.abs(a)<Ar+5&&navigator.vibrate&&navigator.vibrate(10),a<-Ar?(t.classList.add("swipe-open-right"),t.classList.remove("swipe-open-left")):a>Ar?(t.classList.add("swipe-open-left"),t.classList.remove("swipe-open-right")):t.classList.remove("swipe-open-left","swipe-open-right")}function q0(e){if(!xn||!nt){xn=!1;return}const t=nt.querySelector(".swipe-row-content");if(xn=!1,Math.abs(Cs)>=Ar){const n=Cs<0?-jr:jr;t&&(t.style.transition="transform var(--duration-normal) var(--ease-spring)",t.style.transform=`translateX(${n}px)`,setTimeout(()=>{t.style.transition=""},300))}else up(t),nt=null}document.addEventListener("touchstart",e=>{nt&&!nt.contains(e.target)&&Wl()},{passive:!0});const un=60;let ja=!1,Go=0,Ye=0,Be=null,oc=!1;function K0(){return Be||(Be=document.createElement("div"),Be.className="ptr-indicator",Be.innerHTML=`
    <svg class="ptr-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
    </svg>
  `,Be)}function Y0(){return document.querySelector(".main-content")||document.querySelector("#app")}function J0(){const e=Y0();!e||oc||!window.isTouchDevice||!window.isTouchDevice()||(oc=!0,e.style.overscrollBehaviorY="contain",e.addEventListener("touchstart",t=>{window.state?.activeTab==="home"&&(e.scrollTop>5||(ja=!0,Go=t.touches[0].clientY,Ye=0))},{passive:!0}),e.addEventListener("touchmove",t=>{if(!ja)return;const n=t.touches[0].clientY;if(Ye=Math.max(0,n-Go),Ye<=0)return;const a=Ye>un?un+(Ye-un)*.3:Ye,s=K0();if(!s.parentNode){const l=e.querySelector(".home-large-title")?.parentElement||e.firstElementChild;l&&l.parentNode.insertBefore(s,l)}const o=Math.min(Ye/un,1);s.style.transform=`translateX(-50%) translateY(${a-40}px)`,s.style.opacity=o;const i=s.querySelector(".ptr-spinner");i&&(i.style.transform=`rotate(${o*360}deg)`),Ye>=un&&Ye-(n-Go-Ye)<un+5&&navigator.vibrate&&navigator.vibrate(20)},{passive:!0}),e.addEventListener("touchend",async()=>{if(ja){if(ja=!1,Ye>=un){const t=Be;if(t){t.classList.add("ptr-refreshing");try{typeof window.loadCloudData=="function"&&await window.loadCloudData(),navigator.vibrate&&navigator.vibrate([10,30])}catch(n){console.error("PTR sync failed:",n),navigator.vibrate&&navigator.vibrate([10,50,10])}t&&(t.style.transition="transform 0.3s var(--ease-default), opacity 0.3s var(--ease-default)",t.style.transform="translateX(-50%) translateY(-40px)",t.style.opacity="0",setTimeout(()=>{t.remove(),t.classList.remove("ptr-refreshing"),t.style.transition=""},300))}}else Be&&(Be.style.transition="transform 0.2s var(--ease-default), opacity 0.2s var(--ease-default)",Be.style.transform="translateX(-50%) translateY(-40px)",Be.style.opacity="0",setTimeout(()=>{Be&&(Be.remove(),Be.style.transition="")},200));Ye=0}},{passive:!0}))}let Mr=null;function X0({title:e,items:t,cancelLabel:n="Cancel"}){Pr();const a=document.createElement("div");a.className="action-sheet-overlay",a.onclick=o=>{o.target===a&&Pr()};const s=t.map((o,i)=>`
    <button class="action-sheet-item ${o.destructive?"action-sheet-destructive":""} ${o.disabled?"action-sheet-disabled":""}"
      data-index="${i}" ${o.disabled?"disabled":""}>
      ${o.icon?`<span class="action-sheet-icon">${o.icon}</span>`:""}
      <span>${o.label}</span>
    </button>
  `).join("");a.innerHTML=`
    <div class="action-sheet">
      <div class="action-sheet-group">
        ${e?`<div class="action-sheet-title">${e}</div>`:""}
        ${s}
      </div>
      <div class="action-sheet-cancel">
        <button class="action-sheet-item action-sheet-cancel-btn">${n}</button>
      </div>
    </div>
  `,document.body.appendChild(a),Mr=a,a.querySelectorAll(".action-sheet-item[data-index]").forEach(o=>{o.addEventListener("click",()=>{const i=parseInt(o.dataset.index),l=t[i];l&&!l.disabled&&l.handler&&(navigator.vibrate&&navigator.vibrate(5),Pr(),l.handler())})}),a.querySelector(".action-sheet-cancel-btn")?.addEventListener("click",Pr),requestAnimationFrame(()=>{a.classList.add("action-sheet-visible")})}function Pr(){if(!Mr)return;const e=Mr;e.classList.remove("action-sheet-visible"),e.classList.add("action-sheet-dismissing"),setTimeout(()=>{e.remove(),Mr===e&&(Mr=null)},350)}function pp(e,t){try{return localStorage.setItem(e,JSON.stringify(t)),!0}catch{return!1}}function Ul(){typeof window.debouncedSaveToGithub=="function"&&window.debouncedSaveToGithub()}function Ca(e){Gl(),Ul(),typeof window.render=="function"&&window.render(),e&&setTimeout(()=>{const t=document.querySelector(`[data-trigger-id="${e}"] .trigger-input`);t&&t.focus()},60)}function Gl(){pp(tn,r.triggers)}function rr(){pp(yc,[...r.collapsedTriggers])}function ln(e,t){const n=e.triggerOrder||0,a=t.triggerOrder||0;return n!==a?n-a:e.createdAt&&t.createdAt?e.createdAt<t.createdAt?-1:1:0}function go(e){return e.length?Math.max(...e.map(t=>t.triggerOrder||0))+1e3:1e3}function Es(e,t){return t==null?(e||0)+1e3:Math.round(((e||0)+t)/2)}function Vl(e){return r.triggers.filter(t=>t.parentId===e).sort(ln)}function $s(e){return r.triggers.some(t=>t.parentId===e)}function hp(e){let t=0;return r.triggers.filter(a=>a.parentId===e).forEach(a=>{t++,t+=hp(a.id)}),t}function mp(e,t){let n=r.triggers.find(a=>a.id===e);for(;n&&n.parentId;){if(n.parentId===t)return!0;n=r.triggers.find(a=>a.id===n.parentId)}return!1}function gp(e){return e?typeof e=="string"?{areaId:e,categoryId:null}:{areaId:e.areaId||null,categoryId:e.categoryId||null}:{areaId:null,categoryId:null}}function Q0(e){return{areaId:e.areaId,categoryId:e.categoryId}}function Z0(e){const{areaId:t,categoryId:n}=gp(e),a={};r.triggers.forEach(l=>{const d=l.parentId||"__root__";a[d]||(a[d]=[]),a[d].push(l)}),Object.values(a).forEach(l=>l.sort(ln));const s=[],o=r.zoomedTriggerId||"__root__";function i(l,d){(a[l]||[]).forEach(h=>{t&&h.areaId!==t||n&&h.categoryId!==n||l==="__root__"&&h.parentId||(s.push(h),r.collapsedTriggers.has(h.id)||i(h.id))})}return i(o),s}function vo(e,t={}){const n={id:"trigger_"+Date.now()+"_"+Math.random().toString(36).slice(2,7),title:e||"",areaId:t.areaId||null,categoryId:t.categoryId||null,parentId:t.parentId||null,indent:t.indent||0,triggerOrder:t.triggerOrder||1e3,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};return r.triggers.push(n),Ca(n.id),n}function ex(e){const{areaId:t,categoryId:n}=gp(e);if(r.zoomedTriggerId)return bp(r.zoomedTriggerId);const a=r.triggers.filter(s=>!s.parentId&&(t?s.areaId===t:!0)&&(n?s.categoryId===n:!0)).sort(ln);return vo("",{areaId:t,categoryId:n,parentId:null,indent:0,triggerOrder:go(a)})}function vp(e){const t=r.triggers.find(i=>i.id===e);if(!t)return;const n=r.triggers.filter(i=>i.parentId===t.parentId&&i.areaId===t.areaId).sort(ln),a=n.findIndex(i=>i.id===e),s=n[a+1],o=Es(t.triggerOrder,s?s.triggerOrder:null);return vo("",{areaId:t.areaId,categoryId:t.categoryId,parentId:t.parentId,indent:t.indent||0,triggerOrder:o})}function bp(e){const t=r.triggers.find(a=>a.id===e);if(!t)return;const n=Vl(e);return r.collapsedTriggers.has(e)&&(r.collapsedTriggers.delete(e),rr()),vo("",{areaId:t.areaId,categoryId:t.categoryId,parentId:e,indent:(t.indent||0)+1,triggerOrder:go(n)})}function yp(e,t){const n=r.triggers.findIndex(a=>a.id===e);n!==-1&&(r.triggers[n]={...r.triggers[n],...t,updatedAt:new Date().toISOString()},Gl(),Ul())}function wp(e,t=!0){if(t){const n=new Set([e]);let a=!0;for(;a;)a=!1,r.triggers.forEach(s=>{s.parentId&&n.has(s.parentId)&&!n.has(s.id)&&(n.add(s.id),a=!0)});r.triggers=r.triggers.filter(s=>!n.has(s.id))}else{const n=r.triggers.find(a=>a.id===e);n&&r.triggers.forEach(a=>{a.parentId===e&&(a.parentId=n.parentId,a.indent=Math.max(0,(a.indent||0)-1))}),r.triggers=r.triggers.filter(a=>a.id!==e)}Ca(null)}function xp(e){const t=r.triggers.find(l=>l.id===e);if(!t)return;Q0(t);const n=r.triggers.filter(l=>l.parentId===t.parentId&&l.areaId===t.areaId).sort(ln),a=n.findIndex(l=>l.id===e);if(a<=0)return;const s=n[a-1];if((t.indent||0)>=5)return;const i=Vl(s.id);t.parentId=s.id,t.indent=(s.indent||0)+1,t.triggerOrder=go(i),t.updatedAt=new Date().toISOString(),r.collapsedTriggers.has(s.id)&&(r.collapsedTriggers.delete(s.id),rr()),Ca(e)}function kp(e){const t=r.triggers.find(l=>l.id===e);if(!t||(t.indent||0)<=0)return;const n=t.parentId?r.triggers.find(l=>l.id===t.parentId):null,a=n&&n.parentId||null,s=r.triggers.filter(l=>l.parentId===a&&l.areaId===t.areaId).sort(ln),o=n&&n.triggerOrder||0,i=s.find(l=>(l.triggerOrder||0)>o);t.triggerOrder=Es(o,i?i.triggerOrder:null),t.parentId=a,t.indent=Math.max(0,(t.indent||0)-1),t.updatedAt=new Date().toISOString(),Ca(e)}function tx(e){r.collapsedTriggers.has(e)?r.collapsedTriggers.delete(e):r.collapsedTriggers.add(e),rr(),typeof window.render=="function"&&window.render()}function Sp(e){const t=r.triggers.find(s=>s.id===e);if(!t)return;const n=[];let a=t;for(;a;)n.unshift({id:a.id,title:a.title||"Untitled"}),a=a.parentId?r.triggers.find(s=>s.id===a.parentId):null;r.zoomedTriggerId=e,r.triggersBreadcrumb=n,typeof window.render=="function"&&window.render()}function Tp(){r.zoomedTriggerId=null,r.triggersBreadcrumb=[],typeof window.render=="function"&&window.render()}function nx(e){if(!e){Tp();return}Sp(e)}function rx(e,t){const n=r.triggers.find(a=>a.id===t);if(n){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault(),vp(t);return}if(e.key==="Backspace"&&(e.target.textContent||"")===""){e.preventDefault();const o=r.triggers.filter(d=>d.parentId===n.parentId&&d.areaId===n.areaId).sort(ln),i=o.findIndex(d=>d.id===t),l=i>0?o[i-1].id:null;wp(t),l&&setTimeout(()=>{const d=document.querySelector(`[data-trigger-id="${l}"] .trigger-input`);d&&d.focus()},60);return}if(e.key==="ArrowUp"&&(e.metaKey||e.ctrlKey)){e.preventDefault(),$s(t)&&!r.collapsedTriggers.has(t)&&(r.collapsedTriggers.add(t),rr(),typeof window.render=="function"&&window.render(),setTimeout(()=>{const a=document.querySelector(`[data-trigger-id="${t}"] .trigger-input`);a&&a.focus()},30));return}if(e.key==="ArrowDown"&&(e.metaKey||e.ctrlKey)){e.preventDefault(),$s(t)&&r.collapsedTriggers.has(t)&&(r.collapsedTriggers.delete(t),rr(),typeof window.render=="function"&&window.render(),setTimeout(()=>{const a=document.querySelector(`[data-trigger-id="${t}"] .trigger-input`);a&&a.focus()},30));return}if(e.key==="Tab"){e.preventDefault(),e.shiftKey?kp(t):xp(t);return}}}function ax(e,t){const n=e.target.textContent||"";yp(t,{title:n})}function sx(e,t){if(!r.triggers.find(s=>s.id===t))return;(e.target.textContent||"")===""&&!$s(t)&&(r.triggers=r.triggers.filter(s=>s.id!==t),Gl(),Ul())}function ox(e,t){r._draggedTriggerId=t,e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t),e.target.closest(".trigger-item")?.classList.add("dragging")}function Ip(e){r._draggedTriggerId=null,document.querySelectorAll(".trigger-item.dragging").forEach(t=>t.classList.remove("dragging")),document.querySelectorAll(".trigger-item.drag-over-top, .trigger-item.drag-over-bottom, .trigger-item.drag-over-child").forEach(t=>{t.classList.remove("drag-over-top","drag-over-bottom","drag-over-child")})}function ix(e,t){if(e.preventDefault(),r._draggedTriggerId===t||mp(t,r._draggedTriggerId))return;const n=e.target.closest(".trigger-item");if(!n)return;const a=n.getBoundingClientRect(),s=e.clientY-a.top,o=a.height;n.classList.remove("drag-over-top","drag-over-bottom","drag-over-child"),s<o*.25?n.classList.add("drag-over-top"):s>o*.75?n.classList.add("drag-over-bottom"):n.classList.add("drag-over-child")}function lx(e){const t=e.target.closest(".trigger-item");t&&t.classList.remove("drag-over-top","drag-over-bottom","drag-over-child")}function dx(e){e.preventDefault();const t=e.target.closest(".trigger-item");if(!t)return;const n=t.dataset.triggerId,a=r._draggedTriggerId;if(!a||a===n||mp(n,a))return;const s=t.getBoundingClientRect(),o=e.clientY-s.top,i=s.height;let l=o<i*.25?"top":o>i*.75?"bottom":"child";Cp(a,n,l),Ip()}function Cp(e,t,n){const a=r.triggers.find(o=>o.id===e),s=r.triggers.find(o=>o.id===t);if(!(!a||!s)){if(n==="child"){const o=Vl(t);a.parentId=t,a.indent=(s.indent||0)+1,a.triggerOrder=go(o),r.collapsedTriggers.has(t)&&(r.collapsedTriggers.delete(t),rr())}else{a.parentId=s.parentId,a.indent=s.indent||0,a.areaId=s.areaId,a.categoryId=s.categoryId;const o=r.triggers.filter(l=>l.parentId===s.parentId&&l.id!==e&&l.areaId===s.areaId).sort(ln),i=o.findIndex(l=>l.id===t);if(n==="top"){const l=i>0?o[i-1]:null;a.triggerOrder=Es(l?l.triggerOrder:0,s.triggerOrder)}else{const l=i<o.length-1?o[i+1]:null;a.triggerOrder=Es(s.triggerOrder,l?l.triggerOrder:null)}}a.updatedAt=new Date().toISOString(),Ca(null)}}function cx(){return!r.zoomedTriggerId||r.triggersBreadcrumb.length===0?"":`
    <div class="px-4 py-2 flex items-center gap-1.5 text-xs border-b border-[var(--border-light)]">
      <button onclick="navigateToTriggerBreadcrumb(null)" class="text-[var(--accent)] hover:underline">Triggers</button>
      ${r.triggersBreadcrumb.map((e,t)=>`
        <span class="text-[var(--text-muted)]">/</span>
        ${t===r.triggersBreadcrumb.length-1?`<span class="text-[var(--text-primary)] font-medium">${A(e.title)}</span>`:`<button onclick="navigateToTriggerBreadcrumb('${e.id}')" class="text-[var(--accent)] hover:underline">${A(e.title)}</button>`}
      `).join("")}
    </div>
  `}function Ep(e){const t=$s(e.id),n=r.collapsedTriggers.has(e.id),a=t&&n?hp(e.id):0,s=nn();return`
    <div class="trigger-item ${t?"has-children":""} ${n?"trigger-collapsed":""}"
      data-trigger-id="${e.id}"
      style="--trigger-depth:${e.indent||0};"
      ${s?"":`draggable="true"
      ondragstart="handleTriggerDragStart(event, '${e.id}')"
      ondragend="handleTriggerDragEnd(event)"
      ondragover="handleTriggerDragOver(event, '${e.id}')"
      ondragleave="handleTriggerDragLeave(event)"
      ondrop="handleTriggerDrop(event)"`}>
      <div class="trigger-row group">
        <button onclick="event.stopPropagation(); ${t?`toggleTriggerCollapse('${e.id}')`:`createChildTrigger('${e.id}')`}"
          class="trigger-bullet ${t?"has-children":""} ${n?"collapsed":""}"
          title="${t?n?"Expand":"Collapse":"Add child"}">
          ${t?n?'<span class="trigger-bullet-dot trigger-collapsed-ring"></span>':'<svg class="trigger-bullet-chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.23 4.21a.75.75 0 011.06.02l5.25 5.5a.75.75 0 010 1.04l-5.25 5.5a.75.75 0 01-1.08-1.04L11 10.25 6.21 5.27a.75.75 0 01.02-1.06z" clip-rule="evenodd"/></svg>':'<span class="trigger-bullet-dot"></span>'}
        </button>

        <div class="trigger-content-col">
          <div contenteditable="true" class="trigger-input" data-placeholder="What might need attention?"
            onkeydown="handleTriggerKeydown(event, '${e.id}')"
            oninput="handleTriggerInput(event, '${e.id}')"
            onblur="handleTriggerBlur(event, '${e.id}')"
          >${A(e.title||"")}</div>
        </div>

        ${n&&a>0?`
          <span class="trigger-descendant-badge">${a}</span>
        `:""}

        <div class="trigger-actions md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
          ${t?`
            <button onclick="event.stopPropagation(); zoomIntoTrigger('${e.id}')"
              class="trigger-action-btn" title="Zoom in">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </button>
          `:""}
          <button onclick="event.stopPropagation(); createChildTrigger('${e.id}')"
            class="trigger-action-btn" title="Add child">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          </button>
          <button onclick="event.stopPropagation(); deleteTrigger('${e.id}')"
            class="trigger-action-btn trigger-action-btn-delete" title="Delete">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `}function $p(e=null){const t=Z0(e);return t.length===0&&!r.zoomedTriggerId?`
      <div class="text-center py-8 text-[var(--text-muted)]">
        <p class="text-sm font-medium mb-1">No triggers yet</p>
        <p class="text-xs text-[var(--text-muted)] mb-3">Add prompts to spark your GTD review</p>
      </div>
    `:t.length===0&&r.zoomedTriggerId?`
      <div class="text-center py-8 text-[var(--text-muted)]">
        <p class="text-sm font-medium mb-1">No sub-triggers</p>
        <p class="text-xs text-[var(--text-muted)]">Press Enter to create one</p>
      </div>
    `:t.map(n=>Ep(n)).join("")}function ux(e){return r.triggers.filter(t=>t.areaId===e).length}const fx=7;function Dp(e){if(e.completed||e.isNote||e.status==="someday"||!e.areaId)return!1;if(!e.lastReviewedAt)return!0;const t=new Date(e.lastReviewedAt),n=new Date;return n.setDate(n.getDate()-fx),t<n}function ql(e){return r.tasksData.filter(t=>t.areaId===e&&Dp(t))}function px(){return r.tasksData.filter(e=>Dp(e)).length}function hx(){if(!r.lastWeeklyReview)return!0;const e=new Date(r.lastWeeklyReview);return Math.floor((new Date-e)/(1e3*60*60*24))>=7}function mx(){if(!r.lastWeeklyReview)return null;const e=new Date(r.lastWeeklyReview);return Math.floor((new Date-e)/(1e3*60*60*24))}function gx(){r.reviewMode=!0,r.reviewAreaIndex=0,r.reviewCompletedAreas=[],r.reviewTriggersCollapsed=!1,r.reviewProjectsCollapsed=!1,r.reviewNotesCollapsed=!1,typeof window.render=="function"&&window.render()}function vx(){if(r.reviewCompletedAreas.length===r.taskAreas.length){const t=new Date().toISOString();r.lastWeeklyReview=t,localStorage.setItem("nucleusLastWeeklyReview",t)}r.reviewMode=!1,r.reviewAreaIndex=0,r.reviewCompletedAreas=[],typeof window.render=="function"&&window.render()}function _p(){const e=r.taskAreas;r.reviewAreaIndex<e.length-1&&r.reviewAreaIndex++,typeof window.render=="function"&&window.render()}function bx(){r.reviewAreaIndex>0&&r.reviewAreaIndex--,typeof window.render=="function"&&window.render()}function yx(e){const t=r.tasksData.find(n=>n.id===e);t&&(t.lastReviewedAt=new Date().toISOString(),t.updatedAt=new Date().toISOString(),le()),r.editingTaskId=e,r.showTaskModal=!0,typeof window.render=="function"&&window.render()}function wx(e){const t=r.tasksData.find(n=>n.id===e);t&&(t.lastReviewedAt=new Date().toISOString(),t.updatedAt=new Date().toISOString(),le()),typeof window.render=="function"&&window.render()}function xx(){const t=r.taskAreas[r.reviewAreaIndex];t&&!r.reviewCompletedAreas.includes(t.id)&&r.reviewCompletedAreas.push(t.id);const n=ql(t.id);n.forEach(a=>{a.lastReviewedAt=new Date().toISOString(),a.updatedAt=new Date().toISOString()}),n.length>0&&le(),_p()}function kx(e,t="anytime",n=!1){r.editingTaskId=null,r.newTaskContext={areaId:e,categoryId:null,labelId:null,labelIds:null,personId:null,status:t,today:n},r.showTaskModal=!0,typeof window.render=="function"&&window.render(),setTimeout(()=>{const a=document.getElementById("task-title");a&&a.focus()},50)}function Ap(e,t,n){const a=t?.value?.trim();if(!a)return;const s={areaId:e,status:n?"anytime":"inbox",isNote:!!n},o=r.inlineAutocompleteMeta.get("review-quick-add-input");o&&(o.labels?.length&&(s.labels=o.labels),o.people?.length&&(s.people=o.people),o.deferDate&&(s.deferDate=o.deferDate),o.dueDate&&(s.dueDate=o.dueDate)),gr(a,s),t.value="",window.cleanupInlineAutocomplete?.("review-quick-add-input"),typeof window.render=="function"&&window.render(),setTimeout(()=>{const i=document.getElementById("review-quick-add-input");i&&i.focus()},50)}function Sx(e,t,n){e._inlineAcHandled||e.key==="Enter"&&(e.preventDefault(),Ap(n,t,r.quickAddIsNote))}function Mp(){const e=r.taskAreas.filter(Boolean);if(e.length===0)return`
      <div class="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
        <div class="w-16 h-16 rounded-xl flex items-center justify-center mb-4 bg-[var(--bg-secondary)]">
          ${ve().review}
        </div>
        <p class="text-lg font-medium mb-1">No areas to review</p>
        <p class="text-sm">Create areas in your workspace first</p>
        <button onclick="exitReview()" class="mt-4 px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition">
          Exit Review
        </button>
      </div>
    `;const t=e[r.reviewAreaIndex];if(!t)return r.reviewAreaIndex=0,Mp();const n=r.reviewCompletedAreas.length,a=e.length,s=r.reviewCompletedAreas.includes(t.id),o=r.triggers.filter(v=>v.areaId===t.id),i=ql(t.id),l=r.tasksData.filter(v=>v.areaId===t.id&&v.isProject&&!v.completed),d=r.tasksData.filter(v=>v.isNote&&v.areaId===t.id&&!v.completed&&v.noteLifecycleState!=="deleted");function c(v){if(!v)return"Never reviewed";const f=Date.now()-new Date(v).getTime(),p=Math.floor(f/(1e3*60*60*24));return p===0?"Today":p===1?"Yesterday":`${p} days ago`}const h=t.color||"#147EFB";return`
    <div class="review-mode review-mode-scrollable">
      <!-- Compact header: Review title + progress + area -->
      <div class="review-header-compact mb-5">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 flex items-center justify-center rounded-lg" style="background: ${h}15; color: ${h}">
              ${ve().review}
            </span>
            <div>
              <h2 class="text-lg font-bold text-[var(--text-primary)]">Weekly Review</h2>
              <p class="text-xs text-[var(--text-muted)]">${n} of ${a} areas</p>
            </div>
          </div>
          <button onclick="exitReview()" class="px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-lg text-sm font-medium hover:bg-[var(--bg-tertiary)] transition">
            Exit
          </button>
        </div>
        <div class="flex items-center gap-3 flex-wrap">
          <div class="flex items-center gap-2 min-w-0 flex-1">
            <span class="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style="background: ${h}15">
              ${t.emoji||ve().area.replace("w-5 h-5","w-5 h-5")}
            </span>
            <div class="min-w-0">
              <h3 class="text-base font-bold text-[var(--text-primary)] truncate">${A(t.name)}</h3>
              <p class="text-xs text-[var(--text-muted)]">${l.length} projects · ${o.length} triggers · ${i.length} tasks · ${d.length} notes</p>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            ${r.reviewAreaIndex>0?'<button onclick="reviewPrevArea()" class="p-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition" aria-label="Previous area"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg></button>':""}
            ${r.reviewAreaIndex<e.length-1?'<button onclick="reviewNextArea()" class="p-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition" aria-label="Next area"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg></button>':""}
          </div>
        </div>
        <div class="flex gap-1.5 mt-3">
          ${e.map((v,f)=>`
            <button onclick="state.reviewAreaIndex=${f}; render()"
              class="review-progress-dot w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition flex-shrink-0
                ${r.reviewCompletedAreas.includes(v.id)?"bg-[var(--success)] text-white":f===r.reviewAreaIndex?"ring-2 ring-offset-1":"bg-[var(--bg-secondary)] text-[var(--text-muted)]"}"
              style="${f===r.reviewAreaIndex?`ring-color: ${v.color||"#147EFB"}; background: ${v.color||"#147EFB"}20; color: ${v.color||"#147EFB"}`:""}"
              title="${A(v.name)}">
              ${r.reviewCompletedAreas.includes(v.id)?'<svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>':`${f+1}`}
            </button>
          `).join("")}
        </div>
      </div>

      <!-- Fixed capture bar: always visible at bottom -->
      <div class="review-capture-bar review-capture-bar-fixed">
        <div class="review-capture-bar-inner p-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="flex-1 flex items-center gap-3 min-h-[44px]">
            <div onclick="state.quickAddIsNote = !state.quickAddIsNote; render()"
              class="quick-add-type-toggle cursor-pointer flex-shrink-0" title="${r.quickAddIsNote?"Switch to Task":"Switch to Note"}">
              ${r.quickAddIsNote?'<div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-accent)]"></div>':'<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed border-[var(--text-muted)]/30 flex-shrink-0"></div>'}
            </div>
            <input type="text" id="review-quick-add-input"
              placeholder="${r.quickAddIsNote?"New Note":"New To-Do"}"
              onkeydown="window.reviewHandleQuickAddKeydown(event, this, '${t.id}')"
              class="flex-1 min-w-0 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 bg-transparent border-0 outline-none focus:ring-0">
            <button onclick="window.reviewQuickAddTask('${t.id}', document.getElementById('review-quick-add-input'), state.quickAddIsNote)"
              class="flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition min-h-[44px] flex items-center justify-center border-0" style="background: ${h}15; color: ${h}" title="Add">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
          <button onclick="window.createRootTrigger({areaId:'${t.id}'})"
            class="review-capture-trigger-btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium min-h-[44px] transition" style="background: #FFCC0015; color: #B8860B" title="Add trigger">
            <span style="color: #FFCC00">${ve().trigger.replace("w-5 h-5","w-4 h-4")}</span>
            Add trigger
          </button>
        </div>
        <p class="text-[11px] text-[var(--text-muted)] mt-2">Supports #label +person due:date in the input</p>
        </div>
      </div>

      <!-- Vertical layout: Tasks, Notes, Triggers (full width) -->
      <div class="review-mode-content flex flex-col gap-5 mb-6">
        <!-- Tasks -->
        <div class="review-tasks-section rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] overflow-hidden flex flex-col">
          <div class="px-4 py-3 border-b border-[var(--border-light)]">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/></svg>
              <span class="text-sm font-semibold text-[var(--text-primary)]">Tasks to review</span>
              <span class="text-xs text-[var(--text-muted)] ml-1">${i.length}</span>
            </div>
          </div>
          <div class="flex-1 overflow-y-auto" style="max-height: 50vh">
            ${i.length>0?`
              <div class="divide-y divide-[var(--border-light)]">
                ${i.map(v=>`
                  <div class="review-task-card px-4 py-3">
                    <div class="flex items-start gap-3">
                      <span class="w-5 h-5 mt-0.5 rounded-full border-2 flex-shrink-0" style="border-color: ${h}40"></span>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-[var(--text-primary)] truncate">${A(v.title||"Untitled")}</p>
                        <p class="text-xs text-[var(--text-muted)] mt-0.5">${c(v.lastReviewedAt)}</p>
                      </div>
                      <div class="flex items-center gap-2 flex-shrink-0">
                        <button onclick="reviewEngageTask('${v.id}')"
                          class="review-action-btn px-3 py-2 min-h-[44px] text-xs font-medium rounded-lg transition" style="background: ${h}15; color: ${h}">
                          Open
                        </button>
                        <button onclick="reviewPassTask('${v.id}')"
                          class="review-action-btn px-3 py-2 min-h-[44px] bg-[var(--bg-secondary)] text-[var(--text-muted)] text-xs font-medium rounded-lg hover:bg-[var(--bg-tertiary)] transition">
                          Skip for now
                        </button>
                      </div>
                    </div>
                  </div>
                `).join("")}
              </div>
            `:`
              <div class="px-4 py-8 text-center">
                <svg class="w-8 h-8 mx-auto mb-2 text-[var(--success)] opacity-60" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                <p class="text-sm font-medium text-[var(--text-primary)]">All caught up in this area</p>
                <p class="text-xs text-[var(--text-muted)] mt-0.5">Nothing to review — add above when ready</p>
                <button onclick="reviewMarkAreaDone()" class="mt-3 text-xs font-medium text-[var(--accent)] hover:underline">
                  Continue to next area
                </button>
              </div>
            `}
          </div>
        </div>

        <!-- Notes -->
        <div class="review-notes-section rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] overflow-hidden flex flex-col">
          <button onclick="state.reviewNotesCollapsed = !state.reviewNotesCollapsed; render()"
            class="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[var(--bg-secondary)]/30 transition">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[var(--notes-color)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              <span class="text-sm font-semibold text-[var(--text-primary)]">Notes</span>
              <span class="text-xs text-[var(--text-muted)] ml-1">${d.length}</span>
            </div>
            <span class="text-[var(--text-muted)] transition-transform ${r.reviewNotesCollapsed?"":"rotate-180"}">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </span>
          </button>
          ${r.reviewNotesCollapsed?`
          <div class="px-4 py-3 border-t border-[var(--border-light)]">
            <p class="text-xs text-[var(--text-muted)]">Click to expand — review notes in this area</p>
          </div>
          `:`
          <div class="border-t border-[var(--border-light)] flex items-center justify-between px-4 py-2 flex-shrink-0" style="background: color-mix(in srgb, var(--notes-color) 8%, transparent)">
            <span class="text-xs text-[var(--text-muted)]">Review and edit notes</span>
            <button onclick="event.stopPropagation(); window.createRootNote({areaId:'${t.id}'})"
              class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg transition" style="color: var(--notes-color); background: color-mix(in srgb, var(--notes-color) 12%, transparent)">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Add note
            </button>
          </div>
          <div class="py-2 flex-1 overflow-y-auto min-h-[200px]" style="max-height: 45vh">
            ${tp({areaId:t.id})}
          </div>
          `}
        </div>

        <!-- Triggers (full width, expanded, takes remaining space) -->
        <div class="review-triggers-section">
          <div class="rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] overflow-hidden flex flex-col flex-1 min-h-0">
            <button onclick="state.reviewTriggersCollapsed = !state.reviewTriggersCollapsed; render()"
              class="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-[var(--bg-secondary)]/30 transition flex-shrink-0" style="background: #FFCC0008">
              <div class="flex items-center gap-2">
                <span style="color: #FFCC00">${ve().trigger.replace("w-5 h-5","w-4 h-4")}</span>
                <span class="text-sm font-semibold text-[var(--text-primary)]">Triggers</span>
                <span class="text-xs text-[var(--text-muted)] ml-1">${o.length}</span>
              </div>
              <span class="text-[var(--text-muted)] transition-transform ${r.reviewTriggersCollapsed?"":"rotate-180"}">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
              </span>
            </button>
            ${r.reviewTriggersCollapsed?`
            <div class="px-4 py-3 border-t border-[var(--border-light)]">
              <p class="text-xs text-[var(--text-muted)]">Click to expand — review triggers for new ideas</p>
            </div>
            `:`
            <div class="border-t border-[var(--border-light)] flex items-center justify-between px-4 py-1.5 flex-shrink-0" style="background: #FFCC0005">
              <span class="text-xs text-[var(--text-muted)]">Read each — does anything need a new task?</span>
              <button onclick="event.stopPropagation(); window.createRootTrigger({areaId:'${t.id}'})"
                class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#FFCC00] hover:bg-[#FFCC0010] rounded-lg transition">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                Add
              </button>
            </div>
            <div class="review-triggers-content py-1.5 flex-1 overflow-y-auto min-h-[200px]">
              ${$p({areaId:t.id})}
            </div>
            `}
          </div>
        </div>
      </div>

      <!-- Projects (collapsible, at bottom to reduce clutter) -->
      ${l.length>0?`
        <div class="mb-6 rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] overflow-hidden">
          <button onclick="state.reviewProjectsCollapsed = !state.reviewProjectsCollapsed; render()"
            class="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[var(--bg-secondary)]/30 transition">
            <div class="flex items-center gap-2">
              <span>📋</span>
              <span class="text-sm font-semibold text-[var(--text-primary)]">Projects</span>
              <span class="text-xs text-[var(--text-muted)] ml-1">${l.length}</span>
            </div>
            <span class="text-[var(--text-muted)] transition-transform ${r.reviewProjectsCollapsed?"":"rotate-180"}">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            </span>
          </button>
          ${r.reviewProjectsCollapsed?"":`
          <div class="divide-y divide-[var(--border-light)]">
            ${l.map(v=>{const f=window.getProjectCompletion?.(v.id)||0,p=window.getProjectSubTasks?.(v.id)?.length||0,m=window.isProjectStalled?.(v.id)||!1;return`
                <div class="px-4 py-3 hover:bg-[var(--bg-secondary)]/30 transition cursor-pointer" onclick="reviewEngageTask('${v.id}')">
                  <div class="flex items-start gap-3">
                    <span class="w-5 h-5 mt-0.5 text-lg flex-shrink-0">📋</span>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <p class="text-sm font-medium text-[var(--text-primary)] truncate">${A(v.title||"Untitled Project")}</p>
                        ${m?'<span class="px-1.5 py-0.5 bg-[var(--warning)]/15 text-[var(--warning)] text-[10px] font-medium rounded">Stalled</span>':""}
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="flex-1 h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                          <div class="h-full rounded-full transition-all" style="width: ${f}%; background: ${h}"></div>
                        </div>
                        <span class="text-xs text-[var(--text-muted)] tabular-nums">${f}%</span>
                      </div>
                      <p class="text-xs text-[var(--text-muted)] mt-1">${p} ${p===1?"task":"tasks"} · ${v.projectType==="sequential"?"📝 Sequential":"📋 Parallel"}</p>
                    </div>
                  </div>
                </div>
              `}).join("")}
          </div>
          `}
        </div>
      `:""}

      <!-- Area Complete Button (sticky on mobile) -->
      <div class="review-mark-done-bar flex items-center justify-center gap-3 mt-6">
        ${s?`
          <div class="flex items-center gap-2 text-[var(--success)] text-sm font-medium">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            Area done
          </div>
        `:`
          <button onclick="reviewMarkAreaDone()"
            class="review-mark-done-btn px-6 py-3 rounded-lg text-base font-semibold text-white shadow-sm hover:opacity-90 transition" style="background: ${h}">
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              Mark area done
            </span>
          </button>
        `}
      </div>

      <!-- Review Complete -->
      ${n===a?`
        <div class="mt-10 text-center bg-[var(--success)]/10 rounded-xl p-8 border border-[var(--success)]/20">
          <svg class="w-14 h-14 mx-auto mb-4 text-[var(--success)]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          <h3 class="text-xl font-bold text-[var(--success)] mb-2">Review complete!</h3>
          <p class="text-sm text-[var(--text-muted)] mb-5">All ${a} areas done — great work.</p>
          <button onclick="exitReview()" class="px-6 py-3 bg-[var(--success)] text-white rounded-lg text-base font-semibold hover:opacity-90 transition">
            Done
          </button>
        </div>
      `:""}
    </div>
  `}function Tx(e){if(!e)return;const t=An();(!t.customPerspectives||typeof t.customPerspectives!="object")&&(t.customPerspectives={}),t.customPerspectives[String(e)]=new Date().toISOString(),Mn()}function Ix(e){if(!e)return;const t=An();t.customPerspectives&&t.customPerspectives[String(e)]!==void 0&&(delete t.customPerspectives[String(e)],Mn())}function Pp(e,t,n){const a=new Date().toISOString(),s={id:ia("custom"),name:e,icon:t||"📌",filter:n,builtin:!1,createdAt:a,updatedAt:a};return Ix(s.id),r.customPerspectives.push(s),le(),s}function Cx(e){Tx(e),r.customPerspectives=r.customPerspectives.filter(t=>t.id!==e),r.activePerspective===e&&(r.activePerspective="inbox",Ge()),le()}function Ex(e){r.editingPerspectiveId=e,r.showPerspectiveModal=!0,window.render(),setTimeout(()=>{const t=r.customPerspectives.find(o=>o.id===e);if(!t)return;const n=o=>document.getElementById(o),a=(o,i)=>{const l=n(o);l&&(l.value=i)},s=o=>{const i=n(o);i&&(i.checked=!0)};a("perspective-name",t.name),a("perspective-icon",t.icon),t.filter.categoryId&&a("perspective-category",t.filter.categoryId),t.filter.status&&a("perspective-status",t.filter.status),t.filter.logic&&a("perspective-logic",t.filter.logic),t.filter.availability&&a("perspective-availability",t.filter.availability),t.filter.statusRule&&a("perspective-status-rule",t.filter.statusRule),t.filter.personId&&a("perspective-person",t.filter.personId),t.filter.tagMatch&&a("perspective-tags-mode",t.filter.tagMatch),t.filter.hasDueDate&&s("perspective-due"),t.filter.hasDeferDate&&s("perspective-defer"),t.filter.isRepeating&&s("perspective-repeat"),t.filter.isUntagged&&s("perspective-untagged"),t.filter.inboxOnly&&s("perspective-inbox"),t.filter.dateRange&&(t.filter.dateRange.type&&a("perspective-range-type",t.filter.dateRange.type),t.filter.dateRange.start&&a("perspective-range-start",t.filter.dateRange.start),t.filter.dateRange.end&&a("perspective-range-end",t.filter.dateRange.end)),t.filter.searchTerms&&a("perspective-search",t.filter.searchTerms),t.filter.labelIds&&t.filter.labelIds.forEach(o=>{const i=document.querySelector(`.perspective-tag-checkbox[value="${o}"]`);i&&(i.checked=!0)})},10)}function $x(e){if(!e)return;const t=An();(!t.homeWidgets||typeof t.homeWidgets!="object")&&(t.homeWidgets={}),t.homeWidgets[String(e)]=new Date().toISOString(),Mn()}function Dx(e){if(!e)return;const t=An();t.homeWidgets&&t.homeWidgets[String(e)]!==void 0&&(delete t.homeWidgets[String(e)],Mn())}function Rt(){try{localStorage.setItem(Ot,JSON.stringify(r.homeWidgets))}catch(e){e.name==="QuotaExceededError"&&console.error("Storage quota exceeded for homeWidgets")}typeof window.debouncedSaveToGithub=="function"&&window.debouncedSaveToGithub()}function ic(){const e=new Map(ls.map(a=>[a.id,a])),t=new Map((r.homeWidgets||[]).map(a=>[a.id,a])),n=[];ls.forEach((a,s)=>{const o=t.get(a.id);n.push({...a,...o,visible:o?.visible??a.visible,order:o?.order??s})}),(r.homeWidgets||[]).forEach(a=>{!e.has(a.id)&&a.id!=="daily-entry"&&n.push(a)}),n.sort((a,s)=>(a.order??0)-(s.order??0)),n.forEach((a,s)=>{a.order=s}),r.homeWidgets=n,Rt()}function _x(e){const t=r.homeWidgets.find(n=>n.id===e);if(t){if((t.id==="today-tasks"||t.id==="todays-score")&&t.visible)return;t.visible=!t.visible,Rt(),window.render()}}function Ax(e){const t=r.homeWidgets.find(n=>n.id===e);t&&(t.size=t.size==="full"?"half":"full",Rt(),window.render())}function Mx(e){const t=r.homeWidgets.findIndex(n=>n.id===e);t>0&&([r.homeWidgets[t],r.homeWidgets[t-1]]=[r.homeWidgets[t-1],r.homeWidgets[t]],r.homeWidgets.forEach((n,a)=>n.order=a),Rt(),window.render())}function Px(e){const t=r.homeWidgets.findIndex(n=>n.id===e);t<r.homeWidgets.length-1&&([r.homeWidgets[t],r.homeWidgets[t+1]]=[r.homeWidgets[t+1],r.homeWidgets[t]],r.homeWidgets.forEach((n,a)=>n.order=a),Rt(),window.render())}function Nx(e,t){r.draggingWidgetId=t,e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t),e.target.classList.add("dragging")}function Lx(e){e.target.classList.remove("dragging"),document.querySelectorAll(".widget").forEach(t=>t.classList.remove("drag-over")),r.draggingWidgetId=null}function Ox(e,t){e.preventDefault(),e.dataTransfer.dropEffect="move",!(!r.draggingWidgetId||r.draggingWidgetId===t)&&(document.querySelectorAll(".widget").forEach(n=>n.classList.remove("drag-over")),e.currentTarget.classList.add("drag-over"))}function Rx(e){e.currentTarget.contains(e.relatedTarget)||e.currentTarget.classList.remove("drag-over")}function Bx(e,t){if(e.preventDefault(),e.currentTarget.classList.remove("drag-over"),!r.draggingWidgetId||r.draggingWidgetId===t){r.draggingWidgetId=null;return}const n=r.homeWidgets.findIndex(s=>s.id===r.draggingWidgetId),a=r.homeWidgets.findIndex(s=>s.id===t);if(n!==-1&&a!==-1){const[s]=r.homeWidgets.splice(n,1),o=n<a?a-1:a;r.homeWidgets.splice(o,0,s),r.homeWidgets.forEach((i,l)=>i.order=l),Rt(),window.render()}r.draggingWidgetId=null}function jx(){r.homeWidgets=JSON.parse(JSON.stringify(ls)),localStorage.removeItem(Ot),Rt(),window.render()}function Fx(){r.editingHomeWidgets=!r.editingHomeWidgets,r.editingHomeWidgets||(r.showAddWidgetPicker=!1),window.render()}function Hx(e){if(r.homeWidgets.some(s=>s.id==="perspective-"+e))return;const n=[...Ue,ut,...r.customPerspectives||[]].find(s=>s.id===e);if(!n)return;const a=r.homeWidgets.reduce((s,o)=>Math.max(s,o.order??0),-1);r.homeWidgets.push({id:"perspective-"+e,type:"perspective",title:n.name,perspectiveId:e,size:"half",order:a+1,visible:!0}),Dx("perspective-"+e),Rt(),r.showAddWidgetPicker=!1,window.render()}function zx(e){$x(e),r.homeWidgets=r.homeWidgets.filter(t=>t.id!==e),r.homeWidgets.sort((t,n)=>(t.order??0)-(n.order??0)),r.homeWidgets.forEach((t,n)=>{t.order=n}),Rt(),window.render()}function qt(e){const t=new Date(r.calendarSelectedDate+"T12:00:00");t.setDate(t.getDate()+e);const n=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;r.calendarSelectedDate=n,r.calendarMonth=t.getMonth(),r.calendarYear=t.getFullYear()}function Wx(){if(r.calendarViewMode==="week"){qt(-7),window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render();return}if(r.calendarViewMode==="weekgrid"){qt(-7),window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render();return}if(r.calendarViewMode==="daygrid"){qt(-1),window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render();return}if(r.calendarViewMode==="3days"){qt(-3),window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render();return}r.calendarMonth--,r.calendarMonth<0&&(r.calendarMonth=11,r.calendarYear--),window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render()}function Ux(){if(r.calendarViewMode==="week"){qt(7),window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render();return}if(r.calendarViewMode==="weekgrid"){qt(7),window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render();return}if(r.calendarViewMode==="daygrid"){qt(1),window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render();return}if(r.calendarViewMode==="3days"){qt(3),window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render();return}r.calendarMonth++,r.calendarMonth>11&&(r.calendarMonth=0,r.calendarYear++),window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render()}function Gx(){const e=new Date;r.calendarMonth=e.getMonth(),r.calendarYear=e.getFullYear(),r.calendarSelectedDate=he(),window.render()}function Vx(e){["month","week","3days","daygrid","weekgrid"].includes(e)&&(r.calendarViewMode=e,window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render())}function qx(e){if(!/^\d{4}-\d{2}-\d{2}$/.test(e))return;r.calendarSelectedDate=e;const t=e.split("-"),n=parseInt(t[0]),a=parseInt(t[1])-1;(n!==r.calendarYear||a!==r.calendarMonth)&&(r.calendarYear=n,r.calendarMonth=a),window.render()}function ns(e){return r.tasksData.filter(t=>t.completed||t.isNote?!1:t.dueDate===e||t.deferDate===e)}function Kx(){r.calendarSidebarCollapsed=!r.calendarSidebarCollapsed,window.render()}function dn(){return localStorage.getItem(Ur)||""}function Yx(e){const t=(e||"").trim();t?localStorage.setItem(Ur,t):localStorage.removeItem(Ur)}async function Jx(e){const t=(e||"").trim();if(!t)return"";const n=dn();if(!n)return t;const a=new AbortController,s=setTimeout(()=>a.abort(),2e4);try{const o=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":n,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:1024,system:"You clean up speech-to-text output for a productivity app. Fix punctuation/casing and preserve the original meaning. Return only cleaned plain text.",messages:[{role:"user",content:t}]}),signal:a.signal});return clearTimeout(s),o.ok&&((await o.json())?.content?.[0]?.text||"").trim()||t}catch{return clearTimeout(s),t}}async function Xx(e){const t=dn();if(!t)throw new Error("No API key configured");const n=r.taskAreas.map(d=>d.name),a=r.taskLabels.map(d=>d.name),s=r.taskPeople.map(d=>d.name),o=`You are a classification assistant for a personal productivity app. Your job is to take raw freeform text and split it into individual items, then classify each as a task OR a note.

The user has these Areas: ${JSON.stringify(n)}
The user has these Tags: ${JSON.stringify(a)}
The user has these People: ${JSON.stringify(s)}

Rules:
1. SPLIT compound paragraphs into separate items. If a sentence contains multiple actions or distinct thoughts, split them.
2. CLASSIFY each item as "task" or "note":
   - TASK: a forward-looking action the user needs to DO. Contains imperatives, obligations, or explicit intent to act. Examples: "Buy groceries", "Call dentist", "Need to finish report by Friday".
   - NOTE: anything that is NOT a clear action. This includes: observations ("missed my vitamins today"), reflections ("feeling tired lately"), ideas ("maybe try a standing desk"), facts ("meeting was moved to 3pm"), journal entries ("had a great workout"), questions ("what's the best protein powder?"), references, or bookmarks.
   - When in doubt, prefer "note". Only classify as "task" when there is a clear, unambiguous action to perform.
   - Past-tense statements are almost always notes — do NOT convert them into tasks. "Missed taking vitamins" is a note, NOT a task to "Take vitamins".
3. EXTRACT metadata by matching against the provided lists:
   - area: match to one of the user's Areas (exact name, case-insensitive). null if no match.
   - tags: array of matched Tag names. Empty array if none.
   - people: array of matched People names. Empty array if none.
   - deferDate: if a start/defer date is mentioned, return YYYY-MM-DD. null otherwise.
   - dueDate: if a deadline/due date is mentioned, return YYYY-MM-DD. null otherwise.
4. Provide a CONFIDENCE score 0.0-1.0 for each classification.
5. Clean up the title: remove metadata markers (#, @, &, !) but PRESERVE the original meaning and tense. For tasks, make it a clean action. For notes, keep it as the user wrote it — do NOT rewrite notes into actions.

Today's date is ${new Date().toISOString().split("T")[0]}.

Respond with ONLY valid JSON — no markdown, no explanation. The JSON must be an array of objects:
[
  {
    "title": "Clean title preserving original intent",
    "type": "task" or "note",
    "confidence": 0.0-1.0,
    "area": "Area Name" or null,
    "tags": ["Tag Name", ...],
    "people": ["Person Name", ...],
    "deferDate": "YYYY-MM-DD" or null,
    "dueDate": "YYYY-MM-DD" or null
  }
]`,i=new AbortController,l=setTimeout(()=>i.abort(),3e4);try{const d=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":t,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:4096,system:o,messages:[{role:"user",content:e}]}),signal:i.signal});if(clearTimeout(l),!d.ok){const m=await d.text().catch(()=>"");throw new Error(`API error ${d.status}: ${m}`)}let v=((await d.json()).content?.[0]?.text||"").trim();v.startsWith("```")&&(v=v.replace(/^```(?:json)?\s*/,"").replace(/\s*```$/,""));const f=JSON.parse(v);if(!Array.isArray(f))throw new Error("Response is not an array");const p=m=>typeof m=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(m);return f.filter(m=>(m.title||"").trim()).map((m,g)=>{let y=null;if(m.area){const k=r.taskAreas.find(E=>E.name.toLowerCase()===m.area.toLowerCase());k&&(y=k.id)}const u=(m.tags||[]).map(k=>{const E=r.taskLabels.find(D=>D.name.toLowerCase()===k.toLowerCase());return E?E.id:null}).filter(Boolean),x=(m.people||[]).map(k=>{const E=r.taskPeople.find(D=>D.name.toLowerCase()===k.toLowerCase());return E?E.id:null}).filter(Boolean);return{index:g,originalText:m.title||"",title:m.title||"",type:m.type==="note"?"note":"task",score:m.type==="task"?50:-50,confidence:Math.max(0,Math.min(1,m.confidence||.8)),areaId:y,labels:u,people:x,deferDate:p(m.deferDate)?m.deferDate:null,dueDate:p(m.dueDate)?m.dueDate:null,included:!0}})}catch(d){throw clearTimeout(l),d.name==="AbortError"?new Error("Classification timed out — try shorter text or check your connection"):d}}function Qx(e){if(!e||!e.trim())return[];const t=e.split(`
`),n=[];for(const a of t){let s=a.replace(/^\s*[-*•‣◦]\s+/,"").replace(/^\s*\d+[.)]\s+/,"").trim();s&&n.push(s)}return n}function Zx(e){let t=0;const a=e.toLowerCase().split(/\s+/),s=a[0]||"";ud.includes(s)&&(t+=40),(/\b(by\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next|end\s+of))\b/i.test(e)||/\b(due|deadline|before)\b/i.test(e))&&(t+=30),/\b(need\s+to|must|have\s+to|should)\b/i.test(e)&&(t+=25),/!\w/.test(e)&&(t+=35),a.length<=12&&!e.includes("?")&&ud.includes(s)&&(t+=20),/&\w/.test(e)&&(t+=15),/\b(today|tonight|this\s+(week|morning|afternoon|evening)|asap|urgently)\b/i.test(e)&&(t+=10),/^#\w|[\s]#\w/.test(e)&&(t+=10),/^@\w|[\s]@\w/.test(e)&&(t+=10),/^(note|idea|thought|remember|observation|insight|reflection):/i.test(e)&&(t-=50),/\b(missed|forgot|forgotten|didn't|didn't|wasn't|wasn't|couldn't|couldn't|had\s+a|went\s+to|was\s+\w+ing|felt\s+|noticed\s+|realized\s+|found\s+out)\b/i.test(e)&&(t-=35),/^i\s+(missed|forgot|had|was|went|felt|saw|heard|met|got|did|made|took|came|ran|ate|slept)\b/i.test(e)&&(t-=30),/\.\s+[A-Z]/.test(e)&&(t-=30),/\b(i\s+think|i\s+feel|i\s+wonder|perhaps|maybe|it\s+seems|i\s+believe|in\s+my\s+opinion)\b/i.test(e)&&(t-=25),e.trim().endsWith("?")&&(t-=20),/^(the|a|an|this|that|these|those)\s/i.test(e)&&(t-=15),/^https?:\/\/\S+$/i.test(e.trim())&&(t-=40),/^["'"'\u201C\u2018]/.test(e.trim())&&(t-=30);const o=t>0?"task":"note",i=Math.min(1,Math.abs(t)/60);return{type:o,score:t,confidence:i}}function e2(e){let t=e,n=null;const a=[],s=[];let o=null,i=null;const l=t.match(/#(\w+)/g);if(l)for(const f of l){const p=f.slice(1).toLowerCase(),m=r.taskAreas.find(g=>g.name.toLowerCase()===p);m&&(n=m.id,t=t.replace(f,"").trim())}const d=t.match(/@(\w+)/g);if(d)for(const f of d){const p=f.slice(1).toLowerCase(),m=r.taskLabels.find(g=>g.name.toLowerCase()===p);m&&!a.includes(m.id)&&(a.push(m.id),t=t.replace(f,"").trim())}const c=t.match(/&(\w+)/g);if(c)for(const f of c){const p=f.slice(1).toLowerCase(),m=r.taskPeople.find(g=>g.name.toLowerCase()===p);m&&!s.includes(m.id)&&(s.push(m.id),t=t.replace(f,"").trim())}const h=t.match(/!(\w+)/g);if(h&&typeof window.parseDateQuery=="function")for(const f of h){const p=f.slice(1),m=window.parseDateQuery(p);if(m&&m.length>0){o=m[0].date,t=t.replace(f,"").trim();break}}const v=[{regex:/\b(tomorrow)\b/i,query:"tomorrow"},{regex:/\b(today)\b/i,query:"today"},{regex:/\bnext\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,query:null},{regex:/\bby\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,query:null}];if(!o&&typeof window.parseDateQuery=="function")for(const{regex:f,query:p}of v){const m=t.match(f);if(m){const g=p||m[1],y=window.parseDateQuery(g);if(y&&y.length>0){i=y[0].date;break}}}return t=t.replace(/\s{2,}/g," ").trim(),{title:t,areaId:n,labels:a,people:s,deferDate:o,dueDate:i}}function Pi(e){return Qx(e).map((n,a)=>{const s=Zx(n),o=e2(n);return{index:a,originalText:n,title:o.title,type:s.type,score:s.score,confidence:s.confidence,areaId:o.areaId,labels:o.labels,people:o.people,deferDate:o.deferDate,dueDate:o.dueDate,included:!0}})}async function Np(e){if(r.braindumpAIError=null,!dn())return Pi(e);try{const t=await Xx(e);if(t&&t.length>0)return t;r.braindumpAIError="AI returned empty results"}catch(t){console.warn("AI classification failed, falling back to heuristic:",t.message),r.braindumpAIError=t.message}return Pi(e)}function Lp(e){let t=0,n=0;const a=e.filter(s=>s.included);for(const s of a){const o=s.type==="note",i=gr(s.title,{isNote:o,areaId:s.areaId,labels:s.labels,people:s.people,deferDate:s.deferDate,dueDate:s.dueDate,status:s.areaId?"anytime":"inbox"});o&&i&&(i.noteLifecycleState="active",i.noteHistory=[{action:"created",source:"braindump",at:i.createdAt}]),o?n++:t++}return{taskCount:t,noteCount:n}}const t2="modulepreload",n2=function(e){return"/lifeg/"+e},lc={},r2=function(t,n,a){let s=Promise.resolve();if(n&&n.length>0){let d=function(c){return Promise.all(c.map(h=>Promise.resolve(h).then(v=>({status:"fulfilled",value:v}),v=>({status:"rejected",reason:v}))))};document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),l=i?.nonce||i?.getAttribute("nonce");s=d(n.map(c=>{if(c=n2(c),c in lc)return;lc[c]=!0;const h=c.endsWith(".css"),v=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${v}`))return;const f=document.createElement("link");if(f.rel=h?"stylesheet":t2,h||(f.as="script"),f.crossOrigin="",f.href=c,l&&f.setAttribute("nonce",l),document.head.appendChild(f),h)return new Promise((p,m)=>{f.addEventListener("load",p),f.addEventListener("error",()=>m(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(i){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=i,window.dispatchEvent(l),!l.defaultPrevented)throw i}return s.then(i=>{for(const l of i||[])l.status==="rejected"&&o(l.reason);return t().catch(o)})};function Ni(e,t="instance"){return e?t==="series"&&e.recurringEventId?`${e.calendarId}::series::${e.recurringEventId}`:`${e.calendarId}::instance::${e.id}`:""}function Kl(e){return Ni(e,r.calendarMeetingNotesScope||"instance")}function Ea(e){if(!e)return[];const t=[`${e.calendarId}::instance::${e.id}`];return e.recurringEventId&&t.push(`${e.calendarId}::series::${e.recurringEventId}`),t}function Fr(e){const t=Ea(e);if(!t.length)return!1;const n=r.meetingNotesByEvent||{};return t.some(s=>!!n[s])?!0:r.tasksData.some(s=>t.includes(s.meetingEventKey))}function Op(){localStorage.setItem(ir,JSON.stringify(r.meetingNotesByEvent||{})),typeof window.debouncedSaveToGithub=="function"&&window.debouncedSaveToGithub()}function vr(e,t){return(r.gcalEvents||[]).find(n=>n.calendarId===e&&n.id===t)||null}function a2(e){return e?e.start?.date?e.start.date:(e.start?.dateTime||"").slice(0,10)||he():he()}function bo(e){const t=Kl(e);return t?(r.meetingNotesByEvent||(r.meetingNotesByEvent={}),r.meetingNotesByEvent[t]||(r.meetingNotesByEvent[t]={eventKey:t,calendarId:e.calendarId,eventId:e.id,title:e.summary||"Untitled Event",content:"",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},Op()),r.meetingNotesByEvent[t]):null}function yo(){const e=r.calendarMeetingNotesEventKey;if(!e)return null;const t=e.split("::");if(t.length<3)return null;const[n,a,s]=t;return a==="series"?(r.gcalEvents||[]).find(o=>o.calendarId===n&&o.recurringEventId===s)||null:vr(n,s)||null}function s2(e){if(!e)return[];if(typeof e=="string")return r.tasksData.filter(n=>n.meetingEventKey===e);const t=Ea(e);return r.tasksData.filter(n=>t.includes(n.meetingEventKey))}function o2(e){if(!e)return{attendeePeople:[],matchingItems:[],tasks:[],notes:[]};const t=new Set((Array.isArray(e.attendees)?e.attendees:[]).map(d=>Jn(d?.email)).filter(Boolean)),n=r.taskPeople.filter(d=>t.has(Jn(d?.email))),a=new Set(n.map(d=>d.id)),s=Ea(e),o=he(),i=d=>{let c=0;return d.isNote||(c+=20),d.flagged&&(c+=14),d.today&&(c+=10),d.dueDate&&(d.dueDate<o?c+=22:d.dueDate===o?c+=18:Math.ceil((new Date(`${d.dueDate}T12:00:00`)-new Date(`${o}T12:00:00`))/864e5)<=7&&(c+=7)),s.includes(d.meetingEventKey)&&(c+=12),c},l=r.tasksData.filter(d=>!d.completed).filter(d=>(d.people||[]).some(c=>a.has(c))).sort((d,c)=>{const h=i(c)-i(d);return h!==0?h:String(c.updatedAt||c.createdAt||"").localeCompare(String(d.updatedAt||d.createdAt||""))});return{attendeePeople:n,matchingItems:l,tasks:l.filter(d=>!d.isNote),notes:l.filter(d=>d.isNote)}}function Li(e){return A(e||"").replace(/\n/g,"<br>")}function i2(e){const t=String(e||"");if(!t.trim())return"";if(!/[<>]/.test(t)||typeof document>"u")return Li(t);const n=new Set(["a","p","br","ul","ol","li","b","strong","i","em","u","code","pre","blockquote","h1","h2","h3","h4","h5","h6","div","span"]),a=new Set(["href","title","target","rel"]),s=document.createElement("template");s.innerHTML=t;const o=i=>{if(i.nodeType===Node.TEXT_NODE)return;if(i.nodeType!==Node.ELEMENT_NODE){i.remove();return}const l=i.tagName.toLowerCase();if(!n.has(l)){const d=document.createTextNode(i.textContent||"");i.replaceWith(d);return}Array.from(i.attributes).forEach(d=>{const c=d.name.toLowerCase(),h=d.value||"";if(c.startsWith("on")||!a.has(c)){i.removeAttribute(d.name);return}if(c==="href"){const f=h.trim().toLowerCase();f.startsWith("http://")||f.startsWith("https://")||f.startsWith("mailto:")||i.removeAttribute(d.name)}}),l==="a"&&i.getAttribute("href")&&(i.setAttribute("target","_blank"),i.setAttribute("rel","noopener noreferrer")),Array.from(i.childNodes).forEach(o)};return Array.from(s.content.childNodes).forEach(o),s.innerHTML}function l2(){return r.calendarEventModalOpen?vr(r.calendarEventModalCalendarId,r.calendarEventModalEventId):null}const Oi=Zi;function we(e){return String(e||"").replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/"/g,"&quot;")}function d2(e,t){const n=vr(e,t);if(n){if(Fr(n)){Rp(e,t);return}r.calendarEventModalOpen=!0,r.calendarEventModalCalendarId=e,r.calendarEventModalEventId=t,window.render()}}function c2(){r.calendarEventModalOpen=!1,r.calendarEventModalCalendarId=null,r.calendarEventModalEventId=null,window.render()}function Rp(e,t){const n=vr(e,t);if(!n)return;const a=bo(n);a&&(r.calendarMeetingNotesEventKey=a.eventKey,r.calendarEventModalOpen=!1,r.calendarEventModalCalendarId=null,r.calendarEventModalEventId=null,window.render())}function Bp(e){if(!e)return;const t=String(e).split("::");t.length>=3&&(r.calendarMeetingNotesScope=t[1]==="series"?"series":"instance"),r.calendarMeetingNotesEventKey=String(e),r.activeTab="calendar",r.calendarEventModalOpen=!1,r.calendarEventModalCalendarId=null,r.calendarEventModalEventId=null,window.render()}function u2(e){Bp(e)}function f2(e){if(!["instance","series"].includes(e))return;const t=r.calendarMeetingNotesScope||"instance",n=yo();if(!n)return r.calendarMeetingNotesScope=e,window.render();if(t==="instance"&&e==="series"&&n.recurringEventId){const s=Ni(n,"instance"),o=Ni(n,"series");if(s&&o&&s!==o){r.meetingNotesByEvent||(r.meetingNotesByEvent={});const i=r.meetingNotesByEvent[s],l=r.meetingNotesByEvent[o],d=new Date().toISOString();i&&!l?r.meetingNotesByEvent[o]={...i,eventKey:o,updatedAt:d}:i&&l&&!String(l.content||"").trim()&&String(i.content||"").trim()&&(l.content=i.content,l.updatedAt=d);let c=0;for(const h of r.tasksData)h.meetingEventKey===s&&(h.meetingEventKey=o,h.updatedAt=d,c++);c>0&&window.saveTasksData?.(),Op()}}r.calendarMeetingNotesScope=e;const a=bo(n);a&&(r.calendarMeetingNotesEventKey=a.eventKey),window.render()}function p2(e){e==="today"&&(r.calendarMobileShowToday=!r.calendarMobileShowToday),e==="events"&&(r.calendarMobileShowEvents=!r.calendarMobileShowEvents),e==="scheduled"&&(r.calendarMobileShowScheduled=!r.calendarMobileShowScheduled),window.render()}function h2(){r.calendarMeetingNotesEventKey=null,window.render()}function m2(e,t,n=0){const a=vr(e,t);if(!a)return;const s=a2(a),o=new Date(`${s}T12:00:00`);o.setDate(o.getDate()+(Number(n)||0));const i=`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}-${String(o.getDate()).padStart(2,"0")}`,d=Number(n)>0?`Follow up: ${a.summary||"Meeting"}`:a.summary||"Meeting",c=[a.description,a.htmlLink].filter(Boolean).join(`

`);window.createTask?.(d,{status:"anytime",dueDate:i,notes:c,meetingEventKey:Kl(a)}),r.calendarEventModalOpen=!1,r.calendarEventModalCalendarId=null,r.calendarEventModalEventId=null,window.render()}function g2(e,t){r.draggedCalendarEvent={calendarId:e,eventId:t}}function v2(){r.draggedCalendarEvent=null}async function b2(e,t){const n=r.draggedCalendarEvent;if(!n)return;const a=vr(n.calendarId,n.eventId);r.draggedCalendarEvent=null,a&&await window.rescheduleGCalEventIfConnected?.(a,e,t)}function jp(e="note"){const t=r.calendarMeetingNotesEventKey;if(!t)return;const n=document.getElementById("meeting-item-input"),a=String(n?.value||"").trim();if(!a)return;const s=yo();s&&(bo(s),window.createTask?.(a,{isNote:e!=="task",status:"anytime",meetingEventKey:t,notes:""}),n&&(n.value=""),window.render())}function y2(e){const t=r.calendarMeetingNotesEventKey,n=yo();if(!e||!t||!n)return;const a=Ea(n),s=r.tasksData.find(o=>o.id===e);s&&(a.includes(s.meetingEventKey)||(window.updateTask?.(e,{meetingEventKey:t}),window.render()))}function w2(e,t="note"){e.key==="Enter"&&(e.preventDefault(),jp(t))}function x2(){const e=yo();if(!e)return`
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] p-8 text-center">
        <p class="text-sm text-[var(--text-muted)] mb-4">This event is no longer in the current sync window.</p>
        <button onclick="closeCalendarMeetingNotes()" class="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium">Back to Calendar</button>
      </div>
    `;Kl(e);const n=bo(e)?.content||"",a=Ic(e),s=Oi(e),o=Array.isArray(e.attendees)?e.attendees:[],i=s2(e),l=Ea(e),d=o2(e),c=i.filter(f=>!f.completed),h=i.filter(f=>f.completed),v=c.length>0?c.map(f=>`
        <div class="px-3 py-2 rounded-lg border border-[var(--border-light)] bg-[var(--bg-secondary)]/40 flex items-start gap-2.5">
          ${f.isNote?'<span class="w-2 h-2 rounded-full bg-[var(--accent)] mt-1.5"></span>':`<button onclick="event.stopPropagation(); window.toggleTaskComplete('${we(f.id)}')" class="task-checkbox mt-0.5 w-[18px] h-[18px] rounded-full border-[1.5px] border-[var(--text-muted)] hover:border-[var(--accent)] transition"></button>`}
          <button onclick="window.inlineEditingTaskId=null; window.editingTaskId='${we(f.id)}'; window.showTaskModal=true; window.render()" class="text-left flex-1 text-sm text-[var(--text-primary)] leading-snug">
            ${A(f.title||"Untitled")}
          </button>
        </div>
      `).join(""):'<div class="text-sm text-[var(--text-muted)] px-1 py-2">No bullet points yet.</div>';return`
    <div class="calendar-meeting-notes-page bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
      <div class="calendar-meeting-notes-header px-5 py-4 border-b border-[var(--border-light)] flex flex-wrap items-center justify-between gap-3">
        <div class="min-w-0">
          <div class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Meeting Notes</div>
          <h2 class="text-lg font-semibold text-[var(--text-primary)] truncate">${A(e.summary||"Untitled Event")}</h2>
          <p class="text-sm text-[var(--text-muted)]">${A(a)}${s?` • ${A(s)}`:""} • ${c.length} open</p>
          ${e.recurringEventId?`
            <div class="mt-2 inline-flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-secondary)]">
              <button onclick="setCalendarMeetingNotesScope('instance')" class="px-2 py-1 text-[11px] rounded-md ${r.calendarMeetingNotesScope==="instance"?"bg-[var(--bg-card)] text-[var(--text-primary)]":"text-[var(--text-muted)]"}">Instance</button>
              <button onclick="setCalendarMeetingNotesScope('series')" class="px-2 py-1 text-[11px] rounded-md ${r.calendarMeetingNotesScope==="series"?"bg-[var(--bg-card)] text-[var(--text-primary)]":"text-[var(--text-muted)]"}">Series</button>
            </div>
          `:""}
        </div>
        <div class="calendar-meeting-notes-actions flex items-center gap-2">
          <button onclick="closeCalendarMeetingNotes()" class="calendar-meeting-btn calendar-meeting-btn-neutral px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition">Back</button>
          <button onclick="safeOpenUrl('${we(e.htmlLink)}')" class="calendar-meeting-btn calendar-meeting-btn-accent px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition ${e.htmlLink?"":"opacity-50 cursor-not-allowed"}" ${e.htmlLink?"":"disabled"}>
            Open Event
          </button>
          <button onclick="safeOpenUrl('${we(e.meetingLink)}')" class="calendar-meeting-btn calendar-meeting-btn-success px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition ${e.meetingLink?"":"opacity-50 cursor-not-allowed"}" ${e.meetingLink?"":"disabled"}>
            ${e.meetingProvider?`Join ${A(e.meetingProvider)}`:"Join Meeting"}
          </button>
        </div>
      </div>

      <div class="calendar-meeting-notes-body p-5 grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-5">
        <div class="space-y-3">
          <div class="rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] p-3">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-semibold text-[var(--text-primary)]">Meeting Notes & Tasks</h3>
              <span class="text-xs text-[var(--text-muted)]">${i.length} linked</span>
            </div>
            <div class="flex items-center gap-2 mb-3">
              <input
                id="meeting-item-input"
                type="text"
                placeholder="Add bullet point..."
                onkeydown="handleMeetingItemInputKeydown(event, 'note')"
                class="input-field flex-1 min-w-0"
              />
              <button onclick="addMeetingLinkedItem('note')" class="calendar-meeting-btn calendar-meeting-btn-neutral px-3 py-2 rounded-lg text-xs font-semibold hover:opacity-90">Add Bullet</button>
              <button onclick="addMeetingLinkedItem('task')" class="calendar-meeting-btn calendar-meeting-btn-accent px-3 py-2 rounded-lg text-xs font-semibold hover:opacity-90">Add Task</button>
            </div>
            <div class="space-y-2">
              ${v}
              ${h.length>0?`
                <details class="mt-3">
                  <summary class="text-xs font-medium text-[var(--text-muted)] cursor-pointer">${h.length} completed</summary>
                  <div class="mt-2 space-y-1.5">
                    ${h.map(f=>`
                      <div class="text-xs text-[var(--text-muted)] line-through px-2 py-1">${A(f.title||"Untitled")}</div>
                    `).join("")}
                  </div>
                </details>
              `:""}
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <div class="rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] p-3 discussion-pool-card">
            <div class="flex items-center justify-between gap-3 mb-2">
              <div>
                <h3 class="text-sm font-semibold text-[var(--text-primary)]">Discussion Pool</h3>
                <p class="text-xs text-[var(--text-muted)]">Items tagged to meeting attendees (${d.attendeePeople.length} matched people)</p>
              </div>
              <span class="text-xs px-2 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)]">${d.matchingItems.length}</span>
            </div>

            ${d.attendeePeople.length>0?`
              <div class="discussion-pool-people mb-3">
                ${d.attendeePeople.map(f=>`
                  <span class="discussion-pool-person-pill" style="display:inline-flex;align-items:center;gap:6px">
                    ${Vr(f,20)}
                    ${A(f.name)}
                    ${f.email?`<span class="discussion-pool-person-email">${A(f.email)}</span>`:""}
                  </span>
                `).join("")}
              </div>
            `:`
              <p class="text-xs rounded-lg px-2.5 py-2 mb-3" style="color: var(--warning); background: color-mix(in srgb, var(--warning) 8%, transparent); border: 1px solid color-mix(in srgb, var(--warning) 25%, transparent)">No People emails matched this meeting's attendees yet.</p>
            `}

            ${d.matchingItems.length>0?`
              <div class="discussion-pool-sections">
                <div class="discussion-pool-section">
                  <div class="discussion-pool-section-head">Tasks (${d.tasks.length})</div>
                  ${d.tasks.length?d.tasks.map(f=>{const p=l.includes(f.meetingEventKey);return`
                      <div class="discussion-pool-item">
                        <button onclick="window.inlineEditingTaskId=null; window.editingTaskId='${we(f.id)}'; window.showTaskModal=true; window.render()" class="discussion-pool-item-main">
                          <span class="discussion-pool-item-title">${A(f.title||"Untitled task")}</span>
                          <span class="discussion-pool-item-meta">
                            ${f.dueDate?`<span class="discussion-pool-item-badge">${f.dueDate<=he()?"Due":"Upcoming"} ${A(f.dueDate)}</span>`:""}
                            ${p?'<span class="discussion-pool-item-badge linked">In This Meeting</span>':""}
                          </span>
                        </button>
                        <button onclick="addDiscussionItemToMeeting('${we(f.id)}')" class="discussion-pool-link-btn ${p?"is-linked":""}" ${p?"disabled":""}>${p?"Linked":"Add"}</button>
                      </div>
                    `}).join(""):'<div class="discussion-pool-empty">No tasks tagged to attendees.</div>'}
                </div>

                <div class="discussion-pool-section">
                  <div class="discussion-pool-section-head">Notes (${d.notes.length})</div>
                  ${d.notes.length?d.notes.map(f=>{const p=l.includes(f.meetingEventKey);return`
                      <div class="discussion-pool-item">
                        <button onclick="window.inlineEditingTaskId=null; window.editingTaskId='${we(f.id)}'; window.showTaskModal=true; window.render()" class="discussion-pool-item-main">
                          <span class="discussion-pool-item-title">${A(f.title||"Untitled note")}</span>
                          <span class="discussion-pool-item-meta">
                            ${p?'<span class="discussion-pool-item-badge linked">In This Meeting</span>':""}
                          </span>
                        </button>
                        <button onclick="addDiscussionItemToMeeting('${we(f.id)}')" class="discussion-pool-link-btn ${p?"is-linked":""}" ${p?"disabled":""}>${p?"Linked":"Add"}</button>
                      </div>
                    `}).join(""):'<div class="discussion-pool-empty">No notes tagged to attendees.</div>'}
                </div>
              </div>
            `:`
              <div class="discussion-pool-empty">No open tasks/notes are currently tagged with matched attendees.</div>
            `}
          </div>

          <div class="rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] p-3">
            <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-2">Attendees</h3>
            ${o.length>0?`
              <div class="flex flex-wrap gap-1.5">
                ${o.map(f=>{const p=Jn(f.email),m=p?r.taskPeople.find(y=>Jn(y.email)===p):null,g=m?.name||f.displayName||f.email||"Guest";return`
                  <span class="text-xs px-2 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-primary)] inline-flex items-center gap-1.5">
                    ${m?Vr(m,16):""}
                    ${A(g)}
                  </span>`}).join("")}
              </div>
            `:'<p class="text-xs text-[var(--text-muted)]">No attendee metadata available for this event.</p>'}
          </div>

          ${e.description?`
            <div class="rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] p-3">
              <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-2">Original Event Note</h3>
              <div class="text-sm text-[var(--text-secondary)] leading-relaxed max-h-[260px] overflow-auto">${i2(e.description)}</div>
            </div>
          `:""}

          ${n?`
            <div class="rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] p-3">
              <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-2">Legacy Internal Notes</h3>
              <div class="text-sm text-[var(--text-secondary)] leading-relaxed max-h-[220px] overflow-auto">${Li(n)}</div>
            </div>
          `:""}
        </div>
      </div>
    </div>
  `}function k2(e){if(!e||Fr(e))return"";const n=e.meetingProvider?`Join ${A(e.meetingProvider)}`:"Open Meeting Link",a=e.meetingLink?"Open call link":"No call link found";return`
    <div class="modal-overlay calendar-event-modal-overlay fixed inset-0 bg-[var(--modal-overlay)] backdrop-blur-sm flex items-end md:items-center justify-center z-[320]" onclick="if(event.target===this) closeCalendarEventActions()">
      <div class="modal-enhanced calendar-event-modal w-full max-w-md mx-4" onclick="event.stopPropagation()">
        <div class="sheet-handle md:hidden"></div>
        <div class="modal-header-enhanced">
          <div class="flex items-center gap-3 min-w-0">
            <div class="calendar-event-modal-header-icon">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div class="min-w-0">
              <h3 class="text-lg font-semibold text-[var(--text-primary)] truncate">${A(e.summary||"Event")}</h3>
              <p class="text-xs text-[var(--text-muted)] mt-1">${A(Ic(e))}${Oi(e)?` • ${A(Oi(e))}`:""}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            ${e.meetingProvider?`<span class="text-[10px] font-semibold px-2 py-1 rounded-full bg-[color-mix(in_srgb,var(--success)_15%,transparent)] text-[var(--success)]">${A(e.meetingProvider)}</span>`:""}
            <button onclick="closeCalendarEventActions()" class="w-8 h-8 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]" aria-label="Close">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div class="modal-body-enhanced space-y-3">
          <div class="calendar-event-quick-actions">
            <button onclick="safeOpenUrl('${we(e.htmlLink)}'); closeCalendarEventActions()" class="calendar-icon-action ${e.htmlLink?"":"opacity-50 cursor-not-allowed"}" ${e.htmlLink?"":"disabled"}>
              <span class="calendar-icon-action-glyph">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </span>
              <span class="calendar-icon-action-label">Google Calendar</span>
            </button>
            <button onclick="safeOpenUrl('${we(e.meetingLink)}'); closeCalendarEventActions()" class="calendar-icon-action ${e.meetingLink?"":"opacity-50 cursor-not-allowed"}" ${e.meetingLink?"":"disabled"}>
              <span class="calendar-icon-action-glyph">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              </span>
              <span class="calendar-icon-action-label">${n}</span>
              <span class="calendar-icon-action-sub">${a}</span>
            </button>
          </div>

          <button onclick="openCalendarMeetingNotes('${we(e.calendarId)}','${we(e.id)}')" class="calendar-event-action">
            <span class="calendar-event-action-icon">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </span>
            <span class="calendar-event-action-text">
              <span class="calendar-event-action-title">Create Meeting Notes</span>
              <span class="calendar-event-action-sub">Start linked notes/tasks for this event</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  `}function S2(e){return typeof window.calculateScores=="function"?window.calculateScores(e):{total:0,prayer:0,diabetes:0,whoop:0,family:0,habit:0,prayerOnTime:0,prayerLate:0}}function Hr(e,t,n){return typeof window.renderTaskItem=="function"?window.renderTaskItem(e,t,n):`<div class="py-2 px-3 text-sm text-[var(--text-primary)]">${e.title||"Untitled"}</div>`}function T2(e){return typeof window.getFilteredTasks=="function"?window.getFilteredTasks(e):[]}function dc(e){return typeof window.getScoreTier=="function"?window.getScoreTier(e):{label:"",color:"var(--text-muted)",emoji:""}}const I2=Zi;function C2(e){const t=String(e||"");if(typeof document>"u")return t.replace(/</g,"&lt;").replace(/>/g,"&gt;");const n=document.createElement("template");n.innerHTML=t;const a=new Set(["DIV","SPAN","STRONG","EM","BR","UL","OL","LI","TABLE","TBODY","THEAD","TR","TD","TH"]),s=new Set(["colspan","rowspan"]),o=Array.from(n.content.querySelectorAll("*"));for(const i of o){if(!a.has(i.tagName)){const l=document.createTextNode(i.textContent||"");i.replaceWith(l);continue}for(const l of Array.from(i.attributes)){const d=l.name.toLowerCase();(!s.has(d)||d.startsWith("on"))&&i.removeAttribute(l.name)}}return n.innerHTML}function E2(e){const t=r.taskLabels.find(l=>l.name.trim().toLowerCase()==="next"),n=r.tasksData.filter(l=>{if(l.completed||l.isNote)return!1;const d=l.dueDate===e,c=l.dueDate&&l.dueDate<e,h=l.deferDate&&l.deferDate<=e;return l.today||d||c||h}).length,a=t?r.tasksData.filter(l=>l.completed||l.isNote||!(l.labels||[]).includes(t.id)?!1:!(l.today||l.dueDate===e||l.dueDate&&l.dueDate<e)).length:0,s=r.tasksData.filter(l=>l.completed&&l.completedAt&&l.completedAt.startsWith(e)).length,o=r.tasksData.filter(l=>!l.completed&&!l.isNote&&l.status==="inbox"&&!l.categoryId).length,i="quick-stat-item bg-[var(--bg-secondary)] rounded-lg p-3 text-center hover:bg-[var(--bg-tertiary)] active:bg-[var(--bg-tertiary)] transition-all";return`
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      <button type="button" class="${i}" onclick="showPerspectiveTasks('inbox')">
        <div class="text-xl sm:text-2xl font-bold ${o>0?"text-[var(--inbox-color)]":"text-[var(--text-primary)]"}">${o}</div>
        <div class="text-xs text-[var(--text-muted)] mt-1">In Inbox</div>
      </button>
      <button type="button" class="${i}" onclick="showPerspectiveTasks('today')">
        <div class="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">${n}</div>
        <div class="text-xs text-[var(--text-muted)] mt-1">Due Today</div>
      </button>
      <button type="button" class="${i}" onclick="${t?`showLabelTasks('${t.id}')`:"void(0)"}">
        <div class="text-xl sm:text-2xl font-bold text-[var(--notes-accent)]">${a}</div>
        <div class="text-xs text-[var(--text-muted)] mt-1">Tagged Next</div>
      </button>
      <button type="button" class="${i}" onclick="showPerspectiveTasks('logbook')">
        <div class="text-xl sm:text-2xl font-bold text-[var(--success)]">${s}</div>
        <div class="text-xs text-[var(--text-muted)] mt-1">Done Today</div>
      </button>
    </div>
  `}function $2(){return`
    <div class="flex items-center gap-3">
      <div onclick="state.quickAddIsNote = !state.quickAddIsNote; render()"
        class="quick-add-type-toggle" title="${r.quickAddIsNote?"Switch to Task":"Switch to Note"}">
        ${r.quickAddIsNote?'<div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-accent)]"></div>':'<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed border-[var(--text-muted)]/30 flex-shrink-0"></div>'}
      </div>
      <input type="text" id="home-quick-add-input"
        placeholder="${r.quickAddIsNote?"New Note":"New To-Do"}"
        onkeydown="if(event._inlineAcHandled)return;if(event.key==='Enter'){event.preventDefault();homeQuickAddTask(this);}"
        class="flex-1 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)]/40 bg-transparent border-0 outline-none focus:ring-0">
      <button onclick="homeQuickAddTask(document.getElementById('home-quick-add-input'))"
        class="text-[var(--text-muted)]/40 hover:text-[var(--accent)] transition p-1" title="${r.quickAddIsNote?"Add Note":"Add Task"}">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
      </button>
    </div>
  `}function D2(e){const t=r.tasksData.filter(i=>{if(i.completed||i.isNote)return!1;const l=i.dueDate===e,d=i.dueDate&&i.dueDate<e,c=i.deferDate&&i.deferDate<=e;return i.today||l||d||c}),n=t.filter(i=>i.dueDate&&i.dueDate<=e).sort((i,l)=>i.dueDate.localeCompare(l.dueDate)),a=t.filter(i=>{const l=i.dueDate&&i.dueDate<=e;return i.deferDate&&i.deferDate<=e&&!l}),s=t.filter(i=>!n.includes(i)&&!a.includes(i)),o=t.length;return o===0?'<div class="py-6 text-center text-[var(--text-muted)] text-sm">No tasks for today</div>':`
    <div class="max-h-[300px] overflow-y-auto">
      ${n.length>0?`
        <div class="px-2 pt-1 pb-0.5">
          <div class="flex items-center gap-1.5">
            <svg class="w-3 h-3 text-[var(--danger)]" viewBox="0 0 24 24" fill="currentColor"><path d="M18.7 12.4a6.06 6.06 0 00-.86-3.16l4.56-3.56L20.16 2l-4.13 4.15A7.94 7.94 0 0012 5a8 8 0 00-8 8c0 4.42 3.58 8 8 8a7.98 7.98 0 007.43-5.1l4.15 1.83.57-3.66-6.45 1.33zM12 19a6 6 0 116-6 6 6 0 01-6 6z"/><path d="M12.5 8H11v6l4.75 2.85.75-1.23-4-2.37z"/></svg>
            <span class="text-[10px] font-semibold text-[var(--danger)] uppercase tracking-wider">Due</span>
            <span class="text-[10px] text-[var(--danger)]">${n.length}</span>
          </div>
        </div>
        <div>${n.map(i=>Hr(i,!1,!0)).join("")}</div>
      `:""}
      ${s.length>0?`
        <div>${s.map(i=>Hr(i,!1,!0)).join("")}</div>
      `:""}
      ${a.length>0?`
        <div class="px-2 pt-1 pb-0.5 ${n.length>0||s.length>0?"mt-0.5 border-t border-[var(--border-light)]":""}">
          <div class="flex items-center gap-1.5">
            <svg class="w-3 h-3 text-[var(--accent)]" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
            <span class="text-[10px] font-semibold text-[var(--accent)] uppercase tracking-wider">Starting</span>
            <span class="text-[10px] text-[var(--accent)]">${a.length}</span>
          </div>
        </div>
        <div>${a.map(i=>Hr(i,!1,!0)).join("")}</div>
      `:""}
      ${o>8?`<div class="px-2 py-2 text-center"><button onclick="showPerspectiveTasks('today')" class="text-xs text-[var(--accent)] hover:underline font-medium">View all `+o+" tasks →</button></div>":""}
    </div>
  `}function _2(e){const t=r.taskLabels.find(a=>a.name.trim().toLowerCase()==="next"),n=t?r.tasksData.filter(a=>a.completed||a.isNote||!(a.labels||[]).includes(t.id)?!1:!(a.today||a.dueDate===e||a.dueDate&&a.dueDate<e)):[];return n.length===0?'<div class="py-6 text-center text-[var(--text-muted)] text-sm">No tasks tagged "Next"</div>':`
    <div class="max-h-[300px] overflow-y-auto">
      ${n.slice(0,8).map(a=>Hr(a,!1,!0)).join("")}
      ${n.length>8?`<div class="px-2 py-2 text-center"><button onclick="showLabelTasks('`+t.id+`')" class="text-xs text-[var(--accent)] hover:underline font-medium">View all `+n.length+" tasks →</button></div>":""}
    </div>
  `}function A2(e){const t=typeof window.isGCalConnected=="function"?window.isGCalConnected():!1,n=!!r.gcalTokenExpired,a=typeof window.getGCalEventsForDate=="function"?window.getGCalEventsForDate(e)||[]:[];return t?n?`
      <div class="py-6 text-center">
        <p class="text-sm mb-2" style="color: var(--warning)">Calendar session expired</p>
        <button onclick="reconnectGCal()" class="text-xs text-[var(--accent)] hover:underline font-medium">Reconnect</button>
      </div>
    `:a.length===0?'<div class="py-6 text-center text-[var(--text-muted)] text-sm">No events today</div>':`
    <div class="max-h-[300px] overflow-y-auto space-y-1">
      ${a.slice(0,6).map(s=>`
        <button
          onclick="${s.htmlLink?`safeOpenUrl('${we(s.htmlLink)}')`:`switchTab('calendar'); calendarSelectDate('${e}')`}"
          class="w-full text-left rounded-lg px-2.5 py-2 hover:bg-[var(--bg-secondary)] transition border border-transparent hover:border-[var(--border-light)]">
          <div class="flex items-start gap-2.5">
            <span class="mt-1 w-2 h-2 rounded-full flex-shrink-0" style="background: var(--success)"></span>
            <div class="min-w-0 flex-1">
              <p class="text-[13px] font-medium text-[var(--text-primary)] truncate">${A(s.summary||"(No title)")}</p>
              <p class="text-[11px] text-[var(--text-muted)] mt-0.5">${I2(s)}</p>
            </div>
          </div>
        </button>
      `).join("")}
      ${a.length>6?`
        <div class="px-2 py-2 text-center">
          <button onclick="switchTab('calendar'); calendarSelectDate('${e}')" class="text-xs text-[var(--accent)] hover:underline font-medium">View all ${a.length} events &rarr;</button>
        </div>
      `:""}
    </div>
  `:`
      <div class="py-6 text-center">
        <p class="text-sm text-[var(--text-muted)] mb-2">Google Calendar is not connected</p>
        <button onclick="switchTab('settings')" class="text-xs text-[var(--accent)] hover:underline font-medium">Connect in Settings &rarr;</button>
      </div>
    `}function M2(e){const n=(r.allData[e]||JSON.parse(JSON.stringify(ot))).prayers||{};return`
    <div class="flex items-center justify-between mb-3">
      <span class="text-xs text-[var(--text-muted)] font-medium">${["fajr","dhuhr","asr","maghrib","isha"].filter(o=>n[o]&&parseFloat(n[o])>0).length}/5</span>
    </div>
    <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
      ${["fajr","dhuhr","asr","maghrib","isha"].map((o,i)=>'<div class="text-center"><label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">'+["F","D","A","M","I"][i]+'</label><input type="number" step="0.1" min="0" max="1" value="'+(n[o]||"")+`" placeholder="0" autocomplete="off" onchange="updateDailyField('prayers', '`+o+`', this.value)" class="input-field w-full text-center font-medium"></div>`).join("")}
      <div class="text-center">
        <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">📖</label>
        <input type="number" step="0.1" value="${n.quran||""}" placeholder="0"
          autocomplete="off"
          onchange="updateDailyField('prayers', 'quran', this.value)"
          class="input-field w-full text-center font-medium">
      </div>
    </div>
  `}function P2(e){const t=r.allData[e]||JSON.parse(JSON.stringify(ot)),n=t.glucose||{},a=t.libre||{},s=typeof window.isLibreConnected=="function"&&window.isLibreConnected(),o=s&&a.currentGlucose;let i="text-[var(--success)]",l="bg-[color-mix(in_srgb,var(--success)_8%,transparent)]";if(o){const u=Number(a.currentGlucose);u>180||u<70?(i="text-[var(--danger)]",l="bg-[color-mix(in_srgb,var(--danger)_8%,transparent)]"):u>140&&(i="text-[var(--warning)]",l="bg-[color-mix(in_srgb,var(--warning)_8%,transparent)]")}const d=7,c=[];let h=0,v=0;for(let u=89;u>=0;u--){const x=new Date;x.setDate(x.getDate()-u);const k=he(x),E=r.allData[k],D=E?.glucose?.avg?Number(E.glucose.avg):null;D&&(h+=D,v++),u<d&&c.push({date:k,avg:D,tir:E?.glucose?.tir?Number(E.glucose.tir):null,day:x.toLocaleDateString("en-US",{weekday:"narrow"})})}const f=v>=7?((h/v+46.7)/28.7).toFixed(1):null,p=c.map(u=>u.avg),m=p.some(u=>u!==null);let g="";if(m){const E=p.map(S=>S||0),D=Math.min(...E.filter(S=>S>0),70),_=Math.max(...E,180)-D||1,N=E.map((S,O)=>{const w=2+O/(E.length-1)*196,j=S>0?2+(1-(S-D)/_)*36:38;return`${w},${j}`}),L=2+(1-(140-D)/_)*36,W=2+(1-(70-D)/_)*36,z=Math.max(2,2+(1-(180-D)/_)*36);g=`
      <svg viewBox="0 0 200 40" class="w-full" style="height: 40px;" preserveAspectRatio="none">
        <rect x="0" y="${z}" width="200" height="${L-z}" fill="var(--warning)" opacity="0.12" rx="1"/>
        <rect x="0" y="${L}" width="200" height="${W-L}" fill="var(--success)" opacity="0.15" rx="1"/>
        <polyline points="${N.join(" ")}" fill="none" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        ${E.map((S,O)=>{if(S<=0)return"";const w=2+O/(E.length-1)*196,j=2+(1-(S-D)/_)*36,ee=S>180||S<70?"var(--danger)":S>140?"var(--warning)":"var(--success)";return`<circle cx="${w}" cy="${j}" r="2.5" fill="${ee}"/>`}).join("")}
      </svg>
    `}const y=c.map((u,x)=>`<span class="text-[10px] ${x===c.length-1?"font-bold text-[var(--text-primary)]":"text-[var(--text-muted)]"}">${u.day}</span>`).join("");return`
    ${o?`
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-baseline gap-1.5">
          <span class="text-3xl font-bold leading-none ${i}">${a.currentGlucose}</span>
          <span class="text-xl ${i}">${a.trend||"→"}</span>
          <span class="text-[10px] text-[var(--text-muted)] ml-0.5">mg/dL</span>
        </div>
        <button onclick="window.syncLibreNow()" class="inline-flex items-center gap-1 text-[10px] text-[var(--success)] ${l} px-1.5 py-0.5 rounded-full transition" title="Sync now">
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
          Sync
        </button>
      </div>
    `:s?`
      <div class="flex justify-end mb-2">
        <button onclick="window.syncLibreNow()" class="inline-flex items-center gap-1 text-[10px] text-[var(--text-muted)] hover:text-[var(--accent)] transition" title="Sync now">
          <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
          Sync
        </button>
      </div>
    `:""}
    ${m?`
      <div class="mb-3">
        <div class="text-[10px] text-[var(--text-muted)] font-medium mb-1">7-Day Avg Glucose</div>
        ${g}
        <div class="flex justify-between px-0.5 mt-0.5">${y}</div>
      </div>
    `:""}
    <div class="grid ${f?"grid-cols-2 sm:grid-cols-4":"grid-cols-3"} gap-2">
      <div class="text-center">
        <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">Avg</label>
        ${s&&n.avg?`<div class="text-sm font-semibold text-[var(--text-primary)]">${n.avg}</div>`:`<input type="number" value="${n.avg||""}" placeholder="--" autocomplete="off"
              onchange="updateDailyField('glucose', 'avg', this.value)"
              class="input-field w-full text-center font-medium">`}
      </div>
      <div class="text-center">
        <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">TIR</label>
        ${s&&n.tir?`<div class="text-sm font-semibold ${Number(n.tir)>=70?"text-[var(--success)]":Number(n.tir)>=50?"text-[var(--warning)]":"text-[var(--danger)]"}">${n.tir}%</div>`:`<input type="number" value="${n.tir||""}" placeholder="--" autocomplete="off"
              onchange="updateDailyField('glucose', 'tir', this.value)"
              class="input-field w-full text-center font-medium">`}
      </div>
      <div class="text-center">
        <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">Insulin</label>
        <input type="number" value="${n.insulin||""}" placeholder="--" autocomplete="off"
          onchange="updateDailyField('glucose', 'insulin', this.value)"
          class="input-field w-full text-center font-medium">
      </div>
      ${f?`
        <div class="text-center">
          <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">eA1C</label>
          <div class="text-sm font-semibold ${Number(f)<=5.7?"text-[var(--success)]":Number(f)<=6.4?"text-[var(--warning)]":"text-[var(--danger)]"}">${f}%</div>
        </div>
      `:""}
    </div>
  `}function N2(e){const n=(r.allData[e]||JSON.parse(JSON.stringify(ot))).whoop||{},a=typeof window.isWhoopConnected=="function"&&window.isWhoopConnected(),s=typeof window.getWhoopLastSync=="function"?window.getWhoopLastSync():null,o=s?new Date(s).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}):"";return`
    <div class="grid grid-cols-3 gap-3">
      <div class="text-center">
        <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">Sleep %</label>
        ${a&&n.sleepPerf?`<div class="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-secondary)] text-center">${n.sleepPerf}<span class="text-xs text-[var(--text-muted)] ml-0.5">%</span></div>`:`<input type="number" value="${n.sleepPerf||""}" placeholder="--"
          autocomplete="off"
          onchange="updateDailyField('whoop', 'sleepPerf', this.value)"
          class="input-field w-full text-center font-medium">`}
      </div>
      <div class="text-center">
        <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">Recovery</label>
        ${a&&n.recovery?`<div class="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-secondary)] text-center">${n.recovery}<span class="text-xs text-[var(--text-muted)] ml-0.5">%</span></div>`:`<input type="number" value="${n.recovery||""}" placeholder="--"
          autocomplete="off"
          onchange="updateDailyField('whoop', 'recovery', this.value)"
          class="input-field w-full text-center font-medium">`}
      </div>
      <div class="text-center">
        <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">Strain</label>
        ${a&&n.strain?`<div class="w-full px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-secondary)] text-center">${n.strain}<span class="text-xs text-[var(--text-muted)] ml-0.5">/21</span></div>`:`<input type="number" value="${n.strain||""}" placeholder="--"
          autocomplete="off"
          onchange="updateDailyField('whoop', 'strain', this.value)"
          class="input-field w-full text-center font-medium">`}
      </div>
    </div>
    ${a?`
    <div class="flex items-center justify-between mt-3 pt-2 border-t border-[var(--border-light)]">
      <span class="text-[10px] text-[var(--text-muted)]">${o?`Synced ${o}`:""}</span>
      <button onclick="this.querySelector('svg').classList.add('animate-spin');this.classList.add('opacity-50','pointer-events-none');syncWhoopNow().finally(()=>render())" class="inline-flex items-center gap-1 text-[10px] text-[var(--accent)] hover:underline font-medium">
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
        Sync
      </button>
    </div>`:""}
  `}function L2(e){const n=(r.allData[e]||JSON.parse(JSON.stringify(ot))).habits||{};return`
    <div class="flex items-center justify-between mb-3">
      <span class="text-xs text-[var(--text-muted)] font-medium">${["exercise","reading","meditation","water","vitamins"].filter(o=>n[o]).length}/5</span>
    </div>
    <div class="grid grid-cols-5 gap-2">
      ${[{field:"exercise",icon:"🏋️",label:"Exercise"},{field:"reading",icon:"📚",label:"Read"},{field:"meditation",icon:"🧘",label:"Meditate"},{field:"water",icon:"💧",label:"Water"},{field:"vitamins",icon:"💊",label:"Vitamins"}].map(o=>{const i=n[o.field];return'<label class="flex flex-col items-center cursor-pointer"><span class="text-lg mb-1">'+o.icon+'</span><input type="checkbox" '+(i?"checked":"")+` onchange="toggleDailyField('habits', '`+o.field+`')" class="habit-check w-5 h-5 rounded border-2 border-[var(--notes-accent)]/40 text-[var(--notes-accent)] focus:ring-[var(--notes-accent)]/40 focus:ring-offset-0 cursor-pointer"></label>`}).join("")}
    </div>
  `}function O2(e){const t=r.allData[e]||JSON.parse(JSON.stringify(ot)),a=S2(t)?.normalized||{prayer:0,diabetes:0,whoop:0,family:0,habits:0,overall:0},s=Math.round(a.overall*100),o=typeof window.getLevelInfo=="function"?window.getLevelInfo(r.xp?.total||0):{level:1,tierName:"Spark",tierIcon:"✨",progress:0,nextLevelXP:100},i=r.streak?.current||0,l=r.streak?.multiplier||1,c=(r.xp?.history||[]).find(p=>p.date===e)?.total||0,h=dc(a.overall),v=(p,m)=>{const y=2*Math.PI*16,u=y*Math.max(0,Math.min(1,p));return`<svg class="score-mini-ring" width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="16" fill="none" stroke="var(--border-light, #e5e7eb)" stroke-width="3"/>
      <circle cx="20" cy="20" r="16" fill="none" stroke="${m}" stroke-width="3"
        stroke-dasharray="${u} ${y}" stroke-linecap="round"
        transform="rotate(-90 20 20)" class="transition-all duration-500"/>
      <text x="20" y="21" text-anchor="middle" dominant-baseline="middle"
        class="text-[10px] font-bold" fill="${m}">${Math.round(p*100)}</text>
    </svg>`},f=[{key:"prayer",label:"Prayer",pct:a.prayer},{key:"diabetes",label:"Glucose",pct:a.diabetes},{key:"whoop",label:"Whoop",pct:a.whoop},{key:"family",label:"Family",pct:a.family},{key:"habits",label:"Habits",pct:a.habits}];return`
    <div class="flex items-center gap-4">
      <div class="score-main-ring-container flex-shrink-0">
        <svg class="score-main-ring" width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border-light, #e5e7eb)" stroke-width="5"/>
          <circle cx="40" cy="40" r="34" fill="none" stroke="${h.color}" stroke-width="5"
            stroke-dasharray="${2*Math.PI*34*a.overall} ${2*Math.PI*34}" stroke-linecap="round"
            transform="rotate(-90 40 40)" class="transition-all duration-700"/>
          <text x="40" y="37" text-anchor="middle" dominant-baseline="middle"
            class="text-lg font-bold" fill="${h.color}">${s}%</text>
          <text x="40" y="50" text-anchor="middle" dominant-baseline="middle"
            class="text-[8px]" fill="var(--text-muted, #9ca3af)">${h.label}</text>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-sm font-bold text-[var(--text-primary)]">Level ${o.level}</span>
          <span class="text-xs text-[var(--text-muted)]">${o.tierIcon} ${o.tierName}</span>
        </div>
        ${i>0?`
          <div class="flex items-center gap-1.5 mb-1">
            <span class="text-xs font-semibold text-[var(--warning)]">🔥 ${i}-day streak</span>
            ${l>1?`<span class="text-[10px] text-[var(--success)] bg-[color-mix(in_srgb,var(--success)_10%,transparent)] px-1.5 py-0.5 rounded-full font-medium">${l}x</span>`:""}
          </div>
        `:'<div class="text-xs text-[var(--text-muted)] mb-1">No active streak</div>'}
        <div class="text-xs text-[var(--text-muted)]">+${c} XP today · ${(r.xp?.total||0).toLocaleString()} total</div>
        <div class="h-1.5 bg-[var(--bg-secondary)] rounded-full mt-1.5 overflow-hidden">
          <div class="h-full bg-[var(--accent)] rounded-full transition-all duration-500" style="width: ${Math.round(o.progress*100)}%"></div>
        </div>
        <div class="text-[10px] text-[var(--text-muted)] mt-0.5">${(r.xp?.total||0).toLocaleString()} / ${o.nextLevelXP.toLocaleString()} XP</div>
      </div>
    </div>
    <div class="score-categories-grid grid grid-cols-5 gap-1 mt-3 pt-3 border-t border-[var(--border-light)]">
      ${f.map(p=>{const m=dc(p.pct);return`<div class="text-center">
          ${v(p.pct,m.color)}
          <div class="text-[10px] text-[var(--text-muted)] mt-0.5">${p.label}</div>
        </div>`}).join("")}
    </div>
  `}function R2(){const e=r.weatherData;if(!e)return'<div class="py-6 text-center text-[var(--text-muted)] text-sm">Loading weather...</div>';const t=id[e.weatherCode]||"Weather",n=ti[e.weatherCode]||"🌡️",a=Number.isFinite(Number(e.temp))?Math.round(Number(e.temp)):"--",s=Number.isFinite(Number(e.tempMax))?Math.round(Number(e.tempMax)):"--",o=Number.isFinite(Number(e.tempMin))?Math.round(Number(e.tempMin)):"--",i=Number.isFinite(Number(e.humidity))?Math.max(0,Math.min(100,Math.round(Number(e.humidity)))):0,l=Number.isFinite(Number(e.windSpeed))?Math.max(0,Math.round(Number(e.windSpeed))):0,d=e.city||"Current location",c=e.maxHour||"",h=e.minHour||"",v=l<10?"Calm":l<25?"Breezy":"Windy",f=e.tomorrow,p=f?id[f.weatherCode]||"Weather":"",m=f?ti[f.weatherCode]||"🌡️":"",g=u=>u>0?`${u}° warmer`:u<0?`${Math.abs(u)}° cooler`:"same",y=u=>u>3?"var(--warning)":u<-3?"var(--accent)":"var(--text-muted)";return`
    <div class="weather-widget-content flex items-center gap-3">
      <span class="text-2xl leading-none">${n}</span>
      <div class="flex-1 min-w-0">
        <div class="flex items-baseline gap-1.5">
          <span class="text-2xl font-bold text-[var(--text-primary)] leading-none">${a}°</span>
          <span class="text-xs text-[var(--text-secondary)]">${t}</span>
        </div>
        <div class="text-[10px] text-[var(--text-muted)] mt-0.5">${d}</div>
      </div>
      <div class="flex items-center gap-2.5 text-xs text-[var(--text-secondary)]">
        <span class="flex items-center gap-0.5" title="High at ${c}">
          <svg class="w-2.5 h-2.5 text-[var(--warning)]" viewBox="0 0 24 24" fill="currentColor"><path d="M7 14l5-5 5 5z"/></svg>
          <span class="font-semibold text-[var(--text-primary)]">${s}°</span>
        </span>
        <span class="flex items-center gap-0.5" title="Low at ${h}">
          <svg class="w-2.5 h-2.5 text-[var(--accent)]" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5z"/></svg>
          <span class="font-semibold text-[var(--text-primary)]">${o}°</span>
        </span>
      </div>
    </div>
    <div class="flex items-center gap-3 mt-2 text-[11px] text-[var(--text-muted)]">
      <span class="flex items-center gap-1">
        <svg class="w-3 h-3 text-[var(--accent)]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/></svg>
        ${i}%
      </span>
      <span class="flex items-center gap-1">
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 17c0 1.65-1.35 3-3 3s-3-1.35-3-3c0-1.17.67-2.18 1.65-2.67L9.5 2h4l-.65 12.33c.98.49 1.65 1.5 1.65 2.67z"/></svg>
        ${l} km/h · ${v}
      </span>
    </div>
    ${f?`
    <div class="flex items-center gap-2 mt-2 pt-2 border-t border-[var(--border-light)] text-[11px]">
      <span class="text-[var(--text-muted)] font-medium">Tmrw</span>
      <span>${m}</span>
      <span class="text-[var(--text-secondary)]">${p}</span>
      <span class="ml-auto flex items-center gap-2">
        <span class="font-semibold text-[var(--text-primary)]">${f.tempMax}°<span class="text-[var(--text-muted)] font-normal">/</span>${f.tempMin}°</span>
        <span class="font-medium" style="color: ${y(f.avgDelta)}">${f.avgDelta===0?"same":g(f.avgDelta)}</span>
      </span>
    </div>
    `:""}
  `}function B2(e,t){if(![...Ue,ut,...r.customPerspectives||[]].find(i=>i.id===e.perspectiveId))return`
      <div class="py-6 text-center">
        <p class="text-[var(--text-muted)] text-sm mb-2">View not found</p>
        <button onclick="removePerspectiveWidget('${e.id}')" class="text-xs text-[var(--danger)] hover:underline">Remove widget</button>
      </div>
    `;if(e.perspectiveId==="notes"){const i=r.tasksData.filter(l=>l.isNote&&!l.completed).length;return`
      <div class="py-4 text-center">
        <div class="text-2xl font-bold text-[var(--text-primary)] mb-1">${i}</div>
        <div class="text-xs text-[var(--text-muted)] mb-3">note${i!==1?"s":""}</div>
        <button onclick="showPerspectiveTasks('notes')" class="text-xs text-[var(--accent)] hover:underline font-medium">Open Notes &rarr;</button>
      </div>
    `}const s=T2(e.perspectiveId),o=s.length;return o===0?'<div class="py-6 text-center text-[var(--text-muted)] text-sm">No tasks</div>':`
    <div class="max-h-[300px] overflow-y-auto">
      ${s.slice(0,8).map(i=>Hr(i,!1,!0)).join("")}
      ${o>8?`<div class="px-2 py-2 text-center"><button onclick="showPerspectiveTasks('${e.perspectiveId}')" class="text-xs text-[var(--accent)] hover:underline font-medium">View all ${o} tasks &rarr;</button></div>`:""}
    </div>
  `}function j2(e){const t=typeof window.isGCalConnected=="function"?window.isGCalConnected():!1,n=!!(typeof window.getAnthropicKey=="function"&&window.getAnthropicKey()),a=r.gsheetSyncing,s=r.gsheetAsking,o=localStorage.getItem(Fs)||"",i=r.gsheetEditingPrompt,l=r.gsheetResponse||localStorage.getItem(Hs)||"";if(!n)return`
      <div class="py-6 text-center">
        <p class="text-sm text-[var(--text-muted)] mb-2">Claude API key not configured</p>
        <button onclick="switchTab('settings')" class="text-xs text-[var(--accent)] hover:underline font-medium">Add in Settings &rarr;</button>
      </div>
    `;if(!t)return`
      <div class="py-6 text-center">
        <p class="text-sm text-[var(--text-muted)] mb-2">Google Calendar not connected</p>
        <button onclick="switchTab('settings')" class="text-xs text-[var(--accent)] hover:underline font-medium">Connect in Settings &rarr;</button>
      </div>
    `;if(!o||i)return`
      <div class="flex items-center gap-2">
        <input id="gsheet-prompt-input" type="text" placeholder="e.g. Summarize my last 14 days..."
          value="${A(o)}"
          onkeydown="if(event.key==='Enter'){event.preventDefault();handleGSheetSavePrompt()}${i?";if(event.key==='Escape'){event.preventDefault();handleGSheetCancelEdit()}":""}"
          class="input-field flex-1"
        />
        <button onclick="handleGSheetSavePrompt()" class="p-2 rounded-lg text-white bg-[var(--accent)] hover:opacity-90 transition flex-shrink-0" title="Save prompt">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
        </button>
        ${i?`<button onclick="handleGSheetCancelEdit()" class="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition flex-shrink-0" title="Cancel">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>`:""}
      </div>
      ${o?"":'<div class="mt-4 py-4 text-center text-[var(--text-muted)] text-xs">Set a prompt to auto-generate insights from your sheet data</div>'}
    `;const d=r.gsheetData,c=d?.tabs?.length||0,h=d?.tabs?.map(f=>f.name).join(", ")||"";let v="";if(s)v=`
      <div class="py-6 text-center">
        <svg class="w-5 h-5 animate-spin mx-auto mb-2 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0110 10"/></svg>
        <span class="text-sm text-[var(--text-muted)]">Generating...</span>
      </div>`;else if(l){const f=l.startsWith("Error:"),p=f?A(l):C2(l);v=`
      <div class="max-h-[300px] overflow-y-auto">
        <div class="gsheet-response text-sm leading-relaxed overflow-x-auto ${f?"text-[var(--danger)]":"text-[var(--text-primary)]"}">${p}</div>
      </div>
    `}else v='<div class="py-6 text-center text-[var(--text-muted)] text-xs">No response yet</div>';return`
    ${v}
    <div class="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-light)]">
      <button onclick="handleGSheetEditPrompt()" class="flex-1 min-w-0 text-left group" title="Click to edit prompt">
        <span class="text-[10px] text-[var(--text-muted)] truncate block group-hover:text-[var(--accent)] transition">${A(o)}</span>
      </button>
      <div class="flex items-center gap-3 ml-3 flex-shrink-0">
        ${c?`<span class="text-[10px] text-[var(--text-muted)]" title="${A(h)}">${c} tabs</span>`:""}
        <button onclick="handleGSheetRefresh()" class="inline-flex items-center gap-1 text-[10px] text-[var(--accent)] font-medium hover:opacity-80 transition ${s||a?"opacity-50 pointer-events-none":""}" ${s||a?"disabled":""} title="Re-run prompt">
          <svg class="w-3 h-3 ${s?"animate-spin":""}" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
          Refresh
        </button>
      </div>
    </div>
  `}const F2={stats:'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z"/></svg>',"quick-add":'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',"today-tasks":ve().today,"today-events":ve().calendar,"next-tasks":ve().next,prayers:'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',glucose:'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/></svg>',whoop:'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/></svg>',habits:'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',weather:'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>',score:'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v8H3v-8zm4-4h2v12H7V9zm4-4h2v16h-2V5zm4 8h2v8h-2v-8zm4-4h2v12h-2V9z"/></svg>',"gsheet-yesterday":'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2h5v-5h-5v5zm-6-5h5V7H6v5zm6-5v3h5V7h-5zM6 14h5v3H6v-3z"/></svg>'};function H2(e){const t=getComputedStyle(document.documentElement),n=s=>t.getPropertyValue(s).trim();return{stats:n("--text-muted")||"#6B7280","quick-add":n("--accent")||"#147EFB","today-tasks":n("--today-color")||"#FFCA28","today-events":n("--success")||"#2F9B6A","next-tasks":n("--notes-accent")||"#8E8E93",prayers:n("--success")||"#10B981",glucose:n("--danger")||"#EF4444",whoop:n("--accent")||"#3B82F6",habits:n("--notes-accent")||"#8E8E93",weather:n("--warning")||"#F59E0B",score:n("--success")||"#22C55E","gsheet-yesterday":n("--success")||"#34A853"}[e]||n("--text-muted")||"#6B7280"}const z2={stats:"#6B7280","quick-add":"#147EFB","today-tasks":"#FFCA28","today-events":"#2F9B6A","next-tasks":"#8E8E93",prayers:"#10B981",glucose:"#EF4444",whoop:"#3B82F6",habits:"#8E8E93",weather:"#F59E0B",score:"#22C55E","gsheet-yesterday":"#34A853"};function W2(e,t){if(typeof window.createTask=="function")return window.createTask(e,t)}function U2(e){if(typeof window.cleanupInlineAutocomplete=="function")return window.cleanupInlineAutocomplete(e)}function G2(){if(typeof window.render=="function")return window.render()}function Fp(e,t){const n=he(),s=el()||e.size==="full"?"col-span-2":(e.size==="half","col-span-1"),o={full:"Full",half:"Half",third:"Third"},i=e.type==="perspective",l=t?`
    <div class="flex items-center gap-1 ml-auto">
      <button onclick="event.stopPropagation(); toggleWidgetSize('${e.id}')"
        class="widget-resize-btn flex items-center gap-1.5 px-2 py-1 text-[var(--text-secondary)] hover:text-[var(--accent)] rounded-md transition border border-[var(--border-light)] hover:border-[var(--accent)]"
        title="Click to resize">
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          ${e.size==="full"?'<rect x="3" y="3" width="18" height="18" rx="2"/>':'<rect x="3" y="3" width="8" height="18" rx="1"/><rect x="13" y="3" width="8" height="18" rx="1" opacity="0.3"/>'}
        </svg>
        <span class="text-[11px] font-medium uppercase">${o[e.size]||"Half"}</span>
      </button>
      ${i?`
        <button onclick="event.stopPropagation(); removePerspectiveWidget('${e.id}')" class="widget-hide-btn p-1.5 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] rounded-md transition" title="Remove widget">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      `:`
        <button onclick="event.stopPropagation(); toggleWidgetVisibility('${e.id}')" class="widget-hide-btn p-1.5 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] rounded-md transition" title="Hide widget">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        </button>
      `}
    </div>
  `:"",c={stats:()=>E2(n),"quick-add":()=>$2(),"today-tasks":()=>D2(n),"next-tasks":()=>_2(n),"today-events":()=>A2(n),prayers:()=>M2(n),glucose:()=>P2(n),whoop:()=>N2(n),habits:()=>L2(n),score:()=>O2(n),weather:()=>R2(),perspective:()=>B2(e),"gsheet-yesterday":()=>j2()}[e.type],h=c?c():'<div class="py-4 text-center text-[var(--text-muted)]">Unknown widget type</div>',v={...F2},f={};for(const p of Object.keys(z2))f[p]=H2(p);if(e.type==="perspective"){const m=[...Ue,ut,...r.customPerspectives||[]].find(g=>g.id===e.perspectiveId);m&&(v.perspective=m.icon||"",f.perspective=m.color||"#6B7280")}return e.type==="quick-add"&&!t?`
      <div class="widget quick-add-widget ${s} widget-drop-target">
        <div class="py-2">
          ${h}
        </div>
      </div>
    `:`
    <div class="widget ${s} bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden widget-drop-target ${t?"cursor-grab":""}"
      ${t?`draggable="true" ondragstart="handleWidgetDragStart(event, '${e.id}')" ondragend="handleWidgetDragEnd(event)" ondragover="handleWidgetDragOver(event, '${e.id}')" ondragleave="handleWidgetDragLeave(event)" ondrop="handleWidgetDrop(event, '${e.id}')"`:""}>
      <div class="widget-header px-4 py-2 border-b border-[var(--border-light)] flex items-center gap-2">
        ${t?'<div class="text-[var(--text-muted)]/30 cursor-grab"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg></div>':""}
        <span style="color: ${f[e.type]||"#6B7280"}">${v[e.type]||""}</span>
        <h3 class="widget-title text-sm font-medium text-[var(--text-primary)]">${A(e.title)}</h3>
        ${l}
      </div>
      <div class="widget-body ${e.type==="today-tasks"||e.type==="today-events"||e.type==="next-tasks"||e.type==="perspective"?"px-2 py-1":"p-4"}">
        ${h}
      </div>
    </div>
  `}async function V2(){const t=(document.getElementById("gsheet-prompt-input")?.value||"").trim();if(t){localStorage.setItem(Fs,t),r.gsheetEditingPrompt=!1,r.gsheetAsking=!0,r.gsheetResponse=null,window.render();try{const n=await window.askGSheet(t);r.gsheetResponse=n,localStorage.setItem(Hs,n)}catch(n){r.gsheetResponse=`Error: ${n.message||"Something went wrong"}`}finally{r.gsheetAsking=!1,window.render()}}}function q2(){r.gsheetEditingPrompt=!0,window.render(),setTimeout(()=>{const e=document.getElementById("gsheet-prompt-input");e&&(e.focus(),e.select())},50)}function K2(){r.gsheetEditingPrompt=!1,window.render()}async function Y2(){const e=localStorage.getItem(Fs)||"";if(e){r.gsheetAsking=!0,r.gsheetResponse=null,window.render();try{const t=await window.askGSheet(e);r.gsheetResponse=t,localStorage.setItem(Hs,t)}catch(t){r.gsheetResponse=`Error: ${t.message||"Something went wrong"}`}finally{r.gsheetAsking=!1,window.render()}}}function J2(e){if(!e)return;const t=e.value.trim();if(!t)return;const n={status:"inbox"};r.quickAddIsNote&&(n.isNote=!0,n.status="anytime");const a=r.inlineAutocompleteMeta.get("home-quick-add-input");a&&(a.areaId&&(n.areaId=a.areaId),a.categoryId&&(n.categoryId=a.categoryId),a.labels&&a.labels.length&&(n.labels=a.labels),a.people&&a.people.length&&(n.people=a.people),a.deferDate&&(n.deferDate=a.deferDate),a.dueDate&&(n.dueDate=a.dueDate)),W2(t,n),e.value="",r.quickAddIsNote=!1,U2("home-quick-add-input"),G2(),setTimeout(()=>{const s=document.getElementById("home-quick-add-input");s&&s.focus()},50)}function Hp(){he();const e=[...r.homeWidgets].sort((s,o)=>s.order-o.order),t=el(),n=t?e:e.filter(s=>s.visible),a=t?[]:e.filter(s=>!s.visible);return`
    <div class="space-y-6">
      <!-- Large title sentinel for IntersectionObserver -->
      <div id="large-title-sentinel" class="md:hidden" style="height:1px;margin:0;padding:0;"></div>
      <!-- Header -->
      <div class="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div class="home-greeting-row flex items-center gap-3">
            <h1 class="home-large-title text-2xl font-bold text-[var(--text-primary)]">Good ${new Date().getHours()<12?"morning":new Date().getHours()<18?"afternoon":"evening"}</h1>
            ${r.weatherData?`
              <div class="weather-inline flex items-center gap-2 text-[var(--text-secondary)]" title="${r.weatherData.city}">
                <span class="text-base">${ti[r.weatherData.weatherCode]||"🌡️"}</span>
                <span class="text-sm font-semibold">${r.weatherData.temp}°</span>
                <span class="text-[11px] text-[var(--text-muted)] font-medium">↑${r.weatherData.tempMax}° <span class="text-[var(--text-muted)]">${r.weatherData.maxHour||""}</span></span>
                <span class="text-[11px] text-[var(--text-muted)] font-medium">↓${r.weatherData.tempMin}° <span class="text-[var(--text-muted)]">${r.weatherData.minHour||""}</span></span>
              </div>
            `:""}
          </div>
          <div class="flex items-center gap-3 mt-1">
            <p class="text-[var(--text-secondary)] text-sm">${new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</p>
            <span class="text-[var(--text-muted)] hidden md:inline">•</span>
            <p class="text-[var(--text-muted)] text-xs hidden md:block">Press <kbd class="px-1.5 py-0.5 bg-[var(--bg-secondary)] rounded-md text-[11px] font-mono">⌘K</kbd> to quick add</p>
          </div>
          ${Pe()?`
          <div class="mobile-search-pill mt-3 md:hidden" onclick="showGlobalSearch = true; render()">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <span>Search tasks, events...</span>
          </div>
          `:""}
        </div>
        <div class="home-header-actions flex items-center gap-3">
          ${r.editingHomeWidgets?`
            <button onclick="showAddWidgetPicker = !showAddWidgetPicker; render()" class="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition flex items-center gap-1.5">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Add Widget
            </button>
            <button onclick="resetHomeWidgets()" class="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-lg hover:bg-[var(--bg-secondary)] transition">
              Reset Layout
            </button>
          `:""}
          <button onclick="toggleEditHomeWidgets()" class="text-sm px-3 py-1.5 rounded-lg transition ${r.editingHomeWidgets?"bg-[var(--accent)] text-white":"text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"}">
            ${r.editingHomeWidgets?"✓ Done":'<span class="inline-flex items-center gap-1">'+ve().settings+" Customize</span>"}
          </button>
        </div>
      </div>

      ${r.editingHomeWidgets&&r.showAddWidgetPicker?(()=>{const s=[...Ue.filter(i=>i.id!=="calendar"),ut,...r.customPerspectives||[]],o=new Set(r.homeWidgets.filter(i=>i.type==="perspective").map(i=>i.perspectiveId));return`
          <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-[var(--text-primary)]">Add Perspective Widget</h3>
              <button onclick="showAddWidgetPicker = false; render()" class="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-md transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              ${s.map(i=>{const l=o.has(i.id);return`
                  <button ${l?"disabled":`onclick="addPerspectiveWidget('${i.id}')"`}
                    class="flex items-center gap-2 px-3 py-3.5 sm:py-2.5 rounded-lg border transition text-left ${l?"border-[var(--border-light)] bg-[var(--bg-secondary)] opacity-50 cursor-default":"border-[var(--border-light)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 cursor-pointer"}">
                    <span style="color: ${i.color}">${i.icon||""}</span>
                    <span class="text-sm text-[var(--text-primary)] truncate">${A(i.name)}</span>
                    ${l?'<svg class="w-3.5 h-3.5 text-[var(--success)] ml-auto flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>':""}
                  </button>
                `}).join("")}
            </div>
          </div>
        `})():""}

      ${r.editingHomeWidgets&&a.length>0?`
        <!-- Hidden Widgets -->
        <div class="bg-[var(--bg-secondary)] rounded-lg p-4">
          <div class="flex items-center gap-2 mb-3">
            <svg class="w-4 h-4 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            <span class="text-sm font-medium text-[var(--text-muted)]">Hidden Widgets</span>
          </div>
          <div class="flex flex-wrap gap-2">
            ${a.map(s=>`
              <button onclick="toggleWidgetVisibility('${s.id}')" class="text-sm px-3 py-1.5 rounded-lg border border-dashed border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition flex items-center gap-2">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                ${s.title}
              </button>
            `).join("")}
          </div>
        </div>
      `:""}

      <!-- Daily Focus Card — hidden permanently -->
      

      <!-- Weekly Review Reminder -->
      ${(()=>{if(!(typeof window.isWeeklyReviewOverdue=="function"&&window.isWeeklyReviewOverdue()))return"";const o=typeof window.getDaysSinceReview=="function"?window.getDaysSinceReview():null;return`
          <div class="bg-gradient-to-r from-[var(--accent)]/10 to-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-lg p-4 flex items-start gap-3">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--accent)]/15 flex items-center justify-center">
              <svg class="w-5 h-5 text-[var(--accent)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10z"/>
                <circle cx="12" cy="13" r="1.5"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-0.5">Weekly Review Due</h3>
              <p class="text-sm text-[var(--text-secondary)] mb-3">${o===null?"You haven't done a weekly review yet":o>=14?`Your weekly review is ${o} days overdue`:`It's been ${o} days since your last review`}. GTD recommends reviewing your areas weekly to stay on top of your commitments.</p>
              <button onclick="startReview()" class="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:bg-[var(--accent-dark)] transition">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                Start Weekly Review
              </button>
            </div>
            <button onclick="event.stopPropagation(); lastWeeklyReview = new Date().toISOString(); localStorage.setItem('nucleusLastWeeklyReview', lastWeeklyReview); render()" class="flex-shrink-0 p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50 rounded-md transition" title="Dismiss for 7 days">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
          </div>
        `})()}

      <!-- Widget Grid -->
      <div class="widget-grid grid ${t?"grid-cols-1":"grid-cols-2"} gap-4">
        ${n.map(s=>Fp(s,r.editingHomeWidgets)).join("")}
      </div>
    </div>
  `}function X2(e=4){return Array.from({length:e},()=>`<div class="flex items-center gap-3 p-4">
      <div class="skeleton skeleton-circle w-10 h-10 flex-shrink-0"></div>
      <div class="flex-1 space-y-2">
        <div class="skeleton skeleton-title w-3/4"></div>
        <div class="skeleton skeleton-text w-1/2"></div>
      </div>
    </div>`).join("")}function cc(){return`<div class="rounded-lg border border-[var(--border-light)] overflow-hidden">
    <div class="p-4 space-y-3">
      <div class="skeleton skeleton-title w-1/3"></div>
      ${X2(3)}
    </div>
  </div>`}function br(){return`<div class="p-4 space-y-4 animate-pulse">${cc()}${cc()}</div>`}function Q2(){return typeof window.renderTrackingTab=="function"?window.renderTrackingTab():br()}function Z2(){return typeof window.renderBulkEntryTab=="function"?window.renderBulkEntryTab():br()}function ek(){return typeof window.renderDashboardTab=="function"?window.renderDashboardTab():(window.__dashboardRendererLoading||(window.__dashboardRendererLoading=!0,r2(()=>import("./dashboard-BLCFK_Eq.js"),[]).then(e=>{e?.renderDashboardTab&&(window.renderDashboardTab=e.renderDashboardTab)}).catch(e=>{console.warn("Failed to lazy-load dashboard renderer:",e)}).finally(()=>{window.__dashboardRendererLoading=!1,Ee()})),br())}function tk(){return typeof window.renderTasksTab=="function"?window.renderTasksTab():br()}function nk(){return typeof window.renderSettingsTab=="function"?window.renderSettingsTab():br()}function rk(){return typeof window.renderTaskModalHtml=="function"?window.renderTaskModalHtml():""}function ak(){return typeof window.renderPerspectiveModalHtml=="function"?window.renderPerspectiveModalHtml():""}function sk(){return typeof window.renderAreaModalHtml=="function"?window.renderAreaModalHtml():""}function ok(){return typeof window.renderLabelModalHtml=="function"?window.renderLabelModalHtml():""}function ik(){return typeof window.renderPersonModalHtml=="function"?window.renderPersonModalHtml():""}function lk(){return r.showCategoryModal&&typeof window.renderCategoryModalHtml=="function"?window.renderCategoryModalHtml():""}function dk(){if(typeof window.setupSidebarDragDrop=="function")return window.setupSidebarDragDrop()}function ck(){if(typeof window.initModalAutocomplete=="function")return window.initModalAutocomplete()}function Vo(e){if(typeof window.setupInlineAutocomplete=="function")return window.setupInlineAutocomplete(e)}function uk(){return typeof window.renderUndoToastHtml=="function"?window.renderUndoToastHtml():""}function fk(){return typeof window.renderGlobalSearchHtml=="function"?window.renderGlobalSearchHtml():""}function pk(){return typeof window.renderBraindumpOverlay=="function"?window.renderBraindumpOverlay():""}function hk(){return typeof window.renderBraindumpFAB=="function"?window.renderBraindumpFAB():""}function mk(){return typeof window.renderBottomNav=="function"?window.renderBottomNav():""}function gk(){return typeof window.getCurrentViewInfo=="function"?window.getCurrentViewInfo():{name:"Tasks"}}function vk(){if(typeof window.scrollToContent=="function")return window.scrollToContent()}function Cr(){return localStorage.getItem(Ui)||""}let Fa=null,qo=null,Er=null;function Ee(){const e=typeof performance<"u"&&performance.now?performance.now():Date.now();try{const t=document.getElementById("app");typeof window.runCleanupCallbacks=="function"&&window.runCleanupCallbacks();const n=qo!==null&&qo!==r.activeTab,a=n?0:document.documentElement.scrollTop||document.body.scrollTop;qo=r.activeTab;const s=r.activeTab==="calendar",o=()=>{document.body.classList.remove("body-modal-open"),document.body.style.overflow=""};if(r.authLoading){o(),t.innerHTML=`
        <div class="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)]">
          <svg class="w-16 h-16 mb-6 animate-pulse" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="authGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--warning)"/><stop offset="100%" stop-color="var(--accent-dark, var(--warning))"/></linearGradient></defs>
            <rect x="5" y="5" width="90" height="90" rx="22" fill="url(#authGrad)"/>
            <path d="M50 26 L72 44 V74 H28 V44 Z" fill="white"/>
            <rect x="43" y="55" width="14" height="19" rx="2" fill="var(--accent-dark, var(--warning))"/>
          </svg>
          <p class="text-[var(--text-muted)] text-sm">Loading...</p>
        </div>`;return}if(!r.currentUser){o(),t.innerHTML=`
        <div class="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] px-6">
          <svg class="w-20 h-20 mb-4" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="loginGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--warning)"/><stop offset="100%" stop-color="var(--accent-dark, var(--warning))"/></linearGradient></defs>
            <rect x="5" y="5" width="90" height="90" rx="22" fill="url(#loginGrad)"/>
            <path d="M50 26 L72 44 V74 H28 V44 Z" fill="white"/>
            <rect x="43" y="55" width="14" height="19" rx="2" fill="var(--accent-dark, var(--warning))"/>
          </svg>
          <h1 class="text-2xl font-bold text-[var(--text-primary)] mb-1">Homebase</h1>
          <p class="text-sm text-[var(--text-muted)] mb-8">Your life, all in one place</p>
          ${r.authError?`<p class="text-sm text-[var(--danger)] mb-4">${A(r.authError)}</p>`:""}
          <button type="button" onclick="signInWithGoogle()"
            class="flex items-center gap-3 px-6 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-sm hover:shadow-md transition text-sm font-medium text-[var(--text-primary)]">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          <p class="text-xs text-[var(--text-muted)] mt-12">v${Tt}</p>
        </div>`;return}const i=r.showCacheRefreshPrompt?`
      <div class="max-w-6xl mx-auto px-6 pt-4">
        <div class="rounded-lg border px-4 py-3 flex items-center justify-between gap-3" role="alert" aria-live="polite" aria-atomic="true" style="border-color: color-mix(in srgb, var(--warning) 25%, transparent); background: color-mix(in srgb, var(--warning) 8%, transparent)">
          <div>
            <p class="text-sm font-semibold" style="color: var(--warning)">New app update available</p>
            <p class="text-xs" style="color: var(--warning)">${A(r.cacheRefreshPromptMessage||`Version ${Tt} is available. Refresh recommended to avoid stale cache.`)}</p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="forceHardRefresh()" class="px-3 py-1.5 text-xs font-semibold rounded-lg text-white" style="background: var(--warning)">Refresh Now</button>
            <button onclick="dismissCacheRefreshPrompt()" class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--bg-card)] border" style="border-color: color-mix(in srgb, var(--warning) 30%, transparent); color: var(--warning)">Later</button>
          </div>
        </div>
      </div>
    `:"",l=r.quotaExceededError?`
      <div class="max-w-6xl mx-auto px-6 pt-4">
        <div class="rounded-lg border px-4 py-3 flex items-center justify-between gap-3" role="alert" aria-live="assertive" aria-atomic="true" style="border-color: color-mix(in srgb, var(--danger) 25%, transparent); background: color-mix(in srgb, var(--danger) 8%, transparent)">
          <div>
            <p class="text-sm font-semibold" style="color: var(--danger)">Storage quota exceeded</p>
            <p class="text-xs" style="color: var(--danger)">Your device's localStorage is full. Export your data to free up space, or some changes may not save locally.</p>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="try{exportData()}catch(e){}" class="px-3 py-1.5 text-xs font-semibold rounded-lg text-white" style="background: var(--danger)">Export Data</button>
            <button onclick="state.quotaExceededError=false;render()" class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[var(--bg-card)] border" style="border-color: color-mix(in srgb, var(--danger) 30%, transparent); color: var(--danger)">Dismiss</button>
          </div>
        </div>
      </div>
    `:"",d=document.activeElement;let c=null;d&&(d.tagName==="INPUT"||d.tagName==="TEXTAREA")&&d.id&&(c={id:d.id,value:d.value,selStart:d.selectionStart,selEnd:d.selectionEnd}),t.innerHTML=`<!-- safe: all user content is escaped via escapeHtml() -->
      <!-- Mobile Header - Things 3 style -->
      <header class="mobile-header-compact border-b border-[var(--border-light)] bg-[var(--bg-card)] sticky top-0 z-50" style="display: none;">
        <div class="w-10 flex items-center justify-start">
          ${r.activeTab==="tasks"?`
            <button onclick="openMobileDrawer()" class="w-10 h-10 flex items-center justify-center rounded-lg text-[var(--text-secondary)] active:bg-[var(--bg-secondary)] transition" aria-label="Open sidebar">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
            </button>
          `:`
            <a href="javascript:void(0)" onclick="switchTab('home')" class="flex items-center">
              <svg class="w-8 h-8" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs><linearGradient id="mobileGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--warning)"/><stop offset="100%" stop-color="var(--accent-dark, var(--warning))"/></linearGradient></defs>
                <rect x="5" y="5" width="90" height="90" rx="22" fill="url(#mobileGrad)"/>
                <path d="M50 26 L72 44 V74 H28 V44 Z" fill="white"/>
                <rect x="43" y="55" width="14" height="19" rx="2" fill="var(--accent-dark, var(--warning))"/>
              </svg>
            </a>
          `}
        </div>
        <div class="mobile-header-center">
          ${r.activeTab==="home"?`
            <h1 class="mobile-header-title mobile-header-title-inline text-[17px] font-bold text-[var(--text-primary)] truncate">Homebase</h1>
          `:`
            <h1 class="mobile-header-title text-[17px] font-bold text-[var(--text-primary)] truncate">${r.activeTab==="tasks"?(function(){return gk()?.name||"Tasks"})():r.activeTab==="life"?"Life Score":r.activeTab==="calendar"?"Calendar":"Settings"}</h1>
          `}
          <div class="flex items-center gap-1.5">
            <span class="mobile-version text-[10px] font-semibold text-[var(--text-muted)]">v${Tt}</span>
            <div class="w-1.5 h-1.5 rounded-full" style="background: ${Cr()?"var(--success)":"var(--text-muted)"}"></div>
          </div>
        </div>
        <div class="w-10 flex items-center justify-end">
          ${r.activeTab==="tasks"?`
            <button onclick="openNewTaskModal()" class="w-9 h-9 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-sm active:opacity-80 transition" aria-label="New task">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </button>
          `:r.activeTab==="settings"?`
            <span class="w-9 h-9"></span>
          `:r.activeTab==="calendar"?`
            <button onclick="openNewTaskModal()" class="w-9 h-9 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-sm active:opacity-80 transition" aria-label="New task">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </button>
          `:`
            <button onclick="setToday()" class="mobile-header-action text-[13px] font-semibold text-[var(--accent)] active:opacity-60">Today</button>
          `}
        </div>
      </header>

      <!-- Desktop Header - hidden on mobile -->
      <header class="border-b border-[var(--border-light)] desktop-header-content" style="background: var(--bg-primary);">
        <div class="max-w-6xl mx-auto px-6 py-6">
          <div class="flex items-center justify-between">
            <a href="javascript:void(0)" onclick="switchTab('home')" class="flex items-center gap-4 no-underline cursor-pointer hover:opacity-80 transition">
              <svg class="w-12 h-12 app-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="homebaseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="var(--warning)"/>
                    <stop offset="100%" stop-color="var(--accent-dark, var(--warning))"/>
                  </linearGradient>
                </defs>
                <rect x="5" y="5" width="90" height="90" rx="22" fill="url(#homebaseGrad)"/>
                <path d="M50 26 L72 44 V74 H28 V44 Z" fill="white"/>
                <rect x="43" y="55" width="14" height="19" rx="2" fill="var(--accent-dark, var(--warning))"/>
              </svg>
              <div>
                <div class="flex items-center gap-2">
                  <h1 class="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Homebase</h1>
                  <span class="text-[11px] font-medium text-[var(--text-muted)] bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded-md">v${Tt}</span>
                </div>
                <p class="text-sm text-[var(--text-secondary)] mt-0.5">Your life, all in one place <span class="text-[var(--accent)]">•</span> habits, health, productivity</p>
              </div>
            </a>
            <div class="flex items-center gap-4 header-actions">
              <div class="header-sync-pill flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-light)]" title="${Cr()?"Data synced to GitHub cloud":"Data stored locally only — connect GitHub in Settings to sync"}">
                <div id="sync-indicator" class="w-2 h-2 rounded-full" style="background: ${Cr()?"var(--success)":"var(--text-muted)"}"></div>
                <span class="text-xs text-[var(--text-muted)]">${Cr()?"Synced":"Local"}</span>
              </div>
              <input type="date" id="dateInput" value="${r.currentDate}"
                onclick="this.showPicker()"
                class="input-field header-date-input">
              <button type="button" onclick="setToday()" class="sb-btn header-today-btn px-4 py-2 rounded-lg text-sm font-medium">Today</button>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Navigation - Desktop only -->
      <nav class="desktop-nav border-b border-[var(--border-light)] bg-[var(--bg-card)]">
        <div class="max-w-6xl mx-auto px-6">
          <div class="flex items-center gap-1 py-2">
            <button type="button" onclick="switchTab('home')" aria-label="Go to Home tab" aria-current="${r.activeTab==="home"?"page":"false"}" class="nav-tab px-3.5 py-1.5 text-[13px] font-medium transition-all rounded-lg flex items-center gap-2 ${r.activeTab==="home"?"bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm":"text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50"}">
              ${ve().home.replace("w-5 h-5","w-4 h-4")} Home
            </button>
            <button type="button" onclick="switchTab('tasks')" aria-label="Go to Workspace tab" aria-current="${r.activeTab==="tasks"?"page":"false"}" class="nav-tab px-3.5 py-1.5 text-[13px] font-medium transition-all rounded-lg flex items-center gap-2 ${r.activeTab==="tasks"?"bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm":"text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50"}">
              ${ve().workspace} Workspace
            </button>
            <button type="button" onclick="switchTab('life')" aria-label="Go to Life Score tab" aria-current="${r.activeTab==="life"?"page":"false"}" class="nav-tab px-3.5 py-1.5 text-[13px] font-medium transition-all rounded-lg flex items-center gap-2 ${r.activeTab==="life"?"bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm":"text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50"}">
              ${ve().lifeScore} Life Score
            </button>
            <button type="button" onclick="switchTab('calendar')" aria-label="Go to Calendar tab" aria-current="${s?"page":"false"}" class="nav-tab px-3.5 py-1.5 text-[13px] font-medium transition-all rounded-lg flex items-center gap-2 ${s?"bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm":"text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50"}">
              ${ve().calendar} Calendar
            </button>
            <button type="button" onclick="switchTab('settings')" aria-label="Go to Settings tab" aria-current="${r.activeTab==="settings"?"page":"false"}" class="nav-tab px-3.5 py-1.5 text-[13px] font-medium transition-all rounded-lg flex items-center gap-2 ${r.activeTab==="settings"?"bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm":"text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50"}">
              ${ve().settings} Settings
            </button>
          </div>
        </div>
      </nav>

      ${r.activeTab==="life"?`
      <!-- Sub Navigation for Life Score -->
      <div class="bg-[var(--bg-secondary)]/50 border-b border-[var(--border-light)]" role="tablist" aria-label="Life Score sections">
        <div class="life-sub-nav max-w-6xl mx-auto px-6">
          <div class="flex gap-1 py-2">
            <button type="button" role="tab" aria-selected="${r.activeSubTab==="dashboard"}" onclick="switchSubTab('dashboard')" class="px-4 py-1.5 text-sm rounded-lg transition ${r.activeSubTab==="dashboard"?"bg-[var(--bg-card)] shadow-sm text-[var(--text-primary)] font-medium":"text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]/50"}">
              Dashboard
            </button>
            <button type="button" role="tab" aria-selected="${r.activeSubTab==="daily"}" onclick="switchSubTab('daily')" class="px-4 py-1.5 text-sm rounded-lg transition ${r.activeSubTab==="daily"?"bg-[var(--bg-card)] shadow-sm text-[var(--text-primary)] font-medium":"text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]/50"}">
              Daily Entry
            </button>
            <button type="button" role="tab" aria-selected="${r.activeSubTab==="bulk"}" onclick="switchSubTab('bulk')" class="px-4 py-1.5 text-sm rounded-lg transition ${r.activeSubTab==="bulk"?"bg-[var(--bg-card)] shadow-sm text-[var(--text-primary)] font-medium":"text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]/50"}">
              Bulk Entry
            </button>
          </div>
        </div>
      </div>
      `:""}

      ${i}
      ${l}

      <main class="max-w-6xl mx-auto px-6 py-8">
        ${r.activeTab==="home"?Hp():r.activeTab==="life"?r.activeSubTab==="daily"?Q2():r.activeSubTab==="bulk"?Z2():ek():r.activeTab==="calendar"?typeof window.renderCalendarView=="function"?window.renderCalendarView():br():r.activeTab==="tasks"?tk():nk()}
      </main>

      <footer class="border-t border-[var(--border-light)] py-8 mt-12">
        <div class="flex flex-col items-center gap-3">
          <button onclick="window.forceHardRefresh()" class="px-4 py-2 bg-[var(--accent-light)] text-[var(--accent)] rounded-lg text-sm font-medium hover:bg-[var(--accent-light)] transition inline-flex items-center gap-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><polyline points="21 3 21 9 15 9"/></svg>
            Force Hard Refresh
          </button>
          <p class="text-center text-[var(--text-muted)] text-sm">${Cr()?"Data synced to GitHub":"Data saved locally"} <span class="text-[var(--accent)]">•</span> Homebase</p>
        </div>
      </footer>

      <!-- Mobile Bottom Navigation -->
      ${mk()}

      ${rk()}
      ${ak()}
      ${sk()}
      ${ok()}
      ${ik()}
      ${lk()}
      ${hk()}
      ${fk()}
      ${pk()}
      ${uk()}
    `;const h=document.getElementById("dateInput");if(h&&!h._hasChangeHandler&&(h._hasChangeHandler=!0,h.addEventListener("change",y=>{r.currentDate=y.target.value,Ee()})),r.activeTab==="tasks"&&document.querySelector(".draggable-item:not([data-drag-initialized])")&&dk(),r.showTaskModal&&ck(),r.perspectiveEmojiPickerOpen||r.areaEmojiPickerOpen||r.categoryEmojiPickerOpen){const y=document.getElementById("emoji-search-input");if(y){y.focus();const u=y.value.length;y.setSelectionRange(u,u)}}if(!n&&a>0&&(document.documentElement.scrollTop=a,document.body.scrollTop=a),c){const y=document.getElementById(c.id);if(y){y.value=c.value,y.focus();try{y.setSelectionRange(c.selStart,c.selEnd)}catch{}}}if(Fa&&cancelAnimationFrame(Fa),Fa=requestAnimationFrame(()=>{if(Fa=null,document.getElementById("quick-add-input")&&Vo("quick-add-input"),document.getElementById("home-quick-add-input")&&Vo("home-quick-add-input"),document.getElementById("review-quick-add-input")&&r.reviewMode){const y=r.taskAreas[r.reviewAreaIndex];Vo("review-quick-add-input",{initialMeta:y?{areaId:y.id}:{}})}}),r.activeTab==="calendar"&&typeof window.attachCalendarSwipe=="function"&&window.attachCalendarSwipe(),typeof window.initSwipeActions=="function"&&window.initSwipeActions(),typeof window.initTouchDrag=="function"&&window.initTouchDrag(),typeof window.initPullToRefresh=="function"&&window.initPullToRefresh(),Er&&(Er.disconnect(),Er=null),Pe()&&r.activeTab==="home"){const y=document.getElementById("large-title-sentinel"),u=document.querySelector(".mobile-header-title-inline");y&&u&&(Er=new IntersectionObserver(([x])=>{u.classList.toggle("visible",!x.isIntersecting)},{threshold:0}),Er.observe(y))}const v=!!(r.showTaskModal||r.showPerspectiveModal||r.showAreaModal||r.showLabelModal||r.showPersonModal||r.showCategoryModal||r.showBraindump||r.showGlobalSearch||r.calendarEventModalOpen);if(document.body.classList.toggle("body-modal-open",v),v?document.body.style.overflow="hidden":document.body.style.overflow="",v&&Pe()){const y=document.querySelector(".sheet-handle"),u=document.querySelector(".modal-enhanced, .modal-content"),x=document.querySelector(".modal-overlay");if(y&&u&&x&&!y._sheetDragInit){y._sheetDragInit=!0;let k=0,E=0,D=0,R=!1;const _=40,N=z=>{const S=u.getBoundingClientRect(),O=z.touches[0].clientY;O-S.top>_&&z.target!==y||(k=O,E=k,D=Date.now(),R=!0,u.style.transition="none")},L=z=>{if(!R)return;E=z.touches[0].clientY;const S=Math.max(0,E-k);u.style.transform=`translateY(${S}px)`;const O=Math.min(S/(u.offsetHeight*.5),1);x.style.background=`rgba(0,0,0,${.4*(1-O*.6)})`},W=()=>{if(!R)return;R=!1;const z=E-k,S=z/(Date.now()-D||1);z>u.offsetHeight*.3||z>50&&S>.5?(u.style.transition="transform var(--duration-slow) var(--ease-accelerate)",u.style.transform="translateY(100%)",x.style.transition="background var(--duration-slow) var(--ease-default)",x.style.background="rgba(0,0,0,0)",setTimeout(()=>{typeof window.closeTaskModal=="function"&&r.showTaskModal?window.closeTaskModal():(x.remove(),window.render())},350)):(u.style.transition="transform var(--duration-normal) var(--ease-spring)",u.style.transform="translateY(0)",x.style.transition="background var(--duration-normal) var(--ease-default)",x.style.background="rgba(0,0,0,0.4)")};u.addEventListener("touchstart",N,{passive:!0}),u.addEventListener("touchmove",L,{passive:!0}),u.addEventListener("touchend",W,{passive:!0})}}v&&setTimeout(()=>{const y=document.querySelector("[autofocus]");y&&document.activeElement!==y&&y.focus()},60);const f=(typeof performance<"u"&&performance.now?performance.now():Date.now())-e,p=r.renderPerf||{lastMs:0,avgMs:0,maxMs:0,count:0},m=(p.count||0)+1,g=((p.avgMs||0)*(m-1)+f)/m;r.renderPerf={lastMs:Number(f.toFixed(2)),avgMs:Number(g.toFixed(2)),maxMs:Number(Math.max(p.maxMs||0,f).toFixed(2)),count:m},r._lastRenderWasMobile=Pe()}catch(t){console.error("Render error:",t),document.getElementById("app").innerHTML=`
      <div style="max-width:480px;margin:60px auto;padding:24px;font-family:var(--font-family,system-ui);color:var(--text-primary,#171717);">
        <h2 style="font-size:18px;font-weight:600;margin:0 0 8px;">Something went wrong</h2>
        <p style="font-size:14px;color:var(--text-secondary,#666);margin:0 0 16px;">An error occurred while rendering the app. Your data is safe.</p>
        <details style="margin-bottom:16px;font-size:12px;color:var(--text-muted,#8f8f8f);">
          <summary style="cursor:pointer;margin-bottom:4px;">Error details</summary>
          <pre style="white-space:pre-wrap;word-break:break-word;background:var(--bg-secondary,#f2f2f2);padding:8px;border-radius:6px;margin-top:4px;">${A(t.message)}
${A(t.stack||"")}</pre>
        </details>
        <div style="display:flex;gap:8px;">
          <button onclick="location.reload()" style="padding:8px 16px;border-radius:6px;background:var(--btn-bg,#000);color:#fff;border:none;font-size:13px;font-weight:500;cursor:pointer;">Reload App</button>
          <button onclick="try{window.exportData()}catch(e){}" style="padding:8px 16px;border-radius:6px;background:var(--bg-secondary,#f2f2f2);border:1px solid var(--border,#e6e6e6);font-size:13px;font-weight:500;cursor:pointer;">Export Data</button>
        </div>
      </div>`}}function bk(){r.showCacheRefreshPrompt=!1,r.cacheRefreshPromptMessage="",localStorage.setItem(ni,Tt),Ee()}function yk(e){if(!["home","tasks","life","calendar","settings"].includes(e))return;Cc("light"),document.querySelectorAll(".inline-autocomplete-popup").forEach(a=>a.remove()),r.inlineAutocompleteMeta.clear(),r.mobileDrawerOpen&&(r.mobileDrawerOpen=!1,document.body.style.overflow="",document.body.classList.remove("drawer-open")),r.activeTab=e,e==="calendar"&&(r.calendarSidebarCollapsed=!1);const n=document.querySelector(".mobile-bottom-nav");n&&n.classList.remove("nav-scroll-hidden"),Ge(),Ee(),vk()}function wk(e){r.activeSubTab=e,Ge(),Ee()}function xk(){r.currentDate=he(),Ee()}async function kk(){try{if("serviceWorker"in navigator){const e=await navigator.serviceWorker.getRegistrations();await Promise.all(e.map(t=>t.unregister()))}if("caches"in window){const e=await caches.keys();await Promise.all(e.map(t=>caches.delete(t)))}}catch(e){console.warn("Cache clear error:",e)}window.location.reload()}function zp(e){if(typeof window.parsePrayer=="function")return window.parsePrayer(e);const t=parseFloat(e);if(!t||isNaN(t))return{onTime:0,late:0};const n=Math.floor(t),a=Math.round((t-n)*10);return{onTime:n,late:a}}function Sk(e){if(typeof window.calcPrayerScore=="function")return window.calcPrayerScore(e);const{onTime:t,late:n}=zp(e);return t*(r.WEIGHTS.prayer?.onTime??5)+n*(r.WEIGHTS.prayer?.late??2)}function Wp(e,t,n){const{onTime:a,late:s}=zp(n),o=Sk(n);return`
    <div class="flex-1 text-center">
      <input type="text" value="${n}" placeholder="X.Y"
        class="prayer-input w-full px-3 py-2 border border-[var(--border)] rounded-md text-center font-mono text-lg bg-[var(--bg-input)] mb-1"
        onchange="updateData('prayers', '${e}', this.value)">
      <div class="text-xs font-medium text-[var(--text-secondary)]">${t}</div>
      <div class="text-xs text-[var(--text-muted)] mt-0.5">
        <span class="text-[var(--success)]">${a}✓</span> <span class="text-[var(--warning)]">${s}◐</span>
      </div>
      <div class="text-xs font-semibold text-[var(--accent)] mt-0.5">${o} pts</div>
    </div>
  `}function Ri(e,t,n,a){return`
    <label class="flex items-center justify-between cursor-pointer py-2 px-1 hover:bg-[var(--bg-secondary)] rounded-md transition">
      <span class="text-sm text-[var(--text-primary)]">${e}</span>
      <div class="relative toggle-switch toggle-track" onclick="updateData('${n}', '${a}', !${t})">
        <div class="w-[52px] h-8 rounded-full transition ${t?"toggle-on":"toggle-off"}"></div>
        <div class="absolute left-0.5 top-0.5 w-7 h-7 bg-white rounded-full shadow transition" style="transform: translateX(${t?"20px":"0"})"></div>
      </div>
    </label>
  `}function Tk(e,t,n,a,s,o,i="",l="",d="center"){const c=d==="left"?"left-0":d==="right"?"right-0":"left-1/2 -translate-x-1/2";return`
    <div class="flex-1 text-center group relative">
      <input type="number" step="any" value="${t}" placeholder="${s}"
        class="input-field w-full text-center mb-1"
        onchange="updateData('${n}', '${a}', this.value)">
      <div class="text-xs font-medium text-[var(--text-secondary)] flex items-center justify-center gap-1">
        ${e}
        ${l?'<span class="cursor-help text-[var(--text-muted)] hover:text-[var(--accent)]">ⓘ</span>':""}
      </div>
      <div class="text-xs text-[var(--text-muted)]">${o}${i?` · ${i}`:""}</div>
      ${l?`<div class="absolute ${c} top-full mt-1 z-50 hidden group-hover:block bg-[var(--text-primary)] text-[var(--bg-primary)] text-xs rounded-md p-3 w-48 shadow-lg text-left">${l}</div>`:""}
    </div>
  `}function Nr(e,t,n,a,s=10){return`
    <div class="flex items-center justify-between py-2">
      <span class="text-sm text-[var(--text-primary)]">${e}</span>
      <div class="flex items-center gap-2">
        <button onclick="updateData('${n}', '${a}', Math.max(0, ${t} - 1))"
          class="w-11 h-11 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] flex items-center justify-center font-bold text-[var(--text-muted)] transition active:scale-95">−</button>
        <span class="w-8 text-center font-semibold text-lg text-[var(--text-primary)]">${t}</span>
        <button onclick="updateData('${n}', '${a}', Math.min(${s}, ${t} + 1))"
          class="w-11 h-11 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-dark)] text-white flex items-center justify-center font-bold transition active:scale-95">+</button>
      </div>
    </div>
  `}function On(e,t,n,a){const s=n?Math.min(t/n*100,100):0,o=a?.match(/var\(([^)]+)\)/),i=o?`var(${o[1]})`:a||"var(--accent)",l=Math.round(s);return`
    <div class="sb-card rounded-lg p-4" aria-label="${`${e} score: ${Me(t)} out of ${n} (${l}%)`}">
      <div class="flex justify-between items-center mb-1">
        <span class="sb-section-title text-[var(--text-muted)]">${e}</span>
        <span class="text-xs text-[var(--text-muted)]">${l}%</span>
      </div>
      <div class="font-bold text-2xl text-[var(--text-primary)] mb-2">${Me(t)}</div>
      <div class="h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-500" style="width: ${s}%; background: ${i}"></div>
      </div>
    </div>
  `}function Ik(e,t,n,a,s=""){return`
    <div class="sb-card rounded-lg overflow-hidden border border-[var(--border-light)]">
      <div class="px-5 py-3 flex items-center justify-between bg-[var(--bg-secondary)]" style="border-bottom: 2px solid ${n||"#6B7280"}">
        <div class="flex items-center gap-2">
          <span class="text-lg">${t}</span>
          <h3 class="font-semibold text-[var(--text-primary)]">${e}</h3>
        </div>
        ${s?`<span class="text-[var(--text-muted)] text-xs">${s}</span>`:""}
      </div>
      <div class="p-5 bg-[var(--bg-card)]">${a}</div>
    </div>
  `}function Ck(e){document.activeElement&&(document.activeElement.tagName==="INPUT"||document.activeElement.tagName==="SELECT")&&document.activeElement.blur();const t=new Date(r.currentDate+"T00:00:00");t.setDate(t.getDate()+e),r.currentDate=t.toISOString().slice(0,10),window.render()}function Ek(){const e=tl();e.prayers=e.prayers||{},e.glucose=e.glucose||{},e.whoop=e.whoop||{},e.family=e.family||{},e.habits=e.habits||{};const t=He(e),n={total:t?.total??0,prayer:t?.prayer??0,diabetes:t?.diabetes??0,whoop:t?.whoop??0,family:t?.family??0,habit:t?.habit??0,prayerOnTime:t?.prayerOnTime??0,prayerLate:t?.prayerLate??0},a=r.WEIGHTS.glucose&&r.WEIGHTS.glucose.insulinThreshold||40,s=Pn()&&no(),o=e.libre||{},i=s&&o.currentGlucose,l=sn()&&to();let d="text-[var(--success)]";if(i){const m=Number(o.currentGlucose);m>180||m<70?d="text-[var(--danger)]":m>140&&(d="text-[var(--warning)]")}const c=(m,g)=>`
    <div class="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-secondary)] text-center">
      ${m} <span class="text-xs text-[var(--text-muted)]">${g}</span>
    </div>
    <div class="text-[10px] text-[var(--success)] mt-1 text-center">Auto-synced</div>
  `,h=r.currentDate===he(),v=Ne(r.currentDate),p=new Date(r.currentDate+"T00:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});return`
    <!-- Date Navigation -->
    <div class="flex items-center justify-center gap-3 mb-6">
      <button onclick="navigateTrackingDate(-1)" class="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] active:scale-95 transition" title="Previous day" aria-label="Previous day">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <div class="text-center min-w-[120px]">
        <div class="text-sm font-semibold text-[var(--text-primary)]">${v}</div>
        ${h?"":`<div class="text-[11px] text-[var(--text-muted)]">${p}</div>`}
      </div>
      <button onclick="navigateTrackingDate(1)" class="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] active:scale-95 transition" title="Next day" aria-label="Next day">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
      </button>
      ${h?"":'<button onclick="setToday()" class="text-xs font-medium text-[var(--accent)] hover:underline ml-1">Today</button>'}
    </div>

    <!-- Score Cards Row -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
      ${On("Prayer",n.prayer,r.MAX_SCORES.prayer,"bg-[var(--accent)]")}
      ${On("Diabetes",n.diabetes,r.MAX_SCORES.diabetes,"bg-[var(--success)]")}
      ${On("Whoop",n.whoop,r.MAX_SCORES.whoop,"bg-[var(--notes-accent)]")}
      ${On("Family",n.family,r.MAX_SCORES.family,"bg-[var(--warning)]")}
      ${On("Habits",n.habit,r.MAX_SCORES.habits,"bg-[var(--text-muted)]")}
      <div class="sb-card rounded-lg p-4 bg-[var(--bg-card)] border border-[var(--border-light)]" aria-label="Total score: ${Me(n.total)} out of ${r.MAX_SCORES.total} (${Math.round(n.total/r.MAX_SCORES.total*100)}%)">
        <div class="sb-section-title text-[var(--text-muted)] flex justify-between">
          <span>Total</span>
          <span>${Math.round(n.total/r.MAX_SCORES.total*100)}%</span>
        </div>
        <div class="text-3xl font-bold mt-1 text-[var(--accent)]">${Me(n.total)}</div>
        <div class="h-1.5 bg-[var(--bg-secondary)] rounded-full mt-2 overflow-hidden">
          <div class="h-full bg-[var(--accent)] rounded-full" style="width: ${Math.min(n.total/r.MAX_SCORES.total*100,100)}%"></div>
        </div>
      </div>
    </div>

    <!-- Single Column Flow -->
    <div class="max-w-2xl mx-auto space-y-8">

      <!-- Prayers Section -->
      <section>
        <div class="flex items-center gap-2 mb-2">
          <span class="text-base">🕌</span>
          <h3 class="text-sm font-semibold text-[var(--text-secondary)]">Prayers</h3>
          <span class="text-xs text-[var(--text-muted)]">${n.prayer} pts</span>
        </div>
        <p class="text-[11px] text-[var(--text-muted)] mb-3">Format X.Y: 1=on-time, 0.1=late (e.g. 1.2 = 1 on-time + 2 late)</p>
        <div class="flex gap-2 mb-4">
          ${["fajr","dhuhr","asr","maghrib","isha"].map(m=>Wp(m,m.charAt(0).toUpperCase()+m.slice(1),e.prayers[m])).join("")}
        </div>
        <div class="border-t border-[var(--border-light)] pt-4">
          <div class="flex items-center justify-center gap-3 flex-wrap">
            <span class="text-sm text-[var(--text-secondary)]">📖 Quran</span>
            <button onclick="updateData('prayers', 'quran', Math.max(0, ${parseInt(e.prayers.quran)||0} - 1))"
              class="w-10 h-10 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border)] flex items-center justify-center font-bold text-[var(--text-muted)] active:scale-95 transition" aria-label="Decrease">−</button>
            <input type="number" min="0" value="${parseInt(e.prayers.quran)||0}"
              class="input-field w-14 text-center font-semibold text-lg"
              onchange="updateData('prayers', 'quran', Math.max(0, parseInt(this.value) || 0))">
            <button onclick="updateData('prayers', 'quran', ${parseInt(e.prayers.quran)||0} + 1)"
              class="w-10 h-10 rounded-full bg-[var(--accent)] hover:opacity-80 text-white flex items-center justify-center font-bold active:scale-95 transition" aria-label="Increase">+</button>
            <span class="text-xs text-[var(--text-muted)]">pages · ${(parseInt(e.prayers.quran)||0)*5} pts</span>
          </div>
        </div>
      </section>

      <div class="border-t border-[var(--border-light)]"></div>

      <!-- Glucose Section -->
      <section>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-base">💉</span>
          <h3 class="text-sm font-semibold text-[var(--text-secondary)]">Glucose</h3>
          ${s?`
            <span class="inline-flex items-center gap-1 text-xs text-[var(--success)] bg-[color-mix(in_srgb,var(--success)_8%,transparent)] px-2 py-0.5 rounded-full ml-auto">
              <span class="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span>Libre Connected
            </span>
          `:""}
        </div>
        ${i?`
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-light)]">
            <div class="flex items-center gap-2">
              <span class="text-xl font-bold ${d}">${o.currentGlucose}</span>
              <span class="text-base ${d}">${o.trend||"→"}</span>
              <span class="text-xs text-[var(--text-muted)]">mg/dL now</span>
            </div>
          </div>
        `:""}
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="text-center">
            <label class="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Avg Glucose</label>
            ${s&&e.glucose.avg?c(e.glucose.avg,"mg/dL"):`<input type="number" step="any" inputmode="decimal" value="${e.glucose.avg}" placeholder="105"
                  class="input-field w-full text-center"
                  onchange="updateData('glucose', 'avg', this.value)">
                <div class="text-xs text-[var(--text-muted)] mt-1 text-center">mg/dL · 105=10pts</div>`}
          </div>
          <div class="text-center">
            <label class="block text-xs font-medium text-[var(--text-muted)] mb-1.5">TIR</label>
            ${s&&e.glucose.tir?c(e.glucose.tir,"%"):`<input type="number" step="any" inputmode="decimal" value="${e.glucose.tir}" placeholder="70+"
                  class="input-field w-full text-center"
                  onchange="updateData('glucose', 'tir', this.value)">
                <div class="text-xs text-[var(--text-muted)] mt-1 text-center">% · 0.1pts/%</div>`}
          </div>
          <div class="text-center">
            <label class="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Insulin</label>
            <input type="number" step="any" inputmode="decimal" value="${e.glucose.insulin}" placeholder="≤${a}"
              class="input-field w-full text-center"
              onchange="updateData('glucose', 'insulin', this.value)">
            <div class="text-xs text-[var(--text-muted)] mt-1 text-center">units · ≤${a}=+5</div>
          </div>
        </div>
      </section>

      <div class="border-t border-[var(--border-light)]"></div>

      <!-- Whoop Section -->
      <section>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-base">⏱️</span>
          <h3 class="text-sm font-semibold text-[var(--text-secondary)]">Whoop</h3>
          ${l?`
            <span class="inline-flex items-center gap-1 text-xs text-[var(--success)] bg-[color-mix(in_srgb,var(--success)_8%,transparent)] px-2 py-0.5 rounded-full ml-auto">
              <span class="w-1.5 h-1.5 rounded-full bg-[var(--success)]"></span>Auto-synced
            </span>
          `:""}
        </div>
        <div class="grid grid-cols-3 gap-4 mb-4">
          <div class="text-center">
            <label class="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Sleep Perf</label>
            ${l&&e.whoop.sleepPerf?c(e.whoop.sleepPerf,"%"):`<input type="number" step="any" inputmode="decimal" value="${e.whoop.sleepPerf}" placeholder="≥90"
                  class="input-field w-full text-center"
                  onchange="updateData('whoop', 'sleepPerf', this.value)">
                <div class="text-xs text-[var(--text-muted)] mt-1 text-center">% · ≥90%</div>`}
          </div>
          <div class="text-center">
            <label class="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Recovery</label>
            ${l&&e.whoop.recovery?c(e.whoop.recovery,"%"):`<input type="number" step="any" inputmode="decimal" value="${e.whoop.recovery}" placeholder="≥66"
                  class="input-field w-full text-center"
                  onchange="updateData('whoop', 'recovery', this.value)">
                <div class="text-xs text-[var(--text-muted)] mt-1 text-center">% · ≥66%</div>`}
          </div>
          <div class="text-center">
            <label class="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Strain</label>
            ${l&&e.whoop.strain?c(e.whoop.strain,"/21"):`<input type="number" step="any" inputmode="decimal" value="${e.whoop.strain}" placeholder="10-14"
                  class="input-field w-full text-center"
                  onchange="updateData('whoop', 'strain', this.value)">
                <div class="text-xs text-[var(--text-muted)] mt-1 text-center">/21 · match recovery</div>`}
          </div>
        </div>
        <!-- Whoop Age (always manual) -->
        <div class="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-light)]">
          <span class="text-sm font-medium text-[var(--text-primary)]">Whoop Age</span>
          <div class="flex items-center gap-2">
            <input type="number" step="0.1" inputmode="decimal" value="${e.whoop.whoopAge||""}" placeholder="—"
              class="input-field w-16 text-center font-bold text-[var(--accent)]"
              onchange="updateData('whoop', 'whoopAge', this.value)">
            <span class="text-xs text-[var(--text-muted)]">yrs</span>
          </div>
        </div>
      </section>

      <div class="border-t border-[var(--border-light)]"></div>

      <!-- Family Section -->
      <section>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-base">👨‍👩‍👧‍👦</span>
          <h3 class="text-sm font-semibold text-[var(--text-secondary)]">Family Check-ins</h3>
          <span class="text-xs text-[var(--text-muted)]">${Object.values(e.family||{}).filter(Boolean).length}/${(r.familyMembers||[]).length}</span>
        </div>
        <div class="space-y-0.5">
          ${(r.familyMembers||[]).map(m=>Ri(m.name,e.family[m.id],"family",m.id)).join("")}
        </div>
      </section>

      <div class="border-t border-[var(--border-light)]"></div>

      <!-- Habits Section -->
      <section>
        <div class="flex items-center gap-2 mb-4">
          <span class="text-base">✨</span>
          <h3 class="text-sm font-semibold text-[var(--text-secondary)]">Habits</h3>
        </div>
        <div class="space-y-1">
          ${Nr("🏋️ Exercise",e.habits.exercise||0,"habits","exercise",5)}
          ${Nr("📚 Reading",e.habits.reading||0,"habits","reading",5)}
          ${Nr("🧘 Meditation",e.habits.meditation||0,"habits","meditation",5)}
          ${Nr("🦷 Brush Teeth",e.habits.brushTeeth||0,"habits","brushTeeth",3)}
          ${Ri("💊 Vitamins taken",e.habits.vitamins,"habits","vitamins")}
        </div>
        <div class="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-[var(--border-light)]">
          <div class="text-center">
            <input type="number" step="any" inputmode="decimal" value="${e.habits.water}" placeholder="2.5"
              class="input-field w-full text-center mb-1"
              onchange="updateData('habits', 'water', this.value)">
            <div class="text-xs font-medium text-[var(--text-secondary)]">💧 Water</div>
            <div class="text-xs text-[var(--text-muted)]">L · 1pt/L</div>
          </div>
          <div class="text-center">
            <input type="number" step="1" inputmode="numeric" value="${e.habits.nop}" placeholder="0-1"
              class="input-field w-full text-center mb-1"
              onchange="updateData('habits', 'nop', this.value)">
            <div class="text-xs font-medium text-[var(--text-secondary)]">💤 NoP</div>
            <div class="text-xs text-[var(--text-muted)]">1=+2, 0=-2</div>
          </div>
        </div>
      </section>

    </div>
  `}function $k(e,t){r.bulkMonth=parseInt(e),r.bulkYear=parseInt(t),window.render()}function Dk(e){r.bulkCategory=e,window.render()}function _k(e,t,n,a){if(r.allData[e]||(r.allData[e]=la()),t==="family")r.allData[e][t][n]=a==="1"||a===!0;else{const o=parseFloat(a);r.allData[e][t][n]=a===""?null:Number.isNaN(o)?a:o}r.allData[e]._lastModified=new Date().toISOString(),it(),cr(),window.debouncedSaveToGithub();const s=document.getElementById("score-"+e);if(s){const o=He(r.allData[e]).total;s.textContent=Me(o)}Up()}function Up(){const e=Yl(r.bulkMonth,r.bulkYear);let t=0,n=0;for(let c=1;c<=e;c++){const h=r.bulkYear+"-"+String(r.bulkMonth+1).padStart(2,"0")+"-"+String(c).padStart(2,"0");r.allData[h]&&(n++,t+=He(r.allData[h]).total)}const a=n>0?Math.round(t/n):0,s=Math.round(n/e*100),o=document.getElementById("bulk-days-logged"),i=document.getElementById("bulk-total-score"),l=document.getElementById("bulk-avg-score"),d=document.getElementById("bulk-completion");o&&(o.textContent=Me(n)),i&&(i.textContent=Me(t)),l&&(l.textContent=Me(a)),d&&(d.textContent=s+"%")}function Yl(e,t){return new Date(t,e+1,0).getDate()}function Ak(){const e=Yl(r.bulkMonth,r.bulkYear),t=new Date(r.bulkYear,r.bulkMonth).toLocaleDateString("en-US",{month:"long",year:"numeric"}),n={prayers:"var(--accent)",glucose:"var(--success)",whoop:"var(--notes-accent)",family:"var(--warning)",habits:"var(--text-muted)"},a=sn(),s=Pn(),o=["sleepPerf","recovery","strain"],i=["avg","tir"],l=r.familyMembers||[],d=l.map(z=>z.id),c=l.map(z=>z.name),h={prayers:{label:"🕌 Prayers",fields:["fajr","dhuhr","asr","maghrib","isha","quran"],headers:["F","D","A","M","I","Q"]},glucose:{label:"💉 Glucose",fields:["avg","tir","insulin"],headers:["Avg","TIR","Insulin"]},whoop:{label:"⏱️ Whoop",fields:["sleepPerf","recovery","strain"],headers:["Sleep%","Rec","Strain"]},family:{label:"👨‍👩‍👧‍👦 Family",fields:d,headers:c},habits:{label:"✨ Habits",fields:["exercise","reading","meditation","water","vitamins","brushTeeth","nop"],headers:["🏋️","📚","🧘","💧","💊","🦷","💤"]}},v=JSON.parse(JSON.stringify(h));let f="";if(a&&r.bulkCategory==="whoop"&&(v.whoop.fields=v.whoop.fields.filter(z=>!o.includes(z)),v.whoop.headers=[],v.whoop.fields.length===0&&(f=`
        <div class="flex items-center gap-2 px-4 py-3 bg-[color-mix(in_srgb,var(--success)_8%,transparent)] border border-[color-mix(in_srgb,var(--success)_30%,transparent)] rounded-lg text-sm text-[var(--success)]">
          <span class="w-2 h-2 rounded-full bg-[var(--success)] flex-shrink-0"></span>
          All Whoop metrics are auto-synced. No manual entry needed.
        </div>
      `)),s&&r.bulkCategory==="glucose"){const z=v.glucose.fields,S=v.glucose.headers,O=[],w=[];z.forEach((j,ee)=>{i.includes(j)||(O.push(j),w.push(S[ee]))}),v.glucose.fields=O,v.glucose.headers=w,O.length>0&&(f=`
        <div class="flex items-center gap-2 px-4 py-3 bg-[color-mix(in_srgb,var(--success)_8%,transparent)] border border-[color-mix(in_srgb,var(--success)_30%,transparent)] rounded-lg text-sm text-[var(--success)]">
          <span class="w-2 h-2 rounded-full bg-[var(--success)] flex-shrink-0"></span>
          Avg & TIR are auto-synced by Libre. Only Insulin shown for manual entry.
        </div>
      `)}const p=v[r.bulkCategory];if(p.fields.length===0)return Mk(t,n,v,h,f,e);let m="";const g=new Date().getFullYear();[g-3,g-2,g-1,g,g+1].forEach(function(z){for(let S=0;S<12;S++){const O=new Date(z,S).toLocaleDateString("en-US",{month:"short",year:"numeric"}),w=S===r.bulkMonth&&z===r.bulkYear?"selected":"";m+='<option value="'+S+"-"+z+'" '+w+">"+O+"</option>"}});let u="";for(let z=1;z<=e;z++){const S=r.bulkYear+"-"+String(r.bulkMonth+1).padStart(2,"0")+"-"+String(z).padStart(2,"0"),O=r.allData[S]||la(),w=new Date(r.bulkYear,r.bulkMonth,z).toLocaleDateString("en-US",{weekday:"short"}),j=[0,6].includes(new Date(r.bulkYear,r.bulkMonth,z).getDay()),ee=S===he(),C=He(O);let Z="";p.fields.forEach(I=>{const q=O[r.bulkCategory][I];r.bulkCategory==="family"||r.bulkCategory==="habits"&&I==="vitamins"?Z+='<td class="border border-[var(--border)] px-1 py-1 text-center"><label class="inline-flex min-h-[44px] min-w-[44px] items-center justify-center cursor-pointer"><input type="checkbox" '+(q?"checked":"")+` class="w-5 h-5 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]" onchange="updateBulkData('`+S+"', '"+r.bulkCategory+"', '"+I+`', this.checked ? '1' : '')"></label></td>`:r.bulkCategory==="prayers"&&I!=="quran"?Z+='<td class="border border-[var(--border)] px-1 py-1 min-h-[44px]"><input type="text" value="'+(q||"")+`" placeholder="X.Y" class="input-field-sm w-full min-h-[44px] text-center font-mono border-0" onchange="updateBulkData('`+S+"', '"+r.bulkCategory+"', '"+I+`', this.value)"></td>`:Z+='<td class="border border-[var(--border)] px-1 py-1 min-h-[44px]"><input type="number" step="any" value="'+(q||"")+`" class="input-field-sm w-full min-h-[44px] text-center border-0" onchange="updateBulkData('`+S+"', '"+r.bulkCategory+"', '"+I+`', this.value)"></td>`});const G=(j?"bg-[var(--bg-secondary)]/50 ":"")+(ee?"bg-[var(--accent)]/10 ":"")+"hover:bg-[var(--bg-secondary)]",J="border border-[var(--border)] px-2 py-1 font-medium text-center text-[var(--text-primary)] sticky left-0 z-10 "+(ee?"bg-[var(--accent)]/20":"bg-[var(--bg-card)]"),P="border border-[var(--border)] px-2 py-1 text-xs text-[var(--text-muted)] text-center sticky left-10 z-10 "+(ee?"bg-[var(--accent)]/20":"bg-[var(--bg-card)]");u+='<tr class="'+G+'"><td class="'+J+'">'+z+'</td><td class="'+P+'">'+w+"</td>"+Z+'<td id="score-'+S+'" class="border border-[var(--border)] px-2 py-1 text-center font-semibold text-[var(--accent)]">'+Me(C.total)+"</td></tr>"}let x="";Object.entries(h).forEach(function([z,S]){const O=n[z],w=r.bulkCategory===z,j=w?"text-white shadow-sm":"bg-[var(--bg-secondary)] hover:bg-[var(--border)] text-[var(--text-secondary)]",ee=w?"background-color: "+O:"";x+=`<button onclick="setBulkCategory('`+z+`')" class="px-4 py-1.5 rounded-full text-sm font-medium transition `+j+'" style="'+ee+'">'+S.label+"</button>"});const k=n[r.bulkCategory];let E="";p.headers.forEach(function(z){E+='<th class="border px-3 py-3 font-medium" style="border-color: '+k+'">'+z+"</th>"});let D=0,R=0;for(let z=1;z<=e;z++){const S=r.bulkYear+"-"+String(r.bulkMonth+1).padStart(2,"0")+"-"+String(z).padStart(2,"0");r.allData[S]&&(R++,D+=He(r.allData[S]).total)}const _=R>0?Math.round(D/R):0,N=Math.round(R/e*100),L=r.bulkCategory==="prayers"?'<span class="ml-2 text-[var(--text-muted)]">X.Y format: 1 = on-time, 0.1 = late, 1.2 = 1 on-time + 2 late</span>':"",W=r.bulkCategory==="family"?'<span class="ml-2 text-[var(--text-muted)]">Check box if you connected with that person</span>':"";return`<div class="space-y-4"><div class="flex flex-wrap items-end gap-4"><div><label class="text-xs text-[var(--text-muted)] block mb-1.5">Month</label><select onchange="const [m,y] = this.value.split('-'); setBulkMonth(m, y)" class="input-field">`+m+'</select></div><div class="flex gap-1.5 flex-wrap">'+x+"</div></div>"+(f?'<div class="mt-2">'+f+"</div>":"")+'<div class="rounded-lg px-3 py-2 text-sm flex items-center gap-2" style="background-color: color-mix(in srgb, '+k+" 7%, transparent); border-left: 3px solid "+k+'"><strong class="text-[var(--text-primary)]">'+t+'</strong><span class="text-[var(--text-secondary)]">'+p.label+"</span>"+L+W+'</div><div class="rounded-lg border border-[var(--border-light)] overflow-hidden bg-[var(--bg-card)]"><div class="overflow-x-auto" style="-webkit-overflow-scrolling: touch"><table class="w-full text-sm" style="min-width: 480px"><thead><tr class="text-white" style="background-color: '+k+'"><th class="border px-2 py-3 sticky left-0 z-20" style="border-color: '+k+"; background-color: "+k+'">Day</th><th class="border px-2 py-3 sticky left-10 z-20" style="border-color: '+k+"; background-color: "+k+'"></th>'+E+'<th class="border px-3 py-3 font-medium" style="border-color: '+k+'">Score</th></tr></thead><tbody>'+u+'</tbody></table></div></div><div class="grid grid-cols-2 md:grid-cols-4 gap-3"><div class="bg-[var(--bg-secondary)] rounded-lg p-4 text-center border border-[var(--border-light)]"><div id="bulk-days-logged" class="text-2xl font-bold text-[var(--text-primary)]">'+Me(R)+'</div><div class="text-xs text-[var(--text-muted)] mt-1">Days Logged</div></div><div class="bg-[var(--bg-secondary)] rounded-lg p-4 text-center border border-[var(--border-light)]"><div id="bulk-total-score" class="text-2xl font-bold text-[var(--accent)]">'+Me(D)+'</div><div class="text-xs text-[var(--text-muted)] mt-1">Total Score</div></div><div class="bg-[var(--bg-secondary)] rounded-lg p-4 text-center border border-[var(--border-light)]"><div id="bulk-avg-score" class="text-2xl font-bold text-[var(--text-primary)]">'+Me(_)+'</div><div class="text-xs text-[var(--text-muted)] mt-1">Avg Daily Score</div></div><div class="bg-[var(--bg-secondary)] rounded-lg p-4 text-center border border-[var(--border-light)]"><div id="bulk-completion" class="text-2xl font-bold text-[var(--text-primary)]">'+N+'%</div><div class="text-xs text-[var(--text-muted)] mt-1">Completion Rate</div></div></div></div>'}function Mk(e,t,n,a,s,o){let i="";const l=new Date().getFullYear();[l-3,l-2,l-1,l,l+1].forEach(function(m){for(let g=0;g<12;g++){const y=new Date(m,g).toLocaleDateString("en-US",{month:"short",year:"numeric"}),u=g===r.bulkMonth&&m===r.bulkYear?"selected":"";i+='<option value="'+g+"-"+m+'" '+u+">"+y+"</option>"}});let c="";Object.entries(a).forEach(function([m,g]){const y=t[m],u=r.bulkCategory===m,x=u?"text-white shadow-sm":"bg-[var(--bg-secondary)] hover:bg-[var(--border)] text-[var(--text-secondary)]",k=u?"background-color: "+y:"";c+=`<button onclick="setBulkCategory('`+m+`')" class="px-4 py-1.5 rounded-full text-sm font-medium transition `+x+'" style="'+k+'">'+g.label+"</button>"});let h=0,v=0;for(let m=1;m<=o;m++){const g=r.bulkYear+"-"+String(r.bulkMonth+1).padStart(2,"0")+"-"+String(m).padStart(2,"0");r.allData[g]&&(v++,h+=He(r.allData[g]).total)}const f=v>0?Math.round(h/v):0,p=Math.round(v/o*100);return`<div class="space-y-4"><div class="flex flex-wrap items-end gap-4"><div><label class="text-xs text-[var(--text-muted)] block mb-1.5">Month</label><select onchange="const [m,y] = this.value.split('-'); setBulkMonth(m, y)" class="input-field">`+i+'</select></div><div class="flex gap-1.5 flex-wrap">'+c+"</div></div>"+s+(s?`<p class="text-sm text-[var(--text-secondary)]">Switch to another category to log data, or <button type="button" onclick="window.switchTab('life'); window.switchSubTab('daily')" class="text-[var(--accent)] font-medium hover:underline">go to Daily Entry</button>.</p>`:"")+'<div class="grid grid-cols-2 md:grid-cols-4 gap-3"><div class="bg-[var(--bg-secondary)] rounded-lg p-4 text-center border border-[var(--border-light)]"><div id="bulk-days-logged" class="text-2xl font-bold text-[var(--text-primary)]">'+Me(v)+'</div><div class="text-xs text-[var(--text-muted)] mt-1">Days Logged</div></div><div class="bg-[var(--bg-secondary)] rounded-lg p-4 text-center border border-[var(--border-light)]"><div id="bulk-total-score" class="text-2xl font-bold text-[var(--accent)]">'+Me(h)+'</div><div class="text-xs text-[var(--text-muted)] mt-1">Total Score</div></div><div class="bg-[var(--bg-secondary)] rounded-lg p-4 text-center border border-[var(--border-light)]"><div id="bulk-avg-score" class="text-2xl font-bold text-[var(--text-primary)]">'+Me(f)+'</div><div class="text-xs text-[var(--text-muted)] mt-1">Avg Daily Score</div></div><div class="bg-[var(--bg-secondary)] rounded-lg p-4 text-center border border-[var(--border-light)]"><div id="bulk-completion" class="text-2xl font-bold text-[var(--text-primary)]">'+p+'%</div><div class="text-xs text-[var(--text-muted)] mt-1">Completion Rate</div></div></div></div>'}function Ko(e){return window.getFilteredTasks(e)}function Pk(){return window.getCurrentFilteredTasks()}function Nk(){return window.getCurrentViewInfo()}function Lk(e){return window.groupTasksByDate(e)}function Ok(e){return window.groupTasksByCompletionDate(e)}function Rk(e){return window.getTasksByCategory(e)}function Bk(e){return window.getTasksByLabel(e)}function Gp(e){return window.renderNotesOutliner(e)}function Vp(){return window.renderNotesBreadcrumb()}function jk(e){return typeof window.renderTriggersOutliner=="function"?window.renderTriggersOutliner(e):""}function Fk(){return typeof window.renderTriggersBreadcrumb=="function"?window.renderTriggersBreadcrumb():""}function wo(e,t,n,a,s){const o=e.filter(m=>m.dueDate&&m.dueDate<t),i=e.filter(m=>!o.includes(m)&&(m.today||m.dueDate===t)),l=e.filter(m=>m.dueDate&&m.dueDate>t&&!i.includes(m)),d=e.filter(m=>m.deferDate&&m.deferDate>t&&!o.includes(m)&&!l.includes(m)),c=e.filter(m=>m.status==="anytime"&&!o.includes(m)&&!i.includes(m)&&!l.includes(m)&&!d.includes(m)),h=e.filter(m=>m.status==="someday"),v=e.filter(m=>m.status==="inbox"),f=(m,g,y,u="")=>`
    <div class="px-4 py-2 border-t border-[var(--border-light)]">
      <button onclick="window.createTask('', { status: '${m}', ${u} ${a} }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && ${s} && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
        class="flex items-center gap-2 px-3 py-2 w-full text-sm hover:bg-opacity-50 rounded-lg transition text-left" style="color: ${y}">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        ${g}
      </button>
    </div>`;return`
    ${o.length+i.length+l.length+d.length+v.length+c.length+h.length>0?"":`
      <div class="text-center py-12 text-[var(--text-muted)]">
        <p class="text-sm font-medium mb-2">No tasks yet</p>
        ${f("anytime","Add a task...",n)}
      </div>
    `}
    ${o.length>0?`
      <div class="bg-[var(--bg-card)] rounded-lg overflow-hidden" style="border: 1px solid color-mix(in srgb, var(--overdue-color) 12%, transparent)">
        <div class="px-4 py-3 flex items-center gap-2" style="background: color-mix(in srgb, var(--overdue-color) 3%, transparent); border-bottom: 1px solid color-mix(in srgb, var(--overdue-color) 12%, transparent)">
          <svg class="w-4 h-4" style="color: var(--overdue-color)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span class="text-sm font-semibold" style="color: var(--overdue-color)">Overdue</span>
          <span class="text-xs ml-1" style="color: var(--overdue-color); opacity: 0.6">${o.length}</span>
        </div>
        <div class="task-list">${o.map(m=>Oe(m)).join("")}</div>
      </div>
    `:""}

    ${i.length>0?`
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
        <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2" style="background: color-mix(in srgb, var(--today-color) 3%, transparent)">
          <svg class="w-4 h-4" style="color: var(--today-color)" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Today</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${i.length}</span>
        </div>
        <div class="task-list">${i.map(m=>Oe(m,!1)).join("")}</div>
        ${f("anytime","Add to Today...","var(--today-color)","today: true,")}
      </div>
    `:""}

    ${l.length>0?`
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
        <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
          <svg class="w-4 h-4" style="color: var(--overdue-color)" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Upcoming</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${l.length}</span>
        </div>
        <div class="task-list">${l.map(m=>Oe(m)).join("")}</div>
      </div>
    `:""}

    ${d.length>0?`
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
        <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
          <svg class="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span class="text-sm font-semibold text-[var(--text-muted)]">Deferred</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${d.length}</span>
        </div>
        <div class="task-list">${d.map(m=>Oe(m)).join("")}</div>
      </div>
    `:""}

    ${v.length>0?`
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
        <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
          <svg class="w-4 h-4" style="color: var(--inbox-color)" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Inbox</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${v.length}</span>
        </div>
        <div class="task-list">${v.map(m=>Oe(m)).join("")}</div>
        ${f("anytime","Add Task...","var(--inbox-color)")}
      </div>
    `:""}

    ${c.length>0?`
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
        <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
          <svg class="w-4 h-4" style="color: var(--anytime-color)" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Anytime</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${c.length}</span>
        </div>
        <div class="task-list">${c.map(m=>Oe(m)).join("")}</div>
        ${f("anytime","Add to Anytime...","var(--anytime-color)")}
      </div>
    `:""}

    ${h.length>0?`
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
        <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
          <svg class="w-4 h-4" style="color: var(--someday-color)" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Someday</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${h.length}</span>
        </div>
        <div class="task-list">${h.map(m=>Oe(m)).join("")}</div>
        ${f("someday","Add to Someday...","var(--someday-color)")}
      </div>
    `:""}
  `}function xo(e,t,n){return`
    <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
      <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="9" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1.5"/><circle cx="4" cy="12" r="1.5"/><circle cx="4" cy="18" r="1.5"/></svg>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Notes</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${e.length}</span>
        </div>
        <button onclick="window.createRootNote(${t})"
          class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-lg transition">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Add Note
        </button>
      </div>
      ${e.length>0?`
        ${Vp()}
        <div class="py-2">${Gp(n)}</div>
        <div class="px-4 py-2 border-t border-[var(--border-light)]">
          <button onclick="window.createRootNote(${t})"
            class="flex items-center gap-2 px-3 py-2 w-full text-sm text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-lg transition text-left">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Add another note...
          </button>
        </div>
      `:`
        <div class="px-4 py-8 text-center">
          <p class="text-sm text-[var(--text-muted)] mb-3">No notes here yet</p>
          <button onclick="window.createRootNote(${t})"
            class="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-light)] text-[var(--accent)] text-sm font-medium rounded-lg hover:bg-[var(--accent-light)] transition">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Create your first note
          </button>
        </div>
      `}
    </div>
  `}function qp(e,t,n){return`
    <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
      <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span style="color: var(--today-color)">${ve().trigger.replace("w-5 h-5","w-4 h-4")}</span>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Triggers</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${e.length}</span>
        </div>
        <button onclick="window.createRootTrigger(${t})"
          class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--trigger-color)] hover:bg-[color-mix(in_srgb,var(--trigger-color)_6%,transparent)] rounded-lg transition">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          Add Trigger
        </button>
      </div>
      ${e.length>0?`
        ${Fk()}
        <div class="py-2">${jk(n)}</div>
        <div class="px-4 py-2 border-t border-[var(--border-light)]">
          <button onclick="window.createRootTrigger(${t})"
            class="flex items-center gap-2 px-3 py-2 w-full text-sm text-[var(--text-muted)] hover:text-[var(--trigger-color)] hover:bg-[color-mix(in_srgb,var(--trigger-color)_6%,transparent)] rounded-lg transition text-left">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Add another trigger...
          </button>
        </div>
      `:`
        <div class="px-4 py-8 text-center">
          <p class="text-sm text-[var(--text-muted)] mb-3">No triggers here yet</p>
          <button onclick="window.createRootTrigger(${t})"
            class="inline-flex items-center gap-2 px-4 py-2 bg-[color-mix(in_srgb,var(--trigger-color)_6%,transparent)] text-[var(--trigger-color)] text-sm font-medium rounded-lg hover:bg-[color-mix(in_srgb,var(--trigger-color)_12%,transparent)] transition">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Add your first trigger
          </button>
        </div>
      `}
    </div>
  `}function Oe(e,t=!0,n=!1){const a=nn(),s=et(e.areaId),o=e.categoryId?rt(e.categoryId):null,i=(e.labels||[]).map(x=>ua(x)).filter(Boolean),l=(e.people||[]).map(x=>pa(x)).filter(Boolean),d=he(),c=e.dueDate&&e.dueDate<d&&!e.completed,h=e.dueDate===d,v=e.dueDate&&!h&&!c&&(()=>{const x=(new Date(e.dueDate+"T00:00:00")-new Date(d+"T00:00:00"))/864e5;return x>0&&x<=2})(),f=!n&&(s||o||i.length>0||l.length>0||t&&e.dueDate||e.deferDate||e.repeat&&e.repeat.type!=="none"||e.notes),p=r.inlineEditingTaskId===e.id,m=e.indent||0,g=m*24,y=[];if(s&&o)y.push(`${A(s.name)} › ${A(o.name)}`);else if(s)y.push(A(s.name));else if(o){const x=et(o.areaId);y.push(x?`${A(x.name)} › ${A(o.name)}`:A(o.name))}if(i.length>0&&y.push(i.map(x=>A(x.name)).join(", ")),l.length>0&&y.push(l.map(x=>A(x.name.split(" ")[0])).join(", ")),e.deferDate&&y.push(`Start ${Ne(e.deferDate)}`),t&&e.dueDate&&y.push(`Due ${Ne(e.dueDate)}`),e.repeat&&e.repeat.type!=="none"&&y.push("Repeats"),e.notes&&y.push("Notes"),e.timeEstimate&&y.push(`⏱️ ${e.timeEstimate}m`),n)return`
      <div class="task-item compact-task group relative hover:bg-[var(--bg-secondary)]/50 rounded-lg transition cursor-pointer"
        onclick="window.inlineEditingTaskId=null; window.editingTaskId='${e.id}'; window.showTaskModal=true; window.render()">
        <div class="flex items-center min-h-[32px] px-2 py-0.5">
          ${e.isNote?`
            <div class="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-accent)]"></div>
            </div>
          `:`
            <button onclick="event.stopPropagation(); window.toggleTaskComplete('${e.id}')"
              aria-label="${e.completed?"Mark task as incomplete":"Mark task as complete"}: ${A(e.title)}"
              class="task-checkbox w-[18px] h-[18px] rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center transition-all ${e.completed?"completed bg-[var(--accent)] border-[var(--accent)] text-white":"border-[var(--text-muted)] hover:border-[var(--accent)]"}">
              ${e.completed?'<svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>':""}
            </button>
          `}
          <span class="flex-1 ml-2.5 text-[13px] leading-snug truncate ${e.completed?"line-through text-[var(--text-muted)]":"text-[var(--text-primary)]"}">
            ${e.flagged?`<span class="inline-flex items-center mr-1" style="color: var(--flagged-color)">${ve().flagged.replace("w-5 h-5","w-3 h-3")}</span>`:""}
            ${A(e.title)}
          </span>
          <div class="flex items-center gap-1.5 ml-2 flex-shrink-0 min-w-0 text-[11px]">
            ${s?`<span class="text-[var(--text-muted)] truncate max-w-[70px] sm:max-w-[90px]">${A(s.name)}${o?" › "+A(o.name):""}</span>`:""}
            ${e.dueDate?`<span class="flex-shrink-0 ${c?"font-medium":h?"text-[var(--accent)] font-medium":v?"font-medium":"text-[var(--text-muted)]"}" style="${c?"color: var(--overdue-color)":v?"color: var(--flagged-color)":""}">${Ne(e.dueDate)}</span>`:""}
            ${e.repeat&&e.repeat.type!=="none"?`<span class="text-[var(--text-muted)]" title="Repeats ${e.repeat.interval>1?"every "+e.repeat.interval+" ":""}${e.repeat.type}"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg></span>`:""}
          </div>
        </div>
      </div>
    `;const u=`
    <div class="task-item group relative ${f&&y.length?"has-meta":"no-meta"}${e.isNote?" is-note":""}"
      draggable="${p||a?"false":"true"}"
      ${p||a?"":`ondragstart="window.handleDragStart(event, '${e.id}')"
      ondragend="window.handleDragEnd(event)"
      ondragover="window.handleDragOver(event, '${e.id}')"
      ondragleave="window.handleDragLeave(event)"
      ondrop="window.handleDrop(event, '${e.id}')"`}
      onclick="if(window.isTouchDevice && window.isTouchDevice() && !event.target.closest('.task-inline-title') && !event.target.closest('.task-checkbox') && !event.target.closest('button') && !event.target.closest('.swipe-action-btn')) { window.editingTaskId='${e.id}'; window.showTaskModal=true; window.render(); }">
      <div class="task-row flex items-start gap-3 px-4 py-2.5" style="${m>0?`padding-left: ${16+g}px`:""}">
        ${e.isNote?`
          <div class="mt-2 w-1.5 h-1.5 rounded-full ${m>0?"bg-[var(--notes-accent)]/50":"bg-[var(--notes-accent)]"} flex-shrink-0"></div>
        `:`
          <button onclick="event.stopPropagation(); window.toggleTaskComplete('${e.id}')"
            aria-label="${e.completed?"Mark task as incomplete":"Mark task as complete"}: ${A(e.title)}"
            class="task-checkbox mt-0.5 w-[18px] h-[18px] rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center transition-all ${e.completed?"completed bg-[var(--accent)] border-[var(--accent)] text-white":"border-[var(--text-muted)] hover:border-[var(--accent)]"}">
            ${e.completed?'<svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>':""}
          </button>
        `}
        <div class="flex-1 min-w-0">
          <div class="flex items-start gap-1">
            ${e.flagged?`<span class="inline-flex items-center mt-0.5 flex-shrink-0" style="color: var(--flagged-color)">${ve().flagged.replace("w-5 h-5","w-3 h-3")}</span>`:""}
            <div contenteditable="${e.completed?"false":"true"}"
              class="task-inline-title flex-1 text-[15px] ${e.completed?"line-through text-[var(--text-muted)]":"text-[var(--text-primary)]"} leading-snug outline-none"
              data-task-id="${e.id}"
              data-placeholder="Task title..."
              onfocus="event.stopPropagation(); window.handleTaskInlineFocus(event, '${e.id}')"
              onblur="window.handleTaskInlineBlur(event, '${e.id}')"
              onkeydown="window.handleTaskInlineKeydown(event, '${e.id}')"
              oninput="window.handleTaskInlineInput(event, '${e.id}')"
              onpaste="window.handleTaskInlinePaste(event)"
            >${A(e.title)}</div>
          </div>
          ${f&&y.length?`
            <div class="task-meta-inline">${y.join(" • ")}</div>
          `:""}
        </div>
        <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--modal-bg)]/95 backdrop-blur-sm rounded-lg px-1.5 py-1 shadow-sm" onclick="event.stopPropagation()">
          ${e.isNote&&!e.completed?`
            <button onclick="event.stopPropagation(); window.createChildNote('${e.id}')"
              class="p-1 text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-md transition" title="Add child note">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>
            <button onclick="event.stopPropagation(); window.outdentNote('${e.id}')"
              class="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-md transition ${m===0?"opacity-30 cursor-not-allowed":""}" title="Outdent (Shift+Tab)">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="4" x2="21" y2="4"/><line x1="3" y1="20" x2="21" y2="20"/><line x1="11" y1="8" x2="21" y2="8"/><line x1="11" y1="12" x2="21" y2="12"/><line x1="11" y1="16" x2="21" y2="16"/><polyline points="7 8 3 12 7 16"/></svg>
            </button>
            <button onclick="event.stopPropagation(); window.indentNote('${e.id}')"
              class="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-md transition" title="Indent (Tab)">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="4" x2="21" y2="4"/><line x1="3" y1="20" x2="21" y2="20"/><line x1="11" y1="8" x2="21" y2="8"/><line x1="11" y1="12" x2="21" y2="12"/><line x1="11" y1="16" x2="21" y2="16"/><polyline points="3 8 7 12 3 16"/></svg>
            </button>
          `:""}
          <button onclick="event.stopPropagation(); window.toggleNoteTask('${e.id}')"
            class="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-md transition"
            title="${e.isNote?"Convert to task":"Convert to note"}"
            aria-label="${e.isNote?"Convert to task":"Convert to note"}">
            ${e.isNote?'<svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="5.5"/></svg>':'<svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="4"/></svg>'}
          </button>
          <button onclick="event.stopPropagation(); window.inlineEditingTaskId=null; window.editingTaskId='${e.id}'; window.showTaskModal=true; window.render()"
            aria-label="Edit task: ${A(e.title)}"
            class="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-md transition" title="Edit">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button onclick="event.stopPropagation(); window.confirmDeleteTask('${e.id}')"
            aria-label="Delete task: ${A(e.title)}"
            class="p-1 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_6%,transparent)] rounded-md transition" title="Delete">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  `;return a&&!e.isNote?`
      <div class="swipe-row" data-task-id="${e.id}">
        <div class="swipe-actions-left">
          <button class="swipe-action-btn swipe-action-complete" onclick="event.stopPropagation(); window.toggleTaskComplete('${e.id}')">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>${e.completed?"Undo":"Done"}</span>
          </button>
        </div>
        <div class="swipe-row-content">${u}</div>
        <div class="swipe-actions-right">
          <button class="swipe-action-btn swipe-action-edit" onclick="event.stopPropagation(); window.editingTaskId='${e.id}'; window.showTaskModal=true; window.render()">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <span>Edit</span>
          </button>
          <button class="swipe-action-btn swipe-action-flag" onclick="event.stopPropagation(); window.toggleFlag('${e.id}')">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="${e.flagged?"currentColor":"none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
            <span>${e.flagged?"Unflag":"Flag"}</span>
          </button>
          <button class="swipe-action-btn swipe-action-delete" onclick="event.stopPropagation(); window.confirmDeleteTask('${e.id}')">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            <span>Delete</span>
          </button>
        </div>
      </div>
    `:u}function Kp(e,t,n){if(!e)return"";const a=t,s=a.length,o=r.tasksData.filter(u=>u.areaId===r.activeAreaFilter&&u.completed&&!u.isNote).length,i=a.filter(u=>!u.isNote).length,l=a.filter(u=>u.isNote),d=a.filter(u=>!u.isNote),c=r.workspaceContentMode!=="notes",h=r.workspaceContentMode!=="tasks",v=d.filter(u=>u.dueDate&&u.dueDate<n).length,f=d.filter(u=>!(u.dueDate&&u.dueDate<n)&&(u.today||u.dueDate===n)).length,p=`areaId: '${e.id}'`,m=`t.areaId === '${e.id}'`,g=i+o>0?Math.round(o/(i+o)*100):0,y=oe(e.color,"var(--accent)");return`
    <div class="flex-1 space-y-4">
      <!-- Area Hero Header -->
      <div class="area-hero bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl" style="background: color-mix(in srgb, ${y} 12%, transparent); color: ${y}">
              ${e.emoji||'<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>'}
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight">${A(e.name)}</h1>
              <p class="text-[var(--text-muted)] text-[13px] mt-1">${i} active · ${o} completed${l.length>0?` · ${l.length} note${l.length!==1?"s":""}`:""}</p>
            </div>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="px-6 py-3.5 border-t border-[var(--border-light)] bg-[var(--bg-secondary)]/40 flex items-center gap-5">
          <div class="flex items-center gap-3">
            <div class="relative w-10 h-10">
              <svg class="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" stroke-width="2.5"/>
                <circle cx="18" cy="18" r="15" fill="none" stroke="${y}" stroke-width="2.5"
                  stroke-dasharray="${g} 100" stroke-linecap="round"/>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[var(--text-primary)]">${g}%</span>
            </div>
            <div>
              <div class="text-[13px] font-medium text-[var(--text-primary)]">Progress</div>
              <div class="text-[11px] text-[var(--text-muted)]">${o} of ${i+o}</div>
            </div>
          </div>
          ${v>0?`
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--overdue-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--overdue-color)"></span>
              ${v} overdue
            </div>
          `:""}
          ${f>0?`
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--today-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--today-color)"></span>
              ${f} today
            </div>
          `:""}
          <div class="flex-1"></div>
          <div class="flex items-center gap-2">
            <button onclick="window.createRootNote('${e.id}')"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] transition">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Note
            </button>
            <button onclick="window.openNewTaskModal()"
              class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-[13px] font-medium hover:opacity-90 transition" style="background: ${y}">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Add Task
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Add -->
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] px-4 py-3">
        <div class="flex items-center gap-3">
          <div onclick="state.quickAddIsNote = !state.quickAddIsNote; render()"
            class="quick-add-type-toggle" title="${r.quickAddIsNote?"Switch to Task":"Switch to Note"}">
            ${r.quickAddIsNote?'<div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-color)]"></div>':`<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed flex-shrink-0" style="border-color: color-mix(in srgb, ${y} 25%, transparent)"></div>`}
          </div>
          <input type="text" id="quick-add-input"
            placeholder="${r.quickAddIsNote?"New Note":"New To-Do"}"
            onkeydown="window.handleQuickAddKeydown(event, this)"
            class="flex-1 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-transparent border-0 outline-none focus:ring-0">
          <button onclick="window.quickAddTask(document.getElementById('quick-add-input'))"
            class="text-[var(--text-muted)] hover:opacity-70 transition p-1" style="color: ${y}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <button onclick="window.createTask('', { status: 'anytime', areaId: '${e.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && t.areaId === '${e.id}' && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-anytime">+ Task</button>
          <button onclick="window.createTask('', { status: 'anytime', areaId: '${e.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && t.areaId === '${e.id}' && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-anytime">+ Anytime</button>
          <button onclick="window.createTask('', { status: 'someday', areaId: '${e.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && t.areaId === '${e.id}' && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-someday">+ Someday</button>
          <button onclick="window.createTask('', { status: 'anytime', today: true, areaId: '${e.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && t.areaId === '${e.id}' && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-today">+ Today</button>
          <button onclick="window.createRootNote('${e.id}')"
            class="area-chip area-chip-action area-chip-note">+ Note</button>
        </div>
      </div>

      <!-- Categories -->
      ${(()=>{const u=Jr(e.id);return`
        <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
          <div class="px-4 py-3 ${u.length>0?"border-b border-[var(--border-light)]":""} flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 24 24"><path d="M2 6a2 2 0 012-2h5.586a1 1 0 01.707.293L12 6h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/><path d="M2 8h20v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" opacity="0.85"/></svg>
              <span class="text-sm font-semibold text-[var(--text-primary)]">Categories</span>
              ${u.length>0?`<span class="text-xs text-[var(--text-muted)] ml-1">${u.length}</span>`:""}
            </div>
            <button onclick="event.stopPropagation(); window.editingAreaId='${e.id}'; window.showAreaModal=true; window.render()"
              class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit
            </button>
          </div>
          ${u.length>0?`
          <div class="divide-y divide-[var(--border-light)]">
            ${u.map(x=>{const k=r.tasksData.filter(D=>D.categoryId===x.id&&!D.completed&&!D.isNote).length,E=oe(x.color,y);return`
              <button onclick="window.showCategoryTasks('${x.id}')"
                class="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-[var(--bg-secondary)] transition group">
                <span class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm" style="background: color-mix(in srgb, ${E} 12%, transparent); color: ${E}">
                  ${x.emoji||'<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V5a2 2 0 012-2h4.586a1 1 0 01.707.293L12 5h7a2 2 0 012 2v2"/><rect x="2" y="9" width="20" height="12" rx="2"/></svg>'}
                </span>
                <span class="flex-1 text-[14px] text-[var(--text-primary)] truncate">${A(x.name)}</span>
                <span class="text-xs text-[var(--text-muted)]">${k||""}</span>
                <svg class="w-4 h-4 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
              </button>`}).join("")}
          </div>`:""}
          <div class="px-4 py-2 ${u.length>0?"border-t border-[var(--border-light)]":""}">
            <button onclick="event.stopPropagation(); window.editingCategoryId=null; window.showCategoryModal=true; window.modalSelectedArea='${e.id}'; window.render()"
              class="flex items-center gap-2 px-3 py-2 w-full text-sm text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-lg transition text-left">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Add Category
            </button>
          </div>
        </div>`})()}

      <!-- Task Sections -->
      <div class="space-y-4">
        ${c?wo(d,n,y,p,m):""}
        ${h?xo(l,`'${e.id}'`,e.id):""}
        ${qp(r.triggers.filter(u=>u.areaId===e.id&&!u.categoryId),`{areaId:'${e.id}'}`,{areaId:e.id})}

        ${s===0?`
          <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] py-16">
            <div class="flex flex-col items-center justify-center text-[var(--text-muted)]">
              <div class="w-20 h-20 rounded-lg flex items-center justify-center mb-4" style="background: color-mix(in srgb, ${y} 6%, transparent)">
                <svg class="w-10 h-10" style="color: ${y}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              </div>
              <p class="text-lg font-medium text-[var(--text-muted)] mb-1">No items yet</p>
              <p class="text-sm text-[var(--text-muted)] mb-4">Add your first task or note to ${A(e.name)}</p>
              <button onclick="window.openNewTaskModal()"
                class="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition" style="background: ${y}">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                Add First Item
              </button>
            </div>
          </div>
        `:""}
      </div>
    </div>
  `}function Hk(e,t,n){if(!e)return"";const a=et(e.areaId),s=t,o=r.tasksData.filter(u=>u.categoryId===e.id&&u.completed&&!u.isNote).length,i=s.filter(u=>!u.isNote).length,l=s.filter(u=>u.isNote),d=s.filter(u=>!u.isNote),c=r.workspaceContentMode!=="notes",h=r.workspaceContentMode!=="tasks",v=d.filter(u=>u.dueDate&&u.dueDate<n).length,f=d.filter(u=>!(u.dueDate&&u.dueDate<n)&&(u.today||u.dueDate===n)).length,p=i+o>0?Math.round(o/(i+o)*100):0,m=oe(e.color,"var(--accent)"),g=`areaId: '${e.areaId}', categoryId: '${e.id}'`,y=`t.categoryId === '${e.id}'`;return`
    <div class="flex-1 space-y-4">
      <!-- Category Hero Header -->
      <div class="area-hero bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl" style="background: color-mix(in srgb, ${m} 12%, transparent); color: ${m}">
              ${e.emoji||'<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V5a2 2 0 012-2h4.586a1 1 0 01.707.293L12 5h7a2 2 0 012 2v2"/><rect x="2" y="9" width="20" height="12" rx="2"/></svg>'}
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight">${A(e.name)}</h1>
              <div class="flex items-center gap-2 mt-1">
                ${a?`
                  <button onclick="window.showAreaTasks('${a.id}')" class="inline-flex items-center gap-1.5 text-[13px] text-[var(--text-muted)] hover:text-[var(--accent)] transition">
                    <span class="w-2 h-2 rounded-full" style="background:${oe(a.color,"var(--accent)")}"></span>
                    ${A(a.name)}
                  </button>
                  <span class="text-[var(--text-muted)]">&middot;</span>
                `:""}
                <p class="text-[var(--text-muted)] text-[13px]">${i} active &middot; ${o} completed${l.length>0?` &middot; ${l.length} note${l.length!==1?"s":""}`:""}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="px-6 py-3.5 border-t border-[var(--border-light)] bg-[var(--bg-secondary)]/40 flex items-center gap-5">
          <div class="flex items-center gap-3">
            <div class="relative w-10 h-10">
              <svg class="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" stroke-width="2.5"/>
                <circle cx="18" cy="18" r="15" fill="none" stroke="${m}" stroke-width="2.5"
                  stroke-dasharray="${p} 100" stroke-linecap="round"/>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[var(--text-primary)]">${p}%</span>
            </div>
            <div>
              <div class="text-[13px] font-medium text-[var(--text-primary)]">Progress</div>
              <div class="text-[11px] text-[var(--text-muted)]">${o} of ${i+o}</div>
            </div>
          </div>
          ${v>0?`
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--overdue-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--overdue-color)"></span>
              ${v} overdue
            </div>
          `:""}
          ${f>0?`
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--today-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--today-color)"></span>
              ${f} today
            </div>
          `:""}
          <div class="flex-1"></div>
          <div class="flex items-center gap-2">
            <button onclick="window.createRootNote({areaId:'${e.areaId}',categoryId:'${e.id}'})"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] transition">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Note
            </button>
            <button onclick="window.openNewTaskModal()"
              class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-[13px] font-medium hover:opacity-90 transition" style="background: ${m}">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Add Task
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Add -->
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] px-4 py-3">
        <div class="flex items-center gap-3">
          <div onclick="state.quickAddIsNote = !state.quickAddIsNote; render()"
            class="quick-add-type-toggle" title="${r.quickAddIsNote?"Switch to Task":"Switch to Note"}">
            ${r.quickAddIsNote?'<div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-color)]"></div>':`<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed flex-shrink-0" style="border-color: color-mix(in srgb, ${m} 25%, transparent)"></div>`}
          </div>
          <input type="text" id="quick-add-input"
            placeholder="${r.quickAddIsNote?"New Note":"New To-Do"}"
            onkeydown="window.handleQuickAddKeydown(event, this)"
            class="flex-1 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-transparent border-0 outline-none focus:ring-0">
          <button onclick="window.quickAddTask(document.getElementById('quick-add-input'))"
            class="text-[var(--text-muted)] hover:opacity-70 transition p-1" style="color: ${m}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <button onclick="window.createTask('', { status: 'anytime', areaId: '${e.areaId}', categoryId: '${e.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && t.categoryId === '${e.id}' && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-anytime">+ Task</button>
          <button onclick="window.createTask('', { status: 'anytime', areaId: '${e.areaId}', categoryId: '${e.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && t.categoryId === '${e.id}' && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-anytime">+ Anytime</button>
          <button onclick="window.createTask('', { status: 'someday', areaId: '${e.areaId}', categoryId: '${e.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && t.categoryId === '${e.id}' && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-someday">+ Someday</button>
          <button onclick="window.createTask('', { status: 'anytime', today: true, areaId: '${e.areaId}', categoryId: '${e.id}' }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && t.categoryId === '${e.id}' && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-today">+ Today</button>
          <button onclick="window.createRootNote({areaId:'${e.areaId}',categoryId:'${e.id}'})"
            class="area-chip area-chip-action area-chip-note">+ Note</button>
        </div>
      </div>

      <!-- Task Sections -->
      <div class="space-y-4">
        ${c?wo(d,n,m,g,y):""}
        ${h?xo(l,`{areaId:'${e.areaId}',categoryId:'${e.id}'}`,{categoryId:e.id}):""}
        ${qp(r.triggers.filter(u=>u.areaId===e.areaId&&u.categoryId===e.id),`{areaId:'${e.areaId}',categoryId:'${e.id}'}`,{areaId:e.areaId,categoryId:e.id})}

        ${t.length===0?`
          <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
            <div class="empty-state flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
              <svg class="w-16 h-16 mb-4 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
              <p class="text-[15px] font-medium">No tasks in ${A(e.name)}</p>
              <p class="text-[13px] mt-1">Add a task to get started</p>
            </div>
          </div>
        `:""}
      </div>
    </div>
  `}function zk(e,t,n){if(!e)return"";const a=r.tasksData.filter(u=>(u.labels||[]).includes(e.id)&&u.completed&&!u.isNote).length,s=t.filter(u=>!u.isNote),o=t.filter(u=>u.isNote),i=r.workspaceContentMode!=="notes",l=r.workspaceContentMode!=="tasks",d=s.length,c=oe(e.color,"var(--notes-color)"),h=s.filter(u=>u.dueDate&&u.dueDate<n).length,v=s.filter(u=>u.today||u.dueDate===n).length,f=d+a>0?Math.round(a/(d+a)*100):0,p=`labels: ['${e.id}']`,m=`(t.labels||[]).includes('${e.id}')`,g=`{labelId:'${e.id}'}`,y={labelId:e.id};return`
    <div class="flex-1 space-y-4">
      <!-- Label Hero Header -->
      <div class="area-hero bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style="background: color-mix(in srgb, ${c} 12%, transparent)">
              <span class="w-5 h-5 rounded-full" style="background: ${c}"></span>
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight">${A(e.name)}</h1>
              <p class="text-[var(--text-muted)] text-[13px] mt-1">${d} active &middot; ${a} completed${o.length>0?` &middot; ${o.length} note${o.length!==1?"s":""}`:""}</p>
            </div>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="px-6 py-3.5 border-t border-[var(--border-light)] bg-[var(--bg-secondary)]/40 flex items-center gap-5">
          <div class="flex items-center gap-3">
            <div class="relative w-10 h-10">
              <svg class="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" stroke-width="2.5"/>
                <circle cx="18" cy="18" r="15" fill="none" stroke="${c}" stroke-width="2.5"
                  stroke-dasharray="${f} 100" stroke-linecap="round"/>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[var(--text-primary)]">${f}%</span>
            </div>
            <div>
              <div class="text-[13px] font-medium text-[var(--text-primary)]">Progress</div>
              <div class="text-[11px] text-[var(--text-muted)]">${a} of ${d+a}</div>
            </div>
          </div>
          ${h>0?`
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--overdue-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--overdue-color)"></span>
              ${h} overdue
            </div>
          `:""}
          ${v>0?`
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--today-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--today-color)"></span>
              ${v} today
            </div>
          `:""}
          <div class="flex-1"></div>
          <div class="flex items-center gap-2">
            <button onclick="window.createRootNote(${g})"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] transition">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Note
            </button>
            <button onclick="window.openNewTaskModal()"
              class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-[13px] font-medium hover:opacity-90 transition" style="background: ${c}">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Add Task
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Add -->
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] px-4 py-3">
        <div class="flex items-center gap-3">
          <div onclick="state.quickAddIsNote = !state.quickAddIsNote; render()"
            class="quick-add-type-toggle" title="${r.quickAddIsNote?"Switch to Task":"Switch to Note"}">
            ${r.quickAddIsNote?'<div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-color)]"></div>':`<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed flex-shrink-0" style="border-color: color-mix(in srgb, ${c} 25%, transparent)"></div>`}
          </div>
          <input type="text" id="quick-add-input"
            placeholder="${r.quickAddIsNote?"New Note":"New To-Do"}"
            onkeydown="window.handleQuickAddKeydown(event, this)"
            class="flex-1 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-transparent border-0 outline-none focus:ring-0">
          <button onclick="window.quickAddTask(document.getElementById('quick-add-input'))"
            class="text-[var(--text-muted)] hover:opacity-70 transition p-1" style="color: ${c}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <button onclick="window.createTask('', { status: 'anytime', labels: ['${e.id}'] }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && (t.labels||[]).includes('${e.id}') && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-anytime">+ Task</button>
          <button onclick="window.createTask('', { status: 'anytime', labels: ['${e.id}'] }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && (t.labels||[]).includes('${e.id}') && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-anytime">+ Anytime</button>
          <button onclick="window.createTask('', { status: 'someday', labels: ['${e.id}'] }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && (t.labels||[]).includes('${e.id}') && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-someday">+ Someday</button>
          <button onclick="window.createTask('', { status: 'anytime', today: true, labels: ['${e.id}'] }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && (t.labels||[]).includes('${e.id}') && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-today">+ Today</button>
          <button onclick="window.createRootNote(${g})"
            class="area-chip area-chip-action area-chip-note">+ Note</button>
        </div>
      </div>

      <!-- Task Sections -->
      <div class="space-y-4">
        ${i?wo(s,n,c,p,m):""}
        ${l?xo(o,g,y):""}

        ${t.length===0?`
          <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] py-16">
            <div class="flex flex-col items-center justify-center text-[var(--text-muted)]">
              <div class="w-20 h-20 rounded-lg flex items-center justify-center mb-4" style="background: color-mix(in srgb, ${c} 6%, transparent)">
                <span class="w-10 h-10 rounded-full" style="background: ${c}"></span>
              </div>
              <p class="text-lg font-medium text-[var(--text-muted)] mb-1">No items yet</p>
              <p class="text-sm text-[var(--text-muted)] mb-4">Add your first task or note to ${A(e.name)}</p>
              <button onclick="window.openNewTaskModal()"
                class="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition" style="background: ${c}">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                Add First Item
              </button>
            </div>
          </div>
        `:""}
      </div>
    </div>
  `}function Wk(e,t,n){if(!e)return"";const a=r.tasksData.filter(u=>(u.people||[]).includes(e.id)&&u.completed&&!u.isNote).length,s=t.filter(u=>!u.isNote),o=t.filter(u=>u.isNote),i=r.workspaceContentMode!=="notes",l=r.workspaceContentMode!=="tasks",d=s.length,c="var(--accent)",h=s.filter(u=>u.dueDate&&u.dueDate<n).length,v=s.filter(u=>u.today||u.dueDate===n).length,f=d+a>0?Math.round(a/(d+a)*100):0,p=`people: ['${e.id}']`,m=`(t.people||[]).includes('${e.id}')`,g=`{personId:'${e.id}'}`,y={personId:e.id};return`
    <div class="flex-1 space-y-4">
      <!-- Person Hero Header -->
      <div class="area-hero bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            ${e.photoData?`<img src="${e.photoData}" alt="" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" referrerpolicy="no-referrer">`:`<div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl" style="background: color-mix(in srgb, ${c} 12%, transparent); color: ${c}">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>`}
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight">${A(e.name)}</h1>
              ${e.jobTitle||e.email?`
                <p class="text-[var(--text-muted)] text-[13px] mt-1">${[e.jobTitle,e.email].filter(Boolean).map(u=>A(u)).join(" &middot; ")}</p>
              `:""}
              <p class="text-[var(--text-muted)] text-[13px] ${e.jobTitle||e.email?"":"mt-1"}">${d} active &middot; ${a} completed${o.length>0?` &middot; ${o.length} note${o.length!==1?"s":""}`:""}</p>
            </div>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="px-6 py-3.5 border-t border-[var(--border-light)] bg-[var(--bg-secondary)]/40 flex items-center gap-5">
          <div class="flex items-center gap-3">
            <div class="relative w-10 h-10">
              <svg class="w-10 h-10 transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="var(--border)" stroke-width="2.5"/>
                <circle cx="18" cy="18" r="15" fill="none" stroke="${c}" stroke-width="2.5"
                  stroke-dasharray="${f} 100" stroke-linecap="round"/>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[var(--text-primary)]">${f}%</span>
            </div>
            <div>
              <div class="text-[13px] font-medium text-[var(--text-primary)]">Progress</div>
              <div class="text-[11px] text-[var(--text-muted)]">${a} of ${d+a}</div>
            </div>
          </div>
          ${h>0?`
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--overdue-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--overdue-color)"></span>
              ${h} overdue
            </div>
          `:""}
          ${v>0?`
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--today-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--today-color)"></span>
              ${v} today
            </div>
          `:""}
          <div class="flex-1"></div>
          <div class="flex items-center gap-2">
            <button onclick="window.createRootNote(${g})"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] transition">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Note
            </button>
            <button onclick="window.openNewTaskModal()"
              class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-[13px] font-medium hover:opacity-90 transition" style="background: ${c}">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Add Task
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Add -->
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] px-4 py-3">
        <div class="flex items-center gap-3">
          <div onclick="state.quickAddIsNote = !state.quickAddIsNote; render()"
            class="quick-add-type-toggle" title="${r.quickAddIsNote?"Switch to Task":"Switch to Note"}">
            ${r.quickAddIsNote?'<div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-color)]"></div>':`<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed flex-shrink-0" style="border-color: color-mix(in srgb, ${c} 25%, transparent)"></div>`}
          </div>
          <input type="text" id="quick-add-input"
            placeholder="${r.quickAddIsNote?"New Note":"New To-Do"}"
            onkeydown="window.handleQuickAddKeydown(event, this)"
            class="flex-1 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-transparent border-0 outline-none focus:ring-0">
          <button onclick="window.quickAddTask(document.getElementById('quick-add-input'))"
            class="text-[var(--text-muted)] hover:opacity-70 transition p-1" style="color: ${c}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <button onclick="window.createTask('', { status: 'anytime', people: ['${e.id}'] }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && (t.people||[]).includes('${e.id}') && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-anytime">+ Task</button>
          <button onclick="window.createTask('', { status: 'anytime', people: ['${e.id}'] }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && (t.people||[]).includes('${e.id}') && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-anytime">+ Anytime</button>
          <button onclick="window.createTask('', { status: 'someday', people: ['${e.id}'] }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && (t.people||[]).includes('${e.id}') && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-someday">+ Someday</button>
          <button onclick="window.createTask('', { status: 'anytime', today: true, people: ['${e.id}'] }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && (t.people||[]).includes('${e.id}') && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
            class="area-chip area-chip-action area-chip-today">+ Today</button>
          <button onclick="window.createRootNote(${g})"
            class="area-chip area-chip-action area-chip-note">+ Note</button>
        </div>
      </div>

      <!-- Task Sections -->
      <div class="space-y-4">
        ${i?wo(s,n,c,p,m):""}
        ${l?xo(o,g,y):""}

        ${t.length===0?`
          <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] py-16">
            <div class="flex flex-col items-center justify-center text-[var(--text-muted)]">
              <div class="w-20 h-20 rounded-lg flex items-center justify-center mb-4" style="background: color-mix(in srgb, ${c} 6%, transparent)">
                <svg class="w-10 h-10" style="color: ${c}" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <p class="text-lg font-medium text-[var(--text-muted)] mb-1">No items yet</p>
              <p class="text-sm text-[var(--text-muted)] mb-4">Add your first task or note for ${A(e.name)}</p>
              <button onclick="window.openNewTaskModal()"
                class="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition" style="background: ${c}">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                Add First Item
              </button>
            </div>
          </div>
        `:""}
      </div>
    </div>
  `}function Uk(){ve();const e=r.tasksData.filter(n=>!n.completed&&!n.isNote),t=[...r.taskLabels].sort((n,a)=>{const s=e.filter(i=>(i.labels||[]).includes(n.id)).length;return e.filter(i=>(i.labels||[]).includes(a.id)).length-s||n.name.localeCompare(a.name)});return`
    <div class="flex-1 space-y-4">
      <div class="bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-[var(--bg-secondary)] text-[var(--text-muted)]">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight">All Tags</h1>
              <p class="text-[var(--text-muted)] text-[13px] mt-1">${t.length} tag${t.length!==1?"s":""}</p>
            </div>
            <button onclick="window.editingLabelId=null; window.showLabelModal=true; window.render()"
              class="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:bg-[var(--accent-dark)] transition shadow-sm" title="Add Tag">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        ${t.length===0?`
          <div class="col-span-full py-12 text-center text-[var(--text-muted)]">
            <p class="text-sm font-medium mb-1">No tags yet</p>
            <p class="text-xs opacity-60">Create your first tag to organize tasks</p>
          </div>
        `:t.map(n=>{const a=e.filter(o=>(o.labels||[]).includes(n.id)).length,s=n.color||"var(--notes-color)";return`
            <button onclick="showLabelTasks('${n.id}')"
              class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] p-4 text-left hover:border-[var(--border)] hover:shadow-sm transition group">
              <div class="flex items-center gap-3 mb-2">
                <span class="w-4 h-4 rounded-full flex-shrink-0" style="background: ${s}"></span>
                <span class="font-medium text-[var(--text-primary)] text-[14px] truncate">${A(n.name)}</span>
              </div>
              <p class="text-xs text-[var(--text-muted)]">${a} active task${a!==1?"s":""}</p>
            </button>`}).join("")}
      </div>
    </div>`}function Gk(){ve();const e=r.tasksData.filter(n=>!n.completed&&!n.isNote),t=[...r.taskPeople].sort((n,a)=>{const s=e.filter(i=>(i.people||[]).includes(n.id)).length;return e.filter(i=>(i.people||[]).includes(a.id)).length-s||n.name.localeCompare(a.name)});return`
    <div class="flex-1 space-y-4">
      <div class="bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-[var(--bg-secondary)] text-[var(--text-muted)]">
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight">All People</h1>
              <p class="text-[var(--text-muted)] text-[13px] mt-1">${t.length} ${t.length!==1?"people":"person"}</p>
            </div>
            <button onclick="window.editingPersonId=null; window.showPersonModal=true; window.render()"
              class="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:bg-[var(--accent-dark)] transition shadow-sm" title="Add Person">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        ${t.length===0?`
          <div class="col-span-full py-12 text-center text-[var(--text-muted)]">
            <p class="text-sm font-medium mb-1">No people yet</p>
            <p class="text-xs opacity-60">Add people to track delegated tasks</p>
          </div>
        `:t.map(n=>{const a=e.filter(s=>(s.people||[]).includes(n.id)).length;return`
            <button onclick="showPersonTasks('${n.id}')"
              class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] p-4 text-left hover:border-[var(--border)] hover:shadow-sm transition group">
              <div class="flex items-center gap-3 mb-2">
                ${Vr(n,32)}
                <div class="min-w-0">
                  <span class="block font-medium text-[var(--text-primary)] text-[14px] truncate">${A(n.name)}</span>
                  ${n.jobTitle?`<span class="block text-[11px] text-[var(--text-muted)] truncate">${A(n.jobTitle)}</span>`:""}
                </div>
              </div>
              <p class="text-xs text-[var(--text-muted)]">${a} active task${a!==1?"s":""}</p>
            </button>`}).join("")}
      </div>
    </div>`}function Vk(e,t,n){if(!e)return"";const a=t.length,s=oe(e.color,"var(--accent)");return`
    <div class="flex-1 space-y-4">
      <!-- Perspective Hero Header -->
      <div class="area-hero bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl" style="background: color-mix(in srgb, ${s} 12%, transparent); color: ${s}">
              ${e.icon||"📌"}
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight">${A(e.name)}</h1>
              <p class="text-[var(--text-muted)] text-[13px] mt-1">${a} item${a!==1?"s":""}</p>
            </div>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="px-6 py-3.5 border-t border-[var(--border-light)] bg-[var(--bg-secondary)]/40 flex items-center justify-end gap-2">
          <button onclick="window.openNewTaskModal()"
            class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-[13px] font-medium hover:opacity-90 transition" style="background: ${s}">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Add Task
          </button>
        </div>
      </div>

      <!-- Quick Add -->
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] px-4 py-3">
        <div class="flex items-center gap-3">
          <div onclick="state.quickAddIsNote = !state.quickAddIsNote; render()"
            class="quick-add-type-toggle" title="${r.quickAddIsNote?"Switch to Task":"Switch to Note"}">
            ${r.quickAddIsNote?'<div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-color)]"></div>':`<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed flex-shrink-0" style="border-color: color-mix(in srgb, ${s} 25%, transparent)"></div>`}
          </div>
          <input type="text" id="quick-add-input"
            placeholder="${r.quickAddIsNote?"New Note":"New To-Do"}"
            onkeydown="window.handleQuickAddKeydown(event, this)"
            class="flex-1 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-transparent border-0 outline-none focus:ring-0">
          <button onclick="window.quickAddTask(document.getElementById('quick-add-input'))"
            class="text-[var(--text-muted)] hover:opacity-70 transition p-1" style="color: ${s}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </button>
        </div>
      </div>

      <!-- Task List -->
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
        ${t.length>0?`
          <div class="task-list">${t.map(o=>Oe(o)).join("")}</div>
        `:`
          <div class="py-16">
            <div class="flex flex-col items-center justify-center text-[var(--text-muted)]">
              <div class="w-20 h-20 rounded-lg flex items-center justify-center mb-4" style="background: color-mix(in srgb, ${s} 6%, transparent); color: ${s}">
                <span class="text-4xl">${e.icon||"📌"}</span>
              </div>
              <p class="text-lg font-medium text-[var(--text-muted)] mb-1">No tasks</p>
              <p class="text-sm text-[var(--text-muted)] mb-4">No tasks match this perspective's filters</p>
              <button onclick="window.openNewTaskModal()"
                class="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium shadow-sm hover:opacity-90 transition" style="background: ${s}">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                Add Task
              </button>
            </div>
          </div>
        `}
      </div>
    </div>
  `}function qk(){r.activePerspective==="calendar"&&(r.activePerspective="inbox",Ge()),[...Ue,...r.customPerspectives];const e=Pk(),t=Nk(),n=r.activeAreaFilter?et(r.activeAreaFilter):null,a={},s=he();Ue.forEach(C=>{C.id==="today"?a[C.id]=Ko("today").length:a[C.id]=Ko(C.id).length}),a.notes=r.tasksData.filter(C=>C.isNote&&!C.completed).length,r.customPerspectives.forEach(C=>{a[C.id]=Ko(C.id).length});const o=7,i=new Date;i.setDate(i.getDate()-o);const l=r.tasksData.filter(C=>C.completed||C.isNote||C.status==="someday"||!C.areaId?!1:C.lastReviewedAt?new Date(C.lastReviewedAt)<i:!0).length,d={};r.taskAreas.forEach(C=>{d[C.id]=Rk(C.id).length});const c={};r.taskLabels.forEach(C=>{c[C.id]=Bk(C.id).length});const h={};r.taskPeople.forEach(C=>{h[C.id]=il(C.id).length});const v=C=>r.activeFilterType==="perspective"&&r.activePerspective===C,f=C=>r.activeFilterType==="area"&&r.activeAreaFilter===C,p=C=>r.activeFilterType==="subcategory"&&r.activeCategoryFilter===C,m=C=>r.activeFilterType==="label"&&r.activeLabelFilter===C,g=C=>r.activeFilterType==="person"&&r.activePersonFilter===C,y=r.activeFilterType==="perspective"&&r.activePerspective==="notes"?"notes":r.workspaceContentMode||"both",u=r.activePerspective==="notes"||y==="notes",x=!!r.workspaceSidebarCollapsed,k=`
      <div class="workspace-mode-control" role="group" aria-label="Workspace content mode">
        ${[{id:"tasks",label:"Tasks"},{id:"both",label:"Both"},{id:"notes",label:"Notes"}].map(Z=>{const G=r.activeFilterType==="perspective"&&r.activePerspective==="notes"&&Z.id!=="notes",J=y===Z.id,P=G?"":`window.state.workspaceContentMode='${Z.id}'; window.saveViewState(); window.render();`;return`
            <button
              type="button"
              ${G?"disabled":""}
              onclick="${P}"
              class="workspace-mode-btn ${J?"active":""}"
              title="${G?"All Notes view is locked to Notes mode":`Show ${Z.label.toLowerCase()} only`}">
              ${Z.label}
            </button>
          `}).join("")}
      </div>
    `,E=r.activeFilterType==="area"?r.activeAreaFilter:r.activeFilterType==="subcategory"?rt(r.activeCategoryFilter)?.areaId:null,D=r.activeFilterType==="subcategory"?r.activeCategoryFilter:null;`${k}${Ue.map(C=>`
            <button onclick="window.showPerspectiveTasks('${C.id}')" class="workspace-chip ${v(C.id)?"active":""}">
              <span class="workspace-chip-icon" style="color:${C.color}">${C.icon}</span>
              <span>${C.name}</span>
              <span class="workspace-chip-count">${a[C.id]||""}</span>
            </button>
          `).join("")}`,v("notes"),`${ut.color}${ut.icon}${a.notes||""}${r.customPerspectives.map(C=>`
            <button onclick="window.showPerspectiveTasks('${C.id}')" class="workspace-chip ${v(C.id)?"active":""}">
              <span class="workspace-chip-icon">${C.icon||"📌"}</span>
              <span>${A(C.name)}</span>
              <span class="workspace-chip-count">${a[C.id]||""}</span>
            </button>
          `).join("")}${r.activePerspective||"inbox"}`,`${r.taskAreas.map(C=>`
            <button onclick="window.showAreaTasks('${C.id}')" class="workspace-area-chip ${f(C.id)||E===C.id?"active":""}" style="--area-color:${oe(C.color,"var(--accent)")}">
              <span class="workspace-area-emoji">${C.emoji||'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17l10 5 10-5-10-5-10 5z" opacity="0.35"/><path d="M2 12l10 5 10-5-10-5-10 5z" opacity="0.6"/><path d="M12 2L2 7l10 5 10-5L12 2z"/></svg>'}</span>
              <span class="workspace-area-name">${A(C.name)}</span>
              <span class="workspace-area-count">${d[C.id]||""}</span>
            </button>
          `).join("")}`,E&&(`${E}`,`${A(et(E)?.name||"Area")}${Jr(E).map(C=>`
            <button onclick="window.showCategoryTasks('${C.id}')" class="workspace-chip ${p(C.id)?"active":""}">
              <span class="workspace-chip-icon">${C.emoji||'<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M2 6a2 2 0 012-2h5.586a1 1 0 01.707.293L12 6h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" opacity="0.35"/><rect x="2" y="9" width="20" height="11" rx="2"/></svg>'}</span>
              <span>${A(C.name)}</span>
            </button>
          `).join("")}`),`${r.taskLabels.map(C=>`
                  <button onclick="window.showLabelTasks('${C.id}')" class="workspace-overflow-item ${m(C.id)?"active":""}">
                    <span class="workspace-dot" style="background:${oe(C.color,"var(--text-muted)")}"></span>
                    <span>${A(C.name)}</span>
                    <span class="workspace-chip-count">${c[C.id]||""}</span>
                  </button>
                `).join("")}${r.taskPeople.map(C=>`
                  <button onclick="window.showPersonTasks('${C.id}')" class="workspace-overflow-item ${g(C.id)?"active":""}">
                    <span>👤</span>
                    <span>${A(C.name)}</span>
                    <span class="workspace-chip-count">${h[C.id]||""}</span>
                  </button>
                `).join("")}`;const R=`
    <div class="w-full md:w-64 flex-shrink-0 space-y-3">
      <!-- Tasks Section -->
      <div class="bg-[var(--modal-bg)] rounded-lg border border-[var(--border)]">
        <div class="px-4 py-2.5 border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">Tasks</h3>
        </div>
        <div class="py-2 px-2">
          ${Ue.map(C=>`
            <button onclick="window.showPerspectiveTasks('${C.id}')"
              class="sidebar-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg transition-all ${v(C.id)?"active bg-[var(--accent-light)]":"hover:bg-[var(--bg-secondary)]"}">
              <span class="w-6 h-6 flex items-center justify-center flex-shrink-0" style="color: ${C.color}">${C.icon}</span>
              <span class="flex-1 text-[14px] ${v(C.id)?"font-medium text-[var(--text-primary)]":"text-[var(--text-secondary)]"}">${C.name}</span>
              <span class="count-badge min-w-[20px] text-right text-xs ${v(C.id)?"text-[var(--text-secondary)]":"text-[var(--text-muted)]"}">${a[C.id]||""}</span>
            </button>
          `).join("")}
        </div>
      </div>

      <!-- Notes Section -->
      <div class="bg-[var(--modal-bg)] rounded-lg border border-[var(--border)]">
        <div class="px-4 py-2.5 border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">Notes</h3>
        </div>
        <div class="py-2 px-2">
          <button onclick="window.showPerspectiveTasks('notes')"
            class="sidebar-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg transition-all ${v("notes")?"active bg-[var(--accent-light)]":"hover:bg-[var(--bg-secondary)]"}">
            <span class="w-6 h-6 flex items-center justify-center flex-shrink-0" style="color: ${ut.color}">${ut.icon}</span>
            <span class="flex-1 text-[14px] ${v("notes")?"font-medium text-[var(--text-primary)]":"text-[var(--text-secondary)]"}">All Notes</span>
            <span class="count-badge min-w-[20px] text-right text-xs ${v("notes")?"text-[var(--text-secondary)]":"text-[var(--text-muted)]"}">${a.notes||""}</span>
          </button>
        </div>
      </div>

      <!-- Review -->
      <div class="bg-[var(--modal-bg)] rounded-lg border border-[var(--border)]">
        <div class="py-2 px-2">
          <button onclick="window.startReview()"
            class="sidebar-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg transition-all ${r.reviewMode?"active bg-[var(--accent-light)]":"hover:bg-[var(--bg-secondary)]"}">
            <span class="w-6 h-6 flex items-center justify-center flex-shrink-0" style="color: var(--success)">${ve().review}</span>
            <span class="flex-1 text-[14px] ${r.reviewMode?"font-medium text-[var(--text-primary)]":"text-[var(--text-secondary)]"}">Review</span>
            ${l>0?`<span class="count-badge min-w-[20px] text-right text-xs text-[var(--text-muted)]">${l}</span>`:""}
          </button>
        </div>
      </div>

      <!-- Custom Perspectives -->
      <div class="bg-[var(--modal-bg)] rounded-lg border border-[var(--border)]">
        <div class="px-4 py-2.5 flex items-center justify-between border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">Custom Views</h3>
          <button onclick="window.showPerspectiveModal=true; window.render()" aria-label="Add new custom view" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition p-1.5 -mr-1 rounded-lg hover:bg-[var(--bg-secondary)]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
        <div class="py-2 px-2">
          ${r.customPerspectives.length>0?r.customPerspectives.map(C=>`
            <button onclick="window.showPerspectiveTasks('${C.id}')"
              class="sidebar-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg group relative transition-all ${v(C.id)?"active bg-[var(--accent-light)]":"hover:bg-[var(--bg-secondary)]"}">
              <span class="w-6 h-6 flex items-center justify-center flex-shrink-0 text-lg text-[var(--text-muted)]">${C.icon}</span>
              <span class="flex-1 text-[14px] ${v(C.id)?"font-medium text-[var(--text-primary)]":"text-[var(--text-secondary)]"}">${A(C.name)}</span>
              <span class="min-w-[20px] text-right text-xs group-hover:opacity-0 transition-opacity text-[var(--text-muted)]">${a[C.id]||""}</span>
              <span role="button" tabindex="0" onclick="event.stopPropagation(); window.editCustomPerspective('${C.id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();window.editCustomPerspective('${C.id}');}" aria-label="Edit ${A(C.name)}"
                class="sidebar-edit-btn absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] cursor-pointer">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </span>
            </button>
          `).join(""):`
            <div class="px-3 py-6 text-center text-[var(--text-muted)] text-[13px]">
              No custom views yet
            </div>
          `}
        </div>
      </div>

      <!-- Areas -->
      <div class="bg-[var(--modal-bg)] rounded-lg border border-[var(--border)]">
        <div class="px-4 py-2.5 flex items-center justify-between border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">Areas</h3>
          <button onclick="window.editingAreaId=null; window.showAreaModal=true; window.render()" aria-label="Add new area" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition p-1.5 -mr-1 rounded-lg hover:bg-[var(--bg-secondary)]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
        <div class="py-2 px-2">
          ${r.taskAreas.map(C=>{const Z=Jr(C.id),G=r.collapsedSidebarAreas.has(C.id),J=Z.length>0,P=C.emoji||"";return`
              <div onclick="window.showAreaTasks('${C.id}')"
                onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.showAreaTasks('${C.id}');}"
                tabindex="0"
                role="button"
                aria-label="View ${A(C.name)} area"
                class="sidebar-item draggable-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg group relative cursor-pointer select-none transition-all ${f(C.id)?"active bg-[var(--accent-light)]":"hover:bg-[var(--bg-secondary)]"}"
                draggable="true"
                data-id="${C.id}"
                data-type="area">
                <span class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm relative" style="background: ${oe(C.color)}20; color: ${oe(C.color)}">
                  ${P||'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>'}
                  ${J?`
                    <span onclick="event.stopPropagation(); window.toggleSidebarAreaCollapse('${C.id}')"
                      class="absolute inset-0 flex items-center justify-center rounded-lg bg-[var(--bg-secondary)] opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                      <svg class="w-3.5 h-3.5 transition-transform ${G?"":"rotate-90"}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </span>
                  `:""}
                </span>
                <span class="flex-1 text-[14px] truncate ${f(C.id)?"font-medium text-[var(--text-primary)]":"text-[var(--text-secondary)]"}">${A(C.name)}</span>
                <span class="min-w-[20px] text-right text-xs group-hover:opacity-0 transition-opacity text-[var(--text-muted)]">${d[C.id]||""}</span>
                <button type="button" onclick="event.stopPropagation(); window.editingAreaId='${C.id}'; window.showAreaModal=true; window.render()" aria-label="Edit ${A(C.name)}"
                  class="sidebar-edit-btn absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
              </div>
            ${G?"":`
              ${Z.map(I=>{const q=I.emoji||"";return`
                <div onclick="window.showCategoryTasks('${I.id}')"
                  class="sidebar-item w-full pl-10 pr-3 py-1.5 flex items-center gap-2.5 text-left rounded-lg group relative cursor-pointer select-none transition-all ${p(I.id)?"active bg-[var(--accent-light)]":"hover:bg-[var(--bg-secondary)]"}">
                  <span class="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 text-xs" style="background: ${oe(I.color)}20; color: ${oe(I.color)}">
                    ${q||'<svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>'}
                  </span>
                  <span class="flex-1 text-[13px] truncate ${p(I.id)?"font-medium text-[var(--text-primary)]":"text-[var(--text-secondary)]"}">${A(I.name)}</span>
                  <button type="button" onclick="event.stopPropagation(); window.editingCategoryId='${I.id}'; window.showCategoryModal=true; window.render()" aria-label="Edit ${A(I.name)}"
                    class="sidebar-edit-btn absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]">
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                </div>
              `}).join("")}
              ${f(C.id)?`
              <button onclick="event.stopPropagation(); window.editingCategoryId=null; window.showCategoryModal=true; window.modalSelectedArea='${C.id}'; window.render()"
                class="w-full pl-10 pr-3 py-1 flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-secondary)] rounded-lg transition">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                Add Category
              </button>
              `:""}
            `}
          `}).join("")}
        </div>
      </div>

      <!-- Tags -->
      ${(()=>{const C=r.taskLabels.filter(F=>(c[F.id]||0)>0).sort((F,V)=>(c[V.id]||0)-(c[F.id]||0)),Z=r.taskLabels.filter(F=>!c[F.id]).sort((F,V)=>F.name.localeCompare(V.name)),G=10,J=r.showAllSidebarLabels,P=C.slice(0,G);C.slice(G);const I=J?[...C,...Z]:P,q=C.length+Z.length-P.length;return`
      <div class="bg-[var(--modal-bg)] rounded-lg border border-[var(--border)]">
        <div class="px-4 py-2.5 flex items-center justify-between border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">Tags${C.length>0?` (${C.length})`:""}</h3>
          <button onclick="window.editingLabelId=null; window.showLabelModal=true; window.render()" aria-label="Add new tag" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition p-1.5 -mr-1 rounded-lg hover:bg-[var(--bg-secondary)]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
        <div class="py-2 px-2">
          ${I.length===0?'<div class="px-3 py-2 text-xs text-[var(--text-muted)]">No tags yet</div>':I.map(F=>`
            <div onclick="window.showLabelTasks('${F.id}')"
              onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.showLabelTasks('${F.id}');}"
              tabindex="0"
              role="button"
              aria-label="View ${A(F.name)} tag"
              class="sidebar-item draggable-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg group relative cursor-pointer select-none transition-all ${m(F.id)?"active bg-[var(--accent-light)]":"hover:bg-[var(--bg-secondary)]"}"
              draggable="true"
              data-id="${F.id}"
              data-type="label">
              <span class="w-6 h-6 flex items-center justify-center flex-shrink-0">
                <span class="w-3 h-3 rounded-full" style="background-color: ${oe(F.color)}"></span>
              </span>
              <span class="flex-1 text-[14px] ${m(F.id)?"font-medium text-[var(--text-primary)]":"text-[var(--text-secondary)]"}">${A(F.name)}</span>
              <span class="min-w-[20px] text-right text-xs group-hover:opacity-0 transition-opacity text-[var(--text-muted)]">${c[F.id]||""}</span>
              <button type="button" onclick="event.stopPropagation(); window.editingLabelId='${F.id}'; window.showLabelModal=true; window.render()" aria-label="Edit ${A(F.name)}"
                class="sidebar-edit-btn absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
            </div>
          `).join("")}
          ${q>0?`
          <button onclick="window.showAllLabelsPage()"
            class="w-full px-3 py-2 text-xs text-[var(--accent)] hover:text-[var(--accent-dark)] text-left rounded-lg hover:bg-[var(--bg-secondary)] transition">
            View all ${r.taskLabels.length} tags
          </button>`:""}
        </div>
      </div>`})()}

      <!-- People -->
      ${(()=>{const C=r.taskPeople.filter(F=>(h[F.id]||0)>0).sort((F,V)=>(h[V.id]||0)-(h[F.id]||0)),Z=r.taskPeople.filter(F=>!h[F.id]).sort((F,V)=>F.name.localeCompare(V.name)),G=10,J=r.showAllSidebarPeople,P=C.slice(0,G),I=J?[...C,...Z]:P,q=C.length+Z.length-P.length;return`
      <div class="bg-[var(--modal-bg)] rounded-lg border border-[var(--border)]">
        <div class="px-4 py-2.5 flex items-center justify-between border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">People${C.length>0?` (${C.length})`:""}</h3>
          <button onclick="window.editingPersonId=null; window.showPersonModal=true; window.render()" aria-label="Add new person" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition p-1.5 -mr-1 rounded-lg hover:bg-[var(--bg-secondary)]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
        <div class="py-2 px-2">
          ${I.length===0?'<div class="px-3 py-2 text-xs text-[var(--text-muted)]">No people yet</div>':I.map(F=>`
            <div onclick="window.showPersonTasks('${F.id}')"
              onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.showPersonTasks('${F.id}');}"
              tabindex="0"
              role="button"
              aria-label="View tasks for ${A(F.name)}"
              class="sidebar-item draggable-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg group relative cursor-pointer select-none transition-all ${g(F.id)?"active bg-[var(--accent-light)]":"hover:bg-[var(--bg-secondary)]"}"
              draggable="true"
              data-id="${F.id}"
              data-type="person">
              ${Vr(F,24)}
              <span class="flex-1 min-w-0">
                <span class="block text-[14px] truncate ${g(F.id)?"font-medium text-[var(--text-primary)]":"text-[var(--text-secondary)]"}">${A(F.name)}</span>
                ${F.jobTitle?`<span class="block text-[11px] truncate text-[var(--text-muted)]">${A(F.jobTitle)}</span>`:""}
              </span>
              <span class="min-w-[20px] text-right text-xs group-hover:opacity-0 transition-opacity text-[var(--text-muted)]">${h[F.id]||""}</span>
              <button type="button" onclick="event.stopPropagation(); window.editingPersonId='${F.id}'; window.showPersonModal=true; window.render()" aria-label="Edit ${A(F.name)}"
                class="sidebar-edit-btn absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
            </div>
          `).join("")}
          ${q>0?`
          <button onclick="window.showAllPeoplePage()"
            class="w-full px-3 py-2 text-xs text-[var(--accent)] hover:text-[var(--accent-dark)] text-left rounded-lg hover:bg-[var(--bg-secondary)] transition">
            View all ${r.taskPeople.length} people
          </button>`:""}
        </div>
      </div>`})()}
    </div>
  `,_=r.activeFilterType==="area"&&r.activeAreaFilter,N=r.activeFilterType==="subcategory"&&r.activeCategoryFilter,L=r.activeFilterType==="label"&&r.activeLabelFilter,W=r.activeFilterType==="person"&&r.activePersonFilter,z=r.activeFilterType==="all-labels",S=r.activeFilterType==="all-people",O=r.activeFilterType==="perspective"&&r.customPerspectives.find(C=>C.id===r.activePerspective),w=_?et(r.activeAreaFilter):null,j=N?rt(r.activeCategoryFilter):null;let ee;return r.reviewMode?ee=typeof window.renderReviewMode=="function"?window.renderReviewMode():'<div class="p-8 text-center text-[var(--text-muted)]">Loading review mode...</div>':z?ee=Uk():S?ee=Gk():_?ee=Kp(w,e,s):N?ee=Hk(j,e,s):L?ee=zk(ua(r.activeLabelFilter),e,s):W?ee=Wk(pa(r.activePersonFilter),e,s):O?ee=Vk(O,e):ee=`
    <div class="flex-1">
      <div class="bg-[var(--bg-card)] rounded-lg md:border md:border-[var(--border-light)]">
        <div class="task-list-header-desktop px-5 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-2xl" ${oe(t.color)?`style="color: ${oe(t.color)}"`:""}>${t.icon}</span>
            <div>
              <h2 class="text-xl font-semibold text-[var(--text-primary)]">${t.name}</h2>
              ${t.jobTitle||t.email?`<p class="text-sm text-[var(--text-muted)]">${[t.jobTitle,t.email].filter(Boolean).join(" · ")}</p>`:""}
            </div>
          </div>
          <button onclick="window.openNewTaskModal()"
            class="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:bg-[var(--accent-dark)] transition shadow-sm" title="${u?"Add Note":"Add Task"}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>

        ${r.activePerspective!=="upcoming"?`
        <!-- Quick Add Input -->
        <div class="quick-add-section px-4 py-3 border-b border-[var(--border-light)]">
          <div class="flex items-center gap-3">
            ${u?`
              <div class="w-2 h-2 rounded-full border-2 border-dashed border-[var(--notes-color)]/40 flex-shrink-0 ml-1.5"></div>
            `:`
              <div onclick="state.quickAddIsNote = !state.quickAddIsNote; render()"
                class="quick-add-type-toggle" title="${r.quickAddIsNote?"Switch to Task":"Switch to Note"}">
                ${r.quickAddIsNote?'<div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-color)]"></div>':'<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed border-[var(--text-muted)]/30 flex-shrink-0"></div>'}
              </div>
            `}
            <input type="text" id="quick-add-input"
              placeholder="${u||r.quickAddIsNote?"New Note":"New To-Do"}"
              onkeydown="window.handleQuickAddKeydown(event, this)"
              class="flex-1 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 bg-transparent border-0 outline-none focus:ring-0">
            <button onclick="window.quickAddTask(document.getElementById('quick-add-input'))"
              class="text-[var(--text-muted)] hover:text-[var(--accent)] transition p-1" title="${u||r.quickAddIsNote?"Add Note":"Add to "+t.name}">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
        </div>
        `:""}

        <div class="min-h-[400px] task-list">
          ${e.length===0?`
            <div class="empty-state flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
              <div class="w-16 h-16 mb-4 flex items-center justify-center opacity-40">${t.icon}</div>
              <p class="text-[15px] font-medium">No tasks in ${t.name}</p>
              ${r.activePerspective==="inbox"?'<p class="text-[13px] mt-1 text-[var(--text-muted)]">Add a task to get started</p>':""}
            </div>
          `:r.activePerspective==="upcoming"?`
            <!-- Upcoming view grouped by date -->
            <div class="task-list">
              ${Lk(e).map(C=>`
                <div class="date-group mb-6">
                  <div class="px-5 py-2 sticky top-0 bg-[var(--bg-card)] z-10">
                    <span class="text-[13px] font-semibold text-[var(--text-muted)]">${C.label}</span>
                  </div>
                  <div>
                    ${C.dueTasks.length>0?`
                      ${C.deferTasks.length>0?'<div class="px-5 pt-1 pb-0.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--warning)]">Due</div>':""}
                      ${C.dueTasks.map(Z=>Oe(Z,!1)).join("")}
                    `:""}
                    ${C.deferTasks.length>0?`
                      <div class="px-5 pt-2 pb-0.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">Starting</div>
                      ${C.deferTasks.map(Z=>Oe(Z,!1)).join("")}
                    `:""}
                  </div>
                </div>
              `).join("")}
            </div>
          `:r.activePerspective==="logbook"?`
            <!-- Logbook view grouped by completion date -->
            <div class="task-list">
              ${Ok(e).map(C=>`
                <div class="date-group mb-6">
                  <div class="px-5 py-2 sticky top-0 bg-[var(--bg-card)]">
                    <span class="text-[13px] font-semibold text-[var(--text-muted)]">${C.label}</span>
                  </div>
                  <div>
                    ${C.tasks.map(Z=>Oe(Z,!1)).join("")}
                  </div>
                </div>
              `).join("")}
            </div>
          `:r.activePerspective==="today"?(()=>{const C=he(),Z=r.taskLabels.find(te=>te.name.trim().toLowerCase()==="next"),G=e.filter(te=>{const ue=te.dueDate===C,re=te.dueDate&&te.dueDate<C,ae=te.deferDate&&te.deferDate<=C;return te.today||ue||re||ae}),J=G.filter(te=>te.dueDate&&te.dueDate<=C).sort((te,ue)=>te.dueDate.localeCompare(ue.dueDate)),P=G.filter(te=>{const ue=te.dueDate&&te.dueDate<=C;return te.deferDate&&te.deferDate<=C&&!ue}),I=G.filter(te=>!J.includes(te)&&!P.includes(te)),q=Z?e.filter(te=>{const ue=(te.labels||[]).includes(Z.id),re=te.today||te.dueDate===C||te.dueDate&&te.dueDate<C;return ue&&!re}):[],F=G.length+q.length,V=(te,ue,re,ae,ce="")=>te.length>0?`
              <div class="${ce}">
                <div class="px-5 py-2 bg-[var(--bg-card)]">
                  <div class="flex items-center gap-2">
                    <span style="color: ${ae}">${ue}</span>
                    <span class="text-[13px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">${re}</span>
                    <span class="text-xs text-[var(--text-muted)]">${te.length}</span>
                  </div>
                </div>
                ${te.map(fe=>Oe(fe)).join("")}
              </div>
            `:"";return`
            <div class="task-list">
              ${V(J,'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',"Due","var(--overdue-color)")}
              ${I.length>0?`
                <div class="${J.length>0?"mt-2":""}">
                  ${I.map(te=>Oe(te)).join("")}
                </div>
              `:""}
              ${V(P,'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',"Starting","var(--accent)",J.length>0||I.length>0?"mt-2":"")}
              ${V(q,ve().next,"Next","var(--notes-color)",G.length>0?"mt-4":"")}
              ${F===0?`
                <div class="empty-state flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
                  <div class="w-16 h-16 mb-4 flex items-center justify-center opacity-50">${t.icon}</div>
                  <p class="text-[15px] font-medium">No tasks in ${t.name}</p>
                </div>
              `:""}
            </div>
          `})():r.activePerspective==="notes"?`
            <!-- Notes Outliner View -->
            <div class="notes-outliner bg-[var(--bg-card)]">
              <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between">
                <div class="flex items-center gap-2">
                  ${n?`
                    <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-[var(--accent-light)] text-[var(--accent)]">
                      <span class="w-2 h-2 rounded-full" style="background:${oe(n.color,"var(--notes-color)")}"></span>
                      ${A(n.name)}
                    </span>
                  `:""}
                  <span class="text-xs text-[var(--text-muted)]">${a.notes||0} notes</span>
                </div>
                <button onclick="window.createRootNote(${r.activeAreaFilter?`'${r.activeAreaFilter}'`:"null"})"
                  class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-lg transition">
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  New note
                </button>
              </div>
              ${Vp()}
              <div class="py-2">
                ${Gp(r.activeAreaFilter)}
              </div>
            </div>
          `:`
            <!-- Regular task list -->
            <div class="task-list">
              ${e.map(C=>Oe(C)).join("")}
            </div>
          `}
        </div>
      </div>
    </div>
  `,`
    <!-- Mobile Sidebar Drawer (hidden on desktop) -->
    <div id="mobile-sidebar-overlay" class="mobile-sidebar-overlay md:hidden ${r.mobileDrawerOpen?"show":""}" onclick="if(event.target===this) closeMobileDrawer()" role="dialog" aria-modal="true" aria-hidden="${r.mobileDrawerOpen?"false":"true"}" aria-label="Workspace sidebar">
      <div class="mobile-sidebar-drawer" onclick="event.stopPropagation()">
        <div class="p-4 border-b border-[var(--border-light)]" style="padding-top: max(16px, env(safe-area-inset-top));">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-lg font-bold text-[var(--text-primary)]">Workspace</h2>
            <button id="mobile-drawer-close" onclick="closeMobileDrawer()" class="w-11 h-11 flex items-center justify-center rounded-full text-[var(--text-muted)] active:bg-[var(--bg-secondary)] transition" aria-label="Close sidebar">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          ${k}
        </div>
        ${R.replace("w-full md:w-64","w-full")}
      </div>
    </div>

    <div class="flex flex-col md:flex-row gap-6">
      ${x?"":`
      <div class="hidden md:block">
        <div class="workspace-sidebar-toolbar mb-3 flex items-center gap-2">
          <div class="workspace-sidebar-mode">${k}</div>
          <button
            onclick="window.toggleWorkspaceSidebar()"
            class="workspace-sidebar-toggle-btn"
            title="Collapse workspace sidebar"
            aria-label="Collapse workspace sidebar">
            Collapse
          </button>
        </div>
        ${R}
      </div>
      `}

      <div class="flex-1 space-y-3">
        ${x?`
        <div class="hidden md:block">
          <button
            onclick="window.toggleWorkspaceSidebar()"
            class="workspace-sidebar-show-btn"
            title="Show workspace sidebar"
            aria-label="Show workspace sidebar">
            Show Sidebar
          </button>
        </div>
        `:""}
        <div class="md:hidden mb-2">${k}</div>
        ${ee}
      </div>
    </div>
  `}const Kk=Zi;function Yo(e){const t=A(e.title||"Untitled task"),n=e.dueDate?A(e.dueDate):"",a=n?`<span class="text-[10px] text-[var(--text-muted)]">${n}</span>`:"";return`
    <div class="px-4 py-2.5 border-b border-[var(--border-light)]/60 last:border-b-0">
      <div class="flex items-start gap-2.5">
        <button
          onclick="event.stopPropagation(); window.toggleTaskComplete('${we(e.id)}')"
          class="task-checkbox mt-0.5 w-[18px] h-[18px] rounded-full border-[1.5px] border-[var(--text-muted)] hover:border-[var(--accent)] flex-shrink-0 flex items-center justify-center transition-all"
          aria-label="Mark task complete: ${t}">
        </button>
        <button
          onclick="window.inlineEditingTaskId=null; window.editingTaskId='${we(e.id)}'; window.showTaskModal=true; window.render()"
          class="flex-1 min-w-0 text-left">
          <div class="text-[14px] leading-snug text-[var(--text-primary)] break-words">${t}</div>
          ${a}
        </button>
      </div>
    </div>
  `}function Ln(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`}function Yk(){if(r.calendarMeetingNotesEventKey)return x2();const e=Pe(),t=he(),n=["January","February","March","April","May","June","July","August","September","October","November","December"],a=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],s=new Date(r.calendarYear,r.calendarMonth,1),o=new Date(r.calendarYear,r.calendarMonth+1,0),i=s.getDay(),l=o.getDate(),d=new Date(r.calendarYear,r.calendarMonth,0).getDate(),c=[];for(let I=i-1;I>=0;I--){const q=d-I,F=r.calendarMonth===0?12:r.calendarMonth,te=`${r.calendarMonth===0?r.calendarYear-1:r.calendarYear}-${String(F).padStart(2,"0")}-${String(q).padStart(2,"0")}`;c.push({day:q,dateStr:te,outside:!0})}for(let I=1;I<=l;I++){const q=`${r.calendarYear}-${String(r.calendarMonth+1).padStart(2,"0")}-${String(I).padStart(2,"0")}`;c.push({day:I,dateStr:q,outside:!1})}const h=7-c.length%7;if(h<7)for(let I=1;I<=h;I++){const q=r.calendarMonth===11?1:r.calendarMonth+2,V=`${r.calendarMonth===11?r.calendarYear+1:r.calendarYear}-${String(q).padStart(2,"0")}-${String(I).padStart(2,"0")}`;c.push({day:I,dateStr:V,outside:!0})}const v={};c.forEach(I=>{v[I.dateStr]=ns(I.dateStr)});const f=ns(r.calendarSelectedDate),p=f.filter(I=>I.dueDate===r.calendarSelectedDate),m=f.filter(I=>I.deferDate===r.calendarSelectedDate&&I.dueDate!==r.calendarSelectedDate),g=r.calendarSelectedDate===t,y=r.tasksData.filter(I=>!I.completed&&!I.isNote),u=g?y.filter(I=>{const q=I.dueDate===t,F=I.dueDate&&I.dueDate<t,V=I.deferDate&&I.deferDate<=t;return I.today||q||F||V}):[],x=window.getGCalEventsForDate?.(r.calendarSelectedDate)||[],k=e?"M":"Month",E=e?"W":"Week",D=e?"3D":"3 Days",R=e?"Day":"Day Timeline",_=e?"Week TL":"Week Timeline",N={month:`${n[r.calendarMonth]} ${r.calendarYear}`,week:"Week View","3days":"3-Day View",daygrid:"Day Timeline",weekgrid:"Week Timeline"},L=new Date(r.calendarSelectedDate+"T12:00:00"),W=g?"Today":L.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}),z=()=>`
    <div class="calendar-grid">
      ${a.map(I=>`<div class="calendar-header-cell">${I}</div>`).join("")}
      ${c.map(I=>{const q=v[I.dateStr]||[],F=window.getGCalEventsForDate?.(I.dateStr)||[],V=I.dateStr===t,te=I.dateStr===r.calendarSelectedDate,ue=q.filter(ge=>ge.dueDate===I.dateStr||ge.deferDate===I.dateStr),re=["calendar-day"];I.outside&&re.push("outside"),V&&re.push("today"),te&&re.push("selected");const ae=ue.length+F.length,fe=Math.min(e?190:260,Math.max(94,48+ae*17));return`<div class="${re.join(" ")}" style="min-height:${fe}px" onclick="calendarSelectDate('${I.dateStr}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); calendarSelectDate('${I.dateStr}');}">
          <div class="calendar-day-num">${I.day}</div>
          ${ue.length+F.length>0?`
            <div class="calendar-task-list">
              ${ue.map(ge=>{const de=ge.dueDate===I.dateStr;return`<div class="calendar-task-line ${de&&ge.dueDate<t?"overdue":de?"due":"defer"}">${A(ge.title)}</div>`}).join("")}
              ${F.map(ge=>{const de=Fr(ge);return`<div class="calendar-task-line event ${de?"with-notes":""}" onclick="event.stopPropagation(); openCalendarEventActions('${we(ge.calendarId)}','${we(ge.id)}')">${de?'<span class="calendar-line-note-indicator"></span>':""}${A(ge.summary)}</div>`}).join("")}
            </div>
          `:""}
        </div>`}).join("")}
    </div>
  `,S=new Date(r.calendarSelectedDate+"T12:00:00"),O=[];if(r.calendarViewMode==="week"){const I=new Date(S);I.setDate(I.getDate()-I.getDay());for(let q=0;q<7;q++){const F=new Date(I);F.setDate(I.getDate()+q),O.push(F)}}else if(r.calendarViewMode==="3days")for(let I=-1;I<=1;I++){const q=new Date(S);q.setDate(q.getDate()+I),O.push(q)}const w=()=>`
    <div class="calendar-range-grid calendar-range-grid-${O.length}">
      ${O.map(I=>{const q=Ln(I),F=ns(q).filter(ae=>ae.dueDate===q||ae.deferDate===q),V=window.getGCalEventsForDate?.(q)||[],te=q===r.calendarSelectedDate,ue=q===t,re=[...F.map(ae=>({type:"task",task:ae})),...V.map(ae=>({type:"event",event:ae}))];return`
          <div class="calendar-range-day ${te?"selected":""}" onclick="calendarSelectDate('${q}')">
            <div class="calendar-range-day-head ${ue?"today":""}">
              <div class="calendar-range-day-name">${I.toLocaleDateString("en-US",{weekday:"short"})}</div>
              <div class="calendar-range-day-date">${I.toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
            </div>
            <div class="calendar-range-day-list">
              ${re.length===0?'<div class="calendar-range-empty">No items</div>':re.map(ae=>{if(ae.type==="event"){const b=Fr(ae.event);return`<div class="calendar-task-line event ${b?"with-notes":""}" onclick="event.stopPropagation(); openCalendarEventActions('${we(ae.event.calendarId)}','${we(ae.event.id)}')">${b?'<span class="calendar-line-note-indicator"></span>':""}${A(ae.event.summary)}</div>`}const ce=ae.task,fe=ce.dueDate===q;return`<div class="calendar-task-line ${fe&&ce.dueDate<t?"overdue":fe?"due":"defer"}">${A(ce.title)}</div>`}).join("")}
            </div>
          </div>
        `}).join("")}
    </div>
  `,j=()=>{const I=[];if(r.calendarViewMode==="daygrid")I.push(new Date(S));else{const de=new Date(S);de.setDate(de.getDate()-de.getDay());for(let b=0;b<7;b++){const U=new Date(de);U.setDate(de.getDate()+b),I.push(U)}}const q=Array.from({length:18},(de,b)=>b+6),F=Pe(),V=I.findIndex(de=>Ln(de)===t),te=I.findIndex(de=>Ln(de)===r.calendarSelectedDate),ue=te>=0?te:V>=0?V:0,re=F&&I.length>1?[I[ue]]:I,ae=F?"44px":"56px",ce=re.length===1?`grid-cols-[${ae}_1fr]`:"grid-cols-[56px_repeat(7,minmax(160px,1fr))] min-w-[840px]",fe=F?"min-h-[60px]":"min-h-[52px]";return`
      ${F&&I.length>1?`
      <div class="flex gap-1.5 overflow-x-auto pb-2 px-1 scrollbar-none">
        ${I.map((de,b)=>{const U=Ln(de);return`<button onclick="calendarSelectDate('${U}')"
            class="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition ${b===ue?"bg-[var(--accent)] text-white":U===t?"bg-[var(--accent-light)] text-[var(--accent)]":"bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}">${de.toLocaleDateString("en-US",{weekday:"short",day:"numeric"})}</button>`}).join("")}
      </div>
    `:""}
      <div class="overflow-auto border border-[var(--border-light)] rounded-lg">
        <div class="grid ${ce}">
          <div class="sticky top-0 z-10 bg-[var(--bg-card)] border-b border-r border-[var(--border-light)]"></div>
          ${re.map(de=>`<div class="sticky top-0 z-10 bg-[var(--bg-card)] border-b border-r border-[var(--border-light)] px-2 py-2 text-xs font-semibold text-[var(--text-primary)] ${Ln(de)===t?"text-[var(--accent)]":""}">
              ${de.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}
            </div>`).join("")}
          ${q.map(de=>`
            <div class="px-2 py-2 text-[11px] text-[var(--text-muted)] border-r border-b border-[var(--border-light)] bg-[var(--bg-card)]">${String(de).padStart(2,"0")}:00</div>
            ${re.map(b=>{const U=Ln(b),$=(window.getGCalEventsForDate?.(U)||[]).filter(T=>!T.allDay).filter(T=>{const M=new Date(T.start?.dateTime||"").getHours();return Number.isFinite(M)&&M===de});return`
                <div class="${fe} border-r border-b border-[var(--border-light)] p-1.5 bg-[var(--bg-primary)]"
                  ondragover="event.preventDefault()"
                  ondrop="dropCalendarEventToSlot('${U}', ${de})">
                  ${$.map(T=>`
                    <div
                      draggable="true"
                      ondragstart="startCalendarEventDrag('${we(T.calendarId)}','${we(T.id)}')"
                      ondragend="clearCalendarEventDrag()"
                      onclick="openCalendarEventActions('${we(T.calendarId)}','${we(T.id)}')"
                      class="text-[11px] rounded-md px-2 py-1 mb-1 calendar-time-event cursor-move truncate">
                      ${A(T.summary)}
                    </div>
                  `).join("")}
                </div>
              `}).join("")}
          `).join("")}
        </div>
      </div>
    `};let ee="";r.calendarViewMode==="month"?ee=z():r.calendarViewMode==="week"||r.calendarViewMode==="3days"?ee=w():ee=j();const C=r.gcalTokenExpired?`
    <div class="calendar-token-banner mx-5 my-2 px-4 py-2 rounded-lg flex items-center justify-between">
      <span class="text-sm">Google Calendar session expired</span>
      <button onclick="reconnectGCal()" class="text-sm font-medium hover:opacity-80 underline">Reconnect</button>
    </div>
  `:"",Z=u.length>0?u.map(I=>Yo(I)).join(""):'<div class="px-4 py-4 text-sm text-[var(--text-muted)]">No tasks for today.</div>',G=L.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}),J=x.length>0?x.map(I=>{const q=String(I?.summary||"(No title)"),F=A(q.length>60?q.slice(0,57)+"...":q),V=Kk(I)||"All day",te=Fr(I);return`
        <button onclick="openCalendarEventActions('${we(I.calendarId)}','${we(I.id)}')" class="calendar-side-event-row w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-[var(--bg-secondary)] transition rounded-lg ${te?"calendar-side-event-with-notes":""}">
          <span class="w-2.5 h-2.5 rounded-full ${te?"bg-[var(--flagged-color)]":"bg-[var(--success)]"} flex-shrink-0"></span>
          <span class="text-sm text-[var(--text-primary)] flex-1 truncate">${F}</span>
          ${te?'<span class="calendar-notes-chip">Notes</span>':""}
          <span class="text-xs text-[var(--text-muted)] flex-shrink-0">${A(V)}</span>
        </button>
      `}).join(""):`<div class="px-4 py-4 text-sm text-[var(--text-muted)]">No events for ${G}.</div>`,P=l2();return`
    <div class="flex-1">
      <div class="calendar-page-grid ${r.calendarSidebarCollapsed?"calendar-page-grid-expanded":""}">
        <section class="bg-[var(--bg-card)] rounded-lg md:border md:border-[var(--border-light)]">
          <div class="px-5 py-4 flex items-center justify-between border-b border-[var(--border-light)]">
            <div class="flex items-center gap-3">
              <span class="text-2xl text-[var(--accent)]">${ve().calendar}</span>
              <h2 class="text-xl font-semibold text-[var(--text-primary)]">Calendar</h2>
            </div>
            <div class="flex items-center gap-2">
              <button onclick="toggleCalendarSidebar()" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--border-light)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition text-sm font-medium" title="${r.calendarSidebarCollapsed?"Show Today & Events sidebar":"Expand calendar (hide sidebar)"}">
                <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  ${r.calendarSidebarCollapsed?'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/>':'<rect width="18" height="18" x="3" y="3" rx="2"/>'}
                </svg>
                <span>${r.calendarSidebarCollapsed?"Show sidebar":"Expand calendar"}</span>
              </button>
              <button onclick="openNewTaskModal()" class="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:bg-[var(--accent-dark)] transition shadow-sm" title="Add Task">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>
          </div>

          <div class="px-5 py-3 calendar-toolbar border-b border-[var(--border-light)]">
            <div class="calendar-period-row">
              <div class="calendar-period-nav">
                <button onclick="calendarPrevMonth()" class="calendar-period-btn" aria-label="Previous period">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                </button>
                <h3 class="calendar-period-title">${N[r.calendarViewMode]||N.month}</h3>
                <button onclick="calendarNextMonth()" class="calendar-period-btn" aria-label="Next period">
                  <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              </div>
              <div class="calendar-period-actions">
                <button onclick="calendarGoToday()" class="calendar-today-btn">Today</button>
                ${r.gcalSyncing?'<span class="text-[10px] text-[var(--text-muted)]">Syncing...</span>':""}
              </div>
            </div>
            <div class="calendar-views-row">
              <div class="calendar-view-toggle">
                <button onclick="setCalendarViewMode('month')" class="calendar-view-toggle-btn ${r.calendarViewMode==="month"?"active":""}" aria-pressed="${r.calendarViewMode==="month"}">${k}</button>
                <button onclick="setCalendarViewMode('week')" class="calendar-view-toggle-btn ${r.calendarViewMode==="week"?"active":""}" aria-pressed="${r.calendarViewMode==="week"}">${E}</button>
                <button onclick="setCalendarViewMode('3days')" class="calendar-view-toggle-btn ${r.calendarViewMode==="3days"?"active":""}" aria-pressed="${r.calendarViewMode==="3days"}">${D}</button>
                <button onclick="setCalendarViewMode('daygrid')" class="calendar-view-toggle-btn ${r.calendarViewMode==="daygrid"?"active":""}" aria-pressed="${r.calendarViewMode==="daygrid"}">${R}</button>
                <button onclick="setCalendarViewMode('weekgrid')" class="calendar-view-toggle-btn ${r.calendarViewMode==="weekgrid"?"active":""}" aria-pressed="${r.calendarViewMode==="weekgrid"}">${_}</button>
              </div>
            </div>
          </div>

          ${C}

          <div class="px-3 pt-2 pb-2">
            ${ee}
          </div>
        </section>

        <aside class="space-y-3 ${r.calendarSidebarCollapsed?"hidden":""}">
          <div class="bg-[var(--bg-card)] rounded-lg md:border md:border-[var(--border-light)] overflow-hidden">
            <button onclick="toggleCalendarMobilePanel('today')" class="calendar-mobile-panel-toggle px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between w-full text-left" aria-expanded="${r.calendarMobileShowToday?"true":"false"}">
              <h4 class="text-sm font-semibold text-[var(--text-primary)]">Today</h4>
              <span class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)] font-medium">${u.length}</span>
                <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform ${r.calendarMobileShowToday?"rotate-180":""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              </span>
            </button>
            <div class="calendar-side-list ${e&&!r.calendarMobileShowToday?"calendar-panel-collapsed":""}">${Z}</div>
          </div>

          <div class="bg-[var(--bg-card)] rounded-lg md:border md:border-[var(--border-light)] overflow-hidden">
            <button onclick="toggleCalendarMobilePanel('events')" class="calendar-mobile-panel-toggle px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between w-full text-left" aria-expanded="${r.calendarMobileShowEvents?"true":"false"}">
              <h4 class="text-sm font-semibold text-[var(--text-primary)]">Events</h4>
              <span class="flex items-center gap-2">
                <span class="text-xs text-[var(--text-muted)]">${W}</span>
                <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform ${r.calendarMobileShowEvents?"rotate-180":""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              </span>
            </button>
            <div class="calendar-side-list ${e&&!r.calendarMobileShowEvents?"calendar-panel-collapsed":""}">${J}</div>
          </div>

          ${p.length>0||m.length>0?`
            <div class="bg-[var(--bg-card)] rounded-lg md:border md:border-[var(--border-light)] overflow-hidden">
              <button onclick="toggleCalendarMobilePanel('scheduled')" class="calendar-mobile-panel-toggle px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between w-full text-left" aria-expanded="${r.calendarMobileShowScheduled?"true":"false"}">
                <h4 class="text-sm font-semibold text-[var(--text-primary)]">Scheduled</h4>
                <span class="flex items-center gap-2">
                  <span class="text-xs text-[var(--text-muted)]">${G}</span>
                  <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform ${r.calendarMobileShowScheduled?"rotate-180":""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </span>
              </button>
              <div class="calendar-side-list ${e&&!r.calendarMobileShowScheduled?"calendar-panel-collapsed":""}">
                ${p.length>0?`
                  <div class="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--warning)]">Due</div>
                  ${p.map(I=>Yo(I)).join("")}
                `:""}
                ${m.length>0?`
                  <div class="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">Starting</div>
                  ${m.map(I=>Yo(I)).join("")}
                `:""}
              </div>
            </div>
          `:""}
        </aside>
      </div>

      ${k2(P)}
    </div>
  `}function Jk(){const e=document.querySelector(".calendar-grid");if(!e||e._swipeAttached)return;e._swipeAttached=!0;let t=0,n=0;e.addEventListener("touchstart",a=>{t=a.touches[0].clientX,n=a.touches[0].clientY},{passive:!0}),e.addEventListener("touchend",a=>{const s=a.changedTouches[0].clientX-t,o=a.changedTouches[0].clientY-n;Math.abs(s)>50&&Math.abs(s)>Math.abs(o)*1.5&&(s<0?window.calendarNextMonth():window.calendarPrevMonth())},{passive:!0})}let rs=null,Ds=!1;function Xk(){const e=document.querySelector("#mobile-sidebar-overlay .mobile-sidebar-drawer");return e?Array.from(e.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hasAttribute("disabled")&&!t.getAttribute("aria-hidden")):[]}function Yp(e){if(!r.mobileDrawerOpen)return;if(e.key==="Escape"){e.preventDefault(),st();return}if(e.key!=="Tab")return;const t=Xk();if(!t.length)return;const n=t[0],a=t[t.length-1],s=document.activeElement;e.shiftKey&&s===n?(e.preventDefault(),a.focus()):!e.shiftKey&&s===a&&(e.preventDefault(),n.focus())}let _s=0,As=0,ta=!1;function Jp(e){const t=e.touches[0].clientX;if(t<40||t>window.innerWidth-40){ta=!1;return}_s=t,As=_s,ta=!0}function Xp(e){if(!ta)return;As=e.touches[0].clientX;const t=As-_s;if(t<0){const n=document.querySelector(".mobile-sidebar-drawer");n&&(n.style.transform=`translate3d(${t}px, 0, 0)`,n.style.transition="none")}}function Qp(){if(!ta)return;ta=!1;const e=As-_s,t=document.querySelector(".mobile-sidebar-drawer");t&&(t.style.transition="",t.style.transform=""),e<-60&&st()}function Qk(){const e=document.getElementById("mobile-sidebar-overlay");e&&(e.addEventListener("touchstart",Jp,{passive:!0}),e.addEventListener("touchmove",Xp,{passive:!0}),e.addEventListener("touchend",Qp,{passive:!0}))}function Zk(){const e=document.getElementById("mobile-sidebar-overlay");e&&(e.removeEventListener("touchstart",Jp),e.removeEventListener("touchmove",Xp),e.removeEventListener("touchend",Qp))}function eS(){rs=document.activeElement instanceof HTMLElement?document.activeElement:null,r.mobileDrawerOpen=!0,document.body.style.overflow="hidden",document.body.classList.add("drawer-open"),document.body.classList.add("body-modal-open"),Jl(),Ds||(document.addEventListener("keydown",Yp),Ds=!0),setTimeout(()=>{const e=document.getElementById("mobile-drawer-close");e&&e.focus()},20),Qk()}function st(){Zk(),r.mobileDrawerOpen=!1,document.body.style.overflow="",document.body.classList.remove("drawer-open"),!r.showTaskModal&&!r.showPerspectiveModal&&!r.showAreaModal&&!r.showLabelModal&&!r.showPersonModal&&!r.showCategoryModal&&!r.showBraindump&&!r.calendarEventModalOpen&&document.body.classList.remove("body-modal-open"),Ds&&(document.removeEventListener("keydown",Yp),Ds=!1),Jl(),rs&&typeof rs.focus=="function"&&rs.focus()}function Jl(){const e=document.getElementById("mobile-sidebar-overlay");e&&(r.mobileDrawerOpen?e.classList.add("show"):e.classList.remove("show"))}function tS(){return`
    <nav class="mobile-bottom-nav" aria-label="Main navigation">
      <div class="mobile-bottom-nav-inner" role="tablist">
        <button onclick="switchTab('home')" class="mobile-nav-item ${r.activeTab==="home"?"active":""}" role="tab" aria-selected="${r.activeTab==="home"}" aria-label="Home">
          ${ve().home}
          <span class="mobile-nav-label">Home</span>
        </button>
        <button onclick="switchTab('tasks')" class="mobile-nav-item ${r.activeTab==="tasks"?"active":""}" role="tab" aria-selected="${r.activeTab==="tasks"}" aria-label="Workspace">
          ${ve().workspace}
          <span class="mobile-nav-label">Workspace</span>
        </button>
        <button onclick="switchTab('life')" class="mobile-nav-item ${r.activeTab==="life"?"active":""}" role="tab" aria-selected="${r.activeTab==="life"}" aria-label="Life Score">
          ${ve().lifeScore}
          <span class="mobile-nav-label">Life</span>
        </button>
        <button onclick="switchTab('calendar')" class="mobile-nav-item ${r.activeTab==="calendar"?"active":""}" role="tab" aria-selected="${r.activeTab==="calendar"}" aria-label="Calendar">
          ${ve().calendar}
          <span class="mobile-nav-label">Calendar</span>
        </button>
        <button onclick="switchTab('settings')" class="mobile-nav-item ${r.activeTab==="settings"?"active":""}" role="tab" aria-selected="${r.activeTab==="settings"}" aria-label="Settings">
          ${ve().settings}
          <span class="mobile-nav-label">Settings</span>
        </button>
      </div>
    </nav>
  `}function nS(e){r.reviewMode=!1,r.activeFilterType="area",r.activeAreaFilter=e,r.activeLabelFilter=null,r.activePersonFilter=null,r.collapsedSidebarAreas.delete(e),st(),r.activeTab!=="tasks"&&(r.activeTab="tasks"),Ge(),window.render(),Nt()}function rS(e){r.reviewMode=!1,r.activeFilterType="label",r.activeLabelFilter=e,r.activeAreaFilter=null,r.activePersonFilter=null,st(),r.activeTab!=="tasks"&&(r.activeTab="tasks"),Ge(),window.render(),Nt()}function aS(e){if(r.reviewMode=!1,e==="calendar"){st(),r.activeTab="calendar",Ge(),window.render(),Nt();return}r.activeFilterType="perspective",r.activePerspective=e,r.activeAreaFilter=null,r.activeLabelFilter=null,r.activePersonFilter=null,st(),r.activeTab!=="tasks"&&(r.activeTab="tasks"),Ge(),window.render(),Nt()}function sS(e){r.reviewMode=!1,r.activeFilterType="person",r.activePersonFilter=e,r.activePerspective=null,r.activeAreaFilter=null,r.activeLabelFilter=null,st(),r.activeTab!=="tasks"&&(r.activeTab="tasks"),Ge(),window.render(),Nt()}function oS(e){r.reviewMode=!1,r.activeFilterType="subcategory",r.activeCategoryFilter=e,r.activePerspective=null,r.activeAreaFilter=null,r.activeLabelFilter=null,r.activePersonFilter=null,st(),r.activeTab!=="tasks"&&(r.activeTab="tasks"),Ge(),window.render(),Nt()}function iS(){r.reviewMode=!1,r.activeFilterType="all-labels",r.activeLabelFilter=null,r.activeAreaFilter=null,r.activePersonFilter=null,r.activePerspective=null,st(),r.activeTab!=="tasks"&&(r.activeTab="tasks"),Ge(),window.render(),Nt()}function lS(){r.reviewMode=!1,r.activeFilterType="all-people",r.activePersonFilter=null,r.activeAreaFilter=null,r.activeLabelFilter=null,r.activePerspective=null,st(),r.activeTab!=="tasks"&&(r.activeTab="tasks"),Ge(),window.render(),Nt()}function dS(e){r.collapsedSidebarAreas.has(e)?r.collapsedSidebarAreas.delete(e):r.collapsedSidebarAreas.add(e),window.render()}function cS(){r.workspaceSidebarCollapsed=!r.workspaceSidebarCollapsed,window.render()}let Jo=0,Bi=!1,zr=null;function uS(){Bi||window.innerWidth>768||(Bi=!0,Jo=window.scrollY,zr=()=>{const e=document.querySelector(".mobile-bottom-nav");if(!e)return;const t=window.scrollY,n=t-Jo;n>50&&t>150?e.classList.add("nav-scroll-hidden"):(n<-20||t<80)&&e.classList.remove("nav-scroll-hidden"),Jo=t},window.addEventListener("scroll",zr,{passive:!0}),typeof window.registerCleanup=="function"&&window.registerCleanup(fS))}function fS(){zr&&(window.removeEventListener("scroll",zr),zr=null,Bi=!1)}function Nt(){Pe()&&setTimeout(()=>{const e=document.querySelector(".main-content")||document.querySelector("main");e?e.scrollIntoView({behavior:"smooth",block:"start"}):window.scrollTo({top:0,behavior:"smooth"})},50)}function Zp(e){const t=new Date;t.setHours(0,0,0,0);function n(g){const y=g.getFullYear(),u=String(g.getMonth()+1).padStart(2,"0"),x=String(g.getDate()).padStart(2,"0");return`${y}-${u}-${x}`}function a(g,y){const u=new Date(g);return u.setDate(u.getDate()+y),u}function s(g,y){const u=new Date(g),x=(y-u.getDay()+7)%7;return u.setDate(u.getDate()+(x===0?7:x)),u}const o=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"],i=["sun","mon","tue","wed","thu","fri","sat"],l=["january","february","march","april","may","june","july","august","september","october","november","december"],d=["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"],c=(e||"").trim().toLowerCase();if(!c){const g=s(t,1);return[{name:"Today",date:n(t)},{name:"Tomorrow",date:n(a(t,1))},{name:"Next Monday",date:n(g)},{name:"In 1 Week",date:n(a(t,7))}]}const h=[];("today".startsWith(c)||c==="tod")&&h.push({name:"Today",date:n(t)}),("tomorrow".startsWith(c)||"tmr".startsWith(c))&&h.push({name:"Tomorrow",date:n(a(t,1))});const v=c.match(/^next\s+(.+)$/);if(v){const g=v[1];o.forEach((y,u)=>{(y.startsWith(g)||i[u].startsWith(g))&&h.push({name:"Next "+y.charAt(0).toUpperCase()+y.slice(1),date:n(s(a(t,1),u))})})}v||o.forEach((g,y)=>{(g.startsWith(c)||i[y].startsWith(c))&&h.push({name:g.charAt(0).toUpperCase()+g.slice(1),date:n(s(t,y))})});const f=c.match(/^in\s+(\d+)\s*(d|day|days|w|week|weeks|m|month|months)?\s*$/);if(f){const g=parseInt(f[1]),y=(f[2]||"d")[0];if(y==="d")h.push({name:`In ${g} day${g!==1?"s":""}`,date:n(a(t,g))});else if(y==="w")h.push({name:`In ${g} week${g!==1?"s":""}`,date:n(a(t,g*7))});else if(y==="m"){const u=new Date(t);u.setMonth(u.getMonth()+g),h.push({name:`In ${g} month${g!==1?"s":""}`,date:n(u)})}}const p=c.match(/^in\s+(\d+)\s*$/);if(p&&!f){const g=parseInt(p[1]);h.push({name:`In ${g} day${g!==1?"s":""}`,date:n(a(t,g))}),h.push({name:`In ${g} week${g!==1?"s":""}`,date:n(a(t,g*7))});const y=new Date(t);y.setMonth(y.getMonth()+g),h.push({name:`In ${g} month${g!==1?"s":""}`,date:n(y)})}const m=c.match(/^([a-z]+)\s+(\d{1,2})$/);if(m){const g=m[1],y=parseInt(m[2]);l.forEach((u,x)=>{if(u.startsWith(g)||d[x]===g){let k=new Date(t.getFullYear(),x,y);k<t&&(k=new Date(t.getFullYear()+1,x,y));const E=d[x].charAt(0).toUpperCase()+d[x].slice(1)+" "+y;h.push({name:E,date:n(k)})}})}return h.slice(0,5)}function Xl(e,t={}){const n=document.getElementById(e);if(!n||n.dataset.inlineAcAttached)return;n.dataset.inlineAcAttached="1";const a=t.isModal||!1;!a&&!r.inlineAutocompleteMeta.has(e)&&r.inlineAutocompleteMeta.set(e,{areaId:t.initialMeta?.areaId||null,categoryId:t.initialMeta?.categoryId||null,labels:t.initialMeta?.labels?[...t.initialMeta.labels]:[],people:t.initialMeta?.people?[...t.initialMeta.people]:[],deferDate:t.initialMeta?.deferDate||null,dueDate:t.initialMeta?.dueDate||null});let s=null,o=0,i=null,l=-1;function d(){return a?{areaId:r.modalSelectedArea,categoryId:r.modalSelectedCategory,labels:r.modalSelectedTags,people:r.modalSelectedPeople,deferDate:document.getElementById("task-defer")?.value||null,dueDate:document.getElementById("task-due")?.value||null}:r.inlineAutocompleteMeta.get(e)||{areaId:null,categoryId:null,labels:[],people:[],deferDate:null,dueDate:null}}function c(u,x){if(a){if(u==="areaId")r.modalSelectedArea=x,window.renderAreaInput(),window.renderCategoryInput();else if(u==="categoryId")r.modalSelectedCategory=x,window.renderCategoryInput();else if(u==="labels")r.modalSelectedTags=x,window.renderTagsInput();else if(u==="people")r.modalSelectedPeople=x,window.renderPeopleInput();else if(u==="deferDate"){const k=document.getElementById("task-defer");k&&(k.value=x||"",window.updateDateDisplay("defer"))}else if(u==="dueDate"){const k=document.getElementById("task-due");k&&(k.value=x||"",window.updateDateDisplay("due"))}}else{const k=d();k[u]=x,r.inlineAutocompleteMeta.set(e,k),t.onMetadataChange&&t.onMetadataChange(k),Ms(e)}}function h(u){const x=d();if(i==="#"){const k=r.taskAreas.map(D=>({...D,_acType:"area"})),E=(r.taskCategories||[]).map(D=>({...D,_acType:"category"}));return[...k,...E]}return i==="@"?r.taskLabels.filter(k=>!(x.labels||[]).includes(k.id)):i==="&"?r.taskPeople.filter(k=>!(x.people||[]).includes(k.id)):i==="!"||i==="!!"?Zp(u||""):[]}function v(){return i==="#"?u=>({...Ys(u,""),_acType:"area"}):i==="@"?u=>{const x=["#ef4444","#f59e0b","#22c55e","#3b82f6","#8b5cf6","#ec4899"],k=x[Math.floor(Math.random()*x.length)];return ca(u,k)}:i==="&"?u=>fa(u,""):null}function f(u){const x=n.value,k=x.substring(0,l),E=x.substring(n.selectionStart);n.value=k.trimEnd()+(k.trimEnd()?" ":"")+E.trimStart();const D=(k.trimEnd()+(k.trimEnd()?" ":"")).length;if(n.setSelectionRange(D,D),i==="#")u._acType==="category"?(u.areaId&&c("areaId",u.areaId),c("categoryId",u.id)):c("areaId",u.id);else if(i==="@"){const _=[...d().labels||[]];_.includes(u.id)||_.push(u.id),c("labels",_)}else if(i==="&"){const _=[...d().people||[]];_.includes(u.id)||_.push(u.id),c("people",_)}else i==="!!"?c("dueDate",u.date):i==="!"&&c("deferDate",u.date);p(),n.focus()}function p(){s&&s.parentNode&&s.parentNode.removeChild(s),s=null,i=null,l=-1,o=0}function m(u,x){s||(s=document.createElement("div"),s.className="inline-autocomplete-popup",s.addEventListener("mousedown",w=>w.preventDefault()),document.body.appendChild(s));const k=n.getBoundingClientRect(),E=window.innerHeight-k.bottom,D=Math.min(300,window.innerWidth-24);s.style.left=Math.min(k.left,window.innerWidth-D-12)+"px",s.style.width=D+"px",E>240?(s.style.top=k.bottom+4+"px",s.style.bottom="auto"):(s.style.bottom=window.innerHeight-k.top+4+"px",s.style.top="auto");const R=i==="!"||i==="!!",_=R?u:u.filter(w=>w.name.toLowerCase().includes(x.toLowerCase())),N=R?!0:u.some(w=>w.name.toLowerCase()===x.toLowerCase()),L=!R&&x.length>0&&!N,W=_.length+(L?1:0);if(W===0){p();return}o>=W&&(o=W-1),o<0&&(o=0);const z=i==="#"?"Area":i==="@"?"Tag":i==="!!"?"Due Date":i==="!"?"Defer Date":"Person";let S="";if(_.forEach((w,j)=>{const ee=j===o?" active":"";let C;if(R){const J=i==="!!"?"#ef4444":"#8b5cf6";C=`<span class="ac-icon" style="background:${J}20;color:${J}"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg></span>`}else if(i==="#"){const J=oe(w.color),P=w.emoji?A(w.emoji):'<svg style="width:14px;height:14px" viewBox="0 0 24 24" fill="currentColor"><path d="M2 6a2 2 0 012-2h5.586a1 1 0 01.707.293L12 6h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" opacity="0.35"/><rect x="2" y="9" width="20" height="11" rx="2"/></svg>';C=`<span class="ac-icon" style="background:${J}20;color:${J}">${P}</span>`}else if(i==="@")C=`<span class="w-3 h-3 rounded-full inline-block flex-shrink-0" style="background:${oe(w.color)}"></span>`;else{const J=oe(w.color);C=`<span class="ac-icon" style="background:${J}20;color:${J}">👤</span>`}const Z=R?`<span style="margin-left:auto;font-size:11px;color:var(--text-muted)">${Ne(w.date)}</span>`:"";let G=A(w.name);if(i==="#"&&w._acType==="category"&&w.areaId){const J=r.taskAreas.find(P=>P.id===w.areaId);J&&(G+=`<span style="margin-left:6px;font-size:11px;color:var(--text-muted)">${A(J.name)}</span>`)}S+=`<div class="inline-ac-option${ee}" data-idx="${j}" style="${R?"justify-content:space-between":""}">${C}<span>${G}</span>${Z}</div>`}),L){const w=_.length;S+=`<div class="inline-ac-create${o===w?" active":""}" data-idx="${w}">+ Create ${z} "${A(x)}"</div>`}s.innerHTML=S,s.querySelectorAll(".inline-ac-option").forEach(w=>{w.addEventListener("click",()=>f(_[parseInt(w.dataset.idx)]))});const O=s.querySelector(".inline-ac-create");O&&O.addEventListener("click",()=>{const w=v();if(w){const j=w(x);f(j)}})}function g(){const u=n.value,x=n.selectionStart;function k(E){if(E+1<u.length&&u[E+1]==="!"){i="!!",l=E;const D=u.substring(E+2,x),R=h(D);o=0,m(R,D)}else{i="!",l=E;const D=u.substring(E+1,x),R=h(D);o=0,m(R,D)}}for(let E=x-1;E>=0;E--){const D=u[E];if(D===`
`){p();return}if(D===" "){for(let R=E-1;R>=0;R--){const _=u[R];if(_===`
`||_==="#"||_==="@"||_==="&")break;if(_==="!"&&(R===0||u[R-1]===" ")){k(R);return}}p();return}if((D==="#"||D==="@"||D==="&")&&(E===0||u[E-1]===" ")){i=D,l=E;const R=u.substring(E+1,x),_=h(R);o=0,m(_,R);return}if(D==="!"&&(E===0||u[E-1]===" ")){k(E);return}}p()}n.addEventListener("input",()=>g()),n.addEventListener("keydown",u=>{if(!s)return;const x=n.value,k=n.selectionStart,E=x.substring(l+i.length,k),D=i==="!"||i==="!!",R=h(E),_=D?R:R.filter(z=>z.name.toLowerCase().includes(E.toLowerCase())),N=D?!0:R.some(z=>z.name.toLowerCase()===E.toLowerCase()),L=!D&&E.length>0&&!N,W=_.length+(L?1:0);if(u.key==="ArrowDown")u.preventDefault(),u.stopImmediatePropagation(),o=(o+1)%W,m(R,E);else if(u.key==="ArrowUp")u.preventDefault(),u.stopImmediatePropagation(),o=(o-1+W)%W,m(R,E);else if(u.key==="Enter"||u.key==="Tab"){if(u.preventDefault(),u.stopImmediatePropagation(),u._inlineAcHandled=!0,o<_.length)f(_[o]);else if(L){const z=v();if(z){const S=z(E);f(S)}}}else u.key==="Escape"&&(u.preventDefault(),u.stopImmediatePropagation(),u._inlineAcHandled=!0,p())},!0);let y;n.addEventListener("blur",()=>{y=setTimeout(()=>p(),150)}),n.addEventListener("focus",()=>{clearTimeout(y)}),a||Ms(e)}function Ms(e){const t=r.inlineAutocompleteMeta.get(e);if(!t)return;const n=document.getElementById(e);if(!n)return;let a=document.getElementById(e+"-chips");a||(a=document.createElement("div"),a.id=e+"-chips",a.className="inline-meta-chips",n.parentNode.insertBefore(a,n.nextSibling));let s="";if(t.areaId){const o=r.taskAreas.find(i=>i.id===t.areaId);if(o){const i=oe(o.color),l=o.emoji?A(o.emoji):'<svg style="display:inline-block;vertical-align:middle;width:12px;height:12px" viewBox="0 0 24 24" fill="currentColor"><path d="M2 6a2 2 0 012-2h5.586a1 1 0 01.707.293L12 6h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" opacity="0.35"/><rect x="2" y="9" width="20" height="11" rx="2"/></svg>';s+=`<span class="inline-meta-chip" style="background:${i}20;color:${i}">
        ${l} ${A(o.name)}
        <span class="inline-meta-chip-remove" onclick="removeInlineMeta('${e}','category','${o.id}')">
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </span>
      </span>`}}(t.labels||[]).forEach(o=>{const i=r.taskLabels.find(l=>l.id===o);if(i){const l=oe(i.color);s+=`<span class="inline-meta-chip" style="background:${l}20;color:${l}">
        ${A(i.name)}
        <span class="inline-meta-chip-remove" onclick="removeInlineMeta('${e}','label','${i.id}')">
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </span>
      </span>`}}),(t.people||[]).forEach(o=>{const i=r.taskPeople.find(l=>l.id===o);if(i){const l=oe(i.color);s+=`<span class="inline-meta-chip" style="background:${l}20;color:${l}">
        👤 ${A(i.name)}
        <span class="inline-meta-chip-remove" onclick="removeInlineMeta('${e}','person','${i.id}')">
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </span>
      </span>`}}),t.deferDate&&(s+=`<span class="inline-meta-chip" style="background:#8b5cf620;color:#8b5cf6">
      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>
      Defer ${Ne(t.deferDate)}
      <span class="inline-meta-chip-remove" onclick="removeInlineMeta('${e}','deferDate','')">
        <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </span>
    </span>`),t.dueDate&&(s+=`<span class="inline-meta-chip" style="background:#ef444420;color:#ef4444">
      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>
      Due ${Ne(t.dueDate)}
      <span class="inline-meta-chip-remove" onclick="removeInlineMeta('${e}','dueDate','')">
        <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </span>
    </span>`),a.innerHTML=s}function pS(e,t,n){const a=r.inlineAutocompleteMeta.get(e);a&&(t==="category"?a.areaId=null:t==="label"?a.labels=(a.labels||[]).filter(s=>s!==n):t==="person"?a.people=(a.people||[]).filter(s=>s!==n):t==="deferDate"?a.deferDate=null:t==="dueDate"&&(a.dueDate=null),r.inlineAutocompleteMeta.set(e,a),Ms(e))}function yr(e){r.inlineAutocompleteMeta.delete(e);const t=document.getElementById(e+"-chips");t&&t.remove(),document.querySelectorAll(".inline-autocomplete-popup").forEach(n=>n.remove())}function Ql(){typeof window.debouncedSaveToGithub=="function"&&window.debouncedSaveToGithub()}function hS(e){r.inlineEditingTaskId=e,window.render(),setTimeout(()=>{const t=document.getElementById("inline-edit-input");if(t){t.focus(),t.select();const n=r.tasksData.find(a=>a.id===e);n&&Xl("inline-edit-input",{initialMeta:{areaId:n.areaId||null,labels:n.labels?[...n.labels]:[],people:n.people?[...n.people]:[]}})}},100)}function eh(e){const t=document.getElementById("inline-edit-input");if(t){const n=t.value.trim();if(n){const a={title:n},s=r.inlineAutocompleteMeta.get("inline-edit-input");s&&(s.areaId!==void 0&&(a.areaId=s.areaId),s.categoryId!==void 0&&(a.categoryId=s.categoryId),s.labels&&(a.labels=s.labels),s.people&&(a.people=s.people),s.deferDate&&(a.deferDate=s.deferDate),s.dueDate&&(a.dueDate=s.dueDate)),Ia(e,a)}else Nn(e)}yr("inline-edit-input"),r.inlineEditingTaskId=null,window.render()}function th(){if(r.inlineEditingTaskId){const e=r.tasksData.find(t=>t.id===r.inlineEditingTaskId);e&&!e.title&&Nn(e.id)}yr("inline-edit-input"),r.inlineEditingTaskId=null,window.render()}function mS(e,t){e._inlineAcHandled||(e.key==="Enter"?(e.preventDefault(),eh(t)):e.key==="Escape"&&(e.preventDefault(),th()))}function gS(e,t){r.inlineEditingTaskId=t;const n=e.target;n.dataset.originalTitle=n.textContent.trim()}function vS(e,t){if(!r.inlineEditingTaskId)return;const n=e.target,a=n.textContent.trim();if(r.inlineEditingTaskId=null,a&&a!==n.dataset.originalTitle)Ia(t,{title:a}),window.render();else if(!a){const s=r.tasksData.find(o=>o.id===t);s&&!s.title?(Nn(t),window.render()):s&&s.title&&(n.textContent=s.title)}}function bS(e,t){if(e.key==="Enter"&&!e.shiftKey)e.preventDefault(),e.target.blur();else if(e.key==="Escape"){e.preventDefault();const n=e.target,a=r.tasksData.find(s=>s.id===t);if(r.inlineEditingTaskId=null,a&&!a.title){Nn(t),window.render();return}a&&(n.textContent=a.title),n.blur()}}function yS(e,t){const n=e.target,a=n.textContent||"";if(a.length>500){n.textContent=a.slice(0,500);const s=document.createRange(),o=window.getSelection();s.selectNodeContents(n),s.collapse(!1),o.removeAllRanges(),o.addRange(s)}}function wS(e){e.preventDefault();const n=(e.clipboardData||window.clipboardData).getData("text/plain").replace(/[\r\n]+/g," ").trim(),a=window.getSelection();if(a.rangeCount){const s=a.getRangeAt(0);s.deleteContents(),s.insertNode(document.createTextNode(n)),s.collapse(!1),a.removeAllRanges(),a.addRange(s)}}function xS(e){setTimeout(()=>{const t=document.querySelector(`.task-inline-title[data-task-id="${e}"]`);if(t){t.focus();const n=document.createRange(),a=window.getSelection();if(t.childNodes.length>0){const s=t.childNodes[t.childNodes.length-1];n.setStartAfter(s)}else n.setStart(t,0);n.collapse(!0),a.removeAllRanges(),a.addRange(n)}},100)}function kS(){if(r.editingTaskId=null,r.activeFilterType==="subcategory"&&r.activeCategoryFilter){const e=rt(r.activeCategoryFilter);r.newTaskContext={areaId:e?.areaId||null,categoryId:r.activeCategoryFilter,labelId:null,labelIds:null,personId:null,status:"inbox"}}else if(r.activeFilterType==="area"&&r.activeAreaFilter)r.newTaskContext={areaId:r.activeAreaFilter,categoryId:null,labelId:null,labelIds:null,personId:null,status:"inbox"};else if(r.activeFilterType==="label"&&r.activeLabelFilter)r.newTaskContext={areaId:null,labelId:r.activeLabelFilter,labelIds:null,personId:null,status:"inbox"};else if(r.activeFilterType==="person"&&r.activePersonFilter)r.newTaskContext={areaId:null,labelId:null,labelIds:null,personId:r.activePersonFilter,status:"inbox"};else if(r.activeFilterType==="perspective"){const e=r.customPerspectives.find(t=>t.id===r.activePerspective);if(e&&e.filter){const t=e.filter.status==="today"?"anytime":e.filter.status||"inbox",n=e.filter.status==="today";r.newTaskContext={areaId:e.filter.categoryId||null,labelId:null,labelIds:e.filter.labelIds||null,personId:null,status:t,today:n,flagged:e.filter.statusRule==="flagged"}}else{const t={inbox:"inbox",today:"anytime",anytime:"anytime",someday:"someday"};r.newTaskContext={areaId:null,labelId:null,labelIds:null,personId:null,status:t[r.activePerspective]||"inbox",today:r.activePerspective==="today",flagged:r.activePerspective==="flagged"}}}else r.newTaskContext={areaId:null,labelId:null,labelIds:null,personId:null,status:"inbox"};r.showTaskModal=!0,window.render(),setTimeout(()=>{const e=document.getElementById("task-title");e&&e.focus()},50)}function nh(e){const t=e.value.trim();if(!t)return;const n={status:"inbox"};if(r.activePerspective==="notes"&&(n.isNote=!0,n.status="anytime"),r.quickAddIsNote&&(n.isNote=!0,n.status="anytime"),r.activeFilterType==="subcategory"&&r.activeCategoryFilter){const s=rt(r.activeCategoryFilter);n.areaId=s?.areaId||null,n.categoryId=r.activeCategoryFilter}else if(r.activeFilterType==="area"&&r.activeAreaFilter)n.areaId=r.activeAreaFilter;else if(r.activeFilterType==="label"&&r.activeLabelFilter)n.labels=[r.activeLabelFilter];else if(r.activeFilterType==="person"&&r.activePersonFilter)n.people=[r.activePersonFilter];else if(r.activeFilterType==="perspective"&&r.activePerspective&&r.activePerspective!=="notes"){const s=r.customPerspectives.find(o=>o.id===r.activePerspective);if(s&&s.filter)s.filter.status&&(s.filter.status==="today"?(n.status="anytime",n.today=!0):n.status=s.filter.status),s.filter.categoryId&&(n.areaId=s.filter.categoryId),s.filter.labelIds&&s.filter.labelIds.length>0&&(n.labels=s.filter.labelIds),s.filter.statusRule==="flagged"&&(n.flagged=!0);else{const o={inbox:"inbox",today:"anytime",anytime:"anytime",someday:"someday",flagged:"anytime"};o[r.activePerspective]&&(n.status=o[r.activePerspective],r.activePerspective==="today"&&(n.today=!0),r.activePerspective==="flagged"&&(n.flagged=!0))}}const a=r.inlineAutocompleteMeta.get("quick-add-input");a&&(a.areaId&&(n.areaId=a.areaId),a.categoryId&&(n.categoryId=a.categoryId),a.labels&&a.labels.length&&(n.labels=[...n.labels||[],...a.labels.filter(s=>!(n.labels||[]).includes(s))]),a.people&&a.people.length&&(n.people=[...n.people||[],...a.people.filter(s=>!(n.people||[]).includes(s))]),a.deferDate&&(n.deferDate=a.deferDate),a.dueDate&&(n.dueDate=a.dueDate)),gr(t,n),e.value="",r.quickAddIsNote=!1,yr("quick-add-input"),window.render(),setTimeout(()=>{const s=document.getElementById("quick-add-input");s&&s.focus()},50)}function SS(e,t){e._inlineAcHandled||e.key==="Enter"&&(e.preventDefault(),nh(t))}function TS(){r.showInlineTagInput=!r.showInlineTagInput;const e=document.getElementById("inline-tag-form");e&&(r.showInlineTagInput?(e.innerHTML=`
        <div class="modal-inline-form flex items-center gap-2 mt-2 p-2 bg-[var(--bg-secondary)]/30 rounded-lg">
          <input type="text" id="inline-tag-name" placeholder="Tag name"
            class="modal-inline-input flex-1 px-2 py-1.5 text-sm border border-[var(--border-light)] rounded-md focus:border-[var(--accent)] focus:outline-none"
            onkeydown="if(event.key==='Enter'){event.preventDefault();addInlineTag();}">
          <input type="color" id="inline-tag-color" value="#6B7280" class="w-8 h-8 rounded-md cursor-pointer border-0">
          <button type="button" onclick="addInlineTag()" class="px-3 py-1.5 text-sm bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-dark)]">Add</button>
          <button type="button" onclick="toggleInlineTagInput()" class="px-2 py-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">&times;</button>
        </div>
      `,setTimeout(()=>document.getElementById("inline-tag-name")?.focus(),50)):e.innerHTML="")}function IS(){const e=document.getElementById("inline-tag-name")?.value?.trim(),t=document.getElementById("inline-tag-color")?.value||"#6B7280";if(e){const n=ca(e,t);r.showInlineTagInput=!1;const a=document.getElementById("task-labels-container");if(a){const s=Array.from(document.querySelectorAll(".task-label-checkbox:checked")).map(o=>o.value);s.push(n.id),a.innerHTML=r.taskLabels.map(o=>{const i=s.includes(o.id);return`
          <label class="label-checkbox flex items-center gap-1.5 px-2 py-1 rounded-md border cursor-pointer transition ${i?"bg-[var(--bg-secondary)]":"hover:bg-[var(--bg-secondary)]/50"}" style="border-color: ${oe(o.color)}">
            <input type="checkbox" value="${o.id}" ${i?"checked":""} class="task-label-checkbox rounded-sm" style="accent-color: ${oe(o.color)}">
            <span class="text-sm" style="color: ${oe(o.color)}">${A(o.name)}</span>
          </label>
        `}).join("")+`
        <button onclick="toggleInlineTagInput()" class="flex items-center gap-1 px-2 py-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50 rounded-md border border-dashed border-[var(--border-light)]">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          New
        </button>
      `}document.getElementById("inline-tag-form").innerHTML=""}}function CS(){r.showInlinePersonInput=!r.showInlinePersonInput;const e=document.getElementById("inline-person-form");e&&(r.showInlinePersonInput?(e.innerHTML=`
        <div class="modal-inline-form flex items-center gap-2 mt-2 p-2 bg-[var(--bg-secondary)]/30 rounded-lg">
          <input type="text" id="inline-person-name" placeholder="Person name"
            class="modal-inline-input flex-1 px-2 py-1.5 text-sm border border-[var(--border-light)] rounded-md focus:border-[var(--accent)] focus:outline-none"
            onkeydown="if(event.key==='Enter'){event.preventDefault();addInlinePerson();}">
          <button type="button" onclick="addInlinePerson()" class="px-3 py-1.5 text-sm bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-dark)]">Add</button>
          <button type="button" onclick="toggleInlinePersonInput()" class="px-2 py-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">&times;</button>
        </div>
      `,setTimeout(()=>document.getElementById("inline-person-name")?.focus(),50)):e.innerHTML="")}function ES(){const e=document.getElementById("inline-person-name")?.value?.trim();if(e){const t=fa(e);r.showInlinePersonInput=!1;const n=document.getElementById("task-people-container");if(n){const a=Array.from(document.querySelectorAll(".task-person-checkbox:checked")).map(s=>s.value);a.push(t.id),n.innerHTML=r.taskPeople.map(s=>{const o=a.includes(s.id);return`
          <label class="label-checkbox flex items-center gap-1.5 px-2 py-1 rounded-md border border-[var(--border-light)] cursor-pointer transition ${o?"bg-[var(--bg-secondary)] border-[var(--border)]":"hover:bg-[var(--bg-secondary)]/50"}">
            <input type="checkbox" value="${s.id}" ${o?"checked":""} class="task-person-checkbox rounded-sm">
            <span class="text-sm text-[var(--text-secondary)]">${A(s.name)}</span>
          </label>
        `}).join("")+`
        <button onclick="toggleInlinePersonInput()" class="flex items-center gap-1 px-2 py-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50 rounded-md border border-dashed border-[var(--border-light)]">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          New
        </button>
      `}document.getElementById("inline-person-form").innerHTML=""}}const jn=new Map;function Zl(){for(const[e,t]of jn)t.abort();jn.clear()}function ko(e,t,n,a,s,o,i=!1,l=null,d="Search..."){const c=document.getElementById(e),h=document.getElementById(t);if(!c||!h)return;jn.has(e)&&jn.get(e).abort();const v=new AbortController;jn.set(e,v);const f=v.signal;let p=-1;function m(y){p=y;const u=h.querySelectorAll(".autocomplete-option");u.forEach((x,k)=>x.classList.toggle("highlighted",k===p)),p>=0&&u[p]&&u[p].scrollIntoView({block:"nearest"})}function g(y=""){const u=n.filter(k=>s(k).toLowerCase().includes(y.toLowerCase()));u.length===0&&!i?h.innerHTML='<div class="autocomplete-empty">No matches found</div>':(h.innerHTML=u.map((k,E)=>`
        <div class="autocomplete-option ${E===p?"highlighted":""}"
             data-id="${k.id}" data-idx="${E}">
          ${o?o(k):""}
          <span>${A(s(k))}</span>
        </div>
      `).join(""),i&&y.trim()&&!u.some(k=>s(k).toLowerCase()===y.toLowerCase())&&(h.innerHTML+=`
          <div class="autocomplete-create" data-create="true">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Create "${A(y)}"
          </div>
        `)),h.querySelectorAll(".autocomplete-option").forEach(k=>{k.addEventListener("click",()=>{const E=n.find(D=>D.id===k.dataset.id);E&&(a(E),h.classList.remove("show"),c.value="")}),k.addEventListener("mouseenter",()=>{m(parseInt(k.dataset.idx,10))})});const x=h.querySelector(".autocomplete-create");x&&x.addEventListener("click",()=>{l&&(l(y.trim()),h.classList.remove("show"),c.value="")})}c.addEventListener("focus",()=>{g(c.value),h.classList.add("show")},{signal:f}),c.addEventListener("input",()=>{p=-1,g(c.value)},{signal:f}),c.addEventListener("keydown",y=>{const u=h.querySelectorAll(".autocomplete-option");y.key==="ArrowDown"?(y.preventDefault(),m(Math.min(p+1,u.length-1))):y.key==="ArrowUp"?(y.preventDefault(),m(Math.max(p-1,0))):y.key==="Enter"?(y.preventDefault(),p>=0&&u[p]?u[p].click():i&&c.value.trim()&&l&&(l(c.value.trim()),h.classList.remove("show"),c.value="")):y.key==="Escape"&&(y.preventDefault(),y.stopPropagation(),h.classList.remove("show"))},{signal:f}),document.addEventListener("click",y=>{if(!document.contains(c)){v.abort(),jn.delete(e);return}!c.contains(y.target)&&!h.contains(y.target)&&h.classList.remove("show")},{signal:f})}function rh(e){e?(r.modalSelectedArea=e.areaId||null,r.modalSelectedCategory=e.categoryId||null,r.modalSelectedStatus=e.status||"inbox",r.modalSelectedToday=!!e.today,r.modalSelectedFlagged=!!e.flagged,r.modalSelectedTags=[...e.labels||[]],r.modalSelectedPeople=[...e.people||[]],r.modalIsNote=e.isNote||!1,r.modalRepeatEnabled=e.repeat&&e.repeat.type!=="none",r.modalWaitingFor=e.waitingFor?{...e.waitingFor}:null,r.modalIsProject=e.isProject||!1,r.modalProjectId=e.projectId||null,r.modalProjectType=e.projectType||"parallel",r.modalTimeEstimate=e.timeEstimate||null):(r.modalSelectedArea=r.newTaskContext.areaId||null,r.modalSelectedCategory=r.newTaskContext.categoryId||null,r.modalSelectedStatus=r.newTaskContext.status||"inbox",r.modalSelectedToday=!!r.newTaskContext.today,r.modalSelectedFlagged=!!r.newTaskContext.flagged,r.modalSelectedTags=r.newTaskContext.labelIds?[...r.newTaskContext.labelIds]:r.newTaskContext.labelId?[r.newTaskContext.labelId]:[],r.modalSelectedPeople=r.newTaskContext.personId?[r.newTaskContext.personId]:[],r.modalIsNote=r.activePerspective==="notes",r.modalRepeatEnabled=!1,r.modalWaitingFor=null,r.modalIsProject=!1,r.modalProjectId=null,r.modalProjectType="parallel",r.modalTimeEstimate=null)}function $S(e){r.modalIsNote=e,document.querySelectorAll(".type-option").forEach(n=>{n.classList.toggle("active",n.dataset.type==="note"===e)});const t=document.getElementById("task-title");t&&(t.placeholder=e?"What do you want to capture?":"What needs to be done?")}function DS(e){e==="today"?(r.modalSelectedToday=!r.modalSelectedToday,r.modalSelectedToday&&r.modalSelectedStatus==="inbox"&&(r.modalSelectedStatus="anytime")):(r.modalSelectedStatus=e,(e==="inbox"||e==="someday")&&(r.modalSelectedToday=!1)),document.querySelectorAll(".status-pill").forEach(t=>{t.dataset.status==="today"?t.classList.toggle("selected",r.modalSelectedToday):t.classList.toggle("selected",t.dataset.status===r.modalSelectedStatus)})}function _S(){r.modalSelectedFlagged=!r.modalSelectedFlagged;const e=document.querySelector('.status-pill[data-status="flagged"]');e&&e.classList.toggle("selected",r.modalSelectedFlagged)}function AS(e){const t=document.getElementById(e==="defer"?"task-defer":"task-due"),n=document.getElementById(e+"-display"),a=document.getElementById(e+"-clear-btn");!t||!n||(t.value?(n.textContent=Ne(t.value),a&&a.classList.remove("hidden")):(n.textContent="None",a&&a.classList.add("hidden")))}function MS(e){const t=document.getElementById(e==="defer"?"task-defer":"task-due"),n=document.getElementById(e+"-display"),a=document.getElementById(e+"-clear-btn");t&&(t.value=""),n&&(n.textContent="None"),a&&a.classList.add("hidden")}function PS(e,t){const n=e==="defer"?"task-defer":"task-due",a=document.getElementById(n),s=document.getElementById(e+"-display"),o=document.getElementById(e+"-clear-btn");if(t===null){a&&(a.value=""),s&&(s.textContent="None"),o&&o.classList.add("hidden");return}const i=new Date;i.setHours(0,0,0,0),i.setDate(i.getDate()+t);const l=i.getFullYear(),d=String(i.getMonth()+1).padStart(2,"0"),c=String(i.getDate()).padStart(2,"0"),h=`${l}-${d}-${c}`;a&&(a.value=h),s&&(s.textContent=Ne(h)),o&&o.classList.remove("hidden")}function NS(e){const t=document.getElementById(e==="defer"?"task-defer":"task-due");t?.showPicker&&t.showPicker()}function ji(e){r.modalSelectedArea=e?e.id:null;const t=document.getElementById("area-display");t&&(t.innerHTML=e?`<span class="tag-pill" style="background: ${oe(e.color)}20; color: ${oe(e.color)}">
           ${e.emoji||'<svg style="display:inline-block;vertical-align:middle;width:14px;height:14px" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17l10 5 10-5-10-5-10 5z" opacity="0.35"/><path d="M2 12l10 5 10-5-10-5-10 5z" opacity="0.6"/><path d="M12 2L2 7l10 5 10-5L12 2z"/></svg>'} ${A(e.name)}
           <span class="tag-pill-remove" onclick="event.stopPropagation(); selectArea(null); renderAreaInput();">
             <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
           </span>
         </span>`:'<span class="text-[var(--text-muted)] text-sm">No area selected</span>'),So()}function Ps(){const e=document.getElementById("area-autocomplete-container");if(!e)return;const t=r.taskAreas.find(n=>n.id===r.modalSelectedArea);e.innerHTML=`
    <div id="area-display" class="modal-token-shell area-display-shell" onclick="document.getElementById('area-search').focus()">
      ${t?`<span class="tag-pill" style="background: ${oe(t.color)}20; color: ${oe(t.color)}">
             ${t.emoji||'<svg style="display:inline-block;vertical-align:middle;width:14px;height:14px" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17l10 5 10-5-10-5-10 5z" opacity="0.35"/><path d="M2 12l10 5 10-5-10-5-10 5z" opacity="0.6"/><path d="M12 2L2 7l10 5 10-5L12 2z"/></svg>'} ${A(t.name)}
             <span class="tag-pill-remove" onclick="event.stopPropagation(); selectArea(null); renderAreaInput();">
               <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
             </span>
           </span>`:'<span class="text-[var(--text-muted)] text-sm">No area selected</span>'}
    </div>
    <div class="autocomplete-container">
      <input type="text" id="area-search" class="autocomplete-input modal-input-enhanced" placeholder="Search areas...">
      <svg class="autocomplete-icon w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      <div id="area-dropdown" class="autocomplete-dropdown"></div>
    </div>
  `,ko("area-search","area-dropdown",r.taskAreas,n=>{ji(n),Ps()},n=>n.name,n=>`<div class="autocomplete-option-icon" style="background: ${oe(n.color)}20; color: ${oe(n.color)}">${n.emoji||'<svg style="width:16px;height:16px" viewBox="0 0 24 24" fill="currentColor"><path d="M2 6a2 2 0 012-2h5.586a1 1 0 01.707.293L12 6h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" opacity="0.35"/><rect x="2" y="9" width="20" height="11" rx="2"/></svg>'}</div>`,!0,n=>{const a=new Date().toISOString(),s={id:"cat_"+Date.now(),name:n,color:"#6366f1",icon:"📁",createdAt:a,updatedAt:a};r.taskAreas.push(s),localStorage.setItem(Qt,JSON.stringify(r.taskAreas)),Ql(),ji(s),Ps()})}function ah(e){r.modalSelectedCategory=e?e.id:null;const t=document.getElementById("category-display");t&&(t.innerHTML=e?`<span class="tag-pill" style="background: ${oe(e.color)}20; color: ${oe(e.color)}">
           📂 ${A(e.name)}
           <span class="tag-pill-remove" onclick="event.stopPropagation(); selectCategory(null); renderCategoryInput();">
             <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
           </span>
         </span>`:'<span class="text-[var(--text-muted)] text-sm">No category selected</span>')}function So(){const e=document.getElementById("category-autocomplete-container");if(!e)return;const t=r.modalSelectedArea?Jr(r.modalSelectedArea):r.taskCategories;if(r.modalSelectedCategory&&r.modalSelectedArea){const a=rt(r.modalSelectedCategory);a&&a.areaId!==r.modalSelectedArea&&(r.modalSelectedCategory=null)}const n=r.modalSelectedCategory?rt(r.modalSelectedCategory):null;if(t.length===0&&!n){e.innerHTML="";return}e.innerHTML=`
    <div id="category-display" class="modal-token-shell area-display-shell" onclick="document.getElementById('category-search')?.focus()">
      ${n?`<span class="tag-pill" style="background: ${oe(n.color)}20; color: ${oe(n.color)}">
             📂 ${A(n.name)}
             <span class="tag-pill-remove" onclick="event.stopPropagation(); selectCategory(null); renderCategoryInput();">
               <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
             </span>
           </span>`:'<span class="text-[var(--text-muted)] text-sm">No category selected</span>'}
    </div>
    <div class="autocomplete-container">
      <input type="text" id="category-search" class="autocomplete-input modal-input-enhanced" placeholder="Search categories...">
      <svg class="autocomplete-icon w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
      <div id="category-dropdown" class="autocomplete-dropdown"></div>
    </div>
  `,ko("category-search","category-dropdown",t,a=>{ah(a),So()},a=>a.name,a=>`<div class="autocomplete-option-icon" style="background: ${oe(a.color)}20; color: ${oe(a.color)}">📂</div>`,!1)}function Fi(e){r.modalSelectedTags.includes(e.id)||(r.modalSelectedTags.push(e.id),To())}function LS(e){r.modalSelectedTags=r.modalSelectedTags.filter(t=>t!==e),To()}function To(){const e=document.getElementById("tags-input-container");if(!e)return;const t=r.modalSelectedTags.map(n=>r.taskLabels.find(a=>a.id===n)).filter(Boolean);e.innerHTML=`
    <div class="modal-token-shell">
      <div class="tag-input-container" onclick="document.getElementById('tags-search').focus()">
        ${t.map(n=>`
          <span class="tag-pill" style="background: ${oe(n.color)}20; color: ${oe(n.color)}">
            ${A(n.name)}
            <span class="tag-pill-remove" onclick="event.stopPropagation(); removeTag('${n.id}');">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </span>
          </span>
        `).join("")}
        <input type="text" id="tags-search" class="tag-input-field" placeholder="${t.length?"":"Add tags..."}">
      </div>
    </div>
    <div id="tags-dropdown" class="autocomplete-dropdown"></div>
  `,ko("tags-search","tags-dropdown",r.taskLabels.filter(n=>!r.modalSelectedTags.includes(n.id)),n=>Fi(n),n=>n.name,n=>`<div class="w-3 h-3 rounded-full" style="background: ${oe(n.color)}"></div>`,!0,n=>{const a=[De("--danger")||"#ef4444",De("--warning")||"#f59e0b",De("--success")||"#22c55e",De("--accent")||"#3b82f6",De("--notes-accent")||"#8b5cf6","#ec4899"],s=new Date().toISOString(),o={id:"label_"+Date.now(),name:n,color:a[Math.floor(Math.random()*a.length)],createdAt:s,updatedAt:s};r.taskLabels.push(o),localStorage.setItem(Zt,JSON.stringify(r.taskLabels)),Ql(),Fi(o)})}function Hi(e){r.modalSelectedPeople.includes(e.id)||(r.modalSelectedPeople.push(e.id),Io())}function OS(e){r.modalSelectedPeople=r.modalSelectedPeople.filter(t=>t!==e),Io()}function Io(){const e=document.getElementById("people-input-container");if(!e)return;const t=r.modalSelectedPeople.map(n=>r.taskPeople.find(a=>a.id===n)).filter(Boolean);e.innerHTML=`
    <div class="modal-token-shell">
      <div class="tag-input-container" onclick="document.getElementById('people-search').focus()">
        ${t.map(n=>`
          <span class="tag-pill" style="background: var(--accent-light); color: var(--accent)">
            ${n.photoData?`<img src="${n.photoData}" alt="" style="width:16px;height:16px" class="rounded-full object-cover" referrerpolicy="no-referrer">`:'<svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'}
            ${A(n.name)}
            <span class="tag-pill-remove" onclick="event.stopPropagation(); removePersonModal('${n.id}');">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </span>
          </span>
        `).join("")}
        <input type="text" id="people-search" class="tag-input-field" placeholder="${t.length?"":"Add people..."}">
      </div>
    </div>
    <div id="people-dropdown" class="autocomplete-dropdown"></div>
  `,ko("people-search","people-dropdown",r.taskPeople.filter(n=>!r.modalSelectedPeople.includes(n.id)),n=>Hi(n),n=>n.name,n=>n?.photoData?`<div class="autocomplete-option-icon"><img src="${n.photoData}" alt="" style="width:20px;height:20px" class="rounded-full object-cover" referrerpolicy="no-referrer"></div>`:'<div class="autocomplete-option-icon bg-[var(--bg-secondary)]"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>',!0,n=>{const a=new Date().toISOString(),s={id:"person_"+Date.now(),name:n,email:"",createdAt:a,updatedAt:a};r.taskPeople.push(s),localStorage.setItem(en,JSON.stringify(r.taskPeople)),Ql(),Hi(s)})}function RS(){r.modalRepeatEnabled=!r.modalRepeatEnabled;const e=document.querySelector(".repeat-toggle"),t=document.querySelector(".repeat-config");e&&e.classList.toggle("active",r.modalRepeatEnabled),t&&t.classList.toggle("show",r.modalRepeatEnabled)}function BS(){setTimeout(()=>{Ps(),So(),To(),Io(),Ns(),$a(),ed(),document.querySelectorAll(".status-pill").forEach(n=>{n.dataset.status==="today"?n.classList.toggle("selected",r.modalSelectedToday):n.dataset.status==="flagged"?n.classList.toggle("selected",r.modalSelectedFlagged):n.classList.toggle("selected",n.dataset.status===r.modalSelectedStatus)}),document.querySelectorAll(".type-option").forEach(n=>{n.classList.toggle("active",n.dataset.type==="note"===r.modalIsNote)});const e=document.getElementById("task-title");e&&e.focus(),Xl("task-title",{isModal:!0});const t=document.getElementById("task-notes");if(t&&t.value&&(t.style.height="auto",t.style.height=t.scrollHeight+"px"),Pe()){const n=document.querySelector(".modal-body-enhanced");n&&n.querySelectorAll("input, textarea, select").forEach(a=>{a.addEventListener("focus",()=>{setTimeout(()=>a.scrollIntoView({block:"center",behavior:"smooth"}),300)})})}},50)}function jS(){if(yr("task-title"),Zl(),r.editingTaskId){const e=r.tasksData.find(t=>t.id===r.editingTaskId);e&&!e.title&&Nn(r.editingTaskId)}if(Pe()){const e=document.querySelector(".modal-overlay");if(e){e.classList.add("sheet-dismissing"),setTimeout(()=>{r.showTaskModal=!1,r.editingTaskId=null,r.modalStateInitialized=!1,window.render()},350);return}}r.showTaskModal=!1,r.editingTaskId=null,r.modalStateInitialized=!1,window.render()}function FS(){const e=document.getElementById("task-title").value.trim();if(!e){alert("Please enter a title");return}let t=null;if(r.modalRepeatEnabled){const s=document.getElementById("task-repeat-type")?.value||"daily",o=document.querySelector('input[name="repeat-from"]:checked')?.value||"completion";t={type:s,interval:parseInt(document.getElementById("task-repeat-interval")?.value)||1,from:o}}let n=document.getElementById("task-defer")?.value||null;const a={title:e,notes:document.getElementById("task-notes")?.value.trim()||"",status:r.modalSelectedStatus,today:r.modalSelectedToday,flagged:r.modalSelectedFlagged,areaId:r.modalSelectedArea,categoryId:r.modalSelectedCategory||null,deferDate:n,dueDate:document.getElementById("task-due")?.value||null,repeat:t,labels:r.modalSelectedTags,people:r.modalSelectedPeople,isNote:r.modalIsNote,waitingFor:r.modalWaitingFor,isProject:r.modalIsProject,projectId:r.modalProjectId,projectType:r.modalProjectType,timeEstimate:r.modalTimeEstimate};if(!r.modalIsNote&&a.status==="inbox"&&a.areaId&&(a.status="anytime"),!r.modalIsNote&&a.status==="inbox"&&a.today&&(a.status="anytime"),r.editingTaskId?Ia(r.editingTaskId,a):gr(e,a),yr("task-title"),Zl(),Pe()){const s=document.querySelector(".modal-overlay");if(s){s.classList.add("sheet-dismissing"),setTimeout(()=>{r.showTaskModal=!1,r.editingTaskId=null,r.modalStateInitialized=!1,window.render()},350);return}}r.showTaskModal=!1,r.editingTaskId=null,r.modalStateInitialized=!1,window.render()}function sh(e,t="",n=7){if(!e){r.modalWaitingFor=null,Ns();return}const a=new Date;a.setDate(a.getDate()+n);const s=a.getFullYear(),o=String(a.getMonth()+1).padStart(2,"0"),i=String(a.getDate()).padStart(2,"0");r.modalWaitingFor={personId:e,description:t,followUpDate:`${s}-${o}-${i}`},Ns()}function Ns(){const e=document.getElementById("waiting-for-container");if(!e)return;const t=r.editingTaskId?r.tasksData.find(a=>a.id===r.editingTaskId):null,n=r.modalWaitingFor||t?.waitingFor||null;if(!n)e.innerHTML=`
      <div class="flex items-center gap-2">
        <button type="button" onclick="toggleWaitingForForm()" class="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          Mark as Waiting For
        </button>
      </div>
      <div id="waiting-for-form" class="hidden"></div>
    `;else{const a=r.taskPeople.find(i=>i.id===n.personId),s=a?a.name:"Unknown",o=n.followUpDate?Ne(n.followUpDate):"No follow-up set";e.innerHTML=`
      <div class="flex items-start gap-3 p-3 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-lg">
        <svg class="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-[var(--text-primary)]">Waiting for ${A(s)}</div>
          ${n.description?`<div class="text-sm text-[var(--text-secondary)] mt-0.5">${A(n.description)}</div>`:""}
          <div class="text-xs text-[var(--text-muted)] mt-1">Follow up: ${o}</div>
        </div>
        <button type="button" onclick="setWaitingFor(null)" class="flex-shrink-0 p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded transition">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
    `}}function HS(){const e=document.getElementById("waiting-for-form");e&&(e.classList.contains("hidden")?(e.classList.remove("hidden"),e.innerHTML=`
      <div class="mt-3 p-3 bg-[var(--bg-secondary)]/30 rounded-lg space-y-3">
        <div>
          <label class="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Person</label>
          <select id="waiting-person-select" class="input-field mt-1">
            <option value="">Select person...</option>
            ${r.taskPeople.map(t=>`<option value="${t.id}">${A(t.name)}</option>`).join("")}
          </select>
        </div>
        <div>
          <label class="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">What are you waiting for? (Optional)</label>
          <input type="text" id="waiting-description-input" placeholder="e.g., Budget approval, Design review..." class="modal-input-enhanced mt-1">
        </div>
        <div>
          <label class="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Follow up in</label>
          <div class="flex gap-2 mt-1">
            <button type="button" onclick="applyWaitingFor(3)" class="date-quick-pill">3 days</button>
            <button type="button" onclick="applyWaitingFor(7)" class="date-quick-pill">7 days</button>
            <button type="button" onclick="applyWaitingFor(14)" class="date-quick-pill">14 days</button>
          </div>
        </div>
        <div class="flex gap-2 pt-2">
          <button type="button" onclick="applyWaitingFor(7)" class="flex-1 px-3 py-2 text-sm bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-dark)] transition">Set Waiting</button>
          <button type="button" onclick="toggleWaitingForForm()" class="px-3 py-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition">Cancel</button>
        </div>
      </div>
    `,setTimeout(()=>document.getElementById("waiting-person-select")?.focus(),50)):(e.classList.add("hidden"),e.innerHTML=""))}function zS(e=7){const t=document.getElementById("waiting-person-select")?.value,n=document.getElementById("waiting-description-input")?.value?.trim()||"";if(!t){alert("Please select a person to wait for");return}sh(t,n,e);const a=document.getElementById("waiting-for-form");a&&(a.classList.add("hidden"),a.innerHTML="")}function WS(){r.modalIsProject=!r.modalIsProject,$a()}function US(e){e!=="sequential"&&e!=="parallel"||(r.modalProjectType=e,$a())}function GS(e){r.modalProjectId=e,$a()}function $a(){const e=document.getElementById("project-container");if(!e)return;const t=r.editingTaskId?r.tasksData.find(c=>c.id===r.editingTaskId):null,n=r.modalIsProject||t?.isProject||!1,a=r.modalProjectId||t?.projectId||null,s=r.modalProjectType||t?.projectType||"parallel",o=r.tasksData.filter(c=>c.isProject&&!c.completed&&(!t||c.id!==t.id)),i=o.length>0,l=a?r.tasksData.find(c=>c.id===a):null;let d=`
    <div class="space-y-3">
      <!-- Mark as Project checkbox -->
      <label class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" ${n?"checked":""}
          onchange="toggleProjectMode()"
          class="rounded border-[var(--border)] text-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20">
        <span class="text-sm font-medium text-[var(--text-primary)]">Mark as multi-step project</span>
      </label>

      ${n?`
        <!-- Project Type -->
        <div class="ml-6 p-3 bg-[var(--bg-secondary)]/30 rounded-lg space-y-2">
          <label class="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Project Type</label>
          <div class="flex gap-2">
            <button onclick="setProjectType('parallel')"
              class="flex-1 px-3 py-2 text-sm rounded-lg transition ${s==="parallel"?"bg-[var(--accent)] text-white":"bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"}">
              📋 Parallel
            </button>
            <button onclick="setProjectType('sequential')"
              class="flex-1 px-3 py-2 text-sm rounded-lg transition ${s==="sequential"?"bg-[var(--accent)] text-white":"bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"}">
              📝 Sequential
            </button>
          </div>
          <p class="text-xs text-[var(--text-muted)] mt-1">
            ${s==="sequential"?"Tasks must be done in order":"Tasks can be done in any order"}
          </p>
        </div>
      `:""}

      ${i&&!n?`
        <!-- Link to Project -->
        <div class="space-y-2">
          <label class="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Link to Project</label>
          <select onchange="linkToProject(this.value || null)" class="input-field">
            <option value="">No project (standalone task)</option>
            ${o.map(c=>`
              <option value="${c.id}" ${a===c.id?"selected":""}>
                ${A(c.title)}
              </option>
            `).join("")}
          </select>
          ${l?`
            <p class="text-xs text-[var(--text-muted)]">
              This task belongs to project: <strong>${A(l.title)}</strong>
            </p>
          `:""}
        </div>
      `:""}
    </div>
  `;e.innerHTML=d}function VS(e){r.modalTimeEstimate=e,ed()}function ed(){const e=document.getElementById("time-estimate-container");if(!e)return;const t=r.modalTimeEstimate;let a=`
    <div class="space-y-2">
      <label class="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Time Estimate</label>
      <div class="flex gap-2">
        <button onclick="setTimeEstimate(null)"
          class="flex-1 px-3 py-2 text-xs rounded-lg transition ${t===null?"bg-[var(--bg-secondary)] border-2 border-[var(--accent)]":"bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border)]"}">
          None
        </button>
        ${[5,15,30,60].map(s=>`
          <button onclick="setTimeEstimate(${s})"
            class="flex-1 px-3 py-2 text-xs rounded-lg transition ${t===s?"bg-[var(--accent)] text-white":"bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border)]"}">
            ${s}m
          </button>
        `).join("")}
      </div>
      ${t?`
        <p class="text-xs text-[var(--text-muted)]">
          ⏱️ Estimated duration: ${t} minute${t>1?"s":""}
        </p>
      `:`
        <p class="text-xs text-[var(--text-muted)]">
          Set time estimate for time-blocking and filtering
        </p>
      `}
    </div>
  `;e.innerHTML=a}function qS(){const e=ve(),t=r.editingTaskId?r.tasksData.find(n=>n.id===r.editingTaskId):null;return r.showTaskModal&&!r.modalStateInitialized&&(rh(t),r.modalStateInitialized=!0),r.showTaskModal?`
    <div class="modal-overlay fixed inset-0 bg-[var(--modal-overlay)] backdrop-blur-sm flex items-end md:items-center justify-center z-[300]" onclick="if(event.target===this){closeTaskModal()}" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
      <div class="modal-enhanced w-full max-w-xl mx-4" onclick="event.stopPropagation()">
        <div class="sheet-handle md:hidden"></div>
        <!-- Header -->
        <div class="modal-header-enhanced">
          <div class="flex items-center gap-4">
            <h3 id="task-modal-title" class="text-lg font-semibold text-[var(--text-primary)]">${t?"Edit":"New"}</h3>
            <div class="type-switcher">
              <div class="type-option ${r.modalIsNote?"":"active"}" data-type="task" onclick="setModalType(false)">
                <svg class="inline-block mr-1.5 w-4 h-4 -mt-px" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6"/></svg>Task
              </div>
              <div class="type-option ${r.modalIsNote?"active":""}" data-type="note" onclick="setModalType(true)">
                <svg class="inline-block mr-1.5 w-4 h-4 -mt-px" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="5"/></svg>Note
              </div>
            </div>
          </div>
          <button onclick="closeTaskModal()" aria-label="Close dialog" class="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body-enhanced">
          <!-- Title -->
          <div class="modal-section">
            <input type="text" id="task-title" value="${A(t?.title||"")}"
              placeholder="${r.modalIsNote?"What do you want to capture?":"What needs to be done?"}"
              maxlength="500"
              onkeydown="if(event._inlineAcHandled)return;if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();saveTaskFromModal();}"
              class="modal-input-enhanced title-input">
            <div class="modal-hint-row">
              <span class="modal-hint-chip"># Area</span>
              <span class="modal-hint-chip">@ Tag</span>
              <span class="modal-hint-chip">&amp; Person</span>
              <span class="modal-hint-chip">! Defer</span>
              <span class="modal-hint-text">Enter to save • Cmd/Ctrl+Enter from notes</span>
            </div>
          </div>

          <!-- Notes/Details -->
          <div class="modal-section">
            <label class="modal-section-label">Notes</label>
            <textarea id="task-notes" placeholder="Add details, links, or context..."
              onkeydown="if((event.metaKey||event.ctrlKey)&&event.key==='Enter'){event.preventDefault();saveTaskFromModal();}"
              oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'"
              class="modal-textarea-enhanced">${A(t?.notes||"")}</textarea>
          </div>

          <hr class="modal-divider">

          <!-- When (Status Pills) - Tasks only -->
          ${r.modalIsNote?"":`
          <div class="modal-section">
            <label class="modal-section-label">When</label>
            <div class="status-pills">
              <div class="status-pill ${r.modalSelectedStatus==="inbox"?"selected":""}" data-status="inbox" onclick="setModalStatus('inbox')">
                <span class="status-icon">${e.inbox.replace("w-5 h-5","w-4 h-4")}</span>Inbox
              </div>
              <div class="status-pill ${r.modalSelectedToday?"selected":""}" data-status="today" onclick="setModalStatus('today')">
                <span class="status-icon">${e.today.replace("w-5 h-5","w-4 h-4")}</span>Today
              </div>
              <div class="status-pill ${r.modalSelectedFlagged?"selected":""}" data-status="flagged" onclick="toggleModalFlagged()">
                <span class="status-icon">${e.flagged.replace("w-5 h-5","w-4 h-4")}</span>Flag
              </div>
              <div class="status-pill ${r.modalSelectedStatus==="anytime"?"selected":""}" data-status="anytime" onclick="setModalStatus('anytime')">
                <span class="status-icon">${e.anytime.replace("w-5 h-5","w-4 h-4")}</span>Anytime
              </div>
              <div class="status-pill ${r.modalSelectedStatus==="someday"?"selected":""}" data-status="someday" onclick="setModalStatus('someday')">
                <span class="status-icon">${e.someday.replace("w-5 h-5","w-4 h-4")}</span>Someday
              </div>
            </div>
          </div>
          `}

          <!-- Area (Autocomplete) -->
          <div class="modal-section">
            <label class="modal-section-label">Area</label>
            <div id="area-autocomplete-container"></div>
          </div>

          <!-- Category (Sub-area, Autocomplete) -->
          <div class="modal-section" id="category-section">
            <label class="modal-section-label">Category</label>
            <div id="category-autocomplete-container"></div>
          </div>

          <!-- Dates - Tasks only -->
          ${r.modalIsNote?"":`
          <div class="modal-section">
            <label class="modal-section-label">Schedule</label>
            <!-- Defer Until -->
            <div class="date-row" onclick="openDatePicker('defer')">
              <svg class="date-row-icon w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5V19L19 12z"/></svg>
              <div class="flex-1 min-w-0">
                <div class="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Defer Until</div>
                <div class="text-sm text-[var(--text-primary)]" id="defer-display">${t?.deferDate?Ne(t.deferDate):"None"}</div>
              </div>
              <input type="date" id="task-defer" value="${t?.deferDate||""}"
                class="sr-only" onchange="updateDateDisplay('defer')">
              <button type="button" class="date-row-clear ${t?.deferDate?"":"hidden"}" id="defer-clear-btn"
                onclick="event.stopPropagation(); clearDateField('defer')">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>
            <div class="date-quick-row">
              <button type="button" class="date-quick-pill" onclick="event.stopPropagation(); setQuickDate('defer', 0)">Today</button>
              <button type="button" class="date-quick-pill" onclick="event.stopPropagation(); setQuickDate('defer', 1)">Tomorrow</button>
              <button type="button" class="date-quick-pill" onclick="event.stopPropagation(); setQuickDate('defer', 7)">Next Week</button>
              <button type="button" class="date-quick-pill ghost" onclick="event.stopPropagation(); setQuickDate('defer', null)">Clear</button>
            </div>
            <!-- Due -->
            <div class="date-row" onclick="openDatePicker('due')">
              <svg class="date-row-icon w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5z"/></svg>
              <div class="flex-1 min-w-0">
                <div class="text-[11px] font-medium uppercase tracking-wide text-[var(--text-muted)]">Due</div>
                <div class="text-sm text-[var(--text-primary)]" id="due-display">${t?.dueDate?Ne(t.dueDate):"None"}</div>
              </div>
              <input type="date" id="task-due" value="${t?.dueDate||""}"
                class="sr-only" onchange="updateDateDisplay('due')">
              <button type="button" class="date-row-clear ${t?.dueDate?"":"hidden"}" id="due-clear-btn"
                onclick="event.stopPropagation(); clearDateField('due')">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>
            <div class="date-quick-row">
              <button type="button" class="date-quick-pill" onclick="event.stopPropagation(); setQuickDate('due', 0)">Today</button>
              <button type="button" class="date-quick-pill" onclick="event.stopPropagation(); setQuickDate('due', 1)">Tomorrow</button>
              <button type="button" class="date-quick-pill" onclick="event.stopPropagation(); setQuickDate('due', 7)">Next Week</button>
              <button type="button" class="date-quick-pill ghost" onclick="event.stopPropagation(); setQuickDate('due', null)">Clear</button>
            </div>
          </div>

          <!-- Repeat - Tasks only -->
          <div class="modal-section">
            <label class="modal-section-label">Repeat</label>
            <div class="repeat-toggle ${r.modalRepeatEnabled?"active":""}" onclick="toggleRepeat()">
              <svg class="w-5 h-5 ${r.modalRepeatEnabled?"text-[var(--accent)]":"text-[var(--text-muted)]"}" viewBox="0 0 24 24" fill="currentColor"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8A5.87 5.87 0 0 1 6 12c0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg>
              <span class="text-sm font-medium ${r.modalRepeatEnabled?"text-[var(--accent)]":"text-[var(--text-secondary)]"}">${r.modalRepeatEnabled?"Repeating":"Does not repeat"}</span>
            </div>
            <div class="repeat-config ${r.modalRepeatEnabled?"show":""}">
              <div class="flex items-center gap-3">
                <span class="text-sm text-[var(--text-secondary)]">Every</span>
                <input type="number" id="task-repeat-interval" min="1" value="${t?.repeat?.interval||1}"
                  class="input-field w-16 text-center">
                <select id="task-repeat-type" class="input-field">
                  <option value="daily" ${t?.repeat?.type==="daily"?"selected":""}>days</option>
                  <option value="weekly" ${t?.repeat?.type==="weekly"?"selected":""}>weeks</option>
                  <option value="monthly" ${t?.repeat?.type==="monthly"?"selected":""}>months</option>
                  <option value="yearly" ${t?.repeat?.type==="yearly"?"selected":""}>years</option>
                </select>
              </div>
              <div class="flex gap-4 mt-3">
                <label class="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" name="repeat-from" value="completion" ${!t?.repeat?.from||t?.repeat?.from==="completion"?"checked":""} class="accent-[var(--accent)]">
                  <span class="text-[var(--text-secondary)]">After completion</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer text-sm">
                  <input type="radio" name="repeat-from" value="due" ${t?.repeat?.from==="due"?"checked":""} class="accent-[var(--accent)]">
                  <span class="text-[var(--text-secondary)]">From due date</span>
                </label>
              </div>
            </div>
          </div>
          `}

          <hr class="modal-divider">

          <!-- Tags (Autocomplete) -->
          <div class="modal-section">
            <label class="modal-section-label">Tags</label>
            <div id="tags-input-container"></div>
          </div>

          <!-- People (Autocomplete) -->
          <div class="modal-section">
            <label class="modal-section-label">People</label>
            <div id="people-input-container"></div>
          </div>

          <!-- Waiting For (GTD) - Tasks only -->
          ${r.modalIsNote?"":`
          <div class="modal-section">
            <label class="modal-section-label">Waiting For</label>
            <div id="waiting-for-container"></div>
          </div>
          `}

          <!-- Project Support (GTD) - Tasks only -->
          ${r.modalIsNote?"":`
          <div class="modal-section">
            <label class="modal-section-label">Project</label>
            <div id="project-container"></div>
          </div>
          `}

          <!-- Time Estimate (GTD) - Tasks only -->
          ${r.modalIsNote?"":`
          <div class="modal-section">
            <label class="modal-section-label">Time Estimate</label>
            <div id="time-estimate-container"></div>
          </div>
          `}
        </div>

        ${t?.meetingEventKey?`
          <div class="px-5 py-3 border-t border-[var(--border-light)] bg-[var(--bg-secondary)]/35">
            <button
              onclick="closeTaskModal(); openCalendarMeetingNotesByEventKey('${we(t.meetingEventKey)}')"
              class="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition">
              <svg class="w-4 h-4 text-[var(--accent)]" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v13a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 15H5V10h14v9zM7 12h5v5H7z"/></svg>
              Back To Meeting Notes
            </button>
          </div>
        `:""}

        <!-- Footer -->
        <div class="modal-footer-enhanced">
          <button onclick="closeTaskModal()"
            class="px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition">
            Cancel
          </button>
          <button onclick="saveTaskFromModal()" class="sb-btn px-5 py-2.5 rounded-lg text-sm font-medium">
            ${t?"Save Changes":"Create"}
          </button>
        </div>
      </div>
    </div>
  `:""}function Lt(e,t){const n=document.getElementById(e);if(!n)return!1;n.style.borderColor="var(--danger)",n.style.boxShadow="0 0 0 3px color-mix(in srgb, var(--danger) 15%, transparent)";const a=n.parentElement.querySelector(".field-error-msg");a&&a.remove();const s=document.createElement("p");s.className="field-error-msg",s.style.cssText="color: var(--danger); font-size: 12px; margin-top: 4px; font-weight: 500;",s.textContent=t,n.insertAdjacentElement("afterend",s),n.focus();const o=()=>{n.style.borderColor="",n.style.boxShadow="";const i=n.parentElement.querySelector(".field-error-msg");i&&i.remove(),n.removeEventListener("input",o)};return n.addEventListener("input",o),!1}function KS(){const e=document.getElementById("area-name").value.trim(),t=document.getElementById("area-emoji")?.value?.trim()||"",n=document.getElementById("area-color")?.value||"#6366F1";if(!e)return Lt("area-name","Please enter an area name");if(r.taskAreas.find(s=>s.id!==r.editingAreaId&&s.name.toLowerCase()===e.toLowerCase()))return Lt("area-name","An area with this name already exists");if(r.editingAreaId)di(r.editingAreaId,{name:e,emoji:t,color:n});else{const s=Ys(e,t);n!==s.color&&di(s.id,{color:n})}r.showAreaModal=!1,r.editingAreaId=null,r.pendingAreaEmoji="",window.render()}function YS(){const e=document.getElementById("category-name")?.value?.trim(),t=document.getElementById("category-area")?.value,n=document.getElementById("category-color")?.value||"#6366F1",a=document.getElementById("category-emoji")?.value?.trim()||"";if(!e)return Lt("category-name","Please enter a name");if(!t)return Lt("category-area","Please select an area");if(r.editingCategoryId)ci(r.editingCategoryId,{name:e,areaId:t,color:n,emoji:a});else{const s=Kc(e,t,a);n!==s.color&&ci(s.id,{color:n})}r.showCategoryModal=!1,r.editingCategoryId=null,r.pendingCategoryEmoji="",window.render()}function JS(){const e=document.getElementById("label-name").value.trim();if(!e)return Lt("label-name","Please enter a tag name");if(r.taskLabels.find(a=>a.id!==r.editingLabelId&&a.name.toLowerCase()===e.toLowerCase()))return Lt("label-name","A label with this name already exists");const n=document.getElementById("label-color").value;r.editingLabelId?Yc(r.editingLabelId,{name:e,color:n}):ca(e,n),r.showLabelModal=!1,r.editingLabelId=null,window.render()}function XS(){const e=document.getElementById("person-name").value.trim(),t=document.getElementById("person-email").value.trim();if(!e)return Lt("person-name","Please enter a name");if(r.taskPeople.find(a=>a.id!==r.editingPersonId&&a.name.toLowerCase()===e.toLowerCase()))return Lt("person-name","A person with this name already exists");r.editingPersonId?Jc(r.editingPersonId,{name:e,email:t}):fa(e,t),r.showPersonModal=!1,r.editingPersonId=null,window.render()}function QS(){const e=document.getElementById("perspective-name").value.trim();if(!e)return Lt("perspective-name","Please enter a perspective name");const t=document.getElementById("perspective-icon").value||"📌",n={},a=document.getElementById("perspective-logic")?.value||"all";n.logic=a;const s=document.getElementById("perspective-category").value;s&&(n.categoryId=s);const o=document.getElementById("perspective-status").value;o&&(n.status=o);const i=document.getElementById("perspective-availability")?.value;i&&(n.availability=i);const l=document.getElementById("perspective-status-rule")?.value;l&&(n.statusRule=l);const d=document.getElementById("perspective-person")?.value;d&&(n.personId=d);const c=document.getElementById("perspective-tags-mode")?.value||"any";n.tagMatch=c;const h=Array.from(document.querySelectorAll(".perspective-tag-checkbox:checked")).map(g=>g.value);h.length>0&&(n.labelIds=h),document.getElementById("perspective-due").checked&&(n.hasDueDate=!0),document.getElementById("perspective-defer").checked&&(n.hasDeferDate=!0),document.getElementById("perspective-repeat").checked&&(n.isRepeating=!0),document.getElementById("perspective-untagged").checked&&(n.isUntagged=!0),document.getElementById("perspective-inbox").checked&&(n.inboxOnly=!0);const v=document.getElementById("perspective-range-type")?.value||"either",f=document.getElementById("perspective-range-start")?.value||"",p=document.getElementById("perspective-range-end")?.value||"";(f||p)&&(n.dateRange={type:v,start:f||null,end:p||null});const m=document.getElementById("perspective-search")?.value?.trim()||"";if(m&&(n.searchTerms=m),r.editingPerspectiveId){const g=r.customPerspectives.findIndex(y=>y.id===r.editingPerspectiveId);g!==-1&&(r.customPerspectives[g]={...r.customPerspectives[g],name:e,icon:t,filter:n,updatedAt:new Date().toISOString()},le()),r.activePerspective=r.editingPerspectiveId}else Pp(e,t,n),r.activePerspective=r.customPerspectives[r.customPerspectives.length-1].id;r.showPerspectiveModal=!1,r.editingPerspectiveId=null,r.pendingPerspectiveEmoji="",window.render()}function ZS(e){r.pendingPerspectiveEmoji=e,r.perspectiveEmojiPickerOpen=!1,r.emojiSearchQuery="";const t=document.getElementById("perspective-icon"),n=document.getElementById("perspective-icon-display");t&&(t.value=e),n&&(n.textContent=e);const a=document.querySelector(".emoji-picker-dropdown");a&&a.remove()}function e4(e){r.pendingAreaEmoji=e,r.areaEmojiPickerOpen=!1,r.emojiSearchQuery="";const t=document.getElementById("area-emoji"),n=document.getElementById("area-folder-preview");t&&(t.value=e),n&&(n.textContent=e);const a=document.querySelector(".emoji-picker-dropdown");a&&a.remove()}function t4(e){r.pendingCategoryEmoji=e,r.categoryEmojiPickerOpen=!1,r.emojiSearchQuery="";const t=document.getElementById("category-emoji"),n=document.getElementById("cat-folder-preview");t&&(t.value=e),n&&(n.textContent=e);const a=document.querySelector(".emoji-picker-dropdown");a&&a.remove()}const n4={Smileys:"😀😃😄😁😆😅🤣😂🙂😉😊😇🥰😍🤩😘😚🤔🤨😐😑😶🙄😏😒😞😢😭😤🤯😱😨🥵🥶",Objects:"📌📋📅📊🔍💡🔔⭐🌟🔥❤️💎🏆🎖️🎯🚀✈️📦📧✉️📝📓📖📚💻📱⌨️🖥️🎨🎵🎬📷🎮⚽🏀",Nature:"🌳🌲🌿☘️🍀🌺🌹🌻🌼🌷🌞🌙⭐⚡🌈❄️💧🌊🔥🌾🍃🍂🍁🐝🦋",Food:"🍎🍊🍋🍌🍉🍇🍓🫐🍑🍒🥝🍅🥑🍕🍔🌮🍜🍣🍰☕🍺🥤🍷",People:"👤👥👨‍💻👩‍💻👨‍🔬👩‍🔬👨‍🏫👩‍🏫🧑‍💼🧑‍🔧🧑‍🎨👷🦸🦹🧙",Places:"🏠🏢🏭🏫🏥🏪🏨⛪🕌🕍🏟️🏔️🏖️🌅🌄🌃✈️🚀🚂🚗",Symbols:"✅❌❗❓⚠️♻️🔄↕️↔️▶️⏸️⏹️🔀🔁🔂➕➖✖️➗🟰🟱🟢🟡🟠🔴🟣🟤⚫⚪🔵🟦"},r4={happy:"😀😃😄😁😆😊",sad:"😞😢😭",angry:"😤",love:"🥰😍❤️",heart:"❤️🥰😍",star:"⭐🌟",fire:"🔥",sun:"🌞🌅🌄",moon:"🌙",rain:"💧🌊",snow:"❄️",tree:"🌳🌲",flower:"🌺🌹🌻🌼🌷",leaf:"🌿🍃🍂🍁☘️🍀",home:"🏠",house:"🏠",office:"🏢",school:"🏫",hospital:"🏥",church:"⛪",mosque:"🕌",car:"🚗",plane:"✈️",rocket:"🚀",train:"🚂",book:"📖📚📓",computer:"💻🖥️",phone:"📱",mail:"📧✉️",pen:"📝",music:"🎵",art:"🎨",film:"🎬",camera:"📷",game:"🎮",food:"🍕🍔🌮🍜🍣🍰",fruit:"🍎🍊🍋🍌🍉🍇🍓🍑🍒",drink:"☕🍺🥤🍷",coffee:"☕",beer:"🍺",wine:"🍷",check:"✅",cross:"❌",warning:"⚠️",question:"❓",red:"🔴🟥",green:"🟢🟩",blue:"🔵🟦",yellow:"🟡",orange:"🟠",purple:"🟣",black:"⚫",white:"⚪",pin:"📌",target:"🎯",trophy:"🏆",medal:"🎖️",gem:"💎",diamond:"💎",think:"🤔",wink:"😉",cool:"🤩",kiss:"😘",cry:"😢😭",work:"🧑‍💼💼💻",person:"👤👥",people:"👥👤",search:"🔍",light:"💡",bell:"🔔",calendar:"📅",chart:"📊",soccer:"⚽",basketball:"🏀",sport:"⚽🏀🏆",bug:"🐝🦋",butterfly:"🦋",bee:"🐝",hero:"🦸",wizard:"🧙",magic:"🧙",mountain:"🏔️",beach:"🏖️",city:"🌃",lightning:"⚡",rainbow:"🌈",wave:"🌊",water:"💧🌊",plus:"➕",minus:"➖",recycle:"♻️",refresh:"🔄"};function oh(e,t){const n=(e||"").toLowerCase().trim();let a=null;if(n){a=new Set;for(const[o,i]of Object.entries(r4))if(o.includes(n)){const l=new Intl.Segmenter("en",{granularity:"grapheme"});for(const d of l.segment(i))d.segment.trim()&&a.add(d.segment)}}let s="";for(const[o,i]of Object.entries(n4)){const l=[...new Intl.Segmenter("en",{granularity:"grapheme"}).segment(i)].map(c=>c.segment).filter(c=>c.trim()),d=n?o.toLowerCase().includes(n)?l:l.filter(c=>a&&a.has(c)):l;d.length!==0&&(s+=`
      <div class="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-1 pt-2 pb-1">${o}</div>
      <div class="grid grid-cols-6 sm:grid-cols-8 gap-0.5">
        ${d.map(c=>`<button type="button" class="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-xl sm:text-lg rounded-md hover:bg-[var(--accent-light)] transition cursor-pointer" onclick="event.stopPropagation(); ${t}('${c.replace(/'/g,"\\'")}')">${c}</button>`).join("")}
      </div>
    `)}return s}function a4(e){const t=`${e}EmojiPickerOpen`,n=r[t];if(r.perspectiveEmojiPickerOpen=!1,r.areaEmojiPickerOpen=!1,r.categoryEmojiPickerOpen=!1,r.emojiSearchQuery="",n){const d=document.querySelector(".emoji-picker-dropdown");d&&d.remove();return}r[t]=!0;const s={perspective:"selectPerspectiveEmoji",area:"selectAreaEmoji",category:"selectCategoryEmoji"}[e],o=i4(s),i={perspective:"perspective-icon-display",area:"area-folder-preview",category:"cat-folder-preview"},l=document.getElementById(i[e]);if(l){const d=l.closest(".relative")||l.parentElement,c=d.querySelector(".emoji-picker-dropdown");c&&c.remove(),d.insertAdjacentHTML("beforeend",o),setTimeout(()=>{const h=document.getElementById("emoji-search-input");h&&h.focus()},50)}}function s4(){return r.perspectiveEmojiPickerOpen?"selectPerspectiveEmoji":r.areaEmojiPickerOpen?"selectAreaEmoji":r.categoryEmojiPickerOpen?"selectCategoryEmoji":"selectPerspectiveEmoji"}function o4(e){r.emojiSearchQuery=e;const t=s4(),n=oh(e,t),a=document.getElementById("emoji-grid-content");if(a){const s=n||'<p class="text-center text-[13px] text-[var(--text-muted)] py-4">No matches</p>';a.innerHTML=s}}function i4(e="selectPerspectiveEmoji"){const t=r.emojiSearchQuery||"",n=oh(t,e);return`
    <div class="emoji-picker-dropdown absolute top-full left-0 mt-1 z-[400] w-full max-w-72 bg-[var(--modal-bg)] rounded-lg border border-[var(--border-light)] shadow-xl overflow-hidden" onclick="event.stopPropagation()">
      <div class="p-2 border-b border-[var(--border-light)]">
        <input type="text" id="emoji-search-input" placeholder="Search emojis..." value="${A(t)}"
          oninput="updateEmojiGrid(this.value)"
          class="input-field-sm w-full">
      </div>
      <div id="emoji-grid-content" class="p-2 max-h-52 overflow-y-auto">
        ${n||'<p class="text-center text-[13px] text-[var(--text-muted)] py-4">No matches</p>'}
      </div>
    </div>
  `}function ih(e,t,n){const a=Eh.map(s=>`<button type="button" class="color-swatch${s.toLowerCase()===e.toLowerCase()?" selected":""}" style="background:${s}" title="${s}"
      onclick="document.getElementById('${t}').value='${s}';var p=document.getElementById('${n}');if(p){p.style.background='${s}20';p.style.color='${s}';}document.querySelectorAll('#${t}-grid .color-swatch').forEach(function(s){s.classList.remove('selected')});this.classList.add('selected');"></button>`).join("");return`
    <input type="hidden" id="${t}" value="${e}">
    <div>
      <span class="text-[13px] text-[var(--text-muted)]">Folder color</span>
      <div id="${t}-grid" class="color-swatch-grid mt-2">${a}</div>
    </div>`}function l4(){if(!r.showPerspectiveModal)return"";const e=r.editingPerspectiveId?(r.customPerspectives||[]).find(s=>s.id===r.editingPerspectiveId):null,t=r.pendingPerspectiveEmoji||e?.icon||"📌",n=e?.filter||{},a=(s,o)=>s===o?"selected":"";return`
    <div class="modal-overlay fixed inset-0 bg-[var(--modal-overlay)] backdrop-blur-sm flex items-end md:items-center justify-center z-[300]" onclick="if(event.target===this){pendingPerspectiveEmoji=''; showPerspectiveModal=false; editingPerspectiveId=null; perspectiveEmojiPickerOpen=false; render()}" role="dialog" aria-modal="true" aria-labelledby="perspective-modal-title">
      <div class="modal-enhanced w-full max-w-lg mx-4" onclick="event.stopPropagation()">
        <div class="sheet-handle md:hidden"></div>
        <div class="modal-header-enhanced">
          <h3 id="perspective-modal-title" class="text-lg font-semibold text-[var(--text-primary)]">${e?"Edit Custom View":"New Custom View"}</h3>
          <button onclick="pendingPerspectiveEmoji=''; showPerspectiveModal=false; editingPerspectiveId=null; perspectiveEmojiPickerOpen=false; render()" aria-label="Close dialog" class="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body-enhanced">
          <!-- Name & Icon -->
          <div class="modal-section">
            <div class="flex items-start gap-3">
              <div class="relative">
                <button type="button" onclick="event.stopPropagation(); toggleEmojiPicker('perspective')"
                  class="w-12 h-12 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-center text-2xl hover:border-[var(--accent)] transition cursor-pointer" title="Pick icon">
                  <span id="perspective-icon-display">${t}</span>
                </button>
                <input type="hidden" id="perspective-icon" value="${t}">
              </div>
              <div class="flex-1">
                <input type="text" id="perspective-name" placeholder="View name, e.g. Work Projects" autofocus maxlength="100"
                  value="${A(e?.name||"")}"
                  onkeydown="if(event.key==='Enter'){event.preventDefault();savePerspectiveFromModal();}"
                  class="modal-input-enhanced title-input">
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div class="modal-section">
            <div class="modal-section-label">Filters</div>
            <div class="space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Match</label>
                  <select id="perspective-logic" class="modal-input-enhanced">
                    <option value="all" ${a(n.logic||"all","all")}>All rules</option>
                    <option value="any" ${a(n.logic,"any")}>Any rule</option>
                    <option value="none" ${a(n.logic,"none")}>No rules</option>
                  </select>
                </div>
                <div>
                  <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Availability</label>
                  <select id="perspective-availability" class="modal-input-enhanced">
                    <option value="available" ${a(n.availability||"available","available")}>Available</option>
                    <option value="" ${a(n.availability,"")}>Any</option>
                    <option value="remaining" ${a(n.availability,"remaining")}>Remaining</option>
                    <option value="completed" ${a(n.availability,"completed")}>Completed</option>
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Area</label>
                  <select id="perspective-category" class="modal-input-enhanced">
                    <option value="">Any area</option>
                    ${(r.taskAreas||[]).map(s=>`<option value="${s.id}" ${a(n.categoryId,s.id)}>${A(s.name)}</option>`).join("")}
                  </select>
                </div>
                <div>
                  <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Person</label>
                  <select id="perspective-person" class="modal-input-enhanced">
                    <option value="">Any person</option>
                    ${(r.taskPeople||[]).map(s=>`<option value="${s.id}" ${a(n.personId,s.id)}>${A(s.name)}</option>`).join("")}
                  </select>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Status</label>
                  <select id="perspective-status" class="modal-input-enhanced">
                    <option value="" ${a(n.status,void 0)}>Any status</option>
                    <option value="inbox" ${a(n.status,"inbox")}>Inbox</option>
                    <option value="today" ${a(n.status,"today")}>Today</option>
                    <option value="anytime" ${a(n.status,"anytime")}>Anytime</option>
                    <option value="someday" ${a(n.status,"someday")}>Someday</option>
                  </select>
                </div>
                <div>
                  <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Special</label>
                  <select id="perspective-status-rule" class="modal-input-enhanced">
                    <option value="" ${a(n.statusRule,void 0)}>None</option>
                    <option value="flagged" ${a(n.statusRule,"flagged")}>Flagged</option>
                    <option value="dueSoon" ${a(n.statusRule,"dueSoon")}>Due Soon (7 days)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Tags -->
          <div class="modal-section">
            <div class="flex items-center justify-between mb-2">
              <div class="modal-section-label mb-0">Tags</div>
              <select id="perspective-tags-mode" class="px-2 py-1 text-[11px] border border-[var(--border)] rounded-md bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                <option value="any" ${a(n.tagMatch||"any","any")}>Match any</option>
                <option value="all" ${a(n.tagMatch,"all")}>Match all</option>
              </select>
            </div>
            <div class="border border-[var(--border)] rounded-lg p-2 max-h-28 overflow-y-auto space-y-0.5">
              ${(r.taskLabels||[]).length>0?r.taskLabels.map(s=>`
                <label class="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[var(--bg-secondary)] cursor-pointer transition">
                  <input type="checkbox" class="perspective-tag-checkbox rounded border-[var(--border)]" value="${s.id}" ${(n.labelIds||[]).includes(s.id)?"checked":""}>
                  <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background-color: ${s.color}"></span>
                  <span class="text-[13px] text-[var(--text-primary)]">${A(s.name)}</span>
                </label>
              `).join(""):'<p class="text-[13px] text-[var(--text-muted)] text-center py-3">No tags created yet</p>'}
            </div>
          </div>

          <!-- Conditions -->
          <div class="modal-section">
            <div class="modal-section-label">Conditions</div>
            <div class="grid grid-cols-2 gap-x-4 gap-y-2">
              <label class="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" id="perspective-due" class="rounded border-[var(--border)]" ${n.hasDueDate?"checked":""}>
                Has due date
              </label>
              <label class="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" id="perspective-defer" class="rounded border-[var(--border)]" ${n.hasDeferDate?"checked":""}>
                Has defer date
              </label>
              <label class="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" id="perspective-repeat" class="rounded border-[var(--border)]" ${n.isRepeating?"checked":""}>
                Repeating
              </label>
              <label class="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" id="perspective-untagged" class="rounded border-[var(--border)]" ${n.isUntagged?"checked":""}>
                Untagged
              </label>
              <label class="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" id="perspective-inbox" class="rounded border-[var(--border)]" ${n.inboxOnly?"checked":""}>
                Inbox only
              </label>
            </div>
          </div>

          <!-- Date Range -->
          <div class="modal-section">
            <div class="modal-section-label">Date Range</div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <select id="perspective-range-type" class="modal-input-enhanced text-[13px]">
                <option value="either" ${a(n.dateRange?.type,"either")}>Due or Defer</option>
                <option value="due" ${a(n.dateRange?.type,"due")}>Due only</option>
                <option value="defer" ${a(n.dateRange?.type,"defer")}>Defer only</option>
              </select>
              <input type="date" id="perspective-range-start" class="modal-input-enhanced text-[13px]" value="${n.dateRange?.start||""}">
              <input type="date" id="perspective-range-end" class="modal-input-enhanced text-[13px]" value="${n.dateRange?.end||""}">
            </div>
          </div>

          <!-- Search Terms -->
          <div class="modal-section">
            <div class="modal-section-label">Search Terms</div>
            <input type="text" id="perspective-search" placeholder="Title or notes contains..."
              value="${A(n.searchTerms||"")}"
              class="modal-input-enhanced">
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer-enhanced">
          ${e?`
            <button onclick="if(confirm('Delete this custom view?')){deletePerspective('${e.id}'); showPerspectiveModal=false; editingPerspectiveId=null; perspectiveEmojiPickerOpen=false; render();}"
              class="px-4 py-2.5 text-sm text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] rounded-lg transition mr-auto">Delete</button>
          `:""}
          <button onclick="showPerspectiveModal=false; editingPerspectiveId=null; perspectiveEmojiPickerOpen=false; render()"
            class="px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition">Cancel</button>
          <button onclick="savePerspectiveFromModal()" class="sb-btn px-5 py-2.5 rounded-lg text-sm font-medium">
            ${e?"Save":"Create"}
          </button>
        </div>
      </div>
    </div>
  `}function d4(){if(!r.showAreaModal)return"";const e=r.editingAreaId?(r.taskAreas||[]).find(a=>a.id===r.editingAreaId):null,t=e?.color||"#6366F1",n=r.pendingAreaEmoji||e?.emoji||"";return`
    <div class="modal-overlay fixed inset-0 bg-[var(--modal-overlay)] backdrop-blur-sm flex items-end md:items-center justify-center z-[300]" onclick="if(event.target===this){pendingAreaEmoji=''; showAreaModal=false; editingAreaId=null; areaEmojiPickerOpen=false; render()}" role="dialog" aria-modal="true" aria-labelledby="area-modal-title">
      <div class="modal-enhanced w-full max-w-md mx-4" onclick="event.stopPropagation()">
        <div class="sheet-handle md:hidden"></div>
        <div class="modal-header-enhanced">
          <h3 id="area-modal-title" class="text-lg font-semibold text-[var(--text-primary)]">${e?"Edit Area":"New Area"}</h3>
          <button onclick="pendingAreaEmoji=''; showAreaModal=false; editingAreaId=null; areaEmojiPickerOpen=false; render()" aria-label="Close dialog" class="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
        <div class="modal-body-enhanced space-y-4">
          <!-- Icon + Name row -->
          <div class="flex items-start gap-4">
            <div class="relative flex-shrink-0">
              <input type="hidden" id="area-emoji" value="${n}">
              <button type="button" onclick="event.stopPropagation(); toggleEmojiPicker('area')"
                id="area-folder-preview"
                class="w-16 h-16 rounded-xl flex items-center justify-center text-2xl cursor-pointer hover:ring-2 hover:ring-[var(--accent)]/40 transition" style="background: ${t}20; color: ${t}">
                ${n||'<svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17l10 5 10-5-10-5-10 5z" opacity="0.35"/><path d="M2 12l10 5 10-5-10-5-10 5z" opacity="0.6"/><path d="M12 2L2 7l10 5 10-5L12 2z"/></svg>'}
              </button>
            </div>
            <div class="flex-1 space-y-3 pt-1">
              <input type="text" id="area-name" value="${e?.name?A(e.name):""}"
                placeholder="Area name" autofocus maxlength="100"
                onkeydown="if(event.key==='Enter'){event.preventDefault();saveAreaFromModal();}"
                class="modal-input-enhanced w-full text-lg font-medium">
              ${ih(t,"area-color","area-folder-preview")}
            </div>
          </div>
        </div>
        <div class="modal-footer-enhanced">
          ${e?`
            <button onclick="if(confirm('Delete this area?')){deleteArea('${e.id}'); showAreaModal=false; editingAreaId=null; areaEmojiPickerOpen=false; render();}"
              class="px-4 py-2.5 text-sm text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] rounded-lg transition">Delete</button>
          `:"<div></div>"}
          <div class="flex gap-2">
            <button onclick="showAreaModal=false; editingAreaId=null; areaEmojiPickerOpen=false; render()"
              class="px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition">Cancel</button>
            <button onclick="saveAreaFromModal()" class="sb-btn px-5 py-2.5 rounded-lg text-sm font-medium">
              ${e?"Save":"Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  `}function c4(){if(!r.showCategoryModal)return"";const e=r.editingCategoryId?(r.taskCategories||[]).find(o=>o.id===r.editingCategoryId):null,t=e?e.areaId:r.modalSelectedArea||r.taskAreas[0]?.id||"",n=r.taskAreas.find(o=>o.id===t),a=e?e.color:n?n.color:"#6366F1",s=r.pendingCategoryEmoji||e?.emoji||"";return`
    <div class="modal-overlay fixed inset-0 bg-[var(--modal-overlay)] backdrop-blur-sm flex items-end md:items-center justify-center z-[300]" onclick="if(event.target===this){pendingCategoryEmoji=''; showCategoryModal=false;editingCategoryId=null;categoryEmojiPickerOpen=false;render()}" role="dialog" aria-modal="true" aria-labelledby="category-modal-title">
      <div class="modal-enhanced w-full max-w-md mx-4" onclick="event.stopPropagation()">
        <div class="sheet-handle md:hidden"></div>
        <div class="modal-header-enhanced">
          <h3 id="category-modal-title" class="text-lg font-semibold text-[var(--text-primary)]">${e?"Edit":"New"} Category</h3>
          <button onclick="pendingCategoryEmoji=''; showCategoryModal=false;editingCategoryId=null;categoryEmojiPickerOpen=false;render()" aria-label="Close dialog" class="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
        <div class="modal-body-enhanced space-y-4">
          <!-- Icon + Name row -->
          <div class="flex items-start gap-4">
            <div class="relative flex-shrink-0">
              <input type="hidden" id="category-emoji" value="${s}">
              <button type="button" onclick="event.stopPropagation(); toggleEmojiPicker('category')"
                id="cat-folder-preview"
                class="w-14 h-14 rounded-lg flex items-center justify-center text-xl cursor-pointer hover:ring-2 hover:ring-[var(--accent)]/40 transition" style="background: ${a}20; color: ${a}">
                ${s||'<svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M2 6a2 2 0 012-2h5.586a1 1 0 01.707.293L12 6h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" opacity="0.35"/><rect x="2" y="9" width="20" height="11" rx="2"/></svg>'}
              </button>
            </div>
            <div class="flex-1 space-y-3 pt-1">
              <input type="text" id="category-name" value="${e?A(e.name):""}" placeholder="Category name"
                class="modal-input-enhanced w-full text-lg font-medium" autofocus onkeydown="if(event.key==='Enter'){event.preventDefault();saveCategoryFromModal();}">
              <select id="category-area" class="modal-input-enhanced w-full text-sm">
                ${(r.taskAreas||[]).map(o=>`<option value="${o.id}" ${o.id===t?"selected":""}>${A(o.name)}</option>`).join("")}
              </select>
              ${ih(a,"category-color","cat-folder-preview")}
            </div>
          </div>
        </div>
        <div class="modal-footer-enhanced">
          ${e?`<button onclick="window.deleteCategory('${e.id}'); showCategoryModal=false; editingCategoryId=null; render()" class="px-4 py-2.5 text-sm text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] rounded-lg transition">Delete</button>`:"<div></div>"}
          <div class="flex gap-2">
            <button onclick="showCategoryModal=false;editingCategoryId=null;categoryEmojiPickerOpen=false;render()" class="px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition">Cancel</button>
            <button onclick="saveCategoryFromModal()" class="sb-btn px-5 py-2.5 rounded-lg text-sm font-medium">Save</button>
          </div>
        </div>
      </div>
    </div>
  `}function u4(){if(!r.showLabelModal)return"";const e=r.editingLabelId?(r.taskLabels||[]).find(t=>t.id===r.editingLabelId):null;return`
    <div class="modal-overlay fixed inset-0 bg-[var(--modal-overlay)] backdrop-blur-sm flex items-end md:items-center justify-center z-[300]" onclick="if(event.target===this){showLabelModal=false; editingLabelId=null; render()}" role="dialog" aria-modal="true" aria-labelledby="label-modal-title">
      <div class="modal-enhanced w-full max-w-sm mx-4" onclick="event.stopPropagation()">
        <div class="sheet-handle md:hidden"></div>
        <div class="modal-header-enhanced">
          <h3 id="label-modal-title" class="text-lg font-semibold text-[var(--text-primary)]">${e?"Edit Tag":"New Tag"}</h3>
          <button onclick="showLabelModal=false; editingLabelId=null; render()" aria-label="Close dialog" class="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
        <div class="modal-body-enhanced space-y-4">
          <div>
            <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Name</label>
            <input type="text" id="label-name" value="${e?.name?A(e.name):""}"
              placeholder="e.g., Important" autofocus maxlength="50"
              onkeydown="if(event.key==='Enter'){event.preventDefault();saveLabelFromModal();}"
              class="modal-input-enhanced w-full">
          </div>
          <div>
            <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Color</label>
            <input type="color" id="label-color" value="${e?.color||"#6B7280"}"
              class="w-full h-10 rounded-lg border border-[var(--border)] cursor-pointer">
          </div>
        </div>
        <div class="modal-footer-enhanced">
          ${e?`
            <button onclick="if(confirm('Delete this tag?')){deleteLabel('${e.id}'); showLabelModal=false; editingLabelId=null; render();}"
              class="px-4 py-2.5 text-sm text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] rounded-lg transition">Delete</button>
          `:"<div></div>"}
          <div class="flex gap-2">
            <button onclick="showLabelModal=false; editingLabelId=null; render()"
              class="px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition">Cancel</button>
            <button onclick="saveLabelFromModal()" class="sb-btn px-5 py-2.5 rounded-lg text-sm font-medium">
              ${e?"Save":"Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  `}function f4(){if(!r.showPersonModal)return"";const e=r.editingPersonId?(r.taskPeople||[]).find(t=>t.id===r.editingPersonId):null;return`
    <div class="modal-overlay fixed inset-0 bg-[var(--modal-overlay)] backdrop-blur-sm flex items-end md:items-center justify-center z-[300]" onclick="if(event.target===this){showPersonModal=false; editingPersonId=null; render()}" role="dialog" aria-modal="true" aria-labelledby="person-modal-title">
      <div class="modal-enhanced w-full max-w-sm mx-4" onclick="event.stopPropagation()">
        <div class="sheet-handle md:hidden"></div>
        <div class="modal-header-enhanced">
          <h3 id="person-modal-title" class="text-lg font-semibold text-[var(--text-primary)]">${e?"Edit Person":"New Person"}</h3>
          <button onclick="showPersonModal=false; editingPersonId=null; render()" aria-label="Close dialog" class="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
        <div class="modal-body-enhanced space-y-4">
          ${e?.photoData?`
            <div class="flex justify-center">
              ${Vr(e,64)}
            </div>
          `:""}
          <div>
            <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Name</label>
            <input type="text" id="person-name" value="${e?.name?A(e.name):""}"
              placeholder="e.g., John Doe" autofocus maxlength="100"
              onkeydown="if(event.key==='Enter'){event.preventDefault();savePersonFromModal();}"
              class="modal-input-enhanced w-full">
          </div>
          <div>
            <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Email</label>
            <input type="email" id="person-email" value="${e?.email?A(e.email):""}"
              placeholder="e.g., mostafa@company.com" maxlength="160"
              onkeydown="if(event.key==='Enter'){event.preventDefault();savePersonFromModal();}"
              class="modal-input-enhanced w-full">
          </div>
        </div>
        <div class="modal-footer-enhanced">
          ${e?`
            <button onclick="if(confirm('Delete this person?')){deletePerson('${e.id}'); showPersonModal=false; editingPersonId=null; render();}"
              class="px-4 py-2.5 text-sm text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_8%,transparent)] rounded-lg transition">Delete</button>
          `:"<div></div>"}
          <div class="flex gap-2">
            <button onclick="showPersonModal=false; editingPersonId=null; render()"
              class="px-5 py-2.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition">Cancel</button>
            <button onclick="savePersonFromModal()" class="sb-btn px-5 py-2.5 rounded-lg text-sm font-medium">
              ${e?"Save":"Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  `}const Ls=[{key:"task",label:"Tasks",icon:"☑️",prefix:null},{key:"note",label:"Notes",icon:"📝",prefix:null},{key:"area",label:"Areas",icon:"🗂️",prefix:"#"},{key:"category",label:"Categories",icon:"📂",prefix:null},{key:"label",label:"Labels",icon:"🏷️",prefix:"@"},{key:"person",label:"People",icon:"👤",prefix:"&"},{key:"perspective",label:"Perspectives",icon:"🔭",prefix:null},{key:"trigger",label:"Triggers",icon:"⚡",prefix:null}],p4={task:8,note:5,area:5,category:5,label:5,person:5,perspective:5,trigger:5},h4=30,m4=50,g4=150;let Yn=null;const wt=e=>oe(e);function td(e){if(!e)return"";const t=e.trim();return t.length>0&&["#","@","&"].includes(t[0])?t.slice(1).trim():t}function v4(){r.showGlobalSearch=!0,r.globalSearchQuery="",r.globalSearchResults=[],r.globalSearchActiveIndex=-1,r.globalSearchTypeFilter=null,window.render(),setTimeout(()=>{const e=document.getElementById("global-search-input");e&&e.focus()},50)}function nd(){r.showGlobalSearch=!1,r.globalSearchQuery="",r.globalSearchResults=[],r.globalSearchActiveIndex=-1,r.globalSearchTypeFilter=null,Yn&&(clearTimeout(Yn),Yn=null)}function b4(e){r.globalSearchQuery=e;const t={"#":"area","@":"label","&":"person"},n=e.length>0?e[0]:"";if(t[n]){const a=t[n];r.globalSearchTypeFilter!==a&&(r.globalSearchTypeFilter=a,Os())}else r.globalSearchTypeFilter&&Object.values(t).includes(r.globalSearchTypeFilter)&&(r.globalSearchTypeFilter=null,Os());Yn&&clearTimeout(Yn),Yn=setTimeout(()=>{const a=rd(e,r.globalSearchTypeFilter);r.globalSearchResults=a,r.globalSearchActiveIndex=Da(a).length>0?0:-1,na()},g4)}function y4(e){const n=Da().length;e.key==="ArrowDown"?(e.preventDefault(),n>0&&(r.globalSearchActiveIndex=(r.globalSearchActiveIndex+1)%n,na(),uc())):e.key==="ArrowUp"?(e.preventDefault(),n>0&&(r.globalSearchActiveIndex=(r.globalSearchActiveIndex-1+n)%n,na(),uc())):e.key==="Enter"?(e.preventDefault(),r.globalSearchActiveIndex>=0&&r.globalSearchActiveIndex<n&&lh(r.globalSearchActiveIndex)):e.key==="Escape"?(e.preventDefault(),e.stopPropagation(),nd(),window.render()):e.key==="Tab"&&(e.preventDefault(),T4(e.shiftKey))}function lh(e){const t=Da();if(e<0||e>=t.length)return;const n=t[e];nd(),S4(n)}function w4(e){const t=r.globalSearchTypeFilter;r.globalSearchTypeFilter=t===e?null:e;const n=rd(r.globalSearchQuery,r.globalSearchTypeFilter);r.globalSearchResults=n,r.globalSearchActiveIndex=Da(n).length>0?0:-1,na(),Os();const a=document.getElementById("global-search-input");a&&a.focus()}function rd(e,t){const n=td(e);if(!n)return[];const a=n.toLowerCase(),s=[],o=t?Ls.filter(i=>i.key===t):Ls;for(const i of o){const l=x4(i.key,a);if(l.length>0){const d=t?h4:p4[i.key]||5;s.push({type:i.key,label:i.label,icon:i.icon,items:l.slice(0,d)})}}if(!t){let i=0;for(const l of s){const d=m4-i;if(d<=0){l.items=[];continue}l.items.length>d&&(l.items=l.items.slice(0,d)),i+=l.items.length}}return s.filter(i=>i.items.length>0)}function x4(e,t,n){const a=[];switch(e){case"task":{const s=(r.tasksData||[]).filter(o=>!o.isNote&&o.title);for(const o of s){let i=dt(o.title,t)+(o.notes?k4(o.notes,t):0);if(i>0){o.completed&&(i=Math.max(1,Math.floor(i*.4)));const l=o.areaId?(r.taskAreas||[]).find(c=>c.id===o.areaId):null,d=o.completed?"Completed":o.status==="today"||o.today?"Today":o.status||"inbox";a.push({id:o.id,type:"task",title:o.title,score:i,subtitle:[l?.name,d].filter(Boolean).join(" · "),icon:o.completed?"✅":o.flagged?"🚩":"☑️",color:wt(l?.color)||"var(--accent)"})}}break}case"note":{const s=(r.tasksData||[]).filter(o=>o.isNote&&o.noteLifecycleState!=="deleted"&&o.title);for(const o of s){const i=dt(o.title,t);if(i>0){const l=o.areaId?(r.taskAreas||[]).find(d=>d.id===o.areaId):null;a.push({id:o.id,type:"note",title:o.title,score:i,subtitle:l?.name||"No area",icon:"📝",color:wt(l?.color)||"var(--text-muted)"})}}break}case"area":{const s=r.taskAreas||[];for(const o of s){const i=dt(o.name,t);if(i>0){const l=(r.tasksData||[]).filter(d=>d.areaId===o.id&&!d.completed&&!d.isNote).length;a.push({id:o.id,type:"area",title:o.name,score:i,subtitle:`${l} task${l!==1?"s":""}`,icon:o.emoji||o.icon||"📦",color:wt(o.color)||"var(--accent)"})}}break}case"category":{const s=r.taskCategories||[];for(const o of s){const i=dt(o.name,t);if(i>0){const l=o.areaId?(r.taskAreas||[]).find(d=>d.id===o.areaId):null;a.push({id:o.id,type:"category",title:o.name,score:i,subtitle:l?.name||"",icon:o.emoji||"📂",color:wt(o.color||l?.color)||"var(--accent)"})}}break}case"label":{const s=r.taskLabels||[];for(const o of s){const i=dt(o.name,t);if(i>0){const l=(r.tasksData||[]).filter(d=>!d.completed&&!d.isNote&&(d.labels||[]).includes(o.id)).length;a.push({id:o.id,type:"label",title:o.name,score:i,subtitle:`${l} task${l!==1?"s":""}`,icon:"🏷️",color:wt(o.color)||"#6B7280"})}}break}case"person":{const s=r.taskPeople||[];for(const o of s){const i=dt(o.name,t),l=o.email?dt(o.email,t)*.8:0,d=o.jobTitle?dt(o.jobTitle,t)*.6:0,c=Math.max(i,l,d);c>0&&a.push({id:o.id,type:"person",title:o.name,score:c,subtitle:[o.jobTitle,o.email].filter(Boolean).join(" · "),icon:"👤",color:"#6B7280"})}break}case"perspective":{const s=Array.from(Ue).map(d=>({...d,_builtin:!0})),o={...ut,_builtin:!0},i=(r.customPerspectives||[]).map(d=>({...d,_builtin:!1})),l=[...s,o,...i];for(const d of l){const c=dt(d.name,t);c>0&&a.push({id:d.id,type:"perspective",title:d.name,score:c,subtitle:d._builtin?"Built-in perspective":"Custom perspective",icon:"🔭",color:wt(d.color)||"var(--accent)"})}break}case"trigger":{const s=r.triggers||[];for(const o of s){if(!o.title)continue;const i=dt(o.title,t);if(i>0){const l=o.areaId?(r.taskAreas||[]).find(d=>d.id===o.areaId):null;a.push({id:o.id,type:"trigger",title:o.title,score:i,subtitle:l?.name||"",icon:"⚡",color:wt(l?.color)||"var(--text-muted)"})}}break}}return a.sort((s,o)=>o.score-s.score),a}function dt(e,t){if(!e)return 0;const n=e.toLowerCase();return n===t?150:n.startsWith(t)?100:n.split(/[\s\-_/]+/).some(s=>s.startsWith(t))?60:n.includes(t)?30:0}function k4(e,t){return e&&e.toLowerCase().includes(t)?10:0}function S4(e){switch(e.type){case"task":case"note":r.editingTaskId=e.id,r.showTaskModal=!0,window.render();break;case"area":window.showAreaTasks(e.id);break;case"category":window.showCategoryTasks(e.id);break;case"label":window.showLabelTasks(e.id);break;case"person":window.showPersonTasks(e.id);break;case"perspective":window.showPerspectiveTasks(e.id);break;case"trigger":{const t=(r.triggers||[]).find(n=>n.id===e.id);t?.areaId?window.showAreaTasks(t.areaId):(r.activeTab="tasks",window.render());break}}}function Da(e){const t=e||r.globalSearchResults,n=[];for(const a of t)for(const s of a.items)n.push(s);return n}function T4(e){const t=[null,...Ls.map(o=>o.key)],n=t.indexOf(r.globalSearchTypeFilter),a=e?(n-1+t.length)%t.length:(n+1)%t.length;r.globalSearchTypeFilter=t[a];const s=rd(r.globalSearchQuery,r.globalSearchTypeFilter);r.globalSearchResults=s,r.globalSearchActiveIndex=Da(s).length>0?0:-1,na(),Os()}function I4(e,t){if(!e||!t)return A(e||"");const n=td(t);if(!n)return A(e);const a=e.toLowerCase(),s=n.toLowerCase(),o=a.indexOf(s);if(o===-1)return A(e);const i=e.slice(0,o),l=e.slice(o,o+n.length),d=e.slice(o+n.length);return`${A(i)}<mark class="global-search-highlight">${A(l)}</mark>${A(d)}`}function uc(){requestAnimationFrame(()=>{const e=document.getElementById("global-search-results"),t=e?.querySelector(".global-search-result.active");t&&e&&t.scrollIntoView({block:"nearest",behavior:"smooth"})})}function na(){const e=document.getElementById("global-search-results");e&&(e.innerHTML=ch())}function Os(){const e=document.getElementById("global-search-type-filters");e&&(e.innerHTML=dh())}function C4(){return r.showGlobalSearch?`
    <div class="global-search-overlay" onclick="if(event.target===this){closeGlobalSearch();render()}" role="dialog" aria-modal="true" aria-label="Search">
      <div class="global-search-modal">
        <div class="global-search-input-wrapper">
          <svg class="global-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            id="global-search-input"
            type="text"
            placeholder="Search tasks, areas, labels, people..."
            value="${A(r.globalSearchQuery)}"
            oninput="handleGlobalSearchInput(this.value)"
            onkeydown="handleGlobalSearchKeydown(event)"
            autocomplete="off"
            spellcheck="false"
            role="combobox"
            aria-expanded="true"
            aria-controls="global-search-results"
            aria-autocomplete="list"
          />
          <kbd class="global-search-esc" onclick="closeGlobalSearch();render()" aria-label="Close search">ESC</kbd>
        </div>
        <div id="global-search-type-filters" class="global-search-type-filters" role="toolbar" aria-label="Filter by type">
          ${dh()}
        </div>
        <div id="global-search-results" class="global-search-results" role="listbox" aria-label="Search results">
          ${ch()}
        </div>
        <div class="global-search-footer" aria-hidden="true">
          <span><kbd>&uarr;</kbd><kbd>&darr;</kbd> Navigate</span>
          <span><kbd>&crarr;</kbd> Open</span>
          <span><kbd>Tab</kbd> Filter</span>
          <span><kbd>Esc</kbd> Close</span>
        </div>
      </div>
    </div>`:""}function dh(){const e=r.globalSearchTypeFilter;let t=`<button type="button" class="global-search-type-chip ${e===null?"active":""}" onclick="setSearchTypeFilter(null);event.stopPropagation()" aria-pressed="${e===null}">All</button>`;for(const n of Ls){const a=e===n.key;t+=`<button type="button" class="global-search-type-chip ${a?"active":""}" onclick="setSearchTypeFilter('${n.key}');event.stopPropagation()" aria-pressed="${a}">${A(n.icon)} ${A(n.label)}</button>`}return t}function ch(){const e=r.globalSearchResults,t=r.globalSearchQuery,n=td(t);if(!n)return`<div class="global-search-empty">
      <div class="global-search-empty-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.3" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
      </div>
      <p>Type to search across everything</p>
      <p class="global-search-empty-hint">Use <kbd>#</kbd> for areas, <kbd>@</kbd> for labels, <kbd>&amp;</kbd> for people</p>
    </div>`;if(!e||e.length===0)return`<div class="global-search-empty">
      <p>No results for "${A(n)}"</p>
    </div>`;let a="",s=0;for(const o of e){a+=`<div class="global-search-group-header" aria-hidden="true">
      <span>${A(o.icon)} ${A(o.label)}</span>
      <span class="global-search-group-count">${o.items.length} found</span>
    </div>`;for(const i of o.items){const l=s===r.globalSearchActiveIndex,d=wt(i.color)?`style="color:${wt(i.color)}"`:"";a+=`<button type="button" class="global-search-result ${l?"active":""}"
        role="option" aria-selected="${l}"
        data-result-idx="${s}"
        onclick="selectGlobalSearchResult(${s})"
        onmouseenter="this.parentElement.querySelector('.global-search-result.active')?.classList.remove('active');this.classList.add('active');window.globalSearchActiveIndex=${s}">
        <span class="global-search-result-icon" ${d}>${A(i.icon)}</span>
        <div class="global-search-result-text">
          <span class="global-search-result-title">${I4(i.title,t)}</span>
          ${i.subtitle?`<span class="global-search-result-subtitle">${A(i.subtitle)}</span>`:""}
        </div>
        <span class="global-search-result-badge">${A(i.type)}</span>
      </button>`,s++}}return a}let Jt=null,Ht="",$r="";function E4(){return window.SpeechRecognition||window.webkitSpeechRecognition||null}function uh(){if(Jt)try{Jt.stop()}catch{}}function fh(e){if(e.key==="Escape"){e.preventDefault(),ad();return}if(e.key!=="Tab")return;const t=document.querySelector(".braindump-overlay");if(!t)return;const n=t.querySelectorAll('button, input, textarea, select, [tabindex]:not([tabindex="-1"])');if(!n.length)return;const a=n[0],s=n[n.length-1];e.shiftKey&&document.activeElement===a?(e.preventDefault(),s.focus()):!e.shiftKey&&document.activeElement===s&&(e.preventDefault(),a.focus())}function $4(){Ht="",Jt=null,r.showBraindump=!0,r.braindumpStep="input",r.braindumpRawText="",r.braindumpParsedItems=[],r.braindumpEditingIndex=null,r.braindumpVoiceRecording=!1,r.braindumpVoiceTranscribing=!1,r.braindumpVoiceError=null,window.render(),document.addEventListener("keydown",fh),setTimeout(()=>{const e=document.getElementById("braindump-textarea");e&&e.focus()},100)}function ad(){document.removeEventListener("keydown",fh),uh(),Jt=null,Ht="",r.showBraindump=!1,r.braindumpRawText="",r.braindumpParsedItems=[],r.braindumpStep="input",r.braindumpEditingIndex=null,r.braindumpVoiceRecording=!1,r.braindumpVoiceTranscribing=!1,r.braindumpVoiceError=null,window.render()}async function D4(){if(r.braindumpProcessing)return;const e=document.getElementById("braindump-textarea");if(e&&(r.braindumpRawText=e.value),!r.braindumpRawText.trim())return;dn()&&(r.braindumpProcessing=!0,r.braindumpStep="processing",window.render());try{r.braindumpParsedItems=await Np(r.braindumpRawText),r.braindumpStep="review",r.braindumpEditingIndex=null}catch(n){console.error("Braindump processing failed:",n),r.braindumpAIError=n.message||"Processing failed unexpectedly",r.braindumpParsedItems=[],r.braindumpStep="input"}finally{r.braindumpProcessing=!1}window.render()}function ph(){if(r.braindumpVoiceRecording||r.braindumpVoiceTranscribing)return;r.braindumpVoiceError=null;const e=E4();if(!e){r.braindumpVoiceError="Voice input is not supported in this browser. Try Safari/Chrome on mobile and enable microphone permission.",window.render();return}Ht="",$r=(r.braindumpRawText||"").trim();const t=new e;Jt=t,t.lang=navigator.language||"en-US",t.continuous=!0,t.interimResults=!0,t.maxAlternatives=1,t.onstart=()=>{r.braindumpVoiceRecording=!0,r.braindumpVoiceTranscribing=!1,r.braindumpVoiceError=null;const n=document.getElementById("braindump-voice-btn");n&&(n.classList.add("voice-recording-active"),n.innerHTML='<svg class="w-5 h-5 text-[var(--danger)] animate-pulse" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6"/></svg>');const a=document.getElementById("braindump-voice-error");a&&(a.style.display="none")},t.onresult=n=>{let a="";for(let s=n.resultIndex;s<n.results.length;s++){const o=n.results[s],i=(o?.[0]?.transcript||"").trim();o.isFinal&&i&&(a+=`${i}
`)}if(a){Ht+=a;const s=$r?`${$r}
${Ht.trim()}`:Ht.trim();r.braindumpRawText=s;const o=document.getElementById("braindump-textarea");o&&(o.value=s)}},t.onerror=n=>{r.braindumpVoiceRecording=!1,r.braindumpVoiceTranscribing=!1,n?.error!=="no-speech"&&n?.error!=="aborted"&&(r.braindumpVoiceError=`Voice input error: ${n.error||"unknown"}`),window.render()},t.onend=async()=>{const n=Ht.trim();if(Ht="",Jt=null,r.braindumpVoiceRecording=!1,r.braindumpVoiceTranscribing=!!n,window.render(),n&&!!dn())try{const o=(await Jx(n)||n).trim();r.braindumpRawText=$r?`${$r}
${o}`:o}catch{}r.braindumpVoiceTranscribing=!1,window.render(),setTimeout(()=>{const a=document.getElementById("braindump-textarea");a&&(a.focus(),a.setSelectionRange(a.value.length,a.value.length))},50)},r.braindumpVoiceTranscribing=!1;try{t.start()}catch(n){Jt=null,r.braindumpVoiceRecording=!1,r.braindumpVoiceTranscribing=!1,r.braindumpVoiceError=`Voice input could not start: ${n?.message||"unknown error"}`,window.render()}}function hh(){Jt&&(r.braindumpVoiceTranscribing=!1,uh())}function _4(){r.braindumpVoiceRecording||r.braindumpVoiceTranscribing?hh():ph()}function A4(){r.braindumpStep="input",r.braindumpEditingIndex=null,window.render(),setTimeout(()=>{const e=document.getElementById("braindump-textarea");e&&e.focus()},100)}function M4(e){const t=r.braindumpParsedItems[e];t&&(t.type=t.type==="task"?"note":"task",window.render())}function P4(e){const t=r.braindumpParsedItems[e];t&&(t.included=!t.included,window.render())}function N4(e){r.braindumpParsedItems.splice(e,1),r.braindumpParsedItems.forEach((t,n)=>t.index=n),window.render()}function L4(e){r.braindumpEditingIndex=e,window.render(),setTimeout(()=>{const t=document.getElementById(`braindump-edit-${e}`);t&&(t.focus(),t.select())},50)}function O4(e){const t=document.getElementById(`braindump-edit-${e}`);t&&(r.braindumpParsedItems[e].title=t.value.trim()||r.braindumpParsedItems[e].title),r.braindumpEditingIndex=null,window.render()}function R4(){r.braindumpEditingIndex=null,window.render()}function B4(e,t){const n=r.braindumpParsedItems[e];n&&(n.areaId=t||null,window.render())}function j4(e,t){const n=r.braindumpParsedItems[e];n&&(n.labels.includes(t)||n.labels.push(t),window.render())}function F4(e,t){const n=r.braindumpParsedItems[e];n&&(n.labels=n.labels.filter(a=>a!==t),window.render())}function H4(e,t){const n=r.braindumpParsedItems[e];n&&(n.people.includes(t)||n.people.push(t),window.render())}function z4(e,t){const n=r.braindumpParsedItems[e];n&&(n.people=n.people.filter(a=>a!==t),window.render())}function W4(e,t){const n=r.braindumpParsedItems[e];n&&(n.deferDate=t,window.render())}function U4(e){const t=r.braindumpParsedItems[e];t&&(t.deferDate=null,t.dueDate=null,window.render())}function G4(){const e=Lp(r.braindumpParsedItems);r.braindumpStep="success",r.braindumpSuccessMessage=`Added ${e.taskCount} task${e.taskCount!==1?"s":""} and ${e.noteCount} note${e.noteCount!==1?"s":""}`,window.render(),setTimeout(()=>{ad()},1500)}function V4(){return r.showBraindump?"":`
    <button onclick="openBraindump()" class="braindump-fab" title="Braindump (Cmd+Shift+D)" aria-label="Open Braindump">
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
        <polyline points="14 3 14 9 20 9"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="13" y2="17"/>
      </svg>
    </button>
  `}function q4(){return r.showBraindump?r.braindumpStep==="success"?Q4():r.braindumpStep==="processing"?X4():r.braindumpStep==="review"?Y4():K4():""}function K4(){const e=r.braindumpRawText||"",t=e?e.split(`
`).filter(o=>o.trim()).length:0,n=e.trim()?e.trim().split(/\s+/).length:0,a=r.braindumpVoiceRecording||r.braindumpVoiceTranscribing,s=!!dn();return`
    <div class="braindump-overlay braindump-writer">
      <div class="braindump-writer-chrome">
        <button onclick="closeBraindump()" class="braindump-writer-back" aria-label="Close">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <div class="braindump-writer-status">
          <span id="braindump-count" class="braindump-writer-count">${t>0?`${t} line${t!==1?"s":""} · ${n} word${n!==1?"s":""}`:""}</span>
        </div>
        <div class="braindump-writer-actions">
          <button id="braindump-voice-btn" onclick="toggleBraindumpVoiceCapture()" class="braindump-writer-tool ${a?"is-recording":""}" ${r.braindumpVoiceTranscribing?"disabled":""} aria-label="Voice input" title="${s?"Voice + AI cleanup":"Voice capture"}">
            ${a?`
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="7" width="10" height="10" rx="2"/></svg>
            `:`
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
            `}
          </button>
          <button id="braindump-process-btn" onclick="processBraindump()" class="braindump-writer-process" ${!e.trim()||a?"disabled":""}>
            Process
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

      <div class="braindump-writer-body">
        <textarea id="braindump-textarea" class="braindump-writer-textarea"
          placeholder="Just write."
          spellcheck="true"
          oninput="state.braindumpRawText = this.value; document.getElementById('braindump-process-btn').disabled = !this.value.trim() || state.braindumpVoiceRecording || state.braindumpVoiceTranscribing; var lines = this.value.split('\\n').filter(l=>l.trim()).length; var words = this.value.trim() ? this.value.trim().split(/\\s+/).length : 0; document.getElementById('braindump-count').textContent = lines > 0 ? lines + ' line' + (lines!==1?'s':'') + ' \\u00b7 ' + words + ' word' + (words!==1?'s':'') : '';"
        >${A(e)}</textarea>
      </div>

      <div class="braindump-writer-hints">
        <span># area</span>
        <span>@ tag</span>
        <span>& person</span>
        <span>! date</span>
      </div>

      <div id="braindump-voice-error" class="braindump-voice-error" style="${r.braindumpVoiceError?"":"display:none"}">${r.braindumpVoiceError?A(r.braindumpVoiceError):""}</div>
    </div>
  `}function Y4(){const e=r.braindumpParsedItems,t=e.filter(s=>s.included&&s.type==="task").length,n=e.filter(s=>s.included&&s.type==="note").length,a=r.braindumpFullPage||Pe();return`
    <div class="braindump-overlay" onclick="if(event.target===this)closeBraindump()">
      <div class="braindump-container braindump-review ${a?"braindump-fullpage":""}">
        <div class="braindump-header">
          <div class="flex items-center gap-3">
            <button onclick="backToInput()" class="braindump-back" aria-label="Back">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
            </button>
            <div>
              <h2 class="text-lg font-bold text-[var(--text-primary)]">Review</h2>
              <p class="text-xs text-[var(--text-muted)]">${t} task${t!==1?"s":""}, ${n} note${n!==1?"s":""}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="state.braindumpFullPage = !state.braindumpFullPage; render()" class="braindump-expand-btn hide-mobile" aria-label="${a?"Collapse":"Expand"}" title="${a?"Collapse":"Expand"}">
              ${a?`
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
              `:`
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
              `}
            </button>
            <button onclick="closeBraindump()" class="braindump-close" aria-label="Close">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
          </div>
        </div>

        ${r.braindumpAIError?`
          <div class="braindump-ai-error">
            <span class="text-xs font-semibold">AI failed:</span>
            <span class="text-xs">${A(r.braindumpAIError)}</span>
          </div>
        `:""}

        <div class="braindump-body braindump-items-list">
          ${e.map((s,o)=>J4(s,o)).join("")}
        </div>

        <div class="braindump-footer">
          <span class="text-xs text-[var(--text-muted)]">${e.filter(s=>s.included).length} of ${e.length} selected</span>
          <button onclick="submitBraindump()" class="braindump-submit-btn" ${e.filter(s=>s.included).length===0?"disabled":""}>
            Add All
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          </button>
        </div>
      </div>
    </div>
  `}function J4(e,t){const n=r.braindumpEditingIndex===t;e.areaId&&r.taskAreas.find(i=>i.id===e.areaId);const a=r.taskAreas.map(i=>`<option value="${i.id}" ${e.areaId===i.id?"selected":""}>${A(i.name)}</option>`).join(""),s=r.taskPeople.filter(i=>!e.people.includes(i.id)),o=r.taskLabels.filter(i=>!e.labels.includes(i.id));return`
    <div class="braindump-item ${e.included?"":"braindump-item-excluded"}">
      <div class="braindump-item-top">
        <label class="braindump-item-check">
          <input type="checkbox" ${e.included?"checked":""}
            onchange="toggleBraindumpItemInclude(${t})" />
        </label>

        <div class="braindump-type-toggle" onclick="toggleBraindumpItemType(${t})">
          <span class="braindump-type-label ${e.type==="task"?"active":""}">Task</span>
          <span class="braindump-type-label ${e.type==="note"?"active":""}">Note</span>
        </div>

        <button onclick="removeBraindumpItem(${t})" class="braindump-item-remove" aria-label="Remove">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>

      <div class="braindump-item-title" onclick="editBraindumpItem(${t})">
        ${n?`
          <input id="braindump-edit-${t}" type="text" class="braindump-edit-input"
            value="${A(e.title)}"
            onkeydown="if(event.key==='Enter'){saveBraindumpItemEdit(${t});event.preventDefault()}else if(event.key==='Escape')cancelBraindumpItemEdit()"
            onblur="saveBraindumpItemEdit(${t})" />
        `:`
          <span class="braindump-title-text">${A(e.title)}</span>
        `}
      </div>

      <div class="braindump-meta-row">
        <div class="braindump-meta-field">
          <span class="braindump-meta-label">Area</span>
          <select class="braindump-meta-select" onchange="setBraindumpItemArea(${t}, this.value || null)">
            <option value="" ${e.areaId?"":"selected"}>No Area</option>
            ${a}
          </select>
        </div>

        <div class="braindump-meta-field">
          <span class="braindump-meta-label">People</span>
          <div class="braindump-pills-row">
            ${e.people.map(i=>{const l=r.taskPeople.find(d=>d.id===i);return l?`
                <span class="braindump-pill" style="--pill-color: ${oe(l.color)}">
                  ${A(l.name)}
                  <button onclick="event.stopPropagation(); removeBraindumpItemPerson(${t}, '${i}')" class="braindump-pill-remove">&times;</button>
                </span>
              `:""}).join("")}
            ${s.length>0?`
              <select class="braindump-add-select" onchange="if(this.value){addBraindumpItemPerson(${t}, this.value); this.value=''}">
                <option value="">+ Add</option>
                ${s.map(i=>`<option value="${i.id}">${A(i.name)}</option>`).join("")}
              </select>
            `:""}
          </div>
        </div>

        <div class="braindump-meta-field">
          <span class="braindump-meta-label">Tags</span>
          <div class="braindump-pills-row">
            ${e.labels.map(i=>{const l=r.taskLabels.find(d=>d.id===i);return l?`
                <span class="braindump-pill" style="--pill-color: ${oe(l.color)}">
                  ${A(l.name)}
                  <button onclick="event.stopPropagation(); removeBraindumpItemLabel(${t}, '${i}')" class="braindump-pill-remove">&times;</button>
                </span>
              `:""}).join("")}
            ${o.length>0?`
              <select class="braindump-add-select" onchange="if(this.value){addBraindumpItemLabel(${t}, this.value); this.value=''}">
                <option value="">+ Add</option>
                ${o.map(i=>`<option value="${i.id}">${A(i.name)}</option>`).join("")}
              </select>
            `:""}
          </div>
        </div>

        ${e.deferDate||e.dueDate?`
          <div class="braindump-meta-field">
            <span class="braindump-meta-label">Dates</span>
            <div class="braindump-pills-row">
              ${e.deferDate?`
                <span class="braindump-pill braindump-pill-date">
                  Defer: ${e.deferDate}
                  <button onclick="event.stopPropagation(); clearBraindumpItemDate(${t})" class="braindump-pill-remove">&times;</button>
                </span>
              `:""}
              ${e.dueDate?`
                <span class="braindump-pill braindump-pill-date">
                  Due: ${e.dueDate}
                  <button onclick="event.stopPropagation(); clearBraindumpItemDate(${t})" class="braindump-pill-remove">&times;</button>
                </span>
              `:""}
            </div>
          </div>
        `:""}
      </div>
    </div>
  `}function X4(){return`
    <div class="braindump-overlay">
      <div class="braindump-container">
        <div class="braindump-header">
          <div class="flex items-center gap-3">
            <div class="braindump-icon">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9.5 2a5.5 5.5 0 0 1 5 7.7c.4.4.8.9 1 1.5a3.5 3.5 0 0 1-1.5 6.8H9.5a5.5 5.5 0 0 1 0-11z"/>
                <path d="M14 13.5a3 3 0 0 0-5 0"/>
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-bold text-[var(--text-primary)]">Braindump</h2>
              <p class="text-xs text-[var(--text-muted)]">AI is analyzing your text...</p>
            </div>
          </div>
          <button onclick="closeBraindump()" class="braindump-close" aria-label="Close">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>

        <div class="braindump-processing-body">
          <div class="braindump-spinner"></div>
          <p class="text-base font-semibold text-[var(--text-primary)] mt-4">Thinking...</p>
          <p class="text-sm text-[var(--text-muted)] mt-1">Splitting, classifying, and extracting metadata</p>
        </div>
      </div>
    </div>
  `}function Q4(){return`
    <div class="braindump-overlay">
      <div class="braindump-success">
        <svg class="w-12 h-12 text-[var(--success)] mb-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <p class="text-base font-semibold text-[var(--text-primary)]">${r.braindumpSuccessMessage||"Done!"}</p>
      </div>
    </div>
  `}function Rs(e){return e?(typeof e=="string"?new Date(e):new Date(typeof e=="number"?e:parseInt(e,10))).toLocaleString(void 0,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}):"Never"}function ra(e){return`<span class="w-2 h-2 rounded-full flex-shrink-0 ${e?"bg-[var(--success)]":"bg-[var(--text-muted)]/40"}"></span>`}function Z4(){const e=Hc(),t=e.totalSaves>0?(e.successfulSaves/e.totalSaves*100).toFixed(0):"--",n=e.totalLoads>0?(e.successfulLoads/e.totalLoads*100).toFixed(0):"--",a=r.githubSyncDirty?'<span class="text-[var(--warning)]">Unsaved changes</span>':'<span class="text-[var(--success)]">Clean</span>',s=e.lastError?`<span class="text-[var(--danger)] text-[10px]">${A(e.lastError.message)} (${Rs(e.lastError.timestamp)})</span>`:'<span class="text-[var(--text-muted)]">None</span>',o=(e.recentEvents||[]).slice(0,10);return`
    <details class="sb-card rounded-lg bg-[var(--bg-card)] group">
      <summary class="px-5 py-4 cursor-pointer select-none list-none flex items-center justify-between">
        <div class="flex items-center gap-2">
          <h3 class="font-semibold text-[var(--text-primary)] text-sm">Sync Health</h3>
          <span class="text-xs text-[var(--text-muted)]">${t}% save success</span>
        </div>
        <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="6 9 12 15 18 9"/></svg>
      </summary>
      <div class="px-5 pb-4 border-t border-[var(--border-light)] space-y-3">
        <div class="grid grid-cols-2 gap-3 text-xs mt-3">
          <div class="p-2 rounded-md bg-[var(--bg-secondary)]">
            <div class="text-[var(--text-muted)] mb-0.5">Saves</div>
            <div class="font-medium">${e.successfulSaves}/${e.totalSaves} (${t}%)</div>
          </div>
          <div class="p-2 rounded-md bg-[var(--bg-secondary)]">
            <div class="text-[var(--text-muted)] mb-0.5">Loads</div>
            <div class="font-medium">${e.successfulLoads}/${e.totalLoads} (${n}%)</div>
          </div>
          <div class="p-2 rounded-md bg-[var(--bg-secondary)]">
            <div class="text-[var(--text-muted)] mb-0.5">Avg Latency</div>
            <div class="font-medium">${e.avgSaveLatencyMs||0}ms</div>
          </div>
          <div class="p-2 rounded-md bg-[var(--bg-secondary)]">
            <div class="text-[var(--text-muted)] mb-0.5">Status</div>
            <div class="font-medium">${a}</div>
          </div>
        </div>
        <div class="text-xs">
          <span class="text-[var(--text-muted)]">Last error:</span> ${s}
        </div>
        ${o.length>0?`
          <div class="text-xs">
            <div class="text-[var(--text-muted)] mb-1.5">Recent sync events:</div>
            <div class="space-y-1 max-h-40 overflow-y-auto">
              ${o.map(i=>{const l=i.status==="success"?"text-[var(--success)]":"text-[var(--danger)]",d=new Date(i.timestamp).toLocaleTimeString(void 0,{hour:"numeric",minute:"2-digit",second:"2-digit"});return`<div class="flex items-center gap-2 py-0.5">
                  <span class="w-1.5 h-1.5 rounded-full flex-shrink-0 ${i.status==="success"?"bg-[var(--success)]":"bg-[var(--danger)]"}"></span>
                  <span class="${l} font-medium">${A(i.type)}</span>
                  <span class="text-[var(--text-muted)] flex-1">${i.details?A(i.details):""}</span>
                  <span class="text-[var(--text-muted)]">${d}</span>
                  ${i.latencyMs?`<span class="text-[var(--text-muted)]">${i.latencyMs}ms</span>`:""}
                </div>`}).join("")}
            </div>
          </div>
        `:""}
        <div class="flex gap-2 pt-2 border-t border-[var(--border-light)]">
          <button onclick="window.saveToGithub().then(() => window.render())" class="px-3 py-1.5 bg-[var(--accent)] text-white rounded-lg text-xs font-medium hover:bg-[var(--accent-dark)] transition">Force Push</button>
          <button onclick="window.loadCloudData().then(() => window.render())" class="px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-xs font-medium hover:bg-[var(--bg-tertiary)] transition">Force Pull</button>
        </div>
      </div>
    </details>
  `}function xe(e,t,n,a=null){return`
    <div class="flex items-center justify-between py-2 border-b border-[var(--border-light)]">
      <span class="text-sm text-[var(--text-secondary)]">${e}</span>
      <input type="number" step="1" inputmode="numeric" value="${t}"
        class="input-field-sm w-20 text-center"
        onchange="window.updateWeight('${n}', ${a?`'${a}'`:"null"}, this.value)">
    </div>
  `}function fc(e,{connected:t,workerUrl:n,apiKey:a,lastSync:s,setUrlFn:o,setKeyFn:i,connectFn:l,disconnectFn:d,syncFn:c,checkStatusFn:h,isLast:v=!1}){const f=n&&a,p=Rs(s),m=v?"":"border-b border-[var(--border-light)]";return t?`
      <div class="py-3 ${m}">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5 min-w-0">
            ${ra(!0)}
            <span class="text-sm font-medium text-[var(--text-primary)]">${e}</span>
            <span class="text-xs text-[var(--text-muted)]">${p}</span>
          </div>
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <button onclick="window.${c}()" class="px-2.5 py-1 bg-[var(--accent)] text-white rounded-md text-xs font-medium hover:bg-[var(--accent-dark)] transition">Sync</button>
            <button onclick="window.${d}(); window.render()" class="px-2.5 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-md text-xs font-medium hover:bg-[var(--bg-tertiary)] transition">Disconnect</button>
          </div>
        </div>
        <details class="mt-2">
          <summary class="text-xs text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-secondary)] select-none">Configure</summary>
          <div class="mt-2 space-y-2 pl-4">
            <div>
              <label class="text-xs text-[var(--text-muted)] block mb-1">Worker URL</label>
              <input type="url" value="${n}" placeholder="https://..."
                class="input-field-sm w-full"
                onchange="window.${o}(this.value)">
            </div>
            <div>
              <label class="text-xs text-[var(--text-muted)] block mb-1">API Key</label>
              <input type="password" value="${a}" placeholder="Shared secret"
                class="input-field-sm w-full"
                onchange="window.${i}(this.value)">
            </div>
          </div>
        </details>
      </div>
    `:`
    <div class="py-3 ${m}">
      <div class="flex items-center justify-between gap-3 mb-3">
        <div class="flex items-center gap-2.5">
          ${ra(!1)}
          <span class="text-sm font-medium text-[var(--text-primary)]">${e}</span>
          <span class="text-xs text-[var(--text-muted)]">Not connected</span>
        </div>
      </div>
      <div class="space-y-2 pl-4 mb-3">
        <div>
          <label class="text-xs text-[var(--text-muted)] block mb-1">Worker URL</label>
          <input type="url" value="${n}" placeholder="https://..."
            class="input-field-sm w-full"
            onchange="window.${o}(this.value)">
        </div>
        <div>
          <label class="text-xs text-[var(--text-muted)] block mb-1">API Key</label>
          <input type="password" value="${a}" placeholder="Shared secret"
            class="input-field-sm w-full"
            onchange="window.${i}(this.value)">
        </div>
      </div>
      <div class="flex items-center gap-2 pl-4">
        <button onclick="window.${l}()" class="px-3 py-1.5 bg-[var(--accent)] text-white rounded-md text-xs font-medium hover:bg-[var(--accent-dark)] transition ${f?"":"opacity-50 cursor-not-allowed"}" ${f?"":"disabled"}>Connect</button>
        ${h?`<button onclick="window.${h}()" class="px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md text-xs font-medium hover:bg-[var(--bg-tertiary)] transition ${f?"":"opacity-50 cursor-not-allowed"}" ${f?"":"disabled"}>Check Status</button>`:""}
      </div>
    </div>
  `}function eT(){const e=$e(),t=r.gcalTokenExpired,n=r.gcalCalendarsLoading,a=r.gcalError,s=r.gcalCalendarList||[],o=mr(),i=tr(),l=localStorage.getItem(Ki),d=Rs(l?parseInt(l,10):null),c=localStorage.getItem(js),h=Rs(c?parseInt(c,10):null),v=a?a.match(/https?:\/\/[^\s]+/):null,f=v?v[0]:"",p=s.filter(m=>m.accessRole==="owner"||m.accessRole==="writer");return e?t?`
      <div class="py-3 border-b border-[var(--border-light)]">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full flex-shrink-0 bg-[var(--warning)]"></span>
            <span class="text-sm font-medium text-[var(--text-primary)]">Google Calendar</span>
            <span class="text-xs text-[var(--warning)]">Session expired</span>
          </div>
          <div class="flex items-center gap-1.5">
            <button onclick="window.reconnectGCal()" class="px-2.5 py-1 bg-[var(--accent)] text-white rounded-md text-xs font-medium hover:bg-[var(--accent-dark)] transition">Reconnect</button>
            <button onclick="window.disconnectGCal()" class="px-2.5 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-md text-xs font-medium hover:bg-[var(--bg-tertiary)] transition">Disconnect</button>
          </div>
        </div>
      </div>
    `:`
    <div class="py-3 border-b border-[var(--border-light)]">
      <div class="flex items-center justify-between gap-3 mb-3">
        <div class="flex items-center gap-2.5 min-w-0">
          ${ra(!0)}
          <span class="text-sm font-medium text-[var(--text-primary)]">Google Calendar</span>
          <span class="text-xs text-[var(--text-muted)]">${d}</span>
        </div>
        <div class="flex items-center gap-1.5 flex-shrink-0">
          <button onclick="window.syncGCalNow()" class="px-2.5 py-1 bg-[var(--accent)] text-white rounded-md text-xs font-medium hover:bg-[var(--accent-dark)] transition">Sync</button>
          <button onclick="window.disconnectGCal()" class="px-2.5 py-1 bg-[var(--bg-secondary)] text-[var(--text-secondary)] rounded-md text-xs font-medium hover:bg-[var(--bg-tertiary)] transition">Disconnect</button>
        </div>
      </div>

      ${n?`
        <p class="text-xs text-[var(--text-muted)] pl-4 mb-2">Loading calendars...</p>
      `:a?`
        <div class="ml-4 mb-2 p-2.5 rounded-md bg-[color-mix(in_srgb,var(--warning)_8%,transparent)] border border-[color-mix(in_srgb,var(--warning)_25%,transparent)]">
          <p class="text-xs text-[var(--warning)]">${A(a)}</p>
          ${f?`<a href="${A(f)}" target="_blank" rel="noopener noreferrer" class="text-[11px] font-medium text-[var(--warning)] underline">Open API setup</a>`:""}
          <button onclick="window.fetchCalendarList()" class="ml-2 px-2 py-1 bg-white border border-[color-mix(in_srgb,var(--warning)_30%,transparent)] rounded-md text-[11px] font-medium text-[var(--warning)] hover:bg-[color-mix(in_srgb,var(--warning)_12%,transparent)] transition">Retry</button>
        </div>
      `:s.length>0?`
        <div class="pl-4 space-y-3 mb-2">
          <div>
            <label class="text-xs text-[var(--text-muted)] block mb-1.5">Show events from</label>
            <div class="space-y-1 max-h-36 overflow-y-auto">
              ${s.map(m=>`
                <label class="flex items-center gap-2 px-1.5 py-0.5 rounded-md hover:bg-[var(--bg-secondary)] cursor-pointer">
                  <input type="checkbox" ${o.includes(m.id)?"checked":""}
                    onchange="window.toggleCalendarSelection('${m.id.replace(/'/g,"\\'")}')"
                    class="rounded text-[var(--accent)] focus:ring-[var(--accent)]">
                  <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background: ${m.backgroundColor}"></span>
                  <span class="text-xs text-[var(--text-primary)] truncate">${A(m.summary)}</span>
                </label>
              `).join("")}
            </div>
          </div>
          <div>
            <label class="text-xs text-[var(--text-muted)] block mb-1">Push tasks to</label>
            <select onchange="window.setTargetCalendar(this.value)"
              class="input-field-sm w-full">
              ${p.map(m=>`
                <option value="${A(m.id)}" ${m.id===i?"selected":""}>${A(m.summary)}</option>
              `).join("")}
            </select>
          </div>
          <div class="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border-light)]">
            <div class="min-w-0">
              <span class="text-xs text-[var(--text-muted)]">Contacts sync · ${h}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button onclick="window.forceFullContactsResync()" class="px-2 py-1 bg-[var(--bg-secondary)] text-[var(--text-muted)] rounded-md text-[11px] font-medium hover:bg-[var(--bg-tertiary)] transition ${r.gcontactsSyncing?"opacity-60 cursor-not-allowed":""}" ${r.gcontactsSyncing?"disabled":""} title="Clear cache and re-fetch all contacts">
                Full Resync
              </button>
              <button onclick="window.syncGoogleContactsNow()" class="px-2 py-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md text-[11px] font-medium hover:bg-[var(--bg-tertiary)] transition ${r.gcontactsSyncing?"opacity-60 cursor-not-allowed":""}" ${r.gcontactsSyncing?"disabled":""}>
                ${r.gcontactsSyncing?"Syncing...":"Sync Contacts"}
              </button>
            </div>
          </div>
        </div>
        ${r.gcontactsError?`<p class="text-[11px] text-[var(--warning)] pl-4 mb-1">${A(r.gcontactsError)}</p>`:""}
      `:'<p class="text-xs text-[var(--text-muted)] pl-4 mb-2">No calendars found.</p>'}
    </div>
  `:`
      <div class="py-3 border-b border-[var(--border-light)]">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            ${ra(!1)}
            <span class="text-sm font-medium text-[var(--text-primary)]">Google Calendar</span>
            <span class="text-xs text-[var(--text-muted)]">Not connected</span>
          </div>
          <button onclick="window.connectGCal()" class="px-3 py-1.5 bg-[var(--accent)] text-white rounded-md text-xs font-medium hover:bg-[var(--accent-dark)] transition">Connect</button>
        </div>
      </div>
    `}function tT(){const e=dn(),t=!!e;return`
    <div class="py-3">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          ${ra(t)}
          <span class="text-sm font-medium text-[var(--text-primary)]">AI Classification</span>
          <span class="text-xs text-[var(--text-muted)]">${t?"Configured":"Not configured"}</span>
        </div>
      </div>
      <details class="mt-2">
        <summary class="text-xs text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-secondary)] select-none">${t?"Change API key":"Configure API key"}</summary>
        <div class="mt-2 pl-4">
          <div class="flex gap-2 mb-1.5">
            <input type="password" id="anthropic-key-input" value="${e}"
              placeholder="sk-ant-..."
              class="input-field-sm flex-1">
            <button onclick="window.setAnthropicKey(document.getElementById('anthropic-key-input').value); window.render()"
              class="px-3 py-1.5 bg-[var(--accent)] text-white rounded-md text-xs font-medium hover:bg-[var(--accent-dark)] transition">Save</button>
          </div>
          <p class="text-[11px] text-[var(--text-muted)]">
            Get a key at <a href="https://console.anthropic.com/settings/keys" target="_blank" class="sb-link text-[11px]">console.anthropic.com</a>. Uses Claude Haiku 4.5.
          </p>
        </div>
      </details>
    </div>
  `}function nT(){return`
    <div class="py-3 border-b border-[var(--border-light)]">
      <h4 class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2.5">Data Management</h4>
      <div class="flex flex-col sm:flex-row flex-wrap gap-2">
        <button onclick="window.exportData()" class="sb-btn px-3 py-2 sm:py-1.5 rounded-md text-xs font-medium">Export Data</button>
        <button onclick="window.exportMarkdown()" class="sb-btn px-3 py-2 sm:py-1.5 rounded-md text-xs font-medium">Export Markdown</button>
        <label class="sb-btn px-3 py-2 sm:py-1.5 rounded-md text-xs font-medium cursor-pointer text-center">
          Import Data
          <input type="file" accept=".json" class="hidden" onchange="window.importData(event)">
        </label>
        <button onclick="window.forceHardRefresh()" class="px-3 py-2 sm:py-1.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-md text-xs font-medium hover:bg-[var(--accent)]/20 transition">Force Refresh</button>
      </div>
    </div>
  `}function rT(){const e=r.tasksData.filter(s=>s?.isNote),t=e.filter(s=>!s.completed&&s.noteLifecycleState!=="deleted").length,n=e.filter(s=>s.noteLifecycleState==="deleted").length,a=e.filter(s=>s.completed&&s.noteLifecycleState!=="deleted").length;return`
    <div class="py-3 border-b border-[var(--border-light)]">
      <div class="flex items-center justify-between mb-2.5">
        <h4 class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Note Safety</h4>
        <span class="text-[11px] text-[var(--text-muted)]">${t} active · ${n} deleted · ${a} done</span>
      </div>
      <div class="flex flex-wrap gap-2 mb-2">
        <input id="note-safety-search" type="text" placeholder="Search notes..."
          class="input-field-sm flex-1 min-w-[140px]">
        <button onclick="(() => { const q = document.getElementById('note-safety-search')?.value || ''; const rows = window.findNotesByText(q, 20); alert(rows.length ? rows.map(r => (r.title + ' [' + r.state + '] · ' + new Date(r.updatedAt).toLocaleString())).join('\\n') : 'No matching notes found.'); })()"
          class="sb-btn px-2.5 py-1.5 rounded-md text-xs font-medium">Find</button>
      </div>
      <div class="flex flex-wrap gap-1.5">
        <button onclick="(() => { const rows = window.getRecentNoteChanges(20); alert(rows.length ? rows.map(r => (r.title + ' [' + r.state + '] · ' + r.lastAction + ' · ' + new Date(r.updatedAt).toLocaleString())).join('\\n') : 'No recent note changes found.'); })()"
          class="px-2.5 py-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md text-[11px] font-medium hover:bg-[var(--bg-tertiary)] transition">Recent Changes</button>
        <button onclick="(() => { const rows = window.getDeletedNotes(20); alert(rows.length ? rows.map(r => (r.title + ' · deleted ' + new Date(r.deletedAt).toLocaleString() + ' · id=' + r.id)).join('\\n') : 'Trash is empty.'); })()"
          class="px-2.5 py-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md text-[11px] font-medium hover:bg-[var(--bg-tertiary)] transition">Deleted</button>
        <button onclick="(() => { const latest = window.getDeletedNotes(1)[0]; if (!latest) { alert('No deleted note to restore.'); return; } const ok = window.restoreDeletedNote(latest.id, true); alert(ok ? ('Restored: ' + latest.title) : 'Could not restore note.'); })()"
          class="px-2.5 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-md text-[11px] font-medium hover:bg-[var(--accent)]/20 transition">Restore Latest</button>
        <button onclick="(() => { const info = window.createNoteLocalBackup(); alert('Backup saved locally: ' + info.noteCount + ' notes at ' + new Date(info.createdAt).toLocaleString()); })()"
          class="px-2.5 py-1 bg-[var(--accent)] text-white rounded-md text-[11px] font-medium hover:bg-[var(--accent-dark)] transition">Backup</button>
      </div>
    </div>
  `}function aT(){const e=window.getGCalOfflineQueue?.()||[];return`
    <div class="py-3 border-b border-[var(--border-light)]">
      <div class="flex items-center justify-between mb-2.5">
        <h4 class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Offline Queue</h4>
        <span class="text-[11px] text-[var(--text-muted)]">${e.length} queued</span>
      </div>
      <div class="flex items-center gap-2 mb-2">
        <button onclick="window.retryGCalOfflineQueue()" class="px-2.5 py-1 bg-[var(--accent)] text-white rounded-md text-[11px] font-medium hover:bg-[var(--accent-dark)] transition ${e.length?"":"opacity-50 cursor-not-allowed"}" ${e.length?"":"disabled"}>Retry All</button>
        <button onclick="window.clearGCalOfflineQueue()" class="px-2.5 py-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md text-[11px] font-medium hover:bg-[var(--bg-tertiary)] transition ${e.length?"":"opacity-50 cursor-not-allowed"}" ${e.length?"":"disabled"}>Clear</button>
      </div>
      ${e.length?`
        <div class="space-y-1.5 max-h-40 overflow-auto">
          ${e.map(t=>`
            <div class="px-2.5 py-1.5 rounded-md bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-between gap-2 text-[11px]">
              <div class="min-w-0">
                <span class="font-medium text-[var(--text-primary)]">${t.type}</span>
                <span class="text-[var(--text-muted)] ml-1">${new Date(t.createdAt).toLocaleString()}</span>
                ${t.lastError?`<span class="text-[var(--warning)] ml-1">${t.lastError}</span>`:""}
              </div>
              <button onclick="window.removeGCalOfflineQueueItem('${t.id}')" class="text-[11px] px-1.5 py-0.5 rounded-md bg-white border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex-shrink-0">Remove</button>
            </div>
          `).join("")}
        </div>
      `:""}
    </div>
  `}function sT(){const e=r.conflictNotifications||[];return`
    <div class="py-3 border-b border-[var(--border-light)]">
      <div class="flex items-center justify-between mb-2.5">
        <h4 class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">Conflict Center</h4>
        <span class="text-[11px] text-[var(--text-muted)]">${e.length} items</span>
      </div>
      <div class="flex items-center gap-2 mb-2">
        <button onclick="window.clearConflictNotifications()" class="px-2.5 py-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md text-[11px] font-medium hover:bg-[var(--bg-tertiary)] transition ${e.length?"":"opacity-50 cursor-not-allowed"}" ${e.length?"":"disabled"}>Clear All</button>
      </div>
      ${e.length?`
        <div class="space-y-1.5 max-h-40 overflow-auto">
          ${e.map(t=>`
            <div class="px-2.5 py-1.5 rounded-md border border-[color-mix(in_srgb,var(--warning)_25%,transparent)] bg-[color-mix(in_srgb,var(--warning)_8%,transparent)] flex items-center justify-between gap-2 text-[11px]">
              <div class="min-w-0">
                <span class="font-medium text-[var(--warning)]">${t.entity||"entity"} · ${t.mode||"policy"}</span>
                <span class="text-[var(--warning)] ml-1">${t.reason||""}</span>
              </div>
              <button onclick="window.dismissConflictNotification('${t.id}')" class="text-[11px] px-1.5 py-0.5 rounded-md bg-white border border-[color-mix(in_srgb,var(--warning)_30%,transparent)] text-[var(--warning)] hover:bg-[color-mix(in_srgb,var(--warning)_12%,transparent)] flex-shrink-0">Dismiss</button>
            </div>
          `).join("")}
        </div>
      `:""}
    </div>
  `}function oT(){const e=r.renderPerf||{lastMs:0,avgMs:0,maxMs:0,count:0};return`
    <div class="py-3">
      <h4 class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2.5">Client Profiling</h4>
      <div class="grid grid-cols-4 gap-2 text-center">
        ${[["Last",e.lastMs],["Avg",e.avgMs],["Max",e.maxMs],["Samples",e.count]].map(([t,n])=>`
          <div class="py-2 rounded-md bg-[var(--bg-secondary)] border border-[var(--border)]">
            <div class="text-[11px] text-[var(--text-muted)]">${t}</div>
            <div class="text-sm font-semibold text-[var(--text-primary)]">${n}${t!=="Samples"?" ms":""}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `}function iT(){const e=r.currentUser,t=sn(),n=Pn(),a=$e(),s=[t,n,a].filter(Boolean).length;return`
    <div class="space-y-4">
      ${e?`
      <div class="sb-card rounded-lg p-5 bg-[var(--bg-card)]">
        <div class="flex items-center gap-4">
          ${e.photoURL?`<img src="${A(e.photoURL)}" alt="" class="w-10 h-10 rounded-full border border-[var(--border)]" referrerpolicy="no-referrer">`:`<div class="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-base font-semibold">${(e.displayName||e.email||"?")[0].toUpperCase()}</div>`}
          <div class="flex-1 min-w-0">
            <p class="font-medium text-[var(--text-primary)] truncate">${A(e.displayName||"User")}</p>
            <p class="text-xs text-[var(--text-muted)] truncate">${A(e.email||"")}</p>
          </div>
          <button onclick="signOutUser()" class="px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-xs font-medium hover:bg-[var(--bg-tertiary)] transition">
            Sign Out
          </button>
        </div>
      </div>
      `:""}

      <!-- Appearance -->
      <div class="sb-card rounded-lg p-5 bg-[var(--bg-card)]">
        <h3 class="font-semibold text-[var(--text-primary)] text-sm mb-3">Appearance</h3>

        <!-- Light / Dark toggle — Geist segmented control -->
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm text-[var(--text-secondary)]">Color mode</span>
          <div class="inline-flex rounded-lg border border-[var(--border)] overflow-hidden">
            <button onclick="window.setColorMode('light')"
              class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${Yr()==="light"?"bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm":"bg-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              Light
            </button>
            <button onclick="window.setColorMode('dark')"
              class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${Yr()==="dark"?"bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm":"bg-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              Dark
            </button>
          </div>
        </div>

        <!-- Theme selector -->
        <span class="text-sm text-[var(--text-secondary)] block mb-2">Theme</span>
        <div class="flex gap-3">
          ${Object.entries(yh).map(([o,i])=>`
            <button onclick="window.setTheme('${o}')"
              class="flex-1 p-3 rounded-lg border-2 text-left transition-all ${us()===o?"border-[var(--accent)] bg-[var(--accent)]/5":"border-[var(--border)] hover:border-[var(--accent)]/50"}">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-sm font-semibold text-[var(--text-primary)]">${i.name}</span>
                ${us()===o?'<span class="text-[10px] bg-[var(--accent)] text-white px-1.5 py-0.5 rounded-full">Active</span>':""}
              </div>
              <div class="flex gap-1.5">
                ${o==="simplebits"?`
                  <div class="w-5 h-5 rounded-full bg-[#F7F6F4] border border-[var(--border)]"></div>
                  <div class="w-5 h-5 rounded-full bg-[#E5533D]"></div>
                  <div class="w-5 h-5 rounded-full bg-[#1a1a1a]"></div>
                `:o==="geist"?`
                  <div class="w-5 h-5 rounded-full bg-[#FAFAFA] border border-[#E6E6E6]"></div>
                  <div class="w-5 h-5 rounded-full bg-[#0070F3]"></div>
                  <div class="w-5 h-5 rounded-full bg-[#000000]"></div>
                `:`
                  <div class="w-5 h-5 rounded-full bg-[#FFFFFF] border border-[var(--border)]"></div>
                  <div class="w-5 h-5 rounded-full bg-[#147EFB]"></div>
                  <div class="w-5 h-5 rounded-full bg-[#1D1D1F]"></div>
                `}
              </div>
            </button>
          `).join("")}
        </div>
      </div>

      <!-- Cloud Sync -->
      <div class="sb-card rounded-lg p-5 bg-[var(--bg-card)]">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-semibold text-[var(--text-primary)] text-sm">Cloud Sync</h3>
          <span class="flex items-center text-xs text-[var(--text-muted)]">
            ${Gt()?'<span class="w-2 h-2 rounded-full bg-[var(--success)] mr-1.5"></span> Connected':'<span class="w-2 h-2 rounded-full bg-[var(--text-muted)]/40 mr-1.5"></span> Not connected'}
          </span>
        </div>
        <div class="flex gap-2 mb-3">
          <input type="password" id="github-token-input" value="${Gt()}"
            placeholder="ghp_xxxx or github_pat_xxxx"
            class="input-field flex-1">
          <button onclick="window.setGithubToken(document.getElementById('github-token-input').value)"
            class="sb-btn px-3 py-1.5 rounded-md text-xs font-medium">Save</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button onclick="window.saveToGithub()" class="px-3 py-1.5 bg-[var(--accent)] text-white rounded-lg text-xs font-medium hover:bg-[var(--accent-dark)] transition ${Gt()?"":"opacity-50 cursor-not-allowed"}" ${Gt()?"":"disabled"}>Sync Now</button>
          <button onclick="window.loadCloudData().then(() => window.render())" class="px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-xs font-medium hover:bg-[var(--bg-tertiary)] transition">Pull from Cloud</button>
        </div>
        ${(()=>{const o=Rc();return`<div class="flex items-center gap-1.5 mt-2 pt-2 border-t border-[var(--border-light)]">
            <span class="w-1.5 h-1.5 rounded-full ${o.hasCreds?"bg-[var(--success)]":"bg-[var(--text-muted)]/40"}"></span>
            <span class="text-[11px] text-[var(--text-muted)]">${o.hasCreds?o.count+" credential"+(o.count!==1?"s":"")+" synced to cloud":"No credentials to sync"}</span>
          </div>`})()}
      </div>

      <!-- Sync Health -->
      ${Z4()}

      <!-- Integrations -->
      <details ${r.settingsIntegrationsOpen?"open":""} ontoggle="window.settingsIntegrationsOpen = this.open" class="sb-card rounded-lg bg-[var(--bg-card)] group">
        <summary class="px-5 py-4 cursor-pointer select-none list-none flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-[var(--text-primary)] text-sm">Integrations</h3>
            <span class="text-xs text-[var(--text-muted)]">${s}/3 connected</span>
          </div>
          <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="6 9 12 15 18 9"/></svg>
        </summary>
        <div class="px-5 pb-4 border-t border-[var(--border-light)]">
          ${fc("WHOOP",{connected:t,workerUrl:fr(),apiKey:wa(),lastSync:to(),setUrlFn:"setWhoopWorkerUrl",setKeyFn:"setWhoopApiKey",connectFn:"connectWhoop",disconnectFn:"disconnectWhoop",syncFn:"syncWhoopNow",checkStatusFn:"checkWhoopStatus"})}
          ${fc("Freestyle Libre",{connected:n,workerUrl:pr(),apiKey:hr(),lastSync:no(),setUrlFn:"setLibreWorkerUrl",setKeyFn:"setLibreApiKey",connectFn:"connectLibre",disconnectFn:"disconnectLibre",syncFn:"syncLibreNow",checkStatusFn:"checkLibreStatus"})}
          ${eT()}
          ${tT()}
        </div>
      </details>

      <!-- Scoring Configuration -->
      <details ${r.settingsScoringOpen?"open":""} ontoggle="window.settingsScoringOpen = this.open" class="sb-card rounded-lg bg-[var(--bg-card)] group">
        <summary class="px-5 py-4 cursor-pointer select-none list-none flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-[var(--text-primary)] text-sm">Scoring Configuration</h3>
            <span class="text-xs text-[var(--text-muted)]">Weights & targets</span>
          </div>
          <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="6 9 12 15 18 9"/></svg>
        </summary>
        <div class="px-5 pb-5 border-t border-[var(--border-light)] pt-4 space-y-6">
          <div>
            <div class="flex justify-between items-center mb-3">
              <h4 class="text-sm font-medium text-[var(--text-primary)]">Scoring Weights</h4>
              <button onclick="window.resetWeights()" class="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-md text-xs font-medium hover:bg-[var(--accent)]/20 transition">Reset</button>
            </div>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border)]">
                <h4 class="sb-section-title text-[var(--text-secondary)] mb-2 text-xs">Prayer</h4>
                ${xe("On-time prayer",r.WEIGHTS.prayer.onTime,"prayer","onTime")}
                ${xe("Late prayer",r.WEIGHTS.prayer.late,"prayer","late")}
                ${xe("Quran (per page)",r.WEIGHTS.prayer.quran,"prayer","quran")}
              </div>
              <div class="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border)]">
                <h4 class="sb-section-title text-[var(--text-secondary)] mb-2 text-xs">Glucose</h4>
                ${xe("Avg Glucose max pts",r.WEIGHTS.glucose.avgMax,"glucose","avgMax")}
                ${xe("TIR pts per %",r.WEIGHTS.glucose.tirPerPoint,"glucose","tirPerPoint")}
                ${xe("Insulin threshold",r.WEIGHTS.glucose.insulinThreshold,"glucose","insulinThreshold")}
                ${xe("Insulin bonus",r.WEIGHTS.glucose.insulinBase,"glucose","insulinBase")}
                ${xe("Insulin penalty",r.WEIGHTS.glucose.insulinPenalty,"glucose","insulinPenalty")}
              </div>
              <div class="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border)]">
                <h4 class="sb-section-title text-[var(--text-secondary)] mb-2 text-xs">Whoop</h4>
                ${xe("Sleep >=90%",r.WEIGHTS.whoop.sleepPerfHigh,"whoop","sleepPerfHigh")}
                ${xe("Sleep 70-90%",r.WEIGHTS.whoop.sleepPerfMid,"whoop","sleepPerfMid")}
                ${xe("Sleep 50-70%",r.WEIGHTS.whoop.sleepPerfLow,"whoop","sleepPerfLow")}
                ${xe("Recovery >=66%",r.WEIGHTS.whoop.recoveryHigh,"whoop","recoveryHigh")}
                ${xe("Recovery 50-66%",r.WEIGHTS.whoop.recoveryMid,"whoop","recoveryMid")}
                ${xe("Recovery 33-50%",r.WEIGHTS.whoop.recoveryLow,"whoop","recoveryLow")}
                ${xe("Strain match",r.WEIGHTS.whoop.strainMatch,"whoop","strainMatch")}
                ${xe("High strain green",r.WEIGHTS.whoop.strainHigh,"whoop","strainHigh")}
              </div>
              <div class="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border)]">
                <h4 class="sb-section-title text-[var(--text-secondary)] mb-2 text-xs">Family Check-ins</h4>
                <p class="text-[11px] text-[var(--text-muted)] mb-2">Customize who you track. Each check-in adds points.</p>
                ${(r.familyMembers||[]).map(o=>`
                  <div class="flex items-center gap-2 mb-2">
                    <input type="number" inputmode="numeric" value="${r.WEIGHTS.family?.[o.id]??1}" min="0" step="0.5"
                      class="input-field-sm w-16 text-center"
                      onchange="window.updateWeight('family', '${A(o.id)}', this.value)">
                    <input type="text" value="${A(o.name)}" placeholder="Name"
                      class="input-field-sm flex-1"
                      onchange="window.updateFamilyMember('${A(o.id)}', this.value)">
                    <button type="button" onclick="window.removeFamilyMember('${A(o.id)}')" class="p-1.5 text-[var(--text-muted)] hover:text-[var(--danger)] rounded transition" title="Remove" aria-label="Remove ${A(o.name)}">
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                `).join("")}
                <div class="flex gap-2 mt-2">
                  <input type="text" id="new-family-member-name" placeholder="Add person..." class="input-field-sm flex-1"
                    onkeydown="if(event.key==='Enter'){event.preventDefault();window.addFamilyMember(document.getElementById('new-family-member-name').value);document.getElementById('new-family-member-name').value='';}">
                  <button type="button" onclick="const i=document.getElementById('new-family-member-name');window.addFamilyMember(i.value);i.value='';" class="px-3 py-1.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-md text-xs font-medium hover:bg-[var(--accent)]/20 transition">Add</button>
                </div>
              </div>
              <div class="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border)]">
                <h4 class="sb-section-title text-[var(--text-secondary)] mb-2 text-xs">Habits</h4>
                ${xe("Exercise",r.WEIGHTS.habits.exercise,"habits","exercise")}
                ${xe("Reading",r.WEIGHTS.habits.reading,"habits","reading")}
                ${xe("Meditation",r.WEIGHTS.habits.meditation,"habits","meditation")}
                ${xe("Water (per L)",r.WEIGHTS.habits.water,"habits","water")}
                ${xe("Vitamins",r.WEIGHTS.habits.vitamins,"habits","vitamins")}
                ${xe("Brush Teeth",r.WEIGHTS.habits.brushTeeth,"habits","brushTeeth")}
                ${xe("NoP bonus",r.WEIGHTS.habits.nopYes,"habits","nopYes")}
                ${xe("NoP penalty",r.WEIGHTS.habits.nopNo,"habits","nopNo")}
              </div>
            </div>
          </div>

          <div>
            <div class="flex justify-between items-center mb-3">
              <h4 class="text-sm font-medium text-[var(--text-primary)]">Perfect Day Targets</h4>
              <button onclick="window.resetMaxScores()" class="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-md text-xs font-medium hover:bg-[var(--accent)]/20 transition">Reset</button>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              ${["prayer","diabetes","whoop","family","habits","total"].map(o=>`
                <div class="text-center">
                  <input type="number" inputmode="numeric" value="${r.MAX_SCORES[o]}"
                    class="input-field-sm w-full text-center ${o==="total"?"border-coral":""}"
                    onchange="window.updateMaxScore('${o}', this.value)">
                  <div class="text-[11px] font-medium ${o==="total"?"text-[var(--accent)]":"text-[var(--text-secondary)]"} mt-1">${o.charAt(0).toUpperCase()+o.slice(1)}</div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </details>

      <!-- Data & Diagnostics -->
      <details ${r.settingsDataDiagOpen?"open":""} ontoggle="window.settingsDataDiagOpen = this.open" class="sb-card rounded-lg bg-[var(--bg-card)] group">
        <summary class="px-5 py-4 cursor-pointer select-none list-none flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-[var(--text-primary)] text-sm">Data & Diagnostics</h3>
          </div>
          <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="6 9 12 15 18 9"/></svg>
        </summary>
        <div class="px-5 pb-4 border-t border-[var(--border-light)]">
          ${nT()}
          ${rT()}
          ${aT()}
          ${sT()}
          ${oT()}
        </div>
      </details>
    </div>
  `}function lT(e){typeof e=="function"&&r.cleanupCallbacks.push(e)}function dT(){r.cleanupCallbacks.forEach(e=>{try{e()}catch(t){console.error("Cleanup callback error:",t)}}),r.cleanupCallbacks=[]}Object.assign(window,{state:r,getLocalDateString:he,escapeHtml:A,fmt:Me,formatSmartDate:Ne,generateTaskId:oa,isMobileViewport:Pe,isTouchDevice:nn,isMobile:el,haptic:Cc,safeOpenUrl:Mh,registerCleanup:lT,runCleanupCallbacks:dT,THINGS3_ICONS:Sc,GEIST_ICONS:Tc,getActiveIcons:ve,BUILTIN_PERSPECTIVES:Ue,NOTES_PERSPECTIVE:ut,defaultDayData:ot,saveData:cr,getTodayData:tl,updateData:qh,saveTasksData:le,toggleDailyField:Yh,updateDailyField:Jh,saveViewState:Ge,saveWeights:Pc,saveMaxScores:Xh,saveHomeWidgets:Qh,saveCollapsedNotes:Zh,getGithubToken:Gt,setGithubToken:cm,getTheme:us,setTheme:um,getColorMode:Yr,setColorMode:Fc,toggleColorMode:fm,applyStoredTheme:jc,getAccentColor:pm,getThemeColors:hm,updateSyncStatus:We,saveToGithub:mn,debouncedSaveToGithub:ol,loadCloudData:da,dismissConflictNotification:bm,clearConflictNotifications:ym,getSyncHealth:Hc,loadCloudDataWithRetry:qc,exportData:Im,importData:$m,exportMarkdown:Km,getCredentialSyncStatus:Rc,signInWithGoogle:Ry,signOutUser:By,getCurrentUser:jy,initAuth:Ku,signInWithGoogleCalendar:Hy,getLastGisErrorType:Fy,preloadGoogleIdentityServices:qu,fetchWeather:Qa,detectUserLocation:vf,initWeather:bf,loadWeatherLocation:mf,saveWeatherLocation:gf,getWhoopWorkerUrl:fr,setWhoopWorkerUrl:qy,getWhoopApiKey:wa,setWhoopApiKey:Ky,getWhoopLastSync:to,isWhoopConnected:sn,fetchWhoopData:Xu,syncWhoopNow:xa,checkAndSyncWhoop:wl,connectWhoop:Zy,disconnectWhoop:ew,checkWhoopStatus:Yy,initWhoopSync:xi,stopWhoopSyncTimers:Zu,getLibreWorkerUrl:pr,setLibreWorkerUrl:rw,getLibreApiKey:hr,setLibreApiKey:aw,getLibreLastSync:no,isLibreConnected:Pn,fetchLibreData:nf,syncLibreNow:ka,checkAndSyncLibre:Sl,connectLibre:dw,disconnectLibre:cw,checkLibreStatus:rf,initLibreSync:Si,isGCalConnected:$e,getSelectedCalendars:mr,setSelectedCalendars:Cl,getTargetCalendar:tr,setTargetCalendar:Ti,fetchCalendarList:ao,getGCalEventsForDate:Iw,pushTaskToGCalIfConnected:df,deleteGCalEventIfConnected:cf,rescheduleGCalEventIfConnected:uf,getGCalOfflineQueue:of,retryGCalOfflineQueue:Dw,clearGCalOfflineQueue:kw,removeGCalOfflineQueueItem:Sw,syncGCalNow:vn,connectGCal:_w,disconnectGCal:Mw,reconnectGCal:Pw,initGCalSync:Ii,toggleCalendarSelection:Nw,stopGCalSyncTimers:Aw,syncGoogleContactsNow:ws,initGoogleContactsSync:Ci,forceFullContactsResync:Yw,syncGSheetNow:xs,initGSheetSync:Ei,askGSheet:hf,openCalendarEventActions:d2,closeCalendarEventActions:c2,openCalendarMeetingNotes:Rp,openCalendarMeetingNotesByEventKey:Bp,openCalendarMeetingWorkspaceByEventKey:u2,closeCalendarMeetingNotes:h2,setCalendarMeetingNotesScope:f2,addDiscussionItemToMeeting:y2,toggleCalendarMobilePanel:p2,convertCalendarEventToTask:m2,startCalendarEventDrag:g2,clearCalendarEventDrag:v2,dropCalendarEventToSlot:b2,addMeetingLinkedItem:jp,handleMeetingItemInputKeydown:w2,attachCalendarSwipe:Jk,parsePrayer:Sa,calcPrayerScore:Zw,invalidateScoresCache:it,calculateScores:He,getLast30DaysData:n1,getLast30DaysStats:a1,getPersonalBests:s1,updateWeight:o1,resetWeights:i1,updateMaxScore:l1,resetMaxScores:d1,addFamilyMember:f1,removeFamilyMember:p1,updateFamilyMember:h1,getScoreTier:m1,getLevel:ks,getLevelInfo:wf,getStreakMultiplier:es,calculateDailyXP:$l,updateStreak:Dl,awardDailyXP:xf,checkAchievements:_l,markAchievementNotified:g1,getDailyFocus:v1,processGamification:kf,saveXP:Al,saveStreak:Ml,saveAchievements:io,saveCategoryWeights:Pl,updateCategoryWeight:b1,resetCategoryWeights:y1,rebuildGamification:Sf,createArea:Ys,updateArea:di,deleteArea:Pm,getAreaById:et,createCategory:Kc,updateCategory:ci,deleteCategory:Nm,getCategoryById:rt,getCategoriesByArea:Jr,createLabel:ca,updateLabel:Yc,deleteLabel:Lm,getLabelById:ua,createPerson:fa,updatePerson:Jc,deletePerson:Om,getPersonById:pa,getTasksByPerson:il,createTask:gr,updateTask:Ia,deleteTask:Nn,confirmDeleteTask:I1,toggleTaskComplete:C1,toggleFlag:E1,calculateNextRepeatDate:$i,createNextRepeatOccurrence:Ef,getRepeatUnitLabel:$f,updateRepeatUI:$1,moveTaskTo:D1,getProjectSubTasks:lo,getProjectCompletion:_1,getNextSequentialTask:A1,isProjectStalled:M1,initializeTaskOrders:Di,getFilteredTasks:_i,groupTasksByDate:W1,groupTasksByCompletionDate:U1,getTasksByCategory:_f,getTasksByLabel:Af,getTasksBySubcategory:Mf,getCurrentFilteredTasks:G1,getCurrentViewInfo:V1,toggleNoteCollapse:o0,getNotesHierarchy:Wf,noteHasChildren:ea,getNoteChildren:Uf,countAllDescendants:Gf,isDescendantOf:Ol,getNoteAncestors:ho,indentNote:Vf,outdentNote:qf,createRootNote:i0,createNoteAfter:l0,createChildNote:Yf,deleteNote:Rl,deleteNoteWithUndo:Jf,toggleNoteTask:Xf,focusNote:pn,handleNoteKeydown:d0,handleNoteBlur:c0,handleNoteFocus:u0,handleNoteInput:K1,handleNotePaste:f0,removeNoteInlineMeta:X1,initializeNoteOrders:Ai,ensureNoteSafetyMetadata:Ll,getDeletedNotes:t0,restoreDeletedNote:n0,findNotesByText:r0,getRecentNoteChanges:a0,createNoteLocalBackup:s0,runNoteIntegrityChecks:zf,zoomIntoNote:Fl,zoomOutOfNote:mo,navigateToBreadcrumb:p0,renderNotesBreadcrumb:w0,handleNoteDragStart:x0,handleNoteDragEnd:k0,handleNoteDragOver:S0,handleNoteDragLeave:T0,handleNoteDrop:I0,reorderNotes:Zf,renderNoteItem:ep,renderNotesOutliner:tp,handlePageTitleBlur:m0,handlePageTitleKeydown:g0,handleDescriptionBlur:v0,handleDescriptionKeydown:b0,handleDescriptionInput:y0,focusPageDescription:Ts,focusPageTitle:Qf,focusPageTitleForMeta:h0,buildPageMetaChipsHtml:Hl,handleDragStart:C0,handleDragEnd:E0,handleDragOver:$0,handleDragLeave:D0,handleDrop:_0,reorderTasks:np,normalizeTaskOrders:rp,setupSidebarDragDrop:A0,initSwipeActions:U0,closeActiveRow:Wl,showActionSheet:X0,hideActionSheet:Pr,initTouchDrag:N0,cancelTouchDrag:Is,isTouchDragging:ap,cancelHoldTimer:sp,initPullToRefresh:J0,createTrigger:vo,createRootTrigger:ex,createTriggerAfter:vp,createChildTrigger:bp,updateTrigger:yp,deleteTrigger:wp,indentTrigger:xp,outdentTrigger:kp,toggleTriggerCollapse:tx,zoomIntoTrigger:Sp,zoomOutOfTrigger:Tp,navigateToTriggerBreadcrumb:nx,handleTriggerKeydown:rx,handleTriggerInput:ax,handleTriggerBlur:sx,handleTriggerDragStart:ox,handleTriggerDragEnd:Ip,handleTriggerDragOver:ix,handleTriggerDragLeave:lx,handleTriggerDrop:dx,reorderTriggers:Cp,renderTriggersBreadcrumb:cx,renderTriggerItem:Ep,renderTriggersOutliner:$p,getTriggerCountForArea:ux,renderReviewMode:Mp,startReview:gx,exitReview:vx,reviewNextArea:_p,reviewPrevArea:bx,reviewEngageTask:yx,reviewPassTask:wx,reviewMarkAreaDone:xx,reviewAddTask:kx,reviewQuickAddTask:Ap,reviewHandleQuickAddKeydown:Sx,getStaleTasksForArea:ql,getTotalStaleTaskCount:px,isWeeklyReviewOverdue:hx,getDaysSinceReview:mx,createPerspective:Pp,deletePerspective:Cx,editCustomPerspective:Ex,toggleWidgetVisibility:_x,toggleWidgetSize:Ax,moveWidgetUp:Mx,moveWidgetDown:Px,handleWidgetDragStart:Nx,handleWidgetDragEnd:Lx,handleWidgetDragOver:Ox,handleWidgetDragLeave:Rx,handleWidgetDrop:Bx,resetHomeWidgets:jx,toggleEditHomeWidgets:Fx,addPerspectiveWidget:Hx,removePerspectiveWidget:zx,calendarPrevMonth:Wx,calendarNextMonth:Ux,calendarGoToday:Gx,calendarSelectDate:qx,getTasksForDate:ns,setCalendarViewMode:Vx,toggleCalendarSidebar:Kx,startUndoCountdown:Ta,executeUndo:w1,dismissUndo:Tf,renderUndoToastHtml:x1,openGlobalSearch:v4,closeGlobalSearch:nd,handleGlobalSearchInput:b4,handleGlobalSearchKeydown:y4,selectGlobalSearchResult:lh,setSearchTypeFilter:w4,renderGlobalSearchHtml:C4,parseBraindump:Np,parseBraindumpHeuristic:Pi,submitBraindumpItems:Lp,getAnthropicKey:dn,setAnthropicKey:Yx,openBraindump:$4,closeBraindump:ad,processBraindump:D4,backToInput:A4,startBraindumpVoiceCapture:ph,stopBraindumpVoiceCapture:hh,toggleBraindumpVoiceCapture:_4,toggleBraindumpItemType:M4,toggleBraindumpItemInclude:P4,removeBraindumpItem:N4,editBraindumpItem:L4,saveBraindumpItemEdit:O4,cancelBraindumpItemEdit:R4,setBraindumpItemArea:B4,addBraindumpItemLabel:j4,removeBraindumpItemLabel:F4,addBraindumpItemPerson:H4,removeBraindumpItemPerson:z4,setBraindumpItemDate:W4,clearBraindumpItemDate:U4,submitBraindump:G4,renderBraindumpOverlay:q4,renderBraindumpFAB:V4,render:Ee,switchTab:yk,switchSubTab:wk,setToday:xk,forceHardRefresh:kk,dismissCacheRefreshPrompt:bk,renderHomeTab:Hp,renderHomeWidget:Fp,homeQuickAddTask:J2,handleGSheetSavePrompt:V2,handleGSheetEditPrompt:q2,handleGSheetCancelEdit:K2,handleGSheetRefresh:Y2,renderTrackingTab:Ek,navigateTrackingDate:Ck,setBulkMonth:$k,setBulkCategory:Dk,updateBulkData:_k,updateBulkSummary:Up,getDaysInMonth:Yl,renderBulkEntryTab:Ak,renderTaskItem:Oe,buildAreaTaskListHtml:Kp,renderTasksTab:qk,renderCalendarView:Yk,createPrayerInput:Wp,createToggle:Ri,createNumberInput:Tk,createCounter:Nr,createScoreCard:On,createCard:Ik,renderSettingsTab:iT,createWeightInput:xe,openMobileDrawer:eS,closeMobileDrawer:st,renderMobileDrawer:Jl,renderBottomNav:tS,showAreaTasks:nS,showLabelTasks:rS,showPerspectiveTasks:aS,showPersonTasks:sS,showCategoryTasks:oS,scrollToContent:Nt,showAllLabelsPage:iS,showAllPeoplePage:lS,toggleSidebarAreaCollapse:dS,toggleWorkspaceSidebar:cS,initBottomNavScrollHide:uS,startInlineEdit:hS,saveInlineEdit:eh,cancelInlineEdit:th,handleInlineEditKeydown:mS,handleTaskInlineFocus:gS,handleTaskInlineBlur:vS,handleTaskInlineKeydown:bS,handleTaskInlineInput:yS,handleTaskInlinePaste:wS,focusTaskInlineTitle:xS,openNewTaskModal:kS,quickAddTask:nh,handleQuickAddKeydown:SS,toggleInlineTagInput:TS,addInlineTag:IS,toggleInlinePersonInput:CS,addInlinePerson:ES,saveAreaFromModal:KS,saveLabelFromModal:JS,savePersonFromModal:XS,saveCategoryFromModal:YS,initModalState:rh,setModalType:$S,setModalStatus:DS,toggleModalFlagged:_S,updateDateDisplay:AS,clearDateField:MS,setQuickDate:PS,openDatePicker:NS,selectArea:ji,renderAreaInput:Ps,selectCategory:ah,renderCategoryInput:So,addTag:Fi,removeTag:LS,renderTagsInput:To,addPersonModal:Hi,removePersonModal:OS,renderPeopleInput:Io,setWaitingFor:sh,renderWaitingForUI:Ns,toggleWaitingForForm:HS,applyWaitingFor:zS,toggleProjectMode:WS,setProjectType:US,linkToProject:GS,renderProjectUI:$a,setTimeEstimate:VS,renderTimeEstimateUI:ed,toggleRepeat:RS,initModalAutocomplete:BS,cleanupModalAutocomplete:Zl,closeTaskModal:jS,saveTaskFromModal:FS,savePerspectiveFromModal:QS,selectPerspectiveEmoji:ZS,selectAreaEmoji:e4,selectCategoryEmoji:t4,updateEmojiGrid:o4,toggleEmojiPicker:a4,renderTaskModalHtml:qS,renderPerspectiveModalHtml:l4,renderAreaModalHtml:d4,renderCategoryModalHtml:c4,renderLabelModalHtml:u4,renderPersonModalHtml:f4,parseDateQuery:Zp,setupInlineAutocomplete:Xl,renderInlineChips:Ms,removeInlineMeta:pS,cleanupInlineAutocomplete:yr});const cT=["currentUser","authLoading","authError","editingTaskId","editingAreaId","editingLabelId","editingPersonId","editingPerspectiveId","showTaskModal","showPerspectiveModal","showAreaModal","showLabelModal","showPersonModal","showInlineTagInput","showInlinePersonInput","activePerspective","activeFilterType","activeAreaFilter","activeLabelFilter","activePersonFilter","editingHomeWidgets","showAddWidgetPicker","draggingWidgetId","perspectiveEmojiPickerOpen","areaEmojiPickerOpen","categoryEmojiPickerOpen","emojiSearchQuery","pendingPerspectiveEmoji","pendingAreaEmoji","pendingCategoryEmoji","editingNoteId","inlineEditingTaskId","quickAddIsNote","showAllSidebarPeople","showAllSidebarLabels","mobileDrawerOpen","activeTab","activeSubTab","modalSelectedArea","modalSelectedStatus","modalSelectedToday","modalSelectedFlagged","modalSelectedTags","modalSelectedPeople","modalIsNote","modalRepeatEnabled","modalStateInitialized","modalWaitingFor","modalIsProject","modalProjectId","modalProjectType","modalTimeEstimate","draggedTaskId","dragOverTaskId","dragPosition","draggedSidebarItem","draggedSidebarType","sidebarDragPosition","calendarMonth","calendarYear","calendarSelectedDate","calendarViewMode","calendarSidebarCollapsed","calendarEventModalOpen","calendarEventModalCalendarId","calendarEventModalEventId","draggedCalendarEvent","calendarMeetingNotesEventKey","calendarMeetingNotesScope","meetingNotesByEvent","currentDate","bulkMonth","bulkYear","bulkCategory","tasksData","taskAreas","taskLabels","taskPeople","taskCategories","showCategoryModal","editingCategoryId","activeCategoryFilter","modalSelectedCategory","customPerspectives","homeWidgets","allData","WEIGHTS","MAX_SCORES","weatherData","weatherLocation","syncStatus","lastSyncTime","weekChart","breakdownChart","collapsedNotes","newTaskContext","zoomedNoteId","notesBreadcrumb","draggedNoteId","dragOverNoteId","noteDragPosition","inlineAutocompleteMeta","undoAction","undoTimerRemaining","undoTimerId","showBraindump","braindumpRawText","braindumpParsedItems","braindumpStep","braindumpEditingIndex","braindumpSuccessMessage","braindumpProcessing","braindumpAIError","braindumpFullPage","braindumpVoiceRecording","braindumpVoiceTranscribing","braindumpVoiceError","gcalEvents","gcalCalendarList","gcalSyncing","gcalTokenExpired","gcalOfflineQueue","conflictNotifications","renderPerf","showCacheRefreshPrompt","cacheRefreshPromptMessage","CATEGORY_WEIGHTS","xp","streak","achievements","dailyFocusDismissed","gsheetData","gsheetSyncing","gsheetError","gsheetPrompt","gsheetResponse","gsheetAsking","gsheetEditingPrompt","triggers","editingTriggerId","collapsedTriggers","zoomedTriggerId","triggersBreadcrumb","reviewMode","reviewAreaIndex","reviewCompletedAreas","reviewTriggersCollapsed","reviewProjectsCollapsed","reviewNotesCollapsed","lastWeeklyReview","lastSomedayReview","showGlobalSearch","globalSearchQuery","globalSearchResults","globalSearchActiveIndex","globalSearchTypeFilter","settingsIntegrationsOpen","settingsScoringOpen","settingsDevToolsOpen","settingsDataDiagOpen"];cT.forEach(e=>{Object.prototype.hasOwnProperty.call(window,e)||Object.defineProperty(window,e,{get(){return r[e]},set(t){r[e]=t},configurable:!0})});var uT=(function(){var e={base:"https://twemoji.maxcdn.com/v/14.0.2/",ext:".png",size:"72x72",className:"emoji",convert:{fromCodePoint:x,toCodePoint:R},onerror:function(){this.parentNode&&this.parentNode.replaceChild(d(this.alt,!1),this)},parse:k,replace:E,test:D},t={"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"},n=/(?:\ud83d\udc68\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffc-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb\udffd-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb-\udffd\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb-\udffe]|\ud83d\udc68\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffc-\udfff]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb\udffd-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb-\udffd\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83e\udef1\ud83c\udffb\u200d\ud83e\udef2\ud83c[\udffc-\udfff]|\ud83e\udef1\ud83c\udffc\u200d\ud83e\udef2\ud83c[\udffb\udffd-\udfff]|\ud83e\udef1\ud83c\udffd\u200d\ud83e\udef2\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\udef1\ud83c\udffe\u200d\ud83e\udef2\ud83c[\udffb-\udffd\udfff]|\ud83e\udef1\ud83c\udfff\u200d\ud83e\udef2\ud83c[\udffb-\udffe]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d\udc8f\ud83c[\udffb-\udfff]|\ud83d\udc91\ud83c[\udffb-\udfff]|\ud83e\udd1d\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d\udc8f\udc91]|\ud83e\udd1d)|(?:\ud83d[\udc68\udc69]|\ud83e\uddd1)(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf7c\udf84\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc70\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd4\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83d\ude36\u200d\ud83c\udf2b\ufe0f|\u2764\ufe0f\u200d\ud83d\udd25|\u2764\ufe0f\u200d\ud83e\ude79|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc3b\u200d\u2744\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83d\ude2e\u200d\ud83d\udca8|\ud83d\ude35\u200d\ud83d\udcab|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|\ud83d\udc08\u200d\u2b1b)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26a7\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd0c\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\udd77\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd-\uddcf\uddd1-\udddd\udec3-\udec5\udef0-\udef6]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udc8e\udc90\udc92-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5-\uded7\udedd-\udedf\udeeb\udeec\udef4-\udefc\udfe0-\udfeb\udff0]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd3f-\udd45\udd47-\udd76\udd78-\uddb4\uddb7\uddba\uddbc-\uddcc\uddd0\uddde-\uddff\ude70-\ude74\ude78-\ude7c\ude80-\ude86\ude90-\udeac\udeb0-\udeba\udec0-\udec2\uded0-\uded9\udee0-\udee7]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g,a=/\uFE0F/g,s="‍",o=/[&<>'"]/g,i=/^(?:iframe|noframes|noscript|script|select|style|textarea)$/,l=String.fromCharCode;return e;function d(_,N){return document.createTextNode(N?_.replace(a,""):_)}function c(_){return _.replace(o,g)}function h(_,N){return"".concat(N.base,N.size,"/",_,N.ext)}function v(_,N){for(var L=_.childNodes,W=L.length,z,S;W--;)z=L[W],S=z.nodeType,S===3?N.push(z):S===1&&!("ownerSVGElement"in z)&&!i.test(z.nodeName.toLowerCase())&&v(z,N);return N}function f(_){return R(_.indexOf(s)<0?_.replace(a,""):_)}function p(_,N){for(var L=v(_,[]),W=L.length,z,S,O,w,j,ee,C,Z,G,J,P,I,q;W--;){for(O=!1,w=document.createDocumentFragment(),j=L[W],ee=j.nodeValue,Z=0;C=n.exec(ee);){if(G=C.index,G!==Z&&w.appendChild(d(ee.slice(Z,G),!0)),P=C[0],I=f(P),Z=G+P.length,q=N.callback(I,N),I&&q){J=new Image,J.onerror=N.onerror,J.setAttribute("draggable","false"),z=N.attributes(P,I);for(S in z)z.hasOwnProperty(S)&&S.indexOf("on")!==0&&!J.hasAttribute(S)&&J.setAttribute(S,z[S]);J.className=N.className,J.alt=P,J.src=q,O=!0,w.appendChild(J)}J||w.appendChild(d(P,!1)),J=null}O&&(Z<ee.length&&w.appendChild(d(ee.slice(Z),!0)),j.parentNode.replaceChild(w,j))}return _}function m(_,N){return E(_,function(L){var W=L,z=f(L),S=N.callback(z,N),O,w;if(z&&S){W="<img ".concat('class="',N.className,'" ','draggable="false" ','alt="',L,'"',' src="',S,'"'),O=N.attributes(L,z);for(w in O)O.hasOwnProperty(w)&&w.indexOf("on")!==0&&W.indexOf(" "+w+"=")===-1&&(W=W.concat(" ",w,'="',c(O[w]),'"'));W=W.concat("/>")}return W})}function g(_){return t[_]}function y(){return null}function u(_){return typeof _=="number"?_+"x"+_:_}function x(_){var N=typeof _=="string"?parseInt(_,16):_;return N<65536?l(N):(N-=65536,l(55296+(N>>10),56320+(N&1023)))}function k(_,N){return(!N||typeof N=="function")&&(N={callback:N}),(typeof _=="string"?m:p)(_,{callback:N.callback||h,attributes:typeof N.attributes=="function"?N.attributes:y,base:typeof N.base=="string"?N.base:e.base,ext:N.ext||e.ext,size:N.folder||u(N.size||e.size),className:N.className||e.className,onerror:N.onerror||e.onerror})}function E(_,N){return String(_).replace(n,N)}function D(_){n.lastIndex=0;var N=n.test(_);return n.lastIndex=0,N}function R(_,N){for(var L=[],W=0,z=0,S=0;S<_.length;)W=_.charCodeAt(S++),z?(L.push((65536+(z-55296<<10)+(W-56320)).toString(16)),z=0):55296<=W&&W<=56319?z=W:L.push(W.toString(16));return L.join(N||"-")}})();let zi=!1,Ha=null,pc=!1,Xo=!1;function Wi(e=document.body){e&&uT.parse(e,{folder:"svg",ext:".svg",className:"twemoji",base:"https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/"})}function fT(){pc||typeof MutationObserver>"u"||(pc=!0,Ha=new MutationObserver(e=>{if(Xo)return;const t=new Set;for(const n of e)n.type==="childList"?n.addedNodes.forEach(a=>{a.nodeType===Node.ELEMENT_NODE?t.add(a):a.parentElement&&t.add(a.parentElement)}):n.type==="characterData"&&n.target?.parentElement&&t.add(n.target.parentElement);if(t.size!==0){Xo=!0,Ha.disconnect();try{t.forEach(n=>Wi(n))}finally{Xo=!1,document.body&&Ha.observe(document.body,{childList:!0,subtree:!0,characterData:!0})}}}),document.body&&Ha.observe(document.body,{childList:!0,subtree:!0,characterData:!0}))}function pT(){if(zi)return;zi=!0,T1(),Di(),Ai(),Ll(),ic(),!r.xp?.history?.length&&Object.keys(r.allData).length>0?Sf():kf(r.currentDate),Ee(),qc().then(()=>{Di(),Ai(),ic(),Ee(),r.githubSyncDirty&&navigator.onLine&&mn().catch(()=>{}),_o(),xi(),Si(),Ii(),Ci(),Ei()}).catch(a=>{console.warn("Cloud data load failed (will use local):",a.message),r.githubSyncDirty&&navigator.onLine&&mn().catch(()=>{}),_o(),xi(),Si(),Ii(),Ci(),Ei()}),bf(),document.addEventListener("keydown",a=>{if((a.metaKey||a.ctrlKey)&&a.key==="k"){a.preventDefault(),r.showGlobalSearch?(window.closeGlobalSearch(),Ee()):window.openGlobalSearch();return}if(!r.showGlobalSearch&&((a.metaKey||a.ctrlKey)&&a.key==="n"&&(a.preventDefault(),window.openNewTaskModal()),(a.metaKey||a.ctrlKey)&&a.shiftKey&&a.key.toLowerCase()==="d"&&(a.preventDefault(),window.openBraindump()),a.key==="Escape"&&(r.showBraindump?window.closeBraindump():r.showPerspectiveModal?(r.showPerspectiveModal=!1,r.editingPerspectiveId=null,r.pendingPerspectiveEmoji="",r.perspectiveEmojiPickerOpen=!1,Ee()):r.showAreaModal?(r.showAreaModal=!1,r.editingAreaId=null,r.pendingAreaEmoji="",r.areaEmojiPickerOpen=!1,Ee()):r.showCategoryModal?(r.showCategoryModal=!1,r.editingCategoryId=null,r.categoryEmojiPickerOpen=!1,Ee()):r.showLabelModal?(r.showLabelModal=!1,r.editingLabelId=null,Ee()):r.showPersonModal?(r.showPersonModal=!1,r.editingPersonId=null,Ee()):r.showTaskModal?(window.closeTaskModal(),Ee()):r.mobileDrawerOpen&&(window.closeMobileDrawer(),Ee())),(a.metaKey||a.ctrlKey)&&["1","2","3","4","5"].includes(a.key))){a.preventDefault();const s=["home","tasks","life","calendar","settings"];window.switchTab(s[parseInt(a.key)-1])}}),window.addEventListener("online",()=>{console.log("Back online — syncing..."),r.githubSyncDirty?mn().catch(a=>console.error("Online sync failed:",a)):ol(),window.retryGCalOfflineQueue?.()}),window.addEventListener("offline",()=>{console.log("Offline — changes saved locally")});let e=null;if(document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"?(vm(),md({keepalive:!0}),typeof window.cancelTouchDrag=="function"&&window.cancelTouchDrag(),e&&(clearTimeout(e),e=null)):document.visibilityState==="visible"&&(_o(),e&&clearTimeout(e),e=setTimeout(()=>{e=null,da().then(()=>Ee()).catch(()=>{})},1e3))}),window.addEventListener("beforeunload",()=>{md({keepalive:!0})}),window.visualViewport){const a=()=>{const s=window.innerHeight-window.visualViewport.height>140;document.body.classList.toggle("mobile-keyboard-open",s)};window.visualViewport.addEventListener("resize",a),window.visualViewport.addEventListener("scroll",a),a()}Pe()&&typeof window.initBottomNavScrollHide=="function"&&window.initBottomNavScrollHide();let t=null;const n=()=>{clearTimeout(t),t=setTimeout(()=>Ee(),150)};window.addEventListener("orientationchange",n),window.addEventListener("resize",()=>{Pe()!==r._lastRenderWasMobile&&n()}),r._lastRenderWasMobile=Pe(),console.log("Homebase initialized")}function hc(){jc(),fT(),qu();const e=localStorage.getItem(ni)||"";e&&e!==Tt&&(r.showCacheRefreshPrompt=!0,r.cacheRefreshPromptMessage=`Detected update from ${e} to ${Tt}. A hard refresh is recommended.`),zf(e),localStorage.setItem(ni,Tt),Ee();let t=0;document.addEventListener("touchend",n=>{const a=Date.now(),s=a-t;if(t=a,s>0&&s<320){const o=n.target;o instanceof HTMLElement&&o.closest('input, textarea, select, [contenteditable="true"]')!==null||n.preventDefault()}},{passive:!1}),Ku(n=>{n?(pT(),Wi(document.body)):(zi=!1,Ee(),Wi(document.body))})}window.onerror=(e,t,n,a,s)=>{console.error("[Homebase] Uncaught error:",{message:e,source:t,lineno:n,colno:a,error:s});try{const o=r.syncHealth;o&&Array.isArray(o.recentEvents)&&(o.recentEvents.unshift({type:"uncaught_error",message:String(e),source:t?`${t}:${n}:${a}`:"unknown",timestamp:new Date().toISOString()}),o.recentEvents.length>20&&(o.recentEvents.length=20))}catch{}};window.onunhandledrejection=e=>{const t=e.reason;console.error("[Homebase] Unhandled promise rejection:",t);try{const n=r.syncHealth;n&&Array.isArray(n.recentEvents)&&(n.recentEvents.unshift({type:"unhandled_rejection",message:t instanceof Error?t.message:String(t),stack:t instanceof Error?t.stack?.split(`
`).slice(0,3).join(`
`):void 0,timestamp:new Date().toISOString()}),n.recentEvents.length>20&&(n.recentEvents.length=20))}catch{}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",hc):hc();export{Dh as A,cd as L,Ma as S,t1 as a,s1 as b,wf as c,He as d,Do as e,Me as f,r1 as g,Qi as h,Pe as i,r as s};
