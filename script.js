/**
 * Yangon Electricity Schedule Checker
 * Architecture: WCAG 2.2 AA compliant, Bilingual (EN/MM), Humane & Ethical UX
 * Integrated: Multi-Version Schedule Engine (October 2026 Active & April 2025 History)
 * 100% First-Party, Self-Contained Analytics
 */

// ============================================================================
// 1. SCHEDULE VERSIONS & TIMETABLE DEFINITIONS
// ============================================================================

const SCHEDULE_VERSIONS = {
    '2026-10': {
        id: '2026-10',
        nameEn: 'October 2026 (Official YESC Plan)',
        nameMm: '၂၀၂၆ အောက်တိုဘာ (YESC တရားဝင် ဓာတ်အားပေးပုံစံ)',
        shortEn: 'Oct 2026',
        shortMm: 'အောက်တိုဘာ ၂၀၂၆',
        status: 'active',
        groups: ['A', 'B'], // 2 Residential Groups
        timeSlots: [
            { start: "05:00", end: "09:00", hours: 4, label: "05:00 - 09:00" },
            { start: "09:00", end: "13:00", hours: 4, label: "09:00 - 13:00" },
            { start: "13:00", end: "17:00", hours: 4, label: "13:00 - 17:00" },
            { start: "17:00", end: "21:00", hours: 4, label: "17:00 - 21:00" },
            { start: "21:00", end: "05:00", hours: 8, label: "21:00 - 05:00", isOvernight: true, isNoLoadshed: true }
        ],
        // 2-Day Alternating rotation established October 4, 2026
        baseDate: "2026-10-04",
        patterns: [
            ["A", "B", "A", "B", "A+B"], // Even dates (Oct 4, 6, 8, 10, 12, 14, 16...)
            ["B", "A", "B", "A", "A+B"]  // Odd dates (Oct 5, 7, 9, 11, 13, 15, 17...)
        ],
        summaryEn: "Groups A & B (4-hour rotation between 05:00 - 21:00). Overnight 21:00 - 05:00: No Loadshed (Both Groups A+B have power).",
        summaryMm: "အုပ်စု A နှင့် B (နံနက် ၀၅:၀၀ မှ ည ၂၁:၀၀ အတွင်း ၄ နာရီစီ အလှည့်ကျ)။ ည ၂၁:၀၀ မှ နံနက် ၀၅:၀၀ ထိ အုပ်စု (A,B) ၂ ခုစလုံး No Loadshed ဓာတ်အားပေးသည်။",
        authorityEn: "Yangon Electricity Supply Corporation (YESC) Official Order for Oct 2026.",
        authorityMm: "ရန်ကုန်လျှပ်စစ်ဓာတ်အားပေးရေးကော်ပိုရေးရှင်း (YESC) ၏ အောက်တိုဘာ ၂၀၂၆ ညွှန်ကြားချက်။"
    },
    '2025-04': {
        id: '2025-04',
        nameEn: 'April 2025 (Legacy 3-Group Schedule)',
        nameMm: '၂၀၂၅ ဧပြီ (ယခင် အုပ်စု ၃ ခု ဇယားဟောင်း)',
        shortEn: 'Apr 2025 (Archive)',
        shortMm: 'ဧပြီ ၂၀၂၅ (ဟောင်း)',
        status: 'archive',
        groups: ['A', 'B', 'C'], // 3 Residential Groups
        timeSlots: [
            { start: "05:00", end: "09:00", hours: 4, label: "05:00 - 09:00" },
            { start: "09:00", end: "13:00", hours: 4, label: "09:00 - 13:00" },
            { start: "13:00", end: "17:00", hours: 4, label: "13:00 - 17:00" },
            { start: "17:00", end: "21:00", hours: 4, label: "17:00 - 21:00" },
            { start: "21:00", end: "01:00", hours: 4, label: "21:00 - 01:00" },
            { start: "01:00", end: "05:00", hours: 4, label: "01:00 - 05:00" }
        ],
        baseDate: "2025-04-01",
        patterns: [
            ["", "A", "B", "C", "A", "B+C"],
            ["A", "B", "C", "A", "B", "C+A"],
            ["B", "C", "A", "B", "C", "A+B"]
        ],
        summaryEn: "Legacy 3-Group (A, B, C) rotation in 6 equal 4-hour slots across 24 hours.",
        summaryMm: "ယခင် အုပ်စု (A, B, C) ၃ အုပ်စုဖြင့် ၂၄ နာရီပတ်လုံး ၄ နာရီစီ ၆ ချိန် အလှည့်ကျ မီးပေးဝေခဲ့သော ဇယားဟောင်း ဖြစ်ပါသည်။",
        authorityEn: "YESC Historical Archive Record (April 2025).",
        authorityMm: "YESC ၂၀၂၅ ဧပြီလ မှတ်တမ်းဟောင်း။"
    }
};

// ============================================================================
// 2. LOCALIZATION DICTIONARY (Bilingual EN / MM)
// ============================================================================

