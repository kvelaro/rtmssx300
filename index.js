var net = require('net');
var constants = require('./constants');
var dateFormatted = require('./date');
let requestMethods = {
    defaults: {
        sensorid: 1,
        execute: true,
        host: '',
        port: null,
        returnRaw: false,
        cb: null
    },
    informationRequest: (options) => {
        const expectedResponseFunction = '40';
        let params = {...this.defaults, ...options};
        const SETUPINFO = 'C0';
        const DATALENGTH = '02';
        let data = params.sensorID.toString(16).padStart(4, '0');
        let checksum = privateMethods.makeChecksum(data)
        frame = Buffer.from(constants.MESSAGE_HEADER + SETUPINFO + DATALENGTH + data + checksum, 'hex')
        if(!params.execute) {
            if(params.cb != null) {
                params.cb(null, frame);
                return;
            }
            return frame;
        }
        privateMethods.send(params.host, params.port, frame, expectedResponseFunction, params.returnRaw, params.cb)
    },
    rtcRetrieveRequest: (options) => {
        const expectedResponseFunction = '49';
        let params = {...this.defaults, ...options};
        const RTCREQUEST = 'F9';
        const DATALENGTH = '02';
        let data = params.sensorID.toString(16).padStart(4, '0');
        let checksum = privateMethods.makeChecksum(data)
        frame = Buffer.from(constants.MESSAGE_HEADER + RTCREQUEST + DATALENGTH + data + checksum, 'hex')
        if(!params.execute) {
            if(params.cb != null) {
                params.cb(null, frame);
                return;
            }
            return frame;
        }
        privateMethods.send(params.host, params.port, frame, expectedResponseFunction, params.returnRaw, params.cb)
    },
    rtcChangeRequest: (options) => {
        const expectedResponseFunction = '1C';
        let params = {...this.defaults, ...options};
        const RTCREQUEST = '49';
        const DATALENGTH = '10';
        let data = params.sensorID.toString(16).padStart(4, '0');
        data += dateFormatted.getSeconds(options.startTime)
        data += dateFormatted.getMinutes(options.startTime)
        data += dateFormatted.getHours(options.startTime)
        data += dateFormatted.getDay(options.startTime)
        data += dateFormatted.getDate(options.startTime)
        data += dateFormatted.getMonth(options.startTime)
        data += dateFormatted.getYear(options.startTime)
        data += dateFormatted.getSeconds(options.resetTime)
        data += dateFormatted.getMinutes(options.resetTime)
        data += dateFormatted.getHours(options.resetTime)
        data += dateFormatted.getDay(options.resetTime)
        data += dateFormatted.getDate(options.resetTime)
        data += dateFormatted.getMonth(options.resetTime)
        data += dateFormatted.getYear(options.resetTime)
        let checksum = privateMethods.makeChecksum(data)
        frame = Buffer.from(constants.MESSAGE_HEADER + RTCREQUEST + DATALENGTH + data + checksum, 'hex')
        if(!params.execute) {
            if(params.cb != null) {
                params.cb(null, frame);
                return;
            }
            return frame;
        }
        privateMethods.send(params.host, params.port, frame, expectedResponseFunction, params.returnRaw, params.cb)
    },
    setupInformationRequest: (options) => {
        const expectedResponseFunction = '41';
        let params = {...this.defaults, ...options};
        const SETUPINFOREQUEST = 'C1';
        const DATALENGTH = '02';
        let data = params.sensorID.toString(16).padStart(4, '0');
        let checksum = privateMethods.makeChecksum(data)
        frame = Buffer.from(constants.MESSAGE_HEADER + SETUPINFOREQUEST + DATALENGTH + data + checksum, 'hex')
        if(!params.execute) {
            if(params.cb != null) {
                params.cb(null, frame);
                return;
            }
            return frame;
        }
        privateMethods.send(params.host, params.port, frame, expectedResponseFunction, params.returnRaw, params.cb)
    },
    setupInformationChangeRequest: (options) => {
        const expectedResponseFunction = '1C';
        let params = {...this.defaults, ...options};
        const SETUPCHANGEREQUESTREQUEST = '41';
        const DATALENGTH = '12';
        let obj = options.obj;
        let data = params.sensorID.toString(16).padStart(4, '0');
        data += params.sensorID.toString(16).padStart(4, '0');
        data += privateMethods.convert1016(obj.zones);
        data += privateMethods.convert1016(obj.messagePeriod);
        data += privateMethods.convert1016(obj.sensitivity);
        let messageComposition = obj.messageCompositionByte

        if(obj.gap == true) {
            messageComposition |= Math.pow(2,7)
        }
        else {
            messageComposition &= Math.pow(2, 8) - 1
        }
        if(obj.headway == true) {
            messageComposition |= Math.pow(2, 6)
        }
        else {
            messageComposition &= Math.pow(2, 8) - 1 - Math.pow(2, 6)
        }
        messageComposition |= Math.pow(2, 5)
        messageComposition |= Math.pow(2, 4)
        messageComposition |= Math.pow(2, 3)
        if(obj.speed85 == true) {
            messageComposition |= Math.pow(2, 2)
        }
        else {
            messageComposition &= Math.pow(2, 8) - 1 - Math.pow(2, 2)
        }
        messageComposition |= Math.pow(2, 1)
        messageComposition |= Math.pow(2, 0)
        
        data += privateMethods.convert1016(messageComposition);
        
        let ser1Flags = obj.serFlagsByte
        
        if(obj.serProtocol == 'X3') {
            ser1Flags |= Math.pow(2, 7)
        }
        else {
            ser1Flags &= Math.pow(2, 8) - 1
        }
        if(obj.serHOccupancy == true) {
            ser1Flags |= Math.pow(2, 6)
        }
        else {
            ser1Flags &= Math.pow(2, 8) - 1 - Math.pow(2, 6)
        }
        if(obj.serMode == '485') {
            ser1Flags |= Math.pow(2, 5)
        }
        else {
            ser1Flags &= Math.pow(2, 8) - 1 - Math.pow(2, 5)
        }
        if(obj.serPerVehicle == true) {
            ser1Flags |= Math.pow(2, 4)
        }
        else {
            ser1Flags &= Math.pow(2, 8) - 1 - Math.pow(2, 4)
        }
        if(obj.serNormalMode == true) {
            ser1Flags |= Math.pow(2, 3)
            ser1Flags &= Math.pow(2, 8) - 1 - Math.pow(2, 2)
            ser1Flags &= Math.pow(2, 8) - 1 - Math.pow(2, 1)
        }
        else {
            ser1Flags &= Math.pow(2, 8) - 1 - Math.pow(2, 3)
        }
        if(obj.serStatMode == true) {
            ser1Flags |= Math.pow(2, 2)
            ser1Flags &= Math.pow(2, 8) - 1 - Math.pow(2, 3)
            ser1Flags &= Math.pow(2, 8) - 1 - Math.pow(2, 1)
        }
        else {
            ser1Flags &= Math.pow(2, 8) - 1 - Math.pow(2, 2)
        }
        if(obj.serPollMode == true) {
            ser1Flags |= Math.pow(2, 1)
            ser1Flags &= Math.pow(2, 8) - 1 - Math.pow(2, 3)
            ser1Flags &= Math.pow(2, 8) - 1 - Math.pow(2, 2)
        }
        else {
            ser1Flags &= Math.pow(2, 8) - 1 - Math.pow(2, 1)
        }
        //first serial
        data += privateMethods.convert1016(ser1Flags);
        data += obj.serBaudByte
        //second serial
        data += privateMethods.convert1016(ser1Flags);
        data += obj.serBaudByte

        data += obj.PropByte
        data += obj.dateBytes
        data += obj.rsvd

        let checksum = privateMethods.makeChecksum(data)
        frame = Buffer.from(constants.MESSAGE_HEADER + SETUPCHANGEREQUESTREQUEST + DATALENGTH + data + checksum, 'hex')
        if(!params.execute) {
            if(params.cb != null) {
                params.cb(null, frame);
                return;
            }
            return frame;
        }
        privateMethods.send(params.host, params.port, frame, expectedResponseFunction, params.returnRaw, params.cb)
    },
    dataByMemoryRequest: (options) => {
        console.log(options)
        const expectedResponseFunction = '80';
        let params = {...this.defaults, ...options};
        if(!params.startTime || !params.endTime) {
            cb(new Error('Start time or end time not specified'), null);
            return;
        }
        const SETUPINFO = '68';
        const DATALENGTH = '0E';
        let data = params.sensorID.toString(16).padStart(4, '0');
        data += dateFormatted.getSeconds(options.startTime);
        data += dateFormatted.getMinutes(options.startTime);
        data += dateFormatted.getHours(options.startTime);
        data += dateFormatted.getDate(options.startTime);
        data += dateFormatted.getMonth(options.startTime);
        data += dateFormatted.getYear(options.startTime);
        data += dateFormatted.getSeconds(options.endTime);
        data += dateFormatted.getMinutes(options.endTime);
        data += dateFormatted.getHours(options.endTime);
        data += dateFormatted.getDate(options.endTime);
        data += dateFormatted.getMonth(options.endTime);
        data += dateFormatted.getYear(options.endTime);
        let checksum = privateMethods.makeChecksum(data);
        frame = Buffer.from(constants.MESSAGE_HEADER + SETUPINFO + DATALENGTH + data + checksum, 'hex');
        if(!params.execute) {
            if(params.cb != null) {
                cb(null, frame);
                return;
            }
            return frame;
        }
        privateMethods.send(params.host, params.port, frame, expectedResponseFunction, params.returnRaw, params.cb)
    }
}

