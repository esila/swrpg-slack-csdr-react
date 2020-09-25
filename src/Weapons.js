import React, {useEffect, useRef, useState} from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { fabric } from 'fabric';
import {createFabricObject as createFabricObjectMutation, updateFabricObject as updateFabricObjectMutation} from "./graphql/mutations";
import {onUpdateFabricObject} from "./graphql/subscriptions";
import {listFabricObjects} from "./graphql/queries";

const initialState = {
    version: "3.6.3",
    objects: []
};

function MapCanvas({ fabricObjects }) {
    const canvasEl = useRef(null);
    const [canvasState, setCanvasState] = useState(initialState);


    useEffect(() => {
        initCanvas();
    }, [canvasEl]);

    function initCanvas() {
        const canvas = new fabric.Canvas(canvasEl.current);
        //const canvas = new fabric.Canvas(canvasEl.current);
        let canvasDict = {};

        const fabricData = fabricObjects.map((elem, idx) => {
            //console.log(elem);
            canvasDict[elem.fabricId] = elem.id;
            return elem.data;
        });
        canvas.loadFromJSON(`{"objects": [${fabricData}]}`);
        //console.log(`CANVAS: ${JSON.stringify(canvas.toJSON(['fabricId']))}`);

        canvas.on({
            'object:moved': (e) => {
                const fabricId = e.target.toJSON(['fabricId']).fabricId;
                const graphId = canvasDict[fabricId];
                const resp = updateFabricObject(graphId, JSON.stringify(e.target.toJSON(['fabricId'])));
                console.log(`UPDATE RESP: ${JSON.stringify(resp)}`);
                //console.log(JSON.stringify(e.target.toJSON(['fabricId'])));
            }
        });
        // UseEffect's cleanup function
        return () => {
          canvas.dispose();
        };
    }

    async function updateFabricObject(graphId, fabricData) {
        console.log("GOT HERE");
        console.log(`UPDATE INPUT: ${JSON.stringify(fabricData)} / ${graphId}`);
        if (!fabricData || !graphId) return;
        console.log("GOT PAST DATA TYPE");
        await API.graphql({query: updateFabricObjectMutation, variables: {
            input: {
                id: graphId,
                data: fabricData
            }}})
            .then(success => {
                console.log(`SUCCESS: ${JSON.stringify(success)}`);
            },
                error => {
                console.log(`ERROR: ${JSON.stringify(error)}`);
            })
    }
    return fabricObjects.length > 0 ? (
        <>
            <canvas ref={canvasEl} id="my-fabric-canvas" width="400" height="300" />
        </>
    ):
        <div></div>
}

function Weapons() {
    const [fabricObjects, setFabricObjects] = useState([]);

    // useRef to update current fabricObjects since I can't seem to access state in the async subscribe
    const latestFabricObjects = useRef([]);
    latestFabricObjects.current = fabricObjects;

    useEffect(() => {
        fetchFabricObjects();
        subscribeFabricObjects();
        //initializeCanvas();
    }, []);

    async function fetchFabricObjects() {
        const apiData = await API.graphql({query: listFabricObjects });
        setFabricObjects(apiData.data.listFabricObjects.items);
    }

    function initializeCanvas() {
        const canvas = new fabric.Canvas("my-fabric-canvas");
        canvas.on({
            'object:added': (e) => {
                const fabricId = `${Date.now()}`;
                if (!e.target.fabricId) {
                    e.target.set('fabricId', fabricId);
                    e.target.toJSON = (function(toJSON) {
                        return function() {
                            return fabric.util.object.extend(toJSON.call(this), {
                                fabricId: this.fabricId,
                            });
                        };
                    })(e.target.toJSON);
                }
                //console.log(JSON.stringify(e.target));
                const resp = createFabricObject(fabricId, JSON.stringify(e.target));
                //console.log(`RESP: ${JSON.stringify(resp)}`);
            }
        });

        const rect = new fabric.Rect({
            width: 50,
            height: 50,
            fill: "blue",
            angle: 10,
            top: 20,
            left: 20
        });
        const textbox = new fabric.Textbox("Click on the Rectangle to move it.", {
            fontSize: 20,
            left: 50,
            top: 100,
            width: 200
        });
        canvas.add(textbox);
        canvas.add(rect);

        // UseEffect's cleanup function
        return () => {
          canvas.dispose();
        };
    }

    async function subscribeFabricObjects() {
        await API.graphql(graphqlOperation(onUpdateFabricObject)).subscribe({
            next: subonUpdateFabricObject => {
                console.log(`subscribed message: ${JSON.stringify(subonUpdateFabricObject.value.data.onUpdateFabricObject)}`);
                setFabricObjects([subonUpdateFabricObject.value.data.onUpdateFabricObject]);
                fetchFabricObjects();
            }
        })
    }

    async function createFabricObject(fabricId, fabricData) {
        //console.log("GOT HERE");
        //console.log(`CREATE INPUT: ${JSON.stringify(fabricData)} / ${fabricId}`);
        if (!fabricData || !fabricId) return;
        //console.log("GOT PAST DATA TYPE");
        await API.graphql({query: createFabricObjectMutation, variables: {
            input: {
                fabricId: fabricId,
                data: fabricData
            }}})
            .then(success => {
                console.log(`SUCCESS: ${JSON.stringify(success)}`);
            },
                error => {
                console.log(`ERROR: ${JSON.stringify(error)}`);
            })
    }

    return fabricObjects.length > 0 ? (
        <div>
            <h1>Weapons</h1>
            <MapCanvas fabricObjects={fabricObjects}/>
        </div>
    ):
        <div></div>
}

export default Weapons