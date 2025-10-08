import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/base-scroll-area";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxIcon,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/base-combobox";
import { cn } from "@/lib/utils";

// Import JSON data directly
import countries from "@/components/custom/data/countries.json";
import states from "@/components/custom/data/states.json";

export interface Timezone {
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
}

export interface CountryProps {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  numeric_code: string;
  phone_code: string;
  capital: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  tld: string;
  native: string;
  region: string;
  region_id: string;
  subregion: string;
  subregion_id: string;
  nationality: string;
  timezones: Timezone[];
  translations: Record<string, string>;
  latitude: string;
  longitude: string;
  emoji: string;
  emojiU: string;
}

export interface StateProps {
  id: number;
  name: string;
  country_id: number;
  country_code: string;
  country_name: string;
  state_code: string;
  type: string | null;
  latitude: string;
  longitude: string;
}

interface LocationSelectorProps {
  disabled?: boolean;
  onCountryChange?: (country: CountryProps | null) => void;
  onStateChange?: (state: StateProps | null) => void;
  defaultCountry?: CountryProps | string | null;
  defaultState?: StateProps | string | null;
}

const LocationSelector = ({
  disabled,
  onCountryChange,
  onStateChange,
  defaultCountry = null,
  defaultState = null,
}: LocationSelectorProps) => {
  // Cast imported JSON data to their respective types
  const countriesData = countries as CountryProps[];
  const statesData = states as StateProps[];

  // Helper function to find country by name or return the object if it's already a CountryProps
  const findCountry = (
    countryInput: CountryProps | string | null
  ): CountryProps | null => {
    if (!countryInput) return null;
    if (typeof countryInput === "string") {
      return (
        countriesData.find(
          (c) => c.name.toLowerCase() === countryInput.toLowerCase()
        ) || null
      );
    }
    return countryInput;
  };

  // Helper function to find state by name or return the object if it's already a StateProps
  const findState = (
    stateInput: StateProps | string | null,
    countryId?: number
  ): StateProps | null => {
    if (!stateInput) return null;
    if (typeof stateInput === "string") {
      const statesByName = statesData.filter(
        (s) => s.name.toLowerCase() === stateInput.toLowerCase()
      );
      if (countryId) {
        return statesByName.find((s) => s.country_id === countryId) || null;
      }
      return statesByName[0] || null;
    }
    return stateInput;
  };

  const [selectedCountry, setSelectedCountry] = useState<CountryProps | null>(
    () => findCountry(defaultCountry)
  );
  const [selectedState, setSelectedState] = useState<StateProps | null>(() =>
    findState(defaultState, findCountry(defaultCountry)?.id)
  );
  const [countrySearchValue, setCountrySearchValue] = useState("");
  const [stateSearchValue, setStateSearchValue] = useState("");

  // Update internal state when default props change
  useEffect(() => {
    const country = findCountry(defaultCountry);
    setSelectedCountry(country);

    // If country changed, reset state or try to find matching state
    const state = findState(defaultState, country?.id);
    setSelectedState(state);
  }, [defaultCountry, defaultState]);

  // Filter states for selected country
  const availableStates = statesData.filter(
    (state) => state.country_id === selectedCountry?.id
  );

  // Filter countries based on search
  const filteredCountries = React.useMemo(() => {
    if (!countrySearchValue) return countriesData;
    return countriesData.filter((country) =>
      country.name.toLowerCase().includes(countrySearchValue.toLowerCase())
    );
  }, [countrySearchValue]);

  // Filter states based on search
  const filteredStates = React.useMemo(() => {
    if (!stateSearchValue) return availableStates;
    return availableStates.filter((state) =>
      state.name.toLowerCase().includes(stateSearchValue.toLowerCase())
    );
  }, [availableStates, stateSearchValue]);

  const handleCountrySelect = (country: CountryProps | null) => {
    setSelectedCountry(country);
    setSelectedState(null); // Reset state when country changes
    setCountrySearchValue(""); // Reset search
    onCountryChange?.(country);
    onStateChange?.(null);
  };

  const handleStateSelect = (state: StateProps | null) => {
    setSelectedState(state);
    setStateSearchValue(""); // Reset search
    onStateChange?.(state);
  };

  return (
    <div
      className={`grid gap-4 ${
        availableStates.length > 0 ? "grid-cols-2" : "grid-cols-1"
      }`}
    >
      {/* Country Selector */}
      <Combobox
        items={filteredCountries}
        value={selectedCountry?.name || ""}
        onValueChange={(countryName) => {
          const country = countriesData.find((c) => c.name === countryName);
          handleCountrySelect(country || null);
        }}
      >
        <div className="relative">
          <ComboboxTrigger
            render={
              <Button
                variant="outline"
                mode="input"
                className={cn(
                  "w-full justify-between h-10",
                  disabled && "opacity-50 pointer-events-none"
                )}
                disabled={disabled}
              >
                <ComboboxValue>
                  {(value: string) => {
                    const country = countriesData.find((c) => c.name === value);
                    return country ? (
                      <div className="flex items-center gap-2">
                        <span>{country.emoji}</span>
                        <span>{country.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Select Country...</span>
                    );
                  }}
                </ComboboxValue>
                <ComboboxIcon />
              </Button>
            }
          />
        </div>
        <ComboboxContent className="w-[300px] overflow-hidden">
          <ComboboxInput
            placeholder="Search country..."
            value={countrySearchValue}
            onChange={(e) => setCountrySearchValue(e.target.value)}
            className={cn([
              "border-0 shadow-none rounded-none bg-popover",
                "focus-visible:ring-0 focus-visible:ring-offs",
              "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border",
            ])}
          />
          <ComboboxSeparator />
          <ComboboxEmpty className="text-center px-2 pt-4 pb-2">
            No country found.
          </ComboboxEmpty>
          <ScrollArea className="h-[300px]">
            <ComboboxList className="overflow-hidden my-1">
              {filteredCountries.map((country) => (
                <ComboboxItem
                  key={country.id}
                  value={country.name}
                  className="flex items-center gap-2 ps-3 pe-8"
                >
                  <span>{country.emoji}</span>
                  <span className="flex-1 text-sm">{country.name}</span>
                  <ComboboxItemIndicator className="start-auto end-2.5" />
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ScrollArea>
        </ComboboxContent>
      </Combobox>

      {/* State Selector - Only shown if selected country has states */}
      {availableStates.length > 0 && (
        <Combobox
          items={filteredStates}
          value={selectedState?.name || ""}
          onValueChange={(stateName) => {
            const state = availableStates.find((s) => s.name === stateName);
            handleStateSelect(state || null);
          }}
        >
          <div className="relative">
            <ComboboxTrigger
              render={
                <Button
                  variant="outline"
                  mode="input"
                  className={cn(
                    "w-full justify-between h-10",
                    !selectedCountry && "opacity-50 pointer-events-none"
                  )}
                  disabled={!selectedCountry}
                >
                  <ComboboxValue>
                    {(value: string) => {
                      const state = availableStates.find((s) => s.name === value);
                      return state ? (
                        <span>{state.name}</span>
                      ) : (
                        <span className="text-muted-foreground">Select State...</span>
                      );
                    }}
                  </ComboboxValue>
                  <ComboboxIcon />
                </Button>
              }
            />
          </div>
          <ComboboxContent className="w-[300px] overflow-hidden">
            <ComboboxInput
              placeholder="Search state..."
              value={stateSearchValue}
              onChange={(e) => setStateSearchValue(e.target.value)}
              className={cn([
                "border-0 shadow-none rounded-none bg-popover",
                "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border",
              ])}
            />
            <ComboboxSeparator />
            <ComboboxEmpty className="text-center px-2 pt-4 pb-2">
              No state found.
            </ComboboxEmpty>
            <ScrollArea className="h-[300px]">
              <ComboboxList className="overflow-hidden my-1">
                {filteredStates.map((state) => (
                  <ComboboxItem
                    key={state.id}
                    value={state.name}
                    className="flex items-center justify-between ps-3 pe-8"
                  >
                    <span className="flex-1 text-sm">{state.name}</span>
                    <ComboboxItemIndicator className="start-auto end-2.5" />
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ScrollArea>
          </ComboboxContent>
        </Combobox>
      )}
    </div>
  );
};

export default LocationSelector;
