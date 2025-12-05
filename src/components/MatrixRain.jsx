import { useEffect, useState } from 'react'

const MatrixRain = () => {
  const [columns, setColumns] = useState([])

  useEffect(() => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const numColumns = Math.floor(window.innerWidth / 20)

    const newColumns = Array.from({ length: numColumns }, (_, i) => ({
      id: i,
      left: i * 20,
      delay: Math.random() * 10,
      duration: 5 + Math.random() * 10,
      chars: Array.from({ length: 30 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join('\n')
    }))

    setColumns(newColumns)
  }, [])

  return (
    <div className="matrix-bg">
      {columns.map(col => (
        <div
          key={col.id}
          className="matrix-column"
          style={{
            left: `${col.left}px`,
            animationDelay: `${col.delay}s`,
            animationDuration: `${col.duration}s`
          }}
        >
          {col.chars}
        </div>
      ))}
    </div>
  )
}

export default MatrixRain
