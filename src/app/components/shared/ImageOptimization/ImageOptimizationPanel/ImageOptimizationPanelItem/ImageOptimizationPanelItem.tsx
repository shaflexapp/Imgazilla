import { ReactNode } from 'react';
import { NavLink } from 'react-router';

type Props = {
  title: string | ReactNode;
  description: string | ReactNode;
  onClick?: () => void;
  to?: string;
};

export const ImageOptimizationPanelItem = ({
  title,
  to,
  onClick,
  description,
}: Props) => {
  return (
    <NavLink to={to} onClick={onClick}>
      <div className='flex flex-col text-center w-[230px] pt-20 pb-20 pl-4 pr-4 gap-5 bg-primary-mainDark rounded-lg border border-primary-primaryDark cursor-pointer hover:shadow-lg hover:border-primary-lightGreen transition-colors duration-300'>
        <p className='font-bold text-sm'>{title}</p>
        <p className='font-normal text-xs text-primary-normalGray'>
          {description}
        </p>
      </div>
    </NavLink>
  );
};