const I18N = {
    en: {
        appTitle: "Yangon Power Schedule",
        appSubtitle: "Rotational Electricity Tracker",
        selectGroup: "Select Your Group",
        welcomeModalTitle: "Select Your Group",
        welcomeModalSubtitle: "Welcome to YESC Schedule Tracker",
        groupSelectPrompt: "Select your residential group to view the exact live power schedule and countdown for your area.",
        confirmBtn: "Confirm & Continue",
        selectLaterBtn: "I Don't Know / Select Later",
        welcomeHelpTitle: "Not sure which group you belong to?",
        welcomeHelpDesc: "No problem! You can select later or choose any group now. You can change your group at any time using the buttons at the top of the screen.",
        // First-Time User Guide Box
        guideBadge: "First-Time User Guide",
        guideTitle: "How Yangon Electricity Groups Work",
        guideDesc: "YESC distributes electricity in Yangon by dividing townships into rotational groups. If you're not sure which group your neighborhood is in, don't worry! You can change it anytime above.",
        guideStep1Title: "Change Anytime",
        guideStep1Desc: "Easily switch between Group A & Group B anytime using the buttons at the top of the screen.",
        guideStep2Title: "4-Hour Rotation",
        guideStep2Desc: "Power alternates every 4 hours from 05:00 to 21:00. Overnight (21:00 - 05:00) has NO loadshed for all groups. When power is ON at 5:00 PM (17:00 - 21:00), it stays ON after 9:00 PM continuously through the night!",
        guideStep3Title: "How to Find Your Group",
        guideStep3Desc: "When your power is currently ON, check which group shows 'Available' here.",
        guideQuickLabel: "Try selecting a group:",
        guideGotItBtn: "Got It, Thanks!",
        guideHelpBtn: "Group Guide",
        groupTabsHint: "💡 You can change your group at any time. The schedule and timer update instantly.",
        groupLabel: "Select Group:",
        groupA: "Group A",
        groupB: "Group B",
        groupC: "Group C",
        statusOn: "Electricity Available",
        statusOff: "Power Outage (No Electricity)",
        statusSubOn: "Power is scheduled to be active for your group.",
        statusSubOff: "Power is scheduled to be offline for your group.",
        statusSubNoLoadshed: "Overnight period (21:00 - 05:00): No Loadshed for all groups!",
        statusSubContinuesNight: "Power is active and continues after 9:00 PM through the overnight No Loadshed period!",
        countdownUntilOff: "Time until power turns OFF",
        countdownUntilOn: "Time until next power slot (ON)",
        timelineTitle: "24-Hour Visual Overview",
        timelineLegendOn: "Power Available",
        timelineLegendOff: "Outage",
        currentTime: "Now",
        dailySchedule: "Daily Schedule",
        yesterday: "Yesterday's Schedule",
        today: "Today's Schedule",
        tomorrow: "Tomorrow's Schedule",
        prevDayYesterday: "Yesterday",
        nextDayTomorrow: "Tomorrow",
        prevDay: "Prev Day",
        nextDay: "Next Day",
        returnToday: "Back to Today",
        calendarBtnText: "Calendar (Oct & Nov)",
        calendarModalTitle: "Schedule Calendar (2026)",
        calendarModalSubtitle: "Rotational power calendar for October & November",
        calendarTabOct: "October 2026",
        calendarTabNov: "November 2026",
        calendarPrompt: "Tap any date to view 24-hr schedule",
        calendarPowerOnBadge: "ON",
        calendarPowerOffBadge: "OFF",
        availableBadge: "Available",
        outageBadge: "Outage",
        noLoadshedNote: "⚡ No Loadshed (All Groups Active)",
        safetyTitle: "Safety & Medical Notice",
        safetyNotice: "Rotational schedules are planned by YESC and may change during emergency grid trips or line repairs. Do not rely solely on this timetable for life-critical medical devices (oxygen concentrators, cold-stored insulin) without an independent backup generator or inverter.",
        safetyAlertModalTitle: "Safety & Medical Notice",
        safetyAlertModalSubtitle: "Critical health & electrical warning",
        safetyAlertModalText: "Rotational schedules are planned by YESC and may change during emergency grid trips or line repairs. Do not rely solely on this timetable for life-critical medical devices (oxygen concentrators, cold-stored insulin) without an independent backup generator or inverter.",
        safetyAlertAckBtn: "I Understand & Acknowledge",
        // FAQ & SEO Knowledge Base
        faqTitle: "Frequently Asked Questions (Mee Pyt & EPC Guide)",
        faqSubtitle: "Common questions about Yangon electricity schedules & electric breakouts",
        faqQ1: "How to check today's Mee Pyt / Mee Pyat (power outage) schedule in Yangon?",
        faqA1: "YESC divides Yangon townships into rotational groups (Group A and Group B). Power alternates every 4 hours between 05:00 and 21:00. Overnight from 21:00 to 05:00, all groups have continuous power with No Loadshed. Use this live tracker to view your group's countdown and daily timetable.",
        faqQ2: "What are Yangon Electric Breakout hours according to YESC & EPC?",
        faqA2: "Under the official YESC plan, daylight electric breakouts rotate in 4-hour slots: 05:00 - 09:00, 09:00 - 13:00, 13:00 - 17:00, and 17:00 - 21:00. If your power is ON at 5:00 PM (17:00 - 21:00), it continues into the 21:00 - 05:00 overnight No Loadshed slot so electricity stays ON after 9:00 PM. Check the 24-Hour Overview bar to see your group's live status.",
        faqQ3: "What is the difference between Yangon EPC and YESC?",
        faqA3: "Yangon residents commonly refer to local electricity offices and electricity supply as 'EPC' (Electricity Supply Enterprise). Officially, electricity in Yangon Region is distributed and managed by YESC (Yangon Electricity Supply Corporation). Both terms refer to Yangon's municipal electricity provider.",
        faqQ4: "How to report an emergency electric breakout or fallen power lines in Yangon?",
        faqA4: "For emergency power outages, fallen power lines, or transformer sparks, call the official YESC 24/7 hotline at <strong>1950</strong>, or contact your local township EPC office directly.",
        emergencyBtn: "YESC Hotline (1950)",
        safetyTipsBtn: "Safety Guidelines",
        settingsBtn: "Settings & Privacy",
        analyticsBtn: "View Usage Analytics",
        versionHistoryBtn: "Schedule Version & History",
        offlineText: "You are currently offline. Viewing cached schedule data.",
        themeToggle: "Toggle theme",
        langToggle: "Switch language to မြန်မာ",
        closeModal: "Close dialog",
        // Version Modal
        versionModalTitle: "Schedule Versions & History",
        versionModalDesc: "Switch between the currently active YESC schedule and historical archive versions.",
        versionActiveBadge: "Active Plan",
        versionArchiveBadge: "Historical Archive",
        switchVersionBtn: "Apply This Schedule",
        currentActiveVersionText: "Currently Active",
        // Analytics
        analyticsModalTitle: "Self Analytics & Insights",
        analyticsDesc: "100% private, on-device usage metrics. No third-party trackers, cookies, or external ad networks.",
        analyticsTotalOpens: "Total App Opens",
        analyticsTopDevice: "Most Viewed On",
        analyticsTopGroup: "Top Group Checked",
        analyticsOfflineOpens: "Offline Opens",
        analyticsHotlineTaps: "1950 Hotline Taps",
        analyticsDeviceBreakdown: "Platform Breakdown (Mobile vs Desktop vs Tablet)",
        analyticsMobile: "Mobile Phone",
        analyticsTablet: "Tablet",
        analyticsDesktop: "Desktop / PC",
        analyticsGroupBreakdown: "Group Popularity",
        analyticsTimeBreakdown: "Peak Checking Hours",
        analyticsMorning: "Morning (05:00 - 12:00)",
        analyticsAfternoon: "Afternoon (12:00 - 17:00)",
        analyticsEvening: "Evening (17:00 - 21:00)",
        analyticsNight: "Night (21:00 - 05:00)",
        analyticsExportBtn: "Export JSON Report",
        analyticsResetBtn: "Reset All Analytics",
        analyticsResetConfirm: "Are you sure you want to reset all self-analytics statistics?",
        emergencyTitle: "YESC Emergency Hotlines & Contacts",
        emergencyBody: `
            <p><strong>Yangon Electricity Supply Corporation (YESC)</strong></p>
            <p>Central 24/7 Call Center: <a href="tel:1950" class="btn btn-primary" style="display:inline-block; margin-top:0.25rem;">Call 1950</a></p>
            <hr style="border:none; border-top:1px solid var(--border-subtle); margin:0.75rem 0;">
            <p><strong>Electrical Outage & Surge Safety Tips:</strong></p>
            <ul style="padding-left:1.25rem; margin-top:0.5rem; display:flex; flex-direction:column; gap:0.35rem;">
                <li>Switch off high-load appliances (Air conditioners, water pumps, refrigerators) during outages to prevent motor burnout from sudden power return surges.</li>
                <li>Wait 3-5 minutes after electricity returns before turning heavy appliances back on.</li>
                <li>In case of fallen electric wires or transformer sparks, do not approach within 10 meters and contact 1950 immediately.</li>
            </ul>
            <hr style="border:none; border-top:1px solid var(--border-subtle); margin:0.75rem 0;">
            <p><strong>Developer & Project Contact:</strong></p>
            <p style="margin-top:0.35rem; font-size:0.875rem;">
                Created & Maintained by <strong>Thant Zin Htoo</strong><br>
                Website & Portfolio: <a href="http://thantzinhtoodev.unaux.com/" target="_blank" rel="noopener noreferrer" style="color:var(--brand-primary); font-weight:600; text-decoration:underline;">thantzinhtoodev.unaux.com</a>
            </p>
        `,
        settingsTitle: "Settings & Data Privacy",
        settingsBody: `
            <p><strong>Zero-Tracking Privacy Guarantee</strong></p>
            <p>This web application is built strictly with public service ethics. All preferences and self-analytics are stored 100% locally on your device. Zero external data tracking.</p>
            
            <div style="margin-top:1rem; display:flex; flex-direction:column; gap:0.5rem;">
                <label style="font-weight:600;">Theme Selection:</label>
                <div style="display:flex; gap:0.5rem;">
                    <button id="set-theme-light" class="btn btn-outline" style="flex:1;">Light</button>
                    <button id="set-theme-dark" class="btn btn-outline" style="flex:1;">Dark</button>
                    <button id="set-theme-system" class="btn btn-outline" style="flex:1;">System</button>
                </div>
            </div>
            <div style="margin-top:1.25rem;">
                <button id="clear-data-btn" class="btn btn-danger" style="width:100%;">Reset All Local Preferences</button>
            </div>
        `,
        dataResetSuccess: "All local settings have been cleared.",
        footerNotice: "Community Utility Service • Designed with WCAG 2.2 AA Accessibility & Humane UI Ethics"
    },
    my: {
        appTitle: "ရန်ကုန် လျှပ်စစ်မီး အလှည့်ကျ ဇယား",
        appSubtitle: "အလှည့်ကျ မီးပေးဝေမှုနှင့် မီးပျက်ချိန် စောင့်ကြည့်စနစ်",
        selectGroup: "သင်၏ အုပ်စုကို ရွေးချယ်ပါ",
        welcomeModalTitle: "သင်၏ အုပ်စုကို ရွေးချယ်ပါ",
        welcomeModalSubtitle: "ရန်ကုန် မီးပေးဝေမှု စောင့်ကြည့်စနစ်မှ ကြိုဆိုပါသည်",
        groupSelectPrompt: "သင့်ရပ်ကွက်/မြို့နယ် သက်ဆိုင်ရာ အုပ်စုကို ရွေးချယ်၍ မီးလာမည့်အချိန်နှင့် ကျန်ရှိချိန်ကို တိကျစွာ ကြည့်ရှုပါ။",
        confirmBtn: "အတည်ပြုပြီး စတင်မည်",
        selectLaterBtn: "မသိသေးပါ / နောက်မှရွေးမည်",
        welcomeHelpTitle: "မိမိရပ်ကွက် မည်သည့်အုပ်စုမှန်း မသိသေးပါသလား?",
        welcomeHelpDesc: "စိတ်မပူပါနှင့်! ယခု မရွေးချယ်ဘဲ နောက်မှရွေးနိုင်သလို၊ မျက်နှာပြင် အပေါ်ရှိ Group ခလုတ်များဖြင့် အချိန်မရွေး လွတ်လပ်စွာ ပြောင်းလဲနိုင်ပါသည်။",
        // First-Time User Guide Box
        guideBadge: "ပထမဆုံး အသုံးပြုသူ လမ်းညွှန်",
        guideTitle: "ရန်ကုန် လျှပ်စစ်မီး အုပ်စု (Groups) များအကြောင်း",
        guideDesc: "YESC မှ ရန်ကုန်မြို့တွင်း လျှပ်စစ်ဓာတ်အားကို အုပ်စု (A နှင့် B) ခွဲခြား၍ အလှည့်ကျ ပေးဝေပါသည်။ သင့်ရပ်ကွက် မည်သည့်အုပ်စုဖြစ်သည်ကို မသေချာပါက အောက်ပါအတိုင်း အလွယ်တကူ စစ်ဆေးပြောင်းလဲနိုင်ပါသည်။",
        guideStep1Title: "အချိန်မရွေး ပြောင်းလဲနိုင်ခြင်း",
        guideStep1Desc: "မျက်နှာပြင် အပေါ်ဘက်ရှိ Group A / Group B ခလုတ်များကို နှိပ်ပြီး မိမိနှစ်သက်ရာ အုပ်စုသို့ အချိန်မရွေး ပြောင်းလဲကြည့်ရှုနိုင်ပါသည်။",
        guideStep2Title: "၄ နာရီစီ အလှည့်ကျ စနစ်",
        guideStep2Desc: "နံနက် ၀၅:၀၀ မှ ည ၂၁:၀၀ အထိ ၄ နာရီစီ အလှည့်ကျ မီးပေးဝေပြီး၊ ည ၂၁:၀၀ မှ နံနက် ၀၅:၀၀ အထိ အုပ်စုအားလုံး မီးမပျက်ပါ (No Loadshed)။ ညနေ ၅ နာရီ (၁၇:၀၀ - ၂၁:၀၀) တွင် မီးလာပါက ည ၉ နာရီနောက်ပိုင်းတွင်လည်း ညလုံးပေါက် မီးဆက်လက်ရရှိနေမည် ဖြစ်ပါသည်။",
        guideStep3Title: "မိမိအုပ်စု သိရှိနိုင်မည့် နည်းလမ်း",
        guideStep3Desc: "သင့်အိမ်တွင် မီးလာနေချိန် ဤဝဘ်ဆိုက်တွင် 'မီးရရှိနေပါသည်' ပြသနေသော အုပ်စုကို စစ်ဆေးကြည့်ပါ။",
        guideQuickLabel: "အုပ်စု စမ်းသပ်ရွေးချယ်ရန်:",
        guideGotItBtn: "နားလည်ပါပြီ",
        guideHelpBtn: "အုပ်စု လမ်းညွှန်",
        groupTabsHint: "💡 သင့်အုပ်စုကို ဤနေရာတွင် အချိန်မရွေး လွတ်လပ်စွာ ပြောင်းလဲနိုင်ပါသည်။",
        groupLabel: "အုပ်စု ရွေးရန်:",
        groupA: "အုပ်စု A",
        groupB: "အုပ်စု B",
        groupC: "အုပ်စု C",
        statusOn: "လျှပ်စစ်မီး ရရှိနေပါသည်",
        statusOff: "မီးပျက်နေပါသည် (မီးမရရှိပါ)",
        statusSubOn: "သင့်အုပ်စုအတွက် သတ်မှတ်ထားသော မီးလာချိန် ဖြစ်ပါသည်။",
        statusSubOff: "သင့်အုပ်စုအတွက် သတ်မှတ်ထားသော မီးပျက်ချိန် ဖြစ်ပါသည်။",
        statusSubNoLoadshed: "ညဉ့်ပိုင်း (၂၁:၀၀ မှ ၀၅:၀၀): အုပ်စုအားလုံး No Loadshed ဓာတ်အား ရရှိနေပါသည်!",
        statusSubContinuesNight: "ယခု မီးလာနေပြီး ည ၉ နာရီနောက်ပိုင်းတွင်လည်း ညလုံးပေါက် မီးမပျက်သည့် No Loadshed အချိန်နှင့် ဆက်သွားပါမည်။",
        countdownUntilOff: "မီးပြန်ပျက်ရန် ကျန်ရှိချိန်",
        countdownUntilOn: "မီးပြန်လာရန် ကျန်ရှိချိန်",
        timelineTitle: "၂၄ နာရီ မီးပေးဝေမှု အနှစ်ချုပ်",
        timelineLegendOn: "မီးလာချိန်",
        timelineLegendOff: "မီးပျက်ချိန်",
        currentTime: "ယခု",
        dailySchedule: "နေ့စဉ် အချိန်ဇယား",
        yesterday: "မနေ့က အချိန်ဇယား",
        today: "ယနေ့ အချိန်ဇယား",
        tomorrow: "မနက်ဖြန် အချိန်ဇယား",
        prevDayYesterday: "မနေ့က",
        nextDayTomorrow: "မနက်ဖြန်",
        prevDay: "ယခင်နေ့",
        nextDay: "နောက်တစ်နေ့",
        returnToday: "ယနေ့သို့ ပြန်ရန်",
        calendarBtnText: "ပြက္ခဒိန် (အောက်တိုဘာ/နိုဝင်ဘာ)",
        calendarModalTitle: "အချိန်ဇယား ပြက္ခဒိန် (၂၀၂၆)",
        calendarModalSubtitle: "အောက်တိုဘာနှင့် နိုဝင်ဘာလ အလှည့်ကျ ဇယားများ",
        calendarTabOct: "အောက်တိုဘာ ၂၀၂၆",
        calendarTabNov: "နိုဝင်ဘာ ၂၀၂၆",
        calendarPrompt: "၂၄ နာရီ ဇယားကြည့်ရန် ရက်စွဲကို နှိပ်ပါ",
        calendarPowerOnBadge: "မီးလာ",
        calendarPowerOffBadge: "မီးပျက်",
        availableBadge: "မီးလာမည်",
        outageBadge: "မီးပျက်မည်",
        noLoadshedNote: "⚡ No Loadshed (မီးမပျက်ပါ)",
        safetyTitle: "ဘေးကင်းလုံခြုံရေးနှင့် ကျန်းမာရေး သတိပေးချက်",
        safetyNotice: "ဤအချိန်ဇယားသည် YESC ၏ အလှည့်ကျ ဓာတ်အားပေးအစီအစဉ်ဖြစ်ပြီး အရေးပေါ်လိုင်းချို့ယွင်းမှုနှင့် ပြင်ဆင်မှုများကြောင့် အချိန်ပြောင်းလဲနိုင်ပါသည်။ အောက်ဆီဂျင်စက်နှင့် အအေးခန်းဆေးဝါးများကဲ့သို့ အသက်အန္တရာယ် အရေးကြီးသော ကျန်းမာရေးသုံးပစ္စည်းများအတွက် သီးသန့် အရန်မီးစက် သို့မဟုတ် အင်ဗာတာ မပါရှိဘဲ ဤဇယားတစ်ခုတည်းအပေါ် လုံးဝမှီခိုခြင်း မပြုကြပါရန် သတိပေးအပ်ပါသည်။",
        safetyAlertModalTitle: "ဘေးကင်းလုံခြုံရေးနှင့် ကျန်းမာရေး သတိပေးချက်",
        safetyAlertModalSubtitle: "အရေးကြီးသော ကျန်းမာရေးနှင့် လျှပ်စစ်သတိပေးချက်",
        safetyAlertModalText: "ဤအချိန်ဇယားသည် YESC ၏ အလှည့်ကျ ဓာတ်အားပေးအစီအစဉ်ဖြစ်ပြီး အရေးပေါ်လိုင်းချို့ယွင်းမှုနှင့် ပြင်ဆင်မှုများကြောင့် အချိန်ပြောင်းလဲနိုင်ပါသည်။ အောက်ဆီဂျင်စက်နှင့် အအေးခန်းဆေးဝါးများကဲ့သို့ အသက်အန္တရာယ် အရေးကြီးသော ကျန်းမာရေးသုံးပစ္စည်းများအတွက် သီးသန့် အရန်မီးစက် သို့မဟုတ် အင်ဗာတာ မပါရှိဘဲ ဤဇယားတစ်ခုတည်းအပေါ် လုံးဝမှီခိုခြင်း မပြုကြပါရန် သတိပေးအပ်ပါသည်။",
        safetyAlertAckBtn: "နားလည်သဘောပေါက်ပါသည်",
        // FAQ & SEO Knowledge Base
        faqTitle: "မကြာခဏ မေးလေ့ရှိသော မေးခွန်းများ (မီးပျက်ချိန် / EPC လမ်းညွှန်)",
        faqSubtitle: "ရန်ကုန် လျှပ်စစ်မီး အချိန်ဇယားနှင့် မီးပျက်ချိန် (Mee Pyt / Mee Pyat) ဆိုင်ရာ အမေးအဖြေများ",
        faqQ1: "ရန်ကုန် မီးပျက်ချိန် (Mee Pyt / Mee Pyat) ဇယားကို မည်သို့ စစ်ဆေးနိုင်သနည်း?",
        faqA1: "YESC မှ ရန်ကုန်မြို့နယ်များကို အုပ်စု A နှင့် အုပ်စု B ဟူ၍ ခွဲခြားထားပြီး နံနက် ၀၅:၀၀ မှ ည ၂၁:၀၀ အထိ ၄ နာရီစီ အလှည့်ကျ မီးပေးဝေပါသည်။ ညဉ့် ၂၁:၀၀ မှ နံနက် ၀၅:၀၀ အထိ အုပ်စုအားလုံး မီးမပျက်ပါ (No Loadshed)။ ဤဝဘ်ဆိုက်တွင် သင့်အုပ်စုကို ရွေးချယ်၍ မီးလာချိန်နှင့် မီးပျက်ချိန်များကို တိုက်ရိုက် ကြည့်ရှုနိုင်ပါသည်။",
        faqQ2: "YESC နှင့် EPC မီးပျက်ချိန် (Electric Breakout) နာရီများမှာ မည်သည့်အချိန်များ ဖြစ်သနည်း?",
        faqA2: "တရားဝင် အချိန်ဇယားအရ နေ့ခင်းပိုင်းတွင် ၀၅:၀၀ - ၀၉:၀၀၊ ၀၉:၀၀ - ၁၃:၀၀၊ ၁၃:၀၀ - ၁၇:၀၀ နှင့် ၁၇:၀၀ - ၂၁:၀၀ ဟူ၍ ၄ နာရီစီ အလှည့်ကျ ပေးဝေပါသည်။ ညနေ ၅ နာရီ (၁၇:၀၀ - ၂၁:၀၀) တွင် မီးလာနေပါက ည ၂၁:၀၀ နောက်ပိုင်း No Loadshed ညလုံးပေါက်ချိန်နှင့် ဆက်သွားသဖြင့် ည ၉ နာရီကျော်ထိ မီးဆက်လက်ရရှိနေမည်ဖြစ်ပါသည်။ အထက်ပါ ၂၄ နာရီ အနှစ်ချုပ်ဘားတွင် သင့်အုပ်စု မီးရရှိမည့်အချိန်နှင့် မီးပျက်မည့်အချိန်များကို အလွယ်တကူ စစ်ဆေးနိုင်ပါသည်။",
        faqQ3: "ရန်ကုန် EPC နှင့် YESC အခေါ်အဝေါ် ကွာခြားချက်မှာ အဘယ်နည်း?",
        faqA3: "ပြည်သူလူထုအနေဖြင့် မြို့နယ် လျှပ်စစ်ရုံးနှင့် မီးလိုင်းများကို အလွယ်တကူ 'အီးပီစီ' (EPC) ဟု အသုံးများကြပြီး၊ ရန်ကုန်တိုင်းအတွင်း တရားဝင် ဓာတ်အားပေးဝေသော ဌာနမှာ YESC (ရန်ကုန် လျှပ်စစ်ဓာတ်အားပေးရေးကော်ပိုရေးရှင်း) ဖြစ်ပါသည်။ အခေါ်အဝေါ် ကွဲပြားသော်လည်း တူညီသော လျှပ်စစ်ဓာတ်အားပေးစနစ်ကို ရည်ညွှန်းခြင်း ဖြစ်ပါသည်။",
        faqQ4: "အရေးပေါ် မီးပျက်ခြင်း (Electric Breakout) နှင့် ဓာတ်ကြိုး ချို့ယွင်းမှုများအတွက် မည်သည့်နေရာသို့ ဆက်သွယ်ရမည်နည်း?",
        faqA4: "အရေးပေါ် မီးလိုင်းချို့ယွင်းမှု၊ ဓာတ်ကြိုးပြတ်ကျမှုနှင့် ထရန်စဖော်မာ မီးပွားထွက်မှုများအတွက် YESC ၏ ၂၄ နာရီ အရေးပေါ် ဟော့လိုင်းဖုန်း <strong>၁၉၅၀</strong> သို့ တိုက်ရိုက် ဆက်သွယ်အကြောင်းကြားနိုင်သလို၊ မိမိမြို့နယ် EPC ရုံးများသို့လည်း ဆက်သွယ်နိုင်ပါသည်။",
        emergencyBtn: "YESC ဖုန်းခေါ်ရန် (၁၉၅၀)",
        safetyTipsBtn: "ဘေးကင်းရေး လမ်းညွှန်ချက်များ",
        settingsBtn: "ဆက်တင်နှင့် လျှို့ဝှက်ချက်",
        analyticsBtn: "အသုံးပြုမှု မှတ်တမ်း ကြည့်ရန်",
        versionHistoryBtn: "အချိန်ဇယား သမိုင်းနှင့် ဗားရှင်း",
        offlineText: "အင်တာနက်လိုင်း မရှိပါ။ ယခင် သိမ်းဆည်းထားသော အချက်အလက်များကို ပြသနေပါသည်။",
        themeToggle: "ဒီဇိုင်း အလင်း/အမှောင် ပြောင်းရန်",
        langToggle: "Switch language to English",
        closeModal: "ပိတ်ရန်",
        // Version Modal
        versionModalTitle: "အချိန်ဇယား သမိုင်းကြောင်းနှင့် ဗားရှင်း ရွေးချယ်မှု",
        versionModalDesc: "လက်ရှိကျင့်သုံးနေသော YESC ဇယားသစ်နှင့် ယခင်အဟောင်းများကို စိတ်ကြိုက် ပြောင်းလဲ ကြည့်ရှုနိုင်ပါသည်။",
        versionActiveBadge: "လက်ရှိကျင့်သုံးဆဲ",
        versionArchiveBadge: "ယခင်ဇယားဟောင်း",
        switchVersionBtn: "ဤဇယားကို အသုံးပြုမည်",
        currentActiveVersionText: "လက်ရှိ အသုံးပြုနေသည်",
        // Analytics
        analyticsModalTitle: "ဝဘ်ဆိုက် အသုံးပြုမှု မှတ်တမ်း",
        analyticsDesc: "၁၀၀% သင့်ဖုန်းတွင်သာ လုံခြုံစွာ မှတ်တမ်းတင်ထားသော စာရင်းများ ဖြစ်ပါသည်။ မည်သည့် ပြင်ပ ကြော်ငြာနှင့် စောင့်ကြည့်ကုဒ်မျှ မပါဝင်ပါ။",
        analyticsTotalOpens: "စုစုပေါင်း ဖွင့်ကြည့်မှု",
        analyticsTopDevice: "အကြည့်အများဆုံး စက်",
        analyticsTopGroup: "အကြည့်အများဆုံး အုပ်စု",
        analyticsOfflineOpens: "အင်တာနက်မရှိဘဲ ကြည့်ရှုမှု",
        analyticsHotlineTaps: "၁၉၅၀ ခေါ်ဆိုမှု",
        analyticsDeviceBreakdown: "စက်ပစ္စည်းအလိုက် ကြည့်ရှုမှု (ဖုန်း / ကွန်ပျူတာ / တက်ဘလက်)",
        analyticsMobile: "စမတ်ဖုန်း (Mobile)",
        analyticsTablet: "တက်ဘလက် (Tablet)",
        analyticsDesktop: "ကွန်ပျူတာ (Desktop)",
        analyticsGroupBreakdown: "အုပ်စုအလိုက် အချိုးအစား",
        analyticsTimeBreakdown: "အများဆုံး ကြည့်ရှုသော အချိန်",
        analyticsMorning: "နံနက်ပိုင်း (၀၅:၀၀ - ၁၂:၀၀)",
        analyticsAfternoon: "နေ့လယ်ပိုင်း (၁၂:၀၀ - ၁၇:၀၀)",
        analyticsEvening: "ညနေပိုင်း (၁၇:၀၀ - ၂၁:၀၀)",
        analyticsNight: "ညဉ့်ပိုင်း (၂၁:၀၀ - ၀၅:၀၀)",
        analyticsExportBtn: "မှတ်တမ်း ဖိုင်ဒေါင်းလုဒ် (JSON)",
        analyticsResetBtn: "မှတ်တမ်း ရှင်းထုတ်ရန်",
        analyticsResetConfirm: "အသုံးပြုမှု မှတ်တမ်းများကို အမှန်တကယ် ရှင်းထုတ်လိုပါသလား?",
        emergencyTitle: "YESC အရေးပေါ် ဖုန်းနံပါတ်များနှင့် အရေးပေါ်သတိပြုဖွယ်ရာများ",
        emergencyBody: `
            <p><strong>ရန်ကုန် လျှပ်စစ်ဓာတ်အားပေးရေး ကော်ပိုရေးရှင်း (YESC)</strong></p>
            <p>ဗဟို ၂၄ နာရီ ဖုန်းလိုင်း: <a href="tel:1950" class="btn btn-primary" style="display:inline-block; margin-top:0.25rem;">၁၉၅၀ သို့ ခေါ်ဆိုရန်</a></p>
            <hr style="border:none; border-top:1px solid var(--border-subtle); margin:0.75rem 0;">
            <p><strong>မီးပျက်ချိန်နှင့် မီးပြန်လာချိန် လျှပ်စစ်အန္တရာယ် ကင်းရှင်းရေး အကြံပြုချက်များ:</strong></p>
            <ul style="padding-left:1.25rem; margin-top:0.5rem; display:flex; flex-direction:column; gap:0.35rem;">
                <li>မီးပျက်ချိန်တွင် အဲကွန်း၊ ရေတင်မော်တာ၊ ရေခဲသေတ္တာ စသည့် မီးအားစားသော ပစ္စည်းများကို ပလက်ဖြုတ်ထားပါ (သို့) ခလုတ်ပိတ်ထားပါ။ မီးပြန်လာချိန် လျှပ်စစ်ဗို့အား ရုတ်တရက်တက်ခြင်းကြောင့် ပျက်စီးနိုင်ပါသည်။</li>
                <li>မီးပြန်လာပြီး ၃ မိနစ်မှ ၅ မိနစ်ခန့် အချိန်စောင့်ဆိုင်းပြီးမှသာ အကြီးစားလျှပ်စစ်ပစ္စည်းများကို ပြန်လည်ဖွင့်သင့်ပါသည်။</li>
                <li>ဓာတ်ကြိုးပြတ်ကျခြင်း၊ ထရန်စဖော်မာ မီးပွားထွက်ခြင်းများ တွေ့ရှိပါက အနီးသို့ မကပ်ဘဲ ၁၉၅၀ သို့ ချက်ချင်း ဆက်သွယ်အကြောင်းကြားပါ။</li>
            </ul>
            <hr style="border:none; border-top:1px solid var(--border-subtle); margin:0.75rem 0;">
            <p><strong>ဝဘ်ဆိုက် ရေးသားသူ ဆက်သွယ်ရန် (Developer):</strong></p>
            <p style="margin-top:0.35rem; font-size:0.875rem;">
                ရေးသားဖန်တီးသူ: <strong>သန့်ဇင်ထူး (Thant Zin Htoo)</strong><br>
                ဝဘ်ဆိုက်လိပ်စာ: <a href="http://thantzinhtoodev.unaux.com/" target="_blank" rel="noopener noreferrer" style="color:var(--brand-primary); font-weight:600; text-decoration:underline;">thantzinhtoodev.unaux.com</a>
            </p>
        `,
        settingsTitle: "ဆက်တင်များနှင့် ဒေတာ လုံခြုံမှု",
        settingsBody: `
            <p><strong>ဒေတာ လုံခြုံမှုနှင့် သုံးစွဲသူ အခွင့်အရေး</strong></p>
            <p>ဤဝဘ်ဆိုက်သည် ပြည်သူ့အကျိုးပြု ကျင့်ဝတ်များအတိုင်း တည်ဆောက်ထားပါသည်။ သင်ရွေးချယ်ထားသော အုပ်စု၊ ဘာသာစကားနှင့် ဒီဇိုင်းများကို သင့်ဖုန်းတွင်သာ လုံခြုံစွာ သိမ်းဆည်းပါသည်။ ပြင်ပ စောင့်ကြည့်ခြင်း လုံးဝ မရှိပါ။</p>
            
            <div style="margin-top:1rem; display:flex; flex-direction:column; gap:0.5rem;">
                <label style="font-weight:600;">ဒီဇိုင်း ရွေးချယ်မှု:</label>
                <div style="display:flex; gap:0.5rem;">
                    <button id="set-theme-light" class="btn btn-outline" style="flex:1;">အလင်း (Light)</button>
                    <button id="set-theme-dark" class="btn btn-outline" style="flex:1;">အမှောင် (Dark)</button>
                    <button id="set-theme-system" class="btn btn-outline" style="flex:1;">စနစ်အတိုင်း (Auto)</button>
                </div>
            </div>
            <div style="margin-top:1.25rem;">
                <button id="clear-data-btn" class="btn btn-danger" style="width:100%;">သိမ်းဆည်းထားသော အချက်အလက်များ ဖျက်ရန်</button>
            </div>
        `,
        dataResetSuccess: "သိမ်းဆည်းထားသော ဆက်တင်များကို ရှင်းလင်းပြီးပါပြီ။",
        footerNotice: "ပြည်သူ့အကျိုးပြု လျှပ်စစ်အချိန်ဇယား • WCAG 2.2 AA စံနှုန်းများနှင့်အညီ ဖန်တီးထားပါသည်"
    }
};

