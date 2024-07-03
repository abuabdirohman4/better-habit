"use client";
import Aos from "aos";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MouseEventHandler, useEffect } from "react";
import Spinner from "../Spinner";

type Props = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  children: string;
  color: string;
  dataAos?: string;
  dataDuration?: string;
  disabled?: boolean;
  icon?: IconProp | "";
  loading?: boolean;
  type?: "button" | "submit";
};

export default function Button({
  onClick,
  className,
  children,
  color,
  dataAos,
  dataDuration,
  disabled,
  icon,
  loading,
  type,
}: Props) {
  useEffect(() => {
    Aos.init();
  }, []);
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        data-aos={dataAos}
        data-aos-duration={dataDuration}
        disabled={disabled}
        className={`mr-2 rounded-full ${color} px-5 py-3 text-base font-medium text-white hover:brightness-110 focus:outline-none ${className}`}
      >
        {loading && <Spinner className={"mr-3 inline"} />}
        {icon && (
          <>
            <FontAwesomeIcon icon={icon} />
            &ensp;
          </>
        )}
        {children}
      </button>
    </>
  );
}
