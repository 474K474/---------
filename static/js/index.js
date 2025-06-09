let updateInterval;
let previousData = {};

// Очищаем предыдущий интервал при загрузке страницы
if (updateInterval) {
    clearInterval(updateInterval);
}
updateInterval = setInterval(connection, 10000);

function set_interval_connect(){
    // Очищаем предыдущий интервал
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    // Устанавливаем новый интервал
    updateInterval = setInterval(connection, Number(document.getElementById("update_period").value)*1000);
    console.log('OK');
}

function connection(){

    if (Boolean(document.getElementById("connect").checked)) {
        connect_robot_1()
        connect_robot_2()
        connect_camera()
        set_remote_terminal_data()
        set_traffic_lights_data()
    }
}


function send_is_logging(){
        $.ajax({
        type: 'GET',
        url: '/is_logged',
        dataType: 'json',
        contentType: 'application/json',
        data: {
            'isLooged': Boolean(document.getElementById("save_data").checked)
        },

        success: function (response) {
            console.log('OK')
        }
    });
}


// Функция для добавления записи в историю оповещений
function addAlertToHistory(message, type) {
    const alertsLog = document.getElementById('alerts-log');
    const timestamp = new Date().toLocaleString();
    const alertElement = document.createElement('div');
    alertElement.className = `alert ${type === 'critical' ? 'alert-critical' : 'alert-warning'}`;
    
    const statusIndicator = document.createElement('div');
    statusIndicator.className = `parameter-status ${type === 'critical' ? 'status-critical' : 'status-warning'}`;
    
    const textContent = document.createElement('span');
    textContent.textContent = `${timestamp}: ${message}`;
    
    alertElement.appendChild(statusIndicator);
    alertElement.appendChild(textContent);
    
    // Добавляем новое оповещение в начало списка
    alertsLog.insertBefore(alertElement, alertsLog.firstChild);
    
    // Ограничиваем количество отображаемых оповещений
    while (alertsLog.children.length > 10) {
        alertsLog.removeChild(alertsLog.lastChild);
    }
}

// Обновляем функцию check_sensor для использования новой системы оповещений
function check_sensor(response) {
    let temperature_mass = ['t1_1', 't2_1', 't3_1', 't4_1', 't5_1', 't6_1'];
    let load_mass = ['l1_1', 'l2_1', 'l3_1', 'l4_1', 'l5_1', 'l6_1'];
    let motor_mass = ['m1_1', 'm2_1', 'm3_1', 'm4_1', 'm5_1', 'm6_1'];
    
    let criticalMessages = [];

    // Проверка температуры
    temperature_mass.forEach((sensor, index) => {
        const value = Number(response[sensor]);
        if (!isNaN(value)) {
            const criticalLeft = Number(document.getElementById("critical_left_t").value || document.getElementById("critical_left_t").placeholder || 0);
            const criticalRight = Number(document.getElementById("critical_right_t").value || document.getElementById("critical_right_t").placeholder || 50);

            if (value < criticalLeft || value > criticalRight) {
                criticalMessages.push(`Температура t${index + 1}: ${value}°C вышла за критические пределы [${criticalLeft}, ${criticalRight}]°C`);
            }
        }
    });

    // Проверка нагрузки
    load_mass.forEach((sensor, index) => {
        const value = Number(response[sensor]);
        if (!isNaN(value)) {
            const criticalLeft = Number(document.getElementById("critical_left_l").value || document.getElementById("critical_left_l").placeholder || 0);
            const criticalRight = Number(document.getElementById("critical_right_l").value || document.getElementById("critical_right_l").placeholder || 50);

            if (value < criticalLeft || value > criticalRight) {
                criticalMessages.push(`Нагрузка l${index + 1}: ${value}% вышла за критические пределы [${criticalLeft}, ${criticalRight}]%`);
            }
        }
    });

    // Проверка энкодеров
    motor_mass.forEach((sensor, index) => {
        const value = Number(response[sensor]);
        if (!isNaN(value)) {
            const criticalLeft = Number(document.getElementById("critical_left_m").value || document.getElementById("critical_left_m").placeholder || 0);
            const criticalRight = Number(document.getElementById("critical_right_m").value || document.getElementById("critical_right_m").placeholder || 1000);

            if (value < criticalLeft || value > criticalRight) {
                criticalMessages.push(`Энкодер m${index + 1}: ${value} вышел за критические пределы [${criticalLeft}, ${criticalRight}]`);
            }
        }
    });

    // Если есть критические сообщения, добавляем их в историю
    if (criticalMessages.length > 0) {
        const timestamp = new Date().toLocaleString();
        const historyElement = document.getElementById("critical-history");
        
        if (historyElement) {
            criticalMessages.forEach(message => {
                const messageElement = document.createElement("div");
                messageElement.className = "history-item";
                messageElement.innerHTML = `<span class="timestamp">[${timestamp}]</span> ${message}`;
                historyElement.insertBefore(messageElement, historyElement.firstChild);
            });

            // Отправляем критические значения в лог
            $.ajax({
                type: 'POST',
                url: '/log_critical',
                data: JSON.stringify({
                    timestamp: new Date().toISOString(),
                    messages: criticalMessages
                }),
                contentType: 'application/json'
            });
        }
    }
}

