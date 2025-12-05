import React, { createContext, useReducer, useContext, ReactNode, useEffect } from 'react';


//type for vital keys
export type VitalKey =
    | 'heartRate'
    | 'respRate'
    | 'o2Saturation'
    | 'systolicBP'
    | 'diastolicBP'
    | 'eTCO2';


type State = {
    selected: VitalKey[];
};

//types of actions
type Action = { type: 'SET_SELECTED'; payload: VitalKey[] };

type ContextValue = {
    state: State;
    dispatch: React.Dispatch<Action>;
};

//create the typed context 
const VitalsContext = createContext<ContextValue | undefined>(undefined);

//reducer
const vitalsReducer = (state: State, action: Action) => {
    //based on action type handle the operation
    switch (action.type){
        //handle selected vitals
        case 'SET_SELECTED':
            return {
                ...state,
                selected: action.payload,
            };
        default:
            return state;
    }
}

type ProviderProps = {
    children: ReactNode;
};

//provider
export const VitalsProvider: React.FC<ProviderProps> = ({ children }) => {
    const initialState: State = {
        selected: ['heartRate', 'respRate'] //default selected vitals (change if needed)
    }

    //get from sessionStorage for session if possible
    const initalizer = (init: State) => {
        try {
            const raw = sessionStorage.getItem('vitals_state_v1');
            if (!raw) return init;
            const parsed = JSON.parse(raw) as Partial<State>;
            return { ...init, ...parsed };
        } catch {
            return init;
        }
    };

    const [state, dispatch] = useReducer(vitalsReducer, initialState, initalizer);

    useEffect(() => {
        try {
            sessionStorage.setItem('vitals_state_v1', JSON.stringify(state));
        } catch {
            //ignore 
        }
    }, [state]);
    return <VitalsContext.Provider value={{ state, dispatch }}>{children}</VitalsContext.Provider>
};

export const useVitals = (): ContextValue => {
    const context = useContext(VitalsContext);
    if (!context) {
        throw new Error('useVitals error.');
    }
    return context;
};