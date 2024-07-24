import React from 'react';

type HeaderBoxProps = {
  type: string;
  title: string;
  user: string;
  subtext: string;
};

export default function HeaderBox({
  type,
  title,
  user,
  subtext,
}: HeaderBoxProps) {
  return <div>HeaderBox</div>;
}
