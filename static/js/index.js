setInterval(connection, 3000)


function set_interval_connect(){
    setInterval(connection, Number(document.getElementById("update_period").value)*1000)
    console.log('OK')
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
            document.getElementById('t1_1').value = response['t1']
            document.getElementById('t2_1').value = response['t2']
            document.getElementById('t3_1').value = response['t3']
            document.getElementById('t4_1').value = response['t4']
            document.getElementById('t5_1').value = response['t5']
            document.getElementById('t6_1').value = response['t6']
            document.getElementById('l1_1').value = response['l1']
            document.getElementById('l2_1').value = response['l2']
            document.getElementById('l3_1').value = response['l3']
            document.getElementById('l4_1').value = response['l4']
            document.getElementById('l5_1').value = response['l5']
            document.getElementById('l6_1').value = response['l6']
            document.getElementById('m1_1').value = response['m1']
            document.getElementById('m2_1').value = response['m2']
            document.getElementById('m3_1').value = response['m3']
            document.getElementById('m4_1').value = response['m4']
            document.getElementById('m5_1').value = response['m5']
            document.getElementById('m6_1').value = response['m6']
            document.getElementById('s_1').value = response['s']
            document.getElementById('c_1').value = response['c']
            document.getElementById('n_1').value = response['n']

            document.getElementById('m1_1_priv').value = response['m1']*360/1024
            document.getElementById('m2_1_priv').value = response['m2']*360/1024
            document.getElementById('m3_1_priv').value = response['m3']*360/1024
            document.getElementById('m4_1_priv').value = response['m4']*360/1024
            document.getElementById('m5_1_priv').value = response['m5']*360/1024
            document.getElementById('m6_1_priv').value = response['m6']*360/1024


            check_sensor(response)
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
        document.getElementById("t1_2").value = response['t1']
        document.getElementById("t2_2").value = response['t2']
        document.getElementById("t3_2").value = response['t3']
        document.getElementById("t4_2").value = response['t4']
        document.getElementById("t5_2").value = response['t5']
        document.getElementById("t6_2").value = response['t6']
        document.getElementById("l1_2").value = response['l1']
        document.getElementById("l2_2").value = response['l2']
        document.getElementById("l3_2").value = response['l3']
        document.getElementById("l4_2").value = response['l4']
        document.getElementById("l5_2").value = response['l5']
        document.getElementById("l6_2").value = response['l6']
        document.getElementById("m1_2").value = response['m1']
        document.getElementById("m2_2").value = response['m2']
        document.getElementById("m3_2").value = response['m3']
        document.getElementById("m4_2").value = response['m4']
        document.getElementById("m5_2").value = response['m5']
        document.getElementById("m6_2").value = response['m6']
        document.getElementById("s_2").value = response['s']
        document.getElementById("c_2").value = response['c']
        document.getElementById("n_2").value = response['n']

            check_sensor(response)
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
