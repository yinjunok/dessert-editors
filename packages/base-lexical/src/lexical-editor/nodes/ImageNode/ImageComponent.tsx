import { FC } from 'react'

const ImageComponent: FC<{
  src: string,
  alt: string
}> = ({ src, alt }) => {
  return (
    <img
      src={src}
      alt={alt}
      draggable="false"
    />
  )
}

export default ImageComponent