// ============================================================================
// 3. APPLICATION STATE
// ============================================================================

// Schedule version: Defaults to October 2026 ('2026-10')
let currentVersionId = localStorage.getItem('ygn_schedule_version') || '2026-10';
let currentLang = localStorage.getItem('ygn_lang') || 'en';
let currentTheme = localStorage.getItem('ygn_theme') || 'system';
let currentGroup = localStorage.getItem('selectedGroup') || 'A';
let dayOffset = 0; // Days relative to today (bounded Oct 1 to Nov 30, 2026)
let calendarActiveMonth = 9; // 9 = October (0-indexed), 10 = November
let lastAnnouncedStatus = "";

// Ensure selected group exists in the current version
function sanitizeGroupSelection() {
    const config = SCHEDULE_VERSIONS[currentVersionId];
    if (!config.groups.includes(currentGroup)) {
        currentGroup = config.groups[0];
        localStorage.setItem('selectedGroup', currentGroup);
    }
}
sanitizeGroupSelection();

// ============================================================================
// 4. SELF-HOSTED PRIVACY-PRESERVING ANALYTICS ENGINE
// ============================================================================

const SelfAnalytics = {
    STORAGE_KEY: 'ygn_self_analytics_v1',

    detectDeviceType() {
        const ua = (navigator.userAgent || '').toLowerCase();
        const width = window.innerWidth || (window.screen ? window.screen.width : 0) || 0;

        // 1. Check Tablet (iPad, Android tablet UA, or tablet screen sizes with touch support)
        const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/i.test(ua)
            || (width >= 640 && width <= 1024 && ('ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)));
        if (isTablet) return 'tablet';

        // 2. Check Mobile
        const isMobile = /(android.*mobile|iphone|ipod|blackberry|iemobile|opera mini|mobile)/i.test(ua)
            || width < 640;
        if (isMobile) return 'mobile';

        // 3. Otherwise Desktop / Laptop
        return 'desktop';
    },

    getStats() {
        const defaults = {
            installedAt: new Date().toISOString(),
            totalLaunches: 0,
            offlineLaunches: 0,
            hotlineClicks: 0,
            lastActive: new Date().toISOString(),
            devices: { mobile: 0, desktop: 0, tablet: 0 },
            groups: { A: 0, B: 0, C: 0 },
            languages: { en: 0, my: 0 },
            themes: { light: 0, dark: 0 },
            timeOfDay: { morning: 0, afternoon: 0, evening: 0, night: 0 },
            dayChecks: { yesterday: 0, today: 0, tomorrow: 0 }
        };

        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : {};
            const stats = {
                ...defaults,
                ...parsed,
                devices: { ...defaults.devices, ...(parsed.devices || {}) },
                groups: { ...defaults.groups, ...(parsed.groups || {}) },
                languages: { ...defaults.languages, ...(parsed.languages || {}) },
                themes: { ...defaults.themes, ...(parsed.themes || {}) },
                timeOfDay: { ...defaults.timeOfDay, ...(parsed.timeOfDay || {}) },
                dayChecks: { ...defaults.dayChecks, ...(parsed.dayChecks || {}) }
            };

            // Backfill migration if user already had launches before device tracking was added
            if (stats.totalLaunches > 0 && (stats.devices.mobile + stats.devices.desktop + stats.devices.tablet === 0)) {
                const currentDev = this.detectDeviceType();
                stats.devices[currentDev] = stats.totalLaunches;
            }

            return stats;
        } catch (e) {
            return defaults;
        }
    },

    saveStats(data) {
        try {
            data.lastActive = new Date().toISOString();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn("Analytics write skipped:", e);
        }
    },

    recordAppLaunch(isOffline = false) {
        const stats = this.getStats();
        stats.totalLaunches += 1;
        if (isOffline) stats.offlineLaunches += 1;

        // Record Device Type (Mobile, Desktop, Tablet)
        const devType = this.detectDeviceType();
        stats.devices[devType] = (stats.devices[devType] || 0) + 1;

        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) stats.timeOfDay.morning += 1;
        else if (hour >= 12 && hour < 17) stats.timeOfDay.afternoon += 1;
        else if (hour >= 17 && hour < 21) stats.timeOfDay.evening += 1;
        else stats.timeOfDay.night += 1;

        this.saveStats(stats);
    },

    recordGroupSelection(group) {
        const stats = this.getStats();
        stats.groups[group] = (stats.groups[group] || 0) + 1;
        this.saveStats(stats);
    },

    recordLanguageSelection(lang) {
        const stats = this.getStats();
        stats.languages[lang] = (stats.languages[lang] || 0) + 1;
        this.saveStats(stats);
    },

    recordThemeSelection(theme) {
        const stats = this.getStats();
        stats.themes[theme] = (stats.themes[theme] || 0) + 1;
        this.saveStats(stats);
    },

    recordDayNavigation(offset) {
        const stats = this.getStats();
        if (offset === -1) stats.dayChecks.yesterday += 1;
        else if (offset === 0) stats.dayChecks.today += 1;
        else if (offset === 1) stats.dayChecks.tomorrow += 1;
        this.saveStats(stats);
    },

    recordHotlineClick() {
        const stats = this.getStats();
        stats.hotlineClicks += 1;
        this.saveStats(stats);
    },

    renderDashboard() {
        const stats = this.getStats();
        const t = I18N[currentLang];
        const container = document.getElementById('analytics-modal-content');
        if (!container) return;

        // 1. Group popularity
        let topGroup = "None";
        let maxGroupCount = -1;
        Object.entries(stats.groups).forEach(([g, count]) => {
            if (count > maxGroupCount) {
                maxGroupCount = count;
                topGroup = `Group ${g}`;
            }
        });
        if (maxGroupCount <= 0) topGroup = "—";

        const totalGroupSelections = (stats.groups.A + stats.groups.B + stats.groups.C) || 1;
        const pctA = Math.round((stats.groups.A / totalGroupSelections) * 100);
        const pctB = Math.round((stats.groups.B / totalGroupSelections) * 100);
        const pctC = Math.round((stats.groups.C / totalGroupSelections) * 100);

        // 2. Device / Platform breakdown (Mobile, Desktop, Tablet)
        const totalDevs = (stats.devices.mobile + stats.devices.desktop + stats.devices.tablet) || 1;
        const pctMobile = Math.round((stats.devices.mobile / totalDevs) * 100);
        const pctDesktop = Math.round((stats.devices.desktop / totalDevs) * 100);
        const pctTablet = Math.round((stats.devices.tablet / totalDevs) * 100);

        let topDeviceLabel = t.analyticsMobile;
        let topDeviceIcon = "fa-mobile-screen";
        let maxDevCount = stats.devices.mobile;

        if (stats.devices.desktop > maxDevCount) {
            topDeviceLabel = t.analyticsDesktop;
            topDeviceIcon = "fa-desktop";
            maxDevCount = stats.devices.desktop;
        }
        if (stats.devices.tablet > maxDevCount) {
            topDeviceLabel = t.analyticsTablet;
            topDeviceIcon = "fa-tablet-screen-button";
            maxDevCount = stats.devices.tablet;
        }
        if (stats.totalLaunches === 0) {
            topDeviceLabel = "—";
            topDeviceIcon = "fa-mobile-screen";
        }

        // 3. Time of Day breakdown
        const totalTimes = (stats.timeOfDay.morning + stats.timeOfDay.afternoon + stats.timeOfDay.evening + stats.timeOfDay.night) || 1;
        const pctMorning = Math.round((stats.timeOfDay.morning / totalTimes) * 100);
        const pctAfternoon = Math.round((stats.timeOfDay.afternoon / totalTimes) * 100);
        const pctEvening = Math.round((stats.timeOfDay.evening / totalTimes) * 100);
        const pctNight = Math.round((stats.timeOfDay.night / totalTimes) * 100);

        container.innerHTML = `
            <p style="font-size:0.8125rem; color:var(--text-muted); line-height:1.45;">${t.analyticsDesc}</p>
            
            <div class="analytics-grid" style="margin-top:0.75rem;">
                <div class="analytics-card">
                    <i class="fas fa-eye" aria-hidden="true"></i>
                    <span class="analytics-stat-value">${stats.totalLaunches}</span>
                    <span class="analytics-stat-label">${t.analyticsTotalOpens}</span>
                </div>
                <div class="analytics-card">
                    <i class="fas ${topDeviceIcon}" aria-hidden="true" style="color:#10b981;"></i>
                    <span class="analytics-stat-value" style="font-size:1.05rem; line-height:1.25;">${topDeviceLabel}</span>
                    <span class="analytics-stat-label">${t.analyticsTopDevice}</span>
                </div>
                <div class="analytics-card">
                    <i class="fas fa-layer-group" aria-hidden="true"></i>
                    <span class="analytics-stat-value" style="font-size:1.15rem;">${topGroup}</span>
                    <span class="analytics-stat-label">${t.analyticsTopGroup}</span>
                </div>
                <div class="analytics-card">
                    <i class="fas fa-wifi-slash" aria-hidden="true"></i>
                    <span class="analytics-stat-value">${stats.offlineLaunches}</span>
                    <span class="analytics-stat-label">${t.analyticsOfflineOpens}</span>
                </div>
            </div>

            <!-- SECTION A: Device Breakdown (Mobile vs Desktop vs Tablet) -->
            <div class="analytics-section" style="margin-top:1rem;">
                <span class="analytics-section-title">
                    <span><i class="fas fa-laptop" style="color:var(--brand-primary); margin-right:0.35rem;"></i> ${t.analyticsDeviceBreakdown}</span>
                    <span style="font-size:0.75rem; color:var(--text-muted); font-weight:normal;">${stats.totalLaunches} views</span>
                </span>
                <div class="analytics-bars-list">
                    <div class="analytics-bar-item">
                        <div class="analytics-bar-info">
                            <span><i class="fas fa-mobile-screen" style="width:1.2rem; color:#10b981;"></i> ${t.analyticsMobile}</span>
                            <span>${stats.devices.mobile} views (${pctMobile}%)</span>
                        </div>
                        <div class="analytics-bar-track">
                            <div class="analytics-bar-fill" style="width:${pctMobile}%; background-color:#10b981;"></div>
                        </div>
                    </div>
                    <div class="analytics-bar-item">
                        <div class="analytics-bar-info">
                            <span><i class="fas fa-desktop" style="width:1.2rem; color:#3b82f6;"></i> ${t.analyticsDesktop}</span>
                            <span>${stats.devices.desktop} views (${pctDesktop}%)</span>
                        </div>
                        <div class="analytics-bar-track">
                            <div class="analytics-bar-fill" style="width:${pctDesktop}%; background-color:#3b82f6;"></div>
                        </div>
                    </div>
                    <div class="analytics-bar-item">
                        <div class="analytics-bar-info">
                            <span><i class="fas fa-tablet-screen-button" style="width:1.2rem; color:#8b5cf6;"></i> ${t.analyticsTablet}</span>
                            <span>${stats.devices.tablet} views (${pctTablet}%)</span>
                        </div>
                        <div class="analytics-bar-track">
                            <div class="analytics-bar-fill" style="width:${pctTablet}%; background-color:#8b5cf6;"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SECTION B: Group Popularity -->
            <div class="analytics-section">
                <span class="analytics-section-title">
                    <span><i class="fas fa-users" style="color:var(--brand-primary); margin-right:0.35rem;"></i> ${t.analyticsGroupBreakdown}</span>
                </span>
                <div class="analytics-bars-list">
                    <div class="analytics-bar-item">
                        <div class="analytics-bar-info">
                            <span>Group A</span>
                            <span>${stats.groups.A} checks (${pctA}%)</span>
                        </div>
                        <div class="analytics-bar-track">
                            <div class="analytics-bar-fill" style="width:${pctA}%; background-color:#3b82f6;"></div>
                        </div>
                    </div>
                    <div class="analytics-bar-item">
                        <div class="analytics-bar-info">
                            <span>Group B</span>
                            <span>${stats.groups.B} checks (${pctB}%)</span>
                        </div>
                        <div class="analytics-bar-track">
                            <div class="analytics-bar-fill" style="width:${pctB}%; background-color:#8b5cf6;"></div>
                        </div>
                    </div>
                    ${SCHEDULE_VERSIONS[currentVersionId].groups.includes('C') ? `
                    <div class="analytics-bar-item">
                        <div class="analytics-bar-info">
                            <span>Group C</span>
                            <span>${stats.groups.C} checks (${pctC}%)</span>
                        </div>
                        <div class="analytics-bar-track">
                            <div class="analytics-bar-fill" style="width:${pctC}%; background-color:#f59e0b;"></div>
                        </div>
                    </div>` : ''}
                </div>
            </div>

            <!-- SECTION C: Peak Checking Hours -->
            <div class="analytics-section">
                <span class="analytics-section-title">
                    <span><i class="fas fa-clock" style="color:var(--brand-primary); margin-right:0.35rem;"></i> ${t.analyticsTimeBreakdown}</span>
                </span>
                <div class="analytics-bars-list">
                    <div class="analytics-bar-item">
                        <div class="analytics-bar-info">
                            <span>${t.analyticsMorning}</span>
                            <span>${pctMorning}%</span>
                        </div>
                        <div class="analytics-bar-track">
                            <div class="analytics-bar-fill" style="width:${pctMorning}%;"></div>
                        </div>
                    </div>
                    <div class="analytics-bar-item">
                        <div class="analytics-bar-info">
                            <span>${t.analyticsAfternoon}</span>
                            <span>${pctAfternoon}%</span>
                        </div>
                        <div class="analytics-bar-track">
                            <div class="analytics-bar-fill" style="width:${pctAfternoon}%;"></div>
                        </div>
                    </div>
                    <div class="analytics-bar-item">
                        <div class="analytics-bar-info">
                            <span>${t.analyticsEvening}</span>
                            <span>${pctEvening}%</span>
                        </div>
                        <div class="analytics-bar-track">
                            <div class="analytics-bar-fill" style="width:${pctEvening}%;"></div>
                        </div>
                    </div>
                    <div class="analytics-bar-item">
                        <div class="analytics-bar-info">
                            <span>${t.analyticsNight}</span>
                            <span>${pctNight}%</span>
                        </div>
                        <div class="analytics-bar-track">
                            <div class="analytics-bar-fill" style="width:${pctNight}%;"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Civic Hotline Taps -->
            <div style="font-size:0.75rem; color:var(--text-muted); display:flex; align-items:center; gap:0.35rem; margin-top:0.75rem; padding:0.4rem 0.65rem; background-color:var(--bg-elevated); border-radius:var(--radius-sm); border:1px solid var(--border-subtle);">
                <i class="fas fa-phone-alt" style="color:var(--brand-primary);"></i>
                <span>${t.analyticsHotlineTaps}: <strong>${stats.hotlineClicks}</strong></span>
            </div>

            <div class="analytics-footer-actions">
                <button id="analytics-export-btn" class="btn btn-outline">
                    <i class="fas fa-download"></i> ${t.analyticsExportBtn}
                </button>
                <button id="analytics-reset-btn" class="btn btn-danger">
                    <i class="fas fa-trash-alt"></i> ${t.analyticsResetBtn}
                </button>
            </div>
        `;

        document.getElementById('analytics-export-btn')?.addEventListener('click', () => {
            this.exportReport();
        });

        document.getElementById('analytics-reset-btn')?.addEventListener('click', () => {
            if (confirm(t.analyticsResetConfirm)) {
                this.resetStats();
                this.renderDashboard();
            }
        });
    },

    exportReport() {
        const stats = this.getStats();
        const jsonStr = JSON.stringify(stats, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ygn_electricity_analytics_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    },

    resetStats() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
};

/**
 * Sends anonymous ping to server-side backend (api/track.php) if supported
 */
function pingServerAnalytics() {
    try {
        const devType = SelfAnalytics.detectDeviceType();
        const payload = JSON.stringify({
            device: devType,
            group: currentGroup || 'A',
            lang: currentLang || 'en'
        });

        // Use Netlify Functions if on Netlify or fallback to api/track.php
        const trackUrl = (window.location.hostname.includes('netlify.app') || window.location.pathname.includes('/.netlify/'))
            ? '/.netlify/functions/track'
            : 'api/track.php';

        if (navigator.sendBeacon) {
            navigator.sendBeacon(trackUrl, payload);
        } else {
            fetch(trackUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload,
                keepalive: true
            }).catch(() => { });
        }
    } catch (e) {
        // Fails safely on static hosts
    }
}

