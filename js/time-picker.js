document.addEventListener('DOMContentLoaded', () => {
    const tickSound = document.getElementById('wheel-tick-sound');
    const pickers = document.querySelectorAll('.khelsetu-time-picker');

    pickers.forEach(container => {
        const id = container.dataset.id;
        const label = container.dataset.label;

        // 1. INJECT THE HTML STRUCTURE DYNAMICALLY
        container.innerHTML = `
            <div class="custom-time-picker-container">
                <label>${label}</label>
                <div class="time-trigger-box" id="${id}-trigger">
                    <span class="selected-time-value">--:-- --</span>
                    <span class="clock-icon">🕒</span>
                </div>
                <input type="hidden" id="${id}-final" name="${id}" value="">

                <div class="time-picker-popup" id="${id}-popup">
                    <div class="picker-mode-wheels active">
                        <div class="drum-container-overlay">
                            <div class="highlight-row">
                                <div class="hl-box"></div><div class="hl-colon">:</div><div class="hl-box"></div><div class="hl-spacer"></div><div class="hl-box"></div>
                            </div>
                            <div class="wheel-drum drum-hour" data-type="hour">
                                <div class="spacer-item"></div>
                                ${[1,2,3,4,5,6,7,8,9,10,11,12].map(n => {
                                    let val = n.toString().padStart(2, '0');
                                    return `<div class="drum-item" data-val="${val}">${val}</div>`;
                                }).join('')}
                                <div class="spacer-item"></div>
                            </div>
                            <div class="wheel-drum drum-minute" data-type="minute">
                                <!-- Minutes injected below -->
                            </div>
                            <div class="wheel-drum drum-ampm" data-type="ampm">
                                <div class="spacer-item"></div>
                                <div class="drum-item" data-val="AM">AM</div>
                                <div class="drum-item" data-val="PM">PM</div>
                                <div class="spacer-item"></div>
                            </div>
                        </div>
                    </div>

                    <div class="picker-mode-keyboard">
                        <div class="keyboard-input-wrapper">
                            <span class="bracket">[</span>
                            <input type="text" maxlength="2" class="kb-num kb-hour" placeholder="HH">
                            <span class="kb-colon">:</span>
                            <input type="text" maxlength="2" class="kb-num kb-minute" placeholder="MM">
                            <span class="bracket">]</span>
                            <div class="kb-ampm-toggle">
                                <button type="button" class="kb-ampm-btn active" data-val="AM">AM</button>
                                <button type="button" class="kb-ampm-btn" data-val="PM">PM</button>
                            </div>
                        </div>
                        <p class="kb-hint">Type custom time (HH:MM)</p>
                        <p class="error-msg-text">Invalid time</p>
                    </div>

                    <div class="picker-footer">
                        <button type="button" class="toggle-mode-btn"><span class="icon-span">⌨</span> Type with Keyboard</button>
                        <button type="button" class="confirm-btn">OK</button>
                    </div>
                </div>
            </div>
        `;

        // 2. INJECT MINUTES (00 to 59)
        const drumMinute = container.querySelector('.drum-minute');
        let minHtml = '<div class="spacer-item"></div>';
        for (let i = 0; i <= 59; i++) {
            let val = i.toString().padStart(2, '0');
            minHtml += `<div class="drum-item" data-val="${val}">${val}</div>`;
        }
        minHtml += '<div class="spacer-item"></div>';
        drumMinute.innerHTML = minHtml;

        // 3. WIRE UP THE LOGIC (Strictly scoped to this specific picker)
        const trigger = container.querySelector(`#${id}-trigger`);
        const popup = container.querySelector(`#${id}-popup`);
        const finalInput = container.querySelector(`#${id}-final`);
        const visibleValue = container.querySelector('.selected-time-value');
        const wheelsMode = container.querySelector('.picker-mode-wheels');
        const kbMode = container.querySelector('.picker-mode-keyboard');
        const toggleModeBtn = container.querySelector('.toggle-mode-btn');
        const confirmBtn = container.querySelector('.confirm-btn');

        const drumHour = container.querySelector('.drum-hour');
        const drumAMPM = container.querySelector('.drum-ampm');
        const drums = [drumHour, drumMinute, drumAMPM];

        const kbHour = container.querySelector('.kb-hour');
        const kbMinute = container.querySelector('.kb-minute');
        const kbAM = container.querySelector('.kb-ampm-btn[data-val="AM"]');
        const kbPM = container.querySelector('.kb-ampm-btn[data-val="PM"]');
        const kbError = container.querySelector('.error-msg-text');
        
        let selectedAMPM = 'AM';
        let isKeyboardMode = false;

        // Open Popup
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.time-picker-popup.active').forEach(p => {
                if(p !== popup) p.classList.remove('active');
            });
            if (popup.classList.toggle('active')) initWheels();
        });

        // Toggle Keyboard/Wheel Modes
        toggleModeBtn.addEventListener('click', () => {
            isKeyboardMode = !isKeyboardMode;
            if (isKeyboardMode) {
                wheelsMode.classList.remove('active');
                kbMode.classList.add('active');
                toggleModeBtn.innerHTML = '<span class="icon-span">🕒</span> Use Scroll Wheels';
                const current = getSelectedFromWheels();
                kbHour.value = current.hour;
                kbMinute.value = current.minute;
                selectedAMPM = current.ampm;
                updateKBButtons();
            } else {
                kbMode.classList.remove('active');
                wheelsMode.classList.add('active');
                toggleModeBtn.innerHTML = '<span class="icon-span">⌨</span> Type with Keyboard';
                let h = kbHour.value.padStart(2, '0');
                let m = kbMinute.value.padStart(2, '0');
                if (parseInt(h) >= 1 && parseInt(h) <= 12) setWheelTo(drumHour, h);
                if (parseInt(m) >= 0 && parseInt(m) <= 59) setWheelTo(drumMinute, m);
                setWheelTo(drumAMPM, selectedAMPM);
            }
        });

        kbAM.addEventListener('click', () => { selectedAMPM = 'AM'; updateKBButtons(); });
        kbPM.addEventListener('click', () => { selectedAMPM = 'PM'; updateKBButtons(); });

        function updateKBButtons() {
            kbAM.classList.toggle('active', selectedAMPM === 'AM');
            kbPM.classList.toggle('active', selectedAMPM === 'PM');
        }

        function initWheels() {
            drums.forEach(drum => {
                drum.addEventListener('scroll', debounce(() => highlightActiveItem(drum), 40));
                highlightActiveItem(drum);
            });
        }

        function highlightActiveItem(drum) {
            const items = drum.querySelectorAll('.drum-item');
            const drumCenter = drum.getBoundingClientRect().top + (drum.clientHeight / 2);
            let closestItem = null;
            let closestDiff = Infinity;

            items.forEach(item => {
                const itemCenter = item.getBoundingClientRect().top + (item.clientHeight / 2);
                const diff = Math.abs(drumCenter - itemCenter);
                if (diff < closestDiff) { closestDiff = diff; closestItem = item; }
            });

            if (closestItem && !closestItem.classList.contains('active')) {
                items.forEach(item => item.classList.remove('active'));
                closestItem.classList.add('active');
                
                if (tickSound) {
                    tickSound.currentTime = 0;
                    tickSound.volume = 0.15;
                    tickSound.play().catch(() => {});
                }
            }
        }

        function getSelectedFromWheels() {
            return {
                hour: drumHour.querySelector('.active')?.dataset.val || '12',
                minute: drumMinute.querySelector('.active')?.dataset.val || '00',
                ampm: drumAMPM.querySelector('.active')?.dataset.val || 'AM'
            };
        }

        function setWheelTo(drum, val) {
            const target = drum.querySelector(`.drum-item[data-val="${val}"]`);
            if (target) {
                drum.scrollTop = target.offsetTop - drum.offsetTop - (drum.clientHeight / 2) + (target.clientHeight / 2);
                setTimeout(() => highlightActiveItem(drum), 100);
            }
        }

        // Confirm Selection
        confirmBtn.addEventListener('click', () => {
            let h, m, ampm;
            if (isKeyboardMode) {
                h = parseInt(kbHour.value); m = parseInt(kbMinute.value);
                if (isNaN(h) || h < 1 || h > 12 || isNaN(m) || m < 0 || m > 59) {
                    kbError.style.display = 'block'; return;
                }
                kbError.style.display = 'none';
                h = h.toString().padStart(2, '0'); m = m.toString().padStart(2, '0'); ampm = selectedAMPM;
            } else {
                const w = getSelectedFromWheels();
                h = w.hour; m = w.minute; ampm = w.ampm;
            }
            const formattedTime = `${h}:${m} ${ampm}`;
            visibleValue.textContent = formattedTime;
            finalInput.value = formattedTime;
            popup.classList.remove('active');
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        document.querySelectorAll('.time-picker-popup').forEach(popup => {
            if (popup.classList.contains('active') && !popup.contains(e.target) && !e.target.closest('.time-trigger-box')) {
                popup.classList.remove('active');
            }
        });
    });

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
});