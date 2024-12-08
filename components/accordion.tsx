"use client";

import { useState } from "react";

type AccordionpProps = {
  children: React.ReactNode;
  title: string;
  id: string;
  active?: boolean;
};

export default function Accordion({
  children,
  title,
  id,
  active = false,
}: AccordionpProps) {
  const [accordionOpen, setAccordionOpen] = useState<boolean>(active);

}