// ============================================================================
// 5. SCHEDULE CALCULATION CORE (Dynamic Version-Aware)
// ============================================================================

/**
 * Returns a Date object anchored to Myanmar Local Time (UTC+6:30)
 */
function getMyanmarTime() {
    const now = new Date();
    const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
    const mmMs = utcMs + (6.5 * 3600000);
    return new Date(mmMs);
}

/**
 * Formats date as YYYY-MM-DD in Myanmar Time
 */
function formatDateKey(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Retrieves the slot rotation pattern for any date under the active schedule version
 */
function getSchedulePatternForDate(dateStr, versionId = currentVersionId) {
    const config = SCHEDULE_VERSIONS[versionId];
    const [y, m, d] = dateStr.split("-").map(Number);
    const targetUTC = Date.UTC(y, m - 1, d);

    const [baseY, baseM, baseD] = config.baseDate.split("-").map(Number);
    const baseUTC = Date.UTC(baseY, baseM - 1, baseD);

    const diffDays = Math.floor((targetUTC - baseUTC) / 86400000);
    const patternCount = config.patterns.length;
    const patternIndex = ((diffDays % patternCount) + patternCount) % patternCount;

    return config.patterns[patternIndex];
}

/**
 * Parses "HH:MM" relative to base date
 */
function parseTimeSlot(timeStr, baseDateObj) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const result = new Date(baseDateObj);
    result.setHours(hours, minutes, 0, 0);
    return result;
}

