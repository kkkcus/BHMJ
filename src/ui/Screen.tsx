import React from "react";

type Props = {
  children: React.ReactNode;
  withCard?: boolean; // true면 globals.css의 .card 적용
  className?: string;
};

export default function Screen({ children, withCard = true, className }: Props) {
  if (!withCard) return <>{children}</>;

  return <main className={`card ${className ?? ""}`.trim()}>{children}</main>;
}
