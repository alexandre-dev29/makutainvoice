import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';
import { useLanguageState } from '@makutainv/configs';
import { FR, US } from 'country-flag-icons/react/3x2';

type LanguageTyping = {
  description: string;
  code: string;
  language: string;
  countryFlag: ReactElement;
};

export const LangSwitcher = () => {
  const { i18n } = useTranslation();
  const { setCurrentLanguage } = useLanguageState();

  const langData: Array<LanguageTyping> = [
    {
      description: 'Français',
      language: 'Français',
      code: 'fr-FR',
      countryFlag: <FR title="France" height={15} className="..." />,
    },
    {
      description: 'English',
      language: 'English',
      code: 'en-US',
      countryFlag: <US title="United States" height={15} className="..." />,
    },
  ];

  return (
    <Select
      onValueChange={async (changedValue) => {
        setCurrentLanguage(changedValue);
        await i18n.changeLanguage(changedValue);
      }}
    >
      <SelectTrigger className="w-[100px] outline-1 mr-4">
        <div>
          <span
            className={`fi fi-${
              i18n.language === 'en' ? 'us' : i18n.language
            } text-xl rounded-full mr-4`}
          ></span>
          {i18n.language.toUpperCase().split('-')[1]}
        </div>
      </SelectTrigger>
      <SelectContent>
        {langData.map((value) => (
          <SelectItem value={value.code} key={value.code}>
            <div className="flex items-center gap-4 ">
              <span> {value.countryFlag}</span>
              <span>{value.language.toUpperCase()}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