/**
 * Calculates exact start Date and end Date objects for a slot relative to its base schedule date
 */
function getSlotTimeRange(slot, baseDate) {
    const [sH, sM] = slot.start.split(":").map(Number);
    const [eH, eM] = slot.end.split(":").map(Number);

    const startObj = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), sH, sM, 0, 0);
    if (sH < 5) {
        startObj.setDate(startObj.getDate() + 1);
    }

    const endObj = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), eH, eM, 0, 0);
    if (eH <= 5 || slot.start > slot.end) {
        endObj.setDate(endObj.getDate() + 1);
    }

    return { startObj, endObj };
}

/**
 * Checks if target group has power at specific Myanmar Date/Time under active version
 */
function checkPowerAvailability(group, mmDateObj) {
    const config = SCHEDULE_VERSIONS[currentVersionId];
    const currentHours = mmDateObj.getHours();
    const currentMinutes = mmDateObj.getMinutes();
    const currentMinutesFromMidnight = currentHours * 60 + currentMinutes;

    // Day starts at 05:00 AM.
    // Hours 00:00 - 04:59 belong to the previous day's overnight block.
    let adjustedDateObj = new Date(mmDateObj);
    if (currentHours < 5) {
        adjustedDateObj.setDate(adjustedDateObj.getDate() - 1);
    }
    const scheduleDateKey = formatDateKey(adjustedDateObj);
    const pattern = getSchedulePatternForDate(scheduleDateKey);

    for (let i = 0; i < config.timeSlots.length; i++) {
        const slot = config.timeSlots[i];
        const [startH, startM] = slot.start.split(":").map(Number);
        const [endH, endM] = slot.end.split(":").map(Number);
        const startMinutes = startH * 60 + startM;
        let endMinutes = endH * 60 + endM;

        let isInSlot = false;
        if (slot.start > slot.end) {
            // Wraps midnight (e.g. 21:00 - 05:00 or 21:00 - 01:00)
            if (currentMinutesFromMidnight >= startMinutes || currentMinutesFromMidnight < endMinutes) {
                isInSlot = true;
            }
        } else {
            if (currentHours < 5 && slot.start === "01:00") {
                isInSlot = true;
            } else if (currentMinutesFromMidnight >= startMinutes && currentMinutesFromMidnight < endMinutes) {
                isInSlot = true;
            }
        }

        if (isInSlot) {
            const activeGroups = pattern[i].split("+");
            return {
                hasPower: activeGroups.includes(group),
                slotIndex: i,
                currentSlot: slot,
                isNoLoadshed: slot.isNoLoadshed || false,
                adjustedDateObj: adjustedDateObj
            };
        }
    }

    return { hasPower: false, slotIndex: 0, currentSlot: config.timeSlots[0], isNoLoadshed: false, adjustedDateObj: adjustedDateObj };
}

/**
 * Computes exact countdown seconds and target event under active version.
 * Accurately tracks contiguous power slots (e.g., if power is ON at 5:00 PM,
 * it rolls seamlessly through the overnight 21:00 - 05:00 No-Loadshed slot).
 */
function calculateCountdown(group) {
    const config = SCHEDULE_VERSIONS[currentVersionId];
    const mmNow = getMyanmarTime();
    const { hasPower, slotIndex, currentSlot, isNoLoadshed, adjustedDateObj } = checkPowerAvailability(group, mmNow);

    let targetTimeObj;
    let blockStartObj;
    let totalWindowSeconds = 4 * 3600;

    if (hasPower) {
        // Continuous power-on tracking:
        // Find when electricity actually turns OFF by stepping forward through all contiguous active slots
        const { startObj: currentBlockStart, endObj: currentBlockEnd } = getSlotTimeRange(currentSlot, adjustedDateObj);
        blockStartObj = currentBlockStart;
        targetTimeObj = currentBlockEnd;

        // Step backward to find when this uninterrupted power-on block started
        let backSlotIdx = slotIndex;
        let backDate = new Date(adjustedDateObj);
        for (let step = 0; step < config.timeSlots.length * 2; step++) {
            let prevSlotIdx = backSlotIdx - 1;
            let prevDate = new Date(backDate);
            if (prevSlotIdx < 0) {
                prevSlotIdx = config.timeSlots.length - 1;
                prevDate.setDate(prevDate.getDate() - 1);
            }
            const prevPattern = getSchedulePatternForDate(formatDateKey(prevDate));
            const prevGroups = prevPattern[prevSlotIdx].split("+");
            if (prevGroups.includes(group)) {
                const prevSlot = config.timeSlots[prevSlotIdx];
                const { startObj: prevStart } = getSlotTimeRange(prevSlot, prevDate);
                blockStartObj = prevStart;
                backSlotIdx = prevSlotIdx;
                backDate = prevDate;
            } else {
                break;
            }
        }

        // Step forward to find when electricity will turn OFF
        let forwardSlotIdx = slotIndex;
        let forwardDate = new Date(adjustedDateObj);
        for (let step = 0; step < config.timeSlots.length * 2; step++) {
            let nextSlotIdx = forwardSlotIdx + 1;
            let nextDate = new Date(forwardDate);
            if (nextSlotIdx >= config.timeSlots.length) {
                nextSlotIdx = 0;
                nextDate.setDate(nextDate.getDate() + 1);
            }
            const nextPattern = getSchedulePatternForDate(formatDateKey(nextDate));
            const nextGroups = nextPattern[nextSlotIdx].split("+");
            if (nextGroups.includes(group)) {
                // Next slot also has electricity for this group!
                const nextSlot = config.timeSlots[nextSlotIdx];
                const { endObj: nextEnd } = getSlotTimeRange(nextSlot, nextDate);
                targetTimeObj = nextEnd;
                forwardSlotIdx = nextSlotIdx;
                forwardDate = nextDate;
            } else {
                // Next slot is an outage for this group; power turns off at targetTimeObj
                break;
            }
        }

        if (blockStartObj && targetTimeObj) {
            totalWindowSeconds = Math.max(3600, Math.floor((targetTimeObj - blockStartObj) / 1000));
        }
    } else {
        // Continuous outage tracking:
        // Find when electricity turns ON by searching forward to the first available slot
        const { startObj: currentBlockStart } = getSlotTimeRange(currentSlot, adjustedDateObj);
        blockStartObj = currentBlockStart;

        // Step backward to find when this outage began
        let backSlotIdx = slotIndex;
        let backDate = new Date(adjustedDateObj);
        for (let step = 0; step < config.timeSlots.length * 2; step++) {
            let prevSlotIdx = backSlotIdx - 1;
            let prevDate = new Date(backDate);
            if (prevSlotIdx < 0) {
                prevSlotIdx = config.timeSlots.length - 1;
                prevDate.setDate(prevDate.getDate() - 1);
            }
            const prevPattern = getSchedulePatternForDate(formatDateKey(prevDate));
            const prevGroups = prevPattern[prevSlotIdx].split("+");
            if (!prevGroups.includes(group)) {
                const prevSlot = config.timeSlots[prevSlotIdx];
                const { startObj: prevStart } = getSlotTimeRange(prevSlot, prevDate);
                blockStartObj = prevStart;
                backSlotIdx = prevSlotIdx;
                backDate = prevDate;
            } else {
                break;
            }
        }

        // Search forward for the first slot with power
        let forwardSlotIdx = slotIndex;
        let forwardDate = new Date(adjustedDateObj);
        for (let step = 0; step < config.timeSlots.length * 3; step++) {
            let nextSlotIdx = forwardSlotIdx + 1;
            let nextDate = new Date(forwardDate);
            if (nextSlotIdx >= config.timeSlots.length) {
                nextSlotIdx = 0;
                nextDate.setDate(nextDate.getDate() + 1);
            }
            const nextPattern = getSchedulePatternForDate(formatDateKey(nextDate));
            const nextGroups = nextPattern[nextSlotIdx].split("+");
            if (nextGroups.includes(group)) {
                const nextSlot = config.timeSlots[nextSlotIdx];
                const { startObj: nextStart } = getSlotTimeRange(nextSlot, nextDate);
                targetTimeObj = nextStart;
                break;
            }
            forwardSlotIdx = nextSlotIdx;
            forwardDate = nextDate;
        }

        if (blockStartObj && targetTimeObj) {
            totalWindowSeconds = Math.max(3600, Math.floor((targetTimeObj - blockStartObj) / 1000));
        }
    }

    let diffMs = targetTimeObj ? (targetTimeObj - mmNow) : 0;
    if (diffMs < 0) diffMs = 0;

    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
        hasPower,
        isNoLoadshed,
        currentSlot,
        hours,
        minutes,
        seconds,
        totalSeconds,
        totalWindowSeconds,
        targetTimeObj
    };
}

// ============================================================================
// 6. UI RENDERING & COMPONENT MANAGERS
// ============================================================================

/**
 * Changes active schedule version (e.g. '2026-10' or '2025-04')
 */
function setScheduleVersion(versionId) {
    if (!SCHEDULE_VERSIONS[versionId]) return;
    currentVersionId = versionId;
    localStorage.setItem('ygn_schedule_version', versionId);

    sanitizeGroupSelection();
    updateGroupTabsVisibility();
    populateWelcomeGroupSelect();
    populateWelcomeGroupGrid();
    updateGuideQuickButtons();
    updateVersionBadgeUI();
    updateFullDisplay();
    renderScheduleList(currentGroup, getMyanmarTime());
}

/**
 * Updates group tabs based on whether the active version supports 2 or 3 groups
 */
function updateGroupTabsVisibility() {
    const config = SCHEDULE_VERSIONS[currentVersionId];
    const tabsContainer = document.getElementById('group-tabs');
    const tabC = document.getElementById('tab-group-c');

    if (config.groups.includes('C')) {
        if (tabC) tabC.style.display = 'flex';
        if (tabsContainer) tabsContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
    } else {
        if (tabC) tabC.style.display = 'none';
        if (tabsContainer) tabsContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
    }
}

/**
 * Updates the version badge in the header
 */
function updateVersionBadgeUI() {
    const config = SCHEDULE_VERSIONS[currentVersionId];
    const badgeText = document.getElementById('version-badge-text');
    if (badgeText) {
        badgeText.textContent = (currentLang === 'my') ? config.shortMm : config.shortEn;
    }
}

/**
 * Dynamically populates the initial welcome modal group selector based on active version
 */
function populateWelcomeGroupSelect() {
    const sel = document.getElementById('welcome-group-select');
    if (!sel) return;
    const config = SCHEDULE_VERSIONS[currentVersionId];
    sel.innerHTML = config.groups.map(g => {
        const label = (currentLang === 'my') ? `အုပ်စု (${g})` : `Group ${g}`;
        return `<option value="${g}" ${g === currentGroup ? 'selected' : ''}>${label}</option>`;
    }).join('');
}

