import { ReactNode } from 'react';

interface LayoutSectionComponentProps {
  children: ReactNode;
}

const LayoutSectionComponent = ({ children }: LayoutSectionComponentProps) => {
  return (
    <section className="bg-slate-100 w-full pt-20 2xl:pt-20 md:pt-10 lg:pt-10">
      {children}
    </section>
  );
};

export default LayoutSectionComponent;
