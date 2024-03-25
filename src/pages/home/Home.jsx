import React from 'react';
import {Explorer, Footer } from '../../components'
import { TokenProvider } from '../../components/TokenContext/TokenContext';

export default function Home() {

  return <div>
    <TokenProvider>
      <Explorer />
    </TokenProvider>
    <Footer/>
  </div>;
};
