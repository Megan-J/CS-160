import React from "react";

const searchStores: React.FC = () => {

    const users = [
        {
            name: 'Body Shop',
            user: 'alicesmith',
            image: '@/public/store_img/user1',
            description: 'Buy Rad Pop products!'
        },
        {
            name: 'Hard Rock Cafe',
            user: 'johndoe',
            image: '@/public/store_img/user3',
            description: 'Rock Your World, Dine with Soul'
        },
        {
            name: 'Bobity',
            user: 'johndoe',
            image: '@/public/store_img/user3',
            description: 'Rock Your World, Dine with Soul'
        },
        {
            name: 'Vintage Record',
            user: 'bobjohnson',
            image: 'user2',
            description: 'Get my custom vinyl records: SALE'
        }
    ]
    const [userList, setUserList] = React.useState<{name: string; user: string; image: string; description: string}[] | undefined>(users);
    const [text, setText] = React.useState('');

    const handleOnClick = () => {
        //make && if values are not hardcoded
        if (!text.trim()) { //if there is no text entered into search
            setUserList(users);
            return;
        }
        //filter and find
        //const findUsers = userList && userList?.length> 0 ? userList?.filter(u => u?.user.toLowerCase() == text) : undefined;
        const findUsers = userList && userList?.length > 0 ? userList?.filter(u => 
            u?.user.toLowerCase() == text|| 
            u?.name.toLowerCase() == text
        ) : undefined;
        setUserList(findUsers);
    }

    return (
        <div>
            <div className="input_wrapper">
                <input type="text" placeholder="Search Stores" value={text} onChange={e => setText(e.target.value)}/>
                <button disabled={!text} onClick={handleOnClick}>
                    Search</button>
            </div>
            <div className="body">
                {userList && userList?.length > 0 && userList.map(user =>{
                    return (
                        <div className="body_item">
                            <img src={user.image} alt={user?.name} />
                            <h3>Name: {user?.name}</h3>
                            <p>User: {user?.user}</p>
                            <p>Description: {user?.description}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default searchStores;