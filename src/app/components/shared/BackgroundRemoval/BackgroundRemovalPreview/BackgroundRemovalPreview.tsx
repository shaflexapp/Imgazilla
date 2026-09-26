import {
  BeforeAfterSlider,
  ImagePreviewIcon,
  MainContainer,
} from '@/app/components';

type Props = {
  sourceImageData?: string;
  processedImageData?: string;
};

export const BackgroundRemovalPreview = ({
  sourceImageData,
  processedImageData,
}: Props) => {
  const isImagesAvailable = processedImageData && processedImageData;

  return (
    <MainContainer className='justify-center items-center mt-0.5 overflow-hidden h-full max-h-[444px] w-full'>
      {isImagesAvailable ? (
        <BeforeAfterSlider
          beforeImage={sourceImageData}
          afterImage={processedImageData}
        />
      ) : (
        <div className='flex gap-6 justify-center items-center flex-col w-[350px] h-[350px] border border-primary-lightGreen rounded-md border-dashed'>
          {sourceImageData ? (
            <img src={sourceImageData} alt='Preview image' />
          ) : (
            <>
              <ImagePreviewIcon />
              <p className='text-center font-light text-primary text-xs'>
                Select the layer from which you want to remove the background,
                then click the <span className='font-bold'>Sync</span> button.
              </p>
            </>
          )}
        </div>
      )}
    </MainContainer>
  );
};