// Добавляем стили для истории
const style = document.createElement('style');
style.textContent = `
.history-container {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    max-height: 300px;
    overflow-y: auto;
    background-color: #fff;
}

.history-list {
    display: flex;
    flex-direction: column;
}

.history-item {
    padding: 8px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
    color: #d32f2f;
}

.history-item:last-child {
    border-bottom: none;
}

.timestamp {
    color: #666;
    margin-right: 10px;
    font-weight: bold;
}
`;
document.head.appendChild(style);

function connect_robot_1() {
    $.ajax({
        type: 'GET',
        url: '/get_gripper_data',
        dataType: 'json',
        contentType: 'application/json',
        data: {
        },

        success: function (response) {
            console.log(response)
            updateRobotData(response, '1')
            }
    });
}


function connect_robot_2() {
    $.ajax({
        type: 'GET',
        url: '/get_vacuum_data',
        dataType: 'json',
        contentType: 'application/json',
        data: {
        },

        success: function (response) {
            console.log(response)
            updateRobotData(response, '2')
            }
    });
}

function connect_camera() {
    $.ajax({
        type: 'GET',
        url: '/get_code',
        dataType: 'json',
        contentType: 'application/json',
        data: {
        },

        success: function (response) {
            console.log(response)
            document.getElementById("code").value = response['code']
            }
    });
}



function send_robot_gripper_data() {
    if (Boolean(document.getElementById("send_data").checked)) {

        $.ajax({
            type: 'GET',
            url: '/set_gripper_data',
            dataType: 'json',
            contentType: 'application/json',
            data: {
                'N_control_1': document.getElementById("N_control_1").value,
                "X_1": document.getElementById("X_1").value,
                "Y_1": document.getElementById("Y_1").value,
                "T_1": document.getElementById("T_1").value,
                "G_1": document.getElementById("G_1").value
            },

            success: function (response) {

            }
        });
    }
}



function send_robot_vacuum_data(){
        $.ajax({
        type: 'GET',
        url: '/set_vacuum_data',
        dataType: 'json',
        contentType: 'application/json',
        data: {
            'N_control_2': document.getElementById("N_control_2").value,
            "X_2": document.getElementById("X_2").value,
            "Y_2": document.getElementById("Y_2").value,
            "V_2": document.getElementById("V_2").value,
        },

        success: function (response) {

            }
    });
}



function set_remote_terminal_data(){
        $.ajax({
        type: 'GET',
        url: '/set_remote_terminal_data',
        dataType: 'json',
        contentType: 'application/json',
        data: {
            'L1': Number(document.getElementById("remote_terminal_blue").checked),
            'L2': Number(document.getElementById("remote_terminal_red").checked),
            'L3': Number(document.getElementById("remote_terminal_yellow").checked),
            'L4': Number(document.getElementById("remote_terminal_green").checked),
        },

        success: function (response) {

            }
    });
}

