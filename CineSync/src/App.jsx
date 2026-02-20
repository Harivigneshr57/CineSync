import Header from './components/Login-SignIn/Header'
import './App.css'
import Login from './components/Login-SignIn/Login'
import TrendingNow from './components/Login-SignIn/TrendingNow'
import FeatureComponent from './components/Login-SignIn/FeatureContainer'
import FAQ from './components/Login-SignIn/Faq'
import Footer from './components/Login-SignIn/Footer'
import { socket } from "./components/Home/socket";

function App() {
  socket.connect();

  return (
    <>
      <Header></Header>
      <Login></Login>
      <TrendingNow></TrendingNow>
      <FeatureComponent></FeatureComponent>
      <FAQ></FAQ>
      <Footer></Footer>
    </>
  )
}

export default App