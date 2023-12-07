function Image({imagePath}) {

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  return (
    <>
      <img src={baseUrl + imagePath} alt="Your Image" height={200} width={200}/>
    </>
  );
}

export default Image;