function set_traffic_lights_data(){
        $.ajax({
        type: 'GET',
        url: '/set_traffic_lights_data',
        dataType: 'json',
        contentType: 'application/json',
        data: {
            'L1': Number(document.getElementById("traffic_lights_blue").checked),
            'L2': Number(document.getElementById("traffic_lights_red").checked),
            'L3': Number(document.getElementById("traffic_lights_yellow").checked),
            'L4': Number(document.getElementById("traffic_lights_green").checked),
        },

        success: function (response) {

            }
    });
}

function updateRobotData(data, robotId) {
    // Если данные не изменились, не обновляем интерфейс
    const key = `robot_${robotId}`;
    if (previousData[key] && JSON.stringify(previousData[key]) === JSON.stringify(data)) {
        return;
    }
    
    // Сохраняем новые данные
    previousData[key] = {...data};

    // Обновление сырых данных
    $('#t1_' + robotId).val(data.t1);
    $('#t2_' + robotId).val(data.t2);
    $('#t3_' + robotId).val(data.t3);
    $('#t4_' + robotId).val(data.t4);
    $('#t5_' + robotId).val(data.t5);
    $('#t6_' + robotId).val(data.t6);

    $('#l1_' + robotId).val(data.l1);
    $('#l2_' + robotId).val(data.l2);
    $('#l3_' + robotId).val(data.l3);
    $('#l4_' + robotId).val(data.l4);
    $('#l5_' + robotId).val(data.l5);
    $('#l6_' + robotId).val(data.l6);

    $('#m1_' + robotId).val(data.m1);
    $('#m2_' + robotId).val(data.m2);
    $('#m3_' + robotId).val(data.m3);
    $('#m4_' + robotId).val(data.m4);
    $('#m5_' + robotId).val(data.m5);
    $('#m6_' + robotId).val(data.m6);

    $('#n_' + robotId).val(data.n);
    $('#s_' + robotId).val(data.s);
    $('#c_' + robotId).val(data.c);

    // Обновление калиброванных данных
    if (data.calibrated) {
        // Температура
        const temps = data.calibrated.temperatures;
        $('#t1_' + robotId + '_cal').val(temps.t1 ? temps.t1.toFixed(1) : 'ERR');
        $('#t2_' + robotId + '_cal').val(temps.t2 ? temps.t2.toFixed(1) : 'ERR');
        $('#t3_' + robotId + '_cal').val(temps.t3 ? temps.t3.toFixed(1) : 'ERR');
        $('#t4_' + robotId + '_cal').val(temps.t4 ? temps.t4.toFixed(1) : 'ERR');
        $('#t5_' + robotId + '_cal').val(temps.t5 ? temps.t5.toFixed(1) : 'ERR');
        $('#t6_' + robotId + '_cal').val(temps.t6 ? temps.t6.toFixed(1) : 'ERR');

        // Нагрузка
        const loads = data.calibrated.loads;
        $('#l1_' + robotId + '_cal').val(loads.l1 ? loads.l1.toFixed(1) : 'ERR');
        $('#l2_' + robotId + '_cal').val(loads.l2 ? loads.l2.toFixed(1) : 'ERR');
        $('#l3_' + robotId + '_cal').val(loads.l3 ? loads.l3.toFixed(1) : 'ERR');
        $('#l4_' + robotId + '_cal').val(loads.l4 ? loads.l4.toFixed(1) : 'ERR');
        $('#l5_' + robotId + '_cal').val(loads.l5 ? loads.l5.toFixed(1) : 'ERR');
        $('#l6_' + robotId + '_cal').val(loads.l6 ? loads.l6.toFixed(1) : 'ERR');

        // Энкодеры (предполагаем, что это робот серии AX)
        const m1_deg = calibrateEncoderAX(data.m1);
        const m2_deg = calibrateEncoderAX(data.m2);
        const m3_deg = calibrateEncoderAX(data.m3);
        const m4_deg = calibrateEncoderAX(data.m4);
        const m5_deg = calibrateEncoderAX(data.m5);
        const m6_deg = calibrateEncoderAX(data.m6);

        $('#m1_' + robotId + '_priv').val(m1_deg ? m1_deg.toFixed(1) : 'ERR');
        $('#m2_' + robotId + '_priv').val(m2_deg ? m2_deg.toFixed(1) : 'ERR');
        $('#m3_' + robotId + '_priv').val(m3_deg ? m3_deg.toFixed(1) : 'ERR');
        $('#m4_' + robotId + '_priv').val(m4_deg ? m4_deg.toFixed(1) : 'ERR');
        $('#m5_' + robotId + '_priv').val(m5_deg ? m5_deg.toFixed(1) : 'ERR');
        $('#m6_' + robotId + '_priv').val(m6_deg ? m6_deg.toFixed(1) : 'ERR');
    }

    checkLimits(robotId);
}

