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


function check_sensor(response){
    let temperature_mass = ['t1', 't2', 't3', 't4', 't5', 't6']
    let load_mass = ['l1', 'l2', 'l3', 'l4', 'l5', 'l6']
    let motor_mass = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6']

    for (sensor in temperature_mass){
        if (Number(document.getElementById("limit_left_t").value) > Number(response[temperature_mass[sensor]]) ||
            Number(response[temperature_mass[sensor]]) > Number(document.getElementById("limit_right_t").value)) {
            document.getElementById("limit_signal").style.display = 'block'
        }
        else{
            document.getElementById("limit_signal").style.display = 'none'
        }

        if (Number(document.getElementById("critical_left_t").value) > Number(response[temperature_mass[sensor]]) ||
            Number(response[temperature_mass[sensor]]) > Number(document.getElementById("critical_right_t").value)) {
            document.getElementById("critical_signal").style.display = 'block'
        }
        else{
            document.getElementById("critical_signal").style.display = 'none'
        }
    }

    for (sensor in load_mass){
        if (Number(document.getElementById("limit_left_l").value) > Number(response[temperature_mass[sensor]]) ||
            Number(response[temperature_mass[sensor]]) > Number(document.getElementById("limit_right_l").value)) {
            document.getElementById("limit_signal").style.display = 'block'
        }
        else{
            document.getElementById("limit_signal").style.display = 'none'
        }

        if (Number(document.getElementById("critical_left_l").value) > Number(response[temperature_mass[sensor]]) ||
            Number(response[temperature_mass[sensor]]) > Number(document.getElementById("critical_right_l").value)) {
            document.getElementById("critical_signal").style.display = 'block'
        }
        else{
            document.getElementById("critical_signal").style.display = 'none'
        }
    }


    for (sensor in motor_mass){
        if (Number(document.getElementById("limit_left_m").value) > Number(response[temperature_mass[sensor]]) ||
            Number(response[temperature_mass[sensor]]) > Number(document.getElementById("limit_right_m").value)) {
            document.getElementById("limit_signal").style.display = 'block'
        }
        else{
            document.getElementById("limit_signal").style.display = 'none'
        }

        if (Number(document.getElementById("critical_left_m").value) > Number(response[temperature_mass[sensor]]) ||
            Number(response[temperature_mass[sensor]]) > Number(document.getElementById("critical_right_m").value)) {
            document.getElementById("critical_signal").style.display = 'block'
        }
        else{
            document.getElementById("critical_signal").style.display = 'none'
        }
    }
}



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
