import {CARTA} from "carta-protobuf";
import {
    stringToUint8Array, 
    getEventName,
    sleep,
} from "./testUtilityFunction";

let WebSocket = require('ws');
let testServerUrl = "ws://localhost:50505";
let testFileName = "aJ.fits";
let fileType = CARTA.FileType.FITS;
let testSubdirectoryName = "QA";
// let expectRootPath = "/Users/acdc/CARTA/Images"; // For ASIAA backend
let expectRootPath = ""; // For NRAO backend
let connectTimeoutLocal = 1000;
let testEventName = "FILE_LIST_REQUEST";
let testReturnName = "FILE_LIST_RESPONSE";

describe("Websocket tests", () => {
    test(`establish a connection to ${testServerUrl}.`, 
    done => {
        // Construct a Websocket
        let Connection = new WebSocket(testServerUrl);

        // While open a Websocket
        Connection.onopen = () => {
            Connection.close();
            done();     // Return to this test
        };
    }, connectTimeoutLocal);
});

describe("GET_FILELIST_ROOTPATH tests", () => {    

    test(`send EventName: "REGISTER_VIEWER" to CARTA "${testServerUrl}" with no session_id & api_key "1234".`, 
    done => {
        // Construct a Websocket
        let Connection = new WebSocket(testServerUrl);
        Connection.binaryType = "arraybuffer";

        // While open a Websocket
        Connection.onopen = () => {
            
            // Checkout if Websocket server is ready
            if (Connection.readyState == WebSocket.OPEN) {
                // Preapare the message on a eventData
                const message = CARTA.RegisterViewer.create({sessionId: "", apiKey: "1234"});
                let payload = CARTA.RegisterViewer.encode(message).finish();
                let eventData = new Uint8Array(32 + 4 + payload.byteLength);

                eventData.set(stringToUint8Array("REGISTER_VIEWER", 32));
                eventData.set(new Uint8Array(new Uint32Array([1]).buffer), 32);
                eventData.set(payload, 36);

                Connection.send(eventData);
            } else {
                console.log(`"${testEventName}" can not open a connection.`);
            }

        };

        // While receive a message in the form of arraybuffer
        Connection.onmessage = (event: MessageEvent) => {
            expect(event.data.byteLength).toBeGreaterThan(0);

            Connection.close();
            done();
        };

    }, connectTimeoutLocal);

    test(`send EventName: "${testReturnName}" to CARTA "${testServerUrl}".`, 
    done => {
        // Construct a Websocket
        let Connection = new WebSocket(testServerUrl);
        Connection.binaryType = "arraybuffer";

        // While open a Websocket
        Connection.onopen = () => {
            
            // Checkout if Websocket server is ready
            if (Connection.readyState == WebSocket.OPEN) {
                // Preapare the message on a eventData
                const message = CARTA.RegisterViewer.create({sessionId: "", apiKey: "1234"});
                let payload = CARTA.RegisterViewer.encode(message).finish();
                let eventData = new Uint8Array(32 + 4 + payload.byteLength);

                eventData.set(stringToUint8Array("REGISTER_VIEWER", 32));
                eventData.set(new Uint8Array(new Uint32Array([1]).buffer), 32);
                eventData.set(payload, 36);

                Connection.send(eventData);
            } else {
                console.log(`"${testEventName}" can not open a connection.`);
            }

        };

        // While receive a message in the form of arraybuffer
        Connection.onmessage = (event: MessageEvent) => {
            const eventName = getEventName(new Uint8Array(event.data, 0, 32));
            if(eventName == "REGISTER_VIEWER_ACK"){
                // Preapare the message on a eventData
                const message = CARTA.FileListRequest.create({directory: ""});
                let payload = CARTA.FileListRequest.encode(message).finish();
                const eventDataTx = new Uint8Array(32 + 4 + payload.byteLength);
    
                eventDataTx.set(stringToUint8Array(testEventName, 32));
                eventDataTx.set(new Uint8Array(new Uint32Array([1]).buffer), 32);
                eventDataTx.set(payload, 36);
    
                Connection.send(eventDataTx);
            } 
            if(eventName == testReturnName){
                done();
            }
        }

    }, connectTimeoutLocal);

    describe(`receive EventName: "${testReturnName}" tests on CARTA ${testServerUrl}`, 
    () => {

        let Connection: WebSocket;
    
        beforeEach( done => {
            // Construct a Websocket
            Connection = new WebSocket(testServerUrl);
            Connection.binaryType = "arraybuffer";
    
            // While open a Websocket
            Connection.onopen = () => {
                // Preapare the message on a eventData
                const message = CARTA.RegisterViewer.create({sessionId: "", apiKey: "1234"});
                let payload = CARTA.RegisterViewer.encode(message).finish();
                let eventData = new Uint8Array(32 + 4 + payload.byteLength);

                // Checkout if Websocket server is ready
                if (Connection.readyState === WebSocket.OPEN) {
                    // Send event: "REGISTER_VIEWER"
                    eventData.set(stringToUint8Array("REGISTER_VIEWER", 32));
                    eventData.set(new Uint8Array(new Uint32Array([1]).buffer), 32);
                    eventData.set(payload, 36);
    
                    Connection.send(eventData);
                } else {
                    console.log(`"${testEventName}" can not open a connection.`);
                    Connection.close();
                }
            };

            // While receive a message
            Connection.onmessage = (event: MessageEvent) => {
                const eventName = getEventName(new Uint8Array(event.data, 0, 32));
                if(eventName == "REGISTER_VIEWER_ACK"){
                    // Preapare the message on a eventData
                    const message = CARTA.FileListRequest.create({directory: ""});
                    let payload = CARTA.FileListRequest.encode(message).finish();
                    const eventDataTx = new Uint8Array(32 + 4 + payload.byteLength);
        
                    eventDataTx.set(stringToUint8Array(testEventName, 32));
                    eventDataTx.set(new Uint8Array(new Uint32Array([1]).buffer), 32);
                    eventDataTx.set(payload, 36);
        
                    Connection.send(eventDataTx); 
                    done();
                }
            };
        }, connectTimeoutLocal);
    
        test(`assert the received EventName is "${testReturnName}" within ${connectTimeoutLocal * 1e-3} seconds.`, 
        done => {
            // While receive a message from Websocket server
            Connection.onmessage = (event: MessageEvent) => {
                const eventName = getEventName(new Uint8Array(event.data, 0, 32));
                if(eventName == testReturnName){
                    expect(event.data.byteLength).toBeGreaterThan(40);
                    
                    const eventName = getEventName(new Uint8Array(event.data, 0, 32));
                    expect(eventName).toBe(testReturnName);
                }

                Connection.close();
                done();
            }
        }, connectTimeoutLocal);
    
        test(`assert the "${testReturnName}.success" is true.`, 
        done => {
            // While receive a message from Websocket server
            Connection.onmessage = (event: MessageEvent) => {
                const eventName = getEventName(new Uint8Array(event.data, 0, 32));
                if(eventName == testReturnName){
                    const eventData = new Uint8Array(event.data, 36);
                    expect(CARTA.FileListResponse.decode(eventData).success).toBe(true);
                }

                Connection.close();
                done();
            }
        }, connectTimeoutLocal);  

        test(`assert the "${testReturnName}.parent" is None.`, 
        done => {
            // While receive a message from Websocket server
            Connection.onmessage = (event: MessageEvent) => {
                const eventName = getEventName(new Uint8Array(event.data, 0, 32));
                if(eventName == testReturnName){
                    const eventName = getEventName(new Uint8Array(event.data, 0, 32));
                    const eventId = new Uint32Array(event.data, 32, 1)[0];
                    const eventData = new Uint8Array(event.data, 36);

                    let parsedMessage;
                    if (eventName === testReturnName) {
                        parsedMessage = CARTA.FileListResponse.decode(eventData);
                    }
                    expect(parsedMessage.parent).toBe("");
                }

                Connection.close();
                done();
            }
    
        }, connectTimeoutLocal);

        test(`assert the "${testReturnName}.directory" is root path "${expectRootPath}".`, 
        done => {
            // While receive a message from Websocket server
            Connection.onmessage = (event: MessageEvent) => {
                const eventName = getEventName(new Uint8Array(event.data, 0, 32));
                if(eventName == testReturnName){
                    const eventName = getEventName(new Uint8Array(event.data, 0, 32));
                    const eventId = new Uint32Array(event.data, 32, 1)[0];
                    const eventData = new Uint8Array(event.data, 36);

                    let parsedMessage;
                    if (eventName === testReturnName) {
                        parsedMessage = CARTA.FileListResponse.decode(eventData);
                    }
                    expect(parsedMessage.directory).toBe(expectRootPath);
                }

                Connection.close();
                done();
            }
    
        }, connectTimeoutLocal);

        test(`assert the file "${testFileName}" is existed.`, 
        done => {
            // While receive a message from Websocket server
            Connection.onmessage = (event: MessageEvent) => {
                const eventName = getEventName(new Uint8Array(event.data, 0, 32));
                if(eventName == testReturnName){
                    const eventName = getEventName(new Uint8Array(event.data, 0, 32));
                    const eventId = new Uint32Array(event.data, 32, 1)[0];
                    const eventData = new Uint8Array(event.data, 36);

                    let parsedMessage;
                    if (eventName === testReturnName) {
                        parsedMessage = CARTA.FileListResponse.decode(eventData);
                    }

                    let fileInfo = parsedMessage.files.find(f => f.name === testFileName);
                    expect(fileInfo).toBeDefined();
                    expect(fileInfo.type).toBe(fileType);
                }

                done();                
                Connection.close();
            }
    
        }, connectTimeoutLocal);
    
        test(`assert the subdirectory "${testSubdirectoryName}" is existed.`, 
        done => {
            // While receive a message from Websocket server
            Connection.onmessage = (event: MessageEvent) => {
                const eventName = getEventName(new Uint8Array(event.data, 0, 32));
                if(eventName == testReturnName){
                    const eventName = getEventName(new Uint8Array(event.data, 0, 32));
                    const eventId = new Uint32Array(event.data, 32, 1)[0];
                    const eventData = new Uint8Array(event.data, 36);

                    let parsedMessage;
                    if (eventName === testReturnName) {
                        parsedMessage = CARTA.FileListResponse.decode(eventData);
                    }

                    let folderInfo = parsedMessage.subdirectories.find(f => f === testSubdirectoryName);
                    expect(folderInfo).toBeDefined();
                }

                Connection.close();
                done();
            }
        }, connectTimeoutLocal);

        test(`assert the ".." is not existed.`, 
        done => {
            // While receive a message from Websocket server
            Connection.onmessage = (event: MessageEvent) => {
                const eventName = getEventName(new Uint8Array(event.data, 0, 32));
                if(eventName == testReturnName){
                    const eventName = getEventName(new Uint8Array(event.data, 0, 32));
                    const eventId = new Uint32Array(event.data, 32, 1)[0];
                    const eventData = new Uint8Array(event.data, 36);

                    let parsedMessage;
                    if (eventName === testReturnName) {
                        parsedMessage = CARTA.FileListResponse.decode(eventData);
                    }

                    let folderInfo = parsedMessage.subdirectories.find(f => f === "..");
                    expect(folderInfo).toBeUndefined();
                }

                Connection.close();
                done();
            }
        }, connectTimeoutLocal);
    
    });
});

