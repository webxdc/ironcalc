import "./App.css";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import {
  loadModelFromStorageOrCreate,
  saveSelectedModelInStorage,
} from "./components/storage";

// From IronCalc
import { IronCalc, IronCalcIcon, Model, init } from "@ironcalc/workbook";

import { Webxdc } from "@webxdc/types";
import { encode as base64Encode, decode as base64Decode } from "base64-arraybuffer";

declare global {
  interface Window {
    webxdc: Webxdc<{ data: string, sender: string }>;
  }
}

function App() {
  const [model, setModel] = useState<Model | null>(null);
  const uuid = get_or_create_uuid();

  const [refreshId, forceUpdate] = useState(0);

  useEffect(() => {
    async function start() {
      await init();
      const newModel = loadModelFromStorageOrCreate();
      setModel(newModel);
    }
    start();
  }, []);

  let max_serial = get_last_serial()

  useEffect(() => {
    if (!model) {
      return
    }

    const int = setInterval(() => {

      let diff = model.flushSendQueue();
      if (diff.length <= 1) {
        return
      }
      saveSelectedModelInStorage(model);
      const diffBuffer = new ArrayBuffer(diff.byteLength);
      new Uint8Array(diffBuffer).set(diff);
      const diffBase64 = base64Encode(diffBuffer);
      window.webxdc.sendUpdate({ payload: { data: diffBase64, sender: uuid } }, "");
    }, 1000)

    window.webxdc.setUpdateListener((update) => {
      const payload = update.payload;
      localStorage.setItem("last_serial", update.serial.toString());
      if (!model) {
        console.warn("Received external diffs but model is not initialized yet");
        return
      }

      if (!payload || !payload.data || payload.sender === uuid) {
        return
      }
      // Decode base64 back to binary and convert to Uint8Array
      const diffBuffer = base64Decode(payload.data);
      const diff = new Uint8Array(diffBuffer);
      model.applyExternalDiffs(diff);
      saveSelectedModelInStorage(model);
      const newModel = Model.from_bytes(model.toBytes());
      setModel(newModel);
      forceUpdate(v => v + 1);
    }, max_serial)

    return () => {
      clearInterval(int)
    }
  }, [model, uuid, max_serial])


  if (!model) {
    return (
      <Loading>
        <IronCalcIcon style={{ width: 24, height: 24, marginBottom: 16 }} />
        <div>Loading IronCalc</div>
      </Loading>
    );
  }


  // We could use context for model, but the problem is that it should initialized to null.
  // Passing the property down makes sure it is always defined.

  return (
    <Wrapper>
      <IronCalc model={model} refreshId={refreshId} />
    </Wrapper>
  );
}

const Wrapper = styled("div")`
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: absolute;
`;

const Loading = styled("div")`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: "Inter";
  font-size: 14px;
`;

export default App;

function get_last_serial(): number {
  const last_serial = localStorage.getItem("last_serial");
  if (last_serial === null) {
    localStorage.setItem("last_serial", "0");
    return 0;
  }
  return parseInt(last_serial, 10) || 0;
}

function get_or_create_uuid(): string {
  const uuid = localStorage.getItem("uuid");
  if (uuid) {
    return uuid
  }
  const newUuid = crypto.randomUUID();
  localStorage.setItem("uuid", newUuid);
  return newUuid
}
