import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { TwitterFollowCard } from './TwitterFollowCard'

function App() {
  const format= (username) => `@${username}`

  return (
    <section className="App">
      <TwitterFollowCard formatUserName={format}  userName="jperez"  initialIsFollowing >
        Juan Perez
      </TwitterFollowCard>
      <TwitterFollowCard formatUserName={format}  userName="lsuarez"  initialIsFollowing={false}>
        Lorena Suarez
      </TwitterFollowCard>
      <TwitterFollowCard formatUserName={format}  userName="lsuarez"   >
        J Suarez
      </TwitterFollowCard>
    </ section>
  )
}

export default App
