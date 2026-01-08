import { jsx as _jsx } from "react/jsx-runtime";
import { render } from 'ink';
import { App } from './App.js';
export async function runTui() {
    const { waitUntilExit } = render(_jsx(App, {}));
    await waitUntilExit();
}
