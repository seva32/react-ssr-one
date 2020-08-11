/* eslint-disable react/prop-types */
import React from 'react';
import { Helmet } from 'react-helmet-async';

const favicon = 'favicon.ico';
const icon512 = './512.png';
const icon192 = './192.png';

// const isProd = process.env.NODE_ENV === 'production';

function Head({
  title = 'Sebastian Fantini',
  description = 'Sebastian Fantini developer',
  image = 'https://res.cloudinary.com/seva32/image/upload/v1594750007/logo192_xustlx.png',
  children,
}) {
  return (
    <Helmet>
      <meta name="author" content="Sebastian Fantini 2020" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="shortcut icon" href={favicon} type="image/x-icon" />
      <link rel="apple-touch-icon" sizes="512x512" href={icon512} />
      <link rel="apple-touch-icon" sizes="192x192" href={icon192} />
      <link rel="apple-touch-icon-precomposed" href={icon192} />
      <link rel="icon" sizes="192x192" href={icon192} />
      {description && <meta name="description" content={description} />}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      <link rel="manifest" href="/manifest.json" />
      {children && children}
      {title && <title>{title}</title>}
    </Helmet>
  );
}

export default Head;
