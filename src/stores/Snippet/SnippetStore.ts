import {action, computed, flow, makeObservable, observable} from "mobx";

import {AppToaster, SuccessToast} from "components/Shared";
import {Snippet} from "models";
import {ApiService} from "services";
import {AlertStore} from "stores";

import {exampleSnippets} from "./ExampleSnippets";

export class SnippetStore {
    private static staticInstance: SnippetStore;

    static get Instance() {
        if (!SnippetStore.staticInstance) {
            SnippetStore.staticInstance = new SnippetStore();
        }
        return SnippetStore.staticInstance;
    }

    public static readonly ToasterTimeout = 1500;

    @observable snippets: Map<string, Snippet>;
    @observable activeSnippet: Snippet;
    @observable activeSnippetName: string;
    @observable isExecuting: boolean;

    private constructor() {
        makeObservable(this);
        this.setDefaultSnippets();
        this.clearActiveSnippet();
        this.isExecuting = false;
    }

    public snippetExists = (name: string): boolean => {
        return name && this.snippets.has(name);
    };

    @action setDefaultSnippets = () => {
        if (!this.snippets) {
            this.snippets = new Map<string, Snippet>();
        }
        this.snippets.clear();
        for (const example of exampleSnippets) {
            let category = "Examples";
            if (example.section) {
                category += `/${example.section}`;
            }

            const snippet: Snippet = {
                tags: ["example"],
                categories: [category],
                code: example.code,
                frontendVersion: Snippet.FrontendVersion,
                snippetVersion: Snippet.SnippetVersion
            };

            this.snippets.set(example.name, snippet);
        }
    };

    @flow.bound *fetchSnippets() {
        this.setDefaultSnippets();

        try {
            const userSnippets = yield ApiService.Instance.getSnippets();
            for (const [name, snippet] of userSnippets) {
                this.snippets.set(name, snippet);
            }
            const previousSnippet = this.snippets.get("_previous");
            if (previousSnippet) {
                this.setActiveSnippet(previousSnippet, "");
            }
        } catch (err) {
            AlertStore.Instance.showAlert("Loading user-defined snippets failed!");
            console.log(err);
        }
    }

    @computed get numSavedSnippets(): number {
        return this.snippets.size;
    }

    @computed get validInput() {
        return this.functionToExecute !== undefined;
    }

    @computed
    private get functionToExecute() {
        const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
        if (this.activeSnippet && AsyncFunction) {
            let f;
            try {
                f = new AsyncFunction(this.activeSnippet.code);
            } catch (e) {
                f = undefined;
            }
            return f;
        }
        return undefined;
    }

    @action setActiveSnippet = (snippet: Snippet, name: string) => {
        this.activeSnippet = {...snippet};
        if (!this.activeSnippet.categories) {
            this.activeSnippet.categories = [];
        }

        this.activeSnippet.categories = this.activeSnippet.categories.filter(c => c !== "hidden");

        if (snippet.tags?.includes("example")) {
            this.activeSnippetName = "";
        } else {
            this.activeSnippetName = name;
        }
    };

    @action clearActiveSnippet = () => {
        this.activeSnippet = {
            code: "",
            frontendVersion: Snippet.FrontendVersion,
            snippetVersion: Snippet.FrontendVersion,
            categories: []
        };
        this.activeSnippetName = "";
    };

    @action setSnippetString = (val: string) => {
        if (!this.activeSnippet) {
            this.clearActiveSnippet();
        }
        this.activeSnippet.code = val;
    };

    @flow.bound *saveSnippet(name: string, snippet: Snippet, silent: boolean = false) {
        this.snippets.set(name, snippet);

        try {
            const success = yield ApiService.Instance.setSnippet(name, snippet);
            if (success) {
                // Silently exit on success if silent flag is set
                if (!silent) {
                    AppToaster.show(SuccessToast("console", `Snippet ${name} saved successfully.`, SnippetStore.ToasterTimeout));
                }
                return true;
            } else {
                AlertStore.Instance.showAlert(`Saving snippet ${name} failed!`);
                return false;
            }
        } catch (err) {
            AlertStore.Instance.showAlert(`Saving snippet ${name} failed!`);
            return false;
        }
    }

    @flow.bound *deleteSnippet(name: string, silent: boolean = false) {
        this.snippets.delete(name);
        try {
            const success = yield ApiService.Instance.clearSnippet(name);
            if (success) {
                // Silently exit on success if silent flag is set
                if (!silent) {
                    AppToaster.show(SuccessToast("console", `Snippet ${name} deleted successfully.`, SnippetStore.ToasterTimeout));
                }
                return true;
            } else {
                AlertStore.Instance.showAlert(`Deleting snippet ${name} failed!`);
                return false;
            }
        } catch (err) {
            AlertStore.Instance.showAlert(`Deleting snippet ${name} failed!`);
            return false;
        }
    }

    @action private setSnippetExecuting = (val: boolean) => {
        this.isExecuting = val;
    };

    @flow.bound *executeCurrentSnippet() {
        if (this.functionToExecute && !this.isExecuting) {
            this.setSnippetExecuting(true);
            try {
                yield this.functionToExecute();
                this.setSnippetExecuting(false);

                // Save current snippet as previous
                const snippet: Snippet = {
                    snippetVersion: 1,
                    frontendVersion: "v2.0.0",
                    tags: ["previous"],
                    categories: ["hidden"],
                    requires: [],
                    code: this.activeSnippet?.code
                };
                yield this.saveSnippet("_previous", snippet, true);
                return true;
            } catch (err) {
                this.setSnippetExecuting(false);
                console.warn(err);
                return false;
            }
        } else {
            return false;
        }
    }
}
