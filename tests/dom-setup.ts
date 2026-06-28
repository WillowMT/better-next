import { Window } from "happy-dom";

const window = new Window({ url: "http://localhost" });

globalThis.window = window as unknown as Window & typeof globalThis.window;
globalThis.document = window.document as unknown as Document;
globalThis.localStorage = window.localStorage as unknown as Storage;
globalThis.navigator = window.navigator as unknown as Navigator;
globalThis.HTMLElement = window.HTMLElement as unknown as typeof HTMLElement;
