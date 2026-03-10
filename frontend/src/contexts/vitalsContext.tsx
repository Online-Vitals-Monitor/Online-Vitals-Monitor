import React, {
  createContext,
  useReducer,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useSession } from "./sessionContext";

//type for vital keys
export type VitalKey =
  | "heartRate"
  | "respRate"
  | "o2Saturation"
  | "systolicBP"
  | "diastolicBP"
  | "eTCO2";

type State = {
  selected: VitalKey[];
};

//types of actions
type Action = { type: "SET_SELECTED"; payload: VitalKey[] };

type ContextValue = {
  state: State;
  dispatch: React.Dispatch<Action>;
  vitals: any; // you can later replace with a typed interface
};

//create the typed context
const VitalsContext = createContext<ContextValue | undefined>(undefined);

//reducer
const vitalsReducer = (state: State, action: Action) => {
  //based on action type handle the operation
  switch (action.type) {
    //handle selected vitals
    case "SET_SELECTED":
      return {
        ...state,
        selected: action.payload,
      };
    default:
      return state;
  }
};

type ProviderProps = {
  children: ReactNode;
};

//provider
export const VitalsProvider: React.FC<ProviderProps> = ({ children }) => {
  const { session } = useSession();

  const initialState: State = {
    selected: ["heartRate", "respRate"],
  };

  const [state, dispatch] = useReducer(vitalsReducer, initialState);

  const [vitals, setVitals] = useState<any>(null);

  useEffect(() => {
    if (!session) return;

    const publicID = session.publicID;

    async function loadVitals() {
      const res = await fetch(`http://localhost:4000/api/vitals/${publicID}`);

      const data = await res.json();
      setVitals(data);
    }

    loadVitals();
  }, [session]);

  return (
    <VitalsContext.Provider value={{ state, dispatch, vitals }}>
      {children}
    </VitalsContext.Provider>
  );
};
export const useVitals = (): ContextValue => {
  const context = useContext(VitalsContext);
  if (!context) {
    throw new Error("useVitals error.");
  }
  return context;
};
