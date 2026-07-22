import Header from "./components/Header.jsx";
import Main from "./components/Main.jsx";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <>
      <Header />
      <Main />
      <Analytics />
    </>
  );
}
