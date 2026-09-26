import React from 'react';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      position='top-center'
      // Sonner 2 lowered the default offset from 32px to 24px
      offset='32px'
      className='toaster group'
      toastOptions={{
        classNames: {
          // Tailwind v4 utilities live in a cascade layer, and Sonner 2 dropped
          // the :where() wrappers around its own (unlayered) toast styles, so
          // those would win. `!` keeps these on top, as they were before.
          toast:
            'group toast group-[.toaster]:bg-background! group-[.toaster]:text-foreground! group-[.toaster]:border-border! group-[.toaster]:shadow-lg!',
          description: 'group-[.toast]:text-muted-foreground!',
          // Sonner's own colours always won here and are kept. Sonner 2 made
          // the button text medium weight; it inherited the normal weight before.
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground font-normal!',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
