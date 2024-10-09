import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import React, { Fragment, useState } from 'react';

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();

  return (
    <Fragment>
      {theme === 'light' ? (
        <Sun
          className="h-[1.4rem] w-[1.4rem]  transition-all hover:scale-125 cursor-pointer duration-500 mx-6"
          onClick={async () => {
            setTheme('dark');
          }}
        />
      ) : (
        <Moon
          className="h-[1.4rem] w-[1.4rem]  transition-all hover:scale-125 cursor-pointer duration-500 mx-6"
          onClick={() => {
            setTheme('light');
          }}
        />
      )}
    </Fragment>
  );
}
