import axios from "axios";
import { useCallback, useEffect, useState, useId } from "react";

const Checkbox = ({ name, isChecked, onAddCategory, onRemoveCategory }) => {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{name}</label>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={isChecked ? onRemoveCategory : onAddCategory}
        name="categories"
        id={id}
      />
    </div>
  );
};

const AxiosPost = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [error, setError] = useState(null);
  const [modifiedData, setModifiedData] = useState({
    categories: [],
    description: "",
    name: "",
  });

  const handleInputChange = useCallback(({ target: { name, value } }) => {
    setModifiedData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post("http://localhost:1337/api/restaurants", { data: modifiedData })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        setError(error);
      });
  };

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/categories")
      .then(({ data }) => {
        setAllCategories(data.data);
        console.log(data.data);
      })
      .catch((error) => setError(error));
  }, []);

  if (error) {
    // Print errors if any
    return <div>An error occured: {error.message}</div>;
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <h3>Restaurants</h3>
        <br />
        <label>
          Name:
          <input
            type="text"
            name="name"
            onChange={handleInputChange}
            value={modifiedData.name}
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            name="description"
            onChange={handleInputChange}
            value={modifiedData.description}
          />
        </label>
        <div>
          <br />
          <b>Select categories</b>
          {allCategories.map(({ id, attributes }) => (
            <Checkbox
              key={id}
              name={attributes.name}
              isChecked={modifiedData.categories.includes(id)}
              onAddCategory={() => {
                const nextData = {
                  ...modifiedData,
                  categories: [...modifiedData.categories, id],
                };
                setModifiedData(nextData);
              }}
              onRemoveCategory={() => {
                const nextData = {
                  ...modifiedData,
                  categories: modifiedData.categories.filter(
                    (catId) => catId !== id
                  ),
                };
                setModifiedData(nextData);
              }}
            />
          ))}
        </div>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AxiosPost;