/**
 * Populates interactive cards in the welcome modal
 */
function populateWelcomeGroupGrid() {
    const grid = document.getElementById('welcome-group-grid');
    if (!grid) return;
    const config = SCHEDULE_VERSIONS[currentVersionId];
    grid.innerHTML = config.groups.map(g => {
        const isSelected = (g === currentGroup);
        const groupLabel = (currentLang === 'my') ? `အုပ်စု ${g}` : `Group ${g}`;
        const subLabel = (currentLang === 'my') ? `လူနေရပ်ကွက်ဇုန်` : `Residential Zone`;
        return `
            <button type="button" class="welcome-group-card ${isSelected ? 'is-selected' : ''}" data-group="${g}" role="radio" aria-checked="${isSelected}">
                <div class="welcome-group-letter">${g}</div>
                <div class="welcome-group-info">
                    <strong>${groupLabel}</strong>
                    <span>${subLabel}</span>
                </div>
                <div class="welcome-check-circle" aria-hidden="true">
                    <i class="fas fa-check"></i>
                </div>
            </button>
        `;
    }).join('');

    grid.querySelectorAll('.welcome-group-card').forEach(card => {
        card.addEventListener('click', () => {
            const grp = card.getAttribute('data-group');
            grid.querySelectorAll('.welcome-group-card').forEach(c => {
                c.classList.remove('is-selected');
                c.setAttribute('aria-checked', 'false');
            });
            card.classList.add('is-selected');
            card.setAttribute('aria-checked', 'true');
            const sel = document.getElementById('welcome-group-select');
            if (sel) sel.value = grp;
        });
    });
}

/**
 * Updates quick select buttons in the first user guide box
 */
function updateGuideQuickButtons() {
    const container = document.querySelector('.guide-quick-btns');
    if (!container) return;
    const config = SCHEDULE_VERSIONS[currentVersionId];
    container.innerHTML = config.groups.map(g => {
        const isSelected = (g === currentGroup);
        const label = (currentLang === 'my') ? `အုပ်စု ${g}` : `Group ${g}`;
        return `
            <button type="button" class="guide-group-btn ${isSelected ? 'active' : ''}" data-group="${g}">
                ${isSelected ? '✓ ' : ''}${label}
            </button>
        `;
    }).join('');

    container.querySelectorAll('.guide-group-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const g = btn.getAttribute('data-group');
            if (g) {
                selectGroup(g);
            }
        });
    });
}

/**
 * Dismisses the first user guide box and saves choice
 */
function dismissGuideBox() {
    const box = document.getElementById('first-user-guide');
    if (box) {
        box.classList.add('is-dismissing');
        setTimeout(() => {
            box.classList.add('is-hidden');
            box.classList.remove('is-dismissing');
        }, 300);
    }
    localStorage.setItem('ygn_guide_dismissed', 'true');
}

/**
 * Shows/re-opens the first user guide box
 */
function showGuideBox() {
    const box = document.getElementById('first-user-guide');
    if (box) {
        box.classList.remove('is-hidden');
        box.classList.add('is-highlighted');
        box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => {
            box.classList.remove('is-highlighted');
        }, 1500);
    }
}

/**
 * Sets current language and updates all localized elements
 */
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('ygn_lang', lang);
    document.documentElement.lang = (lang === 'my') ? 'my' : 'en';

    const t = I18N[lang];

    // Header & Meta
    document.getElementById('app-title').textContent = t.appTitle;
    document.getElementById('app-subtitle').textContent = t.appSubtitle;
    document.getElementById('lang-toggle-btn').setAttribute('aria-label', t.langToggle);
    document.getElementById('lang-toggle-text').textContent = (lang === 'en') ? 'မြန်မာ' : 'EN';
    document.getElementById('theme-toggle-btn').setAttribute('aria-label', t.themeToggle);
    document.getElementById('analytics-btn')?.setAttribute('aria-label', t.analyticsBtn);
    document.getElementById('version-history-btn')?.setAttribute('aria-label', t.versionHistoryBtn);

    // Group Tab labels
    document.getElementById('group-tabs-heading').textContent = t.groupLabel;
    document.getElementById('tab-group-a').textContent = t.groupA;
    document.getElementById('tab-group-b').textContent = t.groupB;
    const tabC = document.getElementById('tab-group-c');
    if (tabC) tabC.textContent = t.groupC;

    // Timeline heading & legend
    document.getElementById('timeline-title').textContent = t.timelineTitle;
    document.getElementById('legend-on-text').textContent = t.timelineLegendOn;
    document.getElementById('legend-off-text').textContent = t.timelineLegendOff;

    // Safety Alert & Hotline
    document.getElementById('safety-title').textContent = t.safetyTitle;
    document.getElementById('safety-notice-text').textContent = t.safetyNotice;
    document.getElementById('emergency-action-btn').innerHTML = `<i class="fas fa-phone-alt"></i> ${t.emergencyBtn}`;
    document.getElementById('safety-tips-btn').innerHTML = `<i class="fas fa-shield-alt"></i> ${t.safetyTipsBtn}`;

    // Offline banner
    document.getElementById('offline-banner-text').textContent = t.offlineText;

    // Footer
    document.getElementById('footer-notice').textContent = t.footerNotice;
    document.getElementById('privacy-link').textContent = t.settingsBtn;

    // Modal elements
    const welcomeTitle = document.getElementById('welcome-modal-title');
    if (welcomeTitle) welcomeTitle.textContent = t.welcomeModalTitle || t.selectGroup;
    const welcomeSubtitle = document.getElementById('welcome-modal-subtitle');
    if (welcomeSubtitle) welcomeSubtitle.textContent = t.welcomeModalSubtitle;
    const welcomeDesc = document.getElementById('welcome-modal-desc');
    if (welcomeDesc) welcomeDesc.textContent = t.groupSelectPrompt;
    const welcomeConfirmText = document.getElementById('welcome-confirm-text');
    if (welcomeConfirmText) welcomeConfirmText.textContent = t.confirmBtn;
    const welcomeLaterText = document.getElementById('welcome-later-text');
    if (welcomeLaterText) welcomeLaterText.textContent = t.selectLaterBtn;
    const welcomeHelpTitle = document.getElementById('welcome-help-title');
    if (welcomeHelpTitle) welcomeHelpTitle.textContent = t.welcomeHelpTitle;
    const welcomeHelpDesc = document.getElementById('welcome-help-desc');
    if (welcomeHelpDesc) welcomeHelpDesc.textContent = t.welcomeHelpDesc;
    document.getElementById('version-modal-title').textContent = t.versionModalTitle;

    // User Guide Box elements
    const guideBadge = document.getElementById('guide-badge-text');
    if (guideBadge) guideBadge.textContent = t.guideBadge;
    const guideHeading = document.getElementById('guide-heading');
    if (guideHeading) guideHeading.textContent = t.guideTitle;
    const guideDesc = document.getElementById('guide-desc');
    if (guideDesc) guideDesc.textContent = t.guideDesc;
    const gStep1Title = document.getElementById('guide-step1-title');
    if (gStep1Title) gStep1Title.textContent = t.guideStep1Title;
    const gStep1Desc = document.getElementById('guide-step1-desc');
    if (gStep1Desc) gStep1Desc.textContent = t.guideStep1Desc;
    const gStep2Title = document.getElementById('guide-step2-title');
    if (gStep2Title) gStep2Title.textContent = t.guideStep2Title;
    const gStep2Desc = document.getElementById('guide-step2-desc');
    if (gStep2Desc) gStep2Desc.textContent = t.guideStep2Desc;
    const gStep3Title = document.getElementById('guide-step3-title');
    if (gStep3Title) gStep3Title.textContent = t.guideStep3Title;
    const gStep3Desc = document.getElementById('guide-step3-desc');
    if (gStep3Desc) gStep3Desc.textContent = t.guideStep3Desc;
    const gQuickLabel = document.getElementById('guide-quick-label');
    if (gQuickLabel) gQuickLabel.textContent = t.guideQuickLabel;
    const gGotIt = document.getElementById('guide-got-it-text');
    if (gGotIt) gGotIt.textContent = t.guideGotItBtn;
    const gHelpBtnText = document.getElementById('group-help-btn-text');
    if (gHelpBtnText) gHelpBtnText.textContent = t.guideHelpBtn;
    const gTabsHint = document.getElementById('group-tabs-hint-text');
    if (gTabsHint) gTabsHint.textContent = t.groupTabsHint;

    // Calendar & Navigation elements
    const calBtnText = document.getElementById('calendar-btn-text');
    if (calBtnText) calBtnText.textContent = t.calendarBtnText;
    const calModalTitle = document.getElementById('calendar-modal-title');
    if (calModalTitle) calModalTitle.textContent = t.calendarModalTitle;
    const calModalSubtitle = document.getElementById('calendar-modal-subtitle');
    if (calModalSubtitle) calModalSubtitle.textContent = t.calendarModalSubtitle;
    const calTabOctText = document.getElementById('cal-tab-oct-text');
    if (calTabOctText) calTabOctText.textContent = t.calendarTabOct;
    const calTabNovText = document.getElementById('cal-tab-nov-text');
    if (calTabNovText) calTabNovText.textContent = t.calendarTabNov;

    // Safety Alert Modal elements
    const safetyModalTitle = document.getElementById('safety-alert-title');
    if (safetyModalTitle) safetyModalTitle.textContent = t.safetyAlertModalTitle;
    const safetyModalSubtitle = document.getElementById('safety-alert-subtitle');
    if (safetyModalSubtitle) safetyModalSubtitle.textContent = t.safetyAlertModalSubtitle;
    const safetyModalDesc = document.getElementById('safety-alert-desc');
    if (safetyModalDesc) safetyModalDesc.textContent = t.safetyAlertModalText;
    const safetyAckText = document.getElementById('safety-alert-ack-text');
    if (safetyAckText) safetyAckText.textContent = t.safetyAlertAckBtn;

    // FAQ elements
    const faqTitleEl = document.getElementById('faq-title');
    if (faqTitleEl) faqTitleEl.textContent = t.faqTitle;
    const faqSubtitleEl = document.getElementById('faq-subtitle');
    if (faqSubtitleEl) faqSubtitleEl.textContent = t.faqSubtitle;
    const faqQ1El = document.getElementById('faq-q1');
    if (faqQ1El) faqQ1El.textContent = t.faqQ1;
    const faqA1El = document.getElementById('faq-a1');
    if (faqA1El) faqA1El.textContent = t.faqA1;
    const faqQ2El = document.getElementById('faq-q2');
    if (faqQ2El) faqQ2El.textContent = t.faqQ2;
    const faqA2El = document.getElementById('faq-a2');
    if (faqA2El) faqA2El.textContent = t.faqA2;
    const faqQ3El = document.getElementById('faq-q3');
    if (faqQ3El) faqQ3El.textContent = t.faqQ3;
    const faqA3El = document.getElementById('faq-a3');
    if (faqA3El) faqA3El.textContent = t.faqA3;
    const faqQ4El = document.getElementById('faq-q4');
    if (faqQ4El) faqQ4El.textContent = t.faqQ4;
    const faqA4El = document.getElementById('faq-a4');
    if (faqA4El) faqA4El.innerHTML = t.faqA4;

    populateWelcomeGroupSelect();
    populateWelcomeGroupGrid();
    updateGuideQuickButtons();
    updateVersionBadgeUI();

    // Re-render schedule and active state
    if (currentGroup) {
        updateFullDisplay();
        renderScheduleList(currentGroup, getMyanmarTime());
    }
}

/**
 * Theme Engine (Light, Dark, System)
 */
function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('ygn_theme', theme);

    const isDark = (theme === 'dark') ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
        document.documentElement.classList.add('dark');
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#0f172a');
        document.getElementById('theme-icon').className = 'fas fa-sun';
    } else {
        document.documentElement.classList.remove('dark');
        document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#1d4ed8');
        document.getElementById('theme-icon').className = 'fas fa-moon';
    }
}

function toggleTheme() {
    if (document.documentElement.classList.contains('dark')) {
        applyTheme('light');
        SelfAnalytics.recordThemeSelection('light');
    } else {
        applyTheme('dark');
        SelfAnalytics.recordThemeSelection('dark');
    }
}

/**
 * Renders the 24-Hour Visual Daily Timeline Bar (Proportionally adapted to active version)
 */
function renderTimeline(group, mmNow) {
    const config = SCHEDULE_VERSIONS[currentVersionId];
    const container = document.getElementById('timeline-bar');
    const needle = document.getElementById('timeline-needle');
    const needleLabel = document.getElementById('timeline-needle-label');
    if (!container || !needle || !needleLabel) return;

    // Proportional grid columns based on slot durations
    // Oct 2026: 4h, 4h, 4h, 4h, 8h => 1fr 1fr 1fr 1fr 2fr
    // Apr 2025: 4h x 6 => repeat(6, 1fr)
    if (currentVersionId === '2026-10') {
        container.style.gridTemplateColumns = '1fr 1fr 1fr 1fr 2fr';
    } else {
        container.style.gridTemplateColumns = 'repeat(6, 1fr)';
    }

    const adjustedDate = new Date(mmNow);
    if (mmNow.getHours() < 5) {
        adjustedDate.setDate(adjustedDate.getDate() - 1);
    }
    const pattern = getSchedulePatternForDate(formatDateKey(adjustedDate));

    container.innerHTML = '';

    config.timeSlots.forEach((slot, index) => {
        const groups = pattern[index].split("+");
        const hasPower = groups.includes(group);

        const seg = document.createElement('div');
        seg.className = `timeline-segment ${hasPower ? 'is-power-on' : 'is-power-off'}`;
        seg.setAttribute('role', 'cell');
        seg.setAttribute('aria-label', `${slot.label}: ${hasPower ? I18N[currentLang].timelineLegendOn : I18N[currentLang].timelineLegendOff}`);

        let labelExtra = hasPower ? '⚡' : '✖';
        if (slot.isNoLoadshed) labelExtra = '⚡ No Loadshed';

        seg.innerHTML = `<span>${slot.start}</span><span style="font-size:0.6rem; opacity:0.85;">${labelExtra}</span>`;
        container.appendChild(seg);
    });

    // Needle position (5:00 AM = 0%, next day 5:00 AM = 100%)
    const currentH = mmNow.getHours();
    const currentM = mmNow.getMinutes();
    let minsSince5AM = (currentH >= 5)
        ? ((currentH - 5) * 60 + currentM)
        : ((currentH + 19) * 60 + currentM);

    let percentage = (minsSince5AM / (24 * 60)) * 100;
    percentage = Math.max(0, Math.min(100, percentage));

    needle.style.left = `${percentage}%`;
    const timeDisplay = `${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}`;
    needleLabel.textContent = `${I18N[currentLang].currentTime} (${timeDisplay})`;
}

