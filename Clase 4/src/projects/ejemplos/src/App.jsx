import './App.css'
import  Card from './Card.jsx'

function App() {
  const format= (username) => `@${username}`

  return (
    <section className='App'>
      <Card  userName="lee" formatUserName={format} > 
        Bruce Lee
      </Card>
      <Card  userName="juan" formatUserName={format}> 
        Juan Perez
      </Card>  
      
      <Card  userName="lau" formatUserName={format}> 
        L. Thompson
      </Card>
      <Card  userName="mati" formatUserName={format}> 
        Matías Pedraza
      </Card>


    </ section>
  )
}

export default App
