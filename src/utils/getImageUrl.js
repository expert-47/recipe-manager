export const getImageUrl = (imageURl) => {
  const localhostPort = process.env.NEXT_PUBLIC_BACKEND_URL;
  return localhostPort + imageURl;
};
