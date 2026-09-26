import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  ChromeSearchResultBrowserPreview,
  ChromeTabPreviewImage,
  IPhonePreviewImage,
  ScrollArea,
  Switch,
} from '@/app/components';

import { getFaviconImageData, getFaviconSettings } from '@/app/redux/features';
import { convertToImageUrl } from '@/app/lib/convertToImageUrl';

export const FaviconBrowsePreview = () => {
  const [isLightTheme, setIsLightTheme] = useState(false);
  const imageData = useSelector(getFaviconImageData);
  const faviconSettings = useSelector(getFaviconSettings);

  const url = useMemo(() => convertToImageUrl(imageData, 'PNG'), [imageData]);

  const handleOnThemeChange = useCallback((checked: boolean) => {
    setIsLightTheme(checked);
  }, []);

  return (
    <div className='flex flex-col'>
      <ScrollArea className='h-[450px] -mr-3'>
        <div className='flex flex-col mt-6'>
          <div className='flex justify-between items-center mr-3'>
            <p>Browser:</p>
            <Switch
              name='Theme'
              checked={isLightTheme}
              onCheckedChange={handleOnThemeChange}
            />
          </div>
          <div className='flex mt-3'>
            <ChromeTabPreviewImage
              imageData={url}
              isLight={isLightTheme}
              backgroundColor={faviconSettings.bgColor}
            />
          </div>
          <div className='flex mt-3 mr-3'>
            <ChromeSearchResultBrowserPreview
              imageData={url}
              isLight={isLightTheme}
              backgroundColor={faviconSettings.bgColor}
            />
          </div>
        </div>
        <div className='flex flex-col mt-6'>
          <div className='flex justify-between items-center'>
            <p>iPhone:</p>
          </div>
          <div className='flex justify-center mt-3'>
            <IPhonePreviewImage
              imageData={url}
              backgroundColor={faviconSettings.bgColor}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
