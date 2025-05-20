
//layout Components
import { NavBar } from '../../layout/navBar'
import Footer from '../../layout/footer'

//Components
import { LogoAndButton } from '../../components/LogoAndButton'
import { ModalTeacher } from '../../components/modalTeacher'
import { Containers } from '../../components/Container'

const About = () => {
  return (
    <div>
            <ModalTeacher isOpen="true" />
      

      <LogoAndButton/>
        <NavBar/>
        <Containers>

      <h1>من نحن</h1>
        </Containers>
        <Footer/>
    </div>
  )
}


export default About