describe("GET_FILELIST_UNKNOWNPATH tests", () => {    

    test(`send EventName: "REGISTER_VIEWER" to CARTA "${testServerUrl}" with no session_id & api_key "1234".`, 
    done => {
        // Construct a Websocket
        let Connection = new WebSocket(testServerUrl);
        Connection.binaryType = "arraybuffer";

        // While open a Websocket
        Connection.onopen = () => {
            
            // Checkout if Websocket server is ready
            if (Connection.readyState == WebSocket.OPEN) {
                // Preapare the message on a eventData
                const message = CARTA.RegisterViewer.create({sessionId: "", apiKey: "1234"});
                let payload = CARTA.RegisterViewer.encode(message).finish();
                let eventData = new Uint8Array(32 + 4 + payload.byteLength);

                eventData.set(stringToUint8Array("REGISTER_VIEWER", 32));
                eventData.set(new Uint8Array(new Uint32Array([1]).buffer), 32);
                eventData.set(payload, 36);

                Connection.send(eventData);
            } else {
                console.log(`"${testEventName}" can not open a connection.`);
            }

        };

        // While receive a message in the form of arraybuffer
        Connection.onmessage = (event: MessageEvent) => {
            expect(event.data.byteLength).toBeGreaterThan(0);

            Connection.close();
            done();
        };

    }, connectTimeoutLocal);

    test(`send EventName: "${testReturnName}" to CARTA "${testServerUrl}".`, 
    done => {
        // Construct a Websocket
        let Connection = new WebSocket(testServerUrl);
        Connection.binaryType = "arraybuffer";

        // While open a Websocket
        Connection.onopen = () => {
            
            // Checkout if Websocket server is ready
            if (Connection.readyState == WebSocket.OPEN) {
                // Preapare the message on a eventData
                const message = CARTA.RegisterViewer.create({sessionId: "", apiKey: "1234"});
                let payload = CARTA.RegisterViewer.encode(message).finish();
                let eventData = new Uint8Array(32 + 4 + payload.byteLength);

                eventData.set(stringToUint8Array("REGISTER_VIEWER", 32));
                eventData.set(new Uint8Array(new Uint32Array([1]).buffer), 32);
                eventData.set(payload, 36);

                Connection.send(eventData);
            } else {
                console.log(`"${testEventName}" can not open a connection.`);
            }

        };

        // While receive a message in the form of arraybuffer
        Connection.onmessage = (event: MessageEvent) => {
            const eventName = getEventName(new Uint8Array(event.data, 0, 32));
            if(eventName == "REGISTER_VIEWER_ACK"){
                // Preapare the message on a eventData
                const message = CARTA.FileListRequest.create({directory: ""});
                let payload = CARTA.FileListRequest.encode(message).finish();
                const eventDataTx = new Uint8Array(32 + 4 + payload.byteLength);
    
                eventDataTx.set(stringToUint8Array(testEventName, 32));
                eventDataTx.set(new Uint8Array(new Uint32Array([1]).buffer), 32);
                eventDataTx.set(payload, 36);
    
                Connection.send(eventDataTx);
            } 
            if(eventName == testReturnName){
                done();
            }
        }

    }, connectTimeoutLocal);

    describe(`receive EventName: "${testReturnName}" tests on CARTA ${testServerUrl}`, 
    () => {

        let Connection: WebSocket;
    
        beforeEach( done => {
            // Construct a Websocket
            Connection = new WebSocket(testServerUrl);
            Connection.binaryType = "arraybuffer";
    
            // While open a Websocket
            Connection.onopen = () => {
                // Preapare the message on a eventData
                const message = CARTA.RegisterViewer.create({sessionId: "", apiKey: "1234"});
                let payload = CARTA.RegisterViewer.encode(message).finish();
                let eventData = new Uint8Array(32 + 4 + payload.byteLength);

                // Checkout if Websocket server is ready
                if (Connection.readyState === WebSocket.OPEN) {
                    // Send event: "REGISTER_VIEWER"
                    eventData.set(stringToUint8Array("REGISTER_VIEWER", 32));
                    eventData.set(new Uint8Array(new Uint32Array([1]).buffer), 32);
                    eventData.set(payload, 36);
    
                    Connection.send(eventData);
                } else {
                    console.log(`"${testEventName}" can not open a connection.`);
                    Connection.close();
                }
            };

            // While receive a message
            Connection.onmessage = (event: MessageEvent) => {
                const eventName = getEventName(new Uint8Array(event.data, 0, 32));
                if(eventName == "REGISTER_VIEWER_ACK"){
                    // Preapare the message on a eventData
                    const message = CARTA.FileListRequest.create({directory: ""});
                    let payload = CARTA.FileListRequest.encode(message).finish();
                    const eventDataTx = new Uint8Array(32 + 4 + payload.byteLength);
        
                    eventDataTx.set(stringToUint8Array(testEventName, 32));
                    eventDataTx.set(new Uint8Array(new Uint32Array([1]).buffer), 32);
                    eventDataTx.set(payload, 36);
        
                    Connection.send(eventDataTx);
                }
                if(eventName == testReturnName){
                    // Preapare the message on a eventData
                    const message = CARTA.FileListRequest.create({directory: "/unknown/path"});
                    let payload = CARTA.FileListRequest.encode(message).finish();
                    const eventDataTx = new Uint8Array(32 + 4 + payload.byteLength);
        
                    eventDataTx.set(stringToUint8Array(testEventName, 32));
                    eventDataTx.set(new Uint8Array(new Uint32Array([1]).buffer), 32);
                    eventDataTx.set(payload, 36);
        
                    Connection.send(eventDataTx);
                    done();
                }
            };
        }, connectTimeoutLocal);
    
        test(`assert the received EventName is "${testReturnName}" within ${connectTimeoutLocal * 1e-3} seconds.`, 
        done => {
            // While receive a message from Websocket server
            Connection.onmessage = (event: MessageEvent) => {
                const eventName = getEventName(new Uint8Array(event.data, 0, 32));
                if(eventName == testReturnName){
                    expect(event.data.byteLength).toBeGreaterThan(40);
                    
                    const eventName = getEventName(new Uint8Array(event.data, 0, 32));
                    expect(eventName).toBe(testReturnName);
                }

                Connection.close();
                done();
            }
        }, connectTimeoutLocal);
    
        test(`assert the "${testReturnName}.success" is false.`, 
        done => {
            // While receive a message from Websocket server
            Connection.onmessage = (event: MessageEvent) => {
                const eventName = getEventName(new Uint8Array(event.data, 0, 32));
                if(eventName == testReturnName){
                    const eventData = new Uint8Array(event.data, 36);
                    expect(CARTA.FileListResponse.decode(eventData).success).toBe(false);
                }

                Connection.close();
                done();
            }
        }, connectTimeoutLocal); 

        test(`assert the "${testReturnName}.message" is not None.`, 
        done => {
            // While receive a message from Websocket server
            Connection.onmessage = (event: MessageEvent) => {
                const eventName = getEventName(new Uint8Array(event.data, 0, 32));
                if(eventName == testReturnName){
                    const eventData = new Uint8Array(event.data, 36);
                    expect(CARTA.FileListResponse.decode(eventData).message).toBeDefined();
                    console.log(`As given a unknown path, returned message: "` + CARTA.FileListResponse.decode(eventData).message + `"`);
                }

                Connection.close();
                done();
            }
        }, connectTimeoutLocal); 

    });
});