let privateMethods = {
    send: (host, port, frame, expectedResponseFunction, returnRaw, cb) => {
        let buf = Buffer.alloc(0);
        let client = net.connect({
            host: host,
            port: port,
        }, function () {
            console.log('Client connected');
            client.write(frame, () => {
                console.log('Data has been successfully sent')
            })
        });
        client.setTimeout(100000, (e) => {
            client.end();
            return;
        });
        client.on('data', function (data) {
            console.log(data)
            let pieceOfData = Buffer.from(data)
            buf = Buffer.concat([buf, pieceOfData]);
            setTimeout(() => {
                client.end();
            }, 10000)
        });
        client.on('error', (e) => {
            console.log('-----------------WTF-------------')
            client.end();
            cb(e, null);
            return;
        });
        client.on('end', function () {
            client.destroy();
            console.log('client disconnected');
            if (expectedResponseFunction != privateMethods.getIdentity(buf)) {
                cb(new Error('Датчик вернул неожидаемый ответ'));
                return;
            }
            if (returnRaw) {
                cb(null, buf);
            }
            else {
                privateMethods.parse(buf, cb);
            }
            return;
        });
    },
    parse: (rawData, cb) => {
        //@todo is header correct?
        let functionIdentity = privateMethods.getIdentity(rawData);
        let functionName = `res${functionIdentity}`;
        if(!privateMethods.hasOwnProperty(functionName)) {
            cb(new Error(`Не найден обработчик ${functionName} ответа`));
            return;
        }
        privateMethods[functionName](rawData, cb);
    },
    getIdentity: (rawData) => {
        return rawData[2].toString(16).toUpperCase()
    },
    getIdentityFromString: (strData) => {
        return (strData[4] + strData[5]).toUpperCase();
    },
    convert1610: (messageStr) => {
        let sum = 0;
        for(let i = messageStr.length - 1, j = 0; i >= 0 ; i--, j++) {
            sum += parseInt((messageStr[i]), 16) * Math.pow(16, j);
        }
        return sum;
    },
    convert1016: (messageInt) => {
        let str = '';
        str = parseInt(messageInt).toString(16)
        if(str.length % 2 != 0) {
            str = '0' + str
        }
        return str.toUpperCase()
    },
    checksum: (strData) => {
        let sum = chksum = 0;
        let dataCountFrame = parseInt((strData[6] + strData[7]), 16);
        let dataFrame = strData.substring(8, strData.length - 4);
        let checksumFrame = strData.substring(strData.length - 4, strData.length);

        for(let i = 0; i < dataFrame.length; i+= 2) {
            sum += parseInt((dataFrame[i] + dataFrame[i + 1]), 16);
        }
        for(let i = checksumFrame.length - 1, j = 0; i >= 0 ; i--, j++) {
            chksum += parseInt((checksumFrame[i]), 16) * Math.pow(16, j);
        }
        return sum == chksum;
    },
    makeChecksum: (rawData) => {
        let sum = 0;
        for(let i = 0; i < rawData.length; i += 2) {
            let part = rawData.substring(i, i + 2)
            sum += parseInt(part, 16);
        }
        return sum.toString(16).padStart(4, '0');
    },
    messages: (rawData) => {
        
        let strArr = [];
        let str = rawData.toString('hex').toUpperCase();
        let startIndex = 0;
        let endIndex = 0;
        let failsaveBreak = 100; //@todo total message count per request
        let running = true;
        while(running) {
            startIndex = str.indexOf(constants.MESSAGE_HEADER, startIndex);
            endIndex = str.indexOf(constants.MESSAGE_HEADER, startIndex + 4);
            if(endIndex == -1) {
                endIndex = str.length + 1;
                running = false;
            }
            strArr.push(str.slice(startIndex, endIndex));
            startIndex = endIndex;
            failsaveBreak--;
            if(failsaveBreak == 0 || running == false) {
                break;
            }
        }
        return strArr;
    },
    res40: (rawData, cb) => {
        console.log('Function40 in action');
        let obj = {};
        //header check control
        let pieceReceived = (rawData[0].toString(16) + rawData[1].toString(16)).toUpperCase();
        if(pieceReceived != 'FFAA') {
            console.log(pieceReceived);
            cb(new Error('Заголовок  пакета неверный'), null);
            return;
        }
        //Data in length control
        pieceReceived = rawData[3].toString(16).toUpperCase();
        if(pieceReceived != '12') {
            cb(new Error('Длина данных неправильная'), null);
            return;
        }
        //sensorID
        pieceReceived = parseInt((rawData[4].toString(16) + rawData[5].toString(16)), 16);
        obj.sensorid = pieceReceived;
        //MCU Rev
        pieceReceived = parseInt(rawData[6].toString(16), 16);
        obj.mcurev = pieceReceived;
        //MCU Build
        pieceReceived = parseInt(rawData[7].toString(16), 16);
        obj.mcubuild = pieceReceived;
        //MCU Chk
        pieceReceived = parseInt(rawData[8].toString(16), 16);
        obj.mcucheck = pieceReceived;
        //DSP Rev
        pieceReceived = parseInt(rawData[9].toString(16), 16);
        obj.dsprev = pieceReceived;
        //FPGA Rel
        pieceReceived = parseInt(rawData[10].toString(16), 16);
        obj.fpgarel = pieceReceived;
        //Model
        pieceReceived = parseInt(rawData[11].toString(16), 16);
        obj.model = pieceReceived;
        //Serial
        pieceReceived = parseInt(rawData[12].toString(16) + rawData[13].toString(16), 16);
        obj.serial = pieceReceived;
        cb(null, obj)
        return;
    },
    res41: (rawData, cb) => {
        let identity = '';
        let messages = privateMethods.messages(rawData);
        message = messages.shift();
        if(!privateMethods.checksum(message)) {
            cb(new Error('Контрольная сумма неправильная'), null);
            return;
        }
        identity = privateMethods.getIdentityFromString(message)

        let obj = {};
        obj.zones = privateMethods.convert1610(message[16].toString() + message[17].toString())
        obj.messagePeriod = privateMethods.convert1610(
            message[18].toString() + message[19].toString() + message[20].toString() + message[21].toString()
        )
        obj.sensitivity = privateMethods.convert1610(message[22].toString() + message[23].toString())
        let messageComposition = privateMethods.convert1610(message[24].toString() + message[25].toString())
        obj.messageCompositionByte = messageComposition
        obj.gap = (messageComposition & Math.pow(2, 7)) ? true: false
        obj.headway = (messageComposition & Math.pow(2, 6)) ? true : false
        obj.speed85 = (messageComposition & Math.pow(2, 2)) ? true : false

        let ser1 = {};
        let ser1Flags = privateMethods.convert1610(message[26].toString() + message[27].toString())
        ser1.ser1FlagsByte = ser1Flags
        ser1.ser1Protocol = (ser1Flags & Math.pow(2, 7)) ? 'X3' : 'G4'
        ser1.ser1HOccupancy  = (ser1Flags & Math.pow(2, 6)) ? true : false
        ser1.ser1Mode = (ser1Flags & Math.pow(2, 5)) ? '485' : '232'
        ser1.ser1PerVehicle = (ser1Flags & Math.pow(2, 4)) ? true : false
        ser1.ser1NormalMode = (ser1Flags & Math.pow(2, 3)) ? true : false
        ser1.ser1StatMode = ((ser1Flags & Math.pow(2, 2)) && obj.ser1NormalMode == true) ? true : false
        ser1.ser1PollMode = ((ser1Flags & Math.pow(2, 1) == 0) && obj.ser1StatMode == true) ? true : false

        ser1.ser1BaudByte =  message[28].toString() + message[29].toString()

        let ser2 = {};
        let ser2Flags = privateMethods.convert1610(message[30].toString() + message[31].toString())
        ser2.ser2FlagsByte = ser2Flags
        ser2.ser1Protocol = (ser2Flags & Math.pow(2, 7)) ? 'X3' : 'G4'
        ser2.ser1HOccupancy  = (ser2Flags & Math.pow(2, 6)) ? true : false
        ser2.ser1Mode = (ser2Flags & Math.pow(2, 5)) ? '485' : '232'
        ser2.ser1PerVehicle = (ser2Flags & Math.pow(2, 4)) ? true : false
        ser2.ser1NormalMode = (ser2Flags & Math.pow(2, 3)) ? true : false
        ser2.ser1StatMode = ((ser2Flags & Math.pow(2, 2)) && obj.ser2NormalMode == true) ? true : false
        ser2.ser1PollMode = ((ser2Flags & Math.pow(2, 1) == 0) && obj.ser2StatMode == true) ? true : false

        ser2.ser2BaudByte = message[32].toString() + message[33].toString()

        obj.serFlagsByte = ser1.ser1FlagsByte
        obj.serProtocol = ser1.ser1Protocol
        obj.serHOccupancy = ser1.serHOccupancy
        obj.serMode = ser1.ser1Mode
        obj.serPerVehicle = ser1.ser1PerVehicle
        obj.serNormalMode = ser1.ser1NormalMode
        obj.serStatMode = ser1.ser1StatMode
        obj.serPollMode = ser1.ser1PollMode
        obj.serBaudByte = ser1.ser1BaudByte

        obj.PropByte = message[34].toString() + message[35].toString()

        let date =
            message[36].toString() + message[37].toString() +
            message[38].toString() + message[39].toString() +
            message[40].toString() + message[41].toString()
        obj.dateBytes = date

        let rsvd =
            message[42].toString() + message[43].toString()
            message[44].toString() + message[45].toString()
        obj.rsvd = rsvd
        cb(null, obj)
        return;
    },
    //@todo
    res1C: (rawData, cb) => {
        let identity = '';
        let messages = privateMethods.messages(rawData);
        messages.forEach(message => {
            if(!privateMethods.checksum(message)) {
                cb(new Error('Контрольная сумма неправильная'), null);
                return;
            }
        });

        if(messages.length == 1) {
            let message = messages.pop();
            identity = privateMethods.getIdentityFromString(message)
            if(identity == constants.RESPONSE_CODE_ACK) {
                cb(null, {});
                return;
            }
            else {
                cb(new Error(constants.ERROR_MESSAGE_HEADER_FRAME_NOT_AS_EXPECTED), null);
                return;
            }
        }        
    },
    res49: (rawData, cb) => {
        let identity = '';
        let messages = privateMethods.messages(rawData);
        message = messages.shift();
        if(!privateMethods.checksum(message)) {
            cb(new Error('Контрольная сумма неправильная'), null);
            return;
        }
        identity = privateMethods.getIdentityFromString(message)

        let obj = {};
        pieceSeconds = message[12].toString() + message[13].toString();
        pieceMinutes = message[14].toString() + message[15].toString();
        pieceHours = message[16].toString() + message[17].toString();
        pieceDate = message[20].toString() + message[21].toString();
        pieceMonth = message[22].toString() + message[23].toString();
        //@todo
        pieceYear = `20${message[24].toString()}${message[25].toString()}`;
        obj.currentDateTime = new Date(pieceYear + '-' + pieceMonth + '-' + pieceDate + ' ' + pieceHours + ':' + pieceMinutes + ':' + pieceSeconds);
        cb(null, obj)
        return;
    },
    res80: (rawData, cb) => {
        let data = [];
        let obj = {}; //in order to eliminate errors
        let messages = privateMethods.messages(rawData);
        messages.forEach((message, index) => {
            if(!privateMethods.checksum(message)) {
                cb(new Error('Контрольная сумма неправильная'), null);
                return;
            }
            let identity = privateMethods.getIdentityFromString(message)
            let dataCountFrame = null;
            let dataFrame = null;
            let zoneData = [];
            switch(identity) {
                case '80': //Header frame
                    obj = {};
                    let statFlags = privateMethods.convert1610(message[18].toString() + message[19].toString())
                    obj.measurementType = (statFlags & Math.pow(2, 0)) ? 'MPH' : 'km/h'
                    let date = '20' + //@todo
                    message[32].toString() + message[33].toString() + "-" +
                    message[30].toString() + message[31].toString() + "-" +
                    message[28].toString() + message[29].toString() + " " +
                    message[24].toString() + message[25].toString() + ":" +
                    message[22].toString() + message[23].toString() + ":" +
                    message[20].toString() + message[21].toString()
                    obj.date = new Date(date)
                    obj.customdate = dateFormatted.getFormatted(obj.date)
                    break;
                case '10': //Data frame: Volume
                    dataCountFrame = parseInt((message[6] + message[7]), 16);
                    dataFrame = message.substring(8, message.length - 4);
                    zoneData = [];
                    for(let i = 0; i < dataFrame.length; i+= 4) {
                        totalForZone = parseInt((dataFrame[i] + dataFrame[i + 1] + dataFrame[i + 2] + dataFrame[i + 3]), 16)
                        zoneData.push(totalForZone)
                    }
                    obj.volume = zoneData
                    break;
                case '11': //Data frame: Occupancy
                    dataCountFrame = parseInt((message[6] + message[7]), 16);
                    dataFrame = message.substring(8, message.length - 4);
                    zoneData = [];
                    for(let i = 0; i < dataFrame.length; i+= 4) {
                        totalForZone = parseInt((dataFrame[i] + dataFrame[i + 1] + dataFrame[i + 2] + dataFrame[i + 3]), 16)
                        zoneData.push(totalForZone)
                    }
                    obj.occupancy = zoneData
                    break;
                case '12': //Data frame: Speed
                    dataCountFrame = parseInt((message[6] + message[7]), 16);
                    dataFrame = message.substring(8, message.length - 4);
                    zoneData = [];
                    for(let i = 0; i < dataFrame.length; i+= 4) {
                        totalForZone = parseInt((dataFrame[i] + dataFrame[i + 1] + dataFrame[i + 2] + dataFrame[i + 3]), 16)
                        zoneData.push(totalForZone)
                    }
                    obj.speed = zoneData
                    break;
                case '13': //Data frame: Gap
                    dataCountFrame = parseInt((message[6] + message[7]), 16);
                    dataFrame = message.substring(8, message.length - 4);
                    zoneData = [];
                    for(let i = 0; i < dataFrame.length; i+= 4) {
                        totalForZone = parseInt((dataFrame[i] + dataFrame[i + 1] + dataFrame[i + 2] + dataFrame[i + 3]), 16)
                        zoneData.push(totalForZone)
                    }
                    obj.gap = zoneData
                    break;
                case '14': //Data frame: Vehicle class C1
                    dataCountFrame = parseInt((message[6] + message[7]), 16);
                    dataFrame = message.substring(8, message.length - 4);
                    zoneData = [];
                    for(let i = 0; i < dataFrame.length; i+= 4) {
                        totalForZone = parseInt((dataFrame[i] + dataFrame[i + 1] + dataFrame[i + 2] + dataFrame[i + 3]), 16)
                        zoneData.push(totalForZone)
                    }
                    if(obj.class == undefined) {
                        obj.class = []
                    }
                    obj.class[1] = [].concat(zoneData)
                    break;
                case '15': //Data frame: Vehicle class C2
                    dataCountFrame = parseInt((message[6] + message[7]), 16);
                    dataFrame = message.substring(8, message.length - 4);
                    zoneData = [];
                    for(let i = 0; i < dataFrame.length; i+= 4) {
                        totalForZone = parseInt((dataFrame[i] + dataFrame[i + 1] + dataFrame[i + 2] + dataFrame[i + 3]), 16)
                        zoneData.push(totalForZone)
                    }
                    if(obj.class == undefined) {
                        obj.class = []
                    }
                    obj.class[2] = [].concat(zoneData)
                    break;
                case '16': //Data frame: Vehicle class C3
                    dataCountFrame = parseInt((message[6] + message[7]), 16);
                    dataFrame = message.substring(8, message.length - 4);
                    zoneData = [];
                    for(let i = 0; i < dataFrame.length; i+= 4) {
                        totalForZone = parseInt((dataFrame[i] + dataFrame[i + 1] + dataFrame[i + 2] + dataFrame[i + 3]), 16)
                        zoneData.push(totalForZone)
                    }
                    if(obj.class == undefined) {
                        obj.class = []
                    }
                    obj.class[3] = [].concat(zoneData)
                    break;
                case '17': //Data frame: Vehicle class C4
                    dataCountFrame = parseInt((message[6] + message[7]), 16);
                    dataFrame = message.substring(8, message.length - 4);
                    zoneData = [];
                    for(let i = 0; i < dataFrame.length; i+= 4) {
                        totalForZone = parseInt((dataFrame[i] + dataFrame[i + 1] + dataFrame[i + 2] + dataFrame[i + 3]), 16)
                        zoneData.push(totalForZone)
                    }
                    if(obj.class == undefined) {
                        obj.class = []
                    }
                    obj.class[4] = [].concat(zoneData)
                    break;
                case '18': //Data frame: Vehicle class C5
                    dataCountFrame = parseInt((message[6] + message[7]), 16);
                    dataFrame = message.substring(8, message.length - 4);
                    zoneData = [];
                    for(let i = 0; i < dataFrame.length; i+= 4) {
                        totalForZone = parseInt((dataFrame[i] + dataFrame[i + 1] + dataFrame[i + 2] + dataFrame[i + 3]), 16)
                        zoneData.push(totalForZone)
                    }
                    if(obj.class == undefined) {
                        obj.class = []
                    }
                    obj.class[5] = [].concat(zoneData)
                    break;
                case '1E': //Data frame: Headway
                    dataCountFrame = parseInt((message[6] + message[7]), 16);
                    dataFrame = message.substring(8, message.length - 4);
                    zoneData = [];
                    for(let i = 0; i < dataFrame.length; i+= 4) {
                        totalForZone = parseInt((dataFrame[i] + dataFrame[i + 1] + dataFrame[i + 2] + dataFrame[i + 3]), 16)
                        zoneData.push(totalForZone)
                    }
                    obj.headway = zoneData
                    break;
                case '1F': //Data frame: Speed_85
                    dataCountFrame = parseInt((message[6] + message[7]), 16);
                    dataFrame = message.substring(8, message.length - 4);
                    zoneData = [];
                    for(let i = 0; i < dataFrame.length; i+= 4) {
                        totalForZone = parseInt((dataFrame[i] + dataFrame[i + 1] + dataFrame[i + 2] + dataFrame[i + 3]), 16)
                        zoneData.push(totalForZone)
                    }
                    obj.speed85 = zoneData
                    break;
                case '81': //Footer frame
                    //no information needed from this frame
                    data.push(obj)
                    break;
                case '1C': //messages separator
                    break;
            }
        });
        cb(null, data)
    }
}

module.exports = requestMethods