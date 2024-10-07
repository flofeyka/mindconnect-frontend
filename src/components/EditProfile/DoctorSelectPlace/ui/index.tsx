"use client";

import React, { FC, useState, useEffect } from "react";
import { Country, City } from "country-state-city";
import DoctorSingleSelect from "../../DoctorSingleSelect";

interface DoctorSelectPlaceProps {
  countryValue: string;
  cityValue: string;
  onCountryChange: (value: string) => void;
  onCityChange: (value: string) => void;
  countryError?: string;
  cityError?: string;
}

const DoctorSelectPlace: FC<DoctorSelectPlaceProps> = ({
  countryValue,
  cityValue,
  onCountryChange,
  onCityChange,
  countryError,
  cityError,
}) => {
  const [countries, setCountries] = useState<{ key: string; label: string }[]>([]);
  const [cities, setCities] = useState<{ key: string; label: string }[]>([]);

  useEffect(() => {
    const countriesData = Country.getAllCountries();
    const countryList = countriesData.map((country) => ({
      key: country.isoCode, // Используем код страны в качестве ключа
      label: country.name,  // Название страны в качестве метки
    }));
    setCountries(countryList);
  }, []);

  useEffect(() => {
    if (countryValue) {
      const citiesData = City.getCitiesOfCountry(countryValue);
      const cityList =
        citiesData?.map((city) => ({
          key: city.name, // Если у городов есть уникальный идентификатор, лучше использовать его
          label: city.name,
        })) ?? [];
      setCities(cityList);
    } else {
      setCities([]);
    }
  }, [countryValue]); // Добавляем countryValue в зависимости

  return (
    <div className="flex gap-3 mb-4">
      <DoctorSingleSelect
        label="Country"
        placeholder="Select Country"
        options={countries}
        value={countryValue}
        onChange={onCountryChange}
        error={countryError}
      />
      <DoctorSingleSelect
        label="City"
        placeholder="Select City"
        options={cities}
        value={cityValue}
        onChange={onCityChange}
        error={cityError}
        isDisabled={!countryValue}
      />
    </div>
  );
};

export default DoctorSelectPlace;
