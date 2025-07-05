import React, { forwardRef } from 'react';
import Navigation from './Navigation';

const LeftSidebar = forwardRef(function LeftSidebar(props, ref) {
  const {
    logoSrc = "/logofullw.png",
    logoAlt = "StudioDesignPalette Logo",
    children,
    className = "",
    ...rest
  } = props;

  return (
    <div
      ref={ref}
      className={`hidden lg:flex lg:w-[20%] lg:h-screen flex-col relative bg-gray-700 ${className}`}
      style={{
        willChange: "transform, opacity"
      }}
      {...rest}
    >
      <div className="p-4 sm:p-8 lg:p-12 absolute top-4 sm:top-6 lg:top-8 left-4 sm:left-6 lg:left-8 z-50">
        <img
          src={logoSrc}
          alt={logoAlt}
          className="object-contain rounded-lg"
          style={{
            marginLeft: -13,
            width: 230,
            height: 'auto',
          }}
        />
        <div className="mt-8 hidden lg:block">
          <Navigation textColor="white" />
        </div>
        {children}
      </div>
    </div>
  );
});

export default LeftSidebar;