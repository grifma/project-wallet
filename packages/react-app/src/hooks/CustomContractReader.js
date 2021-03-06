import { useState, useEffect } from "react";
import usePoller from "./Poller";
import config from "../config";

const DEBUG = false;

export default function useCustomContractReader(contract, functionName, args, pollTime, formatter, onChange) {
  // console.log("Called custom contract reader with ", contract, functionName);
  // let adjustPollTime = 1777;
  let adjustPollTime = config.REACT_APP_POLL;
  if (pollTime) {
    adjustPollTime = pollTime;
  } else if (!pollTime && typeof args === "number") {
    // it's okay to pass poll time as last argument without args for the call
    adjustPollTime = args;
  }

  const [value, setValue] = useState();
  useEffect(() => {
    if (typeof onChange === "function") {
      setTimeout(onChange.bind(this, value), 1);
    }
  }, [value]);

  usePoller(
    async () => {
      try {
        let newValue;
        if (DEBUG) console.log("CALLING ", contract, functionName, "with args", args);
        if (args && args.length > 0) {
          newValue = await contract[functionName](...args);
          if (DEBUG) console.log("contract", contract, "functionName", functionName, "args", args, "RESULT:", newValue);
        } else {
          newValue = await contract[functionName]();
          if (DEBUG) console.log(`${contract}[${functionName}] :>> `, newValue);
        }
        if (formatter && typeof formatter === "function") {
          newValue = formatter(newValue);
        }
        // console.log("GOT VALUE",newValue)
        if (newValue !== value) {
          setValue(newValue);
        }
      } catch (e) {
        console.log(e);
      }
    },
    adjustPollTime,
    contract,
  );

  return value;
}