/**
 * Updates Schedule list for selected day offset (Supports Oct & Nov 2026 range)
 */
function renderScheduleList(group, mmNow) {
    const config = SCHEDULE_VERSIONS[currentVersionId];
    const targetDate = new Date(mmNow);
    targetDate.setDate(mmNow.getDate() + dayOffset);
    const dateKey = formatDateKey(targetDate);
    const pattern = getSchedulePatternForDate(dateKey);

    const titleEl = document.getElementById('schedule-title');
    const subTitleEl = document.getElementById('schedule-subtitle');
    const listEl = document.getElementById('schedule-list');
    const t = I18N[currentLang];
    if (!titleEl || !subTitleEl || !listEl) return;

    if (dayOffset === 0) {
        titleEl.textContent = t.today;
    } else if (dayOffset === -1) {
        titleEl.textContent = t.yesterday;
    } else if (dayOffset === 1) {
        titleEl.textContent = t.tomorrow;
    } else {
        const dateFormatted = targetDate.toLocaleDateString(currentLang === 'my' ? 'my-MM' : 'en-US', { month: 'short', day: 'numeric' });
        titleEl.textContent = `${t.dailySchedule} - ${dateFormatted}`;
    }

    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    subTitleEl.textContent = targetDate.toLocaleDateString(currentLang === 'my' ? 'my-MM' : 'en-US', options);

    // Dynamic Previous & Next day button labels for improved visibility
    const prevBtnText = document.getElementById('prev-day-btn-text');
    const nextBtnText = document.getElementById('next-day-btn-text');
    if (prevBtnText) {
        prevBtnText.textContent = (dayOffset === 0) ? t.prevDayYesterday : t.prevDay;
    }
    if (nextBtnText) {
        nextBtnText.textContent = (dayOffset === 0) ? t.nextDayTomorrow : t.nextDay;
    }

    // Return to Today button toggle
    const returnTodayBtn = document.getElementById('return-today-btn');
    if (returnTodayBtn) {
        returnTodayBtn.style.display = (dayOffset === 0) ? 'none' : 'inline-flex';
    }
    const returnTodayText = document.getElementById('return-today-text');
    if (returnTodayText) {
        returnTodayText.textContent = t.returnToday;
    }

    listEl.innerHTML = '';
    config.timeSlots.forEach((slot, index) => {
        const groups = pattern[index].split("+");
        const hasPower = groups.includes(group);

        const li = document.createElement('li');
        li.className = `schedule-item ${hasPower ? 'on' : 'off'}`;

        let extraBadgeNote = "";
        if (slot.isNoLoadshed) {
            const cleanNote = t.noLoadshedNote.replace(/^[⚡\s]+/, '');
            extraBadgeNote = `
                <div class="schedule-subnote">
                    <i class="fas fa-bolt schedule-row-icon" aria-hidden="true"></i>
                    <span class="schedule-subnote-text">${cleanNote}</span>
                </div>
            `;
        }

        li.innerHTML = `
            <div class="schedule-item-info">
                <div class="schedule-item-time">
                    <i class="far fa-clock schedule-row-icon" aria-hidden="true"></i>
                    <span class="schedule-time-range">${slot.label}</span>
                </div>
                ${extraBadgeNote}
            </div>
            <span class="schedule-item-badge">
                <i class="fas ${hasPower ? 'fa-bolt' : 'fa-power-off'}" aria-hidden="true"></i>
                <span>${hasPower ? t.availableBadge : t.outageBadge}</span>
            </span>
        `;
        listEl.appendChild(li);
    });

    const prevBtn = document.getElementById('prev-day-btn');
    const nextBtn = document.getElementById('next-day-btn');
    // Navigation bounds: 2026-10-01 to 2026-11-30
    const minDate = new Date(2026, 9, 1);
    const maxDate = new Date(2026, 10, 30);
    const testPrev = new Date(targetDate);
    testPrev.setDate(testPrev.getDate() - 1);
    testPrev.setHours(0, 0, 0, 0);
    const testNext = new Date(targetDate);
    testNext.setDate(testNext.getDate() + 1);
    testNext.setHours(0, 0, 0, 0);

    if (prevBtn) prevBtn.disabled = (testPrev < minDate);
    if (nextBtn) nextBtn.disabled = (testNext > maxDate);
}

/**
 * Renders Calendar View Modal (Two Months: October & November 2026)
 */
function renderCalendarUI(monthIndex = calendarActiveMonth) {
    calendarActiveMonth = monthIndex;
    const gridEl = document.getElementById('calendar-days-grid');
    if (!gridEl) return;

    const t = I18N[currentLang];
    const isEn = (currentLang === 'en');
    const mmNow = getMyanmarTime();
    const todayYear = mmNow.getFullYear();
    const todayMonth = mmNow.getMonth();
    const todayDate = mmNow.getDate();

    // Update active tab buttons
    const tabOct = document.getElementById('cal-tab-oct');
    const tabNov = document.getElementById('cal-tab-nov');
    if (tabOct) tabOct.className = `calendar-month-tab ${monthIndex === 9 ? 'is-active' : ''}`;
    if (tabNov) tabNov.className = `calendar-month-tab ${monthIndex === 10 ? 'is-active' : ''}`;

    // Update group info banner
    const groupInfoEl = document.getElementById('cal-info-group');
    if (groupInfoEl) {
        groupInfoEl.innerHTML = `${t.groupLabel} <strong>${currentGroup === 'A' ? t.groupA : t.groupB}</strong>`;
    }
    const noticeEl = document.getElementById('cal-info-notice');
    if (noticeEl) noticeEl.textContent = t.calendarPrompt;

    // Weekdays header
    const weekdaysEl = document.getElementById('calendar-weekdays');
    if (weekdaysEl) {
        const days = isEn
            ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            : ['တနင်္ဂနွေ', 'တနင်္လာ', 'အင်္ဂါ', 'ဗုဒ္ဓဟူး', 'ကြာသပတေး', 'သောကြာ', 'စနေ'];
        weekdaysEl.innerHTML = days.map(d => `<span>${d}</span>`).join('');
    }

    gridEl.innerHTML = '';
    const year = 2026;
    const firstDay = new Date(year, monthIndex, 1).getDay(); // 0 = Sun
    const daysInMonth = (monthIndex === 9) ? 31 : 30; // Oct = 31, Nov = 30

    // Leading empty cells
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-day-cell is-empty';
        gridEl.appendChild(emptyCell);
    }

    // Generate days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const cellDate = new Date(year, monthIndex, day);
        const dateKey = formatDateKey(cellDate);
        const pattern = getSchedulePatternForDate(dateKey, '2026-10');

        // Check slots for currentGroup (Slot 0 is 05:00-09:00, Slot 1 is 09:00-13:00)
        const has5amPower = pattern[0].split('+').includes(currentGroup);
        const has9amPower = pattern[1].split('+').includes(currentGroup);

        const isToday = (year === todayYear && monthIndex === todayMonth && day === todayDate);

        // Check if matches currently selected day
        const curTarget = new Date(mmNow);
        curTarget.setDate(mmNow.getDate() + dayOffset);
        const isSelected = (curTarget.getFullYear() === year && curTarget.getMonth() === monthIndex && curTarget.getDate() === day);

        const cell = document.createElement('div');
        cell.className = `calendar-day-cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}`;
        cell.setAttribute('role', 'button');
        cell.setAttribute('tabindex', '0');
        cell.setAttribute('aria-label', `${dateKey}, ${isToday ? 'Today' : ''}`);

        let chipHtml = '';
        if (has5amPower) {
            chipHtml = `<span class="cal-power-chip slot-5am"><span class="cal-chip-time">05:00</span><span class="cal-chip-status">${t.calendarPowerOnBadge}</span></span>`;
        } else if (has9amPower) {
            chipHtml = `<span class="cal-power-chip slot-9am"><span class="cal-chip-time">09:00</span><span class="cal-chip-status">${t.calendarPowerOnBadge}</span></span>`;
        }

        cell.innerHTML = `
            <div class="cal-day-header">
                <span class="cal-day-num">${day}</span>
                ${isToday ? `<span class="cal-today-pill">${isEn ? 'TODAY' : 'ယနေ့'}</span>` : ''}
            </div>
            ${chipHtml}
        `;

        cell.addEventListener('click', () => {
            const mmToday = getMyanmarTime();
            mmToday.setHours(0, 0, 0, 0);
            const targetMidnight = new Date(year, monthIndex, day);
            targetMidnight.setHours(0, 0, 0, 0);
            const diffDays = Math.round((targetMidnight - mmToday) / 86400000);
            dayOffset = diffDays;
            renderScheduleList(currentGroup, getMyanmarTime());
            closeModal('calendar-modal');
        });

        gridEl.appendChild(cell);
    }
}

/**
 * Checks and opens Safety & Medical Notice Alert Box for first-time users
 */
function checkSafetyAlertNotice() {
    const isAcknowledged = localStorage.getItem('ygn_safety_acknowledged');
    if (!isAcknowledged) {
        openModal('safety-alert-modal');
    }
}

/**
 * Refreshes full display (Called every second for countdown and upon interactions)
 */
function updateFullDisplay() {
    if (!currentGroup) return;

    const mmNow = getMyanmarTime();
    const t = I18N[currentLang];
    const { hasPower, isNoLoadshed, currentSlot, hours, minutes, seconds, totalSeconds, totalWindowSeconds } = calculateCountdown(currentGroup);

    // 1. Status Card
    const statusCard = document.getElementById('status-card');
    const statusPill = document.getElementById('status-pill');
    const statusText = document.getElementById('status-main-text');
    const statusSub = document.getElementById('status-sub-text');

    if (statusCard && statusPill && statusText && statusSub) {
        if (hasPower) {
            statusCard.className = 'card status-card status-on area-status';
            statusPill.innerHTML = `<i class="fas fa-bolt" aria-hidden="true"></i> <span>${t.statusOn}</span>`;
            statusText.textContent = `${t.groupLabel} ${currentGroup} - ${t.statusOn}`;
            if (currentSlot && currentSlot.start === "17:00" && currentSlot.end === "21:00") {
                statusSub.textContent = t.statusSubContinuesNight || t.statusSubOn;
            } else if (isNoLoadshed) {
                statusSub.textContent = t.statusSubNoLoadshed;
            } else {
                statusSub.textContent = t.statusSubOn;
            }
        } else {
            statusCard.className = 'card status-card status-off area-status';
            statusPill.innerHTML = `<i class="fas fa-power-off" aria-hidden="true"></i> <span>${t.statusOff}</span>`;
            statusText.textContent = `${t.groupLabel} ${currentGroup} - ${t.statusOff}`;
            statusSub.textContent = t.statusSubOff;
        }
    }

    // Accessible Screen Reader Announcement
    const currentStatusSignature = `${currentGroup}-${hasPower}-${currentVersionId}`;
    if (lastAnnouncedStatus !== currentStatusSignature) {
        lastAnnouncedStatus = currentStatusSignature;
        const liveRegion = document.getElementById('a11y-live-status');
        if (liveRegion) {
            liveRegion.textContent = hasPower
                ? `${t.groupLabel} ${currentGroup}: ${t.statusOn}`
                : `${t.groupLabel} ${currentGroup}: ${t.statusOff}`;
        }
    }

    // 2. Countdown Digits
    const countdownTitle = document.getElementById('countdown-title-text');
    const digitsEl = document.getElementById('countdown-digits');
    const progressFill = document.getElementById('progress-fill');

    if (countdownTitle) countdownTitle.textContent = hasPower ? t.countdownUntilOff : t.countdownUntilOn;
    if (digitsEl) digitsEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    if (progressFill) {
        const maxWindow = (totalWindowSeconds && totalWindowSeconds > 0)
            ? totalWindowSeconds
            : (hasPower ? ((currentSlot && currentSlot.hours) ? (currentSlot.hours * 3600) : (4 * 3600)) : (4 * 3600));
        const progressPct = Math.max(0, Math.min(100, ((maxWindow - totalSeconds) / maxWindow) * 100));
        progressFill.style.width = `${progressPct}%`;
        progressFill.setAttribute('aria-valuenow', Math.round(progressPct));
    }

    // 3. Timeline
    renderTimeline(currentGroup, mmNow);

    // 4. Update Tab Selection state
    ['A', 'B', 'C'].forEach(g => {
        const btn = document.getElementById(`tab-group-${g.toLowerCase()}`);
        if (btn) {
            const isSelected = (g === currentGroup);
            btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        }
    });

    // 5. Offline caching
    try {
        if (statusText) localStorage.setItem('ygn_last_status', statusText.textContent);
        if (digitsEl) localStorage.setItem('ygn_last_timer', digitsEl.textContent);
    } catch (e) { }
}

