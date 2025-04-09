"use client";

import React from "react";
import Label from "../Label";
import Input from "../input/InputField";

interface DefaultInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

export default function DefaultInput({ label, name, ...props }: DefaultInputProps) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
    </div>
  );
}
