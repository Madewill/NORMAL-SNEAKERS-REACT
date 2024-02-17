import React from 'react'

const Header = () => {
  return (
    <>
    <div className="loader">
      <span>0%</span>
    </div>

    <header>
      <h1>Normal Sneakers</h1>

      <nav>
        <a href="#">About</a>
        <a href="#">Sizing</a>
        <a href="#" className="button">Buy</a>
      </nav>
    </header>
    </>
  )
}

export default Header