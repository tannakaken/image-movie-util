import { NATIVE_API } from "../constants";

declare global {
    interface Window {
        [NATIVE_API]: IAPI;
    }
}

export interface IAPI {
    requestOpenDir: (numberOfDigits: number, listner: (webmPath: string | null, error: string | null) => void) => void;
    requestOpenFilePlace: (filePath: string) => void;
}