function calibrateEncoderAX(value) {
    if (value === -1) return null;
    return (value * 360) / 1024;
}

function calibrateEncoderMX(value) {
    if (value === -1) return null;
    return (value * 360) / 4096;
}

// Функция сохранения настроек
function saveSettings() {
    const settings = {
        // Пороговые значения
        limitLeftT: document.getElementById("limit_left_t").value,
        limitRightT: document.getElementById("limit_right_t").value,
        limitLeftM: document.getElementById("limit_left_m").value,
        limitRightM: document.getElementById("limit_right_m").value,
        limitLeftL: document.getElementById("limit_left_l").value,
        limitRightL: document.getElementById("limit_right_l").value,
        
        // Критические значения
        criticalLeftT: document.getElementById("critical_left_t").value,
        criticalRightT: document.getElementById("critical_right_t").value,
        criticalLeftM: document.getElementById("critical_left_m").value,
        criticalRightM: document.getElementById("critical_right_m").value,
        criticalLeftL: document.getElementById("critical_left_l").value,
        criticalRightL: document.getElementById("critical_right_l").value,
        
        // Настройки подключения
        updatePeriod: document.getElementById("update_period").value,
        isConnected: document.getElementById("connect").checked,
        isLogging: document.getElementById("save_data").checked
    };
    
    localStorage.setItem('engineerSettings', JSON.stringify(settings));
}

// Функция загрузки настроек
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('engineerSettings'));
    if (settings) {
        // Загружаем пороговые значения
        document.getElementById("limit_left_t").value = settings.limitLeftT;
        document.getElementById("limit_right_t").value = settings.limitRightT;
        document.getElementById("limit_left_m").value = settings.limitLeftM;
        document.getElementById("limit_right_m").value = settings.limitRightM;
        document.getElementById("limit_left_l").value = settings.limitLeftL;
        document.getElementById("limit_right_l").value = settings.limitRightL;
        
        // Загружаем критические значения
        document.getElementById("critical_left_t").value = settings.criticalLeftT;
        document.getElementById("critical_right_t").value = settings.criticalRightT;
        document.getElementById("critical_left_m").value = settings.criticalLeftM;
        document.getElementById("critical_right_m").value = settings.criticalRightM;
        document.getElementById("critical_left_l").value = settings.criticalLeftL;
        document.getElementById("critical_right_l").value = settings.criticalRightL;
        
        // Загружаем настройки подключения
        document.getElementById("update_period").value = settings.updatePeriod;
        document.getElementById("connect").checked = settings.isConnected;
        document.getElementById("save_data").checked = settings.isLogging;
        
        // Применяем настройки
        set_interval_connect();
        send_is_logging();
    }
}

// Сохраняем настройки при изменении значений
function setupSettingsSaving() {
    const inputs = [
        "limit_left_t", "limit_right_t", "limit_left_m", "limit_right_m", 
        "limit_left_l", "limit_right_l", "critical_left_t", "critical_right_t",
        "critical_left_m", "critical_right_m", "critical_left_l", "critical_right_l"
    ];
    
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('change', saveSettings);
    });
    
    document.getElementById("connect").addEventListener('change', saveSettings);
    document.getElementById("save_data").addEventListener('change', saveSettings);
}

// Загружаем настройки при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadSettings();
    setupSettingsSaving();
});

// Сохраняем настройки перед закрытием страницы
window.addEventListener('beforeunload', saveSettings);
