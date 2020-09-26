import React, {useContext, useEffect, useRef, useState} from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { fabric } from 'fabric';
import {
    createFabricObject as createFabricObjectMutation,
    deleteFabricObject as deleteFabricObjectMutation,
    updateFabricObject as updateFabricObjectMutation
} from "./graphql/mutations";
import {onUpdateFabricObject} from "./graphql/subscriptions";
import {listFabricObjects} from "./graphql/queries";
import { UserContext} from "./App";

function Visuals() {
    const [fabricObjects, setFabricObjects] = useState([]);

    useEffect(() => {
        fetchFabricObjects();
        subscribeFabricObjects();
        //initializeCanvas();
    }, []);

    async function fetchFabricObjects() {
        const apiData = await API.graphql({query: listFabricObjects });
        setFabricObjects(apiData.data.listFabricObjects.items);
    }

    async function subscribeFabricObjects() {
        await API.graphql(graphqlOperation(onUpdateFabricObject)).subscribe({
            next: subonUpdateFabricObject => {
                console.log(`subscribed message: ${JSON.stringify(subonUpdateFabricObject.value.data.onUpdateFabricObject)}`);
                //setFabricObjects([subonUpdateFabricObject.value.data.onUpdateFabricObject]);
                fetchFabricObjects();
            }
        })
    }

    return fabricObjects.length > 0 ? (
        <div>
            <MapCanvas fabricObjects={fabricObjects}/>
        </div>
    ):
        <div></div>
}

function MapCanvas({ fabricObjects }) {
    const user = useContext(UserContext);
    const canvasEl = useRef(null);
    const [canvasState, setCanvasState] = useState();

    useEffect(() => {
        initCanvas();
        //addToCanvas();
    }, [fabricObjects]);

    function initCanvas() {
        const canvas = canvasState || new fabric.Canvas(canvasEl.current);
        let canvasDict = {};

        const fabricData = fabricObjects.map((elem, idx) => {
            console.log(elem);
            canvasDict[elem.fabricId] = elem.id;
            return elem.data;
        });
        canvas.loadFromJSON(`{"objects": [${fabricData}]}`);
        //console.log(`CANVAS: ${JSON.stringify(canvas.toJSON(['fabricId']))}`);

        !canvasState && canvas.on({
            'object:modified': (e) => {
                const fabricId = e.target.toJSON(['fabricId']).fabricId;
                const graphId = canvasDict[fabricId];
                const resp = updateFabricObject(graphId, JSON.stringify(e.target.toJSON(['fabricId'])));
                //console.log(`UPDATE RESP: ${JSON.stringify(resp)}`);
                //console.log(JSON.stringify(e.target.toJSON(['fabricId'])));
            }
        });

        canvas.setBackgroundImage("https://triumphdespair.files.wordpress.com/2012/11/range-bands.jpg",
            canvas.renderAll.bind(canvas), {
                scaleX: .35,
                scaleY: .35,
                backgroundImageOpacity: 0.5,
            }
        );

        setCanvasState(canvas);
        // UseEffect's cleanup function
        return () => {
          canvas.dispose();
        };
    }

    function addToCanvas() {
        const canvas = canvasState || new fabric.Canvas(canvasEl.current);
        canvasState && canvas.on({
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
                console.log(JSON.stringify(e.target));
                const resp = createFabricObject(fabricId, JSON.stringify(e.target));
                console.log(`RESP: ${JSON.stringify(resp)}`);
            }
        });

        canvasState && fabric.Image.fromURL('http://kndr.io/ts/swt1/i/BothanMale-Ota2.png', function(myImg) {
            //i create an extra var for to change some image properties
             const img1 = myImg.set({
                 left:0,
                 top: 0,
                 scaleX: .4,
                 scaleY: .4,
             });
             canvas.add(img1);
        });

        // UseEffect's cleanup function
        return () => {
          canvas.dispose();
        };
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

    async function deleteFabricObject({ id }) {
        await API.graphql({ query: deleteFabricObjectMutation, variables: { input: { id } }});
    }

    async function updateFabricObject(graphId, fabricData) {
        //console.log("GOT HERE");
        //console.log(`UPDATE INPUT: ${JSON.stringify(fabricData)} / ${graphId}`);
        if (!fabricData || !graphId) return;
        //console.log("GOT PAST DATA TYPE");
        await API.graphql({query: updateFabricObjectMutation, variables: {
            input: {
                id: graphId,
                data: fabricData
            }}})
            .then(success => {
                //console.log(`SUCCESS: ${JSON.stringify(success)}`);
            },
                error => {
                //console.log(`ERROR: ${JSON.stringify(error)}`);
            })
    }
    return fabricObjects.length > 0 ? (
        <>
            {user === "esilax" &&
                <>
                <button
                    onClick={() => addToCanvas()}
                >Add Elements</button>
                <button
                    className="chat__delete"
                    onClick={(event) => {
                        event.preventDefault();
                        fabricObjects.forEach((obj) => { deleteFabricObject({id: obj.id}); })
                    }}
                >
                    DELETE ALL
                </button>
                </>
            }
            <canvas ref={canvasEl} id="my-fabric-canvas" width="1920" height="1080" />
        </>
    ):
        <div></div>
}

export default Visuals