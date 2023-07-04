//@ts-nocheck
import { useState } from 'react';
import SearchFn from '@/components/Search'
import Card from '@/components/Card'
import Wrapper from '@/components/Wrapper'


export default function Home() {
  const [data, setData] = useState('');

  const geolocation = (childdata) => {
    setData(childdata);
  }
  return (
    <>
    <Wrapper>
     <SearchFn data={geolocation} />
     <Card data={data} />
    </Wrapper>
    </>
  )
}
