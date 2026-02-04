import React from 'react'

function Construction() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#393330',
      color: '#fff',
      fontFamily: 'Montserrat, sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{
        fontSize: '80px',
        marginBottom: '20px'
      }}>
        🚧
      </div>
      <h1 style={{
        fontSize: '48px',
        fontWeight: '400',
        margin: '0 0 15px 0'
      }}>
        Under Construction
      </h1>
      <p style={{
        fontSize: '18px',
        color: '#aba39e',
        margin: '0'
      }}>
        We're working hard to bring you something amazing. Check back soon!
      </p>
    </div>
  )
}

export default Construction