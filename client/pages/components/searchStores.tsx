import React, { useState, useEffect } from "react";
import { backend } from "./Constants";

interface Store {
  id: number;
  name: string;
  user: string;
  txtDescription: string;
}

const SearchStores: React.FC = () => {
  //React.useState<{name: string; user: string; image: string; description: string}[] | undefined>(users);
  const [text, setText] = React.useState("");

  const [userList, setUserList] = useState<Store[]>([]);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = () => {
    // Fetch ban requests from the backend
    fetch(`${backend}/store/all`)
      .then((res) => res.json())
      .then((data) => {
        setUserList(data);
        console.log(data);
      })
      .catch((error) => console.error("Error fetching stores:", error));
  };

  const handleOnClick = async () => {
    // Fetch all stores
    const response = await fetch(`${backend}/store/all`);
    if (!response.ok) {
      throw new Error("Failed to fetch stores.");
    }
    const storesData = await response.json();

    if (!text.trim()) {
      //if there is no text entered into search
      //setUserList(storesData);
      setUserList(storesData);
      return;
    }

    const filteredStores = userList.filter(
      (s) => s?.name.toLowerCase() === text.toLowerCase()
    );
    setUserList(filteredStores);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleOnClick();
    }
  };

  return (
    <div>
      <div className="input_wrapper"></div>
      <br />
      <div className="all-products flex">
        {userList.map((product) => (
          <div className="body_item">
            <a href="/stores/my-little-store">
              <p className="heading">{product.name}</p>
            </a>
            <p>Owned by: {product.user}</p>
            <p>{product.txtDescription}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchStores;
