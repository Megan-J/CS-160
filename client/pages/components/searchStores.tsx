// FOR THE DEMO
import React from "react";

const searchStores: React.FC = () => {
  const users = [
    {
      name: "Body Shop",
      user: "alicesmith",
      image: "@/public/store_img/user1",
      description: "Buy Rad Pop products!",
    },
    {
      name: "Hard Rock Cafe",
      user: "johndoe",
      image: "@/public/store_img/user3",
      description: "Rock Your World, Dine with Soul",
    },
    {
      name: "Bobity",
      user: "johndoe",
      image: "@/public/store_img/user3",
      description: "Rock Your World, Dine with Soul",
    },
    {
      name: "Vintage Record",
      user: "bobjohnson",
      image: "user2",
      description: "Get my custom vinyl records: SALE",
    },
  ];
  const [userList, setUserList] = React.useState<
    | { name: string; user: string; image: string; description: string }[]
    | undefined
  >(users);
  const [text, setText] = React.useState("");

  const handleOnClick = () => {
    //make && if values are not hardcoded
    if (!text.trim()) {
      //if there is no text entered into search
      setUserList(users);
      return;
    }
    //filter and find
    //const findUsers = userList && userList?.length> 0 ? userList?.filter(u => u?.user.toLowerCase() == text) : undefined;
    const findUsers =
      userList && userList?.length > 0
        ? userList?.filter(
            (u) =>
              u?.user.toLowerCase() == text || u?.name.toLowerCase() == text
          )
        : undefined;
    setUserList(findUsers);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleOnClick();
    }
  };

  return (
    <div>
      <div className="input_wrapper">
        <input
          type="text"
          placeholder="Search Stores"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button disabled={!text} onClick={handleOnClick}>
          Search
        </button>
      </div>
      <div className="body">
        {userList &&
          userList?.length > 0 &&
          userList.map((user) => {
            return (
              <div className="body_item">
                <img src={user.image} alt={user?.name} />
                <h3>Name: {user?.name}</h3>
                <p>User: {user?.user}</p>
                <p>Description: {user?.description}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default searchStores;

/* 
ACTUAL WORKING WITH SQL CODE

import React, { useState, useEffect } from "react";

interface Store {
    id: number;
    name: string;
    user: string;
    txtDescription: string;
  }

const SearchStores: React.FC = () => {

    //React.useState<{name: string; user: string; image: string; description: string}[] | undefined>(users);
    const [text, setText] = React.useState('');

    const [userList, setUserList] = useState<Store[]>([]);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8080/store/all");
                if (!response.ok) {
                    throw new Error("Failed to fetch stores.");
                }
                const storesData = await response.json();
                setUserList(storesData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchStores();
    }, []);

    const handleOnClick = async () => {
         // Fetch all stores
         const response = await fetch("http://127.0.0.1:8080/store/all");
         if (!response.ok) {
          throw new Error("Failed to fetch stores.");
         }
         const storesData = await response.json();
    
        if (!text.trim()) { //if there is no text entered into search
            //setUserList(storesData);
            setUserList(storesData);
            return;
        }

        const filteredStores = userList.filter(s => s?.name.toLowerCase() === text.toLowerCase());
        setUserList(filteredStores);
        
        //filter and find
        //const findUsers = userList && userList?.length> 0 ? userList?.filter(u => u?.user.toLowerCase() == text) : undefined;
        // const findUsers = userList && userList?.length > 0 ? userList?.filter(u => 
        //     u?.user.toLowerCase() == text|| 
        //     u?.name.toLowerCase() == text
        // ) : undefined;
        // setUserList(findUsers);
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleOnClick();
        }
    };

    return (
        <div>
            <div className="input_wrapper">
                <input type="text" placeholder="Search Stores" value={text} onChange={e => setText(e.target.value)} onKeyPress={handleKeyPress}/>
                <button disabled={!text} onClick={handleOnClick}>
                    Search</button>
            </div>
            <div className="body">
                {userList.map((product) => (
                    <div className="body_item">
                     < a href="/stores/hardrockcafe" ><p>{product.name}</p></a>
                     <p>{product.user}</p>
                    <p>{product.txtDescription}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchStores;


*/
