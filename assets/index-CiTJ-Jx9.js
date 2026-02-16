(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function n(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(s){if(s.ep)return;s.ep=!0;const o=n(s);fetch(s.href,o)}})();const Ct="4.59.14 - Homebase",an="lifeGamificationData_v3",Ir="lifeGamificationWeights_v1",vi="lifeGamificationGithubToken",bi="lifeGamificationTheme",Fd="lifeGamificationColorMode",$r="lifeGamificationAnthropicKey",Ff="data.json",Hf={simplebits:{name:"SimpleBits",description:"Warm cream tones with coral accents"},things3:{name:"Things 3",description:"Clean white with blue accents"},geist:{name:"Geist",description:"Vercel-inspired monochrome with sharp edges"}},Co="mhabib306-sys",Eo="lifeg",Do="data.json",no="nucleusWeatherCache",Hd="nucleusWeatherLocation",Ao={0:"☀️",1:"🌤️",2:"⛅",3:"☁️",45:"🌫️",48:"🌫️",51:"🌧️",53:"🌧️",55:"🌧️",61:"🌧️",63:"🌧️",65:"🌧️",71:"🌨️",73:"🌨️",75:"❄️",77:"🌨️",80:"🌦️",81:"🌦️",82:"⛈️",85:"🌨️",86:"🌨️",95:"⛈️",96:"⛈️",99:"⛈️"},Nl={0:"Clear",1:"Mostly Clear",2:"Partly Cloudy",3:"Cloudy",45:"Foggy",48:"Foggy",51:"Light Drizzle",53:"Drizzle",55:"Heavy Drizzle",61:"Light Rain",63:"Rain",65:"Heavy Rain",71:"Light Snow",73:"Snow",75:"Heavy Snow",77:"Snow Grains",80:"Light Showers",81:"Showers",82:"Heavy Showers",85:"Light Snow Showers",86:"Snow Showers",95:"Thunderstorm",96:"Thunderstorm",99:"Severe Storm"},un="lifeGamificationTasks",pn="lifeGamificationPerspectives",_t="lifeGamificationTaskCategories",Ot="lifeGamificationTaskLabels",Rt="lifeGamificationTaskPeople",fn="lifeGamificationCategories",bt="lifeGamificationHomeWidgets",Wd="lifeGamificationViewState",Gn="lifeGamificationDeletedTaskTombstones",Un="lifeGamificationDeletedEntityTombstones",zn="nucleusGCalAccessToken",Fr="nucleusGCalTokenTimestamp",yi="nucleusGCalSelectedCalendars",wi="nucleusGCalTargetCalendar",Cr="nucleusGCalEventsCache",xi="nucleusGCalLastSync",fs="nucleusGCalConnected",Gd="nucleusGCalOfflineQueue",Na="nucleusGoogleContactsSyncToken",gs="nucleusGoogleContactsLastSync",Vn="nucleusMeetingNotes",Bt="lifeGamificationTriggers",Ud="lifeGamificationCollapsedTriggers",zd="lifeGamificationFamilyMembers",ro=[{id:"mom",name:"Mom"},{id:"dad",name:"Dad"},{id:"jana",name:"Jana"},{id:"tia",name:"Tia"},{id:"ahmed",name:"Ahmed"},{id:"eman",name:"Eman"}],ki=[{localStorage:"lifeGamificationAnthropicKey",id:"anthropicKey"},{localStorage:"nucleusWhoopWorkerUrl",id:"whoopWorkerUrl"},{localStorage:"nucleusWhoopApiKey",id:"whoopApiKey"},{localStorage:"nucleusLibreWorkerUrl",id:"libreWorkerUrl"},{localStorage:"nucleusLibreApiKey",id:"libreApiKey"}],Ll="14TjFIFtzMPcHgxr1NAtdfrYNmgFRz53XpmYwPQpeA_U",Wf=1119187551,La="nucleusGSheetYesterdayCache",_l="nucleusGSheetLastSync",ms="nucleusGSheetSavedPrompt",hs="nucleusGSheetResponseCache",qn="nucleusConflictNotifications",Mo="nucleusAppVersionSeen",Vd="nucleusNoteIntegritySnapshot",Gf="nucleusNoteLocalBackup",ba="lastUpdated",_a="collapsedNotes",vs="nucleusGithubSyncDirty",qd="nucleusSyncHealth",Si="nucleusSyncSequence",Oa=1,Ra=[{id:"quick-stats",type:"stats",title:"Quick Stats",size:"full",order:0,visible:!0},{id:"quick-add",type:"quick-add",title:"Quick Add Task",size:"full",order:1,visible:!0},{id:"weather",type:"weather",title:"Weather",size:"half",order:2,visible:!0},{id:"todays-score",type:"score",title:"Today's Score",size:"half",order:3,visible:!0},{id:"today-tasks",type:"today-tasks",title:"Today",size:"half",order:4,visible:!0},{id:"today-events",type:"today-events",title:"Today's Events",size:"half",order:5,visible:!0},{id:"next-tasks",type:"next-tasks",title:"Next",size:"half",order:6,visible:!0},{id:"prayers",type:"prayers",title:"Prayers",size:"half",order:7,visible:!0},{id:"glucose",type:"glucose",title:"Glucose",size:"half",order:8,visible:!0},{id:"whoop",type:"whoop",title:"Whoop",size:"half",order:9,visible:!0},{id:"habits",type:"habits",title:"Habits",size:"half",order:10,visible:!0},{id:"gsheet-yesterday",type:"gsheet-yesterday",title:"Yesterday",size:"half",order:11,visible:!0}],Uf=[{id:"personal",name:"Personal",color:"#4A90A4"},{id:"work",name:"Work",color:"#6B8E5A"},{id:"health",name:"Health",color:"#E5533D"},{id:"family",name:"Family",color:"#C4943D"},{id:"learning",name:"Learning",color:"#7C6B8E"}],zf=[{id:"next",name:"Next",color:"#8B5CF6"},{id:"urgent",name:"Urgent",color:"#DC2626"},{id:"quick",name:"Quick Win",color:"#16A34A"},{id:"waiting",name:"Waiting",color:"#CA8A04"},{id:"blocked",name:"Blocked",color:"#6B7280"}],Vf=[{id:"self",name:"Self",color:"#4A90A4",email:""}],Kd={home:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 11.5L12 4l8.5 7.5"/><path d="M6.5 10.5V20h11V10.5"/><path d="M10 20v-5h4v5"/></svg>',inbox:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 10v4h16v-4h-4a4 4 0 01-8 0H4z"/></svg>',today:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.94 5.95 6.57.96-4.76 4.63 1.12 6.56L12 17.27l-5.87 3.09 1.12-6.56-4.76-4.63 6.57-.96z"/></svg>',flagged:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h2v2h8l-1 3 3 3H8v10H6V2z"/></svg>',upcoming:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-1V2h-2v2H8V2H6zm13 18H5V9h14v11z"/><rect x="7" y="11" width="3" height="3" rx="0.5"/></svg>',anytime:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="18" height="4" rx="2"/><rect x="3" y="10" width="18" height="4" rx="2"/><rect x="3" y="16" width="18" height="4" rx="2"/></svg>',someday:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h18v4H3V3zm1 5h16v13a1 1 0 01-1 1H5a1 1 0 01-1-1V8zm5 3v2h6v-2H9z"/></svg>',logbook:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4a2 2 0 012-2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm6.7 11.3l-3-3 1.4-1.4 1.6 1.6 4.6-4.6 1.4 1.4-6 6z"/></svg>',trash:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>',area:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17l10 5 10-5-10-5-10 5z" opacity="0.35"/><path d="M2 12l10 5 10-5-10-5-10 5z" opacity="0.6"/><path d="M12 2L2 7l10 5 10-5L12 2z"/></svg>',next:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M10 8l6 4-6 4V8z" fill="white"/></svg>',notes:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h7l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/><path d="M14 2v5h5" fill="white" opacity="0.95"/><rect x="8.5" y="11" width="7.5" height="1.7" rx="0.85" fill="white"/><rect x="8.5" y="14.7" width="7.5" height="1.7" rx="0.85" fill="white"/><rect x="8.5" y="18.4" width="5" height="1.6" rx="0.8" fill="white"/></svg>',calendar:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2h-1V2h-2v2H8V2H6zm13 18H5V9h14v11z"/><circle cx="8" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="16" cy="12" r="1.2"/><circle cx="8" cy="16" r="1.2"/><circle cx="12" cy="16" r="1.2"/><circle cx="16" cy="16" r="1.2"/></svg>',lifeScore:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v8H3v-8zm4-4h2v12H7V9zm4-4h2v16h-2V5zm4 8h2v8h-2v-8zm4-4h2v12h-2V9z"/></svg>',workspace:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4a2 2 0 012-2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v16h12V4H6zm2 3h8v2H8V7zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"/></svg>',settings:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.49.49 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 00-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.61 3.61 0 0112 15.6z"/></svg>',trigger:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',review:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>'},Yd={home:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',inbox:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>',today:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',flagged:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',upcoming:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',anytime:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',someday:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>',logbook:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',trash:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',area:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',next:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>',notes:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V7z"/><path d="M14 2v5h5"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/></svg>',calendar:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><circle cx="8" cy="14" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="14" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="14" r="1" fill="currentColor" stroke="none"/></svg>',lifeScore:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',workspace:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',settings:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.6.77 1.05 1.38 1.14l.13.01H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',trigger:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',review:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>'};function V(){return(localStorage.getItem(bi)||"things3")==="geist"?Yd:Kd}function qf(){const e=V();return[{id:"inbox",name:"Inbox",icon:e.inbox,color:ue("--inbox-color")||"#147EFB",filter:{status:"inbox"},builtin:!0},{id:"today",name:"Today",icon:e.today,color:ue("--today-color")||"#FFCC00",filter:{today:!0},builtin:!0},{id:"flagged",name:"Flagged",icon:e.flagged,color:ue("--flagged-color")||"#FF9500",filter:{flagged:!0},builtin:!0},{id:"upcoming",name:"Upcoming",icon:e.upcoming,color:ue("--upcoming-color")||"#FF3B30",filter:{upcoming:!0},builtin:!0},{id:"anytime",name:"Anytime",icon:e.anytime,color:ue("--anytime-color")||"#5AC8FA",filter:{status:"anytime"},builtin:!0},{id:"someday",name:"Someday",icon:e.someday,color:ue("--someday-color")||"#C69C6D",filter:{status:"someday"},builtin:!0},{id:"waiting",name:"Waiting For",icon:"⏳",color:ue("--waiting-color")||"#AF52DE",filter:{waiting:!0},builtin:!0},{id:"projects",name:"Projects",icon:"📋",color:ue("--projects-color")||"#5856D6",filter:{projects:!0},builtin:!0},{id:"logbook",name:"Logbook",icon:e.logbook,color:ue("--logbook-color")||"#34C759",filter:{completed:!0},builtin:!0}]}const Ee=new Proxy([],{get(e,t){const n=qf(),a=n[t];return typeof a=="function"?a.bind(n):a}});function Kf(){return{id:"notes",name:"Notes",icon:V().notes,color:ue("--notes-color")||"#8E8E93",filter:{notes:!0},builtin:!0}}const ze=new Proxy({},{get(e,t){return Kf()[t]}}),Yf=["#147EFB","#5AC8FA","#34AADC","#007AFF","#4A90D9","#5856D6","#2E6B9E","#1B3A5C","#34C759","#30B94E","#4CD964","#8CC63F","#FFCC00","#FF9500","#FF9F0A","#FFD60A","#FF3B30","#FF6482","#FF2D55","#E85D75","#AF52DE","#BF5AF2","#9B59B6","#7B68EE","#C69C6D","#A2845E","#8E8E93","#636366","#48484A","#3A3A3C","#6E6E73","#86868B"],He={prayers:{fajr:"",dhuhr:"",asr:"",maghrib:"",isha:"",quran:0},glucose:{avg:"",tir:"",insulin:""},whoop:{sleepPerf:"",recovery:"",strain:"",whoopAge:""},libre:{currentGlucose:"",trend:"",readingsCount:0,lastReading:""},family:{mom:!1,dad:!1,jana:!1,tia:!1,ahmed:!1,eman:!1},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0,nop:""}},ur={prayer:{onTime:5,late:2,quran:5},glucose:{avgMax:10,tirPerPoint:.1,insulinBase:5,insulinPenalty:-5,insulinThreshold:40},family:{mom:1,dad:1,jana:1,tia:1,ahmed:1,eman:1},habits:{exercise:3,reading:2,meditation:2,water:1,vitamins:2,brushTeeth:1,nopYes:2,nopNo:-2},whoop:{sleepPerfHigh:7,sleepPerfMid:4,sleepPerfLow:2,recoveryHigh:2,recoveryMid:1,recoveryLow:0,strainMatch:3,strainHigh:2}},pr={prayer:35,diabetes:25,whoop:14,family:6,habits:16,total:96},Hr="lifeGamificationMaxScores",bs="lifeGamificationXP",ys="lifeGamificationStreak",ws="lifeGamificationAchievements",xs="lifeGamificationCategoryWeights",Ti={prayer:20,diabetes:20,whoop:20,family:20,habits:20},Ba=[0,100,250,450,700,1e3,1400,1900,2500,3200,4e3,4900,5900,7e3,8200,9500,10900,12400,14e3,15700,17500,19400,21400,23500,25700,28e3,30400,32900,35500,38200,41e3,44e3,47200,50600,54200,58e3,62e3,66200,70600,75200,8e4,85e3,90200,95600,101200,107e3,113e3,119200,125600,132200],Ol=[{min:1,max:4,name:"Spark",icon:"✨"},{min:5,max:9,name:"Ember",icon:"🔥"},{min:10,max:14,name:"Flame",icon:"🔥"},{min:15,max:19,name:"Blaze",icon:"🔥"},{min:20,max:24,name:"Inferno",icon:"🔥"},{min:25,max:999,name:"Phoenix",icon:"🔥"}],ao=[{min:1,max:1,multiplier:1},{min:2,max:3,multiplier:1.1},{min:4,max:6,multiplier:1.2},{min:7,max:13,multiplier:1.3},{min:14,max:29,multiplier:1.4},{min:30,max:1/0,multiplier:1.5}],Ii=.2;function ue(e){return getComputedStyle(document.documentElement).getPropertyValue(e).trim()}function Jf(){const e=ue("--danger")||"#EF4444",t=ue("--warning")||"#F59E0B",n=ue("--success")||"#22C55E";return[{min:0,max:.39,color:e,label:"Needs Work",bg:"bg-[var(--danger)]"},{min:.4,max:.59,color:t,label:"Getting There",bg:"bg-[var(--warning)]"},{min:.6,max:.79,color:t,label:"Solid",bg:"bg-[var(--warning)]"},{min:.8,max:.89,color:n,label:"Great",bg:"bg-[var(--success)]"},{min:.9,max:1,color:n,label:"Outstanding",bg:"bg-[var(--success)]"}]}const ca=new Proxy([],{get(e,t){const n=Jf(),a=n[t];return typeof a=="function"?a.bind(n):a}}),Xf=[{id:"first-steps",name:"First Steps",desc:"3-day streak",icon:"🌱",category:"streak",check:e=>e.streak>=3},{id:"weekly-warrior",name:"Weekly Warrior",desc:"7-day streak",icon:"⚔️",category:"streak",check:e=>e.streak>=7},{id:"fortnight-focus",name:"Fortnight Focus",desc:"14-day streak",icon:"🎯",category:"streak",check:e=>e.streak>=14},{id:"monthly-master",name:"Monthly Master",desc:"30-day streak",icon:"👑",category:"streak",check:e=>e.streak>=30},{id:"quarterly-quest",name:"Quarterly Quest",desc:"90-day streak",icon:"🏔️",category:"streak",check:e=>e.streak>=90},{id:"year-of-discipline",name:"Year of Discipline",desc:"365-day streak",icon:"🏆",category:"streak",check:e=>e.streak>=365},{id:"perfect-prayer",name:"Perfect Prayer",desc:"All 5 prayers on time",icon:"🕌",category:"mastery",check:e=>e.prayerOnTime>=5},{id:"prayer-streak-7",name:"Prayer Streak",desc:"7 consecutive perfect prayer days",icon:"📿",category:"mastery",check:e=>e.perfectPrayerStreak>=7},{id:"green-day",name:"Green Day",desc:"Overall score >= 90%",icon:"💚",category:"mastery",check:e=>e.overallPercent>=.9},{id:"balanced-day",name:"Balanced Day",desc:"All 5 categories >= 60%",icon:"⚖️",category:"mastery",check:e=>e.allCategoriesAbove60},{id:"family-first",name:"Family First",desc:"30 cumulative family check-in days",icon:"👨‍👩‍👧‍👦",category:"mastery",check:e=>e.totalFamilyDays>=30},{id:"day-one",name:"Day One",desc:"First day logged",icon:"🚀",category:"milestone",check:e=>e.totalDaysLogged>=1},{id:"century",name:"Century",desc:"100 days logged",icon:"💯",category:"milestone",check:e=>e.totalDaysLogged>=100},{id:"quran-scholar",name:"Quran Scholar",desc:"50 cumulative Quran pages",icon:"📖",category:"milestone",check:e=>e.totalQuranPages>=50},{id:"level-10",name:"Level 10",desc:"Reach Level 10",icon:"🔟",category:"milestone",check:e=>e.level>=10},{id:"level-20",name:"Level 20",desc:"Reach Level 20",icon:"2️⃣0️⃣",category:"milestone",check:e=>e.level>=20},{id:"level-30",name:"Level 30",desc:"Reach Level 30",icon:"3️⃣0️⃣",category:"milestone",check:e=>e.level>=30}],Qf={prayer:"Try to pray all 5 on time today.",diabetes:"Watch your glucose — stay in range.",whoop:"Prioritize sleep and recovery.",family:"Try calling a family member today.",habits:"Focus on exercise and reading."},Rl=["buy","call","send","finish","review","schedule","clean","fix","write","email","text","message","contact","ask","tell","remind","check","update","submit","complete","start","begin","plan","prepare","organize","arrange","book","order","pick","drop","return","cancel","renew","pay","transfer","deposit","withdraw","sign","register","apply","file","print","scan","copy","move","pack","unpack","install","setup","configure","test","debug","deploy","ship","deliver","mail","post","share","publish","upload","download","backup","restore","delete","remove","add","create","build","design","draft","edit","proofread","approve","reject","merge","close","open","lock","unlock","wash","iron","cook","bake","grill","make","assemble","repair","replace","charge","refill","restock","measure","track","log","record","document","research","investigate","analyze","compare","evaluate","prioritize","delegate"],Zf={"2026-01-01":{prayers:{fajr:"1",dhuhr:"1",asr:"1",maghrib:"0.1",isha:"0.1",quran:0},family:{mom:!1,dad:!1,jana:!1,tia:!1,ahmed:!1,eman:!1},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-02":{prayers:{fajr:"1",dhuhr:"1",asr:"1",maghrib:"1",isha:"1",quran:0},family:{mom:!0,dad:!0,jana:!1,tia:!1,ahmed:!1,eman:!1},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-03":{prayers:{fajr:"1.1",dhuhr:"1",asr:"1",maghrib:"0.1",isha:"1",quran:0},family:{mom:!0,dad:!1,jana:!1,tia:!1,ahmed:!1,eman:!1},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-04":{prayers:{fajr:"1.2",dhuhr:"0.1",asr:"1",maghrib:"1",isha:"1",quran:0},family:{mom:!0,dad:!0,jana:!1,tia:!1,ahmed:!1,eman:!1},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-05":{prayers:{fajr:"1",dhuhr:"0.1",asr:"0.1",maghrib:"0.1",isha:"1",quran:0},family:{mom:!1,dad:!1,jana:!1,tia:!1,ahmed:!0,eman:!1},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-06":{prayers:{fajr:"1",dhuhr:"0.1",asr:"0.1",maghrib:"0.1",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!0,tia:!0,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-07":{prayers:{fajr:"1",dhuhr:"0.1",asr:"1",maghrib:"1",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!0,tia:!0,ahmed:!0,eman:!1},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-08":{prayers:{fajr:"0.1",dhuhr:"1",asr:"1",maghrib:"0.1",isha:"0.1",quran:0},family:{mom:!0,dad:!1,jana:!1,tia:!1,ahmed:!0,eman:!1},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-09":{prayers:{fajr:"1",dhuhr:"1",asr:"1",maghrib:"1",isha:"1",quran:0},family:{mom:!0,dad:!1,jana:!1,tia:!1,ahmed:!0,eman:!1},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-10":{prayers:{fajr:"0.1",dhuhr:"1",asr:"1",maghrib:"1",isha:"1",quran:0},family:{mom:!0,dad:!1,jana:!1,tia:!1,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-11":{prayers:{fajr:"1",dhuhr:"0.1",asr:"0.1",maghrib:"1",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!1,tia:!1,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-12":{prayers:{fajr:"0.1",dhuhr:"",asr:"0.1",maghrib:"0.1",isha:"1",quran:0},family:{mom:!1,dad:!0,jana:!1,tia:!1,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-13":{prayers:{fajr:"0.1",dhuhr:"",asr:"",maghrib:"0.1",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!0,tia:!1,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-14":{prayers:{fajr:"1",dhuhr:"0.1",asr:"0.1",maghrib:"0.1",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!1,tia:!0,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-15":{prayers:{fajr:"1",dhuhr:"",asr:"",maghrib:"0.1",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!1,tia:!1,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-16":{prayers:{fajr:"1",dhuhr:"",asr:"",maghrib:"",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!1,tia:!0,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-17":{prayers:{fajr:"1",dhuhr:"1",asr:"1",maghrib:"0.1",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!1,tia:!0,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-18":{prayers:{fajr:"1",dhuhr:"1",asr:"0.1",maghrib:"1",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!1,tia:!1,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-19":{prayers:{fajr:"1",dhuhr:"",asr:"",maghrib:"1",isha:"0.1",quran:0},family:{mom:!0,dad:!1,jana:!1,tia:!1,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-20":{prayers:{fajr:"1",dhuhr:"",asr:"",maghrib:"",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!1,tia:!0,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-21":{prayers:{fajr:"0.1",dhuhr:"",asr:"",maghrib:"",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!1,tia:!0,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}},"2026-01-22":{prayers:{fajr:"1",dhuhr:"",asr:"",maghrib:"",isha:"0.1",quran:0},family:{mom:!0,dad:!0,jana:!0,tia:!0,ahmed:!0,eman:!0},glucose:{avg:"",tir:"",insulin:"",nop:""},whoop:{sleepHours:"",sleepConsist:"",rhr:"",hrv:"",vo2max:"",steps:"",recovery:"",strain:"",whoopAge:""},habits:{exercise:0,reading:0,meditation:0,water:"",vitamins:!1,brushTeeth:0}}};function U(e=new Date){const t=e.getFullYear(),n=String(e.getMonth()+1).padStart(2,"0"),a=String(e.getDate()).padStart(2,"0");return`${t}-${n}-${a}`}function v(e){if(!e)return"";const t=document.createElement("div");return t.textContent=e,t.innerHTML}function me(e){if(e==null||e==="")return"—";const t=typeof e=="string"?parseFloat(e):e;return isNaN(t)?"—":t.toLocaleString("en-US")}function Wr(){const e=Date.now(),t=new Uint8Array(8);crypto.getRandomValues(t);const n=Array.from(t,a=>a.toString(36).padStart(2,"0")).join("").slice(0,12);return`task_${e}_${n}`}function Gr(e){const t=Date.now(),n=Math.random().toString(36).slice(2,8);return`${e}_${t}_${n}`}function pe(e,t){try{const n=localStorage.getItem(e);return n?JSON.parse(n):t}catch(n){return console.error(`Failed to parse localStorage key "${e}":`,n),t}}function _n(e){return String(e||"").trim().toLowerCase()}function Er(e,t=32,n=""){if(!e)return"";if(e.photoData)return`<img src="${e.photoData}" alt="" style="width:${t}px;height:${t}px" class="rounded-full object-cover flex-shrink-0 ${n}" referrerpolicy="no-referrer">`;const a=String(e.name||"").trim().split(/\s+/).filter(Boolean),s=a.length>=2?(a[0][0]+a[a.length-1][0]).toUpperCase():(a[0]?.[0]||"?").toUpperCase(),o=e.color||"var(--accent)",i=Math.max(Math.round(t*.4),10);return`<span style="width:${t}px;height:${t}px;background:${o};font-size:${i}px" class="rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold leading-none ${n}">${s}</span>`}function $i(e){if(!e)return"";if(e.allDay)return"All day";if(!e.start?.dateTime)return"";const n=new Date(e.start.dateTime).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});if(!e.end?.dateTime)return n;const s=new Date(e.end.dateTime).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});return`${n} - ${s}`}function Jd(e){return e?e.allDay&&e.start?.date?new Date(e.start.date+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}):e.start?.dateTime?new Date(e.start.dateTime).toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}):"":""}function he(){return window.innerWidth<=768}function jt(){return window.matchMedia("(hover: none) and (pointer: coarse)").matches}function Ci(){return he()||jt()}function Xd(e="light"){if(!navigator.vibrate)return;const t={light:5,medium:10,heavy:20,error:[10,50,10],success:[10,30]};navigator.vibrate(t[e]||5)}function ve(e){if(!e)return"";const t=U(),n=new Date(t+"T00:00:00"),a=new Date(e+"T00:00:00"),s=Math.round((a-n)/(1e3*60*60*24));return s===0?"Today":s===1?"Tomorrow":s===-1?"Yesterday":s>1&&s<=6?a.toLocaleDateString("en-US",{weekday:"long"}):s>=-6&&s<-1?a.toLocaleDateString("en-US",{weekday:"long"}):a.getFullYear()===n.getFullYear()?a.toLocaleDateString("en-US",{month:"short",day:"numeric"}):a.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}function eg(){try{const e=localStorage.getItem(Ir);if(!e)return JSON.parse(JSON.stringify(ur));const t=JSON.parse(e);if(!t||typeof t!="object")return JSON.parse(JSON.stringify(ur));const n=JSON.parse(JSON.stringify(ur));return Object.keys(n).forEach(a=>{t[a]&&Object.keys(n[a]).forEach(s=>{t[a][s]!==void 0&&(n[a][s]=t[a][s])})}),n}catch(e){return console.error("Error loading weights:",e),JSON.parse(JSON.stringify(ur))}}function tg(){try{const e=localStorage.getItem(Hr);if(!e)return JSON.parse(JSON.stringify(pr));const t=JSON.parse(e);return!t||typeof t!="object"?JSON.parse(JSON.stringify(pr)):{...pr,...t}}catch(e){return console.error("Error loading max scores:",e),JSON.parse(JSON.stringify(pr))}}function ng(){try{const e=localStorage.getItem(zd);if(!e)return JSON.parse(JSON.stringify(ro));const t=JSON.parse(e);return Array.isArray(t)?t.filter(n=>n&&n.id&&n.name):JSON.parse(JSON.stringify(ro))}catch(e){return console.error("Error loading family members:",e),JSON.parse(JSON.stringify(ro))}}const Qd=JSON.parse(localStorage.getItem(an)||"{}"),Dr={...Zf,...Qd};let Zd=!1;Object.keys(Dr).forEach(e=>{const t=Dr[e];t.glucose&&t.glucose.nop!==void 0&&t.glucose.nop!==""&&(t.habits||(t.habits={}),(t.habits.nop===void 0||t.habits.nop==="")&&(t.habits.nop=t.glucose.nop,Zd=!0),delete t.glucose.nop)});Zd&&console.log("Migrated NoP data from glucose to habits");localStorage.setItem(an,JSON.stringify(Dr));const Le=JSON.parse(localStorage.getItem(Wd)||"{}");let at=Le.activeTab||"home";const rg=Object.keys(Dr).some(e=>/^\d{4}-\d{2}-\d{2}$/.test(e));let ec=Le.activeSubTab||(rg?"daily":"dashboard");(at==="track"||at==="bulk"||at==="dashboard")&&(ec=at==="track"?"daily":at,at="life");["home","life","tasks","calendar","settings"].includes(at)||(at="home");let Ar=Le.activePerspective||"inbox";Ar==="home"&&(Ar="inbox");Ar==="calendar"&&(Ar="inbox");const ag=["tasks","notes","both"].includes(Le.workspaceContentMode)?Le.workspaceContentMode:"both";let Po;try{const e=localStorage.getItem(_a);Po=new Set(e?JSON.parse(e):[])}catch(e){console.error("Error loading collapsed notes:",e),localStorage.removeItem(_a),Po=new Set}function tc(e){if(!e||typeof e!="object")return{};const t={};return Object.entries(e).forEach(([n,a])=>{const s=a?new Date(a).getTime():0;!n||!Number.isFinite(s)||s<=0||(t[String(n)]=new Date(s).toISOString())}),t}function sg(e){if(!e||typeof e!="object")return{};const t={};return Object.entries(e).forEach(([n,a])=>{t[n]=tc(a)}),t}const nc=tc(pe(Gn,{})),rc=sg(pe(Un,{})),Kn=(e,t)=>!!(e&&t&&rc[e]?.[String(t)]),og=(pe(un,[])||[]).filter(e=>!nc[String(e?.id)]),ig=(pe(_t,null)||Uf).filter(e=>!Kn("taskCategories",e?.id)),lg=(pe(Ot,null)||zf).filter(e=>!Kn("taskLabels",e?.id)),dg=(pe(Rt,null)||Vf).filter(e=>!Kn("taskPeople",e?.id)).map(e=>({...e,email:typeof e?.email=="string"?e.email:"",jobTitle:typeof e?.jobTitle=="string"?e.jobTitle:"",photoUrl:typeof e?.photoUrl=="string"?e.photoUrl:"",photoData:typeof e?.photoData=="string"?e.photoData:""})),cg=(pe(pn,[])||[]).filter(e=>!Kn("customPerspectives",e?.id)),ug=(pe(fn,[])||[]).filter(e=>!Kn("categories",e?.id)),pg=(pe(bt,null)||Ra).filter(e=>!Kn("homeWidgets",e?.id)),r={currentUser:null,authLoading:!0,authError:null,syncStatus:"idle",lastSyncTime:null,syncDebounceTimer:null,syncInProgress:!1,syncPendingRetry:!1,syncRetryCount:0,syncRetryTimer:null,cloudPullPending:!1,githubSyncDirty:localStorage.getItem(vs)==="true",syncRateLimited:!1,syncSequence:parseInt(localStorage.getItem(Si)||"0",10),syncHealth:(()=>{try{const e=localStorage.getItem(qd);if(e){const t=JSON.parse(e);return t.recentEvents=Array.isArray(t.recentEvents)?t.recentEvents.slice(0,20):[],t}}catch{}return{totalSaves:0,successfulSaves:0,failedSaves:0,totalLoads:0,successfulLoads:0,failedLoads:0,lastSaveLatencyMs:0,avgSaveLatencyMs:0,lastError:null,recentEvents:[]}})(),weatherData:null,weatherLocation:{lat:30.0291,lon:31.4975,city:"New Cairo"},WEIGHTS:eg(),MAX_SCORES:tg(),storedData:Qd,allData:Dr,currentDate:U(),weekChart:null,breakdownChart:null,activeTab:at,activeSubTab:ec,bulkMonth:new Date().getMonth(),bulkYear:new Date().getFullYear(),bulkCategory:"prayers",familyMembers:ng(),dashboardDateRange:30,tasksData:og,deletedTaskTombstones:nc,deletedEntityTombstones:rc,taskAreas:ig,taskLabels:lg,taskPeople:dg,taskCategories:ug,customPerspectives:cg,homeWidgets:pg,editingHomeWidgets:!1,showAddWidgetPicker:!1,draggingWidgetId:null,activePerspective:Ar,workspaceContentMode:ag,workspaceSidebarCollapsed:!1,activeFilterType:(Le.activeFilterType==="category"?"area":Le.activeFilterType)||"perspective",activeAreaFilter:Le.activeAreaFilter||null,activeLabelFilter:Le.activeLabelFilter||null,activePersonFilter:Le.activePersonFilter||null,calendarMonth:new Date().getMonth(),calendarYear:new Date().getFullYear(),calendarSelectedDate:U(),calendarViewMode:"month",calendarSidebarCollapsed:!1,calendarEventModalOpen:!1,calendarEventModalCalendarId:null,calendarEventModalEventId:null,draggedCalendarEvent:null,calendarMeetingNotesEventKey:null,calendarMeetingNotesScope:"instance",meetingNotesByEvent:pe(Vn,{}),editingTaskId:null,inlineEditingTaskId:null,quickAddIsNote:!1,showAllSidebarPeople:!1,showAllSidebarLabels:!1,newTaskContext:{areaId:null,labelId:null,personId:null,status:"inbox"},inlineAutocompleteMeta:new Map,mobileDrawerOpen:!1,showTaskModal:!1,showPerspectiveModal:!1,showAreaModal:!1,showLabelModal:!1,showPersonModal:!1,showCategoryModal:!1,editingCategoryId:null,activeCategoryFilter:Le.activeCategoryFilter||null,editingAreaId:null,editingLabelId:null,editingPersonId:null,editingPerspectiveId:null,perspectiveEmojiPickerOpen:!1,areaEmojiPickerOpen:!1,categoryEmojiPickerOpen:!1,emojiSearchQuery:"",pendingPerspectiveEmoji:"",pendingAreaEmoji:"",pendingCategoryEmoji:"",collapsedSidebarAreas:new Set,draggedSidebarItem:null,draggedSidebarType:null,sidebarDragPosition:null,showInlineTagInput:!1,showInlinePersonInput:!1,editingNoteId:null,collapsedNotes:Po,zoomedNoteId:null,notesBreadcrumb:[],draggedNoteId:null,dragOverNoteId:null,noteDragPosition:null,draggedTaskId:null,dragOverTaskId:null,dragPosition:null,scoresCache:new Map,scoresCacheVersion:0,undoAction:null,undoTimerRemaining:0,undoTimerId:null,showBraindump:!1,braindumpRawText:"",braindumpParsedItems:[],braindumpStep:"input",braindumpEditingIndex:null,braindumpSuccessMessage:"",braindumpProcessing:!1,braindumpAIError:null,braindumpFullPage:!1,braindumpVoiceRecording:!1,braindumpVoiceTranscribing:!1,braindumpVoiceError:null,gcalEvents:[],gcalCalendarList:[],gcalCalendarsLoading:!1,gcalError:null,gcalSyncing:!1,gcalTokenExpired:!1,gcalOfflineQueue:pe(Gd,[]),gcontactsSyncing:!1,gcontactsLastSync:null,gcontactsError:null,calendarMobileShowToday:!0,calendarMobileShowEvents:!0,calendarMobileShowScheduled:!0,conflictNotifications:pe(qn,[]),renderPerf:{lastMs:0,avgMs:0,maxMs:0,count:0},showCacheRefreshPrompt:!1,cacheRefreshPromptMessage:"",modalSelectedArea:null,modalSelectedCategory:null,modalSelectedStatus:"inbox",modalSelectedToday:!1,modalSelectedFlagged:!1,modalSelectedTags:[],modalSelectedPeople:[],modalIsNote:!1,modalRepeatEnabled:!1,modalStateInitialized:!1,modalWaitingFor:null,modalIsProject:!1,modalProjectId:null,modalProjectType:"parallel",modalTimeEstimate:null,CATEGORY_WEIGHTS:pe(xs,null)||JSON.parse(JSON.stringify(Ti)),xp:pe(bs,{total:0,history:[]}),streak:pe(ys,{current:0,longest:0,lastLoggedDate:null,shield:{available:!0,lastUsed:null},multiplier:1}),achievements:pe(ws,{unlocked:{}}),dailyFocusDismissed:null,triggers:pe(Bt,[]),editingTriggerId:null,collapsedTriggers:(()=>{try{const e=localStorage.getItem(Ud);return new Set(e?JSON.parse(e):[])}catch{return new Set}})(),zoomedTriggerId:null,triggersBreadcrumb:[],reviewMode:!1,reviewAreaIndex:0,reviewCompletedAreas:[],reviewTriggersCollapsed:!1,reviewProjectsCollapsed:!1,reviewNotesCollapsed:!1,lastWeeklyReview:localStorage.getItem("nucleusLastWeeklyReview")||null,lastSomedayReview:localStorage.getItem("nucleusLastSomedayReview")||null,gsheetData:pe(La,null),gsheetSyncing:!1,gsheetError:null,gsheetPrompt:"",gsheetResponse:null,gsheetAsking:!1,gsheetEditingPrompt:!1,showGlobalSearch:!1,globalSearchQuery:"",globalSearchResults:[],globalSearchActiveIndex:-1,globalSearchTypeFilter:null,settingsIntegrationsOpen:!1,settingsScoringOpen:!1,settingsDevToolsOpen:!1,settingsDataDiagOpen:!1,_lastRenderWasMobile:!1,cleanupCallbacks:[],quotaExceededError:!1};function Se(e,t){try{return localStorage.setItem(e,JSON.stringify(t)),!0}catch(n){return n.name==="QuotaExceededError"&&(console.error("Storage quota exceeded for key:",e),typeof r<"u"&&(r.quotaExceededError=!0)),!1}}function fg(e,t){try{return localStorage.setItem(e,t),!0}catch(n){return n.name==="QuotaExceededError"&&(console.error("Storage quota exceeded for key:",e),typeof r<"u"&&(r.quotaExceededError=!0)),!1}}function Yn(){Se(an,r.allData),fg(ba,Date.now().toString())}function Ur(){const e=JSON.parse(JSON.stringify(He)),t=r.familyMembers||[];return e.family={},t.forEach(n=>{e.family[n.id]=!1}),e}function Ei(){return r.allData[r.currentDate]||Ur()}function gg(e,t,n){const a=Ei();if(a[e]||(a[e]={}),a[e][t]=n,a._lastModified=new Date().toISOString(),r.allData[r.currentDate]=a,Mi(),Yn(),typeof window.processGamification=="function"){const s=window.processGamification(r.currentDate);Ai(s)}window.debouncedSaveToGithub(),window.render(),mg()}function mg(){let e=document.getElementById("save-indicator");e||(e=document.createElement("div"),e.id="save-indicator",e.style.cssText="position:fixed;bottom:24px;right:24px;padding:6px 14px;border-radius:var(--border-radius,6px);background:var(--bg-card,#fff);border:1px solid var(--border,#e6e6e6);color:var(--text-secondary,#666);font-size:12px;font-weight:500;z-index:9999;opacity:0;transition:opacity 0.2s;pointer-events:none;font-family:var(--font-family,system-ui);box-shadow:var(--shadow-sm,0 1px 2px rgba(0,0,0,0.04))",document.body.appendChild(e)),e.textContent="✓ Saved",e.style.opacity="1",clearTimeout(e._timer),e._timer=setTimeout(()=>{e.style.opacity="0"},1200)}function O(){Se(un,r.tasksData),Se(_t,r.taskAreas),Se(Ot,r.taskLabels),Se(Rt,r.taskPeople),Se(fn,r.taskCategories),Se(pn,r.customPerspectives),Se(Bt,r.triggers),window.debouncedSaveToGithub()}function Di(){Se(zd,r.familyMembers)}function hg(e,t){const n=U();if(r.allData[n]||(r.allData[n]={}),r.allData[n][e]||(r.allData[n][e]={}),r.allData[n][e][t]=!r.allData[n][e][t],r.allData[n]._lastModified=new Date().toISOString(),Mi(),Yn(),typeof window.processGamification=="function"){const a=window.processGamification(n);Ai(a)}window.debouncedSaveToGithub(),window.render()}function vg(e,t,n){const a=U();r.allData[a]||(r.allData[a]={}),r.allData[a][e]||(r.allData[a][e]={});const s=parseFloat(n);if(r.allData[a][e][t]=n===""?null:Number.isNaN(s)?n:s,r.allData[a]._lastModified=new Date().toISOString(),Mi(),Yn(),typeof window.processGamification=="function"){const o=window.processGamification(a);Ai(o)}window.debouncedSaveToGithub(),window.render()}function De(){const e=r.activePerspective==="calendar"?"inbox":r.activePerspective;Se(Wd,{activeTab:r.activeTab,activeSubTab:r.activeSubTab,activePerspective:e,workspaceContentMode:r.workspaceContentMode||"both",activeFilterType:r.activeFilterType,activeAreaFilter:r.activeAreaFilter,activeLabelFilter:r.activeLabelFilter,activePersonFilter:r.activePersonFilter,activeCategoryFilter:r.activeCategoryFilter})}function ac(){Se(Ir,r.WEIGHTS)}function bg(){Se(Hr,r.MAX_SCORES)}function yg(){Se(bt,r.homeWidgets)}function wg(){Se(_a,[...r.collapsedNotes])}function Ai(e){if(e){if(e.xpResult?.levelUp){const t=typeof window.getLevelInfo=="function"?window.getLevelInfo(r.xp?.total||0):null;t&&(r.undoAction={label:`Level Up! Level ${t.level} — ${t.tierIcon} ${t.tierName}`,snapshot:null,restoreFn:null},r.undoTimerRemaining=5,r.undoTimerId&&clearInterval(r.undoTimerId),r.undoTimerId=setInterval(()=>{r.undoTimerRemaining--,r.undoTimerRemaining<=0&&(clearInterval(r.undoTimerId),r.undoAction=null,r.undoTimerId=null,typeof window.render=="function"&&window.render())},1e3))}e.newAchievements?.length>0&&e.newAchievements.forEach(t=>{typeof window.markAchievementNotified=="function"&&window.markAchievementNotified(t)})}}function Mi(){r.scoresCache.clear(),r.scoresCacheVersion++}const xg="homebase-880f0",kg=1e5;function sc(){try{return window.getCurrentUser?.()?.uid||null}catch{return null}}function oc(){return typeof crypto<"u"&&crypto.subtle}function sr(e){return btoa(String.fromCharCode(...new Uint8Array(e)))}function or(e){const t=atob(e),n=new Uint8Array(t.length);for(let a=0;a<t.length;a++)n[a]=t.charCodeAt(a);return n.buffer}async function ic(e,t){const n=new TextEncoder,a=await crypto.subtle.importKey("raw",n.encode(e+xg),"PBKDF2",!1,["deriveKey"]);return crypto.subtle.deriveKey({name:"PBKDF2",salt:t,iterations:kg,hash:"SHA-256"},a,{name:"AES-GCM",length:256},!1,["wrapKey","unwrapKey"])}async function Sg(e,t){const n=crypto.getRandomValues(new Uint8Array(16)),a=await crypto.subtle.generateKey({name:"AES-GCM",length:256},!0,["encrypt","decrypt"]),s=await ic(t,n),o=crypto.getRandomValues(new Uint8Array(12)),i=await crypto.subtle.wrapKey("raw",a,s,{name:"AES-GCM",iv:o}),l=crypto.getRandomValues(new Uint8Array(12)),d=new TextEncoder().encode(JSON.stringify(e)),c=await crypto.subtle.encrypt({name:"AES-GCM",iv:l},a,d);return{version:1,salt:sr(n),wrapIv:sr(o),wrappedKey:sr(i),dataIv:sr(l),data:sr(c),updatedAt:new Date().toISOString()}}async function Tg(e,t){const n=new Uint8Array(or(e.salt)),a=new Uint8Array(or(e.wrapIv)),s=or(e.wrappedKey),o=new Uint8Array(or(e.dataIv)),i=or(e.data),l=await ic(t,n),d=await crypto.subtle.unwrapKey("raw",s,l,{name:"AES-GCM",iv:a},{name:"AES-GCM",length:256},!1,["decrypt"]),c=await crypto.subtle.decrypt({name:"AES-GCM",iv:o},d,i);return JSON.parse(new TextDecoder().decode(c))}async function Ig(){if(!oc())return null;const e=sc();if(!e)return null;const t={};let n=0;for(const{localStorage:a,id:s}of ki){const o=localStorage.getItem(a);o&&(t[s]=o,n++)}if(n===0)return null;try{return await Sg(t,e)}catch(a){return console.warn("Credential encryption failed:",a.message),null}}async function $g(e){if(!e||e.version!==1||!oc())return!1;const t=sc();if(!t)return!1;const n=await Tg(e,t);let a=0;for(const{localStorage:s,id:o}of ki)!localStorage.getItem(s)&&n[o]&&(localStorage.setItem(s,n[o]),a++);return a>0&&console.log(`Restored ${a} credential(s) from cloud`),a>0}function lc(){let e=0;for(const{localStorage:t}of ki)localStorage.getItem(t)&&e++;return{hasCreds:e>0,count:e}}function Ae(e){const t=e?new Date(e).getTime():0;return Number.isFinite(t)?t:0}function Bl(e){return e===""||e===null||e===void 0}function ja(e){return!!e&&typeof e=="object"&&!Array.isArray(e)}function Cg(e){const t=[];return e.data&&typeof e.data!="object"&&t.push("data must be an object"),e.tasks&&!Array.isArray(e.tasks)&&t.push("tasks must be an array"),e.taskCategories&&!Array.isArray(e.taskCategories)&&t.push("taskCategories must be an array"),e.taskLabels&&!Array.isArray(e.taskLabels)&&t.push("taskLabels must be an array"),e.taskPeople&&!Array.isArray(e.taskPeople)&&t.push("taskPeople must be an array"),e.customPerspectives&&!Array.isArray(e.customPerspectives)&&t.push("customPerspectives must be an array"),e.homeWidgets&&!Array.isArray(e.homeWidgets)&&t.push("homeWidgets must be an array"),e.triggers&&!Array.isArray(e.triggers)&&t.push("triggers must be an array"),e.lastUpdated&&isNaN(new Date(e.lastUpdated).getTime())&&t.push("lastUpdated is not a valid date"),e.meetingNotesByEvent&&typeof e.meetingNotesByEvent!="object"&&t.push("meetingNotesByEvent must be an object"),Array.isArray(e.tasks)&&e.tasks.slice(0,5).forEach((a,s)=>{!a||typeof a!="object"?t.push(`tasks[${s}] is not an object`):a.id||t.push(`tasks[${s}] missing id`)}),t}function dc(e){if(!e||typeof e!="object")return{};const t=Date.now(),n=4320*60*60*1e3,a={};return Object.entries(e).forEach(([s,o])=>{if(!s)return;const i=Ae(o);i&&(t-i>n||(a[String(s)]=new Date(i).toISOString()))}),a}function Eg(e){if(!e||typeof e!="object")return{};const t={};return Object.entries(e).forEach(([n,a])=>{!a||typeof a!="object"||(t[n]=dc(a))}),t}function Dg(e,t){const n=["prayers","glucose","whoop","libre","family","habits"];return Object.keys(t).forEach(a=>{if(!e[a]){e[a]=t[a];return}const s=e[a],o=t[a];n.forEach(i=>{if(o[i]){if(!s[i]){s[i]=o[i];return}Object.keys(o[i]).forEach(l=>{Bl(s[i][l])&&!Bl(o[i][l])&&(s[i][l]=o[i][l])})}})}),e}function Ag(e=[],t=[],n=[],a=null){const s=Array.isArray(e)?e:[],o=Array.isArray(t)?t:[],i=new Map;return s.forEach(l=>{if(ja(l)&&l.id){if(a&&a(l.id))return;i.set(l.id,l)}}),o.forEach(l=>{if(!ja(l)||!l.id||a&&a(l.id))return;const d=i.get(l.id);if(!d){i.set(l.id,l);return}if(!n.length)return;const c=Ae(n.map(m=>d[m]).find(Boolean));Ae(n.map(m=>l[m]).find(Boolean))>c&&i.set(l.id,l)}),Array.from(i.values())}function Et(){return localStorage.getItem(vi)||""}function Mg(e){localStorage.setItem(vi,e),window.render()}function Fa(){return localStorage.getItem(bi)||"things3"}function Pg(e){localStorage.setItem(bi,e),document.documentElement.setAttribute("data-theme",e),Pi(),window.render()}function cc(){const e=Fa(),t=Mr();document.documentElement.setAttribute("data-theme",e),document.documentElement.setAttribute("data-mode",t),Pi()}function Mr(){return localStorage.getItem(Fd)||"light"}function uc(e){localStorage.setItem(Fd,e),document.documentElement.setAttribute("data-mode",e),Pi(),window.render()}function Ng(){uc(Mr()==="light"?"dark":"light")}function Pi(){requestAnimationFrame(()=>{const e=getComputedStyle(document.documentElement).getPropertyValue("--bg-primary").trim(),t=document.querySelector('meta[name="theme-color"]');t&&e&&t.setAttribute("content",e)})}function Lg(){return getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()}function _g(){const e=getComputedStyle(document.documentElement);return{accent:e.getPropertyValue("--accent").trim(),accentDark:e.getPropertyValue("--accent-dark").trim(),accentLight:e.getPropertyValue("--accent-light").trim(),bgPrimary:e.getPropertyValue("--bg-primary").trim(),bgSecondary:e.getPropertyValue("--bg-secondary").trim(),textPrimary:e.getPropertyValue("--text-primary").trim()}}function Ha(e,t={},n=3e4){const a=new AbortController,s=setTimeout(()=>a.abort(),n);return fetch(e,{...t,signal:a.signal}).finally(()=>clearTimeout(s))}function Og(e){return typeof structuredClone=="function"?structuredClone(e):JSON.parse(JSON.stringify(e))}function nt(e,t,n=0,a=""){const s={type:e,status:t,timestamp:new Date().toISOString(),latencyMs:n,details:a};if(r.syncHealth.recentEvents.unshift(s),r.syncHealth.recentEvents=r.syncHealth.recentEvents.slice(0,20),e==="save")if(r.syncHealth.totalSaves++,t==="success"){r.syncHealth.successfulSaves++,r.syncHealth.lastSaveLatencyMs=n;const o=r.syncHealth.successfulSaves;r.syncHealth.avgSaveLatencyMs=Math.round((r.syncHealth.avgSaveLatencyMs*(o-1)+n)/o)}else r.syncHealth.failedSaves++,r.syncHealth.lastError={message:a,timestamp:s.timestamp,type:e};else e==="load"&&(r.syncHealth.totalLoads++,t==="success"?r.syncHealth.successfulLoads++:(r.syncHealth.failedLoads++,r.syncHealth.lastError={message:a,timestamp:s.timestamp,type:e}));try{localStorage.setItem(qd,JSON.stringify(r.syncHealth))}catch{}}function pc(){return r.syncHealth}async function fc(e){const t=new TextEncoder().encode(e),n=await crypto.subtle.digest("SHA-256",t);return Array.from(new Uint8Array(n)).map(a=>a.toString(16).padStart(2,"0")).join("")}function gc(e){return Cg(e)}async function mc(e){if(!e._checksum)return!0;const{_checksum:t,...n}=e,a=JSON.stringify(n);return await fc(a)===t}function hc(e){return e._schemaVersion&&e._schemaVersion>Oa?(console.warn(`Cloud data is schema v${e._schemaVersion}, this app supports v${Oa}`),Ce("error","Cloud data is from a newer app version. Please update."),!1):!0}const Rg=900*1e3;let Sn=null;function so(){Sn&&clearInterval(Sn),Sn=setInterval(async()=>{if(!(!Et()||!navigator.onLine)&&!r.syncInProgress)try{await zr(),typeof window.render=="function"&&window.render()}catch(e){console.warn("Periodic sync failed:",e.message)}},Rg)}function Bg(){Sn&&(clearInterval(Sn),Sn=null)}function Ce(e,t=""){r.syncStatus=e;const n=document.getElementById("sync-indicator");if(n){const a={idle:"bg-[var(--text-muted)]",syncing:"bg-[var(--warning)] animate-pulse",success:"bg-[var(--success)]",error:"bg-[var(--danger)]"};n.className=`w-2 h-2 rounded-full ${a[e]}`,n.title=t||e}e==="success"&&(r.lastSyncTime=new Date,setTimeout(()=>{r.syncStatus==="success"&&Ce("idle")},3e3))}function vc(e){Dg(r.allData,e)}function Vt(e,t,n){if(!t)return;const a=r[e],s=Ae(t?._updatedAt),o=Ae(a?._updatedAt);(!o||s>o)&&(r[e]=t,localStorage.setItem(n,JSON.stringify(t)))}function jl(e){const t=Array.isArray(r.conflictNotifications)?r.conflictNotifications:[];t.unshift({id:`conf_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,createdAt:new Date().toISOString(),...e}),r.conflictNotifications=t.slice(0,100),localStorage.setItem(qn,JSON.stringify(r.conflictNotifications))}function jg(e){r.conflictNotifications=(r.conflictNotifications||[]).filter(t=>t.id!==e),localStorage.setItem(qn,JSON.stringify(r.conflictNotifications)),window.render()}function Fg(){r.conflictNotifications=[],localStorage.setItem(qn,"[]"),window.render()}function No(e={}){if(!e||typeof e!="object")return;const n={...r.meetingNotesByEvent&&typeof r.meetingNotesByEvent=="object"?r.meetingNotesByEvent:{}};Object.entries(e).forEach(([a,s])=>{if(!s||typeof s!="object")return;const o=n[a];if(!o){n[a]=s;return}const i=Ae(o.updatedAt||o.createdAt);Ae(s.updatedAt||s.createdAt)>i&&(n[a]=s)}),r.meetingNotesByEvent=n,localStorage.setItem(Vn,JSON.stringify(n))}function Lo(e){return dc(e)}function _o(e){return Eg(e)}function Hg(e){const t=_o(r.deletedEntityTombstones),n=_o(e),a={...t};Object.entries(n).forEach(([s,o])=>{const i=a[s]||{},l={...i};Object.entries(o).forEach(([d,c])=>{const p=Ae(i[d]);Ae(c)>p&&(l[d]=c)}),a[s]=l}),r.deletedEntityTombstones=a,localStorage.setItem(Un,JSON.stringify(a))}function kt(e,t){if(!e||!t)return!1;const n=r.deletedEntityTombstones&&typeof r.deletedEntityTombstones=="object"?r.deletedEntityTombstones:{};return!!(n[e]&&n[e][String(t)])}function Wg(){r.taskAreas=(r.taskAreas||[]).filter(e=>!kt("taskCategories",e?.id)),localStorage.setItem(_t,JSON.stringify(r.taskAreas)),r.taskCategories=(r.taskCategories||[]).filter(e=>!kt("categories",e?.id)),localStorage.setItem(fn,JSON.stringify(r.taskCategories)),r.taskLabels=(r.taskLabels||[]).filter(e=>!kt("taskLabels",e?.id)),localStorage.setItem(Ot,JSON.stringify(r.taskLabels)),r.taskPeople=(r.taskPeople||[]).filter(e=>!kt("taskPeople",e?.id)),localStorage.setItem(Rt,JSON.stringify(r.taskPeople)),r.customPerspectives=(r.customPerspectives||[]).filter(e=>!kt("customPerspectives",e?.id)),localStorage.setItem(pn,JSON.stringify(r.customPerspectives)),r.homeWidgets=(r.homeWidgets||[]).filter(e=>!kt("homeWidgets",e?.id)),localStorage.setItem(bt,JSON.stringify(r.homeWidgets)),r.triggers=(r.triggers||[]).filter(e=>!kt("triggers",e?.id)),localStorage.setItem(Bt,JSON.stringify(r.triggers))}function Gg(e){const t=Lo(r.deletedTaskTombstones),n=Lo(e),a={...t};Object.entries(n).forEach(([s,o])=>{const i=Ae(a[s]);Ae(o)>i&&(a[s]=o)}),r.deletedTaskTombstones=a,localStorage.setItem(Gn,JSON.stringify(a))}function Oo(e){return e?!!(r.deletedTaskTombstones&&typeof r.deletedTaskTombstones=="object"?r.deletedTaskTombstones:{})[String(e)]:!1}function Ug(){const e=Array.isArray(r.tasksData)?r.tasksData.length:0;r.tasksData=(r.tasksData||[]).filter(t=>!Oo(t?.id)),r.tasksData.length!==e&&localStorage.setItem(un,JSON.stringify(r.tasksData))}function wt(e=[],t=[],n=[],a=""){const o=Ag(e,t,n,a?l=>kt(a,l):null),i=new Map;return(Array.isArray(e)?e:[]).forEach(l=>{ja(l)&&l.id&&i.set(l.id,l)}),(Array.isArray(t)?t:[]).forEach(l=>{if(!ja(l)||!l.id)return;const d=i.get(l.id);if(d)if(!n.length)JSON.stringify(d)!==JSON.stringify(l)&&jl({entity:"collection",mode:"local_wins",itemId:String(l.id),reason:"No timestamp field for deterministic newest-wins merge"});else{const c=Ae(n.map(m=>d[m]).find(Boolean));Ae(n.map(m=>l[m]).find(Boolean))===c&&JSON.stringify(d)!==JSON.stringify(l)&&jl({entity:"timestamped_collection",mode:"local_wins_tie",itemId:String(l.id),reason:"Tied timestamps with different payloads"})}}),o}function Ro(e={}){Gg(e.deletedTaskTombstones),Hg(e.deletedEntityTombstones),Wg(),Ug();const t=Array.isArray(e.tasks)?e.tasks.filter(p=>!Oo(p?.id)):[],n=wt(r.tasksData,t,["updatedAt","createdAt"]).filter(p=>!Oo(p?.id));r.tasksData=n,localStorage.setItem(un,JSON.stringify(r.tasksData));const a=["updatedAt","createdAt"],s=wt(r.taskAreas,e.taskCategories,a,"taskCategories");r.taskAreas=s,localStorage.setItem(_t,JSON.stringify(r.taskAreas));const o=wt(r.taskCategories,e.categories,a,"categories");r.taskCategories=o,localStorage.setItem(fn,JSON.stringify(r.taskCategories));const i=wt(r.taskLabels,e.taskLabels,a,"taskLabels");r.taskLabels=i,localStorage.setItem(Ot,JSON.stringify(r.taskLabels));const l=wt(r.taskPeople,e.taskPeople,a,"taskPeople");r.taskPeople=l.map(p=>({...p,email:typeof p?.email=="string"?p.email:"",jobTitle:typeof p?.jobTitle=="string"?p.jobTitle:"",photoUrl:typeof p?.photoUrl=="string"?p.photoUrl:"",photoData:typeof p?.photoData=="string"?p.photoData:""})),localStorage.setItem(Rt,JSON.stringify(r.taskPeople));const d=wt(r.customPerspectives,e.customPerspectives,a,"customPerspectives");r.customPerspectives=d,localStorage.setItem(pn,JSON.stringify(r.customPerspectives));const c=wt(r.homeWidgets,e.homeWidgets,["updatedAt","createdAt"],"homeWidgets");if(r.homeWidgets=c,localStorage.setItem(bt,JSON.stringify(r.homeWidgets)),Array.isArray(e.triggers)){const p=wt(r.triggers,e.triggers,["updatedAt","createdAt"],"triggers");r.triggers=p,localStorage.setItem(Bt,JSON.stringify(r.triggers))}}function Fl(e){r.allData=e.allData,r.tasksData=e.tasksData,r.deletedTaskTombstones=e.deletedTaskTombstones,r.deletedEntityTombstones=e.deletedEntityTombstones,r.taskAreas=e.taskAreas,r.taskCategories=e.taskCategories,r.taskLabels=e.taskLabels,r.taskPeople=e.taskPeople,r.customPerspectives=e.customPerspectives,r.homeWidgets=e.homeWidgets,r.triggers=e.triggers,r.meetingNotesByEvent=e.meetingNotesByEvent,r.conflictNotifications=e.conflictNotifications,localStorage.setItem(an,JSON.stringify(e.allData)),localStorage.setItem(un,JSON.stringify(e.tasksData)),localStorage.setItem(Gn,JSON.stringify(e.deletedTaskTombstones)),localStorage.setItem(Un,JSON.stringify(e.deletedEntityTombstones)),localStorage.setItem(_t,JSON.stringify(e.taskAreas)),localStorage.setItem(fn,JSON.stringify(e.taskCategories)),localStorage.setItem(Ot,JSON.stringify(e.taskLabels)),localStorage.setItem(Rt,JSON.stringify(e.taskPeople)),localStorage.setItem(pn,JSON.stringify(e.customPerspectives)),localStorage.setItem(bt,JSON.stringify(e.homeWidgets)),localStorage.setItem(Bt,JSON.stringify(e.triggers)),localStorage.setItem(Vn,JSON.stringify(e.meetingNotesByEvent)),localStorage.setItem(qn,JSON.stringify(e.conflictNotifications)),console.log("Rolled back pull-merge after PUT failure")}async function Xt(e={}){const t=Et();if(!t)return console.log("No GitHub token configured"),!1;if(r.syncInProgress)return r.syncPendingRetry=!0,!1;r.syncInProgress=!0,Ce("syncing","Saving to GitHub...");const n=performance.now();let a=null;try{const s=await Ha(`https://api.github.com/repos/${Co}/${Eo}/contents/${Do}`,{headers:{Authorization:`token ${t}`}});let o=null;if(s.ok){const g=await s.json();o=g.sha;try{const b=atob(g.content),y=Uint8Array.from(b,T=>T.codePointAt(0)),f=new TextDecoder().decode(y),x=JSON.parse(f),k=gc(x);k.length>0?console.warn("Cloud payload validation failed during pull-merge:",k):hc(x)?await mc(x)?(a=Og({allData:r.allData,tasksData:r.tasksData,deletedTaskTombstones:r.deletedTaskTombstones,deletedEntityTombstones:r.deletedEntityTombstones,taskAreas:r.taskAreas,taskCategories:r.taskCategories,taskLabels:r.taskLabels,taskPeople:r.taskPeople,customPerspectives:r.customPerspectives,homeWidgets:r.homeWidgets,triggers:r.triggers||[],meetingNotesByEvent:r.meetingNotesByEvent||{},conflictNotifications:r.conflictNotifications||[]}),x?.data&&vc(x.data),x&&Ro(x),x?.meetingNotesByEvent&&No(x.meetingNotesByEvent)):console.warn("Cloud data checksum mismatch during pull-merge — skipping merge"):console.warn("Skipping pull-merge: cloud schema version is newer")}catch(b){console.warn("Cloud merge error:",b.message)}}r.syncSequence++,localStorage.setItem(Si,r.syncSequence.toString());const i={_schemaVersion:Oa,_sequence:r.syncSequence,lastUpdated:new Date().toISOString(),data:r.allData,weights:r.WEIGHTS,maxScores:r.MAX_SCORES,categoryWeights:r.CATEGORY_WEIGHTS,tasks:r.tasksData,deletedTaskTombstones:Lo(r.deletedTaskTombstones),deletedEntityTombstones:_o(r.deletedEntityTombstones),taskCategories:r.taskAreas,categories:r.taskCategories,taskLabels:r.taskLabels,taskPeople:r.taskPeople,customPerspectives:r.customPerspectives,homeWidgets:r.homeWidgets,meetingNotesByEvent:r.meetingNotesByEvent||{},triggers:r.triggers||[],encryptedCredentials:await Ig(),xp:r.xp,streak:r.streak,achievements:r.achievements},l=JSON.stringify(i);i._checksum=await fc(l);const d=JSON.stringify(i),c=Math.round(new TextEncoder().encode(d).byteLength/1024);c>800&&console.warn(`Sync payload ${c}KB — approaching GitHub API limit (1MB)`);const p=new TextEncoder().encode(d),m=Array.from(p,g=>String.fromCodePoint(g)).join(""),u=btoa(m),h=await Ha(`https://api.github.com/repos/${Co}/${Eo}/contents/${Do}`,{method:"PUT",headers:{Authorization:`token ${t}`,"Content-Type":"application/json"},body:JSON.stringify({message:`Auto-save: ${new Date().toLocaleString()}`,content:u,...o?{sha:o}:{}}),keepalive:!!e.keepalive});if(h.ok){const g=Math.round(performance.now()-n);if(a)try{localStorage.setItem(an,JSON.stringify(r.allData)),localStorage.setItem(un,JSON.stringify(r.tasksData)),localStorage.setItem(Gn,JSON.stringify(r.deletedTaskTombstones)),localStorage.setItem(Un,JSON.stringify(r.deletedEntityTombstones)),localStorage.setItem(_t,JSON.stringify(r.taskAreas)),localStorage.setItem(fn,JSON.stringify(r.taskCategories)),localStorage.setItem(Ot,JSON.stringify(r.taskLabels)),localStorage.setItem(Rt,JSON.stringify(r.taskPeople)),localStorage.setItem(pn,JSON.stringify(r.customPerspectives)),localStorage.setItem(bt,JSON.stringify(r.homeWidgets)),localStorage.setItem(Bt,JSON.stringify(r.triggers)),localStorage.setItem(Vn,JSON.stringify(r.meetingNotesByEvent||{})),localStorage.setItem(qn,JSON.stringify(r.conflictNotifications||[]))}catch(b){console.warn("localStorage quota exceeded during sync persist — cloud has full state, dirty flag preserved:",b.message),b.name==="QuotaExceededError"&&(r.quotaExceededError=!0)}return r.syncRetryCount=0,r.syncRateLimited=!1,r.githubSyncDirty=!1,localStorage.setItem(vs,"false"),r.syncRetryTimer&&(clearTimeout(r.syncRetryTimer),r.syncRetryTimer=null),nt("save","success",g,`${c}KB`),Ce("success","Saved to GitHub"),console.log(`Saved to GitHub (${c}KB, ${g}ms)`),!0}else{a&&Fl(a);let g=`HTTP ${h.status}`;try{g=(await h.json()).message||g}catch{}throw h.status===409?new Error("Conflict: file changed by another device"):h.status===401?new Error("GitHub token is invalid or expired"):h.status===403?(r.syncRateLimited=!0,setTimeout(()=>{r.syncRateLimited=!1},6e4),new Error("GitHub rate limit exceeded — try again later")):new Error(g)}}catch(s){const o=Math.round(performance.now()-n);a&&Fl(a),Ce("error",`Sync failed: ${s.message}`),console.error("GitHub save failed:",s),nt("save","error",o,s.message);const c=s.message.includes("Conflict")?6:4;if(r.syncRetryCount<c){r.syncRetryCount++;const p=Math.min(2e3*Math.pow(2,r.syncRetryCount),3e4),m=Math.random()*p*.5,u=Math.round(p+m);console.log(`Retrying save in ${u/1e3}s (attempt ${r.syncRetryCount}/${c})`),r.syncRetryTimer&&clearTimeout(r.syncRetryTimer),r.syncRetryTimer=setTimeout(()=>{r.syncRetryTimer=null,Xt().catch(h=>console.error("Retry save failed:",h))},u)}return!1}finally{r.syncInProgress=!1,r.syncPendingRetry&&(r.syncPendingRetry=!1,Ni()),r.cloudPullPending&&(r.cloudPullPending=!1,zr().then(()=>{typeof window.render=="function"&&window.render()}).catch(()=>{}))}}function Ni(){r.githubSyncDirty=!0,localStorage.setItem(vs,"true"),r.syncDebounceTimer&&clearTimeout(r.syncDebounceTimer),r.syncRetryTimer&&(clearTimeout(r.syncRetryTimer),r.syncRetryTimer=null),r.syncRateLimited||(r.syncRetryCount=0),r.syncDebounceTimer=setTimeout(()=>{r.syncDebounceTimer=null,Xt().catch(e=>console.error("Debounced save failed:",e))},2e3)}function Hl(e={}){if(r.syncDebounceTimer){clearTimeout(r.syncDebounceTimer),r.syncDebounceTimer=null,r.githubSyncDirty=!0;try{localStorage.setItem(vs,"true")}catch{}Xt(e).catch(t=>console.error("Flush save failed:",t))}}async function zr(){if(r.syncInProgress){r.cloudPullPending=!0;return}r.syncInProgress=!0;const e=Et();function t(a,s){const o=localStorage.getItem(ba);if(!a)return!1;const i=r.syncSequence;if(typeof s=="number"&&s>0){if(s>i)return!0;if(s<i)return!1}const l=o?new Date(parseInt(o,10)):null,d=new Date(a);return!l||isNaN(l.getTime())?!0:d>l}function n(a){if(a?.data){if(t(a.lastUpdated,a._sequence)){localStorage.setItem(an,JSON.stringify(a.data)),r.allData=a.data,localStorage.setItem(ba,new Date(a.lastUpdated).getTime().toString());return}vc(a.data),localStorage.setItem(an,JSON.stringify(r.allData)),localStorage.setItem(ba,Date.now().toString())}}try{if(e){const s=await Ha(`https://api.github.com/repos/${Co}/${Eo}/contents/${Do}`,{headers:{Authorization:`token ${e}`}});if(s.ok){const o=await s.json(),i=atob(o.content),l=Uint8Array.from(i,u=>u.codePointAt(0)),d=new TextDecoder().decode(l);let c;try{c=JSON.parse(d)}catch(u){console.error("Failed to parse cloud data:",u),Ce("error","Corrupted cloud data"),nt("load","error",0,"JSON parse failed");return}if(!await mc(c)){console.error("Cloud data checksum mismatch — possible corruption"),Ce("error","Cloud data integrity check failed"),nt("load","error",0,"Checksum mismatch");return}if(!hc(c)){nt("load","error",0,`Schema v${c._schemaVersion} > v${Oa}`);return}const m=gc(c);if(m.length>0){console.error("Cloud payload validation failed:",m),Ce("error","Cloud data failed validation"),nt("load","error",0,`Validation: ${m.join("; ")}`);return}if(typeof c._sequence=="number"&&c._sequence>r.syncSequence&&(r.syncSequence=c._sequence,localStorage.setItem(Si,r.syncSequence.toString())),n(c),Vt("WEIGHTS",c.weights,Ir),Vt("MAX_SCORES",c.maxScores,Hr),Ro(c),c.meetingNotesByEvent&&No(c.meetingNotesByEvent),Vt("CATEGORY_WEIGHTS",c.categoryWeights,xs),Vt("xp",c.xp,bs),Vt("streak",c.streak,ys),Vt("achievements",c.achievements,ws),c.encryptedCredentials)try{await $g(c.encryptedCredentials)}catch(u){console.warn("Credential restore skipped:",u.message)}console.log("Loaded from GitHub"),nt("load","success"),Ce("success","Loaded from GitHub");return}else{if(s.status===401)throw Ce("error","GitHub token invalid or expired"),console.error("GitHub auth failed (401) — token may be expired"),nt("load","error",0,"Auth failed (401)"),Object.assign(new Error("Auth failed"),{status:401});if(s.status===403)throw Ce("error","GitHub rate limit exceeded"),console.error("GitHub rate limited (403)"),nt("load","error",0,"Rate limited (403)"),Object.assign(new Error("Rate limited"),{status:403});if(s.status===404)console.log("Cloud data file not found — first sync will create it");else throw new Error(`GitHub API returned ${s.status}`)}}const a=await Ha(Ff+"?t="+Date.now());if(a.ok){const s=await a.json();n(s),Vt("WEIGHTS",s.weights,Ir),Ro(s),s.meetingNotesByEvent&&No(s.meetingNotesByEvent),console.log("Cloud data synced (static file)"),zg()}}catch(a){if(a.name==="AbortError"||!navigator.onLine)console.log("Offline mode — using local data");else if(console.error("Cloud load failed:",a.message),Ce("error",`Load failed: ${a.message}`),a.status!==401&&a.status!==403)throw a}finally{r.syncInProgress=!1}}async function bc(e=3){for(let t=0;t<=e;t++)try{await zr();return}catch(n){if(n?.status===401||n?.status===403||!navigator.onLine||n?.name==="AbortError")return;if(t<e){const a=2e3*Math.pow(2,t);console.log(`Cloud load retry ${t+1}/${e} in ${a/1e3}s`),await new Promise(s=>setTimeout(s,a))}else console.error("Cloud load failed after",e,"retries")}}function zg(){r.scoresCache.clear(),r.scoresCacheVersion++}function Vg(){const e={data:r.allData,weights:r.WEIGHTS,maxScores:r.MAX_SCORES,categoryWeights:r.CATEGORY_WEIGHTS,tasks:r.tasksData,taskCategories:r.taskAreas,categories:r.taskCategories,taskLabels:r.taskLabels,taskPeople:r.taskPeople,customPerspectives:r.customPerspectives,homeWidgets:r.homeWidgets,triggers:r.triggers,meetingNotesByEvent:r.meetingNotesByEvent||{},xp:r.xp,streak:r.streak,achievements:r.achievements,deletedTaskTombstones:r.deletedTaskTombstones||{},deletedEntityTombstones:r.deletedEntityTombstones||{},lastUpdated:new Date().toISOString()},t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),n=URL.createObjectURL(t),a=document.createElement("a");a.href=n,a.download="life-gamification-backup-"+U()+".json",a.click(),URL.revokeObjectURL(n)}function qg(e){const t=[];return!e||typeof e!="object"?(t.push("File is not a valid JSON object"),t):["data","weights","tasks","taskCategories","categories","taskLabels","taskPeople","customPerspectives","homeWidgets","triggers","meetingNotesByEvent","xp","streak","achievements","maxScores","categoryWeights","deletedTaskTombstones","deletedEntityTombstones"].some(s=>e[s]!==void 0)?(e.data!==void 0&&(typeof e.data!="object"||Array.isArray(e.data))&&t.push("data must be an object (daily tracking entries)"),e.tasks!==void 0&&!Array.isArray(e.tasks)&&t.push("tasks must be an array"),e.tasks&&Array.isArray(e.tasks)&&e.tasks.slice(0,5).forEach((o,i)=>{!o||typeof o!="object"?t.push(`tasks[${i}] is not an object`):o.id||t.push(`tasks[${i}] missing id`)}),e.taskCategories!==void 0&&!Array.isArray(e.taskCategories)&&t.push("taskCategories must be an array"),e.categories!==void 0&&!Array.isArray(e.categories)&&t.push("categories must be an array"),e.taskLabels!==void 0&&!Array.isArray(e.taskLabels)&&t.push("taskLabels must be an array"),e.taskPeople!==void 0&&!Array.isArray(e.taskPeople)&&t.push("taskPeople must be an array"),t):(t.push("File does not contain any recognized Homebase data"),t)}function Kg(){const e={data:r.allData,weights:r.WEIGHTS,maxScores:r.MAX_SCORES,categoryWeights:r.CATEGORY_WEIGHTS,tasks:r.tasksData,taskCategories:r.taskAreas,categories:r.taskCategories,taskLabels:r.taskLabels,taskPeople:r.taskPeople,customPerspectives:r.customPerspectives,homeWidgets:r.homeWidgets,triggers:r.triggers,meetingNotesByEvent:r.meetingNotesByEvent||{},xp:r.xp,streak:r.streak,achievements:r.achievements,deletedTaskTombstones:r.deletedTaskTombstones||{},deletedEntityTombstones:r.deletedEntityTombstones||{},lastUpdated:new Date().toISOString()};try{return localStorage.setItem("lifeGamification_preImportBackup",JSON.stringify(e)),!0}catch(t){return console.warn("Could not create pre-import backup:",t.message),!1}}function Yg(e){const t=e.target.files[0];if(!t)return;const n=new FileReader;n.onload=a=>{try{const s=JSON.parse(a.target.result),o=qg(s);if(o.length>0){alert(`Import failed — invalid data:

`+o.join(`
`));return}const i=Array.isArray(s.tasks)?s.tasks.length:0,l=s.data?Object.keys(s.data).length:0,d=s.lastUpdated?new Date(s.lastUpdated).toLocaleDateString():"unknown";if(!confirm(`Import backup from ${d}?

This will REPLACE your current data:
• ${i} tasks
• ${l} days of tracking data

A backup of your current data will be saved automatically.
Continue?`)||!Kg()&&!confirm(`Warning: Could not create a safety backup (storage may be full).
Continue import anyway? Data cannot be recovered if something goes wrong.`))return;if(s.data&&(r.allData=s.data,Yn()),s.weights&&(r.WEIGHTS={...s.weights,_updatedAt:new Date().toISOString()},ac()),s.maxScores&&(r.MAX_SCORES={...s.maxScores,_updatedAt:new Date().toISOString()},localStorage.setItem(Hr,JSON.stringify(r.MAX_SCORES))),s.categoryWeights&&(r.CATEGORY_WEIGHTS={...s.categoryWeights,_updatedAt:new Date().toISOString()},localStorage.setItem(xs,JSON.stringify(r.CATEGORY_WEIGHTS))),s.xp&&(r.xp={...s.xp,_updatedAt:new Date().toISOString()},localStorage.setItem(bs,JSON.stringify(r.xp))),s.streak&&(r.streak={...s.streak,_updatedAt:new Date().toISOString()},localStorage.setItem(ys,JSON.stringify(r.streak))),s.achievements&&(r.achievements={...s.achievements,_updatedAt:new Date().toISOString()},localStorage.setItem(ws,JSON.stringify(r.achievements))),s.tasks&&(r.tasksData=s.tasks,localStorage.setItem(un,JSON.stringify(r.tasksData))),s.taskCategories&&(r.taskAreas=s.taskCategories,localStorage.setItem(_t,JSON.stringify(r.taskAreas))),s.categories&&(r.taskCategories=s.categories,localStorage.setItem(fn,JSON.stringify(r.taskCategories))),s.taskLabels&&(r.taskLabels=s.taskLabels,localStorage.setItem(Ot,JSON.stringify(r.taskLabels))),s.taskPeople&&(r.taskPeople=s.taskPeople.map(m=>({...m,email:typeof m?.email=="string"?m.email:""})),localStorage.setItem(Rt,JSON.stringify(r.taskPeople))),s.customPerspectives&&(r.customPerspectives=s.customPerspectives,localStorage.setItem(pn,JSON.stringify(r.customPerspectives))),s.homeWidgets&&(r.homeWidgets=s.homeWidgets,localStorage.setItem(bt,JSON.stringify(r.homeWidgets))),s.triggers&&(r.triggers=s.triggers,localStorage.setItem(Bt,JSON.stringify(r.triggers))),s.meetingNotesByEvent&&(r.meetingNotesByEvent=s.meetingNotesByEvent,localStorage.setItem(Vn,JSON.stringify(r.meetingNotesByEvent))),s.deletedTaskTombstones&&(r.deletedTaskTombstones={...r.deletedTaskTombstones,...s.deletedTaskTombstones},localStorage.setItem(Gn,JSON.stringify(r.deletedTaskTombstones))),s.deletedEntityTombstones){const m={...r.deletedEntityTombstones};for(const[u,h]of Object.entries(s.deletedEntityTombstones))m[u]={...m[u]||{},...h};r.deletedEntityTombstones=m,localStorage.setItem(Un,JSON.stringify(r.deletedEntityTombstones))}typeof window.invalidateScoresCache=="function"&&window.invalidateScoresCache(),alert("Data imported successfully!"),window.debouncedSaveToGithub(),window.render()}catch(s){alert("Error importing data: "+s.message)}},n.readAsText(t)}const Jg=()=>{};var Wl={};const yc=function(e){const t=[];let n=0;for(let a=0;a<e.length;a++){let s=e.charCodeAt(a);s<128?t[n++]=s:s<2048?(t[n++]=s>>6|192,t[n++]=s&63|128):(s&64512)===55296&&a+1<e.length&&(e.charCodeAt(a+1)&64512)===56320?(s=65536+((s&1023)<<10)+(e.charCodeAt(++a)&1023),t[n++]=s>>18|240,t[n++]=s>>12&63|128,t[n++]=s>>6&63|128,t[n++]=s&63|128):(t[n++]=s>>12|224,t[n++]=s>>6&63|128,t[n++]=s&63|128)}return t},Xg=function(e){const t=[];let n=0,a=0;for(;n<e.length;){const s=e[n++];if(s<128)t[a++]=String.fromCharCode(s);else if(s>191&&s<224){const o=e[n++];t[a++]=String.fromCharCode((s&31)<<6|o&63)}else if(s>239&&s<365){const o=e[n++],i=e[n++],l=e[n++],d=((s&7)<<18|(o&63)<<12|(i&63)<<6|l&63)-65536;t[a++]=String.fromCharCode(55296+(d>>10)),t[a++]=String.fromCharCode(56320+(d&1023))}else{const o=e[n++],i=e[n++];t[a++]=String.fromCharCode((s&15)<<12|(o&63)<<6|i&63)}}return t.join("")},wc={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,a=[];for(let s=0;s<e.length;s+=3){const o=e[s],i=s+1<e.length,l=i?e[s+1]:0,d=s+2<e.length,c=d?e[s+2]:0,p=o>>2,m=(o&3)<<4|l>>4;let u=(l&15)<<2|c>>6,h=c&63;d||(h=64,i||(u=64)),a.push(n[p],n[m],n[u],n[h])}return a.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(yc(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):Xg(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,a=[];for(let s=0;s<e.length;){const o=n[e.charAt(s++)],l=s<e.length?n[e.charAt(s)]:0;++s;const c=s<e.length?n[e.charAt(s)]:64;++s;const m=s<e.length?n[e.charAt(s)]:64;if(++s,o==null||l==null||c==null||m==null)throw new Qg;const u=o<<2|l>>4;if(a.push(u),c!==64){const h=l<<4&240|c>>2;if(a.push(h),m!==64){const g=c<<6&192|m;a.push(g)}}}return a},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};class Qg extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Zg=function(e){const t=yc(e);return wc.encodeByteArray(t,!0)},xc=function(e){return Zg(e).replace(/\./g,"")},kc=function(e){try{return wc.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};function em(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}const tm=()=>em().__FIREBASE_DEFAULTS__,nm=()=>{if(typeof process>"u"||typeof Wl>"u")return;const e=Wl.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},rm=()=>{if(typeof document>"u")return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=e&&kc(e[1]);return t&&JSON.parse(t)},Li=()=>{try{return Jg()||tm()||nm()||rm()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},am=e=>Li()?.emulatorHosts?.[e],Sc=()=>Li()?.config,Tc=e=>Li()?.[`_${e}`];class sm{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,n)=>{this.resolve=t,this.reject=n})}wrapCallback(t){return(n,a)=>{n?this.reject(n):this.resolve(a),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(n):t(n,a))}}}function ks(e){try{return(e.startsWith("http://")||e.startsWith("https://")?new URL(e).hostname:e).endsWith(".cloudworkstations.dev")}catch{return!1}}async function om(e){return(await fetch(e,{credentials:"include"})).ok}const vr={};function im(){const e={prod:[],emulator:[]};for(const t of Object.keys(vr))vr[t]?e.emulator.push(t):e.prod.push(t);return e}function lm(e){let t=document.getElementById(e),n=!1;return t||(t=document.createElement("div"),t.setAttribute("id",e),n=!0),{created:n,element:t}}let Gl=!1;function dm(e,t){if(typeof window>"u"||typeof document>"u"||!ks(window.location.host)||vr[e]===t||vr[e]||Gl)return;vr[e]=t;function n(u){return`__firebase__banner__${u}`}const a="__firebase__banner",o=im().prod.length>0;function i(){const u=document.getElementById(a);u&&u.remove()}function l(u){u.style.display="flex",u.style.background="#7faaf0",u.style.position="fixed",u.style.bottom="5px",u.style.left="5px",u.style.padding=".5em",u.style.borderRadius="5px",u.style.alignItems="center"}function d(u,h){u.setAttribute("width","24"),u.setAttribute("id",h),u.setAttribute("height","24"),u.setAttribute("viewBox","0 0 24 24"),u.setAttribute("fill","none"),u.style.marginLeft="-6px"}function c(){const u=document.createElement("span");return u.style.cursor="pointer",u.style.marginLeft="16px",u.style.fontSize="24px",u.innerHTML=" &times;",u.onclick=()=>{Gl=!0,i()},u}function p(u,h){u.setAttribute("id",h),u.innerText="Learn more",u.href="https://firebase.google.com/docs/studio/preview-apps#preview-backend",u.setAttribute("target","__blank"),u.style.paddingLeft="5px",u.style.textDecoration="underline"}function m(){const u=lm(a),h=n("text"),g=document.getElementById(h)||document.createElement("span"),b=n("learnmore"),y=document.getElementById(b)||document.createElement("a"),f=n("preprendIcon"),x=document.getElementById(f)||document.createElementNS("http://www.w3.org/2000/svg","svg");if(u.created){const k=u.element;l(k),p(y,b);const T=c();d(x,f),k.append(x,g,y,T),document.body.appendChild(k)}o?(g.innerText="Preview backend disconnected.",x.innerHTML=`<g clip-path="url(#clip0_6013_33858)">
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
</defs>`,g.innerText="Preview backend running in this workspace."),g.setAttribute("id",h)}document.readyState==="loading"?window.addEventListener("DOMContentLoaded",m):m()}function we(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function cm(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(we())}function um(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function pm(){const e=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof e=="object"&&e.id!==void 0}function fm(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function gm(){const e=we();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0}function mm(){try{return typeof indexedDB=="object"}catch{return!1}}function hm(){return new Promise((e,t)=>{try{let n=!0;const a="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(a);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(a),e(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{t(s.error?.message||"")}}catch(n){t(n)}})}const vm="FirebaseError";class Ft extends Error{constructor(t,n,a){super(n),this.code=t,this.customData=a,this.name=vm,Object.setPrototypeOf(this,Ft.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Vr.prototype.create)}}class Vr{constructor(t,n,a){this.service=t,this.serviceName=n,this.errors=a}create(t,...n){const a=n[0]||{},s=`${this.service}/${t}`,o=this.errors[t],i=o?bm(o,a):"Error",l=`${this.serviceName}: ${i} (${s}).`;return new Ft(s,l,a)}}function bm(e,t){return e.replace(ym,(n,a)=>{const s=t[a];return s!=null?String(s):`<${a}?>`})}const ym=/\{\$([^}]+)}/g;function wm(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}function On(e,t){if(e===t)return!0;const n=Object.keys(e),a=Object.keys(t);for(const s of n){if(!a.includes(s))return!1;const o=e[s],i=t[s];if(Ul(o)&&Ul(i)){if(!On(o,i))return!1}else if(o!==i)return!1}for(const s of a)if(!n.includes(s))return!1;return!0}function Ul(e){return e!==null&&typeof e=="object"}function qr(e){const t=[];for(const[n,a]of Object.entries(e))Array.isArray(a)?a.forEach(s=>{t.push(encodeURIComponent(n)+"="+encodeURIComponent(s))}):t.push(encodeURIComponent(n)+"="+encodeURIComponent(a));return t.length?"&"+t.join("&"):""}function xm(e,t){const n=new km(e,t);return n.subscribe.bind(n)}class km{constructor(t,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{t(this)}).catch(a=>{this.error(a)})}next(t){this.forEachObserver(n=>{n.next(t)})}error(t){this.forEachObserver(n=>{n.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,n,a){let s;if(t===void 0&&n===void 0&&a===void 0)throw new Error("Missing Observer.");Sm(t,["next","error","complete"])?s=t:s={next:t,error:n,complete:a},s.next===void 0&&(s.next=oo),s.error===void 0&&(s.error=oo),s.complete===void 0&&(s.complete=oo);const o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),o}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,t)}sendOne(t,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{n(this.observers[t])}catch(a){typeof console<"u"&&console.error&&console.error(a)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Sm(e,t){if(typeof e!="object"||e===null)return!1;for(const n of t)if(n in e&&typeof e[n]=="function")return!0;return!1}function oo(){}function Ht(e){return e&&e._delegate?e._delegate:e}class Rn{constructor(t,n,a){this.name=t,this.instanceFactory=n,this.type=a,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}const Kt="[DEFAULT]";class Tm{constructor(t,n){this.name=t,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const n=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(n)){const a=new sm;if(this.instancesDeferred.set(n,a),this.isInitialized(n)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:n});s&&a.resolve(s)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(t){const n=this.normalizeInstanceIdentifier(t?.identifier),a=t?.optional??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(s){if(a)return null;throw s}else{if(a)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if($m(t))try{this.getOrInitializeService({instanceIdentifier:Kt})}catch{}for(const[n,a]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(n);try{const o=this.getOrInitializeService({instanceIdentifier:s});a.resolve(o)}catch{}}}}clearInstance(t=Kt){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...t.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=Kt){return this.instances.has(t)}getOptions(t=Kt){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:n={}}=t,a=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(a))throw Error(`${this.name}(${a}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:a,options:n});for(const[o,i]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(o);a===l&&i.resolve(s)}return s}onInit(t,n){const a=this.normalizeInstanceIdentifier(n),s=this.onInitCallbacks.get(a)??new Set;s.add(t),this.onInitCallbacks.set(a,s);const o=this.instances.get(a);return o&&t(o,a),()=>{s.delete(t)}}invokeOnInitCallbacks(t,n){const a=this.onInitCallbacks.get(n);if(a)for(const s of a)try{s(t,n)}catch{}}getOrInitializeService({instanceIdentifier:t,options:n={}}){let a=this.instances.get(t);if(!a&&this.component&&(a=this.component.instanceFactory(this.container,{instanceIdentifier:Im(t),options:n}),this.instances.set(t,a),this.instancesOptions.set(t,n),this.invokeOnInitCallbacks(a,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,a)}catch{}return a||null}normalizeInstanceIdentifier(t=Kt){return this.component?this.component.multipleInstances?t:Kt:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Im(e){return e===Kt?void 0:e}function $m(e){return e.instantiationMode==="EAGER"}class Cm{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const n=this.getProvider(t.name);if(n.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);n.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const n=new Tm(t,this);return this.providers.set(t,n),n}getProviders(){return Array.from(this.providers.values())}}var X;(function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"})(X||(X={}));const Em={debug:X.DEBUG,verbose:X.VERBOSE,info:X.INFO,warn:X.WARN,error:X.ERROR,silent:X.SILENT},Dm=X.INFO,Am={[X.DEBUG]:"log",[X.VERBOSE]:"log",[X.INFO]:"info",[X.WARN]:"warn",[X.ERROR]:"error"},Mm=(e,t,...n)=>{if(t<e.logLevel)return;const a=new Date().toISOString(),s=Am[t];if(s)console[s](`[${a}]  ${e.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class Ic{constructor(t){this.name=t,this._logLevel=Dm,this._logHandler=Mm,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in X))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?Em[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,X.DEBUG,...t),this._logHandler(this,X.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,X.VERBOSE,...t),this._logHandler(this,X.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,X.INFO,...t),this._logHandler(this,X.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,X.WARN,...t),this._logHandler(this,X.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,X.ERROR,...t),this._logHandler(this,X.ERROR,...t)}}const Pm=(e,t)=>t.some(n=>e instanceof n);let zl,Vl;function Nm(){return zl||(zl=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Lm(){return Vl||(Vl=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const $c=new WeakMap,Bo=new WeakMap,Cc=new WeakMap,io=new WeakMap,_i=new WeakMap;function _m(e){const t=new Promise((n,a)=>{const s=()=>{e.removeEventListener("success",o),e.removeEventListener("error",i)},o=()=>{n(Mt(e.result)),s()},i=()=>{a(e.error),s()};e.addEventListener("success",o),e.addEventListener("error",i)});return t.then(n=>{n instanceof IDBCursor&&$c.set(n,e)}).catch(()=>{}),_i.set(t,e),t}function Om(e){if(Bo.has(e))return;const t=new Promise((n,a)=>{const s=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",i),e.removeEventListener("abort",i)},o=()=>{n(),s()},i=()=>{a(e.error||new DOMException("AbortError","AbortError")),s()};e.addEventListener("complete",o),e.addEventListener("error",i),e.addEventListener("abort",i)});Bo.set(e,t)}let jo={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return Bo.get(e);if(t==="objectStoreNames")return e.objectStoreNames||Cc.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Mt(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function Rm(e){jo=e(jo)}function Bm(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){const a=e.call(lo(this),t,...n);return Cc.set(a,t.sort?t.sort():[t]),Mt(a)}:Lm().includes(e)?function(...t){return e.apply(lo(this),t),Mt($c.get(this))}:function(...t){return Mt(e.apply(lo(this),t))}}function jm(e){return typeof e=="function"?Bm(e):(e instanceof IDBTransaction&&Om(e),Pm(e,Nm())?new Proxy(e,jo):e)}function Mt(e){if(e instanceof IDBRequest)return _m(e);if(io.has(e))return io.get(e);const t=jm(e);return t!==e&&(io.set(e,t),_i.set(t,e)),t}const lo=e=>_i.get(e);function Fm(e,t,{blocked:n,upgrade:a,blocking:s,terminated:o}={}){const i=indexedDB.open(e,t),l=Mt(i);return a&&i.addEventListener("upgradeneeded",d=>{a(Mt(i.result),d.oldVersion,d.newVersion,Mt(i.transaction),d)}),n&&i.addEventListener("blocked",d=>n(d.oldVersion,d.newVersion,d)),l.then(d=>{o&&d.addEventListener("close",()=>o()),s&&d.addEventListener("versionchange",c=>s(c.oldVersion,c.newVersion,c))}).catch(()=>{}),l}const Hm=["get","getKey","getAll","getAllKeys","count"],Wm=["put","add","delete","clear"],co=new Map;function ql(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(co.get(t))return co.get(t);const n=t.replace(/FromIndex$/,""),a=t!==n,s=Wm.includes(n);if(!(n in(a?IDBIndex:IDBObjectStore).prototype)||!(s||Hm.includes(n)))return;const o=async function(i,...l){const d=this.transaction(i,s?"readwrite":"readonly");let c=d.store;return a&&(c=c.index(l.shift())),(await Promise.all([c[n](...l),s&&d.done]))[0]};return co.set(t,o),o}Rm(e=>({...e,get:(t,n,a)=>ql(t,n)||e.get(t,n,a),has:(t,n)=>!!ql(t,n)||e.has(t,n)}));class Gm{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Um(n)){const a=n.getImmediate();return`${a.library}/${a.version}`}else return null}).filter(n=>n).join(" ")}}function Um(e){return e.getComponent()?.type==="VERSION"}const Fo="@firebase/app",Kl="0.14.8";const ft=new Ic("@firebase/app"),zm="@firebase/app-compat",Vm="@firebase/analytics-compat",qm="@firebase/analytics",Km="@firebase/app-check-compat",Ym="@firebase/app-check",Jm="@firebase/auth",Xm="@firebase/auth-compat",Qm="@firebase/database",Zm="@firebase/data-connect",eh="@firebase/database-compat",th="@firebase/functions",nh="@firebase/functions-compat",rh="@firebase/installations",ah="@firebase/installations-compat",sh="@firebase/messaging",oh="@firebase/messaging-compat",ih="@firebase/performance",lh="@firebase/performance-compat",dh="@firebase/remote-config",ch="@firebase/remote-config-compat",uh="@firebase/storage",ph="@firebase/storage-compat",fh="@firebase/firestore",gh="@firebase/ai",mh="@firebase/firestore-compat",hh="firebase",vh="12.9.0";const Ho="[DEFAULT]",bh={[Fo]:"fire-core",[zm]:"fire-core-compat",[qm]:"fire-analytics",[Vm]:"fire-analytics-compat",[Ym]:"fire-app-check",[Km]:"fire-app-check-compat",[Jm]:"fire-auth",[Xm]:"fire-auth-compat",[Qm]:"fire-rtdb",[Zm]:"fire-data-connect",[eh]:"fire-rtdb-compat",[th]:"fire-fn",[nh]:"fire-fn-compat",[rh]:"fire-iid",[ah]:"fire-iid-compat",[sh]:"fire-fcm",[oh]:"fire-fcm-compat",[ih]:"fire-perf",[lh]:"fire-perf-compat",[dh]:"fire-rc",[ch]:"fire-rc-compat",[uh]:"fire-gcs",[ph]:"fire-gcs-compat",[fh]:"fire-fst",[mh]:"fire-fst-compat",[gh]:"fire-vertex","fire-js":"fire-js",[hh]:"fire-js-all"};const Wa=new Map,yh=new Map,Wo=new Map;function Yl(e,t){try{e.container.addComponent(t)}catch(n){ft.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function Pr(e){const t=e.name;if(Wo.has(t))return ft.debug(`There were multiple attempts to register component ${t}.`),!1;Wo.set(t,e);for(const n of Wa.values())Yl(n,e);for(const n of yh.values())Yl(n,e);return!0}function Ec(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}function st(e){return e==null?!1:e.settings!==void 0}const wh={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Pt=new Vr("app","Firebase",wh);class xh{constructor(t,n,a){this._isDeleted=!1,this._options={...t},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=a,this.container.addComponent(new Rn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw Pt.create("app-deleted",{appName:this._name})}}const Kr=vh;function Dc(e,t={}){let n=e;typeof t!="object"&&(t={name:t});const a={name:Ho,automaticDataCollectionEnabled:!0,...t},s=a.name;if(typeof s!="string"||!s)throw Pt.create("bad-app-name",{appName:String(s)});if(n||(n=Sc()),!n)throw Pt.create("no-options");const o=Wa.get(s);if(o){if(On(n,o.options)&&On(a,o.config))return o;throw Pt.create("duplicate-app",{appName:s})}const i=new Cm(s);for(const d of Wo.values())i.addComponent(d);const l=new xh(n,a,i);return Wa.set(s,l),l}function kh(e=Ho){const t=Wa.get(e);if(!t&&e===Ho&&Sc())return Dc();if(!t)throw Pt.create("no-app",{appName:e});return t}function Tn(e,t,n){let a=bh[e]??e;n&&(a+=`-${n}`);const s=a.match(/\s|\//),o=t.match(/\s|\//);if(s||o){const i=[`Unable to register library "${a}" with version "${t}":`];s&&i.push(`library name "${a}" contains illegal characters (whitespace or "/")`),s&&o&&i.push("and"),o&&i.push(`version name "${t}" contains illegal characters (whitespace or "/")`),ft.warn(i.join(" "));return}Pr(new Rn(`${a}-version`,()=>({library:a,version:t}),"VERSION"))}const Sh="firebase-heartbeat-database",Th=1,Nr="firebase-heartbeat-store";let uo=null;function Ac(){return uo||(uo=Fm(Sh,Th,{upgrade:(e,t)=>{switch(t){case 0:try{e.createObjectStore(Nr)}catch(n){console.warn(n)}}}}).catch(e=>{throw Pt.create("idb-open",{originalErrorMessage:e.message})})),uo}async function Ih(e){try{const n=(await Ac()).transaction(Nr),a=await n.objectStore(Nr).get(Mc(e));return await n.done,a}catch(t){if(t instanceof Ft)ft.warn(t.message);else{const n=Pt.create("idb-get",{originalErrorMessage:t?.message});ft.warn(n.message)}}}async function Jl(e,t){try{const a=(await Ac()).transaction(Nr,"readwrite");await a.objectStore(Nr).put(t,Mc(e)),await a.done}catch(n){if(n instanceof Ft)ft.warn(n.message);else{const a=Pt.create("idb-set",{originalErrorMessage:n?.message});ft.warn(a.message)}}}function Mc(e){return`${e.name}!${e.options.appId}`}const $h=1024,Ch=30;class Eh{constructor(t){this.container=t,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new Ah(n),this._heartbeatsCachePromise=this._storage.read().then(a=>(this._heartbeatsCache=a,a))}async triggerHeartbeat(){try{const n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),a=Xl();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===a||this._heartbeatsCache.heartbeats.some(s=>s.date===a))return;if(this._heartbeatsCache.heartbeats.push({date:a,agent:n}),this._heartbeatsCache.heartbeats.length>Ch){const s=Mh(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(s,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(t){ft.warn(t)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Xl(),{heartbeatsToSend:n,unsentEntries:a}=Dh(this._heartbeatsCache.heartbeats),s=xc(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,a.length>0?(this._heartbeatsCache.heartbeats=a,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return ft.warn(t),""}}}function Xl(){return new Date().toISOString().substring(0,10)}function Dh(e,t=$h){const n=[];let a=e.slice();for(const s of e){const o=n.find(i=>i.agent===s.agent);if(o){if(o.dates.push(s.date),Ql(n)>t){o.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),Ql(n)>t){n.pop();break}a=a.slice(1)}return{heartbeatsToSend:n,unsentEntries:a}}class Ah{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return mm()?hm().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await Ih(this.app);return n?.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){if(await this._canUseIndexedDBPromise){const a=await this.read();return Jl(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??a.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){if(await this._canUseIndexedDBPromise){const a=await this.read();return Jl(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??a.lastSentHeartbeatDate,heartbeats:[...a.heartbeats,...t.heartbeats]})}else return}}function Ql(e){return xc(JSON.stringify({version:2,heartbeats:e})).length}function Mh(e){if(e.length===0)return-1;let t=0,n=e[0].date;for(let a=1;a<e.length;a++)e[a].date<n&&(n=e[a].date,t=a);return t}function Ph(e){Pr(new Rn("platform-logger",t=>new Gm(t),"PRIVATE")),Pr(new Rn("heartbeat",t=>new Eh(t),"PRIVATE")),Tn(Fo,Kl,e),Tn(Fo,Kl,"esm2020"),Tn("fire-js","")}Ph("");var Nh="firebase",Lh="12.9.0";Tn(Nh,Lh,"app");function Pc(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const _h=Pc,Nc=new Vr("auth","Firebase",Pc());const Ga=new Ic("@firebase/auth");function Oh(e,...t){Ga.logLevel<=X.WARN&&Ga.warn(`Auth (${Kr}): ${e}`,...t)}function ya(e,...t){Ga.logLevel<=X.ERROR&&Ga.error(`Auth (${Kr}): ${e}`,...t)}function gt(e,...t){throw Oi(e,...t)}function Ke(e,...t){return Oi(e,...t)}function Lc(e,t,n){const a={..._h(),[t]:n};return new Vr("auth","Firebase",a).create(t,{appName:e.name})}function Qt(e){return Lc(e,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Oi(e,...t){if(typeof e!="string"){const n=t[0],a=[...t.slice(1)];return a[0]&&(a[0].appName=e.name),e._errorFactory.create(n,...a)}return Nc.create(e,...t)}function _(e,t,...n){if(!e)throw Oi(t,...n)}function it(e){const t="INTERNAL ASSERTION FAILED: "+e;throw ya(t),new Error(t)}function mt(e,t){e||it(t)}function Go(){return typeof self<"u"&&self.location?.href||""}function Rh(){return Zl()==="http:"||Zl()==="https:"}function Zl(){return typeof self<"u"&&self.location?.protocol||null}function Bh(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Rh()||pm()||"connection"in navigator)?navigator.onLine:!0}function jh(){if(typeof navigator>"u")return null;const e=navigator;return e.languages&&e.languages[0]||e.language||null}class Yr{constructor(t,n){this.shortDelay=t,this.longDelay=n,mt(n>t,"Short delay should be less than long delay!"),this.isMobile=cm()||fm()}get(){return Bh()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}function Ri(e,t){mt(e.emulator,"Emulator should always be set here");const{url:n}=e.emulator;return t?`${n}${t.startsWith("/")?t.slice(1):t}`:n}class _c{static initialize(t,n,a){this.fetchImpl=t,n&&(this.headersImpl=n),a&&(this.responseImpl=a)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;it("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;it("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;it("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}const Fh={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};const Hh=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],Wh=new Yr(3e4,6e4);function Bi(e,t){return e.tenantId&&!t.tenantId?{...t,tenantId:e.tenantId}:t}async function Jn(e,t,n,a,s={}){return Oc(e,s,async()=>{let o={},i={};a&&(t==="GET"?i=a:o={body:JSON.stringify(a)});const l=qr({key:e.config.apiKey,...i}).slice(1),d=await e._getAdditionalHeaders();d["Content-Type"]="application/json",e.languageCode&&(d["X-Firebase-Locale"]=e.languageCode);const c={method:t,headers:d,...o};return um()||(c.referrerPolicy="no-referrer"),e.emulatorConfig&&ks(e.emulatorConfig.host)&&(c.credentials="include"),_c.fetch()(await Rc(e,e.config.apiHost,n,l),c)})}async function Oc(e,t,n){e._canInitEmulator=!1;const a={...Fh,...t};try{const s=new Uh(e),o=await Promise.race([n(),s.promise]);s.clearNetworkTimeout();const i=await o.json();if("needConfirmation"in i)throw ua(e,"account-exists-with-different-credential",i);if(o.ok&&!("errorMessage"in i))return i;{const l=o.ok?i.errorMessage:i.error.message,[d,c]=l.split(" : ");if(d==="FEDERATED_USER_ID_ALREADY_LINKED")throw ua(e,"credential-already-in-use",i);if(d==="EMAIL_EXISTS")throw ua(e,"email-already-in-use",i);if(d==="USER_DISABLED")throw ua(e,"user-disabled",i);const p=a[d]||d.toLowerCase().replace(/[_\s]+/g,"-");if(c)throw Lc(e,p,c);gt(e,p)}}catch(s){if(s instanceof Ft)throw s;gt(e,"network-request-failed",{message:String(s)})}}async function Gh(e,t,n,a,s={}){const o=await Jn(e,t,n,a,s);return"mfaPendingCredential"in o&&gt(e,"multi-factor-auth-required",{_serverResponse:o}),o}async function Rc(e,t,n,a){const s=`${t}${n}?${a}`,o=e,i=o.config.emulator?Ri(e.config,s):`${e.config.apiScheme}://${s}`;return Hh.includes(n)&&(await o._persistenceManagerAvailable,o._getPersistenceType()==="COOKIE")?o._getPersistence()._getFinalTarget(i).toString():i}class Uh{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(t){this.auth=t,this.timer=null,this.promise=new Promise((n,a)=>{this.timer=setTimeout(()=>a(Ke(this.auth,"network-request-failed")),Wh.get())})}}function ua(e,t,n){const a={appName:e.name};n.email&&(a.email=n.email),n.phoneNumber&&(a.phoneNumber=n.phoneNumber);const s=Ke(e,t,a);return s.customData._tokenResponse=n,s}async function zh(e,t){return Jn(e,"POST","/v1/accounts:delete",t)}async function Ua(e,t){return Jn(e,"POST","/v1/accounts:lookup",t)}function br(e){if(e)try{const t=new Date(Number(e));if(!isNaN(t.getTime()))return t.toUTCString()}catch{}}async function Vh(e,t=!1){const n=Ht(e),a=await n.getIdToken(t),s=ji(a);_(s&&s.exp&&s.auth_time&&s.iat,n.auth,"internal-error");const o=typeof s.firebase=="object"?s.firebase:void 0,i=o?.sign_in_provider;return{claims:s,token:a,authTime:br(po(s.auth_time)),issuedAtTime:br(po(s.iat)),expirationTime:br(po(s.exp)),signInProvider:i||null,signInSecondFactor:o?.sign_in_second_factor||null}}function po(e){return Number(e)*1e3}function ji(e){const[t,n,a]=e.split(".");if(t===void 0||n===void 0||a===void 0)return ya("JWT malformed, contained fewer than 3 sections"),null;try{const s=kc(n);return s?JSON.parse(s):(ya("Failed to decode base64 JWT payload"),null)}catch(s){return ya("Caught error parsing JWT payload as JSON",s?.toString()),null}}function ed(e){const t=ji(e);return _(t,"internal-error"),_(typeof t.exp<"u","internal-error"),_(typeof t.iat<"u","internal-error"),Number(t.exp)-Number(t.iat)}async function Lr(e,t,n=!1){if(n)return t;try{return await t}catch(a){throw a instanceof Ft&&qh(a)&&e.auth.currentUser===e&&await e.auth.signOut(),a}}function qh({code:e}){return e==="auth/user-disabled"||e==="auth/user-token-expired"}class Kh{constructor(t){this.user=t,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(t){if(t){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const a=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,a)}}schedule(t=!1){if(!this.isRunning)return;const n=this.getInterval(t);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(t){t?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}class Uo{constructor(t,n){this.createdAt=t,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=br(this.lastLoginAt),this.creationTime=br(this.createdAt)}_copy(t){this.createdAt=t.createdAt,this.lastLoginAt=t.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}async function za(e){const t=e.auth,n=await e.getIdToken(),a=await Lr(e,Ua(t,{idToken:n}));_(a?.users.length,t,"internal-error");const s=a.users[0];e._notifyReloadListener(s);const o=s.providerUserInfo?.length?Bc(s.providerUserInfo):[],i=Jh(e.providerData,o),l=e.isAnonymous,d=!(e.email&&s.passwordHash)&&!i?.length,c=l?d:!1,p={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new Uo(s.createdAt,s.lastLoginAt),isAnonymous:c};Object.assign(e,p)}async function Yh(e){const t=Ht(e);await za(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function Jh(e,t){return[...e.filter(a=>!t.some(s=>s.providerId===a.providerId)),...t]}function Bc(e){return e.map(({providerId:t,...n})=>({providerId:t,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}))}async function Xh(e,t){const n=await Oc(e,{},async()=>{const a=qr({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:s,apiKey:o}=e.config,i=await Rc(e,s,"/v1/token",`key=${o}`),l=await e._getAdditionalHeaders();l["Content-Type"]="application/x-www-form-urlencoded";const d={method:"POST",headers:l,body:a};return e.emulatorConfig&&ks(e.emulatorConfig.host)&&(d.credentials="include"),_c.fetch()(i,d)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function Qh(e,t){return Jn(e,"POST","/v2/accounts:revokeToken",Bi(e,t))}class In{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(t){_(t.idToken,"internal-error"),_(typeof t.idToken<"u","internal-error"),_(typeof t.refreshToken<"u","internal-error");const n="expiresIn"in t&&typeof t.expiresIn<"u"?Number(t.expiresIn):ed(t.idToken);this.updateTokensAndExpiration(t.idToken,t.refreshToken,n)}updateFromIdToken(t){_(t.length!==0,"internal-error");const n=ed(t);this.updateTokensAndExpiration(t,null,n)}async getToken(t,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(_(this.refreshToken,t,"user-token-expired"),this.refreshToken?(await this.refresh(t,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(t,n){const{accessToken:a,refreshToken:s,expiresIn:o}=await Xh(t,n);this.updateTokensAndExpiration(a,s,Number(o))}updateTokensAndExpiration(t,n,a){this.refreshToken=n||null,this.accessToken=t||null,this.expirationTime=Date.now()+a*1e3}static fromJSON(t,n){const{refreshToken:a,accessToken:s,expirationTime:o}=n,i=new In;return a&&(_(typeof a=="string","internal-error",{appName:t}),i.refreshToken=a),s&&(_(typeof s=="string","internal-error",{appName:t}),i.accessToken=s),o&&(_(typeof o=="number","internal-error",{appName:t}),i.expirationTime=o),i}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(t){this.accessToken=t.accessToken,this.refreshToken=t.refreshToken,this.expirationTime=t.expirationTime}_clone(){return Object.assign(new In,this.toJSON())}_performRefresh(){return it("not implemented")}}function xt(e,t){_(typeof e=="string"||typeof e>"u","internal-error",{appName:t})}class Oe{constructor({uid:t,auth:n,stsTokenManager:a,...s}){this.providerId="firebase",this.proactiveRefresh=new Kh(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=n,this.stsTokenManager=a,this.accessToken=a.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new Uo(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(t){const n=await Lr(this,this.stsTokenManager.getToken(this.auth,t));return _(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(t){return Vh(this,t)}reload(){return Yh(this)}_assign(t){this!==t&&(_(this.uid===t.uid,this.auth,"internal-error"),this.displayName=t.displayName,this.photoURL=t.photoURL,this.email=t.email,this.emailVerified=t.emailVerified,this.phoneNumber=t.phoneNumber,this.isAnonymous=t.isAnonymous,this.tenantId=t.tenantId,this.providerData=t.providerData.map(n=>({...n})),this.metadata._copy(t.metadata),this.stsTokenManager._assign(t.stsTokenManager))}_clone(t){const n=new Oe({...this,auth:t,stsTokenManager:this.stsTokenManager._clone()});return n.metadata._copy(this.metadata),n}_onReload(t){_(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=t,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(t){this.reloadListener?this.reloadListener(t):this.reloadUserInfo=t}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(t,n=!1){let a=!1;t.idToken&&t.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(t),a=!0),n&&await za(this),await this.auth._persistUserIfCurrent(this),a&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(st(this.auth.app))return Promise.reject(Qt(this.auth));const t=await this.getIdToken();return await Lr(this,zh(this.auth,{idToken:t})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(t=>({...t})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(t,n){const a=n.displayName??void 0,s=n.email??void 0,o=n.phoneNumber??void 0,i=n.photoURL??void 0,l=n.tenantId??void 0,d=n._redirectEventId??void 0,c=n.createdAt??void 0,p=n.lastLoginAt??void 0,{uid:m,emailVerified:u,isAnonymous:h,providerData:g,stsTokenManager:b}=n;_(m&&b,t,"internal-error");const y=In.fromJSON(this.name,b);_(typeof m=="string",t,"internal-error"),xt(a,t.name),xt(s,t.name),_(typeof u=="boolean",t,"internal-error"),_(typeof h=="boolean",t,"internal-error"),xt(o,t.name),xt(i,t.name),xt(l,t.name),xt(d,t.name),xt(c,t.name),xt(p,t.name);const f=new Oe({uid:m,auth:t,email:s,emailVerified:u,displayName:a,isAnonymous:h,photoURL:i,phoneNumber:o,tenantId:l,stsTokenManager:y,createdAt:c,lastLoginAt:p});return g&&Array.isArray(g)&&(f.providerData=g.map(x=>({...x}))),d&&(f._redirectEventId=d),f}static async _fromIdTokenResponse(t,n,a=!1){const s=new In;s.updateFromServerResponse(n);const o=new Oe({uid:n.localId,auth:t,stsTokenManager:s,isAnonymous:a});return await za(o),o}static async _fromGetAccountInfoResponse(t,n,a){const s=n.users[0];_(s.localId!==void 0,"internal-error");const o=s.providerUserInfo!==void 0?Bc(s.providerUserInfo):[],i=!(s.email&&s.passwordHash)&&!o?.length,l=new In;l.updateFromIdToken(a);const d=new Oe({uid:s.localId,auth:t,stsTokenManager:l,isAnonymous:i}),c={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new Uo(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!o?.length};return Object.assign(d,c),d}}const td=new Map;function lt(e){mt(e instanceof Function,"Expected a class definition");let t=td.get(e);return t?(mt(t instanceof e,"Instance stored in cache mismatched with class"),t):(t=new e,td.set(e,t),t)}class jc{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(t,n){this.storage[t]=n}async _get(t){const n=this.storage[t];return n===void 0?null:n}async _remove(t){delete this.storage[t]}_addListener(t,n){}_removeListener(t,n){}}jc.type="NONE";const nd=jc;function wa(e,t,n){return`firebase:${e}:${t}:${n}`}class $n{constructor(t,n,a){this.persistence=t,this.auth=n,this.userKey=a;const{config:s,name:o}=this.auth;this.fullUserKey=wa(this.userKey,s.apiKey,o),this.fullPersistenceKey=wa("persistence",s.apiKey,o),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(t){return this.persistence._set(this.fullUserKey,t.toJSON())}async getCurrentUser(){const t=await this.persistence._get(this.fullUserKey);if(!t)return null;if(typeof t=="string"){const n=await Ua(this.auth,{idToken:t}).catch(()=>{});return n?Oe._fromGetAccountInfoResponse(this.auth,n,t):null}return Oe._fromJSON(this.auth,t)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(t){if(this.persistence===t)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=t,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(t,n,a="authUser"){if(!n.length)return new $n(lt(nd),t,a);const s=(await Promise.all(n.map(async c=>{if(await c._isAvailable())return c}))).filter(c=>c);let o=s[0]||lt(nd);const i=wa(a,t.config.apiKey,t.name);let l=null;for(const c of n)try{const p=await c._get(i);if(p){let m;if(typeof p=="string"){const u=await Ua(t,{idToken:p}).catch(()=>{});if(!u)break;m=await Oe._fromGetAccountInfoResponse(t,u,p)}else m=Oe._fromJSON(t,p);c!==o&&(l=m),o=c;break}}catch{}const d=s.filter(c=>c._shouldAllowMigration);return!o._shouldAllowMigration||!d.length?new $n(o,t,a):(o=d[0],l&&await o._set(i,l.toJSON()),await Promise.all(n.map(async c=>{if(c!==o)try{await c._remove(i)}catch{}})),new $n(o,t,a))}}function rd(e){const t=e.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(Gc(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(Fc(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(zc(t))return"Blackberry";if(Vc(t))return"Webos";if(Hc(t))return"Safari";if((t.includes("chrome/")||Wc(t))&&!t.includes("edge/"))return"Chrome";if(Uc(t))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,a=e.match(n);if(a?.length===2)return a[1]}return"Other"}function Fc(e=we()){return/firefox\//i.test(e)}function Hc(e=we()){const t=e.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function Wc(e=we()){return/crios\//i.test(e)}function Gc(e=we()){return/iemobile/i.test(e)}function Uc(e=we()){return/android/i.test(e)}function zc(e=we()){return/blackberry/i.test(e)}function Vc(e=we()){return/webos/i.test(e)}function Fi(e=we()){return/iphone|ipad|ipod/i.test(e)||/macintosh/i.test(e)&&/mobile/i.test(e)}function Zh(e=we()){return Fi(e)&&!!window.navigator?.standalone}function ev(){return gm()&&document.documentMode===10}function qc(e=we()){return Fi(e)||Uc(e)||Vc(e)||zc(e)||/windows phone/i.test(e)||Gc(e)}function Kc(e,t=[]){let n;switch(e){case"Browser":n=rd(we());break;case"Worker":n=`${rd(we())}-${e}`;break;default:n=e}const a=t.length?t.join(","):"FirebaseCore-web";return`${n}/JsCore/${Kr}/${a}`}class tv{constructor(t){this.auth=t,this.queue=[]}pushCallback(t,n){const a=o=>new Promise((i,l)=>{try{const d=t(o);i(d)}catch(d){l(d)}});a.onAbort=n,this.queue.push(a);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(t){if(this.auth.currentUser===t)return;const n=[];try{for(const a of this.queue)await a(t),a.onAbort&&n.push(a.onAbort)}catch(a){n.reverse();for(const s of n)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:a?.message})}}}async function nv(e,t={}){return Jn(e,"GET","/v2/passwordPolicy",Bi(e,t))}const rv=6;class av{constructor(t){const n=t.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=n.minPasswordLength??rv,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=t.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=t.allowedNonAlphanumericCharacters?.join("")??"",this.forceUpgradeOnSignin=t.forceUpgradeOnSignin??!1,this.schemaVersion=t.schemaVersion}validatePassword(t){const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(t,n),this.validatePasswordCharacterOptions(t,n),n.isValid&&(n.isValid=n.meetsMinPasswordLength??!0),n.isValid&&(n.isValid=n.meetsMaxPasswordLength??!0),n.isValid&&(n.isValid=n.containsLowercaseLetter??!0),n.isValid&&(n.isValid=n.containsUppercaseLetter??!0),n.isValid&&(n.isValid=n.containsNumericCharacter??!0),n.isValid&&(n.isValid=n.containsNonAlphanumericCharacter??!0),n}validatePasswordLengthOptions(t,n){const a=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;a&&(n.meetsMinPasswordLength=t.length>=a),s&&(n.meetsMaxPasswordLength=t.length<=s)}validatePasswordCharacterOptions(t,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let a;for(let s=0;s<t.length;s++)a=t.charAt(s),this.updatePasswordCharacterOptionsStatuses(n,a>="a"&&a<="z",a>="A"&&a<="Z",a>="0"&&a<="9",this.allowedNonAlphanumericCharacters.includes(a))}updatePasswordCharacterOptionsStatuses(t,n,a,s,o){this.customStrengthOptions.containsLowercaseLetter&&(t.containsLowercaseLetter||(t.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(t.containsUppercaseLetter||(t.containsUppercaseLetter=a)),this.customStrengthOptions.containsNumericCharacter&&(t.containsNumericCharacter||(t.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(t.containsNonAlphanumericCharacter||(t.containsNonAlphanumericCharacter=o))}}class sv{constructor(t,n,a,s){this.app=t,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=a,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new ad(this),this.idTokenSubscription=new ad(this),this.beforeStateQueue=new tv(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Nc,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=t.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(o=>this._resolvePersistenceManagerAvailable=o)}_initializeWithPersistence(t,n){return n&&(this._popupRedirectResolver=lt(n)),this._initializationPromise=this.queue(async()=>{if(!this._deleted&&(this.persistenceManager=await $n.create(this,t),this._resolvePersistenceManagerAvailable?.(),!this._deleted)){if(this._popupRedirectResolver?._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=this.currentUser?.uid||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const t=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!t)){if(this.currentUser&&t&&this.currentUser.uid===t.uid){this._currentUser._assign(t),await this.currentUser.getIdToken();return}await this._updateCurrentUser(t,!0)}}async initializeCurrentUserFromIdToken(t){try{const n=await Ua(this,{idToken:t}),a=await Oe._fromGetAccountInfoResponse(this,n,t);await this.directlySetCurrentUser(a)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(t){if(st(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(i=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(i,i))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let a=n,s=!1;if(t&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=this.redirectUser?._redirectEventId,i=a?._redirectEventId,l=await this.tryRedirectSignIn(t);(!o||o===i)&&l?.user&&(a=l.user,s=!0)}if(!a)return this.directlySetCurrentUser(null);if(!a._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(a)}catch(o){a=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return a?this.reloadAndSetCurrentUserOrClear(a):this.directlySetCurrentUser(null)}return _(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===a._redirectEventId?this.directlySetCurrentUser(a):this.reloadAndSetCurrentUserOrClear(a)}async tryRedirectSignIn(t){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,t,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(t){try{await za(t)}catch(n){if(n?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(t)}useDeviceLanguage(){this.languageCode=jh()}async _delete(){this._deleted=!0}async updateCurrentUser(t){if(st(this.app))return Promise.reject(Qt(this));const n=t?Ht(t):null;return n&&_(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(t,n=!1){if(!this._deleted)return t&&_(this.tenantId===t.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(t),this.queue(async()=>{await this.directlySetCurrentUser(t),this.notifyAuthListeners()})}async signOut(){return st(this.app)?Promise.reject(Qt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(t){return st(this.app)?Promise.reject(Qt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(lt(t))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(t){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(t)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const t=await nv(this),n=new av(t);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(t){this._errorFactory=new Vr("auth","Firebase",t())}onAuthStateChanged(t,n,a){return this.registerStateListener(this.authStateSubscription,t,n,a)}beforeAuthStateChanged(t,n){return this.beforeStateQueue.pushCallback(t,n)}onIdTokenChanged(t,n,a){return this.registerStateListener(this.idTokenSubscription,t,n,a)}authStateReady(){return new Promise((t,n)=>{if(this.currentUser)t();else{const a=this.onAuthStateChanged(()=>{a(),t()},n)}})}async revokeAccessToken(t){if(this.currentUser){const n=await this.currentUser.getIdToken(),a={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:t,idToken:n};this.tenantId!=null&&(a.tenantId=this.tenantId),await Qh(this,a)}}toJSON(){return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:this._currentUser?.toJSON()}}async _setRedirectUser(t,n){const a=await this.getOrInitRedirectPersistenceManager(n);return t===null?a.removeCurrentUser():a.setCurrentUser(t)}async getOrInitRedirectPersistenceManager(t){if(!this.redirectPersistenceManager){const n=t&&lt(t)||this._popupRedirectResolver;_(n,this,"argument-error"),this.redirectPersistenceManager=await $n.create(this,[lt(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(t){return this._isInitialized&&await this.queue(async()=>{}),this._currentUser?._redirectEventId===t?this._currentUser:this.redirectUser?._redirectEventId===t?this.redirectUser:null}async _persistUserIfCurrent(t){if(t===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(t))}_notifyListenersIfCurrent(t){t===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const t=this.currentUser?.uid??null;this.lastNotifiedUid!==t&&(this.lastNotifiedUid=t,this.authStateSubscription.next(this.currentUser))}registerStateListener(t,n,a,s){if(this._deleted)return()=>{};const o=typeof n=="function"?n:n.next.bind(n);let i=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(_(l,this,"internal-error"),l.then(()=>{i||o(this.currentUser)}),typeof n=="function"){const d=t.addObserver(n,a,s);return()=>{i=!0,d()}}else{const d=t.addObserver(n);return()=>{i=!0,d()}}}async directlySetCurrentUser(t){this.currentUser&&this.currentUser!==t&&this._currentUser._stopProactiveRefresh(),t&&this.isProactiveRefreshEnabled&&t._startProactiveRefresh(),this.currentUser=t,t?await this.assertedPersistence.setCurrentUser(t):await this.assertedPersistence.removeCurrentUser()}queue(t){return this.operations=this.operations.then(t,t),this.operations}get assertedPersistence(){return _(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(t){!t||this.frameworks.includes(t)||(this.frameworks.push(t),this.frameworks.sort(),this.clientVersion=Kc(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const n=await this.heartbeatServiceProvider.getImmediate({optional:!0})?.getHeartbeatsHeader();n&&(t["X-Firebase-Client"]=n);const a=await this._getAppCheckToken();return a&&(t["X-Firebase-AppCheck"]=a),t}async _getAppCheckToken(){if(st(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await this.appCheckServiceProvider.getImmediate({optional:!0})?.getToken();return t?.error&&Oh(`Error while retrieving App Check token: ${t.error}`),t?.token}}function Ss(e){return Ht(e)}class ad{constructor(t){this.auth=t,this.observer=null,this.addObserver=xm(n=>this.observer=n)}get next(){return _(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}let Hi={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function ov(e){Hi=e}function iv(e){return Hi.loadJS(e)}function lv(){return Hi.gapiScript}function dv(e){return`__${e}${Math.floor(Math.random()*1e6)}`}function cv(e,t){const n=Ec(e,"auth");if(n.isInitialized()){const s=n.getImmediate(),o=n.getOptions();if(On(o,t??{}))return s;gt(s,"already-initialized")}return n.initialize({options:t})}function uv(e,t){const n=t?.persistence||[],a=(Array.isArray(n)?n:[n]).map(lt);t?.errorMap&&e._updateErrorMap(t.errorMap),e._initializeWithPersistence(a,t?.popupRedirectResolver)}function pv(e,t,n){const a=Ss(e);_(/^https?:\/\//.test(t),a,"invalid-emulator-scheme");const s=!1,o=Yc(t),{host:i,port:l}=fv(t),d=l===null?"":`:${l}`,c={url:`${o}//${i}${d}/`},p=Object.freeze({host:i,port:l,protocol:o.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!a._canInitEmulator){_(a.config.emulator&&a.emulatorConfig,a,"emulator-config-failed"),_(On(c,a.config.emulator)&&On(p,a.emulatorConfig),a,"emulator-config-failed");return}a.config.emulator=c,a.emulatorConfig=p,a.settings.appVerificationDisabledForTesting=!0,ks(i)?(om(`${o}//${i}${d}`),dm("Auth",!0)):gv()}function Yc(e){const t=e.indexOf(":");return t<0?"":e.substr(0,t+1)}function fv(e){const t=Yc(e),n=/(\/\/)?([^?#/]+)/.exec(e.substr(t.length));if(!n)return{host:"",port:null};const a=n[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(a);if(s){const o=s[1];return{host:o,port:sd(a.substr(o.length+1))}}else{const[o,i]=a.split(":");return{host:o,port:sd(i)}}}function sd(e){if(!e)return null;const t=Number(e);return isNaN(t)?null:t}function gv(){function e(){const t=document.createElement("p"),n=t.style;t.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",t.classList.add("firebase-emulator-warning"),document.body.appendChild(t)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",e):e())}class Jc{constructor(t,n){this.providerId=t,this.signInMethod=n}toJSON(){return it("not implemented")}_getIdTokenResponse(t){return it("not implemented")}_linkToIdToken(t,n){return it("not implemented")}_getReauthenticationResolver(t){return it("not implemented")}}async function Cn(e,t){return Gh(e,"POST","/v1/accounts:signInWithIdp",Bi(e,t))}const mv="http://localhost";class sn extends Jc{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(t){const n=new sn(t.providerId,t.signInMethod);return t.idToken||t.accessToken?(t.idToken&&(n.idToken=t.idToken),t.accessToken&&(n.accessToken=t.accessToken),t.nonce&&!t.pendingToken&&(n.nonce=t.nonce),t.pendingToken&&(n.pendingToken=t.pendingToken)):t.oauthToken&&t.oauthTokenSecret?(n.accessToken=t.oauthToken,n.secret=t.oauthTokenSecret):gt("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(t){const n=typeof t=="string"?JSON.parse(t):t,{providerId:a,signInMethod:s,...o}=n;if(!a||!s)return null;const i=new sn(a,s);return i.idToken=o.idToken||void 0,i.accessToken=o.accessToken||void 0,i.secret=o.secret,i.nonce=o.nonce,i.pendingToken=o.pendingToken||null,i}_getIdTokenResponse(t){const n=this.buildRequest();return Cn(t,n)}_linkToIdToken(t,n){const a=this.buildRequest();return a.idToken=n,Cn(t,a)}_getReauthenticationResolver(t){const n=this.buildRequest();return n.autoCreate=!1,Cn(t,n)}buildRequest(){const t={requestUri:mv,returnSecureToken:!0};if(this.pendingToken)t.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),t.postBody=qr(n)}return t}}class Xc{constructor(t){this.providerId=t,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(t){this.defaultLanguageCode=t}setCustomParameters(t){return this.customParameters=t,this}getCustomParameters(){return this.customParameters}}class Jr extends Xc{constructor(){super(...arguments),this.scopes=[]}addScope(t){return this.scopes.includes(t)||this.scopes.push(t),this}getScopes(){return[...this.scopes]}}class Tt extends Jr{constructor(){super("facebook.com")}static credential(t){return sn._fromParams({providerId:Tt.PROVIDER_ID,signInMethod:Tt.FACEBOOK_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return Tt.credentialFromTaggedObject(t)}static credentialFromError(t){return Tt.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return Tt.credential(t.oauthAccessToken)}catch{return null}}}Tt.FACEBOOK_SIGN_IN_METHOD="facebook.com";Tt.PROVIDER_ID="facebook.com";class ot extends Jr{constructor(){super("google.com"),this.addScope("profile")}static credential(t,n){return sn._fromParams({providerId:ot.PROVIDER_ID,signInMethod:ot.GOOGLE_SIGN_IN_METHOD,idToken:t,accessToken:n})}static credentialFromResult(t){return ot.credentialFromTaggedObject(t)}static credentialFromError(t){return ot.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthIdToken:n,oauthAccessToken:a}=t;if(!n&&!a)return null;try{return ot.credential(n,a)}catch{return null}}}ot.GOOGLE_SIGN_IN_METHOD="google.com";ot.PROVIDER_ID="google.com";class It extends Jr{constructor(){super("github.com")}static credential(t){return sn._fromParams({providerId:It.PROVIDER_ID,signInMethod:It.GITHUB_SIGN_IN_METHOD,accessToken:t})}static credentialFromResult(t){return It.credentialFromTaggedObject(t)}static credentialFromError(t){return It.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t||!("oauthAccessToken"in t)||!t.oauthAccessToken)return null;try{return It.credential(t.oauthAccessToken)}catch{return null}}}It.GITHUB_SIGN_IN_METHOD="github.com";It.PROVIDER_ID="github.com";class $t extends Jr{constructor(){super("twitter.com")}static credential(t,n){return sn._fromParams({providerId:$t.PROVIDER_ID,signInMethod:$t.TWITTER_SIGN_IN_METHOD,oauthToken:t,oauthTokenSecret:n})}static credentialFromResult(t){return $t.credentialFromTaggedObject(t)}static credentialFromError(t){return $t.credentialFromTaggedObject(t.customData||{})}static credentialFromTaggedObject({_tokenResponse:t}){if(!t)return null;const{oauthAccessToken:n,oauthTokenSecret:a}=t;if(!n||!a)return null;try{return $t.credential(n,a)}catch{return null}}}$t.TWITTER_SIGN_IN_METHOD="twitter.com";$t.PROVIDER_ID="twitter.com";class Bn{constructor(t){this.user=t.user,this.providerId=t.providerId,this._tokenResponse=t._tokenResponse,this.operationType=t.operationType}static async _fromIdTokenResponse(t,n,a,s=!1){const o=await Oe._fromIdTokenResponse(t,a,s),i=od(a);return new Bn({user:o,providerId:i,_tokenResponse:a,operationType:n})}static async _forOperation(t,n,a){await t._updateTokensIfNecessary(a,!0);const s=od(a);return new Bn({user:t,providerId:s,_tokenResponse:a,operationType:n})}}function od(e){return e.providerId?e.providerId:"phoneNumber"in e?"phone":null}class Va extends Ft{constructor(t,n,a,s){super(n.code,n.message),this.operationType=a,this.user=s,Object.setPrototypeOf(this,Va.prototype),this.customData={appName:t.name,tenantId:t.tenantId??void 0,_serverResponse:n.customData._serverResponse,operationType:a}}static _fromErrorAndOperation(t,n,a,s){return new Va(t,n,a,s)}}function Qc(e,t,n,a){return(t==="reauthenticate"?n._getReauthenticationResolver(e):n._getIdTokenResponse(e)).catch(o=>{throw o.code==="auth/multi-factor-auth-required"?Va._fromErrorAndOperation(e,o,t,a):o})}async function hv(e,t,n=!1){const a=await Lr(e,t._linkToIdToken(e.auth,await e.getIdToken()),n);return Bn._forOperation(e,"link",a)}async function vv(e,t,n=!1){const{auth:a}=e;if(st(a.app))return Promise.reject(Qt(a));const s="reauthenticate";try{const o=await Lr(e,Qc(a,s,t,e),n);_(o.idToken,a,"internal-error");const i=ji(o.idToken);_(i,a,"internal-error");const{sub:l}=i;return _(e.uid===l,a,"user-mismatch"),Bn._forOperation(e,s,o)}catch(o){throw o?.code==="auth/user-not-found"&&gt(a,"user-mismatch"),o}}async function Zc(e,t,n=!1){if(st(e.app))return Promise.reject(Qt(e));const a="signIn",s=await Qc(e,a,t),o=await Bn._fromIdTokenResponse(e,a,s);return n||await e._updateCurrentUser(o.user),o}async function bv(e,t){return Zc(Ss(e),t)}function yv(e,t,n,a){return Ht(e).onIdTokenChanged(t,n,a)}function wv(e,t,n){return Ht(e).beforeAuthStateChanged(t,n)}function xv(e,t,n,a){return Ht(e).onAuthStateChanged(t,n,a)}function kv(e){return Ht(e).signOut()}const qa="__sak";class eu{constructor(t,n){this.storageRetriever=t,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(qa,"1"),this.storage.removeItem(qa),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(t,n){return this.storage.setItem(t,JSON.stringify(n)),Promise.resolve()}_get(t){const n=this.storage.getItem(t);return Promise.resolve(n?JSON.parse(n):null)}_remove(t){return this.storage.removeItem(t),Promise.resolve()}get storage(){return this.storageRetriever()}}const Sv=1e3,Tv=10;class tu extends eu{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(t,n)=>this.onStorageEvent(t,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=qc(),this._shouldAllowMigration=!0}forAllChangedKeys(t){for(const n of Object.keys(this.listeners)){const a=this.storage.getItem(n),s=this.localCache[n];a!==s&&t(n,s,a)}}onStorageEvent(t,n=!1){if(!t.key){this.forAllChangedKeys((i,l,d)=>{this.notifyListeners(i,d)});return}const a=t.key;n?this.detachListener():this.stopPolling();const s=()=>{const i=this.storage.getItem(a);!n&&this.localCache[a]===i||this.notifyListeners(a,i)},o=this.storage.getItem(a);ev()&&o!==t.newValue&&t.newValue!==t.oldValue?setTimeout(s,Tv):s()}notifyListeners(t,n){this.localCache[t]=n;const a=this.listeners[t];if(a)for(const s of Array.from(a))s(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((t,n,a)=>{this.onStorageEvent(new StorageEvent("storage",{key:t,oldValue:n,newValue:a}),!0)})},Sv)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(t,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[t]||(this.listeners[t]=new Set,this.localCache[t]=this.storage.getItem(t)),this.listeners[t].add(n)}_removeListener(t,n){this.listeners[t]&&(this.listeners[t].delete(n),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(t,n){await super._set(t,n),this.localCache[t]=JSON.stringify(n)}async _get(t){const n=await super._get(t);return this.localCache[t]=JSON.stringify(n),n}async _remove(t){await super._remove(t),delete this.localCache[t]}}tu.type="LOCAL";const Iv=tu;class nu extends eu{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(t,n){}_removeListener(t,n){}}nu.type="SESSION";const ru=nu;function $v(e){return Promise.all(e.map(async t=>{try{return{fulfilled:!0,value:await t}}catch(n){return{fulfilled:!1,reason:n}}}))}class Ts{constructor(t){this.eventTarget=t,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(t){const n=this.receivers.find(s=>s.isListeningto(t));if(n)return n;const a=new Ts(t);return this.receivers.push(a),a}isListeningto(t){return this.eventTarget===t}async handleEvent(t){const n=t,{eventId:a,eventType:s,data:o}=n.data,i=this.handlersMap[s];if(!i?.size)return;n.ports[0].postMessage({status:"ack",eventId:a,eventType:s});const l=Array.from(i).map(async c=>c(n.origin,o)),d=await $v(l);n.ports[0].postMessage({status:"done",eventId:a,eventType:s,response:d})}_subscribe(t,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[t]||(this.handlersMap[t]=new Set),this.handlersMap[t].add(n)}_unsubscribe(t,n){this.handlersMap[t]&&n&&this.handlersMap[t].delete(n),(!n||this.handlersMap[t].size===0)&&delete this.handlersMap[t],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Ts.receivers=[];function Wi(e="",t=10){let n="";for(let a=0;a<t;a++)n+=Math.floor(Math.random()*10);return e+n}class Cv{constructor(t){this.target=t,this.handlers=new Set}removeMessageHandler(t){t.messageChannel&&(t.messageChannel.port1.removeEventListener("message",t.onMessage),t.messageChannel.port1.close()),this.handlers.delete(t)}async _send(t,n,a=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let o,i;return new Promise((l,d)=>{const c=Wi("",20);s.port1.start();const p=setTimeout(()=>{d(new Error("unsupported_event"))},a);i={messageChannel:s,onMessage(m){const u=m;if(u.data.eventId===c)switch(u.data.status){case"ack":clearTimeout(p),o=setTimeout(()=>{d(new Error("timeout"))},3e3);break;case"done":clearTimeout(o),l(u.data.response);break;default:clearTimeout(p),clearTimeout(o),d(new Error("invalid_response"));break}}},this.handlers.add(i),s.port1.addEventListener("message",i.onMessage),this.target.postMessage({eventType:t,eventId:c,data:n},[s.port2])}).finally(()=>{i&&this.removeMessageHandler(i)})}}function Ye(){return window}function Ev(e){Ye().location.href=e}function au(){return typeof Ye().WorkerGlobalScope<"u"&&typeof Ye().importScripts=="function"}async function Dv(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function Av(){return navigator?.serviceWorker?.controller||null}function Mv(){return au()?self:null}const su="firebaseLocalStorageDb",Pv=1,Ka="firebaseLocalStorage",ou="fbase_key";class Xr{constructor(t){this.request=t}toPromise(){return new Promise((t,n)=>{this.request.addEventListener("success",()=>{t(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function Is(e,t){return e.transaction([Ka],t?"readwrite":"readonly").objectStore(Ka)}function Nv(){const e=indexedDB.deleteDatabase(su);return new Xr(e).toPromise()}function zo(){const e=indexedDB.open(su,Pv);return new Promise((t,n)=>{e.addEventListener("error",()=>{n(e.error)}),e.addEventListener("upgradeneeded",()=>{const a=e.result;try{a.createObjectStore(Ka,{keyPath:ou})}catch(s){n(s)}}),e.addEventListener("success",async()=>{const a=e.result;a.objectStoreNames.contains(Ka)?t(a):(a.close(),await Nv(),t(await zo()))})})}async function id(e,t,n){const a=Is(e,!0).put({[ou]:t,value:n});return new Xr(a).toPromise()}async function Lv(e,t){const n=Is(e,!1).get(t),a=await new Xr(n).toPromise();return a===void 0?null:a.value}function ld(e,t){const n=Is(e,!0).delete(t);return new Xr(n).toPromise()}const _v=800,Ov=3;class iu{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await zo(),this.db)}async _withRetries(t){let n=0;for(;;)try{const a=await this._openDb();return await t(a)}catch(a){if(n++>Ov)throw a;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return au()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Ts._getInstance(Mv()),this.receiver._subscribe("keyChanged",async(t,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(t,n)=>["keyChanged"])}async initializeSender(){if(this.activeServiceWorker=await Dv(),!this.activeServiceWorker)return;this.sender=new Cv(this.activeServiceWorker);const t=await this.sender._send("ping",{},800);t&&t[0]?.fulfilled&&t[0]?.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(t){if(!(!this.sender||!this.activeServiceWorker||Av()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:t},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const t=await zo();return await id(t,qa,"1"),await ld(t,qa),!0}catch{}return!1}async _withPendingWrite(t){this.pendingWrites++;try{await t()}finally{this.pendingWrites--}}async _set(t,n){return this._withPendingWrite(async()=>(await this._withRetries(a=>id(a,t,n)),this.localCache[t]=n,this.notifyServiceWorker(t)))}async _get(t){const n=await this._withRetries(a=>Lv(a,t));return this.localCache[t]=n,n}async _remove(t){return this._withPendingWrite(async()=>(await this._withRetries(n=>ld(n,t)),delete this.localCache[t],this.notifyServiceWorker(t)))}async _poll(){const t=await this._withRetries(s=>{const o=Is(s,!1).getAll();return new Xr(o).toPromise()});if(!t)return[];if(this.pendingWrites!==0)return[];const n=[],a=new Set;if(t.length!==0)for(const{fbase_key:s,value:o}of t)a.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(o)&&(this.notifyListeners(s,o),n.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!a.has(s)&&(this.notifyListeners(s,null),n.push(s));return n}notifyListeners(t,n){this.localCache[t]=n;const a=this.listeners[t];if(a)for(const s of Array.from(a))s(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),_v)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(t,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[t]||(this.listeners[t]=new Set,this._get(t)),this.listeners[t].add(n)}_removeListener(t,n){this.listeners[t]&&(this.listeners[t].delete(n),this.listeners[t].size===0&&delete this.listeners[t]),Object.keys(this.listeners).length===0&&this.stopPolling()}}iu.type="LOCAL";const Rv=iu;new Yr(3e4,6e4);function Bv(e,t){return t?lt(t):(_(e._popupRedirectResolver,e,"argument-error"),e._popupRedirectResolver)}class Gi extends Jc{constructor(t){super("custom","custom"),this.params=t}_getIdTokenResponse(t){return Cn(t,this._buildIdpRequest())}_linkToIdToken(t,n){return Cn(t,this._buildIdpRequest(n))}_getReauthenticationResolver(t){return Cn(t,this._buildIdpRequest())}_buildIdpRequest(t){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return t&&(n.idToken=t),n}}function jv(e){return Zc(e.auth,new Gi(e),e.bypassAuthState)}function Fv(e){const{auth:t,user:n}=e;return _(n,t,"internal-error"),vv(n,new Gi(e),e.bypassAuthState)}async function Hv(e){const{auth:t,user:n}=e;return _(n,t,"internal-error"),hv(n,new Gi(e),e.bypassAuthState)}class lu{constructor(t,n,a,s,o=!1){this.auth=t,this.resolver=a,this.user=s,this.bypassAuthState=o,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(t,n)=>{this.pendingPromise={resolve:t,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(a){this.reject(a)}})}async onAuthEvent(t){const{urlResponse:n,sessionId:a,postBody:s,tenantId:o,error:i,type:l}=t;if(i){this.reject(i);return}const d={auth:this.auth,requestUri:n,sessionId:a,tenantId:o||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(d))}catch(c){this.reject(c)}}onError(t){this.reject(t)}getIdpTask(t){switch(t){case"signInViaPopup":case"signInViaRedirect":return jv;case"linkViaPopup":case"linkViaRedirect":return Hv;case"reauthViaPopup":case"reauthViaRedirect":return Fv;default:gt(this.auth,"internal-error")}}resolve(t){mt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(t),this.unregisterAndCleanUp()}reject(t){mt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(t),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}const Wv=new Yr(2e3,1e4);class wn extends lu{constructor(t,n,a,s,o){super(t,n,s,o),this.provider=a,this.authWindow=null,this.pollId=null,wn.currentPopupAction&&wn.currentPopupAction.cancel(),wn.currentPopupAction=this}async executeNotNull(){const t=await this.execute();return _(t,this.auth,"internal-error"),t}async onExecution(){mt(this.filter.length===1,"Popup operations only handle one event");const t=Wi();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],t),this.authWindow.associatedEvent=t,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(Ke(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){return this.authWindow?.associatedEvent||null}cancel(){this.reject(Ke(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,wn.currentPopupAction=null}pollUserCancellation(){const t=()=>{if(this.authWindow?.window?.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Ke(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(t,Wv.get())};t()}}wn.currentPopupAction=null;const Gv="pendingRedirect",xa=new Map;class Uv extends lu{constructor(t,n,a=!1){super(t,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,a),this.eventId=null}async execute(){let t=xa.get(this.auth._key());if(!t){try{const a=await zv(this.resolver,this.auth)?await super.execute():null;t=()=>Promise.resolve(a)}catch(n){t=()=>Promise.reject(n)}xa.set(this.auth._key(),t)}return this.bypassAuthState||xa.set(this.auth._key(),()=>Promise.resolve(null)),t()}async onAuthEvent(t){if(t.type==="signInViaRedirect")return super.onAuthEvent(t);if(t.type==="unknown"){this.resolve(null);return}if(t.eventId){const n=await this.auth._redirectUserForId(t.eventId);if(n)return this.user=n,super.onAuthEvent(t);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function zv(e,t){const n=Kv(t),a=qv(e);if(!await a._isAvailable())return!1;const s=await a._get(n)==="true";return await a._remove(n),s}function Vv(e,t){xa.set(e._key(),t)}function qv(e){return lt(e._redirectPersistence)}function Kv(e){return wa(Gv,e.config.apiKey,e.name)}async function Yv(e,t,n=!1){if(st(e.app))return Promise.reject(Qt(e));const a=Ss(e),s=Bv(a,t),i=await new Uv(a,s,n).execute();return i&&!n&&(delete i.user._redirectEventId,await a._persistUserIfCurrent(i.user),await a._setRedirectUser(null,t)),i}const Jv=600*1e3;class Xv{constructor(t){this.auth=t,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(t){this.consumers.add(t),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,t)&&(this.sendToConsumer(this.queuedRedirectEvent,t),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(t){this.consumers.delete(t)}onEvent(t){if(this.hasEventBeenHandled(t))return!1;let n=!1;return this.consumers.forEach(a=>{this.isEventForConsumer(t,a)&&(n=!0,this.sendToConsumer(t,a),this.saveEventToCache(t))}),this.hasHandledPotentialRedirect||!Qv(t)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=t,n=!0)),n}sendToConsumer(t,n){if(t.error&&!du(t)){const a=t.error.code?.split("auth/")[1]||"internal-error";n.onError(Ke(this.auth,a))}else n.onAuthEvent(t)}isEventForConsumer(t,n){const a=n.eventId===null||!!t.eventId&&t.eventId===n.eventId;return n.filter.includes(t.type)&&a}hasEventBeenHandled(t){return Date.now()-this.lastProcessedEventTime>=Jv&&this.cachedEventUids.clear(),this.cachedEventUids.has(dd(t))}saveEventToCache(t){this.cachedEventUids.add(dd(t)),this.lastProcessedEventTime=Date.now()}}function dd(e){return[e.type,e.eventId,e.sessionId,e.tenantId].filter(t=>t).join("-")}function du({type:e,error:t}){return e==="unknown"&&t?.code==="auth/no-auth-event"}function Qv(e){switch(e.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return du(e);default:return!1}}async function Zv(e,t={}){return Jn(e,"GET","/v1/projects",t)}const eb=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,tb=/^https?/;async function nb(e){if(e.config.emulator)return;const{authorizedDomains:t}=await Zv(e);for(const n of t)try{if(rb(n))return}catch{}gt(e,"unauthorized-domain")}function rb(e){const t=Go(),{protocol:n,hostname:a}=new URL(t);if(e.startsWith("chrome-extension://")){const i=new URL(e);return i.hostname===""&&a===""?n==="chrome-extension:"&&e.replace("chrome-extension://","")===t.replace("chrome-extension://",""):n==="chrome-extension:"&&i.hostname===a}if(!tb.test(n))return!1;if(eb.test(e))return a===e;const s=e.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(a)}const ab=new Yr(3e4,6e4);function cd(){const e=Ye().___jsl;if(e?.H){for(const t of Object.keys(e.H))if(e.H[t].r=e.H[t].r||[],e.H[t].L=e.H[t].L||[],e.H[t].r=[...e.H[t].L],e.CP)for(let n=0;n<e.CP.length;n++)e.CP[n]=null}}function sb(e){return new Promise((t,n)=>{function a(){cd(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{cd(),n(Ke(e,"network-request-failed"))},timeout:ab.get()})}if(Ye().gapi?.iframes?.Iframe)t(gapi.iframes.getContext());else if(Ye().gapi?.load)a();else{const s=dv("iframefcb");return Ye()[s]=()=>{gapi.load?a():n(Ke(e,"network-request-failed"))},iv(`${lv()}?onload=${s}`).catch(o=>n(o))}}).catch(t=>{throw ka=null,t})}let ka=null;function ob(e){return ka=ka||sb(e),ka}const ib=new Yr(5e3,15e3),lb="__/auth/iframe",db="emulator/auth/iframe",cb={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},ub=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function pb(e){const t=e.config;_(t.authDomain,e,"auth-domain-config-required");const n=t.emulator?Ri(t,db):`https://${e.config.authDomain}/${lb}`,a={apiKey:t.apiKey,appName:e.name,v:Kr},s=ub.get(e.config.apiHost);s&&(a.eid=s);const o=e._getFrameworks();return o.length&&(a.fw=o.join(",")),`${n}?${qr(a).slice(1)}`}async function fb(e){const t=await ob(e),n=Ye().gapi;return _(n,e,"internal-error"),t.open({where:document.body,url:pb(e),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:cb,dontclear:!0},a=>new Promise(async(s,o)=>{await a.restyle({setHideOnLeave:!1});const i=Ke(e,"network-request-failed"),l=Ye().setTimeout(()=>{o(i)},ib.get());function d(){Ye().clearTimeout(l),s(a)}a.ping(d).then(d,()=>{o(i)})}))}const gb={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},mb=500,hb=600,vb="_blank",bb="http://localhost";class ud{constructor(t){this.window=t,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function yb(e,t,n,a=mb,s=hb){const o=Math.max((window.screen.availHeight-s)/2,0).toString(),i=Math.max((window.screen.availWidth-a)/2,0).toString();let l="";const d={...gb,width:a.toString(),height:s.toString(),top:o,left:i},c=we().toLowerCase();n&&(l=Wc(c)?vb:n),Fc(c)&&(t=t||bb,d.scrollbars="yes");const p=Object.entries(d).reduce((u,[h,g])=>`${u}${h}=${g},`,"");if(Zh(c)&&l!=="_self")return wb(t||"",l),new ud(null);const m=window.open(t||"",l,p);_(m,e,"popup-blocked");try{m.focus()}catch{}return new ud(m)}function wb(e,t){const n=document.createElement("a");n.href=e,n.target=t;const a=document.createEvent("MouseEvent");a.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(a)}const xb="__/auth/handler",kb="emulator/auth/handler",Sb=encodeURIComponent("fac");async function pd(e,t,n,a,s,o){_(e.config.authDomain,e,"auth-domain-config-required"),_(e.config.apiKey,e,"invalid-api-key");const i={apiKey:e.config.apiKey,appName:e.name,authType:n,redirectUrl:a,v:Kr,eventId:s};if(t instanceof Xc){t.setDefaultLanguage(e.languageCode),i.providerId=t.providerId||"",wm(t.getCustomParameters())||(i.customParameters=JSON.stringify(t.getCustomParameters()));for(const[p,m]of Object.entries({}))i[p]=m}if(t instanceof Jr){const p=t.getScopes().filter(m=>m!=="");p.length>0&&(i.scopes=p.join(","))}e.tenantId&&(i.tid=e.tenantId);const l=i;for(const p of Object.keys(l))l[p]===void 0&&delete l[p];const d=await e._getAppCheckToken(),c=d?`#${Sb}=${encodeURIComponent(d)}`:"";return`${Tb(e)}?${qr(l).slice(1)}${c}`}function Tb({config:e}){return e.emulator?Ri(e,kb):`https://${e.authDomain}/${xb}`}const fo="webStorageSupport";class Ib{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=ru,this._completeRedirectFn=Yv,this._overrideRedirectResult=Vv}async _openPopup(t,n,a,s){mt(this.eventManagers[t._key()]?.manager,"_initialize() not called before _openPopup()");const o=await pd(t,n,a,Go(),s);return yb(t,o,Wi())}async _openRedirect(t,n,a,s){await this._originValidation(t);const o=await pd(t,n,a,Go(),s);return Ev(o),new Promise(()=>{})}_initialize(t){const n=t._key();if(this.eventManagers[n]){const{manager:s,promise:o}=this.eventManagers[n];return s?Promise.resolve(s):(mt(o,"If manager is not set, promise should be"),o)}const a=this.initAndGetManager(t);return this.eventManagers[n]={promise:a},a.catch(()=>{delete this.eventManagers[n]}),a}async initAndGetManager(t){const n=await fb(t),a=new Xv(t);return n.register("authEvent",s=>(_(s?.authEvent,t,"invalid-auth-event"),{status:a.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[t._key()]={manager:a},this.iframes[t._key()]=n,a}_isIframeWebStorageSupported(t,n){this.iframes[t._key()].send(fo,{type:fo},s=>{const o=s?.[0]?.[fo];o!==void 0&&n(!!o),gt(t,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(t){const n=t._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=nb(t)),this.originValidationPromises[n]}get _shouldInitProactively(){return qc()||Hc()||Fi()}}const $b=Ib;var fd="@firebase/auth",gd="1.12.0";class Cb{constructor(t){this.auth=t,this.internalListeners=new Map}getUid(){return this.assertAuthConfigured(),this.auth.currentUser?.uid||null}async getToken(t){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(t)}:null}addAuthTokenListener(t){if(this.assertAuthConfigured(),this.internalListeners.has(t))return;const n=this.auth.onIdTokenChanged(a=>{t(a?.stsTokenManager.accessToken||null)});this.internalListeners.set(t,n),this.updateProactiveRefresh()}removeAuthTokenListener(t){this.assertAuthConfigured();const n=this.internalListeners.get(t);n&&(this.internalListeners.delete(t),n(),this.updateProactiveRefresh())}assertAuthConfigured(){_(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}function Eb(e){switch(e){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Db(e){Pr(new Rn("auth",(t,{options:n})=>{const a=t.getProvider("app").getImmediate(),s=t.getProvider("heartbeat"),o=t.getProvider("app-check-internal"),{apiKey:i,authDomain:l}=a.options;_(i&&!i.includes(":"),"invalid-api-key",{appName:a.name});const d={apiKey:i,authDomain:l,clientPlatform:e,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Kc(e)},c=new sv(a,s,o,d);return uv(c,n),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((t,n,a)=>{t.getProvider("auth-internal").initialize()})),Pr(new Rn("auth-internal",t=>{const n=Ss(t.getProvider("auth").getImmediate());return(a=>new Cb(a))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),Tn(fd,gd,Eb(e)),Tn(fd,gd,"esm2020")}const Ab=300,Mb=Tc("authIdTokenMaxAge")||Ab;let md=null;const Pb=e=>async t=>{const n=t&&await t.getIdTokenResult(),a=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(a&&a>Mb)return;const s=n?.token;md!==s&&(md=s,await fetch(e,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function Nb(e=kh()){const t=Ec(e,"auth");if(t.isInitialized())return t.getImmediate();const n=cv(e,{popupRedirectResolver:$b,persistence:[Rv,Iv,ru]}),a=Tc("authTokenSyncURL");if(a&&typeof isSecureContext=="boolean"&&isSecureContext){const o=new URL(a,location.origin);if(location.origin===o.origin){const i=Pb(o.toString());wv(n,i,()=>i(n.currentUser)),yv(n,l=>i(l))}}const s=am("auth");return s&&pv(n,`http://${s}`),n}function Lb(){return document.getElementsByTagName("head")?.[0]??document}ov({loadJS(e){return new Promise((t,n)=>{const a=document.createElement("script");a.setAttribute("src",e),a.onload=t,a.onerror=s=>{const o=Ke("internal-error");o.customData=s,n(o)},a.type="text/javascript",a.charset="UTF-8",Lb().appendChild(a)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Db("Browser");const Ui="951877343924-01638ei3dfu0p2q7c8c8q3cdsv67mthh.apps.googleusercontent.com",pa="https://mhabib306-sys.github.io/lifeg/",_b="https://mhabib306-sys.github.io",Ob={apiKey:"AIzaSyD33w50neGgMOYgu3NbS8Dp6B4sfyEpJes",authDomain:"homebase-880f0.firebaseapp.com",projectId:"homebase-880f0",storageBucket:"homebase-880f0.firebasestorage.app",messagingSenderId:"951877343924",appId:"1:951877343924:web:8b2a96ac24f59a48a415e1"},Rb=Dc(Ob),jn=Nb(Rb);let fa=null,Sa="";function cu(){const e=new Uint8Array(32);return crypto.getRandomValues(e),Array.from(e,t=>t.toString(16).padStart(2,"0")).join("")}function uu(){if(typeof window>"u"||!window.location)return pa;try{const e=new URL(window.location.href);return e.origin===_b||!/^https?:$/.test(e.protocol)?pa:(e.search="",e.hash="",!e.pathname.endsWith("/")&&!e.pathname.split("/").pop()?.includes(".")&&(e.pathname=`${e.pathname}/`),e.toString())}catch{return pa}}function Bb(){const e=cu();sessionStorage.setItem("oauth_nonce",e);const t=uu(),n=new URLSearchParams({client_id:Ui,redirect_uri:t,response_type:"id_token token",scope:"openid email profile",nonce:e,include_granted_scopes:"true",prompt:"select_account"});window.location.href=`https://accounts.google.com/o/oauth2/v2/auth?${n.toString()}`}function jb(){window.stopWhoopSyncTimers?.(),window.stopGCalSyncTimers?.(),kv(jn).catch(e=>{console.error("Sign out failed:",e)})}function Fb(){return jn.currentUser}function Hb(){return Sa}async function Wb(e={}){const{mode:t="interactive"}=e,n=await Gb(t);if(n){localStorage.setItem(zn,n),localStorage.setItem(Fr,String(Date.now()));const i=jn.currentUser?.email||"";return i&&localStorage.setItem("nucleusGCalLoginHint",i),n}if(t==="silent")return null;const a=cu(),s=uu();sessionStorage.setItem("oauth_nonce",a),sessionStorage.setItem("oauth_calendar","1");const o=new URLSearchParams({client_id:Ui,redirect_uri:s,response_type:"id_token token",scope:"openid email profile https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/contacts.other.readonly https://www.googleapis.com/auth/spreadsheets.readonly",nonce:a,include_granted_scopes:"true",prompt:"consent"});return window.location.href=`https://accounts.google.com/o/oauth2/v2/auth?${o.toString()}`,null}function pu(){return window.google?.accounts?.oauth2?Promise.resolve(!0):fa||(fa=new Promise(e=>{const t=document.querySelector('script[data-gis-client="1"]');if(t){t.addEventListener("load",()=>e(!!window.google?.accounts?.oauth2),{once:!0}),t.addEventListener("error",()=>e(!1),{once:!0});return}const n=document.createElement("script");n.src="https://accounts.google.com/gsi/client",n.async=!0,n.defer=!0,n.dataset.gisClient="1",n.onload=()=>e(!!window.google?.accounts?.oauth2),n.onerror=()=>e(!1),document.head.appendChild(n)}),fa)}function fu(){pu().catch(()=>{})}async function Gb(e="interactive"){return!await pu()||!window.google?.accounts?.oauth2?null:new Promise(n=>{let a=!1;const s=(l=null)=>{a||(a=!0,n(l))},o=e==="silent"?1e4:6e4,i=setTimeout(()=>{console.warn(`[GIS] Token request timed out (${e}, ${o}ms)`),s(null)},o);try{const l=window.google.accounts.oauth2.initTokenClient({client_id:Ui,scope:"https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/contacts.other.readonly https://www.googleapis.com/auth/spreadsheets.readonly",use_fedcm_for_prompt:!0,callback:p=>{clearTimeout(i),Sa="",p?.access_token?(p.expires_in&&localStorage.setItem("nucleusGCalExpiresIn",String(p.expires_in)),s(p.access_token)):s(null)},error_callback:p=>{clearTimeout(i),Sa=p?.type||"unknown",console.warn(`[GIS] Token request error (${e}):`,Sa),s(null)}}),d=localStorage.getItem("nucleusGCalLoginHint")||jn.currentUser?.email||"",c=e==="silent"?{prompt:"",...d?{login_hint:d}:{}}:{prompt:"consent"};l.requestAccessToken(c)}catch(l){clearTimeout(i),console.warn("GIS calendar token request failed:",l),s(null)}})}function Ub(){const e=window.location.hash;if(!e||!e.includes("id_token="))return null;const t=new URLSearchParams(e.substring(1)),n=t.get("id_token"),a=t.get("access_token");if(history.replaceState(null,"",window.location.pathname+window.location.search),!n)return null;const s=sessionStorage.getItem("oauth_calendar")==="1";if(sessionStorage.removeItem("oauth_calendar"),sessionStorage.removeItem("oauth_nonce"),s&&a){localStorage.setItem(zn,a),localStorage.setItem(Fr,String(Date.now())),localStorage.setItem(fs,"true");const o=t.get("expires_in");o&&localStorage.setItem("nucleusGCalExpiresIn",o),r.gcalTokenExpired=!1,r.gcalError=null;try{const i=JSON.parse(atob(n.split(".")[1]));i?.email&&localStorage.setItem("nucleusGCalLoginHint",i.email)}catch{}}return{idToken:n,accessToken:a}}function gu(e){const t=Ub();if(t){const s=ot.credential(t.idToken);bv(jn,s).catch(o=>{console.error("Firebase credential sign-in failed:",o),r.authError=o.message,window.render()})}let n=!0;const a=setTimeout(()=>{n&&(console.warn("[Auth] Firebase auth timed out — showing login screen"),n=!1,r.authLoading=!1,r.currentUser=null,e(null))},5e3);xv(jn,s=>{clearTimeout(a),r.currentUser=s,r.authLoading=!1,r.authError=null,n?(n=!1,e(s)):window.render()})}const mu="nucleusWhoopWorkerUrl",hu="nucleusWhoopApiKey",zi="nucleusWhoopLastSync",$s="nucleusWhoopConnected",zb=360*60*1e3,Vb=360*60*1e3;let En=null,Dn=null,Ta=null,Ue=null;const qb=60*1e3,hd=11;function Xn(){return localStorage.getItem(mu)||""}function Kb(e){localStorage.setItem(mu,e.replace(/\/+$/,""))}function Qr(){return localStorage.getItem(hu)||""}function Yb(e){localStorage.setItem(hu,e)}function Cs(){const e=localStorage.getItem(zi);return e?parseInt(e,10):null}function Wt(){return localStorage.getItem($s)==="true"}async function vu(){const e=Xn(),t=Qr();if(!e||!t)return null;try{const n=await fetch(`${e}/data`,{headers:{"X-API-Key":t}});return n.ok?await n.json():(console.warn("WHOOP data fetch failed:",n.status),null)}catch(n){return console.error("WHOOP fetch error:",n),null}}async function Jb(){const e=Xn(),t=Qr();if(!e||!t)return!1;try{const n=await fetch(`${e}/status`,{headers:{"X-API-Key":t}});if(!n.ok)return!1;const s=!!(await n.json()).connected;return localStorage.setItem($s,String(s)),window.render(),s}catch(n){return console.error("WHOOP status check error:",n),!1}}function Xb(e,t){r.allData[e]||(r.allData[e]=Ur()),r.allData[e].whoop||(r.allData[e].whoop={}),t.sleepPerf!==null&&t.sleepPerf!==void 0&&(r.allData[e].whoop.sleepPerf=t.sleepPerf),t.recovery!==null&&t.recovery!==void 0&&(r.allData[e].whoop.recovery=t.recovery),t.strain!==null&&t.strain!==void 0&&(r.allData[e].whoop.strain=t.strain),r.allData[e]._lastModified=new Date().toISOString()}async function Zr({isRetry:e=!1}={}){const t=await vu();if(!t){!e&&Wt()&&(Ue&&clearTimeout(Ue),Ue=setTimeout(()=>{Ue=null,console.log("WHOOP retry sync triggered"),Zr({isRetry:!0})},qb));return}Ue&&(clearTimeout(Ue),Ue=null);const n=U();Xb(n,t),localStorage.setItem(zi,String(Date.now())),window.invalidateScoresCache(),window.saveData(),window.debouncedSaveToGithub(),window.render(),console.log(`WHOOP synced: sleep ${t.sleepPerf}%, recovery ${t.recovery}%, strain ${t.strain}`)}async function Vi(){if(!Wt()||!Xn()||!Qr())return;const e=Cs();e&&Date.now()-e<zb||await Zr()}function Qb(){const e=new Date,t=new Date(e);t.setHours(23,59,0,0);let n=t-e;return n<=0&&(t.setDate(t.getDate()+1),n=t-e),n}async function Zb(){console.log("WHOOP end-of-day sync triggered"),await Zr(),bu()}function bu(){if(Dn&&clearTimeout(Dn),!Wt())return;const e=Qb(),t=Math.floor(e/36e5),n=Math.floor(e%36e5/6e4);console.log(`WHOOP end-of-day sync scheduled in ${t}h ${n}m`),Dn=setTimeout(Zb,e)}function vd(){En&&clearInterval(En),En=setInterval(Vi,Vb)}function yu(){En&&(clearInterval(En),En=null),Dn&&(clearTimeout(Dn),Dn=null),Ta&&(clearTimeout(Ta),Ta=null),Ue&&(clearTimeout(Ue),Ue=null)}function ey(){const e=Xn();e&&window.open(`${e}/auth`,"_blank")}function ty(){localStorage.removeItem($s),localStorage.removeItem(zi),yu(),window.render()}function Vo(){if(new URLSearchParams(window.location.search).get("whoop")==="connected"){localStorage.setItem($s,"true");const n=window.location.pathname+window.location.hash;window.history.replaceState({},"",n)}if(!Wt())return;const t=new Date;if(t.getHours()<hd){const n=new Date(t);n.setHours(hd,0,0,0);const a=n-t,s=Math.floor(a/6e4);console.log(`WHOOP: first sync deferred to 11:00 AM (${s}m from now)`),Ta=setTimeout(()=>{Zr(),vd()},a)}else Vi(),vd();bu()}const wu="nucleusLibreWorkerUrl",xu="nucleusLibreApiKey",qi="nucleusLibreLastSync",Ki="nucleusLibreConnected",ny=3600*1e3,ry=3600*1e3;let An=null,Mn=null,Ia=null;const bd=8;function Qn(){return localStorage.getItem(wu)||""}function ay(e){localStorage.setItem(wu,e.replace(/\/+$/,""))}function Zn(){return localStorage.getItem(xu)||""}function sy(e){localStorage.setItem(xu,e)}function Es(){const e=localStorage.getItem(qi);return e?parseInt(e,10):null}function gn(){return localStorage.getItem(Ki)==="true"}async function ku(){const e=Qn(),t=Zn();if(!e||!t)return null;try{const n=await fetch(`${e}/data`,{headers:{"X-API-Key":t}});return n.ok?await n.json():(console.warn("Libre data fetch failed:",n.status),null)}catch(n){return console.error("Libre fetch error:",n),null}}async function Su(){const e=Qn(),t=Zn();if(!e||!t)return!1;try{const n=await fetch(`${e}/status`,{headers:{"X-API-Key":t}});if(!n.ok)return!1;const s=!!(await n.json()).connected;return localStorage.setItem(Ki,String(s)),window.render(),s}catch(n){return console.error("Libre status check error:",n),!1}}function oy(e,t){r.allData[e]||(r.allData[e]=Ur()),r.allData[e].glucose||(r.allData[e].glucose={}),r.allData[e].libre||(r.allData[e].libre={});const n=r.allData[e];t.avg24h!==null&&t.avg24h!==void 0&&(n.glucose.avg=String(t.avg24h)),t.tir!==null&&t.tir!==void 0&&(n.glucose.tir=String(t.tir)),t.currentGlucose!==null&&t.currentGlucose!==void 0&&(n.libre.currentGlucose=t.currentGlucose),n.libre.trend=t.trend||"",n.libre.readingsCount=t.readingsCount||0,n.libre.lastReading=t.lastReading||"",r.allData[e]._lastModified=new Date().toISOString()}async function ea(){const e=await ku();if(!e)return;const t=U();oy(t,e),localStorage.setItem(qi,String(Date.now())),window.invalidateScoresCache(),window.saveData(),window.debouncedSaveToGithub(),window.render(),console.log(`Libre synced: glucose ${e.currentGlucose} ${e.trend}, avg ${e.avg24h}, TIR ${e.tir}%`)}async function Yi(){if(!gn()||!Qn()||!Zn())return;const e=Es();e&&Date.now()-e<ny||await ea()}function iy(){const e=new Date,t=new Date(e);t.setHours(23,59,0,0);let n=t-e;return n<=0&&(t.setDate(t.getDate()+1),n=t-e),n}async function ly(){console.log("Libre end-of-day sync triggered"),await ea(),Ji()}function Ji(){if(Mn&&clearTimeout(Mn),!gn())return;const e=iy(),t=Math.floor(e/36e5),n=Math.floor(e%36e5/6e4);console.log(`Libre end-of-day sync scheduled in ${t}h ${n}m`),Mn=setTimeout(ly,e)}function qo(){An&&clearInterval(An),An=setInterval(Yi,ry)}function dy(){An&&(clearInterval(An),An=null),Mn&&(clearTimeout(Mn),Mn=null),Ia&&(clearTimeout(Ia),Ia=null)}async function cy(){const e=Qn(),t=Zn();if(!e||!t)return;await Su()&&(await ea(),qo(),Ji())}function uy(){localStorage.removeItem(Ki),localStorage.removeItem(qi),dy(),window.render()}function Ko(){if(!gn())return;const e=new Date;if(e.getHours()<bd){const t=new Date(e);t.setHours(bd,0,0,0);const n=t-e,a=Math.floor(n/6e4);console.log(`Libre: first sync deferred to 8:00 AM (${a}m from now)`),Ia=setTimeout(()=>{ea(),qo()},n)}else Yi(),qo();Ji()}const py="https://www.googleapis.com/calendar/v3",fy=3300*1e3,gy=900*1e3;function my(){const e=parseInt(localStorage.getItem("nucleusGCalExpiresIn")||"0",10);return e>0?e*1e3-300*1e3:fy}function hy(){const e=parseInt(localStorage.getItem("nucleusGCalExpiresIn")||"0",10);return e>0?e*1e3-gy:2700*1e3}const vy=1800*1e3,by=15e3;let dt=null,ct=null,ir=null,_e=0,Te=0,yr=null,ga=null,Ve=null,ut=null,go=Date.now();function Tu(){return Te<=1?60*1e3:Te<=2?180*1e3:300*1e3}function on(){yr&&(clearTimeout(yr),yr=null)}function yd(){if(on(),!le())return;const e=Tu();console.log(`[GCal] Scheduling silent refresh retry in ${Math.round(e/1e3)}s (attempt ${Te})`),yr=setTimeout(async()=>{if(yr=null,!le())return;await Dt()&&(console.log("[GCal] Scheduled retry succeeded"),window.render())},e)}function Ds(){localStorage.setItem(Gd,JSON.stringify(r.gcalOfflineQueue||[]))}function pt(e,t,n=""){const a=Array.isArray(r.gcalOfflineQueue)?r.gcalOfflineQueue:[];a.push({id:`gq_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,type:e,payload:t,createdAt:new Date().toISOString(),lastError:n||""}),r.gcalOfflineQueue=a,Ds(),window.render()}function Iu(e){r.gcalOfflineQueue=(r.gcalOfflineQueue||[]).filter(t=>t.id!==e),Ds()}function wd(e=""){const t=String(e).toLowerCase();return t.includes("meet.google.com")||t.includes("google.com/meet")?"Google Meet":t.includes("zoom.us")?"Zoom":t.includes("teams.microsoft.com")?"Microsoft Teams":""}function yy(e){const t=[];e?.hangoutLink&&t.push(e.hangoutLink),(e?.conferenceData?.entryPoints||[]).forEach(d=>{d?.uri&&t.push(d.uri)});const a=/(https?:\/\/[^\s<>"')]+)/gi,s=String(e?.description||"").match(a)||[],o=String(e?.location||"").match(a)||[];t.push(...s,...o);const l=t.find(d=>wd(d))||t[0]||"";return{meetingLink:l,meetingProvider:wd(l)}}function wy(e){if(!e)return!1;const t=String(e.status||"").toLowerCase();if(t==="cancelled"||t==="canceled")return!0;const n=String(e.summary||"").trim();return!!/^cance(?:l|ll)ed\b[:\s-]*/i.test(n)}function xy(e){if(!e)return!1;const n=(Array.isArray(e.attendees)?e.attendees:[]).find(a=>a.self===!0||a.self==="true");return!!(n&&n.responseStatus==="declined")}function Xi(e){return wy(e)||xy(e)}function ky(e){const t=e?.error?.details;if(!Array.isArray(t))return"";const n=t.find(d=>d?.["@type"]==="type.googleapis.com/google.rpc.ErrorInfo");if(!n||n.reason!=="SERVICE_DISABLED")return"";const a=n.metadata?.serviceTitle||"Google API",s=(n.metadata?.consumer||"").replace("projects/","")||n.metadata?.containerInfo||"",o=n.metadata?.activationUrl||"",i=s?` (project ${s})`:"",l=o?` Enable it: ${o}`:"";return`${a} is disabled${i}.${l}`.trim()}function le(){return localStorage.getItem(fs)==="true"}function er(){try{return JSON.parse(localStorage.getItem(yi)||"[]")}catch{return[]}}function Qi(e){localStorage.setItem(yi,JSON.stringify(e))}function Fn(){return localStorage.getItem(wi)||""}function Yo(e){localStorage.setItem(wi,e)}function $u(){return Array.isArray(r.gcalOfflineQueue)?r.gcalOfflineQueue:[]}function Sy(){r.gcalOfflineQueue=[],Ds(),window.render()}function Ty(e){Iu(e),window.render()}function Zi(){return localStorage.getItem(zn)||""}function $a(){if(!Zi())return!1;const t=parseInt(localStorage.getItem(Fr)||"0",10);return Date.now()-t<my()}function Cu(){r.gcalTokenExpired=!0,r.gcalError="Google Calendar session expired. Reconnect to continue.",window.render()}async function Dt({bypassCooldown:e=!1}={}){return!e&&_e&&Date.now()-_e<Tu()?!1:ir||(ir=(async()=>{try{if(await window.signInWithGoogleCalendar?.({mode:"silent"})||Te===0&&(await new Promise(s=>setTimeout(s,2e3)),await window.signInWithGoogleCalendar?.({mode:"silent"})))return _e=0,Te=0,on(),r.gcalTokenExpired=!1,r.gcalError=null,!0;const n=window.getLastGisErrorType?.()||"";return console.warn(`[GCal] Silent refresh failed (attempt ${Te+1}${n?`, GIS: ${n}`:""})`),Te++,_e=Date.now(),yd(),!1}catch(t){return console.warn("[GCal] Silent token refresh error:",t),Te++,_e=Date.now(),yd(),!1}finally{ir=null}})(),ir)}async function ln(){return $a()||await Dt()||Zi()?!0:(Cu(),!1)}async function dn(e,t={}){if(!await ln())return null;const a=Zi(),s=new AbortController,o=setTimeout(()=>s.abort(),by);t.signal&&(t.signal.aborted?s.abort():t.signal.addEventListener("abort",()=>s.abort(),{once:!0}));const{signal:i,_retry401:l,...d}=t;try{const c=await fetch(`${py}${e}`,{...d,signal:s.signal,headers:{Authorization:`Bearer ${a}`,"Content-Type":"application/json",...t.headers||{}}});if(c.status===401){if(!t._retry401){let p=await Dt();if(p||(await new Promise(m=>setTimeout(m,1e3)),p=await Dt({bypassCooldown:!0})),p)return dn(e,{...t,_retry401:!0})}return Cu(),null}if(!c.ok){let p="",m=null;try{m=await c.json(),p=m?.error?.message||""}catch{}if(c.status===403){const u=ky(m);r.gcalError=u||"Calendar access was denied. Reconnect and grant Calendar permissions."}else p?r.gcalError=`Google Calendar error: ${p}`:r.gcalError=`Google Calendar request failed (${c.status}).`;return console.warn(`GCal API error: ${c.status} ${e}${p?` — ${p}`:""}`),null}return r.gcalError=null,c.status===204?{}:c.json()}catch(c){return c?.name==="AbortError"?r.gcalError="Google Calendar request timed out. Check connection and try again.":r.gcalError="Network error while contacting Google Calendar.",console.warn("GCal network error:",c),null}finally{clearTimeout(o)}}async function As(){r.gcalCalendarsLoading=!0,r.gcalError=null,window.render();try{const e=await dn("/users/me/calendarList?minAccessRole=reader");if(!e||!Array.isArray(e.items))return!1;if(r.gcalCalendarList=e.items.map(t=>({id:t.id,summary:t.summary||t.id,backgroundColor:t.backgroundColor||"#4285f4",primary:!!t.primary,accessRole:t.accessRole})),er().length===0&&Qi(r.gcalCalendarList.map(t=>t.id)),!Fn()){const t=r.gcalCalendarList.find(n=>n.primary);t&&Yo(t.id)}return!Fn()&&r.gcalCalendarList.length>0&&Yo(r.gcalCalendarList[0].id),!0}finally{r.gcalCalendarsLoading=!1,window.render()}}async function Iy(e,t){const n=er();if(n.length===0)return;r.gcalSyncing=!0;const a=window.scrollY;window.render(),window.scrollTo(0,a);try{const s=[];for(const o of n){let i="";do{const l=new URLSearchParams({timeMin:new Date(e).toISOString(),timeMax:new Date(t).toISOString(),singleEvents:"true",orderBy:"startTime",maxResults:"250"});i&&l.set("pageToken",i);const d=await dn(`/calendars/${encodeURIComponent(o)}/events?${l}`);if(!d)break;(Array.isArray(d.items)?d.items:[]).forEach(p=>{if(Xi(p))return;const{meetingLink:m,meetingProvider:u}=yy(p);s.push({id:p.id,calendarId:o,status:p.status||"",summary:p.summary||"(No title)",description:p.description||"",attendees:Array.isArray(p.attendees)?p.attendees.map(h=>({email:h.email||"",displayName:h.displayName||"",responseStatus:h.responseStatus||"",self:!!h.self})):[],recurringEventId:p.recurringEventId||"",originalStartTime:p.originalStartTime||null,start:p.start,end:p.end,location:p.location||"",htmlLink:p.htmlLink||"",meetingLink:m,meetingProvider:u,allDay:!!p.start.date})}),i=d.nextPageToken||""}while(i)}r.gcalEvents=s,localStorage.setItem(Cr,JSON.stringify(s)),localStorage.setItem(xi,String(Date.now()))}finally{r.gcalSyncing=!1;const s=window.scrollY;window.render(),window.scrollTo(0,s)}}function $y(e){const t=er();return r.gcalEvents.filter(n=>{if(Xi(n)||t.length>0&&!t.includes(n.calendarId))return!1;if(n.allDay){const c=n.start.date,p=n.end.date;return e>=c&&e<p}const a=n.start?.dateTime||"",s=n.end?.dateTime||"";if(!a)return!1;const o=new Date(a),i=s?new Date(s):new Date(a);if(!Number.isFinite(o.getTime())||!Number.isFinite(i.getTime()))return!1;const l=new Date(`${e}T00:00:00`),d=new Date(`${e}T23:59:59.999`);return o<=d&&i>l})}async function Cy(e){const t=Fn();if(!t)return;const n=e.deferDate||e.dueDate;if(!n)return;const s=(e.dueDate||e.deferDate).split("-").map(Number),o=new Date(s[0],s[1]-1,s[2]+1),i=`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}-${String(o.getDate()).padStart(2,"0")}`,l={summary:e.title,description:e.notes||"",start:{date:n},end:{date:i}};if(e.gcalEventId)return await dn(`/calendars/${encodeURIComponent(t)}/events/${encodeURIComponent(e.gcalEventId)}`,{method:"PUT",body:JSON.stringify(l)});{const d=await dn(`/calendars/${encodeURIComponent(t)}/events`,{method:"POST",body:JSON.stringify(l)});return d&&d.id&&window.updateTask(e.id,{gcalEventId:d.id}),d}}async function Ey(e){if(!e.gcalEventId)return;const t=Fn();t&&await dn(`/calendars/${encodeURIComponent(t)}/events/${encodeURIComponent(e.gcalEventId)}`,{method:"DELETE"})}async function Dy(e,t,n){if(!e?.calendarId||!e?.id)return null;const a={start:{dateTime:t},end:{dateTime:n}};return dn(`/calendars/${encodeURIComponent(e.calendarId)}/events/${encodeURIComponent(e.id)}`,{method:"PATCH",body:JSON.stringify(a)})}async function Eu(e){if(le()){if(!navigator.onLine){pt("push_task",{task:e});return}if(await ln()&&!e.isNote&&!(!e.deferDate&&!e.dueDate))try{await Cy(e)||pt("push_task",{task:e},r.gcalError||"Push failed")}catch(t){pt("push_task",{task:e},t?.message||"Push failed"),console.warn("GCal push failed:",t)}}}async function Du(e){if(le()){if(!navigator.onLine){pt("delete_event",{task:e});return}if(await ln()&&e.gcalEventId)try{await Ey(e)===null&&pt("delete_event",{task:e},r.gcalError||"Delete failed")}catch(t){pt("delete_event",{task:e},t?.message||"Delete failed"),console.warn("GCal delete failed:",t)}}}async function Au(e,t,n){if(!le()||!e)return!1;const a=new Date(`${t}T${String(n).padStart(2,"0")}:00:00`),s=e?.start?.dateTime?new Date(e.start.dateTime):null,o=e?.end?.dateTime?new Date(e.end.dateTime):null,i=s&&o?Math.max(1800*1e3,o-s):3600*1e3,l=new Date(a.getTime()+i),d=a.toISOString(),c=l.toISOString();if(!navigator.onLine)return pt("reschedule_event",{event:e,dateStr:t,hour:n,startIso:d,endIso:c},"Offline"),!1;if(!await ln())return!1;try{if(!await Dy(e,d,c))return pt("reschedule_event",{event:e,dateStr:t,hour:n,startIso:d,endIso:c},r.gcalError||"Reschedule failed"),!1;const m=r.gcalEvents.find(u=>u.calendarId===e.calendarId&&u.id===e.id);return m&&(m.start={dateTime:d},m.end={dateTime:c},m.allDay=!1,localStorage.setItem(Cr,JSON.stringify(r.gcalEvents))),window.render(),!0}catch(p){return pt("reschedule_event",{event:e,dateStr:t,hour:n,startIso:d,endIso:c},p?.message||"Reschedule failed"),console.warn("GCal reschedule failed:",p),!1}}async function Ay(){const e=[...$u()];if(e.length){for(const t of e)try{t.type==="push_task"&&t.payload?.task?await Eu(t.payload.task):t.type==="delete_event"&&t.payload?.task?await Du(t.payload.task):t.type==="reschedule_event"&&t.payload?.event&&await Au(t.payload.event,t.payload.dateStr,t.payload.hour),Iu(t.id)}catch(n){const a=r.gcalOfflineQueue.find(s=>s.id===t.id);a&&(a.lastError=n?.message||"Retry failed"),Ds()}window.render()}}async function My(){if(_e=0,Te=0,on(),!await window.signInWithGoogleCalendar())return;localStorage.setItem(fs,"true"),r.gcalTokenExpired=!1,r.gcalError=null,await As()&&await Zt(),await window.syncGoogleContactsNow?.(),window.render()}function Py(){dt&&(clearInterval(dt),dt=null),ct&&(clearInterval(ct),ct=null),ut&&(clearInterval(ut),ut=null),Ve&&(window.removeEventListener("online",Ve),Ve=null),on()}function Ny(){localStorage.removeItem(fs),localStorage.removeItem(zn),localStorage.removeItem(Fr),localStorage.removeItem(yi),localStorage.removeItem(wi),localStorage.removeItem(Cr),localStorage.removeItem(xi),localStorage.removeItem(Na),localStorage.removeItem(gs),r.gcalEvents=[],r.gcalCalendarList=[],r.gcalCalendarsLoading=!1,r.gcalError=null,r.gcalSyncing=!1,r.gcalTokenExpired=!1,r.gcontactsSyncing=!1,r.gcontactsLastSync=null,r.gcontactsError=null,dt&&(clearInterval(dt),dt=null),ct&&(clearInterval(ct),ct=null),ut&&(clearInterval(ut),ut=null),Ve&&(window.removeEventListener("online",Ve),Ve=null),on(),Te=0,window.render()}async function Ly(){if(_e=0,Te=0,on(),!await window.signInWithGoogleCalendar())return;r.gcalTokenExpired=!1,r.gcalError=null,await As()&&await Zt(),await window.syncGoogleContactsNow?.(),window.render()}async function Zt(){if(!le()||!await ln()||(r.gcalCalendarList||[]).length===0)return;const e=new Date(r.calendarYear,r.calendarMonth-1,1,0,0,0,0),t=new Date(r.calendarYear,r.calendarMonth+2,0,23,59,59,999),n=`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`,a=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;await Iy(n,a)}function _y(e){const t=er(),n=t.indexOf(e),a=n<0;a?t.push(e):t.splice(n,1),Qi(t),a&&Zt()}function Jo(){try{const t=localStorage.getItem(Cr);if(t){const n=JSON.parse(t);r.gcalEvents=Array.isArray(n)?n.filter(a=>!Xi(a)):[],localStorage.setItem(Cr,JSON.stringify(r.gcalEvents))}}catch{}if(!le())return;(async()=>{if(!await ln())return;await As()&&Zt()})(),dt&&clearInterval(dt),dt=setInterval(async()=>{le()&&await ln()&&Zt()},vy),ct&&clearInterval(ct),ct=setInterval(async()=>{if(!le())return;const t=parseInt(localStorage.getItem(Fr)||"0",10);Date.now()-t>=hy()&&await Dt()&&console.log("[GCal] Token proactively refreshed")},60*1e3),ut&&clearInterval(ut),go=Date.now(),ut=setInterval(async()=>{const t=Date.now(),n=t-go;if(go=t,n>120*1e3){if(console.log(`[GCal] Wake detected (${Math.round(n/1e3)}s elapsed)`),!le())return;_e=0,Te=0,$a()||await Dt({bypassCooldown:!0})&&(console.log("[GCal] Token refreshed after wake"),window.render())}},30*1e3),Ve&&window.removeEventListener("online",Ve),Ve=async()=>{le()&&(console.log("[GCal] Network restored, checking token"),await new Promise(t=>setTimeout(t,1500)),_e=0,$a()||await Dt({bypassCooldown:!0})&&(console.log("[GCal] Token refreshed after reconnect"),window.render(),Zt()))},window.addEventListener("online",Ve),ga&&document.removeEventListener("visibilitychange",ga),ga=async()=>{document.visibilityState==="visible"&&le()&&(_e=0,Te=0,$a()||await Dt({bypassCooldown:!0})&&(console.log("[GCal] Token refreshed on tab focus"),window.render()))},document.addEventListener("visibilitychange",ga)}const Mu="https://people.googleapis.com/v1",Oy=1800*1e3;let mo=null;function Ms(){return localStorage.getItem(zn)||""}function Ry(){return localStorage.getItem(Na)||""}function ho(e){e?localStorage.setItem(Na,e):localStorage.removeItem(Na)}function By(e){r.gcontactsLastSync=e,localStorage.setItem(gs,String(e))}function xd(e){return String(e||"").trim().toLowerCase()}function jy(e){const t=Array.isArray(e?.names)?e.names:[],n=t.find(a=>a?.metadata?.primary);return String(n?.displayName||t[0]?.displayName||"").trim()}function Fy(e){const t=Array.isArray(e?.emailAddresses)?e.emailAddresses:[],n=t.find(a=>a?.metadata?.primary);return String(n?.value||t[0]?.value||"").trim()}function Hy(e){const t=Array.isArray(e?.organizations)?e.organizations:[],n=t.find(a=>a?.metadata?.primary);return String(n?.title||t[0]?.title||"").trim()}function Wy(e){const n=(Array.isArray(e?.photos)?e.photos:[]).filter(s=>!s?.default);if(n.length===0)return"";const a=n.find(s=>s?.metadata?.primary);return String(a?.url||n[0]?.url||"").trim()}async function Gy(e){try{if(!e)return"";let t=await fetch(e);if(!t.ok){const l=Ms();if(l&&(t=await fetch(e,{headers:{Authorization:`Bearer ${l}`}})),!t.ok)return""}const n=await t.blob(),a=await createImageBitmap(n),s=64,o=document.createElement("canvas");return o.width=s,o.height=s,o.getContext("2d").drawImage(a,0,0,s,s),a.close(),o.toDataURL("image/jpeg",.8)}catch{return""}}function Uy(){const e=["#4A90A4","#6B8E5A","#E5533D","#C4943D","#7C6B8E","#6366F1","#0EA5E9"];return e[Math.floor(Math.random()*e.length)]}function zy(){return`person_${Date.now()}_${Math.random().toString(36).slice(2,7)}`}function Vy(e){if(!Array.isArray(e)||e.length===0)return{changed:0,peopleNeedingPhotos:[]};let t=0;const n=[];for(const a of e){const s=!!a?.metadata?.deleted,o=String(a?.resourceName||"").trim(),i=jy(a),l=Fy(a),d=Hy(a),c=Wy(a),p=_n(l),m=xd(i);if(!o)continue;const u=r.taskPeople.find(f=>String(f.googleContactId||"")===o),h=!u&&p?r.taskPeople.find(f=>_n(f.email)===p):null,g=!u&&!h&&m?r.taskPeople.find(f=>xd(f.name)===m):null,b=u||h||g||null;if(s){b&&b.googleContactId===o&&(b.googleContactId="",b.updatedAt=new Date().toISOString(),t++);continue}if(b){const f=i||b.name,x=l||b.email||"",k=d||b.jobTitle||"";if((b.name!==f||String(b.email||"")!==String(x||"")||String(b.jobTitle||"")!==String(k||"")||String(b.googleContactId||"")!==o)&&(b.name=f,b.email=String(x||"").trim(),b.jobTitle=String(k||"").trim(),b.googleContactId=o,b.updatedAt=new Date().toISOString(),t++),c){const E=String(b.photoUrl||"")!==c;E&&(b.photoUrl=c),(E||!b.photoData)&&n.push(b)}continue}if(!i&&!l)continue;const y={id:zy(),name:i||l,email:String(l||"").trim(),jobTitle:String(d||"").trim(),color:Uy(),googleContactId:o,photoUrl:c,photoData:"",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};r.taskPeople.push(y),c&&n.push(y),t++}return{changed:t,peopleNeedingPhotos:n}}async function qy({pageToken:e="",syncToken:t="",requestSyncToken:n=!1}={}){const a=Ms();if(!a)return null;const s=new URLSearchParams({personFields:"names,emailAddresses,organizations,metadata,photos",pageSize:"1000"});e&&s.set("pageToken",e),t&&s.set("syncToken",t),n&&s.set("requestSyncToken","true");const o=await fetch(`${Mu}/people/me/connections?${s.toString()}`,{headers:{Authorization:`Bearer ${a}`,"Content-Type":"application/json"}});if(o.status===401)return{authExpired:!0};if(o.status===410)return{syncExpired:!0};if(!o.ok){let i=`Google Contacts request failed (${o.status})`,l=!1;try{const d=await o.json();d?.error?.message&&(i=d.error.message),l=(Array.isArray(d?.error?.errors)?d.error.errors.map(p=>String(p?.reason||"").toLowerCase()):[]).includes("insufficientpermissions")||/insufficient authentication scopes/i.test(String(d?.error?.message||""))}catch{}return o.status===403&&l?{insufficientScope:!0,error:i}:{error:i}}return o.json()}async function Ky(e=""){const t=Ms();if(!t)return null;const n=new URLSearchParams({readMask:"names,emailAddresses,photos,metadata",pageSize:"1000"});e&&n.set("pageToken",e);const a=await fetch(`${Mu}/otherContacts?${n.toString()}`,{headers:{Authorization:`Bearer ${t}`}});return a.status===401?{authExpired:!0}:a.status===403?{otherContactsUnavailable:!0}:a.ok?a.json():{error:`Other contacts request failed (${a.status})`}}async function Yy(e){let t=0;for(const n of e){if(!n.photoUrl)continue;const a=await Gy(n.photoUrl);a&&(n.photoData=a,n.updatedAt=new Date().toISOString(),t++)}t>0&&(O(),window.render(),window.debouncedSaveToGithub?.())}async function Ya({forceFullResync:e=!1}={}){if(!le()||!Ms())return!1;r.gcontactsSyncing=!0,r.gcontactsError=null,window.render();try{e&&ho("");let n=Ry(),a="",s="",o=[],i=e,l=!1,d=!1;for(;;){const u=await qy({pageToken:a,syncToken:n,requestSyncToken:!n});if(!u)return r.gcontactsError="Google Contacts sync failed.",!1;if(u.authExpired){if(!d&&(d=!0,await window.signInWithGoogleCalendar?.({mode:"silent"}))){a="";continue}return r.gcontactsError="Google Contacts authorization expired. Reconnect Google Calendar to refresh permissions.",!1}if(u.syncExpired){if(i)return r.gcontactsError="Google Contacts sync token expired. Please sync again.",!1;i=!0,ho(""),n="",a="",s="",o=[];continue}if(u.error){if(u.insufficientScope&&!l){if(l=!0,await window.signInWithGoogleCalendar?.({mode:"silent"})){a="";continue}return r.gcontactsError="Google Contacts permission is missing. Please use Reconnect in Google Calendar settings to grant Contacts access.",!1}return r.gcontactsError=u.error,!1}if(o=o.concat(Array.isArray(u.connections)?u.connections:[]),a=u.nextPageToken||"",u.nextSyncToken&&(s=u.nextSyncToken),!a)break}let c="";for(;;){const u=await Ky(c);if(!u||u.authExpired||u.otherContactsUnavailable||u.error||(o=o.concat(Array.isArray(u.otherContacts)?u.otherContacts:[]),c=u.nextPageToken||"",!c))break}const{changed:p,peopleNeedingPhotos:m}=Vy(o);for(const u of r.taskPeople)u.photoUrl&&!u.photoData&&!m.includes(u)&&m.push(u);return p>0&&O(),s&&ho(s),By(Date.now()),r.gcontactsError=null,m.length>0&&Yy(m),!0}catch(n){return r.gcontactsError=n?.message||"Google Contacts sync failed.",!1}finally{r.gcontactsSyncing=!1,window.render()}}function Jy(){return Ya({forceFullResync:!0})}function Xo(){const e=parseInt(localStorage.getItem(gs)||"0",10);r.gcontactsLastSync=Number.isFinite(e)&&e>0?e:null,le()&&(Ya(),mo&&clearInterval(mo),mo=setInterval(()=>{le()&&Ya()},Oy))}const kd="https://sheets.googleapis.com/v4/spreadsheets",Xy=3600*1e3;let vo=null;function Pu(){return localStorage.getItem(zn)||""}async function Sd(){const e=Pu();if(!e)return{error:"No access token"};const t=await fetch(`${kd}/${Ll}?fields=sheets.properties`,{headers:{Authorization:`Bearer ${e}`}});if(t.status===401)return{authExpired:!0};if(t.status===403){let u="Sheets permission denied";try{const h=await t.json();h?.error?.message&&(u=h.error.message)}catch{}return{error:u,insufficientScope:!0}}if(!t.ok)return{error:`Sheets API error (${t.status})`};const a=(await t.json())?.sheets||[];if(a.length===0)return{error:"No tabs found in spreadsheet"};const s=a.map(u=>u.properties.title);console.log(`[GSheet] Discovered ${s.length} tabs:`,s);const o=new URL(`${kd}/${Ll}/values:batchGet`);for(const u of s)o.searchParams.append("ranges",`'${u}'`);console.log("[GSheet] Batch URL:",o.href);const i=await fetch(o.href,{headers:{Authorization:`Bearer ${e}`}});if(i.status===401)return{authExpired:!0};if(!i.ok){const u=await i.text().catch(()=>"");return console.error(`[GSheet] Batch fetch failed (${i.status}):`,u),{error:`Sheets batch fetch failed (${i.status})`}}const d=(await i.json())?.valueRanges||[];console.log(`[GSheet] Got ${d.length} value ranges back`);const c=[];for(let u=0;u<d.length;u++){const h=s[u]||`Sheet${u+1}`,g=d[u]?.values||[];c.push({name:h,headers:g[0]||[],rows:g.slice(1)})}console.log(`[GSheet] Structured ${c.length} tabs:`,c.map(u=>`${u.name} (${u.rows.length} rows)`));const p=c.find((u,h)=>a[h]?.properties?.sheetId===Wf)||c[0];let m=[];if(p&&p.headers.length>0){const h=p.headers.map(g=>String(g||"").trim().toLowerCase()).findIndex(g=>g==="yesterday");if(h!==-1)for(const g of p.rows){const b=String(g[0]||"").trim(),y=h<g.length?String(g[h]||"").trim():"";!b&&!y||m.push({label:b,value:y})}}return{tabs:c,discoveredTabs:s.length,rows:m,tabName:p?.name||"",lastSync:new Date().toISOString()}}async function Ja(){if(!le()||!Pu())return!1;r.gsheetSyncing=!0,r.gsheetError=null,window.render();try{const t=await Sd();if(t.authExpired){if(await window.signInWithGoogleCalendar?.({mode:"silent"})){const o=await Sd();if(o&&!o.authExpired&&!o.error)return r.gsheetData=o,localStorage.setItem(La,JSON.stringify(o)),localStorage.setItem(_l,String(Date.now())),r.gsheetError=null,!0}return r.gsheetError="Google Sheets authorization expired. Reconnect Google Calendar to refresh.",!1}if(t.insufficientScope)return r.gsheetError="Sheets permission missing. Reconnect Google Calendar in Settings to grant Sheets access.",!1;if(t.error)return r.gsheetError=t.error,!1;r.gsheetData=t,localStorage.setItem(La,JSON.stringify(t)),localStorage.setItem(_l,String(Date.now())),r.gsheetError=null;const n=localStorage.getItem(ms),a=localStorage.getItem($r);return n&&a&&Zy(n),!0}catch(t){return r.gsheetError=t?.message||"Google Sheets sync failed.",!1}finally{r.gsheetSyncing=!1,window.render()}}function Qo(){try{const e=localStorage.getItem(La);e&&(r.gsheetData=JSON.parse(e))}catch{}le()&&(Ja(),vo&&clearInterval(vo),vo=setInterval(()=>{le()&&Ja()},Xy))}function Qy(e){if(!e)return"";if(e.tabs&&e.tabs.length>0){const t=[];for(const n of e.tabs){const a=[];a.push(`=== ${n.name} ===`),n.headers&&n.headers.length>0&&a.push(n.headers.join("	"));for(const s of n.rows||[]){const o=s.map(i=>String(i??""));o.every(i=>!i.trim())||a.push(o.join("	"))}t.push(a.join(`
`))}return t.join(`

`)}return e.rows&&e.rows.length>0?e.rows.map(t=>`${t.label}: ${t.value||"(empty)"}`).join(`
`):""}async function Nu(e){const t=localStorage.getItem($r)||"";if(!t)throw new Error("No API key configured");let n=r.gsheetData;if(!n||!n.tabs&&!n.rows){if(!await Ja())throw new Error(r.gsheetError||"Failed to fetch sheet data");n=r.gsheetData}if(!n)throw new Error("No sheet data available");const a=Qy(n);if(!a)throw new Error("No sheet data to analyze");const s=n.tabs?n.tabs.length:1,o=n.tabs?n.tabs.map(m=>m.name).join(", "):n.tabName||"Sheet",i=new AbortController,l=setTimeout(()=>i.abort(),3e4),d=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":t,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-opus-4-6",max_tokens:1024,system:`You are a concise personal assistant. The user has a spreadsheet with ${s} tab(s): ${o}. Here is ALL the data:

${a}

Answer the user's question about this data. Be brief and direct. Return your response as clean HTML for display in a widget. Use simple inline styles for visual clarity. Allowed tags: <div>, <span>, <strong>, <em>, <br>, <ul>, <ol>, <li>, <table>, <tr>, <td>, <th>. Use compact styling. Do NOT wrap in <html>, <body>, or <head> tags. Do NOT use markdown.`,messages:[{role:"user",content:e}]}),signal:i.signal});if(clearTimeout(l),!d.ok){const m=await d.text().catch(()=>"");throw new Error(`API error ${d.status}: ${m}`)}const p=(await d.json())?.content?.[0]?.text||"";if(!p)throw new Error("Empty response from AI");return p}async function Zy(e){r.gsheetAsking=!0,r.gsheetResponse=null,typeof window.render=="function"&&window.render();try{const t=await Nu(e);r.gsheetResponse=t,localStorage.setItem(hs,t)}catch(t){r.gsheetResponse=`Error: ${t.message||"Auto-run failed"}`}finally{r.gsheetAsking=!1,typeof window.render=="function"&&window.render()}}function Lu(){try{const e=localStorage.getItem(Hd);e&&(r.weatherLocation=JSON.parse(e))}catch(e){console.error("Error loading weather location:",e)}}function _u(){localStorage.setItem(Hd,JSON.stringify(r.weatherLocation))}async function Ca(){try{const e=localStorage.getItem(no);if(e)try{const{data:x,timestamp:k}=JSON.parse(e);if(x&&k&&Date.now()-k<1800*1e3){r.weatherData=x;return}}catch(x){console.warn("Corrupted weather cache, clearing:",x),localStorage.removeItem(no)}const t=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${r.weatherLocation.lat}&longitude=${r.weatherLocation.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&hourly=temperature_2m&timezone=auto&forecast_days=2`);if(!t.ok)throw new Error("Weather fetch failed");const n=await t.json(),a=n.hourly.temperature_2m,s=n.hourly.time;let o=0,i=0;for(let x=0;x<a.length;x++)a[x]>a[o]&&(o=x),a[x]<a[i]&&(i=x);const l=new Date(s[o]).getHours(),d=new Date(s[i]).getHours(),c=x=>x===0?"12am":x<12?x+"am":x===12?"12pm":x-12+"pm",p=Math.round(n.daily.temperature_2m_max[1]),m=Math.round(n.daily.temperature_2m_min[1]),u=n.daily.weather_code[1],h=Math.round(n.daily.temperature_2m_max[0]),g=Math.round(n.daily.temperature_2m_min[0]),b=p-h,y=m-g,f=Math.round((b+y)/2);r.weatherData={temp:Math.round(n.current.temperature_2m),humidity:n.current.relative_humidity_2m,weatherCode:n.current.weather_code,windSpeed:Math.round(n.current.wind_speed_10m),tempMax:h,tempMin:g,maxHour:c(l),minHour:c(d),city:r.weatherLocation.city,tomorrow:{tempMax:p,tempMin:m,weatherCode:u,maxDelta:b,minDelta:y,avgDelta:f}},localStorage.setItem(no,JSON.stringify({data:r.weatherData,timestamp:Date.now()})),window.render()}catch(e){console.error("Weather fetch error:",e),window.render()}}function Ou(){"geolocation"in navigator?navigator.geolocation.getCurrentPosition(async e=>{const{latitude:t,longitude:n}=e.coords;try{const s=await(await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${t}&longitude=${n}&current=temperature_2m&timezone=auto`)).json(),o=s.timezone?s.timezone.split("/").pop().replace(/_/g," "):"Your Location";r.weatherLocation={lat:t,lon:n,city:o},_u(),Ca()}catch(a){console.error("Geocode error:",a)}},e=>{console.log("Geolocation denied, using default location"),Ca()},{timeout:5e3}):Ca()}function Ru(){Lu(),Ou()}function ta(e){if(!e&&e!==0)return{onTime:0,late:0};const t=parseFloat(e)||0,n=Math.floor(t),a=Math.round((t-n)*10);return{onTime:n,late:a}}function ew(e){const{onTime:t,late:n}=ta(e);return t*r.WEIGHTS.prayer.onTime+n*r.WEIGHTS.prayer.late}let Ea=null,Td=-1;function We(){r.scoresCache.clear(),r.scoresCacheVersion++,Ea=null}function tw(e){return JSON.stringify(e)}function Ie(e){const t=r.WEIGHTS,n=tw(e);if(r.scoresCache.has(n))return r.scoresCache.get(n);(!e||typeof e!="object")&&(e=JSON.parse(JSON.stringify(He)));const a=e.prayers||{},s=e.glucose||{},o=e.whoop||{},i=e.family||{},l=e.habits||{};let d=0,c=0,p=0;["fajr","dhuhr","asr","maghrib","isha"].forEach(ce=>{const{onTime:ge,late:se}=ta(a[ce]);c+=ge,p+=se,d+=ge*t.prayer.onTime+se*t.prayer.late});const m=parseInt(a.quran)||0;d+=m*t.prayer.quran;let u=0;const h=parseFloat(s.avg)||0,g=parseFloat(s.tir)||0,b=parseFloat(s.insulin)||0;if(s.avg!==""&&s.avg!==void 0){const ge=t.glucose.avgMax||20;if(h>=70&&h<=140){const se=Math.abs(h-105);u+=ge*(1-se/35*.5)}else if(h>140&&h<=180){const se=ge*.5,K=(h-140)*(se/40);u+=Math.max(0,se-K)}}if(s.tir!==""&&s.tir!==void 0&&g>0){const ce=t.glucose.tirPerPoint||.3;u+=g*ce}const y=t.glucose&&t.glucose.insulinThreshold||40;s.insulin!==""&&s.insulin!==void 0&&b>0&&(b<=y?u+=t.glucose.insulinBase:u+=t.glucose.insulinPenalty);let f=0;const x=o,k=t.whoop,T=parseFloat(x.sleepPerf)||0;x.sleepPerf!==""&&x.sleepPerf!==void 0&&(T>=90?f+=k.sleepPerfHigh:T>=70?f+=k.sleepPerfMid:T>=50&&(f+=k.sleepPerfLow));const E=parseFloat(x.recovery)||0;x.recovery!==""&&x.recovery!==void 0&&(E>=66?f+=k.recoveryHigh:E>=50?f+=k.recoveryMid:E>=33&&(f+=k.recoveryLow));const N=parseFloat(x.strain)||0;if(x.strain!==""&&x.strain!==void 0&&x.recovery!==""&&x.recovery!==void 0){let ce=!1;(E>=66&&N>=14||E>=33&&E<66&&N>=10&&N<14||E<33&&N<10)&&(ce=!0),ce&&(f+=k.strainMatch||10),E>=66&&N>=18&&(f+=k.strainHigh||5)}let I=0;Object.entries(i).forEach(([ce,ge])=>{ge&&(I+=t.family[ce]||0)});let C=0;C+=(parseInt(l.exercise)||0)*t.habits.exercise,C+=(parseInt(l.reading)||0)*t.habits.reading,C+=(parseInt(l.meditation)||0)*t.habits.meditation,C+=(parseFloat(l.water)||0)*t.habits.water,C+=l.vitamins?t.habits.vitamins:0,C+=(parseInt(l.brushTeeth)||0)*t.habits.brushTeeth;const H=l.nop;H!==""&&H!==null&&H!==void 0&&(parseInt(H)===1?C+=t.habits.nopYes||5:parseInt(H)===0&&(C+=t.habits.nopNo||-3));const j=d,$=Math.round(u*10)/10,D=Math.round(f*10)/10,R=I,M=C,J=Math.round((d+u+f+I+C)*10)/10,W=Math.max(r.MAX_SCORES?.prayer||35,1),w=Math.max(r.MAX_SCORES?.diabetes||25,1),F=Math.max(r.MAX_SCORES?.whoop||14,1),z=Math.max(r.MAX_SCORES?.family||6,1),B=Math.max(r.MAX_SCORES?.habits||16,1),q=Math.max(0,Math.min(1,j/W)),S=Math.max(0,Math.min(1,$/w)),L=Math.max(0,Math.min(1,D/F)),A=Math.max(0,Math.min(1,R/z)),Y=Math.max(0,Math.min(1,M/B)),P=r.CATEGORY_WEIGHTS||Ti,ae=(P.prayer||0)+(P.diabetes||0)+(P.whoop||0)+(P.family||0)+(P.habits||0),de=ae>0?(q*(P.prayer||0)+S*(P.diabetes||0)+L*(P.whoop||0)+A*(P.family||0)+Y*(P.habits||0))/ae:0,ee={prayer:j,prayerOnTime:c,prayerLate:p,diabetes:$,whoop:D,family:R,habit:M,total:J,normalized:{prayer:q,diabetes:S,whoop:L,family:A,habits:Y,overall:Math.max(0,Math.min(1,de))}};return r.scoresCache.size>500&&r.scoresCache.clear(),r.scoresCache.set(n,ee),ee}function nw(e){e=Math.max(1,parseInt(e)||30);const t=[];for(let n=e-1;n>=0;n--){const a=new Date;a.setDate(a.getDate()-n);const s=U(a),o=r.allData[s]||He,i=Ie(o);t.push({date:s,day:a.getDate(),month:a.toLocaleDateString("en-US",{month:"short"}),label:a.toLocaleDateString("en-US",{month:"short",day:"numeric"}),...i})}return t}function rw(){return nw(30)}function aw(e){e=Math.max(1,parseInt(e)||30);let t={totalScore:0,daysLogged:0,totalOnTimePrayers:0,totalLatePrayers:0,totalFamilyCheckins:0,avgRHR:0,avgSleep:0,rhrCount:0,sleepCount:0};for(let n=e-1;n>=0;n--){const a=new Date;a.setDate(a.getDate()-n);const s=U(a);if(r.allData[s]){t.daysLogged++;const o=r.allData[s],i=Ie(o);t.totalScore+=i.total,t.totalOnTimePrayers+=i.prayerOnTime,t.totalLatePrayers+=i.prayerLate,t.totalFamilyCheckins+=Object.values(o.family).filter(Boolean).length,o.whoop.rhr&&(t.avgRHR+=parseFloat(o.whoop.rhr),t.rhrCount++),o.whoop.sleepHours&&(t.avgSleep+=parseFloat(o.whoop.sleepHours),t.sleepCount++)}}return t.totalScore=Math.round(t.totalScore),t.avgRHR=t.rhrCount?Math.round(t.avgRHR/t.rhrCount):0,t.avgSleep=t.sleepCount?(t.avgSleep/t.sleepCount).toFixed(1):0,t.avgDaily=t.daysLogged?Math.round(t.totalScore/t.daysLogged):0,t}function sw(){return aw(30)}function ow(){const e=Object.keys(r.allData).sort();if(e.length===0)return null;let t={highestDayScore:{value:0,date:null},highestWeekScore:{value:0,weekStart:null},longestStreak:{value:0,endDate:null},currentStreak:0,bestPrayerDay:{value:0,date:null},bestWhoopDay:{value:0,date:null},mostQuranPages:{value:0,date:null},perfectPrayerDays:0,totalDaysLogged:e.length},n=0,a=null;const s={};e.forEach(l=>{const d=r.allData[l]||{},c=d.prayers||{},p=Ie(d);p.total>t.highestDayScore.value&&(t.highestDayScore={value:p.total,date:l}),p.prayer>t.bestPrayerDay.value&&(t.bestPrayerDay={value:p.prayer,date:l}),p.whoop>t.bestWhoopDay.value&&(t.bestWhoopDay={value:p.whoop,date:l});const m=parseInt(c.quran)||0;m>t.mostQuranPages.value&&(t.mostQuranPages={value:m,date:l});let u=0;if(["fajr","dhuhr","asr","maghrib","isha"].forEach(b=>{const{onTime:y}=ta(c[b]);y>=1&&u++}),u===5&&t.perfectPrayerDays++,a){const b=new Date(a),y=new Date(l);Math.round((y-b)/(1e3*60*60*24))===1?n++:n=1}else n=1;n>t.longestStreak.value&&(t.longestStreak={value:n,endDate:l}),a=l;const h=new Date(l),g=U(new Date(h.setDate(h.getDate()-h.getDay())));s[g]||(s[g]=0),s[g]+=p.total});const o=U(),i=U(new Date(Date.now()-864e5));return(a===o||a===i)&&(t.currentStreak=n),Object.entries(s).forEach(([l,d])=>{d>t.highestWeekScore.value&&(t.highestWeekScore={value:Math.round(d),weekStart:l})}),t}function Ps(){r.WEIGHTS._updatedAt=new Date().toISOString(),localStorage.setItem(Ir,JSON.stringify(r.WEIGHTS))}function Bu(){r.MAX_SCORES._updatedAt=new Date().toISOString(),localStorage.setItem(Hr,JSON.stringify(r.MAX_SCORES))}function iw(e,t,n){t?r.WEIGHTS[e][t]=parseFloat(n)||0:r.WEIGHTS[e]=parseFloat(n)||0,Ps(),We(),window.debouncedSaveToGithub(),window.render()}function lw(){r.WEIGHTS=JSON.parse(JSON.stringify(ur)),Ps(),We(),window.debouncedSaveToGithub(),window.render()}function dw(e,t){r.MAX_SCORES[e]=parseFloat(t)||0,Bu(),We(),window.debouncedSaveToGithub(),window.render()}function cw(){r.MAX_SCORES=JSON.parse(JSON.stringify(pr)),Bu(),We(),window.debouncedSaveToGithub(),window.render()}function uw(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]/g,"")||"member"}function pw(e){const t=new Set((r.familyMembers||[]).map(a=>a.id));if(!t.has(e))return e;let n=1;for(;t.has(e+n);)n++;return e+n}function fw(e){const t=String(e||"").trim();if(!t)return;const n=uw(t),a=pw(n);r.familyMembers.push({id:a,name:t}),r.WEIGHTS.family||(r.WEIGHTS.family={}),r.WEIGHTS.family[a]===void 0&&(r.WEIGHTS.family[a]=1),Di(),Ps(),We(),r.MAX_SCORES.family=Math.max(r.MAX_SCORES.family||6,r.familyMembers.length),window.debouncedSaveToGithub(),window.render()}function gw(e){r.familyMembers=r.familyMembers.filter(t=>t.id!==e),r.WEIGHTS.family&&r.WEIGHTS.family[e]!==void 0&&delete r.WEIGHTS.family[e],Di(),Ps(),We(),r.MAX_SCORES.family=Math.max(1,(r.familyMembers||[]).length),window.debouncedSaveToGithub(),window.render()}function mw(e,t){const n=r.familyMembers.find(s=>s.id===e);if(!n)return;const a=String(t||"").trim();a&&(n.name=a,Di(),We(),window.debouncedSaveToGithub(),window.render())}function hw(e){for(let t=ca.length-1;t>=0;t--)if(e>=ca[t].min)return ca[t];return ca[0]}function Xa(e){for(let t=Ba.length-1;t>=0;t--)if(e>=Ba[t])return t+1;return 1}function ju(e){const t=Xa(e),n=Ba[t-1]||0,a=Ba[t]||n+1e3,s=(e-n)/(a-n),o=Ol.find(i=>t>=i.min&&t<=i.max)||Ol[0];return{level:t,currentLevelXP:n,nextLevelXP:a,progress:Math.max(0,Math.min(1,s)),tierName:o.name,tierIcon:o.icon}}function Da(e){for(let t=ao.length-1;t>=0;t--)if(e>=ao[t].min)return ao[t].multiplier;return 1}function el(e,t){const n=Math.floor(e*100),a=Math.floor(n*(t-1));return{base:n,streakBonus:a,total:n+a}}function tl(e,t){const n=r.streak;if(!(t>=Ii))return;if(!n.lastLoggedDate)n.current=1,n.lastLoggedDate=e,n.multiplier=Da(1);else if(e===n.lastLoggedDate)n.multiplier=Da(n.current);else{const o=new Date(n.lastLoggedDate),l=new Date(e).getTime()-o.getTime(),d=Math.round(l/(1e3*60*60*24));if(d===1?(n.current++,n.lastLoggedDate=e):d===2&&n.shield.available?(n.shield.available=!1,n.shield.lastUsed=n.lastLoggedDate,n.current++,n.lastLoggedDate=e):d>1&&(n.current=1,n.lastLoggedDate=e),d<=0)return}n.current>n.longest&&(n.longest=n.current),n.multiplier=Da(n.current),new Date(e).getDay()===1&&n.shield.lastUsed!==e&&(n.shield.available=!0),al()}function Fu(e,t){if(t<Ii)return{awarded:!1};if(r.xp.history.find(i=>i.date===e))return{awarded:!1};const a=Xa(r.xp.total),s=el(t,r.streak.multiplier);s.date=e,r.xp.total+=s.total,r.xp.history.push(s),r.xp.history.length>365&&(r.xp.history=r.xp.history.slice(-365));const o=Xa(r.xp.total);return rl(),{awarded:!0,xpData:s,levelUp:o>a}}function nl(e,t){const n=[],a=ju(r.xp.total),s=Object.keys(r.allData).sort();let o=0,i=0,l=0,d=0;s.forEach(u=>{const h=r.allData[u];if(!h)return;const g=h.family||{};Object.values(g).some(y=>y)&&o++,i+=parseInt(h.prayers?.quran)||0;let b=0;["fajr","dhuhr","asr","maghrib","isha"].forEach(y=>{const{onTime:f}=ta(h.prayers?.[y]);f>=1&&b++}),b===5?(l++,l>d&&(d=l)):l=0});const c=t?.normalized||{},p=c.prayer>=.6&&c.diabetes>=.6&&c.whoop>=.6&&c.family>=.6&&c.habits>=.6,m={streak:r.streak.current,prayerOnTime:t?.prayerOnTime||0,perfectPrayerStreak:d,overallPercent:c.overall||0,allCategoriesAbove60:p,totalFamilyDays:o,totalDaysLogged:s.length,totalQuranPages:i,level:a.level};return Xf.forEach(u=>{r.achievements.unlocked[u.id]||u.check(m)&&(r.achievements.unlocked[u.id]={date:e,notified:!1},n.push(u.id))}),n.length>0&&Ns(),n}function vw(e){r.achievements.unlocked[e]&&(r.achievements.unlocked[e].notified=!0,Ns())}function bw(){if(Ea&&Td===r.scoresCacheVersion)return Ea;const e=new Date,t={prayer:0,diabetes:0,whoop:0,family:0,habits:0},n={prayer:0,diabetes:0,whoop:0,family:0,habits:0};for(let d=1;d<=7;d++){const c=new Date(e);c.setDate(c.getDate()-d);const p=U(c);if(r.allData[p]){const m=Ie(r.allData[p]);m.normalized&&Object.keys(t).forEach(u=>{const h=m.normalized[u]||0;t[u]+=h,n[u]++})}}if(Math.max(...Object.values(n))<3)return null;let s=null,o=1;if(Object.keys(t).forEach(d=>{if(n[d]<1)return;const c=t[d]/n[d];c<o&&(o=c,s=d)}),!s)return null;const l={category:s,displayName:{prayer:"Prayer",diabetes:"Glucose",whoop:"Recovery",family:"Family",habits:"Habits"}[s]||s,avgPercent:Math.round(o*100),tip:Qf[s]||"Focus on improving this area."};return Ea=l,Td=r.scoresCacheVersion,l}function Hu(e){const t=r.allData[e]||He,n=Ie(t),a=n.normalized?.overall||0;tl(e,a);const s=Fu(e,a),o=nl(e,n);return window.debouncedSaveToGithub?.(),{xpResult:s,newAchievements:o}}function rl(){r.xp._updatedAt=new Date().toISOString(),localStorage.setItem(bs,JSON.stringify(r.xp))}function al(){r.streak._updatedAt=new Date().toISOString(),localStorage.setItem(ys,JSON.stringify(r.streak))}function Ns(){r.achievements._updatedAt=new Date().toISOString(),localStorage.setItem(ws,JSON.stringify(r.achievements))}function sl(){r.CATEGORY_WEIGHTS._updatedAt=new Date().toISOString(),localStorage.setItem(xs,JSON.stringify(r.CATEGORY_WEIGHTS))}function yw(e,t){r.CATEGORY_WEIGHTS[e]=parseFloat(t)||0,sl(),We(),window.debouncedSaveToGithub(),window.render()}function ww(){r.CATEGORY_WEIGHTS=JSON.parse(JSON.stringify(Ti)),sl(),We(),window.debouncedSaveToGithub(),window.render()}function Wu(){r.xp={total:0,history:[]},r.streak={current:0,longest:0,lastLoggedDate:null,shield:{available:!0,lastUsed:null},multiplier:1};const e=Object.keys(r.allData).sort();if(e.forEach(t=>{const n=r.allData[t];if(!n)return;const s=Ie(n).normalized?.overall||0;if(tl(t,s),s>=Ii&&!r.xp.history.find(i=>i.date===t)){const i=el(s,r.streak.multiplier);i.date=t,r.xp.total+=i.total,r.xp.history.push(i)}}),r.xp.history.length>365&&(r.xp.history=r.xp.history.slice(-365)),e.length>0){const t=e[e.length-1],n=Ie(r.allData[t]||He);nl(t,n)}rl(),al(),Ns(),window.debouncedSaveToGithub?.()}function mn(){return(!r.deletedEntityTombstones||typeof r.deletedEntityTombstones!="object")&&(r.deletedEntityTombstones={}),r.deletedEntityTombstones}function hn(){localStorage.setItem(Un,JSON.stringify(r.deletedEntityTombstones||{}))}function Ls(e,t){if(!t)return;const n=mn();(!n[e]||typeof n[e]!="object")&&(n[e]={}),n[e][String(t)]=new Date().toISOString(),hn()}function _s(e,t){if(!t)return;const n=mn();n[e]&&n[e][String(t)]!==void 0&&(delete n[e][String(t)],hn())}function Os(e,t=""){const n=["#4A90A4","#6B8E5A","#E5533D","#C4943D","#7C6B8E","#6366F1","#0EA5E9"],a=n[r.taskAreas.length%n.length],s=new Date().toISOString(),o={id:Gr("cat"),name:e,color:a,emoji:t||"",icon:"📁",createdAt:s,updatedAt:s};return _s("taskCategories",o.id),r.taskAreas.push(o),O(),o}function Zo(e,t){const n=r.taskAreas.findIndex(a=>a.id===e);n!==-1&&(r.taskAreas[n]={...r.taskAreas[n],...t,updatedAt:new Date().toISOString()},O())}function xw(e){Ls("taskCategories",e);const t=r.taskCategories.filter(n=>n.areaId===e).map(n=>n.id);t.forEach(n=>{const a=mn();(!a.categories||typeof a.categories!="object")&&(a.categories={}),a.categories[String(n)]=new Date().toISOString()}),hn(),r.taskCategories=r.taskCategories.filter(n=>n.areaId!==e),r.taskAreas=r.taskAreas.filter(n=>n.id!==e),r.tasksData.forEach(n=>{n.areaId===e&&(n.areaId=null),t.includes(n.categoryId)&&(n.categoryId=null)}),O()}function Je(e){return r.taskAreas.find(t=>t.id===e)}function Gu(e,t,n=""){const a=Je(t),s={id:Gr("subcat"),name:e,areaId:t,color:a?a.color:"#6366F1",emoji:n||"",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};return _s("categories",s.id),r.taskCategories.push(s),O(),s}function ei(e,t){const n=r.taskCategories.findIndex(a=>a.id===e);n!==-1&&(r.taskCategories[n]={...r.taskCategories[n],...t,updatedAt:new Date().toISOString()},O())}function kw(e){Ls("categories",e),r.taskCategories=r.taskCategories.filter(t=>t.id!==e),r.tasksData.forEach(t=>{t.categoryId===e&&(t.categoryId=null)}),O()}function Qe(e){return r.taskCategories.find(t=>t.id===e)}function _r(e){return r.taskCategories.filter(t=>t.areaId===e)}function na(e,t){const n=new Date().toISOString(),a={id:Gr("label"),name:e,color:t||"#6B7280",createdAt:n,updatedAt:n};return _s("taskLabels",a.id),r.taskLabels.push(a),O(),a}function Uu(e,t){const n=r.taskLabels.findIndex(a=>a.id===e);n!==-1&&(r.taskLabels[n]={...r.taskLabels[n],...t,updatedAt:new Date().toISOString()},O())}function Sw(e){Ls("taskLabels",e),r.taskLabels=r.taskLabels.filter(t=>t.id!==e),r.tasksData.forEach(t=>{t.labels&&(t.labels=t.labels.filter(n=>n!==e))}),O()}function Rs(e){return r.taskLabels.find(t=>t.id===e)}function ra(e,t="",n=""){const a=new Date().toISOString(),s={id:Gr("person"),name:e,email:String(t||"").trim(),jobTitle:String(n||"").trim(),photoUrl:"",photoData:"",createdAt:a,updatedAt:a};return _s("taskPeople",s.id),r.taskPeople.push(s),O(),s}function zu(e,t){const n=r.taskPeople.findIndex(a=>a.id===e);n!==-1&&(r.taskPeople[n]={...r.taskPeople[n],...t,updatedAt:new Date().toISOString()},O())}function Tw(e){Ls("taskPeople",e),r.taskPeople=r.taskPeople.filter(t=>t.id!==e),r.tasksData.forEach(t=>{t.people&&(t.people=t.people.filter(n=>n!==e))}),O()}function Bs(e){return r.taskPeople.find(t=>t.id===e)}function ol(e){return r.tasksData.filter(t=>!(!t.people||!t.people.includes(e)||t.completed))}function aa(e,t,n){r.undoTimerId&&(clearInterval(r.undoTimerId),r.undoTimerId=null),r.undoAction={label:e,snapshot:t,restoreFn:n},r.undoTimerRemaining=5,r.undoTimerId=setInterval(()=>{r.undoTimerRemaining--;const a=document.getElementById("undo-countdown"),s=document.getElementById("undo-ring-circle");if(a&&(a.textContent=r.undoTimerRemaining),s){const o=r.undoTimerRemaining/5;s.style.strokeDashoffset=(1-o)*88}r.undoTimerRemaining<=0&&Vu()},1e3),window.render()}function Iw(){if(!r.undoAction)return;const{snapshot:e,restoreFn:t}=r.undoAction;t(e),r.undoTimerId&&clearInterval(r.undoTimerId),r.undoAction=null,r.undoTimerRemaining=0,r.undoTimerId=null,window.render()}function Vu(){r.undoTimerId&&clearInterval(r.undoTimerId),r.undoAction=null,r.undoTimerRemaining=0,r.undoTimerId=null;const e=document.getElementById("undo-toast");e&&(e.classList.add("undo-fade-out"),setTimeout(()=>e.remove(),300))}function $w(){if(!r.undoAction)return"";const{label:e}=r.undoAction,t=r.undoTimerRemaining;return`
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
        <span class="undo-toast-label">${v(e)}</span>
        <button onclick="executeUndo()" class="undo-toast-btn">Undo</button>
        <button onclick="dismissUndo()" class="undo-toast-dismiss" aria-label="Dismiss">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
    </div>
  `}function Xe(e,t){return String(e)===String(t)}function Cw(e){return r.tasksData.findIndex(t=>Xe(t.id,e))}function qu(){localStorage.setItem(Gn,JSON.stringify(r.deletedTaskTombstones||{}))}function Ew(e){e&&((!r.deletedTaskTombstones||typeof r.deletedTaskTombstones!="object")&&(r.deletedTaskTombstones={}),r.deletedTaskTombstones[String(e)]=new Date().toISOString(),qu())}function Ku(e){!e||!r.deletedTaskTombstones||typeof r.deletedTaskTombstones!="object"||r.deletedTaskTombstones[String(e)]!==void 0&&(delete r.deletedTaskTombstones[String(e)],qu())}function tr(e,t={}){let n=t.status==="today"?"anytime":t.status||"inbox";const a=!!t.areaId,s=!!t.today;!t.isNote&&n==="inbox"&&(a||s)&&(n="anytime");const o={id:Wr(),title:e,notes:t.notes||"",status:n,today:t.today||t.status==="today"||!1,flagged:t.flagged||!1,completed:!1,completedAt:null,areaId:t.areaId||t.categoryId&&Qe(t.categoryId)?.areaId||null,categoryId:t.categoryId||null,labels:t.labels||[],people:t.people||[],deferDate:t.deferDate||null,dueDate:t.dueDate||null,repeat:t.repeat||null,isNote:t.isNote||!1,parentId:t.parentId||null,indent:t.indent||0,meetingEventKey:t.meetingEventKey||null,waitingFor:t.waitingFor||null,isProject:t.isProject||!1,projectId:t.projectId||null,projectType:t.projectType||"parallel",timeEstimate:t.timeEstimate||null,lastReviewedAt:null,order:(r.tasksData.filter(i=>!i.completed).length+1)*1e3,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};return Ku(o.id),r.tasksData.push(o),O(),!o.isNote&&(o.deferDate||o.dueDate)&&window.pushTaskToGCalIfConnected?.(o),navigator.vibrate&&navigator.vibrate(10),o}function sa(e,t){const n=Cw(e);if(n!==-1){const a=r.tasksData[n];t.status==="today"&&(t.status="anytime",t.today=!0),a.status==="inbox"&&t.areaId&&!a.areaId&&(t.status="anytime");const s=t.status??a.status,o=t.today??a.today;!a.isNote&&s==="inbox"&&o&&(t.status="anytime"),r.tasksData[n]={...a,...t,updatedAt:new Date().toISOString()},O();const i=r.tasksData[n];i.isNote||(i.deferDate||i.dueDate?window.pushTaskToGCalIfConnected?.(i):i.gcalEventId&&window.deleteGCalEventIfConnected?.(i))}}function Dw(){let e=!1;r.tasksData.forEach(t=>{t.status==="today"&&(t.status="anytime",t.today=!0,e=!0),typeof t.today!="boolean"&&(t.today=!1,e=!0),typeof t.flagged!="boolean"&&(t.flagged=!1,e=!0)}),e&&O()}function vn(e){const t=r.tasksData.find(n=>Xe(n.id,e));t&&t.gcalEventId&&window.deleteGCalEventIfConnected?.(t),r.tasksData.forEach(n=>{Xe(n.parentId,e)&&(n.parentId=null,n.indent=0)}),r.tasksData=r.tasksData.filter(n=>!Xe(n.id,e)),Ew(e),r.inlineEditingTaskId===e&&(r.inlineEditingTaskId=null),O()}function Aw(e){r.inlineEditingTaskId=null;const t=r.tasksData.find(s=>Xe(s.id,e));if(!t)return;const n=JSON.parse(JSON.stringify(t)),a=r.tasksData.filter(s=>Xe(s.parentId,e)).map(s=>JSON.parse(JSON.stringify(s)));vn(e),aa(`"${n.title}" deleted`,{task:n,children:a},s=>{Ku(s.task.id),r.tasksData.push(s.task),s.children.forEach(o=>{const i=r.tasksData.find(l=>l.id===o.id);i&&(i.parentId=o.parentId,i.indent=o.indent)}),O()})}function Mw(e){const t=r.tasksData.find(n=>Xe(n.id,e));if(t){const n=t.completed;t.completed=!t.completed,navigator.vibrate&&navigator.vibrate(10),t.completedAt=t.completed?new Date().toISOString():null,t.updatedAt=new Date().toISOString();let a=null;if(t.repeat&&t.repeat.type!=="none"){if(t.completed)a=Yu(t),t._spawnedRepeatId=a?a.id:null;else if(n&&t._spawnedRepeatId){const s=r.tasksData.findIndex(o=>o.id===t._spawnedRepeatId);s!==-1&&r.tasksData.splice(s,1),t._spawnedRepeatId=null}}if(O(),t.completed){const s=document.querySelector(`.task-inline-title[data-task-id="${e}"]`)||document.querySelector(`[data-task-id="${e}"]`)||document.querySelector(`[data-note-id="${e}"]`),o=s?.closest(".task-item, .swipe-row, .note-item")||s;o?(o.classList.add("task-completing"),setTimeout(()=>window.render(),400)):window.render();const i={taskId:t.id,completed:!1,completedAt:null,updatedAt:t.updatedAt,_spawnedRepeatId:t._spawnedRepeatId};aa(`"${t.title}" completed`,i,l=>{const d=r.tasksData.find(c=>Xe(c.id,l.taskId));if(d){if(d.completed=!1,d.completedAt=null,d.updatedAt=new Date().toISOString(),l._spawnedRepeatId){const c=r.tasksData.findIndex(p=>p.id===l._spawnedRepeatId);c!==-1&&r.tasksData.splice(c,1),d._spawnedRepeatId=null}O()}})}else window.render();if(t.completed){if(t.gcalEventId){const s=t.gcalEventId,o=window.deleteGCalEventIfConnected?.(t);o&&o.then(()=>{const i=r.tasksData.find(l=>Xe(l.id,e));i&&i.gcalEventId===s&&(i.gcalEventId=null,i.updatedAt=new Date().toISOString(),O(),window.render())}).catch(i=>{console.warn("GCal completion cleanup failed:",i)})}}else!t.gcalEventId&&(t.deferDate||t.dueDate)&&window.pushTaskToGCalIfConnected?.(t)}else console.warn("toggleTaskComplete: task not found",e)}function Pw(e){const t=r.tasksData.find(n=>Xe(n.id,e));t&&(t.flagged=!t.flagged,t.updatedAt=new Date().toISOString(),navigator.vibrate&&navigator.vibrate(10),O(),window.render())}function ti(e,t){const n=new Date(e),a=t.interval||1;switch(t.type){case"daily":n.setDate(n.getDate()+a);break;case"weekly":n.setDate(n.getDate()+7*a);break;case"monthly":n.setMonth(n.getMonth()+a);break;case"yearly":n.setFullYear(n.getFullYear()+a);break}return U(n)}function Yu(e){const t=U(),n=e.repeat.from==="due"&&e.dueDate?e.dueDate:t;let a=null,s=null;if(e.deferDate){const o=e.repeat.from==="due"&&e.deferDate?e.deferDate:t;a=ti(o,e.repeat)}return e.dueDate&&(s=ti(n,e.repeat)),tr(e.title,{notes:e.notes,status:e.status,today:e.today||!1,flagged:e.flagged||!1,areaId:e.areaId,categoryId:e.categoryId||null,labels:[...e.labels||[]],people:[...e.people||[]],deferDate:a,dueDate:s,repeat:{...e.repeat}})}function Ju(e){return{daily:"day(s)",weekly:"week(s)",monthly:"month(s)",yearly:"year(s)"}[e]||"day(s)"}function Nw(e){const t=document.getElementById("repeat-details"),n=document.getElementById("repeat-from-container"),a=document.getElementById("repeat-unit-label");!t||!n||(e==="none"?(t.style.display="none",n.style.display="none"):(t.style.display="flex",n.style.display="block",a&&(a.textContent=Ju(e))))}function Lw(e,t){sa(e,{status:t}),window.render()}function js(e){return r.tasksData.filter(t=>t.projectId===e)}function _w(e){const t=js(e);if(t.length===0)return 0;const n=t.filter(a=>a.completed).length;return Math.round(n/t.length*100)}function Ow(e){const t=r.tasksData.find(a=>a.id===e);return!t||t.projectType!=="sequential"?null:js(e).sort((a,s)=>(a.order||0)-(s.order||0)).find(a=>!a.completed)||null}function Rw(e){const t=js(e);if(t.length===0)return!1;const n=new Date;return n.setDate(n.getDate()-30),!t.some(s=>s.completedAt&&new Date(s.completedAt)>n)}function Xu(e,t=r.taskLabels){const n=t.find(a=>a.name.trim().toLowerCase()==="next");return!!(n&&(e.labels||[]).includes(n.id))}function Bw(e){return e.status==="inbox"&&!e.areaId}function jw(e,t,n=r.taskLabels){if(e.deferDate&&e.deferDate>t)return!1;const a=e.dueDate===t,s=e.dueDate&&e.dueDate<t,o=e.deferDate===t;return e.today||a||s||o||Xu(e,n)}function Fw(e){return!!e.flagged}function Hw(e,t){return!!(e.dueDate&&e.dueDate>t||e.deferDate&&e.deferDate>t)}function Ww(e,t){return!(e.status!=="anytime"||e.dueDate&&e.dueDate>t||e.deferDate&&e.deferDate>t)}function Gw(e){return e.status==="someday"}function Uw(e,t,n=r.taskLabels){return Xu(e,n)?!0:!(e.status!=="anytime"||e.dueDate||e.deferDate&&e.deferDate>t)}function zw(e){return!!e.waitingFor}function Vw(e){return e.isProject===!0}function qw(e,t="both"){return Array.isArray(e)?t==="tasks"?e.filter(n=>!n?.isNote):t==="notes"?e.filter(n=>!!n?.isNote&&n?.noteLifecycleState!=="deleted"):e:[]}function ni(){let e=!1;r.tasksData.forEach((t,n)=>{t.order===void 0&&(t.order=(n+1)*1e3,e=!0)}),e&&O()}function ri(e){if(e==="calendar"&&(e="inbox"),e==="notes")return r.tasksData.filter(o=>o.isNote&&!o.completed&&o.noteLifecycleState!=="deleted").sort((o,i)=>new Date(i.createdAt)-new Date(o.createdAt));const n=[...Ee,...r.customPerspectives].find(o=>o.id===e);if(!n)return[];const a=U(),s=!n.builtin;return r.tasksData.filter(o=>{if(o.isNote&&o.noteLifecycleState==="deleted")return!1;const l=(n.filter.availability||"")==="completed";if(o.isNote&&!l&&!n.filter.completed)return!1;if(n.filter.completed)return o.completed;if(l){if(!o.completed)return!1}else if(o.completed)return!1;if(e==="today")return jw(o,a);if(e==="upcoming")return Hw(o,a);if(e==="anytime")return Ww(o,a);if(e==="someday")return Gw(o);if(e==="next")return Uw(o,a);if(e==="inbox")return Bw(o);if(e==="flagged")return Fw(o);if(e==="waiting")return zw(o);if(e==="projects")return Vw(o);if(s){const d=n.filter||{},c=[];if(d.status&&(d.status==="today"?c.push(!!o.today):c.push(o.status===d.status)),d.categoryId&&c.push(o.areaId===d.categoryId),d.personId&&c.push((o.people||[]).includes(d.personId)),d.inboxOnly&&c.push(o.status==="inbox"&&!o.areaId),d.hasLabel&&c.push((o.labels||[]).some(h=>h===d.hasLabel)),d.labelIds&&d.labelIds.length>0){const g=(d.tagMatch||"any")==="all"?d.labelIds.every(b=>(o.labels||[]).includes(b)):(o.labels||[]).some(b=>d.labelIds.includes(b));c.push(g)}if(d.isUntagged&&c.push(!(o.labels||[]).length),d.hasDueDate&&c.push(!!o.dueDate),d.hasDeferDate&&c.push(!!o.deferDate),d.isRepeating&&c.push(!!(o.repeat&&o.repeat.type!=="none")),d.statusRule==="dueSoon"||d.dueSoon)if(!o.dueDate)c.push(!1);else{const h=new Date(o.dueDate+"T00:00:00"),g=new Date(a+"T00:00:00"),b=(h-g)/864e5;c.push(b>=0&&b<=7)}if((d.statusRule==="flagged"||d.flagged)&&c.push(!!o.flagged),d.availability){const h=!o.completed&&(!o.deferDate||o.deferDate<=a),g=!o.completed,b=d.availability==="available"||d.availability==="firstAvailable"?h:d.availability==="remaining"?g:d.availability==="completed"?o.completed:!0;c.push(b)}if(d.dateRange&&(d.dateRange.start||d.dateRange.end)){const h=d.dateRange.start||null,g=d.dateRange.end||null,b=d.dateRange.type||"either",y=[];(b==="due"||b==="either")&&y.push(o.dueDate),(b==="defer"||b==="either")&&y.push(o.deferDate);const f=y.some(x=>!(!x||h&&x<h||g&&x>g));c.push(f)}if(d.searchTerms){const h=d.searchTerms.toLowerCase(),g=`${o.title||""} ${o.notes||""}`.toLowerCase();c.push(g.includes(h))}if(c.length===0)return!0;const u=d.logic||"all";return u==="any"?c.some(Boolean):u==="none"?c.every(h=>!h):c.every(Boolean)}return!0}).sort((o,i)=>o.order!==void 0&&i.order!==void 0?o.order-i.order:o.dueDate&&!i.dueDate?-1:!o.dueDate&&i.dueDate?1:o.dueDate&&i.dueDate&&o.dueDate!==i.dueDate?new Date(o.dueDate)-new Date(i.dueDate):e==="inbox"?new Date(i.createdAt)-new Date(o.createdAt):new Date(o.createdAt)-new Date(i.createdAt))}function Kw(e){const t={},n=new Date;n.setHours(0,0,0,0);const a=n.toISOString().slice(0,10);return e.forEach(s=>{s.dueDate&&s.dueDate>=a&&(t[s.dueDate]||(t[s.dueDate]={due:[],defer:[]}),t[s.dueDate].due.push(s)),s.deferDate&&s.deferDate>=a&&s.deferDate!==s.dueDate&&(t[s.deferDate]||(t[s.deferDate]={due:[],defer:[]}),t[s.deferDate].defer.push(s))}),Object.keys(t).sort().map(s=>{const o=new Date(s+"T00:00:00"),i=Math.round((o-n)/(1e3*60*60*24));let l;return i===0?l="Today":i===1?l="Tomorrow":i<7?l=o.toLocaleDateString("en-US",{weekday:"long"}):l=o.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}),{date:s,label:l,dueTasks:t[s].due,deferTasks:t[s].defer}})}function Yw(e){const t={},n=new Date;return n.setHours(0,0,0,0),e.forEach(a=>{if(!a.completedAt)return;const s=a.completedAt.split("T")[0];t[s]||(t[s]=[]),t[s].push(a)}),Object.keys(t).sort().reverse().map(a=>{const s=new Date(a+"T00:00:00"),o=Math.round((n-s)/(1e3*60*60*24));let i;return o===0?i="Today":o===1?i="Yesterday":o<7?i=s.toLocaleDateString("en-US",{weekday:"long"}):i=s.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}),{date:a,label:i,tasks:t[a]}})}function Qu(e){return r.tasksData.filter(t=>!(t.areaId!==e||t.completed)).sort((t,n)=>t.dueDate&&!n.dueDate?-1:!t.dueDate&&n.dueDate?1:t.dueDate&&n.dueDate?new Date(t.dueDate)-new Date(n.dueDate):new Date(t.createdAt)-new Date(n.createdAt))}function Zu(e){return r.tasksData.filter(t=>!(!(t.labels||[]).includes(e)||t.completed)).sort((t,n)=>t.dueDate&&!n.dueDate?-1:!t.dueDate&&n.dueDate?1:t.dueDate&&n.dueDate?new Date(t.dueDate)-new Date(n.dueDate):new Date(t.createdAt)-new Date(n.createdAt))}function ep(e){return r.tasksData.filter(t=>!(t.categoryId!==e||t.completed)).sort((t,n)=>t.dueDate&&!n.dueDate?-1:!t.dueDate&&n.dueDate?1:t.dueDate&&n.dueDate?new Date(t.dueDate)-new Date(n.dueDate):new Date(t.createdAt)-new Date(n.createdAt))}function Jw(){if(r.activeFilterType==="perspective"&&r.activePerspective==="notes")return ri("notes");let e;return r.activeFilterType==="area"&&r.activeAreaFilter?e=Qu(r.activeAreaFilter):r.activeFilterType==="label"&&r.activeLabelFilter?e=Zu(r.activeLabelFilter):r.activeFilterType==="person"&&r.activePersonFilter?e=ol(r.activePersonFilter):r.activeFilterType==="subcategory"&&r.activeCategoryFilter?e=ep(r.activeCategoryFilter):e=ri(r.activePerspective),qw(e,r.workspaceContentMode||"both")}function Xw(){if(r.activeFilterType==="area"&&r.activeAreaFilter){const e=Je(r.activeAreaFilter);return{icon:"🗂️",name:e?.name||"Area",color:e?.color}}else if(r.activeFilterType==="label"&&r.activeLabelFilter){const e=Rs(r.activeLabelFilter);return{icon:"🏷️",name:e?.name||"Tag",color:e?.color}}else if(r.activeFilterType==="person"&&r.activePersonFilter){const e=Bs(r.activePersonFilter);return{icon:"👤",name:e?.name||"Person",color:e?.color,email:e?.email||"",jobTitle:e?.jobTitle||""}}else if(r.activeFilterType==="subcategory"&&r.activeCategoryFilter){const e=Qe(r.activeCategoryFilter),t=e?Je(e.areaId):null;return{icon:"📂",name:e?.name||"Category",color:e?.color,parentArea:t?.name}}else{const t=[...Ee,...r.customPerspectives].find(n=>n.id===r.activePerspective)||Ee[0];return{icon:t.icon,name:t.name}}}let oe=null,re=0,ne=null,en=-1,qe=null;const Id=60;function Pn(e){if(!e||typeof e!="string")return"#6366f1";const t=e.trim();return/^#[0-9A-Fa-f]{3}$|^#[0-9A-Fa-f]{6}$/.test(t)?t:"#6366f1"}function Me(e){return!!e?.isNote||e?.noteLifecycleState==="active"}function Lt(e){return e?.noteLifecycleState==="deleted"}function Z(e){return Me(e)&&!e.completed&&!Lt(e)}function tp(e){return r.tasksData.find(t=>t.id===e&&Me(t))}function be(e){return r.tasksData.find(t=>t.id===e&&Z(t))}function Fs(e,t,n={}){Me(e)&&(Array.isArray(e.noteHistory)||(e.noteHistory=[]),e.noteHistory.push({id:`nh_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,action:t,at:new Date().toISOString(),details:n}),e.noteHistory.length>Id&&(e.noteHistory=e.noteHistory.slice(-Id)))}function Hs(e){if(!Me(e))return!1;let t=!1;return e.noteLifecycleState!=="active"&&e.noteLifecycleState!=="deleted"&&(e.noteLifecycleState="active",t=!0),Array.isArray(e.noteHistory)||(e.noteHistory=[],t=!0),t}function $e(e,t,n={}){Hs(e),Fs(e,t,n),e.updatedAt=new Date().toISOString()}function je(){typeof window.debouncedSaveToGithub=="function"&&window.debouncedSaveToGithub()}function Ws(e){const t=window.getSelection();if(!t.rangeCount)return 0;const n=t.getRangeAt(0),a=n.cloneRange();return a.selectNodeContents(e),a.setEnd(n.startContainer,n.startOffset),a.toString().length}function Qw(e,t){const n=document.createRange(),a=window.getSelection();let s=0;const o=i=>{if(i.nodeType===Node.TEXT_NODE){const l=s+i.length;if(t<=l)return n.setStart(i,t-s),n.collapse(!0),!0;s=l}else for(const l of i.childNodes)if(o(l))return!0;return!1};o(e)||(n.selectNodeContents(e),n.collapse(!1)),a.removeAllRanges(),a.addRange(n)}function wr(e){const t=qe?r.tasksData.find(n=>n.id===qe&&Z(n)):null;if(ne==="#"){const n=r.taskAreas.map(s=>({...s,_acType:"area"})),a=(r.taskCategories||[]).map(s=>({...s,_acType:"category"}));return[...n,...a]}if(ne==="@"){const n=t?.labels||[];return r.taskLabels.filter(a=>!n.includes(a.id))}if(ne==="&"){const n=t?.people||[];return r.taskPeople.filter(a=>!n.includes(a.id))}return ne==="!"?typeof window.parseDateQuery=="function"?window.parseDateQuery(e||""):[]:[]}function il(){return ne==="#"?e=>({...Os(e,""),_acType:"area"}):ne==="@"?e=>{const t=["#ef4444","#f59e0b","#22c55e","#3b82f6","#8b5cf6","#ec4899"],n=t[Math.floor(Math.random()*t.length)];return na(e,n)}:ne==="&"?e=>ra(e,""):null}function Hn(e){const t=r.tasksData.find(c=>c.id===qe&&Z(c));if(!t){Re();return}const n=document.querySelector(`[data-note-id="${qe}"] .note-input`)||document.querySelector(".note-page-title");if(!n){Re();return}const a=n.textContent||"",s=Ws(n),o=a.substring(0,en),i=a.substring(s),l=o.trimEnd()+(o.trimEnd()?" ":"")+i.trimStart();n.textContent=l;const d=(o.trimEnd()+(o.trimEnd()?" ":"")).length;Qw(n,d),ne==="#"?e._acType==="category"?(e.areaId&&(t.areaId=e.areaId),t.categoryId=e.id):t.areaId=e.id:ne==="@"?(t.labels||(t.labels=[]),t.labels.includes(e.id)||t.labels.push(e.id)):ne==="&"?(t.people||(t.people=[]),t.people.includes(e.id)||t.people.push(e.id)):ne==="!"&&(t.deferDate=e.date),$e(t,"updated",{field:"metadata"}),O(),je(),Re(),n.focus(),ex(qe||t.id,t),tx(qe||t.id,t)}function Re(){oe&&oe.parentNode&&oe.parentNode.removeChild(oe),oe=null,ne=null,en=-1,re=0}function tn(e,t,n){oe||(oe=document.createElement("div"),oe.className="inline-autocomplete-popup",oe.addEventListener("mousedown",h=>h.preventDefault()),document.body.appendChild(oe));const a=n.getBoundingClientRect(),s=window.innerHeight-a.bottom;oe.style.left=Math.min(a.left,window.innerWidth-310)+"px",oe.style.width=Math.min(a.width+40,300)+"px",s>240?(oe.style.top=a.bottom+4+"px",oe.style.bottom="auto"):(oe.style.bottom=window.innerHeight-a.top+4+"px",oe.style.top="auto");const o=ne==="!",i=o?e:e.filter(h=>h.name.toLowerCase().includes(t.toLowerCase())),l=o?!0:e.some(h=>h.name.toLowerCase()===t.toLowerCase()),d=!o&&t.length>0&&!l,c=i.length+(d?1:0);if(c===0){Re();return}re>=c&&(re=c-1),re<0&&(re=0);const p=ne==="#"?"Area":ne==="@"?"Tag":ne==="!"?"Date":"Person";let m="";if(i.forEach((h,g)=>{const b=g===re?" active":"";let y;if(o)y='<span class="ac-icon" style="background:#8b5cf620;color:#8b5cf6"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg></span>';else if(ne==="#"){const k=Pn(h.color),T=h.emoji?v(h.emoji):'<svg style="width:14px;height:14px" viewBox="0 0 24 24" fill="currentColor"><path d="M2 6a2 2 0 012-2h5.586a1 1 0 01.707.293L12 6h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" opacity="0.35"/><rect x="2" y="9" width="20" height="11" rx="2"/></svg>';y=`<span class="ac-icon" style="background:${k}20;color:${k}">${T}</span>`}else if(ne==="@")y=`<span class="w-3 h-3 rounded-full inline-block flex-shrink-0" style="background:${Pn(h.color)}"></span>`;else{const k=Pn(h.color);y=`<span class="ac-icon" style="background:${k}20;color:${k}">👤</span>`}const f=o?`<span style="margin-left:auto;font-size:11px;color:var(--text-muted)">${ve(h.date)}</span>`:"";let x=v(h.name);if(ne==="#"&&h._acType==="category"&&h.areaId){const k=r.taskAreas.find(T=>T.id===h.areaId);k&&(x+=`<span style="margin-left:6px;font-size:11px;color:var(--text-muted)">${v(k.name)}</span>`)}m+=`<div class="inline-ac-option${b}" data-idx="${g}" style="${o?"justify-content:space-between":""}">${y}<span>${x}</span>${f}</div>`}),d){const h=i.length;m+=`<div class="inline-ac-create${re===h?" active":""}" data-idx="${h}">+ Create ${p} "${v(t)}"</div>`}oe.innerHTML=m,oe.querySelectorAll(".inline-ac-option").forEach(h=>{h.addEventListener("click",()=>Hn(i[parseInt(h.dataset.idx)]))});const u=oe.querySelector(".inline-ac-create");u&&u.addEventListener("click",()=>{const h=il();if(h){const g=h(t);Hn(g)}})}function np(e){const t=e.textContent||"",n=Ws(e);for(let a=n-1;a>=0;a--){const s=t[a];if(s===`
`){Re();return}if(s===" "){for(let o=a-1;o>=0;o--){const i=t[o];if(i===`
`||i==="#"||i==="@"||i==="&")break;if(i==="!"&&(o===0||t[o-1]===" ")){ne="!",en=o;const l=t.substring(o+1,n),d=wr(l);re=0,tn(d,l,e);return}}Re();return}if((s==="#"||s==="@"||s==="&")&&(a===0||t[a-1]===" ")){ne=s,en=a;const o=t.substring(a+1,n),i=wr(o);re=0,tn(i,o,e);return}if(s==="!"&&(a===0||t[a-1]===" ")){ne="!",en=a;const o=t.substring(a+1,n),i=wr(o);re=0,tn(i,o,e);return}}Re()}function Zw(e,t){if(e.target.classList.contains("note-page-description"))return;qe=t;const n=e.target;np(n)}function ex(e,t){const n=document.querySelector(`[data-note-id="${e}"] .note-meta-chips`);n&&(n.innerHTML=rp(t))}function tx(e,t){const n=document.querySelector(".note-page-meta");!n||r.zoomedNoteId!==e||(n.innerHTML=gl(t))}function rp(e){const t=[];if(e.areaId){const n=r.taskAreas.find(a=>a.id===e.areaId);n&&t.push(v(n.name))}if(e.categoryId){const n=r.taskCategories.find(a=>a.id===e.categoryId);n&&t.push(v(n.name))}return(e.labels||[]).forEach(n=>{const a=r.taskLabels.find(s=>s.id===n);a&&t.push(v(a.name))}),(e.people||[]).forEach(n=>{const a=r.taskPeople.find(s=>s.id===n);a&&t.push(v(a.name.split(" ")[0]))}),e.deferDate&&t.push(`Start ${ve(e.deferDate)}`),t.length?t.join(" • "):""}function nx(e,t,n){const a=r.tasksData.find(s=>s.id===e&&Z(s));a&&(t==="category"?((r.taskCategories||[]).some(o=>o.id===n)||(a.areaId=null),a.categoryId=null):t==="label"?a.labels=(a.labels||[]).filter(s=>s!==n):t==="person"?a.people=(a.people||[]).filter(s=>s!==n):t==="deferDate"&&(a.deferDate=null),$e(a,"updated",{field:"metadata"}),O(),je(),window.render())}function Ze(e,t){if(e.noteOrder!=null&&t.noteOrder!=null){if(e.noteOrder!==t.noteOrder)return e.noteOrder-t.noteOrder}else{if(e.noteOrder!=null)return-1;if(t.noteOrder!=null)return 1}const n=new Date(e.createdAt||0).getTime(),a=new Date(t.createdAt||0).getTime();if(n!==a)return n-a;const s=new Date(e.updatedAt||0).getTime(),o=new Date(t.updatedAt||0).getTime();return s!==o?s-o:String(e.id).localeCompare(String(t.id))}function ai(){ll();const e=r.tasksData.filter(a=>Z(a));if(!e.some(a=>a.noteOrder==null))return;const n=new Map;e.forEach(a=>{const s=a.parentId||"__root__";n.has(s)||n.set(s,[]),n.get(s).push(a)});for(const a of n.values())a.sort((s,o)=>{const i=new Date(s.createdAt||0).getTime(),l=new Date(o.createdAt||0).getTime();return i-l}),a.forEach((s,o)=>{s.noteOrder==null&&(s.noteOrder=(o+1)*1e3)});O()}function Gs(e){return e.length===0?1e3:Math.max(...e.map(n=>n.noteOrder||0))+1e3}function Qa(e,t){const n=e??0,a=t??n+2e3,s=a-n;return s<=1?(n+a)/2:n+Math.floor(s/2)}function ap(e){return e?typeof e=="string"?{areaId:e}:{...e}:{}}function rx(e=null){const{areaId:t,labelId:n,personId:a,categoryId:s}=ap(e),o=r.tasksData.filter(i=>Z(i));return s?o.filter(i=>i.categoryId===s):t?o.filter(i=>i.areaId===t):n?o.filter(i=>(i.labels||[]).includes(n)):a?o.filter(i=>(i.people||[]).includes(a)):o}function sp(e){const t=new Map;e.forEach(n=>{const a=n.parentId||"__root__";t.has(a)||t.set(a,[]),t.get(a).push(n)});for(const n of t.values())n.sort(Ze);return t}function op(e=null){const t=rx(e).slice().sort(Ze),n=new Map(t.map(d=>[d.id,d])),a=t.map(d=>({...d,parentId:d.parentId&&n.has(d.parentId)?d.parentId:null})),s=sp(a),o=[],i=new Set,l=(d,c)=>{(s.get(d)||[]).forEach(m=>{i.has(m.id)||(i.add(m.id),o.push({...m,indent:c}),l(m.id,c+1))})};return l("__root__",0),a.filter(d=>!i.has(d.id)).sort(Ze).forEach(d=>{o.push({...d,parentId:null,indent:0})}),o}function ip(e=null){const t=op(e),n=sp(t),a=[],s=r.zoomedNoteId||"__root__",o=r.zoomedNoteId?(t.find(l=>l.id===r.zoomedNoteId)?.indent||0)+1:0,i=(l,d)=>{(n.get(l)||[]).forEach(p=>{d||a.push({...p,indent:p.indent-o}),i(p.id,d||r.collapsedNotes.has(p.id))})};return i(s,!1),a}function lp(e){return r.activeFilterType==="label"&&r.activeLabelFilter?{labelId:r.activeLabelFilter}:r.activeFilterType==="person"&&r.activePersonFilter?{personId:r.activePersonFilter}:r.activeFilterType==="subcategory"&&r.activeCategoryFilter?{categoryId:r.activeCategoryFilter}:r.activeAreaFilter||null||e?.areaId||null}function bo(e){return ip(lp(e))}function Gt(e=null){O(),je(),window.render(),e&&requestAnimationFrame(()=>setTimeout(()=>Yt(e),30))}function dp(e){const t=e.map(a=>String(a.id)).sort();let n=0;for(const a of t)for(let s=0;s<a.length;s++)n=(n<<5)-n+a.charCodeAt(s)|0;return`${t.length}:${Math.abs(n)}`}function ax(){try{return JSON.parse(localStorage.getItem(Vd)||"null")}catch{return null}}function sx(e){localStorage.setItem(Vd,JSON.stringify(e))}function ll(){let e=!1;return r.tasksData.forEach(t=>{Me(t)&&Hs(t)&&(e=!0)}),e&&O(),e}function ox(e=100){return r.tasksData.filter(t=>Me(t)&&Lt(t)).sort((t,n)=>new Date(n.deletedAt||n.updatedAt||0).getTime()-new Date(t.deletedAt||t.updatedAt||0).getTime()).slice(0,e).map(t=>({id:t.id,title:t.title||"Untitled",deletedAt:t.deletedAt||t.updatedAt}))}function ix(e,t=!0){const n=tp(e);if(!n||!Lt(n))return!1;const a=new Set([e]);if(t){const s=[e];for(;s.length;){const o=s.pop();r.tasksData.filter(i=>Me(i)&&i.parentId===o&&Lt(i)).forEach(i=>{a.add(i.id),s.push(i.id)})}}return r.tasksData.forEach(s=>{!a.has(s.id)||!Me(s)||(Hs(s),s.noteLifecycleState="active",s.deletedAt=null,s.completed=!1,s.completedAt=null,$e(s,"restored",{includeChildren:t}))}),Gt(e),!0}function lx(e="",t=20){const n=String(e||"").trim().toLowerCase();return r.tasksData.filter(s=>Me(s)).filter(s=>!n||(s.title||"").toLowerCase().includes(n)||(s.notes||"").toLowerCase().includes(n)).sort((s,o)=>new Date(o.updatedAt||o.createdAt||0).getTime()-new Date(s.updatedAt||s.createdAt||0).getTime()).slice(0,t).map(s=>({id:s.id,title:s.title||"Untitled",state:Lt(s)?"deleted":s.completed?"completed":"active",updatedAt:s.updatedAt||s.createdAt||""}))}function dx(e=20){return r.tasksData.filter(t=>Me(t)).sort((t,n)=>new Date(n.updatedAt||n.createdAt||0).getTime()-new Date(t.updatedAt||t.createdAt||0).getTime()).slice(0,e).map(t=>({id:t.id,title:t.title||"Untitled",state:Lt(t)?"deleted":t.completed?"completed":"active",updatedAt:t.updatedAt||t.createdAt||"",lastAction:(t.noteHistory||[])[t.noteHistory.length-1]?.action||"updated"}))}function cx(){const e=r.tasksData.filter(n=>Me(n)),t={createdAt:new Date().toISOString(),noteCount:e.length,idsSignature:dp(e),notes:e};return localStorage.setItem(Gf,JSON.stringify(t)),{createdAt:t.createdAt,noteCount:t.noteCount}}function cp(e=""){const t=r.tasksData.filter(l=>Me(l)),n=t.filter(l=>Z(l)),a=t.filter(l=>Lt(l)),s=t.filter(l=>l.completed&&!Lt(l)),o={at:new Date().toISOString(),version:e||"",totalCount:t.length,activeCount:n.length,deletedCount:a.length,completedCount:s.length,idsSignature:dp(t)},i=ax();return i&&e&&i.activeCount>0&&i.activeCount-n.length>=Math.max(3,Math.ceil(i.activeCount*.3))&&(r.showCacheRefreshPrompt=!0,r.cacheRefreshPromptMessage=`Warning: active notes dropped from ${i.activeCount} to ${n.length}. Open Settings > Note Safety to search and restore.`),sx(o),o}function cn(){localStorage.setItem(_a,JSON.stringify([...r.collapsedNotes]))}function ux(e){r.collapsedNotes.has(e)?r.collapsedNotes.delete(e):r.collapsedNotes.add(e),cn(),window.render()}function up(e=null){return op(e)}function Or(e){return r.tasksData.some(t=>Z(t)&&t.parentId===e)}function pp(e){return r.tasksData.filter(t=>Z(t)&&t.parentId===e).sort(Ze)}function fp(e){let t=0;const n=new Set,a=s=>{if(n.has(s))return;n.add(s);const o=r.tasksData.filter(i=>Z(i)&&i.parentId===s);t+=o.length,o.forEach(i=>a(i.id))};return a(e),t}function dl(e,t){let n=e;const a=new Set;for(;n;){if(a.has(n))return!1;a.add(n);const s=r.tasksData.find(o=>o.id===n&&Z(o));if(!s||!s.parentId)return!1;if(s.parentId===t)return!0;n=s.parentId}return!1}function Us(e){const t=[];let n=e;const a=new Set;for(;n&&!a.has(n);){a.add(n);const s=r.tasksData.find(i=>i.id===n&&Z(i));if(!s||!s.parentId)break;const o=r.tasksData.find(i=>i.id===s.parentId&&Z(i));if(!o)break;t.unshift({id:o.id,title:o.title||"Untitled"}),n=s.parentId}return t}function px(e=null){const{areaId:t=null,labelId:n=null,personId:a=null,categoryId:s=null}=ap(e),o=r.tasksData.filter(l=>Z(l)&&!l.parentId&&(t?l.areaId===t:!0)).sort(Ze);if(r.zoomedNoteId)return vp(r.zoomedNoteId);const i={id:Wr(),title:"",notes:"",status:"anytime",completed:!1,completedAt:null,areaId:t,categoryId:s,labels:n?[n]:[],people:a?[a]:[],deferDate:null,dueDate:null,repeat:null,isNote:!0,noteLifecycleState:"active",noteHistory:[],parentId:null,indent:0,noteOrder:Gs(o),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};Fs(i,"created",{source:"root"}),r.tasksData.push(i),Gt(i.id)}function gp(e){const t=be(e);if(!t)return;const n=up(lp(t)),a=n.findIndex(d=>d.id===e);if(a<=0)return;const s=n[a-1],o=5,i=Math.min((s.indent||0)+1,o);if((t.indent||0)>=o||i===(t.indent||0)&&t.parentId===s.id)return;const l=r.tasksData.filter(d=>Z(d)&&d.parentId===s.id&&d.areaId===t.areaId).sort(Ze);t.parentId=s.id,t.indent=i,t.noteOrder=Gs(l),$e(t,"updated",{field:"hierarchy",type:"indent"}),r.collapsedNotes.has(s.id)&&(r.collapsedNotes.delete(s.id),cn()),Gt(e)}function mp(e){const t=be(e);if(!t||(t.indent||0)<=0)return;const n=t.parentId?r.tasksData.find(l=>l.id===t.parentId&&Z(l)):null,a=n&&n.parentId||null,s=r.tasksData.filter(l=>Z(l)&&l.parentId===a&&l.areaId===t.areaId).sort(Ze),o=n&&n.noteOrder||0,i=s.find(l=>(l.noteOrder||0)>o);t.noteOrder=Qa(o,i?i.noteOrder:null),t.parentId=a,t.indent=Math.max(0,(t.indent||0)-1),$e(t,"updated",{field:"hierarchy",type:"outdent"}),Gt(e)}function fx(e){const t=be(e);if(!t)return;const n=r.tasksData.filter(l=>Z(l)&&l.parentId===t.parentId&&l.areaId===t.areaId).sort(Ze),a=n.findIndex(l=>l.id===e),s=n[a+1],o=Qa(t.noteOrder,s?s.noteOrder:null),i={id:Wr(),title:"",notes:"",status:"anytime",completed:!1,completedAt:null,areaId:t.areaId,categoryId:t.categoryId||null,labels:[],people:[],deferDate:null,dueDate:null,repeat:null,isNote:!0,noteLifecycleState:"active",noteHistory:[],parentId:t.parentId,indent:t.indent||0,noteOrder:o,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};Fs(i,"created",{source:"after",relatedTo:e}),r.tasksData.push(i),Gt(i.id)}function hp(e){const t=be(e);if(!t)return null;const n=pp(e),a=n.length>0?Gs(n):1e3,s={id:Wr(),title:"",notes:"",status:"anytime",completed:!1,completedAt:null,areaId:t.areaId,categoryId:t.categoryId||null,labels:[],people:[],deferDate:null,dueDate:null,repeat:null,isNote:!0,noteLifecycleState:"active",noteHistory:[],parentId:e,indent:Math.min((t.indent||0)+1,5),noteOrder:a,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};return Fs(s,"created",{source:"child",relatedTo:e}),r.collapsedNotes.has(e)&&(r.collapsedNotes.delete(e),cn()),r.tasksData.push(s),s}function vp(e){const t=hp(e);t&&Gt(t.id)}function cl(e,t=!1){const n=be(e);if(!n)return;if(r.zoomedNoteId===e){const o=Us(e);r.zoomedNoteId=o.length>0?o[o.length-1].id:null,r.notesBreadcrumb=o.length>0?o.slice(0,-1):[]}const a=new Date().toISOString(),s=o=>{!o||!Z(o)||(Hs(o),o.noteLifecycleState="deleted",o.deletedAt=a,o.completed=!0,o.completedAt=o.completedAt||a,$e(o,"deleted",{reason:"manual"}))};if(t){const o=[e],i=new Set;for(;o.length;){const l=o.pop();if(i.has(l))continue;i.add(l);const d=be(l);d&&(s(d),r.tasksData.filter(c=>Z(c)&&c.parentId===l).forEach(c=>o.push(c.id)))}}else{const o=[],i=new Set,l=d=>{if(i.has(d))return;i.add(d),r.tasksData.filter(p=>Z(p)&&p.parentId===d).forEach(p=>{o.push(p),l(p.id)})};l(e),o.forEach(d=>{d.indent=Math.max(0,(d.indent||0)-1)}),o.filter(d=>d.parentId===e).forEach(d=>{d.parentId=n.parentId,$e(d,"reparented",{from:e,to:n.parentId||null})}),s(n)}r.collapsedNotes.delete(e),cn(),Gt()}function bp(e,t){const n=be(e);if(!n)return;const a=new Set([e]),s=new Set,o=d=>{s.has(d)||(s.add(d),r.tasksData.filter(c=>Z(c)&&c.parentId===d).forEach(c=>{a.add(c.id),o(c.id)}))};o(e);const i=r.tasksData.filter(d=>a.has(d.id)).map(d=>JSON.parse(JSON.stringify(d))),l=r.collapsedNotes.has(e);cl(e,!0),t&&setTimeout(()=>Yt(t),60),aa(`"${n.title||"Untitled"}" deleted`,{snapshot:i,wasCollapsed:l},d=>{d.snapshot.forEach(c=>{const p=tp(c.id);p?Object.assign(p,c):r.tasksData.push(c)}),d.wasCollapsed&&r.collapsedNotes.add(e),O(),je()})}function yp(e){const t=r.tasksData.find(i=>i.id===e&&(Me(i)||!i.isNote));if(!t)return;const n=JSON.parse(JSON.stringify(t)),a=t.isNote;let s=[];if(t.isNote){const i=r.tasksData.filter(l=>Z(l)&&l.parentId===e);i.length&&(s=i.map(l=>({id:l.id,parentId:l.parentId,indent:l.indent})),i.forEach(l=>{l.parentId=t.parentId||null,l.indent=Math.max(0,(l.indent||0)-1)})),t.isNote=!1,t.status=t.status||"anytime",t.noteLifecycleState="converted",t.order==null&&(t.order=t.noteOrder||Date.now())}else t.isNote=!0,t.noteLifecycleState="active",t.noteHistory||(t.noteHistory=[]),t.noteOrder==null&&(t.noteOrder=t.order||Date.now()),t.parentId==null&&(t.parentId=null),t.indent==null&&(t.indent=0),t.today=!1,t.flagged=!1;$e(t,"toggled",{from:a?"note":"task",to:a?"task":"note"}),O(),je(),aa(a?"Converted to task":"Converted to note",{itemSnap:n,childSnaps:s},i=>{Object.assign(t,i.itemSnap),i.childSnaps&&i.childSnaps.length&&i.childSnaps.forEach(l=>{const d=r.tasksData.find(c=>c.id===l.id);d&&(d.parentId=l.parentId,d.indent=l.indent)}),O(),je()})}function si(e){const t=window.getSelection();if(!t.rangeCount)return!0;const n=t.getRangeAt(0);return n.collapsed&&n.startOffset===0&&(n.startContainer===e.firstChild||n.startContainer===e)}function ul(e){const t=window.getSelection();if(!t.rangeCount)return!0;const n=t.getRangeAt(0),a=(e.textContent||"").length;return!!(n.collapsed&&n.startOffset===a||n.collapsed&&n.startContainer===e&&n.startOffset===e.childNodes.length)}function Yt(e){const t=document.querySelector(`[data-note-id="${e}"] .note-input`);if(t){t.focus();const n=document.createRange(),a=window.getSelection();if(t.childNodes.length>0){const s=t.childNodes[t.childNodes.length-1];s.nodeType===Node.TEXT_NODE?n.setStart(s,s.length):n.setStartAfter(s)}else n.setStart(t,0);n.collapse(!0),a.removeAllRanges(),a.addRange(n)}}function gx(e,t){const n=be(t);if(n){if(oe){const a=e.target,s=a.textContent||"",o=Ws(a),i=s.substring(en+1,o),l=ne==="!",d=wr(i),c=l?d:d.filter(h=>h.name.toLowerCase().includes(i.toLowerCase())),p=l?!0:d.some(h=>h.name.toLowerCase()===i.toLowerCase()),m=!l&&i.length>0&&!p,u=c.length+(m?1:0);if(e.key==="ArrowDown"){e.preventDefault(),e.stopImmediatePropagation(),re=(re+1)%u,tn(d,i,a);return}else if(e.key==="ArrowUp"){e.preventDefault(),e.stopImmediatePropagation(),re=(re-1+u)%u,tn(d,i,a);return}else if(e.key==="Enter"||e.key==="Tab"){if(e.preventDefault(),e.stopImmediatePropagation(),qe=t,re<c.length)Hn(c[re]);else if(m){const h=il();if(h){const g=h(i);Hn(g)}}return}else if(e.key==="Escape"){e.preventDefault(),e.stopImmediatePropagation(),Re();return}}if(e.key==="Tab"){e.preventDefault(),e.shiftKey?mp(t):gp(t);return}if(e.key==="Enter"&&e.shiftKey&&(e.metaKey||e.ctrlKey)){e.preventDefault(),yp(t);return}if(e.key==="Enter"&&(e.metaKey||e.ctrlKey)){e.preventDefault(),fl(t);return}if(e.key==="Backspace"&&(e.metaKey||e.ctrlKey)){e.preventDefault(),r.zoomedNoteId&&zs();return}if(e.key==="ArrowUp"&&(e.metaKey||e.ctrlKey)){e.preventDefault(),Or(t)&&!r.collapsedNotes.has(t)&&(r.collapsedNotes.add(t),cn(),window.render(),setTimeout(()=>Yt(t),30));return}if(e.key==="ArrowDown"&&(e.metaKey||e.ctrlKey)){e.preventDefault(),Or(t)&&r.collapsedNotes.has(t)&&(r.collapsedNotes.delete(t),cn(),window.render(),setTimeout(()=>Yt(t),30));return}if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();const s=e.target.textContent.trim();s!==(n.title||"")&&(n.title=s,$e(n,"updated",{field:"title"}));const o=hp(t);if(o){O(),je(),window.render();let i=0;const l=()=>{const d=document.querySelector(`[data-note-id="${o.id}"] .note-input`);if(d){d.focus();const c=document.createRange(),p=window.getSelection();c.setStart(d,0),c.collapse(!0),p.removeAllRanges(),p.addRange(c)}else i<5&&(i++,setTimeout(l,50))};requestAnimationFrame(l)}return}if(e.key==="Backspace"&&e.target.textContent===""&&si(e.target)){e.preventDefault();const a=bo(n),s=a.findIndex(i=>i.id===t),o=s>0?a[s-1].id:null;bp(t,o);return}if(e.key==="ArrowUp"&&si(e.target)){e.preventDefault();const a=bo(n),s=a.findIndex(o=>o.id===t);s>0?Yt(a[s-1].id):s===0&&r.zoomedNoteId&&Za(r.zoomedNoteId);return}if(e.key==="ArrowDown"&&ul(e.target)){e.preventDefault();const a=bo(n),s=a.findIndex(o=>o.id===t);s>=0&&s<a.length-1&&Yt(a[s+1].id)}}}let pl;function mx(e,t){const n=be(t);if(!n)return;pl=setTimeout(()=>Re(),150);const a=e.target.textContent.trim(),s=n.title||"";if(a===""&&!Or(t)&&!n.notes){cl(t);return}a!==s&&(n.title=a,$e(n,"updated",{field:"title"}),O(),je()),r.editingNoteId===t&&(r.editingNoteId=null)}function hx(e,t){clearTimeout(pl),r.editingNoteId=t}function vx(e){e.preventDefault();const t=(e.clipboardData||window.clipboardData).getData("text/plain"),n=window.getSelection();if(n.rangeCount){const a=n.getRangeAt(0);a.deleteContents(),a.insertNode(document.createTextNode(t)),a.collapse(!1),n.removeAllRanges(),n.addRange(a)}}function fl(e){const t=be(e);if(!t)return;r.zoomedNoteId=e;const n=Us(e);r.notesBreadcrumb=[...n,{id:e,title:t.title||"Untitled"}],window.render()}function zs(){if(!r.zoomedNoteId)return;const e=Us(r.zoomedNoteId);if(e.length>0){const t=e[e.length-1];r.zoomedNoteId=t.id,r.notesBreadcrumb=e}else r.zoomedNoteId=null,r.notesBreadcrumb=[];window.render()}function bx(e){e?fl(e):(r.zoomedNoteId=null,r.notesBreadcrumb=[],window.render())}let Jt=null;function gl(e){if(!e)return"";let t="";if(e.areaId){const n=r.taskAreas.find(a=>a.id===e.areaId);if(n){const a=Pn(n.color);t+=`<span class="note-page-chip" style="background:${a}12;border-color:${a}30;color:${a}">
        ${v(n.name)}
        <span class="chip-remove" onclick="event.stopPropagation();removeNoteInlineMeta('${e.id}','category','${n.id}')" title="Remove">&times;</span>
      </span>`}}if(e.categoryId){const n=(r.taskCategories||[]).find(a=>a.id===e.categoryId);n&&(t+=`<span class="note-page-chip">
        ${v(n.name)}
        <span class="chip-remove" onclick="event.stopPropagation();removeNoteInlineMeta('${e.id}','category','${n.id}')" title="Remove">&times;</span>
      </span>`)}return(e.labels||[]).forEach(n=>{const a=r.taskLabels.find(s=>s.id===n);if(a){const s=Pn(a.color);t+=`<span class="note-page-chip" style="background:${s}12;border-color:${s}30;color:${s}">
        ${v(a.name)}
        <span class="chip-remove" onclick="event.stopPropagation();removeNoteInlineMeta('${e.id}','label','${n}')" title="Remove">&times;</span>
      </span>`}}),(e.people||[]).forEach(n=>{const a=r.taskPeople.find(s=>s.id===n);if(a){const s=Pn(a.color);t+=`<span class="note-page-chip" style="background:${s}12;border-color:${s}30;color:${s}">
        ${v(a.name.split(" ")[0])}
        <span class="chip-remove" onclick="event.stopPropagation();removeNoteInlineMeta('${e.id}','person','${n}')" title="Remove">&times;</span>
      </span>`}}),e.deferDate&&(t+=`<span class="note-page-chip">
      <svg style="width:12px;height:12px;flex-shrink:0" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>
      ${ve(e.deferDate)}
      <span class="chip-remove" onclick="event.stopPropagation();removeNoteInlineMeta('${e.id}','deferDate',null)" title="Remove">&times;</span>
    </span>`),t+=`<button class="note-page-add-meta" onclick="focusPageTitleForMeta('${e.id}')" title="Add metadata">+ Add</button>`,t}function yx(e){const t=document.querySelector(".note-page-title");if(!t)return;t.focus();const n=document.createRange(),a=window.getSelection();if(t.childNodes.length>0){const l=t.childNodes[t.childNodes.length-1];l.nodeType===Node.TEXT_NODE?n.setStart(l,l.length):n.setStartAfter(l)}else n.setStart(t,0);n.collapse(!0),a.removeAllRanges(),a.addRange(n);const o=(t.textContent||"").endsWith(" ")?"#":" #",i=document.createTextNode(o);n.insertNode(i),n.setStartAfter(i),n.collapse(!0),a.removeAllRanges(),a.addRange(n),qe=e,np(t)}function Za(e){const t=document.querySelector(".note-page-description");if(t){t.focus();const n=document.createRange(),a=window.getSelection();n.selectNodeContents(t),n.collapse(!1),a.removeAllRanges(),a.addRange(n)}}function wp(e){const t=document.querySelector(".note-page-title");if(t){t.focus();const n=document.createRange(),a=window.getSelection();n.selectNodeContents(t),n.collapse(!1),a.removeAllRanges(),a.addRange(n)}}function wx(e,t){const n=be(t);if(!n)return;pl=setTimeout(()=>Re(),150);const a=e.target.textContent.trim();if(a!==(n.title||"")){n.title=a,$e(n,"updated",{field:"title"}),O(),je();const s=r.notesBreadcrumb.find(o=>o.id===t);s&&(s.title=a||"Untitled")}}function xx(e,t){if(oe){const n=e.target,a=n.textContent||"",s=Ws(n),o=a.substring(en+1,s),i=ne==="!",l=wr(o),d=i?l:l.filter(u=>u.name.toLowerCase().includes(o.toLowerCase())),c=i?!0:l.some(u=>u.name.toLowerCase()===o.toLowerCase()),p=!i&&o.length>0&&!c,m=d.length+(p?1:0);if(e.key==="ArrowDown"){e.preventDefault(),e.stopImmediatePropagation(),re=(re+1)%m,tn(l,o,n);return}else if(e.key==="ArrowUp"){e.preventDefault(),e.stopImmediatePropagation(),re=(re-1+m)%m,tn(l,o,n);return}else if(e.key==="Enter"||e.key==="Tab"){if(e.preventDefault(),e.stopImmediatePropagation(),qe=t,re<d.length)Hn(d[re]);else if(p){const u=il();if(u){const h=u(o);Hn(h)}}return}else if(e.key==="Escape"){e.preventDefault(),e.stopImmediatePropagation(),Re();return}}if(e.key==="Backspace"&&(e.metaKey||e.ctrlKey)){e.preventDefault(),r.zoomedNoteId&&zs();return}if(e.key==="Enter"&&!e.shiftKey){e.preventDefault(),Za();return}if(e.key==="ArrowDown"&&ul(e.target)){e.preventDefault(),Za();return}}function kx(e,t){Jt&&(clearTimeout(Jt),Jt=null);const n=be(t);if(!n)return;const a=e.target.innerText.trim();a!==(n.notes||"")&&(n.notes=a,$e(n,"updated",{field:"notes"}),O(),je())}function Sx(e,t){if(e.key==="Backspace"&&(e.metaKey||e.ctrlKey)){e.preventDefault(),r.zoomedNoteId&&zs();return}if(e.key==="ArrowUp"&&si(e.target)){e.preventDefault(),wp();return}if(e.key==="ArrowDown"&&ul(e.target)){e.preventDefault();const n=document.querySelector(".note-item .note-input");n&&n.focus();return}}function Tx(e,t){Jt&&clearTimeout(Jt);const n=e.target.innerText.trim();Jt=setTimeout(()=>{const a=be(t);a&&(n!==(a.notes||"")&&(a.notes=n,$e(a,"updated",{field:"notes"}),O(),je()),Jt=null)},2e3)}function Ix(){if(!r.zoomedNoteId||r.notesBreadcrumb.length===0)return"";const e=r.notesBreadcrumb[r.notesBreadcrumb.length-1],t=be(r.zoomedNoteId),n=r.notesBreadcrumb.slice(0,-1),a=n.length>0?n[n.length-1].title:"All Notes",s=["All Notes",...n.map(o=>v(o.title))];return`
    <div class="note-page-header">
      <div class="note-page-nav">
        <button onclick="zoomOutOfNote()" class="notes-back-btn" title="Go back (Cmd+Backspace)">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
          <span>${v(a)}</span>
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
      >${e.title?v(e.title):""}</div>
      <div class="note-page-meta">${t?gl(t):""}</div>
      <div contenteditable="true" class="note-page-description" data-placeholder="Add a description..."
        onkeydown="handleDescriptionKeydown(event, '${r.zoomedNoteId}')"
        oninput="handleDescriptionInput(event, '${r.zoomedNoteId}')"
        onblur="handleDescriptionBlur(event, '${r.zoomedNoteId}')"
        onpaste="handleNotePaste(event)"
      >${v(t?.notes||"")}</div>
    </div>
    <div class="note-page-separator"></div>
  `}function $x(e,t){jt()||(r.draggedNoteId=t,e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t),requestAnimationFrame(()=>{const a=document.querySelector(`[data-note-id="${t}"]`);a&&a.classList.add("note-dragging")}))}function Cx(e){const t=r.draggedNoteId,n=r.dragOverNoteId,a=r.noteDragPosition;document.querySelectorAll(".note-dragging, .note-drag-over, .note-drag-over-bottom, .note-drag-over-child").forEach(s=>{s.classList.remove("note-dragging","note-drag-over","note-drag-over-bottom","note-drag-over-child")}),t&&n&&a&&t!==n&&xp(t,n,a),r.draggedNoteId=null,r.dragOverNoteId=null,r.noteDragPosition=null}function Ex(e,t){if(e.preventDefault(),e.dataTransfer.dropEffect="move",!r.draggedNoteId||r.draggedNoteId===t||dl(t,r.draggedNoteId))return;const n=e.currentTarget,a=n.getBoundingClientRect(),s=e.clientY-a.top,o=a.height;n.classList.remove("note-drag-over","note-drag-over-bottom","note-drag-over-child");let i;s<o*.25?(i="top",n.classList.add("note-drag-over")):s>o*.75?(i="bottom",n.classList.add("note-drag-over-bottom")):(i="child",n.classList.add("note-drag-over-child")),r.dragOverNoteId=t,r.noteDragPosition=i}function Dx(e){const t=e.currentTarget;t.contains(e.relatedTarget)||t.classList.remove("note-drag-over","note-drag-over-bottom","note-drag-over-child")}function Ax(e){e.preventDefault()}function xp(e,t,n){const a=be(e),s=be(t);if(!(!a||!s)&&!dl(t,e)){if(n==="child"){a.parentId=t,a.indent=Math.min((s.indent||0)+1,5),a.areaId=s.areaId;const o=r.tasksData.filter(i=>Z(i)&&i.parentId===t&&i.id!==e).sort(Ze);a.noteOrder=Gs(o),r.collapsedNotes.has(t)&&(r.collapsedNotes.delete(t),cn())}else{a.parentId=s.parentId,a.indent=s.indent||0;const o=r.tasksData.filter(l=>Z(l)&&l.parentId===s.parentId&&l.areaId===s.areaId&&l.id!==e).sort(Ze),i=o.findIndex(l=>l.id===t);if(n==="top"){const l=i>0?o[i-1]:null;a.noteOrder=Qa(l?l.noteOrder:null,s.noteOrder)}else{const l=i<o.length-1?o[i+1]:null;a.noteOrder=Qa(s.noteOrder,l?l.noteOrder:null)}}$e(a,"updated",{field:"hierarchy",type:"reorder"}),Gt()}}function kp(e){const t=Or(e.id),n=r.collapsedNotes.has(e.id),a=r.editingNoteId===e.id,s=t&&n?fp(e.id):0,o=e.areaId||e.labels&&e.labels.length>0||e.people&&e.people.length>0||e.deferDate,i=jt(),l=`
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
          >${e.title?v(e.title):""}</div>
          ${o?`<div class="note-meta-chips">${rp(e)}</div>`:""}
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
    `:l}function Sp(e=null){const t=ip(e);return t.length===0&&!r.zoomedNoteId?`
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
    `:`<div class="notes-list">${t.map(n=>kp(n)).join("")}</div>`}function Mx(e,t){r.draggedTaskId=t,e.target.classList.add("dragging"),e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t);const n=e.target.closest(".task-list");n&&n.classList.add("is-dragging")}function Px(e){e.target.classList.remove("dragging"),document.querySelectorAll(".drag-over, .drag-over-bottom").forEach(n=>{n.classList.remove("drag-over","drag-over-bottom")});const t=document.querySelector(".task-list.is-dragging");t&&t.classList.remove("is-dragging"),r.draggedTaskId&&r.dragOverTaskId&&r.draggedTaskId!==r.dragOverTaskId&&Tp(r.draggedTaskId,r.dragOverTaskId,r.dragPosition),r.draggedTaskId=null,r.dragOverTaskId=null,r.dragPosition=null}function Nx(e,t){if(e.preventDefault(),e.dataTransfer.dropEffect="move",t===r.draggedTaskId)return;const n=e.target.closest(".task-item");if(!n)return;const a=n.getBoundingClientRect(),s=a.top+a.height/2,o=e.clientY<s?"top":"bottom";document.querySelectorAll(".drag-over, .drag-over-bottom").forEach(i=>{i.classList.remove("drag-over","drag-over-bottom")}),o==="top"?n.classList.add("drag-over"):n.classList.add("drag-over-bottom"),r.dragOverTaskId=t,r.dragPosition=o}function Lx(e){e.target.closest(".task-item")?.contains(e.relatedTarget)||e.target.closest(".task-item")?.classList.remove("drag-over","drag-over-bottom")}function _x(e,t){e.preventDefault()}function Tp(e,t,n){const a=r.tasksData.find(p=>p.id===e),s=r.tasksData.find(p=>p.id===t);if(!a||!s)return;const o=Rx(),i=o.map(p=>p.id),l=i.indexOf(e),d=i.indexOf(t);if(l===-1||d===-1)return;let c;if(n==="top")c=(((d>0?o[d-1]:null)?.order??s.order-1e3)+s.order)/2;else{const m=(d<o.length-1?o[d+1]:null)?.order??s.order+1e3;c=(s.order+m)/2}a.order=c,a.updatedAt=new Date().toISOString(),Ip(),O(),window.render()}function Ip(){["inbox","anytime","someday"].forEach(t=>{r.tasksData.filter(a=>a.status===t&&!a.completed).sort((a,s)=>(a.order??0)-(s.order??0)).forEach((a,s)=>{a.order=(s+1)*1e3})})}function Ox(){document.querySelectorAll(".draggable-item").forEach(e=>{e.dataset.dragInitialized||(e.dataset.dragInitialized="true",e.addEventListener("dragstart",function(t){const n=this.dataset.id,a=this.dataset.type;r.draggedSidebarItem=n,r.draggedSidebarType=a,this.classList.add("dragging"),t.dataTransfer.effectAllowed="move",t.dataTransfer.setData("text/plain",n)}),e.addEventListener("dragend",function(t){this.classList.remove("dragging"),document.querySelectorAll(".drag-over, .drag-over-bottom").forEach(n=>{n.classList.remove("drag-over","drag-over-bottom")}),r.draggedSidebarItem=null,r.draggedSidebarType=null,r.sidebarDragPosition=null}),e.addEventListener("dragover",function(t){if(t.preventDefault(),t.dataTransfer.dropEffect="move",this.classList.contains("dragging"))return;const n=this.getBoundingClientRect(),a=n.top+n.height/2,s=t.clientY<a?"top":"bottom";document.querySelectorAll(".drag-over, .drag-over-bottom").forEach(o=>{o.classList.remove("drag-over","drag-over-bottom")}),s==="top"?this.classList.add("drag-over"):this.classList.add("drag-over-bottom"),r.sidebarDragPosition=s}),e.addEventListener("dragleave",function(t){this.classList.remove("drag-over","drag-over-bottom")}),e.addEventListener("drop",function(t){t.preventDefault();const n=this.dataset.id,a=this.dataset.type;if(document.querySelectorAll(".drag-over, .drag-over-bottom").forEach(d=>{d.classList.remove("drag-over","drag-over-bottom")}),!r.draggedSidebarItem||r.draggedSidebarType!==a||r.draggedSidebarItem===n)return;let s;if(a==="area")s=r.taskAreas;else if(a==="label")s=r.taskLabels;else if(a==="person")s=r.taskPeople;else if(a==="perspective")s=r.customPerspectives;else return;const o=s.findIndex(d=>d.id===r.draggedSidebarItem);let i=s.findIndex(d=>d.id===n);if(o===-1||i===-1)return;r.sidebarDragPosition==="bottom"&&o<i||(r.sidebarDragPosition==="bottom"&&o>i?i+=1:r.sidebarDragPosition==="top"&&o>i||r.sidebarDragPosition==="top"&&o<i&&(i-=1));const[l]=s.splice(o,1);s.splice(i,0,l),O(),window.render()}))})}function Rx(){return window.getCurrentFilteredTasks()}const Bx=500,$d=8,Cd=60,Ed=8;let Ne=null,G=null,fe=null,nn=null,Dd=!1,xn=!1;function jx(){if(!jt())return;document.querySelectorAll(".touch-drag-clone, .touch-drag-indicator").forEach(t=>t.remove()),document.querySelectorAll(".task-list").forEach(t=>{t._touchDragInit||(t._touchDragInit=!0,t.addEventListener("touchstart",Wx,{passive:!0}),t.addEventListener("touchmove",Gx,{passive:!1}),t.addEventListener("touchend",Ad,{passive:!0}),t.addEventListener("touchcancel",Ad,{passive:!0}))}),Dd||(Dd=!0,document.addEventListener("visibilitychange",Fx),window.addEventListener("blur",es),document.addEventListener("contextmenu",es),document.addEventListener("click",Hx,!0))}function es(){clearTimeout(Ne),Ne=null,fe&&(Dp(fe.item),fe=null),G&&(cancelAnimationFrame(nn),nn=null,G.clone?.parentNode&&G.clone.remove(),G.item&&(G.item.style.opacity="",G.item.style.transition=""),ml(),G=null)}function $p(){return G!==null||fe!==null}function Cp(){Ne&&(clearTimeout(Ne),Ne=null)}function Fx(){document.visibilityState==="hidden"&&es()}function Hx(e){xn&&(xn=!1,e.stopPropagation(),e.preventDefault())}function Ep(e){return e.closest(".task-item")}function Wx(e){if(G||fe)return;const t=Ep(e.target);if(!t||e.target.closest("button, input, textarea, a, .swipe-action-btn"))return;const n=e.touches[0],a=n.clientX,s=n.clientY;t._touchStartX=a,t._touchStartY=s,Ne=setTimeout(()=>{Ne=null,Ux(t,a,s)},Bx)}function Gx(e){const t=e.touches[0];if(Ne){const s=Ep(e.target);if(s&&s._touchStartX!==void 0){const o=Math.abs(t.clientX-s._touchStartX),i=Math.abs(t.clientY-s._touchStartY);(o>$d||i>$d)&&(clearTimeout(Ne),Ne=null)}}if(fe&&!G){const s=Math.abs(t.clientX-fe.startX),o=Math.abs(t.clientY-fe.startY);if(s>5||o>5)zx(t.clientX,t.clientY);else return}if(!G)return;e.preventDefault();const n=t.clientY,a=t.clientX;G.clone.style.top=`${n-G.offsetY}px`,G.clone.style.left=`${a-G.offsetX}px`,G.lastY=n,qx(n),Kx(n)}function Ad(){if(clearTimeout(Ne),Ne=null,fe&&!G){const o=fe.item;if(Dp(o),fe=null,xn=!0,setTimeout(()=>{xn=!1},400),o){const i=yo(o);i&&Vx(i)}return}if(!G)return;cancelAnimationFrame(nn),nn=null;const e=G.lastY,t=Ap(e);let n="bottom";if(t){const o=t.getBoundingClientRect(),i=o.top+o.height/2;n=e<i?"top":"bottom"}const a=yo(G.item),s=t?yo(t):null;G.clone?.parentNode&&G.clone.remove(),G.item.style.opacity="",ml(),xn=!0,setTimeout(()=>{xn=!1},400),t&&t!==G.item&&a&&s&&typeof window.reorderTasks=="function"&&window.reorderTasks(a,s,n),G=null}function Ux(e,t,n){navigator.vibrate&&navigator.vibrate(10),fe={item:e,startX:t,startY:n},e.style.transition="transform 0.15s ease, box-shadow 0.15s ease",e.style.transform="scale(1.02)",e.style.boxShadow="0 4px 16px rgba(0,0,0,0.12)",e.style.zIndex="10",e.style.position="relative"}function Dp(e){e&&(e.style.transition="transform 0.15s ease, box-shadow 0.15s ease",e.style.transform="",e.style.boxShadow="",e.style.zIndex="",setTimeout(()=>{e.style.position="",e.style.transition=""},150))}function zx(e,t){if(!fe)return;const n=fe.item,a=fe.startX,s=fe.startY;n.style.transition="",n.style.transform="",n.style.boxShadow="",n.style.zIndex="",n.style.position="",fe=null;const o=n.getBoundingClientRect(),i=n.cloneNode(!0);i.className="touch-drag-clone",i.style.cssText=`
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
  `,document.body.appendChild(i),n.style.opacity="0.3",G={item:n,clone:i,offsetX:a-o.left,offsetY:s-o.top,container:n.closest(".task-list"),scrollable:n.closest(".main-content")||document.documentElement,lastY:t}}function Vx(e){const t=(window.state?.tasksData||[]).find(n=>n.id===e);!t||typeof window.showActionSheet!="function"||window.showActionSheet({title:t.title||"Task",items:[{label:"Edit",icon:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',handler:()=>{window.editingTaskId=e,window.showTaskModal=!0,window.render()}},{label:t.completed?"Uncomplete":"Complete",icon:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',handler:()=>{window.toggleTaskComplete(e)}},{label:t.flagged?"Unflag":"Flag",icon:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',handler:()=>{window.updateTask(e,{flagged:!t.flagged})}},{label:"Move to Today",icon:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',handler:()=>{window.moveTaskTo(e,"today")}},{label:"Delete",icon:'<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',destructive:!0,handler:()=>{window.confirmDeleteTask(e)}}]})}function yo(e){return e?.closest("[data-task-id]")?.dataset.taskId||e?.querySelector('[onclick*="editingTaskId"]')?.getAttribute("onclick")?.match(/'([^']+)'/)?.[1]}function qx(e){if(!G||!G.container)return;const t=G.scrollable;cancelAnimationFrame(nn);const n=()=>{if(!G)return;const a=G.container.getBoundingClientRect();e<a.top+Cd?(t.scrollTop-=Ed,nn=requestAnimationFrame(n)):e>a.bottom-Cd&&(t.scrollTop+=Ed,nn=requestAnimationFrame(n))};n()}function Ap(e){if(!G||!G.container)return null;const t=[...G.container.querySelectorAll(".task-item")];for(const n of t){if(n===G.item)continue;const a=n.getBoundingClientRect();if(e>=a.top&&e<=a.bottom)return n}return null}function Kx(e){ml();const t=Ap(e);if(!t)return;const n=t.getBoundingClientRect(),a=n.top+n.height/2,s=document.createElement("div");s.className="touch-drag-indicator",s.style.cssText=`
    position: fixed; left: ${n.left+16}px; right: ${window.innerWidth-n.right+16}px;
    height: 2px; background: var(--accent); border-radius: 1px;
    z-index: 999; pointer-events: none;
    top: ${e<a?n.top:n.bottom}px;
  `,document.body.appendChild(s)}function ml(){document.querySelectorAll(".touch-drag-indicator").forEach(e=>e.remove())}let Be=null,Mp=0,Pp=0,ts=0,rn=!1,Aa=!1;const fr=72,xr=152;function Np(e,t=!0){if(!e)return;t&&(e.style.transition="transform var(--duration-normal) var(--ease-spring)"),e.style.transform="translateX(0)",t&&setTimeout(()=>{e.style.transition=""},300);const n=e.closest(".swipe-row");n&&n.classList.remove("swipe-open-left","swipe-open-right")}function hl(){if(Be){const e=Be.querySelector(".swipe-row-content");Np(e),Be=null}}function Yx(){if(!jt())return;document.querySelectorAll(".task-list, .notes-list").forEach(t=>{t._swipeInit||(t._swipeInit=!0,t.addEventListener("touchstart",Jx,{passive:!0}),t.addEventListener("touchmove",Xx,{passive:!1}),t.addEventListener("touchend",Qx,{passive:!0}))})}function Lp(e){return e.closest(".swipe-row")}function Jx(e){const t=Lp(e.target);if(!t)return;Be&&Be!==t&&hl();const n=e.touches[0];Mp=n.clientX,Pp=n.clientY,ts=0,rn=!1,Aa=!1;const a=t.querySelector(".swipe-row-content");a&&(a.style.transition="")}function Xx(e){const t=Lp(e.target);if(!t)return;const n=e.touches[0],a=n.clientX-Mp,s=n.clientY-Pp;if($p())return;if(!rn&&!Aa){if(Math.abs(s)>10&&Math.abs(s)>Math.abs(a)){Aa=!0;return}if(Math.abs(a)>10&&Math.abs(a)>Math.abs(s))rn=!0,Be=t,Cp();else return}if(Aa||!rn)return;e.preventDefault();let o=a;if(Math.abs(o)>xr){const l=Math.abs(o)-xr;o=(o>0?1:-1)*(xr+l*.2)}ts=o;const i=t.querySelector(".swipe-row-content");i&&(i.style.transform=`translateX(${o}px)`),Math.abs(a)>=fr&&Math.abs(a)<fr+5&&navigator.vibrate&&navigator.vibrate(10),a<-fr?(t.classList.add("swipe-open-right"),t.classList.remove("swipe-open-left")):a>fr?(t.classList.add("swipe-open-left"),t.classList.remove("swipe-open-right")):t.classList.remove("swipe-open-left","swipe-open-right")}function Qx(e){if(!rn||!Be){rn=!1;return}const t=Be.querySelector(".swipe-row-content");if(rn=!1,Math.abs(ts)>=fr){const n=ts<0?-xr:xr;t&&(t.style.transition="transform var(--duration-normal) var(--ease-spring)",t.style.transform=`translateX(${n}px)`,setTimeout(()=>{t.style.transition=""},300))}else Np(t),Be=null}document.addEventListener("touchstart",e=>{Be&&!Be.contains(e.target)&&hl()},{passive:!0});const qt=60;let ma=!1,wo=0,Pe=0,ke=null,Md=!1;function Zx(){return ke||(ke=document.createElement("div"),ke.className="ptr-indicator",ke.innerHTML=`
    <svg class="ptr-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
    </svg>
  `,ke)}function e1(){return document.querySelector(".main-content")||document.querySelector("#app")}function t1(){const e=e1();!e||Md||!window.isTouchDevice||!window.isTouchDevice()||(Md=!0,e.style.overscrollBehaviorY="contain",e.addEventListener("touchstart",t=>{window.state?.activeTab==="home"&&(e.scrollTop>5||(ma=!0,wo=t.touches[0].clientY,Pe=0))},{passive:!0}),e.addEventListener("touchmove",t=>{if(!ma)return;const n=t.touches[0].clientY;if(Pe=Math.max(0,n-wo),Pe<=0)return;const a=Pe>qt?qt+(Pe-qt)*.3:Pe,s=Zx();if(!s.parentNode){const l=e.querySelector(".home-large-title")?.parentElement||e.firstElementChild;l&&l.parentNode.insertBefore(s,l)}const o=Math.min(Pe/qt,1);s.style.transform=`translateX(-50%) translateY(${a-40}px)`,s.style.opacity=o;const i=s.querySelector(".ptr-spinner");i&&(i.style.transform=`rotate(${o*360}deg)`),Pe>=qt&&Pe-(n-wo-Pe)<qt+5&&navigator.vibrate&&navigator.vibrate(20)},{passive:!0}),e.addEventListener("touchend",async()=>{if(ma){if(ma=!1,Pe>=qt){const t=ke;if(t){t.classList.add("ptr-refreshing");try{typeof window.loadCloudData=="function"&&await window.loadCloudData(),navigator.vibrate&&navigator.vibrate([10,30])}catch(n){console.error("PTR sync failed:",n),navigator.vibrate&&navigator.vibrate([10,50,10])}t&&(t.style.transition="transform 0.3s var(--ease-default), opacity 0.3s var(--ease-default)",t.style.transform="translateX(-50%) translateY(-40px)",t.style.opacity="0",setTimeout(()=>{t.remove(),t.classList.remove("ptr-refreshing"),t.style.transition=""},300))}}else ke&&(ke.style.transition="transform 0.2s var(--ease-default), opacity 0.2s var(--ease-default)",ke.style.transform="translateX(-50%) translateY(-40px)",ke.style.opacity="0",setTimeout(()=>{ke&&(ke.remove(),ke.style.transition="")},200));Pe=0}},{passive:!0}))}let gr=null;function n1({title:e,items:t,cancelLabel:n="Cancel"}){mr();const a=document.createElement("div");a.className="action-sheet-overlay",a.onclick=o=>{o.target===a&&mr()};const s=t.map((o,i)=>`
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
  `,document.body.appendChild(a),gr=a,a.querySelectorAll(".action-sheet-item[data-index]").forEach(o=>{o.addEventListener("click",()=>{const i=parseInt(o.dataset.index),l=t[i];l&&!l.disabled&&l.handler&&(navigator.vibrate&&navigator.vibrate(5),mr(),l.handler())})}),a.querySelector(".action-sheet-cancel-btn")?.addEventListener("click",mr),requestAnimationFrame(()=>{a.classList.add("action-sheet-visible")})}function mr(){if(!gr)return;const e=gr;e.classList.remove("action-sheet-visible"),e.classList.add("action-sheet-dismissing"),setTimeout(()=>{e.remove(),gr===e&&(gr=null)},350)}function _p(e,t){try{return localStorage.setItem(e,JSON.stringify(t)),!0}catch{return!1}}function vl(){typeof window.debouncedSaveToGithub=="function"&&window.debouncedSaveToGithub()}function oa(e){bl(),vl(),typeof window.render=="function"&&window.render(),e&&setTimeout(()=>{const t=document.querySelector(`[data-trigger-id="${e}"] .trigger-input`);t&&t.focus()},60)}function bl(){_p(Bt,r.triggers)}function Wn(){_p(Ud,[...r.collapsedTriggers])}function Ut(e,t){const n=e.triggerOrder||0,a=t.triggerOrder||0;return n!==a?n-a:e.createdAt&&t.createdAt?e.createdAt<t.createdAt?-1:1:0}function Vs(e){return e.length?Math.max(...e.map(t=>t.triggerOrder||0))+1e3:1e3}function ns(e,t){return t==null?(e||0)+1e3:Math.round(((e||0)+t)/2)}function yl(e){return r.triggers.filter(t=>t.parentId===e).sort(Ut)}function rs(e){return r.triggers.some(t=>t.parentId===e)}function Op(e){let t=0;return r.triggers.filter(a=>a.parentId===e).forEach(a=>{t++,t+=Op(a.id)}),t}function Rp(e,t){let n=r.triggers.find(a=>a.id===e);for(;n&&n.parentId;){if(n.parentId===t)return!0;n=r.triggers.find(a=>a.id===n.parentId)}return!1}function Bp(e){return e?typeof e=="string"?{areaId:e,categoryId:null}:{areaId:e.areaId||null,categoryId:e.categoryId||null}:{areaId:null,categoryId:null}}function r1(e){return{areaId:e.areaId,categoryId:e.categoryId}}function a1(e){const{areaId:t,categoryId:n}=Bp(e),a={};r.triggers.forEach(l=>{const d=l.parentId||"__root__";a[d]||(a[d]=[]),a[d].push(l)}),Object.values(a).forEach(l=>l.sort(Ut));const s=[],o=r.zoomedTriggerId||"__root__";function i(l,d){(a[l]||[]).forEach(p=>{t&&p.areaId!==t||n&&p.categoryId!==n||l==="__root__"&&p.parentId||(s.push(p),r.collapsedTriggers.has(p.id)||i(p.id))})}return i(o),s}function qs(e,t={}){const n={id:"trigger_"+Date.now()+"_"+Math.random().toString(36).slice(2,7),title:e||"",areaId:t.areaId||null,categoryId:t.categoryId||null,parentId:t.parentId||null,indent:t.indent||0,triggerOrder:t.triggerOrder||1e3,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};return r.triggers.push(n),oa(n.id),n}function s1(e){const{areaId:t,categoryId:n}=Bp(e);if(r.zoomedTriggerId)return Fp(r.zoomedTriggerId);const a=r.triggers.filter(s=>!s.parentId&&(t?s.areaId===t:!0)&&(n?s.categoryId===n:!0)).sort(Ut);return qs("",{areaId:t,categoryId:n,parentId:null,indent:0,triggerOrder:Vs(a)})}function jp(e){const t=r.triggers.find(i=>i.id===e);if(!t)return;const n=r.triggers.filter(i=>i.parentId===t.parentId&&i.areaId===t.areaId).sort(Ut),a=n.findIndex(i=>i.id===e),s=n[a+1],o=ns(t.triggerOrder,s?s.triggerOrder:null);return qs("",{areaId:t.areaId,categoryId:t.categoryId,parentId:t.parentId,indent:t.indent||0,triggerOrder:o})}function Fp(e){const t=r.triggers.find(a=>a.id===e);if(!t)return;const n=yl(e);return r.collapsedTriggers.has(e)&&(r.collapsedTriggers.delete(e),Wn()),qs("",{areaId:t.areaId,categoryId:t.categoryId,parentId:e,indent:(t.indent||0)+1,triggerOrder:Vs(n)})}function Hp(e,t){const n=r.triggers.findIndex(a=>a.id===e);n!==-1&&(r.triggers[n]={...r.triggers[n],...t,updatedAt:new Date().toISOString()},bl(),vl())}function Wp(e,t=!0){if(t){const n=new Set([e]);let a=!0;for(;a;)a=!1,r.triggers.forEach(s=>{s.parentId&&n.has(s.parentId)&&!n.has(s.id)&&(n.add(s.id),a=!0)});r.triggers=r.triggers.filter(s=>!n.has(s.id))}else{const n=r.triggers.find(a=>a.id===e);n&&r.triggers.forEach(a=>{a.parentId===e&&(a.parentId=n.parentId,a.indent=Math.max(0,(a.indent||0)-1))}),r.triggers=r.triggers.filter(a=>a.id!==e)}oa(null)}function Gp(e){const t=r.triggers.find(l=>l.id===e);if(!t)return;r1(t);const n=r.triggers.filter(l=>l.parentId===t.parentId&&l.areaId===t.areaId).sort(Ut),a=n.findIndex(l=>l.id===e);if(a<=0)return;const s=n[a-1];if((t.indent||0)>=5)return;const i=yl(s.id);t.parentId=s.id,t.indent=(s.indent||0)+1,t.triggerOrder=Vs(i),t.updatedAt=new Date().toISOString(),r.collapsedTriggers.has(s.id)&&(r.collapsedTriggers.delete(s.id),Wn()),oa(e)}function Up(e){const t=r.triggers.find(l=>l.id===e);if(!t||(t.indent||0)<=0)return;const n=t.parentId?r.triggers.find(l=>l.id===t.parentId):null,a=n&&n.parentId||null,s=r.triggers.filter(l=>l.parentId===a&&l.areaId===t.areaId).sort(Ut),o=n&&n.triggerOrder||0,i=s.find(l=>(l.triggerOrder||0)>o);t.triggerOrder=ns(o,i?i.triggerOrder:null),t.parentId=a,t.indent=Math.max(0,(t.indent||0)-1),t.updatedAt=new Date().toISOString(),oa(e)}function o1(e){r.collapsedTriggers.has(e)?r.collapsedTriggers.delete(e):r.collapsedTriggers.add(e),Wn(),typeof window.render=="function"&&window.render()}function zp(e){const t=r.triggers.find(s=>s.id===e);if(!t)return;const n=[];let a=t;for(;a;)n.unshift({id:a.id,title:a.title||"Untitled"}),a=a.parentId?r.triggers.find(s=>s.id===a.parentId):null;r.zoomedTriggerId=e,r.triggersBreadcrumb=n,typeof window.render=="function"&&window.render()}function Vp(){r.zoomedTriggerId=null,r.triggersBreadcrumb=[],typeof window.render=="function"&&window.render()}function i1(e){if(!e){Vp();return}zp(e)}function l1(e,t){const n=r.triggers.find(a=>a.id===t);if(n){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault(),jp(t);return}if(e.key==="Backspace"&&(e.target.textContent||"")===""){e.preventDefault();const o=r.triggers.filter(d=>d.parentId===n.parentId&&d.areaId===n.areaId).sort(Ut),i=o.findIndex(d=>d.id===t),l=i>0?o[i-1].id:null;Wp(t),l&&setTimeout(()=>{const d=document.querySelector(`[data-trigger-id="${l}"] .trigger-input`);d&&d.focus()},60);return}if(e.key==="ArrowUp"&&(e.metaKey||e.ctrlKey)){e.preventDefault(),rs(t)&&!r.collapsedTriggers.has(t)&&(r.collapsedTriggers.add(t),Wn(),typeof window.render=="function"&&window.render(),setTimeout(()=>{const a=document.querySelector(`[data-trigger-id="${t}"] .trigger-input`);a&&a.focus()},30));return}if(e.key==="ArrowDown"&&(e.metaKey||e.ctrlKey)){e.preventDefault(),rs(t)&&r.collapsedTriggers.has(t)&&(r.collapsedTriggers.delete(t),Wn(),typeof window.render=="function"&&window.render(),setTimeout(()=>{const a=document.querySelector(`[data-trigger-id="${t}"] .trigger-input`);a&&a.focus()},30));return}if(e.key==="Tab"){e.preventDefault(),e.shiftKey?Up(t):Gp(t);return}}}function d1(e,t){const n=e.target.textContent||"";Hp(t,{title:n})}function c1(e,t){if(!r.triggers.find(s=>s.id===t))return;(e.target.textContent||"")===""&&!rs(t)&&(r.triggers=r.triggers.filter(s=>s.id!==t),bl(),vl())}function u1(e,t){r._draggedTriggerId=t,e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t),e.target.closest(".trigger-item")?.classList.add("dragging")}function qp(e){r._draggedTriggerId=null,document.querySelectorAll(".trigger-item.dragging").forEach(t=>t.classList.remove("dragging")),document.querySelectorAll(".trigger-item.drag-over-top, .trigger-item.drag-over-bottom, .trigger-item.drag-over-child").forEach(t=>{t.classList.remove("drag-over-top","drag-over-bottom","drag-over-child")})}function p1(e,t){if(e.preventDefault(),r._draggedTriggerId===t||Rp(t,r._draggedTriggerId))return;const n=e.target.closest(".trigger-item");if(!n)return;const a=n.getBoundingClientRect(),s=e.clientY-a.top,o=a.height;n.classList.remove("drag-over-top","drag-over-bottom","drag-over-child"),s<o*.25?n.classList.add("drag-over-top"):s>o*.75?n.classList.add("drag-over-bottom"):n.classList.add("drag-over-child")}function f1(e){const t=e.target.closest(".trigger-item");t&&t.classList.remove("drag-over-top","drag-over-bottom","drag-over-child")}function g1(e){e.preventDefault();const t=e.target.closest(".trigger-item");if(!t)return;const n=t.dataset.triggerId,a=r._draggedTriggerId;if(!a||a===n||Rp(n,a))return;const s=t.getBoundingClientRect(),o=e.clientY-s.top,i=s.height;let l=o<i*.25?"top":o>i*.75?"bottom":"child";Kp(a,n,l),qp()}function Kp(e,t,n){const a=r.triggers.find(o=>o.id===e),s=r.triggers.find(o=>o.id===t);if(!(!a||!s)){if(n==="child"){const o=yl(t);a.parentId=t,a.indent=(s.indent||0)+1,a.triggerOrder=Vs(o),r.collapsedTriggers.has(t)&&(r.collapsedTriggers.delete(t),Wn())}else{a.parentId=s.parentId,a.indent=s.indent||0,a.areaId=s.areaId,a.categoryId=s.categoryId;const o=r.triggers.filter(l=>l.parentId===s.parentId&&l.id!==e&&l.areaId===s.areaId).sort(Ut),i=o.findIndex(l=>l.id===t);if(n==="top"){const l=i>0?o[i-1]:null;a.triggerOrder=ns(l?l.triggerOrder:0,s.triggerOrder)}else{const l=i<o.length-1?o[i+1]:null;a.triggerOrder=ns(s.triggerOrder,l?l.triggerOrder:null)}}a.updatedAt=new Date().toISOString(),oa(null)}}function m1(){return!r.zoomedTriggerId||r.triggersBreadcrumb.length===0?"":`
    <div class="px-4 py-2 flex items-center gap-1.5 text-xs border-b border-[var(--border-light)]">
      <button onclick="navigateToTriggerBreadcrumb(null)" class="text-[var(--accent)] hover:underline">Triggers</button>
      ${r.triggersBreadcrumb.map((e,t)=>`
        <span class="text-[var(--text-muted)]">/</span>
        ${t===r.triggersBreadcrumb.length-1?`<span class="text-[var(--text-primary)] font-medium">${v(e.title)}</span>`:`<button onclick="navigateToTriggerBreadcrumb('${e.id}')" class="text-[var(--accent)] hover:underline">${v(e.title)}</button>`}
      `).join("")}
    </div>
  `}function Yp(e){const t=rs(e.id),n=r.collapsedTriggers.has(e.id),a=t&&n?Op(e.id):0,s=jt();return`
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
          >${v(e.title||"")}</div>
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
  `}function Jp(e=null){const t=a1(e);return t.length===0&&!r.zoomedTriggerId?`
      <div class="text-center py-8 text-[var(--text-muted)]">
        <p class="text-sm font-medium mb-1">No triggers yet</p>
        <p class="text-xs text-[var(--text-muted)] mb-3">Add prompts to spark your GTD review</p>
      </div>
    `:t.length===0&&r.zoomedTriggerId?`
      <div class="text-center py-8 text-[var(--text-muted)]">
        <p class="text-sm font-medium mb-1">No sub-triggers</p>
        <p class="text-xs text-[var(--text-muted)]">Press Enter to create one</p>
      </div>
    `:t.map(n=>Yp(n)).join("")}function h1(e){return r.triggers.filter(t=>t.areaId===e).length}const v1=7;function Xp(e){if(e.completed||e.isNote||e.status==="someday"||!e.areaId)return!1;if(!e.lastReviewedAt)return!0;const t=new Date(e.lastReviewedAt),n=new Date;return n.setDate(n.getDate()-v1),t<n}function wl(e){return r.tasksData.filter(t=>t.areaId===e&&Xp(t))}function b1(){return r.tasksData.filter(e=>Xp(e)).length}function y1(){if(!r.lastWeeklyReview)return!0;const e=new Date(r.lastWeeklyReview);return Math.floor((new Date-e)/(1e3*60*60*24))>=7}function w1(){if(!r.lastWeeklyReview)return null;const e=new Date(r.lastWeeklyReview);return Math.floor((new Date-e)/(1e3*60*60*24))}function x1(){r.reviewMode=!0,r.reviewAreaIndex=0,r.reviewCompletedAreas=[],r.reviewTriggersCollapsed=!1,r.reviewProjectsCollapsed=!1,r.reviewNotesCollapsed=!1,typeof window.render=="function"&&window.render()}function k1(){if(r.reviewCompletedAreas.length===r.taskAreas.length){const t=new Date().toISOString();r.lastWeeklyReview=t,localStorage.setItem("nucleusLastWeeklyReview",t)}r.reviewMode=!1,r.reviewAreaIndex=0,r.reviewCompletedAreas=[],typeof window.render=="function"&&window.render()}function Qp(){const e=r.taskAreas;r.reviewAreaIndex<e.length-1&&r.reviewAreaIndex++,typeof window.render=="function"&&window.render()}function S1(){r.reviewAreaIndex>0&&r.reviewAreaIndex--,typeof window.render=="function"&&window.render()}function T1(e){const t=r.tasksData.find(n=>n.id===e);t&&(t.lastReviewedAt=new Date().toISOString(),t.updatedAt=new Date().toISOString(),O()),r.editingTaskId=e,r.showTaskModal=!0,typeof window.render=="function"&&window.render()}function I1(e){const t=r.tasksData.find(n=>n.id===e);t&&(t.lastReviewedAt=new Date().toISOString(),t.updatedAt=new Date().toISOString(),O()),typeof window.render=="function"&&window.render()}function $1(){const t=r.taskAreas[r.reviewAreaIndex];t&&!r.reviewCompletedAreas.includes(t.id)&&r.reviewCompletedAreas.push(t.id);const n=wl(t.id);n.forEach(a=>{a.lastReviewedAt=new Date().toISOString(),a.updatedAt=new Date().toISOString()}),n.length>0&&O(),Qp()}function C1(e,t="anytime",n=!1){r.editingTaskId=null,r.newTaskContext={areaId:e,categoryId:null,labelId:null,labelIds:null,personId:null,status:t,today:n},r.showTaskModal=!0,typeof window.render=="function"&&window.render(),setTimeout(()=>{const a=document.getElementById("task-title");a&&a.focus()},50)}function Zp(e,t,n){const a=t?.value?.trim();if(!a)return;const s={areaId:e,status:n?"anytime":"inbox",isNote:!!n},o=r.inlineAutocompleteMeta.get("review-quick-add-input");o&&(o.labels?.length&&(s.labels=o.labels),o.people?.length&&(s.people=o.people),o.deferDate&&(s.deferDate=o.deferDate),o.dueDate&&(s.dueDate=o.dueDate)),tr(a,s),t.value="",window.cleanupInlineAutocomplete?.("review-quick-add-input"),typeof window.render=="function"&&window.render(),setTimeout(()=>{const i=document.getElementById("review-quick-add-input");i&&i.focus()},50)}function E1(e,t,n){e._inlineAcHandled||e.key==="Enter"&&(e.preventDefault(),Zp(n,t,r.quickAddIsNote))}function ef(){const e=r.taskAreas.filter(Boolean);if(e.length===0)return`
      <div class="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
        <div class="w-16 h-16 rounded-xl flex items-center justify-center mb-4 bg-[var(--bg-secondary)]">
          ${V().review}
        </div>
        <p class="text-lg font-medium mb-1">No areas to review</p>
        <p class="text-sm">Create areas in your workspace first</p>
        <button onclick="exitReview()" class="mt-4 px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition">
          Exit Review
        </button>
      </div>
    `;const t=e[r.reviewAreaIndex];if(!t)return r.reviewAreaIndex=0,ef();const n=r.reviewCompletedAreas.length,a=e.length,s=r.reviewCompletedAreas.includes(t.id),o=r.triggers.filter(m=>m.areaId===t.id),i=wl(t.id),l=r.tasksData.filter(m=>m.areaId===t.id&&m.isProject&&!m.completed),d=r.tasksData.filter(m=>m.isNote&&m.areaId===t.id&&!m.completed&&m.noteLifecycleState!=="deleted");function c(m){if(!m)return"Never reviewed";const u=Date.now()-new Date(m).getTime(),h=Math.floor(u/(1e3*60*60*24));return h===0?"Today":h===1?"Yesterday":`${h} days ago`}const p=t.color||"#147EFB";return`
    <div class="review-mode review-mode-scrollable">
      <!-- Compact header: Review title + progress + area -->
      <div class="review-header-compact mb-5">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 flex items-center justify-center rounded-lg" style="background: ${p}15; color: ${p}">
              ${V().review}
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
            <span class="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style="background: ${p}15">
              ${t.emoji||V().area.replace("w-5 h-5","w-5 h-5")}
            </span>
            <div class="min-w-0">
              <h3 class="text-base font-bold text-[var(--text-primary)] truncate">${v(t.name)}</h3>
              <p class="text-xs text-[var(--text-muted)]">${l.length} projects · ${o.length} triggers · ${i.length} tasks · ${d.length} notes</p>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            ${r.reviewAreaIndex>0?'<button onclick="reviewPrevArea()" class="p-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition" aria-label="Previous area"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg></button>':""}
            ${r.reviewAreaIndex<e.length-1?'<button onclick="reviewNextArea()" class="p-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition" aria-label="Next area"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg></button>':""}
          </div>
        </div>
        <div class="flex gap-1.5 mt-3">
          ${e.map((m,u)=>`
            <button onclick="state.reviewAreaIndex=${u}; render()"
              class="review-progress-dot w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center transition flex-shrink-0
                ${r.reviewCompletedAreas.includes(m.id)?"bg-[var(--success)] text-white":u===r.reviewAreaIndex?"ring-2 ring-offset-1":"bg-[var(--bg-secondary)] text-[var(--text-muted)]"}"
              style="${u===r.reviewAreaIndex?`ring-color: ${m.color||"#147EFB"}; background: ${m.color||"#147EFB"}20; color: ${m.color||"#147EFB"}`:""}"
              title="${v(m.name)}">
              ${r.reviewCompletedAreas.includes(m.id)?'<svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>':`${u+1}`}
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
              class="flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition min-h-[44px] flex items-center justify-center border-0" style="background: ${p}15; color: ${p}" title="Add">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </button>
          </div>
          <button onclick="window.createRootTrigger({areaId:'${t.id}'})"
            class="review-capture-trigger-btn flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium min-h-[44px] transition" style="background: #FFCC0015; color: #B8860B" title="Add trigger">
            <span style="color: #FFCC00">${V().trigger.replace("w-5 h-5","w-4 h-4")}</span>
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
                ${i.map(m=>`
                  <div class="review-task-card px-4 py-3">
                    <div class="flex items-start gap-3">
                      <span class="w-5 h-5 mt-0.5 rounded-full border-2 flex-shrink-0" style="border-color: ${p}40"></span>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-[var(--text-primary)] truncate">${v(m.title||"Untitled")}</p>
                        <p class="text-xs text-[var(--text-muted)] mt-0.5">${c(m.lastReviewedAt)}</p>
                      </div>
                      <div class="flex items-center gap-2 flex-shrink-0">
                        <button onclick="reviewEngageTask('${m.id}')"
                          class="review-action-btn px-3 py-2 min-h-[44px] text-xs font-medium rounded-lg transition" style="background: ${p}15; color: ${p}">
                          Open
                        </button>
                        <button onclick="reviewPassTask('${m.id}')"
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
            ${Sp({areaId:t.id})}
          </div>
          `}
        </div>

        <!-- Triggers (full width, expanded, takes remaining space) -->
        <div class="review-triggers-section">
          <div class="rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] overflow-hidden flex flex-col flex-1 min-h-0">
            <button onclick="state.reviewTriggersCollapsed = !state.reviewTriggersCollapsed; render()"
              class="w-full px-4 py-2 flex items-center justify-between text-left hover:bg-[var(--bg-secondary)]/30 transition flex-shrink-0" style="background: #FFCC0008">
              <div class="flex items-center gap-2">
                <span style="color: #FFCC00">${V().trigger.replace("w-5 h-5","w-4 h-4")}</span>
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
              ${Jp({areaId:t.id})}
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
            ${l.map(m=>{const u=window.getProjectCompletion?.(m.id)||0,h=window.getProjectSubTasks?.(m.id)?.length||0,g=window.isProjectStalled?.(m.id)||!1;return`
                <div class="px-4 py-3 hover:bg-[var(--bg-secondary)]/30 transition cursor-pointer" onclick="reviewEngageTask('${m.id}')">
                  <div class="flex items-start gap-3">
                    <span class="w-5 h-5 mt-0.5 text-lg flex-shrink-0">📋</span>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <p class="text-sm font-medium text-[var(--text-primary)] truncate">${v(m.title||"Untitled Project")}</p>
                        ${g?'<span class="px-1.5 py-0.5 bg-[var(--warning)]/15 text-[var(--warning)] text-[10px] font-medium rounded">Stalled</span>':""}
                      </div>
                      <div class="flex items-center gap-2">
                        <div class="flex-1 h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                          <div class="h-full rounded-full transition-all" style="width: ${u}%; background: ${p}"></div>
                        </div>
                        <span class="text-xs text-[var(--text-muted)] tabular-nums">${u}%</span>
                      </div>
                      <p class="text-xs text-[var(--text-muted)] mt-1">${h} ${h===1?"task":"tasks"} · ${m.projectType==="sequential"?"📝 Sequential":"📋 Parallel"}</p>
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
            class="review-mark-done-btn px-6 py-3 rounded-lg text-base font-semibold text-white shadow-sm hover:opacity-90 transition" style="background: ${p}">
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
  `}function D1(e){if(!e)return;const t=mn();(!t.customPerspectives||typeof t.customPerspectives!="object")&&(t.customPerspectives={}),t.customPerspectives[String(e)]=new Date().toISOString(),hn()}function A1(e){if(!e)return;const t=mn();t.customPerspectives&&t.customPerspectives[String(e)]!==void 0&&(delete t.customPerspectives[String(e)],hn())}function tf(e,t,n){const a=new Date().toISOString(),s={id:Gr("custom"),name:e,icon:t||"📌",filter:n,builtin:!1,createdAt:a,updatedAt:a};return A1(s.id),r.customPerspectives.push(s),O(),s}function M1(e){D1(e),r.customPerspectives=r.customPerspectives.filter(t=>t.id!==e),r.activePerspective===e&&(r.activePerspective="inbox",De()),O()}function P1(e){r.editingPerspectiveId=e,r.showPerspectiveModal=!0,window.render(),setTimeout(()=>{const t=r.customPerspectives.find(o=>o.id===e);if(!t)return;const n=o=>document.getElementById(o),a=(o,i)=>{const l=n(o);l&&(l.value=i)},s=o=>{const i=n(o);i&&(i.checked=!0)};a("perspective-name",t.name),a("perspective-icon",t.icon),t.filter.categoryId&&a("perspective-category",t.filter.categoryId),t.filter.status&&a("perspective-status",t.filter.status),t.filter.logic&&a("perspective-logic",t.filter.logic),t.filter.availability&&a("perspective-availability",t.filter.availability),t.filter.statusRule&&a("perspective-status-rule",t.filter.statusRule),t.filter.personId&&a("perspective-person",t.filter.personId),t.filter.tagMatch&&a("perspective-tags-mode",t.filter.tagMatch),t.filter.hasDueDate&&s("perspective-due"),t.filter.hasDeferDate&&s("perspective-defer"),t.filter.isRepeating&&s("perspective-repeat"),t.filter.isUntagged&&s("perspective-untagged"),t.filter.inboxOnly&&s("perspective-inbox"),t.filter.dateRange&&(t.filter.dateRange.type&&a("perspective-range-type",t.filter.dateRange.type),t.filter.dateRange.start&&a("perspective-range-start",t.filter.dateRange.start),t.filter.dateRange.end&&a("perspective-range-end",t.filter.dateRange.end)),t.filter.searchTerms&&a("perspective-search",t.filter.searchTerms),t.filter.labelIds&&t.filter.labelIds.forEach(o=>{const i=document.querySelector(`.perspective-tag-checkbox[value="${o}"]`);i&&(i.checked=!0)})},10)}function N1(e){if(!e)return;const t=mn();(!t.homeWidgets||typeof t.homeWidgets!="object")&&(t.homeWidgets={}),t.homeWidgets[String(e)]=new Date().toISOString(),hn()}function L1(e){if(!e)return;const t=mn();t.homeWidgets&&t.homeWidgets[String(e)]!==void 0&&(delete t.homeWidgets[String(e)],hn())}function yt(){try{localStorage.setItem(bt,JSON.stringify(r.homeWidgets))}catch(e){e.name==="QuotaExceededError"&&console.error("Storage quota exceeded for homeWidgets")}typeof window.debouncedSaveToGithub=="function"&&window.debouncedSaveToGithub()}function Pd(){const e=new Map(Ra.map(a=>[a.id,a])),t=new Map((r.homeWidgets||[]).map(a=>[a.id,a])),n=[];Ra.forEach((a,s)=>{const o=t.get(a.id);n.push({...a,...o,visible:o?.visible??a.visible,order:o?.order??s})}),(r.homeWidgets||[]).forEach(a=>{!e.has(a.id)&&a.id!=="daily-entry"&&n.push(a)}),n.sort((a,s)=>(a.order??0)-(s.order??0)),n.forEach((a,s)=>{a.order=s}),r.homeWidgets=n,yt()}function _1(e){const t=r.homeWidgets.find(n=>n.id===e);if(t){if((t.id==="today-tasks"||t.id==="todays-score")&&t.visible)return;t.visible=!t.visible,yt(),window.render()}}function O1(e){const t=r.homeWidgets.find(n=>n.id===e);t&&(t.size=t.size==="full"?"half":"full",yt(),window.render())}function R1(e){const t=r.homeWidgets.findIndex(n=>n.id===e);t>0&&([r.homeWidgets[t],r.homeWidgets[t-1]]=[r.homeWidgets[t-1],r.homeWidgets[t]],r.homeWidgets.forEach((n,a)=>n.order=a),yt(),window.render())}function B1(e){const t=r.homeWidgets.findIndex(n=>n.id===e);t<r.homeWidgets.length-1&&([r.homeWidgets[t],r.homeWidgets[t+1]]=[r.homeWidgets[t+1],r.homeWidgets[t]],r.homeWidgets.forEach((n,a)=>n.order=a),yt(),window.render())}function j1(e,t){r.draggingWidgetId=t,e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",t),e.target.classList.add("dragging")}function F1(e){e.target.classList.remove("dragging"),document.querySelectorAll(".widget").forEach(t=>t.classList.remove("drag-over")),r.draggingWidgetId=null}function H1(e,t){e.preventDefault(),e.dataTransfer.dropEffect="move",!(!r.draggingWidgetId||r.draggingWidgetId===t)&&(document.querySelectorAll(".widget").forEach(n=>n.classList.remove("drag-over")),e.currentTarget.classList.add("drag-over"))}function W1(e){e.currentTarget.contains(e.relatedTarget)||e.currentTarget.classList.remove("drag-over")}function G1(e,t){if(e.preventDefault(),e.currentTarget.classList.remove("drag-over"),!r.draggingWidgetId||r.draggingWidgetId===t){r.draggingWidgetId=null;return}const n=r.homeWidgets.findIndex(s=>s.id===r.draggingWidgetId),a=r.homeWidgets.findIndex(s=>s.id===t);if(n!==-1&&a!==-1){const[s]=r.homeWidgets.splice(n,1),o=n<a?a-1:a;r.homeWidgets.splice(o,0,s),r.homeWidgets.forEach((i,l)=>i.order=l),yt(),window.render()}r.draggingWidgetId=null}function U1(){r.homeWidgets=JSON.parse(JSON.stringify(Ra)),localStorage.removeItem(bt),yt(),window.render()}function z1(){r.editingHomeWidgets=!r.editingHomeWidgets,r.editingHomeWidgets||(r.showAddWidgetPicker=!1),window.render()}function V1(e){if(r.homeWidgets.some(s=>s.id==="perspective-"+e))return;const n=[...Ee,ze,...r.customPerspectives||[]].find(s=>s.id===e);if(!n)return;const a=r.homeWidgets.reduce((s,o)=>Math.max(s,o.order??0),-1);r.homeWidgets.push({id:"perspective-"+e,type:"perspective",title:n.name,perspectiveId:e,size:"half",order:a+1,visible:!0}),L1("perspective-"+e),yt(),r.showAddWidgetPicker=!1,window.render()}function q1(e){N1(e),r.homeWidgets=r.homeWidgets.filter(t=>t.id!==e),r.homeWidgets.sort((t,n)=>(t.order??0)-(n.order??0)),r.homeWidgets.forEach((t,n)=>{t.order=n}),yt(),window.render()}function At(e){const t=new Date(r.calendarSelectedDate+"T12:00:00");t.setDate(t.getDate()+e);const n=`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;r.calendarSelectedDate=n,r.calendarMonth=t.getMonth(),r.calendarYear=t.getFullYear()}function K1(){if(r.calendarViewMode==="week"){At(-7),window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render();return}if(r.calendarViewMode==="weekgrid"){At(-7),window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render();return}if(r.calendarViewMode==="daygrid"){At(-1),window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render();return}if(r.calendarViewMode==="3days"){At(-3),window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render();return}r.calendarMonth--,r.calendarMonth<0&&(r.calendarMonth=11,r.calendarYear--),window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render()}function Y1(){if(r.calendarViewMode==="week"){At(7),window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render();return}if(r.calendarViewMode==="weekgrid"){At(7),window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render();return}if(r.calendarViewMode==="daygrid"){At(1),window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render();return}if(r.calendarViewMode==="3days"){At(3),window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render();return}r.calendarMonth++,r.calendarMonth>11&&(r.calendarMonth=0,r.calendarYear++),window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render()}function J1(){const e=new Date;r.calendarMonth=e.getMonth(),r.calendarYear=e.getFullYear(),r.calendarSelectedDate=U(),window.render()}function X1(e){["month","week","3days","daygrid","weekgrid"].includes(e)&&(r.calendarViewMode=e,window.isGCalConnected?.()&&window.syncGCalNow?.(),window.render())}function Q1(e){if(!/^\d{4}-\d{2}-\d{2}$/.test(e))return;r.calendarSelectedDate=e;const t=e.split("-"),n=parseInt(t[0]),a=parseInt(t[1])-1;(n!==r.calendarYear||a!==r.calendarMonth)&&(r.calendarYear=n,r.calendarMonth=a),window.render()}function Ma(e){return r.tasksData.filter(t=>t.completed||t.isNote?!1:t.dueDate===e||t.deferDate===e)}function Z1(){r.calendarSidebarCollapsed=!r.calendarSidebarCollapsed,window.render()}function zt(){return localStorage.getItem($r)||""}function e0(e){const t=(e||"").trim();t?localStorage.setItem($r,t):localStorage.removeItem($r)}async function t0(e){const t=(e||"").trim();if(!t)return"";const n=zt();if(!n)return t;const a=new AbortController,s=setTimeout(()=>a.abort(),2e4);try{const o=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":n,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:1024,system:"You clean up speech-to-text output for a productivity app. Fix punctuation/casing and preserve the original meaning. Return only cleaned plain text.",messages:[{role:"user",content:t}]}),signal:a.signal});return clearTimeout(s),o.ok&&((await o.json())?.content?.[0]?.text||"").trim()||t}catch{return clearTimeout(s),t}}async function n0(e){const t=zt();if(!t)throw new Error("No API key configured");const n=r.taskAreas.map(d=>d.name),a=r.taskLabels.map(d=>d.name),s=r.taskPeople.map(d=>d.name),o=`You are a classification assistant for a personal productivity app. Your job is to take raw freeform text and split it into individual items, then classify each as a task OR a note.

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
]`,i=new AbortController,l=setTimeout(()=>i.abort(),3e4);try{const d=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":t,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:4096,system:o,messages:[{role:"user",content:e}]}),signal:i.signal});if(clearTimeout(l),!d.ok){const g=await d.text().catch(()=>"");throw new Error(`API error ${d.status}: ${g}`)}let m=((await d.json()).content?.[0]?.text||"").trim();m.startsWith("```")&&(m=m.replace(/^```(?:json)?\s*/,"").replace(/\s*```$/,""));const u=JSON.parse(m);if(!Array.isArray(u))throw new Error("Response is not an array");const h=g=>typeof g=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(g);return u.filter(g=>(g.title||"").trim()).map((g,b)=>{let y=null;if(g.area){const k=r.taskAreas.find(T=>T.name.toLowerCase()===g.area.toLowerCase());k&&(y=k.id)}const f=(g.tags||[]).map(k=>{const T=r.taskLabels.find(E=>E.name.toLowerCase()===k.toLowerCase());return T?T.id:null}).filter(Boolean),x=(g.people||[]).map(k=>{const T=r.taskPeople.find(E=>E.name.toLowerCase()===k.toLowerCase());return T?T.id:null}).filter(Boolean);return{index:b,originalText:g.title||"",title:g.title||"",type:g.type==="note"?"note":"task",score:g.type==="task"?50:-50,confidence:Math.max(0,Math.min(1,g.confidence||.8)),areaId:y,labels:f,people:x,deferDate:h(g.deferDate)?g.deferDate:null,dueDate:h(g.dueDate)?g.dueDate:null,included:!0}})}catch(d){throw clearTimeout(l),d.name==="AbortError"?new Error("Classification timed out — try shorter text or check your connection"):d}}function r0(e){if(!e||!e.trim())return[];const t=e.split(`
`),n=[];for(const a of t){let s=a.replace(/^\s*[-*•‣◦]\s+/,"").replace(/^\s*\d+[.)]\s+/,"").trim();s&&n.push(s)}return n}function a0(e){let t=0;const a=e.toLowerCase().split(/\s+/),s=a[0]||"";Rl.includes(s)&&(t+=40),(/\b(by\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next|end\s+of))\b/i.test(e)||/\b(due|deadline|before)\b/i.test(e))&&(t+=30),/\b(need\s+to|must|have\s+to|should)\b/i.test(e)&&(t+=25),/!\w/.test(e)&&(t+=35),a.length<=12&&!e.includes("?")&&Rl.includes(s)&&(t+=20),/&\w/.test(e)&&(t+=15),/\b(today|tonight|this\s+(week|morning|afternoon|evening)|asap|urgently)\b/i.test(e)&&(t+=10),/^#\w|[\s]#\w/.test(e)&&(t+=10),/^@\w|[\s]@\w/.test(e)&&(t+=10),/^(note|idea|thought|remember|observation|insight|reflection):/i.test(e)&&(t-=50),/\b(missed|forgot|forgotten|didn't|didn't|wasn't|wasn't|couldn't|couldn't|had\s+a|went\s+to|was\s+\w+ing|felt\s+|noticed\s+|realized\s+|found\s+out)\b/i.test(e)&&(t-=35),/^i\s+(missed|forgot|had|was|went|felt|saw|heard|met|got|did|made|took|came|ran|ate|slept)\b/i.test(e)&&(t-=30),/\.\s+[A-Z]/.test(e)&&(t-=30),/\b(i\s+think|i\s+feel|i\s+wonder|perhaps|maybe|it\s+seems|i\s+believe|in\s+my\s+opinion)\b/i.test(e)&&(t-=25),e.trim().endsWith("?")&&(t-=20),/^(the|a|an|this|that|these|those)\s/i.test(e)&&(t-=15),/^https?:\/\/\S+$/i.test(e.trim())&&(t-=40),/^["'"'\u201C\u2018]/.test(e.trim())&&(t-=30);const o=t>0?"task":"note",i=Math.min(1,Math.abs(t)/60);return{type:o,score:t,confidence:i}}function s0(e){let t=e,n=null;const a=[],s=[];let o=null,i=null;const l=t.match(/#(\w+)/g);if(l)for(const u of l){const h=u.slice(1).toLowerCase(),g=r.taskAreas.find(b=>b.name.toLowerCase()===h);g&&(n=g.id,t=t.replace(u,"").trim())}const d=t.match(/@(\w+)/g);if(d)for(const u of d){const h=u.slice(1).toLowerCase(),g=r.taskLabels.find(b=>b.name.toLowerCase()===h);g&&!a.includes(g.id)&&(a.push(g.id),t=t.replace(u,"").trim())}const c=t.match(/&(\w+)/g);if(c)for(const u of c){const h=u.slice(1).toLowerCase(),g=r.taskPeople.find(b=>b.name.toLowerCase()===h);g&&!s.includes(g.id)&&(s.push(g.id),t=t.replace(u,"").trim())}const p=t.match(/!(\w+)/g);if(p&&typeof window.parseDateQuery=="function")for(const u of p){const h=u.slice(1),g=window.parseDateQuery(h);if(g&&g.length>0){o=g[0].date,t=t.replace(u,"").trim();break}}const m=[{regex:/\b(tomorrow)\b/i,query:"tomorrow"},{regex:/\b(today)\b/i,query:"today"},{regex:/\bnext\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,query:null},{regex:/\bby\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,query:null}];if(!o&&typeof window.parseDateQuery=="function")for(const{regex:u,query:h}of m){const g=t.match(u);if(g){const b=h||g[1],y=window.parseDateQuery(b);if(y&&y.length>0){i=y[0].date;break}}}return t=t.replace(/\s{2,}/g," ").trim(),{title:t,areaId:n,labels:a,people:s,deferDate:o,dueDate:i}}function oi(e){return r0(e).map((n,a)=>{const s=a0(n),o=s0(n);return{index:a,originalText:n,title:o.title,type:s.type,score:s.score,confidence:s.confidence,areaId:o.areaId,labels:o.labels,people:o.people,deferDate:o.deferDate,dueDate:o.dueDate,included:!0}})}async function nf(e){if(r.braindumpAIError=null,!zt())return oi(e);try{const t=await n0(e);if(t&&t.length>0)return t;r.braindumpAIError="AI returned empty results"}catch(t){console.warn("AI classification failed, falling back to heuristic:",t.message),r.braindumpAIError=t.message}return oi(e)}function rf(e){let t=0,n=0;const a=e.filter(s=>s.included);for(const s of a){const o=s.type==="note",i=tr(s.title,{isNote:o,areaId:s.areaId,labels:s.labels,people:s.people,deferDate:s.deferDate,dueDate:s.dueDate,status:s.areaId?"anytime":"inbox"});o&&i&&(i.noteLifecycleState="active",i.noteHistory=[{action:"created",source:"braindump",at:i.createdAt}]),o?n++:t++}return{taskCount:t,noteCount:n}}const o0="modulepreload",i0=function(e){return"/lifeg/"+e},Nd={},l0=function(t,n,a){let s=Promise.resolve();if(n&&n.length>0){let d=function(c){return Promise.all(c.map(p=>Promise.resolve(p).then(m=>({status:"fulfilled",value:m}),m=>({status:"rejected",reason:m}))))};document.getElementsByTagName("link");const i=document.querySelector("meta[property=csp-nonce]"),l=i?.nonce||i?.getAttribute("nonce");s=d(n.map(c=>{if(c=i0(c),c in Nd)return;Nd[c]=!0;const p=c.endsWith(".css"),m=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${m}`))return;const u=document.createElement("link");if(u.rel=p?"stylesheet":o0,p||(u.as="script"),u.crossOrigin="",u.href=c,l&&u.setAttribute("nonce",l),document.head.appendChild(u),p)return new Promise((h,g)=>{u.addEventListener("load",h),u.addEventListener("error",()=>g(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(i){const l=new Event("vite:preloadError",{cancelable:!0});if(l.payload=i,window.dispatchEvent(l),!l.defaultPrevented)throw i}return s.then(i=>{for(const l of i||[])l.status==="rejected"&&o(l.reason);return t().catch(o)})};function d0(e){return typeof window.calculateScores=="function"?window.calculateScores(e):{total:0,prayer:0,diabetes:0,whoop:0,family:0,habit:0,prayerOnTime:0,prayerLate:0}}function kr(e,t,n){return typeof window.renderTaskItem=="function"?window.renderTaskItem(e,t,n):`<div class="py-2 px-3 text-sm text-[var(--text-primary)]">${e.title||"Untitled"}</div>`}function c0(e){return typeof window.getFilteredTasks=="function"?window.getFilteredTasks(e):[]}function Ld(e){return typeof window.getScoreTier=="function"?window.getScoreTier(e):{label:"",color:"var(--text-muted)",emoji:""}}const u0=$i;function p0(e){const t=String(e||"");if(typeof document>"u")return t.replace(/</g,"&lt;").replace(/>/g,"&gt;");const n=document.createElement("template");n.innerHTML=t;const a=new Set(["DIV","SPAN","STRONG","EM","BR","UL","OL","LI","TABLE","TBODY","THEAD","TR","TD","TH"]),s=new Set(["colspan","rowspan"]),o=Array.from(n.content.querySelectorAll("*"));for(const i of o){if(!a.has(i.tagName)){const l=document.createTextNode(i.textContent||"");i.replaceWith(l);continue}for(const l of Array.from(i.attributes)){const d=l.name.toLowerCase();(!s.has(d)||d.startsWith("on"))&&i.removeAttribute(l.name)}}return n.innerHTML}function f0(e){const t=r.taskLabels.find(l=>l.name.trim().toLowerCase()==="next"),n=r.tasksData.filter(l=>{if(l.completed||l.isNote)return!1;const d=l.dueDate===e,c=l.dueDate&&l.dueDate<e,p=l.deferDate&&l.deferDate<=e;return l.today||d||c||p}).length,a=t?r.tasksData.filter(l=>l.completed||l.isNote||!(l.labels||[]).includes(t.id)?!1:!(l.today||l.dueDate===e||l.dueDate&&l.dueDate<e)).length:0,s=r.tasksData.filter(l=>l.completed&&l.completedAt&&l.completedAt.startsWith(e)).length,o=r.tasksData.filter(l=>!l.completed&&!l.isNote&&l.status==="inbox"&&!l.categoryId).length,i="quick-stat-item bg-[var(--bg-secondary)] rounded-lg p-3 text-center hover:bg-[var(--bg-tertiary)] active:bg-[var(--bg-tertiary)] transition-all";return`
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
  `}function g0(){return`
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
  `}function m0(e){const t=r.tasksData.filter(i=>{if(i.completed||i.isNote)return!1;const l=i.dueDate===e,d=i.dueDate&&i.dueDate<e,c=i.deferDate&&i.deferDate<=e;return i.today||l||d||c}),n=t.filter(i=>i.dueDate&&i.dueDate<=e).sort((i,l)=>i.dueDate.localeCompare(l.dueDate)),a=t.filter(i=>{const l=i.dueDate&&i.dueDate<=e;return i.deferDate&&i.deferDate<=e&&!l}),s=t.filter(i=>!n.includes(i)&&!a.includes(i)),o=t.length;return o===0?'<div class="py-6 text-center text-[var(--text-muted)] text-sm">No tasks for today</div>':`
    <div class="max-h-[300px] overflow-y-auto">
      ${n.length>0?`
        <div class="px-2 pt-1 pb-0.5">
          <div class="flex items-center gap-1.5">
            <svg class="w-3 h-3 text-[var(--danger)]" viewBox="0 0 24 24" fill="currentColor"><path d="M18.7 12.4a6.06 6.06 0 00-.86-3.16l4.56-3.56L20.16 2l-4.13 4.15A7.94 7.94 0 0012 5a8 8 0 00-8 8c0 4.42 3.58 8 8 8a7.98 7.98 0 007.43-5.1l4.15 1.83.57-3.66-6.45 1.33zM12 19a6 6 0 116-6 6 6 0 01-6 6z"/><path d="M12.5 8H11v6l4.75 2.85.75-1.23-4-2.37z"/></svg>
            <span class="text-[10px] font-semibold text-[var(--danger)] uppercase tracking-wider">Due</span>
            <span class="text-[10px] text-[var(--danger)]">${n.length}</span>
          </div>
        </div>
        <div>${n.map(i=>kr(i,!1,!0)).join("")}</div>
      `:""}
      ${s.length>0?`
        <div>${s.map(i=>kr(i,!1,!0)).join("")}</div>
      `:""}
      ${a.length>0?`
        <div class="px-2 pt-1 pb-0.5 ${n.length>0||s.length>0?"mt-0.5 border-t border-[var(--border-light)]":""}">
          <div class="flex items-center gap-1.5">
            <svg class="w-3 h-3 text-[var(--accent)]" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
            <span class="text-[10px] font-semibold text-[var(--accent)] uppercase tracking-wider">Starting</span>
            <span class="text-[10px] text-[var(--accent)]">${a.length}</span>
          </div>
        </div>
        <div>${a.map(i=>kr(i,!1,!0)).join("")}</div>
      `:""}
      ${o>8?`<div class="px-2 py-2 text-center"><button onclick="showPerspectiveTasks('today')" class="text-xs text-[var(--accent)] hover:underline font-medium">View all `+o+" tasks →</button></div>":""}
    </div>
  `}function h0(e){const t=r.taskLabels.find(a=>a.name.trim().toLowerCase()==="next"),n=t?r.tasksData.filter(a=>a.completed||a.isNote||!(a.labels||[]).includes(t.id)?!1:!(a.today||a.dueDate===e||a.dueDate&&a.dueDate<e)):[];return n.length===0?'<div class="py-6 text-center text-[var(--text-muted)] text-sm">No tasks tagged "Next"</div>':`
    <div class="max-h-[300px] overflow-y-auto">
      ${n.slice(0,8).map(a=>kr(a,!1,!0)).join("")}
      ${n.length>8?`<div class="px-2 py-2 text-center"><button onclick="showLabelTasks('`+t.id+`')" class="text-xs text-[var(--accent)] hover:underline font-medium">View all `+n.length+" tasks →</button></div>":""}
    </div>
  `}function v0(e){const t=typeof window.isGCalConnected=="function"?window.isGCalConnected():!1,n=!!r.gcalTokenExpired,a=typeof window.getGCalEventsForDate=="function"?window.getGCalEventsForDate(e)||[]:[];return t?n?`
      <div class="py-6 text-center">
        <p class="text-sm mb-2" style="color: var(--warning)">Calendar session expired</p>
        <button onclick="reconnectGCal()" class="text-xs text-[var(--accent)] hover:underline font-medium">Reconnect</button>
      </div>
    `:a.length===0?'<div class="py-6 text-center text-[var(--text-muted)] text-sm">No events today</div>':`
    <div class="max-h-[300px] overflow-y-auto space-y-1">
      ${a.slice(0,6).map(s=>`
        <button
          onclick="${s.htmlLink?`window.open(decodeURIComponent('${encodeURIComponent(s.htmlLink)}'),'_blank')`:`switchTab('calendar'); calendarSelectDate('${e}')`}"
          class="w-full text-left rounded-lg px-2.5 py-2 hover:bg-[var(--bg-secondary)] transition border border-transparent hover:border-[var(--border-light)]">
          <div class="flex items-start gap-2.5">
            <span class="mt-1 w-2 h-2 rounded-full flex-shrink-0" style="background: var(--success)"></span>
            <div class="min-w-0 flex-1">
              <p class="text-[13px] font-medium text-[var(--text-primary)] truncate">${v(s.summary||"(No title)")}</p>
              <p class="text-[11px] text-[var(--text-muted)] mt-0.5">${u0(s)}</p>
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
    `}function b0(e){const n=(r.allData[e]||JSON.parse(JSON.stringify(He))).prayers||{};return`
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
  `}function y0(e){const t=r.allData[e]||JSON.parse(JSON.stringify(He)),n=t.glucose||{},a=t.libre||{},s=typeof window.isLibreConnected=="function"&&window.isLibreConnected(),o=s&&a.currentGlucose;let i="text-[var(--success)]",l="bg-[color-mix(in_srgb,var(--success)_8%,transparent)]";if(o){const f=Number(a.currentGlucose);f>180||f<70?(i="text-[var(--danger)]",l="bg-[color-mix(in_srgb,var(--danger)_8%,transparent)]"):f>140&&(i="text-[var(--warning)]",l="bg-[color-mix(in_srgb,var(--warning)_8%,transparent)]")}const d=7,c=[];let p=0,m=0;for(let f=89;f>=0;f--){const x=new Date;x.setDate(x.getDate()-f);const k=U(x),T=r.allData[k],E=T?.glucose?.avg?Number(T.glucose.avg):null;E&&(p+=E,m++),f<d&&c.push({date:k,avg:E,tir:T?.glucose?.tir?Number(T.glucose.tir):null,day:x.toLocaleDateString("en-US",{weekday:"narrow"})})}const u=m>=7?((p/m+46.7)/28.7).toFixed(1):null,h=c.map(f=>f.avg),g=h.some(f=>f!==null);let b="";if(g){const T=h.map(D=>D||0),E=Math.min(...T.filter(D=>D>0),70),I=Math.max(...T,180)-E||1,C=T.map((D,R)=>{const M=2+R/(T.length-1)*196,J=D>0?2+(1-(D-E)/I)*36:38;return`${M},${J}`}),H=2+(1-(140-E)/I)*36,j=2+(1-(70-E)/I)*36,$=Math.max(2,2+(1-(180-E)/I)*36);b=`
      <svg viewBox="0 0 200 40" class="w-full" style="height: 40px;" preserveAspectRatio="none">
        <rect x="0" y="${$}" width="200" height="${H-$}" fill="var(--warning)" opacity="0.12" rx="1"/>
        <rect x="0" y="${H}" width="200" height="${j-H}" fill="var(--success)" opacity="0.15" rx="1"/>
        <polyline points="${C.join(" ")}" fill="none" stroke="var(--success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        ${T.map((D,R)=>{if(D<=0)return"";const M=2+R/(T.length-1)*196,J=2+(1-(D-E)/I)*36,W=D>180||D<70?"var(--danger)":D>140?"var(--warning)":"var(--success)";return`<circle cx="${M}" cy="${J}" r="2.5" fill="${W}"/>`}).join("")}
      </svg>
    `}const y=c.map((f,x)=>`<span class="text-[10px] ${x===c.length-1?"font-bold text-[var(--text-primary)]":"text-[var(--text-muted)]"}">${f.day}</span>`).join("");return`
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
    ${g?`
      <div class="mb-3">
        <div class="text-[10px] text-[var(--text-muted)] font-medium mb-1">7-Day Avg Glucose</div>
        ${b}
        <div class="flex justify-between px-0.5 mt-0.5">${y}</div>
      </div>
    `:""}
    <div class="grid ${u?"grid-cols-2 sm:grid-cols-4":"grid-cols-3"} gap-2">
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
      ${u?`
        <div class="text-center">
          <label class="text-[10px] text-[var(--text-muted)] font-medium block mb-1">eA1C</label>
          <div class="text-sm font-semibold ${Number(u)<=5.7?"text-[var(--success)]":Number(u)<=6.4?"text-[var(--warning)]":"text-[var(--danger)]"}">${u}%</div>
        </div>
      `:""}
    </div>
  `}function w0(e){const n=(r.allData[e]||JSON.parse(JSON.stringify(He))).whoop||{},a=typeof window.isWhoopConnected=="function"&&window.isWhoopConnected(),s=typeof window.getWhoopLastSync=="function"?window.getWhoopLastSync():null,o=s?new Date(s).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}):"";return`
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
  `}function x0(e){const n=(r.allData[e]||JSON.parse(JSON.stringify(He))).habits||{};return`
    <div class="flex items-center justify-between mb-3">
      <span class="text-xs text-[var(--text-muted)] font-medium">${["exercise","reading","meditation","water","vitamins"].filter(o=>n[o]).length}/5</span>
    </div>
    <div class="grid grid-cols-5 gap-2">
      ${[{field:"exercise",icon:"🏋️",label:"Exercise"},{field:"reading",icon:"📚",label:"Read"},{field:"meditation",icon:"🧘",label:"Meditate"},{field:"water",icon:"💧",label:"Water"},{field:"vitamins",icon:"💊",label:"Vitamins"}].map(o=>{const i=n[o.field];return'<label class="flex flex-col items-center cursor-pointer"><span class="text-lg mb-1">'+o.icon+'</span><input type="checkbox" '+(i?"checked":"")+` onchange="toggleDailyField('habits', '`+o.field+`')" class="habit-check w-5 h-5 rounded border-2 border-[var(--notes-accent)]/40 text-[var(--notes-accent)] focus:ring-[var(--notes-accent)]/40 focus:ring-offset-0 cursor-pointer"></label>`}).join("")}
    </div>
  `}function k0(e){const t=r.allData[e]||JSON.parse(JSON.stringify(He)),a=d0(t)?.normalized||{prayer:0,diabetes:0,whoop:0,family:0,habits:0,overall:0},s=Math.round(a.overall*100),o=typeof window.getLevelInfo=="function"?window.getLevelInfo(r.xp?.total||0):{level:1,tierName:"Spark",tierIcon:"✨",progress:0,nextLevelXP:100},i=r.streak?.current||0,l=r.streak?.multiplier||1,c=(r.xp?.history||[]).find(h=>h.date===e)?.total||0,p=Ld(a.overall),m=(h,g)=>{const y=2*Math.PI*16,f=y*Math.max(0,Math.min(1,h));return`<svg class="score-mini-ring" width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="16" fill="none" stroke="var(--border-light, #e5e7eb)" stroke-width="3"/>
      <circle cx="20" cy="20" r="16" fill="none" stroke="${g}" stroke-width="3"
        stroke-dasharray="${f} ${y}" stroke-linecap="round"
        transform="rotate(-90 20 20)" class="transition-all duration-500"/>
      <text x="20" y="21" text-anchor="middle" dominant-baseline="middle"
        class="text-[10px] font-bold" fill="${g}">${Math.round(h*100)}</text>
    </svg>`},u=[{key:"prayer",label:"Prayer",pct:a.prayer},{key:"diabetes",label:"Glucose",pct:a.diabetes},{key:"whoop",label:"Whoop",pct:a.whoop},{key:"family",label:"Family",pct:a.family},{key:"habits",label:"Habits",pct:a.habits}];return`
    <div class="flex items-center gap-4">
      <div class="score-main-ring-container flex-shrink-0">
        <svg class="score-main-ring" width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border-light, #e5e7eb)" stroke-width="5"/>
          <circle cx="40" cy="40" r="34" fill="none" stroke="${p.color}" stroke-width="5"
            stroke-dasharray="${2*Math.PI*34*a.overall} ${2*Math.PI*34}" stroke-linecap="round"
            transform="rotate(-90 40 40)" class="transition-all duration-700"/>
          <text x="40" y="37" text-anchor="middle" dominant-baseline="middle"
            class="text-lg font-bold" fill="${p.color}">${s}%</text>
          <text x="40" y="50" text-anchor="middle" dominant-baseline="middle"
            class="text-[8px]" fill="var(--text-muted, #9ca3af)">${p.label}</text>
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
      ${u.map(h=>{const g=Ld(h.pct);return`<div class="text-center">
          ${m(h.pct,g.color)}
          <div class="text-[10px] text-[var(--text-muted)] mt-0.5">${h.label}</div>
        </div>`}).join("")}
    </div>
  `}function S0(){const e=r.weatherData;if(!e)return'<div class="py-6 text-center text-[var(--text-muted)] text-sm">Loading weather...</div>';const t=Nl[e.weatherCode]||"Weather",n=Ao[e.weatherCode]||"🌡️",a=Number.isFinite(Number(e.temp))?Math.round(Number(e.temp)):"--",s=Number.isFinite(Number(e.tempMax))?Math.round(Number(e.tempMax)):"--",o=Number.isFinite(Number(e.tempMin))?Math.round(Number(e.tempMin)):"--",i=Number.isFinite(Number(e.humidity))?Math.max(0,Math.min(100,Math.round(Number(e.humidity)))):0,l=Number.isFinite(Number(e.windSpeed))?Math.max(0,Math.round(Number(e.windSpeed))):0,d=e.city||"Current location",c=e.maxHour||"",p=e.minHour||"",m=l<10?"Calm":l<25?"Breezy":"Windy",u=e.tomorrow,h=u?Nl[u.weatherCode]||"Weather":"",g=u?Ao[u.weatherCode]||"🌡️":"",b=f=>f>0?`${f}° warmer`:f<0?`${Math.abs(f)}° cooler`:"same",y=f=>f>3?"var(--warning)":f<-3?"var(--accent)":"var(--text-muted)";return`
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
        <span class="flex items-center gap-0.5" title="Low at ${p}">
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
        ${l} km/h · ${m}
      </span>
    </div>
    ${u?`
    <div class="flex items-center gap-2 mt-2 pt-2 border-t border-[var(--border-light)] text-[11px]">
      <span class="text-[var(--text-muted)] font-medium">Tmrw</span>
      <span>${g}</span>
      <span class="text-[var(--text-secondary)]">${h}</span>
      <span class="ml-auto flex items-center gap-2">
        <span class="font-semibold text-[var(--text-primary)]">${u.tempMax}°<span class="text-[var(--text-muted)] font-normal">/</span>${u.tempMin}°</span>
        <span class="font-medium" style="color: ${y(u.avgDelta)}">${u.avgDelta===0?"same":b(u.avgDelta)}</span>
      </span>
    </div>
    `:""}
  `}function T0(e,t){if(![...Ee,ze,...r.customPerspectives||[]].find(i=>i.id===e.perspectiveId))return`
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
    `}const s=c0(e.perspectiveId),o=s.length;return o===0?'<div class="py-6 text-center text-[var(--text-muted)] text-sm">No tasks</div>':`
    <div class="max-h-[300px] overflow-y-auto">
      ${s.slice(0,8).map(i=>kr(i,!1,!0)).join("")}
      ${o>8?`<div class="px-2 py-2 text-center"><button onclick="showPerspectiveTasks('${e.perspectiveId}')" class="text-xs text-[var(--accent)] hover:underline font-medium">View all ${o} tasks &rarr;</button></div>`:""}
    </div>
  `}function I0(e){const t=typeof window.isGCalConnected=="function"?window.isGCalConnected():!1,n=!!(typeof window.getAnthropicKey=="function"&&window.getAnthropicKey()),a=r.gsheetSyncing,s=r.gsheetAsking,o=localStorage.getItem(ms)||"",i=r.gsheetEditingPrompt,l=r.gsheetResponse||localStorage.getItem(hs)||"";if(!n)return`
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
          value="${v(o)}"
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
    `;const d=r.gsheetData,c=d?.tabs?.length||0,p=d?.tabs?.map(u=>u.name).join(", ")||"";let m="";if(s)m=`
      <div class="py-6 text-center">
        <svg class="w-5 h-5 animate-spin mx-auto mb-2 text-[var(--text-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0110 10"/></svg>
        <span class="text-sm text-[var(--text-muted)]">Generating...</span>
      </div>`;else if(l){const u=l.startsWith("Error:"),h=u?v(l):p0(l);m=`
      <div class="max-h-[300px] overflow-y-auto">
        <div class="gsheet-response text-sm leading-relaxed overflow-x-auto ${u?"text-[var(--danger)]":"text-[var(--text-primary)]"}">${h}</div>
      </div>
    `}else m='<div class="py-6 text-center text-[var(--text-muted)] text-xs">No response yet</div>';return`
    ${m}
    <div class="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border-light)]">
      <button onclick="handleGSheetEditPrompt()" class="flex-1 min-w-0 text-left group" title="Click to edit prompt">
        <span class="text-[10px] text-[var(--text-muted)] truncate block group-hover:text-[var(--accent)] transition">${v(o)}</span>
      </button>
      <div class="flex items-center gap-3 ml-3 flex-shrink-0">
        ${c?`<span class="text-[10px] text-[var(--text-muted)]" title="${v(p)}">${c} tabs</span>`:""}
        <button onclick="handleGSheetRefresh()" class="inline-flex items-center gap-1 text-[10px] text-[var(--accent)] font-medium hover:opacity-80 transition ${s||a?"opacity-50 pointer-events-none":""}" ${s||a?"disabled":""} title="Re-run prompt">
          <svg class="w-3 h-3 ${s?"animate-spin":""}" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
          Refresh
        </button>
      </div>
    </div>
  `}const $0={stats:'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z"/></svg>',"quick-add":'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',"today-tasks":V().today,"today-events":V().calendar,"next-tasks":V().next,prayers:'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',glucose:'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-5.33 4.55-8 8.48-8 11.8 0 4.98 3.8 8.2 8 8.2s8-3.22 8-8.2c0-3.32-2.67-7.25-8-11.8z"/></svg>',whoop:'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/></svg>',habits:'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',weather:'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/></svg>',score:'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v8H3v-8zm4-4h2v12H7V9zm4-4h2v16h-2V5zm4 8h2v8h-2v-8zm4-4h2v12h-2V9z"/></svg>',"gsheet-yesterday":'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-7-2h5v-5h-5v5zm-6-5h5V7H6v5zm6-5v3h5V7h-5zM6 14h5v3H6v-3z"/></svg>'};function C0(e){const t=getComputedStyle(document.documentElement),n=s=>t.getPropertyValue(s).trim();return{stats:n("--text-muted")||"#6B7280","quick-add":n("--accent")||"#147EFB","today-tasks":n("--today-color")||"#FFCA28","today-events":n("--success")||"#2F9B6A","next-tasks":n("--notes-accent")||"#8E8E93",prayers:n("--success")||"#10B981",glucose:n("--danger")||"#EF4444",whoop:n("--accent")||"#3B82F6",habits:n("--notes-accent")||"#8E8E93",weather:n("--warning")||"#F59E0B",score:n("--success")||"#22C55E","gsheet-yesterday":n("--success")||"#34A853"}[e]||n("--text-muted")||"#6B7280"}const E0={stats:"#6B7280","quick-add":"#147EFB","today-tasks":"#FFCA28","today-events":"#2F9B6A","next-tasks":"#8E8E93",prayers:"#10B981",glucose:"#EF4444",whoop:"#3B82F6",habits:"#8E8E93",weather:"#F59E0B",score:"#22C55E","gsheet-yesterday":"#34A853"};function D0(e,t){if(typeof window.createTask=="function")return window.createTask(e,t)}function A0(e){if(typeof window.cleanupInlineAutocomplete=="function")return window.cleanupInlineAutocomplete(e)}function M0(){if(typeof window.render=="function")return window.render()}function af(e,t){const n=U(),s=Ci()||e.size==="full"?"col-span-2":(e.size==="half","col-span-1"),o={full:"Full",half:"Half",third:"Third"},i=e.type==="perspective",l=t?`
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
  `:"",c={stats:()=>f0(n),"quick-add":()=>g0(),"today-tasks":()=>m0(n),"next-tasks":()=>h0(n),"today-events":()=>v0(n),prayers:()=>b0(n),glucose:()=>y0(n),whoop:()=>w0(n),habits:()=>x0(n),score:()=>k0(n),weather:()=>S0(),perspective:()=>T0(e),"gsheet-yesterday":()=>I0()}[e.type],p=c?c():'<div class="py-4 text-center text-[var(--text-muted)]">Unknown widget type</div>',m={...$0},u={};for(const h of Object.keys(E0))u[h]=C0(h);if(e.type==="perspective"){const g=[...Ee,ze,...r.customPerspectives||[]].find(b=>b.id===e.perspectiveId);g&&(m.perspective=g.icon||"",u.perspective=g.color||"#6B7280")}return e.type==="quick-add"&&!t?`
      <div class="widget quick-add-widget ${s} widget-drop-target">
        <div class="py-2">
          ${p}
        </div>
      </div>
    `:`
    <div class="widget ${s} bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden widget-drop-target ${t?"cursor-grab":""}"
      ${t?`draggable="true" ondragstart="handleWidgetDragStart(event, '${e.id}')" ondragend="handleWidgetDragEnd(event)" ondragover="handleWidgetDragOver(event, '${e.id}')" ondragleave="handleWidgetDragLeave(event)" ondrop="handleWidgetDrop(event, '${e.id}')"`:""}>
      <div class="widget-header px-4 py-2 border-b border-[var(--border-light)] flex items-center gap-2">
        ${t?'<div class="text-[var(--text-muted)]/30 cursor-grab"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg></div>':""}
        <span style="color: ${u[e.type]||"#6B7280"}">${m[e.type]||""}</span>
        <h3 class="widget-title text-sm font-medium text-[var(--text-primary)]">${v(e.title)}</h3>
        ${l}
      </div>
      <div class="widget-body ${e.type==="today-tasks"||e.type==="today-events"||e.type==="next-tasks"||e.type==="perspective"?"px-2 py-1":"p-4"}">
        ${p}
      </div>
    </div>
  `}async function P0(){const t=(document.getElementById("gsheet-prompt-input")?.value||"").trim();if(t){localStorage.setItem(ms,t),r.gsheetEditingPrompt=!1,r.gsheetAsking=!0,r.gsheetResponse=null,window.render();try{const n=await window.askGSheet(t);r.gsheetResponse=n,localStorage.setItem(hs,n)}catch(n){r.gsheetResponse=`Error: ${n.message||"Something went wrong"}`}finally{r.gsheetAsking=!1,window.render()}}}function N0(){r.gsheetEditingPrompt=!0,window.render(),setTimeout(()=>{const e=document.getElementById("gsheet-prompt-input");e&&(e.focus(),e.select())},50)}function L0(){r.gsheetEditingPrompt=!1,window.render()}async function _0(){const e=localStorage.getItem(ms)||"";if(e){r.gsheetAsking=!0,r.gsheetResponse=null,window.render();try{const t=await window.askGSheet(e);r.gsheetResponse=t,localStorage.setItem(hs,t)}catch(t){r.gsheetResponse=`Error: ${t.message||"Something went wrong"}`}finally{r.gsheetAsking=!1,window.render()}}}function O0(e){if(!e)return;const t=e.value.trim();if(!t)return;const n={status:"inbox"};r.quickAddIsNote&&(n.isNote=!0,n.status="anytime");const a=r.inlineAutocompleteMeta.get("home-quick-add-input");a&&(a.areaId&&(n.areaId=a.areaId),a.categoryId&&(n.categoryId=a.categoryId),a.labels&&a.labels.length&&(n.labels=a.labels),a.people&&a.people.length&&(n.people=a.people),a.deferDate&&(n.deferDate=a.deferDate),a.dueDate&&(n.dueDate=a.dueDate)),D0(t,n),e.value="",r.quickAddIsNote=!1,A0("home-quick-add-input"),M0(),setTimeout(()=>{const s=document.getElementById("home-quick-add-input");s&&s.focus()},50)}function sf(){U();const e=[...r.homeWidgets].sort((s,o)=>s.order-o.order),t=Ci(),n=t?e:e.filter(s=>s.visible),a=t?[]:e.filter(s=>!s.visible);return`
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
                <span class="text-base">${Ao[r.weatherData.weatherCode]||"🌡️"}</span>
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
          ${he()?`
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
            ${r.editingHomeWidgets?"✓ Done":'<span class="inline-flex items-center gap-1">'+V().settings+" Customize</span>"}
          </button>
        </div>
      </div>

      ${r.editingHomeWidgets&&r.showAddWidgetPicker?(()=>{const s=[...Ee.filter(i=>i.id!=="calendar"),ze,...r.customPerspectives||[]],o=new Set(r.homeWidgets.filter(i=>i.type==="perspective").map(i=>i.perspectiveId));return`
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
                    <span class="text-sm text-[var(--text-primary)] truncate">${v(i.name)}</span>
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
        ${n.map(s=>af(s,r.editingHomeWidgets)).join("")}
      </div>
    </div>
  `}function R0(e=4){return Array.from({length:e},()=>`<div class="flex items-center gap-3 p-4">
      <div class="skeleton skeleton-circle w-10 h-10 flex-shrink-0"></div>
      <div class="flex-1 space-y-2">
        <div class="skeleton skeleton-title w-3/4"></div>
        <div class="skeleton skeleton-text w-1/2"></div>
      </div>
    </div>`).join("")}function _d(){return`<div class="rounded-lg border border-[var(--border-light)] overflow-hidden">
    <div class="p-4 space-y-3">
      <div class="skeleton skeleton-title w-1/3"></div>
      ${R0(3)}
    </div>
  </div>`}function nr(){return`<div class="p-4 space-y-4 animate-pulse">${_d()}${_d()}</div>`}function B0(){return typeof window.renderTrackingTab=="function"?window.renderTrackingTab():nr()}function j0(){return typeof window.renderBulkEntryTab=="function"?window.renderBulkEntryTab():nr()}function F0(){return typeof window.renderDashboardTab=="function"?window.renderDashboardTab():(window.__dashboardRendererLoading||(window.__dashboardRendererLoading=!0,l0(()=>import("./dashboard-uvVwnFFg.js"),[]).then(e=>{e?.renderDashboardTab&&(window.renderDashboardTab=e.renderDashboardTab)}).catch(e=>{console.warn("Failed to lazy-load dashboard renderer:",e)}).finally(()=>{window.__dashboardRendererLoading=!1,ie()})),nr())}function H0(){return typeof window.renderTasksTab=="function"?window.renderTasksTab():nr()}function W0(){return typeof window.renderSettingsTab=="function"?window.renderSettingsTab():nr()}function G0(){return typeof window.renderTaskModalHtml=="function"?window.renderTaskModalHtml():""}function U0(){return typeof window.renderPerspectiveModalHtml=="function"?window.renderPerspectiveModalHtml():""}function z0(){return typeof window.renderAreaModalHtml=="function"?window.renderAreaModalHtml():""}function V0(){return typeof window.renderLabelModalHtml=="function"?window.renderLabelModalHtml():""}function q0(){return typeof window.renderPersonModalHtml=="function"?window.renderPersonModalHtml():""}function K0(){return r.showCategoryModal&&typeof window.renderCategoryModalHtml=="function"?window.renderCategoryModalHtml():""}function Y0(){if(typeof window.setupSidebarDragDrop=="function")return window.setupSidebarDragDrop()}function J0(){if(typeof window.initModalAutocomplete=="function")return window.initModalAutocomplete()}function xo(e){if(typeof window.setupInlineAutocomplete=="function")return window.setupInlineAutocomplete(e)}function X0(){return typeof window.renderUndoToastHtml=="function"?window.renderUndoToastHtml():""}function Q0(){return typeof window.renderGlobalSearchHtml=="function"?window.renderGlobalSearchHtml():""}function Z0(){return typeof window.renderBraindumpOverlay=="function"?window.renderBraindumpOverlay():""}function e2(){return typeof window.renderBraindumpFAB=="function"?window.renderBraindumpFAB():""}function t2(){return typeof window.renderBottomNav=="function"?window.renderBottomNav():""}function n2(){return typeof window.getCurrentViewInfo=="function"?window.getCurrentViewInfo():{name:"Tasks"}}function r2(){if(typeof window.scrollToContent=="function")return window.scrollToContent()}function lr(){return localStorage.getItem(vi)||""}let ha=null,ko=null,dr=null;function ie(){const e=typeof performance<"u"&&performance.now?performance.now():Date.now();try{const t=document.getElementById("app");typeof window.runCleanupCallbacks=="function"&&window.runCleanupCallbacks();const n=ko!==null&&ko!==r.activeTab,a=n?0:document.documentElement.scrollTop||document.body.scrollTop;ko=r.activeTab;const s=r.activeTab==="calendar",o=()=>{document.body.classList.remove("body-modal-open"),document.body.style.overflow=""};if(r.authLoading){o(),t.innerHTML=`
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
          ${r.authError?`<p class="text-sm text-[var(--danger)] mb-4">${v(r.authError)}</p>`:""}
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
          <p class="text-xs text-[var(--text-muted)] mt-12">v${Ct}</p>
        </div>`;return}const i=r.showCacheRefreshPrompt?`
      <div class="max-w-6xl mx-auto px-6 pt-4">
        <div class="rounded-lg border px-4 py-3 flex items-center justify-between gap-3" role="alert" aria-live="polite" aria-atomic="true" style="border-color: color-mix(in srgb, var(--warning) 25%, transparent); background: color-mix(in srgb, var(--warning) 8%, transparent)">
          <div>
            <p class="text-sm font-semibold" style="color: var(--warning)">New app update available</p>
            <p class="text-xs" style="color: var(--warning)">${v(r.cacheRefreshPromptMessage||`Version ${Ct} is available. Refresh recommended to avoid stale cache.`)}</p>
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
            <h1 class="mobile-header-title text-[17px] font-bold text-[var(--text-primary)] truncate">${r.activeTab==="tasks"?(function(){return n2()?.name||"Tasks"})():r.activeTab==="life"?"Life Score":r.activeTab==="calendar"?"Calendar":"Settings"}</h1>
          `}
          <div class="flex items-center gap-1.5">
            <span class="mobile-version text-[10px] font-semibold text-[var(--text-muted)]">v${Ct}</span>
            <div class="w-1.5 h-1.5 rounded-full" style="background: ${lr()?"var(--success)":"var(--text-muted)"}"></div>
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
                  <span class="text-[11px] font-medium text-[var(--text-muted)] bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded-md">v${Ct}</span>
                </div>
                <p class="text-sm text-[var(--text-secondary)] mt-0.5">Your life, all in one place <span class="text-[var(--accent)]">•</span> habits, health, productivity</p>
              </div>
            </a>
            <div class="flex items-center gap-4 header-actions">
              <div class="header-sync-pill flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-light)]" title="${lr()?"Data synced to GitHub cloud":"Data stored locally only — connect GitHub in Settings to sync"}">
                <div id="sync-indicator" class="w-2 h-2 rounded-full" style="background: ${lr()?"var(--success)":"var(--text-muted)"}"></div>
                <span class="text-xs text-[var(--text-muted)]">${lr()?"Synced":"Local"}</span>
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
              ${V().home.replace("w-5 h-5","w-4 h-4")} Home
            </button>
            <button type="button" onclick="switchTab('tasks')" aria-label="Go to Workspace tab" aria-current="${r.activeTab==="tasks"?"page":"false"}" class="nav-tab px-3.5 py-1.5 text-[13px] font-medium transition-all rounded-lg flex items-center gap-2 ${r.activeTab==="tasks"?"bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm":"text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50"}">
              ${V().workspace} Workspace
            </button>
            <button type="button" onclick="switchTab('life')" aria-label="Go to Life Score tab" aria-current="${r.activeTab==="life"?"page":"false"}" class="nav-tab px-3.5 py-1.5 text-[13px] font-medium transition-all rounded-lg flex items-center gap-2 ${r.activeTab==="life"?"bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm":"text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50"}">
              ${V().lifeScore} Life Score
            </button>
            <button type="button" onclick="switchTab('calendar')" aria-label="Go to Calendar tab" aria-current="${s?"page":"false"}" class="nav-tab px-3.5 py-1.5 text-[13px] font-medium transition-all rounded-lg flex items-center gap-2 ${s?"bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm":"text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50"}">
              ${V().calendar} Calendar
            </button>
            <button type="button" onclick="switchTab('settings')" aria-label="Go to Settings tab" aria-current="${r.activeTab==="settings"?"page":"false"}" class="nav-tab px-3.5 py-1.5 text-[13px] font-medium transition-all rounded-lg flex items-center gap-2 ${r.activeTab==="settings"?"bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm":"text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50"}">
              ${V().settings} Settings
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
        ${r.activeTab==="home"?sf():r.activeTab==="life"?r.activeSubTab==="daily"?B0():r.activeSubTab==="bulk"?j0():F0():r.activeTab==="calendar"?typeof window.renderCalendarView=="function"?window.renderCalendarView():nr():r.activeTab==="tasks"?H0():W0()}
      </main>

      <footer class="border-t border-[var(--border-light)] py-8 mt-12">
        <div class="flex flex-col items-center gap-3">
          <button onclick="window.forceHardRefresh()" class="px-4 py-2 bg-[var(--accent-light)] text-[var(--accent)] rounded-lg text-sm font-medium hover:bg-[var(--accent-light)] transition inline-flex items-center gap-2">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><polyline points="21 3 21 9 15 9"/></svg>
            Force Hard Refresh
          </button>
          <p class="text-center text-[var(--text-muted)] text-sm">${lr()?"Data synced to GitHub":"Data saved locally"} <span class="text-[var(--accent)]">•</span> Homebase</p>
        </div>
      </footer>

      <!-- Mobile Bottom Navigation -->
      ${t2()}

      ${G0()}
      ${U0()}
      ${z0()}
      ${V0()}
      ${q0()}
      ${K0()}
      ${e2()}
      ${Q0()}
      ${Z0()}
      ${X0()}
    `;const p=document.getElementById("dateInput");if(p&&!p._hasChangeHandler&&(p._hasChangeHandler=!0,p.addEventListener("change",y=>{r.currentDate=y.target.value,ie()})),r.activeTab==="tasks"&&document.querySelector(".draggable-item:not([data-drag-initialized])")&&Y0(),r.showTaskModal&&J0(),r.perspectiveEmojiPickerOpen||r.areaEmojiPickerOpen||r.categoryEmojiPickerOpen){const y=document.getElementById("emoji-search-input");if(y){y.focus();const f=y.value.length;y.setSelectionRange(f,f)}}if(!n&&a>0&&(document.documentElement.scrollTop=a,document.body.scrollTop=a),c){const y=document.getElementById(c.id);if(y){y.value=c.value,y.focus();try{y.setSelectionRange(c.selStart,c.selEnd)}catch{}}}if(ha&&cancelAnimationFrame(ha),ha=requestAnimationFrame(()=>{if(ha=null,document.getElementById("quick-add-input")&&xo("quick-add-input"),document.getElementById("home-quick-add-input")&&xo("home-quick-add-input"),document.getElementById("review-quick-add-input")&&r.reviewMode){const y=r.taskAreas[r.reviewAreaIndex];xo("review-quick-add-input",{initialMeta:y?{areaId:y.id}:{}})}}),r.activeTab==="calendar"&&typeof window.attachCalendarSwipe=="function"&&window.attachCalendarSwipe(),typeof window.initSwipeActions=="function"&&window.initSwipeActions(),typeof window.initTouchDrag=="function"&&window.initTouchDrag(),typeof window.initPullToRefresh=="function"&&window.initPullToRefresh(),dr&&(dr.disconnect(),dr=null),he()&&r.activeTab==="home"){const y=document.getElementById("large-title-sentinel"),f=document.querySelector(".mobile-header-title-inline");y&&f&&(dr=new IntersectionObserver(([x])=>{f.classList.toggle("visible",!x.isIntersecting)},{threshold:0}),dr.observe(y))}const m=!!(r.showTaskModal||r.showPerspectiveModal||r.showAreaModal||r.showLabelModal||r.showPersonModal||r.showCategoryModal||r.showBraindump||r.showGlobalSearch||r.calendarEventModalOpen);if(document.body.classList.toggle("body-modal-open",m),m?document.body.style.overflow="hidden":document.body.style.overflow="",m&&he()){const y=document.querySelector(".sheet-handle"),f=document.querySelector(".modal-enhanced, .modal-content"),x=document.querySelector(".modal-overlay");if(y&&f&&x&&!y._sheetDragInit){let C=function($){const D=f.getBoundingClientRect(),R=$.touches[0].clientY;R-D.top>I&&$.target!==y||(k=R,T=k,E=Date.now(),N=!0,f.style.transition="none")},H=function($){if(!N)return;T=$.touches[0].clientY;const D=Math.max(0,T-k);f.style.transform=`translateY(${D}px)`;const R=Math.min(D/(f.offsetHeight*.5),1);x.style.background=`rgba(0,0,0,${.4*(1-R*.6)})`},j=function(){if(!N)return;N=!1;const $=T-k,D=$/(Date.now()-E||1);$>f.offsetHeight*.3||$>50&&D>.5?(f.style.transition="transform var(--duration-slow) var(--ease-accelerate)",f.style.transform="translateY(100%)",x.style.transition="background var(--duration-slow) var(--ease-default)",x.style.background="rgba(0,0,0,0)",setTimeout(()=>{typeof window.closeTaskModal=="function"&&r.showTaskModal?window.closeTaskModal():(x.remove(),window.render())},350)):(f.style.transition="transform var(--duration-normal) var(--ease-spring)",f.style.transform="translateY(0)",x.style.transition="background var(--duration-normal) var(--ease-default)",x.style.background="rgba(0,0,0,0.4)")};y._sheetDragInit=!0;let k=0,T=0,E=0,N=!1;const I=40;f.addEventListener("touchstart",C,{passive:!0}),f.addEventListener("touchmove",H,{passive:!0}),f.addEventListener("touchend",j,{passive:!0})}}m&&setTimeout(()=>{const y=document.querySelector("[autofocus]");y&&document.activeElement!==y&&y.focus()},60);const u=(typeof performance<"u"&&performance.now?performance.now():Date.now())-e,h=r.renderPerf||{lastMs:0,avgMs:0,maxMs:0,count:0},g=(h.count||0)+1,b=((h.avgMs||0)*(g-1)+u)/g;r.renderPerf={lastMs:Number(u.toFixed(2)),avgMs:Number(b.toFixed(2)),maxMs:Number(Math.max(h.maxMs||0,u).toFixed(2)),count:g},r._lastRenderWasMobile=he()}catch(t){console.error("Render error:",t),document.getElementById("app").innerHTML=`
      <div style="max-width:480px;margin:60px auto;padding:24px;font-family:var(--font-family,system-ui);color:var(--text-primary,#171717);">
        <h2 style="font-size:18px;font-weight:600;margin:0 0 8px;">Something went wrong</h2>
        <p style="font-size:14px;color:var(--text-secondary,#666);margin:0 0 16px;">An error occurred while rendering the app. Your data is safe.</p>
        <details style="margin-bottom:16px;font-size:12px;color:var(--text-muted,#8f8f8f);">
          <summary style="cursor:pointer;margin-bottom:4px;">Error details</summary>
          <pre style="white-space:pre-wrap;word-break:break-word;background:var(--bg-secondary,#f2f2f2);padding:8px;border-radius:6px;margin-top:4px;">${v(t.message)}
${v(t.stack||"")}</pre>
        </details>
        <div style="display:flex;gap:8px;">
          <button onclick="location.reload()" style="padding:8px 16px;border-radius:6px;background:var(--btn-bg,#000);color:#fff;border:none;font-size:13px;font-weight:500;cursor:pointer;">Reload App</button>
          <button onclick="try{window.exportData()}catch(e){}" style="padding:8px 16px;border-radius:6px;background:var(--bg-secondary,#f2f2f2);border:1px solid var(--border,#e6e6e6);font-size:13px;font-weight:500;cursor:pointer;">Export Data</button>
        </div>
      </div>`}}function a2(){r.showCacheRefreshPrompt=!1,r.cacheRefreshPromptMessage="",localStorage.setItem(Mo,Ct),ie()}function s2(e){if(!["home","tasks","life","calendar","settings"].includes(e))return;Xd("light"),document.querySelectorAll(".inline-autocomplete-popup").forEach(a=>a.remove()),r.inlineAutocompleteMeta.clear(),r.mobileDrawerOpen&&(r.mobileDrawerOpen=!1,document.body.style.overflow="",document.body.classList.remove("drawer-open")),r.activeTab=e,e==="calendar"&&(r.calendarSidebarCollapsed=!1);const n=document.querySelector(".mobile-bottom-nav");n&&n.classList.remove("nav-scroll-hidden"),De(),ie(),r2()}function o2(e){r.activeSubTab=e,De(),ie()}function i2(){r.currentDate=U(),ie()}async function l2(){try{if("serviceWorker"in navigator){const e=await navigator.serviceWorker.getRegistrations();await Promise.all(e.map(t=>t.unregister()))}if("caches"in window){const e=await caches.keys();await Promise.all(e.map(t=>caches.delete(t)))}}catch(e){console.warn("Cache clear error:",e)}window.location.reload()}function of(e){if(typeof window.parsePrayer=="function")return window.parsePrayer(e);const t=parseFloat(e);if(!t||isNaN(t))return{onTime:0,late:0};const n=Math.floor(t),a=Math.round((t-n)*10);return{onTime:n,late:a}}function d2(e){if(typeof window.calcPrayerScore=="function")return window.calcPrayerScore(e);const{onTime:t,late:n}=of(e);return t*(r.WEIGHTS.prayer?.onTime??5)+n*(r.WEIGHTS.prayer?.late??2)}function lf(e,t,n){const{onTime:a,late:s}=of(n),o=d2(n);return`
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
  `}function ii(e,t,n,a){return`
    <label class="flex items-center justify-between cursor-pointer py-2 px-1 hover:bg-[var(--bg-secondary)] rounded-md transition">
      <span class="text-sm text-[var(--text-primary)]">${e}</span>
      <div class="relative toggle-switch toggle-track" onclick="updateData('${n}', '${a}', !${t})">
        <div class="w-[52px] h-8 rounded-full transition ${t?"toggle-on":"toggle-off"}"></div>
        <div class="absolute left-0.5 top-0.5 w-7 h-7 bg-white rounded-full shadow transition" style="transform: translateX(${t?"20px":"0"})"></div>
      </div>
    </label>
  `}function c2(e,t,n,a,s,o,i="",l="",d="center"){const c=d==="left"?"left-0":d==="right"?"right-0":"left-1/2 -translate-x-1/2";return`
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
  `}function hr(e,t,n,a,s=10){return`
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
  `}function yn(e,t,n,a){const s=n?Math.min(t/n*100,100):0,o=a?.match(/var\(([^)]+)\)/),i=o?`var(${o[1]})`:a||"var(--accent)",l=Math.round(s);return`
    <div class="sb-card rounded-lg p-4" aria-label="${`${e} score: ${me(t)} out of ${n} (${l}%)`}">
      <div class="flex justify-between items-center mb-1">
        <span class="sb-section-title text-[var(--text-muted)]">${e}</span>
        <span class="text-xs text-[var(--text-muted)]">${l}%</span>
      </div>
      <div class="font-bold text-2xl text-[var(--text-primary)] mb-2">${me(t)}</div>
      <div class="h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-500" style="width: ${s}%; background: ${i}"></div>
      </div>
    </div>
  `}function u2(e,t,n,a,s=""){return`
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
  `}function p2(e){document.activeElement&&(document.activeElement.tagName==="INPUT"||document.activeElement.tagName==="SELECT")&&document.activeElement.blur();const t=new Date(r.currentDate+"T00:00:00");t.setDate(t.getDate()+e),r.currentDate=t.toISOString().slice(0,10),window.render()}function f2(){const e=Ei();e.prayers=e.prayers||{},e.glucose=e.glucose||{},e.whoop=e.whoop||{},e.family=e.family||{},e.habits=e.habits||{};const t=Ie(e),n={total:t?.total??0,prayer:t?.prayer??0,diabetes:t?.diabetes??0,whoop:t?.whoop??0,family:t?.family??0,habit:t?.habit??0,prayerOnTime:t?.prayerOnTime??0,prayerLate:t?.prayerLate??0},a=r.WEIGHTS.glucose&&r.WEIGHTS.glucose.insulinThreshold||40,s=gn()&&Es(),o=e.libre||{},i=s&&o.currentGlucose,l=Wt()&&Cs();let d="text-[var(--success)]";if(i){const g=Number(o.currentGlucose);g>180||g<70?d="text-[var(--danger)]":g>140&&(d="text-[var(--warning)]")}const c=(g,b)=>`
    <div class="px-3 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm font-medium text-[var(--text-secondary)] text-center">
      ${g} <span class="text-xs text-[var(--text-muted)]">${b}</span>
    </div>
    <div class="text-[10px] text-[var(--success)] mt-1 text-center">Auto-synced</div>
  `,p=r.currentDate===U(),m=ve(r.currentDate),h=new Date(r.currentDate+"T00:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});return`
    <!-- Date Navigation -->
    <div class="flex items-center justify-center gap-3 mb-6">
      <button onclick="navigateTrackingDate(-1)" class="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] active:scale-95 transition" title="Previous day" aria-label="Previous day">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <div class="text-center min-w-[120px]">
        <div class="text-sm font-semibold text-[var(--text-primary)]">${m}</div>
        ${p?"":`<div class="text-[11px] text-[var(--text-muted)]">${h}</div>`}
      </div>
      <button onclick="navigateTrackingDate(1)" class="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-[var(--bg-secondary)] hover:bg-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] active:scale-95 transition" title="Next day" aria-label="Next day">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
      </button>
      ${p?"":'<button onclick="setToday()" class="text-xs font-medium text-[var(--accent)] hover:underline ml-1">Today</button>'}
    </div>

    <!-- Score Cards Row -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
      ${yn("Prayer",n.prayer,r.MAX_SCORES.prayer,"bg-[var(--accent)]")}
      ${yn("Diabetes",n.diabetes,r.MAX_SCORES.diabetes,"bg-[var(--success)]")}
      ${yn("Whoop",n.whoop,r.MAX_SCORES.whoop,"bg-[var(--notes-accent)]")}
      ${yn("Family",n.family,r.MAX_SCORES.family,"bg-[var(--warning)]")}
      ${yn("Habits",n.habit,r.MAX_SCORES.habits,"bg-[var(--text-muted)]")}
      <div class="sb-card rounded-lg p-4 bg-[var(--bg-card)] border border-[var(--border-light)]" aria-label="Total score: ${me(n.total)} out of ${r.MAX_SCORES.total} (${Math.round(n.total/r.MAX_SCORES.total*100)}%)">
        <div class="sb-section-title text-[var(--text-muted)] flex justify-between">
          <span>Total</span>
          <span>${Math.round(n.total/r.MAX_SCORES.total*100)}%</span>
        </div>
        <div class="text-3xl font-bold mt-1 text-[var(--accent)]">${me(n.total)}</div>
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
          ${["fajr","dhuhr","asr","maghrib","isha"].map(g=>lf(g,g.charAt(0).toUpperCase()+g.slice(1),e.prayers[g])).join("")}
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
          ${(r.familyMembers||[]).map(g=>ii(g.name,e.family[g.id],"family",g.id)).join("")}
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
          ${hr("🏋️ Exercise",e.habits.exercise||0,"habits","exercise",5)}
          ${hr("📚 Reading",e.habits.reading||0,"habits","reading",5)}
          ${hr("🧘 Meditation",e.habits.meditation||0,"habits","meditation",5)}
          ${hr("🦷 Brush Teeth",e.habits.brushTeeth||0,"habits","brushTeeth",3)}
          ${ii("💊 Vitamins taken",e.habits.vitamins,"habits","vitamins")}
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
  `}function g2(e,t){r.bulkMonth=parseInt(e),r.bulkYear=parseInt(t),window.render()}function m2(e){r.bulkCategory=e,window.render()}function h2(e,t,n,a){if(r.allData[e]||(r.allData[e]=Ur()),t==="family")r.allData[e][t][n]=a==="1"||a===!0;else{const o=parseFloat(a);r.allData[e][t][n]=a===""?null:Number.isNaN(o)?a:o}r.allData[e]._lastModified=new Date().toISOString(),We(),Yn(),window.debouncedSaveToGithub();const s=document.getElementById("score-"+e);if(s){const o=Ie(r.allData[e]).total;s.textContent=me(o)}df()}function df(){const e=xl(r.bulkMonth,r.bulkYear);let t=0,n=0;for(let c=1;c<=e;c++){const p=r.bulkYear+"-"+String(r.bulkMonth+1).padStart(2,"0")+"-"+String(c).padStart(2,"0");r.allData[p]&&(n++,t+=Ie(r.allData[p]).total)}const a=n>0?Math.round(t/n):0,s=Math.round(n/e*100),o=document.getElementById("bulk-days-logged"),i=document.getElementById("bulk-total-score"),l=document.getElementById("bulk-avg-score"),d=document.getElementById("bulk-completion");o&&(o.textContent=me(n)),i&&(i.textContent=me(t)),l&&(l.textContent=me(a)),d&&(d.textContent=s+"%")}function xl(e,t){return new Date(t,e+1,0).getDate()}function v2(){const e=xl(r.bulkMonth,r.bulkYear),t=new Date(r.bulkYear,r.bulkMonth).toLocaleDateString("en-US",{month:"long",year:"numeric"}),n={prayers:"var(--accent)",glucose:"var(--success)",whoop:"var(--notes-accent)",family:"var(--warning)",habits:"var(--text-muted)"},a=Wt(),s=gn(),o=["sleepPerf","recovery","strain"],i=["avg","tir"],l=r.familyMembers||[],d=l.map($=>$.id),c=l.map($=>$.name),p={prayers:{label:"🕌 Prayers",fields:["fajr","dhuhr","asr","maghrib","isha","quran"],headers:["F","D","A","M","I","Q"]},glucose:{label:"💉 Glucose",fields:["avg","tir","insulin"],headers:["Avg","TIR","Insulin"]},whoop:{label:"⏱️ Whoop",fields:["sleepPerf","recovery","strain"],headers:["Sleep%","Rec","Strain"]},family:{label:"👨‍👩‍👧‍👦 Family",fields:d,headers:c},habits:{label:"✨ Habits",fields:["exercise","reading","meditation","water","vitamins","brushTeeth","nop"],headers:["🏋️","📚","🧘","💧","💊","🦷","💤"]}},m=JSON.parse(JSON.stringify(p));let u="";if(a&&r.bulkCategory==="whoop"&&(m.whoop.fields=m.whoop.fields.filter($=>!o.includes($)),m.whoop.headers=[],m.whoop.fields.length===0&&(u=`
        <div class="flex items-center gap-2 px-4 py-3 bg-[color-mix(in_srgb,var(--success)_8%,transparent)] border border-[color-mix(in_srgb,var(--success)_30%,transparent)] rounded-lg text-sm text-[var(--success)]">
          <span class="w-2 h-2 rounded-full bg-[var(--success)] flex-shrink-0"></span>
          All Whoop metrics are auto-synced. No manual entry needed.
        </div>
      `)),s&&r.bulkCategory==="glucose"){const $=m.glucose.fields,D=m.glucose.headers,R=[],M=[];$.forEach((J,W)=>{i.includes(J)||(R.push(J),M.push(D[W]))}),m.glucose.fields=R,m.glucose.headers=M,R.length>0&&(u=`
        <div class="flex items-center gap-2 px-4 py-3 bg-[color-mix(in_srgb,var(--success)_8%,transparent)] border border-[color-mix(in_srgb,var(--success)_30%,transparent)] rounded-lg text-sm text-[var(--success)]">
          <span class="w-2 h-2 rounded-full bg-[var(--success)] flex-shrink-0"></span>
          Avg & TIR are auto-synced by Libre. Only Insulin shown for manual entry.
        </div>
      `)}const h=m[r.bulkCategory];if(h.fields.length===0)return b2(t,n,m,p,u,e);let g="";const b=new Date().getFullYear();[b-3,b-2,b-1,b,b+1].forEach(function($){for(let D=0;D<12;D++){const R=new Date($,D).toLocaleDateString("en-US",{month:"short",year:"numeric"}),M=D===r.bulkMonth&&$===r.bulkYear?"selected":"";g+='<option value="'+D+"-"+$+'" '+M+">"+R+"</option>"}});let f="";for(let $=1;$<=e;$++){const D=r.bulkYear+"-"+String(r.bulkMonth+1).padStart(2,"0")+"-"+String($).padStart(2,"0"),R=r.allData[D]||Ur(),M=new Date(r.bulkYear,r.bulkMonth,$).toLocaleDateString("en-US",{weekday:"short"}),J=[0,6].includes(new Date(r.bulkYear,r.bulkMonth,$).getDay()),W=D===U(),w=Ie(R);let F="";h.fields.forEach(S=>{const L=R[r.bulkCategory][S];r.bulkCategory==="family"||r.bulkCategory==="habits"&&S==="vitamins"?F+='<td class="border border-[var(--border)] px-1 py-1 text-center"><label class="inline-flex min-h-[44px] min-w-[44px] items-center justify-center cursor-pointer"><input type="checkbox" '+(L?"checked":"")+` class="w-5 h-5 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]" onchange="updateBulkData('`+D+"', '"+r.bulkCategory+"', '"+S+`', this.checked ? '1' : '')"></label></td>`:r.bulkCategory==="prayers"&&S!=="quran"?F+='<td class="border border-[var(--border)] px-1 py-1 min-h-[44px]"><input type="text" value="'+(L||"")+`" placeholder="X.Y" class="input-field-sm w-full min-h-[44px] text-center font-mono border-0" onchange="updateBulkData('`+D+"', '"+r.bulkCategory+"', '"+S+`', this.value)"></td>`:F+='<td class="border border-[var(--border)] px-1 py-1 min-h-[44px]"><input type="number" step="any" value="'+(L||"")+`" class="input-field-sm w-full min-h-[44px] text-center border-0" onchange="updateBulkData('`+D+"', '"+r.bulkCategory+"', '"+S+`', this.value)"></td>`});const z=(J?"bg-[var(--bg-secondary)]/50 ":"")+(W?"bg-[var(--accent)]/10 ":"")+"hover:bg-[var(--bg-secondary)]",B="border border-[var(--border)] px-2 py-1 font-medium text-center text-[var(--text-primary)] sticky left-0 z-10 "+(W?"bg-[var(--accent)]/20":"bg-[var(--bg-card)]"),q="border border-[var(--border)] px-2 py-1 text-xs text-[var(--text-muted)] text-center sticky left-10 z-10 "+(W?"bg-[var(--accent)]/20":"bg-[var(--bg-card)]");f+='<tr class="'+z+'"><td class="'+B+'">'+$+'</td><td class="'+q+'">'+M+"</td>"+F+'<td id="score-'+D+'" class="border border-[var(--border)] px-2 py-1 text-center font-semibold text-[var(--accent)]">'+me(w.total)+"</td></tr>"}let x="";Object.entries(p).forEach(function([$,D]){const R=n[$],M=r.bulkCategory===$,J=M?"text-white shadow-sm":"bg-[var(--bg-secondary)] hover:bg-[var(--border)] text-[var(--text-secondary)]",W=M?"background-color: "+R:"";x+=`<button onclick="setBulkCategory('`+$+`')" class="px-4 py-1.5 rounded-full text-sm font-medium transition `+J+'" style="'+W+'">'+D.label+"</button>"});const k=n[r.bulkCategory];let T="";h.headers.forEach(function($){T+='<th class="border px-3 py-3 font-medium" style="border-color: '+k+'">'+$+"</th>"});let E=0,N=0;for(let $=1;$<=e;$++){const D=r.bulkYear+"-"+String(r.bulkMonth+1).padStart(2,"0")+"-"+String($).padStart(2,"0");r.allData[D]&&(N++,E+=Ie(r.allData[D]).total)}const I=N>0?Math.round(E/N):0,C=Math.round(N/e*100),H=r.bulkCategory==="prayers"?'<span class="ml-2 text-[var(--text-muted)]">X.Y format: 1 = on-time, 0.1 = late, 1.2 = 1 on-time + 2 late</span>':"",j=r.bulkCategory==="family"?'<span class="ml-2 text-[var(--text-muted)]">Check box if you connected with that person</span>':"";return`<div class="space-y-4"><div class="flex flex-wrap items-end gap-4"><div><label class="text-xs text-[var(--text-muted)] block mb-1.5">Month</label><select onchange="const [m,y] = this.value.split('-'); setBulkMonth(m, y)" class="input-field">`+g+'</select></div><div class="flex gap-1.5 flex-wrap">'+x+"</div></div>"+(u?'<div class="mt-2">'+u+"</div>":"")+'<div class="rounded-lg px-3 py-2 text-sm flex items-center gap-2" style="background-color: color-mix(in srgb, '+k+" 7%, transparent); border-left: 3px solid "+k+'"><strong class="text-[var(--text-primary)]">'+t+'</strong><span class="text-[var(--text-secondary)]">'+h.label+"</span>"+H+j+'</div><div class="rounded-lg border border-[var(--border-light)] overflow-hidden bg-[var(--bg-card)]"><div class="overflow-x-auto" style="-webkit-overflow-scrolling: touch"><table class="w-full text-sm" style="min-width: 480px"><thead><tr class="text-white" style="background-color: '+k+'"><th class="border px-2 py-3 sticky left-0 z-20" style="border-color: '+k+"; background-color: "+k+'">Day</th><th class="border px-2 py-3 sticky left-10 z-20" style="border-color: '+k+"; background-color: "+k+'"></th>'+T+'<th class="border px-3 py-3 font-medium" style="border-color: '+k+'">Score</th></tr></thead><tbody>'+f+'</tbody></table></div></div><div class="grid grid-cols-2 md:grid-cols-4 gap-3"><div class="bg-[var(--bg-secondary)] rounded-lg p-4 text-center border border-[var(--border-light)]"><div id="bulk-days-logged" class="text-2xl font-bold text-[var(--text-primary)]">'+me(N)+'</div><div class="text-xs text-[var(--text-muted)] mt-1">Days Logged</div></div><div class="bg-[var(--bg-secondary)] rounded-lg p-4 text-center border border-[var(--border-light)]"><div id="bulk-total-score" class="text-2xl font-bold text-[var(--accent)]">'+me(E)+'</div><div class="text-xs text-[var(--text-muted)] mt-1">Total Score</div></div><div class="bg-[var(--bg-secondary)] rounded-lg p-4 text-center border border-[var(--border-light)]"><div id="bulk-avg-score" class="text-2xl font-bold text-[var(--text-primary)]">'+me(I)+'</div><div class="text-xs text-[var(--text-muted)] mt-1">Avg Daily Score</div></div><div class="bg-[var(--bg-secondary)] rounded-lg p-4 text-center border border-[var(--border-light)]"><div id="bulk-completion" class="text-2xl font-bold text-[var(--text-primary)]">'+C+'%</div><div class="text-xs text-[var(--text-muted)] mt-1">Completion Rate</div></div></div></div>'}function b2(e,t,n,a,s,o){let i="";const l=new Date().getFullYear();[l-3,l-2,l-1,l,l+1].forEach(function(g){for(let b=0;b<12;b++){const y=new Date(g,b).toLocaleDateString("en-US",{month:"short",year:"numeric"}),f=b===r.bulkMonth&&g===r.bulkYear?"selected":"";i+='<option value="'+b+"-"+g+'" '+f+">"+y+"</option>"}});let c="";Object.entries(a).forEach(function([g,b]){const y=t[g],f=r.bulkCategory===g,x=f?"text-white shadow-sm":"bg-[var(--bg-secondary)] hover:bg-[var(--border)] text-[var(--text-secondary)]",k=f?"background-color: "+y:"";c+=`<button onclick="setBulkCategory('`+g+`')" class="px-4 py-1.5 rounded-full text-sm font-medium transition `+x+'" style="'+k+'">'+b.label+"</button>"});let p=0,m=0;for(let g=1;g<=o;g++){const b=r.bulkYear+"-"+String(r.bulkMonth+1).padStart(2,"0")+"-"+String(g).padStart(2,"0");r.allData[b]&&(m++,p+=Ie(r.allData[b]).total)}const u=m>0?Math.round(p/m):0,h=Math.round(m/o*100);return`<div class="space-y-4"><div class="flex flex-wrap items-end gap-4"><div><label class="text-xs text-[var(--text-muted)] block mb-1.5">Month</label><select onchange="const [m,y] = this.value.split('-'); setBulkMonth(m, y)" class="input-field">`+i+'</select></div><div class="flex gap-1.5 flex-wrap">'+c+"</div></div>"+s+(s?`<p class="text-sm text-[var(--text-secondary)]">Switch to another category to log data, or <button type="button" onclick="window.switchTab('life'); window.switchSubTab('daily')" class="text-[var(--accent)] font-medium hover:underline">go to Daily Entry</button>.</p>`:"")+'<div class="grid grid-cols-2 md:grid-cols-4 gap-3"><div class="bg-[var(--bg-secondary)] rounded-lg p-4 text-center border border-[var(--border-light)]"><div id="bulk-days-logged" class="text-2xl font-bold text-[var(--text-primary)]">'+me(m)+'</div><div class="text-xs text-[var(--text-muted)] mt-1">Days Logged</div></div><div class="bg-[var(--bg-secondary)] rounded-lg p-4 text-center border border-[var(--border-light)]"><div id="bulk-total-score" class="text-2xl font-bold text-[var(--accent)]">'+me(p)+'</div><div class="text-xs text-[var(--text-muted)] mt-1">Total Score</div></div><div class="bg-[var(--bg-secondary)] rounded-lg p-4 text-center border border-[var(--border-light)]"><div id="bulk-avg-score" class="text-2xl font-bold text-[var(--text-primary)]">'+me(u)+'</div><div class="text-xs text-[var(--text-muted)] mt-1">Avg Daily Score</div></div><div class="bg-[var(--bg-secondary)] rounded-lg p-4 text-center border border-[var(--border-light)]"><div id="bulk-completion" class="text-2xl font-bold text-[var(--text-primary)]">'+h+'%</div><div class="text-xs text-[var(--text-muted)] mt-1">Completion Rate</div></div></div></div>'}function So(e){return window.getFilteredTasks(e)}function y2(){return window.getCurrentFilteredTasks()}function w2(){return window.getCurrentViewInfo()}function x2(e){return window.groupTasksByDate(e)}function k2(e){return window.groupTasksByCompletionDate(e)}function S2(e){return window.getTasksByCategory(e)}function T2(e){return window.getTasksByLabel(e)}function cf(e){return window.renderNotesOutliner(e)}function uf(){return window.renderNotesBreadcrumb()}function I2(e){return typeof window.renderTriggersOutliner=="function"?window.renderTriggersOutliner(e):""}function $2(){return typeof window.renderTriggersBreadcrumb=="function"?window.renderTriggersBreadcrumb():""}function Ks(e,t,n,a,s){const o=e.filter(g=>g.dueDate&&g.dueDate<t),i=e.filter(g=>!o.includes(g)&&(g.today||g.dueDate===t)),l=e.filter(g=>g.dueDate&&g.dueDate>t&&!i.includes(g)),d=e.filter(g=>g.deferDate&&g.deferDate>t&&!o.includes(g)&&!l.includes(g)),c=e.filter(g=>g.status==="anytime"&&!o.includes(g)&&!i.includes(g)&&!l.includes(g)&&!d.includes(g)),p=e.filter(g=>g.status==="someday"),m=e.filter(g=>g.status==="inbox"),u=(g,b,y,f="")=>`
    <div class="px-4 py-2 border-t border-[var(--border-light)]">
      <button onclick="window.createTask('', { status: '${g}', ${f} ${a} }); setTimeout(() => { const tasks = window.tasksData.filter(t => !t.isNote && !t.title && ${s} && !t.completed); if (tasks.length) window.focusTaskInlineTitle(tasks[tasks.length-1].id); }, 100);"
        class="flex items-center gap-2 px-3 py-2 w-full text-sm hover:bg-opacity-50 rounded-lg transition text-left" style="color: ${y}">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
        ${b}
      </button>
    </div>`;return`
    ${o.length+i.length+l.length+d.length+m.length+c.length+p.length>0?"":`
      <div class="text-center py-12 text-[var(--text-muted)]">
        <p class="text-sm font-medium mb-2">No tasks yet</p>
        ${u("anytime","Add a task...",n)}
      </div>
    `}
    ${o.length>0?`
      <div class="bg-[var(--bg-card)] rounded-lg overflow-hidden" style="border: 1px solid color-mix(in srgb, var(--overdue-color) 12%, transparent)">
        <div class="px-4 py-3 flex items-center gap-2" style="background: color-mix(in srgb, var(--overdue-color) 3%, transparent); border-bottom: 1px solid color-mix(in srgb, var(--overdue-color) 12%, transparent)">
          <svg class="w-4 h-4" style="color: var(--overdue-color)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span class="text-sm font-semibold" style="color: var(--overdue-color)">Overdue</span>
          <span class="text-xs ml-1" style="color: var(--overdue-color); opacity: 0.6">${o.length}</span>
        </div>
        <div class="task-list">${o.map(g=>ye(g)).join("")}</div>
      </div>
    `:""}

    ${i.length>0?`
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
        <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2" style="background: color-mix(in srgb, var(--today-color) 3%, transparent)">
          <svg class="w-4 h-4" style="color: var(--today-color)" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Today</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${i.length}</span>
        </div>
        <div class="task-list">${i.map(g=>ye(g,!1)).join("")}</div>
        ${u("anytime","Add to Today...","var(--today-color)","today: true,")}
      </div>
    `:""}

    ${l.length>0?`
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
        <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
          <svg class="w-4 h-4" style="color: var(--overdue-color)" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Upcoming</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${l.length}</span>
        </div>
        <div class="task-list">${l.map(g=>ye(g)).join("")}</div>
      </div>
    `:""}

    ${d.length>0?`
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
        <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
          <svg class="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span class="text-sm font-semibold text-[var(--text-muted)]">Deferred</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${d.length}</span>
        </div>
        <div class="task-list">${d.map(g=>ye(g)).join("")}</div>
      </div>
    `:""}

    ${m.length>0?`
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
        <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
          <svg class="w-4 h-4" style="color: var(--inbox-color)" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/></svg>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Inbox</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${m.length}</span>
        </div>
        <div class="task-list">${m.map(g=>ye(g)).join("")}</div>
        ${u("anytime","Add Task...","var(--inbox-color)")}
      </div>
    `:""}

    ${c.length>0?`
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
        <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
          <svg class="w-4 h-4" style="color: var(--anytime-color)" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Anytime</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${c.length}</span>
        </div>
        <div class="task-list">${c.map(g=>ye(g)).join("")}</div>
        ${u("anytime","Add to Anytime...","var(--anytime-color)")}
      </div>
    `:""}

    ${p.length>0?`
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
        <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center gap-2">
          <svg class="w-4 h-4" style="color: var(--someday-color)" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
          <span class="text-sm font-semibold text-[var(--text-primary)]">Someday</span>
          <span class="text-xs text-[var(--text-muted)] ml-1">${p.length}</span>
        </div>
        <div class="task-list">${p.map(g=>ye(g)).join("")}</div>
        ${u("someday","Add to Someday...","var(--someday-color)")}
      </div>
    `:""}
  `}function Ys(e,t,n){return`
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
        ${uf()}
        <div class="py-2">${cf(n)}</div>
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
  `}function pf(e,t,n){return`
    <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
      <div class="px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span style="color: var(--today-color)">${V().trigger.replace("w-5 h-5","w-4 h-4")}</span>
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
        ${$2()}
        <div class="py-2">${I2(n)}</div>
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
  `}function ye(e,t=!0,n=!1){const a=jt(),s=Je(e.areaId),o=e.categoryId?Qe(e.categoryId):null,i=(e.labels||[]).map(x=>Rs(x)).filter(Boolean),l=(e.people||[]).map(x=>Bs(x)).filter(Boolean),d=U(),c=e.dueDate&&e.dueDate<d&&!e.completed,p=e.dueDate===d,m=e.dueDate&&!p&&!c&&(()=>{const x=(new Date(e.dueDate+"T00:00:00")-new Date(d+"T00:00:00"))/864e5;return x>0&&x<=2})(),u=!n&&(s||o||i.length>0||l.length>0||t&&e.dueDate||e.deferDate||e.repeat&&e.repeat.type!=="none"||e.notes),h=r.inlineEditingTaskId===e.id,g=e.indent||0,b=g*24,y=[];if(s&&o)y.push(`${v(s.name)} › ${v(o.name)}`);else if(s)y.push(v(s.name));else if(o){const x=Je(o.areaId);y.push(x?`${v(x.name)} › ${v(o.name)}`:v(o.name))}if(i.length>0&&y.push(i.map(x=>v(x.name)).join(", ")),l.length>0&&y.push(l.map(x=>v(x.name.split(" ")[0])).join(", ")),e.deferDate&&y.push(`Start ${ve(e.deferDate)}`),t&&e.dueDate&&y.push(`Due ${ve(e.dueDate)}`),e.repeat&&e.repeat.type!=="none"&&y.push("Repeats"),e.notes&&y.push("Notes"),e.timeEstimate&&y.push(`⏱️ ${e.timeEstimate}m`),n)return`
      <div class="task-item compact-task group relative hover:bg-[var(--bg-secondary)]/50 rounded-lg transition cursor-pointer"
        onclick="window.inlineEditingTaskId=null; window.editingTaskId='${e.id}'; window.showTaskModal=true; window.render()">
        <div class="flex items-center min-h-[32px] px-2 py-0.5">
          ${e.isNote?`
            <div class="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-accent)]"></div>
            </div>
          `:`
            <button onclick="event.stopPropagation(); window.toggleTaskComplete('${e.id}')"
              aria-label="${e.completed?"Mark task as incomplete":"Mark task as complete"}: ${v(e.title)}"
              class="task-checkbox w-[18px] h-[18px] rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center transition-all ${e.completed?"completed bg-[var(--accent)] border-[var(--accent)] text-white":"border-[var(--text-muted)] hover:border-[var(--accent)]"}">
              ${e.completed?'<svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>':""}
            </button>
          `}
          <span class="flex-1 ml-2.5 text-[13px] leading-snug truncate ${e.completed?"line-through text-[var(--text-muted)]":"text-[var(--text-primary)]"}">
            ${e.flagged?`<span class="inline-flex items-center mr-1" style="color: var(--flagged-color)">${V().flagged.replace("w-5 h-5","w-3 h-3")}</span>`:""}
            ${v(e.title)}
          </span>
          <div class="flex items-center gap-1.5 ml-2 flex-shrink-0 min-w-0 text-[11px]">
            ${s?`<span class="text-[var(--text-muted)] truncate max-w-[70px] sm:max-w-[90px]">${v(s.name)}${o?" › "+v(o.name):""}</span>`:""}
            ${e.dueDate?`<span class="flex-shrink-0 ${c?"font-medium":p?"text-[var(--accent)] font-medium":m?"font-medium":"text-[var(--text-muted)]"}" style="${c?"color: var(--overdue-color)":m?"color: var(--flagged-color)":""}">${ve(e.dueDate)}</span>`:""}
            ${e.repeat&&e.repeat.type!=="none"?`<span class="text-[var(--text-muted)]" title="Repeats ${e.repeat.interval>1?"every "+e.repeat.interval+" ":""}${e.repeat.type}"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg></span>`:""}
          </div>
        </div>
      </div>
    `;const f=`
    <div class="task-item group relative ${u&&y.length?"has-meta":"no-meta"}${e.isNote?" is-note":""}"
      draggable="${h||a?"false":"true"}"
      ${h||a?"":`ondragstart="window.handleDragStart(event, '${e.id}')"
      ondragend="window.handleDragEnd(event)"
      ondragover="window.handleDragOver(event, '${e.id}')"
      ondragleave="window.handleDragLeave(event)"
      ondrop="window.handleDrop(event, '${e.id}')"`}
      onclick="if(window.isTouchDevice && window.isTouchDevice() && !event.target.closest('.task-inline-title') && !event.target.closest('.task-checkbox') && !event.target.closest('button') && !event.target.closest('.swipe-action-btn')) { window.editingTaskId='${e.id}'; window.showTaskModal=true; window.render(); }">
      <div class="task-row flex items-start gap-3 px-4 py-2.5" style="${g>0?`padding-left: ${16+b}px`:""}">
        ${e.isNote?`
          <div class="mt-2 w-1.5 h-1.5 rounded-full ${g>0?"bg-[var(--notes-accent)]/50":"bg-[var(--notes-accent)]"} flex-shrink-0"></div>
        `:`
          <button onclick="event.stopPropagation(); window.toggleTaskComplete('${e.id}')"
            aria-label="${e.completed?"Mark task as incomplete":"Mark task as complete"}: ${v(e.title)}"
            class="task-checkbox mt-0.5 w-[18px] h-[18px] rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center transition-all ${e.completed?"completed bg-[var(--accent)] border-[var(--accent)] text-white":"border-[var(--text-muted)] hover:border-[var(--accent)]"}">
            ${e.completed?'<svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>':""}
          </button>
        `}
        <div class="flex-1 min-w-0">
          <div class="flex items-start gap-1">
            ${e.flagged?`<span class="inline-flex items-center mt-0.5 flex-shrink-0" style="color: var(--flagged-color)">${V().flagged.replace("w-5 h-5","w-3 h-3")}</span>`:""}
            <div contenteditable="${e.completed?"false":"true"}"
              class="task-inline-title flex-1 text-[15px] ${e.completed?"line-through text-[var(--text-muted)]":"text-[var(--text-primary)]"} leading-snug outline-none"
              data-task-id="${e.id}"
              data-placeholder="Task title..."
              onfocus="event.stopPropagation(); window.handleTaskInlineFocus(event, '${e.id}')"
              onblur="window.handleTaskInlineBlur(event, '${e.id}')"
              onkeydown="window.handleTaskInlineKeydown(event, '${e.id}')"
              oninput="window.handleTaskInlineInput(event, '${e.id}')"
              onpaste="window.handleTaskInlinePaste(event)"
            >${v(e.title)}</div>
          </div>
          ${u&&y.length?`
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
              class="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-md transition ${g===0?"opacity-30 cursor-not-allowed":""}" title="Outdent (Shift+Tab)">
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
            aria-label="Edit task: ${v(e.title)}"
            class="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-md transition" title="Edit">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button onclick="event.stopPropagation(); window.confirmDeleteTask('${e.id}')"
            aria-label="Delete task: ${v(e.title)}"
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
        <div class="swipe-row-content">${f}</div>
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
    `:f}function ff(e,t,n){if(!e)return"";const a=t,s=a.length,o=r.tasksData.filter(f=>f.areaId===r.activeAreaFilter&&f.completed&&!f.isNote).length,i=a.filter(f=>!f.isNote).length,l=a.filter(f=>f.isNote),d=a.filter(f=>!f.isNote),c=r.workspaceContentMode!=="notes",p=r.workspaceContentMode!=="tasks",m=d.filter(f=>f.dueDate&&f.dueDate<n).length,u=d.filter(f=>!(f.dueDate&&f.dueDate<n)&&(f.today||f.dueDate===n)).length,h=`areaId: '${e.id}'`,g=`t.areaId === '${e.id}'`,b=i+o>0?Math.round(o/(i+o)*100):0,y=e.color||"var(--accent)";return`
    <div class="flex-1 space-y-4">
      <!-- Area Hero Header -->
      <div class="area-hero bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl" style="background: color-mix(in srgb, ${y} 12%, transparent); color: ${y}">
              ${e.emoji||'<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>'}
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight">${v(e.name)}</h1>
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
                  stroke-dasharray="${b} 100" stroke-linecap="round"/>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[var(--text-primary)]">${b}%</span>
            </div>
            <div>
              <div class="text-[13px] font-medium text-[var(--text-primary)]">Progress</div>
              <div class="text-[11px] text-[var(--text-muted)]">${o} of ${i+o}</div>
            </div>
          </div>
          ${m>0?`
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--overdue-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--overdue-color)"></span>
              ${m} overdue
            </div>
          `:""}
          ${u>0?`
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--today-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--today-color)"></span>
              ${u} today
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
      ${(()=>{const f=_r(e.id);return`
        <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
          <div class="px-4 py-3 ${f.length>0?"border-b border-[var(--border-light)]":""} flex items-center justify-between">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-[var(--text-muted)]" fill="currentColor" viewBox="0 0 24 24"><path d="M2 6a2 2 0 012-2h5.586a1 1 0 01.707.293L12 6h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/><path d="M2 8h20v10a2 2 0 01-2 2H4a2 2 0 01-2-2V8z" opacity="0.85"/></svg>
              <span class="text-sm font-semibold text-[var(--text-primary)]">Categories</span>
              ${f.length>0?`<span class="text-xs text-[var(--text-muted)] ml-1">${f.length}</span>`:""}
            </div>
            <button onclick="event.stopPropagation(); window.editingAreaId='${e.id}'; window.showAreaModal=true; window.render()"
              class="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Edit
            </button>
          </div>
          ${f.length>0?`
          <div class="divide-y divide-[var(--border-light)]">
            ${f.map(x=>{const k=r.tasksData.filter(E=>E.categoryId===x.id&&!E.completed&&!E.isNote).length,T=x.color||y;return`
              <button onclick="window.showCategoryTasks('${x.id}')"
                class="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-[var(--bg-secondary)] transition group">
                <span class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm" style="background: color-mix(in srgb, ${T} 12%, transparent); color: ${T}">
                  ${x.emoji||'<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V5a2 2 0 012-2h4.586a1 1 0 01.707.293L12 5h7a2 2 0 012 2v2"/><rect x="2" y="9" width="20" height="12" rx="2"/></svg>'}
                </span>
                <span class="flex-1 text-[14px] text-[var(--text-primary)] truncate">${v(x.name)}</span>
                <span class="text-xs text-[var(--text-muted)]">${k||""}</span>
                <svg class="w-4 h-4 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
              </button>`}).join("")}
          </div>`:""}
          <div class="px-4 py-2 ${f.length>0?"border-t border-[var(--border-light)]":""}">
            <button onclick="event.stopPropagation(); window.editingCategoryId=null; window.showCategoryModal=true; window.modalSelectedArea='${e.id}'; window.render()"
              class="flex items-center gap-2 px-3 py-2 w-full text-sm text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] rounded-lg transition text-left">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
              Add Category
            </button>
          </div>
        </div>`})()}

      <!-- Task Sections -->
      <div class="space-y-4">
        ${c?Ks(d,n,y,h,g):""}
        ${p?Ys(l,`'${e.id}'`,e.id):""}
        ${pf(r.triggers.filter(f=>f.areaId===e.id&&!f.categoryId),`{areaId:'${e.id}'}`,{areaId:e.id})}

        ${s===0?`
          <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] py-16">
            <div class="flex flex-col items-center justify-center text-[var(--text-muted)]">
              <div class="w-20 h-20 rounded-lg flex items-center justify-center mb-4" style="background: color-mix(in srgb, ${y} 6%, transparent)">
                <svg class="w-10 h-10" style="color: ${y}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
              </div>
              <p class="text-lg font-medium text-[var(--text-muted)] mb-1">No items yet</p>
              <p class="text-sm text-[var(--text-muted)] mb-4">Add your first task or note to ${v(e.name)}</p>
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
  `}function C2(e,t,n){if(!e)return"";const a=Je(e.areaId),s=t,o=r.tasksData.filter(f=>f.categoryId===e.id&&f.completed&&!f.isNote).length,i=s.filter(f=>!f.isNote).length,l=s.filter(f=>f.isNote),d=s.filter(f=>!f.isNote),c=r.workspaceContentMode!=="notes",p=r.workspaceContentMode!=="tasks",m=d.filter(f=>f.dueDate&&f.dueDate<n).length,u=d.filter(f=>!(f.dueDate&&f.dueDate<n)&&(f.today||f.dueDate===n)).length,h=i+o>0?Math.round(o/(i+o)*100):0,g=e.color||"var(--accent)",b=`areaId: '${e.areaId}', categoryId: '${e.id}'`,y=`t.categoryId === '${e.id}'`;return`
    <div class="flex-1 space-y-4">
      <!-- Category Hero Header -->
      <div class="area-hero bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl" style="background: color-mix(in srgb, ${g} 12%, transparent); color: ${g}">
              ${e.emoji||'<svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9V5a2 2 0 012-2h4.586a1 1 0 01.707.293L12 5h7a2 2 0 012 2v2"/><rect x="2" y="9" width="20" height="12" rx="2"/></svg>'}
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight">${v(e.name)}</h1>
              <div class="flex items-center gap-2 mt-1">
                ${a?`
                  <button onclick="window.showAreaTasks('${a.id}')" class="inline-flex items-center gap-1.5 text-[13px] text-[var(--text-muted)] hover:text-[var(--accent)] transition">
                    <span class="w-2 h-2 rounded-full" style="background:${a.color||"var(--accent)"}"></span>
                    ${v(a.name)}
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
                <circle cx="18" cy="18" r="15" fill="none" stroke="${g}" stroke-width="2.5"
                  stroke-dasharray="${h} 100" stroke-linecap="round"/>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[var(--text-primary)]">${h}%</span>
            </div>
            <div>
              <div class="text-[13px] font-medium text-[var(--text-primary)]">Progress</div>
              <div class="text-[11px] text-[var(--text-muted)]">${o} of ${i+o}</div>
            </div>
          </div>
          ${m>0?`
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--overdue-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--overdue-color)"></span>
              ${m} overdue
            </div>
          `:""}
          ${u>0?`
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--today-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--today-color)"></span>
              ${u} today
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
              class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-[13px] font-medium hover:opacity-90 transition" style="background: ${g}">
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
            ${r.quickAddIsNote?'<div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-color)]"></div>':`<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed flex-shrink-0" style="border-color: color-mix(in srgb, ${g} 25%, transparent)"></div>`}
          </div>
          <input type="text" id="quick-add-input"
            placeholder="${r.quickAddIsNote?"New Note":"New To-Do"}"
            onkeydown="window.handleQuickAddKeydown(event, this)"
            class="flex-1 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-transparent border-0 outline-none focus:ring-0">
          <button onclick="window.quickAddTask(document.getElementById('quick-add-input'))"
            class="text-[var(--text-muted)] hover:opacity-70 transition p-1" style="color: ${g}">
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
        ${c?Ks(d,n,g,b,y):""}
        ${p?Ys(l,`{areaId:'${e.areaId}',categoryId:'${e.id}'}`,{categoryId:e.id}):""}
        ${pf(r.triggers.filter(f=>f.areaId===e.areaId&&f.categoryId===e.id),`{areaId:'${e.areaId}',categoryId:'${e.id}'}`,{areaId:e.areaId,categoryId:e.id})}

        ${t.length===0?`
          <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
            <div class="empty-state flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
              <svg class="w-16 h-16 mb-4 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
              <p class="text-[15px] font-medium">No tasks in ${v(e.name)}</p>
              <p class="text-[13px] mt-1">Add a task to get started</p>
            </div>
          </div>
        `:""}
      </div>
    </div>
  `}function E2(e,t,n){if(!e)return"";const a=r.tasksData.filter(f=>(f.labels||[]).includes(e.id)&&f.completed&&!f.isNote).length,s=t.filter(f=>!f.isNote),o=t.filter(f=>f.isNote),i=r.workspaceContentMode!=="notes",l=r.workspaceContentMode!=="tasks",d=s.length,c=e.color||"var(--notes-color)",p=s.filter(f=>f.dueDate&&f.dueDate<n).length,m=s.filter(f=>f.today||f.dueDate===n).length,u=d+a>0?Math.round(a/(d+a)*100):0,h=`labels: ['${e.id}']`,g=`(t.labels||[]).includes('${e.id}')`,b=`{labelId:'${e.id}'}`,y={labelId:e.id};return`
    <div class="flex-1 space-y-4">
      <!-- Label Hero Header -->
      <div class="area-hero bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style="background: color-mix(in srgb, ${c} 12%, transparent)">
              <span class="w-5 h-5 rounded-full" style="background: ${c}"></span>
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight">${v(e.name)}</h1>
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
                  stroke-dasharray="${u} 100" stroke-linecap="round"/>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[var(--text-primary)]">${u}%</span>
            </div>
            <div>
              <div class="text-[13px] font-medium text-[var(--text-primary)]">Progress</div>
              <div class="text-[11px] text-[var(--text-muted)]">${a} of ${d+a}</div>
            </div>
          </div>
          ${p>0?`
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--overdue-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--overdue-color)"></span>
              ${p} overdue
            </div>
          `:""}
          ${m>0?`
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--today-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--today-color)"></span>
              ${m} today
            </div>
          `:""}
          <div class="flex-1"></div>
          <div class="flex items-center gap-2">
            <button onclick="window.createRootNote(${b})"
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
          <button onclick="window.createRootNote(${b})"
            class="area-chip area-chip-action area-chip-note">+ Note</button>
        </div>
      </div>

      <!-- Task Sections -->
      <div class="space-y-4">
        ${i?Ks(s,n,c,h,g):""}
        ${l?Ys(o,b,y):""}

        ${t.length===0?`
          <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] py-16">
            <div class="flex flex-col items-center justify-center text-[var(--text-muted)]">
              <div class="w-20 h-20 rounded-lg flex items-center justify-center mb-4" style="background: color-mix(in srgb, ${c} 6%, transparent)">
                <span class="w-10 h-10 rounded-full" style="background: ${c}"></span>
              </div>
              <p class="text-lg font-medium text-[var(--text-muted)] mb-1">No items yet</p>
              <p class="text-sm text-[var(--text-muted)] mb-4">Add your first task or note to ${v(e.name)}</p>
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
  `}function D2(e,t,n){if(!e)return"";const a=r.tasksData.filter(f=>(f.people||[]).includes(e.id)&&f.completed&&!f.isNote).length,s=t.filter(f=>!f.isNote),o=t.filter(f=>f.isNote),i=r.workspaceContentMode!=="notes",l=r.workspaceContentMode!=="tasks",d=s.length,c="var(--accent)",p=s.filter(f=>f.dueDate&&f.dueDate<n).length,m=s.filter(f=>f.today||f.dueDate===n).length,u=d+a>0?Math.round(a/(d+a)*100):0,h=`people: ['${e.id}']`,g=`(t.people||[]).includes('${e.id}')`,b=`{personId:'${e.id}'}`,y={personId:e.id};return`
    <div class="flex-1 space-y-4">
      <!-- Person Hero Header -->
      <div class="area-hero bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            ${e.photoData?`<img src="${e.photoData}" alt="" class="w-12 h-12 rounded-lg object-cover flex-shrink-0" referrerpolicy="no-referrer">`:`<div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl" style="background: color-mix(in srgb, ${c} 12%, transparent); color: ${c}">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>`}
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight">${v(e.name)}</h1>
              ${e.jobTitle||e.email?`
                <p class="text-[var(--text-muted)] text-[13px] mt-1">${[e.jobTitle,e.email].filter(Boolean).map(f=>v(f)).join(" &middot; ")}</p>
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
                  stroke-dasharray="${u} 100" stroke-linecap="round"/>
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[var(--text-primary)]">${u}%</span>
            </div>
            <div>
              <div class="text-[13px] font-medium text-[var(--text-primary)]">Progress</div>
              <div class="text-[11px] text-[var(--text-muted)]">${a} of ${d+a}</div>
            </div>
          </div>
          ${p>0?`
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--overdue-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--overdue-color)"></span>
              ${p} overdue
            </div>
          `:""}
          ${m>0?`
            <div class="flex items-center gap-1.5 text-xs font-medium" style="color: var(--today-color)">
              <span class="w-2 h-2 rounded-full" style="background: var(--today-color)"></span>
              ${m} today
            </div>
          `:""}
          <div class="flex-1"></div>
          <div class="flex items-center gap-2">
            <button onclick="window.createRootNote(${b})"
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
          <button onclick="window.createRootNote(${b})"
            class="area-chip area-chip-action area-chip-note">+ Note</button>
        </div>
      </div>

      <!-- Task Sections -->
      <div class="space-y-4">
        ${i?Ks(s,n,c,h,g):""}
        ${l?Ys(o,b,y):""}

        ${t.length===0?`
          <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] py-16">
            <div class="flex flex-col items-center justify-center text-[var(--text-muted)]">
              <div class="w-20 h-20 rounded-lg flex items-center justify-center mb-4" style="background: color-mix(in srgb, ${c} 6%, transparent)">
                <svg class="w-10 h-10" style="color: ${c}" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </div>
              <p class="text-lg font-medium text-[var(--text-muted)] mb-1">No items yet</p>
              <p class="text-sm text-[var(--text-muted)] mb-4">Add your first task or note for ${v(e.name)}</p>
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
  `}function A2(){V();const e=r.tasksData.filter(n=>!n.completed&&!n.isNote),t=[...r.taskLabels].sort((n,a)=>{const s=e.filter(i=>(i.labels||[]).includes(n.id)).length;return e.filter(i=>(i.labels||[]).includes(a.id)).length-s||n.name.localeCompare(a.name)});return`
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
                <span class="font-medium text-[var(--text-primary)] text-[14px] truncate">${v(n.name)}</span>
              </div>
              <p class="text-xs text-[var(--text-muted)]">${a} active task${a!==1?"s":""}</p>
            </button>`}).join("")}
      </div>
    </div>`}function M2(){V();const e=r.tasksData.filter(n=>!n.completed&&!n.isNote),t=[...r.taskPeople].sort((n,a)=>{const s=e.filter(i=>(i.people||[]).includes(n.id)).length;return e.filter(i=>(i.people||[]).includes(a.id)).length-s||n.name.localeCompare(a.name)});return`
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
                ${Er(n,32)}
                <div class="min-w-0">
                  <span class="block font-medium text-[var(--text-primary)] text-[14px] truncate">${v(n.name)}</span>
                  ${n.jobTitle?`<span class="block text-[11px] text-[var(--text-muted)] truncate">${v(n.jobTitle)}</span>`:""}
                </div>
              </div>
              <p class="text-xs text-[var(--text-muted)]">${a} active task${a!==1?"s":""}</p>
            </button>`}).join("")}
      </div>
    </div>`}function P2(e,t,n){if(!e)return"";const a=t.length,s=e.color||"var(--accent)";return`
    <div class="flex-1 space-y-4">
      <!-- Perspective Hero Header -->
      <div class="area-hero bg-[var(--bg-card)] rounded-lg overflow-hidden border border-[var(--border-light)]">
        <div class="px-6 pt-6 pb-5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 text-2xl" style="background: color-mix(in srgb, ${s} 12%, transparent); color: ${s}">
              ${e.icon||"📌"}
            </div>
            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-bold text-[var(--text-primary)] leading-tight">${v(e.name)}</h1>
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
          <div class="task-list">${t.map(o=>ye(o)).join("")}</div>
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
  `}function N2(){r.activePerspective==="calendar"&&(r.activePerspective="inbox",De()),[...Ee,...r.customPerspectives];const e=y2(),t=w2(),n=r.activeAreaFilter?Je(r.activeAreaFilter):null,a={},s=U();Ee.forEach(w=>{w.id==="today"?a[w.id]=So("today").length:a[w.id]=So(w.id).length}),a.notes=r.tasksData.filter(w=>w.isNote&&!w.completed).length,r.customPerspectives.forEach(w=>{a[w.id]=So(w.id).length});const o=7,i=new Date;i.setDate(i.getDate()-o);const l=r.tasksData.filter(w=>w.completed||w.isNote||w.status==="someday"||!w.areaId?!1:w.lastReviewedAt?new Date(w.lastReviewedAt)<i:!0).length,d={};r.taskAreas.forEach(w=>{d[w.id]=S2(w.id).length});const c={};r.taskLabels.forEach(w=>{c[w.id]=T2(w.id).length});const p={};r.taskPeople.forEach(w=>{p[w.id]=ol(w.id).length});const m=w=>r.activeFilterType==="perspective"&&r.activePerspective===w,u=w=>r.activeFilterType==="area"&&r.activeAreaFilter===w,h=w=>r.activeFilterType==="subcategory"&&r.activeCategoryFilter===w,g=w=>r.activeFilterType==="label"&&r.activeLabelFilter===w,b=w=>r.activeFilterType==="person"&&r.activePersonFilter===w,y=r.activeFilterType==="perspective"&&r.activePerspective==="notes"?"notes":r.workspaceContentMode||"both",f=r.activePerspective==="notes"||y==="notes",x=!!r.workspaceSidebarCollapsed,k=`
      <div class="workspace-mode-control" role="group" aria-label="Workspace content mode">
        ${[{id:"tasks",label:"Tasks"},{id:"both",label:"Both"},{id:"notes",label:"Notes"}].map(F=>{const z=r.activeFilterType==="perspective"&&r.activePerspective==="notes"&&F.id!=="notes",B=y===F.id,q=z?"":`window.state.workspaceContentMode='${F.id}'; window.saveViewState(); window.render();`;return`
            <button
              type="button"
              ${z?"disabled":""}
              onclick="${q}"
              class="workspace-mode-btn ${B?"active":""}"
              title="${z?"All Notes view is locked to Notes mode":`Show ${F.label.toLowerCase()} only`}">
              ${F.label}
            </button>
          `}).join("")}
      </div>
    `,T=r.activeFilterType==="area"?r.activeAreaFilter:r.activeFilterType==="subcategory"?Qe(r.activeCategoryFilter)?.areaId:null,E=r.activeFilterType==="subcategory"?r.activeCategoryFilter:null;`${k}${Ee.map(w=>`
            <button onclick="window.showPerspectiveTasks('${w.id}')" class="workspace-chip ${m(w.id)?"active":""}">
              <span class="workspace-chip-icon" style="color:${w.color}">${w.icon}</span>
              <span>${w.name}</span>
              <span class="workspace-chip-count">${a[w.id]||""}</span>
            </button>
          `).join("")}`,m("notes"),`${ze.color}${ze.icon}${a.notes||""}${r.customPerspectives.map(w=>`
            <button onclick="window.showPerspectiveTasks('${w.id}')" class="workspace-chip ${m(w.id)?"active":""}">
              <span class="workspace-chip-icon">${w.icon||"📌"}</span>
              <span>${v(w.name)}</span>
              <span class="workspace-chip-count">${a[w.id]||""}</span>
            </button>
          `).join("")}${r.activePerspective||"inbox"}`,`${r.taskAreas.map(w=>`
            <button onclick="window.showAreaTasks('${w.id}')" class="workspace-area-chip ${u(w.id)||T===w.id?"active":""}" style="--area-color:${w.color||"var(--accent)"}">
              <span class="workspace-area-emoji">${w.emoji||'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17l10 5 10-5-10-5-10 5z" opacity="0.35"/><path d="M2 12l10 5 10-5-10-5-10 5z" opacity="0.6"/><path d="M12 2L2 7l10 5 10-5L12 2z"/></svg>'}</span>
              <span class="workspace-area-name">${v(w.name)}</span>
              <span class="workspace-area-count">${d[w.id]||""}</span>
            </button>
          `).join("")}`,T&&(`${T}`,`${v(Je(T)?.name||"Area")}${_r(T).map(w=>`
            <button onclick="window.showCategoryTasks('${w.id}')" class="workspace-chip ${h(w.id)?"active":""}">
              <span class="workspace-chip-icon">${w.emoji||'<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M2 6a2 2 0 012-2h5.586a1 1 0 01.707.293L12 6h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" opacity="0.35"/><rect x="2" y="9" width="20" height="11" rx="2"/></svg>'}</span>
              <span>${v(w.name)}</span>
            </button>
          `).join("")}`),`${r.taskLabels.map(w=>`
                  <button onclick="window.showLabelTasks('${w.id}')" class="workspace-overflow-item ${g(w.id)?"active":""}">
                    <span class="workspace-dot" style="background:${w.color||"var(--text-muted)"}"></span>
                    <span>${v(w.name)}</span>
                    <span class="workspace-chip-count">${c[w.id]||""}</span>
                  </button>
                `).join("")}${r.taskPeople.map(w=>`
                  <button onclick="window.showPersonTasks('${w.id}')" class="workspace-overflow-item ${b(w.id)?"active":""}">
                    <span>👤</span>
                    <span>${v(w.name)}</span>
                    <span class="workspace-chip-count">${p[w.id]||""}</span>
                  </button>
                `).join("")}`;const N=`
    <div class="w-full md:w-64 flex-shrink-0 space-y-3">
      <!-- Tasks Section -->
      <div class="bg-[var(--modal-bg)] rounded-lg border border-[var(--border)]">
        <div class="px-4 py-2.5 border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">Tasks</h3>
        </div>
        <div class="py-2 px-2">
          ${Ee.map(w=>`
            <button onclick="window.showPerspectiveTasks('${w.id}')"
              class="sidebar-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg transition-all ${m(w.id)?"active bg-[var(--accent-light)]":"hover:bg-[var(--bg-secondary)]"}">
              <span class="w-6 h-6 flex items-center justify-center flex-shrink-0" style="color: ${w.color}">${w.icon}</span>
              <span class="flex-1 text-[14px] ${m(w.id)?"font-medium text-[var(--text-primary)]":"text-[var(--text-secondary)]"}">${w.name}</span>
              <span class="count-badge min-w-[20px] text-right text-xs ${m(w.id)?"text-[var(--text-secondary)]":"text-[var(--text-muted)]"}">${a[w.id]||""}</span>
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
            class="sidebar-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg transition-all ${m("notes")?"active bg-[var(--accent-light)]":"hover:bg-[var(--bg-secondary)]"}">
            <span class="w-6 h-6 flex items-center justify-center flex-shrink-0" style="color: ${ze.color}">${ze.icon}</span>
            <span class="flex-1 text-[14px] ${m("notes")?"font-medium text-[var(--text-primary)]":"text-[var(--text-secondary)]"}">All Notes</span>
            <span class="count-badge min-w-[20px] text-right text-xs ${m("notes")?"text-[var(--text-secondary)]":"text-[var(--text-muted)]"}">${a.notes||""}</span>
          </button>
        </div>
      </div>

      <!-- Review -->
      <div class="bg-[var(--modal-bg)] rounded-lg border border-[var(--border)]">
        <div class="py-2 px-2">
          <button onclick="window.startReview()"
            class="sidebar-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg transition-all ${r.reviewMode?"active bg-[var(--accent-light)]":"hover:bg-[var(--bg-secondary)]"}">
            <span class="w-6 h-6 flex items-center justify-center flex-shrink-0" style="color: var(--success)">${V().review}</span>
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
          ${r.customPerspectives.length>0?r.customPerspectives.map(w=>`
            <button onclick="window.showPerspectiveTasks('${w.id}')"
              class="sidebar-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg group relative transition-all ${m(w.id)?"active bg-[var(--accent-light)]":"hover:bg-[var(--bg-secondary)]"}">
              <span class="w-6 h-6 flex items-center justify-center flex-shrink-0 text-lg text-[var(--text-muted)]">${w.icon}</span>
              <span class="flex-1 text-[14px] ${m(w.id)?"font-medium text-[var(--text-primary)]":"text-[var(--text-secondary)]"}">${v(w.name)}</span>
              <span class="min-w-[20px] text-right text-xs group-hover:opacity-0 transition-opacity text-[var(--text-muted)]">${a[w.id]||""}</span>
              <span onclick="event.stopPropagation(); window.editCustomPerspective('${w.id}')"
                class="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded-md hover:bg-[var(--bg-secondary)]">Edit</span>
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
          ${r.taskAreas.map(w=>{const F=_r(w.id),z=r.collapsedSidebarAreas.has(w.id),B=F.length>0,q=w.emoji||"";return`
              <div onclick="window.showAreaTasks('${w.id}')"
                onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.showAreaTasks('${w.id}');}"
                tabindex="0"
                role="button"
                aria-label="View ${v(w.name)} area"
                class="sidebar-item draggable-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg group relative cursor-pointer select-none transition-all ${u(w.id)?"active bg-[var(--accent-light)]":"hover:bg-[var(--bg-secondary)]"}"
                draggable="true"
                data-id="${w.id}"
                data-type="area">
                <span class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm relative" style="background: ${w.color}20; color: ${w.color}">
                  ${q||'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>'}
                  ${B?`
                    <span onclick="event.stopPropagation(); window.toggleSidebarAreaCollapse('${w.id}')"
                      class="absolute inset-0 flex items-center justify-center rounded-lg bg-[var(--bg-secondary)] opacity-0 group-hover:opacity-100 transition-opacity text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                      <svg class="w-3.5 h-3.5 transition-transform ${z?"":"rotate-90"}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                    </span>
                  `:""}
                </span>
                <span class="flex-1 text-[14px] truncate ${u(w.id)?"font-medium text-[var(--text-primary)]":"text-[var(--text-secondary)]"}">${v(w.name)}</span>
                <span class="min-w-[20px] text-right text-xs group-hover:opacity-0 transition-opacity text-[var(--text-muted)]">${d[w.id]||""}</span>
                <span onclick="event.stopPropagation(); window.editingAreaId='${w.id}'; window.showAreaModal=true; window.render()"
                  class="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded-md hover:bg-[var(--bg-secondary)]">Edit</span>
              </div>
            ${z?"":`
              ${F.map(S=>{const L=S.emoji||"";return`
                <div onclick="window.showCategoryTasks('${S.id}')"
                  class="sidebar-item w-full pl-10 pr-3 py-1.5 flex items-center gap-2.5 text-left rounded-lg group relative cursor-pointer select-none transition-all ${h(S.id)?"active bg-[var(--accent-light)]":"hover:bg-[var(--bg-secondary)]"}">
                  <span class="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 text-xs" style="background: ${S.color}20; color: ${S.color}">
                    ${L||'<svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>'}
                  </span>
                  <span class="flex-1 text-[13px] truncate ${h(S.id)?"font-medium text-[var(--text-primary)]":"text-[var(--text-secondary)]"}">${v(S.name)}</span>
                  <span onclick="event.stopPropagation(); window.editingCategoryId='${S.id}'; window.showCategoryModal=true; window.render()"
                    class="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded-md hover:bg-[var(--bg-secondary)]">Edit</span>
                </div>
              `}).join("")}
              ${u(w.id)?`
              <button onclick="event.stopPropagation(); window.editingCategoryId=null; window.showCategoryModal=true; window.modalSelectedArea='${w.id}'; window.render()"
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
      ${(()=>{const w=r.taskLabels.filter(A=>(c[A.id]||0)>0).sort((A,Y)=>(c[Y.id]||0)-(c[A.id]||0)),F=r.taskLabels.filter(A=>!c[A.id]).sort((A,Y)=>A.name.localeCompare(Y.name)),z=10,B=r.showAllSidebarLabels,q=w.slice(0,z);w.slice(z);const S=B?[...w,...F]:q,L=w.length+F.length-q.length;return`
      <div class="bg-[var(--modal-bg)] rounded-lg border border-[var(--border)]">
        <div class="px-4 py-2.5 flex items-center justify-between border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">Tags${w.length>0?` (${w.length})`:""}</h3>
          <button onclick="window.editingLabelId=null; window.showLabelModal=true; window.render()" aria-label="Add new tag" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition p-1.5 -mr-1 rounded-lg hover:bg-[var(--bg-secondary)]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
        <div class="py-2 px-2">
          ${S.length===0?'<div class="px-3 py-2 text-xs text-[var(--text-muted)]">No tags yet</div>':S.map(A=>`
            <div onclick="window.showLabelTasks('${A.id}')"
              onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.showLabelTasks('${A.id}');}"
              tabindex="0"
              role="button"
              aria-label="View ${v(A.name)} tag"
              class="sidebar-item draggable-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg group relative cursor-pointer select-none transition-all ${g(A.id)?"active bg-[var(--accent-light)]":"hover:bg-[var(--bg-secondary)]"}"
              draggable="true"
              data-id="${A.id}"
              data-type="label">
              <span class="w-6 h-6 flex items-center justify-center flex-shrink-0">
                <span class="w-3 h-3 rounded-full" style="background-color: ${A.color}"></span>
              </span>
              <span class="flex-1 text-[14px] ${g(A.id)?"font-medium text-[var(--text-primary)]":"text-[var(--text-secondary)]"}">${v(A.name)}</span>
              <span class="min-w-[20px] text-right text-xs group-hover:opacity-0 transition-opacity text-[var(--text-muted)]">${c[A.id]||""}</span>
              <span onclick="event.stopPropagation(); window.editingLabelId='${A.id}'; window.showLabelModal=true; window.render()"
                class="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded-md hover:bg-[var(--bg-secondary)]">Edit</span>
            </div>
          `).join("")}
          ${L>0?`
          <button onclick="window.showAllLabelsPage()"
            class="w-full px-3 py-2 text-xs text-[var(--accent)] hover:text-[var(--accent-dark)] text-left rounded-lg hover:bg-[var(--bg-secondary)] transition">
            View all ${r.taskLabels.length} tags
          </button>`:""}
        </div>
      </div>`})()}

      <!-- People -->
      ${(()=>{const w=r.taskPeople.filter(A=>(p[A.id]||0)>0).sort((A,Y)=>(p[Y.id]||0)-(p[A.id]||0)),F=r.taskPeople.filter(A=>!p[A.id]).sort((A,Y)=>A.name.localeCompare(Y.name)),z=10,B=r.showAllSidebarPeople,q=w.slice(0,z),S=B?[...w,...F]:q,L=w.length+F.length-q.length;return`
      <div class="bg-[var(--modal-bg)] rounded-lg border border-[var(--border)]">
        <div class="px-4 py-2.5 flex items-center justify-between border-b border-[var(--border-light)]">
          <h3 class="font-semibold text-[var(--text-muted)] text-[11px] uppercase tracking-wider">People${w.length>0?` (${w.length})`:""}</h3>
          <button onclick="window.editingPersonId=null; window.showPersonModal=true; window.render()" aria-label="Add new person" class="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition p-1.5 -mr-1 rounded-lg hover:bg-[var(--bg-secondary)]">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>
        <div class="py-2 px-2">
          ${S.length===0?'<div class="px-3 py-2 text-xs text-[var(--text-muted)]">No people yet</div>':S.map(A=>`
            <div onclick="window.showPersonTasks('${A.id}')"
              onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();window.showPersonTasks('${A.id}');}"
              tabindex="0"
              role="button"
              aria-label="View tasks for ${v(A.name)}"
              class="sidebar-item draggable-item w-full px-3 py-2 flex items-center gap-3 text-left rounded-lg group relative cursor-pointer select-none transition-all ${b(A.id)?"active bg-[var(--accent-light)]":"hover:bg-[var(--bg-secondary)]"}"
              draggable="true"
              data-id="${A.id}"
              data-type="person">
              ${Er(A,24)}
              <span class="flex-1 min-w-0">
                <span class="block text-[14px] truncate ${b(A.id)?"font-medium text-[var(--text-primary)]":"text-[var(--text-secondary)]"}">${v(A.name)}</span>
                ${A.jobTitle?`<span class="block text-[11px] truncate text-[var(--text-muted)]">${v(A.jobTitle)}</span>`:""}
              </span>
              <span class="min-w-[20px] text-right text-xs group-hover:opacity-0 transition-opacity text-[var(--text-muted)]">${p[A.id]||""}</span>
              <span onclick="event.stopPropagation(); window.editingPersonId='${A.id}'; window.showPersonModal=true; window.render()"
                class="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded-md hover:bg-[var(--bg-secondary)]">Edit</span>
            </div>
          `).join("")}
          ${L>0?`
          <button onclick="window.showAllPeoplePage()"
            class="w-full px-3 py-2 text-xs text-[var(--accent)] hover:text-[var(--accent-dark)] text-left rounded-lg hover:bg-[var(--bg-secondary)] transition">
            View all ${r.taskPeople.length} people
          </button>`:""}
        </div>
      </div>`})()}
    </div>
  `,I=r.activeFilterType==="area"&&r.activeAreaFilter,C=r.activeFilterType==="subcategory"&&r.activeCategoryFilter,H=r.activeFilterType==="label"&&r.activeLabelFilter,j=r.activeFilterType==="person"&&r.activePersonFilter,$=r.activeFilterType==="all-labels",D=r.activeFilterType==="all-people",R=r.activeFilterType==="perspective"&&r.customPerspectives.find(w=>w.id===r.activePerspective),M=I?Je(r.activeAreaFilter):null,J=C?Qe(r.activeCategoryFilter):null;let W;return r.reviewMode?W=typeof window.renderReviewMode=="function"?window.renderReviewMode():'<div class="p-8 text-center text-[var(--text-muted)]">Loading review mode...</div>':$?W=A2():D?W=M2():I?W=ff(M,e,s):C?W=C2(J,e,s):H?W=E2(Rs(r.activeLabelFilter),e,s):j?W=D2(Bs(r.activePersonFilter),e,s):R?W=P2(R,e):W=`
    <div class="flex-1">
      <div class="bg-[var(--bg-card)] rounded-lg md:border md:border-[var(--border-light)]">
        <div class="task-list-header-desktop px-5 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="text-2xl" ${t.color?`style="color: ${t.color}"`:""}>${t.icon}</span>
            <div>
              <h2 class="text-xl font-semibold text-[var(--text-primary)]">${t.name}</h2>
              ${t.jobTitle||t.email?`<p class="text-sm text-[var(--text-muted)]">${[t.jobTitle,t.email].filter(Boolean).join(" · ")}</p>`:""}
            </div>
          </div>
          <button onclick="window.openNewTaskModal()"
            class="w-8 h-8 rounded-full bg-[var(--accent)] text-white flex items-center justify-center hover:bg-[var(--accent-dark)] transition shadow-sm" title="${f?"Add Note":"Add Task"}">
            <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
        </div>

        ${r.activePerspective!=="upcoming"?`
        <!-- Quick Add Input -->
        <div class="quick-add-section px-4 py-3 border-b border-[var(--border-light)]">
          <div class="flex items-center gap-3">
            ${f?`
              <div class="w-2 h-2 rounded-full border-2 border-dashed border-[var(--notes-color)]/40 flex-shrink-0 ml-1.5"></div>
            `:`
              <div onclick="state.quickAddIsNote = !state.quickAddIsNote; render()"
                class="quick-add-type-toggle" title="${r.quickAddIsNote?"Switch to Task":"Switch to Note"}">
                ${r.quickAddIsNote?'<div class="w-1.5 h-1.5 rounded-full bg-[var(--notes-color)]"></div>':'<div class="w-[18px] h-[18px] rounded-full border-2 border-dashed border-[var(--text-muted)]/30 flex-shrink-0"></div>'}
              </div>
            `}
            <input type="text" id="quick-add-input"
              placeholder="${f||r.quickAddIsNote?"New Note":"New To-Do"}"
              onkeydown="window.handleQuickAddKeydown(event, this)"
              class="flex-1 text-[15px] text-[var(--text-primary)] placeholder-[var(--text-muted)]/50 bg-transparent border-0 outline-none focus:ring-0">
            <button onclick="window.quickAddTask(document.getElementById('quick-add-input'))"
              class="text-[var(--text-muted)] hover:text-[var(--accent)] transition p-1" title="${f||r.quickAddIsNote?"Add Note":"Add to "+t.name}">
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
              ${x2(e).map(w=>`
                <div class="date-group mb-6">
                  <div class="px-5 py-2 sticky top-0 bg-[var(--bg-card)] z-10">
                    <span class="text-[13px] font-semibold text-[var(--text-muted)]">${w.label}</span>
                  </div>
                  <div>
                    ${w.dueTasks.length>0?`
                      ${w.deferTasks.length>0?'<div class="px-5 pt-1 pb-0.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--warning)]">Due</div>':""}
                      ${w.dueTasks.map(F=>ye(F,!1)).join("")}
                    `:""}
                    ${w.deferTasks.length>0?`
                      <div class="px-5 pt-2 pb-0.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">Starting</div>
                      ${w.deferTasks.map(F=>ye(F,!1)).join("")}
                    `:""}
                  </div>
                </div>
              `).join("")}
            </div>
          `:r.activePerspective==="logbook"?`
            <!-- Logbook view grouped by completion date -->
            <div class="task-list">
              ${k2(e).map(w=>`
                <div class="date-group mb-6">
                  <div class="px-5 py-2 sticky top-0 bg-[var(--bg-card)]">
                    <span class="text-[13px] font-semibold text-[var(--text-muted)]">${w.label}</span>
                  </div>
                  <div>
                    ${w.tasks.map(F=>ye(F,!1)).join("")}
                  </div>
                </div>
              `).join("")}
            </div>
          `:r.activePerspective==="today"?(()=>{const w=U(),F=r.taskLabels.find(P=>P.name.trim().toLowerCase()==="next"),z=e.filter(P=>{const ae=P.dueDate===w,de=P.dueDate&&P.dueDate<w,ee=P.deferDate&&P.deferDate<=w;return P.today||ae||de||ee}),B=z.filter(P=>P.dueDate&&P.dueDate<=w).sort((P,ae)=>P.dueDate.localeCompare(ae.dueDate)),q=z.filter(P=>{const ae=P.dueDate&&P.dueDate<=w;return P.deferDate&&P.deferDate<=w&&!ae}),S=z.filter(P=>!B.includes(P)&&!q.includes(P)),L=F?e.filter(P=>{const ae=(P.labels||[]).includes(F.id),de=P.today||P.dueDate===w||P.dueDate&&P.dueDate<w;return ae&&!de}):[],A=z.length+L.length,Y=(P,ae,de,ee,ce="")=>P.length>0?`
              <div class="${ce}">
                <div class="px-5 py-2 bg-[var(--bg-card)]">
                  <div class="flex items-center gap-2">
                    <span style="color: ${ee}">${ae}</span>
                    <span class="text-[13px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">${de}</span>
                    <span class="text-xs text-[var(--text-muted)]">${P.length}</span>
                  </div>
                </div>
                ${P.map(ge=>ye(ge)).join("")}
              </div>
            `:"";return`
            <div class="task-list">
              ${Y(B,'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',"Due","var(--overdue-color)")}
              ${S.length>0?`
                <div class="${B.length>0?"mt-2":""}">
                  ${S.map(P=>ye(P)).join("")}
                </div>
              `:""}
              ${Y(q,'<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',"Starting","var(--accent)",B.length>0||S.length>0?"mt-2":"")}
              ${Y(L,V().next,"Next","var(--notes-color)",z.length>0?"mt-4":"")}
              ${A===0?`
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
                      <span class="w-2 h-2 rounded-full" style="background:${n.color||"var(--notes-color)"}"></span>
                      ${v(n.name)}
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
              ${uf()}
              <div class="py-2">
                ${cf(r.activeAreaFilter)}
              </div>
            </div>
          `:`
            <!-- Regular task list -->
            <div class="task-list">
              ${e.map(w=>ye(w)).join("")}
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
        ${N.replace("w-full md:w-64","w-full")}
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
        ${N}
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
        ${W}
      </div>
    </div>
  `}function li(e,t="instance"){return e?t==="series"&&e.recurringEventId?`${e.calendarId}::series::${e.recurringEventId}`:`${e.calendarId}::instance::${e.id}`:""}function kl(e){return li(e,r.calendarMeetingNotesScope||"instance")}function ia(e){if(!e)return[];const t=[`${e.calendarId}::instance::${e.id}`];return e.recurringEventId&&t.push(`${e.calendarId}::series::${e.recurringEventId}`),t}function Sr(e){const t=ia(e);if(!t.length)return!1;const n=r.meetingNotesByEvent||{};return t.some(s=>!!n[s])?!0:r.tasksData.some(s=>t.includes(s.meetingEventKey))}function gf(){localStorage.setItem(Vn,JSON.stringify(r.meetingNotesByEvent||{})),typeof window.debouncedSaveToGithub=="function"&&window.debouncedSaveToGithub()}function rr(e,t){return(r.gcalEvents||[]).find(n=>n.calendarId===e&&n.id===t)||null}function L2(e){return e?e.start?.date?e.start.date:(e.start?.dateTime||"").slice(0,10)||U():U()}function Js(e){const t=kl(e);return t?(r.meetingNotesByEvent||(r.meetingNotesByEvent={}),r.meetingNotesByEvent[t]||(r.meetingNotesByEvent[t]={eventKey:t,calendarId:e.calendarId,eventId:e.id,title:e.summary||"Untitled Event",content:"",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},gf()),r.meetingNotesByEvent[t]):null}function Xs(){const e=r.calendarMeetingNotesEventKey;if(!e)return null;const t=e.split("::");if(t.length<3)return null;const[n,a,s]=t;return a==="series"?(r.gcalEvents||[]).find(o=>o.calendarId===n&&o.recurringEventId===s)||null:rr(n,s)||null}function _2(e){if(!e)return[];if(typeof e=="string")return r.tasksData.filter(n=>n.meetingEventKey===e);const t=ia(e);return r.tasksData.filter(n=>t.includes(n.meetingEventKey))}function O2(e){if(!e)return{attendeePeople:[],matchingItems:[],tasks:[],notes:[]};const t=new Set((Array.isArray(e.attendees)?e.attendees:[]).map(d=>_n(d?.email)).filter(Boolean)),n=r.taskPeople.filter(d=>t.has(_n(d?.email))),a=new Set(n.map(d=>d.id)),s=ia(e),o=U(),i=d=>{let c=0;return d.isNote||(c+=20),d.flagged&&(c+=14),d.today&&(c+=10),d.dueDate&&(d.dueDate<o?c+=22:d.dueDate===o?c+=18:Math.ceil((new Date(`${d.dueDate}T12:00:00`)-new Date(`${o}T12:00:00`))/864e5)<=7&&(c+=7)),s.includes(d.meetingEventKey)&&(c+=12),c},l=r.tasksData.filter(d=>!d.completed).filter(d=>(d.people||[]).some(c=>a.has(c))).sort((d,c)=>{const p=i(c)-i(d);return p!==0?p:String(c.updatedAt||c.createdAt||"").localeCompare(String(d.updatedAt||d.createdAt||""))});return{attendeePeople:n,matchingItems:l,tasks:l.filter(d=>!d.isNote),notes:l.filter(d=>d.isNote)}}function di(e){return v(e||"").replace(/\n/g,"<br>")}function R2(e){const t=String(e||"");if(!t.trim())return"";if(!/[<>]/.test(t)||typeof document>"u")return di(t);const n=new Set(["a","p","br","ul","ol","li","b","strong","i","em","u","code","pre","blockquote","h1","h2","h3","h4","h5","h6","div","span"]),a=new Set(["href","title","target","rel"]),s=document.createElement("template");s.innerHTML=t;const o=i=>{if(i.nodeType===Node.TEXT_NODE)return;if(i.nodeType!==Node.ELEMENT_NODE){i.remove();return}const l=i.tagName.toLowerCase();if(!n.has(l)){const d=document.createTextNode(i.textContent||"");i.replaceWith(d);return}Array.from(i.attributes).forEach(d=>{const c=d.name.toLowerCase(),p=d.value||"";if(c.startsWith("on")||!a.has(c)){i.removeAttribute(d.name);return}if(c==="href"){const u=p.trim().toLowerCase();u.startsWith("http://")||u.startsWith("https://")||u.startsWith("mailto:")||i.removeAttribute(d.name)}}),l==="a"&&i.getAttribute("href")&&(i.setAttribute("target","_blank"),i.setAttribute("rel","noopener noreferrer")),Array.from(i.childNodes).forEach(o)};return Array.from(s.content.childNodes).forEach(o),s.innerHTML}function B2(){return r.calendarEventModalOpen?rr(r.calendarEventModalCalendarId,r.calendarEventModalEventId):null}const ci=$i;function te(e){return String(e||"").replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/"/g,"&quot;")}function j2(e,t){const n=rr(e,t);if(n){if(Sr(n)){mf(e,t);return}r.calendarEventModalOpen=!0,r.calendarEventModalCalendarId=e,r.calendarEventModalEventId=t,window.render()}}function F2(){r.calendarEventModalOpen=!1,r.calendarEventModalCalendarId=null,r.calendarEventModalEventId=null,window.render()}function mf(e,t){const n=rr(e,t);if(!n)return;const a=Js(n);a&&(r.calendarMeetingNotesEventKey=a.eventKey,r.calendarEventModalOpen=!1,r.calendarEventModalCalendarId=null,r.calendarEventModalEventId=null,window.render())}function hf(e){if(!e)return;const t=String(e).split("::");t.length>=3&&(r.calendarMeetingNotesScope=t[1]==="series"?"series":"instance"),r.calendarMeetingNotesEventKey=String(e),r.activeTab="calendar",r.calendarEventModalOpen=!1,r.calendarEventModalCalendarId=null,r.calendarEventModalEventId=null,window.render()}function H2(e){hf(e)}function W2(e){if(!["instance","series"].includes(e))return;const t=r.calendarMeetingNotesScope||"instance",n=Xs();if(!n)return r.calendarMeetingNotesScope=e,window.render();if(t==="instance"&&e==="series"&&n.recurringEventId){const s=li(n,"instance"),o=li(n,"series");if(s&&o&&s!==o){r.meetingNotesByEvent||(r.meetingNotesByEvent={});const i=r.meetingNotesByEvent[s],l=r.meetingNotesByEvent[o],d=new Date().toISOString();i&&!l?r.meetingNotesByEvent[o]={...i,eventKey:o,updatedAt:d}:i&&l&&!String(l.content||"").trim()&&String(i.content||"").trim()&&(l.content=i.content,l.updatedAt=d);let c=0;for(const p of r.tasksData)p.meetingEventKey===s&&(p.meetingEventKey=o,p.updatedAt=d,c++);c>0&&window.saveTasksData?.(),gf()}}r.calendarMeetingNotesScope=e;const a=Js(n);a&&(r.calendarMeetingNotesEventKey=a.eventKey),window.render()}function G2(e){e==="today"&&(r.calendarMobileShowToday=!r.calendarMobileShowToday),e==="events"&&(r.calendarMobileShowEvents=!r.calendarMobileShowEvents),e==="scheduled"&&(r.calendarMobileShowScheduled=!r.calendarMobileShowScheduled),window.render()}function U2(){r.calendarMeetingNotesEventKey=null,window.render()}function z2(e,t,n=0){const a=rr(e,t);if(!a)return;const s=L2(a),o=new Date(`${s}T12:00:00`);o.setDate(o.getDate()+(Number(n)||0));const i=`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}-${String(o.getDate()).padStart(2,"0")}`,d=Number(n)>0?`Follow up: ${a.summary||"Meeting"}`:a.summary||"Meeting",c=[a.description,a.htmlLink].filter(Boolean).join(`

`);window.createTask?.(d,{status:"anytime",dueDate:i,notes:c,meetingEventKey:kl(a)}),r.calendarEventModalOpen=!1,r.calendarEventModalCalendarId=null,r.calendarEventModalEventId=null,window.render()}function V2(e,t){r.draggedCalendarEvent={calendarId:e,eventId:t}}function q2(){r.draggedCalendarEvent=null}async function K2(e,t){const n=r.draggedCalendarEvent;if(!n)return;const a=rr(n.calendarId,n.eventId);r.draggedCalendarEvent=null,a&&await window.rescheduleGCalEventIfConnected?.(a,e,t)}function vf(e="note"){const t=r.calendarMeetingNotesEventKey;if(!t)return;const n=document.getElementById("meeting-item-input"),a=String(n?.value||"").trim();if(!a)return;const s=Xs();s&&(Js(s),window.createTask?.(a,{isNote:e!=="task",status:"anytime",meetingEventKey:t,notes:""}),n&&(n.value=""),window.render())}function Y2(e){const t=r.calendarMeetingNotesEventKey,n=Xs();if(!e||!t||!n)return;const a=ia(n),s=r.tasksData.find(o=>o.id===e);s&&(a.includes(s.meetingEventKey)||(window.updateTask?.(e,{meetingEventKey:t}),window.render()))}function J2(e,t="note"){e.key==="Enter"&&(e.preventDefault(),vf(t))}function X2(){const e=Xs();if(!e)return`
      <div class="bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] p-8 text-center">
        <p class="text-sm text-[var(--text-muted)] mb-4">This event is no longer in the current sync window.</p>
        <button onclick="closeCalendarMeetingNotes()" class="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm font-medium">Back to Calendar</button>
      </div>
    `;kl(e);const n=Js(e)?.content||"",a=Jd(e),s=ci(e),o=Array.isArray(e.attendees)?e.attendees:[],i=_2(e),l=ia(e),d=O2(e),c=i.filter(u=>!u.completed),p=i.filter(u=>u.completed),m=c.length>0?c.map(u=>`
        <div class="px-3 py-2 rounded-lg border border-[var(--border-light)] bg-[var(--bg-secondary)]/40 flex items-start gap-2.5">
          ${u.isNote?'<span class="w-2 h-2 rounded-full bg-[var(--accent)] mt-1.5"></span>':`<button onclick="event.stopPropagation(); window.toggleTaskComplete('${te(u.id)}')" class="task-checkbox mt-0.5 w-[18px] h-[18px] rounded-full border-[1.5px] border-[var(--text-muted)] hover:border-[var(--accent)] transition"></button>`}
          <button onclick="window.inlineEditingTaskId=null; window.editingTaskId='${te(u.id)}'; window.showTaskModal=true; window.render()" class="text-left flex-1 text-sm text-[var(--text-primary)] leading-snug">
            ${v(u.title||"Untitled")}
          </button>
        </div>
      `).join(""):'<div class="text-sm text-[var(--text-muted)] px-1 py-2">No bullet points yet.</div>';return`
    <div class="calendar-meeting-notes-page bg-[var(--bg-card)] rounded-lg border border-[var(--border-light)] overflow-hidden">
      <div class="calendar-meeting-notes-header px-5 py-4 border-b border-[var(--border-light)] flex flex-wrap items-center justify-between gap-3">
        <div class="min-w-0">
          <div class="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">Meeting Notes</div>
          <h2 class="text-lg font-semibold text-[var(--text-primary)] truncate">${v(e.summary||"Untitled Event")}</h2>
          <p class="text-sm text-[var(--text-muted)]">${v(a)}${s?` • ${v(s)}`:""} • ${c.length} open</p>
          ${e.recurringEventId?`
            <div class="mt-2 inline-flex items-center gap-1 p-1 rounded-lg bg-[var(--bg-secondary)]">
              <button onclick="setCalendarMeetingNotesScope('instance')" class="px-2 py-1 text-[11px] rounded-md ${r.calendarMeetingNotesScope==="instance"?"bg-[var(--bg-card)] text-[var(--text-primary)]":"text-[var(--text-muted)]"}">Instance</button>
              <button onclick="setCalendarMeetingNotesScope('series')" class="px-2 py-1 text-[11px] rounded-md ${r.calendarMeetingNotesScope==="series"?"bg-[var(--bg-card)] text-[var(--text-primary)]":"text-[var(--text-muted)]"}">Series</button>
            </div>
          `:""}
        </div>
        <div class="calendar-meeting-notes-actions flex items-center gap-2">
          <button onclick="closeCalendarMeetingNotes()" class="calendar-meeting-btn calendar-meeting-btn-neutral px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition">Back</button>
          <button onclick="window.open('${te(e.htmlLink)}','_blank')" class="calendar-meeting-btn calendar-meeting-btn-accent px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition ${e.htmlLink?"":"opacity-50 cursor-not-allowed"}" ${e.htmlLink?"":"disabled"}>
            Open Event
          </button>
          <button onclick="window.open('${te(e.meetingLink)}','_blank')" class="calendar-meeting-btn calendar-meeting-btn-success px-3 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition ${e.meetingLink?"":"opacity-50 cursor-not-allowed"}" ${e.meetingLink?"":"disabled"}>
            ${e.meetingProvider?`Join ${v(e.meetingProvider)}`:"Join Meeting"}
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
              ${m}
              ${p.length>0?`
                <details class="mt-3">
                  <summary class="text-xs font-medium text-[var(--text-muted)] cursor-pointer">${p.length} completed</summary>
                  <div class="mt-2 space-y-1.5">
                    ${p.map(u=>`
                      <div class="text-xs text-[var(--text-muted)] line-through px-2 py-1">${v(u.title||"Untitled")}</div>
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
                ${d.attendeePeople.map(u=>`
                  <span class="discussion-pool-person-pill" style="display:inline-flex;align-items:center;gap:6px">
                    ${Er(u,20)}
                    ${v(u.name)}
                    ${u.email?`<span class="discussion-pool-person-email">${v(u.email)}</span>`:""}
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
                  ${d.tasks.length?d.tasks.map(u=>{const h=l.includes(u.meetingEventKey);return`
                      <div class="discussion-pool-item">
                        <button onclick="window.inlineEditingTaskId=null; window.editingTaskId='${te(u.id)}'; window.showTaskModal=true; window.render()" class="discussion-pool-item-main">
                          <span class="discussion-pool-item-title">${v(u.title||"Untitled task")}</span>
                          <span class="discussion-pool-item-meta">
                            ${u.dueDate?`<span class="discussion-pool-item-badge">${u.dueDate<=U()?"Due":"Upcoming"} ${v(u.dueDate)}</span>`:""}
                            ${h?'<span class="discussion-pool-item-badge linked">In This Meeting</span>':""}
                          </span>
                        </button>
                        <button onclick="addDiscussionItemToMeeting('${te(u.id)}')" class="discussion-pool-link-btn ${h?"is-linked":""}" ${h?"disabled":""}>${h?"Linked":"Add"}</button>
                      </div>
                    `}).join(""):'<div class="discussion-pool-empty">No tasks tagged to attendees.</div>'}
                </div>

                <div class="discussion-pool-section">
                  <div class="discussion-pool-section-head">Notes (${d.notes.length})</div>
                  ${d.notes.length?d.notes.map(u=>{const h=l.includes(u.meetingEventKey);return`
                      <div class="discussion-pool-item">
                        <button onclick="window.inlineEditingTaskId=null; window.editingTaskId='${te(u.id)}'; window.showTaskModal=true; window.render()" class="discussion-pool-item-main">
                          <span class="discussion-pool-item-title">${v(u.title||"Untitled note")}</span>
                          <span class="discussion-pool-item-meta">
                            ${h?'<span class="discussion-pool-item-badge linked">In This Meeting</span>':""}
                          </span>
                        </button>
                        <button onclick="addDiscussionItemToMeeting('${te(u.id)}')" class="discussion-pool-link-btn ${h?"is-linked":""}" ${h?"disabled":""}>${h?"Linked":"Add"}</button>
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
                ${o.map(u=>{const h=_n(u.email),g=h?r.taskPeople.find(y=>_n(y.email)===h):null,b=g?.name||u.displayName||u.email||"Guest";return`
                  <span class="text-xs px-2 py-1 rounded-full bg-[var(--bg-secondary)] text-[var(--text-primary)] inline-flex items-center gap-1.5">
                    ${g?Er(g,16):""}
                    ${v(b)}
                  </span>`}).join("")}
              </div>
            `:'<p class="text-xs text-[var(--text-muted)]">No attendee metadata available for this event.</p>'}
          </div>

          ${e.description?`
            <div class="rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] p-3">
              <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-2">Original Event Note</h3>
              <div class="text-sm text-[var(--text-secondary)] leading-relaxed max-h-[260px] overflow-auto">${R2(e.description)}</div>
            </div>
          `:""}

          ${n?`
            <div class="rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] p-3">
              <h3 class="text-sm font-semibold text-[var(--text-primary)] mb-2">Legacy Internal Notes</h3>
              <div class="text-sm text-[var(--text-secondary)] leading-relaxed max-h-[220px] overflow-auto">${di(n)}</div>
            </div>
          `:""}
        </div>
      </div>
    </div>
  `}function Q2(e){if(!e||Sr(e))return"";const n=e.meetingProvider?`Join ${v(e.meetingProvider)}`:"Open Meeting Link",a=e.meetingLink?"Open call link":"No call link found";return`
    <div class="modal-overlay calendar-event-modal-overlay fixed inset-0 bg-[var(--modal-overlay)] backdrop-blur-sm flex items-end md:items-center justify-center z-[320]" onclick="if(event.target===this) closeCalendarEventActions()">
      <div class="modal-enhanced calendar-event-modal w-full max-w-md mx-4" onclick="event.stopPropagation()">
        <div class="sheet-handle md:hidden"></div>
        <div class="modal-header-enhanced">
          <div class="flex items-center gap-3 min-w-0">
            <div class="calendar-event-modal-header-icon">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div class="min-w-0">
              <h3 class="text-lg font-semibold text-[var(--text-primary)] truncate">${v(e.summary||"Event")}</h3>
              <p class="text-xs text-[var(--text-muted)] mt-1">${v(Jd(e))}${ci(e)?` • ${v(ci(e))}`:""}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            ${e.meetingProvider?`<span class="text-[10px] font-semibold px-2 py-1 rounded-full bg-[color-mix(in_srgb,var(--success)_15%,transparent)] text-[var(--success)]">${v(e.meetingProvider)}</span>`:""}
            <button onclick="closeCalendarEventActions()" class="w-8 h-8 rounded-lg hover:bg-[var(--bg-secondary)] text-[var(--text-muted)]" aria-label="Close">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div class="modal-body-enhanced space-y-3">
          <div class="calendar-event-quick-actions">
            <button onclick="window.open('${te(e.htmlLink)}', '_blank'); closeCalendarEventActions()" class="calendar-icon-action ${e.htmlLink?"":"opacity-50 cursor-not-allowed"}" ${e.htmlLink?"":"disabled"}>
              <span class="calendar-icon-action-glyph">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </span>
              <span class="calendar-icon-action-label">Google Calendar</span>
            </button>
            <button onclick="window.open('${te(e.meetingLink)}', '_blank'); closeCalendarEventActions()" class="calendar-icon-action ${e.meetingLink?"":"opacity-50 cursor-not-allowed"}" ${e.meetingLink?"":"disabled"}>
              <span class="calendar-icon-action-glyph">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              </span>
              <span class="calendar-icon-action-label">${n}</span>
              <span class="calendar-icon-action-sub">${a}</span>
            </button>
          </div>

          <button onclick="openCalendarMeetingNotes('${te(e.calendarId)}','${te(e.id)}')" class="calendar-event-action">
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
  `}const Z2=$i;function To(e){const t=v(e.title||"Untitled task"),n=e.dueDate?v(e.dueDate):"",a=n?`<span class="text-[10px] text-[var(--text-muted)]">${n}</span>`:"";return`
    <div class="px-4 py-2.5 border-b border-[var(--border-light)]/60 last:border-b-0">
      <div class="flex items-start gap-2.5">
        <button
          onclick="event.stopPropagation(); window.toggleTaskComplete('${te(e.id)}')"
          class="task-checkbox mt-0.5 w-[18px] h-[18px] rounded-full border-[1.5px] border-[var(--text-muted)] hover:border-[var(--accent)] flex-shrink-0 flex items-center justify-center transition-all"
          aria-label="Mark task complete: ${t}">
        </button>
        <button
          onclick="window.inlineEditingTaskId=null; window.editingTaskId='${te(e.id)}'; window.showTaskModal=true; window.render()"
          class="flex-1 min-w-0 text-left">
          <div class="text-[14px] leading-snug text-[var(--text-primary)] break-words">${t}</div>
          ${a}
        </button>
      </div>
    </div>
  `}function bn(e){return`${e.getFullYear()}-${String(e.getMonth()+1).padStart(2,"0")}-${String(e.getDate()).padStart(2,"0")}`}function ek(){if(r.calendarMeetingNotesEventKey)return X2();const e=he(),t=U(),n=["January","February","March","April","May","June","July","August","September","October","November","December"],a=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],s=new Date(r.calendarYear,r.calendarMonth,1),o=new Date(r.calendarYear,r.calendarMonth+1,0),i=s.getDay(),l=o.getDate(),d=new Date(r.calendarYear,r.calendarMonth,0).getDate(),c=[];for(let S=i-1;S>=0;S--){const L=d-S,A=r.calendarMonth===0?12:r.calendarMonth,P=`${r.calendarMonth===0?r.calendarYear-1:r.calendarYear}-${String(A).padStart(2,"0")}-${String(L).padStart(2,"0")}`;c.push({day:L,dateStr:P,outside:!0})}for(let S=1;S<=l;S++){const L=`${r.calendarYear}-${String(r.calendarMonth+1).padStart(2,"0")}-${String(S).padStart(2,"0")}`;c.push({day:S,dateStr:L,outside:!1})}const p=7-c.length%7;if(p<7)for(let S=1;S<=p;S++){const L=r.calendarMonth===11?1:r.calendarMonth+2,Y=`${r.calendarMonth===11?r.calendarYear+1:r.calendarYear}-${String(L).padStart(2,"0")}-${String(S).padStart(2,"0")}`;c.push({day:S,dateStr:Y,outside:!0})}const m={};c.forEach(S=>{m[S.dateStr]=Ma(S.dateStr)});const u=Ma(r.calendarSelectedDate),h=u.filter(S=>S.dueDate===r.calendarSelectedDate),g=u.filter(S=>S.deferDate===r.calendarSelectedDate&&S.dueDate!==r.calendarSelectedDate),b=r.calendarSelectedDate===t,y=r.tasksData.filter(S=>!S.completed&&!S.isNote),f=b?y.filter(S=>{const L=S.dueDate===t,A=S.dueDate&&S.dueDate<t,Y=S.deferDate&&S.deferDate<=t;return S.today||L||A||Y}):[],x=window.getGCalEventsForDate?.(r.calendarSelectedDate)||[],k=e?"M":"Month",T=e?"W":"Week",E=e?"3D":"3 Days",N=e?"Day":"Day Timeline",I=e?"Week TL":"Week Timeline",C={month:`${n[r.calendarMonth]} ${r.calendarYear}`,week:"Week View","3days":"3-Day View",daygrid:"Day Timeline",weekgrid:"Week Timeline"},H=new Date(r.calendarSelectedDate+"T12:00:00"),j=b?"Today":H.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}),$=()=>`
    <div class="calendar-grid">
      ${a.map(S=>`<div class="calendar-header-cell">${S}</div>`).join("")}
      ${c.map(S=>{const L=m[S.dateStr]||[],A=window.getGCalEventsForDate?.(S.dateStr)||[],Y=S.dateStr===t,P=S.dateStr===r.calendarSelectedDate,ae=L.filter(se=>se.dueDate===S.dateStr||se.deferDate===S.dateStr),de=["calendar-day"];S.outside&&de.push("outside"),Y&&de.push("today"),P&&de.push("selected");const ee=ae.length+A.length,ge=Math.min(e?190:260,Math.max(94,48+ee*17));return`<div class="${de.join(" ")}" style="min-height:${ge}px" onclick="calendarSelectDate('${S.dateStr}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault(); calendarSelectDate('${S.dateStr}');}">
          <div class="calendar-day-num">${S.day}</div>
          ${ae.length+A.length>0?`
            <div class="calendar-task-list">
              ${ae.map(se=>{const K=se.dueDate===S.dateStr;return`<div class="calendar-task-line ${K&&se.dueDate<t?"overdue":K?"due":"defer"}">${v(se.title)}</div>`}).join("")}
              ${A.map(se=>{const K=Sr(se);return`<div class="calendar-task-line event ${K?"with-notes":""}" onclick="event.stopPropagation(); openCalendarEventActions('${te(se.calendarId)}','${te(se.id)}')">${K?'<span class="calendar-line-note-indicator"></span>':""}${v(se.summary)}</div>`}).join("")}
            </div>
          `:""}
        </div>`}).join("")}
    </div>
  `,D=new Date(r.calendarSelectedDate+"T12:00:00"),R=[];if(r.calendarViewMode==="week"){const S=new Date(D);S.setDate(S.getDate()-S.getDay());for(let L=0;L<7;L++){const A=new Date(S);A.setDate(S.getDate()+L),R.push(A)}}else if(r.calendarViewMode==="3days")for(let S=-1;S<=1;S++){const L=new Date(D);L.setDate(L.getDate()+S),R.push(L)}const M=()=>`
    <div class="calendar-range-grid calendar-range-grid-${R.length}">
      ${R.map(S=>{const L=bn(S),A=Ma(L).filter(ee=>ee.dueDate===L||ee.deferDate===L),Y=window.getGCalEventsForDate?.(L)||[],P=L===r.calendarSelectedDate,ae=L===t,de=[...A.map(ee=>({type:"task",task:ee})),...Y.map(ee=>({type:"event",event:ee}))];return`
          <div class="calendar-range-day ${P?"selected":""}" onclick="calendarSelectDate('${L}')">
            <div class="calendar-range-day-head ${ae?"today":""}">
              <div class="calendar-range-day-name">${S.toLocaleDateString("en-US",{weekday:"short"})}</div>
              <div class="calendar-range-day-date">${S.toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
            </div>
            <div class="calendar-range-day-list">
              ${de.length===0?'<div class="calendar-range-empty">No items</div>':de.map(ee=>{if(ee.type==="event"){const xe=Sr(ee.event);return`<div class="calendar-task-line event ${xe?"with-notes":""}" onclick="event.stopPropagation(); openCalendarEventActions('${te(ee.event.calendarId)}','${te(ee.event.id)}')">${xe?'<span class="calendar-line-note-indicator"></span>':""}${v(ee.event.summary)}</div>`}const ce=ee.task,ge=ce.dueDate===L;return`<div class="calendar-task-line ${ge&&ce.dueDate<t?"overdue":ge?"due":"defer"}">${v(ce.title)}</div>`}).join("")}
            </div>
          </div>
        `}).join("")}
    </div>
  `,J=()=>{const S=[];if(r.calendarViewMode==="daygrid")S.push(new Date(D));else{const K=new Date(D);K.setDate(K.getDate()-K.getDay());for(let xe=0;xe<7;xe++){const et=new Date(K);et.setDate(K.getDate()+xe),S.push(et)}}const L=Array.from({length:18},(K,xe)=>xe+6),A=he(),Y=S.findIndex(K=>bn(K)===t),P=S.findIndex(K=>bn(K)===r.calendarSelectedDate),ae=P>=0?P:Y>=0?Y:0,de=A&&S.length>1?[S[ae]]:S,ee=A?"44px":"56px",ce=de.length===1?`grid-cols-[${ee}_1fr]`:"grid-cols-[56px_repeat(7,minmax(160px,1fr))] min-w-[840px]",ge=A?"min-h-[60px]":"min-h-[52px]";return`
      ${A&&S.length>1?`
      <div class="flex gap-1.5 overflow-x-auto pb-2 px-1 scrollbar-none">
        ${S.map((K,xe)=>{const et=bn(K);return`<button onclick="calendarSelectDate('${et}')"
            class="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition ${xe===ae?"bg-[var(--accent)] text-white":et===t?"bg-[var(--accent-light)] text-[var(--accent)]":"bg-[var(--bg-secondary)] text-[var(--text-secondary)]"}">${K.toLocaleDateString("en-US",{weekday:"short",day:"numeric"})}</button>`}).join("")}
      </div>
    `:""}
      <div class="overflow-auto border border-[var(--border-light)] rounded-lg">
        <div class="grid ${ce}">
          <div class="sticky top-0 z-10 bg-[var(--bg-card)] border-b border-r border-[var(--border-light)]"></div>
          ${de.map(K=>`<div class="sticky top-0 z-10 bg-[var(--bg-card)] border-b border-r border-[var(--border-light)] px-2 py-2 text-xs font-semibold text-[var(--text-primary)] ${bn(K)===t?"text-[var(--accent)]":""}">
              ${K.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}
            </div>`).join("")}
          ${L.map(K=>`
            <div class="px-2 py-2 text-[11px] text-[var(--text-muted)] border-r border-b border-[var(--border-light)] bg-[var(--bg-card)]">${String(K).padStart(2,"0")}:00</div>
            ${de.map(xe=>{const et=bn(xe),jf=(window.getGCalEventsForDate?.(et)||[]).filter(tt=>!tt.allDay).filter(tt=>{const Pl=new Date(tt.start?.dateTime||"").getHours();return Number.isFinite(Pl)&&Pl===K});return`
                <div class="${ge} border-r border-b border-[var(--border-light)] p-1.5 bg-[var(--bg-primary)]"
                  ondragover="event.preventDefault()"
                  ondrop="dropCalendarEventToSlot('${et}', ${K})">
                  ${jf.map(tt=>`
                    <div
                      draggable="true"
                      ondragstart="startCalendarEventDrag('${te(tt.calendarId)}','${te(tt.id)}')"
                      ondragend="clearCalendarEventDrag()"
                      onclick="openCalendarEventActions('${te(tt.calendarId)}','${te(tt.id)}')"
                      class="text-[11px] rounded-md px-2 py-1 mb-1 calendar-time-event cursor-move truncate">
                      ${v(tt.summary)}
                    </div>
                  `).join("")}
                </div>
              `}).join("")}
          `).join("")}
        </div>
      </div>
    `};let W="";r.calendarViewMode==="month"?W=$():r.calendarViewMode==="week"||r.calendarViewMode==="3days"?W=M():W=J();const w=r.gcalTokenExpired?`
    <div class="calendar-token-banner mx-5 my-2 px-4 py-2 rounded-lg flex items-center justify-between">
      <span class="text-sm">Google Calendar session expired</span>
      <button onclick="reconnectGCal()" class="text-sm font-medium hover:opacity-80 underline">Reconnect</button>
    </div>
  `:"",F=f.length>0?f.map(S=>To(S)).join(""):'<div class="px-4 py-4 text-sm text-[var(--text-muted)]">No tasks for today.</div>',z=H.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"}),B=x.length>0?x.map(S=>{const L=String(S?.summary||"(No title)"),A=v(L.length>60?L.slice(0,57)+"...":L),Y=Z2(S)||"All day",P=Sr(S);return`
        <button onclick="openCalendarEventActions('${te(S.calendarId)}','${te(S.id)}')" class="calendar-side-event-row w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-[var(--bg-secondary)] transition rounded-lg ${P?"calendar-side-event-with-notes":""}">
          <span class="w-2.5 h-2.5 rounded-full ${P?"bg-[var(--flagged-color)]":"bg-[var(--success)]"} flex-shrink-0"></span>
          <span class="text-sm text-[var(--text-primary)] flex-1 truncate">${A}</span>
          ${P?'<span class="calendar-notes-chip">Notes</span>':""}
          <span class="text-xs text-[var(--text-muted)] flex-shrink-0">${v(Y)}</span>
        </button>
      `}).join(""):`<div class="px-4 py-4 text-sm text-[var(--text-muted)]">No events for ${z}.</div>`,q=B2();return`
    <div class="flex-1">
      <div class="calendar-page-grid ${r.calendarSidebarCollapsed?"calendar-page-grid-expanded":""}">
        <section class="bg-[var(--bg-card)] rounded-lg md:border md:border-[var(--border-light)]">
          <div class="px-5 py-4 flex items-center justify-between border-b border-[var(--border-light)]">
            <div class="flex items-center gap-3">
              <span class="text-2xl text-[var(--accent)]">${V().calendar}</span>
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
                <h3 class="calendar-period-title">${C[r.calendarViewMode]||C.month}</h3>
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
                <button onclick="setCalendarViewMode('week')" class="calendar-view-toggle-btn ${r.calendarViewMode==="week"?"active":""}" aria-pressed="${r.calendarViewMode==="week"}">${T}</button>
                <button onclick="setCalendarViewMode('3days')" class="calendar-view-toggle-btn ${r.calendarViewMode==="3days"?"active":""}" aria-pressed="${r.calendarViewMode==="3days"}">${E}</button>
                <button onclick="setCalendarViewMode('daygrid')" class="calendar-view-toggle-btn ${r.calendarViewMode==="daygrid"?"active":""}" aria-pressed="${r.calendarViewMode==="daygrid"}">${N}</button>
                <button onclick="setCalendarViewMode('weekgrid')" class="calendar-view-toggle-btn ${r.calendarViewMode==="weekgrid"?"active":""}" aria-pressed="${r.calendarViewMode==="weekgrid"}">${I}</button>
              </div>
            </div>
          </div>

          ${w}

          <div class="px-3 pt-2 pb-2">
            ${W}
          </div>
        </section>

        <aside class="space-y-3 ${r.calendarSidebarCollapsed?"hidden":""}">
          <div class="bg-[var(--bg-card)] rounded-lg md:border md:border-[var(--border-light)] overflow-hidden">
            <button onclick="toggleCalendarMobilePanel('today')" class="calendar-mobile-panel-toggle px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between w-full text-left" aria-expanded="${r.calendarMobileShowToday?"true":"false"}">
              <h4 class="text-sm font-semibold text-[var(--text-primary)]">Today</h4>
              <span class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-muted)] font-medium">${f.length}</span>
                <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform ${r.calendarMobileShowToday?"rotate-180":""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              </span>
            </button>
            <div class="calendar-side-list ${e&&!r.calendarMobileShowToday?"calendar-panel-collapsed":""}">${F}</div>
          </div>

          <div class="bg-[var(--bg-card)] rounded-lg md:border md:border-[var(--border-light)] overflow-hidden">
            <button onclick="toggleCalendarMobilePanel('events')" class="calendar-mobile-panel-toggle px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between w-full text-left" aria-expanded="${r.calendarMobileShowEvents?"true":"false"}">
              <h4 class="text-sm font-semibold text-[var(--text-primary)]">Events</h4>
              <span class="flex items-center gap-2">
                <span class="text-xs text-[var(--text-muted)]">${j}</span>
                <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform ${r.calendarMobileShowEvents?"rotate-180":""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
              </span>
            </button>
            <div class="calendar-side-list ${e&&!r.calendarMobileShowEvents?"calendar-panel-collapsed":""}">${B}</div>
          </div>

          ${h.length>0||g.length>0?`
            <div class="bg-[var(--bg-card)] rounded-lg md:border md:border-[var(--border-light)] overflow-hidden">
              <button onclick="toggleCalendarMobilePanel('scheduled')" class="calendar-mobile-panel-toggle px-4 py-3 border-b border-[var(--border-light)] flex items-center justify-between w-full text-left" aria-expanded="${r.calendarMobileShowScheduled?"true":"false"}">
                <h4 class="text-sm font-semibold text-[var(--text-primary)]">Scheduled</h4>
                <span class="flex items-center gap-2">
                  <span class="text-xs text-[var(--text-muted)]">${z}</span>
                  <svg class="w-4 h-4 text-[var(--text-muted)] transition-transform ${r.calendarMobileShowScheduled?"rotate-180":""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                </span>
              </button>
              <div class="calendar-side-list ${e&&!r.calendarMobileShowScheduled?"calendar-panel-collapsed":""}">
                ${h.length>0?`
                  <div class="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--warning)]">Due</div>
                  ${h.map(S=>To(S)).join("")}
                `:""}
                ${g.length>0?`
                  <div class="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">Starting</div>
                  ${g.map(S=>To(S)).join("")}
                `:""}
              </div>
            </div>
          `:""}
        </aside>
      </div>

      ${Q2(q)}
    </div>
  `}function tk(){const e=document.querySelector(".calendar-grid");if(!e||e._swipeAttached)return;e._swipeAttached=!0;let t=0,n=0;e.addEventListener("touchstart",a=>{t=a.touches[0].clientX,n=a.touches[0].clientY},{passive:!0}),e.addEventListener("touchend",a=>{const s=a.changedTouches[0].clientX-t,o=a.changedTouches[0].clientY-n;Math.abs(s)>50&&Math.abs(s)>Math.abs(o)*1.5&&(s<0?window.calendarNextMonth():window.calendarPrevMonth())},{passive:!0})}let Pa=null,as=!1;function nk(){const e=document.querySelector("#mobile-sidebar-overlay .mobile-sidebar-drawer");return e?Array.from(e.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter(t=>!t.hasAttribute("disabled")&&!t.getAttribute("aria-hidden")):[]}function bf(e){if(!r.mobileDrawerOpen)return;if(e.key==="Escape"){e.preventDefault(),Fe();return}if(e.key!=="Tab")return;const t=nk();if(!t.length)return;const n=t[0],a=t[t.length-1],s=document.activeElement;e.shiftKey&&s===n?(e.preventDefault(),a.focus()):!e.shiftKey&&s===a&&(e.preventDefault(),n.focus())}let ss=0,os=0,Rr=!1;function yf(e){const t=e.touches[0].clientX;if(t<40||t>window.innerWidth-40){Rr=!1;return}ss=t,os=ss,Rr=!0}function wf(e){if(!Rr)return;os=e.touches[0].clientX;const t=os-ss;if(t<0){const n=document.querySelector(".mobile-sidebar-drawer");n&&(n.style.transform=`translate3d(${t}px, 0, 0)`,n.style.transition="none")}}function xf(){if(!Rr)return;Rr=!1;const e=os-ss,t=document.querySelector(".mobile-sidebar-drawer");t&&(t.style.transition="",t.style.transform=""),e<-60&&Fe()}function rk(){const e=document.getElementById("mobile-sidebar-overlay");e&&(e.addEventListener("touchstart",yf,{passive:!0}),e.addEventListener("touchmove",wf,{passive:!0}),e.addEventListener("touchend",xf,{passive:!0}))}function ak(){const e=document.getElementById("mobile-sidebar-overlay");e&&(e.removeEventListener("touchstart",yf),e.removeEventListener("touchmove",wf),e.removeEventListener("touchend",xf))}function sk(){Pa=document.activeElement instanceof HTMLElement?document.activeElement:null,r.mobileDrawerOpen=!0,document.body.style.overflow="hidden",document.body.classList.add("drawer-open"),document.body.classList.add("body-modal-open"),Sl(),as||(document.addEventListener("keydown",bf),as=!0),setTimeout(()=>{const e=document.getElementById("mobile-drawer-close");e&&e.focus()},20),rk()}function Fe(){ak(),r.mobileDrawerOpen=!1,document.body.style.overflow="",document.body.classList.remove("drawer-open"),!r.showTaskModal&&!r.showPerspectiveModal&&!r.showAreaModal&&!r.showLabelModal&&!r.showPersonModal&&!r.showCategoryModal&&!r.showBraindump&&!r.calendarEventModalOpen&&document.body.classList.remove("body-modal-open"),as&&(document.removeEventListener("keydown",bf),as=!1),Sl(),Pa&&typeof Pa.focus=="function"&&Pa.focus()}function Sl(){const e=document.getElementById("mobile-sidebar-overlay");e&&(r.mobileDrawerOpen?e.classList.add("show"):e.classList.remove("show"))}function ok(){return`
    <nav class="mobile-bottom-nav" aria-label="Main navigation">
      <div class="mobile-bottom-nav-inner" role="tablist">
        <button onclick="switchTab('home')" class="mobile-nav-item ${r.activeTab==="home"?"active":""}" role="tab" aria-selected="${r.activeTab==="home"}" aria-label="Home">
          ${V().home}
          <span class="mobile-nav-label">Home</span>
        </button>
        <button onclick="switchTab('tasks')" class="mobile-nav-item ${r.activeTab==="tasks"?"active":""}" role="tab" aria-selected="${r.activeTab==="tasks"}" aria-label="Workspace">
          ${V().workspace}
          <span class="mobile-nav-label">Workspace</span>
        </button>
        <button onclick="switchTab('life')" class="mobile-nav-item ${r.activeTab==="life"?"active":""}" role="tab" aria-selected="${r.activeTab==="life"}" aria-label="Life Score">
          ${V().lifeScore}
          <span class="mobile-nav-label">Life</span>
        </button>
        <button onclick="switchTab('calendar')" class="mobile-nav-item ${r.activeTab==="calendar"?"active":""}" role="tab" aria-selected="${r.activeTab==="calendar"}" aria-label="Calendar">
          ${V().calendar}
          <span class="mobile-nav-label">Calendar</span>
        </button>
        <button onclick="switchTab('settings')" class="mobile-nav-item ${r.activeTab==="settings"?"active":""}" role="tab" aria-selected="${r.activeTab==="settings"}" aria-label="Settings">
          ${V().settings}
          <span class="mobile-nav-label">Settings</span>
        </button>
      </div>
    </nav>
  `}function ik(e){r.reviewMode=!1,r.activeFilterType="area",r.activeAreaFilter=e,r.activeLabelFilter=null,r.activePersonFilter=null,r.collapsedSidebarAreas.delete(e),Fe(),r.activeTab!=="tasks"&&(r.activeTab="tasks"),De(),window.render(),ht()}function lk(e){r.reviewMode=!1,r.activeFilterType="label",r.activeLabelFilter=e,r.activeAreaFilter=null,r.activePersonFilter=null,Fe(),r.activeTab!=="tasks"&&(r.activeTab="tasks"),De(),window.render(),ht()}function dk(e){if(r.reviewMode=!1,e==="calendar"){Fe(),r.activeTab="calendar",De(),window.render(),ht();return}r.activeFilterType="perspective",r.activePerspective=e,r.activeAreaFilter=null,r.activeLabelFilter=null,r.activePersonFilter=null,Fe(),r.activeTab!=="tasks"&&(r.activeTab="tasks"),De(),window.render(),ht()}function ck(e){r.reviewMode=!1,r.activeFilterType="person",r.activePersonFilter=e,r.activePerspective=null,r.activeAreaFilter=null,r.activeLabelFilter=null,Fe(),r.activeTab!=="tasks"&&(r.activeTab="tasks"),De(),window.render(),ht()}function uk(e){r.reviewMode=!1,r.activeFilterType="subcategory",r.activeCategoryFilter=e,r.activePerspective=null,r.activeAreaFilter=null,r.activeLabelFilter=null,r.activePersonFilter=null,Fe(),r.activeTab!=="tasks"&&(r.activeTab="tasks"),De(),window.render(),ht()}function pk(){r.reviewMode=!1,r.activeFilterType="all-labels",r.activeLabelFilter=null,r.activeAreaFilter=null,r.activePersonFilter=null,r.activePerspective=null,Fe(),r.activeTab!=="tasks"&&(r.activeTab="tasks"),De(),window.render(),ht()}function fk(){r.reviewMode=!1,r.activeFilterType="all-people",r.activePersonFilter=null,r.activeAreaFilter=null,r.activeLabelFilter=null,r.activePerspective=null,Fe(),r.activeTab!=="tasks"&&(r.activeTab="tasks"),De(),window.render(),ht()}function gk(e){r.collapsedSidebarAreas.has(e)?r.collapsedSidebarAreas.delete(e):r.collapsedSidebarAreas.add(e),window.render()}function mk(){r.workspaceSidebarCollapsed=!r.workspaceSidebarCollapsed,window.render()}let Io=0,ui=!1,Tr=null;function hk(){ui||window.innerWidth>768||(ui=!0,Io=window.scrollY,Tr=()=>{const e=document.querySelector(".mobile-bottom-nav");if(!e)return;const t=window.scrollY,n=t-Io;n>50&&t>150?e.classList.add("nav-scroll-hidden"):(n<-20||t<80)&&e.classList.remove("nav-scroll-hidden"),Io=t},window.addEventListener("scroll",Tr,{passive:!0}),typeof window.registerCleanup=="function"&&window.registerCleanup(vk))}function vk(){Tr&&(window.removeEventListener("scroll",Tr),Tr=null,ui=!1)}function ht(){he()&&setTimeout(()=>{const e=document.querySelector(".main-content")||document.querySelector("main");e?e.scrollIntoView({behavior:"smooth",block:"start"}):window.scrollTo({top:0,behavior:"smooth"})},50)}function Nn(e){if(!e||typeof e!="string")return"#6366f1";const t=e.trim();return/^#[0-9A-Fa-f]{3}$|^#[0-9A-Fa-f]{6}$/.test(t)?t:"#6366f1"}function kf(e){const t=new Date;t.setHours(0,0,0,0);function n(b){const y=b.getFullYear(),f=String(b.getMonth()+1).padStart(2,"0"),x=String(b.getDate()).padStart(2,"0");return`${y}-${f}-${x}`}function a(b,y){const f=new Date(b);return f.setDate(f.getDate()+y),f}function s(b,y){const f=new Date(b),x=(y-f.getDay()+7)%7;return f.setDate(f.getDate()+(x===0?7:x)),f}const o=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"],i=["sun","mon","tue","wed","thu","fri","sat"],l=["january","february","march","april","may","june","july","august","september","october","november","december"],d=["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"],c=(e||"").trim().toLowerCase();if(!c){const b=s(t,1);return[{name:"Today",date:n(t)},{name:"Tomorrow",date:n(a(t,1))},{name:"Next Monday",date:n(b)},{name:"In 1 Week",date:n(a(t,7))}]}const p=[];("today".startsWith(c)||c==="tod")&&p.push({name:"Today",date:n(t)}),("tomorrow".startsWith(c)||"tmr".startsWith(c))&&p.push({name:"Tomorrow",date:n(a(t,1))});const m=c.match(/^next\s+(.+)$/);if(m){const b=m[1];o.forEach((y,f)=>{(y.startsWith(b)||i[f].startsWith(b))&&p.push({name:"Next "+y.charAt(0).toUpperCase()+y.slice(1),date:n(s(a(t,1),f))})})}m||o.forEach((b,y)=>{(b.startsWith(c)||i[y].startsWith(c))&&p.push({name:b.charAt(0).toUpperCase()+b.slice(1),date:n(s(t,y))})});const u=c.match(/^in\s+(\d+)\s*(d|day|days|w|week|weeks|m|month|months)?\s*$/);if(u){const b=parseInt(u[1]),y=(u[2]||"d")[0];if(y==="d")p.push({name:`In ${b} day${b!==1?"s":""}`,date:n(a(t,b))});else if(y==="w")p.push({name:`In ${b} week${b!==1?"s":""}`,date:n(a(t,b*7))});else if(y==="m"){const f=new Date(t);f.setMonth(f.getMonth()+b),p.push({name:`In ${b} month${b!==1?"s":""}`,date:n(f)})}}const h=c.match(/^in\s+(\d+)\s*$/);if(h&&!u){const b=parseInt(h[1]);p.push({name:`In ${b} day${b!==1?"s":""}`,date:n(a(t,b))}),p.push({name:`In ${b} week${b!==1?"s":""}`,date:n(a(t,b*7))});const y=new Date(t);y.setMonth(y.getMonth()+b),p.push({name:`In ${b} month${b!==1?"s":""}`,date:n(y)})}const g=c.match(/^([a-z]+)\s+(\d{1,2})$/);if(g){const b=g[1],y=parseInt(g[2]);l.forEach((f,x)=>{if(f.startsWith(b)||d[x]===b){let k=new Date(t.getFullYear(),x,y);k<t&&(k=new Date(t.getFullYear()+1,x,y));const T=d[x].charAt(0).toUpperCase()+d[x].slice(1)+" "+y;p.push({name:T,date:n(k)})}})}return p.slice(0,5)}function Tl(e,t={}){const n=document.getElementById(e);if(!n||n.dataset.inlineAcAttached)return;n.dataset.inlineAcAttached="1";const a=t.isModal||!1;!a&&!r.inlineAutocompleteMeta.has(e)&&r.inlineAutocompleteMeta.set(e,{areaId:t.initialMeta?.areaId||null,categoryId:t.initialMeta?.categoryId||null,labels:t.initialMeta?.labels?[...t.initialMeta.labels]:[],people:t.initialMeta?.people?[...t.initialMeta.people]:[],deferDate:t.initialMeta?.deferDate||null,dueDate:t.initialMeta?.dueDate||null});let s=null,o=0,i=null,l=-1;function d(){return a?{areaId:r.modalSelectedArea,categoryId:r.modalSelectedCategory,labels:r.modalSelectedTags,people:r.modalSelectedPeople,deferDate:document.getElementById("task-defer")?.value||null,dueDate:document.getElementById("task-due")?.value||null}:r.inlineAutocompleteMeta.get(e)||{areaId:null,categoryId:null,labels:[],people:[],deferDate:null,dueDate:null}}function c(f,x){if(a){if(f==="areaId")r.modalSelectedArea=x,window.renderAreaInput(),window.renderCategoryInput();else if(f==="categoryId")r.modalSelectedCategory=x,window.renderCategoryInput();else if(f==="labels")r.modalSelectedTags=x,window.renderTagsInput();else if(f==="people")r.modalSelectedPeople=x,window.renderPeopleInput();else if(f==="deferDate"){const k=document.getElementById("task-defer");k&&(k.value=x||"",window.updateDateDisplay("defer"))}else if(f==="dueDate"){const k=document.getElementById("task-due");k&&(k.value=x||"",window.updateDateDisplay("due"))}}else{const k=d();k[f]=x,r.inlineAutocompleteMeta.set(e,k),t.onMetadataChange&&t.onMetadataChange(k),is(e)}}function p(f){const x=d();if(i==="#"){const k=r.taskAreas.map(E=>({...E,_acType:"area"})),T=(r.taskCategories||[]).map(E=>({...E,_acType:"category"}));return[...k,...T]}return i==="@"?r.taskLabels.filter(k=>!(x.labels||[]).includes(k.id)):i==="&"?r.taskPeople.filter(k=>!(x.people||[]).includes(k.id)):i==="!"||i==="!!"?kf(f||""):[]}function m(){return i==="#"?f=>({...Os(f,""),_acType:"area"}):i==="@"?f=>{const x=["#ef4444","#f59e0b","#22c55e","#3b82f6","#8b5cf6","#ec4899"],k=x[Math.floor(Math.random()*x.length)];return na(f,k)}:i==="&"?f=>ra(f,""):null}function u(f){const x=n.value,k=x.substring(0,l),T=x.substring(n.selectionStart);n.value=k.trimEnd()+(k.trimEnd()?" ":"")+T.trimStart();const E=(k.trimEnd()+(k.trimEnd()?" ":"")).length;if(n.setSelectionRange(E,E),i==="#")f._acType==="category"?(f.areaId&&c("areaId",f.areaId),c("categoryId",f.id)):c("areaId",f.id);else if(i==="@"){const I=[...d().labels||[]];I.includes(f.id)||I.push(f.id),c("labels",I)}else if(i==="&"){const I=[...d().people||[]];I.includes(f.id)||I.push(f.id),c("people",I)}else i==="!!"?c("dueDate",f.date):i==="!"&&c("deferDate",f.date);h(),n.focus()}function h(){s&&s.parentNode&&s.parentNode.removeChild(s),s=null,i=null,l=-1,o=0}function g(f,x){s||(s=document.createElement("div"),s.className="inline-autocomplete-popup",s.addEventListener("mousedown",M=>M.preventDefault()),document.body.appendChild(s));const k=n.getBoundingClientRect(),T=window.innerHeight-k.bottom,E=Math.min(300,window.innerWidth-24);s.style.left=Math.min(k.left,window.innerWidth-E-12)+"px",s.style.width=E+"px",T>240?(s.style.top=k.bottom+4+"px",s.style.bottom="auto"):(s.style.bottom=window.innerHeight-k.top+4+"px",s.style.top="auto");const N=i==="!"||i==="!!",I=N?f:f.filter(M=>M.name.toLowerCase().includes(x.toLowerCase())),C=N?!0:f.some(M=>M.name.toLowerCase()===x.toLowerCase()),H=!N&&x.length>0&&!C,j=I.length+(H?1:0);if(j===0){h();return}o>=j&&(o=j-1),o<0&&(o=0);const $=i==="#"?"Area":i==="@"?"Tag":i==="!!"?"Due Date":i==="!"?"Defer Date":"Person";let D="";if(I.forEach((M,J)=>{const W=J===o?" active":"";let w;if(N){const B=i==="!!"?"#ef4444":"#8b5cf6";w=`<span class="ac-icon" style="background:${B}20;color:${B}"><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg></span>`}else if(i==="#"){const B=Nn(M.color),q=M.emoji?v(M.emoji):'<svg style="width:14px;height:14px" viewBox="0 0 24 24" fill="currentColor"><path d="M2 6a2 2 0 012-2h5.586a1 1 0 01.707.293L12 6h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" opacity="0.35"/><rect x="2" y="9" width="20" height="11" rx="2"/></svg>';w=`<span class="ac-icon" style="background:${B}20;color:${B}">${q}</span>`}else if(i==="@")w=`<span class="w-3 h-3 rounded-full inline-block flex-shrink-0" style="background:${Nn(M.color)}"></span>`;else{const B=Nn(M.color);w=`<span class="ac-icon" style="background:${B}20;color:${B}">👤</span>`}const F=N?`<span style="margin-left:auto;font-size:11px;color:var(--text-muted)">${ve(M.date)}</span>`:"";let z=v(M.name);if(i==="#"&&M._acType==="category"&&M.areaId){const B=r.taskAreas.find(q=>q.id===M.areaId);B&&(z+=`<span style="margin-left:6px;font-size:11px;color:var(--text-muted)">${v(B.name)}</span>`)}D+=`<div class="inline-ac-option${W}" data-idx="${J}" style="${N?"justify-content:space-between":""}">${w}<span>${z}</span>${F}</div>`}),H){const M=I.length;D+=`<div class="inline-ac-create${o===M?" active":""}" data-idx="${M}">+ Create ${$} "${v(x)}"</div>`}s.innerHTML=D,s.querySelectorAll(".inline-ac-option").forEach(M=>{M.addEventListener("click",()=>u(I[parseInt(M.dataset.idx)]))});const R=s.querySelector(".inline-ac-create");R&&R.addEventListener("click",()=>{const M=m();if(M){const J=M(x);u(J)}})}function b(){const f=n.value,x=n.selectionStart;function k(T){if(T+1<f.length&&f[T+1]==="!"){i="!!",l=T;const E=f.substring(T+2,x),N=p(E);o=0,g(N,E)}else{i="!",l=T;const E=f.substring(T+1,x),N=p(E);o=0,g(N,E)}}for(let T=x-1;T>=0;T--){const E=f[T];if(E===`
`){h();return}if(E===" "){for(let N=T-1;N>=0;N--){const I=f[N];if(I===`
`||I==="#"||I==="@"||I==="&")break;if(I==="!"&&(N===0||f[N-1]===" ")){k(N);return}}h();return}if((E==="#"||E==="@"||E==="&")&&(T===0||f[T-1]===" ")){i=E,l=T;const N=f.substring(T+1,x),I=p(N);o=0,g(I,N);return}if(E==="!"&&(T===0||f[T-1]===" ")){k(T);return}}h()}n.addEventListener("input",()=>b()),n.addEventListener("keydown",f=>{if(!s)return;const x=n.value,k=n.selectionStart,T=x.substring(l+i.length,k),E=i==="!"||i==="!!",N=p(T),I=E?N:N.filter($=>$.name.toLowerCase().includes(T.toLowerCase())),C=E?!0:N.some($=>$.name.toLowerCase()===T.toLowerCase()),H=!E&&T.length>0&&!C,j=I.length+(H?1:0);if(f.key==="ArrowDown")f.preventDefault(),f.stopImmediatePropagation(),o=(o+1)%j,g(N,T);else if(f.key==="ArrowUp")f.preventDefault(),f.stopImmediatePropagation(),o=(o-1+j)%j,g(N,T);else if(f.key==="Enter"||f.key==="Tab"){if(f.preventDefault(),f.stopImmediatePropagation(),f._inlineAcHandled=!0,o<I.length)u(I[o]);else if(H){const $=m();if($){const D=$(T);u(D)}}}else f.key==="Escape"&&(f.preventDefault(),f.stopImmediatePropagation(),f._inlineAcHandled=!0,h())},!0);let y;n.addEventListener("blur",()=>{y=setTimeout(()=>h(),150)}),n.addEventListener("focus",()=>{clearTimeout(y)}),a||is(e)}function is(e){const t=r.inlineAutocompleteMeta.get(e);if(!t)return;const n=document.getElementById(e);if(!n)return;let a=document.getElementById(e+"-chips");a||(a=document.createElement("div"),a.id=e+"-chips",a.className="inline-meta-chips",n.parentNode.insertBefore(a,n.nextSibling));let s="";if(t.areaId){const o=r.taskAreas.find(i=>i.id===t.areaId);if(o){const i=Nn(o.color),l=o.emoji?v(o.emoji):'<svg style="display:inline-block;vertical-align:middle;width:12px;height:12px" viewBox="0 0 24 24" fill="currentColor"><path d="M2 6a2 2 0 012-2h5.586a1 1 0 01.707.293L12 6h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" opacity="0.35"/><rect x="2" y="9" width="20" height="11" rx="2"/></svg>';s+=`<span class="inline-meta-chip" style="background:${i}20;color:${i}">
        ${l} ${v(o.name)}
        <span class="inline-meta-chip-remove" onclick="removeInlineMeta('${e}','category','${o.id}')">
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </span>
      </span>`}}(t.labels||[]).forEach(o=>{const i=r.taskLabels.find(l=>l.id===o);if(i){const l=Nn(i.color);s+=`<span class="inline-meta-chip" style="background:${l}20;color:${l}">
        ${v(i.name)}
        <span class="inline-meta-chip-remove" onclick="removeInlineMeta('${e}','label','${i.id}')">
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </span>
      </span>`}}),(t.people||[]).forEach(o=>{const i=r.taskPeople.find(l=>l.id===o);if(i){const l=Nn(i.color);s+=`<span class="inline-meta-chip" style="background:${l}20;color:${l}">
        👤 ${v(i.name)}
        <span class="inline-meta-chip-remove" onclick="removeInlineMeta('${e}','person','${i.id}')">
          <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </span>
      </span>`}}),t.deferDate&&(s+=`<span class="inline-meta-chip" style="background:#8b5cf620;color:#8b5cf6">
      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>
      Defer ${ve(t.deferDate)}
      <span class="inline-meta-chip-remove" onclick="removeInlineMeta('${e}','deferDate','')">
        <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </span>
    </span>`),t.dueDate&&(s+=`<span class="inline-meta-chip" style="background:#ef444420;color:#ef4444">
      <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>
      Due ${ve(t.dueDate)}
      <span class="inline-meta-chip-remove" onclick="removeInlineMeta('${e}','dueDate','')">
        <svg class="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
      </span>
    </span>`),a.innerHTML=s}function bk(e,t,n){const a=r.inlineAutocompleteMeta.get(e);a&&(t==="category"?a.areaId=null:t==="label"?a.labels=(a.labels||[]).filter(s=>s!==n):t==="person"?a.people=(a.people||[]).filter(s=>s!==n):t==="deferDate"?a.deferDate=null:t==="dueDate"&&(a.dueDate=null),r.inlineAutocompleteMeta.set(e,a),is(e))}function ar(e){r.inlineAutocompleteMeta.delete(e);const t=document.getElementById(e+"-chips");t&&t.remove(),document.querySelectorAll(".inline-autocomplete-popup").forEach(n=>n.remove())}function Il(){typeof window.debouncedSaveToGithub=="function"&&window.debouncedSaveToGithub()}function yk(e){r.inlineEditingTaskId=e,window.render(),setTimeout(()=>{const t=document.getElementById("inline-edit-input");if(t){t.focus(),t.select();const n=r.tasksData.find(a=>a.id===e);n&&Tl("inline-edit-input",{initialMeta:{areaId:n.areaId||null,labels:n.labels?[...n.labels]:[],people:n.people?[...n.people]:[]}})}},100)}function Sf(e){const t=document.getElementById("inline-edit-input");if(t){const n=t.value.trim();if(n){const a={title:n},s=r.inlineAutocompleteMeta.get("inline-edit-input");s&&(s.areaId!==void 0&&(a.areaId=s.areaId),s.categoryId!==void 0&&(a.categoryId=s.categoryId),s.labels&&(a.labels=s.labels),s.people&&(a.people=s.people),s.deferDate&&(a.deferDate=s.deferDate),s.dueDate&&(a.dueDate=s.dueDate)),sa(e,a)}else vn(e)}ar("inline-edit-input"),r.inlineEditingTaskId=null,window.render()}function Tf(){if(r.inlineEditingTaskId){const e=r.tasksData.find(t=>t.id===r.inlineEditingTaskId);e&&!e.title&&vn(e.id)}ar("inline-edit-input"),r.inlineEditingTaskId=null,window.render()}function wk(e,t){e._inlineAcHandled||(e.key==="Enter"?(e.preventDefault(),Sf(t)):e.key==="Escape"&&(e.preventDefault(),Tf()))}function xk(e,t){r.inlineEditingTaskId=t;const n=e.target;n.dataset.originalTitle=n.textContent.trim()}function kk(e,t){if(!r.inlineEditingTaskId)return;const n=e.target,a=n.textContent.trim();if(r.inlineEditingTaskId=null,a&&a!==n.dataset.originalTitle)sa(t,{title:a}),window.render();else if(!a){const s=r.tasksData.find(o=>o.id===t);s&&!s.title?(vn(t),window.render()):s&&s.title&&(n.textContent=s.title)}}function Sk(e,t){if(e.key==="Enter"&&!e.shiftKey)e.preventDefault(),e.target.blur();else if(e.key==="Escape"){e.preventDefault();const n=e.target,a=r.tasksData.find(s=>s.id===t);if(r.inlineEditingTaskId=null,a&&!a.title){vn(t),window.render();return}a&&(n.textContent=a.title),n.blur()}}function Tk(e,t){const n=e.target,a=n.textContent||"";if(a.length>500){n.textContent=a.slice(0,500);const s=document.createRange(),o=window.getSelection();s.selectNodeContents(n),s.collapse(!1),o.removeAllRanges(),o.addRange(s)}}function Ik(e){e.preventDefault();const n=(e.clipboardData||window.clipboardData).getData("text/plain").replace(/[\r\n]+/g," ").trim(),a=window.getSelection();if(a.rangeCount){const s=a.getRangeAt(0);s.deleteContents(),s.insertNode(document.createTextNode(n)),s.collapse(!1),a.removeAllRanges(),a.addRange(s)}}function $k(e){setTimeout(()=>{const t=document.querySelector(`.task-inline-title[data-task-id="${e}"]`);if(t){t.focus();const n=document.createRange(),a=window.getSelection();if(t.childNodes.length>0){const s=t.childNodes[t.childNodes.length-1];n.setStartAfter(s)}else n.setStart(t,0);n.collapse(!0),a.removeAllRanges(),a.addRange(n)}},100)}function Ck(){if(r.editingTaskId=null,r.activeFilterType==="subcategory"&&r.activeCategoryFilter){const e=Qe(r.activeCategoryFilter);r.newTaskContext={areaId:e?.areaId||null,categoryId:r.activeCategoryFilter,labelId:null,labelIds:null,personId:null,status:"inbox"}}else if(r.activeFilterType==="area"&&r.activeAreaFilter)r.newTaskContext={areaId:r.activeAreaFilter,categoryId:null,labelId:null,labelIds:null,personId:null,status:"inbox"};else if(r.activeFilterType==="label"&&r.activeLabelFilter)r.newTaskContext={areaId:null,labelId:r.activeLabelFilter,labelIds:null,personId:null,status:"inbox"};else if(r.activeFilterType==="person"&&r.activePersonFilter)r.newTaskContext={areaId:null,labelId:null,labelIds:null,personId:r.activePersonFilter,status:"inbox"};else if(r.activeFilterType==="perspective"){const e=r.customPerspectives.find(t=>t.id===r.activePerspective);if(e&&e.filter){const t=e.filter.status==="today"?"anytime":e.filter.status||"inbox",n=e.filter.status==="today";r.newTaskContext={areaId:e.filter.categoryId||null,labelId:null,labelIds:e.filter.labelIds||null,personId:null,status:t,today:n,flagged:e.filter.statusRule==="flagged"}}else{const t={inbox:"inbox",today:"anytime",anytime:"anytime",someday:"someday"};r.newTaskContext={areaId:null,labelId:null,labelIds:null,personId:null,status:t[r.activePerspective]||"inbox",today:r.activePerspective==="today",flagged:r.activePerspective==="flagged"}}}else r.newTaskContext={areaId:null,labelId:null,labelIds:null,personId:null,status:"inbox"};r.showTaskModal=!0,window.render(),setTimeout(()=>{const e=document.getElementById("task-title");e&&e.focus()},50)}function If(e){const t=e.value.trim();if(!t)return;const n={status:"inbox"};if(r.activePerspective==="notes"&&(n.isNote=!0,n.status="anytime"),r.quickAddIsNote&&(n.isNote=!0,n.status="anytime"),r.activeFilterType==="subcategory"&&r.activeCategoryFilter){const s=Qe(r.activeCategoryFilter);n.areaId=s?.areaId||null,n.categoryId=r.activeCategoryFilter}else if(r.activeFilterType==="area"&&r.activeAreaFilter)n.areaId=r.activeAreaFilter;else if(r.activeFilterType==="label"&&r.activeLabelFilter)n.labels=[r.activeLabelFilter];else if(r.activeFilterType==="person"&&r.activePersonFilter)n.people=[r.activePersonFilter];else if(r.activeFilterType==="perspective"&&r.activePerspective&&r.activePerspective!=="notes"){const s=r.customPerspectives.find(o=>o.id===r.activePerspective);if(s&&s.filter)s.filter.status&&(s.filter.status==="today"?(n.status="anytime",n.today=!0):n.status=s.filter.status),s.filter.categoryId&&(n.areaId=s.filter.categoryId),s.filter.labelIds&&s.filter.labelIds.length>0&&(n.labels=s.filter.labelIds),s.filter.statusRule==="flagged"&&(n.flagged=!0);else{const o={inbox:"inbox",today:"anytime",anytime:"anytime",someday:"someday",flagged:"anytime"};o[r.activePerspective]&&(n.status=o[r.activePerspective],r.activePerspective==="today"&&(n.today=!0),r.activePerspective==="flagged"&&(n.flagged=!0))}}const a=r.inlineAutocompleteMeta.get("quick-add-input");a&&(a.areaId&&(n.areaId=a.areaId),a.categoryId&&(n.categoryId=a.categoryId),a.labels&&a.labels.length&&(n.labels=[...n.labels||[],...a.labels.filter(s=>!(n.labels||[]).includes(s))]),a.people&&a.people.length&&(n.people=[...n.people||[],...a.people.filter(s=>!(n.people||[]).includes(s))]),a.deferDate&&(n.deferDate=a.deferDate),a.dueDate&&(n.dueDate=a.dueDate)),tr(t,n),e.value="",r.quickAddIsNote=!1,ar("quick-add-input"),window.render(),setTimeout(()=>{const s=document.getElementById("quick-add-input");s&&s.focus()},50)}function Ek(e,t){e._inlineAcHandled||e.key==="Enter"&&(e.preventDefault(),If(t))}function Dk(){r.showInlineTagInput=!r.showInlineTagInput;const e=document.getElementById("inline-tag-form");e&&(r.showInlineTagInput?(e.innerHTML=`
        <div class="modal-inline-form flex items-center gap-2 mt-2 p-2 bg-[var(--bg-secondary)]/30 rounded-lg">
          <input type="text" id="inline-tag-name" placeholder="Tag name"
            class="modal-inline-input flex-1 px-2 py-1.5 text-sm border border-[var(--border-light)] rounded-md focus:border-[var(--accent)] focus:outline-none"
            onkeydown="if(event.key==='Enter'){event.preventDefault();addInlineTag();}">
          <input type="color" id="inline-tag-color" value="#6B7280" class="w-8 h-8 rounded-md cursor-pointer border-0">
          <button type="button" onclick="addInlineTag()" class="px-3 py-1.5 text-sm bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-dark)]">Add</button>
          <button type="button" onclick="toggleInlineTagInput()" class="px-2 py-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">&times;</button>
        </div>
      `,setTimeout(()=>document.getElementById("inline-tag-name")?.focus(),50)):e.innerHTML="")}function Ak(){const e=document.getElementById("inline-tag-name")?.value?.trim(),t=document.getElementById("inline-tag-color")?.value||"#6B7280";if(e){const n=na(e,t);r.showInlineTagInput=!1;const a=document.getElementById("task-labels-container");if(a){const s=Array.from(document.querySelectorAll(".task-label-checkbox:checked")).map(o=>o.value);s.push(n.id),a.innerHTML=r.taskLabels.map(o=>{const i=s.includes(o.id);return`
          <label class="label-checkbox flex items-center gap-1.5 px-2 py-1 rounded-md border cursor-pointer transition ${i?"bg-[var(--bg-secondary)]":"hover:bg-[var(--bg-secondary)]/50"}" style="border-color: ${o.color}">
            <input type="checkbox" value="${o.id}" ${i?"checked":""} class="task-label-checkbox rounded-sm" style="accent-color: ${o.color}">
            <span class="text-sm" style="color: ${o.color}">${v(o.name)}</span>
          </label>
        `}).join("")+`
        <button onclick="toggleInlineTagInput()" class="flex items-center gap-1 px-2 py-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50 rounded-md border border-dashed border-[var(--border-light)]">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          New
        </button>
      `}document.getElementById("inline-tag-form").innerHTML=""}}function Mk(){r.showInlinePersonInput=!r.showInlinePersonInput;const e=document.getElementById("inline-person-form");e&&(r.showInlinePersonInput?(e.innerHTML=`
        <div class="modal-inline-form flex items-center gap-2 mt-2 p-2 bg-[var(--bg-secondary)]/30 rounded-lg">
          <input type="text" id="inline-person-name" placeholder="Person name"
            class="modal-inline-input flex-1 px-2 py-1.5 text-sm border border-[var(--border-light)] rounded-md focus:border-[var(--accent)] focus:outline-none"
            onkeydown="if(event.key==='Enter'){event.preventDefault();addInlinePerson();}">
          <button type="button" onclick="addInlinePerson()" class="px-3 py-1.5 text-sm bg-[var(--accent)] text-white rounded-md hover:bg-[var(--accent-dark)]">Add</button>
          <button type="button" onclick="toggleInlinePersonInput()" class="px-2 py-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">&times;</button>
        </div>
      `,setTimeout(()=>document.getElementById("inline-person-name")?.focus(),50)):e.innerHTML="")}function Pk(){const e=document.getElementById("inline-person-name")?.value?.trim();if(e){const t=ra(e);r.showInlinePersonInput=!1;const n=document.getElementById("task-people-container");if(n){const a=Array.from(document.querySelectorAll(".task-person-checkbox:checked")).map(s=>s.value);a.push(t.id),n.innerHTML=r.taskPeople.map(s=>{const o=a.includes(s.id);return`
          <label class="label-checkbox flex items-center gap-1.5 px-2 py-1 rounded-md border border-[var(--border-light)] cursor-pointer transition ${o?"bg-[var(--bg-secondary)] border-[var(--border)]":"hover:bg-[var(--bg-secondary)]/50"}">
            <input type="checkbox" value="${s.id}" ${o?"checked":""} class="task-person-checkbox rounded-sm">
            <span class="text-sm text-[var(--text-secondary)]">${v(s.name)}</span>
          </label>
        `}).join("")+`
        <button onclick="toggleInlinePersonInput()" class="flex items-center gap-1 px-2 py-1 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]/50 rounded-md border border-dashed border-[var(--border-light)]">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          New
        </button>
      `}document.getElementById("inline-person-form").innerHTML=""}}const kn=new Map;function $l(){for(const[e,t]of kn)t.abort();kn.clear()}function Qs(e,t,n,a,s,o,i=!1,l=null,d="Search..."){const c=document.getElementById(e),p=document.getElementById(t);if(!c||!p)return;kn.has(e)&&kn.get(e).abort();const m=new AbortController;kn.set(e,m);const u=m.signal;let h=-1;function g(y){h=y;const f=p.querySelectorAll(".autocomplete-option");f.forEach((x,k)=>x.classList.toggle("highlighted",k===h)),h>=0&&f[h]&&f[h].scrollIntoView({block:"nearest"})}function b(y=""){const f=n.filter(k=>s(k).toLowerCase().includes(y.toLowerCase()));f.length===0&&!i?p.innerHTML='<div class="autocomplete-empty">No matches found</div>':(p.innerHTML=f.map((k,T)=>`
        <div class="autocomplete-option ${T===h?"highlighted":""}"
             data-id="${k.id}" data-idx="${T}">
          ${o?o(k):""}
          <span>${v(s(k))}</span>
        </div>
      `).join(""),i&&y.trim()&&!f.some(k=>s(k).toLowerCase()===y.toLowerCase())&&(p.innerHTML+=`
          <div class="autocomplete-create" data-create="true">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            Create "${v(y)}"
          </div>
        `)),p.querySelectorAll(".autocomplete-option").forEach(k=>{k.addEventListener("click",()=>{const T=n.find(E=>E.id===k.dataset.id);T&&(a(T),p.classList.remove("show"),c.value="")}),k.addEventListener("mouseenter",()=>{g(parseInt(k.dataset.idx,10))})});const x=p.querySelector(".autocomplete-create");x&&x.addEventListener("click",()=>{l&&(l(y.trim()),p.classList.remove("show"),c.value="")})}c.addEventListener("focus",()=>{b(c.value),p.classList.add("show")},{signal:u}),c.addEventListener("input",()=>{h=-1,b(c.value)},{signal:u}),c.addEventListener("keydown",y=>{const f=p.querySelectorAll(".autocomplete-option");y.key==="ArrowDown"?(y.preventDefault(),g(Math.min(h+1,f.length-1))):y.key==="ArrowUp"?(y.preventDefault(),g(Math.max(h-1,0))):y.key==="Enter"?(y.preventDefault(),h>=0&&f[h]?f[h].click():i&&c.value.trim()&&l&&(l(c.value.trim()),p.classList.remove("show"),c.value="")):y.key==="Escape"&&(y.preventDefault(),y.stopPropagation(),p.classList.remove("show"))},{signal:u}),document.addEventListener("click",y=>{if(!document.contains(c)){m.abort(),kn.delete(e);return}!c.contains(y.target)&&!p.contains(y.target)&&p.classList.remove("show")},{signal:u})}function $f(e){e?(r.modalSelectedArea=e.areaId||null,r.modalSelectedCategory=e.categoryId||null,r.modalSelectedStatus=e.status||"inbox",r.modalSelectedToday=!!e.today,r.modalSelectedFlagged=!!e.flagged,r.modalSelectedTags=[...e.labels||[]],r.modalSelectedPeople=[...e.people||[]],r.modalIsNote=e.isNote||!1,r.modalRepeatEnabled=e.repeat&&e.repeat.type!=="none",r.modalWaitingFor=e.waitingFor?{...e.waitingFor}:null,r.modalIsProject=e.isProject||!1,r.modalProjectId=e.projectId||null,r.modalProjectType=e.projectType||"parallel",r.modalTimeEstimate=e.timeEstimate||null):(r.modalSelectedArea=r.newTaskContext.areaId||null,r.modalSelectedCategory=r.newTaskContext.categoryId||null,r.modalSelectedStatus=r.newTaskContext.status||"inbox",r.modalSelectedToday=!!r.newTaskContext.today,r.modalSelectedFlagged=!!r.newTaskContext.flagged,r.modalSelectedTags=r.newTaskContext.labelIds?[...r.newTaskContext.labelIds]:r.newTaskContext.labelId?[r.newTaskContext.labelId]:[],r.modalSelectedPeople=r.newTaskContext.personId?[r.newTaskContext.personId]:[],r.modalIsNote=r.activePerspective==="notes",r.modalRepeatEnabled=!1,r.modalWaitingFor=null,r.modalIsProject=!1,r.modalProjectId=null,r.modalProjectType="parallel",r.modalTimeEstimate=null)}function Nk(e){r.modalIsNote=e,document.querySelectorAll(".type-option").forEach(n=>{n.classList.toggle("active",n.dataset.type==="note"===e)});const t=document.getElementById("task-title");t&&(t.placeholder=e?"What do you want to capture?":"What needs to be done?")}function Lk(e){e==="today"?(r.modalSelectedToday=!r.modalSelectedToday,r.modalSelectedToday&&r.modalSelectedStatus==="inbox"&&(r.modalSelectedStatus="anytime")):(r.modalSelectedStatus=e,(e==="inbox"||e==="someday")&&(r.modalSelectedToday=!1)),document.querySelectorAll(".status-pill").forEach(t=>{t.dataset.status==="today"?t.classList.toggle("selected",r.modalSelectedToday):t.classList.toggle("selected",t.dataset.status===r.modalSelectedStatus)})}function _k(){r.modalSelectedFlagged=!r.modalSelectedFlagged;const e=document.querySelector('.status-pill[data-status="flagged"]');e&&e.classList.toggle("selected",r.modalSelectedFlagged)}function Ok(e){const t=document.getElementById(e==="defer"?"task-defer":"task-due"),n=document.getElementById(e+"-display"),a=document.getElementById(e+"-clear-btn");!t||!n||(t.value?(n.textContent=ve(t.value),a&&a.classList.remove("hidden")):(n.textContent="None",a&&a.classList.add("hidden")))}function Rk(e){const t=document.getElementById(e==="defer"?"task-defer":"task-due"),n=document.getElementById(e+"-display"),a=document.getElementById(e+"-clear-btn");t&&(t.value=""),n&&(n.textContent="None"),a&&a.classList.add("hidden")}function Bk(e,t){const n=e==="defer"?"task-defer":"task-due",a=document.getElementById(n),s=document.getElementById(e+"-display"),o=document.getElementById(e+"-clear-btn");if(t===null){a&&(a.value=""),s&&(s.textContent="None"),o&&o.classList.add("hidden");return}const i=new Date;i.setHours(0,0,0,0),i.setDate(i.getDate()+t);const l=i.getFullYear(),d=String(i.getMonth()+1).padStart(2,"0"),c=String(i.getDate()).padStart(2,"0"),p=`${l}-${d}-${c}`;a&&(a.value=p),s&&(s.textContent=ve(p)),o&&o.classList.remove("hidden")}function jk(e){const t=document.getElementById(e==="defer"?"task-defer":"task-due");t?.showPicker&&t.showPicker()}function pi(e){r.modalSelectedArea=e?e.id:null;const t=document.getElementById("area-display");t&&(t.innerHTML=e?`<span class="tag-pill" style="background: ${e.color}20; color: ${e.color}">
           ${e.emoji||'<svg style="display:inline-block;vertical-align:middle;width:14px;height:14px" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17l10 5 10-5-10-5-10 5z" opacity="0.35"/><path d="M2 12l10 5 10-5-10-5-10 5z" opacity="0.6"/><path d="M12 2L2 7l10 5 10-5L12 2z"/></svg>'} ${v(e.name)}
           <span class="tag-pill-remove" onclick="event.stopPropagation(); selectArea(null); renderAreaInput();">
             <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
           </span>
         </span>`:'<span class="text-[var(--text-muted)] text-sm">No area selected</span>'),Zs()}function ls(){const e=document.getElementById("area-autocomplete-container");if(!e)return;const t=r.taskAreas.find(n=>n.id===r.modalSelectedArea);e.innerHTML=`
    <div id="area-display" class="modal-token-shell area-display-shell" onclick="document.getElementById('area-search').focus()">
      ${t?`<span class="tag-pill" style="background: ${t.color}20; color: ${t.color}">
             ${t.emoji||'<svg style="display:inline-block;vertical-align:middle;width:14px;height:14px" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17l10 5 10-5-10-5-10 5z" opacity="0.35"/><path d="M2 12l10 5 10-5-10-5-10 5z" opacity="0.6"/><path d="M12 2L2 7l10 5 10-5L12 2z"/></svg>'} ${v(t.name)}
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
  `,Qs("area-search","area-dropdown",r.taskAreas,n=>{pi(n),ls()},n=>n.name,n=>`<div class="autocomplete-option-icon" style="background: ${n.color}20; color: ${n.color}">${n.emoji||'<svg style="width:16px;height:16px" viewBox="0 0 24 24" fill="currentColor"><path d="M2 6a2 2 0 012-2h5.586a1 1 0 01.707.293L12 6h8a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" opacity="0.35"/><rect x="2" y="9" width="20" height="11" rx="2"/></svg>'}</div>`,!0,n=>{const a=new Date().toISOString(),s={id:"cat_"+Date.now(),name:n,color:"#6366f1",icon:"📁",createdAt:a,updatedAt:a};r.taskAreas.push(s),localStorage.setItem(_t,JSON.stringify(r.taskAreas)),Il(),pi(s),ls()})}function Cf(e){r.modalSelectedCategory=e?e.id:null;const t=document.getElementById("category-display");t&&(t.innerHTML=e?`<span class="tag-pill" style="background: ${e.color}20; color: ${e.color}">
           📂 ${v(e.name)}
           <span class="tag-pill-remove" onclick="event.stopPropagation(); selectCategory(null); renderCategoryInput();">
             <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
           </span>
         </span>`:'<span class="text-[var(--text-muted)] text-sm">No category selected</span>')}function Zs(){const e=document.getElementById("category-autocomplete-container");if(!e)return;const t=r.modalSelectedArea?_r(r.modalSelectedArea):r.taskCategories;if(r.modalSelectedCategory&&r.modalSelectedArea){const a=Qe(r.modalSelectedCategory);a&&a.areaId!==r.modalSelectedArea&&(r.modalSelectedCategory=null)}const n=r.modalSelectedCategory?Qe(r.modalSelectedCategory):null;if(t.length===0&&!n){e.innerHTML="";return}e.innerHTML=`
    <div id="category-display" class="modal-token-shell area-display-shell" onclick="document.getElementById('category-search')?.focus()">
      ${n?`<span class="tag-pill" style="background: ${n.color}20; color: ${n.color}">
             📂 ${v(n.name)}
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
  `,Qs("category-search","category-dropdown",t,a=>{Cf(a),Zs()},a=>a.name,a=>`<div class="autocomplete-option-icon" style="background: ${a.color}20; color: ${a.color}">📂</div>`,!1)}function fi(e){r.modalSelectedTags.includes(e.id)||(r.modalSelectedTags.push(e.id),eo())}function Fk(e){r.modalSelectedTags=r.modalSelectedTags.filter(t=>t!==e),eo()}function eo(){const e=document.getElementById("tags-input-container");if(!e)return;const t=r.modalSelectedTags.map(n=>r.taskLabels.find(a=>a.id===n)).filter(Boolean);e.innerHTML=`
    <div class="modal-token-shell">
      <div class="tag-input-container" onclick="document.getElementById('tags-search').focus()">
        ${t.map(n=>`
          <span class="tag-pill" style="background: ${n.color}20; color: ${n.color}">
            ${v(n.name)}
            <span class="tag-pill-remove" onclick="event.stopPropagation(); removeTag('${n.id}');">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </span>
          </span>
        `).join("")}
        <input type="text" id="tags-search" class="tag-input-field" placeholder="${t.length?"":"Add tags..."}">
      </div>
    </div>
    <div id="tags-dropdown" class="autocomplete-dropdown"></div>
  `,Qs("tags-search","tags-dropdown",r.taskLabels.filter(n=>!r.modalSelectedTags.includes(n.id)),n=>fi(n),n=>n.name,n=>`<div class="w-3 h-3 rounded-full" style="background: ${n.color}"></div>`,!0,n=>{const a=[ue("--danger")||"#ef4444",ue("--warning")||"#f59e0b",ue("--success")||"#22c55e",ue("--accent")||"#3b82f6",ue("--notes-accent")||"#8b5cf6","#ec4899"],s=new Date().toISOString(),o={id:"label_"+Date.now(),name:n,color:a[Math.floor(Math.random()*a.length)],createdAt:s,updatedAt:s};r.taskLabels.push(o),localStorage.setItem(Ot,JSON.stringify(r.taskLabels)),Il(),fi(o)})}function gi(e){r.modalSelectedPeople.includes(e.id)||(r.modalSelectedPeople.push(e.id),to())}function Hk(e){r.modalSelectedPeople=r.modalSelectedPeople.filter(t=>t!==e),to()}function to(){const e=document.getElementById("people-input-container");if(!e)return;const t=r.modalSelectedPeople.map(n=>r.taskPeople.find(a=>a.id===n)).filter(Boolean);e.innerHTML=`
    <div class="modal-token-shell">
      <div class="tag-input-container" onclick="document.getElementById('people-search').focus()">
        ${t.map(n=>`
          <span class="tag-pill" style="background: var(--accent-light); color: var(--accent)">
            ${n.photoData?`<img src="${n.photoData}" alt="" style="width:16px;height:16px" class="rounded-full object-cover" referrerpolicy="no-referrer">`:'<svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'}
            ${v(n.name)}
            <span class="tag-pill-remove" onclick="event.stopPropagation(); removePersonModal('${n.id}');">
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </span>
          </span>
        `).join("")}
        <input type="text" id="people-search" class="tag-input-field" placeholder="${t.length?"":"Add people..."}">
      </div>
    </div>
    <div id="people-dropdown" class="autocomplete-dropdown"></div>
  `,Qs("people-search","people-dropdown",r.taskPeople.filter(n=>!r.modalSelectedPeople.includes(n.id)),n=>gi(n),n=>n.name,n=>n?.photoData?`<div class="autocomplete-option-icon"><img src="${n.photoData}" alt="" style="width:20px;height:20px" class="rounded-full object-cover" referrerpolicy="no-referrer"></div>`:'<div class="autocomplete-option-icon bg-[var(--bg-secondary)]"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>',!0,n=>{const a=new Date().toISOString(),s={id:"person_"+Date.now(),name:n,email:"",createdAt:a,updatedAt:a};r.taskPeople.push(s),localStorage.setItem(Rt,JSON.stringify(r.taskPeople)),Il(),gi(s)})}function Wk(){r.modalRepeatEnabled=!r.modalRepeatEnabled;const e=document.querySelector(".repeat-toggle"),t=document.querySelector(".repeat-config");e&&e.classList.toggle("active",r.modalRepeatEnabled),t&&t.classList.toggle("show",r.modalRepeatEnabled)}function Gk(){setTimeout(()=>{ls(),Zs(),eo(),to(),ds(),la(),Cl(),document.querySelectorAll(".status-pill").forEach(n=>{n.dataset.status==="today"?n.classList.toggle("selected",r.modalSelectedToday):n.dataset.status==="flagged"?n.classList.toggle("selected",r.modalSelectedFlagged):n.classList.toggle("selected",n.dataset.status===r.modalSelectedStatus)}),document.querySelectorAll(".type-option").forEach(n=>{n.classList.toggle("active",n.dataset.type==="note"===r.modalIsNote)});const e=document.getElementById("task-title");e&&e.focus(),Tl("task-title",{isModal:!0});const t=document.getElementById("task-notes");if(t&&t.value&&(t.style.height="auto",t.style.height=t.scrollHeight+"px"),he()){const n=document.querySelector(".modal-body-enhanced");n&&n.querySelectorAll("input, textarea, select").forEach(a=>{a.addEventListener("focus",()=>{setTimeout(()=>a.scrollIntoView({block:"center",behavior:"smooth"}),300)})})}},50)}function Uk(){if(ar("task-title"),$l(),r.editingTaskId){const e=r.tasksData.find(t=>t.id===r.editingTaskId);e&&!e.title&&vn(r.editingTaskId)}if(he()){const e=document.querySelector(".modal-overlay");if(e){e.classList.add("sheet-dismissing"),setTimeout(()=>{r.showTaskModal=!1,r.editingTaskId=null,r.modalStateInitialized=!1,window.render()},350);return}}r.showTaskModal=!1,r.editingTaskId=null,r.modalStateInitialized=!1,window.render()}function zk(){const e=document.getElementById("task-title").value.trim();if(!e){alert("Please enter a title");return}let t=null;if(r.modalRepeatEnabled){const s=document.getElementById("task-repeat-type")?.value||"daily",o=document.querySelector('input[name="repeat-from"]:checked')?.value||"completion";t={type:s,interval:parseInt(document.getElementById("task-repeat-interval")?.value)||1,from:o}}let n=document.getElementById("task-defer")?.value||null;const a={title:e,notes:document.getElementById("task-notes")?.value.trim()||"",status:r.modalSelectedStatus,today:r.modalSelectedToday,flagged:r.modalSelectedFlagged,areaId:r.modalSelectedArea,categoryId:r.modalSelectedCategory||null,deferDate:n,dueDate:document.getElementById("task-due")?.value||null,repeat:t,labels:r.modalSelectedTags,people:r.modalSelectedPeople,isNote:r.modalIsNote,waitingFor:r.modalWaitingFor,isProject:r.modalIsProject,projectId:r.modalProjectId,projectType:r.modalProjectType,timeEstimate:r.modalTimeEstimate};if(!r.modalIsNote&&a.status==="inbox"&&a.areaId&&(a.status="anytime"),!r.modalIsNote&&a.status==="inbox"&&a.today&&(a.status="anytime"),r.editingTaskId?sa(r.editingTaskId,a):tr(e,a),ar("task-title"),$l(),he()){const s=document.querySelector(".modal-overlay");if(s){s.classList.add("sheet-dismissing"),setTimeout(()=>{r.showTaskModal=!1,r.editingTaskId=null,r.modalStateInitialized=!1,window.render()},350);return}}r.showTaskModal=!1,r.editingTaskId=null,r.modalStateInitialized=!1,window.render()}function Ef(e,t="",n=7){if(!e){r.modalWaitingFor=null,ds();return}const a=new Date;a.setDate(a.getDate()+n);const s=a.getFullYear(),o=String(a.getMonth()+1).padStart(2,"0"),i=String(a.getDate()).padStart(2,"0");r.modalWaitingFor={personId:e,description:t,followUpDate:`${s}-${o}-${i}`},ds()}function ds(){const e=document.getElementById("waiting-for-container");if(!e)return;const t=r.editingTaskId?r.tasksData.find(a=>a.id===r.editingTaskId):null,n=r.modalWaitingFor||t?.waitingFor||null;if(!n)e.innerHTML=`
      <div class="flex items-center gap-2">
        <button type="button" onclick="toggleWaitingForForm()" class="flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-lg transition">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          Mark as Waiting For
        </button>
      </div>
      <div id="waiting-for-form" class="hidden"></div>
    `;else{const a=r.taskPeople.find(i=>i.id===n.personId),s=a?a.name:"Unknown",o=n.followUpDate?ve(n.followUpDate):"No follow-up set";e.innerHTML=`
      <div class="flex items-start gap-3 p-3 bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-lg">
        <svg class="w-5 h-5 text-[var(--accent)] flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-[var(--text-primary)]">Waiting for ${v(s)}</div>
          ${n.description?`<div class="text-sm text-[var(--text-secondary)] mt-0.5">${v(n.description)}</div>`:""}
          <div class="text-xs text-[var(--text-muted)] mt-1">Follow up: ${o}</div>
        </div>
        <button type="button" onclick="setWaitingFor(null)" class="flex-shrink-0 p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded transition">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
    `}}function Vk(){const e=document.getElementById("waiting-for-form");e&&(e.classList.contains("hidden")?(e.classList.remove("hidden"),e.innerHTML=`
      <div class="mt-3 p-3 bg-[var(--bg-secondary)]/30 rounded-lg space-y-3">
        <div>
          <label class="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">Person</label>
          <select id="waiting-person-select" class="input-field mt-1">
            <option value="">Select person...</option>
            ${r.taskPeople.map(t=>`<option value="${t.id}">${v(t.name)}</option>`).join("")}
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
    `,setTimeout(()=>document.getElementById("waiting-person-select")?.focus(),50)):(e.classList.add("hidden"),e.innerHTML=""))}function qk(e=7){const t=document.getElementById("waiting-person-select")?.value,n=document.getElementById("waiting-description-input")?.value?.trim()||"";if(!t){alert("Please select a person to wait for");return}Ef(t,n,e);const a=document.getElementById("waiting-for-form");a&&(a.classList.add("hidden"),a.innerHTML="")}function Kk(){r.modalIsProject=!r.modalIsProject,la()}function Yk(e){e!=="sequential"&&e!=="parallel"||(r.modalProjectType=e,la())}function Jk(e){r.modalProjectId=e,la()}function la(){const e=document.getElementById("project-container");if(!e)return;const t=r.editingTaskId?r.tasksData.find(c=>c.id===r.editingTaskId):null,n=r.modalIsProject||t?.isProject||!1,a=r.modalProjectId||t?.projectId||null,s=r.modalProjectType||t?.projectType||"parallel",o=r.tasksData.filter(c=>c.isProject&&!c.completed&&(!t||c.id!==t.id)),i=o.length>0,l=a?r.tasksData.find(c=>c.id===a):null;let d=`
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
                ${v(c.title)}
              </option>
            `).join("")}
          </select>
          ${l?`
            <p class="text-xs text-[var(--text-muted)]">
              This task belongs to project: <strong>${v(l.title)}</strong>
            </p>
          `:""}
        </div>
      `:""}
    </div>
  `;e.innerHTML=d}function Xk(e){r.modalTimeEstimate=e,Cl()}function Cl(){const e=document.getElementById("time-estimate-container");if(!e)return;const t=r.modalTimeEstimate;let a=`
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
  `;e.innerHTML=a}function Qk(){const e=V(),t=r.editingTaskId?r.tasksData.find(n=>n.id===r.editingTaskId):null;return r.showTaskModal&&!r.modalStateInitialized&&($f(t),r.modalStateInitialized=!0),r.showTaskModal?`
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
            <input type="text" id="task-title" value="${v(t?.title||"")}"
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
              class="modal-textarea-enhanced">${v(t?.notes||"")}</textarea>
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
                <div class="text-sm text-[var(--text-primary)]" id="defer-display">${t?.deferDate?ve(t.deferDate):"None"}</div>
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
                <div class="text-sm text-[var(--text-primary)]" id="due-display">${t?.dueDate?ve(t.dueDate):"None"}</div>
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
              onclick="closeTaskModal(); openCalendarMeetingNotesByEventKey('${String(t.meetingEventKey).replace(/\\/g,"\\\\").replace(/'/g,"\\'")}')"
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
  `:""}function vt(e,t){const n=document.getElementById(e);if(!n)return!1;n.style.borderColor="var(--danger)",n.style.boxShadow="0 0 0 3px color-mix(in srgb, var(--danger) 15%, transparent)";const a=n.parentElement.querySelector(".field-error-msg");a&&a.remove();const s=document.createElement("p");s.className="field-error-msg",s.style.cssText="color: var(--danger); font-size: 12px; margin-top: 4px; font-weight: 500;",s.textContent=t,n.insertAdjacentElement("afterend",s),n.focus();const o=()=>{n.style.borderColor="",n.style.boxShadow="";const i=n.parentElement.querySelector(".field-error-msg");i&&i.remove(),n.removeEventListener("input",o)};return n.addEventListener("input",o),!1}function Zk(){const e=document.getElementById("area-name").value.trim(),t=document.getElementById("area-emoji")?.value?.trim()||"",n=document.getElementById("area-color")?.value||"#6366F1";if(!e)return vt("area-name","Please enter an area name");if(r.taskAreas.find(s=>s.id!==r.editingAreaId&&s.name.toLowerCase()===e.toLowerCase()))return vt("area-name","An area with this name already exists");if(r.editingAreaId)Zo(r.editingAreaId,{name:e,emoji:t,color:n});else{const s=Os(e,t);n!==s.color&&Zo(s.id,{color:n})}r.showAreaModal=!1,r.editingAreaId=null,r.pendingAreaEmoji="",window.render()}function eS(){const e=document.getElementById("category-name")?.value?.trim(),t=document.getElementById("category-area")?.value,n=document.getElementById("category-color")?.value||"#6366F1",a=document.getElementById("category-emoji")?.value?.trim()||"";if(!e)return vt("category-name","Please enter a name");if(!t)return vt("category-area","Please select an area");if(r.editingCategoryId)ei(r.editingCategoryId,{name:e,areaId:t,color:n,emoji:a});else{const s=Gu(e,t,a);n!==s.color&&ei(s.id,{color:n})}r.showCategoryModal=!1,r.editingCategoryId=null,r.pendingCategoryEmoji="",window.render()}function tS(){const e=document.getElementById("label-name").value.trim();if(!e)return vt("label-name","Please enter a tag name");if(r.taskLabels.find(a=>a.id!==r.editingLabelId&&a.name.toLowerCase()===e.toLowerCase()))return vt("label-name","A label with this name already exists");const n=document.getElementById("label-color").value;r.editingLabelId?Uu(r.editingLabelId,{name:e,color:n}):na(e,n),r.showLabelModal=!1,r.editingLabelId=null,window.render()}function nS(){const e=document.getElementById("person-name").value.trim(),t=document.getElementById("person-email").value.trim();if(!e)return vt("person-name","Please enter a name");if(r.taskPeople.find(a=>a.id!==r.editingPersonId&&a.name.toLowerCase()===e.toLowerCase()))return vt("person-name","A person with this name already exists");r.editingPersonId?zu(r.editingPersonId,{name:e,email:t}):ra(e,t),r.showPersonModal=!1,r.editingPersonId=null,window.render()}function rS(){const e=document.getElementById("perspective-name").value.trim();if(!e)return vt("perspective-name","Please enter a perspective name");const t=document.getElementById("perspective-icon").value||"📌",n={},a=document.getElementById("perspective-logic")?.value||"all";n.logic=a;const s=document.getElementById("perspective-category").value;s&&(n.categoryId=s);const o=document.getElementById("perspective-status").value;o&&(n.status=o);const i=document.getElementById("perspective-availability")?.value;i&&(n.availability=i);const l=document.getElementById("perspective-status-rule")?.value;l&&(n.statusRule=l);const d=document.getElementById("perspective-person")?.value;d&&(n.personId=d);const c=document.getElementById("perspective-tags-mode")?.value||"any";n.tagMatch=c;const p=Array.from(document.querySelectorAll(".perspective-tag-checkbox:checked")).map(b=>b.value);p.length>0&&(n.labelIds=p),document.getElementById("perspective-due").checked&&(n.hasDueDate=!0),document.getElementById("perspective-defer").checked&&(n.hasDeferDate=!0),document.getElementById("perspective-repeat").checked&&(n.isRepeating=!0),document.getElementById("perspective-untagged").checked&&(n.isUntagged=!0),document.getElementById("perspective-inbox").checked&&(n.inboxOnly=!0);const m=document.getElementById("perspective-range-type")?.value||"either",u=document.getElementById("perspective-range-start")?.value||"",h=document.getElementById("perspective-range-end")?.value||"";(u||h)&&(n.dateRange={type:m,start:u||null,end:h||null});const g=document.getElementById("perspective-search")?.value?.trim()||"";if(g&&(n.searchTerms=g),r.editingPerspectiveId){const b=r.customPerspectives.findIndex(y=>y.id===r.editingPerspectiveId);b!==-1&&(r.customPerspectives[b]={...r.customPerspectives[b],name:e,icon:t,filter:n,updatedAt:new Date().toISOString()},O()),r.activePerspective=r.editingPerspectiveId}else tf(e,t,n),r.activePerspective=r.customPerspectives[r.customPerspectives.length-1].id;r.showPerspectiveModal=!1,r.editingPerspectiveId=null,r.pendingPerspectiveEmoji="",window.render()}function aS(e){r.pendingPerspectiveEmoji=e,r.perspectiveEmojiPickerOpen=!1,r.emojiSearchQuery="";const t=document.getElementById("perspective-icon"),n=document.getElementById("perspective-icon-display");t&&(t.value=e),n&&(n.textContent=e);const a=document.querySelector(".emoji-picker-dropdown");a&&a.remove()}function sS(e){r.pendingAreaEmoji=e,r.areaEmojiPickerOpen=!1,r.emojiSearchQuery="";const t=document.getElementById("area-emoji"),n=document.getElementById("area-folder-preview");t&&(t.value=e),n&&(n.innerHTML=e);const a=document.querySelector(".emoji-picker-dropdown");a&&a.remove()}function oS(e){r.pendingCategoryEmoji=e,r.categoryEmojiPickerOpen=!1,r.emojiSearchQuery="";const t=document.getElementById("category-emoji"),n=document.getElementById("cat-folder-preview");t&&(t.value=e),n&&(n.innerHTML=e);const a=document.querySelector(".emoji-picker-dropdown");a&&a.remove()}const iS={Smileys:"😀😃😄😁😆😅🤣😂🙂😉😊😇🥰😍🤩😘😚🤔🤨😐😑😶🙄😏😒😞😢😭😤🤯😱😨🥵🥶",Objects:"📌📋📅📊🔍💡🔔⭐🌟🔥❤️💎🏆🎖️🎯🚀✈️📦📧✉️📝📓📖📚💻📱⌨️🖥️🎨🎵🎬📷🎮⚽🏀",Nature:"🌳🌲🌿☘️🍀🌺🌹🌻🌼🌷🌞🌙⭐⚡🌈❄️💧🌊🔥🌾🍃🍂🍁🐝🦋",Food:"🍎🍊🍋🍌🍉🍇🍓🫐🍑🍒🥝🍅🥑🍕🍔🌮🍜🍣🍰☕🍺🥤🍷",People:"👤👥👨‍💻👩‍💻👨‍🔬👩‍🔬👨‍🏫👩‍🏫🧑‍💼🧑‍🔧🧑‍🎨👷🦸🦹🧙",Places:"🏠🏢🏭🏫🏥🏪🏨⛪🕌🕍🏟️🏔️🏖️🌅🌄🌃✈️🚀🚂🚗",Symbols:"✅❌❗❓⚠️♻️🔄↕️↔️▶️⏸️⏹️🔀🔁🔂➕➖✖️➗🟰🟱🟢🟡🟠🔴🟣🟤⚫⚪🔵🟦"},lS={happy:"😀😃😄😁😆😊",sad:"😞😢😭",angry:"😤",love:"🥰😍❤️",heart:"❤️🥰😍",star:"⭐🌟",fire:"🔥",sun:"🌞🌅🌄",moon:"🌙",rain:"💧🌊",snow:"❄️",tree:"🌳🌲",flower:"🌺🌹🌻🌼🌷",leaf:"🌿🍃🍂🍁☘️🍀",home:"🏠",house:"🏠",office:"🏢",school:"🏫",hospital:"🏥",church:"⛪",mosque:"🕌",car:"🚗",plane:"✈️",rocket:"🚀",train:"🚂",book:"📖📚📓",computer:"💻🖥️",phone:"📱",mail:"📧✉️",pen:"📝",music:"🎵",art:"🎨",film:"🎬",camera:"📷",game:"🎮",food:"🍕🍔🌮🍜🍣🍰",fruit:"🍎🍊🍋🍌🍉🍇🍓🍑🍒",drink:"☕🍺🥤🍷",coffee:"☕",beer:"🍺",wine:"🍷",check:"✅",cross:"❌",warning:"⚠️",question:"❓",red:"🔴🟥",green:"🟢🟩",blue:"🔵🟦",yellow:"🟡",orange:"🟠",purple:"🟣",black:"⚫",white:"⚪",pin:"📌",target:"🎯",trophy:"🏆",medal:"🎖️",gem:"💎",diamond:"💎",think:"🤔",wink:"😉",cool:"🤩",kiss:"😘",cry:"😢😭",work:"🧑‍💼💼💻",person:"👤👥",people:"👥👤",search:"🔍",light:"💡",bell:"🔔",calendar:"📅",chart:"📊",soccer:"⚽",basketball:"🏀",sport:"⚽🏀🏆",bug:"🐝🦋",butterfly:"🦋",bee:"🐝",hero:"🦸",wizard:"🧙",magic:"🧙",mountain:"🏔️",beach:"🏖️",city:"🌃",lightning:"⚡",rainbow:"🌈",wave:"🌊",water:"💧🌊",plus:"➕",minus:"➖",recycle:"♻️",refresh:"🔄"};function Df(e,t){const n=(e||"").toLowerCase().trim();let a=null;if(n){a=new Set;for(const[o,i]of Object.entries(lS))if(o.includes(n)){const l=new Intl.Segmenter("en",{granularity:"grapheme"});for(const d of l.segment(i))d.segment.trim()&&a.add(d.segment)}}let s="";for(const[o,i]of Object.entries(iS)){const l=[...new Intl.Segmenter("en",{granularity:"grapheme"}).segment(i)].map(c=>c.segment).filter(c=>c.trim()),d=n?o.toLowerCase().includes(n)?l:l.filter(c=>a&&a.has(c)):l;d.length!==0&&(s+=`
      <div class="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-1 pt-2 pb-1">${o}</div>
      <div class="grid grid-cols-6 sm:grid-cols-8 gap-0.5">
        ${d.map(c=>`<button type="button" class="w-11 h-11 sm:w-8 sm:h-8 flex items-center justify-center text-xl sm:text-lg rounded-md hover:bg-[var(--accent-light)] transition cursor-pointer" onclick="event.stopPropagation(); ${t}('${c.replace(/'/g,"\\'")}')">${c}</button>`).join("")}
      </div>
    `)}return s}function dS(e){const t=`${e}EmojiPickerOpen`,n=r[t];if(r.perspectiveEmojiPickerOpen=!1,r.areaEmojiPickerOpen=!1,r.categoryEmojiPickerOpen=!1,r.emojiSearchQuery="",n){const d=document.querySelector(".emoji-picker-dropdown");d&&d.remove();return}r[t]=!0;const s={perspective:"selectPerspectiveEmoji",area:"selectAreaEmoji",category:"selectCategoryEmoji"}[e],o=pS(s),i={perspective:"perspective-icon-display",area:"area-folder-preview",category:"cat-folder-preview"},l=document.getElementById(i[e]);if(l){const d=l.closest(".relative")||l.parentElement,c=d.querySelector(".emoji-picker-dropdown");c&&c.remove(),d.insertAdjacentHTML("beforeend",o),setTimeout(()=>{const p=document.getElementById("emoji-search-input");p&&p.focus()},50)}}function cS(){return r.perspectiveEmojiPickerOpen?"selectPerspectiveEmoji":r.areaEmojiPickerOpen?"selectAreaEmoji":r.categoryEmojiPickerOpen?"selectCategoryEmoji":"selectPerspectiveEmoji"}function uS(e){r.emojiSearchQuery=e;const t=cS(),n=Df(e,t),a=document.getElementById("emoji-grid-content");a&&(a.innerHTML=n||'<p class="text-center text-[13px] text-[var(--text-muted)] py-4">No matches</p>')}function pS(e="selectPerspectiveEmoji"){const t=r.emojiSearchQuery||"",n=Df(t,e);return`
    <div class="emoji-picker-dropdown absolute top-full left-0 mt-1 z-[400] w-full max-w-72 bg-[var(--modal-bg)] rounded-lg border border-[var(--border-light)] shadow-xl overflow-hidden" onclick="event.stopPropagation()">
      <div class="p-2 border-b border-[var(--border-light)]">
        <input type="text" id="emoji-search-input" placeholder="Search emojis..." value="${v(t)}"
          oninput="updateEmojiGrid(this.value)"
          class="input-field-sm w-full">
      </div>
      <div id="emoji-grid-content" class="p-2 max-h-52 overflow-y-auto">
        ${n||'<p class="text-center text-[13px] text-[var(--text-muted)] py-4">No matches</p>'}
      </div>
    </div>
  `}function Af(e,t,n){const a=Yf.map(s=>`<button type="button" class="color-swatch${s.toLowerCase()===e.toLowerCase()?" selected":""}" style="background:${s}" title="${s}"
      onclick="document.getElementById('${t}').value='${s}';var p=document.getElementById('${n}');if(p){p.style.background='${s}20';p.style.color='${s}';}document.querySelectorAll('#${t}-grid .color-swatch').forEach(function(s){s.classList.remove('selected')});this.classList.add('selected');"></button>`).join("");return`
    <input type="hidden" id="${t}" value="${e}">
    <div>
      <span class="text-[13px] text-[var(--text-muted)]">Folder color</span>
      <div id="${t}-grid" class="color-swatch-grid mt-2">${a}</div>
    </div>`}function fS(){if(!r.showPerspectiveModal)return"";const e=r.editingPerspectiveId?(r.customPerspectives||[]).find(s=>s.id===r.editingPerspectiveId):null,t=r.pendingPerspectiveEmoji||e?.icon||"📌",n=e?.filter||{},a=(s,o)=>s===o?"selected":"";return`
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
                  value="${v(e?.name||"")}"
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
                    ${(r.taskAreas||[]).map(s=>`<option value="${s.id}" ${a(n.categoryId,s.id)}>${v(s.name)}</option>`).join("")}
                  </select>
                </div>
                <div>
                  <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Person</label>
                  <select id="perspective-person" class="modal-input-enhanced">
                    <option value="">Any person</option>
                    ${(r.taskPeople||[]).map(s=>`<option value="${s.id}" ${a(n.personId,s.id)}>${v(s.name)}</option>`).join("")}
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
                  <span class="text-[13px] text-[var(--text-primary)]">${v(s.name)}</span>
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
              value="${v(n.searchTerms||"")}"
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
  `}function gS(){if(!r.showAreaModal)return"";const e=r.editingAreaId?(r.taskAreas||[]).find(a=>a.id===r.editingAreaId):null,t=e?.color||"#6366F1",n=r.pendingAreaEmoji||e?.emoji||"";return`
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
              <input type="text" id="area-name" value="${e?.name?v(e.name):""}"
                placeholder="Area name" autofocus maxlength="100"
                onkeydown="if(event.key==='Enter'){event.preventDefault();saveAreaFromModal();}"
                class="modal-input-enhanced w-full text-lg font-medium">
              ${Af(t,"area-color","area-folder-preview")}
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
  `}function mS(){if(!r.showCategoryModal)return"";const e=r.editingCategoryId?(r.taskCategories||[]).find(o=>o.id===r.editingCategoryId):null,t=e?e.areaId:r.modalSelectedArea||r.taskAreas[0]?.id||"",n=r.taskAreas.find(o=>o.id===t),a=e?e.color:n?n.color:"#6366F1",s=r.pendingCategoryEmoji||e?.emoji||"";return`
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
              <input type="text" id="category-name" value="${e?v(e.name):""}" placeholder="Category name"
                class="modal-input-enhanced w-full text-lg font-medium" autofocus onkeydown="if(event.key==='Enter'){event.preventDefault();saveCategoryFromModal();}">
              <select id="category-area" class="modal-input-enhanced w-full text-sm">
                ${(r.taskAreas||[]).map(o=>`<option value="${o.id}" ${o.id===t?"selected":""}>${v(o.name)}</option>`).join("")}
              </select>
              ${Af(a,"category-color","cat-folder-preview")}
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
  `}function hS(){if(!r.showLabelModal)return"";const e=r.editingLabelId?(r.taskLabels||[]).find(t=>t.id===r.editingLabelId):null;return`
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
            <input type="text" id="label-name" value="${e?.name?v(e.name):""}"
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
  `}function vS(){if(!r.showPersonModal)return"";const e=r.editingPersonId?(r.taskPeople||[]).find(t=>t.id===r.editingPersonId):null;return`
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
              ${Er(e,64)}
            </div>
          `:""}
          <div>
            <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Name</label>
            <input type="text" id="person-name" value="${e?.name?v(e.name):""}"
              placeholder="e.g., John Doe" autofocus maxlength="100"
              onkeydown="if(event.key==='Enter'){event.preventDefault();savePersonFromModal();}"
              class="modal-input-enhanced w-full">
          </div>
          <div>
            <label class="text-[11px] font-medium text-[var(--text-muted)] block mb-1.5">Email</label>
            <input type="email" id="person-email" value="${e?.email?v(e.email):""}"
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
  `}const cs=[{key:"task",label:"Tasks",icon:"☑️",prefix:null},{key:"note",label:"Notes",icon:"📝",prefix:null},{key:"area",label:"Areas",icon:"🗂️",prefix:"#"},{key:"category",label:"Categories",icon:"📂",prefix:null},{key:"label",label:"Labels",icon:"🏷️",prefix:"@"},{key:"person",label:"People",icon:"👤",prefix:"&"},{key:"perspective",label:"Perspectives",icon:"🔭",prefix:null},{key:"trigger",label:"Triggers",icon:"⚡",prefix:null}],bS={task:8,note:5,area:5,category:5,label:5,person:5,perspective:5,trigger:5},yS=30,wS=50,xS=150;let Ln=null;function rt(e){return!e||typeof e!="string"?"":/^#[0-9a-fA-F]{3,8}$/.test(e)||/^(rgb|hsl)a?\([^)]+\)$/.test(e)||/^var\(--[\w-]+\)$/.test(e)?e:""}function El(e){if(!e)return"";const t=e.trim();return t.length>0&&["#","@","&"].includes(t[0])?t.slice(1).trim():t}function kS(){r.showGlobalSearch=!0,r.globalSearchQuery="",r.globalSearchResults=[],r.globalSearchActiveIndex=-1,r.globalSearchTypeFilter=null,window.render(),setTimeout(()=>{const e=document.getElementById("global-search-input");e&&e.focus()},50)}function Dl(){r.showGlobalSearch=!1,r.globalSearchQuery="",r.globalSearchResults=[],r.globalSearchActiveIndex=-1,r.globalSearchTypeFilter=null,Ln&&(clearTimeout(Ln),Ln=null)}function SS(e){r.globalSearchQuery=e;const t={"#":"area","@":"label","&":"person"},n=e.length>0?e[0]:"";if(t[n]){const a=t[n];r.globalSearchTypeFilter!==a&&(r.globalSearchTypeFilter=a,us())}else r.globalSearchTypeFilter&&Object.values(t).includes(r.globalSearchTypeFilter)&&(r.globalSearchTypeFilter=null,us());Ln&&clearTimeout(Ln),Ln=setTimeout(()=>{const a=Al(e,r.globalSearchTypeFilter);r.globalSearchResults=a,r.globalSearchActiveIndex=da(a).length>0?0:-1,Br()},xS)}function TS(e){const n=da().length;e.key==="ArrowDown"?(e.preventDefault(),n>0&&(r.globalSearchActiveIndex=(r.globalSearchActiveIndex+1)%n,Br(),Od())):e.key==="ArrowUp"?(e.preventDefault(),n>0&&(r.globalSearchActiveIndex=(r.globalSearchActiveIndex-1+n)%n,Br(),Od())):e.key==="Enter"?(e.preventDefault(),r.globalSearchActiveIndex>=0&&r.globalSearchActiveIndex<n&&Mf(r.globalSearchActiveIndex)):e.key==="Escape"?(e.preventDefault(),e.stopPropagation(),Dl(),window.render()):e.key==="Tab"&&(e.preventDefault(),DS(e.shiftKey))}function Mf(e){const t=da();if(e<0||e>=t.length)return;const n=t[e];Dl(),ES(n)}function IS(e){const t=r.globalSearchTypeFilter;r.globalSearchTypeFilter=t===e?null:e;const n=Al(r.globalSearchQuery,r.globalSearchTypeFilter);r.globalSearchResults=n,r.globalSearchActiveIndex=da(n).length>0?0:-1,Br(),us();const a=document.getElementById("global-search-input");a&&a.focus()}function Al(e,t){const n=El(e);if(!n)return[];const a=n.toLowerCase(),s=[],o=t?cs.filter(i=>i.key===t):cs;for(const i of o){const l=$S(i.key,a);if(l.length>0){const d=t?yS:bS[i.key]||5;s.push({type:i.key,label:i.label,icon:i.icon,items:l.slice(0,d)})}}if(!t){let i=0;for(const l of s){const d=wS-i;if(d<=0){l.items=[];continue}l.items.length>d&&(l.items=l.items.slice(0,d)),i+=l.items.length}}return s.filter(i=>i.items.length>0)}function $S(e,t,n){const a=[];switch(e){case"task":{const s=(r.tasksData||[]).filter(o=>!o.isNote&&o.title);for(const o of s){let i=Ge(o.title,t)+(o.notes?CS(o.notes,t):0);if(i>0){o.completed&&(i=Math.max(1,Math.floor(i*.4)));const l=o.areaId?(r.taskAreas||[]).find(c=>c.id===o.areaId):null,d=o.completed?"Completed":o.status==="today"||o.today?"Today":o.status||"inbox";a.push({id:o.id,type:"task",title:o.title,score:i,subtitle:[l?.name,d].filter(Boolean).join(" · "),icon:o.completed?"✅":o.flagged?"🚩":"☑️",color:rt(l?.color)||"var(--accent)"})}}break}case"note":{const s=(r.tasksData||[]).filter(o=>o.isNote&&o.noteLifecycleState!=="deleted"&&o.title);for(const o of s){const i=Ge(o.title,t);if(i>0){const l=o.areaId?(r.taskAreas||[]).find(d=>d.id===o.areaId):null;a.push({id:o.id,type:"note",title:o.title,score:i,subtitle:l?.name||"No area",icon:"📝",color:rt(l?.color)||"var(--text-muted)"})}}break}case"area":{const s=r.taskAreas||[];for(const o of s){const i=Ge(o.name,t);if(i>0){const l=(r.tasksData||[]).filter(d=>d.areaId===o.id&&!d.completed&&!d.isNote).length;a.push({id:o.id,type:"area",title:o.name,score:i,subtitle:`${l} task${l!==1?"s":""}`,icon:o.emoji||o.icon||"📦",color:rt(o.color)||"var(--accent)"})}}break}case"category":{const s=r.taskCategories||[];for(const o of s){const i=Ge(o.name,t);if(i>0){const l=o.areaId?(r.taskAreas||[]).find(d=>d.id===o.areaId):null;a.push({id:o.id,type:"category",title:o.name,score:i,subtitle:l?.name||"",icon:o.emoji||"📂",color:rt(o.color||l?.color)||"var(--accent)"})}}break}case"label":{const s=r.taskLabels||[];for(const o of s){const i=Ge(o.name,t);if(i>0){const l=(r.tasksData||[]).filter(d=>!d.completed&&!d.isNote&&(d.labels||[]).includes(o.id)).length;a.push({id:o.id,type:"label",title:o.name,score:i,subtitle:`${l} task${l!==1?"s":""}`,icon:"🏷️",color:rt(o.color)||"#6B7280"})}}break}case"person":{const s=r.taskPeople||[];for(const o of s){const i=Ge(o.name,t),l=o.email?Ge(o.email,t)*.8:0,d=o.jobTitle?Ge(o.jobTitle,t)*.6:0,c=Math.max(i,l,d);c>0&&a.push({id:o.id,type:"person",title:o.name,score:c,subtitle:[o.jobTitle,o.email].filter(Boolean).join(" · "),icon:"👤",color:"#6B7280"})}break}case"perspective":{const s=Array.from(Ee).map(d=>({...d,_builtin:!0})),o={...ze,_builtin:!0},i=(r.customPerspectives||[]).map(d=>({...d,_builtin:!1})),l=[...s,o,...i];for(const d of l){const c=Ge(d.name,t);c>0&&a.push({id:d.id,type:"perspective",title:d.name,score:c,subtitle:d._builtin?"Built-in perspective":"Custom perspective",icon:"🔭",color:rt(d.color)||"var(--accent)"})}break}case"trigger":{const s=r.triggers||[];for(const o of s){if(!o.title)continue;const i=Ge(o.title,t);if(i>0){const l=o.areaId?(r.taskAreas||[]).find(d=>d.id===o.areaId):null;a.push({id:o.id,type:"trigger",title:o.title,score:i,subtitle:l?.name||"",icon:"⚡",color:rt(l?.color)||"var(--text-muted)"})}}break}}return a.sort((s,o)=>o.score-s.score),a}function Ge(e,t){if(!e)return 0;const n=e.toLowerCase();return n===t?150:n.startsWith(t)?100:n.split(/[\s\-_/]+/).some(s=>s.startsWith(t))?60:n.includes(t)?30:0}function CS(e,t){return e&&e.toLowerCase().includes(t)?10:0}function ES(e){switch(e.type){case"task":case"note":r.editingTaskId=e.id,r.showTaskModal=!0,window.render();break;case"area":window.showAreaTasks(e.id);break;case"category":window.showCategoryTasks(e.id);break;case"label":window.showLabelTasks(e.id);break;case"person":window.showPersonTasks(e.id);break;case"perspective":window.showPerspectiveTasks(e.id);break;case"trigger":{const t=(r.triggers||[]).find(n=>n.id===e.id);t?.areaId?window.showAreaTasks(t.areaId):(r.activeTab="tasks",window.render());break}}}function da(e){const t=e||r.globalSearchResults,n=[];for(const a of t)for(const s of a.items)n.push(s);return n}function DS(e){const t=[null,...cs.map(o=>o.key)],n=t.indexOf(r.globalSearchTypeFilter),a=e?(n-1+t.length)%t.length:(n+1)%t.length;r.globalSearchTypeFilter=t[a];const s=Al(r.globalSearchQuery,r.globalSearchTypeFilter);r.globalSearchResults=s,r.globalSearchActiveIndex=da(s).length>0?0:-1,Br(),us()}function AS(e,t){if(!e||!t)return v(e||"");const n=El(t);if(!n)return v(e);const a=e.toLowerCase(),s=n.toLowerCase(),o=a.indexOf(s);if(o===-1)return v(e);const i=e.slice(0,o),l=e.slice(o,o+n.length),d=e.slice(o+n.length);return`${v(i)}<mark class="global-search-highlight">${v(l)}</mark>${v(d)}`}function Od(){requestAnimationFrame(()=>{const e=document.getElementById("global-search-results"),t=e?.querySelector(".global-search-result.active");t&&e&&t.scrollIntoView({block:"nearest",behavior:"smooth"})})}function Br(){const e=document.getElementById("global-search-results");e&&(e.innerHTML=Nf())}function us(){const e=document.getElementById("global-search-type-filters");e&&(e.innerHTML=Pf())}function MS(){return r.showGlobalSearch?`
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
            value="${v(r.globalSearchQuery)}"
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
          ${Pf()}
        </div>
        <div id="global-search-results" class="global-search-results" role="listbox" aria-label="Search results">
          ${Nf()}
        </div>
        <div class="global-search-footer" aria-hidden="true">
          <span><kbd>&uarr;</kbd><kbd>&darr;</kbd> Navigate</span>
          <span><kbd>&crarr;</kbd> Open</span>
          <span><kbd>Tab</kbd> Filter</span>
          <span><kbd>Esc</kbd> Close</span>
        </div>
      </div>
    </div>`:""}function Pf(){const e=r.globalSearchTypeFilter;let t=`<button type="button" class="global-search-type-chip ${e===null?"active":""}" onclick="setSearchTypeFilter(null);event.stopPropagation()" aria-pressed="${e===null}">All</button>`;for(const n of cs){const a=e===n.key;t+=`<button type="button" class="global-search-type-chip ${a?"active":""}" onclick="setSearchTypeFilter('${n.key}');event.stopPropagation()" aria-pressed="${a}">${v(n.icon)} ${v(n.label)}</button>`}return t}function Nf(){const e=r.globalSearchResults,t=r.globalSearchQuery,n=El(t);if(!n)return`<div class="global-search-empty">
      <div class="global-search-empty-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity:0.3" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
      </div>
      <p>Type to search across everything</p>
      <p class="global-search-empty-hint">Use <kbd>#</kbd> for areas, <kbd>@</kbd> for labels, <kbd>&amp;</kbd> for people</p>
    </div>`;if(!e||e.length===0)return`<div class="global-search-empty">
      <p>No results for "${v(n)}"</p>
    </div>`;let a="",s=0;for(const o of e){a+=`<div class="global-search-group-header" aria-hidden="true">
      <span>${v(o.icon)} ${v(o.label)}</span>
      <span class="global-search-group-count">${o.items.length} found</span>
    </div>`;for(const i of o.items){const l=s===r.globalSearchActiveIndex,d=rt(i.color)?`style="color:${rt(i.color)}"`:"";a+=`<button type="button" class="global-search-result ${l?"active":""}"
        role="option" aria-selected="${l}"
        data-result-idx="${s}"
        onclick="selectGlobalSearchResult(${s})"
        onmouseenter="this.parentElement.querySelector('.global-search-result.active')?.classList.remove('active');this.classList.add('active');window.globalSearchActiveIndex=${s}">
        <span class="global-search-result-icon" ${d}>${v(i.icon)}</span>
        <div class="global-search-result-text">
          <span class="global-search-result-title">${AS(i.title,t)}</span>
          ${i.subtitle?`<span class="global-search-result-subtitle">${v(i.subtitle)}</span>`:""}
        </div>
        <span class="global-search-result-badge">${v(i.type)}</span>
      </button>`,s++}}return a}let Nt=null,St="",cr="";function PS(){return window.SpeechRecognition||window.webkitSpeechRecognition||null}function Lf(){if(Nt)try{Nt.stop()}catch{}}function _f(e){if(e.key==="Escape"){e.preventDefault(),Ml();return}if(e.key!=="Tab")return;const t=document.querySelector(".braindump-overlay");if(!t)return;const n=t.querySelectorAll('button, input, textarea, select, [tabindex]:not([tabindex="-1"])');if(!n.length)return;const a=n[0],s=n[n.length-1];e.shiftKey&&document.activeElement===a?(e.preventDefault(),s.focus()):!e.shiftKey&&document.activeElement===s&&(e.preventDefault(),a.focus())}function NS(){St="",Nt=null,r.showBraindump=!0,r.braindumpStep="input",r.braindumpRawText="",r.braindumpParsedItems=[],r.braindumpEditingIndex=null,r.braindumpVoiceRecording=!1,r.braindumpVoiceTranscribing=!1,r.braindumpVoiceError=null,window.render(),document.addEventListener("keydown",_f),setTimeout(()=>{const e=document.getElementById("braindump-textarea");e&&e.focus()},100)}function Ml(){document.removeEventListener("keydown",_f),Lf(),Nt=null,St="",r.showBraindump=!1,r.braindumpRawText="",r.braindumpParsedItems=[],r.braindumpStep="input",r.braindumpEditingIndex=null,r.braindumpVoiceRecording=!1,r.braindumpVoiceTranscribing=!1,r.braindumpVoiceError=null,window.render()}async function LS(){if(r.braindumpProcessing)return;const e=document.getElementById("braindump-textarea");if(e&&(r.braindumpRawText=e.value),!r.braindumpRawText.trim())return;zt()&&(r.braindumpProcessing=!0,r.braindumpStep="processing",window.render());try{r.braindumpParsedItems=await nf(r.braindumpRawText),r.braindumpStep="review",r.braindumpEditingIndex=null}catch(n){console.error("Braindump processing failed:",n),r.braindumpAIError=n.message||"Processing failed unexpectedly",r.braindumpParsedItems=[],r.braindumpStep="input"}finally{r.braindumpProcessing=!1}window.render()}function Of(){if(r.braindumpVoiceRecording||r.braindumpVoiceTranscribing)return;r.braindumpVoiceError=null;const e=PS();if(!e){r.braindumpVoiceError="Voice input is not supported in this browser. Try Safari/Chrome on mobile and enable microphone permission.",window.render();return}St="",cr=(r.braindumpRawText||"").trim();const t=new e;Nt=t,t.lang=navigator.language||"en-US",t.continuous=!0,t.interimResults=!0,t.maxAlternatives=1,t.onstart=()=>{r.braindumpVoiceRecording=!0,r.braindumpVoiceTranscribing=!1,r.braindumpVoiceError=null;const n=document.getElementById("braindump-voice-btn");n&&(n.classList.add("voice-recording-active"),n.innerHTML='<svg class="w-5 h-5 text-[var(--danger)] animate-pulse" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="6"/></svg>');const a=document.getElementById("braindump-voice-error");a&&(a.style.display="none")},t.onresult=n=>{let a="";for(let s=n.resultIndex;s<n.results.length;s++){const o=n.results[s],i=(o?.[0]?.transcript||"").trim();o.isFinal&&i&&(a+=`${i}
`)}if(a){St+=a;const s=cr?`${cr}
${St.trim()}`:St.trim();r.braindumpRawText=s;const o=document.getElementById("braindump-textarea");o&&(o.value=s)}},t.onerror=n=>{r.braindumpVoiceRecording=!1,r.braindumpVoiceTranscribing=!1,n?.error!=="no-speech"&&n?.error!=="aborted"&&(r.braindumpVoiceError=`Voice input error: ${n.error||"unknown"}`),window.render()},t.onend=async()=>{const n=St.trim();if(St="",Nt=null,r.braindumpVoiceRecording=!1,r.braindumpVoiceTranscribing=!!n,window.render(),n&&!!zt())try{const o=(await t0(n)||n).trim();r.braindumpRawText=cr?`${cr}
${o}`:o}catch{}r.braindumpVoiceTranscribing=!1,window.render(),setTimeout(()=>{const a=document.getElementById("braindump-textarea");a&&(a.focus(),a.setSelectionRange(a.value.length,a.value.length))},50)},r.braindumpVoiceTranscribing=!1;try{t.start()}catch(n){Nt=null,r.braindumpVoiceRecording=!1,r.braindumpVoiceTranscribing=!1,r.braindumpVoiceError=`Voice input could not start: ${n?.message||"unknown error"}`,window.render()}}function Rf(){Nt&&(r.braindumpVoiceTranscribing=!1,Lf())}function _S(){r.braindumpVoiceRecording||r.braindumpVoiceTranscribing?Rf():Of()}function OS(){r.braindumpStep="input",r.braindumpEditingIndex=null,window.render(),setTimeout(()=>{const e=document.getElementById("braindump-textarea");e&&e.focus()},100)}function RS(e){const t=r.braindumpParsedItems[e];t&&(t.type=t.type==="task"?"note":"task",window.render())}function BS(e){const t=r.braindumpParsedItems[e];t&&(t.included=!t.included,window.render())}function jS(e){r.braindumpParsedItems.splice(e,1),r.braindumpParsedItems.forEach((t,n)=>t.index=n),window.render()}function FS(e){r.braindumpEditingIndex=e,window.render(),setTimeout(()=>{const t=document.getElementById(`braindump-edit-${e}`);t&&(t.focus(),t.select())},50)}function HS(e){const t=document.getElementById(`braindump-edit-${e}`);t&&(r.braindumpParsedItems[e].title=t.value.trim()||r.braindumpParsedItems[e].title),r.braindumpEditingIndex=null,window.render()}function WS(){r.braindumpEditingIndex=null,window.render()}function GS(e,t){const n=r.braindumpParsedItems[e];n&&(n.areaId=t||null,window.render())}function US(e,t){const n=r.braindumpParsedItems[e];n&&(n.labels.includes(t)||n.labels.push(t),window.render())}function zS(e,t){const n=r.braindumpParsedItems[e];n&&(n.labels=n.labels.filter(a=>a!==t),window.render())}function VS(e,t){const n=r.braindumpParsedItems[e];n&&(n.people.includes(t)||n.people.push(t),window.render())}function qS(e,t){const n=r.braindumpParsedItems[e];n&&(n.people=n.people.filter(a=>a!==t),window.render())}function KS(e,t){const n=r.braindumpParsedItems[e];n&&(n.deferDate=t,window.render())}function YS(e){const t=r.braindumpParsedItems[e];t&&(t.deferDate=null,t.dueDate=null,window.render())}function JS(){const e=rf(r.braindumpParsedItems);r.braindumpStep="success",r.braindumpSuccessMessage=`Added ${e.taskCount} task${e.taskCount!==1?"s":""} and ${e.noteCount} note${e.noteCount!==1?"s":""}`,window.render(),setTimeout(()=>{Ml()},1500)}function XS(){return r.showBraindump?"":`
    <button onclick="openBraindump()" class="braindump-fab" title="Braindump (Cmd+Shift+D)" aria-label="Open Braindump">
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
        <polyline points="14 3 14 9 20 9"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="13" y2="17"/>
      </svg>
    </button>
  `}function QS(){return r.showBraindump?r.braindumpStep==="success"?rT():r.braindumpStep==="processing"?nT():r.braindumpStep==="review"?eT():ZS():""}function ZS(){const e=r.braindumpRawText||"",t=e?e.split(`
`).filter(o=>o.trim()).length:0,n=e.trim()?e.trim().split(/\s+/).length:0,a=r.braindumpVoiceRecording||r.braindumpVoiceTranscribing,s=!!zt();return`
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
        >${v(e)}</textarea>
      </div>

      <div class="braindump-writer-hints">
        <span># area</span>
        <span>@ tag</span>
        <span>& person</span>
        <span>! date</span>
      </div>

      <div id="braindump-voice-error" class="braindump-voice-error" style="${r.braindumpVoiceError?"":"display:none"}">${r.braindumpVoiceError?v(r.braindumpVoiceError):""}</div>
    </div>
  `}function eT(){const e=r.braindumpParsedItems,t=e.filter(s=>s.included&&s.type==="task").length,n=e.filter(s=>s.included&&s.type==="note").length,a=r.braindumpFullPage||he();return`
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
            <span class="text-xs">${v(r.braindumpAIError)}</span>
          </div>
        `:""}

        <div class="braindump-body braindump-items-list">
          ${e.map((s,o)=>tT(s,o)).join("")}
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
  `}function tT(e,t){const n=r.braindumpEditingIndex===t;e.areaId&&r.taskAreas.find(i=>i.id===e.areaId);const a=r.taskAreas.map(i=>`<option value="${i.id}" ${e.areaId===i.id?"selected":""}>${v(i.name)}</option>`).join(""),s=r.taskPeople.filter(i=>!e.people.includes(i.id)),o=r.taskLabels.filter(i=>!e.labels.includes(i.id));return`
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
            value="${v(e.title)}"
            onkeydown="if(event.key==='Enter'){saveBraindumpItemEdit(${t});event.preventDefault()}else if(event.key==='Escape')cancelBraindumpItemEdit()"
            onblur="saveBraindumpItemEdit(${t})" />
        `:`
          <span class="braindump-title-text">${v(e.title)}</span>
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
                <span class="braindump-pill" style="--pill-color: ${l.color}">
                  ${v(l.name)}
                  <button onclick="event.stopPropagation(); removeBraindumpItemPerson(${t}, '${i}')" class="braindump-pill-remove">&times;</button>
                </span>
              `:""}).join("")}
            ${s.length>0?`
              <select class="braindump-add-select" onchange="if(this.value){addBraindumpItemPerson(${t}, this.value); this.value=''}">
                <option value="">+ Add</option>
                ${s.map(i=>`<option value="${i.id}">${v(i.name)}</option>`).join("")}
              </select>
            `:""}
          </div>
        </div>

        <div class="braindump-meta-field">
          <span class="braindump-meta-label">Tags</span>
          <div class="braindump-pills-row">
            ${e.labels.map(i=>{const l=r.taskLabels.find(d=>d.id===i);return l?`
                <span class="braindump-pill" style="--pill-color: ${l.color}">
                  ${v(l.name)}
                  <button onclick="event.stopPropagation(); removeBraindumpItemLabel(${t}, '${i}')" class="braindump-pill-remove">&times;</button>
                </span>
              `:""}).join("")}
            ${o.length>0?`
              <select class="braindump-add-select" onchange="if(this.value){addBraindumpItemLabel(${t}, this.value); this.value=''}">
                <option value="">+ Add</option>
                ${o.map(i=>`<option value="${i.id}">${v(i.name)}</option>`).join("")}
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
  `}function nT(){return`
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
  `}function rT(){return`
    <div class="braindump-overlay">
      <div class="braindump-success">
        <svg class="w-12 h-12 text-[var(--success)] mb-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <p class="text-base font-semibold text-[var(--text-primary)]">${r.braindumpSuccessMessage||"Done!"}</p>
      </div>
    </div>
  `}function ps(e){return e?(typeof e=="string"?new Date(e):new Date(typeof e=="number"?e:parseInt(e,10))).toLocaleString(void 0,{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}):"Never"}function jr(e){return`<span class="w-2 h-2 rounded-full flex-shrink-0 ${e?"bg-[var(--success)]":"bg-[var(--text-muted)]/40"}"></span>`}function aT(){const e=pc(),t=e.totalSaves>0?(e.successfulSaves/e.totalSaves*100).toFixed(0):"--",n=e.totalLoads>0?(e.successfulLoads/e.totalLoads*100).toFixed(0):"--",a=r.githubSyncDirty?'<span class="text-[var(--warning)]">Unsaved changes</span>':'<span class="text-[var(--success)]">Clean</span>',s=e.lastError?`<span class="text-[var(--danger)] text-[10px]">${v(e.lastError.message)} (${ps(e.lastError.timestamp)})</span>`:'<span class="text-[var(--text-muted)]">None</span>',o=(e.recentEvents||[]).slice(0,10);return`
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
                  <span class="${l} font-medium">${v(i.type)}</span>
                  <span class="text-[var(--text-muted)] flex-1">${i.details?v(i.details):""}</span>
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
  `}function Q(e,t,n,a=null){return`
    <div class="flex items-center justify-between py-2 border-b border-[var(--border-light)]">
      <span class="text-sm text-[var(--text-secondary)]">${e}</span>
      <input type="number" step="1" inputmode="numeric" value="${t}"
        class="input-field-sm w-20 text-center"
        onchange="window.updateWeight('${n}', ${a?`'${a}'`:"null"}, this.value)">
    </div>
  `}function Rd(e,{connected:t,workerUrl:n,apiKey:a,lastSync:s,setUrlFn:o,setKeyFn:i,connectFn:l,disconnectFn:d,syncFn:c,checkStatusFn:p,isLast:m=!1}){const u=n&&a,h=ps(s),g=m?"":"border-b border-[var(--border-light)]";return t?`
      <div class="py-3 ${g}">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5 min-w-0">
            ${jr(!0)}
            <span class="text-sm font-medium text-[var(--text-primary)]">${e}</span>
            <span class="text-xs text-[var(--text-muted)]">${h}</span>
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
    <div class="py-3 ${g}">
      <div class="flex items-center justify-between gap-3 mb-3">
        <div class="flex items-center gap-2.5">
          ${jr(!1)}
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
        <button onclick="window.${l}()" class="px-3 py-1.5 bg-[var(--accent)] text-white rounded-md text-xs font-medium hover:bg-[var(--accent-dark)] transition ${u?"":"opacity-50 cursor-not-allowed"}" ${u?"":"disabled"}>Connect</button>
        ${p?`<button onclick="window.${p}()" class="px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-md text-xs font-medium hover:bg-[var(--bg-tertiary)] transition ${u?"":"opacity-50 cursor-not-allowed"}" ${u?"":"disabled"}>Check Status</button>`:""}
      </div>
    </div>
  `}function sT(){const e=le(),t=r.gcalTokenExpired,n=r.gcalCalendarsLoading,a=r.gcalError,s=r.gcalCalendarList||[],o=er(),i=Fn(),l=localStorage.getItem(xi),d=ps(l?parseInt(l,10):null),c=localStorage.getItem(gs),p=ps(c?parseInt(c,10):null),m=a?a.match(/https?:\/\/[^\s]+/):null,u=m?m[0]:"",h=s.filter(g=>g.accessRole==="owner"||g.accessRole==="writer");return e?t?`
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
          ${jr(!0)}
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
          <p class="text-xs text-[var(--warning)]">${v(a)}</p>
          ${u?`<a href="${v(u)}" target="_blank" rel="noopener noreferrer" class="text-[11px] font-medium text-[var(--warning)] underline">Open API setup</a>`:""}
          <button onclick="window.fetchCalendarList()" class="ml-2 px-2 py-1 bg-white border border-[color-mix(in_srgb,var(--warning)_30%,transparent)] rounded-md text-[11px] font-medium text-[var(--warning)] hover:bg-[color-mix(in_srgb,var(--warning)_12%,transparent)] transition">Retry</button>
        </div>
      `:s.length>0?`
        <div class="pl-4 space-y-3 mb-2">
          <div>
            <label class="text-xs text-[var(--text-muted)] block mb-1.5">Show events from</label>
            <div class="space-y-1 max-h-36 overflow-y-auto">
              ${s.map(g=>`
                <label class="flex items-center gap-2 px-1.5 py-0.5 rounded-md hover:bg-[var(--bg-secondary)] cursor-pointer">
                  <input type="checkbox" ${o.includes(g.id)?"checked":""}
                    onchange="window.toggleCalendarSelection('${g.id.replace(/'/g,"\\'")}')"
                    class="rounded text-[var(--accent)] focus:ring-[var(--accent)]">
                  <span class="w-2.5 h-2.5 rounded-full flex-shrink-0" style="background: ${g.backgroundColor}"></span>
                  <span class="text-xs text-[var(--text-primary)] truncate">${v(g.summary)}</span>
                </label>
              `).join("")}
            </div>
          </div>
          <div>
            <label class="text-xs text-[var(--text-muted)] block mb-1">Push tasks to</label>
            <select onchange="window.setTargetCalendar(this.value)"
              class="input-field-sm w-full">
              ${h.map(g=>`
                <option value="${v(g.id)}" ${g.id===i?"selected":""}>${v(g.summary)}</option>
              `).join("")}
            </select>
          </div>
          <div class="flex items-center justify-between gap-2 pt-2 border-t border-[var(--border-light)]">
            <div class="min-w-0">
              <span class="text-xs text-[var(--text-muted)]">Contacts sync · ${p}</span>
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
        ${r.gcontactsError?`<p class="text-[11px] text-[var(--warning)] pl-4 mb-1">${v(r.gcontactsError)}</p>`:""}
      `:'<p class="text-xs text-[var(--text-muted)] pl-4 mb-2">No calendars found.</p>'}
    </div>
  `:`
      <div class="py-3 border-b border-[var(--border-light)]">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            ${jr(!1)}
            <span class="text-sm font-medium text-[var(--text-primary)]">Google Calendar</span>
            <span class="text-xs text-[var(--text-muted)]">Not connected</span>
          </div>
          <button onclick="window.connectGCal()" class="px-3 py-1.5 bg-[var(--accent)] text-white rounded-md text-xs font-medium hover:bg-[var(--accent-dark)] transition">Connect</button>
        </div>
      </div>
    `}function oT(){const e=zt(),t=!!e;return`
    <div class="py-3">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          ${jr(t)}
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
  `}function iT(){return`
    <div class="py-3 border-b border-[var(--border-light)]">
      <h4 class="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-2.5">Data Management</h4>
      <div class="flex flex-col sm:flex-row flex-wrap gap-2">
        <button onclick="window.exportData()" class="sb-btn px-3 py-2 sm:py-1.5 rounded-md text-xs font-medium">Export Data</button>
        <label class="sb-btn px-3 py-2 sm:py-1.5 rounded-md text-xs font-medium cursor-pointer text-center">
          Import Data
          <input type="file" accept=".json" class="hidden" onchange="window.importData(event)">
        </label>
        <button onclick="window.forceHardRefresh()" class="px-3 py-2 sm:py-1.5 bg-[var(--accent)]/10 text-[var(--accent)] rounded-md text-xs font-medium hover:bg-[var(--accent)]/20 transition">Force Refresh</button>
      </div>
    </div>
  `}function lT(){const e=r.tasksData.filter(s=>s?.isNote),t=e.filter(s=>!s.completed&&s.noteLifecycleState!=="deleted").length,n=e.filter(s=>s.noteLifecycleState==="deleted").length,a=e.filter(s=>s.completed&&s.noteLifecycleState!=="deleted").length;return`
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
  `}function dT(){const e=window.getGCalOfflineQueue?.()||[];return`
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
  `}function cT(){const e=r.conflictNotifications||[];return`
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
  `}function uT(){const e=r.renderPerf||{lastMs:0,avgMs:0,maxMs:0,count:0};return`
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
  `}function pT(){const e=r.currentUser,t=Wt(),n=gn(),a=le(),s=[t,n,a].filter(Boolean).length;return`
    <div class="space-y-4">
      ${e?`
      <div class="sb-card rounded-lg p-5 bg-[var(--bg-card)]">
        <div class="flex items-center gap-4">
          ${e.photoURL?`<img src="${v(e.photoURL)}" alt="" class="w-10 h-10 rounded-full border border-[var(--border)]" referrerpolicy="no-referrer">`:`<div class="w-10 h-10 rounded-full bg-[var(--accent)] text-white flex items-center justify-center text-base font-semibold">${(e.displayName||e.email||"?")[0].toUpperCase()}</div>`}
          <div class="flex-1 min-w-0">
            <p class="font-medium text-[var(--text-primary)] truncate">${v(e.displayName||"User")}</p>
            <p class="text-xs text-[var(--text-muted)] truncate">${v(e.email||"")}</p>
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
              class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${Mr()==="light"?"bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm":"bg-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              Light
            </button>
            <button onclick="window.setColorMode('dark')"
              class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all ${Mr()==="dark"?"bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm":"bg-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}">
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              Dark
            </button>
          </div>
        </div>

        <!-- Theme selector -->
        <span class="text-sm text-[var(--text-secondary)] block mb-2">Theme</span>
        <div class="flex gap-3">
          ${Object.entries(Hf).map(([o,i])=>`
            <button onclick="window.setTheme('${o}')"
              class="flex-1 p-3 rounded-lg border-2 text-left transition-all ${Fa()===o?"border-[var(--accent)] bg-[var(--accent)]/5":"border-[var(--border)] hover:border-[var(--accent)]/50"}">
              <div class="flex items-center gap-2 mb-1.5">
                <span class="text-sm font-semibold text-[var(--text-primary)]">${i.name}</span>
                ${Fa()===o?'<span class="text-[10px] bg-[var(--accent)] text-white px-1.5 py-0.5 rounded-full">Active</span>':""}
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
            ${Et()?'<span class="w-2 h-2 rounded-full bg-[var(--success)] mr-1.5"></span> Connected':'<span class="w-2 h-2 rounded-full bg-[var(--text-muted)]/40 mr-1.5"></span> Not connected'}
          </span>
        </div>
        <div class="flex gap-2 mb-3">
          <input type="password" id="github-token-input" value="${Et()}"
            placeholder="ghp_xxxx or github_pat_xxxx"
            class="input-field flex-1">
          <button onclick="window.setGithubToken(document.getElementById('github-token-input').value)"
            class="sb-btn px-3 py-1.5 rounded-md text-xs font-medium">Save</button>
        </div>
        <div class="flex flex-wrap gap-2">
          <button onclick="window.saveToGithub()" class="px-3 py-1.5 bg-[var(--accent)] text-white rounded-lg text-xs font-medium hover:bg-[var(--accent-dark)] transition ${Et()?"":"opacity-50 cursor-not-allowed"}" ${Et()?"":"disabled"}>Sync Now</button>
          <button onclick="window.loadCloudData().then(() => window.render())" class="px-3 py-1.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg text-xs font-medium hover:bg-[var(--bg-tertiary)] transition">Pull from Cloud</button>
        </div>
        ${(()=>{const o=lc();return`<div class="flex items-center gap-1.5 mt-2 pt-2 border-t border-[var(--border-light)]">
            <span class="w-1.5 h-1.5 rounded-full ${o.hasCreds?"bg-[var(--success)]":"bg-[var(--text-muted)]/40"}"></span>
            <span class="text-[11px] text-[var(--text-muted)]">${o.hasCreds?o.count+" credential"+(o.count!==1?"s":"")+" synced to cloud":"No credentials to sync"}</span>
          </div>`})()}
      </div>

      <!-- Sync Health -->
      ${aT()}

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
          ${Rd("WHOOP",{connected:t,workerUrl:Xn(),apiKey:Qr(),lastSync:Cs(),setUrlFn:"setWhoopWorkerUrl",setKeyFn:"setWhoopApiKey",connectFn:"connectWhoop",disconnectFn:"disconnectWhoop",syncFn:"syncWhoopNow",checkStatusFn:"checkWhoopStatus"})}
          ${Rd("Freestyle Libre",{connected:n,workerUrl:Qn(),apiKey:Zn(),lastSync:Es(),setUrlFn:"setLibreWorkerUrl",setKeyFn:"setLibreApiKey",connectFn:"connectLibre",disconnectFn:"disconnectLibre",syncFn:"syncLibreNow",checkStatusFn:"checkLibreStatus"})}
          ${sT()}
          ${oT()}
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
                ${Q("On-time prayer",r.WEIGHTS.prayer.onTime,"prayer","onTime")}
                ${Q("Late prayer",r.WEIGHTS.prayer.late,"prayer","late")}
                ${Q("Quran (per page)",r.WEIGHTS.prayer.quran,"prayer","quran")}
              </div>
              <div class="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border)]">
                <h4 class="sb-section-title text-[var(--text-secondary)] mb-2 text-xs">Glucose</h4>
                ${Q("Avg Glucose max pts",r.WEIGHTS.glucose.avgMax,"glucose","avgMax")}
                ${Q("TIR pts per %",r.WEIGHTS.glucose.tirPerPoint,"glucose","tirPerPoint")}
                ${Q("Insulin threshold",r.WEIGHTS.glucose.insulinThreshold,"glucose","insulinThreshold")}
                ${Q("Insulin bonus",r.WEIGHTS.glucose.insulinBase,"glucose","insulinBase")}
                ${Q("Insulin penalty",r.WEIGHTS.glucose.insulinPenalty,"glucose","insulinPenalty")}
              </div>
              <div class="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border)]">
                <h4 class="sb-section-title text-[var(--text-secondary)] mb-2 text-xs">Whoop</h4>
                ${Q("Sleep >=90%",r.WEIGHTS.whoop.sleepPerfHigh,"whoop","sleepPerfHigh")}
                ${Q("Sleep 70-90%",r.WEIGHTS.whoop.sleepPerfMid,"whoop","sleepPerfMid")}
                ${Q("Sleep 50-70%",r.WEIGHTS.whoop.sleepPerfLow,"whoop","sleepPerfLow")}
                ${Q("Recovery >=66%",r.WEIGHTS.whoop.recoveryHigh,"whoop","recoveryHigh")}
                ${Q("Recovery 50-66%",r.WEIGHTS.whoop.recoveryMid,"whoop","recoveryMid")}
                ${Q("Recovery 33-50%",r.WEIGHTS.whoop.recoveryLow,"whoop","recoveryLow")}
                ${Q("Strain match",r.WEIGHTS.whoop.strainMatch,"whoop","strainMatch")}
                ${Q("High strain green",r.WEIGHTS.whoop.strainHigh,"whoop","strainHigh")}
              </div>
              <div class="bg-[var(--bg-secondary)] rounded-lg p-3 border border-[var(--border)]">
                <h4 class="sb-section-title text-[var(--text-secondary)] mb-2 text-xs">Family Check-ins</h4>
                <p class="text-[11px] text-[var(--text-muted)] mb-2">Customize who you track. Each check-in adds points.</p>
                ${(r.familyMembers||[]).map(o=>`
                  <div class="flex items-center gap-2 mb-2">
                    <input type="number" inputmode="numeric" value="${r.WEIGHTS.family?.[o.id]??1}" min="0" step="0.5"
                      class="input-field-sm w-16 text-center"
                      onchange="window.updateWeight('family', '${v(o.id)}', this.value)">
                    <input type="text" value="${v(o.name)}" placeholder="Name"
                      class="input-field-sm flex-1"
                      onchange="window.updateFamilyMember('${v(o.id)}', this.value)">
                    <button type="button" onclick="window.removeFamilyMember('${v(o.id)}')" class="p-1.5 text-[var(--text-muted)] hover:text-[var(--danger)] rounded transition" title="Remove" aria-label="Remove ${v(o.name)}">
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
                ${Q("Exercise",r.WEIGHTS.habits.exercise,"habits","exercise")}
                ${Q("Reading",r.WEIGHTS.habits.reading,"habits","reading")}
                ${Q("Meditation",r.WEIGHTS.habits.meditation,"habits","meditation")}
                ${Q("Water (per L)",r.WEIGHTS.habits.water,"habits","water")}
                ${Q("Vitamins",r.WEIGHTS.habits.vitamins,"habits","vitamins")}
                ${Q("Brush Teeth",r.WEIGHTS.habits.brushTeeth,"habits","brushTeeth")}
                ${Q("NoP bonus",r.WEIGHTS.habits.nopYes,"habits","nopYes")}
                ${Q("NoP penalty",r.WEIGHTS.habits.nopNo,"habits","nopNo")}
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
          ${iT()}
          ${lT()}
          ${dT()}
          ${cT()}
          ${uT()}
        </div>
      </details>
    </div>
  `}function fT(e){typeof e=="function"&&r.cleanupCallbacks.push(e)}function gT(){r.cleanupCallbacks.forEach(e=>{try{e()}catch(t){console.error("Cleanup callback error:",t)}}),r.cleanupCallbacks=[]}Object.assign(window,{state:r,getLocalDateString:U,escapeHtml:v,fmt:me,formatSmartDate:ve,generateTaskId:Wr,isMobileViewport:he,isTouchDevice:jt,isMobile:Ci,haptic:Xd,registerCleanup:fT,runCleanupCallbacks:gT,THINGS3_ICONS:Kd,GEIST_ICONS:Yd,getActiveIcons:V,BUILTIN_PERSPECTIVES:Ee,NOTES_PERSPECTIVE:ze,defaultDayData:He,saveData:Yn,getTodayData:Ei,updateData:gg,saveTasksData:O,toggleDailyField:hg,updateDailyField:vg,saveViewState:De,saveWeights:ac,saveMaxScores:bg,saveHomeWidgets:yg,saveCollapsedNotes:wg,getGithubToken:Et,setGithubToken:Mg,getTheme:Fa,setTheme:Pg,getColorMode:Mr,setColorMode:uc,toggleColorMode:Ng,applyStoredTheme:cc,getAccentColor:Lg,getThemeColors:_g,updateSyncStatus:Ce,saveToGithub:Xt,debouncedSaveToGithub:Ni,loadCloudData:zr,dismissConflictNotification:jg,clearConflictNotifications:Fg,getSyncHealth:pc,loadCloudDataWithRetry:bc,exportData:Vg,importData:Yg,getCredentialSyncStatus:lc,signInWithGoogle:Bb,signOutUser:jb,getCurrentUser:Fb,initAuth:gu,signInWithGoogleCalendar:Wb,getLastGisErrorType:Hb,preloadGoogleIdentityServices:fu,fetchWeather:Ca,detectUserLocation:Ou,initWeather:Ru,loadWeatherLocation:Lu,saveWeatherLocation:_u,getWhoopWorkerUrl:Xn,setWhoopWorkerUrl:Kb,getWhoopApiKey:Qr,setWhoopApiKey:Yb,getWhoopLastSync:Cs,isWhoopConnected:Wt,fetchWhoopData:vu,syncWhoopNow:Zr,checkAndSyncWhoop:Vi,connectWhoop:ey,disconnectWhoop:ty,checkWhoopStatus:Jb,initWhoopSync:Vo,stopWhoopSyncTimers:yu,getLibreWorkerUrl:Qn,setLibreWorkerUrl:ay,getLibreApiKey:Zn,setLibreApiKey:sy,getLibreLastSync:Es,isLibreConnected:gn,fetchLibreData:ku,syncLibreNow:ea,checkAndSyncLibre:Yi,connectLibre:cy,disconnectLibre:uy,checkLibreStatus:Su,initLibreSync:Ko,isGCalConnected:le,getSelectedCalendars:er,setSelectedCalendars:Qi,getTargetCalendar:Fn,setTargetCalendar:Yo,fetchCalendarList:As,getGCalEventsForDate:$y,pushTaskToGCalIfConnected:Eu,deleteGCalEventIfConnected:Du,rescheduleGCalEventIfConnected:Au,getGCalOfflineQueue:$u,retryGCalOfflineQueue:Ay,clearGCalOfflineQueue:Sy,removeGCalOfflineQueueItem:Ty,syncGCalNow:Zt,connectGCal:My,disconnectGCal:Ny,reconnectGCal:Ly,initGCalSync:Jo,toggleCalendarSelection:_y,stopGCalSyncTimers:Py,syncGoogleContactsNow:Ya,initGoogleContactsSync:Xo,forceFullContactsResync:Jy,syncGSheetNow:Ja,initGSheetSync:Qo,askGSheet:Nu,openCalendarEventActions:j2,closeCalendarEventActions:F2,openCalendarMeetingNotes:mf,openCalendarMeetingNotesByEventKey:hf,openCalendarMeetingWorkspaceByEventKey:H2,closeCalendarMeetingNotes:U2,setCalendarMeetingNotesScope:W2,addDiscussionItemToMeeting:Y2,toggleCalendarMobilePanel:G2,convertCalendarEventToTask:z2,startCalendarEventDrag:V2,clearCalendarEventDrag:q2,dropCalendarEventToSlot:K2,addMeetingLinkedItem:vf,handleMeetingItemInputKeydown:J2,attachCalendarSwipe:tk,parsePrayer:ta,calcPrayerScore:ew,invalidateScoresCache:We,calculateScores:Ie,getLast30DaysData:rw,getLast30DaysStats:sw,getPersonalBests:ow,updateWeight:iw,resetWeights:lw,updateMaxScore:dw,resetMaxScores:cw,addFamilyMember:fw,removeFamilyMember:gw,updateFamilyMember:mw,getScoreTier:hw,getLevel:Xa,getLevelInfo:ju,getStreakMultiplier:Da,calculateDailyXP:el,updateStreak:tl,awardDailyXP:Fu,checkAchievements:nl,markAchievementNotified:vw,getDailyFocus:bw,processGamification:Hu,saveXP:rl,saveStreak:al,saveAchievements:Ns,saveCategoryWeights:sl,updateCategoryWeight:yw,resetCategoryWeights:ww,rebuildGamification:Wu,createArea:Os,updateArea:Zo,deleteArea:xw,getAreaById:Je,createCategory:Gu,updateCategory:ei,deleteCategory:kw,getCategoryById:Qe,getCategoriesByArea:_r,createLabel:na,updateLabel:Uu,deleteLabel:Sw,getLabelById:Rs,createPerson:ra,updatePerson:zu,deletePerson:Tw,getPersonById:Bs,getTasksByPerson:ol,createTask:tr,updateTask:sa,deleteTask:vn,confirmDeleteTask:Aw,toggleTaskComplete:Mw,toggleFlag:Pw,calculateNextRepeatDate:ti,createNextRepeatOccurrence:Yu,getRepeatUnitLabel:Ju,updateRepeatUI:Nw,moveTaskTo:Lw,getProjectSubTasks:js,getProjectCompletion:_w,getNextSequentialTask:Ow,isProjectStalled:Rw,initializeTaskOrders:ni,getFilteredTasks:ri,groupTasksByDate:Kw,groupTasksByCompletionDate:Yw,getTasksByCategory:Qu,getTasksByLabel:Zu,getTasksBySubcategory:ep,getCurrentFilteredTasks:Jw,getCurrentViewInfo:Xw,toggleNoteCollapse:ux,getNotesHierarchy:up,noteHasChildren:Or,getNoteChildren:pp,countAllDescendants:fp,isDescendantOf:dl,getNoteAncestors:Us,indentNote:gp,outdentNote:mp,createRootNote:px,createNoteAfter:fx,createChildNote:vp,deleteNote:cl,deleteNoteWithUndo:bp,toggleNoteTask:yp,focusNote:Yt,handleNoteKeydown:gx,handleNoteBlur:mx,handleNoteFocus:hx,handleNoteInput:Zw,handleNotePaste:vx,removeNoteInlineMeta:nx,initializeNoteOrders:ai,ensureNoteSafetyMetadata:ll,getDeletedNotes:ox,restoreDeletedNote:ix,findNotesByText:lx,getRecentNoteChanges:dx,createNoteLocalBackup:cx,runNoteIntegrityChecks:cp,zoomIntoNote:fl,zoomOutOfNote:zs,navigateToBreadcrumb:bx,renderNotesBreadcrumb:Ix,handleNoteDragStart:$x,handleNoteDragEnd:Cx,handleNoteDragOver:Ex,handleNoteDragLeave:Dx,handleNoteDrop:Ax,reorderNotes:xp,renderNoteItem:kp,renderNotesOutliner:Sp,handlePageTitleBlur:wx,handlePageTitleKeydown:xx,handleDescriptionBlur:kx,handleDescriptionKeydown:Sx,handleDescriptionInput:Tx,focusPageDescription:Za,focusPageTitle:wp,focusPageTitleForMeta:yx,buildPageMetaChipsHtml:gl,handleDragStart:Mx,handleDragEnd:Px,handleDragOver:Nx,handleDragLeave:Lx,handleDrop:_x,reorderTasks:Tp,normalizeTaskOrders:Ip,setupSidebarDragDrop:Ox,initSwipeActions:Yx,closeActiveRow:hl,showActionSheet:n1,hideActionSheet:mr,initTouchDrag:jx,cancelTouchDrag:es,isTouchDragging:$p,cancelHoldTimer:Cp,initPullToRefresh:t1,createTrigger:qs,createRootTrigger:s1,createTriggerAfter:jp,createChildTrigger:Fp,updateTrigger:Hp,deleteTrigger:Wp,indentTrigger:Gp,outdentTrigger:Up,toggleTriggerCollapse:o1,zoomIntoTrigger:zp,zoomOutOfTrigger:Vp,navigateToTriggerBreadcrumb:i1,handleTriggerKeydown:l1,handleTriggerInput:d1,handleTriggerBlur:c1,handleTriggerDragStart:u1,handleTriggerDragEnd:qp,handleTriggerDragOver:p1,handleTriggerDragLeave:f1,handleTriggerDrop:g1,reorderTriggers:Kp,renderTriggersBreadcrumb:m1,renderTriggerItem:Yp,renderTriggersOutliner:Jp,getTriggerCountForArea:h1,renderReviewMode:ef,startReview:x1,exitReview:k1,reviewNextArea:Qp,reviewPrevArea:S1,reviewEngageTask:T1,reviewPassTask:I1,reviewMarkAreaDone:$1,reviewAddTask:C1,reviewQuickAddTask:Zp,reviewHandleQuickAddKeydown:E1,getStaleTasksForArea:wl,getTotalStaleTaskCount:b1,isWeeklyReviewOverdue:y1,getDaysSinceReview:w1,createPerspective:tf,deletePerspective:M1,editCustomPerspective:P1,toggleWidgetVisibility:_1,toggleWidgetSize:O1,moveWidgetUp:R1,moveWidgetDown:B1,handleWidgetDragStart:j1,handleWidgetDragEnd:F1,handleWidgetDragOver:H1,handleWidgetDragLeave:W1,handleWidgetDrop:G1,resetHomeWidgets:U1,toggleEditHomeWidgets:z1,addPerspectiveWidget:V1,removePerspectiveWidget:q1,calendarPrevMonth:K1,calendarNextMonth:Y1,calendarGoToday:J1,calendarSelectDate:Q1,getTasksForDate:Ma,setCalendarViewMode:X1,toggleCalendarSidebar:Z1,startUndoCountdown:aa,executeUndo:Iw,dismissUndo:Vu,renderUndoToastHtml:$w,openGlobalSearch:kS,closeGlobalSearch:Dl,handleGlobalSearchInput:SS,handleGlobalSearchKeydown:TS,selectGlobalSearchResult:Mf,setSearchTypeFilter:IS,renderGlobalSearchHtml:MS,parseBraindump:nf,parseBraindumpHeuristic:oi,submitBraindumpItems:rf,getAnthropicKey:zt,setAnthropicKey:e0,openBraindump:NS,closeBraindump:Ml,processBraindump:LS,backToInput:OS,startBraindumpVoiceCapture:Of,stopBraindumpVoiceCapture:Rf,toggleBraindumpVoiceCapture:_S,toggleBraindumpItemType:RS,toggleBraindumpItemInclude:BS,removeBraindumpItem:jS,editBraindumpItem:FS,saveBraindumpItemEdit:HS,cancelBraindumpItemEdit:WS,setBraindumpItemArea:GS,addBraindumpItemLabel:US,removeBraindumpItemLabel:zS,addBraindumpItemPerson:VS,removeBraindumpItemPerson:qS,setBraindumpItemDate:KS,clearBraindumpItemDate:YS,submitBraindump:JS,renderBraindumpOverlay:QS,renderBraindumpFAB:XS,render:ie,switchTab:s2,switchSubTab:o2,setToday:i2,forceHardRefresh:l2,dismissCacheRefreshPrompt:a2,renderHomeTab:sf,renderHomeWidget:af,homeQuickAddTask:O0,handleGSheetSavePrompt:P0,handleGSheetEditPrompt:N0,handleGSheetCancelEdit:L0,handleGSheetRefresh:_0,renderTrackingTab:f2,navigateTrackingDate:p2,setBulkMonth:g2,setBulkCategory:m2,updateBulkData:h2,updateBulkSummary:df,getDaysInMonth:xl,renderBulkEntryTab:v2,renderTaskItem:ye,buildAreaTaskListHtml:ff,renderTasksTab:N2,renderCalendarView:ek,createPrayerInput:lf,createToggle:ii,createNumberInput:c2,createCounter:hr,createScoreCard:yn,createCard:u2,renderSettingsTab:pT,createWeightInput:Q,openMobileDrawer:sk,closeMobileDrawer:Fe,renderMobileDrawer:Sl,renderBottomNav:ok,showAreaTasks:ik,showLabelTasks:lk,showPerspectiveTasks:dk,showPersonTasks:ck,showCategoryTasks:uk,scrollToContent:ht,showAllLabelsPage:pk,showAllPeoplePage:fk,toggleSidebarAreaCollapse:gk,toggleWorkspaceSidebar:mk,initBottomNavScrollHide:hk,startInlineEdit:yk,saveInlineEdit:Sf,cancelInlineEdit:Tf,handleInlineEditKeydown:wk,handleTaskInlineFocus:xk,handleTaskInlineBlur:kk,handleTaskInlineKeydown:Sk,handleTaskInlineInput:Tk,handleTaskInlinePaste:Ik,focusTaskInlineTitle:$k,openNewTaskModal:Ck,quickAddTask:If,handleQuickAddKeydown:Ek,toggleInlineTagInput:Dk,addInlineTag:Ak,toggleInlinePersonInput:Mk,addInlinePerson:Pk,saveAreaFromModal:Zk,saveLabelFromModal:tS,savePersonFromModal:nS,saveCategoryFromModal:eS,initModalState:$f,setModalType:Nk,setModalStatus:Lk,toggleModalFlagged:_k,updateDateDisplay:Ok,clearDateField:Rk,setQuickDate:Bk,openDatePicker:jk,selectArea:pi,renderAreaInput:ls,selectCategory:Cf,renderCategoryInput:Zs,addTag:fi,removeTag:Fk,renderTagsInput:eo,addPersonModal:gi,removePersonModal:Hk,renderPeopleInput:to,setWaitingFor:Ef,renderWaitingForUI:ds,toggleWaitingForForm:Vk,applyWaitingFor:qk,toggleProjectMode:Kk,setProjectType:Yk,linkToProject:Jk,renderProjectUI:la,setTimeEstimate:Xk,renderTimeEstimateUI:Cl,toggleRepeat:Wk,initModalAutocomplete:Gk,cleanupModalAutocomplete:$l,closeTaskModal:Uk,saveTaskFromModal:zk,savePerspectiveFromModal:rS,selectPerspectiveEmoji:aS,selectAreaEmoji:sS,selectCategoryEmoji:oS,updateEmojiGrid:uS,toggleEmojiPicker:dS,renderTaskModalHtml:Qk,renderPerspectiveModalHtml:fS,renderAreaModalHtml:gS,renderCategoryModalHtml:mS,renderLabelModalHtml:hS,renderPersonModalHtml:vS,parseDateQuery:kf,setupInlineAutocomplete:Tl,renderInlineChips:is,removeInlineMeta:bk,cleanupInlineAutocomplete:ar});const mT=["currentUser","authLoading","authError","editingTaskId","editingAreaId","editingLabelId","editingPersonId","editingPerspectiveId","showTaskModal","showPerspectiveModal","showAreaModal","showLabelModal","showPersonModal","showInlineTagInput","showInlinePersonInput","activePerspective","activeFilterType","activeAreaFilter","activeLabelFilter","activePersonFilter","editingHomeWidgets","showAddWidgetPicker","draggingWidgetId","perspectiveEmojiPickerOpen","areaEmojiPickerOpen","categoryEmojiPickerOpen","emojiSearchQuery","pendingPerspectiveEmoji","pendingAreaEmoji","pendingCategoryEmoji","editingNoteId","inlineEditingTaskId","quickAddIsNote","showAllSidebarPeople","showAllSidebarLabels","mobileDrawerOpen","activeTab","activeSubTab","modalSelectedArea","modalSelectedStatus","modalSelectedToday","modalSelectedFlagged","modalSelectedTags","modalSelectedPeople","modalIsNote","modalRepeatEnabled","modalStateInitialized","modalWaitingFor","modalIsProject","modalProjectId","modalProjectType","modalTimeEstimate","draggedTaskId","dragOverTaskId","dragPosition","draggedSidebarItem","draggedSidebarType","sidebarDragPosition","calendarMonth","calendarYear","calendarSelectedDate","calendarViewMode","calendarSidebarCollapsed","calendarEventModalOpen","calendarEventModalCalendarId","calendarEventModalEventId","draggedCalendarEvent","calendarMeetingNotesEventKey","calendarMeetingNotesScope","meetingNotesByEvent","currentDate","bulkMonth","bulkYear","bulkCategory","tasksData","taskAreas","taskLabels","taskPeople","taskCategories","showCategoryModal","editingCategoryId","activeCategoryFilter","modalSelectedCategory","customPerspectives","homeWidgets","allData","WEIGHTS","MAX_SCORES","weatherData","weatherLocation","syncStatus","lastSyncTime","weekChart","breakdownChart","collapsedNotes","newTaskContext","zoomedNoteId","notesBreadcrumb","draggedNoteId","dragOverNoteId","noteDragPosition","inlineAutocompleteMeta","undoAction","undoTimerRemaining","undoTimerId","showBraindump","braindumpRawText","braindumpParsedItems","braindumpStep","braindumpEditingIndex","braindumpSuccessMessage","braindumpProcessing","braindumpAIError","braindumpFullPage","braindumpVoiceRecording","braindumpVoiceTranscribing","braindumpVoiceError","gcalEvents","gcalCalendarList","gcalSyncing","gcalTokenExpired","gcalOfflineQueue","conflictNotifications","renderPerf","showCacheRefreshPrompt","cacheRefreshPromptMessage","CATEGORY_WEIGHTS","xp","streak","achievements","dailyFocusDismissed","gsheetData","gsheetSyncing","gsheetError","gsheetPrompt","gsheetResponse","gsheetAsking","gsheetEditingPrompt","triggers","editingTriggerId","collapsedTriggers","zoomedTriggerId","triggersBreadcrumb","reviewMode","reviewAreaIndex","reviewCompletedAreas","reviewTriggersCollapsed","reviewProjectsCollapsed","reviewNotesCollapsed","lastWeeklyReview","lastSomedayReview","showGlobalSearch","globalSearchQuery","globalSearchResults","globalSearchActiveIndex","globalSearchTypeFilter","settingsIntegrationsOpen","settingsScoringOpen","settingsDevToolsOpen","settingsDataDiagOpen"];mT.forEach(e=>{window.hasOwnProperty(e)||Object.defineProperty(window,e,{get(){return r[e]},set(t){r[e]=t},configurable:!0})});var hT=(function(){var e={base:"https://twemoji.maxcdn.com/v/14.0.2/",ext:".png",size:"72x72",className:"emoji",convert:{fromCodePoint:x,toCodePoint:N},onerror:function(){this.parentNode&&this.parentNode.replaceChild(d(this.alt,!1),this)},parse:k,replace:T,test:E},t={"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"},n=/(?:\ud83d\udc68\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffc-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb\udffd-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb-\udffd\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83e\uddd1\ud83c[\udffb-\udffe]|\ud83d\udc68\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc68\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc68\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc68\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffc-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffd-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb\udffc\udffe\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffd\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc68\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83d\udc69\ud83c[\udffb-\udfff]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc68\ud83c[\udffb-\udffe]|\ud83d\udc69\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83d\udc69\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udffb\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffc-\udfff]|\ud83e\uddd1\ud83c\udffb\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb\udffd-\udfff]|\ud83e\uddd1\ud83c\udffc\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\uddd1\ud83c\udffd\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb-\udffd\udfff]|\ud83e\uddd1\ud83c\udffe\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83e\uddd1\ud83c\udfff\u200d\u2764\ufe0f\u200d\ud83e\uddd1\ud83c[\udffb-\udffe]|\ud83e\uddd1\ud83c\udfff\u200d\ud83e\udd1d\u200d\ud83e\uddd1\ud83c[\udffb-\udfff]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83e\udef1\ud83c\udffb\u200d\ud83e\udef2\ud83c[\udffc-\udfff]|\ud83e\udef1\ud83c\udffc\u200d\ud83e\udef2\ud83c[\udffb\udffd-\udfff]|\ud83e\udef1\ud83c\udffd\u200d\ud83e\udef2\ud83c[\udffb\udffc\udffe\udfff]|\ud83e\udef1\ud83c\udffe\u200d\ud83e\udef2\ud83c[\udffb-\udffd\udfff]|\ud83e\udef1\ud83c\udfff\u200d\ud83e\udef2\ud83c[\udffb-\udffe]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83e\uddd1\u200d\ud83e\udd1d\u200d\ud83e\uddd1|\ud83d\udc6b\ud83c[\udffb-\udfff]|\ud83d\udc6c\ud83c[\udffb-\udfff]|\ud83d\udc6d\ud83c[\udffb-\udfff]|\ud83d\udc8f\ud83c[\udffb-\udfff]|\ud83d\udc91\ud83c[\udffb-\udfff]|\ud83e\udd1d\ud83c[\udffb-\udfff]|\ud83d[\udc6b-\udc6d\udc8f\udc91]|\ud83e\udd1d)|(?:\ud83d[\udc68\udc69]|\ud83e\uddd1)(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf7c\udf84\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddaf-\uddb3\uddbc\uddbd])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc70\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddcd-\uddcf\uddd4\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\u26a7\ufe0f|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83d\ude36\u200d\ud83c\udf2b\ufe0f|\u2764\ufe0f\u200d\ud83d\udd25|\u2764\ufe0f\u200d\ud83e\ude79|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc15\u200d\ud83e\uddba|\ud83d\udc3b\u200d\u2744\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83d\ude2e\u200d\ud83d\udca8|\ud83d\ude35\u200d\ud83d\udcab|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f|\ud83d\udc08\u200d\u2b1b)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26a7\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd0c\udd0f\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\udd77\uddb5\uddb6\uddb8\uddb9\uddbb\uddcd-\uddcf\uddd1-\udddd\udec3-\udec5\udef0-\udef6]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udc8e\udc90\udc92-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\uded5-\uded7\udedd-\udedf\udeeb\udeec\udef4-\udefc\udfe0-\udfeb\udff0]|\ud83e[\udd0d\udd0e\udd10-\udd17\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd3f-\udd45\udd47-\udd76\udd78-\uddb4\uddb7\uddba\uddbc-\uddcc\uddd0\uddde-\uddff\ude70-\ude74\ude78-\ude7c\ude80-\ude86\ude90-\udeac\udeb0-\udeba\udec0-\udec2\uded0-\uded9\udee0-\udee7]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g,a=/\uFE0F/g,s="‍",o=/[&<>'"]/g,i=/^(?:iframe|noframes|noscript|script|select|style|textarea)$/,l=String.fromCharCode;return e;function d(I,C){return document.createTextNode(C?I.replace(a,""):I)}function c(I){return I.replace(o,b)}function p(I,C){return"".concat(C.base,C.size,"/",I,C.ext)}function m(I,C){for(var H=I.childNodes,j=H.length,$,D;j--;)$=H[j],D=$.nodeType,D===3?C.push($):D===1&&!("ownerSVGElement"in $)&&!i.test($.nodeName.toLowerCase())&&m($,C);return C}function u(I){return N(I.indexOf(s)<0?I.replace(a,""):I)}function h(I,C){for(var H=m(I,[]),j=H.length,$,D,R,M,J,W,w,F,z,B,q,S,L;j--;){for(R=!1,M=document.createDocumentFragment(),J=H[j],W=J.nodeValue,F=0;w=n.exec(W);){if(z=w.index,z!==F&&M.appendChild(d(W.slice(F,z),!0)),q=w[0],S=u(q),F=z+q.length,L=C.callback(S,C),S&&L){B=new Image,B.onerror=C.onerror,B.setAttribute("draggable","false"),$=C.attributes(q,S);for(D in $)$.hasOwnProperty(D)&&D.indexOf("on")!==0&&!B.hasAttribute(D)&&B.setAttribute(D,$[D]);B.className=C.className,B.alt=q,B.src=L,R=!0,M.appendChild(B)}B||M.appendChild(d(q,!1)),B=null}R&&(F<W.length&&M.appendChild(d(W.slice(F),!0)),J.parentNode.replaceChild(M,J))}return I}function g(I,C){return T(I,function(H){var j=H,$=u(H),D=C.callback($,C),R,M;if($&&D){j="<img ".concat('class="',C.className,'" ','draggable="false" ','alt="',H,'"',' src="',D,'"'),R=C.attributes(H,$);for(M in R)R.hasOwnProperty(M)&&M.indexOf("on")!==0&&j.indexOf(" "+M+"=")===-1&&(j=j.concat(" ",M,'="',c(R[M]),'"'));j=j.concat("/>")}return j})}function b(I){return t[I]}function y(){return null}function f(I){return typeof I=="number"?I+"x"+I:I}function x(I){var C=typeof I=="string"?parseInt(I,16):I;return C<65536?l(C):(C-=65536,l(55296+(C>>10),56320+(C&1023)))}function k(I,C){return(!C||typeof C=="function")&&(C={callback:C}),(typeof I=="string"?g:h)(I,{callback:C.callback||p,attributes:typeof C.attributes=="function"?C.attributes:y,base:typeof C.base=="string"?C.base:e.base,ext:C.ext||e.ext,size:C.folder||f(C.size||e.size),className:C.className||e.className,onerror:C.onerror||e.onerror})}function T(I,C){return String(I).replace(n,C)}function E(I){n.lastIndex=0;var C=n.test(I);return n.lastIndex=0,C}function N(I,C){for(var H=[],j=0,$=0,D=0;D<I.length;)j=I.charCodeAt(D++),$?(H.push((65536+($-55296<<10)+(j-56320)).toString(16)),$=0):55296<=j&&j<=56319?$=j:H.push(j.toString(16));return H.join(C||"-")}})();let mi=!1,va=null,Bd=!1,$o=!1;function hi(e=document.body){e&&hT.parse(e,{folder:"svg",ext:".svg",className:"twemoji",base:"https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/"})}function vT(){Bd||typeof MutationObserver>"u"||(Bd=!0,va=new MutationObserver(e=>{if($o)return;const t=new Set;for(const n of e)n.type==="childList"?n.addedNodes.forEach(a=>{a.nodeType===Node.ELEMENT_NODE?t.add(a):a.parentElement&&t.add(a.parentElement)}):n.type==="characterData"&&n.target?.parentElement&&t.add(n.target.parentElement);if(t.size!==0){$o=!0,va.disconnect();try{t.forEach(n=>hi(n))}finally{$o=!1,document.body&&va.observe(document.body,{childList:!0,subtree:!0,characterData:!0})}}}),document.body&&va.observe(document.body,{childList:!0,subtree:!0,characterData:!0}))}function bT(){if(mi)return;mi=!0,Dw(),ni(),ai(),ll(),Pd(),!r.xp?.history?.length&&Object.keys(r.allData).length>0?Wu():Hu(r.currentDate),ie(),bc().then(()=>{ni(),ai(),Pd(),ie(),r.githubSyncDirty&&navigator.onLine&&Xt().catch(()=>{}),so(),Vo(),Ko(),Jo(),Xo(),Qo()}).catch(a=>{console.warn("Cloud data load failed (will use local):",a.message),r.githubSyncDirty&&navigator.onLine&&Xt().catch(()=>{}),so(),Vo(),Ko(),Jo(),Xo(),Qo()}),Ru(),document.addEventListener("keydown",a=>{if((a.metaKey||a.ctrlKey)&&a.key==="k"){a.preventDefault(),r.showGlobalSearch?(window.closeGlobalSearch(),ie()):window.openGlobalSearch();return}if(!r.showGlobalSearch&&((a.metaKey||a.ctrlKey)&&a.key==="n"&&(a.preventDefault(),window.openNewTaskModal()),(a.metaKey||a.ctrlKey)&&a.shiftKey&&a.key.toLowerCase()==="d"&&(a.preventDefault(),window.openBraindump()),a.key==="Escape"&&(r.showBraindump?window.closeBraindump():r.showPerspectiveModal?(r.showPerspectiveModal=!1,r.editingPerspectiveId=null,r.pendingPerspectiveEmoji="",r.perspectiveEmojiPickerOpen=!1,ie()):r.showAreaModal?(r.showAreaModal=!1,r.editingAreaId=null,r.pendingAreaEmoji="",r.areaEmojiPickerOpen=!1,ie()):r.showCategoryModal?(r.showCategoryModal=!1,r.editingCategoryId=null,r.categoryEmojiPickerOpen=!1,ie()):r.showLabelModal?(r.showLabelModal=!1,r.editingLabelId=null,ie()):r.showPersonModal?(r.showPersonModal=!1,r.editingPersonId=null,ie()):r.showTaskModal?(window.closeTaskModal(),ie()):r.mobileDrawerOpen&&(window.closeMobileDrawer(),ie())),(a.metaKey||a.ctrlKey)&&["1","2","3","4","5"].includes(a.key))){a.preventDefault();const s=["home","tasks","life","calendar","settings"];window.switchTab(s[parseInt(a.key)-1])}}),window.addEventListener("online",()=>{console.log("Back online — syncing..."),r.githubSyncDirty?Xt().catch(a=>console.error("Online sync failed:",a)):Ni(),window.retryGCalOfflineQueue?.()}),window.addEventListener("offline",()=>{console.log("Offline — changes saved locally")});let e=null;if(document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"?(Bg(),Hl({keepalive:!0}),typeof window.cancelTouchDrag=="function"&&window.cancelTouchDrag(),e&&(clearTimeout(e),e=null)):document.visibilityState==="visible"&&(so(),e&&clearTimeout(e),e=setTimeout(()=>{e=null,zr().then(()=>ie()).catch(()=>{})},1e3))}),window.addEventListener("beforeunload",()=>{Hl({keepalive:!0})}),window.visualViewport){const a=()=>{const s=window.innerHeight-window.visualViewport.height>140;document.body.classList.toggle("mobile-keyboard-open",s)};window.visualViewport.addEventListener("resize",a),window.visualViewport.addEventListener("scroll",a),a()}he()&&typeof window.initBottomNavScrollHide=="function"&&window.initBottomNavScrollHide();let t=null;const n=()=>{clearTimeout(t),t=setTimeout(()=>ie(),150)};window.addEventListener("orientationchange",n),window.addEventListener("resize",()=>{he()!==r._lastRenderWasMobile&&n()}),r._lastRenderWasMobile=he(),console.log("Homebase initialized")}function jd(){cc(),vT(),fu();const e=localStorage.getItem(Mo)||"";e&&e!==Ct&&(r.showCacheRefreshPrompt=!0,r.cacheRefreshPromptMessage=`Detected update from ${e} to ${Ct}. A hard refresh is recommended.`),cp(e),localStorage.setItem(Mo,Ct),ie();let t=0;document.addEventListener("touchend",n=>{const a=Date.now(),s=a-t;if(t=a,s>0&&s<320){const o=n.target;o instanceof HTMLElement&&o.closest('input, textarea, select, [contenteditable="true"]')!==null||n.preventDefault()}},{passive:!1}),gu(n=>{n?(bT(),hi(document.body)):(mi=!1,ie(),hi(document.body))})}window.onerror=(e,t,n,a,s)=>{console.error("[Homebase] Uncaught error:",{message:e,source:t,lineno:n,colno:a,error:s});try{const o=r.syncHealth;o&&Array.isArray(o.recentEvents)&&(o.recentEvents.unshift({type:"uncaught_error",message:String(e),source:t?`${t}:${n}:${a}`:"unknown",timestamp:new Date().toISOString()}),o.recentEvents.length>20&&(o.recentEvents.length=20))}catch{}};window.onunhandledrejection=e=>{const t=e.reason;console.error("[Homebase] Unhandled promise rejection:",t);try{const n=r.syncHealth;n&&Array.isArray(n.recentEvents)&&(n.recentEvents.unshift({type:"unhandled_rejection",message:t instanceof Error?t.message:String(t),stack:t instanceof Error?t.stack?.split(`
`).slice(0,3).join(`
`):void 0,timestamp:new Date().toISOString()}),n.recentEvents.length>20&&(n.recentEvents.length=20))}catch{}};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",jd):jd();export{Xf as A,Ol as L,ca as S,nw as a,ow as b,ju as c,Ie as d,ao as e,me as f,aw as g,Ii as h,he as i,r as s};
