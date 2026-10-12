import React, { useEffect } from 'react';
const Home: React.FC = () => {
  useEffect(() => { window.location.replace('/productos'); }, []);
  return <p>Cargando BY SELLENS…</p>;
};
export default Home;
