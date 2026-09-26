import { ServerCrash } from 'lucide-react';
// import { Button } from '@/app/components';
// import { useWindowMessaging } from '@/app/hooks/useFigmaMessaging';
// import { UIEventType } from '@/eventType';
export const ErrorComponent = () => {
  // const { onSendMessage } = useWindowMessaging();

  // const handleOnClick = useCallback(() => {
  //
  //   const message = {
  //     type: UIEventType.REOPEN_APPLICATION,
  //     payload: {}
  //   } as MessageType;
  //
  //   onSendMessage(message);
  // }, []);

  return (
    <div className='flex flex-col justify-center items-center w-full h-full gap-5'>
      <div className='flex flex-col justify-center items-centerl text-center'>
        <p className='text-3xl font-bold'>An error has occurred.</p>
        <p className='text-xl font-medium'>Please try reopen the plugin.</p>
      </div>
      <div className='flex'>
        <ServerCrash width={120} height={120} strokeWidth={1} />
      </div>
      {/*<div>*/}
      {/*  <Button variant="outline" onClick={handleOnClick}>Reopen</Button>*/}
      {/*</div>*/}
    </div>
  );
};
