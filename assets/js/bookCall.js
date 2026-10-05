
(() => {
  'use strict';

  // =====================================================
  // ELEMENTS
  // =====================================================

  // Supports both Book a Call buttons
  const triggers = [
    ...document.querySelectorAll('.bookCallTrigger')
  ];

  // Fallback for the original trigger ID
  if (!triggers.length) {
    const trigger = document.getElementById('bookCallTrigger');
    if (trigger) triggers.push(trigger);
  }

  const popover = document.getElementById('bookCallPopover');
  const form = document.getElementById('bookCallForm');

  const daysEl = document.getElementById('bookCallDays');
  const monthLabel = document.getElementById('bookCallWeekLabel');

  const prevBtn = document.getElementById('bookCallPrevWeek');
  const nextBtn = document.getElementById('bookCallNextWeek');

  const availabilityLabel = document.getElementById(
    'bookCallAvailabilityLabel'
  );

  const timeGrid = document.getElementById('bookCallTimeSlots');
  const weekendNotice = document.getElementById(
    'bookCallWeekendNotice'
  );

  const submitBtn = document.getElementById('bookCallSubmitBtn');
  const errorEl = document.getElementById('bookCallFormError');

  const successPanel = document.getElementById(
    'bookCallSuccessPanel'
  );

  const closeSuccess = document.getElementById(
    'bookCallCloseSuccess'
  );

  // Thank You section elements
  const confirmedDateEl = document.getElementById(
    'confirmedBookingDate'
  );

  const confirmedTimeEl = document.getElementById(
    'confirmedBookingTime'
  );

  const addCalendarBtn = document.getElementById(
    'bookCallAddToCalendar'
  );

  const nameInput = document.getElementById('bookCallFullName');
  const emailInput = document.getElementById('bookCallEmail');
  const phoneInput = document.getElementById('bookCallPhone');

  // =====================================================
  // CONFIGURATION
  // =====================================================

  const APPOINTMENT_TIME_ZONE = 'America/New_York';
  const APPOINTMENT_TIME_ZONE_LABEL = 'ET';
  const APPOINTMENT_DURATION_MINUTES = 30;

  const availableTimes = [
    '09:00 AM',
    '11:00 AM',
    '02:00 PM',
    '04:00 PM'
  ];

  const monthFmt = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const shortMonthFmt = new Intl.DateTimeFormat('en-US', {
    month: 'short'
  });

  const dayNames = [
    'SUN', 'MON', 'TUE', 'WED',
    'THU', 'FRI', 'SAT'
  ];

  const fullDateFmt = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // =====================================================
  // CHECK REQUIRED ELEMENTS
  // =====================================================

  if (
    !triggers.length ||
    !popover ||
    !form ||
    !daysEl ||
    !monthLabel ||
    !prevBtn ||
    !nextBtn ||
    !availabilityLabel ||
    !timeGrid ||
    !weekendNotice ||
    !submitBtn ||
    !errorEl ||
    !successPanel ||
    !closeSuccess
  ) {
    console.error(
      'Book a Call: Required HTML elements are missing.'
    );
    return;
  }

  // =====================================================
  // STATE
  // =====================================================

  function getMonday(date) {
    const monday = new Date(date);

    monday.setHours(0, 0, 0, 0);

    monday.setDate(
      monday.getDate() - ((monday.getDay() + 6) % 7)
    );

    return monday;
  }

  let weekStart = getMonday(new Date());

  let selectedDate = null;
  let selectedTime = null;

  let closeTimer = null;
  let preserveOpenAfterCalendarSelection = false;
  let submitting = false;

  // =====================================================
  // HELPERS
  // =====================================================

  function isWeekend(date) {
    return date &&
      (date.getDay() === 0 || date.getDay() === 6);
  }

  function sameDate(a, b) {
    return Boolean(
      a &&
      b &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  function clearError() {
    errorEl.textContent = '';
    errorEl.classList.remove('is-visible');
  }

  function showError(message) {
    errorEl.textContent = message;
    errorEl.classList.add('is-visible');
  }

  function updateTriggerState(expanded) {
    triggers.forEach(trigger => {
      trigger.setAttribute(
        'aria-expanded',
        String(expanded)
      );
    });
  }

  function isTriggerHovered() {
    return triggers.some(trigger => trigger.matches(':hover'));
  }

  function isTriggerTarget(target) {
    return triggers.some(trigger =>
      target instanceof Node && trigger.contains(target)
    );
  }

  function isFormFieldFocused() {
    const active = document.activeElement;

    return popover.contains(active) &&
      active.matches(
        'input, textarea, select, button, [contenteditable="true"]'
      );
  }

  // =====================================================
  // POPOVER OPEN / CLOSE
  // =====================================================

  function openPopover() {
    clearTimeout(closeTimer);

    popover.classList.add('is-open');
    updateTriggerState(true);
  }

  function closePopover() {
    clearTimeout(closeTimer);

    popover.classList.remove('is-open');
    updateTriggerState(false);
  }

  function scheduleClose() {
    clearTimeout(closeTimer);

    closeTimer = setTimeout(() => {
      const pointerInside =
        isTriggerHovered() || popover.matches(':hover');

      if (!pointerInside && !isFormFieldFocused()) {
        closePopover();
      }
    }, 220);
  }

  // =====================================================
  // BOOK A CALL TRIGGERS
  // =====================================================

  triggers.forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault();

      clearTimeout(closeTimer);

      if (popover.classList.contains('is-open')) {
        if (popover.contains(document.activeElement)) {
          trigger.focus();
        }

        closePopover();
      } else {
        openPopover();
      }
    });

    // Keyboard support for the paragraph trigger
    if (trigger.tagName === 'P') {
      if (!trigger.hasAttribute('tabindex')) {
        trigger.setAttribute('tabindex', '0');
      }

      trigger.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          trigger.click();
        }
      });
    }

    trigger.addEventListener('mouseenter', () => {
      clearTimeout(closeTimer);
    });

    trigger.addEventListener('mouseleave', scheduleClose);
  });

  // =====================================================
  // POPOVER EVENTS
  // =====================================================

  popover.addEventListener('mouseenter', () => {
    clearTimeout(closeTimer);
  });

  popover.addEventListener('mouseleave', scheduleClose);

  popover.addEventListener('focusin', () => {
    clearTimeout(closeTimer);
  });

  popover.addEventListener('focusout', () => {
    setTimeout(() => {
      if (preserveOpenAfterCalendarSelection) {
        preserveOpenAfterCalendarSelection = false;
        clearTimeout(closeTimer);
        openPopover();
        return;
      }

      if (!isFormFieldFocused()) {
        scheduleClose();
      }
    }, 0);
  });

  // Clicking outside closes the popover
  document.addEventListener('click', event => {
    if (!popover.classList.contains('is-open')) {
      return;
    }

    if (
      !popover.contains(event.target) &&
      !isTriggerTarget(event.target) &&
      !isFormFieldFocused()
    ) {
      closePopover();
    }
  });

  // Escape key closes the popover
  document.addEventListener('keydown', event => {
    if (
      event.key === 'Escape' &&
      popover.classList.contains('is-open')
    ) {
      closePopover();

      const trigger = triggers[0];
      if (trigger) trigger.focus();
    }
  });

  // =====================================================
  // CALENDAR LABEL
  // =====================================================

  function formatWeekLabel(start, end) {
    const sameMonth =
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear();

    if (sameMonth) {
      return monthFmt.format(start).toUpperCase();
    }

    const startLabel =
      `${shortMonthFmt.format(start).toUpperCase()} ${start.getDate()}`;

    const endLabel =
      `${shortMonthFmt.format(end).toUpperCase()} ${end.getDate()}`;

    if (start.getFullYear() === end.getFullYear()) {
      return `${startLabel} – ${endLabel}, ${end.getFullYear()}`;
    }

    return (
      `${startLabel}, ${start.getFullYear()} – ` +
      `${endLabel}, ${end.getFullYear()}`
    );
  }

  // =====================================================
  // RENDER CALENDAR DAYS
  // =====================================================

  function renderDays() {
    daysEl.innerHTML = '';

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    monthLabel.textContent = formatWeekLabel(
      weekStart,
      weekEnd
    );

    // Render the seven dates in the selected week
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);

      const btn = document.createElement('button');

      btn.type = 'button';

      btn.className =
        'day' +
        (isWeekend(date) ? ' weekend' : '') +
        (sameDate(date, selectedDate) ? ' selected' : '');

      btn.setAttribute(
        'aria-pressed',
        String(sameDate(date, selectedDate))
      );

      btn.setAttribute(
        'aria-label',
        fullDateFmt.format(date)
      );

      const dow = document.createElement('span');
      dow.className = 'dow';
      dow.textContent = dayNames[date.getDay()];

      const dayNumber = document.createElement('span');
      dayNumber.className = 'date';
      dayNumber.textContent = date.getDate();

      btn.append(dow, dayNumber);

      btn.addEventListener('click', () => {
        preserveOpenAfterCalendarSelection = true;
        clearTimeout(closeTimer);

        selectedDate = new Date(date);
        selectedTime = null;

        renderDays();
        renderTimes();

        clearError();
        openPopover();
      });

      daysEl.appendChild(btn);
    }

    // Keep previous/next week navigation available
    prevBtn.disabled = false;
    nextBtn.disabled = false;
  }

  // =====================================================
  // RENDER AVAILABLE TIMES
  // =====================================================

  function renderTimes() {
    timeGrid.innerHTML = '';

    const weekend = isWeekend(selectedDate);

    weekendNotice.classList.toggle(
      'is-visible',
      Boolean(weekend)
    );

    // No date selected
    if (!selectedDate) {
      availabilityLabel.textContent =
        'Select a day to see available times';

      [
        '--:-- --',
        '--:-- --',
        '--:-- --',
        '--:-- --'
      ].forEach(time => {
        const btn = document.createElement('button');

        btn.type = 'button';
        btn.className = 'time-slot';
        btn.disabled = true;
        btn.textContent = time;

        timeGrid.appendChild(btn);
      });

      return;
    }

    // Weekend selected
    if (weekend) {
      availabilityLabel.textContent = 'Weekend selected';

      const btn = document.createElement('button');

      btn.type = 'button';
      btn.className = 'time-slot';
      btn.disabled = true;
      btn.textContent = 'Weekend request';

      timeGrid.appendChild(btn);

      return;
    }

    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(selectedDate);

    availabilityLabel.textContent =
      `Available times for ${formattedDate}`;

    availableTimes.forEach(time => {
      const btn = document.createElement('button');

      btn.type = 'button';

      btn.className =
        'time-slot' +
        (selectedTime === time ? ' selected' : '');

      btn.textContent = time;

      btn.setAttribute(
        'aria-pressed',
        String(selectedTime === time)
      );

      btn.addEventListener('click', () => {
        selectedTime = time;

        clearError();

        // Update selected state without rebuilding the grid
        [...timeGrid.children].forEach(button => {
          const isSelected = button.textContent === time;

          button.classList.toggle('selected', isSelected);

          button.setAttribute(
            'aria-pressed',
            String(isSelected)
          );
        });
      });

      timeGrid.appendChild(btn);
    });
  }

  // =====================================================
  // WEEK NAVIGATION
  // =====================================================

  function changeWeek(offset) {
    weekStart = new Date(weekStart);

    weekStart.setDate(
      weekStart.getDate() + offset * 7
    );

    // Clear selection when changing weeks
    selectedDate = null;
    selectedTime = null;

    renderDays();
    renderTimes();

    clearError();
  }

  prevBtn.addEventListener('click', () => {
    changeWeek(-1);
  });

  nextBtn.addEventListener('click', () => {
    changeWeek(1);
  });

  // =====================================================
  // UPDATE THANK YOU SECTION
  // =====================================================

  function updateConfirmedDetails() {
    if (!selectedDate) return;

    if (confirmedDateEl) {
      confirmedDateEl.textContent =
        fullDateFmt.format(selectedDate);
    }

    if (confirmedTimeEl) {
      confirmedTimeEl.textContent = selectedTime
        ? `${selectedTime} (${APPOINTMENT_TIME_ZONE_LABEL})`
        : 'Weekend booking request';
    }
  }

  // =====================================================
  // TIMEZONE CONVERSION FOR CALENDAR
  // =====================================================

  function zonedTimeToUTC(dateString, timeString, timeZone) {
    const [year, month, day] = dateString
      .split('-')
      .map(Number);

    const match = timeString.match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
    );

    if (!match) {
      throw new Error('Invalid appointment time.');
    }

    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const meridiem = match[3].toUpperCase();

    if (
      hour < 1 ||
      hour > 12 ||
      minute < 0 ||
      minute > 59
    ) {
      throw new Error('Invalid appointment time.');
    }

    if (meridiem === 'PM' && hour !== 12) {
      hour += 12;
    }

    if (meridiem === 'AM' && hour === 12) {
      hour = 0;
    }

    const targetUTC = Date.UTC(
      year,
      month - 1,
      day,
      hour,
      minute,
      0
    );

    let result = targetUTC;

    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23'
    });

    for (let i = 0; i < 4; i++) {
      const parts = formatter.formatToParts(
        new Date(result)
      );

      const values = {};

      parts.forEach(part => {
        values[part.type] = part.value;
      });

      const representedUTC = Date.UTC(
        Number(values.year),
        Number(values.month) - 1,
        Number(values.day),
        Number(values.hour),
        Number(values.minute),
        Number(values.second)
      );

      result += targetUTC - representedUTC;
    }

    // Verify the requested wall-clock time exists
    const checkParts = formatter.formatToParts(
      new Date(result)
    );

    const checked = {};

    checkParts.forEach(part => {
      checked[part.type] = part.value;
    });

    if (
      Number(checked.year) !== year ||
      Number(checked.month) !== month ||
      Number(checked.day) !== day ||
      Number(checked.hour) !== hour ||
      Number(checked.minute) !== minute
    ) {
      throw new Error(
        'The selected time is invalid in this timezone.'
      );
    }

    return new Date(result);
  }

  function formatICSDateUTC(date) {
    return date.toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  }

  function escapeICS(value) {
    return String(value)
      .replace(/\\/g, '\\\\')
      .replace(/\r?\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  }

  // =====================================================
  // ADD TO CALENDAR BUTTON
  // =====================================================

  function addToCalendar() {
    if (!selectedDate) {
      showError('Please select an appointment date first.');
      return;
    }

    if (isWeekend(selectedDate)) {
      showError(
        'Your weekend booking is a request and has no confirmed time yet.'
      );
      return;
    }

    if (!selectedTime) {
      showError('Please select an appointment time.');
      return;
    }

    let startDate;
    let endDate;

    try {
      startDate = zonedTimeToUTC(
        getDateKey(selectedDate),
        selectedTime,
        APPOINTMENT_TIME_ZONE
      );

      endDate = new Date(
        startDate.getTime() +
        APPOINTMENT_DURATION_MINUTES * 60 * 1000
      );
    } catch (error) {
      showError(error.message);
      return;
    }

    const customerName = nameInput
      ? nameInput.value.trim()
      : '';

    const customerEmail = emailInput
      ? emailInput.value.trim()
      : '';

    const customerPhone = phoneInput
      ? phoneInput.value.trim()
      : '';

    const eventDescription = [
      'Your call booking is confirmed.',
      customerName ? `Name: ${customerName}` : '',
      customerEmail ? `Email: ${customerEmail}` : '',
      customerPhone ? `Phone: ${customerPhone}` : ''
    ].filter(Boolean).join('\n');

    const uid = (
      window.crypto &&
      typeof window.crypto.randomUUID === 'function'
    )
      ? window.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Book a Call//Appointment//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}@bookacall`,
      `DTSTAMP:${formatICSDateUTC(new Date())}`,
      `DTSTART:${formatICSDateUTC(startDate)}`,
      `DTEND:${formatICSDateUTC(endDate)}`,
      `SUMMARY:${escapeICS('Book a Call')}`,
      `DESCRIPTION:${escapeICS(eventDescription)}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob(
      [icsContent],
      { type: 'text/calendar;charset=utf-8' }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'book-call-appointment.ics';

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1500);
  }

  if (addCalendarBtn) {
    addCalendarBtn.addEventListener(
      'click',
      addToCalendar
    );
  }

  // =====================================================
  // FORM SUBMISSION
  // =====================================================

  form.addEventListener('submit', event => {
    event.preventDefault();

    if (submitting) return;

    const name = document.getElementById('bookCallFullName');
    const email = document.getElementById('bookCallEmail');

    if (
      !name.value.trim() ||
      !email.value.trim() ||
      !email.checkValidity()
    ) {
      showError(
        'Please enter your name and a valid email address.'
      );

      (!name.value.trim() ? name : email).focus();
      return;
    }

    if (!selectedDate) {
      showError('Please select a preferred day.');
      return;
    }

    const weekend = isWeekend(selectedDate);

    if (!weekend && !selectedTime) {
      showError('Please select an available time.');
      return;
    }

    submitting = true;

    submitBtn.disabled = true;
    submitBtn.classList.add('is-submitting');

    const btnLabel = submitBtn.querySelector('.btn-label');

    if (btnLabel) {
      btnLabel.textContent = 'SUBMITTING';
    }

    clearError();

    // Demo submission. Replace with your booking API request.
    setTimeout(() => {
      updateConfirmedDetails();

      form.style.display = 'none';
      successPanel.classList.add('is-visible');

      submitting = false;
      submitBtn.disabled = false;
    }, 1500);
  });

  // =====================================================
  // CLOSE SUCCESS / RESET FORM
  // =====================================================

  closeSuccess.addEventListener('click', () => {
    successPanel.classList.remove('is-visible');

    form.style.display = '';

    form.reset();

    selectedDate = null;
    selectedTime = null;

    weekStart = getMonday(new Date());

    submitting = false;

    submitBtn.disabled = false;
    submitBtn.classList.remove('is-submitting');

    const btnLabel = submitBtn.querySelector('.btn-label');

    if (btnLabel) {
      btnLabel.textContent = 'CONFIRM BOOKING';
    }

    clearError();

    renderDays();
    renderTimes();

    closePopover();
  });

  // =====================================================
  // INITIALIZE
  // =====================================================

  renderDays();
  renderTimes();

})();
