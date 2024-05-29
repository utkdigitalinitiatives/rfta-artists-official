export const getJsonByURI = async (uri) => {
  const response = await fetch(uri);
  if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
  const data = await response.json()
  return data
}
