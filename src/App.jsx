
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/home';
import translations from './translations';


function App() {
  const [language, setLanguage]= useState("en");

  const t= translations[language];

  return (
    <>
      <Navbar 
        language={language}
        setLanguage={setLanguage}
        t={t}      
      />
      <Home 
        language={language}
        setLanguage={setLanguage}
        t={t}
      />
   </>
  )
}

export default App;
