async function getData() {
  try {
    const response = await axios.get("http://localhost:3000/api/v1/healtcheck")
    console.log(response);

  } catch (error) {

  }
}
getData();