/**
 * Changes active group
 */
function selectGroup(group) {
    currentGroup = group;
    localStorage.setItem('selectedGroup', group);
    SelfAnalytics.recordGroupSelection(group);
    updateFullDisplay();
    renderScheduleList(group, getMyanmarTime());
    updateGuideQuickButtons();
}

/**
 * Renders the Version & History Modal
 */
function renderVersionHistoryModal() {
    const container = document.getElementById('version-modal-content');
    if (!container) return;

    const t = I18N[currentLang];
    const isEn = (currentLang === 'en');

    let html = `
        <p style="font-size:0.8125rem; color:var(--text-muted); line-height:1.45; margin-bottom:0.75rem;">
            ${t.versionModalDesc}
        </p>
        <div class="version-cards-list">
    `;

    Object.values(SCHEDULE_VERSIONS).forEach(v => {
        const isSelected = (v.id === currentVersionId);
        const isCurrentlyActive = (v.status === 'active');
        const title = isEn ? v.nameEn : v.nameMm;
        const summary = isEn ? v.summaryEn : v.summaryMm;
        const authority = isEn ? v.authorityEn : v.authorityMm;

        html += `
            <div class="version-card ${isSelected ? 'is-active' : ''}">
                <div class="version-card-header">
                    <div>
                        <h3 class="version-card-title">${title}</h3>
                        <p style="font-size:0.75rem; color:var(--text-muted); margin-top:0.15rem;">${authority}</p>
                    </div>
                    <span class="version-status-pill ${isCurrentlyActive ? 'active' : 'archive'}">
                        ${isCurrentlyActive ? t.versionActiveBadge : t.versionArchiveBadge}
                    </span>
                </div>
                
                <p class="version-card-desc">${summary}</p>
                
                <div class="version-card-specs">
                    <span class="version-spec-chip"><i class="fas fa-users"></i> ${v.groups.join(', ')} (${v.groups.length} Groups)</span>
                    <span class="version-spec-chip"><i class="fas fa-clock"></i> ${v.timeSlots.length} Daily Intervals</span>
                    ${v.id === '2026-10' ? `<span class="version-spec-chip" style="color:#059669;"><i class="fas fa-moon"></i> Overnight No Loadshed</span>` : ''}
                </div>

                <div style="margin-top:0.5rem;">
                    ${isSelected ? `
                        <div style="font-size:0.8125rem; font-weight:700; color:var(--brand-primary); display:flex; align-items:center; gap:0.35rem;">
                            <i class="fas fa-check-circle"></i> ${t.currentActiveVersionText}
                        </div>
                    ` : `
                        <button class="btn btn-primary switch-version-btn" data-version="${v.id}" style="width:100%; font-size:0.8125rem; padding:0.5rem;">
                            <i class="fas fa-sync-alt"></i> ${t.switchVersionBtn}
                        </button>
                    `}
                </div>
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;

    // Attach switch buttons
    container.querySelectorAll('.switch-version-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetVersion = btn.getAttribute('data-version');
            setScheduleVersion(targetVersion);
            closeModal('version-modal');
        });
    });
}

// ============================================================================
// 7. MODAL DIALOGS (WCAG 2.2 Compliant Focus-Trap and ESC handling)
// ============================================================================

function openModal(modalId, triggerElement) {
    const dialog = document.getElementById(modalId);
    if (!dialog) return;

    if (typeof dialog.showModal === 'function') {
        dialog.showModal();
    } else {
        dialog.setAttribute('open', '');
    }

    dialog.addEventListener('click', function onBackdropClick(e) {
        const rect = dialog.getBoundingClientRect();
        const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
            && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
        if (!isInDialog) {
            closeModal(modalId, triggerElement);
            dialog.removeEventListener('click', onBackdropClick);
        }
    });
}

function closeModal(modalId, returnFocusElement) {
    const dialog = document.getElementById(modalId);
    if (!dialog) return;

    if (typeof dialog.close === 'function') {
        dialog.close();
    } else {
        dialog.removeAttribute('open');
    }

    if (returnFocusElement && typeof returnFocusElement.focus === 'function') {
        returnFocusElement.focus();
    }
}

// ============================================================================
// 8. INITIALIZATION & EVENT LISTENERS
// ============================================================================

window.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Theme, Language & Schedule Version
    applyTheme(currentTheme);
    setLanguage(currentLang);
    updateGroupTabsVisibility();
    updateVersionBadgeUI();

    // 2. Record First-Party Analytics App Launch
    SelfAnalytics.recordAppLaunch(!navigator.onLine);

    // Watch OS Theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (currentTheme === 'system') applyTheme('system');
    });

    // 3. Offline / Online event listeners
    const offlineBanner = document.getElementById('offline-banner');
    function updateOnlineStatus() {
        if (navigator.onLine) {
            if (offlineBanner) offlineBanner.classList.remove('visible');
        } else {
            if (offlineBanner) offlineBanner.classList.add('visible');
            SelfAnalytics.recordAppLaunch(true);
        }
    }
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    // 4. Group Selection Tabs
    ['a', 'b', 'c'].forEach(g => {
        const btn = document.getElementById(`tab-group-${g}`);
        if (btn) {
            btn.addEventListener('click', () => {
                selectGroup(g.toUpperCase());
            });
        }
    });

    // 5. Day Navigation
    const prevBtn = document.getElementById('prev-day-btn');
    const nextBtn = document.getElementById('next-day-btn');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const mmNow = getMyanmarTime();
            const curDate = new Date(mmNow);
            curDate.setDate(mmNow.getDate() + dayOffset - 1);
            curDate.setHours(0, 0, 0, 0);
            if (curDate >= new Date(2026, 9, 1)) {
                dayOffset--;
                SelfAnalytics.recordDayNavigation(dayOffset);
                renderScheduleList(currentGroup, getMyanmarTime());
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const mmNow = getMyanmarTime();
            const curDate = new Date(mmNow);
            curDate.setDate(mmNow.getDate() + dayOffset + 1);
            curDate.setHours(0, 0, 0, 0);
            if (curDate <= new Date(2026, 10, 30)) {
                dayOffset++;
                SelfAnalytics.recordDayNavigation(dayOffset);
                renderScheduleList(currentGroup, getMyanmarTime());
            }
        });
    }

    // Return to Today Button
    const returnTodayBtn = document.getElementById('return-today-btn');
    if (returnTodayBtn) {
        returnTodayBtn.addEventListener('click', () => {
            dayOffset = 0;
            renderScheduleList(currentGroup, getMyanmarTime());
        });
    }

    // Calendar Modal Button & Month Tabs
    const calendarToggleBtn = document.getElementById('calendar-toggle-btn');
    if (calendarToggleBtn) {
        calendarToggleBtn.addEventListener('click', () => {
            renderCalendarUI(calendarActiveMonth);
            openModal('calendar-modal', calendarToggleBtn);
        });
    }

    document.getElementById('cal-tab-oct')?.addEventListener('click', () => renderCalendarUI(9));
    document.getElementById('cal-tab-nov')?.addEventListener('click', () => renderCalendarUI(10));

    // Safety Alert Modal Handlers
    const safetyAckBtn = document.getElementById('safety-alert-ack-btn');
    if (safetyAckBtn) {
        safetyAckBtn.addEventListener('click', () => {
            localStorage.setItem('ygn_safety_acknowledged', 'true');
            closeModal('safety-alert-modal');
        });
    }

    const safetyCard = document.querySelector('.safety-alert');
    if (safetyCard) {
        safetyCard.addEventListener('click', () => {
            openModal('safety-alert-modal');
        });
    }

    // 6. Header Control Buttons
    const langBtn = document.getElementById('lang-toggle-btn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'my' : 'en';
            setLanguage(newLang);
            SelfAnalytics.recordLanguageSelection(newLang);
        });
    }

    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            toggleTheme();
        });
    }

    // 7. Version & History Modal Buttons
    const versionBadgeBtn = document.getElementById('version-badge-btn');
    if (versionBadgeBtn) {
        versionBadgeBtn.addEventListener('click', () => {
            renderVersionHistoryModal();
            openModal('version-modal', versionBadgeBtn);
        });
    }

    const versionHistoryBtn = document.getElementById('version-history-btn');
    if (versionHistoryBtn) {
        versionHistoryBtn.addEventListener('click', () => {
            renderVersionHistoryModal();
            openModal('version-modal', versionHistoryBtn);
        });
    }

    // 8. Self Analytics Dashboard Modal Button
    const analyticsBtn = document.getElementById('analytics-btn');
    if (analyticsBtn) {
        analyticsBtn.addEventListener('click', () => {
            SelfAnalytics.renderDashboard();
            openModal('analytics-modal', analyticsBtn);
        });
    }

    // 9. Emergency & Safety Modals
    const emergencyActionBtn = document.getElementById('emergency-action-btn');
    if (emergencyActionBtn) {
        emergencyActionBtn.addEventListener('click', () => {
            SelfAnalytics.recordHotlineClick();
        });
    }

    const safetyTipsBtn = document.getElementById('safety-tips-btn');
    if (safetyTipsBtn) {
        safetyTipsBtn.addEventListener('click', () => {
            document.getElementById('info-modal-title').textContent = I18N[currentLang].emergencyTitle;
            document.getElementById('info-modal-content').innerHTML = I18N[currentLang].emergencyBody;
            openModal('info-modal', safetyTipsBtn);
        });
    }

    // 10. Settings & Privacy Modal
    const privacyLink = document.getElementById('privacy-link');
    if (privacyLink) {
        privacyLink.addEventListener('click', () => {
            document.getElementById('settings-modal-title').textContent = I18N[currentLang].settingsTitle;
            document.getElementById('settings-modal-content').innerHTML = I18N[currentLang].settingsBody;

            document.getElementById('set-theme-light')?.addEventListener('click', () => applyTheme('light'));
            document.getElementById('set-theme-dark')?.addEventListener('click', () => applyTheme('dark'));
            document.getElementById('set-theme-system')?.addEventListener('click', () => applyTheme('system'));

            document.getElementById('clear-data-btn')?.addEventListener('click', () => {
                if (confirm(I18N[currentLang].dataResetSuccess)) {
                    localStorage.clear();
                    window.location.reload();
                }
            });

            openModal('settings-modal', privacyLink);
        });
    }

    // Close buttons for modals
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('dialog');
            if (modal) closeModal(modal.id);
        });
    });

    // 11. First-Time User Guide & Welcome Modal Initialization
    const guideBox = document.getElementById('first-user-guide');
    if (localStorage.getItem('ygn_guide_dismissed') === 'true') {
        guideBox?.classList.add('is-hidden');
    } else {
        guideBox?.classList.remove('is-hidden');
    }

    document.getElementById('guide-dismiss-btn')?.addEventListener('click', dismissGuideBox);
    document.getElementById('guide-got-it-btn')?.addEventListener('click', dismissGuideBox);
    document.getElementById('group-help-btn')?.addEventListener('click', showGuideBox);

    populateWelcomeGroupSelect();
    populateWelcomeGroupGrid();
    updateGuideQuickButtons();

    const hasStoredGroup = localStorage.getItem('selectedGroup');
    if (!hasStoredGroup) {
        openModal('welcome-modal');

        const welcomeConfirm = document.getElementById('welcome-confirm-btn');
        if (welcomeConfirm) {
            welcomeConfirm.addEventListener('click', () => {
                const sel = document.getElementById('welcome-group-select').value;
                if (sel) {
                    selectGroup(sel);
                    closeModal('welcome-modal');
                    checkSafetyAlertNotice();
                }
            });
        }

        const welcomeLaterBtn = document.getElementById('welcome-later-btn');
        if (welcomeLaterBtn) {
            welcomeLaterBtn.addEventListener('click', () => {
                selectGroup('A');
                localStorage.setItem('ygn_group_deferred', 'true');
                closeModal('welcome-modal');
                showGuideBox();
                checkSafetyAlertNotice();
            });
        }

        const welcomeCloseBtn = document.getElementById('welcome-close-btn');
        if (welcomeCloseBtn) {
            welcomeCloseBtn.addEventListener('click', () => {
                if (!localStorage.getItem('selectedGroup')) {
                    selectGroup('A');
                    localStorage.setItem('ygn_group_deferred', 'true');
                    showGuideBox();
                    checkSafetyAlertNotice();
                }
            });
        }
    } else {
        selectGroup(currentGroup);
        checkSafetyAlertNotice();
    }

    // 12. Owner Admin Mode & Secret Backdoor (5-click on brand badge or ?admin URL)
    if (window.location.search.includes('admin')) {
        const aBtn = document.getElementById('analytics-btn');
        if (aBtn) aBtn.style.display = 'inline-flex';
    }

    let brandClicks = 0;
    let brandTimer = null;
    const brandBadge = document.querySelector('.brand-badge');
    if (brandBadge) {
        brandBadge.style.cursor = 'pointer';
        brandBadge.title = "YESC Tracker";
        brandBadge.addEventListener('click', () => {
            brandClicks++;
            clearTimeout(brandTimer);
            brandTimer = setTimeout(() => { brandClicks = 0; }, 2500);
            if (brandClicks >= 5) {
                window.location.href = 'admin.html';
            }
        });
    }

    // Ping centralized server telemetry anonymously
    pingServerAnalytics();

    // 13. Live Interval Loop (Updates countdown digits and needle every second)
    setInterval(() => {
        if (currentGroup) {
            updateFullDisplay();
        }
    }, 1000);
});