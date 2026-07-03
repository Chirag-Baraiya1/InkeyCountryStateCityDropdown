import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class InkeyCountryStateCityDropdownControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private container!: HTMLDivElement;
    private wrapper!: HTMLDivElement;
    private dropdown!: HTMLSelectElement;
    private loader!: HTMLDivElement;

    private notifyOutputChanged!: () => void;
    private context!: ComponentFramework.Context<IInputs>;

    private value = "";
    private clearingInvalidValue = false;

    private countriesCache: string[] = [];
    private statesCache: Record<string, string[]> = {};
    private citiesCache: Record<string, string[]> = {};

    private lastLoadedCountry = "";
    private lastLoadedStateKey = "";

    private currentCountry = "";
    private currentState = "";

    private clearDebounceTimer: ReturnType<typeof setTimeout> | null = null;
    private hasValidParentLoaded = false;

    // Tracks the latest in-flight request so stale responses never hide a newer loader
    private requestId = 0;

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {

        this.context = context;
        this.notifyOutputChanged = notifyOutputChanged;
        this.container = container;

        // Inject the spinner keyframes once
        if (!document.getElementById("inkey-csc-spin-style")) {
            const styleTag = document.createElement("style");
            styleTag.id = "inkey-csc-spin-style";
            styleTag.textContent = `
                @keyframes inkeyCscSpin {
                    from { transform: translateY(-50%) rotate(0deg); }
                    to { transform: translateY(-50%) rotate(360deg); }
                }
            `;
            document.head.appendChild(styleTag);
        }

        this.wrapper = document.createElement("div");
        this.wrapper.style.position = "relative";
        this.wrapper.style.width = "100%";

        this.dropdown = document.createElement("select");
        this.dropdown.style.width = "100%";
        this.dropdown.style.padding = "6px";

        this.loader = document.createElement("div");
        this.loader.style.position = "absolute";
        this.loader.style.top = "50%";
        this.loader.style.right = "8px";
        this.loader.style.width = "14px";
        this.loader.style.height = "14px";
        this.loader.style.marginTop = "-7px";
        this.loader.style.border = "2px solid #d0d0d0";
        this.loader.style.borderTopColor = "#666666";
        this.loader.style.borderRadius = "50%";
        this.loader.style.animation = "inkeyCscSpin 0.7s linear infinite";
        this.loader.style.display = "none";
        this.loader.style.pointerEvents = "none";

        this.wrapper.appendChild(this.dropdown);
        this.wrapper.appendChild(this.loader);
        this.container.appendChild(this.wrapper);

        this.dropdown.addEventListener("change", () => {
            this.cancelDebounce();
            this.hasValidParentLoaded = true;
            this.value = this.dropdown.value;
            this.notifyOutputChanged();
        });
    }

    private showLoader(): void {
        this.loader.style.display = "block";
        this.dropdown.disabled = true;
    }

    private hideLoader(): void {
        this.loader.style.display = "none";
        this.dropdown.disabled = false;
    }

    private cancelDebounce(): void {
        if (this.clearDebounceTimer !== null) {
            clearTimeout(this.clearDebounceTimer);
            this.clearDebounceTimer = null;
        }
    }

    private debouncedClear(savedValue: string): void {
        if (this.hasValidParentLoaded) {
            if (savedValue !== "" || this.value !== "") {
                this.value = "";
                this.notifyOutputChanged();
            }
            return;
        }

        this.cancelDebounce();
        this.clearDebounceTimer = setTimeout(() => {
            this.clearDebounceTimer = null;
            if (savedValue !== "" || this.value !== "") {
                this.value = "";
                this.notifyOutputChanged();
            }
        }, 2000);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {

        this.context = context;

        // const isCountry = context.parameters.isCountry.raw;
        // const isState = context.parameters.isState.raw;
        // const isCity = context.parameters.isCity.raw;

        // const mode = isCountry ? "Country"
        //     : isState ? "State"
        //         : isCity ? "City"
        //             : "";

        const mode = context.parameters.mode.raw || "";
        const country = context.parameters.country.raw || "";
        const state = context.parameters.state.raw || "";
        const savedValue = context.parameters.value.raw || "";

        this.currentCountry = country;
        this.currentState = state;

        if (mode === "Country") {

            this.loadCountries(savedValue);

        } else if (mode === "State") {

            if (country === "") {

                this.dropdown.innerHTML = "";
                this.dropdown.value = "";
                this.lastLoadedCountry = "";
                this.clearingInvalidValue = false;
                this.hideLoader();

                this.debouncedClear(savedValue);

                return;
            }

            this.hasValidParentLoaded = true;
            this.cancelDebounce();

            if (this.lastLoadedCountry !== country) {
                this.lastLoadedCountry = "";
                this.clearingInvalidValue = false;
            }

            this.loadStates(country, savedValue);

        } else if (mode === "City") {

            if (!country || !state) {

                this.dropdown.innerHTML = "";
                this.dropdown.value = "";
                this.lastLoadedStateKey = "";
                this.clearingInvalidValue = false;
                this.hideLoader();

                this.debouncedClear(savedValue);

                return;
            }

            this.hasValidParentLoaded = true;
            this.cancelDebounce();

            const cacheKey = `${country}__${state}`;

            if (this.lastLoadedStateKey !== cacheKey) {
                this.lastLoadedStateKey = "";
                this.clearingInvalidValue = false;
            }

            this.loadCities(country, state, savedValue);
        }
    }

    private loadCountries(savedValue: string): void {

        if (this.countriesCache.length > 0) {
            this.dropdown.innerHTML = "";

            this.addOption("Select Country", "");

            this.countriesCache.forEach(name => {
                this.addOption(name, name);
            });

            this.dropdown.value = savedValue;

            if (!this.clearingInvalidValue) {
                this.value = savedValue;
            }
            return;
        }

        const currentRequestId = ++this.requestId;
        this.showLoader();

        void fetch("https://countriesnow.space/api/v0.1/countries/positions")
            .then(response => response.json())
            .then(result => {

                const countries = result.data as { name: string }[];
                this.countriesCache = countries.map(c => c.name);

                this.dropdown.innerHTML = "";
                this.addOption("Select Country", "");

                this.countriesCache.forEach(name => {
                    this.addOption(name, name);
                });

                this.dropdown.value = savedValue;

                if (!this.clearingInvalidValue) {
                    this.value = savedValue;
                }

                if (currentRequestId === this.requestId) {
                    this.hideLoader();
                }

                return result;
            })
            .catch(error => {
                if (currentRequestId === this.requestId) {
                    this.hideLoader();
                }
                console.error("Country API error:", error);
            });
    }

    private loadStates(country: string, savedValue: string): void {

        if (this.statesCache[country]) {
            this.renderStates(this.statesCache[country], country, savedValue);
            return;
        }

        if (this.lastLoadedCountry === country) return;
        this.lastLoadedCountry = country;

        const currentRequestId = ++this.requestId;
        this.showLoader();

        void fetch("https://countriesnow.space/api/v0.1/countries/states", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: country })
        })
            .then(response => response.json())
            .then(result => {

                const states = (result.data.states as { name: string }[]).map(s => s.name);
                this.statesCache[country] = states;

                if (this.currentCountry !== country) {
                    if (currentRequestId === this.requestId) {
                        this.hideLoader();
                    }
                    return result;
                }

                if (currentRequestId === this.requestId) {
                    this.hideLoader();
                }

                this.renderStates(states, country, savedValue);

                return result;
            })
            .catch(error => {
                if (currentRequestId === this.requestId) {
                    this.hideLoader();
                }
                console.error("State API error:", error);
            });
    }

    private renderStates(states: string[], country: string, savedValue: string): void {

        if (this.currentCountry !== country) return;

        this.dropdown.innerHTML = "";

        states.forEach(name => {
            this.addOption(name, name);
        });

        if (savedValue === "") {
            this.clearingInvalidValue = false;

            this.dropdown.value = "";
            if (this.value !== "") {
                this.value = "";
                this.notifyOutputChanged();
            }
            return;
        }

        const stateExists = states.includes(savedValue);

        if (!stateExists) {
            if (!this.clearingInvalidValue) {
                this.clearingInvalidValue = true;
                this.dropdown.value = "";
                this.value = "";
                this.notifyOutputChanged();
            }
            return;
        }

        this.clearingInvalidValue = false;
        this.dropdown.value = savedValue;
        this.value = savedValue;
    }

    private loadCities(country: string, state: string, savedValue: string): void {

        const cacheKey = `${country}__${state}`;

        if (this.citiesCache[cacheKey]) {
            this.renderCities(this.citiesCache[cacheKey], country, state, savedValue);
            return;
        }

        if (this.lastLoadedStateKey === cacheKey) return;
        this.lastLoadedStateKey = cacheKey;

        const currentRequestId = ++this.requestId;
        this.showLoader();

        void fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: country, state: state })
        })
            .then(response => response.json())
            .then(result => {

                const cities = result.data as string[];
                this.citiesCache[cacheKey] = cities;

                if (this.currentCountry !== country || this.currentState !== state) {
                    if (currentRequestId === this.requestId) {
                        this.hideLoader();
                    }
                    return result;
                }

                if (currentRequestId === this.requestId) {
                    this.hideLoader();
                }

                this.renderCities(cities, country, state, savedValue);

                return result;
            })
            .catch(error => {
                if (currentRequestId === this.requestId) {
                    this.hideLoader();
                }
                console.error("City API error:", error);
            });
    }

    private renderCities(cities: string[], country: string, state: string, savedValue: string): void {

        if (this.currentCountry !== country || this.currentState !== state) return;

        this.dropdown.innerHTML = "";

        cities.forEach(city => {
            this.addOption(city, city);
        });

        if (savedValue === "") {
            this.clearingInvalidValue = false;
            this.dropdown.value = "";
            if (this.value !== "") {
                this.value = "";
                this.notifyOutputChanged();
            }
            return;
        }

        const cityExists = cities.includes(savedValue);

        if (!cityExists) {
            if (!this.clearingInvalidValue) {
                this.clearingInvalidValue = true;
                this.dropdown.value = "";
                this.value = "";
                this.notifyOutputChanged();
            }
            return;
        }

        this.clearingInvalidValue = false;
        this.dropdown.value = savedValue;
        this.value = savedValue;
    }

    public getOutputs(): IOutputs {
        return { value: this.value };
    }

    public destroy(): void {
        this.cancelDebounce();
    }

    private addOption(text: string, value: string): void {
        const option = document.createElement("option");
        option.text = text;
        option.value = value;
        this.dropdown.appendChild(option);
    }
}