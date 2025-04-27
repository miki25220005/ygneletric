// Time slots for the day
const timeSlots = [
    { start: "05:00", end: "09:00" },
    { start: "09:00", end: "13:00" },
    { start: "13:00", end: "17:00" },
    { start: "17:00", end: "21:00" },
    { start: "21:00", end: "01:00" },
    { start: "01:00", end: "05:00" }
];

// Base schedule starting from April 1, 2025
const baseSchedule = {
    "2025-04-01": ["", "A", "B", "C", "A", "B+C"],
    "2025-04-02": ["A", "B", "C", "A", "B", "C+A"],
    "2025-04-03": ["B", "C", "A", "B", "C", "A+B"]
};

// Function to get the schedule for any date
function getScheduleForDate(date) {
    const baseDate = new Date("2025-04-01");
    const targetDate = new Date(date);
    const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
    const patternIndex = diffDays % 3;
    const patternDates = Object.keys(baseSchedule);
    return baseSchedule[patternDates[patternIndex]];
}

// Adjust for Myanmar timezone (UTC+6:30)
function getMyanmarTime() {
    const now = new Date();
    const offset = 6.5 * 60; // Myanmar is UTC+6:30
    const localOffset = now.getTimezoneOffset();
    const myanmarTime = new Date(now.getTime() + (offset + localOffset) * 60 * 1000);
    return myanmarTime;
}

// Function to parse time string (HH:MM) to a Date object for comparison
function parseTime(timeStr, baseDate) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
}

// Function to check if a group has electricity at a specific time
function hasElectricity(group, dateTime) {
    const date = dateTime.toISOString().split("T")[0];
    const time = dateTime.toTimeString().split(" ")[0].substring(0, 5);
    const schedule = getScheduleForDate(date);

    let adjustedDate = new Date(dateTime);
    if (time >= "00:00" && time < "05:00") {
        adjustedDate.setDate(adjustedDate.getDate() - 1);
    }
    const adjustedSchedule = getScheduleForDate(adjustedDate.toISOString().split("T")[0]);

    for (let i = 0; i < timeSlots.length; i++) {
        const slot = timeSlots[i];
        let slotStart = slot.start;
        let slotEnd = slot.end;

        if (slotStart > slotEnd) {
            if (time >= slotStart || time < slotEnd) {
                const groups = adjustedSchedule[i].split("+");
                return groups.includes(group);
            }
        } else {
            if (time >= slotStart && time < slotEnd) {
                const groups = schedule[i].split("+");
                return groups.includes(group);
            }
        }
    }
    return false;
}

// Function to get the schedule for a group on a specific day
function getScheduleForDay(group, targetDate) {
    const schedule = getScheduleForDate(targetDate);
    let result = "";
    for (let i = 0; i < timeSlots.length; i++) {
        const slot = timeSlots[i];
        const groups = schedule[i].split("+");
        const hasPower = groups.includes(group);
        const isDarkMode = window.location.pathname.includes("index-dark.html");
        if (isDarkMode) {
            result += `<li class="${hasPower ? 'schedule-on' : 'schedule-off'} p-2 rounded-md">${slot.start} - ${slot.end}: ${hasPower ? 'Electricity Available' : 'No Electricity'}</li>`;
        } else {
            result += `<li class="p-2 rounded-md ${hasPower ? 'bg-blue-50 text-blue-800' : 'bg-red-50 text-red-800'}">${slot.start} - ${slot.end}: ${hasPower ? 'Electricity Available' : 'No Electricity'}</li>`;
        }
    }
    return result;
}

// Function to calculate countdown (either until electricity turns on or off)
function getCountdown(group) {
    const now = getMyanmarTime();
    const date = now.toISOString().split("T")[0];
    const time = now.toTimeString().split(" ")[0].substring(0, 5);
    const schedule = getScheduleForDate(date);

    let currentSlotHasPower = false;
    let currentSlotEnd = null;
    let nextSlotTime = null;
    let currentSlotIndex = -1;

    // Find current slot and check if the group has power
    for (let i = 0; i < timeSlots.length; i++) {
        const slot = timeSlots[i];
        const slotStart = slot.start;
        const slotEnd = slot.end;
        const groups = schedule[i].split("+");

        const startTime = parseTime(slotStart, now);
        let endTime = parseTime(slotEnd, now);
        if (slotEnd < slotStart) {
            endTime.setDate(endTime.getDate() + 1);
        }

        if (now >= startTime && now < endTime) {
            currentSlotHasPower = groups.includes(group);
            currentSlotEnd = slotEnd;
            currentSlotIndex = i;
            break;
        }
    }

    if (currentSlotHasPower) {
        // If power is on, calculate time until it turns off (end of current slot)
        let endTime = parseTime(currentSlotEnd, now);
        if (currentSlotEnd < time) {
            endTime.setDate(endTime.getDate() + 1);
        }
        const diffMs = endTime - now;
        const totalSeconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        return {
            timeUntil: { hours, minutes, seconds, totalSeconds },
            isPowerOn: true
        };
    } else {
        // If power is off, find the next slot where it turns on
        for (let j = (currentSlotIndex + 1) % timeSlots.length, count = 0; count < timeSlots.length; j = (j + 1) % timeSlots.length, count++) {
            const nextGroups = schedule[j].split("+");
            if (nextGroups.includes(group)) {
                nextSlotTime = timeSlots[j].start;
                break;
            }
        }

        // If no slot is found today, check the next day
        if (!nextSlotTime) {
            let nextDay = new Date(now);
            nextDay.setDate(nextDay.getDate() + 1);
            const nextSchedule = getScheduleForDate(nextDay);
            for (let i = 0; i < timeSlots.length; i++) {
                const groups = nextSchedule[i].split("+");
                if (groups.includes(group)) {
                    nextSlotTime = timeSlots[i].start;
                    break;
                }
            }
        }

        let nextTime = parseTime(nextSlotTime, now);
        if (nextSlotTime < time) {
            nextTime.setDate(nextTime.getDate() + 1);
        }

        const diffMs = nextTime - now;
        const totalSeconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        return {
            timeUntil: { hours, minutes, seconds, totalSeconds },
            isPowerOn: false
        };
    }
}

