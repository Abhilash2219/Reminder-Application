const reminders = [];
let selectedTime = { hour: 12, minute: 0 };
let draggingHand = null;

function setTime(hour, minute) {
    selectedTime.hour = hour;
    selectedTime.minute = minute;
    document.getElementById('hour-display').textContent = hour.toString().padStart(2, '0');
    document.getElementById('minute-display').textContent = minute.toString().padStart(2, '0');
    updateClockHands();
}

function addReminder() {
    const day = document.getElementById('day').value;
    const activity = document.getElementById('activity').value;
    
    const reminderTime = `${day} ${formatTime(selectedTime.hour, selectedTime.minute)}`;
    reminders.push({ time: reminderTime, activity });
    
    displayReminders();
    startReminderCheck();
}

function formatTime(hour, minute) {
    let period = 'AM';
    if (hour >= 12) {
        period = 'PM';
        if (hour > 12) hour -= 12;
    }
    if (hour === 0) hour = 12;
    return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
}

function displayReminders() {
    const remindersList = document.getElementById('remindersList');
    remindersList.innerHTML = '';
    reminders.forEach((reminder, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${reminder.time} - ${reminder.activity}`;
        remindersList.appendChild(listItem);
    });
}

function startReminderCheck() {
    setInterval(() => {
        const currentTime = new Date().toLocaleString('en-US', { weekday: 'long', hour: '2-digit', minute: '2-digit', hour12: true });
        reminders.forEach((reminder, index) => {
            if (currentTime === reminder.time) {
                playChime();
                deleteReminder(index);
            }
        });
    }, 60000); // Check every minute
}

function deleteReminder(index) {
    reminders.splice(index, 1);
    displayReminders();
}

function playChime() {
    const audio = new Audio('alarm.mp3'); // Replace with your chime sound file
    audio.play().catch(error => {
        console.error('Error playing sound:', error);
    });
}



function updateClockHands() {
    const hourAngle = (selectedTime.hour % 12) * 30 + selectedTime.minute * 0.5;
    const minuteAngle = selectedTime.minute * 6;

    document.getElementById('hour-hand').style.transform = `rotate(${hourAngle}deg)`;
    document.getElementById('minute-hand').style.transform = `rotate(${minuteAngle}deg)`;
}

function updateDigitalClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('digitalClock').textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateDigitalClock, 1000); // Update the digital clock every second

document.getElementById('clock').addEventListener('mousedown', function(event) {
    const rect = this.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    const minute = Math.round(angle / 6);
    const hour = Math.round(angle / 30);

    if (minute < 0) minute += 60;
    if (hour < 0) hour += 12;

    const hourAngle = (selectedTime.hour % 12) * 30 + selectedTime.minute * 0.5;
    const minuteAngle = selectedTime.minute * 6;
    
    const hourHandRect = document.getElementById('hour-hand').getBoundingClientRect();
    const minuteHandRect = document.getElementById('minute-hand').getBoundingClientRect();

    if (Math.abs(minuteAngle - angle) <= 5) {
        draggingHand = 'minute';
    } else if (Math.abs(hourAngle - angle) <= 15) {
        draggingHand = 'hour';
    }
});

document.getElementById('clock').addEventListener('mousemove', function(event) {
    if (draggingHand) {
        const rect = this.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        const angle = Math.atan2(y, x) * (180 / Math.PI) + 90;

        if (draggingHand === 'minute') {
            const minute = Math.round(angle / 6);
            selectedTime.minute = (minute + 60) % 60;
            document.getElementById('minute-display').textContent = selectedTime.minute.toString().padStart(2, '0');
        } else if (draggingHand === 'hour') {
            const hour = Math.round(angle / 30);
            selectedTime.hour = (hour + 12) % 12;
            document.getElementById('hour-display').textContent = selectedTime.hour.toString().padStart(2, '0');
        }
        updateClockHands();
    }
});

document.addEventListener('mouseup', function() {
    draggingHand = null;
});

updateClockHands();
