import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import {
  Button,
  ColorPicker,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Switch,
} from '@/app/components';
import {
  getFaviconImageData,
  getFaviconSettings,
  updateFaviconSettings,
} from '@/app/redux/features';
import { useTypedDispatch } from '@/app/redux/store';
import { useGlobalPluginSettings } from '@/app/HOC/WithGlobalPluginSettings';
import { updateColorHistory } from '@/app/lib/utils';

export interface FormDataType {
  websiteName: string;
  themeColor: string;
  bgColor: string;
  platforms: {
    default: boolean;
    ios: boolean;
    android: boolean;
  };
}

type Props = {
  onSubmit: (data: FormDataType) => void;
};

export const FaviconSettingsForm = ({ onSubmit }: Props) => {
  const formSettings = useSelector(getFaviconSettings);
  const isSelectedImage = useSelector(getFaviconImageData);

  const { settings, updateGlobalSettings } = useGlobalPluginSettings();

  const dispatch = useTypedDispatch();

  const form = useForm<FormDataType>({
    defaultValues: formSettings,
  });

  const handleThemeColorChange = useCallback(
    (value: string) => {
      form.setValue('themeColor', value);

      if (value === '') {
        return;
      }

      const [updatedColorHistory, newReplaceIndex] = updateColorHistory(
        settings.themeColorHistory.colorHistory,
        value,
        settings.themeColorHistory.replaceIndex,
      );

      const updatedSettings = {
        settings: {
          ...settings,
          themeColorHistory: {
            ...settings.themeColorHistory,
            colorHistory: updatedColorHistory,
            replaceIndex: newReplaceIndex,
          },
        },
      };

      updateGlobalSettings(updatedSettings);
    },
    [form, settings],
  );

  const handleOnSelectThemeColorHistoryColor = useCallback(
    (value: string) => {
      form.setValue('themeColor', value);
      dispatch(
        updateFaviconSettings({
          faviconSettings: {
            ...formSettings,
            bgColor: value,
          },
        }),
      );
    },
    [formSettings, form],
  );

  const handleBgColorChange = useCallback(
    (value: string) => {
      form.setValue('bgColor', value);

      if (value === '') {
        return;
      }

      const [updatedColorHistory, newReplaceIndex] = updateColorHistory(
        settings.bgColorHistory.colorHistory,
        value,
        settings.bgColorHistory.replaceIndex,
      );

      const updatedSettings = {
        settings: {
          ...settings,
          bgColorHistory: {
            ...settings.bgColorHistory,
            colorHistory: updatedColorHistory,
            replaceIndex: newReplaceIndex,
          },
        },
      };

      updateGlobalSettings(updatedSettings);
      dispatch(
        updateFaviconSettings({
          faviconSettings: {
            ...formSettings,
            bgColor: value,
          },
        }),
      );
    },
    [formSettings, form, settings],
  );

  const handleOnSelectBgHistoryColor = useCallback(
    (value: string) => {
      form.setValue('bgColor', value);
      dispatch(
        updateFaviconSettings({
          faviconSettings: {
            ...formSettings,
            bgColor: value,
          },
        }),
      );
    },
    [formSettings, form],
  );

  return (
    <Form {...form}>
      <form
        className='mb-0 flex flex-col justify-between items-center h-full'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='flex flex-col'>
          <div className='flex flex-col gap-3 mt-4 w-full'>
            <FormField
              control={form.control}
              name='websiteName'
              render={({ field }) => (
                <FormItem className='flex w-full'>
                  <FormControl>
                    <Input placeholder='Website Name' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <label className='flex font-normal text-sm my-3'>Colors</label>
            <FormField
              control={form.control}
              name='themeColor'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center gap-4 relative'>
                  <FormControl>
                    <ColorPicker
                      onChange={handleThemeColorChange}
                      color={field.value}
                      history={settings.themeColorHistory.colorHistory}
                      onSelectHistoryColor={
                        handleOnSelectThemeColorHistoryColor
                      }
                    />
                  </FormControl>
                  <FormLabel className='font-light text-sm !mt-0'>
                    Theme color
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='bgColor'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center gap-4 relative'>
                  <FormControl>
                    <ColorPicker
                      color={field.value}
                      history={settings.bgColorHistory.colorHistory}
                      onChange={handleBgColorChange}
                      onSelectHistoryColor={handleOnSelectBgHistoryColor}
                    />
                  </FormControl>
                  <FormLabel className='font-light text-sm !mt-0'>
                    Background color
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
          <div className='mt-5'>
            <label className='flex font-normal text-sm my-3'>Platforms</label>
            <div className='flex flex-row gap-5'>
              <FormField
                control={form.control}
                name='platforms.default'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center space-y-0 mt-3'>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled
                      />
                    </FormControl>
                    <FormLabel className='text-sm ml-2 font-normal'>
                      Default
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='platforms.ios'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center space-y-0 mt-3'>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className='text-sm ml-2 font-normal'>
                      iOS
                    </FormLabel>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='platforms.android'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center space-y-0 mt-3'>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className='text-sm ml-2 font-normal'>
                      Android
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
        <div className='w-full max-w-[200px]'>
          <Button className='w-full' type='submit' disabled={!isSelectedImage}>
            Export
          </Button>
        </div>
      </form>
    </Form>
  );
};
