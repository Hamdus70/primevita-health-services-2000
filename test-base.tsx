import React from 'react';
import { DialogTrigger } from './src/components/ui/dialog';
import { Button } from './src/components/ui/button';
export function Test() {
  return <DialogTrigger render={<Button />}>Test</DialogTrigger>
}
