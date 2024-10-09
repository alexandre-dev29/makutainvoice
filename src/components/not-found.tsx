import React from 'react';
import { useRouter } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ShieldCloseIcon } from 'lucide-react';

export const NotFoundComponent = () => {
  const router = useRouter();
  return (
    <div
      className={'flex items-center justify-center gap-24  w-[95vw] h-[99vh] '}
    >
      <div className={'flex w-[60%] items-center gap-96'}>
        <div className="place-self-start flex flex-col gap-6">
          <h2 className={'text-2xl'}>404 error</h2>
          <h2 className={'text-6xl font-bold'}>Page not found...</h2>
          <p className={'text-xl'}>
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <Button
            onClick={async () => {
              router.history.back();
            }}
          >
            Go Back
          </Button>
        </div>
        <div>
          <ShieldCloseIcon size={200} />
        </div>
      </div>
    </div>
  );
};