// Function to update the display
function updateDisplay() {
    const group = document.getElementById("group").value;
    if (!group) return; // Do nothing if no group is selected

    const now = getMyanmarTime();
    const isDarkMode = window.location.pathname.includes("index-dark.html");

    // Update status (always based on current time)
    const hasPower = hasElectricity(group, now);
    const statusDiv = document.getElementById("status");
    if (isDarkMode) {
        statusDiv.className = `text-center p-4 rounded-lg mb-6 text-sm font-medium ${hasPower ? 'status-on' : 'status-off'}`;
    } else {
        statusDiv.className = `text-center p-4 rounded-lg mb-6 text-sm font-medium ${hasPower ? 'bg-blue-50 text-blue-800' : 'bg-red-50 text-red-800'}`;
    }
    document.getElementById("status-text").innerHTML = `Group ${group} at ${now.toLocaleString()}:<br>` +
        (hasPower ? "Electricity is Available!" : "No Electricity");

    // Update schedule for the selected day
    updateSchedule(group);

    // Update countdown (always based on current time)
    updateCountdown(group);
}

// Function to update the countdown timer
function updateCountdown(group) {
    const { timeUntil, isPowerOn } = getCountdown(group);
    const timerDiv = document.getElementById("timer");
    const timerProgress = document.getElementById("timer-progress");
    const countdownTitleText = document.getElementById("countdown-title-text");

    // Update countdown title based on whether power is on or off
    countdownTitleText.textContent = isPowerOn ? "Time Until Electricity Turns Off" : "Time Until Next Electricity Slot";

    const { hours, minutes, seconds, totalSeconds } = timeUntil;
    timerDiv.innerHTML = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    // Update progress bar
    const totalSlotDuration = isPowerOn ? (4 * 60 * 60) : (12 * 60 * 60); // 4 hours if on (slot duration), 12 hours if off (max wait)
    const progressPercentage = ((totalSlotDuration - totalSeconds) / totalSlotDuration) * 100;
    timerProgress.style.width = `${progressPercentage}%`;
}

// Track the currently selected day (0 = today, -1 = yesterday, 1 = tomorrow)
let dayOffset = 0;

// Function to update the schedule for the selected day
function updateSchedule(group) {
    const now = getMyanmarTime();
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + dayOffset);

    // Update schedule title
    const scheduleTitle = document.getElementById("schedule-title");
    if (dayOffset === 0) {
        scheduleTitle.textContent = "Today's Schedule";
    } else if (dayOffset === -1) {
        scheduleTitle.textContent = "Yesterday's Schedule";
    } else if (dayOffset === 1) {
        scheduleTitle.textContent = "Tomorrow's Schedule";
    }

    // Update schedule content
    document.getElementById("schedule").innerHTML = getScheduleForDay(group, targetDate);
}

// Initialize group selection and day navigation
window.onload = () => {
    const savedGroup = localStorage.getItem("selectedGroup");
    const groupModal = document.getElementById("group-modal");
    const mainContent = document.getElementById("main-content");
    const groupSelect = document.getElementById("group-select");
    const confirmGroupBtn = document.getElementById("confirm-group");
    const groupDropdown = document.getElementById("group");
    const prevDayBtn = document.getElementById("prev-day");
    const nextDayBtn = document.getElementById("next-day");

    if (savedGroup) {
        // If a group is already saved, show the main content
        groupModal.classList.add("hidden");
        mainContent.classList.remove("hidden");
        groupDropdown.value = savedGroup;
        updateDisplay();
    } else {
        // Show the group selection modal
        groupModal.classList.remove("hidden");
        mainContent.classList.add("hidden");
    }

    // Handle group selection confirmation
    confirmGroupBtn.addEventListener("click", () => {
        const selectedGroup = groupSelect.value;
        if (selectedGroup) {
            localStorage.setItem("selectedGroup", selectedGroup);
            groupModal.classList.add("hidden");
            mainContent.classList.remove("hidden");
            groupDropdown.value = selectedGroup;
            updateDisplay();
        }
    });

    // Handle day navigation
    prevDayBtn.addEventListener("click", () => {
        if (dayOffset > -1) {
            dayOffset--;
            updateSchedule(groupDropdown.value);
        }
    });

    nextDayBtn.addEventListener("click", () => {
        if (dayOffset < 1) {
            dayOffset++;
            updateSchedule(groupDropdown.value);
        }
    });

    // Update display every second for countdown
    setInterval(() => {
        if (!groupModal.classList.contains("hidden")) return; // Don't update if modal is visible
        updateDisplay();
    }, 1000);
};
