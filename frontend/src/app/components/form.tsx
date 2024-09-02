"use client";
import React from "react";

export default function Form({
  children,
  className,
  handleFormSubmit,
}: {
  children: React.ReactNode;
  className: string;
  handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={handleFormSubmit} className={className}>
      {children}
    </form>
  );
}
